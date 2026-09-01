---
translation_locale: az
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: bing-translator-llm

outline: [2, 3]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Konfiqurasiya Parametrləri {#configuration-parameters}

[[məzmun]]

## Kök Səviyyəsi {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

Hər əməliyyata daxil edilməli olan Zəncir ID-si. Yenidən oynatma hücumlarının qarşısını almaq üçün istifadə olunur.

Təkrar oynatma hücumu, etibarlı bir əməliyyatı nəzərdə tutulan şəbəkədən fərqli bir şəbəkəyə təqdim etməyə cəhd etməkdir. Çünki `chain` imzalanmış əməliyyat yüklərinin bir hissəsi olduğundan, bir zəncir üçün imzalanmış əməliyyat başqa bir zəncir ID istifadə edən şəbəkə iştirakçıları tərəfindən rədd edilir.

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

Şəbəkə digərinin açıq açarı. Konsensus təsdiqləyici şəbəkə digəriləri BLS-Normal açarlardan istifadə etməlidir.

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

Şəbəkə həmkarının şəxsi açarı. O, `public_key`-a uyğun olmalıdır; konsensus doğrulayıcı şəbəkə həmkarları BLS-Normal açarlardan istifadə etməlidir.

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

Əvvəlcədən müəyyən edilmiş etibarlı şəbəkə tərəfdaşlarının siyahısı.

Konsensus təsdiqləyiciləri istifadə etməlidir BLS-Normal şəbəkə həmkarı açarları. Hər bir təsdiqləyici üçün uyğun gələn açarı da təmin edin [`trusted_peers_pop`](#param-trusted-peers-pop) giriş.

<param-table env="TRUSTED_PEERS">
<template #type>

Şəbəkə şəbəkə həmkarı sətirlərinin massivi. P2P ünvanı məlumdursa `PUBLIC_KEY@ADDRESS`-dən istifadə edin; tək `PUBLIC_KEY` də qəbul edilir və şəbəkə həmkarı ünvanının şayiələrdən tapılmasına imkan verir.

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

BLS doğrulayıcı etibarlı şəbəkə dostları üçün sahiblik təsdiqi girişləri.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

Objektlərdən ibarət massiv, `public_key` və `pop_hex` sahələri ilə

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

## blokçeyn genesis {#genesis}

### `genesis.file` {#param-genesis-file}

İmzalanmış blockchain genesis blok payloaduna `kagami genesis sign` tərəfindən yaradılan fayl yolu. Yaradılmış profillər bunu adətən Norito `.nrt` faylı kimi yazır.

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

Blockchain başlanğıc açar cütlüyünün açıq açarı.

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

## Şəbəkə {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Konsensus (sumeragi) və blok sinxronizasiyası (block_sync) məqsədləri üçün p2p ünsiyyət ünvanı.

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

Əlaqə-əlaqə ünvanı (xarici, digər şəbəkə iştirakçıları tərəfindən görüldüyü kimi).

Şəbəkə üzvləri arasında yayılacaq ki, onlar da bunu digər şəbəkə üzvlərinə yayımlaya bilsinlər.

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

Tək sinxronizasiya mesajında göndərilə biləcək blokların sayı.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

Ən son blok üçün şəbəkə tərəfdaşlarına sorğular arasındakı zaman intervalı.

Daha tez-tez pıçıldama sinxronizasiya vaxtını qısaldır, lakin şəbəkəni yükləyə bilər.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Gossip paket mesajında maksimum əməliyyat sayı.

Kiçik ölçü sinxronizasiya üçün daha uzun vaxt deməkdir, amma yüksək paket itkisi varsa faydalıdır.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Şəbəkə iştirakçıları arasında gözləyən əməliyyat haqqında söhbət dövrü.

Daha tez-tez pıçıldama sinxronizasiya vaxtını qısaldır, lakin şəbəkəni yükləyə bilər.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Şəbəkə tərəfi boşdursa, şəbəkə tərəfi ilə əlaqənin kəsildiyi vaxta qədər olan müddət.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Torii serverinin dinləməli olduğu və müştəri(lər)in sorğularını göndərdiyi ünvan.

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

[Torii API son nöqtələr](/az/reference/torii-endpoints.md) tərəfindən qəbul edilən xam sorğu bədənindəki maksimum bayt sayı.

Bu limit DOS hücumlarının qarşısını almaq üçün istifadə olunur.

<param-table>
<template #type>

Rəqəm (baytlarla)

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

Əgər giriş edilməzsə, sorğunun mağazada qala biləcəyi müddət.

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

Tək bir istifadəçi üçün eyni anda olan canlı sorğuların maksimum sayı.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Dəryaçı {#logger}

### `logger.level` {#param-logger-level}

Ümumi qeydiyyat detallılığı (bax [`logger.filter`](#param-logger-filter) dəqiqləşdirilmiş konfiqurasiya üçün).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

Sətir, mümkün dəyərlər:

- `TRACE`: Bütün hadisələr, aşağı səviyyəli əməliyyatlar da daxil olmaqla.
- `DEBUG`: Diaqnostika üçün faydalı olan debug səviyyəli mesajlar.
- `INFO`: Ümumi məlumat mesajları.
- `WARN`: Potensial problemləri göstərən xəbərdarlıqlar.
- `ERROR`: Normal funksiyanı pozan, lakin işləməyə davam etməyə imkan verən səhvlər.

İstifadə vəziyyətinizə ən uyğun səviyyəni seçin. Müxtəlif jurnal səviyyələrinin necə istifadə olunması haqqında əlavə məlumat üçün [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) baxın.

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

::: tip proqram təminatı icra mühiti yeniləməsi

Bu parametr Torii operatorunun API son nöqtələri vasitəsilə proqram təminatı icra mühiti konfiqurasiyasının yenilənməsinə tabedir.

:::

### `logger.filter` {#param-logger-filter}

Əlavə olaraq təkmilləşdirilmiş qeyd filtrləri [`logger.level`](#param-logger-level). Hər bir hədəf üçün qeydiyyatın təfərrüat səviyyəsini fərdiləşdirməyə imkan verir.

<param-table type=string env=LOG_FILTER>
<template #type>

Sətir, bir və ya daha çox vergüllə ayrılmış göstərişlərdən ibarətdir. Hər bir göstərişin uyğun maksimum təfsilat səviyyəsi ola bilər ki, bu da uyğun gələn spançları və hadisələri aktivləşdirir (məsələn, seçir). Iroha daha eksklüziv olmayan səviyyələri (məsələn, `trace` və ya `info`) daha eksklüziv səviyyələrdən (məsələn, `error` və ya `warn`) daha çox sözlü hesab edir.

Ümumi səviyyədə, direktivlərin sintaksisi bir neçə hissədən ibarətdir:

```
target[span{field=value}]=level
```

Ətraflı məlumat üçün bax [`tracing-subscriber` sənədləşdirmə](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info Birləşmə ilə [`logger.level`](#param-logger-level)

`logger.filter` birlikdə işləyir [`logger.level`](#param-logger-level) və heç biri digərini üstələməz.

Məsələn, əgər `logger.level` `INFO` olaraq təyin olunubsa və `logger.filter` `iroha_core=debug` olaraq təyin olunubsa, nəticədə yaranan filtr dəsti `info,iroha_core=debug` olacaq (yəni bütün modullar üçün `info`, `iroha_core` üçün `debug`).

:::

::: tip proqram təminatı icra mühiti yeniləməsi

Bu parametr Torii operatorunun API son nöqtələri vasitəsilə proqram təminatı icra mühiti konfiqurasiyasının yenilənməsinə tabedir.

:::

### `logger.format` {#param-logger-format}

Jurnalların formatı.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

Sətir, mümkün dəyərlər:

- `full`: Defolt formatlayıcı. Bu, baş verən hər bir hadisə üçün insan oxunaqlı, tək sətirli qeydlər çıxarır və hadisənin formatlanmış təqdimatından əvvəl cari interval kontekstini göstərir.
- `compact`: Qısa sətir uzunluqları üçün optimallaşdırılmış standart formatlayıcının bir variantı. Cari span kontekstindən alınan sahələr formatlanmış hadisənin sahələrinə əlavə olunur və span adları göstərilmir; səs-küy səviyyəsi bir hərflə qısaldılır.
- `pretty`: İnsan oxunaqlığı üçün optimallaşdırılmış, çoxsətirli, həddindən artıq gözəl loqlar yayır. Bu əsasən yerli inkişafda istifadə olunmaq üçün nəzərdə tutulub və hata ayıklama, və ya komanda xətti tətbiqləri üçün, burada avtomatlaşdırılmış analiz və jurnalların sıx saxlanması oxunaqlılıq və vizual cəlbedicilikdən daha az önəmlidir.
- `json`: Yeni sətirlərlə ayrılmış JSON qeydlərini çıxarır. Bu, analiz və görüntüləmə alətləri tərəfindən JSON kimi istifadə olunan sistemlərdə istehsal üçün nəzərdə tutulub. JSON çıxışı insan oxunaqlığı üçün optimallaşdırılmayıb.

Ətraflı məlumat və nümunə çıxışlar üçün baxın [`tracing-subscriber` sənədləşdirmə](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura Iroha-in (yapon dilində anbar mənasını verir) davamlı yaddaş mühərrikidir.

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

Ən çox N son blok yaddaşda saxlanılacaq.

Əgər lazım olarsa, daha köhnə bloklar yaddaşdan çıxarılacaq və diskdən yüklənəcək.

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

Kura ilkinləşdirmə rejimi. `strict` normal və standart rejimdir: node aktiv olmadan əvvəl tək protokol-standart tarixçəsini, bərpa artefaktlarını, köməkçi indeksləri və saxlama hesabatını təsdiqləyir.

`fast` tam başlanğıc auditi işin dayandırılma riskini yaratdıqda əməliyyat görünürlüğünü bərpa etmək üçün fövqəladə azalmış xidmət rejimidir. Bu, əvvəlcə `strict` tərəfindən ilkinləşdirilmiş yaddaş və dəqiq beş artefaktı ehtiva edən cari zaman nöqtəsində verilənlər baxışı istehsalı tələb edir: `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito` və `snapshot.merkle.json`. Domenlə ayrılmış operator imzası elan edilmiş yükün kriptoqrafik xülasə dəyərini və məhdudlaşdırılmış texniki bəyannaməni bağlayır; Texniki manifest yükləmə uzunluğunu, zəncir/şəbəkə kimliyini, terminalın hündürlüyünü/həşini, SCCP siyasət kriptoqrafik həşini və başlanğıc-nəsil mövcudluğunu müəyyən edir. Fast, bootstrap soyunu rədd edir və davamlı Kura tərəfindən eyni dəqiq marker/say/uç sərhədini tələb edir. İlk buraxılış nodları məhz həmin beş artefakti qəbul edir və digər bütün artefakt sayı və ya fayl adı dəstlərini rədd edir.

Fast həmin beş adı və metadata-nı siyahıya alır, yük və Merkle fayllarına bağlayır, lakin onların məzmununu oxumur, kriptoqrafik xəşləmir, ayırmır və ya deşifrə etmir. O, imzalanmış texniki manifestdən minimal World/Nexus yaradır, dəqiq Kura kriptoqrafik hash prefiksini yalnız-oxunur şəklində xəritələşdirir və zaman nöqtəsi məlumat baxışı World, blok-hash massivi, əməliyyat tarixi, törədilmiş indekslər və davamlı bərpa jurnallarını açmadan saxlayır. Merkle, tək protokol-standart və semantik zaman nöqtəsi verilənlər baxışı auditi, tarixi blok/sonluq/SCCP uzlaşdırması, Sumeragi aktiv-hündürlük bərpası, jurnalların birləşdirilməsi və sorğulanması, icra zolağı manifesti/uyğunluq mənbələri, Kura-sponsorlu SoraFS arxivlər, rekursiv saxlama uçotu və könüllü xidmət uyğunlaşdırıcıları təxirə salınmış qalır. Yerli əməliyyat qəbulu, təkliflər, səsvermə, tək protokol-standart yazılar və köməkçi istehsalçılar deaktiv edilmiş qalır. Kura özü yazıçı başlatma və davamlı mutasiyaları rədd edir; proqram təminatının emal iş axını və FASTPQ davamlılıq növbələri işi saxlamaq və ya kodlamaq əvəzinə dərhal rədd edir. Kura oxu APIs həmçinin təmir və davamlılıq-sinxronizasiyası davranışını deaktiv edir: müvəqqəti köməkçi qeydlər irəli deyil, çatışmayan icra zolağı artefaktları nəşr edilmir və irəliləyiş baryerləri fsynclanmır. Sumeragi və tranzaksiya şayiəsi işə salınmır. Torii yalnız sağlamlıq, canlılıq, hazırlıq, şəbəkə yoldaşı və konfiqurasiya əməliyyatlarını açır; API-versiya, vəziyyət, göstəricilər və bütün adi vəziyyət/tarix marşrutları mövcud deyil. Hazırlıq Strict restart edilənə qədər mövcud olmur.

`fast`-dan yalnız bir hadisə üçün istifadə edin. Xidmət sabit olduqda, node-u dayandırın, `strict`-i bərpa edin və yenidən başladın ki, bütün gecikdirilmiş yoxlamalar və indeks yenidənqurmaları istehsal davam etməzdən əvvəl işləsin. Sürətli rejim təxirə salınmış birləşdirmə jurnalını tələb etmir və tək protokol-standart saxlama yaratmır, təmir etmir, qısaldmır və ya idxal etmir; nəşr olunmamış sonluqlar və gözləyən əlavə bərpa mərhələləri oxunmadan və ya dəyişdirilmədən nəzərə alınmır, sonra isə Sərt bərpaya buraxılır. İdxal edilmiş yalnız hash-əsaslı zaman nöqtəsi məlumat baxışı xətləri hələ mövcud deyil. Əksik və ya etibarsız mövcud zaman nöqtəsi məlumat baxışı dərhal çatışmazlıq verir; Fast heç vaxt boş-dünya və ya tarixi təkrar qurmağa qayıtmır.

<param-table default-value=strict>
<template #type>

Sətir, mümkün dəyərlər:

- `strict`: tam təsdiq və normal istehsal
- `fast`: məhdudlaşdırılmış fövqəladə işə başlama ilə istehsal sərt yenidən başlatmaadək karantindədir

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Blokların saxlanıldığı kataloqu [^paths] göstərin.

Bax həmçinin: [`snapshot.store_dir`](#param-snapshot-store-dir).

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

Yeni blokların konsola çap edilməsini aktivləşdirmək üçün bayraq.

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

## Növbə {#queue}

### `queue.capacity` {#param-queue-capacity}

Növbədə gözləyən əməliyyatların sayının yuxarı həddi.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

Tək bir istifadəçi üçün növbədə gözləyən əməliyyatların sayı üzrə yuxarı hədd.

Təzyiqi tətbiq etmək üçün bu seçimi istifadə edin.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

Əgər əməliyyat hələ də növbədədirsə, bu vaxtdan sonra ləğv ediləcək.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Yalnız təhlil rejimi üçün Sumeragi soft-fork işləmə yollarını sınamaq üçün keçid. Bu keçidi nəzarət olunan testlərdən kənarda söndürülmüş halda buraxın; işləyən istehsal şəbəkəsində onu dəyişmək şəbəkə iştirakçılarının konsensus davranışı barədə razılaşmamasına səbəb ola bilər.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus Atomic Private maliyyə əməliyyatının hesablaşması {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` ayrıca `AtomicPrivateSettlementV1` yolunu idarə edir. O, standart olaraq söndürülüb. `enabled = true` təyin edildikdə `activation_height` də tələb olunur; zəncirdaxili imkan, bildiriş müddəti, sabit sübut profili və protokol qrupu/audit idarəetməsi aktiv deyilsə, qəbul prosesi təhlükəsiz şəkildə bağlı qalır.

Əsas sərhədlər `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records` və `sidecar_max_total_bytes`-dir. `capsule_padding_classes_bytes` V1 dolğu siniflərinin sıx artan alt dəsti olmalıdır. `permitted_policy_versions` yalnız V1-ü qəbul edir.

`max_capsule_bytes` tam `PrivateSettlementAuditCapsuleV1`-in tək protokol-standart Norito baytlarını ölçür, o cümlədən AAD, kriptoqrafik nonce dəyəri, şifrələnmiş mətn, vektor çərçivəsi və hər bir auditor tərəfindən qablaşdırılmış DEK sətri; bu yalnız şifrələnmiş mətn limiti deyil. Hər aktiv edilən kənar boşluğu sinfi ən azı `default_min_auditor_approvals` auditor üçün konservativ tam kapsul məlumat konteynerinə uyğun olmalıdır. Bu təsdiq parametri həmçinin tənzimlənən bir minimum səviyyədir: Torii daha aşağı `min_approvals` dəyərinə malik yeni qəbul edilmiş polisi rədd edir və tək protokol-standart bayt həddini aşan hər hansı faktiki kapsulu rədd edir.

Bu parametrlərin istehsal mühitinin dəyişənini aktivləşdirməyi keçmək imkanı yoxdur. Tam konfiqurasiya nümunəsi və əməliyyat tələbləri üçün [Atomik Şəxsi Çarpaz Məlumatlar Məkanında maliyyə əməliyyatı hesablaşmasını icra et](/az/get-started/atomic-private-settlement) baxın. Sənədləşdirilmiş xarici buraxılış qapıları keçilməyincə yol istehsal üçün uyğun sayılmır.

## nöqtə-vaxt məlumat baxışı {#snapshot}

Bu modul [Dünya Dövlət Görünüşü](/az/blockchain/world#world-state-view-wsv) üçün vaxt nöqtəsi məlumat baxışlarını oxumaq və yazmaq üçün cavabdehdir.

Nöqtə-vaxt məlumat baxışları Şəbəkə Hissəsinin Həqiqət Baxışının seriyalaşdırılmış yoxlama nöqtəsini saxlayır ki, bir şəbəkə bərabəri hər bloku Kura-dan yenidən oynatmadan yenidən başlada bilsin. Kura davamlı blok tarixi və yenidən oynatmanın həqiqət mənbəyi kimi qalır; nöqtə-vaxt məlumat baxışları sürətləndirmə yoludur. Başlanğıcda, Iroha mövcud bloklar və konfiqurasiya edilmiş zəncirdən əvvəl nöqtə-vaxt məlumat görünüşü metadatasını yoxlayır, sonra isə nöqtə-vaxt məlumat görünüşünü yükləməyə və ya təkrarlamaya geri dönməyə qərar verir.

::: tip Müəyyən zaman nöqtəsinə aid məlumat görüntülərini silmək

Əgər zaman nöqtəsi üzrə məlumat baxışları sistemində bir problem yaranarsa, və siz sıfırdan başlamaq istəyirsiniz (zaman nöqtəsində məlumat görüntüləri baxımından), göstərilən qovluğu silə bilərsiniz [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

Nöqtə-zaman məlumat baxışı sistemi işlədiyi rejim.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

Sətir, mümkün dəyərlər:

- `read_write`: Iroha müəyyən edilmiş dövr ilə məxfi vaxt məlumat görünüşləri yaradır [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Başlanğıcda, Iroha mövcud olan zaman nöqtəsi üzrə verilənlər baxışını oxuyur (əgər varsa) və bunun blok yaddaşı ilə güncəl olduğunu təsdiqləyir.
- `readonly`: `read_write`-ə bənzəyir, amma Iroha heç bir anlıq görüntü yaratmır.
- `disabled`: Iroha başlanğıcda yeni zaman nöqtəsi məlumat görüntüləri yaratmır və mövcud görüntünü oxumur.

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

Şəkil çəkilişlərinin tezliyi.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Yaddaş görüntülərini saxlamaq üçün kataloq.

Bax həmçinin: [`kura.store_dir`](#param-kura-store-dir)

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

Telemetriya şəbəkə həmkarının diaqnostikasını xarici telemetriya yığıcısına ixrac edir. Bir şəbəkə həmkarının yığıcıya hesabat verməsi lazım olduqda həm `telemetry.name`, həm də `telemetry.url` qurun; telemetriya istifadə edilmədikdə bu bölməni buraxın.

`name` və `url` cütləşdirilməlidir.

Bütün `telemetry` bölməsi məcburi deyil.

### `telemetry.name` {#param-telemetry-name}

Telemetryada göstəriləcək düyünün adı.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

Telemetriya toplayıcısının WebSocket URL.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

Yenidən qoşulmadan əvvəl gözləmək üçün minimum müddət.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

Yenidən qoşulmalar arasındakı gecikməni artırmaq üçün istifadə olunan 2-nin maksimum qüvvəti.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

dev-telemetry yazmaq üçün fayl yolu

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
