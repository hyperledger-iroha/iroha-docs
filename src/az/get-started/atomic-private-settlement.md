---
translation_locale: az
translation_source: /get-started/atomic-private-settlement.md
translation_source_hash: 22acbd9fdc8f9882f47f1a3d75d408f07b156c1e0240294b9d8a2f6a79195f51
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Məlumat məkanları arasında atomik özəl hesablaşmanı icra edin {#run-atomic-private-cross-dataspace-settlement}

`AtomicPrivateSettlementV1` 2-dən 255-ə qədər SORA Nexus məlumat məkanının hər birində bir məxfi hesablaşma hissəsini əlaqələndirir və bütün hissələri bir qlobal vəziyyət əməliyyatında yekunlaşdırır. Rədd edilmiş, vaxtı bitmiş və ya dayandırılmış paket heç bir hissəni tətbiq etmir. Şəffaf Native AMX DvP/PvP ayrıca protokol yolu olaraq qalır.

::: warning Buraxılış vəziyyəti
Bu funksiya idarəetmə nəzarətindədir, standart olaraq söndürülüb və hələ istehsal istifadəsi üçün təsdiqlənməyib. Dərc edilmiş funksionallıq, məxfilik, nasazlıq, performans, təkrarlana bilən yığım, müstəqil kriptoqrafik yoxlama və artefakt dərcetmə meyarlarının hamısı konkret buraxılış üçün ödənməyincə onu həqiqi CBDC dəyəri üçün aktivləşdirməyin.
:::

## Protokolun gizlətdiyi {#what-the-protocol-hides}

Hər maliyyə transfert hissəsi iki girdi və üç çıxışlı sabit şəxsi qeydlər sübutundan istifadə edir. Komitə təsdiq ediciləri sübutu və qeyri-şəffaf vəziyyət keçidini yoxlayır; onlar aydın mətn tərəfləri, aktiv, məbləğ, qeyd və ya biznes nəticəsini qəbul etmirlər. Səlahiyyətli yerli auditor əlavə edilmiş audit kapsulunu deşifrə edir, həmin məzmunu yoxlayır və məqsəd üzrə ayrılmış təsdiqi imzalayır. Defolt siyasət tənzimlənən auditor dəstindən bir təsdiqi qəbul edir.

İctimai konteyner əməliyyatı və protokol nəticəsi qeydləri qəsdən açıqlayır:

- şəbəkə və paket identifikatorları
- iştirakçı məlumat məkanı marşrutları və iştirakçı sayı
- vaxtlama və bitmə hündürlükləri
- sabit qeyri-şəffaf protokol məlumat qrupu identifikatorları, köklər, nullifikatorlar, kriptoqrafik öhdəlik dəyərləri və sabit şifr mətn qutuları
- komitə səlahiyyət prinsipləri və dəqiq 3-dən 4-ə mövcudluq, Hazırlıq və protokolun yekunlaşdırılması sertifikatları
- sponsor, ictimai şəbəkə haqqı və terminal vəziyyəti

Bu, məzmunun məxfiliyidir, trafik axınının anonimliyi deyil. Vaxt, iştirakçı sayı, məlumat məkanı kimliyi və sabit protokol məlumat qrupunun fəaliyyəti açıq qalır. Yalnız bir CBDC saxlayan məlumat məkanında heç bir açıq aktiv identifikatoru yayımlanmasa belə, aktiv marşrutdan çıxarıla bilər.

## Quraşdırma tələbləri {#deployment-requirements}

Aktivləşdirmədən əvvəl operatorların bunların hamısına ehtiyacı var:

1. hər iştirakçı məlumat məkanı üçün fərqli BLS konsensus açarları və sahiblik sübutları olan dəqiq dörd təsdiqləyici
2. hər hündürlük üçün məcburi Sumeragi DA/RBC aktivləşdirildi
3. hər məlumat məkanında idarə olunan məxfi hesablaşma məlumat qrupu və ilkin kök
4. aktiv V1 şəxsi qeydlər qabiliyyəti və ayrıca maliyyə əməliyyatlarının həll sübutu profili
5. ən azı bir idarə olunan yerli `PrivateSettlementAuditPolicyV1`, fərqli auditor imzası və hibrid şifrələmə açarları, açar dövrü, hündürlük uyğunluğu və təsdiq həddi daxil olmaqla
6. konfiqurasiya edilmiş saxlanma müddəti üçün kifayət qədər özəl əlavə qeyd saxlama
7. son ictimai konteyner əməliyyatını təqdim edə bilən neytral sponsor hesabı

Auditor həmçinin doğrulayıcı işlədə bilər, amma müstəqil konsensus, auditor-imzalama və auditor-şifrələmə açarlarından istifadə etməlidir. Lisenziyadan çıxarılan deşifrələmə açarlarını tənzimləyici saxlama müddəti ərzində saxlayın və ya onları lisenziyadan çıxarmadan əvvəl kapsulu yenidən bükməyi idarə edin və test edin.

Dörd təsdiqləyicinin səlahiyyəti vəziyyətə bağlanır, müştəri tərəfindən verilmir. Manifestin `authority_context_height` hündürlüyündə hər təsdiqləyici konsensus vəziyyətindən dəqiq sıralı zolaq/məlumat məkanı heyətini və aktiv zolaq nəslini müəyyən edir, müəyyən edilmiş hündürlüyün uyğunluğunu tələb edir və dörd BLS açarını və sahiblik sübutlarını yoxlayır. Yükləmə, Prepare və yekun qəbzin qəbulu eyni tarixi səlahiyyətdən istifadə edir.

## Köməkçi məlumat mühafizəsini konfiqurasiya edin {#configure-sidecar-custody}

Təsdiqlənmiş məxfilik siyasəti aktivləşməni, sübut profillərini, iştirakçı hədlərini, bitmə vaxtını və auditor tələblərini müəyyən edir. Qəbulun uğurlu olması üçün idarə olunan imkan, zəncirdəki məlumat qrupu və audit qeydləri aktiv olmalıdır.

Qovşaq konfiqurasiyası yalnız şifrələnmiş köməkçi məlumat anbarının yerli tutumunu idarə edir:

```toml
[nexus.atomic_private_settlement]
sidecar_max_records = 256
sidecar_max_total_bytes = 3221225472
```

Bunlar proqramla təqdim olunan saxlama hədləridir. Yerli tutumu seçməzdən əvvəl nəzərdə tutulan avadanlıqda saxlanılan qeydləri və kanonik baytları ölçün. Təkcə tutum hesablaşmanı aktivləşdirmir və onun təsdiqlənmiş etibarlılıq siyasətini dəyişmir.

Təsdiqlənmiş kapsul həddi `PrivateSettlementAuditCapsuleV1` üçün tam kanonik Norito kodlamasını ölçür: AAD, nonce, şifrmətn, vektor çərçivələməsi, auditor kimlikləri və hər bükülmüş DEK sətri. Təsdiqlənmiş daşıyıcı həddi təlimat çərçivələməsi, səlahiyyət sahibi, metaməlumat, haqq niyyəti və imza daxil olmaqla sponsorun imzaladığı tam əməliyyatı ölçür. Şəbəkənin adi əməliyyat hədləri də qüvvədədir.

## maliyyə əməliyyatı hesablaşma iş axını {#settlement-workflow}

Müştəri sübutları və şifrələnmiş kapsulları yerli səviyyədə yaradır. Gizli şahidlər yerli cüzdanda və ya yerli işçidə qalmalıdır; onları tətbiq qeydlərinə, Python obyektlərinə, HTTP sorğularına və ya davamlı koordinasiya qeydlərinə serialize etməyin.

Kapsul və auditor başına DEK-bükülmüş təsdiqlənmiş məlumatlar dəqiq vəziyyətlə əlaqələndirilmiş komitənin və `authority_context_height`-in kriptoqrafik xülasə dəyərini, eləcə də şəbəkəni, marşrutu/inkarnasiyanı əhatə edir, paket, maliyyə köçürməsi hissəsi, siyasət, əsas dövr və açıq mətn kriptoqrafik öhdəlik dəyəri. Qablaşdırılmış açarı fərqli siyahıya və ya tarixi səlahiyyət prinsipi kontekstinə köçürmək olmaz.

Hər bir ayrı protokol-standart maliyyə köçürmə hissəsi üçün koordinatör sonra bu ardıcıllığı icra edir:

1. Müvəqqəti şifrələnmiş materialı bütün dörd təsdiqləyiciyə yükləyin və protokol-standartına uyğun dəqiq 3-dən 4-ə mövcudluq sertifikatı əldə edin.
2. Səlahiyyətli bir auditor onun kapsulunu götürüb deşifrə etsin, ictimai bağlılıqları yenidən hesablaya, yerli siyasəti tətbiq etsin və təsdiqi təqdim etsin.
3. Dörd təstiqçi tərəfindən səsvermə üçün Hazırlıq tələb edin. Hər bir təstiqçi delta sənədlərini müstəqil şəkildə yoxlayır və səsvermədən əvvəl davamlı olaraq hazırlayır. Hər hazırlanan cavablayıcıda yeganə protokol-standart 3-dən-4-ə Hazırlıq sertifikatını saxlayın.
4. Hər maliyyə köçürməsindən sonra hissənin Hazırlıq sertifikatı olur, dəyişməz tam Hazırlıq baryerini qurun. Tək protokol-standart 3-dən 4 protokol yekunlaşdırma sertifikatlarını tələb edin və saxlayın. Əgər koordinator yenidən başladılarsa, iştirakçı düyünlərdən onların lokalla saxlanmış Prepare və konsensus yekunlaşdırma sertifikatlarını sorğu et, bir protokol-standart quorumu ekvivalent sertifikatı seç və davam etməzdən əvvəl onu yenidən payla; heç vaxt təsdiqlənməmiş lokal keşdən sertifikat yaratma.
5. Texniki manifest sponsoru imzalasın və dəqiq olaraq bir qlobal konteyner əməliyyatını təqdim etsin. Konteyner əməliyyatı bir `FinalizeAtomicPrivateSettlementV1` təlimatını və tam təsdiqlənmiş paketini özündə əks etdirir. Koordinator və WSV qeydiyyatdan keçmiş təlimat çərçivəsini daxil olmaqla, tipdən silinmiş tam sonlaşdırma təlimatını əvvəlcədən yoxlayır. Torii və əsas bir dəfəlik konteyner əməliyyatı bağlaması, dəqiq tək protokol-standart tərəfindən sponsor imzalanmış əməliyyat üzərində `max_carrier_bytes`-i tətbiq edir, avtorizasiya prinsipi, metadata, ödəniş niyyəti və imzanı daxil olmaqla. Torii avtorizasiya prinsipi kontekstindən əvvəl, son giriş hündürlüyündə və ya onunla birlikdə vaxt bitməsinə çata biləcək, və ya idarə olunan müddətin sonunu keçərək konteyner əməliyyatını rədd edir.
6. Qlobal sonluğa qədər ictimai paket vəziyyətini və protokol nəticəsi qeydini sorğu et. Lokal köməkçi qeyd vəziyyətini, o dəyişməz qlobal son qeyd ilə uyğunlaşana qədər müvəqqəti hesab et.

Rust müştəri bu axını `certify_and_upload_private_settlement_legs_v1`, `prepare_private_settlement_bundle_v1`, `commit_private_settlement_bundle_v1` və `submit_private_settlement_bundle_v1` daxil olmaqla metodlar vasitəsilə təqdim edir. Yenidən başlatma-davamlı koordinasiya `recover_or_prepare_private_settlement_bundle_v1` və `recover_or_commit_private_settlement_bundle_v1` istifadə edir. Komitə və auditor texniki çağırışları açıq rol səlahiyyətlərini tələb edir; onlar adi hesabın kriptoqrafik imzalayıcısını təkrar istifadə etmirlər.

## Auditor siyasətini təhlükəsiz şəkildə fırladın {#rotate-an-auditor-policy-safely}

Məxfilik idarəetməsinin icazə verdiyi `RotatePrivateSettlementPoolPolicyV1` təlimatından istifadə edin. Təlimat cari idarəetmə dayjestini dəqiq göstərməli, eyni marşrutu, protokol qrupunu və aktiv bağlama öhdəliyini saxlamalı, idarəetmə reviziyasını bir vahid artırmalı, daha yeni açar epoxasından və fərqli siyasət və idarəetmə dayjestlərindən istifadə etməli və rotasiyanı daşıyan blokda aktivləşməlidir. Protokol qrupunun sərhədi, köklər, nullifikatorlar, çıxışlar, təkrar icra dəstləri və yekun qəbzlər qorunur. Rotasiyanın aktivləşdiyi hündürlükdə eyni marşrut və protokol qrupuna toxunan qəbz daxil etməyin; təlimat bu sərhədi rədd edir.

Ümumi protokol məlumat qrupu proqnozu tamamlanmış əvəz olunan siyasət-yeniləmə nəsilini saxlayır. Beləliklə, döndürməmişdən əvvəl yekunlaşmış bir protokol nəticə qeydi yenidən başladıqdan sonra da etibarlı qalır və həmin protokol nəticə qeydinin yenidən göstərilməsi idempotent olaraq qalır. Nəsil yarımçıq işə icazə vermir: aktivləşdirmə sərhədini keçən hər hansı köhnə-siyasət paketi qlobal vəziyyət dəyişmələrindən əvvəl bağlanmış hesab edilir. Saxlanmış kapsulları açmaq üçün lazım olan hər köhnə şifrələmə açarını saxlayın, ya da onu məhv etmədən əvvəl idarə olunan və sınaqdan keçirilmiş kapsul yenidən bükülməsini tamamlayın.

## Torii marşrut ailəsi {#torii-route-family}

Bu marşrutlar tək protokol-standart Norito sorğu və cavab obyektlərindən istifadə edir. Sertifikatlaşdırılmış və məhdud cavablar xüsusi `no-store` keşik davranışından istifadə edir.

|Əməliyyat|Metod və yol|Müdir|
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
|Maliyyə köçürməsinin hissəsini yükləyin| `POST /v1/nexus/private-settlements/legs`                                  |tək protokol-standart hesab imzası|
|Mövcudluq payı| `POST /v1/nexus/private-settlements/legs/availability-shares`              |tək protokol-standart hesab imzası|
|Səs verməyə hazırlaş| `POST /v1/nexus/private-settlements/phases/prepare-votes`                  |tək protokol-standart hesab imzası|
| yekunlaşdırma mərhələsi səsverməsi | `POST /v1/nexus/private-settlements/phases/commit-votes`                   |tək protokol-standart hesab imzası|
|Davam et mərhələsi QC| `POST /v1/nexus/private-settlements/phases/certificates`                   |tək protokol-standart hesab imzası|
|Bərpa mərhələsi QCs| `GET /v1/nexus/private-settlements/legs/{payload_digest}/phase-certificates` |texniki manifest sponsoru|
|maliyyə köçürməsi hissəsi statusu| `GET /v1/nexus/private-settlements/legs/{payload_digest}/status`           |tək protokol-standart hesab imzası|
|Komitə sübutu| `GET /v1/nexus/private-settlements/legs/{payload_digest}/committee-proof` |dəqiq komanda siyahısı yoxlayıcısı|
| Audit kapsulu | `POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule` | idarəetmə ilə təyin edilmiş auditor |
|Auditorun təsdiqi| `POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-approvals` |idarə olunan auditor|
|Son göndər/imtina et| `POST /v1/nexus/private-settlements/bundles`                               |texniki manifest sponsoru|
|Paket vəziyyəti| `GET /v1/nexus/private-settlements/bundles/{bundle_id}`                    |ictimai|
|protokol nəticəsi qeydi və ya dayandırmaq| `GET /v1/nexus/private-settlements/bundles/{bundle_id}/receipt`            |ictimai|

İctimai vəziyyət və protokol nəticəsi qeydiyyatı APIs yalnız sənədləşdirilmiş ictimai sahələri göstərir. Xüsusən, adi maliyyə köçürmə hissəsi vəziyyəti təsdiqlənmə sayını və ya idarə olunan auditor həddini açıqlamır. Məhdud oxumalar qəsdən itkin, icazəsiz və saxlanma müddəti bitmiş materialları eyni mövcud olmayan cavab sinfinə birləşdirir. Təqdim marşrutu yalnız birbaşa sponsor tərəfindən imzalanmış yekunlaşdırma və ya ləğvetmə təlimatını qəbul edir. Onun `202` cavabı yalnız paket ID-sini, müşahidə olunan qəbul hündürlüyünü və konteyner əməliyyatı kriptoqrafik xəşini ehtiva edir; o, növbəyə alınmış abortun artıq yekun olduğunu iddia etmir. SDKs həm identifikatorların tək protokol-standartlı yoxlanış cəmi olan Norito `Hash` JSON literallar olmasını, həm də hündürlüyün dəqiq işarəsiz 64-bitlik tam ədəd olmasını tələb edir; itkin, əlavə, səhv yazılmış, tək protokol standartına uyğun olmayan, yoxlama cəmi etibarsız, mənfi, mənfi-sıfır, kəsrli və ya daşmış sahələr bağlı halda uğursuz olur. Səlahiyyətli terminal vəziyyəti üçün paketin vəziyyətindən və ya protokol nəticəsi qeydindən istifadə edin. Status kodu dəqiqdir: bu konteyner əməliyyatı-qəbul marşrutu `202` tələb edir, halbuki digər bütün xüsusi-hesablaşma V1 uğur cavabları `200` tələb edir. Müştərilər alternativ uğurlu `2xx` kodlarını müştəri səhvləri vasitəsilə gözlənilməz cavab bədənini əks etdirmədən müqavilə sapması kimi rədd edirlər. Onlar yalnız server rədd kodunu açığa çıxarırlar o `[A-Za-z0-9_.:-]{1,128}` ilə uyğun gəldikdə və cavab analizçisi/təsdiqləmə səbəblərini xaric edin, beləliklə, bədən məzmunu və ya hücumçu tərəfindən seçilən JSON sahə adlarının səbəbə əsaslanan qeydlər vasitəsilə yenidən meydana çıxmasının qarşısını alın.

## Uğursuzluq və bərpa {#failure-and-recovery}

Əskik və ya köhnəlmiş auditor təsdiqləri, üçdən az doğrulayıcı səs, yanlış köklər və ya epoxlar, təkrarlanan nullifierlər, əvəz edilmiş sübutlar və ya kapsullar, qeyri-kanonik maliyyə hissə sifarişini köçürmək, müddəti bitmiş paketlər və uyğun gəlməyən geri ödəniş şərtləri qlobal mutasiyadan əvvəl hamısı uğursuz olur. konsensus yekunlaşdırma sertifikatları heç vaxt xüsusi vəziyyəti dəyişdirmir.

Təsdiqləyicilər onları təsdiqləmədən əvvəl köməkçi qeydləri, mərhələli delta dəyişikliklərini və mərhələ sertifikatlarını fsync edir. Yenidən başladıqda, tək protokol-standartına uyğun davamlı qeydlərdən rezervasiyaları bərpa edirlər, sonra isə dəyişməz qlobal protokol nəticə qeydləri, ləğv işarələri və ya müddətinin bitməsini uzlaşdırırlar. Nəzarətli uzlaşdırıcı, uzlaşdırılacaq heç bir terminal namizəd olmasa belə, eyni vaxtda müşahidə olunan səlahiyyətli hündürlükdə terminal qorunmasının kəsilməsini də həyata keçirir. və budama xətasında bağlanır. Yalnız səlahiyyətli qlobal terminal qeydi səhnəyə qoyulmuş kilidləri buraxır. Eyni yekunlaşdırılmış protokol nəticəsi qeydini təkrar oynatmaq idempotentdir; ziddiyyətli təkrar oynatma deterministik şəkildə uğursuz olur.

Rezervasiya kimliyi tam marşrutu əhatə edir. Protokol məlumat qrupunun başları `(route, pool_id, epoch, root)` istifadə edir, nullifikatorlar `(route, pool_id, nullifier)` istifadə edir və çıxışlar `(route, pool_id, commitment)` istifadə edir. Başqa marşrutda bərabər qeyri-şəffaf dəyərlər müstəqildir; dəqiq marşrut toqquşması yenidən başladıqda da bağlı qalır.

Əməliyyat xəbərdarlıqlarında yalnız natamam paket, marşrut, faza, kriptoqrafik xülasə dəyəri, hündürlük və səbəb-sinif sahələrindən istifadə olunmalıdır. Heç vaxt deşifrə olunmuş kapsullar, hesab və ya aktiv identifikatorları, məbləğlər, qeydlər, baxış məlumatları, sübut şahidləri və ya parser məlumatlarını loqlara, hadisələrə, metrik etiketlərinə və ya izləmə aralıqlarına yerləşdirməyin.

## Həqiqi dəyərdən əvvəl ixtisas {#qualification-before-real-value}

Quraşdırmaq istədiyiniz dəqiq quruluş və konfiqurasiya üçün, aşağıdakıları əhatə edən sübutları arxivləşdirin:

- müxalif sübut, kapsul, siyasət, açar dövriyəsi, geri ödəniş və təkrar oynatma halları
- 2, 3, 4, 8 və 16 məlumat məkanı üçün real dörd təsdiqləyici prosesi; təsdiqləyici və əlaqələndiricinin yenidən başladılması, autentifikasiya edilmiş 5%, 10% və 20% mesaj itkisi, mərhələ zamanı şəbəkə bölünmələri, bərpa və davamlı saxlama sərhədində çökmələr daxil olmaqla
- kanar və fərqli sızma analizini Torii, P2P blokları, Kura, zaman nöqtəsində məlumat baxışları, sorğular, hadisələr, qeydlər və telemetriya üzrə
- hər real-şəbəkə iştirakçısı sayı üçün ən azı beş isinmə mərhələsi və otuz ölçülən paket, p50, p95, p99, etibarlılıq intervalları, resurslar, trafik, sübut və protokol nəticəsi qeyd ölçüləri, və nəzarət kimi şəffaf AMX
- sərt iş sahəsi testləri, lint və format yoxlamaları, təsadüfi toxumlar, soak, təkrarlanabilir qurğular, SBOMs, və imzalı artefakt kriptoqrafik xəşləri
- hər iki formal qat: 3/255 mərhələ sayı üzrə simmetriya yoxlamaları və dəqiq dörd təsdiqləyicili, komitə indeksli N=2 təsdiqləyici yönümlü tam məhdud nasazlıq sınaqları, sənəddə əsas götürülən N=3 nasazlıq, N=4 təmiz və N=3 müddət-bitmə/təkrar icra konfiqurasiyaları; nasazlıq büdcələri hər komitə üçün müstəqildir
- sübut əlaqəsinin, saxta yuva seçicilərinin, aktiv və kapsul bağlamalarının, geriödəmə əlaqəsinin, kriptoqrafiyanın və məlumat məkanlarıarası vəziyyət maşınının müstəqil yoxlanması

Xam və təmizlənmiş sübutları, təhdid modelini, protokol arqumentlərini, məhdudiyyətləri, mənbə kodu versiya identifikasiyalarını, aparat təsvirini və audit hesabatlarını birində dərc edin dəyişməz DOI-dəstəklənən artefakt. Yalnız anbar testləri bu xüsusiyyəti istehsalat səviyyəsində uyğun CBDC maliyyə əməliyyatı hesablaşma sisteminə çevirmir.

Son təmiz Iroha checkout-dan, buraxılış mənbə inventarını yaradın və həmin checkout-un xaricində mövcud olan bir paket kökünə möhürləyin:

```sh
python3 scripts/private_settlement_source_evidence.py \
  --repository-root . \
  --bundle-root /absolute/path/to/release-bundle
```

Prodüser, səhnələnmiş, səhnələnməmiş, izlənilməmiş və ya birləşdirilməmiş fayllarda və capture zamanı hər hansı mənbə dəyişikliyində uğursuz olur. O, xam mənbə-kod versiyası obyektini, tək protokol-standart Git ağac inventarını, dəqiq binary yol siyahısını, deterministik mənbə möhürünü və `Cargo.lock` saxlayır; Son buraxılış texniki manifestinə onun JSON nəticəsindəki hər bir artefakt bəyanatını daxil edin. Bu, son DOI-paket yoxlayıcısını və ya hər hansı xarici buraxılış qapısını ləğv etmir.

Mənbə möhürü daşına biləndir və qapalı vəziyyətdə uğursuz olur: istehsalçı və son yoxlayıcı bütün arxivlənmiş symlink qrafını həll edirlər, belə ki, kökdə görünən, amma başqa bir keçid, dövr, `.git` keçid və ya Windows tipli hədəf vasitəsilə qaçan keçid yaradılmadan rədd edilir. Quraşdırılmış mənbə və qapı hesabatları yalnız kriptoqrafik xülasə dəyəri və uzunluğu buraxılış texniki manifestinə uyğun olan məhdud sabit fayllardan təhlil edilir və hər bir mənbə yükü növü dəqiq olaraq bir dəfə meydana çıxmalıdır.

Hər xam nasazlıq sınağı və gecikmə nümunəsi tam buraxılış commit-inə, bir strukturlaşdırılmış sabit avadanlıq təsvirinin SHA-256 həşinə və dəqiq iştirakçı sayı konfiqurasiyasının SHA-256 həşinə bağlanmalıdır. N=2,3,4,8,16 hallarını əhatə edən bir kanonik konfiqurasiya manifestini arxivləşdirin; hər qeyd saxlanılan konfiqurasiya baytlarına istinad etməli, hər məlumat məkanı üçün dəqiq dörd təsdiqləyicini, dörddən üç kvorumu və məcburi imzalanmış RS16 DA/RBC-ni tələb etməlidir. Buraxılış yoxlayıcısı başqa yığım, avadanlıq profili və ya şəbəkə konfiqurasiyasında yaradılan xülasələri rədd edir. Hər ayrıca itki, mərhələ kəsilməsi və davamlı saxlama zamanı çökmə sətri əlavə olaraq SHA-256 ilə bağlanmış autentifikasiya edilmiş nəzarətçi və atomiklik qeydəalma artefaktlarındakı dəqiq JSONL qeyd istinadlarını göstərməlidir; bu istinadlar qlobal olaraq təkrar istifadə oluna bilməz. Buraxılış yoxlayıcısı həmin həşləri həll edir və sətirlərin sınaq kimliyinə, cəhd indeksinə və parametrlərinə, nəzarətçinin təsdiqinə və ya bərpa nəticəsinə, fasiləsiz yoxlama sayına uyğun olmasını, eləcə də qismən görünmə və qismən xərclənmə müşahidələrinin sıfır olmasını tələb edir. Sonrakı buraxılışların p95/p99 müqayisələri də avadanlığı, konfiqurasiyaları və ya ölçmə tələbləri namizəd versiyadan fərqlənən imzalanmış bazanı rədd edir. Yekun yoxlayıcı ayrı etalon xülasəsinə etibar etmək əvəzinə bütün bildirilən persentilləri, MADs və deterministik etibar intervallarını arxivləşdirilmiş xam nümunələrdən yenidən hesablayır. O, həmçinin kanarya sınağı manifestini yenidən yükləyir və arxivləşdirilmiş hər məxfilik səthini müstəqil skan edir; beləliklə hesabat fayl həşlərini yenidən bağladıqdan sonra yerləşdirilmiş sınaq sirrinin tapılmasını gizlədə bilməz. Yalnız sirləri yoxlayan hər sınaq yalnız sahibin girişinə açıq, süzgəcdən keçirilməmiş geridöngə pcap faylını, xam tcpdump stderr çıxışını və sıfır paket itkisi statistikasını, kanonik port manifestini, paketlənmiş məhdud mənbə arxivini və bütün həmyaşıd qovşaqların atomiklik müşahidələrini saxlamalıdır. Yekun yoxlayıcı yayımlanmış xülasələrə etibar etmək əvəzinə həmin arxiv baytlarından porta bağlı paket bölünməsini, mənbə proyeksiyalarını və başlanğıcdan son vəziyyətə qədər atomiklik yoxlamalarını yenidən icra edir.

Arxiv həmçinin hər bir tələb olunan məxfilik səthi üçün dəqiq sol və sağ fayl yollarını, növlərini, bayt uzunluqlarını və SHA-256 kriptoqrafik xülasələrini birləşdirən tək protokol-standart cüt trafik sayımı və diferensial-cüt texniki manifestləri də əhatə etməlidir. Bəyannamə olunan köklər dəqiq cüt arxiv inventarını ehtiva etməlidir. Təftişçi adi səthlər üçün bərabər tam fayl ölçülərini və JSON ümumi formaları tələb edir. Entropiya daşıyan xam loopback tutma və sıxılmış mənbə arxivi açıq ölçü istisnalarıdır; əvəzinə paket bağlantı növünü və paket-bazlı uzunluqları, məhdudlaşdırılmış mənbə kimliklərini və sabit-şəkilli sətir uzunluqlarını müqayisə edir. Hər Torii sorğu/cavab, ictimai/məhdud P2P paket, blok, sorğu, hadisə, jurnal və telemetriya trafiki sayı da uyğun olmalıdır. Paket forması dəyişməsi, eyni ölçüdə struktur sızması, yanlış mənşəyin iddiası, və ya cütləşdirilməmiş fayl sızma hesabatı və onun kriptoqrafik xəşlərini yenidən yazmaqla gizlədilə bilməz.
