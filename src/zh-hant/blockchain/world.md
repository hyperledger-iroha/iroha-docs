---
translation_locale: zh-hant
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 世界 {#world}

`World`是包含其他實體的全球實體. `World`由:

- Iroha [配置引數](/zh-hant/guide/configure/client-configuration.md)
- 已註冊的對等節點
- 已註冊域名
- 已註冊的[觸發器](/zh-hant/blockchain/triggers.md)
- 註冊的 [角色](/zh-hant/blockchain/permissions.md#permission-groups-roles)
- 已註冊的 [許可證代幣定義](/zh-hant/blockchain/permissions.md#permission-tokens)
- 所有帳戶的許可權代幣
- [執行階段驗證器鏈](/zh-hant/blockchain/permissions.md#runtime-validators)

當域名,對等節點或角色已註冊或未註冊時, `World` 是 (非) 註冊 [指示](/zh-hant/blockchain/instructions.md)的目標.

## 世界狀況觀 (WSV) {#world-state-view-wsv}

世界狀態檢視是當前區塊鏈狀態的記憶體表示.它包括`World`,已提交的區塊雜湊,交易索引和當前時代選出的對等節點.完整區塊酬載由 Kura 提供，而不是重複儲存為可變的 WSV 資料.

WSV 是查詢讀取和區塊執行發生突變的狀態.它本身不是永恆的真理來源.永恆的歷史儲存在[Kura](#kura-storage),和 WSV 可以從 Kura 塊中重建或從狀態快照中載入,然後透過重新播放更新的 Kura 塊來捕捉.

### 什麼是 WSV 的痕跡 {#what-the-wsv-tracks}

WSV 比`World`物件更廣泛,實際上它包含:

- `World`:引數,對等節點,域名,帳戶,資產, NFTs,角色,許可權,觸發器,執行資料和其他註冊資料模型物件.
- 已提交的區塊雜湊和最新已提交的高度
- 在查詢和收據中使用的交易到區塊索引
- 透過共識使用的當前和以前的提交拓
- 從承諾區塊中獲得的記憶體索引,例如資料可用性承諾,回執緩衝器,釘選意圖和查詢投影標記
- 對於確定性區塊執行所需的執行階段配置快照,例如加密,治理,管道,內容,結算和 Nexus 設定

查詢通常在這些結構上只能讀取 `StateView`.一個檢視是查詢執行的一致的快照;它不允許直接突變 WSV.

### WSV 如何變化 {#how-the-wsv-changes}

WSV 變更會在提交前暫存。區塊執行會建立區塊範圍的狀態覆蓋層，每筆被接受的交易則在交易範圍的覆蓋層中套用其指令。這些交易呼叫的資料觸發器在同一區塊內容中執行。時間觸發器在該區塊的交易效果之後求值。

在共識提交一個區塊後,對等節點首先在 Kura 中排列提交的區塊.如果此次排列步驟失敗, WSV 不會進行推進,並且共識迴圈會重新嘗試或排列區塊有效載荷.當區塊被接受到 Kura 的佇列中時,Iroha 將執行後的區塊效果應用,更新衍生索引,並在狀態檢視鎖下進行階段化 WSV 變更. 這使讀者無法觀察部分提交的區塊.

共識的關鍵規則是，對等節點必須從相同的已提交區塊得到相同的 WSV。直接在本機編輯 WSV 資料會繞過指令，並使對等節點在驗證或重播期間產生分歧。

### 啟動和重播 {#startup-and-replay}

在啟動時, Iroha 首先初始化 Kura 並學習儲存的區塊高度.然後試圖載入狀態快照.如果沒有快照,或如果一個快照被拒絕作為可回收的時, Iroha 建立了一個初始狀態,並從 Kura 中重新播放提交塊. 如果一個快照是有效的,但落後於 Kura,只有缺失的高度範圍才會再播放.

再播驗證每個儲存的區塊,重建該高度的提交列表,將區塊效應應用到 WSV,並提交結果狀態.這意味著 Kura 是 WSV 的恢復路徑,而快照則是一種最佳化,以避免整個連結重播.

## Kura 儲存 {#kura-storage}

Kura 是 Iroha 的持久區塊儲存.它儲存簽署的區塊和恢復後設資料.它不儲存 WSV 的第二份可變複製.

Kura 儲存器根植於[`kura.store_dir`](/zh-hant/reference/peer-config/params.md#param-kura-store-dir).在該根內,區塊資料被分為通道或段.一個段的主要檔案是:

|路徑|目的|
| --- | --- |
|`blocks/<segment>/blocks.data`|連線式 Norito 框架的簽署區塊有效載荷. |
|`blocks/<segment>/blocks.index`|固定尺寸的 `(start, length)`輸入,該地圖塊高度為 `blocks.data` 中的位元組.|
|`blocks/<segment>/blocks.hashes`|為快速查詢和啟動驗證,按高度阻止雜湊.|
|`blocks/<segment>/blocks.count.norito`|具有耐用性的提交標記,記錄了安全使用的區塊索引項. |
|`blocks/<segment>/da_blocks/`|當磁碟預算執法將舊區塊體從熱檔案中移動時,被排除在 `blocks.data`之外的塊實用載荷. |
|`blocks/<segment>/pipeline/sidecars.norito`和 `sidecars.index` |按區塊高度調節的管道恢復輔助記錄. |
|`blocks/<segment>/pipeline/roster_sidecars.norito`和 `roster_sidecars.index` |在區塊同步和重播中使用的近期提交列表輔助記錄.|
|`merge_ledger/<segment>.log`|結合賬本的條目與提交區塊一致.|
|`commit-rosters.norito`|保留近期區塊的提交證書和驗證器檢查站. |

Kura 為鏈維護一個緊湊的記憶體向量：每個高度都包含區塊雜湊，並可選地包含區塊體。創世區塊始終保留在快取中，最近的 [`kura.blocks_in_memory`](/zh-hant/reference/peer-config/params.md#param-kura-blocks-in-memory) 個非創世區塊會將其區塊體保留在記憶體中。較舊的區塊體會從記憶體中移除，並在需要時從 Kura 檔案重新載入。

在啟動過程中, `strict` 模式驗證儲存的區塊從區塊有效載荷和重寫雜湊檔案如果需要. `fast` 模式從儲存開始.如果 Kura 檢測到損壞的尾巴,它將儲存量調整至最後一個驗證區塊.

Kura 透過背景編寫器編寫新區塊. 作者新增區塊有效載荷,雜湊和索引輸入,然後根據配置的fsync政策推進持久計數標記.當磁碟預算執行活動時, Kura 可以清除已停用的分段或將舊區塊體移入 `da_blocks/`,同時保留雜湊和索引項以供驗證和搜尋.
