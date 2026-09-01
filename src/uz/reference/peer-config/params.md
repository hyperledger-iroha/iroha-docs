---
translation_locale: uz
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Konfiguratsiya parametrlari {#configuration-parameters}

[[toc]]

## O'simlik darajasi {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

ID zanjiri har bir muomalaga kiritilishi kerak. Takrorlash hujumlarini oldini olish uchun ishlatiladi.

Takrorlash hujumlari - bu haqiqiy operatsiyani o'ziga mo'ljallanganidan boshqacha tarmoqga taqdim etish urinishidir. `chain` imzolangan operatsiya payloadining bir qismi bo'lgani uchun, bitta zanjir uchun imzolangan tranzaksiya boshqa zanjirdan foydalanuvchi tugunlar tomonidan rad etiladi ID

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

O'z tugunlari uchun ochiq kalit. Konsensni tasdiqlovchi tugunlar BLS-Normal kalitlaridan foydalanishlari kerak.

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

Tugunning xususiy kaliti. U `public_key` bilan mos bo'lishi kerak; konsensus tasdiqlovchi tugunlar BLS-Normal kalitlaridan foydalanishlari kerak.

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

Ishonchli tugunlar ro'yxati.

Konsensus tasdiqlovchi tugunlari BLS-Normal tugun kalitlaridan foydalanishi kerak. Har bir tasdiqlovchi tugun uchun mos [`trusted_peers_pop`](#param-trusted-peers-pop) yozuvini ham kiriting.

<param-table env="TRUSTED_PEERS">
<template #type>

Tugunlar simlaridan iborat qator. `PUBLIC_KEY@ADDRESS` manzili P2P ma'lum bo'lganda foydalaning; yalang'och `PUBLIC_KEY` ham qabul qilinadi va tugunlar manzilini g'iybatdan aniqlash imkonini beradi.

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

BLS validatorning ishonchli tugunlari uchun egalik to'g'risidagi dalillar kiritiladi.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` va `pop_hex` maydonlari bo'lgan ob'ektlar qatorlari

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

## Ibtido {#genesis}

### `genesis.file` {#param-genesis-file}

`kagami genesis sign` tomonidan yaratilgan imzolangan genesis blokida fayl yo'li. Yaratilgan profillar odatda buni Norito `.nrt` fayli sifatida yozadi.

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

Genesis kalitining umumiy kaliti.

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

## Tarmoq {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Konsensus (sumeragi) va blok sinxronizatsiyasi (blok_sinx) uchun p2p aloqa manzili.

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

Tugunlardan to'g'ri manzil (tashkil, boshqa tugunlar ko'rganidek).

Boshqa tugunlarga gapirishlari uchun o'zaro bog'liq tugunlariga g'iybat qilishadi.

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

Bir xil sinxronlashtirish xabarida jo'natilishi mumkin bo'lgan bloklar soni.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Eng so'nggi blok uchun tugunlarga murojaatlar orasidagi vaqt oralig'i.

Ko'proq tez-tez g'iybat qilish sinxronlashtirish vaqtini qisqartiradi, ammo tarmog'i ortiqcha bo'ladi.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

G'iybatlar to'plamidagi bitimlarning maksimal soni.

Kichikroq o'lcham sinxronlashtirish uchun ko'proq vaqtga olib keladi, ammo agar sizda katta paket yo'qotish bo'lsa, bu foydali.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Tugunlar o'rtasidagi bitimni kutish paytida g'iybat qilish davri.

Ko'proq tez-tez g'iybat qilish sinxronlashtirish vaqtini qisqartiradi, ammo tarmog'i ortiqcha bo'ladi.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Agar tugun ishlamasa, tugun bilan bog'lanish tugatilgan vaqt davomiyligi.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii serverining tinglashi kerak bo'lgan va mijozlar o'z talablarini amalga oshiradigan manzili.

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

[Torii oxirgi nuqtalari ](/uz/reference/torii-endpoints.md) tomonidan qabul qilingan xom talab organidagi maksimal baytlar soni.

Ushbu limit DOS hujumlarini oldini olish uchun ishlatiladi.

<param-table>
<template #type>

(baytlar soni)

</template>
<template #default-value>

`64_000_000` (64 million byt)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Agar xaridorga murojaat qilinmasa, so'rovlar do'konda qolishi mumkin bo'lgan vaqt.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

To'g'ridan-to'g'ri so'rovlar soni yuqori chegarasi

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

Bir foydalanuvchi uchun jonli so'rovlar sonining yuqori chegarasi.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Oʻgʻirzor {#logger}

### `logger.level` {#param-logger-level}

Umumiy logging verbosity [`logger.filter`](#param-logger-filter) ko'rib chiqing.

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Urug'lar, mumkin bo'lgan qiymat:

- `TRACE`: Barcha tadbirlar, shu jumladan past darajadagi operatsiyalar.
- `DEBUG`: Xavfsizlik darajasidagi xabarlar, diagnostika uchun foydali.
- `INFO`: Umumiy axborot xabarlari.
- `WARN`: Muvofiq muammolarni ko'rsatadigan ogohlantirishlar.
- `ERROR`: Oddiy funktsiyani buzadigan, ammo ishlashni davom ettirish imkonini beradigan xatolar. Turli log darajalaridan foydalanish bo‘yicha qo‘shimcha tafsilotlar uchun Stack Overflow-ga qarang.

Foydalanish holatingizga eng mos darajani tanlang. Turli log level-lardan foydalanish bo'yicha qo'shimcha ma'lumot uchun [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels)-ga qarang.

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

::: tip Ish vaqti yangilanishi

Ushbu parametr Torii operator oxirgi nuqtalari orqali ishga tushirish vaqti konfiguratsiyasi yangilanishiga to'g'ri keladi.

:::

### `logger.filter` {#param-logger-filter}

[`logger.level`](#param-logger-level) ga qo'shimcha ravishda sozlangan log filtrlari. Har bir maqsad bo'yicha yozish verbositetini moslash imkonini beradi.

<param-table type=string env=LOG_FILTER>
<template #type>

Tirik, bir yoki bir nechta komada ajratilgan direktivdan iborat bo'lib turadi. Har bir direktivda o'xshash maksimal so'zlash darajasi bo'lishi mumkin, bu esa mos keladigan muddatlar va hodisalarga imkon beradi (masalan, tanlaydi). Iroha kamroq eksklyuziv darajalarni (masalan, `trace` yoki `info`) yuqori eksklyufik darajadan ko'ra ko'proq gapiradigan darajada deb hisoblaydi (masalan `error` yoki `warn`).

Yuqori darajadagi yo'nalishlarning sintaxasi bir nechta qismdan iborat:

```
target[span{field=value}]=level
```

Ko'proq ma'lumot olish uchun [ `tracing-subscriber` hujjatlarini](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html) ko'ring.

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

::: info [`logger.level`](#param-logger-level) bilan birgalikda ishlash

`logger.filter` bilan birga ishlaydi [`logger.level`](#param-logger-level) va hech biri boshqa biridan ustun qo'ymadi.

Masalan, `logger.level` qiymati `INFO`, `logger.filter` qiymati esa `iroha_core=debug` bo‘lsa, hosil bo‘ladigan filtr `info,iroha_core=debug` bo‘ladi (ya’ni barcha modullar uchun `info`, `iroha_core` uchun `debug`).

:::

::: tip Ish vaqti yangilanishi

Ushbu parametr Torii operator oxirgi nuqtalari orqali ishga tushirish vaqti konfiguratsiyasi yangilanishiga to'g'ri keladi.

:::

### `logger.format` {#param-logger-format}

Yozuvlar shakli.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Urug'lar, mumkin bo'lgan qiymat:

- `full`: Andoza formatlovchi. Bu har bir hodisa uchun inson o'qishi mumkin bo'lgan, bitta satrli loglarni chiqaradi va hodisaning formatlangan ifodaidan oldin joriy uzluk kontekst ko'rsatiladi.
- `compact`: Qisqa satr uzunliklari uchun optimallashtirilgan andoza formatlash vositasining variantidir. Hozirgi tarang kontekstidagi maydonlar formatlangan hodisaning maydonlariga ilova qilinadi va tarang nomlari ko'rsatilmaydi; verbosity darajasi bitta belgiga qisqartiriladi.
- `pretty`: inson o'qishi uchun optimallashtirilgan juda chiroyli, ko'p chiziqli jurnallarni chiqaradi. yo'qlash yoki buyruq satrida qo'llaniladigan dasturlar uchun, avtomatlashtirilgan tahlil va jurnallarni kompakt saqlash o'qish va ko'rinishga ega bo'lishdan kamroq ustuvor ahamiyatga ega.
- `json`: Yangi yo'nalishdagi cheklangan JSON loglarni ishlab chiqaradi. Bu tizimlar bilan ishlab chiqarish uchun mo'ljallangan bo'lib, u erda tuzilgan loglar tahlil va ko'rish vositalari orqali JSON sifatida iste'mol qilinadi. JSON mahsulotlari inson o'qishi uchun optimallashtirilmagan.

Ko'proq ma'lumot va namuna mahsulotlari uchun [`tracing-subscriber` hujjatlarini ko'rish ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura - Iroha (go'ja uchun yaponcha) doimiy saqlash dvigati.

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Eng ko'p N so'nggi bloklar xotiraga saqlanadi.

Agar kerak bo'lsa, eski bloklar xotirasidan tushirib, diskdan yuklanadi.

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

Kura boshlash usuli. `strict` odatiy va andoza usulidir: u nod faollashishdan oldin kanonik tarix, tiklanish artefaktlari, yordamchi indekslar va saqlash hisobini tasdiqlaydi.

`fast` - operatsiyaviy ko'rinishni tiklash uchun favqulodda holatda xizmatni buzgan rejimdir. to'liq boshlang'ich audit uzilish xavfi bo'lishi mumkin. `strict` va to'g'ri beshta artefaktni o'z ichiga olgan joriy snapshotlar avlodi: `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`, va `snapshot.merkle.json`. Domenlar bo'yicha alohida operator imzosi reklama qilingan foydali yukni o'chirish va cheklangan manifestni bog'laydi; manifestda foydali yukning uzunligi, zanjir/tarmoq kimligi, terminal balandligi/hash to'g'risida ma'lumot beriladi; SCCP siyosat hash, va bootstrap liniyasi mavjudligi. tezlik bilan bootstrap rad etadi nasldan kelib chiqishi va o'ziga xos belgilash/hisoblash/to'g'ri chiziq chegaralarini talab qiladi Kura. Birinchi chiqarilgan nodlar aynan shu beshta artefaktni qabul qiladi va boshqa barcha artefaktlar soni yoki fayl nomlari setini rad etadi.

Ushbu beshta ism va metadatalarni tezkor inventarizatsiya qiladi, payload va Merkle fayllarini bog'laydi, ammo ularning mazmunini o'qib, hash qilmaydi, tahlil qilmaydi yoki dekodlamaydi. U imzolangan manifestdan minimal dunyo / Nexus yaratadi, aniq Kura hash prefiksini faqat o'qish uchun xaritalaydi va world, block-hash arrayni qoldiradi. operatsiyalar tarixi, hosil bo'lgan indekslar va uzoq muddatli tiklanish jurnallari ochilmagan. Merkle, kanonik va semantik tezkor tekshiruvlar, tarixiy blok / yakun/SCCP muvofiqlashtirish, Sumeragi faol balandlikni tiklash, birlashtirish va so'rov jurnallari, yo'nalish manifesti / muvofiqlik manbalari, Kura tomonidan qo'llab-quvvatlanadigan SoraFS arxivlari, rekursiv saqlash hisobi va ixtiyoriy xizmatlarni birlashtiruvchi vositalar kechiktirilmoqda. Mahalliy bitimlarni qabul qilish, takliflar, ovoz berish, kanonik yozuvlar va yordamchi ishlab chiqaruvchilar faoliyatsiz qolmoqda. Kura o'zi yozuvchi ishga tushirilishini va uzoq muddatli mutatsiyalarni rad etadi; konveyer va FASTPQ chidamlilik navbatlari uni saqlab qolish yoki kodlashning o'rniga ishni darhol rad qiladi. Kura o'qiladi APIs shuningdek, ta'mirlash va chidamlilik-sinkronizatsiya xatti-harakatlarini o'chirib tashlaydi: vaqtinchalik yordamchi yozuvlari rag'batlantirilmaydi, yo'qolgan yo'l artefaktlari nashr etilmaydi va rivojlanish to'siqlari sinxronlashtirilmaydi. Sumeragi va tranzaksiya mish-mishlar ishga tushirilmaydi . Torii faqat sog'liq, jonlilik, tayyorlik, tugunlar va konfiguratsiya operatsiyalarini aks ettiradi; API-versiya, status, metrikalar va barcha odatdagi holat / tarix yo'nalishlari mavjud emas.

`fast` ni faqat hodisa uchun ishlating. Xizmat barqaror bo'lganidan so'ng, nodni to'xtatish, `strict` ni tiklash va qayta ishga tushirish, shuning uchun har bir kechiktirilgan tekshirish va indeksni qayta qurish ishlab chiqarish davom etmasdan oldin ishlaydi. Tezkor rejimda kechiktirilgan birlashtirish logini talab qilmaydi va kanonik saqlashni yaratmaydi, ta'mirlamaydi, qisqartirmaydi yoki import qilmaydi; nashr etilmagan suffixlar va kutilmagan yordamchi tiklash bosqichlari o'qib bo'lmasdan yoki mutatsiya qilinmasdan e'tiborsiz qoldiriladi, so'ngra qat'iy tiklash uchun qoldiriladi. Import qilingan faqat hashli snapshotlar liniyasi mavjud emas. Yo'qolgan yoki haqiqiy bo'lmagan joriy snapshot darhol muvaffaqiyatsizlikka uchraydi; tez hech qachon bo'sh dunyoga yoki tarixiy takrorlashni qayta tiklashga tushmaydi.

<param-table default-value=strict>
<template #type>

Urug'lar, mumkin bo'lgan qiymat:

- `strict`: to'liq tasdiqlash va normal ishlab chiqarish
- `fast`: qat'iy qayta ishga tushirilgunga qadar ishlab chiqarish karantinga qo'yilgan cheklangan favqulodda ishga tushirish;

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Bloklar saqlanadigan direktoriyani [^paths] aniqlaydi.

Shuningdek, ko'ring: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

Konsol uchun yangi bloklarni bosib chiqarish imkonini beruvchi bayroq.

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

## Tartib {#queue}

### `queue.capacity` {#param-queue-capacity}

navbatda turgan bitimlar soni yuqori chegarasi.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Bir foydalanuvchi uchun navbatda turgan tranzaksiyalar soni yuqori chegarasi.

Ushbu variantdan foydalanib, to'xtatish usulini qo'llash.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Ushbu vaqtdan keyin agar u hali ham navbatda bo'lsa, bitim bekor qilinadi.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi yumshoq furqonlarni boshqarish yo'nalishlarini amalga oshirish uchun faqat debug-switch. Uni nazorat qilinadigan sinovlardan tashqarida o'chirib qo'ying; uni ishlaydigan ishlab chiqarish tarmog'ida o'zgartirish tugunlarning konsensus xatti-harakatlari haqida kelishmovchiliklarga olib kelishi mumkin.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus Atomik xususiy kelishuv {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` alohida `AtomicPrivateSettlementV1` yo'nalishini boshqaradi. U andoza ravishda o'chiritiladi. `enabled = true` sozlash uchun ham `activation_height` kerak; kirish hali ham yopilmaydi, agar zanjirdagi imkoniyat, xabardorlik muddati, qat'iy dalil profillari va fond / audit boshqaruvi faol bo'lmasa.

Asosiy chegaralar: `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, va `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` O'z navbatida, bu o'simliklarning V1 to'ldirish sinflari. `permitted_policy_versions` faqat qabul qiladi V1.

`max_capsule_bytes` to'liq `PrivateSettlementAuditCapsuleV1` bytesining kanonik Norito baytlarini, shu jumladan AAD, nonce, kodli matn, vektorlar o'rnatish va har bir auditorning DEK qatorini o'lchab oladi; bu faqat kodli matnda bo'lgan chegara emas. Har bir qo'llaniladigan to'ldirish sinflari kamida `default_min_auditor_approvals` auditorlar uchun konservativ butun kapsula qadoqqa mos bo'lishi kerak. Ushbu ruxsat berish sohasi ham tartibga solinadi: Torii yangi qabul qilingan siyosatni `min_approvals` qiymatidan kamroq va har qanday haqiqiy kapsulani kanonik byt chegarasidan ortiqcha rad etadi.

Bu sozlamalarda ishlab chiqarish muhiti o‘zgaruvchisi orqali faollashtirishni chetlab o‘tish yo‘li yo‘q. To‘liq konfiguratsiya namunasi va operatsion talablar uchun [Ma’lumotlar makonlari orasidagi atomik maxfiy hisob-kitobni ishga tushirish](/uz/get-started/atomic-private-settlement) bo‘limiga qarang. Hujjatlashtirilgan tashqi reliz darvozalari o‘tmaguncha bu yo‘l ishlab chiqarish uchun yaroqli emas.

## Oʻrinli snapshot {#snapshot}

Ushbu modul [Jahon holati ko‘rinishi](/uz/blockchain/world#world-state-view-wsv) snapshotlarini o'qish va yozish uchun mas'ul.

Snapshots World State View-ning seriyalangan nazorat punktini saqlaydi, shunda tugun Kura dan har bir blokni takrorlamasdan qayta ishga tushira oladi. Kura davomli blok tarixini va takrorlash uchun haqiqat manbai bo'lib qoladi; snapshots tezlashtirish yo'lidir. Boshlang'ichda Iroha snapshot metadatalarini konfiguratsiya qilingan zanjir va saqlangan bloklar bilan tekshiradi, keyin snapshotni yuklab olish yoki takrorlash haqida qaror qabul qiladi.

::: tip Rasmlarni oʻchirish

Agar snapshotlar tizimida biror narsa noto'g'ri bo'lsa va siz bo'sh sahifadan boshlashni xohlasangiz (snapshotlar bo'yicha), [`snapshot.store_dir`](#param-snapshot-store-dir) tomonidan ko'rsatilgan direktoriyani olib tashlash mumkin.

:::

### `snapshot.mode` {#param-snapshot-mode}

Snapshot tizimi faoliyat ko'rsatadigan rejim.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Urug'lar, mumkin bo'lgan qiymat:

- `read_write`: Iroha ko'rsatilgan muddatga mos o'yinlarni yaratadi: [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Boshlang'ichda Iroha mavjud snapshotni o'qiydi (agar mavjud bo'lsa) va bloklar saqlanishi bilan to'g'riligini tasdiqlaydi.
- `readonly`: `read_write` ga o'xshash, lekin Iroha hech qanday snapshot yaratmaydi.
- `disabled`: Iroha yangi snapshotlarni yaratmaydi va ishga tushirilganda mavjud snapshotlarni o'qib chiqarmaydi.

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

O'yinlarning tez-tezligi.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

O'yinlarni saqlash uchun direktoriya.

Shuningdek, qarang: [`kura.store_dir`](#param-kura-store-dir)

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

## Telemetriya {#telemetry}

Telemetriya tugunlari tashxisini tashqi telemetriya kollektoriga eksport qiladi. Tugunlari to'plamga xabar berishi kerak bo'lganda `telemetry.name` va `telemetry.url` ni sozlash; telemetriyadan foydalanilmaganida, bu bo'limni qoldiring.

`name` va `url` juftlanishi kerak.

`telemetry` bo'limining barchasi fakultativ.

### `telemetry.name` {#param-telemetry-name}

Telemetriyada nodning nomi ko'rsatilishi kerak.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

Telemetriya yig'uvchining WebSocket URL raqami.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Tekir bog'lanishdan oldin kutishning eng kam muddati.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

Qaytadan bog'lanishlar o'rtasidagi kechikishlarni ko'paytirish uchun ishlatiladigan 2 ning maksimal ko'rsatkichi.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Dev-telemetriyani yozish uchun fayl yo'li

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
