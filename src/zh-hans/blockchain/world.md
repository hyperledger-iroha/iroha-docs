---
translation_locale: zh-hans
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 世界 {#world}

`World`是包含其他实体的全球实体. `World`由:

- Iroha [配置参数](/zh-hans/guide/configure/client-configuration.md)
- 已注册的同龄人
- 已注册域名
- 已注册的[触发器](/zh-hans/blockchain/triggers.md)
- 注册的 [角色](/zh-hans/blockchain/permissions.md#permission-groups-roles)
- 已注册的 [许可证代币定义](/zh-hans/blockchain/permissions.md#permission-tokens)
- 所有账户的权限代币
- [运行时间验证器链](/zh-hans/blockchain/permissions.md#runtime-validators)

当域名,同行或角色已注册或未注册时, `World` 是 (非) 注册 [指示](/zh-hans/blockchain/instructions.md)的目标.

## 世界状况观 (WSV) {#world-state-view-wsv}

世界状态视图是当前区块链状态的内存表示.它包括`World`,已承诺的区块哈希,交易指数和当前时代选出的同行.从 Kura rather than duplicated as mutable WSV 数据中提供完整的区块有效载荷.

WSV 是查询读取和区块执行发生突变的状态.它本身不是永恒的真理来源.永恒的历史存储在[Kura](#kura-storage),和 WSV 可以从 Kura 块中重建或从状态快照中加载,然后通过重新播放更新的 Kura 块来捕捉.

### 什么是 WSV 的痕迹 {#what-the-wsv-tracks}

WSV 比`World`对象更广泛,实际上它包含:

- `World`:参数,同行,域名,帐户,资产, NFTs,角色,权限,触发器,执行数据和其他注册数据模型对象.
- 已承诺的区块哈希和最新已承诺的高度
- 在查询和收据中使用的交易到区块指数
- 通过共识使用的当前和以前的承诺拓
- 从承诺区块中获得的内存索引,例如数据可用性承诺,收件缓冲器,印意图和查询投影标记
- 对于确定性区块执行所需的运行时间配置快照,例如加密,治理,管道,内容,结算和 Nexus 设置

查询通常在这些结构上只能读取 `StateView`.一个视图是查询执行的一致的快照;它不允许直接突变 WSV.

### WSV 如何变化 {#how-the-wsv-changes}

WSV 区块执行创建了一个区块范围的状态覆盖,每个接受的交易都将其指令应用于交易范围覆盖层中.这些交易所调用的数据触发器运行在相同的区块中.在区块的交易效应之后,时间触发器进行评估.

在共识提交一个区块后,同行首先在 Kura 中排列承诺的区块.如果此次排列步骤失败, WSV 不会进行推进,并且共识循环会重新尝试或排列区块有效载荷.当区块被接受到 Kura 的队列中时,Iroha 将执行后的区块效果应用,更新衍生索引,并在状态视图锁下进行阶段化 WSV 变更. 这使读者无法观察部分承诺的区块.

共识关键规则是,同行必须从相同的承诺区块中达到相同的 WSV.直接将本地编辑到 WSV 数据绕过指令,并且在验证或重播期间会导致同行不同意义.

### 启动和重播 {#startup-and-replay}

在启动时, Iroha 首先初始化 Kura 并学习存储的区块高度.然后试图加载状态快照.如果没有快照,或如果一个快照被拒绝作为可回收的时, Iroha 创建了一个初始状态,并从 Kura 中重新播放承诺块. 如果一个快照是有效的,但落后于 Kura,只有缺失的高度范围才会再播放.

再播验证每个存储的区块,重建该高度的提交列表,将区块效应应用到 WSV,并提交结果状态.这意味着 Kura 是 WSV 的恢复路径,而快照则是一种优化,以避免整个链接重播.

## Kura 存储 {#kura-storage}

Kura 是 Iroha 的持久区块存储.它存储签署的区块和恢复元数据.它不存储 WSV 的第二份可变拷贝.

Kura 存储器根植于[`kura.store_dir`](/zh-hans/reference/peer-config/params.md#param-kura-store-dir).在该根内,区块数据被分为行径或段.一个段的主要文件是:

|路径|目的|
| --- | --- |
|`blocks/<segment>/blocks.data`|连接式 Norito 框架的签署区块有效载荷. |
|`blocks/<segment>/blocks.index`|固定尺寸的 `(start, length)`输入,该地图块高度为 `blocks.data` 中的字节.|
|`blocks/<segment>/blocks.hashes`|为快速查找和启动验证,按高度阻止哈希.|
|`blocks/<segment>/blocks.count.norito`|具有耐用性的提交标记,记录了安全使用的区块指数输入. |
|`blocks/<segment>/da_blocks/`|当磁盘预算执法将旧尸体从热文件中移动时,被排除在 `blocks.data`之外的块实用载荷. |
|`blocks/<segment>/pipeline/sidecars.norito`和 `sidecars.index` |按区块高度调节的管道恢复侧车. |
|`blocks/<segment>/pipeline/roster_sidecars.norito`和 `roster_sidecars.index` |在区块同步和重播中使用的近期提交列表侧车.|
|`merge_ledger/<segment>.log`|结合账本的条目与承诺区块一致.|
|`commit-rosters.norito`|保留近期区块的承诺证书和验证器检查站. |

Kura 为链保持一个紧的内存向量:每个高度都有区块哈希和,可选的是,区块体.最新的 [`kura.blocks_in_memory`](/zh-hans/reference/peer-config/params.md#param-kura-blocks-in-memory)非基因块将其身体存储在记忆中.如果需要的话,旧块体会从记忆中丢弃并从 Kura 文件中重新加载.

在启动过程中, `strict` 模式验证存储的区块从区块有效载荷和重写哈希文件如果需要. `fast` 模式从存储开始.如果 Kura 检测到损坏的尾巴,它将存储量调整至最后一个验证区块.

Kura 通过背景编写器编写新区块. 作者添加区块有效载荷,哈希和索引输入,然后根据配置的fsync政策推进持久计数标记.当磁盘预算执行活动时, Kura 可以清除已退休的部分或驱逐旧区块体进入 `da_blocks/`,同时保持哈希和索引输入可验证和搜索.
