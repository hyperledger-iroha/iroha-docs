---
translation_locale: zh-hant
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 超級數據和賬本存儲選擇 {#metadata-and-ledger-storage-choices}

Iroha 3 數據模型對於任意的關鍵值數據沒有單獨的 `Store`資產類型. 使用以下存儲選項:

## 超級數據 {#metadata}

使用 [大數據](/zh-hant/blockchain/metadata.md)用於屬於本書對象的小 JSON 字段:

- 顯示名稱和標籤
- 集成 IDs
- 小政策旗
- URIs,CIDs 或 SoraFS 指向更大的有效載荷的路徑

傳輸數據是世界狀態的一部分,並與擁有它的對象一起返回.保持密鑰穩定,值緊,權限明確.不要直接在傳輸數據中存儲大型文件,日誌或高檔次應用狀態.

## 數字資產和 NFTs {#numeric-assets-and-nfts}

使用 [資產](/zh-hant/blockchain/assets.md)和 [NFTs](/zh-hant/blockchain/nfts.md)當狀態具有價值時:

- 函數式餘額的數字資產
- NFTs 對於獨有的記錄
- [RWAs](/zh-hant/blockchain/rwas.md)和其他特定域的對象,當活躍數據模型暴露它們

資產和 NFTs 有自己的 IDs,生命週期事件,轉讓行爲和許可證檢查.當所有權,稀缺或轉移歷史問題時,它們比元數據更好.

## 鏈外數據 {#off-chain-data}

對於大型或可變的有效載荷,使用鏈外存儲.僅在鏈上存儲穩定的參考,例如:

- 一個內容哈希
- 一 URI
- 一條 SoraFS 路徑或表格參考
- 通過申請證明所使用的緊密承諾

這使得 WSV 保持小,同時還允許應用程序驗證連鎖外的有效載荷是否符合連鎖上參考.

## 選擇一個地點 {#choosing-a-location}

使用這個基本規則:

- 如果它是一個大型物體的緊屬性,請使用元數據.
- 如果它具有價值或可轉移,則將其模型爲資產, NFT,或特定域的對象.
- 如果它是大型的,高率的或私有應用程序,則將其存儲在 WSV 外,並在鏈上放一個可驗證的參考.

對於轉型數據權限,請參見 [權限令牌](/zh-hant/reference/permissions.md).
