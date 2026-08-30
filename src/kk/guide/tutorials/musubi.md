---
translation_locale: kk
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama {#musubi-kotodama-packages}

Musubi - Kotodama бастапқы пакеттердің алғашқы релизге арналған пакет менеджері. Ол шынжырдағы нақты тәуелділік графигін шешеді, SoraFS куәландырады. бастапқы архивтер, таңдалған жұмыс кеңістігін құрастырады және сынақтайды, CAR каноникалық архивтерді жасайды және Iroha арқылы өзгеріске ұшырамайтын релиздерді жариялайды.

Керек болған жағдайда Musubi пайдалану:

- қайтадан пайдаланылатын Kotodama функциялық кітапханаларды жариялау
- `Musubi.lock` түрінде нақты ауыспалы графиканы орнату.
- Аяқталған SoraFS мұрағат міндеттемелері бойынша тәуелділік көзін қайта құру
- бір пакеттерді немесе көп пакеттерді жұмыс кеңістігін құру және сынау
- тізбекті тіркелгі арқылы пакеттерді тексеру, жариялау, тартып алу, күтіп ұстау немесе қолданбалы түрде қарау

## Баптама атаулары {#package-names}

Canonical пакетті таңбалаушылар:

```text
namespace/package
```

Нақты релиз сәйкестендірушілері:

```text
namespace/package@version
```

Атау кеңістігінің алдында жетекші `@` жоқ. Атау кеңістігі немесе деректер кеңістігінің тамыры , мысалы `universal` немесе доменге сәйкес келетін деректер базасы, мысалы: `dex.universal`. Бухгалтерлік кітапша бұл құрылымдық атау кеңістігін пакеттерді талап етуден бұрын бір тұрақты үй деректер кеңістігіне байланыстырады.

## Manifest және Lockfile {#manifest-and-lockfile}

Бір пакетте жабық бірінші релиз қолданылады `Musubi.toml` Схема. Манифест декларациялауы тиіс `manifest-version = 1`, Kotodama басылым `"1"`, және IVM ABI нұсқасы `1`; ауыспалы белгісі жоқ немесе ABI режимі.

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

Тәуелділіктер нақты нұсқаларды, қамқорлық немесе тильд талаптарды, Wildcard сияқты `1.*`, және сызықпен бөлінген салыстырушы жиынтықтар, мысалы: `>=1.0.0,<2.0.0`. Тәуелділік кестесі кілті - ата-аналық жергілікті импорт атауы; `package` әрқашанда каноникалық тізілімді таңдаушы.

`Musubi.lock` графикті нақты генезден алынған `NetworkId` және түпкілікті реестр кескініне байланыстырады. Бұл таңдалған жұмыс кеңістігінің тамырлары мен өзгермейтін босату түйіндерін тіркейді; ABI және нақты тәуелділік шегіндегі міндеттемелерді қоса алғанда, босату, көз, интерфейс, мұрағат. Қатысу графигі қажет болған кезде параллельдік нұсқаларға рұқсат етіледі.

## Конфигурация Taira SoraFS Жеткізу {#configure-taira-sorafs-fetching}

Taira - бұл жұмыс барысы үшін қоғамдық тест желісі. Taira клиент конфигурациясынан бастаңыз, онда қосылған шынжыр мен желі сәйкестігі бар, содан кейін төмендегі провайдерге арналған аутентификацияланған әкелу байланыстарын қосу керек. Есептік жазбаға қол қою материалы мен провайдер операторының кілттері тек меншік иесіне арналған жұмыс уақытының файлдарында сақталуы тиіс.

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

Taira мемлекеттік тестілеу желісі түбірінен қабылданған провайдерлерді анықтаңыз:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

Провайдер каталогы провайдер сәйкестіктерін және жарнамаланған соңғы нүктелерді ұсынады. Таңдалған провайдерден сәйкестік операторының рұқсатын алыңыз. Runtime осы кілтімен шектелген ағын белгілерін сұрайды; белгілер CLI аргументтері де, құлып файлының мазмұны да емес.

А Taira куәландырушы шерті URL ретінде `url`. Тексерілген растаушыларды SoraFS сақтау қабілеті бұзылған. `https://taira-validator-{1,2,3,4}.sora.org` соңғы нүктелер пин тіркелуді қабылдайды, ал мұрағат оқулары таңдалған рұқсат етілген провайдердің HTTPS шығу тегі.

## Жергілікті жұмыс барысы {#local-workflow}

Үстімен Iroha жұмыс кеңістігінің түбірінен бастамалар каталогын құру немесе енгізу және Musubi жүкті арқылы орындау:

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

`fetch` түпкілікті тіркелгі графикасын шешеді, рұқсат етілген кезде жаңартуларды жасайды `Musubi.lock` және аутентификацияланған SoraFS орындарынан өзгермейтін жергілікті кешті толтырады. `check`, `build`, `test` және `package` өз жұмысынан бұрын бірдей график пен кеш тексерулерін жүргізеді.

Пайдалану `--locked` құптау файлының кез келген өзгеруін бас тарту. `--offline` тек тіркелгі индексі мен барлық қажетті архивтер алдын ала сақталған жағдайда ғана. `--frozen` Бұл екі шектеуді біріктіреді. Musubi ешқашан шешілмеген қап файл жаза алмайды.

Тәуелділік көздері `math::add()` сияқты білікті шақыруларды детерминистік ішкі Kotodama атауларға қайта жазу арқылы байланыстырады. Экспортты емес функцияға тәуелділік шақыруы қабылданбайды. Импортталған кітапханалар функцияларын көрсетеді; жергілікті `[[contract]]` және `[[test]]` мақсаттары айқын пакет мақсаттары болып қала береді.

## Қашықтықтан сақтауды тексеру және жөндеу {#cache-verification-and-repair}

Қоғамдық кеш командалары өзгермейтін, тіркелгіге міндетті архивтерде жұмыс істейді:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` карантин сенімді ұрпақтарды бұзады және нақты мұрағаттарды қайта өңдеуге мүмкіндік береді. Musubi тірі, бос емес кесу мутациясын бас тартады. Кlassified кандидаттарды тексеру үшін `--dry-run` қолданыңыз.

## Қаптама және баспа {#packaging-and-publishing}

Архив жазудан бұрын таза оң файл жиынтығын тексеріңіз, содан кейін каноникалық пакеттерді құраңыз:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` жазады `target/package/<namespace>-<name>-<version>.car`. Қауымдастық CAR Canonical package manifest, semantic release manifest, exact verification lock, source tree, interface digest және SoraFS Архив міндеттемелері жоқ. `pack`, `--car-out`, `--sorafs-manifest-out`, немесе `--source-plan-out` бірінші нұсқадағы командалар CLI.

Жариялау - қол қойылған, қайта іске асырылатын желілік жұмыс барысы. Таңдалған `client.toml` құрамында `[musubi.publication]` өндіріс байланыстары, сондай-ақ шот пен Taira желі конфигурациясы болуы тиіс.

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Пайдалану `--detach` жұмыс журналы мен тұқымға кіру шекарасы тұрақты болғаннан кейін қайта оралуға тиіс. `publish --resume <operation-id> --config client.toml`. Таңғысы `--recover <operation-id>` жол тек кіру алдындағы таза журналы үшін жоғалған өзгеріске ұшырамайтын көлігі қайта құру. `--dry-run` немесе жалпыға ортақ жүктеп алуды кері қайтару; орындау `package --list` және `package` Жергiлiктi ұшу алдындағы рейс.

## Тізілім сұрақтары және өмір циклі {#registry-queries-and-lifecycle}

Taira клиент конфигурациясымен аяқталған тіркелімді іздеу және тексеру:

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

Янкинг жаңа резолюциялардан өзгермейтін босатуды болдырмайды, ал іс жүзіндегі дәл қақпақтар қайталануы мүмкін. Алдымен қазіргі yank қайталануын оқып, содан кейін салыстырып-белгілеу мутациясын тапсырыңыз:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

`unyank` пайдаланумен бірдей пакеттер, нұсқасы және жаңадан оқылған қайталау осы күйін керісінше. Пакет иесі мен ұстаушы рөлдері басқару жариялау, yank, метамәдени, Global aliases өз бағасына тіркелу, қайта мақсаттау тарихын және салыстыру мен орнату тексерулері бар; олар пакетке иелік етудің қысқаша жолы емес.

## Iroha Жер беттері {#iroha-surfaces}

Musubi алғашқы шығарылымдағы V1 нұсқаулар мен сұрауларды пайдаланады:

|Жер беті |Мақсаты |
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |Атау кеңістігін оның тұрақты үй деректер кеңістігіне байлаңыз. |
|`RegisterMusubiArchiveV1` |Өзгерілмейтін аутентификацияланған бастапқы архив міндеттемелерін тіркеңіз. |
|`AddMusubiArchiveLocationV1` |SoraFS дәлелденген мұрағат орналасқан жерін қосу немесе жаңарту. |
|`PublishMusubiReleaseV1` |Пакетті талап ету немесе жаңарту және бір өзгермейтін нұсқаны жариялау. |
|`SetMusubiReleaseYankV1` |Салыстырып, нақты босатудың тартылған күйін орнату. |
|`InviteMusubiPackageMaintainerV1` |Жасалған пакеттік рөлдерді шақыру ағынын бастаңыз. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |Басқарушы глобальдық псевдонимді тіркеу немесе қайта бағыттау. |
|`AssertMusubiReleaseDigestV1` |Дәл өзгеріске ұшырамайтын босатуды анықтау. |
|`FindMusubiExactPackageV1` |Бір топтаманы және оның түзетулерін оқыңыз. |
|`FindMusubiExactReleaseV1` |Бір-бірін оқып көріңіз.|
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Шешімдеу немесе аяқталған босату кандидаттарын тізімдеу. |
|`FindMusubiArchiveLocationsV1` |Провайдер қолдаған түпкілікті мұрағат жерлерін оқыңыз. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |Қазіргі аты-жөнді немесе оның өзгермейтін тарихын оқыңыз. |

Torii қосымша бағыты отбасын `/v1/musubi/` астына шығарады. MCP құралдар ағымдағы `iroha.musubi.queries.` және `iroha.musubi.instructions.*` атауларын пайдаланады. Кең таралған API картасы үшін [Torii аяқтық нүктелерін](/kk/reference/torii-endpoints.md) және [ сұраныс анықтамасын](/kk/reference/queries.md) қараңыз.
