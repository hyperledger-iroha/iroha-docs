---
translation_locale: zh-hans
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 性资产 {#fungible-assets}

## 结果 {#outcome}

检查线上 Taira 网络的资产定义，并在生成的本地网络上完成铸造、转账、销毁和余额验证流程。本操作指南使用规范的无前缀 Base58 资产定义 ID、无域名的 I105 账户 ID，以及明确的费用支付。

## 预先条件 {#prerequisites}

- `curl`、`jq`、Python 3.11 或更高版本、Node.js 24，以及目前的 `iroha` 和 `kagami` CLIs。
- 仅可读的 Taira 访问.
- 对于写入演练，需要一个按照 [启动 Iroha](/zh-hans/get-started/launch-iroha.md) 的做法，以 `kagami localnet generate --peers 4 --out-dir ./localnet` 并加上 `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa` 生成的本地网络。它提供 `./localnet/client.toml`，以及位于 `http://127.0.0.1:8080` 的 Torii。

## 步骤 {#steps}

### 1. 检查 Taira 的定义,没有签字者 {#_1-inspect-taira-definitions-without-a-signer}

资产定义包含不透明的 Base58 ID、显示名称、可铸造性政策、数量尺度、可选别名、所有者、可选的所属域名或数据空间、余额政策，以及总数量。具体余额还包括其持有人账户和可选的数据空间范围。

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

运行 JavaScript 版本使用 `node taira-assets.mjs`.公共资产 IDs 是空白的Base58值;可读的值如 `cookbook_credit#wonderland.universal`是一个以其中一个 IDs 为代号的代号.

### 2. 准备本地授权账户和目的地 {#_2-prepare-the-local-authority-and-destination}

从生成的配置中取得公钥并据此推导本地 authority，然后为新的接收者账户创建密钥对并注册该账户。此操作不会输出任何私钥。

```bash
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. 使用由客户端拥有的数值定义 {#_3-use-a-client-owned-numeric-definition}

在创世之外，定义会注册在签名者所拥有的所属 `--domain` 之下，而生成的本地网络的客户端并不拥有任何域名。以 `--asset-definition-id` 生成的本地网络已经包含此定义：创世以不受限制的尺度注册了它，将客户端设为其所有者，并向客户端铸造了 1,000,000,000 个单位。

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

不要在 Taira 上重复使用该 ID。公共网络注册需要一个新的规范 ID、一个由您的账户拥有的所属域名（作为 `--domain` 传给 `ledger asset definition register`）、任何别名所需的 `CanManageAssetDefinitionAlias` 授权，以及费用资金。

### 4. 铸造,转移和销毁 {#_4-mint-transfer-and-burn}

所有写入命令都明确选择授权主体作为费用付款人. CLI 在签署之前报价了准确的交易,并默认等待.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

在销毁后,预计来源余额 `1000000064.50`,目的地余额 `25.50`和总量 `1000000090.00`.

::: warning 许可范围

在 Taira 上，每次写入都要使用 `--fee-payer authority`；CLI 会在签名前给出以 Taira 费用资产计价的确切费用报价。注册需要拥有定义的 `--domain`，别名还需要 `CanManageAssetDefinitionAlias`。铸造需要拥有该定义，或持有 `CanMintAssetWithDefinition` 或 `CanMintAssetToAccount`；转移和销毁需要拥有对来源余额的权限。由水龙头注资的账户不会自动成为发行人。

:::

## 验证 {#verify}

先读取两个实际余额，再读取资产定义。这些 post-state 查询才是成功标准；仅有 submission receipt 并不足以证明成功。

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

应用声明应比较数字值作为固定点数,而不是二进制浮点值,并应当验证定义 ID 以及帐户.

## 解决问题 {#troubleshooting}

- 包含 ID 的 `#` 是一个字面别名或具体余额字面值,而不是一项规范资产定义 ID.使用`--definition`的裸体Base58值,或者通过`--definition-alias`的绑定别名.
- `Scale` 错误意味着一个数量比定义允许的多个分数.
- `Mintability`拒绝是指`Once`, `Not`或 `Limited(n)`的政策已经耗尽或禁止造.不要重写历史记录;使用定义查询返回的政策.
- 第 2 步显式注册目标账户，因此即使账户准入策略为 `ExplicitOnly`，转账也能正常进行。名称相似的 CLI 保护选项不会注册账户或余额；它会中止操作，而不是再添加一条指令。
- 费用拒绝会在指令正常成功之前发生。请选择付款人，检查 CLI 费用报价中的费用资产和最高金额，并验证该余额。
- 在同一个本地网络上重新运行时，会从先前的余额开始，而且 `kagami keys` 会拒绝已存在的 `./cookbook-recipient`。请启动新生成的本地网络并删除该目录，或改为比较余额的变化而非绝对值。永远不要用格式错误的随机字符串替代 Base58 ID。

## 来源及相关文件 {#source-and-related-docs}

- [资产生命周期集成测试在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust 固定提交的资产构建例子](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [资产](/zh-hans/blockchain/assets.md)
- [指示](/zh-hans/blockchain/instructions.md)
- [许可证代币](/zh-hans/reference/permissions.md)
- [JavaScript 和 TypeScript](/zh-hans/guide/tutorials/javascript.md)
