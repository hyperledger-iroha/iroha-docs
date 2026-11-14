# Operate Iroha 3 via CLI

The `iroha` binary is the command-line client for Iroha 3. Use it to query
ledger state, submit transactions, and inspect operator endpoints.

## 1. Prerequisites

Start a local network first:

- [Launch Iroha 3](./launch-iroha.md)

The examples below assume the generated client configuration from the localnet
created in [Launch Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. Basic CLI Setup

Show the top-level help:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

The CLI is organized into these top-level command groups:

- `account` for account reads and mutations
- `explorer` for explorer feeds with shared filters and paging
- `tx` for transaction status and transaction helpers
- `ledger` for on-ledger reads and writes
- `trigger` for trigger reads, writes, and execution
- `ops` for operator diagnostics
- `app` for app API helpers
- `contract` for contract calls, views, and local debugging; deploy with
  `kagami contract deploy` or `musubi deploy`
- `tools` for diagnostics and developer utilities
- `dataspace` for planning, applying, and inspecting a data space definition
- `taira` for Taira diagnostics and account onboarding
- `offline` for offline encoders, reports, and diagnostics
- `soracloud` for Soracloud app platform helpers
- `sccp` for SORA Cross-Chain Protocol reads, transfers, and proofs

Every command that submits a transaction needs an explicit fee payer, such
as `--fee-payer authority`; the CLI quotes the exact fee before signing.

Use `--output-format text` for human-readable operator output and `--machine`
for strict automation mode.

## 3. Try the Public Taira Testnet

You can try read-only Taira checks before running a local peer or creating a
signer. These commands use public Torii JSON routes and do not spend testnet
XOR.

Check Taira status:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

List public domains in the `universal` data space:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

List a few asset definitions and their current supply:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

If you have the current `iroha` binary, run the Taira diagnostics helper:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Create `taira.client.toml` only when you are ready to test signed commands.
See [Connect to SORA Nexus Data spaces](/get-started/sora-nexus-dataspaces.md)
for the config, faucet, and smoke-test flow. Do not run write commands
against Taira until the account is funded with the faucet fee asset.

For any fee-paying Taira CLI example, fund the signer with the prepared
faucet flow in
[Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira),
then check the balance:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

If a faucet route returns `502`, wait and retry. That is a public testnet
availability issue, not a signal to regenerate the account keys.

After the balance is visible, submit writes with `--fee-payer authority`.
The CLI quotes the exact fee, in Taira's fee asset, before signing:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. Basic Ledger Commands

List all domains:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

Ordinary domain creation uses the declarative alias planner; the `ledger
domain` command has no `register` subcommand. Prepare a secret-free
`AliasSetupPlanRequestV1` intent for `docs.universal` with your SDK or
onboarding service, then plan and apply it:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

The intent pins the data space ID, canonical owner account, lease term, and
current quote guard. The planner verifies live state and returns the exact
atomic `EnsureAlias` plan to submit. Do not hand-copy guard values from another
network.

Send a simple ping transaction:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

Read a recent block or subscribe to block events:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Operator Commands

Consensus operator commands require an allow-listed runtime key. Keep it out
of `client.toml` and pass the owner-only file by its absolute path:

```bash
: "${OPERATOR_KEY_FILE:=$PWD/secrets/operator.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

Non-authoritative queue, pipeline, election, and lane diagnostics:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

Committed consensus lanes and this node's instance status:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

On-chain consensus parameters:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. Where to Go Next

- [SDK tutorials](/guide/tutorials/)
- [Torii endpoints](/reference/torii-endpoints.md)
- [Working with Iroha binaries](/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

To print a full Markdown help snapshot from the source checkout, run:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
