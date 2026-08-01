---
translation_locale: he
translation_source: /reference/torii-endpoints.md
translation_source_hash: 9bec41b1b419e252fdcff8328e7950a294bdad3ac40112a5a7f2ce451d19e9cb
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Torii נקודות סוף {#torii-endpoints}

Torii האם זה HTTP, SSE, ו WebSocket שער ל Iroha 3. זה משרת שניים מתבוננים בספר APIs ונקודות הסיום של המפעיל.

הכללים הנוכחיים של הפרוטוקול הם:

- פורמט בינארי קנוני הוא Norito
- הרבה נקודות קצה תומכות גם JSON כאשר אתה שולח `Accept: application/json`
- מדדים נחשפים בצורת Prometheus.

לקבלת פרטים על פורמט, משא ומתן תוכן, דגלי עיצוב, השיש של סכמה, והנחיות Norito RPC, קראו את התייחסות [Norito ](/he/reference/norito.md).

## נקודות סוף משותפות {#common-endpoints}

|נקודת סוף.|פורמט |מטרה.|
| --- | --- | --- |
|`POST /transaction` |Norito |תגיש עסקה חתומה |
|`POST /query` |Norito |תשלח בקשה חתומה |
|`GET /events` |WebSocket |לחתום על זרמי אירועים |
|`GET /block/stream` |WebSocket |זרם בלוקים מחויבים |
|`GET /peers` |JSON |רשימת עמיתים שחשפו על ידי Torii |
|`GET /health` |JSON |נקודת הסיום לחיים קלים |
|`GET /api_version` |JSON |דפוס API גרסה |
|`GET /status` |JSON |סיכום מצב ברמה גבוהה למפעילים |
|`GET /metrics` |פרומטהיאוס |נקודת הסיום של Prometheus scrape.|
|`GET /schema` |JSON |תמונת גיליון של מודל נתונים שמשרתת על ידי העמודה |
|`GET /openapi` או `GET /openapi.json` |JSON |מסמך OpenAPI למסלולים פעילים Torii HTTP |
|`GET /v1/parameters` |JSON |תמונה של פרמטרים הערך |
|`GET /v1/node/capabilities` |JSON |יכולת הערך ונתונים מטאטא מודל נתונים |
|`GET /v1/api/versions` |JSON |גרסאות תומכות Torii API |
|`GET /v1/events/sse` |SSE |זרם אירועים עבור לקוחות בעלי חיים ארוכים |
|`GET /v1/time/now` |JSON |תמונה של שעון הקיר של Node|
|`GET /v1/time/status` |JSON |מצב סינכרון זמן |

`/openapi` הוא רשימת נקודות קץ סמכותית עבור קשר פועל. פני השטח המדויק תלוי בתכונות הבנייה ובהסדרת זמן ההפעלה, ולכן לקוחות שנוצרו צריכים להעדיף את המסמך חי OpenAPI על רשימת הנתיב שנעצמה ידנית. השתמש בקונסולת [Torii API ](/he/reference/torii-api-console.md) כדי לטעון את המסמך החי, לבחון את הדרכים של JSON , להעתיק את בקשות curl ולייצר קוד לקלינט מהשמעת הנוכחית.

## נסה לשרות Taira {#try-live-taira-routes}

רשת המבחן הציבורית Taira חושפת את אותה פני השטח Torii JSON שלקוחות היישום משתמשים בהחקירה בקריאה בלבד. פקודות אלו לא דורשות מפתחות:

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

אם מסלול טסטנץ ציבורי חוזר `502`, מפסיק, או מדווח על זורה מלאה, לטפל בזה כבעיה של זמינות נקודת סוף ולנסות שוב מאוחר יותר לפני תיקון הקוד הלקוח שלך.

## קונצנזוס ונקודות הסיום של זמן ההפעלה {#consensus-and-runtime-endpoints}

|נקודת סוף.|פורמט |מטרה.|
| --- | --- | --- |
|`GET /v1/sumeragi/commit-certificates` |JSON |סיכומים אחרונים של תעודת ההתחייבויות |
|`GET /v1/sumeragi/validator-sets` |JSON |תאריך הגדרת המאשר |
|`GET /v1/sumeragi/validator-sets/{height}` |JSON |המוודא הוגדר בגובה של כביש.|
|`GET /v1/sumeragi/status` |Norito או JSON |תמונה מדויקת של מצב ההסכמה |
|`GET /v1/sumeragi/status/sse` |SSE |זרם מצב ההסכמה המתמשך |
|`GET /v1/sumeragi/leader` |JSON |מידע עכשווי של המנהיג |
|`GET /v1/sumeragi/qc` |Norito או JSON |סיכום האחרון של תעודת קוורום |
|`GET /v1/sumeragi/checkpoints` |JSON |סיכום של נקודות בדיקת הסכמה |
|`GET /v1/sumeragi/consensus-keys` |JSON |מפתחות הסכמה פעילות |
|`GET /v1/sumeragi/bls_keys` |JSON |מפתחות הסכמה פעילות BLS |
|`GET /v1/sumeragi/phases` |JSON |דוגמה אחרונה של אבטחה פר-שלב |
|`GET /v1/sumeragi/rbc` |JSON |RBC נתונים של הפגישות והקיבולות |
|`GET /v1/sumeragi/rbc/sessions` |JSON |תמונה של הפגישה RBC פעילה |
|`GET /v1/sumeragi/pacemaker` |JSON |סטטוס קצב הלב |
|`GET /v1/sumeragi/params` |JSON |פרמטרים של זרם על שרשרת Sumeragi |
|`GET /v1/sumeragi/collectors` |JSON |תמונה מהיר של תוכנית אספקה דטרמיניסטית |
|`GET /v1/sumeragi/key-lifecycle` |JSON |מצב מחזור החיים של מפתח הסכמה |
|`GET /v1/sumeragi/telemetry` |JSON |תמונת טלמטריה של הסכמה |
|`GET /v1/sumeragi/evidence` |JSON |רישומים של ראיות, בחופש מסנן על ידי שרשרת בקשת |
|`GET /v1/sumeragi/evidence/count` |JSON |מספר הראיות.|
|`POST /v1/sumeragi/evidence/submit` |JSON |להגיש ראיות של הסכמה |
|`GET /v1/sumeragi/commit_qc/{hash}` |Norito או JSON |התחייב QC רשום עבור בלוק האש |
|`GET /v1/runtime/abi/active` |JSON |מתאר זמן תפעול פעיל ABI |
|`GET /v1/runtime/abi/hash` |JSON |זמן תפעול פעיל ABI האש |
|`GET /v1/runtime/metrics` |JSON |תמונה של מדדים זמן ההפעלה |
|`GET /v1/runtime/upgrades` |JSON |רשימת עדכונים בזמן הפעלה |
|`POST /v1/runtime/upgrades/propose` |JSON |תציע שיפור בזמן הפעלה.|
|`POST /v1/runtime/upgrades/activate/{id}` |JSON |להפעיל שיפור מתכנן של זמן ההפעלה |
|`POST /v1/runtime/upgrades/cancel/{id}` |JSON |ביטול שיפור זמן ההפעלה המוצע |

## משפחות האפליקציה SORA {#app-and-sora-route-families}

כאשר Torii נבנה עם קבוצת התכונות המתמודדת עם אפליקציה, הוא חושף משפחות נוספות של JSON עבור חוקרים, שירותי SORA, זרמי גשר, ראיות ואחסון. לא כל משפחות אלה פעילות בכל פרופיל רשת.

|משפחה מסלול |מטרה.|
| --- | --- |
|`/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*` |JSON קורות, עוזרים לחיפוש, עוזרים להצטרף, ותצפיות פורטפוליו או בעלים |
|`/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*` |NFT, נכס בעולם האמיתי, ותצפיות על נכסים סודיות |
|`/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` |שם, פרופיל ומועד הגדלה |
|`/v1/explorer/*` |תצפיות של חשבון, נכס, בלוק, עסקאות, הוראות, מטריקים וסטרים המכוונות ל- Explorer |
|`/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*` |היסטוריית העסקאות, התאוששות או מצב של צינורות, ISO 20022 עוזרים |
|`/v1/contracts/*` |קוד החוזה, הפעלת, חבילה, קריאה, תצוגה, אירוע, פעילות, רולאפ ומסלולים של המדינה |
|`/v1/multisig/*`, `/v1/controls/*` |הצעות מרובות, אישורים ועוזרי בקרת העברת |
|`/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*` |סיום, הוכחה למדינה, הוכחה בלוק, שמירה על ראיות, ודרכי שאלת הראיות |
|`/v1/da/*` |זמינות נתונים, מוניפסטים, מדיניות הוכחה, מחויבויות וכוונות קצרות |
|`/v1/zk/*` |ZK שורשים, אימות ראיות, הוכחה של IVM, ספירת קולות, מפתחות אימות, רשומות ראיות ותארים |
|`/v1/gov/*`, `/v1/ministry/*` |הצעות לניהול, קולות, מדינת המועצה, מרחבי שמות מוגנים, הצעות סדר היום, חקיקה וסיום |
|`/v1/nexus/*`, `/v1/sccp/*` |Nexus ליין, מרחב נתונים, ועוזרי חסינות צלולת שרשרת |
|`/v1/musubi/*` |Musubi קריאת רישום חבילות ופיתוח הוראות |
|`/v1/subscriptions/*` |תוכניות חתימה, מחזור החיים של החתימה, שימוש וחיסול עוזרים |
|`/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*` |SoraFS גילוי ספק, הוכחות קיבולות, סיבוב, אספקה של אחסון ותוכן ציבורי שירות |
|`/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*` |SoraCloud מחזור חיים של שירותים, זרמי מחשבים פרטיים/מודלים, גילוי ציבורי, ושיווק אפליקציות מאוחזקות |
|`/v1/connect/*`, `/v1/vpn/*` |Iroha פגישות חיבור, תחבורה WebSocket, פגישות VPN, פרופילים ורשומות |
|`/v1/app-api/*`, `/v1/api/*`, `/v1/content/*` | אפליקציה API חיבורים וחבילה/CID-שיחזור תוכן מבוסס |
|`/v1/operator/*`, `/v1/mcp` |אימות המפעיל והגשר המקומי MCP JSON-RPC |
|`/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` |הכנות מקוונת, הסכמי אחסון נתונים, מוניסטים של חלל נתונים, ועוזרי [RAM-LFE ](/he/blockchain/ram-lfe.md#torii-routes) |
|`/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*` |שיתוף פעולה, קישור אינטרנט, הודעות דחיפה ואינטגרציות טלמטריה חי |

## ISO גשר 20022 {#iso-20022-bridge}

Torii חושף את גשר ISO 20022 תחת `/v1/iso20022/*` כאשר האפליקציה הפוכה API וזמן ההופעה של הגשר מופעלים. זה לא שער קלירינג מטרה כללית ISO 20022 אלא תת קבוצה תומכת בהפנה של הודעות תשלום נבחרות לתעברות חתומות Iroha ולעקוב אחר מעמדה בספר ההוצאות.

### Torii ISO 20022 נקודות סוף {#torii-iso-20022-endpoints}

|שיטה ונקודת סוף |מטרה.|
| --- | --- |
|`POST /v1/iso20022/pacs008` |להגיש העברת אשראי FI ל FI לקוח ולבנות את העברה של נכסים Iroha המתאימה |
|`POST /v1/iso20022/pacs009` |להגיש העברת אשראי FI ל FI ששימשו עבור PvP או למימון במזומן הקשור לכספים |
|`POST /v1/iso20022/pacs002` |הגשת דו"ח מצב התשלום |
|`POST /v1/iso20022/pacs004` |להגיש הצהרת תשלום |
|`POST /v1/iso20022/camt056` |הגשת בקשה לבטל תשלום |
|`POST /v1/iso20022/sese023` |להגיש הוראה לפיצוי ניירות ערך |
|`POST /v1/iso20022/sese024` |תשלח הודעה על מצב הסדר ערך |
|`POST /v1/iso20022/sese025` |להגיש אישור הסדר ערך |
|`POST /v1/iso20022/colr012` |להגיש הודעה על תחליף ביטוח |
|`GET /v1/iso20022/messages/{msg_id}` |תקרא את תיעוד הגשר הקנוני עבור מסר אחד.|
|`GET /v1/iso20022/audit/messages` |תקרא את מסר הניתוח של הודעות מופרעות.|
|`GET /v1/iso20022/messages/{msg_id}/pacs002` |להציג את מצב התשלום הנוכחי כ- `pacs.002` XML |
|`GET /v1/iso20022/messages/{msg_id}/pacs004` |להציג את הצהרת התשלום הנוכחית כ `pacs.004` XML |
|`GET /v1/iso20022/messages/{msg_id}/camt029` |להציג את החלטת ביטול הנוכחית כ- `camt.029` XML |
|`GET /v1/iso20022/messages/{msg_id}/sese024` |להשיב את מצב הסדר הנוכחי כ `sese.024` XML |
|`GET /v1/iso20022/messages/{msg_id}/sese025` |להציג את אישור הסדר הנוכחי כ- `sese.025` XML |

הודעות `pacs.008` צריכות להציג את המסר ID, סכום הסדר בין בנקים, מטבע, תאריך הסדר, חוב ולקבלן IBANs, וחוב ולקוחן BICs. כאשר נתונים מקבילים מותאמים, הגשר גם בודק את צומת המטבעות BIC, IBAN, ו ISO 4217 לפני שההעסקה המוצרת נכנסת לצינור.

הודעות `pacs.009` צריכות לספק את המסר העסקי ID, הגדרה של המסר ID, זמן היצירה, סכום הסדר בין בנקים, מטבע, תאריך הסדר, הסוכן ההוראות וההוראות BICs, והחובן והק્રેડિટור IBANs. אם המסר כולל `Purp`, הגשר מקבל כרגע מימון למטרות ערך בלבד: `Purp=SECU`.

נקודות הסיום של הגשת `pacs.008` ו `pacs.009` מקבלות מעטפות XML ISO או פורמט שדה שטוח המשמש בניסויים על גשר. תחומים אופציונליים `SplmtryData` יכולים לתפוס את ספריה היעד Iroha חשבון מקור ומטרה IDs או כתובות, והגדרה של נכס ID. התשובה היא `202 Accepted` עם `message_id`, `transaction_hash`, `status`, `pacs002_code`, ואת הקשר של ספריה/חשבון/כספי הנכס המוגדרים .

### תמיכה נוספת בניתוחים ומפונים {#additional-parser-and-mapping-support}

העוזר IVM ISO גם מאשר ומטייליז את משפחות ההודעות הבאות עבור אישור המעטפה, מאפיית ההתיישבות או התאמה במורד זרם. אין להם דרכים עצמאיות Torii:

|המשפחה של הודעות |תמיכה זמנית |
| --- | --- |
|`head.001` |אישור כותרת היישום העסקי למעטפות ISO, כולל שדות `BizMsgIdr`, `MsgDefIdr`, זמן יצירה, ושלח/קבל בחופשי BIC |
|`pacs.007`, `pacs.028`, `pacs.029` |הפחתת תשלומים, בקשה לסטטוס ופתרון החקירה/נתח מצב |
|`pain.001`, `pain.002` |תחילת התשלום של הלקוח והעמידה של דו"ח מצב התשלום |
|`camt.052`, `camt.053`, `camt.054` |דו"ח חשבונות, הצהרה וחיסכון של הודעות |

## Kaigi הפגישות {#kaigi-sessions}

Kaigi מספקת חדרים באודיו / וידאו בתשלום ובזמן אמת על SORA Nexus. השתמש בו כאשר יישום צריך יצירת פגישת בעלת תמיכה בספר, שינויים ברשימה, מוניסטרים מרחבים, סיגנליזציה מוצפנת, מדידת השימוש במקום לשמור את כל מצב הכנסות מחוץ לשולש.

מחזור החיים המסתובב על הספר הוא:

- `CreateKaigi`: ליצור שיחה תחת דומיין ולשמר את מדיניותו, לוח הזמנים, מטא-מנתונים ומניסט ההחזקת בחופשי.
- `JoinKaigi` ו `LeaveKaigi`: מעדכן את רשימת ההזמנות. במצב פרטי, המשתתפים משתמשים בהתחייבויות, בדיקות ביטול והראיות לרשימה במקום לחשוף באופן ישיר את חשבון המשתתף IDs.
- `RecordKaigiUsage`: הוסף את משך הזמן הממוצע ואת סכום הגז.
- `EndKaigi`: סגור את הפגישה ולהקליט את סימן הזמן הסופי.

Torii מגלה טלמטריה מרחב תחת `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, ו `/v1/kaigi/relays/events` כאשר האפליקציה API תופעות טלמטריה פעילות. מצב הפגישה משקף דרך Kaigi אירועים בתחום כגון: `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated`, ו `KaigiUsageSummary`.

### CLI בדיקת עשן {#cli-smoke-test}

התחל עם `iroha kaigi` CLI כאשר אתה רוצה לוודא כי נקודת סוף Torii מקבלת עסקאות Kaigi לפני חיבור UI. פקודת ההתחלה המהירה יוצרת חלל זמני נגד נקודת הסיום הפעילה Torii ומדפיסה סיכום עם מזהם שיחת הטלפון, פקודה להצטרף, וסימן של סגל SoraNet:

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

השתמש `--room-policy public` לחדרים שבהם משקיפים עשויים לחשוף ללא כרטיסי תצפית, או `--room-policy authenticated` כאשר היציאות צריכות לאותנטיזציה של התצפית. השתמשו `--privacy-mode zk-roster-v1` רק לאחר ברשת יש את Kaigi רשימה ושימוש בדיקת מפתחות מוגדרים; אחרת חיבורים, עמודים, ורשומות השימוש הפרטיים נכשלים במהלך הבדיקת דטרמיסטית.

### בדיקות עם הדמו JavaScript {#testing-with-the-javascript-demo}

השתמש בדמו של שולחן העבודה [soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) לבדיקת הארנק מהסוף עד הסוף. הדמו היא יישום אלקטרון ו-Vue המדבר ישירות עם Torii באמצעות החיבור המקומי `@iroha/iroha-js` ומכלל נתיב `/kaigi` עבור מדיה יחידת אחד לאחד במדפדפן.

השתמש בדמו עם [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) מאחסון המקור של Iroha. הדמו עותקים את SDK עד `file:../iroha/javascript/iroha_js`, אז שמרו על שני הקשפים בהצורה האחים:

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

השתמש Node.js 20 או חדש יותר ובשרשרת כלים Rust כדי שהמודול המקומי `iroha_js_host` יוכל לבנות. שיחזר את SDK בנקודת הקבלה האחים Iroha לאחר שינוי מקורו; תכנון החבילה הנקי אינו מכיל את חלל העבודה של המטען הדרוש על ידי `npm run build:native`.

עבור ניסוי מבוקר, ציין את הדמו בנקודת הסיום Kaigi - מסוגלת Torii:

1. להפעיל קשר Iroha עם האפליקציה SORA/Kaigi הפוכה ל- APIs פעילה, או להשתמש בנקודת סוף ציבורית המחשבת את פני השטח Kaigi שאתה צריך.
2. בדוק את היכולת הגישה בסיסית עם `/health`, ואז בדוק את פני השטח של המסלול החיה עם `/openapi` או `/openapi.json`. חלק מההתיישומים גם חושפים את `/v1/health`, אבל `/health` הוא הבדיקת חיות ניידת.
3. עבור TAIRA, בדוק את מסלולי הטלמטריה של הרשת לפני לנסות פגישה בשידור חי:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

בדיקות אלה מוכיחות כי טלמטריה של Torii ו- Kaigi ניתן להגיע אליהן. הן לא יוצרות פגישה; `CreateKaigi` ו- `JoinKaigi` עדיין זקוקים לכרטיסים מיומנים ולהגיש עסקה חתומה.
4. לפתוח את הדמו, ללכת להגדרות, להגדיר את Torii URL, ולתתת לאפליקציה לטעין את שרשרת ID ותיקום רשת מנקודת הסיום.
5. ליצור או לשחזר שני ארנקים מקומיים בדמו. להשתמש חלונות אפליקציות נפרדים, פרופילים או מכונות כדי שהארח והאורח יש מצב ארנק נפרד.

כדי לבדוק את Kaigi UI:

1. בחלון המארח, לפתוח Kaigi, לבחור להתחיל פגישה, להגדיר כותרת, ולבחר הזמנה פרטית או הזמנה שקופה.
2. בחר להפעיל מצלמה ומיקרופון כך WebRTC יש מדיה מקומית.
3. בחר ליצור קישור פגישה. ארנק חי שולח `CreateKaigi`; האפליקציה מראה אחר כך הזמנה `iroha://kaigi/join?call=...&secret=...` ודרך חזרה `#/kaigi?...`.
4. שמור את החלון של המארח פתוח וחלוק את ההזמנה עם האורח.
5. בחלון האורחים, פתח את ההזמנה או דביק אותה בפגישה להצטרף, תפעיל את התקשורת המקומית ותבחר לפגישה להצטרפות. הארנק חי ישיג את הצעת האוסט המוצפנת מ- Torii ויגיש את `JoinKaigi` עם נתונים מטאטא תשובה מוצפנים.
6. המארח צריך ליישם באופן אוטומטי את התשובה הראשונה באמצעות שידור או סקר של אותות קריאה Kaigi. שני החלונות צריכים להראות מדיה מחוברת ופרטים מעודכנים של חיבור.
7. לסיים את הפגישה מהמארח, או להשתמש ב CLI `iroha kaigi end` פקודה עבור אותה שיחת ID.

פרטי Kaigi צרכים מוגנים XOR אם הדמו מדווח כי הפרטי Kaigi צרכים מוגנים XOR, השתמש בדפ"ח של הגנת עצמי בתוכנה ולנסות שוב את הפעולה ליצור או להצטרף. אם יצירת ראיות, מימון פרטי או סיגנליקה חי אינן זמינות, הדמוקרטיה יכולה לחזור לזרם שקוף / ידני. במקרה זה, לפתוח סימן מתקדם, להעתיק את ההצעה המקורית או פעקת התשובה, ולהדביק אותה לחלון השני.

עבור בדיקות אוטומטיות במערכת הדמו, תפעיל:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

סוויטות ה-Vitest המוקדמות מכילות יצירת קישור מפגש Kaigi, טעון הזמנה קומפקטי, שיחות גשר פרטיות ליצור / להצטרף / סיום, פקודות הגנת עצמית, תשלומים ידניים ותשאלות תשובה. בדיקת העשן UI כוללת את הנתיב של `/kaigi` על מסלול הביקור במחשב ומסלולים ניידים. מדיה חיה בין שני ארנקים עדיין זקוקה לבדיקה ידנית של שתי חלונות כי אישורות מצלמת הדפדפן/מיקרופון וזרזות מדיה עמיתות הן ספציפיות לסביבה.

עבור קוד אינטגרציה של הדגימה, ראה [מכלול Kaigi ב-App JavaScript ](/he/guide/tutorials/kaigi.md).

## מצב ומטריקים {#status-and-metrics}

נקודות הסיום של הסטטוס והמטריקות הן הדברים הראשונים שנחברו לדהשבארדים:

- `/status` חושף את שדות השותפים, הבלוקים, הקווים וההסכמה ברמה העליונה.
- `/metrics` חושף ספרי Prometheus, מדדים והיסטוגרמים.

בנקודות Nexus המאפשרות, יצירת מצב כוללת גם חלקי קו ומרחב נתונים מודעים. כאשר `nexus.enabled = false`, החלקים האלה נמנעים.

## JSON לעומת Norito {#json-vs-norito}

מספר נקודות הסיום של המפעיל חוזרות Norito באופן מקובל. כאשר נקודת הסיום תומכת JSON, לשלוח את:

```http
Accept: application/json
```

זה מועיל במיוחד עבור:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

כאשר נקודת סוף מקבלת או חוזרת בטופס Norito ישירות, השתמשו ב- `application/x-norito` כטיפוס התוכן או ערך מועדף `Accept`. ראה את פרטי התחבורה של [Norito ](/he/reference/norito.md#torii-and-norito-rpc).

## פרופיל טלמטריה {#telemetry-profiles}

הנראות של נקודות הקצה תלויה בהגדרת `telemetry.profile` של הצומת. התצורה הנוכחית חושפת חמש רמות פרופיל:

|פרופיל |`/status` |`/metrics` |מסלול פיתוח |
| --- | --- | --- | --- |
|`disabled` |לא |לא |לא |
|`operator` |כן |לא |לא |
|`extended` |כן |כן |לא |
|`developer` |כן |לא |כן |
|`full` |כן |כן |כן |

## CLI קיצוצים {#cli-shortcuts}

ה- `iroha` CLI כבר מכיל הרבה מהנקודות הסופיות האלה:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## ראשי תיקון מקדימה {#upstream-references}

- [README API וניתוח מקיף של יכולת התצפיה](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 יישום גשר](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [ביצועים ומטריקים ](/he/guide/advanced/metrics.md)
