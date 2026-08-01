# Generated Reference Provenance

`iroha.json` is the machine-readable source of truth for artifacts imported or
generated from the Iroha implementation repository.

The manifest pins a full Git commit, records every source-to-target mapping or
generator command, and stores SHA-256 hashes for checked-in outputs. Normal
documentation installs and builds consume those outputs without fetching Iroha.

The recorded candidate commit is publicly fetchable, and the four copied source
paths and hashes match its public Git tree. The candidate commit is unsigned,
so it does not establish release provenance for the final source-repository
documentation relocation or current implementation truth. The manifest keeps
every artifact `pending-signed-source-commit` under the explicit
`awaiting-signed-source-commit` source state.

After the final source truth receives its required compliant signed public
commit, advance `source.commit` to that commit and run:

```bash
pnpm refresh:iroha --source /path/to/clean/iroha
pnpm validate:provenance
```

Do not relax the clean-checkout or exact-commit guards to bridge this transition.
The refresh workflow is expected to remain blocked until the signed source
commit contains every recorded source path.
