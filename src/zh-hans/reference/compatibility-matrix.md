---
translation_locale: zh-hans
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 兼容性矩阵 {#compatibility-matrix}

兼容性矩阵显示了当前 Iroha 3 文档集的跨 SDK 场景覆盖.默认情况下,该页面将从注入的 [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha)修订中生成的捆绑快照加载.

矩阵由以下组成:

- 首列的故事
- SDKs 在剩余列中
- 覆盖,失败和缺失数据的状态符号

只有通过更新工作流进行验证的结果被报道为覆盖或失败.没有证据的场景显示为缺失数据,而不是继承来自另一个源修改结果.

<CompatibilityMatrixTable />

::: info
设置 `VITE_COMPAT_MATRIX_URL` 仅用于覆盖捆绑的快照,使用兼容的现场后端.如果没有该变量,页面将加载`src/public/compat-matrix.json`.
:::
