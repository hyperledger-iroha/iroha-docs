# Build and Deploy a Smart Contract

## Outcome

Check and compile a Kotodama V1 contract, execute its public entrypoint
locally, deploy the verified IVM artifact, simulate the deployed
entrypoint, and submit it with an explicitly quoted authority-paid fee.

## Prerequisites

- An Iroha source checkout at commit
  `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust, and Cargo.
- The current `iroha` CLI plus a funded Taira client from
  [Connect to Taira](./connect-to-taira.md).
- Absolute paths in `IROHA_CONFIG` and `IROHA_PRIVATE_KEY_FILE`. The key
  file must be an owner-held, single-link regular file with mode `0600`;
  the deploy helper intentionally has no inline private-key argument.
- Taira operator approval. Contract code registration requires
  `CanRegisterSmartContractCode`, and protected deployments can require
  governance attribution and enactment. If Taira has not granted that
  access, perform the deployment on a generated local network whose genesis
  grants the permission.

```bash
TORII_URL=https://taira.sora.org
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
IROHA_PRIVATE_KEY_FILE=/absolute/path/to/taira-private-key.txt
test -n "$TAIRA_ACCOUNT_ID"
test -f "$IROHA_PRIVATE_KEY_FILE"

CHAIN_ID="$({
  python3 - "$IROHA_CONFIG" <<'PY'
import sys
import tomllib

with open(sys.argv[1], "rb") as config_file:
    print(tomllib.load(config_file)["chain"])
PY
})"
```

## Steps

### 1. Copy a known-good Kotodama V1 contract

Work inside the pinned Iroha checkout and copy the compiler's tuple-return
sample so the source and toolchain stay on the same commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

The complete source is small and uses the current `seiyaku`/`kotoage`
syntax:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    kotoage fn compute() -> (int, int) authorize("Entry") {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama targets the Iroha Virtual Machine and its current ABI. It is not a
WASM or EVM source language.

### 2. Check, build, and verify the artifact

```bash
cargo run -p ivm --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
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

`compute` is a public `kotoage` entrypoint. Run it with `debug-call`, which
executes against local fixtures without submitting or paying for a
transaction.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama integers are rendered as JSON strings, so the decoded tuple is
`["3", "5"]`.

### 4. Deploy through the native helper

The helper uploads bytecode chunks, registers the signed manifest, and
submits one `CommitContractDeployment` operation. It fee-quotes every
transaction and refuses a quote that changes the selected payer or gas
bound.

```bash
printf '%s\n' \
  '{"payer":"authority","value":{"charge_limits":[],"gas_limit":1500000}}' \
  > ./build/fee-payment.json

cargo run -p iroha_cli --bin ivm_contract_deploy -- \
  --torii-url "$TORII_URL" \
  --chain-id "$CHAIN_ID" \
  --authority "$TAIRA_ACCOUNT_ID" \
  --private-key-file "$IROHA_PRIVATE_KEY_FILE" \
  --code-file ./build/tuple_return_demo.to \
  --contract-alias cookbook_tuple::universal \
  --fee-payment-json ./build/fee-payment.json \
  --out-dir ./build/deployment \
  > ./build/deployment.json

jq '{contract_address, code_hash_hex, final, fee_quotes}' \
  ./build/deployment.json
```

The empty `charge_limits` request is not a copied asset identifier: the
helper accepts the exact live quote before signing. Compare the returned
charge asset with the current faucet response. Contract calls accept fee
selection only through the typed live quote; `gas_asset_id` transaction
metadata is not part of the first-release contract.

### 5. Simulate and call the deployed entrypoint

Simulation runs the public entrypoint on Torii without submission. The
following call is a transaction and therefore selects the authority fee
payer explicitly. Both commands bind the 1,500,000 gas limit.

```bash
iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-simulation.json

iroha --config "$IROHA_CONFIG" \
  --machine \
  --fee-payer authority \
  contract call \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  --wait \
  --timeout-ms 60000 \
  > ./build/deployed-call.json

jq -e '.terminal_kind == "Applied"' ./build/deployed-call.json
```

## Verify

Resolve the alias, fetch the on-chain manifest by the returned code hash,
and simulate the same public entrypoint by canonical address:

```bash
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/deployment.json; })"
CONTRACT_ADDRESS="$({ jq -er '.contract_address' ./build/deployment.json; })"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-simulation.json
```

Deployment is complete only when the alias resolves to the returned
address, the manifest is readable under the same code hash, local and Torii
simulations return `["3", "5"]`, and the submitted call reaches `Applied`.

## Troubleshooting

- `CanRegisterSmartContractCode` failures require a Taira operator grant or
  a genesis/bootstrap change on localnet. A normal account cannot
  self-grant this permission after the fact.
- Governance or protected-lane rejection means the deployment needs the
  exact approver attribution required by that network. Coordinate the
  approver list; do not invent account IDs.
- A manifest or ABI mismatch means the bytecode, manifest, and node runtime
  do not describe the same artifact. Rebuild at the pinned commit with
  `--verify`.
- `fee quote changed ... gas bound` means the requested typed intent and
  live quote disagree. Re-preflight rather than modifying a signed
  transaction.
- The deploy helper rejects inline keys, permissive key-file modes,
  symlinks, and multiply linked files before network submission.
- A view-only entrypoint error means `compute` was routed through the wrong
  command family. This sample declares `kotoage`, so use call simulation or
  submission.
- Contract calls require a positive typed gas limit. The first-release call
  contract rejects top-level gas or fee-asset metadata.

## Source and related docs

- [Kotodama V1 command implementation at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [Tuple-return source sample at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Native deployment helper at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Contract integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [Smart contracts](/blockchain/smart-contracts.md)
- [CLI reference](/get-started/operate-iroha-via-cli.md)
