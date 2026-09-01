---
translation_locale: zh-hant
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 配置和管理 {#configuration-and-management}

Iroha 配置有兩個權威層:

- 在 TOML 檔案中儲存並在程序啟動時讀取的本地對等節點和客戶端配置
- 在鏈上配置,透過 [`SetParameter`](/zh-hant/blockchain/instructions.md#setparameter)的交易改變.

使用本地配置為節點身份,地址,登記,儲存和客戶端簽名金鑰.使用鏈上配置為必須由網路同意並確定性重播的值.

正式環境的行為必須來自這些設定層。環境變數可以方便地向本機工具提供測試輸入，但它們不是正式環境的功能閘，也不能取代已提交的設定。

主要的配置入口點是:

- [創世紀](/zh-hant/guide/configure/genesis.md)
- [客戶端配置](/zh-hant/guide/configure/client-configuration.md)
- [網路部署的金鑰](/zh-hant/guide/configure/keys-for-network-deployment.md)
- [在裸金屬上執行](/zh-hant/guide/advanced/running-iroha-on-bare-metal.md)
- [對等節點配置參考](/zh-hant/reference/peer-config/index.md)
