# Submit and Verify Transactions

## Outcome

Preflight a Taira transaction, accept an exact fee quote, sign and submit
it, wait for Applied finality, and verify the committed transaction by
hash.

## Prerequisites

- A funded `taira.client.toml`, `taira.tx-metadata.json`, and
  `TAIRA_ACCOUNT_ID` produced by [Connect to Taira](./connect-to-taira.md).
- The current `iroha` CLI and `jq`.
- A disposable Taira signer. Do not reuse its key or these write commands
  on Minamoto.

## Steps

### 1. Preflight the endpoint, authority, and fee balance

Read the queue snapshot first, then prove that the authority's fee balance
is visible. Read the Base58 asset-definition ID from the metadata generated
by the connection recipe.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Stop if the account or fee balance is absent. A valid instruction cannot
pass fee admission when its authority cannot pay.

### 2. Quote, sign, and submit once

The CLI sends the exact unsigned payload for a fee quote, binds the
accepted payment intent into the transaction, signs, and submits. JSON mode
returns the transaction hash, signed transaction, and accepted quote
together.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

Do not use `--no-wait` in this recipe. The command waits for confirmation
before it writes a successful receipt.

### 3. Wait for terminal pipeline state

Use the typed status helper instead of inferring success from HTTP
acceptance or queue admission. With `--wait`, the safe routing scope is
selected automatically and the default target is Applied finality.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` and `Expired` are terminal failures, not retryable success
states. Record their reason before changing or rebuilding the transaction.

### 4. Read the stored transaction

Pipeline status answers whether processing finished. A transaction query
verifies that the admitted transaction is stored under the same hash.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

The explorer is a second, read-only observation surface. It can lag briefly
behind pipeline finality.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

For a state-changing instruction, finish with a query of the object that
was mutated. The [Metadata](./metadata.md),
[Fungible assets](./fungible-assets.md), and [NFTs](./nfts.md) recipes
include those post-state reads.

## Verify

Check that all three records agree on the same hash and that the explorer
no longer reports a pending state:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Keep the submission receipt and final status as test evidence. They contain
public transaction material, not the signing key.

## Troubleshooting

- HTTP `202` or a queued status proves only admission. Continue polling the
  typed status until Applied, Rejected, Expired, or the bounded timeout.
- If submission times out after returning a hash, query that hash before
  building another transaction. Blind resubmission creates a new quoted and
  signed payload.
- A fee quote can be rejected before signing. Check
  `--fee-payer authority`, `gas_asset_id`, the authority's balance, and the
  network chain ID.
- `Rejected` usually indicates instruction validation, permissions, fees,
  or stale state. It is committed evidence of a failed execution and should
  not be reclassified as a transport retry.
- An explorer `404` immediately after Applied can be indexing lag. Retry
  the read; do not resubmit the transaction.
- If a privileged instruction works on a generated localnet but Taira
  rejects it, obtain the exact Taira permission or governed namespace
  assignment. The local result does not grant public-network authority.

## Source and related docs

- [Transaction submission and fee-quote implementation at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Transaction confirmation tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/tests/tx_confirmation.rs)
- [Transactions](/blockchain/transactions.md)
- [CLI guide](/get-started/operate-iroha-via-cli.md)
- [Torii endpoints](/reference/torii-endpoints.md)
