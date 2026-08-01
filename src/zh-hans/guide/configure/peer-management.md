---
translation_locale: zh-hans
translation_source: /guide/configure/peer-management.md
translation_source_hash: f085fa1587595414f95705bbe2cd285752b0fe12cffb9ef29a33399f9a1f3f86
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 同行管理 {#peer-management}

如果您遵循了任何特定语言指南,现在你有一个功能良好的网络,人们想加入.

## 公共区块链 {#public-blockchain}

在开放网络中,同行录取仍然是链政策决定.一个节点可以运行正确的软件并连接到 Torii,但它只会参与共识之后,网络承认其同行身份.

## 私人区块链 {#private-blockchain}

在银行环境中,允许每个人都随意加入是安全风险.为了安全,私人 Iroha 部署通常将同行拓在配置和生成中固定,而不是依赖于开放的发现.

### 登记同龄人 {#registering-peers}

为了将同行添加到网络中,必须手动登记.让我们讨论应该采取的步骤来完成这个过程.

#### 1. 授予用户权限 {#_1-grant-the-user-permissions}

登记同行的账户必须具有适当的 `Permission`.这可以通过 `Role`或直接授予许可证.

给一个角色当账户将管理同龄人随着时间的推移.使用直接授权.单次注册的账户,其它帐户不管理同行.

::: info

默认执行者使用 `CanManagePeers`权限令牌进行注册和不注册的同行.

:::

我们将在 [ 单独的章节](/zh-hans/blockchain/permissions.md)中详细讨论权限和角色.

#### 2. 建立一个同龄人 {#_2-set-up-a-peer}

在新同龄人获得许可后,必须建立它.

在录取节点之前,请请求当前的同行配置. Torii 为此暴露了节点参数和功能终端点.不会自动谈判这些值:运营商必须验证时间,批量大小和其他符合共识的设置与网络相匹配.

为了简化这个过程,您可以要求网络管理员编辑`config.toml`的版本,该版本不包括像同行私钥这样的特权信息.

#### 3. 提交指示 {#_3-submit-the-instruction}

在你的同行运行后,你应该提交注册同行指令. 同行将通过握手过程开始与网络聊天.

::: tip

提交同行注册指令不会 (也不能) 立即启动新的同行程序.

:::

### 没有注册的同行 {#unregistering-peers}

由于安全原因,这个过程是单方面的.网络达成共识,它想删除一个同行,但同行本身不知道为什么没有人与它交谈.

在大多数情况下,如果您想取消同龄人注册,你想这样做,因为这是一个拜占庭的错误.只是这个同龄人"幽灵"使得网络上的恶意演员的生活更加困难.
