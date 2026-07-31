---
translation_locale: az
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Konfiqurasiya parametrləri {#configuration-parameters}

[toc]

## Kök səviyyəsi {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

Hər bir əməliyyatda daxil edilməli olan ID zəncir. Yeniləmə hücumlarının qarşısını almaq üçün istifadə olunur.

Yeniləmə hücumu, etibarlı bir əməliyyatı nəzərdə tutulduğu şəbəkədən fərqli bir şəbəkəyə təqdim etmək cəhdidir. `chain` imzalanan əməliyyat pay yükünün bir hissəsi olduğu üçün, bir zəncir üçün imzalanmış bir əməliyyat digər zəncirdən istifadə edən həmyaşıllılar tərəfindən rədd edilir ID.

<param-table type=string env=CHAIN />

::: kod qrupu

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

Konsensus təsdiqçisi həmkarları BLS-Normal açarlarından istifadə etməlidirlər.

<param-table type="public-key" env="PUBLIC_KEY" />

::: kod qrupu

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

Tərəfdaşın şəxsi açarı. `public_key` ilə uyğun olmalıdır; konsensus təsdiqçisi tərəfdaşlar BLS-Normal açarlardan istifadə etməlidirlər.

<param-table type="private-key" env="PRIVATE_KEY" />

::: kod qrupu

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

Əvvəlcədən müəyyən edilmiş etibarlı həmyaşıdların siyahısı.

Konsensus təsdiqləyiciləri BLS-Normal peer açarlarından istifadə etməlidirlər. Hər bir təsdiqləyici üçün uyğun bir [`trusted_peers_pop`](#param-trusted-peers-pop) girişini də təmin edin.

<param-table env="TRUSTED_PEERS">
<template #type>

P2P ünvanı məlum olduqda `PUBLIC_KEY@ADDRESS` istifadə edin; çılpaq `PUBLIC_KEY` də qəbul edilir və həmyaşıd ünvanının dedikodudan aşkar edilməsinə imkan verir.

</template>
</param-table>

::: kod qrupu

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

BLS təsdiqçi etibarlı həmyaşıdları üçün mülkiyyət sübutunun daxil edilməsi.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` və `pop_hex` sahələri olan obyektlər sırası

</template>
</param-table>

::: kod qrupu

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

## Müqəddəs Kitab {#genesis}

### `genesis.file` {#param-genesis-file}

`kagami genesis sign` tərəfindən istehsal olunan imzalanmış genesis blokunun pay yükünə fayl yolu. Yaradılmış profillər ümumiyyətlə bunu Norito `.nrt` faylı olaraq yazır.

<param-table type="file-path" env="GENESIS" />

::: kod qrupu

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

Genesis açar cütünün ictimai açarı.

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: kod qrupu

```toml [Config File]
[genesis]
public_key = "ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

```shell [Environment]
GENESIS_PUBLIC_KEY="ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

:::

## şəbəkə {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Konsensus (sumeragi) və blok sinxronizasiyası (block_sync) üçün p2p ünvanı.

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: kod qrupu

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

Peer-to-peer ünvanı (xarici, digər həmyaşıdların gördüyü kimi).

Əlaqədar həmyaşıdlara dedikodu ediləcək ki, onlar da digər həmyaşıdalara dedikodu edə bilsinlər.

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: kod qrupu

```toml [Config File]
[network]
public_address = "0.0.0.0:5000"
```

```shell [Environment]
P2P_PUBLIC_ADDRESS=0.0.0.0:5000
```

:::

### `network.block_gossip_size` {#param-network-block-gossip-size}

Bir sinxronlaşdırma mesajında göndərilə bilən blokların miqdarı.

<param-table type=number default-value=4 />

::: kod qrupu

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Ən son blok üçün həmyaşıdlara müraciətlər arasındakı vaxt aralığı.

Daha tez-tez dedikodu etmək sinxronlaşdırma müddətini qısalaşdırır, lakin şəbəkəni həddindən artıq yükləyə bilər.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: kod qrupu

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Xüsusilə dəhşətli mesajda ən çox əməliyyat sayı.

Kiçik ölçüsü sinxronizasiya üçün daha uzun müddət aparır, lakin yüksək paket itkisi varsa faydalıdır.

<param-table type=number default-value=500 />

::: kod qrupu

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Tərəfdaşlar arasındakı bir əməliyyatı gözləyən dedikodu zamanı.

Daha tez-tez dedikodu etmək sinxronlaşdırma müddətini qısalaşdırır, lakin şəbəkəni həddindən artıq yükləyə bilər.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: kod qrupu

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Tərəfdaşın fəaliyyətsiz olduğu təqdirdə həmyaşıdla əlaqənin kəsildiyi müddət müddəti.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: kod qrupu

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii serverinin dinləməli olduğu və müştərilərin müraciət etdikləri ünvan.

<param-table type=socket-addr env=API_ADDRESS />

::: kod qrupu

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

[Torii son nöqtələrinin ](/az/reference/torii-endpoints.md) tərəfindən qəbul edilən xam tələb orqanında maksimum bait sayı.

Bu məhdudluq DOS hücumlarının qarşısını almaq üçün istifadə olunur.

<param-table>
<template #type>

Sayı (baytlar)

</template>
<template #default-value>

`64_000_000` (64 milyon bayt)

</template>
</param-table>

::: kod qrupu

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Bir sorğunun əldə edilmədiyi təqdirdə mağazada qala biləcəyi müddət.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: kod qrupu

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

Canlı sorğuların sayının yuxarı həddi.

<param-table type=number default-value=128 />

::: kod qrupu

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

Yalnız bir istifadəçi üçün canlı sorğuların sayının yuxarı həddi.

<param-table type=number default-value=128 />

::: kod qrupu

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Ağacçı {#logger}

### `logger.level` {#param-logger-level}

Ümumi qeydə alınma sözlüliyi (rafina konfiqurasiya üçün [`logger.filter`](#param-logger-filter) baxın).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

String, mümkün dəyərlər:

- `TRACE`: Aşağı səviyyəli əməliyyatlar da daxil olmaqla, bütün hadisələr.
- `DEBUG`: Debug səviyyəsində mesajlar, diaqnozlaşdırma üçün faydalıdır.
- `INFO`: Ümumi informasiya mesajları.
- `WARN`: Mümkün problemləri göstərən xəbərdarlıqlar.
- `ERROR`: Normal funksiyanı pozmuş, lakin davamlı fəaliyyətə imkan verən səhvlər.

İstifadə halınıza ən uyğun səviyyəni seçin. [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) səhifəsinə baxın və müxtəlif log səviyyələrindən necə istifadə ediləcəyi barədə əlavə məlumat əldə edin.

</template>
</param-table>

::: kod qrupu

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip İndirmə vaxtının yenilənməsi

Bu parametr Torii operatorun son nöqtələri vasitəsilə işləmə vaxtının konfigurasiyasının yenilənməsinə məruz qalır.

:::

### `logger.filter` {#param-logger-filter}

[`logger.level`](#param-logger-level) əlavə edilən təkmilləşdirilmiş log filtrləri.

<param-table type=string env=LOG_FILTER>
<template #type>

String, bir və ya daha çox komada ayrılmış direktivdən ibarətdir. Hər bir direktivə uyğun maksimum verbosity səviyyəsi ola bilər ki, imkan verir (məsələn, seçir) aralıqlar və hadisələr uyğun. Iroha daha az eksklüziv səviyyələri (məsələn, `trace` və ya `info`) daha eksklüziv səviyyələrə nisbətən daha sözlü hesab edir (məs., `error` və ya `warn`).

Yüksək səviyyədədirektivlərin sintaksisinin bir neçə hissəsi vardır:

```
target[span{field=value}]=level
```

Daha ətraflı məlumat üçün [`tracing-subscriber` sənədliyinə baxın ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: kod qrupu

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info [`logger.level`](#param-logger-level) ilə uyğunluq

`logger.filter` [`logger.level`](#param-logger-level) ilə birlikdə işləyir və heç biri digərini ört-basdır etmir.

Məsələn, əgər: `logger.level` təyin edilmişdir: `INFO` və `logger.filter` təyin edilmişdir: `iroha_core=debug`, Nəticədə filtr dəstləri `info,iroha_core=debug` (yəni, `info` bütün modullar üçün, `debug` üçün `iroha_core`).

:::

::: tip İndirmə vaxtının yenilənməsi

Bu parametr Torii operatorun son nöqtələri vasitəsilə işləmə vaxtının konfigurasiyasının yenilənməsinə məruz qalır.

:::

### `logger.format` {#param-logger-format}

Qeydiyyat formatı.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

String, mümkün dəyərlər:

- `full`: Standart formatlaşdırıcı. Bu, baş verən hər hadisə üçün insan tərəfindən oxunula bilən, bir satırlıq qeydlər verir və hadisənin formatlaşdırılmış təmsilindən əvvəl mövcud məsafə kontekstinin göstərilir.
- `compact`: Qısa xətt uzunluqları üçün optimallaşdırılmış standart formatlaşdırıcının bir variantı. Formatlaşdırılan hadisənin sahələrinə hazırkı span kontekstindən olan sahələr əlavə olunur və zaman adları göstərilmir; verbosity səviyyəsi yalnız bir xarakterə qısaldılır.
- `pretty`: İnsanların oxumağı üçün optimallaşdırılmış həddindən artıq gözəl, çox xətti qeydlər buraxır. Bu əsasən yerli inkişaf və düzəldilmədə və ya əmr xətti tətbiqləri üçün istifadə edilmək üçün nəzərdə tutulmuşdur, kitabların avtomatlaşdırılmış təhlili və kompakt saxlanılması oxumaq qabiliyyətindən daha az üstünlük təşkil edən hallarda.
- `json`: Yeni xətti məhdudlaşdırılmış JSON qeydlərin çıxışı. Bu, strukturlu qeydlərin analiz və izləmə vasitələri ilə JSON kimi istehlak edildiyi sistemlərlə istehsal istifadəsi üçün nəzərdə tutulmuşdur. JSON buraxılışı insan oxumaq qabiliyyəti üçün optimallaşdırılmayıb.

Daha ətraflı məlumat və nümunə çıxışı üçün [`tracing-subscriber` sənədliyinə baxın ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: kod qrupu

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura - Iroha davamlı saxlama motoru (anbar üçün yapon dilində)

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Ən çox N son bloklar yaddaşda saxlanılacaq.

Köhnə bloklar yaddaşdan düşəcək və lazım olduqda diskdən yüklənəcək.

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: kod qrupu

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Kura başlanğıc rejimi

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

String, mümkün dəyərlər:

- `strict`: bütün blokların qəti təsdiqlənməsi
- `fast`: Yalnız əsas yoxlamalarla sürətli başlanğıclandırma

</template>
</param-table>

::: kod qrupu

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Bloqların saxlandığı dizaynı təyin edir.

Həmçinin baxın: [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: kod qrupu

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

Console üçün yeni blokların çap edilməsini təmin etmək üçün bayraq.

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: kod qrupu

```toml [Config File]
[kura.debug]
output_new_blocks = true
```

```shell [Environment]
KURA_DEBUG_OUTPUT_NEW_BLOCKS=true
```

:::

## Səyahət {#queue}

### `queue.capacity` {#param-queue-capacity}

Sifarişdə gözləyən əməliyyatların sayının yuxarı həddi.

<param-table type=number default-value=65_536 />

::: kod qrupu

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Bir istifadəçi üçün növbədə gözləyən əməliyyatların sayının yuxarı həddi.

Bu variantdan istifadə edərək dondurma tətbiq edin.

<param-table type=number default-value=65_536 />

::: kod qrupu

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Bu müddətdən sonra əməliyyat hələ də növbədədirsə ləğv ediləcəkdir.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: kod qrupu

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi yumşaq çatal idarəetmə yollarını həyata keçirmək üçün yalnız debug açar. Bunu nəzarət olunan testlərdən kənarda saxlayın; işləyən bir istehsal şəbəkəsində dəyişdirmək həmyaşıdların konsensus davranışı haqqında fikir ayrılığına səbəb ola bilər.

<param-table type=bool default-value=false />

::: kod qrupu

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Hələlik şəkil {#snapshot}

Bu modul [World State View](/az/blockchain/world#world-state-view-wsv) şəklini oxumaq və ya yazmaq üçün məsuliyyət daşıyır.

Snapshots World State View-in seriyalı bir yoxlama nöqtəsini saxlayır, belə ki, bir həmyaşıd Kura -dan hər blokun yenidən oynatılmadan yenidən başlaya bilər. Kura davamlı blok tarixi və yenidən oynamaq üçün həqiqət mənbəyi olaraq qalır; snapshots sürətləndirmə yoludur. Başlanğıc zamanı Iroha bir sürətli görüntüyü yükləmək və ya yenidən oynamaq üçün geri qayıtmaq qərarına gəlmədən əvvəl qurulmuş zəncirlə və saxlanan bloklarla sürətli metadata baxır.

::: tip Şəkilləri silin

Əgər sürətli görüntülər sistemində bir şey səhv olarsa və boş səhifədən başlamaq istəyirsinizsə (sürətli görüntülər baxımından), [`snapshot.store_dir`](#param-snapshot-store-dir) tərəfindən müəyyən edilmiş dizaynı silə bilərsiniz.

:::

### `snapshot.mode` {#param-snapshot-mode}

Snapshot sisteminin işlədiyi rejim.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

String, mümkün dəyərlər:

- `read_write`: Iroha [`snapshot.create_every_ms`](#param-snapshot-create-every-ms) tərəfindən müəyyən edilmiş müddətdə sürətli görüntüləri yaradır. Başlatarkən, Iroha mövcud bir sürətli görüntü (mümkünsə) oxuyur və blokların saxlanılması ilə yenilənməsini yoxlayır .
- `readonly`: `read_write`-ə bənzər, lakin Iroha heç bir sürətli görüntüləri yaratmır.
- `disabled`: Iroha ne yeni sürətli görüntüləri yaratır, nə də başlanğıc zamanı mövcud olanları oxuyur.

</template>
</param-table>

::: kod qrupu

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

Fotoşəkillər tezliyi.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: kod qrupu

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Fotoşəkillərin saxlanılması üçün dizayn.

Bax: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: kod qrupu

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## Telemetriya {#telemetry}

Telemetriya həmkarların diaqnostikasını xarici telemetriya kollektoruna ixrac edir. Həm `telemetry.name` və `telemetry.url` həmkarların bir kollektora hesabat vermələri lazım olduğu zaman təyin edin; telemetriya istifadə edilmədiyi zaman bölməni buraxın.

`name` və `url` cütləşdirilməlidir.

Bütün `telemetry` bölmələri fakultativdir.

### `telemetry.name` {#param-telemetry-name}

Telemetriyada göstərilməlidir ki, nodun adı.

<param-table type=string />

::: kod qrupu

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

Telemetrik kollektorun WebSocket URL

<param-table type=string />

::: kod qrupu

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Yenidən bağlanmadan əvvəl gözləmək üçün minimum vaxt.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: kod qrupu

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

Yenidən əlaqələr arasındakı gecikmələrin artırılması üçün istifadə olunan 2 maksimum eksponenti.

<param-table type=number default-value=4 />

::: kod qrupu

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Developer telemetry yazmaq üçün fayl yolu

<param-table type=file-path />

::: kod qrupu

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
