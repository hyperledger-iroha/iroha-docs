---
translation_locale: zh-hant
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 世界 {#world}

`World` 是包含其他單位的全球單體. `World`
由以下構成:

- Iroha [配置參數](/zh-hant/guide/configure/client-configuration.md)
- 已註冊的同行
- 已註冊的域名
- 已註冊 [引發器](/zh-hant/blockchain/triggers.md)
- 已註冊
  [角色](/zh-hant/blockchain/permissions.md#permission-groups-roles)
- 已註冊
  [許可符號的定義](/zh-hant/blockchain/permissions.md#permission-tokens)
- 所有帳戶的許可令牌
- [運行時間驗證器的連鎖](/zh-hant/blockchain/permissions.md#runtime-validators)

在域名,同行或角色被註冊或未注冊時, `World`
是 (非) 登記的目標
[指示](/zh-hant/blockchain/instructions.md).

## 世界狀況觀點 (WSV) {#world-state-view-wsv}

世界狀態視覺是現行區塊的內存表現
這項政策包括: `World`, 預約的區塊哈希,交易指數,
提供全區用荷物.
Kura 而不是被複製為可變的 WSV 數據.

其他國家 WSV 這種情況下,
歷史本身並不是真理的永恆來源.
[Kura](#kura-storage), 這種情況 WSV 可以從 Kura 積木或充電
接下來,我們將它從一個狀態的快照中捕捉到, Kura 這裡有許多街區.

### 該怎麼辦? WSV 排行榜 {#what-the-wsv-tracks}

其他國家 WSV 較寬的 `World` 實際上它包含:

- 這項政策 `World`: 參數,同行,域名,帳戶,資產, NFTs, 角色,
  許可,啟動器,執行者數據和其他註冊的資料模型
  其他物體
- 已承諾的區塊哈希和最新的承諾的高度
- 在查詢和收據中使用的交易到區塊指數
- 由共識使用的現行和以前的承諾拓
- 來自已承諾的積木,如數據可用性
  承諾,收件導覽器,印意圖和查詢投影標記
- 需要進行決定性區塊執行的運行時間配置快照,
  這種情況可能會影響其他國家, Nexus
  設定

查詢通常只能閱讀 `StateView` 在這些結構上.
查看是查詢執行的一致快照; 它不允許直接
這種變化 WSV.

### 如何使用 WSV 改變 {#how-the-wsv-changes}

WSV 區塊執行會創造一個
每個接受的交易都適用於其
在交易規模上覆蓋的指令中.
在同一區塊背景下進行交易.
對塊的交易效果.

在共識結束一個區塊後,
在 Kura. 如果此次排隊步骤失败, WSV 沒有進步,
該區塊的使用負載量會重新測試或排序.
已接受 Kura 這裡有許多人, Iroha 適用於執行後區塊效應,
更新衍生指數,並承諾進行階段 WSV 在 a 內的變化
這讓讀者無法觀察部分的
這裡是個街區.

協調的關鍵規則是, WSV 來自:
直接在本地編輯到 WSV 通過數據的指示,
在驗證或重播過程中,

### 啟動和重播 {#startup-and-replay}

在開始時, Iroha 開始使用 Kura 首先學習儲存的積木高度.
如果沒有即時拍照,
快照被拒絕為可回收的, Iroha 產生了一個初始狀態,
複製已提交的區塊 Kura. 如果即時拍照是有效的, Kura,
只有缺失的高度範圍才會被重播.

檢查每個存儲的區塊, 再建立該區塊的提交名單.
應對區塊效果 WSV, 承諾將其產生
這意味著 Kura 是否能獲得回收 WSV, 在此時,
避免整個連鎖重播.

## Kura 存儲時間 {#kura-storage}

_卡拉_ 是的 Iroha 這裡存儲簽名的積木,
沒有存儲第二份可變複製 WSV.

Kura 存储的根源是 [`kura.store_dir`](/zh-hant/reference/peer-config/params.md#param-kura-store-dir).
在這個根內,區塊數據被分為行徑或段.
對一個區域是:

| 路徑 | 目的 |
| --- | --- |
| `blocks/<segment>/blocks.data` | 隨著時間 Norito 置的簽名積木用荷物. |
| `blocks/<segment>/blocks.index` | 固定尺寸 `(start, length)` 顯示地圖區塊高度到字節 `blocks.data`. |
| `blocks/<segment>/blocks.hashes` | 按高度封鎖哈希, |
| `blocks/<segment>/blocks.count.norito` | 顯示使用安全的區塊索引輸入數量. |
| `blocks/<segment>/da_blocks/` | 在外面放置的驅逐區塊用荷物 `blocks.data` 當磁盤預算執行者將舊遺體從熱檔中移除時. |
| `blocks/<segment>/pipeline/sidecars.norito` 及其他 `sidecars.index` | 按區塊高度調節的管道復原車. |
| `blocks/<segment>/pipeline/roster_sidecars.norito` 及其他 `roster_sidecars.index` | 最近使用區塊同步和重播. |
| `merge_ledger/<segment>.log` | 聯合帳號入口與已承諾的積木排列 |
| `commit-rosters.norito` | 對最近的區塊保留了承諾證書和驗證碼檢查點. |

Kura 保持連鎖的密集記憶體向量:每個高度都有
基因區塊仍存於預備庫中,
而最近的 [`kura.blocks_in_memory`](/zh-hant/reference/peer-config/params.md#param-kura-blocks-in-memory)
沒有基因的積木保留他們的身體在記憶中.
已從記憶中掉下來, Kura 在需要時,

在啟動過程中, `strict` 在此模式中,
如果有必要, 該文件會重寫. `fast` 模式從儲存開始
如果該傳統數據已被重新啟動,
沒有任何可能的情況. Kura 檢測出壞的尾巴,
最后一次核實的區塊.

Kura 透過背景寫作者來寫新積木.
顯示使用的數值,
按設定的 fsync 政策.
活動, Kura 能清除已退休的部分或驅逐老區體
`da_blocks/` 在保持哈希和索引輸入可供验证的同時
並尋找.
