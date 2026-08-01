---
translation_locale: zh-hans
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 23b3ddbdadb0d177b2b12de60e0947a94ecdb20fa6ee1b3a2c6b83e5c91ba2f3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 账户和姓名 {#accounts-and-aliases}

## 结果 {#outcome}

在无域名的法典中安全工作 I105 账户 IDs 和单独绑定的人类可读的别名,如 `treasury@payments.universal`. 你会检查 Taira 根据自己的法典, ID, 解决别名,不使路由背景与身份混为一谈.

## 预先条件 {#prerequisites}

- `curl`,`jq`, Python 3.11或以后的电流,以及 `iroha` CLI.
- 一个 `taira.client.toml` 来自 [连接到 Taira](./connect-to-taira.md) 当你检查自己的账户时.
- 通过 Taira 水龙头或网络的管理登录路径预期成功之前提供账户特定阅读.

## 步骤 {#steps}

### 1. 检查 Taira 的法典账户 {#_1-inspect-canonical-accounts-on-taira}

公开账户列表总是返回正文号 I105 IDs.主要姓氏是可选的,并单独报告.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

ID 从 `.id` 适用于严格的账户字段.不要添加一个域名. `.primary_alias` 的别名是面向用户的搜索密钥,而不是另一种正义身份.

### 2. 导出和正常化您的 Taira I105 ID {#_2-derive-and-normalize-your-taira-i105-id}

在本地配置中只读取公钥.相同的公钥对不同的公共网络配置文件进行了不同编码,所以明确选择 `taira`.

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

规范值应与 `TAIRA_ACCOUNT_ID`相同. TOML 文件中的`[account].domain`设置可以是 `wonderland.universal`,但该值只影响路由和别名文本.

### 3. 阅读账户及其资产 {#_3-read-the-account-and-its-assets}

在账户提供后,直接查询它并列出一个有界限的资产页面. URL -在使用其在路径之前加密 I105 值.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4. 查找与账户相关的名 {#_4-look-up-aliases-bound-to-the-account}

逆解析器接受一个准确的正规帐户 ID.公开数据库行可以在没有请求签名标题的情况下读取;限制的数据库需要授权签署的请求.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0`是有效的:一个账户不需要姓氏.如果存在绑定,解决其完全合格的姓氏,并比较返回帐户 ID:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning 许可范围

Taira 龙头可以提供其申请人账户,但这不授予一般帐户注册或称管理权. 注册另一个账户需要在活跃的验证器下进行`CanRegisterAccount`.帐户密码通常还需要活跃的 SNS 租合同和适当的密码许可. 使用管理的登录/密码规划器,或对生成的本地网络进行注册练习.

:::

在本地网络上,一旦一个安全的签名供应步骤出口了新的正规 `NEW_ACCOUNT_ID`,登记表面是:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

生成和存储相匹配的私钥在文档或应用程序库外. 注册丢弃控制密钥的 ID 创建了一个无法使用的帐户.

## 验证 {#verify}

证明公钥的配置, I105 编码,并称为结合所有 converge 在一个法典帐户 ID:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

存储常规帐户 IDs.使用常规账户 IDs 为签名,权限和交易说明.在应用程序边界解决一个别名.保留用于操作的常规账号 ID.

## 解决问题 {#troubleshooting}

- 一个解析或前置错误通常意味着一个地址为不同的网络配置文件编码.用 `--profile taira`来正常化,并拒绝不匹配.
- 一个账户 `404` 在水龙头之后 `202` 在发送信件之前,请查询账户或资产.
- `total: 0` 来自反向解析器意味着没有可见的代号绑定;这不是一个账户查找失败.
- `401`或`403`来自一个别名路线表示数据空间有限或精确解析权限不足.不要作为倒退使用宽的前搜索.
- 一个可读的 `name@domain.dataspace`值不被接受在任何地方需要一个正义的 I105 ID.首先解决它.
- 如果本地账户注册成功,但 Taira 拒绝它,则区别是授权.获取 `CanRegisterAccount`;不要改变帐户 ID 以绕过验证.

## 来源及相关文件 {#source-and-related-docs}

- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/account/address.rs)中实现可尼卡帐户地址
- [账户和别名 Torii 在固定定位的测试](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [账户](/zh-hans/blockchain/accounts.md)
- [数据模型别名](/zh-hans/blockchain/data-model.md#aliases)
- [命名公约](/zh-hans/reference/naming.md)
- [许可证代币](/zh-hans/reference/permissions.md)
