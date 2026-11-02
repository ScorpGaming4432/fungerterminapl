"""Rebuild translation_status.txt by detecting non-English JSON text."""

from __future__ import annotations

import argparse
import json
from collections.abc import Iterator
from pathlib import Path
from typing import Any

try:
    from langdetect import DetectorFactory, detect_langs
    from langdetect.lang_detect_exception import LangDetectException
except ImportError as error:
    raise SystemExit(
        "Language detection requires langdetect. Install it with "
        "'python -m pip install -r requirements.txt'."
    ) from error

IGNORED_FILES = {'Actors.json', 'Animations.json', 'Tilesets.json', 'MapInfos.json'}

ROOT = Path(__file__).resolve().parent
TEXT_FIELDS = {
    "description",
    "nickname",
    "profile",
    "message1",
    "message2",
    "message3",
    "message4",
    "message5",
    "currencyUnit",
    "gameTitle",
    "title",
}
TEXT_SECTIONS = {"terms", "messages"}
LANGUAGE_CONFIDENCE = 0.80
LONG_TEXT_MIN_LETTERS = 24
LONG_TEXT_MIN_WORDS = 4
SHORT_TEXT_LANGUAGE = "pl"

DetectorFactory.seed = 0


def event_text(code: int, parameters: list[Any]) -> Iterator[str]:
    """Yield visible text from RPG Maker event commands."""
    if code in (401, 405) and parameters:
        if isinstance(parameters[0], str):
            yield parameters[0]
    elif code == 102 and parameters and isinstance(parameters[0], list):
        yield from (choice for choice in parameters[0] if isinstance(choice, str))
    elif code == 402 and len(parameters) > 1 and isinstance(parameters[1], str):
        yield parameters[1]
    elif code in (320, 324, 325) and len(parameters) > 1:
        if isinstance(parameters[1], str):
            yield parameters[1]


def extract_text(value: Any, in_text_section: bool = False) -> Iterator[str]:
    """Extract likely player-facing text without counting plugin commands or metadata."""
    if isinstance(value, dict):
        code = value.get("code")
        parameters = value.get("parameters")
        if isinstance(code, int) and isinstance(parameters, list):
            yield from event_text(code, parameters)
            return

        has_id = "id" in value and "pages" not in value
        for key, child in value.items():
            if isinstance(child, str):
                if key in TEXT_FIELDS or (key == "name" and has_id) or in_text_section:
                    yield child
            else:
                yield from extract_text(child, in_text_section or key in TEXT_SECTIONS)
    elif isinstance(value, list):
        for child in value:
            yield from extract_text(child, in_text_section)
    elif isinstance(value, str) and in_text_section:
        yield value


def is_non_english(text: str, cache: dict[str, bool]) -> bool:
    text = text.strip()
    if not text:
        return False
    if text not in cache:
        try:
            detections = detect_langs(text)
        except LangDetectException:
            cache[text] = False
        else:
            if not detections or detections[0].lang == "en":
                cache[text] = False
            else:
                detection = detections[0]
                letters = sum(character.isalpha() for character in text)
                words = sum(any(character.isalpha() for character in word) for word in text.split())
                cache[text] = detection.prob >= LANGUAGE_CONFIDENCE and (
                    detection.lang == SHORT_TEXT_LANGUAGE
                    or (
                        letters >= LONG_TEXT_MIN_LETTERS
                        and words >= LONG_TEXT_MIN_WORDS
                        and detection.prob >= 0.95
                    )
                )
    return cache[text]


def update_status(data_dir: Path, output_path: Path) -> tuple[int, int]:
    if not data_dir.is_dir():
        raise FileNotFoundError(f"JSON data directory does not exist: {data_dir}")

    json_files = sorted(data_dir.rglob("*.json"))
    if not json_files:
        raise FileNotFoundError(f"No JSON files found in: {data_dir}")

    cache: dict[str, bool] = {}
    lines: list[str] = []
    total_translated = 0
    total_texts = 0

    for json_path in json_files:
        if json_path.name in IGNORED_FILES: continue
        
        with json_path.open(encoding="utf-8-sig") as file:
            data = json.load(file)

        texts = list(extract_text(data))
        translated = sum(is_non_english(text, cache) for text in texts)
        total = len(texts)
        total_translated += translated
        total_texts += total
        percent = translated / total * 100 if total else 0.0
        lines.append(f"{json_path.name}: {translated}/{total} translated ({percent:.2f}%)")

    total_percent = total_translated / total_texts * 100 if total_texts else 0.0
    lines.extend(
        [
            "",
            "=== TOTAL ===",
            f"Total: {total_translated}/{total_texts} translated ({total_percent:.2f}%)",
        ]
    )
    output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return total_translated, total_texts


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Detect non-English player-facing text in JSON files and update translation_status.txt."
    )
    parser.add_argument("--data-dir", type=Path, default=ROOT / "data")
    parser.add_argument("--output", type=Path, default=ROOT / "translation_status.txt")
    args = parser.parse_args()

    translated, total = update_status(args.data_dir, args.output)
    print(f"Updated {args.output}: {translated}/{total} translated.")


if __name__ == "__main__":
    main()