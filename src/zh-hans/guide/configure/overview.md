---
translation_locale: zh-hans
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 配置和管理 {#configuration-and-management}

Iroha 配置有两个权威层:

- 在 TOML 文件中存储并在进程启动时读取的本地同行和客户端配置
- 在链上配置,通过 [`SetParameter`](/zh-hans/blockchain/instructions.md#setparameter)的交易改变.

使用本地配置为节点身份,地址,登记,存储和客户端签名密钥.使用链上配置为必须由网络同意并确定性重播的值.

生产行为必须来自这些配置层.环境变量可能是为本地工具提供测试输入方便的,但它们不是生产特征门,也不取代承诺配置.

主要的配置入口点是:

- [创世纪](/zh-hans/guide/configure/genesis.md)
- [客户端配置](/zh-hans/guide/configure/client-configuration.md)
- [网络部署的密钥](/zh-hans/guide/configure/keys-for-network-deployment.md)
- [在裸金属上运行](/zh-hans/guide/advanced/running-iroha-on-bare-metal.md)
- [同行配置参考](/zh-hans/reference/peer-config/index.md)
