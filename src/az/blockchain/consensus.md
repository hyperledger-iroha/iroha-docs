---
translation_locale: az
translation_source: /blockchain/consensus.md
translation_source_hash: fdc9a35ac2e43acda076104063b5a364feb5060a70473b51cf016b8adb1306d3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Razılaşma {#consensus}

Əməliyyatlar Sumeragi onları blokda təklif etməzdən əvvəl növbəyə daxil edilir. Təsdiqləyicilər təklifi müstəqil şəkildə yoxlayır və icra edir, sonra yalnız təkrar edə biləcəkləri vəziyyət dəyişikliklərini imzalayırlar. Bir blok, tələb olunan təsdiqçi kvorumu həmin nəticədə razılaşdıqdan və uyğun yük mövcud olduqdan sonra yekunlaşdırılır.

Bütün Iroha 3 şəbəkələri imzalanmış RS16 məlumat-əldə etmə texniki manifesləri və parçalarını, həmçinin sertifikatlı bədən bərpasını istifadə edir. Məlumat mövcudluğu konsensus tələbi olub, seçimli yerləşdirmə xüsusiyyəti deyil.

## Sumeragi {#sumeragi}

Sumeragi Iroha-in Bizans səhv-tövsiyəsinə davamlı konsensus mühərrikidir. O, əməliyyatları növbədən götürür, təsdiqləyici şəbəkə iştirakçılarının eyni mövqedə razılaşmasını təmin edir sıralanmış blok və kifayət qədər təsdiqedici həmin nəticəni təkrarlayıb konsensus yekunlaşdırma sertifikatını imzaladıqdan sonra yalnız həmin bloku yekunlaşdırır.

### Təklif və razılıq yekunlaşdırma yolu {#proposal-and-commit-path}

Sumeragi blokçeyn lövhəsini bir blok hündürlüyü üzrə irəli aparır. Hər hündürlükdə bir valyidator cari baxış üçün təklifçi kimi çıxış edir. Təklifçi növbədəki uyğun əməliyyatları çıxarır, namizəd blok hazırlayır və təklifi aktiv valyidator dəstinə elan edir.

Hər iki icazəli və Nominated Proof-of-Stake (NPoS) yerləşdirmələrində eyni Sumeragi proqram təminatı işləmə iş prosesi istifadə olunur:

1. Bir təsdiqləyici sıradakı əməliyyatlardan bir blok təklif edir.
2. Təsdiqləyicilər təklifləri eyni dünya vəziyyətinə qarşı əməliyyatları icra etməklə təsdiqləyirlər.
3. Təsdiqləyicilər mövcud hündürlük və baxış üçün səsləri və konsensus kvorum sertifikatlarını mübadilə edirlər.
4. Bir dəfə konsensusun yekunlaşdırılması üçün kvorum əldə olunduqda, şəbəkə həmkarları bloku yekunlaşdırır və öz dünya vəziyyətlərini yeniləyir.

Təsdiq edənlər yalnız yerli olaraq reproduksiya edə biləcəkləri məlumatları imzalayırlar. Səsvermədən əvvəl, təsdiq edən yoxlayır ki, təklif gözlənilən zəncire, hündürlüyə və baxışa aiddir; əməliyyat imzaları və limitlər protokol qaydalarına uyğundur; icra yolunun istiqamətləndirilməsi və icraçı təsdiqi deterministdir; və yükün icra olunmasının gözlənilən vəziyyət keçidini yaratdığını. Əgər yerli nəticə fərqlidirsə, təsdiqçi səs vermək əvəzinə təklifi rədd edir.

Səsvermələr kiçik imzalı konsensus mesajlarıdır. Onlar təklif olunan blok, hündürlük, baxış və təsdiqləyici şəxsiyyətinə istinad edir. Yoxlanılmış imzalar konsensus hazırlığı və yekunlaşdırma sertifikatlarını təşkil edir. Razılaşma yekunlaşdırma sertifikatı, kifayət qədər təstiqçi eyni blok üçün eyni nəticəni müşahidə etdiyini davamlı şəkildə sübut edən sənəddir. Hər bir təstiqçi özünü göndərir Tam komitəyə hazırlıq və yekunlaşdırma mərhələsi səsvermələri; hər hansı bir təsdiqləyici tələb olunan bərabər səsvermələri yığa və nəticədə yaranmış sertifikatı yayımlaya bilər.

### Kvorum və müşahidəçilər {#quorum-and-observers}

İlk buraxılış protokolu yalnız dəqiq `3f + 1` səsvermə komitəsinə icazə verir, 4-dən 31-ə qədər valyidatorlar üçün. Valideyn ölçüləri buna görə 4, 7, 10 və s., 31-ə qədərdir. `n = 3f + 1` üçün Bizans səhv büdcəsi `f` və protokol sonlaşdırma kvorumu `2f + 1`-dür. Blockchain başlanğıc yaradılması və işə salma təsdiqi hər hansı digər komitə geometriyasını rədd edir.

Müşahidəçi şəbəkə üzvləri yekunlaşdırılmış blokları sinxronizasiya edə bilər, lakin onlar təklif vermir, səs vermir və konsensusun yekunlaşdırma kvorumuna daxil edilmir. Yerli sorğu qabiliyyəti, indeksləşdirmə, monitorinq tələb edən yerləşdirmələrdə müşahidəçilərdən istifadə edin, və ya səsvermə səlahiyyətinə malik təsdiqləyicilərin sayını artırmadan regional blok təkrarlanması.

### Dəyişiklikləri və bərpanı gör {#view-changes-and-recovery}

Bir görünüş Sumeragi-in müəyyən bir təklifçi və zaman planı ilə bir hündürlüyü yekunlaşdırmaq cəhdidir. Əgər təklif, yük, səsvermə və ya konsensus yekunlaşdırma prosesi dayanarsa, konsensus pacemaker hündürlüyü daha sonrakı bir görmək üçün irəli apara bilər. Bir görünüş dəyişməsi yekunlaşdırılmış bloku yenidən yazmır. Bu, təsdiq edənlərin hələ yekunlaşmamış hündürlüyü tamamlamaya çalışmasını dəyişir, belə ki, şəbəkə qovşaqları ziddiyyətli blokları yekunlaşdırmasın deyə, ən yüksək məlum kvorum və ya konsensus yekunlaşdırma sübutunu irəli daşıyır.

Yükün bərpası sonluq qərarından ayrıdır. Şəbəkə tərəfdaşı tam blok yükünü almadan əvvəl kirayə və ya konsensus sonluq sertifikatı ala bilər. Bu halda, şəbəkə tərəfdaşı imzalanmış RS16 yükləmə hissələrini və ya sertifikatlı bir bədəni tələb edir, bərpa edilmiş baytları elan edilmiş kriptoqrafik xəşlərlə yoxlayır və yalnız bundan sonra bloku dünya vəziyyətinə və Kura tətbiq edir.

### Razılaşma rejimləri {#consensus-modes}

Seçilmiş rejim, doğrulayıcı dəstəsinin necə formalaşdırıldığını və işlədildiyini idarə edir. Bu, imzalanmış blokçeyn başlanğıcında elan edilir. [`consensus_mode`](/az/reference/genesis.md) və hər yüksəklik kontekstinə dondurulmuş. Yerli `[sumeragi]` konfiqurasiya yalnız node rolunu və sonlu blok, sıra, proqram təminatı icra mühiti, yaddaş və açar-siyasət məhdudiyyətlərini seçir; o, rejimi ləğv edə və ya kadenisi blok edə bilməz. Yoxlayıcıların da eyni şeyə ehtiyacı var imzalanmış blokçeyn əsası, topologiya, etibarlı şəbəkə tərəfdaş məlumatları və effektiv Sumeragi parametrlər.

|Rejim|Ən uyğun|Təsdiqləyici dəsti|Əməliyyat diqqəti|
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
|İcazəli|Şəxsi, konsorsium və operator tərəfindən idarə olunan şəbəkələr|Təsdiqləyicilər yerləşdirmə tərəfindən razılaşdırılmış etibarlı şəbəkə həmkar topologiyasından gəlir|Bütün təsdiqləyiciləri eyni imzalanmış blokçeyn başlanğıcında, etibarlı şəbəkə iştirakçıları, şəbəkə iştirakçı açarları və Sumeragi parametrlərində saxlayın|
|NPoS|Təsdiqin təyinat və pay siyasətini izlədiyi ictimai və ya Nexus-yönümlü şəbəkələr|Doğrulayıcılar adətən epoxlar ərzində NPoS profili tərəfindən seçilir və BLS açarları ilə yanaşı Sahiblik Sübutları tələb edir|Şəbəkə boyunca pay, zaman nöqtəsi məlumat baxışlarını, imzalanmış epoxu və seçki girişlərini, doğrulayıcı PoPs və dəyişməz blok ritmini qoruyun|

::: tip İcazəli rejim

Doğrulayıcı siyahısı açıq əməliyyat seçimi olduqda icazəli rejimdən istifadə edin. Bu, öz-özünə yerləşdirilmiş Iroha şəbəkələri üçün adi başlanğıc nöqtəsidir, çünki üzvlük dəyişiklikləri qəsdən idarəetmə və ya administrator əməliyyatlarıdır. Əhəmiyyətli əməliyyat qaydası belədir ki, hər bir təsdiqləyici blokçeyn başlanğıcını, etibarlı şəbəkə həmkarlarını, BLS Sahibliyin Sübutlarını və Sumeragi parametrləri eyni baxışla işlətməlidir. Fərqli topologiyaya malik və ya imzalanmış blokçeyn başlanğıcına sahib olan tək bir şəbəkə şəbəkəsi, şəbəkənin nəticəni yekunlaşdırmasının qarşısını ala bilər.

:::

::: tip NPoS rejimi

NPoS rejimindən istifadə edin, əgər yerləşdirmə profili təsdiqçinin iştirakının naminat və pay vəziyyəti tərəfindən yönləndirilməsini gözləyirsə. İctimai SORA Nexus yerləşdirmələr NPoS istifadə edir və onların yaradılmış profillərinə BLS təsdiqçi şəxsiyyətləri, Sahiblik Sübutları, epoxa parametrləri daxildir, və başlanğıcda tələb olunan Sumeragi NPoS parametrləri. Epoxa dəyişiklikləri müəyyən hündürlüklərdə aktiv valider dəstini əvəz edə bilər, buna görə operatorlar həm konsensus sağlamlığını, həm də növbəti siyahını təmin edən pay və ya nominasiyalar vəziyyətini izləməlidirlər.

:::

## Çoxzolaqlı razılıq {#multilane-consensus}

Iroha-ın çoxzolaqlı konsensus yolu Nexus icra zolağı və məlumat sahəsi konfiqurasiyası vasitəsilə həyata keçirilir. Hər icra zolağı üçün ayrı bir konsensus nümunəsi başladmır. Sumeragi hələ də bir sifariş edilmiş blok axınını yekunlaşdırır; icra xətləri əməliyyatların necə yönləndirildiyini, cədvəl üzrə planlaşdırıldığını, hesablandığını və həmin axın içində necə saxlanıldığını təsvir edir.

Proqram təminatının icra mühiti konfiqurasiyası icra zolağı vəziyyətinin üç hissəsini qurur:

- `nexus.lane_catalog`: hər biri rəqəmlə `LaneId`, ləqəb, məlumat sahəsi, görünürlük, saxlama profili, sübut sxemi və metadata ilə konfiqurasiya edilmiş icra zolaqları.
- `nexus.dataspace_catalog`: hər biri rəqəmsal `DataSpaceId` və retranslyasiya komitəsinin ölçüləndirilməsi üçün istifadə olunan səhv-tolerans dəyəri ilə qurulmuş məlumat sahələri.
- `nexus.routing_policy`: hesablar və ya təlimat yolları ilə uyğunlaşa bilən standart zolaq/veri sahəsi cütü və sıralanmış marşrutlaşdırma qaydaları.

Bir əməliyyat növbəyə daxil olduqda, icra yolu routeri onu `RoutingDecision { lane_id, dataspace_id }` kimi həll edir. Tək yol rejimində bu hər zaman icra yolu `0` və ümumi məlumat sahəsi olur. Nexus rejimində, konfiqurasiya edilmiş yönləndirici dataspace-ə aid qaydaları, maliyyə əməliyyatlarının hesabat yönləndirilməsini, hesab qaydalarını, açıq yönləndirmə qaydalarını və nəhayət, standart marşrutu tətbiq edir. Həll edilmiş icra xətti və məlumat sahəsi öz kataloqlarında mövcud olmalıdır və icra xətti həll edilmiş məlumat sahəsinə bağlanmalıdır; əks halda, əməliyyat növbəyə qoyulmadan rədd edilir.

Növbə bu yönləndirmə qərarını əməliyyatın kriptoqrafik xashı ilə saxlayır ki, sonrakı mərhələlər bunu yenidən təxmin etməsinlər. Təklifin hazırlanması daha sonra icra zolağı metadatasını iki şəkildə istifadə edir:

- O, əməliyyatları icra zolağı üzrə qarışdırır ki, yalnız əməliyyatları əvvəlcədən sıraya qoyulduğu üçün bir icra zolağı bloka hökm etməsin.
- Bu hər bir yol vahidi əməliyyat icra bloku (TEU) limitlərinə tətbiq olunur. Bir icra yolunun təyin edilmiş tutumunu aşacaq əməliyyatlar təxirə salınır və yenidən növbəyə qoyulur, lakin bir icra yolunun ilk aşırı çəki əməliyyatı qəbul edilə bilər ki, sağ qalma kilidlənməsinin qarşısı alınsın.

Namizəd hazırlanması zamanı, Sumeragi təklif olunan yükü icra zolağı və məlumat sahəsi üzrə toplayır və zolaq-yerli məlumat-mövcudluğu kimliklərini çıxarır. Qeyd olunan cəmlərə əməliyyat sayı, hissələr, yük baytları və TEU daxildir. Protokolun yekunlaşmasından sonra, həmin ümumilər icra zolağı və məlumat məkanı kriptoqrafik öhdəlik dəyəri vaxt nöqtəsi məlumat baxışlarına çevrilir və təsdiqlənmiş Sumeragi diaqnostikaları vasitəsilə göstərilir. Əgər blok icra xətti maliyyə əməliyyatlarının həll protokolu nəticə qeydlərini ehtiva edirsə, blok emalı həmçinin icra xətti maliyyə əməliyyatlarının həllinin kriptoqrafik öhdəlik dəyərlərini və ötürməni yaradır blok başlığını, konsensus yekunlaşdırma sertifikatını, bağlayıcı dəyərin məlumat-mövcudluğu kriptoqrafik xəşini, maliyyə əməliyyatlarının həll edilməsi sübutunu və icra zolağı yük ölçüsünü birləşdirən məlumat konteynerləri.

## Məlumatın mövcudluğu və yükün bərpası {#data-availability-and-payload-recovery}

Sumeragi v2 imzalanmış RS16 `PayloadManifest` və `PayloadChunk` mesajları vasitəsilə qlobal yük mövcudluğunu təmin edir. Lider imzalanmış texniki manifesti tam komitəyə göndərir və ilkin olaraq deterministik hissələri Set A-ya paylayır. Təsdiqləyici yalnız tək protokol-standart bədəni bərpa etdikdən, texniki manifesti və hissə kriptoqrafik xəşləri təsdiqlədikdən, bədəni davamlı şəkildə saxladıqdan sonra Səs-verməyə hazırlana bilər. və deterministik təsdiqləməni tamamlamaq. Əgər sürətli yol dayanarsa, bərpa çatdırılmanı Set B-yə genişləndirir. Sertifikatlaşdırılmış bədən bərpası və blok sinxronizasiyası, şəbəkə tərəfi bədəni almadan əvvəl nəticəni öyrəndikdə məhdud bərpa yolunu təmin edir.

Çoxzolaqlı icra əlavə olaraq hər icra zolağı subyektinə görə deterministik yük-sahibliyi kriptoqrafik xəş və zolaq-yerli RBC instansiya kriptoqrafik xəş yaradır. Bu şəxsiyyətlər icra xətti təkliflərini və sertifikatları qlobal konteyner əməliyyatına bağlayır; onlar ayrıca bir qlobal konsensus sessiyası deyillər. Bir blok hələ də yalnız şəbəkə iştirakçısının etibarlı konsensus yekunlaşdırma sertifikatına və uyğun yükün yerli olaraq mövcud olduğu zaman yekunlaşır.

Müstəqil RBC API son nöqtəsi yerinə autentifikasiya olunmuş operator səthlərindən istifadə edin:

- `iroha --operator-private-key-file <path> --output-format text ops sumeragi status` səlahiyyətli hündürlüyü, baxışı, mərhələni, sertifikatları və canlılıq vəziyyətini bildirir.
- `iroha --operator-private-key-file <path> --output-format text ops sumeragi diagnostics` qeyri-avtoritativ növbə, proqram təminatı emal iş axını, NPoS, icra zolağı və verilənlər məkanı diaqnostikalarını, o cümlədən icra zolağı yükü mülkiyyətini hesabat edir.
- Prometheus siqnalları kimi `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total` və `sumeragi_da_gate_satisfied_total` itkin-bədən bərpasını, məlumat-mövcudluq qapılarını və mesajın işlənməsini ayırır; bax [Performans və göstəricilər](/az/guide/advanced/metrics.md).

Kura yaddaş yerləşimi üçün törədilmiş icra yolu konfiqurasiyasından istifadə edir. Hər icra yolu `blocks/lane_000_core` və `merge_ledger/lane_000_core_merge.log` kimi deterministik yaddaş adları alır; icra yolu həyat dövründəki dəyişikliklər, qlobal blok ardıcıllığını dəyişdirmədən, həmin seqmentləri təmin edə, ləğv edə və ya təkrar adlandıra bilər.
