---
translation_locale: az
translation_source: /guide/security/operational-security.md
translation_source_hash: 042673aca63962b4b3f91e59c29bc5030ada7d63f082991899951301cb1f6887
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Əməliyyat təhlükəsizliyi {#operational-security}

Əməliyyat təhlükəsizliyi Iroha yerləşdirilməsi ətrafında insanları, aparıcıları, etibarnamələri və prosedurları qoruyur. Başlıq qeydləri dövlət dəyişikliklərini qəbul edir. Operatorlar iş stansiyalarını, imza açarlarını və hadisə cavabı prosesini ayrı-ayrı təmin etməlidirlər.

Aşağıdakı idarəetmələrdən istifadə edin və onları risk dəyərinə və təşkilatınızın tələblərinə uyğunlaşdırın.

## Əməliyyat əsasını müəyyənləşdirin {#establish-an-operational-baseline}

- Validator hostlarının, həmyaşıdların kimliklərinin, hesab hakimiyyətinin, imzalanma cihazlarının, ictimai son nöqtələrin və məsuliyyətli şəxslərin siyahısını saxlamaq.
- İnkişaf, sınaq və istehsal üçün ayrı-ayrı etibarnamələrdən istifadə edin. Hər bir imzalanıcını, sahibini və xüsusi açarı bir mühitə təyin edin.
- Konfiqurasiya və tətbiq avtomatlaşdırılmasını nəzərdən keçirilə bilən versiyanın nəzarətində saxlayın. İşləmə vaxtı təsdiqlənmiş gizli mağaza və ya imzalama cihazından sirləri enjekte edin.
- İstifadə əşyalarının gözlənilən hash və ya imzalarını qeyd edin. Onları tətbiq etməzdən əvvəl yoxlayın. Binaryləri, genesis materialını, konfigurasiyanı və ya xidmət təriflərini kim əvəz edə biləcəyini məhdudlaşdırın.
- Operativ sistem hesablarına, Iroha icazələrinə və şəbəkə idarəetməsinə ən az imtiyaz tətbiq edin. Hər bir vəzifəyə yalnız onun işinə lazım olan səlahiyyəti ver.
- İstehsalatın başlanğıcından əvvəl test yedekləmə, bərpa, açarların əvəz edilməsi və rəfiqələrin bərpası prosedurları.

Tədqiqat [Təhlükəsizlik prinsipləri](./security-principles.md) və [İstifadə üçün hazırlıq](../best-practices/release-readiness.md) əsas xəttini müəyyənləşdirərkən.

## Anahtarları və imzalarını qoruyun {#protect-keys-and-signers}

- Xüsusi açarları, toxum materialını, sahibləri nömrələrini, icazə başlıqlarını və bərpa sirlərini mənbə nəzarətindən kənarda saxlayın, izləyiciləri buraxın, söhbət transkripsiyalarını, ekran görüntülərini və ictimai sənədləri.
- Yüksək dəyərli hakimiyyətlər üçün hardverlə dəstəklənmiş və ya təcrid edilmiş imzadan istifadə edin. Müştəri imzanı icra edə biləcəyi zaman çiçək açıcı materialı brauzerlərdən və ümumi məqsədli tətbiqi proseslərindən kənarda saxlayın.
- Rutin əməliyyatlar, idarəetmə, yerləşdirmə və bərpa üçün ayrı-ayrı səlahiyyətlərdən istifadə edin.
- Gizli saxlama və ehtiyatlarını şifrələyin. Yaşayış açarı ilə eyni giriş nəzarətlərini xüsusi açarlı ehtiyatlara tətbiq edin.
- Təcrübəli əvəz və ya ləğv prosedurunu qoruyun. Siyasət tələb etdikdə və ya məruz qalma şübhəsi olduqda bir açarı dəyişdirin.
- Validator üzvlüyündəki dəyişikliklər, imtiyazlı rollar və ya yüksək dəyərli aktivlər üçün müstəqil bir araşdırma tələb olunur.

[Key xüsusi göstərici üçün ](./generating-cryptographic-keys.md) və [Storing Cryptographic Keys](./storing-cryptographic-keys.md) nömrələrini yaratmaq.

## Hardinq qovşaqları və operatorlara giriş {#harden-nodes-and-operator-access}

- Hal-hazırda istehsalçı tərəfindən dəstəklənmiş, düzəldilmiş sistemlərdə qovşaqları və operator vasitələrini işlətmək. Lazımsız xidmətləri söndürmək.
- Adlı operatorlara yalnız yoxlanılmış, şifrələnmiş kanallar vasitəsilə inzibati giriş imkanı verin.
- İctimai olmayan interfeysləri özəl şəbəkədə və ya [VPN](./vpn.md) qoyun.
- Yalnız Torii, monitorinq və tətbiq yollarını göstərin ki, yerləşdirmə üçün tələb olunur.
- Ətraf mühitə uyğun tarif məhdudiyyətləri və nəqliyyat təhlükəsizliyi ilə hər bir ictimaiyyətin girişini qorumaq.
- Konfiqurasiya fayllarını və xidmət təsdiqlərini məhdud sənəd icazələri ilə qoruyun. Əmr xətti, proses siyahıları və qabıq tarixindən gizli saxlayın.
- Risk modelinin müstəqil nəzarəti tələb etdiyi zaman müvafiq təsdiqçi, müştəri, monitorinq və yedek funksiyaları.
- Güvənilən mənbələrdən vaxt sinxronlaşdırın və araşdırma üçün kifayət qədər sistem, xidmət və şəbəkə qeydlərini qoruyun.

## Təhlükəsiz Browser və Admin iş axınları {#secure-browser-and-admin-workflows}

Veb interfeysindən istifadə edən operator üçün:

- Hazırda idarə olunan bir iş stansiyasında satıcı tərəfindən dəstəklənən, tam yenilənmiş brauzerdən istifadə edin.
- Yalnız tələb olunan uzantıları olan xüsusi operator profilindən və ya cihazdan istifadə edin.
- Sorğunu təsdiqləməzdən əvvəl mənşəyi və sertifikatı yoxlayın.
- Eyni görünüşdə olan domenləri, gözlənilməmiş yönləndirmələri və əsas xammal üçün müraciətləri hadisə kimi qəbul edin.
- Aktiv operator seansından əlaqəsi olmayan saytları və uzantıları bloklayın.
- Qısa müddətli seanslardan istifadə edin və imtiyazlı hərəkətlər üçün yenidən təsdiqlənməni tələb edin.
- Əməliyyat təfərrüatlarını imzalayana göstərin. Operator təsdiqdən əvvəl səlahiyyəti, şəbəkəni, təlimatları, aktivləri və ödənişləri yoxlaya bilməlidir.

Browser təcrid edilməsi məruz qalmağı azaldır. Operatorlar hələ də əməliyyatları nəzərdən keçirməli və təhlükəsiz imzalanma istifadə etməlidirlər.

## Nəzarət edin və cavab verin {#monitor-and-respond}

Bu siqnalları izləyin:

- Validator və həmkar üzvlüyündəki dəyişikliklər
- Təkrarlanan icazə çatışmazlığı və ya qeyri-adi xüsusi təlimatlar
- Gözlənilməz proqram təminatı, konfiqurasiya və ya marşrut dəyişiklikləri
- İmzalama, sorğu və əməliyyat səhvləri normal əsas xəttdən kənarda
- resursların tükənməsi, sabitləşmiş razılaşma və ya gözlənilən həmyaşıdların itkisi
- Xəyanət qaydalarına uyğun olan aktivlər, icazə və hesab dəyişiklikləri

Xəbərdarlıqları təsirlənən hostdan asılı olmayan kanala göndərin. Müvafiq jurnalları, konfiqurasiya ani görüntülərini, reyestr hadisələrini və əməliyyat heşlərini vaxt möhürləri ilə qoruyun. [Fırıldaqçılıq monitorinqi](./fraud-monitoring.md) və [Performans və metrikalar](../advanced/metrics.md) bölmələrinə baxın.

## Bərpa planı {#recovery-plan}

İstehsalatın başlanmasından əvvəl bərpa planı hazırlayın. Bərpa planında aşağıdakılar müəyyən edilməlidir:

- bir hadisəni elan edə və əlaqələndirə bilən şəxs
- təsdiqləyicilər, infrastruktur operatorları, tətbiq sahibləri və təsirlənən istifadəçilərlə necə əlaqə saxlamaq olar;
- hansı hakimiyyətlər icazələri ləğv edə bilər, açarları əvəz edə və ya həmyaşıd üzvlüyünü dəyişə bilər
- etibarlı ikitərəflilərin, konfiqurasiyanın, genesis qeydlərinin, ehtiyatların və açar inventarlarının saxlandığı yer
- Şəbəkənin və asılı tətbiqlərin bərpasından sonra necə təsdiqlənməsi;

Hadisə baş verdikdə:

1. Təsirlənmiş hostu, etimadnaməni, marşrutu və ya səlahiyyəti təcrid edin. Sübutları qoruyun.
2. Gündəliklər və kitabxana istinadları saxlayın, bütün bərpa hərəkətlərini qeyd edin.
3. Təsdiqlənmiş idarəetmə prosesi vasitəsilə açıqlanmış etimad və icazələri ləğv etmək və ya əvəz etmək.
4. Proqram təminatını və konfiqurasiyanı yoxlanmış artefaktlardan bərpa edin.
5. Həmyaşıd üzvlüyünü, konsensusun sağlamlığını, ictimai marşrutları, monitorinqi və tətbiq oxunuşlarını təsdiqləyin. Yazma əməliyyatlarını yalnız bu yoxlamalar uğurla başa çatdıqdan sonra bərpa edin.
6. Əsas səbəbi sənədləşdirin. Nəzarət, avtomatlaşdırma və məşqləri yeniləyin

::: warning

Geri qaytarılması mümkün olmayan reyestr əməliyyatları üçün əvvəlcədən nəzərdən keçirilmiş prosedurlara əməl edin. Təsirlənən səlahiyyət və aktivlərə uyğun təsdiqləri tələb edin.

:::
