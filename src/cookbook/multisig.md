# Weighted Multisig

## Outcome

Register a three-member weighted multisig account on Taira, propose a
metadata instruction, approve it with enough weight to meet quorum, and
verify execution from the multisig account's state.

## Prerequisites

- Three canonical I105 signatory IDs in `SIGNER_A`, `SIGNER_B`, and
  `SIGNER_C`.
- Funded Taira configurations for signers A and C. The proposer and every
  approver pays for their own transaction.
- `taira.tx-metadata.json` built from the current faucet response, never
  from a copied fee asset ID.
- A Rust client project pinned to the same Iroha source revision as Taira for
  the registration step. The later proposal and approval steps use the CLI.
- The current executor's multisig feature enabled. Registration is
  available to ordinary accounts in the default Iroha 3 runtime, although
  Taira policy and fee admission still apply; use localnet if the public
  deployment denies it.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Steps

### 1. Register a weighted policy

Signer C has weight 2; A and B have weight 1 each. A quorum of 3 therefore
requires C plus either A or B. Derive the canonical account from that exact
policy before registration, then pass the same value to
`MultisigRegister::with_account`:

```rust
use std::{collections::BTreeMap, num::{NonZeroU16, NonZeroU64}};
use iroha::{
    data_model::{
        account::{MultisigMember, MultisigPolicy},
        prelude::*,
        transaction::FeePaymentIntent,
    },
    executor_data_model::isi::multisig::{
        MultisigApprove, MultisigPropose, MultisigRegister, MultisigSpec,
    },
};

let spec = MultisigSpec::new(
    BTreeMap::from([
        (signer_a.clone(), 1),
        (signer_b.clone(), 1),
        (signer_c.clone(), 2),
    ]),
    NonZeroU16::new(3).unwrap(),
    NonZeroU64::new(3_600_000).unwrap(),
);
let members = spec
    .signatories
    .iter()
    .map(|(account, weight)| {
        let key = account
            .controller()
            .single_signatory()
            .expect("multisig members must be single-key accounts");
        MultisigMember::new(key.clone(), u16::from(*weight))
            .expect("weights are nonzero")
    })
    .collect();
let policy = MultisigPolicy::new(spec.quorum.get(), members)?;
let multisig_account = AccountId::new_multisig(policy);
let register = MultisigRegister::with_account(
    multisig_account.clone(),
    None::<DomainId>,
    spec,
);

registrar.submit_blocking::<InstructionBox>(
    register.into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
println!("{}", multisig_account.canonical_i105()?);
```

Save the printed value for the CLI steps:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

At the pinned commit, the CLI registration command prints its temporary seed
before the runtime rekeys it. Do not reuse that seed as the controller. There
is no controller private key: multisig authority comes only from approved
proposals.

### 2. Build one instruction without submitting it

The global `-o` switch serializes an instruction array to standard output.
It does not submit a transaction and therefore spends no fee.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Propose as signer A

The proposer automatically contributes its own weight. Capture the exact
instruction hash printed by the CLI; approvals bind to that hash.

```bash
PROPOSE_OUTPUT="$({
  iroha --config "$SIGNER_A_CONFIG" \
    --output-format text \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger multisig propose \
    --account "$MULTISIG_ACCOUNT" \
    < multisig-instructions.json
})"
printf '%s\n' "$PROPOSE_OUTPUT"

INSTRUCTIONS_HASH="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^instructions_hash: //p' |
    head -n 1
})"
test -n "$INSTRUCTIONS_HASH"
```

List the still-pending proposal with an explicit finite selector:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Approve as signer C

A's weight 1 plus C's weight 2 reaches quorum 3 and executes the proposed
instruction as the multisig account.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

The Rust client can continue with the same policy-derived account and the two
lifecycle instructions used above:

```rust
let instructions = vec![SetKeyValue::account(
    multisig_account.clone(),
    "cookbook_quorum".parse()?,
    Json::from("approved"),
).into()];
let instructions_hash = HashOf::new(&instructions);
signer_a_client.submit_blocking::<InstructionBox>(
    MultisigPropose::new(multisig_account.clone(), instructions, None).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
signer_c_client.submit_blocking::<InstructionBox>(
    MultisigApprove::new(multisig_account, instructions_hash).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Verify

Read the post-state and confirm the proposal is no longer pending:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger account meta get \
  --id "$MULTISIG_ACCOUNT" \
  --key cookbook_quorum

iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"

iroha --config "$SIGNER_A_CONFIG" ledger multisig inspect \
  --account "$MULTISIG_ACCOUNT" \
  --json |
  jq .
```

The metadata value must be `"approved"`, the captured instruction hash must
no longer appear as pending, and the inspected controller must show weights
`1, 1, 2` with quorum `3`.

## Troubleshooting

- `signatory is not part of multisig` means the proposing or approving
  client does not correspond to one of the I105 IDs registered in the
  policy.
- A final approval can be rejected when the multisig account lacks
  permission to execute the proposed instructions. Grant authority to the
  multisig account, not merely to its individual signers, then let a
  remaining signer retry.
- A missing pending proposal can mean quorum was already reached, the TTL
  expired, or the wrong instruction hash/account selector was used. Query
  the post-state before proposing again.
- Duplicate approvals do not add weight. Each registered signatory
  contributes its configured weight at most once.
- Directly signing a normal transaction as the controller is forbidden.
  Always use `MultisigPropose` and `MultisigApprove`.
- If later commands cannot find the account printed during CLI registration,
  you captured the temporary seed. Derive the canonical account from the
  ordered policy and register with that value as shown above.

## Source and related docs

- [Multisig integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Multisig data model at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI multisig implementation at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Transactions](/blockchain/transactions.md)
- [Permissions and roles](./permissions-and-roles.md)
