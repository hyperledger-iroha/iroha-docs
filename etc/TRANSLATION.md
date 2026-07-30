# Translation generation

English pages are the source for the 20 checked-in locale trees. The generator
supports Google Translate for small updates and a local NLLB-200 process for
full regeneration. A release build never contacts either provider.

## Local NLLB-200

Use Python 3.9 or newer, install the pinned translation environment, and
convert Meta's official distilled NLLB-200 model to CTranslate2 once:

```bash
python3.9 -m venv .venv-translate
.venv-translate/bin/pip install -r etc/requirements-translate.txt
.venv-translate/bin/ct2-transformers-converter \
  --model facebook/nllb-200-distilled-600M \
  --output_dir .cache/nllb-200-distilled-600M-ct2 \
  --quantization int8
```

Generate one locale while iterating:

```bash
pnpm translate --provider=nllb \
  --python=.venv-translate/bin/python \
  --model=.cache/nllb-200-distilled-600M-ct2 \
  --locale=fr
```

Omit `--locale` for the release-wide regeneration. The Node generator keeps
one Python JSONL subprocess alive, and the Python process loads CTranslate2 and
the official `facebook/nllb-200-distilled-600M` Transformers tokenizer once.
The model only receives natural-language fragments: Markdown markers,
newlines, code fences, links, URLs, and protected technical terms are
reassembled byte-for-byte outside NLLB.

## Google Translate

Google remains available for focused updates:

```bash
pnpm translate --provider=google --locale=fr
```

The provider is `google` by default. Public endpoints may throttle bulk
generation, so use local NLLB for deterministic release work.

After generation, inspect the diff and run:

```bash
pnpm validate:i18n
pnpm test -- etc/translate.spec.ts
pnpm typecheck
```
