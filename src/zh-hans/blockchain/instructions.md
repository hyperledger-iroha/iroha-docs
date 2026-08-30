---
translation_locale: zh-hans
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Iroha 特殊指令 {#iroha-special-instructions}

当我们谈到 [如何 Iroha 运营](/zh-hans/blockchain/iroha-explained), 我们说 Iroha 特殊指示是改变世界状态的唯一方法.我们有什么特殊指令呢?在本教程中,你已经看到了几条指令: `Register<Account>` 和 `Mint<Numeric>`.

以下是 Iroha 特殊指示的完整列表:

|指示|描述|
| --------------------------------------------------------- | ------------------------------------------------ |
| [登记/退出登记](#un-register) |给一个 ID 在区块链上的新实体. |
| [硬币/燃烧](#mint-burn)|硬币/燃烧数字资产或触发重复. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |更新区块链对象的元数据.|
| [SetParameter](#setparameter) |设置链接宽度参数.|
| [资助/撤销](#grant-revoke) |给予或删除权限和角色.|
| [转移](#transfer)|转移所有权或资产价值.|
| [本地保证金和资产锁定](#native-escrow-and-asset-locks) |锁定数字资产在协议监护.|
| [原子私密结算](#atomic-private-settlement) | 管理机密 pool 和原子捆绑包。 |
| [ExecuteTrigger](#executetrigger) |执行触发器.|
| [记录/定制/升级](#other-instructions) |记录,延长或升级运行时间行为.|

让我们从 Iroha 特殊指令的总结开始;每个指令可以调用哪些对象,以及每一个对象可用的指令.

## 总结 {#summary}

对于每一个指令,有一个可以运行该指令的对象列表.例如,转移变量涵盖可拥有账本对象和数值资产,而缩则涵盖数值资金和触发重复.

一些指令要求指定目的地.例如,如果你转移资产,你总是需要指定你将资产转移到哪个账户上.另一方面,当你注册某件事情时,你只需要注册的对象.

|指示|物体|目的地|
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |常规域名,数据空间号和帐户号设置|                      |
| [登记/退出登记](#un-register) |账户,资产定义, NFTs,角色,触发因素,同行;域名移除 |                      |
| [硬币/燃烧](#mint-burn)|数字资产,触发重复|账户或触发器|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |具有 [元数据](./metadata.md)的对象:域名,账户,资产定义, NFTs, RWAs,触发器|                      |
| [SetParameter](#setparameter) |连锁参数|                      |
| [资助/撤销](#grant-revoke) | [角色,许可证代码](/zh-hans/blockchain/permissions.md) |账户或角色|
| [转移](#transfer)|域名,资产定义,数值资产, NFTs|账户|
| [本地保证金和资产锁定](#native-escrow-and-asset-locks) |数字资产保证券,资产锁定,匿名的保证券承诺 |购物者,目的地或争端分歧|
| [原子私密结算](#atomic-private-settlement) | 绑定精确路由的机密 pool、策略轮换、已完成捆绑包和中止标记 | |
| [ExecuteTrigger](#executetrigger) |触发器|                      |
| [记录/定制/升级](#other-instructions) |记录,执行者特定的有效载荷,执行器升级 |                      |

还有另一种方法来看 ISI,从他们触及的账本对象方面:

|目标|指示|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|账户|登记/撤销账户,收到资产,更新账户元数据,授予/撤销许可和角色 |
|域名|确保域名设置,取消域名注册,转移域名所有权,更新域名元数据.|
|资产定义|登记/退出登记的定义,转移所有权,更新元数据|
|资产|硬币/烧伤数量,转移数量 |
|抵押金|开放,接受,标记发送的支付,释放,取消,纠纷,解决,撤销或过期原生保管记录.|
|NFT|登记/撤销登记 NFTs,转让所有权,更新元数据 |
|RWA|登记批量,转移数量,保留/释放,结/解凍,收购,合并,更新元数据和控制|
|触发器|注册/取消注册,硬币/燃烧触发重复,执行触发器,更新触发器元数据 |
|世界|注册/取消注册同行和角色,设置参数,升级执行者 |

## CLI 举例 {#cli-examples}

本页面的例子假设您正在从上游 Iroha 工作空间运行命令,而不是默认本地客户端配置:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

如果您安装了`iroha`二进制,请使用 `iroha --config ./defaults/client.toml` 相反.

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

当针对公众时 Taira 测试网,使用一个 Taira 在运行支付费用的例子之前,保存水龙头助手从 [获取测试网 XOR 在 Taira](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) 作为 `taira_faucet_claim.py`, 然后索赔测试网 XOR 在水龙头上:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

在头资产可见之后,添加所需的气体资产元数据来记录交易:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias`是创建域名和其 SNS 租的普通首次发布路径.它声明地绑定了确切的数据空间,所有者,租 使用验证的 `POST /v1/aliases/setup/plan` 终端点或匹配的 CLI 工作流程:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

意图和计划是无秘密的,但应用步骤标志并提交一个普通的交易与配置帐户. 一个计划被绑定到其链,权威,现实状态和截止日期;永远不要再在另一个网络上使用它.

## (无) 登记 {#un-register}

注册和退出注册是向在区块链上新实体发送 ID 的指令.

所有可以注册的东西都是`Registrable`和`Identifiable`,但不是所有是 `Identifiable`的东西都是 `Registrable`.大多数东西都直接注册,由于安全性和性能原因,我们使用构建器用于此类数据结构 (例如 `NewAccount`),同行注册有一个专门的证明所有权说明.

你可以注册账户,资产定义, NFTs, 域名设置使用: `EnsureAlias`; 原料 `Register::Domain` 用于创始/启动带.同行注册使用 `RegisterPeerWithPop`, 检查我们的密钥. [命名会议](/zh-hans/reference/naming.md) 了解对实体名称的限制.

RWA 批量是通过专门的 `RegisterRwa`指令创建的.当前代码不显示`UnregisterRwa`指令;使用 `RedeemRwa`退休表示数量.

::: info

请注意,根据您如何设置 [基因区块](/zh-hans/guide/configure/genesis.md)在 `genesis.json`中 (具体来说,是否包括注册许可证代币),注册帐户的过程可能非常不同.

- 在公共区块链中,任何人都应该能够注册帐户.
- 在私人区块链中,可以有一个单独的账户注册过程.在典型的私人区塊中,即没有任何单独的帐户注册进程的区块链里,你需要一个帐户才能注册另一个账户.

我们讨论这些差异的细节, [比较私人和公共区块链](/zh-hans/guide/configure/modes.md).

:::

::: info

目前,注册同行是唯一的方式来添加在网络中非原始可靠同行的同行.

:::

使用特定语言的指南注册区块链对象:

|语言|指南|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI|使用 [Iroha CLI](/zh-hans/get-started/operate-iroha-via-cli.md)设置域名和注册账户和资产. |
|Rust|使用[Rust 教程](/zh-hans/guide/tutorials/rust.md). |
|Kotlin/Java |使用[Kotlin/Java教程](/zh-hans/guide/tutorials/kotlin-java.md). |
|Python|使用[Python 教程](/zh-hans/guide/tutorials/python.md). |
|JavaScript/TypeScript |使用[JavaScript/TypeScript 教程 ](/zh-hans/guide/tutorials/javascript.md). |

规划和应用普通域设置,然后在不再需要时取消域名注册:

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

登记和注销账户:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

注册和退出注册资产定义:

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

登记和注销 NFTs. NFT 登记从标准输入中读取其内容 JSON:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

登记和退出登记的角色:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

注册和取消注册的触发器.触发器注册需要编译 IVM 字节码或串行指令列表.本示例使用 CLI 构建一个 `Log` 指令,并将其输入到触发器登记中:

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

注册和退出注册的同行. 如果您尚未拥有 BLS 密钥,则将 PoP 和 `kagami` 发明:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## 薄荷/燃烧 {#mint-burn}

造和燃烧可以指数值资产,并且具有有限的重复数量.某些资产可被宣布为不可造,这意味着它们在注册后只能一次造.

资产注册到一个特定的账户,通常是该帐户首次注册资产的.资产数量是非负的,所以你永远不能拥有 `$-1.0`的资产或烧毁负数量并获得钱.

使用一个特定语言的指南来造区块链资产:

- [CLI](/zh-hans/get-started/operate-iroha-via-cli.md)
- [Rust](/zh-hans/guide/tutorials/rust.md)
- [Kotlin/Java](/zh-hans/guide/tutorials/kotlin-java.md)
- [Python](/zh-hans/guide/tutorials/python.md)
- [JavaScript/TypeScript](/zh-hans/guide/tutorials/javascript.md)

以下是燃烧资产的例子:

- [CLI](/zh-hans/get-started/operate-iroha-via-cli.md)
- [Rust](/zh-hans/guide/tutorials/rust.md)

硬币和燃烧数值资产:

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

薄荷和烧伤触发器重复:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## 转移 {#transfer}

转移将所有权或价值在账户之间移动.通用转让变体涵盖域名,资产定义,数值资产和 NFTs. RWA 数量流动使用`TransferRwa`和 `ForceTransferRwa`指令所描述的 [Real-World Assets](/zh-hans/blockchain/rwas.md).

为了做到这一点,必须提供 [资产转移的许可](/zh-hans/reference/permissions.md). 举例说明如何转移资产 [CLI](/zh-hans/get-started/operate-iroha-via-cli.md) 或 [Rust](/zh-hans/guide/tutorials/rust.md).

转移数值资产:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

转让域名,资产定义和 NFT 所有权:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## 产业保险和资产锁 {#native-escrow-and-asset-locks}

本地保证指令将数字资产锁定在账本管理的协议保管中.它们用于市场式结算,通用资产锁和匿名屏蔽的保证流动.

市场保证金使用 `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, 和 `ResolveEscrowDispute`. 一般资产锁的使用 `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, 和 `ExpireAssetLock`. 匿名保证人反映了市场的生命周期 `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, 和 `ResolveAnonymousEscrowDispute`.

这些 ISIs 目前没有一流的 CLI 命令.使用类型 SDK 构建器或序列化指令有效载荷,并参见 [原生资产抵押](/zh-hans/blockchain/escrow.md)为生命周期详细信息,权限,查询,事件和 Rust 示例.

## 原子私密结算 {#atomic-private-settlement}

受治理的原子私密结算指令与透明的 Native AMX 相互独立。`ActivatePrivateSettlementPoolV1` 根据经过删减的治理投影和规范来源承诺，为精确路由建立一个机密 `pool`。`FinalizeAtomicPrivateSettlementV1` 以原子方式应用由所有参与委员会认证的完整捆绑包。`AbortAtomicPrivateSettlementV1` 仅发布经发起方授权的公开终止标记。

只有隐私治理可以执行 `RotatePrivateSettlementPoolPolicyV1`。此指令要求与当前治理摘要完全匹配；它保留路由、`pool`、资产绑定承诺、状态前沿、重放集合和已完成收据，将公开修订版加一，并使用更新的审计者密钥 epoch。轮换在指令纳入的高度生效，同一路由和 `pool` 的收据不得在该高度完成。公开修订版谱系使轮换前完成的收据在重启后仍然有效，并使完全相同的重放具有幂等性。启用时仍在处理的旧策略捆绑包会在更改状态前以 fail-closed 方式失败。运营方必须保留旧解密密钥，或在销毁密钥前，通过治理流程重新包装胶囊并验证结果。

此路径默认禁用，尚未通过生产环境资格验证。有关配置、权限、审计、恢复和发布要求，请参阅[运行跨数据空间原子私密结算](/get-started/atomic-private-settlement)。

## 资助/撤销 {#grant-revoke}

授权和撤销指示用于账户 [许可证和角色](permissions.md).

`Grant`用于永久授予用户单个许可证或一组权限 ("角色").仅通过`Revoke`指令才能删除所授予的角色和权限.因此,这些指令应谨慎使用.

授予和撤销一个账户的角色:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

授予和撤销权限代币.允许命令从标准输入中读取一个权限对象:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

授予或撤销角色的权限:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

这些指令更新对象 [元数据](/zh-hans/blockchain/metadata.md).使用 `SetKeyValue`来插入或取代一个元数据输入,并用 `RemoveKeyValue`删除一个.

在 `set` 命令中,从标准输入中读取 JSON 的值:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

同样的模式可用于账户,资产定义, NFTs, RWAs,以及触发因素:

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

`SetParameter`改变了主动数据模型和执行者所暴露的整个链参数.

在标准输入时通过单个参数 JSON 对象设置参数:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

该指令用于执行 [触发](./triggers.md).

CLI 可以直接记录触发器,并订阅触发执行事件.它不提供输入`execute trigger`命令,因此要提交一个 手动 `ExecuteTrigger` 指令,用 SDK 或执行工具生成串行式 `InstructionBox`,并通过 `ledger transaction stdin` 传输结果的 JSON 阵列:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## 其他指令 {#other-instructions}

Iroha 还揭示了运行时间和执行器集成的较低级别指示:

- `Log`:在执行过程中发出日志输入
- `CustomInstruction`:运输执行者特定的 JSON 有效载荷
- `Upgrade`:激活执行器升级

提交一个 `Log` 指令与助手:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

提交一个定制执行器指令作为串行式 `InstructionBox`.有效载荷形状是执行器特定的,所以使用匹配的 SDK 或执行器工具生成该指令:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

升级执行器从编译的 IVM 字节码文件中:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
