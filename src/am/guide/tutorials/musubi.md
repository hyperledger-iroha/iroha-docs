---
translation_locale: am
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama ጥቅሎች {#musubi-kotodama-packages}

Musubi ለ Kotodama ምንጭ ፓኬጆች የፓኬጅ አስተዳዳሪ ነው ። ይህ ገንቢዎች የተዋሃዱ Kotodama ተግባራትን ለማጋራት ከ Cargo ጋር የሚመሳሰል የስራ ፍሰት ይሰጣቸዋል እንዲሁም የፓኬጁ ማንነት ከአለም አቀፍ የመጀመሪያ ስም ሰንጠረዥ ይልቅ ከ SORA እና Iroha የመጠሪያ ቦታዎች ጋር ተያይዞ ይቆያል ።

የሚከተሉትን ነገሮች ለማድረግ ሲያስፈልግ Musubi ይጠቀሙ:

- እንደገና ጥቅም ላይ ሊውሉ የሚችሉ Kotodama ምንጭ ቤተ-መጽሐፍት ያትሙ
- በ `Musubi.lock` ውስጥ ትክክለኛ የሽግግር ምንጭ ጥገኛነቶች
- ከተረጋገጡ SoraFS የአርኪቭ ግዴታዎች ላይ ጥገኛነት ምንጭን እንደገና መገንባት
- የፓኬጅ ስያሜ ቦታን በተመሳሳይ የስያሜ ቦታ ውስጥ ከሚገኙት dapp ውል ስምምነቶች ጋር ያገናኙ
- በሰንሰለት ላይ ባለው መዝገብ አማካኝነት ፓኬጆችን መመርመር ፣ ማተም ፣ ማውጣት ወይም ማንሳት።

## የፓኬጅ ስሞች {#package-names}

የካኖኒካል ጥቅል መታወቂያዎች አጠቃቀም

```text
namespace/package
```

ትክክለኛ የመልቀቂያ ማጣቀሻዎች አጠቃቀም:

```text
namespace/package@version
```

ከስም ቦታ በፊት ምንም ቀዳሚ `@` የለም ። የ `@` መለያየት ለቅጅ ቅደም ተከተል የተጠበቀ ነው ።

የስም ቦታ ክፍሉ በ Kotodama dapp ውል ቅጽል ስሞች ከሚጠቀሙት ቀጣይነት ጋር ይዛመዳል-

|የፓኬጅ መታወቂያ |የተዛመደ የውል ቅጽል ስም ቅርጽ |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

የስም ቦታዎች ወይ `<dataspace>` ወይም `<domain>.<dataspace>` ቅጽ አላቸው. አንድ ፓኬጅ dapp አገናኝ ካለው, Musubi እያንዳንዱ የተገናኘ ውል ስያሜ እንደ ፓኬጁ ተመሳሳይ ስም ቦታ ፊደል ይጠቀማል መሆኑን ያረጋግጣል.

## የተገለጠ {#manifest}

አንድ ጥቅል በ `Musubi.toml` ይጀምራል-

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

ጥገኛዎች ትክክለኛ ስሪቶችን ፣ የእንክብካቤ መስፈርቶችን ፣ የቲልድ መስፈርቶችን፣ እንደ `1.*` ያሉ የዱር ካርዶችን ወይም እንደ `>=1.0.0,<2.0.0` ያሉ የማነፃፀሪያ ዝርዝሮችን መጠቀም ይችላሉ ።

`Musubi.lock` የተመረጠውን ትራንስቲቭ ግራፊክ ከሰንሰለት መዝገብ ይመዝግባል። እያንዳንዱ ተቆልፏል ኖት የካኖኒካል ፓኬጅ ሪፍ ፣ የተመረጠው መስፈርት ፣ SoraFS ማኒፌስት ዳይጀስት ፣ ምንጭ ማህደር ሃሽ ፣ ባይት ቆጠራ ፣ የፋይል ብዛት ፣ የወጪ ተግባራት ፣ የመረጃ ምንጭ ማህደረ መረጃ ዕቅድ እና ጥገኛ ቅጽል ስሞችን ያስቀምጣል ። አጫጭር ቅጽል ስሞች ወደ መቆለፊያ ፋይል ከመግባታቸው በፊት ይፈታሉ።

## የአካባቢው የስራ ፍሰት {#local-workflow}

ከቅድመ-መንገድ Iroha የስራ ቦታ ሥር, በ Cargo በኩል Musubi ይሮጡ:

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

`install --offline` ን በመጠቀም ትክክለኛ ስሪት ጥገኛነት ያልተፈታ መቆለፊያ ፋይል ለመጻፍ ምንም አገናኝ ሳይጠይቁ ይጠቀሙ. በ CI ውስጥ `install --locked` ን በመጠቀም የቆየ መቆለፊያ ፋይልን ውድቅ ያድርጉ።

`build` እንደ `math::add()` ያሉ ጥሪዎችን ወደ ውስንነት ውስጣዊ Kotodama ተግባር ስሞች በመፃፍ የተከማቹትን ጥገኛ ምንጮችን ያገናኛል ። ጥገኛነቱ ላላወጣቸው ተግባራት ጥሪዎችን ውድቅ ያደርጋል ። Musubi v1 ቤተ-መጽሐፍት ተግባራት ብቻ ናቸው: የአገር መግለጫዎችን, አስነሳሾችን, ኮቶባ ብሎኮችን, ቋሚዎች, ወይም ሌሎች ተግባር ያልሆኑ የውል ንጥሎች ያካተቱት ጥገኛ ምንጮች ውድቅ ናቸው.

## ምንጭ ማምጣት Archives {#fetching-source-archives}

Musubi በሚፈታበት ጊዜ ወይም በኋላ በካሽ ንዑስ ትዕዛዞች በኩል የጎደሉ ጥገኛ ምንጮችን ማግኘት ይችላል:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

የቀጥታ የጌትዌይ መያዣዎች አንድ ወይም ከዚያ በላይ SoraFS የጊትዌይ አቅራቢ ዝርዝር መግለጫዎችን ይጠቀማሉ-

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

የአቅራቢዎች የፍጆታ ጭነት ፋይሎች እና የጌትዌይ አቅራቢዎች ለአንድ የመጫኛ ሥራ እርስ በእርስ የሚገለሉ ናቸው. ከአንድ በላይ የተቆለፈ ፓኬጅ ከሌለ, እያንዳንዱን መግቢያ በር አቅራቢ በ `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` ወይም `manifest=<64-hex SoraFS manifest digest>` ያካትቱ.

የጌትዌይ `base-url` እና `privacy-url` እሴቶች በነባሪነት `https://` ን መጠቀም አለባቸው ። አካባቢያዊ የሙከራ ጌቶች `http://localhost` ፣ `http://127.0.0.1` ወይም `http://[::1]` ን በ `--gateway-allow-insecure-localhost` ብቻ ሊጠቀሙ ይችላሉ ። ዥረት ቶከኖች የአሂደቱ የምስክር ወረቀቶች ናቸው እናም ወደ `Musubi.lock` አይጻፉም ።

## ማተሚያ {#publishing}

`pack` የ deterministic BLAKE3-256 ምንጭ ማከማቻ ሃሽ እና የመነሻ ባይት እና ፋይል ይቆጠራል. `--car-out`, `--sorafs-manifest-out` ወይም `--source-plan-out` ሲቀርቡ, በተጨማሪም deterministic SoraFS CAR ጥቅማጥቅም ጭነት ይገነባል, SoraFS manifest, እና Musubi ከዚሁ ምንጭ ፋይል ስብስብ የመረጃ ቋት ዕቅድ።

ከማተምዎ በፊት ደረቅ አሂድ ይጠቀሙ:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

ያለ `--dry-run`, `publish` በዝግጅት አቀራረብ ላይ የተመሰረቱ ንጥረ ነገሮችን ይጽፋል `.musubi/dist/<namespace>/<name>/<version>/`, በፈቃደኝነት ማኒፌስት እና አጠቃቀም ጭነት በኩል ይጫናል Torii እሱ ነው SoraFS የማከማቻ ፒን መጨረሻ ነጥብ `--upload`, የተፈጠረውን ይመዝገብ SoraFS ፒን, እና ያቀርባል `PublishMusubiRelease` የተዋቀረውን በኩል Iroha ደንበኛ።

የታተሙ መግለጫዎች የሚከተሉትን ማካተት አለባቸው፦

- ባዶ ያልሆነ የካኖኒክ ምንጭ ማህደር
- የመረጃ ምንጭ ማከማቻ ዕቅድ
- ቢያንስ አንድ የወጪ ንግድ Kotodama ተግባር
- የተለቀቁ ልቀቶችን የማይመርጡ ጥገኛነት መዝገቦች
- የፓኬጅ ስያሜ ቦታ ጋር የሚዛመዱ የውል ቅጽል ስሞቻቸው ካሉበት የ dapp አገናኝ

## የምዝገባ ጥያቄዎች እና የሕይወት ዑደት {#registry-queries-and-lifecycle}

የምዝገባውን ፍለጋ እና ምርመራ የሚከተሉትን ያድርጉ:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

ያንኪንግ አዲስ ጥራት ካለው ልቀት ይደብቃል ፣ ነገር ግን ነባር መቆለፊያ ፋይሎችን እንደገና ሊታደስ ይችላል:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi `namespace/package` ን ቀኖናዊ የፓኬጅ ስም በማድረግ ዓለም አቀፍ ስም መንጠቆን ያስወግዳል ። በስም ቦታ ውስጥ ማተም ለዚያ Kotodama dapp ስም ቦታ ጥቅም ላይ በሚውለው ተመሳሳይ ባለቤትነት ወይም ተልዕኮ ፈቃድ ሞዴል የተፈቀደ መሆን አለበት። የተመረጡ ዓለም አቀፍ አጫጭር ቅጽል ስሞች ከፓኬጅ ባለቤትነት ተለይተዋል: `SetMusubiShortAlias` የ `CanSetMusubiShortAlias` ፈቃድ ይጠይቃል ፣ እና የዒላማው ፓኬጅ ቢያንስ አንድ ንቁ ልቀት ሊኖረው ይገባል ።

## Iroha ወለሎች {#iroha-surfaces}

Musubi የመጀመሪያ ደረጃ መመሪያዎችን እና ጥያቄዎችን ይጠቀማል Iroha:

|ወለል |ዓላማ|
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |የማይለወጥ የፓኬጅ መልቀቅ ያትሙ። |
|`YankMusubiRelease` |አንድ ነባር ልቀት እንደ ተጎትቶ ምልክት አድርግ.|
|`SetMusubiShortAlias` |የተመረጠውን ዓለም አቀፍ አጭር ስያሜ ከፓኬጅ መታወቂያ ጋር ያያይዙ። |
|`AssertMusubiReleaseExists` |የኮንክሪት ጥቅል ስሪት እንዲኖር ይጠይቃል። |
|`FindMusubiReleaseByRef` |በትክክል የታሸገውን ማጣቀሻ በመጠቀም መልቀቅ ያግኙ። |
|`FindMusubiPackageVersions` |ለፓኬጅ መታወቂያ ስሪቶችን ይዘርዝሩ። |
|`FindMusubiPackageReleases` |ለፓኬጅ መታወቂያ የመልቀቂያ ማጠቃለያዎችን ይዘርዝሩ። |
|`SearchMusubiPackages` |የፓኬጅ ማጠቃለያዎች በስም ቦታ እና ጽሑፍ ፍለጋ. |
|`FindMusubiShortAliasByName` |የተስተካከለ አጭር ቅጽል ስም መፍታት። |

Torii ያጋልጣል Musubi HTTP የመንገድ ቤተሰብ `/v1/musubi/`. ወኪል ፊት ለፊት MCP መሳሪያዎች እንደ `iroha.musubi.` ቅጽል ስሞች. [Torii የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md) እና [የጥያቄ ማጣቀሻ](/am/reference/queries.md) ለስፋት API ካርታ.
