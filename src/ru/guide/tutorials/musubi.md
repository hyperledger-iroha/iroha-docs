---
translation_locale: ru
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama Пакеты {#musubi-kotodama-packages}

Musubi является управляющим пакетом для Kotodama исходные пакеты.
разработчики Cargo-подобный рабочий процесс для совместного Kotodama функции
при этом сохранить идентификацию упаковки, связанной с SORA и Iroha пространства имен вместо
глобальная таблица имен первых прибывших.

Использование Musubi когда вам нужно:

- публиковать вновь используемые Kotodama источниковые библиотеки
- Пин точное переходное зависимость источника в `Musubi.lock`
- восстановить источник зависимости из проверенного SoraFS архивные обязательства
- подключить пространство имен пакетов к дapp контрактные прозвища в том же
  пространство названий
- проверять, публиковать, вытягивать или использовать псевдопакеты через реестр в цепочке

## Наименования пакетов {#package-names}

Использование канонических идентификаторов упаковки:

```text
namespace/package
```

Использование точных ссылок на выпуск:

```text
namespace/package@version
```

Нет лидера . `@` Имеется в виду, что `@` отделитель зарезервирован
для последового варианта.

Сегмент пространства имен соответствует последому, используемому Kotodama контракт Dapp
прозвища:

| Идентификатор упаковки                | Форма связанных контрактов |
| ------------------------- | ---------------------------- |
| `universal/math`          | `router::universal`          |
| `dex.universal/swap-core` | `router::dex.universal`      |

Именные пространства имеют либо `<dataspace>` или `<domain>.<dataspace>` Формы.
упаковка имеет ссылку Dapp, Musubi проверяет, что каждый связанный контракт под названием
использует тот же суфикс пространства имен, что и пакет.

## Проявление {#manifest}

Пакет начинается с: `Musubi.toml`:

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

Зависимости могут использовать точные версии, требования к уходу, тильде
требования, дикие карты, такие как `1.*`, или сравнительные списки, такие как
`>=1.0.0,<2.0.0`.

`Musubi.lock` записывает выбранный переходный график из цепочки
Каждый запертый узел сохраняет свой канонический пакет реф, выбранный
требование, SoraFS Манифест, исходный архив хэш, количество байтов, файл
учет, экспортируемые функции, детерминистический план архива источника и
Краткие псевдонимы решаются до того, как они входят в
Замок.

## Местный рабочий процесс {#local-workflow}

Из-за потока Iroha Корень рабочего пространства, запуск Musubi через груз:

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

Использование `install --offline` Написать неразрешенный файл замка для версии
зависимости без запроса узла. Используйте `install --locked` в CI к
отклонить устаревший файл замка.

`build` ссылки на запасные источники зависимости путем переписки звонков, таких как
`math::add()` к детерминистической внутренней Kotodama названия функций.
призывы к функциям, которые зависимость не экспортировала. Musubi v1 библиотеки
являются исключительно функциональными: источники зависимости, содержащие государственные декларации;
триггеры, блоки котоба, константы или другие нефункциональные контрактные элементы
отклоняются.

## Доставка источника архивов {#fetching-source-archives}

Musubi может найти отсутствующие источники зависимости при решении или позже
через подкоманды кеша:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

Живые доставки через ворота используют один или несколько SoraFS спецификации поставщика шлюзов:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

Поставщики файлов полезной нагрузки и поставщики шлюзов являются взаимоисключающими для одного
В случае отсутствия более одного заблокированного пакета, проверьте каждый
поставщик шлюзов с `package=<dependency-alias>`,
`package=<namespace/package@version>`, `package=<namespace/package>`, или
`manifest=<64-hex SoraFS manifest digest>`.

Ворота `base-url` и `privacy-url` значения должны быть использованы `https://` по умолчанию.
Местные тестовые шлюзы могут использоваться `http://localhost`, `http://127.0.0.1`, или
`http://[::1]` только с `--gateway-allow-insecure-localhost`. Поток
токены являются учетными знаками для запуска и не записываются в `Musubi.lock`.

## Издательство {#publishing}

`pack` вычисляет детерминистический BLAKE3-256 исходный архив хэш плюс
исходный байт и количество файлов. `--car-out`, `--sorafs-manifest-out`, или
`--source-plan-out` Это также создает детерминистическую SoraFS
CAR полезная нагрузка, SoraFS явный, и Musubi исходный архив план из того же
исходный файл.

Перед публикацией используйте сухой пробег:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

Без `--dry-run`, `publish` записывает дефолтные артефакты под
`.musubi/dist/<namespace>/<name>/<version>/`, выбирательно загружает
манифест и полезный груз через Torii Я ... SoraFS конечный пункт накопительной установки с
`--upload`, регистрирует генерируемые SoraFS Пин, и подает
`PublishMusubiRelease` через конфигурированный Iroha Клиент.

Опубликованные издания должны включать:

- непустой архив канонического источника
- детерминистический план архива источника
- не менее одного экспортированного Kotodama функция
- записи о зависимости, которые не выбирают вытянутые релизы
- dapp-ссылка, если она присутствует, контрактные прозвища которой соответствуют пакету
  пространство названий

## Вопросы по регистру и жизненный цикл {#registry-queries-and-lifecycle}

Поиск и проверка реестра с помощью:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Янкинг скрывает выпуск от новой резолюции, но держит существующие файлы замков
воспроизводимые:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi предотвращает глобальное название оккупации, делая `namespace/package` в)
Каноническое название пакета.
тот же собственность или модель делегированного разрешения, используемая для этого Kotodama
dapp namespace. Курированные глобальные короткие прозвища отделены от пакета
собственность: `SetMusubiShortAlias` требует `CanSetMusubiShortAlias`
разрешение, и целевой пакет должен уже иметь по крайней мере один активный
Выпустить.

## Iroha Поверхности {#iroha-surfaces}

Musubi используется в первом классе Iroha инструкции и запросы:

| Поверхность                      | Цель                                            |
| ---------------------------- | -------------------------------------------------- |
| `PublishMusubiRelease`       | Публикуйте неизменную версию.              |
| `YankMusubiRelease`          | Отметьте существующий выпуск как оттянутый.                |
| `SetMusubiShortAlias`        | Привязать выбранный глобальный короткий псевдоним к идентификатору пакета. |
| `AssertMusubiReleaseExists`  | Требуется наличие конкретной пакетной версии.       |
| `FindMusubiReleaseByRef`     | Приведите выпуск по точной упаковке.        |
| `FindMusubiPackageVersions`  | Перечисли версии идентификатора пакета.                    |
| `FindMusubiPackageReleases`  | Перечислить резюме выпуска для идентификатора упаковки.           |
| `SearchMusubiPackages`       | Поиск резюме пакетов по пространству имен и тексту.    |
| `FindMusubiShortAliasByName` | Разрешите выбранное короткое псевдоним.                     |

Torii разоблачает Musubi HTTP Семья маршрута `/v1/musubi/*`.
Относится к агенту MCP инструменты выявлены как `iroha.musubi.*` Простите.
[Torii конечные точки](/ru/reference/torii-endpoints.md) и
[ссылка на запрос](/ru/reference/queries.md) для более широкого API Карта.
