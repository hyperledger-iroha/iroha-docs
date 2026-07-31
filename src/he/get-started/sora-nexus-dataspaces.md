---
translation_locale: he
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# נמשיך. SORA 3: Taira ו Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 הוא מסלול הפעלת ציבורי המופנה אל אפליקציות בנוי על Iroha 3 ו SORA
Nexus. לבנות ולחזור על Taira ראשית, ואז להזיז את אותו צורת הלקוח
ל Minamoto רק כאשר יש לך מפתחות מרכזיות נפרדות, אמיתיים XOR עבור תשלום,
אישור הייצור.

הדרכה זו מראה איך להגדיר Iroha לקוח לציבור SORA 3
רשתות:

- Taira רשת בדיקת `https://taira.sora.org`
- Minamoto יצרן `https://minamoto.sora.org`

שימוש Taira בדיקות אינטגרציה, קנריות כתיבה ממומנות על ידי מכשירים, ו
תרגילים של הפעלת. Minamoto רק עבור הרשת הראשית מוכנה לייצור
פעילות. XOR:

- Taira משתמש ב-testnet XOR מהפנק הציבורי.
- Minamoto משמשים אמיתיים XOR. אין. Minamoto גלישה.

## כביש הבניין {#builder-path}

| צעד                        | Taira רשת מבחן                                                | Minamoto מרכזית                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| התחל לקרוא מצב הרשת | שאלה `/status` ללא מפתחות                                 | שאלה `/status` ללא מפתחות                       |
| בחר חלל נתונים            | שימוש ציבורי `universal` אלא אם כן האפליקציה שלך זקוקה למסלול מנוהל | השתמשו באותו חלל נתונים רק לאחר אישור הרשת המרכזית |
| קבלו נכס תשלום               | השתמשו בציבור Taira פנקס                                  | קבל XOR מ- Minamoto זרימת החשבונות או הזרימת הכספת המאושרת |
| בדיקת כותבים                 | השתמשת בניסוי המיועד למזרים XOR                                   | אל תשתמשו במכשירים בדיקות; כתבים מבזבזים כסף אמיתי XOR     |
| קידום                     | נסה שוב את ההיגיון, מעקב וניהול סימנים            | השתמשו במפתחות נפרדות, בקרת מימון ושיחרור   |

הזרימה המעשית היא:

1. לבנות את הלקוח נגד Taira ושימשו את הציבור `universal` חלל נתונים.
2. הוסף חותם ולממן אותו עם Taira גלישה.
3. תפעיל את ההיגיון של האפליקציה שלך Taira עד כישלונות הם משעממים
   ניתן לראות.
4. ליצור חלקה נפרדת Minamoto חותם, לממן אותו עם אמיתי XOR, ונוסעים רק
   את אותן פעולות מוכחות למייננט.

## 1. להבין את מה שאתה מתכנן {#_1-understand-what-you-are-setting-up}

ב SORA Nexus, מרחב נתונים הוא חלק מקוון הרשת וקטלוג הנתיב.
לקוח לא יוצר חלל נתונים ציבורי חדש רק על ידי שינוי
`client.toml`. הקמת הלקוח עושה שני דברים:

1. מצביע על הלקוח ימינה Torii נקודת סוף
2. בוחן את ההקשר של מסלול השטח נתונים ושל תחום דומיין עבור החשבון הקנוני שלו

`AccountId` הוא תמיד קאנוני ובלתי תחום. `[account].domain` הערך
`client.toml` הוא מספק את ההקשר של הנתיב והכותרת; הוא לא הופך לחלק
זהות החשבון. עבור רוב היישומים, תתחיל עם הציבור
`universal` מרחב נתונים. `domain.dataspace` טופס, עבור
דוגמה:

```text
wonderland.universal
```

אם אתה זקוק למרחב נתונים ארגוני חדש, תכין קטלוג ומסלול
הצעה במקום לנסות להירשם ממחשב לקוח רגיל.
תראו. [אספקת חלל נתונים חדש](#_8-provision-a-new-dataspace) למטה.

## 2. בדוק את הציבור Torii נקודת סוף {#_2-check-the-public-torii-endpoint}

בדוק אם נקודת הסיום היעד היא חי לפני להגדיר חותם.

עבור Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

עבור Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

בדוק את חלל הנתונים והצפייה של המסלול שחשפה על ידי הערך:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

השתמש באותו פקודה עם `https://minamoto.sora.org/status` למייננט.

## Taira MCP עבור סוכנים {#taira-mcp-for-agents}

Taira גם מגלה Torii-הפרוטוקול ההקשר המודל האלימי (MCP) גשר עבור
להשתמש בו כאשר הסוכן צריך חי טסטנט קורא, תסריט
אבחון, או בדיקה מחוקקת של חזרות כתיבה ללא בניית מנהג
Torii הלקוח ראשון.

| הגדרות | ערך |
| --- | --- |
| MCP נקודת סוף | `https://taira.sora.org/v1/mcp` |
| שורש רשת | `https://taira.sora.org` |
| השימוש המכוון | Taira קריאת רשתות מבחן וניסיון כתיבה מיומן על ידי פנקס |
| סכום ייצור | אל תכוון את הכתיבה הזו ל Minamoto אלא אם כן רשת מרכזית MCP בדיקות נקודת הסיום והשחרור מאושרות באופן מפורסם. |

בדוק את הנתונים המעטה של הגשר לפני שתוסיף חומר חתום:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

להגדיר את URL כמשתמשים מקומיים MCP סרבר בזמן הפעלת הסוכן.
סוכן מחויבות MCP קונפיג, API טוקנים, כותרות מחברים מועברות, `authority`, או
`private_key` הערכים לתוך דוקס repo או דוקס אפליקציה.

סוכן פוטנציאל כללים שעובדים היטב עם Taira:

- תגלה כלים MCP שרת לפני שיקראו להם;
  דו"חות השרת `listChanged`.
- מעדיפים את הקוריט `iroha.*` כלים על חומריהם `torii.*` כלים.
- תתחילו לקרוא רק: לבדוק מצב, חשבונות, נכסים, שם כינוי, בלוקים,
  מצב הממשל, ומצב העסקה לפני הצעת הכתבות.
- תדרשו הוראות אנושיות מפורשות לפני מוטציות ברשתת הבדיקה חיות.
  חותמות עסקאות חתומות מראש, שימוש `iroha.transactions.submit_and_wait`
  אז הסוכן מחכה לתוצאה במקום רק להגיש.
- לסכם את ה- hashs של העסקאות, מצב סופי וטעויות אישור שרת ב
  התגובה של הסוכן.

### זרימת עבודה של פיתוח עם סוכנים {#development-workflow-with-agents}

השתמשו בסוכנים כעוזרי פיתוח Iroha לקוחות, יצרני עסקאות,
תסריטים דיאגנסטיים, וספרים של רשתות מבחן.
זה יכול לבדוק קוד, לקרוא Taira המדינה, להציע שינויים, ולנהל בדיקות מקומיות,
אבל זה לא צריך לשנות רשת חיה עד שאדם מאשר את הנקודה המדויקת
מבצע.

זרימת עבודה מעשית היא:

1. תבקשי מהסוכן לבדוק את הדוקוס הרלוונטיים, SDK קוד, CLI פיקוד, או MCP
   שמה של הכלים לפני שהוא כותב קוד.
2. תגיד לסוכן לכתוב את הדרך הקלינט הקטנה ביותר קודם: בודקת מצב, חשבון
   חיפוש, כביכול החלטה או חיפוש איזון.
3. הוספת קוד בניית עסקאות רק לאחר שיחות קריאה בלבד פועלות נגד
   Taira.
4. שמרו על בדיקות רשתות חיות, למשל מאחורי `TAIRA_LIVE=1`, אז א
   מבחן יחידה נורמלי לא מוציא כספי רשתת הבדיקה או תלוי ברשת
   זמינות.
5. תדרש מהסוכן לדווח על שורש הרשת, שרשרת, חשבון הרשויות,
   סיכום ההוראות, נכס הוצאות, ושינוי מצב צפוי לפני שהוא מספק
   כל עסקאות.
6. ביקורת קוד שנוצר לניהול סודי, ניסוי מחדש של התנהגות, אי-ידמפוטנטיות,
   ניהול דחייה לפני קידום CI או זרמי עבודה ממשי.

שימושי רק לקריאה MCP כלים לפיתוח כוללים חיפוש נכסים בחשבון,
פרופיל פתרון, חיפוש בלוק, חיפוש עסקאות, רשימות עסקאות, ו
בדיקות מצב של צינורות.
חומץ מועיל חתום.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### זרימת עבודה של עסקאות באמצעות סוכנים {#transaction-workflow-through-agents}

ה- MCP גשר יכול להגיש חתימה Iroha עסקה, אבל זה לא מסיר
הדרישות הרגילות של העסקה.
סמכות, רשיונות, מימון עלות, שרשרת ID, מטא-מנתונים, וחתום.

עבור חומרי Iroha עסקים, ליצור וחתום על מעטפת העסקה עם
SDK או CLI ראשית, ואז תן לסוכן רק את העסקה הקנונית חתומה
בייטים מקודדים כ `body_base64`. הסוכן יכול להגיש את המעטפה
`iroha.transactions.submit_and_wait`, או להגיש עם
`iroha.transactions.submit` ובדיון עם `iroha.transactions.wait`.

אל תדביקי מפתחות פרטיות לתוך פנייה של סוכן. אם הסוכן צריך לבנות
העסקה, מכוון אותו לקוד מקומי שמטען סודות מהזמן ההפעלה של המשתמש
הסביבה, שרשרת מפתחות, חותם חומרי או תיק ההסדר של testnet
הסוכן לעולם לא צריך לכתוב את החומר המרכזי לתוך מרקדון, ציוד, היומן, או
מחייב.

לפני שתשלח עסקאות, תגרום לסוכן לבצע עסקה קצרה
תוכנית:

- `network`: Taira שורש ושרשרת רשת המבחן ID
- `authority`: חשבון אשר חותם ומשלם עמלות
- `instructions`: רישום, מנטה, שריפה, העברת נתונים מטאטא, אישור, או
  סיכום שיחת ההזמנה
- `fee asset`: נכס אשר יועיל על Taira
- `preflight reads`: חשבון, תיק הנכסים, רשיונות, שם כינוי או בלוק
  בדיקות שכבר נעשו
- `expected result`: מצב אשר צריך להיות נראה לאחר אישור
- `idempotency`: מה קורה אם אותו בקשה נבחן שוב?

לאחר ההשלוח, לגרום לסוכן לחכות למצב של סגור, ואז לאמת את
שינוי מצב עם בקשה קריאה. דו"ח השלמת שימושי כולל:

- השטר של העסקה
- מצב סגור כגון: `Committed`, `Applied`, `Rejected`, או `Expired`
- פרטים של בלוק או חוקר, כאשר הם זמינים
- תוצאות קריאת הנתונים
- הודעת דחייה והאם ההפסד נראה כמו רשיונות, סכומים,
  אישור, מצב קבוע או זמינות נקודת הסיום

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

טיפול Taira MCP כשטח בקרה ציבורי של רשתת מבחן. Taira מפתחות, רשת מבחן XOR,
החשבונות של גלילות, וחתמי קנריה הם זורמים
Minamoto מפתחות ותנועות עבודה של פשיטת רגל הייצור.

## דוגמאות צעצועים שאתה יכול לנסות עכשיו {#toy-examples-you-can-try-now}

דוגמאות אלה הן קריאה בלבד, אלא אם כן צוין. הם עובדים לפני שאתה מייצר
המפתחות ובטוחים להילחם בשתי הרשתות הציבוריות.

השוואה Taira רשת מבחן ו Minamoto בריאות הרשת:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

רשימה של מסלול הנתונים הציבורי חשוף על ידי Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

תפעיל את אותה פקודה נגד Minamoto כאשר אתה זקוק לתצוגת הרשת המרכזית:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

תבנה קטן. Node.js אנרוגת מצב עבור לוח המעקב, בוט או פיתוח
בדקה:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`).then((res) => res.json());
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

הצעצוע הראשון עם הצד של כתיבה צריך להיות Taira תביעה של גלישה.
XOR ואף פעם לא צריך להצביע על Minamoto.

## 3. ליצור Taira קונפיגריית הלקוח {#_3-create-a-taira-client-config}

ליצור זוג מפתחות אם עדיין אין לך אחד:

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

הרמה העליונה `chain` זה בדיוק Taira שרשרת עסקאות ID. ה-
`[account].profile = "taira"` הגדרת בוחרת באופן עצמאי את Taira I105
מסלול מגדיר. ID לא בחר את פרופיל החשבון.

תבדקו רק קריאה:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

לנהל את הציבור Taira אבחון לפני בדיקות כתיבה:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

מימון Taira חישוב דרך המזרקה לפני שאתה מפעיל כתבות תשלום.
זרימת המזרקה ישירה היא
[קבל Testnet XOR על Taira](#_4-get-testnet-xor-on-taira).

לאחר שהביקוי על המנקה מקובל והחשבון מיומן, Taira
קנרי הוא בדיקת עשן כתיבה אופציונלית:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

הקנרי שולח פינג חתום, מחכה לאישור, וכתוב את
קונפיגציה של סימן זמן הפעלה כאשר `--write-config` הוא מספק. Taira הוא ציבורי.
רשת מבחן, כך שסיפוק בתור יכול לגרום ל-ping חתום להיכשל גם כאשר
הפלט עצמו עובד. `taira doctor` מדווחים על שורה מלאה או
משוב קנרי `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, לחכות ולנסות שוב לפני
לטפל בו כטעיה בהקנה של הלקוח.

עבור בדיקות עשן ללא פיקוח, סובב את הקנרי במעגל חוזר מוגבל:

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

תפסיק לנסות שוב אם `iroha taira doctor` מראה כישלונות קשים.
דחיית הכניסה לתשלום הן תנאים עתידיים של רשתת מבחן ציבורית; DNS,
TLS, או `status = "fail"` האבחנה לא.

## ליצור א SORA Nexus חשבון ID {#generate-a-sora-nexus-account-id}

א SORA Nexus חשבון ID הוא קנוני I105 הכתובת המוצאת מה
המפתח הציבורי של החשבון והפרופיקס של הרשת המטרה.
`[account].domain` ערך לקוח TOML. אותו מפתח ציבורי מקודד
שונה IDs על Taira ו Minamoto, ושתמשי הייצור צריכים לייצר
צמד מפתחות נפרד עבור Minamoto.

ליצור או לטעון את מספר מפתחות Ed25519 אשר ישלטו על החשבון:

```bash
kagami keys --algorithm ed25519 --json
```

הפוך את המפתח הציבורי ל Taira חשבון ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

הפוך a Minamoto מפתח ציבורי עם הפריפיקס למיינט:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

השתמשו בחשבון המוצא ID בכל מקום Nexus API או CLI הפיקוד מבקש
חשבון קנוני ID, לדוגמה, Taira פנקס `account_id`, משקל
שאלות, שדות חשבונות קפדניים או חיבורים תחת השם.
מפתח פרטי בהסדרת הלקוח שלך, ולבחור את אותה רשת ציבורית עם
`[account].profile = "taira"` או `[account].profile = "minamoto"`.

יצירת ID לא יוצר בעצמו חשבון מסלול מימון.
Taira, המבר יכול ליצור ולממן את החשבון של testnet כותבים.
Minamoto, השתמשו בהקמת רשת מרכזית או זרימת כספית מוסמכת.

### אחסון המפתחות וגיבוי {#key-storage-and-backup}

החשבון ID המפתח הציבורי יכול להיות משותף.
סיסמה, זרעים וחומר התאוששות חייבים להיות סודיים.

השתמשו בשיטות אלה SORA Nexus חשבונות:

- שמור מפתחות פרטיות במנהל סיסמה מוצפן, בעזרת חומרה
  חנות מפתחות, או שירות חתימה ייחודי.
  לשלוט או להשאיר מפתחות הייצור בהיסטוריה של הקסדה, מעקב, צ'אט, כרטיסים,
  או גיבוי לא מוצפן.
- השתמשו במשפט סיסמה ייחודי עם אנטרופיה גבוהה עבור כל כספת או חותם הייצור.
  שמור סיסמאות במנהל סיסמה או בתהליך אחסון חלקי, לא
  אותו הקובץ או חבילת גיבוי כמו המפתח הפרטי המשולפן.
- שמרו Taira ו Minamoto המפתחות נפרדות. Taira מפתחות ככיסוי חד פעמי
  חומר רשתת מבחן ו Minamoto מפתחות כחלקת כספי הייצור.
- גיבוי מפתח פרטי, מפתח ציבורי, חשבון ID, פרופיל החשבון, וכל
  רשימת החזרות או הערות אחסון החשבון הנדרשות כדי להחזיר את המחתם.
  מפתח ללא ההקשר של הרשת הוא קל לשימוש לרעה במהלך התאוששות.
- שמרו על לפחות גיבוי אחד מוצפן מקוון ואחד גיאוגרפי.
  גיבוי מוצפן נפרד עבור חתימות הייצור.
  פעילות קטנה רק קריאה לפני תלוי באחוז.
- סובב או תחליף חותם אם המפתח הפרטי, סיסמה, מדיה גיבוי,
  או שהארח החותם היה חשוף.

לפרטים נוספים, ראה
[אחסון מפתחות קריפטוגרפיים](/he/guide/security/storing-cryptographic-keys.md)
ו [אבטחת סיסמה](/he/guide/security/password-security.md).

## 4. קבל Testnet XOR על Taira {#_4-get-testnet-xor-on-taira}

השתמש במברקה הציבורית ישירות.

1. ליצור או להטען חתימה ולחושב את הקנוניקה שלה Taira חשבון ID.
2. תביא את הפאזל הנוכחי.
3. לפתור את הפאזל אם `difficulty_bits` הוא גדול יותר `0`.
4. תגיש את בקשת המנקה.
5. חכו עד ששלוח החשבון או סולן הנכסים ייראה לפני שישלחו
   שכר תשלום כותב.

להפוך מפתח ציבורי Taira I105 חשבון ID צפוי על ידי המזרקה:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

תביא את הפאזל.

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

המבר הוא שירות רשתת מבחן ציבורית.
החזר `502`, זמן, או טעות אחרת ברמה של שער, לחכות ולנסות שוב
לפני שתשנה את המפתחות שלך או את הקונפיגציה של הלקוח.

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

מתי? `difficulty_bits` הוא `0`, להגיש רק את החשבון ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

מתי? `difficulty_bits` הוא גדול יותר `0`, לפתור את הפאזל ולהכלל
גובה הנשר+נצ'ה:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

האלגוריתם של הפאזל הוא:

1. לבנות את האתגר כמו SHA-256 מעל:
   - בייטים של `iroha:accounts:faucet:pow:v2`
   - ה- UTF-8 חשבון ID
   - `anchor_height` כמו "אנדיאן הגדול" `u64`
   - `anchor_block_hash_hex` פותח כבייטים
   - `challenge_salt_hex` פותחים כבייטים, כאשר הם קיימים
2. נסה. `u64` נונצ'ס מוצפן כערכים של 8 בייטים גדולים.
3. עבור כל ספריה, תפעיל סקרפט עם:
   - סיסמה: ה-8-בייט
   - מלח: האתגר של 32 באייט
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - אורך ההוצא: 32 בייטים
4. הנקודה המנצחת היא ההזיהום הראשון עם לפחות `difficulty_bits`
   המוביל לציפור.

תגובה למפלט כוללת את הנכס המיועד וההש של העסקות במצבים:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "asset_id": "...",
  "amount": "25000",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

התשובה מובילה כיום HTTP `202 Accepted`. הנכס
הגדרה ID למעלה הוא Taira נכס תשלום המימון על ידי המברקה הציבורית.
פנקת קיבלה את הבקשה כאשר היא חוזרת `tx_hash_hex` ו
`status: "QUEUED"`.

אז סקר עבור הנכס המיועד לפני שתשלח את תשלום השכר שלך
עסקאות:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

אם דרישה למברקה התקבלה אך החשבון או הנכס אינם נראים
עם זאת, העסקה עדיין מאחורי עיבוד המערכת הציבורית.
ונסו שוב לקרוא לפני שישלחו מכתבים.

עבור ישר מוכן לזרוע API צ'ק, שמור את זה כ `taira_faucet_claim.py`
וקיבל את Taira I105 חשבון ID:

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

with urllib.request.urlopen(f"{root}/v1/accounts/faucet/puzzle") as res:
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
    headers={"content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

הפלט הוא רק עבור Taira כספי טסטנט. אל תשתמשו בטסטנט XOR, גלישה
חשבונות, או Taira חתימות קנריות Minamoto זורמים.

## 5. ליצור Minamoto קונפיגריית הלקוח {#_5-create-a-minamoto-client-config}

השתמשו בשני מפתחות נפרדים Minamoto. לא להשתמש שוב Taira מפתחות לרשת הראשית.

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

הרמה העליונה `chain` הוא הזרם Nexus שרשרת מרכזית ID.
`[account].profile = "minamoto"` בוחרת את Minamoto I105 שרשרת
הגדלה; שם המארח של נקודת הסיום ואת שרשרת ID אל תבחרו אותו באופן מעורפל.

הפוך a Minamoto מפתח ציבורי לתוך הקנוניקה שלו I105 חשבון ID עם
מקודד ה-mainnet:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

תפעילו רק בדיקות לציון עד שהחשבון ייעצר ויימומן
באמצעות זרימת ה-onboarding או ה- governance של הרשת המרכזית:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

אל תפעיל את Taira מכשיר כביסה או סיוע כתיבה נגד Minamoto.

## 6. מימון Minamoto חשבון עם XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto דמי הוצאות משלמים עם הייצור. XOR, ו Minamoto אין ציבור
אספקה: לממן את החשבון המוגדר באמצעות חיבור ברשת הראשית המאושרת
או העברת כספים, או קבלת XOR ממערכת מימון קיימת Minamoto
חשבון.

בדוק את החשבון הקנוני ID והמימון עם בדיקות קריאה בלבד לפני
להגיש כתב. Minamoto XOR כמימון הייצור:
אותה פעילות על Taira ראשית, לשמור על מפתחות ייצור נפרדות, ולא
נניח כי עסקה ברשת הראשית יכולה להיעזר מחדש.

Taira XOR לא יכול לשלם Minamoto דמי סכום: סולדים של רשתות המבחן ודרישות למזרקה
לא הועבר Minamoto.

## 7. עבודה בתוך חלל נתונים קיים {#_7-work-inside-an-existing-dataspace}

השתמשו בשמות דומנים מוסמכים לחלוטין עבור אובייקטים של ספר הספרות החיים בתוך
ספסל נתונים. לדוגמה, תחום פרויקט בשטח נתונים ציבורי צריך
שימוש:

```text
apps.universal
```

לאחר שחשבון שלך יש את הרשאות הנדרשות, ליצור סוד חופשי
`AliasSetupPlanRequestV1` כוונה לתחום ושימוש בתכנן ההצהרה:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

עבור Minamoto, ליצור ומסכים על כוונה ותוכנית מרכזית נפרדת.
הם קשורים שרשרת שלהם, סמכות, מעגל של המדינה חי, ומקבילות, כך
Taira תכנית לא ניתן לקדם או לשחזר:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

שם-השם של חשבונות משתמשים באותו תקיפה של מרחב נתונים:

```text
alice@apps.universal
alice@universal
```

שדות חשבון קפדניים עדיין משתמשים בקנוניקה I105 חשבון IDs. מטפלת בשמה
כקשרים שניתן לקרוא על ידי אדם אשר מתפתחים לרישום קנוני IDs.

## 8. סיפקת חלל נתונים חדש {#_8-provision-a-new-dataspace}

מרחב נתונים חדש הוא מפעיל ושינוי בשליטה. Torii
נקודת הסיום יכולה להעביר את התנועה למרחבי נתונים מותאמים, אבל היא תסרב
פרופילים לא ידועים למרחב נתונים.

לפני שאתה מכין שינוי, קלט את הקייטלוג הנוכחי חי:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

עבור חשבון מפעיל, בדוק גם את תנוחת מסמן המסלול:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

אל תפרסם שם שמה חדש אלא אם כן המסלול ID, מרחב נתונים ID, קבוצת מבטיחות,
סובלנות לתאומים, מוניסט, כללי הנתיב, ובעלי הפעולה
חשבון משתמש רגיל עם הרשאות הנדרשות יכול
רכישת תחום ו SNS השכרה בתוך חלל נתונים קיים באמצעות
התכנן alias; זה לא יכול להוסיף בבטחה חלל נתונים ציבורי חדש.

עבור חלל נתונים פרטי או ארגוני, להכין שינוי קטלוגי עם:

- פרופיל חלל נתונים ייחודי ומספרי `id`
- כניסה למסלול מתאימה או מינוי למסלול קיים
- חלל הנתונים `fault_tolerance`
- כללי הנתיב עבור ההוראות או תחומי החשבון שצריכים לנחות
  שם
- מוניסט של מדריך החלל או ראיות גלויות למשיכה, כאשר
  נתונים מתחשפים UAID יכולות
- אישור השלטון עבור מבקש, תמימות, הסדר ופיקוח
  מדיניות

קטע של ההסדרות שניתן לבחון נראה ככה:

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

- `irohad --sora --config <config.toml> --trace-config` עובר על
  קונפיגורת הערך פתר
- המניפסט שנוצר או הוחזר מאורכיב עם חישובים וחתימות.
- בדיקות עשן עוברות Taira לפני כל Minamoto קידום
- לאחר השינוי `/status` קייטלוג מראה את המסלול הנדרש ומרחב הנתונים
- `iroha app nexus lane-report --summary` לא מדווח על חוסר נדרש
  מסמכים

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

לקדם את אותו מרחב נתונים ל Minamoto רק לאחר Taira הפעלת,
בדיקות עשן, מעקב וראיות של ממשל הם מלאים.

## דפים קשורים {#related-pages}

- [תקין Iroha 3](/he/get-started/install-iroha.md)
- [פעלת Iroha 3 דרך CLI](/he/get-started/operate-iroha-via-cli.md)
- [דמי תמיכה למרחב נתונים פרטי](/he/get-started/private-dataspace-fee-sponsor.md)
- [Torii נקודות סוף](/he/reference/torii-endpoints.md)
- [תיקון בראשית](/he/reference/genesis.md)
