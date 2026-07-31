---
translation_locale: my
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# နှိုးဆော်မှု {#triggers}

trigger တွေက event filter ကို executable action နဲ့ ချိတ်ဆက်ပေးပါတယ်။ event တစ်ခုနဲ့ match ဖြစ်တဲ့အခါ
trigger ရဲ့ filter ကို Iroha ဘလော့က အစိတ်အပိုင်းအဖြစ် trigger လုပ်ဆောင်မှုကို အကဲဖြတ်ပေးတယ်။
သေဒဏ်ချမှတ်ခြင်း။

## ဖွဲ့စည်းပုံ {#structure}

မှတ်ပုံတင်ထားသော `Trigger` အောက်ပါအတိုင်း ပါဝင်ပါတယ်။

- `id`: (က) `TriggerId` ပိတ်ခြင်း a `Name`
- `action`: အကောင်အထည်ဖော်နိုင်မှု၊ အာဏာ၊ စစ်ဆေးမှု၊ အထပ်ထပ်မူဝါဒ၊ ထပ်မံစမ်းသပ်ခြင်း မူဝါဒ
  မီတာဒေတာ

အဆိုပါ လုပ်ဆောင်ချက်မှာ အောက်ပါအချက်များ ပါဝင်သည်-

- `executable`: `Instructions`, `ContractCall`, `Ivm`, ဒါမှမဟုတ် `IvmProved`
- `repeats`: `Indefinitely` ဒါမှမဟုတ် `Exactly(n)`
- `authority`: အကောင်အထည်ဖော်နိုင်တာကို ခေါ်တဲ့စာရင်း
- `filter`: တစ် `EventFilterBox`
- `retry_policy`: ကြိုတင်စီစဉ်ထားသော အချိန် trigger များအတွက် ရွေးချယ်စရာ ပြန်လည်စမ်းသပ်မှု ပြုမူပုံ
- `metadata`: အလိုလို trigger metadata များ

## အဖြစ်အပျက် စစ်ဆေးခြင်း {#event-filters}

Trigger Conditions တွေမှာ Subscriptions တွေလိုပဲ Event Filter ပုံစံကို သုံးပါတယ်။
အထက်တန်းအဆင့် ဖြစ်ရပ် စစ်ဆေးမှုက

- ဘိုက်လိုင်း ဖြစ်ရပ်များ
- ဒေတာဖြစ်ရပ်များ
- အချိန်ဖြစ်ရပ်များ
- trigger execution ဖြစ်ရပ်များ
- အစပျိုးပြီးစီးမှုဖြစ်ရပ်များ

Workflow ကိုက်ညီတဲ့ သေးငယ်ဆုံး filter ကို ကြိုက်တယ်။ ကျယ်ပြန့်တဲ့ filter တွေက အသုံးဝင်ပါတယ်။
ရောဂါရှာဖွေရေးအတွက်၊ ဒါပေမဲ့ ဘလော့ အကောင်အထည်ဖော်မှုအတွင်းမှာ အလုပ်ကို တိုးမြှင့်ပေးတယ်။

ကြည့်ပါ။ [စစ်ဆေးခြင်း](/my/blockchain/filters.md) လက်ရှိ filter မိသားစုတွေအတွက်ပါ။

## အချိန်ကို နှိုးဆွပေးသူများ {#time-triggers}

Time trigger တွေက အချိန်ဖြစ်စဉ် စစ်ဆေးမှုကို သုံးတယ်။ ကမ္ဘာအခြေအနေအမြင်ဟာ
အချိန်နဲ့ ကိုက်ညီတဲ့ အခြေအနေ၊ Iroha trigger အောက်မှာ trigger လုပ်တာကို လုပ်ဆောင်တယ်။
Time trigger တွေက ပြန်လည်စမ်းသပ်မှု မူဝါဒကို သုံးနိုင်တဲ့ trigger အမျိုးအစားပါ။
အောက်မှာဖော်ပြထားတာပါ။

## အထပ်ထပ် {#repetition}

`Repeats::Indefinitely` မှတ်ပုံတင်မထားတဲ့အထိ trigger ကို တက်ကြွစေတယ်။

`Repeats::Exactly(n)` trigger ကို သတ်မှတ်ထားတဲ့ အကြိမ်များစွာ ပစ်ခတ်ခွင့်ပေးပါတယ်။
စာရင်းကုန်သွားပြီဆိုရင် အလားတူ အပြုအမူ လိုအပ်ပါက trigger အသစ်တစ်ခုကို မှတ်ပုံတင်ပါ။
နောက်တစ်ခါ ထပ်ပြောပါဦး။

## အာဏာနှင့် ခွင့်ပြုချက် {#authority-and-permissions}

trigger authority က executable ကို invocate လုပ်ဖို့ အသုံးပြုတဲ့ account ပါ။
သက်တမ်းရှည်သော trigger များအတွက် သီးသန့် နည်းပညာ အကောင့်များဖြင့် လိုအပ်သော ခွင့်ပြုချက်များ
ထုတ်ပြန်ပြီး operator ရဲ့ကိုယ်ပိုင်အကောင့်ကနေ သီးခြားခွဲထားတာပါ။

အာဏာပိုင်က အကောင်အထည်ဖော်နိုင်သော ညွှန်ကြားချက်များနှင့်အညီ လိုအပ်သည့် ခွင့်ပြုချက်များကို လိုအပ်သည်
စာချုပ်ခေါ်ဆိုမှု. trigger ကိုမှတ်ပုံတင်တဲ့စာရင်းမှာလည်း ခွင့်ပြုချက်လိုအပ်ပါတယ်
Active Runtime Validator အောက်မှာ မှတ်ပုံတင် trigger တွေပါ။

## ပြန်လည်စမ်းသပ်မှု မူဝါဒ {#retry-policy}

Time triggers တွေဟာ ပြန်လည်စမ်းသပ်မှု မူဝါဒကို ရွေးချယ်နိုင်ပါတယ်။

- `max_retries`: အစောပိုင်း ကျရှုံးမှုအပြီး ပြန်လည်စမ်းသပ်မှု ဘယ်လောက်ရှိခွင့်ပြုထားသလဲ
  ပစ်ခတ်ခြင်း
- `retry_after_ms`: ဘယ်လောက်ကြာမလဲ Iroha ထပ်မံစမ်းသပ်မှု မပြုလုပ်ခင် စောင့်ဆိုင်းထားတယ်။

ထပ်မံစမ်းသပ်ဖို့ ဘတ်ဂျက်ကုန်သွားတဲ့အခါ trigger ကို မှတ်ပုံတင်မထားဘူး။

## မေးခွန်းများ {#queries}

လက်ရှိ trigger queries များကို အသုံးပြုပြီး trigger အခြေအနေကို စစ်ဆေးပါ

- [`FindTriggers`](/my/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/my/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/my/reference/queries.md#triggers-contracts-transactions-and-blocks)

အောက်ပါအတိုင်းလည်း ကြည့်ပါ။

- [အဖြစ်အပျက် trigger ဥပမာ](/my/blockchain/trigger-examples.md)
- [ဖြစ်ရပ်များ](/my/blockchain/events.md)
- [ညွှန်ကြားချက်များ](/my/blockchain/instructions.md)
- [ခွင့်ပြုချက်များ](/my/blockchain/permissions.md)
