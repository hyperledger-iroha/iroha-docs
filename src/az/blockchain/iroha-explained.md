---
translation_locale: az
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 16acd0a607bbec336ff336363478a3a0deeb24ad9a2ad59e753c9f65134b061f
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

- məlumat məkanları qurumların məlumatları, səlahiyyətləri, siyasəti və tətbiqləri üçün mühitlər təmin edir
- zolaqlar həmin mühitlər daxilində marşrutlaşdırma və sertifikatlaşdırma tutumu təmin edir
- müstəqil imzalanmış məlumat məkanı kökü öz State vəziyyətinə və yerli yekunluğuna sahibdir

## Məlumat məkanları və icra kökləri {#multi-dataspace-architecture}

Məlumat məkanı kataloqundakı qeyd bir mühiti və onun kimliyini müəyyən edir. Kataloq qeydi təkbaşına müstəqil icra kökü yaratmır. Açıq zolaqlar əməliyyat paketlərini qlobal zəncirdə icra edilmək üçün sertifikatlaşdırır; müstəqil imzalanmış məlumat məkanı kökünün isə öz State vəziyyəti, komitəsi və yerli yekunluğu var.

`DataSpaceCatalog` məlumat məkanlarını, `LaneCatalog` isə zolaqları müəyyən edir. Hər zolaq `dataspace_id` vasitəsilə dəqiq bir məlumat məkanına istinad edir; bir məlumat məkanı bir neçə zolaq saxlaya bilər. `DataSpaceId` və `LaneId` ayrı kimliklərdir və zolaq ləqəbi başqa məlumat məkanı yaratmır.

İcra zamanı məlumat məkanı ədədi `DataSpaceId` və kataloq metaməlumatı ilə təmsil olunur. `DataSpaceId::UNIVERSAL` üçün `0` ayrılıb; standart kataloq `universal` məlumat məkanını ehtiva edir. Hər konfiqurasiya edilmiş məlumat məkanında bunlar var:

- unikal ədədi identifikator
- `universal` kimi unikal ləqəb və ya açıq şəkildə qeydiyyatdan keçirilmiş qurum adı
- operator səthləri üçün isteğe bağlı təsvir
- rilay komitələrinin ölçüsünü təyin etmək üçün istifadə olunan sıfır olmayan `fault_tolerance` dəyər

Zolaqlar həmin məlumat məkanlarına bağlanmış marşrutlaşdırma və sertifikatlaşdırma resurslarıdır. Zolaq qeydi `LaneId`, xidmət etdiyi `DataSpaceId`, ləqəb, görünmə rejimi (`public` və ya `restricted`), saxlama profili (`full_replica`, `commitment_only` və ya `split_replica`), sübut sxemi və məcburi olmayan idarəetmə, hesablaşma və planlaşdırıcı metaməlumatını daşıyır. İcra mühiti Kura seqment adları və deterministik açar prefiksləri daxil olmaqla hər zolağın saxlama quruluşunu bu kataloqdan törədir.

Marşrutlaşdırma yolu belədir:

1. Konfiqurasiya yoxlanmış `DataSpaceCatalog`, `LaneCatalog` və `LaneRoutingPolicy` yaradır. SORA Nexus marşrutlaşdırması məcburidir. Qlobal kökdə bir neçə məlumat məkanı, zolaq və ya standartdan fərqli marşrutlaşdırma SORA Nexus profilini (`--sora`) və NPoS tələb edir; müstəqil imzalanmış məlumat məkanı kökü icazəli rejimdə işləyir.
2. Əməliyyat növbəsi əməliyyatdan və təsdiqlənmiş vəziyyətdən `RoutingPlan` müəyyən edir. Hər əlaqələndirici və ya iştirakçı marşrutunda zolaq ID-si və məlumat məkanı ID-si var; Native AMX planları bütün iştirakçılar dəstini saxlayır.
3. Qlobal icra üçün tam idarəetmə müstəvisi paketləri və məlumat məkanlarıarası əlaqələndiricilər `0` zolağından istifadə edir. Konkret qeyri-universal təlimat və ya müqavilə ünvanı hədəfləri hesab və ya təlimat etiketi qaydalarından əvvəl uyğun məlumat məkanı və komitəsi olan qəbul edilmiş sabit zolağı seçir. Digər iş təsdiqlənmiş açıq qaydalara və standart bölmələməyə əsaslanır; konkret universal hədəflər universal zolaqlarda qalır.
4. Hər marşrut kataloqlara və aktiv zolaq vəziyyətinə qarşı yoxlanılır. Naməlum ID-lər və zolaq/məlumat məkanı uyğunsuzluqları rədd edilir; əlçatan olmayan özəl hədəf universal icraya keçə bilməz. Bir neçə məlumat məkanı hədəfi Native AMX planı yarada bilər. Əməliyyat metaməlumatında `amx_policy` üçün `reject_cross_dataspace` təyin edilməsi məlumat məkanlarıarası planları rədd edir. Təkcə marşrutlaşdırma planı müstəqil köklər arasında hesablaşmaya icazə vermir və onu tamamlamır.
5. Telemetriya təyinatı `/status` zolaq anlıq görüntüsündə (`teu_lane_commit`) hər zolaq üzrə fəaliyyət və gözləyən iş həcmi kimi görünən saxlayır.

Obyekt identifikatorlarının əhəmiyyəti buradan gəlir. Domenlər öz ID-lərində məlumat məkanı ləqəbini, məsələn `payments.universal`, saxlayır ki, domen çərçivəsindəki yazmalar yönləndirilə bilsin. Hesablar kanonik və domensiz qalır; beləliklə eyni hesab `AccountId` dəyişmədən müxtəlif tətbiq çərçivələrinə bağlana bilər. Aktiv tərifləri domen/məlumat məkanı proyeksiyası daşıya bilər və bu, aktiv əməliyyatlarının düzgün məlumat məkanı marşrutunu miras almasına imkan verir.

SORA Nexus əvəzləmələri olmadan qovşaq bir zolaqdan və `universal` məlumat məkanından istifadə edir. Təqdim olunan SORA Nexus profili bunu üçzolaqlı kataloqla əvəz edir: universal açıq zolaq üçün `core`, idarəetmə trafiki üçün `governance`, sıfır bilik əlavələri və müqavilə yerləşdirmə trafiki üçün `zk`.

Təqdim olunan hər üç zolaq açıqdır və eyni `universal` məlumat məkanına istinad edir. Onlar iş yükü siniflərini ayırır:

| Məlumat məkanı | Zolaq | Mövcudluğunun səbəbi |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal` | `core` | Adi açıq reyestr trafiki və standart marşrutlaşdırma. |
| `universal` | `governance` | Açıq idarəetmə və SORA Parliament trafiki. |
| `universal` | `zk` | Açıq sıfır bilik əlavələri və müqavilə yerləşdirmə trafiki. |

`DataSpaceId::UNIVERSAL == 0` ayrılmış əsas qiymətdir. Yuxarıdakı `governance` və `zk` adları ayrı məlumat məkanlarını deyil, zolaqları göstərir. Fərqli qurum sərhədləri açıq məlumat məkanı qeydləri tələb edir; müstəqil icra əlavə olaraq müstəqil autentifikasiya edilmiş kök tələb edir.

Bu əlaqələri sabitlənmiş [profil qurucuları](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_config/src/parameters/actual.rs), [zolaq tətbiqi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/sumeragi/lanes/mod.rs) və [müstəqil kök müqaviləsi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi.md) müəyyən edir.

Sumeragi həmişə imzalanmış RS16 yük əlçatanlığından və sertifikatlaşdırılmış gövdə bərpasından istifadə edir. Bu yollar Iroha 3 konsensus protokolunun bir hissəsidir və yerləşdirmə profili tərəfindən deaktiv edilə bilməz.

Proqram təminatının icra mühiti davranışı konfiqurasiya fayllarından və zəncir üzərindəki parametrlərdən əldə olunur. Ətraf mühit dəyişənləri istehsal xüsusiyyət qapıları deyildir.

## Növbəti oxu {#read-next}

- [SORA Nexus xidmətləri](/az/blockchain/sora-nexus-services.md)
- [Iroha 3-ı işə sal](/az/get-started/launch-iroha.md)
- [Dünya, WSV və Kura saxlama](/az/blockchain/world.md)
- [blokçeyn başlanğıc istinadı](/az/reference/genesis.md)
- [Torii son nöqtələri](/az/reference/torii-endpoints.md)
