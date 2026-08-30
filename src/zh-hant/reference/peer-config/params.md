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

# 配置參數 {#configuration-parameters}

標籤:

## 根級 {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

鏈 ID 必須在每個交易中包含. 用於防止重複攻擊.

複製攻擊是試圖將有效的交易提交給與其目的網絡不同的網絡. `chain` 是簽署的交易實用負載的一部分,爲一條鏈簽署的事務被使用另一條鏈的同行拒絕 ID.

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

共識驗證器的同行必須使用 BLS-Normal鍵.

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

同級密鑰:它必須匹配 `public_key`;共識驗證器同級必須使用 BLS-正常密鑰.

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

預先定義的可信同行列表.

共識驗證器必須使用 BLS-Normal peer keys.對於每個驗證器,也提供相匹配的 [`trusted_peers_pop`](#param-trusted-peers-pop)入口.

<param-table env="TRUSTED_PEERS">
<template #type>

在 P2P 地址已知時使用`PUBLIC_KEY@ADDRESS`;裸體 `PUBLIC_KEY`也被接受,並允許從言中發現同齡人地址.

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

BLS 驗證者可信任的同行所有權證明條目.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

具有 `public_key`和 `pop_hex`字段的對象陣列

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

文件路徑到由 `kagami genesis sign`生成的簽署基因區塊有效載荷.生成的個人資料通常將此寫成 Norito `.nrt`文件.

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

基因關鍵對的公鑰.

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

## 網絡 {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

爲共識 (sumeragi) 和區塊同步 (區塊_sync) 的目的的p2p通信地址.

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

同等地址 (外部,其他同齡人看到的).

他們會向相關的同齡人傳說八,以便他們可以向其他同齡人傳播.

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

單個同步消息中可以發送的塊量.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

最新區塊的同行請求之間的時間間隔.

頻繁的八縮短了同步時間,但可以加載網絡.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

一個言批次消息中最大交易數.

較小的尺寸會導致更長的時間同步,但如果您有很高的數據包損失,則有用.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

在同齡人之間進行交易等待言的時間.

頻繁的八縮短了同步時間,但可以加載網絡.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

如果同行無事,則終止與同行的連接時間.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii 服務器必須聽取的地址,客戶端應向該服務器提出請求.

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

在 [Torii 終端點](/zh-hant/reference/torii-endpoints.md)所接受的原始請求體中最大字節數.

這一限制用於防止 DOS 攻擊.

<param-table>
<template #type>

字節數量

</template>
<template #default-value>

`64_000_000` (64億字節)

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

一個用戶的直播查詢數量的上限.

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

字符串,可能值:

- `TRACE`:所有事件,包括低級操作.
- `DEBUG`:調試級別的消息,可用於診斷.
- `INFO`:一般信息信息.
- `WARN`:警告表明可能出現問題.
- `ERROR`:破壞正常功能但允許繼續運行的錯誤.

選擇適合您使用情況的級別.查看[Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels),瞭解如何使用不同日誌水平的更多細節.

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

該參數通過 Torii 操作員終端點進行運行時間配置更新.

:::

### `logger.filter` {#param-logger-filter}

除了 [`logger.level`](#param-logger-level)之外,還可以進行精細的日誌過器.

<param-table type=string env=LOG_FILTER>
<template #type>

字符串由一個或多個以逗號分開的指令組成. 每條指令都可能具有相應的最大語音水平,允許 (例如選擇) 相匹配的跨度和事件.Iroha 認爲較少的獨佔水平 (如`trace`或`info`) 是比更爲獨佔的水平 (如 `error`或 `warn`) 更有口頭性.

在高層面上,指令的語法由幾個部分組成:

```
target[span{field=value}]=level
```

詳見 [`tracing-subscriber`文檔](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

例如,如果 `logger.level` 設置爲 `INFO` 和 `logger.filter` 設置爲 `iroha_core=debug`, 產生的過器組將是: `info,iroha_core=debug` (也就是說 `info` 對於所有模塊, `debug` 對於 `iroha_core`).

:::

::: tip 運行時間更新

該參數通過 Torii 操作員終端點進行運行時間配置更新.

:::

### `logger.format` {#param-logger-format}

記錄格式.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

字符串,可能值:

- `full`:默認格式化器. 它爲每次事件發出可讀的單行日誌,在格式化的演示之前顯示當前跨度文本.
- `compact`:爲短線長度優化的默認格式器的一種變體.當前跨度文本中的字段添加到格式事件的字段中,並沒有顯示跨度名稱;語法性水平縮寫成單個字符.
- `pretty`: 發射過度漂亮的多行日誌,優化爲人類可讀性.調試,或用於命令行應用程序,自動分析和日誌的緊存儲比可讀性和視覺吸引力少於優先考慮.
- `json`:輸出新線界限的 JSON 日誌. 這用於生產系統中使用結構化日誌作爲 JSON 通過分析和查看工具消耗. JSON 輸出並未爲人類可讀性優化的.

更多詳細信息和樣本輸出,請見 [`tracing-subscriber`文檔](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura 是 Iroha (用於倉庫的日本語) 的持久存儲引擎.

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

最多將存儲在內存中的最後N塊.

如果需要,舊區塊將從內存中丟棄並從磁盤上載.

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

Kura 啓動模式. `strict`是正常和默認的模式:它在節點激活之前驗證了正規歷史,恢復文物,輔助索引和存儲會計.

`fast`是恢復運營可見性的緊急降級服務模式,當一個完整的啓動審計可能會出現停機時.它需要先前由 `strict`初始化的存儲和包含五件精品的當前快照生成:`snapshot.data`,`snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`,和 `snapshot.merkle.json`.一個域分開的運營商簽名綁定廣告的有效載荷消化和有限的表格;表格綁定了有效載荷長度,鏈/網絡身份,終端高度/hash,SCCP 政策hash,以及啓動線條存在.快速拒絕了啓動線條,並需要從耐用 Kura 的相同的標記/計數/尖端界限.首次發佈節點完全接受這些五件文物,並且拒絕了其他所有文物的數量或文件名集.

快速庫存這些五個名字和元數據 - 綁定有效載荷和Merkle文件,但不會讀取,哈希,解析或解碼其內容.它從簽署的表格構建一個最小的世界/Nexus,映射了精確的 Kura 哈希前僅閱讀,並離開快照世界,區塊-哈希陣列,交易歷史,衍生指數和持久恢復日誌未開放. Merkle,正義和語義快照審計,歷史區塊/最終性/SCCP 調整, Sumeragi 活躍高度恢復,合併和查詢日誌,行徑表/合規來源,Kura 支持的 SoraFS 檔案,遞歸存儲會計和可選服務調整器仍然被推遲.本地交易錄取,提議,投票,正文書籍和輔助生產商仍被禁用.Kura 本身拒絕了作者啓動和持久突變;管道和 FASTPQ 持續性隊列立即拒絕工作,而不是保留或編碼它.Kura 閱讀 APIs 也禁用維修和耐久性-同步行爲:暫時側車不推廣,缺失的車道文物不公佈,進步障礙也沒有同步. Sumeragi 和交易八不發行.Torii 僅暴露了健康,活力,準備,同行和配置操作; API-版本,狀態,指標以及所有普通狀態/歷史路線仍然不可使用. 準備直到嚴格重新啓動纔不提供.

使用 `fast` 一旦服務穩定,停止節點,恢復 `strict`, 在恢復生產之前,每次推遲的檢查和指數重建都會運行.快速模式不需要推遲合併日誌,也不創建,修復,切斷或進口正規存儲器;無公佈的後尾和未發佈的輔助恢復階段被忽視,沒有讀取或突變;進口的僅使用哈希的快照流程仍然不可用.一個失蹤或無效的當前快照立即失敗; 快速永遠不會回到一個空世界或歷史重演重建.

<param-table default-value=strict>
<template #type>

字符串,可能值:

- `strict`:完整驗證和正常生產
- `fast`:有限的緊急啓動,生產被隔離到嚴格重啓.

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

指定區塊存儲處的目錄[^paths].

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

標籤,使其能夠打印新的塊.

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

一個用戶在排列中等待的交易數量的上限

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

僅用於煉的調試開關 Sumeragi 軟叉處理路徑.將其禁用在控制測試之外;在運行的生產網絡上更改可能會導致同齡人對共識行爲產生分歧.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus 原子核私人和解 {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]`控制了單獨的 `AtomicPrivateSettlementV1`路徑.它默認禁用.設置`enabled = true`也需要一個 `activation_height`;除非連鎖功能,通知期限,固定的證據配置文件和池/審計治理是活躍的,否則錄取仍然無法關閉.

主要限制是: `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, 和 `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` 必須是一個嚴格增長的子集 V1 裝課. `permitted_policy_versions` 僅接受 V1.

`max_capsule_bytes`測量了完整的 `PrivateSettlementAuditCapsuleV1`中正規 Norito 字節,包括 AAD,nonce,加密文本,向量框架以及每一個包裝爲 DEK 行的審計員;這不是僅限於加密文體.每個啓用的填充類別都必須適用於至少 `default_min_auditor_approvals`審計員的保守整體囊.該批准設置也是一個規定的層次:Torii 拒絕具有較低 `min_approvals`值的新被允許政策,並拒絕任何超越法定字節限量的實際囊.

這些設置沒有生產環境變量激活繞行.查看[Run Atomic Private Cross-Dataspace Settlement](/zh-hant/get-started/atomic-private-settlement),瞭解完整的配置示例和操作要求.直到文檔化外部釋放門通過,路徑不會獲得生產資格.

## 快照 {#snapshot}

該模塊負責閱讀和編寫[世界狀態視圖](/zh-hant/blockchain/world#world-state-view-wsv)的快照.

快照存儲了世界狀態視圖的序列化檢查點,這樣一個同行可以重新啓動而不需要重播從 Kura 的每個塊. Kura 仍然是持續的區塊歷史和重播的真相來源;快照是一種加速路徑.在啓動時, Iroha 檢查了設置鏈和存儲的區塊之間的快照元數據,然後決定是否要加載快照或重新播放.

::: tip 刪除快照

如果快照系統有問題,並且您想從空白頁面開始 (即快照),則可以刪除 [`snapshot.store_dir`](#param-snapshot-store-dir)所指定的目錄.

:::

### `snapshot.mode` {#param-snapshot-mode}

快照系統的模式.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

字符串,可能值:

- `read_write`:Iroha 創建了由 [`snapshot.create_every_ms`](#param-snapshot-create-every-ms)指定的時段的快照.在啓動時, Iroha 閱讀一個現有快照 (如果有的話) 並驗證它是否與區塊存儲保持更新.
- `readonly`:類似於 `read_write`但 Iroha 沒有創建任何快照.
- `disabled`: Iroha 既不會創建新的快照,也不會在啓動時讀取現有的快照.

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

在哪裏存儲快照.

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

遠程測量將同行診斷輸出到外部遠程測量的收集器.當同行報告給收藏器時,設置`telemetry.name` 和 `telemetry.url`;如果不使用遠程測試時,省略該節目.

`name`和 `url`必須配對.

所有 `telemetry` 節目都是可選的.

### `telemetry.name` {#param-telemetry-name}

在遠程測量中顯示節點的名稱.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

遠程測量器的 WebSocket URL.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

在重新連接之前的最低等待時間.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

增加連接之間的延遲使用的最大指數爲2.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

編寫 dev-telemetry的文件路徑

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
