---
translation_locale: az
translation_source: /get-started/atomic-private-settlement.md
translation_source_hash: 18b5e9c80bfa5542b996548fd07603a311099f76a4443cf143cd959991f80dc3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Atomic Private Data-Cross-Space Settlement -ni icra edin {#run-atomic-private-cross-dataspace-settlement}

`AtomicPrivateSettlementV1` 2 ilə 255 SORA Nexus məlumat məkanlarından hər birində bir məxfi nizamlanma mərhələsini əlaqələndirir və bir qlobal dövlət əməliyyatında hər bir mərhələni yekunlaşdırır. Rədd edilmiş, bitmiş və ya ləğv olunmuş bir paket heç bir mərhədə tətbiq edilmir. Şəffaf Doğma AMX DvP/PvP ayrı bir protokol yolu olaraq qalır.

::: warning İstifadə status Bu xüsusiyyət tənzimlənir, standart olaraq söndürülür.
Nəşr olunmuş funksional, məxfilik, səhv, performans, təkrarlana bilən quruluş, müstəqil kriptografik baxış və artefakt nəşri qapıları dəqiq buraxılış üçün keçməyənədək real CBDC dəyərinə imkan verməyin:::

## Protokolun nəyi gizlədirdiyi {#what-the-protocol-hides}

Hər bir ayaq sabit iki giriş, üç çıxış xüsusi qeyd sübutundan istifadə edir. Komitə təsdiqçiləri sübutu və qeyri-şəffaf vəziyyət keçidini yoxlayırlar; sadə mətn tərəflərini, aktivləri, məbləği, xatirəni və ya iş nəticəsini qəbul etmirlər. Mümkün olan yerli auditor doldurulmuş audit kapsulunu şifrələyir, bu məzmunu yoxlayır və məqsədlə ayrı bir təsdiq imzalayır. Varsayılan siyasət idarə olunan auditor dəstindən bir təsdiq qəbul edir.

İctimai nəqliyyat vasitəsi və qəbulu bilə-bilə bildirir:

- şəbəkə və paket identifikatorları
- İştirakçı məlumat məkanının yolları və iştirakçı sayı
- Zamanlandırma və müddəti bitən yüksəkliklər
- sabit qeyri-şəffaf yığma identifikatorları, köklər, ləğv edənlər, öhdəliklər və sabit şifrəli mətn boşluqları
- Komitə orqanları və dəqiq 3-dən 4-cü mövcudluq, hazırlamaq və Commit sertifikatları
- sponsor, ictimai şəbəkə haqqı və terminal statusu

Bu məzmun məxfiliyidir, trafik axınının anonimliyi deyil. Zamanlama, iştirakçı sayı, məlumat sahəsinin şəxsiyyəti və sabit qrupun fəaliyyəti ictimaiyyət olaraq qalır. Yalnız bir CBDC ev sahibliyi edən bir məlumat sahəsi, hər hansı bir əsl aktiv identifikatorunun dərc edilməsinə baxmayaraq, əmlakı marşrutdan çıxarıla biləcəkdir.

## İstifadə üçün tələblər {#deployment-requirements}

Aktivləşdirmədən əvvəl operatorlar aşağıdakıların hamısına ehtiyac duyurlar:

1. Hər iştirakçı məlumat sahəsi üçün tam olaraq dörd təsdiqçi, fərqli BLS konsensus açarları və mülkiyyət sübutları ilə
2. Sumeragi DA/RBC hər bir hündürlük üçün imkanlandırılmışdır
3. Hər bir məlumat məkanında idarə olunan gizli hesablama qoruğu və ilkin kök
4. aktiv V1 xüsusi qeyd imkanı və ayrı hesablaşma sübut profili
5. Ən azı bir nəzarət edilən yerli `PrivateSettlementAuditPolicyV1`, o cümlədən ayrı-ayrı auditor imzalanması və hibrid şifrələmə açarları, əsas dövr, yüksəklik etibarlılığı və təsdiqlənmə həddi.
6. Konfiqurasiya edilmiş saxlama dövrü üçün kifayət qədər xüsusi yan avtomobillərin saxlanılması
7. son dövlət daşıyıcısı təqdim edə bilən neytral sponsor hesabı

Auditor həmçinin təsdiqləyici işlətə bilər, lakin ayrı konsensus, auditor imzası və auditor şifrələmə açarlarından istifadə etməlidir. Təyinatlı saxlama müddəti üçün geri çəkilmiş şifrələmə açarlarını saxlayın və ya onları geri götürməzdən əvvəl test kapsulunun yenidən qovulması və idarə edilməsi.

Dörd təsdiqçi orqanı müştəri tərəfindən təmin edilməyən, dövlətə əsaslanır. Manifestin `authority_context_height` hər bir təsdiqçi dəqiq sifariş olunmuş yol / məlumat məkanının siyahısını və aktiv yol inkarnasiyasını həll edir. konsensus vəziyyətində, həll edilmiş hündürlüyü uyğunlaşdırmağı tələb edir və dörd BLS açarı və sahiblik sübutlarını yoxlayır. yükləmək, hazırlamaq və son qəbulu qəbul etmək hamısı eyni tarixi səlahiyyətdən istifadə edir.

## Qəbul etməni qurun {#configure-admission}

Bütün istehsal davranışları node konfigurasiyasından gəlir. Ətraf mühit dəyişdiriciləri bu yolu aktivləşdirə bilməzlər. Göndərilən standart `enabled = false`; xüsusiyyətin söndürülməsini təmin etmək üçün heç bir tənzimləmə spesifik konfigurasyona ehtiyac yoxdur.

İdarəetmə tələb olunan qabiliyyəti qeyd etdikdən sonra və lazımi xəbərdarlıqla aktivləşmə hündürlüyünü seçdikdən sonra, hər müvafiq qovuşunu ardıcıl olaraq konfiqurasiya edin:

```toml
[nexus.atomic_private_settlement]
enabled = true
activation_height = 500000
minimum_activation_notice_blocks = 7200
proof_profile_version = 1
max_participants = 255
max_expiry_blocks = 7200
audit_timeout_blocks = 1200
prepare_timeout_blocks = 1200
commit_timeout_blocks = 1200
capsule_padding_classes_bytes = [4096, 16384, 65536, 262144]
max_proof_bytes = 8388608
max_capsule_bytes = 1048576
max_carrier_bytes = 4194304
sidecar_retention_blocks = 1000000
sidecar_max_records = 256
sidecar_max_total_bytes = 3221225472
default_min_auditor_approvals = 1
permitted_policy_versions = [1]
```

Məsələn, göndərilən V1 məhdudlarından istifadə edir, performans tövsiyəsi deyil. Hərbi sərhədlərin seçilməsindən əvvəl nəzərdə tutulmuş aparat. Üç mərhələli vaxt çıxışı `max_expiry_blocks` daxilində yerləşməlidir və yan avtomobillərin saxlanılması ən azı həmin müddətin bitməsi ilə bağlı olmalıdır.

`max_capsule_bytes` bütün `PrivateSettlementAuditCapsuleV1` kanonik Norito kodlamasını məhdudlaşdırır: AAD, nonce, şifrə mətni, vektor çərçivəsi, auditor kimlikləri və hər bir qovulmuş-DEK sətir. Bu yalnız şifrəmətni məhdudlaşmır. Hər konfigüralaşdırılmış doldurma sinfi ən azı `default_min_auditor_approvals` auditorları üçün konservativ bütün kapsul zarfına uyğun olmalıdır. Torii həmçinin `min_approvals` idarə olunan mərtəbədən aşağı olan yeni qəbul edilmiş bir siyasəti rədd edir və tam kanonik kodlaşması çox böyük olan hər hansı bir faktiki kapsula rədd edir.

`max_carrier_bytes` yalnız sertifikatlaşdırılmış paket deyil, tamamilə qanuni sponsor imzalanmış əməliyyatı məhdudlaşdırır. Sayda qeydə alınmış təlimat çərçivəsi, əməliyyat hakimiyyəti və metadata, ödəniş niyyətini və imzaları əhatə edir. Adi şəbəkə əməliyyat məhdudiyyətləri hələ də müstəqil bir üst sərhəd kimi tətbiq olunur.

Aktivləşdirmə idarə olunan xüsusiyyət aktiv olmadıqda, onun vəziyyəti və aktivləşmə hündürlüyü xəbərdarlıq müddətini yerinə yetirmirsə, tərtib edilmiş sübut profili V1 ilə uyğunlaşmır və zəncirdəki pul və audit qeydləri aktualdır. Konfiqurasiya bayrağının təkcə aktivləşdirilməsi kifayət deyil.

## Hesablama iş axını {#settlement-workflow}

Müştəri sübutları və şifreli kapsülləri yerli şəkildə qurur. Gizli şahidlər yerli cüzdanda və ya yerli işçidə qalmalıdır; onları tətbiqetmə gündəliklərinə, Python obyektlərə, HTTP müraciətlərə və ya davamlı koordinasiya qeydlərinə seriallaşdırmayın.

Kapsul və hər auditor üçün DEK qutu ilə təsdiqlənmiş məlumatlara tam dövlət əsaslı komitənin və `authority_context_height` şəbəkəsinin həndəsi daxildir. Qapalı bir açar başqa siyahıya və ya tarixi səlahiyyət kontekstinə köçürülə bilməz.

Hər bir kanonik ayaqqabı üçün koordinator sonra bu ardıcıllığı yerinə yetirir:

1. Müvəqqəti şifrələnmiş materialı hər dörd təsdiqçiyə yükləyin və 4-dən 3-də dəqiq bir kanonik mövcudluq sertifikatı əldə edin.
2. Səlahiyyətli bir auditorun pulunu götürüb şifrələməsini, ictimai öhdəliklərin yenidən hesablanmasını, yerli siyasəti tətbiq etməsini və təsdiqini təqdim etməsini xahiş edin.
3. Ərizə Dörd təsdiqçidən səslər hazırlayın. Hər bir təsdiqçi deltaları müstəqil olaraq yoxlayır və səsvermədən əvvəl davamlı şəkildə mərhələləndirir. Hər bir mərhələli cavab verən üçün kanonik 3-4 hazırlıq sertifikatı qalır.
4. Hər ayaqqabı hazırlıq sertifikatına sahib olduqdan sonra, dəyişməz tam hazırlıq bariyerini qurun. Kanoniki 3-dən 4-ə bağlı sertifikatları tələb edin və davam etdirin. Koordinator yenidən başladıqda, iştirakçı qovşaqlarından onların lokal olaraq davamlı saxlanmış Prepare və Commit sertifikatlarını sorğulayın. Eyni kvorumu təmsil edən kanonik sertifikatı seçin və davam etməzdən əvvəl onu yenidən paylayın; sertifikatı autentifikasiya edilməmiş lokal keşdən heç vaxt yenidən qurmayın.
5. İstifadəçinin manifestini yazın və tam bir qlobal nəqliyyat vasitəsini təqdim edin. Nəqliyyat vasitəsi bir `FinalizeAtomicPrivateSettlementV1` təlimatı və tam sertifikatlaşdırılmış paketi ehtiva edir. Koordinator və WSV uçuşdan əvvəl qeydə alınmış təlimat çərçivəsindən ibarət olan bütün qutulu yekunlaşdırma təlimatını ölçür. Torii və əsas bir atış daşıyıcı bağlayıcı qüvvəsi `max_carrier_bytes` səlahiyyət, metadata, ödəniş niyyəti və imzalanması daxil olmaqla sponsor tərəfindən imzalanan dəqiq kanonik əməliyyat üzərində tətbiq olunur. Torii bir nəqliyyat vasitəsini səlahiyyətli olduğu kontekstdən əvvəl, son giriş hündürlüyündə və ya sonra ləğv edilə biləcək və ya tənzimlənmiş müddətin ötüb keçdiyi müddətdə ləğv edə bilər.
6. Yerli yan avtomobillərin vəziyyətini dəyişməz qlobal terminal rekordunu uyğunlaşdırana qədər müvəqqəti olaraq qəbul edin.

Rust müştəri bu axını `certify_and_upload_private_settlement_legs_v1`, `prepare_private_settlement_bundle_v1`, `commit_private_settlement_bundle_v1` və `submit_private_settlement_bundle_v1` metodları vasitəsilə aşkar edir. Yenidən başladılmaya qarşı təhlükəsiz koordinasiya `recover_or_prepare_private_settlement_bundle_v1` və `recover_or_commit_private_settlement_bundle_v1` istifadə edir. Komitə və auditor çağırışları açıq rol təsnifatlarını tələb edir; onlar adi hesab imzalayıcısını yenidən istifadə etmirlər.

## Auditor siyasətini təhlükəsiz şəkildə çevirin {#rotate-an-auditor-policy-safely}

Məxfilik idarəetməsinə icazə verilən `RotatePrivateSettlementPoolPolicyV1` təlimatdan istifadə edin. Mövcud idarəetmənin dəqiq dizestini qeyd etməlidir, eyni istiqaməti, pul və aktivləri bağlayan öhdəliyi saxlamalıdır, idarəetmə yenidənqurmasını bir dəfə irəli sürməlidir, daha yeni bir əsas dövrü və fərqli siyasət / idarəetmə dizestlərindən istifadə etməlidir; Qəzetin sərhədi, köklər, ləğv edənlər, çıxışlar, yenidən oynatma dəstləri və yekunlaşmış rəsmlər saxlanılır.

İctimai fondun proqnozu tamamilə əvəz edilmiş siyasət-tədqiqat xəttini saxlayır. Rotasiyadan əvvəl yekunlaşdırılmış bir rüşvət, buna görə də yenidən başlatıldıqdan sonra etibarlıdır və bu dəqiq rüşvətin yenidən oynanılması boş qalır. İstifadə edilməmiş işlərə icazə verilmir: aktivləşdirmə sərhədini keçən hər hansı bir köhnə siyasət qovluğu qlobal vəziyyət dəyişməsindən əvvəl bağlanmır. saxlanan kapsulları açmaq üçün lazım olan bütün köhnə şifrələmə açarlarını saxlayın və ya məhv etməzdən əvvəl idarə olunan və sınaqdan keçirilmiş bir kapsula yenidən örtün.

## Torii marşrut ailəsi {#torii-route-family}

Bu yollar kanonik Norito sorğu və cavab obyektlərindən istifadə edir. təsdiqlənmiş və məhdudlaşdırılmış cavablar xüsusi `no-store` saxlama davranışından istifadə edirlər.

|Əməliyyat |Metod və yol.|Müdir |
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
|Ayaq yüklə |`POST /v1/nexus/private-settlements/legs` |Kanonik hesabın imzası |
|Mövcudluq payı |`POST /v1/nexus/private-settlements/legs/availability-shares` |Kanonik hesabın imzası |
|Səs verməyə hazırlaşın |`POST /v1/nexus/private-settlements/phases/prepare-votes` |Kanonik hesabın imzası |
|Oy verməyə cəlb olun |`POST /v1/nexus/private-settlements/phases/commit-votes` |Kanonik hesabın imzası |
|Dayanmış faza QC |`POST /v1/nexus/private-settlements/phases/certificates` |Kanonik hesabın imzası |
| Mərhələ QCs bərpası | `GET /v1/nexus/private-settlements/legs/{payload_digest}/phase-certificates` | manifest sponsor |
|Ayaq vəziyyəti |`GET /v1/nexus/private-settlements/legs/{payload_digest}/status` |Kanonik hesabın imzası |
|Komitə sübutları |`GET /v1/nexus/private-settlements/legs/{payload_digest}/committee-proof` |dəqiq siyahı təsdiqçisi |
|Audit kapsulaları |`GET /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule` |idarə olunan auditor |
|Auditorun razılığı |`POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-approvals` |idarə olunan auditor |
|Qeydiyyat göndərin |`POST /v1/nexus/private-settlements/bundles` |manifest sponsor |
|Qrupun vəziyyəti |`GET /v1/nexus/private-settlements/bundles/{bundle_id}` |ictimaiyyət |
|Qəbul və ya ləğv.|`GET /v1/nexus/private-settlements/bundles/{bundle_id}/receipt` |ictimaiyyət |

İctimai status və qəbulu APIs yalnız sənədləşdirilmiş ictimai sahələri göstərir. Xüsusilə, adi ayaq vəziyyəti təsdiqləmə sayını və ya idarə olunan auditor həddini göstərmir. Məhdud oxunuşlar məqsədyönlü çöküntülər, icazəsiz və saxlama müddəti başa çatmış material eyni mövcud olmayan reaksiya sinifinə daxil edilir.

## Başarısızlıq və bərpa {#failure-and-recovery}

Eksik və ya köhnə auditor təsdiqləri, üçdən az təsdiqçi səsləri, səhv köklər və ya dövrlər, ikiqat ləğv edənlər, əvəz edilmiş sübutlar və ya kapsullar, qeyri-kanoniki ayaq sıralama, başa çatmış paketlər və uyğun olmayan ödəniş şərtləri qlobal mutasiyadan əvvəl hamısı məhv olur. Məsuliyyətli sertifikatlar heç vaxt özəl dövləti dəyişdirmir.

Validatorlar onları təsdiqləmədən əvvəl yan maşınları, mərhələli deltaları və faza sertifikatlarını sinqronizasiya edirlər. Yenidən başlatdıqdan sonra kanonik davamlı qeydlərdən ehtiyatları yenidən qururlar, sonra dəyişməz qlobal rüşvətləri, ləğv işarələri və ya müddətin bitməsi ilə uyğunlaşdırırlar. Nəzarət olunan bərabərləşdirici, eyni zamanda bərabərləşdirmək üçün terminal namizəd olmadığı halda da sinxron olaraq müşahidə edilən səlahiyyətli hündürlükdə terminal saxlama kəsməsini həyata keçirir. Yalnız nüfuzlu bir qlobal terminal qeydləri mərhələli kilidlər buraxır. Eyni yekun qəbulu yenidən oynamaq idempotentdir; ziddiyyətli bir yenidən oynatma determinist şəkildə uğursuz olur.

Qeydiyyat kimliyi tam marşrutunu əhatə edir. Bulma başlıqları `(route, pool_id, epoch, root)`, ləğv edənlər `(route, pool_id, nullifier)` və çıxışlar `(route, pool_id, commitment)` istifadə edirlər. Başqa bir marşrutda bərabər qeyri-aşkar dəyərlər müstəqildir; yenidən başlanğıcdan sonra dəqiq yol toqquşması kilidlənir.

Əməliyyat xəbərdarlıqlarında yalnız qeyri-şəffaf paket, marşrut, faza, həzm, hündürlük və səbəb sinifi sahələrdən istifadə edilməlidir. Heç vaxt şifrələnmiş kapsullar, hesab və ya aktiv kimlikləri, məbləğlər, qeydlər, görünüş məlumatları, sübut şahidlərini yerləşdirməyin. Ya da jurnallarda, hadisələrdə, metrik etiketlərində və ya izləmə aralıqlarında parser paylı yükləri.

## Əsl dəyərdən əvvəl təsnifat {#qualification-before-real-value}

İstifadə etmək niyyətində olduğunuz tam quruluş və konfigurasiya üçün aşağıdakıları əhatə edən sənədləri arxivləşdirin:

- Mübahisələrə dair sübut, kapsul, siyasət, açar dövriyyəsi, ödəniş və yenidən oynamaq halları
- 2, 3, 4, 8 və 16 məlumat bazası üçün real dörd təsdiqçi prosesləri, təsdiqçi və koordinator yenidən başlaması da daxil olmaqla, təsdiqlənmiş 5%, 10% və 20% mesaj itkisi, mərhələ bölmələri, bərpa və davamlılıq sərhədində qəzalar
- Torii, P2P, bloklar, Kura, sürətli görüntülər, sorğular, hadisələr, qeydlər və telemetriya üzrə kanar və diferensial sızıntı analizi
- real şəbəkə iştirakçılarının sayına görə ən azı beş istilik və otuz ölçülmüş paket, p50, p95, p99, etibar aralıqları, ehtiyatlar, trafik, sübut və qəbulu miqdarı və nəzarət üçün şəffaf AMX ilə
- Sərt iş məkanı sınaqları, xəmir və format yoxlamaları, təsadüfi toxumlar, soak, təkrarlana bilən binalar, SBOMs, və imzalanmış artefakt hashləri
- Hər iki rəsmi təbəqələr: 3/255-ci ayaq sayım simmetriyası yoxlamaları və dəqiq dörd təsdiqçi komitəsi-indeksi N=2 təsdiqçi mərkəzləşdirilmiş əlavə tam məhdudlaşdırılmış səhv, kağız əsaslı N=3 səhv, N=4 təmiz və N=3 sona çatma / yenidən oynatma konfigurasiyası, hər bir komitə üçün səhv büdcələri müstəqil olan
- sübut əlaqələrinin müstəqil araşdırılması, xırda slot seçiciləri, aktiv və kapsul bağlamaları, ödəniş əlaqələri, kriptografiya və çapraz məlumat sahəsi dövlət maşınası

Qırmızı və təmizlənmiş sübutlar, təhlükə modeli, protokol argümanı, məhdudiyyətlər, öhdəlikləri dərc etmək ID, Hardver təsviri və yoxlama hesabatları dəyişməz bir DOI Təkcə repository testləri xüsusiyyətini istehsal üçün uyğun bir əşya çevirmir CBDC Hesablama sistemi.

Hər bir xam səhv icrası və gecikmə nümunəsi tam buraxılış komitini, SHA-256 strukturlaşdırılmış sabitləşdirilmiş hardver təsvirini və SHA-256 iştirakçı sayının dəqiq konfigüratsiyasını bağlamalıdır. N=2,3,4,8,16 əhatə edən bir kanonik konfigurasiya manifestini arxivləşdirin; hər giriş saxlanılan konfigurasiya baytlarına istinad etməlidir və məlumat sahəsi üçün tam olaraq dörd təsdiqçi, 3-dən 4-cü quorum və məcburi imzalanmış RS16 DA/RBC təyin edilməlidir. Çıxış təsdiqçisi fərqli bir quruluş, donanım profili və ya şəbəkə konfigüratsiyasında istehsal olunan ümumiləşdirmələri rədd edir. Hər fərdi itki, mərhələ kəsilməsi və davamlılıq-qəsd xəttinin əlavə olaraq qlobal səviyyədə yenidən istifadə edilə bilməyən dəqiq JSONL qeyd istinadlarını SHA-256 -də daxil etməlidir. təsdiqlənmiş nəzarətçi və atomluq tutma artefaktları. Azadlıq yoxlayıcısı həmin həzmləri həll edir və sətirlərin icra kimliyi, sınaq indeksini və parametrlərini, nəzarətçinin tanınması və ya bərpa nəticəsini, davamlı yoxlama sayını uyğunlaşdırmasını tələb edir: Sonradan buraxılan p95/p99 müqayisələri də hardver, konfigürasiyalar və ya ölçmə tələbləri namizəddən fərqlənən imzalanmış bir əsas xəttini rədd edir. Son təsdiqləyici bütün məlumatlandırılmış yüzdəlikləri, MADs, və arxivlənmiş xam nümunələrdən müəyyənləşdirilmiş etibar aralıqlarını ayrı-ayrı istinad qiymətlərinə güvənmək əvəzinə bərpa edir. Eyni zamanda kanary manifestini yenidən yükləyir və hər bir arxivli məxfilik səthini müstəqil şəkildə skanerləşdirir, buna görə də hesabat faylları yenidən bağladıqdan sonra yerləşdirilmiş gizli zərbəni basmağa imkan vermir. Arxiv həmçinin tələb olunan hər bir məxfilik səthinə dair saxta sol və sağ fayl yollarını, növləri, bayt uzunluqları və SHA-256 digestlərini bağlayan kanonik fərqlilik cüt manifestini də daxil etməlidir. Son yoxlayıcı müstəqil olaraq bərabər ölçüləri tələb edir və JSON ictimai formaları yenidən hesablayır, buna görə də sızma hesabatının yenidən yazılması ilə eyni ölçüdə bir struktur sızıntısı və ya eşidilməmiş diferensial fayl gizlənə bilməz.
