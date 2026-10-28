#!/usr/bin/env bash
# Rebuilds previews/settings.png (light on top, dark below) from the real extension.
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
APP=$ROOT/helium-newtab
WORK=$(mktemp -d)
trap 'kill $(jobs -p) 2>/dev/null; rm -rf "$WORK"' EXIT

pnpm -C "$APP" build >/dev/null
POINTER=primaryPointerType=4,availablePointerTypes=4,primaryHoverType=2,availableHoverTypes=2
shots() { # theme, extra flags...
    local theme=$1; shift
    /opt/helium-browser-bin/helium --headless=new --user-data-dir="$WORK/profile-$theme" --no-first-run \
        --load-extension="$APP/dist" --disable-extensions-except="$APP/dist" \
        --remote-debugging-port=9333 --window-size=1288,730 --hide-scrollbars \
        --use-gl=angle --use-angle=gl-egl --ignore-gpu-blocklist "$@" about:blank >/dev/null 2>&1 &
    local pid=$!
    sleep 4
    node "$ROOT/scripts/settings-shots.mjs" "$WORK" "$theme"
    kill $pid; wait $pid 2>/dev/null || true
}
shots dark --force-dark-mode --blink-settings=preferredColorScheme=0,$POINTER
shots light --blink-settings=preferredColorScheme=1,$POINTER

python3 - "$WORK" "$ROOT/previews/settings.png" <<'PY'
import sys
from PIL import Image
work, out = sys.argv[1:]
sheet = Image.new("RGB", (1760, 1280))
for row, theme in enumerate(["light", "dark"]):
    for col in range(4):
        sheet.paste(Image.open(f"{work}/{theme}-{col}.png").convert("RGB"), (col * 440, row * 640))
sheet.save(out, optimize=True)
PY
