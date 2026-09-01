---
translation_locale: zh-hant
translation_source: /reference/glossary.md
translation_source_hash: ab484310e7e0b0662c1d4bb133e7ae337c71b09b5fdc8e678581234d74ee9b29
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 詞彙表 <!-- omit in toc --> {#glossary}

在此,您可以找到所有與 Iroha 有關的實體的定義.

- [對等節點](#peer)
- [資產](#asset)
- [拜占庭的故障耐受性 (BFT) ](#byzantine-fault-tolerance-bft)
- [Iroha 元件](#iroha-components)
  - [Sumeragi (皇帝)](#sumeragi-emperor)
  - [Torii (門)](#torii-gate)
  - [Kura (倉庫)](#kura-warehouse)
  - [Kagami(教師和模範和/或鏡子)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [梅克爾樹 (哈什樹)](#merkle-tree-hash-tree)
  - [智慧合同](#smart-contracts)
  - [觸發器](#triggers)
  - [版本](#versioning)
  - [希吉里 (對等節點聲譽系統) ](#hijiri-peer-reputation-system)
- [Iroha 模組](#iroha-modules)
- [Iroha 特別指示 (ISI)](#iroha-special-instructions-isi)
  - [實用性 Iroha 特殊指令](#utility-iroha-special-instructions)
  - [核心 Iroha 特殊指示](#core-iroha-special-instructions)
  - [域名特定的 Iroha 特殊指令](#domain-specific-iroha-special-instructions)
  - [關稅 Iroha 特別說明](#custom-iroha-special-instruction)
- [Iroha 查詢](#iroha-query)
- [檢視變更](#view-change)
- [世界狀態觀 (WSV) ](#world-state-view-wsv)
- [領導者](#leader)

## 區塊鏈賬本 {#blockchain-ledgers}

區塊鏈賬本是使用區塊鏈技術儲存財務記錄的數字記錄系統.這些名字源於用於價格,新聞和交易資訊等金融記錄的古老書籍.

在中世紀期間,賬本開放以供公眾檢視和驗證準確性.這種想法反映在基於區塊鏈的系統中,可以檢查儲存的資料是否有效.

## 對等節點 {#peer}

在 Iroha 中的對等節點是指其他 Iroha 程序和客戶端應用程式可以連線到的 Iroha 過程例項. 一臺機器可以容納多個 Iroha 對等節點.對等節點在資源和能力方面是平等的,但有一個重要例外:只有一個對等節點在 Iroha 網路啟動階段執行創世塊.

其他區塊鏈可能與節點或驗證符相同的概念.

一個對等節點可以是其主機系統上的過程. 它也可以包含在一個 Docker 容器和 Kubernetes 子中.

## 資產 {#asset}

在區塊鏈的背景下,資產是對區塊鏈上的有價值物體的表示.

關於資產的額外資訊可在 [上找到](/zh-hant/blockchain/assets.md).

### 性資產 {#fungible-assets}

這些資產可以很容易地換成同型別的其他資產,因為它們是可互換的.

例如,同一貨幣的所有單位的價值均等,並且可以用於購買商品.通常,可形資產外觀相同,除了紙幣和硬幣的磨損.

### 無性資產 {#non-fungible-assets}

由於其特殊特徵和稀有性,非形資產是獨特的和有價值的;它們的價值與其他資產無法比較.

- 一幅畫的價值可以根據藝術家,繪畫時間以及公眾對其感興趣而變化.
- 一條街上的兩個房子可能有不同的維護水平.
- 珠寶製造商通常提供各種不同的設計.

### 可鑄造資產 {#mintable-assets}

如果可以發行更多相同型別的資產，該資產就是可鑄造的。

### 不可鑄造資產 {#non-mintable-assets}

如果資產的初始數量只指定一次且不再變更，該資產就被視為不可鑄造。

[Genesis塊](/zh-hant/guide/configure/genesis.md)為 Iroha 配置設定了此資訊.

## 拜占庭的故障耐受性 (BFT) {#byzantine-fault-tolerance-bft}

能夠在包含一定比例的惡意行為者網路中正常執行的特性.Iroha 能夠與其同等網路中最多33%的惡意行為者進行操作.

## Iroha 元件 {#iroha-components}

包含 Iroha 功能的 Rust 模組.

### Sumeragi (皇帝) {#sumeragi-emperor}

負責共識的 Iroha 模組.

### Torii (門) {#torii-gate}

包含[對等節點](#peer)傳入要求處理邏輯的模組。它用於接收、接受和路由傳入的指令及 HTTP 查詢，也用於處理執行階段設定更新。

### Kura (倉庫) {#kura-warehouse}

一個持續的塊儲存. Kura 儲存簽名區塊,區塊雜湊,高度索引,恢復輔助記錄和在磁碟上提交列表的後設資料. [世界狀況的看法](#world-state-view-wsv) 是從 Kura 當狀態快照不可或在本地區塊商店後面. [Kura 儲存](/zh-hant/blockchain/world.md#kura-storage).

### Kagami(教師和示範者及/或鏡子) {#kagami-teacher-and-exemplar-and-or-looking-glass}

通常使用的資料生成器. 它可以生成加密金鑰對,創世區塊,文件等.

### 梅克爾樹 (樹) {#merkle-tree-hash-tree}

一個用於驗證和驗證每個區塊高度狀態的資料結構. Iroha 目前的實現是二進位制樹.檢視[Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree)詳細資訊.

### 智慧合同 {#smart-contracts}

智慧合同是基於區塊鏈的程式,在滿足特定條件時執行. 在 Iroha 中,智慧合約使用[核心 Iroha 特殊指令](#core-iroha-special-instructions)實現.

### 觸發器 {#triggers}

事件型別,允許呼叫一個 Iroha 具體區塊提交,時間 (含有一些警告) 等方面的特殊指示. [在這裡](/zh-hant/blockchain/triggers.md).

### 版本化 {#versioning}

每個請求都標記著它屬於的 API 版本. 它允許 Iroha 客戶端/對等節點軟體的不同二進製版本的組合相互操作,這反過來可以在 Iroha 網路中進行軟體升級.

### 希吉里 (對等節點聲譽系統) {#hijiri-peer-reputation-system}

Iroha 的聲譽系統.它允許優先與具有良好的軌跡記錄的[對等節點](#peer)進行溝通,並減少惡意的[對等節點](#peer)造成的傷害.

## Iroha 模組 {#iroha-modules}

Iroha 的第三方擴充套件,提供了定製功能.

## Iroha 特殊指示 (ISI) {#iroha-special-instructions-isi}

提供 Iroha 的智慧合同庫. 這些可以透過交易或註冊活動聽眾來呼叫.更多資訊在 ISI [這裡](/zh-hant/blockchain/instructions.md).

#### 實用性 Iroha 特殊指示 {#utility-iroha-special-instructions}

這套 [isi](#iroha-special-instructions-isi)包含像 `If`這樣的邏輯指令,類似於 `Notify`這樣的I/O相關指令和`Sequence`這樣的組合.它們主要被用作[定製指令](#custom-iroha-special-instruction).

### 核心 Iroha 特殊指示 {#core-iroha-special-instructions}

[每次 Iroha 部署都提供了特殊指令](#iroha-special-instructions-isi).其中包括一些 [域名特定的指令](#domain-specific-iroha-special-instructions)以及 [實用性指令](#utility-iroha-special-instructions).

### 特定領域的特殊指示 Iroha {#domain-specific-iroha-special-instructions}

與特定領域的活動相關的指令:資產,帳戶,域名,對等節點管理).這些指令提供了安全和安全的方式對[世界狀態檢視](#world-state-view-wsv)進行變更所需的工具.

### 關稅 Iroha 特殊指示 {#custom-iroha-special-instruction}

由 [Iroha 模組](#iroha-modules)、使用者端或第三方提供的指令。這些指令只能使用[核心指令](#core-iroha-special-instructions)建置。不建議分叉和修改 Iroha 原始碼，因為 Iroha 部署中的[對等節點](#peer)未達成一致的特殊指令會被視為故障，因此執行修改例項的[對等節點](#peer)將被撤銷存取權。

## Iroha 查詢 {#iroha-query}

要求閱讀世界狀況檢視而不修改該檢視.更多關於查詢 [在](/zh-hant/blockchain/queries.md).

## 檢視變化 {#view-change}

一個在未能達成共識的情況下進行的過程. 通常,這涉及選舉一個新的 [領導人](#leader).

## 世界狀態的視角 (WSV) {#world-state-view-wsv}

目前的區塊鏈狀態在記憶體中表示. WSV 包含了 `World`, 已提交的區塊雜湊,交易索引,共識拓和被查詢所使用的派生索引.它只有透過提交的區塊更新,可以從 [Kura](#kura-warehouse). 檢視 [世界狀況的看法](/zh-hant/blockchain/world.md#world-state-view-wsv).

## 領導者 {#leader}

在 Iroha 網路中，系統會隨機選出一個對等節點，並賦予其建立下一個區塊的特殊權限。在達成[拜占庭容錯](#byzantine-fault-tolerance-bft)的網路中，可透過[檢視變更](#view-change)撤銷此權限。
