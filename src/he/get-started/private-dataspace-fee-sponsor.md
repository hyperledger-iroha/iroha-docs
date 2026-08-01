---
translation_locale: he
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# דמי תמיכה עבור חלל נתונים פרטי {#sponsor-fees-for-a-private-dataspace}

תמיכה בתשלום מאפשרת למשתמשים להגיש עסקאות במרחב נתונים פרטי מבלי להחזיק XOR. המשתמש עדיין חותם על העסקה. הנתונים המתאחדים של העסקה נקראים לחשבון ספנסור, וזמן ההפעלה מחייב את המשקל של הספנסור XOR עבור עמלות הרשת.

האינטגרציה כוללת שלושה חלקים זזים:

1. העמוד מאפשר תמיכה בתשלום.
2. חשבון הספונזר קיים ויש לו XOR
3. לכל משתמש יש `CanUseFeeSponsor` עבור ספונסר זה.

לאחר מכן, כל עסקאות משתמשות ספנסוריות צריכות רק את הנתונים המתאים האלה:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

עמוד זה מראה שני דפוסים משותפים:

- משתמש חופשי כותב: הספונסר משלם XOR והמשתמש אינו משלם כלום.
- דמי סימנים מקומיים: המשתמש משלם לגיוס בטקנת אפליקציה, והגיוס משלם לרשת ב XOR.

השתמש Taira או ברשת בדיקה פרטית תחילה. חלל נתונים פרטי חדש הוא מפעיל ושינוי בניהול; הוא לא נוצר על ידי הגדרת הלקוח.

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

השתמשו בחשבון קנוני I105 IDs אלא אם כן המשלוח שלכם יש שם כינוי של חשבון פעיל עבור אותם חשבונות.

## 1. להכין את חלל הנתונים {#_1-prepare-the-dataspace}

התחל מהקטלוג של מרחבי נתונים פרטיים ועבודת ההסלול המתוארת ב [Connect to SORA Nexus Dataspaces](/he/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). קטנטן פונה למפעיל נראה כך:

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

- המסלול הפרטי מופיע בתגובה `/status`
- חשבונות משתמשים מקבלים על ידי הזרימה הפרטית שלך.
- החשבון של ספונסר קיים.
- נכס הוצאות XOR והחשבונות של ספינת הוצאות הם תקפים ברשת

## רישום נכסים במרחב נתונים. {#_2-register-assets-in-the-dataspace}

רשום את ההגדרות של נכסים שהמשתמשים יחזיקו בתוך חלל הנתונים הפרטי לפני שתדביקו אותם לתוך ההיגיון של היישום. עבור דפוס תשלום סימן מקומי, הדרכה משתמשת `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

תחילה להגדיר את הדומיין והליז SNS שחזיקים במרחב שמות נכסים. ליצור כוונה ללא סוד `AliasSetupPlanRequestV1` עבור `$BILLING_DOMAIN`, כולל המרחב נתוני `team` המספרי ID, הבעלים הקנוני, תקופת השכרת, ומגן הציטוט הנוכחי:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

לאחר מכן רשום את ההגדרה של נכס. הקנוניקה `--id` היא הגדרה של נכסים ברמת הרשת ID. התכופף הוא מה שהפתוחים והמשתמשים הסופי צריכים להשתמש בקוד חלל נתונים.

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

מטבעות או להעביר את הסימן המקומי למשתמש במהלך האינטרנט:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

בדוק את השוויון של המשתמש:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

השתמש באותו דפוס עבור נכסים של יישומים במרחב נתונים. רשום הגדרה אחת של נכס על כל טוקן, תן לכל אחד מהם שם פרופיל למרחב נתוני, ותתייחס לכינוי פרופיל מהקוד SDK במקום הגדרת נכס קנונית בקוד קשה IDs.

## 3. רשום פרופיל שם המשתמש {#_3-register-user-aliases}

החשבונות עדיין קנוניים I105 חשבון IDs. שמות המשתמשים הם כינויים של חשבונות, וכינוי צריך להיות ידיים לא רגישים כגון `alice@team` או `alice@members.team`. אל תשתמשו במספר טלפון או כתובות דואר אלקטרוני ככינוי. אלה שייכים לזרם מזהה פרטי בחלק הבא.

הגדרת האליס משתמשת באותו מתכנן דיקלרטיבי כמו הגדרת תחום. SDK או שירות אינטראקציה ליצור שירות ללא סודות `AliasSetupPlanRequestV1` כוונה אשר מטרות הכניסה לחשבונות `$USER`, בוחרת את התפקיד העיקרי, מחזיקה את חלל הנתונים המספריים ID, ואז לתכנן וליישום את זה כעסקה אטומית אחת:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

אם המשתמש לא צריך לשלם XOR, השתמש בשירות ההזמנה המקובל של ספונסר כדי לבנות ולשלוח את העסקת הקמת. אל תחלקו רכישת השכרה ושינוי חיובי לעסקים יישום עצמאיים.

לאחר הקשר של השם השוואי, תבדקו את זה מ- CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

עבור יצירת חשבון חדש, מעדיפים שירות חיבור שמבנה `NewAccount` עם סטיבל `uaid` ו, אם צריך, ראשוני `label`. הפקודה פשוטה `ledger account register --id` רשום רק את החשבון הקנוני ID.

## רישום טלפון ומייל פרטי עם FHE {#_4-register-phone-and-email-privately-with-fhe}

השתמשו במספר טלפון וכתובת דואר אלקטרוני כביצועים של זיהוי פרטי, לא שם כינוי ציבורי. הזרימה המבוססת על FHE מומרת על זיהויים שבורים מחוץ לזיהוי חשבונות, נתונים מטאטא של עסקאות, ומצב העולם:

1. המפעיל רשום מדיניות תכנית [RAM-LFE/FHE ](/he/blockchain/ram-lfe.md) לטלפון ולמייל.
2. המפעיל רשום מדיניות זיהוי פעילה כגון `phone#team` ו `email#team`
3. הארנק מסדר את הטלפון או הדואר האלקטרוני מקומי.
4. הארנק שולח את הערך המוצפן לפתרון.
5. המפתר משובב `IdentifierResolutionReceipt`
6. המשתמש שולח `ClaimIdentifier` עם הקבלה.
7. שרשרת מאחסן מזהה ושיש לא ברורה, ולא ערך הטלפון או הדואר האלקטרוני רם

הגדרת מדיניות מצד המפעיל היא משימה SDK או שירות. לבנות ולהגיש זוגות הוראות אלה עבור כל סוג של מזהה:

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

לאחר שנוצר הקובץ metadata של ספונסר בשלב 8, להגיש הוראה טענה חתומה על ידי המשתמש עם ה-metadata:

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

הקו הנוכחי CLI אינו חושף פקודות מודפסות עבור הוראות זהות אלה. ליצור ערכים סדרתיים `InstructionBox` עם SDK ולשלוח אותם דרך `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

שמרו על הגדרות האלה בשירות ההשגחה:

- שם כינוי של חשבונות הם מחזיקים שניתן לקרוא רק על ידי אדם.
- הערכים הטלפונים והודעות הדואר האלקטרוניים לא מופיעים באגנים, מטא-מנתונים, שיכורים או עומסי עסקאות.
- חשבון יש `uaid` לפני שהוא דורש מזהים פרטיים
- הכספים קשורים `policy_id`, `opaque_id`, `uaid`, `account_id`, ומקיימים.
- מפתחות resolver והתחייבויות של תוכניות מוסתרות נשלטות על ידי ממשל.

## 5. לאפשר תמיכה בנקודה. {#_5-enable-sponsorship-on-the-node}

תמיכה בתשלום היא מדיניות קו/זמן פועל. אפשר להפעיל אותה בהקנה התשלום Nexus:

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

`fee_asset_id` הוא נכס שכר הרשת. SORA Nexus זה... XOR. השתמשו בפעילות XOR פרופיל או קנוני XOR הגדרה של נכס ID חשוף על ידי הרשת שלך.

`sponsor_max_fee = "0"` פירושו שאין גבול ספונסר על עסקאות. עבור ייצור, להגדיר גבול שאינו אפס לאחר שאתה יודע את הגודל הרגיל ואת הפרופיל הגז של העסקאות שלך תחום נתונים.

להפעיל מחדש או לגלוש את ההסדר הזה באמצעות התהליך הרגיל של המפעיל שלך.

## 6. ליצור ולממן את המתנדב {#_6-create-and-fund-the-sponsor}

ליצור זוג מפתחות ספנסור אם זה נחוץ:

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

לממן את הספונסר עם XOR ממוצר, חשבון דמיה או חשבון מימון אחר:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

עבור: Taira התרגילים, להציל את עוזר המזרקה [קבל Testnet XOR על Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) כמו `taira_faucet_claim.py`, לאחר מכן לממן את הספונסר באמצעות המזרקה הציבורית במקום העברת כספית:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

בדוק את המשקל XOR של הספונסר:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. לתת למשתמש גישה לגיוס {#_7-grant-a-user-access-to-the-sponsor}

הספונסר חייב לתת לכל משתמש רשות לעלות עליו עמלות. ההתרומה היא מה שממנע מהמשתמשים מכינה חשבונות ספונזר שרירותיים.

תפעיל את זה כחשבון הספונסר, או כחשבון פעיל המאפשר על ידי מדיניות הפעלה שלך:

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

עבור שירותי כניסה, להפוך את זה צעד רגיל של אספקת חשבונות וזומן:

- חשבון משתמש
- חשבון ספנסור
- מרחב נתונים או יישום
- כרטיס אישור או החלטה לניהול

כדי לבדוק את הסיועים של המשתמש:

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

כל כתיבה שהוגשה עם המטאדייטה זו נטל על הספונצור:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

עבור SDKs, לצרף את אותו אובייקט מטא נתונים של העסקה לעסקה חתומה. המשתמש חתם על העסקה עם מפתח המשתמש. הספונסר לא חותם על כל העסקה של המשתמש מכיוון שהתרום הקודם `CanUseFeeSponsor` הוא האישור.

## דפוס 1: משתמשים משלמים ללא תשלום {#pattern-1-users-pay-no-fees}

השתמשו בזה כאשר האפליקציה או המפעיל מקבלים את כל דמי הרשת.

רשימת הבדיקה של המפתחים:

1. שמרו על המטען המשפחני הרגיל של המשתמש ללא שינוי.
2. הוסף מטא נתונים על עסקאות עם `fee_sponsor`.
3. תחתום כמשתמש.
4. תשלחו דרך מסלול הנתונים הפרטיים.

חשבון המשתמש אינו זקוק לריבית XOR. החשבון המתורם חייב לשמור מספיק XOR כדי לכסות את הוצאות ההסדרות Nexus.

## דפוס 2: משתמשים משלמים סימן מקומי {#pattern-2-users-pay-a-local-token}

השתמש בזה כאשר המשתמשים לא צריכים להחזיק XOR, אבל חלל הנתונים עדיין רוצה תשלום יישום פנימי, משכורת אשראי, או סימן כיוונה.

בתבנית זו, הסימן המקומי הוא תשלום בקשה. זה לא נכס דמי רשת. הספונסר עדיין משלם את דמי הרשת ב XOR.

לדוגמה, השתמשו בסימן מקומי במרחב הנתונים הפרטי:

```text
usage#billing.team
```

משתמשי קרן עם `usage#billing.team` במהלך הצטרפות, חידוש הכספים או חלוקת היקף. אז תעשה את העסקה של המשתמש אטומטית:

1. להעביר סימנים מקומיים מהמשתמש לאורח
2. לבצע את פעולת האפליקציה המבוקשת
3. לכלול `fee_sponsor` מעטהנתונים, כך שהמתורם משלם XOR

בדיקת עשן מינימלית CLI היא רק העברת הסימנים המקומיים שטורם על ידי XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

עבור אפליקציה אמיתית, אל תשלח את התשלום המקומי כמעשה נפרדת של מאמץ הטוב ביותר. הקים עסקנה אחת חתומה המכילה גם את התשלום וגם את הוראות העסק, או חשוף נקודת הכניסה לחוזה שמאספת את ה-token המקומי לפני השימוש בפעולה העסקית.

שמור את מדיניות ההפוך באפליקציה או החוזה שלך:

- איזה מבצע עולה כמה יחידות סימון מקומיות
- איך מפות זרימת סימנים מקומיות לתרום XOR תוספים
- מה קורה כאשר האיזון של המשתמש הוא נמוך מדי
- מה קורה כאשר המשקל של ספונסר XOR הוא נמוך מדי

::: warning

אל תשתמש `gas_asset_id` עבור דפוס "מחיר סימן מקומי", אלא אם כן אתה רוצה שהספונסר יילוי גם בעסקי הגז הזה. בזמן ההצלה הנוכחי, `fee_sponsor` הופך גם את הספונסר לממשלם על חובות נכסים של צינורות גז מוגדרים. עבור תשלומי משתמשים של טוקנים מקומיים, אוסף את הטוקן באופן מפורש עם חוק העברה או חוזה.

:::

## תיקון עסקאות חסכניות נכשלו {#debug-failed-sponsored-transactions}

הסיבות הנפוצות לסירוב בדרך כלל מצביעות על צעד ייצור אחד חסר:

|טקסט טעות |מה לבדוק?|
| --- | --- |
|`fee sponsorship is disabled` |`nexus.fees.sponsorship_enabled` עדיין `false` על העמודה. |
|`fee sponsor is not authorized` |למשתמש אין `CanUseFeeSponsor` עבור ספנסור זה. |
|`fee asset ... is missing` |הספונסר אינו מחזיק בעסקי הוצאות XOR המוגדר. |
|`fee balance ... is insufficient` | תוסף את זה. XOR איזון. |
|`fee exceeds sponsor_max_fee` |להגדיל `sponsor_max_fee` או להפחית את גודל העסקה/גז. |
|`invalid nexus fee asset id` |תיקון `nexus.fees.fee_asset_id` או התכילת נכס XOR. |

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

תתייחסו לספונסר כמו לחשבון כספי:

- לשמור על מפתחות ספנסור נפרדות עבור רשת הבדיקה, סידור ורשת מרכזית.
- אזהרה לפני ששלם הספונסר XOR יגיע לקומה של הכניסה
- להגדיר גבול שאינו אפס `sponsor_max_fee` ברגע שהנועה מאופיינת
- תעריף-גבול ספנסור כותבים בקשתך או שערה
- ביטול `CanUseFeeSponsor` כאשר משתמשים עוזבים את חלל הנתונים.
- להשוות את ה-hashes של עסקאות המשתמשים, תשלומי טוקנים מקומיים ודוברי ספונסרים XOR

ביטול תמיכה של משתמש:

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

- [חיבור ל- SORA Nexus נתונים](/he/get-started/sora-nexus-dataspaces.md)
- [פעל Iroha 3 באמצעות CLI ](/he/get-started/operate-iroha-via-cli.md)
- [נכסים](/he/blockchain/assets.md)
- [רשיונות](/he/blockchain/permissions.md)
- [סימני רשות ](/he/reference/permissions.md)
