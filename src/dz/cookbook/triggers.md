---
translation_locale: dz
translation_source: /cookbook/triggers.md
translation_source_hash: 5267fb9bb232d52d9df4bedee414d745ccc30dd52cbc30993df3c5b975a0bc38
translation_status: machine-validated
translation_engine: human-reviewed
---
# ཐིག་ཁྲམ་ཚུ་ {#triggers}

## གྲུབ་འབྲས་ {#outcome}

Taira ལུ་ མཐའ་མཇུག་གི་ བརྒྱུད་འཕྲིན་ཨེབ་གཏང་འབད། འདི་ཚར་གཅིག་ལག་ལེན་བསྟར་སྤྱོད་འབད་ དེ་ལས་ ལག་ལེན་འཐབ་ཡོདཔ མཐའ་བཅད གི་དོན་ལུ་སྒུག་སྟེ་སྡོད་ དེ་ལས་ གཏན་འཁེལ་འབད་ཡོད སྡེབ་ཚན ལོ་རྒྱུས ལས་ གྲུབ་འབྲས་ཐོན་པའི་གྲུབ་འབྲས་ཚུ་ངོས་འཛིན་འབད་འོང་།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- དངུལ་རྐྱང་གི་རྒྱབ་སྐྱོར་བྱིན་མི་ `taira.client.toml`, `taira.tx-metadata.json`,དང་ `TAIRA_ACCOUNT_ID` ལས་ [ འབྲེལ་མཐུད་འབད་ནིའི་དོན་ལས་Taira ](./connect-to-taira.md).
- Taira གིས་ `TAIRA_ACCOUNT_ID` གི་དོན་ལུ་ ཐོ་བཀོད་འབད་ནི་དང་ འདི་ནང་ལས་ཐོན་མི་ ཐོ་བཀོད་ཀྱི་ལག་ལེན་དེ་ ལག་ལེན་འཐབ་ནི་གི་དོན་ལུ་ ངོས་ལེན་འབད་ཡོདཔ་ཨིན། འབྲེལ་ཡོད་རྟགས་མཚན་ཚུ་འདི་ `CanRegisterTrigger` གིས་ `authority` དང་ `CanExecuteTrigger` གིས་ `trigger` ལུ་ བསྡུ་སྒྲིག་འབདཝ་ཨིན།
- གྲོགས་རམ་ཚུ་མ་ཐོབ་པ་ཅིན་ ས་གནས་ཀྱི་ཁ་ཐུག་ལུ་ གཞི་བཙུགས་འབད་ཡོད་པའི་དྲ་ལམ་དང་ འདི་གི་འཛིན་སྐྱོང་པ་མཁོ་ཆས་ཚུ་ ལག་ལེན་འཐབ་དགོ། རྐྱེན་སློང་གི་དབང་འཛིན་ལུ་ རྐྱེན་སློང་གིས་ལག་བསྟར་འབད་མི་བཀོད་རྒྱ་ཚུ་ལ་དགོ་པའི་གནང་བ་ཆ་མཉམ་དགོ།

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## རིམ་པ་ཚུ་ {#steps}

### 1.བརྡ་སྟོན་ཐོག་ལས་ རྒྱབ་སྐྱོར་འབད་ཡོད་པའི་ གློག་ཐག་ཅིག་བཙུགས་ནི། {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` གིས་ JSON གི་བསླབ་བྱ་གཞི་སྒྲིག་ཅིག་ལུ་ ངོས་ལེན་འབད་ཡོདཔ་ཨིན། `Log` གི་བསླབ་བྱ་འདི་གིས་ དཔེ་འདི་ ཐིག་ཁྲམ་གཉིས་པའི་ཨེབ་ཐོར་གྱི་དངོས་ཆས་ཀྱི་ཆོག་ཐམ་ལས་ འགོ་བཙུགས་ནིའི་དབང་ཆ་ལུ་དམིགས་ཏེ་བཞག་ཡོདཔ་ཨིན།

```bash
printf '%s\n' \
  '[{"Log":{"level":"INFO","message":"cookbook trigger executed"}}]' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

ཊི་གར་འདི་ མང་ཤོས་རང་ ཚར་གསུམ་གཡོག་བཀོལ་ཚུགས། དེ་གི་གསལ་བསྒྲགས་འབད་ཡོད་པའི་དབང་ཚད་འདི་ ལག་ལེན་འཐབ་ནི་ལུ་འབྱུང་མི་ འབོད་བརྡ་འབད་མི་གིས་མེན་པར་ བྱ་བའི་ནང་འཁོད་ལུ་བཀོད་རྒྱ་ཚུ་ལུ་ དབང་ཚད་བྱིནམ་ཨིན།

### འཛིན་སྐྱོང་འཐབ་པའི་ཧེ་མར་ ཐོ་བཀོད་འབད་དགོཔ་ཨིན། {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

འཐུས་གཞན་ཅིག་མ་བཏང་པའི་ཧེ་མ་ I105 དབང་ཚད་དང་ ལག་ལེན་འཐབ་ནིའི་ཚགས་མ་ ལྷག་ལུས་བསྐྱར་ལོག་ཚུ་ དེ་ལས་ `Log` བཀོད་རྒྱ་རྐྱང་པ་ཚུ་ ངེས་གཏན་བཟོ།

### 3. བང་རིམ་གཉིས་ཆ་ར་ལག་བསྟར་འབད་དེ་སྒུག་སྡོད། {#_3-execute-and-wait-for-both-layers}

ལག་ལེན་འཐབ་ནིའི་ཚོང་འབྲེལ་དང་ འབྱུང་ཁུངས་བྱ་བ་ལུ་ སྒྲུབ་བྱེད་སོ་སོ་ཡོདཔ་ཨིན། `--wait` འཇུག་སྤྱོད་འབད་ཡོད་པའི་ཚོང་འབྲེལ་མཐའ་དཔྱད་ལུ་སྒུག་སྡོདཔ་ཨིན། `--trace` གིས་ཡང་ ལག་བསྟར་མཉེན་ཆས་མཇུག་བསྡུ་བརྟག་དཔྱད་ཚུ་སྙན་ཞུ་འབདཝ་ཨིན།

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust གྱི་མགྲོན་པ་ཚུ་གིས་ ཨེབ་གཏང་གི་བཀོད་རྒྱ་གཉིས་འདི་བཟོ་དོ་ཡོདཔ་ཨིན། འདི་ནང་ལུ་ `authority` གིས་ `AccountId` དང་ `client` རྟགས་མཚན་ཚུ་རྩིས་ཐོ་དེ་བཟུམ་སྦེ་:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned()).into()],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
);
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit_blocking(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit_blocking(ExecuteTrigger::new(trigger_id), fee)?;
```

## བརྟག་དཔྱད་འབད་ {#verify}

མཇུག་བསྡུ་ནིའི་དོན་ལུ་ ཁས་བླངས་འབད་ཡོད་པའི་སྡེབ་ཚན་གྱི་བྱུང་རབས་འདི་ པར་ལོག་བཏབ་སྟེ་ མར་ཕབ་འབད་ཡོད་པའི་བསྐྱར་ལོག་གྱངས་ཁ་འདི་ བརྟག་ཞིབ་འབད།

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

ཉུང་མཐར་ཡང་མཇུག་བསྡུ་གཅིག་གིས་མཐར་འཁྱོལ་གྱི་སྙན་ཞུ་འབད་དགོ། ལག་ལེན་འཐབ་ཐངས་གཉིས་ལྷག་སྟེ་ཡོད་མི་དང་གཅིག་ཁར་ ཊི་གཱར་འདི་ཤུགས་ལྡན་སྦེ་སྡོད་དགོ། མཐར་འཁྱོལ་ཅན་གྱི་ ཊི་གཱར་མཇུག་བསྡུ་མེད་པར་ མཐར་འཁྱོལ་ཅན་གྱི་ཕུལ་མི་འདི་ བདེན་དཔྱད་ལངམ་སྦེ་མེན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- ཐོ་བཀོད་འདི་ གནང་བ་མེདཔ་སྦེ་ ངོས་ལེན་མ་འབད་མི་འདི་གིས་ མིང་རྟགས་བཀོད་མི་ལུ་ གསལ་བསྒྲགས་འབད་ཡོད་པའི་དབང་ཚད་ཀྱི་དོན་ལུ་ `CanRegisterTrigger` མེདཔ་ཨིན། ལག་ལེན་འཐབ་ནི་ལུ་ སོ་སོ་སྦེ་ཁྱབ་ཚད་ཡོད་པའི་ `CanExecuteTrigger` བརྡ་མཚོན་དགོཔ་ཨིན།
- ཚོང་འབྲེལ་ཅིག་གིས་ འཇུག་སྤྱོད་འབད་མི་ལུ་ལྷོད་ཚུགས། མཇུག་བསྡུ་གྲུབ་འབྲས་དང་འཛོལ་བ་ལྷག་དགོ། དེ་ལས་ བཙུགས་ཡོད་པའི་བཀོད་རྒྱ་རེ་རེ་གི་དོན་ལུ་ ཊི་གཱར་གནང་བ་གཙོ་འཛིན་གྱི་གནང་བ་ཚུ་ཞིབ་དཔྱད་འབད།
- `trigger not found` གིས་ ཐོ་བཀོད་གྱི་ཞལ་འདེབས་འདི་ ཆ་མེད་བཏང་ཡོདཔ་ཨིན་ན་ ཡང་ན་ Torii /སྡེབ་ཐག གི་སྒྲིག་གཞི་གཞན་ཅིག་ལག་ལེན་འཐབ་ཡོདཔ་ཨིན་ན་ཟེར་ སྟོན་ཚུགས།
- བསྐྱར་ལོག་ཚུ་ཀླད་ཀོར་ལུ་ལྷོད་པའི་སྐབས་ བསྐྱར་ལོག་མངམ་སྤྲོད་ནི་འདི་ ཐོབ་དབང་ཅན་གྱི་འབྲི་ཐངས་གཞན་ཅིག་ཨིན། བཟོ་ཐབས་འདི་ ངེས་མེད་ཀྱི་ འབྱུང་ཁུངས་ལུ་ ཁུ་སིམ་སིམ་སྦེ་ བསྒྱུར་བཅོས་མ་འབད།
- གཙང་སྦྲ་བཟོ་ནིའི་དོན་ལུ་ `ledger trigger unregister --id "$TRIGGER_ID"` ལུ་ ཊི་གར་དེ་དང་ གསལ་ཏོག་ཏོ་འཐུས་སེལ་འཐུ་གི་དོན་ལུ་ `CanUnregisterTrigger` དགོཔ་ཨིན།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [By-ལས་རིམ་འབོད སྐུལ་རྟེན འབྲེལ་མཐུད་བརྟག་དཔྱད་ཚུ་ པིན་ཌ་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs) ལུ་འབདཝ་ཨིན།
- [འབྱུང་རྐྱེན་དང་ ཐིག་ཁྲམ་མཐུན་རྐྱེན་གྱི་བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs) ལུ་འབདཝ་ཨིན།
- [ཐིག་ཁྲམ་གཏན་སྦྱར་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs) ལུ་ སྐུལ་རྟེན བཀོད་རྒྱ ལག་བསྟར
- [ཐིག་ཁྲམ་ཚུ་](/dz/blockchain/triggers.md)
- [གློག་ཤུགས་སྣེ་སྟོན་གྱི་དཔེ་སྒྲིག](/dz/blockchain/trigger-examples.md)
- [གནད་དོན་ཚུ་](./stream-events.md)
