---
translation_locale: zh-hant
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 1f316d6a823b23e821d80fe8773df7469358b0e01057f9b76b113cafe4818f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 準備釋放 {#release-readiness}

在推廣一項 Iroha 應用程式或網路變化,證明行為
在可能暴露相關風險的最小環境中,
透過共享的測試網和生產門,

## 局域網門 {#localnet-gate}

- 啟動一次性本地網路, Iroha 這種方式
  最接近的實際驗證劑數量.
- 執行交易建設者單位測試,查詢解析,拒絕
  運行和配置加載.
- 練習最小的成功閱讀和寫作路徑
  SDK 或是 CLI 該應用程式將以后使用的形狀.
- 捕捉預期的交易哈希,狀態,事件和狀況閱讀
  檢測的文物.

請看 [發射 Iroha 3](/zh-hant/get-started/launch-iroha.md) 及其他
[SDK 學習教程](/zh-hant/guide/tutorials/).

## 共有測試網門 {#shared-testnet-gate}

- 使用 Taira 或其他共享的端點行為,費用,帳戶測試網
  提供資金,延遲和運作演習.
- 保持生動的測試網寫作選擇,所以普通的測試跑不依賴
  網路可用性或使用測試網資金.
- 檢查簽署者資金,收費資產元數據,權限授權,
  在提交每個實體測試交易之前預期的狀態.
- 檢查結果的狀態,
  只有閱讀的查詢.

請看
[繼續努力 SORA 3: Taira 及其他 Minamoto](/zh-hant/get-started/sora-nexus-dataspaces.md).

## 主網或生產門 {#mainnet-or-production-gate}

- 使用分別的產品簽名,資金,域名和配置路徑.
  沒有推廣測試網關鍵或水龙頭假設.
- 確認 SDK, CLI, 互聯網與其他國家的互動性
  [互換性矩陣](/zh-hant/reference/compatibility-matrix.md).
- 檢查許可,費用贊助,利率限制,監控,備份
  在釋放窗口之前的狀態和反彈標準.
- 需要書面的交易或移民計劃,

## 轉型與恢復 {#rollback-and-recovery}

- 定義代碼部署可以逆轉的變化,
  在連鎖上進行的交易,
- 在連鎖上的數據變更,準備補償交易或遷移
  在第一個製作之前寫作.
- 在網路變更中, 保持之前的二元,設定捆綁,簽名
  在發布過程中可用的運作行程簿.
- 根據客觀的訊號,
  這種情況可能會影響其他國家,

## 最后的檢查名單 {#final-checklist}

- 配置是專屬於環境的,並不僅包含試驗
  這是一種秘密.
- 交易反復嘗試的行為是無權或明顯限制的.
- 該申請可以區分拒絕,過期,截止日期和終點
  沒有可用性.
- 監控涵蓋吞吐量,延遲時間,排隊深度,拒絕率,視頻
  改變與相關的商業事件.
- 運營商有預期故障模式的跑步簿.
- 檢查了關鍵保管,權限,網絡曝光以及
  自動化管理局.
