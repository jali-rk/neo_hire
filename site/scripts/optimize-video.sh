#!/usr/bin/env bash
# Turns a source film (CLO 3D export or AI-generated clip) into web-ready files
# for the 3D studio section:
#   public/video/fit-on.mp4         H.264, 1080×1350 (4:5), no audio, fast start
#   public/video/fit-on.webm        VP9, smaller, for browsers that support it
#   public/video/fit-on-poster.jpg  first frame, shown before the film loads
#
# Usage (from the site/ folder; needs ffmpeg, e.g. `brew install ffmpeg`):
#   pnpm video path/to/source.mp4
# Then set CONFIG.fitOnVideo in src/content.ts:
#   { src: 'video/fit-on.mp4', webm: 'video/fit-on.webm', poster: 'video/fit-on-poster.jpg' }
set -euo pipefail

src="${1:?Usage: pnpm video path/to/source.mp4}"
out="public/video"
mkdir -p "$out"

# Fill a 1080×1350 frame (crop the excess from the centre), 30 fps.
vf="scale=1080:1350:force_original_aspect_ratio=increase,crop=1080:1350,fps=30"

ffmpeg -y -loglevel error -i "$src" -vf "$vf" -an \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -crf 24 -movflags +faststart \
  "$out/fit-on.mp4"

ffmpeg -y -loglevel error -i "$src" -vf "$vf" -an \
  -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -deadline good \
  "$out/fit-on.webm"

ffmpeg -y -loglevel error -i "$out/fit-on.mp4" -frames:v 1 -q:v 3 "$out/fit-on-poster.jpg"

ls -lh "$out"
echo "Done. Aim for under ~6 MB for the MP4; if it's larger, raise -crf (e.g. 26) or shorten the clip."
