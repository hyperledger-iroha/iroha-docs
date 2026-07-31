---
translation_locale: he
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
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

מתקפה חוזרת היא ניסיון להגיש עסקאות תקיימות לרשת שונה מאלה שנועדו אליה. מכיוון ש`chain` הוא חלק מהחוב מועיל של העסקה חתומה, עסקה חתומה עבור שרשרת אחת נדחה על ידי עמידים שמשתמשים בשורה אחרת ID .

<param-table type=string env=CHAIN />

::: קבוצת קוד

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

::: קבוצת קוד

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

::: קבוצת קוד

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

רשימה של עמיתים אמינים מוגדרו מראש.

בדיקות הסכמה צריכות להשתמש BLS-נורמליות מפתחות שווים. עבור כל מבדיקת, גם לספק כתיבה מתאימה [`trusted_peers_pop`](#param-trusted-peers-pop).

<param-table env="TRUSTED_PEERS">
<template #type>

סדרה של חוטים משותפים. השתמש `PUBLIC_KEY@ADDRESS` כאשר הכתובת P2P ידועה; נטול `PUBLIC_KEY` גם מקובל ומאפשר לכתובת השותף להיות מופגנת מהשמוח.

</template>
</param-table>

::: קבוצת קוד

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

::: קבוצת קוד

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

::: קבוצת קוד

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

::: קבוצת קוד

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

::: קבוצת קוד

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

::: קבוצת קוד

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

::: קבוצת קוד

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

הפער הזמן בין בקשות לעמיתים על הבלוק האחרון.

בדיחות תכופות יותר מקצרות את הזמן להתקשר, אבל זה יכול להטיל עומס על הרשת.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: קבוצת קוד

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

מספר מקסימום של עסקאות בהודעת רווחה.

גודל קטן יותר מוביל לזמן ארוך יותר של סינכרון, אבל שימושי אם יש לך אובדן חבילות גבוה.

<param-table type=number default-value=500 />

::: קבוצת קוד

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

תקופה של דברי רודפים עד עסקה בין עמיתים.

בדיחות תכופות יותר מקצרות את הזמן להתקשר, אבל זה יכול לפחז את הרשת.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: קבוצת קוד

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

משך הזמן שאחריו הקשר עם השותף יפסק אם השותף אינו עובד.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: קבוצת קוד

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

כתובת שהשרת Torii חייב להקשיב אליה והלקוח (ים) מבקש את זה.

<param-table type=socket-addr env=API_ADDRESS />

::: קבוצת קוד

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

::: קבוצת קוד

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

זמן שאלת יכולה להישאר בחנות אם לא ניתן לגשת אליה.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: קבוצת קוד

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

הגבול העליון של מספר שאילתות חי.

<param-table type=number default-value=128 />

::: קבוצת קוד

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

הגבול העליון של מספר בקשות חי עבור משתמש אחד.

<param-table type=number default-value=128 />

::: קבוצת קוד

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

בחר את הרמה המתאימה ביותר למקרה השימוש שלך. ראה [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) עבור פרטים נוספים על איך להשתמש ברמות רישום שונות.

</template>
</param-table>

::: קבוצת קוד

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

רצועה, מורכבת ממנחיות אחת או יותר נפרדות על ידי קומות. לכל הנחיה יכולה להיות רמה מקסימלית של דבריות מתאימה המאפשרת (למשל, בוחרת עבור) טווח ואירועים המתאימים. Iroha מחשיב רמות פחות בלעדיות (כגון `trace` או `info`) להיות יותר דבריות מאשר רמות יותר בלעדיויות (כגון`error` או `warn`).

ברמה גבוהה, סינטקסת ההנחיות מורכבת ממספר חלקים:

```
target[span{field=value}]=level
```

לקבלת פרטים נוספים, ראה [`tracing-subscriber` תיעוד ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: קבוצת קוד

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info התאמה עם [`logger.level`](#param-logger-level)

`logger.filter` עובדת יחד עם [`logger.level` ](#param-logger-level) ואף אחד מהם לא כותב את השני.

לדוגמה, אם `logger.level` נקבע ל `INFO` ו `logger.filter` נקבע ל`iroha_core=debug`, קבוצת הגלגלים הנוצרת תהיה `info,iroha_core=debug` (כלומר, `info` עבור כל המודולים, `debug` עבור `iroha_core`).

:::

::: tip עדכון בזמן הפעלה

פרמטר זה כפוף לעדכן את ההסדרת של זמן הפעלה באמצעות נקודות הסיום של המפעיל Torii.

:::

### `logger.format` {#param-logger-format}

צורת היומן.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

חוטים, ערכים אפשריים:

- `full`: פורמייטר מקובל. זה משחרר רישומי קו אחד קריאים על ידי אדם עבור כל אירוע שקורה, עם ההקשר הנוכחי של טווח הוצג לפני ייצוג הפורמט של האירוע.
- `compact`: וריאנט של פורמייטר מקובל, מאופטימי עבור אורך שורות קצרים. שדות מהקשר הקבוע הנוכחי מתוספים לשדות של האירוע המפורמט, ושמות הקבוע אינם מוצגים; רמת מילוליות מצטמצמה לעד אות אחד.
- `pretty`: יוצר רישומים יפים מדי, רב קו, מותאמים לקריאה אנושית. זה מיועד בעיקר לשימוש לפיתוח מקומי וחיזוק, או עבור יישומים בקו פקודות, כאשר ניתוח אוטומטי ואחסון קומפקטי של רישומים הוא פחות עדיפות מאשר קריאתם והמשתעה החזותית.
- `json`: מוצרים של רישומים חדשים מוגבלים JSON. זה מיועד לשימוש הייצור עם מערכות שבהן רישומים מבוססים נצרכים כ- JSON באמצעות כלי ניתוח וראייה. ההוצא של JSON אינו אופטימי עבור קריאת אנוש.

לקבלת פרטים נוספים ותוצאות הדגימות, ראה [`tracing-subscriber` תיעוד ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: קבוצת קוד

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura הוא מנוע אחסון מתמשך של Iroha (יפני עבור מחסן).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

לכל הפחות N בלוקים האחרונים ייחסנו בזיכרון.

בלוקים ישנים יפולו מהזיכרון ויהצאו מהדיסק אם הם נדרשים.

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: קבוצת קוד

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

מצב ההתחילה Kura

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

חוטים, ערכים אפשריים:

- `strict`: אישור קפדני של כל הבלוקים
- `fast`: חיזוק מהיר עם בדיקות בסיסיות בלבד

</template>
</param-table>

::: קבוצת קוד

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

קובע את התיקון [^paths] בו הבלוקים מאוחסנים.

ראה גם: [ `snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: קבוצת קוד

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

דגל כדי לאפשר את הדפסה של בלוקים חדשים לקונסול.

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: קבוצת קוד

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

הגבול העליון של מספר העסקאות המתמודדות בתור.

<param-table type=number default-value=65_536 />

::: קבוצת קוד

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

הגבול העליון של מספר עסקאות שמחכות בתור עבור משתמש אחד.

השתמש באפשרות זו כדי להפעיל דחיפה.

<param-table type=number default-value=65_536 />

::: קבוצת קוד

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

העסקה תיבטל לאחר זמן זה אם היא עדיין בתור.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: קבוצת קוד

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

כפתור תיקון בלבד לטיפול בנתיבי ניהול צנבת רכה Sumeragi. השאירו את זה מונע מחוץ לבדיקות נשלטות; שינוי אותו ברשת הייצור פועלת יכול לגרום לעמיתים לא להסכים על התנהגות הסכמה.

<param-table type=bool default-value=false />

::: קבוצת קוד

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## תמונה מיידית {#snapshot}

מודול זה אחראי לקריאה וכתבת תמונות של [תפיסת העולם על המצב](/he/blockchain/world#world-state-view-wsv).

תמונות מייצגות מאחסנות נקודת מבט סדרתית של World State View כך ששותף יכול להתחיל מחדש מבלי לנגן מחדש כל בלוק מ Kura. Kura נשארת ההיסטוריה של הבלוק המתמשכת ומקור האמת לשחזור; תמונות מיידית הם מסלול מאיץ. בעת ההתחלה, Iroha בודק נתונים מטאטא של תמונה מהירה נגד שרשרת המוגדרת והבלוקים המאוחסנים לפני שהוא מחליט אם לטעין תמונה מהיר או לחזור לנגן.

::: tip לחיקוי תמונות

במקרה שמשהו לא בסדר עם מערכת ההצלחות, ואתה רוצה להתחיל בעמוד ריק (במונחים של תמונות), אתה יכול להסיר את התיקון המפורט על ידי [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

האופנה שבה פועלת מערכת Snapshot.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

חוטים, ערכים אפשריים:

- `read_write`: Iroha יוצר תמונות מיידיות עם תקופה מוגדרת על ידי [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). בעת ההתחלקה, Iroha קורא תמונה מיידית קיימת (אם בכלל) ומבחינת שהיא מעודכנת עם אחסון הבלוקים.
- `readonly`: דומה ל- `read_write` אבל Iroha לא יוצר תמונות מיידיות.
- `disabled`: Iroha לא יוצר תמונות מיידיות או קורא תמונות קיימות בעת ההתחלה.

</template>
</param-table>

::: קבוצת קוד

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

::: קבוצת קוד

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

תיק שבו לאחסן תמונות.

ראה גם: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: קבוצת קוד

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## טלמטריה {#telemetry}

טלמטריה מייצרת אבחון עמיתים לקולקטור טלמטרי חיצוני. להגדיר את `telemetry.name` ו `telemetry.url` כאשר עמיתים צריכים להודיע לקולקטר; השאירו את החלק כאשר הטלמטריה אינה משמשת.

`name` ו `url` חייבים להיות משותפים.

כל פרק `telemetry` הוא בחופשי.

### `telemetry.name` {#param-telemetry-name}

שמו של הערך להופיע בטלמטריה.

<param-table type=string />

::: קבוצת קוד

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

WebSocket URL של קולקטור הטלמטריה.

<param-table type=string />

::: קבוצת קוד

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

תקופה מינימלית של זמן לחכות לפני חיבור מחדש.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: קבוצת קוד

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

האקספוננט המקסימום של 2 שמשמש להגדיל את האיחור בין חיבורים מחדש.

<param-table type=number default-value=4 />

::: קבוצת קוד

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

דרך הקובץ לכתוב את טלמטריה של dev

<param-table type=file-path />

::: קבוצת קוד

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
