---
translation_locale: my
translation_source: /blockchain/triggers.md
translation_source_hash: 726e2998ec1439138ef94d3a702049731ce2432f5c52a723ed0c92593de41c1e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# နှိုးစက်များ {#triggers}

trigger တွေက event filter ကို executable action နဲ့ ချိတ်ဆက်ပေးပါတယ်။ event တစ်ခုဟာ trigger ရဲ့ filter နဲ့ ကိုက်ညီတဲ့အခါ Iroha က block execution အစိတ်အပိုင်းအဖြစ် trigger လုပ်ရပ်ကို အကဲဖြတ်တယ်။

## ဖွဲ့စည်းပုံ {#structure}

မှတ်ပုံတင်ထားသော `Trigger` တွင်:

- `id`: a `TriggerId` ကိုဖုံးအုပ်ခြင်း `Name`
- `action`: အကောင်အထည်ဖော်နိုင်သူ၊ အာဏာပိုင်၊ စစ်ဆေးရေး၊ ထပ်ကျော့ခြင်း မူဝါဒ၊ ပြန်လည်စမ်းသပ်မှု မူဝါဒနှင့် မီတာဒေတာများ

လုပ်ဆောင်ချက်မှာ အောက်ပါအချက်တွေ ပါဝင်ပါတယ်။

- `executable`: `Instructions`၊ `ContractCall`၊ `Ivm` သို့မဟုတ် `IvmProved`
- `repeats`: (သို့) `Indefinitely` သို့မဟုတ် `Exactly(n)`
- `authority`: အကောင်အထည်ဖော်နိုင်သောစာရင်းကိုခေါ်ယူသည်
- `filter`: a `EventFilterBox`
- `retry_policy`: အစီအစဉ်ချထားသော အချိန် trigger များအတွက် ရွေးချယ်စရာ ထပ်မံစမ်းသပ်မှု ပြုမူပုံ။
- `metadata`: အလိုလို trigger metadata များ

## အဖြစ်အပျက် စစ်ဆေးခြင်း {#event-filters}

Trigger Conditions က Subscriptions တွေနဲ့ တူတဲ့ Event Filter ပုံစံကို သုံးပါတယ်။ အထက်တန်းအဆင့် Event filter ကတော့

- ပိုက်လိုင်း ဖြစ်ရပ်များ
- ဒေတာဖြစ်ရပ်များ
- အချိန်ဖြစ်ရပ်များ
- trigger execution ဖြစ်ရပ်များ
- အစပျိုးပြီးစီးမှုဖြစ်ရပ်များ

Workflow ကိုက်ညီတဲ့ သေးငယ်ဆုံး filter ကို ကြိုက်တယ်။ Broad filters တွေဟာ ရောဂါရှာဖွေရေးအတွက် အသုံးဝင်ပေမဲ့ block execution အတွင်းမှာ အလုပ်ကို တိုးမြှင့်ပါတယ်။

[ Filters](/my/blockchain/filters.md) ကို လက်ရှိ filter အမျိုးအစားများအတွက် ကြည့်ပါ။

## အချိန်ကို နှိုးဆွပေးခြင်း {#time-triggers}

Time trigger တွေက time event filter ကိုသုံးပါတယ်။ world state view က match time condition ကိုရောက်တဲ့အခါ Iroha က trigger လုပ်ရပ်ကို trigger authority အောက်မှာ အကောင်အထည်ဖော်ပါတယ်။ Time trigger ဟာ အောက်ဖော်ပြထားတဲ့ retry policy ကို အသုံးပြုနိုင်တဲ့ trigger အမျိုးအစားပါ။

## ထပ်ကျော့ခြင်း {#repetition}

`Repeats::Indefinitely` သည် မှတ်ပုံတင်ခြင်းမရှိတဲ့အထိ trigger ကို တက်ကြွစေတယ်။

`Repeats::Exactly(n)` က trigger ကို fixed number of times fire လုပ်ခွင့်ပေးတယ်။ count ပြီးသွားတဲ့အခါ အလားတူအပြုအမူကို ထပ်မံလိုအပ်ရင် trigger အသစ်တစ်ခုကို မှတ်ပုံတင်ပါ။

## အာဏာနှင့် ခွင့်ပြုချက်များ {#authority-and-permissions}

trigger authority ဆိုသည်မှာ executable ကိုခေါ်ယူရန်အသုံးပြုသောစာရင်းဖြစ်သည်။ သက်တမ်းရှည် trigger များအတွက် သီးသန့်နည်းပညာစာရင်းကို အသုံးပြုပါကလိုအပ်သည့်ခွင့်ပြုချက်များကို operator ၏ကိုယ်ပိုင်စာရင်းမှ ရှင်းလင်းစွာခွဲခြားထားသည်။

အာဏာပိုင်သည် စီမံခန့်ခွဲနိုင်သော ညွှန်ကြားချက်များ သို့မဟုတ် စာချုပ်ခေါ်ဆိုမှုတွင်လိုအပ်သည့် ခွင့်ပြုချက်များကို လိုအပ်သည်။ trigger ကိုမှတ်ပုံတင်သည့်အကောင့်သည် activated runtime validator တွင် trigger များကို မှတ်ပုံတင်ရန် ခွင့်ပြုချက်ကိုလည်းလိုအပ်သည်။

### Data-trigger အရွယ်အစားနှင့် စွမ်းဆောင်ရည် {#data-trigger-scope-and-capacity}

သာမန်ဒေတာ trigger တစ်ခုက ၎င်း၏ filter ကို trigger အာဏာပိုင်ပိုင်ပိုင်ဆိုင်သည့် တိကျသော အကြောင်းအရာတစ်ခုနှင့် ချိတ်ဆက်ရမည်။ Account filters များသည် ထိုတိကျတဲ့ account ကိုအမည်ပေးရပါမည်။ Asset, asset definition, domain, NFT, RWA, `Any` အာဏာပိုင်ပိုင်ပိုင်ဆိုင်တဲ့ တိကျတဲ့ အဖွဲ့အစည်းတစ်ခုရဲ့ နာမည်ကိုလည်း trigger filter တွေက သတ်မှတ်ပေးရပါမယ်။ ချိတ်ဆက်မထားတဲ့ match တစ်ခု၊ နိုင်ငံခြားအရာရှိတစ်ခုနဲ့ system (သို့) governance event မိသားစုတွေဟာ သာမန် account scoped trigger တွေ မဟုတ်ဘူး။

`CanRegisterGlobalDataTrigger` ကို လွှတ်တော်သာ ထောက်ပံ့နိုင်သည်။ ထောက်ပံ့ငွေကို တိကျတဲ့ အကောင့်တစ်ခုတည်းမှာ တိုက်ရိုက် သိမ်းဆည်းထားပြီး တူညီသော တိကျတဲ့ trigger အာဏာရှိပြီး ပြန်လည်သိမ်းဆည်းနိုင်သည် စာရင်းတစ်ခုက အခြားအာဏာပိုင်အတွက် trigger ကို မှတ်ပုံတင်တဲ့အခါမှာ `CanRegisterTrigger` ကင်းလွတ်တာမဟုတ်ဘူး။

Consensus က အာဏာပိုင်တစ်ဦးအတွက် အများဆုံး ဒေတာ trigger ၆၄ ခုနှင့် ကမ္ဘာတစ်လွှားမှာ ဒေတာ triggers ၄,၀၉၆ ခုကို လက်ခံထားသည်။ တိကျသောဘာသာရပ်နှင့်ဖြစ်စဉ်မိသားစုအညွှန်းကိန်းများက ပြဌာန်းသူများကို တရားဝင်မှတ်သားရေး အစဉ်အတိုင်း ရွေးချယ်သည်။ ရင်းနှီးမြှုပ်နှံမှုတစ်ခုတည်းက ဒေတာ trigger firings အပါအဝင် cascades အများဆုံး 256 ဖြစ်စေနိုင်သည်။ indexed filter စစ်ဆေးခြင်း, firing, native ညွှန်ကြားချက်နှင့် VM ညွှန်ပြချက်တိုင်းမှာ same block gas ဘတ်ဂျက်ကိုသုံးစွဲသည်။

Trigger execution သည် match event ကို emit လုပ်ခဲ့သည့် ငွေပေးချေမှုနှင့်အတူ အက်တမ်ဖြစ်ပါသည်။ ခွင့်ပြုထားသော trigger တစ်ခုသည် ကျရှုံးသွားပါက၊ ၎င်း၏ firing သို့မဟုတ် execution နက်ရှိုင်းမှုသတ်မှတ်ချက်ကိုကျော်လွှားပါက (သို့) ဓာတ်ငွေ့ထုတ်လွှတ်ပါက, Iroha သည် trigger သက်ရောက်မှုများနှင့် မူလဆောင်ရွက်မှု နှစ်ခုစလုံးကိုပြန်လည်ဖြန့်ဖြူးသည်။

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

- [အဖြစ်အပျက် trigger ဥပမာ ](/my/blockchain/trigger-examples.md)
- [ဖြစ်ရပ်များ](/my/blockchain/events.md)
- [ညွှန်ကြားချက်များ ](/my/blockchain/instructions.md)
- [ခွင့်ပြုချက်များ ](/my/blockchain/permissions.md)
