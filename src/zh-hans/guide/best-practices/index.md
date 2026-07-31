---
translation_locale: zh-hans
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 最好的做法 {#best-practices}

本节收集了以生产为导向的指南 Iroha 申请
它是由你需要做出的决定组织的,而不是由
实际上,它是一个应用程序.

在分享的测试网排练之前,
发射或主要的客户释放.

## 类别 {#categories}

| 类别                                                | 专注                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [应用开发](./application-development.md) | 客户配置,提交交易,重新尝试,事件,查询和代理辅助开发 |
| [数据建模](./data-modeling.md)                     | 域名,账户,资产 NFTs, 超级数据,链外数据和命名公约                      |
| [网络部署](./network-deployment.md)           | 创世纪,拓学,同行键, Torii 暴露,共识设置和环境分离           |
| [运营](./operations.md)                           | 观察性,运行簿,备份,变化管理,能力检查和事件处理            |
| [安全与获取](./security-and-access.md)         | 秘密处理,许可证,技术账户,网络访问和审计途径                     |
| [准备释放](./release-readiness.md)             | 地方网, Taira, Minamoto, 兼容性检查,现场网络保障和反弹计划        |

## 交叉切割规则 {#cross-cutting-rules}

- 保持本地开发,共享测试网络和生产配置
  它们是单独的.
- 处理基因,同行拓学,执行策略和关键材料
  控制部署的文物.
- 无需使用元数据作为一个
  对大型,私人或高度数据的倾销场所.
- 通过可以处理的无效工作流程提交交易
  拒绝,过期,重新尝试和延迟状态.
- 优先使用狭窄的权限,专用技术账户和明确的
  操作运行库在广泛的管理员访问上.
- 在一次性本地网络上先证明行为,然后在
  Taira 在任何主网运行之前,或其他共享测试网络.

## 相关引用 {#related-references}

- [配置和管理](/zh-hans/guide/configure/overview.md)
- [安全](/zh-hans/guide/security/)
- [绩效和指标](/zh-hans/guide/advanced/metrics.md)
- [兼容性矩阵](/zh-hans/reference/compatibility-matrix.md)
- [Torii 终点](/zh-hans/reference/torii-endpoints.md)
- [许可令牌](/zh-hans/reference/permissions.md)
