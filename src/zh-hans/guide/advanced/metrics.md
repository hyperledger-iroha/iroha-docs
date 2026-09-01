---
translation_locale: zh-hans
translation_source: /guide/advanced/metrics.md
translation_source_hash: fc62efbb6100308bb7a929e18c9c8b6860372abd6d0009616ea63d7c77b6b1eb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# 绩效和指标 {#performance-and-metrics}

Iroha 的性能取决于工作负载,验证器拓扑,网络条件和共识设置.因此,单一的 TPS 号码只有当它与固定配置的基准运行绑定时才有用.

对于产能规划,将业绩视为运营范围:

- 网络接受所要求的交易率
- 提交在目标预算内保持延迟
- 交易队列保持限制
- 共识不依赖于重复的视图变化或恢复路径

使用本页来估计部署是否处于一个特定节点数量,网络延迟门和目标 TPS 中高,中低或低性能状态.

## 衡量什么 {#what-to-measure}

开始使用公开节点快照和Prometheus抓取,然后使用 CLI 为操作员认证共识状态.目标节点必须允许操作员密钥,并且只有在运行时加载:

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

公共 Taira 有用于学习匿名节点快照的形状.其操作员诊断是故意没有 Taira 操作符密钥可用的:

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/now" \
  | jq '{now_ms, offset_ms}'
```

不要用公共测试网观测作为生产能力数字用于自己的部署.

远程测量可见性取决于配置的配置文件. `operator`使状态和诊断快照能够实现. `extended`增加`/metrics`和昂贵的时间,而 `developer`在不启用`/metrics`的情况下添加了领导者, QC,参数和证据等开发者的快照.当一个运行需要两组时使用 `full`. `telemetry_profile`是唯一的首次发布的遥测开关.

```toml
telemetry_profile = "full"
```

## 性能带 {#performance-bands}

使用这些频段进行在目标吞吐量 `Y` TPS 和延迟预算 `L`毫秒的观察运行.运行工作负载足以包括加热,稳定状态和至少一个期预期峰值负载.

|乐队|条件|这意味着|
| --- | --- | --- |
|很高.|接受的吞吐量达到或超过 `Y`,p95提交延迟低于 `0.8 * L`,排队保持在容量的10%以下,视频变换/恢复计数是平的|部署对要求的工作量有空间|
|平均值|接受的吞吐量接近 `Y`,p95提交延迟低于 `L`,排队稳定在容量的50%以下,视频变化很少.|部署有效,但爆炸耐受性有限.|
|低调|接受的吞吐量低于 `Y`,p95提交延迟超过 `L`,运行期间排队增长或视频变化/反压计数不断上升.|要求的工作量至少超过一个瓶.|

关键规则是排队方向. 如果提交的 TPS 比提交的 TPS 大,并且排队持续增长,即使短样本看起来很健康,部署也会过载.

## 节点计数和定数 {#node-count-and-quorum}

更多的验证器提高了故障耐受性,但增加了协调,签名和网络输出成本. Sumeragi 协议要求:

- 一个确切的 `n = 3f + 1` 投票委员会
- `4 <= n <= 31`,所以有效尺寸是4,7,10等
- 一个 `2f + 1` 的委托定制.
- 观察员对等节点同步区块,但不投票,提议或收集

|验证器|错误预算|提交定决数|产能说明|
| --- | --- | --- | --- |
| 4 | 1 | 3 |单个故障宽容的常见最低值|
| 7 | 2 | 5 |更具弹性,更多的投票和传播流量|
| 10 | 3 | 7 |更高的协调成本;网络和输入调整更重要|
| 31 | 10 | 21 |首个版本支持的最大委员会；请谨慎进行协调和签名成本的基准测试|

创世生成和启动验证拒绝不符合委员会大小;不要将发布不能承认的拓扑进行比较.

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
- 查询负载与相同的对等节点运行

小额转让交易不是合同繁重或超级数据繁重的工作负载的替代品.

### 统一时间 {#consensus-cadence}

有效的 Sumeragi 参数快照包含已签署的不可变区块序列和时钟漂移界限:

- `block_cadence_ms`
- `max_clock_drift_ms`

检查它们:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

`block_cadence_ms` 由已签名的创世配置提交并在启动时冻结；它不是实时调优旋钮。对于具有不同已签名创世输入的网络，只能将它们作为独立的基准测试场景进行比较。一旦出现视图变更、有效载荷缺失获取或背压，更短的节奏通常只会让过载更明显，而不会提高可持续吞吐量。

### 候选人和入境限制 {#candidate-and-ingress-bounds}

节点本地 Sumeragi 界限确定验证器可以保留多少候选和恢复工作:

- `sumeragi.block.max_transactions`
- `sumeragi.block.max_payload_bytes`
- `sumeragi.block.proposal_queue_scan_multiplier`
- `sumeragi.queues.commands`
- `sumeragi.queues.bodies`和`sumeragi.queues.body_bytes`
- `sumeragi.queues.body_source_bytes`, `sumeragi.queues.chunks`,和 `sumeragi.queues.ready_bodies`

太小的界限会产生队列或有效负载恢复压力;大尺寸的界限增加了保留的内存和对虐待对等节点可用的工作量.在一次改变一个界限之前,比较诊断快照与过程内存,信息处理和缺失体度指标:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
```

### 网络条件 {#network-conditions}

共识表现是对:

- RTT 在验证器之间
- 紧张感和包装损失
- 区块有效载荷和签署的 RS16 零部件带宽
- 区域之间不对称的联系
- NAT,阻碍对等节点连接的防火墙,或继电行为

作为规划规则,设定延迟预算足够高以覆盖几个验证器回路再加上执行和磁盘提交时间.如果p95网络 RTT 已经接近所需的p95提交延迟,目标是不现实的.

### 排队和入学限制 {#queues-and-admission-limits}

接入和排队设置定义了一个对等节点可以吸收多少爆压:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.max_retained_bytes`
- `queue.transaction_time_to_live_ms`
- 创世交易限制,例如最多签名,命令,字节,和解压字节
- p2p 队列上限和共识入口限制

高排队容量可以隐藏过载量一段时间,但它不会增加可持续的吞吐量.稳定排队是健康的;不断增长的排队是滞后的.

### 硬件和存储 {#hardware-and-storage}

测量每一个验证者,不仅仅是领导者:

- CPU 验证,签名验证和执行过程中的度
- 从队列,快照和有效载荷恢复缓冲的内存压力
- 区块存储和快照的磁盘编写延迟
- 网络传输/接收度
- 在工作负载中使用时可选的硬件加速设置

最慢的投票验证器可以决定网络的尾声延迟.

## 承诺的信号 {#prometheus-signals}

指标名称来自已签入版本控制的遥测目录。时序数据的可用性和采样方式取决于构建功能与 `telemetry_profile`，因此请先检查目标节点上的 `/metrics`，再构建仪表板。

常见信号包括:

|信号|普罗梅蒂乌斯的例子|什么要看|
| --- | --- | --- |
|已接受的吞吐量|`sum(rate(txs{type="accepted"}[5m]))`|在稳定状态下应达到或超过目标 TPS |
|拒绝|`sum(rate(txs{type="rejected"}[5m]))`|应通过测试计划解释|
|提交延迟|`histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))`|比较p95/p99与延迟预算|
|排队深度|`queue_size`, `sumeragi_tx_queue_depth` |应在高负载期间保持限制.|
|排列度|`sumeragi_tx_queue_saturated`|持续的非零值平均过载量|
|查看变更|`view_changes`, `sumeragi_view_change_suggest_total`,`sumeragi_view_change_install_total` |增加的值表明时间,拓物质,有效载荷或网络问题|
|丢弃的消息|`dropped_messages`, `sumeragi_consensus_message_handling_total` |在负载期间的下降通常解释了延迟峰值|
|有效载荷和 DA 回收| `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total`, `sumeragi_da_gate_satisfied_total` |持续出现的请求、不断增加的等待时间或重复触发的 DA 门控，表明区块体或分片获取出现问题。|
|提交定决数|`sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |已计数的签名应该迅速达到所需的共数.|

如果仅在 `/v1/sumeragi/status` 中存在一个指标,则将 JSON 的快照捕捉到与Prometheus痕相同的运行构件中.

## 估计工作流程 {#estimation-workflow}

1. 定义情况:
   - 验证器和观察员的数量
   - 共识模式
   - 目标 TPS
   - 提交延迟预算 p95 和 p99
   - 交易组合
   - 预期网络 RTT, jitter,带宽
2. 记录有效的配置:

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

3. 运行工作负载到目标 TPS.
4. 在运行开始,中期和结束时捕获状态和指标.
5. 按性能带表进行分类.
6. 如果频段是中等或低,一次换一个因素,然后重复.

## 基准报告模板 {#benchmark-report-template}

仅用足够的文本来复制表现数字发布:

- Iroha 提交,释放和特征旗
- 验证器和观察员的数量
- 共识模式,签署的区块序列和 DA 布局
- 确切的 `3f + 1`委员会,常委会和观察员名单
- `sumeragi.block`,`sumeragi.queues`, `sumeragi.limits`,网络入口和交易队列限制
- 远程测量资料
- 硬件,存储和 OS 详细信息
- 网络 RTT, jitter,损失和带宽假设
- 交易组合和实用负载大小
- 提供 TPS 和运行时
- 接受/拒绝 TPS
- p50/p95/p99 提交延迟
- 排队深度和度
- 查看变化,丢弃的消息,缺失区块检索和 DA 门计器
- CPU,每个验证器的内存,磁盘和网络使用量

缺少这些细节时，TPS 数字只能视为未经充分佐证的参考。

## 相关页面 {#related-pages}

- [混沌测试与 Izanami](./chaos-testing.md)
- [Torii 端点](../../reference/torii-endpoints.md)
- [通过 CLI](../../get-started/operate-iroha-via-cli.md)运行 Iroha 3
- [对等节点配置参考](../../reference/peer-config/params.md)
