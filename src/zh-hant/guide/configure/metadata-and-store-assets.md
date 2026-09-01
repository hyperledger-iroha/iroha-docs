---
translation_locale: zh-hant
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 超級資料和賬本儲存選擇 {#metadata-and-ledger-storage-choices}

Iroha 3 資料模型對於任意的關鍵值資料沒有單獨的 `Store`資產型別. 使用以下儲存選項:

## 超級資料 {#metadata}

對屬於 ledger 物件的小型 JSON 欄位，請使用 [metadata](/zh-hant/blockchain/metadata.md)：

- 顯示名稱和標籤
- 整合 IDs
- 小政策旗
- URIs,CIDs 或 SoraFS 指向更大的有效載荷的路徑

傳輸資料是世界狀態的一部分,並與擁有它的物件一起返回.保持金鑰穩定,值緊,許可權明確.不要直接在傳輸資料中儲存大型檔案,日誌或高檔次應用狀態.

## 數字資產和 NFTs {#numeric-assets-and-nfts}

使用 [資產](/zh-hant/blockchain/assets.md)和 [NFTs](/zh-hant/blockchain/nfts.md)當狀態具有價值時:

- 函式式餘額的數字資產
- NFTs 對於獨有的記錄
- [RWAs](/zh-hant/blockchain/rwas.md)和其他特定域的物件,當活躍資料模型暴露它們

資產和 NFTs 有自己的 IDs,生命週期事件,轉讓行為和許可證檢查.當所有權,稀缺或轉移歷史問題時,它們比後設資料更好.

## 鏈外資料 {#off-chain-data}

對於大型或可變的有效載荷,使用鏈外儲存.僅在鏈上儲存穩定的參考,例如:

- 一個內容雜湊
- 一 URI
- 一條 SoraFS 路徑或清單參考
- 透過申請證明所使用的緊密承諾

這使得 WSV 保持小,同時還允許應用程式驗證連鎖外的有效載荷是否符合連鎖上參考.

## 選擇一個地點 {#choosing-a-location}

使用這個基本規則:

- 如果它是一個大型物體的緊屬性,請使用後設資料.
- 如果它具有價值或可轉移,則將其模型為資產, NFT,或特定域的物件.
- 如果它是大型的,高率的或私有應用程式,則將其儲存在 WSV 外,並在鏈上放一個可驗證的參考.

對於轉型資料許可權,請參見 [許可權令牌](/zh-hant/reference/permissions.md).
