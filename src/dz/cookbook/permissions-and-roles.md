---
translation_locale: dz
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: human-reviewed+claude-opus-5-5
---
# ངོས་ལེན་དང་ འགན་འཁྲི་ཚུ་ {#permissions-and-roles}

## གྲུབ་འབྲས་ {#outcome}

རྩིས་ཐོ་གཅིག་ལུ་རྩིས་ཐོ་གཅིག་གི་དོན་ལུ་ ཟུར་གནས་གནད་སྡུད གསར་གཏོད་འབད་ནིའི་ གོ་སྐབས་བྱིན་མི་ འགན་འཁྲི་བཟོ་ནི་དེ་ བརྗེ་སོར་འབད་མི་ཅིག་ལུ་བཅའ་མར་གཏོགསཔ་ད་ བརྗེ་སུར་ཅན་གྱི་ཡིག་འབྲུ་འདི་ བདེན་ཁུངས་བཀལ་ཞིནམ་ལས་ Rust འབྲི་ཐོ་བཀོད་འབད་ཡོད་པའི་ བརྡ་བཀོད་ཚུ་བཏོན་འོང་།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- [Taira ལུ་མཐུད་སྦྲེལ་འབད་](./connect-to-taira.md) ལས་ མ་དངུལ་བཙུགས་ཡོད་པའི་ Taira ཞབས་ཏོག་ལེན་མི་ཅིག།
- `TARGET_ACCOUNT` དང་ `DELEGATE_ACCOUNT` འདི་ ཚད་ལྡན I105 རྩིས་ཐོ IDs ལུ་གཞི་སྒྲིག་འབད།
- མིང་རྟགས་འགོད་མི་རྩིས་ཐོ་གིས་ `CanManageRoles` འཛིན་དགོཔ་དང་ ཁྱབ་ཚད་བཀོད་ཡོད་པའི་ཆོག་ཐམ་འདི་ གཞན་ལུ་ སྤྲོད་ཚུགས་དགོ། དེ་ཡང་ རྩིས་ཐོ་དེ་ `TARGET_ACCOUNT` རང་ ཨིན་དགོཔ་ ཡང་ན་ རྩིས་ཐོ་དེ་གི་དོན་ལུ་ `CanModifyAccountMetadata` ཧེ་མ་ལས་ར་ འཛིན་ཏེ་ ཡོད་དགོ། Taira གུ་ འདི་ ཆོག་ཐམ་གྱིས་ ཚད་བཀག་འབད་ཡོད་པའི་ འཛིན་སྐྱོང་གི་ བཀོལ་སྤྱོད་ཅིག་ཨིན། བཟོ་བཏོན་འབད་ཡོད་པའི་ ས་གནས་དྲ་རྒྱའི་ ཞབས་ཏོག་ལེན་མི་གིས་ `CanManageRoles` མི་འཛིན་པས་ ཐབས་རིམ་འདི་ལུ་ འགོ་ཐོག་སྡེབ་ཚན་གྱིས་ དེ་ གནང་མི་ དྲ་རྒྱ་ཅིག་ དགོཔ་ཨིན།

```bash
CONFIG=./taira.client.toml
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

གནས་སྟངས་བསྒྱུར་མི་ CLI བཀའ་རྒྱ་རེ་རེ་གིས་ འཐུས་སྤྲོད་མི་གི་མིང་ གསལ་ཏོག་ཏོ་སྦེ་ བཏགསཔ་ཨིན། CLI གིས་ མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་ Taira གི་འཐུས་རྒྱུ་དངོས་ནང་ འཐུས་ངེས་བདེན་གྱི་ གོང་ཚད་བཀོདཔ་ཨིན།

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. དམིགས་གཏད་རྩིས་ཐོ་ལུ་ ངོས་ལེན་ཚད་ལྡན་བཙུགས་ནི། {#_2-add-a-permission-scoped-to-the-target-account}

ངོས་ལེན་རྟགས་མཚན་འདི་ JSON འདྲ་ཕབ་ཚུ་ཨིན། ཁྱོད་ཀྱིས་རྩིས་ཐོ་དེ་ `payload` ནང་ལུ་ I105 ID སྦེ་བཞག་དགོ། མིང་མིང་འདི་ འ་ནི་ཐད་ཀར་གྱི་ས་ཁོངས་ནང་ ཆ་མེད་གཏང་མི་ཨིན།

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3.འགན་ཁུར་དེ་འཐུས་མི་ལུ་སྤྲོད་དགོ། {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
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
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

དཔེ་གཞི་གཅིག་པ་འདི་ Rust ཞབས་ཏོག་ལེན་མི་ཚུ་ལུ་ཡང་ ཐོབ་ཚུགས། ནཱ་ལུ་ `client` འདི་ `registrar_account` སྦེ་ མིང་རྟགས་བཀོད་མི་ `iroha::blocking::Client` ཅིག་ཨིན། `registrar_account` འདི་ CLI གི་བྱ་རིམ་ནང་བཟུམ་སྦེ་ འགན་ཁུར་གྱི་ འགོ་ཐོག་གི་ཇོ་བདག་ལུ་ འགྱུརཝ་ཨིན། རྩིས་ཐོ་འགྱུར་ཅན་ གསུམ་ཆ་ར་ ཧེ་མ་ལས་ར་ དབྱེ་དཔྱད་འབད་ཚར་བའི་ `AccountId` གནས་གོང་ཚུ་ཨིན་:

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

## བརྟག་དཔྱད་འབད་ {#verify}

འགན་ཁུར་གྱི་ཆོག་ཐམ་གནང་བ་ཚུ་ ཚུད་མི་ སྐུ་ཚབ་ཀྱི་ ནུས་ཅན་ཆོག་ཐམ་ཚུ་ ལྷག་ཞིནམ་ལས་ སྐུ་ཚབ་ཀྱིས་ བྲིས་མི་ གནས་གོང་ངེས་བདེན་དེ་ ལྷག་:

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

སྐུ་ཚབ་ཀྱི་ ནུས་ཅན་ཆོག་ཐམ་ཚུ་ནང་ `TARGET_ACCOUNT` ལུ་ ཁྱབ་ཚད་བཀོད་ཡོད་པའི་ `CanModifyAccountMetadata` ཚུད་དགོཔ་དང་ ཟུར་གནས་གནད་སྡུད་ ལྷག་མི་འདི་གིས་ `"delegated"` ལོག་བྱིན་དགོ། Torii གིས་ མིང་རྟགས་བཀོད་ཡོད་པའི་ དྲི་དཔྱད་ཚུ་བརྒྱུད་དེ་ འགན་ཁུར་གྱི་ཐོ་ཡིག་ ངོས་ལེན་མི་འབདཝ་ལས་ ནུས་ཅན་ཆོག་ཐམ་གྱི་ཐོ་ཡིག་འདི་ འགན་སྤྲོད་ཀྱི་ ཞིབ་དཔྱད་ཨིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- འགན་ཁུར་ ཐོ་བཀོད་ ཞུན་དག་ ཡང་ན་ འགན་སྤྲོད་འབད་བའི་སྐབས་ `Not permitted` བྱུང་པ་ཅིན་ མིང་རྟགས་འགོད་མི་ལུ་ དགོས་མཁོ་ཡོད་པའི་ Taira དབང་ཚད་ མེདཔ་སྦེ་ སྟོནམ་ཨིན། ཁྱབ་ཚད་བཀོད་ཡོད་པའི་ ཆོག་ཐམ་རྟགས་མཚན་འདི་ ཡོངས་ཁྱབ་ཅིག་གིས་ ཚབ་མ་བཙུགས། ཆོག་ཐམ་གནང་བ་ངེས་བདེན་འདི་ ཞུ།
- སྤྱིར་བཏང་ལུ་ `account` འདི་ `payload` གི་སྦོ་ལོགས་ཁར་བཙུགས་ཡོདཔ་ཨིན་ ཡང་ན་ I105 ID གི་ཚབ་ལུ་ མིང་གཞན་ཅིག་བཀྲམ་སྤེལ་འབད་ཡོདཔ་ཨིན་ ཡང་ན་ JSON གནས་གོང་འདི་ ཚར་གཉིས་ལུང་འདྲེན་འབད་ཡོདཔ་ཨིན།
- འཐུས་ཀྱི་བཀག་ཆ་འདི་ རིམ་པ་དེ་ ཕུལ་མི་ མིང་རྟགས་འགོད་མི་གི་ཨིན། འཛིན་སྐྱོང་པ་དང་ སྐུ་ཚབ་གཉིས་ལུ་ འཐུས་ཀྱི་གོང་ཚད་བཀོད་པ་རེ་རེ་ནང་ མིང་བཏགས་ཡོད་པའི་ འཐུས་རྒྱུ་དངོས་ནང་ སོ་སོར་ མ་དངུལ་བཙུགས།
- མཐར་འཁྱོལ་ཅན་གྱི་འགན་ཁུར་གནང་བ་འདི་གིས་ དེ་གི་ཊོ་ཀེན་ཚུ་ནང་ ཨིན་ཀོ་ཌི་འབད་ཡོད་པའི་ཁྱབ་ཚད་འདི་ བཀག་ཆ་འབད་མི་བཏུབ། འགན་ཁུར་འདི་གིས་ གནང་བ་ནང་དོན་གནད་སྡུད་ནང་མིང་བཏགས་ཡོད་པའི་རྩིས་ཐོ་རྐྱངམ་ཅིག་ལེགས་བཅོས་འབད་ཚུགས།
- གཙང་སྦྲ་བཟོ་ནི་ལུ་ `account role revoke` དང་ དེ་ལས་ `ledger role permission revoke` དེ་ལས་ མཐའ་མཇུག་ལུ་ `ledger role unregister` གཡོག་བཀོལ། དེ་ཚུ་རེ་རེ་ འབྲི་ནིའི་ཚོང་འབྲེལ་ སོ་སོ་ཨིནམ་ལས་ `--fee-payer authority` ཚུད་དགོ།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [འགན་འཁྲི་མཐུན་འབྲེལ་བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs) ལུ་འབདཝ་ཨིན།
- [ངོས་ལེན་མཐུན་འབྲེལ་བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs) ལུ་འབདཝ་ཨིན།
- [བཙུགས་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs) ལུ་ ནང་འཁོད་ལུ་ ངོས་ལེན་ཡིག་གཟུགས་བཟོ་ཡོདཔ་ཨིན།
- [འཁྲུན་ཆོད་དང་ འགན་ཁུར་ཚུ་](/dz/blockchain/permissions.md)
- [ངོས་ལེན་གྱི་བརྡ་དོན་ཁ་བྱང་](/dz/reference/permissions.md)
- [ཟུར་གནས་གནད་སྡུད](./metadata.md)
