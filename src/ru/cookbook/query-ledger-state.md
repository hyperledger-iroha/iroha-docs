---
translation_locale: ru
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Запрос состояния распределенного реестра блокчейна {#query-ledger-state}

## Результат {#outcome}

Читайте и проецируйте ресурсы Taira JSON, затем используйте запросы к коллекциям Torii из CLI и Rust SDK с фильтрами, сортировкой, проекцией на стороне сервера, ограничениями размера страницы и продолжением через непрозрачный `next_cursor`. Вы также не будете получать списки через подписанные типизированные запросы, которые их не фильтруют, не сортируют и не проецируют.

## Предварительные требования {#prerequisites}

- `curl`, `jq`, Node.js 24 и текущий `iroha` CLI.
- Доступ только для чтения Taira.
- Для примеров CLI — конфигурация клиента для Taira или сгенерированной локальной сети.
- Для примера Rust, проект закреплён за той же исходной ревизией Iroha, что и целевая сеть.

## Шаги {#steps}

### 1. Просмотрите публичный Taira ресурс {#_1-page-through-a-public-taira-resource}

Маршруты ресурсов полезны для панелей управления и первичных проверок. Запрашивайте JSON, привязывая на каждой странице, и выводите только те поля, которые нужны приложению после проверки ответа.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'include_total=true' \
  | jq '{total, next_cursor, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const seen = new Set()
let cursor = null

do {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id',
    limit: '5',
    ...(cursor ? { cursor } : {}),
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
  cursor = page.next_cursor
} while (cursor)
```

:::

Эта поверхность HTTP разбивает результаты на страницы с помощью `limit` и непрозрачного `next_cursor`; отправляйте его обратно без изменений как `cursor`, пока он не станет `null`. `total` появляется только при запросе `include_total=true`, что требует полного сканирования.

### 2. Отфильтруйте коллекцию с помощью CLI {#_2-filter-a-collection-with-the-cli}

CLI отправляет фильтр, проекцию и размер страницы в конечную точку коллекции и выводит одну страницу, `{items, next_cursor}`. Добавьте `--all`, чтобы следовать `next_cursor`, пока он не станет `null`.

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

Фильтрация происходит до разбиения на страницы. Каждая коллекция принимает только свои собственные поля; неизвестное поле возвращает `invalid_filter`, а не пустой результат.

### 3. Сортировать по стабильному ключу метаданных {#_3-sort-by-a-stable-metadata-key}

Ключи сортировки коллекций принимают объявленные поля и `metadata.<key>`; добавьте к ключу префикс `-` для сортировки по убыванию. Строки без ключа идут первыми при сортировке по возрастанию, а при равенстве порядок определяется идентичностью строки, поэтому используйте ключ, который заполнен последовательно во всей коллекции.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` — это проекция на стороне сервера: `--select id,metadata` возвращает только эти поля, а неизвестное поле возвращает `invalid_select`. Подписанные типизированные запросы всегда возвращают элементы целиком, поэтому проецируйте их результаты на стороне клиента с помощью `jq` или JavaScript, как указано выше.

### 4. Позвольте итератору Rust следовать за непрозрачными курсорами {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` задаёт размер страницы. Итератор, возвращаемый `list`, запрашивает следующую страницу с серверным `next_cursor` только после того, как текущая страница прочитана, а `take` ограничивает логический результат. Здесь `client` — это `iroha::blocking::Client`.

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` — это непрозрачная позиция в наборе ключей, привязанная к своей коллекции, пути, фильтру и сортировке. Никогда не анализируйте и не синтезируйте его и не используйте повторно с другим фильтром или сортировкой; Torii отклоняет такое использование с `invalid_cursor`. Строки, вставленные или удалённые между страницами, никогда не приводят к тому, что последующая страница повторяет или пропускает несвязанные строки.

## Проверить {#verify}

Точный фильтр домена должен возвращать только `universal.universal`. Проверьте результат, а не только успешный выход CLI:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

Для запросов к приложениям с пагинацией также проверьте, что идентификаторы не повторяются на разных страницах, запрошенный логический лимит никогда не превышается, а отклонённый курсор приводит к перезапуску с задокументированной контрольной точки.

## Устранение неполадок {#troubleshooting}

- Одиночный запрос не принимает итерируемые параметры фильтра, сортировки, постраничного отображения или выборки. Используйте соответствующий список запросов, когда необходимы эти элементы управления.
- `limit` — это размер страницы, а не общий результат: не меньше 1 и не больше `torii.app_api_max_list_limit` узла (по умолчанию 500); значение по умолчанию в Torii — 100. Чтобы прочитать больше, следуйте `next_cursor`, `--all` или итератору SDK.
- `invalid_cursor` означает, что курсор имеет неверный формат или относится к другой коллекции, пути, фильтру или сортировке. Перезапустите запрос; не пытайтесь исправить непрозрачное значение.
- Избирательный фильтр может вернуть короткую или пустую страницу с ненулевым `next_cursor`. Продолжайте следовать ему, пока он не станет `null`.
- `--filter` и параметр HTTP `filter` используют текстовую грамматику Torii, например `id = "universal.universal"` или `exists(metadata.tier)`. Объект предиката JSON не является текстом фильтра и отклоняется как недопустимый `filter`.
- Широкие неограниченные запросы увеличивают нагрузку на сетевых участников и потребление памяти клиента. Установите логическое ограничение и размер страницы, соответствующие потребителю.
- Подписанный `/v1/query` не является API для получения списков. Он допускает единичные запросы и несколько нефильтрованных итерируемых запусков, а остальные, например `FindDomains` или `FindAssetDefinitions`, отклоняет с `signed_query_shape_not_admitted`. Конечные точки коллекций, команды CLI `list` и читатели коллекций SDK используют общую грамматику фильтров, сортировки и курсоров.

## Исходные и сопутствующие документы {#source-and-related-docs}

- [Контракт запросов к коллекциям Torii на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [Чтение коллекций и итератор курсора Rust на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [Допуск подписанных запросов на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [Запросы](/ru/blockchain/queries.md)
- [Справка по запросу](/ru/reference/queries.md)
- [JavaScript и TypeScript](/ru/guide/tutorials/javascript.md)
