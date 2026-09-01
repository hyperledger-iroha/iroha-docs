---
translation_locale: zh-hant
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# 配置引數 {#configuration-parameters}

標籤:

## 根級 {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

鏈 ID 必須在每個交易中包含. 用於防止重複攻擊.

複製攻擊是試圖將有效的交易提交給與其目的網路不同的網路. `chain` 是簽署的交易實用負載的一部分,為一條鏈簽署的事務被使用另一條鏈的對等節點拒絕 ID.

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

共識驗證器的對等節點必須使用 BLS-Normal鍵.

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

同級金鑰:它必須匹配 `public_key`;共識驗證器同級必須使用 BLS-正常金鑰.

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

預先定義的可信對等節點列表.

共識驗證器必須使用 BLS-Normal 對等節點金鑰。還要為每個驗證器提供相符的 [`trusted_peers_pop`](#param-trusted-peers-pop) 項目。

<param-table env="TRUSTED_PEERS">
<template #type>

在 P2P 地址已知時使用`PUBLIC_KEY@ADDRESS`;裸體 `PUBLIC_KEY`也被接受,並允許從言中發現對等節點地址.

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

BLS 驗證者可信任的對等節點所有權證明條目.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

具有 `public_key`和 `pop_hex`欄位的物件陣列

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

## 創世紀 {#genesis}

### `genesis.file` {#param-genesis-file}

檔案路徑到由 `kagami genesis sign`生成的簽署創世區塊有效載荷.生成的個人資料通常將此寫成 Norito `.nrt`檔案.

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

創世關鍵對的公鑰.

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

為共識 (sumeragi) 和區塊同步 (區塊_sync) 的目的的p2p通訊地址.

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

同等地址 (外部,其他對等節點看到的).

他們會向相關的對等節點傳說八,以便他們可以向其他對等節點傳播.

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

單則同步訊息中可傳送的區塊數量。

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

最新區塊的對等節點請求之間的時間間隔.

頻繁的八縮短了同步時間,但可以載入網路.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

一個言批次訊息中最大交易數.

較小的尺寸會導致更長的時間同步,但如果您有很高的資料包損失,則有用.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

在對等節點之間進行交易等待言的時間.

頻繁的八縮短了同步時間,但可以載入網路.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

如果對等節點無事,則終止與對等節點的連線時間.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii 伺服器必須聽取的地址,客戶端應向該伺服器提出請求.

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

在 [Torii 端點](/zh-hant/reference/torii-endpoints.md)所接受的原始請求體中最大位元組數.

這一限制用於防止 DOS 攻擊.

<param-table>
<template #type>

位元組數量

</template>
<template #default-value>

`64_000_000` (64億位元組)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

如果沒有訪問,查詢可以留在商店的時間.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

現場查詢數量的上限.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

一個使用者的直播查詢數量的上限.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## 伐木工 {#logger}

### `logger.level` {#param-logger-level}

一般的記錄動詞性 (參見 [`logger.filter`](#param-logger-filter)進行精煉的配置).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

字串,可能值:

- `TRACE`:所有事件,包括低階操作.
- `DEBUG`:除錯級別的訊息,可用於診斷.
- `INFO`:一般資訊資訊.
- `WARN`:警告表明可能出現問題.
- `ERROR`:破壞正常功能但允許繼續執行的錯誤.

選擇適合您使用情況的級別.檢視[Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels),瞭解如何使用不同日誌水平的更多細節.

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

::: tip 執行階段更新

該引數透過 Torii 操作員端點進行執行階段配置更新.

:::

### `logger.filter` {#param-logger-filter}

除 [`logger.level`](#param-logger-level) 外，還可設定更精細的日誌過濾器，並按 target 自訂日誌詳細程度。

<param-table type=string env=LOG_FILTER>
<template #type>

字串由一個或多個以逗號分開的指令組成. 每條指令都可能具有相應的最大語音水平,允許 (例如選擇) 相匹配的跨度和事件.Iroha 認為較少的獨佔水平 (如`trace`或`info`) 是比更為獨佔的水平 (如 `error`或 `warn`) 更有口頭性.

在高層面上,指令的語法由幾個部分組成:

```
target[span{field=value}]=level
```

詳見 [`tracing-subscriber`文件](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info 與 [`logger.level`](#param-logger-level) 搭配使用

`logger.filter`與 [`logger.level`](#param-logger-level)一起工作,沒有一個覆蓋另一個.

例如,如果 `logger.level` 設定為 `INFO` 和 `logger.filter` 設定為 `iroha_core=debug`, 產生的過濾器組將是: `info,iroha_core=debug` (也就是說 `info` 對於所有模組, `debug` 對於 `iroha_core`).

:::

::: tip 執行階段更新

該引數透過 Torii 操作員端點進行執行階段配置更新.

:::

### `logger.format` {#param-logger-format}

記錄格式.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

字串,可能值:

- `full`：預設格式化器。它為每個事件輸出易讀的單行日誌，並在事件的格式化表示之前顯示目前的 span 上下文。
- `compact`:為短線長度最佳化的預設格式器的一種變體.當前跨度文字中的欄位新增到格式事件的欄位中,並沒有顯示跨度名稱;語法性水平縮寫成單個字元.
- `pretty`：輸出針對人類可讀性最佳化的美化多行日誌。主要適用於本機開發、除錯或命令列應用程式；在這些情境中，可讀性和視覺效果比自動分析及精簡儲存更重要。
- `json`:輸出新線界限的 JSON 日誌. 這用於生產系統中使用結構化日誌作為 JSON 透過分析和檢視工具消耗. JSON 輸出並未為人類可讀性最佳化的.

更多詳細資訊和樣本輸出,請見 [`tracing-subscriber`文件](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura 是 Iroha (用於倉庫的日本語) 的持久儲存引擎.

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

最多將儲存在記憶體中的最後N塊.

如果需要,舊區塊將從記憶體中丟棄並從磁碟上載.

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

Kura 啟動模式. `strict`是正常和預設的模式:它在節點啟用之前驗證了規範歷史,恢復構件,輔助索引和儲存會計.

`fast` 是在完整啟動稽核可能導致停機時，用於恢復操作可見性的緊急降級服務模式。它要求儲存空間先前已由 `strict` 初始化，且目前這一代快照恰好包含五項成品：`snapshot.data`、`snapshot.sha256`、`snapshot.sig`、`snapshot.fast.norito` 和 `snapshot.merkle.json`。採用網域分離的操作員簽章，將宣告的承載摘要與有界資訊清單繫結；資訊清單則繫結承載長度、鏈/網路身分、終端高度/雜湊、SCCP 政策雜湊，以及是否存在引導沿襲。Fast 模式拒絕引導沿襲，並要求持久 Kura 提供完全相同的標記/計數/尖端邊界。首發版本節點只接受這五項成品，任何其他成品數量或檔名集合都會遭到拒絕。

`fast` 會盤點這五個名稱，並透過中繼資料繫結承載檔案與 Merkle 檔案，但不會讀取、雜湊、剖析或解碼其內容。它根據已簽署的資訊清單建立最小 World/Nexus，將精確的 Kura 雜湊字首對映為唯讀，且不開啟快照 World、區塊雜湊陣列、交易歷史記錄、派生索引或持久復原日誌。Merkle 稽核、規範與語意快照稽核、歷史區塊/終局性/SCCP 協調、Sumeragi 活躍高度復原、合併和查詢日誌、泳道資訊清單/合規來源、Kura 支援的 SoraFS 封存、遞迴儲存計量，以及選用服務協調器均繼續延後。本機交易准入、提案、投票、規範寫入和輔助產生器仍保持停用。Kura 本身拒絕啟動寫入器和持久變更；管線和 FASTPQ 持久化佇列會立即拒絕工作，而不會保留或編碼。Kura 讀取 APIs 也會停用修復與永續性同步行為：暫存輔助記錄不會升級、缺少的泳道成品不會釋出、進度屏障也不會 fsync。Sumeragi 和交易 gossip 均不會啟動。Torii 只公開健康、存活、就緒、對等節點和設定操作；API 版本、狀態、指標以及所有一般狀態/歷史記錄路由都不可用。在以 `strict` 重新啟動前，節點始終不會就緒。

僅在事故期間使用 `fast`。服務穩定後，請停止節點、恢復 `strict` 並重新啟動，以便在恢復正式環境之前執行所有延後的檢查和索引重建。Fast 模式不要求存在延後的合併日誌，也不會建立、修復、截斷或匯入規範儲存；它不會讀取或變更未釋出的字尾和待處理的輔助復原階段，而是忽略它們並留待 Strict 模式復原。匯入的僅雜湊快照沿襲仍不可用。缺少或無效的目前快照會立即導致失敗；Fast 模式絕不會回退至空 World 或歷史重播重建。

<param-table default-value=strict>
<template #type>

字串,可能值:

- `strict`:完整驗證和正常生產
- `fast`：有界的緊急啟動；在以 `strict` 模式重新啟動之前，生產功能保持隔離

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

指定區塊儲存處的目錄[^paths].

也見: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

標籤,使其能夠列印新的塊.

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

在排列中等待的交易數量的上限.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

一個使用者在排列中等待的交易數量的上限

使用這個選項來施加氣.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

在此之後,如果交易仍在排隊中,交易將被取消.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

僅用於煉的除錯開關 Sumeragi 軟叉處理路徑.將其禁用在控制測試之外;在執行的生產網路上更改可能會導致對等節點對共識行為產生分歧.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus 原子核私人和解 {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` 管理獨立的 `AtomicPrivateSettlementV1` 路徑。它預設停用。設定 `enabled = true` 還需要 `activation_height`；除非鏈上功能、通知期、固定證明設定檔以及集區/稽核治理均處於作用中狀態，否則准入仍會採用失敗關閉策略。

主要限制是: `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, 和 `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` 必須是一個嚴格增長的子集 V1 裝課. `permitted_policy_versions` 僅接受 V1.

`max_capsule_bytes` 衡量完整 `PrivateSettlementAuditCapsuleV1` 的規範 Norito 位元組數，其中包括 AAD、nonce、密文、向量框架和每位稽核員的 wrapped-DEK 列；它不是僅針對密文的限制。每個啟用的填充類別都必須能容納至少 `default_min_auditor_approvals` 位稽核員的保守完整 capsule envelope。此核准設定也是強制下限：Torii 會拒絕 `min_approvals` 較低的新許可政策，也會拒絕任何超出規範位元組上限的實際 capsule。

這些設定沒有生產環境變數啟用繞行.檢視[執行跨資料空間的私密原子結算](/zh-hant/get-started/atomic-private-settlement),瞭解完整的配置示例和操作要求.直到文件化外部釋放門透過,路徑不會獲得生產資格.

## 快照 {#snapshot}

該模組負責閱讀和編寫[世界狀態檢視](/zh-hant/blockchain/world#world-state-view-wsv)的快照.

快照儲存了世界狀態檢視的序列化檢查點,這樣一個對等節點可以重新啟動而不需要重播從 Kura 的每個塊. Kura 仍然是持續的區塊歷史和重播的真相來源;快照是一種加速路徑.在啟動時, Iroha 檢查了設定鏈和儲存的區塊之間的快照後設資料,然後決定是否要載入快照或重新播放.

::: tip 刪除快照

如果快照系統有問題,並且您想從空白頁面開始 (即快照),則可以刪除 [`snapshot.store_dir`](#param-snapshot-store-dir)所指定的目錄.

:::

### `snapshot.mode` {#param-snapshot-mode}

快照系統的模式.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

字串,可能值:

- `read_write`:Iroha 建立了由 [`snapshot.create_every_ms`](#param-snapshot-create-every-ms)指定的時段的快照.在啟動時, Iroha 閱讀一個現有快照 (如果有的話) 並驗證它是否與區塊儲存保持更新.
- `readonly`:類似於 `read_write`但 Iroha 沒有建立任何快照.
- `disabled`: Iroha 既不會建立新的快照,也不會在啟動時讀取現有的快照.

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

快照的頻率.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

在哪裡儲存快照.

另見: [`kura.store_dir`](#param-kura-store-dir)

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

## 電測儀 {#telemetry}

遠端測量將對等節點診斷輸出到外部遠端測量的收集器.當對等節點報告給收藏器時,設定`telemetry.name` 和 `telemetry.url`;如果不使用遠端測試時,省略該節目.

`name`和 `url`必須配對.

所有 `telemetry` 節目都是可選的.

### `telemetry.name` {#param-telemetry-name}

在遠端測量中顯示節點的名稱.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

遠端測量器的 WebSocket URL.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

在重新連線之前的最低等待時間.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

增加連線之間的延遲使用的最大指數為2.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

編寫 dev-telemetry的檔案路徑

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
