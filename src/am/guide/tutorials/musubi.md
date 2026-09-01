---
translation_locale: am
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Musubi Kotodama ጥቅሎች {#musubi-kotodama-packages}

Musubi ለ Kotodama ምንጭ ፓኬጆች የመጀመሪያ ልቀት ጥቅል አስተዳዳሪ ነው።. በሰንሰለት ላይ ትክክለኛ ጥገኝነት ግራፍ ይፈታል፣ የ SoraFS ምንጭን ያረጋግጣል የተመረጠውን የስራ ቦታ ማህደር፣ ያጠናቅራል እና ይፈትሻል፣ ነጠላ ፕሮቶኮል-ስታንዳርድ CAR ማህደሮችን ይገነባል፣ እና የማይለወጡ ልቀቶችን በ Iroha ያትማል።

በሚፈልጉበት ጊዜ Musubi ይጠቀሙ -

- እንደገና ጥቅም ላይ ሊውሉ የሚችሉ Kotodama የተግባር ቤተ-መጻህፍት መጻሕፍት ያትሙ
- ትክክለኛውን መሸጋገሪያ ግራፍ በ `Musubi.lock` ውስጥ ይሰኩ
- የጥገኝነት ምንጭን ከተጠናቀቀው SoraFS ማህደር ክሪፕቶግራፊያዊ ኮሚትመንቶችን እንደገና ይገንቡ
- አንድ ጥቅል ወይም ባለብዙ ጥቅል የስራ ቦታ ይገንቡ እና ይሞክሩ
- በሰንሰለት መዝገብ ቤት በኩል ፓኬጆችን ይፈትሹ፣ ያትሙ፣ ያንክኑ፣ ያቆዩ ወይም ተለዋጭ ስም ያግኙ

## የጥቅል ስሞች {#package-names}

ነጠላ ፕሮቶኮል-መደበኛ ጥቅል መራጮች የሚከተሉትን ይጠቀማሉ

```text
namespace/package
```

ትክክለኛው የመልቀቂያ መለያዎች ስሪት ያክላሉ -

```text
namespace/package@version
```

ከስም ቦታ በፊት ምንም መሪ `@` የለም። የስም ቦታ እንደ `universal` ያለ የውሂብ ቦታ ስር ወይም እንደ `dex.universal` ያለ ጎራ ብቁ የሆነ የውሂብ ቦታ ነው። የብሎክቼይን መዝገብ ጥቅል ከመጠየቁ በፊት ያንን መዋቅራዊ የስም ቦታ ከአንድ የተረጋጋ የቤት ዳታ ቦታ ጋር ያገናኛል።

## የቴክኒክ ማኒፌስት እና የመቆለፊያ ፋይል {#manifest-and-lockfile}

አንድ ጥቅል የተዘጋውን የመጀመሪያ ልቀት `Musubi.toml` እቅድ ይጠቀማል። ቴክኒካል ማኒፌስት `manifest-version = 1`፣ Kotodama እትም `"1"` እና IVM ABI ስሪት `1` ማወጅ አለበት። ተለዋጭ ቴክኒካዊ ማኒፌስት ወይም ABI ሁነታ የለም።

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

ጥገኞች ትክክለኛ ስሪቶችን፣ የእንክብካቤ ወይም የቲልዴ መስፈርቶችን፣ እንደ `1.*` ያሉ የዱር ካርዶችን እና በነጠላ ሰረዝ የተለዩ የንፅፅር ስብስቦችን እንደ `>=1.0.0,<2.0.0` መጠቀም ይችላሉ። የጥገኝነት ሰንጠረዥ ቁልፍ የወላጅ-አካባቢያዊ አስመጪ ተለዋጭ ስም ነው; . `package` ሁልጊዜ ነጠላ ፕሮቶኮል-መደበኛ የመመዝገቢያ መራጭ ነው።.

`Musubi.lock` ግራፉን ከትክክለኛው የጀነሲስ የተገኘ `NetworkId` እና ከተጠናቀቀው የመመዝገቢያ ቅጽበታዊ ገጽ እይታ ጋር ያገናኛል። የተመረጡትን የስራ ቦታ ሥሮች እና የማይለወጡ የመልቀቂያ አንጓዎችን ይመዘግባል፣ መለቀቅ፣ ምንጭ፣ በይነገጽ፣ ማህደር፣ ABI እና ትክክለኛ ጥገኝነት-ጠርዝ ክሪፕቶግራፊያዊ ኮሚትመንቶችን ጨምሮ። የተፈታው ግራፍ በሚፈልግበት ጊዜ ትይዩ ስሪቶች ይፈቀዳሉ።

## አዋቅር Taira SoraFS ማምጣት {#configure-taira-sorafs-fetching}

Taira ለዚህ የስራ ሂደት ይፋዊ የሙከራ መረብ ነው።. ከ Taira ደንበኛ ውቅር በተመዝግቦ በገባው ሰንሰለት እና አሁን በተሰካው የጀነሲስ የተገኘ የአውታረ መረብ መለያ ይጀምሩ፣ ከዚያ አቅራቢ-ተኮር የተረጋገጡ የማምጣት ማሰሪያዎችን ከዚህ በታች ያክሉ። የ Taira ዳግም ማስጀመር `NetworkId`ን ሊለውጠው ይችላል። ከተረጋጋው ሰንሰለት UUID ከመገመት ይልቅ ከተፈረመው የማሰማራት መገለጫ ያድሱት። የመለያ ፊርማ ቁሳቁስ እና የአቅራቢ ኦፕሬተር ቁልፎች በባለቤት-ብቻ የሶፍትዌር ማስፈጸሚያ አካባቢ ፋይሎች ውስጥ መቆየት አለባቸው።

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

የ Taira ተቀባይነት ያላቸውን አቅራቢዎች ከህዝብ የቴስትኔት ስርወ ያግኙ -

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

የአቅራቢው ካታሎግ የአቅራቢ ማንነቶችን እና የማስታወቂያ API የመጨረሻ ነጥቦችን ያቀርባል። ከተመረጠው አቅራቢ ተጓዳኝ የኦፕሬተር ፍቃድ ያግኙ። የሶፍትዌር ማስፈጸሚያ አካባቢ የታሰሩ የዥረት ቶከኖችን ለመጠየቅ ያንን ቁልፍ ይጠቀማል; ቶከኖች CLI ክርክሮች ወይም የመቆለፊያ ፋይል ይዘት አይደሉም።

የ Taira አረጋጋጭ ፒን URL ን እንደ `url` አይጠቀሙ። ተመዝግበው የገቡት አረጋጋጮች SoraFS ማከማቻን ተካትተዋል። የእነሱ `https://taira-validator-{1,2,3,4}.sora.org` API የመጨረሻ ነጥቦቻቸው የፒን ምዝገባን ይቀበላሉ፣ የማህደር ንባብ ደግሞ የተመረጠውን የተቀበለውን አቅራቢ HTTPS አመጣጥ ይጠቀማሉ።

## አካባቢያዊ የሥራ ፍሰት {#local-workflow}

ከላይኛው ተፋሰስ Iroha የስራ ቦታ ስር፣ የጥቅል ማውጫውን ይፍጠሩ ወይም ያስገቡ እና Musubi ን በጭነት በኩል ያሂዱ -

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

`fetch` የተጠናቀቀውን የመመዝገቢያ ግራፍ ይፈታል፣ ሲፈቀድ `Musubi.lock`ን ያዘምናል፣ እና የማይለወጥ የአካባቢ መሸጎጫ ከተረጋገጡ SoraFS አካባቢዎች ይሞላል። `check`፣ `build`፣ `test` እና `package` ከራሳቸው ስራ በፊት ተመሳሳይ ግራፍ እና መሸጎጫ ፍተሻዎችን ያከናውናሉ።.

ማንኛውንም የመቆለፊያ ፋይል ለውጥ ላለመቀበል `--locked` ይጠቀሙ። `--offline` ሁለቱም የመመዝገቢያ መረጃ ጠቋሚ እና እያንዳንዱ አስፈላጊ ማህደር አስቀድመው ሲሸጎጡ ብቻ ይጠቀሙ። `--frozen` እነዚህን ሁለት ገደቦች ያጣምራል። ከመስመር ውጭ መሸጎጫ ማጣት አልተሳካም፤ Musubi ያልተፈታ የመቆለፊያ ፋይል በጭራሽ አይጽፍም።

የጥገኝነት ምንጮች እንደ `math::add()` ያሉ ብቁ ቴክኒካል ጥሪዎችን ወደ ውስጣዊ Kotodama ስሞች እንደገና በመፃፍ የተገናኙ ናቸው። ጥገኝነት ቴክኒካል ወደ ውጭ ላልተላከ ተግባር መጥራት ውድቅ ተደርጓል። ከውጭ የሚመጡ ቤተ-መጻሕፍት ተግባራትን ያጋልጣሉ; የአካባቢ `[[contract]]` እና `[[test]]` ኢላማዎች ግልጽ የጥቅል ኢላማዎች ሆነው ይቆያሉ።

## መሸጎጫ ማረጋገጫ እና ጥገና {#cache-verification-and-repair}

የህዝብ መሸጎጫ ትዕዛዞች የማይለወጡ፣ የታተሙ የመመዝገቢያ ማህደሮች ላይ ይሰራሉ -

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` የተበላሹ ታማኝ ወራሾችን ለይቶ ያቆያል፣ እና የተጠናቀቀ የአቅራቢ ማስረጃ ሲፈቅድ ትክክለኛዎቹን ማህደሮች እንደገና ያመጣል። ባዶ ያልሆነ ቀጥታ ለውጥ ሲኖር መከርከሙ ሆን ተብሎ በመዘጋት ይከሽፋል፤ የተመደቡትን እጩዎች ለመመርመር `--dry-run`ን ይጠቀሙ።

## ማሸግ እና ህትመት {#packaging-and-publishing}

ማህደር ከመጻፍዎ በፊት ንፁህ አወንታዊ ፋይልን ይፈትሹ እና ከዚያ ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ ጥቅል ይገንቡ -

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` `target/package/<namespace>-<name>-<version>.car` ይጽፋል። CAR ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ ጥቅል ቴክኒካል ማኒፌስት፣ የትርጓሜ ልቀት ቴክኒካል ማኒፌስት፣ ትክክለኛ የማረጋገጫ መቆለፊያ፣ የምንጭ ዛፍ፣ በይነገጽ ምስጠራ ዳይጀስት እሴት፣ እና SoraFS ማህደር ክሪፕቶግራፊያዊ ኮሚትመንት። በመጀመሪያው ልቀት CLI ውስጥ ምንም የተለየ `pack`፣ `--car-out`፣ `--sorafs-manifest-out` ወይም `--source-plan-out` ትዕዛዞች የሉም።

ህትመት የተፈረመ፣ ሊጀመር የሚችል የአውታረ መረብ የስራ ፍሰት ነው። የተመረጠው `client.toml` የሚፈለጉትን `[musubi.publication]` ማሰሪያዎች እንዲሁም መለያውን እና Taira የአውታረ መረብ ውቅረትን መያዝ አለበት። በትክክል አንድ የስራ ቦታ አባል ያሽጉ -

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

የክዋኔው ጆርናል እና የዘር መግቢያ ድንበር ዘላቂ ከሆኑ በኋላ ለመመለስ `--detach`ን ይጠቀሙ። በ`publish --resume <operation-id> --config client.toml` ዘላቂ ቀዶ ጥገናን ይቀጥሉ። ጠባቡ `--recover <operation-id>` መንገድ እንደገና የሚገነባው ብቻ ነው ለንፁህ ቅድመ-መግቢያ ጆርናል የማይለወጡ ረዳት መዝገቦች ይጎድላሉ። ምንም ህትመት `--dry-run` ወይም አጠቃላይ የህዝብ ሰቀላ ተተኪ አማራጭ የለም; ለአካባቢያዊ ቅድመ በረራ `package --list` እና `package` ያሂዱ።

## የመመዝገቢያ መጠይቆች እና የሕይወት ዑደት {#registry-queries-and-lifecycle}

የተጠናቀቀውን መዝገብ ይፈልጉ እና ይፈትሹ በተመሳሳዩ Taira የደንበኛ ውቅር -

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

ያንኪንግ ከአዳዲስ ጥራቶች የማይለወጥ ልቀትን አያካትትም አሁን ያሉት ትክክለኛ መቆለፊያዎች ሊባዙ የሚችሉ ሲሆኑ። መጀመሪያ የአሁኑን የያንክ ክለሳ ያንብቡ፣ ከዚያ የንፅፅር እና የማዘጋጀት ሚውቴሽን ያስገቡ -

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

ያንን ሁኔታ ለመቀልበስ `unyank`ን ከተመሳሳይ ጥቅል፣ ስሪት እና አዲስ የተነበበ ክለሳ ጋር ይጠቀሙ። የጥቅል ባለቤትነት እና የጠባቂ ሚናዎች ህትመትን፣ ያንክን፣ ሜታዳታን ይቆጣጠራሉ፣ እና የማህደር-አካባቢ ፈቃዶች። ዓለም አቀፍ ተለዋጭ ስሞች የራሳቸው ዋጋ ያለው ምዝገባ፣ እንደገና ማነጣጠር ታሪክ እና ማወዳደር እና ማሻሻያዎች አሏቸው። የጥቅል ባለቤትነት አቋራጮች አይደሉም።

## Iroha ሽፈኖች {#iroha-surfaces}

Musubi የመጀመሪያ ልቀት V1 መመሪያዎችን እና መጠይቆችን ይጠቀማል -

|ሽፈን|ዓላማ|
| ---------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1`|የስም ቦታን ከተረጋጋው የቤት ዳታ ቦታ ጋር ያያይዙ።|
|`RegisterMusubiArchiveV1`|የማይለወጥ የተረጋገጠ የምንጭ ማህደር ክሪፕቶግራፊያዊ ኮሚትመንት ይመዝገቡ።|
|`AddMusubiArchiveLocationV1`|የተረጋገጠ SoraFS ማህደር ቦታ ያክሉ ወይም ያድሱ።|
|`PublishMusubiReleaseV1`|ጥቅል ይጠይቁ ወይም ያዘምኑ እና አንድ የማይለወጥ ልቀት ያትሙ።|
|`SetMusubiReleaseYankV1`|የጨረታ ማስከበሪያ እና የጨረታ ማስከበሪያ|
|`InviteMusubiPackageMaintainerV1`|ግልጽ የሆነውን የጥቅል ሚና ግብዣ ፍሰት ይጀምሩ።|
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1`|የሚተዳደር አለምአቀፍ ተለዋጭ ስም ይመዝገቡ ወይም እንደገና ያነጣጠሩ።|
|`AssertMusubiReleaseDigestV1`|ትክክለኛውን የማይለወጥ የመልቀቂያ ምስጠራ ዳይጀስት እሴትን ያረጋግጡ።|
|`FindMusubiExactPackageV1`|አንድ ትክክለኛ ጥቅል እና ክለሳዎቹን ያንብቡ።|
|`FindMusubiExactReleaseV1`|አንድ ትክክለኛ የመልቀቂያ ቅጽበታዊ ገጽ እይታን ያንብቡ።|
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1`|የተጠናቀቁ የመልቀቂያ እጩዎችን ይፍቱ ወይም ይዘርዝሩ።|
|`FindMusubiArchiveLocationsV1`|የተጠናቀቁ በአቅራቢ የሚደገፉ የማህደር ቦታዎችን ያንብቡ።|
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1`|የአሁኑን ተለዋጭ ስም ኢላማ ወይም የማይለወጥ ታሪኩን ያንብቡ።|

Torii በ`/v1/musubi/*` ስር የመተግበሪያውን መንገድ ቤተሰብ ያጋልጣል። MCP መሳሪያዎች የአሁኑን `iroha.musubi.queries.*` እና `iroha.musubi.instructions.*` ስሞችን ይጠቀማሉ። ለሰፊው API ካርታ [Torii API የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md) እና [የመጠይቅ ማጣቀሻ](/am/reference/queries.md) ይመልከቱ።
