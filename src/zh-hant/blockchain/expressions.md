---
translation_locale: zh-hant
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 語法,條件,邏輯 {#expressions-conditionals-logic}

所有 [Iroha 特殊指令](./instructions.md)都運行於表達式.每個表達式都有一個 `EvaluatesTo`,用於執行指令.雖然您可以直接指定帳戶名稱,但也可以通過某種數學或字符串操作來指定賬戶 ID.

使用實現 `EvaluatesTo<bool>`的表達式,您可以設置條件邏輯並在鏈上執行更復雜的操作.例如,只需註冊特定帳戶才能提交一個 `Mint` 指令.

記住,你可以將這結合到詢問.因此,可以編程區塊鏈來做一些驚人的東西.這就是我們所謂的智能合同, 區塊鏈技術的先進使用的定義特徵.
