---
translation_locale: zh-hans
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 应用程序开发 {#application-development}

Iroha 应用程序应该明确交易行为,保持签名状态包含,并以生产中容易观察的方式使用查询和事件.

## 客户端设置 {#client-setup}

- 在应用程序源代码之外存储客户端配置.从环境特定的配置中加载链接 ID, Torii URL,签字帐户和交易设置.
- 保持`client.toml`文件为本地网络,Taira, Minamoto 和私人网络分开.复制的测试网签名器永远不应该成为主网签名符.
- 应有意设置交易生命周期和状态超时。在正常网络抖动下，过短的生命周期可能会到期，而过长的生命周期会使重复提交更难推断。
- 仅当重复交易应具有不同哈希时，才使用 `nonce = true`。对于幂等业务操作，应存储并复用应用请求 ID，以便追踪重试。

对于当前 TOML 字段,请参见[客户端配置](/zh-hans/guide/configure/client-configuration.md).

## 交易 {#transactions}

- 在可能的情况下,从输入 SDK 指示中构建交易,而不是原始的 JSON 或连线组装的实用载荷.
- 预飞重要用仅阅读查询写:账户存在,资产余额,许可状态,费用资产可用性和目标对象状态.
- 在提交之前记录交易哈希,授权主体账户,说明总结和预期状态变化.
- 处理 `Rejected`, `Expired`,截止时间结果不同.截止时间意味着客户没有观察到最终状态;这并不证明网络忽略了交易.
- 在成功编写后,通过与业务运营匹配的查询或事件检查点验证结果状态.

对于交易机制,请见 [交易](/zh-hans/blockchain/transactions.md).

## 查询和事件 {#queries-and-events}

- 使用当前状态和事件流的查询进行变更通知.避免用重复广泛查询取代事件处理.
- 页面化广泛的可重复查询,如账户,资产和区块列表.
- 对于订阅和触发器,更喜欢狭窄的过滤器.宽度过滤器对诊断有用,但可增加不必要的执行和客户端处理.
- 保持仅阅读式烟雾检查与签署的交易测试分开,以便更容易诊断端点可用性.

查看[查询](/zh-hans/blockchain/queries.md), [事件](/zh-hans/blockchain/events.md)和 [过滤器](/zh-hans/blockchain/filters.md).

## 经纪人协助的发展 {#agent-assisted-development}

- 让特工检查医生,SDK 代码,并要求他们编写交易代码之前只读取网络状态.
- 在 `TAIRA_LIVE=1` 等环境标志背后进行现场网络测试选择.
- 不要将私钥,账户恢复材料, API 代币或转发的作者标题粘贴到提示中.
- 在任何代理提交实时测试网交易之前,需要一个交易计划.该计划应该命名网络,授权主体,指令,费用资产,航班前阅读,预期结果和重复尝试行为.

对于 Taira MCP 工作流程,请见 [建立在 SORA 3: Taira 和 Minamoto](/zh-hans/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK 卫生 {#sdk-hygiene}

- 通过使用[兼容性矩阵](/zh-hans/reference/compatibility-matrix.md)的Pin SDK 和二元版本一起.
- 保持生成的客户端代码,片段和示例与固定上游工作空间修改同步.
- 添加单元测试用于构建交易代码和集成测试,以满足您的应用程序所依赖的最小阅读和写路径.
