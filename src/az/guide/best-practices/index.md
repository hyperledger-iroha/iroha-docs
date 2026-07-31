---
translation_locale: az
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ən yaxşı təcrübələr {#best-practices}

Bu bölmə Iroha tətbiqləri və şəbəkələri üçün istehsal istiqamətində göstərişlər toplayır. Bu, onu həyata keçirən xüsusiyyətə görə deyil, qəbul etməli olduğunuz qərara görə təşkil edilir.

Paylaşılan testnet provalarından, istehsaldan və ya əsas müştəri buraxılışından əvvəl yoxlama siyahısı kimi istifadə edin.

## Kategoriyalar {#categories}

|Kategoriya |Düzəlmək.|
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Tələbənin inkişafı](./application-development.md) |Müştəri konfiqurasiyası, əməliyyatların təqdim edilməsi, yenidən təcrübələr, hadisələr, sorğular və agentlərin köməkliyi ilə inkişaf |
| [Məlumat modelləşdirilməsi](./data-modeling.md) |Domenlər, hesablar, aktivlər, NFTs, metadata, zəncirdən kənar məlumatlar və adlandırma konvensiyaları |
| [Şəbəkənin tətbiqi](./network-deployment.md) |Başlanğıc, topologiya, həmyaşıd açarları, Torii məruz qalma, razılaşma parametrləri və ətraf mühitin ayrılması |
| [Operasiyalar](./operations.md) |Müşahidə qabiliyyəti, icra kitabları, yedekləmələr, dəyişikliklərin idarə edilməsi, kapasite yoxlamaları və hadisələrin idarə olunması |
| [Təhlükəsizlik və Giriş](./security-and-access.md) |Gizli idarəetmə, icazələr, texniki hesabatlar, şəbəkəyə giriş və audit yolları |
| [İstifadə üçün hazırlıq](./release-readiness.md) |Localnet, Taira, Minamoto, uyğunluq yoxlamaları, canlı şəbəkələrin qorunması və geri dönüş planlaşdırılması |

## Çıxma qaydaları {#cross-cutting-rules}

- Yerli inkişafı, paylaşılan test şəbəkəsini və istehsal konfigurasiyasını ayrı saxlayın.
- Başlangıç, həmyaşıd topologiyası, icraçı siyasəti və əsas materialı nəzarət olunmuş tətbiq əşyaları kimi müalicə edin.
- Modeldə davamlı nəşriyyat qeydləri məqsədəuyğun olaraq. Böyük, özəl və ya yüksək məhsuldarlıqlı məlumatlar üçün metadatalardan istifadə etməyin.
- Tətbiq edilmə, müddətin bitməsi, yenidən cəhdlər və gecikmiş vəziyyətlə məşğul ola bilən idempotent iş axınları vasitəsilə əməliyyatlar təqdim edin.
- Məhdud icazələrə, xüsusi texniki hesablara və açıq əməliyyat kitablarına geniş idarəetmə girişinə üstünlük verirlər.
- Əvvəlcə birbaşa istifadə edilə bilən yerli şəbəkədə davranışı sübut edin, sonra da hər hansı bir əsas şəbəkə əməliyyatından əvvəl Taira və ya digər paylaşılan test şəbəkəsində təcrübə edin.

## Əlaqəli istinadlar {#related-references}

- [Konfiqurasiya və idarəetmə](/az/guide/configure/overview.md)
- [Təhlükəsizlik](/az/guide/security/)
- [Performance and Metrics](/az/guide/advanced/metrics.md)
- [Müvafiqlik matrisi ](/az/reference/compatibility-matrix.md)
- [Torii Son nöqtələr](/az/reference/torii-endpoints.md)
- [İzin Tokeni](/az/reference/permissions.md)
