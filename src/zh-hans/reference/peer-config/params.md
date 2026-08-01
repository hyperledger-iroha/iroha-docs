---
translation_locale: zh-hans
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# 配置参数 {#configuration-parameters}

标签:

## 根级别 {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

链 ID 必须在每个交易中包含. 用于防止重复攻击.

复制攻击是试图将有效的交易提交给与其预期的不同网络.由于 `chain` 是签署的交易实用负载的一部分,使用另一个链 ID 的同行拒绝了一项为一连锁签署的事务.

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

共识验证器必须使用 BLS-Normal peer keys.对于每个验证器,还提供匹配的 [`trusted_peers_pop`](#param-trusted-peers-pop)输入.

<param-table env="TRUSTED_PEERS">
<template #type>

在 P2P 地址已知时使用`PUBLIC_KEY@ADDRESS`;裸体 `PUBLIC_KEY`也被接受,并且允许从言中发现同行地址.

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

## 创世记 {#genesis}

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

如果同行无事,则终止与同行的联系的时间.

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

字符串由一个或多个以逗号分开的指令组成. 每条指令都可能具有相应的最大语文性水平,允许 (例如选择) 相匹配的跨度和事件;Iroha 认为较少的独占水平 (如`trace`或`info`) 是比更为独占的水平 (如 `error`或 `warn`) 更有口头性.

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

::: info 与 [`logger.level`](#param-logger-level)的兼容性

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
- `compact`:为短线长度优化的默认格式器的一种变体.当前跨度文本中的字段添加到格式事件的字段中,并且没有显示跨度名称;语法性水平缩写成单个字符.
- `pretty`: 发射过度漂亮的多行日志,优化为人类可读性.调试,或用于命令行应用程序,自动分析和日志的紧存储比可读性和视觉吸引力少于优先考虑.
- `json`:输出新线界限的 JSON 日志. 这用于生产系统中使用结构化日志作为 JSON 通过分析和查看工具消耗. JSON 输出并非为人类可读性优化的.

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

Kura 启动方式

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

字符串,可能值:

- `strict`:所有块的严格验证
- `fast`:快速启动,仅进行基本检查

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
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

## 快照 {#snapshot}

该模块负责阅读和编写[世界状态视图](/zh-hans/blockchain/world#world-state-view-wsv)的快照.

快照存储世界状态视图的序列化检查点,以便一个同行可以重新启动而不需要重播从 Kura 的每个区块. Kura 仍然是持续的区块历史和重播的真相来源;快照是一个加速路径.在启动时, Iroha 检查了设置链和存储的区块之间的快照元数据,然后决定是否要加载快照或重新播放.

::: tip 删除快照

如果快照系统有什么问题,并且您想从空白页面开始 (即快照),则可以删除 [`snapshot.store_dir`](#param-snapshot-store-dir)所指定的目录.

:::

### `snapshot.mode` {#param-snapshot-mode}

快照系统的模式.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

字符串,可能值:

- `read_write`:Iroha 创建了由 [`snapshot.create_every_ms`](#param-snapshot-create-every-ms)指定的时段的快照.在启动时, Iroha 阅读一个现有快照 (如果有的话) 并验证它是否与区块存储更新.
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

远程测量将同行诊断输出到外部远程测量的收集器.当同行报告给收藏器时,设置 `telemetry.name` 和 `telemetry.url`;如果不使用远程测试,则省略该节目.

`name`和 `url`必须配对.

所有的 `telemetry` 部分是可选的.

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
