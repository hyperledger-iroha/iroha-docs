---
translation_locale: my
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# စာလုံးပေါင်း <!-- omit in toc --> {#glossary}

Iroha နှင့် သက်ဆိုင်သော အဖွဲ့အစည်းအားလုံး၏ အဓိပ္ပါယ်ဖွင့်ဆိုချက်များကို ဤနေရာတွင် တွေ့ရှိနိုင်ပါသည်။

- [တူညီသူ](#peer)
- [အရင်းအမြစ်များ](#asset)
- [Byzantine fault-tolerance (BFT) ](#byzantine-fault-tolerance-bft)
- [Iroha အစိတ်အပိုင်းများ](#iroha-components)
  - [Sumeragi (မင်းကြီး) ](#sumeragi-emperor)
  - [Torii (ဂိတ်)](#torii-gate)
  - [Kura (သိုလှောင်ရုံ) ](#kura-warehouse)
  - [Kagami(ဆရာမနှင့် နမူနာနှင့်/သို့မဟုတ် မှန်)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Merkle သစ်ပင် (hash tree) ](#merkle-tree-hash-tree)
  - [ဉာဏ်ရည်မြင့် စာချုပ်များ ](#smart-contracts)
  - [အစပျိုးစက်များ](#triggers)
  - [Versioning](#versioning)
  - [Hijiri (တူညီသူတွေရဲ့ ဂုဏ်သတင်းစနစ်) ](#hijiri-peer-reputation-system)
- [Iroha မော်ဂျူးများ](#iroha-modules)
- [Iroha အထူးညွှန်ကြားချက်များ (ISI) ](#iroha-special-instructions-isi)
  - [အသုံးဝင်မှု Iroha အထူးညွှန်ကြားချက်များ](#utility-iroha-special-instructions)
  - [Core Iroha အထူးညွှန်ကြားချက်များ](#core-iroha-special-instructions)
  - [နယ်ပယ်သတ်မှတ်ချက် Iroha အထူးညွှန်ကြားချက်များ](#domain-specific-iroha-special-instructions)
  - [Custom Iroha အထူးညွှန်ကြားချက်](#custom-iroha-special-instruction)
- [Iroha မေးမြန်းချက်](#iroha-query)
- [View ပြောင်းလဲမှု](#view-change)
- [ကမ္ဘာ့အခြေအနေအမြင် (WSV) ](#world-state-view-wsv)
- [ခေါင်းဆောင် ](#leader)

## Blockchain ledgers များ {#blockchain-ledgers}

Blockchain ledgers သည် ငွေကြေးမှတ်တမ်းများကို သိမ်းဆည်းရန် blockchain နည်းပညာကို အသုံးပြုသည့် ဒစ်ဂျစ်တယ် မှတ်တမ်းတင်စနစ်များဖြစ်သည်။ ၎င်းတို့သည် ကုန်ကျစရိတ်၊ သတင်းနှင့် ငွေပေးချေမှုဆိုင်ရာ အချက်အလက်ကဲ့သို့သော ငွေကြေး မှတ်တမ်းများအတွက်အသုံးပြုခဲ့သော ရှေးခေတ်စာအုပ်များအမည်ဖြင့် အမည်ပေးထားသည်။

အလယ်ခေတ်ကာလအတွင်းမှာ စာရင်းအင်းစာအုပ်တွေဟာ အများပြည်သူအတွက် ကြည့်ရှုနိုင်ပြီး တိကျမှု စစ်ဆေးဖို့ ဖွင့်လှစ်ထားတာပါ။ ဒီအယူအဆက သိမ်းဆည်းထားတဲ့ ဒေတာရဲ့ သက်ရောက်မှုကို စစ်ဆေးနိုင်တဲ့ blockchain အခြေပြုစနစ်တွေမှာ ထင်ဟပ်တယ်။

## တူညီသူ {#peer}

Iroha တွင် peer ဆိုသည်မှာ အခြား Iroha လုပ်ငန်းစဉ်များနှင့် Client Applications များ ချိတ်ဆက်နိုင်သော Iroha စီမံကိန်း instance ကိုဆိုလိုသည်။ တစ်စက်တည်းတွင် Iroha peers များစွာကို တည်းခိုနိုင်ပါသည်။ Peers တွေဟာ သူတို့ရဲ့ အရင်းအမြစ်တွေနဲ့ စွမ်းပကားတွေအရ တူညီကြပါတယ်၊ အရေးကြီးတဲ့ ခြွင်းချက်တစ်ခုက Iroha ကွန်ယက်ရဲ့ bootstrapping အဆင့်မှာ Genesis Block ကို တစ်ခုတည်းသော peers ကပဲ လည်ပတ်တာပါ။

အခြား blockchains များမှာ node သို့မဟုတ် validator ကဲ့သို့သော အယူအဆကို ရည်ညွှန်းနိုင်သည်။

Peer သည် ၎င်း၏ host system တွင်ဖြစ်စဉ်တစ်ခု ဖြစ်နိုင်သည်။ ၎င်းသည် Docker container နှင့် Kubernetes pod တွင်လည်းပါဝင်နိုင်သည်။

## အရင်းအမြစ်များ {#asset}

ဘလော့ခ်ချိုင်းတွေရဲ့ အခြေအနေမှာ အရင်းအမြစ်ဆိုတာ blockchain ပေါ်က တန်ဖိုးရှိတဲ့ အရာဝတ္ထုကို ကိုယ်စားပြုခြင်းပါ။

အရင်းအမြစ်များနှင့် ပတ်သက်သော ထပ်မံအချက်အလက်များကို [ တွင် ](/my/blockchain/assets.md) တွင် ရရှိနိုင်ပါသည်။

### ငွေကြေးအထောက်အပံ့များ {#fungible-assets}

ထိုအရင်းအမြစ်များကို တူညီသော အရင်းအမြစ်များအတွက် အလွယ်တကူ လဲလှယ်နိုင်သည်မှာ ၎င်းတို့ဟာ အပြန်အလှန် လဲလှယ်လို့ ရသည့်ကြောင့် ဖြစ်သည်။

ဥပမာ ငွေကြေးတစ်ခုတည်း၏ ယူနစ်အားလုံးသည် တန်ဖိုးတူပြီး ကုန်ပစ္စည်းများကို ဝယ်ယူရန် အသုံးပြုနိုင်သည်။ ပုံမှန်အားဖြင့် ငွေစက္ကူများနှင့် ငွေကျပ်ငွေကြေးများ အဝတ်လျှော့ခြင်းမှလွဲ၍ fungible assets များဟာ တူညီသော ပုံသဏ္ဌာန်ရှိသည်။

### ဖောက်ပြန်နိုင်ခြင်းမရှိသော အရင်းအမြစ်များ {#non-fungible-assets}

မှိုမပါသော အရင်းအမြစ်များသည် ၎င်းတို့၏ အထူးလက္ခဏာများနှင့် ရှားပါးမှုကြောင့် ထူးခြားပြီး တန်ဖိုးရှိပြီး အခြားအရင်းအမြစ်များနှင့် နှိုင်းယှဉ်၍ မရနိုင်ပါ။

- ပန်းချီကားရဲ့ တန်ဖိုးဟာ အနုပညာရှင်၊ ပန်းချီဆွဲခဲ့တဲ့ ကာလနဲ့ အများပြည်သူ စိတ်ဝင်စားမှုအပေါ် မူတည်ပြီး ကွဲပြားနိုင်ပါတယ်။
- တစ်လမ်းတည်းမှာရှိတဲ့ အိမ်နှစ်ခုဟာ ထိန်းသိမ်းမှု အဆင့်ကွဲပြားနိုင်တယ်
- ရတနာပစ္စည်းထုတ်လုပ်သူတွေဟာ မကြာခဏဆိုသလို ပုံစံအမျိုးမျိုးကို ပေးကြတယ်။

### သိုလှောင်နိုင်သော ပိုင်ဆိုင်မှု {#mintable-assets}

အရင်းအမြစ်တစ်ခုဟာ တူညီတဲ့ အမျိုးအစားထက်ပိုပြီး ထုတ်လွှင့်နိုင်ရင် ထုတ်လုပ်နိုင်တာပါ။

### ရင်းနှီးမြှုပ်နှံမှုမရှိသော အရင်းအမြစ်များ {#non-mintable-assets}

ရင်းနှီးမြှုပ်နှံမှုတစ်ခု၏ မူလအရေအတွက်ကို တစ်ကြိမ် သတ်မှတ်ထားပြီး ပြောင်းလဲခြင်းမရှိပါက ၎င်းသည် မဖြစ်မနေဟု ယူဆသည်။

[Genesis block ](/my/guide/configure/genesis.md) သည် Iroha ဖွဲ့စည်းမှုအတွက် ဤအချက်အလက်ကို သတ်မှတ်ထားသည်။

## Byzantine fault-tolerance (BFT) {#byzantine-fault-tolerance-bft}

Iroha သည် ၎င်း၏ peer-to-peer ကွန်ရက်တွင် ၃၃% အထိသော မကောင်းဆိုးဝါးသော အခန်းကဏ္ဍများနှင့်အတူ လုပ်ဆောင်နိုင်သည်။

## Iroha ပါဝင်ပစ္စည်းများ {#iroha-components}

Rust မော်ဂျူးများမှာ Iroha လုပ်ဆောင်ချက်ရှိသည်။

### Sumeragi (အင်ပါယာ) {#sumeragi-emperor}

သဘောတူညီမှုအတွက် တာဝန်ရှိသည့် Iroha မော်ဒူး။

### Torii (ဂိတ်) {#torii-gate}

[ peer](#peer) အတွက် ဝင်ရောက်လာသော request ကိုကိုင်တွယ်ရေး logic ကိုပါ ၀ င်သည့် module ကိုအသုံးပြုသည်။ ၎င်းကိုဝင်ရောက်လာသော ညွှန်ကြားချက်များ၊ နှင့် HTTP မေးမြန်းမှုများနှင့် run-time configuration update များအားလက်ခံရန်၊ လက်ခံရန်နှင့် လမ်းညွှန်ပေးရန် အသုံးပြုသည်။

### Kura (သိုလှောင်ရုံ) {#kura-warehouse}

တည်တံ့တဲ့ ဘလော့ဂ် သိုလှောင်မှု။ Kura လက်မှတ်ထိုးထားတဲ့ blocks, block hashes, height indexes, recovery sidecars နဲ့ commit-roster metadata တွေကို disk ပေါ်မှာ သိမ်းထားတယ်။ [ကမ္ဘာ့အမြင်](#world-state-view-wsv) ပြန်လည်တည်ဆောက်ထားသည် Kura blocks when a state snapshot isn't available or behind the local block store ကို ကြည့်ပါ။ [Kura သိုလှောင်ခြင်း](/my/blockchain/world.md#kura-storage).

### Kagami(ဆရာမနှင့် နမူနာနှင့်/သို့မဟုတ် မှန်မှန်) {#kagami-teacher-and-exemplar-and-or-looking-glass}

မကြာခဏသုံးတဲ့ အချက်အလက်များအတွက် Generator ကို ဖန်တီးနိုင်သည်။ cryptographic key pairs, genesis blocks, documentation စသည်တို့ကို ထုတ်လုပ်နိုင်ပါတယ်။

### Merkle သစ်ပင် (ဟက်စ်သစ်ပင်) {#merkle-tree-hash-tree}

Iroha ၏ လက်ရှိ အကောင်အထည်ဖော်မှုက ဘိုင်နရီ သစ်ပင်တစ်ခုဖြစ်သည်။ အသေးစိတ်အချက်အလက်များအတွက် [Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree) ကိုကြည့်ပါ။

### ဉာဏ်ရည်မြင့် စာချုပ်များ {#smart-contracts}

စမတ်ကုထုံးတွေဟာ သတ်မှတ်ချက်တစ်ခုခုကို ဖြည့်ဆည်းတဲ့အခါ လည်ပတ်တဲ့ blockchain အခြေပြု အစီအစဉ်တွေပါ။ Iroha smart contracts တွေကို အသုံးပြုပြီး အကောင်အထည်ဖော်ပါတယ်။ [core ကို Iroha အထူးညွှန်ကြားချက်များ](#core-iroha-special-instructions).

### နှိုးစက်များ {#triggers}

event type ကို call လုပ်ခွင့်ပြုတဲ့ event type တစ်ခု Iroha အထူး ညွှန်ကြားချက်တစ်ခုခုကို သတ်မှတ်သော block commit, အချိန် (အချို့ သတိပေးချက်များနှင့်အတူ) စသည်တို့တွင်. [ဒီမှာ](/my/blockchain/triggers.md).

### ဗားရှင်းထုတ်ခြင်း {#versioning}

တောင်းဆိုမှုတစ်ခုစီသည် ၎င်းနှင့်ဆိုင်သော API ဗားရှင်းဖြင့် တံဆိပ်တပ်ထားသည်။ Iroha client / peer software ၏ မတူညီသော ဘိုင်နရီဗားရှင်းများ၏ ပေါင်းစပ်မှုကိုအပြန်အလှန်ဆောင်ရွက်နိုင်စေသည်၊ ထို့နောက် Iroha ကွန်ယက်တွင် ဆော့ဝဲ အဆင့်မြှင့်တင်ခြင်းကိုခွင့်ပြုသည်။

### Hijiri (အချင်းချင်း ဂုဏ်သိက္ခာစနစ်) {#hijiri-peer-reputation-system}

Iroha၎င်းက ဆက်သွယ်ရေးကို ဦးစားပေး သတ်မှတ်ခွင့်ပြုတယ်။ [တူညီသူများ](#peer) ကောင်းမွန်တဲ့ track-record ရှိပြီး မကောင်းဆိုးဝါးတွေကြောင့် ဖြစ်စေနိုင်တဲ့ ထိခိုက်မှုကို လျော့ကျစေတယ်။ [တူညီသူများ](#peer).

## Iroha မော်ဂျူးများ {#iroha-modules}

Iroha သို့ သုံးစွဲသူသုံး ဖြန့်ဖြူးခြင်းများ၊ ၎င်းတို့သည် ကိုယ်ပိုင် လုပ်ဆောင်ချက်များကို ပေးဆောင်နိုင်သည်။

## Iroha အထူးညွှန်ကြားချက်များ (ISI) {#iroha-special-instructions-isi}

Iroha ကိုထောက်ပံ့ထားသော စမတ်ကွန်ထရက်များစာကြည့်တိုက်။ ဤအချက်အလက်များကို ငွေပေးချေမှု (သို့မဟုတ်) မှတ်ပုံတင်ဖြစ်စဉ်နားထောင်သူများမှတစ်ဆင့်ခေါ်ယူနိုင်သည်။ ISI [တွင်ပိုမိုသိရှိလိုသည်](/my/blockchain/instructions.md).

#### အသုံးဝင်မှု Iroha အထူးညွှန်ကြားချက်များ {#utility-iroha-special-instructions}

ဒီအစုကို [အီစီ](#iroha-special-instructions-isi) ဒီလို ယုတ္တိတန်တဲ့ ညွှန်ကြားချက်တွေ ပါပါတယ်။ `If`, I/O နှင့်ဆိုင်သော ဥပမာများ `Notify` ပြီးတော့ သီချင်းတွေပေါ့။ `Sequence`. ဒါတွေကို အများအားဖြင့် အသုံးပြုပါတယ်။ [ကိုယ်ပိုင် ညွှန်ကြားချက်များ](#custom-iroha-special-instruction).

### Core Iroha အထူးညွှန်ကြားချက်များ {#core-iroha-special-instructions}

[အထူးညွှန်ကြားချက်များ ](#iroha-special-instructions-isi) ကို Iroha deployment တစ်ခုချင်းစီနှင့်အတူပေးထားသည်။ ဤသည်တို့တွင် [ဒိုမင်သတ်မှတ်ချက်များ](#domain-specific-iroha-special-instructions) နှင့် [ အသုံးဝင်မှုညွှန်ကြားချက်တွေ](#utility-iroha-special-instructions) တို့ပါဝင်သည်။

### နယ်ပယ်သတ်မှတ်ချက်များ Iroha အထူးညွှန်ကြားချက် {#domain-specific-iroha-special-instructions}

[World State View](#world-state-view-wsv) ကို လုံခြုံပြီး ဘေးကင်းစွာ ပြုပြင်နိုင်ရန် လိုအပ်သော ကိရိယာများကို ပေးပို့ပေးပါသည်။

### Custom Iroha အထူးညွှန်ကြားချက် {#custom-iroha-special-instruction}

ညွှန်ကြားချက်များ [Iroha မော်ဂျူးများ](#iroha-modules), ဖောက်သည်များ (သို့) တတိယပါတီများမှ တည်ဆောက်နိုင်ပါသည်။ [အဓိက ညွှန်ကြားချက်များ](#core-iroha-special-instructions). Forking နှင့် ပြင်ဆင်ခြင်း Iroha အရင်းအမြစ်ကုဒ်ကို အကြံပြုခြင်းမရှိဘဲ အထူးညွှန်ကြားချက်များအတွက် [တူညီသူများ](#peer) တစ်ကြိမ် Iroha deployment ကို အမှားတွေအဖြစ် ဆက်ဆံကြမှာဖြစ်ပြီး [တူညီသူများ](#peer) modified instance တစ်ခုကို run လုပ်နေရင် သူတို့ access ကို revok လုပ်ရမှာပါ။

## Iroha မေးခွန်း {#iroha-query}

World State View ကို ပြင်ဆင်ခြင်းမရှိဘဲ ဖတ်ရန် တောင်းဆိုချက်။ မေးမြန်းချက်များအတွက် [here ](/my/blockchain/queries.md).

## အပြောင်းအလဲကို ကြည့်ပါ။ {#view-change}

သဘောတူညီမှု ရယူရန် ကြိုးပမ်းမှု မအောင်မြင်ခဲ့ပါက ပြုလုပ်သည့် လုပ်ငန်းစဉ်တစ်ခုဖြစ်သည်။ ပုံမှန်အားဖြင့် ဤလုပ်ငန်းစဉ်သည် [ ခေါင်းဆောင်သစ် ](#leader) ကို ရွေးချယ်ခြင်းနှင့်စပ်လျဉ်းသည်။

## ကမ္ဘာ့နိုင်ငံရေးအမြင် (WSV) {#world-state-view-wsv}

လက်ရှိ blockchain အခြေအနေကို In-memory ကိုယ်စားပြုခြင်း။ WSV ပါရှိပါတယ် `World`, commited block hashes, transaction indexes, consensus topology နဲ့ queries တွေမှာ အသုံးပြုတဲ့ derived index တွေ။ ၎င်းကို ကတိပြုထားတဲ့ ဘလော့များဖြင့်သာ မွမ်းမံထားပြီး ပြန်လည်တည်ဆောက်နိုင်သည်။ [Kura](#kura-warehouse). ကြည့်ပါ။ [ကမ္ဘာ့အမြင်](/my/blockchain/world.md#world-state-view-wsv).

## ခေါင်းဆောင် {#leader}

အိုင်ရိုဟားကွန်ရက်တွင် peer တစ်ခုကို ကျပန်းရွေးချယ်ပြီး နောက်ဘလော့တစ်ခုဖွဲ့ခြင်း၏ အထူးအခွင့်အရေးပေးသည်။ [ Byzantine fault-torelance ](#byzantine-fault-tolerance-bft) ကို [view change](#view-change) မှတစ်ဆင့်ရရှိသည့်ကွန်ရက်များတွင်ဤအခွင့်အရေးကိုပယ်ဖျက်နိုင်သည်။
