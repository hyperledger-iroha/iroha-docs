---
translation_locale: zh-hant
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 活動 {#operations}

操作準備意味著網路可觀察,改變,
沒有依靠即興使用驗證碼的機會,
接待者.

## 可觀察性 {#observability}

- 預計使用電視測量. `extended` 什麼時候 `/metrics`
  是需要的, `full` 在需要詳細的測試過程中 Sumeragi
  運營者路線.
- 顯示板接受的吞吐量,拒絕的吞吐力,提交延遲,排隊
  檢視變更,退出共識訊息,
  儲存壓力.
- 保存狀況快照,數據剪輯,日志和部署
  在同一事件或基准文物集中的配置.
- 警報持續排隊增長,意外的拒絕,停滞
  這種情況可能會影響其他國家的觀點,

請看 [性能與指標](/zh-hant/guide/advanced/metrics.md).

## 經驗證書 {#runbooks}

- 寫下對方重新啟動的跑步簿, Torii 降低,關鍵的妥协,
  許可錯誤,費用贊助者耗費,排隊,網路
  區分症狀.
- 在寫作操作之前,包括正確的閱讀檢查,
  這項計畫的目標是:
- 保持緊急聯繫和升級規則在醫療服務中心之外,
  他們包括私人運營數據.
- 在每次事件,演習或重大升級後,

請看 [運營安全](/zh-hant/guide/security/operational-security.md).

## 備份和恢復 {#backups-and-recovery}

- 根據該組織所要求的回收點,
  在非生產主機上,
- 保持簽名基因,釋放元數據,同行配置和關鍵保管
  即使沒有驗證器主機,
- 文件是否從創世過程中重建,恢復
  或是取代失败的同行,
- 沒有任何試驗恢復程序在生產過程中第一次
  這次的事件.

## 改變管理 {#change-management}

- 應將連鎖配置變更當作需要審核的交易,
  預航閱讀,授權和變更後驗證.
- 推出同行二元升級,
  決定點.
- 避免改變同行拓,共識時間和應用程式工作量
  在同一間維護窗口,除非移民計劃要求.
- 記錄交易哈希和區塊高度,

請看 [熱的重載](/zh-hant/guide/advanced/hot-reload.md) 及其他
[互換性矩陣](/zh-hant/reference/compatibility-matrix.md).

## 產能評估 {#capacity-reviews}

- 在驗證器數量,硬件,網絡配置時再執行負載檢查,
  工作負荷混合或共識參數變化.
- 測量溫暖,穩定狀態和預期的峰值負載
  在最好的情況下,
- 比較接受的吞吐量與承諾的吞吐率和排隊深度.
  提交 TPS 超過預約 TPS 網路已經過去了.
  它的可持續性.
