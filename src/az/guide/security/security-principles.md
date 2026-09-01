---
translation_locale: az
translation_source: /guide/security/security-principles.md
translation_source_hash: 20139011c663a0bca6f9e486ef81f698370c34f8f02319317805b0d1dfb049c7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Təhlükəsizlik Prinsipləri {#security-principles}

Bir Iroha blokçeyn dəftəri imzalanmış təlimatları təsdiqləyir və icazələri tətbiq edir. Bu, şəxsi açarları, hostları, tətbiqləri, operator iş stansiyalarını və idarəetmə prosedurlarını qorumur. Yerləşdirmə bu sistemləri qorumağı təmin etməlidir.

Bu prinsipləri Iroha şəbəkəsini dizayn edərkən və işlədərkən istifadə edin.

## Avtorizasiya prinsipi kimi Təhlükəsizlik Sərhədini qəbul edin {#treat-authority-as-a-security-boundary}

- Bir şəxsi və ya prosesi idarə edən şəxs, həmin açara təyin edilmiş səlahiyyət prinsipi ilə hərəkət edə bilər.
- Hər mühit və əməliyyat roluna ayrı bir səlahiyyət prinsipi verin.
- İstehsal açarlarını və bərpa açarlarını adi inkişaf və test giriş məlumatlarından ayrı saxlayın.
- Hər bir avtorizasiya subyektinə kim sahib olduğunu, onun kriptoqrafik imzaçısının harada saxlanıldığını və onun necə dəyişdirilə və ya ləğv edilə biləcəyini qeyd edin.

Baxın [İctimai açar kriptoqrafiyası](./public-key-cryptography.md) və [Kriptoqrafik Açarların Saxlanması](./storing-cryptographic-keys.md).

## Ən Aşağı İcazəni Tətbiq Et {#apply-least-privilege}

- Rol üçün tələb olunan yalnız Iroha icazələrini, host daxilolmasını və şəbəkə daxilolmasını verin.
- Gündəlik əməliyyat imzalanmasını idarəetmə, yerləşdirmə və bərpa səlahiyyət prinsiplərindən ayırın.
- Təsdiqçi üzvlüyünə, üstünlüklü icazələrə və ya yüksək dəyərli aktivlərə təsir göstərə biləcək dəyişikliklər üçün müstəqil təsdiq tələb edin.
- Rol dəyişikliklərindən sonra girişləri yoxlayın və artıq lazım olmayan girişləri silin.

## Mühafizə Qatlarından İstifadə Edin {#use-layers-of-protection}

- Kriptoqrafik imzalayanları, tətbiqləri, əməliyyat sistemlərini, şəbəkələri və fiziki girişi qoruyun. Yalnız bir nəzarətə etibar etməyin.
- Yalnız yerləşdirmə üçün tələb olunan Torii, şəbəkə həmkarı, monitorinq və tətbiqetmə marşrutlarını aşkar edin.
- İdarəetmə girişləri və həssas məlumatlar üçün autentifikasiya edilmiş və şifrələnmiş kanallardan istifadə edin.
- Sistemləri yenilənmiş saxlayın və yerləşdirmənin istifadə etmədiyi xidmətləri deaktiv edin.
- Sirləri mənbə idarəetməsindən, əmrlər sətirindən, qeydlərdən, biletlərdən, söhbətdən və açıq sənədləşdirmədən uzaq saxlayın.

## Yerləşdirmələri Baxışa Uyğun Etmək {#make-deployments-reviewable}

- Gizli olmayan konfiqurasiya və yerləşdirmə avtomatlaşdırmasını versiya nəzarətində saxlayın.
- Ikili fayllar, konfiqurasiya, blokçeyn başlanğıc materialı, doğrulayıcı üzvlüyü, icazələr və ictimai marşrutlarda edilən dəyişiklikləri nəzərdən keçirin.
- Yayımlama sənədlərini yerləşdirmədən əvvəl yoxlayın. Təsdiqlənmiş versiyaları və kriptoqrafik qarışıqları qeyd edin.
- İstehsalatda işləyəcək dəqiq ikili və konfiqurasiya birləşməsini sınaqdan keçirin.
- Şəbəkənin deterministik davranışını qoruyun. Avadanlıq sürətləndirilməsi şəbəkə həmkarı-ə görünən nəticələri dəyişməməlidir.

## Sübutları izləyin və qoruyun {#monitor-and-preserve-evidence}

- Şəbəkə həmkarlarının sağlamlığını, konsensus irəliləyişini, icazə dəyişikliklərini, üstünlüklü təlimatları, autentifikasiya uğursuzluqlarını və gözlənilməz konfiqurasiya dəyişikliklərini izləyin.
- Əhəmiyyətli xəbərdarlıqları təsirlənmiş hostdan asılı olmayan bir sistemə göndərin.
- Əlaqəli qeydləri, blokçeyn dəftər referanslarını, konfiqurasiya zaman nöqtəsi məlumat baxışlarını və əməliyyat kriptoqrafik xəşlərini etibarlı zaman möhürü ilə qoruyun.
- Əskik müşahidə məlumatlarını araşdırma tələb edən əməliyyat problemi kimi qəbul edin.

## Başlatmadan əvvəl bərpa olun {#prepare-recovery-before-launch}

- Hadisəni kim elan edə biləcəyini və bərpa tədbirlərini kim təsdiqləyə biləcəyini müəyyən edin.
- Ehtiyat nüsxə, bərpa, açarın dəyişdirilməsi, icazənin ləğvi və şəbəkə tərəsi bərpa prosedurlarını sınaqdan keçirin.
- Hadisə zamanı etibarlı buraxılış artefaktlarını, konfiqurasiyanı, blokçeyn genesis qeydlərini və inventarları əlçatan saxlayın.
- Əvvəlcə oxumaları və monitorinqi bərpa edin. Yalnız bərpa olunmuş şəbəkə və asılı tətbiqlər yoxlamalarını keçdikdən sonra yazıları bərpa edin.
- Hər bir hadisəni nəzərdən keçirin və nəzarətləri, avtomatlaşdırmanı və məşqləri yeniləyin.

::: warning

Blokçeyn dəftəri əməliyyatları geri qaytarıla bilməz ola bilər. Bərpa və ya idarəetmə əməliyyatını təqdim etməzdən əvvəl əvvəlcədən yoxlanılmış prosedurlardan və tələb olunan təsdiqlərdən istifadə edin.

:::

[Əməliyyat Təhlükəsizliyi](./operational-security.md) və [Buraxılış Hazırlığı](../best-practices/release-readiness.md) ilə davam edin.
