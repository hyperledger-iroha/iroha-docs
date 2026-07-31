---
translation_locale: zh-hant
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 表現,條件,道理 {#expressions-conditionals-logic}

所有的 [Iroha 特別指示](./instructions.md) 在表達式上操作.
每個表達式都有一個 `EvaluatesTo`, 在教學中使用的
雖然您可以直接指定帳戶名稱,
也指定帳號 ID 透過某種數學或弦運算.
也可以查看是否在區塊上註冊帳戶.

使用實現的表達式 `EvaluatesTo<bool>`, 您可以設定
在連鎖上執行更複雜的操作.
例如,您可以提交 `Mint` 只有在特定的帳戶中
已註冊.

請記住,你可以將此與查詢結合在一起,
這就是我們所謂的"區塊". _聰明的人
合同_, 區塊的先進使用的定義特點
沒有任何相關技術.
