---
translation_locale: zh-hant
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 安全與獲取 {#security-and-access}

Iroha 的安全實踐應基於嚴格權威,控制密鑰保管,明確網絡曝光和可審計的變化.

## 關鍵的監護 {#key-custody}

- 生成生產級的輸入密鑰,並在存儲庫外存儲私鑰,發行跟蹤器,提示,聊天日誌和 CI 輸出.
- 使用單獨的關鍵材料爲客戶,同行,創始簽名,驗證者,費用贊助商和技術賬戶.
- 按書面程序旋轉鍵,然後在現場事件之前練習恢復.
- 使用硬件支持或操作系統支持的存儲,當部署風險合理時使用高價值簽名密鑰.

查看 [生成加密密鑰](/zh-hant/guide/security/generating-cryptographic-keys.md)和 [存儲加密密碼密鑰 ](/zh-hant/guide/security/storing-cryptographic-keys.md).

## 許可證 {#permissions}

- 允許支持工作流程的最小權限符號或角色.
- 最好爲服務,觸發器,代理和自動化提供專用技術賬戶. 避免通過個人運營商帳戶運行長期自動化.
- 在生產啓動之前,審查同行管理,元數據突變,造,燃燒,觸發註冊,執行器更改和 SORA/Nexus 治理權.
- 在維護窗口或需要遷移後取消臨時權限.

查看 [許可證](/zh-hant/blockchain/permissions.md)和 [許可證代幣 ](/zh-hant/reference/permissions.md).

## 網絡暴露 {#network-exposure}

- 根據環境限制人對人, Torii,遠程測量和運營商路線.公衆閱讀訪問並不意味着公衆寫作或運營商訪問.
- 使用 VPNs,防火牆,反向代理, TLS 終止和適合部署時的速度限制.
- 保持基本作者憑證,代理代幣和轉發的標題在已承諾配置之外.
- 測試未經授權的客戶無法進入受限制的路線.

查看 [虛擬私人網絡](/zh-hant/guide/security/vpn.md)和 [Torii 終端點](/zh-hant/reference/torii-endpoints.md).

## 監控欺詐和濫用 {#fraud-and-abuse-monitoring}

- 監控賬本事件和運營信號,以發現意外的資產流動,許可授予,觸發變化,同行變化以及反覆拒絕交易.
- 保存證據使用交易哈希,區塊高度,事件記錄,日誌和狀態快照.
- 對受影響的資產或工作流程負責的安全,運營和企業所有者提供路線警報.

查看 [欺詐監控](/zh-hant/guide/security/fraud-monitoring.md).

## 代理和自動化防護軌道 {#agent-and-automation-guardrails}

- 使用只閱讀權限啓動自動化,並僅在工作流程被審查後添加寫入權限.
- 要求人類明確批准現場網絡突變,除非自動化是故意部署的生產服務.
- 不要把私鑰暴露在代理人的提示上.使用局部代碼,從環境變量,鍵鏈,硬件簽名器或無視配置文件中加載祕密.
- 記錄自動化決策以支持審計的方式,而不泄露祕密材料.
