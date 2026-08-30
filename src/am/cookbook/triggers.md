---
translation_locale: am
translation_source: /cookbook/triggers.md
translation_source_hash: 6c8f436b5a41cf41c0ac37aeed6b6cd8c73009cfcca2fe7f5642cef1ad115e6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ማነቃቂያዎች {#triggers}

## ውጤቱ {#outcome}

በ Taira ላይ የተወሰነ የዝውውር ጥሪ ማነሳሻ ይመዝገቡ ፣ አንድ ጊዜ ያካሂዱት ፣ ለተተገበረ ፍፃሜ ይጠብቁ እና ከተቀማጭ ብሎክ ታሪክ ውስጥ በተሳካ ሁኔታ መጠናቀቁን ያረጋግጡ።

## ቅድመ ሁኔታዎች {#prerequisites}

- የገንዘብ ድጋፍ ያለው ፊርማ፣ `taira.client.toml`, `taira.tx-metadata.json`, እና `TAIRA_ACCOUNT_ID` ከ [ጋር ይገናኙ Taira](./connect-to-taira.md).
- Taira ለ ማስነሻ ለማስመዝገብ ፈቃድ `TAIRA_ACCOUNT_ID` የሚመለከታቸው ምልክቶች ናቸው `CanRegisterTrigger` በ `authority` እና `CanExecuteTrigger` በ `trigger`.
- እነዚህ ድጎማዎች የማይገኙ ከሆነ የተፈጠረውን አካባቢያዊ አውታረመረብ እና የአስተዳዳሪ ደንበኞቹን ይጠቀሙ። አስነሳው ባለሥልጣን ደግሞ አስነሳው የሚፈጽመው መመሪያ በሚጠይቀው እያንዳንዱ ፈቃድ ይፈልጋል።

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## እርምጃዎች {#steps}

### 1. በትዕዛዝ የተደገፈ ማነቃቂያ መመዝገብ። {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` የ JSON መመሪያዎች ቅደም ተከተል ይቀበላል. አንድ `Log` መመሪያ ይህ ምሳሌ በሁለተኛው መቁጠሪያ ዕቃ ፍቃዶች ይልቅ አስነሳሽነት ፈቃድ ላይ ያተኮረ ነው.

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

አስጀማሪው በከፍተኛ ደረጃ ሦስት ጊዜ ሊሠራ ይችላል። የተገለጸው ሥልጣኑ እንጂ የሚፈጽመው አድራጊው ሳይሆን እርምጃው ውስጥ ያሉትን መመሪያዎች ይፈቅዳል.

### 2. አዋጁን ከመፈጸሙ በፊት ያረጋግጡ {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

ሌላ ክፍያ ከመክፈልዎ በፊት I105 ባለሥልጣንን ፣ የሂደቱን ማጣሪያ ፣ የቀሩትን ድግግሞሾችን እና ነጠላውን `Log` መመሪያ ያረጋግጡ።

### 3. ሁለቱንም ንብርብሮች ማከናወንና መጠበቅ። {#_3-execute-and-wait-for-both-layers}

የአፈፃፀም ግብይት እና የማስነሳት እርምጃ የተለዩ ማስረጃዎች አሉት ። `--wait` ለተተገበረው የግብይት ፍፃሜ ይጠብቃል; `--trace` በተጨማሪም የስራ ሰዓት ማጠናቀቂያ ምርመራዎችን ሪፖርት ያደርጋል ።

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

Rust ደንበኞች ተመሳሳይ ሁለት የተጻፉ መመሪያዎችን ይገነባሉ. እዚህ ላይ `authority` እንደ መለያ አንድ `AccountId` እና `client` ምልክቶች ነው:

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

## ያረጋግጡ {#verify}

ለተጠናቀቀው የተሰማሩ ብሎኮች ታሪክን ይቃኙ እና የመደመር ድግግሞሽ ብዛት ይመልከቱ:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

ቢያንስ አንድ ማጠናቀቅ ስኬታማ መሆኑን ሪፖርት ማድረግ አለበት ። ማስነሻው ሁለት አፈፃፀም ሲቀሩ ንቁ ሆኖ መቆየት አለበት ። ያለ ስኬታማ ማስነሻ ማጠናቀቅ የተሳካ ማረጋገጫ አይደለም ።

## ችግሮችን መፍታት {#troubleshooting}

- ምዝገባው አልተፈቀደለትም ተብሎ ውድቅ ተደርጓል ማለት ፊርማው ለታወጀው ባለስልጣን `CanRegisterTrigger` የጎደለው ነው ። አፈፃፀሙ በተናጠል የተቀመጠውን `CanExecuteTrigger` ቶከን ይጠይቃል ።
- አንድ ግብይት የተተገበረውን መድረስ ይችላል ሳለ አስነሳው እርምጃ አለመሳካቱን ሪፖርት ያደርጋል. የማጠናቀቂያ ውጤት እና ስህተት ያንብቡ; ከዚያ እያንዳንዱን የተቀረጸ መመሪያ ለማግኘት አስነሳው ባለስልጣን ፍቃዶችን ይፈትሹ.
- `trigger not found` ማለት የምዝገባው ግብይት ውድቅ ተደርጓል ወይም ለመፈፀም የተለየ Torii / ሰንሰለት ውቅር ጥቅም ላይ ውሏል ማለት ነው ።
- ድግግሞሾቹ ወደ ዜሮ ሲደርሱ ተጨማሪ ድግግመቶችን ማቀናበር ሌላ ልዩ ጽሑፍ ነው። ይህን የምግብ አዘገጃጀት መመሪያ ለዘለቄታው አትቀይር።
- ለጽዳት `ledger trigger unregister --id "$TRIGGER_ID"` ለዚያ አስነሳሽነት እና ግልፅ ክፍያ ምርጫ `CanUnregisterTrigger` ይጠይቃል ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በተጣበቀ የኮሚት ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs) ላይ በዝውውር ጥሪ ተነሳሽነት ውህደት ሙከራዎች
- [የዝግጅት እና ተነሳሽነት ውህደት ሙከራዎች በተጣበቀ ኮሚቴ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [በፒን የተቀመጠው ኮምፕዩተር ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs) ላይ የማስነሳት መመሪያ አፈፃፀም
- [መንስኤዎች](/am/blockchain/triggers.md)
- [ማስነሳት ምሳሌዎች](/am/blockchain/trigger-examples.md)
- [ክስተቶች](./stream-events.md)
