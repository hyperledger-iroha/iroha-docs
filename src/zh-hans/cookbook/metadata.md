---
translation_locale: zh-hans
translation_source: /cookbook/metadata.md
translation_source_hash: 238595124cd0a1b71900020d650fb208f844e051d2db4427801fe6405ff591c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 超级数据 {#metadata}

## 结果 {#outcome}

阅读 Taira 上的元数据,设置和验证一个帐户元数据值,使用明确支付费用的交易,然后再次删除该价值.您将将本书对象元数据与交易费用元数据分开.

## 预先条件 {#prerequisites}

- `curl`,`jq`, Python 3.11或以后的电流,以及 `iroha` CLI.
- 资助的 `taira.client.toml`和`taira.tx-metadata.json`从 [连接到 Taira](./connect-to-taira.md).
- 对目标帐户的元数据进行权威.该示例针对配置权威本身;另一个帐户需要准确的许可.

## 步骤 {#steps}

### 1. 没有签字者阅读元数据 {#_1-read-metadata-without-a-signer}

测量数据是检查的`Name`到 JSON 地图.空地图和空的过输出是有效的结果.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
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

从标准输入中读取的 JSON 成为账户的 `cookbook_profile` 值.相反,`--metadata ./taira.tx-metadata.json` 将费用字段添加到交易包裹中.这两个地图具有不同的目标和目的.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI 默认引用费用,签字,提交和等待. 当下一次操作取决于此值时,不要添加 `--no-wait`.

::: warning 许可范围

活跃验证器决定谁可以突变每个对象.更新另一个帐户通常需要 `CanModifyAccountMetadata`;域名,资产定义, NFTs,并触发器有自己的目标特定的元数据权限.如果 Taira 没有授予所需权限,运行相同的帐户命令与 `./localnet/client.toml`,替代生成的本地网络权威机构的常规 I105 ID,并省略 Taira 费用元数据文件. 保持明确的本地支付费者选择.

:::

### 4. 移除钥匙 {#_4-remove-the-key}

首先读取承诺值,然后提交单独的移动交易.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

对于 Python 应用程序,符合类型的构建器是`Instruction.set_account_key_value`和`Instruction.remove_account_key_value`;提交它们与交易元数据以及从 [Python 教程](/zh-hans/guide/tutorials/python.md#shared-setup)的等待辅助员.

## 验证 {#verify}

在设置交易后, `meta get`必须将对象返回以 `version: 1`.在删除之后,直接搜索不再可以返回一个值:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
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
- 拒绝许可识别目标对象和权限边界. 在本地进行反或要求准确的代币;不要将私人应用数据移动到公开的元数据领域以避免访问控制.
- 永远不要将私钥,原始的个人标识符,访问代币或大型文件存储在元数据中.

## 来源及相关文件 {#source-and-related-docs}

- [在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)中测试对元数据查询集成
- [Python SDK 交易构建者在固定的承诺上](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [超值数据](/zh-hans/blockchain/metadata.md)
- [大数据和账本存储的选择](/zh-hans/guide/configure/metadata-and-store-assets.md)
- [指示参考](/zh-hans/reference/instructions.md)
- [许可证代币](/zh-hans/reference/permissions.md)
