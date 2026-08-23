---
translation_locale: he
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 6b50c995afaf9f46df6fdaab31add40b106cfa12fdaa31dabbb74448486f87f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# נכסים פונגביים {#fungible-assets}

## התוצאה {#outcome}

לבחון חי Taira הגדרות נכסים ולשלם רישום, מנטה, העברה, שריפה, ותנועה של אימות השוויון ברשת מקומית שנוצרת. המתכון משתמש בהגדרת נכס Base58 לא מקובלת קנוניקה IDs, שם כינוי מוסמך לתחום, חשבון ללא דומיין I105 IDs ושכר תשלום מפורסם.

## תנאים מוקדמים {#prerequisites}

- `curl`, `jq`, Python 3.11 או מאוחר יותר, Node.js 24, והזרם `iroha` CLI.
- גישה בקריאה בלבד Taira.
- עבור הליכה של כתיבה, רשת מקומית נוצרה מ [שיגור Iroha](/he/get-started/launch-iroha.md), עם `./localnet/client.toml` ו Torii על `http://127.0.0.1:8080`.

## צעדים {#steps}

### 1. לבדוק את ההגדרות של Taira ללא חותם {#_1-inspect-taira-definitions-without-a-signer}

הגדרות נכסים נושאות Base58 ID, שם תצוגה לא ברור, מדיניות קביעות, סולם מספרי, פרופיל אופציונלי, בעל, וכמות הכוללת. המשקל הקונקרטי כולל גם את חשבון הבעלים שלו ואת תחום הנתונים בחופשי.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

להפעיל את טופס JavaScript עם `node taira-assets.mjs`. נכס ציבורי IDs הם ערכים Base58 ריקים; ערך קריא כגון `cookbook_credit#wonderland.universal` הוא שם כינוי שמגיע לאחד מהם IDs.

### 2. להכין את הרשות המקומית ואת היעד {#_2-prepare-the-local-authority-and-destination}

להוציא את הרשות המקומית מהמפתח הציבורי בהשוואה המיוצרת ולבחר חשבון רשמי אחר כמתקבל. שום מפתח פרטי לא מודפס.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. רשום הגדרה מספרית {#_3-register-a-numeric-definition}

זה מקומי בלבד ID הוא כתובת נכס-הגדרת Base58 ללא קובץ תקנה. האליס מספק את ההערכה של `domain.dataspace` שניתן לקרוא בבני אדם. סולם `2` מאפשר שני ספרות חתיכות; השאירה של `--mint-once` שומר על מדיניות המוגנת `Infinitely`.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

אל תשתמשו מחדש ב ID ב Taira. רישום ברשת ציבורית דורש קנוניקה חדשה ID, דומיין/כותרת מיועדת לבקשה שלך, מימון עלות, והרשיון לרשום נכסים של זמן הפעלה.

### 4. מנטה, העברה ושרוף {#_4-mint-transfer-and-burn}

כל פקודות כתיבה בחרו במפורש את הסמכות כמשלם עמלה. CLI מציין את העסקה המדויקת לפני חתימה ומחכה באופן דפונט.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

לאחר השריפה, תצפו במשקל המקור `64.50`, משקל היעד `25.50`, וכמות הכוללת `90.00`.

::: warning גבולת היתר

ב- Taira, תלוף את `taira.tx-metadata.json` המוצא מהנעל ותשתמש ב- `--fee-payer authority` עבור כל כתיבה. הרישום והציתוי דורשים רשיונות של המאשר הפעיל; העברה וחיסול דורשים סמכות על סלון המקור. חשבון מיועד למנעל אינו יוצר באופן אוטומטי.

:::

## לאמת {#verify}

קראו את המשקל המפורסם ואז את ההגדרה. בקשות אלה לאחר המדינה הם שיעור ההצלחה; קבלה של הצעת הודעות היא לא.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

טענות היישום צריכות להשוות את הערכים המספריים כעשרות נקודות קבועות, ולא ערכים בינאריים של נקודות צביעות, וצריכות לאמת את ההגדרה ID וכן את החשבון.

## פתרון בעיות {#troubleshooting}

- ID המכיל `#` הוא שם כינוי או סכום מסלול קונקרטי פשוטו כמשמעו, ולא תיאור נכס קנוני ID. השתמש בשווי Base58 ריק עם `--definition`, או העביר שם כינוי מחובר עם `--definition-alias`.
- שגיאות `Scale` פירושו כי כמויות יש יותר מספרים חלקי מאשר ההגדרה מאפשרת.
- דחייה `Mintability` פירושה כי מדיניות `Once`, `Not` או `Limited(n)` סיימה או סירבה את הקצבת. אל תכתוב מחדש את ההיסטוריה; השתמש במדיניות שנשלחה על ידי שאלת ההגדרה.
- שלב 2 בוחר במכוון חשבון יעד רשום. אם הכניסה לאוצר היא `ExplicitOnly`, אספקת היתר יעד באמצעות מסמך מורשה זרימה לפני העברה. השומר שנקרא באופן דומה CLI לא רשום חשבון או מצואה; הוא מבטל במקום להוסיף הוראה אחרת.
- דחייה בתשלום מתרחשת לפני הצלחת ההוראות הרגילה. בחר את המשלם, השתמש בנתונים של נכסי התשלום של הרשת ותבדוק את היתר שלה.
- אם ההגדרה המקומית הקבועה קיימת כבר מממשלה קודמת, תפעילו רשת מקומית חדשה או תמשיכו עם מצביה הקיימים. לעולם אל תחליפו זרם אקראי שגוי עבור Base58 ID.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [בדיקות אינטגרציה של מחזור החיים של נכסים במתחם קשור ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/asset.rs)
- [Rust דוגמאות לבניית נכסים בביצוע ההתחייבויות הקשורות ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/examples/tutorial.rs)
- [נכסים](/he/blockchain/assets.md)
- [הוראות](/he/blockchain/instructions.md)
- [סימני רשיון ](/he/reference/permissions.md)
- [JavaScript ו TypeScript ](/he/guide/tutorials/javascript.md)
