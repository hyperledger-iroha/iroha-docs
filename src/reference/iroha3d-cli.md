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
SORA Nexus or production SoraFS settings when testing against Taira.

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

## `--json` {#arg-json}

- **Type:** flag
- **Requires:** `--check-config`

Print this build's and configuration's compatibility values as one Norito
JSON object instead of the `Ready` or `Pending` line.

## `--check-storage` {#arg-check-storage}

- **Type:** flag
- **Conflicts with:** `--check-config`

Inspect the stopped node's Kura store and newest snapshot read-only with this
build's decoders, print the result as one Norito JSON object, and exit
nonzero on failure. The check takes the Kura store-root lock, so it refuses a
store that a running node owns. It never mutates the store and never opens
runtime-only secrets.

## `--check-replay` {#arg-check-replay}

- **Type:** flag
- **Conflicts with:** `--check-config`, `--check-storage`

Replay a copy of the stopped node's store with this build and print the
result as one Norito JSON object. The command copies the blocks into a
temporary directory, restores the newest snapshot there or re-executes the
signed genesis, and re-executes every later block. It exits nonzero when a
block does not reproduce its certified result or a needed block body is
missing, and it never writes the store or opens runtime-only secrets.

## `--require-genesis-inrou-deployment-authority` {#arg-require-genesis-inrou-deployment-authority}

- **Type:** account ID
- **Requires:** `--check-config`

During offline validation, require this registered account to retain
SoraCloud deployment authority after the exact signed genesis executes.

## `--sumeragi-assert-fresh-key` {#arg-sumeragi-assert-fresh-key}

- **Type:** flag

Assert, at this boot only, that the node's consensus keys never signed for
this chain. Sumeragi keeps a safety record per key and signs nothing without
one until it has proof that the record was not lost. Pass this flag once, at
the first boot of a new key, and never after a data loss.

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

Enable the SORA Nexus profile used by SoraFS, the SoraNet handshake, and
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

The option summary above follows the `iroha3d` argument definitions at the
pinned Iroha commit. To inspect the exact help for your checkout, run:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
