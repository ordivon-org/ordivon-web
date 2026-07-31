#!/usr/bin/env python3
"""Generate one static Open Graph PNG per registered article.

The parser intentionally reads the public registry rather than maintaining a second
social-card manifest. Rendering uses rsvg-convert so the committed assets work on
static hosting without request-time image generation.
"""

from __future__ import annotations

import html
import re
import subprocess
import tempfile
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "content/articles/registry.ts"
OUTPUT = ROOT / "public/og"
SIZE = (1200, 630)


def extract_articles() -> list[dict[str, str]]:
    source = REGISTRY.read_text(encoding="utf-8")
    slug_matches = list(re.finditer(r'"slug"\s*:\s*"([^"]+)"', source))
    articles: list[dict[str, str]] = []
    for index, match in enumerate(slug_matches):
        segment = source[match.start() : slug_matches[index + 1].start() if index + 1 < len(slug_matches) else len(source)]
        article = {"slug": match.group(1)}
        for field in ("title", "deck", "type", "project"):
            field_match = re.search(rf'"{field}"\s*:\s*"([^"]+)"', segment)
            if not field_match:
                raise RuntimeError(f"{article['slug']} is missing {field}")
            article[field] = field_match.group(1)
        articles.append(article)
    return articles


def wrap(value: str, width: int, limit: int) -> list[str]:
    lines = textwrap.wrap(value, width=width, break_long_words=False, break_on_hyphens=False)
    if len(lines) > limit:
        lines = lines[:limit]
        lines[-1] = lines[-1].rstrip(" .,:;—-") + "…"
    return lines


def tspans(lines: list[str], x: int, first_y: int, line_height: int) -> str:
    return "".join(
        f'<tspan x="{x}" y="{first_y + index * line_height}">{html.escape(line)}</tspan>'
        for index, line in enumerate(lines)
    )


def render_svg(article: dict[str, str]) -> str:
    title = article["title"]
    title_size = 78 if len(title) <= 42 else 68 if len(title) <= 62 else 58
    title_width = 28 if title_size >= 78 else 33 if title_size >= 68 else 39
    title_lines = wrap(title, title_width, 3)
    title_y = 236 if len(title_lines) == 3 else 270 if len(title_lines) == 2 else 310
    title_height = int(title_size * 1.02)
    deck_y = title_y + len(title_lines) * title_height + 34
    deck_lines = wrap(article["deck"], 76, 3)

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{SIZE[0]}" height="{SIZE[1]}" viewBox="0 0 {SIZE[0]} {SIZE[1]}">
  <defs>
    <radialGradient id="glow" cx="82%" cy="18%" r="58%">
      <stop offset="0" stop-color="#514b86" stop-opacity=".72"/>
      <stop offset="1" stop-color="#111620" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#9187ff"/>
      <stop offset="1" stop-color="#9187ff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#111620"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <path d="M890 0 L1200 0 L1200 630 L1050 630 Z" fill="#171d29" opacity=".46"/>
  <path d="M64 128 H1136" stroke="#343a47"/>
  <path d="M64 554 H1136" stroke="#343a47"/>
  <rect x="67" y="59" width="19" height="19" fill="none" stroke="#9187ff" stroke-width="3" transform="rotate(45 76.5 68.5)"/>
  <text x="104" y="79" fill="#f2f0eb" font-family="Adwaita Sans, Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="3">ORDIVON</text>
  <text x="1136" y="78" text-anchor="end" fill="#aaa7b2" font-family="Adwaita Sans, Arial, sans-serif" font-size="18" letter-spacing="2">{html.escape(article['type'].upper())}</text>
  <rect x="64" y="155" width="190" height="4" fill="url(#rule)"/>
  <text fill="#f2f0eb" font-family="Adwaita Sans, Arial, sans-serif" font-size="{title_size}" font-weight="650" letter-spacing="-2.2">{tspans(title_lines, 64, title_y, title_height)}</text>
  <text fill="#c9c6d0" font-family="Adwaita Sans, Arial, sans-serif" font-size="25" font-weight="400">{tspans(deck_lines, 66, deck_y, 34)}</text>
  <text x="64" y="594" fill="#aaa7b2" font-family="Adwaita Sans, Arial, sans-serif" font-size="17" letter-spacing="1.4">{html.escape(article['project'].upper())}</text>
  <text x="1136" y="594" text-anchor="end" fill="#b8b2ff" font-family="Adwaita Sans, Arial, sans-serif" font-size="17" letter-spacing="1">ORDIVON.COM/WRITING/{html.escape(article['slug'].upper())}</text>
</svg>'''


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    articles = extract_articles()
    expected = {f"{article['slug']}.png" for article in articles}
    for stale in OUTPUT.glob("*.png"):
        if stale.name not in expected:
            stale.unlink()

    with tempfile.TemporaryDirectory(prefix="ordivon-og-") as temporary:
        temporary_path = Path(temporary)
        for article in articles:
            svg_path = temporary_path / f"{article['slug']}.svg"
            png_path = OUTPUT / f"{article['slug']}.png"
            svg_path.write_text(render_svg(article), encoding="utf-8")
            subprocess.run(
                ["rsvg-convert", "--width", str(SIZE[0]), "--height", str(SIZE[1]), "--output", str(png_path), str(svg_path)],
                check=True,
            )
            print(f"generated {png_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
