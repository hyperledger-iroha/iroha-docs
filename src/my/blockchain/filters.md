---
translation_locale: my
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# စစ်ဆေးခြင်း {#filters}

ပြတ်တောက်တဲ့ ဖြစ်ရပ်စီးကြောင်းတွေကို စစ်ဆေးပြီး trigger အခြေအနေတွေပါ။ လက်ရှိထိပ်တန်းအဆင့်
ဖြစ်ရပ် filter ကို `EventFilterBox`, ဒီဖြစ်ရပ် မိသားစုတွေနဲ့ ကိုက်ညီနိုင်ပါတယ်

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

Workflow ကိုက်ညီတဲ့ သေးငယ်ဆုံး filter ကိုသုံးပါ။
`DataEventFilter::Any` ရောဂါရှာဖွေရေးအတွက် အသုံးဝင်ပေမဲ့ ဖြစ်ရပ်တိုင်းကို ဖန်တီးပေးတယ်။
trigger သို့မဟုတ် subscriber ကို match လုပ်ခြင်းအတွက် ကုန်ကျစရိတ်ကို ပေးပါ။

## ဒေတာဖြစ်ရပ် စစ်ဆေးခြင်း {#data-event-filters}

`DataEventFilter` လက်ရှိ ဗားရှင်းများမှာ:

| အပြောင်းအလဲ | အဖြစ်အပျက် မိသားစု |
| --- | --- |
| `Any` | ဘယ်ဒေတာဖြစ်ရပ်မဆို |
| `Peer` | အဖော်များ၏ ဘဝပတ်လည်ဖြစ်စဉ်များ |
| `Domain` | ဒိုမင်သက်တမ်း စက်ဝန်းနှင့် metadata ဖြစ်ရပ်များ |
| `Account` | Account lifecycle၊ metadata၊ alias နဲ့ identity events တွေ |
| `Asset` | အရင်းအမြစ်ညီမျှမှုနှင့် မီတာဒေတာဖြစ်ရပ်များ |
| `AssetDefinition` | Asset Definition Lifecycle၊ မူဝါဒနှင့် metadata ဖြစ်ရပ်များ |
| `Nft` | NFT ဘဝပတ်ဝန်းကျင်နှင့် metadata ဖြစ်ရပ်များ |
| `Rwa` | လက်တွေ့ကမ္ဘာက အရင်းအမြစ်သက်တမ်းပတ်လည်ဖြစ်ရပ်များ |
| `Trigger` | trigger lifecycle နှင့် metadata ဖြစ်စဉ်များ |
| `Role` | အခန်းကဏ္ဍ သက်တမ်း စက်ဝန်း ဖြစ်ရပ်များ |
| `Configuration` | ချိတ်ဆက်ထားသော ကွန်ပြူတာဖြစ်ရပ်များ |
| `Executor` | Runtime Executor ဖြစ်ရပ်များ |
| `Proof` | အထောက်အထား စစ်ဆေးမှု သက်တမ်းပတ်ဝန်းကျင် ဖြစ်ရပ်များ |
| `Confidential` | လျှို့ဝှက်သော အရင်းအမြစ်ဖြစ်စဉ်များ |
| `VerifyingKey` | Verifying-key မှတ်ပုံတင်ဖြစ်ရပ်များ |
| `RuntimeUpgrade` | Runtime upgrade ဖြစ်ရပ်များ |
| `Soradns` | Resolver directory အုပ်ချုပ်ရေးဖြစ်ရပ်များ |
| `Sorafs` | SoraFS gateway compliance ဖြစ်ရပ်များ |
| `SpaceDirectory` | အာကာသစာရင်းမှာ သက်တမ်းပတ်ဝန်းကျင်ဖြစ်ရပ်တွေ ပေါ်လွင်နေပါတယ် |
| `Escrow` | ပွင့်လင်းမြင်သာသော Native Assets Escrow Lifecycle ဖြစ်ရပ်များ |
| `Offline` | Offline settlement events များ |
| `Oracle` | Oracle feed ဖြစ်ရပ်များ |
| `Social` | ဗိုင်းရပ်စ် လှုံ့ဆော်မှု ဖြစ်စဉ်များ |
| `Bridge` | တံတားပွဲများ |
| `Governance` | အုပ်ချုပ်ရေး feature ကို ဖွင့်ထားပါက အုပ်ချုပ်မှုဖြစ်ရပ်များ |

ဘိလပ်မြေစစ်ဆေးမှု အများစုက ရွေးချယ်စရာတစ်ခုကိုလည်းခွင့်ပြုတယ်။ ID Match နဲ့ Event Set Mask တစ်ခုပါ။
ဥပမာ၊ အရင်းအမြစ်စစ်ဆေးမှုတစ်ခုဟာ အရင်းအမြစ်ကို (သို့) ရင်းနှီးမြှုပ်နှံမှုဖြစ်စဉ်တန်းအစားကို ကိုက်ညီနိုင်ပါတယ်။
တချိန်တည်းမှာ trigger filter က trigger နဲ့ ကိုက်ညီနိုင်ပါတယ်။ ID ပြီးတော့ trigger event set တစ်ခုပါ။

## ဘိုက်လိုင်း စစ်ဆေးမှု {#pipeline-filters}

Pipeline Filters တွေဟာ Block, Transaction, Merge လို Processing ဖြစ်ရပ်တွေနဲ့ ကိုက်ညီပါတယ်။
အလုပ္အကိုင္ subscriptions, block-processing အတွက် သုံးပါ။
လက်ကိုင်ချပ်များနှင့် pipeline state သို့ တုံ့ပြန်မှုရှိစေသော trigger များကို ledger ဒေတာအစား
အရာဝတ္ထုတွေ။

## ထရီဂါ filter များ {#trigger-filters}

trigger တွေက သူတို့ရဲ့ အခြေအနေကို `EventFilterBox`. အစပျိုးမှုတစ်ခုလည်း
ဆိုင်များ:

- အကောင်အထည်ဖော်နိုင်သော
- အကြိမ်ကြိမ်ပြုလုပ်ခြင်း မူဝါဒ
- အာဏာပိုင်စာရင်း
- ရွေးချယ်စရာ Time-Trigger ပြန်လည်စမ်းသပ်မှု မူဝါဒ
- metadata များ

trigger authority မှာ executable က တောင်းဆိုတဲ့ ခွင့်ပြုချက်တွေ ရှိဖို့လိုပါတယ်။
သက်တမ်းရှည်တဲ့ trigger တွေအတွက် ရည်စူးထားတဲ့ နည်းပညာ အကောင့်တွေကို ပိုနှစ်သက်တယ်။

## မေးမြန်းမှု စစ်ဆေးခြင်း {#query-filters}

Query Filters တွေဟာ Event Filter တွေနဲ့ ကွဲပြားပါတယ်။ Iterable queries တွေက
ကြေညာချက်နှင့်ရွေးချယ်သူအားထောက်ပံ့ပါ။ SDK
ဒီတော့ filter input က query output type နဲ့ ကိုက်ညီပါတယ်။

အောက်ပါအတိုင်းလည်း ကြည့်ပါ။

- [ဖြစ်ရပ်များ](/my/blockchain/events.md)
- [Native Asset Escrow](/my/blockchain/escrow.md#queries-and-events)
- [နှိုးဆော်မှု](/my/blockchain/triggers.md)
- [မေးခွန်းများ](/my/blockchain/queries.md)
- [မေးမြန်းချက် မှတ်ပုံတင်](/my/reference/queries.md)
