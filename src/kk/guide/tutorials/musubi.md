---
translation_locale: kk
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Musubi Kotodama Қаптамалар {#musubi-kotodama-packages}

Musubi — бұл Kotodama бастапқы пакеттері үшін бірінші шығарылған пакет менеджері. Ол нақты тізбектегі тәуелділік графын шешеді, SoraFS бастапқы деректерді аутентификациялайды. таңдалған жұмыс кеңістігін мұрағаттайды, жинақтайды және тексереді, бір протокол стандартты CAR мұрағаттарын құрады және өзгермейтін нұсқаларды Iroha арқылы жариялайды.

Musubi қажет болғанда қолданыңыз:

- қайта пайдалануға болатын Kotodama функция кітапханаларын жариялау
- `Musubi.lock` ішіндегі дәл өтімдік графты белгілеу
- аяқталған SoraFS архивтің криптографиялық міндеттемесі мәндерінен тәуелділік көзін қалпына келтіріңіз
- бір пакет немесе көп пакетті жұмыс кеңістігін құру және тестілеу
- пакеттерді тізім арқылы қарау, жариялау, шығару, сақтау немесе лақап атпен қолдану

## Қаптама атаулары {#package-names}

жалғыз протокол-стандартты пакет селекторы қолдану:

```text
namespace/package
```

Дәл шығарылым идентификаторлары нұсқаны қосады:

```text
namespace/package@version
```

Контейнердан бұрын ешқандай жетекші `@` болмайды. Контейнер немесе `universal` сияқты деректер кеңістігі түбірі, немесе `dex.universal` сияқты доменмен квалификаланған деректер кеңістігі болуы мүмкін. Блокчейн тізілімі бұл құрылымдық контейнерді пакетті талап етуге болатын бір тұрақты үй деректер кеңістігіне байлайды.

## техникалық манифест және Lockfile {#manifest-and-lockfile}

Пакет жабық бірінші шығарылым `Musubi.toml` схемасын қолданады. Техникалық манифест `manifest-version = 1`, Kotodama нұсқасы `"1"` және IVM ABI нұсқасын `1` деп жариялауы тиіс; балама техникалық манифест немесе ABI режимі жоқ.

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

Тәуелділіктер нақты нұсқаларды, қос нүкте немесе тилда талаптарды, `1.*` сияқты жаппай таңбаларды және `>=1.0.0,<2.0.0` сияқты үтірмен бөлінген салыстырғыш жиындарын қолдана алады. Тәуелділік кестесінің кілті - ата-ана-жергілікті импорт лақап аты; `package` әрдайым бір ғана протокол-стандартты тіркеу селекторы болып табылады.

`Musubi.lock` графикті дәл текті тізімнен шыққан `NetworkId` және аяқталған тіркеу тіркеліміне байлайды. Ол таңдалған жұмыс кеңістігінің тамырлары мен өзгермейтін шығарылым түйіндерін тіркейді, шығарылым, көз, интерфейс, архив, ABI және нақты тәуелділік-шіркелі криптографиялық міндеттемелер мәндер қосқанда. Шешілген граф оларды қажет етсе, параллельді нұсқаларға рұқсат беріледі.

## Taira SoraFS алу үшін баптау {#configure-taira-sorafs-fetching}

Taira осы жұмыс процесінің қоғамдық тест желісі болып табылады. Тексерілген тізбек және ағымдағы бекітілген бастапқы генезис туылған желі идентификатормен бірге Taira клиентінің конфигурациясынан бастаңыз, содан кейін төменде провайдерге тән аутентификацияланған алу байланыстарын қосыңыз. Taira қалпына келтіру `NetworkId`-ны өзгерте алады; оны тұрақты тізбектен болжаудың орнына қол қойылған орналастыру профилінен жаңартыңыз UUID. Шотқа қол қою материалы мен провайдер операторының кілттері тек иесіне арналған бағдарламалық орындау ортасының файлдарында қалуы тиіс.

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

Қоғамдық testnet түбірінен Taira мойындаған провайдерлерді табыңыз:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

Жеткізуші каталогы жеткізушінің жеке басын және жарнамаланған API соңғы нүктелерін қамтамасыз етеді. Таңдалған жеткізушіден сәйкес оператор рұқсатын алыңыз. Бағдарламалық қамтамасыз ету орындау ортасы осы кілтті шектелген ағын таңбаларын сұрау үшін пайдаланады; таңбалар CLI аргументтері немесе құлып файлының мазмұны емес.

Taira тексеруші пинін URL ретінде `url` қолданбаңыз. Тексеруден өткен тексерушілерде кірістірілген SoraFS сақтау мүмкіндігі өшірілген. Олардың `https://taira-validator-{1,2,3,4}.sora.org` API соңғы нүктелері пин тіркеуді қабылдайды, ал архив оқу әрекеттері таңдалған қабылданған провайдердің HTTPS түпнұсқасын пайдаланады.

## Жергілікті жұмыс ағымы {#local-workflow}

Жоғарғы ағындағы Iroha жұмыс кеңістігінің түп-тамырынан пакет каталогын жасаңыз немесе оған кіріп, Cargo арқылы Musubi орындаңыз:

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

`fetch` соңғы тіркеу графигін шешеді, рұқсат етілген кезде `Musubi.lock`-ді жаңартады және аутентификацияланған SoraFS орындарынан өзгермейтін жергілікті кэшті толтырады. `check`, `build`, `test` және `package` өз жұмысын бастамас бұрын бірдей график пен кэш тексерулерін орындайды.

`--locked` кез келген lockfile өзгерісін қабылдамау үшін қолданыңыз. `--offline` тек тіркеу индексі мен барлық қажетті архивтер кеште болған жағдайда қолданылады. `--frozen` осы екі шектеуді біріктіреді. Офлайн кеш табылмаған жағдайда сәтсіздікке ұшырайды; Musubi ешқашан шешілмеген lockfile-ды жазбайды.

Тәуелділік көздері техникалық шақыруларды, мысалы, `math::add()`, детерминистік ішкі Kotodama атауларға қайта жазу арқылы байланыстырылады. Тәуелділік техникалық экспортталмаған функцияның шақырылуы қабылданбайды. Импортталған кітапханалар функцияларды көрсетеді; жергілікті `[[contract]]` және `[[test]]` нысандар айқын пакет нысандары болып қала береді.

## Кэшті тексеру және жөндеу {#cache-verification-and-repair}

Қоғамдық кэш командалары тіркелгідегі өзгермейтін, жарияланған архивтерде жұмыс істейді:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` карантиндер сенімді мұрагерлерді бүлдіреді және соңғы жеткізуші дәлелі рұқсат еткенде нақты архивтерді қайта жүктейді. Өсімді қысқарту тірі бос емес мутация үшін саналы түрде сәтсіздікпен жабылады; сызықталған үміткерлерді тексеру үшін `--dry-run` қолданыңыз.

## Қаптама жасау және жариялау {#packaging-and-publishing}

Архив жазбас бұрын таза оң файл жиынтығын тексеріп, содан кейін бір протокол стандартты пакетті жасаңыз:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` `target/package/<namespace>-<name>-<version>.car` жазады. CAR бір ғана протокол-стандарт пакетінің техникалық манифесін, семантикалық релиздің техникалық манифесін, дәл тексеру құлыбын, көздер ағашын байланыстырады, интерфейс криптографиялық қысқартылған мән және SoraFS архивтік криптографиялық міндеттеме мәні. Бірінші шығарылымдағы CLI ішінде жеке `pack`, `--car-out`, `--sorafs-manifest-out` немесе `--source-plan-out` командалары жоқ.

Жариялау — бұл қол қойылған, қайта бастауға болатын желілік жұмыс процесі. Таңдалған `client.toml` қажетті `[musubi.publication]` байламдарды, сондай-ақ есептік жазба мен Taira желілік конфигурацияны қамтуы керек. Дәл бір жұмыс кеңістігінің мүшесін пакеттеңіз:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Операциялық журнал мен тұқымдық кіріс шекарасы тұрақты болғаннан кейін оралу үшін `--detach` қолданыңыз. `publish --resume <operation-id> --config client.toml` көмегімен тұрақты операцияны жалғастырыңыз. Тар `--recover <operation-id>` жол тек қайта құрады кірмеген бұрынғы журнал үшін өзгермейтін қосалқы жазбалар жоқ. `--dry-run` жарияланым немесе жалпы қоғамдық жүктеме нұсқасы жоқ; жергілікті алдын ала тексеру үшін `package --list` және `package` іске қосыңыз.

## Тіркеу сұраулары және өмірлік цикл {#registry-queries-and-lifecycle}

Соңғы нұсқасы жасалған тіркелімді сол Taira клиент конфигурациясымен іздеп тексеріңіз:

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

Yanking жаңа шешімдерден өзгермейтін релизді шығарып тастайды, ал бұрынғы нақты құлыптар қайта құруға мүмкіндік береді. Алдымен ағымдағы yanking нұсқасын оқыңыз, содан кейін салыстыру және орнату мутациясын жіберіңіз:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

`unyank` бірдей пакет, нұсқа және жаңадан оқылған ревизиямен пайдаланып, сол күйді кері қайтара аласыз. Пакетке иелік ету және қолдаушы рөлдері жариялау, жою, метадеректерді бақылауды жүзеге асырады, және архив орнына рұқсаттар. Ғаламдық лақап аттардың өздерінің бағаланған тіркеуі, қайта мақсаттау тарихы және салыстыру-және-орнату түзетулері бар; олар пакет меншік құқықтарының қысқартулары емес.

## Iroha Беттер {#iroha-surfaces}

Musubi бірінші шығарылым V1 нұсқауларын және сұрауларын пайдаланады:

|Беткі|Мақсат|
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `RegisterMusubiNamespaceBindingV1`                   |Аты кеңістігін оның тұрақты үй деректер кеңістігіне байлаңыз.|
| `RegisterMusubiArchiveV1`                            |Өзгермейтін аутентификацияланған дерек көзінің архивтік криптографиялық міндеттеме мәнін тіркеңіз.|
| `AddMusubiArchiveLocationV1`                         |Дәлелденген SoraFS архив орналасуын қосу немесе жаңарту.|
| `PublishMusubiReleaseV1`                             |Пакетті талап етіңіз немесе жаңартыңыз және бір өзгермейтін нұсқасын жариялаңыз.|
| `SetMusubiReleaseYankV1`                             |Дәл шығарылымның жұлынған күйін салыстыру және орнату.|
| `InviteMusubiPackageMaintainerV1`                    |Ашық пакет рөліне шақыру ағынын бастаңыз.|
| `RegisterMusubiAliasV1` / `RetargetMusubiAliasV1`    |Басқарылатын жаһандық тіркесімге тіркелу немесе қайта бағыттау.|
| `AssertMusubiReleaseDigestV1`                        |Дәл өзгермейтін шығарылымның криптографиялық дайджест мәнін растаңыз.|
| `FindMusubiExactPackageV1`                           |Бір нақты пакетті және оның өзгерістерін оқыңыз.|
| `FindMusubiExactReleaseV1`                           |Бір нақты шығарылған нұсқаны оқыңыз.|
| `FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Шешіңіз немесе түпкілікті шығарылым кандидаттарын тізімдеңіз.|
| `FindMusubiArchiveLocationsV1`                       |Соңына дейін бекітілген провайдер қолдаған мұрағат орындарын оқыңыз.|
| `FindMusubiAliasV1` / `FindMusubiAliasHistoryV1`     |Ағымдағы псевдоним нысанын немесе оның өзгермейтін тарихын оқыңыз.|

Torii қосымшаның маршруттар отбасын `/v1/musubi/*` астында ашады. MCP құралдары ағымдағы `iroha.musubi.queries.*` және `iroha.musubi.instructions.*` атауларын пайдаланады. Толық API картасын қарау үшін [Torii API ұш нүктелер](/kk/reference/torii-endpoints.md) және [сұрау сілтемесі](/kk/reference/queries.md) қарап шығыңыз.
