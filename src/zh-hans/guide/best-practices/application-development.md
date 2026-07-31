---
translation_locale: zh-hans
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 应用开发 {#application-development}

Iroha 应用程序应该明确交易行为,继续签字
查询和事件的使用方式
在生产中观察.

## 客户端设置 {#client-setup}

- 存储客户端配置在应用程序源代码之外.
  连锁 ID, Torii URL, 签署账户和交易设置
  环境特定配置.
- 保持 `client.toml` 对于 localnet 的单独文件, Taira, Minamoto, 并且
  一个复制的测试网络签名器永远不应该成为主网
  签字者.
- 一个非常短的时间,
  在正常的网络动荡下,寿命可能会过期,而一个非常长的
  复制提交可能使得推理更难.
- 使用 `nonce = true` 只有当重复交易应该有不同的情况
  对于无效的业务运营,存储和重复使用
  申请请求 ID 所以可以追踪回复的尝试.

看看 [客户端配置](/zh-hans/guide/configure/client-configuration.md) 对于
电流 TOML 它们的作用是

## 交易 {#transactions}

- 从打字中构建交易 SDK 在可能的情况下,
  原材料 JSON 或是连线装配的有效载荷.
- 预览重要写着只阅读查询:帐户存在,
  资产余额,许可状态,费用资产可用性和目标
  实体状态.
- 记录交易哈希,权威账户,指令总结,
  在提交之前预期的状态变化.
- 治疗 `Rejected`, `Expired`, 一个时间休息的结果不同.
  表示客户没有观察到最终状态;它不证明
  网络忽略了交易.
- 在成功写完之后,通过查询或
  与业务运营相匹配的事件检查点.

对于交易机制,见 [交易](/zh-hans/blockchain/transactions.md).

## 问题和事件 {#queries-and-events}

- 使用当前状态和事件流的查询来通知变更.
  避免用重复的广泛查询取代事件处理.
- 页面化广泛的可重复查询,如账户,资产和区块
  列表.
- 对于订阅和触发器,更喜欢狭窄的过器.
  可用于诊断,但可以增加不必要的执行和客户端
  处理.
- 保持仅阅读的烟雾检查与签署的交易测试分开,
  最终点可用性更容易诊断.

看看 [问题](/zh-hans/blockchain/queries.md), [事件](/zh-hans/blockchain/events.md), 并且
[过器](/zh-hans/blockchain/filters.md).

## 经纪人协助的发展 {#agent-assisted-development}

- 让特工检查医生, SDK 代码,以及之前只能阅读的网络状态
  要求他们写出交易代码.
- 保持现场网络测试,选择在环境旗后
  `TAIRA_LIVE=1`.
- 不要粘贴私钥,账户恢复材料, API 代币或
  发送作者标题到提示中.
- 在任何代理提交实时测试网之前,需要交易计划
  计划中应有网络,权威,指令的名称,
  费用资产,飞行前读数,预期结果和重新尝试行为.

为了 Taira MCP 工作流程,见
[继续努力 SORA 3: Taira 并且 Minamoto](/zh-hans/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK 卫生 {#sdk-hygiene}

- 子 SDK 和二进制版本使用
  [兼容性矩阵](/zh-hans/reference/compatibility-matrix.md).
- 保持生成的客户端代码,切片和示例与
  固定上游工作空间修改.
- 增加交易构建代码的单元测试和集成测试
  您的申请取决于最小的阅读和写作路径.
