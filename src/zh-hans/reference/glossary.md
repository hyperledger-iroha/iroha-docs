---
translation_locale: zh-hans
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 词典 <!-- omit in toc --> {#glossary}

在这里你可以找到所有定义 Iroha- 相关实体.

- [同龄人](#peer)
- [资产](#asset)
- [拜占庭的错误耐受性 (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha 组件](#iroha-components)
  - [Sumeragi 皇帝.](#sumeragi-emperor)
  - [Torii (门)](#torii-gate)
  - [Kura (仓库)](#kura-warehouse)
  - [Kagami(教师和示例和/或镜子)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [树 (树)](#merkle-tree-hash-tree)
  - [智能合同](#smart-contracts)
  - [触发器](#triggers)
  - [版本化](#versioning)
  - [希吉里 (同行声誉系统)](#hijiri-peer-reputation-system)
- [Iroha 模块](#iroha-modules)
- [Iroha 特别指示 (ISI)](#iroha-special-instructions-isi)
  - [实用性 Iroha 特别指示](#utility-iroha-special-instructions)
  - [核心 Iroha 特别指示](#core-iroha-special-instructions)
  - [特定域名 Iroha 特别指示](#domain-specific-iroha-special-instructions)
  - [定制品 Iroha 特别指令](#custom-iroha-special-instruction)
- [Iroha 查询](#iroha-query)
- [查看变化](#view-change)
- [世界国家观 (WSV)](#world-state-view-wsv)
- [领导者](#leader)

## 区块链账本 {#blockchain-ledgers}

区块链账本是使用区块链的数字记录系统
它们以古老的历史名字命名.
那些用于财务记录的书籍,如价格,新闻和
交易信息.

在中世纪期间,本书开放给公众观看
这种想法反映在基于区块链的
能够检查存储的数据是否有效.

## 同龄人 {#peer}

一个同行 Iroha 意思是 Iroha 处理实例,其他 Iroha 过程
客户端应用程序可以连接.
一台机器可以容纳多个 Iroha 同龄人.
同龄人在资源和能力方面是平等的,
只有一个同龄人才会跑
在启动阶段的基因块 Iroha 网络.

其他区块链可能与节点或验证器相同的概念.

一个同行可以是其宿主系统中的进程.
它也可以包含在一个 Docker 一个容器和一个Kubernetes.

## 资产 {#asset}

在区块链的背景下,资产是代表价值
在区块链上.

关于资产的额外信息可用
[在这里](/zh-hans/blockchain/assets.md).

### 流动资产 {#fungible-assets}

这些资产可以很容易地换成同类型的其他资产,因为
它们可以互换.

例如,同一货币的所有单位的价值和
它们可以用于购买货物.
除了纸币和硬币的磨损外,外观.

### 无的资产 {#non-fungible-assets}

由于其特征,非性资产是独特的和有价值的
它们的价值与其他资产无法比较.

- 一幅画的价值可以根据艺术家,
  现在,我在画了这幅画.
- 一条街上的两个房子可能有不同的维护水平.
- 珠宝制造商通常提供各种不同的设计.

### 可存储的资产 {#mintable-assets}

如果可以发行更多相同类型的资产,则会产生资产.

### 无可拆除资产 {#non-mintable-assets}

如果资产的初始额度被指定一次,并且没有变化,
被认为是不可食用的.

其他 [基因区块](/zh-hans/guide/configure/genesis.md) 设置此信息为
在 Iroha 配置.

## 拜占庭的错误耐受性 (BFT) {#byzantine-fault-tolerance-bft}

能够正常运行的特性
一些恶意行为者. Iroha 能够运行
在其同行网络中,最多有33%的恶意行为者.

## Iroha 组件 {#iroha-components}

Rust 含有 Iroha 功能性.

### Sumeragi 皇帝. {#sumeragi-emperor}

其他 Iroha 负责共识的模块.

### Torii (门) {#torii-gate}

接入请求处理逻辑的模块 [同龄人](#peer). 它被用来
接收,接受和传送接入的指示; HTTP 其他问题
作为运行时间配置更新.

### Kura (仓库) {#kura-warehouse}

持续的区块存储. Kura 商店签名区块,区块哈希,高度
在磁盘上的指数,恢复侧车和提交列表的元数据.
[世界状况的看法](#world-state-view-wsv) 已从 Kura 区块时
状态快照无法获取或在本地区块商店后面.
[Kura 存储](/zh-hans/blockchain/world.md#kura-storage).

### Kagami(教师和示例和/或镜子) {#kagami-teacher-and-exemplar-and-or-looking-glass}

它可以生成加密密钥对,
基因块,文档等.

### 树 (树) {#merkle-tree-hash-tree}

用于验证和验证每个区块状态的数据结构
它们的高度. Iroha 目前的实现是二进制树.
[维基媒体](https://en.wikipedia.org/wiki/Merkle_tree) 了解更多细节.

### 智能合同 {#smart-contracts}

智能合同是基于区块链的程序,
符合条件. Iroha 智能合同使用
[核心 Iroha 特殊指示](#core-iroha-special-instructions).

### 触发器 {#triggers}

事件类型允许调用一个 Iroha 在特定的
区块提交,时间 (含有一些警告) 等.
[在这里](/zh-hans/blockchain/triggers.md).

### 版本化 {#versioning}

每个请求都标记着: API 它属于哪个版本.
允许组合不同的二进制版本的 Iroha 客户/同行
互操作的软件,这反过来允许在
Iroha 网络.

### 希吉里 (同行声誉系统) {#hijiri-peer-reputation-system}

Iroha 它允许优先考虑与 [同龄人](#peer)
具有良好的轨迹记录,并减少可能造成的损害
恶意 [同龄人](#peer).

## Iroha 模块 {#iroha-modules}

第三方扩展到 Iroha 提供定制功能.

## Iroha 特别指示 (ISI) {#iroha-special-instructions-isi}

提供智能合同的库 Iroha. 这些可以通过
交易或注册活动听众. ISI
[在这里](/zh-hans/blockchain/instructions.md).

#### 实用性 Iroha 特别指示 {#utility-iroha-special-instructions}

这一组 [其他](#iroha-special-instructions-isi) 含有逻辑
指示如 `If`, 相关的 I/O `Notify` 和这样的作曲
`Sequence`. 它们主要用于
[定制指令](#custom-iroha-special-instruction).

### 核心 Iroha 特别指示 {#core-iroha-special-instructions}

[特殊指令](#iroha-special-instructions-isi) 提供每一个
Iroha 部署,其中包括一些
[特定领域](#domain-specific-iroha-special-instructions) 和
[使用指令](#utility-iroha-special-instructions).

### 特定域名 Iroha 特别指示 {#domain-specific-iroha-special-instructions}

关于特定领域活动的指令:资产,账户
这些领域提供了必要的工具,
变化 [世界状况的看法](#world-state-view-wsv) 在一个安全的,
在安全的方式.

### 定制品 Iroha 特别指令 {#custom-iroha-special-instruction}

提供说明 [Iroha 模块](#iroha-modules), 由客户或第三方
只有使用
[主要指令](#core-iroha-special-instructions). 叉和
修改 Iroha 作为特殊指令,不建议使用源代码
没有达成协议 [同龄人](#peer) 在一个 Iroha 部署将被视为故障,
因此 [同龄人](#peer) 运行修改实例将被取消访问权限.

## Iroha 查询 {#iroha-query}

要求阅读"世界状况视角",而不会修改该视角.
查询 [在这里](/zh-hans/blockchain/queries.md).

## 查看变化 {#view-change}

在未能达成共识的情况下进行的过程.
通常,这意味着选出一个新任 [领导者](#leader).

## 世界国家观 (WSV) {#world-state-view-wsv}

在内存中表示当前的区块链状态. WSV 含有
在 `World`, 承诺的区块哈希,交易指数,共识拓,
查询中使用的衍生指数.
区块,可以从 [Kura](#kura-warehouse). 看看
[世界状况的看法](/zh-hans/blockchain/world.md#world-state-view-wsv).

## 领导者 {#leader}

在Iroha网络中,一个同行是随机选择的
作为下一个区块的特权.
实现
[拜占庭的故障度](#byzantine-fault-tolerance-bft) 通过
[视图变化](#view-change).
