---
translation_locale: ru
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama упаковки {#musubi-kotodama-packages}

Musubi является управляющим пакетами первой версии для исходных пакетов Kotodama. Он решает точный график зависимости на цепочке, удостоверяет аутентификацию SoraFS исходные архивы, составляет и тестирует выбранное рабочее пространство, создает канонические CAR архивы и публикует неизменные релизы через Iroha.

Используйте Musubi, когда вам нужно:

- публиковать библиотеки функций Kotodama, которые могут быть использованы повторно
- записывать точный переходный график в `Musubi.lock`
- восстановить источник зависимости от завершенных архивных обязательств SoraFS
- построение и испытание одного пакета или многопакетного рабочего пространства;
- проверять, публиковать, вытягивать, поддерживать или переименовать пакеты через реестр в цепочке

## Названия пакетов {#package-names}

Канонические селекторы упаковки используют:

```text
namespace/package
```

Точные идентификаторы выпуска добавляют версию:

```text
namespace/package@version
```

Не существует лидирующей `@` перед пространством имен. Название пространства является либо корнем пространства данных, например `universal` или доменно-квалифицированным пространством данных, таким как `dex.universal`.

## Манифест и запись {#manifest-and-lockfile}

В пакете используется схема закрытого первого выпуска `Musubi.toml`. Манифест должен декларировать `manifest-version = 1`, Kotodama издание `"1"` и IVM ABI версию `1`; нет альтернативного манифеста или режима ABI.

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

Зависимости могут использовать точные версии, требования к заботе или тильде, дикие карты, такие как `1.*`, и наборы сравнительных устройств с разделением комы, таких как `>=1.0.0,<2.0.0`. Ключ к таблице зависимостей - это псевдоним импорта родительско-местного значения; `package` всегда является избирателем канонического реестра.

`Musubi.lock` связывает график с точным генезисом `NetworkId` и завершенным снижением реестра. Он записывает выбранные корни рабочего пространства и неизменные узлы выпуска. включая выпуск, источник, интерфейс, архив, ABI и точные обязательства по краю зависимости. Параллельные версии разрешаются, когда требуется разрешённая графика.

## Конфигурирование Taira SoraFS Привлечение {#configure-taira-sorafs-fetching}

Taira является публичной тестовой сетью для этого рабочего потока. Начните с конфигурации клиента Taira с зарегистрированной цепочкой и идентичностью сети, а затем добавьте подробные связки аутентифицированного загрузки для поставщика. Материал подписи счета и ключи оператора поставщика должны оставаться в файлах времени запуска, предназначенных только для собственника.

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

Откройте зарегистрированных поставщиков Taira из общедоступной корни тестирования сети:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

Каталог поставщика предоставляет идентификации поставщика и рекламные конечные точки. Получить разрешение соответствующего оператора от выбранного поставщика. Время выполнения использует этот ключ для запроса ограниченных токенов потока; токены не являются ни аргументами CLI, ни контентом блокировки файла.

Не используйте Taira Пин проверяющего устройства URL как `url`. Зарегистрированные валидаторы встроены SoraFS Сохранение отключено. `https://taira-validator-{1,2,3,4}.sora.org` конечные точки принимают регистрацию пин, в то время как чтение архива использует выбранный допустимый провайдер. HTTPS происхождение.

## Местный рабочий процесс {#local-workflow}

С корня рабочего пространства Iroha вверх по течению, создать или ввести каталог пакетов и запустить Musubi через Cargo:

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

`fetch` решает завершенный график реестра , обновления `Musubi.lock` когда это разрешено, и заполняет неизменный локальный кеш из аутентифицированного SoraFS местоположения. `check`, `build`, `test`, и `package` выполнять те же графические и кеширующие проверки перед своей работой.

Используйте `--locked` для отказа от любого изменения файла блокировки. Используйте `--offline` только тогда, когда индекс реестра и каждый необходимый архив уже вкладываются в кэш. `--frozen` сочетает эти два ограничения. Оффлайн-кэш не работает; Musubi никогда не пишет незарешенный кэш-файл.

Источники зависимости связываются путем переписки квалифицированных вызовов, таких как `math::add()` с детерминистскими внутренними названиями Kotodama. Призыв к зависимости к неэкспортируемой функции отклоняется. Импортируемые библиотеки выставляют функции; локальные цели `[[contract]]` и `[[test]]` остаются ясными целями пакета.

## Проверка и ремонт кеша {#cache-verification-and-repair}

Публичные каш-команды работают на неизменных архивах, связанных с регистрацией:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` карантин коррумпирует доверенных потомков и перечисляет точные архивы, когда позволяют завершенные доказательства поставщика. Musubi отвергает живую непустую мутацию подрезания. Используйте `--dry-run` для проверки классифицированных кандидатов.

## Опаковка и издание {#packaging-and-publishing}

Перед написанием архива проверьте чистый положительный файл, а затем создайте канонический пакет:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` пишет `target/package/<namespace>-<name>-<version>.car`. CAR связывает канонический пакетный манифест, семантический манифест выпуска, точное блокирование проверки, источник дерево, интерфейс Digest и SoraFS обязательства по архиву. В первом выпуске CLI не существует отдельных команд `pack`, `--car-out`, `--sorafs-manifest-out` или `--source-plan-out`.

Публикация - это подписанный, перезагружаемый рабочий процесс сети. Выбранные `client.toml` должны содержать обязательства по производству `[musubi.publication]`, а также конфигурацию учетной записи и сети Taira.

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Использование `--detach` после того, как дневник работы и граница входа семян будут прочными. `publish --resume <operation-id> --config client.toml`. В узком. `--recover <operation-id>` Путь только восстанавливает отсутствующие неизменные боковые машины для нетронутого журнала до входа. `--dry-run` или общий общественный загрузка fallback; выполнять `package --list` и `package` для местного предлетового полета.

## Вопросы по регистру и жизненный цикл {#registry-queries-and-lifecycle}

Поиск и проверка завершенного реестра с той же конфигурацией Taira клиента:

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

Янкинг исключает неизменное освобождение от новых разрешений, в то время как существующие точные блоки остаются воспроизводимыми. Сначала прочитайте текущий пересмотр yank, а затем представьте мутацию сравнения и сбора:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

Используйте `unyank` с одним и тем же пакетом, версией и свежепрочитанным пересмотром, чтобы отменить это состояние. Глобальные псевдонимы имеют свою собственную регистрацию по цене, историю ретаргетинга и пересмотры сравнения и настройки; они не являются кратковременными маршрутами собственности пакетов.

## Поверхности Iroha {#iroha-surfaces}

Musubi использует инструкции и запросы первой версии V1:

|Поверхность .|Цель .|
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |Привязать пространство имен к его стабильному домашнему пространству данных. |
|`RegisterMusubiArchiveV1` |Зарегистрируйте неизменный аутентифицированный обязательство архива источника. |
|`AddMusubiArchiveLocationV1` |Добавить или возобновить проверенное место архива SoraFS. |
|`PublishMusubiReleaseV1` |Заявление или обновление пакета и публикация одного неизменного выпуска. |
|`SetMusubiReleaseYankV1` |Сравните и установите вытянутое состояние точного высвобождения. |
|`InviteMusubiPackageMaintainerV1` |Начните открытый поток приглашений на роль пакета. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |Регистрировать или переназначить управляемый глобальный псевдоним. |
|`AssertMusubiReleaseDigestV1` |Укажите точный неизменный расщепление.|
|`FindMusubiExactPackageV1` |Прочитайте один конкретный пакет и его пересмотры. |
|`FindMusubiExactReleaseV1` |Прочитайте один точный снимок. |
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Разрешить или перечислить кандидатов на окончательное освобождение. |
|`FindMusubiArchiveLocationsV1` |Прочитайте окончательные архивные локации, поддерживаемые поставщиком. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |Прочитайте текущую цель или ее неизменную историю. |

Torii раскрывает семейство маршрутов приложений в `/v1/musubi/`. MCP инструменты используют ток `iroha.musubi.queries.` и `iroha.musubi.instructions.*` Названия. [Torii конечные точки](/ru/reference/torii-endpoints.md) и [ссылка на запрос](/ru/reference/queries.md) для более широкого API Карта.
