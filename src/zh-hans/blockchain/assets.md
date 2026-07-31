---
translation_locale: zh-hans
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 资产 {#assets}

一个 Iroha 资产是账户持有的数值余额.
均衡指数为 `AssetDefinition`, 而定义描述了如何
该资产可以命名,造,显示和分类.

## 资产定义 {#asset-definition}

一个 `AssetDefinition` 含有:

- `id`: 规范性资产定义地址
- `name`: 人能读取的显示名称
- `description`: 可读于人类的可选描述
- `alias`: 选用别名 `<name>#<domain>.<dataspace>` 或
  `<name>#<dataspace>` 形式
- `spec`: 数字精度和对平衡的限制
- `mintable`: 适用性政策
- `logo`: 选择性 `SoraFS` URI
- `metadata`: 任意的关键值元数据
- `balance_scope_policy`: 资产负债表是否是全球性的,
  数据空间限制
- `owned_by`: 注册或拥有定义的账户
- `total_quantity`: 发行的总量
- `confidential_policy`: 保护资产运营政策

资产定义 IDs 它们是可信的不透明地址.
由一个域名和名称构建, Iroha 可以保留这个域名
预测 UX 而正如图所示,
收到的地址

## 资产平衡 {#asset-balance}

一个 `Asset` 含有:

- `id`: 一个 `AssetId`, 结合资产定义,持有人账户,
  和可选的余额范围
- `value`: 一个 `Numeric` 平衡

持有者账户是法规的,无域名.
例如,在一个数据空间合格域下进行投影
`payments.universal`.

## 存性 {#mintability}

资产定义支持以下可 mintability模式:

| 模式         | 含义                                                           |
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` | 这种资产可以多次造和燃烧.    |
| `Once`       | 固定供应代币,可以一次造然后烧掉.        |
| `Not`        | 固定供应代币可以被烧毁,但不能再发明.       |
| `Limited(n)` | 在有限数量的额外操作中允许造. |

使用 `Infinitely` 对于正常弹性资产和 `Once` 或 `Limited(n)` 对于
固定供应或有限供应的资产. `Not` 作为一个初始
除非资产供应已经确定.

## 平衡范围 {#balance-scope}

其他 `balance_scope_policy` 控制平衡的运行方式:

- `Global`: 每个账户和资产定义的一个余额桶
- `DataspaceRestricted`: 根据数据空间背景进行分区

当相同的资产定义是
在多个领域使用 Nexus 数据空间,但平衡必须保持孤立.

## 试着. Taira {#try-it-on-taira}

这些只能阅读的电话显示了真正的资产定义 Taira 测试网:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

找到电流 Taira XOR 费用资产定义:

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

所有三种例子都是读的. Taira, 使用一个
水所资助的账户和监控流量
[连接到 SORA Nexus 数据库](/zh-hans/get-started/sora-nexus-dataspaces.md).

为了支付费用 Taira 资产例子,保存水龙头辅助器
[获取测试网 XOR 在 Taira](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
作为 `taira_faucet_claim.py`, 然后首先索取水龙头资产,并将其作为
交易气体资产:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

然后包括 `--metadata ./taira.tx-metadata.json` 在 `ledger asset mint`,
`ledger asset burn`, 并且 `ledger asset transfer` 命令.

## 指示 {#instructions}

资产可以注册,造,燃烧和转移 Iroha
特别指示:

- [`Register` 并且 `Unregister`](/zh-hans/blockchain/instructions.md#un-register)
- [`Mint` 并且 `Burn`](/zh-hans/blockchain/instructions.md#mint-burn)
- [`Transfer`](/zh-hans/blockchain/instructions.md#transfer)
- [`SetKeyValue` 并且 `RemoveKeyValue`](/zh-hans/blockchain/instructions.md#setkeyvalue-removekeyvalue)

查看以下内容:

- [CLI 指南](/zh-hans/get-started/operate-iroha-via-cli.md)
- [Rust 教程](/zh-hans/guide/tutorials/rust.md)
- [Python 教程](/zh-hans/guide/tutorials/python.md)
- [JavaScript/TypeScript 教程](/zh-hans/guide/tutorials/javascript.md)
- [数据模型](/zh-hans/blockchain/data-model.md)
- [NFTs](/zh-hans/blockchain/nfts.md)
