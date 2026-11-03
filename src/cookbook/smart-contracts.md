# Build and Deploy a Smart Contract

## Outcome

Check and compile a Kotodama V1 contract, run its public view locally,
deploy the verified IVM artifact with explicitly selected authority-paid
fees, and read the deployed view through Torii.

## Prerequisites

- An Iroha source checkout at commit
  `c8c872461e92f04325c350cdd952f4276e96f9dc`, Rust, and Cargo.
- The current `iroha` CLI and `musubi` (run as `cargo run -p musubi --`
  in the checkout) plus a funded Taira client from
  [Connect to Taira](./connect-to-taira.md).
- An absolute path in `IROHA_CONFIG`. Musubi's network binding stores a
  reference to this client file and signs the deployment with its account
  key.
- Alias authority. The executor requires `CanManageAccountAlias` for the
  exact contract alias or its parent scope: the owning domain for
  `name::domain.dataspace`, or the dataspace for `name::dataspace`.
  Registered accounts need no separate code-registration permission, and
  protected namespaces also require the network's governance workflow. The
  examples use `cookbook_tuple::universal`; on Taira, replace it with an
  alias in a domain you own, or deploy on a generated local network whose
  genesis grants the alias scope.

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## Steps

### 1. Copy a known-good Kotodama V1 contract

Work inside the pinned Iroha checkout and copy the compiler's tuple-return
sample so the source and toolchain stay on the same commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

The complete source is small: a private helper `fn` and one public
read-only `view fn` that explicitly allows every caller:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    view fn compute() authorize(anyone) -> (int, int) {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama targets the Iroha Virtual Machine and its current ABI. It is not a
WASM or EVM source language.

### 2. Check, build, and verify the artifact

```bash
cargo run -p kotodama_toolchain --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

The first build publishes the artifact and authenticated sidecars. The
second runs in read-only `--verify` mode and fails if any existing output
does not exactly match the current source. Treat the `.to` file and its
manifest as one reviewed build output.

### 3. Run the bytecode locally

`compute` is a public read-only `view fn`. Run it with `debug-view`, which
executes the compiled bytecode locally against optional fixtures without
submitting or paying for a transaction.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama integers are rendered as JSON strings, so the decoded tuple is
`["3", "5"]`.

### 4. Deploy the verified artifact with Musubi

`iroha contract` inspects, views, and debugs contracts but does not deploy
them, so Taira deployments run through Musubi. Its deployment service
uploads the bytecode chunks, registers the verified manifest, and submits
one `CommitContractDeployment` operation. It quotes every transaction,
refuses a quote that changes the selected payer, sponsor revision, or gas
bound, and deploys the prebuilt artifact only after the locked package
build reproduces its code and ABI hashes. On a Kagami-managed local
network, `kagami contract deploy` deploys `./build/tuple_return_demo.to`
with `--alias cookbook_tuple::universal --json` instead; its receipt is
under `.receipt`, and `kagami context show` prints the client
configuration to use as `IROHA_CONFIG`.

```bash
cat > ./contracts/Musubi.toml <<'TOML'
manifest-version = 1

[package]
namespace = "local"
name = "cookbook-tuple"
version = "0.1.0"
edition = "1"
abi-version = 1

[[contract]]
name = "tuple_return_demo"
path = "tuple_return_demo.ko"
TOML

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml check

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml \
  network configure taira \
  --config "$IROHA_CONFIG" \
  --fee-payer authority \
  --contract tuple_return_demo \
  --alias cookbook_tuple::universal

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml --format json \
  deploy --network taira \
  --contract tuple_return_demo \
  --artifact ./build/tuple_return_demo.to \
  --artifact-manifest ./build/tuple_return_demo.manifest.json \
  > ./build/deployment.json

jq '.data.receipt | {contract_address, code_hash, stored_artifact_matches}' \
  ./build/deployment.json
```

The binding uses `--fee-payer authority`; Musubi quotes the exact fee, in
Taira's fee asset, before signing. Compare the returned
charge asset with the one the current faucet policy publishes. Contract
calls accept fee
selection only through the typed live quote; `gas_asset_id` transaction
metadata is not part of the first-release contract.

### 5. Read the deployed view

`contract view` executes the read-only entrypoint on Torii without a
transaction or fee. A view has no transaction form: Torii rejects a view
selector on its call routes.

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## Verify

Resolve the alias, fetch the on-chain manifest by the code hash Torii
reports for the deployed view, and run the same view by canonical address:

```bash
CONTRACT_ADDRESS="$({
  jq -er '.data.receipt.contract_address' ./build/deployment.json
})"
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/local-view.json; })"
DEPLOYED_CODE_HASH="$({
  jq -er '.code_hash_hex' ./build/deployed-view.json
})"
test "$DEPLOYED_CODE_HASH" = "$CODE_HASH"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --dataspace-id 0 \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-view.json
```

Deployment is complete only when the deployment receipt reports the stored
artifact as verified, the alias resolves to the returned address, the
manifest is readable under the same code hash, and the local and Torii
views return `["3", "5"]`.

## Troubleshooting

- `deployment authority lacks CanManageAccountAlias`, or the executor's
  `authority is not permitted to manage contract alias`, means the account
  may not bind that alias. Use an alias in a domain you own, or obtain the
  exact alias grant or its domain or dataspace grant from that scope's
  owner; on localnet, grant it in genesis.
- A protected-namespace rejection means the alias namespace is governed.
  Listing approver account IDs is not approval evidence; use the network's
  governance workflow (`iroha app gov deploy propose`) for that namespace,
  or choose an alias outside it.
- A manifest or ABI mismatch means the bytecode, manifest, and node runtime
  do not describe the same artifact. Rebuild at the pinned commit, then
  rerun the build with `--verify`.
- `fee quote changed ... gas bound` means the requested typed intent and
  live quote disagree. Re-preflight rather than modifying a signed
  transaction.
- An interrupted deployment keeps its signed plan in a journal. Recover it
  with `musubi deploy --resume <JOURNAL>` instead of signing a new plan.
- `is read-only and cannot be invoked as a transaction` or
  `is not a kotoage or lifecycle entrypoint` means `compute` was sent to a
  call command. This sample declares `view fn`, so use `debug-view`
  locally and `view` on Torii.
- Contract calls require a positive typed gas limit. The first-release call
  contract rejects top-level gas or fee-asset metadata.

## Source and related docs

- [Kotodama V1 command implementation at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [Tuple-return source sample at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Musubi deploy command](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) and the [native contract deployment service](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs) at the pinned commit
- [Contract integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [Smart contracts](/blockchain/smart-contracts.md)
- [CLI reference](/get-started/operate-iroha-via-cli.md)
