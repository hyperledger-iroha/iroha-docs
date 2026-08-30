---
translation_locale: am
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama ጥቅሎች {#musubi-kotodama-packages}

Musubi ለ Kotodama ምንጭ ፓኬጆች ለመጀመሪያ ጊዜ የታተመ የፓኬጅ አስተዳዳሪ ነው። በሰንሰለት ላይ ትክክለኛ የጥገኛነት ግራፊክ ይፈታል ፣ SoraFS ን ያረጋግጣል ። የመረጃ ምንጭ ማከማቻዎች፣ የተመረጠውን የስራ ቦታ ያጠናቅቃል እና ይፈትናል፣ የካኖኒካል CAR ማከማቸት ይፈጥራል እንዲሁም የማይለወጡ መልዕክቶችን በ Iroha በኩል ያወጣል።

የሚከተሉትን ነገሮች ለማድረግ ሲያስፈልግ Musubi ይጠቀሙ:

- እንደገና ጥቅም ላይ ሊውሉ የሚችሉ Kotodama ተግባር ቤተ-መጽሐፍት ይለጥፉ።
- በ `Musubi.lock` ውስጥ ትክክለኛውን የሽግግር ግራፍ ይጫኑ ።
- ከተጠናቀቁ SoraFS ማህደር ግዴታዎች ላይ ጥገኛነት ምንጭን እንደገና መገንባት
- አንድ ፓኬጅ ወይም ባለብዙ ፓኬጆች የስራ ቦታን መገንባት እና መፈተሽ
- በሰንሰለት ላይ ባለው መዝገብ አማካኝነት ፓኬጆችን መመርመር፣ ማተም፣ ማውጣት፣ መጠበቅ ወይም ስያሜ መስጠት

## የፓኬጅ ስሞች {#package-names}

የካኖኒካል ፓኬጅ ምርጫዎች የሚከተሉትን ይጠቀማሉ:

```text
namespace/package
```

ትክክለኛ የመልቀቂያ መታወቂያዎች አንድ ስሪት ይጨምሩ:

```text
namespace/package@version
```

ከስም ቦታ በፊት ምንም ቀዳሚ `@` የለም ። አንድ ስም ቦታ እንደ `universal` የመሳሰሉ የውሂብ ቦታ ሥር ወይም እንደ `dex.universal` ያሉ የጎራ ብቃት ያላቸው የውሂብ ስፍራ ነው ። መቁጠሪያው ጥቅል ከመጠየቅዎ በፊት ያንን መዋቅራዊ የስም ቦታ ወደ አንድ የተረጋጋ መነሻ የውሂብ ክልል ያገናኛል ።

## ማኒፌስት እና መዝጊያ {#manifest-and-lockfile}

አንድ ፓኬጅ የታሸገውን የመጀመሪያ እትም ይጠቀማል `Musubi.toml` መርሐግብር. `manifest-version = 1`, Kotodama እትም `"1"`, እና IVM ABI ስሪት `1`; ተለዋጭ ማሳያ የለም ወይም ABI ሁነታ።

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

ጥገኛዎች ትክክለኛ ስሪቶችን ፣ የጥገና ወይም የመለጠፍ መስፈርቶችን ፣ እንደ `1.*` ያሉ የዱር ካርዶችን እና እንደ `>=1.0.0,<2.0.0` ያሉ በኮማ የተለዩ የማነፃፀሪያ ስብስቦችን ሊጠቀሙ ይችላሉ ። የጥገኛነት ሰንጠረዥ ቁልፍ የወላጅ-አካባቢያዊ አመጣጥ ቅጽል ስም ነው ፤ `package` ሁል ጊዜም የካኖኒካዊ የምዝገባ ምርጫ ነው።

`Musubi.lock` ግራፉን ከትክክለኛው የጄኔሲስ-መነጭ `NetworkId` እና የተጠናቀቀ የምዝገባ ቅጽበታዊ ገጽ እይታ ጋር ይያዛል። የተመረጡትን የሥራ ቦታ ሥሮች እና የማይለወጡ የመልቀቂያ አንጓዎችን ይመዘግባል ፣ የመልቀቂያ, ምንጭ, በይነገጽ, ማህደር, ABI, እና ትክክለኛ ጥገኛነት ጠርዝ ግዴታዎችን ጨምሮ.

## Taira SoraFS ማምጣት ያዘጋጁ {#configure-taira-sorafs-fetching}

Taira ለዚህ የስራ ፍሰት የህዝብ የሙከራ አውታረመረብ ነው ። ከተረጋገጠ ሰንሰለት እና የአውታረ መረብ ማንነት ጋር ከ Taira ደንበኛ ውቅር ይጀምሩ ፣ ከዚያ ከዚህ በታች ለተጠቃሚው የተወሰኑ የተረጋገጡ የማስገባት አገናኞችን ያክሉ። የሂሳብ ፊርማ ቁሳቁስ እና የአቅራቢ ኦፕሬተር ቁልፎች በባለቤትነት ብቻ በሚገኙ የስራ ሰዓት ፋይሎች ውስጥ መቆየት አለባቸው።

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

የ Taira ተቀባይነት ያላቸውን አቅራቢዎች ከህዝባዊ የሙከራ ኔትወርክ ሥር ይፈልጉ:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

የአቅራቢው ካታሎግ የአቅራቢያውን ማንነት እና የታወጁ የመጨረሻ ነጥቦችን ያቀርባል ። ከተመረጠው አቅራቢ ጋር የሚዛመድ ኦፕሬተርን ፈቃድ ያግኙ። ሩጫ ጊዜ ያንን ቁልፍ የተገደበ ዥረት ቶከኖችን ለመጠየቅ ይጠቀማል; ቶከኖች የ CLI ክርክሮችም ሆነ የመቆለፊያ ፋይል ይዘት አይደሉም.

A ን አይጠቀሙ Taira ማረጋገጫ ፒን URL እንደ `url`. የተመዘገቡት ማረጋገጫ ሰጪዎች የተቀረጹ ናቸው SoraFS ማከማቻው ተሰናክሏል። `https://taira-validator-{1,2,3,4}.sora.org` የመጨረሻ ነጥቦች የፒን ምዝገባ ይቀበላሉ ፣ የአርኪቭ አንባቢዎች የተመረጠውን ተቀባይነት ያለው አቅራቢ ይጠቀማሉ HTTPS መነሻ።

## የአካባቢው የስራ ፍሰት {#local-workflow}

ከቅድመ-መንገድ Iroha የስራ ቦታ ሥሩ, የፓኬጅ ማውጫውን ይፍጠሩ ወይም ያስገቡ እና በ Cargo በኩል Musubi ያሂዱ:

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

`fetch` የተጠናቀቀውን የምዝገባ ግራፊክ ይፈታል ፣ የሚፈቀድ ከሆነ `Musubi.lock` ን ያዘምናል ፣ እና ከማረጋገጡ SoraFS አካባቢዎች የማይለወጥ የአካባቢያዊ ካሽ ይሞላል ። `check` ፣ `build` ፣ `test` እና `package` ከራሳቸው ሥራ በፊት ተመሳሳይ የግራፍ እና ካሽ ፍተሻዎችን ያካሂዳሉ።

ማንኛውንም የመቆለፊያ ፋይል ለውጥ ውድቅ ለማድረግ `--locked` ይጠቀሙ። የምዝገባ ማውጫው መረጃ ጠቋሚ እና ሁሉም አስፈላጊ ማህደሮች ቀድሞውኑ ካሽ ውስጥ ሲቀመጡ ብቻ `--offline` ይጠቀሙ። `--frozen` እነዚህን ሁለት ገደቦች ያጣምራል ። ከመስመር ውጭ ካሽ አልተሳካም; Musubi በጭራሽ ያልተፈታ መቆለፊያፋይልን አይጽፍም.

ጥገኛነት ምንጮች እንደ `math::add()` ያሉ ብቃት ያላቸው ጥሪዎችን ወደ ውስጣዊ Kotodama ስሞች በመፃፍ የተገናኙ ናቸው ። ያልተላከው ተግባር ላይ ጥገኛነት ጥሪ ውድቅ ተደርጓል ። ከውጭ የሚገቡ ቤተ-መጽሐፍት ተግባራትን ያጋልጣሉ ፣ አካባቢያዊ `[[contract]]` እና `[[test]]` ግቦች ግልፅ የፓኬጅ ግቦች ሆነው ይቆያሉ ።

## የመጠባበቂያ ማረጋገጫ እና ጥገና {#cache-verification-and-repair}

የህዝብ መሸጎጫ ትዕዛዞች የማይለወጡ, መዝገብ-ተሰማርተው ላይ ይሰራሉ:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` ተለይቶ ማቆያዎች እምነት የሚጣልባቸውን ዘሮች ያበላሻሉ እና የተጠናቀቁ አቅራቢ ማስረጃዎች ሲፈቅዱ ትክክለኛውን ማህተም ይለውጣል። Musubi የቀጥታ ያልሆነ ባዶ የመቁረጫ ለውጥ ውድቅ ያደርጋል ። የተመደቡትን እጩዎች ለመፈተሽ `--dry-run` ይጠቀሙ።

## ማሸጊያ እና ህትመት {#packaging-and-publishing}

አንድ ማህደር ለመጻፍ በፊት ንጹሕ አዎንታዊ ፋይል ስብስብ ይፈትሹ, ከዚያም ቀኖናዊ ፓኬጅ ይገንቡ:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` ይጽፋል `target/package/<namespace>-<name>-<version>.car`. የ CAR የካኖኒካል ፓኬጅ ማኒፌስት ፣ የሴማንቲክ ልቀት ማኒፌስ ፣ ትክክለኛ የማረጋገጫ መቆለፊያ ፣ ምንጭ ዛፍ ፣ በይነገጽ ዲጀስት እና SoraFS የመረጃ ቋት ግዴታ የለም `pack`, `--car-out`, `--sorafs-manifest-out`, ወይም `--source-plan-out` በመጀመሪያው እትም ውስጥ ያሉ ትዕዛዞች CLI.

ህትመት የተፈረመ ፣ እንደገና ሊጀመር የሚችል የአውታረ መረብ የሥራ ፍሰት ነው። የተመረጠው `client.toml` የምርት `[musubi.publication]` አገናኞችን እንዲሁም የሂሳብ እና Taira አውታረመረብ ውቅርን ይ containsል። በትክክል አንድ የስራ ቦታ አባል ያካትታል:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

የስራ መዝገብ እና ዘር-መግቢያ ወሰን ዘላቂ ከሆኑ በኋላ ለመመለስ `--detach` ይጠቀሙ. በ `publish --resume <operation-id> --config client.toml` ጋር ዘላቂ ሥራን ይቀጥሉ. ጠባብ የሆነው `--recover <operation-id>` መንገድ ብቻ ነው እንደገና የሚሰራው ። ለንጹህ የቅድመ-መግቢያ መጽሔት የማይለወጡ የጎን ተሽከርካሪዎች ይጎድላሉ. ምንም ህትመት የለም `--dry-run` ወይም አጠቃላይ የህዝብ ጭነት ውድቀት; ለአካባቢያዊ ቅድመ በረራ `package --list` እና `package` ይሮጡ።

## የምዝገባ ጥያቄዎች እና የሕይወት ዑደት {#registry-queries-and-lifecycle}

ተመሳሳይ Taira የደንበኛ ውቅር ጋር የተጠናቀቀ መዝገብ ፍለጋ እና ምርመራ:

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

የያኪንግ ነባር ትክክለኛ መቆለፊያዎች እንደገና ሊታዩ በሚችሉበት ጊዜ ከአዳዲስ መፍትሄዎች የማይለወጥ ልቀት ይከለክላል ። የአሁኑን የያንኪንግ ማሻሻል በመጀመሪያ ያንብቡ ፣ ከዚያ አወዳድር እና ያዘጋጅ ለውጥ ያቅርቡ

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

ይህን ሁኔታ ለመለወጥ ተመሳሳይ ፓኬጅ, ስሪት ጋር `unyank` ይጠቀሙ. ፓኬጅ ባለቤትነት እና ጠባቂ ሚናዎች መቆጣጠር ያወጣል, ያንክ, ሜታዳታ, ዓለም አቀፍ ቅጽል ስሞች የራሳቸው የዋጋ ምዝገባ, ዳግም ማጣቀሻ ታሪክ, እና አወዳድር-እና-አዘጋጅ revisions አላቸው; እነዚህ ጥቅል ባለቤትነት አቋራጭ አይደሉም.

## Iroha ወለሎች {#iroha-surfaces}

Musubi ለመጀመሪያ ጊዜ የወጣውን V1 መመሪያ እና መጠይቆችን ይጠቀማል:

|ወለል |ዓላማ|
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |የስም ቦታውን ወደ ቋሚው የቤት ውሂብ ቦታው ያገናኙ። |
|`RegisterMusubiArchiveV1` |የማይለወጥ የተረጋገጠ ምንጭ ማህደር ግዴታ መመዝገብ። |
|`AddMusubiArchiveLocationV1` |የተረጋገጠ SoraFS የመረጃ ቋት ቦታን ይጨምሩ ወይም ያድሱ። |
|`PublishMusubiReleaseV1` |አንድን ፓኬጅ ማረጋገጥ ወይም ማዘመን እና አንድ የማይለወጥ ልቀት ማተም። |
|`SetMusubiReleaseYankV1` |ትክክለኛ የመልቀቂያ ሁኔታን አወዳድር እና ያዘጋጅ። |
|`InviteMusubiPackageMaintainerV1` |በግልጽ የታሸገ ሚና ግብዣ ፍሰት ይጀምሩ. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |ቁጥጥር የሚደረግበት ዓለም አቀፋዊ ስያሜ ይመዝገቡ ወይም እንደገና ያግኙ። |
|`AssertMusubiReleaseDigestV1` |ትክክለኛውን የማይለወጥ የመልቀቂያ ማጣሪያ ያረጋግጡ ።|
|`FindMusubiExactPackageV1` |አንድን ትክክለኛ ጥቅል እና ማሻሻያዎቹን አንብቡ። |
|`FindMusubiExactReleaseV1` |አንድ ትክክለኛ የመልቀቂያ ቅጽበታዊ ገጽ እይታን አንብብ። |
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |የተጠናቀቁ የመልቀቂያ ዕጩዎችን ይፍቱ ወይም ያዝዙ። |
|`FindMusubiArchiveLocationsV1` |በዋና አቅራቢ የተደገፉ የአርኪቭ ቦታዎችን ያንብቡ። |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |የአሁኑን የማዕረግ ስያሜ ዒላማውን ወይም የማይለወጥ ታሪክን አንብቡ።|

Torii በ `/v1/musubi/` ውስጥ የመተግበሪያውን የጉዞ ቤተሰብ ያሳያል ። MCP መሳሪያዎች የአሁኑን `iroha.musubi.queries.` እና `iroha.musubi.instructions.*` ስሞች ይጠቀማሉ። ለበለጠ ሰፊው API ካርታ [Torii መጨረሻ ነጥቦችን ](/am/reference/torii-endpoints.md) እና [ መጠይቅ ማጣቀሻን ](/am/reference/queries.md) ይመልከቱ።
