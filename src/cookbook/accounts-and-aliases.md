# Accounts and Aliases

## Outcome

Work safely with domainless canonical I105 account IDs and separately bound
human-readable aliases such as `treasury@payments.universal`. You will
inspect Taira accounts, derive your own canonical ID, and resolve aliases
without confusing routing context with identity.

## Prerequisites

- `curl`, `jq`, Python 3.11 or later, and the current `iroha` CLI.
- A `taira.client.toml` from [Connect to Taira](./connect-to-taira.md) when
  inspecting your own account.
- An account provisioned through the Taira faucet or the network's governed
  onboarding path before expecting an account-specific read to succeed.

## Steps

### 1. Inspect canonical accounts on Taira

The public account list always returns canonical I105 IDs. A primary alias
is optional and is reported separately.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

An ID from `.id` is valid for strict account fields. Do not append a domain
to it. An alias from `.primary_alias` is a user-facing lookup key, not
another canonical identity.

### 2. Derive and normalize your Taira I105 ID

Read only the public key from the local configuration. The same public key
is encoded differently for different public-network profiles, so select
`taira` explicitly.

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

The normalized value should be identical to `TAIRA_ACCOUNT_ID`. The
`[account].domain` setting in the TOML file can be `wonderland.universal`,
but that value affects routing and alias context only.

### 3. Read the account and its assets

After the account is provisioned, query it directly and list a bounded
asset page. URL-encode the I105 value before using it in a path.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4. Look up aliases bound to the account

The reverse resolver accepts one exact canonical account ID. Public
dataspace rows can be read without request-signature headers; restricted
dataspaces require an authorized signed request.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` is valid: an account does not need an alias. When a binding
exists, resolve its exact fully qualified alias and compare the returned
account ID:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning Permission boundary

The Taira faucet can provision its claimant account, but that does not
grant general account-registration or alias-management authority.
Registering another account requires `CanRegisterAccount` under the active
validator. Account aliases normally also require an active SNS lease and
the appropriate alias permissions. Use the governed onboarding/alias
planner, or rehearse registration against the generated local network.

:::

On a local network, once a secure signer-provisioning step has exported a
new canonical `NEW_ACCOUNT_ID`, the registration surface is:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Generate and store the matching private key outside the documentation or
application repository. Registering an ID whose controller key was
discarded creates an unusable account.

## Verify

Prove that the config public key, I105 encoding, and alias binding all
converge on one canonical account ID:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

Store canonical account IDs. Use canonical IDs for signatures, permissions,
and transaction instructions. Resolve an alias at the application boundary.
Retain the canonical account ID used for the operation.

## Troubleshooting

- A parse or prefix error usually means an address was encoded for a
  different network profile. Normalize with `--profile taira` and reject
  mismatches.
- An account `404` after a faucet `202` can be propagation delay. Poll the
  account or funded asset before sending a write.
- `total: 0` from the reverse resolver means no visible alias is bound; it
  is not an account lookup failure.
- `401` or `403` from an alias route indicates a restricted dataspace or
  insufficient exact resolve permission. Do not use broad prefix search as
  a fallback.
- A readable `name@domain.dataspace` value is not accepted everywhere a
  canonical I105 ID is required. Resolve it first.
- If local account registration succeeds but Taira rejects it, the
  difference is authorization. Obtain `CanRegisterAccount`; do not change
  the account ID to bypass validation.

## Source and related docs

- [Canonical account address implementation at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [Account and alias Torii tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Accounts](/blockchain/accounts.md)
- [Data-model aliases](/blockchain/data-model.md#aliases)
- [Naming conventions](/reference/naming.md)
- [Permission tokens](/reference/permissions.md)
