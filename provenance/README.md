# Generated Reference Provenance

`iroha.json` is the machine-readable source of truth for artifacts imported or
generated from the Iroha implementation repository. Normal documentation
installs and builds consume the checked-in outputs without fetching Iroha.

- `source.track` names what refreshes follow: the newest commit on `branch`
  whose signature GitHub verifies, or a newer release tag matching the
  `release_tags` glob.
- `source.ref` and `source.commit` record the public ref and the exact commit
  that every artifact was generated from. GitHub verifies the commit's
  signature (for a tag, the tag's signature also counts), and the commit is
  reachable from the ref, so a signed commit that exists only in a fork or an
  unmerged pull request is never pinned.
- Each artifact records its source path (`copy` keeps the file as it is;
  `render` converts it with the renderer registered for the artifact in
  `etc/generated-references.ts`) or its generator command (`command`), its
  checked-in target, and SHA-256 hashes. `pnpm validate:provenance` checks the
  manifest and the hashes offline.

`pnpm select:iroha` chooses the next pin. Then
`pnpm refresh:iroha --source /path/to/clean/iroha --pin <commit> --ref <ref>`
verifies it and regenerates every artifact from that commit. Generators run
only in a clean checkout of the pinned commit, and a failed generator leaves the
manifest and the artifacts unchanged. Do not hand-edit generated outputs.

Pages cite Iroha source at the pinned commit, and the cookbook validator
requires every recipe to cite it. A new pin therefore fails
`pnpm validate:cookbook` until the citing pages are checked against it and
`pnpm move:iroha-citations --source /path/to/iroha` moves their citations.
