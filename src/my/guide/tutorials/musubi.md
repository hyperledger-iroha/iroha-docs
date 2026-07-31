---
translation_locale: my
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama အိတ်များ {#musubi-kotodama-packages}

Musubi package manager ဖြစ်ပါတယ် Kotodama source packages တွေကို ပေးပါတယ်။
Compotable မျှဝေရန် Cargo လို Workflow ကိုဖွံ့ဖြိုးရေး Kotodama လုပ်ဆောင်ချက်များ
အိတ်အထုပ်ရဲ့ ကိုယ်ပိုင်လက္ခဏာကို ဆက်စပ်ထားရင်း SORA နှင့် Iroha နာမည်နေရာတွေအစား
ကမ္ဘာလုံးဆိုင်ရာ ပထမဦးဆုံး လာတဲ့ နာမ်စားဇယားပါ။

အသုံးပြုခြင်း Musubi လိုအပ်တဲ့အခါမှာ-

- ပြန်လည်အသုံးပြုနိုင်သော ထုတ်ဝေခြင်း Kotodama အရင်းအမြစ် စာကြည့်တိုက်များ
- အတိအကျအပြောင်းအရွှေ့ အရင်းအမြစ် မှီခိုမှုများကို pin in `Musubi.lock`
- စစ်ဆေးထားတဲ့ မှီခိုမှု အရင်းအမြစ်ကို ပြန်လည်ပြုပြင်ခြင်း SoraFS လက်မှတ်ရေးထိုးထားသော တာဝန်များ
- dapp စာချုပ်အမည်များအတွက် package namespace ကို ဆက်သွယ်ပေးပါ
  နာမည်နေရာ
- ချိတ်ဆက်ထားတဲ့ မှတ်ပုံတင်ကနေ စာရွက်စာတမ်းတွေကို စစ်ဆေး၊ ထုတ်ဝေ၊ ဆွဲထုတ် (သို့) အမည်မဖော်လိုပါ။

## အိတ်အမည်များ {#package-names}

Canonical Package ID များ အသုံးပြုခြင်း

```text
namespace/package
```

အတိအကျ ထုတ်ပြန်ချက် ကိုးကားမှု အသုံးပြုခြင်း

```text
namespace/package@version
```

ဦးဆောင်သူ မရှိဘူး။ `@` နာမည်နေရာတစ်ခုထက်ပိုပါတယ်။ `@` ခွဲခြားရေးကိရိယာက သီးသန့်ထားတယ်။
စာလုံးပေါင်းအတွက် နောက်ဆက်တွဲ

နာမ်စားနေရာအပိုင်းက အသုံးပြုတဲ့ နောက်ဆက်တွဲနဲ့ ကိုက်ညီပါတယ်။ Kotodama dapp စာချုပ်
အမည်မဖော်လိုသူ:

| ပါကတ် ID                | ဆက်စပ်သော စာချုပ် အမည်မဖော်လိုသည့် ပုံစံ |
| ------------------------- | ---------------------------- |
| `universal/math`          | `router::universal`          |
| `dex.universal/swap-core` | `router::dex.universal`      |

နာမည်နေရာတွေမှာ `<dataspace>` ဒါမှမဟုတ် `<domain>.<dataspace>` ပုံစံတစ်ခု။
ပါကတ်မှာ dapp link ရှိတယ် Musubi ချိတ်ဆက်ထားတဲ့ စာချုပ်အမည်တိုင်းကို စစ်ဆေး
Package နဲ့အတူ နာမ်စားနေရာအလိုက်ကိုပဲ သုံးပါတယ်။

## ထင်ရှား {#manifest}

စာအိတ်တစ်ခုက `Musubi.toml`:

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

မူတည်ချက်တွေက တိကျတဲ့ ပုံစံတွေ သုံးနိုင်တယ်၊ စောင့်ရှောက်မှု လိုအပ်ချက်တွေ၊ tilde
လိုအပ်ချက်များ၊ wild card များ `1.*`, (သို့) နှိုင်းယှဉ်စာရင်းများ
`>=1.0.0,<2.0.0`.

`Musubi.lock` ချိတ်ဆက်ထားသော ကွင်းဆက်မှ ရွေးချယ်သော အပြောင်းအလဲ ဂရပ်ကို မှတ်တမ်းတင်သည်။
lock node တစ်ခုချင်းစီမှာ ၎င်းရဲ့ canonical package ref ကို သိမ်းထားပြီး ရွေးချယ်ထားပါတယ်
လိုအပ်ချက် SoraFS manifest digest, source archive hash, byte count, file
Count, Exported Functions, Deterministic Source Archive Plan နဲ့
ချုပ်ကိုင်မှု အမည်မဖော်လိုသူများ။
Lockfile ကို။

## ဒေသတွင်း အလုပ်ခွင် {#local-workflow}

မြစ်ပေါ်က Iroha အလုပ်ခွင် root, run Musubi ကုန်တင်ပို့မှုမှတဆင့်

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

အသုံးပြုခြင်း `install --offline` အတိအကျဗားရှင်းအတွက် မဖြေရှင်းသေးတဲ့ Lockfile ကိုရေးဖို့
node တစ်ခုကို မေးမနေဘဲ dependencies ကို အသုံးပြုပါ။ `install --locked` အထဲမှာ CI သို့
ခေတ်မမီတဲ့ Lockfile ကို ပယ်ချပါ။

`build` ကေရှ်ချထားသော မှီခိုမှု အရင်းအမြစ်များကို ဖုန်းခေါ်ဆိုမှုများကို ပြန်လည်ရေးသားခြင်းဖြင့် ချိတ်ဆက်ပေးသည်
`math::add()` အင္တာနက္ကို ေျဖရွင္း Kotodama function name တွေကို ပယ်ချတယ်။
dependence က တင်ပို့မထားတဲ့ function တွေကို call လုပ်တယ်။ Musubi v1 စာကြည့်တိုက်များ
လုပ်ဆောင်ချက်တစ်ခုတည်းဖြစ်သည်- နိုင်ငံတော်၏ ကြေညာချက်များပါဝင်သော မှီခိုမှုအရင်းအမြစ်များ၊
trigger များ၊ kotoba blocks များ၊ constants များ သို့မဟုတ် function မပါသော အခြားစာချုပ်ပစ္စည်းများ
ငြင်းပယ်ခံရတယ်။

## ရင်းမြစ် Archives ကိုယူခြင်း {#fetching-source-archives}

Musubi ဖြေရှင်းနေစဉ် (သို့) နောက်ပိုင်းတွင် ပျောက်ဆုံးနေတဲ့ မှီခိုမှု အရင်းအမြစ်များကို ရှာဖွေနိုင်သည်
ကေရှ်အောက်ကွန်မဒ်များမှတစ်ဆင့်:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

တိုက်ရိုက်ဂိတ်တံခါးကိုယူခြင်းသည် တစ်ခု (သို့) ပိုများသော SoraFS Gateway Provider တွေရဲ့ Specs:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

ပေးသွင်းသူရဲ့ အသုံးဝင် ဝန်ဆောင်မှု ဖိုင်များနဲ့ ဂိတ်ဝိတ် ပေးသွင်းသူတွေဟာ တစ်ခုအတွက် အချင်းချင်း ပယ်ချထားတာပါ။
ပိတ်ထားတဲ့ package တစ်ခုထက်ပိုပြီး ပျောက်နေပါက
Gateway provider ကို `package=<dependency-alias>`,
`package=<namespace/package@version>`, `package=<namespace/package>`, ဒါမှမဟုတ်
`manifest=<64-hex SoraFS manifest digest>`.

တံခါးပေါက် `base-url` နှင့် `privacy-url` တန်ဖိုးတွေကို အသုံးပြုရပါမယ်။ `https://` အလိုအလျောက်ပါ။
ဒေသတွင်း စမ်းသပ်ရေးဂိတ်တွေ အသုံးပြုနိုင်ပါတယ် `http://localhost`, `http://127.0.0.1`, ဒါမှမဟုတ်
`http://[::1]` ပဲ `--gateway-allow-insecure-localhost`. စီးဆင်းမှု
tokens တွေဟာ runtime credentials တွေဖြစ်ပြီး `Musubi.lock`.

## ထုတ်ဝေခြင်း {#publishing}

`pack` deterministic ကို တွက်ချက်တယ် BLAKE3-256 source archive hash plus ကို
source byte နဲ့ file counts တွေကို `--car-out`, `--sorafs-manifest-out`, ဒါမှမဟုတ်
`--source-plan-out` ပေးပို့ထားတယ်ဆိုပါစို့၊ ဒါကလည်း deterministic ကို တည်ဆောက်ပေးတယ်။ SoraFS
CAR အသုံးဝင်သော ဝန်ဆောင်မှု၊ SoraFS ပြဌာန်းထားပြီး Musubi source archive plan ကို အလားတူ
source file ကို set လုပ်ပါ။

ထုတ်ဝေမလုပ်ခင် ခြောက်သွေ့ဆေးသုံးပါ။

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

မပါဘဲ `--dry-run`, `publish` default လက်ရာများကို အောက်တွင် ရေးပေးသည်
`.musubi/dist/<namespace>/<name>/<version>/`, ရွေးချယ်မှုအရ
ပြသပြီး အသုံးဝင်တဲ့ ဝန်ဆောင်မှု Torii ဒါက SoraFS Storage-pin အဆုံးမှတ်
`--upload`, ထုတ်လုပ်ထားသော SoraFS pin နဲ့ submits
`PublishMusubiRelease` configured မှတစ်ဆင့် Iroha ဖောက်သည်။

ထုတ်ပြန်ထားသော သတင်းအချက်အလက်များတွင် အောက်ပါအတိုင်း ပါဝင်ရမည်-

- အလွတ်မဟုတ်တဲ့ Canonical Source Archive ကို
- deterministic source archive အစီအစဉ်တစ်ခု
- အနည်းဆုံး တင်ပို့မှုတစ်ခု Kotodama လုပ်ဆောင်ချက်
- ချုပ်ကိုင်မှု မှတ်တမ်းများတွင် ဆွဲထုတ်ထားသော ထုတ်လွှင့်ချက်များကို ရွေးချယ်ခြင်းမရှိပါ။
- dapp link တစ်ခုရှိပါက စာချုပ်အမည်များသည် package နှင့် ကိုက်ညီသည်။
  နာမည်နေရာ

## မှတ်ပုံတင်မေးခွန်းများနှင့် သက်တမ်းပတ်စဉ် {#registry-queries-and-lifecycle}

မှတ်ပုံတင်ကို ရှာဖွေစစ်ဆေးပါ

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Yanking က resolution အသစ်ကနေ release ကို ဖုံးကွယ်ထားပေမဲ့ ရှိနေတဲ့ lockfiles တွေကို ထိန်းထားတယ်။
ပြန်လည်ဖန်တီးနိုင်သည်

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi ကမ္ဘာလုံးဆိုင်ရာ နာမည်အမှတ်ကို ချိတ်ဆက်ခြင်းကနေ ကာကွယ်ပေးတယ်။ `namespace/package` ကော်မတီ
အမည်နေရာတစ်ခုသို့ ထုတ်ဝေရန် ခွင့်ပြုချက်ရှိရမည်။
အဲဒီအတွက် အသုံးပြုခဲ့တဲ့ ပိုင်ဆိုင်မှု (သို့) လွှဲပြောင်းခွင့် ပုံစံတူပါပဲ။ Kotodama
dapp နာမ်စားနေရာ။ ကော်မတီလုပ်ထားတဲ့ ကမ္ဘာ့အမည်တိုတွေဟာ package တွေနဲ့ သီးခြားခွဲခြားထားတယ်။
ပိုင်ဆိုင်မှု: `SetMusubiShortAlias` တောင်းဆိုချက် `CanSetMusubiShortAlias`
ခွင့်ပြုချက်ရှိပြီး ရည်မှန်းချက်ပက်ကတ်မှာ အနည်းဆုံး တက်ကြွမှုတစ်ခု ရှိဖို့လိုပါတယ်။
လွှတ်ပေးပါ။

## Iroha မျက်နှာပြင်များ {#iroha-surfaces}

Musubi ပထမတန်းစား အသုံးပြုချက်များ Iroha ညွှန်ကြားချက်များနှင့် မေးမြန်းမှုများ

| မျက်နှာပြင်                      | ရည်ရွယ်ချက်                                            |
| ---------------------------- | -------------------------------------------------- |
| `PublishMusubiRelease`       | မပြောင်းလဲနိုင်တဲ့ ထုတ်ပြန်ချက် ထုတ်ဝေပါ။              |
| `YankMusubiRelease`          | လက်ရှိထုတ်လွှင့်မှုကို ဆွဲထုတ်ထားတယ်လို့ မှတ်သားပါ။                |
| `SetMusubiShortAlias`        | ကော်တာခံထားတဲ့ ကမ္ဘာ့ အမည်မဖော်လိုတဲ့ စာရင်းကို package ID တစ်ခုနဲ့ ချိတ်ပါ။ |
| `AssertMusubiReleaseExists`  | တိကျတဲ့ package version ရှိဖို့ လိုအပ်တယ်။       |
| `FindMusubiReleaseByRef`     | တိကျတဲ့ package reference နဲ့ ထုတ်ပေးပါ။        |
| `FindMusubiPackageVersions`  | Package ID အတွက် ဗားရှင်းတွေကို စာရင်းပေးပါ။                    |
| `FindMusubiPackageReleases`  | Package ID အတွက် ထုတ်ပြန်ချက် အနှစ်ချုပ်ကို စာရင်းပေးပါ။           |
| `SearchMusubiPackages`       | အမည်နေရာနဲ့ စာသားအလိုက် package summaries တွေကို ရှာပါ။    |
| `FindMusubiShortAliasByName` | အမည်မဖော်လိုတဲ့ အမည်တိုကို ဖြေရှင်းပါ။                     |

Torii အဖြဲ႕အစည္းက Musubi HTTP အောက်က လမ်းကြောင်း မိသားစု `/v1/musubi/*`.
ကိုယ်စားလှယ်ကို မျက်နှာမူ MCP ကိရိယာတွေကို `iroha.musubi.*` အမည်မဖော်လိုသူတွေ၊
[Torii အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md) နှင့်
[မေးမြန်းချက် မှတ်တမ်း](/my/reference/queries.md) ပိုကျယ်ပြန့်တဲ့အတွက် API မြေပုံပါ။
