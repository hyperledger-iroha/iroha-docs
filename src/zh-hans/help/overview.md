---
translation_locale: zh-hans
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解决问题 {#troubleshooting}

如果您在工作中遇到问题, Iroha. 如果有什么不对,请 [查看钥匙](#check-the-keys) 如果这没有帮助,请查看每个阶段的故障解决说明:

- [安装问题](./installation-issues.md)
- [配置问题](./configuration-issues.md)
- [部署问题](./deployment-issues.md)
- [集成问题](./integration-issues.md)

如果您所遇到的问题未被描述在这里,请通过 [电报](https://t.me/hyperledgeriroha)联系我们.

## 查看钥匙 {#check-the-keys}

大多数问题是由于无法匹配的密钥而产生的. 这就是为什么我们建议遵循这个规则:如果有问题,首先检查键.

这里有一个简单的解释:当同行密钥不与可信任同行数组中的密钥相匹配时,无法区分出现的错误信息.因此,如果您有通过环境变量定义的密钥的Helm图表或Kubernetes部署,在调查更高层次故障之前,请比较配置的 [`public_key`](/zh-hans/reference/peer-config/params.md#param-public-key),[`private_key`](/zh-hans/reference/peer-config/params.md#param-private-key)和 [`trusted_peers`](/zh-hans/reference/peer-config/params.md#param-trusted-peers)等值.

如果有疑问, [生成一个新的钥匙对](/zh-hans/guide/security/generating-cryptographic-keys.md).
