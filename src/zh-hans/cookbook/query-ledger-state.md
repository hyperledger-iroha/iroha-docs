---
translation_locale: zh-hans
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: ca76923f5ae35b96c52a6a4c23c5d9e69549d1ca91d6d1507e7b9a1aee1f1676
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 查询账本状态 {#query-ledger-state}

## 结果 {#outcome}

阅读和投影 Taira JSON 资源,然后使用编写的 Iroha 查询以过器,逻辑页面化,排序,搜索尺寸和仅向前传导线程延续.您还将避免在服务器评估转发的`--select`tuple之前依靠选择器投影.

## 预先条件 {#prerequisites}

- `curl`,`jq`, Node.js 24,以及电流 `iroha` CLI.
- 仅可读的 Taira 访问.
- 在签署的输入查询示例中,为 Taira 或生成的本地网络设置客户端.
- 在 Rust 例子中,一个项目与目标网络相同的 Iroha 来源修改.

## 步骤 {#steps}

### 1. 页面通过一个公共资源 Taira {#_1-page-through-a-public-taira-resource}

资源路线对于仪表板和烟雾检查是有用的.请 JSON,链接每个页面,并在检查响应后仅投影应用程序需要的字段.

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

这一 HTTP 表面使用`limit`和`offset`.当路线采用更便宜的计数模式时,将遗漏或局限的 `total`视为正常的.

### 2. 过和批量输入 CLI 查询. {#_2-filter-and-batch-a-typed-cli-query}

CLI 将输入的可重复查询串行化,并内部跟随服务器延续线索.在这里逻辑结果仅限于一个行,而 `--fetch-size 1`则控制每次回路检索的最大批量.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

过发生在页面化之前.使用查询特定类型的预言;一个帐户或资产的预言不能安全地重复用于域名.

### 3. 根据稳定的元数据密钥进行排序 {#_3-sort-by-a-stable-metadata-key}

类型查询排序是对一个元数据密钥进行词汇化.没有该密钥的项目遵循运行时间的定义顺序,因此使用在整个集合中一致填充的密钥.

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

已注册的 CLI 解析`--select` JSON 并转发选择器tuple,但当前的轻量级查询 DSL 不评估服务器上的选择器.尚未围绕它构建投影合同.仅在目标运行时间支持后使用输入的 SDK 投影,或者用上述 `jq`或 JavaScript 来投影验证的结果客户端.

### 4. 让 Rust 回复器遵循不透明的线索. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination`限制了逻辑结果集. `FetchSize`控制每个服务器批量.返回的代器通过服务器生成的线索器透明地发送延续请求.

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

一个 `ForwardCursor` 是受权威约束的,过程本地,只能向前进行分析.永远不要解析它,合成它,在当局之间分享它,或者在 Torii 实例中保留它作为一个便携式简历代币.如果它过期,请重新启动原始查询,使用了故意的应用级检查点.

## 验证 {#verify}

确切域名过器应该只返回 `wonderland.universal`. 验证结果,而不是单独计算成功的 CLI 出口:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

对于页面化应用查询,也检验 IDs 不会在不同页面中重复,要求的逻辑限制从来没有超过,并在过期后重新尝试缓冲器从文档化检查点开始.

## 解决问题 {#troubleshooting}

- 一个单一查询不接受可重复过器,排序,页面化或搜索参数.在需要这些控制时使用相应的列表查询.
- `fetch_size`是一个非零批量暗示,而不是总结果限制.当前默认是`100`,运行时间拒绝超过其最大值的值.
- 一个未知,过期或外国的缓冲器是故意无法重复使用的.重新启动查询;不要试图修复不透明值.
- 大数据分类不是一般的场地分类.如果每个项目都没有所选的关键,请记录缺失关键顺序或选择另一个策略.
- CLI 解析和转发`--select`,但当前的服务器不评估轻量级选择器.除非对部署的运行时间进行验证,否则应应用客户端投影.
- 大范围的无限查询增加了同行工作,客户端内存和线索终身风险. 设定一个合乎消费者的逻辑限制和搜索量.
- 公共 JSON 资源参数和签署的输入查询参数是相关的,但不是可互换的电缆格式.对于输入查詢封,更喜欢 SDK 或 CLI.

## 来源及相关文件 {#source-and-related-docs}

- [在固定的 commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)中支持 cursor 的页面化集成测试
- [查询构建者和选择者的行为在固定提交中](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [在固定 commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs) 中查询参数和线程模型
- [查询](/zh-hans/blockchain/queries.md)
- [查询参考](/zh-hans/reference/queries.md)
- [JavaScript 和 TypeScript](/zh-hans/guide/tutorials/javascript.md)
