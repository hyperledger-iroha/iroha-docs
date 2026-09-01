---
translation_locale: zh-hant
translation_source: /guide/security/index.md
translation_source_hash: ec7fc2f950b007f52d837473ad7021565923e537df1d18b86055fb483cda375c
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 安全 {#security}

確保一個 Iroha 的部署,就像處理敏感資料和價值的任何系統一樣.保護簽名金鑰,網路訪問,節點操作,監測和事件響應. 一份賬本並不能消除這些控制的必要性.

### 航行 {#navigation}

在本節,您可以瞭解保護 Iroha 網路的各個方面. 為了瞭解更多,請選擇以下話題之一:

- [安全原則](./security-principles):

保護資料和降低違規風險的核心原則.

- [虛擬私人網路](./vpn.md):

如何使用 VPN 來限制對等節點到對等節點, Torii,以及運營商在私人或聯盟部署中的訪問.

- [運營安全](./operational-security.md):

訪問,監控,應對事件和操作員工作站的日常控制.

- [欺詐監測](./fraud-monitoring.md):

如何使用賬本事件,查詢,許可權和運營訊號來檢測可疑活動並儲存響應證據.

- [密碼安全](./password-security.md):

密碼熵、強密碼建構方式和常見失敗模式。

- [公鑰密碼](./public-key-cryptography.md):

公共金鑰加密,簽名和認證通訊.

  - [生成加金鑰](./generating-cryptographic-keys.md):

透過 `kagami`生成支援的加金鑰.

  - [儲存密碼金鑰](./storing-cryptographic-keys.md):

儲存加密金鑰,使用適合部署的層級控制.
