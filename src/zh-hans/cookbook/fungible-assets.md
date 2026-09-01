---
translation_locale: zh-hans
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 性资产 {#fungible-assets}

## 结果 {#outcome}

现场检查 Taira 资产定义和完成一个注册表,铸造,转账,销毁和余额验证在生成的本地网络上流动.该操作指南使用了可信无序Base58资产定义 IDs, 域名类别,无域名 I105 账户 IDs, 和明确的费用支付.

## 预先条件 {#prerequisites}

- `curl`, `jq`, Python 3.11或以后, Node.js 24,和目前的 `iroha` CLI.
- 仅可读的 Taira 访问.
- 对于写入演练,一个来自 [启动 Iroha](/zh-hans/get-started/launch-iroha.md), 与 `./localnet/client.toml` 和 Torii 在 `http://127.0.0.1:8080`.

## 步骤 {#steps}

### 1. 检查 Taira 的定义,没有签字者 {#_1-inspect-taira-definitions-without-a-signer}

资产定义包含一个不透明的Base58 ID,显示名称,可选性政策,数量尺度,可选别名,所有者和总数.具体余额还包括其持有人帐户和可选数据空间范围.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
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

从生成的配置中取得公钥并据此推导本地 authority，然后选择另一个已注册账户作为接收者。此操作不会输出任何私钥。

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
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

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. 记录一个数字定义 {#_3-register-a-numeric-definition}

这个仅在本地使用的 ID 是一个有效的无前置 Base58 资产定义地址.这个别名提供了人类可读的 `domain.dataspace`投影.尺度 `2`允许两个分数数字;省略`--mint-once`则保持默认的 `Infinitely` 政策.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

在 Taira 上不要再使用 ID. 公共网络注册需要新的规范文件 ID,为您的申请分配的域名/代号,费用资金和运行期的资产注册许可.

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

在销毁后,预计来源余额 `64.50`,目的地余额 `25.50`和总量 `90.00`.

::: warning 许可范围

在 Taira 上,添加自水龙头衍生的 `taira.tx-metadata.json`并使用`--fee-payer authority`为每次写.注册和造需要活跃验证者的许可;转移和烧毁需要对源余额的授权主体.一个由水龙头资助的账户不会自动成为发行人.

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
- 第 2 步有意选择已注册的目标账户。如果资产准入策略为 `ExplicitOnly`，请在转账前通过授权流程预置目标余额。名称相似的 CLI 保护选项不会注册账户或余额；它会中止操作，而不是再添加一条指令。
- 在正常指示成功之前,收费被拒绝. 选择付款人,使用网络的收费资产元数据,并验证其余额.
- 如果固定的本地定义已经存在于之前的运行中,请启动新生成的本地网络或继续其现有的状态.永远不要替代错误成形的随机字符串为 Base58 ID.

## 来源及相关文件 {#source-and-related-docs}

- [资产生命周期集成测试在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust 固定提交的资产构建例子](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [资产](/zh-hans/blockchain/assets.md)
- [指示](/zh-hans/blockchain/instructions.md)
- [许可证代币](/zh-hans/reference/permissions.md)
- [JavaScript 和 TypeScript](/zh-hans/guide/tutorials/javascript.md)
