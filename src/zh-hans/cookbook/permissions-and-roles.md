---
translation_locale: zh-hans
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 许可证和角色 {#permissions-and-roles}

## 结果 {#outcome}

创建一个允许一个帐户更新特定账户上的元数据的角色,将其分配给代表者,证明授权写入,并显示相应输入 Rust 指令.

## 预先条件 {#prerequisites}

- 来自 [连接到 Taira](./connect-to-taira.md) 且已注资的 Taira 客户端。
- `TARGET_ACCOUNT`和 `DELEGATE_ACCOUNT`设置为规范 I105 账户 IDs.
- 签名账户必须持有 `CanManageRoles`，并且必须能够委派该范围权限：它本身就是 `TARGET_ACCOUNT`，或已持有针对该账户的 `CanModifyAccountMetadata`。在 Taira 上，这是受权限限制的管理操作。生成的本地网络的客户端并不持有 `CanManageRoles`，因此此操作指南需要一个由创世授予该权限的网络。

```bash
CONFIG=./taira.client.toml
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

验证写入操作时，请为被授权者使用另一份客户端配置：

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## 步骤 {#steps}

### 1.注册一个空的角色 {#_1-register-an-empty-role}

每个变更状态的 CLI 命令都会明确指定费用付款人。CLI 会在签名前给出以 Taira 费用资产计价的确切费用报价。

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. 在目标帐户中添加一个限量权限 {#_2-add-a-permission-scoped-to-the-target-account}

许可令牌是输入 JSON 对象. 在 `payload` 中存储账户为 I105 ID;在这个严格的字段中,别名并不有效.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. 委托任务给代表 {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

角色及其授权不会过期；不再需要访问权限时应明确撤销它们.

### 4. 行使授权许可 {#_4-exercise-the-delegated-permission}

使用代表的签字符和费用余额来写. JSON 值从标准输入中读取.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Rust 客户端也可以使用相同的模型。这里的 `client` 是一个以 `registrar_account` 身份签名的 `iroha::blocking::Client`，`registrar_account` 会成为角色的初始所有者，与 CLI 流程中相同。三个账户变量都已是解析好的 `AccountId` 值：

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## 验证 {#verify}

读取被授权者的有效权限（其中包括角色授予的权限），然后读取被授权者写入的确切值：

```bash
iroha --config "$CONFIG" --machine account permission list \
  --id "$DELEGATE_ACCOUNT" --all \
  | jq -e --arg account "$TARGET_ACCOUNT" \
    '.items | any(.name == "CanModifyAccountMetadata"
      and .payload.account == $account)'

iroha --config "$CONFIG" account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

被授权者的有效权限必须包含范围限定为 `TARGET_ACCOUNT` 的 `CanModifyAccountMetadata`，且读取的元数据必须返回 `"delegated"`。Torii 会拒绝通过已签名查询列出角色，因此有效权限列表就是分配检查。

## 解决问题 {#troubleshooting}

- 在注册、编辑或分配角色时出现 `Not permitted`，表示签名者缺乏所需的 Taira 权限。不要用全局令牌替换范围限定的令牌；请申请确切的授权。
- 一个有效载荷解析错误通常意味着 `account` 被放置在 `payload` 旁边,一个别名被提供而不是 I105 ID,或者 JSON 的价值被引用了两次.
- 费用拒绝属于提交该步骤的签名者。请分别以每个费用报价所指定的费用资产为管理者和被授权者注资。
- 一个成功的角色授予不会超过其代码中编码的范围.这个角色只能修改在许可有效载荷中命名的帐户
- 若要清理，请先运行 `account role revoke`，然后运行 `ledger role permission revoke`，最后运行 `ledger role unregister`；每一个都是单独的写入，且必须包含 `--fee-payer authority`。

## 来源及相关文件 {#source-and-related-docs}

- [在固定提交时的角色集成测试](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)上进行许可集成测试
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)内置的权限数据模型
- [许可证和角色](/zh-hans/blockchain/permissions.md)
- [许可证代币引用](/zh-hans/reference/permissions.md)
- [超值数据](./metadata.md)
