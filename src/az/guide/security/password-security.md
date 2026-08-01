---
translation_locale: az
translation_source: /guide/security/password-security.md
translation_source_hash: 093be5b91700b9a6f85b45dc873c8c29d90397d5c9e3c842a77bfb03e97b37da
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Şifrə təhlükəsizliyi {#password-security}

Şifrələr operator konsollarını, gizli mağazaları, yedekləmələri və yerli açar fayllarını qoruyub saxlaya bilər. Şifrə yalnız bir idarəetmədir. Mövcud olduğu təqdirdə təhlükəsiz açar saxlama, giriş nəzarəti və çox amilli təsdiqləmə ilə birlikdə istifadə edin.

## Uğurlu və unikal şifrələrdən istifadə edin {#use-unique-generated-passwords}

- Hər hesab və mühit üçün fərqli şifrə istehsal edin.
- Uzun təsadüfi şifrələr yaratmaq və saxlamaq üçün bir şifrə menecerindən istifadə edin.
- Bir çox sözlü şifrə yalnız kifayət qədər böyük bir siyahıdan onun sözləri təsadüfi olaraq seçildiyi zaman istifadə olunur.
- Adları, tarixlərini, ünvanlarını, sitatları, klaviatur modellərini və yenidən istifadə olunan parçaları şifrələrdən saxlayın.
- Xidmətin bu üsulunu dəstəklədiyi zaman insan daxil etdiyi şifrə əvəzinə xidmət tərəfindən yaradılmış bir token və ya kriptografik açar istifadə edin.

Uzunluq və gözlənilməzlik dekorativ əvəzlərdən daha vacibdir. Bir simvolun təxmin edilə bilən bir sözə əlavə edilməsi nəticəni təhlükəsiz etmir.

## Password əsaslı hesabları qoruyun {#protect-password-based-accounts}

- Mövcud olduğu təqdirdə phishing əleyhinə çox amilli təsdiqlənməni təmin etmək.
- Dəfələrlə təsdiqlənmə çatışmazlığı üçün dərəcə məhdudiyyətləri, bağlama siyasəti və xəbərdarlıqlar tətbiq edin.
- Yalnız etibarlı, şifrələnmiş kanallar vasitəsilə şifrələr göndərin.
- Şifrələri və bərpa kodlarını qeydlərdən, əmr xəttlərindən, mənbə qoruyucularından, konfigüratsiya fayllarından, biletlərdən və söhbətlərdən uzaq tutun.
- Server tərəfindəki şifrə təsdiqləyicilərin duzlu, yaddaş sərt şifrə hashinq funksiyası və tətbiq üçün uyğun parametrləri ilə saxlanılması.

## Yükləmə, bərpa və əvəz {#storage-recovery-and-replacement}

- Şifreli, sınaqdan keçirilmiş yedekləmələri olan yoxlanan şifrə idarəçisindən istifadə edin.
- Bərpa kodlarını bərpa etdikləri cihazdan ayrı saxlayın. Qorunan oflayn kağız nüsxə bərpa materialı üçün uyğun ola bilər.
- Şifrə menecerinin ixracına və ehtiyat medialarına girişini məhdudlaşdırın.
- Şübhəli ifşadan, icazəsiz təkrar istifadədən və ya dəyişdirmə tələb edən siyasət hadisəsindən sonra şifrəni dəyişdirin.
- İstehsalatın başlanğıcından əvvəl hesabın bərpası prosedurlarını yoxlayın.

::: warning

Xüsusi açarı açan şifrə həmin açarın ifşa olunmuş nüsxəsini təhlükəsiz edə bilməz. Xüsusi açarın ifşasından şübhələnirsinizsə, yerləşdirmənin açarı dəyişdirmə və ya ləğv etmə proseduruna əməl edin.

:::

Bax [Əməliyyat təhlükəsizliyi](./operational-security.md) və [Storing Cryptographic Keys](./storing-cryptographic-keys.md).
