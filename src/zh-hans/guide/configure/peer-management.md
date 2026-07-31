---
translation_locale: zh-hans
translation_source: /guide/configure/peer-management.md
translation_source_hash: 4e48c937ca973319cd060876b123ff405d27d9d8bc11818e608d821295412c77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 同行管理 {#peer-management}

如果您遵循任何特定语言指南,
人们希望加入一个功能良好的网络.

## 公共区块链 {#public-blockchain}

在一个开放的网络中,同行录取仍然是链路政策决定.
可以运行正确的软件,并连接到 Torii, 但它只会参与
在网络承认其同行身份后,

## 私人区块链 {#private-blockchain}

在银行环境中,允许每个人都随意加入是安全的.
为了安全,私人 Iroha 部署通常将同行拓插入
而不是依赖于开放的发现.

### 注册同龄人 {#registering-peers}

为了将一个同行添加到网络中,它必须手动注册.
为完成这一过程所需的步骤.

#### 1. 授予用户许可 {#_1-grant-the-user-permissions}

登记同行的账户必须有适当的 `Permission`.
这可通过 `Role` 或是直接授予许可.

如何决定是否需要授予角色?
用户是作为某种管理员,
长期维护网络中的同行.
允许授予是有用的,当注册同行的当事人没有
总体而言,负责登记同行,但网络管理员
不需要 (或不想) 花时间建立一个新的同行.

::: info

默认执行器使用 `CanManagePeers` 许可证代码
注册和不注册的同龄人.

:::

We 详细讨论权限和角色
[单独的章节](/zh-hans/blockchain/permissions.md).

#### 2. 建立一个同龄人 {#_2-set-up-a-peer}

在新同龄人获得许可后,必须建立它.

在录取节点之前,请要求当前的同行配置. Torii 曝光
为此目的的节点参数和功能终端点.
不自动谈判这些值:运营商必须验证此次截止,
批量大小和其他与共识相关的设置符合网络.

为了简化这个过程,你可以要求网络管理员
编辑版 `config.toml`, 排除特权信息,
例如同行私钥.

#### 3. 提交指示 {#_3-submit-the-instruction}

_之后_ 你的同龄人正在运行,你应该提交 _登记同行_
同龄人将通过握手过程开始
在网络上聊天.

::: tip

提交同行注册指令 **没有** (而且不能)
实时一 _新的同行流程_.

:::

### 没有注册的同龄人 {#unregistering-peers}

由于安全原因,
网络达成一致,希望删除一个同行.
但同龄人自己不知道为什么没有人和他交谈.

在大多数情况下,如果你想取消同龄人注册,你需要这样做
因为这是一个拜占庭的错误.
在网络上的恶意演员更难.
