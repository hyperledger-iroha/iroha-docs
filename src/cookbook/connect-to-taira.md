# Connect to Taira

## Outcome

Confirm that Taira is reachable, derive the canonical I105 account ID from
a local client configuration, fund the signer with testnet XOR, and submit
one fee-quoted canary transaction. This recipe never sends a write to
Minamoto.

## Prerequisites

- `curl`, `jq`, Python 3.11 or later, and current `iroha` and `kagami`
  binaries.
- A `taira.client.toml` created with the Taira chain, exact `network_id`,
  endpoint, account profile, and a dedicated testnet key. Follow
  [Create a Taira Client Config](/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config)
  and keep the file out of source control.
- A writable working directory for the faucet journal:
  `iroha taira account faucet prepare` creates `./taira-faucet` privately
  and refuses to replace an existing directory.

## Steps

### 1. Separate liveness from readiness

`/livez`, `/health`, and `/readyz` are plain-text probes; `/status` returns
JSON. A running node can legitimately return `503` from `/readyz` when
consensus admission or another required subsystem is unavailable.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Use `/livez` only to decide whether the process answers. Use `/readyz` for
traffic admission. Its `503` is a `service_unavailable` error envelope with
no blocker details, so run the diagnostics below before treating it as an
outage.

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
I105 profile. The account ID carries no domain; `[account].profile` selects
only its network prefix.

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

The faucet policy names the current fee asset definition. Keep its Base58
ID instead of copying an ID from another network or an old run. The policy
is unsigned discovery data, so automation should pin the issuer, asset
definition, and amount it expects instead of trusting each response.

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` solves the proof of work and saves the exact signed transaction;
`submit` sends it once and returns after it is applied. If `submit` reports
`Pending` or times out, run `taira account faucet resume` with the same
config and journal instead of preparing another claim. Then poll the
balance for at most one minute.

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

Use `--fee-payer authority` for every Taira write. The selection is
signature-bound, and the CLI quotes the exact fee, in Taira's fee asset,
before signing.

## Verify

Submit a log instruction, keep the JSON receipt, and wait for Applied
finality. Omitting `--no-wait` also makes the initial submission wait for
confirmation; the explicit status read proves the final pipeline state.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

The final command succeeds only after exact global status reports
state-resolved `Applied` finality. Keep the hash in test evidence; never
store the private key or the complete client config with it.

## Troubleshooting

- `/livez`, `/health`, and `/readyz` return `406` when asked only for JSON
  because they answer in `text/plain`. Send the `Accept` headers shown
  above.
- `/readyz` may return `503` with a `service_unavailable` error envelope
  even while `/livez` and `/status` work. Wait for readiness or run
  `iroha taira doctor`; regenerating keys will not change node readiness.
- A faucet `502` or timeout during `submit` leaves the claim's outcome
  unknown: run `taira account faucet resume` with the same config and
  journal instead of preparing another claim. A stale proof-of-work anchor
  fails `prepare`; prepare again in a new journal directory.
- An I105 prefix error means the public key was encoded with the wrong
  profile. Re-run `iroha tools address convert --profile taira`.
- A fee-quote rejection usually means the authority is not funded or the
  configured `network_id` is not Taira's. A missing `--fee-payer`, or a fee
  key such as `gas_asset_id` in `--metadata`, fails locally before the
  quote.
- Registration, minting, or namespace management can still be rejected
  after this canary succeeds. Those operations require separate runtime
  permissions; rehearse them on the generated local network when Taira
  access has not been granted.

## Source and related docs

- [Taira CLI diagnostics and canary source](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs)
  and [faucet commands](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs)
  at the pinned commit
- [Explicit fee selection and CLI submission source at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Taira account and faucet guide](/get-started/sora-nexus-dataspaces.md)
- [Client configuration](/guide/configure/client-configuration.md)
- [Transactions](/blockchain/transactions.md)
