---
translation_locale: zh-hans
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 个人数据空间的赞助费用 {#sponsor-fees-for-a-private-dataspace}

费用赞助允许用户提交私人数据空间交易
农场 XOR. 用户仍然签署交易.
在赞助商账户上的点,并且运行时间抵免赞助商的 XOR 平衡
网络费用.

集成有三个移动部分:

1. 节点允许费用赞助
2. 赞助商账户存在,并且有 XOR
3. 每个用户都有 `CanUseFeeSponsor` 对于该赞助商

在此之后,每一个赞助的用户交易只需要这些元数据:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

这页面显示了两个常见的模式:

- **免费使用者写**: 赞助商支付 XOR 而用户却没有付出任何代价.
- **地方代币费用**: 用户以应用程序代币支付赞助商,
  赞助商支付网络 XOR.

使用 Taira 一个新的私人数据空间是一个
运营商和管理变化;它不是由客户端配置创建的.

## 示例价值 {#example-values}

下面的命令使用以下位置持有符:

```bash
export DATASPACE="team"
export USER="<USER_ACCOUNT_I105>"
export SPONSOR="<SPONSOR_ACCOUNT_I105>"
export TREASURY="<TREASURY_ACCOUNT_I105>"
export XOR_ASSET="xor#universal"
export BILLING_DOMAIN="billing.team"
export LOCAL_FEE_ASSET="usage#billing.team"
export LOCAL_FEE_ASSET_ID="<LOCAL_FEE_ASSET_DEFINITION_BASE58>"
export USER_ALIAS="alice@team"
export PHONE_POLICY="phone#team"
export EMAIL_POLICY="email#team"
export POLICY_OWNER="<IDENTIFIER_POLICY_OWNER_ACCOUNT_I105>"
```

使用法典 I105 账户 IDs 除非您的部署有活跃账户
同样的账户的别名.

## 1. 准备数据空间 {#_1-prepare-the-dataspace}

从本文中描述的私人数据空间目录和路由工作开始
[连接到 SORA Nexus 数据库](/zh-hans/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace).
一个面向操作员的碎片看起来像这样:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "team-private"
description = "Private team lane"
dataspace = "team"
visibility = "private"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "team"
id = 42
description = "Private team dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "team"
[nexus.routing_policy.rules.matcher]
account_prefix = "team."
description = "Route team domains to the private dataspace"
```

在转向用户交易之前,请检查:

- 隐私车道在节点中出现 `/status` 反应
- 用户帐户通过您的私人登录流入.
- 赞助商账户存在
- 在 XOR 费用资产和费用清洗账户在网络上有效

## 2. 在数据空间中注册资产 {#_2-register-assets-in-the-dataspace}

登记用户将在私人中持有的资产定义
在将它们输入到应用逻辑中之前,
在教程中使用的模式 `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

首先设置域名, SNS 创建一个资产名称空间的租协议
没有秘密 `AliasSetupPlanRequestV1` 目的 `$BILLING_DOMAIN`, 包括
数字 `team` 数据空间 ID, 合法的所有者,租期限和当前报价
警卫:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

然后注册资产定义. `--id` 是网络水平
资产定义 ID. 开发者和最终用户应该使用这个别名
数据空间代码:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

在登录过程中,硬币或将本地代币转移给用户:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

检查用户的余额:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

使用数据空间中的应用资产相同的模式.
每个代币的资产定义,给每个一个数据空间别名,并引用
其他名字 SDK 代码而不是硬编码的正规资产定义 IDs.

## 3. 登记用户姓名 {#_3-register-user-aliases}

记载仍然是正宗的 I105 账户 IDs. 面向用户的名称是账户
别名和别名应是不敏感的手柄,如 `alice@team` 或
`alice@members.team`. 不要用电话号码或电子邮件地址作为别名.
它们属于下一个部分的私人识别器流.

域名设置使用相同的声明规划器. SDK 或
机上服务创建一个无秘密的 `AliasSetupPlanRequestV1` 的意图
账户名义的入口目标 `$USER`, 选择主要角色,入数值
数据空间 ID, 然后计划并应用它.
作为一个原子交易:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

如果用户不需要支付 XOR, 使用已批准的赞助商知情登机
建立和提交安装交易的服务.
在独立申请交易中,具有约束力的收购和代号.

在密码被绑定后, CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

对于创建新帐户,更喜欢构建
`NewAccount` 有一个子 `uaid` 如果需要, `label`. 其他
简单 `ledger account register --id` 命令只记录了法典
账户 ID.

## 4. 在私人地登记电话和电子邮件 FHE {#_4-register-phone-and-email-privately-with-fhe}

使用电话号码和电子邮件地址作为私人身份证索赔,而不是公开
其他名字. FHE- 支持流量将原始标识器排除在账户名外,
交易元数据和世界状态:

1. 运营商注册一个
   [RAM-LFE/FHE 项目政策](/zh-hans/blockchain/ram-lfe.md) 电话和电子邮件
2. 运营商会注册活跃识别政策,如 `phone#team` 并且
   `email#team`
3. 钱包将电话或电子邮件正常化
4. 钱包将加密值发送到解析器
5. 解决器返回一个 `IdentifierResolutionReceipt`
6. 用户提交 `ClaimIdentifier` 附收据
7. 连锁存储一个不透明的识别符和收据哈希,而不是原始电话或
   电子邮件值

运营商的政策设置是 SDK 构建和提交
对于每个标识符类型,这些指令对:

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "$POLICY_OWNER",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "$PHONE_POLICY",
  owner = "$POLICY_OWNER",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "$PHONE_POLICY")
```

通过:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

在安装过程中,钱包或后端应本地正常化:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

在第8步创建赞助者元数据文件后,提交用户签署的
使用该元数据的索赔说明:

```text
ClaimIdentifier(
  account = "$USER",
  receipt = IdentifierResolutionReceipt {
    payload: {
      policy_id: "$PHONE_POLICY",
      opaque_id: "<OPAQUE_ACCOUNT_ID>",
      uaid: "<USER_UAID>",
      account_id: "$USER",
      ...
    },
    attestation: "<RESOLVER_SIGNATURE_OR_PROOF>"
  }
)
```

电流 CLI 不显示这些身份的输入命令
输出序列化 `InstructionBox` 价值与 SDK 并且
提交它们 `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

在登机服务中保持这些护:

- 账户名字只能被人阅读的手柄
- 电话和电子邮件的原始值永远不会出现在号,元数据,日志或
  交易有效载荷
- 账户有 `uaid` 在它要求私人标识符之前
- 收据结合 `policy_id`, `opaque_id`, `uaid`, `account_id`, 及过期
- 解决器密钥和隐藏程序承诺由治理控制

## 5. 在节点上启用赞助 {#_5-enable-sponsorship-on-the-node}

费用赞助是节点/运行时间政策. Nexus 费用配置:

```toml
[nexus.fees]
fee_asset_id = "xor#universal"
fee_sink_account_id = "<FEE_SINK_ACCOUNT_I105_OR_ALIAS>"
base_fee = "0"
per_byte_fee = "0"
per_instruction_fee = "0.001"
per_gas_unit_fee = "0.00005"
sponsorship_enabled = true
sponsor_max_fee = "0"
```

`fee_asset_id` 是网络费用资产. SORA Nexus 这是 XOR. 使用
活跃 XOR 别名或法典名称 XOR 资产定义 ID 在你的网络上.

`sponsor_max_fee = "0"` 没有每笔交易的赞助商上限.
在你知道正常的尺寸和气体配置后,设置非零限
您的数据区交易.

在正常操作过程中重新启动或滚动这个配置.

## 6. 创建和资助赞助者 {#_6-create-and-fund-the-sponsor}

如果需要,生成一个赞助商关键对:

```bash
kagami keys --algorithm ed25519 --json
```

将公钥转换为网络帐户格式:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

通过您的私人登录流程注册赞助商账户:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

资助赞助商 XOR 从财政,债务账户或其他资助的账户
账户:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

对于 Taira 试炼,除了水龙头助手
[获取测试网 XOR 在 Taira](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
作为 `taira_faucet_claim.py`, 然后通过公共水龙头资助赞助商
而不是财政转账:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

查看赞助商的 XOR 均衡:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. 允许用户访问赞助商 {#_7-grant-a-user-access-to-the-sponsor}

赞助商必须允许每个用户向其收取费用.
阻止用户命名任意的赞助商账户.

运行这个作为赞助商账户,或作为一个经营帐户允许你的
运行时间政策:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission grant --id "$USER"
```

对于登录服务,将此作为一个正常的账户提供步骤,并记录:

- 使用者帐户
- 赞助商账户
- 数据空间或应用
- 批准票或治理决定

检查用户的补贴:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. 附加赞助商的元数据 {#_8-attach-sponsor-metadata}

创建可重复使用的元数据文件:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

附加此元数据的任何写入,都将向赞助商收取:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

对于 SDKs, 将同一个交易元数据对象附加到签署的文件中
用户用用户的密钥签署交易.赞助商
不签署每个用户交易,因为之前的 `CanUseFeeSponsor`
授予是授权.

## 第一个模式:用户免费付款 {#pattern-1-users-pay-no-fees}

使用此时,应用程序或运营商收取所有网络费用.

开发者检查列表:

1. 保持用户的正常交易有效载荷不变.
2. 添加交易元数据 `fee_sponsor`.
3. 作为用户签署.
4. 通过私人数据空间路线提交.

用户帐户不需要 XOR 赞助商账户必须保持
足够 XOR 覆盖配置的 Nexus 收费.

## 模式2:用户支付本地代币 {#pattern-2-users-pay-a-local-token}

使用此时使用者不应该保持 XOR, 但数据空间仍然需要一个
应用程序内部费用,信用支出或配额代币.

在这种模式下,本地代币是应用程序支付.
支持者仍然支付网络费用 XOR.

例如,在私人数据空间中使用本地代币:

```text
usage#billing.team
```

基金使用者 `usage#billing.team` 在登录期间,订阅续签;
然后将用户交易变得原子化:

1. 从用户转移到赞助商的本地代币
2. 执行所要求的应用程序操作
3. 包括 `fee_sponsor` 转移数据,所以赞助商付款 XOR

最少的 CLI 烟雾测试只是当地代币转移, XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

对于真正的应用程序,不要作为单独的本地代币支付提交
建立一个签署的交易,包含两个
支付和业务指令,或暴露出一个合同入口点
在实施业务操作之前收集本地代币.

在应用程序或合同中保存转换政策:

- 哪个操作成本多少个本地代币单位
- 如何赞助本地代币输入地图 XOR 补充
- 如果用户平衡太低,会发生什么?
- 如果赞助商 XOR 平衡太低了

::: warning

不要使用 `gas_asset_id` 对于"本地代币费用"模式,除非您希望
在当前运行时,
`fee_sponsor` 也使赞助商成为配置管道气体的付款人
对于本地代币用户费用,
转让或合同规则.

:::

## 检查未成功的赞助交易 {#debug-failed-sponsored-transactions}

常见的拒绝理由通常指向一个缺失设置步骤:

| 错误文本 | 检查什么 |
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` 现在还在 `false` 在节点上. |
| `fee sponsor is not authorized` | 用户没有 `CanUseFeeSponsor` 为了这个赞助商. |
| `fee asset ... is missing` | 赞助商不持有配置 XOR 收费资产. |
| `fee balance ... is insufficient` | 补充赞助商的 XOR 保持平衡. |
| `fee exceeds sponsor_max_fee` | 提高 `sponsor_max_fee` 或减少交易规模/气体. |
| `invalid nexus fee asset id` | 修复 `nexus.fees.fee_asset_id` 或是 XOR 资产的号. |

在调试模式2时,检查两个平衡:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"

iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

## 运营赞助商 {#operate-the-sponsor}

处理赞助商作为财政账户:

- 保持测试网,阶段化和主网的分别赞助钥匙
- 在赞助商前进行警告 XOR 均衡达到入学地板
- 设置非零值 `sponsor_max_fee` 一旦交通标记,将限制
- 在您的申请或网关中赞助笔记
- 撤销 `CanUseFeeSponsor` 当用户离开数据空间时
- 调整用户交易哈希,本地代币支付和赞助商 XOR
  借款

取消用户的赞助权:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission revoke --id "$USER"
```

## 相关页面 {#related-pages}

- [连接到 SORA Nexus 数据库](/zh-hans/get-started/sora-nexus-dataspaces.md)
- [运行 Iroha 3 通过 CLI](/zh-hans/get-started/operate-iroha-via-cli.md)
- [资产](/zh-hans/blockchain/assets.md)
- [许可证](/zh-hans/blockchain/permissions.md)
- [许可令牌](/zh-hans/reference/permissions.md)
