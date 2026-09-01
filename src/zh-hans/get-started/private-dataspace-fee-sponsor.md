---
translation_locale: zh-hans
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 提供私人数据空间的赞助费 {#sponsor-fees-for-a-private-dataspace}

费用赞助允许用户在不持有 XOR 的情况下提交私有数据空间交易。用户仍需签署交易。交易元数据指向赞助者账户，运行时从该账户的 XOR 余额中扣除网络费用。

集成有三个移动部分:

1. 节点允许费用赞助
2. 赞助商账户存在,并拥有 XOR
3. 每个用户对该赞助商拥有 `CanUseFeeSponsor`

在此之后,每一个赞助的用户交易只需要这个元数据:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

这个页面显示了两个常见的模式:

- 用户免手续费写入:赞助商支付 XOR 而用户没有支付.
- 地方代币费用:用户以应用代币支付赞助商,赞助商则以 XOR 支付网络.

首先使用 Taira 或私有测试网络. 新的私人数据空间是运营商和治理变化;它不是由客户端配置创建的.

## 示例值 {#example-values}

下面的命令使用这些位置持有符:

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

使用规范 I105 帐户 IDs,除非您的部署对相同账户有活跃账户号.

## 1. 准备数据空间 {#_1-prepare-the-dataspace}

从 [中描述的私人数据空间目录和路由工作开始连接到 SORA Nexus 数据域](/zh-hans/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace).一个面向操作员的片段看起来像这样:

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

在转移到用户交易之前,请检查:

- 在 `/status` 节点响应中显示私人通道
- 用户帐户由您的私人登录流程接入
- 赞助商账户存在
- XOR 费用资产和费用清算账户在网络上有效

## 2. 在数据空间中注册资产 {#_2-register-assets-in-the-dataspace}

在将其传输到应用逻辑中之前,注册用户将在私人数据空间内保留的资产定义.对于本地代币费用模式,教程使用`usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

首先设置拥有资产命名空间的域和 SNS 租约。为 `$BILLING_DOMAIN` 创建一个不含秘密信息的 `AliasSetupPlanRequestV1` 意图，其中包括数字型 `team` 数据空间 ID、规范所有者、租期和当前报价保护条件：

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

然后注册资产定义. 规范性 `--id` 是网络级资产定义 ID.开发人员和最终用户应该在数据空间代码中使用的称:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

在登录过程中将本地代币发货或转移给用户:

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

使用数据空间中的应用资产的模式相同. 每个代币注册一个资产定义,给每个代码一个数据空间别名,并引用 SDK 代码的代号而不是硬编码的规范资产定义 IDs.

## 3. 登记用户姓名 {#_3-register-user-aliases}

账户仍然是规范的 I105 帐户 IDs.面向用户的名称是账户号,而号应是不敏感的手柄,如`alice@team`或`alice@members.team`.不要用电话号码或电子邮件地址作为号.这些都属于下一节的私人识别器流中.

姓名设置使用与域名设置相同的声明规划器.让 SDK 或登录服务创建一个无秘密的 `AliasSetupPlanRequestV1`意图,其帐户代号输入 目标 `$USER`,选择主要角色,键入数值数据空间 ID,并执行当前租报价保护.然后规划并将其作为一个原子交易:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

如果用户不应该支付 XOR,请使用批准的赞助商知情登录服务来构建和提交设置交易.不要将租收购和密号绑定分为独立申请交易.

在密名被绑定后,请从 CLI 检查:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

对于创建新账户,最好使用稳定 `uaid`和必要时初始 `label`构建 `NewAccount` 的安装服务.简单的 `ledger account register --id`命令只会记录规范帐户 ID.

## 4. 通过 FHE 私下登记电话和电子邮件. {#_4-register-phone-and-email-privately-with-fhe}

使用电话号码和电子邮件地址作为私人识别器索赔,而不是公开别名.支持 FHE 的流量将原始识别器排除在账户别名,交易元数据和世界状态之外:

1. 运营商注册[RAM-LFE/FHE 电话和电子邮件项目政策](/zh-hans/blockchain/ram-lfe.md)
2. 运营商注册活跃标识策略,如 `phone#team`和 `email#team`
3. 钱包将电话或电子邮件正常化.
4. 钱包将加密值发送到解决器
5. 解析器返回一个 `IdentifierResolutionReceipt`
6. 使用者将 `ClaimIdentifier` 附收据提交
7. 链存储一个不透明的标识符和回执哈希,而不是原始电话或电子邮件值.

运营商方策略设置是 SDK 或服务任务.为每个标识符类型构建并提交这些指令对:

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

复制为电子邮件:

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

在第8步创建赞助商元数据文件后,提交使用者签署的索赔指示,并附上该元数据:

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

电流 CLI 不显示这些身份指令的输入命令.使用 SDK 生成序列化`InstructionBox`值,并通过 `ledger transaction stdin`提交它们:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

在安装服务中保留这些防护:

- 账户名字只能被人读取的手柄
- 原始电话和电子邮件值永远不会出现在号,元数据,日志或交易有效载荷中.
- 在申请私人标识符之前,该账户有`uaid`
- 收据结合 `policy_id`, `opaque_id`, `uaid`, `account_id`,并过期
- 解决方案密钥和隐藏程序承诺由治理控制

## 5. 启用节点上的赞助 {#_5-enable-sponsorship-on-the-node}

费用赞助是节点/运行时政策. 在 Nexus 费用配置中启用:

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

`fee_asset_id`是网络费用资产.对于 SORA Nexus,这是 XOR.使用您的网络所曝光的活跃 XOR 号或规范 XOR 资产定义 ID

`sponsor_max_fee = "0"`意味着没有每笔交易的赞助商上限. 在您知道数据空间交易的正常大小和gas配置后,设置非零限量.

在正常操作程序中重新启动或滚动这个配置.

## 6. 创建和资助赞助者 {#_6-create-and-fund-the-sponsor}

如果需要,生成一个赞助商关键对:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
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

通过 XOR 从财政部,索赔账户或其他资助帐户为赞助商提供资金:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

对于 Taira 试炼,除了水龙头助手 [获取测试网 XOR 在 Taira](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) 作为 `taira_faucet_claim.py`, 然后通过公共水龙头来资助赞助商,而不是财政转账:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

查看赞助商的 XOR 余额:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. 让用户访问赞助商 {#_7-grant-a-user-access-to-the-sponsor}

赞助商必须授予每个用户向其收取费用的权限。该授权可防止用户指定任意赞助商账户。

运行这个作为赞助商账户,或者作为一个经营帐户允许的运行时政策:

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

- 用户帐户
- 赞助商账户
- 数据空间或应用
- 批准票或治理决定

检查用户的授权：

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

使用此元数据提交的任何写操作都会向赞助商收费：

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

对于 SDKs，将相同的交易元数据对象添加到已签名交易中。用户使用自己的密钥签署交易。赞助商不会签署每一笔用户交易，因为此前授予的 `CanUseFeeSponsor` 本身就是授权。

## 模式 1：用户不支付费用 {#pattern-1-users-pay-no-fees}

在应用程序或运营商收取所有网络费时使用此方法.

开发者检查列表:

1. 保持用户的正常交易有效载荷不变.
2. 添加 `fee_sponsor` 的交易元数据.
3. 作为用户签署.
4. 通过私人数据空间路线提交.

用户帐户不需要 XOR 的余额.赞助商账户必须保持足够的 XOR 来支付配置的 Nexus 费用.

## 模式2:用户支付本地代币 {#pattern-2-users-pay-a-local-token}

如果用户不应该持有 XOR,但数据空间仍然需要内部应用程序费用,信用支出或配额代币时使用这个.

在这种模式下,本地代币是应用程序支付.它不是网络费资产.赞助商仍然支付网络费用在 XOR.

例如,在私人数据空间中使用本地代币:

```text
usage#billing.team
```

在登录,订阅更新或配额分配期间,资助用户使用 `usage#billing.team`.然后将用户交易变为原子:

1. 将本地代币从用户转移到赞助商
2. 执行所要求的应用程序操作
3. 包含`fee_sponsor`元数据,因此赞助商支付 XOR

一个最小的 CLI 冒烟测试仅仅是由 XOR 赞助的本地代币转移:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

对于实际应用，不要把本地代币付款作为单独的尽力而为交易提交。应构建一笔同时包含付款和业务指令的已签名交易，或者公开一个合约入口点，在执行业务操作之前收取本地代币。

在您的应用程序或合同中保存转换政策:

- 哪个操作成本多少个本地代币单位
- 如何支持本地代币输入地图 XOR 补充
- 如果用户余额太低,会发生什么?
- 当赞助商 XOR 余额太低时会发生什么?

::: warning

不要使用 `gas_asset_id` 除非您希望赞助商在该gas资产中也收取费用. 在当前的运行时, `fee_sponsor` 也使赞助商为配置管道gas资产借款的付款人.对于本地代币用户费用,通过转让或合同规则,明确收集代币.

:::

## 检查未成功的赞助交易 {#debug-failed-sponsored-transactions}

常见的拒绝理由通常指向一个缺失的设置步骤:

|错误文本|检查什么?|
| --- | --- |
|`fee sponsorship is disabled`| `nexus.fees.sponsorship_enabled` 现在还在 `false` 在节点上. |
|`fee sponsor is not authorized`|用户没有 `CanUseFeeSponsor`用于此赞助商. |
|`fee asset ... is missing`|赞助商没有配置的 XOR 费用资产. |
|`fee balance ... is insufficient`| 补充赞助商的 XOR 保持余额. |
|`fee exceeds sponsor_max_fee`|增加 `sponsor_max_fee`或减少交易规模/gas. |
|`invalid nexus fee asset id`|固定 `nexus.fees.fee_asset_id`或 XOR 资产别名.|

在调试模式2时,检查两个余额:

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

处理赞助商作为一个财政账户:

- 保持测试网,阶段化和主网的分别赞助钥匙
- 在 sponsor 的 XOR 余额降至 admission floor 之前发出警报
- 一旦交通特征化,设置非零限 `sponsor_max_fee`
- 在您的应用程序或网关中赞助的笔记
- 当用户离开数据空间时,取消 `CanUseFeeSponsor`
- 调整用户交易哈希,本地代币支付和赞助人 XOR 抵押金

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

- [连接到 SORA Nexus 数据空间](/zh-hans/get-started/sora-nexus-dataspaces.md)
- [通过 CLI](/zh-hans/get-started/operate-iroha-via-cli.md)运行 Iroha 3
- [资产](/zh-hans/blockchain/assets.md)
- [许可证](/zh-hans/blockchain/permissions.md)
- [许可证代币](/zh-hans/reference/permissions.md)
