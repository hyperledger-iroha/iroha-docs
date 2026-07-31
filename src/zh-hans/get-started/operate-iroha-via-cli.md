---
translation_locale: zh-hans
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 运行 Iroha 3 通过 CLI {#operate-iroha-3-via-cli}

其他 `iroha` 二进制是命令行客户端 Iroha 3. 使用它查询
报告账本,提交交易和检查运营商终点.

## 1.先决条件 {#_1-prerequisites}

首先启动一个本地网络:

- [发射 Iroha 3](./launch-iroha.md)

下面的例子假设来自本地网络的客户端配置
创建于 [发射 Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2.基本 CLI 设置 {#_2-basic-cli-setup}

让我们看到最好的帮助:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

其他 CLI 组织成以下最高级别的指挥组:

- `account` 针对会计指导的快捷方式
- `tx` 对于交易层次的助理
- `ledger` 在账本上读写
- `ops` 用于操作员诊断
- `app` 应用程序 API 助手
- `contract` 合同部署和调用
- `tools` 用于诊断和开发人员公用事项
- `taira` 对于 Taira 并且 Nexus- 工作流程

其他 `ledger` 集团还包含特定领域的交易助手,如
`ledger transaction`.

使用 `--output-format text` 用于人类可读的操作员输出, `--machine`
严格自动化模式.

## 3. 试着向公众讲 Taira 测试网 {#_3-try-the-public-taira-testnet}

你可以试看. Taira 在运行本地同行或创建一个
这些命令使用公开 Torii JSON 航线和不花费测试网
XOR.

检查 Taira 卫生:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

列出公共域名 `universal` 数据空间:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

列出一些资产定义及其当前供应:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

如果你有电流 `iroha` 运行 Taira 诊断助理:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

创建 `taira.client.toml` 只有当你准备测试签署的命令时.
看看 [连接到 SORA Nexus 数据库](/zh-hans/get-started/sora-nexus-dataspaces.md)
对于机组,水龙头和鱼流.不要写命令
Taira 在该账户由水龙头费资产融资之前.

任何收费 Taira CLI 例如,拯救水龙头助手
[获取测试网 XOR 在 Taira](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
作为 `taira_faucet_claim.py`, 然后索赔测试网 XOR 首先:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

如果水龙头拼图或索赔路径返回 `502`, 等待再试一次.
公共测试网可用性问题,而不是一个重建账户密钥的信号.

在余额可见后,附加费用资产的元数据以写:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. 基本账本命令 {#_4-basic-ledger-commands}

列出所有域名:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

通常域名创建使用声明别名规划器; `ledger
domain` 命令没有 `register` 准备一个无秘密的机器人.
`AliasSetupPlanRequestV1` 目的 `docs.universal` 在你的 SDK 或
登机服务,然后规划并应用:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

意图入数据空间 ID, 常规所有者账户,租期限和
规划器检查现场状态,并返回精确的
原子能 `EnsureAlias` 不要从另一个人手头复制保护值.
网络.

发送一个简单的ping交易:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

阅读最近的区块或订阅区块事件:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. 操作员指挥 {#_5-operator-commands}

共识状况:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

每个阶段延迟快照:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

收藏器, RBC 后载量,以及 VRF 快照:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

连锁共识参数:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. 接下来要去哪里? {#_6-where-to-go-next}

- [SDK 教程](/zh-hans/guide/tutorials/)
- [Torii 终点](/zh-hans/reference/torii-endpoints.md)
- [合作 Iroha 二进制](/zh-hans/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

要从源检查中重新创建一个完整的Markdown帮助快照,运行:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
