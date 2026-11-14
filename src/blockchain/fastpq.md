# FastPQ

FastPQ is Iroha's STARK proof path for selected execution effects. It does
not replace normal transaction execution or consensus. Transactions still
run through ISI, IVM, and Sumeragi as usual; FastPQ consumes the
deterministic execution witness and turns supported effects into proof
batches.

The current host integration has two main paths:

- transparent numeric asset transfers recorded during block execution
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

Batch transfers use one transcript with multiple deltas. In that case the
single-delta Poseidon digest is absent.

At block finalization, Iroha groups these transcripts by entrypoint hash.
The execution witness then carries both the original transcript bundles and
the FastPQ transition batches prepared for the prover.

Each transfer delta becomes two transition rows:

| Row             | Key shape                                        | Pre-value               | Post-value             |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
| Sender debit    | `asset/<asset-definition>/<source-account>`      | sender balance before   | sender balance after   |
| Receiver credit | `asset/<asset-definition>/<destination-account>` | receiver balance before | receiver balance after |

Numeric values are normalized into integer witness units. A value is
rejected for FastPQ batching if it cannot be represented as a non-negative
`u64` at the selected decimal scale.

## Public Inputs

Every FastPQ transition batch carries public inputs that bind the proof to
the block and execution context:

| Input         | Meaning                                                         |
| ------------- | --------------------------------------------------------------- |
| `dsid`        | Data space identifier encoded as little-endian bytes             |
| `slot`        | Block creation time converted to nanoseconds                    |
| `old_root`    | Parent state root derived from the execution witness            |
| `new_root`    | Post-state root derived from the execution witness              |
| `perm_root`   | Poseidon commitment over active role permissions                |
| `tx_set_hash` | Hash over sorted transaction and time-trigger entrypoint hashes |

The host uses the sole first-release parameter set,
`fastpq-state-transition-stark-v1`, for these batches.

## Proof Protocol

Canonical transfer artifacts are masked DEEP proofs over the Goldilocks
field with a degree-4 extension. Their exact relation, transcript, and query
geometry are defined in the pinned
[FastPQ DEEP protocol contract](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md).

## What The Prover Checks

Before building the trace, the FastPQ prover canonicalizes the batch order
by transition key, operation rank, and insertion order. Transfer rows also
require transcript metadata. A batch with transfer rows but no transfer
transcripts is invalid.

For transfer transcripts, the prover-side checks include:

- the sender balance must not underflow
- `sender_after` must equal `sender_before - amount`
- `receiver_after` must equal `receiver_before + amount`
- the transcript must cover every transfer row in the batch
- a single-delta Poseidon digest, when present, must match the transcript
  preimage
- provided sparse-Merkle proofs must decode as version 1; missing paths are
  filled with deterministic synthetic proofs

The trace contains selector columns for transfer, mint, burn, role grant,
role revoke, metadata set, and permission lookup rows. Numeric operation
rows also carry signed deltas, running per-asset deltas, and supply
counters.

## Prover Lane

`iroha3d` starts the FastPQ prover lane at startup if the prover backend can
be initialized. The lane is a background task with a bounded queue. After a
block produces an execution witness, the commit path submits a prover job
containing the block hash, height, view, and witness.

If the lane is not running or the queue is full, the job is skipped and
normal block processing continues. This means the background prover lane is
not a transaction admission or consensus gate. It is a proof-production
path over state that has already been executed.

The lane constructs a prover with:

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Both settings default to `cpu`. Selecting `gpu` is an explicit,
fail-closed request: if GPU support is not compiled or a requested GPU
backend fails preflight, the prover lane remains disabled. The first
release has no `auto` value and does not fall back from a requested GPU
mode to CPU.

## Verification

FastPQ proof verification rebuilds the canonical batch commitment and
replays the public transcript. The verifier checks the protocol version,
parameter-set version, replay limits, trace commitment, public inputs,
sampled Merkle openings, AIR openings, and FRI query chain.

Default replay limits include:

| Limit              | Default |
| ------------------ | ------: |
| Transition rows    |     256 |
| Batch payload size | 256 KiB |
| FRI layers         |      16 |
| Query openings     |     128 |

## SORA Nexus AXT Proof Envelopes

SORA Nexus AXT proof envelopes can embed an `AxtFastpqBinding`. Block
validation of AXT envelopes, the IVM host's AXT envelope checks, and
`RegisterVerifiedFeeSponsorVaultAllocation` require the envelope's
`fastpq_binding`, check it against the expected claim, and call the FastPQ
verifier on the envelope and its embedded proof. A missing binding or a
failed verification rejects the operation.

### AXT Binding Math

For SORA Nexus AXT envelopes, `AxtFastpqBinding` is canonicalized before proof
replay. Empty `parameter`, `verifier_id`, or `verifier_version` values are
rejected; the verifier ID must be `fastpq` and the version `v1`, and maintained
AXT flows use `fastpq-state-transition-stark-v1`. Claim type is trimmed and
lowercased.

The AXT FastPQ public inputs are deterministic byte hashes:

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

AXT transition keys are:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

The `authorization` claim inserts a role-grant row:

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

and a metadata row binding the authorization policy. The `compliance` claim
inserts two metadata rows: one for policy and one for target data spaces.

For `tx_predicate` and `value_conservation`, an explicit effect amount is
used when the binding contains a positive source or destination amount.
Otherwise the code derives a bounded deterministic amount:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Then the same transfer equations are used:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

The synthetic sender and receiver account ids are generated from key seeds:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

The transfer batch hash is:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

The AXT batch manifest digest is SHA-256 over the Norito encoding of the
canonical binding:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Parameter Sets

The first release has exactly one canonical parameter set,
`fastpq-state-transition-stark-v1`. It targets 128-bit security over the
Goldilocks field with a degree-4 extension (`X^4 - 7`), and uses trace size
`2^16`, LDE size `2^19`, FRI arity 2, blowup 8, at most 17 reductions, and
136 queries.

## Configuration

FastPQ configuration is nested under `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

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
```

The same execution and telemetry labels can be overridden from `iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Environment variables are also supported for the configuration fields. The
FastPQ-specific variables include:

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`

## Metrics

When telemetry is enabled, FastPQ exports metrics for backend selection and
Metal runtime behavior:

| Metric                            | Meaning                                                                     |
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     | Requested and resolved execution mode by backend and device labels          |
| `fastpq_poseidon_pipeline_total`  | Requested and resolved Poseidon pipeline path                               |
| `fastpq_metal_queue_depth`        | Metal queue limit, max in-flight count, dispatch count, and sampling window |
| `fastpq_metal_queue_ratio`        | Metal queue busy and overlap ratios                                         |
| `fastpq_zero_fill_duration_ms`    | Host zero-fill duration for Metal runs                                      |
| `fastpq_zero_fill_bandwidth_gbps` | Derived zero-fill bandwidth                                                 |

For general performance triage, use these with the consensus and queue
signals listed in [Performance and Metrics](/guide/advanced/metrics.md).

## Related Reference

- [Data Model Schema](/reference/data-model-schema.md) for the node-authoritative
  type snapshot
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ options](/reference/iroha3d-cli.md#fastpq-overrides)
