# `iroha3d` CLI

`iroha3d` is the standard Iroha 3 peer daemon. The Cargo package is named
`irohad`, so invoke the binary from a source checkout with:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

For the public Taira testnet, the release image uses `iroha3d_taira`. It accepts
the same CLI but additionally enforces the canonical Taira chain, validator,
storage, and runtime-signer profile. Validate a Taira configuration without
opening runtime credentials like this:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Use the operator-rendered form of the canonical Taira profile; the checked-in
template still contains deployment placeholders. Do not substitute the generic
Nexus or production SoraFS settings when testing against Taira.

## `--config` {#arg-config}

- **Type:** file path
- **Alias:** `-c`

Path to the [peer configuration](/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- **Type:** file path

Optional genesis manifest JSON used for consensus validation.

## `--check-config` {#arg-check-config}

Validate the resolved configuration and available genesis material, then exit
without binding network sockets.

## Kagemusha qualification seals

These file-path options require `--check-config` and perform full Kagemusha
qualification before writing a canonical seal:

- `--write-kagemusha-catalog-qualification-seal <PATH>` qualifies the catalog.
- `--write-kagemusha-validator-qualification-seal <PATH>` qualifies the local
  validator against the configured signed promotion reservation.

The two seal options conflict with each other.

## `--trace-config` {#arg-trace-config}

- **Type:** flag
- **Environment:** `TRACE_CONFIG`

Enable trace logs while configuration layers are read and parsed.

## `--config-blake3` {#arg-config-blake3}

- **Type:** 64-digit hexadecimal BLAKE3 digest
- **Requires:** `--config`

Require the configuration file bytes to match the supplied digest. An
integrity-bound file must be flattened; it cannot contain `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- **Type:** Boolean, passed as `--terminal-colors=true` or
  `--terminal-colors=false`
- **Default:** terminal capability detection
- **Environment:** `TERMINAL_COLORS`

Control ANSI-colored output.

## `--language` {#arg-language}

- **Type:** string

Override the system language used for daemon messages.

## `--sora` {#arg-sora}

- **Type:** flag
- **Environment:** `IROHA_SORA_PROFILE`

Enable the Sora Nexus profile used by SoraFS, the SoraNet handshake, and
multi-lane consensus. The Taira launcher is always invoked with this flag.

## FastPQ overrides

`--fastpq-execution-mode <MODE>` and `--fastpq-poseidon-mode <MODE>` accept
only `cpu` or `gpu`. The remaining options override telemetry labels:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

For example:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## Generated help

The option summary above is verified against the current `iroha3d` argument
definitions. The checked-in generated help snapshot is intentionally not
rendered while its provenance status is pending. To inspect the exact help for
your checkout, run:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
