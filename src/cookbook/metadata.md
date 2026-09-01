# Metadata

## Outcome

Read metadata on Taira, set and verify one account metadata value with an
explicitly fee-paying transaction, and remove the value again. You will
keep ledger-object metadata separate from transaction fee metadata.

## Prerequisites

- `curl`, `jq`, Python 3.11 or later, and the current `iroha` CLI.
- A funded `taira.client.toml` and `taira.tx-metadata.json` from
  [Connect to Taira](./connect-to-taira.md).
- Authority over the target account's metadata. The example targets the
  configured authority itself; another account requires an exact
  permission.

## Steps

### 1. Read metadata without a signer

Metadata is a checked `Name` to JSON map. Empty maps and empty filtered
output are valid results.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

Use metadata for small descriptive or indexing fields. Put large payloads
off-ledger and store a digest, URI, or SoraFS reference instead.

### 2. Derive the target account

Read only the public key from the Taira config and convert it to the
canonical domainless I105 form.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
```

### 3. Set one JSON value

The JSON read from standard input becomes the account's `cookbook_profile`
value. By contrast, `--metadata ./taira.tx-metadata.json` attaches fee
fields to the transaction envelope. The two maps have different targets and
purposes.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

The CLI quotes the fee, signs, submits, and waits by default. Do not add
`--no-wait` when the next operation depends on this value.

::: warning Permission boundary

The active validator decides who may mutate each object. Updating another
account normally requires `CanModifyAccountMetadata`; domains, asset
definitions, NFTs, and triggers have their own target-specific metadata
permissions. If Taira has not granted the required authority, run the same
account commands with `./localnet/client.toml`, substitute the generated
localnet authority's canonical I105 ID, and omit the Taira fee metadata
file. Keep the explicit local fee-payer selection.

:::

### 4. Remove the key

First read the committed value, then submit a separate removal transaction.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

For Python applications, the matching typed builders are
`Instruction.set_account_key_value` and
`Instruction.remove_account_key_value`; submit them with the transaction
metadata and waiting helper from the
[Python tutorial](/guide/tutorials/python.md#shared-setup).

## Verify

After the set transaction, `meta get` must return the object with
`version: 1`. After removal, a direct lookup must no longer return a value:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

The separate account read distinguishes a missing metadata key from a
network or account failure. Production code should also verify the whole
JSON value after setting it.

## Troubleshooting

- Standard input must contain one valid JSON value. Strings need JSON
  quotes; objects and arrays must be well formed.
- Metadata keys are `Name` values and are case-sensitive after parsing.
  Keep a stable key vocabulary instead of creating versioned keys for every
  schema change.
- `--metadata` is transaction metadata; it does not set ledger-object
  metadata. Use the entity's `meta set` subcommand for the latter.
- A successful submission followed by an old read can be propagation delay.
  Wait for Applied finality and retry the query before resubmitting.
- A permission rejection identifies the target object and authority
  boundary. Rehearse locally or request the exact token; do not move
  private application data into a public metadata field to avoid access
  control.
- Never store private keys, raw personal identifiers, access tokens, or
  large documents in metadata.

## Source and related docs

- [Metadata query integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK transaction builders at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Metadata](/blockchain/metadata.md)
- [Metadata and ledger storage choices](/guide/configure/metadata-and-store-assets.md)
- [Instruction reference](/reference/instructions.md)
- [Permission tokens](/reference/permissions.md)
