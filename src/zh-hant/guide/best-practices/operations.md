---
translation_locale: zh-hant
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 運營 {#operations}

操作準備意味着網絡可以觀察,更改,備份和恢復而不需要依賴於即興訪問驗證器主機.

## 可觀察性 {#observability}

- 故意啓用遠程測量配置文件.當需要 `/metrics`時使用 `extended` 和在需要詳細的 Sumeragi 操作員路線的測試運行過程中使用 `full`.
- 儀表板接受的吞吐量,拒絕的吞吐力,提交延遲,隊列深度,隊列和度,查看變化,放棄共識消息和存儲壓.
- 在同一事件或基準文物集中保存狀態快照,指標剪輯,日誌和部署配置.
- 警示隨着排隊的持續增長,意外的拒絕峯值,塊高度停滯不前,視角變動和同行健康改變.

查看 [績效和指標](/zh-hant/guide/advanced/metrics.md).

## 跑本 {#runbooks}

- 爲同行重新啓動, Torii 降級,關鍵妥協,許可錯誤,費用贊助商耗盡,排隊和網絡分區症狀編寫運行簿.
- 在寫作操作之前,包括精確的僅閱讀檢查,特別是對同行註冊,授權和參數更改.
- 如果包含私人運營數據,請將緊急聯繫和升級規則排除在備案文件之外.
- 每次事件,練習或重大升級之後,

見 [運營安全](/zh-hant/guide/security/operational-security.md).

## 備份和恢復 {#backups-and-recovery}

- 根據部署所需的恢復點,備份同行存儲. 在非生產主機上驗證恢復.
- 保持簽署的起源,釋放元數據,同行配置和關鍵存儲記錄可恢復,即使沒有驗證器主機.
- 記錄恢復程序是否從生成中重建,從快照中恢復,或者用新身份取代失敗的同行.
- 在生產事件中,不要第一次檢驗恢復程序.

## 變革管理 {#change-management}

- 處理鏈上配置的變化作爲需要審查,飛行前閱讀,授權和變更後驗證的交易.
- 推出兼容性計劃和反彈決定點的同行二進制升級.
- 避免在同一維護窗口中改變同行拓,共識時間和應用工作負載,除非遷移計劃要求這樣做.
- 記錄交易哈希和區塊高度,以進行操作變化.

查看 [熱重載](/zh-hant/guide/advanced/hot-reload.md)和 [兼容性矩陣](/zh-hant/reference/compatibility-matrix.md).

## 產能評估 {#capacity-reviews}

- 當驗證器計數,硬件,網絡配置,工作負載混合或共識參數發生變化時再運行負載檢查.
- 測量升溫,穩定狀態和預期峯值負載,而不是依賴短暫的最佳情況吞吐量樣本.
- 將接受的吞吐量與承諾的吞吐力和隊列深度進行比較. 如果提交的 TPS 超過承諾的 TPS,排隊增長,網絡已經超越了其可持續範圍.
