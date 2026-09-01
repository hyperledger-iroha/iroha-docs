#!/usr/bin/env python3
"""Persistent JSONL bridge from the docs generator to CTranslate2 NLLB-200."""

import argparse
import json
import sys
import traceback
from typing import Any, Dict, List

import ctranslate2
from opencc import OpenCC
from transformers import AutoTokenizer


SOURCE_LANGUAGE = "eng_Latn"
OFFICIAL_TOKENIZER = "facebook/nllb-200-distilled-600M"
OFFICIAL_TOKENIZER_REVISION = "f8d333a098d19b4fd9a8b18f94170487ad3f821d"
MIN_DECODING_LENGTH = 32
MAX_DECODING_LENGTH = 1024
TARGET_TOKEN_EXPANSION = 4
TARGET_LANGUAGES = {
    "spa_Latn",
    "por_Latn",
    "fra_Latn",
    "rus_Cyrl",
    "arb_Arab",
    "urd_Arab",
    "jpn_Jpan",
    "heb_Hebr",
    "mya_Mymr",
    "kat_Geor",
    "hye_Armn",
    "azj_Latn",
    "kaz_Cyrl",
    "bak_Cyrl",
    "amh_Ethi",
    "dzo_Tibt",
    "uzn_Latn",
    "khk_Cyrl",
    "zho_Hans",
    "zho_Hant",
}


def parse_args() -> argparse.Namespace:
    """Parse process configuration while keeping stdin for JSONL requests."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", required=True, help="Path to a converted CTranslate2 NLLB-200 model")
    parser.add_argument(
        "--tokenizer",
        default=OFFICIAL_TOKENIZER,
        help="Official Transformers tokenizer name or local snapshot",
    )
    parser.add_argument("--device", default="auto", help="CTranslate2 device (default: auto)")
    parser.add_argument("--compute-type", default="default", help="CTranslate2 compute type")
    return parser.parse_args()


def validate_request(payload: Any) -> Dict[str, Any]:
    """Validate one JSON request and return it with a stable shape."""
    if not isinstance(payload, dict):
        raise ValueError("request must be a JSON object")
    request_id = payload.get("id")
    target_language = payload.get("target_language")
    texts = payload.get("texts")
    if not isinstance(request_id, int):
        raise ValueError("request id must be an integer")
    if target_language not in TARGET_LANGUAGES:
        raise ValueError("unsupported NLLB target language: {0}".format(target_language))
    if not isinstance(texts, list) or not all(isinstance(text, str) for text in texts):
        raise ValueError("texts must be an array of strings")
    return {
        "id": request_id,
        "target_language": target_language,
        "texts": texts,
    }


class NllbTranslator:
    """Translate batches with one loaded CTranslate2 model and official tokenizer."""

    def __init__(self, model: str, tokenizer_name: str, device: str, compute_type: str) -> None:
        self.translator = ctranslate2.Translator(model, device=device, compute_type=compute_type)
        self.tokenizer = AutoTokenizer.from_pretrained(
            tokenizer_name,
            revision=OFFICIAL_TOKENIZER_REVISION,
            src_lang=SOURCE_LANGUAGE,
        )
        self.traditional_chinese = OpenCC("s2t")

    def translate(self, texts: List[str], target_language: str) -> List[str]:
        """Translate a batch in input order."""
        if not texts:
            return []
        source_tokens = [
            self.tokenizer.convert_ids_to_tokens(self.tokenizer.encode(text))
            for text in texts
        ]
        longest_source = max(len(tokens) for tokens in source_tokens)
        decoding_length = min(
            MAX_DECODING_LENGTH,
            max(MIN_DECODING_LENGTH, longest_source * TARGET_TOKEN_EXPANSION + 16),
        )
        model_target_language = "zho_Hans" if target_language == "zho_Hant" else target_language
        target_prefix = [[model_target_language] for _ in texts]
        results = self.translator.translate_batch(
            source_tokens,
            target_prefix=target_prefix,
            batch_type="tokens",
            max_batch_size=2048,
            beam_size=4,
            coverage_penalty=0.1,
            max_input_length=1024,
            max_decoding_length=decoding_length,
            no_repeat_ngram_size=4,
            repetition_penalty=1.1,
        )
        translations = []
        for source, result in zip(source_tokens, results):
            target_tokens = result.hypotheses[0]
            if target_tokens and target_tokens[0] == model_target_language:
                target_tokens = target_tokens[1:]
            if len(source) >= 20 and len(target_tokens) < len(source) * 0.25:
                raise RuntimeError(
                    "translation output is materially shorter than its source "
                    "({0} target tokens for {1} source tokens)".format(
                        len(target_tokens),
                        len(source),
                    )
                )
            token_ids = self.tokenizer.convert_tokens_to_ids(target_tokens)
            translation = self.tokenizer.decode(
                token_ids,
                skip_special_tokens=True,
                clean_up_tokenization_spaces=False,
            )
            if target_language == "zho_Hant":
                translation = self.traditional_chinese.convert(translation)
            translations.append(translation)
        return translations


def write_response(payload: Dict[str, Any]) -> None:
    """Write one response without allowing library logs onto stdout."""
    sys.stdout.write(json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n")
    sys.stdout.flush()


def main() -> None:
    """Load the model once and serve translation requests until stdin closes."""
    args = parse_args()
    translator = NllbTranslator(args.model, args.tokenizer, args.device, args.compute_type)

    for line in sys.stdin:
        request_id = None
        try:
            raw_request = json.loads(line)
            if isinstance(raw_request, dict):
                request_id = raw_request.get("id")
            request = validate_request(raw_request)
            translations = translator.translate(request["texts"], request["target_language"])
            write_response({"id": request["id"], "translations": translations})
        except Exception as error:  # noqa: BLE001 - errors must cross the JSONL process boundary
            traceback.print_exc(file=sys.stderr)
            write_response({"id": request_id, "error": str(error)})


if __name__ == "__main__":
    main()
