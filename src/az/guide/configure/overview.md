---
translation_locale: az
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Konfiqurasiya və idarəetmə {#configuration-and-management}

Iroha konfiqurasiyasının iki təsdiqləyici qatı vardır:

- TOML fayllarında saxlanılan və prosesin başlanğıcında oxunan yerli həmyaşıd və müştəri konfigurasiyası.
- [ `SetParameter`](/az/blockchain/instructions.md#setparameter) vasitəsilə əməliyyatlar nəticəsində dəyişdirilən zəncirlə bağlı konfigurassiya

Kütlə kimliyi, ünvanları, qeydə alınması, saxlanılması və müştəri imzalanma açarları üçün yerli quruluşdan istifadə edin. Şəbəkə tərəfindən razılaşdırılmalı və təyin edilməli olan dəyərlər üçün zəncir üzərində quruluşdan istifadə edin.

İstehsalat davranışı bu konfigürasiya təbəqələrindən gəlməlidir. Ətraf mühit dəyişiklikləri yerli alətlərə test girişlərini təmin etmək üçün əlverişli ola bilər, lakin onlar istehsal xüsusiyyət qapıları deyil və öhdəlikdən gələn konfigürasiyanı əvəz etmirlər.

Konfiqurasiya giriş nöqtələri aşağıdakılardır:

- [Genesis](/az/guide/configure/genesis.md)
- [Müştəri konfiqurasiyası](/az/guide/configure/client-configuration.md)
- [Şəbəkənin tətbiqi üçün açarlar](/az/guide/configure/keys-for-network-deployment.md)
- [Çılpaq metal üzərində işləyir](/az/guide/advanced/running-iroha-on-bare-metal.md)
- [Peer konfigurasiyası istinadı](/az/reference/peer-config/index.md)
