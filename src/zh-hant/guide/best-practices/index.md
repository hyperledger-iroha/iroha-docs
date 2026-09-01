---
translation_locale: zh-hant
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 最好的做法 {#best-practices}

這一節收集 Iroha 應用程式和網路的生產指導. 它是由您需要做出的決定組織的,而不是執行它的功能.

在分享測試網路排練,生產啟動或主要客戶釋出之前使用它作為一個檢查列表.

## 類別 {#categories}

|類別|專注|
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [應用程式開發](./application-development.md)|客戶配置,交易提交,重新嘗試,事件,查詢和代理輔助開發|
| [資料模型](./data-modeling.md) |域名,帳戶,資產, NFTs,後設資料,鏈外的資料和命名協議|
| [網路部署](./network-deployment.md) |創世,拓撲,對等節點金鑰, Torii 暴露,共識設定和環境分離 |
| [運營](./operations.md)|可觀察性,執行簿,備份,變化管理,能力檢查和事件處理|
| [安全與訪問](./security-and-access.md) |秘密處理,許可證,技術帳戶,網路訪問和審計路徑|
| [釋放準備性](./release-readiness.md)|地方網, Taira, Minamoto,相容性檢查,現場網路保障措施和反彈計劃|

## 交叉切割規則 {#cross-cutting-rules}

- 保持本地開發,共享測試網路和生產配置的分離.
- 處理起源,對等節點拓撲,執行程式政策和金鑰材料作為控制部署構件.
- 模型的持久賬本狀態是故意的.不要使用後設資料作為大型,私人或高率資料的傾倒場地.
- 透過冪等工作流程提交交易,可處理拒絕,過期,重新嘗試和延遲狀態.
- 偏好狹窄的許可權,專用的技術帳戶和明確的操作執行簿,而不是寬泛的管理員訪問.
- 首先在一次性本地網路上證明行為,然後在任何主要網路操作之前在 Taira 或其他共享測試網上練習.

## 相關引用 {#related-references}

- [配置和管理](/zh-hant/guide/configure/overview.md)
- [安全性](/zh-hant/guide/security/)
- [效能和指標](/zh-hant/guide/advanced/metrics.md)
- [相容性矩陣](/zh-hant/reference/compatibility-matrix.md)
- [Torii 端點](/zh-hant/reference/torii-endpoints.md)
- [許可證代幣](/zh-hant/reference/permissions.md)
