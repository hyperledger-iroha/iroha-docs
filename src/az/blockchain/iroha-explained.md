---
translation_locale: az
translation_source: /blockchain/iroha-explained.md
translation_source_hash: ba591b2c1aa819837177625b1ae457b5fa492197576dc690b19ca2897562a436
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Açıqlanıb {#iroha-explained}

Iroha 3 ilk buraxılışda olan Hyperledger Iroha platformasıdır. Eyni mərkəz özünü hosted şəbəkələri və məlumat məkanları üçün SORA Nexus icra modelini dəstəkləyir və çox zolaqlı yönləndirmə.

## Əsas inşaat blokları {#core-building-blocks}

- `iroha3d` həmyaşıdları idarə edir
- Torii müştərinin və operatorun girişidir
- Sumeragi konsensus ilə məşğul olur
- Norito [kanoniki ikili formatdır ](/az/reference/norito.md)
- IVM portativ ağıllı müqavilələr və bayt kodunu icra edir.
- Kotodama yüksək səviyyəli `.ko` müqavilələri IVM `.to` byte koduna tərtib edir.
- Kagami açarları, mənşəyi, profilləri və lokal şəbəkələri hazırlayır
- SORA Nexus xidmət təyyarələri tətbiq hosting, məxfilik nəqliyyatı, saxlama və adlandırma üçün Soracloud, Inrou, SoraNet, SoraFS və SoraDNS əlavə edir

## İşə salınma modeli {#execution-model}

Hər bir dünya vəziyyətinin dəyişməsi hələ də əməliyyatlarla baş verir. IVM byte kodu və Torii Müştərilərin onları təqdim etməsi və ya təsirlərini müşahidə etməsinin əsas yolu budur.

- Nexus -dən xəbərdar konfiqurasiyalar bir neçə zolağı müəyyənləşdirə bilər
- məlumat məkanları eyni kitabın modelinin bir hissəsi olaraq qalarkən iş yüklərini təcrid edir.
- istiqamət siyasəti hansı iş sinfi ilə məşğul olduğunu müəyyənləşdirir.

## Bir çox məlumat məkanı memarlığı {#multi-dataspace-architecture}

Bir məlumat məkanı ayrı bir blok zinciri deyil, bir marşrut və ad məkanı sərhədidir. İdarə vaxtı hələ də bir `World`, bir əməliyyat modeli və bir konsensus boru xəttinə malikdir. Nexus qovşağa bu zolaqlar arasındakı bölmə işinin necə ediləcəyini və həmin zolaqların xidmət etdiyi məlumat məkanlarının necə adlandırılacağını izah edən kataloqlar əlavə edir.

İndirmə vaxtında bir məlumat boşluğu rəqəmsal `DataSpaceId` və kataloq metadata ilə təmsil olunur. `DataSpaceId::UNIVERSAL` `0` kimi qorunur; varsayılan kataloq `universal` məlumat boşluğunu ehtiva edir. Hər qurulmuş məlumat boşluğunun:

- unikal rəqəmi ID
- `universal`, `governance` və ya `zk` kimi unikal bir alias.
- operator səthləri üçün fakultativ bir təsvir
- Relay komitələrinin ölçülməsi üçün istifadə olunan sıfırdan kənar `fault_tolerance` qiyməti

Lənələr həmin məlumat sahələri ilə əlaqəli icra və saxlama yollarıdır.Lənə girişində `LaneId`, xidmət etdiyi `DataSpaceId`, bir əlifba, görünürlük (`public` və ya `restricted`), saxlama profili (`full_replica`, `commitment_only` və ya `split_replica`), sübut sxemi və seçməli idarəetmə, hesablaşma, İndirmə vaxtı Kura segment adları və deterministik açar prefiksləri daxil olmaqla, bu kataloqdan bir yol üçün saxlama geometriyasını çıxarır.

Yol yolu:

1. Konfiqurasiya təsdiqlənmiş `DataSpaceCatalog`, `LaneCatalog` və `LaneRoutingPolicy` sistemlərini quraşdırır. Bir çox zolaq, bir neçə məlumat sahəsi və ya əvvəlcədən təyin edilməyən marşrutlaşdırma `nexus.enabled = true` tələb olunur.
2. Transaksiya növbəsində aktiv zolaq yönləndiricisindən `RoutingDecision` bir zolağı ID və məlumat sahəsi ID ehtiva edən bir [PH000000) axtarır.
3. Xüsusi yönümləmə qaydaları səlahiyyət / hesab və ya təlimat etiketləri ilə uyğunlaşa bilər. uyğunlaşdırma qaidəsi olmadan router məlumat sahəsini domen IDs, aktivlərin tərif proqnozlarından, məlumat sahəsinə aid icazələrdən, ödəniş ayaqlarından və ya səlahiyyətli hesabın bağlanmış məkanından əldə edə bilər.
4. Çözülmüş marşrut hər iki kataloqla müqayisədə yoxlanılır.Məlum yollar, bilinməyən məlumat sahələri və yol / məlumat sahəsi uyğunsuzluqları deterministik marşrut səhvləridir. Əgər bir əməliyyat iki fərqli məlumat məkanı hədəflərinə yazılırsa, bu münaqişəli bir marşrut kimi rədd edilir; veri məkanı DVP/PVP arasında ödəniş universal koordinator zolağı ilə yönəldirilir.
5. Sumeragi və telemetriya tapşırıqı yol və məlumat məkanının fəaliyyəti, geri yükləmələr və öhdəlik sürətləri kimi görünür saxlayır.

Bu səbəbdən obyekt identifikatorları vacibdir. Domenlər ID -də məlumat sahəsi aliasını ehtiva edir, məsələn `payments.universal`, belə ki, domen ölçülü yazılar yönləndirilə bilər. Hesablar kanonik və domensiz qalır, buna görə eyni hesabı özünün `AccountId` dəyişmədən fərqli tətbiqi sahələrinə bağlaya bilərsiniz. Mülkiyyət tərifləri bir domen / məlumat sahəsi proyeksiyasını daşıya bilər ki, bu da aktiv əməliyyatlarına düzgün məlumat sahəsi marşrutunu miras almağa imkan verir.

Heç bir Nexus nodu tək bir zolaqdan istifadə edir və `universal` Məlumat sahəsi. SORA Profil onu üç yollu bir kataloqla əvəz edir: `core` universal ictimai zolaq üçün, `governance` idarəetmə əməliyyatı üçün və `zk` sıfır bilik bağlanması və müqavilə tətbiqi üçün trafik.

Bu üç standart iş yükü sinifləri üçün mövcuddur:

|Məlumat sahəsi |Lane |Nə üçün mövcuddur?|
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|`universal` |`core` |Normal ictimai kitabxana trafik və geri dönüş yönümləri üçün nəzərdə tutulmuş standart məlumat sahəsi (`DataSpaceId::UNIVERSAL == 0`) |
|`governance` |`governance` |İdarəetmə və parlament nəqliyyatı üçün məhdud yol, belə ki, nəzarət təyyarəsi fəaliyyəti ümumi tətbiqi yazılar ilə qarışdırılmır. |
|`zk` |`zk` |Sıfır bilik sübutları, əlavələr və müqavilə tətbiqi yönümləri üçün məhdudiyyətli zolaq, sübut ağır iş axınlarını normal yazılardan ayırır. |

Yalnız `universal` ayrılmış əsas xəttdir. `governance` və `zk` birləşmiş kataloq və marşrutlaşdırma siyasətində kodlanmış SORA profil seçimləridir; operatorlar fərqli məlumat məkanının sərhədlərinə ehtiyac duyduqları zaman fərqli bir kataloq müəyyən edə bilərlər.

Sumeragi hər zaman məlumatların mövcudluğunu və etibarlı yayımı istifadə edir. Bu yollar Iroha 3 konsensus protokolunun bir hissəsidir və yerləşdirmə profili tərəfindən söndürülə bilməz.

İdarəetmə vaxtı davranışı konfigurasiya fayllarından və zəncirdəki parametrlərdən alınır. Ətraf mühit dəyişiklikləri istehsal xüsusiyyət qapıları deyil.

## Sonrakı oxu {#read-next}

- [SORA Nexus xidmətləri](/az/blockchain/sora-nexus-services.md)
- [İndirmə Iroha 3](/az/get-started/launch-iroha.md)
- [Dünya, WSV, və Kura saxlama](/az/blockchain/world.md)
- [Genesis istinadı](/az/reference/genesis.md)
- [Torii son nöqtələri](/az/reference/torii-endpoints.md)
