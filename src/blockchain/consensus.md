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
the proposal to the active validator set. Idle chains produce no empty blocks.

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
Set A validators normally send their Prepare and Commit votes to the round's
proxy tail, which aggregates exactly the required equal votes and broadcasts
the certificate. If a certificate is overdue, set B validators also vote to
the proxy tail; as a last resort every validator broadcasts its vote and any
validator can aggregate the certificate.

### Quorum and observers

The first-release protocol admits only an exact `3f + 1` voting committee,
from 4 through 31 validators. Valid sizes are therefore 4, 7, 10, and so on,
up to 31. For `n = 3f + 1`, the Byzantine fault budget is `f` and the commit
quorum is `2f + 1`. Genesis generation and startup validation reject any other
committee geometry. Every PrepareQC, CommitQC, and TimeoutCert carries exactly
`q = n - f` equal validator votes; signer supersets are rejected.

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
Local `[sumeragi]` configuration selects the node role, signing custody,
safety-record paths, and documented timeout and synchronization overrides.
Block and transaction limits, consensus mode, and cadence come from signed
genesis and committed state. Validators need the same signed genesis, topology, trusted peer
data, and effective Sumeragi parameters.

| Mode         | Best fit                                                                               | Validator set                                                                                                      | Operational focus                                                                                          |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Permissioned | Private, consortium, and operator-managed networks                                     | Validators come from the trusted peer topology agreed by the deployment                                            | Keep all validators on the same signed genesis, trusted peers, peer keys, and Sumeragi parameters          |
| NPoS         | Public or SORA Nexus-oriented networks where validation follows nomination and stake policy | Validators are selected by the NPoS profile, usually across epochs, and require BLS keys plus Proofs-of-Possession | Keep stake snapshots, signed epoch and election inputs, validator PoPs, and immutable block cadence aligned across the network |

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

Data spaces define environments for data, authority, policy, and applications.
Their lanes add dissemination and certification capacity. The catalogs are
separate: `nexus.dataspace_catalog` defines data spaces, and
`nexus.lane_catalog` defines lanes that each reference one data space. Several
lanes may share the same data space.

For public global execution, lane `0` is sequenced by the global Sumeragi
instance. Each other active lane incarnation runs a separate instance of the
same Sumeragi core with its pinned committee and consensus parameters. Its
certified block contains an ordered transaction batch checked for admission
against a committed global anchor. Lane certification does not mutate the
global State.

The global chain merges the next contiguous certified blocks from each lane.
Executing the resulting global block applies those transactions in canonical
order, and the global CommitQC finalizes that execution. A lane certificate
alone is therefore insufficient to claim that a transaction changed global
State. Lane identity, incarnation, anchor freshness, source custody, and
contiguous merge frontiers remain checked throughout recovery and execution.

The committed `sumeragi_lane_policy` governs fixed lanes, routes, committees,
and autoscaling. A configuration catalog alone does not activate a consensus
lane. Concrete data space targets must resolve to an admitted matching lane;
an unavailable private route is rejected instead of being executed as
universal work. Complete control-plane batches route through lane `0` so
catalog and activation transitions can progress.

An independently signed data space root is a separate execution boundary with
its own State and local finality. Registering a data space catalog entry does
not create that root. Cross-root atomicity uses the separate AMX protocol.
Monetary and whole-network qualification for that path remains open in the
pinned candidate.

See the pinned [lane implementation](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/sumeragi/lanes/mod.rs),
[lane contract](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi_lanes.md),
[independent data space contract](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi.md),
and [qualification status](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi_goals.md).

## Data availability and payload recovery

Sumeragi V1 carries global payload availability through signed RS16
`PayloadManifest` and `PayloadChunk` messages. The leader sends the signed
manifest and every signed row to all other committee members and to joining
members of the next committee. A validator can Prepare-vote only after
reconstructing the canonical body, validating the manifest and chunk hashes,
storing the body durably, and completing deterministic validation. A peer that
is missing rows requests them with `PayloadRequest`. Certified-body recovery
and block sync provide the bounded recovery path when a peer learns finality
before receiving the body.

Each lane instance uses its own authenticated availability and certificate
context. Global merge checks bind its certified batch and original payload to
the expected incarnation and anchor. A peer applies global finality only with
the matching global payload and valid CommitQC locally available.

Use the authenticated operator surfaces rather than a separate RBC endpoint:

- `iroha --operator-private-key-file <path> --output-format text ops sumeragi status`
  reports the authoritative height, view, phase, certificates, and liveness
  state.
- `iroha --operator-private-key-file <path> --output-format text ops sumeragi diagnostics`
  reports non-authoritative transaction-queue pressure, NPoS election state,
  and lane-governance manifest status.
- Per-instance Prometheus series such as `sumeragi_fetch_requests_total`
  (`kind="body"` for missing bodies, `kind="sync"` for catch-up),
  `sumeragi_view_changes_total`, `sumeragi_round_stage`, and
  `sumeragi_dropped_total` carry a `lane` label and separate missing-body
  recovery, view changes, and bounded-queue drops; see
  [Performance and metrics](/guide/advanced/metrics.md).

Lane block stores retain the certified batches and source records needed for
merge and recovery. Their lifecycle follows the committed lane incarnation;
a storage-directory name does not authorize a new lane or execution root.
