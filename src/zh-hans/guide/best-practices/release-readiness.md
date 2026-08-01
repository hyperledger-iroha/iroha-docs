---
translation_locale: zh-hans
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 984957526424a4e0ec9f29a6da1bb64699245bb135e8157bbe684bc3d87de4cc
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 发布就绪 {#release-readiness}

在推进 Iroha 应用或网络变更之前，先在能够暴露相关风险的最小环境中验证其行为，再有计划地通过共享测试网和生产环境的各道关卡。

## 本地网络关卡 {#localnet-gate}

- 使用相同的 Iroha 版本轨道和实际条件下最接近的验证者数量，启动一个可随时销毁的本地网络。
- 为交易构建器、查询解析、拒绝处理和配置加载运行单元测试。
- 通过应用之后将使用的同一种 SDK 或 CLI 接口，演练最小的成功读取与写入路径。
- 在测试制品中记录预期的交易哈希、状态、事件和状态读取结果。

请参阅[启动 Iroha 3](/zh-hans/get-started/launch-iroha.md)和 [SDK 教程](/zh-hans/guide/tutorials/)。

## 共享测试网关卡 {#shared-testnet-gate}

- 使用 Taira 或其他共享测试网验证端点行为、费用、账户资金、延迟并进行运维演练。
- 让实时测试网写入保持为显式选择加入，避免普通测试运行依赖网络可用性或消耗测试网资金。
- 提交每笔实时测试交易之前，验证签名者资金、费用资产元数据、授权主体的权限和预期状态。
- 等待交易进入终态，再使用只读查询验证产生的状态。

请参阅[在 SORA 3 上构建：Taira 与 Minamoto](/zh-hans/get-started/sora-nexus-dataspaces.md)。

## 主网或生产环境关卡 {#mainnet-or-production-gate}

- 为生产环境使用独立的签名者、资金、域和配置路径。不要沿用测试网密钥或水龙头假设。
- 使用[兼容性矩阵](/zh-hans/reference/compatibility-matrix.md)确认所需的跨 SDK 场景。还要分别固定并测试部署所使用的确切 CLI、节点二进制文件、配置和网络版本。
- 在发布窗口开始前，审查权限、费用赞助、速率限制、监控、备份状态和回滚条件。
- 对影响重大的写入操作，必须制定书面的交易或迁移计划。

## 回滚与恢复 {#rollback-and-recovery}

- 明确哪些变更可通过代码部署回滚、哪些需要链上交易，以及哪些无法直接撤销。
- 对链上数据变更，应在第一次生产写入之前准备好补偿交易或迁移脚本。
- 对网络变更，在发布期间应保留上一版二进制文件、配置包、已签名的创世块以及运维手册。
- 根据拒绝率、队列增长、延迟或节点健康状况等客观信号，设定中止推出的决策点。

## 最终检查清单 {#final-checklist}

- 配置按环境隔离，且不包含仅供测试使用的秘密。
- 交易重试行为具备幂等性，或受到明确限制。
- 应用能够区分拒绝、到期、超时和端点不可用等故障。
- 监控覆盖吞吐量、延迟、队列深度、拒绝、视图变更以及相关业务事件。
- 运维人员拥有应对预期故障模式的操作手册。
- 安全审查已覆盖密钥托管、权限、网络暴露面和自动化权限。
