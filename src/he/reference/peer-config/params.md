---
translation_locale: he
translation_source: /reference/peer-config/params.md
translation_source_hash: 59147443b612bef0cdd1b7cf2124d168c692a9488d8c38f723187e5ae8d3ba65
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# פרמטרים של הגדרות {#configuration-parameters}

טוקס

## רמת שורש {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

מזהה השרשרת (chain ID) שחייב להיכלל בכל עסקה. הוא משמש למניעת מתקפות שידור חוזר.

מתקפת שידור חוזר היא ניסיון להגיש עסקה תקפה לרשת שונה מזו שאליה יועדה. מכיוון ש־`chain` הוא חלק ממטען הנתונים החתום של העסקה, עמיתים המשתמשים במזהה שרשרת אחר דוחים עסקה שנחתמה עבור שרשרת אחת.

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

מפתח ציבורי של הצומת. צמתים מאמתי קונצנזוס חייבים להשתמש BLS - מפתחות נורמליות.

<param-table type="public-key" env="PUBLIC_KEY" />

::: code-group

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` {#param-private-key}

המפתח הפרטי של העמית. הגדירו בדיוק אחד מבין `private_key` ו־`private_key_file`, הנתיב לקובץ המפתח שהגישה אליו מוגבלת לבעלים. המפתח חייב להתאים ל־`public_key`; עמיתים המאמתים בקונצנזוס משתמשים במפתחות BLS-Normal.

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

רשימה של צומתי אמון מוגדרת מראש.

מאמתי קונצנזוס חייבים להשתמש במפתחות צומת BLS-Normal. עבור כל מאמת יש לספק גם רשומת [`trusted_peers_pop`](#param-trusted-peers-pop) תואמת.

<param-table env="TRUSTED_PEERS">
<template #type>

מערך של מחרוזות צמתים. השתמש `PUBLIC_KEY@ADDRESS` כאשר הכתובת P2P ידועה; נטול `PUBLIC_KEY` גם מקובל ומאפשר לכתובת הצומת להיות מופגנת מהשמועות.

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

BLS רשומות של הוכחת רכוש עבור צמתים אמינים לבדיקן.

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

הפעלה ראשונית והפעלה מחדש מחייבות בדיוק מקור אחד לשורש האמון של genesis: ‏`genesis.expected_hash` או `genesis.expected_hash_file`. תצורות עמיתים שנוצרו אוטומטית משתמשות באפשרות השנייה, המפנה ל־`genesis.expected_hash` לצד הבלוק החתום. שמרו על הקישור הזה בעת העתקת פרופיל שנוצר.

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

כתובת צומת-לצומת (חוץ, כפי שנראה על ידי צמתים אחרים).

הם יתווכחו להצמתים שלהם הקשורים כדי שהם יוכלו להתווכחים על זה לצמתים אחרים.

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

תקרת ההפצה של רכילות סנכרון בלוקים: דגימות עמיתים ועדכוני סנכרון בלוקים.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

הפער הזמן בין בקשות לצמתים על הבלוק האחרון.

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

תקופה של דברי רודפים עד עסקה בין צמתים.

בדיחות תכופות יותר מקצרות את הזמן להתקשר, אבל זה יכול לפחז את הרשת.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

משך הזמן שאחריו הקשר עם הצומת יפסק אם הצומת אינו עובד.

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

זמן שאילתת יכולה להישאר בחנות אם לא ניתן לגשת אליה.

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

מחרוזת; ערכים אפשריים:

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

לדוגמה, אם `logger.level` הוא מוגדר ל `INFO` ו `logger.filter` הוא מוגדר ל `iroha_core=debug`, קבוצת המסננים הנוצרת תהיה: `info,iroha_core=debug` (כלומר, `info` עבור כל המודלים, `debug` עבור `iroha_core`).

:::

### `logger.format` {#param-logger-format}

פורמט היומן.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

מחרוזת; ערכים אפשריים:

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

לכל היותר N מהבלוקים האחרונים יישמרו בזיכרון.

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

מצב האתחול של Kura. ‏`strict` הוא המצב הרגיל וברירת המחדל: הוא מאמת את ההיסטוריה הקנונית, ארטיפקטים לשחזור, אינדקסים מסייעים וחשבונאות אחסון לפני שהצומת נעשה פעיל.

`fast` הוא מצב חירום עם שירות מצומצם, שנועד להשיב נראות תפעולית כאשר ביקורת אתחול מלאה עלולה לגרום להשבתה. הוא דורש אחסון שאותחל קודם לכן באמצעות `strict` ודור נוכחי של תמונת מצב המכיל בדיוק חמישה ארטיפקטים: `snapshot.data`, ‏`snapshot.sha256`, ‏`snapshot.sig`, ‏`snapshot.fast.norito` ו־`snapshot.merkle.json`. חתימת מפעיל המופרדת לפי תחום קושרת את תקציר המטען שפורסם ואת המניפסט המוגבל; המניפסט קושר את אורך המטען, זהות השרשרת/הרשת, גובה וגיבוב הקצה, גיבוב מדיניות SCCP ונוכחות שושלת bootstrap. מצב Fast דוחה שושלת bootstrap ודורש את אותו גבול מדויק של marker/count/tip מתוך Kura העמיד. צמתים של הגרסה הראשונה מקבלים בדיוק את חמשת הארטיפקטים האלה ודוחים כל מספר אחר של ארטיפקטים או כל קבוצת שמות קבצים אחרת.

Fast מונה את חמשת השמות האלה וקושר את קובצי המטען וה־Merkle באמצעות מטא־נתונים, אך אינו קורא, מגבב, מנתח או מפענח את תוכנם. הוא בונה מצב World ו־SORA Nexus מינימלי מהמניפסט החתום, ממפה את קידומת גיבובי Kura המדויקת לקריאה בלבד ומשאיר סגורים את ה־World של תמונת המצב, מערך גיבובי הבלוקים, היסטוריית העסקאות, האינדקסים הנגזרים ויומני ההתאוששות העמידים. ביקורות Merkle וביקורות קנוניות וסמנטיות של תמונת המצב, התאמת היסטוריית הבלוקים/הסופיות/SCCP, התאוששות הגובה הפעיל של Sumeragi, יומני המיזוג והשאילתות, מקורות המניפסט והציות של הנתיבים, ארכיוני SoraFS המגובים ב־Kura, חישוב אחסון רקורסיבי ומנגנוני התאמה של שירותים אופציונליים נשארים דחויים. קבלת עסקאות מקומית, הצעות, הצבעה, כתיבות קנוניות ויצרנים נלווים נשארים מושבתים. Kura עצמו דוחה הפעלת כותב ושינויים עמידים; תורי השמירה העמידה של שרשרת העיבוד ושל FASTPQ דוחים עבודה מיד במקום לשמור או לקודד אותה. ממשקי הקריאה (APIs) של Kura משביתים גם פעולות תיקון וסנכרון לעמידות: נתוני צד זמניים אינם מקודמים, תוצרי נתיבים חסרים אינם מפורסמים ומחסומי התקדמות אינם מסונכרנים לדיסק. Sumeragi ורכילות העסקאות אינם מופעלים. Torii חושף רק פעולות בריאות, חיוּת, מוכנות, עמיתים ותצורה; גרסת API, מצב, מדדים וכל המסלולים הרגילים של מצב והיסטוריה נשארים לא זמינים. המוכנות נשארת לא זמינה עד להפעלה מחדש במצב Strict.

השתמשו ב־`fast` רק בזמן אירוע. לאחר שהשירות מתייצב, עצרו את הצומת, החזירו את `strict` והפעילו מחדש, כדי שכל הבדיקות ובניות האינדקסים שנדחו יושלמו לפני החזרת הייצור. מצב Fast אינו דורש את יומן המיזוג שנדחה ואינו יוצר, מתקן, מקצץ או מייבא אחסון קנוני; סיומות שלא פורסמו ושלבי שחזור מסייעים ממתינים נזנחים בלי לקרוא או לשנות אותם, ונשארים לשחזור Strict. שושלת מיובאת של תמונות מצב הכוללות גיבובים בלבד נשארת בלתי זמינה. תמונת מצב נוכחית חסרה או לא תקינה נכשלת מיד; מצב Fast לעולם אינו נסוג לעולם ריק או לבנייה מחדש באמצעות replay היסטורי.

<param-table default-value=strict>
<template #type>

מחרוזת; ערכים אפשריים:

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

העסקה תוסר לאחר פרק זמן זה אם היא עדיין בתור.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

`[sumeragi]` מכיל הגדרות מקומיות לצומת של השתתפות, משמורת חתימה, נתיבי רשומות בטיחות ועקיפות מתועדות של זמני המתנה וסנכרון. מצב הקונצנזוס, מבנה הוועדה, הקוורום, גודל הבלוק ומגבלות העסקאות נובעים מה־genesis החתום ומהמצב המאושר. הזרקת תקלות שייכת לסימולטור הדטרמיניסטי.

ראו [תצורה](/he/guide/configure/overview.md) ו־[מדריך התצורה](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/references/configuration.md) המקובע עבור השדות הנתמכים.

## סליקה פרטית אטומית ב־SORA Nexus {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` מגדיר משמורת של נתוני צד מוצפנים בצומת אחד. הוא מכיל בדיוק שתי מגבלות אחסון מקומיות:

- `sidecar_max_records`: המספר המרבי של רשומות סליקה מוצפנות הנשמרות.
- `sidecar_max_total_bytes`: המספר המרבי של בתים קנוניים הנשמרים.

ההפעלה, פרופילי ההוכחות, מגבלות התשלום, התפוגה ומדיניות המבקרים נובעים ממדיניות הפרטיות המאושרת. תצורת הצומת אינה יכולה להפעיל או לשנות את כללי התקפות האלה.

ראו [הפעלת סליקה פרטית אטומית בין מרחבי נתונים](/he/get-started/atomic-private-settlement.md) עבור תצורת המשמורת והדרישות התפעוליות. מימוש רכיבים אינו מוכיח כשירות לסביבת ייצור.

## תמונת מצב {#snapshot}

מודול זה אחראי לקריאה וכתבת תמונות מצב של [תפיסת העולם על המצב](/he/blockchain/world#world-state-view-wsv).

תמונות מצב חתיכות מאחסנות נקודת מבט סדרתית של World State View כך שצומת יכול להפעיל מחדש מבלי לשחזר כל בלוק מ Kura. Kura נשארת ההיסטוריה הקבועה של הבלוק ומקור האמת לשחזור; תמונות מצב הן מסלול מאיץ. בעת ההתחלה, Iroha בודק מטא-נתונים של תמונת מצב נגד שרשרת המוגדרת והבלוקים המאוחסנים לפני שהוא מחליט אם לטעין תמונת מצב או לחזור לנגן.

::: tip לחיקוי תמונות מצב

במקרה אם משהו לא בסדר עם מערכת ההצלחות, ואתה רוצה להתחיל בעמוד ריק (במונחים של תמונות מצב), אתה יכול להסיר את התיקון המפורט על ידי [ `snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

האופנה שבה פועלת מערכת Snapshot.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

מחרוזת; ערכים אפשריים:

- `read_write`: Iroha יוצר תמונות מצב עם תקופה מוגדרת על ידי [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). בעת ההתחלה, Iroha קורא תמונת מצב קיימת (אם בכלל) ומבחינת שהיא מעודכנת עם אחסון הבלוקים.
- `readonly`: דומה ל- `read_write` אבל Iroha לא יוצר תמונות מצב.
- `disabled`: Iroha לא יוצר תמונות מצב או קורא תמונות מצב קיימות בעת ההתחלה.

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

תדירות תמונות מצב.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

תיק שבו לאחסן תמונות מצב.

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

טלמטריה מייצאת נתוני אבחון של עמיתים לאספן טלמטריה חיצוני. הגדירו `telemetry.url` כאשר עמית צריך לדווח לאספן; השמיטו את המקטע כאשר אין אספן בשימוש. תזמון הניסיונות החוזרים מוגדר באותה טבלה אופציונלית.

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
