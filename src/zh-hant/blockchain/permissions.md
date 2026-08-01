---
translation_locale: zh-hant
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 許可證 {#permissions}

對於區塊鏈上的各種操作,例如錢或燒燬資產,賬戶需要許可令牌.

公共區塊鏈和私人區塊鏈在用戶獲得的許可方面存在差異.在公共區塊鏈中,大多數賬戶都有相同的權限.在私人區塊鏈中,大多數賬戶被認爲不能做任何事情.在授予他們權限之外,除非明確授予相關許可.

持有某事許可證意味着賬戶具有相應的 `Permission`.許可證可以直接或通過 [`Role`](#permission-groups-roles),允許使用 `Grant` 指令授予權限.許可證和角色不會過期,請用 `Revoke` 指令刪除它們.

## 許可證代碼 {#permission-tokens}

許可令牌是由主動執行者定義的類型對象.有些令牌是全球性的,例如 `CanManagePeers`,而其他則是針對特定賬本對象,如帳戶,資產,資產定義,域名, NFT,角色或觸發器等.

以下是用於各種權限令牌的參數的一些例子:

- 允許修改特定賬戶的元數據的代幣具有 `account` 字段:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- 一個爲特定資產定義授權轉移資產的代幣具有 `asset_definition` 字段:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- 像 `CanManagePeers`這樣的全球代幣沒有領域:

  ```json
  {}
  ```

### 預先配置的權限令牌 {#pre-configured-permission-tokens}

在 [Reference](/zh-hant/reference/permissions)章中可以找到預先配置的權限代幣列表.

## 許可類別 (角色) {#permission-groups-roles}

一組權限被稱爲角色.類似於權限代幣,可以使用 `Grant` 指令授予角色,並使用 `Revoke` 指令撤銷角色.

在賦予賬戶角色之前,該角色應首先被註冊.

當多個賬戶獲得相同的權限集時,角色是有用的. 一次註冊該角色,授予該角色的權限,然後授予或撤銷單個帳戶的角色.

### 登記一個新角色 {#register-a-new-role}

讓我們註冊一個新的角色, 當授予時,將允許另一個帳戶訪問 [元數據](/zh-hant/blockchain/metadata.md) 在鼠標的賬戶:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### 給一個角色 {#grant-a-role}

在這個角色被註冊後,鼠標可以授予阿麗絲:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## 許可證驗證器 {#permission-validators}

允許存在,因此只有需要的權限符號的帳戶才能執行受保護的操作.默認執行器在命令,查詢和表達式執行過程中檢查權限.

默認驗證器表面按賬本區分組合:

- 同行管理
- 域名和賬戶
- 資產, NFTs,以及保證金
- 觸發器
- 角色和權限
- 執行器/運行時間,證據,橋樑和 SORA/Nexus 模塊

準確的代幣列表在 [Permission Tokens引用](/zh-hant/reference/permissions.md)中得到源支持.

### 運行時間驗證器 {#runtime-validators}

允許檢查由主動執行器執行.默認執行器提供內置的權限驗證器和代幣定義,網絡可以通過升級使用的執行器來改變政策.

驗證者返回驗證判決.驗證人可以允許操作,理由地拒絕它,或者如果該操作不在驗證者的範圍之外,跳過它.所選的法官將這些裁決結合在一起來決定指示,查詢或表達是否可以繼續進行.

## 支持的查詢 {#supported-queries}

可以查詢許可證和角色.

角色的查詢:

- [`FindRoles`](/zh-hant/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/zh-hant/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/zh-hant/reference/queries.md#accounts-and-permissions)

權限令牌的查詢:

- [`FindPermissionsByAccountId`](/zh-hant/reference/queries.md#accounts-and-permissions)
