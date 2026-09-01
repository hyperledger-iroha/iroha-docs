---
translation_locale: he
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# בנייה על SORA 3: Taira ו Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 הוא מסלול ההפצה הציבורי הפנימי של האפליקציה שנבנה על Iroha 3 ו SORA Nexus. לבנות ולחזור על Taira קודם, ולאחר מכן להעביר את אותו צורת הלקוח ל Minamoto רק כאשר יש לך מפתחות מרכזיות נפרדות, XOR אמיתי עבור דמי, והסכמה לייצור.

הדרכה זו מראה כיצד להגדיר קלינט Iroha לרשתות ציבוריות SORA 3:

- רשת בדיקת Taira ב- `https://taira.sora.org`
- רשת מרכזית Minamoto ב- `https://minamoto.sora.org`

השתמשו ב-Taira לבדיקות אינטגרציה, לבדיקות כתיבה הממומנות באמצעות faucet ולתרגילי פריסה. השתמשו ב-Minamoto רק לפעילות mainnet המוכנה לייצור. שתי הרשתות גובות עמלות ב-XOR:

- Taira משתמשת ב-XOR של רשת הבדיקה משירות ה-faucet הציבורי.
- Minamoto משתמשת ב-XOR אמיתי. אין שירות faucet ל-Minamoto.

## מסלול הבנייה {#builder-path}

|שלב |רשת הבדיקה Taira |הרשת הראשית Minamoto |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|התחילו בקריאת מצב הרשת |שאילתת `/status` ללא מפתחות |שאילתת `/status` ללא מפתחות |
|בחרו מרחב נתונים |השתמשו ב־`universal` הציבורי, אלא אם היישום זקוק ל־lane מנוהלת |השתמשו באותו מרחב נתונים רק לאחר אישור ל־mainnet |
|השיגו את נכס העמלה |השתמשו ב־faucet הציבורי של Taira |קבלו XOR מחשבון Minamoto ממומן או מתהליך treasury מאושר |
|בדקו פעולות כתיבה |השתמשו ב־XOR לבדיקה שמומן מהברז |אל תשתמשו בכלי בדיקה; פעולות כתיבה מוציאות XOR אמיתי |
|עברו לייצור |תרגלו לוגיקת ניסיון חוזר, ניטור וטיפול בחותם |השתמשו במפתחות, במימון ובבקרות שחרור נפרדים |

הזרימה המעשית היא:

1. לבנות את הלקוח נגד Taira ולהשתמש בשטח הנתונים הציבורי `universal`.
2. הוסף חותם ולממן אותו עם faucet Taira.
3. תפעיל את ההיגיון של האפליקציה שלך נגד Taira עד כישלונות הם משעממים ומצופים.
4. ליצור חותם נפרד Minamoto, לממן אותו עם XOR אמיתי, ולהעביר רק את אותם פעולות מוכחות ל-mainnet.

## המשך עם ספר הבישול {#continue-with-the-cookbook}

השתמש בהנחיה זו כדי לבחור רשת, להגדיר חותם, ולממן עמלות. ואז תמשיך עם המתכון שמתאים להתנהגות היישום שאתה רוצה לבנות:

|מטרה.|המתכון.|
| --- | --- |
|תבדקו Taira ותסדרו לקוח | [חיבור ל Taira](/he/cookbook/connect-to-taira.md) |
|תשלח כתיבה ראשונה ותבדוק את התוצאה שלה.| [הגשת ומבחינת עסקאות ](/he/cookbook/submit-and-verify-transactions.md) |
|רישום, הנפקה וערך העברה | [נכסים פונגביים](/he/cookbook/fungible-assets.md) |
|קראו את מצב היישום הגלוי | [רישוב של מצב ספר החשבונות](/he/cookbook/query-ledger-state.md) |
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

אם אתה זקוק למרחב נתונים ארגוני חדש, תכין קטלוג והצעת מסלול במקום לנסות לרשום אותו מחשב לקוח רגיל. ראה [הקצאת מרחב נתונים חדש](#_8-provision-a-new-dataspace) למטה.

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

Taira חושף גם גשר של פרוטוקול תקין מודל native Torii (MCP) עבור זמני ההפעלה של הסוכן. השתמש בו כאשר סוכן צריך קריאת טסטנט חי, אבחון כתוב, או חזרות כתיבה משומכות בקפידה מבלי לבנות קודם קלינט מותאם על פי דפוס Torii.

|הגדרות|ערך |
| --- | --- |
|MCP נקודת סוף |`https://taira.sora.org/v1/mcp` |
|שורש רשת |`https://taira.sora.org` |
|השימוש המיועד |קריאות ברשת הבדיקה Taira וניסויי כתיבה שממומנים באמצעות שירות המימון |
| מקבילה לייצור | אל תפנו רשומה זו אל Minamoto אלא אם נקודת קצה MCP ברשת הראשית ובקרות השחרור אושרו במפורש |

בדוק את מטא נתוני הגשר לפני הוספת חומר חתימה:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

הגדירו את כתובת ה־URL כשרת MCP מקומי למשתמש בסביבת הריצה של הסוכן. אל תכניסו למאגר התיעוד הזה או למאגר יישום את תצורת ה־MCP של הסוכן, אסימוני API, כותרות אימות מועברות, `authority` או ערכי `private_key`.

כללים של סוכן מיידי שעובדים היטב עם Taira:

- תגלה כלים מהשרת MCP לפני שתתקשר אליהם; תגלה מחדש אם השר מספר `listChanged`.
- מעדיפים את הכלים `iroha.*` המתבוננים על פני כלים `torii.*` חומריים.
- התחילו בגישה לקריאה בלבד: בדקו מצב, חשבונות, נכסים, כינויים, בלוקים, מצב ממשל ומצב עסקאות לפני שתציעו פעולות כתיבה.
- נדרש הוראות אנושיות מפורשות לפני מוטציות ברשת המבחן חיות. עבור מעטפות עסקאות חתומות מראש, השתמש `iroha.transactions.submit_and_wait` כדי שהסוכן ממתין לתוצאה במקום רק להגיש.
- סיכום ה- hashs של העסקה, מצב סופי וטעויות אישור שרת בתגובה הסוכן.

### זרימת עבודה של פיתוח עם סוכנים {#development-workflow-with-agents}

השתמשו בסוכנים כעוזרי פיתוח עבור לקוחות Iroha, בונים עסקאות, תסריטים לדיאגנסטיות וספרים של רוץ testnet. שמור על סמכות הסוכן לצמצם: הוא יכול לבחון קוד, לקרוא את מצב Taira, להציע שינויים ולפעול בדיקות מקומיות, אבל הוא לא צריך לשנות רשת חיה עד שאדם אישר את הפעולה המדויקת.

זרימת עבודה מעשית היא:

1. בקש מהסוכן לבדוק את המסמכים הרלוונטיים, קוד SDK, פקודה CLI, או תוכנית כלי MCP לפני שהוא כותב קוד.
2. שאל את הסוכן לכתוב קודם את הנתיב הקלינט הקטן ביותר: בדיקה של מצב, חיפוש חשבונות, פתרון פרופיל, או חיפוש מאזן.
3. הוספת קוד בניית עסקאות רק לאחר קריאות קריאה בלבד עובדות נגד Taira.
4. שמרו על ניסויים ברשתות חיתקות, לדוגמה מאחורי `TAIRA_LIVE=1`, כך שרוץ ניסוי יחידה רגיל לעולם לא מבזבז כספי רשתות בדיקה או תלוי זמינות הרשת.
5. מחייב את הסוכן להודיע על שורש הרשת, שרשרת, חשבון הרשויות, סיכום הוראות, נכס תשלום, ושינוי מצב צפוי לפני שהוא מספק כל עסקאות.
6. ביקורת קוד שנוצר לניהול סודי, התנהגות ניסיון חוזר, אידמפוטנטיות, וניהול דחייה לפני קידום אותו ל CI או זרמי עבודה מרכזיים.

כלי MCP שימושיים לקריאה בלבד במהלך הפיתוח כוללים חיפוש נכסי חשבון, פתרון alias, חיפוש בלוקים ועסקאות, רשימות עסקאות ובדיקות מצב שרשרת עיבוד העיבוד. השתמשו בהם כדי לוודא שהלקוח פועל כראוי לפני שליחת מטען חתום כלשהו.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### זרם העבודה של עסקאות באמצעות סוכנים {#transaction-workflow-through-agents}

הגשר MCP יכול להגיש עסקאות חתומות על ידי Iroha, אך הוא אינו מסיר את דרישות העסקה הרגילות. עסקה עדיין צריכה סמכות נכונה, רשיונות, מימון עמלות, שרשרת ID, מטאדאטה וחתום .

עבור חומרי Iroha עסקאות, לבנות ולחתום על מעטפת העסקות עם SDK או CLI ראשית, לאחר מכן לתת לסוכן רק את החתימה הקנונית של העסקה בייטים קודמים כ `body_base64`. הסוכן יכול להגיש את המעטפה עם `iroha.transactions.submit_and_wait`, או להגיש עם `iroha.transactions.submit` ובוחקר עם `iroha.transactions.wait`.

אל תדביקי מפתחות פרטיות לתוך פנקסט של סוכן. אם הסוכן צריך לבנות עסקאות, מכוון אותם לקוד מקומי שמטען סודות מהזמן ההפעלה של המשתמש הסוכן לעולם לא צריך לכתוב את החומר המרכזי לתוך Markdown, נתוני בדיקה, מעקבנים או מחברים.

לפני הגשת עסקה, לגרום לסוכן להכין תוכנית ארוכה של עסקה:

- `network`: Taira שורש ושרשרת הרשתות המבחן ID
- `authority`: חשבון אשר חותם ומשלם עמלות
- `instructions`: רישום, הנפקה, שריפה, העברה, מטא-מנתונים, אישור או סיכום קריאת החוזה
- `fee asset`: נכס אשר יועיל על Taira
- `preflight reads`: חישוב חשבון, סכום נכסים, רשיונות, כינויים או בדיקות בלוק שכבר נעשו.
- `expected result`: מצב אשר צריך להיות נראה לאחר אישור
- `idempotency`: מה קורה כאשר מנסים שוב את אותה בקשה?

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

הצעצוע הראשון לצד כתיבה צריך להיות טענה לfaucet Taira. הוא משתמש ברשת מבחן XOR ולעולם לא צריך להצביע על Minamoto.

## 3. יצירת תצורת לקוח Taira {#_3-create-a-taira-client-config}

ליצור זוג מפתחות אם אין לך כבר אחד:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
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

ממנו את חשבון Taira באמצעות שירות המימון לפני הפעלת כתיבות הכרוכות בעמלה. התהליך הישיר מתואר בסעיף [קבלת XOR של רשת הבדיקה ב־Taira](#_4-get-testnet-xor-on-taira).

לאחר שבקשת המימון התקבלה והחשבון מומן, בדיקת הקנרית של Taira היא בדיקת עשן אופציונלית לכתיבה:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

ה-canary שולח ping חתום, ממתין לאישור וכותב את תצורת חותם ה-runtime כאשר מסופק `--write-config`. Taira היא testnet ציבורית, ולכן רוויה של התור עלולה לגרום ל-ping החתום להיכשל גם כאשר ה-faucet עצמו פועל. אם `taira doctor` מדווח על תור רווי או שה-canary מחזיר `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, המתינו ונסו שוב לפני שתסווגו זאת כשגיאת תצורת client.

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

חשבון SORA Nexus ID הוא כתובת I105 קנונית הנגזרת מהמפתח הציבורי של החשבון ומקידומת רשת היעד. הוא אינו הערך `[account].domain` ב-client TOML. אותו מפתח ציבורי מקודד ל-IDs שונים ב-Taira וב-Minamoto, ומשתמשי ייצור צריכים ליצור זוג מפתחות נפרד עבור Minamoto.

לייצר או לטעון את מספר מפתחות Ed25519 אשר ישלטו על החשבון:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
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

יצירת ה־ID לבדה אינה יוצרת חשבון ממומן בשרשרת. ב־Taira, הברז יכול ליצור ולממן את החשבון לצורך כתיבות ברשת הבדיקה. ב־Minamoto, השתמשו בתהליך הצטרפות מאושר לרשת הראשית או בתהליך של האוצר.

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
4. תגיש את בקשת ה-faucet.
5. חכו עד שהמשקל של החשבון או נכסים ייראה לפני שישלחו הודעות תשלום.

הפוך מפתח ציבורי לתוך Taira I105 חשבון ID צפוי על ידי faucet:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

תביא את הפאזל.

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

faucet היא שירות רשת מבחן ציבורי. אם הפאזל או נקודת הסיום של הדרישה חוזרת `502`, פסק זמן, או טעות אחרת ברמת השער, חכו ותנסו שוב לפני שינויים במפתחות או בהקנת הלקוח שלכם.

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
3. עבור כל nonce, תפעיל את הסקרפט עם:
   - סיסמה: ה-8-בייט nonce
   - מלח: האתגר של 32 בייטים
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - אורך ההוצאת: 32 בייטים
4. ה-nonce המנצח הוא ה- digest הראשון עם לפחות `difficulty_bits` מוביל אפס ביטים.

תגובת שירות המימון כוללת את הנכס שמומן ואת גיבוב העסקה שבתור:

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

התגובה מחזירה כיום HTTP `202 Accepted`. הערך `asset_definition_id` הוא נכס העמלה הנוכחי של Taira שמממן השירות הציבורי; קחו אותו מן התגובה במקום להעתיק ID לדוגמה. הבקשה התקבלה כאשר התגובה מכילה `tx_hash_hex` ו־`status: "QUEUED"`.

לאחר מכן סקר עבור הנכס המיועד לפני שתשלח את העסקאות שלך של תשלום עמלות:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

אם בקשת המימון התקבלה אך החשבון או הנכס עדיין אינם גלויים, העסקה עדיין ממתינה לעיבוד בתור הציבורי של רשת הבדיקה. המתינו ונסו שוב את הקריאה לפני שתשלחו פעולות כתיבה.

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

שירות המימון מיועד לכספי רשת הבדיקה של Taira בלבד. אל תשתמשו ב־XOR של רשת הבדיקה, בחשבונות של שירות המימון או בחותמי הקנרית של Taira בתהליכי Minamoto.

## 5. ליצור תיקון לקוחות Minamoto {#_5-create-a-minamoto-client-config}

השתמשו בזוג מפתחות נפרד עבור Minamoto. אל תשתמשו מחדש במפתחות Taira ברשת הראשית.

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

השדה `chain` ברמה העליונה הוא ה־chain ID העדכני של הרשת הראשית Nexus. ‏`[account].profile = "minamoto"` בוחר את מַבְחִין השרשרת I105 של Minamoto; שם המארח של נקודת הקצה וה־chain ID אינם בוחרים בו במשתמע.

להמיר מפתח ציבורי Minamoto לחשבון קנוני שלו I105 ID עם מקוד הרשת המרכזית:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

תפעילו רק בדיקות בצד קריאה עד שהחשבון יועבר ויימומן באמצעות הזרימת ה-mainnet או זרימת השלטון:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

אל תפעילו את ברז Taira או את עזר כתיבת הקנרית מול Minamoto.

## 6. מימון חשבון Minamoto ב- XOR {#_6-fund-a-minamoto-account-with-xor}

דמי Minamoto משולמים עם ייצור XOR, ו- Minamoto אין לו faucet ציבורי. לממן את החשבון המוגדר באמצעות חיבור ברשת המרכזית או העברת כספים מאושרים, או לקבל XOR מחשב Minamoto מיומן קיים.

אמתו את ה־account ID הקנוני ואת המימון באמצעות בדיקות לקריאה בלבד לפני הגשת כתיבה. התייחסו ל־Minamoto XOR כאל כספי ייצור: תרגלו תחילה את אותה פעולה ב־Taira, שמרו מפתחות ייצור נפרדים ואל תניחו שאפשר לאפס עסקה ברשת הראשית.

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

אל תקדמו כינוי חדש אלא אם ה־lane ID, ה־dataspace ID, קבוצת המאמתים, סבילות התקלות, המניפסט, כללי הניתוב והבעלים התפעולי נבדקו יחד. חשבון משתמש רגיל בעל ההרשאות הנדרשות יכול לרכוש דומיין ואת חכירת ה־SNS שלו בתוך מרחב נתונים קיים באמצעות מתכנן הכינויים; הוא אינו יכול להוסיף בבטחה מרחב נתונים ציבורי חדש.

עבור חלל נתונים פרטי או ארגוני, להכין שינוי קטלוג עם:

- פרופיל שדה נתונים ייחודי ומספר `id`
- כניסה למסלול מתאימה או מינוי למסלול קיים
- חלל הנתונים `fault_tolerance`
- כללי הנתיב עבור ההוראות או קווי החשבון שצריכים לנחות שם
- מניפסט של ספריית מרחב או הוכחת שימוש מקבילה, כאשר מרחבי הנתונים חושפים יכולות UAID
- אישור השלטון למדיניות ההסמכה, התכנות, הסדר והטיפול.

פרגהנפקה קונפיגרציה שניתן לבחון נראה כך:

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

- `iroha3d --sora --config <config.toml> --trace-config` מעביר את הקונפיגורציה של העמודה המפתרת
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
