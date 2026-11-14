---
translation_locale: he
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: e500328ac93578b9af21b6ef3d01e13e051b1d9a0f6050293e65650da66fbbbb
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5+reviewed-supplemental-naming-link
---
# חשבונות וכינויים {#accounts-and-aliases}

## תוצאה {#outcome}

עבדו בבטחה עם מזהי חשבון I105 קנוניים ללא דומיין, ועם כינויים קריאים לאדם הקשורים אליהם בנפרד, כגון `treasury@payments.universal`. תבדקו חשבונות ב־Taira, תגזרו מזהה קנוני משלכם ותפתרו כינויים, בלי לבלבל בין הקשר הניתוב לבין הזהות.

## תנאים מוקדמים {#prerequisites}

- `curl`, `jq`, Python 3.11 או חדש יותר, וה־CLI העדכני של `iroha`.
- קובץ `taira.client.toml` מהמתכון [התחברות ל־Taira](./connect-to-taira.md), בעת בדיקת החשבון שלכם.
- חשבון שהוקצה באמצעות הברז של Taira או מסלול ההצטרפות של הרשת שבפיקוח הממשל, לפני שמצפים שקריאה ייעודית לחשבון תצליח.

## שלבים {#steps}

### 1. בדקו חשבונות קנוניים ב־Taira {#_1-inspect-canonical-accounts-on-taira}

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

מזהה מתוך `.id` תקף לשדות חשבון המחייבים צורה קנונית. אל תצרפו אליו דומיין. כינוי מתוך `.aliases[].alias` הוא מפתח חיפוש למשתמש, ולא זהות קנונית נוספת.

### 2. גזרו ונרמלו את מזהה I105 שלכם ב־Taira {#_2-derive-and-normalize-your-taira-i105-id}

קראו רק את המפתח הציבורי מהתצורה המקומית. אותו מפתח ציבורי מקודד בצורה שונה בפרופילים של רשתות ציבוריות שונות, ולכן בחרו במפורש ב־`taira`.

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

### 3. קראו את החשבון ואת נכסיו {#_3-read-the-account-and-its-assets}

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

### 4. חפשו כינויים הקשורים לחשבון {#_4-look-up-aliases-bound-to-the-account}

הפותר ההפוך מקבל מזהה חשבון קנוני מדויק אחד. ניתן לקרוא רשומות של מרחבי נתונים ציבוריים ללא כותרות חתימה על הבקשה; מרחבי נתונים מוגבלים מחייבים בקשה חתומה ומורשית.

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

`total: 0` הוא תוצאה תקינה: חשבון אינו זקוק לכינוי. כאשר קיים קישור, פתרו את הכינוי המדויק והמלא שלו והשוו את מזהה החשבון שהוחזר:

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

::: warning גבול ההרשאות

הברז של Taira יכול להקצות את החשבון המבקש ממנו מימון, אך אינו מעניק סמכות כללית לרישום חשבונות או לניהול כינויים. רישום חשבון אחר דורש `CanRegisterAccount` תחת המבצע הפעיל. כינויי חשבונות דורשים בדרך כלל גם חכירת SNS פעילה והרשאות כינוי מתאימות. השתמשו במתכנן ההצטרפות והכינויים שבפיקוח הממשל, או תרגלו רישום ברשת המקומית שנוצרה.

:::

ברשת מקומית, לאחר שתהליך מאובטח להכנת חותם ייצא `NEW_ACCOUNT_ID` קנוני חדש, ממשק הרישום הוא:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml account get \
  --id "$NEW_ACCOUNT_ID"
```

צרו ושמרו את המפתח הפרטי המתאים מחוץ למאגר התיעוד או היישום. רישום מזהה שמפתח השליטה שלו הושלך יוצר חשבון שאי אפשר להשתמש בו.

## אימות {#verify}

הוכיחו שהמפתח הציבורי שבתצורה, קידוד I105 וקישור הכינוי מצביעים כולם על אותו מזהה חשבון קנוני:

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

שמרו מזהי חשבון קנוניים. השתמשו במזהים קנוניים לחתימות, להרשאות ולהוראות עסקה. פתרו את הכינוי בגבול היישום. שמרו את מזהה החשבון הקנוני ששימש לפעולה.

## פתרון בעיות {#troubleshooting}

- שגיאת פענוח או קידומת מעידה בדרך כלל שהכתובת קודדה לפרופיל רשת אחר. נרמלו באמצעות `--profile taira` ודחו אי־התאמות.
- תגובת חשבון `404` לאחר תגובת ברז `202` עשויה לנבוע מעיכוב בהפצה. בדקו שוב ושוב את החשבון או את הנכס שמומן לפני שליחת כתיבה.
- `total: 0` מהפותר ההפוך פירושו שלא קשור לחשבון כינוי גלוי; אין זו תקלה בחיפוש החשבון.
- `401` או `403` מנתיב כינויים מעידים על מרחב נתונים מוגבל או על הרשאה לא מספקת לפתרון מדויק. אל תשתמשו בחיפוש רחב לפי קידומת כחלופה.
- ערך קריא `name@domain.dataspace` אינו מתקבל בכל מקום שבו נדרש מזהה I105 קנוני (ID). יש לפתור אותו תחילה.
- אם רישום חשבון מצליח מקומית אך נדחה ב־Taira, ההבדל הוא בהרשאה. השיגו `CanRegisterAccount`; אל תשנו את מזהה החשבון כדי לעקוף את האימות.

## מקור ותיעוד קשור {#source-and-related-docs}

- [מימוש כתובת החשבון הקנונית בקומיט המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/account/address.rs)
- [בדיקות בסיסיות לנקודת הקצה של חשבונות ב־Torii](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/tests/accounts_endpoints.rs) ו־[בדיקות נתיבי הכינויים](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/tests/lib_tests/part_2.rs) בקומיט המקובע
- [חשבונות](/he/blockchain/accounts.md)
- [כינויים במודל הנתונים](/he/blockchain/data-model.md#aliases)
- [כללי מתן שמות](/he/reference/naming.md)
- [אסימוני הרשאה](/he/reference/permissions.md)
