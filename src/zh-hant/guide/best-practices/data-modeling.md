---
translation_locale: zh-hant
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 數據建模 {#data-modeling}

該建立在所有權,轉移行為,
選取最小的連鎖
能支持審核性和決定性執行的表現.

## 域名和帳戶 {#domains-and-accounts}

- 使用域以表示行政和政策界限.
  域名是穩定的, 因為它們出現在帳戶和資產識別子中.
- 避免將單個帳戶加重並沒有相關責任.
  使用者,服務,引發器,運營商以及費用的獨立帳戶
  他們是贊助者.
- 在設定和測試中使用可行帳戶和域名識別子. Iroha
  經典解析後, 這些名字對案例敏感.
- 在名稱,域名上保持檢測和生產身份顯著分別,
  並設定檔案路徑.

請看 [域名](/zh-hant/blockchain/domains.md), [帳戶](/zh-hant/blockchain/accounts.md),
及其他 [命名](/zh-hant/reference/naming.md).

## 資產和 NFTs {#assets-and-nfts}

- 使用數值資產來表達可變的余額和可轉移量.
- 使用 NFTs 或是專屬於獨家所有權的檔案域特定對象.
- 避免只在元數據中加碼值狀態. NFTs
  提供生命周期事件,傳輸語義和許可檢查
  沒有傳輸資料.
- 定義精度,供應政策,發行人責任以及燃燒/
  在將資產暴露於申請之前,

請看 [資產](/zh-hant/blockchain/assets.md), [NFTs](/zh-hant/blockchain/nfts.md), 及其他
[RWAs](/zh-hant/blockchain/rwas.md).

## 數據表 {#metadata}

- 使用對帳簿物體的簡約屬性,例如標籤,
  集成 IDs, 政策旗,哈希, URIs, 或是以內容為主題
  參考資料.
- 保持數據密碼穩定和紀錄.
  客戶依賴他們造成移民問題.
- 不要儲存大型文件,日志,私人使用者數據或高率的資料
  直接在元數據中進行應用.
- 當元數據指向連鎖以外的資料時, 存儲可驗證的參考
  作为一個內容哈希, URI, SoraFS 路徑,顯示參考或簡約
  我們的承諾.

請看
[數據儲存及數字簿存储的選擇](/zh-hant/guide/configure/metadata-and-store-assets.md)
及其他 [數據表](/zh-hant/blockchain/metadata.md).

## 按模型的許可證 {#permissions-by-model}

- 設計的角色是關于企業運作,而不是實施
  工作或服務名稱的角色比監控更容易
  該角色以廣泛的技術能力命名.
- 適用於滿足這個最小對象的範圍許可令牌
  工作流程.
- 處理造,燃燒,同行管理,執行人許可
  變化,引發管理和高影響的元數據突變
  沒有任何許可.
- 增加暫時的明顯撤銷和轉換程序
  沒有任何許可.

請看 [許可證](/zh-hant/blockchain/permissions.md) 及其他
[許可令牌](/zh-hant/reference/permissions.md).

## 查詢形狀 {#query-shape}

- 選擇支持您的查詢的識別碼和元數據鍵
  應用程序最常需要.
- 頁面將廣泛的結果集合列出,
  沒有限制的帳號全域掃描正常行動.
- 透過帳號數據和事件重建的外鎖索引
  任何時候都在使用至關重要的應用行為.
