---
translation_locale: zh-hans
translation_source: /guide/security/index.md
translation_source_hash: ec7fc2f950b007f52d837473ad7021565923e537df1d18b86055fb483cda375c
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 安全 {#security}

确保一个 Iroha 的部署,就像处理敏感数据和价值的任何系统一样.保护签名密钥,网络访问,节点操作,监测和事件响应. 一份账本并不能消除这些控制的必要性.

### 航行 {#navigation}

在本节,您可以了解保护 Iroha 网络的各个方面. 为了了解更多,请选择以下话题之一:

- [安全原则](./security-principles):

保护数据和降低违规风险的核心原则.

- [虚拟私人网络](./vpn.md):

如何使用 VPN 来限制对等节点到对等节点, Torii,以及运营商在私人或联盟部署中的访问.

- [运营安全](./operational-security.md):

访问,监控,应对事件和操作员工作站的日常控制.

- [欺诈监测](./fraud-monitoring.md):

如何使用账本事件,查询,权限和运营信号来检测可疑活动并保存响应证据.

- [密码安全](./password-security.md):

密码熵、强密码构建方式和常见失败模式。

- [公钥密码](./public-key-cryptography.md):

公共密钥加密,签名和认证通信.

  - [生成加密钥](./generating-cryptographic-keys.md):

通过 `kagami`生成支持的加密钥.

  - [存储密码密钥](./storing-cryptographic-keys.md):

存储加密密钥,使用适合部署的层级控制.
