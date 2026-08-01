# Domains

Domains are named namespaces registered in the `World`. In the current Iroha
3 data model a domain is qualified by its parent dataspace, so the canonical
identifier is:

```text
domain.dataspace
```

For example, `payments.universal` names the `payments` domain inside the
`universal` dataspace.

## Structure

A registered `Domain` contains:

- `id`: the dataspace-qualified `DomainId`
- `logo`: an optional `SoraFS` URI for a domain logo
- `metadata`: arbitrary key-value metadata
- `owned_by`: the account that owns the domain, normally the account that
  registered it

The bootstrap payload used to materialize a domain is `NewDomain`. It carries
the `id`, optional `logo`, and initial `metadata`. The runtime fills
`owned_by` from the authority. Ordinary clients do not submit this payload
directly.

## Registration

Ordinary domain creation uses the declarative alias setup flow. This keeps the
SNS lease, owner capabilities, quote guard, and domain row in one atomic
`EnsureAlias` transaction. `Register::Domain` remains a genesis/bootstrap
surface, and the `ledger domain` command has no `register` subcommand.

Create a secret-free `AliasSetupPlanRequestV1` intent with an SDK or onboarding
service, then have the CLI plan it against live state and submit that exact
plan:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

The intent identifies `payments.universal`, its numeric dataspace, canonical
I105 owner, lease acquisition term, and current policy/payment quote guard.
The planner endpoint is `POST /v1/aliases/setup/plan`; its returned plan is
chain-, authority-, state-, and deadline-bound. Domain removal still uses
[`Unregister`](/blockchain/instructions.md#un-register).

Creating or removing a domain requires the appropriate domain-management
permission under the active runtime validator. Domain metadata can be updated with
[`SetKeyValue` and `RemoveKeyValue`](/blockchain/instructions.md#setkeyvalue-removekeyvalue)
when the authority has permission to modify that domain.

## Try It on Taira

List the domains currently visible on the public Taira testnet:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Map the public lane catalog back to dataspace aliases:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Use the first command when an app needs to check whether a domain exists. Use
the lane catalog when you need to confirm whether a dataspace is public,
restricted, or lagging behind the core lane.

Domain setup is a fee-paying write. Before trying it on Taira, save the
faucet helper from
[Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
as `taira_faucet_claim.py`, fund the signer through the public faucet, and
attach fee metadata:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Build the intent for a unique domain name on repeated testnet runs, and use
Taira's current policy and fee-asset quote guard. Do not reuse a plan produced
for localnet or Minamoto.

## Relationship to other entities

Domains group ledger objects and provide a namespace for domain-scoped data.
Asset definitions use domain-qualified identifiers, and queries can list
domains or find objects scoped to a domain. Accounts themselves are
domainless in the current data model, but accounts can own domains and hold
assets whose definitions live under domains.

See also:

- [World](/blockchain/world.md)
- [Assets](/blockchain/assets.md)
- [Metadata](/blockchain/metadata.md)
- [Naming rules](/reference/naming.md)
