---
translation_locale: zh-hant
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 查詢賬本狀態 {#query-ledger-state}

## 結果 {#outcome}

讀取並投影 Taira JSON 資源，然後透過 CLI 和 Rust SDK 使用 Torii 集合查詢，搭配篩選、排序、伺服器端投影、分頁上限，以及不透明的 `next_cursor` 接續。您也將避免用已簽署的具型別查詢來列出資料，因為這類查詢不會對列表進行篩選、排序或投影。

## 預先條件 {#prerequisites}

- `curl`,`jq`, Node.js 24,以及電流 `iroha` CLI.
- 僅可讀的 Taira 訪問.
- 對於 CLI 範例，需要 Taira 或生成的本地網路的客戶端設定。
- 在 Rust 例子中,一個專案與目標網路相同的 Iroha 來源修改.

## 步驟 {#steps}

### 1. 頁面透過一個公共資源 Taira {#_1-page-through-a-public-taira-resource}

資源路線對於儀錶板和煙霧檢查是有用的.請 JSON,連結每個頁面,並在檢查響應後僅投影應用程式需要的欄位.

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

這個 HTTP 介面以 `limit` 和不透明的 `next_cursor` 進行分頁；請將其原封不動地作為 `cursor` 傳回，直到它為 `null`。只有在您請求 `include_total=true` 時才會出現 `total`，而這需要付出完整掃描的成本。

### 2. 使用 CLI 篩選集合 {#_2-filter-a-collection-with-the-cli}

CLI 會將篩選條件、投影和分頁大小傳送到集合端點，並列印一頁 `{items, next_cursor}`。加上 `--all` 即可持續追蹤 `next_cursor`，直到它為 `null`。

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

篩選發生在分頁之前。每個集合只接受自己的欄位；未知的欄位會返回 `invalid_filter`，而不是不匹配任何內容。

### 3. 根據穩定的後設資料金鑰進行排序 {#_3-sort-by-a-stable-metadata-key}

集合排序鍵接受已宣告的欄位和 `metadata.<key>`；在鍵前加上 `-` 表示降冪排序。在升冪排序中，沒有該鍵的資料列會排在最前面，且值相同時依資料列身分排序，因此請使用在整個集合中一致填入的鍵。

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` 是伺服器端投影：`--select id,metadata` 只返回這些欄位，而未知的欄位會返回 `invalid_select`。已簽署的具型別查詢總是返回完整的項目，因此請如上所示，以 `jq` 或 JavaScript 在客戶端投影其結果。

### 4. 讓 Rust 回覆器遵循不透明的線索. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` 設定分頁大小。`list` 返回的迭代器只會在目前頁面被讀取完畢後，才使用伺服器的 `next_cursor` 請求下一頁，而 `take` 會限制邏輯結果的數量。這裡的 `client` 是一個 `iroha::blocking::Client`。

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` 是一個不透明的鍵集位置，與其集合、路徑、篩選條件和排序繫結。切勿解析或自行合成它，也不要搭配不同的篩選條件或排序重複使用它；Torii 會以 `invalid_cursor` 拒絕這種情況。在頁與頁之間插入或移除的資料列，絕不會讓後續頁面重複或跳過無關的資料列。

## 驗證 {#verify}

確切域名過濾器應該只返回 `universal.universal`. 驗證結果,而不是單獨計算成功的 CLI 出口:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

對於分頁的應用程式查詢，還要測試 ID 不會跨頁重複、所請求的邏輯上限從未被超過，以及被拒絕的游標會從有記錄的檢查點重新開始。

## 解決問題 {#troubleshooting}

- 一個單一查詢不接受可重複過濾器,排序,頁面化或搜尋引數.在需要這些控制時使用相應的列表查詢.
- `limit` 是分頁大小，而不是結果總數：最小為 1，最大為節點的 `torii.app_api_max_list_limit`（預設 500）；Torii 的預設值是 100。若要讀取更多，請追蹤 `next_cursor`、使用 `--all` 或 SDK 迭代器。
- `invalid_cursor` 表示游標格式錯誤，或屬於不同的集合、路徑、篩選條件或排序。請重新開始查詢；不要嘗試修復這個不透明的值。
- 選擇性高的篩選條件可能返回較短或空白的頁面，並附帶非空的 `next_cursor`。請持續追蹤它，直到它為 `null`。
- `--filter` 和 HTTP `filter` 參數採用 Torii 的文字語法，例如 `id = "universal.universal"` 或 `exists(metadata.tier)`。JSON 謂詞物件不是篩選文字，會以無效的 `filter` 失敗。
- 範圍廣且無上限的查詢會增加對等節點的工作量和客戶端記憶體用量。請設定適合使用端的邏輯上限和分頁大小。
- 已簽署的 `/v1/query` 不是列表 API。它只接受單一查詢和少數不帶篩選的可迭代查詢起點，並以 `signed_query_shape_not_admitted` 拒絕其他查詢，例如 `FindDomains` 或 `FindAssetDefinitions`。集合端點、CLI `list` 命令和 SDK 集合讀取器共用同一套篩選、排序和游標語法。

## 來源及相關檔案 {#source-and-related-docs}

- [固定提交中的 Torii 集合查詢規範](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [固定提交中的 Rust 集合讀取與游標迭代器](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [固定提交中的已簽署查詢准入規則](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [查詢](/zh-hant/blockchain/queries.md)
- [查詢參考](/zh-hant/reference/queries.md)
- [JavaScript 和 TypeScript](/zh-hant/guide/tutorials/javascript.md)
