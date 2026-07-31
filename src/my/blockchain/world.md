---
translation_locale: my
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ကမ္ဘာကြီး {#world}

`World` ဆိုသည်မှာ အခြားအဖွဲ့အစည်းများပါဝင်သော ကမ္ဘာလုံးဆိုင်ရာ အဖွဲ့အစည်းဖြစ်သည်။ `World` သည် အောက်ပါအရာများကို ပြုလုပ်ထားသည်။

- Iroha [configuration parameters](/my/guide/configure/client-configuration.md)
- မှတ်ပုံတင်ထားတဲ့ အဖော်များ
- မှတ်ပုံတင် domain များ
- မှတ်ပုံတင်ထားသော [ trigger များ](/my/blockchain/triggers.md)
- မှတ်ပုံတင်ထားသော [အခန်းကဏ္ဍများ ](/my/blockchain/permissions.md#permission-groups-roles)
- မှတ်ပုံတင်ထားသော [ခွင့်ပြုလက်မှတ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ ](/my/blockchain/permissions.md#permission-tokens)
- အကောင့်အားလုံးအတွက် ခွင့်ပြုချက် လက်မှတ်များ
- [Runtime validator တွေရဲ့ ချိတ်ဆက်ချက် ](/my/blockchain/permissions.md#runtime-validators)

Domain များ၊ peers များ သို့မဟုတ် role များကို မှတ်ပုံတင်ထားခြင်း (သို့မဟုတ်) မှတ်ပုံတင်မထားခြင်းတွင် `World` မှတ်ပုံတင်ကို ဖျက်သိမ်းခြင်းရဲ့ ရည်မှန်းချက်ပါ။ [ညွှန်ကြားချက်](/my/blockchain/instructions.md).

## ကမ္ဘာ့အမြင် (WSV) {#world-state-view-wsv}

World State View သည် လက်ရှိ blockchain အခြေအနေ၏ မှတ်ဉာဏ်တွင်း ကိုယ်စားပြုမှုဖြစ်သည်။ ၎င်းတွင် `World`, ကတိပြုထားတဲ့ block hashes, transaction indexes နှင့်လက်ရှိခေတ်အတွက်ရွေးချယ်သော peers တို့ပါဝင်သည်။ အပြည့်အဝ block payload များကို Kura မှရယူထားသည်အစားပြောင်းလဲနိုင်သော WSV ဒေတာအဖြစ် duplicated လုပ်ခြင်း။

WSV ဆိုသည်မှာ မေးမြန်းချက်များကို ဖတ်ရှုပြီး ဘလော့ကို အကောင်အထည်ဖော်သည့် အခြေအနေဖြစ်သည်။ ၎င်းသည် အမှန်တရား၏ ရေရှည်တည်တံ့သော အရင်းအမြစ်မဟုတ်ပေ။ တည်တံ့သောသမိုင်းကို [Kura](#kura-storage) တွင် သိမ်းထားသည်။ WSV ကို Kura ဘလော့ကဒ်များမှ ပြန်လည်တည်ဆောက်နိုင်သည် (သို့) အခြေအနေ snapshot မှ load လုပ်ပြီးနောက် ပိုမိုသစ်သော Kura ဘလော့များကို playback ဖြင့်ဖမ်းယူနိုင်သည်။

### WSV ရဲ့ ခြေရာတွေက ဘာလဲ။ {#what-the-wsv-tracks}

WSV သည် `World` အရာဝတ္ထုထက် ပိုကျယ်ပြန့်ပြီး လက်တွေ့တွင် အောက်ပါအတိုင်းပါဝင်သည်-

- `World`: parameters, peers, domains, accounts, assets, NFTs, roles, permissions, triggers, executor data, and other registered data-model objects
- commited block hashs နှင့် နောက်ဆုံး commited height
- မေးမြန်းချက်များနှင့် လက်ခံစာရင်းများတွင် အသုံးပြုသော ငွေလဲလှယ်မှုမှ ဘလော့ကို သတ်မှတ်သည့် အညွှန်းကိန်းများ
- လက်ရှိနှင့် အရင်က သဘောတူညီချက်ဖြင့် အသုံးပြုသော commit topology
- commited blocks များမှ ရယူထားသော in-memory index များ၊ ဥပမာ data availability commitments, receipt cursors, pin intent နှင့် query projection markers တို့။
- deterministic block execution အတွက် လိုအပ်တဲ့ runtime configuration snapshots များ၊ ဥပမာ cryptography, governance, pipeline, content, settlement နဲ့ Nexus setting တွေ။

မေးမြန်းချက်များတွင် ပုံမှန်အားဖြင့် ဤဖွဲ့စည်းမှုများကို ဖတ်ခြင်းသာ `StateView` ရရှိသည်။ ကြည့်ရှုမှုကမေးမြန်းမှု အကောင်အထည်ဖော်ရန်အတွက်ညီညွတ်သော snapshot ဖြစ်သည်; ၎င်းသည် WSV ၏ တိုက်ရိုက်ပြောင်းလဲမှုကိုမခွင့်ပြုပါ။

### WSV ပြောင်းလဲပုံ {#how-the-wsv-changes}

WSV အပြောင်းအလဲများကို ၎င်းတို့မပြုလုပ်မီ အဆင့်သတ်မှတ်ထားသည်။ ဘလော့က အကောင်အထည်ဖော်မှုသည် ဘလော့စကပါအခြေအနေ overlay ကိုဖန်တီးပြီး လက်ခံသော ငွေပေးချေမှုတစ်ခုစီသည် ၎င်း၏ညွှန်ကြားချက်များကို transaction-scoped overlay တွင်အသုံးပြုသည်။ ထိုငွေပေးချေခြင်းများမှခေါ်ယူသည့်ဒေတာ trigger များကို same block context ထဲတွင် run လုပ်ပါသည်။ အချိန် trigger တွေကို ဘလော့ကအတွက် ငွေကြေးဆိုင်ရာ သက်ရောက်မှုအပြီး အကဲဖြတ်ပေးပါတယ်။

Consensus commits a block အပြီးမှာ peer က Kura ထဲက committed block ကို ပထမဦးဆုံး sequence လုပ်တယ်။ ဒီ sequence step ကျရှုံးရင် WSV ကို ရှေ့ဆက်မသွားတော့ဘဲ consensus loop က block ရဲ့ payload ကို retries (သို့) sequence လုပ်ပါတယ်။ Block ကို Kura ရဲ့ queue ထဲမှာ လက်ခံတဲ့အခါ Iroha က execution နောက်ပိုင်း block effects တွေကို အသုံးချပြီး derived index တွေကို update လုပ်ပြီး state-view lock အောက်မှာ အဆင့်လိုက် WSV အပြောင်းအလဲတွေကို commit ပြုလုပ်ပါတယ်။ ဒါက စာဖတ်သူတွေကို တစ်စိတ်တစ်ပိုင်း commit လုပ်ထားတဲ့ block ကို သတိမထားမိစေတာပါ။

Consensus-critical rule က တူညီတဲ့ WSV ကိုတူညီတဲ့ commited blocks တွေကနေရောက်ရှိဖို့လိုတာပါ။ WSV ဒေတာ bypass ညွှန်ကြားချက်တွေကို ဒေသတွင်း ပြင်ဆင်မှု တိုက်ရိုက်လုပ်ပြီး validation (သို့မဟုတ်) replay လုပ်နေစဉ် တူညီမှုမရှိစေမှာပါ။

### Startup နှင့် RePlay {#startup-and-replay}

Start လုပ်တဲ့အခါ Iroha က Kura ကို အစပြုပြီး သိမ်းထားတဲ့ block အမြင့်ကို သင်ယူပါတယ်။ ပြီးရင် state snapshot ကို load လုပ်ဖို့ကြိုးစားတယ်။ snapshot မရှိဘူးဆိုရင် (သို့) recoveryable အဖြစ် reject လုပ်လိုက်ရင် Iroha ဟာ initial state ကို ဖန်တီးပြီး commit blocks တွေကို Kura မှ replay လုပ်ပေးပါတယ်။ Kura နောက်မှာရှိတဲ့ snapshot ကို valid လုပ်ထားရင် ပျောက်နေတဲ့ အမြင့်အကွာအဝေးကိုပဲ ပြန်လည်ရိုက်ကူးပေးပါတယ်။

Replay သည် သိမ်းထားသော block တစ်ခုစီကို validates, ထိုအမြင့်အတွက် commit roster ကိုပြန်လည်ဖန်တီးသည်, WSV သို့ block သက်ရောက်မှုများကိုသတ်မှတ်ပြီးရလဒ်အခြေအနေကို committed လုပ်သည်။ ဆိုလိုသည်မှာ Kura သည် WSV အတွက်ပြန်လည်ထူထောင်ရေးလမ်းကြောင်းဖြစ်သည်၊ snapshots သည်ကွင်းဆက်တစ်ခုလုံးကို playback မလုပ်စေသည့်ကောင်းမွန်ခြင်းဖြစ်သည်။

## Kura သိုလှောင်ခြင်း {#kura-storage}

Kura သည် Iroha ၏ တည်ငြိမ်သော Block Storage ဖြစ်သည်။ ၎င်းသည် လက်မှတ်ထိုးထားသော block များနှင့် ပြန်လည်ထူထောင်ရေး metadata များကို သိမ်းဆည်းသည်။ WSV ၏ ဒုတိယပြောင်းလဲနိုင်သော copy ကို မသိမ်းဆည်းပါ။

Kura သိုလှောင်မှုကို [`kura.store_dir`](/my/reference/peer-config/params.md#param-kura-store-dir) တွင် root လုပ်ထားသည်။ ထို root အတွင်းတွင် block ဒေတာကို lane သို့မဟုတ် segment သို့ခွဲခြားထားသည်။ segment အတွက် အဓိကဖိုင်များမှာ:

|လမ်းကြောင်း|ရည်ရွယ်ချက် |
| --- | --- |
|`blocks/<segment>/blocks.data` |Norito ဖွဲ့စည်းထားသော လက်မှတ်ထိုးထားတဲ့ အစုအဝေး အသုံးဝင်ပစ္စည်းများ။ |
|`blocks/<segment>/blocks.index` |Fixed-sized `(start, length)` entries that map block height to bytes in `blocks.data`. |
|`blocks/<segment>/blocks.hashes` |အမြန်ရှာဖွေခြင်းနှင့် စတင်စစ်ဆေးမှုအတွက် အမြင့်အလိုက် hash ကိုပိတ်ပါ။ |
|`blocks/<segment>/blocks.count.norito` |ခိုင်ခံ့တဲ့ commit marker ကတော့ block index entries တွေကို အသုံးပြုဖို့ လုံခြုံမှုရှိတာကို မှတ်တမ်းတင်ပါတယ်။ |
|`blocks/<segment>/da_blocks/` |`blocks.data` အပြင်မှာ ထိန်းသိမ်းထားသော block payloads ကို disk-budget enforcement သည် hot ဖိုင်မှအဟောင်းအလောင်းများကိုပြောင်းတဲ့အခါတွင်။ |
|`blocks/<segment>/pipeline/sidecars.norito` နှင့် `sidecars.index` |ပိုက်လိုင်း ပြန်လည်ထူထောင်ရေး ဘက်ထရီတွေကို ဘလော့ကီအမြင့်နဲ့ ခလုတ်တပ်ထားပါတယ်။ |
|`blocks/<segment>/pipeline/roster_sidecars.norito` နှင့် `roster_sidecars.index` |Block sync နဲ့ replay တွေမှာ အသုံးပြုတဲ့ မကြာသေးခင်က commit-roster sidecar တွေပါ။ |
|`merge_ledger/<segment>.log` |ကတိပြုထားတဲ့ ဘလော့တွေနဲ့ ညှိနှိုင်းထားတဲ့ ပေါင်းစပ်စာရင်းဝင်ငွေတွေ။|
|`commit-rosters.norito` |မကြာသေးခင်က ဘလော့များအတွက် ကတိပြုချက် လက်မှတ်များနှင့် အတည်ပြုသူ စစ်ဆေးရေးဂိတ်များကို ထိန်းသိမ်းထားသည်။ |

Kura သည်ကွင်းဆက်အတွက် Compact in-memory vector ကိုထိန်းသိမ်းထားသည် - အမြင့်တိုင်းမှာ block hash နှင့် optionally, block body တို့ရှိသည်။ genesis block သည် cached ဖြစ်နေဆဲဖြစ်ပြီးနောက်ဆုံး [ `kura.blocks_in_memory`](/my/reference/peer-config/params.md#param-kura-blocks-in-memory) non-genesis blocks များသည်သူတို့၏ခန္ဓာကိုယ်များကိုမှတ်ဉာဏ်တွင် ထိန်းသိမ်းထားပါသည်။ ပိုကြီးမားတဲ့ ဘလော့ကော်တွေကို မှတ်ဉာဏ်ကနေ ပစ်ချပြီး လိုအပ်တဲ့အခါ Kura ဖိုင်တွေကနေ ပြန်သွင်းတယ်။

အစပျိုးစဉ်တွင် `strict` mode သည် block payload များမှ သိမ်းဆည်းထားသော blocks ကို validates နှင့်လိုအပ်ပါက hash ဖိုင်ကို rewrites။ `fast` mode သည်သိမ်းဆည်းထားသည့် hash / index metadata မှစ၍ ထို metadata ကွဲပြားမှုရှိပါက တင်းကျပ်သော အစပျိုးခြင်းသို့ ကျဆင်းသည်။ Kura က အညစ်အကြေးရှိတဲ့ အမြီးကို ရှာတွေ့ရင် နောက်ဆုံး စစ်ဆေးထားတဲ့ ဘလော့ကွင်းအထိ သိုလှောင်မှုကို ချိုးချိုးတယ်။

Kura သည်နောက်ခံစာရေးသူမှတစ်ဆင့်ပုံးအသစ်များကိုရေးသားသည်။ စာရေးသူသည်ပုံးအကူအညီများ၊ ဟက်ရှ်များနှင့်ညွှန်းကိန်းဝင်မှုများကိုထည့်သွင်းပြီး ဖွဲ့စည်းထားသော fsync မူဝါဒအရ ရေရှည်ရေတွက်မှုမှတ်တံဆိပ်ကိုတိုးတက်စေသည်။ Disk-budget enforcement လုပ်တဲ့အခါ Kura ဟာ အငြိမ်းစားယူထားတဲ့ segment တွေကို ရှင်းလင်းနိုင်တယ် (သို့) ဟက်ရှ်တွေနဲ့ index entries တွေကို validation နဲ့ search အတွက်ရရှိအောင် ထိန်းထားရင်း older block bodies ကို `da_blocks/` ထဲကို ပစ်ထုတ်နိုင်ပါတယ်။
