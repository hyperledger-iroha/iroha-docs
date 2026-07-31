---
translation_locale: zh-hans
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 大数据和账本存储选项 {#metadata-and-ledger-storage-choices}

其他 Iroha 3 数据模型没有单独的 `Store` 任意的资产类型
使用以下存储选项.

## 数据表 {#metadata}

使用 [大数据](/zh-hans/blockchain/metadata.md) 适用于小型 JSON 属于的字段
在本书对象中:

- 显示名称和标签
- 集成 IDs
- 小政策旗
- 子, URIs, CIDs, 或 SoraFS 指向更大的有效载荷的路径

转换的数据是世界状态的一部分,
保持密钥稳定,值紧,权限明确.
直接存储大型文件,日志或高率的应用状态
其他数据.

## 数字资产和 NFTs {#numeric-assets-and-nfts}

使用 [资产](/zh-hans/blockchain/assets.md) 并且 [NFTs](/zh-hans/blockchain/nfts.md) 什么时候
国家具有价值:

- 复数余额的数值资产
- NFTs 对于独有的记录
- [RWAs](/zh-hans/blockchain/rwas.md) 其他特定领域的物体,
  活跃数据模型暴露它们

资产和 NFTs 有自己的 IDs, 生命周期事件,转移行为
在所有权时,它们比元数据更好.
其他国家或地区.

## 链外数据 {#off-chain-data}

对于大型或可变的有效载荷,使用无链存储.
链上参考,例如:

- 一个内容哈希
- 一个 URI
- 一个 SoraFS 路径或显而易见的参考
- 通过申请证明所使用的紧密承诺

这使得 WSV 虽然很小,但仍然允许申请验证
在链外的有效载荷与链上引用相匹配.

## 选择一个地点 {#choosing-a-location}

使用这个基本规则:

- 如果它是一个大型对象的紧属性,请使用元数据.
- 如果它具有价值或可转移性,将其作为资产的模型. NFT, 或
  域特定的对象.
- 如果它很大,高率或应用私人,
  WSV 在链上放一个可验证的参考.

对于元数据权限,见
[许可令牌](/zh-hans/reference/permissions.md).
