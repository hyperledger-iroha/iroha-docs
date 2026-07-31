---
translation_locale: am
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama ጥቅሎች {#musubi-kotodama-packages}

Musubi የፓኬጅ አስተዳዳሪ Kotodama ምንጭ ጥቅሎች.
ተደራሽነት ለማጋራት Cargo-እንደ የስራ ፍሰት ገንቢዎች Kotodama ተግባራት
የፓኬጅ ማንነትን በማስጠበቅ SORA እና Iroha ይልቅ ስሞች ቦታዎች
ዓለም አቀፋዊ የመጀመርያው ስም ሰንጠረዥ።

አጠቃቀም Musubi የሚከተሉትን ማድረግ ሲያስፈልግዎት:

- እንደገና ጥቅም ላይ ሊውል የሚችል ማተም Kotodama ምንጭ ቤተ-መጽሐፍት
- ትክክለኛውን የሽግግር ምንጭ ጥገኛነት በ `Musubi.lock`
- የተረጋገጠ ጥገኛነት ምንጭን እንደገና መገምገም SoraFS የአርኪቭ ግዴታዎች
- በአንድ ውስጥ የፓኬጅ ስም ቦታን ወደ dapp ውል ቅጽል ስሞች ያገናኙ
  የስም ቦታ
- በሰንሰለት ላይ ባለው መዝገብ አማካኝነት ፓኬጆችን መመርመር፣ ማተም፣ ማውጣት ወይም ማንሳት

## የፓኬጅ ስሞች {#package-names}

የካኖኒካል ፓኬጅ መታወቂያዎች አጠቃቀም

```text
namespace/package
```

ትክክለኛ የመልቀቂያ ማጣቀሻዎች አጠቃቀም:

```text
namespace/package@version
```

ምንም መሪ የለም `@` ከስም ቦታ በፊት `@` መለያያ ተይዟል
ለቅጅቱ ቅደም ተከተል።

የስም ቦታው ክፍል ከ ጥቅም ላይ የዋለው ቅደም ተከተል ጋር ይዛመዳል Kotodama የ Dapp ውል
ስያሜዎች

| የፓኬጅ መታወቂያ                | የተዛመዱ የውል ስምምነቶች ቅርፅ |
| ------------------------- | ---------------------------- |
| `universal/math`          | `router::universal`          |
| `dex.universal/swap-core` | `router::dex.universal`      |

የስም ቦታዎች `<dataspace>` ወይም `<domain>.<dataspace>` ቅርጽ.
ፓኬጁ የ Dapp አገናኝ አለው፣ Musubi እያንዳንዱ የተገናኘ የውል ስምምነቶች
ከፓኬጁ ጋር ተመሳሳይ የስም ቦታ ቅደም ተከተል ይጠቀማል።

## ግልፅ {#manifest}

አንድ ፓኬጅ ይጀምራል `Musubi.toml`:

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

ጥገኛዎች ትክክለኛ ስሪቶችን መጠቀም ይችላሉ, የጥገና መስፈርቶች, Tilde
መስፈርቶች፣ እንደ `1.*`, ወይም እንደነዚህ ያሉ የማወዳደር ዝርዝሮች
`>=1.0.0,<2.0.0`.

`Musubi.lock` የተመረጠውን የሽግግር ገበታ ከሰንሰለት ላይ ይመዝግባል።
እያንዳንዱ የተቆለፈ አገናኝ የሚመረጠው የካኖኒካል ፓኬጅ ሪፍ ይከማቻል።
መስፈርት፣ SoraFS manifest digest፣ ምንጭ አርኪቭ ሃሽ፣ ባይት ቆጠራ፣ ፋይል
መቁጠር፣ የወረዱት ተግባራት፣ የመረጃ ምንጭ ማከማቻ ዕቅድ፣ እና
አጭር ስሞች ወደ
የመቆለፊያ ፋይል.

## አካባቢያዊ የስራ ፍሰት {#local-workflow}

ከዋና ጅረት Iroha የስራ ቦታ ሥር፣ ሩጫ Musubi በጭነት በኩል:

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

አጠቃቀም `install --offline` ትክክለኛ ስሪት ያልተፈታ መቆለፊያ ፋይል ለመጻፍ
አንድን አገናኝ ሳይጠይቁ ጥገኛነቶች። `install --locked` ውስጥ CI ወደ
የቆየ መቆለፊያ መዝገብን ውድቅ አድርግ።

`build` እንደነዚህ ያሉ ጥሪዎችን በመቀየር ካሽ የተደረጉ ጥገኛ ምንጮችን ያገናኛል
`math::add()` ወደ ተወስኖ ውስጣዊ Kotodama ተግባር ስሞች. ይህ ውድቅ
ጥገኛነቱ ወደ ውጭ ላላወጣቸው ተግባራት ጥሪዎችን ያቀርባል. Musubi v1 ቤተ-መጽሐፍት
ተግባር ብቻ ናቸው-የመንግስት መግለጫዎችን የያዙ ጥገኛ ምንጮች፣
ተነሳሽነቶች፣ የኮቶባ ብሎኮች፣ ቋሚዎች ወይም ሌሎች ተግባር የሌላቸው የውል ዕቃዎች
ውድቅ ተደርጓል።

## ምንጭ ማምጣት Archives {#fetching-source-archives}

Musubi መፍትሄ በሚሰጥበት ጊዜ ወይም በኋላ ላይ የጎደሉ ጥገኛ ምንጮችን ማግኘት ይችላል
በካሽ ንዑስ ትዕዛዞች በኩል:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

የቀጥታ መግቢያዎች አንድ ወይም ከዚያ በላይ ይጠቀማሉ SoraFS የጌትዌይ አቅራቢ ዝርዝሮች

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

የአገልግሎት አቅራቢ የዋጋ ጭነት ፋይሎች እና የመዳረሻ በር አቅራቢዎች እርስ በእርስ የሚገለሉ ናቸው
ከአንድ በላይ የተቆለፈ ፓኬጅ ቢጎድለው እያንዳንዱን ስፋት ይመርምሩ
የጌትዌይ አቅራቢ `package=<dependency-alias>`,
`package=<namespace/package@version>`, `package=<namespace/package>`, ወይም
`manifest=<64-hex SoraFS manifest digest>`.

በር `base-url` እና `privacy-url` እሴቶች መጠቀም አለባቸው `https://` በነባሪነት።
አካባቢያዊ የሙከራ መግቢያዎች መጠቀም ይችላሉ `http://localhost`, `http://127.0.0.1`, ወይም
`http://[::1]` ብቻ `--gateway-allow-insecure-localhost`. ዥረት
ቶከኖች የስራ ሰዓት ማረጋገጫዎች ናቸው እና ወደ ውስጥ አልተጻፉም `Musubi.lock`.

## ማተሚያ {#publishing}

`pack` የዲተሪሚኒስት BLAKE3-256 ምንጭ ማህደር ሃሽ እና ተጨማሪ
ምንጭ ባይት እና የፋይል ቁጥሮች። `--car-out`, `--sorafs-manifest-out`, ወይም
`--source-plan-out` የተሰጠ ነው, በተጨማሪም የ Deterministic ይገነባል SoraFS
CAR የዋጋ ጭነት፣ SoraFS ግልፅ እና Musubi ተመሳሳይ ምንጭ ማህደር ዕቅድ
የመረጃ ምንጭ ፋይል ስብስብ።

ከማተምዎ በፊት ደረቅ አሂድ ይጠቀሙ:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

ያለ `--dry-run`, `publish` በነባሪነት የተቀመጡትን ነገሮች በ
`.musubi/dist/<namespace>/<name>/<version>/`, አማራጭ ላይ ይጫናል
መገለጫ እና አጠቃቀም ጭነት በኩል Torii ነው SoraFS የማከማቻ ፒን መጨረሻ ነጥብ
`--upload`, የተፈጠረውን ይመዝገብ SoraFS ፒን እና ያቀርባል
`PublishMusubiRelease` በተዋቀረው በኩል Iroha ደንበኛ።

የታተሙ መግለጫዎች የሚከተሉትን ያካትታሉ

- ባዶ ያልሆነ የካኖኒክ ምንጭ ማህደር
- የተወሰነ የመረጃ ምንጭ ማህደር ዕቅድ
- ቢያንስ አንድ የተላከው Kotodama ተግባር
- የተለቀቁ ልቀቶችን የማይመርጡ ጥገኛነት መዝገቦች
- ከፓኬጁ ጋር የሚዛመዱ የውል ስያሜዎቻቸው ካሉበት ጊዜ የ dapp አገናኝ
  የስም ቦታ

## የምዝገባ ጥያቄዎች እና የሕይወት ዑደት {#registry-queries-and-lifecycle}

መዝገቡን በመፈለግ እና በማጣራት:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

ያንኪንግ ከአዲሱ ጥራት የተለቀቀውን ይደብቃል ፣ ግን ነባር መዝጊያዎችን ይይዛል
እንደገና ሊታደስ የሚችል:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi ዓለም አቀፍ ስም መንጠቆ በማድረግ ይከላከላል `namespace/package` የ
በስም ቦታ ውስጥ ማተም በ
ለዚያው ጥቅም ላይ የዋለው ተመሳሳይ ባለቤትነት ወይም የተሰጠ ፈቃድ ሞዴል Kotodama
የ dapp ስሞች ቦታ: የተመረጡ ዓለም አቀፍ አጫጭር ቅጽል ስሞች ከፓኬጅ ተለይተው ይታያሉ
ባለቤትነት: `SetMusubiShortAlias` የሚጠይቀው `CanSetMusubiShortAlias`
ፍቃድ፣ እና የዒላማው ፓኬጅ ቢያንስ አንድ ንቁ
ይለቀቁ።

## Iroha ወለል {#iroha-surfaces}

Musubi የመጀመሪያ ደረጃ አጠቃቀሞች Iroha መመሪያ እና ጥያቄ:

| ገጽታ                      | ዓላማ                                            |
| ---------------------------- | -------------------------------------------------- |
| `PublishMusubiRelease`       | የማይለወጥ የፓኬጅ መልቀቅ ያትሙ።              |
| `YankMusubiRelease`          | ነባር ፍቃድ እንደተጣራ ምልክት አድርግ።                |
| `SetMusubiShortAlias`        | የተመረጠውን ዓለም አቀፍ አጭር ስያሜ ከፓኬጅ መታወቂያ ጋር ያገናኙ። |
| `AssertMusubiReleaseExists`  | የኮንክሪት ጥቅል ስሪት እንዲኖር ይጠይቃል።       |
| `FindMusubiReleaseByRef`     | ትክክለኛውን የፓኬጅ ማጣቀሻ በመጠቀም አንድ መልቀቅ ያግኙ.        |
| `FindMusubiPackageVersions`  | ለፓኬጅ መታወቂያ ስሪቶችን ይዘርዝሩ።                    |
| `FindMusubiPackageReleases`  | ለፓኬጅ መታወቂያ የመልቀቂያ ማጠቃለያዎችን ይዘርዝሩ።           |
| `SearchMusubiPackages`       | የፓኬጅ ማጠቃለያዎችን በስም ቦታ እና በጽሑፍ ይፈልጉ።    |
| `FindMusubiShortAliasByName` | አጭር ስያሜውን ተፈትሽ።                     |

Torii የሚገልጸው Musubi HTTP የመንገድ ቤተሰብ `/v1/musubi/*`.
ወኪል ፊት ለፊት MCP መሳሪያዎች እንደ `iroha.musubi.*` ስያሜዎች.
[Torii የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md) እና
[የጥያቄ ማጣቀሻ](/am/reference/queries.md) ለሰፊው API ካርታ።
