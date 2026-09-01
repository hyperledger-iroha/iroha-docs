---
translation_locale: az
translation_source: /guide/security/operational-security.md
translation_source_hash: 042673aca63962b4b3f91e59c29bc5030ada7d63f082991899951301cb1f6887
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Əməliyyat Təhlükəsizliyi {#operational-security}

Əməliyyat təhlükəsizliyi Iroha yerləşdirilməsi ətrafındakı insanları, hostları, sertifikatları və prosedurları qoruyur. Blokçeyn dəftəri qəbul edilmiş vəziyyət dəyişikliklərini qeyd edir. Operatorlar öz iş stansiyalarını, imzalama açarlarını və hadisələrə cavab prosesini ayrıca təmin etməlidirlər.

Aşağıdakı nəzarətləri yerləşdirmə əsas xətti kimi istifadə edin. Onları risk dəyərinə və təşkilatınızın tələblərinə uyğun tənzimləyin.

## Əməliyyat Əsasını Təsis Etmək {#establish-an-operational-baseline}

- Doğrulayıcı hostların, şəbəkə yoldaşlarının şəxsiyyətlərinin, hesab səlahiyyət prinsiplərinin, imzalama cihazlarının, ictimai API son nöqtələrinin və məsul şəxslərin inventarını saxlayın.
- İnkişaf, test və istehsal üçün ayrı giriş məlumatlarından istifadə edin. Hər bir kriptoqrafik imzalayanı, daşıyıcı tokeni və xüsusi açarı bir mühitə təyin edin.
- Konfiqurasiya və yerləşdirmə avtomatlaşdırılmasını nəzərdən keçirilə bilən versiya nəzarətində saxlayın. Sirrləri təsdiqlənmiş sirr anbarından və ya imzalama cihazından proqramın işləmə mühitinə daxil edin.
- Buraxılış artefaktlarının gözlənilən kriptoqrafik xeşlərini və ya imzalarını qeyd edin. Onları yerləşdirmədən əvvəl yoxlayın. Kimin ikili faylları, blokçeyn başlanğıc materialını, konfiqurasiyanı və ya xidmət təriflərini əvəz edə biləcəyini məhdudlaşdırın.
- Əməliyyat sistemi hesablarına, Iroha icazələrinə və şəbəkə idarəsinə minimal səlahiyyət tətbiq edin. Hər bir rol yalnız işinə lazım olan səlahiyyəti əldə etsin.
- İstehsal işə başlamazdan əvvəl ehtiyat nüsxə, bərpa, açar dəyişdirmə və həmyaşı bərpa prosedurlarını sınayın.

Əsas xətti təyin edərkən [Təhlükəsizlik Prinsipləri](./security-principles.md) və [Buraxılış Hazırlığı](../best-practices/release-readiness.md)-i nəzərdən keçirin.

## Açarları və kriptoqrafik imzalayanları qoruyun {#protect-keys-and-signers}

- Şəxsi açarları, toxum materialını, daşıyıcı tokenləri, avtorizasiya başlıqlarını və bərpa sirlərini mənbə idarəetməsindən, problem izləyicilərindən, chat transkriptlərindən, ekran görüntülərindən və ictimai sənədlərdən kənarda saxlayın.
- Yüksək dəyərli səlahiyyət prinsipləri üçün aparat dəstəklı və ya izolyasiya olunmuş imza istifadəsi edin. Müştəri imzanı təhvil verə bildikdə, xam açar materialını brauzerlərin və ümumi məqsədli tətbiq proseslərinin xaricində saxlayın.
- Adi əməliyyatlar, idarəetmə, yerləşdirmə və bərpa üçün ayrı səlahiyyət əsaslarından istifadə edin.
- Gizli yaddaşı və onun ehtiyat nüsxələrini şifrələyin. Canlı açara tətbiq olunan eyni giriş nəzarətlərini şəxsi açar ehtiyat nüsxəsinə də tətbiq edin.
- Sınaqdan keçirilmiş əvəz etmə və ya ləğv prosedurunu qoruyun. Siyasət tələb etdikdə və ya açığın ola biləcəyi şübhəsi olduqda açarı dəyişdirin.
- Valideyn üzvlüyü, imtiyazlı rollar və ya yüksək dəyərli aktivlərdəki dəyişikliklər üçün müstəqil yoxlama tələb edin.

Əsas-aid göstəriş üçün [Kriptoqrafik Açarların Yaradılması](./generating-cryptographic-keys.md) və [Kriptoqrafik Açarların Saxlanması](./storing-cryptographic-keys.md)-ə baxın.

## Nöqtələri və Operator Girişini Möhkəmləndirin {#harden-nodes-and-operator-access}

- Cari təchizatçı tərəfindən dəstəklənən, yamalanmış sistemlərdə node-ları və operator alətlərini işlədin. Lazımsız xidmətləri söndürün.
- Adlandırılmış operatorlara yalnız yoxlanılmış, şifrələnmiş kanallar vasitəsilə inzibati giriş verin.
- Qeyri-ictimai interfeysləri özəl şəbəkədə və ya [VPN](./vpn.md) yerləşdirin.
- Yalnız yerləşdirmə tərəfindən tələb olunan Torii, monitorinq və tətbiq yollarını açıq edin.
- Hər bir ictimai girişin qorunmasını mühitə uyğun sürət məhdudiyyətləri və daşıma təhlükəsizliyi ilə təmin edin.
- Konfiqurasiya fayllarını və xidmət etimadnamələrini məhdudlaşdırıcı fayl icazələri ilə qoruyun. Sirrləri əmr sətrlərində, proses siyahılarında və shell tarixçəsində saxlamayın.
- Risk modeli müstəqil nəzarəti tələb etdikdə, təsdiqedici, müştəri, monitorinq və ehtiyat nüsxə vəzifələrini ayırın.
- Vaxtı etibarlı mənbələrdən sinxronlaşdırın. Araşdırma üçün kifayət qədər sistem, xidmət və şəbəkə jurnallarını qoruyun.

## Təhlükəsiz Brauzer və İdarəçi İş Axınları {#secure-browser-and-admin-workflows}

Veb interfeysindən istifadə edən operator üçün:

- İdarə olunan iş stansiyasında hazırda satıcı tərəfindən dəstəklənən, tam yenilənmiş brauzerdən istifadə edin.
- Yalnız tələb olunan əlavələrlə xüsusi operator profili və ya cihazdan istifadə edin.
- Bir tələbi təsdiqləməzdən əvvəl mənşəyi və sertifikatı yoxlayın.
- Oxşar domenləri, gözlənilməz yönləndirmələri və xam açar materialı ilə bağlı tələbləri hadisə kimi qiymətləndirin.
- Aktiv operator sessiyasından əlaqəsiz saytları və uzantıları bloklayın.
- Qısa müddətli sessiyalardan istifadə edin. Səlahiyyətli əməliyyatlar üçün yenidən təsdiqləmə tələb edin.
- Əməliyyat detallarını kriptoqrafik imzalayan şəxslə göstərin. Operator təsdiqdən öncə səlahiyyət prinsipialını, şəbəkəni, təlimatları, aktivləri və haqları yoxlaya bilməlidir.

Brauzer təcridi məruz qalmanı azaldır. Operatorlar hələ də əməliyyatları nəzərdən keçirməli və təhlükəsiz imzalama istifadə etməlidirlər.

## İzləyin və Cavab Verin {#monitor-and-respond}

Bu siqnalları izləyin:

- təsdiqləyici və şəbəkə həmkarı üzvlük dəyişiklikləri
- təkrarlanan səlahiyyət uğursuzluqları və ya qeyri-adi üstün hüquqlu əmrlər
- gözlənilməz proqram təminatı, konfiqurasiya və ya marşrut dəyişiklikləri
- imzalama, sorğu və əməliyyat xətaları adi əsas səviyyədən kənarda
- resursların tükənməsi, konsensusun dayanması və ya gözlənilən şəbəkə yoldaşlarının itirilməsi
- fırıldaq qaydalarına uyğun aktiv, icazə və hesab dəyişiklikləri

Təsirlənmiş hostdan asılı olmayan kanala xəbərdarlıqlar göndərin. Əlaqədar qeydləri, konfiqurasiya zaman nöqtəsindəki məlumat baxışlarını, blokçeyn dəftərxana hadisələrini və əməliyyat kriptoqrafik xəşlərini zaman möhürləri ilə qoruyun. Baxın [Fırıldaqçılığın Monitorinqi](./fraud-monitoring.md) və [Performans və Ölçülər](../advanced/metrics.md).

## Bərpa Planı {#recovery-plan}

İstehsalın başlamasından əvvəl bərpa planını hazırlayın. Bərpa planı aşağıdakıları müəyyən etməlidir:

- kim hadisəni elan edə və əlaqələndirə bilər
- doğrulayıcılarla, infrastruktur operatorlarıyla, tətbiq sahibləri ilə və təsirlənmiş istifadəçilərlə necə əlaqə saxlamaq
- hansı səlahiyyət əsasları icazələri ləğv edə, açarları dəyişdirə və ya şəbəkə tərəfdaşının üzvlüyünü dəyişdirə bilər
- etibarlı ikili fayllar, konfiqurasiya, blokçeyn başlanğıc qeydləri, ehtiyat nüsxələr və açar inventarlarının saxlandığı yer
- bərpadan sonra şəbəkəni və asılı tətbiqləri necə yoxlamaq

Hadisə baş verəndə:

1. Təsirlənmiş hostu, hesab məlumatını, marşrutu və ya təsdiq prinsipini təcrid edin. Sübutları qoruyun.
2. Jurnalları və blokçeyn dəftəri istinadlarını qoruyun. Hər bərpa hərəkətini qeyd edin.
3. Təsdiqlənmiş idarəetmə prosesi vasitəsilə açıqlanmış etimadnamələri və icazələri ləğv edin və ya əvəz edin.
4. Təsdiqlənmiş artefaktlardan proqram təminatını və konfiqurasiyanı bərpa edin.
5. Şəbəkə üzvlüyünü, konsensus sağlamlığını, ictimai marşrutları, monitorinqi və tətbiq oxumalarını təsdiqləyin. Bu yoxlamalar keçdikdən sonra yazmaları yenidən başlatın.
6. Əsas səbəbi sənədləşdirin. Nəzarətləri, avtomatlaşdırmanı və məşqləri yeniləyin.

::: warning

Geri dönməz blokçeyn dəftəri əməliyyatları üçün əvvəlcədən nəzərdən keçirilmiş prosedurlara əməl edin. Təsir olunan səlahiyyət əsasına və aktivlərə uyğun təsdiqləri tələb edin.

:::
