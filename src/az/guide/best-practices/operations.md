---
translation_locale: az
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Əməliyyatlar {#operations}

İşə hazırlıq, şəbəkənin təsdiqləyici hostlara təkmilləşdirilmiş girişdən asılı olmayaraq müşahidə edilməsini, dəyişdirilməsini, yedeklənməsini və bərpasını nəzərdə tutur.

## Müşahidə qabiliyyəti {#observability}

- Telemetriya profillərini məqsədyönlü olaraq aktivləşdirin. `/metrics` lazım olduqda `extended` və Sumeragi operatorlarının ətraflı marşrutlarına ehtiyacı olan sınaqlar zamanı `full` istifadə edin.
- Dashboard qəbul edilmiş keçid, rədd edilən keçid, təzyiq sürəti, sıra dərinliyi, sıra doymuşluğu, görünüş dəyişiklikləri, buraxılmış konsensus mesajları və saxlama təzyiqi.
- Vəziyyət görüntülərini, metrik skrapları, qeydləri və tətbiq konfigüratsiyasını eyni hadisə və ya istinad sənəd dəstində saxlayın.
- Səyahətlərin davamlı böyüməsi, gözlənilməz rədd edilmə spikləri, blok hündürlüyü durduqları, görünüş dəyişikliyi və həmyaşıdların sağlamlıqda dəyişiklikləri barədə xəbərdarlıqlar.

Bax [Fəaliyyət və Metriklər ](/az/guide/advanced/metrics.md).

## Dərs kitabları {#runbooks}

- Peer restart, Torii degradasiyası, açar kompromisi, icazə səhvləri, ödəniş sponsorunun tükənməsi, sıxışmış növbələr və şəbəkə bölünməsinin simptomları üçün idarəetmə kitabları yazın.
- Yazı əməliyyatlarından əvvəl yalnız oxumaq üçün dəqiq yoxlamalar daxil edin, xüsusilə həmkarların qeydiyyatı, icazə verilməsi və parametr dəyişiklikləri üçün.
- Xüsusi əməliyyat məlumatları daxil olsa, təcili əlaqələrin və aşkarlanma qaydalarının repo sənədlərindən kənarda saxlanılması.
- Hər bir hadisədən, təcrübədən və ya əsas yeniləmədən sonra kitablara baxın.

Bax [Əməliyyat təhlükəsizliyi ](/az/guide/security/operational-security.md).

## Backup və bərpa {#backups-and-recovery}

- Təkmilləşdirmə üçün tələb olunan bərpa nöqtəsinə uyğun olaraq həmyaşıd saxlama ehtiyatı. İstehsal olmayan hostlarda bərpaları təsdiqləyin.
- İmzalanmış mənşəyi saxlayın, metadatalar buraxın, həmyaşıd konfiqurasiyası və bir təsdiqləyici ev sahibi mövcud olmasa da açar saxlama qeydləri bərpa oluna bilər.
- Bir bərpa prosedurunun təməldən yenidən qurulduğunu, sürətli görüntülərdən bərpa edildiyini və ya uğursuz bir həmyaşıdın yerini yeni bir şəxsiyyətlə əvəz etdiyini sənədləşdirin.
- İstehsal hadisəsi zamanı heç vaxt ilk dəfə bərpa prosedurlarını sınaqdan keçirməyin.

## Dəyişikliklərin idarə edilməsi {#change-management}

- Zincirdəki konfigüratsiya dəyişikliklərini yoxlama, uçuşdan əvvəl oxunma, icazə və dəyişiklikdən sonrakı təsdiqlənmə tələb edən əməliyyatlar kimi qəbul edin.
- Bir uyğunluq planı və geri dönmə qərar nöqtəsi ilə həmyaşıd ikili yeniləmələri tətbiq edin.
- Eyni saxlama pəncərəsində həmyaşıd topologiyasını, razılaşma vaxtını və tətbiq iş yükünü dəyişdirməyin, əgər köç planı bunu tələb etməsə.
- Operativ dəyişikliklər üçün əməliyyat hashləri və blok hündürlüklərini qeyd edin.

[Hot Reload](/az/guide/advanced/hot-reload.md) və [Compatibility Matrix](/az/reference/compatibility-matrix.md) bax.

## İstehsalat baxımları {#capacity-reviews}

- Validator sayının, aparatın, şəbəkənin yerləşdirilməsinin, iş yük mixinin və ya konsensus parametrlərinin dəyişdiyi zaman yenidən yük yoxlamaları aparılır.
- Qısa bir ən yaxşı hal nümunəsinə etibar etmək əvəzinə istilik, sabit vəziyyət və gözlənilən zirvə yükünü ölçün.
- Qəbul olunan keçid gücünü öhdəlik alınan keçid və növbənin dərinliyi ilə müqayisə edin. Əgər təqdim edilən TPS öhdəliyi aşırsa TPS və növbələr artırsa, şəbəkə öz davamlı qovluğundan kənarda qalır.
