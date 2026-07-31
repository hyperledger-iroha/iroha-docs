# Translation generation

English pages are the source for the 20 checked-in locale trees. The generator
supports Google Translate for small updates and a local NLLB-200 process for
full regeneration. A release build never contacts either provider.

## Local NLLB-200

Use Python 3.9 or newer, install the pinned translation environment, and
download the int8 CTranslate2 conversion used for release generation:

```bash
python3.9 -m venv .venv-translate
.venv-translate/bin/pip install -r etc/requirements-translate.txt
.venv-translate/bin/hf download \
  osa911/nllb-200-distilled-600M-ct2-int8 \
  --revision 46858753dbaf8eb5e21bb6f0037c3b90851e090a \
  --local-dir .cache/nllb-200-distilled-600M-ct2
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
The model weights come from the
[`osa911` int8 conversion](https://huggingface.co/osa911/nllb-200-distilled-600M-ct2-int8)
of Meta's [NLLB-200 checkpoint](https://huggingface.co/facebook/nllb-200-distilled-600M).
The download command pins conversion commit
`46858753dbaf8eb5e21bb6f0037c3b90851e090a`; the bridge pins the official
tokenizer to commit `f8d333a098d19b4fd9a8b18f94170487ad3f821d`.
The checkpoint and conversion are separately licensed under CC BY-NC 4.0 and
are not redistributed here.

Each complete locale tree is generated in a same-filesystem staging directory
and swapped into `src/` only after every page succeeds. The generator also
rechecks the English route inventory, page bytes, and relative component
dependencies before each swap. Required local Vue components are copied beside
the translated page. If an English page or component changes during a run, the
previous locale tree remains in place and the run fails with an explicit
restart instruction.
The model receives paragraph-scale Markdown chunks so soft-wrapped prose keeps
its full sentence context. Markdown markers, newlines, code fences, links,
URLs, protocol acronyms, CamelCase identifiers, bare domain/file-style names,
and the maintained product/tool glossary are replaced with tokenizer-safe
identifier markers and reassembled byte-for-byte outside NLLB. The generator
rejects output that drops or duplicates any marker. The local bridge bounds
each decoded chunk relative to its source length and blocks repeated four-token
ngrams, preventing low-resource target languages from filling the fixed
decoder ceiling with repeated text. Traditional Chinese is generated from the
complete Simplified Chinese NLLB output with the pinned OpenCC converter,
because the distilled model's direct `zho_Hant` decoder can terminate clauses
early.

For a focused English update, pass one or more source-relative routes. Focused
generation replaces only those pages and keeps the rest of each locale tree:

```bash
pnpm translate --provider=nllb \
  --python=.venv-translate/bin/python \
  --model=.cache/nllb-200-distilled-600M-ct2 \
  --route=guide/tutorials/python.md,blockchain/permissions.md
```

Translated headings receive explicit IDs derived from the English VitePress
slugs. This keeps fragment links stable across scripts and prevents localized
heading text from changing public anchors. To synchronize those IDs into
existing translations without sending prose to a translation provider, run:

```bash
pnpm translate --sync-anchors
```

`--locale` and `--route` can narrow that mechanical update in the same way as a
normal generation run.

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
