---
translation_locale: zh-hant
translation_source: /guide/security/password-security.md
translation_source_hash: 093be5b91700b9a6f85b45dc873c8c29d90397d5c9e3c842a77bfb03e97b37da
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 密碼安全性 {#password-security}

密碼可保護維運主控台、機密資訊儲存庫、備份與本機金鑰檔案。密碼只是其中一項控制措施；它必須搭配安全的金鑰保管、存取控制，以及在可用時採用多因素驗證。

## 使用個別產生的唯一密碼 {#use-unique-generated-passwords}

- 每個帳戶與每個環境都應產生不同的密碼。
- 使用密碼管理器產生並儲存長且隨機的密碼。
- 只有在詞彙是從足夠大的清單中隨機選取時，才使用多詞密碼片語。
- 姓名、日期、地址、引文、鍵盤排列模式與重複使用的片段均不得出現在密碼中。
- 若服務支援，請使用由服務產生的權杖或密碼學金鑰，取代人員輸入的密碼。

長度與不可預測性比裝飾性的字元替換更重要。在可預測的單字中加入一個符號，並不會讓結果變得安全。

## 保護使用密碼的帳戶 {#protect-password-based-accounts}

- 在可用時啟用抗網路釣魚的多因素驗證。
- 對重複發生的身分驗證失敗套用速率限制、鎖定政策與警示。
- 只能透過已驗證且加密的通道傳送密碼。
- 密碼與復原碼不得出現在日誌、命令列、原始碼存放庫、設定檔、問題單或聊天中。
- 伺服器端密碼驗證資料應使用加鹽且記憶體密集的密碼雜湊函式，參數則應符合部署需求。

## 儲存、復原與替換 {#storage-recovery-and-replacement}

- 使用經稽核的密碼管理器，並備有已加密且經過測試的備份。
- 復原碼應與其用來復原的裝置分開儲存。受到妥善保護的離線紙本可能適合存放復原資料。
- 限制對密碼管理器匯出檔與備份媒體的存取。
- 疑似遭暴露、發生未經授權的重複使用，或政策事件要求替換時，應替換密碼。
- 在正式環境啟用前測試帳戶復原程序。

::: warning

用來解鎖私鑰的密碼，無法讓已暴露的私鑰副本恢復安全。若懷疑私鑰遭到暴露，請遵循部署的金鑰替換或撤銷程序。

:::

請參閱[維運安全](./operational-security.md)與[儲存密碼學金鑰](./storing-cryptographic-keys.md)。
