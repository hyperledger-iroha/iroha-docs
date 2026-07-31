---
translation_locale: az
translation_source: /blockchain/consensus.md
translation_source_hash: a4c59672f20f0a3363fdd098852a7e0e8159fa082e88825d6346731733ecdcb0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import { withBase } from 'vitepress'
</script>

# Konsensus {#consensus}

Əməliyyatlar Sumeragi blokda təklif etməzdən əvvəl bir sıra daxil olur. Validatorlar təklifi müstəqil olaraq təsdiqləyirlər və icra edirlər, sonra da yalnız təkrarlaya biləcəkləri dövlət keçidini imzalayırlar. Bloq tələb olunan validator quorumunun bu nəticə ilə razılaşdıqdan sonra və uyğun pay yükü mövcud olduqda öhdəlik verir.

Bütün Iroha 3 şəbəkələr məlumatların mövcudluğu və etibarlı yayım yollarından istifadə edir. Bunlar konsensus tələbləri, seçmədən tətbiq xüsusiyyətlər deyil.

## Sumeragi {#sumeragi}

Sumeragi Iroha'ın Bizans səhv tolerant konsensus motorudur. O, sətirdən əməliyyatları alır, təsdiqçi həmyaşıdlarını eyni sifariş edilmiş blokda razılaşdırır və həmin blokı yalnız kifayət qədər təsdiqçilərin eyni nəticəni təkrarladıqdan və öhdəlik sertifikatını imzaladıqdan sonra yekunlaşdıra bilir.

<img :src="withBase('/sumeragi-round-dataflow.svg')" alt="Sumeragi proposal-to-commit data flow" />

### Təklif və öhdəlik yolu {#proposal-and-commit-path}

Sumeragi kitabxana bir blok yüksəklikdə bir dəfə irəli sürür. Hər hündürlükdə bir təsdiqçi cari görünüş üçün təklifçi kimi fəaliyyət göstərir. Təklifçi layiqli əməliyyatları növbəsindən boşaltır, namizədlər bloqu qurur və təklifini aktiv təsdiqçi dəstinə elan edir.

Eyni Sumeragi boru kəməri həm icazə verilən, həm də Nominated Proof-of-Stake (NPoS) yerləşdirilmələrində istifadə olunur:

1. Bir təsdiqçi növbəli əməliyyatlardan bir blok təklif edir.
2. Validatorlar təklifini eyni dünya dövlətinə qarşı əməliyyatları həyata keçirərək təsdiq edirlər.
3. Validatorlar mövcud hündürlük və görünüş üçün səslər və quorum sertifikatlarını mübadilə edirlər.
4. Komitə quorumuna çatdıqdan sonra, həmyaşıdlar blokun qarşısını alır və dünya vəziyyətini yeniləyirlər.

Validatorlar yalnız yerli olaraq təkrarlaya biləcək məlumatları imzalayırlar. Səsvermədən əvvəl bir validator təklifin gözlənilən zəncirə, hündürlüyə və görünüşə aid olduğunu yoxlayır; əməliyyat imzalanmalarının və məhdudlaşmaların etibarlı olub-olmadığını; yolun yönləndirilməsi və icraçının təsdiq edilməsinin müəyyənləşdirilməsini; Əgər yerli nəticə fərqlənirsə, təsdiqçi ona səs verməyin əvəzinə təklifini rədd edir.

Oylar kiçik imzalanmış razılaşma mesajlarıdır. Onlar təklif olunmuş blok, hündürlük, baxış və təsdiqçi kimliyi ilə əlaqədardır. Toplayıcılar bu səsləri quorum sertifikatına və ya komit sertifikatına cəmləyirlər. Səsvermə eyni blok üçün kifayət qədər təsdiqçilərin eyni nəticəni müşahidə etdiyini sübut edən davamlı bir sübutdur.

### Kvorum, toplayıcılar və müşahidəçilər {#quorum-collectors-and-observers}

Seçki təsdiqçilərinin sayı `n` Bizans səhv büdcəsini müəyyənləşdirir. Ən azı dörd təsdiqçi olan şəbəkələr üçün büdcə `f = floor((n - 1) / 3)` və komitə quorum `2f + 1`dir. Bir-üç təsdiqçi üçün bütün təsdiqçilərin öhdəsindən gəlmək üçün tələb olunur, bu da inkişaf üçün faydalıdır, lakin praktik offline boşluq yoxdur.

Kollektorlar bir fayl optimallaşdırmasıdır. Hər təsdiqləyici hər səsini digər təsdiqləyicilərə göndərmək əvəzinə Sumeragi hündürlük üçün bir və ya daha çox toplayıcı seçə bilər. Toplayıcılar səsləri toplayırlar, quorum irəliləyişini dərc edirlər və ikiqat səs trafikinin miqdarını azaldırlar. Fəaliyyətli kollektor parametrləri `GET /v1/sumeragi/collectors` vasitəsilə aşkar edilir; CLI'in `ops sumeragi telemetry` sürətli görüntüsü mövcud kollektor sayını bildirir.

Müşahidəçi həmyaşıdları hədəfləndirilmiş blokları sinxronlaşdıra bilərlər, lakin onlar təklif etmirlər, səs vermirlər, səs toplamırlar və ya komitə quorumuna hesablamazlar.

### Dəyişikliklər və bərpa görüntüsünə baxın {#view-changes-and-recovery}

Bir baxış Sumeragi tərəfindən bir hündürlüyü müəyyən bir təklifçi və vaxt planı ilə yekunlaşdırmaq cəhdidir. Əgər təklif, payload, səsvermə və ya irəliləyiş təxirə salınırsa, ürək ölçüsü hündürlüyü daha sonrakı bir baxışa köçürə bilər. Müvafiq blokları başa çatdırmamaq üçün ən yüksək bilinən quorum və ya sübutlar göndərməklə, təsdiqçilərin qarşılıqlı blokları bitirməyə çalışdıqlarını dəyişir.

Faydalı yükün bərpası yekunluq qərarından ayrıdır. Bir həmyaşıd tam blok faydalı yükünü əldə etmədən əvvəl quorum və ya öhdəlik sertifikatını ala bilər. Bu vəziyyətdə, həmyaşıda paydalı yükü bərpa etmək üçün etibarlı yayım (RBC) və ya blok sinxronizasiyasından istifadə edərək, onu reklamlaşdırılmış həşlərlə təsdiqləyir, və yalnız bundan sonra blokun dünya dövlətinə və Kura tətbiq olunur.

### Konsensus üsulları {#consensus-modes}

Seçilmiş rejim təsdiqləyici dəstinin necə formalaşdığını və işlədiyini idarə edir. O, [ `consensus_mode`](/az/reference/genesis.md) vasitəsilə təməldə və `sumeragi.consensus_mode` vasitəsilə həmyaşıd konfigurasiyasında elan olunur. Bunu şəbəkə üzrə vəziyyət kimi qəbul edin: təsdiqləyicilərə eyni imzalanmış mənşəli, topologiya, etibarlı həmyaşıd məlumatları və effektiv Sumeragi parametrləri lazımdır.

<img :src="withBase('/sumeragi-mode-dataflow.svg')" alt="Sumeragi consensus mode data flow" />

|Modu |Ən yaxşı uyğunluq .|Validator seti |Operativ diqqət mərkəzi |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
|İzin verilir |Xüsusi, konsorsium və operator tərəfindən idarə olunan şəbəkələr |Validatorlar yerləşdirmə ilə razılaşdırılmış etibarlı həmyaşıd topologiyasından gəlir |Bütün təsdiqləyicilərin eyni imzalanmış mənbəyi, etibarlı həmyaşıdları, həmyaşıddı açarları və Sumeragi parametrlərini saxlayın.|
|NPOS |İctimai və ya Nexus istiqamətində olan şəbəkələrdə təsdiqləmə nominasiya və pay siyasətindən sonra həyata keçirilir |Validatorlar NPoS profili ilə seçilir, adətən dövrlər boyu və BLS açarları və sahiblik sübutlarını tələb edir. |Qeydiyyatın sürətli görüntülərini, dövr parametrlərini, validatoru PoPs və NPoS mərhələ vaxtlarını şəbəkədə uyğun saxlayın |

::: tip İzin verilən rejim

Validator siyahısı açıq bir əməliyyat seçimi olduqda icazəli rejimdən istifadə edin. Bu, özünü hosted Iroha şəbəkələr üçün adi başlanğıc nöqtəsidir, çünki üzvlük dəyişiklikləri məqsədyönlü idarəetmə və ya administrator hərəkətlərdir. Əhəmiyyətli əməliyyat qaidəsi odur ki, hər bir təsdiqçi özəllik, etibarlı həmyaşıdlar, BLS Mülkiyyət sübutları və Sumeragi parametrləri haqqında eyni baxışla işləməlidir.

:::

::: tip NPOS rejimi

NPoS rejimindən istifadə edin, əgər yerləşdirmə profili təsdiqçi iştirakının namizədliyə və mərc vəziyyətinə görə idarə ediləcəyini gözləyir. SORA Nexus NPoS-dən istifadə edən yerləşdirmələr və onların yaradılmış profillərində BLS təsdiqləyici kimliyi, sahiblik sübutları, dövr parametrləri və Sumeragi Epoch dəyişiklikləri müəyyən hündürlüklərdə təyin edilmiş aktiv təsdiqçi əvəz edə bilər, Beləliklə, operatorlar həm konsensusın sağlamlığını, həm də növbəti siyahıya daxil olan pay və ya namizədlik vəziyyətini izləməlidir.

:::

## Multilane konsensus {#multilane-consensus}

Iroha multilane konsensus yolu Nexus zolaq və məlumat məkanı konfigurasiyası vasitəsilə həyata keçirilir. Sumeragi hələ də bir sifariş edilmiş blok axını tamamlayır; sahələr əməliyyatların bu axının içində necə yönəldiyini, planlaşdırıldığını, hesablanıldığını və saxlandığını təsvir edir.

Döyüş vaxtı konfigüratsiyası üç parça zolaq vəziyyətini qurur:

- `lane_catalog`: hər biri nömrəli `LaneId`, alias, məlumat sahəsi, görünürlük, saxlama profili, sübut sxemi və metadata malik olan konfiqurasiya edilmiş zolaqlar.
- `dataspace_catalog`: konfiqurasiyalı məlumat sahələri, hər biri `DataSpaceId` nömrəli və relay komitəsinin ölçülməsi üçün istifadə olunan səhv tolerantlığı dəyərinə malikdir.
- `routing_policy`: hesabları və ya təlimat yollarını uyğunlaşdıra bilən standart zolaq / məlumat sahəsi cütlüyü və sifariş olunmuş marşrut qaydaları.

Bir əməliyyat növbə daxil olduqda, yol yönəltici onu bir `RoutingDecision { lane_id, dataspace_id }`. Tək yol rejimində bu, həmişə yoldur. `0` və universal məlumat məkanı. Nexus mode, qurulmuş router məlumat məkanına uyğun qaydaları tətbiq edir, ödənişlərin yönləndirilməsi, hesab qaydaları, açıq yönləndirmə qaydaları, Qəbul edilmiş yol və məlumat məkanı onların kataloqlarında olmalıdır, və zolaq həll edilmiş məlumat sahəsi ilə bağlanmalıdır; əks halda əməliyyat növbədən əvvəl rədd edilir.

Siyahı bu yönləndirmə qərarını əməliyyat həşi ilə saxlayır ki, sonrakı mərhələlərdə onu yenidən çıxarmaq məcburiyyətində qalmasın.

- O, əməliyyatları şeritdən-şeritə keçirir ki, yalnız onun əməliyyatları ilk növbədə sifariş olunduğu üçün bir şerit blokuna hakim olmasın.
- Bu, bir zolaq üzrə əməliyyat icrası vahidinin (TEU) həddini tətbiq edir. Bir zolağın qurulmuş qabiliyyətindən çox olan əməliyyatlar təxirə salınır və növbədən keçirilir, yalnız bir zolaq üçün ilk artıq çəki əməliyyatının canlı bloklanmaması üçün qəbul edilə bilər.

etibarlı yayım zamanı, Sumeragi Qeydiyyatda qeyd olunan ümumi əməliyyatların sayı, yayım hissələri, payload baytları və TEU. Komitə etdikdən sonra, bu toplamlar yol və məlumat məkanı üzərinə götürülən öhdəlikləri Sumeragi status. Bir blokda zolaq hesablama qəbulu varsa, blok işlənməsi də zolaq hesablaması öhdəlikləri və relay yaratır blok başlığını bağlayan qovluqlar, öhdəlik sertifikatı, məlumatların mövcudluğu ilə bağlı öhdəliyi hash, hesablaşma sübutları, və yol yükünün ölçüsü.

## etibarlı yayım (RBC) {#reliable-broadcast-rbc}

Güvenilir yayım (RBC) - Sumeragi payload yayılması və bərpa yolu. Bu, təsdiqləyicilərə və müşahidəçilərə təklifə aid olan blok orqanını əldə etməyə və ya sertifikatı bağlamağa kömək edir, xüsusən də `BlockCreated` mesajının, blok sinxronlaşdırma yeniləməsinin və ya birbaşa payload ötürülməsinin gecikdirildiyi və ya itirildiyi zaman.

RBC payload səviyyəsində işləyir. təklifçi blok hündürlüyü, görünüşü və payload hash üçün bir RBC seansı elan edir, sonra komit topologiyası boyunca payload parçaları göndərir. Tərəfdaşlar hissə qəbulu izləyirlər, bərpa edilmiş faydalı yükü reklamlaşdırılmış həşlə müqayisədə təsdiqləyirlər və kifayət qədər təsdiqçi eyni paydalı yükünü müşahidə etdikdən sonra `READY` və `DELIVER` siqnallarını dəyişdirirlər. Sessiyalar TTL ilə məhdudlaşdırılır, parça, fanout, pending-stash və davamlı mağazada məhdudiyyətlər, buna görə bərpa trafikinin limitsiz artması mümkün deyil.

RBC ayrı bir konsensus qərarı deyil və öhdəlik sertifikatını əvəz etmir. Bir blok hələ də yalnız həmyaşıdın etibarlı öhdəliyyət sertifikatına və yerli uyğunluqda pay yükünə sahib olduğu zaman başa çatır. RBC məcburi mövcudluğun sübutunu və faydalı yükün bərpasını təmin edir, şərtləmə tərəqqisi isə commit sertifikatı əlavə lokal payload tərəfindən idarə olunur. Əgər sertifikat payloaddan əvvəl çatırsa, həmyaşıd RBC vasitəsilə və ya blok sinxronizasiyası vasitəsilə payloadı bərpa edə bilər və sonra commit edə bilər.

Əməliyyat baxımından, RBC çatışmaz pay yükü və məlumatların mövcudluğu boğazlarının diaqnozlaşdırılması üçün faydalıdır:

- `iroha --output-format text ops sumeragi telemetry` ümumi mövcudluq səslərini, cari toplayıcı sayını və gözlənilir RBC iclaslarını göstərir.
- `GET /v1/sumeragi/rbc` və `GET /v1/sumeragi/rbc/sessions` bölmələrin irəliləyişini, hazırlığı, çatdırılma vəziyyətini və yol və ya məlumat məkanının geri qalxmasını daxil olmaqla, Torii üzrə ətraflı ümumi və aktiv seans məlumatlarını açıqlayır; bax [Torii son nöqtələrini ](/az/reference/torii-endpoints.md).
- Prometheus siqnalları, məsələn `sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` və per-lane və ya per-dataspace RBC backlog ölçmələri şəbəkə itkisini, hissə bərpasını və saxlama təzyiqini ayırmağa kömək edir; bax [ Performance and metrics](/az/guide/advanced/metrics.md).

Kura saxlama düzənliyi üçün mənşəli yol konfigurasiyasını istifadə edir. Hər bir yol `blocks/lane_000_core` və `merge_ledger/lane_000_core_merge.log` kimi təyinatlı saxlama adlarını alır; yol həyat dövrü dəyişiklikləri qlobal blok sıralamasını dəyişdirmədən həmin segmentləri təmin edə, geri çəkə və ya yenidən etiketləyə bilər.
