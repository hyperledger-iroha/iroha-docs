---
translation_locale: zh-hant
translation_source: /guide/advanced/metrics.md
translation_source_hash: 868481b9f7482e936d6c7013557c7ff5334c7bb93fabf74d6eb726e526fb4e43
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 績效和指標 {#performance-and-metrics}

Iroha 的性能取決於工作負載,驗證器拓學,網絡條件和共識設置.因此,單一的 TPS 號碼只有當它與固定配置的基準運行綁定時纔有用.

對於產能規劃,將業績視爲運營範圍:

- 網絡接受所要求的交易率
- 承諾在目標預算內保持延遲
- 交易隊列保持限制
- 共識不依賴於重複的視圖變化或恢復路徑

使用本頁來估計部署是否處於一個特定節點數量,網絡延遲門和目標 TPS 中高,中低或低性能狀態.

## 衡量什麼 {#what-to-measure}

從 Torii 暴露的操作者表面開始:

```bash
export TORII=http://127.0.0.1:8180

curl -s "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

您可以嘗試相同的僅閱讀模式與公衆 Taira:

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

公共的 Taira 指標對於學習信號名稱是有用的.不要用它們作爲自己的部署生產能力數字.

通過 CLI 可獲得相同的共識快照:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

遠程測量可見性取決於配置的個人資料.當需要 `/metrics`時使用`extended`,並且在測試運行期間使用`full`,當您還需要詳細的 Sumeragi 操作員路線時.

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## 性能帶 {#performance-bands}

使用這些頻段進行在目標吞吐量 `Y` TPS 和延遲預算 `L`毫秒的觀察運行.運行工作負載足以包括加熱,穩定狀態和至少一個期預期峯值負載.

|樂隊|條件|這意味着|
| --- | --- | --- |
|很高.|接受的吞吐量達到或超過 `Y`,p95提交延遲低於 `0.8 * L`,排隊保持在容量的10%以下,視頻變換/恢復計數是平的|部署對要求的工作量有空間|
|平均值|接受的吞吐量接近 `Y`,p95提交延遲低於 `L`,排隊穩定在容量的50%以下,視頻變化很少.|部署有效,但爆炸耐受性有限.|
|低調|接受的吞吐量低於 `Y`,p95提交延遲超過 `L`,運行期間排隊增長或視頻變化/反壓計數不斷上升.|要求的工作量至少超過一個瓶.|

關鍵規則是排隊方向. 如果提交的 TPS 比承諾的 TPS 大,並且排隊持續增長,即使短樣本看起來很健康,部署也會過載.

## 節點計數和定數 {#node-count-and-quorum}

更多的驗證器提高了故障耐受性,但增加了協調,簽名和網絡輸出成本. Sumeragi 實施:

- 驗證器計數 `n` 來自錯誤預算 `f = floor((n - 1) / 3)`
- 對於 `n >= 4`來說,提交權限爲 `2f + 1`
- 對於 `n <= 3`,所有驗證器都需要提交.
- 觀察員同行同步區塊,但不投票,提議或收集

|驗證器|錯誤預算|提交定決數|產能說明|
| --- | --- | --- | --- |
|1 至 3 |實際的離線放鬆|所有驗證者|適用於開發和小型測試;任何缺失的驗證器都可能會阻提交.|
| 4 | 1 | 3 |單個故障寬容的常見最低值|
| 7 | 2 | 5 |更具彈性,更多的投票和傳播流量|
| 10 | 3 | 7 |更高的協調成本;網絡和收藏器調整更重要 |

在評估"X節點"時,將投票驗證器與觀察員分開.添加觀察員通常成本低於添加驗證器,但觀察員仍然消耗區塊八,區塊同步,磁盤和網絡帶寬.

## 影響表現的因素 {#factors-that-influence-performance}

### 工作負載形狀 {#workload-shape}

同樣的 TPS 可以是廉價或昂貴的,取決於每筆交易所做的.記錄:

- 每次交易的指令數
- 簽名數量和簽名算法
- 交易字節大小和解壓縮的有效載荷大小
- 閱讀/寫成比例
- 金額數據大小和資產運營
- 智能合同,觸發器和執行成本 IVM
- 查詢負載與相同的同行運行

小額轉讓交易不是合同繁重或超級數據繁重的工作負載的替代品.

### 共識時間 {#consensus-timing}

Sumeragi 的時間由有效的 Sumeragi 參數控制:

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- 在啓用NPoS模式時,NPOS階段時間切斷

檢查它們:

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

較低的時機目標只能在網絡,存儲和執行層能夠跟上時才能提高延遲.一旦查看變化,出現缺失有效載荷或壓力後,降低時間通常會使性能惡化.

### 收藏家Fanout {#collector-fanout}

收藏者設置影響承諾投票的快速融合:

- `sumeragi.collectors.k` 控制了每位選民的投票數量
- `sumeragi.collectors.redundant_send_r`在當地時間停止投票後控制額外的投票
- `sumeragi.collectors.parallel_topology_fanout` 添加了Topology fanout與收藏器一起

在更大或不那麼可靠的網絡中,增加Fanout可以減少尾聲延遲,但也會增加流量.在改變這些值之前,比較總可用性和收藏器遠程測量與延遲和反壓力指標:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### 網絡條件 {#network-conditions}

共識表現是對:

- RTT 在驗證器之間
- 緊張感和包裝損失
- 區塊實用載荷和 RBC 零部件的帶寬
- 區域之間不對稱的聯繫
- NAT,阻礙同行連接的防火牆,或繼電行爲

作爲規劃規則,設定延遲預算足夠高以覆蓋幾個驗證器迴路再加上執行和磁盤提交時間.如果p95網絡 RTT 已經接近所需的p95提交延遲,目標是不現實的.

### 排隊和入學限制 {#queues-and-admission-limits}

接入和排隊設置定義了一個同行可以吸收多少爆壓:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- 基因交易限制,例如最多簽名,命令,字節,和解壓字節
- 排隊限量和共識入境限制

高排隊容量可以隱藏過載量一段時間,但它不會增加可持續的吞吐量.穩定排隊是健康的;不斷增長的排隊是滯後的.

### 硬件和存儲 {#hardware-and-storage}

測量每一個驗證者,不僅僅是領導者:

- CPU 驗證,簽名驗證和執行過程中的度
- 排隊,快照和活躍 RBC 會議的內存壓力
- 區塊存儲和快照的磁盤編寫延遲
- 網絡傳輸/接收度
- 在工作負載中使用時可選的硬件加速設置

最慢的投票驗證器可以決定網絡的尾聲延遲.

## 承諾的信號 {#prometheus-signals}

根據構建配置文件和功能集,計量名稱可能會有所不同.首先檢查 `/metrics` 在節點上,然後在可用的系列周圍構建儀表板.

常見信號包括:

|信號|普羅梅蒂烏斯的例子|什麼要看|
| --- | --- | --- |
|已接受的吞吐量|`sum(rate(txs{type="accepted"}[5m]))`|在穩定狀態下應達到或超過目標 TPS |
|拒絕|`sum(rate(txs{type="rejected"}[5m]))`|應通過測試計劃解釋|
|承諾延遲|`histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))`|比較p95/p99與延遲預算|
|排隊深度|`queue_size`, `sumeragi_tx_queue_depth` |應在高負載期間保持限制.|
|排列度|`sumeragi_tx_queue_saturated`|持續的非零值平均過載量|
|查看變更|`view_changes`, `sumeragi_view_change_suggest_total`,`sumeragi_view_change_install_total` |增加的值表明時間,拓物質,有效載荷或網絡問題|
|丟棄的消息|`dropped_messages`, `sumeragi_consensus_message_handling_total` |在負載期間的下降通常解釋了延遲峯值|
|RBC 壓力|`sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` |非零壓力點對有效載荷回收或存儲瓶|
|提交定決數|`sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |已計數的簽名應該迅速達到所需的共數.|

如果僅在 `/v1/sumeragi/status` 中存在一個指標,則將 JSON 的快照捕捉到與Prometheus痕相同的運行文物中.

## 估計工作流程 {#estimation-workflow}

1. 定義情況:
   - 驗證器和觀察員的數量
   - 共識模式
   - 目標 TPS
   - 承諾延遲預算 p95 和 p99
   - 交易組合
   - 預期網絡 RTT, jitter,帶寬
2. 記錄有效的配置:

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. 運行工作負載到目標 TPS.
4. 在運行開始,中期和結束時捕獲狀態和指標.
5. 按性能帶表進行分類.
6. 如果頻段是中等或低,一次換一個因素,然後重複.

## 基準報告模板 {#benchmark-report-template}

僅用足夠的文本來複製表現數字發佈:

- Iroha 承諾,釋放和特徵旗
- 驗證器和觀察員的數量
- 共識模式和 Sumeragi 參數
- 收藏器 `k`,冗餘發射器 `r`,和拓表
- 遠程測量資料
- 硬件,存儲和 OS 詳細信息
- 網絡 RTT, jitter,損失和帶寬假設
- 交易組合和實用負載大小
- 提供 TPS 和運行時間
- 接受/拒絕 TPS
- p50/p95/p99 提交延遲
- 排隊深度和度
- 查看變化,丟棄消息,壓力 RBC 和缺失有效載荷計數器
- CPU,每個驗證器的內存,磁盤和網絡使用量

如果沒有這些細節, TPS 號碼應該被視爲事.

## 相關頁面 {#related-pages}

- [混沌測試與 Izanami](./chaos-testing.md)
- [Torii 終端點](../../reference/torii-endpoints.md)
- [通過 CLI](../../get-started/operate-iroha-via-cli.md)運行 Iroha 3
- [同行配置參考](../../reference/peer-config/params.md)
