# Consensus

Transactions enter a queue before Sumeragi proposes them in a block.
Validators independently validate and execute the proposal, then sign only
the state transition they can reproduce. A block commits after the required
validator quorum agrees on that result and the matching payload is available.

All Iroha 3 networks use signed RS16 data-availability manifests and chunks,
plus certified-body recovery. Data availability is a consensus requirement,
not an optional deployment feature.

## Sumeragi

Sumeragi is Iroha's Byzantine-fault-tolerant consensus engine. It takes
transactions from the queue, has validator peers agree on the same ordered
block, and finalizes that block only after enough validators have
reproduced the same result and signed the commit certificate.

### Proposal and commit path

Sumeragi runs the ledger forward one block height at a time. At each height,
one validator acts as proposer for the current view. The proposer drains
eligible transactions from the queue, builds a candidate block, and announces
the proposal to the active validator set.

The same Sumeragi pipeline is used in both permissioned and Nominated
Proof-of-Stake (NPoS) deployments:

1. A validator proposes a block from queued transactions.
2. Validators validate the proposal by executing the transactions against
   the same world state.
3. Validators exchange votes and quorum certificates for the current height
   and view.
4. Once the commit quorum is reached, peers commit the block and update
   their world state.

Validators sign only data they can reproduce locally. Before voting, a
validator checks that the proposal belongs to the expected chain, height, and
view; that transaction signatures and limits are valid; that lane routing and
executor validation are deterministic; and that executing the payload produces
the expected state transition. If the local result differs, the validator
rejects the proposal instead of voting for it.

Votes are small signed consensus messages. They refer to the proposed block,
the height, the view, and the validator identity. Verified signatures form
prepare and commit quorum certificates. A commit certificate is the durable
proof that enough validators observed the same result for the same block.
Each validator sends its Prepare and Commit votes to the full committee; any
validator can aggregate the required equal votes and broadcast the resulting
certificate.

### Quorum and observers

The first-release protocol admits only an exact `3f + 1` voting committee,
from 4 through 31 validators. Valid sizes are therefore 4, 7, 10, and so on,
up to 31. For `n = 3f + 1`, the Byzantine fault budget is `f` and the commit
quorum is `2f + 1`. Genesis generation and startup validation reject any other
committee geometry.

Observer peers can synchronize committed blocks, but they do not propose,
vote, or count toward the commit quorum. Use observers when a
deployment needs local query capacity, indexing, monitoring, or regional block
replication without increasing the number of voting validators.

### View changes and recovery

A view is Sumeragi's attempt to finalize one height with a particular proposer
and timing plan. If proposal, payload, vote, or commit progress stalls, the
pacemaker can move the height to a later view. A view change does not rewrite a
committed block. It changes how validators try to finish the uncommitted
height, carrying forward the highest known quorum or commit evidence so peers
do not finalize conflicting blocks.

Payload recovery is separate from the finality decision. A peer might receive
a quorum or commit certificate before it has the full block payload. In that
case, the peer requests signed RS16 payload chunks or a certified body,
verifies the recovered bytes against the advertised hashes, and only then
applies the block to the world state and Kura.

### Consensus modes

The selected mode controls how the validator set is formed and operated. It
is declared in signed genesis through
[`consensus_mode`](/reference/genesis.md) and frozen into each height context.
Local `[sumeragi]` configuration selects only the node role and finite block,
queue, runtime, storage, and key-policy limits; it cannot override the mode or
block cadence. Validators need the same signed genesis, topology, trusted peer
data, and effective Sumeragi parameters.

| Mode         | Best fit                                                                               | Validator set                                                                                                      | Operational focus                                                                                          |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Permissioned | Private, consortium, and operator-managed networks                                     | Validators come from the trusted peer topology agreed by the deployment                                            | Keep all validators on the same signed genesis, trusted peers, peer keys, and Sumeragi parameters          |
| NPoS         | Public or Nexus-oriented networks where validation follows nomination and stake policy | Validators are selected by the NPoS profile, usually across epochs, and require BLS keys plus Proofs-of-Possession | Keep stake snapshots, signed epoch and election inputs, validator PoPs, and immutable block cadence aligned across the network |

::: tip Permissioned mode

Use permissioned mode when the validator roster is an explicit operational
choice. This is the usual starting point for self-hosted Iroha networks
because membership changes are deliberate governance or administrator
actions. The important operational rule is that every validator must run with
the same view of genesis, trusted peers, BLS Proofs-of-Possession, and
Sumeragi parameters. A single peer with a different topology or signed genesis
can prevent the network from committing.

:::

::: tip NPoS mode

Use NPoS mode when the deployment profile expects validator participation
to be driven by nomination and stake state. Public SORA Nexus deployments
use NPoS, and their generated profiles include the BLS validator
identities, Proofs-of-Possession, epoch settings, and Sumeragi NPoS
parameters needed at startup. Epoch changes can replace the active validator
set at defined heights, so operators need to monitor both consensus health and
the stake or nomination state that feeds the next roster.

:::

## Multilane consensus

Iroha's multilane consensus path is implemented through Nexus lane and
dataspace configuration. It does not start a separate consensus instance
for each lane. Sumeragi still finalizes one ordered block stream; lanes
describe how transactions are routed, scheduled, accounted for, and stored
inside that stream.

The runtime configuration builds three pieces of lane state:

- `nexus.lane_catalog`: the configured lanes, each with a numeric `LaneId`,
  alias, dataspace, visibility, storage profile, proof scheme, and
  metadata.
- `nexus.dataspace_catalog`: the configured dataspaces, each with a numeric
  `DataSpaceId` and a fault-tolerance value used for relay committee
  sizing.
- `nexus.routing_policy`: the default lane/dataspace pair and ordered routing
  rules that can match accounts or instruction paths.

When a transaction enters the queue, the lane router resolves it to a
`RoutingDecision { lane_id, dataspace_id }`. In single-lane mode this is
always lane `0` and the universal dataspace. In Nexus mode, the configured
router applies dataspace-scoped rules, settlement routing, account rules,
explicit routing rules, and finally the default route. The resolved lane
and dataspace must exist in their catalogs, and the lane must be bound to
the resolved dataspace; otherwise the transaction is rejected before it is
queued.

The queue keeps this routing decision with the transaction hash so that
later stages do not have to infer it again. Proposal construction then uses
the lane metadata in two ways:

- It interleaves transactions by lane so one lane does not dominate the
  block just because its transactions were queued first.
- It applies per-lane transaction execution unit (TEU) limits. Transactions
  that would exceed a lane's configured capacity are deferred and requeued,
  except that the first overweight transaction for a lane can be admitted
  to avoid livelock.

During candidate preparation, Sumeragi aggregates the proposed payload by lane
and dataspace and derives the lane-local data-availability identities. The
recorded totals include transaction count, chunks, payload bytes, and TEU.
After commit, those totals become the lane and dataspace commitment snapshots
exposed through authenticated Sumeragi diagnostics. If a
block contains lane settlement receipts, block processing also creates lane
settlement commitments and relay envelopes that bind the block header,
commit certificate, data-availability commitment hash, settlement proof,
and lane payload size.

## Data availability and payload recovery

Sumeragi v2 carries global payload availability through signed RS16
`PayloadManifest` and `PayloadChunk` messages. The leader sends the signed
manifest to the full committee and initially distributes deterministic chunks
to Set A. A validator can Prepare-vote only after reconstructing the canonical
body, validating the manifest and chunk hashes, storing the body durably, and
completing deterministic validation. If the fast path stalls, recovery expands
chunk delivery to Set B. Certified-body recovery and block sync provide the
bounded recovery path when a peer learns finality before receiving the body.

Multilane execution additionally derives a deterministic payload-ownership
hash and lane-local RBC instance hash for each lane subject. Those identities
bind lane proposals and certificates to the global carrier; they are not a
separate global consensus session. A block still finalizes only when the peer
has a valid commit certificate and the matching payload locally.

Use the authenticated operator surfaces rather than a separate RBC endpoint:

- `iroha --operator-private-key-file <path> --output-format text ops sumeragi status`
  reports the authoritative height, view, phase, certificates, and liveness
  state.
- `iroha --operator-private-key-file <path> --output-format text ops sumeragi diagnostics`
  reports non-authoritative queue, pipeline, NPoS, lane, and dataspace
  diagnostics, including lane payload ownership.
- Prometheus signals such as `sumeragi_missing_block_requests`,
  `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`,
  `sumeragi_da_gate_block_total`, and `sumeragi_da_gate_satisfied_total`
  separate missing-body recovery, data-availability gates, and message
  handling; see
  [Performance and metrics](/guide/advanced/metrics.md).

Kura uses the derived lane configuration for storage layout. Each lane
receives deterministic storage names such as `blocks/lane_000_core` and
`merge_ledger/lane_000_core_merge.log`; lane lifecycle changes can
provision, retire, or relabel those segments without changing the global
block order.
