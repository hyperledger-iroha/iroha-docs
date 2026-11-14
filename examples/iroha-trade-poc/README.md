# Iroha 3 trade PoC

Run four private validators on one approved Linux x86_64 VM. Start here if your team wants to demonstrate the trade workflow or observe what happens when one validator stops. A single VM outage takes all four validators offline.

The kit creates a standalone permissioned Iroha 3 ledger for integration and failure testing. Connecting it to SORA Nexus as a governed data space requires a separate provisioning step. The included transaction is a signed test message.

## Start the network

Use a Linux x86_64 VM with Python 3.8 or later, Docker Engine, Docker Buildx and Docker Compose v2. Your shell account needs Docker access. To build from source, the VM also needs outbound HTTPS access to Docker Hub, GitHub, Debian package mirrors and crates.io. Extract the entire ZIP and open the `iroha-trade-poc` directory before running the commands below.

```sh
python3 poc.py up
python3 poc.py verify
```

On first use, the script builds the patched validator and matching command-line tools from the pinned Iroha 3 source. Allow additional build time and disk space for the Rust compiler, dependencies and intermediate files. Later starts reuse the local image. The first start generates the PoC's validator keys, signing account, chain ID and signed genesis locally.

If you received the optional prebuilt image archive, load it before running the start commands to skip compilation. The archive must provide the tag `iroha-trade-poc:dc7fdbcbbe-poc1`.

```sh
docker load --input iroha-trade-poc-linux-amd64.tar.gz
docker image inspect iroha-trade-poc:dc7fdbcbbe-poc1 --format '{{.Os}}/{{.Architecture}}'
```

The inspection should print `linux/amd64`.

After startup, each of the four validators should report three connected peers and the same nonzero block height. The verification command signs a fresh test transaction and checks that all four reach a higher block with the same hash. You can also read peer 0 directly from the VM.

```sh
curl -fsS -H 'Accept: application/json' http://127.0.0.1:18080/status
```

The other three local API ports are 18081 through 18083. The VM publishes them on loopback. The sandbox genesis also includes upstream sample accounts, so use synthetic trade records on this disposable network. A portal integration that leaves the VM needs a separately configured private HTTPS gateway and access policy.

## Test one validator stopping

```sh
python3 poc.py failover
```

The script stops peer 3, waits for the other three to see two connected peers each, submits a fresh transaction and checks that those three commit the same new block. It then restarts peer 3 and checks that all four reach the same height.

## Stop or restart

```sh
python3 poc.py down
python3 poc.py up
```

Stopping preserves the ledgers and their corresponding keys. Keep the `state/` directory and the four Docker volumes together. Use `python3 poc.py logs` to read the last 100 log lines per validator.

## What is in this build

The kit pins the Iroha source to `dc7fdbcbbe0d0d86977bf16f8b4e0af0225acccb`, the Linux base images by digest and the Rust dependencies in `Cargo.lock`. Two patches are included in `build-support/`. One gives each new PoC its own client signing key. The other makes the proposer and validator encode the same data when checking the lane payload hash. The validator still rejects a changed hash. [Pinned Iroha source](https://github.com/hyperledger-iroha/iroha/tree/dc7fdbcbbe0d0d86977bf16f8b4e0af0225acccb)

## Try the public option without a VM

For the SORA Nexus universal data space, run this read-only Taira testnet check from any workstation with `curl` and `jq`. It requires no signing account or ledger server.

```sh
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status | jq '{peers, blocks, txs_approved, queue_size}'
```
