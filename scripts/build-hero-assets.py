#!/usr/bin/env python3
"""
Build seamless looping hero video assets, portrait still, and OpenGraph image
from a talking-head intro video shot on a light/white background.

Outputs:
  public/hero/hero.mp4        H.264 (yuv420p, CRF 24, slow, +faststart) + AAC 96k
  public/hero/hero.webm       VP9 (CRF 36) + Opus 80k
  public/portrait-bust.webp   480x600 head-to-shirt portrait crop
  public/og.jpg               1200x630 OpenGraph preview card

Usage:
  python scripts/build-hero-assets.py --input path/to/intro.mp4
  python scripts/build-hero-assets.py --input path/to/intro.mp4 --crop 832:1040:518:40
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont


REPO_ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = REPO_ROOT / "public"
HERO_DIR = PUBLIC_DIR / "hero"


def run(cmd: list[str], desc: str) -> None:
    print(f"[build-hero-assets] {desc}...")
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if proc.returncode != 0:
        print(proc.stderr, file=sys.stderr)
        raise RuntimeError(f"Command failed ({desc}): {' '.join(cmd)}")


def probe_video(video_path: Path) -> dict:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "quiet",
            "-print_format",
            "json",
            "-show_format",
            "-show_streams",
            str(video_path),
        ],
        text=True,
    )
    return json.loads(out)


def detect_crop_and_bg(video_path: Path) -> tuple[tuple[int, int, int, int], tuple[float, float, float]]:
    """Auto-detect tight 4:5 head-to-toe crop centered on the person and background white point."""
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open video: {video_path}")

    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    min_x, min_y, max_x, max_y = w, h, 0, 0
    idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if idx % 10 == 0:
            # Estimate smooth per-row background from flanking vertical strips
            l1, l2 = int(w * 0.25), int(w * 0.34)
            r1, r2 = int(w * 0.66), int(w * 0.75)
            bg_l = np.median(frame[:, l1:l2], axis=1, keepdims=True)
            bg_r = np.median(frame[:, r1:r2], axis=1, keepdims=True)
            bg_row = (bg_l + bg_r) / 2.0

            roi_x1, roi_x2 = l2, r1
            roi = frame[:, roi_x1:roi_x2].astype(np.float32)
            diff = np.linalg.norm(roi - bg_row, axis=2)
            mask = (diff > 22).astype(np.uint8)
            mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
            ys, xs = np.where(mask > 0)
            if len(xs) > 500:
                min_x = min(min_x, int(xs.min()) + roi_x1)
                max_x = max(max_x, int(xs.max()) + roi_x1)
                min_y = min(min_y, int(ys.min()))
                max_y = max(max_y, int(ys.max()))
        idx += 1

    # Compute 4:5 crop with generous headroom and footroom
    person_h = max(1, max_y - min_y)
    crop_h = min(h, int(round(person_h * 1.07)))
    crop_h = (crop_h // 8) * 8
    crop_w = int(round(crop_h * 0.8))
    crop_w = (crop_w // 8) * 8

    cx = (min_x + max_x) / 2.0
    cy = (min_y + max_y) / 2.0
    crop_x = int(round(cx - crop_w / 2.0))
    crop_y = int(round(cy - crop_h / 2.0))
    crop_x = max(0, min(w - crop_w, crop_x))
    crop_y = max(0, min(h - crop_h, crop_y))

    # Measure background RGB along left/right/top perimeter of the chosen crop
    cap.set(cv2.CAP_PROP_POS_FRAMES, min(60, max(0, idx // 2)))
    ret, sample = cap.read()
    cap.release()

    rimax = gimax = bimax = 0.98
    if ret:
        cropped = sample[crop_y : crop_y + crop_h, crop_x : crop_x + crop_w]
        border = np.concatenate(
            [
                cropped[40:-60, 0:48].reshape(-1, 3),
                cropped[40:-60, -48:].reshape(-1, 3),
                cropped[0:32, 80:-80].reshape(-1, 3),
            ],
            axis=0,
        )
        # BGR -> RGB 5th percentile so the entire studio backdrop reaches pure 255
        p5_bgr = np.percentile(border, 5, axis=0)
        b_max = float(np.clip((p5_bgr[0] - 2.0) / 255.0, 0.88, 0.98))
        g_max = float(np.clip((p5_bgr[1] - 2.0) / 255.0, 0.88, 0.98))
        r_max = float(np.clip((p5_bgr[2] - 2.0) / 255.0, 0.88, 0.98))
        rimax, gimax, bimax = round(r_max, 4), round(g_max, 4), round(b_max, 4)

    return (crop_w, crop_h, crop_x, crop_y), (rimax, gimax, bimax)


def build_seamless_audio(
    video_path: Path,
    wav_out: Path,
    clip_duration: float,
    fade_duration: float,
    sample_rate: int = 48000,
) -> None:
    """Extract PCM audio and cross-fade the last fade_duration into the first fade_duration in numpy."""
    cmd = [
        "ffmpeg",
        "-v",
        "error",
        "-i",
        str(video_path),
        "-f",
        "f32le",
        "-acodec",
        "pcm_f32le",
        "-ac",
        "2",
        "-ar",
        str(sample_rate),
        "-",
    ]
    raw = subprocess.check_output(cmd)
    audio = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)

    n_total = int(round(clip_duration * sample_rate))
    n_fade = int(round(fade_duration * sample_rate))
    if len(audio) < n_total:
        pad = np.zeros((n_total - len(audio), 2), dtype=np.float32)
        audio = np.vstack([audio, pad])
    else:
        audio = audio[:n_total]

    # Output length = clip_duration - fade_duration.
    # [0 .. L - D] plays source [D .. T - D]
    # [L - D .. L] cross-fades source tail [T - D .. T] into source head [0 .. D]
    # This aligns sample-for-sample with ffmpeg xfade(main=[D..T], head=[0..D], offset=T-2D).
    body = audio[n_fade : n_total - n_fade]
    tail = audio[n_total - n_fade : n_total]
    head = audio[0:n_fade]

    # Raised-cosine equal-gain cross-fade for click-free loop seam
    t = np.linspace(0.0, 1.0, n_fade, dtype=np.float32)
    w_in = (0.5 - 0.5 * np.cos(np.pi * t))[:, None]
    w_out = 1.0 - w_in
    seam = tail * w_out + head * w_in

    looped = np.vstack([body, seam])
    looped = np.clip(looped, -1.0, 1.0)
    pcm16 = (looped * 32767.0).astype(np.int16)

    with wave.open(str(wav_out), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm16.tobytes())

    print(
        f"[build-hero-assets] Seamless audio written: {len(looped) / sample_rate:.3f}s "
        f"({len(looped)} samples @ {sample_rate}Hz)"
    )


def pick_best_portrait_frame(video_path: Path, crop: tuple[int, int, int, int]) -> np.ndarray:
    """Select the clearest front-facing frame (preferring the calm opening smile frames)."""
    cap = cv2.VideoCapture(str(video_path))
    crop_w, crop_h, crop_x, crop_y = crop
    best_frame = None
    best_score = -1.0
    idx = 0

    # Check the opening 28 frames first (before speech begins, calm natural smile)
    while idx < 28:
        ret, frame = cap.read()
        if not ret:
            break
        face_roi = frame[
            crop_y + int(crop_h * 0.04) : crop_y + int(crop_h * 0.30),
            crop_x + int(crop_w * 0.25) : crop_x + int(crop_w * 0.75),
        ]
        gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
        score = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        if score > best_score:
            best_score = score
            best_frame = frame.copy()
        idx += 1

    cap.release()
    if best_frame is None:
        raise RuntimeError("Could not read any frames for portrait extraction.")
    return best_frame


def build_portrait_and_og(
    frame_bgr: np.ndarray,
    crop: tuple[int, int, int, int],
    levels: tuple[float, float, float],
) -> None:
    """Create 480x600 portrait-bust.webp and 1200x630 og.jpg."""
    crop_w, crop_h, crop_x, crop_y = crop
    rimax, gimax, bimax = levels

    # Apply matching colorlevels white-point lift in float RGB
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    rgb[:, :, 0] = np.clip(rgb[:, :, 0] / rimax, 0.0, 1.0)
    rgb[:, :, 1] = np.clip(rgb[:, :, 1] / gimax, 0.0, 1.0)
    rgb[:, :, 2] = np.clip(rgb[:, :, 2] / bimax, 0.0, 1.0)
    rgb_u8 = (rgb * 255.0).round().astype(np.uint8)

    # Head-to-shirt crop (4:5 aspect ratio -> 480x600)
    # Within the full-body crop, head starts ~4% down and shirt ends ~46% down.
    bust_h = int(round(crop_h * 0.44))
    bust_w = int(round(bust_h * 0.8))
    cx = crop_x + crop_w // 2
    bx1 = max(0, cx - bust_w // 2)
    by1 = max(0, crop_y + int(round(crop_h * 0.015)))
    bx2 = min(rgb_u8.shape[1], bx1 + bust_w)
    by2 = min(rgb_u8.shape[0], by1 + bust_h)

    bust_img = Image.fromarray(rgb_u8[by1:by2, bx1:bx2]).resize((480, 600), Image.Resampling.LANCZOS)
    portrait_path = PUBLIC_DIR / "portrait-bust.webp"
    bust_img.save(portrait_path, format="WEBP", quality=92, method=6)
    print(f"[build-hero-assets] Wrote {portrait_path} (480x600)")

    # Build 1200x630 OpenGraph preview image on warm paper (#f4f2ee)
    og = Image.new("RGB", (1200, 630), (244, 242, 238))
    draw = ImageDraw.Draw(og)

    # Multiply-blend full-body portrait onto the right side of the OG card
    full_crop = Image.fromarray(rgb_u8[crop_y : crop_y + crop_h, crop_x : crop_x + crop_w])
    target_h = 590
    target_w = int(round(target_h * 0.8))
    full_resized = np.asarray(full_crop.resize((target_w, target_h), Image.Resampling.LANCZOS), dtype=np.float32) / 255.0

    og_arr = np.asarray(og, dtype=np.float32) / 255.0
    px, py = 1200 - target_w - 48, 30
    region = og_arr[py : py + target_h, px : px + target_w]
    og_arr[py : py + target_h, px : px + target_w] = region * full_resized
    og = Image.fromarray((og_arr * 255.0).round().astype(np.uint8))
    draw = ImageDraw.Draw(og)

    # Subtle framing hairline
    draw.rectangle([28, 28, 1172, 602], outline=(218, 215, 208), width=1)

    # Try loading local Inter Tight / system sans for OG text
    font_candidates = [
        REPO_ROOT / "src" / "fonts" / "InterTight-Variable.ttf",
        Path("C:/Windows/Fonts/arialbd.ttf"),
        Path("C:/Windows/Fonts/segoeui.ttf"),
    ]
    font_bold = None
    font_reg = None
    for candidate in font_candidates:
        if candidate.exists():
            try:
                font_bold = ImageFont.truetype(str(candidate), 68)
                font_reg = ImageFont.truetype(str(candidate), 26)
                font_mono = ImageFont.truetype(str(candidate), 20)
                break
            except Exception:
                continue
    if font_bold is None:
        font_bold = ImageFont.load_default()
        font_reg = ImageFont.load_default()
        font_mono = ImageFont.load_default()

    draw.text((76, 84), "PORTFOLIO  ·  2026", fill=(119, 117, 111), font=font_mono)
    draw.text((76, 178), "Vedant", fill=(13, 13, 13), font=font_bold)
    draw.text((76, 256), "Mendhule", fill=(13, 13, 13), font=font_bold)
    draw.text((76, 360), "AI & Prompt Engineer", fill=(58, 58, 58), font=font_reg)
    draw.text((76, 404), "Prompt Engineering · Generative AI · Full-Stack ML", fill=(119, 117, 111), font=font_mono)
    draw.text((76, 532), "officialvedant19@gmail.com", fill=(119, 117, 111), font=font_mono)

    og_path = PUBLIC_DIR / "og.jpg"
    og.save(og_path, format="JPEG", quality=90, optimize=True)
    print(f"[build-hero-assets] Wrote {og_path} (1200x630)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build seamless looping hero video & still assets.")
    parser.add_argument("--input", required=True, help="Path to source intro video (.mp4 or .mov)")
    parser.add_argument("--crop", default=None, help="Optional explicit ffmpeg crop W:H:X:Y")
    parser.add_argument("--duration", type=float, default=10.0, help="Seconds of source clip to use (default: 10.0)")
    parser.add_argument("--fade", type=float, default=0.5, help="Cross-fade duration in seconds (default: 0.5)")
    parser.add_argument("--white", type=float, default=None, help="Override colorlevels imax (e.g. 0.94 or 0.98)")
    args = parser.parse_args()

    video_path = Path(args.input).resolve()
    if not video_path.exists():
        raise FileNotFoundError(f"Input video not found: {video_path}")

    HERO_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    meta = probe_video(video_path)
    src_dur = float(meta["format"]["duration"])
    clip_dur = min(args.duration, src_dur)
    fade_dur = args.fade
    offset = round(clip_dur - 2.0 * fade_dur, 6)

    auto_crop, auto_levels = detect_crop_and_bg(video_path)
    if args.crop:
        parts = [int(p) for p in args.crop.split(":")]
        if len(parts) != 4:
            raise ValueError("--crop must be formatted as W:H:X:Y")
        crop = (parts[0], parts[1], parts[2], parts[3])
    else:
        crop = auto_crop

    if args.white is not None:
        levels = (args.white, args.white, args.white)
    else:
        levels = auto_levels

    crop_w, crop_h, crop_x, crop_y = crop
    rimax, gimax, bimax = levels
    print(f"[build-hero-assets] Source duration: {src_dur:.3f}s -> loop: {clip_dur - fade_dur:.3f}s")
    print(f"[build-hero-assets] Crop: {crop_w}:{crop_h}:{crop_x}:{crop_y} -> scale 768:960")
    print(f"[build-hero-assets] Background colorlevels imax: R={rimax}, G={gimax}, B={bimax}")

    with tempfile.TemporaryDirectory() as tmpdir:
        tmp = Path(tmpdir)
        seamless_wav = tmp / "seamless.wav"
        build_seamless_audio(video_path, seamless_wav, clip_dur, fade_dur, sample_rate=48000)

        # Build filter_complex:
        # 1) Crop head-to-toe, scale to 768x960, whiten backdrop with colorlevels, enforce 30fps
        # 2) Split into [main] (fade_dur .. clip_dur) and [head] (0 .. fade_dur)
        # 3) xfade tail of [main] into [head] at offset = clip_dur - 2*fade_dur
        base_vf = (
            f"fps=30,"
            f"crop={crop_w}:{crop_h}:{crop_x}:{crop_y},"
            f"scale=768:960:flags=lanczos,"
            f"colorlevels=rimax={rimax}:gimax={gimax}:bimax={bimax},"
            f"setsar=1"
        )
        filter_complex = (
            f"[0:v]{base_vf},split=2[v1][v2];"
            f"[v1]trim=start={fade_dur:.6f}:end={clip_dur:.6f},setpts=PTS-STARTPTS[main];"
            f"[v2]trim=start=0:end={fade_dur:.6f},setpts=PTS-STARTPTS[head];"
            f"[main][head]xfade=transition=fade:duration={fade_dur:.6f}:offset={offset:.6f},format=yuv420p[vout]"
        )

        # Render lossless/high-quality intermediate once so MP4 and WebM encode from identical frames
        master_mp4 = HERO_DIR / "hero.mp4"
        run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(video_path),
                "-i",
                str(seamless_wav),
                "-filter_complex",
                filter_complex,
                "-map",
                "[vout]",
                "-map",
                "1:a",
                "-c:v",
                "libx264",
                "-pix_fmt",
                "yuv420p",
                "-crf",
                "24",
                "-preset",
                "slow",
                "-c:a",
                "aac",
                "-b:a",
                "96k",
                "-ar",
                "48000",
                "-movflags",
                "+faststart",
                "-shortest",
                str(master_mp4),
            ],
            "Encoding hero.mp4 (H.264 + AAC)",
        )

        master_webm = HERO_DIR / "hero.webm"
        run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(video_path),
                "-i",
                str(seamless_wav),
                "-filter_complex",
                filter_complex,
                "-map",
                "[vout]",
                "-map",
                "1:a",
                "-c:v",
                "libvpx-vp9",
                "-pix_fmt",
                "yuv420p",
                "-crf",
                "36",
                "-b:v",
                "0",
                "-deadline",
                "good",
                "-cpu-used",
                "2",
                "-row-mt",
                "1",
                "-c:a",
                "libopus",
                "-b:a",
                "80k",
                "-ar",
                "48000",
                "-shortest",
                str(master_webm),
            ],
            "Encoding hero.webm (VP9 + Opus)",
        )

        # Save frame 0 of the finished loop as a lightweight instant-LCP poster
        cap_out = cv2.VideoCapture(str(master_mp4))
        ok, frame0 = cap_out.read()
        cap_out.release()
        if ok:
            poster_path = HERO_DIR / "hero-poster.webp"
            Image.fromarray(cv2.cvtColor(frame0, cv2.COLOR_BGR2RGB)).save(
                poster_path, format="WEBP", quality=84, method=6
            )
            print(f"[build-hero-assets] Wrote {poster_path} (768x960)")

    best_frame = pick_best_portrait_frame(video_path, crop)
    build_portrait_and_og(best_frame, crop, levels)

    print("[build-hero-assets] Done!")
    for p in [HERO_DIR / "hero.mp4", HERO_DIR / "hero.webm", PUBLIC_DIR / "portrait-bust.webp", PUBLIC_DIR / "og.jpg"]:
        if p.exists():
            print(f"  {p.relative_to(REPO_ROOT)}: {p.stat().st_size / 1024:.1f} KiB")


if __name__ == "__main__":
    main()

