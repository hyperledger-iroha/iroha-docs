---
translation_locale: zh-hant
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 應用程式開發 {#application-development}

Iroha 應用程式應該明確交易行為,保持簽名狀態包含,並以生產中容易觀察的方式使用查詢和事件.

## 客戶端設定 {#client-setup}

- 在應用程式原始碼之外儲存客戶端配置.從環境特定的配置中載入連結 ID, Torii URL,簽字帳戶和交易設定.
- 保持`client.toml`檔案為本地網路,Taira, Minamoto 和私人網路分開.複製的測試網簽名器永遠不應該成為主網簽名符.
- 應有意設定交易生命週期和狀態逾時。在正常網路抖動下，過短的生命週期可能會到期，而過長的生命週期會使重複提交更難推斷。
- 僅當重複交易應具有不同雜湊時，才使用 `nonce = true`。對於冪等業務操作，應儲存並重複使用應用程式要求 ID，以便追蹤重試。

對於當前 TOML 欄位,請參見[客戶端配置](/zh-hant/guide/configure/client-configuration.md).

## 交易 {#transactions}

- 在可能的情況下,從輸入 SDK 指示中構建交易,而不是原始的 JSON 或連線組裝的實用載荷.
- 預飛重要用僅閱讀查詢寫:帳戶存在,資產餘額,許可狀態,費用資產可用性和目標物件狀態.
- 在提交之前記錄交易雜湊,授權主體帳戶,說明總結和預期狀態變化.
- 處理 `Rejected`, `Expired`,截止時間結果不同.截止時間意味著客戶沒有觀察到最終狀態;這並不證明網路忽略了交易.
- 在成功編寫後,透過與業務運營匹配的查詢或事件檢查點驗證結果狀態.

對於交易機制,請見 [交易](/zh-hant/blockchain/transactions.md).

## 查詢和事件 {#queries-and-events}

- 使用當前狀態和事件流的查詢進行變更通知.避免用重複廣泛查詢取代事件處理.
- 頁面化廣泛的可重複查詢,如帳戶,資產和區塊列表.
- 對於訂閱和觸發器,更喜歡狹窄的過濾器.寬度過濾器對診斷有用,但可增加不必要的執行和客戶端處理.
- 保持僅閱讀式煙霧檢查與簽署的交易測試分開,以便更容易診斷端點可用性.

檢視[查詢](/zh-hant/blockchain/queries.md), [事件](/zh-hant/blockchain/events.md)和 [過濾器](/zh-hant/blockchain/filters.md).

## 經紀人協助的發展 {#agent-assisted-development}

- 讓特工檢查醫生,SDK 程式碼,並要求他們編寫交易程式碼之前只讀取網路狀態.
- 在 `TAIRA_LIVE=1` 等環境標誌背後進行現場網路測試選擇.
- 不要將私鑰,帳戶恢復材料, API 代幣或轉發的作者標題貼上到提示中.
- 在任何代理提交實時測試網交易之前,需要一個交易計劃.該計劃應該命名網路,授權主體,指令,費用資產,航班前閱讀,預期結果和重複嘗試行為.

對於 Taira MCP 工作流程,請見 [建立在 SORA 3: Taira 和 Minamoto](/zh-hant/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK 衛生 {#sdk-hygiene}

- 透過使用[相容性矩陣](/zh-hant/reference/compatibility-matrix.md)的Pin SDK 和二元版本一起.
- 保持生成的客戶端程式碼,片段和示例與固定上游工作空間修改同步.
- 新增單元測試用於構建交易程式碼和整合測試,以滿足您的應用程式所依賴的最小閱讀和寫路徑.
