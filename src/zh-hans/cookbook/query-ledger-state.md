---
translation_locale: zh-hans
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 查询账本状态 {#query-ledger-state}

## 结果 {#outcome}

读取并投影 Taira JSON 资源，然后通过 CLI 和 Rust SDK 使用 Torii 集合查询，搭配过滤、排序、服务器端投影、分页上限，以及不透明的 `next_cursor` 续接。您还将避免用已签名的带类型查询来列出数据，因为这类查询不会对列表进行过滤、排序或投影。

## 预先条件 {#prerequisites}

- `curl`,`jq`, Node.js 24,以及电流 `iroha` CLI.
- 仅可读的 Taira 访问.
- 对于 CLI 示例，需要 Taira 或生成的本地网络的客户端配置。
- 在 Rust 例子中,一个项目与目标网络相同的 Iroha 来源修改.

## 步骤 {#steps}

### 1. 页面通过一个公共资源 Taira {#_1-page-through-a-public-taira-resource}

资源路线对于仪表板和烟雾检查是有用的.请 JSON,链接每个页面,并在检查响应后仅投影应用程序需要的字段.

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

这个 HTTP 接口以 `limit` 和不透明的 `next_cursor` 进行分页；请将其原封不动地作为 `cursor` 传回，直到它为 `null`。只有在您请求 `include_total=true` 时才会出现 `total`，而这需要付出全量扫描的代价。

### 2. 使用 CLI 过滤集合 {#_2-filter-a-collection-with-the-cli}

CLI 会将过滤条件、投影和分页大小发送到集合端点，并打印一页 `{items, next_cursor}`。加上 `--all` 即可持续跟随 `next_cursor`，直到它为 `null`。

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

过滤发生在分页之前。每个集合只接受自己的字段；未知的字段会返回 `invalid_filter`，而不是不匹配任何内容。

### 3. 根据稳定的元数据密钥进行排序 {#_3-sort-by-a-stable-metadata-key}

集合排序键接受已声明的字段和 `metadata.<key>`；在键前加上 `-` 表示降序排序。在升序排序中，没有该键的行会排在最前面，且值相同时按行标识排序，因此请使用在整个集合中一致填充的键。

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` 是服务器端投影：`--select id,metadata` 只返回这些字段，而未知的字段会返回 `invalid_select`。已签名的带类型查询总是返回完整的条目，因此请如上所示，以 `jq` 或 JavaScript 在客户端投影其结果。

### 4. 让 Rust 回复器遵循不透明的线索. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` 设置分页大小。`list` 返回的迭代器只会在当前页面被读取完毕后，才使用服务器的 `next_cursor` 请求下一页，而 `take` 会限制逻辑结果的数量。这里的 `client` 是一个 `iroha::blocking::Client`。

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` 是一个不透明的键集位置，与其集合、路径、过滤条件和排序绑定。切勿解析或自行合成它，也不要搭配不同的过滤条件或排序重复使用它；Torii 会以 `invalid_cursor` 拒绝这种情况。在页与页之间插入或移除的行，绝不会让后续页面重复或跳过无关的行。

## 验证 {#verify}

确切域名过滤器应该只返回 `universal.universal`. 验证结果,而不是单独计算成功的 CLI 出口:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

对于分页的应用程序查询，还要测试 ID 不会跨页重复、所请求的逻辑上限从未被超过，以及被拒绝的游标会从有记录的检查点重新开始。

## 解决问题 {#troubleshooting}

- 一个单一查询不接受可重复过滤器,排序,页面化或搜索参数.在需要这些控制时使用相应的列表查询.
- `limit` 是分页大小，而不是结果总数：最小为 1，最大为节点的 `torii.app_api_max_list_limit`（默认 500）；Torii 的默认值是 100。若要读取更多，请跟随 `next_cursor`、使用 `--all` 或 SDK 迭代器。
- `invalid_cursor` 表示游标格式错误，或属于不同的集合、路径、过滤条件或排序。请重新开始查询；不要尝试修复这个不透明的值。
- 选择性高的过滤条件可能返回较短或空白的页面，并附带非空的 `next_cursor`。请持续跟随它，直到它为 `null`。
- `--filter` 和 HTTP `filter` 参数采用 Torii 的文本语法，例如 `id = "universal.universal"` 或 `exists(metadata.tier)`。JSON 谓词对象不是过滤文本，会以无效的 `filter` 失败。
- 范围广且无上限的查询会增加对等节点的工作量和客户端内存用量。请设置适合使用方的逻辑上限和分页大小。
- 已签名的 `/v1/query` 不是列表 API。它只接受单一查询和少数不带过滤的可迭代查询起点，并以 `signed_query_shape_not_admitted` 拒绝其他查询，例如 `FindDomains` 或 `FindAssetDefinitions`。集合端点、CLI `list` 命令和 SDK 集合读取器共用同一套过滤、排序和游标语法。

## 来源及相关文件 {#source-and-related-docs}

- [固定提交中的 Torii 集合查询规范](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [固定提交中的 Rust 集合读取与游标迭代器](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [固定提交中的已签名查询准入规则](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [查询](/zh-hans/blockchain/queries.md)
- [查询参考](/zh-hans/reference/queries.md)
- [JavaScript 和 TypeScript](/zh-hans/guide/tutorials/javascript.md)
