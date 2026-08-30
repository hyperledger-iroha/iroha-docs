# Run Atomic Private Cross-Dataspace Settlement

`AtomicPrivateSettlementV1` coordinates one confidential settlement leg in
each of 2 to 255 SORA Nexus dataspaces and finalizes every leg in one
global state transaction. A rejected, expired, or aborted bundle applies no
leg. Transparent Native AMX DvP/PvP remains a separate protocol path.

::: warning Release status This feature is governed, disabled by default,
and not yet production-qualified. Do not enable it for real CBDC value
until the published functional, privacy, fault, performance,
reproducible-build, independent-cryptographic-review, and
artifact-publication gates have all passed for the exact release. :::

## What the protocol hides

Each leg uses a fixed two-input, three-output private-note proof. Committee
validators verify the proof and an opaque state transition; they do not
receive the plaintext parties, asset, amount, memo, or business result. An
authorized local auditor decrypts the padded audit capsule, checks those
contents, and signs a purpose-separated approval. The default policy
accepts one approval from the governed auditor set.

The public carrier and receipt deliberately reveal:

- the network and bundle identifiers
- participant dataspace routes and participant count
- timing and expiry heights
- stable opaque pool identifiers, roots, nullifiers, commitments, and fixed
  ciphertext slots
- committee authorities and exact 3-of-4 availability, Prepare, and Commit
  certificates
- sponsor, public network fee, and terminal status

This is content confidentiality, not traffic-flow anonymity. Timing,
participant count, dataspace identity, and stable-pool activity remain
public. A dataspace that hosts only one CBDC may also make the asset
inferable from the route even though no literal asset identifier is
published.

## Deployment requirements

Before activation, operators need all of the following:

1. exactly four validators for every participating dataspace, with distinct
   BLS consensus keys and proofs of possession
2. mandatory Sumeragi DA/RBC enabled for every height
3. a governed confidential settlement pool and initial root in every
   dataspace
4. an active V1 private-note capability and the separate settlement proof
   profile
5. at least one governed local `PrivateSettlementAuditPolicyV1`, including
   distinct auditor signing and hybrid-encryption keys, a key epoch, height
   validity, and an approval threshold
6. enough private sidecar storage for the configured retention period
7. a neutral sponsor account able to submit the final public carrier

An auditor may also operate a validator, but must use separate consensus,
auditor-signing, and auditor-encryption keys. Keep retired decryption keys
for the regulatory retention period, or govern and test capsule rewrapping
before retiring them.

The four-validator authority is state anchored, not supplied by the client.
At the manifest's `authority_context_height`, every validator resolves the
exact ordered lane/dataspace roster and active lane incarnation from consensus
state, requires the resolved height to match, and verifies the four BLS keys
and proofs of possession. Upload, Prepare, and final receipt admission all use
that same historical authority.

## Configure admission

All production behavior comes from the node configuration. Environment
variables cannot activate this path. The shipped default is
`enabled = false`; leaving the feature disabled requires no
settlement-specific configuration.

After governance has registered the required capability and chosen an
activation height with adequate notice, configure every relevant node
consistently:

```toml
[nexus.atomic_private_settlement]
enabled = true
activation_height = 500000
minimum_activation_notice_blocks = 7200
proof_profile_version = 1
max_participants = 255
max_expiry_blocks = 7200
audit_timeout_blocks = 1200
prepare_timeout_blocks = 1200
commit_timeout_blocks = 1200
capsule_padding_classes_bytes = [4096, 16384, 65536, 262144]
max_proof_bytes = 8388608
max_capsule_bytes = 1048576
max_carrier_bytes = 4194304
sidecar_retention_blocks = 1000000
sidecar_max_records = 256
sidecar_max_total_bytes = 3221225472
default_min_auditor_approvals = 1
permitted_policy_versions = [1]
```

The example uses the shipped V1 limits, not a performance recommendation.
Measure storage, proof, capsule, carrier, and latency envelopes on the
intended hardware before choosing operational bounds. The three phase
timeouts must fit inside `max_expiry_blocks`, and sidecar retention must be
at least that expiry window.

`max_capsule_bytes` limits the canonical Norito encoding of the whole
`PrivateSettlementAuditCapsuleV1`: AAD, nonce, ciphertext, vector framing,
auditor identities, and every wrapped-DEK row. It is not a ciphertext-only
limit. Each configured padding class must fit the conservative whole-capsule
envelope for at least `default_min_auditor_approvals` auditors. Torii also
rejects a newly admitted policy whose `min_approvals` is below that governed
floor, and rejects any actual capsule whose complete canonical encoding is too
large.

`max_carrier_bytes` limits the complete canonical sponsor-signed transaction,
not just the certified bundle. The count includes the registered instruction
framing, transaction authority and metadata, fee intent, and signature. The
ordinary network transaction limits still apply as an independent upper bound.

Activation fails closed unless the governed capability is active, its state
and activation heights satisfy the notice period, the compiled proof
profile matches V1, and the on-chain pool and audit records are current.
Enabling the configuration flag alone is insufficient.

## Settlement workflow

The client constructs proofs and encrypted capsules locally. Secret
witnesses must remain in the native wallet or native worker; do not
serialize them into application logs, Python objects, HTTP requests, or
durable coordination records.

Capsule and per-auditor DEK-wrap authenticated data include the digest of the
exact state-anchored committee and `authority_context_height`, as well as the
network, route/incarnation, bundle, leg, policy, key epoch, and plaintext
commitment. A wrapped key cannot be moved to a different roster or historical
authority context.

For each canonical leg, the coordinator then performs this sequence:

1. Upload the provisional encrypted material to all four validators and
   obtain a canonical exact 3-of-4 availability certificate.
2. Have an authorized auditor fetch and decrypt its capsule, recompute the
   public bindings, apply local policy, and submit an approval.
3. Request Prepare votes from the four validators. Each validator
   independently verifies and durably stages the delta before voting.
   Persist the canonical 3-of-4 Prepare certificate on every staged
   responder.
4. After every leg has a Prepare certificate, build the immutable complete
   Prepare barrier. Request and persist canonical 3-of-4 Commit
   certificates. If the coordinator restarts, query participant nodes for
   their locally durable Prepare and Commit certificates, select a canonical
   quorum-equivalent certificate, and re-fan it out before continuing; never
   reconstruct a certificate from an unauthenticated local cache.
5. Have the manifest sponsor sign and submit exactly one global carrier.
   The carrier contains one `FinalizeAtomicPrivateSettlementV1` instruction
   and the exact complete certified bundle. Coordinator and WSV preflight
   measure the complete boxed finalization instruction, including registered
   instruction framing. Torii and the core one-shot carrier binding enforce
   `max_carrier_bytes` over the exact canonical sponsor-signed transaction,
   including authority, metadata, fee intent, and signature. Torii rejects a
   carrier before its authority context, at or after the last ingress height
   that could reach finality by expiry, or beyond the governed expiry span.
6. Query the public bundle status and receipt until global finality. Treat
   local sidecar state as provisional until it reconciles that immutable
   global terminal record.

The Rust client exposes this flow through methods including
`certify_and_upload_private_settlement_legs_v1`,
`prepare_private_settlement_bundle_v1`,
`commit_private_settlement_bundle_v1`, and
`submit_private_settlement_bundle_v1`. Restart-safe coordination uses
`recover_or_prepare_private_settlement_bundle_v1` and
`recover_or_commit_private_settlement_bundle_v1`. Committee and auditor calls
require explicit role credentials; they do not reuse the ordinary account
signer.

## Rotate an auditor policy safely

Use the privacy-governance-authorized
`RotatePrivateSettlementPoolPolicyV1` instruction. It must name the exact
current governance digest, keep the same route, pool, and asset-binding
commitment, advance the governance revision by one, use a strictly newer key
epoch and different policy/governance digests, and activate at the block that
contains the rotation. The pool frontier, roots, nullifiers, outputs, replay
sets, and finalized receipts are preserved. Do not include a receipt touching
that same route/pool at the rotation's activation height; the instruction
rejects that boundary.

The public pool projection retains the complete superseded policy-revision
lineage. A receipt finalized before rotation therefore remains valid after
restart, and replaying that exact receipt remains idempotent. The lineage does
not authorize unfinished work: any old-policy bundle that crosses the
activation boundary fails closed before global state changes. Retain every old
decryption key needed to open stored capsules, or complete a governed and
tested capsule rewrap before destroying it.

## Torii route family

These routes use canonical Norito request and response objects.
Authenticated and restricted responses use private `no-store` cache
behavior.

| Operation          | Method and path                                                            | Principal                   |
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
| Upload leg         | `POST /v1/nexus/private-settlements/legs`                                  | canonical account signature |
| Availability share | `POST /v1/nexus/private-settlements/legs/availability-shares`              | canonical account signature |
| Prepare vote       | `POST /v1/nexus/private-settlements/phases/prepare-votes`                  | canonical account signature |
| Commit vote        | `POST /v1/nexus/private-settlements/phases/commit-votes`                   | canonical account signature |
| Persist phase QC   | `POST /v1/nexus/private-settlements/phases/certificates`                   | canonical account signature |
| Recover phase QCs  | `GET /v1/nexus/private-settlements/legs/{payload_digest}/phase-certificates` | manifest sponsor            |
| Leg status         | `GET /v1/nexus/private-settlements/legs/{payload_digest}/status`           | canonical account signature |
| Committee proof    | `GET /v1/nexus/private-settlements/legs/{payload_digest}/committee-proof`  | exact roster validator      |
| Audit capsule      | `GET /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule`    | governed auditor            |
| Auditor approval   | `POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-approvals` | governed auditor            |
| Submit bundle      | `POST /v1/nexus/private-settlements/bundles`                               | manifest sponsor            |
| Bundle status      | `GET /v1/nexus/private-settlements/bundles/{bundle_id}`                    | public                      |
| Receipt or abort   | `GET /v1/nexus/private-settlements/bundles/{bundle_id}/receipt`            | public                      |

The public status and receipt APIs expose only the documented public fields.
In particular, ordinary leg status does not reveal approval counts or the
governed auditor threshold. Restricted reads intentionally collapse missing,
unauthorized, and retention-expired material into the same unavailable
response class.

## Failure and recovery

Missing or stale auditor approvals, fewer than three validator votes, wrong
roots or epochs, duplicate nullifiers, substituted proofs or capsules,
noncanonical leg order, expired bundles, and mismatched reimbursement terms
all fail before global mutation. Commit certificates never mutate private
state.

Validators fsync sidecars, staged deltas, and phase certificates before
acknowledging them. On restart they rebuild reservations from canonical
durable records, then reconcile immutable global receipts, abort markers,
or expiry. The supervised reconciler also runs terminal retention pruning at
the synchronously observed authoritative height even when there is no terminal
candidate to reconcile, and it fails closed on a pruning error. Only an
authoritative global terminal record releases staged locks. Replaying an
identical finalized receipt is idempotent; a conflicting replay fails
deterministically.

Reservation identity includes the complete route. Pool heads use
`(route, pool_id, epoch, root)`, nullifiers use
`(route, pool_id, nullifier)`, and outputs use
`(route, pool_id, commitment)`. Equal opaque values on another route are
independent; an exact-route collision remains locked across restart.

Operational alerts should use only opaque bundle, route, phase, digest,
height, and reason-class fields. Never place decrypted capsules, account or
asset identifiers, amounts, memos, view data, proof witnesses, or parser
payloads in logs, events, metrics labels, or tracing spans.

## Qualification before real value

For the exact build and configuration you intend to deploy, archive
evidence that covers:

- adversarial proof, capsule, policy, key-rotation, reimbursement, and
  replay cases
- real four-validator processes for 2, 3, 4, 8, and 16 dataspaces,
  including validator and coordinator restarts, authenticated 5%, 10%, and
  20% message loss, phase partitions, recovery, and persistence-boundary
  crashes
- canary and differential leakage analysis across Torii, P2P, blocks, Kura,
  snapshots, queries, events, logs, and telemetry
- at least five warmups and thirty measured bundles per real-network
  participant count, with p50, p95, p99, confidence intervals, resources,
  traffic, proof and receipt sizes, and transparent AMX as the control
- strict workspace tests, lint and format checks, randomized seeds, soak,
  reproducible builds, SBOMs, and signed artifact hashes
- both formal layers: the 3/255-leg count-symmetry checks and the exact
  four-validator committee-indexed N=2 validator-focused plus full bounded-
  fault, paper-primary N=3 fault, N=4 clean, and N=3 expiry/replay
  configurations, with fault budgets independent per committee
- independent review of the proof relation, dummy-slot selectors, asset and
  capsule bindings, reimbursement relation, cryptography, and
  cross-dataspace state machine

Publish the raw and sanitized evidence, threat model, protocol argument,
limitations, commit ID, hardware description, and audit reports in an
immutable DOI-backed artifact. Repository tests alone do not turn the
feature into a production-qualified CBDC settlement system.

Every raw fault run and latency sample must bind the full release commit,
the SHA-256 of one structured pinned-hardware description, and the SHA-256
of its exact participant-count configuration. Archive one canonical
configuration manifest covering N=2,3,4,8,16; each entry must reference the
retained configuration bytes and assert exactly four validators per
dataspace, a 3-of-4 quorum, and mandatory signed RS16 DA/RBC. The release
verifier rejects summaries produced on a different build, hardware profile,
or network configuration. Every individual loss, phase-cut, and persistence-
crash row must additionally name globally non-reusable exact JSONL record
references inside SHA-256-bound authenticated-controller and atomicity-capture
artifacts. The release verifier resolves those digests and requires the rows to
match the run identity, trial index and parameters, controller acknowledgement
or recovery result, continuous-check count, and zero partial visibility and
spendability observations. Later-release p95/p99 comparisons also reject a
signed baseline whose hardware, configurations, or measurement requirements
differ from the candidate. The final verifier regenerates all reported
percentiles, MADs, and deterministic confidence intervals from the archived
raw samples instead of trusting a detached benchmark summary. It likewise
reloads the canary manifest and independently rescans every archived
privacy surface, so a report cannot suppress a planted secret hit after
rebinding file digests. Each secret-only run must retain its owner-only
unfiltered loopback pcap, raw tcpdump stderr and zero-drop statistics,
canonical port manifest, packed restricted-source archive, and all-peer
atomicity observations. The final verifier reruns the port-bound packet
split, source projections, and baseline-to-terminal atomicity checks from
those archived bytes rather than trusting the published summaries.

The archive must also include canonical paired traffic-count and
differential-pair manifests binding the exact left and right file paths,
kinds, byte lengths, and SHA-256 digests for every required privacy surface.
Its declared roots must contain exactly the paired archive inventory. The
verifier requires equal whole-file sizes and JSON public shapes for ordinary
surfaces. The entropy-bearing raw loopback capture and packed restricted-
source archive are explicit size exceptions; it instead compares packet link
type and per-packet lengths, restricted-source identities, and fixed-shape row
lengths. Every Torii request/response, public/restricted P2P packet, block,
query, event, log, and telemetry traffic count must also match. A packet-shape
change, same-size structural leak, false provenance claim, or unpaired file
cannot be hidden by rewriting the leakage report and its hashes.
