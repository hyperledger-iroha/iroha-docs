---
translation_locale: he
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# רשיונות ותפקידים {#permissions-and-roles}

## התוצאה {#outcome}

ליצור תפקיד שמספק לאחת החשבונות אישור לעדכן מטא נתונים על חשבון מסוים, להעניק אותם לנציג, להוכיח את הכתיבה המודלוגתית, ולהראות את ההוראות המתאימות בטייפ Rust.

## תנאים מוקדמים {#prerequisites}

- לקוח Taira ממומן מתוך [חיבור ל־Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` ו `DELEGATE_ACCOUNT` נקבעו לחשבון הקנוני של I105 IDs.
- החשבון החותם חייב להחזיק ב־`CanManageRoles` וחייב להיות מסוגל להאציל את ההרשאה המוגבלת להיקף: הוא `TARGET_ACCOUNT` עצמו, או שהוא כבר מחזיק ב־`CanModifyAccountMetadata` עבור אותו חשבון. ב־Taira זוהי פעולה ניהולית שמוגנת בהרשאות. הלקוח של localnet שנוצר אינו מחזיק ב־`CanManageRoles`, ולכן המתכון זקוק לרשת שה־genesis שלה מעניק אותה.

```bash
CONFIG=./taira.client.toml
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

השתמשו בקונפיגורת קלינטה שנייה עבור המשלוח בעת ההוכחה של כתיבה:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## צעדים {#steps}

### 1. רשום תפקיד ריק {#_1-register-an-empty-role}

כל פקודת CLI שמשנה מצב מציינת במפורש את משלם העמלה. ה־CLI מקבל הצעת עמלה מדויקת, בנכס העמלה של Taira, לפני החתימה.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. הוספת רשות מוגדרת לחשבון היעד {#_2-add-a-permission-scoped-to-the-target-account}

סימני אישור נכתבים JSON אובייקטים. שמרו את החשבון בתוך `payload` כ I105 ID; שם כינוי אינו נכון בשדה קפדני זה.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. להעניק את התפקיד לנציג {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

התפקידים והתרומות שלהם לא נגמרו. לבטל אותם במפורש כאשר הגישה כבר לא נחוצה.

### 4. השתמשו באישור המוסמך {#_4-exercise-the-delegated-permission}

השתמשו בחתימה של המשלוח ובריבית המחיר עבור הכתיבה. הערכים JSON נלקחים מהכניסות סטנדרטיות.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

אותו מודל זמין גם ללקוחות Rust. כאן `client` הוא `iroha::blocking::Client` שחותם בתור `registrar_account`, שהופך לבעלים הראשוני של התפקיד בדיוק כמו בתהליך של ה־CLI. שלושת משתני החשבון כבר מכילים ערכי `AccountId` מנותחים:

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

## לאמת {#verify}

קראו את ההרשאות האפקטיביות של הנציג, הכוללות הענקות דרך תפקידים, ולאחר מכן קראו את הערך המדויק שהנציג כתב:

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

ההרשאות האפקטיביות של הנציג חייבות לכלול את `CanModifyAccountMetadata` בהיקף `TARGET_ACCOUNT`, וקריאת ה־metadata חייבת להחזיר `"delegated"`. Torii דוחה בקשות לרשימת תפקידים דרך שאילתות חתומות, ולכן רשימת ההרשאות האפקטיביות היא בדיקת ההקצאה.

## פתרון בעיות {#troubleshooting}

- `Not permitted` בעת רישום, עריכה או הקצאה של התפקיד פירושו שלחותם חסרה הסמכות הנדרשת ב־Taira. אל תחליפו את האסימון המוגבל להיקף באסימון גלובלי; בקשו את ההענקה המדויקת.
- שגיאה בנתח עומס מועיל בדרך כלל פירושה `account` הוצא לצד `payload`, נקבע כינוי במקום I105 ID, או שהערך של JSON נכתב פעמיים .
- דחיית עמלה שייכת לחותם שמגיש את אותו שלב. ממנו את המנהל ואת הנציג בנפרד, בנכס העמלה שמצוין בכל הצעת עמלה.
- מתן תפקיד מוצלח אינו עיקף את היקף הקודד בתצוגותיו. תפקיד זה יכול לשנות רק את החשבון המזומן במשאב הפועל של הרשאה.
- לניקוי, הריצו את `account role revoke`, לאחר מכן את `ledger role permission revoke`, ולבסוף את `ledger role unregister`; כל אחת מהן היא פעולת כתיבה נפרדת וחייבת לכלול `--fee-payer authority`.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [בדיקות אינטגרציה של תפקידים ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [בדיקות אינטגרציה של רשיונות במתחם קשור](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [מודל נתונים של הרשאות מבוסס ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [רשיונות ותפקידים ](/he/blockchain/permissions.md)
- [תיקון רשיונות ](/he/reference/permissions.md)
- [מטא-נתונים](./metadata.md)
