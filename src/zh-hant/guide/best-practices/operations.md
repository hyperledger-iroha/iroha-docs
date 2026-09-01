---
translation_locale: zh-hant
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 運營 {#operations}

操作準備意味著網路可以觀察,更改,備份和恢復而不需要依賴於即興訪問驗證器主機.

## 可觀察性 {#observability}

- 故意啟用遠端測量配置檔案.當需要 `/metrics`時使用 `extended` 和在需要詳細的 Sumeragi 操作員路線的測試執行過程中使用 `full`.
- 儀錶板接受的吞吐量,拒絕的吞吐力,提交延遲,佇列深度,佇列和度,檢視變化,放棄共識訊息和儲存壓.
- 在同一事件或基準構件集中儲存狀態快照,指標剪輯,日誌和部署配置.
- 警示隨著排隊的持續增長,意外的拒絕峰值,塊高度停滯不前,視角變動和對等節點健康改變.

檢視 [績效和指標](/zh-hant/guide/advanced/metrics.md).

## 跑本 {#runbooks}

- 為對等節點重新啟動, Torii 降級,關鍵妥協,許可錯誤,費用贊助商耗盡,排隊和網路分割槽症狀編寫執行簿.
- 在寫入操作之前,包括精確的唯讀檢查,特別是對對等節點註冊,授權和引數更改.
- 如果包含私人運營資料,請將緊急聯絡和升級規則排除在備案檔案之外.
- 每次事件,練習或重大升級之後,

見 [運營安全](/zh-hant/guide/security/operational-security.md).

## 備份和恢復 {#backups-and-recovery}

- 根據部署所需的恢復點,備份對等節點儲存. 在非生產主機上驗證恢復.
- 保持簽署的起源,釋放後設資料,對等節點配置和關鍵儲存記錄可恢復,即使沒有驗證器主機.
- 記錄恢復程式是否從生成中重建,從快照中恢復,或者用新身份取代失敗的對等節點.
- 在生產事件中,不要第一次檢驗恢復程式.

## 變革管理 {#change-management}

- 將鏈上設定變更視為需要審查、變更前讀取、授權和變更後驗證的交易。
- 推出相容性計劃和反彈決定點的對等節點二進位制升級.
- 避免在同一維護視窗中改變對等節點拓,共識時間和應用工作負載,除非遷移計劃要求這樣做.
- 記錄交易雜湊和區塊高度,以進行操作變化.

檢視 [熱過載](/zh-hant/guide/advanced/hot-reload.md)和 [相容性矩陣](/zh-hant/reference/compatibility-matrix.md).

## 產能評估 {#capacity-reviews}

- 當驗證器計數,硬體,網路配置,工作負載混合或共識引數發生變化時再執行負載檢查.
- 測量升溫,穩定狀態和預期峰值負載,而不是依賴短暫的最佳情況吞吐量樣本.
- 將接受的吞吐量與提交的吞吐力和佇列深度進行比較. 如果提交的 TPS 超過提交的 TPS,排隊增長,網路已經超越了其可持續範圍.
