---
translation_locale: zh-hant
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 安全與獲取 {#security-and-access}

Iroha 的安全實踐應基於嚴格授權主體,控制金鑰保管,明確網路曝光和可審計的變化.

## 關鍵的監護 {#key-custody}

- 生成生產級的輸入金鑰,並在儲存庫外儲存私鑰,發行跟蹤器,提示,聊天日誌和 CI 輸出.
- 使用單獨的金鑰材料為客戶,對等節點,創世簽名,驗證者,費用贊助商和技術帳戶.
- 按書面程式旋轉鍵,然後在現場事件之前練習恢復.
- 使用硬體支援或作業系統支援的儲存,當部署風險合理時使用高價值簽名金鑰.

檢視 [生成加密金鑰](/zh-hant/guide/security/generating-cryptographic-keys.md)和 [儲存加密密碼金鑰 ](/zh-hant/guide/security/storing-cryptographic-keys.md).

## 許可證 {#permissions}

- 允許支援工作流程的最小許可權符號或角色.
- 最好為服務,觸發器,代理和自動化提供專用技術帳戶. 避免透過個人運營商帳戶執行長期自動化.
- 在生產啟動之前,審查對等節點管理,後設資料突變,鑄造、銷毀,觸發註冊,執行器更改和 SORA/Nexus 治理權.
- 在需要這些臨時許可權的維護時段或遷移完成後，撤銷這些許可權。

檢視 [許可證](/zh-hant/blockchain/permissions.md)和 [許可證代幣 ](/zh-hant/reference/permissions.md).

## 網路暴露 {#network-exposure}

- 根據環境限制對等節點到對等節點, Torii,遠端測量和運營商路線.公眾閱讀訪問並不意味著公開寫入或運營商訪問.
- 使用 VPNs,防火牆,反向代理, TLS 終止和適合部署時的速度限制.
- 保持基本作者憑證,代理代幣和轉發的標題在已提交配置之外.
- 測試未經授權的客戶無法進入受限制的路線.

檢視 [虛擬私人網路](/zh-hant/guide/security/vpn.md)和 [Torii 端點](/zh-hant/reference/torii-endpoints.md).

## 監控欺詐和濫用 {#fraud-and-abuse-monitoring}

- 監控賬本事件和運營訊號,以發現意外的資產流動,許可授予,觸發變化,對等節點變化以及反覆拒絕交易.
- 儲存證據使用交易雜湊,區塊高度,事件記錄,日誌和狀態快照.
- 對受影響的資產或工作流程負責的安全,運營和企業所有者提供路線警報.

檢視 [欺詐監控](/zh-hant/guide/security/fraud-monitoring.md).

## 代理和自動化防護軌道 {#agent-and-automation-guardrails}

- 使用唯讀許可權啟動自動化,並僅在工作流程被審查後新增寫入許可權.
- 要求人類明確批准現場網路突變,除非自動化是故意部署的生產服務.
- 不要把私鑰暴露在代理人的提示上.使用區域性程式碼,從環境變數,鍵鏈,硬體簽名器或無視配置檔案中載入秘密.
- 記錄自動化決策以支援審計的方式,而不洩露秘密材料.
