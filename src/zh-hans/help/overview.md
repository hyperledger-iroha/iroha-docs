---
translation_locale: zh-hans
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解决问题 {#troubleshooting}

本节是为了帮助您在工作时遇到问题
Iroha. 如果有问题,请 [检查钥匙](#check-the-keys)
如果这没有帮助,请查看解决问题说明
每个阶段:

- [安装问题](./installation-issues.md)
- [配置问题](./configuration-issues.md)
- [部署问题](./deployment-issues.md)
- [整合问题](./integration-issues.md)

如果您所遇到的问题没有在这里描述,请通过
[电报](https://t.me/hyperledgeriroha).

## 检查钥匙 {#check-the-keys}

由于无与伦比的密钥,大多数问题都会出现.
遵守这一规则: **如果有问题,请检查钥匙.
首先**.

这是一个简单的解释:无法区分错误
当同行密钥不匹配对阵列中的密钥时出现的信息
因为它会揭露同龄人的公钥.
具有通过环境定义的密钥的头盔图表或Kubernetes部署
变量,比较配置的
[`public_key`](/zh-hans/reference/peer-config/params.md#param-public-key),
[`private_key`](/zh-hans/reference/peer-config/params.md#param-private-key), 并且
[`trusted_peers`](/zh-hans/reference/peer-config/params.md#param-trusted-peers)
在调查更高层次故障之前的值.

如果有疑问, [生成一个新的钥匙](/zh-hans/guide/security/generating-cryptographic-keys.md).
