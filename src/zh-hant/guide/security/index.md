---
translation_locale: zh-hant
translation_source: /guide/security/index.md
translation_source_hash: 0aaeadd98f9d16f8459553b58b2b73c47b792bbb5bff0cbe848f9cf4ababe9be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 安全性 {#security}

在使用時 Iroha 或其他任何區塊帳號,就此而言安全是金融組織最重要的, 因為它在敏感的財務數據和交易常見的行業中形成了信任的基礎.

### 航行方式 {#navigation}

如何確保您的安全性 Iroha 請選擇以下題材之一:

- [安全原則](./security-principles):

  基本的安全原則是個人和組織可以采用來保護他們的數據,

- [虛擬私人網絡](./vpn.md):

  如何使用 VPN 限制同行使用, Torii, 並在私人或聯盟部署中提供操作員的權利.

- [運營安全](./operational-security.md):

  確保您的網絡日常運作,包括接入控制,監控,事件反應,使用覽器等.

- [監控欺诈行為](./fraud-monitoring.md):

  如何使用帳號事件,查詢,權限和運營訊息檢測可疑活動並保存反應證據.

- [密碼安全](./password-security.md):

  建立強固的密碼,避免密碼漏洞.

- [公钥加密](./public-key-cryptography.md):

  介紹公共密碼加密,加密,簽名及其在區塊內建立安全溝通的作用.

  - [如何生成密碼關鍵](./generating-cryptographic-keys.md):

    如何生成加密密钥和使用指令 `kagami` (一支配套工具, Iroha).

  - [儲存密碼關鍵](./storing-cryptographic-keys.md):

    如何保護密碼關鍵?
