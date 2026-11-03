---
translation_locale: zh-hans
translation_source: /cookbook/metadata.md
translation_source_hash: 88298912f083d79a9fdfe5e8d0a89d49acb97d814d3871db0c874cb40db5342b
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 超级数据 {#metadata}

## 结果 {#outcome}

读取 Taira 上的元数据，使用明确支付费用的交易设置并验证一个账户元数据值，然后再次移除该值。您将把账本对象元数据与交易元数据分开。

## 预先条件 {#prerequisites}

- `curl`,`jq`, Python 3.11或以后的电流,以及 `iroha` CLI.
- 来自 [连接到 Taira](./connect-to-taira.md) 且已注资的 `taira.client.toml`。
- 对目标帐户的元数据进行授权主体.该示例针对配置授权主体本身;另一个帐户需要准确的许可.

## 步骤 {#steps}

### 1. 没有签字者阅读元数据 {#_1-read-metadata-without-a-signer}

元数据是经过检查的 `Name` 到 JSON 的映射。空映射和经过筛选的空输出都是有效结果。

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[]
    | select((.metadata // {} | length) > 0)
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

使用小描述或索引字段的元数据.将大型有效载荷从账本中删除,而不是存储 URI 或 SoraFS 引用.

### 2. 导出目标账户 {#_2-derive-the-target-account}

仅从 Taira 配置中阅读公钥,并将其转换为无域名的法规形式 I105.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
```

### 3. 设置一个值 JSON {#_3-set-one-json-value}

从标准输入读取的 JSON 会成为账户的 `cookbook_profile` 值。交易元数据通过 `--metadata <file>` 附加，是交易封装上另一个独立的映射，并且从不选择费用：选择费用的是 `--fee-payer` 和 CLI 的确切费用报价；此外，客户端会拒绝包含 `gas_asset_id`、`gas_limit` 或 `fee_sponsor` 键的交易元数据。

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI 会在签名前给出以 Taira 费用资产计价的确切费用报价，然后提交，并在返回前等待 Applied 最终性。

::: warning 许可范围

当前生效的执行器决定谁可以变更每个对象。更新另一个账户通常需要 `CanModifyAccountMetadata`；域名、资产定义、NFTs 和触发器各自有针对目标的元数据权限。如果 Taira 尚未授予所需的权限，请使用 `./localnet/client.toml` 运行相同的账户命令，并换成所生成本地网络授权主体的规范 I105 ID。保留明确的本地费用付款人选择。

:::

### 4. 移除钥匙 {#_4-remove-the-key}

首先读取提交值,然后提交单独的移动交易.

```bash
iroha --config ./taira.client.toml --machine account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

对于 Python 应用程序,符合类型的构建器是`Instruction.set_account_key_value`和`Instruction.remove_account_key_value`;提交它们与交易元数据以及从 [Python 教程](/zh-hans/guide/tutorials/python.md#shared-setup)的等待辅助员.

## 验证 {#verify}

在设置交易后, `meta get`必须将对象返回以 `version: 1`.在删除之后,直接搜索不再可以返回一个值:

```bash
iroha --config ./taira.client.toml --machine account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

单独账户读取区分缺失的元数据密钥与网络或帐户故障.生产代码也应在设置后验证整个 JSON 值.

## 解决问题 {#troubleshooting}

- 标准输入必须包含一个有效的 JSON 值.字符串需要 JSON 报价;对象和阵列必须是很好的.
- 分析后,元数据密钥是`Name`值,并且对案例敏感.保持稳定的关键词汇,而不是为每一个方案更改创建版本密钥.
- `--metadata`是交易元数据;它不设置账本对象元数据.使用实体的`meta set`子命令用于后者.
- 一个成功提交后的旧阅读可能会延迟传播. 等待应用终结,然后在重新提交之前再试查询.
- 权限拒绝会标识目标对象和权限边界。在本地演练或申请确切的令牌；不要为了绕过访问控制而把私有应用数据移到公开的元数据字段。
- 永远不要将私钥,原始的个人标识符,访问代币或大型文件存储在元数据中.

## 来源及相关文件 {#source-and-related-docs}

- [在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/queries/metadata.rs)中测试对元数据查询集成
- [Python SDK 交易构建者在固定的提交上](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/README.md)
- [超值数据](/zh-hans/blockchain/metadata.md)
- [大数据和账本存储的选择](/zh-hans/guide/configure/metadata-and-store-assets.md)
- [指示参考](/zh-hans/reference/instructions.md)
- [许可证代币](/zh-hans/reference/permissions.md)
