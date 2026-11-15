# FastPQ

FastPQ is Iroha's STARK proof path for selected execution effects. It does
not replace normal transaction execution or consensus. Transactions still
run through ISI, IVM, and Sumeragi as usual; FastPQ proves supported
effects afterwards, from the source record that block execution captured.

The current host integration has two main paths:

- numeric asset effects of finalized blocks, proved by the node's prover
  lane
- SORA Nexus AXT proof envelopes whose `fastpq_binding` carries a FastPQ
  binding

## Transfer Witness Path

Transparent numeric transfers create a structured transfer transcript when
the instruction mutates balances. The transcript records:

- the source account, destination account, asset definition, and amount
- sender and receiver balances before and after the transfer
- the transaction entrypoint hash used as the batch hash
- an authority digest derived from the submitting account
- a Poseidon digest for single-delta transcripts
- sparse-Merkle update witnesses for the sender and receiver balances

Batch transfers use one transcript with multiple deltas. In that case the
single-delta Poseidon digest is absent.

Block execution groups the transcripts by the execution call that emitted
them and keeps them with the block's FastPQ source record. In an AXT
transfer statement, each transfer delta becomes two transition rows:

| Row             | Key                                                                   | Pre-value               | Post-value             |
| --------------- | --------------------------------------------------------------------- | ----------------------- | ---------------------- |
| Sender debit    | `FastpqBalanceKeyV1` for the asset definition and source account      | sender balance before   | sender balance after   |
| Receiver credit | `FastpqBalanceKeyV1` for the asset definition and destination account | receiver balance before | receiver balance after |

Each key is the canonical Norito frame of `FastpqBalanceKeyV1`, built by
`transfer_balance_key` from the typed asset definition and the domainless
account. Account aliases and display forms are never key material.

## Execution Effects

The prover lane proves complete execution-effect statements. Each statement
covers every quantity effect of one execution entry, in execution order:

| Effect   | Updated values                 | Rule                                                                |
| -------- | ------------------------------ | ------------------------------------------------------------------- |
| Transfer | source and destination balance | the amount moves between two balances of one asset                  |
| Mint     | balance and supply             | both increase by the same non-zero amount                           |
| Burn     | balance and supply             | both decrease by the same amount                                    |
| Retire   | supply and lifecycle           | supply stays zero and the asset's presence changes from one to zero |

Supply never falls below a balance. Each key is the domain
`iroha:fastpq:execution-quantity-key:v1`, a NUL byte, and the Norito
encoding of a `FastpqExecutionQuantityKeyV1` balance, supply, or lifecycle
key. Role grants, role revokes, and other operations are not proved.

Values in execution-effect and AXT transfer statements are exact
non-negative integer units at the asset's decimal scale
(`FastpqQuantityUnits`), so they are not limited to `u64`. Statement
construction rejects a scale mismatch, a negative difference, and any
arithmetic or ordering inconsistency; it never repairs a public value.

## Public Inputs

Every FastPQ statement carries public inputs that bind the proof to the
block and execution context:

| Input         | Meaning                                                                              |
| ------------- | ------------------------------------------------------------------------------------ |
| `dsid`        | Data space identifier: its `u64` value in little-endian order, then eight zero bytes |
| `slot`        | Block creation time in nanoseconds, at millisecond precision                         |
| `old_root`    | Root of the touched-key sparse Merkle tree before the statement                      |
| `new_root`    | Root of the touched-key sparse Merkle tree after the statement                       |
| `perm_root`   | Commitment to the role-permission table of the executing state                       |
| `tx_set_hash` | Commitment to the block's transaction wires in block order                           |

`old_root` and `new_root` cover only the keys that the statement touches.
They are not the persisted world state root.

`perm_root` is Iroha's 32-byte `Hash` over the domain
`fastpq:v1:permission-table:blake2b-256`, the entry count as a
little-endian `u64`, and the sorted entries. Each entry is the hash of a
role ID, the hash of one of its permissions, and that permission's epoch as
a little-endian `u64`. An empty table commits to 32 zero bytes. This is
role and permission context only; it does not prove account membership or
authorization.

`tx_set_hash` is Iroha's `Hash` over the domain
`iroha:axt:ordered-transaction-wire-set:v1`, a NUL byte, the transaction
count, and, for each transaction in block order, its wire length and its
complete wire bytes. The count and lengths are little-endian `u64` values.
Transactions are not sorted or deduplicated, and signatures stay in the
preimage.

Iroha's `Hash` is Blake2b-256 with the lowest bit of the final byte set to
one. A statement also carries an ordering hash and its complete canonical
rows and source facts; the proof binds all of them.

## Proof Protocol

Canonical FastPQ artifacts are masked DEEP proofs over the Goldilocks field
with a degree-4 extension. Their exact relation, transcript, and query
geometry are defined in the pinned
[FastPQ DEEP protocol contract](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md).

Callers choose an ordinary or AXT statement and resource limits. They do
not choose circuits, verifying keys, query counts, or transcript internals.
The ordinary route is `offline_compact::prove_quantity_ordinary_artifact`;
the AXT route is `offline_compact::prove_quantity_axt_artifact`, which
`prove_axt_bound_batch` wraps for bound batches. The transparent `Prover`,
`Proof`, and replay `verify` API exists only in tests and `dev-tools`
builds.

## What The Proof Checks

Before any private work, the producer prepares the public statement. It
checks accounts, amounts, values, occurrence counts, stable key order, and
key allocation, and it rejects a statement whose public facts disagree. The
sealed relation then proves the two complete 32-level sparse-Merkle updates
of one effect or transfer occurrence per segment. The default limits allow
at most two segments per artifact.

Each trace has 65,536 rows. The producer commits 301 private columns and
the verifier reconstructs 41 public columns independently. Fresh
cryptographic entropy masks the trace columns, the quotient, and an
independently committed composition polynomial. Quotient division must be
exact. The producer verifies its own artifact before returning it.

Public statement values are not hidden. An operation's presence in the wire
format does not admit it: only the effects listed above have relations, and
AXT statements admit only witnessed transfers.

## Prover Lane

`iroha3d` starts one FastPQ prover worker during node startup, before Torii
accepts submissions, unless Kura starts with `init_mode = "fast"`. The
worker initializes its backend in the background, so startup continues if
initialization fails; the lane then stays disabled.

The worker polls the node's finalized state and Kura storage. For each
finalized block it obtains the authenticated source, replaying native
execution when the source is not stored, and proves the block's complete
statements one at a time with the ordinary route. After a restart it
rebuilds the authenticated prefix from the pinned signed genesis. It stores
each artifact in Kura's bounded FastPQ store. A stored artifact is only an
advertisement: before moving on, the producer authenticates the source and
verifies the artifact again.

Proof production is node-local. It is not a transaction-admission or
consensus gate: execution, commit, and finality do not wait for a proof. A
retryable failure leaves the work for a later attempt, and one producer
runs per process.

## Verification

A verifier checks an artifact against expectations that it derives from its
own authenticated statement, never from the artifact being checked.
Verification decodes each segment once under bounds, evaluates the AIR once
at the out-of-domain point, authenticates every opened row, quotient leaf,
and FRI fiber and the complete FRI terminal against the committed roots,
and performs at most 385 fold checks. It builds no private witness, trace,
or full low-degree extension.

Success establishes consistency with the caller's expectations. It grants
no execution authority, source finality, replay admission, or AXT spend
authorization.

Default limits from `offline_compact::VerificationLimits`, which the
ordinary route also uses:

| Limit                           |       Default |
| ------------------------------- | ------------: |
| Segments per artifact           |             2 |
| Artifact wire bytes             |         1 MiB |
| Child proof frame               | 500,084 bytes |
| Statement bytes across segments |       512 KiB |
| Queries per segment             |            77 |
| Queries across segments         |           154 |

The node lane further caps artifact wire bytes at
`zk.fastpq.proof_sidecar_max_bytes` and Kura's FastPQ object limit. Before
decoding, an AXT proof blob may hold at most 2 MiB and its embedded FastPQ
payload at most 1 MiB.

## SORA Nexus AXT Proof Envelopes

SORA Nexus AXT proof envelopes can embed an `AxtFastpqBinding`. Block
validation of AXT envelopes, the IVM host's AXT envelope checks, and
`RegisterVerifiedFeeSponsorVaultAllocation` require the envelope's
`fastpq_binding`, check it against the expected claim, and call the FastPQ
verifier on the envelope and its embedded proof. A missing binding or a
failed verification rejects the operation.

The verifier accepts only witnessed transfer claims, `tx_predicate` and
`value_conservation`. The `authorization` and `compliance` claim types are
opaque effect carriers with no transfer relation, and verification rejects
them. Block validation also rejects envelopes that carry remote spends, and
the IVM host rejects standalone `AXT_VERIFY_DS_PROOF` admission. Both stay
unavailable until finalized source roots, the transaction set, and issuer
authorization can be authenticated.

### AXT Binding

For SORA Nexus AXT envelopes, `AxtFastpqBinding` is canonicalized before
proving and verification:

- `parameter`, `source_dataspace`, `source_receipt_id`, and
  `verified_effect_type` are trimmed and must not be empty
- `source_tx_commitment`, `claim_digest`, `witness_commitment`, and
  `policy_commitment` are lowercased and must be hex encodings of 32 bytes
- `verifier_id` must be `fastpq` and `verifier_version` must be `v1`
- `claim_type` is trimmed and lowercased and must name one of the four
  claim types above
- `target_dsids` must be non-empty and strictly ascending
- `remote_spend_intent_commitments` must be strictly ascending and within
  the first-release limit

Verification requires the exact canonical form; it does not normalize a
binding on the caller's behalf.

The binding attaches to a batch that block execution already captured; it
does not create transitions. The batch must contain at least one state
transition and name the binding's parameter set,
`fastpq-state-transition-stark-v1`. Its `entry_hash` metadata must equal
`source_tx_commitment`, and its public `dsid` must encode the binding's
`source_dsid`. A transfer claim must carry at least one transfer
transcript, and the batch hash of every transcript must equal
`source_tx_commitment`.

Binding then writes proof-bound metadata into the batch: the canonical
binding, its four digests, `source_receipt_id`, `target_dsids`,
`verified_effect_type`, a non-empty `corridor`, the non-zero manifest root,
the optional DA commitment, an optional non-zero committed amount, and the
expiry slot, where zero means no expiry. Last, it adds a seal over the
binding and the batch without the seal:

$$
\operatorname{seal} =
\operatorname{Hash}(
\texttt{fastpq:axt:batch-seal:v1}\|
E(\operatorname{binding})\|
E(\operatorname{batch})
)
$$

Here $E$ is the canonical Norito encoding. Changing the batch, the binding,
or a proof-bound value after binding makes verification fail. The verifier
also compares the envelope's data space, manifest root, DA commitment,
committed amount, and expiry with the proof-bound values.

A verified envelope reports its proven `old_root`, `new_root`, and
`tx_set_hash`, and a statement digest. The digest covers the envelope's
data space as a little-endian `u64`, its manifest root, the DA commitment
when present, the binding, and the statement:

$$
\operatorname{statement\_digest} =
\operatorname{Hash}(
\texttt{fastpq:axt:statement:v1}\|
\operatorname{le64}(\operatorname{dsid})\|
\operatorname{manifest\_root}\|
\operatorname{da\_commitment}\|
E(\operatorname{binding})\|
E(\operatorname{statement})
)
$$

The AXT batch manifest digest is SHA-256 over the Norito encoding of the
canonical binding:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Parameter Sets

The first release has exactly one parameter set,
`fastpq-state-transition-stark-v1`. Batches and AXT bindings name it, and
AXT proving rejects any other name. The DEEP protocol contract fixes the
released artifact geometry:

| Item                       | Value                                                 |
| -------------------------- | ----------------------------------------------------- |
| Field                      | Goldilocks `p = 2^64 - 2^32 + 1`, extension `u^4 - 7` |
| Trace rows                 | 65,536                                                |
| Evaluation rows            | 8,388,608 (blowup 128)                                |
| FRI folding arities        | `[16, 16, 8, 8, 4]`                                   |
| Queries                    | 77 distinct positions                                 |
| Grinding                   | none                                                  |
| Commitments and transcript | SHA3-256 and SHAKE256                                 |

Production qualification is unavailable. Independent soundness, hiding, and
Fiat-Shamir reviews of this construction are outstanding, and the pinned
[production readiness record](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_production_readiness.md)
makes no work-normalized security claim.

## Configuration

FastPQ configuration is nested under `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"
proof_sidecar_queue_cap = 1024
proof_sidecar_max_retries = 16

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false

[zk.fastpq.producer]
poll_interval_ms = 1000
step_timeout_ms = 30000
max_native_steps = 16
max_source_entries = 65536
max_source_statements = 16384
```

Both modes accept only `cpu` or `gpu` and default to `cpu`. Setting either
one to `gpu` makes proof hashing require a device: Metal on macOS and CUDA
elsewhere. If GPU support is not compiled in or the device fails preflight,
the prover lane stays disabled; it never falls back to CPU. The device runs
bulk Merkle leaf and lower-parent hashing; the transcript, ordered upper
tree, and trace arithmetic stay on the CPU. With `poseidon_mode = "gpu"`,
the node also batches transcript Poseidon digests on the GPU when a
separate preflight passes; otherwise it computes them on the CPU.

`proof_sidecar_max_bytes` caps the encoded artifact that the node persists
and verifies, and defaults to the prover's maximum proof frame. The
`producer` table bounds each proving attempt: its poll interval, its time
budget, the native replay steps (1 to 64), and the source entries and
statements admitted before allocation. `metal_queue_fanout` accepts 1 to 4.

The mode and telemetry-label settings can also be overridden from
`iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

`iroha3d` ignores environment variables when it reads a configuration file,
so set these values in TOML or with the options above.

## Metrics

When telemetry is enabled, FastPQ exports metrics for backend selection,
proof persistence, and Metal runtime behavior:

| Metric                              | Meaning                                                                     |
| ----------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`       | Requested and resolved execution mode by backend and device labels          |
| `fastpq_poseidon_pipeline_total`    | Requested and resolved Poseidon pipeline path                               |
| `fastpq_gpu_disable_total`          | GPU accelerator disable events by accelerator, reason, and device labels    |
| `fastpq_gpu_parity_failure_total`   | Sampled GPU parity failures by accelerator, reason, and device labels       |
| `fastpq_proof_sidecar_queue_depth`  | Queued FastPQ proof sidecar attachments                                     |
| `fastpq_proof_sidecar_events_total` | Proof sidecar persistence events by event                                   |
| `fastpq_metal_queue_depth`          | Metal queue limit, max in-flight count, dispatch count, and sampling window |
| `fastpq_metal_queue_ratio`          | Metal queue busy and overlap ratios                                         |
| `fastpq_zero_fill_duration_ms`      | Host zero-fill duration for Metal runs                                      |
| `fastpq_zero_fill_bandwidth_gbps`   | Derived zero-fill bandwidth                                                 |

The mode, GPU, Metal queue, and zero-fill metrics need the `extended` or
`full` telemetry profile and are not exported when Kura starts with
`init_mode = "fast"`. The Metal queue and zero-fill metrics also need a
`fastpq-gpu` build on macOS.

For general performance triage, use these with the consensus and queue
signals listed in [Performance and Metrics](/guide/advanced/metrics.md).

## Related Reference

- [Data Model Schema](/reference/data-model-schema.md) for the
  node-authoritative type snapshot
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `FastpqPublicTransferStatementV1`
- `FastpqBalanceKeyV1`
- `FastpqExecutionQuantityKeyV1`
- `TransferTranscript`
- `AxtFastpqBinding`
- `AxtProofEnvelope`
- [`iroha3d` FastPQ options](/reference/iroha3d-cli.md#fastpq-overrides)
