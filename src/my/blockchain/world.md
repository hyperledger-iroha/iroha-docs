---
translation_locale: my
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ကမ္ဘာကြီး {#world}

`World` ဆိုသည်မှာ အခြားအဖွဲ့အစည်းများပါဝင်သော ကမ္ဘာလုံးဆိုင်ရာ အဖွဲ့အစည်းဖြစ်သည်။ `World` သည် အောက်ပါအရာများကို ပြုလုပ်ထားသည်။

- Iroha [ပြင်ဆင်သတ်မှတ်မှု ပါရာမီတာများ](/my/guide/configure/client-configuration.md)
- မှတ်ပုံတင်ထားသော ကွန်ရက် အဖော်များ
- မှတ်ပုံတင် domain များ
- မှတ်ပုံတင်ထားသော [trigger များ](/my/blockchain/triggers.md)
- မှတ်ပုံတင်ထားသော [ကဏ္ဍများ](/my/blockchain/permissions.md#permission-groups-roles)
- မှတ်ပုံတင်ထားသော [permission token အနက်ဖွင့်ချက်များ](/my/blockchain/permissions.md#permission-tokens)
- အကောင့်အားလုံးအတွက် ခွင့်ပြုချက် လက်မှတ်များ
- [ဆော့ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင် validator တွေရဲ့ ချိတ်ဆက်ချက်](/my/blockchain/permissions.md#runtime-validators)

Domain များ၊ network peers များ သို့မဟုတ် role များကို မှတ်ပုံတင်ထားခြင်း (သို့မဟုတ်) မမှတ်ပုံတင်ထားသည့်အခါ `World` သည် (un) register [ညွှန်ကြားချက်](/my/blockchain/instructions.md) ၏ ရည်မှန်းချက်ဖြစ်သည်။

## ကမ္ဘာ့အမြင် (WSV) {#world-state-view-wsv}

World State View သည် လက်ရှိ blockchain အခြေအနေ၏ မှတ်ဉာဏ်အတွင်းမှ ကိုယ်စားပြုမှုဖြစ်သည်။ ၎င်းတွင် `World`, နောက်ဆုံးသတ်မှတ်ထားသော block cryptographic hashes, transaction indexes နှင့်လက်ရှိခေတ်အတွက်ရွေးချယ်ထားသော network peers တို့ပါဝင်သည်။ Full block payloads တွေကို Kura ကနေ ဖြန့်ချိပေးရမယ့်အစား ပြောင်းလဲနိုင်တဲ့ WSV ဒေတာအဖြစ် duplicated လုပ်ပေးတယ်။

WSV က query တွေကို ဖတ်ပြီး block execution တွေ ပြောင်းသွားတဲ့ အခြေအနေပါ။ ဒါဟာ အမှန်တရားရဲ့ တည်တံ့တဲ့ အရင်းအမြစ်မဟုတ်ပါဘူး။ တည်တံ့သော သမိုင်းကို [Kura](#kura-storage) မှာ သိမ်းထားတယ်။ WSV ကို Kura ဘလော့ကများမှ ပြန်လည်တည်ဆောက်နိုင်သည် (သို့) State point-in-time data view မှထည့်သွင်းနိုင်ပြီးနောက် ပိုမိုသစ်သော Kura ဘလော့များကို ပြန်လည်ကစားခြင်းဖြင့် ဖမ်းယူနိုင်သည်။

### WSV ရဲ့ ခြေရာတွေက ဘာလဲ။ {#what-the-wsv-tracks}

WSV သည် `World` အရာဝတ္ထုထက် ပိုကျယ်ပြန့်ပြီး လက်တွေ့တွင် အောက်ပါအတိုင်းပါဝင်သည်-

- `World` - ပါရာမီတာများ၊ peer များ၊ domain များ၊ အကောင့်များ၊ ပိုင်ဆိုင်မှုများ၊ NFTs၊ role များ၊ ခွင့်ပြုချက်များ၊ trigger များ၊ executor ဒေတာနှင့် အခြား မှတ်ပုံတင်ထားသော ဒေတာမော်ဒယ် အရာများ
- နောက်ဆုံးသတ်မှတ်ထားသော block cryptographic hashs နှင့် နောက်ဆုံးသတ်မှတ်ထားတဲ့ အမြင့်
- Query တွေနဲ့ Protocol Result Record တွေမှာ အသုံးပြုတဲ့ transaction-to-block index တွေ
- လက်ရှိနှင့် အရင်က သဘောတူညီချက်ဖြင့် အသုံးပြုသော ပရိုတိုကောလီးယား နောက်ဆုံးသတ်မှတ်မှု ထိပ်တန်းစနစ်
- ဒေတာရရှိနိုင်မှု ကတိပြုတန်ဖိုးများ၊ receipt cursor များ၊ pin ရည်ရွယ်ချက်များနှင့် query ကိုယ်စားပြုမြင်ကွင်း အမှတ်အသားများကဲ့သို့ commit လုပ်ထားသော ဘလော့ခ်များမှ ဆင်းသက်ရရှိသော မှတ်ဉာဏ်တွင်း အညွှန်းများ
- Software execution environment configuration deterministic block execution အတွက် လိုအပ်တဲ့ point-in-time data views တွေကို၊ ဥပမာ cryptography, governance, software processing workflow, content, financial transaction settlement နဲ့ Nexus setting တွေကို

မေးမြန်းချက်များတွင် ပုံမှန်အားဖြင့် ဤဖွဲ့စည်းမှုများကို ဖတ်ခြင်းသာ `StateView` ကို ရရှိသည်။ ကြည့်ရှုမှုက မေးမြန်းမှု အကောင်အထည်ဖော်ရန်အတွက် အချိန်ကာလအတွင်း အချက်အလက် အမြင်တစ်ခုဖြစ်သည်၊ ၎င်းသည် WSV ၏ တိုက်ရိုက်ပြောင်းလဲမှုကို မခွင့်ပြုပါ။

### WSV ပြောင်းလဲပုံ {#how-the-wsv-changes}

WSV ပြောင်းလဲမှုများကို commit မလုပ်မီ ယာယီအဆင့်တွင် စုစည်းထားသည်။ ဘလော့ခ်လုပ်ဆောင်မှုက ဘလော့ခ်အတွင်း အသုံးပြုမည့် အခြေအနေထပ်ဆင့်အလွှာကို ဖန်တီးပြီး လက်ခံထားသော transaction တစ်ခုစီက ၎င်း၏ ညွှန်ကြားချက်များကို transaction အတွင်း အသုံးပြုမည့် ထပ်ဆင့်အလွှာတွင် အသုံးချသည်။ ထို transaction များ ခေါ်ယူသော ဒေတာ trigger များသည် တူညီသော ဘလော့ခ်အကြောင်းအရာအတွင်း လုပ်ဆောင်သည်။ အချိန် trigger များကို ဘလော့ခ်၏ transaction အကျိုးသက်ရောက်မှုများပြီးမှ အကဲဖြတ်သည်။

သဘောတူညီချက်က ဘလော့ကို အဆုံးသတ်ပြီးနောက်၊ ကွန်ရက် peer က နောက်ဆုံးသတ်မှတ်ထားတဲ့ ဘလော့ကို ပထမဦးဆုံးထည့်သွင်းတယ်။ Kura. ဒီချိတ်ဆက်မှု ခြေလှမ်း ကျရှုံးရင် WSV ဘလော့ကို လက်ခံပြီးနောက် အညီအမျှ loop က block payload ကို retries သို့မဟုတ် requesters လုပ်ပါတယ်။ Kura တန်းစီမှာ၊ Iroha အကောင်အထည်ဖော်ပြီးနောက် Block Effect တွေကို အသုံးချခြင်း၊ ထုတ်ယူထားတဲ့ index တွေကို update လုပ်ခြင်းနဲ့ အဆင့်သတ်မှတ်ထားတဲ့ WSV state-view lock အောက်မှာ ပြုလုပ်တဲ့ အပြောင်းအလဲတွေက စာဖတ်သူတွေကို တစ်စိတ်တစ်ပိုင်း ပြီးဆုံးထားတဲ့ ဘလော့ကို သတိမထားမိစေတယ်။

သဘောတူညီချက်အရေးကြီးတဲ့ စည်းမျဉ်းက ကွန်ရက် peers တွေဟာ နောက်ဆုံးသတ်မှတ်ထားတဲ့ ဘလော့တွေထဲက WSV ကိုပဲရောက်ရှိဖို့လိုတာပါ။ ဒေတာ bypass ညွှန်ကြားချက်တွေကို WSV ကို ဒေသတွင်းအပြောင်းအလဲ တိုက်ရိုက်လုပ်ပြီး validation (သို့မဟုတ်) replay လုပ်နေစဉ်မှာ ကွန်ရက် peer တွေ သဘောမတူစေပါလိမ့်မယ်။

### Startup နှင့် RePlay {#startup-and-replay}

Start မှာ Iroha က Kura ကို အစပြုပြီး သိမ်းဆည်းထားသော block အမြင့်ကို သိရှိသည်။ ထို့နောက် state snapshot ကို load လုပ်ရန်ကြိုးပမ်းတယ်။ point-in-time data view မရှိပါက (သို့) point-in time data view ကို recoverable အဖြစ် ပယ်ချပါက။ Iroha သည်စတင်အခြေအနေကိုဖန်တီးပြီး Kura မှ နောက်ဆုံးသတ်မှတ်ထားသောဘလော့များကိုပြန်လည်ဖြည့်သည် point-in-time ဒေတာမြင်ကွင်းတစ်ခု မှန်ကန်သော်လည်း Kura နောက်မှာရှိပါက ပျောက်ဆုံးသည့်အမြင့်အတန်းသာ ပြန်လည်ဖြည့်သည်။

Replay သည် သိုလှောင်ထားသော ဘလော့တစ်ခုစီကို အတည်ပြုပြီး ထိုအမြင့်အတွက် ပရိုတိုကောအဆုံးသတ်ရေးစာရင်းကို ပြန်လည်ဖန်တီးကာ WSV သို့ဘလော့အကျိုးဆက်များကို သက်ရောက်စေပြီး ရလဒ်ဖြစ်ပေါ်သောအခြေအနေကို ပြီးမြောက်စေသည်။ ဆိုလိုတာက Kura ဟာ WSV အတွက် ပြန်လည်ထူထောင်ရေးလမ်းကြောင်းဖြစ်ပြီး point-in-time ဒေတာအမြင်တွေဟာ ချိတ်ဆက်မှုတစ်ခုလုံးကို ပြန်လည်ကစားတာရှောင်ရှားတဲ့ အကောင်းဆုံးဖြစ်တာပါ။

## Kura သိုလှောင်ခြင်း {#kura-storage}

_Kura_ သည် Iroha ၏ အမြဲတမ်း ဘလော့ခ်သိုလှောင်မှုဖြစ်သည်။ ၎င်းတွင် လက်မှတ်ထိုးထားသော ဘလော့ခ်များနှင့် ပြန်လည်ရယူမှု metadata ကို သိမ်းသည်။ ပြောင်းလဲနိုင်သော WSV ဒုတိယမိတ္တူကို မသိမ်းပါ။

Kura သိုလှောင်ခြင်းသည် rooted at [`kura.store_dir`](/my/reference/peer-config/params.md#param-kura-store-dir). အဲဒီ root ထဲမှာ block data တွေကို execution lane (သို့) segment နဲ့ ခွဲခြားထားပါတယ်။ segment တစ်ခုအတွက် အဓိက file တွေက:

|လမ်းကြောင်း|ရည်ရွယ်ချက်|
| --- | --- |
|`blocks/<segment>/blocks.data` |Norito ဖွဲ့စည်းထားသော လက်မှတ်ထိုးထားတဲ့ အစုအဝေး အသုံးဝင်ပစ္စည်းများ။ |
| `blocks/<segment>/blocks.index` | ဘလော့ခ်အမြင့်ကို `blocks.data` ထဲရှိ byte များနှင့် ချိတ်ဆက်ပေးသော အရွယ်အစားပုံသေ `(start, length)` မှတ်တမ်းများ။ |
|`blocks/<segment>/blocks.hashes` |အမြန်ရှာဖွေခြင်းနှင့် စတင်စစ်ဆေးမှုအတွက်အမြင့်အလိုက် cryptographic hashes ကိုပိတ်ပါ။ |
|`blocks/<segment>/blocks.count.norito` |ရေရှည်တည်တံ့တဲ့ block-finalisation marker တွေကို မှတ်တမ်းတင်ပြီး Block index entries ဘယ်နှစ်ပုံသုံးဖို့ လုံခြုံတယ်ဆိုတာပါ။ |
|`blocks/<segment>/da_blocks/` |`blocks.data` အပြင်မှာ ထိန်းသိမ်းထားသော block payloads ကို disk-budget enforcement သည် hot ဖိုင်မှအဟောင်းအလောင်းများကိုပြောင်းတဲ့အခါတွင်။ |
|`blocks/<segment>/pipeline/sidecars.norito` နှင့် `sidecars.index` |ဆော့ဖ်ဝဲ စီမံခန့်ခွဲမှု အလုပ်ခွင် ပြန်လည်ထူထောင်ရေး အထောက်အပံ့ မှတ်တမ်းများကို ဘလော့ အမြင့်ဖြင့် ကီးတပ်ထားသည်။ |
|`blocks/<segment>/pipeline/roster_sidecars.norito` နှင့် `roster_sidecars.index` |Block sync နဲ့ replay တွေမှာ အသုံးပြုတဲ့ မကြာသေးခင်က protocol finalisation-roster အကူအညီမှတ်တမ်းတွေ။|
|`merge_ledger/<segment>.log` |နောက်ဆုံးသတ်မှတ်ထားတဲ့ ဘလော့တွေနဲ့ ညှိနှိုင်းထားတဲ့ blockchain ပေါင်းစပ်ခြင်း log entries များ။ |
|`commit-rosters.norito` |မကြာသေးခင်က ဘလော့များအတွက် သဘောတူညီချက် နောက်ဆုံးသတ်မှတ်ချက်များနှင့် အတည်ပြုသူ စစ်ဆေးရေးဂိတ်များကို သိမ်းထားသည်။ |

Kura ကွင်းဆက်အတွက် memory vector တစ်ခုကို ထိန်းထားပါတယ် အမြင့်တစ်ခုစီမှာ block cryptographic hash နဲ့ optionally block body ပါပါတယ်။ blockchain ဘလော့ကုတ်ကို ကေရှ်ထားဆဲဖြစ်ပြီး [`kura.blocks_in_memory`](/my/reference/peer-config/params.md#param-kura-blocks-in-memory) non-genesis blocks တွေက သူတို့ရဲ့ ကိုယ်ခန္ဓာတွေကို မှတ်ဉာဏ်ထဲမှာ ထိန်းထားတယ်။ ပိုကြီးတဲ့ ကိုယ်ခန္ဓာတွေဟာ မှတ်ဉာဏ်ကနေ ပစ်ချပြီး Kura လိုအပ်တဲ့အခါမှာ ဖိုင်တွေပါ။

အစပျိုးစဉ်တွင် `strict` mode သည် block payload များမှ သိုလှောင်ထားသော blocks ကို validates နှင့်လိုအပ်ပါက cryptographic hash ဖိုင်ကို rewrites ။ `fast` mode က stored မှစသည်။ hash/index metadata တွေဟာ မညီညွတ်တဲ့ metadata ဆိုရင် တင်းကျပ်တဲ့ initialization ကို ပြန်ရောက်သွားပါတယ်။ Kura က အပျက်အစီးရှိတဲ့ အမြီးကို ရှာတွေ့တယ်ဆိုရင်တော့ နောက်ဆုံး validated block အထိ storage ကို prunes လုပ်ပေးတယ်။

Kura သည်နောက်ခံစာရေးသူမှတစ်ဆင့်ပုံးအသစ်များကိုရေးသားသည်။ စာရေးသူသည်ပုံးအကူအညီများ၊ cryptographic hashes များနှင့်ညွှန်းကိန်းဝင်မှုများကိုထည့်သွင်းပြီး configured fsync မူဝါဒကိုလိုက်နာ၍တည်တံ့သောရေတွက်ချက်မှတ်တံဆိပ်ကိုတိုးတက်စေသည်။ disk-budget enforcement လုပ်တဲ့အခါ Kura က ဖျက်သိမ်းထားတဲ့ segment တွေကို ရှင်းလင်းနိုင်တယ် ဒါမှမဟုတ် older block bodies တွေကို `da_blocks/` ထဲက ထုတ်ပစ်လို့ရတယ် တစ်ချိန်တည်းမှာ cryptographic hash နဲ့ index entries တွေကို validation နဲ့ search အတွက်တော့ ရယူနိုင်တယ်
