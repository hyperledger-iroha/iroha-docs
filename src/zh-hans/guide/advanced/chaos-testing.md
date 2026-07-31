---
translation_locale: zh-hans
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: dfd2d4196827da3563e377baae2fb823871d7a2c293dfafb6dc4de37f9ddbc61
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 混沌测试与 Izanami {#chaos-testing-with-izanami}

伊扎纳米是上游的混沌网管家 Iroha 工作空间.
开始一个一次性地方 Iroha 集群,提交可配置的工作负载,
并且将缺陷注入选定的同行中,以便操作员可以检查
网络在控制失败下继续取得进展.

使用 Izanami 进行产前弹性检查,回归复制,
不把它指向一个生产网络:工具是
设计用于拥有它启动的同行,包括同行重新启动,存储
毛巾,人工包装损失和本地 CPU 或磁盘压力.

## 预先条件 {#prerequisites}

运行 Izanami 从
[Iroha 源存储库](https://github.com/hyperledger-iroha/iroha),
不属于本文档库:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

必须明确允许二进制器创建和操纵网络
同龄人. `--allow-net` 对于每一个非-TUI 运行或启动 `allow_net` 在
在 TUI.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

对于交互式运行配置:

```bash
cargo run -p izanami -- --tui --allow-net
```

伊扎纳米坚持 TUI 并且 CLI 在用户配置目录下设置,因此
在重新使用以前的配置文件之前,检查显示的设置.

## 基线运行 {#baseline-run}

在添加严重的故障之前,开始使用一个可复制的基线:

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

如果集群达到所要求的区块目标,则该运行只能成功.
在截止时间内继续取得进展,并且保持在可选 p95
区块间隔门.

记下命令,种子. Iroha 承诺,同行数量,缺陷同行数值,
工作负载配置,目标 TPS, 随着日志的延迟,
其他运营商不能重复相同的故障模式.

## 工作负载配置文件 {#workload-profiles}

 Izanami 有两个工作负载配置文件:

| 个人资料  | 用它来                                         | 备忘录                                  |
| -------- | -------------------------------------------------- | -------------------------------------- |
| `stable` | 长时间水运行和可复制的性能检查 | 支持安全执行的食谱          |
| `chaos`  | 失败路径覆盖                              | 包括故意无效的食谱 |

首先使用稳定配置文件:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

当基本线已经理解时,切换到混沌的配置文件:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

除非明确的情况下,在稳定运行中禁用合同部署配方
允许:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

使用 `--nexus` 运行时应使用嵌入式 SORA Nexus 违规的
在上游工作空间.

## 错误控制 {#fault-controls}

当 `--faulty` 超过零,至少有一个故障情况必须是
错误将默认切换为启用,而布鲁尔旗可以是
有残疾人 `=false`.

| 错误                    | CLI 旗                                   | 它所做的事情                          |
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
| 崩和重启        | `--fault-enable-crash-restart`             | 同行过程损失和恢复             |
| 清除存储和重新启动 | `--fault-enable-wipe-storage`              | 失踪的当地状态恢复          |
| 无效的交易垃圾邮件 | `--fault-enable-spam-invalid-transactions` | 录取和拒绝途径              |
| 网络延迟          | `--fault-enable-network-latency`           | 缓慢的八和延迟的共识信息 |
| 网络分区        | `--fault-enable-network-partition`         | 暂时的可信同行隔离           |
| P2P 包装损失          | `--fault-enable-network-packet-loss`       | 应用框架流量下降          |
| CPU 压力               | `--fault-enable-cpu-stress`                | 局部验证和规划压力   |
| 磁盘度          | `--fault-enable-disk-saturation`           | 局部存储压力                     |

对于只输包运行:

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

使用 `--fault-window-start` 并且 `--fault-window-end` 为了控制
在注射故障之前和之后的稳定状态时期.
更容易区分启动噪音和故障的影响.

## 场景形状 {#scenario-shapes}

上游的Izanami目录绘制了常见的区块链通信失败
的形状 CLI 你可以用相同的标志来模拟它们:

| 场景              | 典型的形状                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 目标负载         | `--faulty 0`, 高度 `--tps`, 一个提交人,高 `--max-inflight`                                                         |
| 暂时故障     | 只有在有限的故障窗口内才能启动崩/重启                                                                  |
| 包装损失           | 仅允许输入包,通常是默认的75%的丢失率                                                          |
| 停止和恢复 | 使用大量的故障同行群体与崩/重启                                                                    |
| 领导人隔离      | 使用一个错误的同行,只有网络分区或数据包丢失故障; Izanami 遵循 Sumeragi 领先的遥测 |

如果改变同行数量,工作负载
配置文件,故障窗口和 TPS 在同一时间,结果很难
解释.

## 需要注意的东西 {#what-to-watch}

在运行过程中,注意用于性能验证的相同信号:

- 在每一个跑步同行中,
- 提交,接受,拒绝和截止日期的交易
- 排队深度,排队和终点反压力
- 查看变化,恢复路径,缺失区块和缺失共数
  证书
- RBC 延迟或减缓共识流量
- CPU, 存储器,磁盘和网络度在主机上运行同行

为了验证延迟分析,启用主循环调试日志:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

每个块都应该发射 `block validation timings` 在 `stateless_ms`,
`execution_ms`, 并且 `total_ms`. 与p95区块相比.
在变换前间隔,视图变换计数器和排列压力
达成共识的时间表.

## 解释结果 {#interpreting-results}

当所有选择的同龄人继续执行阻碍时,
后载量不会增长,故障就不再导致新的恢复
在配置窗口结束后的活动.

如果:

- 区块进步停留时间超过 `--progress-timeout`
- 同等高度不同,不重聚
- p95延迟超过 `--latency-p95-threshold`
- 缺陷窗口关闭后,排队在剩余的运行中增长
- 被拒绝或过期的交易没有被选中的解释
  工作负载
- 需要手动重新启动,存储清除或数据包丢失恢复
  清洁

在失败后,再用相同的种子和一个更少的故障类型.
保持工作负载和时间可复制,同时缩小故障
表面.

## 相关页面 {#related-pages}

- [绩效和指标](./metrics.md)
- [运行 Iroha 在纯金属上](./running-iroha-on-bare-metal.md)
- [Torii 终点](../../reference/torii-endpoints.md)
