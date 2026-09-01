---
translation_locale: zh-hant
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 查詢賬本狀態 {#query-ledger-state}

## 結果 {#outcome}

閱讀和投影 Taira JSON 資源,然後使用編寫的 Iroha 查詢以過濾器,邏輯頁面化,排序,搜尋尺寸和僅向前傳導執行緒延續.您還將避免在伺服器評估轉發的`--select`tuple之前依靠選擇器投影.

## 預先條件 {#prerequisites}

- `curl`,`jq`, Node.js 24,以及電流 `iroha` CLI.
- 僅可讀的 Taira 訪問.
- 在簽署的輸入查詢示例中,為 Taira 或生成的本地網路設定客戶端.
- 在 Rust 例子中,一個專案與目標網路相同的 Iroha 來源修改.

## 步驟 {#steps}

### 1. 頁面透過一個公共資源 Taira {#_1-page-through-a-public-taira-resource}

資源路線對於儀錶板和煙霧檢查是有用的.請 JSON,連結每個頁面,並在檢查響應後僅投影應用程式需要的欄位.

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

這一 HTTP 表面使用`limit`和`offset`.當路線採用更便宜的計數模式時,將遺漏或侷限的 `total`視為正常的.

### 2. 過和批次輸入 CLI 查詢. {#_2-filter-and-batch-a-typed-cli-query}

CLI 將輸入的可重複查詢序列化,並內部跟隨伺服器延續線索.在這裡邏輯結果僅限於一個行,而 `--fetch-size 1`則控制每次迴路檢索的最大批次.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

過發生在頁面化之前.使用查詢特定型別的預言;一個帳戶或資產的預言不能安全地重複用於域名.

### 3. 根據穩定的後設資料金鑰進行排序 {#_3-sort-by-a-stable-metadata-key}

型別查詢排序是對一個後設資料金鑰進行詞彙化.沒有該金鑰的專案遵循執行階段的定義順序,因此使用在整個集合中一致填充的金鑰.

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

已註冊的 CLI 解析`--select` JSON 並轉發選擇器tuple,但當前的輕量級查詢 DSL 不評估伺服器上的選擇器.尚未圍繞它構建投影合同.僅在目標執行階段支援後使用輸入的 SDK 投影,或者用上述 `jq`或 JavaScript 來投影驗證的結果客戶端.

### 4. 讓 Rust 回覆器遵循不透明的線索. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination`限制了邏輯結果集. `FetchSize`控制每個伺服器批次.返回的代器透過伺服器生成的線索器透明地傳送延續請求.

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

一個 `ForwardCursor` 是受授權主體約束的,過程本地,只能向前進行分析.永遠不要解析它,合成它,在權限主體之間分享它,或者在 Torii 例項中保留它作為一個行動式簡歷代幣.如果它過期,請重新啟動原始查詢,使用了故意的應用級檢查點.

## 驗證 {#verify}

確切域名過濾器應該只返回 `wonderland.universal`. 驗證結果,而不是單獨計算成功的 CLI 出口:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

對於頁面化應用查詢,也檢驗 IDs 不會在不同頁面中重複,要求的邏輯限制從來沒有超過,並在過期後重新嘗試緩衝器從文件化檢查點開始.

## 解決問題 {#troubleshooting}

- 一個單一查詢不接受可重複過濾器,排序,頁面化或搜尋引數.在需要這些控制時使用相應的列表查詢.
- `fetch_size`是一個非零批次暗示,而不是總結果限制.當前預設是`100`,執行階段拒絕超過其最大值的值.
- 一個未知,過期或外國的緩衝器是故意無法重複使用的.重新啟動查詢;不要試圖修復不透明值.
- 大資料分類不是一般的場地分類.如果每個專案都沒有所選的關鍵,請記錄缺失關鍵順序或選擇另一個策略.
- CLI 解析和轉發`--select`,但當前的伺服器不評估輕量級選擇器.除非對部署的執行階段進行驗證,否則應應用客戶端投影.
- 大範圍的無限查詢增加了對等節點工作,客戶端記憶體和線索終身風險. 設定一個合乎消費者的邏輯限制和搜尋量.
- 公開 JSON 資源參數與已簽署的型別化查詢參數彼此相關，但並不是可互換的序列化格式。對於型別化查詢封套，請優先使用 SDK 或 CLI。

## 來源及相關檔案 {#source-and-related-docs}

- [在固定的 commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)中支援 cursor 的頁面化整合測試
- [查詢構建者和選擇者的行為在固定提交中](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [在固定 commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs) 中查詢引數和執行緒模型
- [查詢](/zh-hant/blockchain/queries.md)
- [查詢參考](/zh-hant/reference/queries.md)
- [JavaScript 和 TypeScript](/zh-hant/guide/tutorials/javascript.md)
