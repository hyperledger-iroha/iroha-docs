# Translation generation

English pages are the source for the 20 checked-in locale trees. The generator
supports Bing Translator, Google Translate, and a local NLLB-200 process. A
release build never contacts a translation provider.

Generated prose is only a starting point. A complete update must compare every
changed page with its English source, repair terminology and idiom, and pass the
script, English-leakage, ratio, link-label, and structural audits below. The
`machine-validated` frontmatter status records those repository checks; it is
not a claim that unreviewed provider output is publication-ready.

## Bing Translator

Bing is the preferred provider for full regeneration of the 16 maintained
locales whose corpus probes remain within the expected writing systems:

```bash
pnpm translate --provider=bing --locale=fr
```

Use a comma-separated locale list or omit `--locale` to select the approved
set: `es`, `pt`, `fr`, `ru`, `ar`, `ur`, `ja`, `he`, `az`, `kk`, `ba`, `am`,
`uz`, `mn`, `zh-hant`, and `zh-hans`. Myanmar, Georgian, and Armenian corpus
probes reproducibly introduced unrelated writing systems, so the CLI rejects
Bing for `my`, `ka`, and `hy`; use the guarded local NLLB path for those three.
Dzongkha is deliberately excluded because Bing exposes Tibetan, not Dzongkha;
never label Tibetan output as `dz`.

The provider sends paragraph-scale Markdown units with code, identifiers,
commands, URLs, protocol literals, and stable anchors protected. Before a
request, ambiguous software and blockchain terms are expanded into an
unambiguous sense. The generator rejects lost placeholders, private-use marker
leaks, unexpected writing systems, changed example identities, localized-link
target drift, added or lost backtick/code spans, heading or container drift,
prose-unit drift, and changed literal blocks. Each locale is built in a
same-filesystem staging directory and replaces the checked-in tree only after
all pages succeed.

## Local NLLB-200 fallback

Use Python 3.9 or newer, install the pinned translation environment, and
download the int8 CTranslate2 conversion used by the offline fallback:

```bash
python3.9 -m venv .venv-translate
.venv-translate/bin/pip install -r etc/requirements-translate.txt
.venv-translate/bin/hf download \
  osa911/nllb-200-distilled-600M-ct2-int8 \
  --revision 46858753dbaf8eb5e21bb6f0037c3b90851e090a \
  --local-dir .cache/nllb-200-distilled-600M-ct2
```

Generate the three locales assigned to the local provider:

```bash
pnpm translate --provider=nllb \
  --python=.venv-translate/bin/python \
  --model=.cache/nllb-200-distilled-600M-ct2 \
  --locale=my,ka,hy
```

The local provider is also useful when an offline, reproducible focused pass is
required, but low-resource-language output needs especially close page-by-page
review.
Do not treat a successful NLLB run as semantic validation. The Node generator
keeps one Python JSONL subprocess alive, and the Python process loads CTranslate2 and
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

Use `pnpm translate --sync-structure` to synchronize both heading anchors and
VitePress container keywords after a generator or renderer change. This
mechanical mode does not send prose to a translation provider.

When a page audit adds or revises an entry in the curated exact-translation
map, apply only those reviewed prose units with:

```bash
pnpm translate --sync-reviewed --locale=uz
```

This mode aligns English and localized prose units, validates every replacement
against its source unit, and leaves all surrounding translation text unchanged.
Use it for deterministic review fixes instead of retranslating an otherwise
approved page.

When a source-aware normalization rule is added for a recurring machine
translation defect, apply that rule to existing source-aligned prose with:

```bash
pnpm translate --normalize-existing --locale=am
```

This mechanical mode protects code and other technical literals, validates the
Markdown structure of each changed unit, and does not contact a translation
provider.

`--locale` and `--route` can narrow that mechanical update in the same way as a
normal generation run.

## Google Translate

Google remains available for focused updates and is the network provider that
supports Dzongkha (`dz`):

```bash
pnpm translate --provider=google --locale=dz --concurrency=1
```

The provider is `google` by default. Its public endpoint may throttle bulk
generation, especially when Markdown protection requires many fragment
requests. Use bounded concurrency, retain the prior tree when a run fails, and
manually review every generated Dzongkha unit.

After generation, inspect every changed page against English and run:

```bash
pnpm validate:i18n
pnpm validate:i18n-audit
pnpm exec tsx etc/audit-i18n-scripts.ts --english-leakage
pnpm exec tsx etc/audit-i18n-scripts.ts --ratios
pnpm exec tsx etc/audit-i18n-scripts.ts --high-ratios
pnpm test -- etc/translate.spec.ts
pnpm typecheck
```

All unexpected-script, untranslated-English-run, and untranslated-link-label
findings are release blockers. Review leakage and ratio reports individually;
allow only source-required product names and technical literals, never generic
English prose.
