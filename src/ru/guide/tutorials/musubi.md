---
translation_locale: ru
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama упаковки {#musubi-kotodama-packages}

Musubi - управляющий пакетами для исходных пакетов Kotodama. Он предоставляет разработчикам рабочий процесс, похожий на Cargo, для совместного использования совместимых функций Kotodama при сохранении идентичности пакета, связанной с именными пространствами SORA и Iroha вместо глобальной таблицы имен первого прихода.

Используйте Musubi, когда вам нужно:

- публиковать вновь используемые исходные библиотеки Kotodama
- точные переходные зависимости от источника в `Musubi.lock`
- восстановление источника зависимости от проверенных обязательств по архиву SoraFS
- подключить именное пространство пакета к псевдонимам контракта dapp в том же именном пространстве
- проверять, публиковать, извлекать пакеты или прозвища через реестр в цепочке;

## Названия пакетов {#package-names}

Использование канонических идентификаторов упаковки:

```text
namespace/package
```

Использование точных ссылок на выпуск:

```text
namespace/package@version
```

Перед пространством имен не существует лидера `@`. Разделитель `@` предназначен для задокумента.

Сегмент namespace соответствует суфиксу, используемому Kotodama дapp контрактными псевдонимами:

|Идентификатор упаковки|Форма связанного контракта под псевдонимом |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

Намеровые пространства имеют форму `<dataspace>` или `<domain>.<dataspace>`. Когда в пакете есть ссылка dapp, Musubi проверяет, использует ли каждый связанный контрактный псевдоним тот же Suffix namespace, что и на пакете.

## Проявление {#manifest}

Пакет начинается с `Musubi.toml`:

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

Зависимости могут использовать точные версии, требования к опеке, требования к тильде, дикие карты, такие как `1.*`, или сравнительные списки, такие как`>=1.0.0,<2.0.0`.

`Musubi.lock` записывает выбранный переходный график из реестра на цепочке. Каждый запертый узел сохраняет свой канонический пакет ref, выбранное требование, SoraFS манифест-дигест, хэш исходного архива, количество байтов, количества файлов, экспортируемые функции, детерминистический план исходных архивов и прозвища зависимостей. Краткие псевдонимы решаются до того, как они войдут в файл замка.

## Местный рабочий процесс {#local-workflow}

От корня рабочего пространства Iroha вверх по течению, запустить Musubi через Cargo:

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

Используйте `install --offline` для написания неразрешенного файла блокировки для зависимостей точных версий без запроса узла. Используйте `install --locked` в CI для отказа от устаревшего файла блокировок.

`build` соединяет запасные источники зависимости путем переписки вызовов, таких как `math::add()`, к детерминистским внутренним названиям функций Kotodama. Он отвергает вызовы к функциям, которые зависимость не экспортировала. Библиотеки Musubi v1 предназначены только для функций: источники зависимости, содержащие государственные декларации, триггеры, блоки kotoba, константы или другие нефункциональные элементы контракта, отклоняются.

## Доставка источника архивов {#fetching-source-archives}

Musubi может найти исчезающие источники зависимости при решении или позже через подкоманды кеша:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

При живых доставках шлюзов используются одна или более спецификаций поставщика шлюзов SoraFS:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

Файлы полезной нагрузки провайдера и провайдеры шлюзов являются взаимоисключающими для одной операции по доставке. Если отсутствует более одного заблокированного пакета, объедините каждого провайдера шлюзов с `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` или `manifest=<64-hex SoraFS manifest digest>`.

Ворота . `base-url` и `privacy-url` значения должны быть использованы `https://` По умолчанию. локальные тестовые шлюзы могут использовать `http://localhost`, `http://127.0.0.1`, или `http://[::1]` только с `--gateway-allow-insecure-localhost`. Токены потока являются учетными знаками для запуска и не записываются в `Musubi.lock`.

## Издательство {#publishing}

`pack` вычисляет детерминистический BLAKE3-256 исходный архив хэш плюс исходный байт и количество файлов. Когда `--car-out`, `--sorafs-manifest-out`, или `--source-plan-out` Это также создает детерминистическую SoraFS CAR полезная нагрузка, SoraFS манифестации, и Musubi план исходного архива из одного и того же набора исходных файлов.

Перед публикацией используйте сухой пробег:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

Без `--dry-run`, `publish` записывает дефолтные артефакты в `.musubi/dist/<namespace>/<name>/<version>/`, опционально загружает манифест и полезную нагрузку через Torii Это ... SoraFS конечный пункт накопительной установки с `--upload`, регистрирует генерируемые SoraFS Пин, и подает `PublishMusubiRelease` через конфигурированный Iroha Клиент.

Опубликованные публикации должны включать в себя:

- непустый архив канонического источника
- детерминистический план архива источника
- по меньшей мере одна экспортированная функция Kotodama
- записи о зависимости, которые не выбирают вытянутые выпуска
- dapp-ссылка, при наличии которой контрактные псевдонимы совпадают с именным пространством пакета;

## Вопросы по регистру и жизненный цикл {#registry-queries-and-lifecycle}

Поиск и проверка в регистре с помощью:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Янкинг скрывает выпуск от нового разрешения, но поддерживает воспроизводимость существующих файлов блокировки:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi избегает глобального заполнения имен, сделав `namespace/package` каноническим именем пакета. Публикация в пространство имен должна быть разрешена той же собственностью или моделью делегированных разрешений, используемой для этого пространства имен dapp Kotodama . Курированные глобальные короткие прозвища отделены от собственности пакета: `SetMusubiShortAlias` требует разрешения на `CanSetMusubiShortAlias`, а целевой пакет должен уже иметь по крайней мере один активный выпуск.

## Поверхности Iroha {#iroha-surfaces}

Musubi использует инструкции первого класса Iroha и запросы:

|Поверхность .|Цель .|
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |Публикуйте неизменный пакет. |
|`YankMusubiRelease` |Отметьте существующую выпускную запись как вытянутую.|
|`SetMusubiShortAlias` |Привязать выбранный глобальный короткий псевдоним к идентификатору пакета. |
|`AssertMusubiReleaseExists` |Требуется наличие конкретной пакетной версии. |
|`FindMusubiReleaseByRef` |Приведите выпуск по точной упаковке. |
|`FindMusubiPackageVersions` |Перечислить версии для идентификатора пакета. |
|`FindMusubiPackageReleases` |Перечислить резюме выпуска для идентификатора пакета. |
|`SearchMusubiPackages` |Поиск резюме пакета по пространству имен и тексту. |
|`FindMusubiShortAliasByName` |Раскройте выбранный короткий псевдоним.|

Torii раскрывает Musubi HTTP Семейство маршрутов `/v1/musubi/`. Относится к агенту MCP инструменты выявлены как `iroha.musubi.` псевдонимы. [Torii конечные точки](/ru/reference/torii-endpoints.md) и [ссылка на запрос](/ru/reference/queries.md) для более широкого API Карта.
