---
translation_locale: dz
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: human-reviewed
---
# ངོས་ལེན་དང་ འགན་འཁྲི་ཚུ་ {#permissions-and-roles}

## གྲུབ་འབྲས་ {#outcome}

རྩིས་ཐོ་གཅིག་ལུ་རྩིས་ཐོ་གཅིག་གི་དོན་ལུ་ ཟུར་གནས་གནད་སྡུད གསར་གཏོད་འབད་ནིའི་ གོ་སྐབས་བྱིན་མི་ འགན་འཁྲི་བཟོ་ནི་དེ་ བརྗེ་སོར་འབད་མི་ཅིག་ལུ་བཅའ་མར་གཏོགསཔ་ད་ བརྗེ་སུར་ཅན་གྱི་ཡིག་འབྲུ་འདི་ བདེན་ཁུངས་བཀལ་ཞིནམ་ལས་ Rust འབྲི་ཐོ་བཀོད་འབད་ཡོད་པའི་ བརྡ་བཀོད་ཚུ་བཏོན་འོང་།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- དངུལ་ཕོགས་ཐོབ་མི་ Taira ཚོང་མགྲོན་པ་དང་ཁྲལ་གྱི་བརྡ་དོན་ཚུ་ [ལས་ Taira](./connect-to-taira.md) ལུ་ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན།
- `TARGET_ACCOUNT` དང་ `DELEGATE_ACCOUNT` འདི་ ཚད་ལྡན I105 རྩིས་ཐོ IDs ལུ་གཞི་སྒྲིག་འབད།
- ཐོ་བཀོད་འབད་མིའི་རྩིས་ཐོ་ལུ་ དམིགས་གཏད་ཅན་གྱི་ ངོས་ལེན་དང་ འགན་འཁྲི་ཚུ་ འཛིན་སྐྱོང་འབད་ནིའི་ གོ་སྐབས་བྱིན་དགོཔ་ཨིན། Taira ལུ་ འ་ནི་འདི་ ངོས་ལེན་གི་སྒོ་ཁར་ཡོད་མི་ འཛིན་སྐྱོང་ལས་འགུལ་ཨིན། ཁྱོད་ཀྱིས་ `CanManageRoles` དང་ ཚད་གཞི་བཀོད་ཡོད་པའི་ ངོས་ལེན་སྤྲོད་ནིའི་དོན་ལུ་ དགོས་མཁོ་ཅན་གྱི་དབང་འཛིན་ ཐོབ་ཚུགས། ཡང་ན་ བཟོ་སྐྲུན་འབད་མི་ ས་གནས་ཀྱི་ཁ་ཐུག་ལུ་ བཀྲམ་སྟོན་འབད་འོང་།

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

འབྲི་ནི་བདེན་ཁུངས་བཀལ་བའི་སྐབས་ སྐུ་ཚབ་ཀྱི་དོན་ལུ་ མཁོ་སྤྲོད་རིམ་སྒྲིག་གཉིས་པ་ལག་ལེན་འཐབ།

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## རིམ་པ་ཚུ་ {#steps}

### 1. འགན་འཁྲི་སྟོང་པ་ཅིག་ ཐོ་བཀོད་འབད་ {#_1-register-an-empty-role}

གནས་སྟངས་བསྒྱུར་བཅོས་འབད་མི་ CLI བཀའ་རྒྱ་རེ་རེ་གིས་འཐུས་སྤྲོད་མི་ལུ་ གསལ་ཏོག་ཏོ་སྦེ་མིང་བཏགས་དོ་ཡོདཔ་ཨིན། མེ་ཊ་ཌའི་ཊ་ཡིག་སྣོད་ནང་ལུ་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་གྱི་ལན་ནང་ལས་ འབྱུང་འབབ་ཡོད་པའི་ད་ལྟོའི་ Taira འཐུས་དངུལ་ཀྲམ་ཚུ་ཡོདཔ་ཨིན།

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. དམིགས་གཏད་རྩིས་ཐོ་ལུ་ ངོས་ལེན་ཚད་ལྡན་བཙུགས་ནི། {#_2-add-a-permission-scoped-to-the-target-account}

ངོས་ལེན་རྟགས་མཚན་འདི་ JSON འདྲ་ཕབ་ཚུ་ཨིན། ཁྱོད་ཀྱིས་རྩིས་ཐོ་དེ་ `payload` ནང་ལུ་ I105 ID སྦེ་བཞག་དགོ། མིང་མིང་འདི་ འ་ནི་ཐད་ཀར་གྱི་ས་ཁོངས་ནང་ ཆ་མེད་གཏང་མི་ཨིན།

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

འགན་འཁུར་དང་དེའི་གྲོགས་རམ་གྱི་དུས་ཚོད་མི་རྫོགས། འཛུལ་སྤྱོད་འདི་ད་ལས་ཕར་དགོཔ་མེད་པའི་སྐབས་ དེ་ཚུ་གསལ་ཏོག་ཏོ་སྦེ་ ཆ་མེད་གཏང་།

### 4. དབང་ཚད་ལག་ལེན་འཐབ་ནི་ {#_4-exercise-the-delegated-permission}

འབྲི་ནིའི་དོན་ལུ་ སྐུ་ཚབ་ཀྱི་མིང་རྟགས་བཀོད་མི་དང་ འཐུས་ལྷག་ལུས་ལག་ལེན་འཐབ། JSON གནས་གོང་ཚུ་ཚད་ལྡན་ཨིན་པུཊི་ལས་ལྷགཔ་ཨིན།

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

འ་ནི་དཔེ་འདི་ Rust ཌའི་ལོག་ལུ་ལག་ལེན་འབད་ཚུགསཔ་ཨིན། འདི་ནང་ལུ་ `client` གིས་ `registrar_account` བཟོ་བཀོད་འབདཝ་ཨིན་ འདི་གིས་འགན་ཁུར་གྱི་ འགོ་ཐོག་གི་ཇོ་བདག་སྦེ་འགྱུར་དོ་ཡོདཔ་ད་ འདི་ཡང་ CLI ལྡོག་ཕྱོགས་ནང་འབདཝ་ཨིན། རྩིས་ཐོ་ཀྱི་འགྱུར་ལྡེ་གསུམ་ཆ་རང་ལུ་ ཧེ་མ་ལས་ `AccountId` གི་གོང་ཚད་ཚུ་ བརྟག་ཞིབ་འབད་ཡོདཔ་ཨིན།

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

ལས་འགན་གྱི་ཕྱོགས་གཉིས་ཆ་ར་ཐོ་བཀོད་འབད་ཞིནམ་ལས་ སྐུ་ཚབ་ཀྱིས་བྲིས་ཡོད་པའི་གནས་གོང་ངེས་བདེན་འདི་ལྷག:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

གནང་བ་ཐོ་ཡིག་ནང་ `CanModifyAccountMetadata` `TARGET_ACCOUNT` ལུ་ཁྱབ་ཚད་ཡོདཔ་ཨིན་ སྐུ་ཚབ་ཀྱི་འགན་ཁུར་ཐོ་ཡིག་ནང་ `ROLE_ID` འོང་དགོཔ་དང་ མེ་ཊ་ཌེ་ཊ་ལྷག་མི་འདི་གིས་ `"delegated"` ལོག་འོང་དགོ།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `Not permitted` གིས་ ཐོ་བཀོད་འབད་ནི་དང་ བསྒྱུར་བཅོས་འབད་ནི་ ཡང་ན་ འགན་འཁྲི་བགོ་བཀྲམ་འབད་པའི་སྐབས་ ངོ་རྟགས་རྐྱབ་མི་དེ་གིས་ དགོས་མཁོ་ཅན་གྱི་ Taira དབང་ཚད་མེད་ཟེར་ཨིན་མས། དམིགས་གཏད་ཅན་གི་རྟགས་མཚན་འདི་ འཛམ་གླིང་ཡོངས་ཀྱི་རྟགས་མཚན་ཅིག་གིས་མ་བརྗེ་སོར་འབད། དེ་གི་དོན་ལུ་ ཚད་ལྡན་ལག་ལེན་གྱི་དོན་ལུ་ ཞུ་བ་རྐྱབས། ཡང་ན་ ས་གནས་བརྟག་དཔྱད་དྲ་རྒྱ ལག་ལེན་འཐབ་དགོ།
- སྤྱིར་བཏང་ལུ་ `account` འདི་ `payload` གི་སྦོ་ལོགས་ཁར་བཙུགས་ཡོདཔ་ཨིན་ ཡང་ན་ I105 ID གི་ཚབ་ལུ་ མིང་གཞན་ཅིག་བཀྲམ་སྤེལ་འབད་ཡོདཔ་ཨིན་ ཡང་ན་ JSON གནས་གོང་འདི་ ཚར་གཉིས་ལུང་འདྲེན་འབད་ཡོདཔ་ཨིན།
- འཐུས་བཀག་ཆ་འདི་ གོ་རིམ་དེ་ཕུལ་མི་ མཚན་རྟགས་བཀོད་མི་ལུ་ཨིན། འཛིན་སྐྱོང་པ་ལུ་མ་དངུལ་བཏང་ཞིནམ་ལས་ རང་དབང་ཅན་སྦེ་ འགན་ཁུར་འབག་སྟེ་ བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་ལས་ཐོན་པའི་འཐུས་རྒྱུ་དངོས་མེ་ཊ་ཌེ་ཊ་འདི་ བཞག་དགོ།
- མཐར་འཁྱོལ་ཅན་གྱི་འགན་ཁུར་གནང་བ་འདི་གིས་ དེ་གི་ཊོ་ཀེན་ཚུ་ནང་ ཨིན་ཀོ་ཌི་འབད་ཡོད་པའི་ཁྱབ་ཚད་འདི་ བཀག་ཆ་འབད་མི་བཏུབ། འགན་ཁུར་འདི་གིས་ གནང་བ་ནང་དོན་གནད་སྡུད་ནང་མིང་བཏགས་ཡོད་པའི་རྩིས་ཐོ་རྐྱངམ་ཅིག་ལེགས་བཅོས་འབད་ཚུགས།
- གཙང་མ་བཟོ་ནི་ལུ་ `ledger account role revoke` དེ་ལས་ `ledger role permission revoke` དང་ མཐའ་མཇུག་ལུ་ `ledger role unregister` གཡོག་བཀོལ་དགོ། རེ་རེ་བཞིན་དུ་ འབྲི་ནི་སོ་སོ་ཅིག་ཨིནམ་དང་ `--fee-payer authority` དང་ འཐུས་མེ་ཊ་ཌེ་ཊ་ཚུ་ ཚུད་དགོ།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [འགན་འཁྲི་མཐུན་འབྲེལ་བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs) ལུ་འབདཝ་ཨིན།
- [ངོས་ལེན་མཐུན་འབྲེལ་བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs) ལུ་འབདཝ་ཨིན།
- [བཙུགས་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs) ལུ་ ནང་འཁོད་ལུ་ ངོས་ལེན་ཡིག་གཟུགས་བཟོ་ཡོདཔ་ཨིན།
- [འཁྲུན་ཆོད་དང་ འགན་ཁུར་ཚུ་](/dz/blockchain/permissions.md)
- [ངོས་ལེན་གྱི་བརྡ་དོན་ཁ་བྱང་](/dz/reference/permissions.md)
- [ཟུར་གནས་གནད་སྡུད](./metadata.md)
