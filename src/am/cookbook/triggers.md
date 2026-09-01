---
translation_locale: am
translation_source: /cookbook/triggers.md
translation_source_hash: 5267fb9bb232d52d9df4bedee414d745ccc30dd52cbc30993df3c5b975a0bc38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ቀስቅሴዎች {#triggers}

## ውጤት {#outcome}

በ Taira ላይ የተወሰነ የቴክኒክ ጥሪ ቀስቅሴ ያስመዝግቡ፣ አንድ ጊዜ ያስፈጽሙት፣ የተተገበረውን የመጨረሻነት ይጠብቁ እና ከተጠናቀቀው የብሎክ ታሪክ በተሳካ ሁኔታ መጠናቀቁን ያረጋግጡ።

## ቅድመ ሁኔታዎች {#prerequisites}

- በገንዘብ የተደገፈ ምስጠራ ፈራሚ፣ `taira.client.toml`፣ `taira.tx-metadata.json` እና `TAIRA_ACCOUNT_ID` ከ[ከ Taira ጋር ይገናኙ](./connect-to-taira.md)።
- Taira ለ`TAIRA_ACCOUNT_ID` ቀስቅሴ ለመመዝገብ እና የተገኘውን ቀስቅሴ ለማስፈጸም ፍቃድ. አግባብነት ያላቸው ምልክቶች `CanRegisterTrigger` በ`authority` እና `CanExecuteTrigger` በ`trigger` የተወሰኑ ናቸው።
- እነዚያ ድጋፎች የማይገኙ ከሆነ፣ የመነጨ የአካባቢ አውታረ መረብ እና የአስተዳዳሪ ደንበኛውን ይጠቀሙ። ቀስቅሴው ፈቃድ ርእሰ መምህሩ ቀስቅሴው በሚፈጽማቸው መመሪያዎች የሚፈለገውን እያንዳንዱን ፍቃድ ይፈልጋል።

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## እርምጃዎች {#steps}

### 1. በመመሪያ የተደገፈ ቀስቅሴ ይመዝገቡ {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` JSON መመሪያዎችን ይቀበላል። የ`Log` መመሪያ ይህ ምሳሌ ከሁለተኛው የብሎክቼይን መዝገብ ነገር ፈቃዶች ይልቅ ቀስቅሴ ፍቃድ ላይ እንዲያተኩር ያደርገዋል።

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

ቀስቅሴው ቢበዛ ሶስት ጊዜ ሊሠራ ይችላል. የታወጀው የፍቃድ ርእሰ መምህሩ እንጂ እሱን ለማስፈጸም የሚከሰተው ጠያቂ ደንበኛ አይደለም፣ በድርጊቱ ውስጥ ያሉትን መመሪያዎች ይፈቅዳል።

### 2. ከመፈጸሙ በፊት ሐሳቡን ይፈትሹ {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

ሌላ ክፍያ ከማውጣትዎ በፊት የ I105 የፈቃድ ባለቤትን፣ የማስፈጸሚያ ማጣሪያውን፣ የተቀሩትን ድግግሞሾች እና ነጠላ `Log` መመሪያን ያረጋግጡ።

### 3. ሁለቱንም ንብርብሮች ያስፈጽሙ እና ይጠብቁ {#_3-execute-and-wait-for-both-layers}

የማስፈጸሚያ ግብይቱ እና ቀስቅሴው እርምጃ የተለየ ማስረጃ አላቸው። `--wait` የተተገበረ ግብይት መጨረሻውን ይጠብቃል; `--trace` እንዲሁም የሶፍትዌር ማስፈጸሚያ አካባቢ ማጠናቀቂያ ምርመራዎችን ሪፖርት ያደርጋል።

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

Rust ደንበኞች ተመሳሳይ ሁለት የተተየቡ መመሪያዎችን ይገነባሉ። እዚህ `authority` እንደ መለያ `AccountId` እና `client` ምልክቶች አሉ -

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

## አረጋግጥ {#verify}

ለማጠናቀቅ የተጠናቀቀውን የብሎክ ታሪክን ይቃኙ እና የተቀነሰውን የድግግሞሽ ብዛት ይፈትሹ -

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

ቢያንስ አንድ ማጠናቀቂያ ስኬትን ሪፖርት ማድረግ አለበት። ቀስቅሴው ሁለት አፈጻጸሞች ሲቀሩ ንቁ ሆኖ መቆየት አለበት። የተሳካ ቀስቅሴ ሳይጠናቀቅ የተሳካ ማስረከብ በቂ ማረጋገጫ አይደለም።

## መላ ፍለጋ {#troubleshooting}

- ያልተፈቀደ ተብሎ ውድቅ የተደረገው ምዝገባ ማለት ክሪፕቶግራፊክ ፈራሚው ለታወጀው የፈቃድ ባለቤት `CanRegisterTrigger` ይጎድለዋል ማለት ነው። አፈፃፀም በተናጥል የተስተካከለ `CanExecuteTrigger` ቶከን ያስፈልገዋል።
- ቀስቅሴው እርምጃ አለመሳካቱን ሪፖርት ሲያደርግ ግብይቱ ተተግብሯል። የማጠናቀቂያ ውጤቱን እና ስህተቱን ያንብቡ; ከዚያ ለእያንዳንዱ የተከተተ መመሪያ የቀስቅሴ ፈቃድ የርእሰ መምህሩን ፈቃዶች ያረጋግጡ።
- `trigger not found` የምዝገባ ግብይቱ ውድቅ ተደርጓል ወይም የተለየ Torii/ሰንሰለት ውቅር ለአፈፃፀም ጥቅም ላይ ውሏል ማለት ሊሆን ይችላል።
- ድግግሞሾች ዜሮ ሲደርሱ፣ ተጨማሪ ድግግሞሾችን መስጠት ሌላው ልዩ መብት ያለው የመጻፍ ክዋኔ ነው። ይህንን የተግባር መመሪያ በጸጥታ ወደ ላልተወሰነ ቀስቅሴ አይቀይሩት።
- ለማጽዳት፣ `ledger trigger unregister --id "$TRIGGER_ID"` ለዚያ ቀስቅሴ እና ግልጽ የሆነ የክፍያ ምርጫ `CanUnregisterTrigger` ያስፈልገዋል።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በቴክኒካል ጥሪ ቀስቅሴ የውህደት ሙከራዎች በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የክስተት እና ቀስቅሴ የውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የመመሪያ አፈፃፀምን ቀስቅሴ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [ቀስቅሴዎች](/am/blockchain/triggers.md)
- [ቀስቅሴ ምሳሌዎች](/am/blockchain/trigger-examples.md)
- [ክስተቶች](./stream-events.md)
