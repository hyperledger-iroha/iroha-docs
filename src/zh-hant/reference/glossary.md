---
translation_locale: zh-hant
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 詞彙表 <!-- omit in toc --> {#glossary}

在此,您可以找到所有與 Iroha 有關的實體的定義.

- [同行](#peer)
- [資產](#asset)
- [拜占庭的故障耐受性 (BFT) ](#byzantine-fault-tolerance-bft)
- [Iroha 組件](#iroha-components)
  - [Sumeragi (皇帝)](#sumeragi-emperor)
  - [Torii (門)](#torii-gate)
  - [Kura (倉庫)](#kura-warehouse)
  - [Kagami(教師和模範和/或鏡子)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [梅克爾樹 (哈什樹)](#merkle-tree-hash-tree)
  - [智能合同](#smart-contracts)
  - [觸發器](#triggers)
  - [版本](#versioning)
  - [希吉里 (同行聲譽系統) ](#hijiri-peer-reputation-system)
- [Iroha 模塊](#iroha-modules)
- [Iroha 特別指示 (ISI)](#iroha-special-instructions-isi)
  - [實用性 Iroha 特殊指令](#utility-iroha-special-instructions)
  - [核心 Iroha 特殊指示](#core-iroha-special-instructions)
  - [域名特定的 Iroha 特殊指令](#domain-specific-iroha-special-instructions)
  - [關稅 Iroha 特別說明](#custom-iroha-special-instruction)
- [Iroha 查詢](#iroha-query)
- [查看變更](#view-change)
- [世界狀態觀 (WSV) ](#world-state-view-wsv)
- [領導者](#leader)

## 區塊鏈賬本 {#blockchain-ledgers}

區塊鏈賬本是使用區塊鏈技術保存財務記錄的數字記錄系統.這些名字源於用於價格,新聞和交易信息等金融記錄的古老書籍.

在中世紀期間,賬本開放以供公衆查看和驗證準確性.這種想法反映在基於區塊鏈的系統中,可以檢查存儲的數據是否有效.

## 同齡人 {#peer}

在 Iroha 中的同行是指其他 Iroha 進程和客戶端應用程序可以連接到的 Iroha 過程實例. 一臺機器可以容納多個 Iroha 同行.同齡人在資源和能力方面是平等的,但有一個重要例外:只有一個同齡人在 Iroha 網絡啓動階段運行基因塊.

其他區塊鏈可能與節點或驗證符相同的概念.

一個同行可以是其主機系統上的過程. 它也可以包含在一個 Docker 容器和 Kubernetes 子中.

## 資產 {#asset}

在區塊鏈的背景下,資產是對區塊鏈上的有價值物體的表示.

關於資產的額外信息可在 [上找到](/zh-hant/blockchain/assets.md).

### 性資產 {#fungible-assets}

這些資產可以很容易地換成同類型的其他資產,因爲它們是可互換的.

例如,同一貨幣的所有單位的價值均等,並且可以用於購買商品.通常,可形資產外觀相同,除了紙幣和硬幣的磨損.

### 無性資產 {#non-fungible-assets}

由於其特殊特徵和稀有性,非形資產是獨特的和有價值的;它們的價值與其他資產無法比較.

- 一幅畫的價值可以根據藝術家,繪畫時間以及公衆對其感興趣而變化.
- 一條街上的兩個房子可能有不同的維護水平.
- 珠寶製造商通常提供各種不同的設計.

### 可存儲的資產 {#mintable-assets}

如果可以發行更多相同類型的資產,該資產是可創建的.

### 不可提現的資產 {#non-mintable-assets}

如果資產的初始金額被指定一次,並且沒有變化,則將其視爲不可取消.

[Genesis塊](/zh-hant/guide/configure/genesis.md)爲 Iroha 配置設置了此信息.

## 拜占庭的故障耐受性 (BFT) {#byzantine-fault-tolerance-bft}

能夠在包含一定比例的惡意行爲者網絡中正常運行的特性.Iroha 能夠與其同等網絡中最多33%的惡意行爲者進行操作.

## Iroha 組件 {#iroha-components}

包含 Iroha 功能的 Rust 模塊.

### Sumeragi (皇帝) {#sumeragi-emperor}

負責共識的 Iroha 模塊.

### Torii (門) {#torii-gate}

該模塊爲 [peer](#peer)的輸入請求處理邏輯. 它用於接收,接受和路由輸入指示,以及 HTTP 查詢,以及運行時間配置更新.

### Kura (倉庫) {#kura-warehouse}

一個持續的塊存儲. Kura 存儲簽名區塊,區塊哈希,高度指數,恢復側車和在磁盤上提交列表的元數據. [世界狀況的看法](#world-state-view-wsv) 是從 Kura 當狀態快照不可或在本地區塊商店後面. [Kura 存儲](/zh-hant/blockchain/world.md#kura-storage).

### Kagami(教師和示範者及/或鏡子) {#kagami-teacher-and-exemplar-and-or-looking-glass}

通常使用的數據生成器. 它可以生成加密密鑰對,創始區塊,文檔等.

### 梅克爾樹 (樹) {#merkle-tree-hash-tree}

一個用於驗證和驗證每個區塊高度狀態的數據結構. Iroha 目前的實現是二進制樹.查看[Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree)詳細信息.

### 智能合同 {#smart-contracts}

智能合同是基於區塊鏈的程序,在滿足特定條件時運行. 在 Iroha 中,智能合約使用[核心 Iroha 特殊指令](#core-iroha-special-instructions)實現.

### 觸發器 {#triggers}

事件類型,允許調用一個 Iroha 具體區塊提交,時間 (含有一些警告) 等方面的特殊指示. [在這裏](/zh-hant/blockchain/triggers.md).

### 版本化 {#versioning}

每個請求都標記着它屬於的 API 版本. 它允許 Iroha 客戶端/同行軟件的不同二進制版本的組合相互操作,這反過來可以在 Iroha 網絡中進行軟件升級.

### 希吉里 (同行聲譽系統) {#hijiri-peer-reputation-system}

Iroha 的聲譽系統.它允許優先與具有良好的軌跡記錄的[同行](#peer)進行溝通,並減少惡意的[同行](#peer)造成的傷害.

## Iroha 模塊 {#iroha-modules}

Iroha 的第三方擴展,提供了定製功能.

## Iroha 特殊指示 (ISI) {#iroha-special-instructions-isi}

提供 Iroha 的智能合同庫. 這些可以通過交易或註冊活動聽衆來調用.更多信息在 ISI [這裏](/zh-hant/blockchain/instructions.md).

#### 實用性 Iroha 特殊指示 {#utility-iroha-special-instructions}

這套 [isi](#iroha-special-instructions-isi)包含像 `If`這樣的邏輯指令,類似於 `Notify`這樣的I/O相關指令和`Sequence`這樣的組合.它們主要被用作[定製指令](#custom-iroha-special-instruction).

### 核心 Iroha 特殊指示 {#core-iroha-special-instructions}

[每次 Iroha 部署都提供了特殊指令](#iroha-special-instructions-isi).其中包括一些 [域名特定的指令](#domain-specific-iroha-special-instructions)以及 [實用性指令](#utility-iroha-special-instructions).

### 特定領域的特殊指示 Iroha {#domain-specific-iroha-special-instructions}

與特定領域的活動相關的指令:資產,賬戶,域名,同行管理).這些指令提供了安全和安全的方式對[世界狀態視圖](#world-state-view-wsv)進行變更所需的工具.

### 關稅 Iroha 特殊指示 {#custom-iroha-special-instruction}

提供指令 [Iroha 模塊](#iroha-modules), 通過客戶或第三方. [核心指令](#core-iroha-special-instructions). 叉和修改 Iroha 源代碼不建議,因爲特別指示未經同意的 [同齡人](#peer) 在一個 Iroha 部署將被視爲故障,因此 [同齡人](#peer) 運行修改實例將被取消訪問權限.

## Iroha 查詢 {#iroha-query}

要求閱讀世界狀況視圖而不修改該視圖.更多關於查詢 [在](/zh-hant/blockchain/queries.md).

## 查看變化 {#view-change}

一個在未能達成共識的情況下進行的過程. 通常,這涉及選舉一個新的 [領導人](#leader).

## 世界狀態的視角 (WSV) {#world-state-view-wsv}

目前的區塊鏈狀態在內存中表示. WSV 包含了 `World`, 已承諾的區塊哈希,交易指數,共識拓和被查詢所使用的衍生指數.它只有通過承諾的區塊更新,可以從 [Kura](#kura-warehouse). 查看 [世界狀況的看法](/zh-hant/blockchain/world.md#world-state-view-wsv).

## 領導者 {#leader}

在Iroha網絡中,一個同行被隨機選擇並獲得特殊特權.這種特權可以被撤銷在實現 [拜占庭的故障度](#byzantine-fault-tolerance-bft) 通過 [視圖的變化](#view-change).
