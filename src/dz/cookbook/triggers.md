---
translation_locale: dz
translation_source: /cookbook/triggers.md
translation_source_hash: 6c8f436b5a41cf41c0ac37aeed6b6cd8c73009cfcca2fe7f5642cef1ad115e6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ཐིག་ཁྲམ་ཚུ་ {#triggers}

## གྲུབ་འབྲས་ {#outcome}

Taira ལུ་ མཐའ་མཇུག་གི་ བརྒྱུད་འཕྲིན་ཨེབ་གཏང་འབད། འདི་ཚར་གཅིག་ལག་ལེན་བསྟར་སྤྱོད་འབད་ དེ་ལས་ Applied finality གི་དོན་ལུ་སྒུག་སྟེ་སྡོད་ དེ་ལས་ commited block history ལས་ གྲུབ་འབྲས་ཐོན་པའི་གྲུབ་འབྲས་ཚུ་ངོས་འཛིན་འབད་འོང་།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- དངུལ་རྐྱང་གི་རྒྱབ་སྐྱོར་བྱིན་མི་ `taira.client.toml`, `taira.tx-metadata.json`,དང་ `TAIRA_ACCOUNT_ID` ལས་ [ འབྲེལ་མཐུད་འབད་ནིའི་དོན་ལས་Taira ](./connect-to-taira.md).
- Taira གིས་ `TAIRA_ACCOUNT_ID` གི་དོན་ལུ་ ཐོ་བཀོད་འབད་ནི་དང་ འདི་ནང་ལས་ཐོན་མི་ ཐོ་བཀོད་ཀྱི་ལག་ལེན་དེ་ ལག་ལེན་འཐབ་ནི་གི་དོན་ལུ་ ངོས་ལེན་འབད་ཡོདཔ་ཨིན། འབྲེལ་ཡོད་རྟགས་མཚན་ཚུ་འདི་ `CanRegisterTrigger` གིས་ `authority` དང་ `CanExecuteTrigger` གིས་ `trigger` ལུ་ བསྡུ་སྒྲིག་འབདཝ་ཨིན།
- གྲོགས་རམ་ཚུ་མ་ཐོབ་པ་ཅིན་ ས་གནས་ཀྱི་ཁ་ཐུག་ལུ་ གཞི་བཙུགས་འབད་ཡོད་པའི་དྲ་ལམ་དང་ འདི་གི་འཛིན་སྐྱོང་པ་མཁོ་ཆས་ཚུ་ ལག་ལེན་འཐབ་དགོ། གློ་བུར་སེལ་ནིའི་དབང་འཛིན་གྱིས་ གློ་བུར་བཏོན་མི་བཀོད་རྒྱ་ཚུ་གིས་ དགོས་པའི་ཆོག་ཐམ་ཆ་མཉམ་ཡང་ དགོཔ་ཨིན།

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

ཐིག་ཁྲམ་འདི་ ཚར་གསུམ་ལས་ལྷག་སྟེ་ བརྩོན་ཤུགས་བསྐྱེད་ཚུགསཔ་ཨིན། འདི་གི་བཀོད་ཁྱབ་དབང་འཛིན་གྱིས་ ཨེཕ་ལེན་འབད་མི་དེ་མེན་པར་ ནང་འཁོད་ལུ་ཡོད་པའི་བཀོད་རྒྱ་ཚུ་ལུ་ ངོས་ལེན་འབདཝ་ཨིན།

### འཛིན་སྐྱོང་འཐབ་པའི་ཧེ་མར་ ཐོ་བཀོད་འབད་དགོཔ་ཨིན། {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

I105 གི་དབང་འཛིན་,ལག་ལེན་གྱི་ཐིག་ཁྲམ་, ལྷག་ལུས་བསྐྱར་བཤད་པ་དང་ `Log`གི་བསླབ་བྱ་ཚུ་ གསལ་བཀོད་འབད་ཞིནམ་ལས་ ད་རུང་གླ་ཆ་མ་སྤྲོད་པར་བཞག་དགོ།

### 3. ཌོག་ཊར་གཉིས་ཆ་རའི་དོན་ལུ་ བཏོན་ཏེ་སྒུག་སྡོད་ {#_3-execute-and-wait-for-both-layers}

ལག་བསྟར་སྤྱོད་ཀྱི་ཅ་ལ་དང་ འགོ་བཙུགས་པའི་ལག་ལེན་འདི་ དབྱེ་ཁག་ཅན་གྱི་རྟགས་མཚན་ཅིག་ཨིན། `--wait` གིས་ ལག་ལེན་འཐབ་མི་ཅ་ལ་མཇུག་བསྡུ་བའི་དོན་ལུ་སྒུག་སྡོད་དོ་ཡོདཔ་ཨིན། `--trace` འདི་ཡང་ runtime མཇུག་བསྡུ་བའི་བརྟག་དཔྱད་ཚུ་ སྙན་ཞུ་འབདཝ་ཨིན།

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

Rust གྱི་མགྲོན་པ་ཚུ་གིས་ ཨེབ་གཏང་གི་བཀོད་རྒྱ་གཉིས་འདི་བཟོ་དོ་ཡོདཔ་ཨིན། འདི་ནང་ལུ་ `authority` གིས་ `AccountId` དང་ `client` རྟགས་མཚན་ཚུ་རྩིས་ཁྲ་དེ་བཟུམ་སྦེ་:

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

བརྟག་ཞིབ་འབད་ཚར་བའི་དོན་ལུ་ commit blocks history འདི་ scan དང་ decremented repeat count ཨེབ་གཏང་:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

མཇུག་བསྡུ་རིམ་ཅིག་ལས་ཉུང་ཤོས་ཅིག་གིས་ གྲུབ་འབྲས་ཐོན་པའི་ སྙན་ཞུ་འབད་དགོཔ་ཨིན། ཐིག་ཁྲམ་འདི་ ལག་ལེན་འཐབ་མ་ཚུགསཔ་སྦེ་ བཞག་དགོཔ་ཨིན། ཐོ་རྐྱེན་མཇུག་བསྡུ་བའི་ཤུལ་ལུ་ གྲུབ་འབྲས་ལེགས་ཤོམ་མེད་པ་ཅིན་ བརྟག་ཞིབ་ལངམ་མེན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- ཐོ་བཀོད་དེ་ ཆ་མེད་བཏང་ཡོདཔ་ལས་ ངོས་འཛིན་འབད་མི་ལུ་ `CanRegisterTrigger` ཚད་མེད་ཟེར་ཨིན་མས། ལག་ལེན་འབད་ནིའི་དོན་ལུ་ དམིགས་གཏད་སོ་སོ་སྦེ་བཀོད་ཡོད་པའི་ `CanExecuteTrigger` token དགོཔ་ཨིན།
- ཚོང་འབྲེལ་འདི་ Applied ལུ་ ལྷོད་ཚུགས་པའི་སྐབས་ trigger action གིས་མ་གྲུབ་པར་ སྙན་ཞུ་འབད་ཚུགས། མཇུག་བསྡུ་བའི་ གྲུབ་འབྲས་དང་འཛོལ་བ་ཚུ་ ཀློག་ཞིནམ་ལས་ ཨེབ་ལྡེཌ་འབད་མི་ བཀའ་རྒྱ་རེ་རེའི་དོན་ལུ་ trigger authority གི་ཆོག་ཐམ་ཚུ་ བརྟག་དཔྱད་རྐྱེན།
- `trigger not found` གིས་ ཐོ་བཀོད་གྱི་ཞལ་འདེབས་འདི་ ཆ་མེད་བཏང་ཡོདཔ་ཨིན་ན་ ཡང་ན་ Torii /chain གི་སྒྲིག་གཞི་གཞན་ཅིག་ལག་ལེན་འཐབ་ཡོདཔ་ཨིན་ན་ཟེར་ སྟོན་ཚུགས།
- བསྐྱར་ཞིབ་འདི་ ༠ ལུ་ལྷོད་པའི་བསྒང་ལས་ བསྐྱར་ཞིབ་མང་རབས་ཅིག་བཟོ་ནི་དེ་ ཡང་ཅིན་ ཁྱད་ལྡན་ཡིག་འབྲུ་གཞན་ཞིག་ཨིན། ཁྱོད་ཀྱིས་ གསང་བའི་ཚིག་འབྲུ་འདི་ དུས་ཡུན་ཐུང་ཀུ་ཅིག་གི་དོན་ལུ་ བསྒྱུར་བཅོས་མ་འབད།
- གཙང་སྦྲ་བཟོ་བའི་དོན་ལུ་ `ledger trigger unregister --id "$TRIGGER_ID"` གིས་ འདི་གི་དོན་ལུ་ `CanUnregisterTrigger` དགོས་མཁོ་སྤྲོད་འབད་དོ་ཡོདཔ་དང་ གོང་གསལ་གྱི་འཐུས་གདམ་ཁ་འབདཝ་ཨིན།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [By-call trigger འབྲེལ་མཐུད་བརྟག་དཔྱད་ཚུ་ པིན་ཌ་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs) ལུ་འབདཝ་ཨིན།
- [འབྱུང་རྐྱེན་དང་ ཐིག་ཁྲམ་མཐུན་རྐྱེན་གྱི་བརྟག་དཔྱད་ཚུ་ ཕིན་ཌ་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs) ལུ་འབདཝ་ཨིན།
- [ཐིག་ཁྲམ་ཨེབ་གཏང་འབད་ཡོད་པའི་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs) ལུ་ Trigger instruction execution
- [ཐིག་ཁྲམ་ཚུ་](/dz/blockchain/triggers.md)
- [གློག་ཤུགས་སྣེ་སྟོན་གྱི་དཔེ་སྒྲིག](/dz/blockchain/trigger-examples.md)
- [གནད་དོན་ཚུ་](./stream-events.md)
