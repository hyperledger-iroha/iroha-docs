---
translation_locale: az
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: 3d317c00e75525d70f6cb9ef7f8eeec6911e2f124af8052cd2fc719b264d43f9
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# İctimai açar kriptografiyası {#public-key-cryptography}

İctimai açar kriptografiyası əlaqəli ictimai və özəl açarı istifadə edir. İctimai anahtar paylaşıla bilər. Özəl açar hakimiyyətin nəzarəti altında qalmalıdır. Təhlükəsizlik dəstəklənmiş bir alqoritmdən istifadədən, təhlükəsiz təsadüfiliklə açarların yaradılmasından və özəl əsasın qorunmasından asılıdır.

## Rəqəmsal imzalar {#digital-signatures}

İmzaçı özəl açar ilə rəqəmsal imzanı yaradır, təsdiqçi isə müvafiq ictimai açarı ilə imzaları yoxlayır.

Müvafiq bir imza imzalanmış baytların dəyişdirilmədiyini və özəl açarın sahibi tərəfindən təsdiqləndiyini göstərir. İnsanı özlüyündə tanımır. Kimlik ictimai açar və ya hesab nəzarətçisinin necə qeydiyyatdan keçildiyinə və idarə edildiyinə bağlıdır.

İmzalar etibarlılıq və icazə sübutunu təmin edir, imzalanan məzmunu şifrələmirlər.

## İctimai açarın şifrələməsi {#public-key-encryption}

Bəzi ictimai açar sxemləri məlumatları alıcının ictimai açarı ilə şifrələyir. Alıcı həmin məlumatların şifrəsini müvafiq özəl açarla açır. Şifrələmə və imzalar ayrı əməliyyatlardır və fərqli açarlardan və ya alqoritmlərdən istifadə edə bilər.

Iroha əməliyyatının imzalanması ictimai reyestr məlumatlarını məxfi etmir. Faydalı yükün məzmunu gizli qalmalıdırsa, yerləşdirmənin təsdiqlənmiş məxfilik mexanizmindən istifadə edin.

## Müştəri tərəfindəki açarlar {#keys-on-the-client-side}

Hər bir əməliyyat konfigurassiya edilmiş hesab nəzarətçisi siyasətini təmin etməlidir. Sadə bir hesab bir imza açarından istifadə edə bilər. idarə olunan bir hesab daha mürəkkəb nəzarətçi siyasətindən istifadə edə bilər

Müştəri proqramı özəl açarları və digər nəzarətçi materiallarını qorumalıdır. Açıq mətnli müştəri konfiqurasiyası yalnız yerli inkişaf və nəzarət olunan sınaqlar üçün uyğundur. İstehsal inteqrasiyaları məxfi məlumat menecerindən, aparatla dəstəklənən açar saxlamasından, təcrid edilmiş imzalama xidmətindən və ya başqa audit edilmiş imzalama sərhədindən istifadə etməlidir.

Ayrı mühitlər və məqsədlər üçün ayrı açarlardan istifadə edin. Bir açarı yenidən istifadə edərək bu istifadələri birləşdirir və məruz qalmanın təsirini artırır.

Bax [Kriptografik açarların yaradılması](./generating-cryptographic-keys.md), [Storing Cryptographic Keys](./storing-cryptographic-keys.md) və [Operational Security](./operational-security.md).
