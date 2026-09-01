# Working with Iroha Binaries

The Iroha 3 operator workflow revolves around four primary binaries:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) for running a peer daemon
- `iroha3d_taira` for the canonical Taira validator launcher
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) for CLI and operator commands
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) for keys, genesis, localnets, and profiles

## Build from Source

From the upstream workspace root:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

The release binaries are then available in `target/release/`.

To inspect the command surface:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Run Directly from the Repository

If you do not want to install anything globally, use `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
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
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## Which Binary Should I Use?

- Use `iroha3d` when you are starting or operating peers outside the public
  Taira validator release.
- Use `iroha3d_taira --sora` only for a canonical Taira validator deployment;
  it enforces Taira's chain, storage, and runtime-signer profile.
- Use `iroha` when you need to query the ledger, submit transactions, or inspect operator endpoints.
- Use `kagami` when you need keys, genesis manifests, profile bundles, or localnet assets.
