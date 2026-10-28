#!/usr/bin/env bash
# Turns the recorded clips (previews/clips/*.mp4) into the README's GIFs (previews/gifs/*.gif):
# 560 px wide, 12.5 fps, one palette per clip. Usage: scripts/clips-to-gifs.sh [clip...]
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
IN=$ROOT/previews/clips
OUT=$ROOT/previews/gifs
mkdir -p "$OUT"

clips=("$@")
[ ${#clips[@]} -gt 0 ] || clips=($(cd "$IN" && ls *.mp4 | sed 's/\.mp4$//'))

for name in "${clips[@]}"; do
    [ "$name" = settings ] && continue # the settings clip is only for the video; README shows a still
    ffmpeg -loglevel error -y -i "$IN/$name.mp4" \
        -vf "fps=12.5,scale=560:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
        -loop 0 "$OUT/$name.gif"
    echo "$name: $(du -h "$OUT/$name.gif" | cut -f1)"
done
