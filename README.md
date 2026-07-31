# Hyperledger Iroha Documentation

This is the canonical repository for the public, in-depth documentation for
Hyperledger Iroha 3. The production site is
[docs.iroha.tech](https://docs.iroha.tech/).

The [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha)
repository is the implementation source of truth. Generated references in this
repository are checked in and tied to an exact source commit in
[`provenance/iroha.json`](provenance/iroha.json). Normal installs and builds do
not fetch an Iroha branch or require a sibling checkout.

## Development

Use Node.js 24 and pnpm 9:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Build and preview the production site:

```bash
pnpm build
pnpm serve
```

Vercel publishes `main` at the domain root for `docs.iroha.tech`. The GitHub
Actions workflow also builds with `/iroha-docs/` as its public path and
publishes the `gh-pages` backup. Domain ownership and routing are managed in
the hosting and DNS control planes, so do not add a checked-in `CNAME` file.

## Validation

Run the same focused checks used by CI:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm validate
pnpm build
pnpm cli validate-links .vitepress/dist
```

`pnpm validate:i18n` requires every English route in all 20 maintained
translations. Each translated page records its source route, source SHA-256,
locale, and honest `machine-validated` status in frontmatter.

For a release-wide regeneration, use the local NLLB-200 provider. Create its
isolated Python 3.9 environment and download the int8 CTranslate2 conversion:

```bash
python3.9 -m venv .venv-translate
.venv-translate/bin/pip install -r etc/requirements-translate.txt
.venv-translate/bin/hf download \
  osa911/nllb-200-distilled-600M-ct2-int8 \
  --revision 46858753dbaf8eb5e21bb6f0037c3b90851e090a \
  --local-dir .cache/nllb-200-distilled-600M-ct2
```

Then regenerate every maintained locale from the final English sources and
validate the result:

```bash
pnpm translate --provider=nllb \
  --python=.venv-translate/bin/python \
  --model=.cache/nllb-200-distilled-600M-ct2
pnpm validate:i18n
```

Use `--locale=fr,ja` for a selected comma-separated set and
`--concurrency=4` to tune bounded translation requests. Google remains the
default provider and can be selected explicitly with `--provider=google` for a
focused update, but local NLLB is the recommended all-locale path. See
[`etc/TRANSLATION.md`](etc/TRANSLATION.md) for implementation details.

The separately downloaded
[`facebook/nllb-200-distilled-600M`](https://huggingface.co/facebook/nllb-200-distilled-600M)
checkpoint is published by Meta under
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/), which does not
permit commercial use. The local setup uses the
[`osa911` int8 CTranslate2 conversion](https://huggingface.co/osa911/nllb-200-distilled-600M-ct2-int8)
of that checkpoint. Neither model is redistributed by this repository; review
their model cards and license before downloading or using them.

## Refresh Generated Iroha References

Refreshing references is an explicit maintainer operation:

```bash
pnpm refresh:iroha --source /path/to/iroha
pnpm validate:provenance
```

The source checkout must contain the commit pinned in
`provenance/iroha.json`. Generated schema and CLI references require that exact
commit in a clean checkout. Copy-only artifacts are read from the pinned Git
tree. The refresh updates checked-in artifacts and their SHA-256 values; review
all resulting diffs.

The pinned commit must also be fetchable from the public Iroha repository. If a
local source commit has not been published yet, every artifact remains
`pending-public-source-commit` and the manifest records
`awaiting-public-source-commit`. This is an explicit incomplete state, not a
successful public refresh. After the commit is published, rerun the refresh
from a clean checkout to mark the artifacts `current`.

## Optional Site Configuration

- `VITE_FEEDBACK_URL` enables the feedback form submission target.
- `VITE_COMPAT_MATRIX_URL` overrides the checked-in SDK capability snapshot.

## License

Documentation is available under the Creative Commons Attribution 4.0
International License (CC-BY-4.0). See [LICENSE](LICENSE).
