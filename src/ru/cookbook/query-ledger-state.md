---
translation_locale: ru
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Запрос состояния распределенного реестра блокчейна {#query-ledger-state}

## Результат {#outcome}

Чтение и проекция ресурсов Taira JSON, затем использование типизированных запросов Iroha с фильтрами, логической пагинацией, сортировкой, размерами выборки и продолжением с курсором только вперед. Вы также будете избегать зависимости от проекции селектора до того, как сервер оценит переданную кортеж `--select`.

## Предварительные требования {#prerequisites}

- `curl`, `jq`, Node.js 24 и текущий `iroha` CLI.
- Доступ только для чтения Taira.
- Для примеров подписанных типизированных запросов, конфигурация клиента для Taira или сгенерированной локальной сети.
- Для примера Rust, проект закреплён за той же исходной ревизией Iroha, что и целевая сеть.

## Шаги {#steps}

### 1. Просмотрите публичный Taira ресурс {#_1-page-through-a-public-taira-resource}

Маршруты ресурсов полезны для панелей управления и первичных проверок. Запрашивайте JSON, привязывая на каждой странице, и выводите только те поля, которые нужны приложению после проверки ответа.

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

Эта поверхность HTTP использует `limit` и `offset`. Рассматривайте пропущенный или ограниченный `total` как нормальный, когда маршрут использует более дешевый режим подсчета.

### 2. Отфильтровать и объединить в партии типизированный запрос CLI {#_2-filter-and-batch-a-typed-cli-query}

CLI сериализует типизированный итерируемый запрос и внутри использует курсоры продолжения на сервере. Здесь логический результат ограничен одной строкой, в то время как `--fetch-size 1` контролирует максимальный объем пакета, получаемого за один обход.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Фильтрация происходит до разбиения на страницы. Используйте предикаты с типами, специфичными для запроса; предикат для аккаунта или актива нельзя безопасно использовать повторно для домена.

### 3. Сортировать по стабильному ключу метаданных {#_3-sort-by-a-stable-metadata-key}

Сортировка по введённому запросу выполняется лексикографически по одному ключу метаданных. Элементы без этого ключа следуют порядку, определённому средой выполнения программного обеспечения, поэтому используйте ключ, который заполнен последовательно во всей коллекции.

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

Зарегистрированный CLI анализирует `--select` JSON и переправляет кортеж селектора, но текущий облегчённый запрос DSL не выполняет оценку этого селектора на сервере. Пока не создавайте вокруг него контракт проекции. Используйте типизированную проекцию SDK только после того, как среда выполнения целевого программного обеспечения её поддерживает, или создавайте проверенный результат на стороне клиента с помощью `jq` или JavaScript, как указано выше.

### 4. Позвольте итератору Rust следовать за непрозрачными курсорами {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` ограничивает логический результат. `FetchSize` управляет каждой серверной партией. Возвращаемый итератор прозрачно отправляет запросы на продолжение, используя курсор, сгенерированный сервером.

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

А `ForwardCursor` привязан к авторизации, локален для процесса и только для пересылки. Никогда не анализируйте его, не синтезируйте, не делитесь им между субъектами авторизации и не сохраняйте его в качестве переносимого токена резюме между экземплярами Torii. Если он истекает, перезапустите исходный запрос с осознанной контрольной точкой на уровне приложения.

## Проверить {#verify}

Точный фильтр домена должен возвращать только `wonderland.universal`. Проверьте результат, а не только успешный выход CLI:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Для запросов к приложениям с пагинацией также проверьте, что идентификаторы не повторяются на разных страницах, запрошенный логический лимит никогда не превышается, а повторная попытка после истечения срока действия курсора начинается с задокументированной контрольной точки.

## Устранение неполадок {#troubleshooting}

- Одиночный запрос не принимает итерируемые параметры фильтра, сортировки, постраничного отображения или выборки. Используйте соответствующий список запросов, когда необходимы эти элементы управления.
- `fetch_size` является подсказкой для ненулевой партии, а не пределом общего результата. Текущее значение по умолчанию — `100`, и время выполнения программного обеспечения отклоняет значения выше его максимума.
- Неизвестный, истёкший или внешний курсор специально не предназначен для повторного использования. Перезапустите запрос; не пытайтесь исправить непрозрачное значение.
- Сортировка метаданных не является общей сортировкой по полям. Если каждый элемент не содержит выбранный ключ, зафиксируйте порядок отсутствующих ключей или выберите другую стратегию.
- CLI анализирует и пересылает `--select`, но текущий сервер не оценивает легковесный кортеж селектора. Применяйте проекцию на стороне клиента, если поддержка селектора на стороне сервера не подтверждена для развернутого программного окружения.
- Широкие неограниченные запросы увеличивают нагрузку на сетевых участников, используют больше памяти клиента и повышают риск длительного существования курсора. Установите логическое ограничение и размер выборки, соответствующий потребителю.
- Публичные параметры ресурса JSON и подписанные параметры типизированного запроса связаны, но не являются взаимозаменяемыми форматами сериализации. Предпочитайте SDK или CLI для контейнеров данных типизированного запроса.

## Исходные и сопутствующие документы {#source-and-related-docs}

- [Интеграционные тесты постраничной навигации с использованием курсора на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Поведение конструктора запросов и селектора при закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Параметры запроса и модель курсора на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [Запросы](/ru/blockchain/queries.md)
- [Справка по запросу](/ru/reference/queries.md)
- [JavaScript и TypeScript](/ru/guide/tutorials/javascript.md)
