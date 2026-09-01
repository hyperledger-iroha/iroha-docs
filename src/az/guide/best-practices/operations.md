---
translation_locale: az
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: bing-translator-llm
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
- Qurtarma prosedurunun blokzincir başlanğıcından yenidən qurulub-qurulmadığını, müəyyən vaxt nöqtəsindəki məlumat görüntüsündən bərpa edilib-edilmədiyini və ya uğursuz şəbəkə iştirakçısının yeni identitetlə əvəz olunub-olunmadığını sənədləşdirin.
- Heç vaxt bərpa prosedurlarını istehsal hadisəsi zamanı ilk dəfə sınaqdan keçirməyin.

## Dəyişiklik İdarəetməsi {#change-management}

- Zəncirüstü konfiqurasiya dəyişikliklərini nəzərdən keçirilməyi, əvvəlcədən oxunmağı, icazəni və dəyişiklik sonrası yoxlamanı tələb edən əməliyyatlar kimi qəbul edin.
- Şəbəkə həmkarı ikili yeniləmələrini uyğunluq planı və geri qaytarma qərar nöqtəsi ilə həyata keçirin.
- Əgər miqrasiya planı tələb etmirsə, eyni texniki qulluq pəncərəsində şəbəkə həmkarlarının topologiyasını, konsensus vaxtlamasını və tətbiq iş yükünü dəyişməkdən çəkinin.
- Əməliyyat dəyişiklikləri üçün əməliyyat kriptoqrafik xəşləri və blok hündürlüklərini qeyd edin.

Baxın [İstidən Yenidən Yükləmə](/az/guide/advanced/hot-reload.md) və [Uyğunluq Matrisi](/az/reference/compatibility-matrix.md).

## Tutum Baxışları {#capacity-reviews}

- Doğrulayıcı sayı, avadanlıq, şəbəkə yerləşməsi, iş yükü qarışığı və ya konsensus parametrləri dəyişdikdə yükləmə yoxlamalarını yenidən işə salın.
- Qısa, ən yaxşı hal göstəricisinə əsaslanmaq əvəzinə, qızma mərhələsini, sabit vəziyyəti və gözlənilən maksimum yükü ölçün.
- Qəbul edilmiş ötürmə sürətini yekunlaşdırılmış ötürmə sürəti və növbə dərinliyi ilə müqayisə edin. Əgər təqdim edilmiş TPS yekunlaşdırılmış TPS-i aşır və növbələr böyüyürsə, şəbəkə davamlı işləmə həddini keçmişdir.
