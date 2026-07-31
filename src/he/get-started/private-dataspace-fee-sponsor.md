---
translation_locale: he
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# דמי תורם למרחב נתונים פרטי {#sponsor-fees-for-a-private-dataspace}

תמיכה בתשלום מאפשרת למשתמשים להגיש עסקאות במרחב נתונים פרטי ללא
חוות XOR. המשתמש עדיין חתם על העסקה.
נקודות בחשבון של ספונסר, והזמן לקיץ XOR משקל
על דמי הרשת.

האינטגרציה מורכבת משלושה חלקים זזים:

1. הערך מאפשר תמיכה בתשלום
2. החשבון המוגן קיים וקיים XOR
3. כל משתמש יש `CanUseFeeSponsor` עבור ספונסר זה

לאחר מכן, כל עסקאות משתמשות ספנסוריות זקוקות רק לתנתונים המטא:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

דף זה מראה שני דפוסים נפוצים:

- **משתמש חינם כותב**: הספונסר משלם XOR והמשתמשים לא משלמים כלום.
- **דמי סימנים מקומיים**: המשתמש משלם לגיוס בטוקן של אפליקציה, וה
  הספונסר משלם את הרשת XOR.

שימוש Taira או רשת בדיקה פרטית תחילה.
שינוי המפעיל והשלטון; הוא לא נוצר על ידי הפקודה של הלקוח.

## ערכים דוגמאיים {#example-values}

הפקודות הבאות משתמשות במקומות אלה:

```bash
export DATASPACE="team"
export USER="<USER_ACCOUNT_I105>"
export SPONSOR="<SPONSOR_ACCOUNT_I105>"
export TREASURY="<TREASURY_ACCOUNT_I105>"
export XOR_ASSET="xor#universal"
export BILLING_DOMAIN="billing.team"
export LOCAL_FEE_ASSET="usage#billing.team"
export LOCAL_FEE_ASSET_ID="<LOCAL_FEE_ASSET_DEFINITION_BASE58>"
export USER_ALIAS="alice@team"
export PHONE_POLICY="phone#team"
export EMAIL_POLICY="email#team"
export POLICY_OWNER="<IDENTIFIER_POLICY_OWNER_ACCOUNT_I105>"
```

השתמש בקנוניקה I105 חשבון IDs אלא אם כן המשלוח שלך יש חשבון פעיל.
שם-תג עבור אותם חשבונות.

## 1. להכין את חלל הנתונים {#_1-prepare-the-dataspace}

התחל מהקטלוג של חלל נתונים פרטי ושימוש במסלול
[חיבור ל SORA Nexus מספרי נתונים](/he/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace).
חתיכה פונה למפעיל נראית כך:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "team-private"
description = "Private team lane"
dataspace = "team"
visibility = "private"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "team"
id = 42
description = "Private team dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "team"
[nexus.routing_policy.rules.matcher]
account_prefix = "team."
description = "Route team domains to the private dataspace"
```

לפני שאתה עובר למערכות משתמשת, בדוק אם:

- המסלול הפרטי מופיע בנקודה `/status` תגובה
- חשבונות משתמשים מופעלים על ידי זרם האינטרנט הפרטי שלך
- החשבון הספונסר קיים.
- ה- XOR נכס תשלום וחשבון סינקת תשלום הם תקפים ברשת

## 2. רישום נכסים במרחב נתונים {#_2-register-assets-in-the-dataspace}

רשום את ההגדרות של נכסים שהמשתמשים יחזיקו בתוך הפרטי
נתונים לפני שאתה משדר אותם לגיק היישום. עבור תשלום סימן מקומי
תבנית, השימוש בהוראה `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

תחילה להגדיר את הדומיין SNS רכישה של בעלים של חלל שמות נכסים.
ללא סודות `AliasSetupPlanRequestV1` כוונה `$BILLING_DOMAIN`, כולל
המספר `team` מרחב נתונים ID, בעל הקנוניקה, תקופת השכרה והצעת הערכה הנוכחית
שומר:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

אז רשום את ההגדרה של נכס. `--id` הוא רמת הרשת
הגדרה של נכס ID. התכופף הוא מה שהפתוחים והמשתמשים הסופי צריכים להשתמש בו
קוד חלקי נתונים:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

מנט או להעביר את הסימן המקומי למשתמש במהלך האינטרנט:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

בדוק את האיזון של המשתמש:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

השתמשו באותו דפוס עבור נכסים של יישומים במרחב נתונים.
הגדרה של נכס על כל טוקן, לתת לכל אחד שם פרופיל למרחב נתונים, ולהתייחס
פרופיל של SDK קוד במקום קו-קוד קנוני הגדרה של נכס IDs.

## 3. רישום שם-שם המשתמש {#_3-register-user-aliases}

החשבונות עדיין קנוניים. I105 חשבון IDs. שמות המשתמשים הם חשבונות
כינויים, וכינוי צריך להיות כפפות לא רגישות כגון `alice@team` או
`alice@members.team`. אל תשתמשו במספרים טלפונים או כתובות דואר אלקטרוני ככותרות.
אלה שייכים לזרם זהות פרטי בחלק הבא.

הגדרת האליס משתמשת באותו מתכנן דיקלרטיבי כמו הגדרת דומיין. SDK או
שירות ההישג ליצור סוד-חופשי `AliasSetupPlanRequestV1` מטרתו
מטרות הכניסה למחשב `$USER`, הוא בוחר את התפקיד העיקרי.
מרחב נתונים ID, ונושא את המשמר הנוכחי על ציטוט השכרה.
כעסקה אטומית אחת:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

אם המשתמש לא צריך לשלם XOR, השתמשו בהישג הספונקר-יודע על הסיפון
שירות לבניית ושלוח העסקת הקמת.
רכישה ושמות מחובדים לתיסקי יישום עצמאיים.

לאחר שהכינוי נקשור, תעבדו אותו CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

עבור יצירת חשבון חדש, מעדיפים שירות חיבור
`NewAccount` עם סדנה `uaid` ואם יש צורך, `label`. ה-
פשוט `ledger account register --id` פקודה רק רשום הקנוניקה
חשבון ID.

## רישום טלפון ו- E-mail בפרטיות FHE {#_4-register-phone-and-email-privately-with-fhe}

השתמשו במספר טלפון וכתובת דואר אלקטרוני כביקורות מזהה פרטיים, לא ציבוריים
פרופיל כינוי. FHE-הזרם המומץ שומר על מזהים ברורים מחוץ לכינויים של חשבונות,
נתונים מטאטא של עסקאות, ומצב העולם:

1. המפעיל רשום
   [RAM-LFE/FHE מדיניות התוכנית](/he/blockchain/ram-lfe.md) עבור טלפון ומייל
2. המפעיל רשום מדיניות מזהה פעילה כגון: `phone#team` ו
   `email#team`
3. הארנק משגר את הטלפון או הדואר האלקטרוני מקומי
4. הארנק שולח את הערך המוצפן למפתר
5. המפתר חוזר `IdentifierResolutionReceipt`
6. המשתמש שולח `ClaimIdentifier` עם הקבלה
7. שרשרת מאחסנת מזיהוי לא ברורה ושיש של קבלה, ולא הטלפון הגורם או
   ערך דואר אלקטרוני

המערכת הפוליטית מצד המעסיק היא: SDK או משימת שירות.
זוגות ההוראות הללו עבור כל סוג מזהה:

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "$POLICY_OWNER",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "$PHONE_POLICY",
  owner = "$POLICY_OWNER",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "$PHONE_POLICY")
```

חזרו על זה עבור דואר אלקטרוני עם:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

במהלך האינטרנט, הארנק או האחורי צריך להתרגל באופן מקומי:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

לאחר הקובץ של מטא-מנתונים של ספונסר נוצר בשלב 8, תגיש
הוראות תביעה עם המטא נתונים אלה:

```text
ClaimIdentifier(
  account = "$USER",
  receipt = IdentifierResolutionReceipt {
    payload: {
      policy_id: "$PHONE_POLICY",
      opaque_id: "<OPAQUE_ACCOUNT_ID>",
      uaid: "<USER_UAID>",
      account_id: "$USER",
      ...
    },
    attestation: "<RESOLVER_SIGNATURE_OR_PROOF>"
  }
)
```

הזרם CLI לא חושף פקודות מודפסות עבור זהויות אלה
הוראות. `InstructionBox` הערכים עם SDK ו
להגיש אותם `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

שמרו על הגדרות האלה בשירות ההכנסה:

- שם כינוי של חשבונות הם כפפות שניתן לקרוא רק על ידי אדם.
- הערכים הטלפונים והודעות הדואר האלקטרוניים לא מופיעים בשמות, נתונים מטאטא, רשומות או
  מטענים שימושיים של עסקאות
- החשבון יש `uaid` לפני שהוא דורש מזהים פרטיים
- קבלה מחויבת `policy_id`, `opaque_id`, `uaid`, `account_id`, וסיום
- מפתחות resolver והתחייבויות של תוכניות מוסתרות נשלטות על ידי ממשל

## 5. אפשרת תמיכה בנקודה {#_5-enable-sponsorship-on-the-node}

תמיכה בתשלום היא מדיניות של קשר/זמן פועל. Nexus קונפיגציה של הוצאות:

```toml
[nexus.fees]
fee_asset_id = "xor#universal"
fee_sink_account_id = "<FEE_SINK_ACCOUNT_I105_OR_ALIAS>"
base_fee = "0"
per_byte_fee = "0"
per_instruction_fee = "0.001"
per_gas_unit_fee = "0.00005"
sponsorship_enabled = true
sponsor_max_fee = "0"
```

`fee_asset_id` הוא נכס שכר הרשת. SORA Nexus זה... XOR. השתמש ב
פעיל XOR פרופיל או קנוני XOR הגדרה של נכס ID חשוף על ידי הרשת שלך.

`sponsor_max_fee = "0"` משמעות הדבר היא שאין גבול של ספונצ'ר על העסקה.
ייצור, להגדיר קצה שאינו אפס לאחר שאתה יודע את הגודל הרגיל ואת הפרופיל הגז
של עסקאות השטח נתונים שלך.

התחל מחדש או תגלח את ההערכה הזו דרך התהליך הרגיל של המפעיל.

## 6. ליצור ולממן את המתורם {#_6-create-and-fund-the-sponsor}

ליצור זוג מפתחות ספנסור אם צריך:

```bash
kagami keys --algorithm ed25519 --json
```

הפוך את המפתח הציבורי לתבנית החשבון לרשת שלך:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

רשום את החשבון של הספונסר באמצעות זרימת האינטרנט הפרטית שלך:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

מימון הספונסר XOR ממחסון, חשבון דמיה או מסמך אחר
חשבון:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

עבור Taira התרגילים, להציל את עוזר המזרקה
[קבל Testnet XOR על Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
כמו `taira_faucet_claim.py`, ואז לממן את הספונסר עם המזרקה הציבורית
במקום העברת כספים:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

בדוק את ספנסור. XOR משקל:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. לתת למשתמש גישה לגיוס {#_7-grant-a-user-access-to-the-sponsor}

הספונסר חייב לתת לכל משתמש רשות להטיל עליו דמי.
מה מונע ממשתמשים להעלות שמות על חשבונות ספונסרים שרירותיים.

תפעיל את זה כחשבון הספונסר, או כחשבון פעיל שמותר על ידי
מדיניות זמן הפעלה:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission grant --id "$USER"
```

עבור שירותי כניסה, להפוך את זה צעד רגיל של אספקת חשבונות ולוג:

- חשבון משתמש
- חשבון הספונסר
- מרחב נתונים או יישום
- כרטיס אישור או החלטה לניהול

כדי לבדוק את תוספי המשתמש:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. תוסף נתונים מטאטאנסור {#_8-attach-sponsor-metadata}

ליצור קבוצה של מטא נתונים שניתן להשתמש בה שוב:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

כל כתבה שהוגשה עם המטאדייטה זו כולה על הספונסר:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

עבור SDKs, לצרף את אותו אובייקט מטא נתונים של העסקה לחתום
העסקה. המשתמש חתם על העסקה עם מפתח המשתמש.
לא חתום על כל עסקאות משתמש כי `CanUseFeeSponsor`
הסמכה היא הזכות.

## דפוס 1: משתמשים משלמים ללא תשלום {#pattern-1-users-pay-no-fees}

השתמשו בזה כאשר האפליקציה או המפעיל מקבלים את כל דמי הרשת.

רשימת הבדיקה של המפתחים:

1. שמרו על עומס הניתוח הרגיל של המשתמש ללא שינוי.
2. הוספת מטא נתונים של עסקאות עם `fee_sponsor`.
3. תחתום כמשתמשים.
4. תשלחו דרך מסלול הנתונים הפרטיים.

חשבון המשתמש לא צריך XOR חשבון הספונסר חייב לשמור
מספיק XOR כדי לכסות את ההסדר Nexus תשלום.

## דפוס 2: משתמשים משלמים סימן מקומי {#pattern-2-users-pay-a-local-token}

השתמש בזה כאשר משתמשים לא צריכים להחזיק XOR, אבל חלל הנתונים עדיין רוצה
דמי אפליקציה פנימיים, הוצאות אשראי או סימן קוטה.

בדפוס זה, הסימן המקומי הוא תשלום יישום.
ספונסר עדיין משלם את דמי הרשת XOR.

לדוגמה, השתמשו בטוקן מקומי במרחב נתונים פרטי:

```text
usage#billing.team
```

משתמשים בכספים עם `usage#billing.team` במהלך ההכנסה, חידוש התשלום,
ואז להפוך את העסקה של המשתמש אטומטית:

1. להעביר סימנים מקומיים מהמשתמש לגיוס
2. לבצע את פעולת האפליקציה המבוקשת
3. כולל `fee_sponsor` מטא-נתונים כך שהספונסר משלם XOR

מינימום CLI בדיקת עשן היא רק העברת סימנים מקומיים שטופס XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

עבור אפליקציה אמיתית, אל תשלח את התשלום עם טוקן מקומי
תיקון של עסקה אחת חתומה המכילה את
התשלום והנחיות העסקית, או לחשוף נקודת כניסה לעסק
אוסף את הסימן המקומי לפני השימוש בפעולה העסקית.

שמרו על מדיניות ההפוך בתطبيق או בחוזה:

- איזה מבצע עולה כמה יחידות סימון מקומיות
- איך מפות הזרם של סימנים מקומיים לתרום XOR תוספות
- מה קורה כאשר איזון המשתמש הוא נמוך מדי
- מה קורה כאשר ספונסר XOR האיזון הוא נמוך מדי.

::: warning

לא להשתמש `gas_asset_id` עבור דפוס "המחיר של סימן מקומי", אלא אם כן אתה רוצה
הספונסר יועיל גם במוצר הגז הזה.
`fee_sponsor` כמו כן עושה את הספונסר משלם עבור גז צינור מוגדר
עבור תשלומי משתמשים של טוקנים מקומיים, לאסוף את הטוקן באופן מפורש עם
חוק העברה או חוזה.

:::

## תיקון עסקאות חסכניות נכשלו {#debug-failed-sponsored-transactions}

הסיבות הנפוצות לסירוב בדרך כלל מצביעות על צעד אחד חסר:

| טקסט שגיאה | מה לבדוק |
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` הוא עדיין `false` על הערך. |
| `fee sponsor is not authorized` | המשתמש לא `CanUseFeeSponsor` בשביל הספונסר הזה. |
| `fee asset ... is missing` | הספונסר לא מחזיק את XOR נכס תשלום. |
| `fee balance ... is insufficient` | תוסף את זה של הספונסר XOR איזון. |
| `fee exceeds sponsor_max_fee` | הגדלה `sponsor_max_fee` או לצמצם את גודל העסקה/גז. |
| `invalid nexus fee asset id` | תיקון `nexus.fees.fee_asset_id` או XOR פרופיל נכס. |

בעת תיקון דפוס 2, בדוק את שני השוויונים:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"

iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

## תפעיל את המתורם {#operate-the-sponsor}

לטיפול בספונסר כמו חשבון כספי:

- לשמור על מפתחות ספנסור נפרדות עבור רשתת הבדיקה, ארכיון ורשת מרכזית
- אזהרה לפני הספונסר XOR השוויון מגיע לרצף הכניסה.
- להגדיר קצב שאינו אפס `sponsor_max_fee` גבול ברגע שהנועה מאופיינת.
- סופסוריות של גבול תעריפים בביקשתך או בשער שלך
- ביטול `CanUseFeeSponsor` כאשר משתמשים עוזבים את חלל הנתונים
- משלב את ה-hashes של עסקאות משתמש, תשלומים עם טוקנים מקומיים וספונצרים XOR
  חובות

ביטול תמיכה עבור משתמש:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission revoke --id "$USER"
```

## דפים קשורים {#related-pages}

- [חיבור ל SORA Nexus מספרי נתונים](/he/get-started/sora-nexus-dataspaces.md)
- [פעלת Iroha 3 דרך CLI](/he/get-started/operate-iroha-via-cli.md)
- [נכסים](/he/blockchain/assets.md)
- [רשיונות](/he/blockchain/permissions.md)
- [סימני רשות](/he/reference/permissions.md)
