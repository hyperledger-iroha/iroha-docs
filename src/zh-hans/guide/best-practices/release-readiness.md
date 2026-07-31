---
translation_locale: zh-hans
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 1f316d6a823b23e821d80fe8773df7469358b0e01057f9b76b113cafe4818f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 准备释放 {#release-readiness}

在推广 Iroha 应用程序或网络变化,证明行为
在可能暴露相关风险的最小环境中,然后移动
通过共享测试网和生产门,故意进行.

## 局域网门 {#localnet-gate}

- 启动一次性本地网络 Iroha 轨道和
  最接近的实践验证器数量.
- 运行交易构建器的单元测试,查询分析,拒绝
  处理和配置装载.
- 练习最小的成功阅读和写作路径
  SDK 或 CLI 应用程序将以后使用的形状.
- 捕获预期的交易哈希,状态,事件和状态读数
  试验文物.

看看 [发射 Iroha 3](/zh-hans/get-started/launch-iroha.md) 并且
[SDK 教程](/zh-hans/guide/tutorials/).

## 分享测试网口 {#shared-testnet-gate}

- 使用 Taira 或其他共享测试网络用于终端点行为,费用,帐户
  提供资金,延迟和运营试验.
- 保持现场测试网写入选择,所以普通的测试运行不依赖
  网络可用性或测试网资金的支出.
- 验证签署人资金,费用资产元数据,权威许可,
  在提交每个实时测试交易之前预期状态.
- 等待终端状态,然后通过一个
  只有阅读的查询.

看看
[继续努力 SORA 3: Taira 并且 Minamoto](/zh-hans/get-started/sora-nexus-dataspaces.md).

## 主网或生产门 {#mainnet-or-production-gate}

- 使用单独的生产签名器,资金,域名和配置路径.
  不推广测试网钥匙或水龙头假设.
- 确认 SDK, CLI, 互联网和网络兼容性
  [兼容性矩阵](/zh-hans/reference/compatibility-matrix.md).
- 审查权限,费用赞助,利率限制,监测,备份
  在释放窗口之前的状态和反弹标准.
- 需要书面的交易或迁移计划.

## 恢复和回归 {#rollback-and-recovery}

- 定义代码部署可以推迟哪些变化,
  在链上进行的交易,不能直接撤销.
- 对于连锁数据变化,准备补偿交易或迁移
  在第一个制作之前写脚本.
- 对于网络更改,保持之前的二进制,配置捆绑,签署
  在发行期间可用的运营运行本.
- 根据客观信号确定取消部署的决定点
  例如拒绝率,排队增长,延迟或同行健康.

## 最后的检查列表 {#final-checklist}

- 配置是环境特定的,不仅包含测试
  这些秘密.
- 交易重试行为是无权或明确限制的.
- 申请可以区分拒绝,过期,截止日期和终点
  可用性故障.
- 监测涵盖吞吐量,延迟,队列深度,拒绝,视图
  变化和相关的商业事件.
- 运营商有预期故障模式的跑本.
- 安全审查涉及关键保管,权限,网络曝光以及
  自动化权威.
