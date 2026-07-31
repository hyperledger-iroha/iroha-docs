---
translation_locale: zh-hans
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 特别指示 {#iroha-special-instructions}

当我们谈到 [如何 Iroha 运营](/zh-hans/blockchain/iroha-explained), 我们
他说 Iroha 特殊指令是改变世界的唯一方法
如果您已经阅读了这篇文章,那么我们有哪些特殊指示?
在本教程中,你已经看过几个
指令: `Register<Account>` 并且 `Mint<Numeric>`.

这里是全部的列表. Iroha 特别指示:

| 指示                                               | 描述                                     |
| --------------------------------------------------------- | ------------------------------------------------ |
| [注册/撤销注册](#un-register)                       | 给一个 ID 在区块链上的新实体    |
| [薄荷/燃烧](#mint-burn)                                   | 硬币/烧数字资产或触发重复. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | 更新区块链对象元数据.               |
| [SetParameter](#setparameter)                             | 设置链接宽度参数.                      |
| [补贴/撤销](#grant-revoke)                             | 给予或删除权限和角色.            |
| [转移](#transfer)                                     | 转移所有权或资产价值.               |
| [产业保证金和资产锁定](#native-escrow-and-asset-locks) | 锁定数字资产在协议监护.     |
| [ExecuteTrigger](#executetrigger)                         | 执行触发器.                                |
| [登录/定制/升级](#other-instructions)                 | 记录,延长或升级运行时间行为.        |

让我们从一个总结开始 Iroha 特殊指令;每项目的目标
可以要求指令,以及每一个人有哪些指令
标题.

## 总结 {#summary}

对于每个指令,有一个对象列表,
例如,转移变量覆盖可拥有账本对象
计数资产和数字资产,而计分包括数字资产和触发器
复制.

一些指令要求指定目的地.
你转移资产,你总是需要指定你的账户
另一方面,当你注册某件事时,
你需要的只是你想要注册的物体.

| 指示                                               | 物体                                                                                                 | 目的地          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               | 通常域名,数据空间-alias和帐户-alias设置                                                 |                      |
| [注册/撤销注册](#un-register)                       | 账户,资产定义 NFTs, 角色,触发器,同行;域删除                                |                      |
| [薄荷/燃烧](#mint-burn)                                   | 数字资产,触发重复                                                                     | 账户或触发器 |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | 具有 [数据](./metadata.md): 域名,账户,资产定义 NFTs, RWAs, 触发器 |                      |
| [SetParameter](#setparameter)                             | 连锁参数                                                                                        |                      |
| [补贴/撤销](#grant-revoke)                             | [角色,许可证](/zh-hans/blockchain/permissions.md)                                                  | 账户或角色    |
| [转移](#transfer)                                     | 域名,资产定义,数值资产 NFTs                                                        | 账户             |
| [产业保证金和资产锁定](#native-escrow-and-asset-locks) | 数字资产保证,资产锁定,匿名保证承诺                                    | 购买者,目的地或争端分歧 |
| [ExecuteTrigger](#executetrigger)                         | 触发器                                                                                                |                      |
| [登录/定制/升级](#other-instructions)                 | 记录,执行器特定的有效载荷,执行器升级                                                     |                      |

还有另一种看法. ISI, 在账本对象方面
它们触摸:

| 目标           | 指示                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| 账户          | 注册/撤销账户,收到资产,更新帐户元数据,授予/撤销许可和角色    |
| 域名           | 确保域名设置,取消域名注册,转移域名所有权,更新域名元数据                    |
| 资产定义 | 注册/退出注册的定义,转让所有权,更新元数据                                         |
| 资产            | /燃烧数量,转移数量                                                        |
| 存款           | 开放,接受,标记发送的支付,释放,取消,纠纷,解决,撤销或过期原生托管记录 |
| NFT              | 注册/退出注册 NFTs, 转移所有权,更新元数据                                                |
| RWA              | 注册批量,转移数量,保留/释放,结/解凍,收购,合并,更新元数据和控制 |
| 触发器          | 登记/取消登记,硬币/燃烧触发器重复,执行触发器,更新触发器元数据                 |
| 世界            | 注册/退出注册同行和角色,设置参数,升级执行器                                    |

## CLI 举例 {#cli-examples}

本页面中的例子假设您正在从上游运行命令
Iroha 与默认本地客户端配置的工作空间:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

如果您安装了 `iroha` 二进制,使用
`iroha --config ./defaults/client.toml` 换取位者.
以下是您的网络值:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

当针对公众时 Taira 测试网,使用一个 Taira 客户端配置.
在运行付费的例子之前,保存水龙头辅助器
[获取测试网 XOR 在 Taira](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
作为 `taira_faucet_claim.py`, 然后索赔测试网 XOR 从水龙头:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

在水源资产可见之后,将所需的气体资产附加
记录交易的元数据:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` 是创建域名的普通首次发布路径,
他们的 SNS 它声明地绑定数据空间,所有者,租
然后在原子上创建或修复所有所需的状态.
使用身份验证 `POST /v1/aliases/setup/plan` 终点或匹配
CLI 工作流程:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

意图和计划是无秘密的,但应用步骤标签
一个计划与其配置账户的普通交易.
连锁,权威,现实状态和截止日期;永远不要重复使用
网络.

## (非) 登记 {#un-register}

登记和退出登记是指令 ID 在 a
在区块链上的新实体.

任何可以注册的东西都是 `Registrable` 并且 `Identifiable`,
但不是所有的东西 `Identifiable` 是 `Registrable`. 大多数东西都是
直接注册,但在某些情况下
由于安全性和性能原因,
为此类数据结构的构建者 (例如: `NewAccount`),和同行
登记有专门的拥有证明说明.
任何可以注册的东西也可以被不注册,但这不是
一个严格而快速的规则.

你可以注册账户,资产定义, NFTs, 同龄人,角色和
域名设置使用 `EnsureAlias`; 原料 `Register::Domain` 有效载荷
专用于基因/bootstrap. 同行注册用途
`RegisterPeerWithPop`, 检查我们的密钥.
[命名会议](/zh-hans/reference/naming.md) 了解这些限制
在实体名字上.

RWA 通过专门的 `RegisterRwa` 其他国家,
目前的代码不暴露 `UnregisterRwa` 教训;使用
`RedeemRwa` 退休代表数量.

::: info

请注意,取决于您如何设置
[基因区块](/zh-hans/guide/configure/genesis.md) 在 `genesis.json`
(具体来说,您是否包括注册许可
登记账户的过程可能非常不同.
总理,我们可以这样概括:

- 在一个 _公众_ 区块链,任何人都可以注册账户.
- 在一个 _个人_ 区块链可以有一个独特的注册过程
  在一个 _典型的_ 个人区块链,即没有区块链
  任何单独的账户注册流程,你需要一个帐户
  登记另一个账户.

我们将这些区别详细讨论,
[比较私人和公共区块链](/zh-hans/guide/configure/modes.md).

:::

::: info

目前,注册同行是添加没有同行的唯一方式
在网络上设置的原始可靠同行的一部分.

:::

Refer 通过语言指导方针,
在区块链中注册对象的过程:

| 语言              | 指南                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   | 使用 [Iroha CLI](/zh-hans/get-started/operate-iroha-via-cli.md) 建立域名和注册账户和资产. |
| Rust                  | 使用 [Rust 教程](/zh-hans/guide/tutorials/rust.md).                                                      |
| Kotlin/Java           | 使用 [Kotlin/Java教程](/zh-hans/guide/tutorials/kotlin-java.md).                                        |
| Python                | 使用 [Python 教程](/zh-hans/guide/tutorials/python.md).                                                  |
| JavaScript/TypeScript | 使用 [JavaScript/TypeScript 教程](/zh-hans/guide/tutorials/javascript.md).                               |

规划和应用普通域设置,然后在没有域的情况下取消注册
需要更长时间:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

注册和退出注册账户:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

注册和退出注册的资产定义:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

登记和退出登记 NFTs. NFT 注册读取其内容 JSON 在
标准输入:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

注册和退出注册的角色:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

注册和退出注册的触发器.
编译 IVM 字节代码或串行指令列表.
一个 `Log` 通过 CLI 然后将其输入到触发器注册中:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

注册和退出注册同龄人. BLS 关键和 PoP 在 `kagami`
如果您还没有:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## 薄荷/燃烧 {#mint-burn}

造和燃烧可以指数值资产和触发器
一些资产可以被申报为不可使用,即
在注册后,只能一次造.

资产被注入一个特定的账户,通常是注册的帐户
资产数量是非负的,所以你可以
没有. `$-1.0` 现在,我们需要一个资产或消耗负值的资金.

参考一个特定语言的指南,
在区块链中挖掘资产的过程:

- [CLI](/zh-hans/get-started/operate-iroha-via-cli.md)
- [Rust](/zh-hans/guide/tutorials/rust.md)
- [Kotlin/Java](/zh-hans/guide/tutorials/kotlin-java.md)
- [Python](/zh-hans/guide/tutorials/python.md)
- [JavaScript/TypeScript](/zh-hans/guide/tutorials/javascript.md)

以下是燃烧资产的例子:

- [CLI](/zh-hans/get-started/operate-iroha-via-cli.md)
- [Rust](/zh-hans/guide/tutorials/rust.md)

货币和燃烧数值资产:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

薄荷和燃烧触发器重复:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## 转移 {#transfer}

转账将所有权或价值转移到账户之间.
变体涵盖域名,资产定义,数值资产, NFTs. RWA
量流动使用专用 `TransferRwa` 并且 `ForceTransferRwa`
在 [现实世界资产](/zh-hans/blockchain/rwas.md).

为了做到这一点,必须提供
[资产转让许可](/zh-hans/reference/permissions.md). 参考一个
如何转移资产的例子
[CLI](/zh-hans/get-started/operate-iroha-via-cli.md) 或
[Rust](/zh-hans/guide/tutorials/rust.md).

转移数值资产:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

转移域,资产定义和 NFT 所有权:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## 产业保险和资产锁 {#native-escrow-and-asset-locks}

在本书管理协议中锁定数值资产的原始保证指令
它们用于市场式结算,一般资产
密封锁和匿名的保证金流动.

市场托管使用 `OpenAssetEscrow`, `AcceptAssetEscrow`,
`MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`,
`OpenEscrowDispute`, 并且 `ResolveEscrowDispute`. 一般资产锁的使用
`OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, 并且
`ExpireAssetLock`. 匿名保证券反映了市场的生命周期
`OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`,
`MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`,
`CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, 并且
`ResolveAnonymousEscrowDispute`.

这些 ISIs 目前没有一等级 CLI 使用输入 SDK
构建器或序列化指令有效载荷,见
[产业资产抵押](/zh-hans/blockchain/escrow.md) 对于生命周期细节,
权限,查询,事件和 Rust 其他例子.

## 补贴/撤销 {#grant-revoke}

授予和撤销指令用于账户
[权限和角色](permissions.md).

`Grant` 用于永久授予用户单一许可,或
授予的角色和权限只能
通过 `Revoke` 因此,这些指令应
用小心.

在一个账户上授予和撤销角色:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

授予和撤销许可证.
从标准输入中的对象:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

授予和撤销角色的权限:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

这些指令更新对象 [数据](/zh-hans/blockchain/metadata.md). 使用
`SetKeyValue` 插入或更换一个元数据输入, `RemoveKeyValue` 在
删除一个.

数据表 `set` 命令阅读 JSON 标准输入值:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

同样的模式可用于账户,资产定义, NFTs, RWAs,
和触发器:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` 动态数据所暴露的连锁范围参数变化
模型和执行者.

通过单个参数设置参数 JSON 标准上的对象
输入:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

这个命令用于执行 [触发器](./triggers.md).

其他 CLI 可以注册触发器和订阅触发执行事件
直接. 它没有提供一个打字的 `execute trigger` 命令,所以
提交手册 `ExecuteTrigger` 命令,生成一个串行
`InstructionBox` 有一个 SDK 或执行工具,并通过结果 JSON
通过阵列 `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## 其他指令 {#other-instructions}

Iroha 也暴露了运行时间和执行器的低级指示
集成:

- `Log`: 在执行过程中发出日志输入
- `CustomInstruction`: 执行者特定的运输 JSON 实用载荷
- `Upgrade`: 激活执行器升级

提交一个 `Log` 通过 ping 辅助器进行指导:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

提交一个定制执行器指令作为串行 `InstructionBox`. 其他
执行器特定,所以使用该命令生成指令.
匹配 SDK 或执行器工具:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

升级执行器从一个编译 IVM 字节码文件:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
