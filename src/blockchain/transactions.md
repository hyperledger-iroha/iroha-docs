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
envelope, the correct chain ID and network ID, an explicit fee payer, and a
faucet-funded Taira account.

For fee-paying examples on Taira, fund the signer with the prepared faucet
flow in
[Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira),
then check the fee asset balance:

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

If a faucet route returns `502`, wait and retry before debugging the
transaction itself.

Then select the fee payer when submitting the transaction. With
`--fee-payer authority`, the signing account pays, and the CLI quotes the
exact fee in Taira's fee asset before signing:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "faucet-funded taira transaction"
```

## Offline Transactions

Iroha has two offline transaction workflows:

- **Offline signing** creates a normal signed transaction while the signing
  device is disconnected. The transaction is not processed until an online
  client submits the signed envelope to Torii, so it still needs the
  correct chain ID, authority, permissions, fees, and transaction lifetime.
- **Kagemusha offline cash** loads value into an enrolled hardware-backed
  wallet while it is online, supports wallet-to-wallet payments while both
  wallets are offline, and unloads the remaining value to a ledger account
  when the wallet is online again.

Torii exposes one Kagemusha mutation route, `POST /v1/kagemusha/enrollment`. It
accepts account-authenticated `application/x-norito` enrollment frames and
returns private responses that must not be cached. Account-signed SDK read
routes under `/v1/kagemusha/{scheme}/wallets/{wallet}/` return Load receipts
and finality evidence; they are not listed in `/openapi.json`. The ledger side of the
lifecycle uses ordinary signed transactions that carry a
`KagemushaWalletLedgerV1` instruction:

| Action | Purpose |
| --- | --- |
| `Activate` | Activate an enrolled wallet; native bootstrap verification is mandatory |
| `IssueLoad` | Debit the payer and record the wallet's next Load atomically |
| `Unload` | Pay a complete Unload claim to its bound account at most once |
| `ClaimFee` | Pay a complete fee claim to its fixed beneficiary |
| `Abandon` | Abandon an unused enrollment |

The typical flow is:

1. Enroll the wallet through `/v1/kagemusha/enrollment` with a typed Swift
   or Android wallet, then activate it.
2. Submit an `IssueLoad` transaction. Execution checks the expected next
   Load ordinal and the nonzero request ID, so a stale or changed retry
   fails. After a lost response, read the original Load receipt instead of
   signing another Load.
3. Exchange and verify payments between wallets locally while they are
   offline, and persist the wallet state before acknowledging each
   transfer.
4. When the wallet is online again, submit its Unload claim and wait for
   finality.

Kagemusha is not release-qualified: live monetary qualification and phone
registration, activation, and payment on physical devices remain open.

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
// `network_id` is the target network's `NetworkId`; the fee intent is bound
// into the signature (use the intent returned by a fee quote).
let grant_role_tx = TransactionBuilder::new(
    network_id,
    mouse_id,
    FeePaymentIntent::authority(Vec::new(), None),
)
.with_instructions([grant_role])
.sign(&mouse_private_key);
```
