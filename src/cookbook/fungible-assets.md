# Fungible Assets

## Outcome

Inspect live Taira asset definitions and complete a register, mint,
transfer, burn, and balance-verification flow on a generated local network.
The recipe uses canonical unprefixed Base58 asset-definition IDs,
domain-qualified aliases, domainless I105 account IDs, and explicit fee
payment.

## Prerequisites

- `curl`, `jq`, Python 3.11 or later, Node.js 24, and the current `iroha`
  CLI.
- Read-only Taira access.
- For the write walkthrough, a generated local network from
  [Launch Iroha](/get-started/launch-iroha.md), with
  `./localnet/client.toml` and Torii on `http://127.0.0.1:8080`.

## Steps

### 1. Inspect Taira definitions without a signer

Asset definitions carry an opaque Base58 ID, display name, mintability
policy, numeric scale, optional alias, owner, and total quantity. The
concrete balance also includes its holder account and optional dataspace
scope.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

Run the JavaScript form with `node taira-assets.mjs`. Public asset IDs are
bare Base58 values; a readable value such as
`cookbook_credit#wonderland.universal` is an alias that resolves to one of
those IDs.

### 2. Prepare the local authority and destination

Derive the local authority from the public key in the generated config and
choose another registered account as the recipient. No private key is
printed.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. Register a numeric definition

This local-only ID is a valid unprefixed Base58 asset-definition address.
The alias supplies the human-readable `domain.dataspace` projection. Scale
`2` permits two fractional digits; omitting `--mint-once` keeps the default
`Infinitely` policy.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

Do not reuse that ID on Taira. Public-network registration requires a fresh
canonical ID, a domain/alias allocated to your application, fee funding,
and the runtime's asset-registration permission.

### 4. Mint, transfer, and burn

All write commands select the authority as fee payer explicitly. The CLI
quotes the exact transaction before signing and waits by default.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

After the burn, expect source balance `64.50`, destination balance `25.50`,
and total quantity `90.00`.

::: warning Permission boundary

On Taira, attach the faucet-derived `taira.tx-metadata.json` and use
`--fee-payer authority` for every write. Registration and minting require
the active validator's permissions; transfer and burn require authority
over the source balance. A faucet-funded account is not automatically an
issuer.

:::

## Verify

Read both concrete balances and then the definition. These post-state
queries are the success criterion; a submission receipt by itself is not.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Application assertions should compare numeric values as fixed-point
decimals, not binary floating-point values, and should verify the
definition ID as well as the account.

## Troubleshooting

- An ID containing `#` is an alias or concrete balance literal, not a
  canonical asset-definition ID. Use the bare Base58 value with
  `--definition`, or pass a bound alias with `--definition-alias`.
- `Scale` errors mean a quantity has more fractional digits than the
  definition permits.
- `Mintability` rejection means the `Once`, `Not`, or `Limited(n)` policy
  has exhausted or disallowed minting. Do not rewrite history; use the
  policy returned by the definition query.
- Step 2 deliberately chooses a registered destination account. If asset
  admission is `ExplicitOnly`, provision the destination balance through an
  authorized flow before transferring. The similarly named CLI guard does
  not register an account or balance; it aborts instead of adding another
  instruction.
- A fee rejection occurs before normal instruction success. Select the
  payer, use the network's fee asset metadata, and verify its balance.
- If the fixed local definition already exists from an earlier run, launch
  a fresh generated localnet or continue with its existing state. Never
  substitute a malformed random string for the Base58 ID.

## Source and related docs

- [Asset lifecycle integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust asset construction examples at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Assets](/blockchain/assets.md)
- [Instructions](/blockchain/instructions.md)
- [Permission tokens](/reference/permissions.md)
- [JavaScript and TypeScript](/guide/tutorials/javascript.md)
