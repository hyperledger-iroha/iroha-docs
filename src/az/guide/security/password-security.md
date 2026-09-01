---
translation_locale: az
translation_source: /guide/security/password-security.md
translation_source_hash: 093be5b91700b9a6f85b45dc873c8c29d90397d5c9e3c842a77bfb03e97b37da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Şifrə Təhlükəsizliyi {#password-security}

Şifrələr operator konsollarını, gizli anbarları, ehtiyat nüsxələri və yerli açar fayllarını qoruya bilər. Şifrə yalnız bir nəzarət vasitəsidir. Mövcud olduqda təhlükəsiz açar saxlanması, giriş nəzarətləri və çoxfaktorlu identifikasiyadan birlikdə istifadə edin.

## Yalnız Unikal, Yaradılmış Şifrələrdən İstifadə Edin {#use-unique-generated-passwords}

- Hər hesab və mühit üçün fərqli parol yaradın.
- Uzun təsadüfi parollar yaratmaq və saxlamaq üçün parol menecerindən istifadə edin.
- Çoxsözlü parol ifadəsini yalnız sözləri kifayət qədər böyük siyahıdan təsadüfi seçildikdə istifadə edin.
- Şifrlərdə adları, tarixləri, ünvanları, sitatları, klaviatura nümunələrini və təkrar istifadə olunan parçaları daxil etməyin.
- Xidmət bu üsulu dəstəklədikdə, insan tərəfindən daxil edilmiş parol əvəzinə xidmət tərəfindən yaradılmış token və ya kriptoqrafik açardan istifadə edin.

Uzunluq və proqnozlaşdırılmazlıq bəzək əvəzetmələrindən daha önəmlidir. Proqnozlaşdırıla bilən sözə bir simvol əlavə etmək nəticəni təhlükəsiz etmir.

## Şifrə Əsaslı Hesabları Qoruyun {#protect-password-based-accounts}

- Mövcud olduqda fişinqə davamlı çoxfaktorlu autentifikasiyanı aktiv edin.
- Təkrar olunan autentifikasiya uğursuzluqlarına tətbiq sürət məhdudiyyətləri, kilidləmə siyasəti və xəbərdarlıqlar tətbiq edin.
- Şifrləri yalnız təsdiqlənmiş, şifrələnmiş kanallar vasitəsilə göndərin.
- Şifrələri və bərpa kodlarını qeydlərdən, əmr sətrlərindən, mənbə anbarlarından, konfiqurasiya fayllarından, biletlərdən və söhbətlərdən kənarda saxlayın.
- Server tərəfi parol yoxlayıcılarını duzlu, yaddaş tələb edən parol həşləmə funksiyası və yerləşdirməyə uyğun parametrlərlə saxlayın.

## Yaddaş, Bərpa və Əvəzləmə {#storage-recovery-and-replacement}

- Şifrələnmiş, sınaqdan keçirilmiş ehtiyat nüsxələri olan auditdən keçirilmiş şifrə menecerindən istifadə edin.
- Bərpa kodlarını onları bərpa edən cihazdan ayrı saxlayın. Qorunan, oflayn kağız nüsxəsi bərpa materialı üçün uyğun ola bilər.
- Şifrə menecerinin ixracatlarına və ehtiyat nüsxə daşıyıcılarına girişə məhdudiyyət qoyun.
- Şübhəli ifşa, icazəsiz təkrar istifadə və ya əvəzləmə tələb edən bir siyasət hadisəsindən sonra şifrəni dəyişdirin.
- İstehsal işə salmadan əvvəl hesabın bərpa prosedurlarını sınaqdan keçirin.

::: warning

Şəxsi açarı açan parol, həmin açarın aşkar edilmiş nüsxəsini təhlükəsiz edə bilməz. Əgər şəxsi açarın aşkar edilməsi şübhə altındadırsa, yerləşdirmənin açar əvəzləmə və ya ləğv prosedurunu izləyin.

:::

Baxın [Əməliyyat Təhlükəsizliyi](./operational-security.md) və [Kriptoqrafik Açarların Saxlanması](./storing-cryptographic-keys.md).
