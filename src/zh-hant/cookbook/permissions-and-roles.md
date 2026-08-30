---
translation_locale: zh-hant
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 7ee18275d25837da53f533f5e9205906ccaa71b48afd9b11ffad79b599da7f21
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 許可證和角色 {#permissions-and-roles}

## 結果 {#outcome}

創建一個允許一個帳戶更新特定賬戶上的元數據的角色,將其分配給代表者,證明授權寫字,並顯示相應輸入 Rust 指令.

## 預先條件 {#prerequisites}

- 資助的 Taira 客戶和費用元數據從 [連接到 Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT`和 `DELEGATE_ACCOUNT`設置爲法典 I105 賬戶 IDs.
- 在 Taira 上,這是一個權限設置的行政操作;獲取`CanManageRoles`和授予範圍許可所需的當局,或在生成的本地網絡上運行食譜.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

使用第二個客戶端配置來證明寫字:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## 步驟 {#steps}

### 1.註冊一個空的角色 {#_1-register-an-empty-role}

每一個變化狀態的 CLI 命令明確地命名了費用付款人.元數據文件包含來自龍頭響應的當前 Taira 費用資產.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. 在目標帳戶中添加一個限量權限 {#_2-add-a-permission-scoped-to-the-target-account}

許可令牌是輸入 JSON 對象. 在 `payload` 中存儲賬戶爲 I105 ID;在這個嚴格的字段中,別名並不有效.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. 委託任務給代表 {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

角色和他們的補貼不會過期,在不再需要訪問時明確取消它們.

### 4. 行使授權許可 {#_4-exercise-the-delegated-permission}

使用代表的簽字符和費用餘額來寫. JSON 值從標準輸入中讀取.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

同樣的模型可用於: Rust 客戶. `client` 標籤: `registrar_account`, 成爲角色的初始所有者, CLI 所有三個賬戶變量都已被分析 `AccountId` 價值:

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

## 驗證 {#verify}

列出任務的兩側,然後閱讀代表所寫的精確值:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

授權列表必須包含 `CanModifyAccountMetadata`的範圍到 `TARGET_ACCOUNT`,代表角色列表必須包括 `ROLE_ID`,讀取的元數據必須返回`"delegated"`.

## 解決問題 {#troubleshooting}

- `Not permitted`在註冊,編輯或分配角色時意味着簽署者缺乏所需的 Taira 權威.不要用全球性的代幣取代目標代幣;要求準確的授予或使用 localnet.
- 一個有效載荷解析錯誤通常意味着 `account` 被放置在 `payload` 旁邊,一個別名被提供而不是 I105 ID,或者 JSON 的價值被引用了兩次.
- 收費拒絕屬於提交該步驟的簽署者. 資助經理,獨立委託並保留從水龍頭衍生的收費資產元數據.
- 一個成功的角色授予不會超過其代碼中編碼的範圍.這個角色只能修改在許可有效載荷中命名的帳戶
- 爲了清理,運行`ledger account role revoke`,然後 `ledger role permission revoke`,最後 `ledger role unregister`;每個是單獨的寫字,必須包含`--fee-payer authority`和費用元數據.

## 來源及相關文件 {#source-and-related-docs}

- [在固定提交時的角色集成測試](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)上進行許可集成測試
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)內置的權限數據模型
- [許可證和角色](/zh-hant/blockchain/permissions.md)
- [許可證代幣引用](/zh-hant/reference/permissions.md)
- [超值數據](./metadata.md)
