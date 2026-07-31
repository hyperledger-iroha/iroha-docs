---
translation_locale: zh-hant
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# 設定參數 {#configuration-parameters}

沒有任何相關資訊

## 根基水平 {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

鎖線 ID 這項交易必須包含在每個交易中.

反彈攻擊是試圖將有效的交易提交給另一方
該組織的目標是: `chain` 是其中的一部分
簽署的交易有效負荷,一個連鎖簽署的取引被拒絕
使用其他鎖的同行 ID.

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

協調驗證器必須使用 BLS- 這是正常的關鍵.

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

該關鍵必須與同學相匹配. `public_key`; 協調驗證者同行
必須使用 BLS- 這是正常的關鍵.

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

預定可信的同行列表.

必須使用共識驗證器 BLS- 常見的同行關鍵.
提供匹配 [`trusted_peers_pop`](#param-trusted-peers-pop) 進入的時間.

<param-table env="TRUSTED_PEERS">
<template #type>

使用其他語言的文字列. `PUBLIC_KEY@ADDRESS` 當該組織 P2P 已知地址;
裸體 `PUBLIC_KEY` 也會被接受, 讓同行地址被發現
這種言.

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

BLS 認證者可信任的同行所取得的憑據.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

列中的物體 `public_key` 及其他 `pop_hex` 字段

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

## 創世記 {#genesis}

### `genesis.file` {#param-genesis-file}

文件通路到由 `kagami genesis sign`.
生成的配置文件通常寫成: Norito `.nrt` 這樣的文件.

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

基因關鍵的公钥.

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

## 網路 {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

關於共識 (sumeragi) 和區塊同步的 p2p通信地址 (區塊)_沒有任何相關資訊.

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

其他同行看到的外面地址.

他們會向其他同學說八.

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

在一個同步訊息中可發送的積木數量.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

要求同行使用最近的區塊之間的時間間隔.

經常的八會減少同步時間,

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

傳送的訊息中最大交易數量.

較小的尺寸會導致更長時間進行同步,

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

在同學之間進行交易之前,

經常的八會減少同步時間,

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

如果同行不工作, 結束與同行的時間.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

該地址是 Torii 服務器必須聽取客戶的要求.

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

在原始要求體中接受的最大字節數量
[Torii 目的地](/zh-hant/reference/torii-endpoints.md).

這項限制是為了防止 DOS 攻擊.

<param-table>
<template #type>

數量 (字節)

</template>
<template #default-value>

`64_000_000` (共 6400萬字节)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

如果沒有訪問, 查詢可以留在商店的時間.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

實際查詢數量的上限.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

單位使用者實際查詢數量的上限.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## 林業人員 {#logger}

### `logger.level` {#param-logger-level}

_總統_ 記錄詞語性 (查看) [`logger.filter`](#param-logger-filter) 適用於精致的配置).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

字符串,可能值:

- `TRACE`: 包括低層次的行動.
- `DEBUG`: 這樣的訊息可用于診斷.
- `INFO`: 提供一般信息.
- `WARN`: 警告可能造成問題.
- `ERROR`: 阻礙正常運作,但可持續運行的錯誤.

選擇最適合您使用情況的水平.
[堆積的溢出](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) 提供其他
如何使用不同日志水平的細節.

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

::: tip 運行時間更新

這個參數可能會被更新到 Torii 操作員的終點.

:::

### `logger.filter` {#param-logger-filter}

沒有任何其他方法, [`logger.level`](#param-logger-level). 允許定制記錄動詞性
沒有任何問題_目標_.

<param-table type=string env=LOG_FILTER>
<template #type>

字符串,由一條或多個以逗號分隔的指令組成.
_的水平_ 能使 (例如, _選擇_) 及相應的事件. Iroha 考慮較少的獨占水平 (如
`trace` 或是 `info`這種情況是非常嚴重的. `error` 或是 `warn`).

在很高的水平上,指令的構文包含了幾個部分:

```
target[span{field=value}]=level
```

更多詳情請見
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

::: info 適合於 [`logger.level`](#param-logger-level)

`logger.filter` 工作 _在一起_ 在 [`logger.level`](#param-logger-level) 沒有人將別人的書寫過來.

沒有任何可能的情況. `logger.level` 設定為 `INFO` 及其他 `logger.filter` 設定為 `iroha_core=debug`, 由此產生的光器
集合將會是 `info,iroha_core=debug` (也就是說, `info` 對於所有模組, `debug` 關於 `iroha_core`).

:::

::: tip 運行時間更新

這個參數可能會被更新到 Torii 操作員的終點.

:::

### `logger.format` {#param-logger-format}

這裡有數字.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

字符串,可能值:

- `full`: 這樣就會為每個事件發出可讀的單行日志,
  在格式化演示事件之前顯示的現行跨度背景.
- `compact`: 預設格式化器的變體,最適合短線長度.
  沒有顯示跨度名稱;動詞性水平是縮短為
  只有一個角色.
- `pretty`: 這項計畫主要是為了讓人更好地閱讀.
  在本地開發和故障處理中使用,或用于命令行應用程序,自動分析和簡約的情況下
  存储日志的重點不如可讀性和視覺吸引力.
- `json`: 输出新行限量 JSON 專用於製造系統使用,
  消耗為 JSON 透過分析和查看工具. JSON 沒有為人閱讀而優化的輸出.

查看更多詳情和樣本輸出,
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

_卡拉_ 是存储器的持久发动机 Iroha (日本語為 _倉庫_).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

最多會存儲N最後的積木.

如果需要, 舊的積木會從記憶體中掉下來,

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

Kura 啟動方式

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

字符串,可能值:

- `strict`: 所有區塊的嚴格驗證
- `fast`: 只有基本檢查的快速啟動

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

指定區塊存儲的目錄[^paths].

查看以下內容: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

打印新的積木,

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

## 排隊 {#queue}

### `queue.capacity` {#param-queue-capacity}

在排隊中等待的交易數量的上限.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

單位使用者在排列中等待的交易數量的上限.

請使用這個選項,

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

如果交易仍在排隊中,

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

僅適用於運動的開關 Sumeragi 這裡有軟叉路口.
在受控測試之外被禁用;在運行的生產網絡上更改
可能會讓同學對共識行為有分歧.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## 快速拍攝 {#snapshot}

該模組負責閱讀和寫作
[世界狀況的觀點](/zh-hant/blockchain/world#world-state-view-wsv).

快速拍攝會儲存世界狀態視角的連串化檢查點,
沒有重新播放每個區塊 Kura. Kura 仍然是耐用區塊
歷史與反彈的真相來源;
在開始時, Iroha 檢查即時截圖的數據與設定連鎖,
在決定是否將快照加載或重播之前存儲的區塊.

::: tip 清除快照

如果您想要從空白頁開始 (以此為例,
快照),您可以移除指定的目錄 [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

快照系統的模式.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

字符串,可能值:

- `read_write`: Iroha 打造一個時間內的快照,
  [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). 在開始時, Iroha 閱讀已有的快照 (如有)
  確認它是否與積木存儲保持更新.
- `readonly`: 類似於 `read_write` 但他們 Iroha 沒有任何快照.
- `disabled`: Iroha 沒有創建新的快照,也沒有在啟動時閱讀現有的快照.

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

快速拍攝的頻率.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

這裡有許多照片,

查看以下內容: [`kura.store_dir`](#param-kura-store-dir)

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

## 遠隔測量 {#telemetry}

遠隔測量將同行診斷出口到外部遠隔測量的收集器.
這兩者 `telemetry.name` 及其他 `telemetry.url` 如果同行要向
如果沒有使用電視測量,

`name` 及其他 `url` 必須配對.

所有的 `telemetry` 這部分是可選的.

### `telemetry.name` {#param-telemetry-name}

在電視測量上顯示該節點的名稱.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

其他國家 WebSocket URL 遠隔測量收集器.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

在重新連接之前至少需要等待的時間.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

2 的最大指數,用于重新連接之間的延遲增加.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

如何寫 Dev-telemetry 的文件路径

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
