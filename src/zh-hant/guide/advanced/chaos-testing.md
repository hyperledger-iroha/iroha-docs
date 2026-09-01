---
translation_locale: zh-hant
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: 5ceee448217a42e4f8bbae9595486b79019e7a880dfd0f2c71bf580409d0e4b9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 混沌測試與Izanami {#chaos-testing-with-izanami}

Izanami是上游 Iroha 工作空間中的混沌網管.它啟動一次性本地 Iroha 叢集,提交可配置的工作負載,並將故障注入選定的對等節點中,以便運營商可以檢查網路是否在受控故障下繼續取得進展.

使用 Izanami進行產前彈性檢查,迴歸複製和共識調整.不要指向生產網路:該工具旨在擁有它啟動的對等節點,包括對等節點重啟,儲存 wipes,臨時可信任對等節點分割槽和本地 CPU 或磁碟壓力.

## 預先條件 {#prerequisites}

執行 Izanami 從 [Iroha 源儲存庫](https://github.com/hyperledger-iroha/iroha),而不是從本文件儲存庫:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

必須明確允許二進位制器建立和操縱網路對等節點.透過 `--allow-net` 每次非 TUI 執行,或啟用 `allow_net` 在 TUI 中.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

對於互動式執行配置:

```bash
cargo run -p izanami -- --tui --allow-net
```

在使用者配置目錄中, Izanami 仍然保留 TUI 和 CLI 設定.首次釋出的檔案有一個明確的 V1 佈局位元組;預發或其他未版本的設定被拒絕,並且應該重建而不是遷移.在重新使用當前的配置檔案之前,請檢視顯示的設定.

## 基線執行 {#baseline-run}

在新增嚴重故障之前,開始使用一個可複製的基線:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --target-blocks 100 \
  --progress-interval 15s \
  --progress-timeout 120s \
  --latency-p95-threshold 2s \
  --tps 15 \
  --max-inflight 32 \
  --submitters 1 \
  --seed 42
```

這個執行只能成功,如果叢集達到所要求的區塊目標,在截止時間內繼續取得進展,並且保持在可選的p95區塊間隔門以下.

記錄命令,種子, Iroha 提交,對等節點數量,故障對等節點數值,工作負載配置檔案,目標 TPS 和延遲門.如果沒有這些值,另一個操作員無法重複相同的失敗模式.

## 工作負載配置檔案 {#workload-profiles}

 Izanami 有兩個工作負載配置檔案:

|個人資料|用它來|備忘錄|
| -------- | -------------------------------------------------- | -------------------------------------- |
|`stable`|長時間的浸泡執行和可複製性效能檢查|喜歡安全的操作指南|
|`chaos`|失敗路徑覆蓋率|包含故意無效的操作指南|

首先使用穩定配置檔案:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

如果已經理解了基線,就轉向混亂的配置檔案:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

在穩定執行中禁用合同部署操作指南,除非明確允許:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

使用 `--nexus` 執行時應使用從上游工作空間內嵌的預設 SORA Nexus

## 錯誤控制 {#fault-controls}

當 `--faulty` 超過零時,必須啟用至少一個故障場景.故障將預設切換為啟動,並且可以使用 `=false` 禁用布魯爾旗.

|錯誤|CLI 旗|它所做的一切|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|崩和重新啟動|`--fault-enable-crash-restart`|對等節點流程損失和恢復|
|擦除儲存和重新啟動|`--fault-enable-wipe-storage`|在失蹤的地方狀態中恢復|
|無效的交易垃圾郵件|`--fault-enable-spam-invalid-transactions`|錄取和拒絕的路徑|
|網路延遲|`--fault-enable-network-latency`|緩慢的八和延遲的共識資訊|
|網路分割槽|`--fault-enable-network-partition`|暫時的可信對等節點隔離|
|CPU 壓力|`--fault-enable-cpu-stress`|區域性驗證和規劃壓力|
|磁碟度|`--fault-enable-disk-saturation`|區域性儲存壓力|

對於只為網路分割槽執行:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --fault-window-start 60s \
  --fault-window-end 180s \
  --tps 15 \
  --submitters 1 \
  --max-inflight 32 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --seed 42
```

使用 `--fault-window-start` 和 `--fault-window-end` 保持注射故障之前和之後的控制穩定狀態時期. 這使得更容易區分啟動噪音與故障的影響.

## 場景的形狀 {#scenario-shapes}

上游的Izanami目錄將常見的區塊鏈通訊失敗形狀對映到 CLI 配置檔案.你可以用相同的旗來建模它們:

|場景|典型的形狀|
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|目標載荷|`--faulty 0`,高`--tps`,一個提交人,高 `--max-inflight` |
|暫時故障|只有在有限的故障視窗內啟動機/重啟|
|停止和恢復|使用大量的故障對等節點群體與崩/重新啟動|
|領導人隔離|使用一個錯誤的對等節點,只有網路分割槽錯誤; Izanami 遵循 Sumeragi 的領先遠端測量.|

每次應固定一個變數。如果在同一次執行中同時變更對等節點數量、工作負載設定檔、故障視窗和 TPS，結果將難以解釋。

## 需要注意的是什麼? {#what-to-watch}

在執行期間,注意用於效能驗證的同樣的訊號:

- 在每一個跑步對等節點的塊高度進展
- 提交,接受,拒絕和截止期的交易
- 排隊深度,排隊和端點反壓力
- 檢視變化,恢復路徑,缺失的區塊和缺失的法定人數證書
- 簽署的 RS16 可用性後期記錄,待定會議和延遲共識流量.
- CPU,儲存器,磁碟和網路度在執行對等節點的主機上

為了驗證延遲分析,請啟用主迴圈除錯日誌:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

每個區塊都應發出 `block validation timings` 與 `stateless_ms`, `execution_ms` 和 `total_ms`.在改變共識計時器之前,將這些時間與 p95 區塊間隔,檢視變換計數器和佇列壓力進行比較.

## 解釋結果 {#interpreting-results}

當所有選擇的對等節點繼續提交區塊時,對執行進行健康處理,後載不增長而無限,並且設定視窗結束後故障停止導致新的恢復活動.

處理執行為失敗時:

- 長於 `--progress-timeout`的區塊進步攤位
- 同等高度的差異,不重聚
- 延遲 p95超過 `--latency-p95-threshold`
- 一個故障視窗關閉後,排隊在剩餘的執行中增長.
- 拒絕或截止期的交易不因選定的工作負載而解釋
- 對等節點重新啟動、儲存空間清除或分割區復原都需要手動清理。

在失敗後,再使用相同的種子和一個較少的故障型別. 這使得工作負載和時間可重複,同時縮小故障表面.

## 相關頁面 {#related-pages}

- [效能和指標](./metrics.md)
- [執行 Iroha 在 Bare Metal](./running-iroha-on-bare-metal.md) 上
- [Torii 端點](../../reference/torii-endpoints.md)
