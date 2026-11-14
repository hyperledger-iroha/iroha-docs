---
translation_locale: zh-hans
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 5fb7abd4e152ece715a8337e8ef8e75330f634d2a1b26e0c5bd8308f1f3793a9
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 通过 CLI 运行 Iroha 3 {#operate-iroha-3-via-cli}

`iroha`二进制是 Iroha 3 的命令行客户端. 使用它查询账本状态,提交交易和检查操作员端点.

## 1.先决条件 {#_1-prerequisites}

首先启动一个本地网络:

- [启动 Iroha 3](./launch-iroha.md)

在 [启动 Iroha 3](./launch-iroha.md)中创建的本地网络中生成的客户端配置:

```bash
./localnet/client.toml
```

## 2. 基本的 CLI 设置 {#_2-basic-cli-setup}

展示最高水平的帮助:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI 分为以下最高级别指挥组:

- `account`：账户读取与修改
- `explorer`：使用共享筛选和分页的浏览器数据流
- `tx`：交易状态和交易辅助操作
- `ledger`用于链上读取和写入
- `trigger`：触发器读取、写入及执行
- `ops` 用于操作员诊断
- `app`用于应用程序的 API 助手
- `contract`：合约调用、查询和本地调试；使用 `kagami contract deploy` 或 `musubi deploy` 部署
- `tools`用于诊断和开发者公用事业
- `dataspace`：规划、应用和检查数据空间定义
- `taira`：Taira 诊断及账户入网
- `offline`：离线编码器、报告及诊断
- `soracloud`：Soracloud 应用平台辅助操作
- `sccp`：SORA 跨链协议的读取、转移及证明

提交交易的每个命令都必须明确指定费用支付方，例如 `--fee-payer authority`；CLI 会在签名前给出准确报价。

使用 `--output-format text`用于人可读操作员输出和 `--machine`用于严格的自动化模式.

## 3. 尝试公共测试网 Taira {#_3-try-the-public-taira-testnet}

在运行本地对等节点或创建签名器之前,您可以尝试仅阅读的 Taira 检查.这些命令使用公共的 Torii JSON 路线,并且不使用测试网 XOR.

检查 Taira 的状态:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

列出 `universal` 数据空间中的公开域：

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

列出一些资产定义及其当前供应:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

如果您有当前的 `iroha`二进制,请运行 Taira 诊断辅助器:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

仅在准备测试签名命令时才创建 `taira.client.toml`。有关配置、水龙头及冒烟测试流程，请参阅[连接 SORA Nexus 数据空间](/zh-hans/get-started/sora-nexus-dataspaces.md)。账户通过水龙头获得费用资产之前，不要向 Taira 执行写入命令。

运行任何 Taira CLI 付费示例前，请按[在 Taira 获取测试网 XOR](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)中带有准备步骤的水龙头流程为签名账户提供资金，然后检查余额：

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

如果水龙头路由返回 `502`，请等待并重试。这是公开测试网的可用性问题，不表示需要重新生成账户密钥。

余额可见后，使用 `--fee-payer authority` 提交写入。CLI 会在签名前以 Taira 的费用资产给出准确报价：

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. 基本账本指令 {#_4-basic-ledger-commands}

列出所有域名:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

普通域名创建使用声明别名计划器; `ledger domain` 命令没有 `register` 准备一个无秘密的机器. `AliasSetupPlanRequestV1` 目的 `docs.universal` 和你的 SDK 或安装服务,然后规划并应用:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

意图固定数据空间标识、规范所有者账户、租期和当前报价校验条件。规划器验证在线状态，并返回待提交的准确原子 `EnsureAlias` 计划。不要从其他网络手动复制校验条件值。

发送一个简单的ping交易:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

阅读最近的区块或订阅区块事件:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. 操作员指挥 {#_5-operator-commands}

共识运维命令要求使用列入允许列表的运行时密钥。不要将其放入 `client.toml`；应通过绝对路径提供仅允许所有者访问的密钥文件：

```bash
: "${OPERATOR_KEY_FILE:=$PWD/secrets/operator.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

无权威排队,管道,选举和通道诊断:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

已提交的共识执行通道及本节点的实例状态：

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

链上共识参数:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. 接下来要去哪里 {#_6-where-to-go-next}

- [SDK 教程](/zh-hans/guide/tutorials/)
- [Torii 端点](/zh-hans/reference/torii-endpoints.md)
- [与 Iroha 二进制](/zh-hans/reference/binaries.md) 合作
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

要从源码工作副本打印完整的 Markdown 帮助快照，请运行：

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
