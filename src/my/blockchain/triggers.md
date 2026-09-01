---
translation_locale: my
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# နှိုးစက်များ {#triggers}

trigger တွေက event filter ကို executable action နဲ့ ချိတ်ဆက်ပေးပါတယ်။ event တစ်ခုဟာ trigger ရဲ့ filter နဲ့ ကိုက်ညီတဲ့အခါ Iroha က block execution အစိတ်အပိုင်းအဖြစ် trigger လုပ်ရပ်ကို အကဲဖြတ်တယ်။

## ဖွဲ့စည်းပုံ {#structure}

မှတ်ပုံတင်ထားသော `Trigger` တွင်:

- `id`: a `TriggerId` ကို ဖုံးအုပ်ထားသော `Name`
- `action`: အကောင်အထည်ဖော်နိုင်မှု, ခွင့်ပြုချက် မူလအချက်အလက်များ, စစ်ဆေးခြင်း, ထပ်ကျော့ခြင်းမူဝါဒများ, ပြန်လည်စမ်းသပ်မှုမူဝါဒနှင့် metadata များ

လုပ်ဆောင်ချက်မှာ အောက်ပါအချက်တွေ ပါဝင်ပါတယ်။

- `executable`: `Instructions`၊ `ContractCall`၊ `Ivm` သို့မဟုတ် `IvmProved`
- `repeats`: (သို့) `Indefinitely` သို့မဟုတ် `Exactly(n)`
- `authority`: အကောင်အထည်ဖော်နိုင်သောစာရင်းကိုခေါ်ယူသည်
- `filter`: a `EventFilterBox`
- `retry_policy`: အစီအစဉ်ချထားသော အချိန် trigger များအတွက် ရွေးချယ်စရာ ထပ်မံစမ်းသပ်မှု ပြုမူပုံ။
- `metadata`: အလိုလို trigger metadata များ

## အဖြစ်အပျက် စစ်ဆေးခြင်း {#event-filters}

Trigger Conditions က Subscriptions တွေနဲ့ တူတဲ့ Event Filter ပုံစံကို သုံးပါတယ်။ အထက်တန်းအဆင့် Event filter ကတော့

- ဆော့ဖ်ဝဲ စီမံခန့်ခွဲမှု အလုပ်ဖြစ်စဉ်များ
- ဒေတာဖြစ်ရပ်များ
- အချိန်ကို အခြေခံတဲ့ အဖြစ်အပျက် အကြောင်းကြားချက်များ
- trigger execution ဖြစ်ရပ်များ
- အစပျိုးပြီးစီးမှုဖြစ်ရပ်များ

Workflow ကိုက်ညီတဲ့ သေးငယ်ဆုံး filter ကို ကြိုက်တယ်။ Broad filters တွေဟာ ရောဂါရှာဖွေရေးအတွက် အသုံးဝင်ပေမဲ့ block execution အတွင်းမှာ အလုပ်ကို တိုးမြှင့်ပါတယ်။

[Filters များ](/my/blockchain/filters.md) ကို ကြည့်ပါ။ လက်ရှိ filter မိသားစုတွေ အတွက်။

## အချိန်ကို နှိုးဆွပေးခြင်း {#time-triggers}

Time trigger တွေက time event filter ကို သုံးပါတယ်။ world state view က match time condition ကို ရောက်တဲ့အခါ Iroha ဟာ trigger authorization principle အောက်မှာ trigger လုပ်တာကို လုပ်ဆောင်တယ်။ Time trigger များဟာ အောက်ဖော်ပြထားတဲ့ retry policy ကို အသုံးပြုနိုင်တဲ့ trigger အမျိုးအစားပါ။

## ထပ်ကျော့ခြင်း {#repetition}

`Repeats::Indefinitely` သည် မှတ်ပုံတင်ခြင်းမရှိတဲ့အထိ trigger ကို တက်ကြွစေတယ်။

`Repeats::Exactly(n)` က trigger ကို fixed number of times fire လုပ်ခွင့်ပေးတယ်။ count ပြီးသွားတဲ့အခါ အလားတူအပြုအမူကို ထပ်မံလိုအပ်ရင် trigger အသစ်တစ်ခုကို မှတ်ပုံတင်ပါ။

## ခွင့်ပြုချက် အရင်းအမြစ်နှင့် ခွင့်ပြုချက်တွေ {#authority-and-permissions}

trigger authorization principal က executable ကို invocate လုပ်ဖို့ အသုံးပြုတဲ့ account ပါ။ ရေရှည် သက်တမ်းရှိတဲ့ trigger တွေအတွက် ရည်စူးထားတဲ့ technical account တစ်ခုကို သုံးပြီး လိုအပ်တဲ့ ခွင့်ပြုချက်တွေဟာ operator ရဲ့ ကိုယ်ရေးကိုယ်တာအကောင့်ကနေ ရှင်းလင်းပြီး သီးသန့်ဖြစ်စေပါတယ်။

Authorisation Principal က executable instruction တွေ (သို့) contract technical invocation တွေမှာ လိုအပ်တဲ့ ခွင့်ပြုချက်တွေကို လိုအပ်ပါတယ်။ trigger ကို မှတ်ပုံတင်တဲ့ account ဟာ active software execution environment validator အောက်မှာ trigger တွေကို မှတ်ပုံတင်ဖို့ ခွင့်ပြုချက်ကိုလည်း လိုအပ်တယ်။

## ပြန်လည်စမ်းသပ်မှု မူဝါဒ {#retry-policy}

Time trigger တွေက retry policy ကို ရွေးချယ်နိုင်ပါတယ်။ retry policy က set:

- `max_retries`: အစောပိုင်း မအောင်မြင်တဲ့ ပစ်ခတ်မှုအပြီး ပြန်လည်စမ်းသပ်မှု ဘယ်နှစ်ကြိမ်လုပ်ခွင့်ရှိလဲ။
- `retry_after_ms`: ထပ်မံစမ်းသပ်နိုင်ရန်အတွက် Iroha သည် ဘယ်လောက်ကြာကြာ စောင့်ဆိုင်းနေသနည်း။

ထပ်မံစမ်းသပ်ဖို့ ဘတ်ဂျက်ကုန်သွားတဲ့အခါ trigger က မှတ်ပုံတင်မထားဘူး။

## မေးခွန်းများ {#queries}

trigger status ကို စစ်ဆေးဖို့ လက်ရှိ trigger queries တွေကို သုံးပါ။

- [`FindTriggers`](/my/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/my/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/my/reference/queries.md#triggers-contracts-transactions-and-blocks)

နောက်တစ်ချက်ကြည့်ပါ-

- [Event trigger နမူနာ](/my/blockchain/trigger-examples.md)
- [ဖြစ်ရပ်များ](/my/blockchain/events.md)
- [ညွှန်ကြားချက်](/my/blockchain/instructions.md)
- [ခွင့်ပြုချက်များ](/my/blockchain/permissions.md)
