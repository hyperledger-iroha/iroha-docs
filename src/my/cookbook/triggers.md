---
translation_locale: my
translation_source: /cookbook/triggers.md
translation_source_hash: 6c8f436b5a41cf41c0ac37aeed6b6cd8c73009cfcca2fe7f5642cef1ad115e6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# နှိုးစက်များ {#triggers}

## ရလဒ် {#outcome}

Finite by-call trigger ကို Taira မှာ မှတ်ပုံတင်ပြီး ဒါကို တစ်ကြိမ်လုပ်ဆောင်ပြီး Applied finality ကိုစောင့်ပြီး commited block history ကနေ အောင်မြင်စွာ ပြီးစီးတာကို အတည်ပြုပါ။

## လိုအပ်ချက်များ {#prerequisites}

- ငွေကြေးထောက်ပံ့တဲ့ လက်မှတ်ထိုးသူ၊ `taira.client.toml`, `taira.tx-metadata.json`, နှင့် `TAIRA_ACCOUNT_ID` မှ [ချိတ်ဆက် Taira](./connect-to-taira.md).
- Taira trigger ကို မှတ်ပုံတင်ဖို့ ခွင့်ပြုချက် `TAIRA_ACCOUNT_ID` ရလာတဲ ့ trigger ကို execute လုပ္ပါ။ `CanRegisterTrigger` ကန့်သတ်ချက် `authority` နှင့် `CanExecuteTrigger` ကန့်သတ်ချက် `trigger`.
- ဒီထောက်ပံ့မှုတွေဟာ မရနိုင်ဘူးဆိုရင် ဖန်တီးထားတဲ့ ဒေသတွင်းကွန်ရက်နဲ့ ၎င်းရဲ့ အုပ်ချုပ်ရေးမှူး ဝယ်သူကို အသုံးပြုပါ။ trigger အာဏာပိုင်ဟာ trigger က လုပ်ဆောင်မယ့် ညွှန်ကြားချက်တွေက လိုအပ်တဲ့ ခွင့်ပြုချက်အားလုံးကိုလည်း လိုအပ်ပါတယ်။

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## ခြေလှမ်း {#steps}

### (၁) ညွှန်ကြားချက်ထောက်ပံ့တဲ့ trigger ကို မှတ်ပုံတင်ပါ။ {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` သည် JSON ညွှန်ကြားချက်အတန်းကိုလက်ခံသည်။ `Log` ညွှန်ပြချက်သည်ဤဥပမာကို ဒုတိယ ledger အရာဝတ္ထု၏ခွင့်ပြုချက်များအစား trigger ခွင့်ပြုချက်အပေါ်အာရုံစိုက်စေသည်။

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

trigger က အမြင့်ဆုံး ၃ ကြိမ် ပြေးနိုင်ပြီး ၎င်းရဲ့ ထုတ်ပြန်ထားတဲ့ အာဏာက လုပ်ဆောင်မှုအတွင်းမှာရှိတဲ့ ညွှန်ကြားချက်တွေကို အမိန့်ပေးတယ်၊ ဒါကို အကောင်အထည်ဖော်တဲ့ ဖုန်းခေါ်သူမဟုတ်ဘူး။

### (၂) အမိန့်မချမှတ်မီ ကြေညာချက်ကို စစ်ဆေးပါ။ {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

I105 ခွင့်ပြုချက်၊ အကောင်အထည်ဖော်မှု စစ်ဆေးရေးကိရိယာ၊ ကျန်တဲ့ ထပ်ကျော့ခြင်းများနှင့် တစ်ကြိမ်တည်း `Log` ညွှန်ကြားချက်များကို အခြားခမပေးမီ အတည်ပြုပါ။

### (၃) အလွှာနှစ်ခုစလုံးကို လုပ်ပြီး စောင့်ပါ။ {#_3-execute-and-wait-for-both-layers}

`--wait` သည် Applied transaction finality ကို စောင့်ဆိုင်းနေသည်၊ `--trace` သည် runtime completion diagnostics များကိုလည်း ဖော်ပြသည်။

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

Rust ဖောက်သည်များက တူညီသော ရိုက်နှိပ် ညွှန်ကြားချက် နှစ်ခုကို တည်ဆောက်သည်။ ဒီမှာ `authority` သည် `AccountId` နှင့် `client` သင်္ကေတတစ်ခုဖြစ်သည် .

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

## စစ်ဆေးပါ {#verify}

ပြီးဆုံးဖို့ committed block history ကို scan လုပ်ပြီး decremented repetition count ကို စစ်ဆေးပါ။

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

အနည်းဆုံး ပြီးမြောက်မှုတစ်ခုမှာ အောင်မြင်မှုရှိကြောင်း သတင်းပေးပို့ရပါမည်။ ထိုးနှက်စက်က လုပ်ဆောင်မှု ၂ ခု ကျန်နေချိန်မှာ တက်ကြွစွာ ဆက်လက်လုပ်ဆောင်ရမယ်။ အောင်မြင်တဲ့ ထိုးနှင်စက်ပြီးစီးခြင်းမရှိဘဲ အောင်မြင်တဲ့ တင်သွင်းမှုက လုံလောက်တဲ့ စစ်ဆေးမှုမဟုတ်ပါ။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- မှတ်ပုံတင်ခွင့်မရှိလို့ ပယ်ချခြင်းဆိုသည်မှာ လက်မှတ်ရေးထိုးသူအတွက် `CanRegisterTrigger` ကင်းမဲ့ခြင်းဖြစ်သည်။ အကောင်အထည်ဖော်ရန်အတွက် သီးခြားကန့်သတ်ချက်ရှိ `CanExecuteTrigger` token ကိုလိုအပ်သည်။
- ငွေပေးချေမှုတစ်ခုသည် Applied သို့ရောက်ရှိနိုင်ပြီး trigger လုပ်ဆောင်ချက်သည် ကျရှုံးမှု အစီရင်ခံစာများကို ဖတ်ရှုပါ။ ပြီးစီးခြင်းရလဒ်နှင့်အမှားကိုဖတ်ပါ၊ ထို့နောက်ထည့်သွင်းထားသော ညွှန်ကြားချက်တိုင်းအတွက် trigger အာဏာပိုင်၏ ခွင့်ပြုချက်များကိုစစ်ဆေးပါ.
- `trigger not found` ဆိုသည်မှာ မှတ်ပုံတင် ငွေပေးချေမှုကို ပယ်ချခဲ့ခြင်း သို့မဟုတ် အခြား Torii/chain configuration ကို အကောင်အထည်ဖော်ရန် အသုံးပြုခဲ့ခြင်း ဖြစ်ပါသည်။
- ထပ်ကျော့မှု သုညကို ရောက်တဲ့အခါ ထပ်ကျော့မှုတွေ ပိုလုပ်ခြင်းဟာ နောက်ထပ် အခွင့်ထူးခံ စာသားတစ်ပုဒ်ပါ။ ဒီအချက်ပြနည်းကို မရေမတွက်နိုင်တဲ့ trigger အဖြစ် တိတ်ဆိတ်စွာ မပြောင်းပါနဲ့။
- သန့်ရှင်းရေးအတွက် `ledger trigger unregister --id "$TRIGGER_ID"` က ဒီ trigger နဲ့ explicit fee ရွေးချယ်မှု အတွက် `CanUnregisterTrigger` ကို တောင်းဆိုပါတယ်။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ချိတ်ဆက်ထားသော commit ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs) တွင် By-call trigger ပေါင်းစပ်မှု စမ်းသပ်မှုများ
- [ပိတ်ထားသော commit တွင်ဖြစ်စဉ်နှင့် trigger ပေါင်းစပ်မှု စမ်းသပ်ချက်များ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [Trigger instruction execution at the pinned commit ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [အစပျိုးစက်များ ](/my/blockchain/triggers.md)
- [အစပျိုးစက် နမူနာများ](/my/blockchain/trigger-examples.md)
- [ဖြစ်ရပ်များ](./stream-events.md)
