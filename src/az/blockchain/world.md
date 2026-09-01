---
translation_locale: az
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Dünya {#world}

`World` digər vahidləri ehtiva edən qlobal varlıqdır. `World` aşağıdakılardan ibarətdir:

- Iroha [konfiqurasiya parametrləri](/az/guide/configure/client-configuration.md)
- qeydiyyatdan keçmiş şəbəkə əlaqə nöqtələri
- qeydiyyatdan keçmiş domenlər
- qeydiyyatdan keçmiş [tetikləyicilər](/az/blockchain/triggers.md)
- qeydiyyatdan keçmiş [rollar](/az/blockchain/permissions.md#permission-groups-roles)
- qeydiyyatdan keçmiş [icazə tokeni təyinatları](/az/blockchain/permissions.md#permission-tokens)
- bütün hesablar üçün icazə tokenləri
- [proqram təminatı icra mühiti yoxlayıcılarının zənciri](/az/blockchain/permissions.md#runtime-validators)

Domenlər, şəbəkə həmkarları və ya rollar qeydiyyata alındıqda və ya qeydiyyatdan çıxarıldıqda, `World` (qeydə/alınmadan) [təlimat](/az/blockchain/instructions.md)-in hədəfidir.

## Dünya Dövlət Baxışı (WSV) {#world-state-view-wsv}

Dünya Dövlət Görünüşü, cari blokçeyn vəziyyətinin yaddaşdakı təmsilidir. Buna `World`, təsdiqlənmiş blok kriptoqrafik xəşləri, əməliyyat indeksləri və cari epox üçün seçilmiş şəbəkə tərəfdaşları daxildir. Tam blok yükləri surətlənmiş çevik WSV məlumatları kimi deyil, Kura ünvanından təqdim olunur.

WSV oxunan sorğuları və blok icrasını dəyişdirən vəziyyətdir. Özlüyündə davamlı həqiqətin mənbəyi deyil. Davamlı tarix [Kura](#kura-storage)-də saxlanılır. və WSV Kura bloklarından yenidən qurula bilər və ya bir vəziyyət zaman nöqtəsi məlumat baxışından yüklənə bilər və sonra daha yeni Kura blokları təkrar oynadılaraq tutula bilər.

### WSV Treklər nədir {#what-the-wsv-tracks}

WSV `World` obyektindən daha genişdir. Təcrübədə o, aşağıdakıları ehtiva edir:

- `World`: parametrlər, şəbəkə tərəfdaşları, domenlər, hesablar, aktivlər, NFTs, rollar, icazələr, tetikleyicilər, icraçı məlumatları və digər qeydiyyatdan keçmiş məlumat-modeli obyektləri
- tamamlanmış blok kriptoqrafik xəşləri və son tamamlanmış hündürlük
- sorğular və protokol nəticə qeydləri tərəfindən istifadə olunan əməliyyat-dən-blok indeksləri
- konsensus tərəfindən istifadə olunan cari və əvvəlki protokolun yekunlaşdırılma topologiyası
- tamamlanmış bloklardan əldə edilən yaddaşdaxili indekslər, məsələn, məlumat-mövcudluğu kriptoqrafik öhdəlik dəyərləri, protokol nəticə qeyd göstəriciləri, pin niyyətləri və sorğu proyeksiya markerləri
- determinist blok icrası üçün lazım olan proqram təminatı icra mühiti konfiqurasiyası nöqtə-vaxt məlumat baxışları, məsələn, kriptoqrafiya, idarəetmə, proqram təminatı işləmə iş axını, məzmun, maliyyə əməliyyatlarının həlli və Nexus parametrləri

Sorğular adətən bu strukturlar üzərində yalnız oxumağa icazə verilmiş `StateView` əldə edirlər. Görünüş sorğunun icrası üçün vaxt nöqtəsində ardıcıl məlumat görünüşüdür; bu, WSV-in birbaşa dəyişdirilməsinə imkan vermir.

### WSV Necə Dəyişir {#how-the-wsv-changes}

WSV dəyişikliklər yekunlaşdırılmadan əvvəl mərhələləndirilir. Blok icrası blok-hüdudlu vəziyyət örtüyü yaradır və hər qəbul edilmiş əməliyyat onun təlimatlarını tətbiq edir əməliyyat-məhdudiyyətli örtük. Bu əməliyyatlar tərəfindən işə salınan məlumat tetikleyiciləri eyni blok kontekstində işləyir. Zaman tetikleyiciləri blok üçün əməliyyat təsirlərindən sonra qiymətləndirilir.

Konsensus bir bloku yekunlaşdırdıqdan sonra, şəbəkə tərəfdaşı əvvəlcə yekunlaşmış bloku Kura siyahısına əlavə edir. Əgər bu əlavəetmə mərhələsi uğursuz olarsa, WSV irəliləmir və konsensus dövrü blok yükünü yenidən cəhd edir və ya siyahıya əlavə edir. Blok Kura-in növbəsinə qəbul edildikdə, Iroha icra sonrası blok təsirlərini tətbiq edir, törədilmiş indeksləri yeniləyir və mərhələlənmiş WSV dəyişikliklərini dövlət-görünüş kilidi altında tamamlayır. Bu, oxucuların qismən tamamlanmış bloka baxmasının qarşısını alır.

Konsensus üçün kritik qayda odur ki, şəbəkə iştirakçıları eyni yekunlaşdırılmış bloklardan eyni WSV-ə çatmalıdırlar. WSV məlumatlarına birbaşa lokal dəyişikliklər təlimatları keçib şəbəkə iştirakçılarının təsdiqləmə və ya yenidən oynatma zamanı razılaşmamalarına səbəb olacaq.

### Başlanğıc və Yenidən Oynatma {#startup-and-replay}

Başlanğıcda, Iroha əvvəlcə Kura-i işə salır və saxlanılmış blok hündürlüyünü öyrənir. Sonra vəziyyət snapshotsını yükləməyə çalışır. Əgər müəyyən zaman nöqtəsində məlumat baxışı mövcud deyilsə, və ya müəyyən zaman nöqtəsində məlumat baxışı bərpa edilə bilən kimi rədd edilirsə, Iroha ilkin vəziyyət yaradır və Kura-dən sonlaşdırılmış blokları təkrar oynadır. Əgər zamana görə məlumat görünüşü etibarlıdır, lakin Kura-dən geri qalırsa, yalnız itkin olan hündürlük aralığı təkrar oynadılır.

Replay hər saxlanmış bloku təsdiqləyir, həmin hündürlük üçün protokolun yekunlaşdırma cədvəlini yenidən qurur, blok təsirlərini WSV-ə tətbiq edir və nəticədə yaranan vəziyyəti yekunlaşdırır. Bu o deməkdir ki, Kura WSV üçün bərpa yolu kimi istifadə olunur, eyni zamanda nöqtə-vaxt məlumat baxışları bütün zənciri təkrarlamağı önləyən bir optimallaşdırmadır.

## Kura Saxlama {#kura-storage}

Kura Iroha-in davamlı blok yaddaşıdır. O, imzalanmış blokları və bərpa metadatasını saxlayır. O, WSV-nin ikinci dəyişkən nüsxəsini saxlamır.

Kura yaddaş yerləşir [`kura.store_dir`](/az/reference/peer-config/params.md#param-kura-store-dir). O kök daxilində blok məlumatı icra xətti və ya seqment üzrə bölünür. Bir seqment üçün əsas fayllar bunlardır:

|Yol|Məqsəd|
| --- | --- |
| `blocks/<segment>/blocks.data` |Davamlı Norito-çərçivəli imzalı blok yükləri.|
| `blocks/<segment>/blocks.index` |Sabit ölçülü `(start, length)` girişləri, blok hündürlüyünü `blocks.data`-dəki baytlara uyğunlaşdırır.|
| `blocks/<segment>/blocks.hashes` |Blok kriptoqrafik xəşləri sürətli axtarış və başlanğıc doğrulama üçün yüksəklik üzrə bloklayın.|
| `blocks/<segment>/blocks.count.norito` |Blok indeksi qeydlərindən neçəsinin istifadə üçün təhlükəsiz olduğunu yazan davamlı blok-sonlandırma göstəricisi.|
| `blocks/<segment>/da_blocks/` |Disk-büdcə tətbiqi köhnə blokları isti fayldan çıxaranda, çıxarılan blok yükləri `blocks.data` kənarda saxlanıldı.|
| `blocks/<segment>/pipeline/sidecars.norito` və `sidecars.index` |blok hündürlüyü ilə açarlanan proqram təminatı emal iş axını bərpa köməkçi qeydləri.|
| `blocks/<segment>/pipeline/roster_sidecars.norito` və `roster_sidecars.index` |Son protokolun yekunlaşdırılması — blok sinxronizasiyası və təkrar oynatma üçün istifadə edilən köməkçi siyahı qeydləri.|
| `merge_ledger/<segment>.log` |blokçeyn birləşmə girişləri yekunlaşdırılmış bloklarla uyğunlaşdırıldı.|
| `commit-rosters.norito` |Son bloklar üçün saxlanılmış konsensus yekunlaşdırma sertifikatları və təsdiqləyici yoxlama nöqtələri.|

Kura zəncir üçün kompakt yaddaşda vektor saxlayır: hər hündürlükdə blokun kriptoqrafik xashi və istəyə görə blokun bədəni var. Blokçeyn başlanğıc bloku keşdə saxlanılır və ən son [`kura.blocks_in_memory`](/az/reference/peer-config/params.md#param-kura-blocks-in-memory) Qeyri-genesis blokları bədənlərini yaddaşda saxlayır. Köhnə blok bədəni yaddaşdan çıxarılır və yenidən yüklənir Kura lazım olduqda fayllar.

İlkinləşdirmə zamanı, `strict` rejimi blok yükləmələrindən saxlanmış blokları yoxlayır və lazım olduqda kriptoqrafik həşləmə faylını yenidən yazır. `fast` rejimi saxlanmışdan başlayır hash/index metadata və əgər həmin metadata qeyri-sabitdirsə sərt ilkinləşməyə qayıdır. Əgər Kura korlanmış quyruğu aşkar edirsə, o, yaddaşı son təsdiqlənmiş blokadək məhdudlaşdırır.

Kura yeni blokları fon yazıcısı vasitəsilə yazır. Yazıcı blok yüklərini, kriptoqrafik xəşləri və indeks qeydlərini əlavə edir, sonra isə konfiqurasiya olunmuş fsync siyasətinə uyğun olaraq dayanıqlı say göstəricisini irəliləyir. Disk-büdcə tətbiqi aktiv olduqda, Kura çıxarılmış seqmentləri təmizləyə və ya köhnə blok bədənlərini `da_blocks/` yerinə çıxara bilər, eyni zamanda kriptoqrafik xəşlərlə və indeks girişləri ilə doğrulama və axtarış üçün əlçatanlığı təmin edir.
