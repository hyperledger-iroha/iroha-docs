---
translation_locale: zh-hant
translation_source: /guide/security/security-principles.md
translation_source_hash: 20139011c663a0bca6f9e486ef81f698370c34f8f02319317805b0d1dfb049c7
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 安全原則 {#security-principles}

Iroha 分類帳會驗證已簽署的指令並套用權限。它不會保護私鑰、主機、應用程式、操作員工作站或治理程序；部署方必須保護這些系統。

設計與營運 Iroha 網路時，請遵循這些原則。

## 將授權主體視為安全邊界 {#treat-authority-as-a-security-boundary}

- 控制私鑰的人員或程序，可以行使指派給該金鑰之授權主體的權力。
- 為每個環境及營運角色使用不同的授權主體。
- 生產金鑰與復原金鑰必須和日常開發及測試憑證分開。
- 記錄每個授權主體的擁有者、簽署器的保管位置，以及取代或撤銷方式。

另請參閱[公開金鑰密碼學](./public-key-cryptography.md)與[儲存密碼金鑰](./storing-cryptographic-keys.md)。

## 套用最小權限原則 {#apply-least-privilege}

- 僅授予角色所需的 Iroha 權限、主機存取權與網路存取權。
- 將日常交易簽署與治理、部署及復原權限分開。
- 對可能影響驗證者成員資格、特權權限或高價值資產的變更，要求獨立核准。
- 角色變更後應重新檢視存取權，並移除不再需要的權限。

## 採用多層防護 {#use-layers-of-protection}

- 保護簽署器、應用程式、作業系統、網路與實體存取；不要只依賴單一控制措施。
- 僅公開部署所需的 Torii、對等節點、監控及應用程式路由。
- 管理存取及傳送敏感資料時，使用已驗證身分且加密的通道。
- 持續修補系統，並停用部署未使用的服務。
- 不要在原始碼控制、命令列、日誌、工單、聊天或公開文件中放置祕密資料。

## 讓部署可供審查 {#make-deployments-reviewable}

- 將非祕密組態與部署自動化內容納入版本控制。
- 審查二進位檔、組態、創世資料、驗證者成員資格、權限及公開路由的變更。
- 部署前驗證發行成品，並記錄已核准的版本與雜湊值。
- 測試將在生產環境執行的確切二進位檔與組態組合。
- 維持網路的確定性行為；硬體加速不得改變對等節點可見的結果。

## 監控並保存證據 {#monitor-and-preserve-evidence}

- 監控對等節點健康狀況、共識進度、權限變更、特權指令、驗證失敗及非預期組態變更。
- 將重要警示傳送至不依賴受影響主機的系統。
- 保存相關日誌、分類帳參照、組態快照及交易雜湊，並附上可靠的時間戳記。
- 將監控資料缺失視為需要調查的營運問題。

## 上線前準備復原 {#prepare-recovery-before-launch}

- 定義誰可以宣告事件，以及誰可以核准復原作業。
- 測試備份、還原、金鑰取代、權限撤銷及對等節點復原程序。
- 確保事件期間仍可取得可信任的發行成品、組態、創世記錄與清冊。
- 先恢復讀取與監控；僅在復原後的網路及相依應用程式通過檢查後，才恢復寫入。
- 檢討每起事件，並更新控制措施、自動化及演練。

::: warning

分類帳操作可能無法復原。提交復原或治理交易前，請遵循預先審查的程序並取得必要核准。

:::

接著閱讀[營運安全](./operational-security.md)與[發行準備](../best-practices/release-readiness.md)。
