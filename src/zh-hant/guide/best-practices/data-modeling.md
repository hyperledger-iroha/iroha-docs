---
translation_locale: zh-hant
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 數據建模 {#data-modeling}

賬本數據應該圍繞所有權,轉移行爲,許可界限和查詢模式進行模擬.選擇可以支持可審計性和確定性執行的最小的鏈上表示.

## 域名和賬戶 {#domains-and-accounts}

- 使用域名來表示管理和政策邊界. 保持域名穩定,因爲它們出現在帳戶和資產識別器中.
- 避免一個單個帳戶加載不相關的責任. 使用用戶,服務,觸發器,運營商和費用贊助者的單獨賬戶.
- 在配置和測試中使用常規帳戶和域名標識符. Iroha 名字在常規解析後對案例敏感.
- 保持測試和生產身份在名稱,域名和配置文件路徑中明顯分別.

查看 [域名](/zh-hant/blockchain/domains.md), [賬戶](/zh-hant/blockchain/accounts.md)和 [名稱](/zh-hant/reference/naming.md).

## 資產和 NFTs {#assets-and-nfts}

- 使用數值資產來計算可轉移的餘額和數量.
- 使用 NFTs 或特定域的對象用於獨有的記錄.
- 避免只在元數據中編碼具有值狀態. 資產和 NFTs 提供生命週期事件,轉移語義和權限檢查,而非元數據.
- 在將資產暴露於應用程序之前,定義準確性,供應政策,發行人責任和燃燒/薄荷權威.

查看 [資產](/zh-hant/blockchain/assets.md), [NFTs](/zh-hant/blockchain/nfts.md), 和 [RWAs](/zh-hant/blockchain/rwas.md).

## 超級數據 {#metadata}

- 使用大型賬本對象的緊屬性,如標籤,集成 IDs,政策標誌,哈希, URIs 或內容地址引用的元數據.
- 保持穩定和記錄的元數據密鑰.在客戶依賴後更改關鍵名字會造成遷移問題.
- 不要直接存儲大型文件,日誌,私人用戶數據或高率應用狀態在元數據中.
- 當元數據指向鏈外數據時,存儲可驗證的引用,例如內容哈希, URI, SoraFS 路徑,明確參考或緊密承諾.

查看[元數據和賬本存儲選項](/zh-hant/guide/configure/metadata-and-store-assets.md)和 [元數據](/zh-hant/blockchain/metadata.md).

## 根據模型的許可證 {#permissions-by-model}

- 設計角色圍繞着業務運營,而不是實施便利性.一個以工作或服務命名的角色比一個以廣泛技術能力命名的角色更容易進行審計.
- 擴展權限令牌到滿足工作流程的最小對象.
- 作爲高影響權限,應對縮,燃燒,同行管理,執行器更改,觸發管理和元數據突變的權限.
- 添加暫時權限的明確撤銷和轉換程序.

查看 [許可證](/zh-hant/blockchain/permissions.md)和 [許可證代幣 ](/zh-hant/reference/permissions.md).

## 查詢形狀 {#query-shape}

- 選擇支持應用程序最經常需要的查詢的標識符和元數據密鑰.
- 頁面化廣泛的結果集,避免使用者界面需要無限制的本書範圍掃描正常操作.
- 每當它們用於關鍵的應用行爲時,將鏈外索引從賬本數據和事件中可重建.
