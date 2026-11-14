---
translation_locale: zh-hans
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 79410ebb9d0a18072d5ae2288348082390b622ed81225de79dcbd4000e268e51
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 为私有数据空间赞助费用 {#sponsor-fees-for-a-private-data-space}

SORA Nexus 费用赞助计划可支付路由至私有数据空间的合格交易所产生的全局执行费用。用户仍须签署完整交易。交易中类型化的 `FeePaymentIntent` 选择准确的赞助计划和不可变修订版、必要的 gas 上限以及各项最高收费。

数据空间目录条目不会创建独立签名的根。独立数据空间根有其自身已提交的费用币种和策略；公开赞助金库不能授权支付该私有根的费用。设计赞助方案之前，应先确立执行根。

## 1. 确立已提交的费用策略 {#_1-establish-the-committed-fee-policy}

已签名创世配置定义一个包含 `RootFeePolicy` 的 `root_fees_v1` 自定义参数。它绑定费用币种、费用归集账户、赞助托管账户、领取豁免及费率。每个普通区块和每次报价均使用其捕获的已提交策略。经授权的策略更新从下一个区块起生效。

对于全局执行，原生费用会销毁签名中准确指定的网络 XOR 币种。该币种由赞助方的计划金库提供。节点设置和交易元数据不会选择支付方，也不会启用赞助。

使用网络的规范币种及账户身份。别名解析不得重定向已提交的币种、托管账户或费用归集账户身份。

## 2. 创建赞助计划并提供资金 {#_2-create-and-fund-a-sponsor-program}

计划 ID 采用 `<canonical-sponsor-account>/<program-name>` 形式。通过当前 SDK 和数据模型提供的类型化指令进行配置：

| 指令 | 用途 |
| --- | --- |
| `CreateFeeSponsorProgram` | 创建处于暂存阶段的计划，并指定必需的支出账户。 |
| `StageFeeSponsorProgramRevision` | 定义一份不可变的资格、操作及预算策略。 |
| `EnrollFeeSponsorBeneficiary` | 在链上记录符合资格的受益人。 |
| `FundFeeSponsorProgram` | 将资产转入托管，并记入准确指定的计划金库。 |
| `ActivateFeeSponsorProgramRevision` | 安排暂存修订版的最早激活高度。 |

计划管理由赞助方或准确指定的受托管理者授权。提款必须由赞助方本人授权，且仅在计划暂停或关闭期间，将资金退回计划所记录的支出账户。

每个修订版规定：

- 显式登记资格，或登记资格加上获准的路由默认资格；
- 针对准确的原生指令线格式 ID，或合约地址、代码哈希及入口点，制定允许和拒绝规则；
- 按资产设置的每笔交易、每个区块、每个计划纪元及每个受益人纪元的限额；
- 储备下限及确定性的纪元长度。

拒绝规则优先于允许规则。只有活动修订版允许时，数据空间的 `fee_sponsor_program_id` 才授予路由默认资格；交易仍须明确指定准确的计划及修订版。激活可推迟至前一修订版的未结分配全部到期。

赞助金库资产必须采用 `Global` 余额策略。仅为赞助方的普通账户提供资金，并不会为独立的计划金库提供资金；一个计划也不能消耗另一计划的余额。

## 3. 为准确的交易报价、签名并提交 {#_3-quote-sign-and-submit-the-exact-transaction}

SDK 集成执行以下步骤：

1. 构造未签名的 `TransactionPayload`，包含授权主体、可执行内容、时间戳、nonce、元数据、准确的赞助计划修订版以及任何必需的 gas 限额。各项最高收费初始可为空。
2. 使用账户签名向 `POST /v1/fees/quote` 发送 `{"payload": <payload>}`。请求签名者必须是交易授权主体。
3. 检查观察到的高度、解析后的数据空间路由、费用组成、扣款来源及赞助容量。核实响应保持所选择的支付方、修订版和 gas 上限。
4. 仅将 `payload.fee_payment` 替换为推荐意图，然后签署并提交该准确载荷。
5. 跟踪交易，直至状态解析结果确认 `Applied` 最终性，并保留其回执，包括实际使用的赞助计划、修订版及费用。

报价观察账本，但不预留容量。队列准入会重新检查资格，并预留已签名的各项上限。赞助拒绝会使交易被拒绝，不会回退为向用户收费。

CLI 同样显式指定费用来源。例如，计划允许这笔准确的资产转移且账户符合资格后：

```bash
iroha --config ./user.client.toml \
  --fee-payer sponsor \
  --fee-program '<SPONSOR_CANONICAL_I105>/team-payments' \
  --fee-program-revision 1 \
  ledger asset transfer \
  --definition '<ASSET_DEFINITION_BASE58>' \
  --account '<USER_CANONICAL_I105>' \
  --to '<RECIPIENT_CANONICAL_I105>' \
  --quantity 1
```

使用网络中的活动修订版及准确标识符。用户配置仅包含该用户的签名者；提交符合资格的赞助交易不需要赞助方私钥。

## 4. 决定用户是否支付应用费用 {#_4-decide-whether-the-user-pays-an-application-fee}

赞助方可以承担全局费用，而应用不向用户收费。若应用收取本地代币，应在用户签署的可执行内容中显式定义该转移或合约规则。将每项操作纳入赞助修订版的策略，并检查完整载荷的报价。不要根据网络费用意图推断应用代币转移。

## 诊断拒绝原因 {#diagnose-a-refusal}

使用节点返回的稳定费用代码及补救详情：

| 代码 | 检查内容 |
| --- | --- |
| `program_not_found` | 准确的规范计划身份。 |
| `revision_not_active`, `program_not_active` | 修订版激活情况及计划生命周期。 |
| `beneficiary_not_eligible` | 登记资格或获准的路由默认资格。 |
| `operation_not_allowed`, `operation_denied` | 每项准确的已签名操作及拒绝规则。 |
| `invalid_gas_limit`, `signed_limit_exceeded` | 对照最新报价检查 gas 上限及已签名的各项上限。 |
| `vault_insufficient` | 该计划准确币种金库中的已注资余额。 |
| 预算耗尽代码 | 交易、区块、计划纪元及受益人纪元的容量。 |

调查结果不明的提交时，应保留原始交易哈希及费用拒绝详情。在构造替代交易之前，先确认原交易的状态。

## 固定版本的来源 {#pinned-sources}

- [费用策略、计划生命周期及报价协议](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/nexus_fee_model.md)
- [类型化赞助计划指令](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/isi/nexus.rs)
- [CLI 费用来源选项及资产转移](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)
- [数据空间设置](/zh-hans/get-started/sora-nexus-dataspaces.md)
