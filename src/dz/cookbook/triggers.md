---
translation_locale: dz
translation_source: /cookbook/triggers.md
translation_source_hash: 946309958fe4e23a7454206b1eb4557f8e853171ce4e04d5373cb36f46b13970
translation_status: machine-validated
translation_engine: human-reviewed+claude-opus-5-5
---
# ཐིག་ཁྲམ་ཚུ་ {#triggers}

## གྲུབ་འབྲས་ {#outcome}

Taira ལུ་ མཐའ་མཇུག་གི་ བརྒྱུད་འཕྲིན་ཨེབ་གཏང་འབད། འདི་ཚར་གཅིག་ལག་ལེན་བསྟར་སྤྱོད་འབད་ དེ་ལས་ ལག་ལེན་འཐབ་ཡོདཔ མཐའ་བཅད གི་དོན་ལུ་སྒུག་སྟེ་སྡོད་ དེ་ལས་ གཏན་འཁེལ་འབད་ཡོད སྡེབ་ཚན ལོ་རྒྱུས ལས་ གྲུབ་འབྲས་ཐོན་པའི་གྲུབ་འབྲས་ཚུ་ངོས་འཛིན་འབད་འོང་།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- [Taira ལུ་མཐུད་སྦྲེལ་འབད་](./connect-to-taira.md) ལས་ མ་དངུལ་བཙུགས་ཡོད་པའི་ མིང་རྟགས་འགོད་མི་ཅིག་དང་ `taira.client.toml` དེ་ལས་ `TAIRA_ACCOUNT_ID`། འབྲི་ནིའི་ཚོང་འབྲེལ་ཚུ་གིས་ `--fee-payer authority` ལག་ལེན་འཐབ་ཨིན། CLI གིས་ མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་ Taira གི་འཐུས་རྒྱུ་དངོས་ནང་ འཐུས་ངེས་བདེན་གྱི་ གོང་ཚད་བཀོདཔ་ཨིན།
- Taira གིས་ `TAIRA_ACCOUNT_ID` གི་དོན་ལུ་ ཐོ་བཀོད་འབད་ནི་དང་ འདི་ནང་ལས་ཐོན་མི་ ཐོ་བཀོད་ཀྱི་ལག་ལེན་དེ་ ལག་ལེན་འཐབ་ནི་གི་དོན་ལུ་ ངོས་ལེན་འབད་ཡོདཔ་ཨིན། འབྲེལ་ཡོད་རྟགས་མཚན་ཚུ་འདི་ `CanRegisterTrigger` གིས་ `authority` དང་ `CanExecuteTrigger` གིས་ `trigger` ལུ་ བསྡུ་སྒྲིག་འབདཝ་ཨིན།
- གྲོགས་རམ་ཚུ་མ་ཐོབ་པ་ཅིན་ ས་གནས་ཀྱི་ཁ་ཐུག་ལུ་ གཞི་བཙུགས་འབད་ཡོད་པའི་དྲ་ལམ་དང་ འདི་གི་འཛིན་སྐྱོང་པ་མཁོ་ཆས་ཚུ་ ལག་ལེན་འཐབ་དགོ། རྐྱེན་སློང་གི་དབང་འཛིན་ལུ་ རྐྱེན་སློང་གིས་ལག་བསྟར་འབད་མི་བཀོད་རྒྱ་ཚུ་ལ་དགོ་པའི་གནང་བ་ཆ་མཉམ་དགོ།

```bash
CONFIG=./taira.client.toml
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## རིམ་པ་ཚུ་ {#steps}

### 1.བརྡ་སྟོན་ཐོག་ལས་ རྒྱབ་སྐྱོར་འབད་ཡོད་པའི་ གློག་ཐག་ཅིག་བཙུགས་ནི། {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` གིས་ `--emit-instructions` གིས་ གསལ་སྟོན་འབད་མི་ JSON བཀོད་རྒྱའི་ཐོ་ཡིག་འདི་ ངོས་ལེན་འབདཝ་ཨིན། `tx ping` གིས་ `Log` བཀོད་རྒྱ་གཅིག་ བཏོནམ་ཨིན། དེ་གིས་ དཔེ་འདི་ རྩིས་དེབ་དངོས་པོ་གཉིས་པ་ཅིག་གི་ ཆོག་ཐམ་ཚུ་ལུ་ མེན་པར་ རྐྱེན་སློང་གི་ དབང་སྤྲོད་ལུ་ དམིགས་གཏད་བཞགཔ་ཨིན།

```bash
iroha --config "$CONFIG" --emit-instructions \
  tx ping --log-level INFO --msg 'cookbook trigger executed' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

ཊི་གར་འདི་ མང་ཤོས་རང་ ཚར་གསུམ་གཡོག་བཀོལ་ཚུགས། དེ་གི་གསལ་བསྒྲགས་འབད་ཡོད་པའི་དབང་ཚད་འདི་ ལག་ལེན་འཐབ་ནི་ལུ་འབྱུང་མི་ འབོད་བརྡ་འབད་མི་གིས་མེན་པར་ བྱ་བའི་ནང་འཁོད་ལུ་བཀོད་རྒྱ་ཚུ་ལུ་ དབང་ཚད་བྱིནམ་ཨིན།

### འཛིན་སྐྱོང་འཐབ་པའི་ཧེ་མར་ ཐོ་བཀོད་འབད་དགོཔ་ཨིན། {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

འཐུས་གཞན་ཅིག་ ཟད་འགྲོ་མ་གཏང་པའི་ཧེ་མ་ I105 དབང་འཛིན་དང་ ལག་བསྟར་ཚགས་མ་ ལྷག་ལུས་བསྐྱར་ཟློས་ཚུ་ དེ་ལས་ `executable` ནང་གི་ ཨིན་ཀོཌ་འབད་ཡོད་པའི་ བཀོད་རྒྱ་རྐྱང་པ་འདི་ ངེས་གཏན་བཟོ།

### 3. བང་རིམ་གཉིས་ཆ་ར་ལག་བསྟར་འབད་དེ་སྒུག་སྡོད། {#_3-execute-and-wait-for-both-layers}

ལག་ལེན་འཐབ་ནིའི་ཚོང་འབྲེལ་དང་ འབྱུང་ཁུངས་བྱ་བ་ལུ་ སྒྲུབ་བྱེད་སོ་སོ་ཡོདཔ་ཨིན། `--wait` འཇུག་སྤྱོད་འབད་ཡོད་པའི་ཚོང་འབྲེལ་མཐའ་དཔྱད་ལུ་སྒུག་སྡོདཔ་ཨིན། `--trace` གིས་ཡང་ ལག་བསྟར་མཉེན་ཆས་མཇུག་བསྡུ་བརྟག་དཔྱད་ཚུ་སྙན་ཞུ་འབདཝ་ཨིན།

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust ཞབས་ཏོག་ལེན་མི་ཚུ་གིས་ དབྱེ་བ་བཀོད་ཡོད་པའི་ བཀོད་རྒྱ་གཅིག་པ་ གཉིས་དེ་ བཟོཝ་ཨིན། ནཱ་ལུ་ `authority` འདི་ `AccountId` ཅིག་ཨིན། `client` འདི་ རྩིས་ཐོ་དེ་སྦེ་ མིང་རྟགས་བཀོད་མི་ `iroha::blocking::Client` ཅིག་ཨིན། `submit` གིས་ Applied མཐར་ཐུག་གནས་སྟངས་ལུ་ ལྷོདཔ་ཚུན་ སྒུགཔ་ཨིན་:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned())],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
)?;
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit(ExecuteTrigger::new(trigger_id), fee)?;
```

## བརྟག་དཔྱད་འབད་ {#verify}

མཇུག་བསྡུ་ནིའི་དོན་ལུ་ ཁས་བླངས་འབད་ཡོད་པའི་སྡེབ་ཚན་གྱི་བྱུང་རབས་འདི་ པར་ལོག་བཏབ་སྟེ་ མར་ཕབ་འབད་ཡོད་པའི་བསྐྱར་ལོག་གྱངས་ཁ་འདི་ བརྟག་ཞིབ་འབད།

```bash
iroha --config "$CONFIG" trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

ཉུང་མཐར་ཡང་མཇུག་བསྡུ་གཅིག་གིས་མཐར་འཁྱོལ་གྱི་སྙན་ཞུ་འབད་དགོ། ལག་ལེན་འཐབ་ཐངས་གཉིས་ལྷག་སྟེ་ཡོད་མི་དང་གཅིག་ཁར་ ཊི་གཱར་འདི་ཤུགས་ལྡན་སྦེ་སྡོད་དགོ། མཐར་འཁྱོལ་ཅན་གྱི་ ཊི་གཱར་མཇུག་བསྡུ་མེད་པར་ མཐར་འཁྱོལ་ཅན་གྱི་ཕུལ་མི་འདི་ བདེན་དཔྱད་ལངམ་སྦེ་མེན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- ཐོ་བཀོད་འདི་ གནང་བ་མེདཔ་སྦེ་ ངོས་ལེན་མ་འབད་མི་འདི་གིས་ མིང་རྟགས་བཀོད་མི་ལུ་ གསལ་བསྒྲགས་འབད་ཡོད་པའི་དབང་ཚད་ཀྱི་དོན་ལུ་ `CanRegisterTrigger` མེདཔ་ཨིན། ལག་ལེན་འཐབ་ནི་ལུ་ སོ་སོ་སྦེ་ཁྱབ་ཚད་ཡོད་པའི་ `CanExecuteTrigger` བརྡ་མཚོན་དགོཔ་ཨིན།
- ཚོང་འབྲེལ་ཅིག་གིས་ འཇུག་སྤྱོད་འབད་མི་ལུ་ལྷོད་ཚུགས། མཇུག་བསྡུ་གྲུབ་འབྲས་དང་འཛོལ་བ་ལྷག་དགོ། དེ་ལས་ བཙུགས་ཡོད་པའི་བཀོད་རྒྱ་རེ་རེ་གི་དོན་ལུ་ ཊི་གཱར་གནང་བ་གཙོ་འཛིན་གྱི་གནང་བ་ཚུ་ཞིབ་དཔྱད་འབད།
- `Trigger with id … not found` གིས་ ཐོ་བཀོད་གྱི་ཞལ་འདེབས་འདི་ ཆ་མེད་བཏང་ཡོདཔ་ཨིན་ན་ ཡང་ན་ Torii /སྡེབ་ཐག གི་སྒྲིག་གཞི་གཞན་ཅིག་ལག་ལེན་འཐབ་ཡོདཔ་ཨིན་ན་ཟེར་ སྟོན་ཚུགས།
- བསྐྱར་ལོག་ཚུ་ཀླད་ཀོར་ལུ་ལྷོད་པའི་སྐབས་ བསྐྱར་ལོག་མངམ་སྤྲོད་ནི་འདི་ ཐོབ་དབང་ཅན་གྱི་འབྲི་ཐངས་གཞན་ཅིག་ཨིན། བཟོ་ཐབས་འདི་ ངེས་མེད་ཀྱི་ འབྱུང་ཁུངས་ལུ་ ཁུ་སིམ་སིམ་སྦེ་ བསྒྱུར་བཅོས་མ་འབད།
- གཙང་སྦྲ་བཟོ་ནིའི་དོན་ལུ་ `trigger unregister --id "$TRIGGER_ID"` ལུ་ ཊི་གར་དེ་དང་ གསལ་ཏོག་ཏོ་འཐུས་སེལ་འཐུ་གི་དོན་ལུ་ `CanUnregisterTrigger` དགོཔ་ཨིན།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [By-ལས་རིམ་འབོད སྐུལ་རྟེན འབྲེལ་མཐུད་བརྟག་དཔྱད་ཚུ་ པིན་ཌ་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/triggers/by_call_trigger.rs) ལུ་འབདཝ་ཨིན།
- [འབྱུང་རྐྱེན་དང་ ཐིག་ཁྲམ་མཐུན་རྐྱེན་གྱི་བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events_and_triggers.rs) ལུ་འབདཝ་ཨིན།
- [ཐིག་ཁྲམ་གཏན་སྦྱར་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs) ལུ་ སྐུལ་རྟེན བཀོད་རྒྱ ལག་བསྟར
- [ཐིག་ཁྲམ་ཚུ་](/dz/blockchain/triggers.md)
- [གློག་ཤུགས་སྣེ་སྟོན་གྱི་དཔེ་སྒྲིག](/dz/blockchain/trigger-examples.md)
- [གནད་དོན་ཚུ་](./stream-events.md)
