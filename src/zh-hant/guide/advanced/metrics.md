---
translation_locale: zh-hant
translation_source: /guide/advanced/metrics.md
translation_source_hash: 868481b9f7482e936d6c7013557c7ff5334c7bb93fabf74d6eb726e526fb4e43
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 性能與指標 {#performance-and-metrics}

Iroha 性能取決於工作負載,驗證器拓,網絡
沒有任何可能的情況, TPS 因此, 數字只能有用
當它與固定配置的基准行程結合時.

對於容量規劃,將性能當作運營範圍:

- 網路接受所要求的交易率
- 在目標預算內承諾延遲保持
- 交易排隊保持限制
- 共識不依賴重複的視覺變化或恢復路徑

使用這個頁面來估算部署是否在高,中等或低
數量節點的性能狀態,網路延遲值和目標
TPS.

## 衡量什麼? {#what-to-measure}

開始由操作者表面暴露 Torii:

```bash
export TORII=http://127.0.0.1:8180

curl -s "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

您可以試用相同的單純閱讀模式, Taira:

```bash
TAIRA=https://taira.sora.org

curl -fsS "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/status" \
  | jq '{healthy: .health.healthy, peers, samples_used, rtt_count: .rtt.count}'

curl -fsS "$TAIRA/metrics" \
  | grep -E '^(block_height|queue_size|sumeragi_tx_queue_depth|txs|view_changes)' \
  | head -n 20
```

公眾 Taira 數據是學習訊號名稱的好處.
提供您自己的產能數據.

透過網路提供相同的共識快照. CLI:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

視覺化取決於設定的配置文件. `extended` 當你
需要 `/metrics`, 及使用 `full` 在測試過程中,
Sumeragi 運營者路線.

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## 表演帶 {#performance-bands}

在目標吞吐量下使用這些頻段進行觀察 `Y` TPS 及延遲時間
預算 `L` 執行工作量足夠長,
穩定狀態,至少有一段期的預期峰值負荷.

| 樂團 | 條件 | 含義 |
| --- | --- | --- |
| 很高 | 接受的吞吐量在或以上 `Y`, p95 提交延迟低於此 `0.8 * L`, 排隊仍低於 10% 的容量,視覺變化/恢復計器是平坦的 | 該部署有適當的工作空間 |
| 平均值 | 接受的吞吐量接近 `Y`, p95 提交延迟低於此 `L`, 排隊穩定於容量的50%以下,視頻變化很少 | 部署有效, 但爆炸耐受性有限. |
| 低價 | 接受的吞吐量低於以下 `Y`, p95 提交延迟超過 `L`, 在運行過程中排隊增長,或視覺變化/逆壓計數持續上升 | 要求的工作量至少超過一個瓶頸 |

如果提交, TPS 超過預約 TPS
且排隊持續增長,
這樣看起來很健康.

## 結號數量和排序率 {#node-count-and-quorum}

更多的驗證機提高錯誤耐受性,
在目前的情況下, Sumeragi 實施:

- 認證人數量 `n` 導致故障預算 `f = floor((n - 1) / 3)`
- 關於 `n >= 4`, 委托人數是 `2f + 1`
- 關於 `n <= 3`, 所有驗證者都需要承諾
- 觀察者同行同步區塊,但不會投票,提議或收集

| 認證器 | 錯誤預算 | 請提交定制 | 容量公告 |
| --- | --- | --- | --- |
| 1 至 3 | 沒有實際的無線放鬆 | 所有驗證劑 | 適用於開發和小型測試;任何缺失的驗證器都可能會阻礙提交 |
| 4 | 1 | 3 | 單次錯誤容忍的共同最低限度 |
| 7 | 2 | 5 | 更具彈性,有更多的投票和傳播流量 |
| 10 | 3 | 7 | 高度的協調成本; 網絡和收藏器調整更重要 |

在評估"X結節"時, 隔離投票驗證者與觀察者.
觀察員通常成本低於增加驗證劑,
阻擋八,阻礙同步,

## 影響表達的因素 {#factors-that-influence-performance}

### 工作負荷的形狀 {#workload-shape}

這也是一樣的. TPS 交易可能是便宜或昂貴的,
紀錄:

- 每次交易的指示數量
- 簽名數和簽名算法
- 交易字节大小和解壓縮的有效負荷大小
- 閱讀/寫作比例
- 數據大小和資產運營
- 智能合約,觸發器和 IVM 執行成本
- 查詢負荷與相同的同行進行

小額轉移交易並不是合同繁重或數據繁重的代理
工作負荷.

### 協調時間 {#consensus-timing}

Sumeragi 該時間由有效的 Sumeragi 參數:

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- 在啟動的 NPoS 模式時,

檢查他們使用:

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

只有在網路,儲存和
執行層可以跟上. 一旦查看變更,
顯示下降時間通常會使性能惡化.

### 收藏家Fanout {#collector-fanout}

收藏者設定會影響提交票的快速融合:

- `sumeragi.collectors.k` 控制每位收藏人收集多少票,
- `sumeragi.collectors.redundant_send_r` 控制了投票後的額外投票.
  地方時間
- `sumeragi.collectors.parallel_topology_fanout` 加入前列表,
  收藏者

在較大的或更不可靠的網絡中,
比較總可用性和收藏量,
在改變這些值之前,使用延遲和反壓力指數的遠隔測量:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### 網路條件 {#network-conditions}

協調表達對以下因素很敏感:

- RTT 在驗證人之間
- 緊張感與包裝損失
- 區塊使用負荷的頻寬, RBC 碎片
- 區域之間的不對称關係
- NAT, 防火牆或連接行為會延遲同行聯繫

預算延遲時間是足夠高的,
如果 p95 網絡 RTT 是的
目標是不切實的.

### 排隊及入場限制 {#queues-and-admission-limits}

接入和排列設定定義了一個同行可以吸收多少爆炸壓力:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- 基因交易限制,例如最大的簽名,指示,字节和
  解壓式字节
- p2p排隊限制和共識入場限制

排隊的容量很高, 可以暫時隱藏過載,
穩定排隊是健康的;

### 硬件和儲存 {#hardware-and-storage}

測量每位認證者, 不僅是領袖:

- CPU 在驗證,簽名驗證和執行過程中飽和性
- 來自排列,快照和活動的記憶壓 RBC 活動
- 顯示器存儲時間及快照
- 網路傳送/接收飽和性
- 在工作負荷使用時,可選的硬件加速設定

這樣的數據可以顯示網路的延遲速度.

## 普羅梅泰斯的訊號 {#prometheus-signals}

數據名稱可能因建立配置文件和功能組而不同. `/metrics` 在
首先建立您的結,然後在可用的系列上建立仪表板.

常見的訊號包括:

| 訊號 | 普羅梅泰斯的例子 | 觀看什麼? |
| --- | --- | --- |
| 接受的吞吐量 | `sum(rate(txs{type="accepted"}[5m]))` | 必須滿足或超過目標 TPS 在穩定狀態 |
| 拒絕 | `sum(rate(txs{type="rejected"}[5m]))` | 檢測計劃應該可以解釋 |
| 預約延遲時間 | `histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` | 比較p95/p99與延遲預算 |
| 排隊深度 | `queue_size`, `sumeragi_tx_queue_depth` | 在重量充電時必須保持限制 |
| 排列的飽和度 | `sumeragi_tx_queue_saturated` | 維持非零值的平均過載 |
| 查看變更 | `view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` | 增加的數值顯示時間,拓物流,有效載荷或網路故障 |
| 已被丟掉的訊息 | `dropped_messages`, `sumeragi_consensus_message_handling_total` | 負載量下降通常會導致延遲升 |
| RBC 壓力 | `sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` | 沒有零的壓力點,以回收或儲存有效負荷的瓶頸 |
| 請提交定制 | `sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` | 數字的簽名必須迅速達到所需的共識. |

當一個數值只存在於 `/v1/sumeragi/status`, 捕捉這些 JSON 快速截圖
像普羅梅蒂奧斯的破碎物一樣.

## 估計工作流程 {#estimation-workflow}

1. 定義情況:
   - 核准者和觀察者數量
   - 協調方式
   - 目標 TPS
   - 預算 p95 和 p99 承諾延遲
   - 交易混合物
   - 預期的網路 RTT, 排放速度和頻率
2. 記錄有效配置:

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. 在目標上執行工作負荷 TPS.
4. 在開始,中期和終點的情況及指標.
5. 按性能帶表分類跑步.
6. 如果頻率是中低,

## 基准報告模板 {#benchmark-report-template}

僅提供足夠的文脈,才能複製性能數字:

- Iroha 提交,釋放和功能旗
- 驗證人和觀察者數量
- 協調方式和 Sumeragi 參數
- 收藏人 `k`, 冗長的發送 `r`, 及地表分析
- 遠隔測量圖表
- 硬件,儲存和 OS 細節
- 網路 RTT, 關鍵字:
- 交易混合和有效負荷尺寸
- 提供 TPS 及運行時間
- 接受/拒絕 TPS
- p50/p95/p99 提交延迟
- 排隊深度和飽和性
- 查看變更,丟掉的訊息, RBC 壓力和缺失有效載荷計器
- CPU, 每個驗證器的記憶體,磁盤和網路使用量

沒有這些細節, TPS 該數字應被視為有史無前例.

## 有關頁面 {#related-pages}

- [混亂與 Izanami 的試驗](./chaos-testing.md)
- [Torii 目的地](../../reference/torii-endpoints.md)
- [運行 Iroha 3 透過 CLI](../../get-started/operate-iroha-via-cli.md)
- [同級配置參考](../../reference/peer-config/params.md)
