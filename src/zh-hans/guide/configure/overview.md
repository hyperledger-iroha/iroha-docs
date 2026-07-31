---
translation_locale: zh-hans
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 配置和管理 {#configuration-and-management}

Iroha 配置有两个权威层:

- **在本地同行和客户端配置**, 存储在 TOML 文件和阅读
  进程启动
- **连锁配置**, 通过交易改变
  [`SetParameter`](/zh-hans/blockchain/instructions.md#setparameter)

使用本地配置来识别节点,地址,记录,存储和
使用在链上配置的值必须达成一致
通过网络进行决定性播放.

必须来自这些配置层.
测试输入可能是方便的,但
它们不是生产特征门,也不取代承诺
配置.

主要的配置入口点是:

- [创世纪](/zh-hans/guide/configure/genesis.md)
- [客户端配置](/zh-hans/guide/configure/client-configuration.md)
- [网络部署的关键](/zh-hans/guide/configure/keys-for-network-deployment.md)
- [运行在裸体金属上](/zh-hans/guide/advanced/running-iroha-on-bare-metal.md)
- [同行配置参考](/zh-hans/reference/peer-config/index.md)
