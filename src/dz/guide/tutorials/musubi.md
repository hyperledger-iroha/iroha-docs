---
translation_locale: dz
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama སྦ་སྒོར་ཚུ་ {#musubi-kotodama-packages}

Musubi འདི་ Kotodama གཞི་རྟེན་པིག་ཁྲམ་ཚུ་གི་དོན་ལུ་ ཕབ་ལེནཌ་འཛིན་སྐྱོང་པ་ཨིན། འདི་གིས་བཟོ་བཀོད་མི་ཚུ་ལུ་ Cargoབཟུམ་ཅིག་སྦེ་ ལཱ་འབད་ནིའི་ལམ་སྟོན་བྱིན་དོ་ཡོདཔ་ད་ བསྡུ་སྒྲིག་འབད་ཚུགས་པའི་ Kotodama འགན་ཁུར་ཚུ་བགོ་བཤའ་རྐྱབ་ནི་དང་ ཕབ་ལེན། ངོས་འཛིན་དེ་ འཛམ་གླིང་ཡོངས་ཀྱི་འགོ་དང་པ་འོང་མི་མིང་ཐོ་བཀོད་ཀྱི་ཚབ་ལུ་ SORA དང་ Iroha མིང་གི་ས་སྒོ་ཚུ་ལུ་ འབྲེལ་མཐུད་འབད་བཞག་ནུག

ཁྱོད་ཀྱིས་ Musubi ལག་ལེན་འཐབ་དགོ་པ་ཅིན་:

- སླར་ལོག་སྤྱོད་འབད་ཚུགས་པའི་ Kotodama སྐྱེ་ཁོག་དཔེ་མཛོད་ཚུ་ དཔར་བསྐྲུན་འབདཝ་ཨིན།
- ཕྲང་གནས་ཀྱི་འབྱུང་ཁུངས་ལུ་བརྟེན་པའི་ ཐབས་ལམ་ཚུ་ `Musubi.lock`
- དངོས་འཛིན་འབད་ཡོད་པའི་ SoraFS ཡིག་སྣོད་གི་འགན་ཁུར་ཚུ་ལས་བརྟེན་པའི་ གཞི་རྟེན་སླར་གསོ་འབདཝ་ཨིན།
- སྦ་སྒོའི་མིང་གི་ས་སྒོ་འདི་ མིང་གི་ས་ཁོངས་དེ་ནང་ཡོད་པའི་ dapp contract aliases ལུ་ සම්බන්ධརྐྱབས་ཚུགས།
- ལྕགས་ཐག་གི་ནང་འཁོད་ལུ་ ཐོ་བཀོད་འབད་ཡོད་པའི་ ཐོ་བཀོད་ཀྱི་ཐོག་ལས་ བརྟག་ཞིབ་འབད་ནི་དང་ དཔར་བསྐྲུན་འབད་ནི་ དེ་ལས་ ཌིཊ་ཨེབ་གཏང་འབད་ནི་ ཡང་ན་ ཨེབ་གཏང་འབད་ནི་

## སྦ་སྒོའི་མིང་། {#package-names}

Canonical package ids ལག་ལེན་འཐབ་ནི་:

```text
namespace/package
```

འདྲ་བཤུས་གསལ་གཏང་ཐངས་ཚུ་ལག་ལེན་འཐབ་:

```text
namespace/package@version
```

མིང་གི་ས་སྟོང་གི་ཧེ་མར་ `@` གི་ངོ་རྟགས་མེད་ཨིན། `@` སྦྲགས་ཐིག་འདི་ བསྒྱུར་བཅོས་འབད་ནིའི་དོན་ལས་བཞག་ཡོདཔ་ཨིན།

མིང་གི་ས་ཁོངས་འདི་ Kotodama dapp contract aliases ཚུ་གིས་ལག་ལེན་འཐབ་མི་རྒྱབ་སྒྲིལ་དང་མཐུནམ་ཨིན།

|ཕབ་ལེནཌ་ id |འབྲེལ་མཐུད་འབད་ཡོད་པའི་གན་ཡིག་གི་མཚན་རྟགས་བཟོ་རྣམ་ |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

མིང་གི་ས་སྟོང་འདི་ `<dataspace>` ཡང་ན་ `<domain>.<dataspace>` གི་བཟོ་རྣམ་ལུ་ཡོདཔ་ཨིན། ཕབ་ལེག་ཅིག་ནང་ dapp འབྲེལ་མཐུད་ཡོད་ཨིན་པ་ཅིན་ Musubi གིས་ བསྡུ་སྒྲིག་འབད་ཡོད་པའི་མིང་ཡིག་ཚང་རེ་རེ་གིས་ མིང་གི་ས་ཁོངས་ཀྱི་རྒྱབ་སྒྲིལ་དེ་ ཕབ་ལེག་གི་དོན་ལུ་ ལག་ལེན་འཐབ་ཡོདཔ་ཨིན་ན་བརྟག་དཔྱད་འབདཝ་ཨིན།

## གསལ་སྟོན་འབདཝ་ཨིན། {#manifest}

སྦ་སྒོར་འདི་ `Musubi.toml` ལས་འགོ་འདྲེན་འཐབ་ཨིན།

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

དཀའཝ་སྤྱད་མི་ཚུ་གིས་ འདྲ་བཤུས་ཚུ་ ངེས་པར་དུ་ལག་ལེན་འཐབ་ཚུགས། རིམ་ལུགས་ཀྱི་དགོས་མཁོ་དང་ ཐིག་ཁྲམ་གི་དགོས་མཁོ་ དེ་ལས་ wildcards དཔེར་ན་ `1.*` ཡང་ན་ comparator lists འདི་བཟུམ་སྦེ་ `>=1.0.0,<2.0.0`.

`Musubi.lock` གིས་ ལྕགས་ཐག་གི་ཐོ་ཡིག་ནང་ལས་ གདམ་འཐུ་འབད་ཡོད་པའི་ མཐར་འཁྱོལ་ཅན་གྱི་ རྩིས་ཁྲ་འདི་ ཐོ་བཀོད་འབདཝ་ཨིན། ལྕགས་ཀྱུའི་ལྡེ་མིག་སོ་སོ་གིས་ རང་སོའི་དབྱེ་གསལ་གྱི་ ཕབ་ལེག་ ref, དགོས་མཁོ་སེལ་འཐུ་, SoraFS manifest digest, source archive hash, byte count, file count, exported functions, deterministic source archive plan, and dependence aliases འདི་ཚུ་ གསལ་བཀོད་འབད་ཡོདཔ་ཨིན། short aliases འདི་ lockfile ནང་མ་འཛུལ་བའི་ཧེ་མ་ སེལ་འཐུ་འབད་ཡོདཔ་ཨིན།

## ས་གནས་ཀྱི་ ལཱ་འབད་ཐངས་ {#local-workflow}

Iroha ལས་འགུལ་ས་ཁོངས་ཀྱི་རྩ་བ་ལས་ཡར་ཐུག་ལུ་ Musubi རྒྱུན་འགྲུལ་འཐབ་དགོ།

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

ཁྱོད་ཀྱིས་ `install --offline` ལག་ལེན་འཐབ་སྟེ་ ཐད་ཀར་དུ་ཨེབ་གཏང་མ་བཏུབ་པའི་ལྡེ་མིག་ཡིག་སྣོད་ཅིག་ ཡིག་སྣོད་ནང་བཙུགས་ཏེ་ ཨེབ་གཏང་འབད། ཁྱོད་ཀྱིས་ CI ནང་ `install --locked` ལག་ལེན་འཐབ་ཞིནམ་ལས་ རྒྱུན་ཆད་མེད་པའི་ལྡེ་མིག་ ཡིག་སྣོད་འདི་ ཁ་བཟེད་ཚུགས།

`build` གིས་ `math::add()`བཟུམ་ཅིག་སྦེ་ ཀི་ལོ་མི་ཊར་ཚུ་ ཌེ་ཊི་མཱནསི་ཊིཀགི་ ནང་འཁོད་ Kotodama འགན་ཁུར་གྱི་མིང་ལུ་བསྐྱར་ཡིག་འབྲུ་འབད་བའི་ཐོག་ལས་ ཉེན་སྲུང་ཅན་གྱི་འབྲེལ་བ་འབྱུང་ཁུངས་ཚུ་ མཐུད་སྦྲེལ་འབད་ཡོདཔ་ཨིན། འདི་གིས་ dependence གིས་ཕྱིར་ཚོང་མ་འབད་མི་ འགན་ཁུར་ཚུ་གི་དོན་ལུ་ ཀི་ལོམ་ཚུ་ ཆ་མེད་གཏང་འོང་། Musubi v1 ལི་བེརི་ཚུ་འགན་འཛིན་རྐྱངམ་གཅིག་ཨིན། གནས་སྡུད་ཀྱི་གསལ་སྒྲགས་དང་ ཐིག་གཱར་ དེ་ལས་ ཀོ་ཊོ་བྷ་ བཀྲམ་སྤེལ་འབད་ཐངས་ ཡང་ན་ འགན་འཁྲི་མེད་མི་ ཁག་འབགཔ་གཞན་ཚུ་ཡོད་པའི་འབྲེལ་བ་འབྱུང་ཁུངས་ཚུ་ ཆ་མེད་གཏང་ཡོདཔ་ཨིན།

## གཞི་རྟེན་ཡིག་སྣོད་ཚུ་འབག་ཐོབ། {#fetching-source-archives}

Musubi གིས་སེལ་འཐུ་འབད་བའི་སྐབས་ལུ་ ཡང་ན་ཤུལ་ལས་ cache གི་འོག་ལས་བཀའ་བཀོད་ཚུ་བརྒྱུད་དེ་ འགལ་བའི་འབྲེལ་བ་འབྱུང་ཁུངས་ཚུ་འཚོལ་ཚུགས་:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

ཐོ་བཀོད་འབད་ཡོད་པའི་སྒོ་སྒྲིག་ཚུ་ནང་ SoraFS སྒོ་སྒྲིག་སྤྲོད་མི་ ཞབས་ཏོག་གི་ ཁྱད་ཚད་གཅིག་ ཡང་ན་མང་ཤོས་ཅིག་ ལག་ལེན་འཐབ་ཡོདཔ་ཨིན།

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

ཞབས་ཏོག་སྤྲོད་མི་ ཕུལ་ཆས་ཕོཌ་ཡིག་སྣོད་དང་ གེ་ཊི་བེཡ (gateway providers) ཚུ་ གཅིག་གིས་གཅིག་ལུ་ བཏོན་འབག་ནིའི་ལཱ་གཅིག་གི་དོན་ལུ་ ཁྱད་པར་ཅན་ཨིན། ག་དེམ་ཅིག་སྦེ་ ཟམ་འབུམ་ཅིག་ལས་ལྷག་སྟེ་མེད་པ་ཅིན་ གེ་ཊིབེཡགི་ ཞབས་ཏོག་བྱིན་མི་རེ་རེ་ལུ་ `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` ཡང་ན་ `manifest=<64-hex SoraFS manifest digest>` ལུ་ཁྱབ་སྒྲགས་འབད་དགོ།

སྒོ་ར་སྒོ་ `base-url` དང་ `privacy-url` གནས་གོང་ཚུ་ ལག་ལེན་འཐབ་དགོཔ་ཨིན། `https://` རང་བཞིན་གྱི་ བརྟག་དཔྱད་སྒོ་སྒྲིག་ཚུ་ ལག་ལེན་འཐབ་ཚུགསཔ་ཨིན། `http://localhost`, `http://127.0.0.1`, ཡང་ན་ `http://[::1]` མཉམ་འབྲེལ་རྐྱང་ `--gateway-allow-insecure-localhost`. stream tokens འདི་ runtime credentials དང་ནང་བྲིས་མི་ཨིན། `Musubi.lock`.

## དཔེ་སྐྲུན་ཁང་ {#publishing}

`pack` computes the deterministic BLAKE3-256 source archive hash དེ་ལས་ source byte དང་ file counts. `--car-out`, `--sorafs-manifest-out`, ཡང་ན་ `--source-plan-out` འདི་བཀྲམ་སྤེལ་འབད་ཡོདཔ་ད་ འདི་ཡང་ deterministic བཟོ་སྐྲུན་ SoraFS CAR ཁེ་ཕན་གྱི་འགན་ཁུར་ཚུ་ SoraFS མངོན་གསལ་འབད་ཡོདཔ་དང་ Musubi གཞི་རྟེན་ཡིག་སྣོད་གི་འཆར་གཞི་ འདི་བཟུམ་སྦེ་ གཞི་རྟེན་ཡིག་སྡོམ་ཅིག་ལས་ཨིན།

དཔར་བསྐྲུན་མ་འབད་པའི་ཧེ་མ་ སྐམ་ལག་ལེན་འཐབ་:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

`--dry-run`མེད་པ་ཅིན་ `publish` གིས་ default artifacts ཚུ་ `.musubi/dist/<namespace>/<name>/<version>/` གི་འོག་ལུ་བྲིས་ཞིནམ་ལས་ ཐབས་ལམ་སྒྲིག་འབད་ཐོག་ལས་ manifest དང་ payload འདི་ Torii གི་ SoraFS storage-pin endpoint གྱི་ཐོག་ལས་ `--upload` ལུ་ཕབ་རྐྱབ་ཨིན། དེ་གིས་ ཐོན་སྐྱེད་འབད་མི་ SoraFS pin འདི་ཐོ་བཀོད་འབདཝ་ཨིན། དེ་ལས་ གཞི་སྒྲིག་འབད་ཡོད་མི་ Iroha client ཀྱི་ཐོག་ལས་ `PublishMusubiRelease` བཏང་འོང་།

དཔར་བསྐྲུན་འབད་མི་ གནས་ཚུལ་ཚུ་ནང་ལུ་:

- འབྱུང་ཁུངས་ཀྱི་ཡིག་སྣོད་མ་སྟོང་པ་ཅིག་
- གཞི་རྟེན་ཡིག་སྣོད་འཆར་གཞི་ཅིག་
- ཕྱིར་ཚོང་འཐབ་མི་ Kotodama འགན་ཁུར་གཅིག་མ་གཏོགས་མེད་
- ཐོ་བཀོད་འབད་ཐངས་ཚུ་ སེལ་འཐུ་མ་འབད་བར་བཞག་ཡོདཔ་ཨིན།
- dapp འབྲེལ་མཐུད་དེ་ཅིག་ཡོདཔ་ད་ འདི་ནང་ལུ་ contract aliases གིས་ package name space དང་འདྲ་མཉམ་ཨིན།

## ཐོ་བཀོད་ཡིག་ཚང་གི་དྲི་བ་དང་ དུས་ཚོད། {#registry-queries-and-lifecycle}

ཐོ་བཀོད་ནང་ལུ་འཚོལ་ཞིབ་དང་བརྟག་དཔྱད་འབད་:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Yanking གིས་ གྲོས་ཐག་གསརཔ་ལས་གློག་འཁྱོལ་མི་འདི་སྦ་བཞག་སྟེ་ ད་ལྟོའི་ལྡེ་མིག་ཚུ་ སླར་ལོག་འབད་ཚུགསཔ་བཟོཝ་ཨིན།

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi འཛམ་གླིང་ཡོངས་ཀྱི་མིང་ squatting བཀག་ཐབས་ལུ་བཟོ་ `namespace/package` མིང་གི་ས་ཁོངས་ནང་ དཔར་བསྐྲུན་འབད་ནི་ལུ་ འདྲ་མཉམ་གྱི་དབང་འཛིན་ ཡང་ན་ བརྗེ་སོར་འབད་ཡོད་པའི་ཆོག་ཐམ་བཟོ་རྣམ་ལས་ ངོས་ལེན་འབད་དགོཔ་ཨིན། དེ་གི་དོན་ལུ་ལག་ལེན་འཐབ་ཡོདཔ་ཨིན། Kotodama dapp གི་མིང་གི་ས་ཁོངས། འཛམ་གླིང་ཡོངས་ཀྱི་ short aliases འདི་ package གྱི་བདག་འཛིན་ལས་སོ་སོ་ཨིན། `SetMusubiShortAlias` དགོས་མཁོ་ཅན་གྱི་ `CanSetMusubiShortAlias` ངོས་ལེན་དང་ དམིགས་གཏད་གྱི་པེ་ཀེསི་ནང་ ཧེ་མ་ལས་ཨང་ཉུང་ཤོས་ཅིག་རང་ ཕྱིར་བཏོན་འབད་དགོཔ་ཨིན།

## Iroha ས་ཁོངས། {#iroha-surfaces}

Musubi ལག་ལེན་འཐབ་མི་ དབྱེ་རིམ་དང་པོ། Iroha ལམ་སྟོན་དང་དྲི་ཚུ་:

|ས་ཁོངས། |དམིགས་གཏད་ |
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |བསྒྱུར་བཅོས་འབད་མ་བཏུབ་པའི་ ཕབ་ལེནཌ་ གསར་བསྐྲུན་འབད།|
|`YankMusubiRelease` |ད་ལྟོའི་གློག་བརྙན་འདི་ ཕྱིར་བཏོན་འབད་ཡོད་པའི་རྟགས་བཀོད་རྐྱབས།|
|`SetMusubiShortAlias` |བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ འཛམ་གླིང་ཡོངས་ཀྱི་མིང་ཐུང་ཀུ་འདི་ ཕབ་ལེནཌ་གི་ངོ་རྟགས་ཅིག་ལུ་བསྡུད། |
|`AssertMusubiReleaseExists` |འོས་འབབ་ཅན་གྱི་ སྦ་སྒོར་གྱི་དཔེ་ཆ་ཅིག་བཟོ་དགོཔ་ཨིན། |
|`FindMusubiReleaseByRef` |བསྡུ་སྒྲིག་གི་ཁ་བྱང་ཚུ་དང་གཅིག་ཁར་ ཐོ་བཀོད་འབད་དགོ་། |
|`FindMusubiPackageVersions` |ཕབ་ལེནཌི་ ID གི་དོན་ལུ་ བསྒྱུར་བཅོས་ཚུ་ཐོ་འགོད་རྐྱབས།|
|`FindMusubiPackageReleases` |བསྡུ་སྒྲིག་གི་ ID གི་དོན་ལུ་ ཐོ་བཀོད་ཡོངས་བསྡོམས་ཚུ་ཐོ་བཀོད་ ചെയ്യുക|
|`SearchMusubiPackages` |མིང་གི་ས་སྒོ་དང་ ཡིག་སྣོད་ལུ་བརྟེན་ བསྡུ་ཡིག་བསྡོམས་ཚུ་འཚོལ་དགོ། |
|`FindMusubiShortAliasByName` |ཕྲང་མཚན་ཐུང་ཀུ་ཅིག་ སེལ་འཐུ་འབད།|

Torii གསལ་སྟོན་འབདཝ་ཨིན། Musubi HTTP འོག་གི་ཤོག་ལེབ་ཚུ་ `/v1/musubi/`. ཁྲིམས་སྲུང་འགག་པ་ལུ་གདོང་གཏོགསཔ་ཨིན། MCP ལག་ཆས་ཚུ་ གསལ་སྟོན་འབདཝ་ཨིན། `iroha.musubi.` མིང་རྟགས་ཚུ་ མཐོང་དགོ། [Torii མཐའན་མཇུག་གི་གནས་ཚད་ཚུ་](/dz/reference/torii-endpoints.md) དང་ [འདྲི་དཔྱད་ཡིག་](/dz/reference/queries.md) སྦོམ་ཤོས་ཀྱི་དོན་ལུ་ API ས་ཁྲ་འདི་
