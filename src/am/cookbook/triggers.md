---
translation_locale: am
translation_source: /cookbook/triggers.md
translation_source_hash: 946309958fe4e23a7454206b1eb4557f8e853171ce4e04d5373cb36f46b13970
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# ቀስቅሴዎች {#triggers}

## ውጤት {#outcome}

በ Taira ላይ የተወሰነ የቴክኒክ ጥሪ ቀስቅሴ ያስመዝግቡ፣ አንድ ጊዜ ያስፈጽሙት፣ የተተገበረውን የመጨረሻነት ይጠብቁ እና ከተጠናቀቀው የብሎክ ታሪክ በተሳካ ሁኔታ መጠናቀቁን ያረጋግጡ።

## ቅድመ ሁኔታዎች {#prerequisites}

- በገንዘብ የተደገፈ ምስጠራ ፈራሚ፣ `taira.client.toml` እና `TAIRA_ACCOUNT_ID` ከ[ከ Taira ጋር ይገናኙ](./connect-to-taira.md)። የመጻፍ ክዋኔዎች `--fee-payer authority` ይጠቀማሉ፤ CLI ከመፈረሙ በፊት ትክክለኛውን ክፍያ በ Taira የክፍያ ንብረት የሚገልጽ የክፍያ ዋጋ ግምት ያቀርባል።
- Taira ለ`TAIRA_ACCOUNT_ID` ቀስቅሴ ለመመዝገብ እና የተገኘውን ቀስቅሴ ለማስፈጸም ፍቃድ. አግባብነት ያላቸው ምልክቶች `CanRegisterTrigger` በ`authority` እና `CanExecuteTrigger` በ`trigger` የተወሰኑ ናቸው።
- እነዚያ ድጋፎች የማይገኙ ከሆነ፣ የመነጨ የአካባቢ አውታረ መረብ እና የአስተዳዳሪ ደንበኛውን ይጠቀሙ። ቀስቅሴው ፈቃድ ርእሰ መምህሩ ቀስቅሴው በሚፈጽማቸው መመሪያዎች የሚፈለገውን እያንዳንዱን ፍቃድ ይፈልጋል።

```bash
CONFIG=./taira.client.toml
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## እርምጃዎች {#steps}

### 1. በመመሪያ የተደገፈ ቀስቅሴ ይመዝገቡ {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` `--emit-instructions` የሚያትመውን የ JSON መመሪያ ድርድር ይቀበላል። `tx ping` አንድ `Log` መመሪያ ያወጣል፤ ይህም ይህ ምሳሌ ከሁለተኛ የብሎክቼይን መዝገብ ነገር ፈቃዶች ይልቅ በቀስቅሴ ፍቃድ ላይ እንዲያተኩር ያደርገዋል።

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

ቀስቅሴው ቢበዛ ሶስት ጊዜ ሊሠራ ይችላል. የታወጀው የፍቃድ ርእሰ መምህሩ እንጂ እሱን ለማስፈጸም የሚከሰተው ጠያቂ ደንበኛ አይደለም፣ በድርጊቱ ውስጥ ያሉትን መመሪያዎች ይፈቅዳል።

### 2. ከመፈጸሙ በፊት ሐሳቡን ይፈትሹ {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

ሌላ ክፍያ ከማውጣትዎ በፊት የ I105 የፈቃድ ባለቤትን፣ የማስፈጸሚያ ማጣሪያውን፣ የተቀሩትን ድግግሞሾች እና በ`executable` ውስጥ በኮድ የተቀመጠውን ነጠላ መመሪያ ያረጋግጡ።

### 3. ሁለቱንም ንብርብሮች ያስፈጽሙ እና ይጠብቁ {#_3-execute-and-wait-for-both-layers}

የማስፈጸሚያ ግብይቱ እና ቀስቅሴው እርምጃ የተለየ ማስረጃ አላቸው። `--wait` የተተገበረ ግብይት መጨረሻውን ይጠብቃል; `--trace` እንዲሁም የሶፍትዌር ማስፈጸሚያ አካባቢ ማጠናቀቂያ ምርመራዎችን ሪፖርት ያደርጋል።

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust ደንበኞች ተመሳሳይ ሁለት ዓይነታቸው የተገለጸ መመሪያዎችን ይገነባሉ። እዚህ `authority` `AccountId` ነው፣ እና `client` እንደዚያ መለያ የሚፈርም `iroha::blocking::Client` ነው፤ `submit` የተተገበረውን የመጨረሻነት ይጠብቃል፦

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

## አረጋግጥ {#verify}

ለማጠናቀቅ የተጠናቀቀውን የብሎክ ታሪክን ይቃኙ እና የተቀነሰውን የድግግሞሽ ብዛት ይፈትሹ -

```bash
iroha --config "$CONFIG" trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

ቢያንስ አንድ ማጠናቀቂያ ስኬትን ሪፖርት ማድረግ አለበት። ቀስቅሴው ሁለት አፈጻጸሞች ሲቀሩ ንቁ ሆኖ መቆየት አለበት። የተሳካ ቀስቅሴ ሳይጠናቀቅ የተሳካ ማስረከብ በቂ ማረጋገጫ አይደለም።

## መላ ፍለጋ {#troubleshooting}

- ያልተፈቀደ ተብሎ ውድቅ የተደረገው ምዝገባ ማለት ክሪፕቶግራፊክ ፈራሚው ለታወጀው የፈቃድ ባለቤት `CanRegisterTrigger` ይጎድለዋል ማለት ነው። አፈፃፀም በተናጥል የተስተካከለ `CanExecuteTrigger` ቶከን ያስፈልገዋል።
- ቀስቅሴው እርምጃ አለመሳካቱን ሪፖርት ሲያደርግ ግብይቱ ተተግብሯል። የማጠናቀቂያ ውጤቱን እና ስህተቱን ያንብቡ; ከዚያ ለእያንዳንዱ የተከተተ መመሪያ የቀስቅሴ ፈቃድ የርእሰ መምህሩን ፈቃዶች ያረጋግጡ።
- `Trigger with id … not found` የምዝገባ ግብይቱ ውድቅ ተደርጓል ወይም የተለየ Torii/ሰንሰለት ውቅር ለአፈፃፀም ጥቅም ላይ ውሏል ማለት ሊሆን ይችላል።
- ድግግሞሾች ዜሮ ሲደርሱ፣ ተጨማሪ ድግግሞሾችን መስጠት ሌላው ልዩ መብት ያለው የመጻፍ ክዋኔ ነው። ይህንን የተግባር መመሪያ በጸጥታ ወደ ላልተወሰነ ቀስቅሴ አይቀይሩት።
- ለማጽዳት፣ `trigger unregister --id "$TRIGGER_ID"` ለዚያ ቀስቅሴ እና ግልጽ የሆነ የክፍያ ምርጫ `CanUnregisterTrigger` ያስፈልገዋል።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በቴክኒካል ጥሪ ቀስቅሴ የውህደት ሙከራዎች በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/triggers/by_call_trigger.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የክስተት እና ቀስቅሴ የውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events_and_triggers.rs)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የመመሪያ አፈፃፀምን ቀስቅሴ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [ቀስቅሴዎች](/am/blockchain/triggers.md)
- [ቀስቅሴ ምሳሌዎች](/am/blockchain/trigger-examples.md)
- [ክስተቶች](./stream-events.md)
