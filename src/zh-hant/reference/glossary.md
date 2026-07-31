---
translation_locale: zh-hant
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 字典 <!-- omit in toc --> {#glossary}

這裡可以找到所有的定義 Iroha- 有關的組織.

- [同級人](#peer)
- [資產](#asset)
- [拜占庭的錯誤耐受性 (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha 組件](#iroha-components)
  - [Sumeragi 沒有人知道.](#sumeragi-emperor)
  - [Torii 這裡是一個很棒的城市.](#torii-gate)
  - [Kura 沒有任何樓盤符合您的搜尋](#kura-warehouse)
  - [Kagami(教師與模範及/或鏡頭)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [梅克爾樹 (哈什樹)](#merkle-tree-hash-tree)
  - [智能合同](#smart-contracts)
  - [引發器](#triggers)
  - [編輯版本](#versioning)
  - [希吉里 (同行名聲系統)](#hijiri-peer-reputation-system)
- [Iroha 模組](#iroha-modules)
- [Iroha 特別指示 (ISI)](#iroha-special-instructions-isi)
  - [使用性 Iroha 特別指示](#utility-iroha-special-instructions)
  - [核心 Iroha 特別指示](#core-iroha-special-instructions)
  - [特定域名 Iroha 特別指示](#domain-specific-iroha-special-instructions)
  - [定制品 Iroha 特別指令](#custom-iroha-special-instruction)
- [Iroha 詢問問題](#iroha-query)
- [顯示變更](#view-change)
- [世界國家觀點 (WSV)](#world-state-view-wsv)
- [領導者](#leader)

## 區塊帳號 {#blockchain-ledgers}

區塊帳是使用區塊的數位記錄系統
這些名稱取自古老的金融紀錄.
經費,新聞及資訊等財務紀錄所使用的書籍.
交易資訊.

在中世紀時期,
這項想法反映在基于区块链的
能檢查存儲的數據是否有效.

## 同級人 {#peer}

其他國家 Iroha 表示一個 Iroha 該處理例, Iroha 過程
客戶端應用程序可以連接.
單台機器可以容納多個 Iroha 他們是同學.
他們的資源和能力,
只有一個同行跑步
開始的過程中 Iroha 網路的使用.

其他區塊可能與結或驗證器相同的概念.

在主機系統上,
這種方法也可以包含在 Docker 還有一個Kubernetes.

## 資產 {#asset}

在區塊的背景下,
該區塊上的對象.

提供更多關於資產的資訊
[在這裡](/zh-hant/blockchain/assets.md).

### 可的資產 {#fungible-assets}

這種資產可以輕鬆換成同類的其他資產,
他們是可替代的.

例如,同一貨幣的所有單元均有相同的價值,
能用于購買商品.
除了紙幣和硬貨的磨損外,

### 沒有的資產 {#non-fungible-assets}

不能的資產是獨特而有價值,
他們的價值不能與其他資產相比.

- 畫面的價值可能會因藝術家,
  畫面,以及公眾對此的興趣.
- 兩間房子在同一街上可能有不同的維護水平.
- 珠寶制造商通常提供各種不同的設計.

### 可存儲的資產 {#mintable-assets}

如果可以發行更多相同類型的資產,

### 沒有可提取的資產 {#non-mintable-assets}

如果一項資產的初始額度被指定一次並不變,
沒有使用可能的.

其他國家 [創世記區塊](/zh-hant/guide/configure/genesis.md) 提供此信息
這項政策 Iroha 這樣的裝置.

## 拜占庭的錯誤耐受性 (BFT) {#byzantine-fault-tolerance-bft}

能正常運作,
該組織的成員數量也很大. Iroha 能夠運作
該組織的同行網絡中最多有33%的惡意行為者.

## Iroha 組件 {#iroha-components}

Rust 包含的模組 Iroha 功能性.

### Sumeragi 沒有人知道. {#sumeragi-emperor}

其他國家 Iroha 對共識負責的模組.

### Torii 這裡是一個很棒的城市. {#torii-gate}

接入的请求处理逻辑的模块 [同級人](#peer). 這種方法通常是
接收,接受和傳送接入的指示; HTTP 詢問的問題
執行時間設定更新.

### Kura 沒有任何樓盤符合您的搜尋 {#kura-warehouse}

這裡是一個很棒的區域. Kura 商店簽名區塊,區塊哈希,高度
在磁盤上, 該數據是指數,復元的側車和提交列表.
[世界狀況的觀點](#world-state-view-wsv) 已從 Kura 區塊時
或是在本地區域的商店後面.
[Kura 儲存](/zh-hant/blockchain/world.md#kura-storage).

### Kagami(教師與模範及/或鏡頭) {#kagami-teacher-and-exemplar-and-or-looking-glass}

能生成加密鍵對,
基因積木,文件等.

### 梅克爾樹 (哈什樹) {#merkle-tree-hash-tree}

在每個區塊的狀態進行驗證和核實使用的資料結構
這樣的高度. Iroha 現在的實施是二元樹.
[維基百科](https://en.wikipedia.org/wiki/Merkle_tree) 更多內容:

### 智能合同 {#smart-contracts}

智能合同是基于区块链的程序,
沒有任何要求. Iroha 智能合同使用
[核心 Iroha 特別指示](#core-iroha-special-instructions).

### 引發器 {#triggers}

事件類型,可以使用 Iroha 在特定的
更多關於引發器的資訊
[在這裡](/zh-hant/blockchain/triggers.md).

### 編輯版本 {#versioning}

每個要求都以此標示: API 該版本屬於它.
允許不同的二元版本的組合 Iroha 客戶/同行
互動的軟體,
Iroha 網路的使用.

### 希吉里 (同行名聲系統) {#hijiri-peer-reputation-system}

Iroha 該系統可以將溝通與 [同級人](#peer)
具有良好的軌跡紀錄,
惡意的行為 [同級人](#peer).

## Iroha 模組 {#iroha-modules}

第三方延伸至 Iroha 提供定制功能.

## Iroha 特別指示 (ISI) {#iroha-special-instructions-isi}

提供智能合同的圖書館 Iroha. 這些可以透過
還是已註冊的活動聽者. ISI
[在這裡](/zh-hant/blockchain/instructions.md).

#### 使用性 Iroha 特別指示 {#utility-iroha-special-instructions}

這一組 [其他國家](#iroha-special-instructions-isi) 含有理性的
這種指令 `If`, 其他相關產品 `Notify` 這種作品,
`Sequence`. 他們主要被用作
[定制指令](#custom-iroha-special-instruction).

### 核心 Iroha 特別指示 {#core-iroha-special-instructions}

[特別指示](#iroha-special-instructions-isi) 提供每個
Iroha 部署. 其中包括一些
[特定域名](#domain-specific-iroha-special-instructions) 這樣的情況
[使用指令](#utility-iroha-special-instructions).

### 特定域名 Iroha 特別指示 {#domain-specific-iroha-special-instructions}

關於特定領域活動的指令:資產,帳戶,
提供必要的工具,
改變 [世界狀況的觀點](#world-state-view-wsv) 在一個安全的和
沒有任何安全的方式.

### 定制品 Iroha 特別指令 {#custom-iroha-special-instruction}

提供指令 [Iroha 模組](#iroha-modules), 由客戶或第三方
只有使用
[主要指令](#core-iroha-special-instructions). 叉和
修改了 Iroha 沒有建議使用源代碼,
沒有同意的 [同級人](#peer) 在一個 Iroha 部署將被視為故障,
這樣 [同級人](#peer) 執行修改的實例將取消他們的權利.

## Iroha 詢問問題 {#iroha-query}

沒有修改該觀點.
詢問問題 [在這裡](/zh-hant/blockchain/queries.md).

## 顯示變更 {#view-change}

在未能達成共識情況下,
這通常意味著選出新任 [領導者](#leader).

## 世界國家觀點 (WSV) {#world-state-view-wsv}

在存储中呈現目前的區塊狀態. WSV 含有
這項政策 `World`, 已承諾的區塊哈希,交易指數,共識拓,
這項指數只會通過已承諾的
這種建築物可以從 [Kura](#kura-warehouse). 請看
[世界狀況的觀點](/zh-hant/blockchain/world.md#world-state-view-wsv).

## 領導者 {#leader}

在 iroha 網絡中, 一位同行被隨機選擇,
這項特權可在
實現的網絡
[拜占庭的故障漏洞](#byzantine-fault-tolerance-bft) 透過
[視覺變化](#view-change).
