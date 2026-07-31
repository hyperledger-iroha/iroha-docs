---
translation_locale: az
translation_source: /guide/security/fraud-monitoring.md
translation_source_hash: 4739a0bfe80f14545a51c804abbe6a2dfa5497d546192f76096f938a0af70184
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Xəyanətlərin nəzarəti {#fraud-monitoring}

Iroha tətbiqi üçün dolandırıcılıq nəzarəti kitabda baş verən hadisələr, suallar, icazələr və tətbiq kontekstinin ətrafında qurulmuş əməliyyat nəzarətidir. Iroha təqdim olunanları, qəbul edilənləri, rədd edilənləri və etdiyimizləri qeyd edir. Müşahidə sisteminiz hansı üsulların iş prosesi üçün şübhəli olduğuna qərar verir və bu halları nəzərdən keçirənlərə və ya avtomatik cavab nəzarətlərinə yönəltir.

Xəyanətlərin monitorinqinə bir validatorda yerləşdirilmiş məntiqdən daha çox ayrı bir xidmət kimi yanaşın. Xidmətin kitabxana fəaliyyətinə abunə olması, zəncirdən kənar risk kontekstini zənginləşdirməsi, sübutların davam etdirilməsi və cavab əməliyyatlarını yalnız açıq icazələrə malik hesablar vasitəsilə təqdim etməsi lazımdır.

## Monitorinq modeli {#monitoring-model}

Fəaliyyətli monitorinq boru kəmərinin dörd mərhələsi var:

1. Torii hadisə axınlarından, sorğulardan və ölçülərdən kitabxana və operator siqnallarını toplayın.
2. Tədbirləri müştərinin statusu, əks tərəflərin siyahıları, tətbiqetmə seansı identifikatorları, gözlənilən həddlər və vəziyyət IDs kimi zəncirdən kənar kontekstlə zənginləşdirmək.
3. Determinizm qaydaları, tənqidçi sıraları və ya risk hesablamaları ilə şübhəli davranışı aşkar edin.
4. Operatorları xəbərdar etmək, tətbiq tərəfi iş axınlarını dayandırmaq, lazımsız icazələri ləğv etmək və ya idarəetmə prosesiniz buna imkan verdiyi zaman kompensasiya əməliyyatlarını təqdim etməklə cavab verin.

Siyasət qərarlarını konsensusdan kənarda saxlayın, əgər hər təsdiqləyici eyni qərarı təkrarlamalı deyilsə. Runtime təsdiqləməsinə icazələr və əməliyyatların etibarlılığı tətbiq edilməlidir.

## Toplamaq üçün siqnallar {#signals-to-collect}

Sığ abunələrlə başlayın və yalnız araşdırma üçün daha geniş axınları əlavə edin:

|Sinyal |Mənbə |istifadə |
| --- | --- | --- |
|Transaksiyanın vəziyyəti |Pipeline hadisələri |Təkrarlanan rəddlər, uğursuz icazə cəhdləri və qeyri-adi təqdimat nümunələrini aşkar etmək |
|Hesabın həyat dövrü və metadataları |Məlumat hadisələri və hesab sorğuları |Yeni hesablar, alias dəyişiklikləri, şəxsiyyət yeniləmələri və gözlənilməz metadata düzəlişlərini aşkar edin |
|Aktivlərin balansları və köçürmələri |Aktiv məlumatları hadisələri və aktiv sorğuları |Yüksək dəyərli hərəkətləri, sürətli ventilyatorları, balans axınlarını və qeyri-adi əks tərəfləri aşkar etmək |
|Rolu və icazələri |Rol və icazə sorğuları, rol məlumatları hadisələri |Müvəffəqiyyətlərin artması, təcili yardımlar və yüksək riskli girişlərin aşkar edilməsi |
|Trigger və müqavilə dəyişiklikləri |Trigger, contract və executor hadisələri |Yeni avtomatlaşdırma, dəyişən icra yolları və şübhəli yeniləmə fəaliyyətini aşkar etmək |
|Konfiqurasiya və həmyaşıd dəyişiklikləri |Konfiqurasiya və həmyaşıd hadisələri |Validasiyaya, şəbəkəyə və ya operatorun görünürlüyünə təsir edən idarəetmə dəyişikliklərini aşkar etmək |
|Operatorun sağlamlığı |`/metrics` və Sumeragi status marşrutları |Şübhəli istifadəçi davranışını node həddindən artıq yükləməsindən, növbə təzyiqindən və ya şəbəkə səhvlərindən ayırın |

İstifadə [Hadisə filtrləri](/az/blockchain/filters.md) bir qayda yalnız hesablara, aktivlərə, rollara və ya konfigurasiya dəyişikliklərinə ehtiyac duyulduğu zaman bütün hadisə axını işlənmədən qaçınmaq üçün. Periodik uyğunlaşdırma üçün axını səhifəli ilə birləşdirin. [suallar](/az/blockchain/queries.md) Beləliklə, monitor istismara məruz qalandan sonra bərpa oluna bilər.

## İstifadə qaydaları {#detection-rules}

Ümumi qayda ailələrinə aşağıdakılar daxildir:

|Hökumət ailəsi |Misal şərti |Tipik reaksiya |
| --- | --- | --- |
|Sürət |Hesabı qısa bir müddət ərzində gözlənilən məbləğdən və ya hesabdan daha çox pul köçürür |Bu hesab üçün xəbərdarlıqları nəzərdən keçirənlər və müraciət tərəfində pul çəkmələri dayandırır |
|Çıxış.|Fondlar bir hesabdan çox sayda yeni müşahidə olunan hesablara köçürülür .|Əlavə köçürmələrə icazə verilmədən əvvəl əl ilə təsdiqlənməsini tələb edin |
|Tərəflərin balansı sıxılır.|Hesab balansının böyük bir hissəsi açar, alias və ya metadata dəyişikliyindən qısa müddət sonra buraxılır |Mümkün qədər hesabın alınmasını artırmaq |
|Xeyriyyələrin artması |Yüksək riskli bir icazə və ya rol dəyişiklik pəncərəsi xaricində verilir |Təşkilatlara xəbərdarlıq etmək və yardım əməliyyatını nəzərdən keçirmək |
|Rədd edilmə |Bir imzaçı və ya müştəri dəfələrlə rədd edilmiş əməliyyatlar həyata keçirir |İdarəetmə səlahiyyətlərindən sui-istifadə, inteqrasiya səhvləri və ya araşdırma üçün yoxlayın. |
|Avtomatlaşdırma dəyişikliyi |Trigger, müqavilə və ya icraçı ilə əlaqəli obyekt gözlənilməz şəkildə dəyişir |Dəyişiklik nəzərdən keçirilənə qədər asılı iş axınlarını dayandırmaq |
|Hökumət üçün həssas dəyişikliklər |Tərəfdaşlar, konfigurasiya və ya iş vaxtı vəziyyətində dəyişikliklər təsdiqlənmiş bir bilet olmadan baş verir |İdarəetmə rekordunu və hadisə prosesini müqayisə edin |

Qaydalar tələb olunan sübutlar, qiymətləndirdikləri vaxt və tədbirlər haqqında açıq olmalıdır və davası bağlaya biləcək şəxs və ya sistem. Müştəri riskindən, aktiv növündən və ya yurisdiksiyadan asılı olan həcmlər ad hoc skriptlərdə deyil, monitorinq xidmətinə aiddir.

## Cavab nəzarətləri {#response-controls}

Xəbərdarlıqların təmin edilməsindən əvvəl reaksiya tədbirlərini nəzərdə tutun. Yüksək cəhətdən saxtakarlıq hadisəsi aşkarlanmasından məhdudlaşdırılmasına qədər sənədləşdirilmiş bir yol olmalıdır:

- təsirlənmiş domen və ya aktiv təyinatı üçün məsuliyyət daşıyan təhlükəsizlik, əməliyyat və sahibkarları məlumatlandırır.
- hadisə kursorunu, blok hashini, əməliyyat hashini, səlahiyyəti, payload və axtarış sürətini saxlayın aşkarlama qaydasında istifadə olunur
- başlıqdan kənarda olan tətbiq tərəfi hərəkətlərini pozun, məsələn, sifariş, çıxarış, imzalanma, köprü və ya hesablaşma iş axınları.
- hadisələrə cavab planında artıq əsaslanmayan rol və ya icazələrin ləğv edilməsi
- aktiv idarəetmə siyasəti və icazə modelinin imkan verdiyi təqdirdə yalnız sonrakı kitab əməliyyatlarını təqdim etmək;
- sübutlar imzalananın razılaşmasını göstərdiyi zaman açarları fırlatmaq

Müşahidə xidmətinə geniş yazma girişindən çəkinin və cavab tədbirləri üçün lazım olan ən kiçik icazə dəstinə malik xüsusi bir texniki hesabdan istifadə edin. İnsan təsdiqləri aktivlərin köçürülməsinə, icazələrin dəyişdirilməsinə və ya təsdiqləyiciyə yönəlmiş konfigüratsiyanı dəyişdirə biləcək hər hansı bir iş axınının bir hissəsi olaraq qalmalıdır.

## Əldə edilmiş sübutlar və saxlama {#evidence-and-retention}

Monitorinq sübutlarını təsdiqləyici məlumatları dizaynından ayrı bir əlavə sistemi ilə saxlamaq.

- hadisələr axınının adı və kursor
- blok hündürlüyü və ya mövcud olduqda blok hash
- Transaction hash və səlahiyyət
- təsirlənən hesab, domen, aktiv, rol, tetikləyici və ya konfiqurasiya ID
- xam hadisə paylı yükü və ya onun kanonik bir hissəsi
- xəbərdarlığı zənginləşdirmək üçün istifadə olunan sorğu sürətli görüntüləri
- Qayda adı, versiyası, həddi, nəticə və rəyçi qərarı

Şəbəkənin məlumat idarəçiliyi siyasəti açıq şəkildə göstərilmədikcə həssas araşdırma qeydlərini ictimai kitabın metadataları kimi saxlama. icazə verir. Əgər zəncirdən kənarda olan bir işi zəncirlə bağlı vəziyyətlə əlaqələndirmək istəyirsinizsə, zəncirdə olan vəziyyəti müəyyənləşdirməyə üstünlük verin, imzalanmış təsdiq, və ya şəxsi məlumatları aşkar etməyən hash öhdəliyi.

## Tədbirlərin həyata keçirilməsi siyahısı {#implementation-checklist}

- `/metrics` və operatorların marşrutları üçün lazım olan telemetri profilini aktivləşdirin.
- Nəzarət etdiyiniz obyektlər üçün dar filtrlərlə Torii hadisələr axınına abunə olun.
- Monitor boşluqlar olmadan bərpa edilməsi üçün hadisə kursorlarını davam etdirin.
- Səhifəli suallarla axınları müntəzəm bir cədvəldə uyğunlaşdırın.
- Risk həddlərini qoruyun və versiya nəzarəti ilə konfiqurasiya edilmiş siyahılara icazə verin.
- Avtomatlaşdırılmış hərəkətlərin təmin edilməsindən əvvəl tarixi bloklara qarşı yoxlama xəbərdarlıq qaydaları.
- Reaksiya tədbirləri üçün xüsusi texniki hesablardan istifadə edin.
- Təkrarlanan cədvəl üzrə nəzərdən keçirilən rol və icazə verilmələri.
- Hadisələrin qarşısının alınması prosesinə saxtakarlıq nəzarəti ilə bağlı xəbərdarlıqları daxil etmək.

## Əlaqəli səhifələr {#related-pages}

- [Hadisələr](/az/blockchain/events.md)
- [Filtrlər](/az/blockchain/filters.md)
- [Suallar](/az/blockchain/queries.md)
- [icazələr](/az/blockchain/permissions.md)
- [Performance and Metrics](/az/guide/advanced/metrics.md)
- [Torii bitki nöqtələri](/az/reference/torii-endpoints.md)
- [Əməliyyat təhlükəsizliyi](/az/guide/security/operational-security.md)
