---
translation_locale: zh-hans
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 资产 {#assets}

一个 Iroha 资产是一个账户持有的数值余额.每个具体的余额指向一个 `AssetDefinition`,定义描述了该资产可以如何命名,造,显示和分区.

## 资产的定义 {#asset-definition}

一个 `AssetDefinition` 包含:

- `id`:资产定义规范地址
- `name`:可以读取的人类显示名称
- `description`:可供人类阅读的选择性描述
- `alias`:在`<name>#<domain>.<dataspace>`或 `<name>#<dataspace>`表格中使用可选的别名
- `spec`:对平衡的数值精度和限制
- `mintable`:可接受性政策
- `logo`:可选的 `SoraFS` URI
- `metadata`:任意的关键值元数据
- `balance_scope_policy`:资产负债是否是全球性或数据空间有限的
- `owned_by`:已注册或拥有定义的账户
- `total_quantity`:发行总量
- `confidential_policy`:保护资产运营的政策

资产定义 IDs 是正规的不透明地址.当从域名和名称构建一个定义时, Iroha 可以保留该域名/名称投影为 UX 和查询,但正规的文本形式就是生成的地址.

## 资产平衡 {#asset-balance}

一个 `Asset` 包含:

- `id`:结合资产定义,持有者账户和可选余额范围的`AssetId`
- `value`:一个 `Numeric`的余额

持有者账户是规范性的,无域名的.资产定义可以在一个数据空间合格的域名下进行预测,例如 `payments.universal`.

## 料可使用 {#mintability}

资产定义支持以下可 mintability模式:

|模式|这意味着|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely`|弹性供应.资产可以多次造和燃烧. |
|`Once`|固定供应代币,可以一次造,然后烧掉.|
|`Not`|固定供应的代币可以被烧毁,但不能再发明.|
|`Limited(n)`|该政策允许在有限数量的额外交易中发行新资产单元. |

使用 `Infinitely`用于正常弹性资产和`Once`或 `Limited(n)`用于固定供应或有限供应的资产.除非资产供应已经确定,否则不要作为初始政策使用 `Not`.

## 资产负债范围 {#balance-scope}

`balance_scope_policy` 控制了平衡的运行方式:

- `Global`:每个账户和资产定义的1个余额桶
- `DataspaceRestricted`:按数据空间背景划分了余额

在多个 Nexus 数据库中使用相同资产定义时,数据空间限制的余额是有用的,但必须保持孤立的余额.

## 在 Taira 试看. {#try-it-on-taira}

这些只可阅读的呼叫显示了公共 Taira 测试网上的实际资产定义:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

找当前 Taira XOR 费用资产定义:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

寻找含有元数据的定义:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

所有三种例子都是可以读的. Taira, 使用水龙头资助的账户和保证流量 [连接到 SORA Nexus 数据库](/zh-hans/get-started/sora-nexus-dataspaces.md).

在付费资产 Taira 示例中,保存从 [获取 Taira](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)上测试网 XOR 为 `taira_faucet_claim.py`,然后首先索赔水龙头资产并将其作为交易气体资产:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

然后在 `ledger asset mint`,`ledger asset burn`和 `ledger asset transfer`命令中输入 `--metadata ./taira.tx-metadata.json`.

## 指示 {#instructions}

资产可以以 Iroha 特殊指令进行注册,造,燃烧和转让:

- [`Register`和 `Unregister`](/zh-hans/blockchain/instructions.md#un-register)
- [`Mint`和 `Burn`](/zh-hans/blockchain/instructions.md#mint-burn)
- [`Transfer`](/zh-hans/blockchain/instructions.md#transfer)
- [`SetKeyValue`和 `RemoveKeyValue`](/zh-hans/blockchain/instructions.md#setkeyvalue-removekeyvalue)

此外,请参见:

- [CLI 指南](/zh-hans/get-started/operate-iroha-via-cli.md)
- [Rust 教程](/zh-hans/guide/tutorials/rust.md)
- [Python 教程](/zh-hans/guide/tutorials/python.md)
- [JavaScript/TypeScript 教程](/zh-hans/guide/tutorials/javascript.md)
- [数据模型](/zh-hans/blockchain/data-model.md)
- [NFTs](/zh-hans/blockchain/nfts.md)
