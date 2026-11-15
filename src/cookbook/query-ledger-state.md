# Query Ledger State

## Outcome

Read and project Taira JSON resources, then use Torii collection queries
from the CLI and the Rust SDK with filters, sorting, server-side projection,
page limits, and opaque `next_cursor` continuation. You will also keep
listings off signed typed queries, which do not filter, sort, or project
them.

## Prerequisites

- `curl`, `jq`, Node.js 24, and the current `iroha` CLI.
- Read-only Taira access.
- For the CLI examples, a client config for Taira or a generated local
  network.
- For the Rust example, a project pinned to the same Iroha source revision
  as the target network.

## Steps

### 1. Page through a public Taira resource

Resource routes are useful for dashboards and smoke checks. Ask for JSON,
bound every page, and project only the fields the application needs after
checking the response.

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

This HTTP surface pages with `limit` and an opaque `next_cursor`; send it
back unchanged as `cursor` until it is `null`. `total` appears only when you
request `include_total=true`, which costs a full scan.

### 2. Filter a collection with the CLI

The CLI sends the filter, projection, and page size to the collection
endpoint and prints one page, `{items, next_cursor}`. Add `--all` to follow
`next_cursor` until it is `null`.

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

Filtering happens before paging. Each collection accepts only its own
fields; an unknown field returns `invalid_filter` instead of matching
nothing.

### 3. Sort by a stable metadata key

Collection sort keys accept declared fields and `metadata.<key>`; prefix a
key with `-` for descending order. Rows without the key sort first in
ascending order and ties follow row identity, so use a key populated
consistently across the collection.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` is a server-side projection: `--select id,metadata` returns only
those fields, and an unknown field returns `invalid_select`. Signed typed
queries always return whole items, so project their results client-side with
`jq` or JavaScript as above.

### 4. Let the Rust iterator follow opaque cursors

`limit` sets the page size. The iterator returned by `list` requests the
next page with the server's `next_cursor` only after the current page is
consumed, and `take` bounds the logical result. Here `client` is an
`iroha::blocking::Client`.

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

A `next_cursor` is an opaque keyset position bound to its collection, path,
filter, and sort. Never parse or synthesize it, and do not reuse it with a
different filter or sort; Torii rejects that with `invalid_cursor`. Rows
inserted or removed between pages never make a later page repeat or skip
unrelated rows.

## Verify

The exact domain filter should return only `universal.universal`. Verify
the result rather than counting a successful CLI exit alone:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

For paginated application queries, also test that IDs do not repeat across
pages, the requested logical limit is never exceeded, and a rejected cursor
restarts from a documented checkpoint.

## Troubleshooting

- A singular query does not accept iterable filter, sort, pagination, or
  fetch parameters. Use the corresponding list query when those controls
  are needed.
- `limit` is the page size, not the total result: at least 1 and at most
  the node's `torii.app_api_max_list_limit` (default 500); Torii's default
  is 100. Follow `next_cursor`, `--all`, or the SDK iterator to read more.
- `invalid_cursor` means the cursor is malformed or belongs to a different
  collection, path, filter, or sort. Restart the query; do not attempt to
  repair the opaque value.
- A selective filter can return a short or empty page with a non-null
  `next_cursor`. Keep following it until it is `null`.
- `--filter` and the HTTP `filter` parameter take Torii's text grammar, such
  as `id = "universal.universal"` or `exists(metadata.tier)`. A JSON
  predicate object is not filter text and fails as an invalid `filter`.
- Broad unbounded queries increase peer work and client memory. Set a
  logical limit and a page size appropriate to the consumer.
- Signed `/v1/query` is not the listing API. It admits singular queries and
  a few unfiltered iterable starts, and refuses others, such as
  `FindDomains` or `FindAssetDefinitions`, with
  `signed_query_shape_not_admitted`. Collection endpoints, CLI `list`
  commands, and SDK collection readers share one filter, sort, and cursor
  grammar.

## Source and related docs

- [Torii collection query contract at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [Rust collection reads and cursor iterator at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [Signed query admission at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [Queries](/blockchain/queries.md)
- [Query reference](/reference/queries.md)
- [JavaScript and TypeScript](/guide/tutorials/javascript.md)
