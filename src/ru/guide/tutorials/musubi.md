---
translation_locale: ru
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Musubi Kotodama Пакеты {#musubi-kotodama-packages}

Musubi — это менеджер пакетов первого выпуска для исходных пакетов Kotodama. Он разрешает точную ончейн-зависимость, аутентифицирует SoraFS источники архивов, компилирует и тестирует выбранное рабочее пространство, создает канонические CAR архивы и публикует неизменяемые релизы через Iroha.

Используйте Musubi, когда вам нужно:

- публиковать повторно используемые Kotodama библиотечки функций
- зафиксировать точный переходный граф в `Musubi.lock`
- восстановить исходные зависимости из окончательных криптографических значений обязательств архива SoraFS
- собрать и протестировать один пакет или рабочее пространство с несколькими пакетами
- просматривать, публиковать, удалять, поддерживать или создавать псевдонимы для пакетов через реестр в цепочке

## Названия пакетов {#package-names}

канонические селекторы пакетов используют:

```text
namespace/package
```

Точные идентификаторы релиза добавляют версию:

```text
namespace/package@version
```

Перед пространством имён не стоит ведущий `@`. Пространство имён является либо корнем пространства данных, таким как `universal`, либо пространством данных с доменной квалификацией, таким как `dex.universal`. Распределённый регистр блокчейна связывает это структурное пространство имён с одним стабильным домашним пространством данных до того, как пакет может быть зарегистрирован.

## технический манифест и Lockfile {#manifest-and-lockfile}

Пакет использует закрытую схему первого выпуска `Musubi.toml`. Технический манифест должен объявлять `manifest-version = 1`, Kotodama издание `"1"` и IVM ABI версия `1`; альтернативного технического манифеста или режима ABI нет.

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

Зависимости могут использовать точные версии, требования с кареткой или тильдой, подстановочные знаки, такие как `1.*`, и наборы компараторов, разделенные запятыми, такие как `>=1.0.0,<2.0.0`. Ключ таблицы зависимостей — это псевдоним локального родительского импорта; `package` всегда является каноническим селектором реестра.

`Musubi.lock` связывает граф с точно генезисно-полученным `NetworkId` и финализированным снимком реестра. Он фиксирует выбранные корни рабочих пространств и неизменные узлы релиза, включая выпуск, источник, интерфейс, архив, ABI и точные значения криптографических обязательств по зависимостям. Параллельные версии допустимы, когда это требуется разрешённым графом.

## Настроить Taira SoraFS Получение {#configure-taira-sorafs-fetching}

Taira является публичной тестовой сетью для этого рабочего процесса. Начните с конфигурации клиента Taira с включённой цепочкой и текущей закреплённой идентичностью сети, полученной из генезиса, затем добавьте приведённые ниже привязки аутентифицированного извлечения, специфичные для поставщика. Сброс Taira может изменить `NetworkId`; обновите его из подписанного профиля развертывания, вместо того чтобы выводить его из стабильной цепочки UUID. Материалы для подписи аккаунта и ключи оператора поставщика должны оставаться в программных файлах времени выполнения, доступных только владельцу.

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

Откройте для себя признанных провайдеров Taira из корневой сети публичного тестнета:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

Каталог провайдера предоставляет идентификаторы провайдера и рекламируемые API конечные точки. Получите соответствующее разрешение оператора от выбранного провайдера. Среда выполнения программного обеспечения использует этот ключ для запроса токенов ограниченного потока; токены не являются ни CLI аргументами, ни содержимым lockfile.

Не используйте Taira пин-код валидатора URL как `url`. Зарегистрированные валидаторы встроены SoraFS хранение отключено. Их `https://taira-validator-{1,2,3,4}.sora.org` API конечные точки принимают регистрацию PIN-кода, а архивные чтения используют выбранного разрешённого поставщика HTTPS происхождение.

## Локальный рабочий процесс {#local-workflow}

От корневого каталога рабочего пространства upstream Iroha создайте или войдите в каталог пакета и выполните Musubi через Cargo:

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

`fetch` разрешает финализированный граф реестра, обновляет `Musubi.lock`, когда это разрешено, и заполняет неизменяемый локальный кэш из аутентифицированных местоположений SoraFS. `check`, `build`, `test` и `package` выполняют те же проверки графа и кэша перед своей собственной работой.

Используйте `--locked`, чтобы отклонить любое изменение файла блокировки. Используйте `--offline` только тогда, когда индекс реестра и все необходимые архивы уже кэшированы. `--frozen` объединяет эти два ограничения. Промах при оффлайн-кэше приводит к сбою; Musubi никогда не записывает неразрешённый файл блокировки.

Источники зависимостей связываются путем переписывания квалифицированных технических вызовов, таких как `math::add()`, в детерминированные внутренние имена Kotodama. Техническая зависимость вызов неэкспортированной функции отклонен. Импортированные библиотеки предоставляют функции; локальные цели `[[contract]]` и `[[test]]` остаются явными целями пакета.

## Проверка и восстановление кэша {#cache-verification-and-repair}

Команды публичного кэша работают с неизменяемыми архивами, опубликованными в реестре:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` изолирует поврежденных доверенных потомков и заново извлекает точные архивы, когда это позволяет окончательная доказательная база поставщика. Обрезка специально настроена на закрытие при сбое для живых непустых изменений; используйте `--dry-run` для проверки классифицированных кандидатов.

## Упаковка и публикация {#packaging-and-publishing}

Проверьте чистый набор положительных файлов перед созданием архива, затем создайте канонический пакет:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` пишет `target/package/<namespace>-<name>-<version>.car`. CAR связывает канонический технический манифест пакета, технический манифест семантического релиза, точный замок проверки, исходное дерево, значение криптографического дайджеста интерфейса и значение криптографического обязательства архива SoraFS. В первой версии CLI нет отдельных команд `pack`, `--car-out`, `--sorafs-manifest-out` или `--source-plan-out`.

Публикация — это подписанный, возобновляемый сетевой рабочий процесс. Выбранный `client.toml` должен содержать необходимые привязки `[musubi.publication]`, а также учетную запись и конфигурацию сети Taira. Упакуйте ровно одного участника рабочей области:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Используйте `--detach`, чтобы вернуться после того, как журнал операций и граница seed-ingress станут долговечными. Продолжайте долговечную операцию с `publish --resume <operation-id> --config client.toml`. Более узкий путь `--recover <operation-id>` только реконструирует отсутствуют неизменяемые вспомогательные записи для безупречного журнала до входа. Публикации `--dry-run` или универсального публичного резервного загрузки нет; выполните `package --list` и `package` для локального предварительного контроля.

## Запросы реестра и жизненный цикл {#registry-queries-and-lifecycle}

Поиск и проверка окончательного реестра с той же конфигурацией клиента Taira:

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

Удаление исключает неизменяемый выпуск из новых разрешений, в то время как существующие точные блокировки остаются воспроизводимыми. Сначала прочитайте текущую ревизию удаления, затем отправьте мутацию сравнения и установки:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

Используйте `unyank` с тем же пакетом, версией и недавно прочитанной ревизией, чтобы обратить это состояние. Владение пакетом и роли мейнтейнера контролируют публикацию, отзыв, метаданные, и разрешения на расположение архива. Глобальные алиасы имеют собственную оценочную регистрацию, историю повторного назначения и ревизии сравнения и установки; они не являются ярлыками владения пакетом.

## Iroha Поверхности {#iroha-surfaces}

Musubi использует инструкции и запросы первой версии V1:

|Поверхность|Цель|
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `RegisterMusubiNamespaceBindingV1`                   |Привяжите пространство имён к его стабильному домашнему пространству данных.|
| `RegisterMusubiArchiveV1`                            |Зарегистрируйте неизменяемое аутентифицированное криптографическое значение обязательства исходного архива.|
| `AddMusubiArchiveLocationV1`                         |Добавьте или обновите проверенное местоположение архива SoraFS.|
| `PublishMusubiReleaseV1`                             |Запросите или обновите пакет и опубликуйте одну неизменяемую версию.|
| `SetMusubiReleaseYankV1`                             |Сравните и установите выдернутое состояние точного релиза.|
| `InviteMusubiPackageMaintainerV1`                    |Начните процесс явного приглашения роли пакета.|
| `RegisterMusubiAliasV1` / `RetargetMusubiAliasV1`    |Зарегистрируйте или перенастройте управляемый глобальный псевдоним.|
|`AssertMusubiReleaseDigestV1`|Утвердите точное неизменяемое значение криптографического контрольного хэша.|
| `FindMusubiExactPackageV1`                           |Прочитайте один конкретный пакет и его исправления.|
|`FindMusubiExactReleaseV1`                           |Прочитайте один точный снимок выпуска.|
| `FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Разрешить или перечислить окончательно утвержденные кандидаты на выпуск.|
| `FindMusubiArchiveLocationsV1`                       |Прочитайте окончательные архивные местоположения, поддерживаемые поставщиком.|
| `FindMusubiAliasV1` / `FindMusubiAliasHistoryV1`     |Прочитайте текущую цель псевдонима или её неизменяемую историю.|

Torii раскрывает семейство маршрутов приложения под `/v1/musubi/*`. Инструменты MCP используют текущие имена `iroha.musubi.queries.*` и `iroha.musubi.instructions.*`. См. [Torii API конечные точки](/ru/reference/torii-endpoints.md) и [ссылка на запрос](/ru/reference/queries.md) для более широкой карты API.
