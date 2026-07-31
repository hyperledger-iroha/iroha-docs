---
translation_locale: zh-hans
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 兼容性矩阵 {#compatibility-matrix}

兼容性矩阵显示了 SDK 目前的情况覆盖
Iroha 3 文件设置.默认情况下,页面会加载生成的捆绑快照
从被住的 [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha)
修订

矩阵由:

- **故事** 在第一个列中
- **SDKs** 在剩余的列中
- **状态符号** 已覆盖的,失败的和缺失的数据

只有通过更新工作流程验证的结果被报道为覆盖或
没有证据的场景显示为
缺失数据,而不是继承另一项来源修改的结果.

<CompatibilityMatrixTable />

::: info
设置 `VITE_COMPAT_MATRIX_URL` 只是用一个
没有那个变量,页面会加载
`src/public/compat-matrix.json`.
:::
