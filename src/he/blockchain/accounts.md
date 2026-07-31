---
translation_locale: he
translation_source: /blockchain/accounts.md
translation_source_hash: 7a0130655b4caae240ee261bc7d2059914828da258616bc78ccff41ee455e6d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# חשבונות {#accounts}

חשבון הוא סמכות שיכולה לחתום על עסקאות ולהיות בעלת רישום גדול.
במקביל Iroha 3 מודל נתונים, `AccountId` הוא קנוני ובלתי תחום:
הוא נגזר מהמונהל החשבון ונקוד בקנוניקה כ I105.
קונקסט הדומיין והמרחב הנתונים שניתן לקרוא על ידי אדם שייך לחשבון נפרד
חיבורים.

## מבנה {#structure}

רישום `Account` מכיל:

- `id`: הקנוניקה `AccountId`
- `metadata`: נתונים מטאטא של חשבונות שרירותיים
- `label`: פרופיל קבוע בחירה
- `uaid`: חשבון אוניברסלי אופציונלי ID משמשת על ידי Nexus זרימים
- `opaque_ids`: מזהים לא ברורים קשורים לחשבון UAID

המטען המשמעותי של העסקה שימש כדי ליצור חשבון הוא `NewAccount`. הוא נושא
אותו זהות, מטא-מנתונים, תווית, UAID, ובלתי שקופים ID השדות המשמשים על ידי
חשבון רשום.

`uaid` משלים את הקנוניקה `AccountId`; זה לא מחליף אותו.
כאשר Nexus שירותים זקוקים למשתמש או ארגון יציב
שדות נתונים, רישום שמירה על פרטיות או חיפוש יכולת שירות.
זמני ההפעלה מחזיקים את אחד לאחד UAID-האינדקס של החשבון, דורש מזהים לא ברורים
להיות מחוברת באמצעות UAID, ומכחישים כפול או מתנגשים לא שקופים
תעודות זהות.
[FHE ו UAID](/he/blockchain/sora-nexus-services.md#fhe-and-uaid) עבור Nexus
זרימת שכבת שירות.

## מנהלי חשבונות {#account-controllers}

המנהל הגדיר כיצד החשבון מאשר פעולות.
זרימה משתמשת בשני מפתחות Ed25519, אבל מודל הנתונים גם תומך
בדיקות כגון בדיקות מדיניות של חתימות רבות.

הפריסה של הלקוח מאחסנת את הסמכות לחתימה בנפרד מהמשתמשים
סידור:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

תראו. [סיבוב הלקוח](/he/guide/configure/client-configuration.md) ו
[דור מפתח](/he/guide/security/generating-cryptographic-keys.md) עבור
פורמטים מרכזיים זמינים.

## נסה את זה. Taira {#try-it-on-taira}

קראו כמה תיקונים קנוניים IDs מהציבור Taira רשת מבחן:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

כדי לבדוק נכסי החשבון, עותק חשבון ID מהשיחה הראשונה URL-קוד
לפני שמצאת אותו בדרך. Python סניפט עושה את זה בפעם הראשונה
חשבון רשום:

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

יצירת או עדכון חשבון הוא עסקאות חתומות
ודורש את המימון במבר Taira הגדרות המתוארות ב
[להתחבר SORA Nexus מספרי נתונים](/he/get-started/sora-nexus-dataspaces.md).

## רישום ורישיונות {#registration-and-permissions}

חשבונות רשומים ולא רשומים עם המוצר הגנטי
[`Register` ו `Unregister`](/he/blockchain/instructions.md#un-register)
ההוראות. המאשר הפעיל של זמן הפעלה מחליט מי יכול ליצור חשבונות
ואיזה סימני רשות או תפקידים נדרשים.

לאחר הרישום, חשבון יכול:

- לחתום על עסקאות
- להחזיק נכסים
- תחומים משלהם
- לקבל תפקידים וטוגנים של אישור
- מאחסן מטא נתונים
- להשתתף בשמות, ריקי, התאוששות, ו Nexus זהות זורמת כאשר אלה
  תכונות מופעלות

## פתרון בעיות זהות {#troubleshooting-identity-issues}

אם עסקאות נדחו באופן בלתי צפוי, בדוק:

- המפתח הציבורי של הלקוח מתאים למפתח הפרטי המשמש לחתימה
- החשבון נרשם בהתחלה או בעקבות עסקאות מחויבות
- לרשות יש את הרשאות הנדרשות בהוראה.
- שדות חשבונות קפדניים משתמשים בקנוניקה I105 חשבון ID, בזמן שקריאה
  שמות נפתרו באמצעות חיבור כתיב חשבון פעיל

ראו גם:

- [רשיונות](/he/blockchain/permissions.md)
- [נתונים מטאטא](/he/blockchain/metadata.md)
- [הגדרת הלקוח](/he/guide/configure/client-configuration.md)
- [SORA Nexus חלקי נתונים](/he/get-started/sora-nexus-dataspaces.md)
