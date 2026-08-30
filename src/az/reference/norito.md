---
translation_locale: az
translation_source: /reference/norito.md
translation_source_hash: 5196decc9e42428b787285d9e0f763bfcedabea2b19af618612f4509492c87fc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Norito {#norito}

Norito olan Iroha Kanonik seriallaşdırma qatıdır. SDKs, CLI vasitələr, Torii, Kura, və istehsal olunan əşyaların eyni pay yükü ilə razılaşması lazımdır.

Məlumatlar konsensus, imzalanma, hashinq, davamlılıq və ya SDK arasında qarşılıqlı işləmə qabiliyyətinin bir hissəsi olduqda Norito istifadə edin. Bir son nöqtə operatorlar üçün açıq şəkildə insan oxunacaq projeksiya təklif edərkən JSON istifadə edin.

## Norito görünən yerlər {#where-norito-appears}

|Səth |Norito necə istifadə olunur |
| --- | --- |
|Əməliyyatlar və suallar |Torii vasitəsilə göndərilən imzalanmış əməliyyat və sorğu pay yükləri Norito kimi kodifikasiya olunur. |
|Müqəddəs Kitab |`kagami genesis sign` başlanğıcda yüklənən həmyaşıdların imzalanmış `.nrt` blokunu yaradır. |
|Torii yazılmış cavablar |Tiplənmiş ikitərəfli cavabları dəstəkləyən yekun nöqtələr `Accept: application/x-norito` istifadə edir. |
|SDKs | Rust, Python, JavaScript, Kotlin/Java, Swift, və Android müştərilər istifadə Norito əl ilə yığılmış baytların əvəzinə qurucu və ya bağlayıcılar. |
|Kura saxlama |Blok paylı yüklər, bərpa yan maşınları, siyahılar və commit markerləri Norito çərçivəsində məlumat olaraq saxlanılır. |
|Manifestlər |Nexus, məlumatların mövcudluğu, SoraFS, axın və tətbiqə yönəlmiş manifestolar manifest imzalanması və ya hash edilməsi lazım olduqda Norito istifadə olunur. |
|Axtarış |Norito Streaming Norito manifesti, segment başlıqları, idarəetmə çərçivələri və uyğunluq fixləri istifadə edir. |

Norito ağıllı müqavilə dili deyil, əməliyyatlar, müqavilələr çağırışları, manifestolar və API faydalı yükləri gətirən deterministik zarf və kodekdir.

## Faydalı yük modeli {#payload-model}

Hər simli və ya diskdəki payload Norito kodlanmış payload bytləri ilə bir başlıqla bağlanır. Headersiz və ya çılpaq payloadlar daxili hashinq, benchmark və köməkçi APIs üçün nəzərdə tutulur ki, nəticəni nəqliyyatdan əvvəl dərhal bir başlığa sarır.

|Başlıq sahəsi |Ölçüsü |Məqsəd|
| --- | ---: | --- |
|Sihir.|4 bayt |ASCII `NRT0`, Norito olmayan məlumatları əvvəlcədən rədd etmək üçün istifadə olunur. |
|Mayor .|1 bayt |Əsas versiyanı formatlayın. Hal-hazırda payloadlar `0` istifadə edir. |
|Kiçik |1 bayt |V1 üçün dekodlama ipucu. mövcud dəyər `0x00`. Bayraqlar dizaynı təsvir edir. |
|Şema hashı |16 bayt |Təxmin edilməmiş paylı yükləri rədd etmək üçün tiplənmiş dekoderlər tərəfindən istifadə olunan növ kimliyi |
|Çıxış |1 bayt |`0 = None`, `1 = Zstd`.Məlum olmayan dəyərlər rədd edilir. |
|Layihə yükü uzunluğu |8 bayt |Qeyri-qəsd edilmiş paylı yük uzunluğu `u64` kimi.|
|CRC64 |8 bayt |CRC64-XZ sıxılmamış paylı yükün yoxlama suması. |
|Bayraqlar |1 bayt |Kompakt uzunluqlar, paketlənmiş ardıcıllıqlar və paketlənmiş struktlar üçün dizayn bayraqları. |

Başlıq 40 baytdır. Dekoderlər yazılan dəyərin yenidən qurulmasından əvvəl sehr, versiya, dəstəklənmiş bayraq maskası, payload uzunluğu, yoxlama suması və sxem hashini təsdiqləyirlər.

## Lay-out bayraqları {#layout-flags}

Norito son header byte-də düzəliş seçimlərini saxlayır. Standart v1 köməkçiləri kompakt hər dəyər uzunluğu prefiksləri üçün `COMPACT_LEN` (`0x02`) buraxırlar. Çağrıçılar `flags = 0x00` ilə kodlaşdıqda açıq sabit genişlik uzunluğu prefixləri oxunur.

|Bayraq |Hex |Status |Nəticə |
| --- | ---: | --- | --- |
|`PACKED_SEQ` |`0x01` |Dəstəklənir |Dəyişən ölçülü kolleksiyaları offset cədvəli ilə yanaşı, bitişik bir məlumat bloku ilə kodlaşdırır. |
|`COMPACT_LEN` |`0x02` |Default |Qiymətə görə uzunluq prefiksləri üçün kanonik imzalanmamış varintlərdən istifadə edir. |
|`PACKED_STRUCT` |`0x04` |Dəstəklənir |Kodlaşdırılmış sahə pay yükləri kimi istehsal olunan structs. |
|`VARINT_OFFSETS` |`0x08` |Qeydiyyatda |V1-də rədd edilmişdir; paketlənmiş ardıcıllıq kompensasiyası sabit genişlik `u64`. |
|`COMPACT_SEQ_LEN` |`0x10` |Qeydiyyatda |V1-də rədd edilmişdir; ən yüksək səviyyəli ardıcıllıq uzunluğunun başlıqları sabit genişlik `u64`. |
|`FIELD_BITSET` |`0x20` |Tələblərlə dəstəklənir |Qeydiyyatlı strukturlar üçün bit setini əlavə edir, belə ki yalnız açıq ölçülərə ehtiyacı olan sahələr ölçülü prefiksləri daşıyır. `PACKED_STRUCT` və `COMPACT_LEN` tələb edir. |

Bayraqlar açıqdır. Dekoderlər payload şəklindən, kiçik versiyadan və ya heuristikalardan düzəliş çıxarmır. Bilinməyən və ya etibarsız birləşmələr rədd edilir ki, bütün həmyaşıdlar payloadu eyni şəkildə şərh etsinlər.

## Kodlama qaydaları {#encoding-rules}

Norito Iroha məlumat modellərində göstərilən ümumi məlumat formaları üçün deterministik düzənliklərdən istifadə edir:

- Əlaqələr `[len][utf8-bytes]`; `len` aktivləşdirildiyi zaman `COMPACT_LEN` ilə davam edir.
- `COMPACT_LEN` müəyyən edildikdə, hər dəyər üçün uzunluq kompakt bir varintdən istifadə olunur.
- `COMPACT_LEN` yoxdursa, hər dəyər üçün uzunluq 8 baytlıq kiçik bir ədəd `u64` olur.
- Sequence uzunluğu başlıqları v1-də sabit 8-bayt kiçik endian `u64` var.
- `Vec<u8>` bir bayt üçün bir uzunluq əvəzinə `[len_u64][raw-bytes]` kimi kodifikasiya olunur.
- Yüklənmiş ardıcıllıqlarda `(len + 1)` monoton `u64` offsetlərdən istifadə edilir, bunlardan sonra konkatenləşdirilmiş element pay yükləri.
- Xəritələr giriş saylarını sabit `u64` ilə kodlayır və deterministik açar sırasından istifadə edir. `HashMap` girişləri kodlaşdırmadan əvvəl açarlara görə sıralanır; `BTreeMap` təbii sırasını istifadə edir.
- `BigInt` bir `u32` bayt uzunluğu və 512-bit qapısı olan kiçik indian iki's-komplement bytes istifadə edir.
- `Numeric` `(mantissa, scale)` kimi kodlanır, burada mantissa tam say dəyərini saxlayır və miqyasda hissə rəqəmlərinin sayı saxlanılır.

Bu qaydalar imzalanmalar və hashlər üçün vacibdir. eyni məntiqi əməliyyatı quran iki SDKs eyni kanonik baytları istehsal etməlidir.

## Şəkli hashlar {#schema-hashes}

Tiplənmiş Norito payloadlar başlıqda 16 baytlı sxema hashini əhatə edir. Varsayılan hash tam ixtisaslaşmış növ adından alınır. Struktura sxeminin həşlənməsini təmin edən quruluşlar hashı kanonik sxemanın əvəzinə əldə edirlər.

Tiplənmiş dekoderlər sxem uyğunsuzluqlarını rədd edir. Bu, müştərilərin etibarlı Norito çərçivəsini səhv bir növ kimi təsadüfi olaraq dekod etməsindən qoruyur və SDK qurğu paketinin node məlumat modelindən köçürüldüyü zaman adətən uğursuzluq rejimi olur.

## Çıxış və sürətlənmə {#compression-and-acceleration}

Norito məntiqi pay yükünü dəyişdirmədən açıq və uyğunlaşdırıcı sıxılma dəstəkləyir:

|Xüsusiyyət |Məqsəd|
| --- | --- |
|`to_bytes` |Bir başlığı kodlaşdırın, sonra bir sıxılmamış pay yükü. |
|`to_compressed_bytes` |Zstd ilə kodlaşdırın və başlığındakı sıxılma etiketini qeyd edin. |
|`to_bytes_auto` |Kompressiyanın dəyərli olub olmadığını müəyyən etmək üçün deterministik heuristika tətbiq edin. |
|CRC64 sürətləndirmə | Qeydiyyatdan istifadə CRC64-XZ Hər yerdə, CLMUL x86-də_64 və ya PMULL Aarch64-də mövcud olduqda. |
|GPU CRC64 və sıxılma |Seçilmiş Metal və ya CUDA köməkçiləri böyük paylı yükləri sürətləndirə bilərlər, sonra da CPU yollarına qayıda bilərlər. |

Hardver sürətləndirilməsi heç vaxt şifrələnmiş məzmunu dəyişdirmir. CRC və JSON sürətləndiriciləri portativ çıxışı bit-bit ilə uyğunlaşdırmalıdırlar. Zstd çərçivə baytları CPU və GPU kodlayıcıları arasında fərqlənə bilər, lakin şifrələnən pay yükü və Norito başlıq metadataları təsdiq üçün təyinatlı qalır.

## JSON Dəstək {#json-support}

Norito Norito tipli sistemdən çıxmadan, JSON tələb edən son nöqtələr və alətlər üçün yerli JSON yığınını ehtiva edir.

|JSON xüsusiyyəti |İstifadə halı |
| --- | --- |
|`norito::json::{to_json, from_json}` |Deterministik tiplənmiş JSON kod/dekod. |
|Gözəl və yazıçı köməkçiləri |CLI çıxışı, fixtures və axın `std::io` inteqrasiyası. |
|DOM dəyərləri |Norito -nin JSON dəyər modeli ilə proqram təminatı. |
|Sürətli yazılmış JSON |DTO isti yolları üçün struktur bant əsaslı dekod/kodlaşdırma. |
|Sifir nüsxə oxucusu |Mümkün olduqda girişdən silsilələri borclayan simvol tarama. |
|1-ci mərhələdəki sürətləndiricilər |AVX2, NEON, Metallı və ya CUDA struktur indeksləşdirilməsi skalar geri çəkilmə ilə. |

Iroha kod üstünlük verməlidir. `norito::json` tiplənmə üçün köməkçilər API payloads. düz əlavə `serde_json` İstehsal yolları üçün sxemdən və sahə idarəetməsindən fərqlənən risklər SDKs və Torii çıxarıcılar.

## İstifadəçi dəstəyi {#derive-support}

Rust məlumat növləri ümumiyyətlə manual kod kod əvəzinə mənşəli makrolardan istifadə edir. Norito ikili kodeklər, sxemlər və JSON köməkçilər.

Ümumi sahə xüsusiyyətləri:

|Attribut |Nəticə |
| --- | --- |
|`#[norito(rename = "other")]` |Şema və JSON uyğunluğu üçün sabit seriyalı bir ad istifadə edir. |
|`#[norito(skip)]` |Kodlaşdırıcı sahəni buraxır. Dekoder onun `Default` dəyərini təmin edir. |
|`#[norito(default)]` |`Default` kodlaşdırılmış pay yükünün sahəni daşımadığı zaman istifadə olunur. |
|`#[norito(skip_serializing_if = "...")]` |Deterministik dekodlama standartlarını qoruyaraq predikatın uyğunlaşdığı zaman JSON sahələrini buraxır. |

Nəticələr, mümkün olduqda kodlanmış uzunluq ipucularını və dəqiq uzunluq hesablamalarını da açıqlayır. Kodlaşdırıcılar bu ipucu istifadə edərək tamponu saxlayırlar və əlavə nüsxələrdən çəkinirlər.

## Qutu xüsusiyyətli ailələr {#crate-feature-families}

Iroha və ya SDK bağlamalarını mənbədən qurarkən, Norito xüsusiyyətləri hansı köməkçilərin və sürətləndiricilərin mövcud olduğunu seçir:

|Xüsusiyyət ailəsi |Bunun nəyə imkanı var?|
| --- | --- |
|`derive` |Yenidən ixrac edilən ikili, sxem və JSON mənşəli prosedur makrosu. |
|`compression` |Zstd başlıq çərçivəsində paylı yüklər üçün dəstək. |
|`packed-seq` |Ofset cədvəllərdən istifadə edərək yığılmış kolleksiya düzənlikləri. |
|`packed-struct` |Yüklənmiş mənşəli əmələ gələn struktur tərtibatları. |
|`compact-len` |Varint hər qiymətə uzunluq prefiksləri. |
|`columnar` |Norito Sütun blokları, adaptiv AoS/NCB satır kodekləri və skan ağır yollar üçün alınmış görünüşlər; standart `node-codec` xüsusiyyət dəstində daxil edilmişdir. |
|`strict-safe` |Səhv yolları panikləri strukturlaşdırılmış səhvlərə çevirir. |
|`simd-accel` |CPU təxirə salınması, əgər mövcuddursa, müəyyənləşdirilmiş geri çəkilmə ilə. |
|`json` |Yerli JSON parser, yazıçı, DOM, tiplənmiş mənşəllər və sürətli yollar. |
|`json-std-io` |JSON yığın üzərində qatlanmış oxucu və yazıçı köməkçiləri. |
|`metal-stage1`, `cuda-stage1` |Fərqli GPU JSON struktur indeksinə aid arxa planlar. |
|`metal-stage2` |JSON struktur bantı üçün metal metadata təsnifatı. |
|`metal-crc64`, `cuda-crc64` |Böyük pay yükləri üçün GPU CRC64 yardımçıları. |
|`gpu-compression` |Böyük paylı yüklər üçün metal və ya CUDA Zstd sürətlənməsi. |
|`stage1-validate` |Sürətləndirilmiş JSON struktur indekslərini skalar çıxışı ilə müqayisə edən debug validasiyası. |

Xüsusiyyətlərin mövcudluğu SDKs və buraxılış profilləri arasında fərqlənə bilər. Vay formatı yerli qurma bayraqları ilə deyil, başlıq və sxemlə idarə olunur.

## Torii və Norito RPC {#torii-and-norito-rpc}

Torii məruz qalır JSON bir çox operator marşrutları üçün, lakin tipləşdirilmiş ikili marşrutlar istifadə Norito. Təsvir olunan axının media növü Norito HTTP cəsədlər `application/x-norito`.

Son nöqtə Norito yazıldığında və ya geri qaytarıldıqda bu başlıqları istifadə edin:

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

Bir son nöqtə hər iki təmsilçiliyi dəstəklədiyi zaman müştərilər açıq bir üstünlük siyahısı göndərə bilərlər:

```http
Accept: application/x-norito, application/json
```

Dekodlama səhvləri Torii yazılmış səhvlər kimi ortaya çıxır və telemetriya ilə sayılır. Ümumi səbəblərə etibarsız sehr, dəstəklənməyən versiya, dəstəkləməyən xüsusiyyət bayrağı, yoxlama miqdarı uyğunsuzluğu, yanlış formalaşmış UTF-8, etibarsız enum etiket və sxema uyğunsuzluğu daxildir.

Norito RPC nəqliyyatı nəqliyyat konfigüratsiyası vasitəsilə seçilir. Operator taxtaları tələblərin gecikməsini, uğursuzluqları, aktiv bağlantıları, cavab baytlarını və `torii_norito_decode_failures_total` nəqliyyatını JSON trafikindən ayrı izləməlidirlər.

## Norito Streaming {#norito-streaming}

Norito Streaming eyni deterministik yanaşmanı mediaya və real vaxt nəqliyyat səthlərinə genişləndirir.

|Streaming xüsusiyyəti |Məqsəd|
| --- | --- |
|Manifestlər |Seqment öhdəliklərini, məxfilik yollarını, imkanları, kodek profilini, şifrələmə paketini və məzmun açarının metadatalarını bildirin. |
|Segment başlıqları |Bağlayın bölmə nömrəsi, müddəti, hissə sayı, vaxtlandırma, entropiya rejimi, səs ümumiləşdirməsi və Merkle kökləri. |
|Bəzi öhdəliklər |İzləyicilər və relaylar xidmət etməzdən və ya şifrəmədən əvvəl payload parçalarını manifestə qarşı təsdiq etsinlər. |
|Nəzarət çərçivələri|Açıq elanlar, rəylər, əsas yeniləmələr və imkan danışıqları aparın. |
|HPKE əsas məlumatlar |Mübahisə edilən kompüterdən istifadə edərək nəqliyyat sirlərini fırlatın və monoton dərəcədə artırılan hesablar. |
|Mümkünlük üzrə danışıqlar |Dəstəklənmiş xüsusiyyət bitləri, datagram məhdudiyyətləri, geri bildirmə cadensiyası və məxfilik tələbləri kəsilir. |
|FEC və geri bildirim |Kəsil real vaxt yolları üçün deterministik alıcı hesabatları və parity qərarları istifadə edir. |
|Müvafiqlik vektorları |Dillər arası qurğular SDKs eyni manifestləri, segmentləri və entropiya axınlarını dekodlaşdırır. |

Axtarış xüsusi kodeklər və entropiya profilləri əsas Norito əməliyyat / sorğu formatından ayrıdır, lakin onların manifestoları və nəzarət məlumatları hələ də Norito istifadə edir, buna görə də marşrutlaşdırma, hesablama, yenidən oynamaq və audit sübutları təkrarlana bilər.

## Əməliyyat istiqamətləri {#operational-guidance}

- SDK qurucusu və istehsal olunan bağlamaları əl işlənmiş Norito baytlardan üstün tuturlar.
- Şema uyğunsuzluğuna keçidli bir şəbəkə çatışmazlığı deyil, bir versiya və ya qurğu problemi kimi baxın.
- Arxiv `.nrt`, `.norito` və onları istehsal edən buraxılış və ya hadisələr paketindəki manifest əşyaları.
- İstifadə Norito İmzalanmış, həş edilmiş və ya davamlı məlumatlar üçün həqiqət mənbəyi kimi. JSON Dashboardlar üçün proqnozlar və əl yoxlamaları.
- Yeni Torii final nöqtəsini əlavə edərkən, bu nöqtənin JSON, Norito və ya hər ikisini qəbul edib-etmədiyini sənədləşdirin və dəstəkləyən məzmun növlərini `/openapi` əlamətində göstərin.
- Sürətləndiricini işlətmədən əvvəl, skalar çıxışı ilə bərabərlik sınaqları aparın. Əgər sürətləndiricisi uğursuz olarsa, deterministik skalar geri dönüşü istifadə edin. Faydalı yük semantikası dəyişməməlidir.

## Əlaqəli səhifələr {#related-pages}

- [Torii bitki nöqtələri](/az/reference/torii-endpoints.md)
- [Genesis istinadı](/az/reference/genesis.md)
- [Məlumat modelləri sxemi](/az/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK ](/az/guide/tutorials/javascript.md)
- [Python SDK](/az/guide/tutorials/python.md)
- [Swift və iOS SDK](/az/guide/tutorials/swift.md)

## Əvvəlki istinadlar {#upstream-references}

- [Norito formatının spesifikasiyası](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/norito.md)
- [Norito qutu README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/norito/README.md)
