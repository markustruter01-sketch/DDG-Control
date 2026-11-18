#!/bin/sh
# Transpile the liquid from source and patch the preview build again (11 -> 12).
set -e
cd /home/claude/ddg-control/artifacts/ddg-control/site/canyon
/opt/npm-tools/node_modules/.bin/esbuild liquid.ts --format=esm --target=es2020 --outfile=/tmp/tp/liquid.js --log-level=error
cd /home/claude/preview && git checkout -q index.html
python3 /home/claude/tests/patch12.py /home/claude/preview 11 12 /tmp/tp/liquid.js
cp assets/Stage-ddg12.js /tmp/tp/chk.mjs && node --check /tmp/tp/chk.mjs && echo SYNTAX_OK
