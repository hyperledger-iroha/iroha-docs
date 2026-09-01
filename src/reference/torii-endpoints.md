# Torii Endpoints

Torii is the HTTP, SSE, and WebSocket gateway for Iroha 3. It serves both
ledger-facing APIs and operator endpoints.

The current protocol rules are:

- the canonical binary format is **Norito**
- many endpoints also support JSON when you send `Accept: application/json`
- metrics are exposed in Prometheus format

For format details, content negotiation, layout flags, schema hashes, and
Norito RPC guidance, see the [Norito reference](/reference/norito.md).

## Common Endpoints

| Endpoint                         | Format         | Purpose                                                          |
| -------------------------------- | -------------- | ---------------------------------------------------------------- |
| `POST /v1/pipeline/transactions` | Norito         | Submit a signed transaction                                      |
| `POST /v1/query`                 | Norito         | Submit a signed query                                            |
| `GET /v1/events/ws`              | WebSocket      | Subscribe to event streams                                       |
| `GET /v1/events/sse`             | SSE            | Subscribe to event streams over SSE                              |
| `GET /v1/blocks/stream`          | WebSocket      | Stream committed blocks                                          |
| `GET /v1/peers`                  | JSON           | Peer list exposed by Torii                                       |
| `GET /livez`                     | Text           | Process-only liveness; it does not imply protocol readiness      |
| `GET /readyz`                    | JSON           | Complete node readiness, including mandatory offline-cash checks |
| `GET /health`                    | JSON           | Readiness probe with the same offline-cash invariant             |
| `GET /v1/api/version`            | Text           | Current block-header version                                     |
| `GET /status`                    | Norito or JSON | High-level diagnostic status; request JSON explicitly            |
| `GET /metrics`                   | Prometheus     | Prometheus scrape endpoint                                       |
| `GET /v1/schema`                 | JSON           | Data-model schema snapshot served by the node when enabled       |
| `GET /openapi.json`              | JSON           | OpenAPI document for the active Torii HTTP routes                |
| `GET /v1/parameters`             | JSON           | Node parameter snapshot                                          |
| `GET /v1/node/capabilities`      | JSON           | Node capability and data-model metadata                          |
| `GET /v1/time/now`               | JSON           | Node wall-clock snapshot                                         |
| `GET /v1/time/status`            | JSON           | Time synchronization status                                      |

For an SSE request, advertise the native stream plus a typed fallback:

```http
Accept: text/event-stream, application/json
```

Torii first negotiates a JSON or Norito representation at the request
layer, then validates the native `text/event-stream` response. Sending only
`text/event-stream` is therefore rejected with `406`; the
[stream-events recipe](/cookbook/stream-events.md) uses the complete
header.

`/openapi.json` is the generated contract for routes represented in the
schema, not a complete operational-probe inventory. The current document
omits `/livez` and `/readyz`, and its `/health` description can lag the
readiness handler. Generate route clients from the live document, but
validate liveness and readiness directly against the running node and
pinned handlers. The exact surface still depends on build features and
runtime configuration. Use the
[Torii API console](/reference/torii-api-console.md) to load that live
document, test JSON routes, copy curl requests, and generate client code
from the current schema.

Every catalog-backed OpenAPI operation includes an `x-iroha-route-auth`
object. Catalog-backed MCP tools expose the same contract as
`_meta["iroha/routeAuth"]`. Both projections carry `schemaVersion`,
`stableRouteId`, `authentication`, and `admission`. Treat version `1` as an
exact contract: reject an unsupported `schemaVersion` instead of guessing
how its authentication or admission labels should be interpreted. The route
metadata describes the request boundary; it does not replace the
credentials required by that boundary.

## Try Live Taira Routes

The public Taira testnet exposes the same Torii JSON surface that
application clients use for read-only exploration. These commands do not
require keys:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS -H 'Accept: application/json' \
  "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

Try resource reads against the current world state:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

If a public testnet route returns `502`, times out, or reports a saturated
queue, treat it as an endpoint availability issue and retry later before
debugging your client code.

## Consensus and Runtime Endpoints

Every Sumeragi route below requires the operator request signature. The
status, diagnostics, stream, leader, key, QC, and parameter routes also
require a telemetry-enabled build.

| Endpoint                                  | Format         | Purpose                                                 |
| ----------------------------------------- | -------------- | ------------------------------------------------------- |
| `GET /v1/sumeragi/status`                 | Norito or JSON | Authoritative reducer-owned consensus status            |
| `GET /v1/sumeragi/diagnostics`            | JSON           | Non-authoritative pipeline, queue, and lane diagnostics |
| `GET /v1/sumeragi/status/sse`             | SSE            | Continuous authoritative consensus status stream        |
| `GET /v1/sumeragi/leader`                 | JSON           | Current leader information                              |
| `GET /v1/sumeragi/qc`                     | Norito or JSON | Highest and locked quorum-certificate snapshots         |
| `GET /v1/sumeragi/consensus-keys`         | JSON           | Active consensus keys                                   |
| `GET /v1/sumeragi/bls-keys`               | JSON           | Active BLS consensus keys                               |
| `GET /v1/sumeragi/params`                 | JSON           | Current on-chain Sumeragi parameters                    |
| `GET /v1/sumeragi/evidence`               | JSON           | Evidence records, optionally filtered by query string   |
| `GET /v1/sumeragi/evidence/count`         | JSON           | Evidence record count                                   |
| `GET /v1/runtime/abi/active`              | JSON           | Active runtime ABI descriptor                           |
| `GET /v1/runtime/abi/hash`                | JSON           | Active runtime ABI hash                                 |
| `GET /v1/runtime/metrics`                 | JSON           | Runtime metrics snapshot                                |
| `GET /v1/runtime/upgrades`                | JSON           | Runtime upgrade list                                    |
| `POST /v1/runtime/upgrades/propose`       | JSON           | Propose a runtime upgrade                               |
| `POST /v1/runtime/upgrades/activate/{id}` | JSON           | Activate a proposed runtime upgrade                     |
| `POST /v1/runtime/upgrades/cancel/{id}`   | JSON           | Cancel a proposed runtime upgrade                       |

## App and SORA Route Families

When Torii is built with the app-facing feature set, it exposes additional
JSON families for explorers, SORA services, bridge flows, proofs, and
storage. These families are not all enabled on every network profile.

`/openapi.json` describes the routes registered in the generated app-API
catalog; it is authoritative for the entries it contains, not for every
route mounted by the process. In particular, public local SoraFS CID and
well-known routes are mounted outside that generated document and must be
probed directly.

| Route family                                                              | Purpose                                                                                                                   |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*`                         | JSON reads, query helpers, onboarding helpers, and portfolio or holder views                                              |
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*`                          | NFT, real-world asset, and confidential asset views                                                                       |
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` | Name, alias, and identifier resolution                                                                                    |
| `/v1/explorer/*`                                                          | Explorer-oriented account, asset, block, transaction, instruction, metric, and stream views                               |
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*`                  | Transaction history, pipeline recovery or status, and ISO 20022 helpers                                                   |
| `/v1/contracts/*`                                                         | Contract code, deploy, bundle, call, view, event, activity, rollup, and state routes                                      |
| `/v1/multisig/*`, `/v1/controls/*`                                        | Multisig proposals, approvals, and transfer-control helpers                                                               |
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*`                            | Finality, state proof, block proof, proof retention, and proof query routes                                               |
| `/v1/da/*`                                                                | Data-availability ingest, manifests, proof policies, commitments, and pin intents                                         |
| `/v1/zk/*`                                                                | ZK roots, proof verification, IVM proving, vote tallying, verification keys, proof records, and attachments               |
| `/v1/gov/*`, `/v1/ministry/*`                                             | Governance proposals, ballots, council state, protected namespaces, agenda proposals, enactment, and finalization         |
| `/v1/nexus/*`, `/v1/sccp/*`                                               | Nexus lane, dataspace, and cross-chain proof helpers                                                                      |
| `/v1/musubi/*`                                                            | Musubi package registry reads and instruction builders                                                                    |
| `/v1/subscriptions/*`                                                     | Subscription plans, subscription lifecycle, usage, and charging helpers                                                   |
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*`                      | SoraFS provider discovery, capacity proofs, pinning, storage fetches, and public content serving                          |
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*`                | SoraCloud service lifecycle, private compute/model flows, public discovery, and hosted app routing                        |
| `/v1/connect/*`, `/v1/vpn/*`                                              | Iroha Connect sessions, WebSocket transport, VPN sessions, profiles, and receipts                                         |
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*`                             | App API bindings and bundle/CID-backed content routing                                                                    |
| `/v1/operator/*`, `/v1/mcp`                                               | Operator authentication and native MCP JSON-RPC bridge                                                                    |
| `/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*`   | Offline readiness, repository agreements, dataspace manifests, and [RAM-LFE helpers](/blockchain/ram-lfe.md#torii-routes) |
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*`        | Collaboration, webhook, push notification, and live telemetry integrations                                                |

## Account Authentication, Visibility, and Explorer Cursors

### App Account Request Protocol

App-facing routes accept either no authentication headers, one direct
single-key proof, or one multisig witness. Every authentication header must
appear at most once.

For a direct proof, send all four headers together:

- `X-Iroha-Account`: the exact canonical lowercase `0x` account-address hex
  or an active canonical ASCII account alias. I105 text is not safe as an
  HTTP field value; use the canonical hex spelling for that account.
- `X-Iroha-Signature`: the strict padded-base64 signature payload.
- `X-Iroha-Timestamp-Ms`: a canonical unsigned decimal Unix timestamp in
  milliseconds, within the configured skew window.
- `X-Iroha-Nonce`: 1 to 256 printable ASCII bytes (`0x21` through `0x7e`),
  unique within the replay window.

The registered single-key controller signs these exact bytes:

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

Canonical query construction parses the raw query as
`application/x-www-form-urlencoded` (`+` means space), percent-decodes its
pairs, sorts them by `(key, value)`, and form-encodes them again. The
protocol admits at most 64 decoded pairs and 64 KiB of raw query text. Hash
the body bytes exactly as transmitted. Do not insert a separator between
the fixed 32-byte network ID and the uppercase method.

The V1 verifier also caps the method token at 32 bytes, the percent-encoded
request path at 64 KiB, and a direct account identity at 36 KiB before
parsing. Account aliases have the tighter structural limit of three name
segments plus their separators. Exceeding a bound fails authentication
before signature verification or source-sized allocation.

A multisig controller must instead send `X-Iroha-Witness` as strict
padded-base64 canonical Norito and omit `X-Iroha-Signature`,
`X-Iroha-Timestamp-Ms`, and `X-Iroha-Nonce`. `X-Iroha-Account` is optional
in this form; when present, it must equal the witness `subject_account`.
The `CanonicalRequestWitnessV1` contains `schema_version`,
`subject_account`, `timestamp_ms`, `nonce`, an Iroha `Hash` of the
exact-network request bytes through the body digest but without freshness
fields, and at most 64 member signatures. Each member signs the canonical
Norito encoding of that same payload without the signatures array. The
verified members must satisfy the account's current multisig policy. The
encoded witness is capped at 1 MiB.

Supplying no authentication headers selects anonymous access. Supplying any
partial, mixed, repeated, malformed, stale, or replayed proof fails
authentication; it never falls back to anonymous visibility.

### Operator Request Protocol

Routes marked as operator-authenticated require all four singleton headers:

- `x-iroha-operator-public-key`: the canonical Iroha multihash public key.
- `x-iroha-operator-timestamp-ms`: the canonical unsigned decimal Unix
  timestamp in milliseconds.
- `x-iroha-operator-nonce`: 1 to 256 printable ASCII bytes, unique for that
  key within the replay window.
- `x-iroha-operator-signature`: the strict padded-base64 signature payload.

Header values must not contain surrounding whitespace. The operator key
signs:

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

The path, query, body, timestamp, and nonce rules are the same canonical
rules used by the app protocol. The key must also be admitted by
`[torii.operator_signatures]`: list it in `allowed_public_keys`, or
explicitly enable `allow_node_key` when using the node key. Replay-cache
saturation fails closed with `503 Service Unavailable`.

The exact request signature is always mandatory. When
`[torii.operator_auth].enabled = true`, each ordinary operator route also
requires a valid `x-iroha-operator-session`; when `require_mtls = true`, it
additionally requires `x-forwarded-client-cert` from a trusted ingress.
Neither factor replaces the request signature.

WebAuthn enrollment and login use these four JSON endpoints:

| Method and endpoint                           | Purpose                                  |
| --------------------------------------------- | ---------------------------------------- |
| `POST /v1/operator/auth/registration/options` | Begin WebAuthn credential enrollment     |
| `POST /v1/operator/auth/registration/verify`  | Verify and persist the credential        |
| `POST /v1/operator/auth/login/options`        | Begin WebAuthn authentication            |
| `POST /v1/operator/auth/login/verify`         | Verify the assertion and issue a session |

Configure `torii.operator_auth.tokens` with dedicated bootstrap values.
Before any credential exists, send one as `x-iroha-operator-token` to begin
the first registration. That token never authorizes an ordinary operator
route, and listener `x-api-token` values are never reused for this flow.
Once a credential exists, enrolling another credential requires an
authenticated session. Login verification returns the session token to send
alongside every fresh exact-network operator request signature. Credentials
persist under `<torii.data_dir>/operator_auth/operator_webauthn.json`.

ISO 20022 routes apply two independent checks. The request must first pass
this operator allowlist and signature protocol; the ISO handler then
requires the same key to occupy the exact participant or audit role
described below.

### Ledger Visibility and Explorer Cursors

App-facing ledger reads use the optional app account boundary above. An
unsigned request receives only dataspaces configured as public. A valid
signed request adds dataspaces bound to the caller's current UAID, each
restricted dataspace named by an exact
`CanReadRestrictedDataspace { dataspace }` permission, or all routes when
the account has `CanReadAllLedgerData`.

Use the route that matches the caller's authority:

| Method and endpoint                   | Authentication and visibility                                   |
| ------------------------------------- | --------------------------------------------------------------- |
| `POST /v1/transactions/visible/query` | Canonical account signature; applies the caller's visibility    |
| `POST /v1/transactions/query`         | Operator request signature; permits the global operator view    |
| `GET /v1/triggers/completed`          | Operator request signature; reads node-local completion records |

The same visibility object filters account, domain, asset-definition,
asset, NFT, RWA, holder, and Explorer reads. An absent object and an object
that is outside the caller's visible routes are intentionally
indistinguishable. Committed transaction and instruction history is shown
only when every route leg recorded for the transaction is visible. A
mixed-dataspace transaction is therefore hidden when even one participant
leg is outside the caller's scope; missing, stale, or malformed routing
context is visible only to a global reader.

The six world-backed Explorer collections use opaque canonical base64url
keyset cursors. The default page limit is 25, the maximum is 100, and one
page inspects at most 512 candidate keys. Each cursor is bound to its
collection, filters, canonical last key, and the caller's visible route-set
digest, so it cannot be replayed on another query or after the caller's
visibility changes.

Block, transaction, latest-transaction, instruction, and latest-instruction
history cursors additionally pin the committed snapshot height and block
hash. Responses expose `pagination.limit`, `pagination.snapshot_height`,
`pagination.snapshot_hash`, `pagination.next_cursor`, and
`pagination.has_more`. A cursor for another route or filter set, a changed
visibility digest, or a snapshot that the node can no longer validate fails
closed. History scanning remains inside Torii's query-admission permit
while the blocking worker runs.

Explorer WebSocket streams emit filtered summaries and recompute visibility
as ledger permissions change. The native `GET /v1/blocks/stream` route is
different: it emits complete signed blocks, requires `CanReadAllLedgerData`
during the handshake, and closes if that permission is later revoked. Do
not use the native stream for a dataspace-scoped explorer.

## ISO 20022 Bridge

Torii exposes the ISO 20022 bridge under `/v1/iso20022/*` when the
app-facing API and bridge runtime are enabled. The bridge is intentionally
scoped: it is not a general-purpose ISO 20022 clearing gateway, but a
supported subset for turning selected payment messages into signed Iroha
transfers and for tracking their ledger status.

Configure a durable local `torii.iso_bridge.store_dir` before admitting any
submission. The configuration field is optional only so a node can start
for read-only or diagnostic use: every authenticated ISO submission
requires the directory, and returns retryable `503 Service Unavailable`
when persistence is absent or a replay-tombstone or rich-record write
fails.

### Torii ISO 20022 Endpoints

| Method and endpoint                          | Purpose                                                                                            |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `POST /v1/iso20022/pacs008`                  | Submit an FI-to-FI customer credit transfer and build the matching Iroha asset transfer            |
| `POST /v1/iso20022/pacs009`                  | Submit an FI-to-FI credit transfer used for PvP or securities-related cash funding                 |
| `POST /v1/iso20022/pacs002`                  | Submit a counterparty-owned payment status report; settlement needs committed transaction evidence |
| `POST /v1/iso20022/pacs004`                  | Submit a counterparty-owned payment return                                                         |
| `POST /v1/iso20022/camt056`                  | Submit an originator-owned payment cancellation request                                            |
| `POST /v1/iso20022/sese023`                  | Submit a securities settlement instruction                                                         |
| `POST /v1/iso20022/sese024`                  | Submit a counterparty-owned securities settlement status message                                   |
| `POST /v1/iso20022/sese025`                  | Submit a counterparty-owned securities settlement confirmation                                     |
| `POST /v1/iso20022/colr012`                  | Submit a collateral substitution message                                                           |
| `GET /v1/iso20022/messages/{msg_id}`         | Read the canonical bridge record for one message                                                   |
| `GET /v1/iso20022/audit/messages`            | Read the tamper-evident message audit manifest                                                     |
| `GET /v1/iso20022/messages/{msg_id}/pacs002` | Render the current payment status as `pacs.002` XML                                                |
| `GET /v1/iso20022/messages/{msg_id}/pacs004` | Render the current payment return as `pacs.004` XML                                                |
| `GET /v1/iso20022/messages/{msg_id}/camt029` | Render the current cancellation resolution as `camt.029` XML                                       |
| `GET /v1/iso20022/messages/{msg_id}/sese024` | Render the current settlement status as `sese.024` XML                                             |
| `GET /v1/iso20022/messages/{msg_id}/sese025` | Render the current settlement confirmation as `sese.025` XML                                       |

`pacs.008` submissions must provide the message ID, interbank settlement
amount, currency, settlement date, debtor and creditor IBANs, and debtor
and creditor BICs. When reference data is configured, the bridge also
checks the BIC, IBAN, and ISO 4217 currency crosswalks before the generated
transaction enters the pipeline.

`pacs.009` submissions must provide the business message ID, message
definition ID, creation time, interbank settlement amount, currency,
settlement date, instructing and instructed agent BICs, and debtor and
creditor IBANs. If the message includes `Purp`, the bridge currently
accepts securities-purpose funding only: `Purp=SECU`.

The `pacs.008` and `pacs.009` submission endpoints accept XML ISO envelopes
or the flat field format used by the bridge tests. Optional `SplmtryData`
fields can pin the target Iroha ledger, source and target account IDs or
addresses, and asset definition ID. The response is `202 Accepted` with
`message_id`, `transaction_hash`, `status`, `pacs002_code`, and the
resolved ledger/account/asset context.

### Participant Authorization and Lifecycle Ownership

Every enabled bridge has a participant catalog. Each participant entry has
a unique participant ID, one or more operator public keys, one or more
financial identifiers, an allowed-profile set, and the `originator`,
`counterparty`, or both roles. Operator keys and financial identifiers
cannot belong to more than one participant. Configure `audit_admin_keys`
separately; an audit-admin key cannot also be a participant mutation key.

All ISO routes require a fresh operator signature. For an initial
`pacs.008`, `pacs.009`, `sese.023`, or `colr.012` submission, the
authenticated operator must belong to the participant identified by the
application header `From` financial identity. The `To` identity must
resolve to a configured participant with the `counterparty` role, and the
selected profile must be allowed for both parties. Durable admission
records the originator, counterparty, admitting participant and operator
key, and the original profile and embedded-signature policy.

Lifecycle authorization is derived from that immutable record rather than
from caller-selected values:

| Lifecycle message                              | Required participant                               |
| ---------------------------------------------- | -------------------------------------------------- |
| `pacs.002`, `pacs.004`, `sese.024`, `sese.025` | Original counterparty with the `counterparty` role |
| `camt.056`                                     | Original originator with the `originator` role     |

The original profile and signature policy remain pinned for the entire
lifecycle, so a caller cannot select a weaker profile for an update. A
`pacs.002` code that represents settlement (`ACSC`, `ACCP`, `SETT`, or
`SETTLED`) changes the original record to settled only when Torii has
committed transaction evidence.

Either original party can read its message record and generated outbox
documents. The audit endpoint returns only records in which the
authenticated participant is the originator or counterparty. A separately
configured audit administrator receives a global read-only audit view and
cannot submit or change messages. Unknown participants and unrelated
message identifiers are not disclosed.

### Durable Replay Identity and Signed Outbox Documents

Replay tombstones are the strict admission boundary. Torii aborts startup
for an unreadable, oversized, malformed, misnamed, conflicting, or
explicitly-incompatible tombstone. It also aborts for a rich record with an
explicitly incompatible schema version, a participant, profile, or
signature policy absent from current configuration, or a missing or
mismatched live tombstone.

Other rich-record damage is handled differently: unreadable or oversized
files, invalid JSON, invalid current-schema records, non-canonical
filenames, and conflicting replay identities are logged or skipped. An
unreadable or invalid current-version audit index is regenerated from the
retained records; only an explicitly incompatible audit-index version
aborts startup. Monitor startup logs and reconcile the regenerated audit
manifest instead of assuming that every corrupt rich-record file prevents
the node from serving.

Each retained rich record keeps immutable participant provenance. A
separate durable tombstone keeps the message ID, payload hash, business
message ID, and UETR for the complete deduplication TTL even after rich
record details are pruned.

Torii persists replay admission before it signs or processes a lifecycle
message. It never evicts an unexpired replay identity. If the configured
capacity is entirely occupied by protected records or unexpired replay
identities, submissions receive retryable `503 Service Unavailable` without
mutating lifecycle or accounting state.

Every generated `pacs.002`, `pacs.004`, `camt.029`, `sese.024`, or
`sese.025` document is returned as `application/xml` with these response
headers:

| Header                         | Meaning                                               |
| ------------------------------ | ----------------------------------------------------- |
| `X-Iroha-Iso-Signature-Domain` | Always `iroha.iso20022.outbound.v2`                   |
| `X-Iroha-Iso-Signer`           | Canonical public key for the configured bridge signer |
| `X-Iroha-Iso-Signature`        | Base64 signature over the domain-separated XML bytes  |

Verify the signature over the UTF-8 byte sequence
`iroha.iso20022.outbound.v2`, one zero byte, and the exact response body.
Do not reformat or normalize the XML before verification.

### Additional Parser and Mapping Support

The IVM ISO helper also validates and materializes the following message
families for envelope validation, settlement mapping, or downstream
reconciliation. They do not have standalone Torii routes.

| Message family                     | Current support                                                                                                                                      |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `head.001`                         | Business application header validation for ISO envelopes, including `BizMsgIdr`, `MsgDefIdr`, creation time, and optional sender/receiver BIC fields |
| `pacs.007`, `pacs.028`, `pacs.029` | Payment reversal, status request, and investigation resolution/status parsing                                                                        |
| `pain.001`, `pain.002`             | Customer payment initiation and payment status report validation                                                                                     |
| `camt.052`, `camt.053`, `camt.054` | Account report, statement, and notification validation                                                                                               |

## Kaigi Sessions

Kaigi provides paid, real-time audio/video rooms on SORA Nexus. Use it when
an application needs ledger-backed session creation, roster changes, relay
manifests, encrypted signaling, and usage metering instead of keeping all
conferencing state off-chain.

The ledger-facing lifecycle is:

- `CreateKaigi`: create a call under a domain and store its policy,
  schedule, metadata, and optional relay manifest.
- `JoinKaigi`: update the call roster. In `zk-roster-v1` mode, the public
  call view exposes commitment and nullifier counts instead of participant
  account IDs.
- `LeaveKaigi`: remove a participant from a transparent call. Private-mode
  departure is off-chain in the first-release protocol.
- `RecordKaigiUsage`: append metered duration and gas totals.
- `EndKaigi`: close the session and record the final timestamp.

Torii exposes the following app-facing reads:

| Route                               | Authentication                          | Purpose                                    |
| ----------------------------------- | --------------------------------------- | ------------------------------------------ |
| `/v1/kaigi/calls/{call_id}`         | public                                  | current call record                        |
| `/v1/kaigi/calls/{call_id}/signals` | canonical exact-network account request | paginated committed signaling metadata     |
| `/v1/kaigi/calls/{call_id}/events`  | canonical exact-network account request | call lifecycle stream                      |
| `/v1/kaigi/relays`                  | allow-listed operator request           | relay summary                              |
| `/v1/kaigi/relays/{relay_id}`       | allow-listed operator request           | one relay's registration and health detail |
| `/v1/kaigi/relays/health`           | allow-listed operator request           | aggregate relay health                     |
| `/v1/kaigi/relays/events`           | canonical exact-network account request | relay registration and health event stream |

The app API must be enabled. Relay summary and health routes are operator
surfaces even though they are read-only; an unsigned `curl` request is not
a valid availability probe. Session state is also reflected through Kaigi
domain events such as `KaigiRosterSummary`, `KaigiRelayManifestUpdated`,
`KaigiRelayHealthUpdated`, and `KaigiUsageSummary`.

### CLI Smoke Test

Start with the `iroha app kaigi` CLI when you want to verify that a Torii
endpoint accepts Kaigi transactions before connecting a UI. The quickstart
command creates a room against the configured endpoint and prints its call
identifier and join metadata:

```bash
iroha app kaigi quickstart \
  --domain kaigi.universal \
  --summary-out kaigi-summary.json
```

For scripted flows, manage the room lifecycle explicitly:

```bash
iroha app kaigi create \
  --domain kaigi.universal \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha app kaigi join \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi leave \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi record-usage \
  --domain kaigi.universal \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha app kaigi end --domain kaigi.universal --call-name daily
```

Use `--room-policy public` for rooms that relays may expose without viewer
tickets, or `--room-policy authenticated` when exits must require viewer
authentication. Use `--privacy-mode zk-roster-v1` only after the network
has the Kaigi roster and usage verifying keys configured; otherwise joins,
leaves, and private usage records fail during deterministic verification.

### JavaScript Integration

The current
[Iroha JavaScript demo](https://github.com/soramitsu/iroha-demo-javascript)
implements a transparent, authenticated one-to-one meeting profile. It does
not expose the protocol's `zk-roster-v1` proof flow. Its renderer creates
WebRTC offers and answers, while a privileged bridge uses the local
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js)
checkout to quote, sign, submit, and wait for finalized Kaigi transactions.

See [Embed Kaigi in a JavaScript App](/guide/tutorials/kaigi.md) for the
exact route authentication, invite format, bridge boundary, and current
demo test commands.

## Status and Metrics

The status and metrics endpoints are the first things to wire into
dashboards:

- `/status` exposes top-level peer, block, queue, and consensus fields
- `/metrics` exposes Prometheus counters, gauges, and histograms

On Nexus-enabled nodes, status output also includes lane and
data-space-aware sections. When `nexus.enabled = false`, those sections are
omitted.

## JSON vs. Norito

Several operator endpoints return Norito by default. When the endpoint
supports JSON, send:

```http
Accept: application/json
```

This is especially useful for:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`

When an endpoint accepts or returns typed Norito directly, use
`application/x-norito` as the content type or preferred `Accept` value. See
[Norito](/reference/norito.md#torii-and-norito-rpc) for the transport
details.

## Telemetry Profiles

Endpoint visibility depends on the node's `telemetry.profile` setting. The
current configuration exposes five profile levels:

| Profile     | `/status` | `/metrics` | Developer routes |
| ----------- | --------- | ---------- | ---------------- |
| `disabled`  | no        | no         | no               |
| `operator`  | yes       | no         | no               |
| `extended`  | yes       | yes        | no               |
| `developer` | yes       | no         | yes              |
| `full`      | yes       | yes        | yes              |

## CLI Shortcuts

The `iroha` CLI already wraps many of these endpoints:

```bash
export IROHA_OPERATOR_KEY_FILE=/run/secrets/iroha/operator.key

iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  ops sumeragi params
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi evidence count
```

## Upstream References

- [README API and observability overview](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO 20022 bridge implementation](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [Performance and metrics](/guide/advanced/metrics.md)
