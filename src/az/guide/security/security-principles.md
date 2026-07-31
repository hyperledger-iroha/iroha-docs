---
translation_locale: az
translation_source: /guide/security/security-principles.md
translation_source_hash: ca78f72b2e319a67a5fa5c74126de108cd552cdc758e3a2b981f7a7930a3b61e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Təhlükəsizlik prinsipləri {#security-principles}

Təşkilatlar və fərdi istifadəçilər Iroha qurğuları ilə təhlükəsiz qarşılıqlı əlaqələrin təmin edilməsi üçün birlikdə işləməlidirlər. Bu mövzuda bu əməkdaşlığın əsas prinsipləri izah olunur.

## Ümumi təhlükəsizlik prinsipləri {#general-security-principles}

1. [Virtual Private Network](./vpn.md) (VPN) istifadə edin:

    - Həssas məlumatlara və ya mənbələrə, xüsusən də ictimai şəbəkələr vasitəsilə daxil olduqda <abbr title="Virtual Private Network">VPN</abbr> ünvanından istifadə edərək məlumatlarınızı qoruyub saxlayan təhlükəsiz bir əlaqə qura bilərsiniz.

2. Şəbəkənin qorunması üçün bir firewall istifadə edin:

    - Ev və/və ya ofis şəbəkələrini gücləndirmək üçün icazəsiz girişlərə qarşı mübarizə aparmağa və bağlı cihazları viruslardan və zərərli proqramlardan qorumağa kömək edən bir firewall quraşdırın.

3. Fiziki və rəqəmsal məlumatların təhlükəsizliyi:

    - Həssas məlumatları ehtiva edən fiziki sənədləri təhlükəsiz bir yerdə qoruyun və rəqəmsal sənədlərin şifrələndirilməsini və şifrə ilə mühafizə olunmuş qovluqlarda saxlanılmasını təmin edin.

4. Daimi məlumat yedekləmələri saxlayın:

    - Həmişə vacib məlumatlarınızın nüsxələrini təhlükəsiz bir yerdə saxlayın. Bu yolla, məlumatlarınızı itirirsinizsə və ya bir şey səhv olarsa, hər şeyi tezliklə geri qaytara bilərsiniz. Bu yedekləmələri ümumiyyətlə məlumatlarınızı saxladığınız yerdən fərqli bir təhlükəsiz yerə saxlayın.

## Tərəflər üçün təhlükəsizlik prinsipləri {#security-principles-for-individual-users}

1. Güclü təsdiqləmə qaydalarını qəbul edin:

    - Bütün hesablar üçün güclü və unikal şifrələrdən istifadə edin.

    - Heç vaxt şifrələri yenidən istifadə etməyin.

    - Mümkün olduqda <abbr title="Two-Factor Authentication">2FA</abbr> quraşdırın. <abbr title="Two-Factor Authentication">2FA</abbr> təkcə şifrəni tələb etməklə deyil, həm də bir əlavə amil kimi <abbr title="One-Time Password">OTP</abbr>, barmaq izi və ya üçüncü tərəf tətbiqinə əsaslanan təsdiqlənmə (məsələn, Google Authenticator) ilə ümumi təhlükəsizliyi yaxşılaşdırır.

    - SMS təsdiqini ikinci amil kimi istifadə etməyin. Zərərli proqramların bütün SMS mesajlarınızı izləmədiyi üçün heç bir zəmanət yoxdur. Məsələn, Android tətbiqləri yalnız onlar üçün nəzərdə tutulmuş mesajlara daxil olmaqla məhdudlaşdırıla bilməzlər.

2. Rəqəmsal ünsiyyətdə ehtiyatlı olun: - Qəbul olunan bütün e-poçtların imzalarını imzalayan və təsdiqləyən bir elektron poçt müştəri qurun. Göndəricinin adresini təxmin etmək və hətta bank kimi davranmaq mümkündürsə də, imza saxlamaq mümkün deyil. - Həm HTML mesajlarını, həm də xarici resursların bilinməyən və ya yoxlanılmamış ünvanlardan yüklənməsini söndürün.

    - Şübhəli e-poçtları, bağlantıları və şəxsi məlumat tələblərini tanımaq və qarşısını almaq üçün ən çox istifadə olunan phishing texnikalarını öyrənin.

    - Alınan bütün e-poçtların imzalarını imzalamaq və təsdiqləmək üçün bir e-poçta müştəri qurun. Göndəricinin ünvanını gizlətmək və hətta bank kimi davranmaq mümkündürsə də, imzanı saxlamaq mümkün deyil.

3. Şəxsi məlumatların qorunması:

    - Tanımadığımız insanlarla, xüsusilə də telefon və ya internet vasitəsilə ünsiyyət qurarkən şəxsi məlumatları paylaşmamaqdan ehtiyatlı olun.

    - Məlumat verdiyiniz şəxsləri və ya təşkilatları müstəqil olaraq araşdıraraq onların kimliklərinin etibarlı olduğunu təsdiqləyin.

    - Sosial şəbəkələrdə paylaşdığınız şəxsi məlumatlardan xəbərdar olun, çünki zərərli tərəflər bu məlumatdan istifadə edə bilərlər.

## Təşkilatlar üçün təhlükəsizlik prinsipləri {#security-principles-for-organisations}

1. Aydın təhlükəsizlik siyasətlərini və prosedurlarını müəyyənləşdirmək:

    - Həssas məlumatlarla məşğul olan bütün işçilər üçün dəqiq müəyyən edilmiş təhlükəsizlik siyasətləri və protokolları inkişaf etdirmək. İşçilərin bu qaydalara riayət etmələrini diqqətlə öyrətməklə səhlənkarlıq riskini azaltmaq.

    - Təhlükəsizlik siyasətinin bütün işçilər üçün əlçatan olmasını təmin etmək və dəyişən təhlükəsizlik mənzərələrini əks etdirmək üçün mütəmadi olaraq nəzərdən keçirilməsi və yenilənməsi.

    - Təhlükəsizlik siyasətlərini işçilər üçün daha münasib və tətbiq oluna biləcək nümunələr və ssenarilərlə təmin edin.

2. İşçilərin məlumatlılığını artırmaq:

    - Təşkilatın təhlükəsizliyinin möhkəmləndirilməsində işçilərin məlumat və əməliyyat təhlükəsizliyi tədbirləri haqqında məlumatlandırılması vacibdir.

    - İşçilərin hər hansı bir şübhəli fəaliyyət və ya təhlükəsizlik narahatlığı barədə dərhal məlumat vermələrini təşviq edin.

3. Fiziki infrastrukturun qorunması:

    - Serverlərə və infrastrukturlara fiziki girişin məhdudlaşdırılması. Yalnız icazəli şəxslərin məhdudiyyətli ərazilərə girməsinə icazə verən giriş nəzarətləri qurmaq.

    - Təhlükəsizlik ehtiyaclarının inkişafına uyğun olaraq giriş nəzarət tədbirlərinin mütəmadi şəkildə nəzərdən keçirilməsini və yenilənməsini təmin etmək.

    - Fiziki təhlükəsizliyi artırmaq üçün həssas ərazilərə biometrik giriş nəzarətlərinin tətbiq edilməsini nəzərdən keçirin.

4. Təhlükəsizlik nəzarətinin həyata keçirilməsi:

    - Tədbirlərin araşdırılması və potensial təhlükəsizlik pozuntularının aşkarlanması üçün hərtərəfli bir təhlükəsizlik nəzarəti sistemi tətbiq etmək.

    - Hər hansı qeyri-adi və ya icazəsiz fəaliyyət barədə təhlükəsizlik işçilərini dərhal məlumatlandırmaq üçün avtomatlaşdırılmış xəbərdarlıqlar tətbiq etmək.

    - Sistemin anomaliyaları və potensial təhlükələri aşkar etmək qabiliyyətini artırmaq üçün maşın öyrənmə alqoritmlərindən istifadə etməyi düşünün.

    - Verilənlər bazasının təhlükəsizliyini nəzarət etmək, proqram zəifliklərini müəyyənləşdirmək, izləmək və həll etmək və təsdiqlənmiş siyahıya daxil edilməyən icazəsiz proqramların mövcudluğu üçün kritik maşınlarda müntəzəm yoxlamalar aparmaq üçün əməkdaşları və ya təyin edilmiş şəxsləri işlətmək.

5. Dəfələrlə təhlükəsizlik auditləri aparmaq:

    - Güclülüklərin qiymətləndirilməsi və müəyyən edilmiş təhlükəsizlik tədbirlərinin ümumi qəbul olunan standartlara və qaydalara uyğun olub-olmadığını təsdiq etmək üçün müntəzəm təhlükəsizlik auditləri aparmaq.

    - Təşkilatınızın təhlükəsizlik vəziyyətinin taraz qiymətləndirilməsi üçün müntəzəm olaraq təhlükəsizlik mütəxəssislərinin işinə götürülməsini düşünün.

6. Giriş nəzarət sistemini tətbiq etmək:

    - İşçilərin yalnız öz rolları üçün zəruri olan resurslara və informasiyaya sahib olmasını təmin etmək üçün rolu əsaslı bir giriş nəzarəti sistemi yaradılsın.

7. Daim inkişaf etməyi qəbul edin:

    - Təhlükəsizliyin davamlı bir proses olduğunu qəbul edin. Təhlükəsizlik tədbirlərinin davamlı qiymətləndirilməsini qoruyun və yaranan təhdidlər və çətinliklərə qarşı mübarizə üçün onları proaktiv şəkildə gücləndirin.

    - İşçilərin təhlükəsizliyin yaxşılaşdırılması üçün təkliflər verməklərini təşviq edən, davamlı inkişaf mədəniyyətini təşviq etmək üçün geri bildirmə döngəsinin yaradılmasını düşünün.
