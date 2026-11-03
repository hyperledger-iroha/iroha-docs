---
translation_locale: he
translation_source: /cookbook/metadata.md
translation_source_hash: 88298912f083d79a9fdfe5e8d0a89d49acb97d814d3871db0c874cb40db5342b
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# מטאדאטה {#metadata}

## התוצאה {#outcome}

קראו metadata ב־Taira, הגדירו ואמתו ערך metadata אחד של חשבון באמצעות עסקה שמשלמת עמלה במפורש, ואז הסירו אותו. השאירו metadata של אובייקט בספר החשבונות בנפרד מ־metadata של העסקה.

## תנאים מוקדמים {#prerequisites}

- `curl`, `jq`, Python 3.11 או מאוחר יותר, והזרם `iroha` CLI.
- קובץ `taira.client.toml` של חשבון ממומן, מתוך [חיבור ל־Taira](./connect-to-taira.md).
- סמכות על הנתונים המטריים של החשבון היעד. הדוגמה מכוונת לרשות המוגדרת עצמה; חשבון אחר דורש רשיון מדויק.

## צעדים {#steps}

### 1. לקרוא מטא נתונים ללא חותם {#_1-read-metadata-without-a-signer}

מטאדאטה היא מפה מבוחנת `Name` ל JSON. מפות ריקות ויוצאת מוצר ריקה הן תוצאות תקופתיות .

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

השתמשו בתמטא-נתונים עבור שדות תיאוריים או אינדקסינג קטנים. תורידו את עומס המיועד הגדולים מהמספר ותחזיקו דייטש, URI, או SoraFS מקובל במקום.

### 2. להוציא את החשבון המטרה {#_2-derive-the-target-account}

קראו רק את המפתח הציבורי מהקונפיג Taira ולהפוך אותו לפוסט הקנוני של I105 ללא תחום.

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

### הגדיר ערך אחד JSON {#_3-set-one-json-value}

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

::: warning גבולת היתר

ה־executor הפעיל מחליט מי רשאי לשנות כל אובייקט. עדכון חשבון אחר דורש בדרך כלל `CanModifyAccountMetadata`; לדומיינים, להגדרות נכסים, ל־NFTs ולטריגרים יש הרשאות metadata משלהם, הספציפיות ליעד. אם Taira לא העניקה את הסמכות הנדרשת, הריצו את אותן פקודות חשבון עם `./localnet/client.toml` והחליפו את ה־ID הקנוני מסוג I105 של הסמכות ב־localnet שנוצר. שמרו על בחירה מקומית מפורשת של משלם העמלה.

:::

### 4. להסיר את המפתח. {#_4-remove-the-key}

ראשית לקרוא את הערך הנחויב, ולאחר מכן להגיש עסקה של הסרת נפרדת.

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

## לאמת {#verify}

לאחר העסקה הקבועה, `meta get` חייב להחזיר את האובייקט עם `version: 1`. לאחר הסרת, חיפוש ישיר לא יכול להחזיר ערך:

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

קריאת החשבון נפרדת עושה הבדל בין מפתח מטא נתונים חסר לרשת או פגם בחשבון. קוד הייצור צריך גם לאשר את הערך כולו JSON לאחר הגדרת אותו.

## פתרון בעיות {#troubleshooting}

- הכניסה הסטנדרטית חייבת להכיל ערך אחד תקף JSON. קווים צריכים ציטוטים JSON; אובייקטים ומערכות חייבים להיות נוצרות היטב.
- מפתחות הנתונים המטאטא הם ערכים `Name` והם רגישים למקרה לאחר ניתוח. לשמור על מילולת מפתח יציבה במקום ליצור מפתחות גרסאות לכל שינוי של התכנית.
- `--metadata` הוא metadata של העסקה; הוא אינו מגדיר metadata של אובייקט בספר החשבונות. עבור האפשרות השנייה השתמשו בתת־הפקודה `meta set` של הישות.
- הגשה מוצלחת שאחריה קריאה ישנה עשויה לנבוע מעיכוב propagation. המתינו ל-finality מסוג Applied ונסו שוב את השאילתה לפני הגשה מחדש.
- סירוב אישור מזהה את אובייקט היעד ואת גבול הסמכות. למדוד באופן מקומי או לבקש את הסימן המדויק; לא להעביר נתונים יישום פרטיים לתוך שדה מטא-מידע ציבורי כדי להימנע מפיקוח גישה.
- לעולם אל תחזיקו מפתחות פרטיות, מזהים אישיים חומריים, סימני גישה או מסמכים גדולים במטא-נתונים.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [בדיקות אינטגרציה של בקשת מטא-נתונים ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/queries/metadata.rs)
- [Python SDK בונים עסקאות commit קשורות ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/README.md)
- [מטא-נתונים](/he/blockchain/metadata.md)
- [אפשרויות אחסון מטא-נתונים ומספרים ](/he/guide/configure/metadata-and-store-assets.md)
- [תיקון הוראות ](/he/reference/instructions.md)
- [סימני רשיון ](/he/reference/permissions.md)
