# Hot Reload Iroha in a Docker Container

Use hot reload only for local debugging. Follow [Launch Iroha 3](/get-started/launch-iroha.md) to build and run four validators with matching binaries in Docker.

## Replace the Peer Binary

Build a Linux-compatible daemon binary from the upstream workspace:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Copy it into a running peer container, then restart that container:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Use `docker ps` to find the container. Check the path of the daemon in your image before replacing it.

## Recommit Genesis in a Disposable Network

A new genesis requires empty peer storage. Use `python3 poc.py down` and `python3 poc.py up` to restart the same network. Keep `state/` together with its four Docker volumes.

## Use Custom Configuration

Current peer configuration is TOML. Bind mount or copy the generated
`config.toml`, `genesis.signed.nrt`, and related key files into the container
paths expected by the image, then restart the peer. Keep the generated files
together; mixing files from different Kagami runs can produce deserialization or
consensus failures.
