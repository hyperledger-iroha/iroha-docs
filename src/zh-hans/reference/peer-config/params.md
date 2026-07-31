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

其他类型

## 根级别 {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

链 ID 为了防止反弹攻击.

复制攻击是试图将有效的交易提交给不同的
网络比它所预期的网络. `chain` 是其中的一部分
签署的交易实用负载,一个链签署的事务被拒绝
由使用其他链的同龄人 ID.

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

协同验证器必须使用 BLS- 通常的钥匙.

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

一个同行的私钥. `public_key`; 共识验证者同行
必须使用 BLS- 通常的钥匙.

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

必须使用共识验证器 BLS 对于每一个验证器,
提供匹配 [`trusted_peers_pop`](#param-trusted-peers-pop) 进入.

<param-table env="TRUSTED_PEERS">
<template #type>

其他类型的字符串. `PUBLIC_KEY@ADDRESS` 在 P2P 已知地址;
裸体 `PUBLIC_KEY` 也被接受,并允许发现同行地址
八.

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

BLS 验证者可信任的同龄人所有权证明条目.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

具有的物体数组 `public_key` 并且 `pop_hex` 字段

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

文件路径到签署的基因区块有效载荷 `kagami genesis sign`.
生成的个人资料通常将此写为 Norito `.nrt` 文件.

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

基因钥匙的公钥.

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

对共识 (sumeragi) 和区块同步的 p2p通信地址 (区块)_为了实现同步的目的.

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

他们会向同龄人传说言,以便他们可以把它传给其他同龄人.

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

在一个同步消息中可以发送的块数量.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

最新区块的同行请求之间的时间间隔.

更频繁的言会缩短同步时间,

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

传言的最大交易数量.

较小的尺寸会导致更长的时间同步,但如果您有大量的输入.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

在同龄人之间进行交易之前言的时间.

更频繁的言会缩短同步时间,

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

如果同行置,终止与同行联系的时间.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

收到的地址 Torii 服务器必须倾听客户的请求.

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

在原始请求体中接受的最大字节数量
[Torii 终点](/zh-hans/reference/torii-endpoints.md).

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

_总_ 记载动词性 (见 [`logger.filter`](#param-logger-filter) 对于精细的配置).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

字符串,可能的值:

- `TRACE`: 包括低级行动在内的所有事件.
- `DEBUG`: 对于诊断来说有用的调试级别消息.
- `INFO`: 一般信息信息.
- `WARN`: 警告表明可能出现问题.
- `ERROR`: 干扰正常功能但允许继续运行的错误.

选择适合您使用情况的水平.
[堆积溢出](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) 额外
详细说明如何使用不同日志水平.

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

这个参数可通过运行时间配置更新 Torii 运营商终端点.

:::

### `logger.filter` {#param-logger-filter}

除了精炼的日志过器 [`logger.level`](#param-logger-level). 允许定制记录动词性
每个_目标_.

<param-table type=string env=LOG_FILTER>
<template #type>

字符串,由一个或多个指令分开的逗号.每个指令都可能具有相应的最大词语性
_的水平_ 允许 (例如, _选择_) 及相应的事件. Iroha 考虑了较少的独占水平 (如
`trace` 或 `info`) 更多的词语比更独占的水平 (如 `error` 或 `warn`).

在高层次上,指令的语法由几个部分组成:

```
target[span{field=value}]=level
```

更多详情请参见
[`tracing-subscriber` 文件](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info 与 [`logger.level`](#param-logger-level)

`logger.filter` 工作 _一起_ 在 [`logger.level`](#param-logger-level) 没有一个能覆盖另一个.

例如,如果 `logger.level` 设置为 `INFO` 并且 `logger.filter` 设置为 `iroha_core=debug`, 产生的过器
设置将是 `info,iroha_core=debug` (也就是说 `info` 对于所有模块, `debug` 对于 `iroha_core`).

:::

::: tip 运行时间更新

这个参数可通过运行时间配置更新 Torii 运营商终端点.

:::

### `logger.format` {#param-logger-format}

记录格式.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

字符串,可能的值:

- `full`: 默认格式化器. 这将为每次事件发出可读的单行日志,
  在格式化演示事件之前显示的当前跨度背景.
- `compact`: 默认格式器的变体,优化为短线长度.
  在格式化事件的字段中附加,且不显示跨度名称;动词性水平缩写为
  一个角色.
- `pretty`: 它们是为了使人体可读性而优化的.
  用于本地开发和调试,或用于命令行应用程序,在自动分析和紧的情况下
  存储日志的优先级不如可读性和视觉吸引力.
- `json`: 输出新线限量 JSON 用于生产系统,结构化日志
  作为 JSON 通过分析和查看工具. JSON 产量不优化为人类可读性.

更多详细信息和样本输出,见
[`tracing-subscriber` 文件](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

_库拉_ 是存储机的持久发动机 Iroha (日本语为 _仓库_).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

最多将存储在内存中的最后N块.

如果需要,将旧块从内存中丢弃并从磁盘上载.

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

字符串,可能的值:

- `strict`: 所有块的严格验证
- `fast`: 快速启动,只有基本检查

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

指定区块存储的目录[^paths].

查看以下内容: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

标签,使其能够打印新的区块.

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

在排队等待的交易数量的上限.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

单个用户排队的交易数量的上限.

使用此选项来施加气.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

如果交易仍在排队中,此次交易将被取消.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

仅用于运动的调试开关 Sumeragi 放下这些.
在控制测试之外被禁用;在运行的生产网络上更改
可能会导致同龄人对共识行为产生分歧.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## 快照 {#snapshot}

这一模块负责阅读和写下
[世界状况的看法](/zh-hans/blockchain/world#world-state-view-wsv).

快照存储了世界状态视图的序列化检查点,
没有重新播放每一个区块 Kura. Kura 仍然是耐用的块
历史和重播的真相来源;快照是加速路径.
在启动时, Iroha 检查即时截图的元数据与配置链和
在决定是否将快照加载或重播之前存储的区块.

::: tip 清除快照

如果快照系统有问题,你想从空白页开始 (
快照),你可以删除指定的目录 [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

快照系统的模式.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

字符串,可能的值:

- `read_write`: Iroha 创建一个时间的快照
  [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). 在启动时, Iroha 读取现有快照 (如果有的话)
  并验证它与区块存储的最新情况.
- `readonly`: 类似于 `read_write` 但 Iroha 没有创建任何快照.
- `disabled`: Iroha 在启动时不会创建新的快照,也不会阅读现有的快照.

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

快照频率.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

在哪里存储快照.

查看以下内容: [`kura.store_dir`](#param-kura-store-dir)

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

## 远程测量 {#telemetry}

远程测量将同行诊断输出到外部远程测量的收集器.
两者 `telemetry.name` 并且 `telemetry.url` 当一个同龄人应该向一个
如果不使用远程测量,则省略该部分.

`name` 并且 `url` 必须配对.

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

其他 WebSocket URL 远程测量仪器.

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
