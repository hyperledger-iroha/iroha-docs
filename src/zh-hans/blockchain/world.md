---
translation_locale: zh-hans
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 世界 {#world}

`World` 是包含其他实体的全球实体. `World`
由:

- Iroha [配置参数](/zh-hans/guide/configure/client-configuration.md)
- 已注册的同龄人
- 注册域名
- 已注册 [触发器](/zh-hans/blockchain/triggers.md)
- 已注册
  [角色](/zh-hans/blockchain/permissions.md#permission-groups-roles)
- 已注册
  [许可符号的定义](/zh-hans/blockchain/permissions.md#permission-tokens)
- 所有账户的权限代币
- [运行时间验证器链](/zh-hans/blockchain/permissions.md#runtime-validators)

当域名,同行或角色注册或未注册时, `World`
是 (非) 注册的目标
[指示](/zh-hans/blockchain/instructions.md).

## 世界状况观 (WSV) {#world-state-view-wsv}

世界状态视图是当前区块链的内存表示
其他国家: `World`, 承诺的区块哈希,交易指数,
现在的时代.
Kura 而不是被重复为可变的 WSV 数据.

其他 WSV 这种状态是查询被读取的状态,
长久的历史存储在
[Kura](#kura-storage), 在 WSV 可以从 Kura 块或装载
从一个状态快照,然后被重新播放新的 Kura 子.

### 什么事 WSV 轨迹 {#what-the-wsv-tracks}

其他 WSV 是较宽的 `World` 在实践中,它包含:

- 在 `World`: 参数,同行,域名,账户,资产 NFTs, 角色,
  权限,触发器,执行器数据和其他注册数据模型
  物体
- 承诺的区块哈希和最新承诺的高度
- 在查询和收据中使用的交易到区块指数
- 通过共识使用的当前和以前的承诺拓
- 从承诺区块中获得的内存指数,例如数据可用性
  承诺,收件标记器,针头意图和查询投影标记
- 对于确定性区块执行所需的运行时间配置快照,
  例如加密,治理,管道,内容,结算和 Nexus
  设置

查询通常只能阅读 `StateView` 在这些结构上.
查询执行的视图是一致的快照;它不允许直接
突变的 WSV.

### 如何? WSV 变化 {#how-the-wsv-changes}

WSV 区块执行创建一个
区块范围的状态覆盖,每个接受交易都应用其
交易范围覆盖中的指令.
在同一块中运行的交易.
对区块的交易效果.

在共识承诺一个区块后,同行首先排列了承诺的区块
在 Kura. 如果此次排队步骤失败, WSV 没有进步,
合同循环重新尝试或排列区块的有效载荷.
接受了 Kura 排队, Iroha 使用执行后的块效应,
更新衍生指数,并承诺阶段化 WSV 根据
这使读者无法观察部分承诺的
区块.

基本的原则是,同龄人必须达到相同水平. WSV 根据
直接在本地编辑到 WSV 数据绕行指令和
在验证或重播时,会导致同龄人不同意.

### 启动和重播 {#startup-and-replay}

在启动时, Iroha 启动 Kura 首先学习存储的块高度.
如果没有快照可用,或者如果
快照被拒绝作为可回收的, Iroha 产生一个初始状态,
复制从 Kura. 如果一个快照是有效的,但后面 Kura,
只有缺失的高度范围才能重播.

再播放验证每个存储的区块,重建该区块的提交列表
高度,应用阻塞效应到 WSV, 并且承诺:
这意味着 Kura 是恢复的路径 WSV, 而快照是
一个优化,避免整个链重播.

## Kura 存储 {#kura-storage}

_库拉_ 是 Iroha 它存储签名的区块,
恢复元数据. 它不存储第二份可变的副本 WSV.

Kura 存储是根植于 [`kura.store_dir`](/zh-hans/reference/peer-config/params.md#param-kura-store-dir).
在该根内,区块数据被分为行径或段.
对于一个细分:

| 路径 | 目的 |
| --- | --- |
| `blocks/<segment>/blocks.data` | 连续 Norito- 包装的签名块有效载荷. |
| `blocks/<segment>/blocks.index` | 固定尺寸 `(start, length)` 输入该地图块高度到字节中 `blocks.data`. |
| `blocks/<segment>/blocks.hashes` | 按高度阻止哈希,以便快速查找和启动验证. |
| `blocks/<segment>/blocks.count.norito` | 持久的提交标记记录了安全使用的区块指数输入. |
| `blocks/<segment>/da_blocks/` | 驱逐区块的有效载荷在外面放置 `blocks.data` 当磁盘预算执法将旧尸体从热档案中移除时. |
| `blocks/<segment>/pipeline/sidecars.norito` 并且 `sidecars.index` | 按区块高度调节的管道恢复侧车. |
| `blocks/<segment>/pipeline/roster_sidecars.norito` 并且 `roster_sidecars.index` | 最近使用区块同步和重播. |
| `merge_ledger/<segment>.log` | 合并账本的入口与承诺区块一致. |
| `commit-rosters.norito` | 对最近的区块保留了承诺证书和验证器检查站. |

Kura 保持连锁的紧内存向量:每个高度都有
基因块仍然存储在缓存中,
最新的 [`kura.blocks_in_memory`](/zh-hans/reference/peer-config/params.md#param-kura-blocks-in-memory)
那些非基因块将它们的身体存储在记忆中.
从记忆中掉下来,从 Kura 在需要时,

在启动过程中, `strict` 模式验证存储的区块
如果需要的话,它将重写哈希文件. `fast` 模式从存储开始
哈希/索引元数据,如果该元数据被严格初始化后
如果 Kura 检测到一个腐败的尾巴,它存储到
最后验证的块.

Kura 通过背景编辑器写新区块.
运输的有效载荷,哈希和索引入口,然后推进了耐用计数标记
根据配置的fsync政策.
活跃 Kura 可以清除退休部分或驱逐老区体
`da_blocks/` 保持对验证的哈希和索引输入
现在,我们要去找.
