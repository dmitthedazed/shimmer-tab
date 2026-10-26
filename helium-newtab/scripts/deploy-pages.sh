#!/bin/sh
# Builds the plain web page and commits it to the gh-pages branch (via a temporary
# worktree, so the working tree is left alone). `--push` also pushes it to origin.
set -e
cd "$(dirname "$0")/.."
pnpm build:web
touch dist-web/.nojekyll

tree=$(mktemp -d)
trap 'git worktree remove --force "$tree"' EXIT
if git rev-parse -q --verify refs/heads/gh-pages >/dev/null; then
    git worktree add -q "$tree" gh-pages
else
    git worktree add -q --orphan -b gh-pages "$tree"
fi

find "$tree" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r dist-web/. "$tree"
git -C "$tree" add -A
git -C "$tree" diff --cached --quiet || git -C "$tree" commit -qm "Pages build from $(git rev-parse --short HEAD)"
[ "$1" = "--push" ] && git -C "$tree" push -q origin gh-pages
git log -1 --oneline gh-pages
