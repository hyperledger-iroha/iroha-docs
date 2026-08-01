---
translation_locale: zh-hant
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 最好的做法 {#best-practices}

這一節收集 Iroha 應用程序和網絡的生產指導. 它是由您需要做出的決定組織的,而不是運行它的功能.

在分享測試網絡排練,生產啓動或主要客戶發佈之前使用它作爲一個檢查列表.

## 類別 {#categories}

|類別|專注|
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [應用程序開發](./application-development.md)|客戶配置,交易提交,重新嘗試,事件,查詢和代理輔助開發|
| [數據模型](./data-modeling.md) |域名,賬戶,資產, NFTs,元數據,鏈外的數據和命名協議|
| [網絡部署](./network-deployment.md) |基因,拓學,同行密鑰, Torii 暴露,共識設置和環境分離 |
| [運營](./operations.md)|可觀察性,運行簿,備份,變化管理,能力檢查和事件處理|
| [安全與訪問](./security-and-access.md) |祕密處理,許可證,技術賬戶,網絡訪問和審計路徑|
| [釋放準備性](./release-readiness.md)|地方網, Taira, Minamoto,兼容性檢查,現場網絡保障措施和反彈計劃|

## 交叉切割規則 {#cross-cutting-rules}

- 保持本地開發,共享測試網絡和生產配置的分離.
- 處理起源,同行拓學,執行程序政策和關鍵材料作爲控制部署文物.
- 模型的持久賬本狀態是故意的.不要使用元數據作爲大型,私人或高率數據的傾倒場地.
- 通過無效的工作流程提交交易,可處理拒絕,過期,重新嘗試和延遲狀態.
- 偏好狹窄的權限,專用的技術賬戶和明確的操作運行簿,而不是寬泛的管理員訪問.
- 首先在一次性本地網絡上證明行爲,然後在任何主要網絡操作之前在 Taira 或其他共享測試網上練習.

## 相關引用 {#related-references}

- [配置和管理](/zh-hant/guide/configure/overview.md)
- [安全性](/zh-hant/guide/security/)
- [性能和指標](/zh-hant/guide/advanced/metrics.md)
- [兼容性矩陣](/zh-hant/reference/compatibility-matrix.md)
- [Torii 終點](/zh-hant/reference/torii-endpoints.md)
- [許可證代幣](/zh-hant/reference/permissions.md)
