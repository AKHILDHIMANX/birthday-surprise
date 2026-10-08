#!/usr/bin/env python3
"""Strip every <text> / badge out of the placeholder SVGs.

The old placeholders had a white caption, a gold star and a filename baked in —
that is what bled through .scene__veil as "faint white writing". After this they
are just clean gradient plates, so nothing reads through the scene veil.
Run again any time:  python3 clean-placeholders.py
"""
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
IMG = HERE / "assets" / "media" / "images"

PALETTE = [
    ("#c98a2e", "#f0c46a"), ("#d94f76", "#f5a2b8"), ("#6f52c9", "#a991ee"),
    ("#1f9c7d", "#78dcc4"), ("#2f6fd0", "#8ab6f5"), ("#c2571f", "#f0a268"),
]

SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" role="img" aria-label="placeholder photo">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{a}"/><stop offset="100%" stop-color="{b}"/>
    </linearGradient>
    <radialGradient id="v" cx="50%" cy="40%" r="75%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#140b16" stop-opacity=".5"/>
    </radialGradient>
    <filter id="s"><feGaussianBlur stdDeviation="60"/></filter>
  </defs>
  <rect width="800" height="1000" fill="url(#g)"/>
  <g filter="url(#s)" opacity=".5">
    <circle cx="{cx}" cy="{cy}" r="220" fill="#fffaf1" opacity=".35"/>
    <circle cx="{dx}" cy="{dy}" r="260" fill="#140b16" opacity=".25"/>
  </g>
  <rect width="800" height="1000" fill="url(#v)"/>
</svg>
"""


def main() -> int:
    files = sorted(IMG.glob("*.svg"))
    for i, f in enumerate(files):
        a, b = PALETTE[i % len(PALETTE)]
        f.write_text(
            SVG.format(a=a, b=b,
                       cx=140 + (i * 97) % 520, cy=200 + (i * 143) % 600,
                       dx=660 - (i * 71) % 500, dy=860 - (i * 119) % 620),
            encoding="utf-8",
        )
    print(f"cleaned {len(files)} placeholders (no text, no star)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
