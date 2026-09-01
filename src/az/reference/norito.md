---
translation_locale: az
translation_source: /reference/norito.md
translation_source_hash: b3b7c03bc0df3f7fa3df7e44b0ec8d755d615f9edca66bbcfe5613c33c8afbfe
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Norito {#norito}

Norito Iroha-in tək protokol-standart seriyalaşdırma təbəqəsidir. Bu, şəbəkə tərəfləri, SDKs, CLI alətləri, Torii, Kura və yaradılmış artefaktlar eyni dəqiq yük haqqında razılaşmalı olduqda istifadə olunan bayt formatıdır.

Məlumat konsensusun, imzalamanın, hash-ləmənin, davamlılığın və ya çarpaz-SDK qarşılıqlı işləmənin bir hissəsi olduqda Norito-dan istifadə edin. Operatorlar, tablolər və ya sürətli səhvlərin düzəldilməsi üçün insan tərəfindən oxuna bilən bir proyeksiyanı açıq şəkildə təklif edən API son nöqtəsi üçün JSON-dən istifadə edin.

## Norito Harada Görünür {#where-norito-appears}

|Səth| Norito necə istifadə olunur|
| --- | --- |
|Əməliyyatlar və sorğular| Torii vasitəsilə göndərilən imzalı əməliyyat və sorğu yükü Norito kimi kodlanır.|
|blokçeyn başlanğıcı| `kagami genesis sign` şəbəkə dostlarının işə düşərkən yüklədiyi imzalanmış `.nrt` bloku yaradır. |
| Torii yazılmış cavablar | API tipli ikili cavabları dəstəkləyən son nöqtələr `Accept: application/x-norito` istifadə edir. |
| SDKs | Rust, Python, JavaScript, Kotlin/Java, Swift və Android müştərilər əl ilə yığılmış baytlar əvəzinə Norito qurucularından və ya bağlamalarından istifadə edirlər.|
|Kura anbar|Blok yükü, bərpa yardımı qeydləri, siyahılar və blokun tamamlanmasını göstərən göstəricilər Norito-çərçivələnmiş məlumat kimi saxlanılır.|
|texniki bəyanatlar| Nexus, məlumat əlçatanlığı, SoraFS, axın və tətbiq yönümlü texniki manifestlər texniki manifestin imzalanması və ya xəşlənməsi lazım olduqda Norito-dən istifadə edir.|
|Axın| Norito Axın Norito texniki manifestlər, seqment başlıqları, nəzarət çərçivələri və uyğunluq cihazları istifadə edir. |

Norito ağıllı müqavilə dili deyil. Bu, əməliyyatları, müqavilə zənglərini, texniki manifesləri və tiplənmiş API yükləri daşıyan deterministik məlumat konteyneri və kodekdir.

## Yük Modeli {#payload-model}

Protokol ötürülməsi zamanı və ya diskteki Norito yükləmə bir başlıq ilə əhatə olunur, ardınca şifrələnmiş yükləmə baytları gəlir. Başlıq olmadan və ya sadə yükləmələr daxili həşləşdirmə, performans ölçmələri və nəticəni dərhal ötürməzdən əvvəl başlıqla əhatə edən köməkçi APIs üçün ayrılır.

|Başlıq sahəsi|Sizə|Məqsəd|
| --- | ---: | --- |
|Sehr|4 bayt|ASCII `NRT0`, qeyri-Norito məlumatları erkən rədd etmək üçün istifadə olunur.|
|Baş|1 bayt|Formatın əsas versiyası. Mövcud yükləmələr `0` istifadə edir.|
|Kiçik| 1 bayt |v1 üçün ipucunu deşifrə et. Mövcud dəyər `0x00` təşkil edir. Bayraqlar düzülüşü təsvir edir.|
|Şema kriptoqrafik həş|16 bayt|Tipli dekoderlər tərəfindən gözlənilməz yükləri rədd etmək üçün istifadə olunan tip identifikatoru.|
|Sıxma| 1 bayt | `0 = None`, `1 = Zstd`. Naməlum dəyərlər rədd edilir.|
|Yük uzunluğu|8 bayt|Azaldılmamış yük uzunluğu kiçik-endian `u64` kimi.|
| CRC64 |8 bayt|Sıxılmamış yükün CRC64-XZ yoxlama cəmi.|
|Bayraqlar| 1 bayt |Sıx uzunluqlar, paketlənmiş ardıcıllıqlar və paketlənmiş strukturlar üçün yerləşdirmə bayraqları.|

Başlıq 40 baytdır. Dekoderlər tipə uyğun dəyəri yenidən yaratmazdan əvvəl sehrli dəyəri, versiyanı, dəstəklənən bayraq maskasını, yük uzunluğunu, yoxlama cəmini və sxem kriptoqrafik xəşini yoxlayır.

## Düzən Bayraqları {#layout-flags}

Norito son başlıq baytında mağaza tərtibat seçimlərini saxlayır. Varsayılan v1 köməkçiləri sıxılmış hər dəyər üçün uzunluq prefiksləri üçün `COMPACT_LEN` (`0x02`) yayımlayır. Açıq şəkildə sabit genişlikli uzunluq prefiksləri, çağıranlar `flags = 0x00` ilə kodlaşdırdıqda oxunaqlı qalır.

|Bayraq|Hex|Status|Təsir|
| --- | ---: | --- | --- |
| `PACKED_SEQ` | `0x01` |Dəstəklənir|Dəyişən ölçülü kolleksiyaları ofset cədvəli ilə birlikdə ardıcıl məlumat bloku ilə kodlaşdırır.|
| `COMPACT_LEN` | `0x02` | Standart | Hər dəyərin uzunluq prefiksi üçün kanonik işarəsiz varintlərdən istifadə edir. |
| `PACKED_STRUCT` | `0x04` |Dəstəklənir|Kodlayıcılar derive ilə yaradılmış strukturları yığılmış sahə yükləri kimi kodlayır.|
| `VARINT_OFFSETS` | `0x08` |Saxlanılıb|v1-də rədd edildi; paketlənmiş ardıcıllıq ofsetləri sabit enlikdədir `u64`.|
| `COMPACT_SEQ_LEN` | `0x10` |Saxlanılıb|v1-də rədd edildi; yuxarı səviyyəli ardıcıllıq uzunluğu başlıqları sabit enli `u64`.|
| `FIELD_BITSET` | `0x20` |Tələblərlə dəstəklənir|Sıxılmış strukturlar üçün yalnız açıq ölçü tələb edən sahələrin ölçü prefikslərini daşıması üçün bir bit dəsti əlavə edir. `PACKED_STRUCT` və `COMPACT_LEN` tələb olunur.|

Bayraqlar açıqdır. Dekoderlər yüklənmiş məlumatın formasından, kiçik versiyadan və ya heurstikadan quruluşu çıxarmırlar. Naməlum və ya düzgün olmayan kombinasiyalar rədd edilir ki, bütün şəbəkə iştirakçıları yüklənmiş məlumatı eyni şəkildə şərh etsinlər.

## Kodlaşdırma Qaydaları {#encoding-rules}

Norito Iroha məlumat modeliində ortaya çıxan ümumi məlumat formaları üçün deterministik yerləşimlərdən istifadə edir:

- Sətirlər `[len][utf8-bytes]`-dır; `len` aktiv ediləndə `COMPACT_LEN`-i izləyir.
- `COMPACT_LEN` təyin edildikdə, hər bir dəyər uzunluğu kompakt varint istifadə edir.
- `COMPACT_LEN` olmadıqda, hər dəyərin uzunluğu 8 baytlıq little-endian `u64` olur.
- Sıra uzunluğu başlıqları v1-də sabit 8 baytlı kiçik sonlu `u64` şəklindədir.
- `Vec<u8>` hər bayt üçün bir uzunluq əvəzinə `[len_u64][raw-bytes]` kimi kodlaşdırılır.
- Yığılımış ardıcıllıqlar, ardınca birləşdirilmiş element yüklərindən sonra `(len + 1)` monoton `u64` ofsetlərindən istifadə edir.
- Xəritələr giriş saylarını sabit `u64` ilə kodlayır və deterministik açar sırasından istifadə edir. `HashMap` girişləri kodlaşdırmadan əvvəl açara görə sıralanır; `BTreeMap` isə təbii sırasından istifadə edir.
- `BigInt` 512-bit həddi və `u32` bayt uzunluğu ilə little-endian iki tamamlayıcı baytlardan istifadə edir.
- `Numeric` `(mantissa, scale)` kimi kodlanır, burada mantissa tam ədədi saxlayır və scale kəsr rəqəmlərinin sayını saxlayır.

Bu qaydalar imzalar və kriptoqrafik xəşlərin vacibdir. Eyni məntiqi əməliyyatı yaradacaq iki SDKs eyni protokol-standart baytları yaratmalıdır.

## Şema kriptoqrafik xəşlər {#schema-hashes}

Tipləşdirilmiş Norito faydalı yükləri başlıqda 16 baytlıq sxem heşi daşıyır. Standart heş tam ixtisaslaşdırılmış tip adından törədilir. Struktur sxem heşləməsini aktiv edən yığımlar isə heşi kanonik sxemdən törədir.

Typed dekoderlər sxema uyğunsuzluqlarını rədd edir. Bu, müştəriləri təsadüfən düzgün Norito çərçivəni səhv tip kimi dekodlamadan qoruyur və SDK test artefakt dəsti node məlumat modeli ilə fərqləndikdə adi uğursuzluq rejimi hesab olunur.

## Sıxılma və Sürətləndirmə {#compression-and-acceleration}

Norito məntiqi yükü dəyişdirmədən açıq və adaptiv sıxılmanı dəstəkləyir:

|Xüsusiyyət|Məqsəd|
| --- | --- |
| `to_bytes` |Sıxılmamış yükü izləyən bir başlığı kodlayın.|
| `to_compressed_bytes` |Zstd ilə kodlayın və sıxılma teqini başlıqda qeyd edin.|
| `to_bytes_auto` |Sıxmanın faydalı olub-olmadığını qərar vermək üçün deterministik heuristikləri tətbiq edin.|
|CRC64 sürətlənmə|Hər yerdə daşınan CRC64-XZ-dan istifadə edir, mövcud olduqda x86_64-də CLMUL və ya aarch64-də PMULL.|
| GPU CRC64 və sıxılma |Seçimli Metal və ya CUDA köməkçilər böyük yükləri sürətləndirə bilər, sonra isə CPU yollarına dönə bilərlər.|

Hardware sürətləndirilməsi heç vaxt dekod edilmiş məzmunu dəyişdirmir. CRC və JSON sürətləndiriciləri daşına bilən çıxışı bitə-biti ilə uyğun olmalıdır. Zstd çərçivə baytları CPU və GPU kodlayıcıları arasında fərqlənə bilər, lakin dekod edilmiş məlumat yükü və Norito başlıq metadatası yoxlama üçün deterministik olaraq qalır.

## JSON Dəstək {#json-support}

Norito API son nöqtələri və JSON tələb edən alətlər üçün yerli JSON stekini əhatə edir və bunu Norito tip sistemi tərk etmədən edir.

| JSON xüsusiyyət |İstifadə vəziyyəti|
| --- | --- |
| `norito::json::{to_json, from_json}` |Deterministik tipli JSON kodlama/dekodlama.|
|Gözəl və yazıçı köməkçilər| CLI çıxış, test artefaktları və axın `std::io` inteqrasiyası. |
| DOM dəyərlər |Norito-ın JSON dəyər modeli vasitəsilə proqramlı manipulyasiya.|
|Sürətli yazdı JSON|İsti DTO yollar üçün struktur-lent əsaslı deşifrə/şifrə.|
|Sıfır-nüsxə oxuyucu|Mümkün olduqda girişdən simvolları götürən token skan edilməsi.|
|1-ci mərhələ akseleratorları|Seçim AVX2, NEON, Metal və ya CUDA struktur indeksləşdirmə ilə skaler əvəzləmə.|

Iroha kodu, tipli API məlumat daşıyıcıları üçün `norito::json` köməkçilərindən istifadə etməyi üstün tutmalıdır. Sadə `serde_json`-in istehsal yollarına əlavə edilməsi, SDKs və Torii çıxarıcılarının gözlədiyi sxem və sahə işləmə davranışından sapma riski yaradır.

## Dəstək əldə et {#derive-support}

Rust məlumat tipləri adətən əl kodlu kodeklərdən daha çox törəmə makroslarından istifadə edir. Törəmə qatı Norito ikili kodeklər, sxemlər və JSON köməkçilər yarada bilər.

Ümumi sahə atributları bunlardır:

|Xüsusiyyət|Təsir|
| --- | --- |
| `#[norito(rename = "other")]` |Şema və JSON uyğunluğu üçün sabit seriyalaşdırılmış ad istifadə edir.|
| `#[norito(skip)]` |Kodlayıcı sahəni atır. Dekoder onun `Default` dəyərini təmin edir.|
| `#[norito(default)]` |Dekodlanmış yük sahəni daşımadıqda `Default` istifadə edir.|
| `#[norito(skip_serializing_if = "...")]` |Qəbul şərti uyğun gəldikdə JSON-dən sahələri atlır, deterministik dekodlama standartlarını qoruyur.|

Derivlər həmçinin mümkün olduqda kodlaşdırılmış uzunluq göstəriciləri və dəqiq uzunluq hesablamalarını ortaya çıxarır. Kodlayıcılar bu göstəricilərdən buferləri ayırmaq və əlavə surətlərdən çəkinmək üçün istifadə edir.

## proqram təminatı paketi Xüsusiyyət Ailələri {#crate-feature-families}

Mənbədən Iroha və ya SDK bağlılıqları qurarkən, Norito xüsusiyyətləri hansı köməkçilərin və sürətləndiricilərin mövcud olduğunu seçir:

|Xüsusiyyət ailəsi|Nəyə imkan verir|
| --- | --- |
| `derive` |İkili, sxem və JSON törəmələri üçün təkrar ixrac edilmiş prosedur makrosları.|
| `compression` |Başlıq-çərçivəli yük üçün Zstd dəstəyi.|
| `packed-seq` |Köçürmə cədvəllərindən istifadə edərək sıxılmış kolleksiya düzənləri.|
| `packed-struct` |Yığılmış derive-tərəfindən yaradılmış struktur tərtibatları.|
| `compact-len` |Hər bir dəyər üçün Varint uzunluq prefiksləri.|
| `columnar` | Norito Sütun Blokları, adaptiv AoS/NCB sıra kodekləri və skan-ağırlıqlı yollar üçün icarəyə götürülmüş görünüşlər; standart `node-codec` xüsusiyyət dəstinə daxildir. |
| `strict-safe` |Səhv yolarda deşifrə paniklərini strukturlaşdırılmış xətalara çevirir.|
| `simd-accel` |CPU mövcud olduqda sürətləndirmə, deterministik ehtiyat planı ilə.|
| `json` | Doğma JSON ayrıştırıcı, yazıcı, DOM, tipli törəmələr və sürətli yollar. |
| `json-std-io` |Oxucu və yazıçı köməkçiləri JSON yığını üzərində təbəqələnmişdir.|
| `metal-stage1`, `cuda-stage1` |İstəyə bağlı GPU JSON struktural-indeks arxa uçları.|
| `metal-stage2` |JSON struktur lent üçün ixtiyari Metal metadata təsnifatı.|
| `metal-crc64`, `cuda-crc64` |Böyük yüklər üçün isteğe bağlı GPU CRC64 köməkçilər.|
| `gpu-compression` |Böyük fayllar üçün isteğe bağlı Metal və ya CUDA Zstd sürətləndirməsi.|
| `stage1-validate` |Sürətləndirilmiş JSON struktural göstəriciləri skalyar çıxışla müqayisə edən səhv ayıklama yoxlaması.|

Funksiyaların mövcudluğu SDKs və buraxılış profilləri arasında fərqlənə bilər. Protokolun binar formatını yerli yığım bayraqları deyil, başlıq və sxem müəyyən edir.

## Torii və Norito RPC {#torii-and-norito-rpc}

Torii bir çox operator marşrutları üçün JSON-ü ortaya çıxarır, lakin tipli ikili marşrutlar Norito-dən istifadə edir. Cari tipli Norito HTTP bədənləri üçün media tipi `application/x-norito`-dır.

Typed Norito qəbul edən və ya qaytaran API uç nöqtəsində bu başlıqlardan istifadə edin:

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

Bir API son nöqtəsi hər iki təqdimatı dəstəklədikdə, müştərilər açıq üstünlük siyahısını göndərə bilərlər:

```http
Accept: application/x-norito, application/json
```

Dekodlaşdırma uğursuzluqları tipli Torii xətası kimi göstərilir və telemetriya tərəfindən sayılır. Ümumi səbəblərə etibarsız sehr, dəstəklənməyən versiya, dəstəklənməyən xüsusiyyət işarəsi, yoxlama cəmi uyğunsuzluğu, pozulmuş UTF-8, etibarsız enum etiketi və sxem uyğunsuzluğu daxildir.

Norito RPC nəqliyyat nəqliyyat konfiqurasiyası vasitəsilə seçilir. Operator panelləri sorğu ləngiməsini, uğursuzluqları, aktiv əlaqələri, cavab baytlarını və `torii_norito_decode_failures_total`-ı JSON trafiki ilə ayrı-ayrılıqda izləməlidir.

## Norito Yayım {#norito-streaming}

Norito Yayım media və real vaxtda ötürmə sahələrinə eyni deterministik yanaşmanı genişləndirir. Onun əsas hissələri bunlardır:

|Axın xüsusiyyəti|Məqsəd|
| --- | --- |
|texniki bəyanatlar|Seqment kriptoqrafik öhdəlik dəyərlərini, məxfilik marşrutlarını, imkanları, kodek profilini, şifrələmə paketini və məzmun açarı metadatasını elan edin.|
|Seqment başlıqları|Seqment nömrəsini, müddətini, kəsik sayını, vaxtlamanı, entropiya rejimini, səs xülasəsini və Merkle köklərini bağlayın.|
| Fraqment öhdəlikləri | İzləyicilərə və retranslyatorlara faydalı yük fraqmentlərini təqdim və ya dekod etməzdən əvvəl manifestə qarşı yoxlamağa imkan verir. |
|Nəzarət çərçivələri|Texniki manifest elanlarını, rəyləri, əsas yeniləmələri və qabiliyyət danışıqlarını daşıyın.|
| HPKE əsas yeniləmələr |Razılaşdırılmış paket və monoton artan sayğaclardan istifadə edərək nəqliyyat sirlərini döndərin.|
|Qabiliyyət üzrə razılaşma|Kəsişir dəstəklənən xüsusiyyət bitləri, datagram məhdudiyyətləri, geribildirim tempi və məxfilik tələbləri.|
| FEC və rəy |İtirilən real vaxt yolları üçün deterministik qəbul hesabatları və bərabərlik qərarlarından istifadə edir.|
|Uyğunluq vektorları|Dil üzrə test artefaktları göstərir ki, SDKs eyni texniki manifestləri, seqmentləri və entropiya axınlarını deşifrə edir.|

Axın üçün xüsusi kodeklər və entropiya profilləri əsas Norito əməliyyat/sorğu formatından ayrı olsa da, onların texniki manifestləri və idarəetmə məlumatları hələ də Norito istifadə edir, beləliklə yönləndirmə, fakturalama, təkrar oynatma və audit sübutları təkrarlana bilən qalır.

## Əməliyyat Təlimatı {#operational-guidance}

- Əl ilə hazırlanmış Norito baytlardan çox, SDK qurucuları və yaradılmış bağlamaları üstün tutun.
- Şema uyğunsuzluğunu keçici şəbəkə xətası kimi deyil, versiya və ya test artefaktı problemi kimi qəbul edin.
- Buraxılış və ya onların yaradıldığı hadisə paketindəki `.nrt`, `.norito` və texniki manifesto artefaktlarını arxivləyin.
- İmzalanmış, hash edilmiş və ya saxlanmış məlumatlar üçün həqiqət mənbəyi olaraq Norito-dan istifadə edin. Tabloslar və əl ilə yoxlama üçün JSON proyeksiyalarından istifadə edin.
- Yeni tipli Torii API son nöqtəsi əlavə edərkən, onun JSON, Norito və ya hər ikisini qəbul edib-etmədiyini sənədləşdirin və dəstəklənən məzmun növlərini `/openapi.json`-da göstərin.
- Akseleratoru aktivləşdirməzdən əvvəl, skaler çıxışa qarşı bərabərlik testlərini aparın. Əgər akselerator uğursuz olarsa, deterministik skaler ehtiyat yolundan istifadə edin. Yükləmə semantikasının dəyişməməsi lazımdır.

## Əlaqəli Səhifələr {#related-pages}

- [Torii API son nöqtələr](/az/reference/torii-endpoints.md)
- [blokçeyn başlanğıc istinadı](/az/reference/genesis.md)
- [Məlumat modeli sxemi](/az/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK](/az/guide/tutorials/javascript.md)
- [Python SDK](/az/guide/tutorials/python.md)
- [Swift və iOS SDK](/az/guide/tutorials/swift.md)

## Yuxarı Axın İstinadları {#upstream-references}

- [Norito format tələbləri](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/norito.md)
- [Norito crate README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/norito/README.md)
