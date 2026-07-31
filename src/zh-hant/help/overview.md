---
translation_locale: zh-hant
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解決問題 {#troubleshooting}

這部分是為了幫助您在工作時遇到問題
Iroha. 如果有什麼問題, [檢查關鍵](#check-the-keys)
如果沒有幫助,
每個階段:

- [設置問題](./installation-issues.md)
- [配置問題](./configuration-issues.md)
- [部署問題](./deployment-issues.md)
- [整合問題](./integration-issues.md)

如果您所遇到的問題沒有在此描述,
[電子郵件](https://t.me/hyperledgeriroha).

## 檢查鍵 {#check-the-keys}

我們建議您使用這些密碼,
要遵守這個規則: **如果有什麼問題, 檢查鍵
首先**.

這就是一個快速的說明:
隨著同行關鍵不匹配對列中的關鍵而出現的訊息
因為它會揭露同行的公開關鍵.
具有透過環境定義的關鍵的 Helm圖表或 Kubernetes部署
比較配置的變量
[`public_key`](/zh-hant/reference/peer-config/params.md#param-public-key),
[`private_key`](/zh-hant/reference/peer-config/params.md#param-private-key), 及其他
[`trusted_peers`](/zh-hant/reference/peer-config/params.md#param-trusted-peers)
在調查更高級故障之前,

如果有疑慮, [生成新的關鍵](/zh-hant/guide/security/generating-cryptographic-keys.md).
