---
translation_locale: zh-hans
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 许可证 {#permissions}

在区块链上,帐户需要各种操作的许可令牌.
造或燃烧资产.

公共区块链和私人区块链的区别在于
在公共区块链中,大多数账户都具有
在私人区块链中,大多数账户都是
假设不能在授予他们权限之外做任何事情
除非明确授予相关许可.

有权做某事意味着账户有
相应的 `Permission`. 许可可直接或通过
[`Role`](#permission-groups-roles), 在此,
许可证授予 `Grant` 授权和角色
不过,不要尽期; `Revoke` 提供指令.

## 许可令牌 {#permission-tokens}

允许令牌是由主动执行器定义的类型对象.
代币是全球性的,例如 `CanManagePeers`, 其他类型为
具体账本对象,如帐户,资产,资产定义,域名
NFT, 起作用或触发.

以下是用于各种权限令牌的参数的一些例子:

- 允许修改特定帐户的元数据的代币
  携带 `account` 字段:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- 授予特定资产的资产转移许可的代币
  定义包含一个 `asset_definition` 字段:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- 一个全球代币,如 `CanManagePeers` 没有字段:

  ```json
  {}
  ```

### 预配置的权限代币 {#pre-configured-permission-tokens}

您可以找到预先配置的权限代币列表 [参考](/zh-hans/reference/permissions) 章节.

## 许可组 (角色) {#permission-groups-roles}

一组权限称为 **角色**. 类似于许可证代币,
能通过使用 `Grant` 根据该指令,
`Revoke` 提供指令.

在赋予账户角色之前,该角色应首先注册.

在多个账户获得相同许可时,角色是有用的
一次注册角色,授予该角色的权限,然后授予或
取消个人账户的角色.

### 登记新角色 {#register-a-new-role}

让我们注册一个新的角色,当授予,将允许另一个账户
访问 [大数据](/zh-hans/blockchain/metadata.md) 在鼠标的帐户中:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### 给一个角色 {#grant-a-role}

在这个角色被注册后,鼠标可以授予艾丽丝:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## 许可证验证器 {#permission-validators}

只有需要的权限令牌的账户
可以执行受保护的操作.默认执行器检查权限
在指令,查询和表达式执行过程中.

默认验证器表面按账本区域进行组分:

- 同行管理
- 域名和账户
- 资产, NFTs, 和保证金
- 触发器
- 角色和权限
- 执行器/运行时间,证据,桥梁和 SORA/Nexus 模块

准确的代币列表是源支持在
[许可证代币参考](/zh-hans/reference/permissions.md).

### 运行时间验证器 {#runtime-validators}

执行器执行了权限检查.
执行者提供内置的权限验证器和代币定义,
网络可以通过升级它使用的执行器来改变政策.

验证器返回一个 **验证判决**. 验证器可以允许
操作,拒绝它有理由,或者跳过如果操作是外
被选的法官将这些判决结合为
决定指示,查询或表达是否可以继续.

## 支持的查询 {#supported-queries}

可以查询许可证和角色.

角色的查询:

- [`FindRoles`](/zh-hans/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/zh-hans/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/zh-hans/reference/queries.md#accounts-and-permissions)

权限代码查询:

- [`FindPermissionsByAccountId`](/zh-hans/reference/queries.md#accounts-and-permissions)
