---
translation_locale: zh-hans
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 域名 {#domains}

域是在 `World` 中注册的具名命名空间。在当前 Iroha 3 数据模型中，域由其所属数据空间限定，因此规范标识符为：

```text
domain.dataspace
```

例如，`payments.universal` 表示 `universal` 数据空间中的 `payments` 域。

## 结构 {#structure}

已注册的 `Domain` 包含:

- `id`：由数据空间限定的 `DomainId`
- `logo`:域名标志的可选标志`SoraFS` URI
- `metadata`:任意的关键值元数据
- `owned_by`:域名所有权的账户,通常是注册该域名的帐户

启动带有效载荷用于实现域名是 `NewDomain`.它携带`id`,可选 `logo`和初始 `metadata`.运行时从授权主体填写`owned_by`.普通客户不会直接提交这种有效载荷.

## 登记 {#registration}

通常的域名创建使用声明别名设置流程.这将 SNS 租协议,所有者功能,报价保护和域名行保持在一个原子 `EnsureAlias`交易中.`Register::Domain`仍然是创世/bootstrap表面,并且`ledger domain`命令没有`register`子命令.

通过 SDK 或登录服务创建一个无秘密的 `AliasSetupPlanRequestV1` 意图,然后让 CLI 与现实状态进行计划,并提交那个准确的计划:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

意图指定 `payments.universal`、其数据空间的数字标识、采用规范 I105 标识的所有者、租约获取期限，以及当前策略和支付报价的校验条件。规划端点为 `POST /v1/aliases/setup/plan`；返回的计划绑定具体链、授权主体、状态和截止时间。删除域仍使用 [`Unregister`](/zh-hans/blockchain/instructions.md#un-register)。

创建或删除域名需要在主动运行时验证器下获得适当的域管理权限. 当权限主体有权修改该域名时,域名元数据可以通过 [`SetKeyValue`和 `RemoveKeyValue`](/zh-hans/blockchain/instructions.md#setkeyvalue-removekeyvalue)更新.

## 在 Taira 试看. {#try-it-on-taira}

列出目前在公共测试网 Taira 上可见的域名:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

将公开执行通道目录中的条目映射回数据空间别名：

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

当应用程序需要检查域是否存在时，请使用第一个命令。使用执行通道目录检查与数据空间关联的执行通道，包括每个执行通道的公开或受限可见性以及相对于核心执行通道的同步状态。

域设置是一项需要付费的写入操作。在 Taira 上尝试之前，先按[在 Taira 获取测试网 XOR](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)中带有准备步骤的水龙头流程为签名账户提供资金，然后明确指定费用支付方并应用计划。CLI 会在签名前给出准确的费用报价：

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

在重复测试网络运行中建立一个独特域名的意图,并使用 Taira 的当前政策和费用资产报价保护.不要再利用为 localnet 或 Minamoto 制作的计划.

## 与其他实体的关系 {#relationship-to-other-entities}

域名集成账本对象,为域名扩展的数据提供一个名称空间.资产定义使用域名合格标识符,查询可以列出域名或找到在当前数据模型中,帐户本身是无域的,但账户可以拥有域和持有其定义在域下存在的资产.

此外,请参见:

- [世界](/zh-hans/blockchain/world.md)
- [资产](/zh-hans/blockchain/assets.md)
- [超值数据](/zh-hans/blockchain/metadata.md)
- [命名规则](/zh-hans/reference/naming.md)
