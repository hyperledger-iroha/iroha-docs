---
translation_locale: zh-hant
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 最好的做法 {#best-practices}

這部分收集了以生產為中心的指南, Iroha 申請方式
該組織是由你需要做出的決定而不是由
該項目的執行功能.

在分享測試網的練習之前,
或是一個主要的客戶釋放.

## 類別 {#categories}

| 類別                                                | 集中注意力                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [應用程式的發展](./application-development.md) | 客戶配置,交易提交,再試驗,事件,查詢以及代理協助的開發 |
| [數據建模](./data-modeling.md)                     | 域名,帳戶,資產, NFTs, 超級數據,連鎖之外的數據和命名協議                      |
| [網路部署](./network-deployment.md)           | 創世記,拓學,同行鍵, Torii 暴露,共識設定和環境分離           |
| [活動](./operations.md)                           | 可觀察性,執行簿,備份,變更管理,能力檢查和事件處理            |
| [安全與使用權](./security-and-access.md)         | 秘密處理,許可證,技術帳戶,網路接入和監控方式                     |
| [準備釋放](./release-readiness.md)             | 地方網路, Taira, Minamoto, 互換性檢查,實際網絡保障和反彈計劃        |

## 交叉切割規則 {#cross-cutting-rules}

- 保持本地開發,共享測試網和生產配置
  沒有任何相關資訊.
- 如何對待創世論,同行拓學,執行者政策和關鍵資料
  控制部署的文物.
- 請不要使用傳統數據作為
  對於大型,私人或高度數據的廢棄物.
- 透過無法處理的工作流程提交交易
  拒絕,過期,重新嘗試和延遲狀態.
- 喜歡狭窄的許可,專用的技術帳戶和明顯
  在廣泛的管理員接觸上,
- 首先要在一次性本地網路上證明行為,
  Taira 或在任何主網運作之前,其他共享測試網絡.

## 有關參考資料 {#related-references}

- [配置和管理](/zh-hant/guide/configure/overview.md)
- [安全性](/zh-hant/guide/security/)
- [性能與指標](/zh-hant/guide/advanced/metrics.md)
- [互換性矩陣](/zh-hant/reference/compatibility-matrix.md)
- [Torii 目的地](/zh-hant/reference/torii-endpoints.md)
- [許可令牌](/zh-hant/reference/permissions.md)
