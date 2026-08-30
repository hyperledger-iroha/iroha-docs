---
translation_locale: ru
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: ca76923f5ae35b96c52a6a4c23c5d9e69549d1ca91d6d1507e7b9a1aee1f1676
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Вопрос о состоянии реестра {#query-ledger-state}

## Результат {#outcome}

Прочитайте и проецируйте ресурсы Taira JSON, а затем используйте запросы напечатанные на Iroha с помощью фильтров, логической pagination, сортировки, размеров загрузки и продолжения курсора только вперед. Вы также избежите полагаться на проекцию селектора до того, как сервер оценит переданный тупл `--select`.

## Предварительные условия {#prerequisites}

- `curl`, `jq`, Node.js 24, и текущий `iroha` CLI.
- Доступ только для чтения Taira.
- Для подписанных примеров запросов с типовым вводом, конфигурация клиента для Taira или генерируемой локальной сети.
- Для примера Rust проект, прикрепленный к той же редакции источника Iroha, что и целевая сеть.

## Шаги {#steps}

### 1. Перейти через публичный ресурс Taira {#_1-page-through-a-public-taira-resource}

Маршруты ресурсов полезны для панелей управления и проверки дыма. Запросите JSON, свяжите каждую страницу, и проецируйте только поля, необходимые приложению после проверки ответа.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id:asc' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'offset=0' \
  --data-urlencode 'count_mode=exact' \
  | jq '{total, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const limit = 5
const seen = new Set()

for (let offset = 0; ; offset += limit) {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id:asc',
    limit: String(limit),
    offset: String(offset),
    count_mode: 'exact',
  })

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok)
    throw new Error(`Taira returned HTTP ${response.status}`)

  const page = await response.json()
  for (const domain of page.items) {
    if (seen.has(domain.id)) throw new Error(`duplicate ${domain.id}`)
    seen.add(domain.id)
    console.log(domain.id)
  }
  if (page.items.length < limit || seen.size >= page.total) break
}
```

:::

На этой поверхности HTTP используется `limit` и `offset`. При использовании более дешевого режима подсчета маршрута выпущенный или ограниченный `total` обращайтесь как обычно.

### 2. Фильтровать и загружать запись CLI {#_2-filter-and-batch-a-typed-cli-query}

CLI сериализирует типовый итерационный запрос и следит за курсорами продолжения сервера внутренне. Здесь логический результат ограничивается одним строком, в то время как `--fetch-size 1` контролирует максимальную партию, полученную на одну поездку обратно.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Фильтрация происходит до pagination. Используйте запрос-специфические типовые предикаты; предикат для учетной записи или актива не может безопасно использоваться повторно для домена.

### 3. сортировка по стабильному клавишу метаданных {#_3-sort-by-a-stable-metadata-key}

Типовое сортирование запросов является лексикографическим на одном клавише метаданных. Предметы без этого ключа следуют определённому порядку времени запуска, поэтому используйте ключ, заполненный последовательно по всей коллекции.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger account list all \
  --verbose \
  --sort-by-metadata-key key \
  --order asc \
  --limit 10 \
  --offset 0 \
  --fetch-size 2 \
  | jq '[.[] | {id, metadata}]'
```

Зарегистрированный CLI анализирует `--select` JSON и пересылает тупл селектора, но текущий легкий запрос DSL не оценивает этот селектор на сервере. Используйте типовую проекцию SDK только после того, как целевое время выполнения поддерживает ее, или проецируйте проверенный результат клиентской стороны с помощью `jq` или JavaScript, как указано выше.

### 4. Пусть итератор Rust следует непрозрачным курсорам. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` ограничивает набор логических результатов. `FetchSize` контролирует каждую партию серверов. Возвращаемый итератор прозрачно отправляет запросы продолжения с помощью серверного курсора.

```rust
use std::num::NonZeroU64;

use iroha::data_model::{
    prelude::FindAssetsDefinitions,
    query::{
        builder::QueryBuilderExt as _,
        parameters::{FetchSize, Pagination},
    },
};

let definitions = client
    .query(FindAssetsDefinitions::new())
    .with_pagination(Pagination::new(NonZeroU64::new(25), 0))
    .with_fetch_size(FetchSize::new(NonZeroU64::new(5)))
    .execute_all()?;

for definition in definitions {
    println!("{} {}", definition.id(), definition.name());
}
```

`ForwardCursor` связан с полномочиями, локальным процессом и только вперед. Никогда не анализируйте его, не синтезируйте, не делитесь им между властями или не используйте его как портативный токен резюме на протяжении всех случаев Torii. Если он истекает, перезапустите оригинальный запрос с преднамеренным контрольным пунктом на уровне приложения.

## Проверка {#verify}

Точный доменный фильтр должен возвращаться только `wonderland.universal`. Проверьте результат вместо того, чтобы считать успешный CLI один выход:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Для страничных запросов приложений также проверьте, чтобы IDs не повторялся на страницах, требуемый логический лимит никогда не превышается, и после истечения срока действия курсора перезагружается с документального пункта контроля.

## Устранение неполадок {#troubleshooting}

- Сингулярный запрос не принимает повторяемые фильтры, сортировки, pagination или загрузки параметров. Используйте соответствующий запрос списка, когда эти элементы управления необходимы.
- `fetch_size` является не нулевой партией намек, а не общий результат предел. `100`, и время выполнения отклоняет значения выше его максимума.
- Неизвестный, истекший срок действия или иностранный курсор намеренно не может быть повторно использован. Возобновите запрос; не пытайтесь исправить непрозрачное значение.
- Сортирование метаданных не является общим сортировкой поля. Если на каждом пункте нет выбранного ключа, документируйте порядок отсутствующих ключей или выберите другую стратегию.
- CLI анализирует и передает `--select`, но текущий сервер не оценивает тупл легкого селектора. Применяйте проекцию клиентской стороны, если поддержка селектора сервера не подтверждена для развернутого времени выполнения.
- Широкие неограниченные запросы увеличивают работу сверстников, память клиента и риск пожизненного действия курсора.
- Общественность JSON Параметры ресурсов и подписанные параметры запроса, связанные, но не взаимозаменяемые форматы провода. SDK или CLI для напечатанных конвертов запросов.

## Источник и связанные с ним документы {#source-and-related-docs}

- [Тесты интеграции pagination с поддержкой курсора на закрепленном commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Поведение создателя запросов и селектора на финированном комитете](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Параметры запроса и модель курсора на закрепленном commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [Запросы](/ru/blockchain/queries.md)
- [Справка на запрос](/ru/reference/queries.md)
- [JavaScript и TypeScript](/ru/guide/tutorials/javascript.md)
