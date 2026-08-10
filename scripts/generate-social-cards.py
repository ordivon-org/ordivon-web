#!/usr/bin/env python3
"""Generate one static Open Graph PNG per registered article.

The parser reads each article metadata export rather than maintaining a second
social-card manifest. Rendering uses rsvg-convert so the committed assets work on
static hosting without request-time image generation.
"""

from __future__ import annotations

import hashlib
import html
import inspect
import json
import re
import subprocess
import tempfile
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARTICLE_DIRECTORY = ROOT / "content/articles"
OUTPUT = ROOT / "public/og"
BINDINGS = ROOT / "scripts/social-card-bindings.json"
SIZE = (1200, 630)


def extract_articles() -> list[dict[str, str]]:
    articles: list[dict[str, str]] = []
    prefix = "export const metadata = "
    for path in sorted(ARTICLE_DIRECTORY.glob("*.mdx")):
        source = path.read_text(encoding="utf-8")
        start = source.find(prefix)
        end = source.find(";\n", start + len(prefix))
        if start < 0 or end < 0:
            raise RuntimeError(f"{path.name} has no parseable metadata export")
        metadata = json.loads(source[start + len(prefix):end])
        articles.append({field: metadata[field] for field in ("slug", "title", "deck", "type", "project")})
    return articles


def wrap(value: str, width: int, limit: int) -> list[str]:
    lines = textwrap.wrap(value, width=width, break_long_words=True, break_on_hyphens=False)
    if len(lines) > limit:
        lines = lines[:limit]
        lines[-1] = lines[-1].rstrip(" .,:;—-") + "…"
    return lines


def compact(value: str, limit: int) -> str:
    if len(value) <= limit:
        return value
    return value[: limit - 1].rstrip(" .,:;—-/") + "…"


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
    type_label = compact(article["type"].upper(), 32)
    project_label = compact(article["project"].upper(), 32)
    slug_label = compact(article["slug"].upper(), 40)

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
  <text x="1136" y="78" text-anchor="end" fill="#aaa7b2" font-family="Adwaita Sans, Arial, sans-serif" font-size="18" letter-spacing="2">{html.escape(type_label)}</text>
  <rect x="64" y="155" width="190" height="4" fill="url(#rule)"/>
  <text fill="#f2f0eb" font-family="Adwaita Sans, Arial, sans-serif" font-size="{title_size}" font-weight="650" letter-spacing="-2.2">{tspans(title_lines, 64, title_y, title_height)}</text>
  <text fill="#c9c6d0" font-family="Adwaita Sans, Arial, sans-serif" font-size="25" font-weight="400">{tspans(deck_lines, 66, deck_y, 34)}</text>
  <text x="64" y="594" fill="#aaa7b2" font-family="Adwaita Sans, Arial, sans-serif" font-size="17" letter-spacing="1.4">{html.escape(project_label)}</text>
  <text x="1136" y="594" text-anchor="end" fill="#b8b2ff" font-family="Adwaita Sans, Arial, sans-serif" font-size="17" letter-spacing="1">ORDIVON.COM/WRITING/{html.escape(slug_label)}</text>
</svg>'''


def sha256_bytes(value: bytes) -> str:
    return "sha256:" + hashlib.sha256(value).hexdigest()


def article_source_digest(article: dict[str, str]) -> str:
    canonical = json.dumps(article, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return sha256_bytes(canonical)


def renderer_digest() -> str:
    source = "\n".join(
        [
            repr(SIZE),
            inspect.getsource(wrap),
            inspect.getsource(compact),
            inspect.getsource(tspans),
            inspect.getsource(render_svg),
        ]
    ).encode("utf-8")
    return sha256_bytes(source)


def bindings_document(articles: list[dict[str, str]], output: Path) -> dict[str, object]:
    cards = []
    for article in articles:
        path = output / f"{article['slug']}.png"
        payload = path.read_bytes()
        cards.append(
            {
                "slug": article["slug"],
                "sourceDigest": article_source_digest(article),
                "blobDigest": sha256_bytes(payload),
                "sizeBytes": len(payload),
            }
        )
    return {
        "schemaVersion": 1,
        "kind": "ordivon.web-social-card-bindings",
        "rendererDigest": renderer_digest(),
        "cards": cards,
    }


def write_bindings(articles: list[dict[str, str]], output: Path) -> None:
    BINDINGS.write_text(
        json.dumps(bindings_document(articles, output), indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def generate_cards(output: Path, *, prune_stale: bool, announce: bool) -> list[Path]:
    output.mkdir(parents=True, exist_ok=True)
    articles = extract_articles()
    expected = {f"{article['slug']}.png" for article in articles}
    if prune_stale:
        for stale in output.glob("*.png"):
            if stale.name not in expected:
                stale.unlink()

    generated: list[Path] = []
    with tempfile.TemporaryDirectory(prefix="ordivon-og-svg-") as temporary:
        temporary_path = Path(temporary)
        for article in articles:
            svg_path = temporary_path / f"{article['slug']}.svg"
            png_path = output / f"{article['slug']}.png"
            svg_path.write_text(render_svg(article), encoding="utf-8")
            subprocess.run(
                ["rsvg-convert", "--width", str(SIZE[0]), "--height", str(SIZE[1]), "--output", str(png_path), str(svg_path)],
                check=True,
            )
            generated.append(png_path)
            if announce:
                print(f"generated {png_path.relative_to(ROOT)}")
    if output == OUTPUT:
        write_bindings(articles, output)
    return generated


def read_bindings() -> dict[str, object]:
    if not BINDINGS.is_file():
        raise SystemExit(f"social card check failed:\n- missing binding receipt: {BINDINGS.relative_to(ROOT)}")
    try:
        document = json.loads(BINDINGS.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as error:
        raise SystemExit(f"social card check failed:\n- unreadable binding receipt: {error}") from error
    if document.get("schemaVersion") != 1 or document.get("kind") != "ordivon.web-social-card-bindings":
        raise SystemExit("social card check failed:\n- unsupported binding receipt identity")
    return document


def check_cards() -> None:
    articles = extract_articles()
    document = read_bindings()
    failures: list[str] = []
    if document.get("rendererDigest") != renderer_digest():
        failures.append("social card renderer changed without regenerating bindings")

    raw_cards = document.get("cards")
    if not isinstance(raw_cards, list):
        failures.append("binding receipt cards must be an array")
        raw_cards = []
    bindings = {item.get("slug"): item for item in raw_cards if isinstance(item, dict) and isinstance(item.get("slug"), str)}
    if len(bindings) != len(raw_cards):
        failures.append("binding receipt contains duplicate or malformed card entries")
    articles_by_slug = {article["slug"]: article for article in articles}
    expected_names = {f"{slug}.png" for slug in articles_by_slug}
    actual_names = {path.name for path in OUTPUT.glob("*.png")}
    failures += [f"missing committed card: {name}" for name in sorted(expected_names - actual_names)]
    failures += [f"stale committed card: {name}" for name in sorted(actual_names - expected_names)]
    failures += [f"missing binding: {slug}" for slug in sorted(set(articles_by_slug) - set(bindings))]
    failures += [f"stale binding: {slug}" for slug in sorted(set(bindings) - set(articles_by_slug))]

    for slug, article in articles_by_slug.items():
        binding = bindings.get(slug)
        if not isinstance(binding, dict):
            continue
        expected_source = article_source_digest(article)
        if binding.get("sourceDigest") != expected_source:
            failures.append(f"article metadata changed without regenerating social card: {slug}.png")
        path = OUTPUT / f"{slug}.png"
        if path.is_file():
            payload = path.read_bytes()
            if binding.get("blobDigest") != sha256_bytes(payload) or binding.get("sizeBytes") != len(payload):
                failures.append(f"committed card bytes do not match binding: {slug}.png")
    if failures:
        raise SystemExit("social card check failed:\n- " + "\n- ".join(failures))
    print(f"social_card_check=passed cards={len(articles)} renderer=bound")


def verify_rendered_cards() -> None:
    with tempfile.TemporaryDirectory(prefix="ordivon-og-verify-") as temporary:
        generated_root = Path(temporary) / "generated"
        generated = generate_cards(generated_root, prune_stale=False, announce=False)
        failures = []
        for generated_path in generated:
            committed_path = OUTPUT / generated_path.name
            if not committed_path.is_file():
                failures.append(f"missing committed card: {generated_path.name}")
            elif generated_path.read_bytes() != committed_path.read_bytes():
                failures.append(f"rendered bytes differ from committed card: {generated_path.name}")
        if failures:
            raise SystemExit("social card render verification failed:\n- " + "\n- ".join(failures))
        print(f"social_card_render_verify=passed cards={len(generated)}")


def write_review_sheets(output: Path) -> None:
    import base64

    check_cards()
    cards = [ROOT / "public" / "opengraph-image.png", *sorted(OUTPUT.glob("*.png"))]
    missing = [path for path in cards if not path.is_file()]
    if missing:
        raise SystemExit("social card review failed: missing input: " + ", ".join(str(path.relative_to(ROOT)) for path in missing))

    output.mkdir(parents=True, exist_ok=True)
    for stale in output.glob("sheet-*.png"):
        stale.unlink()
    cell_width, image_height, label_height, gap, columns, per_sheet = 400, 210, 28, 16, 2, 10
    with tempfile.TemporaryDirectory(prefix="ordivon-og-review-") as temporary:
        temporary_path = Path(temporary)
        for sheet_number, start in enumerate(range(0, len(cards), per_sheet), 1):
            group = cards[start : start + per_sheet]
            rows = (len(group) + columns - 1) // columns
            width = columns * cell_width + (columns + 1) * gap
            height = rows * (image_height + label_height) + (rows + 1) * gap
            parts = [
                f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
                '<rect width="100%" height="100%" fill="#080b10"/>',
            ]
            for index, card in enumerate(group):
                row, column = divmod(index, columns)
                x = gap + column * (cell_width + gap)
                y = gap + row * (image_height + label_height + gap)
                encoded = base64.b64encode(card.read_bytes()).decode("ascii")
                label = "root" if card.name == "opengraph-image.png" and card.parent.name == "public" else card.stem
                parts.append(f'<image x="{x}" y="{y}" width="{cell_width}" height="{image_height}" href="data:image/png;base64,{encoded}"/>')
                parts.append(f'<text x="{x}" y="{y + image_height + 19}" fill="#d7dce5" font-family="Adwaita Mono, monospace" font-size="13">{html.escape(label)}</text>')
            parts.append("</svg>")
            svg_path = temporary_path / f"sheet-{sheet_number}.svg"
            png_path = output / f"sheet-{sheet_number}.png"
            svg_path.write_text("".join(parts), encoding="utf-8")
            subprocess.run(["rsvg-convert", "--output", str(png_path), str(svg_path)], check=True)
    print(f"social_card_review=ready cards={len(cards)} sheets={(len(cards) + per_sheet - 1) // per_sheet} scale=400x210 output={output}")


def main() -> None:
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--check", action="store_true", help="verify source, renderer identity, binding receipt, and committed PNG bytes without rendering")
    mode.add_argument("--verify-render", action="store_true", help="re-render every card and exact-compare committed PNG bytes; requires rsvg-convert")
    mode.add_argument("--review-dir", type=Path, help="write 400x210 contact sheets for Agent perceptual review; requires rsvg-convert and makes no semantic judgment")
    args = parser.parse_args()
    if args.check:
        check_cards()
    elif args.verify_render:
        verify_rendered_cards()
    elif args.review_dir:
        write_review_sheets(args.review_dir)
    else:
        generate_cards(OUTPUT, prune_stale=True, announce=True)


if __name__ == "__main__":
    main()
