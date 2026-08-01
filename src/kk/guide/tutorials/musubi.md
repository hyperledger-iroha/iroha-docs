---
translation_locale: kk
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama {#musubi-kotodama-packages}

Musubi - Kotodama бастапқы пакеттердің пакет менеджері. Бұл әзірлеушілерге жалпыға бірдей бірінші келген атау кестесі орнына, SORA және Iroha атау кеңістіктеріне байланысты пакеттің сәйкестігін сақтай отырып, құрастырмалы Kotodama функцияларды бөлісу үшін Cargo-қа ұқсас жұмыс барысы береді.

Керек болған жағдайда Musubi пайдалану:

- қайтадан пайдаланылатын Kotodama бастапқы кітапханаларды жариялау
- `Musubi.lock` бойынша нақты транзиттік көзге тәуелділігі
- тексерілген SoraFS мұрағат міндеттемелері бойынша тәуелділік көзін қайта құру
- пакеттің атау кеңістігін бірдей атау кеңiстiгiндегi dapp келісімшарт есімдерiне қосу
- тізбекті тіркеу арқылы пакеттерді тексеру, жариялау, тартып алу немесе қолданбалы атау

## Баптама атаулары {#package-names}

Canonical package ID пайдалану:

```text
namespace/package
```

Дұрыс босату сілтемелері қолданылсын:

```text
namespace/package@version
```

Атау кеңістігінің алдында алдын ала `@` жоқ. `@` бөлгіші нұсқа жұрнағы үшін ғана сақталған.

Атау кеңістігі сегменті Kotodama dapp келісімшарт аты-жөнімен қолданылатын жұрнаққа сәйкес келеді:

|Пакеттің идентификаторы |Қосылған келісімшарт псевдонимінің пішіні |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

Атау кеңістіктер `<dataspace>` немесе `<domain>.<dataspace>` нысанына ие. Егер пакеттерде dapp сілтемесі болса, Musubi барлық байланысты келісімшарт есімдіктері пакеттермен бірдей атау кеңістігі суффиксін қолданатынын тексереді.

## Көрініс {#manifest}

Баптама `Musubi.toml` дегеннен басталады:

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

Қосылымдар нақты нұсқаларды, қамқорлық талаптарын, тильд талаптарын, `1.*` сияқты жабайы карталарды немесе `>=1.0.0,<2.0.0` сияқты салыстырмалы тізімдерді пайдалана алады.

`Musubi.lock` тізбектегі реестрден таңдалған өтпелі графикті тіркейді. Әрбір бұғатталған түйін өзінің қаноникалық пакет реф, таңдалған талапты, SoraFS манифест дигесті, бастапқы мұрағат хешын, байт санын, файл санын, экспортталған функцияларды, детерминистік бастапқы мұрағаттың жоспарын және тәуелділік атауларын сақтайды. Қысқа аты-жөндер бұғаттау файлына кіргізбестен бұрын шешіледі.

## Жергілікті жұмыс барысы {#local-workflow}

Iroha жұмыс кеңістігінің түбірінен Musubi арқылы жүгіну:

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

`install --offline` арқылы нақты нұсқаның тәуелділіктері үшін шешімін таппаған құлып файлын жазу. CI-дегі `install --locked` арқылы ескірген құлып файлынан бас тарту

`build` алдын ала сақталған тәуелділік көздерін `math::add()` сияқты шақыруларды детерминистік ішкі Kotodama функциясының атауларына қайта жазу арқылы байланыстырады. Бұл тәуелділіктің экспортталмаған функцияларға шақыруларды бас тартады. Musubi v1 кітапханалары тек функцияға негізделген: мемлекеттік декларациялар, триггерлер, котоба блоктары, тұрақтылар немесе басқа функциясыз келісім-шарт элементтері бар тәуелділік көздері қабылданбайды.

## Пайдаланушыны алып келу Archives {#fetching-source-archives}

Musubi кестенің қосалқы командалары арқылы немесе кейін шешкен кезде жоғалған тәуелділік көздерін алуға болады:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

Тікелей шлюздерді алу бір немесе бірнеше SoraFS шлюз берушілердің ерекшеліктерін пайдаланады:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

Көрсетілетін қызметті берушінің пайдалы жүктеме файлдары мен шлюз провайдерлері бір алу операциясы үшін өзара ерекшеленеді. Егер бірден астам бұғатталған пакеттер жоқ болса, әрбір шлюз провейерін `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` немесе `manifest=<64-hex SoraFS manifest digest>` деген атаулармен қамтуыңыз.

Қақпасы `base-url` және `privacy-url` мәндері пайдаланылуы тиіс `https://` әдеттегідей. Жергілікті тест шлюздары пайдалана алады `http://localhost`, `http://127.0.0.1`, немесе `http://[::1]` тек қана `--gateway-allow-insecure-localhost`. Желі токендері жұмыс уақытының куәліктері болып табылады және олар `Musubi.lock`.

## Жариялау {#publishing}

`pack` детерминизмді есептейді BLAKE3-256 бастапқы архивтің хэшігі, қосымша бастапқы байт және файлдар саналады. `--car-out`, `--sorafs-manifest-out`, немесе `--source-plan-out` қамтамасыз етіледі, ол сондай-ақ детерминисттік SoraFS CAR Пайдалы жүк, SoraFS айқын, және Musubi бастапқы файл жиынтығынан деректі мұрағат жоспары.

Жариялаудан бұрын құрғақ жүгіртуді қолдану:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

Ешбірде `--dry-run`, `publish` әдеттегі артефакттарды `.musubi/dist/<namespace>/<name>/<version>/`, параметрлері бойынша манифест пен пайдалы жүктемені Torii Ол ... SoraFS сақтау шұңқыры аяқтық нүктесі `--upload`, пайдаланған SoraFS тігіп, тапсырады `PublishMusubiRelease` конфигурацияланған Iroha клиент.

Жарияланған ақпараттар мыналарды қамтиды:

- бос емес канондық көзді архив
- детерминистік көзді мұрағат жоспары
- кем дегенде бір экспортталған Kotodama функциясы
- Таңдалған босатуларды таңдамайтын тәуелділік жазбалары
- дapp сілтемесі, егер бар болса, оның контракттік аты-жөндері топтаманың атау кеңістігіне сәйкес келеді

## Тізілім сұрақтары және өмір циклі {#registry-queries-and-lifecycle}

Тізілімді іздеу және тексеру:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Янкинг жаңа резолюциядан босатуды жасырады, бірақ бар қапшық файлдарын қайта қалпына келтіруге мүмкіндік береді:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi `namespace/package` каноникалық пакеттің атауын жасау арқылы жаһандық атауды басып алуды болдырмайды. Атау кеңістігіне жариялау сол Kotodama dapp атау кеңістігі үшін пайдаланылған меншік немесе делегат рұқсаттар моделімен рұқсат етілуі тиіс. Әлемдік қысқа атаулар пакетке иеліктен бөлек: `SetMusubiShortAlias` үшін `CanSetMusubiShortAlias` рұқсаты қажет, ал мақсатты топтамада кем дегенде бір белсенді шығарылым болуы тиіс.

## Iroha Жер беттері {#iroha-surfaces}

Musubi бірінші деңгейдегі Iroha нұсқаулар мен сұрау салуларды пайдаланады:

|Жер беті |Мақсаты |
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |Өзгерілмейтін пакеттерді жариялаңыз. |
|`YankMusubiRelease` |Қолданыстағы релизді тартып алынған деп белгілеңіз. |
|`SetMusubiShortAlias` |Пакеттің идентификаторына global short alias-ты байлаңыз. |
|`AssertMusubiReleaseExists` |Конкреттік пакет нұсқасы болуы керек. |
|`FindMusubiReleaseByRef` |Пакеттік анықтама бойынша босатуды алып келіңіз. |
|`FindMusubiPackageVersions` |Пакеттiк идентификатордың нұсқаларын тiз. |
|`FindMusubiPackageReleases` |Баптаманың идентификаторы үшін резюмелерді тізімдеңіз. |
|`SearchMusubiPackages` |Пакеттiң қорытындыларын атау кеңiстiгi мен мәтiн бойынша іздеу. |
|`FindMusubiShortAliasByName` |Қысқа клиптерді шешу. |

Torii Айналадағы Musubi HTTP бағыт отбасы `/v1/musubi/`. Агентті қарастыру MCP құрал-жабдықтар `iroha.musubi.` Сөйтіп, қараңыз. [Torii аяқталу нүктелері](/kk/reference/torii-endpoints.md) және [сұраныс анықтамасы](/kk/reference/queries.md) кеңірек API карта.
