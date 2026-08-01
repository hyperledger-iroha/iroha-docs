---
translation_locale: my
translation_source: /reference/norito.md
translation_source_hash: 4297b0ff795a5cdb6556424e89de7191522271519aa36720ed45a695ad402211
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Norito {#norito}

Norito ရှိသည် Iroha ဒါက peers တွေမှာသုံးတဲ့ byte format ပါ။ SDKs, CLI ကိရိယာများ၊ Torii, Kura, ထုတ်လုပ်ထားတဲ့ လက်ရာတွေဟာ တူညီတဲ့ အသုံးဝင် ဝန်ဆောင်မှုအတွက် သဘောတူဖို့လိုပါတယ်။

Norito ကို အသုံးပြုပါ အချက်အလက်များသည် သဘောတူညီချက်၊ လက်မှတ်ရေးထိုးခြင်း၊ ဟက်ရှ်လုပ်ခြင်း၊ တည်ငြိမ်မှု သို့မဟုတ် SDK အပြန်အလှန်ဆက်သွယ်နိုင်စွမ်း၏ တစ်စိတ်တစ်ပိုင်းဖြစ်သည့်အခါ။ အဆုံးသတ်မှတ်တိုင်တစ်ခုသည် operator များ၊ dashboard များသို့မဟုတ်မြန်ဆန်စွာ debugging အတွက် လူသားဖတ်ရှုနိုင်သော ပရိုဂျက်ရှင်းကို ရှင်းလင်းစွာပေးတဲ့အခါမှာ JSON ကိုအသုံးပြုပါ။

## Norito ပေါ်ပေါက်ရာ {#where-norito-appears}

|မျက်နှာပြင်|Norito ကို အသုံးပြုပုံ |
| --- | --- |
|ငွေလဲလှယ်မှုနှင့် မေးမြန်းချက်များ|Torii မှတစ်ဆင့် ပေးပို့သော လက်မှတ်ရေးထိုးထားသော ငွေချေးမှုနှင့် မေးမြန်းချက်များအတွက် အသုံးဝင်ပစ္စည်းများကို Norito ဟု ကုဒ်သွင်းထားသည်။ |
|ဇာတိကဏ္ဍ |`kagami genesis sign` သည် စတင်ချိန်တွင် peer load ကိုလုပ်သော လက်မှတ်ထိုးထားသော `.nrt` ဘလော့ကိုထုတ်ပေးသည်။ |
|Torii ရိုက်ထည့်ထားတဲ့ တုံ့ပြန်မှု |Typed binary responses ကိုထောက်ပံ့တဲ့ Endpoint တွေမှာ `Accept: application/x-norito` ကိုသုံးပါတယ်။ |
|SDKs | Rust, Python, JavaScript, Kotlin/Java, Swift, နှင့် Android ဖောက်သည်များ အသုံးပြု Norito လက်နဲ့လုပ်ထားတဲ့ byte တွေအစား builds (သို့) bindings တွေပါ။ |
|Kura သိုလှောင်ခြင်း |Block payloads, recovery sidecars, rosters နဲ့ commit markers တွေကို Norito ဖွဲ့စည်းထားတဲ့ ဒေတာအဖြစ် သိမ်းထားတယ်။ |
|ပြသချက်များ|Nexus, ဒေတာရရှိနိုင်မှု, SoraFS, streaming နှင့် app-facing manifest များကို အသုံးပြုခြင်း Norito သည် manifest ကို လက်မှတ်ထိုးရန် သို့မဟုတ် hash လုပ်ရန်လိုအပ်သည်။ |
|Streaming ကို|Norito Streaming က Norito manifest တွေ၊ segment headers တွေ၊ control frames တွေနဲ့ conformation fixtures တွေကို သုံးတယ်။ |

Norito သည် စမတ်စာချုပ်ဘာသာစကားမဟုတ်ပေ။ ငွေပေးချေမှု၊ စာချုပ်ခေါ်ဆိုမှုများ၊ ထုတ်ပြန်ချက်များနှင့် API အသုံးဝင်ဝန်ဆောင်မှုများကို သယ်ယူပို့ဆောင်သော သတ်မှတ်ရေးအဖုံးနှင့် codec ဖြစ်သည်။

## အသုံးဝင် ဝန်ဆောင်မှု ပုံစံ {#payload-model}

အွန်လိုင်း (သို့) ဒစ်ကပ်ပေါ်ရှိ Norito အသုံးဝင်ဝန်ဆောင်မှုတိုင်းကို ခေါင်းစဉ်တစ်ခုနဲ့ ဖွဲ့စည်းထားပြီးနောက် ကုဒ်သွင်းထားတဲ့ အသုံးဝင် ဝန်ဆောင်မှု ဘိုင်က်များဖြင့် လိုက်ပါသည်။ ခေါင်းစဉ်မဲ့ (သို့မဟုတ်) ပိတ်ထားသော အသုံးဝင်ဝန်ပိုးများကို ပြည်တွင်း hashing, benchmarks နှင့် helper APIs အတွက် သီးသန့်သတ်မှတ်ထားပြီး ပို့ဆောင်ခြင်းမတိုင်မီ ရလဒ်ကို ချက်ချင်း ခေါင်းစဉ်တစ်ခုထဲထည့်သွင်းပေးသည်။

|ခေါင်းစဉ် ကွင်း |အရွယ်အစား|ရည်ရွယ်ချက်|
| --- | ---: | --- |
|မှော်ဆန်ခြင်း|4 byte |ASCII `NRT0` ကို Norito မဟုတ်တဲ့ အချက်အလက်တွေကို အစောပိုင်းမှာ ပယ်ချဖို့ သုံးပါတယ်။ |
|ဗိုလ်မှူး|1 byte |အဓိကဗားရှင်းကို Format လုပ်ပါ။ လက်ရှိ အသုံးအဆောင်များမှာ `0` ကို အသုံးပြုပါတယ်။ |
|အသေးစား |1 byte |v1 အတွက် decode ညွှန်ပြချက်။ လက်ရှိတန်ဖိုးက `0x00` ။ အလံများ layout ကိုဖော်ပြသည်။ |
|Schema hash |၁၆ ဘိုက်များ|မမျှော်လင့်တဲ့ အသုံးဝင်မှုများကို ပယ်ချရန် Typed Decoders များက အသုံးပြုသော Type Identity ကို။ |
|compression ကို|1 byte |`0 = None`, `1 = Zstd`. မသိတဲ့ တန်ဖိုးတွေကို ပယ်ချလိုက်ပါတယ်။ |
|အသုံးဝင် ဝန်ဆောင်မှု အလျား|8 byte | သေးငယ်တဲ့ အန်ဒီယန်းအဖြစ် ဖိအားမရတဲ့ အသုံးဝင် ဝန်ဆောင်မှုအလျား `u64`. |
|CRC64 |8 byte |CRC64-XZ ကန့်သတ်မထားတဲ့ အသုံးဝင် ဝန်ဆောင်မှုအတွက် စစ်ဆေးချက်အရေအတွက်။ |
|အလံများ|1 byte |ရှည်လျားမှု အသေးစား၊ ထုပ်ပိုးထားတဲ့ အစီအစဉ်များနဲ့ ထုပ်ပိုးထားသော structs များအတွက် Layout Flags တွေ။ |

ခေါင်းစဉ်မှာ ဘိုင်တာ ၄၀ ရှိသည်။ decoders တွေက ရိုက်နှိပ်ထားတဲ့ တန်ဖိုးကို ပြန်လည်တည်ဆောက်မပေးခင် မှော်ဆန်မှု၊ ဗားရှင်း၊ ထောက်ပံ့တဲ့ အလံမျက်နှာဖုံး၊ အသုံးဝင်မှုအလျား၊ စစ်ဆေးချက်အရေအတွက်နဲ့ schema hash ကို validate လုပ်တယ်။

## အလှဆင်မှု အလံများ {#layout-flags}

Norito နောက်ဆုံး header byte မှာ layout ရွေးချယ်မှုကို သိုလှောင်တယ်။ default v1 အကူတွေက emit လုပ်ပါတယ်။ `COMPACT_LEN` (`0x02`) အတွက် ကွန်ကက်တန်ဖိုးတိုင်းအလျား prefixes များအတွက်။ အမည်ပေးသူများ code ကို `flags = 0x00`.

|အလံ|Hex |အခြေအနေ |သက်ရောက်မှု|
| --- | ---: | --- | --- |
|`PACKED_SEQ` |`0x01` |ထောက်ပံ့ |အပြောင်းအလဲ အရွယ်အစား စုစုပေါင်းတွေကို Offset Table နဲ့ ဆက်စပ်တဲ့ Data Block တစ်ခုနဲ့ Code လုပ်ပေးပါတယ်။ |
|`COMPACT_LEN` |`0x02` |အလိုအလျောက်|တစ်တန်ဖိုးအလျား ကြိုတင်ညွှန်းကိန်းများအတွက် Canonical Unsigned varints ကိုအသုံးပြုသည်။ |
|`PACKED_STRUCT` |`0x04` |ထောက်ပံ့ |ကိုဒ်များမှထုတ်လုပ်ထားသော structs များကို packed field payloads အဖြစ်ပါ ၀ င်သည်။|
|`VARINT_OFFSETS` |`0x08` |ကန့်သတ်ထားပါတယ်|v1 မှာ ပယ်ချထားတယ်၊ pack-sequence offsets တွေဟာ fixed-width `u64` ပါ။ |
|`COMPACT_SEQ_LEN` |`0x10` |ကန့်သတ်ထားပါတယ်|v1 မှာ ပယ်ချထားတယ်။ အထက်တန်းအဆင့် အစဉ်အမြစ်အရှည် ခေါင်းစဉ်တွေဟာ တည်ငြိမ်တဲ့ ကျယ်ပြန့်မှု `u64` ပါ။ |
|`FIELD_BITSET` |`0x20` |လိုအပ်ချက်များဖြင့် ထောက်ပံ့ခြင်း |Packed strokes များအတွက် bitset ကိုထည့်ပေးသည်၊ ထို့ကြောင့် explicit size များလိုအပ်သော field များတွင်သာ size prefixes များပါဝင်သည်။ `PACKED_STRUCT` နှင့် `COMPACT_LEN` တို့ကိုလိုအပ်သည်။ |

Flag တွေက ရှင်းလင်းပါတယ်။ decoders တွေဟာ payload ပုံစံ၊ version minor (သို့) heuristics ကနေ layout ကို မဆုံးဖြတ်ကြပါဘူး။ မသိတဲ့ (သို့) မတည်ငြိမ်တဲ့ ပေါင်းစပ်မှုတွေကို ပယ်ချထားပြီး peers အားလုံးဟာ payload တစ်ခုကို တစ်နည်းတည်း interpret လုပ်နိုင်အောင်ပါ။

## ကုဒ်ရေးစည်းမျဉ်းများ {#encoding-rules}

Norito သည် Iroha ဒေတာပုံစံတွင် ဖော်ပြထားသော ပုံမှန်ဒေတာပုံစံများအတွက် deterministic layouts များကို အသုံးပြုသည်-

- ကြိုးများမှာ `[len][utf8-bytes]` ဖြစ်ပြီး `len` သည် ဖွင့်ထားပါက `COMPACT_LEN` ကို နောက်ဆက်တွဲဖြစ်ပါသည်။
- `COMPACT_LEN` ကို သတ်မှတ်တဲ့အခါ တန်ဖိုးတစ်ခုချင်းအလျားက ကန့်သတ်ထားတဲ့ varint ကိုသုံးတယ်။
- `COMPACT_LEN` မရှိပါက တန်ဖိုးတစ်ခုချင်းအလျားသည် 8-byte little-endian `u64` ဖြစ်ပါသည်။
- Sequence length headers တွေကို v1 မှာ fixed 8-byte little-endian `u64` လို့ သတ်မှတ်ထားပါတယ်။
- `Vec<u8>` ကို ဘိုက်တစ်ဘက် တစ်လျားအစား `[len_u64][raw-bytes]` အဖြစ် ကုဒ်သွင်းထားသည်။
- Packaged sequences use `(len + 1)` monotonic `u64` offsets followed by the concatenated element payloads (ပိတ်ဆက်ထားသော အစိတ်အပိုင်းများ၏ အသုံးဝင်ဝန်ဆောင်မှုများ)
- မြေပုံများတွင် `u64` နှင့် တည်ငြိမ်သော စာရင်းဝင်စာရင်းများကို ကုဒ်သွင်းထားပြီး သတ်မှတ်ချက်ဆိုင်ရာ သော့အစီအစဉ်ကို အသုံးပြုသည်။ `HashMap` စာရင်းများသည် ကုဒ်သွင်းရန်မတိုင်မီ သော့အလိုက် အမျိုးအစားခွဲခြားခြင်းခံထားရသည်၊ `BTreeMap` သည် ၎င်း၏ သဘာဝအစီစဉ်ကို အသုံးပြုသည်။
- `BigInt` သည် `u32` byte အလျားနှင့် 512-bit cap နှင့်အတူအသေးစား endian နှစ်'s complement bytes ကိုအသုံးပြုသည်။
- `Numeric` ကို `(mantissa, scale)` အဖြစ် ကုဒ်သွင်းထားပြီး mantissa က integer value ကို သိမ်းဆည်းပြီး scale က fractional digits တွေကို သိမ်းဆည်းပါတယ်။

ဒီစည်းမျဉ်းတွေဟာ လက်မှတ်တွေနဲ့ hash တွေအတွက် အရေးပါပါတယ်။ အလားတူ ယုတ္တိတန်တဲ့ ငွေကြေးပူးပေါင်းမှုကို တည်ဆောက်တဲ့ SDKs နှစ်ခုဟာ တူညီတဲ့ တရားဝင် ဘိုက်တွေ ထုတ်ဖို့လိုတယ်။

## အစီအစဉ် Hashes များ {#schema-hashes}

Typed Norito payloads သည် ခေါင်းစဉ်တွင် 16-byte schema hash ကို သယ်ဆောင်သည်။ အလိုအလျောက် hash သည်အပြည့်အဝသတ်မှတ်ထားသောအမျိုးအစားနာမည်မှရယူထားသည်။ တည်ဆောက်မှု schema hashing ကိုခွင့်ပြုသည့် build များသည် hash ကို Canonical schema မှရယူသည်။

Typed decoders သည် schema မညီမျှမှုကို ပယ်ချသည်။ ဤသည်မှာ client များအား valid Norito frame ကို မှားယွင်းသောအမျိုးအစားအဖြစ် ကျပန်းစွာ decoding လုပ်ခြင်းမှ ကာကွယ်ပေးပြီး SDK fixure bundle က node data model မှ drift သွားသောအခါ ပုံမှန် ပျက်ကွက်မှု mode ဖြစ်ပါသည်။

## compression နဲ့ acceleration {#compression-and-acceleration}

Norito သည် logical payload ကိုပြောင်းလဲခြင်းမရှိဘဲ explicit နှင့် adaptive compression ကိုထောက်ပံ့သည်။

|ကဏ္ဍ |ရည်ရွယ်ချက်|
| --- | --- |
|`to_bytes` |ခေါင်းစဉ်ကို ကုဒ်ပေးပြီး နောက်မှာ ဖိမထားတဲ့ အသုံးဝင် ဝန်ဆောင်မှုပါ။ |
|`to_compressed_bytes` |Zstd နဲ့ encode လုပ်ပြီး header ထဲမှာ compression tag ကို မှတ်တမ်းတင်ပါ။ |
|`to_bytes_auto` |compression က တန်ဖိုးရှိလားဆိုတာကို ဆုံးဖြတ်ဖို့ deterministic heuristics ကို သုံးပါ။ |
|CRC64 အရှိန်မြှင့်ခြင်း |နေရာတိုင်းမှာ portable CRC64-XZ ကိုသုံးပြီး CLMUL ကို x86_64 သို့မဟုတ် PMULL ကို aarch64 တွင်ရရှိနိုင်ပါက။ |
|GPU CRC64 နှင့် ဖိအားပေးခြင်း|ရွေးချယ်စရာ Metal (သို့) CUDA အကူပစ္စည်းတွေက ကြီးမားတဲ့ အသုံးဝင်ဝန်ဆောင်မှုတွေကို အရှိန်မြှင့်နိုင်ပြီး CPU လမ်းကြောင်းတွေဆီ ပြန်ကျသွားနိုင်ပါတယ်။ |

Hardware အရှိန်မြှင့်ခြင်းသည် decoded content ကို ဘယ်တော့မှမပြောင်းလဲစေပါ။ CRC နှင့် JSON အရှိန်လျှော့စက်များသည် portable output bit-for-bit ကိုက်ညီရမည်ဖြစ်သည်။ Zstd frame bytes သည် CPU နှင့် GPU encoders တို့အကြားကွဲပြားနိုင်သော်လည်း decoded payload နှင့် Norito ခေါင်းစဉ် metadata များသည် validation အတွက် deterministic ဖြစ်နေဆဲဖြစ်သည်။

## JSON ထောက်ပံ့မှု {#json-support}

Norito သည် Norito အမျိုးအစားစနစ်မှ ထွက်ခွာခြင်းမရှိဘဲ JSON လိုအပ်သော အဆုံးအမှတ်များနှင့် ကိရိယာများအတွက် ဒေသခံ JSON stack ကိုပါ ၀ င်သည်။

|JSON feature ကို |အသုံးပြုမှု ကိစ္စ|
| --- | --- |
|`norito::json::{to_json, from_json}` |Deterministic typeed JSON code/decode ကိုနှိပ်ပါ။ |
|လှပပြီး စာရေးဆရာရဲ့ အကူအညီပေးသူပါ။|CLI ထုတ်ကုန်များ၊ ကိရိယာများနှင့် streaming `std::io` ပေါင်းစပ်ခြင်း။ |
|DOM တန်ဖိုးများ |Norito ရဲ့ JSON တန်ဖိုးပုံစံကနေ ပရိုဂရမ်ဆန်တဲ့ ညှိနှိုင်းမှု။ |
|အမြန်ရိုက် JSON |DTO အပူလမ်းကြောင်းများအတွက် တည်ဆောက်မှုအခွံအခြေခံ decode/encode. |
|Zero Copy Reader ကို အသုံးပြုပါ|သွင်းချက်ကနေ ကြိုးတွေကို ချေးယူတဲ့ အမှတ်တံဆိပ် စကင်လုပ်ခြင်း။ |
|အဆင့် (၁) အရှိန်မြှင့်စက်များ |ရွေးချယ်စရာ AVX2, NEON, သတ္တု (သို့) CUDA တည်ဆောက်မှု အညွှန်းကိန်းချခြင်း scalar fallback ဖြင့်။ |

Iroha code ကို prefer လုပ်သင့်ပါတယ်။ `norito::json` အထောက်အပံ့ပစ္စည်းများ API အသုံးဝင်သော ဝန်ဆောင်မှုများ။ `serde_json` ထုတ်လုပ်ရေးလမ်းကြောင်းများအတွက် စကေးနှင့် ကွင်းဆင်းလုပ်ကိုင်မှုအပြုအမူမှ ကွဲပြားသော အန္တရာယ်များ SDKs နှင့် Torii ထုတ်ယူသူ။

## ရင်းမြစ်ထောက်ပံ့မှု {#derive-support}

Rust ဒေတာအမျိုးအစားများတွင် လက်စွဲ codec ကုဒ်အစား derive macros များကို အသုံးပြုသည်။ derive layer သည် Norito ဘိုင်နရီ codecs, schemes နှင့် JSON အကူများကို ထုတ်လုပ်နိုင်ပါသည်။

Common field attributes တွေက အောက်ပါအတိုင်းဖြစ်ပါတယ်

|Attribute ကို|သက်ရောက်မှု|
| --- | --- |
|`#[norito(rename = "other")]` |Schema နှင့် JSON ကိုက်ညီမှုအတွက် တည်ငြိမ်သော serialized နာမည်ကိုအသုံးပြုသည်။ |
|`#[norito(skip)]` |ကုဒ်ရေးသူက ကွင်းကို ချန်ထားတယ်။ decoder က `Default` တန်ဖိုးကို ပေးပို့တယ်။ |
|`#[norito(default)]` |`Default` ကို အသုံးပြုသည် - decoded payload သည် field ကို မဆောင်ပါက။ |
|`#[norito(skip_serializing_if = "...")]` |JSON ကွင်းတွေကို predicate ကိုက်ညီတဲ့အခါ ချန်ထားပြီး deterministic decoding default တွေကို ထိန်းသိမ်းတယ်။ |

Derives များသည် encoded length အညွှန်းများနှင့် exact length calculations များကိုလည်း ဖော်ပြနိုင်သည်။ encoders များသည် ထိုအညွှန်းများကို buffers ကိုစုဆောင်းရန်နှင့် extra copy များကို ရှောင်ရှားရန်အသုံးပြုကြသည်။

## ကတ်ပြားအမှတ်တံဆိပ် {#crate-feature-families}

အရင်းအမြစ်မှ Iroha သို့မဟုတ် SDK ချည်နှောင်မှုများကို တည်ဆောက်ရာတွင်, Norito လုပ်ဆောင်ချက်များသည်အကူအညီများနှင့် အရှိန်မြှင့်စက်များရရှိနိုင်သည့်ရွေးချယ်:

|Feature မိသားစု |အဲဒါက ဘာကို လုပ်ပေးနိုင်လဲ။|
| --- | --- |
|`derive` |ဘိုင်နရီ၊ စခီမားနဲ့ JSON ထုတ်ကုန်တွေအတွက် ပြန်လည်တင်ပို့တဲ့ လုပ်ငန်းစဉ် မက်ကရိုတွေ။ |
|`compression` |Zstd ခေါင်းစဉ်ဖောင်ဒေးရှင်းများအတွက်အကူအညီ။ |
|`packed-seq` |offset tables ကိုသုံးပြီး စုစည်းပုံ layout တွေကို packaged လုပ်ထားတယ်။ |
|`packed-struct` |Packaged derived-generated struct layouts တွေ။ |
|`compact-len` |Varint အတိုင်းအတာအလျား ကြိုတင်စာရင်းများ|
|`columnar` |Norito Column Blocks, adaptive AoS/NCB row codecs, and borrowed views for scan-heavy paths; default `node-codec` feature set ထဲမှာ ထည့်သွင်းထားပါတယ်။ |
|`strict-safe` |မှားယွင်းနိုင်တဲ့ လမ်းကြောင်းတွေထဲက အကြောက်တရားတွေကို ဖွဲ့စည်းထားတဲ့ အမှားတွေအဖြစ် ပြောင်းတယ်။ |
|`simd-accel` |CPU အရှိန်မြှင့်မှု ရှိပါက ဒေသခံကျဆင်းခြင်းနဲ့အတူ။ |
|`json` |ဒေသခံ JSON parser, စာရေးသူ, DOM, ရိုက်ထည့်ထုတ်ကုန်များ, နှင့်မြန်နှုန်းလမ်းကြောင်းများ. |
|`json-std-io` |စာဖတ်သူနဲ့ စာရေးသူ အကူတွေ JSON stack မှာ layered လုပ်ထားတယ်။ |
|`metal-stage1`၊ `cuda-stage1`|ရွေးချယ်စရာ GPU JSON ဗိမာန်အညွှန်း backends များ။ |
|`metal-stage2` |JSON ဖွဲ့စည်းမှု tape အတွက် Metal metadata အမျိုးအစားကို ရွေးချယ်ပါ။ |
|`metal-crc64`၊ `cuda-crc64`|ကြီးမားတဲ့ အသုံးဝင် ဝန်ဆောင်မှုအတွက် ရွေးချယ်စရာ GPU CRC64 အကူပစ္စည်းများ။ |
|`gpu-compression` |Optional Metal (သို့မဟုတ်) CUDA Zstd အရှိန်မြှင့်မှု ကြီးမားသော အသုံးဝင်ဝန်ဆောင်မှုများအတွက်။ |
|`stage1-validate` |အရှိန်မြှင့်ထားတဲ့ JSON တည်ဆောက်မှုအညွှန်းကိန်းတွေကို scalar output နဲ့ နှိုင်းယှဉ်တဲ့ debug validation ကို။ |

SDKs နှင့် release profile တို့အကြားတွင် feature အရင်းအမြစ်ရရှိနိုင်သည်။ wire ပုံစံသည် ဒေသတွင်း build အလံများမှမဟုတ်ဘဲ ခေါင်းစဉ်နှင့် schema မှ ထိန်းချုပ်ထားဆဲဖြစ်သည်။

## Torii နှင့် Norito RPC {#torii-and-norito-rpc}

Torii သည် operator များသောလမ်းကြောင်းများအတွက် JSON ကိုဖေါ်ပြသည်၊ သို့သော်လည်း typeed binary routes များတွင် Norito ကိုအသုံးပြုသည်။ current typeed Norito HTTP ၏ media အမျိုးအစားသည် `application/x-norito` ဖြစ်သည်။

Endpoint တစ်ခုက Norito ရိုက်နှိပ်ပြီး လက်ခံတဲ့အခါ (သို့) ပြန်ပို့တဲ့အခါ ဒီခေါင်းစဉ်တွေကို အသုံးပြုပါ။

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

အပြီးသတ်မှတ်ချက်တစ်ခုက ကိုယ်စားပြုချက် နှစ်ခုစလုံးကို ထောက်ပံ့တဲ့အခါ ဖောက်သည်တွေဟာ ရှင်းလင်းတဲ့ ကြိုက်နှစ်သက်မှု စာရင်းကို ပို့နိုင်ပါတယ်

```http
Accept: application/x-norito, application/json
```

Torii စာလုံးရိုက်ခြင်းအမှားများနှင့် တယ်လီမီထရီဖြင့် ရေတွက်ခြင်းအားဖြင့် decode ကျရှုံးမှုများကိုပေါ်လာစေသည်။ အများဆုံးအကြောင်းပြချက်များမှာ မတည်ငြိမ်သော မှော်ပညာ၊ မထောက်ပံ့သောဗားရှင်း၊ မထောက်ခံသော feature flag, checksum မညီမျှမှု၊ မှားယွင်းသောဖေါ်မြူတာ UTF-8၊ မတည်ငြင်းသော enum tag နှင့် schema မညီမျှခြင်းတို့ဖြစ်သည်။

Norito RPC သယ်ယူပို့ဆောင်ရေးကို သယ်ယူ ပို့ဆောင်ရေး ညွှန်ကြားချက်စနစ်ဖြင့် ရွေးချယ်ပါတယ်။ Operator Dashboards request latency, failures, active connections, response bytes တွေကို ခြေရာခံထားသင့်ပြီး `torii_norito_decode_failures_total` ကွဲပြားစွာ JSON ယာဉ်ကြော။

## Norito စီးဆင်းမှု {#norito-streaming}

Norito Streaming ဟာ မီဒီယာတွေနဲ့ အချိန်နဲ့တပြေးညီ သယ်ယူပို့ဆောင်ရေး မျက်နှာပြင်တွေကို အလားတူ ဆုံးဖြတ်ချက်ချတဲ့ ချဉ်းကပ်မှုကို ကျယ်ပြန့်စေပါတယ်။ အဓိကအပိုင်းတွေက:

|Streaming feature ကို |ရည်ရွယ်ချက်|
| --- | --- |
|ပြသချက်များ|Segment commitments, privacy routes, capabilities, codec profile, encryption suite နဲ့ content key metadata တွေကို ကြေညာပါ။ |
|ကဏ္ဍခေါင်းစဉ်များ |Bind segment number, duration, chunk count, timing, entropy mode, audio summary နဲ့ Merkle root တွေကို ချိတ်ဆက်ပါ။ |
|အစိတ်အပိုင်းဆိုင်ရာ ကတိပေးချက်များ |ကြည့်ရှုသူတွေနဲ့ relays တွေဟာ ဝန်ဆောင်မှု အပိုင်းအစတွေကို မန်နီဖစ်နဲ့ စစ်ဆေးနိုင်အောင် လုပ်ပေးပါ။|
|ထိန်းချုပ်ရေးဘောင်များ |ကြေညာချက်များ၊ ပြန်ကြားချက်များ၊ အဓိက update များနှင့် အရည်အချင်းညှိနှိုင်းမှုများကို ဆောင်ရွက်ပါ။ |
|HPKE အဓိက သတင်းအချက်အလက်များ|ကုန်သွယ်ရေး လျှို့ဝှက်ချက်တွေကို ညှိနှိုင်းထားတဲ့ suite နဲ့ monotonously တိုးပွားနေတဲ့ counter တွေကို သုံးပြီး လည်ပတ်ပါ။ |
|အရည်အချင်း ညှိနှိုင်းမှု |ထောက်ပံ့သော feature bits များ၊ datagram ကန့်သတ်ချက်များ၊ တုံ့ပြန်မှု cadence များနှင့် privacy လိုအပ်ချက်များကို ဖြတ်တောက်သည်။ |
|FEC နှင့် ပြန်ကြားချက်များ |Loss realtime paths များအတွက် deterministic receiver အစီရင်ခံစာများနှင့် parity ဆုံးဖြတ်ချက်များကို အသုံးပြုသည်။ |
|Conformity vectors များ|Cross-language fixtures တွေက SDKs ကို သရုပ်ဖော်ချက်တွေ၊ ကဏ္ဍတွေနဲ့ entropy streams တွေကို dekode လုပ်ဖို့ သက်သေပြတယ်။ |

Streaming-specific codecs နဲ့ entropy profile တွေဟာ core Norito transaction/query format ကနေ ခွဲခြားထားပေမဲ့ ၎င်းတို့ရဲ့ manifesto တွေနဲ့ control data တွေက Norito ကို သုံးတုန်းပဲဆိုတော့ routing, billing, replay နဲ့ audit evidence တွေကို ပြန်လည်ဖန်တီးနိုင်တာပါ။

## လုပ်ငန်းဆိုင်ရာ လမ်းညွှန်ချက်များ {#operational-guidance}

- SDK ဆောက်လုပ်ရေးကိရိယာများနှင့် ထုတ်လုပ်သော ချည်နှောင်မှုများကို လက်နဲ့ထုတ်လုပ်သည့် Norito ဘိုက်များထက် ပိုနှစ်သက်သည်။
- Schema ကွဲပြားမှုကို အပြောင်းအလဲရှိတဲ့ ကွန်ရက် ပျက်ကွက်မှုအဖြစ်မဟုတ်ဘဲ ဗားရှင်း (သို့) ကိရိယာ ပြဿနာတစ်ခုအဖြစ် ကုသပါ။
- Archive `.nrt`, `.norito` နဲ့ ဒါတွေကို ထုတ်ပေးခဲ့တဲ့ release (သို့) incident bundle ထဲက manifest artefacts တွေပါ။
- Norito ကို လက်မှတ်ထိုးထားသော၊ hashed သို့မဟုတ် persistent data များအတွက် အမှန်တရားအရင်းအမြစ်အဖြစ် အသုံးပြုပါ။ dashboard များနှင့်လက်စွဲစစ်ဆေးမှုများအတွက် JSON ခန့်မှန်းချက်များကိုအသုံးပြုပါ။
- Torii အပြီးသတ်မှတ်ချက် အသစ်တစ်ခု ထပ်ထည့်တဲ့အခါ JSON၊ Norito သို့မဟုတ် နှစ်ခုစလုံးကို လက်ခံတာ မှတ်တမ်းတင်ပြီး `/openapi` မှာထောက်ပံ့တဲ့ အကြောင်းအရာအမျိုးအစားတွေကို ဖော်ပြပါ။
- accelerator ကို activate မလုပ်ခင် scalar output နဲ့ parity test တွေကို run လုပ်ပါ။ accelerator ကျရှုံးရင် deterministic scalar fallback ကို အသုံးပြုလိုက်ပါ။ payload semantics ကတော့ ပြောင်းမသွားရပါဘူး။

## ဆက်စပ် စာမျက်နှာများ {#related-pages}

- [Torii အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md)
- [Genesis ကို ရည်ညွှန်းချက် ](/my/reference/genesis.md)
- [ဒေတာပုံစံ အစီအစဉ်](/my/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK](/my/guide/tutorials/javascript.md)
- [Python SDK ](/my/guide/tutorials/python.md)
- [Swift နှင့် iOS SDK](/my/guide/tutorials/swift.md)

## အထက်ပိုင်းဆိုင်ရာ ရည်ညွှန်းချက်များ {#upstream-references}

- [Norito ပုံစံ သတ်မှတ်ချက်များ](https://github.com/hyperledger-iroha/iroha/blob/main/norito.md)
- [Norito သေတ္တာ README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/norito/README.md)
