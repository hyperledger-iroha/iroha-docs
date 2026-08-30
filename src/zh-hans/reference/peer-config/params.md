---
translation_locale: zh-hans
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# 配置参数 {#configuration-parameters}

标签:

## 根级 {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

链 ID 必须在每个交易中包含. 用于防止重复攻击.

复制攻击是试图将有效的交易提交给与其目的网络不同的网络. `chain` 是签署的交易实用负载的一部分,为一条链签署的事务被使用另一条链的同行拒绝 ID.

<param-table type=string env=CHAIN />

::: code-group

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

共识验证器的同行必须使用 BLS-Normal键.

<param-table type="public-key" env="PUBLIC_KEY" />

::: code-group

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

同级密钥:它必须匹配 `public_key`;共识验证器同级必须使用 BLS-正常密钥.

<param-table type="private-key" env="PRIVATE_KEY" />

::: code-group

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

预先定义的可信同行列表.

共识验证器必须使用 BLS-Normal peer keys.对于每个验证器,也提供相匹配的 [`trusted_peers_pop`](#param-trusted-peers-pop)入口.

<param-table env="TRUSTED_PEERS">
<template #type>

在 P2P 地址已知时使用`PUBLIC_KEY@ADDRESS`;裸体 `PUBLIC_KEY`也被接受,并允许从言中发现同龄人地址.

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers = [
    "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
    "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338",
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS='[
  "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
  "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338"
]'
```

:::

### `trusted_peers_pop` {#param-trusted-peers-pop}

BLS 验证者可信任的同行所有权证明条目.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

具有 `public_key`和 `pop_hex`字段的对象阵列

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers_pop = [
  { public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2", pop_hex = "8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08" },
  { public_key = "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77", pop_hex = "a14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913" },
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS_POP='[
  {"public_key":"ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2","pop_hex":"0x8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08"},
  {"public_key":"ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77","pop_hex":"0xa14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913"}
]'
```

:::

## 创世纪 {#genesis}

### `genesis.file` {#param-genesis-file}

文件路径到由 `kagami genesis sign`生成的签署基因区块有效载荷.生成的个人资料通常将此写成 Norito `.nrt`文件.

<param-table type="file-path" env="GENESIS" />

::: code-group

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

基因关键对的公钥.

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: code-group

```toml [Config File]
[genesis]
public_key = "ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

```shell [Environment]
GENESIS_PUBLIC_KEY="ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

:::

## 网络 {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

为共识 (sumeragi) 和区块同步 (区块_sync) 的目的的p2p通信地址.

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: code-group

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

同等地址 (外部,其他同龄人看到的).

他们会向相关的同龄人传说八,以便他们可以向其他同龄人传播.

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: code-group

```toml [Config File]
[network]
public_address = "0.0.0.0:5000"
```

```shell [Environment]
P2P_PUBLIC_ADDRESS=0.0.0.0:5000
```

:::

### `network.block_gossip_size` {#param-network-block-gossip-size}

单个同步消息中可以发送的块量.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

最新区块的同行请求之间的时间间隔.

频繁的八缩短了同步时间,但可以加载网络.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

一个言批次消息中最大交易数.

较小的尺寸会导致更长的时间同步,但如果您有很高的数据包损失,则有用.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

在同龄人之间进行交易等待言的时间.

频繁的八缩短了同步时间,但可以加载网络.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

如果同行无事,则终止与同行的连接时间.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii 服务器必须听取的地址,客户端应向该服务器提出请求.

<param-table type=socket-addr env=API_ADDRESS />

::: code-group

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

在 [Torii 终端点](/zh-hans/reference/torii-endpoints.md)所接受的原始请求体中最大字节数.

这一限制用于防止 DOS 攻击.

<param-table>
<template #type>

字节数量

</template>
<template #default-value>

`64_000_000` (64亿字节)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

如果没有访问,查询可以留在商店的时间.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

现场查询数量的上限.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

一个用户的直播查询数量的上限.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## 伐木工 {#logger}

### `logger.level` {#param-logger-level}

一般的记录动词性 (参见 [`logger.filter`](#param-logger-filter)进行精炼的配置).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

字符串,可能值:

- `TRACE`:所有事件,包括低级操作.
- `DEBUG`:调试级别的消息,可用于诊断.
- `INFO`:一般信息信息.
- `WARN`:警告表明可能出现问题.
- `ERROR`:破坏正常功能但允许继续运行的错误.

选择适合您使用情况的级别.查看[Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels),了解如何使用不同日志水平的更多细节.

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip 运行时间更新

该参数通过 Torii 操作员终端点进行运行时间配置更新.

:::

### `logger.filter` {#param-logger-filter}

除了 [`logger.level`](#param-logger-level)之外,还可以进行精细的日志过器.

<param-table type=string env=LOG_FILTER>
<template #type>

字符串由一个或多个以逗号分开的指令组成. 每条指令都可能具有相应的最大语音水平,允许 (例如选择) 相匹配的跨度和事件.Iroha 认为较少的独占水平 (如`trace`或`info`) 是比更为独占的水平 (如 `error`或 `warn`) 更有口头性.

在高层面上,指令的语法由几个部分组成:

```
target[span{field=value}]=level
```

详见 [`tracing-subscriber`文档](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: code-group

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info 与 [`logger.level`](#param-logger-level) 搭配使用

`logger.filter`与 [`logger.level`](#param-logger-level)一起工作,没有一个覆盖另一个.

例如,如果 `logger.level` 设置为 `INFO` 和 `logger.filter` 设置为 `iroha_core=debug`, 产生的过器组将是: `info,iroha_core=debug` (也就是说 `info` 对于所有模块, `debug` 对于 `iroha_core`).

:::

::: tip 运行时间更新

该参数通过 Torii 操作员终端点进行运行时间配置更新.

:::

### `logger.format` {#param-logger-format}

记录格式.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

字符串,可能值:

- `full`:默认格式化器. 它为每次事件发出可读的单行日志,在格式化的演示之前显示当前跨度文本.
- `compact`:为短线长度优化的默认格式器的一种变体.当前跨度文本中的字段添加到格式事件的字段中,并没有显示跨度名称;语法性水平缩写成单个字符.
- `pretty`: 发射过度漂亮的多行日志,优化为人类可读性.调试,或用于命令行应用程序,自动分析和日志的紧存储比可读性和视觉吸引力少于优先考虑.
- `json`:输出新线界限的 JSON 日志. 这用于生产系统中使用结构化日志作为 JSON 通过分析和查看工具消耗. JSON 输出并未为人类可读性优化的.

更多详细信息和样本输出,请见 [`tracing-subscriber`文档](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura 是 Iroha (用于仓库的日本语) 的持久存储引擎.

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

最多将存储在内存中的最后N块.

如果需要,旧区块将从内存中丢弃并从磁盘上载.

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: code-group

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Kura 启动模式. `strict`是正常和默认的模式:它在节点激活之前验证了正规历史,恢复文物,辅助索引和存储会计.

`fast`是恢复运营可见性的紧急降级服务模式,当一个完整的启动审计可能会出现停机时.它需要先前由 `strict`初始化的存储和包含五件精品的当前快照生成:`snapshot.data`,`snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`,和 `snapshot.merkle.json`.一个域分开的运营商签名绑定广告的有效载荷消化和有限的表格;表格绑定了有效载荷长度,链/网络身份,终端高度/hash,SCCP 政策hash,以及启动线条存在.快速拒绝了启动线条,并需要从耐用 Kura 的相同的标记/计数/尖端界限.首次发布节点完全接受这些五件文物,并且拒绝了其他所有文物的数量或文件名集.

快速库存这些五个名字和元数据 - 绑定有效载荷和Merkle文件,但不会读取,哈希,解析或解码其内容.它从签署的表格构建一个最小的世界/Nexus,映射了精确的 Kura 哈希前仅阅读,并离开快照世界,区块-哈希阵列,交易历史,衍生指数和持久恢复日志未开放. Merkle,正义和语义快照审计,历史区块/最终性/SCCP 调整, Sumeragi 活跃高度恢复,合并和查询日志,行径表/合规来源,Kura 支持的 SoraFS 档案,递归存储会计和可选服务调整器仍然被推迟.本地交易录取,提议,投票,正文书籍和辅助生产商仍被禁用.Kura 本身拒绝了作者启动和持久突变;管道和 FASTPQ 持续性队列立即拒绝工作,而不是保留或编码它.Kura 阅读 APIs 也禁用维修和耐久性-同步行为:暂时侧车不推广,缺失的车道文物不公布,进步障碍也没有同步. Sumeragi 和交易八不发行.Torii 仅暴露了健康,活力,准备,同行和配置操作; API-版本,状态,指标以及所有普通状态/历史路线仍然不可使用. 准备直到严格重新启动才不提供.

使用 `fast` 一旦服务稳定,停止节点,恢复 `strict`, 在恢复生产之前,每次推迟的检查和指数重建都会运行.快速模式不需要推迟合并日志,也不创建,修复,切断或进口正规存储器;无公布的后尾和未发布的辅助恢复阶段被忽视,没有读取或突变;进口的仅使用哈希的快照流程仍然不可用.一个失踪或无效的当前快照立即失败; 快速永远不会回到一个空世界或历史重演重建.

<param-table default-value=strict>
<template #type>

字符串,可能值:

- `strict`:完整验证和正常生产
- `fast`:有限的紧急启动,生产被隔离到严格重启.

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

指定区块存储处的目录[^paths].

也见: [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: code-group

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

标签,使其能够打印新的块.

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: code-group

```toml [Config File]
[kura.debug]
output_new_blocks = true
```

```shell [Environment]
KURA_DEBUG_OUTPUT_NEW_BLOCKS=true
```

:::

## 排队 {#queue}

### `queue.capacity` {#param-queue-capacity}

在排列中等待的交易数量的上限.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

一个用户在排列中等待的交易数量的上限

使用这个选项来施加气.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

在此之后,如果交易仍在排队中,交易将被取消.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

仅用于炼的调试开关 Sumeragi 软叉处理路径.将其禁用在控制测试之外;在运行的生产网络上更改可能会导致同龄人对共识行为产生分歧.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus 原子核私人和解 {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]`控制了单独的 `AtomicPrivateSettlementV1`路径.它默认禁用.设置`enabled = true`也需要一个 `activation_height`;除非连锁功能,通知期限,固定的证据配置文件和池/审计治理是活跃的,否则录取仍然无法关闭.

主要限制是: `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, 和 `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` 必须是一个严格增长的子集 V1 装课. `permitted_policy_versions` 仅接受 V1.

`max_capsule_bytes`测量了完整的 `PrivateSettlementAuditCapsuleV1`中正规 Norito 字节,包括 AAD,nonce,加密文本,向量框架以及每一个包装为 DEK 行的审计员;这不是仅限于加密文体.每个启用的填充类别都必须适用于至少 `default_min_auditor_approvals`审计员的保守整体囊.该批准设置也是一个规定的层次:Torii 拒绝具有较低 `min_approvals`值的新被允许政策,并拒绝任何超越法定字节限量的实际囊.

这些设置没有生产环境变量激活绕行.查看[Run Atomic Private Cross-Dataspace Settlement](/zh-hans/get-started/atomic-private-settlement),了解完整的配置示例和操作要求.直到文档化外部释放门通过,路径不会获得生产资格.

## 快照 {#snapshot}

该模块负责阅读和编写[世界状态视图](/zh-hans/blockchain/world#world-state-view-wsv)的快照.

快照存储了世界状态视图的序列化检查点,这样一个同行可以重新启动而不需要重播从 Kura 的每个块. Kura 仍然是持续的区块历史和重播的真相来源;快照是一种加速路径.在启动时, Iroha 检查了设置链和存储的区块之间的快照元数据,然后决定是否要加载快照或重新播放.

::: tip 删除快照

如果快照系统有问题,并且您想从空白页面开始 (即快照),则可以删除 [`snapshot.store_dir`](#param-snapshot-store-dir)所指定的目录.

:::

### `snapshot.mode` {#param-snapshot-mode}

快照系统的模式.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

字符串,可能值:

- `read_write`:Iroha 创建了由 [`snapshot.create_every_ms`](#param-snapshot-create-every-ms)指定的时段的快照.在启动时, Iroha 阅读一个现有快照 (如果有的话) 并验证它是否与区块存储保持更新.
- `readonly`:类似于 `read_write`但 Iroha 没有创建任何快照.
- `disabled`: Iroha 既不会创建新的快照,也不会在启动时读取现有的快照.

</template>
</param-table>

::: code-group

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

快照的频率.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

在哪里存储快照.

另见: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: code-group

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## 电测仪 {#telemetry}

远程测量将同行诊断输出到外部远程测量的收集器.当同行报告给收藏器时,设置`telemetry.name` 和 `telemetry.url`;如果不使用远程测试时,省略该节目.

`name`和 `url`必须配对.

所有 `telemetry` 节目都是可选的.

### `telemetry.name` {#param-telemetry-name}

在远程测量中显示节点的名称.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

远程测量器的 WebSocket URL.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

在重新连接之前的最低等待时间.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

增加连接之间的延迟使用的最大指数为2.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

编写 dev-telemetry的文件路径

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
