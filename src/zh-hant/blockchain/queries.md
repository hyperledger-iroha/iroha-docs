---
translation_locale: zh-hant
translation_source: /blockchain/queries.md
translation_source_hash: 0a32b75b78d5bcde0d2b84b58d440b18e545559dfd9772dd6508ad41e972bf6e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# 詢問問題 {#queries}

雖然大部分關於區塊狀態的資訊都可能是
透過活動訂閱器和濾鏡,
僅限於有興趣的事件範圍,
請更直接地走進. _詢問問題_.

查詢是小的指令類型的對象, Iroha
提醒我們如何看待世界.

這並不是唯一的資訊,
但它是唯一的資訊, _有保障的_ 必須
在所有網路上都可供使用.

每次部署 Iroha, 其他資料可能存在.
例如,遠隔測量數據的可用性取決於網路
管理者完全要決定他們是否願意
而不是使用它來完成工作.
其他工作都需要做,
您的帳戶餘額.

詢問的結果可能是 [排序](#sorting), [在頁面上](#pagination)
及其他 [過的](#filters) 排序已完成.
字母表格上使用的 metadata鍵.
該項目的目標是: IP 接口濾網面膜)
這樣的子字符串方法 `begins_with` 使用逻辑操作的組合.

## 試著使用 Taira {#try-it-on-taira}

Taira 顯示只閱讀的查詢助手 JSON 請使用這些資源.
在線上使用之前, SDK:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

請將這些煙霧檢查與簽署的交易分開.
檢測.只能閱讀的查詢失敗通常指向端點可用性,
在它指向簽名器設定之前,

## 建立一個查詢 {#create-a-query}

請使用從 SDK 或是 CLI. 如目前的數據
模型曝光 `FindAccounts` 註冊帳戶:

```rust
let query = FindAccounts;
```

這裡是尋找阿里斯的資產的一例:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## 網站頁面 {#pagination}

您可以使用: `client.request`
在一個時間內就能發送訊息,

其他問題也可能是: `FindAccounts`, `FindAssets`, 或是
`FindBlocks` 使用頁面化來減少載荷
該公司的同事和客戶.

為了建立一個 `Pagination`, 你需要打電話
`client.request_with_pagination(query, pagination)`, 在哪裡 `pagination`
建立如下:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## 濾網 {#filters}

當你建立查詢時,你可以使用過濾器只返回結果
符合指定過濾器的要求.

例如,帳戶查詢可以由
帳戶身份或元數據,而資產查詢可以按資產縮小
請使用以下方法: SDK 是輸入的查詢
在可能情況下,使濾網類型匹配查詢輸出類型.

## 排序 {#sorting}

Iroha 能分別這些項目, [數據](/zh-hant/blockchain/metadata.md)
如果您提供在施工中排序的關鍵,
經常使用情況是, `registered-on`
數據入口,在整理時,可以查看帳戶
註冊歷史.

排序只適用於有
[數據](/zh-hant/blockchain/metadata.md), 如何使用元數據鍵
排序查詢結果.

您可以將排序與頁面化和過濾器結合在一起.
這項功能是可選的,

## 參考 {#reference}

檢查這些 [已有的查詢列表](/zh-hant/reference/queries.md) 提供關於他們的詳細資訊.
