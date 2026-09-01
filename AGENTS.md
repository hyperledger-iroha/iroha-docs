# Agent Handbook

## Repository Purpose

- This repository is the canonical home for public, in-depth Hyperledger Iroha
  3 documentation and publishes to <https://docs.iroha.tech/>.
- The implementation repository may keep concise contributor notes,
  code-coupled specifications, Rustdoc, and generated test material. Do not
  duplicate public guides there.
- Treat the current Iroha implementation, configuration defaults, schemas, and
  tests as behavioral truth. Replace stale claims instead of preserving release
  history or migration guidance.

## Site and Tooling

- Preserve the VitePress architecture and keep the production base path at `/`.
- Use Node.js 24 and pnpm 9. Install with `pnpm install --frozen-lockfile`.
- Normal install, test, and build commands must not fetch Iroha source or
  require `../iroha`.
- Never source generated material from a mutable branch. The only supported
  refresh is `pnpm refresh:iroha --source /path/to/iroha`, using the exact
  commit in `provenance/iroha.json`.
- Keep generated snippets, OpenAPI, schemas, CLI output, and provenance hashes
  checked in. Review their diffs like source code.

## Content Policy

- Document the first Iroha 3 release only. Do not add historical comparisons,
  retired runtime targets, compatibility archives, or redirects for unpublished
  routes.
- Prefer concise local contributor instructions in the implementation
  repository and put tutorials, architecture, operations, SDK, and API guidance
  here.
- When implementation behavior changes, update the English source and all
  affected translations in the same change.
- Keep code, identifiers, commands, URLs, and wire-format details unchanged in
  translations.

## Internationalization

- English pages live at the root of `src/`.
- Maintained locale trees are `es`, `pt`, `fr`, `ru`, `ar`, `ur`, `ja`, `he`,
  `my`, `ka`, `hy`, `az`, `kk`, `ba`, `am`, `dz`, `uz`, `mn`, `zh-hant`, and
  `zh-hans`.
- Every locale must have exact page-for-page route parity with English.
- Translated frontmatter must include `translation_locale`,
  `translation_source`, `translation_source_hash`, and
  `translation_status: machine-validated`.
- Arabic, Hebrew, and Urdu are right-to-left locales. Preserve their direction
  metadata and verify layout behavior.

## Commands

- `pnpm dev` — start the local site.
- `pnpm build` — build the production site.
- `pnpm format:check` / `pnpm format:fix` — check or apply formatting.
- `pnpm lint` — lint TypeScript and Vue sources.
- `pnpm typecheck` — run TypeScript validation.
- `pnpm test` — run Vitest once.
- `pnpm translate` — regenerate all maintained translations.
- `pnpm validate` — enforce content, locale parity, and provenance policies.
- `pnpm cli validate-links .vitepress/dist` — validate built links.

Keep changes focused, add tests for tooling behavior, and report the checks run
in pull requests.
