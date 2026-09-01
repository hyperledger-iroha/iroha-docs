---
translation_locale: ba
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Musubi Kotodama Пакеттар {#musubi-kotodama-packages}

Musubi - Kotodama сығанаҡ пакеттары өсөн беренсе тапҡыр сығарылған пакет менеджеры. Ул сылбырҙа бәйлелек графикаһын асыҡлай, SoraFS-ны раҫлай сығанаҡ архивтары, һайлап алынған эш майҙанын йыя һәм һынап ҡарай, CAR каноник архивтар төҙөй, һәм Iroha аша үҙгәрешһеҙ релиздар баҫтыра.

Әгәр кәрәк булһа, Musubi ҡулланығыҙ:

- ҡабаттан ҡулланылған Kotodama функциялар китапханаларын баҫтырыу
- `Musubi.lock` тип теүәл күсереү графикаһын яҙығыҙ.
- SoraFS архив йөкләмәләренән бәйлелек сығанағын үҙгәртергә.
- бер пакет йәки күп пакетта эш итеү урыны төҙөргә һәм һынарға.
- Сылбырҙағы реестр аша пакеттарҙы тикшерергә, баҫтырырға, тартып алырға, һаҡлауға йә исем-шәрифкә алмаштырырға

## Пакеттарҙың исемдәре {#package-names}

Канонник пакеттар һайлап алыу аппараттары ҡуллана:

```text
namespace/package
```

Дөрөҫ сығарыу идентификаторҙары версияны өҫтәй:

```text
namespace/package@version
```

Исемдәр арауығы алдынан `@` билдәһе юҡ. Исемдәр арауығы йәки мәғлүмәт арауығы тамыр, мәҫәлән: `universal` йәки домен-квалификациялы мәғлүмәт базаһы, мәҫәлән: `dex.universal`. Букмекер был структуралы исемдәр киңлеген бер тотороҡло төп мәғлүмәт киңлеге менән бәйләй, пакетты талап итеү мөмкин тиклем.

## Манифест һәм бикләү файлы {#manifest-and-lockfile}

Бер пакетта ябыҡ беренсе сығарылыш ҡулланыла `Musubi.toml` схема. манифестҡа белдерергә тейеш `manifest-version = 1`, Kotodama баҫмаһы `"1"`, һәм IVM ABI версияһы `1`; Яуаплы билдә юҡ, йәки ABI режимы.

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

Тейешле версиялар, ҡарау йәки тилде талаптары, wildcards кеүек ҡулланырға мөмкин. `1.*`, һәм комета менән айырылған сағыштырыу йыйылмалары, мәҫәлән: `>=1.0.0,<2.0.0`. Яҡшылыҡ таблицаһы асҡысы - ата-әсә урындағы импорт исемдәре; `package` һәр ваҡыт канонический реестр һайлаусыһы.

`Musubi.lock` графты теүәл генезистарҙан алынған `NetworkId` һәм тамамланған реестр снапшотына бәйләй. Ул һайлап алынған эш урыны тамырҙарын һәм үҙгәрешһеҙ сығарыу узелдарын теркәп бара, релиз, сығанаҡ, интерфейс, архив, ABI һәм теүәл бәйлелек сигендәге йөкләмәләрҙе үҙ эсенә ала. Resolved graph талап иткәндә parallel versions рөхсәт ителә.

## Конфигурация Taira SoraFS Ашырыу {#configure-taira-sorafs-fetching}

Taira — был эш ағымы өсөн асыҡ testnet. Checked-in chain һәм хәҙерге pinned genesis-derived network identity булған Taira client configuration-ынан башлап, аҫтағы provider-specific authenticated fetch bindings-ты өҫтәгеҙ. Taira reset `NetworkId`-ны үҙгәртә ала; уны stable chain UUID-нан сығармағыҙ, signed deployment profile-дан яңыртығыҙ. Иҫәпкә ҡултамға ҡуйыу материалы һәм провайдер оператор асҡыстары хужа ғына уҡый алған runtime файлдарында һаҡланырға тейеш.

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

Taira асыҡ тест селтәре тамырҙарынан ҡабул ителгән провайдерҙарҙы табығыҙ:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

Провайдер каталогы провайдер идентификацияларын һәм рекламаланған һуңғы нөктәләрҙе тәьмин итә. һайланған провайдерҙан тапҡан операторға рөхсәт алыу. Runtime был асҡысты сикләнгән ағым токендәрен һорап ҡуллана; токендар CLI аргументтары ла түгел, ә бикләү файлы йөкмәткеһе лә түгел.

Ҡулланырға ярамай Taira раҫлаусы штрих URL тип `url`. Теркәлгән валидаторҙар индерелгән SoraFS Һаҡлау һәләте һүндерелгән. `https://taira-validator-{1,2,3,4}.sora.org` һуңғы нөктәләр PIN теркәү ҡабул итә, ә архив уҡыуҙар һайлап алынған рөхсәт ителгән провайдерҙың HTTPS сығышы.

## Урындағы эш ағымы {#local-workflow}

Iroha өҫтөнлөктәге эш урыны тамырҙан, пакет каталогын булдырығыҙ йәки индерегеҙ һәм Musubi ҙы Cargo аша эшләйһегеҙ:

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

`fetch` тамамланған реестр графикаһын хәл итә, рөхсәт ителгән ваҡытта `Musubi.lock`-ны яңырта һәм аутентификацияланған SoraFS урындарҙан үҙгәрешһеҙ локаль кеште тултыра. `check`, `build`, `test` һәм `package` үҙ эштәре алдынан шул уҡ график һәм кеште тикшерәләр.

`--locked` ҡулланып, ниндәй ҙә булһа бикләү файлы үҙгәрештәрен кире ҡаҡ. `--offline`-ны тик реестр индексы ла, бөтә кәрәкле архивтар ҙа һаҡланған саҡта ғына ҡулланығыҙ. `--frozen` был ике сикләүҙе берләштерә. Оффлайн кэш уңышһыҙлыҡҡа осрай; Musubi бер ҡасан да хәл ителмәгән бикләү файлын яҙмай.

Ҡатнашыусылыҡ сығанаҡтары `math::add()` кеүек квалификациялы саҡырыуҙарҙы детерминистик эске Kotodama исемдәргә күсереп яҙып бәйләйҙәр. Экспортланмаған функцияға бәйлелек саҡырыуы кире ҡағыла. Импортланған китапханалар функцияларҙы аса; урындағы `[[contract]]` һәм `[[test]]` маҡсаттары асыҡ пакет маҡсаттары булып ҡала.

## Кэшты тикшереү һәм ремонтлау {#cache-verification-and-repair}

Йәмәғәт кеши командалары үҙгәрешһеҙ, реестр commit ителгән архивтарҙа эшләй:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` карантин ышаныслы нәҫелдәрҙе боҙоу һәм аныҡ архивтарҙы үҙгәртеү, әгәр раҫланған тәьмин итеүсе иҫбатлау быны рөхсәт итә. тере буш булмаған мутация өсөн ҡырҡыу атама менән ябыла; классификацияланған кандидаттарҙы тикшереү өсөн `--dry-run` ҡулланалар.

## Баҫмалар һәм баҫмалар {#packaging-and-publishing}

Архив яҙыр алдынан саф ыңғай файлдар йыйылмаһын тикшерегеҙ, һуңынан канонник пакет төҙөгөҙ:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` яҙа `target/package/<namespace>-<name>-<version>.car`. CAR каноник пакет манифест, семантик сығарыу манифест бәйләй, теүәл тикшереү бикләү, сығанаҡ ағасы, интерфейс. digest һәм SoraFS архив йөкләмәһе. Тәүге сығарылышта `pack`, `--car-out`, `--sorafs-manifest-out` йәки `--source-plan-out` бойороҡтары юҡ CLI.

Баҫтырып сығарыу — ҡултамғалы һәм дауам иттерелә алған network workflow. Һайланған `client.toml` талап ителгән `[musubi.publication]` binding-тарын, account һәм Taira network configuration-ды үҙ эсенә алырға тейеш. Workspace-тың тап бер member-ын package итегеҙ:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

`--detach` флагын операция журналы һәм seed-ingress сиге тотороҡло һаҡланғандан һуң ғына кире ҡайтыу өсөн ҡулланығыҙ. Тотороҡло операцияны `publish --resume <operation-id> --config client.toml` командаһы менән дауам итегеҙ. Тарыраҡ `--recover <operation-id>` юлы pristine pre-ingress журналы өсөн юғалған үҙгәрмәҫ sidecar-ҙарҙы ғына яңынан төҙөй. Publication өсөн `--dry-run` мөмкинлеге юҡ. Дөйөм public upload fallback та юҡ. Урындағы preflight тикшереүе өсөн `package --list` һәм `package` командаларын эшләтегеҙ.

## Теркәү һорауҙары һәм ғүмер циклы {#registry-queries-and-lifecycle}

Шул уҡ Taira клиент конфигурацияһы менән тамамланған реестрҙы эҙлә һәм тикшерегеҙ:

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

Йәнкин яңы резолюцияларҙан үҙгәрешһеҙ сығарыуҙы ситләтә, ә ғәмәлдәге теүәл бикләүҙәр ҡабатланмаҫ булып ҡала. Тәүҙә хәҙерге yank ревизияһын уҡығыҙ, һуңынан сағыштырыу һәм билдәләү мутацияһын тапшырығыҙ:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

`unyank` ҡулланырға шул уҡ пакеты, версияһы һәм яңы уҡып ревизия менән был хәлде кире ҡайтарыу өсөн. Пакеттар хужалыҡ һәм һаҡлау ролдәрен контроль баҫтырып сығарыу, yank, метамәғлүмәттәрҙе, һәм архив урынлаштырыу рөхсәттәре. Глобаль алфавиттарҙың үҙ хаҡлы теркәлеүе, ретаргет тарихы һәм сағыштырыу һәм ҡуйыу ревизиялары бар; улар пакеттың милекселеге өсөн ҡыҫҡа юлдар түгел.

## Iroha Ер өҫтө {#iroha-surfaces}

Musubi беренсе тапҡыр сығарылған V1 күрһәтмәләрен һәм һорауҙарын ҡуллана:

|Йөҙөлөш |Маҡсат |
| ---------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |Исемдәр киңлеген уның тотороҡло йорт мәғлүмәттәр киңлегенә бәйләү. |
|`RegisterMusubiArchiveV1` |Үҙгәрмәсле аутентификацияланған сығанаҡ архивы йөкләмәһен теркәгеҙ. |
|`AddMusubiArchiveLocationV1` |SoraFS архивының иҫбатланған урынын өҫтәү йәки яңыртыу. |
|`PublishMusubiReleaseV1` |Пакетты талап итегеҙ йәки яңыртығыҙ һәм бер үҙгәрешһеҙ версияны баҫтырығыҙ. |
|`SetMusubiReleaseYankV1` |Сағыштырығыҙ һәм туранан-тура иреккә сығарыуҙың тартылған торошон билдәләгеҙ|
|`InviteMusubiPackageMaintainerV1` |Яуаплы пакет роле саҡырыу ағымын башлағыҙ. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |Хакимлыҡ иткән глобаль алфавитты теркәү йәки яңынан адреслау. |
|`AssertMusubiReleaseDigestV1` |Дөрөҫ, үҙгәрешһеҙ сығартыуҙы раҫлау. |
|`FindMusubiExactPackageV1` |Дөрөҫ генә бер пакетты һәм уның үҙгәртеп ҡороуҙарын уҡығыҙ. |
|`FindMusubiExactReleaseV1` |Дөрөҫөн генә әйткәндә, бер фотоны уҡығыҙ. |
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Аҙаҡтан сығарылған кандидаттарҙы хәл итергә йәки исемлеккә индерергә. |
|`FindMusubiArchiveLocationsV1` |Провайдер ярҙамында архив ҡуйылған урындарҙы уҡығыҙ. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |Хәҙерге алфавитты йәки уның үҙгәрешһеҙ тарихын уҡығыҙ. |

Torii ҡушымта маршруты ғаиләһен `/v1/musubi/*` аҫтында асыҡлай. MCP инструменттар хәҙерге `iroha.musubi.queries.*` һәм `iroha.musubi.instructions.*` исемдәрен ҡуллана. киңрәк API картаһы өсөн [Torii һуңғы нөктәләрен](/ba/reference/torii-endpoints.md) һәм [ һорау шиғырын](/ba/reference/queries.md) ҡарағыҙ.
