---
translation_locale: dz
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama སྦ་སྒོར་ཚུ་ {#musubi-kotodama-packages}

Musubi འདི་ Kotodama གཞི་རྟེན་པིག་ཁྲམ་ཚུ་གི་དོན་ལུ་ འགོ་དང་པ་བཏང་བའི་པིག་ཁྲ་འཛིན་སྐྱོང་པ་ཨིན། འདི་གིས་ཐད་ཀར་དུ་ ལྕགས་ཐག་ནང་ལུ་ ཡོངས་འབྲེལ་འབྲེལ་བ་ཡོད་པའི་ རྩིས་རིས་ཅིག་ སེལ་འཐུ་འབད་ཞིནམ་ལས་ SoraFS འདི་བདེན་ཁུངས་འབདཝ་ཨིན། གཞི་རྟེན་ཡིག་སྣོད་ཚུ་ བསྡུ་སྒྲིག་དང་བརྟག་དཔྱད་འབདཝ་ཨིན། བཙག་འཐུ་གྲུབ་མི་ ལཱ་གི་ས་ཁོངས་འདི་ བཟོ་སྐྲུན་འབད་དོ་ཡོདཔ་ཨིན། CAR ཡིག་སྣོད་ཚུ་ ཀ་ནན་གྱི་ཐོག་ལས་བཟོ་བཀོད་འབད་དོ་ཡོདཔ་མ་ཚད་ Iroha གྱི་རྒྱུད་ལས་ བསྒྱུར་བཅོས་འབད་མི་བཏུབ་པའི་ པར་སྐྲུན་ཡང་འབདཝ་ཨིན།

ཁྱོད་ཀྱིས་ Musubi ལག་ལེན་འཐབ་དགོ་པ་ཅིན་:

- སླར་ལོག་ལག་ལེན་འཐབ་ཚུགས་པའི་ Kotodama འགན་ཁུར་གི་དཔེ་མཛོད་ཚུ་ དཔར་བསྐྲུན་འབདཝ་ཨིན།
- ཟད་འགྲོ་བཏང་ཐངས་ཚུ་ `Musubi.lock` ལུ་བཙུགས་དགོ།
- མཐའན་མཇུག་གི་ SoraFS ཡིག་སྣོད་འགན་ཁག་ཚུ་ལས་བརྟེན་པའི་འབྱུང་ཁུངས་སླར་གསོ་འབད་ནི།
- བསྡུ་སྒྲིག་གཅིག་ ཡང་ན་ བསྡུ་ཡིག་མང་རབས་ཅིག་བཟོ་སྟེ་ བརྟག་དཔྱད་འབདཝ་ཨིན།
- ལྕགས་ཐག་གི་གུ་ཡོད་པའི་ ཐོ་བཀོད་ནང་ལུ་ བརྟག་ཞིབ་འབད་ནི་དང་ དཔར་བསྐྲུན་འབད་ནི་ དེ་ལས་ འབག་ཐོབ། བདག་འཛིན་འཐབ་ནི་ ཡང་ན་ མིང་གཞན་གྱི་པེ་ཅེསཌ་ཚུ་

## སྦ་སྒོའི་མིང་། {#package-names}

Canonical Package Selectors གིས་ ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན།

```text
namespace/package
```

དཔར་བསྐྲུན་འབད་ནིའི་ ངོ་རྟགས་ཚུ་ འདྲ་བཤུས་ཅིག་བཙུགས་ནི།

```text
namespace/package@version
```

མིང་གི་ས་སྟོང་ཅིག་གི་ཧེ་མར་ `@` འདི་མེད་ཨིན། མིང་གི་ས་ཆ་འདི་ `universal`བཟུམ་ཅིག་སྦེ་ ཌེ་ཊ་ས་སྟོང་གི་རྩ་བ་ ཡང་ན་ `dex.universal`བཟུམ་ཅིག་སྦེ་ ས་ཁོངས་ནང་ ཁྱད་ཚད་ལྡན་པའི་ གནད་སྡུད་ས་སྟོང་ཨིན། ལེ་ཇིར་འདི་གིས་ གཞི་སྒྲིག་གི་མིང་གི་ས་སྟོང་དེ་ གྲོང་གསེབ་ཅིག་བཀོད་མ་ཚུགསཔ་ལས་ ཧེ་མའི་ཁུངས་ཀྱི་ གནས་སྡུད་ས་ཁོངས་གཅིག་ལུ་བསྡོམས་འབདཝ་ཨིན།

## manifest དང་ lockfile {#manifest-and-lockfile}

སྦ་སྒོར་ཅིག་ནང་ སྒོ་བསྡམས་བཞག་མི་ ཨང་དང་པ་ཐོན་ཐངས་ལག་ལེན་འཐབ་ཨིན། `Musubi.toml` schema. manifest གིས་ གསལ་སྟོན་འབད་དགོཔ་ཨིན། `manifest-version = 1`, Kotodama དཔར་བསྐྲུན་ `"1"`, དང་ IVM ABI འདྲ་ཕབ། `1`; བསྒྱུར་བཅོས་གསལ་སྟོན་ཚུ་མེད་ ཡང་ན་ ABI གནས་སྟངས་འདི་ཨིན།

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

dependencies གིས་དག་པ་ཅན་གྱི་བཟོ་བཀོད་དང་ caret ཡང་ན་ tilde དགོས་མཁོ་ཚུ་ wildcards དཔེར་ན་ `1.*` དང་ comma-separated comparator sets འདི་བཟུམ་སྦེ་ `>=1.0.0,<2.0.0` ལག་ལེན་འཐབ་ཚུགས། dependency table keyའདི་ parent-local import aliasཨིན་; `package` འདི་ཨ་རྟག་རང་ canonical registry selectorཨིན།

`Musubi.lock` གིས་ རྩིས་ཁྲ་འདི་ genesis-derived exact `NetworkId` དང་ མཇུག་བསྡུ་མི་ register snapshot ལུ་བསྡུགསཔ་ཨིན། འདི་གིས་སེལ་འཐུ་འབད་ཡོད་པའི་ workspace rootsདང་ immutable release nodeཚུ་ ཐོ་བཀོད་འབདཝ་ཨིན། ཐོ་བཀོད་འབད་ནིའི་དོན་ལས་ ཌེ་པི་ཨེསི་ཨེམ་གི་ཁ་བྱང་ཚུ་ ཨེབ་གཏང་འབད་ནི་དང་ གཞི་རྟེན་དང་ ཡོངས་འབྲེལ་དང་ ཡིག་སྣོད་ ABI དེ་ལས་ དྭངས་གསལ་སྦེ་འབྲེལ་བ་ཡོད་པའི་མཐའ་མཚམས་ལུ་ བསྡུ་ལེན་འབད་ནི་ཨིན། གྲ་སྒྲིག་འདྲ་བཤུས་ཚུ་ སེལ་འཐུ་འབད་ཡོད་མི་ རྩིས་ཁྲམ་གིས་ དགོས་མཁོ་འབད་བའི་སྐབས་བཏུབ་ཨིན།

## གཞི་སྒྲིག་འབདཝ་ཨིན། Taira SoraFS འབག་འོང་ནི་ {#configure-taira-sorafs-fetching}

Taira འདི་ འ་ནི་ལཱ་རྒྱུན་འགྲུལ་གྱི་དོན་ལུ་ མི་མང་གི་བརྟག་དཔྱད་ཐིག་ཨིན། ཁྱོད་ཀྱིས་ Taira ཌའི་ལོག་ client གཞི་སྒྲིག་ནང་ལས་འགོ་བཙུགས་ཏེ་ ཐོ་བཀོད་འབད་ཡོད་པའི་ chain དང་ network ངོ་རྟགས་ཚུ་དང་ཕྱདཔ་ད་ འོག་ལུ་ provider-specific authenticated fetch bindings བཅའ་མར་གཏོགས་དགོ། Account signing material དང་ provider operator keys འདི་ owner-only runtime files ནང་བཞག་དགོཔ་ཨིན།

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

ཁྱོད་ཀྱིས་ Taira གྱི་ལག་ལེན་འཐབ་མི་ ཞབས་ཏོག་ཚུ་ public testnet rootནང་ལས་འཚོལ་ཚུགས།

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

ཞབས་ཏོག་བྱིན་མི་གི་ཐོ་ཡིག་འདི་ ཞབས་ཏོག་སྤྲོད་མི་གི་ ངོ་རྟགས་དང་མཐའན་མཇུག་གི་གསལ་བསྒྲགས་འབད་ཡོད་པའི་ཐོ་བཀོད་ཚུ་ གྲོང་སྒྲིག་འབདཝ་ཨིན། ཁྱོད་ཀྱིས་ གདམ་ཁ་རྐྱབ་མི་ ཞབས་ཏོག་མཁོ་ཆས་ལས་ མཐུན་རྐྱེན་ལག་ལེན་པའི་ཆོག་ཐམ་ཐོབ་ཨིན། འགྲུལ་ལམ་དུས་ཚོད་འདི་གིས་ འ་ནི་ལྡེ་མིག་དེ་ལག་ལེན་འཐབ་ཐོག་ལས་ ཚོད་བསྲེའི་རྒྱུན་འགྲུལ་གྱི་ལྡེ་མིག་ཚུ་བཙུགསཔ་ཨིན། ཐོ་བཀོད་ཀྱི་ལྡེ་མིག་འདི་ CLI གྲོས་བསྡུར་དང་ལྡེ་མིག་གི་ ཡིག་སྣོད་ཚུ་ཡང་མེདཔ།

ལག་ལེན་འཐབ་ནི་མི་འོང་། Taira པ་ཝེ་ཌི་ཊར་པིན་ URL འདི་བཟུམ་སྦེ་ `url`. ཐོ་བཀོད་འབད་ཡོད་པའི་བརྟག་དཔྱད་འཕྲུལ་ཆས་ཚུ་ནང་ བཙུགས་ཡོདཔ་ཨིན། SoraFS སྦ་སྒོར་མ་བཏུབ་པར་བཞག་ཡོདཔ་ཨིན། `https://taira-validator-{1,2,3,4}.sora.org` མཐའན་མཇུག་གི་སྒོ་སྒྲིག་ཚུ་གིས་ པིན་གྱི་ ཐོ་བཀོད་ཆ་ལེན་འབད་དོ་ཡོདཔ་ད་ ཡིག་སྣོད་ལྷག་ཐངས་ཚུ་ གདམ་ཁ་རྐྱབ་མི་ ངོས་འཛིན་ཅན་གྱི་ ཞབས་ཏོག་བྱིན་མི་གི་ ཐོ་བཀོད་ཀྱི་ལག་ལེན་འཐབ་ཨིན། HTTPS འབྱུང་ཁུངས།

## ས་གནས་ཀྱི་ ལཱ་འབད་ཐངས་ {#local-workflow}

ཡར་ཐུག་ལུ་ Iroha ཝང་མིག་གི་རྩ་ལས་, Package Directory བཟོ་ནི་དང་ ཡང་ན་ ནང་བཙུགས་འབད་ཞིནམ་ལས་ Musubi འདི་ Cargo གྱི་ཐོག་ལས་ལག་ལེན་འཐབ་འོང་།

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

`fetch` གིས་ ཐོ་བཀོད་འབད་ཚར་མི་ ཐོ་བཀོད་ཀྱི་རྩིས་ཁྲ་འདི་ སེལ་འཐུ་འབགཔ་ཨིན། ཕབ་ལེན་འབད་བ་ཅིན་ ད་ལྟོའི་གནས་སྟངས་ནང་ `Musubi.lock` བཏོན་གཏང་ནི་ དེ་ལས་ རང་སོའི་ལཱ་མ་འབད་བའི་ཧེ་མར་ SoraFS གི་གནས་ས་ནང་ལས་ གནས་སྐབས་ཀྱི་ ས་གནས་དེ་ བསྡུ་སྒྲིག་འབདཝ་ཨིན། `check`, `build`, `test` དང་ `package` འདི་བཟུམ་སྦེ་ རྩིས་ཁྲ་དང་ དྲན་རྫི་ཚུ་ བརྟག་ཞིབ་འབདཝ་ཨིན།

ལག་ལེན་འཐབ་ནི་ `--locked` ལོགསི་ཡིག་སྣོད་ནང་ལུ་ བསྒྱུར་བཅོས་འབད་མི་ཚུ་ ཆ་མེད་གཏང་ནིའི་དོན་ལུ་ ལག་ལེན་འཐབ་ `--offline` ཐོ་བཀོད་ཐོ་ཡིག་དང་ དགོས་མཁོ་ཅན་གྱི་ ཡིག་སྣོད་གཉིས་ཆ་ར་ ཕྱིར་བཏོན་འབད་ཚར་ཞིནམ་ལས་རྐྱངམ་ཅིག་ཨིན། `--frozen` འདི་གཉིས་ཆ་ར་ འབྲེལ་མཐུད་འབདཝ་ཨིན། Offline cache མེདཔ་བཟོཝ་ཨིན། Musubi སླར་ཡང་ སེལ་མ་ཚུགས་པའི་ལྡེ་མིག་ཡིག་སྣོད་ཅིག་འབྲི་མི་ཚུགས།

འབྲེལ་བ་འབྱུང་ཁུངས་ཚུ་ `math::add()`བཟུམ་ ཁྱད་ཚད་ཅན་གྱི་འབོ་མི་ཚུ་ལུ་ deterministic ནང་འཁོད་གི་མིང་ Kotodama ལུ་བསྐྱར་ཡིག་འབྲུ་འབད་ཐོག་ལས་འབྲེལ་མཐུད་འབདཝ་ཨིན། ཕྱིར་ཚོང་མ་འབད་མི་ འགན་ཁུར་ལུ་བརྟེན་པའི་འབོ་མི་འདི་ ཆ་མེད་བཏང་ཡོདཔ་ཨིན། ནང་འདྲེན་འབད་མི་ དཔེ་མཛོད་ཁང་ཚུ་གིས་ འགན་ཁུར་ཚུ་བཏོན་དོ་ཡོདཔ་ལས་ ས་གནས་ཀྱི་ `[[contract]]` དང་ `[[test]]` དམིགས་གཏད་ཚུ་ ངེས་པར་དུ་ ཕབ་ལེནཌ་གི་ དམིགས་གཏདཔ་སྦེ་ བཞག་དོ་ཡོདཔ་ཨིན།

## Cache བརྟག་དཔྱད་དང་ ཉམས་བཅོས་ {#cache-verification-and-repair}

མི་སེར་གྱི་ ཀ་ཤིའི་བཀའ་རྒྱ་ཚུ་ བསྒྱུར་བཅོས་མ་བཏུབ་པའི་ ཐོ་བཀོད་ཅན་གྱི་ཡིག་སྣོད་ཚུ་ནང་ལུ་ ལག་ལེན་འཐབ་ཨིན།

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` ཟུར་བཞག་ཁང་གིས་ ཡིད་ཆེས་མི་བརྒྱུད་ཚུ་ལུ་ གནོད་སྐྱོན་རྐྱབ་དོ་ཡོདཔ་མ་ཚད་ སྒྲིག་གཞི་བཟོ་སྐྲུན་འབད་ནིའི་ ཐབས་ལམ་མཇུག་བསྡུ་བའི་སྐབས་ དབྱེ་ཞིབ་ཡིག་ཚང་ཚུ་ བསྐྱར་གསོ་འབདཝ་ཨིན། Musubi གིས་ འཚོ་བ་མེད་པའི་ ལྕང་ལཱ་གི་འགྱུར་བཅོས་ཅིག་ ཆ་མེད་བཏང་དོ་ཡོདཔ་ཨིན། གསལ་བསྒྲགས་འབད་མི་ འདེམས་ངོ་ཚུ་ལུ་བལྟ་ནིའི་དོན་ལུ་ `--dry-run` ལག་ལེན་འཐབ་དགོ།

## སྦ་སྒོར་དང་ དཔར་སྐྲུན་ {#packaging-and-publishing}

ཡིག་སྣོད་བཀོད་པའི་ཧེ་མར་ གཞི་སྒྲིག་འབད་ཡོད་པའི་གཙང་མ་ཨང་ལྡོག་ཅན་གྱི་ཡིག་སྣོད་ཚུ་ བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ སྒྲིག་གཞི་འདི་བཟོ་དགོ།

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` གིས་ `target/package/<namespace>-<name>-<version>.car` འབྲི་དོ་ཡོདཔ་ཨིན། CAR གིས་ ཀ་ནོ་ནི་ཀཱལ་པེ་ཁེཌི་ manifest, semantic release manifest, exact verification lock, source tree, interface ཚུ་བཅིངས་འབདཝ་ཨིན། digest དང་ SoraFS ཡིག་སྣོད་གི་འགན་ཁུར་ཚུ་ཨིན། འགོ་དང་པ་བཏང་མི་ནང་ `pack`, `--car-out`, `--sorafs-manifest-out` ཡང་ན་ `--source-plan-out` གི་བཀའ་རྒྱ་ཚུ་མེད་ CLI

དཔར་བསྐྲུན་འབད་ཐངས་འདི་ ཐོ་བཀོད་འབད་ཚུགས་མི་ སྒྲིག་འཇུག་གི་ལས་རིམ་ཨིན། བཙག་འཐུ་གྲུབ་པའི་ `client.toml` འདི་ནང་ བཟོ་སྐྲུན་ `[musubi.publication]` གི་བཅའ་ཡིག་ཚུ་ དེ་ལས་རྩིས་ཁྲ་དང་ Taira གྱི་དྲ་ལམ་བཟོ་སྒྲིག་ཚུ་ཡང་ཡོད་དགོཔ་ཨིན། ལས་འགན་གནས་སྟངས་ཀྱི་ཡན་ལག་ཅིག་:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

ལག་ལེན་འཐབ་ `--detach` ལས་འགུལ་གྱི་དུས་དེབ་དང་ སོན་འཛུལ་ཐོ་བཀོད་མཐའ་མཚམས་ཚུ་ ཡུན་བརྟན་སྦེ་ཡོད་པའི་ཤུལ་ལུ་ ལོག་སྤྱོད་འབད་ནིའི་དོན་ལུ་ ལག་ལེན་འཐབ་ རྒྱུན་སྐྱོང་གི་ལཱ་འདི་ `publish --resume <operation-id> --config client.toml` ལུ་ འཕྲོ་མཐུད་འབད་བཅུགཔ་ཨིན། ལམ་ཆུང་བ་ `--recover <operation-id>` གིས་བསྐྱར་བཟོ་འབདཝ་ཨིན། འཛུལ་ཞུགས་འབད་མ་འོང་པའི་ སྔོན་འགོག་དུས་དེབ་གི་དོན་ལུ་ བསྒྱུར་བཅོས་འབད་མི་ sidecars མེད་དོ་ཡོདཔ་ཨིན། `--dry-run` ཡང་ན་ སྤྱིར་བཏང་སེལ་འཐུ་འབད་མི་ fallback འདི་མེད་; ས་གནས་ཀྱི་ preflight གི་དོན་ལུ་ `package --list` དང་ `package` རྒྱུགས་གཏང་།

## ཐོ་བཀོད་ཡིག་ཚང་གི་དྲི་བ་དང་ དུས་ཚོད། {#registry-queries-and-lifecycle}

ཁྱོད་ཀྱིས་ Taira ཌོག་ཊར་གྱི་སྒྲིག་གཞི་དེ་བཟུམ་སྦེ་ ཐོ་བཀོད་འབད་ཡོད་པའི་ཐོ་ཡིག་འདི་འཚོལ་ཞིནམ་ལས་ བརྟག་ཞིབ་འབདཝ་ཨིན།

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

Yanking གིས་ གྲོས་ཐག་གསརཔ་ཚུ་ནང་ལས་ བསྒྱུར་བཅོས་འབད་མ་ཚུགསཔ་ཅིག་ལུ་ བཀག་ཆ་འབད་ཡོདཔ་ད་ ཧེ་མ་ཡོད་མི་ཚུ་ ཡང་དག་པའི་ལྡེ་མིག་སྦེ་ བཟོ་ཚུགས་པའི་བསྒང་ཡོད། དང་པ་ར་ ད་ལྟོའི་ yank བསྐྱར་ཞིབ་དེ་ ཀློག་སྟེ་ བལྟ་ཞིནམ་ལས་ compar-and-set གྱི་འགྱུར་བཅོས་བཙུགས་དགོ།

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

ལག་ལེན་འཐབ་ `unyank` འདི་ཡང་པིག་ཁྲ། འདྲ་བཤུས་དང་ ཀློག་པ་གསརཔ་ལུ་བསྐྱར་བཅོས་འབད་ཡོད་པའི་གནས་སྟངས་འདི་ལོག་འགྱོ་བཅུག་ཨིན། པིག་ཁྲ་གི་བདག་འཛིན་དང་ ལྟ་རྟོག་པའི་འགན་ཁུར་ཚུ་ Publish, yank, metadata, དེ་ལས་ ཡིག་སྣོད་གནས་སྡུད་གི་ཆོག་ཐམ་ཡང་ཡོདཔ་ཨིན། འཛམ་གླིང་ཡོངས་ཀྱི་མིང་རྟགས་འདི་ རང་སོའི་རིན་ཐོ་བཀོད་དང་ བསྐྱར་ཞིབ་འབྱུང་ཁུངས། འདྲ་བཤུས་དང་བསྡུར་དང་གཞི་སྒྲིག་བསྐྱར་བཅོས། དེ་ཚུ་པེ་ཅོག་གི་བདག་འཛིན་གྱི་ shortcutsམེན།

## Iroha ས་ཁོངས། {#iroha-surfaces}

Musubi གིས་ འགོ་དང་པ་བཏང་མི་ བརྡ་བཀོད་དང་དྲི་ཚུ་ V1 ལག་ལེན་འཐབ་ཨིན།

|ས་ཁུལ |དམིགས་གཏད་ |
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |མིང་གི་ས་སྟོང་འདི་ ཁྱིམ་ནང་གི་ གནས་སྡུད་ཀྱི་ས་སྟོང་ལུ་བསྡམ་དགོ།|
|`RegisterMusubiArchiveV1` |གཞི་རྟེན་ཡིག་སྣོད་ནང་ལུ་ བསྒྱུར་བཅོས་འབད་མ་ཚུགསཔ་ཅིག་ཨིན་པའི་ ཁས་བླངས་འདི་ ཐོ་བཀོད་འབད། |
|`AddMusubiArchiveLocationV1` |SoraFS ཡིག་སྣོད་གནས་སྟངས་དེ་ བརྟག་ཞིབ་འབད་ཡོད་པའི་ ས་སྒོ་ཅིག་ ཁ་སྐོང་རྐྱབས་ ཡང་ན་ གསར་གཏོབ། |
|`PublishMusubiReleaseV1` |ཕབ་ལེནཌ་ཚུ་ གསལ་ཞུ་འབད་ནི་དང་ ཡང་བསྐྱར་བཟོ་བཅོས་འབད་ཞིནམ་ལས་ བསྒྱུར་བཅོས་མ་བཏུབ་པའི་ ཐོ་བཀོད་ཅིག་བསྐྲུན་འབད། |
|`SetMusubiReleaseYankV1` |དབྱེ་བ་དང་དབྱེ་ཞིབ་འབད་ཞིནམ་ལས་ འོག་གི་གནས་སྟངས་འདི་ ཕྲང་གསལ་བཏང་བའི་གནས་སྟངས་ལུ་ གཞི་སྒྲིག་འབདཝ་ཨིན།|
|`InviteMusubiPackageMaintainerV1` |བསྡུ་སྒྲིག་གི་འགན་ཁུར་གྱི་གསལ་སྒྲགས་འབད་ནི་ འགོ་བཙུགས་ནི། |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |གཞུང་སྐྱོང་འབད་མི་ འཛམ་གླིང་ཡོངས་ཀྱི་ མིང་རྟགས་ཅིག་ ཐོ་བཀོད་འབད་ ཡང་ན་ ལོག་བཟུང་འབདཝ་ཨིན། |
|`AssertMusubiReleaseDigestV1` |རང་བཞིན་གནས་སྟངས་དེ་ བསྒྱུར་བཅོས་འབད་མ་ཚུགསཔ་སྦེ་ བཟའ་སྤྱོད་འབད་མི་འདི་ གསལ་བཀོད་རྐྱབས།|
|`FindMusubiExactPackageV1` |དཔེ་སྒྲོམ་གཅིག་དང་ འདི་ནང་ལུ་ བསྐྱར་ཞིབ་ཚུ་ ཀློག་ཐེངས།|
|`FindMusubiExactReleaseV1` |དྭངས་གསལ་སྦེ་གློག་བརྙན་འདི་བལྟ་གནང་། |
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |གྲོས་ཐག་ཆོད་ ཡང་ན་ མཇུག་བསྡུ་བའི་དགོངས་ཡངས་ཀྱི་འདེམས་ངོ་ཚུ་གི་ཐོ་འགོད་འབད་ |
|`FindMusubiArchiveLocationsV1` |ཞབས་ཏོག་བྱིན་མི་གིས་ རྒྱབ་སྐྱོར་འབད་མི་ ཡིག་སྣོད་གནས་ཚད་ཚུ་ ཀློག་ཚུགས། |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |ད་ལྟོའི་མིང་རྟགས་ཀྱི་ དམིགས་གཏད་ ཡང་ན་ དེའི་འགྱུར་བ་མེད་པའི་ལོ་རྒྱུས་ཚུ་ ཀློག་ཐེངས། |

Torii གིས་ `/v1/musubi/` གི་འོག་ལུ་ལག་ལེན་ལམ་གྱི་བཟའ་ཚན་བཏོན་འབདཝ་ཨིན། MCP ལག་ཆས་ཚུ་གིས་ ད་ལྟོའི་ `iroha.musubi.queries.` དང་ `iroha.musubi.instructions.*`གི་མིང་ཚུ་ལག་ལེན་འཐབ་ཨིན། [Torii མཇུག་མཐར་ཐུག་གི་ཐིག་ཁྲམ་](/dz/reference/torii-endpoints.md)དང་ [དྲི་བའི་ཁ་བྱང་](/dz/reference/queries.md)ལུ་བལྟ་ཚུགས། API ས་མཚམས་ཀྱི་དོན་ལུ་
