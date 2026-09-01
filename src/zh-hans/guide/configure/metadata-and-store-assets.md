---
translation_locale: zh-hans
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 超级数据和账本存储选择 {#metadata-and-ledger-storage-choices}

Iroha 3 数据模型对于任意的关键值数据没有单独的 `Store`资产类型. 使用以下存储选项:

## 超级数据 {#metadata}

对于属于 ledger 对象的小型 JSON 字段，请使用 [metadata](/zh-hans/blockchain/metadata.md)：

- 显示名称和标签
- 集成 IDs
- 小政策旗
- URIs,CIDs 或 SoraFS 指向更大的有效载荷的路径

传输数据是世界状态的一部分,并与拥有它的对象一起返回.保持密钥稳定,值紧,权限明确.不要直接在传输数据中存储大型文件,日志或高档次应用状态.

## 数字资产和 NFTs {#numeric-assets-and-nfts}

使用 [资产](/zh-hans/blockchain/assets.md)和 [NFTs](/zh-hans/blockchain/nfts.md)当状态具有价值时:

- 函数式余额的数字资产
- NFTs 对于独有的记录
- [RWAs](/zh-hans/blockchain/rwas.md)和其他特定域的对象,当活跃数据模型暴露它们

资产和 NFTs 有自己的 IDs,生命周期事件,转让行为和许可证检查.当所有权,稀缺或转移历史问题时,它们比元数据更好.

## 链外数据 {#off-chain-data}

对于大型或可变的有效载荷,使用链外存储.仅在链上存储稳定的参考,例如:

- 一个内容哈希
- 一 URI
- 一条 SoraFS 路径或清单参考
- 通过申请证明所使用的紧密承诺

这使得 WSV 保持小,同时还允许应用程序验证连锁外的有效载荷是否符合连锁上参考.

## 选择一个地点 {#choosing-a-location}

使用这个基本规则:

- 如果它是一个大型物体的紧属性,请使用元数据.
- 如果它具有价值或可转移,则将其模型为资产, NFT,或特定域的对象.
- 如果它是大型的,高率的或私有应用程序,则将其存储在 WSV 外,并在链上放一个可验证的参考.

对于转型数据权限,请参见 [权限令牌](/zh-hans/reference/permissions.md).
