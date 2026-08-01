---
translation_locale: zh-hant
translation_source: /blockchain/queries.md
translation_source_hash: 234c831c97bb93996e6cf51505921ff509e233408cf2faf6a9b23641e5642040
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# 問題 {#queries}

事件訂閱者和過器可以跟蹤區塊鏈狀態的變化如果您需要直接查看當前狀態,請使用查詢.

查詢是像指令一樣的小物體.發送一個給 Iroha 同齡人來了解他目前的世界狀況.

網絡可能會曝光其他信息.可查詢的世界國家信息是每個 Iroha 網絡上唯一可獲得的保證.

對於每次部署 Iroha,可能還有其他可用的信息.例如,遠程測量數據的可用性取決於網絡管理員.它們是否願意分配處理能力來跟蹤工作,而不是使用它來完成實際的工作. 相反,某些功能總是需要,例如訪問賬戶餘額.

查詢結果可以同時進行 [排序](#sorting), [頁面化](#pagination)和 [過](#filters)等級.排序是用詞彙圖進行的.過可以根據各種原則進行,從特定域 (個別的 IP 地址過器面具) 到使用邏輯操作結合的`begins_with`等子字符串方法.

## 在 Taira 試看. {#try-it-on-taira}

Taira 將只讀取查詢輔助器暴露在 JSON 上,用於共同資源. 在連接 SDK 之前使用它們來練習頁面化和響應處理:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

對於應用程序診斷,請將這些煙霧檢查與簽署的交易測試分開.只閱讀查詢失敗通常指向終端點可用性,網絡可訪問性或路線兼容性,然後指向簽約器設置.

## 創建查詢 {#create-a-query}

使用從 SDK 或 CLI 的輸入查詢構建器. 例如,當前的數據模型對列表賬戶顯示`FindAccounts`:

```rust
let query = FindAccounts;
```

這是一個查詢發現愛麗絲的資產的一個例子:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## 瀏覽頁面 {#pagination}

對於單獨查詢和小型可重複查詢,您可以使用 `client.request` 來提交查詢並獲得一次性結果.

然而, `FindAccounts`, `FindAssets`或 `FindBlocks`等廣泛可重複的查詢可以返回大型結果集. 使用頁面化來減少同行和客戶端負載.

爲了構建 `Pagination`,您需要撥打 `client.request_with_pagination(query, pagination)`,其中`pagination`的構建方式如下:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## 過器 {#filters}

在創建查詢時,您可以使用過器只返回符合指定過器的結果.

例如,賬戶查詢可以通過帳戶身份或元數據縮小,而資產查詢則可根據資產縮小 在可能的情況下,使用 SDK 的輸入查詢構造器,以便過器類型匹配查詢輸出類型.

## 排序 {#sorting}

Iroha 可以用[元數據](/zh-hant/blockchain/metadata.md)語法來排序項目,如果您提供查詢構建過程中進行排序的關鍵.一個典型的使用情況是帳戶有`registered-on`元數據輸入,當排序時,允許您查看賬戶註冊歷史.

排序僅適用於具有 [元數據](/zh-hant/blockchain/metadata.md)的實體,因爲用於對查詢結果進行分類的元數據鍵.

您可以將排序與頁面化和過器結合起來. 請注意,排序是可選的功能,大多數頁面化查詢都不需要它.

## 參考 {#reference}

查看 [現有查詢列表](/zh-hant/reference/queries.md),以獲取有關查詢的詳細信息.
