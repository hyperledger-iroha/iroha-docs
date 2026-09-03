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
artifact for deployment. Kotodama targets IVM only. It does not target RISC-V
or WebAssembly.

The first release supports only ABI version 1. The syscall and pointer-ABI
policy is enforced unconditionally by contract admission and execution; there
is no runtime compatibility toggle.

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

`Executable::Ivm` carries raw IVM bytecode. Nodes execute that bytecode inside
the runtime limits configured for the chain. Keep bytecode small and
deterministic; contracts are part of transaction execution and therefore affect
consensus.

`Executable::IvmProved` is intended for proof-carrying flows. It carries:

- IVM bytecode
- a deterministic instruction overlay
- an execution-events commitment
- a gas-policy commitment

The proof binds the overlay to the executed bytecode. Depending on pipeline
policy, validators can verify the proof and replay execution as an additional
safety check.

## Deployed Contract Calls

`Executable::ContractCall` invokes a deployed contract instance by address.
Use this when contract code is registered separately and transactions should
call it by reference instead of carrying the bytecode every time.

## Contract Lifecycle and Ownership

Every deployed address retains a `ContractLifecycleControlV1` record, including
while the contract is inactive. The record contains immutable first-deployment
provenance, the current and pending owner, any revocable Parliament delegation,
the active code hash, a non-zero compare-and-swap revision, and any retained
emergency hold. A direct deployment assigns the submitting account as owner and
records it as the deployment origin. A Parliament deployment assigns Parliament
as owner and records its proposer, proposal-content ID, and successful governance
attempt ID only as provenance.

Configured protected namespaces are reserved for Parliament deployment. Holding
`CanRegisterSmartContractCode` permits artifact registration but does not
authorize direct deployment or raw activation into a protected namespace; the
initial lifecycle record there must be created by the certified Parliament
deployment path.

The lifecycle owner is either one account or Parliament. Account ownership
changes use `OfferContractOwnership` followed by the pending owner's
`AcceptContractOwnership`; the current owner can withdraw an unaccepted offer
with `CancelContractOwnershipOffer`. Acceptance clears any Parliament
delegation. Account removal is rejected while the account owns a contract or is
the pending owner in an outstanding offer.

An account owner can allow Parliament to upgrade, activate, or deactivate the
contract, then revoke that delegation. Delegation never allows Parliament to
transfer ownership or change the delegation itself. Parliament-owned changes
and Parliament acceptance are enacted through certified governance effects.

Raw `ActivateContractInstance` and `DeactivateContractInstance` instructions
are available only to the current account owner. They must carry the record's
exact `expected_revision`; stale or zero revisions fail closed. Raw activation
cannot create a lifecycle record, and it validates the registered artifact,
manifest, and ABI before changing `active_code_hash`. Deactivation clears the
active code hash but retains ownership and provenance. Every successful
lifecycle transition advances the revision and emits the complete post-state.

An Emergency-tier Parliament proposal can impose a hold only through the full
Parliament pipeline and with Aye votes from at least two-thirds of the original
Policy Jury seats. The hold binds the current revision, code hash, and a
non-zero incident digest, and lasts for at most 3,600 blocks. It can only
suspend calls and trigger execution: it cannot be extended or change code,
ownership, or delegation. Calls and matching trigger executions are blocked
from the imposition height up to, but not including, the expiry height. Expiry
automatically restores execution but does not erase the hold. A certified
`CompleteEmergencyHoldRetrospective` action must later bind the exact hold IDs
and digest plus a non-zero finding root before the record is cleared; another
hold cannot be imposed until that retrospective is complete.

When the app API is enabled, read the retained state with
`GET /v1/gov/contracts/{contract_address}`. Its `found` field means that a
lifecycle record exists, not that the address currently has active code.

## Operational Guidance

- Keep contracts deterministic. Contract behavior must not depend on local
  wall-clock time, host filesystem state, network calls, or other peer-local
  inputs.
- Keep payloads compact. Large bytecode increases transaction size and block
  propagation cost.
- Prefer typed instructions for simple ledger changes. They are easier to
  audit and cheaper to execute.
- Treat contract upgrade and registration permissions as high-risk
  operational controls.

See also:

- [Instructions](/blockchain/instructions.md)
- [Triggers](/blockchain/triggers.md)
- [Permissions](/blockchain/permissions.md)
- [Data model schema](/reference/data-model-schema.md)
