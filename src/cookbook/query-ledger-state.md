# Query Ledger State

## Outcome

Read and project Taira JSON resources, then use typed Iroha queries with
filters, logical pagination, sorting, fetch sizes, and forward-only cursor
continuation. You will also avoid relying on selector projection before the
server evaluates the forwarded `--select` tuple.

## Prerequisites

- `curl`, `jq`, Node.js 24, and the current `iroha` CLI.
- Read-only Taira access.
- For signed typed-query examples, a client config for Taira or a generated
  local network.
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

This HTTP surface uses `limit` and `offset`. Treat an omitted or bounded
`total` as normal when the route uses a cheaper count mode.

### 2. Filter and batch a typed CLI query

The CLI serializes a typed iterable query and follows server continuation
cursors internally. Here the logical result is limited to one row, while
`--fetch-size 1` controls the maximum batch fetched per round trip.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Filtering happens before pagination. Use query-specific typed predicates; a
predicate for an account or asset cannot safely be reused for a domain.

### 3. Sort by a stable metadata key

Typed query sorting is lexicographic over one metadata key. Items without
that key follow the runtime's defined ordering, so use a key populated
consistently across the collection.

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

The checked-in CLI parses `--select` JSON and forwards the selector tuple,
but the current lightweight query DSL does not evaluate that selector on the
server. Do not build a projection contract around it yet. Use a typed SDK
projection only after the target runtime supports it, or project the validated
result client-side with `jq` or JavaScript as above.

### 4. Let the Rust iterator follow opaque cursors

`Pagination` bounds the logical result set. `FetchSize` controls each
server batch. The returned iterator transparently sends continuation
requests using the server-generated cursor.

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

A `ForwardCursor` is authority-bound, process-local, and forward-only.
Never parse it, synthesize it, share it between authorities, or persist it
as a portable resume token across Torii instances. If it expires, restart
the original query with a deliberate application-level checkpoint.

## Verify

The exact domain filter should return only `wonderland.universal`. Verify
the result rather than counting a successful CLI exit alone:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

For paginated application queries, also test that IDs do not repeat across
pages, the requested logical limit is never exceeded, and retrying after an
expired cursor restarts from a documented checkpoint.

## Troubleshooting

- A singular query does not accept iterable filter, sort, pagination, or
  fetch parameters. Use the corresponding list query when those controls
  are needed.
- `fetch_size` is a nonzero batch hint, not the total result limit. The
  current default is `100`, and the runtime rejects values above its
  maximum.
- An unknown, expired, or foreign cursor is intentionally not reusable.
  Restart the query; do not attempt to repair the opaque value.
- Metadata sorting is not general field sorting. If every item does not
  carry the selected key, document the missing-key order or choose another
  strategy.
- The CLI parses and forwards `--select`, but the current server does not
  evaluate the lightweight selector tuple. Apply client-side projection unless
  server-side selector support is verified for the deployed runtime.
- Broad unbounded queries increase peer work, client memory, and cursor
  lifetime risk. Set a logical limit and a fetch size appropriate to the
  consumer.
- Public JSON resource parameters and signed typed-query parameters are
  related but not interchangeable wire formats. Prefer the SDK or CLI for
  typed query envelopes.

## Source and related docs

- [Cursor-backed pagination integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Query builder and selector behavior at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Query parameters and cursor model at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [Queries](/blockchain/queries.md)
- [Query reference](/reference/queries.md)
- [JavaScript and TypeScript](/guide/tutorials/javascript.md)
