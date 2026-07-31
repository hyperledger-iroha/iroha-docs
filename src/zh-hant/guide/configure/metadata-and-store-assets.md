---
translation_locale: zh-hant
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 數據儲存及數字簿存储的選擇 {#metadata-and-ledger-storage-choices}

其他國家 Iroha 3 數據模型沒有獨立的 `Store` 對任意的資產類型
使用以下存儲選項.

## 數據表 {#metadata}

使用 [數據](/zh-hant/blockchain/metadata.md) 對於小 JSON 屬於的字段
在帳號對象上:

- 顯示名稱和標籤
- 集成 IDs
- 小政策旗
- 哈希斯, URIs, CIDs, 或是 SoraFS 指向更大的有效載荷的路徑

數據是世界狀態的一部分,
保持密钥穩定,數值簡約,權限明顯.
直接存儲大型文件,日志或高率的應用程序狀態
沒有任何相關資料.

## 數值資產和 NFTs {#numeric-assets-and-nfts}

使用 [資產](/zh-hant/blockchain/assets.md) 及其他 [NFTs](/zh-hant/blockchain/nfts.md) 什麼時候
該國家具有價值:

- 數值資產,可存的餘額
- NFTs 獨家所有權的紀錄
- [RWAs](/zh-hant/blockchain/rwas.md) 其他特定領域的對象,
  活跃的數據模型揭示了他們

資產和 NFTs 擁有自己的 IDs, 生命周期事件,轉移行為,
他們比所有權的元數據更好,
或是傳輸歷史.

## 沒有連鎖數據 {#off-chain-data}

使用無鎖儲存的大型或可變化的有效負荷.
在連鎖上參考,例如:

- 一種內容哈希
- 其他 URI
- 其他 SoraFS 路徑或顯示參考
- 使用申請證明的簡約承諾

這讓我們保持 WSV 還可以證明申請是否有
在鎖外的有效負荷符合連鎖上的參考量.

## 選擇一個地方 {#choosing-a-location}

請使用以下細節:

- 如果它是帳簿對象的簡約屬性,
- 如果它具有價值或可轉移性, NFT, 或是
  該區域特定的對象.
- 如果它是大型,高率或私人應用,
  WSV 並將可驗證的參考資料放上連鎖.

請查看其他資料,
[許可令牌](/zh-hant/reference/permissions.md).
