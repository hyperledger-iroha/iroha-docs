---
translation_locale: zh-hant
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 許可證 {#permissions}

帳戶需要許可令牌進行區塊上的各種行動,
打造或燃燒財產.

公共區塊與私人區塊之間的差異
在公共區塊中,
在私人區塊中,
假設他們無法在授予他們權限之外做任何事情
除非明顯授予相關許可.

該帳戶有權使用,
相應的情況 `Permission`. 許可可直接或透過
[`Role`](#permission-groups-roles), 該項目的使用方式是:
授權使用 `Grant` 授權及角色
沒有時間過, `Revoke` 提供指令.

## 許可令牌 {#permission-tokens}

授權令牌是由主動執行器定義的輸入對象.
代幣是全球性的,例如 `CanManagePeers`, 其他項目為:
特定的帳號對象,例如帳戶,資產,資產定義,域名,
NFT, 或是引擎.

以下是使用各種許可令牌的參數:

- 授權修改特定帳戶的元數據
  帶著一個 `account` 這個字段:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- 授權轉移特定資產的代幣
  這項定義包含 `asset_definition` 這個字段:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- 這樣的全球代幣, `CanManagePeers` 沒有字段:

  ```json
  {}
  ```

### 預設的許可令牌 {#pre-configured-permission-tokens}

您可以找到預先配置的許可令牌列表, [參考](/zh-hant/reference/permissions) 這篇章.

## 許可組 (角色) {#permission-groups-roles}

一套許可稱為 **角色**. 這樣的許可令牌也一樣,
能使用以下方式授予角色: `Grant` 該指令被撤回,
`Revoke` 提供指令.

在授予帳戶角色之前,該角色首先應註冊.

當多個帳戶獲得相同的許可時,
註冊角色一次,授予該角色的權限,
取消個人帳戶的角色.

### 註冊新角色 {#register-a-new-role}

我們要註冊新的角色,
接觸到 [數據](/zh-hant/blockchain/metadata.md) 在Mouse的帳號中:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### 提供一個角色 {#grant-a-role}

子可以給阿里斯:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## 許可證驗證器 {#permission-validators}

只有使用所需許可令牌的帳戶才有權限
預設執行器檢查權限
在指令,查詢和表達式執行過程中.

預設驗證器表面由帳號區域組成:

- 同級管理
- 域名和帳戶
- 資產, NFTs, 還有保證金,
- 引發器
- 角色和權限
- 執行員/運行時間,證據,橋,以及 SORA/Nexus 模組

根據資料來源支持,
[授權令牌參考](/zh-hant/reference/permissions.md).

### 運行時間驗證器 {#runtime-validators}

預設的執行器會執行許可檢查.
執行者提供內建的許可驗證碼和代號定義,
透過升級它使用的執行器,

證實者返回一個 **認證判決**. 核准器可以允許
如果該操作是未完成的,
選出的法官將這些判決結合到
決定指示,查詢或表達是否可以進行.

## 支持的詢問 {#supported-queries}

請查詢授權代碼和角色.

詢問關於角色的問題:

- [`FindRoles`](/zh-hant/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/zh-hant/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/zh-hant/reference/queries.md#accounts-and-permissions)

詢問授權代碼:

- [`FindPermissionsByAccountId`](/zh-hant/reference/queries.md#accounts-and-permissions)
