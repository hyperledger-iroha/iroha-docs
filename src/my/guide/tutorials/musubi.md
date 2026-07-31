---
translation_locale: my
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama အိတ်များ {#musubi-kotodama-packages}

Musubi သည် Kotodama အရင်းအမြစ်အိတ်များအတွက် package manager ဖြစ်သည်။ ၎င်းသည်ဖွံ့ဖြိုးသူများအား Compotable Kotodama လုပ်ဆောင်ချက်များကိုမျှဝေနိုင်ရန် Cargo လို Workflow ကိုပေးပြီး ကမ္ဘာလုံးဆိုင်ရာ ပထမဦးဆုံးလာနာမည်ဇယားအစား SORA နှင့် Iroha နာမည်နေရာများနှင့်ပူးပေါင်း၍ package identity ကိုဆက်သွယ်ထားသည်။

Musubi ကို အသုံးပြုပါ-

- ပြန်လည်သုံးနိုင်သော Kotodama အရင်းအမြစ်စာကြည့်တိုက်များကို ထုတ်ဝေခြင်း
- `Musubi.lock` တွင် တိကျသော အပြောင်းအရွှေ့ အရင်းအမြစ် မှီခိုမှုများကို pin
- verified SoraFS Archive commitments များမှ မှီခိုမှု အရင်းအမြစ်ကို ပြန်လည်ပြုပြင်ခြင်း
- package name space ကို dapp စာချုပ်အမည်များနှင့်အတူတူသော namespace တွင်ဆက်သွယ်ပါ။
- ကွင်းဆက်အတွင်းရှိ မှတ်ပုံတင်စနစ်မှတစ်ဆင့် package များကို စစ်ဆေးခြင်း၊ ထုတ်ဝေခြင်း၊ ဆွဲထုတ်ခြင်း သို့မဟုတ် အမည်မဖော်လိုပါ။

## Package အမည်များ {#package-names}

Canonical Package IDs အသုံးပြုခြင်း

```text
namespace/package
```

အတိအကျ ထုတ်ပြန်မှု ရည်ညွှန်းချက် အသုံးပြုခြင်း:

```text
namespace/package@version
```

`@` ကို နာမည်နေရာရှေ့တွင် ဦးဆောင်မထားပါ။ `@` ကွာခြားရေးကိရိယာကို မူကွဲနောက်ဆက်တွဲအတွက် သီးသန့်သတ်မှတ်ထားသည်။

နာမည်နေရာ segment က Kotodama dapp contract aliases တွေမှာ အသုံးပြုတဲ့ suffix နဲ့ ကိုက်ညီပါတယ်။

|Package ID ကို |ဆက်စပ်သော စာချုပ်အမည်များ ပုံစံ |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

`<dataspace>` သို့မဟုတ် `<domain>.<dataspace>` ပုံစံရှိသည်။ package တစ်ခုမှာ dapp link ရှိပါက Musubi သည် linked contract alias တစ်ခုစီသည် package နှင့်အတူ namespace suffix ကိုသာ အသုံးပြုသည်ကိုစစ်ဆေးသည်။

## ပေါ်လစီ {#manifest}

အိတ်တစ်ခုသည် `Musubi.toml` ဖြင့် စတင်သည်။

```toml
[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"

[exports]
functions = ["quote"]

[dapp]
namespace = "dex.universal"
contracts = ["router::dex.universal"]
```

မှီခိုချက်တွေဟာ တိကျတဲ့ ဗားရှင်းတွေ၊ ဂရုစိုက်မှု လိုအပ်ချက်တွေ၊ ကန့်သတ်ချက်တွေ၊ `1.*` လို wildcard တွေ (သို့) `>=1.0.0,<2.0.0` လို နှိုင်းယှဉ်စာရင်းတွေကို အသုံးပြုနိုင်ပါတယ်။

`Musubi.lock` ကွင်းဆက်ရေစာရင်းမှ ရွေးချယ်သော ကူးပြောင်းဂရပ်ကို မှတ်တမ်းတင်သည်။ ပိတ်ထားသည့် node တစ်ခုစီသည် ၎င်း၏ Canonical package ref၊ ရွေးချယ်သောလိုအပ်ချက်, SoraFS manifest digest, source archive hash, byte count, file count, exported functions များ၊ deterministic source archive plan နှင့် dependence aliases တို့ကို သိမ်းဆည်းထားပါသည်။ Short aliases တွေကို lock file ထဲ မဝင်ခင်မှာ ဖြေရှင်းပေးပါတယ်။

## ဒေသတွင်း အလုပ်ခွင် {#local-workflow}

Upstream Iroha workspace root မှ Musubi ကို Cargo ကနေ run လုပ်ပါ။

```bash
cargo run -p musubi -- init --namespace dex.universal --name swap-core --dapp
cargo run -p musubi -- add std.universal/math --version '^1.0.0' --alias math
cargo run -p musubi -- install --config client.toml
cargo run -p musubi -- build src/lib.ko --manifest-out target/lib.contract.json
cargo run -p musubi -- pack \
  --car-out source.car \
  --sorafs-manifest-out manifest.norito \
  --source-plan-out source-plan.norito
```

`install --offline` ကို အသုံးပြုပြီး node တစ်ခုကို မေးစရာမလိုဘဲ exact-version dependencies အတွက် ဖြေရှင်းမထားသေးတဲ့ lockfile ကို ရေးပါ။ CI တွင် `install --locked` ကို သုံးပြီး ခေတ်နောက်ကျသော lockfile ကို ပယ်ချပါ။

`build` သည် `math::add()` ကဲ့သို့သောခေါ်ဆိုချက်များကို deterministic internal Kotodama function နာမည်များသို့ ပြန်လည်ရေးသားခြင်းဖြင့် cached မှီခိုမှုအရင်းအမြစ်များကို ချိတ်ဆက်သည်။ ၎င်းသည် dependence ကတင်ပို့မထားသော function များအားခေါ်ဆိုခြင်းကို ပယ်ချသည်။ Musubi v1 စာြကည့်တိုက်များသည် function-only ဖြစ်သည်: state declarations များ၊ trigger များ၊ kotoba blocks များ၊ constants များ သို့မဟုတ် function မပါသော အခြားစာချုပ်အစိတ်အပိုင်းများပါဝင်သော dependence source များကို ပယ်ချသည်။

## အရင်းအမြစ် Archives ကိုယူခြင်း {#fetching-source-archives}

Musubi သည် cache command များမှတစ်ဆင့် (သို့) နောက်ပိုင်းတွင် ဖြေရှင်းနေစဉ် ပျောက်ဆုံးသော မှီခိုမှုအရင်းအမြစ်များကိုရှာဖွေနိုင်သည်။

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

တိုက်ရိုက်ဂိတ်တံခါးခေါ်ယူမှုမှာ SoraFS ဂိတ်တံခါးပေးသွင်းသူရဲ့ သတ်မှတ်ချက်တစ်ခု (သို့မဟုတ်) ပိုများပါတယ်။

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

ဝန်ဆောင်မှုပေးသွင်းသူ၏ အသုံးဝင်ဝန်ဆောင်မှု ဖိုင်များနှင့် ဂိတ်တံခါး ပေးသွင်းသူများသည် တစ်ကြိမ်တည်းယူခြင်းလုပ်ငန်းအတွက် အချင်းချင်း သီးခြားခွဲခြားသည်။ ပိတ်ထားသောပက်ကတ်တစ်ခုထက်ပို၍ပျောက်နေပါက `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` သို့မဟုတ် `manifest=<64-hex SoraFS manifest digest>` တို့ဖြင့်ဂိတ်တံခါးပေးပို့သူတိုင်းကို ကန့်သတ်ပါ။

Gateway ကို `base-url` နှင့် `privacy-url` တန်ဖိုးတွေကို အသုံးပြုရပါမယ်။ `https://` Local test gateways တွေကို အသုံးပြုနိုင်ပါတယ်။ `http://localhost`, `http://127.0.0.1`, ဒါမှမဟုတ် `http://[::1]` ပဲ `--gateway-allow-insecure-localhost`. Stream tokens တွေဟာ runtime ခွင့်ပြုချက်တွေဖြစ်ပြီး `Musubi.lock`.

## ထုတ်ဝေခြင်း {#publishing}

`pack` သည် deterministic BLAKE3-256 source archive hash ကိုပေါင်းပြီး source byte နှင့် file counts များကို တွက်ချက်သည်။ `--car-out`, `--sorafs-manifest-out` သို့မဟုတ် `--source-plan-out` ကိုပေးသွင်းတဲ့အခါမှာ deterministic SoraFS CAR payload ကိုလည်း တည်ဆောက်သည်, SoraFS manifest၊ Musubi အရင်းအမြစ်ဖိုင်အစီအစဉ်ကို အလားတူအရင်းအမြစ် ဖိုင်အစီစဉ်မှ။

မထုတ်ဝေခင် ခြောက်သွေ့ဆေးကို သုံးပါ။

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

`--dry-run` မရှိဘဲ `publish` သည် default artefacts များကို `.musubi/dist/<namespace>/<name>/<version>/` အောက်တွင် ရေးသားပေးသည်၊ ရွေးချယ်၍ Torii ၏ SoraFS storage-pin endpoint မှတစ်ဆင့် manifest နှင့် payload ကို upload လုပ်ပေးသည်၊ `--upload` နှင့်အတူထုတ်လုပ်ထားသော SoraFS pin ကို မှတ်ပုံတင်ပြီး ဖွဲ့စည်းထားသော Iroha client မှတစ်ဆင့် `PublishMusubiRelease` ကိုပို့သည်။

ထုတ်ပြန်ထားသော သတင်းအချက်အလက်များတွင် အောက်ပါအတိုင်း ပါဝင်ရမည်-

- အလွတ်မဟုတ်တဲ့ Canonical Source Archive တစ်ခု
- စိစစ်ရေးအရင်းအမြစ် မှတ်တမ်း အစီအစဉ်
- အနည်းဆုံး တင်ပို့သော Kotodama function တစ်ခု
- ချို့ယွင်းမှု မှတ်တမ်းများတွင် ဆွဲထုတ်ထားသော ထုတ်လွှင့်ချက်များကို ရွေးချယ်ခြင်းမရှိပါ။
- dapp link တစ်ခုရှိပါက စာချုပ်အမည်များသည် package name space နှင့် ကိုက်ညီသော aliases များဖြစ်ပါသည်။

## မှတ်ပုံတင် မေးမြန်းချက်များနှင့် သက်တမ်း စက်ဝန်း {#registry-queries-and-lifecycle}

မှတ်ပုံတင်ကို ရှာဖွေစစ်ဆေးပါ

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Yanking က resolution အသစ်ကနေ release ကို ဖုံးကွယ်ပေမဲ့ ရှိနေတဲ့ lockfiles တွေကို ပြန်လည်ဖန်တီးနိုင်အောင် ထိန်းထားတယ်။

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi သည် `namespace/package` ကို Canonical Package နာမည်အဖြစ်ပြုလုပ်ခြင်းအားဖြင့် Global Name Squatting ကိုရှောင်ရှားသည်။ နာမည်နေရာတစ်ခုသို့ ထုတ်ဝေခြင်းကို Kotodama dapp နာမည်နေရာအတွက်အသုံးပြုသော ပိုင်ဆိုင်မှု သို့မဟုတ် လွှဲပြောင်းခွင့်မော်ဒယ်တစ်ခုတည်းမှ ခွင့်ပြုရမည်။ Curated global short aliases are separate from package ownership: `SetMusubiShortAlias` သည် `CanSetMusubiShortAlias` ခွင့်ပြုချက်လိုအပ်ပြီး ရည်မှန်းချက်ပက်ကတ်မှာ အနည်းဆုံးလက်ရှိထုတ်ဝေမှုတစ်ခုခု ရှိဖို့လိုပါတယ်။

## Iroha မျက်နှာပြင်များ {#iroha-surfaces}

Musubi သည် ပထမတန်းစား Iroha ညွှန်ကြားချက်များနှင့် မေးမြန်းမှုများကို အသုံးပြုသည်-

|မျက်နှာပြင်|ရည်ရွယ်ချက်|
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |မပြောင်းလဲနိုင်တဲ့ package release ကို ထုတ်ဝေပါ။ |
|`YankMusubiRelease` |လက်ရှိ ထုတ်လွှင့်ထားတာကို ဆွဲထုတ်ထားတယ်လို့ မှတ်ချက်ပြုပါ။|
|`SetMusubiShortAlias` |ကောက်ချက်ထားတဲ့ ကမ္ဘာလုံးဆိုင်ရာ အမည်တိုကို Package ID နဲ့ ချိတ်ဆက်ပါ။ |
|`AssertMusubiReleaseExists` |တိကျတဲ့ package version ရှိဖို့ လိုအပ်တယ်။ |
|`FindMusubiReleaseByRef` |တိကျတဲ့ package reference နဲ့ ထုတ်ပေးပါ။ |
|`FindMusubiPackageVersions` |Package ID အတွက် Versions များကို စာရင်းပေးပါ။ |
|`FindMusubiPackageReleases` |Package ID အတွက် ထုတ်ပြန်ချက် အကျဉ်းချုပ်များကို စာရင်းထည့်ပါ။ |
|`SearchMusubiPackages` |အမည်နေရာနဲ့ စာသားအလိုက် package summaries တွေကို ရှာပါ။ |
|`FindMusubiShortAliasByName` |ကိုင်တွယ်ထားတဲ့ အမည်မဖော်လိုသူကို ဖြေရှင်းပါ။|

Torii ပွင့်လင်းမြင်သာမှု Musubi HTTP အောက်က လမ်းကြောင်း မိသားစု `/v1/musubi/`. ကိုယ်စားလှယ်ကို မျက်နှာမူ MCP ကိရိယာများအား `iroha.musubi.` အမည်မဖော်လိုသူတွေ၊ [Torii အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md) နှင့် [မေးမြန်းချက် အချက်အလက်များ](/my/reference/queries.md) ပိုကျယ်ပြန့်တဲ့အတွက် API မြေပုံပါ။
