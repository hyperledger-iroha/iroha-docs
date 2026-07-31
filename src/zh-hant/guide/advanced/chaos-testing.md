---
translation_locale: zh-hant
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: dfd2d4196827da3563e377baae2fb823871d7a2c293dfafb6dc4de37f9ddbc61
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 混亂與 Izanami 的試驗 {#chaos-testing-with-izanami}

伊扎納米是上流的混沌網管家. Iroha 工作空間.
開始使用一次性本地 Iroha 集群,提交可配置的工作量;
檢查是否有錯誤的情況.
網路仍在受控失效下取得進步.

使用 Izanami 進行產前韌性檢查,回歸複製,
請不要把它指向一個生產網絡,
設計以擁有它啟動的同級程式,包括同級重新啟動,儲存
片,人工包裝損失, CPU 或磁盤壓.

## 必須的條件 {#prerequisites}

執行 Izanami 的
[Iroha 源存儲庫](https://github.com/hyperledger-iroha/iroha),
沒有本文庫:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

必須明顯允許二進制者建立和操控網絡
請讓我們繼續閱讀. `--allow-net` 每個不屬於...TUI 運行或啟動 `allow_net` 在
這項政策 TUI.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

適用於互動運行配置:

```bash
cargo run -p izanami -- --tui --allow-net
```

伊扎納米持續 TUI 及其他 CLI 在使用者配置目錄下的設定,
在重新使用之前的配置文件之前檢查顯示設定.

## 開始運行 {#baseline-run}

在添加嚴重的錯誤之前, 開始使用一個可複製的基線:

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

這次運行只能成功, 如果集群達到所要求的區塊目標,
在截止日期內繼續取得進展,並保持在可選 p95 範圍下
封鎖間隔的值.

記錄下這個命令, Iroha 該項目的使用方式:
工作負荷配置,目標 TPS, 並在日志上使用延遲值.
其他操作員無法重複相同的故障模式.

## 工作負荷的概率 {#workload-profiles}

Izanami有兩種工作負荷配置文件:

| 專屬資料  | 請使用它                                         | 註冊                                  |
| -------- | -------------------------------------------------- | -------------------------------------- |
| `stable` | 長時間水,可複製的性能檢查 | 喜歡安全的食譜          |
| `chaos`  | 失败路線覆蓋                              | 含有故意無效的食譜 |

請先使用穩定配置文件:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

轉向混亂的形象,

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

沒有明顯的情況下,
允許:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

使用 `--nexus` 跑步時應使用嵌入式 SORA Nexus 來自的默認
在上游工作空間.

## 檢查錯誤 {#fault-controls}

什麼時候 `--faulty` 超過零,至少必須有一個故障情況
預設開啟,且布魯式旗可以是
沒有工作機會 `=false`.

| 錯誤                    | CLI 旗                                   | 它所做的事情                          |
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
| 破壞和重新啟動        | `--fault-enable-crash-restart`             | 同級流程損失與恢復             |
| 清除儲存和重新啟動 | `--fault-enable-wipe-storage`              | 來自失蹤的地區          |
| 不有效的交易垃圾郵件 | `--fault-enable-spam-invalid-transactions` | 接受與拒絕的途徑              |
| 網路延遲時間          | `--fault-enable-network-latency`           | 慢慢的八和延遲的共識訊息 |
| 網路分區        | `--fault-enable-network-partition`         | 暫時的可信同行隔離           |
| P2P 包裝損失          | `--fault-enable-network-packet-loss`       | 應用程式框架流量下降          |
| CPU 壓力               | `--fault-enable-cpu-stress`                | 局部核准和安排壓力   |
| 磁盤飽和度          | `--fault-enable-disk-saturation`           | 地方儲存壓力                     |

僅適用於包裝損失的運行:

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

使用 `--fault-window-start` 及其他 `--fault-window-end` 為了保持控制的
在注射故障之前和後的靜止狀態.
這樣就能更容易辨別起始噪音與故障效應.

## 情景形狀 {#scenario-shapes}

在上游的Izanami目錄中,
的形狀 CLI 您可以用相同的旗模擬這些檔案:

| 情景              | 典型的形狀                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 目標負荷         | `--faulty 0`, 高度 `--tps`, 一名提交人,高 `--max-inflight`                                                         |
| 暫時故障     | 只有在有限的故障窗口內才能啟動崩/重啟                                                                  |
| 包裝損失           | 只能啟動包損失,通常是默認75%的損失率                                                          |
| 停止和恢復 | 使用大批故障同行群組,                                                                    |
| 獨立領導人      | 使用完全一個缺陷的同行,只有網絡分區或包損失故障; Izanami 接下來 Sumeragi 領導者電視測量 |

如果您改變同行數量,工作負荷
文件,故障窗口以及 TPS 這樣的結果很難得到
提供翻譯.

## 需要注意的是什麼 {#what-to-watch}

在運行過程中, 留意使用性能驗證的相同訊號:

- 在每個跑步同行之間的積木高度進行
- 提交,接受,拒絕和截止日期的交易
- 排列深度,排列飽和性及終點反壓
- 檢視變化,恢復路徑,缺失的區塊和缺失的數量
  證書
- RBC 預約時間,待機的會議以及減少或延遲共識流量
- CPU, 存储器,磁盘和網路飽和度在主機上

檢測時間:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

每個區塊都應該發射 `block validation timings` 在 `stateless_ms`,
`execution_ms`, 及其他 `total_ms`. 比較這些時間與p95區塊
在變更之前的間隔,視覺變化計器和排列壓力
這項計畫的目標是:

## 解釋結果 {#interpreting-results}

當所有選項的同行繼續進行阻礙時,
沒有限制,故障不再造成新的恢復
設定窗口結束後的活動.

如果:

- 阻擋超過 `--progress-timeout`
- 相同的高度不同,並不重新融合
- p95 延遲超過 `--latency-p95-threshold`
- 排隊在缺陷窗口關閉後,
- 拒絕或截止日期的交易不由選項
  工作量
- 需要手動重新啟動,儲存擦拭或回收包損失
  清理

在失败後, 再次使用相同的種子和少於一個故障類型.
保持工作負載和時間可重複,同時減少故障
表面.

## 有關頁面 {#related-pages}

- [性能與指標](./metrics.md)
- [跑步 Iroha 在純金屬上](./running-iroha-on-bare-metal.md)
- [Torii 目的地](../../reference/torii-endpoints.md)
