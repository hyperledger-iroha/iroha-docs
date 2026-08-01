---
translation_locale: zh-hans
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: 3d317c00e75525d70f6cb9ef7f8eeec6911e2f124af8052cd2fc719b264d43f9
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 公钥密码学 {#public-key-cryptography}

公钥密码学使用相互关联的公钥和私钥。公钥可以共享；私钥必须始终由相应权限主体控制。安全性取决于使用受支持的算法、通过安全随机源生成密钥以及妥善保护私钥。

## 数字签名 {#digital-signatures}

签名方使用私钥创建数字签名，验证方使用对应的公钥验证该签名。

有效签名表明被签名的字节没有被更改，并且私钥持有者批准了这些字节。签名本身不能识别某个人；身份取决于公钥或账户控制器是如何注册和治理的。

签名提供完整性和授权证据，但不会加密被签名的内容。

## 公钥加密 {#public-key-encryption}

某些公钥方案使用接收方的公钥加密数据，接收方再用对应的私钥解密这些数据。加密和签名是不同的操作，可能使用不同的密钥或算法。

Iroha 交易签名不会使公开账本中的数据具备机密性。有效载荷内容需要保密时，应使用部署批准的保密机制。

## 客户端密钥 {#keys-on-the-client-side}

每笔交易都必须满足已配置的账户控制器策略。简单账户可以使用单个签名密钥；受治理的账户可以使用更复杂的控制器策略。

客户端软件必须保护私钥和其他控制器材料。明文客户端配置只适用于本地开发和受控测试。生产集成应使用秘密管理器、硬件支持的密钥存储、隔离签名服务或其他经过审计的签名边界。

不同环境和用途应使用不同密钥。重复使用同一个密钥会将这些用途关联起来，并扩大密钥暴露的影响。

请参阅[生成加密密钥](./generating-cryptographic-keys.md)、[存储加密密钥](./storing-cryptographic-keys.md)和[运营安全](./operational-security.md)。
