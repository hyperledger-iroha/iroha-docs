---
translation_locale: zh-hans
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 7ee18275d25837da53f533f5e9205906ccaa71b48afd9b11ffad79b599da7f21
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 许可证和角色 {#permissions-and-roles}

## 结果 {#outcome}

创建一个允许一个帐户更新特定账户上的元数据的角色,将其分配给代表者,证明授权写字,并显示相应输入 Rust 指令.

## 预先条件 {#prerequisites}

- 资助的 Taira 客户和费用元数据从 [连接到 Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT`和 `DELEGATE_ACCOUNT`设置为法典 I105 账户 IDs.
- 在 Taira 上,这是一个权限设置的行政操作;获取`CanManageRoles`和授予范围许可所需的当局,或在生成的本地网络上运行食谱.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

使用第二个客户端配置来证明写字:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## 步骤 {#steps}

### 1.注册一个空的角色 {#_1-register-an-empty-role}

每一个变化状态的 CLI 命令明确地命名了费用付款人.元数据文件包含来自龙头响应的当前 Taira 费用资产.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. 在目标帐户中添加一个限量权限 {#_2-add-a-permission-scoped-to-the-target-account}

许可令牌是输入 JSON 对象. 在 `payload` 中存储账户为 I105 ID;在这个严格的字段中,别名并不有效.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. 委托任务给代表 {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

角色和他们的补贴不会过期,在不再需要访问时明确取消它们.

### 4. 行使授权许可 {#_4-exercise-the-delegated-permission}

使用代表的签字符和费用余额来写. JSON 值从标准输入中读取.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

同样的模型可用于: Rust 客户. `client` 标签: `registrar_account`, 成为角色的初始所有者, CLI 所有三个账户变量都已被分析 `AccountId` 价值:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all_blocking::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## 验证 {#verify}

列出任务的两侧,然后阅读代表所写的精确值:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

授权列表必须包含 `CanModifyAccountMetadata`的范围到 `TARGET_ACCOUNT`,代表角色列表必须包括 `ROLE_ID`,读取的元数据必须返回`"delegated"`.

## 解决问题 {#troubleshooting}

- `Not permitted`在注册,编辑或分配角色时意味着签署者缺乏所需的 Taira 权威.不要用全球性的代币取代目标代币;要求准确的授予或使用 localnet.
- 一个有效载荷解析错误通常意味着 `account` 被放置在 `payload` 旁边,一个别名被提供而不是 I105 ID,或者 JSON 的价值被引用了两次.
- 收费拒绝属于提交该步骤的签署者. 资助经理,独立委托并保留从水龙头衍生的收费资产元数据.
- 一个成功的角色授予不会超过其代码中编码的范围.这个角色只能修改在许可有效载荷中命名的帐户
- 为了清理,运行`ledger account role revoke`,然后 `ledger role permission revoke`,最后 `ledger role unregister`;每个是单独的写字,必须包含`--fee-payer authority`和费用元数据.

## 来源及相关文件 {#source-and-related-docs}

- [在固定提交时的角色集成测试](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)上进行许可集成测试
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)内置的权限数据模型
- [许可证和角色](/zh-hans/blockchain/permissions.md)
- [许可证代币引用](/zh-hans/reference/permissions.md)
- [超值数据](./metadata.md)
