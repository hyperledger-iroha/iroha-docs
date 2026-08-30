---
translation_locale: zh-hans
translation_source: /blockchain/iroha-explained.md
translation_source_hash: ba591b2c1aa819837177625b1ae457b5fa492197576dc690b19ca2897562a436
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 解释 {#iroha-explained}

Iroha 3 是首次发布的 Hyperledger Iroha 平台.同一个核心支持自主托管网络和 SORA Nexus 数据空间和多行道路由执行模型.

## 核心建筑物 {#core-building-blocks}

- `iroha3d` 运营同行
- Torii 是客户端和运营商门口
- Sumeragi 处理共识
- Norito 是[法定二进制格式](/zh-hans/reference/norito.md)
- IVM 运行便携式智能合同和字节码
- Kotodama 将高层 `.ko`合同编译成 IVM `.to`字节码.
- Kagami 准备钥匙,基因,个人资料和局域网
- SORA Nexus 服务飞机添加 Soracloud,Inrou, SoraNet, SoraFS 和 SoraDNS 用于应用程序托管,隐私运输,存储和命名.

## 执行模式 {#execution-model}

每个世界状态的变化都是通过交易发生的.交易包含指令或 IVM 字节码,并且 Torii 是客户提交或观察它们的主要方式.的效果.

- Nexus - 意识配置可以定义多条车道
- 数据空间将工作负载隔离,同时仍然是同一本书模型的一部分
- 路由政策决定哪个行径和数据空间处理一个类型的工作

## 多数据空间架构 {#multi-dataspace-architecture}

数据空间是一个路由和命名空间的边界,而不是一个单独的区块链.运行时间仍然有一个 `World`,一个交易模型和一个共识管道. Nexus 添加了目录,告诉节点如何在线条之间进行分区工作以及如何命名这些线条服务的数据区域.

在运行时,一个数据空间由数值 `DataSpaceId` 和目录元数据表示. `DataSpaceId::UNIVERSAL`被保留为`0`;默认目录包含`universal`的数据空间.每个配置的数据空间有:

- 一个单独的数字 ID
- 一个独特的姓氏,例如 `universal`, `governance`或 `zk`
- 操作者表面的可选描述
- 用于测量继电委员会的非零值 `fault_tolerance`

路线是与这些数据库的执行和存储路线. `LaneId`, 其他 `DataSpaceId` 它提供了一个别名,可见性 (`public` 或 `restricted`),存储资料 (`full_replica`, `commitment_only`, 或 `split_replica`),证明方案,以及可选的治理,结算和规划者元数据.运行时间从本目录中得出每条车道存储几何,包括 Kura 细分名称和确定性关键前置.

路由路径是:

1. 配置构建验证的 `DataSpaceCatalog`,`LaneCatalog`和 `LaneRoutingPolicy`.多条路径,多个数据空间或非默认路由需要 `nexus.enabled = true`.
2. 交易队列要求主轨路由器查询一个 `RoutingDecision` 包含一条 ID 的车道和数据空间 ID.
3. 显而易见的路由规则可以根据权威/帐户或指令标签匹配.没有匹配规则,路由器可以从域名 IDs,资产定义预测,数据空间范围许可证,结算脚本或权威的绑定账户范围中导出数据空间.
4. 已解决的路线与两个目录进行检查.未知路径,未知的数据区和路径/数据区不匹配是确定性路线错误.如果一个交易向两个不同的数据空间目标写信,则将被拒绝为相互矛盾的路线;跨数据空间 DVP/PVP 结算通过通用协调者轨道进行.
5. Sumeragi 和远程测量将任务视为轨道和数据空间活动,后期记录和承诺快照.

这就是为什么对象识别器很重要.域名包括数据空间的号在他们的 ID 中,例如 `payments.universal`,因此可以将域名扩展的写字导向.账户仍然是规范性和无域名的,因此同一个帐户可以在不改变其 `AccountId`应用范围的情况下被绑定到不同的应用范围.资产定义可以携带一个域/数据空间投影,这使得资产操作继承正确的数据空间路线.

没有 Nexus 过关,节点使用单条车道和 `universal` 数据空间.捆绑的 SORA 配置文件取代了三条车道目录:`core`用于通用公共车道,`governance`用于治理交通,和`zk`用于零知识附加和合同部署交通.

这些三个默认设置存在于分离工作负载类:

|数据空间|莱恩|为什么它存在?|
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|`universal`|`core`|为普通公开账本流量和倒车路由而保留的默认数据空间 (`DataSpaceId::UNIVERSAL == 0`) |
|`governance`|`governance`|限制管理和议会流量,因此控制平面活动不与一般应用书籍混合.|
|`zk`|`zk`|限制对零知识证明,附件和合同部署路由的行径,保持检测重的工作流程与正常写作分开. |

只有 `universal` 是保留的基线. `governance` 和 `zk` 在捆绑目录和路由政策中编码 SORA 配置文件选项;运营商在需要不同的数据空间界限时可以定义不同的目录.

Sumeragi 始终使用数据可用性和可靠的广播.这些路径是 Iroha 3 共识协议的一部分,不能被部署配置文件禁用.

运行时间行为来源于配置文件和链上参数.环境变量不是生产特征门.

## 下一篇阅读 {#read-next}

- [SORA Nexus 服务](/zh-hans/blockchain/sora-nexus-services.md)
- [发射 Iroha 3](/zh-hans/get-started/launch-iroha.md)
- [世界, WSV 和 Kura 存储](/zh-hans/blockchain/world.md)
- [创世记引用](/zh-hans/reference/genesis.md)
- [Torii 终端点](/zh-hans/reference/torii-endpoints.md)
