---
translation_locale: az
translation_source: /blockchain/iroha-explained.md
translation_source_hash: ba591b2c1aa819837177625b1ae457b5fa492197576dc690b19ca2897562a436
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha İzah olundu {#iroha-explained}

Iroha 3 ilk buraxılış Hyperledger Iroha platformasıdır. Eyni əsas öz-özünə yerləşdirilən şəbəkələri və məlumat məkanları və çoxzolaqlı yönləndirmə üçün SORA Nexus icra modelini dəstəkləyir.

## Əsas Tikinti Blokları {#core-building-blocks}

- `iroha3d` şəbəkə həmkarlarını işlədir
- Torii müştəri və operator qovşağıdır
- Sumeragi konsensusu idarə edir
- Norito [tək protokol-standart ikilik format](/az/reference/norito.md)-dir
- IVM daşına bilən ağıllı müqavilələri və baytkodu işlədir
- Kotodama yüksək səviyyəli `.ko` müqavilələri IVM `.to` baytkoduna yığır
- Kagami açarları, blokçeyn başlanğıcını, profilləri və lokal şəbəkələri hazırlayır
- SORA Nexus xidmət təyyarələri tətbiq hostinqi, məxfilik nəqliyyatı, saxlanma və adlandırma üçün Soracloud, Inrou, SoraNet, SoraFS və SoraDNS əlavə edir

## İcra modeli {#execution-model}

Dünyanın vəziyyətinə edilən hər dəyişiklik hələ də əməliyyatlar vasitəsilə baş verir. Əməliyyatlar təlimatları və ya IVM baytkodunu daşıyır və Torii müştərilərin onları təqdim etməsinin və ya təsirini müşahidə etməsinin əsas yoludur.

- Nexus-məlumatlı konfiqurasiyalar bir neçə icra yolunu təyin edə bilər
- məlumat sahələri iş yüklərini təcrid edir və eyni blockchain dəftər modeli hissəsi olaraq qalır
- Routing siyasəti iş sinfini hansı icra zolağı və məlumat sahəsinin idarə edəcəyinə qərar verir

## Çox-Məlumat Məkanlı Memarlıq {#multi-dataspace-architecture}

Məlumat məkanı yönləndirmə və ad sahəsi həddi olub, ayrı bir blokçeyn deyil. Proqramın icra mühiti hələ də bir `World`, bir əməliyyat modeli malikdir, və bir konsensus proqram təminatı emal iş axını. Nexus icra zolaqları boyunca işi necə bölüşdürmək və həmin icra zolaqlarının xidmət etdiyi verilənlər məkanlarını necə adlandırmaq barədə node-a məlumat verən kataloqlar əlavə edir.

Proqram icra mühitində verilənlər sahəsi ədədi `DataSpaceId` və kataloq metadatası ilə göstərilir. `DataSpaceId::UNIVERSAL` `0` kimi ayrılmışdır; standart kataloq `universal` verilənlər sahəsini ehtiva edir. Hər bir konfiqurasiya edilmiş verilənlər sahəsi malikdir:

- unikal ədədi identifikator
- məsələn, `universal`, `governance` və ya `zk` kimi unikal ləqəb
- operator səthləri üçün isteğe bağlı təsvir
- rilay komitələrinin ölçüsünü təyin etmək üçün istifadə olunan sıfır olmayan `fault_tolerance` dəyər

icra zolaqları həmin məlumat məkanlarına bağlı icra və saxlama yollarıdır. Bir icra zolağı girişi `LaneId`-ı, xidmət etdiyi `DataSpaceId`-i, ləqəbi, görünürlüyü (`public` və ya `restricted`), saxlama profili (`full_replica`, `commitment_only` və ya `split_replica`), sübut sxemi və istəyə bağlı idarəçiliyi daşıyır, maliyyə əməliyyatının həlli və planlayıcı metaverisi. Proqram icra mühiti bu kataloqdan hər-zolaqlı saxlama geometriyasını çıxardır, o cümlədən Kura seqment adları və deterministik açar prefikslərini.

Marşrutlaşdırma yolu belədir:

1. Konfiqurasiya təsdiqlənmiş `DataSpaceCatalog`, `LaneCatalog` və `LaneRoutingPolicy` qurur. Çoxlu icra zolaqları, çoxlu məlumat sahələri və ya standart olmayan marşrutlaşdırma `nexus.enabled = true` tələb edir.
2. Əməliyyat növbəsi aktiv icra zolağı yönləndiricisindən icra zolağı ID-si və məlumat sahəsi ID-si olan `RoutingDecision` tələb edir.
3. Aydın marşrutlaşdırma qaydaları səlahiyyət/hesab və ya təlimat etiketi ilə uyğun gələ bilər. Uyğun qayda olmadıqda, marşrutlaşdırıcı məlumat sahəsini domen ID-lərindən, aktiv-təyinat proyeksiyalarından, məlumat sahəsinə aid icazələrdən, maliyyə köçürmə hissələrindən və ya səlahiyyət verənin bağlı hesab sahəsindən çıxara bilər.
4. Həll olunmuş marşrut hər iki kataloqla yoxlanılır. Naməlum icra zolaqları, naməlum məlumat sahələri və zolaq/məlumat sahəsi uyğunsuzluqları determinist marşrutlama səhvləridir. Əgər bir əməliyyat iki fərqli məlumat sahəsi hədəfinə yazırsa, o, ziddiyyətli marşrut kimi rədd edilir; məlumat sahələri arasındakı DVP/PVP maliyyə əməliyyatının həlli universal koordinator icra yolu vasitəsilə yönləndirilir.
5. Sumeragi və telemetriya, tapşırığı icra zolağı və məlumat sahəsi fəaliyyəti, artım siyahısı və kriptoqrafik öhdəlik dəyəri şəkilləri kimi görünən saxlayır.

Buna görə obyekt identifikatorları əhəmiyyətlidir. Domenlər ID-lərində verilənlər məkanı ləqəbini ehtiva edir, məsələn `payments.universal`, beləliklə domen çatışlı yazılar yönləndirilə bilər. Hesablar isə tək protokol-standart və domensiz qalır, Beləliklə, eyni hesab fərqli tətbiq sahələrinə onun `AccountId`-ni dəyişdirmədən bağlana bilər. Aktiv tərifləri domen/dataspace proyeksiyasını daşıya bilər, bu da aktiv əməliyyatlarının düzgün dataspace marşrutunu miras almasına imkan verir.

Nexus üstünlükləri olmadan, düyün tək bir icra yolundan və `universal` məlumat məkanından istifadə edir. Quraşdırılmış SORA profili bunu üç yollu kataloqu əvəz edir: `core` universal ictimai icra zolağı üçün, `governance` idarəetmə trafiki üçün və `zk` sıfır-bilik əlavə və müqavilə yerləşdirmə trafiki üçün.

Bu üç standart iş yükü siniflərini ayırmaq üçün mövcuddur:

|Məlumat məkanı|icra zolağı|Niyə mövcuddur|
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal` | `core`       |Sadə ictimai blokçeyn qeydiyyat trafiki və ehtiyat marşrutlaşdırma üçün ayrılmış standart verilənlər məkanı (`DataSpaceId::UNIVERSAL == 0`).|
| `governance` | `governance` |Hökumət və parlament trafiki üçün məhdudlaşdırılmış icra zolağı, beləliklə idarəetmə təbəqəsinin fəaliyyəti ümumi tətbiq yazıları ilə qarışmır.|
| `zk`         | `zk`         |Sıfır-bilik sübutları, əlavələr və müqavilə yerləşdirmə istiqamətləndirməsi üçün məhdud icra zolağı, sübuta əsaslanan iş axınlarını normal yazılardan ayrı saxlayır.|

Yalnız `universal` rezerv edilmiş əsas xəttdir. `governance` və `zk` paketlənmiş kataloqda və marşrut siyasətində kodlaşdırılmış SORA profil seçimləridir; operatorlar fərqli məlumat sahəsi sərhədlərinə ehtiyac olduqda fərqli kataloq təyin edə bilərlər.

Sumeragi həmişə məlumat əlçatanlığından və etibarlı yayımdan istifadə edir. Bu yollar Iroha 3 konsensus protokolunun bir hissəsidir və yerləşdirmə profili tərəfindən deaktiv edilə bilməz.

Proqram təminatının icra mühiti davranışı konfiqurasiya fayllarından və zəncir üzərindəki parametrlərdən əldə olunur. Ətraf mühit dəyişənləri istehsal xüsusiyyət qapıları deyildir.

## Növbəti oxu {#read-next}

- [SORA Nexus xidmətləri](/az/blockchain/sora-nexus-services.md)
- [Iroha 3-ı işə sal](/az/get-started/launch-iroha.md)
- [Dünya, WSV və Kura saxlama](/az/blockchain/world.md)
- [blokçeyn başlanğıc istinadı](/az/reference/genesis.md)
- [Torii API son nöqtələr](/az/reference/torii-endpoints.md)
