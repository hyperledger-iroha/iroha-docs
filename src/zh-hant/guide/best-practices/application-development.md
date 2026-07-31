---
translation_locale: zh-hant
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 應用程式的發展 {#application-development}

Iroha 應將交易行為明顯化,
如何使用查詢和事件,
在製造過程中觀察.

## 客戶端設定 {#client-setup}

- 存儲客戶端配置在應用程式源代碼之外.
  链接 ID, Torii URL, 簽名帳戶和交易設定
  特定環境配置.
- 保持 `client.toml` 專屬於 localnet 的檔案, Taira, Minamoto, 及其他
  複製的測試網簽名器永遠不應該成為主網路
  簽名者.
- 預定交易壽命和狀態時間.
  在正常的網路動力下,
  這樣的說法可能會讓複製的資料更難推理.
- 使用 `nonce = true` 只有在重複的交易中,
  沒有權力的商業運作,
  申請要求 ID 這樣的回覆可以追蹤.

請看 [客戶端配置](/zh-hant/guide/configure/client-configuration.md) 關於
的電流 TOML 其他國家

## 交易 {#transactions}

- 建立從輸入的交易 SDK 在可能情況下,
  沒有使用 JSON 或是連串組成的有效載荷.
- 預覽重要寫作只有閱讀的查詢:
  資產餘額,許可狀態,收費資產可用性以及目標
  該項目的狀態.
- 記錄交易哈希,權威帳戶,指令總結,
  在提交之前預期的狀態變化.
- 治療 `Rejected`, `Expired`, 而時間休息的結果是不同的.
  表示客戶沒有遵守最終狀態;它並不證明
  網路忽視了交易.
- 在成功寫完之後, 通過查詢或
  事件檢查點與商業運作相匹配.

對於交易機制,請見 [交易](/zh-hant/blockchain/transactions.md).

## 詢問及事件 {#queries-and-events}

- 使用當前狀態和事件流的查詢,
  避免用重複的廣泛查詢取代事件處理.
- 頁面化廣泛的可重複查詢, 例如帳戶,資產和區塊
  列出這些問題.
- 喜歡簡約過濾器,
  對於診斷而有用,但可以增加不必要的執行和客戶端
  進行處理.
- 請與簽署的交易測試分別檢查,
  終點可用性更容易診斷.

請看 [詢問問題](/zh-hant/blockchain/queries.md), [事件](/zh-hant/blockchain/events.md), 及其他
[濾網](/zh-hant/blockchain/filters.md).

## 經營者協助發展 {#agent-assisted-development}

- 讓代理人檢查醫生, SDK 在此之前,
  要求他們寫交易代碼.
- 保持實際網路測試, 在環境旗後選擇
  `TAIRA_LIVE=1`.
- 請不要貼私钥,帳戶復原資料, API 標示,或
  發送作者標題到提示中.
- 在任何代理人提交直播測試網之前,
  該計畫應指出網路,權威,指令,
  預期的結果, 再試行動.

為了 Taira MCP 工作流程,查看
[繼續努力 SORA 3: Taira 及其他 Minamoto](/zh-hant/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK 衛生 {#sdk-hygiene}

- 子 SDK 並使用二元版本
  [互換性矩陣](/zh-hant/reference/compatibility-matrix.md).
- 保持生成的客戶端代碼,截圖和示例同步
  還是將工作空間改造上線.
- 加入交易建立代碼的單位測試和集成測試
  您的申請取決於最小的閱讀與寫作路徑.
