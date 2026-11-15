# Permissions and Roles

## Outcome

Create a role that grants one account permission to update metadata on one
specific account, assign it to a delegate, prove the delegated write, and
show the corresponding typed Rust instructions.

## Prerequisites

- A funded Taira client from
  [Connect to Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` and `DELEGATE_ACCOUNT` set to canonical I105 account
  IDs.
- The signing account must hold `CanManageRoles` and must be able to
  delegate the scoped permission: it is `TARGET_ACCOUNT` itself or already
  holds `CanModifyAccountMetadata` for that account. On Taira this is a
  permission-gated administrative operation. A generated localnet's client
  does not hold `CanManageRoles`, so the recipe needs a network whose
  genesis grants it.

```bash
CONFIG=./taira.client.toml
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Use a second client configuration for the delegate when proving the write:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Steps

### 1. Register an empty role

Every state-changing CLI command names the fee payer explicitly. The CLI
quotes the exact fee, in Taira's fee asset, before signing.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. Add a permission scoped to the target account

Permission tokens are typed JSON objects. Keep the account inside `payload`
as an I105 ID; an alias is not valid in this strict field.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Assign the role to the delegate

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Roles and their grants do not expire. Revoke them explicitly when the
access is no longer needed.

### 4. Exercise the delegated permission

Use the delegate's signer and fee balance for the write. JSON values are
read from standard input.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

The same model is available to Rust clients. Here `client` is an
`iroha::blocking::Client` that signs as `registrar_account`, which becomes
the role's initial owner just as it does in the CLI flow. All three account
variables are already parsed `AccountId` values:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Verify

Read the delegate's effective permissions, which include role grants, then
read the exact value written by the delegate:

```bash
iroha --config "$CONFIG" --machine account permission list \
  --id "$DELEGATE_ACCOUNT" --all \
  | jq -e --arg account "$TARGET_ACCOUNT" \
    '.items | any(.name == "CanModifyAccountMetadata"
      and .payload.account == $account)'

iroha --config "$CONFIG" account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

The delegate's effective permissions must contain
`CanModifyAccountMetadata` scoped to `TARGET_ACCOUNT`, and the metadata
read must return `"delegated"`. Torii refuses role listings through signed
queries, so the effective-permission listing is the assignment check.

## Troubleshooting

- `Not permitted` while registering, editing, or assigning the role means
  the signer lacks the required Taira authority. Do not replace the scoped
  token with a global one; request the exact grant.
- A payload parsing error usually means `account` was placed beside
  `payload`, an alias was supplied instead of an I105 ID, or the JSON value
  was quoted twice.
- A fee rejection belongs to the signer submitting that step. Fund the
  manager and delegate independently in the fee asset named by each fee
  quote.
- A successful role grant does not override the scope encoded in its
  tokens. This role can modify only the account named in the permission
  payload.
- To clean up, run `account role revoke`, then
  `ledger role permission revoke`, and finally `ledger role unregister`;
  each is a separate write and must include `--fee-payer authority`.

## Source and related docs

- [Role integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [Permission integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [Built-in permission data model at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [Permissions and roles](/blockchain/permissions.md)
- [Permission token reference](/reference/permissions.md)
- [Metadata](./metadata.md)
