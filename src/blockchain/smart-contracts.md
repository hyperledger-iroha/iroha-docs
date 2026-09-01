# Smart Contracts

Iroha transactions execute `Executable` payloads. The current data model
supports:

- `Executable::Instructions`: an ordered set of Iroha Special Instructions
- `Executable::ContractCall`: a by-reference call to a deployed contract
  instance
- `Executable::Ivm`: Iroha VM bytecode
- `Executable::IvmProved`: Iroha VM bytecode with a precomputed instruction
  overlay and proof commitments

Kotodama is Iroha's high-level smart-contract language. A `.ko` source file
compiles to deterministic IVM bytecode, conventionally stored as a `.to`
artifact for deployment. Kotodama targets IVM only. It does not target
RISC-V or WebAssembly.

The first release supports only ABI version 1. The syscall and pointer-ABI
policy is one unconditional V1 contract enforced by admission and execution;
there is no alternate runtime mode.

## When To Use Smart Contracts

Use normal instructions when the transaction can be expressed directly:

- register or unregister objects
- mint, burn, or transfer assets
- update metadata
- grant or revoke permissions
- execute a trigger
- set on-chain parameters

Use a smart contract when the transaction needs packaged logic that is
awkward to express as a static instruction sequence, or when a deployed
contract instance should be called by reference.

## IVM Executables

`Executable::Ivm` carries raw IVM bytecode. Nodes execute that bytecode
inside the runtime limits configured for the chain. Keep bytecode small and
deterministic; contracts are part of transaction execution and therefore
affect consensus.

`Executable::IvmProved` is intended for proof-carrying flows. It carries:

- IVM bytecode
- a deterministic instruction overlay
- an execution-events commitment
- a gas-policy commitment

The proof binds the overlay to the executed bytecode. Depending on pipeline
policy, validators can verify the proof and replay execution as an
additional safety check.

## Deployed Contract Calls

`Executable::ContractCall` invokes a deployed contract instance by address.
Use this when contract code is registered separately and transactions
should call it by reference instead of carrying the bytecode every time.

## Contract Lifecycle and Ownership

Every deployed address retains a `ContractLifecycleControlV1` record,
including while the contract is inactive. The record contains immutable
first-deployment provenance, the current and pending owner, any revocable
Parliament delegation, the active code hash, a non-zero compare-and-swap
revision, and any retained emergency hold. A direct deployment records the
deploying account. A Parliament deployment records its proposer,
proposal-content ID, and successful governance attempt ID.

The lifecycle owner is either one account or Parliament. Account ownership
changes use a separate offer and acceptance; accepting an offer clears any
Parliament delegation. An account owner can allow Parliament to activate or
deactivate the contract, then revoke that delegation, but delegation never
allows Parliament to transfer ownership. Parliament-owned changes and
Parliament acceptance are enacted through certified governance effects.

Raw `ActivateContractInstance` and `DeactivateContractInstance`
instructions are available only to the current account owner. They must
carry the record's exact `expected_revision`; stale or zero revisions fail
closed. Raw activation cannot create a lifecycle record, and it validates
the registered artifact, manifest, and ABI before changing
`active_code_hash`. Deactivation clears the active code hash but retains
ownership and provenance. Every successful lifecycle transition advances
the revision and emits the complete post-state.

Activation can also stage one manifest-declared lifecycle hook. A first
activation whose manifest contains an `EntryPointKind::Hajimari` entrypoint
(`hajimari`/`始まり`) stages `Hajimari`. Rebinding an active address to
code whose manifest contains an `EntryPointKind::Kaizen` entrypoint
(`kaizen`/`改善`) stages `Kaizen`. The binding changes immediately, but the
contract is not ready: every `Kotoage` and `View` call is rejected until
the exact staged hook succeeds. Another activation is also rejected while a
hook is pending.

Invoke the staged hook with `Executable::ContractCall` at the same contract
address and new code hash, using the exact `hajimari` or `kaizen`
entrypoint and the arguments declared by its manifest. The runtime supplies
the address-and-selector-scoped `CanInvokeContractEntrypoint` permission;
callers must not create or grant that permission. The pending marker
contains a runtime-generated, deterministic `transition_id` and the new
`code_hash`; a `Kaizen` marker also contains `previous_code_hash`. Clients
neither calculate nor submit `transition_id`. A successful hook consumes
the marker atomically, while a failed hook leaves it pending for a later
retry.

An Emergency-tier Parliament proposal can impose a hold for at most 3,600
blocks when it binds the current revision, code hash, and a non-zero
incident digest. Calls are blocked from the imposition height up to, but
not including, the expiry height. Expiry restores execution but does not
erase the hold. A certified `CompleteEmergencyHoldRetrospective` action
must later bind the exact hold IDs and digest plus a non-zero finding root
before the record is cleared; another hold cannot be imposed while that
retrospective remains outstanding.

When the app API is enabled, read the retained state with
`GET /v1/gov/contracts/{contract_address}`. Its `found` field means that a
lifecycle record exists, not that the address currently has active code.

## Operational Guidance

- Keep contracts deterministic. Contract behavior must not depend on local
  wall-clock time, host filesystem state, network calls, or other
  peer-local inputs.
- Keep payloads compact. Large bytecode increases transaction size and
  block propagation cost.
- Prefer typed instructions for simple ledger changes. They are easier to
  audit and cheaper to execute.
- Treat contract upgrade and registration permissions as high-risk
  operational controls.

See also:

- [Instructions](/blockchain/instructions.md)
- [Triggers](/blockchain/triggers.md)
- [Permissions](/blockchain/permissions.md)
- [Data model schema](/reference/data-model-schema.md)
