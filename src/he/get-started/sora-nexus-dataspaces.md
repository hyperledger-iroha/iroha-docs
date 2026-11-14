---
translation_locale: he
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 3d2285e5a27819897b6dcc6d165c468baead29d2922420728fcfbe2433d36fdd
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# פיתוח על גבי SORA Nexus: ‏Taira ו־Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA Nexus מספקת מסלולי פריסה ציבוריים הבנויים על Iroha 3. פתחו ותרגלו תחילה ב־Taira, ואז העבירו את אותה מתכונת לקוח ל־Minamoto רק כשיש לכם מפתחות נפרדים לרשת הראשית, XOR אמיתי לתשלום עמלות ואישור לסביבת הייצור.

מדריך זה מראה כיצד להגדיר לקוח Iroha עבור הרשתות הציבוריות של SORA Nexus:

- רשת בדיקת Taira ב- `https://taira.sora.org`
- רשת מרכזית Minamoto ב- `https://minamoto.sora.org`

השתמשו ב-Taira לבדיקות אינטגרציה, לבדיקות כתיבה הממומנות באמצעות faucet ולתרגילי פריסה. השתמשו ב-Minamoto רק לפעילות mainnet המוכנה לייצור. שתי הרשתות גובות עמלות ב-XOR:

- Taira משתמשת ב-XOR של רשת הבדיקה משירות ה-faucet הציבורי.
- Minamoto משתמשת ב-XOR אמיתי. אין שירות faucet ל-Minamoto.

## מסלול הבנייה {#builder-path}

|שלב |רשת הבדיקה Taira |הרשת הראשית Minamoto |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|התחילו בקריאת מצב הרשת |שאילתת `/status` ללא מפתחות |שאילתת `/status` ללא מפתחות |
| בחירת מרחב נתונים            | השתמשו ב־`universal` הציבורי, אלא אם היישום זקוק לנתיב הכפוף לממשל | השתמשו באותו מרחב נתונים רק לאחר אישור לשימוש ברשת הראשית |
|השיגו את נכס העמלה |השתמשו ב־faucet הציבורי של Taira |קבלו XOR מחשבון Minamoto ממומן או מתהליך treasury מאושר |
|בדקו פעולות כתיבה |השתמשו ב־XOR לבדיקה שמומן מהברז |אל תשתמשו בכלי בדיקה; פעולות כתיבה מוציאות XOR אמיתי |
|עברו לייצור |תרגלו לוגיקת ניסיון חוזר, ניטור וטיפול בחותם |השתמשו במפתחות, במימון ובבקרות שחרור נפרדים |

הזרימה המעשית היא:

1. פתחו את הלקוח מול Taira והשתמשו במרחב הנתונים הציבורי `universal`.
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

ב־SORA Nexus, קטלוג מרחבי הנתונים מגדיר מרחבי נתונים. קטלוג הנתיבים מגדיר נתיבים בנפרד: כל נתיב מפנה למרחב נתונים אחד, ולמרחב נתונים יכולים להיות כמה נתיבים. לקוח אינו יוצר מרחב נתונים ציבורי חדש רק באמצעות שינוי `client.toml`. הגדרת הלקוח עושה שני דברים:

1. מצביעים את הלקוח בנקודת הסיום הימנית Torii
2. בוחרת את הקשר הרשת ואת מפתח החתימה עבור החשבון הקנוני שלו

`AccountId` הוא תמיד קנוני ונטול דומיין, ול־`client.toml` אין הגדרת דומיין: `[account].profile` בוחר רק את קידומת I105 של הרשת. הקשר הדומיין שייך לכינויים ולאובייקטים שבבעלות דומיין. ברוב היישומים, התחילו במרחב הנתונים הציבורי `universal`. הקשר הדומיין משתמש בצורה `domain.dataspace`, למשל:

```text
wonderland.universal
```

אם דרוש לכם מרחב נתונים ארגוני חדש, הכינו הצעת קטלוג וניתוב במקום לנסות לרשום אותו מחשבון לקוח רגיל. ראו [הקצאת מרחב נתונים חדש](#_8-provision-a-new-data-space) להלן.

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

בדקו את תצוגת מרחבי הנתונים והנתיבים שהצומת חושף:

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

הגשר מקבל רק בקשות JSON-RPC מסוג `POST` ללא מצב. בדקו את מטא־נתוני הגילוי שלו לפני הוספת חומרי חתימה:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
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

- גיבוב העסקה
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

הציגו את נתיבי מרחב הנתונים הציבורי ש־Taira חושפת:

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
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

`chain` ברמה העליונה הוא מזהה שרשרת העסקאות המדויק של Taira, ו־`network_id` הוא זהות הרשת המדויקת שאליה נקשרת כל חתימה. הגדירו בדיוק אחד מבין `network_id` ו־`network_id_file`. ההגדרה `[account].profile = "taira"` בוחרת בנפרד את מבחין השרשרת I105 של Taira. מזהה השרשרת אינו בוחר את פרופיל החשבון.

תבדקו רק קריאה:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

לבצע את האבחנה הציבורית Taira לפני בדיקות כתיבה:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

מַמנו את חשבון Taira דרך הברז לפני הפעלת פעולות כתיבה המחייבות עמלה. תהליך הברז המוכן נמצא ב־[קבלת XOR לרשת הניסוי ב־Taira](#_4-get-testnet-xor-on-taira).

לאחר מימון החשבון, הוראת רישום ביומן חתומה היא בדיקת עשן אופציונלית לכתיבה. כל עסקה מוגשת מציינת את משלם העמלה שלה, וה־CLI מציג את העמלה המדויקת לפני החתימה:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

הפקודה ממתינה לאישור. Taira היא רשת ניסוי ציבורית, ולכן תור מלא עלול להכשיל את בדיקת הקישוריות גם כשהברז עצמו פועל. אם `taira doctor` מדווח על תור מלא או שבדיקת הקישוריות מחזירה `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, המתינו ונסו שוב לפני שתתייחסו לכך כשגיאת תצורה של הלקוח.

לבדיקות עשן ללא השגחה, עטפו את בדיקת הקישוריות בלולאת ניסיונות חוזרים מוגבלת:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

להפסיק לנסות מחדש אם `iroha taira doctor` מראה כישלונות קשים. סיפוק השורה והרחישה של הכניסה לתשלום הם תנאים עולמיים ברשתת המבחן הציבורית; DNS, TLS או `status = "fail"` אבחון לא.

## ליצור a SORA Nexus חשבון ID {#generate-a-sora-nexus-account-id}

מזהה חשבון של SORA Nexus הוא כתובת I105 קנונית הנגזרת מהמפתח הציבורי של החשבון ומקידומת רשת היעד. אותו מפתח ציבורי מקודד למזהים שונים ב־Taira וב־Minamoto, ומשתמשי סביבת הייצור צריכים ליצור זוג מפתחות נפרד ל־Minamoto.

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

השתמשו במזהה החשבון שנוצר בכל מקום שבו API או פקודת CLI של SORA Nexus מבקשים מזהה חשבון קנוני, למשל בשאילתות יתרה, בשדות חשבון מחמירים או בקישורי כינויים. שמרו את המפתח הפרטי התואם בתצורת הלקוח, ובחרו באותה רשת ציבורית באמצעות `[account].profile = "taira"` או `[account].profile = "minamoto"`.

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

בקשו XOR לרשת הניסוי באמצעות תהליך הברז המוכן של ה־CLI. הברז מממן את החשבון המוגדר ב־`taira.client.toml` ורושם אותו תחילה אם הוא עדיין אינו קיים. התהליך הוא:

1. קראו את מדיניות הברז הציבורית: סמכות הברז, נכס העמלות והסכום.
2. הכינו את הבקשה. ה־CLI פותר את הוכחת העבודה, מאמת את העסקה המדויקת ש־Torii מכין וחותם עליה, ושומר אותה בתיקיית יומן פרטית בלי להגיש אותה.
3. הגישו את העסקה השמורה פעם אחת.
4. המתינו עד שיתרת הנכס מוצגת לפני שליחת פעולות כתיבה המחייבות עמלה.

קראו את המדיניות:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

התגובה היא בצורת זו:

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

המדיניות היא נתוני גילוי לא חתומים. אוטומציה צריכה לקבע את הסמכות, הגדרת הנכס והסכום שהיא מצפה להם, במקום לסמוך על כל תשובה. `prepare` מסרב לעסקה מוכנה השונה מהערכים שאתם מעבירים.

הכינו את הבקשה והגישו אותה:

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` יוצר את תיקיית היומן עם גישה פרטית ומסרב להחליף תיקייה קיימת, לכן השתמשו בתיקייה חדשה לכל בקשה. הברז הוא שירות של רשת הניסוי הציבורית. אם `submit` מדווח על `Pending`, חורג מהזמן הקצוב או מקבל `502`, הריצו `taira account faucet resume` עם אותה תצורה ואותו יומן במקום להכין בקשה נוספת. עוגן מיושן של הוכחת עבודה מכשיל את `prepare`; הכינו שוב בתיקיית יומן חדשה.

לאחר מכן סקר עבור הנכס המיועד לפני שתשלח את העסקאות שלך של תשלום עמלות:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

אם הבקשה הוחלה אך הנכס עדיין אינו מוצג, המתינו ונסו שוב לקרוא לפני שליחת פעולות כתיבה.

שירות המימון מיועד לכספי רשת הבדיקה של Taira בלבד. אל תשתמשו ב־XOR של רשת הבדיקה, בחשבונות של שירות המימון או בחותמי הקנרית של Taira בתהליכי Minamoto.

## 5. ליצור תיקון לקוחות Minamoto {#_5-create-a-minamoto-client-config}

השתמשו בזוג מפתחות נפרד עבור Minamoto. אל תשתמשו מחדש במפתחות Taira ברשת הראשית.

ליצור `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

`chain` ברמה העליונה הוא מזהה השרשרת הנוכחי של הרשת הראשית של SORA Nexus, ו־`network_id` הוא זהות הרשת המדויקת של Minamoto; קראו אותה ממסלול היכולות לפני הפעולה החתומה הראשונה. `[account].profile = "minamoto"` בוחר את מבחין השרשרת I105 של Minamoto; שם המארח של נקודת הקצה ומזהה השרשרת אינם בוחרים אותו במשתמע.

להמיר מפתח ציבורי Minamoto לחשבון קנוני שלו I105 ID עם מקוד הרשת המרכזית:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

תפעילו רק בדיקות בצד קריאה עד שהחשבון יועבר ויימומן באמצעות הזרימת ה-mainnet או זרימת השלטון:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

אל תפעילו את פקודות הברז או בדיקות העשן של Taira מול Minamoto.

## 6. מימון חשבון Minamoto ב- XOR {#_6-fund-a-minamoto-account-with-xor}

דמי Minamoto משולמים עם ייצור XOR, ו- Minamoto אין לו faucet ציבורי. לממן את החשבון המוגדר באמצעות חיבור ברשת המרכזית או העברת כספים מאושרים, או לקבל XOR מחשב Minamoto מיומן קיים.

אמתו את ה־account ID הקנוני ואת המימון באמצעות בדיקות לקריאה בלבד לפני הגשת כתיבה. התייחסו ל־Minamoto XOR כאל כספי ייצור: תרגלו תחילה את אותה פעולה ב־Taira, שמרו מפתחות ייצור נפרדים ואל תניחו שאפשר לאפס עסקה ברשת הראשית.

Taira XOR לא יכול לשלם עמלות Minamoto. סולכות רשתות הבדיקה ודרשות למזרזים אינן מועברות ל Minamoto.

## 7. עבודה בתוך מרחב נתונים קיים {#_7-work-inside-an-existing-data-space}

השתמשו בשמות דומיין מלאים עבור אובייקטים בספר החשבונות הנמצאים במרחב נתונים. למשל, דומיין של פרויקט במרחב הנתונים הציבורי צריך להשתמש ב־:

```text
apps.universal
```

לאחר שהחשבון שלך יש את הרשיונות הנדרשים, ליצור כוונה ללא סוד `AliasSetupPlanRequestV1` עבור הדומיין ולהשתמש בתכנן ההצהרה:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

עבור Minamoto, ליצור ולאשר כוונה ותוכנית מרכזית נפרדות. התוכניות קשורות למגוון, סמכות, מעגל של מצב החיים שלהם, ומוקד, כך שתכנית Taira לא יכולה להיות מובילה או משחזרת:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

כינויי חשבונות משתמשים באותה סיומת של מרחב נתונים:

```text
alice@apps.universal
alice@universal
```

שדות חשבון קפדניים עדיין משתמשים בחשבון קנוני I105 IDs. מתייחסים לכינויים כקשרים שניתן לקרוא על ידי אדם אשר מתפתחים לחשבון קנוני IDs.

## 8. הקצאת מרחב נתונים חדש {#_8-provision-a-new-data-space}

יצירת מרחב נתונים חדש היא שינוי תפעולי וממשלי. נקודת הקצה הציבורית של Torii יכולה לנתב תעבורה למרחבי נתונים מוגדרים, אך היא תדחה כינויים לא מוכרים של מרחבי נתונים.

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

אל תקדמו כינוי חדש אלא אם מזהה הנתיב, מזהה מרחב הנתונים, קבוצת המאמתים, סבילות התקלות, המניפסט, כללי הניתוב והאחראי התפעולי נבדקו יחד. חשבון משתמש רגיל בעל ההרשאות הנדרשות יכול לרכוש דומיין ואת חכירת ה־SNS שלו בתוך מרחב נתונים קיים באמצעות מתכנן הכינויים; הוא אינו יכול להוסיף בבטחה מרחב נתונים ציבורי חדש.

עבור מרחב נתונים פרטי או ארגוני, הכינו שינוי קטלוג הכולל:

- כינוי ייחודי למרחב הנתונים ו־`id` מספרי
- כניסה למסלול מתאימה או מינוי למסלול קיים
- ערך `fault_tolerance` של מרחב הנתונים
- כללי הנתיב עבור ההוראות או קווי החשבון שצריכים לנחות שם
- מניפסט של ספריית המרחבים או ראיות פריסה מקבילות, כשהמרחב חושף יכולות UAID
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
instruction = "transfer::asset"
description = "Route asset transfers to the payments dataspace"
```

קבלה של המפעיל צריכה לכלול את השערים הבאים:

- `iroha3d --sora --config <config.toml> --trace-config` מעביר את הקונפיגורציה של העמודה המפתרת
- המניפסט שנוצר או הוחזר מאורכיב עם חישובים וחתימות.
- מבחני עשן עוברים על Taira לפני כל קידום Minamoto
- קטלוג `/status` לאחר השינוי מציג את הנתיב ומרחב הנתונים המיועדים
- `iroha app nexus lane-report --summary` לא מדווח על חוסר מסמכים נדרשים.

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

קדמו את אותו מרחב נתונים ל־Minamoto רק לאחר השלמת הפריסה ב־Taira, בדיקות העשן, הניטור וראיות הממשל.

## דפים קשורים {#related-pages}

- [להתקין Iroha 3](/he/get-started/install-iroha.md)
- [פעל Iroha 3 באמצעות CLI ](/he/get-started/operate-iroha-via-cli.md)
- [מימון עמלות עבור מרחב נתונים פרטי](/he/get-started/private-dataspace-fee-sponsor.md)
- [נקודות קצה Torii ](/he/reference/torii-endpoints.md)
- [דף בראשית](/he/reference/genesis.md)
