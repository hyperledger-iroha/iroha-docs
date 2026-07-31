---
translation_locale: he
translation_source: /reference/torii-endpoints.md
translation_source_hash: 6ee65d409642c79bea0f2c4ff0d8cd59b0ec0a29e115225045786d0816e8a6a7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii נקודות סוף {#torii-endpoints}

Torii האם זה HTTP, SSE, ו WebSocket שער ל Iroha 3. זה משמש לשניהם.
פונה למספר APIs ונקודות הסיום של המפעיל.

כללי הפרוטוקול הנוכחיים הם:

- פורמט בינארי קנוני הוא: **Norito**
- נקודות סוף רבות גם תומכות JSON כאשר אתה שולח `Accept: application/json`
- מדדים נחשפים בצורת Prometheus

לפרטים על פורמט, משא ומתן תוכן, דגלי סידור, חישובים של סכמה, ו
Norito RPC הנחיות, ראה [Norito התייחסות](/he/reference/norito.md).

## נקודות סוף משותפות {#common-endpoints}

| נקודת סוף | פורמט | מטרה |
| --- | --- | --- |
| `POST /transaction` | Norito | הגשת עסקה חתומה |
| `POST /query` | Norito | הגיש בקשה חתומה |
| `GET /events` | WebSocket | לחתום על זרמי אירועים |
| `GET /block/stream` | WebSocket | חבילות מחויבות |
| `GET /peers` | JSON | רשימת עמיתים חשופים על ידי Torii |
| `GET /health` | JSON | נקודת הסיום לחיים קלה |
| `GET /api_version` | JSON | דפוס API גרסה |
| `GET /status` | JSON | סיכום מצב ברמה גבוהה למפעילים |
| `GET /metrics` | פרומתיוס | נקודת הסיום של פרומטהוס |
| `GET /schema` | JSON | תמונת גיליון של מודל הנתונים המשרתת על ידי הערך |
| `GET /openapi` או `GET /openapi.json` | JSON | OpenAPI מסמך לפעיל Torii HTTP מסלולים |
| `GET /v1/parameters` | JSON | תמונה של פרמטרים של הערך |
| `GET /v1/node/capabilities` | JSON | יכולת הערך ונתונים מטאטא מודל נתונים |
| `GET /v1/api/versions` | JSON | תמיכה Torii API גרסאות |
| `GET /v1/events/sse` | SSE | זרם אירועים עבור לקוחות בעלי תקופת חיים ארוכה |
| `GET /v1/time/now` | JSON | תמונה של שעון הקיר |
| `GET /v1/time/status` | JSON | מצב סינכרון זמן |

`/openapi` הוא רשימת נקודות קץ סמכותית עבור קשר פועל.
פני השטח תלוי בתכונות הבניין ואת ההשפעה של זמן הפעלה, כך שנוצר
הלקוחות צריכים לבחור את OpenAPI מסמך על רשימה של דרכים שנעכבה ידנית.
השתמש ב [Torii API קונסול](/he/reference/torii-api-console.md) כדי לטעין את זה חי
מסמך, בדיקת JSON מסלולים, עותק curl בקשות, וייצרו קוד לקלינט
הסכמה הנוכחית.

## נסה לחיות. Taira מסלולים {#try-live-taira-routes}

הציבור Taira רשת הבדיקה חושפת את אותו Torii JSON פני השטח של היישום
לקוחות משתמשים בחיפוש רק קריאה. פקודות אלה לא דורשות מפתחות:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

ניסיון מקור קורא נגד המצב העולמי הנוכחי:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

אם מסלול רשת בדיקת ציבורי חוזר `502`, זמן החוצה, או מדווחים
בתור, לטפל בזה כמו בעיה של זמינות נקודת סוף ולנסות שוב מאוחר יותר לפני
פיקוח קוד הלקוח שלך.

## נקודות הסכמה ונקודות סיום בזמן ההפעלה {#consensus-and-runtime-endpoints}

| נקודת סוף | פורמט | מטרה |
| --- | --- | --- |
| `GET /v1/sumeragi/commit-certificates` | JSON | סיכומים של תעודת ההתחייבויות האחרונות |
| `GET /v1/sumeragi/validator-sets` | JSON | היסטוריית התקציב של המאשר |
| `GET /v1/sumeragi/validator-sets/{height}` | JSON | מתקן אישור מוגדר בגובה של כביש |
| `GET /v1/sumeragi/status` | Norito או JSON | תמונה מפורטת של מצב ההסכמה |
| `GET /v1/sumeragi/status/sse` | SSE | זרם מצב הסכמה מתמשך |
| `GET /v1/sumeragi/leader` | JSON | מידע זמני על מנהיגים |
| `GET /v1/sumeragi/qc` | Norito או JSON | סיכום האחרון של תעודת הקוורום |
| `GET /v1/sumeragi/checkpoints` | JSON | סיכום של נקודת בדיקת הסכמה |
| `GET /v1/sumeragi/consensus-keys` | JSON | מפתחות הסכמה פעילות |
| `GET /v1/sumeragi/bls_keys` | JSON | פעיל BLS מפתחות הסכמה |
| `GET /v1/sumeragi/phases` | JSON | דגימת איחור שלב אחרונה |
| `GET /v1/sumeragi/rbc` | JSON | RBC נתונים של הפגישה והתוצאה |
| `GET /v1/sumeragi/rbc/sessions` | JSON | פעיל RBC תמונה מהקצרה של הפגישה |
| `GET /v1/sumeragi/pacemaker` | JSON | מצב מדד הלב |
| `GET /v1/sumeragi/params` | JSON | זרם על שרשרת Sumeragi פרמטרים |
| `GET /v1/sumeragi/collectors` | JSON | תמונה של תוכנית הקולקטור הדeterministic |
| `GET /v1/sumeragi/key-lifecycle` | JSON | מצב מחזור החיים של מפתח הסכמה |
| `GET /v1/sumeragi/telemetry` | JSON | תמונת טלמטריה של הסכמה |
| `GET /v1/sumeragi/evidence` | JSON | רישומי ראיות, בחופש מסנן על ידי שרשרת שאל |
| `GET /v1/sumeragi/evidence/count` | JSON | סכום רישומי הראיות |
| `POST /v1/sumeragi/evidence/submit` | JSON | להגיש ראיות של הסכמה |
| `GET /v1/sumeragi/commit_qc/{hash}` | Norito או JSON | מחויבות QC רשום עבור חישוב בלוק |
| `GET /v1/runtime/abi/active` | JSON | זמני הפעולה ABI תיאור |
| `GET /v1/runtime/abi/hash` | JSON | זמני הפעולה ABI חשיש |
| `GET /v1/runtime/metrics` | JSON | תמונה של מדד זמן הפעלה |
| `GET /v1/runtime/upgrades` | JSON | רשימה של שיפור זמן הפעלה |
| `POST /v1/runtime/upgrades/propose` | JSON | להציע שיפור בזמן הפעלה |
| `POST /v1/runtime/upgrades/activate/{id}` | JSON | להפעיל שיפור מתכנן של זמן הפעלה |
| `POST /v1/runtime/upgrades/cancel/{id}` | JSON | ביטול שיפור זמן הפעלה הנוצע |

## אפליקציה ו SORA משפחות המסלול {#app-and-sora-route-families}

מתי? Torii הוא נבנה עם קבוצת תכונות פונה אפליקציה, זה חושף JSON
משפחות עבור חוקרים, SORA שירותים, זרמי גשר, ראיות ואחסון.
לא כל משפחות מופעלות בכל פרופיל רשת.

| משפחת המסלול | מטרה |
| --- | --- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*` | JSON קורא, עוזר חיפוש, עוזר אינטראקציה, ותצפיות של תיקים או בעליהם |
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*` | NFT, נכס בעולם האמיתי, ותצפיות נכסים סודיות |
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` | שם, פרופיל ומועד הגדלה |
| `/v1/explorer/*` | תצפיות חשבון, נכס, בלוק, עסקאות, הוראות, מטריקים וזרם ממוקדות על Explorer |
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*` | היסטוריה של עסקאות, התאוששות או מעמד של שורות הצינור; ISO 20022 עוזרים |
| `/v1/contracts/*` | קוד החוזה, הפעלת, חבילה, שיחת טלפון, הצפייה, אירוע, פעילות, רול-אפ ודרכי המדינה |
| `/v1/multisig/*`, `/v1/controls/*` | הצעות, אישורים ומעוזרים בפיקוח העברה |
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*` | סיום, הוכחה למצב, הוכחת חסימה, שמירת ראיות ודרכי שאלת הראיות |
| `/v1/da/*` | זמינות נתונים, מוניפסטים, מדיניות הוכחה, מחויבויות וכוונות קישור |
| `/v1/zk/*` | ZK שורשים, אימות ראיות, IVM הוכחה, ספירת קולות, מפתחות אימות, רשומות ראיות ותארים |
| `/v1/gov/*`, `/v1/ministry/*` | הצעות לניהול, בקשות להצבעה, מדינת המועצה, חלקי שמות מוגנים, הצעות סדר היום, חקיקה וסיום |
| `/v1/nexus/*`, `/v1/sccp/*` | Nexus קו, חלל נתונים, ועוזרי אבטחה צלחת שרשרת |
| `/v1/musubi/*` | Musubi קורות רישום חבילה ופתוח הוראות |
| `/v1/subscriptions/*` | תוכניות חתימה, מחזור החיים של החתימה, שימוש וחיסול עוזרים |
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*` | SoraFS גילוי ספק, הוכחות יכולת, סיבוב, קביעות אחסון ותוכן ציבורי |
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*` | SoraCloud מחזור החיים של שירותים, זרמי מחשבים פרטיים/מודלים, גילוי ציבורי, ודרכת אפליקציות מארגנות |
| `/v1/connect/*`, `/v1/vpn/*` | Iroha פגישות חיבור, WebSocket תחבורה, VPN פגישות, פרופילים וכרזות |
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*` | אפליקציה API חיבורים וקישור/CID-תחנת תוכן מבוססת |
| `/v1/operator/*`, `/v1/mcp` | תעודת האותנטיקה של המפעיל והסוג המקורי MCP JSON-RPC גשר |
| `/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` | הכנות מקוונת, הסכמי מאגר נתונים, מוניסטים של חלקי נתונים, ו [RAM-LFE עוזרים](/he/blockchain/ram-lfe.md#torii-routes) |
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*` | שיתוף פעולה, חיבור אינטרנט, הודעות דחיפה ואינטגרציות טלמטריה חיות |

## ISO גשר 20022 {#iso-20022-bridge}

Torii מגלה את ISO 20022 גשר מתחת `/v1/iso20022/*` כאשר האפליקציה פונה
API והזמן לריצה של הגשר מופעל.
לא למטרה כללית ISO כניסה לקיצוי 20022 אך תת קבוצה תומכת
הופכת הודעות תשלום שנבחרו לחתימה Iroha העברות וציוד
מעמדם בספריה.

### Torii ISO 20022 נקודות סוף {#torii-iso-20022-endpoints}

| שיטה ונקודת הסיום | מטרה |
| --- | --- |
| `POST /v1/iso20022/pacs008` | להגיש FI-ל...FI העברת אשראי ללקוח ולבניית התאמה Iroha העברת נכסים |
| `POST /v1/iso20022/pacs009` | להגיש FI-ל...FI העברת אשראי בשימוש PvP או מימון במזומן הקשור לכספים |
| `POST /v1/iso20022/pacs002` | הגשת דו"ח מצב התשלום |
| `POST /v1/iso20022/pacs004` | להגיש הצהרת תשלום |
| `POST /v1/iso20022/camt056` | הגשת בקשה לבטל תשלום |
| `POST /v1/iso20022/sese023` | להגיש הוראה לחישוב ערך |
| `POST /v1/iso20022/sese024` | להגיש הודעה על מצב הסדר ערך |
| `POST /v1/iso20022/sese025` | להגיש אישור סדר ניירות ערך |
| `POST /v1/iso20022/colr012` | להגיש הודעה על תחליף ביטוח |
| `GET /v1/iso20022/messages/{msg_id}` | תקרא את תיעוד הגשר הקנוני עבור מסר אחד |
| `GET /v1/iso20022/audit/messages` | קראו את מסר הניתוח של הודעות |
| `GET /v1/iso20022/messages/{msg_id}/pacs002` | הגדר את מצב התשלום הנוכחי כ `pacs.002` XML |
| `GET /v1/iso20022/messages/{msg_id}/pacs004` | להציג את ההשגחה הנוכחית של התשלום כ `pacs.004` XML |
| `GET /v1/iso20022/messages/{msg_id}/camt029` | הגדיר את החלטת ביטול הנוכחית כ `camt.029` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese024` | להעניק את מצב ההתמודדות הנוכחי כ `sese.024` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese025` | להציג את אישור הסדר הנוכחי כ `sese.025` XML |

`pacs.008` ההצעות צריכות לספק את המסר. ID, הסדר בין בנקים
סכום, מטבע, תאריך הסדר, חוב וקרן IBANs, והדוביר
בנק BICs. כאשר נתונים מקבילים מותאמים, הגשר גם בודק את
BIC, IBAN, ו ISO 4217 צומת מטבע לפני העסקה שנוצרה
נכנס לצינור.

`pacs.009` ההצעות צריכות לספק את מסר העסק ID, הגדרה של הודעה
ID, זמן היצירה, סכום הסדר בין בנקים, מטבע, תאריך הסדר,
הסוכן המורשם והומורש BICs, והדוביר והאמן IBANs. אם
הודעה כוללת `Purp`, הגשר מקבל כיום מימון למטרות ערך.
רק: `Purp=SECU`.

ה- `pacs.008` ו `pacs.009` נקודות הסיום של ההעברה מקבלות XML ISO מעטפות או
פורמט השדה שטוח המשמש בבדיקות הגשר. `SplmtryData` שדות
יכול לתפוס את המטרה Iroha ספריה, חשבון המקור והמטרה IDs או כתובות,
והגדרה של נכסים ID. התשובה היא: `202 Accepted` עם `message_id`,
`transaction_hash`, `status`, `pacs002_code`, וההחלטות
קונגרס ספריה/חשבון/אכס.

### תמיכה נוספת בניתוחים ומפונים {#additional-parser-and-mapping-support}

ה- IVM ISO העוזר גם מאשר ומבטיח את המסר הבא
משפחות לאישור קסדה, מאפיית ההתנחלויות או במורד זרם
הם לא יכולים להיות עצמאיים. Torii מסלולים.

| משפחה של הודעות | תמיכה זמנית |
| --- | --- |
| `head.001` | אישור כותרת היישום לעסקים ISO מעטפות, כולל `BizMsgIdr`, `MsgDefIdr`, זמן היצירה, ושלח/קבל בחופשי BIC שדות |
| `pacs.007`, `pacs.028`, `pacs.029` | הפחתת התשלום, בקשה לסטטוס ופתרון/נתח של סטטוס החקירה |
| `pain.001`, `pain.002` | תחילת התשלום של הלקוח והסדיקת דו"ח מצב התשלום |
| `camt.052`, `camt.053`, `camt.054` | דו"ח חשבונות, הצהרה וחיזוק הודעות |

## Kaigi הפגישות {#kaigi-sessions}

Kaigi מספקת חדרי קול/ווידאו בתשלום, בזמן אמת SORA Nexus. השתמש בו כאשר
יישום צריך יצירת פגישת בעלת תמיכה בספר, שינויים ברשימה, רלווי
מוניפסטים, סיגנליזציה מוצפנת, מדידת השימוש במקום לשמור את כל
מפעילים מחוץ למשרשרת המדינה.

המחזור של החיים המסתובב על הספר הוא:

- `CreateKaigi`: ליצור קריאה תחת דומיין ולהחזיק את מדיניותו,
  לוח זמנים, מטא-מנתונים, ומניסט רלווי אופציונלי.
- `JoinKaigi` ו `LeaveKaigi`: עדכן את רשימת השיחות. במצב פרטי,
  המשתתפים משתמשים בהתחייבות, בדיקות וראיות רשימה במקום
  חשבון המשתתף IDs ישירות.
- `RecordKaigiUsage`: להוסיף את משך הזמן המתמד ומסכמי הגז.
- `EndKaigi`: סגור את הפגישה ותקליט את סימן הזמן הסופי.

Torii חשף טלמטריה של רלווי `/v1/kaigi/relays`,
`/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, ו
`/v1/kaigi/relays/events` כאשר האפליקציה API ואפשרות טלמטריה.
מצב הפגישה משקף דרך Kaigi אירועים בתחום כגון
`KaigiRosterSummary`, `KaigiRelayManifestUpdated`,
`KaigiRelayHealthUpdated`, ו `KaigiUsageSummary`.

### CLI מבחן עשן {#cli-smoke-test}

תתחיל עם `iroha kaigi` CLI כאשר אתה רוצה לאמת כי Torii נקודת סוף
מקבל Kaigi עסקאות לפני חיבור UI. הפקודה "להתחיל מהיר"
יוצר חדר זמני נגד הפעילים Torii נקודת הסיום ומדפיס סיכום
עם מזהמת השיחה, להצטרף לפקודה, SoraNet רמז של סגל:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

עבור זלילים כתובים, לנהל את מחזור החיים של החדר במפורש:

```bash
iroha kaigi create \
  --domain streaming \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha kaigi join --domain streaming --call-name daily --participant <i105-account-id>
iroha kaigi leave --domain streaming --call-name daily --participant <i105-account-id>

iroha kaigi record-usage \
  --domain streaming \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha kaigi end --domain streaming --call-name daily
```

שימוש `--room-policy public` לחדרים שבהם משקיעים עשויים לחשוף ללא צופה
כרטיסים, או `--room-policy authenticated` כאשר היציאות צריכות לצפות
אימות. `--privacy-mode zk-roster-v1` רק לאחר שהרשת
ה- Kaigi רשימה ושימוש בדיקות מפתחות מותאמות; אחרת יחידות, עמודים,
ושישויות שימוש פרטיות נכשלות במהלך אימות דטרמיניסטי.

### בדיקות עם JavaScript דמו {#testing-with-the-javascript-demo}

השתמש ב
[סוראמיטסו/אירוזה-דמו-ג'אבסקרפט](https://github.com/soramitsu/iroha-demo-javascript)
דמו של שולחן העבודה עבור מבחן ארנק מסוף עד הסוף. הדמו הוא אלקטרון ו-Vue
יישום שמדבר ישירות Torii דרך המערכת המקומית `@iroha/iroha-js`
מחייב וכולל `/kaigi` כביש עבור מדיה ילידה של הדפדפן אחד לאחד.

השתמש בדמו עם
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
מה Iroha מאגר המקור. SDK דרך
`file:../iroha/javascript/iroha_js`, אז שמרו את שני הצ'אוטים באחינו הזה.
תכנון:

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

שימוש Node.js 20 או יותר חדשים ו Rust שרשרת כלים כך המלידי `iroha_js_host`
מודול יכול לבנות. SDK באחים Iroha קש לאחר שינוי
מקורו; תכנון החבילה הנקי לא מכיל את חלל העבודה של Cargo
נדרש על ידי `npm run build:native`.

בדיקת מאובטחת, ציין את הדמו Kaigi-יכול Torii נקודת סוף:

1. תתחילו Iroha קשר עם SORA/Kaigi פיתוח אפליקציה APIs אפשרות או שימוש
   נקודת סוף ציבורית המחשבה על Kaigi פני השטח שאתה צריך.
2. בדוק את היכולת הגישה בסיסית `/health`, אז בדוק את פני המסלול החי
   עם `/openapi` או `/openapi.json`. כמה הפעלות חושפות גם
   `/v1/health`, אבל `/health` זה בדיקת החיים הנייד.
3. עבור TAIRA, לאבד את מסלול הטלמטריה של הרשת לפני לנסות פגישה בשידור חי:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

   בדיקות אלה מוכיחות Torii ו Kaigi טלמטריה מרחבת ניתן להגיע אליה.
   לא ליצור פגישה; `CreateKaigi` ו `JoinKaigi` עדיין צריך מימון
   הארנקים והמסירת עסקה חתומה.
4. פתח את הדמו, לך ל **הגדרות**, להגדיר את Torii URL, ונתן לאפליקציה לטעין
   שרשרת ID ותיקון רשת מהנקודת סוף.
5. ליצור או לשחזר שני ארנקים מקומיים בדמו.
   פרופילים, או מכונות כך שהארח והאורח יש מצב ארנק נפרד.

כדי לבדוק את Kaigi UI:

1. בחלון המארח, פתוח **Kaigi**, בחר **התחל את הפגישה.**, להציב כותרת,
   ובוחרים **הזמנה פרטית** או **הזמנה ברורה**.
2. בחר **תדליק את המצלמה והמיקרופון** אז מה? WebRTC יש מדיה מקומית.
3. בחר **ליצור קישור פגישה**. ארנק חי מספק `CreateKaigi`; ה-
   האפליקציה מראה `iroha://kaigi/join?call=...&secret=...` הזמנה ו
   `#/kaigi?...` מסלול חזרה.
4. שמרו על החלון של המארח פתוח וחלקו את ההזמנה עם האורח.
5. בחלון האורחים, פתח את ההזמנה או דביק אותה **הצטרף לפגישה**, תסתובב
   על מדיה מקומית, ולבחור **הצטרף לפגישה**. ארנק חי יביא את
   הצעת מארח מוצפן Torii ומגיש `JoinKaigi` עם מוצפן
   תענה על מטא נתונים.
6. המארח צריך ליישם באופן אוטומטי את התשובה הראשונה באמצעות שידור חי או סקרים Kaigi
   אותות שיחה. שני החלונות צריכים להראות מדיה מחוברת ומעדכנת
   פרטי חיבור.
7. לסיים את הפגישה מהמארח, או להשתמש CLI `iroha kaigi end` פקודה
   אותה שיחת. ID.

פרטי Kaigi צרכים מוגנים XOR כדי לשלם את דמי כניסה פרטיים.
דיווחים דמו כי פרטי Kaigi צרכים מוגנים XOR, השתמשו באפליקציה
הגנת עצמית תמריץ ומנסה שוב את יצירת או להצטרף פעולה. אם ייצור הוכחה,
מימון פרטי, או סיגנלינג חי אינו זמין, הדמו
זרימה חיונית/מנהלית. במקרה זה, פתוחה **סיגנליזציה מתקדם**, העתק את
פעקת הצעה או תשובה רוטבית, ודביק אותה לחלון השני.

עבור בדיקות אוטומטיות בדמו repo, תפעילו:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

כיסוי החדרים המוקדמים של Vitest Kaigi יצירת קישור מפגש, הזמנה קומפקטית
חיפוש, שיחות בריג'ים פרטיות ליצור/להצטרף/הסתיים, קווים של הגנת עצמית, ידנית
תוצאות הפסגה, ותשובות סקרים. UI בדיקת העשן כוללת את `/kaigi` דרך
על דייסקטופ ומכניעי תצפית בגודל נייד. מדיה חיה בין שני ארנקים עדיין
צריך בדיקת ידנית בשתי חלונות כי אישור מצלמת הדפדפן/מיקרופון
וזרמי מדיה עמיתים הם ספציפיים לסביבה.

לקוד האינטגרציה של הדוגמא, ראה
[מוטבע Kaigi ב- JavaScript אפליקציה](/he/guide/tutorials/kaigi.md).

## מצב ומטריקים {#status-and-metrics}

נקודות הסיום של הסטטוס והמטריקות הן הדברים הראשונים שהובאו לדישבארד:

- `/status` מגלים את שדות השותפים, הבלוקים, הזדרות וההסכמה ברמה הגבוהה ביותר
- `/metrics` מגלים ספרי Prometheus, מדדים והיסטוגרמות

על Nexus-נודים מעודכנים, יצירת מצב כולל גם קו ומרחב נתונים מודעים
סעיפים. `nexus.enabled = false`, החלקים האלה נמחקו.

## JSON נגד. Norito {#json-vs-norito}

מספר נקודות קצה של המפעיל חוזרות Norito לפי ההגדרה. כאשר נקודת הסיום תומכת
JSON, לשלוח:

```http
Accept: application/json
```

זה מועיל במיוחד עבור:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

כאשר נקודת סוף מקבלת או חוזרת בטייפ Norito ישירות, שימוש
`application/x-norito` כסוג התוכן או מעדיף `Accept` הערך.
[Norito](/he/reference/norito.md#torii-and-norito-rpc) פרטי התחבורה.

## פרופיל טלמטריה {#telemetry-profiles}

ראיית נקודת הסיום תלויה בהגדרות טלמטריה.
חמישה רמות פרופיל:

| פרופיל | `/status` | `/metrics` | מסלול פיתוח |
| --- | --- | --- | --- |
| `disabled` | לא. | לא. | לא. |
| `operator` | כן. | לא. | לא. |
| `extended` | כן. | כן. | לא. |
| `developer` | כן. | לא. | כן. |
| `full` | כן. | כן. | כן. |

## CLI קיצוצים {#cli-shortcuts}

ה- `iroha` CLI כבר עוסק בהרבה מהנקודות הסופיות האלה:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## מקורות קדם {#upstream-references}

- [README API וניתוח מקיף לטיפשות](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 יישום גשר](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [ביצועים ומטריקות](/he/guide/advanced/metrics.md)
