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

Command artifacts also require an owner-verified root `Cargo.lock` binding in
`command_environment.cargo_lock`. The binding records the repository-relative
source, exact byte length, and SHA-256 digest. The current schema v1 manifest
intentionally omits the command environment and can only keep command artifacts
pending. Before a command refresh, advance the manifest to schema v2 and add
the complete binding. Refreshes then require the ignored source lock to be an
exact, regular, non-symlink, hard-link-free file match.
While the signed-source transition is pending, partial `--only` refreshes are
rejected; the complete artifact set must pass preflight before any output is
updated. Every selected output is prepared, and the lock is revalidated around
each command, before checked-in targets are replaced.
Command generators run from a private, read-only clone of the exact source
commit with the authenticated lock copied in, a dedicated target directory,
offline Cargo, one build job, disabled rustup auto-installation, and a scrubbed
behavior environment. Command refresh is POSIX-only and additionally requires
explicit absolute `CARGO_HOME` and `RUSTUP_HOME` paths. Those external homes,
the executables on `PATH`, and their preinstalled toolchain/dependency cache are
trusted operator inputs rather than manifest-authenticated artifacts; review
and isolate them accordingly.

After the final source truth receives its required compliant signed public
commit, advance `schema_version` to `2` and `source.commit`, add the
owner-verified Cargo lock binding, put those exact lock bytes at the source
checkout root, and run:

```bash
pnpm refresh:iroha --source /path/to/clean/iroha
pnpm validate:provenance
```

Do not relax the clean-checkout or exact-commit guards to bridge this transition.
The refresh workflow is expected to remain blocked until the signed source
commit contains every recorded source path.
