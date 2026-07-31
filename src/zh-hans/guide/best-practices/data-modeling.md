---
translation_locale: zh-hans
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 数据建模 {#data-modeling}

账本数据应该基于所有权,转移行为
选择最小的链接
能够支持可审计性和确定性执行的代表性.

## 域名和账户 {#domains-and-accounts}

- 使用域以表示行政和政策边界.
  域名是稳定的,因为它们出现在账户和资产标识符中.
- 避免一个单个账户上加载不相关的责任.
  用户,服务,触发器,运营商和费用的单独账户
  赞助商.
- 在配置和测试中使用常规帐户和域名标识符. Iroha
  根据法典分析,这些名字对案例敏感.
- 保持测试和生产身份在名称,域名上明显分别,
  和配置文件路径.

看看 [域名](/zh-hans/blockchain/domains.md), [账户](/zh-hans/blockchain/accounts.md),
并且 [命名](/zh-hans/reference/naming.md).

## 资产和 NFTs {#assets-and-nfts}

- 用数值资产来计算可转移的余额和数量.
- 使用 NFTs 或是专有所有记录的域名特定对象.
- 避免只在元数据中编码具有价值的状态. NFTs
  提供生命周期事件,传输语义和许可证检查
  没有转移数据.
- 定义精度,供应政策,发行人责任以及燃烧/薄荷
  在向申请暴露资产之前,授权.

看看 [资产](/zh-hans/blockchain/assets.md), [NFTs](/zh-hans/blockchain/nfts.md), 并且
[RWAs](/zh-hans/blockchain/rwas.md).

## 数据表 {#metadata}

- 使用大型账本对象的紧属性,如标签,
  集成 IDs, 政策标志,哈希 URIs, 或是内容的地址
  引用
- 保持稳定和记录的元数据密钥.
  客户依赖他们,造成移民问题.
- 不要存储大型文件,日志,私人用户数据或高率的数据
  应用状态直接在元数据中.
- 当元数据指向链外数据时,存储可验证的引用
  作为一个内容哈希, URI, SoraFS 路径,显而易见的参考或紧
  承诺.

看看
[大数据和账本存储选项](/zh-hans/guide/configure/metadata-and-store-assets.md)
并且 [数据表](/zh-hans/blockchain/metadata.md).

## 根据模型的许可证 {#permissions-by-model}

- 设计角色围绕企业运营而不是实施
  一个职位以工作或服务的名字命名,比审核更容易
  一个以广泛技术能力命名的角色.
- 适用于最大的对象.
  工作流程.
- 处理造,燃烧,同行管理,执行者许可证
  变化,触发器管理和高影响性的元数据突变
  许可证.
- 添加暂时的明确撤销和轮换程序
  许可证.

看看 [许可证](/zh-hans/blockchain/permissions.md) 并且
[许可令牌](/zh-hans/reference/permissions.md).

## 查询形状 {#query-shape}

- 选择支持您的查询的标识符和元数据键
  最常见的应用程序.
- 页面化广泛的结果集,避免需要用户界面
  在本书范围内进行无限制的正常操作扫描.
- 从本书数据和事件中可重建的链外指数
  它们在关键应用行为中使用时.
