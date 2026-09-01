---
translation_locale: zh-hans
translation_source: /reference/glossary.md
translation_source_hash: ab484310e7e0b0662c1d4bb133e7ae337c71b09b5fdc8e678581234d74ee9b29
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 词汇表 <!-- omit in toc --> {#glossary}

在此,您可以找到所有与 Iroha 有关的实体的定义.

- [对等节点](#peer)
- [资产](#asset)
- [拜占庭的故障耐受性 (BFT) ](#byzantine-fault-tolerance-bft)
- [Iroha 组件](#iroha-components)
  - [Sumeragi (皇帝)](#sumeragi-emperor)
  - [Torii (门)](#torii-gate)
  - [Kura (仓库)](#kura-warehouse)
  - [Kagami(教师和模范和/或镜子)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [梅克尔树 (哈什树)](#merkle-tree-hash-tree)
  - [智能合同](#smart-contracts)
  - [触发器](#triggers)
  - [版本](#versioning)
  - [希吉里 (对等节点声誉系统) ](#hijiri-peer-reputation-system)
- [Iroha 模块](#iroha-modules)
- [Iroha 特别指示 (ISI)](#iroha-special-instructions-isi)
  - [实用性 Iroha 特殊指令](#utility-iroha-special-instructions)
  - [核心 Iroha 特殊指示](#core-iroha-special-instructions)
  - [域名特定的 Iroha 特殊指令](#domain-specific-iroha-special-instructions)
  - [关税 Iroha 特别说明](#custom-iroha-special-instruction)
- [Iroha 查询](#iroha-query)
- [查看变更](#view-change)
- [世界状态观 (WSV) ](#world-state-view-wsv)
- [领导者](#leader)

## 区块链账本 {#blockchain-ledgers}

区块链账本是使用区块链技术保存财务记录的数字记录系统.这些名字源于用于价格,新闻和交易信息等金融记录的古老书籍.

在中世纪期间,账本开放以供公众查看和验证准确性.这种想法反映在基于区块链的系统中,可以检查存储的数据是否有效.

## 对等节点 {#peer}

在 Iroha 中的对等节点是指其他 Iroha 进程和客户端应用程序可以连接到的 Iroha 过程实例. 一台机器可以容纳多个 Iroha 对等节点.对等节点在资源和能力方面是平等的,但有一个重要例外:只有一个对等节点在 Iroha 网络启动阶段运行创世块.

其他区块链可能与节点或验证符相同的概念.

一个对等节点可以是其主机系统上的过程. 它也可以包含在一个 Docker 容器和 Kubernetes 子中.

## 资产 {#asset}

在区块链的背景下,资产是对区块链上的有价值物体的表示.

关于资产的额外信息可在 [上找到](/zh-hans/blockchain/assets.md).

### 性资产 {#fungible-assets}

这些资产可以很容易地换成同类型的其他资产,因为它们是可互换的.

例如,同一货币的所有单位的价值均等,并且可以用于购买商品.通常,可形资产外观相同,除了纸币和硬币的磨损.

### 无性资产 {#non-fungible-assets}

由于其特殊特征和稀有性,非形资产是独特的和有价值的;它们的价值与其他资产无法比较.

- 一幅画的价值可以根据艺术家,绘画时间以及公众对其感兴趣而变化.
- 一条街上的两个房子可能有不同的维护水平.
- 珠宝制造商通常提供各种不同的设计.

### 可铸造资产 {#mintable-assets}

如果可以发行更多相同类型的资产，该资产就是可铸造的。

### 不可铸造资产 {#non-mintable-assets}

如果资产的初始数量只指定一次且不再更改，该资产就被视为不可铸造。

[Genesis块](/zh-hans/guide/configure/genesis.md)为 Iroha 配置设置了此信息.

## 拜占庭的故障耐受性 (BFT) {#byzantine-fault-tolerance-bft}

能够在包含一定比例的恶意行为者网络中正常运行的特性.Iroha 能够与其同等网络中最多33%的恶意行为者进行操作.

## Iroha 组件 {#iroha-components}

包含 Iroha 功能的 Rust 模块.

### Sumeragi (皇帝) {#sumeragi-emperor}

负责共识的 Iroha 模块.

### Torii (门) {#torii-gate}

包含[对等节点](#peer)传入请求处理逻辑的模块。它用于接收、接受和路由传入的指令及 HTTP 查询，也用于处理运行时配置更新。

### Kura (仓库) {#kura-warehouse}

一个持续的块存储. Kura 存储签名区块,区块哈希,高度索引,恢复辅助记录和在磁盘上提交列表的元数据. [世界状况的看法](#world-state-view-wsv) 是从 Kura 当状态快照不可或在本地区块商店后面. [Kura 存储](/zh-hans/blockchain/world.md#kura-storage).

### Kagami(教师和示范者及/或镜子) {#kagami-teacher-and-exemplar-and-or-looking-glass}

通常使用的数据生成器. 它可以生成加密密钥对,创世区块,文档等.

### 梅克尔树 (树) {#merkle-tree-hash-tree}

一个用于验证和验证每个区块高度状态的数据结构. Iroha 目前的实现是二进制树.查看[Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree)详细信息.

### 智能合同 {#smart-contracts}

智能合同是基于区块链的程序,在满足特定条件时运行. 在 Iroha 中,智能合约使用[核心 Iroha 特殊指令](#core-iroha-special-instructions)实现.

### 触发器 {#triggers}

事件类型,允许调用一个 Iroha 具体区块提交,时间 (含有一些警告) 等方面的特殊指示. [在这里](/zh-hans/blockchain/triggers.md).

### 版本化 {#versioning}

每个请求都标记着它属于的 API 版本. 它允许 Iroha 客户端/对等节点软件的不同二进制版本的组合相互操作,这反过来可以在 Iroha 网络中进行软件升级.

### 希吉里 (对等节点声誉系统) {#hijiri-peer-reputation-system}

Iroha 的声誉系统.它允许优先与具有良好的轨迹记录的[对等节点](#peer)进行沟通,并减少恶意的[对等节点](#peer)造成的伤害.

## Iroha 模块 {#iroha-modules}

Iroha 的第三方扩展,提供了定制功能.

## Iroha 特殊指示 (ISI) {#iroha-special-instructions-isi}

提供 Iroha 的智能合同库. 这些可以通过交易或注册活动听众来调用.更多信息在 ISI [这里](/zh-hans/blockchain/instructions.md).

#### 实用性 Iroha 特殊指示 {#utility-iroha-special-instructions}

这套 [isi](#iroha-special-instructions-isi)包含像 `If`这样的逻辑指令,类似于 `Notify`这样的I/O相关指令和`Sequence`这样的组合.它们主要被用作[定制指令](#custom-iroha-special-instruction).

### 核心 Iroha 特殊指示 {#core-iroha-special-instructions}

[每次 Iroha 部署都提供了特殊指令](#iroha-special-instructions-isi).其中包括一些 [域名特定的指令](#domain-specific-iroha-special-instructions)以及 [实用性指令](#utility-iroha-special-instructions).

### 特定领域的特殊指示 Iroha {#domain-specific-iroha-special-instructions}

与特定领域的活动相关的指令:资产,账户,域名,对等节点管理).这些指令提供了安全和安全的方式对[世界状态视图](#world-state-view-wsv)进行变更所需的工具.

### 关税 Iroha 特殊指示 {#custom-iroha-special-instruction}

由 [Iroha 模块](#iroha-modules)、客户端或第三方提供的指令。这些指令只能使用[核心指令](#core-iroha-special-instructions)构建。不建议分叉和修改 Iroha 源代码，因为 Iroha 部署中的[对等节点](#peer)未达成一致的特殊指令会被视为故障，因此运行修改实例的[对等节点](#peer)将被撤销访问权限。

## Iroha 查询 {#iroha-query}

要求阅读世界状况视图而不修改该视图.更多关于查询 [在](/zh-hans/blockchain/queries.md).

## 查看变化 {#view-change}

一个在未能达成共识的情况下进行的过程. 通常,这涉及选举一个新的 [领导人](#leader).

## 世界状态的视角 (WSV) {#world-state-view-wsv}

目前的区块链状态在内存中表示. WSV 包含了 `World`, 已提交的区块哈希,交易索引,共识拓和被查询所使用的派生索引.它只有通过提交的区块更新,可以从 [Kura](#kura-warehouse). 查看 [世界状况的看法](/zh-hans/blockchain/world.md#world-state-view-wsv).

## 领导者 {#leader}

在 Iroha 网络中，系统会随机选出一个对等节点，并授予其创建下一个区块的特殊权限。在实现[拜占庭容错](#byzantine-fault-tolerance-bft)的网络中，可以通过[视图变更](#view-change)撤销该权限。
