---
translation_locale: dz
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 7ee18275d25837da53f533f5e9205906ccaa71b48afd9b11ffad79b599da7f21
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ངོས་ལེན་དང་ འགན་འཁྲི་ཚུ་ {#permissions-and-roles}

## གྲུབ་འབྲས་ {#outcome}

རྩིས་ཁྲ་གཅིག་ལུ་རྩིས་ཁྲ་གཅིག་གི་དོན་ལུ་ metadata གསར་གཏོད་འབད་ནིའི་ གོ་སྐབས་བྱིན་མི་ འགན་འཁྲི་བཟོ་ནི་དེ་ བརྗེ་སོར་འབད་མི་ཅིག་ལུ་བཅའ་མར་གཏོགསཔ་ད་ བརྗེ་སུར་ཅན་གྱི་ཡིག་འབྲུ་འདི་ བདེན་ཁུངས་བཀལ་ཞིནམ་ལས་ Rust འབྲི་ཐོ་བཀོད་འབད་ཡོད་པའི་ བརྡ་བཀོད་ཚུ་བཏོན་འོང་།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- དངུལ་ཕོགས་ཐོབ་མི་ Taira ཚོང་མགྲོན་པ་དང་ཁྲལ་གྱི་བརྡ་དོན་ཚུ་ [ལས་ Taira](./connect-to-taira.md) ལུ་ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན།
- `TARGET_ACCOUNT` དང་ `DELEGATE_ACCOUNT` ཀ་ནོ་ནི་ཀཱན་གྱི་དོན་ལུ་ གཞི་སྒྲིག་འབདཝ་ཨིན། I105 རྩིས་ཁྲ་ IDs.
- ཐོ་བཀོད་འབད་མིའི་རྩིས་ཁྲ་ལུ་ དམིགས་གཏད་ཅན་གྱི་ ངོས་ལེན་དང་ འགན་འཁྲི་ཚུ་ འཛིན་སྐྱོང་འབད་ནིའི་ གོ་སྐབས་བྱིན་དགོཔ་ཨིན། Taira ལུ་ འ་ནི་འདི་ ངོས་ལེན་གི་སྒོ་ཁར་ཡོད་མི་ འཛིན་སྐྱོང་ལས་འགུལ་ཨིན། ཁྱོད་ཀྱིས་ `CanManageRoles` དང་ ཚད་གཞི་བཀོད་ཡོད་པའི་ ངོས་ལེན་སྤྲོད་ནིའི་དོན་ལུ་ དགོས་མཁོ་ཅན་གྱི་དབང་འཛིན་ ཐོབ་ཚུགས། ཡང་ན་ བཟོ་སྐྲུན་འབད་མི་ ས་གནས་ཀྱི་ཁ་ཐུག་ལུ་ བཀྲམ་སྟོན་འབད་འོང་།

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

ཡིག་འབྲུ་འདི་བརྟག་དཔྱད་འབད་བའི་སྐབས་ ཌེ་ལི་གེཌ་གི་དོན་ལུ་ client གཉིས་པ་གི་བཟོ་སྒྲིག་ལག་ལེན་འཐབ་:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## རིམ་པ་ཚུ་ {#steps}

### 1. འགན་འཁྲི་སྟོང་པ་ཅིག་ ཐོ་བཀོད་འབད་ {#_1-register-an-empty-role}

གནས་སྟངས་བསྒྱུར་བཅོས་འབད་མི་ CLI བཀའ་རྒྱ་རེ་རེ་གིས་འཐུས་སྤྲོད་མི་ལུ་ གསལ་ཏོག་ཏོ་སྦེ་མིང་བཏགས་དོ་ཡོདཔ་ཨིན། མེ་ཊ་ཌའི་ཊ་ཡིག་སྣོད་ནང་ལུ་ ཐབ་ལམ་གྱི་ལན་ནང་ལས་ འབྱུང་འབབ་ཡོད་པའི་ད་ལྟོའི་ Taira འཐུས་དངུལ་ཀྲམ་ཚུ་ཡོདཔ་ཨིན།

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. དམིགས་གཏད་རྩིས་ཁྲ་ལུ་ ངོས་ལེན་ཚད་ལྡན་བཙུགས་ནི། {#_2-add-a-permission-scoped-to-the-target-account}

ངོས་ལེན་རྟགས་མཚན་འདི་ JSON འདྲ་ཕབ་ཚུ་ཨིན། ཁྱོད་ཀྱིས་རྩིས་ཁྲ་དེ་ `payload` ནང་ལུ་ I105 ID སྦེ་བཞག་དགོ། མིང་མིང་འདི་ འ་ནི་ཐད་ཀར་གྱི་ས་ཁོངས་ནང་ ཆ་མེད་གཏང་མི་ཨིན།

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3.འགན་ཁུར་དེ་འཐུས་མི་ལུ་སྤྲོད་དགོ། {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

འགན་འཁྲི་དང་ གནང་བ་ཚུ་ དུས་ཡུན་མ་ཆོགཔ་ལས་ དགོས་མཁོ་མེད་པའི་སྐབས་ གསལ་ཏོག་ཏོ་སྦེ་ བཏོན་གཏང་དགོ།

### 4. དབང་ཚད་ལག་ལེན་འཐབ་ནི་ {#_4-exercise-the-delegated-permission}

ཡིག་ཆ་འབྲི་ནིའི་དོན་ལུ་ ངོ་ཚབ་ཀྱི་ཡིག་སྣོད་དང་འཐུས་དངུལ་ཀྲམ་ཚུ་ལག་ལེན་འཐབ་ཨིན། JSON ཚད་གཞི་ནང་ཐོ་བཀོད་ལས་ལྷག་ཚུགས།

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

འ་ནི་དཔེ་འདི་ Rust ཌའི་ལོག་ལུ་ལག་ལེན་འབད་ཚུགསཔ་ཨིན། འདི་ནང་ལུ་ `client` གིས་ `registrar_account` བཟོ་བཀོད་འབདཝ་ཨིན་ འདི་གིས་འགན་ཁུར་གྱི་ འགོ་ཐོག་གི་ཇོ་བདག་སྦེ་འགྱུར་དོ་ཡོདཔ་ད་ འདི་ཡང་ CLI ལྡོག་ཕྱོགས་ནང་འབདཝ་ཨིན། རྩིས་ཁྲ་ཀྱི་འགྱུར་ལྡེ་གསུམ་ཆ་རང་ལུ་ ཧེ་མ་ལས་ `AccountId` གི་གོང་ཚད་ཚུ་ བརྟག་ཞིབ་འབད་ཡོདཔ་ཨིན།

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all_blocking::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## བརྟག་དཔྱད་འབད་ {#verify}

ལས་འགན་གི་ཕྱོགས་གཉིས་ཆ་ར་ཐོ་འགོད་འབད་ཞིནམ་ལས་ འཐུས་མི་གིས་བྲིས་མིའི་ གནས་གོང་ཚུ་ ཀློག་སྟེ་བལྟ་:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

འཁྲུན་ཆོད་ཐོ་ནང་ `CanModifyAccountMetadata` གིས་ `TARGET_ACCOUNT` ལུ་ཁྱབ་ཚད་བཟུང་དགོཔ་ཨིན། ངོ་ཚབ་གི་འགན་ཁུར་ཐོ་ནང་ `ROLE_ID` ཡོད་པའི་ཁར་ ཀློག་ཐེངསམ་མེ་ཊ་ཌ་ཊ་ཌེ་ཊ་དེ་ `"delegated"` སླར་ལོག་འབད་དགོཔ་ཨིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `Not permitted` གིས་ ཐོ་བཀོད་འབད་ནི་དང་ བསྒྱུར་བཅོས་འབད་ནི་ ཡང་ན་ འགན་འཁྲི་བགོ་བཀྲམ་འབད་པའི་སྐབས་ ངོ་རྟགས་རྐྱབ་མི་དེ་གིས་ དགོས་མཁོ་ཅན་གྱི་ Taira དབང་ཚད་མེད་ཟེར་ཨིན་མས། དམིགས་གཏད་ཅན་གི་རྟགས་མཚན་འདི་ འཛམ་གླིང་ཡོངས་ཀྱི་རྟགས་མཚན་ཅིག་གིས་མ་བརྗེ་སོར་འབད། དེ་གི་དོན་ལུ་ ཚད་ལྡན་ལག་ལེན་གྱི་དོན་ལུ་ ཞུ་བ་རྐྱབས། ཡང་ན་ localnet ལག་ལེན་འཐབ་དགོ།
- ཁེ་ཕན་གྱི་འགན་ཁུར་དེ་ བརྟག་ཞིབ་འབད་ནིའི་འཛོལ་བ་འདི་ `account` འདི་ `payload` གི་སྦོ་ལོགས་ཁར་བཞག་ཡོདཔ་དང་ I105 ID ཀྱི་ཚབ་ལུ་ མིང་རྟགས་ཅིག་བྱིན་ཡོདཔ་དང་ ཡང་ན་ JSON གྱི་གོང་ཚད་འདི་ ཚར་གཉིས་སྦེ་བཀོད་ཡོདཔ་ཨིན།
- ཟད་འགྲོ་བཏང་མ་དགོ་པའི་ཁྲལ་དེ་ ཐོ་བཀོད་འབད་མི་དེ་ ལག་ལེན་པ་ཅིག་ཨིན་མི་ ལས་འཛིན་ལུ་ དངུལ་ཕོགས་སྤྲོད་ནི་དང་ རང་དབང་སྦེ་ བརྗེ་སོར་འབད་ནི་ དེ་ལས་ faucet-derived fee asset metadata འདི་ བཞག་ནི་ཨིན་པས།
- འགན་འཁྲི་ལག་ལེན་ལེགས་ཤོམ་ཅིག་གིས་ ཐོ་བཀོད་འབད་ཡོད་པའི་ ལག་ལེན་གྱི་ཁྱབ་ཚད་ལས་འགལ་མི་ཨིན། འ་ནི་འགན་ཁུར་འདི་གིས་ ཆ་འཇོག་གི་ཁེ་ཕན་ནང་ལུ་མིང་བཀོད་ཡོད་པའི་རྩིས་ཁྲ་རྐྱངམ་གཅིག་ལུ་འགྱུར་བཅོས་འབད་ཚུགས།
- གཙང་སྦྲ་བཟོ་ནིའི་དོན་ལུ་ `ledger account role revoke`, དེ་ལས་ `ledger role permission revoke` དང་ མཇུག་བསྡུ་ཁམས་ལུ་ `ledger role unregister` བཏོན་གཏང་; གཅིག་གིས་གཅིག་ལུ་རང་ ཡིག་འབྲུ་བཀོད་ནི་ཨིནམ་ད་ འདི་གིས་ `--fee-payer authority` དང་ཁྲལ་གྱི་བརྡ་དོན་ཚུ་རྩིས་དགོཔ་ཨིན་མས།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [འགན་འཁྲི་མཐུན་འབྲེལ་བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs) ལུ་འབདཝ་ཨིན།
- [ངོས་ལེན་མཐུན་འབྲེལ་བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs) ལུ་འབདཝ་ཨིན།
- [བཙུགས་ཡོད་པའི་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs) ལུ་ ནང་འཁོད་ལུ་ ངོས་ལེན་ཡིག་གཟུགས་བཟོ་ཡོདཔ་ཨིན།
- [འཁྲུན་ཆོད་དང་ འགན་ཁུར་ཚུ་](/dz/blockchain/permissions.md)
- [ངོས་ལེན་གྱི་བརྡ་དོན་ཁ་བྱང་](/dz/reference/permissions.md)
- [metadata](./metadata.md)
