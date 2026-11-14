---
translation_locale: az
translation_source: /blockchain/consensus.md
translation_source_hash: 06b3589a71dcb08aed5589290f4c9af9cb46b5cee0f875ae542043543360f623
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Razılaşma {#consensus}

Əməliyyatlar Sumeragi onları blokda təklif etməzdən əvvəl növbəyə daxil edilir. Təsdiqləyicilər təklifi müstəqil şəkildə yoxlayır və icra edir, sonra yalnız təkrar edə biləcəkləri vəziyyət dəyişikliklərini imzalayırlar. Bir blok, tələb olunan təsdiqçi kvorumu həmin nəticədə razılaşdıqdan və uyğun yük mövcud olduqdan sonra yekunlaşdırılır.

Bütün Iroha 3 şəbəkələri imzalanmış RS16 məlumat-əldə etmə texniki manifesləri və parçalarını, həmçinin sertifikatlı bədən bərpasını istifadə edir. Məlumat mövcudluğu konsensus tələbi olub, seçimli yerləşdirmə xüsusiyyəti deyil.

## Sumeragi {#sumeragi}

Sumeragi Iroha-in Bizans səhv-tövsiyəsinə davamlı konsensus mühərrikidir. O, əməliyyatları növbədən götürür, təsdiqləyici şəbəkə iştirakçılarının eyni mövqedə razılaşmasını təmin edir sıralanmış blok və kifayət qədər təsdiqedici həmin nəticəni təkrarlayıb konsensus yekunlaşdırma sertifikatını imzaladıqdan sonra yalnız həmin bloku yekunlaşdırır.

### Təklif və razılıq yekunlaşdırma yolu {#proposal-and-commit-path}

Sumeragi reyestri hər dəfə bir blok hündürlüyü irəli aparır. Hər hündürlükdə bir təsdiqləyici cari baxış üçün təklifçi rolunu oynayır. Təklifçi uyğun əməliyyatları növbədən götürür, namizəd blok yaradır və təklifi aktiv təsdiqləyicilar dəstinə elan edir. Fəaliyyətsiz zəncirlər boş blok yaratmır.

Hər iki icazəli və Nominated Proof-of-Stake (NPoS) yerləşdirmələrində eyni Sumeragi proqram təminatı işləmə iş prosesi istifadə olunur:

1. Bir təsdiqləyici sıradakı əməliyyatlardan bir blok təklif edir.
2. Təsdiqləyicilər təklifləri eyni dünya vəziyyətinə qarşı əməliyyatları icra etməklə təsdiqləyirlər.
3. Təsdiqləyicilər mövcud hündürlük və baxış üçün səsləri və konsensus kvorum sertifikatlarını mübadilə edirlər.
4. Bir dəfə konsensusun yekunlaşdırılması üçün kvorum əldə olunduqda, şəbəkə həmkarları bloku yekunlaşdırır və öz dünya vəziyyətlərini yeniləyir.

Təsdiq edənlər yalnız yerli olaraq reproduksiya edə biləcəkləri məlumatları imzalayırlar. Səsvermədən əvvəl, təsdiq edən yoxlayır ki, təklif gözlənilən zəncire, hündürlüyə və baxışa aiddir; əməliyyat imzaları və limitlər protokol qaydalarına uyğundur; icra yolunun istiqamətləndirilməsi və icraçı təsdiqi deterministdir; və yükün icra olunmasının gözlənilən vəziyyət keçidini yaratdığını. Əgər yerli nəticə fərqlidirsə, təsdiqçi səs vermək əvəzinə təklifi rədd edir.

Səsvermələr kiçik imzalı konsensus mesajlarıdır. Onlar təklif olunan blok, hündürlük, baxış və təsdiqləyici şəxsiyyətinə istinad edir. Yoxlanılmış imzalar konsensus hazırlığı və yekunlaşdırma sertifikatlarını təşkil edir. Razılaşma yekunlaşdırma sertifikatı, kifayət qədər təstiqçi eyni blok üçün eyni nəticəni müşahidə etdiyini davamlı şəkildə sübut edən sənəddir. Hər bir təstiqçi özünü göndərir Tam komitəyə hazırlıq və yekunlaşdırma mərhələsi səsvermələri; hər hansı bir təsdiqləyici tələb olunan bərabər səsvermələri yığa və nəticədə yaranmış sertifikatı yayımlaya bilər.

### Kvorum və müşahidəçilər {#quorum-and-observers}

İlk buraxılış protokolu yalnız dəqiq `3f + 1` üzvdən ibarət, 4-dən 31-ə qədər təsdiqləyiciu olan səsvermə komitəsinə icazə verir. Buna görə etibarlı ölçülər 4, 7, 10 və bu qayda ilə 31-ə qədərdir. `n = 3f + 1` üçün Bizans nasazlığı həddi `f`, təsdiqləmə kvorumu isə `2f + 1` olur. Genezisin yaradılması və başlanğıc yoxlaması komitənin başqa ölçü quruluşlarını rədd edir. Hər PrepareQC, CommitQC və TimeoutCert dəqiq `q = n - f` bərabər çəkili təsdiqləyici səsi daşıyır; artıq imzalayanları olan dəstlər rədd edilir.

Müşahidəçi şəbəkə üzvləri yekunlaşdırılmış blokları sinxronizasiya edə bilər, lakin onlar təklif vermir, səs vermir və konsensusun yekunlaşdırma kvorumuna daxil edilmir. Yerli sorğu qabiliyyəti, indeksləşdirmə, monitorinq tələb edən yerləşdirmələrdə müşahidəçilərdən istifadə edin, və ya səsvermə səlahiyyətinə malik təsdiqləyicilərin sayını artırmadan regional blok təkrarlanması.

### Dəyişiklikləri və bərpanı gör {#view-changes-and-recovery}

Bir görünüş Sumeragi-in müəyyən bir təklifçi və zaman planı ilə bir hündürlüyü yekunlaşdırmaq cəhdidir. Əgər təklif, yük, səsvermə və ya konsensus yekunlaşdırma prosesi dayanarsa, konsensus pacemaker hündürlüyü daha sonrakı bir görmək üçün irəli apara bilər. Bir görünüş dəyişməsi yekunlaşdırılmış bloku yenidən yazmır. Bu, təsdiq edənlərin hələ yekunlaşmamış hündürlüyü tamamlamaya çalışmasını dəyişir, belə ki, şəbəkə qovşaqları ziddiyyətli blokları yekunlaşdırmasın deyə, ən yüksək məlum kvorum və ya konsensus yekunlaşdırma sübutunu irəli daşıyır.

Yükün bərpası sonluq qərarından ayrıdır. Şəbəkə tərəfdaşı tam blok yükünü almadan əvvəl kirayə və ya konsensus sonluq sertifikatı ala bilər. Bu halda, şəbəkə tərəfdaşı imzalanmış RS16 yükləmə hissələrini və ya sertifikatlı bir bədəni tələb edir, bərpa edilmiş baytları elan edilmiş kriptoqrafik xəşlərlə yoxlayır və yalnız bundan sonra bloku dünya vəziyyətinə və Kura tətbiq edir.

### Razılaşma rejimləri {#consensus-modes}

Seçilmiş rejim təsdiqləyicilar dəstinin necə formalaşdırıldığını və işlədiyini müəyyən edir. Rejim imzalanmış genezisdə [`consensus_mode`](/az/reference/genesis.md) vasitəsilə elan olunur və hər hündürlüyün kontekstində dəyişməz saxlanır. Yerli `[sumeragi]` konfiqurasiyası qovşağın rolunu, imzalama materiallarının mühafizəsini, təhlükəsizlik qeydlərinin yollarını və sənədləşdirilmiş vaxt aşımı və sinxronizasiya əvəzləmələrini seçir. Blok və əməliyyat hədləri, konsensus rejimi və blok ritmi imzalanmış genezisdən və təsdiqlənmiş vəziyyətdən gəlir. Təsdiqləyicilara eyni imzalanmış genezis, topologiya, etibarlı həmyaşıd qovşaq məlumatları və qüvvədə olan Sumeragi parametrləri lazımdır.

|Rejim|Ən uyğun|Təsdiqləyici dəsti|Əməliyyat diqqəti|
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
|İcazəli|Şəxsi, konsorsium və operator tərəfindən idarə olunan şəbəkələr|Təsdiqləyicilər yerləşdirmə tərəfindən razılaşdırılmış etibarlı şəbəkə həmkar topologiyasından gəlir|Bütün təsdiqləyiciləri eyni imzalanmış blokçeyn başlanğıcında, etibarlı şəbəkə iştirakçıları, şəbəkə iştirakçı açarları və Sumeragi parametrlərində saxlayın|
| NPoS | Validasiyanın namizəd irəli sürmə və pay siyasətinə əsaslandığı açıq və ya SORA Nexus yönümlü şəbəkələr | Təsdiqləyicilar NPoS profili ilə, adətən epoxalar üzrə seçilir və BLS açarları ilə sahiblik sübutları tələb olunur | Pay vəziyyətinin anlıq görüntülərini, imzalanmış epoxa və seçki girişlərini, təsdiqləyici PoPs-larını və dəyişməz blok ritmini bütün şəbəkədə uyğun saxlayın |

::: tip İcazəli rejim

Doğrulayıcı siyahısı açıq əməliyyat seçimi olduqda icazəli rejimdən istifadə edin. Bu, öz-özünə yerləşdirilmiş Iroha şəbəkələri üçün adi başlanğıc nöqtəsidir, çünki üzvlük dəyişiklikləri qəsdən idarəetmə və ya administrator əməliyyatlarıdır. Əhəmiyyətli əməliyyat qaydası belədir ki, hər bir təsdiqləyici blokçeyn başlanğıcını, etibarlı şəbəkə həmkarlarını, BLS Sahibliyin Sübutlarını və Sumeragi parametrləri eyni baxışla işlətməlidir. Fərqli topologiyaya malik və ya imzalanmış blokçeyn başlanğıcına sahib olan tək bir şəbəkə şəbəkəsi, şəbəkənin nəticəni yekunlaşdırmasının qarşısını ala bilər.

:::

::: tip NPoS rejimi

NPoS rejimindən istifadə edin, əgər yerləşdirmə profili təsdiqçinin iştirakının naminat və pay vəziyyəti tərəfindən yönləndirilməsini gözləyirsə. İctimai SORA Nexus yerləşdirmələr NPoS istifadə edir və onların yaradılmış profillərinə BLS təsdiqçi şəxsiyyətləri, Sahiblik Sübutları, epoxa parametrləri daxildir, və başlanğıcda tələb olunan Sumeragi NPoS parametrləri. Epoxa dəyişiklikləri müəyyən hündürlüklərdə aktiv valider dəstini əvəz edə bilər, buna görə operatorlar həm konsensus sağlamlığını, həm də növbəti siyahını təmin edən pay və ya nominasiyalar vəziyyətini izləməlidirlər.

:::

## Çoxzolaqlı razılıq {#multilane-consensus}

Məlumat məkanları məlumat, səlahiyyət, siyasət və tətbiqlər üçün mühitlər müəyyən edir. Onların zolaqları yayılma və sertifikatlaşdırma tutumunu artırır. Kataloqlar ayrıdır: `nexus.dataspace_catalog` məlumat məkanlarını, `nexus.lane_catalog` isə hər biri bir məlumat məkanına istinad edən zolaqları müəyyən edir. Bir neçə zolaq eyni məlumat məkanını paylaşa bilər.

Açıq qlobal icrada `0` zolağının ardıcıllığını qlobal Sumeragi instansiyası müəyyən edir. Digər hər bir aktiv zolaq nəsli öz sabitlənmiş komitəsi və konsensus parametrləri ilə eyni Sumeragi nüvəsinin ayrıca instansiyasını işlədir. Onun sertifikatlaşdırılmış bloku təsdiqlənmiş qlobal dayaq nöqtəsinə əsasən qəbulu yoxlanmış, sıralı əməliyyat paketini ehtiva edir. Zolağın sertifikatlaşdırılması qlobal State vəziyyətini dəyişmir.

Qlobal zəncir hər zolaqdan növbəti ardıcıl sertifikatlaşdırılmış blokları birləşdirir. Nəticədəki qlobal blokun icrası həmin əməliyyatları kanonik ardıcıllıqla tətbiq edir və qlobal CommitQC bu icranı yekunlaşdırır. Buna görə yalnız zolaq sertifikatı əməliyyatın qlobal State vəziyyətini dəyişdiyini iddia etmək üçün kifayət deyil. Bərpa və icra boyunca zolağın kimliyi, nəsli, dayaq nöqtəsinin aktuallığı, mənbənin mühafizəsi və fasiləsiz birləşmə sərhədləri yoxlanılır.

Təsdiqlənmiş `sumeragi_lane_policy` sabit zolaqları, marşrutları, komitələri və avtomatik miqyaslandırmanı idarə edir. Təkcə konfiqurasiya kataloqu konsensus zolağını aktivləşdirmir. Konkret məlumat məkanı hədəfləri qəbul edilmiş uyğun zolağa həll olunmalıdır; əlçatan olmayan özəl marşrut universal iş kimi icra edilmək əvəzinə rədd edilir. Tam idarəetmə müstəvisi paketləri `0` zolağından keçir ki, kataloq və aktivləşmə keçidləri irəliləyə bilsin.

Müstəqil imzalanmış məlumat məkanı kökü öz State vəziyyətinə və yerli yekunluğuna malik ayrıca icra sərhədidir. Məlumat məkanı kataloqunda qeydin qeydiyyatı həmin kökü yaratmır. Köklərarası atomiklik ayrıca AMX protokolundan istifadə edir. Sabitlənmiş namizəd versiyada bu yolun pul əməliyyatları və bütöv şəbəkə üzrə uyğunluq təsdiqi hələ açıqdır.

Sabitlənmiş [zolaq tətbiqinə](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/sumeragi/lanes/mod.rs), [zolaq müqaviləsinə](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi_lanes.md), [müstəqil məlumat məkanı müqaviləsinə](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi.md) və [uyğunluq təsdiqinin vəziyyətinə](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi_goals.md) baxın.

## Məlumatın mövcudluğu və yükün bərpası {#data-availability-and-payload-recovery}

Sumeragi V1 qlobal yükün əlçatanlığını imzalanmış RS16 `PayloadManifest` və `PayloadChunk` mesajları ilə təmin edir. Lider imzalanmış manifesti tam komitəyə göndərir və əvvəlcə deterministik parçaları Set A dəstinə paylayır. Təsdiqləyici yalnız kanonik gövdəni yenidən qurduqdan, manifesti və parça həşlərini yoxladıqdan, gövdəni davamlı saxladıqdan və deterministik validasiyanı tamamladıqdan sonra Prepare səsi verə bilər. Sürətli yol dayanarsa, bərpa parça çatdırılmasını Set B dəstinə genişləndirir. Sertifikatlaşdırılmış gövdənin bərpası və blok sinxronizasiyası, həmyaşıd qovşaq gövdəni almadan əvvəl yekunluğu öyrəndikdə, məhdudlaşdırılmış bərpa yolunu təmin edir.

Hər zolaq instansiyası öz autentifikasiya edilmiş əlçatanlıq və sertifikat kontekstindən istifadə edir. Qlobal birləşmə yoxlamaları onun sertifikatlaşdırılmış paketini və ilkin yükünü gözlənilən zolaq nəslinə və dayaq nöqtəsinə bağlayır. Həmyaşıd qovşaq qlobal yekunluğu yalnız uyğun qlobal yük və etibarlı CommitQC yerli olaraq mövcud olduqda tətbiq edir.

Müstəqil RBC API son nöqtəsi yerinə autentifikasiya olunmuş operator səthlərindən istifadə edin:

- `iroha --operator-private-key-file <path> --output-format text ops sumeragi status` səlahiyyətli hündürlüyü, baxışı, mərhələni, sertifikatları və canlılıq vəziyyətini bildirir.
- `iroha --operator-private-key-file <path> --output-format text ops sumeragi diagnostics` növbə, emal konveyeri, NPoS, zolaq və məlumat məkanı üzrə səlahiyyətli vəziyyət mənbəyi sayılmayan diaqnostika verir; buna zolaq yükünün sahibliyi də daxildir.
- Prometheus siqnalları kimi `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total` və `sumeragi_da_gate_satisfied_total` itkin-bədən bərpasını, məlumat-mövcudluq qapılarını və mesajın işlənməsini ayırır; bax [Performans və göstəricilər](/az/guide/advanced/metrics.md).

Zolaq blok anbarları birləşmə və bərpa üçün lazım olan sertifikatlaşdırılmış paketləri və mənbə qeydlərini saxlayır. Onların həyat dövrü təsdiqlənmiş zolaq nəslinə uyğun gedir; saxlama qovluğunun adı yeni zolağa və ya icra kökünə səlahiyyət vermir.
