```text
Complete command-line arguments for the Iroha server

Usage: iroha3d [OPTIONS]

Options:
  -c, --config <PATH>
          Path to the configuration file

      --genesis-manifest-json <PATH>
          Optional path to genesis manifest JSON for consensus validation

      --check-config
          Validate configuration and available genesis, then exit without binding network sockets.

          The runtime-only secrets under `<data_dir>/secrets/` (runtime signer and beacon credential) are never opened; the key files the configuration names are read by the parser after their custody checks. As on a real start, a missing node-local `SoraNet` transport or streaming identity is created first.

      --json
          With `--check-config`, print this build's and configuration's compatibility values as one Norito JSON object instead of the `Ready`/`Pending` line

      --check-storage
          Inspect the stopped node's Kura store and newest snapshot read-only with this build's decoders, print the result as one Norito JSON object and exit nonzero on failure.

          Takes the Kura store-root lock, so it refuses a store a running node owns. It never mutates the store and never opens runtime-only secrets (the configuration is parsed as for `--check-config`).

      --check-replay
          Replay a copy of the stopped node's store with this build, print the result as one Norito JSON object and exit nonzero when a block does not reproduce its certified result or the store lacks a block body the replay needs.

          Opens the store read-only and takes its store-root lock as `--check-storage` does, copies its blocks into a temporary directory, restores the newest snapshot there (or re-executes signed genesis) and re-executes every later block. It never writes the store, the snapshot directory or the tiered-state directory, and never opens runtime-only secrets.

      --require-genesis-inrou-deployment-authority <ACCOUNT_ID>
          Require this registered account to retain `SoraCloud` deployment authority after executing the exact signed genesis during offline validation

      --trace-config
          Enables trace logs of configuration reading & parsing.

          Might be useful for configuration troubleshooting.

          [env: TRACE_CONFIG=]

      --config-blake3 <HEX>
          Require the configuration file bytes to match this lowercase or uppercase 64-digit BLAKE3 digest.

          Integrity-bound files are parsed from the exact bytes that were hashed and must be flattened (the `extends` directive is not accepted).

      --sumeragi-assert-fresh-key
          Assert, at this boot only, that the node's consensus keys never signed for this chain.

          Sumeragi keeps a safety record per key; without one it signs nothing until it has proof that its record was not lost. Pass this once, at the first boot of a new key, and never after a data loss.

      --terminal-colors[=<TERMINAL_COLORS>]
          Whether to enable ANSI-colored output or not

          By default, Iroha determines whether the terminal supports colors or not.

          In order to disable this flag explicitly, pass `--terminal-colors=false`.

          [env: TERMINAL_COLORS=]
          [default: false]
          [possible values: true, false]

      --language <LANGUAGE>
          Override system language for messages

      --sora
          Enable Sora Nexus feature profile (`SoraFS`, `SoraNet` handshake, multi-lane consensus) while preserving explicitly configured Nexus topology, including default-valued catalogs

          [env: IROHA_SORA_PROFILE=]

      --fastpq-execution-mode <MODE>
          Override FASTPQ prover execution mode (`cpu` or `gpu`)

      --fastpq-poseidon-mode <MODE>
          Override the FASTPQ Poseidon pipeline mode (`cpu` or `gpu`)

      --fastpq-device-class <LABEL>
          Override the FASTPQ telemetry device-class label (e.g., `apple-m4`, `xeon-rtx-sm80`)

      --fastpq-chip-family <LABEL>
          Override the FASTPQ chip-family label (e.g., `m4`, `xeon-icelake`)

      --fastpq-gpu-kind <LABEL>
          Override the FASTPQ GPU-kind label (e.g., `integrated`, `discrete`)

  -h, --help
          Print help (see a summary with '-h')

  -V, --version
          Print version
```
