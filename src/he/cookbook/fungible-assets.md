---
translation_locale: he
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# נכסים פונגביים {#fungible-assets}

## התוצאה {#outcome}

בחנו הגדרות נכסים חיות ב־Taira, ולאחר מכן השלימו תהליך של הנפקה, העברה, שריפה ואימות יתרות ברשת מקומית שנוצרה. המתכון משתמש במזהי הגדרות נכסים קנוניים בפורמט Base58 ללא קידומת, במזהי חשבון I105 ללא דומיין ובתשלום עמלה מפורש.

## תנאים מוקדמים {#prerequisites}

- `curl`, `jq`, Python 3.11 או מאוחר יותר, Node.js 24, וה־CLIs הנוכחיים `iroha` ו־`kagami`.
- גישה בקריאה בלבד Taira.
- עבור המדריך של פעולות הכתיבה: רשת מקומית שנוצרה באמצעות `kagami localnet generate --peers 4 --out-dir ./localnet` כמו ב־[שיגור Iroha](/he/get-started/launch-iroha.md), בתוספת `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa`. היא מספקת את `./localnet/client.toml` ואת Torii בכתובת `http://127.0.0.1:8080`.

## צעדים {#steps}

### 1. לבדוק את ההגדרות של Taira ללא חותם {#_1-inspect-taira-definitions-without-a-signer}

הגדרות נכסים נושאות מזהה Base58 אטום, שם תצוגה, מדיניות הנפקה, סולם מספרי, כינוי אופציונלי, בעלים, דומיין או מרחב נתונים בעלים אופציונלי, מדיניות יתרה וכמות כוללת. היתרה הממשית כוללת גם את חשבון המחזיק בה ואת היקף מרחב הנתונים האופציונלי.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
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

גזרו את הסמכות המקומית מהמפתח הציבורי שבתצורה שנוצרה, ולאחר מכן צרו זוג מפתחות עבור חשבון נמען חדש ורשמו אותו. שום מפתח פרטי אינו מודפס.

```bash
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

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. השתמשו בהגדרה מספרית שבבעלות הלקוח {#_3-use-a-client-owned-numeric-definition}

מחוץ ל־genesis, הגדרה נרשמת תחת `--domain` בעלים שבבעלות החותם, ולקוח של localnet שנוצר אינו הבעלים של אף דומיין. ה־localnet שנוצר עם `--asset-definition-id` כבר מכיל את ההגדרה הזאת: ה־genesis רשם אותה עם סולם בלתי מוגבל, הפך את הלקוח לבעליה והנפיק ללקוח 1,000,000,000 יחידות.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

אל תשתמשו מחדש ב־ID זה ב־Taira. רישום ברשת ציבורית דורש ID קנוני חדש, דומיין בעלים שבבעלות החשבון שלכם (מועבר אל `ledger asset definition register` כ־`--domain`), הענקת `CanManageAssetDefinitionAlias` עבור כל כינוי, ומימון לעמלה.

### 4. הנפקה, העברה ושרוף {#_4-mint-transfer-and-burn}

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

לאחר השריפה, תצפו במשקל המקור `1000000064.50`, משקל היעד `25.50`, וכמות הכוללת `1000000090.00`.

::: warning גבולת היתר

ב־Taira, השתמשו ב־`--fee-payer authority` בכל פעולת כתיבה; ה־CLI מקבל הצעת עמלה מדויקת, בנכס העמלה של Taira, לפני החתימה. רישום דורש בעלות על ה־`--domain` של ההגדרה, וכינוי דורש גם את `CanManageAssetDefinitionAlias`. הנפקה דורשת בעלות על ההגדרה או החזקה ב־`CanMintAssetWithDefinition` או ב־`CanMintAssetToAccount`; העברה ושריפה דורשות סמכות על יתרת המקור. חשבון שמומן דרך ה־faucet אינו הופך אוטומטית למנפיק.

:::

## לאמת {#verify}

קראו את שתי היתרות הממשיות ולאחר מכן את ההגדרה. שאילתות המצב שלאחר הפעולה הן קריטריון ההצלחה; קבלת הגשה לבדה אינה כזו.

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
- דחיית `Mintability` פירושה שמדיניות `Once`, ‏`Not` או `Limited(n)` מיצתה את ההטבעה או אסרה אותה. אל תשכתבו את ההיסטוריה; השתמשו במדיניות שהוחזרה בשאילתת ההגדרה.
- שלב 2 רושם את חשבון היעד במפורש, כך שההעברה פועלת גם כאשר מדיניות קבלת החשבונות היא `ExplicitOnly`. מנגנון ההגנה של ה־CLI בעל השם הדומה אינו רושם חשבון או יתרה; הוא מבטל את הפעולה במקום להוסיף הוראה נוספת.
- דחיית עמלה מתרחשת לפני הצלחה רגילה של ההוראות. בחרו את המשלם, בדקו את נכס העמלה ואת הסכום המרבי בהצעת העמלה של ה־CLI, ואמתו את היתרה הזאת.
- הרצה חוזרת על אותו localnet מתחילה מהיתרות הקודמות, ו־`kagami keys` מסרב להשתמש בתיקייה `./cookbook-recipient` שכבר קיימת. הפעילו localnet חדש שנוצר מחדש והסירו את התיקייה הזאת, או השוו שינויים ביתרות במקום ערכים מוחלטים. לעולם אל תחליפו את ה־Base58 ID במחרוזת אקראית פגומה.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [בדיקות אינטגרציה של מחזור החיים של נכסים במתחם קשור ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust דוגמאות לבניית נכסים בביצוע commit הקשורות ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [נכסים](/he/blockchain/assets.md)
- [הוראות](/he/blockchain/instructions.md)
- [סימני רשיון ](/he/reference/permissions.md)
- [JavaScript ו TypeScript ](/he/guide/tutorials/javascript.md)
