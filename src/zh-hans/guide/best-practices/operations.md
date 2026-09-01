---
translation_locale: zh-hans
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 运营 {#operations}

操作准备意味着网络可以观察,更改,备份和恢复而不需要依赖于即兴访问验证器主机.

## 可观察性 {#observability}

- 故意启用远程测量配置文件.当需要 `/metrics`时使用 `extended` 和在需要详细的 Sumeragi 操作员路线的测试运行过程中使用 `full`.
- 仪表板接受的吞吐量,拒绝的吞吐力,提交延迟,队列深度,队列和度,查看变化,放弃共识消息和存储压.
- 在同一事件或基准构件集中保存状态快照,指标剪辑,日志和部署配置.
- 警示随着排队的持续增长,意外的拒绝峰值,块高度停滞不前,视角变动和对等节点健康改变.

查看 [绩效和指标](/zh-hans/guide/advanced/metrics.md).

## 跑本 {#runbooks}

- 为对等节点重新启动, Torii 降级,关键妥协,许可错误,费用赞助商耗尽,排队和网络分区症状编写运行簿.
- 在写入操作之前,包括精确的只读检查,特别是对对等节点注册,授权和参数更改.
- 如果包含私人运营数据,请将紧急联系和升级规则排除在备案文件之外.
- 每次事件,练习或重大升级之后,

见 [运营安全](/zh-hans/guide/security/operational-security.md).

## 备份和恢复 {#backups-and-recovery}

- 根据部署所需的恢复点,备份对等节点存储. 在非生产主机上验证恢复.
- 保持签署的起源,释放元数据,对等节点配置和关键存储记录可恢复,即使没有验证器主机.
- 记录恢复程序是否从生成中重建,从快照中恢复,或者用新身份取代失败的对等节点.
- 在生产事件中,不要第一次检验恢复程序.

## 变革管理 {#change-management}

- 将链上配置变更视为需要审查、变更前读取、授权和变更后验证的交易。
- 推出兼容性计划和反弹决定点的对等节点二进制升级.
- 避免在同一维护窗口中改变对等节点拓,共识时间和应用工作负载,除非迁移计划要求这样做.
- 记录交易哈希和区块高度,以进行操作变化.

查看 [热重载](/zh-hans/guide/advanced/hot-reload.md)和 [兼容性矩阵](/zh-hans/reference/compatibility-matrix.md).

## 产能评估 {#capacity-reviews}

- 当验证器计数,硬件,网络配置,工作负载混合或共识参数发生变化时再运行负载检查.
- 测量升温,稳定状态和预期峰值负载,而不是依赖短暂的最佳情况吞吐量样本.
- 将接受的吞吐量与提交的吞吐力和队列深度进行比较. 如果提交的 TPS 超过提交的 TPS,排队增长,网络已经超越了其可持续范围.
