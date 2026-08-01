---
translation_locale: my
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Filters များ {#filters}

event streams တွေကို ကျဉ်းမြောင်းစေပြီး trigger အခြေအနေတွေကို filter လုပ်ပေးပါတယ်။ လက်ရှိထိပ်ဆုံးအဆင့်ဖြစ်စဉ် filter က `EventFilterBox` ဖြစ်ပြီး ဒီဖြစ်ရပ်မိသားစုတွေနဲ့ ကိုက်ညီနိုင်ပါတယ်။

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

`DataEventFilter::Any` လို ကျယ်ပြန့်တဲ့ filter တွေဟာ ရောဂါရှာဖွေရေးအတွက် အသုံးဝင်ပေမဲ့ ဖြစ်ရပ်တိုင်းက trigger သို့မဟုတ် subscriber ကို match လုပ်ဖို့ ကုန်ကျစရိတ်ကို ပေးရတယ်။

## ဒေတာဖြစ်ရပ် စစ်ဆေးခြင်း {#data-event-filters}

`DataEventFilter` သည် စာရင်းအင်း ဒေတာဖြစ်စဉ်များနှင့် ကိုက်ညီသည်။ ၎င်း၏ လက်ရှိကွဲပြားမှုများသည်:

|အပြောင်းအလဲ|အဖြစ်အပျက် မိသားစု|
| --- | --- |
|`Any` |ဘယ်ဒေတာဖြစ်ရပ်မဆို |
|`Peer` |အတန်းတူ ဘဝပတ်ဝန်းကျင် ဖြစ်ရပ်များ |
|`Domain` |Domain lifecycle နှင့် metadata ဖြစ်ရပ်များ |
|`Account` |အကောင့်သက်တမ်း စက်ဝန်း၊ မက်တာဒေတာများ၊ အမည်မဖော်လိုသူများနှင့် လက္ခဏာဖြစ်ရပ်များ |
|`Asset` |အရင်းအမြစ် balance နှင့် metadata ဖြစ်ရပ်များ |
|`AssetDefinition` |Asset Definition Lifecycle၊ မူဝါဒနဲ့ metadata ဖြစ်ရပ်များ |
|`Nft` |NFT ဘဝပတ်ဝန်းကျင်နှင့် metadata ဖြစ်ရပ်များ |
|`Rwa` |Real world asset lifecycle ဖြစ်ရပ်များ |
|`Trigger` |trigger lifecycle နှင့် metadata ဖြစ်စဉ်များ |
|`Role` |Role lifecycle ဖြစ်ရပ်များ |
|`Configuration` |ကွင်းဆက်ပေါ်က ဖွဲ့စည်းမှုဖြစ်ရပ်များ |
|`Executor` |Runtime အကောင်အထည်ဖော်မှု ဖြစ်ရပ်များ |
|`Proof` |အထောက်အထား စစ်ဆေးမှု သက်တမ်းပတ်ဝန်းကျင် ဖြစ်ရပ်များ |
|`Confidential` |လျှို့ဝှက်သော အရင်းအမြစ်ဖြစ်စဉ်များ |
|`VerifyingKey` |Verifying-key မှတ်ပုံတင်ဖြစ်ရပ်များ |
|`RuntimeUpgrade` |Runtime upgrade ဖြစ်ရပ်များ |
|`Soradns` |Directory governance events ကို ဖြေရှင်းပေးပါ |
|`Sorafs` |SoraFS gateway လိုက်နာမှုဖြစ်ရပ်များ |
|`SpaceDirectory` |Space Directory က Lifecycle အဖြစ်အပျက်တွေကို ပြသနေပါတယ်|
|`Escrow` |ပွင့်လင်းမြင်သာသော Native Assets Escrow Lifecycle ဖြစ်ရပ်များ |
|`Offline` |Offline settlement events များ|
|`Oracle` |Oracle feed ဖြစ်ရပ်များ |
|`Social` |ဗိုင်းရပ်စ် လှုံ့ဆော်မှု ဖြစ်စဉ်များ |
|`Bridge` |တံတားပွဲများ |
|`Governance` |အုပ်ချုပ်ရေး feature ကို ဖွင့်ထားပါက Governance event များ |

ကွန်ကရစ်စစ် filter အများစုမှာ optional ID matcher နဲ့ event-set mask ကိုလည်းခွင့်ပြုပါတယ်။ ဥပမာ၊ asset filter တစ်ခုဟာ asset တစ်ခု (သို့) asset events အမျိုးအစားတစ်ခုနဲ့ကိုက်ညီနိုင်ပြီး trigger filter တစ်ခုကတော့ trigger ID နှင့် trigger event set ကိုက်ညီနိုင်ပါတယ်။

## ဘိုက်လိုင်း စစ်ဆေးရေး {#pipeline-filters}

Pipeline Filters သည် block, transaction, merge နှင့် witness events ကဲ့သို့သော စီမံခန့်ခွဲမှုဖြစ်ရပ်များနှင့် ကိုက်ညီသည်။ ၎င်းတို့ကို လုပ်ဆောင်ရေး subscriptions များ၊ block-processing dashboards များနှင့် ledger data objects များအစား pipeline state သို့ တုံ့ပြန်သည့် trigger များအတွက် အသုံးပြုပါ။

## Trigger Filters များ {#trigger-filters}

trigger တွေက သူတို့အခြေအနေကို `EventFilterBox` အဖြစ် သိမ်းဆည်းတယ်။ trigger လုပ်ဆောင်ချက်တစ်ခုမှာလည်း

- အပြီးသတ်လို့ရတဲ့
- ထပ်ကျော့ခြင်း မူဝါဒ
- အာဏာပိုင်စာရင်း
- ရွေးချယ်စရာ Time-Trigger ပြန်လည်စမ်းသပ်မှု မူဝါဒ
- metadata များ

အစပျိုးသူအာဏာပိုင်က အကောင်အထည်ဖော်လို့ရတဲ့အတွက် လိုအပ်တဲ့ ခွင့်ပြုချက်တွေ ရှိဖို့လိုပါတယ်။ ရေရှည် သက်တမ်းရှိတဲ့ အစပျိုးသူတွေ အတွက် ရည်စူးထားတဲ့ နည်းပညာစာရင်းတွေကို ကြိုက်တယ်။

## မေးမြန်းမှု စစ်ဆေးခြင်း {#query-filters}

Query Filters သည် Event Filter များနှင့် သီးခြားဖြစ်သည်။ Iterable queries များသည် predicate နှင့် selector support ကို ဖော်ပြနိုင်သည်။ query-specific typeed filter များကို SDK မှအသုံးပြု၍ filter input သည် query output အမျိုးအစားနှင့် ကိုက်ညီစေရန်။

အောက်ပါအတိုင်းလည်း ကြည့်ပါ။

- [ဖြစ်ရပ်များ](/my/blockchain/events.md)
- [Native Asset Escrow ](/my/blockchain/escrow.md#queries-and-events)
- [အစပျိုးစက်များ ](/my/blockchain/triggers.md)
- [မေးမြန်းချက်များ ](/my/blockchain/queries.md)
- [မေးမြန်းချက် မှတ်တမ်း ](/my/reference/queries.md)
