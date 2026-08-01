---
translation_locale: zh-hans
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: dfd2d4196827da3563e377baae2fb823871d7a2c293dfafb6dc4de37f9ddbc61
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 混沌测试与Izanami {#chaos-testing-with-izanami}

Izanami是上游 Iroha 工作空间中的混沌网管.它启动一次性本地 Iroha 集群,提交可配置的工作负载,并将故障注入选定的同行中,以便运营商可以检查网络是否在受控故障下继续取得进展.

使用 Izanami 进行产前弹性检查,回归复制和共识调整.不要指向生产网络:该工具旨在拥有它启动的同行,包括同行重新启动,存储 wipes,人工包损失以及本地 CPU 或磁盘压力.

## 预先条件 {#prerequisites}

运行 Izanami 从 [Iroha 源存储库](https://github.com/hyperledger-iroha/iroha),而不是从本文档存储库:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

必须明确允许二进制器创建和操纵网络同行.通过 `--allow-net` 每次非 TUI 运行,或启用 `allow_net` 在 TUI 中.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

对于交互式运行配置:

```bash
cargo run -p izanami -- --tui --allow-net
```

在用户配置目录中, Izanami 仍然存在 TUI 和 CLI 设置,因此在重新使用之前的个人资料之前,请检查显示的设置.

## 基线运行 {#baseline-run}

在添加严重故障之前,开始使用一个可复制的基线:

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

这个运行只能成功,如果集群达到所要求的区块目标,在截止时间内继续取得进展,并且保持在可选的p95区块间隔门以下.

记录命令,种子, Iroha 提交,同行数量,故障同行数值,工作负载配置文件,目标 TPS 和延迟门.如果没有这些值,另一个操作员无法重复相同的失败模式.

## 工作负载配置文件 {#workload-profiles}

 Izanami 有两个工作负载配置文件:

|个人资料|用它来|备忘录|
| -------- | -------------------------------------------------- | -------------------------------------- |
|`stable`|长时间的浸泡运行和可复制性性能检查|喜欢安全的食谱|
|`chaos`|失败路径覆盖率|包含故意无效的食谱|

首先使用稳定配置文件:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

如果已经理解了基线,就转向混乱的配置文件:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

在稳定运行中禁用合同部署配方,除非明确允许:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

使用 `--nexus` 运行时应使用从上游工作空间内嵌的默认 SORA Nexus

## 错误控制 {#fault-controls}

当 `--faulty` 超过零时,必须启用至少一个故障场景.故障将默认切换为启动,并且可以使用 `=false` 禁用布鲁尔旗.

|错误|CLI 旗|它所做的一切|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|崩和重新启动|`--fault-enable-crash-restart`|同行流程损失和恢复|
|擦除存储和重新启动|`--fault-enable-wipe-storage`|在失踪的地方状态中恢复|
|无效的交易垃圾邮件|`--fault-enable-spam-invalid-transactions`|录取和拒绝的路径|
|网络延迟|`--fault-enable-network-latency`|缓慢的八和延迟的共识信息|
|网络分区|`--fault-enable-network-partition`|暂时的可信同行隔离|
|P2P 包装损失|`--fault-enable-network-packet-loss`|应用程序框架流量下降|
|CPU 压力|`--fault-enable-cpu-stress`|局部验证和规划压力|
|磁盘度|`--fault-enable-disk-saturation`|局部存储压力|

对于只输入包的运行:

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

使用 `--fault-window-start` 和 `--fault-window-end` 保持注射故障之前和之后的控制稳定状态时期. 这使得更容易区分启动噪音与故障的影响.

## 场景的形状 {#scenario-shapes}

上游的Izanami目录将常见的区块链通信失败形状映射到 CLI 配置文件.你可以用相同的旗来建模它们:

|场景|典型的形状|
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|目标载荷|`--faulty 0`,高`--tps`,一个提交人,高 `--max-inflight` |
|暂时故障|只有在有限的故障窗口内启动机/重启|
|包装损失|仅允许输出数据包,通常是默认的75%的丢失率.|
|停止和恢复|使用大量的故障同行群体与崩/重新启动|
|领导人隔离|使用完全一个错误的同行,只有网络分区或数据包丢失故障; Izanami 遵循 Sumeragi 领先的远程测量|

如果您同时改变同行数量,工作负载配置文件,故障窗口和 TPS,结果就很难解释.

## 需要注意的是什么? {#what-to-watch}

在运行期间,注意用于性能验证的同样的信号:

- 在每一个跑步同行的块高度进展
- 提交,接受,拒绝和截止期的交易
- 排队深度,排队和终点反压力
- 查看变化,恢复路径,缺失的区块和缺失的定制证书
- RBC 滞后,待定会议和降低或延迟共识流量
- CPU,存储器,磁盘和网络度在运行同行的主机上

为了验证延迟分析,请启用主循环调试日志:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

每个区块应发射 `block validation timings` 与 `stateless_ms`, `execution_ms` 和 `total_ms`.在改变共识计时器之前,将这些时间与 p95 区块间隔,视图变换计数器和队列压力进行比较.

## 解释结果 {#interpreting-results}

当所有选择的同行继续提交区块时,对运行进行健康处理,后载不增长而无限,并且设置窗口结束后故障停止导致新的恢复活动.

处理运行为失败时:

- 长于 `--progress-timeout`的区块进步摊位
- 同等高度的差异,不重聚
- 延迟 p95超过 `--latency-p95-threshold`
- 一个故障窗口关闭后,排队在剩余的运行中增长.
- 拒绝或截止期的交易不因选定的工作负载而解释
- 需要手动清理.

在失败后,再使用相同的种子和一个较少的故障类型. 这使得工作负载和时间可重复,同时缩小故障表面.

## 相关页面 {#related-pages}

- [性能和指标](./metrics.md)
- [运行 Iroha 在 Bare Metal](./running-iroha-on-bare-metal.md) 上
- [Torii 终端点](../../reference/torii-endpoints.md)
