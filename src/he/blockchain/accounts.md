---
translation_locale: he
translation_source: /blockchain/accounts.md
translation_source_hash: adc98cbf1fcadae4415d03dcc262eb03f8c95b429527e403d230934ae2f3243c
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# חשבונות {#accounts}

חשבון הוא סמכות שיכולה לחתום על עסקאות ולהחזיק במצב בספר החשבונות. במודל הנתונים הנוכחי של Iroha 3, המזהה `AccountId` הוא קנוני ונטול דומיין: הוא נגזר מבקר החשבון ומקודד בצורה קנונית כ־[I105](/he/reference/i105.md). הקשר של דומיין ומרחב נתונים הקריא לבני אדם שייך לקישורי כינויים נפרדים של החשבון.

## מבנה {#structure}

`Account` רשום מכיל:

- `id`: הקנוניקה `AccountId`
- `metadata`: מטא-נתונים של חשבונות שרירותיים
- `label`: פרופיל קבוע בחירה
- `uaid`: מזהה חשבון אוניברסלי אופציונלי המשמש בתהליכים של SORA Nexus
- `opaque_ids`: מזהים לא ברורים קשורים ל- UAID של החשבון

מטען הנתונים של העסקה המשמש כדי ליצור חשבון הוא `NewAccount`. הוא נושא את אותם שדות זהות, מטא-מידע, תווית, UAID ו ID שאינם שקופים המשמשים על ידי החשבון המפורסם.

`uaid` משלים את `AccountId` הקנוני ואינו מחליף אותו. השתמשו בו כאשר שירותי SORA Nexus זקוקים למזהה יציב של משתמש או ארגון בין מרחבי נתונים, לרישום שומר פרטיות או לחיפוש יכולות שירות. סביבת הריצה שומרת אינדקס חד־חד־ערכי בין UAID לחשבון, מחייבת צירוף של מזהים אטומים באמצעות UAID ודוחה מזהים אטומים כפולים או מתנגשים. ראו [FHE ו־UAID](/he/blockchain/sora-nexus-services.md#fhe-and-uaid) לתהליך בשכבת השירותים של SORA Nexus.

## מנהלי חשבונות {#account-controllers}

המפעיל הגדיר כיצד החשבון מאשר פעולות. זרימת הלקוח המקובלת משתמשת בשני מפתחות Ed25519, אך מודל הנתונים תומך גם במפעילים עשירים יותר כגון מעקבנים מדיניות מרובות חתימות .

הקונפיגורציה של הלקוח מאחסנת את סמכות החתימה בנפרד מהקונפיגוריית צמתים:

```toml
[account]
profile = "taira"
public_key = "ed0120..."
private_key_file = "/absolute/path/to/private.key"
```

ראו [הסדרת הלקוח ](/he/guide/configure/client-configuration.md) ו[דור המפתח ](/he/guide/security/generating-cryptographic-keys.md) עבור פורמטים המפתחות הנוכחיים.

## נסה את זה על Taira {#try-it-on-taira}

רשימה של מספר חשבונות קנוניים IDs מהשולחן הציבורי Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

כדי לבחון נכסי החשבון, העתק חשבון ID מהקריאה הראשונה ו URL - קוד אותו לפני שמצאת אותו בנתיב. קטע זה Python עושה זאת עבור החשבון הראשון המפורסם:

```bash
python3 - <<'PY'
import json
import urllib.parse
import urllib.request

root = "https://taira.sora.org"
accounts = json.load(urllib.request.urlopen(f"{root}/v1/accounts?limit=1"))["items"]
account_id = accounts[0]["id"]
encoded = urllib.parse.quote(account_id, safe="")
assets = json.load(
    urllib.request.urlopen(f"{root}/v1/accounts/{encoded}/assets?limit=5")
)

print(json.dumps({"account_id": account_id, "assets": assets["items"]}, indent=2))
PY
```

אלו פעולות קריאה ציבוריות. יצירה או עדכון של חשבון הם עסקה חתומה, ולכן נדרשת הגדרת Taira עם מימון משירות חלוקת כספי הניסוי, כמתואר ב־[התחברות למרחבי הנתונים של SORA Nexus](/he/get-started/sora-nexus-dataspaces.md).

## רישום והרשיונות {#registration-and-permissions}

חשבונות נרשמים ומוסרים מרישום באמצעות ההוראות הכלליות [`Register` ו־`Unregister`](/he/blockchain/instructions.md#un-register). מדיניות סביבת הריצה הפעילה קובעת מי רשאי ליצור חשבונות ואילו אסימוני הרשאה או תפקידים נדרשים.

לאחר הרישום, חשבון יכול:

- לחתום על עסקאות
- להחזיק נכסים
- תחומים משלהם
- לקבל תפקידים וטוגנים של אישור
- מאחסן מטא נתונים
- להשתתף בתהליכי כינויים, החלפת מפתחות, שחזור וזהות של SORA Nexus כאשר תכונות אלו מופעלות

## פתרון בעיות זהות {#troubleshooting-identity-issues}

אם עסקה נדחתה באופן בלתי צפוי, בדקו:

- המפתח הציבורי של הלקוח מתאים למפתח הפרטי המשמש לחתימה.
- החשבון נרשם בהתחלה או על ידי עסקאות commit.
- לרשות יש את הרשיונות הנדרשים בהוראה
- תחומי חשבונות קפדניים משתמשים בחשבון הקנוני I105 ID, בעוד שמות קריאים נפתרים באמצעות חיבור בשם חשבון פעיל.

ראו גם:

- [רשיונות](/he/blockchain/permissions.md)
- [מטא-נתונים](/he/blockchain/metadata.md)
- [קונפיגורת הלקוח](/he/guide/configure/client-configuration.md)
- [מרחבי הנתונים של SORA Nexus](/he/get-started/sora-nexus-dataspaces.md)
