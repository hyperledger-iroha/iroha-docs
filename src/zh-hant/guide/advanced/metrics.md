---
translation_locale: zh-hant
translation_source: /guide/advanced/metrics.md
translation_source_hash: fc62efbb6100308bb7a929e18c9c8b6860372abd6d0009616ea63d7c77b6b1eb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# 績效和指標 {#performance-and-metrics}

Iroha 的效能取決於工作負載,驗證器拓撲,網路條件和共識設定.因此,單一的 TPS 號碼只有當它與固定配置的基準執行繫結時才有用.

對於產能規劃,將業績視為運營範圍:

- 網路接受所要求的交易率
- 提交在目標預算內保持延遲
- 交易佇列保持限制
- 共識不依賴於重複的檢視變化或恢復路徑

使用本頁來估計部署是否處於一個特定節點數量,網路延遲門和目標 TPS 中高,中低或低效能狀態.

## 衡量什麼 {#what-to-measure}

開始使用公開節點快照和Prometheus抓取,然後使用 CLI 為操作員認證共識狀態.目標節點必須允許操作員金鑰,並且只有在執行時載入:

```bash
export TORII=http://127.0.0.1:8180
export OPERATOR_KEY_FILE=./secrets/operator.key

curl -s -H 'Accept: application/json' "$TORII/status" | jq .
curl -s "$TORII/metrics" > metrics.prom

iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi status
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi qc
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

公共 Taira 有用於學習匿名節點快照的形狀.其操作員診斷是故意沒有 Taira 運算子金鑰可用的:

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/now" \
  | jq '{now_ms, offset_ms}'
```

不要用公共測試網觀測作為生產能力數字用於自己的部署.

遠端測量可見性取決於配置的配置檔案. `operator`使狀態和診斷快照能夠實現. `extended`增加`/metrics`和昂貴的時間,而 `developer`在不啟用`/metrics`的情況下新增了領導者, QC,引數和證據等開發者的快照.當一個執行需要兩組時使用 `full`. `telemetry_profile`是唯一的首次釋出的遙測開關.

```toml
telemetry_profile = "full"
```

## 效能帶 {#performance-bands}

使用這些頻段進行在目標吞吐量 `Y` TPS 和延遲預算 `L`毫秒的觀察執行.執行工作負載足以包括加熱,穩定狀態和至少一個期預期峰值負載.

|樂隊|條件|這意味著|
| --- | --- | --- |
|很高.|接受的吞吐量達到或超過 `Y`,p95提交延遲低於 `0.8 * L`,排隊保持在容量的10%以下,影片變換/恢復計數是平的|部署對要求的工作量有空間|
|平均值|接受的吞吐量接近 `Y`,p95提交延遲低於 `L`,排隊穩定在容量的50%以下,影片變化很少.|部署有效,但爆炸耐受性有限.|
|低調|接受的吞吐量低於 `Y`,p95提交延遲超過 `L`,執行期間排隊增長或影片變化/反壓計數不斷上升.|要求的工作量至少超過一個瓶.|

關鍵規則是排隊方向. 如果提交的 TPS 比提交的 TPS 大,並且排隊持續增長,即使短樣本看起來很健康,部署也會過載.

## 節點計數和定數 {#node-count-and-quorum}

更多的驗證器提高了故障耐受性,但增加了協調,簽名和網路輸出成本. Sumeragi 協議要求:

- 一個確切的 `n = 3f + 1` 投票委員會
- `4 <= n <= 31`,所以有效尺寸是4,7,10等
- 一個 `2f + 1` 的委託定製.
- 觀察員對等節點同步區塊,但不投票,提議或收集

|驗證器|錯誤預算|提交定決數|產能說明|
| --- | --- | --- | --- |
| 4 | 1 | 3 |單個故障寬容的常見最低值|
| 7 | 2 | 5 |更具彈性,更多的投票和傳播流量|
| 10 | 3 | 7 |更高的協調成本;網路和輸入調整更重要|
| 31 | 10 | 21 |第一個版本支援的最大委員會；請謹慎進行協調和簽章成本的基準測試|

創世生成和啟動驗證拒絕不符合委員會大小;不要將釋出不能承認的拓撲進行比較.

在評估"X節點"時,將投票驗證器與觀察員分開.新增觀察員通常成本低於新增驗證器,但觀察員仍然消耗區塊八,區塊同步,磁碟和網路頻寬.

## 影響表現的因素 {#factors-that-influence-performance}

### 工作負載形狀 {#workload-shape}

同樣的 TPS 可以是廉價或昂貴的,取決於每筆交易所做的.記錄:

- 每次交易的指令數
- 簽名數量和簽名演算法
- 交易位元組大小和解壓縮的有效載荷大小
- 閱讀/寫成比例
- 金額資料大小和資產運營
- 智慧合同,觸發器和執行成本 IVM
- 查詢負載與相同的對等節點執行

小額轉讓交易不是合同繁重或超級資料繁重的工作負載的替代品.

### 統一時間 {#consensus-cadence}

有效的 Sumeragi 引數快照包含已簽署的不可變區塊序列和時鐘漂移界限:

- `block_cadence_ms`
- `max_clock_drift_ms`

檢查它們:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

`block_cadence_ms` 由已簽署的創世設定提交並在啟動時凍結；它不是即時調校旋鈕。對於具有不同已簽署創世輸入的網路，只能將它們作為獨立的基準測試情境進行比較。一旦出現檢視變更、有效載荷缺失擷取或背壓，更短的節奏通常只會讓過載更明顯，而不會提高可持續吞吐量。

### 候選人和入境限制 {#candidate-and-ingress-bounds}

節點本地 Sumeragi 界限確定驗證器可以保留多少候選和恢復工作:

- `sumeragi.block.max_transactions`
- `sumeragi.block.max_payload_bytes`
- `sumeragi.block.proposal_queue_scan_multiplier`
- `sumeragi.queues.commands`
- `sumeragi.queues.bodies`和`sumeragi.queues.body_bytes`
- `sumeragi.queues.body_source_bytes`, `sumeragi.queues.chunks`,和 `sumeragi.queues.ready_bodies`

太小的界限會產生佇列或有效負載恢復壓力;大尺寸的界限增加了保留的記憶體和對虐待對等節點可用的工作量.在一次改變一個界限之前,比較診斷快照與過程記憶體,資訊處理和缺失體度指標:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
```

### 網路條件 {#network-conditions}

共識表現是對:

- RTT 在驗證器之間
- 緊張感和包裝損失
- 區塊有效載荷和簽署的 RS16 零部件頻寬
- 區域之間不對稱的聯絡
- NAT,阻礙對等節點連線的防火牆,或繼電行為

作為規劃規則,設定延遲預算足夠高以覆蓋幾個驗證器迴路再加上執行和磁碟提交時間.如果p95網路 RTT 已經接近所需的p95提交延遲,目標是不現實的.

### 排隊和入學限制 {#queues-and-admission-limits}

接入和排隊設定定義了一個對等節點可以吸收多少爆壓:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.max_retained_bytes`
- `queue.transaction_time_to_live_ms`
- 創世交易限制,例如最多簽名,命令,位元組,和解壓位元組
- p2p 佇列上限與共識入口限制

高排隊容量可以隱藏過載量一段時間,但它不會增加可持續的吞吐量.穩定排隊是健康的;不斷增長的排隊是滯後的.

### 硬體和儲存 {#hardware-and-storage}

測量每一個驗證者,不僅僅是領導者:

- CPU 驗證,簽名驗證和執行過程中的度
- 從佇列,快照和有效載荷恢復緩衝的記憶體壓力
- 區塊儲存和快照的磁碟編寫延遲
- 網路傳輸/接收度
- 在工作負載中使用時可選的硬體加速設定

最慢的投票驗證器可以決定網路的尾聲延遲.

## 承諾的訊號 {#prometheus-signals}

指標名稱來自已簽入版本控制的遙測目錄。時序資料的可用性和取樣方式取決於建置功能與 `telemetry_profile`，因此請先檢查目標節點上的 `/metrics`，再建立儀錶板。

常見訊號包括:

|訊號|普羅梅蒂烏斯的例子|什麼要看|
| --- | --- | --- |
|已接受的吞吐量|`sum(rate(txs{type="accepted"}[5m]))`|在穩定狀態下應達到或超過目標 TPS |
|拒絕|`sum(rate(txs{type="rejected"}[5m]))`|應透過測試計劃解釋|
|提交延遲|`histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))`|比較p95/p99與延遲預算|
|排隊深度|`queue_size`, `sumeragi_tx_queue_depth` |應在高負載期間保持限制.|
|排列度|`sumeragi_tx_queue_saturated`|持續的非零值平均過載量|
|檢視變更|`view_changes`, `sumeragi_view_change_suggest_total`,`sumeragi_view_change_install_total` |增加的值表明時間,拓物質,有效載荷或網路問題|
|丟棄的訊息|`dropped_messages`, `sumeragi_consensus_message_handling_total` |在負載期間的下降通常解釋了延遲峰值|
|有效載荷和 DA 回收| `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total`, `sumeragi_da_gate_satisfied_total` |持續出現的請求、不斷增加的等待時間或重複觸發的 DA 門控，表明區塊體或分片取得出現問題。|
|提交定決數|`sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |已計數的簽名應該迅速達到所需的共數.|

如果僅在 `/v1/sumeragi/status` 中存在一個指標,則將 JSON 的快照捕捉到與Prometheus痕相同的執行構件中.

## 估計工作流程 {#estimation-workflow}

1. 定義情況:
   - 驗證器和觀察員的數量
   - 共識模式
   - 目標 TPS
   - 提交延遲預算 p95 和 p99
   - 交易組合
   - 預期網路 RTT, jitter,頻寬
2. 記錄有效的配置:

   ```bash
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi status \
     > artifacts/sumeragi-status.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi diagnostics \
     > artifacts/sumeragi-diagnostics.json
   ```

3. 執行工作負載到目標 TPS.
4. 在執行開始,中期和結束時捕獲狀態和指標.
5. 按效能帶表進行分類.
6. 如果頻段是中等或低,一次換一個因素,然後重複.

## 基準報告模板 {#benchmark-report-template}

僅用足夠的文字來複製表現數字釋出:

- Iroha 提交,釋放和特徵旗
- 驗證器和觀察員的數量
- 共識模式,簽署的區塊序列和 DA 佈局
- 確切的 `3f + 1`委員會,常委會和觀察員名單
- `sumeragi.block`,`sumeragi.queues`, `sumeragi.limits`,網路入口和交易佇列限制
- 遠端測量資料
- 硬體,儲存和 OS 詳細資訊
- 網路 RTT, jitter,損失和頻寬假設
- 交易組合和實用負載大小
- 提供 TPS 和執行時間
- 接受/拒絕 TPS
- p50/p95/p99 提交延遲
- 排隊深度和度
- 檢視變化,丟棄的訊息,缺失區塊檢索和 DA 門計器
- CPU,每個驗證器的記憶體,磁碟和網路使用量

缺少這些細節時，TPS 數字只能視為未經充分佐證的參考。

## 相關頁面 {#related-pages}

- [混沌測試與 Izanami](./chaos-testing.md)
- [Torii 端點](../../reference/torii-endpoints.md)
- [透過 CLI](../../get-started/operate-iroha-via-cli.md)執行 Iroha 3
- [對等節點配置參考](../../reference/peer-config/params.md)
