---
translation_locale: az
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ən Yaxşı Təcrübələr {#best-practices}

Bu bölmə Iroha tətbiqləri və şəbəkələri üçün istehsal yönümlü təlimatları toplayır. O, funksiyanı tətbiq edən xüsusiyyətə görə deyil, verməli olduğunuz qərara görə təşkil olunub.

Paylaşılan testnet təlimindən, istehsal buraxılışından və ya böyük müştəri buraxılışından əvvəl onu yoxlama siyahısı kimi istifadə edin.

## Kateqoriyalar {#categories}

|Kateqoriya|Diqqət|
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Tətbiq İnkişafı](./application-development.md) |Müştəri konfiqurasiyası, əməliyyat təqdimatı, təkrar cəhdlər, hadisələr, sorğular və agent dəstəyi ilə inkişaf|
| [Məlumatların Modellaşdırılması](./data-modeling.md)                     |Domenlər, hesablar, aktivlər, NFTs, metadatalar, zəncirdən kənar məlumatlar və adlandırma qaydaları|
| [Şəbəkə İstismarı](./network-deployment.md)           |blokçeyn əsası, topologiya, şəbəkə həmkarı açarları, Torii açıqlama, konsensus parametrləri və mühitin ayrılması|
| [Əməliyyatlar](./operations.md)                           |Müşahidəetmə, iş kitabları, ehtiyat nüsxələr, dəyişiklik idarəetməsi, tutum yoxlamaları və hadisələrin idarə olunması|
| [Təhlükəsizlik və Giriş](./security-and-access.md)         |Gizli idarəetmə, icazələr, texniki hesablar, şəbəkə girişi və audit izləri|
| [Buraxılış Hazırlığı](./release-readiness.md)             |Localnet, Taira, Minamoto, uyğunluq yoxlamaları, canlı şəbəkə qoruyucuları və geri dönmə planlaması|

## Kəsişən Qaydalar {#cross-cutting-rules}

- Yerli inkişaf, paylaşılan testnet və istehsal konfiqurasiyasını ayrı saxlayın.
- Blockchain başlanğıcını, şəbəkə həmkarı topologiyasını, icraçı siyasətini və açar materialını idarə olunan yerləşdirmə artefaktları kimi qəbul edin.
- Modeli davamlı blockchain dəftər vəziyyətini qəsdən yaradın. Böyük, şəxsi və ya yüksək dəyişkən məlumatlar üçün metadata-dan tullantı yeri kimi istifadə etməyin.
- Qəbul etmə, müddətinin bitməsi, təkrar cəhdlər və gecikmiş vəziyyəti idarə edə bilən idempotent iş axınları vasitəsilə əməliyyatları göndərin.
- Geniş administrator girişinə üstünlük vermək əvəzinə, dar icazələri, xüsusi texniki hesabları və açıq əməliyyat təlimatlarını üstün tutun.
- Davranışı əvvəlcə birdəfəlik yerli şəbəkədə sübut edin, sonra hər hansı bir mainnet əməliyyatından əvvəl Taira və ya başqa bir paylaşılan testnetdə məşq edin.

## Əlaqəli İstinadlar {#related-references}

- [Konfiqurasiya və İdarəetmə](/az/guide/configure/overview.md)
- [Təhlükəsizlik](/az/guide/security/)
- [Performans və Ölçülər](/az/guide/advanced/metrics.md)
- [Uyğunluq Matrisi](/az/reference/compatibility-matrix.md)
- [Torii API son nöqtələr](/az/reference/torii-endpoints.md)
- [İcazə Jetonları](/az/reference/permissions.md)
