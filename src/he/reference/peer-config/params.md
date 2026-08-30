---
translation_locale: he
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# פרמטרים של הגדרות {#configuration-parameters}

טוקס

## רמת שורש {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

שרשרת ID שחייבת להיות מובילה בכל עסקאות.

מתקפה חוזרת היא ניסיון להגיש עסקאות תקיימות לרשת אחרת מאלה שנועדו אליה. מכיוון ש`chain` הוא חלק מהחוב מועיל של העסקה חתומה, עסקה חתומה עבור שרשרת אחת נדחה על ידי עמיתים שמשתמשים בשורה אחרת ID .

<param-table type=string env=CHAIN />

::: code-group

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

מפתח ציבורי של השותף. משותפים בדיקת הסכמה חייבים להשתמש BLS - מפתחות נורמליות.

<param-table type="public-key" env="PUBLIC_KEY" />

::: code-group

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

מפתח פרטי של השותף. הוא חייב להתאים `public_key`; משותפים בדיקת ההסכמה חייבים להשתמש BLS-מפתחות נורמליות.

<param-table type="private-key" env="PRIVATE_KEY" />

::: code-group

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

רשימה של עמיתי אמון מוגדרת מראש.

בדיקות הסכמה צריכות להשתמש BLS-נורמליות מפתחות שווים. עבור כל מבדיקת, גם לספק כתיבה מתאימה [`trusted_peers_pop`](#param-trusted-peers-pop).

<param-table env="TRUSTED_PEERS">
<template #type>

סדרה של חוטים משותפים. השתמש `PUBLIC_KEY@ADDRESS` כאשר הכתובת P2P ידועה; נטול `PUBLIC_KEY` גם מקובל ומאפשר לכתובת השותף להיות מופגנת מהשמועות.

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers = [
    "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
    "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338",
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS='[
  "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
  "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338"
]'
```

:::

### `trusted_peers_pop` {#param-trusted-peers-pop}

BLS רשומות של הוכחת רכוש עבור עמיתים אמינים לבדיקן.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

קו של אובייקטים עם שדות `public_key` ו `pop_hex`

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers_pop = [
  { public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2", pop_hex = "8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08" },
  { public_key = "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77", pop_hex = "a14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913" },
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS_POP='[
  {"public_key":"ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2","pop_hex":"0x8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08"},
  {"public_key":"ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77","pop_hex":"0xa14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913"}
]'
```

:::

## בראשית {#genesis}

### `genesis.file` {#param-genesis-file}

נתיב הקובץ למשאב שימושי של בלוק ההתחלה חתום שנוצר על ידי `kagami genesis sign`. פרופילים נוצרים בדרך כלל כותבים את זה כמו קובץ Norito `.nrt`.

<param-table type="file-path" env="GENESIS" />

::: code-group

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

מפתח ציבורי של זוג המפתחות הגנזיס.

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: code-group

```toml [Config File]
[genesis]
public_key = "ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

```shell [Environment]
GENESIS_PUBLIC_KEY="ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

:::

## רשת {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

כתובת לתקשורת p2p לצורך הסכמה (sumeragi) וסינכרון בלוק (בלוק_sync).

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: code-group

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

כתובת משותף לשותף (חוץ, כפי שנראה על ידי עמינים אחרים).

הם יתווכחו לעמיתיהם הקשורים כדי שהם יוכלו להתווכחים על זה לעמיתים אחרים.

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: code-group

```toml [Config File]
[network]
public_address = "0.0.0.0:5000"
```

```shell [Environment]
P2P_PUBLIC_ADDRESS=0.0.0.0:5000
```

:::

### `network.block_gossip_size` {#param-network-block-gossip-size}

כמות הבלוקים שניתן לשלוח בהודעה אחת של סינכרון.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

הפער הזמן בין בקשות לעמיתים על הבלוק האחרון.

בדיחות תכופות יותר מקצרות את הזמן להתקשר, אבל זה יכול לפחז את הרשת.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

מספר מקסימום של עסקאות בהודעת רווחה.

גודל קטן יותר מוביל לזמן ארוך יותר של סינכרון, אבל שימושי אם יש לך אובדן חבילות גבוה.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

תקופה של דברי רודפים עד עסקה בין עמיתים.

בדיחות תכופות יותר מקצרות את הזמן להתקשר, אבל זה יכול לפחז את הרשת.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

משך הזמן שאחריו הקשר עם השותף יפסק אם השותף אינו עובד.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

כתובת שהשרת Torii חייב להקשיב אליה והלקוח (ים) מבקש את זה.

<param-table type=socket-addr env=API_ADDRESS />

::: code-group

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

מספר המקסימום של בייטים בגוף בקשה חומרה שאושר על ידי נקודות הסיום [Torii ](/he/reference/torii-endpoints.md).

הגבול הזה משמש כדי למנוע מתקפות DOS.

<param-table>
<template #type>

מספר (באייטים)

</template>
<template #default-value>

`64_000_000` (64 מיליון בייטים)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

זמן שאלת יכולה להישאר בחנות אם לא ניתן לגשת אליה.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

הגבול העליון של מספר שאילתות חי.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

הגבול העליון של מספר בקשות חי עבור משתמש אחד.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## יצרן עץ {#logger}

### `logger.level` {#param-logger-level}

תרגיל רשום כללי (ראה [ `logger.filter`](#param-logger-filter) עבור הגדרות המתוחכמות).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

חוטים, ערכים אפשריים:

- `TRACE`: כל האירועים, כולל פעולות ברמה נמוכה.
- `DEBUG`: הודעות ברמת תיקון, שימושיות לדיאגנסטיקה.
- `INFO`: מסרים מידע כלליים.
- `WARN`: אזהרות המראות בעיות פוטנציאליות.
- `ERROR`: טעויות המפריעות לתפקוד נורמלי אך מאפשרות את המשך הפעולה.

בחר את הרמה המתאימה ביותר למקרה השימוש שלך. ראה [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) לקבלת פרטים נוספים על איך להשתמש ברמות רישום שונות.

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip עדכון בזמן הפעלה

פרמטר זה כפוף לעדכן את ההסדרת של זמן הפעלה באמצעות נקודות הסיום של המפעיל Torii.

:::

### `logger.filter` {#param-logger-filter}

פילטרים של רישום מעודכנים בנוסף ל [`logger.level`](#param-logger-level). מאפשרת להגדיר את דבריות הרישוי על כל מטרה.

<param-table type=string env=LOG_FILTER>
<template #type>

רצועה, מורכבת ממנחיות אחת או יותר נפרדות מקומות. לכל הנחיה יכולה להיות רמה מקסימלית של דבריות מתאימה המאפשרת (למשל, בוחרת עבור) טווח ואירועים המתאימים. Iroha מחשיב רמות פחות בלעדיות (כגון `trace` או `info`) להיות יותר דבריות מאשר רמות יותר בלעדיויות (כגון`error` או `warn`).

ברמה גבוהה, סינטקסת ההנחיות מורכבת ממספר חלקים:

```
target[span{field=value}]=level
```

לקבלת פרטים נוספים, ראה [`tracing-subscriber` תיעוד ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: code-group

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info שילוב עם [`logger.level`](#param-logger-level)

`logger.filter` עובדת יחד עם [`logger.level` ](#param-logger-level) ואף אחד מהם לא כותב את השני.

לדוגמה, אם `logger.level` הוא מוגדר ל `INFO` ו `logger.filter` הוא מוגדר ל `iroha_core=debug`, המجموعת הפילטר הנוצרת תהיה: `info,iroha_core=debug` (כלומר, `info` עבור כל המודלים, `debug` עבור `iroha_core`).

:::

::: tip עדכון בזמן הפעלה

פרמטר זה כפוף לעדכן את ההסדרת של זמן הפעלה באמצעות נקודות הסיום של המפעיל Torii.

:::

### `logger.format` {#param-logger-format}

פורמט היומן.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

חוטים, ערכים אפשריים:

- `full`: פורמייטר מקובל. זה משחרר רישומי קו אחד קריאים על ידי אדם עבור כל אירוע שמתרחש, עם ההקשר הנוכחי של טווח מופיע לפני הצגת הפורמט של האירוע.
- `compact`: גרסה של פורמטור מקובל, מאופטימיזת לעומק קווים קצר. שדות מהקשר הקבוע הנוכחי מוספים לשדות של האירוע המפורסם, ושמות הקבועים אינם מוצגים; רמת מילוליות מצטמצמת לאות אחת.
- `pretty`: שולטת בלוגים יפים מדי, רב קו, מותאמים לקריאה אנושית. זה נועד בעיקר לשימוש בהתפתחות מקומית תיקון חירום, או עבור יישומים בקו הפקודה, כאשר ניתוח אוטומטי וחסוך קומפקטי של רשומות הם פחות עדיפות מאשר קריאה ויזואלית פנייה.
- `json`: מוצרים של רישומים חדשים מוגבלים JSON. זה מיועד לשימוש הייצור עם מערכות שבהן רישומים מבוססים נצרכים כ- JSON באמצעות כלי ניתוח וראייה. ההוצאת של JSON אינה אופטימית לקריאה אנושית.

לקבלת פרטים נוספים ותוצאות הדגימות, ראה [`tracing-subscriber` תיעוד ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura הוא מנוע אחסון מתמשך של Iroha (יפנית עבור מחסן).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

לכל הפחות N בלוקים האחרונים ייחסנו בזיכרון.

בלוקים ישנים יפולו מהזיכרון ויהצאו מהדיסק אם הם נדרשים.

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: code-group

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

מצב התחילות Kura. `strict` הוא מצב נורמלי ומדויק: זה מאשר היסטוריית קנוניקה, ארטיפקטים של התאוששות, אינדיקסים עוזרים וחשבון אחסון לפני שהנקודה הופכת פעילה. .

`fast` הוא מצב חירום של שירות מדרגה כדי להחזיר את הראייה הפעלה כאשר בדיקת התחלה מלאה עלולה לסכן כשל. היא דורשת אחסון `strict` והדור הנוכחי של תמונות מיידיות המכיל בדיוק חמש חפצים. `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`, ו `snapshot.merkle.json`. חתימה של מפעילה נפרדת על ידי תחום מחברת את הדג'סט של המטען הפועל המפורסם ואת מסמך הגבול; המניפסט מחבר את אורך המטען הפועל, זהותו של שרשרת/רשת, גובה הטרמינל/הש. SCCP חישוב מדיניות, נוכחות קשת בוטסטראפ. מהיר דוחה בוטסטראף קשורה ודורשת את אותו גבול מדויק של סימן / ספירה / קצה מעמיד. Kura. רכיבים של השחרור הראשון מקבלים בדיוק את חמשת הארטיפקטים האלה ומכחישים כל סך ארטיפקט אחר או קבוצה של שמות הקבצים.

מלאי מהיר את חמשת השמות והמטא נתונים... מחבר את המשאב הפועל ואת קבצי מרקל. אבל לא קורא, חישב, חותך או מקודרים את התוכן שלהם.Nexus מהמסמך החותם, מפה את המדויק Kura ה-Hash מקודם קריאה בלבד, ומשאיר את התמונה "עולם", מסדר בלאק-האש, היסטוריית העסקאות, אינדיקסים נגזרים, מארקל, אודטים קנוניים וסמנטיים, בלוק היסטורי/סיום SCCP הפיוס, Sumeragi רישומי שיקום בגובה פעיל, ארגוני מיזוג ותשאלות, מדריכים של מסלול/מקורות אימות, Kura-מבוסס SoraFS ארכיונים, חשבונאות אחסון רקורסיבי, ומחברים שירותים אופציונליים נשארו דוחקים. הכניסה של עסקאות מקומיות, הצעות, ההצבעה, כתבי הקנוניקה, ומוצרי סיוע נותרו מוגבלים. Kura עצמו דוחה את התחילתה של כותב ומוטציות קבועות; צינור FASTPQ שורות ההתמדה דוחפים את העבודה מיד במקום לשמור אותה או לחבר אותה. Kura קריאה APIs גם פסק תיקון ותחושת התנהגות סינכרון יציבות: מכונית צד זמנית לא לא פורסמו חפצים של מסלול נעדרים, ואין סינכרון של מחסומים להתקדמות. Sumeragi ושמועות עסקאות לא נפתחו. Torii חושף רק את הבריאות, היכולת לחיות, הכנות, עמיתיות ופעולות הגדרת; API-גרסה, מעמד, מדדים, וכל הדרכים הרגילות של המדינה/היסטוריה התכוננות נשארת לא זמינה עד התחלה מחדש.

השתמש `fast` רק עבור התקרית. ברגע שהשירות יציב, עצר את העמודה, תחזיר `strict` ולהתחיל מחדש כך שכל בדיקה ושיקום אינדיקס שנעכב פועלים לפני החזרת הייצור. מצב מהיר לא דורש את רישום השיתוף המשגר ולא יוצר, תיקון, קיצוץ או ייבוא אחסון קנוני; סופיקסים בלתי פורסמים ומשלחי השיקום החוזרים שנמתינים מתעלמים מבלי לקרוא או מוטציה, ואז משאירים לשחזור קפדני. השורה של תמונות מיידיות הובאות עם האש בלבד נשארת לא זמינה. תמונה מיידית חסרה או בלתי חוקית נכשלת מיד; מהיר אף פעם לא חוזר לעולם ריק או לבנות מחדש את ההשתלטות ההיסטוריות.

<param-table default-value=strict>
<template #type>

חוטים, ערכים אפשריים:

- `strict`: אישור מלא וייצור רגיל.
- `fast`: תחילת מצב חירום מוגבלת עם הייצור מובטח עד התחלת מחדש קפדנית

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

קובע את התיקון [^paths] שבו הבלוקים מאוחסנים.

ראה גם: [ `snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: code-group

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

דגל כדי לאפשר את הדפוס של בלוקים חדשים לקונסול.

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: code-group

```toml [Config File]
[kura.debug]
output_new_blocks = true
```

```shell [Environment]
KURA_DEBUG_OUTPUT_NEW_BLOCKS=true
```

:::

## שורה {#queue}

### `queue.capacity` {#param-queue-capacity}

הגבול העליון של מספר העסקים שמחכים בתור.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

הגבול העליון של מספר עסקאות שמחכות בתור עבור משתמש אחד.

השתמש באפשרות זו כדי להפעיל דחיפה.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

העסקה תיבטל לאחר זמן זה אם היא עדיין בתור.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

כפתור תיקון בלבד לטיפול בנתיבי ניהול פורק רך Sumeragi. השאירו את זה מוגבל מחוץ לבדיקות נשלטות; שינוי אותו ברשת ייצור פועל יכול לגרום לעמיתים לא להסכים על התנהגות הסכמה.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus תיקון פרטי אטומי {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` שולטת בנתיב נפרד של `AtomicPrivateSettlementV1`. הוא מונע כדוגמא. הגדרת `enabled = true` דורשת גם `activation_height`; הכניסה עדיין לא נסגרה אלא אם כן יכולת הרשת, תקופת ההודעה, פרופיל ראיה קבועה ושלטון הקהל/אודט פעילים.

הגבולות העיקריים הם: `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, ו `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` הוא חייב להיות תת קבוצה גדלת בקפידה של V1 שיעורים של דביקות. `permitted_policy_versions` מקבל רק V1.

`max_capsule_bytes` מטעמים הקנוני Norito בייטים של המלא `PrivateSettlementAuditCapsuleV1`, כולל AAD, לאנס, טקסט סיפר, מסגרת וקטורית, וכל אודיטור עטוף...DEK שורה; זה לא גבול של טקסט סיפר בלבד. כל כיתת כביסה מופעלת חייבת להתאים לקספת הקפסולה המלאה השמרנית עבור לפחות `default_min_auditor_approvals` הסדר ההסכמה הזה הוא גם רצף שלטון: Torii דוחה מדיניות שנקבלה לאחרונה עם נמוך יותר `min_approvals` הערך ומסרב כל קפסולה בפועל מעל הגבול הקנוני של בייטים.

הגדרות אלה אינן יכולות לעקוף את ההפעלה של משתנים סביבת הייצור. ראו [Run Atomic Private Cross-Dataspace Settlement](/he/get-started/atomic-private-settlement) עבור דוגמה מלאה להגדיר ותחומי הפעלת. הנתיב אינו מוסמך לייצור עד שהשערים החיצוניים המסמכים עוברים.

## תמונה מיידית {#snapshot}

מודול זה אחראי לקריאה וכתבת תמונות של [תפיסת העולם על המצב](/he/blockchain/world#world-state-view-wsv).

תמונות חתיכות מאחסנות נקודת מבט סדרתית של World State View כך ששותף יכול להפעיל מחדש מבלי לשחזר כל בלוק מ Kura. Kura נשארת ההיסטוריה הקבועה של הבלוק ומקור האמת לשחזור; תמונות חטיפות הן מסלול מאיץ. בעת ההתחלה, Iroha בודק נתונים מטאטא של תמונה מהירה נגד שרשרת המוגדרת והבלוקים המאוחסנים לפני שהוא מחליט אם לטעין תמונה מהיר או לחזור לנגן.

::: tip לחיקוי תמונות

במקרה אם משהו לא בסדר עם מערכת ההצלחות, ואתה רוצה להתחיל בעמוד ריק (במונחים של תמונות), אתה יכול להסיר את התיקון המפורט על ידי [ `snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

האופנה שבה פועלת מערכת Snapshot.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

חוטים, ערכים אפשריים:

- `read_write`: Iroha יוצר תמונות מיידיות עם תקופה מוגדרת על ידי [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). בעת ההתחלה, Iroha קורא תמונה מיידית קיימת (אם בכלל) ומבחינת שהיא מעודכנת עם אחסון הבלוקים.
- `readonly`: דומה ל- `read_write` אבל Iroha לא יוצר תמונות מיידיות.
- `disabled`: Iroha לא יוצר תמונות מיידיות או קורא תמונות קיימות בעת ההתחלה.

</template>
</param-table>

::: code-group

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

תדירות תמונות.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

תיק שבו לאחסן תמונות.

ראה גם: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: code-group

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## טלמטריה {#telemetry}

טלמטריה מייצרת אבחון עמיתים לקולקטור טלמטרי חיצוני. להגדיר את `telemetry.name` ו `telemetry.url` כאשר עמיתים צריכים להודיע לקולקטר; השאירו את החלק כשלא משתמשים בטלמטריה.

`name` ו `url` חייבים להיות משותפים.

כל פרק `telemetry` הוא בחופשי.

### `telemetry.name` {#param-telemetry-name}

שמו של הערך להופיע בטלמטריה.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

WebSocket URL של אספן הטלמטריה.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

תקופה מינימלית של זמן לחכות לפני חיבור מחדש.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

האקספוננט המקסימום של 2 שמשמש להגדיל את האיחור בין חיבורים מחדש.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

דרך הקובץ לכתוב את טלמטריה של dev

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
