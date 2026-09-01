---
translation_locale: az
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Konfiqurasiya və İdarəetmə {#configuration-and-management}

Iroha konfiqurasiyanın iki səlahiyyətli qatmanı var:

- yerli şəbəkə bərabəri və müştəri konfiqurasiyası, TOML fayllarında saxlanılır və proses başlanğıcında oxunur
- zəncir üzrə konfiqurasiya, əməliyyatlar vasitəsilə dəyişdirilir [`SetParameter`](/az/blockchain/instructions.md#setparameter)

Node kimliyi, ünvanlar, jurnallaşdırma, yaddaş və müştəri imza açarları üçün yerli konfiqurasiyadan istifadə edin. Şəbəkənin razılaşdırmalı və deterministik şəkildə təkrar icra etməli olduğu dəyərlər üçün zəncirdaxili konfiqurasiyadan istifadə edin.

İstehsal davranışı bu konfiqurasiya qatlarından gəlməlidir. Ətraf mühit dəyişənləri yerli alətlərə test girişlərini təmin etmək üçün əlverişli ola bilər, amma onlar istehsal xüsusiyyət qapıları deyil və yekunlaşmış konfiqurasiyanı əvəz etmir.

Əsas konfiqurasiya giriş nöqtələri bunlardır:

- [blokçeyn genesis](/az/guide/configure/genesis.md)
- [Müştəri konfiqurasiyası](/az/guide/configure/client-configuration.md)
- [Şəbəkə yerləşdirilməsi üçün açarlar](/az/guide/configure/keys-for-network-deployment.md)
- [Çıplak metaldə işləmək](/az/guide/advanced/running-iroha-on-bare-metal.md)
- [şəbəkə həmkarı konfiqurasiya istinadı](/az/reference/peer-config/index.md)
