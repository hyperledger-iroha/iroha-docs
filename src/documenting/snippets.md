# Code Snippets

Generated snippets keep examples tied to code, configuration, and schemas from
the Iroha revision that produced them.

## Refreshing Iroha Artifacts

Iroha-derived snippets are checked in so ordinary site builds do not require
network access or a sibling repository. Refresh them explicitly:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

The checked-in
[`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts)
workflow verifies the clean source checkout against `provenance/iroha.json`,
regenerates `/src/snippets` and the Torii OpenAPI snapshot, and updates SHA-256
hashes. Review the content and provenance changes together. Normal dependency
installation and VitePress builds consume the checked-in files without
fetching a mutable branch.

## Including Snippets

Use the
[VitePress code-snippet syntax](https://vitepress.dev/guide/markdown#import-code-snippets)
to include generated or local source:

```md
<<< @/snippets/client.template.toml
```

A named code region can be included by appending its region name:

```md
<<< @/example_code/lorem.rs#ipsum
```

Keep hand-written examples small. Prefer refreshed source artifacts for public
interfaces, configuration templates, generated schemas, and command output.
