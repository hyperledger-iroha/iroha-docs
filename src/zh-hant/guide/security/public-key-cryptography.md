---
translation_locale: zh-hant
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: 3d317c00e75525d70f6cb9ef7f8eeec6911e2f124af8052cd2fc719b264d43f9
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 公開金鑰密碼學 {#public-key-cryptography}

公開金鑰密碼學使用彼此對應的公鑰與私鑰。公鑰可以分享；私鑰則必須始終由許可權主體控制。安全性取決於使用受支援的演演算法、以安全的隨機來源產生金鑰，以及妥善保護私鑰。

## 數位簽章 {#digital-signatures}

簽署者使用私鑰建立數位簽章，驗證者則使用相對應的公鑰檢查該簽章。

有效簽章表示已簽署的位元組未遭變更，且私鑰持有者已核准這些內容。簽章本身無法識別某個人的身分；身分取決於公鑰或帳戶控制者的註冊及治理方式。

簽章提供完整性與授權證據，但不會加密已簽署的內容。

## 公開金鑰加密 {#public-key-encryption}

某些公開金鑰方案會使用接收者的公鑰為該接收者加密資料，接收者再以相對應的私鑰解密。加密與簽署是不同的操作，也可能使用不同的金鑰或演演算法。

簽署 Iroha 交易不會讓公開帳本資料變成機密資訊。若酬載內容必須保密，請使用部署所核准的機密性機制。

## 使用者端金鑰 {#keys-on-the-client-side}

每筆交易都必須符合已設定的帳戶控制者政策。簡單帳戶可使用單一簽署金鑰；受治理的帳戶則可採用更複雜的控制者政策。

使用者端軟體必須保護私鑰與其他控制者資料。明文使用者端設定只適用於本機開發與受控測試。正式環境整合應採用機密資訊管理器、硬體支援的金鑰儲存空間、隔離式簽署服務，或其他經稽核的簽署邊界。

不同環境與用途應使用不同的金鑰。重複使用同一把金鑰會將這些用途相互連結，並擴大金鑰暴露所造成的影響。

請參閱[產生密碼學金鑰](./generating-cryptographic-keys.md)、[儲存密碼學金鑰](./storing-cryptographic-keys.md)與[維運安全](./operational-security.md)。
