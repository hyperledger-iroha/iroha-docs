---
translation_locale: my
translation_source: /cookbook/triggers.md
translation_source_hash: 5267fb9bb232d52d9df4bedee414d745ccc30dd52cbc30993df3c5b975a0bc38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# နှိုးစက်များ {#triggers}

## ရလဒ် {#outcome}

Finite by-technical invocation trigger ကို Taira မှာ မှတ်ပုံတင်ပြီး ဒါကို တစ်ကြိမ်လုပ်ဆောင်ပြီး Applied finality ကိုစောင့်ပြီး နောက်ဆုံးသတ်မှတ်ထားတဲ့ block history ကနေ အောင်မြင်စွာ ပြီးစီးတာကို အတည်ပြုပါ။

## လိုအပ်ချက်များ {#prerequisites}

- `taira.client.toml`, `taira.tx-metadata.json` နှင့် `TAIRA_ACCOUNT_ID` မှ ရင်းနှီးမြှုပ်နှံထားသော cryptographic signer များ၊ [Taira သို့ ချိတ်ဆက်ပါ။](./connect-to-taira.md)
- Taira trigger ကို မှတ်ပုံတင်ဖို့ ခွင့်ပြုချက် `TAIRA_ACCOUNT_ID` ရလာတဲ ့ trigger ကို execute လုပ္ပါ။ `CanRegisterTrigger` ကန့်သတ်ချက် `authority` နှင့် `CanExecuteTrigger` ကန့်သတ်ချက် `trigger`.
- ဒီထောက်ပံ့မှုတွေဟာ မရနိုင်ဘူးဆိုရင် ဖန်တီးထားတဲ့ ဒေသတွင်းကွန်ရက်နဲ့ ၎င်းရဲ့ အုပ်ချုပ်ရေးမှူး ဝယ်သူကို သုံးပါ။ trigger ခွင့်ပြုချက် မူဝါဒကလည်း trigger ကလုပ်ဆောင်မယ့် ညွှန်ကြားချက်တွေက တောင်းဆိုတဲ့ ခွင့်ပြုချက်တွေအားလုံးကို လိုအပ်ပါတယ်။

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## ခြေလှမ်း {#steps}

### (၁) ညွှန်ကြားချက်ထောက်ပံ့တဲ့ trigger ကို မှတ်ပုံတင်ပါ။ {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` သည် JSON ညွှန်ကြားချက်အတန်းကိုလက်ခံသည်။ `Log` ညွှန်ပြချက်သည်ဤဥပမာကို ဒုတိယ blockchain ledger အရာဝတ္ထု၏ခွင့်ပြုချက်များအစား trigger ခွင့်ပြုချက်အပေါ်အာရုံစိုက်စေသည်။

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

trigger ကို အမြင့်ဆုံး သုံးကြိမ်လောက် run လုပ်လို့ရပါတယ်။ ၎င်းရဲ့ ကြေညာထားတဲ့ authorization principal က လုပ်ဆောင်ချက်အတွင်းက ညွှန်ကြားချက်တွေကို အတည်ပြုတယ်၊ ဒါကိုလုပ်ဆောင်တဲ့ requesting client မဟုတ်ဘူး။

### (၂) အမိန့်မချမှတ်မီ ကြေညာချက်ကို စစ်ဆေးပါ။ {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

I105 ခွင့်ပြုချက် အရင်းအမြစ်၊ အကောင်အထည်ဖော်မှု စစ်ဆေးရေးကိရိယာ၊ ကျန်တဲ့ ထပ်ကျော့ခြင်းများနှင့် တစ်ကြိမ်တည်းသော `Log` ညွှန်ကြားချက်ကို အခြားစရိတ်မပေးခင်မှာ အတည်ပြုပါ။

### (၃) အလွှာနှစ်ခုစလုံးကို လုပ်ပြီး စောင့်ပါ။ {#_3-execute-and-wait-for-both-layers}

`--wait` သည် Applied transaction finality ကို စောင့်ဆိုင်းနေသည်; `--trace` သည် software execution environment ၏ ပြီးစီးမှု ရောဂါစစ်ဆေးမှုကိုလည်း ဖော်ပြသည်။

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

ပြီးစီးမှုအတွက် နောက်ဆုံးသတ်မှတ်ထားတဲ့ ဘလော့ဂ်သမိုင်းကို စကင်လုပ်ပြီး လျှော့ချထားတဲ့ အထပ်ထပ်တွက်ချက်မှုကို စစ်ဆေးပါ။

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

အနည်းဆုံး ပြီးမြောက်မှုတစ်ခုမှာ အောင်မြင်မှုရှိကြောင်း သတင်းပေးပို့ရပါမည်။ ထိုးနှက်စက်က လုပ်ဆောင်မှု ၂ ခု ကျန်နေချိန်မှာ တက်ကြွစွာ ဆက်လက်လုပ်ဆောင်ရမယ်။ အောင်မြင်တဲ့ ထိုးနှင်စက်ပြီးစီးခြင်းမရှိဘဲ အောင်မြင်တဲ့ တင်သွင်းမှုက လုံလောက်တဲ့ စစ်ဆေးမှုမဟုတ်ပါ။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- မှတ်ပုံတင်ခြင်းသည် ခွင့်ပြုချက်မရှိသည့်အတွက် ပယ်ချခံရခြင်းဆိုသည်မှာ စာဝှက်လက်မှတ်ရေးထိုးသူတွင် ကြေညာထားသော ခွင့်ပြုမှု မူလစာရင်းအတွက် `CanRegisterTrigger` မရှိခြင်းဖြစ်သည်။ အကောင်အထည်ဖော်ရန်အတွက် သီးခြား scoped `CanExecuteTrigger` token ကိုလိုအပ်သည်။
- ငွေပေးချေမှုတစ်ခုသည် Applied ကိုရောက်ရှိနိုင်ပြီး trigger လုပ်ဆောင်ချက် ပျက်ကွက်မှု အစီရင်ခံစာများကို ဖတ်ရှုပါ။ ပြီးစီးခြင်းရလဒ်နှင့်အမှားကိုဖတ်ပါ၊ ထို့နောက်ထည့်သွင်းထားသော ညွှန်ကြားချက်တိုင်းအတွက် trigger ခွင့်ပြုချက် မူဝါဒ၏ခွင့်ပြုချက်များကိုစစ်ဆေးပါ။
- `trigger not found` ဆိုသည်မှာ မှတ်ပုံတင် ငွေပေးချေမှုကို ပယ်ချခဲ့ခြင်း သို့မဟုတ် အခြား Torii/chain configuration ကို အကောင်အထည်ဖော်ရန် အသုံးပြုခဲ့ခြင်း ဖြစ်ပါသည်။
- ထပ်ကျော့မှု သုညကို ရောက်တဲ့အခါ ထပ်ကျော့မှုတွေ ပိုထုတ်ပေးခြင်းဟာ နောက်ထပ် အခွင့်ထူးခံ စာတစ်စောင်ပါ။ ဒီအချက်ပြနည်းကို မရေရာတဲ့ trigger အဖြစ် တိတ်ဆိတ်စွာမပြောင်းပါနဲ့။
- သန့်ရှင်းရေးအတွက် `ledger trigger unregister --id "$TRIGGER_ID"` က ဒီ trigger နဲ့ explicit fee ရွေးချယ်မှု အတွက် `CanUnregisterTrigger` ကို တောင်းဆိုပါတယ်။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [Pinned source-code revision တွင် By-technical invocation trigger integration စမ်းသပ်မှုများ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [Pinned source-code revision တွင် ဖြစ်ရပ်နှင့် trigger ပေါင်းစပ်မှု စမ်းသပ်ချက်များ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [Trigger ညွှန်ကြားချက်များကို ပိတ်ထားသော source-code revision တွင်လုပ်ဆောင်ခြင်း](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [နှိုးစက်များ](/my/blockchain/triggers.md)
- [trigger နမူနာများ](/my/blockchain/trigger-examples.md)
- [ဖြစ်ရပ်များ](./stream-events.md)
