# Contributing to Hyperledger Iroha Documentation

Thank you for improving the official Hyperledger Iroha 3 documentation
published at [docs.iroha.tech](https://docs.iroha.tech/).

Verify behavior against the current
[`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha)
implementation, its defaults, schemas, and tests. This is a first-release
documentation set: replace incorrect material directly instead of adding
historical comparisons, migration pages, or legacy redirects.

## Development Environment

Use Node.js 24 and pnpm 9:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Installation is deterministic and does not download Iroha source or regenerate
checked-in references.

## Writing and Translation

- Put public and in-depth documentation in the relevant `src/` section.
- Add pages to VitePress navigation when readers need them there.
- Prefer relative links for documentation routes and reproducible command
  examples.
- Keep examples, identifiers, URLs, configuration names, ABI details, and wire
  formats exact.
- Update all maintained locale routes with the English source. Translation
  frontmatter must satisfy the contract documented in [README.md](README.md).
- Do not use an English page as a locale fallback.

For a release-wide regeneration, prepare the recommended local NLLB-200
provider once:

```bash
python3.9 -m venv .venv-translate
.venv-translate/bin/pip install -r etc/requirements-translate.txt
.venv-translate/bin/hf download \
  osa911/nllb-200-distilled-600M-ct2-int8 \
  --revision 46858753dbaf8eb5e21bb6f0037c3b90851e090a \
  --local-dir .cache/nllb-200-distilled-600M-ct2
```

Regenerate and validate all maintained locale trees with:

```bash
pnpm translate --provider=nllb \
  --python=.venv-translate/bin/python \
  --model=.cache/nllb-200-distilled-600M-ct2
pnpm validate:i18n
```

Use `--locale=<codes>` only for focused iteration. Google remains available as
the default provider or explicitly through `--provider=google`, but local NLLB
is the recommended all-locale path. More detail is in
[`etc/TRANSLATION.md`](etc/TRANSLATION.md).

The local model is Meta's
[`facebook/nllb-200-distilled-600M`](https://huggingface.co/facebook/nllb-200-distilled-600M),
licensed separately under
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). That license
does not permit commercial use. The setup downloads the
[`osa911` int8 CTranslate2 conversion](https://huggingface.co/osa911/nllb-200-distilled-600M-ct2-int8);
neither model is redistributed here. Review both model cards and the license
before use.

## Generated References

A scheduled workflow opens a pull request whenever a newer verified Iroha
commit is available. Review those pull requests like source changes and update
any prose that the regenerated references contradict. Commits you push to that
pull request keep it in place; later refreshes comment instead of replacing it.

Pages also cite Iroha source at the pinned commit, and every cookbook recipe
must cite it. Once the cookbook and the other citing pages are correct at the
new pin, in English and every translation, move their citations:

```bash
pnpm move:iroha-citations --source /path/to/iroha
```

It refuses while any cited path is missing at the pin. A translation's source
hash follows its English page only if the translation was current before.

Maintainers can also refresh locally from a clean Iroha checkout of the
selected commit:

```bash
pnpm select:iroha
pnpm refresh:iroha --source /path/to/iroha --pin <commit> --ref <ref>
pnpm validate:provenance
```

The refresh writes checked-in snippets and public OpenAPI data, updates their
SHA-256 provenance, and records the pin. It refuses a commit whose signature
GitHub does not verify, or one that is not reachable from the tracked branch or
a tracked release tag. See [`provenance/README.md`](provenance/README.md).

## Quality Checks

Run the checks relevant to the change:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm validate
pnpm build
pnpm cli validate-links .vitepress/dist
```

For pull requests, explain what changed and why, link related issues, and list
the commands run. Use DCO sign-off for commits. Maintainers are listed in
[MAINTAINERS.md](MAINTAINERS.md), and ownership is configured in
[.github/CODEOWNERS](.github/CODEOWNERS).

Contributions are provided under the repository license. Documentation content
uses CC-BY-4.0; see [LICENSE](LICENSE).
