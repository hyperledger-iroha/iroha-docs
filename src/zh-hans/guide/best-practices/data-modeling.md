---
translation_locale: zh-hans
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 数据建模 {#data-modeling}

账本数据应该围绕所有权,转移行为,许可界限和查询模式进行模拟.选择可以支持可审计性和确定性执行的最小的链上表示.

## 域名和账户 {#domains-and-accounts}

- 使用域名来表示管理和政策边界. 保持域名稳定,因为它们出现在帐户和资产识别器中.
- 避免一个单个帐户加载不相关的责任. 使用用户,服务,触发器,运营商和费用赞助者的单独账户.
- 在配置和测试中使用常规帐户和域名标识符. Iroha 名字在常规解析后对案例敏感.
- 保持测试和生产身份在名称,域名和配置文件路径中明显分别.

查看 [域名](/zh-hans/blockchain/domains.md), [账户](/zh-hans/blockchain/accounts.md)和 [名称](/zh-hans/reference/naming.md).

## 资产和 NFTs {#assets-and-nfts}

- 使用数值资产来计算可转移的余额和数量.
- 使用 NFTs 或特定域的对象用于独有的记录.
- 避免只在元数据中编码具有值状态. 资产和 NFTs 提供生命周期事件,转移语义和权限检查,而非元数据.
- 在将资产暴露于应用程序之前,定义准确性,供应政策,发行人责任和燃烧/薄荷权威.

查看 [资产](/zh-hans/blockchain/assets.md), [NFTs](/zh-hans/blockchain/nfts.md), 和 [RWAs](/zh-hans/blockchain/rwas.md).

## 超级数据 {#metadata}

- 使用大型账本对象的紧属性,如标签,集成 IDs,政策标志,哈希, URIs 或内容地址引用的元数据.
- 保持稳定和记录的元数据密钥.在客户依赖后更改关键名字会造成迁移问题.
- 不要直接存储大型文件,日志,私人用户数据或高率应用状态在元数据中.
- 当元数据指向链外数据时,存储可验证的引用,例如内容哈希, URI, SoraFS 路径,明确参考或紧密承诺.

查看[元数据和账本存储选项](/zh-hans/guide/configure/metadata-and-store-assets.md)和 [元数据](/zh-hans/blockchain/metadata.md).

## 根据模型的许可证 {#permissions-by-model}

- 设计角色围绕着业务运营,而不是实施便利性.一个以工作或服务命名的角色比一个以广泛技术能力命名的角色更容易进行审计.
- 扩展权限令牌到满足工作流程的最小对象.
- 作为高影响权限,应对缩,燃烧,同行管理,执行器更改,触发管理和元数据突变的权限.
- 添加暂时权限的明确撤销和转换程序.

查看 [许可证](/zh-hans/blockchain/permissions.md)和 [许可证代币 ](/zh-hans/reference/permissions.md).

## 查询形状 {#query-shape}

- 选择支持应用程序最经常需要的查询的标识符和元数据密钥.
- 页面化广泛的结果集,避免使用者界面需要无限制的本书范围扫描正常操作.
- 每当它们用于关键的应用行为时,将链外索引从账本数据和事件中可重建.
