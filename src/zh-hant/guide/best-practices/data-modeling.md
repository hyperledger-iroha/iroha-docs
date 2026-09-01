---
translation_locale: zh-hant
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 資料建模 {#data-modeling}

賬本資料應該圍繞所有權,轉移行為,許可界限和查詢模式進行模擬.選擇可以支援可審計性和確定性執行的最小的鏈上表示.

## 域名和帳戶 {#domains-and-accounts}

- 使用域名來表示管理和政策邊界. 保持域名穩定,因為它們出現在帳戶和資產識別器中.
- 避免一個單個帳戶載入不相關的責任. 使用使用者,服務,觸發器,運營商和費用贊助者的單獨帳戶.
- 在配置和測試中使用規範帳戶和域名識別符號. Iroha 名字在規範解析後對案例敏感.
- 保持測試和生產身份在名稱,域名和配置檔案路徑中明顯分別.

檢視 [域名](/zh-hant/blockchain/domains.md), [帳戶](/zh-hant/blockchain/accounts.md)和 [名稱](/zh-hant/reference/naming.md).

## 資產和 NFTs {#assets-and-nfts}

- 使用數值資產來計算可轉移的餘額和數量.
- 使用 NFTs 或特定域的物件用於獨有的記錄.
- 避免僅在後設資料中編碼承載價值的狀態。資產和 NFTs 提供後設資料所不具備的生命週期事件、轉移語意和權限檢查。
- 在將資產暴露於應用程式之前,定義準確性,供應政策,發行人責任和銷毀/鑄造許可權.

檢視 [資產](/zh-hant/blockchain/assets.md), [NFTs](/zh-hant/blockchain/nfts.md), 和 [RWAs](/zh-hant/blockchain/rwas.md).

## 超級資料 {#metadata}

- 使用大型賬本物件的緊屬性,如標籤,整合 IDs,政策標誌,雜湊, URIs 或內容地址引用的後設資料.
- 保持穩定和記錄的後設資料金鑰.在客戶依賴後更改關鍵名字會造成遷移問題.
- 不要直接儲存大型檔案,日誌,私人使用者資料或高率應用狀態在後設資料中.
- 當後設資料指向鏈外資料時,儲存可驗證的引用,例如內容雜湊, URI, SoraFS 路徑,明確參考或緊密承諾.

檢視[後設資料和賬本儲存選項](/zh-hant/guide/configure/metadata-and-store-assets.md)和 [後設資料](/zh-hant/blockchain/metadata.md).

## 根據模型的許可證 {#permissions-by-model}

- 設計角色圍繞著業務運營,而不是實施便利性.一個以工作或服務命名的角色比一個以廣泛技術能力命名的角色更容易進行審計.
- 擴充套件許可權令牌到滿足工作流程的最小物件.
- 作為高影響許可權,鑄造、銷毀,對等節點管理,執行器更改,觸發管理和後設資料突變的許可權.
- 為臨時許可權新增明確的撤銷和輪替程式。

檢視 [許可證](/zh-hant/blockchain/permissions.md)和 [許可證代幣 ](/zh-hant/reference/permissions.md).

## 查詢形狀 {#query-shape}

- 選擇支援應用程式最經常需要的查詢的識別符號和後設資料金鑰.
- 頁面化廣泛的結果集,避免使用者介面需要無限制的帳本範圍掃描正常操作.
- 每當它們用於關鍵的應用行為時,將鏈外索引從賬本資料和事件中可重建.
