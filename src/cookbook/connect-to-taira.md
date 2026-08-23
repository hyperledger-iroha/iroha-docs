# Connect to Taira

## Outcome

Confirm that Taira is reachable, derive the canonical I105 account ID from
a local client configuration, fund the signer with testnet XOR, and submit
one fee-quoted canary transaction. This recipe never sends a write to
Minamoto.

## Prerequisites

- `curl`, `jq`, Python 3.11 or later, and current `iroha` and `kagami`
  binaries.
- A `taira.client.toml` created with the Taira chain, endpoint, account
  profile, and a dedicated testnet key. Follow
  [Create a Taira Client Config](/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config)
  and keep the file out of source control.
- The ready-to-run `taira_faucet_claim.py` from
  [Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira),
  saved beside the client config.

## Steps

### 1. Separate liveness from readiness

`/livez` is a plain-text process-liveness probe. `/status`, `/health`, and
`/readyz` return JSON. A running node can legitimately return `503` from
the readiness probes when a required subsystem is blocked.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Use `/livez` only to decide whether the process answers. Use `/readyz` for
traffic admission and inspect its JSON blocker details before treating a
`503` as an outage.

### 2. Run the public diagnostics

This check is read-only and does not load the signer config:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Do not continue to a write when the doctor reports a hard DNS, TLS, chain,
or endpoint failure. A saturated public queue is transient; wait and retry
with a bounded policy.

### 3. Derive the Taira account ID without printing a secret

Read only the public key from the config, then encode it with the Taira
I105 profile. The `[account].domain` value supplies routing context; it is
not part of the account ID.

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
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

The output is a domainless canonical I105 address. Names such as
`wallet@payments.universal` are aliases and must be resolved before they
are used in strict account fields.

### 4. Claim the current Taira fee asset

The faucet response is the source of truth for the fee asset definition.
Keep the returned Base58 ID instead of copying an ID from another network
or an old run.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Poll the balance for at most one minute. The faucet can return
`202 Accepted` before the funding transaction is visible.

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

`gas_asset_id` is transaction metadata. The explicit
`--fee-payer authority` selection is signature-bound, and the CLI obtains
an exact fee quote before it signs.

## Verify

Submit a log instruction, keep the JSON receipt, and wait for Applied
finality. Omitting `--no-wait` also makes the initial submission wait for
confirmation; the explicit status read proves the final pipeline state.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

The final command succeeds only after the transaction reaches the default
`Applied` terminal state. Keep the hash in test evidence; never store the
private key or the complete client config with it.

## Troubleshooting

- `/livez` returns `406` when asked for JSON because that endpoint is
  `text/plain`. Send `Accept: text/plain` as shown above.
- `/health` or `/readyz` may return `503` with a machine-readable blocker
  even while `/livez` and `/status` work. Fix or wait for that blocker;
  regenerating keys will not change node readiness.
- A faucet `502`, timeout, or stale proof-of-work anchor is a
  public-service failure. Fetch a new puzzle and retry later.
- An I105 prefix error means the public key was encoded with the wrong
  profile. Re-run `iroha tools address convert --profile taira`.
- A fee-quote rejection usually means the authority was not funded, the fee
  asset metadata is stale, or no explicit fee payer was selected.
- Registration, minting, or namespace management can still be rejected
  after this canary succeeds. Those operations require separate runtime
  permissions; rehearse them on the generated local network when Taira
  access has not been granted.

## Source and related docs

- [Taira CLI diagnostics and canary source at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/taira.rs)
- [Explicit fee selection and CLI submission source at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Taira account and faucet guide](/get-started/sora-nexus-dataspaces.md)
- [Client configuration](/guide/configure/client-configuration.md)
- [Transactions](/blockchain/transactions.md)
