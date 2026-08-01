---
translation_locale: he
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 8cc510f79468efa58732b806c254155d4d7225c0876272bd8126ea07e8607888
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# בנייה על SORA 3: Taira ו Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 הוא מסלול ההפצה הציבורי הפנימי של האפליקציה שנבנה על Iroha 3 ו SORA Nexus. לבנות ולחזור על Taira קודם, ולאחר מכן להעביר את אותו צורת הלקוח ל Minamoto רק כאשר יש לך מפתחות מרכזיות נפרדות, XOR אמיתי עבור דמי, והסכמה לייצור.

הדרכה זו מראה כיצד להגדיר קלינט Iroha לרשתות ציבוריות SORA 3:

- רשת בדיקת Taira ב- `https://taira.sora.org`
- רשת מרכזית Minamoto ב- `https://minamoto.sora.org`

השתמש Taira לבדיקות אינטגרציה, קנריות כתיבה מיומנות על ידי פנקס, וניסיון הפעלת. השתמשו Minamoto רק עבור פעילות הרשת המרכזית מוכנה לייצור. שתי הרשתות דורשות תשלום ב XOR:

- Taira משתמשת ברשת בדיקות XOR מן המזרקה הציבורית.
- Minamoto משתמשת XOR אמיתי. אין קנקן Minamoto.

## מסלול הבנייה {#builder-path}

|צעד |Taira Testnet |Minamoto מרכזית |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|התחל לקרוא מצב הרשת |שאלת `/status` ללא מפתחות |שאלת `/status` ללא מפתחות |
|בחר חלל נתונים |שימוש ציבורי `universal` אלא אם כן האפליקציה שלך זקוקה למסלול מנוהל |השתמשו באותו מרחב נתונים רק לאחר אישור הרשת הראשית |
|קבל נכס תשלום.|השתמש ברצועה הציבורית Taira |קבל XOR מתוך חשבון מימון Minamoto או זרם כספי מאושר |
|בדיקת כותבת |השתמשת בטיפול ממומלץ על ידי גלישה XOR |אל תשתמשו במכשירים בדיקות; כתבים מבזבזים אמיתי XOR |
|קידום |תמשיכו לנסות מחדש את ההיגיון, מעקב, וניהול חותמים |השתמשו במפתחות נפרדות, בקרת מימון ושחרור. |

הזרימה המעשית היא:

1. לבנות את הלקוח נגד Taira ולהשתמש בשטח הנתונים הציבורי `universal`.
2. הוסף חותם ולממן אותו עם המזרקה Taira.
3. תפעיל את ההיגיון של האפליקציה שלך נגד Taira עד כישלונות הם משעממים ומצופים.
4. ליצור חותם נפרד Minamoto, לממן אותו עם XOR אמיתי, ולהעביר רק את אותם פעולות מוכחות ל-mainnet.

## המשך עם ספר הבישול {#continue-with-the-cookbook}

השתמש בהנחיה זו כדי לבחור רשת, להגדיר חותם, ולממן עמלות. ואז תמשיך עם המתכון שמתאים להתנהגות היישום שאתה רוצה לבנות:

|מטרה.|המתכון.|
| --- | --- |
|תבדקו Taira ותסדרו לקוח | [חיבור ל Taira](/he/cookbook/connect-to-taira.md) |
|תשלח כתיבה ראשונה ותבדוק את התוצאה שלה.| [הגשת ומבחינת עסקאות ](/he/cookbook/submit-and-verify-transactions.md) |
|רישום, מנטה וערך העברה | [נכסים פונגביים](/he/cookbook/fungible-assets.md) |
|קראו את מצב היישום הגלוי | [רישוב של מדינת ה-Ledger](/he/cookbook/query-ledger-state.md) |
|תגובה לשינויים שהוכרסו | [אירועי זרם](/he/cookbook/stream-events.md) |

ספר הבישול שומר על כל זרימת עבודה ממוקדת ומקשרת חזרה לכאן כאשר היא זקוקה למימון Taira או לקשר רשת SORA Nexus.

## 1. להבין את מה שאתה מתכנן {#_1-understand-what-you-are-setting-up}

ב SORA Nexus, חלל נתונים הוא חלק מהקטלוג של קו הרשת והדרכי הנתיב. לקלינט לא יוצר חלל נתוני ציבורי חדש רק על ידי שינוי `client.toml`.

1. מצביעים את הלקוח בנקודת הסיום הימנית Torii
2. בוחן את ההקשר של שרת הדומיין ומרחב נתונים עבור החשבון הקנוני שלו.

`AccountId` הוא תמיד קאנוני ובלתי תחום. `[account].domain` הערך ב `client.toml` מספק את ההקשר של הנתיב ושמה; הוא אינו הופך לחלק מהזהות החשבון. עבור רוב היישומים, התחילו עם הציבור `universal` מרחב נתונים. `domain.dataspace` טופס, למשל:

```text
wonderland.universal
```

אם אתה זקוק למרחב נתונים ארגוני חדש, תכין קטלוג והצעת מסלול במקום לנסות לרשום אותו מחשב לקוח רגיל. ראה [Provision a New Dataspace](#_8-provision-a-new-dataspace) למטה.

## 2. בדוק את נקודת הסיום הציבורית Torii {#_2-check-the-public-torii-endpoint}

בדוק אם נקודת הסיום היעד היא חי לפני להגדיר חותם.

עבור Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

עבור Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

בדוק את חלל הנתונים והצפייה של המסלול שנחשף על ידי העמודה:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

השתמשו באותו פקודה עם `https://minamoto.sora.org/status` עבור mainnet.

## Taira MCP לסוכנים {#taira-mcp-for-agents}

Taira חושף גם גשר של פרוטוקול תקין מודל ילידי Torii (MCP) עבור זמני ההפעלה של הסוכן. השתמש בו כאשר סוכן צריך קריאת טסטנט חי, אבחון כתוב, או חזרות כתיבה משומכות בקפידה מבלי לבנות קודם קלינט מותאם על פי דפוס Torii.

|הגדרות|ערך |
| --- | --- |
|MCP נקודת סוף |`https://taira.sora.org/v1/mcp` |
|שורש רשת |`https://taira.sora.org` |
|השימוש המיועד |Taira קורות רשתת מבחן וניסויים של כתיבה ממומנים על ידי מכונת מים |
|שווה ערך לייצור |אל תדביקו את הכתיבה הזאת ב Minamoto אלא אם כן נקודת הסיום של הרשת המרכזית MCP ופיקוח על השחרור אושרו במפורש |

בדוק את מטא נתוני הגשר לפני הוספת חומר חתימה:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

להגדיר את URL כשרת משתמש מקומי MCP בזמן הפעלת הסוכן. אל תתחייב את הערכים של סוכן MCP, טוגנים API, כותרות מחברים המשוברות, `authority`, או `private_key` לתוך repo docs או repo יישום זה.

כללים של סוכן מיידי שעובדים היטב עם Taira:

- תגלה כלים מהשרת MCP לפני שתתקשר אליהם; תגלה מחדש אם השר מספר `listChanged`.
- מעדיפים את הכלים `iroha.` המתבוננים על פני כלים `torii.` חומריים.
- תתחילו לקרוא בלבד: לבדוק מצב, חשבונות, נכסים, שם כינוי, בלוקים, מצב הממשל, ומצב העסקאות לפני שתציעו כתבות.
- נדרש הוראות אנושיות מפורשות לפני מוטציות ברשת המבחן חיות. עבור מעטפות עסקאות חתומות מראש, השתמש `iroha.transactions.submit_and_wait` כדי שהסוכן ממתין לתוצאה במקום רק להגיש.
- סיכום ה- hashs של העסקה, מצב סופי וטעויות אישור שרת בתגובה הסוכן.

### זרימת עבודה של פיתוח עם סוכנים {#development-workflow-with-agents}

השתמשו בסוכנים כעוזרי פיתוח עבור לקוחות Iroha, בונים עסקאות, תסריטים לדיאגנסטיות וספרים של רוץ testnet. שמור על סמכות הסוכן לצמצם: הוא יכול לבחון קוד, לקרוא את מצב Taira, להציע שינויים ולפעול בדיקות מקומיות, אבל הוא לא צריך לשנות רשת חיה עד שאדם אישר את הפעולה המדויקת.

זרימת עבודה מעשית היא:

1. בקש מהסוכן לבדוק את המסמכים הרלוונטיים, קוד SDK, פקודה CLI, או תוכנית כלי MCP לפני שהוא כותב קוד.
2. שאל את הסוכן לכתוב קודם את הנתיב הקלינט הקטן ביותר: בדיקה של מצב, חיפוש חשבונות, פתרון פרופיל, או חיפוש מאזן.
3. הוספת קוד בניית עסקאות רק לאחר שיחות קריאה בלבד עובדות נגד Taira.
4. שמרו על ניסויים ברשתות חיתקות, לדוגמה מאחורי `TAIRA_LIVE=1`, כך שרוץ ניסוי יחידה רגיל לעולם לא מבזבז כספי רשתות בדיקה או תלוי זמינות הרשת.
5. מחייב את הסוכן להודיע על שורש הרשת, שרשרת, חשבון הרשויות, סיכום הוראות, נכס תשלום, ושינוי מצב צפוי לפני שהוא מספק כל עסקאות.
6. ביקורת קוד שנוצר לניהול סודי, התנהגות ניסיון חוזר, אידמפוטנטיות, וניהול דחייה לפני קידום אותו ל CI או זרמי עבודה מרכזיים.

כלים שימושיים MCP עבור פיתוח כוללים חיפוש נכסים של חשבונות, החלטה תחת השם, חיפוש בלוק, חיפוש עסקאות, רשימות עסקאות ובדיקות מצב צינור. השתמש בהם כדי לבנות אמון לפני ששלחת כל מטען מועיל חתום .

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### זרם העבודה של עסקאות באמצעות סוכנים {#transaction-workflow-through-agents}

הגשר MCP יכול להגיש עסקאות חתומות על ידי Iroha, אך הוא אינו מסיר את דרישות העסקה הרגילות. עסקה עדיין צריכה סמכות נכונה, רשיונות, מימון עמלות, שרשרת ID, מטאדאטה וחתום .

עבור חומרי Iroha עסקאות, לבנות ולחתום על מעטפת העסקות עם SDK או CLI ראשית, לאחר מכן לתת לסוכן רק את החתימה הקנונית של העסקה בייטים קודמים כ `body_base64`. הסוכן יכול להגיש את המעטפה עם `iroha.transactions.submit_and_wait`, או להגיש עם `iroha.transactions.submit` ובוחקר עם `iroha.transactions.wait`.

אל תדביקי מפתחות פרטיות לתוך פנקסט של סוכן. אם הסוכן צריך לבנות עסקאות, מכוון אותם לקוד מקומי שמטען סודות מהזמן ההפעלה של המשתמש הסוכן לעולם לא צריך לכתוב את החומר המרכזי לתוך Markdown, קישורים, מעקבנים או מחברים.

לפני הגשת עסקה, לגרום לסוכן להכין תוכנית ארוכה של עסקה:

- `network`: Taira שורש ושרשרת הרשתות המבחן ID
- `authority`: חשבון אשר חותם ומשלם עמלות
- `instructions`: רישום, מנטה, שריפה, העברה, מטא-מנתונים, אישור או סיכום קריאת החוזה
- `fee asset`: נכס אשר יועיל על Taira
- `preflight reads`: חישוב חשבון, סכום נכסים, רשיונות, כינויים או בדיקות בלוק שכבר נעשו.
- `expected result`: מצב אשר צריך להיות נראה לאחר אישור
- `idempotency`: מה קורה אם אותה בקשה נבחנת שוב

לאחר ההשלוח, לגרום לסוכן לחכות למצב טערמינל, ולאחר מכן לאמת את השינוי במצב עם בקשה קריאה. דו"ח השלמה שימושי כולל:

- העסקה האש
- מצב הטרמינל, כגון `Committed`, `Applied`, `Rejected` או `Expired`
- פרטים של בלוק או חוקר, כאשר הם זמינים
- תוצאות קריאת אימות
- הודעה של דחייה והאם הפסלה נראית כמו רשיונות, עמלות, אישור, מצב קבוע או זמינות נקודת הסיום

דוגמה של פקודה משמרת:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

כאשר המעטפה חתומה כבר מוכנה:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

לטפל Taira MCP כשטח בקרה של רשתת ניסוי ציבורית. מפתחות Taira, רשתות ניסוי XOR, חשבונות מצנצנים וסימנים קנריים הם חד פעמיים ועליהם להישאר נפרדים ממפתחות Minamoto ומפקידי עבודה של פוסקת הייצור.

## דוגמאות צעצועים שאתה יכול לנסות עכשיו {#toy-examples-you-can-try-now}

דוגמאות אלה הן קריאה בלבד, אלא אם כן צוין. הם עובדים לפני שאתה מייצר מפתחות והם בטוחים להפעיל נגד שני רשתות ציבוריות.

השוואה בין מערכת המבחן Taira לבריאות הרשת המרכזית Minamoto:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

רשימה של קווי השטח הנתונים הציבורי שחשפו על ידי Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

תפעיל את אותה פקודה נגד Minamoto כאשר אתה צריך את התצוגה של הרשת הראשית:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

לבנות סונדה מצבו קטנה Node.js עבור לוח המעקב, בוט, או בדיקה של הפעלת:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
EOF
```

הצעצוע הראשון לצד כתיבה צריך להיות טענה למזרקה Taira. הוא משתמש ברשת מבחן XOR ולעולם לא צריך להצביע על Minamoto.

## 3. ליצור Config לקוח Taira {#_3-create-a-taira-client-config}

ליצור זוג מפתחות אם אין לך כבר אחד:

```bash
kagami keys --algorithm ed25519 --json
```

ליצור `taira.client.toml`:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

הרמה העליונה `chain` היא שרשרת העסקאות המדויקת Taira ID. הגדרת `[account].profile = "taira"` בוחרת באופן עצמאי את ההבדל של שרשרת Taira I105. שרשרת ID לא בוחרת את הפרופיל של החשבון.

תבדקו רק קריאה:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

לבצע את האבחנה הציבורית Taira לפני בדיקות כתיבה:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

לממן את החשבון Taira באמצעות המזרקה לפני שתפעיל כתבות תשלום. זרימת המזרקה הישירה היא ב [Get Testnet XOR על Taira ](#_4-get-testnet-xor-on-taira).

לאחר קבלת ההצעה על המנקה והמימון של החשבון, Taira קאנרי הוא מבחן עשן כתיבה אופציונלי:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

הקנרי מספק פינג חתום, מחכה לאישור ומכתוב את קונפיגציה של חותם בזמן ההפעלה כאשר `--write-config` נמסר. Taira הוא רשת מבחן ציבורית. אם `taira doctor` מדווח על שורה מלאה או שהקנרי חוזר `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, חכו ותנסו שוב לפני שתייחסו לזה כטעיה בהשגחת הלקוח.

עבור בדיקות עשן ללא פיקוח, לכסות את הקנרי במעגל חוזר מוגבל:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

להפסיק לנסות מחדש אם `iroha taira doctor` מראה כישלונות קשים. סיפוק השורה והרחישה של הכניסה לתשלום הם תנאים עולמיים ברשתת המבחן הציבורית; DNS, TLS או `status = "fail"` אבחון לא.

## ליצור a SORA Nexus חשבון ID {#generate-a-sora-nexus-account-id}

א SORA Nexus חשבון ID הוא קנוני I105 כתובת המוצאת מפתח הציבורי של החשבון ושל הרשת המטרה. `[account].domain` ערך לקוח TOML. אותו מפתח ציבורי מקודד למפתחות שונות IDs על Taira ו Minamoto, ומשתמשים הייצור צריכים ליצור זוג מפתחות נפרד עבור Minamoto.

לייצר או לטעון את מספר מפתחות Ed25519 אשר ישלטו על החשבון:

```bash
kagami keys --algorithm ed25519 --json
```

להפוך את המפתח הציבורי לחשבון Taira ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

להפוך מפתח ציבורי Minamoto עם הפריפקס של הרשת הראשית:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

השתמשו בחשבון המוצא ID בכל מקום שבו פקודה Nexus API או CLI מבקשת חשבון קנוני ID, למשל, בנקודת Taira `account_id`, תשמור על המפתח הפרטי המתאימה בהקנה הלקוח שלך, ובחר את אותה רשת ציבורית עם `[account].profile = "taira"` או `[account].profile = "minamoto"`.

יצירת ID איננה מעצמה מייצרת חשבון ממומן על שרשרת. ב Taira, המזרקה יכולה ליצור ולממן את החשבון עבור testnet כותבים. ב Minamoto, השתמשו ב-mainnet מורשה או זרם כספי.

### אחסון המפתחות וגיבוי {#key-storage-and-backup}

ניתן לחלוק את החשבון ID ואת המפתח הציבורי. המפתח הפרטי המתאים, הסיסמה, הזרע וחומר השיקום חייבים להיות סודיים.

השתמשו בתרגילים אלה עבור חשבונות SORA Nexus:

- שמור את המפתחות הפרטיות במנהל סיסמאות מוצפן, חנות מפתח תומכת בהרדואר או שירות חתימה ייחודי. אל תתחייב את המפתחות לפיקוח מקור או להשאיר את המפתחות הייצור בהיסטוריה של הצ'ל, בלגים, צ'אט, כרטיסים, או גיבויים לא מוצפנים.
- השתמשו בשבילה ייחודית בעלת אנטרופיה גבוהה עבור כל שפת או חותם הייצור. שמור סיסמאים במנהל סיסמה או בתהליך אחסון חלקי, ולא באותו קבץ או חבילת גיבוי כמו המפתח הפרטי מוצפן.
- שמרו על המפתחות Taira ו Minamoto בנפרד. מטרידו את המפתחות Taira כחומר רשת ניסוי חד פעמי ומפתחות Minamoto כמערכת כספי הייצור.
- גיבוי המפתח הפרטי, המפתח הציבורי, החשבון ID, פרופיל החשבון, וכל הערות לשחזור חשבון או שמירה נדרשות כדי להחזיר את החותם. מפתח פרטי ללא ההקשר של הרשת הוא קל לשימוש לרעה במהלך השיקום.
- שמרו לפחות גיבוי לא מקוון אחד מוצפן וגיבוי מוצפן אחד נפרד מבחינה גיאוגרפית עבור חותמי הייצור. תבדקו התאוששות עם פעולת קריאה קטנה בלבד לפני שתסתמך על הגיבוי.
- סובב או תחליף חותם אם המפתח הפרטי, סיסמה, מדיה גיבוי, או מארח החתימה עשויים להיות חשופים.

לקבלת פרטים נוספים, ראה [חסון מפתחות קריפטוגרפיים ](/he/guide/security/storing-cryptographic-keys.md) ו- [ אבטחת סיסמא ](/he/guide/security/password-security.md).

## קבל את הטסטנט XOR על Taira {#_4-get-testnet-xor-on-taira}

השתמש במברך הציבורי ישירות.

1. ליצור או להטען חותם ולחושב את החשבון הקנוני Taira שלו ID.
2. תביא את הפאזל הנוכחי.
3. לפתור את הפאזל אם `difficulty_bits` גדול יותר מ- `0`.
4. תגיש את בקשת המנקה.
5. חכו עד שהמשקל של החשבון או נכסים ייראה לפני שישלחו הודעות תשלום.

הפוך מפתח ציבורי לתוך Taira I105 חשבון ID צפוי על ידי המזרקה:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

תביא את הפאזל.

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

המזרקה היא שירות רשת מבחן ציבורי. אם הפאזל או נקודת הסיום של הדרישה חוזרת `502`, פסק זמן, או טעות אחרת ברמת השער, חכו ותנסו שוב לפני שינויים במפתחות או בהקנת הלקוח שלכם.

התגובה היא בצורת זו:

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

כאשר `difficulty_bits` הוא `0`, להגיש רק את החשבון ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

כאשר `difficulty_bits` הוא גדול יותר מ `0`, לפתור את הפאזל ולהכלל את גובה המעמד בתוספת הנונס:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }' \
  | tee ./taira-faucet-response.json \
  | jq .
```

האלגוריתם של הפאזל הוא:

1. לבנות את האתגר כמו SHA-256 על:
   - בייטים של `iroha:accounts:faucet:pow:v2`
   - חשבון UTF-8 ID
   - `anchor_height` כמו ג'ון גדול `u64`
   - `anchor_block_hash_hex` מפורסמת באייטים
   - `challenge_salt_hex` מקובל כבייטים, כאשר קיים
2. נסה `u64` nonces מוצפן כערכים של 8 בייטים גדול-endian.
3. עבור כל סקרפט, תפעיל את הסקרפט עם:
   - סיסמה: ה-8-בייט nonce
   - מלח: האתגר של 32 בייטים
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - אורך ההוצאת: 32 בייטים
4. ה-nonce המנצח הוא ה- digest הראשון עם לפחות `difficulty_bits` מוביל אפס ביטים.

התגובה למנקה כוללת את נכס המיועד והשיש של העסקות בשורה:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "<TAIRA_FEE_ASSET_DEFINITION_ID>",
  "asset_id": "...",
  "amount": "<FUNDED_AMOUNT>",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

התגובה מובילה כיום HTTP `202 Accepted`. זה `asset_definition_id` הוא הזרם Taira נכס תשלום הממומן על ידי צינור ציבורי; נגזר אותו מההתגובה במקום להעתיק דוגמה ID. המנקה קיבלה את ההצעה כשהיא חוזרת `tx_hash_hex` ו `status: "QUEUED"`.

לאחר מכן סקר עבור הנכס המיועד לפני שתשלח את העסקאות שלך של תשלום עמלות:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

אם תביעת המזרקה התקבלה אך החשבון או הנכס עדיין לא נראים, העסקה עדיין מאחורי עיבוד קו הטסטנט ציבורי. חכו ותנסיו מחדש את הקריאה לפני שתשלחו כתבות.

עבור בדיקה ישירה API מוכנה לפעולה, שמור את זה כ- `taira_faucet_claim.py` ותעבירו את החשבון Taira I105 ID:

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

puzzle_request = urllib.request.Request(
    f"{root}/v1/accounts/faucet/puzzle",
    headers={"Accept": "application/json"},
)

with urllib.request.urlopen(puzzle_request) as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"Accept": "application/json", "content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

המנקה היא רק עבור Taira כספי טסטנט. אל השתמשו בטסטנט XOR, חשבונות ברזל, או Taira חותמים קנריים Minamoto זורמים.

## 5. ליצור תיקון לקוחות Minamoto {#_5-create-a-minamoto-client-config}

השתמשו בשני מפתחות נפרדים עבור Minamoto. אל תחזרו להשתמש במפתחות Taira עבור הרשת הראשית.

ליצור `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

הרמה העליונה `chain` הוא הזרם Nexus שרשרת מרכזית ID. `[account].profile = "minamoto"` בוחרת את Minamoto I105 הגדלה של שרשרת; שם המארח של נקודת הסיום והשרשרת ID אל תבחרו את זה באופן מעורפל.

להמיר מפתח ציבורי Minamoto לחשבון קנוני שלו I105 ID עם מקוד הרשת המרכזית:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

תפעילו רק בדיקות בצד קריאה עד שהחשבון יועבר ויימומן באמצעות הזרימת ה-mainnet או זרימת השלטון:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

אל תפעילו את המנקה Taira או עוזרת כתיבה נגד Minamoto.

## 6. מימון חשבון Minamoto ב- XOR {#_6-fund-a-minamoto-account-with-xor}

דמי Minamoto משולמים עם ייצור XOR, ו- Minamoto אין לו צינור ציבורי. לממן את החשבון המוגדר באמצעות חיבור ברשת המרכזית או העברת כספים מאושרים, או לקבל XOR מחשב Minamoto מיומן קיים.

בדוק את החשבון הקנוני ID והסכום עם בדיקות קריאה בלבד לפני הצבת כתב. תייחסו ל- Minamoto XOR כספי ייצור: תחזרי את אותה מבצע ב- Taira קודם, שמרו על מפתחות ייצור נפרדים, ואל תחשבו כי ניתן להפעיל מחדש עסקאות ברשת המרכזית.

Taira XOR לא יכול לשלם עמלות Minamoto. סולכות רשתות הבדיקה ודרשות למזרזים אינן מועברות ל Minamoto.

## 7. לעבוד בתוך מרחב נתונים קיים {#_7-work-inside-an-existing-dataspace}

השתמשו בשמות דומנים מוסמכים לחלוטין עבור אובייקטים של ספרי הנתונים המתגוררים בתוך חלל נתונים. לדוגמה, תחום פרויקט בחלל נתונים ציבורי צריך להשתמש:

```text
apps.universal
```

לאחר שהחשבון שלך יש את הרשיונות הנדרשים, ליצור כוונה ללא סוד `AliasSetupPlanRequestV1` עבור הדומיין ולהשתמש בתכנן ההצהרה:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

עבור Minamoto, ליצור ולאשר כוונה ותוכנית מרכזית נפרדות. התוכניות קשורות למגוון, סמכות, מעגל של מצב החיים שלהם, ומוקד, כך שתכנית Taira לא יכולה להיות מובילה או משחזרת:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

הכינוי של חשבונות משתמש באותם קישורים של חלקי נתונים:

```text
alice@apps.universal
alice@universal
```

שדות חשבון קפדניים עדיין משתמשים בחשבון קנוני I105 IDs. מתייחסים לכינויים כקשרים שניתן לקרוא על ידי אדם אשר מתפתחים לחשבון קנוני IDs.

## 8. סיפקת מרחב נתונים חדש {#_8-provision-a-new-dataspace}

מרחב נתונים חדש הוא מפעיל ושינוי של ממשל. נקודת הסיום הציבורית Torii יכולה לכוון את התנועה אל מרחבי נתונים מותאמים, אך היא תסרב על שם כינויים לא ידועים למרחבי נתנים.

לפני שאתה מכין שינוי, קלט את קטלוג החי הנוכחי:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

עבור חשבון מפעיל, בדוק גם את תנוחת מסדרת המסלול:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

אל תפרסמו שם כינוי חדש אלא אם כן עברו יחד סקירה של המסלול ID, חלל הנתונים ID, קבוצת ההמתנה, סובלנות לטעויות, מוניסט, כללי הנתיב והיצרן הפועל. חשבון משתמש רגיל עם הרשאות הנדרשות יכול לרכוש תחום ולקחתו SNS בתוך חלל נתונים קיים באמצעות מתכנן התכונות; הוא לא יכול להוסיף באופן בטוח חלל נתוני ציבורי חדש.

עבור חלל נתונים פרטי או ארגוני, להכין שינוי קטלוג עם:

- פרופיל שדה נתונים ייחודי ומספר `id`
- כניסה למסלול מתאימה או מינוי למסלול קיים
- חלל הנתונים `fault_tolerance`
- כללי הנתיב עבור ההוראות או קווי החשבון שצריכים לנחות שם
- מוניסט של דירקטוריון החלל או הוכחה מקבילת לשימוש, כאשר חלקי הנתונים חושפים יכולות UAID
- אישור השלטון למדיניות ההסמכה, התכנות, הסדר והטיפול.

פרגמנט קונפיגרציה שניתן לבחון נראה כך:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

קבלה של המפעיל צריכה לכלול את השערים הבאים:

- `irohad --sora --config <config.toml> --trace-config` מעביר את הקונפיגורציה של העמודה המפתרת
- המניפסט שנוצר או הוחזר מאורכיב עם חישובים וחתימות.
- מבחני עשן עוברים על Taira לפני כל קידום Minamoto
- קטלוג `/status` לאחר השינוי מראה את המסלול הנדרש ומרחב הנתונים.
- `iroha app nexus lane-report --summary` לא מדווח על חוסר מסמכים נדרשים.

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

לקדם את אותו מרחב נתונים ל- Minamoto רק לאחר שמלאים את הפעלת Taira, בדיקות עשן, מעקב וראיות של ניהול.

## דפים קשורים {#related-pages}

- [להתקין Iroha 3](/he/get-started/install-iroha.md)
- [פעל Iroha 3 באמצעות CLI ](/he/get-started/operate-iroha-via-cli.md)
- [דמי תמיכה עבור חלל נתונים פרטי ](/he/get-started/private-dataspace-fee-sponsor.md)
- [נקודות קצה Torii ](/he/reference/torii-endpoints.md)
- [דף בראשית](/he/reference/genesis.md)
