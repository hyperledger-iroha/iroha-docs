---
translation_locale: zh-hant
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: a81f6cc04befb0b92a0a01c2cb3c1ecbbc631ce1f2a923cb046241c295db7806
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 查詢賬本狀態 {#query-ledger-state}

## 結果 {#outcome}

閱讀和投影 Taira JSON 資源,然後使用編寫的 Iroha 查詢以過器,邏輯頁面化,排序,搜索尺寸和僅向前傳導線程延續.您還將避免在服務器評估轉發的`--select`tuple之前依靠選擇器投影.

## 預先條件 {#prerequisites}

- `curl`,`jq`, Node.js 24,以及電流 `iroha` CLI.
- 僅可讀的 Taira 訪問.
- 在簽署的輸入查詢示例中,爲 Taira 或生成的本地網絡設置客戶端.
- 在 Rust 例子中,一個項目與目標網絡相同的 Iroha 來源修改.

## 步驟 {#steps}

### 1. 頁面通過一個公共資源 Taira {#_1-page-through-a-public-taira-resource}

資源路線對於儀表板和煙霧檢查是有用的.請 JSON,鏈接每個頁面,並在檢查響應後僅投影應用程序需要的字段.

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

這一 HTTP 表面使用`limit`和`offset`.當路線採用更便宜的計數模式時,將遺漏或侷限的 `total`視爲正常的.

### 2. 過和批量輸入 CLI 查詢. {#_2-filter-and-batch-a-typed-cli-query}

CLI 將輸入的可重複查詢串行化,並內部跟隨服務器延續線索.在這裏邏輯結果僅限於一個行,而 `--fetch-size 1`則控制每次迴路檢索的最大批量.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

過發生在頁面化之前.使用查詢特定類型的預言;一個帳戶或資產的預言不能安全地重複用於域名.

### 3. 根據穩定的元數據密鑰進行排序 {#_3-sort-by-a-stable-metadata-key}

類型查詢排序是對一個元數據密鑰進行詞彙化.沒有該密鑰的項目遵循運行時間的定義順序,因此使用在整個集合中一致填充的密鑰.

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

已註冊的 CLI 解析`--select` JSON 並轉發選擇器tuple,但當前的輕量級查詢 DSL 不評估服務器上的選擇器.尚未圍繞它構建投影合同.僅在目標運行時間支持後使用輸入的 SDK 投影,或者用上述 `jq`或 JavaScript 來投影驗證的結果客戶端.

### 4. 讓 Rust 回覆器遵循不透明的線索. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination`限制了邏輯結果集. `FetchSize`控制每個服務器批量.返回的代器通過服務器生成的線索器透明地發送延續請求.

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

一個 `ForwardCursor` 是受權威約束的,過程本地,只能向前進行分析.永遠不要解析它,合成它,在當局之間分享它,或者在 Torii 實例中保留它作爲一個便攜式簡歷代幣.如果它過期,請重新啓動原始查詢,使用了故意的應用級檢查點.

## 驗證 {#verify}

確切域名過器應該只返回 `wonderland.universal`. 驗證結果,而不是單獨計算成功的 CLI 出口:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

對於頁面化應用查詢,也檢驗 IDs 不會在不同頁面中重複,要求的邏輯限制從來沒有超過,並在過期後重新嘗試緩衝器從文檔化檢查點開始.

## 解決問題 {#troubleshooting}

- 一個單一查詢不接受可重複過器,排序,頁面化或搜索參數.在需要這些控制時使用相應的列表查詢.
- `fetch_size`是一個非零批量暗示,而不是總結果限制.當前默認是`100`,運行時間拒絕超過其最大值的值.
- 一個未知,過期或外國的緩衝器是故意無法重複使用的.重新啓動查詢;不要試圖修復不透明值.
- 大數據分類不是一般的場地分類.如果每個項目都沒有所選的關鍵,請記錄缺失關鍵順序或選擇另一個策略.
- CLI 解析和轉發`--select`,但當前的服務器不評估輕量級選擇器.除非對部署的運行時間進行驗證,否則應應用客戶端投影.
- 大範圍的無限查詢增加了同行工作,客戶端內存和線索終身風險. 設定一個合乎消費者的邏輯限制和搜索量.
- 公共 JSON 資源參數和簽署的輸入查詢參數是相關的,但不是可互換的電纜格式.對於輸入查詢封,更喜歡 SDK 或 CLI.

## 來源及相關文件 {#source-and-related-docs}

- [在固定的 commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/pagination.rs)中支持 cursor 的頁面化集成測試
- [查詢構建者和選擇者的行爲在固定提交中](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/query/builder/mod.rs)
- [在固定 commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/query/parameters.rs) 中查詢參數和線程模型
- [查詢](/zh-hant/blockchain/queries.md)
- [查詢參考](/zh-hant/reference/queries.md)
- [JavaScript 和 TypeScript](/zh-hant/guide/tutorials/javascript.md)
