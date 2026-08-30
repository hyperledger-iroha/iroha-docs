# Performance and Metrics

Iroha performance depends on the workload, validator topology, network
conditions, and consensus settings. A single TPS number is therefore only useful
when it is tied to a benchmark run with a fixed configuration.

For capacity planning, treat performance as an operating envelope:

- the network accepts the requested transaction rate
- commit latency stays inside the target budget
- transaction queues stay bounded
- consensus does not rely on repeated view changes or recovery paths

Use this page to estimate whether a deployment is in a high, medium, or low
performance state for a given node count, network latency threshold, and target
TPS.

## What to Measure

Start with the public node snapshot and Prometheus scrape, then use the CLI
for operator-authenticated consensus state. The operator key must be allowed by
the target node and is loaded only at runtime:

```bash
export TORII=http://127.0.0.1:8180
export OPERATOR_KEY_FILE=./secrets/operator.key

curl -s -H 'Accept: application/json' "$TORII/status" | jq .
curl -s "$TORII/metrics" > metrics.prom

iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi status
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi qc
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

Public Taira is useful for learning the shape of anonymous node snapshots. Its
operator diagnostics are intentionally unavailable without a Taira operator
key:

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/now" \
  | jq '{now_ms, offset_ms}'
```

Do not use public-testnet observations as production capacity numbers for your
own deployment.

Telemetry visibility depends on the configured profile. `operator` enables
the status and diagnostics snapshots. `extended` adds `/metrics` and costly
timings, while `developer` adds developer snapshots such as leader, QC,
parameters, and evidence without enabling `/metrics`. Use `full` when one run
needs both sets. `telemetry_profile` is the sole first-release telemetry
switch.

```toml
telemetry_profile = "full"
```

## Performance Bands

Use these bands for an observed run at target throughput `Y` TPS and latency
budget `L` milliseconds. Run the workload long enough to include warm-up,
steady state, and at least one period of expected peak load.

| Band | Conditions | Meaning |
| --- | --- | --- |
| High | Accepted throughput is at or above `Y`, p95 commit latency is below `0.8 * L`, queues remain below 10% of capacity, and view-change/recovery counters are flat | The deployment has headroom for the requested workload |
| Medium | Accepted throughput is close to `Y`, p95 commit latency is below `L`, queues are stable below 50% of capacity, and view changes are rare | The deployment works, but there is limited burst tolerance |
| Low | Accepted throughput is below `Y`, p95 commit latency exceeds `L`, queues grow during the run, or view-change/backpressure counters rise continuously | The requested workload exceeds at least one bottleneck |

The key rule is queue direction. If submitted TPS is greater than committed TPS
and the queue keeps growing, the deployment is overloaded even if short samples
look healthy.

## Node Count and Quorum

More validators improve fault tolerance but increase coordination, signature,
and network fanout costs. The first-release Sumeragi protocol requires:

- an exact `n = 3f + 1` voting committee
- `4 <= n <= 31`, so valid sizes are 4, 7, 10, and so on
- a commit quorum of `2f + 1`
- observer peers sync blocks but do not vote, propose, or collect

| Validators | Fault budget | Commit quorum | Capacity note |
| --- | --- | --- | --- |
| 4 | 1 | 3 | Common minimum for one-fault tolerance |
| 7 | 2 | 5 | More resilient, with more vote and propagation traffic |
| 10 | 3 | 7 | Higher coordination cost; network and ingress tuning matter more |
| 31 | 10 | 21 | Maximum first-release committee; benchmark coordination and signature cost carefully |

Genesis generation and startup validation reject nonconforming committee
sizes; do not benchmark a topology that the release cannot admit.

When evaluating "X nodes", separate voting validators from observers. Adding
observers usually costs less than adding validators, but observers still consume
block gossip, block sync, disk, and network bandwidth.

## Factors That Influence Performance

### Workload Shape

The same TPS can be cheap or expensive depending on what each transaction does.
Record:

- number of instructions per transaction
- signature count and signing algorithms
- transaction byte size and decompressed payload size
- read/write ratio
- metadata size and asset operations
- smart contract, trigger, and IVM execution cost
- query load running against the same peers

Small transfer transactions are not a proxy for contract-heavy or metadata-heavy
workloads.

### Consensus Cadence

The effective Sumeragi parameter snapshot contains the signed immutable block
cadence and the clock-drift bound:

- `block_cadence_ms`
- `max_clock_drift_ms`

Inspect them with:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

`block_cadence_ms` is committed by signed genesis and frozen at startup; it is
not a live tuning knob. Compare networks with different signed genesis inputs
only as separate benchmark scenarios. Once view changes, missing-payload
fetches, or backpressure appear, a shorter cadence usually makes the overload
more visible rather than increasing sustainable throughput.

### Candidate and Ingress Bounds

Node-local Sumeragi bounds determine how much candidate and recovery work a
validator can retain:

- `sumeragi.block.max_transactions`
- `sumeragi.block.max_payload_bytes`
- `sumeragi.block.proposal_queue_scan_multiplier`
- `sumeragi.queues.commands`
- `sumeragi.queues.bodies` and `sumeragi.queues.body_bytes`
- `sumeragi.queues.body_source_bytes`, `sumeragi.queues.chunks`, and
  `sumeragi.queues.ready_bodies`

Too-small bounds create queue or payload-recovery pressure; oversized bounds
increase retained memory and the amount of work available to an abusive peer.
Compare the diagnostics snapshot with process memory, message handling, and
missing-body metrics before changing one bound at a time:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
```

### Network Conditions

Consensus performance is sensitive to:

- RTT between validators
- jitter and packet loss
- bandwidth for block payloads and signed RS16 chunks
- asymmetric links between regions
- NAT, firewall, or relay behavior that delays peer connectivity

As a planning rule, set the latency budget high enough to cover several
validator round trips plus execution and disk commit time. If p95 network RTT is
already close to the desired p95 commit latency, the target is not realistic.

### Queues and Admission Limits

Admission and queue settings define how much burst pressure a peer can absorb:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.max_retained_bytes`
- `queue.transaction_time_to_live_ms`
- genesis transaction limits such as max signatures, instructions, bytes, and
  decompressed bytes
- p2p queue caps and consensus ingress limits

High queue capacity can hide overload for a while, but it does not increase
sustainable throughput. A stable queue is healthy; a growing queue is a backlog.

### Hardware and Storage

Measure every validator, not only the leader:

- CPU saturation during validation, signature verification, and execution
- memory pressure from queues, snapshots, and payload-recovery buffers
- disk write latency for block storage and snapshots
- network transmit/receive saturation
- optional hardware acceleration settings when used by the workload

The slowest voting validator can determine the network's tail latency.

## Prometheus Signals

Metric names come from the checked-in telemetry catalog. Series availability
and sampling still depend on build features and `telemetry_profile`, so inspect
`/metrics` on the target node before building a dashboard.

Common signals include:

| Signal | Prometheus examples | What to watch |
| --- | --- | --- |
| Accepted throughput | `sum(rate(txs{type="accepted"}[5m]))` | Should meet or exceed target TPS in steady state |
| Rejections | `sum(rate(txs{type="rejected"}[5m]))` | Should be explainable by the test plan |
| Commit latency | `histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` | Compare p95/p99 with the latency budget |
| Queue depth | `queue_size`, `sumeragi_tx_queue_depth` | Should stay bounded during peak load |
| Queue saturation | `sumeragi_tx_queue_saturated` | Sustained non-zero values mean overload |
| View changes | `view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` | Rising values indicate timing, topology, payload, or network trouble |
| Dropped messages | `dropped_messages`, `sumeragi_consensus_message_handling_total` | Drops during load usually explain latency spikes |
| Payload and DA recovery | `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total`, `sumeragi_da_gate_satisfied_total` | Persistent requests, rising age, or repeated DA gates indicate body or chunk acquisition trouble |
| Commit quorum | `sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` | Counted signatures should reach the required quorum quickly |

When a metric exists only in `/v1/sumeragi/status`, capture the JSON snapshot in
the same run artefacts as the Prometheus scrape.

## Estimation Workflow

1. Define the scenario:
   - validator count and observer count
   - consensus mode
   - target TPS
   - p95 and p99 commit-latency budgets
   - transaction mix
   - expected network RTT, jitter, and bandwidth
2. Record the effective configuration:

   ```bash
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi status \
     > artifacts/sumeragi-status.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi diagnostics \
     > artifacts/sumeragi-diagnostics.json
   ```

3. Run the workload at the target TPS.
4. Capture status and metrics at the start, middle, and end of the run.
5. Classify the run with the performance-band table.
6. If the band is Medium or Low, change one factor at a time and repeat.

## Benchmark Report Template

Publish performance numbers only with enough context to reproduce them:

- Iroha commit, release, and feature flags
- validator and observer counts
- consensus mode, signed block cadence, and DA layout
- exact `3f + 1` committee, quorum, and observer roster
- `sumeragi.block`, `sumeragi.queues`, `sumeragi.limits`, network-ingress, and
  transaction-queue bounds
- telemetry profile
- hardware, storage, and OS details
- network RTT, jitter, loss, and bandwidth assumptions
- transaction mix and payload sizes
- offered TPS and run duration
- accepted/rejected TPS
- p50/p95/p99 commit latency
- queue depth and saturation
- view changes, dropped messages, missing-block fetches, and DA-gate counters
- CPU, memory, disk, and network utilization per validator

Without these details, a TPS number should be treated as anecdotal.

## Related Pages

- [Chaos Testing with Izanami](./chaos-testing.md)
- [Torii endpoints](../../reference/torii-endpoints.md)
- [Operate Iroha 3 via CLI](../../get-started/operate-iroha-via-cli.md)
- [Peer configuration reference](../../reference/peer-config/params.md)
