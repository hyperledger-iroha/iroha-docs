# Generated Reference Provenance

`iroha.json` is the machine-readable source of truth for artifacts imported or
generated from the Iroha implementation repository.

The manifest pins a full Git commit, records every source-to-target mapping or
generator command, and stores SHA-256 hashes for checked-in outputs. Normal
documentation installs and builds consume those outputs without fetching Iroha.

The first-release source relocation is currently staged in the implementation
repository, while the manifest paths already use their final locations under
`specs/` and `artifacts/`. The recorded commit is the last clean baseline before
that relocation. After the relocation receives its required signed commit,
advance `source.commit` to that commit and run:

```bash
pnpm refresh:iroha --source /path/to/clean/iroha
pnpm validate:provenance
```

Do not relax the clean-checkout or exact-commit guards to bridge this transition.
The refresh workflow is expected to remain blocked until the signed source
commit contains every recorded source path.
