---
translation_locale: my
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama အိတ်များ {#musubi-kotodama-packages}

Musubi သည် Kotodama အရင်းအမြစ်အိတ်များအတွက်ပထမဦးဆုံးထုတ်ဝေမှု package manager ဖြစ်သည်။ ၎င်းသည်အတိအကျ on-chain မှီခိုမှုဂရပ်ကိုဖြေရှင်းပြီး SoraFS အရင်းအမြစ်ကိုစစ်ဆေးသည်။ မှတ်တမ်းတင်ခြင်း၊ ရွေးချယ်ထားတဲ့ အလုပ်ခွင်ကို စုစည်းပြီး စမ်းသပ်ခြင်းများ၊ Single Protocol-Standard CAR စာရွက်စာတမ်းများကို တည်ဆောက်ခြင်းနှင့် မပြောင်းလဲနိုင်သော ထုတ်ပြန်ချက်များကို Iroha မှတစ်ဆင့် ဖော်ပြခြင်း။

Musubi ကို အသုံးပြုပါ-

- ပြန်လည်သုံးနိုင်တဲ့ Kotodama function libraries ကို ထုတ်ဝေပါ။
- `Musubi.lock` တွင် တိကျသော အပြောင်းအလဲ ဂရပ်တစ်ခုကို ရိုက်ထည့်ပါ။
- နောက်ဆုံးသတ်မှတ်ထားသော SoraFS Archive cryptographic commitment တန်ဖိုးများမှ မှီခိုမှု အရင်းအမြစ်ကို ပြန်လည်ပြုပြင်ပါ။
- Package တစ်ခု (သို့) multi-package အလုပ်ခွင်ကို တည်ဆောက်ပြီး စမ်းသပ်ပါ။
- ဘလော့ခ်ချိန်းပေါ်ရှိ မှတ်ပုံတင်စာရင်းမှတစ်ဆင့် ပက်ကေ့ချ်များကို စစ်ဆေး၊ ထုတ်ဝေ၊ ပြန်ရုပ်သိမ်း၊ ထိန်းသိမ်း သို့မဟုတ် alias သတ်မှတ်နိုင်သည်

## Package အမည်များ {#package-names}

Single Protocol Standard Package Selectors တွေကို သုံးပါတယ်။

```text
namespace/package
```

တိကျသော ထုတ်ပြန်ချက် မှတ်သားစရာများတွင် မူကွဲတစ်ခု ထည့်သွင်းပါ-

```text
namespace/package@version
```

ဦးဆောင်မှုမရှိဘူး။ `@` Namepace က data space root လိုမျိုးပါ။ `universal` (သို့) ဒိုမင်အလိုက် ကျွမ်းကျင်တဲ့ ဒေတာနေရာတစ်ခု၊ ဥပမာ `dex.universal`. blockchain ledger က package တစ်ခုကို claim မလုပ်ခင်မှာ ဒီတည်ဆောက်တဲ့ နာမည်နေရာကို တည်ငြိမ်တဲ့ home data space တစ်ခုနဲ့ ချိတ်ဆက်တယ်။

## Technical Manifesto နှင့် Lockfile {#manifest-and-lockfile}

Package တစ်ခုမှာ ပိတ်ထားတဲ့ ပထမထုတ်ဝေမှုကို သုံးပါတယ်။ `Musubi.toml` Schema: Technical Manifesto မှာ ကြေညာဖို့လိုပါတယ်။ `manifest-version = 1`, Kotodama ထုတ်ပြန်ချက် `"1"`, နှင့် IVM ABI မူကွဲ `1`; အခြားနည်းပညာထုတ်ပြန်ချက်မရှိဘူး ABI ပုံစံပါ။

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

မှီခိုမှုများတွင် တိကျသောဗားရှင်း၊ caret သို့မဟုတ် tilde လိုအပ်ချက်၊ `1.*` ကဲ့သို့ wildcard နှင့် `>=1.0.0,<2.0.0` ကဲ့သို့ ကော်မာခြားနှိုင်းယှဉ်စည်းကမ်းအစုများကို အသုံးပြုနိုင်သည်။ မှီခိုမှုဇယားကီးသည် မိခင်ပက်ကေ့ချ်အတွင်း import လုပ်ရန် alias ဖြစ်ပြီး `package` သည် မှတ်ပုံတင်စာရင်း၏ စံသတ်မှတ်ရွေးချယ်မှုဖြစ်သည်။

`Musubi.lock` က ဂရပ်ကို တိကျတဲ့ ပင်မဖြစ်စဉ်မှ ရယူထားသော `NetworkId` နှင့် နောက်ဆုံးပြုစုထားတဲ့ မှတ်ပုံတင် snapshot သို့ ချိတ်ဆက်ပေးသည်။ ရွေးချယ်ထားသော workspace root များနှင့် မပြောင်းလဲနိုင်သော release node များကို မှတ်တမ်းတင်ပေးသည်။ release, source, interface, archive, ABI နှင့် dependency-edge exact cryptographic commitment values တို့ကိုပါ ၀ င်သည်။ ဖြေရှင်းသောဂရပ်သည်လိုအပ်သည့်အခါ Parallel versions များကိုခွင့်ပြုသည်။

## Configure Taira SoraFS ဆွဲယူခြင်း {#configure-taira-sorafs-fetching}

ဤလုပ်ငန်းစဉ်အတွက် Taira သည် အများသုံး testnet ဖြစ်သည်။ သိုလှောင်ရုံတွင် ထည့်ထားသော chain နှင့် လက်ရှိပုံသေချိတ်ထားသော genesis မှ ဆင်းသက်သည့် ကွန်ရက်အထောက်အထားပါ Taira client ပြင်ဆင်သတ်မှတ်မှုမှ စတင်ပြီး အောက်ပါ ပံ့ပိုးသူအလိုက် အထောက်အထားစစ်ဆေးထားသော ရယူမှုချိတ်ဆက်ချက်များကို ထည့်ပါ။ Taira ပြန်စခြင်းက `NetworkId` ကို ပြောင်းလဲနိုင်သဖြင့် တည်ငြိမ်သော chain UUID မှ ခန့်မှန်းမည့်အစား လက်မှတ်ထိုးထားသော deployment ပရိုဖိုင်မှ အသစ်ရယူပါ။ အကောင့်လက်မှတ်ထိုးဒေတာနှင့် ပံ့ပိုးသူအော်ပရေတာကီးများကို ပိုင်ရှင်သာဖတ်နိုင်သော လည်ပတ်ချိန်ဖိုင်များတွင် ထားရမည်။

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

Taira ၏ လက်မှတ်ထိုးပေးသွင်းသူများကို အများပြည်သူ testnet root မှရှာဖွေပါ။

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

ပံ့ပိုးသူကတ်တလောက်က ပံ့ပိုးသူအထောက်အထားများနှင့် ကြေညာထားသော endpoint များကို ပေးသည်။ ရွေးထားသောပံ့ပိုးသူထံမှ ကိုက်ညီသော အော်ပရေတာခွင့်ပြုချက်ကို ရယူပါ။ လည်ပတ်စနစ်က ထိုကီးဖြင့် အကန့်အသတ်ရှိသော stream တိုကင်များကို တောင်းယူသည်။ တိုကင်များသည် CLI အာဂျူမင့်များ သို့မဟုတ် lockfile အကြောင်းအရာများ မဟုတ်ပါ။

Taira ၏ validator ၏ pin URL ကို `url` အဖြစ် မသုံးပါနှင့်။ သိုလှောင်ရုံတွင် ထည့်ထားသော validator များ၌ အတွင်းထည့်သွင်းထားသော SoraFS သိုလှောင်မှုကို ပိတ်ထားသည်။ ၎င်းတို့၏ `https://taira-validator-{1,2,3,4}.sora.org` endpoint များသည် pin မှတ်ပုံတင်မှုကို လက်ခံသော်လည်း archive ဖတ်ရှုမှုက ရွေးချယ်ထားသော လက်ခံခွင့်ရပံ့ပိုးသူ၏ HTTPS မူရင်းကို အသုံးပြုသည်။

## ဒေသတွင်း အလုပ်ခွင် {#local-workflow}

မူရင်း Iroha workspace အမြစ်မှ ပက်ကေ့ချ်ဖိုင်တွဲကို ဖန်တီး သို့မဟုတ် ဝင်ရောက်ပြီး Cargo မှတစ်ဆင့် Musubi ကို လုပ်ဆောင်ပါ။

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch` နောက်ဆုံးမှတ်ပုံတင်ဂရပ်၊ မွမ်းမံချက်များကို ဖြေရှင်းပေးသည် `Musubi.lock` ခွင့်ပြုချက်ရှိပါက authenticated မှမပြောင်းလဲနိုင်သော ဒေသတွင်း cache ကိုဖြည့်ပါ။ SoraFS နေရာများ။ `check`, `build`, `test`, နှင့် `package` သူတို့ကိုယ်ပိုင် အလုပ်မလုပ်ခင် ဂရပ်နဲ့ ကရှ် စစ်ဆေးမှုတွေကိုပဲ လုပ်ပေးတယ်။

`--locked` ကိုသုံးပြီး lockfile အပြောင်းအလဲတစ်ခုခုကိုငြင်းပယ်ပါ။ မှတ်ပုံတင်စာရင်းညွှန်းကိန်းနှင့်လိုအပ်သောသိမ်းဆည်းမှုအားလုံး cache ထားရှိထားပါကသာ `--offline` ကိုအသုံးပြုပါ။ `--frozen` သည်ဤစည်းကမ်းနှစ်ခုကို ပေါင်းစပ်သည်။ offline cache ပျက်ကွက်သည်; Musubi သည်ဖြေရှင်းခြင်းမရှိသော lockfile ကိုတစ်ခါမှမရေးသားပါ။

`math::add()` လို အရည်အချင်းပြည့်မီတဲ့ နည်းပညာဆိုင်ရာခေါ်ဆိုချက်တွေကို deterministic internal Kotodama နာမည်တွေနဲ့ ပြန်ရေးသားခြင်းဖြင့် ချို့ယွင်းမှုအရင်းအမြစ်တွေကို ဆက်စပ်ပေးပါတယ်။ တင်ပို့မှုမရှိတဲ့ လုပ်ဆောင်ချက်တစ်ခုအတွက်ခေါ်ဆိုမှုကို ပယ်ချလိုက်ပါတယ်။ တင်သွင်းထားတဲ့ စာကြည့်တိုက်တွေက လုပ်ဆောင်ချက်တွေကို ဖော်ပြတယ်။ ဒေသတွင်း `[[contract]]` နှင့် `[[test]]` ရည်မှန်းချက်တွေဟာ ရှင်းလင်းတဲ့ ပက်ကတ်ရည်မှန်းချက်တွေ ဖြစ်နေတုန်းပါ။

## Cache စစ်ဆေးခြင်းနှင့် ပြင်ဆင်ခြင်း {#cache-verification-and-repair}

အများပြည်သူ cache command တွေကို registry archive ထဲမှာ ထုတ်ဝေထားတဲ့ immutable မှာ လုပ်ပါတယ်။

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` ကွာရန်တင်းက ယုံကြည်စိတ်ချရတဲ့ မျိုးဆက်တွေကို ဖျက်ဆီးပြီး နောက်ဆုံးသတ်မှတ်ထားတဲ့ ပေးသွင်းသူ အထောက်အထားတွေ ခွင့်ပြုတဲ့အခါ တိကျတဲ့ မှတ်တမ်းတွေကို ပြန်လည်စစ်ဆေးတယ်။ သက်ရှိအလွတ်မဟုတ်တဲ့ အပြောင်းအလဲအတွက် ကြံစည်စွာဖြတ်တောက်မှု ပိတ်ထားတယ်၊ လျှို့ဝှက်ထားသော ကိုယ်စားလှယ်လောင်းများကို စစ်ဆေးဖို့ `--dry-run` ကိုသုံးပါ။

## ထုပ်ပိုးခြင်းနှင့် ထုတ်ဝေခြင်း {#packaging-and-publishing}

Archive မရေးခင် Clean Positive file set ကို စစ်ဆေးပြီး Single Protocol Standard Package ကို တည်ဆောက်ပါ။

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` သည် `target/package/<namespace>-<name>-<version>.car` ကို ရေးသားသည်။ CAR က စံသတ်မှတ်ပက်ကေ့ချ် manifest၊ အဓိပ္ပာယ်ဆိုင်ရာထုတ်ဝေမှု manifest၊ တိကျသောစစ်ဆေးမှု lock၊ ရင်းမြစ်သစ်ပင်၊ interface digest နှင့် SoraFS archive ကတိပြုတန်ဖိုးတို့ကို ချိတ်ဆက်ပေးသည်။ ပထမထုတ်ဝေမှု CLI တွင် သီးခြား `pack`၊ `--car-out`၊ `--sorafs-manifest-out` သို့မဟုတ် `--source-plan-out` command များ မရှိပါ။

ထုတ်ဝေခြင်းသည် လက်မှတ်ထိုး၍ ပြန်လည်သုံးနိုင်သော ကွန်ရက် အလုပ်ဖြစ်စဉ်တစ်ခုဖြစ်သည်။ ရွေးချယ်ထားသော `client.toml` တွင်လိုအပ်သော `[musubi.publication]` ချိတ်ဆက်ချက်များအပြင် အကောင့်နှင့် Taira ကွန်ရက် ညွှန်ကြားချက်ကိုပါ ၀ င်ရမည်ဖြစ်သည်။ Package workspace အဖွဲ့ဝင်တစ်ဦးကိုတိကျစွာပါဝင်ရမည်။

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

အသုံးပြုခြင်း `--detach` လုပ်ငန်းစာရင်းနဲ့ မျိုးစေ့ဝင်ရောက်မှု နယ်နိမိတ်ဟာ ရေရှည်ခံပြီးနောက် ပြန်လာဖို့ပါ။ ရေရှည်တည်တံ့တဲ့ လုပ်ငန်းကို ဆက်လုပ်ပါ။ `publish --resume <operation-id> --config client.toml`. ကျဉ်းမြောင်းတဲ့ `--recover <operation-id>` path ဟာ မပြောင်းလဲနိုင်တဲ့ ပံ့ပိုးမှု မှတ်တမ်းတွေ ပျောက်နေတဲ့ pristine pre-entry ဂျာနယ်အတွက် ပြန်လည်ဖန်တီးတာပါ။ ထုတ်ဝေခြင်းမရှိဘူး။ `--dry-run` (သို့) အထွေထွေ အများပြည်သူ upload backback ကို run လုပ်ပါ။ `package --list` နှင့် `package` ဒေသတွင်း ကြိုတင်ပျံသန်းမှုအတွက်ပါ။

## မှတ်ပုံတင် မေးမြန်းချက်များနှင့် သက်တမ်း စက်ဝန်း {#registry-queries-and-lifecycle}

Taira ဝယ်သူရဲ့ ဖွဲ့စည်းပုံတစ်ခုတည်းနဲ့ နောက်ဆုံးပြုစုထားတဲ့ မှတ်ပုံတင်ကို ရှာဖွေပြီး စစ်ဆေးပါ။

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

Yanking သည်အခုရှိသောတိကျသော Lock များကိုပြန်လည်ဖန်တီးနိုင်သည်ဆိုပါစို့။ ယခင်ကလက်ရှိ yank ပြင်ဆင်မှုကိုဖတ်ပြီး နှိုင်းယှဉ်မှုနှင့်သတ်မှတ်မှု အပြောင်းအလဲကိုတင်သွင်းပါ။

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

`unyank` ကိုသုံးပါ Package ကိုပိုင်ဆိုင်သူနှင့်ထိန်းသိမ်းမှုအခန်းကဏ္ဍကိုထိန်းချုပ်ခြင်း ထုတ်ဝေ, yank, metadata Global aliases တွေမှာ ကိုယ်ပိုင် စျေးနှုန်းမှတ်ပုံတင်မှု၊ retarget သမိုင်းနဲ့ နှိုင်းယှဉ်ပြီး သတ်မှတ်တဲ့ တည်းဖြတ်ချက်တွေရှိတယ်၊ ဒါတွေက package ပိုင်ဆိုင်မှု ဖြတ်လမ်းမဟုတ်ဘူး။

## Iroha မျက်နှာပြင်များ {#iroha-surfaces}

Musubi သည် ပထမထုတ်ပြန်ချက် V1 ညွှန်ကြားချက်များနှင့် မေးမြန်းချက်များကို အသုံးပြုသည် -

|မျက်နှာပြင်|ရည်ရွယ်ချက်|
| ---------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |နာမည်နေရာကို ၎င်းရဲ့ တည်ငြိမ်တဲ့ နေအိမ် ဒေတာ နေရာနဲ့ ချိတ်ဆက်ပါ။ |
|`RegisterMusubiArchiveV1` |မပြောင်းလဲနိုင်တဲ့ စစ်ဆေးထားတဲ့ source archive cryptographic commitment value ကို မှတ်တမ်းတင်ပါ။ |
|`AddMusubiArchiveLocationV1` |သက်သေပြထားတဲ့ SoraFS မှတ်တမ်းနေရာကို ထည့်သွင်း (သို့) မွမ်းမံပါ။ |
|`PublishMusubiReleaseV1` |Package တစ်ခုကို တောင်းဆိုခြင်း (သို့) update လုပ်ပြီး မပြောင်းလဲနိုင်တဲ့ ထုတ်ပြန်ချက်တစ်ခုကို ထုတ်ဝေပါ။ |
|`SetMusubiReleaseYankV1` |တိကျတဲ့ လွတ်မြောက်မှုရဲ့ ဆွဲထုတ်ထားတဲ့ အခြေအနေကို နှိုင်းယှဉ်ပြီး သတ်မှတ်ပါ။|
|`InviteMusubiPackageMaintainerV1` |ရှင်းလင်းတဲ့ Package Role ဖိတ်ကြားမှု စီးဆင်းမှုကိုစတင်ပါ။ |
| `RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` | အုပ်ချုပ်မှုအောက်ရှိ ကမ္ဘာလုံးဆိုင်ရာ alias ကို မှတ်ပုံတင်ခြင်း သို့မဟုတ် ပစ်မှတ်ပြောင်းခြင်း။ |
|`AssertMusubiReleaseDigestV1` |အတိအကျ မပြောင်းလဲနိုင်တဲ့ release cryptographic digest value ကို သတ်မှတ်ပါ။ |
|`FindMusubiExactPackageV1` |Package တစ်ခုနဲ့ ပြင်ဆင်ချက်တွေကို ဖတ်ပါ။ |
|`FindMusubiExactReleaseV1` |တိကျတဲ့ ထုတ်လွှင့်ချက် တစ်ပုံကို ဖတ်ပါ။|
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |အဆုံးသတ်ထားတဲ့ လွတ်မြောက်ရေး ကိုယ်စားလှယ်လောင်းတွေကို ဖြေရှင်းဖို့ (သို့) စာရင်းပေးပါ။|
|`FindMusubiArchiveLocationsV1` |ပေးသွင်းသူက ထောက်ပံ့တဲ့ နောက်ဆုံးသတ်မှတ်ထားတဲ့ လက်မှတ်နေရာတွေကို ဖတ်ပါ။ |
| `FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` | လက်ရှိ alias ပစ်မှတ် သို့မဟုတ် ၎င်း၏ မပြောင်းလဲနိုင်သောသမိုင်းကို ဖတ်ခြင်း။ |

Torii သည် app route မိသားစုကို `/v1/musubi/*` အောက်တွင် ဖော်ပြထားသည်။ MCP ကိရိယာများသည် လက်ရှိ `iroha.musubi.queries.*` နှင့် `iroha.musubi.instructions.*` နာမည်များကိုအသုံးပြုသည်။ ပိုကျယ်ပြန့်သော API မြေပုံအတွက် [Torii API အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md) နှင့် [မေးမြန်းချက် အချက်အလက်များ](/my/reference/queries.md) ကိုကြည့်ပါ။
