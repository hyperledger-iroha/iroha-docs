---
translation_locale: my
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ကမ္ဘာကြီး {#world}

`World` အခြားအဖွဲ့အစည်းတွေပါဝင်တဲ့ ကမ္ဘာ့အဖွဲ့အစည်းပါ။ `World`
အောက်ပါအရာများဖြင့် ပြုလုပ်ထားပါသည်။

- Iroha [configuration parameters များ](/my/guide/configure/client-configuration.md)
- မှတ်ပုံတင်သူများ
- မှတ်ပုံတင် domain များ
- မှတ်ပုံတင်ထား [trigger များ](/my/blockchain/triggers.md)
- မှတ်ပုံတင်ထား
  [အခန်းကဏ္ဍ](/my/blockchain/permissions.md#permission-groups-roles)
- မှတ်ပုံတင်ထား
  [permission token အနက်ဖွင့်ချက်များ](/my/blockchain/permissions.md#permission-tokens)
- အကောင့်အားလုံးအတွက် ခွင့်ပြုချက် လက်မှတ်
- [Runtime validator တွေရဲ့ ချိတ်ဆက်ချက်](/my/blockchain/permissions.md#runtime-validators)

Domain တွေ၊ peers တွေ (သို့) roles တွေကို မှတ်ပုံတင်ထားတဲ့အချိန် ဒါမှမဟုတ် မမှတ်ပုံတင်ထားတဲ့အခါ `World`
မှတ်ပုံတင် (မပြုလုပ်ခြင်း) ၏ ရည်မှန်းချက်ဖြစ်သည်
[သင်ကြားချက်](/my/blockchain/instructions.md).

## ကမ္ဘာ့အမြင် (WSV) {#world-state-view-wsv}

World State View သည် လက်ရှိ blockchain ၏ မှတ်ဉာဏ်တွင်း ကိုယ်စားပြုမှုဖြစ်သည်။
နိုင်ငံတော်အတိုင်ပင်ခံပုဂ္ဂိုလ် `World`, commited block hashes, transaction index များ၊
လက်ရှိခေတ်အတွက် ရွေးချယ်ခံရတဲ့ တူညီသူတွေ၊
Kura ပြောင်းလွယ်ပြင်လွယ်အဖြစ် ထပ်တူလုပ်တာထက် WSV ဒေတာ။

နိုင်ငံခြားရေး WSV ဒါက query တွေကို ဖတ်ပြီး block execution တွေ ပြောင်းသွားတဲ့ အခြေအနေပါ။
သမိုင်းဟာ တည်တံ့တဲ့ အမှန်တရားရဲ့ ရေရှည်ခံရင်းမြစ်မဟုတ်ဘူး။
[Kura](#kura-storage), နောက်ပြီး WSV ပြန်လည်တည်ဆောက်နိုင်တယ် Kura ဘလော့ခ်များ သို့မဟုတ် ဝန်ဆောင်မှုများ
state snapshot ကနေ နောက်ပိုင်းမှာ ပြန်လည်ရိုက်ယူလိုက်တဲ့နောက် Kura ဘလော့ခ်များ။

### ဘာကို WSV ခြေရာများ {#what-the-wsv-tracks}

နိုင်ငံခြားရေး WSV ပိုကျယ်ပြန့်တဲ့ `World` လက်တွေ့မှာ အောက်ပါအတိုင်း ပါဝင်ပါတယ်။

- ကော်မတီ `World`: ပမာဏများ၊ တူညီသူတွေ၊ ဒိုမင်များ၊ အကောင့်များ၊ အရင်းအမြစ်များ NFTs, အခန်းကဏ္ဍ
  ခွင့်ပြုချက်များ၊ trigger များ၊ executor data များနှင့် Registered Data Model များ
  ပစ္စည်းများ
- commited block hashs နှင့် နောက်ဆုံး commited height
- မေးမြန်းချက်များနှင့် လက်မှတ်များတွင် အသုံးပြုသော ငွေပေးချေမှုမှ ဘလော့ခ်သို့ အညွှန်းကိန်းများ
- လက်ရှိနှင့် အရင်က သဘောတူညီချက်ဖြင့် အသုံးပြုသော commit topology
- ကတိပြုထားတဲ့ ဘလော့များမှ ရယူထားသော in-memory index များ၊ ဥပမာ ဒေတာရရှိနိုင်မှု
  ကတိပေးချက်များ၊ လက်ခံမှု ညွှန်ပြချက်များ၊ pin intent များနှင့် query projection marker များ
- Runtime configuration snapshots တွေကို deterministic block execution အတွက် လိုအပ်ပါတယ်။
  ဥပမာ cryptography, governance, pipeline, content, settlement နဲ့ Nexus
  setting များ

မေးမြန်းချက်တွေဟာ ပုံမှန်အားဖြင့် ဖတ်လို့သာ ရပါတယ် `StateView` ဒီအဆောက်အဦတွေပေါ်မှာ
view က query execution အတွက် တချိန်တည်း snapshot ဖြစ်ပြီး Direct ကို မခွင့်ပြုပါဘူး။
အပြောင်းအလဲများ WSV.

### ဘယ်လို WSV ပြောင်းလဲမှု {#how-the-wsv-changes}

WSV အပြောင်းအလဲတွေ မပြုလုပ်ခင်မှာ အဆင့်သတ်မှတ်ထားတာပါ။
Block-scoped state overlay နဲ့ လက်ခံထားတဲ့ ငွေကြေးလုပ်ငန်းတိုင်းမှာ
ငွေလဲလှယ်နှုန်းသမိုင်း (S&P) သို့ S&P (SMS) Forex လဲလှယ်စျေးကွက်အပေါ်အသကျရှငျ
Time trigger တွေကို
ဘလော့အတွက် ငွေပေးချေမှု သက်ရောက်မှု

သဘောတူညီချက်က ဘလော့ကို ချုပ်ဆိုပြီးနောက် peer က ပထမဆုံး ချုပ်ဆိုထားတဲ့ ဘလော့ကို ရယူတယ်။
အထဲမှာ Kura. ဒီနောက်ဆက်တွဲအဆင့် ကျရှုံးရင် WSV မတိုးတက်သေးဘူး
consensus loop က block ရဲ့ payload ကို retries ဒါမှမဟုတ် requires လုပ်တယ်။
လက်ခံ Kura အတန်းက Iroha အပြီးသတ်မှုနောက်ပိုင်း Block သက်ရောက်မှုကို သုံးပါတယ်။
ရယူထားသောအညွှန်းကိန်းများကို update လုပ်ပြီး အဆင့်သတ်မှတ်ထားသော WSV a အောက်က ပြောင်းလဲချက်များ
state view lock ကို အသုံးပြုပြီး စာဖတ်သူတွေကို တစ်စိတ်တစ်ပိုင်း ကျိန်းသေထားတဲ့
အတားအဆီးပါ။

သဘောတူညီချက်ရဲ့ အရေးပါတဲ့ စည်းမျဉ်းက အဖော်တွေဟာ တူညီတဲ့ WSV ကနေ
ကတိပြုထားတဲ့ blocks တွေကိုပဲ WSV ဒေတာ bypass ညွှန်ကြားချက်များနှင့်
validation (သို့) replay လုပ်နေစဉ်မှာ အဖော်တွေ သဘောမတူအောင်လုပ်လိမ့်မယ်။

### Start နှင့် ပြန်လည်ကစားခြင်း {#startup-and-replay}

စတင်ချိန်မှာ Iroha အစပြုသည် Kura ပထမဦးဆုံးနဲ့ သိုလှောင်ထားတဲ့ ဘလော့က အမြင့်ကို သင်ယူတယ်။
အဲဒီနောက်မှာ state snapshot တစ်ခုကို load လုပ်ဖို့ကြိုးစားတယ်။ snapshot မရှိရင် ဒါမှမဟုတ်
snapshot ကို ပြန်လည်ရှာဖွေလို့မရဘူးလို့ ပယ်ချလိုက်ပါတယ်။ Iroha အစပိုင်းအခြေအနေကို ဖန်တီးပြီး
ပြန်လည်ပြုလုပ်ထားသော blocks မှ Kura. snapshot ကို valid လုပ်ထားပေမဲ့ နောက်ကျနေရင် Kura,
ပျောက်နေတဲ့ အမြင့်အကွာအဝေးကိုသာ ပြန်လည်ကစားပါ။

Replay က သိမ်းထားတဲ့ block တစ်ခုစီကို validates လုပ်ပြီး commit roster ကို ပြန်လည်တည်ဆောက်တယ်။
အမြင့်, block effect ကို applies to the WSV, ပြီးရင် ရလာတဲ့
နိုင်ငံတကာမှာ Kura ပြန်လည်ထူထောင်ရေးလမ်းကြောင်း WSV, snapshots တွေက
ချိတ်ဆက်မှုတစ်ခုလုံးကို ပြန်လည်ကစားတာ ရှောင်ရှားတဲ့ Optimization တစ်ခုပါ။

## Kura သိုလှောင်ခြင်း {#kura-storage}

_ကိုရာ_ ရှိသည် Iroha လက်မှတ်ထိုးထားတဲ့ ဘလော့တွေကို သိုလှောင်ထားပြီး
ပြန်လည်ထူထောင်ရေး metadata. WSV.

Kura သိုလှောင်ခြင်းသည် [`kura.store_dir`](/my/reference/peer-config/params.md#param-kura-store-dir).
Root ထဲမှာ block data တွေကို lane (သို့) segment နဲ့ ခွဲထားတယ်။
အပိုင်းတစ်ခုအတွက်:

| လမ်းကြောင်း | ရည်ရွယ်ချက် |
| --- | --- |
| `blocks/<segment>/blocks.data` | တစ်ပြိုင်နက် Norito- ဖွဲ့စည်းထားတဲ့ လက်မှတ်ရေးထိုးထားတဲ့ ဘလော့ကတ် သုံးစွဲမှု။ |
| `blocks/<segment>/blocks.index` | စံချိန်တင်အရွယ်အစား `(start, length)` ကဒ်ဘလော့ အမြင့်ကို bytes သို့ ထည့်သွင်းထားသည် `blocks.data`. |
| `blocks/<segment>/blocks.hashes` | အမြန်ရှာဖွေရေးနဲ့ စတာ့ပ်အတည်ပြုမှုအတွက် အမြင့်အရ hash ကိုပိတ်ပါ။ |
| `blocks/<segment>/blocks.count.norito` | ခိုင်မာတဲ့ commit marker ကတော့ block index entries ဘယ်နှစ်ကြိမ်သုံးဖို့ လုံခြုံတယ်ဆိုတာကို မှတ်တမ်းတင်ပါတယ်။ |
| `blocks/<segment>/da_blocks/` | အပြင်မှာ ထားရှိထားသော ပိတ်ပစ်ခံရသည့် ဘလော့ကတ် အသုံးဝင်ပစ္စည်းများ `blocks.data` ဒစ်ကတ်-ဘတ်ဂျက် အကောင်အထည်ဖော်ရေးက ပူပြင်းတဲ့ ဖိုင်ထဲက အလောင်းဟောင်းတွေကို ရွှေ့လိုက်တဲ့အခါပါ။ |
| `blocks/<segment>/pipeline/sidecars.norito` နှင့် `sidecars.index` | ဘလော့ကုန်းအမြင့်နဲ့ ကီးတပ်ထားတဲ့ ဘိုက်လိုင်း ပြန်လည်ထူထောင်ရေး ဘေးကားတွေပါ။ |
| `blocks/<segment>/pipeline/roster_sidecars.norito` နှင့် `roster_sidecars.index` | Block sync နဲ့ replay တွေမှာ အသုံးပြုတဲ့ မကြာသေးခင်က commit-roster sidecars တွေပါ။ |
| `merge_ledger/<segment>.log` | ကတိပြုထားတဲ့ ဘလော့များနှင့် ညှိနှိုင်းထားသော ပေါင်းစပ်စာရင်းဝင်ငွေများ။ |
| `commit-rosters.norito` | မကြာသေးခင်က ဘလော့များအတွက် ကတိပြုချက် လက်မှတ်များနှင့် အတည်ပြုသူ စစ်ဆေးရေးဂိတ်များကို ထိန်းသိမ်းထားခြင်း။ |

Kura Chain အတွက် compact in-memory vector ကို ထိန်းထားပါတယ် အမြင့်တိုင်းမှာ
ဘလော့က ဟက်ရှ်နဲ့ ရွေးချယ်စရာအနေနဲ့ ဘလော့ခန္ဓာကိုယ်ပါ။
နောက်ပြီး နောက်ဆုံး [`kura.blocks_in_memory`](/my/reference/peer-config/params.md#param-kura-blocks-in-memory)
non-genesis blocks တွေက သူတို့ရဲ့ ကိုယ်ခန္ဓာတွေကို မှတ်ဉာဏ်ထဲမှာ ထိန်းထားတယ်။
မှတ်ဉာဏ်ကနေ လွတ်သွားပြီး Kura လိုအပ်တဲ့အခါမှာ ဖိုင်တွေပါ။

အစပျိုးစဉ်မှာ `strict` mode က block ထဲက stored blocks တွေကို validates လုပ်ပေးတယ်
သုံးစွဲသူများအတွက် အသုံးဝင်သော ဝန်ဆောင်မှုများကို အသုံးပြုပြီး လိုအပ်ပါက hash ဖိုင်ကို ပြန်ရေးသားပေးသည်။ `fast` mode ကို stored မှစသည်
hash/index metadata တွေကိုပြန်ပြီး stringent initialization ကိုကျသွားတယ်ဆိုပါစို့
ကွဲပြားမှုရှိတယ် Kura အညစ်အကြေးရှိတဲ့ အမြီးကို ရှာဖွေပြီး သိုလှောင်မှုကို
နောက်ဆုံး အတည်ပြုထားတဲ့ ဘလော့။

Kura နောက်ခံ စာရေးသူမှတဆင့် blocks အသစ်တွေကို ရေးပေးတယ်။
payloads, hashes, နှင့် index entries များကို, ထို့နောက်တည်တံ့သော count marker ကိုတိုးတက်
ဖွဲ့စည်းထားသော fsync မူဝါဒကို လိုက်နာပါ။ disk-budget enforcement ကို
တက်ကြွတဲ့ Kura အငြိမ်းစားယူထားတဲ့ segment တွေကို ရှင်းလင်းနိုင်တယ် ဒါမှမဟုတ် ပိုကြီးတဲ့ block bodies တွေကို
`da_blocks/` hash တွေနဲ့ index entry တွေကို validation လုပ်ဖို့တော့
ပြီးတော့ ရှာဖွေပါ။
