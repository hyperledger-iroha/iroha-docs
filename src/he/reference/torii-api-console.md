---
translation_locale: he
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# קונסולה Torii API {#torii-api-console}

השתמשו במסמך OpenAPI חי מנקודת קצה פועלת Torii לבחון דרכים, לשלוח בקשות בדיקות, להעתיק פקודות curl ולייצר קוד לקלינט.

<ToriiApiConsole />

## דרישות {#requirements}

- נקודת הסיום Torii חייבת לחשוף את `/openapi.json`.
- בדיקת הדפדפן דורשת CORS כדי לאפשר את מקור המסמכים האלה.
- הדפדפן חייב להיות מסוגל להגיע לנקודה הסופית ישירות.
- ייצור קוד דורש Node.js, pnpm, ו- Java runtime עבור OpenAPI Generator.

הקונסולה מקובלת ל `https://taira.sora.org`. פיתוח מקומי בדרך כלל עובד עם `http://127.0.0.1:8080` כאשר אתה פועל Torii במחשב שלך.

## נסה קודם Taira {#try-taira-first}

לפני יצירת קלינט, בדוק אם המסמך הציבורי OpenAPI נגיש מהמכשיר שלך:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

לאחר מכן דבק `https://taira.sora.org/openapi.json` בקונסולת ולנסות נתיב קריאה בלבד כגון `GET /status`, `GET /v1/domains`, או `GET /v1/assets/definitions`. שמור עסקאות חתומות וזרמים מפתח פרטי לקלינט SDK או CLI המטען סודות מהסביבה של זמן ההפעלה שלך.

## לקוחות שנוצרו {#generated-clients}

הפקודה של הגנרטור משתמשת באותו מסמך חי OpenAPI שהקונסול מטען. זה שימושי עבור מפעיל JSON, חוקר, אפליקציה, וסלולים טלמטריה.

עבור עסקאות ספריה חתומים, בקשות חתומות ונטולות מועילות של Norito - ילידים, מעדיפים את Iroha הרשמי SDKs. לקוחות OpenAPI לא אוספים חתימות, מנהלים מפתחות חשבונות או מקודרים גוף עסקים Norito בשבילך.

כדי לבחון כל גנרטור המומלץ על ידי OpenAPI גנרטר, תפעילו:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
