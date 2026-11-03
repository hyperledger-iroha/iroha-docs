# Fungible Assets

## Outcome

Inspect live Taira asset definitions and complete a mint, transfer, burn,
and balance-verification flow on a generated local network. The recipe
uses canonical unprefixed Base58 asset-definition IDs, domainless I105
account IDs, and explicit fee payment.

## Prerequisites

- `curl`, `jq`, Python 3.11 or later, Node.js 24, and the current `iroha`
  and `kagami` CLIs.
- Read-only Taira access.
- For the write walkthrough, a local network from
  `kagami localnet generate --peers 4 --out-dir ./localnet` as in
  [Launch Iroha](/get-started/launch-iroha.md), with
  `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa` added. It provides
  `./localnet/client.toml` and Torii on `http://127.0.0.1:8080`.

## Steps

### 1. Inspect Taira definitions without a signer

Asset definitions carry an opaque Base58 ID, display name, mintability
policy, numeric scale, optional alias, owner, optional owning domain or
dataspace, balance policy, and total quantity. The concrete balance also
includes its holder account and optional dataspace scope.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
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

Derive the local authority from the public key in the generated config,
then create a key pair for a fresh recipient account and register it. No
private key is printed.

```bash
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

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. Use a client-owned numeric definition

Outside genesis, a definition is registered under an owning `--domain`
that the signer owns, and a generated localnet's client owns none. The
localnet generated with `--asset-definition-id` already holds this
definition: genesis registered it with an unconstrained scale, made the
client its owner, and minted 1,000,000,000 units to the client.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Do not reuse that ID on Taira. Public-network registration requires a fresh
canonical ID, an owning domain that your account owns (passed to
`ledger asset definition register` as `--domain`), a
`CanManageAssetDefinitionAlias` grant for any alias, and fee funding.

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

After the burn, expect source balance `1000000064.50`, destination balance
`25.50`, and total quantity `1000000090.00`.

::: warning Permission boundary

On Taira, use `--fee-payer authority` for every write; the CLI quotes the
exact fee, in Taira's fee asset, before signing. Registration requires
owning the definition's `--domain`, and an alias also needs
`CanManageAssetDefinitionAlias`. Minting requires owning the definition or
holding `CanMintAssetWithDefinition` or `CanMintAssetToAccount`; transfer
and burn require authority over the source balance. A faucet-funded
account is not automatically an issuer.

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
- Step 2 registers the destination account explicitly, so the transfer
  also works when account admission is `ExplicitOnly`. The similarly named
  CLI guard does not register an account or balance; it aborts instead of
  adding another instruction.
- A fee rejection occurs before normal instruction success. Select the
  payer, check the fee asset and maximum in the CLI's fee quote, and verify
  that balance.
- A rerun on the same localnet starts from the earlier balances, and
  `kagami keys` refuses an existing `./cookbook-recipient`. Launch a fresh
  generated localnet and remove that directory, or compare balance changes
  instead of absolute values. Never substitute a malformed random string
  for the Base58 ID.

## Source and related docs

- [Asset lifecycle integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust asset construction examples at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [Assets](/blockchain/assets.md)
- [Instructions](/blockchain/instructions.md)
- [Permission tokens](/reference/permissions.md)
- [JavaScript and TypeScript](/guide/tutorials/javascript.md)
