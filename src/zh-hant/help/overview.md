---
translation_locale: zh-hant
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解決問題 {#troubleshooting}

如果您在工作中遇到問題, Iroha. 如果有什麼不對,請 [檢視鑰匙](#check-the-keys) 如果這沒有幫助,請檢視每個階段的故障解決說明:

- [安裝問題](./installation-issues.md)
- [配置問題](./configuration-issues.md)
- [部署問題](./deployment-issues.md)
- [整合問題](./integration-issues.md)

如果您所遇到的問題未被描述在這裡,請透過 [電報](https://t.me/hyperledgeriroha)聯絡我們.

## 檢視鑰匙 {#check-the-keys}

大多數問題是由於無法匹配的金鑰而產生的. 這就是為什麼我們建議遵循這個規則:如果有問題,首先檢查鍵.

這裡有一個簡單的解釋:當對等節點金鑰不與可信任對等節點陣列中的金鑰相匹配時,無法區分出現的錯誤資訊.因此,如果您有透過環境變數定義的金鑰的Helm圖表或Kubernetes部署,在調查更高層次故障之前,請比較配置的 [`public_key`](/zh-hant/reference/peer-config/params.md#param-public-key),[`private_key`](/zh-hant/reference/peer-config/params.md#param-private-key)和 [`trusted_peers`](/zh-hant/reference/peer-config/params.md#param-trusted-peers)等值.

如果有疑問, [生成一個新的鑰匙對](/zh-hant/guide/security/generating-cryptographic-keys.md).
