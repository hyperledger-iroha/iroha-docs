---
translation_locale: zh-hant
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: dfd2d4196827da3563e377baae2fb823871d7a2c293dfafb6dc4de37f9ddbc61
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 混沌測試與Izanami {#chaos-testing-with-izanami}

Izanami是上游 Iroha 工作空間中的混沌網管.它啓動一次性本地 Iroha 集羣,提交可配置的工作負載,並將故障注入選定的同行中,以便運營商可以檢查網絡是否在受控故障下繼續取得進展.

使用 Izanami 進行產前彈性檢查,迴歸複製和共識調整.不要指向生產網絡:該工具旨在擁有它啓動的同行,包括同行重新啓動,存儲 wipes,人工包損失以及本地 CPU 或磁盤壓力.

## 預先條件 {#prerequisites}

運行 Izanami 從 [Iroha 源存儲庫](https://github.com/hyperledger-iroha/iroha),而不是從本文檔存儲庫:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

必須明確允許二進制器創建和操縱網絡同行.通過 `--allow-net` 每次非 TUI 運行,或啓用 `allow_net` 在 TUI 中.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

對於交互式運行配置:

```bash
cargo run -p izanami -- --tui --allow-net
```

在用戶配置目錄中, Izanami 仍然存在 TUI 和 CLI 設置,因此在重新使用之前的個人資料之前,請檢查顯示的設置.

## 基線運行 {#baseline-run}

在添加嚴重故障之前,開始使用一個可複製的基線:

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

這個運行只能成功,如果集羣達到所要求的區塊目標,在截止時間內繼續取得進展,並且保持在可選的p95區塊間隔門以下.

記錄命令,種子, Iroha 提交,同行數量,故障同行數值,工作負載配置文件,目標 TPS 和延遲門.如果沒有這些值,另一個操作員無法重複相同的失敗模式.

## 工作負載配置文件 {#workload-profiles}

 Izanami 有兩個工作負載配置文件:

|個人資料|用它來|備忘錄|
| -------- | -------------------------------------------------- | -------------------------------------- |
|`stable`|長時間的浸泡運行和可複製性性能檢查|喜歡安全的食譜|
|`chaos`|失敗路徑覆蓋率|包含故意無效的食譜|

首先使用穩定配置文件:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

如果已經理解了基線,就轉向混亂的配置文件:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

在穩定運行中禁用合同部署配方,除非明確允許:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

使用 `--nexus` 運行時應使用從上游工作空間內嵌的默認 SORA Nexus

## 錯誤控制 {#fault-controls}

當 `--faulty` 超過零時,必須啓用至少一個故障場景.故障將默認切換爲啓動,並且可以使用 `=false` 禁用布魯爾旗.

|錯誤|CLI 旗|它所做的一切|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|崩和重新啓動|`--fault-enable-crash-restart`|同行流程損失和恢復|
|擦除存儲和重新啓動|`--fault-enable-wipe-storage`|在失蹤的地方狀態中恢復|
|無效的交易垃圾郵件|`--fault-enable-spam-invalid-transactions`|錄取和拒絕的路徑|
|網絡延遲|`--fault-enable-network-latency`|緩慢的八和延遲的共識信息|
|網絡分區|`--fault-enable-network-partition`|暫時的可信同行隔離|
|P2P 包裝損失|`--fault-enable-network-packet-loss`|應用程序框架流量下降|
|CPU 壓力|`--fault-enable-cpu-stress`|局部驗證和規劃壓力|
|磁盤度|`--fault-enable-disk-saturation`|局部存儲壓力|

對於只輸入包的運行:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 20 \
  --faulty 5 \
  --duration 800s \
  --fault-window-start 133s \
  --fault-window-end 266s \
  --tps 200 \
  --submitters 20 \
  --max-inflight 512 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=false \
  --fault-enable-network-packet-loss=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --fault-network-packet-loss-percent 75 \
  --seed 42
```

使用 `--fault-window-start` 和 `--fault-window-end` 保持注射故障之前和之後的控制穩定狀態時期. 這使得更容易區分啓動噪音與故障的影響.

## 場景的形狀 {#scenario-shapes}

上游的Izanami目錄將常見的區塊鏈通信失敗形狀映射到 CLI 配置文件.你可以用相同的旗來建模它們:

|場景|典型的形狀|
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|目標載荷|`--faulty 0`,高`--tps`,一個提交人,高 `--max-inflight` |
|暫時故障|只有在有限的故障窗口內啓動機/重啓|
|包裝損失|僅允許輸出數據包,通常是默認的75%的丟失率.|
|停止和恢復|使用大量的故障同行羣體與崩/重新啓動|
|領導人隔離|使用完全一個錯誤的同行,只有網絡分區或數據包丟失故障; Izanami 遵循 Sumeragi 領先的遠程測量|

如果您同時改變同行數量,工作負載配置文件,故障窗口和 TPS,結果就很難解釋.

## 需要注意的是什麼? {#what-to-watch}

在運行期間,注意用於性能驗證的同樣的信號:

- 在每一個跑步同行的塊高度進展
- 提交,接受,拒絕和截止期的交易
- 排隊深度,排隊和終點反壓力
- 查看變化,恢復路徑,缺失的區塊和缺失的定製證書
- RBC 滯後,待定會議和降低或延遲共識流量
- CPU,存儲器,磁盤和網絡度在運行同行的主機上

爲了驗證延遲分析,請啓用主循環調試日誌:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

每個區塊應發射 `block validation timings` 與 `stateless_ms`, `execution_ms` 和 `total_ms`.在改變共識計時器之前,將這些時間與 p95 區塊間隔,視圖變換計數器和隊列壓力進行比較.

## 解釋結果 {#interpreting-results}

當所有選擇的同行繼續提交區塊時,對運行進行健康處理,後載不增長而無限,並且設置窗口結束後故障停止導致新的恢復活動.

處理運行爲失敗時:

- 長於 `--progress-timeout`的區塊進步攤位
- 同等高度的差異,不重聚
- 延遲 p95超過 `--latency-p95-threshold`
- 一個故障窗口關閉後,排隊在剩餘的運行中增長.
- 拒絕或截止期的交易不因選定的工作負載而解釋
- 需要手動清理.

在失敗後,再使用相同的種子和一個較少的故障類型. 這使得工作負載和時間可重複,同時縮小故障表面.

## 相關頁面 {#related-pages}

- [性能和指標](./metrics.md)
- [運行 Iroha 在 Bare Metal](./running-iroha-on-bare-metal.md) 上
- [Torii 終端點](../../reference/torii-endpoints.md)
