---
translation_locale: az
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Dünya {#world}

`World` başqa subyektləri ehtiva edən qlobal birləşmədir. `World` aşağıdakılardan ibarətdir:

- Iroha [konfiqurasiya parametrləri](/az/guide/configure/client-configuration.md)
- qeydiyyatda olan həmyaşıdlar
- qeydiyyatdan keçmiş domenlər
- qeydiyyata alınmış [qəsd edənlər](/az/blockchain/triggers.md)
- qeydiyyatdan keçmiş [rolllar ](/az/blockchain/permissions.md#permission-groups-roles)
- qeydiyyatdan keçmiş [ icazə simvollarının tərifləri ](/az/blockchain/permissions.md#permission-tokens)
- Bütün hesablar üçün icazə simvolları
- [Runtime validatorları silsiləsi ](/az/blockchain/permissions.md#runtime-validators)

Domenlər, həmyaşıdlar və ya rollar qeydiyyata alınmış və ya qeydiyyatdan kənarda olan zaman `World` (un) register [ təlimatının hədəfidir ](/az/blockchain/instructions.md).

## Dünya vəziyyətinə baxış (WSV) {#world-state-view-wsv}

Dünya Dövlət Görüntüsü, mövcud blok zinciri vəziyyətinin xatirə təmsilçisidir. `World`, bağlı blok həşləri, əməliyyat indeksləri və indiki dövr üçün seçilən həmyaşıllıları əhatə edir. Tam blok pay yükləri dəyişən WSV məlumatları kimi təkrarlanmaq əvəzinə Kura-dən xidmət olunur.

İndiki WSV Bu, təkcə həqiqətin davamlı mənbəyi deyil. Dayanıqlı tarixlər [Kura](#kura-storage), və WSV yenidən qurula bilər Kura bloklar və ya vəziyyət sürətləndirmədən yüklənir və sonra daha yeni oynamaq ilə tutulur Kura bloklar.

### WSV nəyi izləyir {#what-the-wsv-tracks}

WSV obyekti `World` obyektindən daha genişdir və praktikada aşağıdakıları ehtiva edir:

- `World`: parametrlər, həmyaşıdlar, domenlər, hesablar, aktivlər, NFTs, rollar, icazələr, tetikləyicilər, icraçı məlumatları və digər qeydə alınmış məlumat modelləri obyektləri.
- Məqsədli blok həşləri və ən son məqsədli hündürlük
- sorğular və qəbulu üçün istifadə olunan bloklardan əməliyyat indeksləri
- konsensusla istifadə olunan mövcud və əvvəlki komit topologiyası
- Məqsədli bloklardan alınan, məsələn, məlumatların mövcudluğu öhdəlikləri, qəbulu kursorları, pin niyyətləri və sorğu proqnozlaşdırma markerləri kimi xatirə indeksləri
- Deterministik blok icrası üçün lazım olan iş vaxtı konfigüratsiyası sürətli görüntüləri, məsələn kriptografiya, idarəetmə, boru kəməri, məzmun, hesablama və Nexus parametrləri.

Suallar ümumiyyətlə bu strukturlar üzərində yalnız oxunma `StateView` alır. Bir görünüş sorğu icrası üçün ardıcıl bir sürətdir; o, WSV'nin birbaşa mutasiyasına icazə vermir.

### WSV necə dəyişir {#how-the-wsv-changes}

WSV dəyişikliklər yerinə yetirilmədən əvvəl mərhələlənir. Blok icrası blok miqyaslı bir vəziyyət təbəqəsini yaradır və qəbul edilmiş hər bir əməliyyat öz göstərişlərini tranzaksiya miqyaslı təbəqədə tətbiq edir. Bu əməliyyatlar eyni blok kontekstində həyata keçirilir. Zaman tetikləri blok üçün əməliyyat təsirlərindən sonra qiymətləndirilir.

Konsensus bir blokun öhdəsindən gəldikdən sonra, həmsədr əvvəlcə Kura -da öhdəlik alınmış blokunu sıralayır. Bu sıralama addımı uğursuz olduqda, WSV irəliləmir və konsensus döngəsi blok pay yükünü yenidən sınayır və ya sıralayır . Bloq Kura-nin növbəsinə qəbul edildikdə, Iroha blok effektlərini icra etdikdən sonra tətbiq edir, əldə edilmiş indeksləri yeniləyir və mərhələli WSV dəyişiklikləri bir vəziyyət görünüşü qapanması altında həyata keçirir. Bu oxucuları qismən ötürülmüş bloqa müşahidə etmədən saxlayır.

Konsensus-kritik qayda, həmyaşıdların eyni WSV hədəfləndirilmiş bloklardan əldə etməsi olmalıdır. WSV məlumatları kənarlaşdırma təlimatlarına yerli düzəlişləri düzəltmək və valideynləşdirmə və ya yenidən oynamaq zamanı həmyaşıdaların fikir ayrılığına səbəb olacaqdır.

### Başlanğıc və Yenidən oynamaq {#startup-and-replay}

Başlanarkən Iroha əvvəlcə Kura-ni initialize edir və saxlanan blok hündürlüyünü öyrənir. Daha sonra bir vəziyyət sürətini yükləməyə çalışır. Bir sürət görüntüsü yoxdursa, ya da bir sürət görünüşü bərpa edilə biləcək kimi rədd edilirsə, Iroha ilkin bir vəziyyət yaradır və Kura-dən öhdəliyin bloqlarını əvəz edir. Bir sürət görüntüsü etibarlı olsa da Kura arxasında, yalnız itkin hündürlük aralığı yenidən oynanır.

Replay saxlanan hər bloku təsdiqləyir, bu hündürlük üçün commit rosterini yenidən qurur, blok effektlərini WSV-ə tətbiq edir və nəticəli vəziyyətini öhdəlikdən çıxarır. Bu o deməkdir ki, Kura WSV üçün bərpa yoludur, snapshots isə bütün zəncirin təkrar oynanılmasının qarşısını almaq üçün optimallaşdırmadır.

## Kura Saxlama {#kura-storage}

Kura Iroha-nin davamlı blok saxlama sistemidir. İmzalanmış blokları və bərpa metadatalarını saxlayır. WSV-nin ikinci dəyişə bilən nüsxəsini saxlamaz.

Kura saxlama [`kura.store_dir`](/az/reference/peer-config/params.md#param-kura-store-dir) ünvanında kökləndirilir. Bu kök daxilində blok məlumatları zolaq və ya segmentə bölünür.

|Yol |Məqsəd|
| --- | --- |
|`blocks/<segment>/blocks.data` |Əlavə Norito çərçivəsində imzalanmış blok pay yükləri. |
|`blocks/<segment>/blocks.index` |Düz ölçülü `(start, length)` xəritə bloklarının hündürlüyü ilə `blocks.data` bytesinə daxil edilir. |
|`blocks/<segment>/blocks.hashes` |Sürətli axtarış və başlanğıc təsdiq üçün həşləri yüksəkliyə görə bloklayın. |
|`blocks/<segment>/blocks.count.norito` |Qeyri-müdafiə olunan blok indekslərinin nə qədər girişinin istifadəsi təhlükəsiz olduğunu qeyd edən davamlı commit marker. |
|`blocks/<segment>/da_blocks/` |Disk büdcəsinin icrası köhnə cəsədləri isti fayldan çıxararkən `blocks.data` xaricində saxlanan blok pay yükləri çıxarılır. |
|`blocks/<segment>/pipeline/sidecars.norito` və `sidecars.index` |Blok hündürlüyünə görə açılmış boru kəmərinin bərpası yan maşınları. |
|`blocks/<segment>/pipeline/roster_sidecars.norito` və `roster_sidecars.index` |Block sinxronizasiyası və yenidən oynamaq üçün istifadə olunan son commit-roster sidecars. |
|`merge_ledger/<segment>.log` |Məhdudlaşdırılmış bloklarla uyğunlaşmış birləşmələr. |
|`commit-rosters.norito` |Son bloklar üçün bağlılıq sertifikatları və təsdiqçi yoxlama məntəqələrinin saxlanılması. |

Kura zəncir üçün kompakt bir xatirə vektorunu saxlayır: hər hündürlükdə blok hashı və, seçim yolu ilə, blok bədənidir. Genesis bloku ehtiyatda qalır və ən son [`kura.blocks_in_memory`](/az/reference/peer-config/params.md#param-kura-blocks-in-memory) qeyri-genesis blokları öz bədənlərini yaddaşda saxlayırlar. Köhnə blok cəsədləri yaddaşdan düşür və lazım olduqda Kura fayllarından yenidən yüklənir.

Başlanğıc zamanı `strict` rejimi blok payloadlarından saxlanan blokları təsdiqləyir və lazım gələrsə hash faylını yenidən yazır. `fast` rejimi saxlanmış hash / indeks metadatalarından başlayır və bu metadata uyğunsuz olduqda ciddi başlanmaya qayıdır. Kura pozulmuş bir quyruğu aşkar edərsə, saxlama son təsdiqlənmiş blokuna qədər kəsir.

Kura bir arxa plan yazıçısı vasitəsilə yeni bloklar yazır. Yazıçı blok payloadları, hashləri və indeks girişlərini əlavə edir, sonra konfigürə edilmiş fsync siyasətinə uyğun olaraq davamlı sayma markerini inkişaf etdirir. Disk büdcəsinin icrası aktiv olduqda, Kura təsdiqlənmiş segmentləri təmizləyə və ya köhnə blok orqanlarını `da_blocks/` -a çıxararaq hash və indeks girişlərini etibarlılıq və axtarış üçün təmin edə bilər.
