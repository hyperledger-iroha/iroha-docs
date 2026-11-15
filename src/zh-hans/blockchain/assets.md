---
translation_locale: zh-hans
translation_source: /blockchain/assets.md
translation_source_hash: f5f0eb99e76287db695cc21b8580fd2a9b4dc2a989237c1a1d3d7333c14561ce
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 资产 {#assets}

一个 Iroha 资产是一个账户持有的数值余额.每个具体的余额指向一个 `AssetDefinition`,定义描述了该资产可以如何命名、铸造、显示和分区.

## 资产的定义 {#asset-definition}

一个 `AssetDefinition` 包含:

- `id`:资产定义规范地址
- `name`:可以读取的人类显示名称
- `description`:可供人类阅读的选择性描述
- `alias`:在`<name>#<domain>.<dataspace>`或 `<name>#<dataspace>`形式中使用可选的别名
- `spec`:对余额的数值精度和限制
- `mintable`:可接受性政策
- `logo`:可选的 `SoraFS` URI
- `metadata`:任意的关键值元数据
- `balance_scope_policy`：余额是全局可用，还是受数据空间限制
- `owning_domain`：由域拥有的定义所属的域；直接在数据空间中注册的定义不含此字段
- `owned_by`:已注册或拥有定义的账户
- `total_quantity`:发行总量
- `confidential_policy`:保护资产运营的政策

资产定义 IDs 是规范的不透明地址.当从域名和名称构建一个定义时, Iroha 可以保留该域名/名称投影为 UX 和查询,但规范的文本形式就是生成的地址.

## 资产余额 {#asset-balance}

一个 `Asset` 包含:

- `id`:结合资产定义,持有者账户和可选余额范围的`AssetId`
- `value`:一个 `Quantity`的余额

持有者账户采用规范标识且不包含域。资产定义可以投影到由数据空间限定的域下，例如 `payments.universal`。

## 料可使用 {#mintability}

资产定义支持以下可 mintability模式:

|模式|这意味着|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely`|弹性供应.资产可以多次铸造和销毁. |
|`Once`|固定供应代币,只能铸造一次,之后可以销毁.|
|`Not`|固定供应代币可以销毁,但不能再次铸造.|
|`Limited(n)`|该政策允许在有限数量的额外交易中发行新资产单元. |

使用 `Infinitely`用于正常弹性资产和`Once`或 `Limited(n)`用于固定供应或有限供应的资产.除非资产供应已经确定,否则不要作为初始政策使用 `Not`.

## 资产负债范围 {#balance-scope}

`balance_scope_policy` 控制了余额的运行方式:

- `Global`:每个账户和资产定义的1个余额桶
- `DataspaceRestricted`：按数据空间上下文划分余额

当多个 SORA Nexus 数据空间共用同一资产定义，但余额必须保持隔离时，可以使用受数据空间限制的余额。

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

这三个示例都是读取操作。要在 Taira 上铸造、销毁或转移资产，请使用通过水龙头获得资金的账户，并遵循[使用 Taira 和 Minamoto 在 SORA Nexus 上开发](/zh-hans/get-started/sora-nexus-dataspaces.md)中的受校验流程。

对于需要支付费用的 Taira 资产示例，先按[在 Taira 获取测试网 XOR](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)中带有准备步骤的水龙头流程，为签名账户提供资金。然后在 `ledger asset mint`、`ledger asset burn` 和 `ledger asset transfer` 命令中传入 `--fee-payer authority`；CLI 会在签名前以 Taira 的费用资产给出准确报价：

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "<ASSET_DEFINITION_BASE58>" \
  --account "<TAIRA_I105_ACCOUNT_ID>" \
  --to "<RECIPIENT_I105_ACCOUNT_ID>" \
  --quantity 1
```

## 指示 {#instructions}

资产可以以 Iroha 特殊指令进行注册,铸造,销毁和转让:

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
