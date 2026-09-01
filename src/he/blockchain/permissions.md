---
translation_locale: he
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# רשיונות {#permissions}

החשבונות זקוקים לטוגנים של רשות עבור פעולות שונות ב-blockchain, לדוגמה, כדי להנפיק או לשרוף נכסים .

יש הבדל בין blockchain ציבורי ופרטי מבחינת רשיונות שניתנו למשתמשים. ב-blockchain ציבורי, לרוב החשבונות יש את אותה קבוצה של רשיונות. ב-blockchain פרטי, רוב החשבונות נחשבים לא מסוגלים לעשות שום דבר מחוץ לרשות שניתנה להם אלא אם כן ניתן אישור רלוונטי במפורש.

הרשאה לבצע פעולה פירושה שלחשבון יש `Permission` מתאים. אפשר להעניק הרשאות ישירות או באמצעות [`Role`](#permission-groups-roles), המקבץ קבוצת הרשאות. הרשאות מוענקות בהוראת `Grant`. הרשאות ותפקידים אינם פגים; הסירו אותם בהוראת `Revoke`.

## סימני רשות {#permission-tokens}

סימני הרשיון הם אובייקטים מקובלים מוגדרים על ידי המבצע הפעיל. חלק מהסימנים הם גלובליים, כגון `CanManagePeers`, ואחרים קבועים לאובייקט ספרים ספציפי, כמו חשבון, נכס, הגדרה של נכס, דומיין, NFT, תפקיד או תפעול.

הנה כמה דוגמאות של פרמטרים המשמשים עבור סימני רשיונות שונים:

- סימן שמספק רשות לשינוי מטא נתונים לחשבון מסוים יש שדה `account`:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- סימן שמספק רשות להעביר נכסים להגדרה מסוימת של נכסים יש שדה `asset_definition`:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- סימן גלובלי כמו `CanManagePeers` אינו כולל שדות:

  ```json
  {}
  ```

### סימני אישור מראש {#pre-configured-permission-tokens}

אתה יכול למצוא את רשימת סימני הרשות המוגדרים מראש בפרק [Reference](/he/reference/permissions).

## קבוצות רשיונות (פקידים) {#permission-groups-roles}

קבוצה של רשיונות נקראת תפקיד. בדומה לתצוגות רשיונות, ניתן להעניק תפקידים באמצעות ההוראה `Grant` ולקחת אותם בחזרה באמצעות ההוראות `Revoke`.

לפני שניתן תפקיד לחשבון, התפקיד צריך להיות רשום קודם כל.

תפקידים הם שימושיים כאשר מספר חשבונות צריכים לקבל את אותה קבוצה של רשיונות. לרשום את התפקיד פעם אחת, להעניק רשיונות לתפקיד, ולאחר מכן להעניק או לבטל את התפקיד עבור חשבונות בודדים .

### רשום תפקיד חדש {#register-a-new-role}

בואו נרשם תפקיד חדש, שכאשר יוענק, יאפשר לחשבון אחר גישה לתנתונים [](/he/blockchain/metadata.md) בחשבון של Mouse:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### תן תפקיד. {#grant-a-role}

אחרי שהפקיד רשום, Mouse יכול להעניק אותו ל-Alice:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## מדדני אישור {#permission-validators}

הרשיונות קיימות כך שרק חשבונות עם סימן הרשיון הנדרש יכולים לבצע פעולה מוגנת. המפעיל המקובל בודק רשיונות במהלך ההוראה, שאילתת, וביצוע הביטוי.

משטחי ה־validator הרגילים מקובצים לפי תחום בספר החשבונות:

- ניהול צמתים
- תחומים וחשבות
- נכסים, NFTs, ושכרות
- טריגרים
- תפקידים וזכויות
- מבצע/זמן הפעלה, ראיות, גשרים ומודלים SORA/Nexus

רשימת הסימנים המדויקת נתמכת במקור ב [תייחסות סימני הרשות ](/he/reference/permissions.md).

### בדיקות זמן ההפעלה {#runtime-validators}

בדיקות רשיונות מבוקשות על ידי המבצע הפעיל. המבצע המקובל מספק את אישורני הרשיונות המובנים והגדרות של הסימן, ורשת יכולה לשנות מדיניות על-ידי עדכון למבצע שהיא משתמשת בו.

מאמתים מספקים פסקי הרשאה. מאמת יכול להתיר פעולה, לדחות אותה בצירוף סיבה או להימנע אם הפעולה מחוץ לתחומו. המכריע שנבחר משלב פסקי דין אלה כדי לקבוע אם ההוראה, השאילתה או הביטוי יכולים להמשיך.

## שאילתות תומכות {#supported-queries}

ניתן לבקש סימני רשות ותפקידים.

שאילתות לתפקידים:

- [`FindRoles`](/he/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/he/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/he/reference/queries.md#accounts-and-permissions)

שאילתות עבור סימני רשיון:

- [`FindPermissionsByAccountId`](/he/reference/queries.md#accounts-and-permissions)
