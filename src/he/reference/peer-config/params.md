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

[toc]

## רמת שורש {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

שרשרת ID זה חייב להיות כולל בכל עסקאות.

מתקפה של שיחזור היא ניסיון להגיש עסקאות වලילות למשהו אחר
רשת מאשר זו שהייתה נועדה עבורה. `chain` הוא חלק
המטען המשפטי של העסקה חתומה, העסקה שנחתמה עבור שרשרת אחת נדחה
על ידי עמיתים שמשתמשים בשולחן אחר ID.

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

מפתח ציבורי של השותפים. BLS מפתחות רגילות.

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

המפתח הפרטי של השותף. `public_key`; עמיתים בדיקת הסכמה
יש להשתמש BLS מפתחות רגילות.

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

רשימה של עמיתי אמון מוגדר מראש.

מבקשי ההסכמה חייבים להשתמש BLS-מפתחות עמינים נורמאליים.
לספק התאמה [`trusted_peers_pop`](#param-trusted-peers-pop) הכניסה.

<param-table env="TRUSTED_PEERS">
<template #type>

סדרה של חוטים משותפים. `PUBLIC_KEY@ADDRESS` כאשר P2P כתובת ידועה;
חשוף `PUBLIC_KEY` הוא גם מקובל ומאפשר לגלות את כתובת העמיתים
רודפים.

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

BLS רשומות של הוכחת רכוש עבור חבריו האמינים למבחין.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

סדרת חפצים עם `public_key` ו `pop_hex` שדות

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

מסלול הקובץ ללחץ הפועל של בלוק הגנזיס חתום שנוצר על ידי `kagami genesis sign`.
פרופילים שנוצרו בדרך כלל כותבים את זה Norito `.nrt` תיק.

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

מפתח ציבורי של זוג המפתחות הגנזה.

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

כתובת לתקשורת P2P עבור הסכמה (sumeragi) וזמיון בלוק (בלוק)_סינכרון) מטרות.

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

כתובת משותף לשותף (חוץ, כפי שנראה על ידי עמיתים אחרים).

ישמעו בדיחות לעמיתים קשורים כדי שיוכלו לדבריהם.

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

כמות הבלוקים שניתן לשלוח במסר סינכרון אחד.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

הפער הזמן בין בקשות לעמיתים עבור הבלוק האחרון.

בדיחות תכופות יותר מקצרות את הזמן להתקשר, אבל זה יכול להטיל עומס על הרשת.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

מספר מקסימום של עסקאות בהודעה על רווחים.

גודל קטן יותר מוביל לזמן ארוך יותר להתמזג, אבל שימושי אם יש לך אובדן חבילה גבוה.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

תקופה של רוממות מחופשת עסקה בין עמינים.

בדיחות תכופות יותר מקצרות את הזמן להתקשר, אבל זה יכול להטיל עומס על הרשת.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

משך הזמן שאחריו הקשר עם עמיתים יפסק אם עמיתים אינם פועלים.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

כתובת Torii השרת חייב להקשיב ולמי שהלקוח* עושה את בקשותיו.

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

מספר המקסימלי של בייטים בגוף בקשה רם שהוקבל על ידי
[Torii נקודות סוף](/he/reference/torii-endpoints.md).

הגבול הזה משמש כדי למנוע DOS התקפות.

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

הגבול העליון של מספר שאילות חי.

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

_גנרל_ תרגיל אבטחה (ראה [`logger.filter`](#param-logger-filter) עבור תיקון מעודן).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

חוט, ערכים אפשריים:

- `TRACE`: כל האירועים, כולל פעולות ברמה נמוכה.
- `DEBUG`: הודעות ברמת תיקון, שימושיות לדיאגנסטיקה.
- `INFO`: מסרים מידע כלליים.
- `WARN`: אזהרות שמצביעות על בעיות אפשריות.
- `ERROR`: טעויות אשר מפריעות בתפקוד נורמלי אך מאפשרות את המשך הפעולה.

בחר את הרמה המתאימה ביותר למקרה השימוש שלך.
[הגלישה של סטק](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) עבור תוספת
פרטים על איך להשתמש ברמות רשומות שונות.

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

פרמטר זה כפוף לעדכון את ההשנה של זמן הפעלה באמצעות Torii נקודות הסיום של המפעיל.

:::

### `logger.filter` {#param-logger-filter}

פילטרים מעודכנים [`logger.level`](#param-logger-level). מאפשרת להגדיר את קו המילים של הרישום
על-_מטרה_.

<param-table type=string env=LOG_FILTER>
<template #type>

רצועה, מורכבת ממנחיות אחת או יותר שנפרדות על ידי קומות. לכל הנחיה יכולה להיות תקיפות מקסימלית מתאימה
_רמה_ מה שמאפשר (למשל, _נבחרים עבור_) טווח האירועים המתאימים. Iroha נחשבות רמות פחות בלעדיות (כמו
`trace` או `info`) להיות יותר מילים מאשר רמות יותר בלעדיות (כגון `error` או `warn`).

ברמה גבוהה, הסינטקס של הנחיות מורכב ממספר חלקים:

```
target[span{field=value}]=level
```

לפרטים נוספים, ראה
[`tracing-subscriber` מסמכים](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info תאימות עם [`logger.level`](#param-logger-level)

`logger.filter` עבודות _יחד_ עם [`logger.level`](#param-logger-level) ואף אחד לא כותב את השני.

לדוגמה, אם `logger.level` הוא מוגדר ל `INFO` ו `logger.filter` הוא מוגדר ל `iroha_core=debug`, המסנן המוצא
הנתון יהיה `info,iroha_core=debug` (כלומר, `info` לכל המודלים, `debug` עבור `iroha_core`).

:::

::: tip עדכון בזמן הפעלה

פרמטר זה כפוף לעדכון את ההשנה של זמן הפעלה באמצעות Torii נקודות הסיום של המפעיל.

:::

### `logger.format` {#param-logger-format}

פורמט היומן.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

חוט, ערכים אפשריים:

- `full`: הפורמטור הנדל"ן. זה משחרר שיא אחד קו קריאה אנושית לכל אירוע שמתרחש, עם
  קונקסט של טווח הנוכחי הוצג לפני הצגת האירוע בצורת.
- `compact`: גרסה של פורמייטר מקובל, אופטימיזת למושכות קווים קצרות. שדות מהקשר הנוכחי של מרווח
  הוספים לשדות של האירוע המפורמט, ושמות מרחב לא מוצגים; רמת מילוליות מצטמצמה ל
  דמות אחת.
- `pretty`: הוא משחרר יומן רב קו יפה מדי, אופטימיז עבור legibility אנושי.
  משמשת לפיתוח מקומי וחיזוק, או עבור יישומים בקו פקודה, כאשר ניתוח אוטומטי ומעט
  חישוב הירידים הוא פחות עדיפות מאשר קריאתם והמשתעה הראשית.
- `json`: תוצרות קו חדש מוגבל JSON זה מיועד לשימוש הייצור עם מערכות שבהן
  הם נצרכים כ JSON באמצעות כלי ניתוח וראייה. JSON התוצרת לא אופטימית לקריאה אנושית.

פרטים נוספים ויוצאות הדגימה, ראה
[`tracing-subscriber` מסמכים](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

_קורה_ הוא מנוע אחסון מתמשך של Iroha (יפני עבור _מחסן_).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

לכל הפחות N בלוקים האחרונים ייחסנו בזיכרון.

בלוקים ישנים יפולו מהזיכרון ויהפאו מהדיסק אם הם נדרשים.

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

Kura מצב התחילות

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

חוט, ערכים אפשריים:

- `strict`: אישור מקיף של כל הבלוקים
- `fast`: התחילה מהירה עם רק בדיקות בסיסיות

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

קובע את התיקון [^paths] שבו הבלוקים מאוחסנים.

ראו גם: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

דגל כדי לאפשר את הדפיסה של בלוקים חדשים לקונסול.

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

## בתור {#queue}

### `queue.capacity` {#param-queue-capacity}

הגבול העליון של מספר העסקים המתחכים בתור.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

הגבול העליון של מספר העסקים שמחכים בתור עבור משתמש אחד.

השתמש באפשרות זו כדי להפעיל דחיפה.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

העסקה תיפסק לאחר זמן זה אם היא עדיין בתור.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

כביש תיקון בלבד לטיול Sumeragi מסלולים לניהול פורק רך.
מעבדה מחוץ לבדיקות מבוקשות; שינוי אותה ברשת הייצור פועלת
יכול לגרום לשנים לא להסכים על התנהגות הסכמה.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## תמונה מהירה {#snapshot}

מודול זה אחראי לקריאה ולכתבת תמונות של
[תפיסת העולם על המצב](/he/blockchain/world#world-state-view-wsv).

תמונות מיידיות מאחסנות נקודת מבט סדרתית של World State View כך שבן זוג יכול
להפעיל מחדש מבלי לשחזר כל בלוק מ Kura. Kura נשארת בלוק מעמיד
היסטוריה ומקור האמת לשחזור; תמונות מיידיות הן מסלול מאיץ.
בהתחלה, Iroha בדיקת נתונים מטאטא של תמונות מיידיות נגד שרשרת המוגדרת
בלוקים מאוחסנים לפני ההחלטה אם לטעין תמונה או לחזור לשחזור.

::: tip מפשף תמונות מהירות

במקרה אם משהו לא בסדר עם מערכת תמונות מיידיות, ואתה רוצה להתחיל מדף ריק (במונחים של
תמונות מיידיות), אתה יכול להסיר את התיקון המפורט על ידי [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

מצב שבו מערכת Snapshot פועלת.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

חוט, ערכים אפשריים:

- `read_write`: Iroha יוצר תמונות מיידיות עם תקופה מוגדרת על ידי:
  [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). בהתחלה, Iroha קורא תמונה מיידית קיימת (אם בכלל)
  ומבחין שהוא עדכני עם אחסון הבלוקים.
- `readonly`: דומה ל `read_write` אבל Iroha זה לא יוצר תמונות.
- `disabled`: Iroha לא יוצר תמונות חדשות ולא קורא תמונות קיימות בהתחלה.

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

תדירות של צילומים.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

תיק שבו לאחסן תמונות.

ראו גם: [`kura.store_dir`](#param-kura-store-dir)

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

טלמטריה מייצרת אבחון עמיתים לקולקטור טלמטרי חיצוני.
שניהם `telemetry.name` ו `telemetry.url` כאשר עמית צריך לדווח
אוסף; השאירו את החלק כאשר טלמטריה לא משמשת.

`name` ו `url` חייבים להיות זוגות.

כולם. `telemetry` החלק הוא אופציונלי.

### `telemetry.name` {#param-telemetry-name}

שמו של הערך ייצג בטלמטריה.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

ה- WebSocket URL של אוסף הטלמטריה.

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

המרכיב המקסימלי של 2 שמשמש להגדיל את האיחור בין חיבורים מחדש.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

דרך הקובץ כדי לכתוב dev-טלמטריה

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
