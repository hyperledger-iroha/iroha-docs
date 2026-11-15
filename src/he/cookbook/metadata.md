---
translation_locale: he
translation_source: /cookbook/metadata.md
translation_source_hash: 88298912f083d79a9fdfe5e8d0a89d49acb97d814d3871db0c874cb40db5342b
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---
# מטא־נתונים {#metadata}

## תוצאה {#outcome}

קראו מטא־נתונים ב־Taira, הגדירו ואמתו ערך מטא־נתונים אחד של חשבון בעסקה שמשלמת עמלה במפורש, ואז הסירו שוב את הערך. הפרידו בין מטא־נתונים של עצם בפנקס לבין מטא־נתונים של עסקה.

## תנאים מוקדמים {#prerequisites}

- `curl`, `jq`, Python 3.11 או חדש יותר, וה־CLI העדכני של `iroha`.
- קובץ `taira.client.toml` של חשבון ממומן, מתוך [חיבור ל־Taira](./connect-to-taira.md).
- סמכות לשינוי המטא־נתונים של חשבון היעד. הדוגמה פונה לחשבון הסמכות המוגדר עצמו; חשבון אחר דורש הרשאה מדויקת.

## שלבים {#steps}

### 1. קראו מטא־נתונים ללא חותם {#_1-read-metadata-without-a-signer}

מטא־נתונים הם מפה מאומתת מערכי `Name` ל־JSON. מפות ריקות ופלט מסונן ריק הם תוצאות תקינות.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[]
    | select((.metadata // {} | length) > 0)
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

השתמשו במטא־נתונים לשדות קטנים של תיאור או אינדוקס. אחסנו מטענים גדולים מחוץ לפנקס, ושמרו במקומם תקציר, URI או הפניה ל־SoraFS.

### 2. גזרו את חשבון היעד {#_2-derive-the-target-account}

קראו רק את המפתח הציבורי מתצורת Taira והמירו אותו לצורת I105 הקנונית ללא דומיין.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
```

### 3. הגדירו ערך JSON אחד {#_3-set-one-json-value}

ערך ה־JSON שנקרא מהקלט הסטנדרטי הופך לערך `cookbook_profile` של החשבון. ה־metadata של העסקה, שמצורף באמצעות `--metadata <file>`, הוא מפה נפרדת במעטפת העסקה ולעולם אינו בוחר עמלות: את זה עושים `--fee-payer` והצעת העמלה המדויקת של ה־CLI, והלקוח דוחה metadata של עסקה שמכיל את המפתחות `gas_asset_id`, `gas_limit` או `fee_sponsor`.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

ה־CLI מקבל הצעת עמלה מדויקת, בנכס העמלה של Taira, לפני החתימה, ולאחר מכן מגיש וממתין לסופיות Applied לפני שהוא חוזר.

::: warning גבול ההרשאות

ה־executor הפעיל מחליט מי רשאי לשנות כל אובייקט. עדכון חשבון אחר דורש בדרך כלל `CanModifyAccountMetadata`; לדומיינים, להגדרות נכסים, ל־NFTs ולטריגרים יש הרשאות metadata משלהם, הספציפיות ליעד. אם Taira לא העניקה את הסמכות הנדרשת, הריצו את אותן פקודות חשבון עם `./localnet/client.toml` והחליפו את ה־ID הקנוני מסוג I105 של הסמכות ב־localnet שנוצר. שמרו על בחירה מקומית מפורשת של משלם העמלה.

:::

### 4. הסירו את המפתח {#_4-remove-the-key}

תחילה קראו את הערך שקובע, ואז שלחו עסקה נפרדת להסרתו.

```bash
iroha --config ./taira.client.toml --machine account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

ביישומי Python, הבונים המקבילים בעלי הטיפוס הם `Instruction.set_account_key_value` ו־`Instruction.remove_account_key_value`; שלחו אותם עם מטא־נתוני העסקה ועם מסייע ההמתנה מתוך [המדריך ל־Python](/he/guide/tutorials/python.md#shared-setup).

## אימות {#verify}

לאחר עסקת ההגדרה, `meta get` חייב להחזיר את העצם עם `version: 1`. לאחר ההסרה, חיפוש ישיר לא אמור עוד להחזיר ערך:

```bash
iroha --config ./taira.client.toml --machine account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

קריאת החשבון הנפרדת מבדילה בין מפתח מטא־נתונים חסר לבין תקלה ברשת או בחשבון. קוד ייצור צריך גם לאמת את ערך ה־JSON המלא לאחר הגדרתו.

## פתרון בעיות {#troubleshooting}

- הקלט הסטנדרטי חייב להכיל ערך JSON תקין אחד. מחרוזות דורשות מירכאות של JSON; עצמים ומערכים חייבים להיות במבנה תקין.
- מפתחות מטא־נתונים הם ערכי `Name` ורגישים לאותיות גדולות וקטנות לאחר הפענוח. שמרו על אוצר מפתחות קבוע, במקום ליצור מפתחות עם גרסאות לכל שינוי בסכמה.
- `--metadata` הוא מטא־נתונים של העסקה; הוא אינו מגדיר מטא־נתונים של עצם בפנקס. לשם כך השתמשו בתת־הפקודה `meta set` של הישות.
- שליחה מוצלחת שאחריה נקרא ערך ישן עשויה לנבוע מעיכוב בהפצה. המתינו לסופיות במצב Applied ונסו שוב את השאילתה לפני שליחה חוזרת.
- דחיית הרשאה מזהה את עצם היעד ואת גבול הסמכות. תרגלו מקומית או בקשו את האסימון המדויק; אל תעבירו נתוני יישום פרטיים לשדה מטא־נתונים ציבורי כדי לעקוף בקרת גישה.
- לעולם אל תשמרו במטא־נתונים מפתחות פרטיים, מזהים אישיים גולמיים, אסימוני גישה או מסמכים גדולים.

## מקור ותיעוד קשור {#source-and-related-docs}

- [בדיקות אינטגרציה של שאילתות מטא־נתונים בקומיט המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/queries/metadata.rs)
- [בוני העסקאות של Python SDK בקומיט המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/README.md)
- [מטא-נתונים](/he/blockchain/metadata.md)
- [בחירת מטא־נתונים ואחסון בפנקס](/he/guide/configure/metadata-and-store-assets.md)
- [מדריך ההוראות](/he/reference/instructions.md)
- [אסימוני הרשאה](/he/reference/permissions.md)
