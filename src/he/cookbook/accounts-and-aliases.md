---
translation_locale: he
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: c1aee0c29332bd7c883500e72a1ec7812aebfca13b673e6681788cf4bc5ecbf1
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# חשבונות ושמות {#accounts-and-aliases}

## התוצאה {#outcome}

תעבוד בבטחה עם חשבון קאנוניקל I105 ללא דומיין IDs וכיסויים שניתן לקרוא לבני אדם מחוברים בנפרד כגון `treasury@payments.universal`. תוכל לבדוק חשבונות Taira, להוציא את הקאנוניקל שלך ID, ולפתור כיסויים מבלי לבלבול את ההקשר של הנתיב עם הזהות.

## תנאים מוקדמים {#prerequisites}

- `curl`, `jq`, Python 3.11 או מאוחר יותר, והזרם `iroha` CLI.
- `taira.client.toml` מ- [תחבר ל- Taira ](./connect-to-taira.md) בעת ביקורת על החשבון שלך.
- חשבון שהוצא באמצעות המברר Taira או דרך הכניסה של הרשת הנפוצה לפני שציפית לקריאה ספציפית לחשבון תצליח.

## צעדים {#steps}

### 1. לבחון חשבונות קנוניים על Taira {#_1-inspect-canonical-accounts-on-taira}

רשימת החשבונות הציבורית מחזירה תמיד מזהי I105 קנוניים. כינוי ראשי הוא אופציונלי; בקשו את השדה `aliases` כדי לראות אותו.

```bash
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/accounts \
  --data-urlencode 'limit=5' \
  --data-urlencode 'select=id,aliases' \
  | jq -r '.items[]
    | [.id, (first(.aliases[]? | select(.is_primary) | .alias) // "-")]
    | @tsv'
```

ID מ- `.id` הוא נכון עבור שדות חשבונות קפדניים. אל תוסיף לו דומיין. שם כינוי מ- `.aliases[].alias` הוא מפתח חיפוש פונה למשתמש, לא זהות קנוניקה אחרת.

### 2. להוציא ולנורמליז את Taira I105 ID שלך {#_2-derive-and-normalize-your-taira-i105-id}

קראו רק את המפתח הציבורי מהקונפיגורת המקומית. אותו מפתח ציבורי מוצפן באופן שונה עבור פרופילים שונים ברשתות ציבוריות, אז בחרו `taira` במפורש.

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

הערך המנורמל צריך להיות זהה ל־`TAIRA_ACCOUNT_ID`. ההגדרה `[account].profile` בוחרת רק את קידומת הרשת של I105; דומיינים שייכים לכינויים, ולעולם לא למזהה החשבון.

### 3. קרא את החשבון ואת נכסיו. {#_3-read-the-account-and-its-assets}

לאחר הקצאת החשבון, בצעו עליו שאילתה ישירה והציגו דף נכסים מוגבל. קודדו את ערך I105 ל-URL לפני השימוש בו בנתיב.

```bash
iroha --config ./taira.client.toml account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10&include_total=true" \
  | jq '{total, items}'
```

### 4. תבדוק את הכינויים הקשורים לחשבון. {#_4-look-up-aliases-bound-to-the-account}

הגורם ההפוך מקבל חשבון קנוני אחד מדויק ID. שורות של מסלול נתונים ציבורי ניתן לקרוא ללא כותרות חתימה בקשה; מסלולים נתונים מוגבלים דורשים בקשה חתומה רשמית.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` הוא בתוקף: חשבון אינו זקוק לכינוי זיהוי. כאשר קיימת קשורה, לפתור את הכינוי המדויק המלא שלו ולהשוות את החשבון הובא ID:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning גבולת היתר

ה־faucet של Taira יכול להקצות את החשבון שמגיש אליו בקשה, אבל זה אינו מעניק סמכות כללית לרישום חשבונות או לניהול כינויים. רישום של חשבון אחר דורש `CanRegisterAccount` תחת ה־executor הפעיל. כינויים של חשבונות דורשים בדרך כלל גם חוזה שכירות SNS פעיל והרשאות כינוי מתאימות. השתמשו במתכנן ה־onboarding והכינויים שבפיקוח הממשל, או תרגלו את הרישום מול הרשת המקומית שנוצרה.

:::

ברשת מקומית, ברגע שלב סימון חותמים מאובטח ייצא קאנוניקה חדשה `NEW_ACCOUNT_ID`, פני הקידום הוא:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml account get \
  --id "$NEW_ACCOUNT_ID"
```

לייצר ולשמור את המפתח הפרטי המתאים מחוץ למלאי המסמכים או התיישומים. הרישום של ID שמרכיב השליטה שלו נזרק יוצר חשבון שאינו ניתן לשימוש.

## לאמת {#verify}

להוכיח כי המפתח הציבורי, הקוד I105 ושמות מחברים כולם מתכנסים על חשבון קנוני אחד ID:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

שמרו IDs קנוניים. השתמשו ב־IDs קנוניים לחתימות, להרשאות ולהוראות עסקה; השתמשו בכינויים רק בגבול היישום. שמרו את ה־ID הקנוני של החשבון לצד הכינוי.

## פתרון בעיות {#troubleshooting}

- שגיאה בניתוח או תצוגה בדרך כלל פירושה כי כתובת הועברה לפרופיל רשת אחר. `--profile taira` ומכחישים את ההפרעות.
- תגובת חשבון `404` לאחר קבלת `202` עשויה להעיד על עיכוב בהפצה. בצעו polling על החשבון או על נכס היעד לפני שליחת פעולת כתיבה תלויה.
- `total: 0` מהמשתגר ההפוך אומר שאין שם זיהוי מחובר; זה לא כישלון בחיפוש החשבון.
- `401` או `403` ממסלול שמהותי מצביעים על חלל נתונים מוגבל או לא מספיק רשות פתרון מדויק. אל תשתמשו בחיפוש מקדמות רחבה כמחזור.
- ערך קריא `name@domain.dataspace` אינו מתקבל בכל מקום שבו נדרש מזהה I105 קנוני (ID). יש לפתור אותו תחילה.
- אם רישום חשבון מקומי מצליח אבל Taira דוחה אותו, ההבדל הוא אישור. לקבל `CanRegisterAccount`; לא לשנות את החשבון ID כדי לעקוף אישור.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [יישום כתובת חשבון קאנוניקה בביצוע הקליטה ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/account/address.rs)
- [בדיקות smoke של נקודות הקצה של חשבונות ב־Torii](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/tests/accounts_endpoints.rs) ו־[בדיקות נתיבי הכינויים](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/tests/lib_tests/part_2.rs) ב־commit המקובע
- [חשבונות](/he/blockchain/accounts.md)
- [שמה של דגם נתונים ](/he/blockchain/data-model.md#aliases)
- [קונבנוציות שמות](/he/reference/naming.md)
- [סימני רשיון ](/he/reference/permissions.md)
