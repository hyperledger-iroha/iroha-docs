```text
Complete command-line arguments for the Iroha server

Usage: iroha3d [OPTIONS]

Options:
  -c, --config <PATH>
          Path to the configuration file

      --genesis-manifest-json <PATH>
          Optional path to genesis manifest JSON for consensus validation

      --check-config
          Validate configuration and available genesis, then exit without binding network sockets

      --write-kagemusha-catalog-qualification-seal <PATH>
          Fully qualify Kagemusha catalog and publish its canonical cold-start seal at this path

      --write-kagemusha-validator-qualification-seal <PATH>
          Fully qualify this validator against the configured signed promotion reservation and publish its canonical seal at this root-owned path

      --trace-config
          Enables trace logs of configuration reading & parsing.

          Might be useful for configuration troubleshooting.

          [env: TRACE_CONFIG=]

      --config-blake3 <HEX>
          Require the configuration file bytes to match this lowercase or uppercase 64-digit BLAKE3 digest.

          Integrity-bound files are parsed from the exact bytes that were hashed and must be flattened (the `extends` directive is not accepted).

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
          Enable Sora Nexus feature profile (`SoraFS`, `SoraNet` handshake, multi-lane consensus)

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
