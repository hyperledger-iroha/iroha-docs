---
translation_locale: az
translation_source: /guide/security/fraud-monitoring.md
translation_source_hash: 4739a0bfe80f14545a51c804abbe6a2dfa5497d546192f76096f938a0af70184
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Fırıldaqçılığın Monitorinqi {#fraud-monitoring}

Bir Iroha yerləşdirilməsi üçün saxtakarlığın monitorinqi blokçeyn qeyd dəftəri hadisələri, sorğular, icazələr və tətbiq konteksti ətrafında qurulmuş əməliyyat nəzarətidir. Iroha nə təqdim edildiyini, qəbul edildiyini, rədd edildiyini və tamamlandığını qeyd edir. Sizin izləmə sisteminiz biznes prosesiniz üçün hansı nümunələrin şübhəli olduğunu müəyyən edir və həmin halları nəzərdən keçirənlərə və ya avtomatlaşdırılmış cavab nəzarətlərinə yönləndirir.

Fırıldaqçılığın izlənməsini valyuta yoxlayıcısına daxil edilmiş məntiqdən üstün tutulan ayrıca xidmət kimi qəbul edin. Xidmət blokçeyn dəftəri fəaliyyətinə abunə olmalı, onu zəncirxaric risk konteksti ilə zənginləşdirməli, sübutları saxlamalı və cavab əməliyyatlarını yalnız açıq icazəsi olan hesablar vasitəsilə təqdim etməlidir.

## Monitorinq modeli {#monitoring-model}

Faydalı bir izləmə proqram təminatı işləmə prosesi dörd mərhələdən ibarətdir:

1. Torii hadisə axınlarından, sorğulardan və metriklərdən blokçeyn dəftəri və operator siqnallarını toplayın.
2. Hadisələri müştəri vəziyyəti, qarşı tərəf siyahıları, tətbiq sessiyası identifikatorları, gözlənilən limitlər və iş nömrələri kimi zəncirdən kənar kontekstlə zənginləşdirin.
3. Şübhəli davranışı deterministik qaydalar, nəzərdən keçirici növbələri və ya risk qiymətləndirməsi vasitəsilə aşkarlayın.
4. Əgər idarəetmə prosesiniz bunu mümkün edirsə, operatorları xəbərdar etməklə, tətbiq tərəfi iş axınlarını dayandırmaqla, lazımsız icazələri ləğv etməklə və ya kompensasiyaedici əməliyyatlar təqdim etməklə cavab verin.

Siyasət qərarlarını konsensus xaricində saxlayın, hər bir doğrulayıcının eyni qərarı təkrar etməsi tələb olunmadıqca. Proqram icra mühiti doğrulaması icazələri və əməliyyat etibarlılığını tətbiq etməlidir. Fırıldaqçılığın izlənməsi riskləri izah etməli, sübutları qorumaq və operatorlara sürətli hərəkət etməyə kömək etməlidir.

## Toplanacaq siqnallar {#signals-to-collect}

Araşdırma üçün yalnız dar abunəliklərlə başlayın və daha geniş axınları əlavə edin:

|Siqnal|Mənbə|İstifadə et|
| --- | --- | --- |
|Əməliyyatın vəziyyəti|proqram təminatı işləmə iş axını hadisələri|Təkrar rədd etmələri, uğursuz təsdiqləmə cəhdlərini və qeyri-adi təqdimat nümunələrini aşkar edin|
|Hesabın həyat dövrü və metadatalar|Məlumat hadisələri və hesab sorğuları|Yeni hesabları, təxəllüs dəyişikliklərini, şəxsiyyət yeniləmələrini və gözlənilməz metadata redaktələrini aşkar edin|
|Aktiv balansları və köçürmələr|Aktiv məlumat hadisələri və aktiv sorğuları|Yüksək dəyərli hərəkəti, sürətli yayılmanı, balans xərclərini və qeyri-adi tərəfdaşları aşkar edin|
|Rollar və icazələr|Rol və icazə sorğuları, rol məlumatı hadisələri|Üstünlük artırılmasını, fövqəladə imtiyazları və köhnəlmiş yüksək riskli girişləri aşkarlayın|
|Tətik və müqavilə dəyişiklikləri|Tetikleyici, müqavilə və icraçı hadisələri|Yeni avtomatlaşdırmanı, dəyişdirilmiş icra yollarını və şübhəli yeniləmə fəaliyyətini aşkar edin|
|Konfiqurasiya və şəbəkə həmkarı dəyişiklikləri|Konfiqurasiya və şəbəkə həmkar hadisələri|Təsdiq, şəbəkələşmə və ya operator görünürlüğünə təsir edən idarəetmə dəyişikliklərini aşkarlayın|
|Operator sağlamlığı| `/metrics` və Sumeragi status marşrutları |Şübhəli istifadəçi davranışını node yüklənməsindən, növbə təzyiqindən və ya şəbəkə nasazlıqlarından ayırın|

Bir qayda yalnız hesablar, aktivlər, rollar və ya konfiqurasiya dəyişikliklərini tələb edirsə, bütün hadisə axını işləməmək üçün [hadisə filtrləri](/az/blockchain/filters.md)-dən istifadə edin. Dövri uzlaşma üçün, monitorun işləməməkdən sonra bərpa oluna bilməsi üçün axını səhifələnmiş [sorğular](/az/blockchain/queries.md) ilə birləşdirin.

## Aşkar etmə Qaydaları {#detection-rules}

Ümumi qayda ailələrinə daxildir:

|Qayda ailəsi|Nümunə vəziyyət|Tipik reaksiya|
| --- | --- | --- |
|Sürət|Hesab qısa müddət ərzində gözləniləndən daha çox məbləğ və ya sayda köçürmə edir|Hesab üçün nəzərdən keçirənləri xəbərdar edin və tətbiq tərəfdən çıxarışları dayandırın|
|Çıxış sayı|Vəsaitlər bir hesabdan bir çox yeni görünən hesablara keçir|Əlavə köçürmələrə icazə verməzdən əvvəl əl ilə təsdiq tələb edin|
|Balansın azalması|Hesab balansının böyük bir hissəsi əsas, ləqəb və ya metada dəyişiklikdən qısa müddət sonra çıxır|Hesab ələ keçirilməsi mümkünsə yüksəldin|
|Üstünlük artırılması|Yüksək riskli icazə və ya rol dəyişiklik pəncərəsinin xaricində verilir|Operatorlara xəbərdarlıq edin və qrant əməliyyatını yoxlayın|
|Təkrarlanan rədd edilmələrin artımı|Bir kriptoqrafik imzalayan və ya müştəri təkrar-təkrar rədd edilən əməliyyatlar yaradır|Giriş məlumatlarının sui-istifadəsini, inteqrasiya xətalarını və ya yoxlamaları yoxlayın|
|Avtomatlaşdırma dəyişikliyi|Tetikləyici, müqavilə və ya icraçı ilə əlaqəli obyekt gözlənilmədən dəyişir|Dəyişiklik nəzərdən keçirənə qədər asılı iş axınlarını dayandırın|
|İdarəetməyə həssas dəyişiklik|şəbəkə eyni səviyyəli, konfiqurasiya və ya proqram təminatı icra mühiti vəziyyətində təsdiqlənmiş bilet olmadan dəyişikliklər baş verir|İdarəetmə qeydləri və insident prosesi ilə müqayisə edin|

Qaydalar tələb etdikləri sübutlar, qiymətləndirdikləri zaman pəncərəsi, gördükləri tədbir və onu bağlaya biləcək şəxs və ya sistem haqqında açıq olmalıdır iş halı. Müştəri riski, aktiv növü və ya yurisdiksiya kimi meyarlardan asılı olan həddlər sizin monitorinq xidməti konfiqurasiyanızda olmalıdır, ixtiyari skriptlərdə deyil.

## Cavab Nəzarətləri {#response-controls}

Bildirişləri aktiv etməzdən əvvəl cavab tədbirlərini planlaşdırın. Yüksək ciddiyyətli fırıldaqçılıq halının aşkarlanmasından məhdudlaşdırılmasına qədər sənədləşdirilmiş bir yolu olmalıdır:

- Təsirə məruz qalmış domen və ya aktiv tərifinə cavabdeh olan təhlükəsizlik, əməliyyatlar və biznes sahiblərini məlumatlandırın
- Aşkarlama qaydası tərəfindən istifadə olunan hadisə kursorunu, kriptoqrafik xəşi, əməliyyat kriptoqrafik xəşi, səlahiyyət prinsipi, yük və vaxt nöqtəsi üzrə verilənlər baxışını qoruyun
- checkout, pul çıxarma, imzalama, körpü və ya maliyyə əməliyyatlarının tənzimlənməsi iş prosesləri kimi blokçeyn lövhəsinin xaricində olan tətbiq tərəfi fəaliyyətlərini dayandırmaq
- insidentə cavab planı tərəfindən artıq əsaslandırılmayan rolları və ya icazələri ləğv edin
- aktiv idarəetmə siyasəti və icazə modeli buna imkan verdikdə yalnız ardıcıl blokçeyn dəftər əməliyyatlarını təqdim edin
- əlavələrin kriptoqrafik imzalayıcının pozulmasını göstərdiyi zaman açarları dəyişdirin

İzləmə xidmətinə geniş yazma icazəsi verməkdən çəkinin. Cavab tədbirləri üçün tələb olunan ən az icazələr dəsti ilə xüsusi texniki hesabdan istifadə edin. yerinə yetirməyə icazə verilir. İnsan təsdiqi, aktivləri köçürə bilən, icazələri dəyişdirə bilən və ya yoxlayıcılara yönəlmiş konfiqurasiyanı dəyişdirə bilən hər hansı bir iş prosesinin bir hissəsi olaraq qalmalıdır.

## Sübut və Saxlama {#evidence-and-retention}

Təsdiqləyici məlumat qovluğundan ayrı olan yalnız əlavə olunan sistemdə monitorinq sübutlarını saxlayın. Hər bir xəbərdarlıq aşağıdakıları əhatə etməlidir:

- tədbir axını adı və kursor
- mövcud olduqda blok hündürlüyü və ya blok kriptoqrafik hash
- əməliyyat kriptoqrafik xəş və səlahiyyət prinsipi
- təsirlənmiş hesab, domain, aktiv, rol, tetikleyici və ya konfiqurasiya ID-si
- xam hadisə məlumat yükü və ya onun tək bir protokol-standart kriptoqrafik qarışııq dəyəri
- xəbərdarlığı zənginləşdirmək üçün istifadə olunan nöqtə-vaxt məlumat baxışlarını sorğulayın
- qayda adı, versiya, hədd, qiymət, və nəzərdən keçiricinin qərarı

Şəbəkənin məlumat idarəetmə siyasəti açıqca icazə vermədikcə, həssas istintaq qeydlərini ictimai blokçeyn dəftər metadata kimi saxlamayın. Əgər bağlantı yaratmağa ehtiyacınız varsa off-chain vəziyyətini on-chain vəziyyətinə keçirmək üçün, şəxsi məlumatları aşkar etməyən bir iş şəxsiyyəti, imzalanmış təsdiq sənədi və ya kriptoqrafik hash kriptoqrafik öhdəlik dəyərini üstün tutun.

## Tətbiq yoxlama siyahısı {#implementation-checklist}

- `/metrics` və operator marşrutları üçün tələb olunan telemetriya profilini aktivləşdirin.
- İzlədiyiniz obyektlər üçün dar filtrlərlə Torii hadisə axınlarına abunə olun.
- Hadisə kursorlarını davam etdirin ki, monitor boşluqsuz davam edə bilsin.
- Axınları müntəzəm cədvəl üzrə səhifələnmiş sorğularla uzlaşdırın.
- Risk həddlərini və icazə siyahılarını versiya ilə idarə olunan konfiqurasiyada saxlayın.
- Avtomatlaşdırılmış əməliyyatları aktivləşdirməzdən əvvəl xəbərdarlıq qaydalarını tarixi bloklar üzərində sınayın.
- Cavab tədbirləri üçün xüsusi texniki hesablar istifadə edin.
- Təkrar olunan cədvəl üzrə rol və icazə verilməsini nəzərdən keçirin.
- Hücum cavab prosesinə fırıldaqçılıq-izləmə xəbərdarlıqlarını daxil edin.

## Əlaqəli Səhifələr {#related-pages}

- [Tədbirlər](/az/blockchain/events.md)
- [Filtrlər](/az/blockchain/filters.md)
- [Sorğular](/az/blockchain/queries.md)
- [İcazələr](/az/blockchain/permissions.md)
- [Performans və Ölçülər](/az/guide/advanced/metrics.md)
- [Torii API son nöqtələr](/az/reference/torii-endpoints.md)
- [Əməliyyat Təhlükəsizliyi](/az/guide/security/operational-security.md)
