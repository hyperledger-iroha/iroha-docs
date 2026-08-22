# Working with Iroha Binaries

The Iroha 3 operator workflow revolves around three primary binaries:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) for running a peer daemon
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) for CLI and operator commands
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) for keys, genesis, localnets, and profiles

## Build from Source

From the upstream workspace root:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

The release binaries are then available in `target/release/`.

To inspect the command surface:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Run Directly from the Repository

If you do not want to install anything globally, use `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Image

The upstream workspace uses `kagami localnet` and `kagami docker` to generate
Docker Compose files that match the checked-out code. The `hyperledger/iroha:dev`
image can be used with those generated files.

Run the CLI in a container:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Run Kagami in a container:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

For peer startup, generate a localnet and Compose file first:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Which Binary Should I Use?

- Use `irohad` when you are starting or operating peers.
- Use `iroha` when you need to query the ledger, submit transactions, or inspect operator endpoints.
- Use `kagami` when you need keys, genesis manifests, profile bundles, or localnet assets.

## Kagemusha Release Publication and Rollout

Kagemusha V4 publication and activation cross separate protected boundaries:

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` is the
  macOS-only, root-only publisher. It authenticates the pinned Kagami binary and
  the exact sixteen-file candidate, publishes the absent
  `promotion-record-v4.norito` without replacement, and reports success only
  after the exact seventeen-file promoted release verifies.
- `iroha offline kagemusha rollout-v4 create-expectations` verifies the signed
  reservation, four ordered validator qualification seals, the exact
  already-authorized transaction wire, and the trusted finalized anchor before
  publishing signed expectations without replacement.
- `iroha offline kagemusha rollout-v4 submit` requires explicit
  `--write-authorized` consent. It durably journals and re-verifies the exact
  expectations before a network write or retry. An `Applied` status is not
  enough: the command also verifies the committed block, finality successor
  chain, and complete authorization-bearing transaction wire.
- `iroha offline kagemusha rollout-v4 finalize-receipt` collects the same
  proof-anchored evidence only after the exact submission journal reverifies,
  signs it with the independent receipt issuer, and publishes the canonical
  receipt without replacement.

The checked-in Kagemusha production-readiness workflow is verification-only.
It does not call the authenticated publisher, publish validator qualification
seals, submit an activation, or create a finality receipt. A successful workflow
run therefore proves neither promotion nor a live rollout.

These commands are local primitives, not substitutes for live evidence. A
production rollout remains blocked without real physical App Attest and
candidate artifacts, all four protected host seals, runtime governance and
signing inputs, live four-validator submission and finality evidence, and the
canonical effective-configuration projection. Keep private keys,
authentication material, and promotion-specific identifiers in protected
runtime custody; do not copy them into source-controlled documentation or
operator tickets.
