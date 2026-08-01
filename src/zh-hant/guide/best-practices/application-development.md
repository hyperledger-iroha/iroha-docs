---
translation_locale: zh-hant
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 應用程序開發 {#application-development}

Iroha 應用程序應該明確交易行爲,保持簽名狀態包含,並以生產中容易觀察的方式使用查詢和事件.

## 客戶端設置 {#client-setup}

- 在應用程序源代碼之外存儲客戶端配置.從環境特定的配置中加載鏈接 ID, Torii URL,簽字帳戶和交易設置.
- 保持`client.toml`文件爲本地網絡,Taira, Minamoto 和私人網絡分開.複製的測試網簽名器永遠不應該成爲主網簽名符.
- 在正常的網絡動盪下,一個非常短的壽命可能會過期,而一個非常長的壽命可以使複製提交變得更加難以推理.
- 僅在重複交易時使用 `nonce = true`.對於無權的業務運營,存儲和再利用應用請求 ID,以便重新測試可以追蹤.

對於當前 TOML 字段,請參見[客戶端配置](/zh-hant/guide/configure/client-configuration.md).

## 交易 {#transactions}

- 在可能的情況下,從輸入 SDK 指示中構建交易,而不是原始的 JSON 或連線組裝的實用載荷.
- 預飛重要用僅閱讀查詢寫:賬戶存在,資產餘額,許可狀態,費用資產可用性和目標對象狀態.
- 在提交之前記錄交易哈希,權威賬戶,說明總結和預期狀態變化.
- 處理 `Rejected`, `Expired`,截止時間結果不同.截止時間意味着客戶沒有觀察到最終狀態;這並不證明網絡忽略了交易.
- 在成功編寫後,通過與業務運營匹配的查詢或事件檢查點驗證結果狀態.

對於交易機制,請見 [交易](/zh-hant/blockchain/transactions.md).

## 問題和事件 {#queries-and-events}

- 使用當前狀態和事件流的查詢進行變更通知.避免用重複廣泛查詢取代事件處理.
- 頁面化廣泛的可重複查詢,如賬戶,資產和區塊列表.
- 對於訂閱和觸發器,更喜歡狹窄的過器.寬度過器對診斷有用,但可增加不必要的執行和客戶端處理.
- 保持僅閱讀式煙霧檢查與簽署的交易測試分開,以便更容易診斷終點可用性.

查看[查詢](/zh-hant/blockchain/queries.md), [事件](/zh-hant/blockchain/events.md)和 [過器](/zh-hant/blockchain/filters.md).

## 經紀人協助的發展 {#agent-assisted-development}

- 讓特工檢查醫生,SDK 代碼,並要求他們編寫交易代碼之前只讀取網絡狀態.
- 在 `TAIRA_LIVE=1` 等環境標誌背後進行現場網絡測試選擇.
- 不要將私鑰,賬戶恢復材料, API 代幣或轉發的作者標題粘貼到提示中.
- 在任何代理提交實時測試網交易之前,需要一個交易計劃.該計劃應該命名網絡,權威,指令,費用資產,航班前閱讀,預期結果和重複嘗試行爲.

對於 Taira MCP 工作流程,請見 [建立在 SORA 3: Taira 和 Minamoto](/zh-hant/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK 衛生 {#sdk-hygiene}

- 通過使用[兼容性矩陣](/zh-hant/reference/compatibility-matrix.md)的Pin SDK 和二元版本一起.
- 保持生成的客戶端代碼,片段和示例與固定上游工作空間修改同步.
- 添加單元測試用於構建交易代碼和集成測試,以滿足您的應用程序所依賴的最小閱讀和寫路徑.
