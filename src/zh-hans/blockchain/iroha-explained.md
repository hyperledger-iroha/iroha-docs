---
translation_locale: zh-hans
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 3fdd22338e826b1ce335ebf5e4e850cf3deb9415c36a0c8d21ad63c397cec8c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 解释 {#iroha-explained}

Iroha 3 是首次发布的 Hyperledger Iroha 同一个核心.
支持自主托管网络和 SORA Nexus 数据执行模型
空间和多行径路由.

## 核心建筑物 {#core-building-blocks}

- **`irohad`** 运行同龄人
- **Torii** 是客户端和运营商的网关
- **Sumeragi** 处理共识
- **Norito** 是 [常规二进制格式](/zh-hans/reference/norito.md)
- **IVM** 运行便携式智能合约和字节码
- **Kotodama** 编制高层次的 `.ko` 签订合同 IVM `.to` 字节码
- **Kagami** 准备钥匙,基因,个人资料和局域网
- **SORA Nexus 服务飞机** 加入 Soracloud, 在内卢, SoraNet, SoraFS, 并且
  SoraDNS 用于应用程序托管,隐私运输,存储和命名

## 执行模式 {#execution-model}

世界状况的每一个变化都通过交易.
交易包含指令或 IVM 字节码,以及 Torii 是主要的方法
客户提交或观察其影响.

- Nexus- 有意识的配置可以定义多条车道
- 数据空间将工作负载隔离,同时仍然是同一本书模型的一部分
- 路由政策决定哪个行径和数据空间处理一个类型的工作

## 多数据空间架构 {#multi-dataspace-architecture}

数据空间是一个路由和命名空间的边界,而不是一个单独的区块链.
运行时间仍然有一个 `World`, 一个交易模式和一个共识
管道. Nexus 添加节点如何进行分区工作的目录
如何命名这些路径服务的数据库.

在运行时,一个数据空间由数值表示 `DataSpaceId` 并且
列表元数据. `DataSpaceId::UNIVERSAL` 保留为 `0`; 默认
产品目录包含 `universal` 每个配置的数据域都有:

- 一个独特的数字 ID
- 一个独特的别名,如 `universal`, `governance`, 或 `zk`
- 操作者表面的可选描述
- 一个不为零 `fault_tolerance` 用于测量继电委员会的价值

运行路线是与这些数据库的执行和存储路线.
车道入口载有 `LaneId`, 在 `DataSpaceId` 它是个别名,
可见性 (`public` 或 `restricted`),存储资料 (`full_replica`,
`commitment_only`, 或 `split_replica`),证明方案和可选
管理,结算和调度器的元数据.
本目录中每行车存储几何,包括 Kura 部分名称
确定性关键前置.

路由路径是:

1. 配置构建一个验证的 `DataSpaceCatalog`, `LaneCatalog`, 并且
   `LaneRoutingPolicy`. 多条路径,多个数据库或非默认
   路由要求 `nexus.enabled = true`.
2. 交易队列要求主动路由器
   `RoutingDecision` 含有车道 ID 和数据空间 ID.
3. 具体的路由规则可以根据权威/账户或指令匹配
   没有匹配规则,路由器可以从
   域名 IDs, 资产定义预测,数据空间扩展权限
   结算阶段或该机构的绑定账户范围.
4. 解决路线与两个目录进行检查.
   不知名的数据空间,以及行径/数据空间不匹配是决定性的
   如果一个交易写到两个不同的数据空间
   目标,它被拒绝为矛盾的路线;跨数据空间 DVP/PVP
   解决方案通过通用协调者路线进行.
5. Sumeragi 和远程测量使任务视为车道和数据空间
   活动,后载和承诺的快照.

这就是为什么对象识别符是重要的.域包括数据空间的号
在他们的 ID, 例如: `payments.universal`, 因此,域范围的写作可以
账户仍然是正规的,没有域名,所以同一个帐户
可以将其绑定到不同的应用范围,而不会改变其
`AccountId`. 资产定义可以包含域/数据空间投影,
这使得资产运算继承了正确的数据空间路线.

没有 Nexus 节点使用单条车道, `universal`
数据空间. SORA 形状取代了三条车道
产品目录 `core` 对于通用公共车道, `governance` 治理
交通,以及 `zk` 对零知识的附加和合同部署
交通.

这些三个默认存在分离工作负载类别:

| 数据空间    | 路线         | 为什么它存在                                                                                                                                       |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal`  | `core`       | 预备的默认数据空间 (`DataSpaceId::UNIVERSAL == 0`)用于普通公共账本流量和回路.                                 |
| `governance` | `governance` | 管理和议会流量受到限制,因此控制平面活动不与一般应用书籍混合.                      |
| `zk`         | `zk`         | 对零知识证据,附件和合同部署路由进行限制的行径,保持检测重的工作流程与正常写作分开. |

只有 `universal` 是保留的基线. `governance` 并且 `zk` 是 SORA
在捆绑的目录和路由政策中编码的个人资料选项;
当需要不同的数据空间时,操作员可以定义不同的目录
边界

Sumeragi 总是使用数据可用性和可靠的广播.
部分的 Iroha 3 通过部署无法禁用共识协议
个人资料.

运行时间行为来源于配置文件和链上参数.
环境变量不是生产特征门.

## 下一篇阅读 {#read-next}

- [SORA Nexus 服务](/zh-hans/blockchain/sora-nexus-services.md)
- [发射 Iroha 3](/zh-hans/get-started/launch-iroha.md)
- [世界, WSV, 并且 Kura 存储](/zh-hans/blockchain/world.md)
- [创世记的参考](/zh-hans/reference/genesis.md)
- [Torii 终点](/zh-hans/reference/torii-endpoints.md)
