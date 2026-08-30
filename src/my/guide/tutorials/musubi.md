---
translation_locale: my
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama အိတ်များ {#musubi-kotodama-packages}

Musubi သည် Kotodama အရင်းအမြစ်အိတ်များအတွက်ပထမဦးဆုံးထုတ်ဝေမှု package manager ဖြစ်သည်။ ၎င်းသည်ချည်နှောင်ပေါ်တွင်တိကျသော မှီခိုမှုဂရပ်ကိုဖြေရှင်းပြီး SoraFS ကို စစ်ဆေးတယ်။ source archives ကို compiles and tests the selected workspace, builds canonical CAR archives, and publishes immutable releases through Iroha တို့ကို ပြုစုပြီး စမ်းသပ်ပါတယ်။

Musubi ကို အသုံးပြုပါ-

- ပြန်လည်သုံးနိုင်တဲ့ Kotodama function libraries ကို ထုတ်ဝေပါ။
- `Musubi.lock` တွင် တိကျသော အပြောင်းအလဲ ဂရပ်တစ်ခုကို ရိုက်ထည့်ပါ။
- နောက်ဆုံးသတ်မှတ်ထားသော SoraFS စာရွက်စာတမ်းဆိုင်ရာ တာဝန်ယူချက်များမှ မှီခိုမှု အရင်းအမြစ်ကို ပြန်လည်ပြုပြင်ပါ။
- Package တစ်ခု (သို့) multi-package အလုပ်ခွင်ကို တည်ဆောက်ပြီး စမ်းသပ်ပါ။
- On-chain registry ကနေ package တွေကို စစ်ဆေး၊ ထုတ်ဝေ၊ ဆွဲထုတ်၊ ထိန်းသိမ်း (သို့) အမည်မဖော်လိုပါ။

## အိတ်အမည်များ {#package-names}

Canonical Package Selectors တွေမှာ အောက်ပါအတိုင်း သုံးပါတယ်။

```text
namespace/package
```

တိကျသော ထုတ်ပြန်ချက် မှတ်သားစရာများတွင် မူကွဲတစ်ခု ထည့်သွင်းပါ-

```text
namespace/package@version
```

ဦးဆောင်မှုမရှိဘူး။ `@` Namepace က data space root လိုမျိုးပါ။ `universal` (သို့) ဒိုမင်အလိုက် ကျွမ်းကျင်တဲ့ ဒေတာနေရာတစ်ခု၊ ဥပမာ `dex.universal`. စာရင်းအင်းက ဒီဖွဲ့စည်းမှု နာမည်နေရာကို package တစ်ခု တောင်းဆိုနိုင်ခင်မှာ တည်ငြိမ်တဲ့ home data space တစ်ခုနဲ့ ချိတ်ဆက်ပေးပါတယ်။

## Manifest နှင့် Lockfile {#manifest-and-lockfile}

Package တစ်ခုမှာ ပိတ်ထားတဲ့ ပထမထုတ်ဝေမှုကို သုံးပါတယ်။ `Musubi.toml` schema. Manifesto က ကြေညာဖို့လိုတယ်။ `manifest-version = 1`, Kotodama ထုတ်ပြန်ချက် `"1"`, နှင့် IVM ABI မူကွဲ `1`; အပြောင်းအလဲ ထုတ်ပြန်ချက် မရှိဘူး။ ABI ပုံစံပါ။

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

Dependencies များသည် တိကျသောဗားရှင်းများ၊ caret သို့မဟုတ် tilde လိုအပ်ချက်များ၊ `1.*` ကဲ့သို့သော wildcard များနှင့် `>=1.0.0,<2.0.0` ကဲ့သို့သော comma-separated comparator sets များကို အသုံးပြုနိုင်သည်။ dependence table key သည် parent-local import alias ဖြစ်သည်။ `package` သည်အမြဲတမ်း canonical registry selector ဖြစ်ပါသည်။

`Musubi.lock` က ဂရပ်ကို တိကျတဲ့ ပင်မဖြစ်စဉ်မှ ရယူထားသော `NetworkId` နှင့် နောက်ဆုံးပြုစုထားတဲ့ မှတ်ပုံတင် snapshot သို့ ချိတ်ဆက်ပေးသည်။ ရွေးချယ်ထားသော workspace root များနှင့် မပြောင်းလဲနိုင်သော release node များကို မှတ်တမ်းတင်ပေးသည်။ release, source, interface, archive, ABI နှင့် exact dependency-edge commitments တို့ကိုပါ ၀ င်သည်။ ဖြေရှင်းသောဂရပ်သည်လိုအပ်သည့်အခါ Parallel versions များကိုခွင့်ပြုထားသည်။

## Configure Taira SoraFS ဆွဲယူခြင်း {#configure-taira-sorafs-fetching}

Taira သည် ဤအလုပ်ဖြစ်စဉ်အတွက် အများပြည်သူစစ်ဆေးရေးကွန်ရက်ဖြစ်သည်။ ချိတ်ဆက်ထားသောချိတ်ဆက်မှုနှင့်ကွန်ရက်အမည်ရှိ Taira ဖောက်သည် သတ်မှတ်ချက်မှစ၍ အောက်ပါပေးသွင်းသူသတ်မှတ်ထားတဲ့ စစ်ဆေးခြင်းရယူရန်ဘောင်များကိုထည့်ပါ။ Account signing material နဲ့ provider operator keys တွေဟာ ပိုင်ရှင်တစ်ဦးတည်းရဲ့ runtime file တွေထဲမှာပဲ ကျန်နေရပါမယ်။

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

Provider Catalog provides provider identities and advertised endpoints. ရွေးချယ်သော Provider မှ match operator authorization ကိုရရှိပါ။ runtime သည်ချိတ်ဆက်ထားသည့် stream tokens များကိုတောင်းဆိုရန် key ကိုအသုံးပြုသည်။ tokens တို့သည် CLI argument သို့မဟုတ် lockfile အကြောင်းအရာမဟုတ်ပေ။

Taira validator pin URL ကို `url` အဖြစ်မသုံးပါနဲ့။ စစ်ဆေးထားသော validators များသည် SoraFS သိုလှောင်မှု disabled ကိုထည့်သွင်းထားသည်။ ၎င်းတို့၏ `https://taira-validator-{1,2,3,4}.sora.org` အဆုံးမှတ်များတွင် pin မှတ်ပုံတင်ခြင်းကိုလက်ခံကြပြီး အာကာသဖတ်ရှုချက်များသည် ရွေးချယ်ခံရသောလက်ခံပေးသူ၏ HTTPS မူရင်းကို အသုံးပြုသည်။

## ဒေသတွင်း အလုပ်ဖြစ်စဉ် {#local-workflow}

Upstream Iroha workspace root မှ package directory ကိုဖန်တီး (သို့မဟုတ်ထည့်သွင်းပြီး Cargo ကနေ Musubi ကို run လုပ်ပါ:

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

`math::add()` ကဲ့သို့သော အရည်အချင်းပြည့်စုံသောခေါ်ဆိုမှုများကို deterministic internal Kotodama နာမည်များနှင့်ပြန်ရေးသားခြင်းဖြင့်မှီခိုမှုအရင်းအမြစ်များကိုဆက်သွယ်သည်။ မတင်ပို့သည့်လုပ်ဆောင်ချက်အားမှီခိုချက်ခေါ်ဆိုမှုကို ပယ်ချသည်။ တင်သွင်းထားသောစာကြည့်တိုက်များသည် လုပ်ဆောင်ချက်များကိုဖေါ်ပြသည်၊ ဒေသတွင်း `[[contract]]` နှင့် `[[test]]` ရည်မှန်းချက်များသည် ရှင်းလင်းသောပိတ်ရက်ရည်မှန်းချက်များအဖြစ် ဆက်လက်ရှိနေပါသည်။

## Cache စစ်ဆေးခြင်းနှင့် ပြင်ဆင်ခြင်း {#cache-verification-and-repair}

အများပြည်သူ cache commands တွေဟာ မပြောင်းလဲနိုင်တဲ့ registry-committed archives တွေမှာ အလုပ်လုပ်ပါတယ်။

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` Quarantine တွေက ယုံကြည်ရတဲ့ မျိုးရိုးသားတွေကို အညစ်အကြေးဖြစ်စေပြီး နောက်ဆုံးသတ်မှတ်ထားတဲ့ ပေးသွင်းသူ အထောက်အထားတွေ ခွင့်ပြုတဲ့အခါ တိကျတဲ့ မှတ်တမ်းတွေကို ပြန်လည်စစ်ဆေးတယ်။ Musubi သက်ရှိအလွတ်မဟုတ်တဲ့ လှီးခြင်း ဗီဇပြောင်းမှုကို ပယ်ချပါတယ်။ လျှို့ဝှက်ထားသော ကိုယ်စားလှယ်လောင်းတွေကို စစ်ဆေးဖို့ `--dry-run` ကိုသုံးပါ။

## ထုပ်ပိုးခြင်းနှင့် ထုတ်ဝေခြင်း {#packaging-and-publishing}

Archive မရေးခင် clean positive file set ကို စစ်ဆေးပြီး Canonical package ကို တည်ဆောက်ပါ။

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` စာရေးသည် `target/package/<namespace>-<name>-<version>.car`. နိုင်ငံတကာ CAR Canonical package manifest ကို၊ semantic release manifest ကို၊ exact verification lock ကို၊ source tree ကို၊ interface digest ကို ချိတ်ဆက်ပေးပြီး SoraFS စာရွက်စာတမ်းဆိုင်ရာ တာဝန်ရှိမှု မရှိပါ။ `pack`, `--car-out`, `--sorafs-manifest-out`, ဒါမှမဟုတ် `--source-plan-out` ပထမဦးဆုံးထုတ်ပြန်မှုမှာ Commands CLI.

ထုတ်ဝေခြင်းသည် လက်မှတ်ထိုး၍ ပြန်လည်စတင်နိုင်သောကွန်ရက်အလုပ်ဖြစ်စဉ်တစ်ခုဖြစ်သည်။ ရွေးချယ်ထားသော `client.toml` တွင်ထုတ်လုပ်မှု `[musubi.publication]` ချိတ်ဆက်ချက်များအပြင် အကောင့်နှင့် Taira ကွန်ရက်ပြုပြင်မှုကိုပါ ၀ င်ရမည်။ အလုပ်ခွင်အဖွဲ့ဝင်တစ် ဦး ကိုတိကျစွာ package:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

အသုံးပြုခြင်း `--detach` လုပ်ငန်းစာရင်းနဲ့ မျိုးစေ့ဝင်ရောက်မှု နယ်နိမိတ်ဟာ ရေရှည်ခံပြီးနောက် ပြန်လာဖို့ပါ။ ရေရှည်တည်တံ့တဲ့ လုပ်ငန်းကို ဆက်လုပ်ပါ။ `publish --resume <operation-id> --config client.toml`. ကျဉ်းမြောင်းတဲ့ `--recover <operation-id>` Path ဟာ မပြောင်းလဲနိုင်တဲ့ ဘေးကားတွေ ပျောက်ဆုံးနေတာကို ပိတ်ရက်မတိုင်ခင်က စင်ကြယ်တဲ့ ဂျာနယ်တစ်ခုအတွက် ပြန်လည်တည်ဆောက်တာပါ။ ထုတ်ဝေမှုမရှိဘူး။ `--dry-run` (သို့) အထွေထွေ အများပြည်သူ upload backback ကို run လုပ်ပါ။ `package --list` နှင့် `package` ဒေသတွင်း ကြိုတင်ပျံသန်းမှုအတွက်ပါ။

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
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |နာမည်နေရာကို ၎င်းရဲ့ တည်ငြိမ်တဲ့ နေအိမ် ဒေတာ နေရာနဲ့ ချိတ်ဆက်ပါ။ |
|`RegisterMusubiArchiveV1` |မပြောင်းလဲနိုင်တဲ့ စစ်ဆေးထားတဲ့ source archive commitment ကို မှတ်ပုံတင်ပါ။ |
|`AddMusubiArchiveLocationV1` |သက်သေပြထားတဲ့ SoraFS မှတ်တမ်းနေရာကို ထည့်သွင်း (သို့) မွမ်းမံပါ။ |
|`PublishMusubiReleaseV1` |Package တစ်ခုကို တောင်းဆိုခြင်း (သို့) update လုပ်ပြီး မပြောင်းလဲနိုင်တဲ့ ထုတ်ပြန်ချက်တစ်ခုကို ထုတ်ဝေပါ။ |
|`SetMusubiReleaseYankV1` |တိကျတဲ့ လွတ်မြောက်မှုရဲ့ ဆွဲထုတ်ထားတဲ့ အခြေအနေကို နှိုင်းယှဉ်ပြီး သတ်မှတ်ပါ။|
|`InviteMusubiPackageMaintainerV1` |ရှင်းလင်းတဲ့ Package Role ဖိတ်ကြားမှု စီးဆင်းမှုကိုစတင်ပါ။ |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |ထိန်းချုပ်ထားတဲ့ ကမ္ဘာလုံးဆိုင်ရာ အမည်မဖော်လိုသူကို မှတ်ပုံတင် (သို့) ပြန်လည်မှတ်တမ်းတင်ပါ။|
|`AssertMusubiReleaseDigestV1` |အတိအကျ မပြောင်းလဲနိုင်တဲ့ လွတ်မြောက်မှု အရည်အသွေးကို သတ်မှတ်ပါ။|
|`FindMusubiExactPackageV1` |Package တစ်ခုနဲ့ ပြင်ဆင်ချက်တွေကို ဖတ်ပါ။ |
|`FindMusubiExactReleaseV1` |တိကျတဲ့ ထုတ်လွှင့်ချက် တစ်ပုံကို ဖတ်ပါ။|
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |အဆုံးသတ်ထားတဲ့ လွတ်မြောက်ရေး ကိုယ်စားလှယ်လောင်းတွေကို ဖြေရှင်းဖို့ (သို့) စာရင်းပေးပါ။|
|`FindMusubiArchiveLocationsV1` |ပေးသွင်းသူက ထောက်ပံ့တဲ့ နောက်ဆုံးသတ်မှတ်ထားတဲ့ လက်မှတ်နေရာတွေကို ဖတ်ပါ။ |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |လက်ရှိ အမည်မဖော်လိုတဲ့ ပစ်မှတ် (သို့) ၎င်းရဲ့ မပြောင်းလဲနိုင်တဲ့ သမိုင်းကို ဖတ်ပါ။ |

Torii သည် app route မိသားစုကို `/v1/musubi/` အောက်တွင်ဖေါ်ပြထားသည်။ MCP ကိရိယာများသည် လက်ရှိ `iroha.musubi.queries.` နှင့် `iroha.musubi.instructions.*` အမည်များကိုအသုံးပြုသည်။ ပိုကျယ်ပြန့်သော API မြေပုံအတွက် [Torii အဆုံးအသတ်မှတ်တိုင်များ](/my/reference/torii-endpoints.md) နှင့် [ မေးမြန်းချက်ညွှန်ကြားချက်](/my/reference/queries.md) ကိုကြည့်ပါ။
