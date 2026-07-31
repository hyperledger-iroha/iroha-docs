---
translation_locale: zh-hans
translation_source: /guide/advanced/metrics.md
translation_source_hash: 868481b9f7482e936d6c7013557c7ff5334c7bb93fabf74d6eb726e526fb4e43
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 绩效和指标 {#performance-and-metrics}

Iroha 性能取决于工作负载,验证器拓,网络
一个单一的 TPS 因此,这个数字只能有用
如果它被绑定到一个固定配置的基准运行.

对于产能规划,将业绩视为运营范围:

- 网络接受所要求的交易率
- 在目标预算内承诺延迟停留
- 交易队列保持限制
- 共识不依赖于重复的视图变化或恢复路径

使用这个页面来估计部署是否处于高,中等或低水平
给定节点数量,网络延迟门和目标的性能状态
TPS.

## 衡量什么 {#what-to-measure}

首先,操作器表面被曝光 Torii:

```bash
export TORII=http://127.0.0.1:8180

curl -s "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

你可以试用同样的阅读模式对待公众. Taira:

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

公众 Taira 测量是学习信号名称的有用.
作为您自己的部署生产能力数.

通过该网站提供相同的共识快照 CLI:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

远程测量可见性取决于配置的配置文件. `extended` 当你
需要 `/metrics`, 和使用 `full` 在测试过程中,你也需要详细的
Sumeragi 运营商的路线.

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## 性能带 {#performance-bands}

在目标吞吐量上使用这些带进行观察 `Y` TPS 和延迟
预算 `L` 运行工作量足够长以包括加热,
稳定状态,至少有一段预期峰值负载时间.

| 乐队 | 条件 | 含义 |
| --- | --- | --- |
| 高度 | 接受的吞吐量在或以上 `Y`, p95提交延迟低于 `0.8 * L`, 排队保持在容量的10%以下,视图变换/恢复计数器是平的 | 部署有需要工作量的空间 |
| 平均值 | 接受的吞吐量接近 `Y`, p95提交延迟低于 `L`, 排队稳定低于50%的容量,视图变化很少 | 部署有效,但爆发耐受性有限 |
| 低水平 | 接受的吞吐量低于 `Y`, p95 提交延迟超过 `L`, 在运行过程中排队增长,或视图变化/反压计量不断增加 | 要求的工作量超过至少一个瓶 |

关键规则是排队方向. TPS 超过承诺 TPS
随着排队的不断增长,即使短暂的样本也被部署过载
看起来很健康.

## 节点计数和定数 {#node-count-and-quorum}

更多验证器提高了故障耐受性,但增加了协调,签名,
网络建设成本. Sumeragi 实施:

- 验证器数量 `n` 来自错误预算 `f = floor((n - 1) / 3)`
- 对于 `n >= 4`, 委托定制是 `2f + 1`
- 对于 `n <= 3`, 所有验证者都需要提交
- 观察员同行同步区块,但不投票,提议或收集

| 验证器 | 错误预算 | 承诺定数 | 产能说明 |
| --- | --- | --- | --- |
| 1至3 | 实际的离线放松 | 所有验证器 | 适用于开发和小型测试;任何缺失的验证器都可能延迟提交 |
| 4 | 1 | 3 | 一个故障宽容的共同最低值 |
| 7 | 2 | 5 | 更具弹性,有更多的投票和传播流量 |
| 10 | 3 | 7 | 协调成本较高;网络和集体调整更重要 |

在评估"X节点"时,将投票验证器与观察者分开.
观察员通常成本低于添加验证器,但观察者仍然消耗
阻止八,阻止同步,磁盘和网络带宽.

## 影响表现的因素 {#factors-that-influence-performance}

### 工作负载形状 {#workload-shape}

同样的. TPS 根据每笔交易的情况,它们可能是廉价或昂贵的.
记录:

- 每次交易的指令数
- 签名数和签名算法
- 交易字节大小和解压缩的有效载荷大小
- 读写比率
- 金额数据大小和资产运营
- 智能合同,触发器和 IVM 执行成本
- 查询负载与相同的同行运行

小额转让交易不是合同繁重或超级数据繁重的代理
工作负载.

### 共识时间 {#consensus-timing}

Sumeragi 时间由有效的控制 Sumeragi 参数:

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- 在启用NPoS模式时,NPoS阶段时间切断

检查它们:

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

只有在网络,存储和
执行层可以跟上. 一旦查看变化,缺失的有效载荷检索,或
低调时间通常会使表现更糟.

### 收藏家Fanout {#collector-fanout}

收藏者设置影响承诺投票的快速融合:

- `sumeragi.collectors.k` 控制每位收藏人收集多少票
- `sumeragi.collectors.redundant_send_r` 控制额外的投票结果
  地方时间
- `sumeragi.collectors.parallel_topology_fanout` 添加了前列表
  收藏者

在较大的或不太可靠的网络中,增加输出速度可以减少尾声延迟.
但它也增加了流量.
在改变这些值之前,使用延迟和反压度指标的远程测量:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### 网络条件 {#network-conditions}

共识表现对:

- RTT 验证器之间
- 紧张感和输入数据
- 区块有效载荷的带宽和 RBC 碎片
- 区域之间的不对称联系
- NAT, 防火墙,或延伸行为会延迟同行连接

作为规划规则,设定延迟预算足够高以覆盖多个
验证器回路再加上执行和磁盘提交时间. 如果p95网络 RTT 是
目标是不切实际的.

### 排队和入学限制 {#queues-and-admission-limits}

接入和排队设置定义一个同行可以吸收多少爆压:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- 基因交易限制,如最大签名,指令,字节和
  压缩字节
- 排队限量和共识入口限制

高排队容量可以隐藏过载时间,但不会增加
一个稳定的排队是健康的;一个不断增长的排队是一个滞后.

### 硬件和存储 {#hardware-and-storage}

测量每一个验证者,不仅是领导者:

- CPU 在验证,签名验证和执行过程中的度
- 从排列,快照和活跃的内存压力 RBC 会议
- 区块存储和快照的磁盘编写延迟
- 网络发送/接收度
- 在工作负载使用时可选的硬件加速设置

最慢的投票验证器可以确定网络的尾声延迟.

## 承诺的信号 {#prometheus-signals}

根据构建配置文件和功能集,测量名称可能会有所不同. `/metrics` 在
首先要建立一个节点,然后在可用的数组周围构建一个仪表板.

常见的信号包括:

| 信号 | 普罗梅泰斯的例子 | 观看什么 |
| --- | --- | --- |
| 接受的吞吐量 | `sum(rate(txs{type="accepted"}[5m]))` | 应达到或超过目标 TPS 在稳定状态 |
| 拒绝 | `sum(rate(txs{type="rejected"}[5m]))` | 应通过测试计划解释 |
| 承诺延迟 | `histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` | 与延迟预算进行比较. |
| 排队深度 | `queue_size`, `sumeragi_tx_queue_depth` | 在高负载期间应该保持限制 |
| 排列度 | `sumeragi_tx_queue_saturated` | 持续的非零值平均过载 |
| 查看变更 | `view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` | 增加的值表明时间,拓,有效载荷或网络故障 |
| 丢弃的消息 | `dropped_messages`, `sumeragi_consensus_message_handling_total` | 负载下降通常解释延迟峰值 |
| RBC 压力 | `sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` | 运载回收或存储瓶的压力点不为零 |
| 承诺定数 | `sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` | 已计数的签名应该迅速达到所需的共数. |

当一个指标只存在于 `/v1/sumeragi/status`, 捕捉 JSON 快照
像普罗梅蒂乌斯的碎片一样.

## 估计工作流程 {#estimation-workflow}

1. 定义情况:
   - 验证器和观察员的数量
   - 共识模式
   - 目标 TPS
   - 承诺延迟预算 p95和 p99
   - 交易组合
   - 预期网络 RTT, 节奏,带宽
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
6. 如果频段是中度或低度,一次换一个因素并重复.

## 基准报告模板 {#benchmark-report-template}

仅以足够的文本来复制表现数字:

- Iroha 提交,释放和功能标志
- 验证器和观察员的数量
- 共识模式和 Sumeragi 参数
- 收藏人 `k`, 冗余的发送 `r`, 及前景分析
- 远程测量资料
- 硬件,存储和 OS 详细信息
- 网络 RTT, 升,损失和带宽假设
- 交易组合和有效载荷尺寸
- 提供 TPS 运行时间
- 接受/拒绝 TPS
- p50/p95/p99 提交延迟
- 排队深度和度
- 查看变化,丢弃的消息 RBC 压力和缺货有效载荷计数器
- CPU, 每个验证器的内存,磁盘和网络使用量

没有这些细节, TPS 这一数字应该被视为无事.

## 相关页面 {#related-pages}

- [混沌测试与 Izanami](./chaos-testing.md)
- [Torii 终点](../../reference/torii-endpoints.md)
- [运行 Iroha 3 通过 CLI](../../get-started/operate-iroha-via-cli.md)
- [同行配置参考](../../reference/peer-config/params.md)
