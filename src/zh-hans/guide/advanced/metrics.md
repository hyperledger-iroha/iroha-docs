---
translation_locale: zh-hans
translation_source: /guide/advanced/metrics.md
translation_source_hash: 5772bf7175b693fbbed54b59304859a33c2e19fef0c402141b6f4ad4cfd6714f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 绩效和指标 {#performance-and-metrics}

Iroha 的性能取决于工作负载,验证器拓学,网络条件和共识设置.因此,单一的 TPS 号码只有当它与固定配置的基准运行绑定时才有用.

对于产能规划,将业绩视为运营范围:

- 网络接受所要求的交易率
- 承诺在目标预算内保持延迟
- 交易队列保持限制
- 共识不依赖于重复的视图变化或恢复路径

使用本页来估计部署是否处于一个特定节点数量,网络延迟门和目标 TPS 中高,中低或低性能状态.

## 衡量什么 {#what-to-measure}

从 Torii 暴露的操作者表面开始:

```bash
export TORII=http://127.0.0.1:8180

curl -s -H 'Accept: application/json' "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

您可以尝试相同的仅阅读模式与公众 Taira:

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/status" \
  | jq '{healthy: .health.healthy, peers, samples_used, rtt_count: .rtt.count}'

curl -fsS "$TAIRA/metrics" \
  | grep -E '^(block_height|queue_size|sumeragi_tx_queue_depth|txs|view_changes)' \
  | head -n 20
```

公共的 Taira 指标对于学习信号名称是有用的.不要用它们作为自己的部署生产能力数字.

通过 CLI 可获得相同的共识快照:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

远程测量可见性取决于配置的个人资料.当需要 `/metrics`时使用`extended`,并且在测试运行期间使用`full`,当您还需要详细的 Sumeragi 操作员路线时.

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## 性能带 {#performance-bands}

使用这些频段进行在目标吞吐量 `Y` TPS 和延迟预算 `L`毫秒的观察运行.运行工作负载足以包括加热,稳定状态和至少一个期预期峰值负载.

|乐队|条件|这意味着|
| --- | --- | --- |
|很高.|接受的吞吐量达到或超过 `Y`,p95提交延迟低于 `0.8 * L`,排队保持在容量的10%以下,视频变换/恢复计数是平的|部署对要求的工作量有空间|
|平均值|接受的吞吐量接近 `Y`,p95提交延迟低于 `L`,排队稳定在容量的50%以下,视频变化很少.|部署有效,但爆炸耐受性有限.|
|低调|接受的吞吐量低于 `Y`,p95提交延迟超过 `L`,运行期间排队增长或视频变化/反压计数不断上升.|要求的工作量至少超过一个瓶.|

关键规则是排队方向. 如果提交的 TPS 比承诺的 TPS 大,并且排队持续增长,即使短样本看起来很健康,部署也会过载.

## 节点计数和定数 {#node-count-and-quorum}

更多的验证器提高了故障耐受性,但增加了协调,签名和网络输出成本. Sumeragi 实施:

- 验证器计数 `n` 来自错误预算 `f = floor((n - 1) / 3)`
- 对于 `n >= 4`来说,提交权限为 `2f + 1`
- 对于 `n <= 3`,所有验证器都需要提交.
- 观察员同行同步区块,但不投票,提议或收集

|验证器|错误预算|提交定决数|产能说明|
| --- | --- | --- | --- |
|1 至 3 |实际的离线放松|所有验证者|适用于开发和小型测试;任何缺失的验证器都可能会阻提交.|
| 4 | 1 | 3 |单个故障宽容的常见最低值|
| 7 | 2 | 5 |更具弹性,更多的投票和传播流量|
| 10 | 3 | 7 |更高的协调成本;网络和收藏器调整更重要 |

在评估"X节点"时,将投票验证器与观察员分开.添加观察员通常成本低于添加验证器,但观察员仍然消耗区块八,区块同步,磁盘和网络带宽.

## 影响表现的因素 {#factors-that-influence-performance}

### 工作负载形状 {#workload-shape}

同样的 TPS 可以是廉价或昂贵的,取决于每笔交易所做的.记录:

- 每次交易的指令数
- 签名数量和签名算法
- 交易字节大小和解压缩的有效载荷大小
- 阅读/写成比例
- 金额数据大小和资产运营
- 智能合同,触发器和执行成本 IVM
- 查询负载与相同的同行运行

小额转让交易不是合同繁重或超级数据繁重的工作负载的替代品.

### 共识时间 {#consensus-timing}

Sumeragi 的时间由有效的 Sumeragi 参数控制:

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- 在启用NPoS模式时,NPOS阶段时间切断

检查它们:

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

较低的时机目标只能在网络,存储和执行层能够跟上时才能提高延迟.一旦查看变化,出现缺失有效载荷或压力后,降低时间通常会使性能恶化.

### 收藏家Fanout {#collector-fanout}

收藏者设置影响承诺投票的快速融合:

- `sumeragi.collectors.k` 控制了每位选民的投票数量
- `sumeragi.collectors.redundant_send_r`在当地时间停止投票后控制额外的投票
- `sumeragi.collectors.parallel_topology_fanout` 添加了Topology fanout与收藏器一起

在更大或不那么可靠的网络中,增加Fanout可以减少尾声延迟,但也会增加流量.在改变这些值之前,比较总可用性和收藏器远程测量与延迟和反压力指标:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### 网络条件 {#network-conditions}

共识表现是对:

- RTT 在验证器之间
- 紧张感和包装损失
- 区块实用载荷和 RBC 零部件的带宽
- 区域之间不对称的联系
- NAT,阻碍同行连接的防火墙,或继电行为

作为规划规则,设定延迟预算足够高以覆盖几个验证器回路再加上执行和磁盘提交时间.如果p95网络 RTT 已经接近所需的p95提交延迟,目标是不现实的.

### 排队和入学限制 {#queues-and-admission-limits}

接入和排队设置定义了一个同行可以吸收多少爆压:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- 基因交易限制,例如最多签名,命令,字节,和解压字节
- 排队限量和共识入境限制

高排队容量可以隐藏过载量一段时间,但它不会增加可持续的吞吐量.稳定排队是健康的;不断增长的排队是滞后的.

### 硬件和存储 {#hardware-and-storage}

测量每一个验证者,不仅仅是领导者:

- CPU 验证,签名验证和执行过程中的度
- 排队,快照和活跃 RBC 会议的内存压力
- 区块存储和快照的磁盘编写延迟
- 网络传输/接收度
- 在工作负载中使用时可选的硬件加速设置

最慢的投票验证器可以决定网络的尾声延迟.

## 承诺的信号 {#prometheus-signals}

根据构建配置文件和功能集,计量名称可能会有所不同.首先检查 `/metrics` 在节点上,然后在可用的系列周围构建仪表板.

常见信号包括:

|信号|普罗梅蒂乌斯的例子|什么要看|
| --- | --- | --- |
|已接受的吞吐量|`sum(rate(txs{type="accepted"}[5m]))`|在稳定状态下应达到或超过目标 TPS |
|拒绝|`sum(rate(txs{type="rejected"}[5m]))`|应通过测试计划解释|
|承诺延迟|`histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))`|比较p95/p99与延迟预算|
|排队深度|`queue_size`, `sumeragi_tx_queue_depth` |应在高负载期间保持限制.|
|排列度|`sumeragi_tx_queue_saturated`|持续的非零值平均过载量|
|查看变更|`view_changes`, `sumeragi_view_change_suggest_total`,`sumeragi_view_change_install_total` |增加的值表明时间,拓物质,有效载荷或网络问题|
|丢弃的消息|`dropped_messages`, `sumeragi_consensus_message_handling_total` |在负载期间的下降通常解释了延迟峰值|
|RBC 压力|`sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` |非零压力点对有效载荷回收或存储瓶|
|提交定决数|`sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |已计数的签名应该迅速达到所需的共数.|

如果仅在 `/v1/sumeragi/status` 中存在一个指标,则将 JSON 的快照捕捉到与Prometheus痕相同的运行文物中.

## 估计工作流程 {#estimation-workflow}

1. 定义情况:
   - 验证器和观察员的数量
   - 共识模式
   - 目标 TPS
   - 承诺延迟预算 p95 和 p99
   - 交易组合
   - 预期网络 RTT, jitter,带宽
2. 记录有效的配置:

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. 运行工作负载到目标 TPS.
4. 在运行开始,中期和结束时捕获状态和指标.
5. 按性能带表进行分类.
6. 如果频段是中等或低,一次换一个因素,然后重复.

## 基准报告模板 {#benchmark-report-template}

仅用足够的文本来复制表现数字发布:

- Iroha 承诺,释放和特征旗
- 验证器和观察员的数量
- 共识模式和 Sumeragi 参数
- 收藏器 `k`,冗余发射器 `r`,和拓表
- 远程测量资料
- 硬件,存储和 OS 详细信息
- 网络 RTT, jitter,损失和带宽假设
- 交易组合和实用负载大小
- 提供 TPS 和运行时间
- 接受/拒绝 TPS
- p50/p95/p99 提交延迟
- 排队深度和度
- 查看变化,丢弃消息,压力 RBC 和缺失有效载荷计数器
- CPU,每个验证器的内存,磁盘和网络使用量

如果没有这些细节, TPS 号码应该被视为事.

## 相关页面 {#related-pages}

- [混沌测试与 Izanami](./chaos-testing.md)
- [Torii 终端点](../../reference/torii-endpoints.md)
- [通过 CLI](../../get-started/operate-iroha-via-cli.md)运行 Iroha 3
- [同行配置参考](../../reference/peer-config/params.md)
