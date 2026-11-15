# Sponsor Fees for a Private Data Space

A SORA Nexus fee sponsor program can pay the global execution fees of eligible
transactions routed to a private data space. The user still signs the complete
transaction. Its typed `FeePaymentIntent` selects an exact sponsor program and
immutable revision, a gas bound where required, and maximum charges.

A data space catalog entry does not create an independently signed root. An
independent data space root has its own committed fee currency and policy;
public sponsor vaults cannot authorize its private-root fees. Establish the
execution root before designing sponsorship.

## 1. Establish the Committed Fee Policy

Signed genesis authors one `root_fees_v1` custom parameter containing the
`RootFeePolicy`. It binds the fee currency, fee sink, sponsor custody account,
claim exemptions, and rates. Each ordinary block and quote uses its captured
committed policy. Authorized changes to the rates, fee sink, and claim
exemptions apply from the next block; the fee currency and sponsor custody
account cannot change after the first block.

For global execution, the native fee burns the exact signed network XOR
currency. The sponsor's program vault supplies that currency. Node settings
and transaction metadata do not select a payer or activate sponsorship.

Use the network's canonical currency and account identities. Alias resolution
must not redirect committed currency, custody, or sink identities.

## 2. Create and Fund a Sponsor Program

The program ID has the form `<canonical-sponsor-account>/<program-name>`.
Provision it through the typed instructions exposed by the current SDK and
data model:

| Instruction | Purpose |
| --- | --- |
| `CreateFeeSponsorProgram` | Create the staged program with its mandatory payout account. |
| `StageFeeSponsorProgramRevision` | Define one immutable eligibility, operation, and budget policy. |
| `EnrollFeeSponsorBeneficiary` | Record an eligible beneficiary on chain. |
| `FundFeeSponsorProgram` | Transfer assets into custody and credit the exact program vault. |
| `ActivateFeeSponsorProgramRevision` | Schedule the staged revision's earliest activation height. |

The sponsor or an exact delegated manager authorizes program administration.
Withdrawals require the sponsor itself and return funds only to the program's
recorded payout account while the program is paused or closing.

Each revision specifies:

- explicit enrollment, or enrollment plus permitted route-default eligibility;
- allow and deny rules over exact native instruction wire IDs or contract
  addresses, code hashes, and entrypoints;
- per-asset transaction, block, program-epoch, and beneficiary-epoch limits;
- a reserve floor and deterministic epoch length.

A deny rule takes precedence over an allow rule. A data space's
`fee_sponsor_program_id` grants route-default eligibility only if the active
revision permits it; the transaction must still name its exact program and
revision. Activation can be postponed until outstanding allocations from the
previous revision expire.

Sponsor vault assets must use the `Global` balance policy. Funding the sponsor's
ordinary account alone does not fund the isolated program vault, and one
program cannot consume another program's balance.

## 3. Quote, Sign, and Submit the Exact Transaction

An SDK integration performs these steps:

1. Construct the unsigned `TransactionPayload` with the authority, executable,
   timestamps, nonce, metadata, exact sponsor-program revision, and any
   required gas limit. Charge maxima can initially be empty.
2. Account-sign `POST /v1/fees/quote` with `{"payload": <payload>}`. The request
   signer must be the transaction authority.
3. Inspect the observed height, resolved data space route, fee components,
   debit source, and sponsor capacity. Verify that the response preserves
   the selected payer, revision, and gas bound.
4. Replace only `payload.fee_payment` with the recommended intent, then sign
   and submit that exact payload.
5. Track the transaction to state-resolved `Applied` finality and retain its
   receipt, including the actual sponsor program, revision, and charge.

A quote observes the ledger; it does not reserve capacity. Queue admission
rechecks eligibility and reserves the signed maxima. A sponsor refusal rejects
the transaction without falling back to charging the user.

The CLI names the same fee source explicitly. For example, after the program
allows this exact asset transfer and the account is eligible:

```bash
iroha --config ./user.client.toml \
  --fee-payer sponsor \
  --fee-program '<SPONSOR_CANONICAL_I105>/team-payments' \
  --fee-program-revision 1 \
  ledger asset transfer \
  --definition '<ASSET_DEFINITION_BASE58>' \
  --account '<USER_CANONICAL_I105>' \
  --to '<RECIPIENT_CANONICAL_I105>' \
  --quantity 1
```

Use the active revision and exact identifiers from your network. The user
config contains only that user's signer; the sponsor's private key is not
needed to submit an eligible sponsored transaction.

## 4. Decide Whether the User Pays an Application Fee

A sponsor can cover global fees while the application charges the user nothing.
If the application collects a local token, author that transfer or contract
rule explicitly in the user's signed executable. Include every operation in
the sponsor revision's policy and inspect the quote for the complete payload.
Do not infer an application-token transfer from the network fee intent.

## Diagnose a Refusal

Use the stable fee code and remediation details returned by the node:

| Code | Check |
| --- | --- |
| `program_not_found` | Exact canonical program identity. |
| `revision_not_active`, `program_not_active` | Revision activation and program lifecycle. |
| `beneficiary_not_eligible` | Enrollment or permitted route-default eligibility. |
| `operation_not_allowed`, `operation_denied` | Every exact signed operation and deny rule. |
| `invalid_gas_limit`, `signed_limit_exceeded` | Gas bound and signed maxima against a fresh quote. |
| `vault_insufficient` | Funded balance of this program's exact currency vault. |
| Budget-exhaustion codes | Transaction, block, program-epoch, and beneficiary-epoch capacity. |

Keep the original transaction hash and fee rejection details when investigating
an ambiguous submission. Confirm its status before building a replacement.

## Pinned Sources

- [Fee policy, program lifecycle, and quote protocol](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/nexus_fee_model.md)
- [Typed sponsor-program instructions](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/isi/nexus.rs)
- [CLI fee-source flags and asset transfer](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)
- [Data space setup](/get-started/sora-nexus-dataspaces.md)
