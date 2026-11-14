---
translation_locale: az
translation_source: /guide/best-practices/operations.md
translation_source_hash: 44df6cc409b8434e5b45286e02500036bb9eda80251f4b6a50205bf4a3de3968
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-first-release-source-amendment
---
# Əməliyyatlar {#operations}

Əməliyyat hazırlığı o deməkdir ki, şəbəkə müşahidə edilə, dəyişdirilə, ehtiyat nüsxəsi yaradıla və bərpa oluna bilər, təsdiqləyici hostlara müvəqqəti girişə güvənmədən.

## Müşahidə edilə bilənlik {#observability}

- Telemetriya profillərini qəsdən aktivləşdirin. `/metrics` lazım olduqda `extended`-dan istifadə edin və ətraflı Sumeragi operator marşrutları tələb edən test işləri zamanı `full`-dən istifadə edin.
- Tablo qəbul olunan ötürmə sürətini, rədd edilmiş ötürmə sürətini, protokolun yekunlaşma gecikməsini, növbə dərinliyini, növbənin doyma səviyyəsini, görünüş dəyişikliklərini, itirilmiş konsensus mesajlarını və yaddaş təzyiqini göstərir.
- Status nöqtə-vaxt məlumat baxışlarını, metrikaların əldə olunmasını, qeydləri və yerləşdirmə konfiqurasiyasını eyni hadisə və ya benchmark sənəd dəstində saxlayın.
- Davamlı növbə artımı, gözlənilməz rədd edilmə sıçrayışları, dayanmış blok hündürlüyü, görünüş dəyişikliyi dəyişiklikləri və şəbəkə həmkarı sağlamlığı dəyişiklikləri barədə xəbərdarlıq.

Baxın [Performans və Ölçülər](/az/guide/advanced/metrics.md).

## İş dəftərləri {#runbooks}

- Şəbəkə həmkarının yenidən başlaması, Torii azalması, açar pozulması, icazə səhvləri, ödəniş sponsorunun tükənməsi, ilişmiş növbələr və şəbəkə parçalanması simptomları üçün runbuklar yazın.
- Yazma əməliyyatlarından əvvəl dəqiq oxumaq üçün yoxlamaları daxil edin, xüsusən şəbəkə həmkarlarının qeydiyyatı, icazələrin verilməsi və parametr dəyişiklikləri üçün.
- Təcili əlaqə məlumatlarını və eskalasiya qaydalarını sənədlər deposunun xaricində saxlayın, əgər onlar şəxsi əməliyyat məlumatlarını ehtiva edirsə.
- Hər bir hadisə, təlim və ya böyük yeniləmədən sonra əməliyyat təlimatlarını nəzərdən keçirin.

Bax [Əməliyyat Təhlükəsizliyi](/az/guide/security/operational-security.md).

## Ehtiyat nüsxələr və Bərpa {#backups-and-recovery}

- Təqdimat tərəfindən tələb olunan bərpa nöqtəsinə uyğun olaraq şəbəkə həmkarı yaddaşını ehtiyat nüsxəsini çıxarın. Qeyri-istehsal hostlarında bərpaları yoxlayın.
- İmzalanmış blockchain genesis, buraxılış metadata, şəbəkə həmkarı konfiqurasiyası və açar saxlanması qeydlərinin, hətta bir təsdiqləyici hostu mövcud olmasa belə bərpa edilə bilinməsini təmin edin.
- Bərpa prosedurunun ilkin zəncir vəziyyətindən yenidən qurduğunu, vəziyyətin saxlanmış surətindən bərpa etdiyini, yoxsa sıradan çıxmış qovşağı yeni identifikatorla əvəz etdiyini sənədləşdirin.
- Heç vaxt bərpa prosedurlarını istehsal hadisəsi zamanı ilk dəfə sınaqdan keçirməyin.

## Dəyişiklik İdarəetməsi {#change-management}

- Zəncirüstü konfiqurasiya dəyişikliklərini nəzərdən keçirilməyi, əvvəlcədən oxunmağı, icazəni və dəyişiklik sonrası yoxlamanı tələb edən əməliyyatlar kimi qəbul edin.
- Qovşaq proqramının buraxılışını quraşdırmazdan əvvəl onun şəbəkənin həqiqiliyi yoxlanmış icra mühiti seçimini və başlanğıc yoxlama nöqtəsindən sonrakı tarixçəni reallaşdırdığını yoxlayın. Protokol təriflərində dəyişikliklər idarəetmə qaydaları ilə təsdiqlənən və uyğunluğu yoxlanmış seçim keçidi tələb edir; aktivləşdirmədən sonra bərpa uyğun olmayan ikili proqramın əvvəlki versiyasına qayıtmaqla deyil, düzəldici keçidlə aparılır.
- Əgər miqrasiya planı tələb etmirsə, eyni texniki qulluq pəncərəsində şəbəkə həmkarlarının topologiyasını, konsensus vaxtlamasını və tətbiq iş yükünü dəyişməkdən çəkinin.
- Əməliyyat dəyişiklikləri üçün əməliyyat kriptoqrafik xəşləri və blok hündürlüklərini qeyd edin.

Baxın [İstidən Yenidən Yükləmə](/az/guide/advanced/hot-reload.md) və [Uyğunluq Matrisi](/az/reference/compatibility-matrix.md).

## Tutum Baxışları {#capacity-reviews}

- Doğrulayıcı sayı, avadanlıq, şəbəkə yerləşməsi, iş yükü qarışığı və ya konsensus parametrləri dəyişdikdə yükləmə yoxlamalarını yenidən işə salın.
- Qısa, ən yaxşı hal göstəricisinə əsaslanmaq əvəzinə, qızma mərhələsini, sabit vəziyyəti və gözlənilən maksimum yükü ölçün.
- Qəbul edilmiş ötürmə sürətini yekunlaşdırılmış ötürmə sürəti və növbə dərinliyi ilə müqayisə edin. Əgər təqdim edilmiş TPS yekunlaşdırılmış TPS-i aşır və növbələr böyüyürsə, şəbəkə davamlı işləmə həddini keçmişdir.
