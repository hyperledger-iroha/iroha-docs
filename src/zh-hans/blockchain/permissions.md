---
translation_locale: zh-hans
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 许可证 {#permissions}

对于区块链上的各种操作,例如钱或烧毁资产,账户需要许可令牌.

公共区块链和私人区块链在用户获得的许可方面存在差异.在公共区块链中,大多数账户都有相同的权限.在私人区块链中,大多数账户被认为不能做任何事情.在授予他们权限之外,除非明确授予相关许可.

持有某事许可证意味着账户具有相应的 `Permission`.许可证可以直接或通过 [`Role`](#permission-groups-roles),允许使用 `Grant` 指令授予权限.许可证和角色不会过期,请用 `Revoke` 指令删除它们.

## 许可证代码 {#permission-tokens}

许可令牌是由主动执行者定义的类型对象.有些令牌是全球性的,例如 `CanManagePeers`,而其他则是针对特定账本对象,如帐户,资产,资产定义,域名, NFT,角色或触发器等.

以下是用于各种权限令牌的参数的一些例子:

- 允许修改特定账户的元数据的代币具有 `account` 字段:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- 一个为特定资产定义授权转移资产的代币具有 `asset_definition` 字段:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- 像 `CanManagePeers`这样的全球代币没有领域:

  ```json
  {}
  ```

### 预先配置的权限令牌 {#pre-configured-permission-tokens}

在 [Reference](/zh-hans/reference/permissions)章中可以找到预先配置的权限代币列表.

## 许可类别 (角色) {#permission-groups-roles}

一组权限被称为角色.类似于权限代币,可以使用 `Grant` 指令授予角色,并使用 `Revoke` 指令撤销角色.

在赋予账户角色之前,该角色应首先被注册.

当多个账户获得相同的权限集时,角色是有用的. 一次注册该角色,授予该角色的权限,然后授予或撤销单个帐户的角色.

### 登记一个新角色 {#register-a-new-role}

让我们注册一个新的角色, 当授予时,将允许另一个帐户访问 [元数据](/zh-hans/blockchain/metadata.md) 在鼠标的账户:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### 给一个角色 {#grant-a-role}

在这个角色被注册后,鼠标可以授予阿丽丝:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## 许可证验证器 {#permission-validators}

允许存在,因此只有需要的权限符号的帐户才能执行受保护的操作.默认执行器在命令,查询和表达式执行过程中检查权限.

默认验证器表面按账本区分组合:

- 同行管理
- 域名和账户
- 资产, NFTs,以及保证金
- 触发器
- 角色和权限
- 执行器/运行时间,证据,桥梁和 SORA/Nexus 模块

准确的代币列表在 [Permission Tokens引用](/zh-hans/reference/permissions.md)中得到源支持.

### 运行时间验证器 {#runtime-validators}

允许检查由主动执行器执行.默认执行器提供内置的权限验证器和代币定义,网络可以通过升级使用的执行器来改变政策.

验证者返回验证判决.验证人可以允许操作,理由地拒绝它,或者如果该操作不在验证者的范围之外,跳过它.所选的法官将这些裁决结合在一起来决定指示,查询或表达是否可以继续进行.

## 支持的查询 {#supported-queries}

可以查询许可证和角色.

角色的查询:

- [`FindRoles`](/zh-hans/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/zh-hans/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/zh-hans/reference/queries.md#accounts-and-permissions)

权限令牌的查询:

- [`FindPermissionsByAccountId`](/zh-hans/reference/queries.md#accounts-and-permissions)
