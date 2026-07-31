# Transactions

A **transaction** is a signed request to execute work on the blockchain.
The executable payload can be an ordered sequence of
[instructions](./instructions.md), a contract call, IVM bytecode, or a
proved IVM execution. See [Smart Contracts](./smart-contracts.md) for the current
contract execution model.

Transactions perform state-changing or executable work. Read-only inspection
uses signed queries or public read endpoints and does not create a transaction.

A transaction admitted into a committed block is stored with its execution
result, including an execution rejection. Requests rejected before block
admission, such as an invalid envelope or a transaction refused by the queue,
are not stored in a block.

For privacy-preserving asset movement, see
[Anonymous Transactions](./anonymous-transactions.md). Anonymous
transactions use shielded asset notes, commitments, nullifiers, and
zero-knowledge proofs instead of public account-to-account balance changes.

For proof evidence over selected transparent execution effects, see
[FastPQ](./fastpq.md). FastPQ consumes execution witnesses after normal
transaction execution and builds deterministic proof batches for supported
state transitions.

## Try It on Taira

Use the explorer routes to inspect recent public Taira blocks and transaction
statuses without a signing account:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

To follow a transaction your app submitted earlier, copy the `hash` from the
list and inspect the explorer detail route:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

This is still read-only. Submitting a transaction requires a signed Norito
envelope, correct chain ID, fee metadata, and a faucet-funded Taira account.

For fee-paying examples on Taira, save the faucet helper from
[Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
as `taira_faucet_claim.py`, then fund the signer through the public faucet
first:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

If the faucet puzzle or claim route returns `502`, wait and retry before
debugging the transaction itself.

Then attach the Taira fee asset metadata when submitting the transaction:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Offline Transactions

Iroha has two offline transaction workflows:

- **Offline signing** creates a normal signed transaction while the signing
  device is disconnected. The transaction is not processed until an online
  client submits the signed envelope to Torii, so it still needs the
  correct chain ID, authority, permissions, fees, and transaction lifetime.
- **Kagemusha offline cash** tops up a wallet while it is online, supports
  receiver-initiated wallet-to-wallet handoffs while both wallets are
  offline, and redeems the resulting note state when the recipient returns
  online.

Torii exposes the complete Kagemusha lifecycle under `/v1/offline/*`:

| Method and endpoint | Purpose |
| --- | --- |
| `GET /v1/offline/readiness` | Evaluate Kagemusha readiness for one `asset_definition_id` |
| `POST /v1/offline/receiver-lineage` | Resolve proof-bearing active registration lineage for a signed receiver request |
| `POST /v1/offline/top-up` | Submit a signed online-to-offline top-up operation |
| `POST /v1/offline/redeem` | Submit a signed offline redemption operation |
| `GET /v1/offline/operations/{operation_id}` | Read the canonical status of a top-up or redemption |

Check readiness for the asset before constructing an offline operation:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

Readiness binds the wallet to the active bridge ABI 21 and authenticated V4
artifact set. The lineage, top-up, and redemption requests use typed
`application/x-norito` archives. Top-up and redemption return `202 Accepted`
with a `Location` header pointing to the operation resource; the embedded
nonzero operation ID supplies the idempotency key.

The typical flow is:

1. Query readiness and stop if `ready` is false or any blocker applies.
2. Use a typed Swift or JVM wallet to build the canonical top-up archive,
   submit it, and retain both the input note state and operation ID until
   the operation reaches a final chain state.
3. Resolve receiver registration lineage when required, construct and
   verify each peer handoff locally, and persist the encrypted note state
   before acknowledging the transfer.
4. When the recipient is online, build the canonical redemption archive,
   submit it, and poll its operation resource to finality.

The ledger cannot observe a conflicting offline handoff until note state
returns through the online lifecycle. Wallet and operator policy should
therefore enforce value limits, expiry, accepted issuers, durable local
storage, and reconciliation windows.

Here is an example of creating a new transaction with the `Grant`
instruction. In this transaction, Mouse is granting Alice the specified
role (`role_id`). Check
[the full example](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
