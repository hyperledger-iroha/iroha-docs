# Build on SORA Nexus with Taira and Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA Nexus runs on Iroha 3. Develop and test your application on Taira first.
Move the same client configuration to Minamoto only after you have separate
mainnet keys, real XOR for fees, and production approval.

This guide shows how to configure an Iroha client for the two public
SORA Nexus networks.

- Taira testnet at `https://taira.sora.org`
- Minamoto mainnet at `https://minamoto.sora.org`

Use Taira for integration tests, faucet-funded write canaries, and
deployment rehearsals. Use Minamoto only for production-ready mainnet
activity. Both networks charge fees in XOR:

- Taira uses testnet XOR from the public faucet.
- Minamoto uses real XOR. There is no Minamoto faucet.

## Builder Path

| Step                        | Taira Testnet                                                | Minamoto Mainnet                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| Start reading network state | Query `/status` without keys                                 | Confirm the endpoint and its TLS certificate first |
| Pick a data space            | Use public `universal` unless your app needs its own governed data space | Use the same data space only after mainnet approval |
| Get fee asset               | Use the public Taira faucet                                  | Receive XOR from a funded Minamoto account or approved treasury flow |
| Test writes                 | Use faucet-funded test XOR                                   | Do not use test tooling; writes spend real XOR     |
| Promote                     | Keep retry logic, monitoring, and signer handling            | Use separate keys, funding, and release controls   |

The practical flow is:

1. Build the client against Taira and use the public `universal` data space.
2. Add a signer and fund it with the Taira faucet.
3. Exercise your app logic against Taira until failures are boring and
   observable.
4. Create a separate Minamoto signer, fund it with real XOR, and move only
   the same proven operations to mainnet.

## Continue with the Cookbook

Use this guide to choose a network, configure a signer, and fund fees. Then
continue with the recipe that matches the application behavior you want to
build:

| Goal | Recipe |
| --- | --- |
| Check Taira and configure a client | [Connect to Taira](/cookbook/connect-to-taira.md) |
| Send a first write and verify its result | [Submit and Verify Transactions](/cookbook/submit-and-verify-transactions.md) |
| Register, mint, and move value | [Fungible Assets](/cookbook/fungible-assets.md) |
| Read filtered application state | [Query Ledger State](/cookbook/query-ledger-state.md) |
| React to committed changes | [Stream Events](/cookbook/stream-events.md) |

The cookbook keeps each workflow focused and links back here when it needs
Taira funding or SORA Nexus network context.

## 1. Understand What You Are Setting Up

In SORA Nexus, the data space catalog defines data spaces. The lane catalog defines lanes separately: each lane references one data space, and a data space can have multiple lanes. A client does not create a new public data space just by changing `client.toml`. Client setup does two things:

1. points the client at the right Torii endpoint
2. selects the network context and signing key for its canonical account

`AccountId` is always canonical and domainless, and `client.toml` has no
domain setting: `[account].profile` selects only the network's I105
prefix. Domain context belongs to aliases and domain-owned objects. For
most applications, start with the public `universal` data space. Domain
context uses `domain.dataspace` form, for example:

```text
wonderland.universal
```

If you need a new organizational data space, prepare a catalog and routing
proposal instead of trying to register it from an ordinary client account.
See [Provision a New Data space](#_8-provision-a-new-dataspace) below.

## 2. Check the Public Torii Endpoint

Read the Taira testnet status with `curl` and `jq`. You can run this check without keys or a local node.

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Inspect the data space and lane view exposed by the node:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Before using Minamoto, confirm the mainnet endpoint with the operator and verify that its TLS certificate matches the hostname.

## Taira MCP for Agents

Taira also exposes a Torii-native Model Context Protocol (MCP) bridge for
agent runtimes. Use it when an agent needs live testnet reads, scripted
diagnostics, or tightly reviewed write rehearsals without building a custom
Torii client first.

| Setting | Value |
| --- | --- |
| MCP endpoint | `https://taira.sora.org/v1/mcp` |
| Network root | `https://taira.sora.org` |
| Intended use | Taira testnet reads and faucet-funded write rehearsals |
| Production equivalent | Do not point this entry at Minamoto unless a mainnet MCP endpoint and release controls are explicitly approved |

The bridge accepts only stateless JSON-RPC `POST` requests. Check its
discovery metadata before adding signing material:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
```

Configure the URL as a user-local MCP server in the agent runtime. Do not
commit agent MCP config, API tokens, forwarded auth headers, `authority`, or
`private_key` values into this docs repo or an application repo.

Agent prompt rules that work well with Taira:

- Discover tools from the MCP server before calling them; re-discover if the
  server reports `listChanged`.
- Prefer the curated `iroha.*` tools over raw `torii.*` tools.
- Start read-only: inspect status, accounts, assets, aliases, blocks,
  governance state, and transaction status before proposing writes.
- Require an explicit human instruction before live testnet mutations. For
  pre-signed transaction envelopes, use `iroha.transactions.submit_and_wait`
  so the agent waits for the result instead of only submitting.
- Summarize transaction hashes, final status, and server validation errors in
  the agent response.

### Development Workflow With Agents

Use agents as development helpers for Iroha clients, transaction builders,
diagnostic scripts, and testnet runbooks. Keep the agent's authority narrow:
it can inspect code, read Taira state, propose changes, and run local tests,
but it should not mutate a live network until a human approves the exact
operation.

A practical workflow is:

1. Ask the agent to inspect the relevant docs, SDK code, CLI command, or MCP
   tool schema before it writes code.
2. Have the agent write the smallest client path first: status check, account
   lookup, alias resolution, or balance lookup.
3. Add transaction-building code only after read-only calls work against
   Taira.
4. Keep live-network tests opt-in, for example behind `TAIRA_LIVE=1`, so a
   normal unit test run never spends testnet funds or depends on network
   availability.
5. Require the agent to report the network root, chain, authority account,
   instruction summary, fee asset, and expected state change before it submits
   any transaction.
6. Review generated code for secret handling, retry behavior, idempotency, and
   rejection handling before promoting it to CI or mainnet workflows.

Useful read-only MCP tools for development include account asset lookups,
alias resolution, block lookup, transaction lookup, transaction lists, and
pipeline status checks. Use these to build confidence before submitting any
signed payload.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Transaction Workflow Through Agents

The MCP bridge can submit a signed Iroha transaction, but it does not remove
the normal transaction requirements. A transaction still needs a correct
authority, permissions, fee funding, chain ID, metadata, and signature.

For raw Iroha transactions, build and sign the transaction envelope with an
SDK or CLI first, then give the agent only the canonical signed transaction
bytes encoded as `body_base64`. The agent can submit the envelope with
`iroha.transactions.submit_and_wait`, or submit with
`iroha.transactions.submit` and poll with `iroha.transactions.wait`.

Do not paste private keys into an agent prompt. If an agent needs to build a
transaction, point it at local code that loads secrets from the user's runtime
environment, keychain, hardware signer, or ignored testnet config file. The
agent should never write the key material into Markdown, fixtures, logs, or
commits.

Before submitting a transaction, make the agent produce a short transaction
plan:

- `network`: Taira testnet root and chain ID
- `authority`: account that signs and pays fees
- `instructions`: register, mint, burn, transfer, metadata, permission, or
  contract call summary
- `fee asset`: asset that will be charged on Taira
- `preflight reads`: account, asset balance, permissions, alias, or block
  checks already performed
- `expected result`: the state that should be visible after confirmation
- `idempotency`: what happens if the same request is retried

After submission, make the agent wait for a terminal status, then verify the
state change with a read query. A useful completion report includes:

- transaction hash
- terminal status such as `Committed`, `Applied`, `Rejected`, or `Expired`
- block or explorer detail when available
- verification read results
- rejection message and whether the failure looks like permissions, fees,
  validation, stale state, or endpoint availability

Example guarded prompt:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

When the signed envelope is already prepared:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Treat Taira MCP as a public testnet control surface. Taira keys, testnet XOR,
faucet accounts, and canary signers are disposable and must stay separate from
Minamoto keys and production release workflows.

## Toy Examples You Can Try Now

These read-only examples query Taira without account keys.

List every Taira lane with its data space and visibility:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | select(.visibility == "public")
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Build a tiny Node.js status probe for a dashboard, bot, or deployment
check:

```bash
node --input-type=module <<'EOF'
const response = await fetch('https://taira.sora.org/status', {
  headers: { Accept: 'application/json' },
});
if (!response.ok) throw new Error(`Taira HTTP ${response.status}`);
const status = await response.json();
const publicLanes = status.teu_lane_commit
  .filter((lane) => lane.visibility === 'public')
  .map((lane) => `${lane.alias}@${lane.dataspace_alias}:${lane.block_height}`)
  .join(', ');
console.log(`Taira: ${status.blocks} blocks, ${status.queue_size} queued, public lanes ${publicLanes}`);
EOF
```

The first write-side toy should be a Taira faucet claim. It uses testnet
XOR and should never be pointed at Minamoto.

## 3. Create a Taira Client Config

Generate a keypair if you do not already have one:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

Create `taira.client.toml`:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

The top-level `chain` is the exact Taira transaction chain ID, and
`network_id` is the exact network identity that every signature binds.
Configure exactly one of `network_id` or `network_id_file`. The
`[account].profile = "taira"` setting independently selects the Taira I105
chain discriminant. The chain ID does not select the account profile.

Run a read-only check:

```bash
iroha --config ./taira.client.toml ledger domain list --limit 5
```

Run the public Taira diagnostics before write tests:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Fund the Taira account through the faucet before you run fee-paying writes.
The prepared faucet flow is in
[Get Testnet XOR on Taira](#_4-get-testnet-xor-on-taira).

After the account is funded, a signed log instruction is an optional write
smoke test. Every submitted transaction names its fee payer, and the CLI
quotes the exact fee before signing:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

The command waits for confirmation. Taira is a public testnet, so queue
saturation can make the ping fail even when the faucet itself works. If
`taira doctor` reports a saturated queue or the ping returns
`PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, wait and retry before treating it as
a client configuration error.

For unattended smoke tests, wrap the ping in a bounded retry loop:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

Stop retrying if `iroha taira doctor` shows hard failures. Queue saturation
and fee-admission rejections are transient public-testnet conditions; DNS,
TLS, or `status = "fail"` diagnostics are not.

## Generate a SORA Nexus Account ID

A SORA Nexus account ID is a canonical I105 address derived from the
account public key and the target network prefix. The same public key
encodes to different IDs on Taira and Minamoto, and production users should
generate a separate keypair for Minamoto.

Generate or load the Ed25519 keypair that will control the account:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

Convert the public key into a Taira account ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Convert a Minamoto public key with the mainnet prefix:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Use the resulting account ID wherever a SORA Nexus API or CLI command asks for a
canonical account ID, for example balance queries, strict account fields,
or alias bindings. Keep the matching
private key in your client config, and select the same public network with
`[account].profile = "taira"` or `[account].profile = "minamoto"`.

Generating the ID does not by itself create a funded on-chain account. On
Taira, the faucet can create and fund the account for testnet writes. On
Minamoto, use an approved mainnet onboarding or treasury flow.

### Key Storage and Backup

The account ID and public key can be shared. The matching private key,
passphrase, seed, and recovery material must be treated as secret.

Use these practices for SORA Nexus accounts:

- Store private keys in an encrypted password manager, hardware-backed
  keystore, or dedicated signing service. Do not commit keys to source
  control or leave production keys in shell history, logs, chat, tickets,
  or unencrypted backups.
- Use a unique high-entropy passphrase for each vault or production signer.
  Store passphrases in a password manager or split custody process, not in
  the same file or backup bundle as the encrypted private key.
- Keep Taira and Minamoto keys separate. Treat Taira keys as disposable
  testnet material and Minamoto keys as production funds authority.
- Back up the private key, public key, account ID, account profile, and any
  account recovery or custody notes needed to restore the signer. A private
  key without the network context is easy to misuse during recovery.
- Keep at least one encrypted offline backup and one geographically
  separate encrypted backup for production signers. Test recovery with a
  small read-only operation before depending on the backup.
- Rotate or replace a signer if the private key, passphrase, backup media,
  or signing host may have been exposed.

For more detail, see
[Storing Cryptographic Keys](/guide/security/storing-cryptographic-keys.md)
and [Password Security](/guide/security/password-security.md).

## 4. Get Testnet XOR on Taira

Claim testnet XOR with the CLI's prepared faucet flow. The faucet funds the
account configured in `taira.client.toml` and registers it first when it
does not exist yet. The flow is:

1. Read the public faucet policy: the faucet authority, fee asset, and
   amount.
2. Prepare the claim. The CLI solves the proof of work, verifies the exact
   transaction that Torii prepares and signs, and saves it in a private
   journal directory without submitting it.
3. Submit the saved transaction once.
4. Wait for the asset balance to become visible before sending fee-paying
   writes.

Read the policy:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

The response has this shape:

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

The policy is unsigned discovery data. Automation should pin the authority,
asset definition, and amount it expects instead of trusting each response.
`prepare` refuses a prepared transaction that differs from the values you
pass.

Prepare and submit the claim:

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` creates the journal directory privately and refuses to replace an
existing one, so use a new directory for each claim. The faucet is a public
testnet service. If `submit` reports `Pending`, times out, or receives a
`502`, run `taira account faucet resume` with the same config and journal
instead of preparing another claim. A stale proof-of-work anchor fails
`prepare`; prepare again in a new journal directory.

Then poll for the funded asset before submitting your own fee-paying
transactions:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

If the claim was applied but the asset is not visible yet, wait and retry
the read before sending writes.

The faucet is only for Taira testnet funds. Do not use testnet XOR, faucet
accounts, or Taira canary signers in Minamoto flows.

## 5. Create a Minamoto Client Config

Before using Minamoto, confirm the mainnet endpoint with the operator and verify that its TLS certificate matches the hostname.

Use a separate keypair for Minamoto. Do not reuse Taira keys for mainnet.

Create `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

The top-level `chain` is the current SORA Nexus mainnet chain ID, and
`network_id` is Minamoto's exact network identity; read it from the
capabilities route before the first signed operation.
`[account].profile = "minamoto"` selects the Minamoto I105 chain
discriminant; the endpoint hostname and chain ID do not select it implicitly.

Convert a Minamoto public key into its canonical I105 account ID with the
mainnet prefix:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Run only read-side checks until the account is provisioned and funded
through the mainnet onboarding or governance flow:

```bash
iroha --config ./minamoto.client.toml ledger domain list --limit 5
```

Do not run the Taira faucet or smoke-test commands against Minamoto.

## 6. Fund a Minamoto Account with XOR

Minamoto fees are paid with production XOR, and Minamoto has no public
faucet. Fund the configured account through an approved mainnet onboarding
or treasury transfer, or receive XOR from an existing funded Minamoto
account.

Verify the canonical account ID and funding with read-only checks before
submitting a write. Treat Minamoto XOR as production funds: rehearse the
same operation on Taira first, keep separate production keys, and do not
assume a mainnet transaction can be reset.

Taira XOR cannot pay Minamoto fees. Testnet balances and faucet claims do
not transfer to Minamoto.

## 7. Work Inside an Existing Data Space {#_7-work-inside-an-existing-dataspace}

Use fully qualified domain names for ledger objects that live inside a
data space. For example, a project domain in the public data space should
use:

```text
apps.universal
```

After your account has the required permissions, create a secret-free
`AliasSetupPlanRequestV1` intent for the domain and use the declarative planner:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

For Minamoto, generate and approve a separate mainnet intent and plan. Plans
are bound to their chain, authority, live-state anchor, and deadline, so a
Taira plan cannot be promoted or replayed:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Account aliases use the same data space suffix:

```text
alice@apps.universal
alice@universal
```

Strict account fields still use canonical I105 account IDs. Treat aliases
as human-readable bindings that resolve to canonical account IDs.

## 8. Provision a New Data Space {#_8-provision-a-new-dataspace}

A new data space is an operator and governance change. The public Torii
endpoint can route traffic to configured data spaces, but it will reject
unknown data space aliases.

Before preparing a change, capture the current live catalog:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

For an operator account, also check the lane manifest posture:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Do not promote a new alias unless the lane ID, data space ID, validator set,
fault tolerance, manifest, routing rules, and operational owner have been
reviewed together. A normal user account with the required permissions can
acquire a domain and its SNS lease inside an existing data space through the
alias planner; it cannot safely add a new public data space.

For a private or organizational data space, prepare a catalog change with:

- a unique data space alias and numeric `id`
- a matching lane entry or an existing lane assignment
- the data space `fault_tolerance`
- routing rules for the instructions or account scopes that should land
  there
- a Space Directory manifest or equivalent rollout evidence, when the
  data space exposes UAID capabilities
- governance approval for validator, compliance, settlement, and monitoring
  policy

A reviewable config fragment looks like this:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments data space"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
instruction = "transfer::asset"
description = "Route asset transfers to the payments data space"
```

Operator acceptance should include these gates:

- `iroha3d --sora --config <config.toml> --check-config` passes on the
  resolved node configuration
- the generated or reviewed manifest is archived with hashes and signatures
- smoke tests pass on Taira before any Minamoto promotion
- the post-change `/status` catalog shows the intended lane and data space
- `iroha app nexus lane-report --summary` does not report missing required
  manifests

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Promote the same data space to Minamoto only after the Taira deployment,
smoke tests, monitoring, and governance evidence are complete.

## Related Pages

- [Install Iroha 3](/get-started/install-iroha.md)
- [Operate Iroha 3 via CLI](/get-started/operate-iroha-via-cli.md)
- [Sponsor fees for a private data space](/get-started/private-dataspace-fee-sponsor.md)
- [Torii endpoints](/reference/torii-endpoints.md)
- [Genesis reference](/reference/genesis.md)
