---
translation_locale: he
translation_source: /blockchain/accounts.md
translation_source_hash: 7a0130655b4caae240ee261bc7d2059914828da258616bc78ccff41ee455e6d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# חשבונות {#accounts}

חשבון הוא סמכות שיכולה לחתום על עסקאות ולהיות בעלת מדינת ספרי המון. במודל הנתונים הנוכחי Iroha 3, `AccountId` הוא קנוני ובלתי דומיין: הוא נגזר מהמונהל של החשבון ונקוד בקנוני כ- I105. קונקסט של תחום ומרחב נתונים שניתן לקרוא על ידי בני אדם שייך לקשרים נפרדים בין חשבונות לכינוי.

## מבנה {#structure}

`Account` רשום מכיל:

- `id`: הקנוניקה `AccountId`
- `metadata`: נתונים מטאטא של חשבונות שרירותיים
- `label`: פרופיל קבוע בחירה
- `uaid`: חשבון אוניברסלי אופציונלי ID המשמש על ידי זרמי Nexus
- `opaque_ids`: מזהים לא ברורים קשורים ל- UAID של החשבון

המטען הפועל של העסקה המשמש כדי ליצור חשבון הוא `NewAccount`. הוא נושא את אותם שדות זהות, מטא-מידע, תווית, UAID ו ID שאינם שקופים המשמשים על ידי החשבון המפורסם.

`uaid` משלים את הקאנוניקה `AccountId`; היא לא מחליפה אותה. השתמש בה כאשר שירותי Nexus זקוקים למשתמש או ארגון יציב במרחבי נתונים, רישום שמירה על פרטיות, או חיפוש יכולת שירות. זמן ההפעלה שומר על מדד אחד-ל-אחד UAID לחשבון, דורש מזהים לא ברורים להיות מחוברים באמצעות UAID, ומסרב מזהים לא רורים כפולים או מתנגשים. ראה [FHE ו UAID](/he/blockchain/sora-nexus-services.md#fhe-and-uaid) עבור זרימת שכבת השירות של Nexus .

## מנהלי חשבונות {#account-controllers}

המפעיל הגדיר כיצד החשבון מאשר פעולות. זרימת הלקוח המקובלת משתמשת בשני מפתחות Ed25519, אך מודל הנתונים תומך גם במפעילים עשירים יותר כגון מעקבנים מדיניות מרובות חתימות .

הקונפיגורציה של הלקוח מאחסנת את סמכות החתימה בנפרד מהקונפיגוריית עמיתים:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

ראו [הסדרת הלקוח ](/he/guide/configure/client-configuration.md) ו[דור המפתח ](/he/guide/security/generating-cryptographic-keys.md) עבור פורמטים המפתחות הנוכחיים.

## נסה את זה על Taira {#try-it-on-taira}

רשימה של מספר חשבונות קנוניים IDs מהשולחן הציבורי Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

כדי לבחון נכסי החשבון, העתק חשבון ID מהשיחה הראשונה ו URL - קוד אותו לפני שמצאת אותו בנתיב. קטע זה Python עושה זאת עבור החשבון הראשון המפורסם:

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

הקמת או העדכון של חשבון הוא עסקאות חתומות ודורשות את ההתקנה Taira הממומנת על ידי הפנק המתוארת ב [תקשר ל- SORA Nexus דייטאפסס](/he/get-started/sora-nexus-dataspaces.md).

## רישום והרשיונות {#registration-and-permissions}

חשבונות נרשמים ולא רשומים עם ההוראות הגנריות [`Register` ו `Unregister`](/he/blockchain/instructions.md#un-register). מבדיקת הזמן הפעיל מחליט מי יכול ליצור חשבונות ואיזה סימנים או תפקידים של אישור נדרשים.

לאחר הרישום, חשבון יכול:

- לחתום על עסקאות
- להחזיק נכסים
- תחומים משלהם
- לקבל תפקידים וטוגנים של אישור
- מאחסן מטא נתונים
- להשתתף בזרזות מזויפות, רקייי, חיסכון ו Nexus של זהות כאשר תכונות אלה מופעלות

## פתרון בעיות זהות {#troubleshooting-identity-issues}

אם עסקה נדחתה באופן בלתי צפוי, בדקו:

- המפתח הציבורי של הלקוח מתאים למפתח הפרטי המשמש לחתימה.
- החשבון נרשם בהתחלה או על ידי עסקאות מחויבות.
- לרשות יש את הרשיונות הנדרשים בהוראה
- תחומי חשבונות קפדניים משתמשים בחשבון הקנוני I105 ID, בעוד שמות קריאים נפתרים באמצעות חיבור בשם חשבון פעיל.

ראו גם:

- [רשיונות](/he/blockchain/permissions.md)
- [נתונים מטאטא](/he/blockchain/metadata.md)
- [קונפיגורת הלקוח](/he/guide/configure/client-configuration.md)
- [שדות נתונים SORA Nexus](/he/get-started/sora-nexus-dataspaces.md)
