#!/usr/bin/env python3
"""Copy the DDG Finance main dashboard into ddg.limited as a display-only showcase.

Usage: python3 scripts/vendor-finance-showcase.py /path/to/quant-terminal

Copies the Home page and what it needs from quant-terminal/artifacts/dashboard/src into
artifacts/ddg-control/live-finance/src/finance, rewrites the "@/..." imports to relative ones (ddg-control
uses "@" for its own src), and leaves our own files (main.tsx, snapshot client, showcase.css) alone.
The trading API client is replaced by live-finance/src/snapshot.ts: every GET is answered from the public
snapshot (/api/public/finance-showcase), and nothing can be sent. Run it again when the Finance home changes.
"""
import os, re, shutil, sys

QT = sys.argv[1] if len(sys.argv) > 1 else '../quant-terminal'
SRC = os.path.join(QT, 'artifacts/dashboard/src')
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DST = os.path.join(HERE, 'artifacts/ddg-control/live-finance/src/finance')
FILES = [
    'pages/HomePage.tsx', 'components/Shell.tsx', 'components/FlipPages.tsx', 'components/FleetV1.tsx', 'components/LeagueCards.tsx',
    'hooks/useFleetData.ts', 'hooks/use-fleet-v1.ts', 'hooks/use-portfolio.ts', 'hooks/use-bot-history.ts',
    'hooks/use-report.ts', 'hooks/use-visibility.ts', 'lib/bot-identity.ts',
    'styles/night-glass.css', 'styles/night-glass/tokens.css', 'styles/night-glass/dusk.css',
]
if os.path.isdir(DST): shutil.rmtree(DST)
for f in FILES:
    src, dst = os.path.join(SRC, f), os.path.join(DST, f)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    text = open(src, encoding='utf-8').read()
    if f.endswith(('.ts', '.tsx')):
        here = os.path.dirname(f)
        def rel(m):
            target = m.group(2)
            # The trading API client is ours (snapshot only), one level up from finance/.
            if target in ('hooks/use-trading-client',):
                r = os.path.relpath('../snapshot', here)
            else:
                r = os.path.relpath(target, here)
            if not r.startswith('.'): r = './' + r
            return f'{m.group(1)}{r}{m.group(3)}'
        text = re.sub(r'''(from\s+["'])@/([^"']+)(["'])''', rel, text)
        text = re.sub(r'''(from\s+["'])\./use-trading-client(["'])''', lambda m: f'{m.group(1)}../../snapshot{m.group(2)}', text)
        # ddg-control has no lucide-react: the few icons come from live-finance/src/icons.tsx.
        text = re.sub(r'''(from\s+["'])lucide-react(["'])''', lambda m: f'{m.group(1)}{os.path.relpath("../icons", here)}{m.group(2)}', text)
        text = '// Copied from quant-terminal/artifacts/dashboard/src by scripts/vendor-finance-showcase.py. Do not edit here.\n' + text
    open(dst, 'w', encoding='utf-8').write(text)
print('copied', len(FILES), 'files to', DST)
