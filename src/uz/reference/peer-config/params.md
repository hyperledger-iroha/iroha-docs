---
translation_locale: uz
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
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

Zilzila ID har bir muomalaga kiritilishi kerak. Takrorlash hujumlarini oldini olish uchun ishlatiladi.

Takrorlash hujumi - bu haqiqiy operatsiyani boshqa shaxsga yuborishga urinish
tarmoqlari uchun mo'ljallanganidan ko'ra. `chain` qismidir
imzolangan tranzaksiya fayzli yuk, bitta zanjir uchun imzolangan transaksiya rad etiladi
boshqa zanjirdan foydalanuvchi tengdoshlar tomonidan ID.

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

Tengdoshlar uchun umumiy kalit. BLS- Oddiy kalitlar.

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

Tengdoshning xususiy kaliti. `public_key`; konsensusni tasdiqlovchi tengdoshlar
ishlatishi kerak BLS- Oddiy kalitlar.

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

Ishonchli tengdoshlar ro'yxati.

Konsensusni tasdiqlovchilar foydalanishlari kerak BLS-Normal tengdosh kalitlari. Har bir tasdiqlash uchun, shuningdek
moslashtiriladi [`trusted_peers_pop`](#param-trusted-peers-pop) Kirish.

<param-table env="TRUSTED_PEERS">
<template #type>

Tengdoshlar simlari qatoridan foydalanish `PUBLIC_KEY@ADDRESS` qachon P2P manzili ma'lum;
yalang'och `PUBLIC_KEY` shuningdek qabul qilinadi va tengdoshlari manzili aniqlanishiga imkon beradi
g'iybat.

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

BLS Validatorning ishonchli tengdoshlari uchun egalik guvohnomasi yozuvlari.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

Obyektlar qatorlari `public_key` va `pop_hex` maydonlar

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

imzolangan genesis blokining fayl yoʻli `kagami genesis sign`.
Yaratilgan profillar odatda buni Norito `.nrt` fayl.

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

Genesis kalitlari juftligining ommaviy kaliti.

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

Konsensus uchun p2p aloqa manzili (sumeragi) va blok sinxronizatsiyasi (blok)_sinxronlashtirish) maqsadlari.

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

Tengdoshlardan tengdoshlarga aloqasi (tashkil, boshqa tengdoshlar ko'rganidek).

Boshqa tengdoshlarga gapirishlari uchun o'zaro bog'liq tengdoshlariga g'iybat qilinadi.

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

Tek bir sinxronlashtirish xabarida jo'natilishi mumkin bo'lgan bloklar soni.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Eng so'nggi blok uchun tengdoshlarga murojaatlar orasidagi vaqt oralig'i.

Ko'proq g'iybat qilish sinxronlashtirish vaqtini qisqartiradi, ammo tarmoqni ortiqcha yuklashi mumkin.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

G'iybatlar to'plamidagi bitimlarning maksimal soni.

Kichikroq o'lcham sinxronlashtirish uchun uzoq vaqtga olib keladi, ammo agar sizda katta paket yo'qotish bo'lsa foydali.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Tengdoshlar o'rtasidagi bitimni kutish paytida g'iybat qilish davri.

Ko'proq g'iybat qilish sinxronlashtirish vaqtini qisqartiradi, ammo tarmoqni ortiqcha yuklashi mumkin.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Agar tengdosh ishlamasa, tengdosh bilan aloqani tugatish muddati.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Manzil: Torii server tinglashi kerak va mijoz o'z so'rovlarini nimaga bildiradi.

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

Qo'shma organ tomonidan qabul qilingan xom talabnomadagi maksimal baytlar soni
[Torii oxirgi nuqtalar](/uz/reference/torii-endpoints.md).

Ushbu cheklov oldini olish uchun ishlatiladi . DOS hujumlar.

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

Ma'lumotlar do'konda mavjud bo'lmaganida so'rov qolishi mumkin bo'lgan vaqt

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

To'g'ridan-to'g'ri so'rovlar sonining yuqori chegarasi

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

## O'simlik {#logger}

### `logger.level` {#param-logger-level}

_Umumiy_ logging verbosity (qarang) [`logger.filter`](#param-logger-filter) soflashtirilgan konfiguratsiya uchun).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Tirik, mumkin bo'lgan qiymatlar:

- `TRACE`: Barcha tadbirlar, shu jumladan past darajadagi operatsiyalar.
- `DEBUG`: Diagnostika uchun foydali bo'lgan xatolar darajasidagi xabarlar.
- `INFO`: Umumiy axborot xabarlari.
- `WARN`: Muvofiq muammolarni ko'rsatadigan ogohlantirishlar.
- `ERROR`: Oddiy funktsiyani buzadigan, ammo ishlashni davom ettirishga imkon beradigan xatolar.

Foydalanish holatingizga mos keladigan darajani tanlang.
[Toʻplamning ortiqcha oqimi](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) qo'shimcha
turli log darajasini qanday ishlatish kerakligi to'g'risida batafsil ma'lumot.

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

Ushbu parametr oʻtish vaqti konfiguratsiyasi yangilanishiga Torii operator oxirgi nuqtalari.

:::

### `logger.filter` {#param-logger-filter}

Raffinalashtirilgan log filtrlari [`logger.level`](#param-logger-level). Yozib olish ishbilarmonligini moslash imkonini beradi
har bir_maqsad_.

<param-table type=string env=LOG_FILTER>
<template #type>

Qo'riqchi Minorasi Jamiyati (Qo'sh) tomonidan qabul qilingan qarorlar
_darajasi_ (masalan, _uchun tanlaydi_) davomiyligi va o'xshash tadbirlar. Iroha kamroq eksklyuziv darajalarni (masalan,
`trace` yoki `info`) ko'proq so'zlashuvchan bo'lishi kerak (masalan, `error` yoki `warn`).

Yuqori darajadagi direktivlar sintaksi bir nechta qismdan iborat:

```
target[span{field=value}]=level
```

Ko'proq ma'lumot olish uchun
[`tracing-subscriber` hujjatlar](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info Qo'shish [`logger.level`](#param-logger-level)

`logger.filter` ishlar _birgalikda_ bilan [`logger.level`](#param-logger-level) Va bir-birini o'zgartirmaslar.

Masalan, agar `logger.level` o'rnatilgan `INFO` va `logger.filter` o'rnatilgan `iroha_core=debug`, hosil bo'lgan filtr
to ' planadi `info,iroha_core=debug` (ya'ni `info` barcha modullar uchun; `debug` uchun `iroha_core`).

:::

::: tip Ish vaqti yangilanishi

Ushbu parametr oʻtish vaqti konfiguratsiyasi yangilanishiga Torii operator oxirgi nuqtalari.

:::

### `logger.format` {#param-logger-format}

Yozuvlar shakli.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Tirik, mumkin bo'lgan qiymatlar:

- `full`: Bu sodir bo'lgan har bir hodisa uchun inson o'qishi mumkin bo'lgan, bitta satr loglarini beradi.
  hodisani formatlashtirilgan tasvirlashdan oldin ko'rsatiladigan joriy davomiy kontekst.
- `compact`: Qisq satr uzunliklari uchun optimallashtirilgan andoza formatlash vositasining varianti.
  formatlangan hodisa maydonlariga qo'shilgan va o'tish nomlari ko'rsatilmagan; so'zlash darajasi qisqartiriladi
  bitta belgi.
- `pretty`: Bu asosan inson o'qishi uchun optimallashtirilgan juda chiroyli, ko'p chiziqli jurnallar chiqaradi.
  Mahalliy rivojlanish va debuggingda yoki avtomatlashtirilgan tahlil va kompakt bo'lgan buyruq liniyasi dasturlarida ishlatiladi
  loglarni saqlash o'qish va ko'rinishga yoqmaydigan bo'lishdan kamroq ustuvor ahamiyatga ega.
- `json`: Ishlab chiqarishlar yangi chiziq bilan cheklangan JSON loglar. Bu tarkibiy loglar mavjud bo'lgan tizimlarda ishlab chiqarish uchun mo'ljallangan
  iste'mol qilinadi JSON tahlili va ko'rish vositalari orqali. JSON Ishlab chiqarish inson uchun o'qilishi uchun optimallashtirilmagan.

Ko'proq ma'lumot va namunaviy natijalar uchun ko'ring
[`tracing-subscriber` hujjatlar](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

_Kura_ o'zining doimiy saqlash motori Iroha (Yaponcha _ombor_).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Eng ko'p N so'nggi bloklar xotiraga saqlanadi.

Kerak bo'lsa, eski bloklar xotirasidan tashlanadi va diskdan yuklanadi.

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

Kura boshlang'ich usul

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

Tirik, mumkin bo'lgan qiymatlar:

- `strict`: barcha bloklarni qat'iy tasdiqlash
- `fast`: Faqatgina asosiy tekshiruvlar bilan tezkor dastlabkilashtirish

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

Bloklar saqlanadigan direktoriyani [^paths] aniqlaydi.

Shuningdek qarang: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

Konsol uchun yangi bloklarni bosib chiqarish imkonini beradigan bayroq.

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

## Chegara {#queue}

### `queue.capacity` {#param-queue-capacity}

navbatda turgan bitimlar sonining yuqori chegarasi.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Bir foydalanuvchi uchun navbatda turgan tranzaksiyalar sonining yuqori chegarasi.

Ushbu variantdan foydalanib, to'xtatish usulini qo'llash.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Agar u hali ham navbatda bo'lsa, ushbu vaqtdan keyin bitim bekor qilinadi.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Harakat qilish uchun faqat debug switch Sumeragi Bularni tashlab keting.
nazorat qilinadigan sinovlardan tashqarida o'chirib qo'yilgan; ishlab chiqarish tarmog'ida uni o'zgartirish
tengdoshlarning konsensus xulq-atvorida norozi bo'lishi mumkin.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## O ' rtoq {#snapshot}

Ushbu modul "Shuning o'qish va yozish" uchun javobgardir.
[Dunyoga qarash](/uz/blockchain/world#world-state-view-wsv).

O'yin-kulgilar World State Viewning seriyalangan tekshiruv punktini saqlaydi .
har bir blokni oʻynashdan oldin qayta ishga tushirish Kura. Kura chidamli blok bo'lib qoladi
tarix va takrorlash uchun haqiqat manbai; fotosuratlar tezlashtirish yo'li.
Boshlang'ichda Iroha O'rnatilgan zanjir va
fotosuratni yuklab olish yoki takrorlash uchun qaytib kelish haqida qaror qabul qilishdan oldin saqlangan bloklar.

::: tip O ' rnatlarni olib tashlash

Agar bir narsa noto'g'ri bo'lsa snapshots tizimida, va siz boshlov bo'sh sahifadan boshlash istaysiz (shaharda
tezkor fotosuratlar), siz koʻrsatilgan direktoriyani olib tashlashingiz mumkin [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

Snapshot tizimi ishlaydigan rejim.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Tirik, mumkin bo'lgan qiymatlar:

- `read_write`: Iroha ushbu moddaning o'zida belgilangan muddat bilan darrov suratlarni yaratadi:
  [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Boshlang'ichda Iroha mavjud fotosuratni o'qiydi (agar mavjud bo'lsa)
  va bloklarni saqlash bilan to'g'riligini tekshiradi.
- `readonly`: Shunga oʻxshash `read_write` lekin Iroha hech qanday fotosuratlarni yaratmaydi.
- `disabled`: Iroha yangi fotosuratlarni yaratmaydi va mavjud fotosuratni o'qib chiqarmaydi.

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

O'yinlarning tezligi.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

O'yinlarni saqlab qolish uchun direktoriya.

Shuningdek qarang: [`kura.store_dir`](#param-kura-store-dir)

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

Telemetriya tengdoshlari tashxisini tashqi telemetriya to'plamiga eksport qiladi.
ikkalasi `telemetry.name` va `telemetry.url` agar tengdoshlar
Telemetriya ishlatilmaganida, ushbu bo'limni qoldiring.

`name` va `url` juftlash kerak.

Hammasi `telemetry` bo'lim fakultativ hisoblanadi.

### `telemetry.name` {#param-telemetry-name}

Telemetriyada nodning nomi ko'rsatiladi.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

O ' zbekiston Respublikasi WebSocket URL telemetriya to'plamining.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Tekrorat qilishdan oldin kutishning eng kam muddati.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

Qayta aloqadorlik o'rtasidagi kechikishni oshirish uchun ishlatiladigan 2 ning maksimal ko'rsatkichi.

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
