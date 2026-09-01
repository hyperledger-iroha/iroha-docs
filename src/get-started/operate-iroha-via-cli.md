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

- `account` for account-oriented shortcuts
- `tx` for transaction-level helpers
- `ledger` for on-ledger reads and writes
- `ops` for operator diagnostics
- `app` for app API helpers
- `contract` for contract deployment and calls
- `tools` for diagnostics and developer utilities
- `taira` for Taira and Nexus-oriented workflows

The `ledger` group also contains domain-specific transaction helpers such as
`ledger transaction`.

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

List public domains in the `universal` dataspace:

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
See [Connect to SORA Nexus Dataspaces](/get-started/sora-nexus-dataspaces.md)
for the config, faucet, and canary flow. Do not run write commands against
Taira until the account is funded with the faucet fee asset.

For any fee-paying Taira CLI example, save the faucet helper from
[Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
as `taira_faucet_claim.py`, then claim testnet XOR first:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

If the faucet puzzle or claim route returns `502`, wait and retry. That is a
public testnet availability issue, not a signal to regenerate the account keys.

After the balance is visible, attach the fee asset metadata to writes:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Basic Ledger Commands

List all domains:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
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

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

The intent pins the dataspace ID, canonical owner account, lease term, and
current quote guard. The planner verifies live state and returns the exact
atomic `EnsureAlias` plan to submit. Do not hand-copy guard values from another
network.

Send a simple ping transaction:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Read a recent block or subscribe to block events:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Operator Commands

Consensus operator commands require an allow-listed runtime key. Keep it out
of `client.toml` and pass the owner-only file explicitly:

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

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

Highest and locked quorum certificates:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
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
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

To regenerate a full Markdown help snapshot from the source checkout, run:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
