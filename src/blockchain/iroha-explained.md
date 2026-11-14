# Iroha Explained

Iroha 3 is the first-release Hyperledger Iroha platform. The same core
supports self-hosted networks and the SORA Nexus execution model for data
spaces and multi-lane routing.

## Core Building Blocks

- **`iroha3d`** runs peers
- **Torii** is the client and operator gateway
- **Sumeragi** handles consensus
- **Norito** is the [canonical binary format](/reference/norito.md)
- **IVM** runs portable smart contracts and bytecode
- **Kotodama** compiles high-level `.ko` contracts to IVM `.to` bytecode
- **Kagami** prepares keys, genesis, profiles, and localnets
- **SORA Nexus service planes** add Soracloud, Inrou, SoraNet, SoraFS, and
  SoraDNS for app hosting, privacy transport, storage, and naming

## Execution Model

Every change to world state still happens through transactions.
Transactions carry instructions or IVM bytecode, and Torii is the main way
clients submit them or observe their effects.

- data spaces provide environments for institutional data, authority, policy,
  and applications
- lanes provide routing and certification capacity within those environments
- an independently signed data space root owns its State and local finality

## Data spaces and execution roots {#multi-dataspace-architecture}

A data space catalog entry defines an environment and its identity. A catalog
entry alone does not establish an independent execution root. Public lanes
certify transaction batches for execution by the global chain; an independently
signed data space root has its own State, committee, and local finality.

`DataSpaceCatalog` defines data spaces, while `LaneCatalog` defines lanes.
Every lane references exactly one data space through `dataspace_id`; a data
space can contain several lanes. `DataSpaceId` and `LaneId` are distinct
identities, and a lane alias does not create another data space.

At runtime, a data space is represented by a numeric `DataSpaceId` and
catalog metadata. `DataSpaceId::UNIVERSAL` is reserved as `0`; the default
catalog contains the `universal` data space. Each configured data space has:

- a unique numeric ID
- a unique alias such as `universal` or an explicitly registered institutional name
- an optional description for operator surfaces
- a non-zero `fault_tolerance` value used to size relay committees

Lanes are the routing and certification resources bound to those data spaces. A
lane entry carries a `LaneId`, the `DataSpaceId` it serves, an alias,
visibility (`public` or `restricted`), storage profile (`full_replica`,
`commitment_only`, or `split_replica`), proof scheme, and optional
governance, settlement, and scheduler metadata. The runtime derives
per-lane storage geometry from this catalog, including Kura segment names
and deterministic key prefixes.

The routing path is:

1. Configuration builds a validated `DataSpaceCatalog`, `LaneCatalog`, and
   `LaneRoutingPolicy`. SORA Nexus routing is mandatory. Multiple data spaces,
   lanes, or non-default routing use the SORA Nexus profile (`--sora`) and NPoS.
2. The transaction queue resolves a `RoutingPlan` from the transaction and
   committed state. Each coordinator or participant route contains a lane ID
   and data space ID; Native AMX plans retain the full participant set.
3. For global execution, complete control-plane batches and cross-data space
   coordinators use lane `0`. Concrete non-universal instruction or
   contract-address targets select an admitted fixed lane with the matching
   data space and committee before account or instruction-label rules.
   Other work follows committed explicit rules and default sharding;
   concrete universal targets remain on universal lanes.
4. Every route is checked against the catalogs and active lane state. Unknown
   IDs and lane/data space mismatches are rejected; an unavailable private
   target cannot fall back to universal execution. Multiple data space
   targets can produce a Native AMX plan. Transaction metadata `amx_policy`
   set to `reject_cross_dataspace` rejects cross-data space plans. A routing
   plan alone does not authorize or complete settlement across independent roots.
5. Sumeragi and telemetry keep the assignment visible as lane and data space
   activity, backlog, and commitment snapshots.

This is why object identifiers matter. Domains include the data space alias
in their ID, for example `payments.universal`, so domain-scoped writes can
be routed. Accounts remain canonical and domainless, so the same account
can be bound into different application scopes without changing its
`AccountId`. Asset definitions can carry a domain/data space projection,
which lets asset operations inherit the correct data space route.

Without SORA Nexus overrides, the node uses a single lane and the `universal`
data space. The bundled SORA Nexus profile replaces that with a three-lane
catalog: `core` for the universal public lane, `governance` for governance
traffic, and `zk` for zero-knowledge attachment and contract-deployment
traffic.

All three bundled lanes are public and reference the same `universal` data
space. They separate workload classes:

| Data space    | Lane         | Why it exists                                                                                                                                       |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal` | `core` | Ordinary public ledger traffic and default routing. |
| `universal` | `governance` | Public governance and SORA Parliament traffic. |
| `universal` | `zk` | Public zero-knowledge attachment and contract-deployment traffic. |

`DataSpaceId::UNIVERSAL == 0` is the reserved baseline. The `governance` and
`zk` names above identify lanes, not separate data spaces. Different institutional
boundaries require explicit data space entries; independent execution additionally
requires an independently authenticated root.

These relationships are fixed by the pinned
[profile constructors](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_config/src/parameters/actual.rs),
[lane implementation](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/sumeragi/lanes/mod.rs),
and [independent-root contract](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi.md).

Sumeragi always uses data availability and reliable broadcast. These paths are
part of the Iroha 3 consensus protocol and cannot be disabled by a deployment
profile.

Runtime behavior is sourced from configuration files and on-chain parameters.
Environment variables are not production feature gates.

## Read Next

- [SORA Nexus services](/blockchain/sora-nexus-services.md)
- [Launch Iroha 3](/get-started/launch-iroha.md)
- [World, WSV, and Kura storage](/blockchain/world.md)
- [Genesis reference](/reference/genesis.md)
- [Torii endpoints](/reference/torii-endpoints.md)
