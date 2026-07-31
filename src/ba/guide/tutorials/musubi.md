---
translation_locale: ba
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama Пакеттар {#musubi-kotodama-packages}

Musubi - Kotodama сығанаҡ пакеттары өсөн пакет менеджеры. Ул уйлап табыусыларға глобаль беренсе килгән исем таблицаһы урынына SORA һәм Iroha исемдәр киңлектәре менән бәйләнгән пакеттың идентификацияһын һаҡлап ҡалып, Kotodama функцияларын уртаҡлашыу өсөн Cargo-ҡа оҡшаш эш аҙымын бирә.

Әгәр кәрәк булһа, Musubi ҡулланығыҙ:

- ҡабаттан ҡулланыла торған Kotodama сығанаҡ китапханаларын баҫтырырға
- `Musubi.lock` төп күсмә сығанаҡ бәйлелектәре.
- тикшерелгән SoraFS архив йөкләмәләре буйынса бәйлелек сығанағын реконструкциялау
- пакеттың исемдәр арауығын шул уҡ исемдәр аравындағы dapp килешеү атамалары менән тоташтырыу
- Сылбырҙағы реестр аша пакеттарҙы тикшерергә, баҫтырып сығарырға, тартып алырға йә исем-шәрифкә алмаштырырға

## Пакеттарҙың исемдәре {#package-names}

Canonical пакеттар идентификаторҙары ҡулланыу:

```text
namespace/package
```

Дөрөҫ сығарыу һылтанмалары ҡулланыла:

```text
namespace/package@version
```

Исемдәр арауығы алдынан `@` билдәһе юҡ. `@` айырыусыһы версия һуффиксы өсөн һаҡлана.

Исемдәр арауығы сегменты Kotodama dapp килешеү ҡушаматтары ҡулланылған һуффикс менән тап килә:

|Пакеттың идентификаторы |Ҡатнашыусы килешеү ҡушамат формаһы |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

Исемдәр киңлектәрендә `<dataspace>` йәки `<domain>.<dataspace>` формаһы бар. Пакетта dapp һылтанмаһы булғанда, Musubi бәйләнгән контракттың һәр атамаһы пакет менән бер үк исемдәр киңлеге суффиксын ҡулланамы икәнен тикшерә.

## Билдәле {#manifest}

Баҫма `Musubi.toml` менән башлана:

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

Тейешле версиялар, һаҡланыу талаптары, тильд талаптары, `1.*` кеүек ҡырағай карталар йәки `>=1.0.0,<2.0.0` кеүек сағыштырма исемлектәр ҡулланырға мөмкин.

`Musubi.lock` ҡулланма реестрынан һайлап алынған күсмә графты яҙҙыра.Һәр бикләнгән узел үҙенең каноник пакетын, һайланған талапты, SoraFS манифест дигесен, сығанаҡ архивы хешын, байт һанын, файл һанын, экспортланған функцияларҙы, детерминистик сығанаҡ archive планын һәм бәйлелек атамаларын һаҡлай. Ҡыҫҡа ҡушаматтар бикләү файлына ингәнгә тиклем хәл ителә.

## Урындағы эш ағымы {#local-workflow}

Iroha өҫтөнлөктәге эш урыны тамырынан, Musubi аша йөк үтә:

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

`install --offline` ҡулланып, CI-ҙағы `install --locked` менән иҫкергән бикләү файлын кире ҡағыу өсөн.

`build` шылтыратыуҙарҙы күсереп яҙыу ярҙамында ҡашҡа ҡуйылған бәйлелек сығанаҡтары менән бәйләнештәр `math::add()` детерминистик эске Kotodama Функция исемдәре. ул бәйлелек экспорты булмаған функцияларҙы саҡырыуҙар кире ҡаға. Musubi v1 китапханалар функциялар өсөн генә: дәүләт декларациялары, ҡуҙғатҡыстар, kotoba блоктары, константтар булған бәйлелек сығанаҡтары; йәки башҡа функциялы булмаған контракт пункттары кире ҡағыла.

## Сығанаҡ сығанағы архивтары {#fetching-source-archives}

Musubi ҡаш аҫты командалары аша хәл иткәндә йәки һуңыраҡ юғалған бәйлелек сығанаҡтарын алырға мөмкин:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

Тере ҡапҡаны алыуҙар бер йәки бер нисә SoraFS ҡапҡа тәьмин итеүсе спецификацияһын ҡуллана:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

Провайдерҙың файҙалы йөкләмә файлдары һәм шлюз менән тәьмин итеүселәр бер операция өсөн үҙ-ара айырылып тора. Әгәр берҙән-бер бикләнгән пакет булмаһа, һәр шлюз менән хеҙмәтләндереүсене `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` йәки `manifest=<64-hex SoraFS manifest digest>` тип билдәләгеҙ.

Ҡапҡаһы `base-url` һәм `privacy-url` ҡиммәттәр ҡулланырға тейеш `https://` урындағы тест шлюздарын ҡулланырға мөмкин `http://localhost`, `http://127.0.0.1`, йәки `http://[::1]` менән генә `--gateway-allow-insecure-localhost`. Ташҡыс токендары үтәү ваҡыты менән таныҡлыҡ билдәләре һәм улар яҙылмаған `Musubi.lock`.

## Баҫма {#publishing}

`pack` детерминистик иҫәпләй BLAKE3-256 сығанаҡ архивы хеш өҫтәп сығанаҡ байт һәм файл иҫәпләнә. ҡасан `--car-out`, `--sorafs-manifest-out`, йәки `--source-plan-out` тәьмин ителгән, ул шулай уҡ детерминистик төҙөү SoraFS CAR файҙалы йөк, SoraFS асыҡтан-асыҡ, һәм Musubi шул уҡ сығанаҡ файл йыйылмаһынан архив планы.

Баҫтырғанға тиклем киптереп уҡырға кәрәк:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

Юғиһә `--dry-run`, `publish` аҫтындағы дефолт артефакттарҙы яҙа `.musubi/dist/<namespace>/<name>/<version>/`, факультатив рәүештә манифест һәм файҙалы йөкмәтке аша Torii Ул - SoraFS Складка-пин һуңғы пункты менән `--upload`, генерируемых теркәлгән SoraFS Пин, һәм тапшыра `PublishMusubiRelease` конфигурацияланған аша Iroha клиент.

Баҫтырылған баҫмаларҙа түбәндәгеләр булырға тейеш:

- буш булмаған каноник сығанаҡ архивы
- детерминистик сығанаҡ архивы планы
- Берҙән-бер экспортланған Kotodama функцияһы
- Тейешле релиздарҙы һайламаған бәйлелек яҙмалары
- dapp һылтанмаһы, әгәр бар булһа, уның контракт исемдәре пакеттың атама киңлегенә тап килә

## Теркәү һорауҙары һәм ғүмер циклы {#registry-queries-and-lifecycle}

Реестрҙы эҙләгеҙ һәм тикшерегеҙ:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Янкинг яңы резолюциянан сығарыуҙы йәшереп тора, әммә ғәмәлдәге бикләү файлдарын ҡабатлай ала:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi глобаль исем ҡыҫырыҡлауҙан ҡаса, `namespace/package` исемдәр киңлегенә баҫтырып сығарыу шул уҡ хужалыҡ йәки тапшырылған рөхсәт моделе менән рөхсәт ителергә тейеш. был маҡсатта ҡулланыла Kotodama dapp исемдәр арауығы. Курацияланған глобаль ҡыҫҡа ҡушаматтар пакеттарҙың хужалығынан айырыла: `SetMusubiShortAlias` талап итә `CanSetMusubiShortAlias` рөхсәт, һәм маҡсатлы пакетта инде бер актив сығарыу булырға тейеш.

## Iroha Ер өҫтө {#iroha-surfaces}

Musubi беренсе класлы Iroha күрһәтмәләрен һәм һорауҙарын ҡуллана:

|Ер өҫтө |Маҡсат |
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |Үҙгәрмәсле пакетты баҫтырығыҙ. |
|`YankMusubiRelease` |Хәҙерге сығарылышты тартып алынған тип билдәләгеҙ. |
|`SetMusubiShortAlias` |Бөтә донъяға хас ҡыҫҡа исемде пакеттың идентификаторы менән бәйләгеҙ. |
|`AssertMusubiReleaseExists` |Конкрет пакет версияһы кәрәк. |
|`FindMusubiReleaseByRef` |Пакеткаға ҡағылышлы документтар килтерегеҙ. |
|`FindMusubiPackageVersions` |Пакет идентификаторы өсөн версиялар исемлеге. |
|`FindMusubiPackageReleases` |Баҫма идентификаторы өсөн резюмеларҙы яҙығыҙ. |
|`SearchMusubiPackages` |Исемдәр арауығы һәм текст буйынса пакет йомғаҡтары эҙләгеҙ. |
|`FindMusubiShortAliasByName` |Ҡыҫҡа ғына ҡушаматты хәл итегеҙ. |

Torii асыҡлай Musubi HTTP маршрут ғаиләһе `/v1/musubi/`. Агентҡа ҡараған MCP ҡорамалдар асыҡланған `iroha.musubi.` Алмаш исемдәр. [Torii йомғаҡлау пункттары](/ba/reference/torii-endpoints.md) һәм [Һорау һылтанмаһы](/ba/reference/queries.md) киңлек өсөн API Карта.
