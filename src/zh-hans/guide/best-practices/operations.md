---
translation_locale: zh-hans
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 运营 {#operations}

运营准备意味着网络可以观察,改变,
没有依赖于即兴访问验证器
接待者.

## 可观察性 {#observability}

- 故意启用远程测量配置文件. `extended` 什么时候 `/metrics`
  是必要的和 `full` 在需要详细的测试过程中 Sumeragi
  运营商的路线.
- 仪表板接受吞吐量,拒绝吞吐量
  查看变化,丢弃的共识信息,
  存储压力
- 保存状态快照,指标剪辑,日志和部署
  在同一事件或基准文物组中的配置.
- 警报连续排队增长,意外的拒绝峰值停滞
  视觉变化,同龄人健康变化.

看看 [绩效和指标](/zh-hans/guide/advanced/metrics.md).

## 跑本 {#runbooks}

- 为同行重新启动编写跑本, Torii 降级,关键妥协
  许可错误,费用赞助商耗尽,排队,网络
  分裂症状.
- 在写作操作之前,包括精确的仅阅读检查,特别是对于
  其他类型的应用程序:
- 保持紧急联系和升级规则在文档备忘录之外,如果
  它们包括私人运营数据.
- 每次事件,练习或重大升级之后,

看看 [运营安全](/zh-hans/guide/security/operational-security.md).

## 备份和恢复 {#backups-and-recovery}

- 根据该组织所要求的恢复点,
  在非生产主机上验证恢复.
- 保存签名的起源,释放元数据,同龄人配置和关键保密
  即使没有验证器主机,可恢复的记录.
- 文件是否恢复程序从发源中重建,
  或是取代一个失败的同龄人,
- 在生产过程中,绝不要第一次检测恢复程序
  事件发生.

## 变革管理 {#change-management}

- 应将连锁配置变化视为需要审查的交易,
  飞行前阅读,授权和变更后验证.
- 推出同行二进制升级与兼容性计划和反弹
  决策点.
- 避免改变同行拓,共识时间和应用程序工作负载
  在同一维护窗口,除非迁移计划要求.
- 记录交易哈希和区块高度进行操作变化.

看看 [热重载](/zh-hans/guide/advanced/hot-reload.md) 并且
[兼容性矩阵](/zh-hans/reference/compatibility-matrix.md).

## 产能评估 {#capacity-reviews}

- 在验证器数量,硬件,网络配置时再执行负载检查,
  工作负载混合或共识参数变化.
- 测量升温,稳定状态和预期峰值负载而不是依赖
  在最好的情况中,短的产量样本上.
- 与承诺的吞吐量和队列深度进行比较.
  提交 TPS 超过承诺 TPS 随着排队的增长,网络已经过去了.
  它的可持续性.
