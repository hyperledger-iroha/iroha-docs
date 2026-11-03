---
translation_locale: zh-hant
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 許可證和角色 {#permissions-and-roles}

## 結果 {#outcome}

建立一個允許一個帳戶更新特定帳戶上的後設資料的角色,將其分配給代表者,證明授權寫入,並顯示相應輸入 Rust 指令.

## 預先條件 {#prerequisites}

- 來自 [連線到 Taira](./connect-to-taira.md) 且已注資的 Taira 客戶端。
- `TARGET_ACCOUNT`和 `DELEGATE_ACCOUNT`設定為規範 I105 帳戶 IDs.
- 簽署帳戶必須持有 `CanManageRoles`，並且必須能夠委派該範圍許可權：它本身就是 `TARGET_ACCOUNT`，或已持有針對該帳戶的 `CanModifyAccountMetadata`。在 Taira 上，這是受許可權限制的管理操作。產生的本機網路的用戶端並不持有 `CanManageRoles`，因此此操作指南需要一個由創世授予該許可權的網路。

```bash
CONFIG=./taira.client.toml
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

驗證寫入操作時，請為被授權者使用另一份用戶端設定：

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## 步驟 {#steps}

### 1.註冊一個空的角色 {#_1-register-an-empty-role}

每個變更狀態的 CLI 命令都會明確指定費用付款人。CLI 會在簽署前給出以 Taira 費用資產計價的確切費用報價。

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. 在目標帳戶中新增一個限量許可權 {#_2-add-a-permission-scoped-to-the-target-account}

許可令牌是輸入 JSON 物件. 在 `payload` 中儲存帳戶為 I105 ID;在這個嚴格的欄位中,別名並不有效.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. 委託任務給代表 {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

角色及其授權不會過期；不再需要訪問許可權時應明確撤銷它們.

### 4. 行使授權許可 {#_4-exercise-the-delegated-permission}

使用代表的簽字元和費用餘額來寫. JSON 值從標準輸入中讀取.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Rust 客戶端也可以使用相同的模型。這裡的 `client` 是一個以 `registrar_account` 身分簽署的 `iroha::blocking::Client`，`registrar_account` 會成為角色的初始所有者，與 CLI 流程中相同。三個帳戶變數都已是解析好的 `AccountId` 值：

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

## 驗證 {#verify}

讀取被授權者的有效許可權（其中包括角色授予的許可權），然後讀取被授權者寫入的確切值：

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

被授權者的有效許可權必須包含範圍限定為 `TARGET_ACCOUNT` 的 `CanModifyAccountMetadata`，且讀取的後設資料必須返回 `"delegated"`。Torii 會拒絕透過已簽署查詢列出角色，因此有效許可權清單就是指派檢查。

## 解決問題 {#troubleshooting}

- 在註冊、編輯或指派角色時出現 `Not permitted`，表示簽署者缺乏所需的 Taira 權限。不要用全域權杖取代範圍限定的權杖；請申請確切的授權。
- 一個有效載荷解析錯誤通常意味著 `account` 被放置在 `payload` 旁邊,一個別名被提供而不是 I105 ID,或者 JSON 的價值被引用了兩次.
- 費用拒絕屬於提交該步驟的簽署者。請分別以每個費用報價所指定的費用資產為管理者和被授權者注資。
- 一個成功的角色授予不會超過其程式碼中編碼的範圍.這個角色只能修改在許可有效載荷中命名的帳戶
- 若要清理，請先執行 `account role revoke`，然後執行 `ledger role permission revoke`，最後執行 `ledger role unregister`；每一個都是單獨的寫入，且必須包含 `--fee-payer authority`。

## 來源及相關檔案 {#source-and-related-docs}

- [在固定提交時的角色整合測試](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)上進行許可整合測試
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)內建的許可權資料模型
- [許可證和角色](/zh-hant/blockchain/permissions.md)
- [許可證代幣引用](/zh-hant/reference/permissions.md)
- [超值資料](./metadata.md)
