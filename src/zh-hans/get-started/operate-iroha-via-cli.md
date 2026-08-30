---
translation_locale: zh-hans
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 0a0a0735015dee015da76d5a9f5d174f8ae8b2ad67ff8924d9596850a33fc1c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 通过 CLI 运行 Iroha 3 {#operate-iroha-3-via-cli}

`iroha`二进制是 Iroha 3 的命令行客户端. 使用它查询账本状态,提交交易和检查操作员终点.

## 1.先决条件 {#_1-prerequisites}

首先启动一个本地网络:

- [发射 Iroha 3](./launch-iroha.md)

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

- `account` 针对账户指导的快捷方式
- `tx` 对于交易级助理
- `ledger`用于账本阅读和写作
- `ops` 用于操作员诊断
- `app`用于应用程序的 API 助手
- `contract` 关于合同部署和调用
- `tools`用于诊断和开发者公用事业
- `taira` 对于 Taira 和 Nexus- 工作流程

`ledger`集团还包含特定领域的交易助理,如`ledger transaction`.

使用 `--output-format text`用于人可读操作员输出和 `--machine`用于严格的自动化模式.

## 3. 尝试公共测试网 Taira {#_3-try-the-public-taira-testnet}

在运行本地同行或创建签名器之前,您可以尝试仅阅读的 Taira 检查.这些命令使用公共的 Torii JSON 路线,并且不使用测试网 XOR.

检查 Taira 的状态:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

列出 `universal` 数据空间中的公共域名:

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

仅在准备测试签署命令时创建 `taira.client.toml`.查看[连接到 SORA Nexus 数据库](/zh-hans/get-started/sora-nexus-dataspaces.md)为配置,龙头和加拿大流量.直到账户通过龙头费资产融资之前,不要对 Taira 进行写字命令.

对于任何付费 Taira CLI 例如,拯救水龙头辅助器 [获取测试网 XOR 在 Taira](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) 作为 `taira_faucet_claim.py`, 然后索赔测试网 XOR 首先:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

如果水龙头拼图或索赔路线返回 `502`,请等待,再试一次.这是一个公共测试网可用性问题,而不是一个重建账户密钥的信号

在余额可见后,附加费用资产的元数据以写:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. 基本账本指令 {#_4-basic-ledger-commands}

列出所有域名:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

常规域名创建使用声明别名计划器; `ledger domain` 命令没有 `register` 准备一个无秘密的机器. `AliasSetupPlanRequestV1` 目的 `docs.universal` 和你的 SDK 或安装服务,然后规划并应用:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

意图键是数据空间 ID,常规所有者帐户,租期限和当前报价保护.计划器验证现实状态并返回提交的精确原子`EnsureAlias`计划.不要手动复制其他网络的保护值.

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

意见共识状态:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

一阶段延迟快照:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

可用性,收藏器, RBC 后期记录和 VRF 快照:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

链上共识参数:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. 接下来要去哪里 {#_6-where-to-go-next}

- [SDK 教程](/zh-hans/guide/tutorials/)
- [Torii 终端点](/zh-hans/reference/torii-endpoints.md)
- [与 Iroha 二进制](/zh-hans/reference/binaries.md) 合作
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

为了从源检查中恢复一个完整的Markdown帮助快照,运行:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
