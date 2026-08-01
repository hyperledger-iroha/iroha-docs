---
translation_locale: zh-hant
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 世界 {#world}

`World`是包含其他實體的全球實體. `World`由:

- Iroha [配置參數](/zh-hant/guide/configure/client-configuration.md)
- 已註冊的同齡人
- 已註冊域名
- 已註冊的[觸發器](/zh-hant/blockchain/triggers.md)
- 註冊的 [角色](/zh-hant/blockchain/permissions.md#permission-groups-roles)
- 已註冊的 [許可證代幣定義](/zh-hant/blockchain/permissions.md#permission-tokens)
- 所有賬戶的權限代幣
- [運行時間驗證器鏈](/zh-hant/blockchain/permissions.md#runtime-validators)

當域名,同行或角色已註冊或未註冊時, `World` 是 (非) 註冊 [指示](/zh-hant/blockchain/instructions.md)的目標.

## 世界狀況觀 (WSV) {#world-state-view-wsv}

世界狀態視圖是當前區塊鏈狀態的內存表示.它包括`World`,已承諾的區塊哈希,交易指數和當前時代選出的同行.從 Kura rather than duplicated as mutable WSV 數據中提供完整的區塊有效載荷.

WSV 是查詢讀取和區塊執行發生突變的狀態.它本身不是永恆的真理來源.永恆的歷史存儲在[Kura](#kura-storage),和 WSV 可以從 Kura 塊中重建或從狀態快照中加載,然後通過重新播放更新的 Kura 塊來捕捉.

### 什麼是 WSV 的痕跡 {#what-the-wsv-tracks}

WSV 比`World`對象更廣泛,實際上它包含:

- `World`:參數,同行,域名,帳戶,資產, NFTs,角色,權限,觸發器,執行數據和其他註冊數據模型對象.
- 已承諾的區塊哈希和最新已承諾的高度
- 在查詢和收據中使用的交易到區塊指數
- 通過共識使用的當前和以前的承諾拓
- 從承諾區塊中獲得的內存索引,例如數據可用性承諾,收件緩衝器,印意圖和查詢投影標記
- 對於確定性區塊執行所需的運行時間配置快照,例如加密,治理,管道,內容,結算和 Nexus 設置

查詢通常在這些結構上只能讀取 `StateView`.一個視圖是查詢執行的一致的快照;它不允許直接突變 WSV.

### WSV 如何變化 {#how-the-wsv-changes}

WSV 區塊執行創建了一個區塊範圍的狀態覆蓋,每個接受的交易都將其指令應用於交易範圍覆蓋層中.這些交易所調用的數據觸發器運行在相同的區塊中.在區塊的交易效應之後,時間觸發器進行評估.

在共識提交一個區塊後,同行首先在 Kura 中排列承諾的區塊.如果此次排列步驟失敗, WSV 不會進行推進,並且共識循環會重新嘗試或排列區塊有效載荷.當區塊被接受到 Kura 的隊列中時,Iroha 將執行後的區塊效果應用,更新衍生索引,並在狀態視圖鎖下進行階段化 WSV 變更. 這使讀者無法觀察部分承諾的區塊.

共識關鍵規則是,同行必須從相同的承諾區塊中達到相同的 WSV.直接將本地編輯到 WSV 數據繞過指令,並且在驗證或重播期間會導致同行不同意義.

### 啓動和重播 {#startup-and-replay}

在啓動時, Iroha 首先初始化 Kura 並學習存儲的區塊高度.然後試圖加載狀態快照.如果沒有快照,或如果一個快照被拒絕作爲可回收的時, Iroha 創建了一個初始狀態,並從 Kura 中重新播放承諾塊. 如果一個快照是有效的,但落後於 Kura,只有缺失的高度範圍纔會再播放.

再播驗證每個存儲的區塊,重建該高度的提交列表,將區塊效應應用到 WSV,並提交結果狀態.這意味着 Kura 是 WSV 的恢復路徑,而快照則是一種優化,以避免整個鏈接重播.

## Kura 存儲 {#kura-storage}

Kura 是 Iroha 的持久區塊存儲.它存儲簽署的區塊和恢復元數據.它不存儲 WSV 的第二份可變拷貝.

Kura 存儲器根植於[`kura.store_dir`](/zh-hant/reference/peer-config/params.md#param-kura-store-dir).在該根內,區塊數據被分爲行徑或段.一個段的主要文件是:

|路徑|目的|
| --- | --- |
|`blocks/<segment>/blocks.data`|連接式 Norito 框架的簽署區塊有效載荷. |
|`blocks/<segment>/blocks.index`|固定尺寸的 `(start, length)`輸入,該地圖塊高度爲 `blocks.data` 中的字節.|
|`blocks/<segment>/blocks.hashes`|爲快速查找和啓動驗證,按高度阻止哈希.|
|`blocks/<segment>/blocks.count.norito`|具有耐用性的提交標記,記錄了安全使用的區塊指數輸入. |
|`blocks/<segment>/da_blocks/`|當磁盤預算執法將舊屍體從熱文件中移動時,被排除在 `blocks.data`之外的塊實用載荷. |
|`blocks/<segment>/pipeline/sidecars.norito`和 `sidecars.index` |按區塊高度調節的管道恢復側車. |
|`blocks/<segment>/pipeline/roster_sidecars.norito`和 `roster_sidecars.index` |在區塊同步和重播中使用的近期提交列表側車.|
|`merge_ledger/<segment>.log`|結合賬本的條目與承諾區塊一致.|
|`commit-rosters.norito`|保留近期區塊的承諾證書和驗證器檢查站. |

Kura 爲鏈保持一個緊的內存向量:每個高度都有區塊哈希和,可選的是,區塊體.最新的 [`kura.blocks_in_memory`](/zh-hant/reference/peer-config/params.md#param-kura-blocks-in-memory)非基因塊將其身體存儲在記憶中.如果需要的話,舊塊體會從記憶中丟棄並從 Kura 文件中重新加載.

在啓動過程中, `strict` 模式驗證存儲的區塊從區塊有效載荷和重寫哈希文件如果需要. `fast` 模式從存儲開始.如果 Kura 檢測到損壞的尾巴,它將存儲量調整至最後一個驗證區塊.

Kura 通過背景編寫器編寫新區塊. 作者添加區塊有效載荷,哈希和索引輸入,然後根據配置的fsync政策推進持久計數標記.當磁盤預算執行活動時, Kura 可以清除已退休的部分或驅逐舊區塊體進入 `da_blocks/`,同時保持哈希和索引輸入可驗證和搜索.
