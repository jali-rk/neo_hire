#!/usr/bin/env bash
# Turns a source film (CLO 3D export or AI-generated clip) into web-ready files
# for the 3D studio section:
#   public/video/fit-on.mp4         H.264, no audio, fast start
#   public/video/fit-on.webm        VP9, smaller, for browsers that support it
#   public/video/fit-on-poster.jpg  first frame, shown before the film loads
#
# The film keeps its own shape (e.g. 9:16) and is never upscaled; height is capped at 1920.
#
# Usage (from the site/ folder; needs ffmpeg, e.g. `brew install ffmpeg`):
#   pnpm video path/to/source.mp4 [--boomerang] [--hold 0.8] [--start 0.5] [--end 7.5]
#     --boomerang  play forward, hold on the last frame, then play backward: a seamless loop
#                  for clips whose first and last frames differ
#     --hold S     seconds to hold on the last frame in a boomerang (default 0.8)
#     --start S / --end S  trim the source first
# Then set CONFIG.fitOnVideo in src/content.ts (the script prints the values).
set -euo pipefail

src=""; boomerang=0; hold="0.8"; start=""; end=""
while [ $# -gt 0 ]; do
  case "$1" in
    --boomerang) boomerang=1 ;;
    --hold) hold="$2"; shift ;;
    --start) start="$2"; shift ;;
    --end) end="$2"; shift ;;
    *) src="$1" ;;
  esac
  shift
done
[ -n "$src" ] || { echo "Usage: pnpm video path/to/source.mp4 [--boomerang] [--hold 0.8] [--start S] [--end S]"; exit 1; }

out="public/video"
mkdir -p "$out"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

trim=()
[ -n "$start" ] && trim+=(-ss "$start")
[ -n "$end" ] && trim+=(-to "$end")

# Keep the aspect ratio, cap the height at 1920, never upscale, even dimensions.
base="scale=-2:'min(ih,1920)':flags=lanczos,format=yuv420p"
if [ "$boomerang" = 1 ]; then
  graph="[0:v]${base},split[f][b];[b]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[r];[f]tpad=stop_mode=clone:stop_duration=${hold}[fh];[fh][r]concat=n=2:v=1:a=0[v]"
else
  graph="[0:v]${base}[v]"
fi

# High-quality intermediate, then the two web encodes from it.
ffmpeg -y -loglevel error ${trim[@]+"${trim[@]}"} -i "$src" -filter_complex "$graph" -map "[v]" -an \
  -c:v libx264 -crf 12 -preset slow "$tmp/master.mp4"

ffmpeg -y -loglevel error -i "$tmp/master.mp4" -an \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -crf 23 -movflags +faststart \
  "$out/fit-on.mp4"

ffmpeg -y -loglevel error -i "$tmp/master.mp4" -an \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good \
  "$out/fit-on.webm"

ffmpeg -y -loglevel error -i "$out/fit-on.mp4" -frames:v 1 -q:v 3 "$out/fit-on-poster.jpg"

dims="$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$out/fit-on.mp4")"
dur="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out/fit-on.mp4")"
w="${dims%x*}"; h="${dims#*x}"
ls -lh "$out"
echo
echo "Video: ${w}×${h}, ${dur}s"
echo "Set in src/content.ts:"
echo "  fitOnVideo: { src: 'video/fit-on.mp4', webm: 'video/fit-on.webm', poster: 'video/fit-on-poster.jpg', width: ${w}, height: ${h} },"
if [ "$h" -lt 1080 ]; then
  echo
  echo "Note: ${h}px tall is low for a sharp result. Regenerate at 1080p (or at least 720p) if you can."
fi
