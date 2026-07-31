---
translation_locale: zh-hant
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 安全與使用權 {#security-and-access}

該組織的安全實踐 Iroha 必須建立在狭窄的權威,
關鍵的保管,明顯的網絡曝光和可審核的變化.

## 關鍵的監管 {#key-custody}

- 產品密钥的生成與生產級內心化,
  關鍵在存儲之外,發表跟蹤器,提示,聊天日志, CI
  產量.
- 請使用不同的關鍵材料,
  經驗證人,費用贊助者及技術會計.
- 按書寫的過程旋轉鍵,
  這是一場實際事件.
- 使用硬體支持或操作系統支持的存儲,
  在部署風險合理化時,

請看
[如何生成密碼關鍵](/zh-hant/guide/security/generating-cryptographic-keys.md)
及其他
[儲存密碼關鍵](/zh-hant/guide/security/storing-cryptographic-keys.md).

## 許可證 {#permissions}

- 提供支持工作流程的最小許可符號或角色.
- 首選專用技術帳戶,
  避免透過個人電腦執行長壽自動化,
  運營商帳戶.
- 檢視對同行管理,元數據突變,造的權限
  燃燒,啟動登記,執行程序變更, SORA/Nexus
  在開始生產前的治理.
- 在維護窗口或遷移後取消暫時權限
  這需要他們.

請看 [許可證](/zh-hant/blockchain/permissions.md) 及其他
[許可令牌](/zh-hant/reference/permissions.md).

## 網路曝光 {#network-exposure}

- 限制同行使用, Torii, 按照電視測量和運營者路線
  公眾閱讀權限並不意味著公眾寫作或
  操作員的接入.
- 使用 VPNs, 防火牆,反向代理, TLS 终止和利率限制
  在部署情況下.
- 保持基本作者認證,代理代碼和轉發標題
  已承諾的保證.
- 檢測未經授權的客戶無法到達限制路線.

請看 [虛擬私人網絡](/zh-hant/guide/security/vpn.md) 及其他
[Torii 目的地](/zh-hant/reference/torii-endpoints.md).

## 監控欺诈和濫用 {#fraud-and-abuse-monitoring}

- 監控帳號事件和意外資產的運營訊息
  運動,許可授予,引發變化,同行變化以及重複
  拒絕的交易.
- 存儲證據, 交易哈希,區塊高度,事件紀錄,
  該網站上有數據,
- 對安全,運營和企業主負責的路線警報
  對受影響的資產或工作流程.

請看 [監控欺诈行為](/zh-hant/guide/security/fraud-monitoring.md).

## 代理和自動化護衛線 {#agent-and-automation-guardrails}

- 啟動自动化使用只閱讀權限,
  在工作流程進行審核後.
- 必須明顯的人類批准,
  自動化是一項故意部署的生產服務.
- 請不要將私密鍵暴露於代理訊息中.
  來自環境變量,鍵鎖,硬體簽名器的秘密,或
  忽略了設定檔案.
- 沒有泄漏的審核支持日志自動化決定
  秘密資料.
