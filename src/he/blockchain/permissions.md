---
translation_locale: he
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# רשיונות {#permissions}

החשבונות זקוקים לשטות רשות לפעולות שונות ב-blockchain, למשל.
להדפיס או לשרוף נכסים.

יש הבדל בין blockchain ציבורי ופרטי מבחינת
רשיונות שניתנו למשתמשים. ב-blockchain ציבורי,
באותה קבוצה של רשיונות. ב-blockchain פרטי, רוב החשבונות
נחשבים לא מסוגלים לעשות שום דבר מחוץ לרשות שניתנה להם.
אלא אם כן נתן אישור מפורש.

אם יש לך רשות לעשות משהו, זה אומר שהחשבון
תואמת `Permission`. אישור ניתן להעניק ישירות או באמצעות
[`Role`](#permission-groups-roles), שמגדלים קבוצה של רשיונות.
הרשיונות מעניקים עם `Grant` הוראות. רשיונות ותפקידים
אל יגמרו; להוציא אותם עם `Revoke` הוראות.

## סימני רשות {#permission-tokens}

סימני אישור הם אובייקטים ממוטטים מוגדרים על ידי המפעיל הפעיל.
סימנים הם גלובליים, כגון `CanManagePeers`, וארגונים אחרים נחשפים ל
אובייקט ספרים גדול ספציפי, כגון חשבון, נכס, הגדרה של נכס, תחום,
NFT, תפקיד, או תפעיל.

הנה כמה דוגמאות של פרמטרים המשמשים עבור סימני אישור שונים:

- סימן שמספק אישור לשינוי נתונים מטא עבור חשבון מסוים
  נושאת `account` שדה:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- סימן שמספק רשות להעביר נכסים עבור נכס מסוים
  הגדרה נושאת `asset_definition` שדה:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- סימן גלובלי כמו `CanManagePeers` אין שדות:

  ```json
  {}
  ```

### סימני אישור מראש {#pre-configured-permission-tokens}

אתה יכול למצוא את רשימת סימני הרשות המוגדרים מראש [תקשורת](/he/reference/permissions) פרק.

## קבוצות רשות (פקידים) {#permission-groups-roles}

קבוצה של אישורים נקראת **תפקיד**. בדומה לזכויות רשות,
תפקידים יכולים להיעשות באמצעות `Grant` הוראה וביטול באמצעות
`Revoke` הוראות.

לפני שניתן תפקיד לחשבון, התפקיד צריך להיות רשום קודם כל.

תפקידים הם שימושיים כאשר מספר חשבונות צריכים לקבל את אותה רשות
רשום את התפקיד פעם אחת, לתת רשיונות לתפקיד, ולאחר מכן להעניק או
לבטל את התפקיד של חשבונות פרטיים.

### רשום תפקיד חדש {#register-a-new-role}

בואו נרשם תפקיד חדש, שכאשר ייתן, יאפשר חשבון אחר
גישה [נתונים](/he/blockchain/metadata.md) על חשבון העכבר:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### תן תפקיד. {#grant-a-role}

לאחר שהפקיד רשום, עכברוש יכול להעניק אותו לאליס:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## מדדני אישור {#permission-validators}

רשיונות קיימים כך שרק חשבונות עם סימן הרשיון הנדרש
יכול לבצע פעולה מוגנת. המפעיל הנדרש בודק רשיונות
במהלך הוראות, חיפוש וביצוע ביטוי.

שטח ההסכם המובטח מתקבץ לפי אזור ספרים:

- ניהול עמיתים
- תחומים וחשבות
- נכסים, NFTs, וזכירות.
- תפעילים
- תפקידים וזכויות
- מימוש/זמן הפעלה, ראיות, גשרים, ו SORA/Nexus מודולים

רשימת הסימנים המדויקות נתמכת במקור
[סימן רשיון](/he/reference/permissions.md).

### מתבטיחים של זמן ההפעלה {#runtime-validators}

בדיקות רשיונות מבוצעות על ידי המפעיל הפעיל.
המוציא לפועל מספק את מבוססי הזכויות וההגדרות של הסימנים,
ורשת יכולה לשנות את המדיניות על ידי עדכון למפעיל שהיא משתמשת בו.

מדווחים חוזרים **פסק הדין על אישור**. בדיקת יכולה לאפשר
מבצע, להכחיש אותו עם סיבה, או לשאוף ממנו אם המבצע הוא מחוץ
השופט הנבחר משלב את פסק הדין
להחליט אם ההוראה, השאלת או הביטוי יכולים להמשיך.

## שאלות תומכות {#supported-queries}

ניתן לבקש סימני רשות ותפקידים.

שאלת תפקידים:

- [`FindRoles`](/he/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/he/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/he/reference/queries.md#accounts-and-permissions)

שאלתות עבור סימני רשות:

- [`FindPermissionsByAccountId`](/he/reference/queries.md#accounts-and-permissions)
