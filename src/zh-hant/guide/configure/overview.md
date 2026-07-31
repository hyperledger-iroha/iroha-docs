---
translation_locale: zh-hant
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 配置和管理 {#configuration-and-management}

Iroha 配置有兩層權威:

- **在本地同行和客戶端配置**, 存放在 TOML 文件和閱讀在
  過程啟動
- **在連鎖上配置**, 通過交易改變
  [`SetParameter`](/zh-hant/blockchain/instructions.md#setparameter)

使用本地配置來提供結號身份,地址,登記,存儲和
使用連鎖配置,必須同意的值
透過網路進行決定性播放.

必須從這些配置層來出發.
變量可能是供應測試輸入的方便,
他們不是生產特點門,並不取代已承諾的
這樣的裝置.

主要的配置入口點是:

- [創世記](/zh-hant/guide/configure/genesis.md)
- [客戶端配置](/zh-hant/guide/configure/client-configuration.md)
- [網路部署的關鍵](/zh-hant/guide/configure/keys-for-network-deployment.md)
- [在裸體金屬上運行](/zh-hant/guide/advanced/running-iroha-on-bare-metal.md)
- [同級配置參考](/zh-hant/reference/peer-config/index.md)
