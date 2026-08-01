---
translation_locale: zh-hans
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 最好的做法 {#best-practices}

这一节收集 Iroha 应用程序和网络的生产指导. 它是由您需要做出的决定组织的,而不是运行它的功能.

在分享测试网络排练,生产启动或主要客户发布之前使用它作为一个检查列表.

## 类别 {#categories}

|类别|专注|
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [应用程序开发](./application-development.md)|客户配置,交易提交,重新尝试,事件,查询和代理辅助开发|
| [数据模型](./data-modeling.md) |域名,账户,资产, NFTs,元数据,链外的数据和命名协议|
| [网络部署](./network-deployment.md) |基因,拓学,同行密钥, Torii 暴露,共识设置和环境分离 |
| [运营](./operations.md)|可观察性,运行簿,备份,变化管理,能力检查和事件处理|
| [安全与访问](./security-and-access.md) |秘密处理,许可证,技术账户,网络访问和审计路径|
| [释放准备性](./release-readiness.md)|地方网, Taira, Minamoto,兼容性检查,现场网络保障措施和反弹计划|

## 交叉切割规则 {#cross-cutting-rules}

- 保持本地开发,共享测试网络和生产配置的分离.
- 处理起源,同行拓学,执行程序政策和关键材料作为控制部署文物.
- 模型的持久账本状态是故意的.不要使用元数据作为大型,私人或高率数据的倾倒场地.
- 通过无效的工作流程提交交易,可处理拒绝,过期,重新尝试和延迟状态.
- 偏好狭窄的权限,专用的技术账户和明确的操作运行簿,而不是宽泛的管理员访问.
- 首先在一次性本地网络上证明行为,然后在任何主要网络操作之前在 Taira 或其他共享测试网上练习.

## 相关引用 {#related-references}

- [配置和管理](/zh-hans/guide/configure/overview.md)
- [安全性](/zh-hans/guide/security/)
- [性能和指标](/zh-hans/guide/advanced/metrics.md)
- [兼容性矩阵](/zh-hans/reference/compatibility-matrix.md)
- [Torii 终点](/zh-hans/reference/torii-endpoints.md)
- [许可证代币](/zh-hans/reference/permissions.md)
