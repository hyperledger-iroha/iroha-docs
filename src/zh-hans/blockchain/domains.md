---
translation_locale: zh-hans
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 域名 {#domains}

域名是注册的名称空间 `World`. 在当前 Iroha
3数据模型一个域是通过其母数据空间资格的,所以正规的
标识符是:

```text
domain.dataspace
```

例如, `payments.universal` 的名称 `payments` 在该领域内
`universal` 数据空间.

## 结构 {#structure}

已注册的 `Domain` 含有:

- `id`: 数据空间资格 `DomainId`
- `logo`: 选择性 `SoraFS` URI 为域名标志
- `metadata`: 任意的关键值元数据
- `owned_by`: 占域名的账户,通常是该帐户
  已注册

实现域名的启动带有效载荷是 `NewDomain`. 它带着
在 `id`, 选择性 `logo`, 和初始 `metadata`. 运行时间充满
`owned_by` 常见客户不提交此有效载荷
直接的.

## 登记 {#registration}

通常的域名创建使用声明别名设置流程.
SNS 租,所有者能力,报价保护和域名排列在一个原子
`EnsureAlias` 交易. `Register::Domain` 仍然是一个起源/bootstrap
表面,以及 `ledger domain` 命令没有 `register` 副司令官.

创建一个无秘密的 `AliasSetupPlanRequestV1` 意图 SDK 或登机
服务,然后有 CLI 计划与现实状态相反,并提交
计划:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

目的是确定 `payments.universal`, 它的数值数据空间,
I105 租收购期限和当前政策/支付报价保证.
规划器的终点是 `POST /v1/aliases/setup/plan`; 它的返回计划是
连锁,权威,国家和截止日期.
[`Unregister`](/zh-hans/blockchain/instructions.md#un-register).

创建或删除域需要适当的域管理
在主动运行时间验证器下的许可.
[`SetKeyValue` 并且 `RemoveKeyValue`](/zh-hans/blockchain/instructions.md#setkeyvalue-removekeyvalue)
当该部门有权修改该域名时.

## 试着. Taira {#try-it-on-taira}

目前公众可见的域名列表 Taira 测试网:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

将公共路径目录重新映射到数据空间别名:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

使用应用程序需要检查域名是否存在的第一命令.
在需要确认数据空间是否公开时,
限制或落后于核心车道.

域名设置是付费的写作. Taira, 保存
水管助手
[获取测试网 XOR 在 Taira](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
作为 `taira_faucet_claim.py`, 通过公共水龙头资助签署人,
附加费用元数据:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

在重复测试网运行中建立一个独特域名的意图,并使用
Taira 现在的政策和费用资产报价保护.
对于局域网或 Minamoto.

## 与其他实体的关系 {#relationship-to-other-entities}

域名集成账本对象并为域名范围数据提供一个名称空间.
资产定义使用域名合格的标识符,查询可以列出
域名或找到一个域名的目标对象.
在当前的数据模型中没有域名,但账户可以拥有域名并保留
资产的定义属于域.

查看以下内容:

- [世界](/zh-hans/blockchain/world.md)
- [资产](/zh-hans/blockchain/assets.md)
- [数据表](/zh-hans/blockchain/metadata.md)
- [命名规则](/zh-hans/reference/naming.md)
