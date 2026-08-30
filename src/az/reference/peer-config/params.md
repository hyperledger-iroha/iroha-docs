---
translation_locale: az
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
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

::: code-group

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

::: code-group

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

::: code-group

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

BLS təsdiqçi etibarlı həmyaşıdları üçün mülkiyyət sübutunun daxil edilməsi.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` və `pop_hex` sahələri olan obyektlər sırası

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

## Müqəddəs Kitab {#genesis}

### `genesis.file` {#param-genesis-file}

`kagami genesis sign` tərəfindən istehsal olunan imzalanmış genesis blokunun pay yükünə fayl yolu. Yaradılmış profillər ümumiyyətlə bunu Norito `.nrt` faylı olaraq yazır.

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

Genesis açar cütünün ictimai açarı.

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

## şəbəkə {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Konsensus (sumeragi) və blok sinxronizasiyası (block_sync) üçün p2p ünvanı.

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

Peer-to-peer ünvanı (xarici, digər həmyaşıdların gördüyü kimi).

Əlaqədar həmyaşıdlara dedikodu ediləcək ki, onlar da digər həmyaşıdalara dedikodu edə bilsinlər.

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

Bir sinxronlaşdırma mesajında göndərilə bilən blokların miqdarı.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Ən son blok üçün həmyaşıdlara müraciətlər arasındakı vaxt aralığı.

Daha tez-tez dedikodu etmək sinxronlaşdırma müddətini qısalaşdırır, lakin şəbəkəni həddindən artıq yükləyə bilər.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Xüsusilə dəhşətli mesajda ən çox əməliyyat sayı.

Kiçik ölçüsü sinxronizasiya üçün daha uzun müddət aparır, lakin yüksək paket itkisi varsa faydalıdır.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Tərəfdaşlar arasındakı bir əməliyyatı gözləyən dedikodu zamanı.

Daha tez-tez dedikodu etmək sinxronlaşdırma müddətini qısalaşdırır, lakin şəbəkəni həddindən artıq yükləyə bilər.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Tərəfdaşın fəaliyyətsiz olduğu təqdirdə həmyaşıdla əlaqənin kəsildiyi müddət müddəti.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii serverinin dinləməli olduğu və müştərilərin müraciət etdikləri ünvan.

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

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

Bir sorğunun əldə edilmədiyi halda mağazada qala biləcəyi müddət.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

Canlı sorğuların sayının yuxarı həddi.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

Yalnız bir istifadəçi üçün canlı sorğuların sayının yuxarı həddi.

<param-table type=number default-value=128 />

::: code-group

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

::: code-group

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

[`logger.level`](#param-logger-level) əlavə edilən təmizlənmiş log filtrləri. Hədəf üçün qeyd verbositetini özelleştirməyə imkan verir.

<param-table type=string env=LOG_FILTER>
<template #type>

String, bir və ya daha çox komada ayrılmış direktivdən ibarətdir. Hər bir direktivə uyğun maksimum verbosity səviyyəsi ola bilər ki, imkan verir (məsələn, seçir) aralıqlar və hadisələrin uyğun. Iroha daha az eksklüziv səviyyələri (məsələn, `trace` və ya `info`) daha çox müstəsna səviyyələrdən daha sözlü hesab edir (məs., `error` və ya `warn`).

Yüksək səviyyədədirektivlərin sintaksisinin bir neçə hissəsi vardır:

```
target[span{field=value}]=level
```

Daha ətraflı məlumat üçün [`tracing-subscriber` sənədliyinə baxın ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info [`logger.level`](#param-logger-level) ilə birlikdə istifadə

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

- `full`: Standart formatlaşdırıcı. Bu, baş verən hər hadisə üçün insan tərəfindən oxunula bilən, bir xətti qeydləri yayır və hadisənin formatlaşdırılmış təmsilindən əvvəl mövcud məsafə kontekstini göstərir.
- `compact`: Qısa xətti uzunluqlar üçün optimallaşdırılmış standart formatlaşdırıcının bir variantı. Formatlaşdırılan hadisə sahələrinə hazırkı span kontekstindən olan sahələr əlavə olunur və span adları göstərilmir; sözversiyyət səviyyəsi tək bir simvolla qısaldılır.
- `pretty`: İnsan oxumaq üçün optimallaşdırılmış həddindən artıq gözəl, çox xətti jurnallar buraxır. Bu əsasən yerli inkişafda və Qərar xətti tətbiqetmələri üçün, avtomatik analizinin və jurnalların kompakt saxlanılmasının oxunma qabiliyyətindən və vizual müraciətdən daha az üstünlük təşkil etdiyi zaman.
- `json`: Yeni xətti məhdudlaşdırılmış JSON qeydlərin çıxışı. Bu, strukturlu qeydlərin analiz və izləmə vasitələri ilə JSON kimi istehlak edildiyi sistemlərlə istehsal istifadəsi üçün nəzərdə tutulmuşdur. JSON buraxılış insan oxunması üçün optimallaşdırılmamışdır.

Daha ətraflı məlumat və nümunə çıxışı üçün [`tracing-subscriber` sənədliyinə baxın ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura - Iroha davamlı saxlama motoru (anbar üçün yapon dilində)

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Ən çox N son bloklar yaddaşda saxlanılacaq.

Köhnə bloklar yaddaşdan düşəcək və lazım olduqda diskdən yüklənəcək.

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

Kura başlanğıc rejimi. `strict` normal və standart rejimdir: qovşağın aktivləşməsindən əvvəl kanonik tarix, bərpa artefaktları, köməkçi indekslər və saxlama mühasibatını təsdiqləyir.

`fast` Təcili vəziyyətə düşmüş xidmət rejimidir, bu da bir Bu, əvvəlcədən initialized saxlama üçün tələb edir `strict` və tam olaraq beş əşyaları ehtiva edən hazırkı sürətli şəkil nəsli: `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`, və `snapshot.merkle.json`. Döminə görə ayrılmış operator imzası reklamda olan pay yükü həzmini və sərhədləndirilmiş manifestı bağlayır. manifesti paylı yükün uzunluğu, zəncir/ şəbəkə kimliyi, terminal hündürlüyü/hashı bağlayır. SCCP siyasət hash, və bootstrap-lineage varlığı. Fast bootstrap rədd edir nəsil və uzunmüddətli ilə eyni dəqiq markalı / say / uç sərhədi tələb edir. Kura. İlk buraxılış qovşaqları tam olaraq bu beş artefaktı qəbul edir və hər digər artefakt sayını və ya fayl adlarını rədd edir.

Bu beş ad və metadataları sürətli inventarlaşdırır. Fayl yükünü və Merkle fayllarını bağlayır, lakin onların məzmunu oxumur, hash etmir, təhlil etmir və ya dekodlamır. İmzalanmış manifestdən minimal bir Dünya / Nexus qurur, dəqiq Kura həş prefiksini yalnız oxumaq üçün xəritə edir və sürətlə World, blok-hash dizini tərk edir. əməliyyat tarixçəsi, mənşəli indekslər və davamlı bərpa jurnalları açılmayıb. Merkle, kanonik və semantik sürətli görüntülərin yoxlanması, tarixi blok/sonluq/SCCP uyğunlaşdırılması, Sumeragi aktiv hündürlükdə bərpa, birləşmə və sorğu jurnalları, yol manifesti/müvafiqlik mənbələri, Kura dəstəklənmiş SoraFS arxivləri, rekursiv saxlama mühasibatlığı və seçmə xidmətləri uyğunlaşdırıcıları təxirə salınıb. Yerli əməliyyatların qəbul edilməsi, təkliflər, səsvermə, kanonik yazılar və köməkçi istehsalçılar məhdudlaşır. Kura özü yazıçının başlanğıcını və davamlı mutasiyaları rədd edir; boru xəttləri və FASTPQ davamlılıq sıraları onu saxlamaq və ya kodlaşdırmaq əvəzinə işləri dərhal rədd edirlər. Kura oxuyun APIs həmçinin təmir və davamlılıq-sinkronizasiya davranışını söndürün: müvəqqəti yan avtomobillər təbliğ edilmir, yoxa çıxan zolaq artefaktları nəşr olunmur və irəliləyiş maneələri tənzimlənmir. Sumeragi və əməliyyat dedikoduları başlatılmır. Torii yalnız sağlamlıq, canlılıq, hazırlıq, həmyaşıd və konfigurasiya əməliyyatlarını açıqlayır; API-versiya, status, metriklər və bütün adi vəziyyət / tarix yolları mövcud deyil.

`fast` yalnız bir hadisə üçün istifadə edin. Xidmət sabit olduqda, düyünü dayandırın, `strict` bərpa edin və yenidən başlatın ki, hər təxirə salınan yoxlama və indeks yenidən qurulması istehsalı bərpa edilməzdən əvvəl işləsin. Sürətli rejim təxirə salınmış birləşmə qeydini tələb etmir və kanonik saxlama yaratmır, təmir olunmur, kəsilmir və ya idxal edilmir; nəşr edilməmiş sufikslər və gözlənilir köməkçi bərpa mərhələləri oxunmadan və ya mutasiya etmədən unudulur və sonra Sərt bərpa üçün qalır. İndirilən yalnız hash sürətli görüntülərin nəsli hələ də mövcud deyil. Yoxuyan və ya etibarsız olan cari sürət görüntüsü dərhal uğursuz olur; Sürətli heç vaxt boş bir dünyaya və ya tarixi yenidən yaratma yenidən qurulmasına qayıtmır.

<param-table default-value=strict>
<template #type>

String, mümkün dəyərlər:

- `strict`: tam təsdiqlənmə və normal istehsal
- `fast`: sərhədli fövqəladə başlanğıc, istehsalın bərpasına qədər karantində saxlanılması

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Blokların saxlandığı dizaynı [^paths] göstərir.

Həmçinin baxın: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

Console üçün yeni blokların çap edilməsini təmin etmək üçün bayraq.

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

## Səyahət {#queue}

### `queue.capacity` {#param-queue-capacity}

Səddə gözləyən əməliyyatların sayının yuxarı həddi.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Bir istifadəçi üçün növbədə gözləyən əməliyyatların sayının yuxarı həddi.

Bu variantdan istifadə edərək dondurma tətbiq edin.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Bu müddətdən sonra əməliyyat hələ də növbədədirsə ləğv ediləcəkdir.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi yumşaq çatal idarəetmə yollarını həyata keçirmək üçün yalnız debug açar. Bunu nəzarət olunan testlərdən kənarda saxlayın; işləyən bir istehsal şəbəkəsində dəyişdirmək həmyaşıdların konsensus davranışı barədə fikir ayrılığına səbəb ola bilər.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus Atom özəl məzənnəsi {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` ayrı `AtomicPrivateSettlementV1` yolunu idarə edir. Standart olaraq söndürülmüşdür. `enabled = true` təyinatında da `activation_height` tələb olunur; giriş hələ də silinmir, əgər zəncirdə olan qabiliyyət, bildiriş müddəti, sabit sübut profili və pul/audit idarəetməsi aktiv deyilsə.

Əsas məhdudiyyətlər: `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, və `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` Dərhal artmaqda olan subset olmalıdır V1 Yükləmə dərsləri. `permitted_policy_versions` yalnız qəbul edir V1.

`max_capsule_bytes` tam `PrivateSettlementAuditCapsuleV1` AAD, nonce, şifrəli mətn, vektor çərçivəsi və DEK satırında əhatə olunan hər auditorun qanuni Norito baytlarını ölçür; bu yalnız şifrəli məzmuna aid bir məhdudiyyət deyil. Hər aktivləşdirilmiş doldurma sinifi ən azı `default_min_auditor_approvals` auditorları üçün konservativ bütün kapsula qabığına uyğun olmalıdır. Bu təsdiqləmə parametrləri də idarə olunan mərtəbədir: Torii daha aşağı `min_approvals` dəyərinə malik yeni qəbul edilmiş bir siyasəti rədd edir və qanuni bayt məhdudluğundan yuxarı olan hər hansı bir faktiki kapsulunu rədd edir.

Bu parametrlərdə istehsal mühitinin dəyişən aktivləşdirilməsi bypassı yoxdur. [Run Atomic Private Cross-DataSpace Settlement](/az/get-started/atomic-private-settlement) baxın. tam konfigürasiya nümunəsi və əməliyyat tələbləri üçün. Yolu sənədləşdirilmiş xarici buraxılış qapıları keçənədək istehsal üçün uyğunlaşdırılmır.

## Hələlik şəkil {#snapshot}

Bu modul [World State View](/az/blockchain/world#world-state-view-wsv) şəklini oxumaq və ya yazmaq üçün məsuliyyət daşıyır.

Snapshots World State View-un seriyalı bir yoxlama nöqtəsini saxlayır, belə ki bir həmyaşıd Kura -dan hər blokunu yenidən oynatmadan yenidən başlaya bilər. Kura davamlı blok tarixçəsi və yenidən oynamaq üçün həqiqət mənbəyi olaraq qalır; snapshots sürətləndirmə yoludır. Başlanğıc zamanı Iroha bir sürətli görüntüyü yükləmək və ya yenidən oynamaq üçün geri qayıtmaq qərarına gəlmədən əvvəl qurulmuş zəncirlə və saxlanan bloklarla sürətli metadata baxır.

::: tip Şəkilləri silin

Əgər sürətli görüntülər sistemində bir şey səhv olarsa və boş səhifədən başlamaq istəyirsinizsə (sürətli görüntülər baxımından), [`snapshot.store_dir`](#param-snapshot-store-dir) tərəfindən göstərilən dizaynı silə bilərsiniz.

:::

### `snapshot.mode` {#param-snapshot-mode}

Snapshot sisteminin işlədiyi rejim.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

String, mümkün dəyərlər:

- `read_write`: Iroha [`snapshot.create_every_ms`](#param-snapshot-create-every-ms) tərəfindən müəyyən edilmiş bir müddətdə sürətli görüntüləri yaradır. Başlatarkən, Iroha mövcud bir sürətli görüntüni oxuyur (mümkünsə) və blokların saxlanılması ilə güncellendiyini yoxlayır.
- `readonly`: `read_write`-ə bənzər, lakin Iroha heç bir sürətli görüntüləri yaratmır.
- `disabled`: Iroha ne yeni sürətli görüntüləri yaratır, nə də başlanğıc zamanı mövcud olanları oxuyur.

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

Fotoşəkillər tezliyi.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Fotoşəkillərin saxlanılması üçün dizayn.

Bax: [`kura.store_dir`](#param-kura-store-dir)

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

Telemetriya həmkarların diaqnostikasını xarici telemetriya kollektoruna ixrac edir. Həm `telemetry.name` və `telemetry.url` həmkarların bir kollektora hesabat vermələri lazım olduğu zaman təyin edin; telemetriya istifadə edilmədiyi zaman bölməni buraxın.

`name` və `url` cütləşdirilməlidir.

Bütün `telemetry` bölmələri fakultativdir.

### `telemetry.name` {#param-telemetry-name}

Telemetriyada göstərilməlidir ki, nodun adı.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

Telemetrik kollektorun WebSocket URL

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Yenidən bağlanmadan əvvəl gözləmək üçün minimum vaxt.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

Yenidən əlaqələr arasındakı gecikmələrin artırılması üçün istifadə olunan 2 maksimum eksponenti.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

Developer telemetry yazmaq üçün fayl yolu

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
