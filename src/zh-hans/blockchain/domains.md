---
translation_locale: zh-hans
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 域名 {#domains}

域名是注册的名称空间 `World`. 在当前 Iroha 3 数据模型一个域名由其母数据空间资格化,因此正义标识符是:

```text
domain.dataspace
```

例如, `payments.universal` 在 `universal` 数据空间内命名`payments`域名.

## 结构 {#structure}

已注册的 `Domain` 包含:

- `id`:有数据空间资格的 `DomainId`
- `logo`:域名标志的可选标志`SoraFS` URI
- `metadata`:任意的关键值元数据
- `owned_by`:域名所有权的账户,通常是注册该域名的帐户

启动带有效载荷用于实现域名是 `NewDomain`.它携带`id`,可选 `logo`和初始 `metadata`.运行时间从权威填写`owned_by`.普通客户不会直接提交这种有效载荷.

## 登记 {#registration}

通常的域名创建使用声明别名设置流程.这将 SNS 租协议,所有者功能,报价保护和域名行保持在一个原子 `EnsureAlias`交易中.`Register::Domain`仍然是基因/bootstrap表面,并且`ledger domain`命令没有`register`子命令.

通过 SDK 或登录服务创建一个无秘密的 `AliasSetupPlanRequestV1` 意图,然后让 CLI 与现实状态进行计划,并提交那个准确的计划:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

意图确定`payments.universal`,其数值数据空间,正规 I105 所有者,租收购期限以及当前的政策/支付报价监护人.规划者终点是 `POST /v1/aliases/setup/plan`;其返回的计划是链,权威,州和截止日期.域移除仍然使用[`Unregister`](/zh-hans/blockchain/instructions.md#un-register).

创建或删除域名需要在主动运行时间验证器下获得适当的域管理权限. 当当局有权修改该域名时,域名元数据可以通过 [`SetKeyValue`和 `RemoveKeyValue`](/zh-hans/blockchain/instructions.md#setkeyvalue-removekeyvalue)更新.

## 在 Taira 试看. {#try-it-on-taira}

列出目前在公共测试网 Taira 上可见的域名:

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

在应用程序需要检查域名是否存在时使用第一个命令.在需要确认数据空间是否是公开,限制或落后于核心线路时,使用行径目录.

域名设置是一个付费的写作. Taira, 拯救水龙头助手 [获取测试网 XOR 在 Taira](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) 作为 `taira_faucet_claim.py`, 通过公共水龙头为签署者提供资金,并附加费用元数据:

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

在重复测试网络运行中建立一个独特域名的意图,并使用 Taira 的当前政策和费用资产报价保护.不要再利用为 localnet 或 Minamoto 制作的计划.

## 与其他实体的关系 {#relationship-to-other-entities}

域名集成账本对象,为域名扩展的数据提供一个名称空间.资产定义使用域名合格标识符,查询可以列出域名或找到在当前数据模型中,帐户本身是无域的,但账户可以拥有域和持有其定义在域下存在的资产.

此外,请参见:

- [世界](/zh-hans/blockchain/world.md)
- [资产](/zh-hans/blockchain/assets.md)
- [超值数据](/zh-hans/blockchain/metadata.md)
- [命名规则](/zh-hans/reference/naming.md)
