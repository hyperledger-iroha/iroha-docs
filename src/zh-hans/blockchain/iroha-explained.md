---
translation_locale: zh-hans
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 16acd0a607bbec336ff336363478a3a0deeb24ad9a2ad59e753c9f65134b061f
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Iroha 解释 {#iroha-explained}

Iroha 3 是首次发布的 Hyperledger Iroha 平台.同一个核心支持自主托管网络和 SORA Nexus 数据空间和多行道路由执行模型.

## 核心建筑物 {#core-building-blocks}

- `iroha3d` 运营对等节点
- Torii 是客户端和运营商门口
- Sumeragi 处理共识
- **Norito** 是[规范二进制格式](/zh-hans/reference/norito.md)
- IVM 运行便携式智能合同和字节码
- Kotodama 将高层 `.ko`合同编译成 IVM `.to`字节码.
- Kagami 准备钥匙,创世,个人资料和局域网
- **SORA Nexus 服务层**加入 Soracloud、Inrou、SoraNet、SoraFS 和 SoraDNS，用于应用托管、隐私传输、存储和命名。

## 执行模式 {#execution-model}

每个世界状态的变化都是通过交易发生的.交易包含指令或 IVM 字节码,并且 Torii 是客户提交或观察它们的主要方式.的效果.

- 数据空间为机构数据、授权、策略和应用提供环境
- 执行通道在这些环境中提供路由和认证能力
- 独立签名的数据空间根拥有自己的 State 和本地最终性

## 数据空间和执行根 {#multi-dataspace-architecture}

数据空间目录条目定义一个环境及其身份。目录条目本身不建立独立执行根。公开执行通道认证交易批次，供全局链执行；独立签名的数据空间根则拥有自己的 State、委员会和本地最终性。

`DataSpaceCatalog` 定义数据空间，而 `LaneCatalog` 定义执行通道。每个执行通道通过 `dataspace_id` 引用恰好一个数据空间；一个数据空间可以包含多个执行通道。`DataSpaceId` 和 `LaneId` 是不同的身份，执行通道别名不会创建另一个数据空间。

运行时以数字 `DataSpaceId` 和目录元数据表示数据空间。`DataSpaceId::UNIVERSAL` 的保留值为 `0`；默认目录包含 `universal` 数据空间。每个已配置的数据空间具有：

- 一个单独的数字 ID
- 唯一别名，例如 `universal` 或明确注册的机构名称
- 操作者表面的可选描述
- 用于测量继电委员会的非零值 `fault_tolerance`

执行通道是绑定到这些数据空间的路由和认证资源。通道条目包含 `LaneId`、其服务的 `DataSpaceId`、别名、可见性（`public` 或 `restricted`）、存储配置（`full_replica`、`commitment_only` 或 `split_replica`）、证明方案，以及可选的治理、结算和调度器元数据。运行时从目录派生每条通道的存储布局，包括 Kura 段名称和确定性键前缀。

路由路径是:

1. 配置会构建经过验证的 `DataSpaceCatalog`、`LaneCatalog` 和 `LaneRoutingPolicy`。SORA Nexus 路由是强制性的。在全局根上，多个数据空间、执行通道或非默认路由需要 SORA Nexus 配置文件（`--sora`）和 NPoS；独立签名的数据空间根以许可型模式运行。
2. 交易队列根据交易及已提交状态解析 `RoutingPlan`。每个协调者或参与者路由都包含执行通道标识和数据空间标识；Native AMX 计划保留完整的参与者集合。
3. 对于全局执行，完整的控制平面批次和跨数据空间协调者使用执行通道 `0`。具体的非通用空间指令目标或合约地址目标，会先选择与数据空间及委员会匹配、已获准的固定执行通道，然后才考虑账户或指令标签规则。其他工作遵循已提交的显式规则和默认分片；具体的通用空间目标仍留在通用空间执行通道上。
4. 每个路由都根据目录和活跃执行通道状态进行检查。未知标识以及通道与数据空间不匹配的情况均被拒绝；不可用的私有目标不得回退到通用空间执行。多个数据空间目标可以生成 Native AMX 计划。交易元数据 `amx_policy` 设为 `reject_cross_dataspace` 时，会拒绝跨数据空间计划。路由计划本身不授权也不完成独立根之间的结算。
5. 遥测通过 `/status` 执行通道快照（`teu_lane_commit`）中各执行通道的活动和积压，持续展示分配情况。

这就是对象标识符的重要性。域标识包含数据空间别名，例如 `payments.universal`，使域范围内的写入能够正确路由。账户仍采用规范标识且不包含域，因此同一账户可绑定到不同应用范围，而无需改变其 `AccountId`。资产定义可以携带域或数据空间投影，使资产操作继承正确的数据空间路由。

没有 SORA Nexus 覆盖配置时，节点使用一条执行通道和 `universal` 数据空间。随附的 SORA Nexus 配置将其替换为三通道目录：`core` 用于通用公开通道，`governance` 用于治理流量，`zk` 用于零知识附件和合约部署流量。

随附的三条执行通道均为公开通道，引用同一个 `universal` 数据空间。它们用于区分工作负载类别：

| 数据空间 | 执行通道 | 用途 |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal` | `core` | 普通公开账本流量与默认路由。 |
| `universal` | `governance` | 公开治理与 SORA Parliament 流量。 |
| `universal` | `zk` | 公开的零知识附件和合约部署流量。 |

`DataSpaceId::UNIVERSAL == 0` 是保留的基础标识。上述 `governance` 和 `zk` 名称标识执行通道，而非独立数据空间。不同机构边界需要显式的数据空间条目；独立执行还需要经过独立认证的根。

这些关系由固定版本中的[配置构造函数](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_config/src/parameters/actual.rs)、[执行通道实现](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/sumeragi/lanes/mod.rs)及[独立根协议约定](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi.md)确定。

Sumeragi 始终使用已签名的 RS16 载荷可用性和认证区块体恢复。这些路径是 Iroha 3 共识协议的一部分，无法通过部署配置文件禁用。

运行时行为由配置文件和链上参数决定。环境变量不能用作生产环境中的功能开关。

## 下一篇阅读 {#read-next}

- [SORA Nexus 服务](/zh-hans/blockchain/sora-nexus-services.md)
- [启动 Iroha 3](/zh-hans/get-started/launch-iroha.md)
- [世界, WSV 和 Kura 存储](/zh-hans/blockchain/world.md)
- [创世记引用](/zh-hans/reference/genesis.md)
- [Torii 端点](/zh-hans/reference/torii-endpoints.md)
