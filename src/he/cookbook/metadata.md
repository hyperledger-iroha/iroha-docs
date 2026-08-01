---
translation_locale: he
translation_source: /cookbook/metadata.md
translation_source_hash: 07b065b28eca44939a92b40a81a47b57178de4539abb0daf51913969e34eced7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# מטאדאטה {#metadata}

## התוצאה {#outcome}

לקרוא מטא נתונים על Taira, להגדיר ולבדוק את ערך המטא נתונים של חשבון אחד עם עסקאות ששילמתם באופן מפורש עמלה, ולהסיר את הערך שוב. אתה תשאיר מטא נתוני אובייקט ספריה נפרדים מהמטא נתונים לתשלום עסקה.

## תנאים מוקדמים {#prerequisites}

- `curl`, `jq`, Python 3.11 או מאוחר יותר, והזרם `iroha` CLI.
- מימון `taira.client.toml` ו`taira.tx-metadata.json` מ [תקשורת ל Taira ](./connect-to-taira.md).
- סמכות על הנתונים המטריים של החשבון היעד. הדוגמה מכוונת לרשות המוגדרת עצמה; חשבון אחר דורש רשיון מדויק.

## צעדים {#steps}

### 1. לקרוא מטא נתונים ללא חותם {#_1-read-metadata-without-a-signer}

מטאדאטה היא מפה מבוחנת `Name` ל JSON. מפות ריקות ויוצאת מוצר ריקה הן תוצאות תקופתיות .

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

השתמשו בתנתונים מטאטא עבור שדות תיאוריים או אינדקסינג קטנים. תורידו את עומס המיועד הגדולים מהמספר ותחזיקו דייטש, URI, או SoraFS מקובל במקום.

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

הערך JSON הנקרא מהכניסה הסטנדרטית הופך לערך `cookbook_profile` של החשבון. לעומת זאת, `--metadata ./taira.tx-metadata.json` מוסיף שדות עמלות למעטפת העסקאות. לשתי המפות יש מטרות ומטרות שונות.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI ציטוט את המחיר, חותם, מספק וממתין בד default. אל תוסיף `--no-wait` כאשר הפעולה הבאה תלויה הערך הזה. .

::: warning גבולת היתר

המאשר הפעיל מחליט מי יכול לשנות את כל אובייקט. עדכון חשבון אחר דורש בדרך כלל `CanModifyAccountMetadata`; תחומים, הגדרות נכסים, NFTs, ומפעילים יש רשיונות מטאדאטה ספציפיים משלהם. אם Taira לא העניק את הסמכות הנדרשת, תפעילו את אותן פקודות החשבון עם `./localnet/client.toml`, תחליפו את הקנוניקה של סמכות הרשת המקומית שנוצרה I105 ID, ותעמידו את קבוצת הנתונים המטאלוגיות לתשלום Taira. שמרו על הבחירה המפורטת של משלם תשלום מקומי.

:::

### 4. להסיר את המפתח. {#_4-remove-the-key}

ראשית לקרוא את הערך הנחויב, ולאחר מכן להגיש עסקה של הסרת נפרדת.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

עבור יישומים Python, הבניינים המתאימים בטייפים הם `Instruction.set_account_key_value` ו `Instruction.remove_account_key_value`; מסרו אותם עם מטא נתוני העסקה ועוזר מחכה מהטוריאלי [Python ](/he/guide/tutorials/python.md#shared-setup).

## לאמת {#verify}

לאחר העסקה הקבועה, `meta get` חייב להחזיר את האובייקט עם `version: 1`. לאחר הסרת, חיפוש ישיר לא יכול להחזיר ערך:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
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
- `--metadata` הוא מטא נתונים של עסקאות; הוא אינו מקין מטא נתוני אובייקטים של ספריה. השתמש ב- `meta set` של הארגון עבור האחרון.
- העברת מוצלחת בעקבות קריאה ישנה עשויה להיות עיכוב ההתרחבות. חכו לסיום יישום ולנסו שוב את השאלת לפני שתעשו מחדש.
- סירוב אישור מזהה את אובייקט היעד ואת גבול הסמכות. למדוד באופן מקומי או לבקש את הסימן המדויק; לא להעביר נתונים יישום פרטיים לתוך שדה מטא-מידע ציבורי כדי להימנע מפיקוח גישה.
- לעולם אל תחזיקו מפתחות פרטיות, מזהים אישיים חומריים, סימני גישה או מסמכים גדולים בתנתונים מטא.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [בדיקות אינטגרציה של בקשת נתונים מטאטא ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/queries/metadata.rs)
- [Python SDK בונים עסקאות בהתחייבויות קשורות ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/README.md)
- [נתונים מטאטא](/he/blockchain/metadata.md)
- [אפשרויות אחסון נתונים מטאטא ומספרים ](/he/guide/configure/metadata-and-store-assets.md)
- [תיקון הוראות ](/he/reference/instructions.md)
- [סימני רשיון ](/he/reference/permissions.md)
