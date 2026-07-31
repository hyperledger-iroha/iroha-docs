---
translation_locale: he
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API קונסולה {#torii-api-console}

השתמש בשידור חי OpenAPI מסמך ממערכת Torii נקודת סיום לבדיקה של מסלולים,
לשלוח בקשות ניסוי, עותק curl פקודות, וייצרו קוד לקלינט.

<ToriiApiConsole />

## דרישות {#requirements}

- ה- Torii נקודת הסיום חייבת לחשוף `/openapi.json`.
- בדיקת הדפדפן דורשת CORS כדי לאפשר את מקור המסמכים.
- הדפדפן חייב להיות מסוגל להגיע לנקודת הסיום ישירות.
- ייצור קוד דורש Node.js, pnpm, ו- Java runtime עבור OpenAPI
  גנרטור.

הקונסולה מקובלת `https://taira.sora.org`. פיתוח מקומי בדרך כלל
עובד עם `http://127.0.0.1:8080` כאשר אתה רץ Torii על המכונה שלך.

## נסה. Taira ראשית. {#try-taira-first}

לפני ליצור לקוח, בדוק אם הציבור OpenAPI המסמך נגיש
מהמכונה שלך:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

ואז דבק. `https://taira.sora.org/openapi.json` אל הקונסולה ונסו
מסלול קריאה בלבד, כגון: `GET /status`, `GET /v1/domains`, או
`GET /v1/assets/definitions`. שמור על עסקאות חתומות וזרמי מפתח פרטי
דה SDK או CLI לקוח שמטען סודות מהסביבה שלך.

## לקוחות שנוצרו {#generated-clients}

הפקודה של הגנרטור משתמשת באותו חי OpenAPI מסמך שהקונסול
זה שימושי עבור JSON מפעיל, חוקר, אפליקציה וסלול טלמטריה.

עבור עסקאות בספר ההוצאות חתומים, שאלות חתומות ו Norito-חומרי שימוש מקומיים,
מעדיפים את הפקיד Iroha SDKs. OpenAPI הלקוחות אינם אוספים חתימות,
לנהל מפתחות חשבונות, או לחבר קוד Norito ארגונים עסקים בשבילך.

כדי לבדוק כל גנרטור תומך OpenAPI גנרטור, תפעיל:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
