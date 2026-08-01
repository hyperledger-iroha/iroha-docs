---
translation_locale: zh-hant
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 984957526424a4e0ec9f29a6da1bb64699245bb135e8157bbe684bc3d87de4cc
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 發布準備 {#release-readiness}

在將 Iroha 應用程式或網路變更推進到下一階段前，先在足以暴露相關風險的最小環境中驗證其行為，再審慎通過共享測試網與正式環境的關卡。

## 本機網路關卡 {#localnet-gate}

- 啟動可拋棄的本機網路，使用相同的 Iroha 發行軌道，並採用實務上最接近正式環境的驗證者數量。
- 對交易建構器、查詢解析、拒絕處理與設定載入執行單元測試。
- 透過應用程式日後會使用的相同 SDK 或 CLI 介面，測試最小且可成功完成的讀取與寫入路徑。
- 在測試成品中記錄預期的交易雜湊、狀態、事件與狀態讀取結果。

請參閱[啟動 Iroha 3](/zh-hant/get-started/launch-iroha.md)與 [SDK 教學](/zh-hant/guide/tutorials/)。

## 共享測試網關卡 {#shared-testnet-gate}

- 使用 Taira 或其他共享測試網，驗證端點行為、費用、帳戶資金、延遲，並演練維運程序。
- 即時測試網寫入應保持為選擇啟用，避免一般測試執行依賴網路可用性或耗用測試網資金。
- 提交每筆即時測試交易前，確認簽署者資金、費用資產中繼資料、權限與預期狀態。
- 等待交易進入最終狀態，再以唯讀查詢驗證產生的狀態。

請參閱[在 SORA 3 上建置：Taira 與 Minamoto](/zh-hant/get-started/sora-nexus-dataspaces.md)。

## 主網或正式環境關卡 {#mainnet-or-production-gate}

- 正式環境須使用獨立的簽署者、資金、網域與設定路徑。不得沿用測試網金鑰或水龍頭相關假設。
- 使用[相容性矩陣](/zh-hant/reference/compatibility-matrix.md)確認所需的跨 SDK 情境。另外固定並測試部署實際使用的 CLI、對等節點執行檔、設定與網路版本。
- 在發布時段前審查權限、費用贊助、速率限制、監控、備份狀態與回滾條件。
- 高影響寫入必須具備書面的交易或移轉計畫。

## 回滾與復原 {#rollback-and-recovery}

- 定義哪些變更可透過程式碼部署回滾、哪些需要鏈上交易，以及哪些無法直接復原。
- 對於鏈上資料變更，請在第一次寫入正式環境之前準備補償交易或移轉指令碼。
- 對於網路變更，發布期間應保留上一版執行檔、設定套件、已簽署的創世區塊資料與維運手冊。
- 依拒絕率、佇列成長、延遲或對等節點健康狀態等客觀訊號，設定中止推出的決策點。

## 最終檢查清單 {#final-checklist}

- 設定依環境區分，且不包含僅供測試使用的機密資訊。
- 交易重試行為具冪等性，或具有明確的次數上限。
- 應用程式能區分拒絕、逾期、逾時與端點不可用等失敗情況。
- 監控涵蓋輸送量、延遲、佇列深度、拒絕、視圖變更與相關業務事件。
- 維運人員備有預期失敗模式的操作手冊。
- 安全審查已涵蓋金鑰保管、權限、網路暴露範圍與自動化權限。
