---
translation_locale: az
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: 3d317c00e75525d70f6cb9ef7f8eeec6911e2f124af8052cd2fc719b264d43f9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# İctimai Açar Kriptoqrafiyası {#public-key-cryptography}

İctimai açar kriptoqrafiyası əlaqəli ictimai açar və şəxsi açardan istifadə edir. İctimai açar paylaşa bilər. Şəxsi açar səlahiyyət sahibi tərəfindən idarə olunmalıdır. Təhlükəsizlik dəstəklənən alqoritmdən istifadə etməyə, açarları etibarlı təsadüfi üsulla yaratmağa və şəxsi açarı qorumağa bağlıdır.

## Rəqəmsal İmzalar {#digital-signatures}

Kriptoqrafik imzalayan şəxsi açarla rəqəmsal imza yaradır. Yoxlayıcı imzanı uyğun açıq açarla yoxlayır.

Etibarlı bir imza göstərir ki, imzalanmış baytlar dəyişdirilməyib və şəxsi açarın sahibi onları təsdiqləyib. Bu öz-özlüyündə bir şəxsi müəyyən etmir. Şəxsiyyət, açıq açar və ya hesab nəzarətçisinin necə qeydiyyata alındığına və idarə olunduğuna bağlıdır.

İmzalar bütövlük və səlahiyyət sübutu təmin edir. Onlar imzalanmış məzmunu şifrələmir.

## İctimai Açar Şifrələməsi {#public-key-encryption}

Bəzi açıq açar sxemləri məlumatları alıcının açıq açarı üçün şifrələyir. Alıcı həmin məlumatları uyğun şəxsi açar ilə deşifrə edir. Şifrələmə və imzalar ayrı əməliyyatlardır və fərqli açarlardan və ya alqoritmlardan istifadə edə bilər.

Iroha əməliyyatın imzalanması açıq blokçeyn dəftər məlumatlarını gizli etmir. Göndərmə məzmununun məxfi qalması lazım olduqda yerləşdirmənin təsdiqlənmiş məxfilik mexanizmindən istifadə edin.

## Müştəri Tərəfdəki Açarlar {#keys-on-the-client-side}

Hər bir əməliyyat konfiqurasiya olunmuş hesab-nəzarətçi siyasətinə uyğun olmalıdır. Sadə bir hesab bir imza açarından istifadə edə bilər. İdarə olunan bir hesab daha mürəkkəb bir nəzarətçi siyasətindən istifadə edə bilər.

Müştəri proqram təminatı şəxsi açarları və digər idarəetmə materiallarını qorumalıdır. Sadə mətnli müştəri konfiqurasiyası yalnız yerli inkişaf və nəzarət olunan testlər üçün uyğundur. İstehsal inteqrasiyaları gizli menecer, aparat dəstəyi ilə açar saxlama, izolyasiya edilmiş imzalama xidməti və ya digər audit edilmiş imzalama sərhədindən istifadə etməlidir.

Müxtəlif mühitlər və məqsədlər üçün ayrı açarlardan istifadə edin. Bir açarın təkrar istifadəsi bu istifadələri əlaqələndirir və ifşanın təsirini artırır.

Baxın [Kriptoqrafik Açarların Yaradılması](./generating-cryptographic-keys.md), [Kriptoqrafik Açarların Saxlanması](./storing-cryptographic-keys.md) və [Əməliyyat Təhlükəsizliyi](./operational-security.md).
