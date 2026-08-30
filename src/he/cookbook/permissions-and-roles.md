---
translation_locale: he
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 7ee18275d25837da53f533f5e9205906ccaa71b48afd9b11ffad79b599da7f21
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# רשיונות ותפקידים {#permissions-and-roles}

## התוצאה {#outcome}

ליצור תפקיד שמספק לאחת החשבונות אישור לעדכן מטא נתונים על חשבון מסוים, להעניק אותם לנציג, להוכיח את הכתיבה המודלוגתית, ולהראות את ההוראות המתאימות בטייפ Rust.

## תנאים מוקדמים {#prerequisites}

- נתונים מטאטא של לקוח Taira ושלם מיומנים מ- [חברו ל- Taira ](./connect-to-taira.md).
- `TARGET_ACCOUNT` ו `DELEGATE_ACCOUNT` נקבעו לחשבון הקנוני של I105 IDs.
- חשבון החתימה חייב להיות מורשה לנהל את הרשיונות המטרה ואת התפקידים. ב Taira זה מבצע מנהלי עם פקודת רשיונות; לקבל `CanManageRoles` והרשויות הנדרשות כדי להעניק את הרשיון המוגדר, או להפעיל את המתכון ברשת מקומית שנוצרה.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
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

כל פקודה CLI המשתנה במדינה מכניסה באופן מפורש את מי ששלם את המחיר. הקובץ של הנתונים המכיל את נכס המחיר הנוכחי Taira המוצא מהתגובה למברקה.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. הוספת רשות מוגדרת לחשבון היעד {#_2-add-a-permission-scoped-to-the-target-account}

סימני אישור נכתבים JSON אובייקטים. שמרו את החשבון בתוך `payload` כ I105 ID; שם כינוי אינו נכון בשדה קפדני זה.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. להעניק את התפקיד לנציג {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
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
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

אותו מודל זמין לקוחות Rust. כאן `client` סימנים כמו `registrar_account`, אשר הופך להיות הבעלים הראשוני של התפקיד בדיוק כפי שהוא עושה בזרם CLI. כל שלושת משתנים החשבון כבר ננתחו ערכים `AccountId`:

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

## לאמת {#verify}

רשום את שני הצדדים של המשימה, ולאחר מכן קרא את הערך המדויק שכתב הנציג:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

רשימת הרשיונות חייבת להכיל `CanModifyAccountMetadata` עם טווח ל- `TARGET_ACCOUNT`, רשימת תפקידים של המשלוח צריכה להכיל `ROLE_ID`, והמטא נתונים שקראו חייבים להחזיר את `"delegated"`.

## פתרון בעיות {#troubleshooting}

- `Not permitted` בעת רישום, עריכה או מיתוי התפקיד אומר שהחתם חסר את הסמכות הנדרשת Taira. אל תחליף את הסימן המוגדר עם סימן גלובלי; בקש את התמיכה המדויקת או השתמש ב-localnet.
- שגיאה בנתח עומס מועיל בדרך כלל פירושה `account` הוצא לצד `payload`, נקבע כינוי במקום I105 ID, או שהערך של JSON נכתב פעמיים .
- דחייה על עמלה שייכת לחותם שהגיש את הצעד הזה. מימון למנהל ומעבירה באופן עצמאי ושומרת על הנתונים המטאטא של נכס תשלום המוצא מהפלטה.
- מתן תפקיד מוצלח אינו עיקף את היקף הקודד בתצוגותיו. תפקיד זה יכול לשנות רק את החשבון המזומן במשאב הפועל של הרשאה.
- כדי לנקות, להפעיל `ledger account role revoke`, לאחר מכן `ledger role permission revoke`, ולבסוף `ledger role unregister`; כל אחד מהם הוא כתיבה נפרדת וצריך לכלול `--fee-payer authority` ונתונים מטאטא של תשלום.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [בדיקות אינטגרציה של תפקידים ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [בדיקות אינטגרציה של רשיונות במתחם קשור](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [מודל נתונים של הרשאות מבוסס ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [רשיונות ותפקידים ](/he/blockchain/permissions.md)
- [תיקון רשיונות ](/he/reference/permissions.md)
- [נתונים מטאטא](./metadata.md)
