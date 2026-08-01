---
translation_locale: zh-hant
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 配置和管理 {#configuration-and-management}

Iroha 配置有兩個權威層:

- 在 TOML 文件中存儲並在進程啓動時讀取的本地同行和客戶端配置
- 在鏈上配置,通過 [`SetParameter`](/zh-hant/blockchain/instructions.md#setparameter)的交易改變.

使用本地配置爲節點身份,地址,登記,存儲和客戶端簽名密鑰.使用鏈上配置爲必須由網絡同意並確定性重播的值.

生產行爲必須來自這些配置層.環境變量可能是爲本地工具提供測試輸入方便的,但它們不是生產特徵門,也不取代承諾配置.

主要的配置入口點是:

- [創世紀](/zh-hant/guide/configure/genesis.md)
- [客戶端配置](/zh-hant/guide/configure/client-configuration.md)
- [網絡部署的密鑰](/zh-hant/guide/configure/keys-for-network-deployment.md)
- [在裸金屬上運行](/zh-hant/guide/advanced/running-iroha-on-bare-metal.md)
- [同行配置參考](/zh-hant/reference/peer-config/index.md)
