---
translation_locale: az
translation_source: /guide/security/operational-security.md
translation_source_hash: 01397a0e53a3f62df21e33b1473babd910cc733713ef69e43b3bbb501b48e7a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Əməliyyat təhlükəsizliyi {#operational-security}

Operativ Təhlükəsizlik (OPSEC) təhlükəsizlik və risk idarəetməsinə sistematik yanaşmadır ki, əsasən icazəsiz girişlərin və məlumatların sızmasının qarşısının alınması məqsədilə xüsusi istifadə halları üçün qəbul edilmiş strategiyalar və məsləhətlər toplusudur.

<abbr title="Operational Security">OPSEC</abbr> şirkətlərin əksəriyyətinin öz aktivlərinin mövcudluğunu və sabitliyini təmin etmək üçün standart təcrübədir. Bu, fiziki təhlükəsizlik kimi amillərin nəzərə alınmasını da əhatə edir (məsələn, nəzarətsiz post-it qeydlərin həssas məlumatları ehtiva etməməlləşdirməsini təmin etmək), təhlükəsiz ünsiyyət protokolları (məsələn, şifrələnməmiş SMS vasitəsilə həssas məlumatların göndərilməməsi), təhdid analizi (məs. potensial zərərli tərəflərin müəyyən edilməsi, ən son hücum üsulları haqqında öyrənilməsi), kadr hazırlığı (məs., işçilərin <abbr title="Operational Security">OPSEC</abbr> tədbirlərinə riayət etməməsi olmadan); Onlar tez və ya gec təsirli olmayacaq) və risklərin azaldılması (məsələn, sabit disklərinizi və USB cihazlarınızı şifrələmək).

Iroha maliyyə kitabçısı kimi tətbiq ediləcəyi ehtimalı olduğundan, <abbr title="Operational Security">OPSEC</abbr> tədbirləri və təcrübələri ciddi şəkildə qəbul edilməlidir. Bu mövzu Iroha istifadə edən şəxslərin və təşkilatların öz əməliyyatlarının bir hissəsi olaraq nəzərə alması lazım olan strategiyaları və yanaşmalarını təsvir edir geniş təhlükəsizlik protokolu.

Bununla birlikdə, bu mövzudaki istiqamətləri izləmək və qəbul etmək tam təhlükəsizliyin əldə edilməsi istiqamətində zəruri bir addımdır. Bu, tək başına kifayət etmir. Təhlükəsizliyinizi daha da yaxşılaşdırmaq üçün [Təhlükəsizliyin ](./index.md) bölməsinin qalan hissəsində və xüsusilə aşağıdakı mövzular:

- [Təhlükəsizlik prinsipləri](./security-principles.md)
- [Şifrə təhlükəsizliyi](./password-security.md)

## Tədbirlər OPSEC tövsiyə olunur {#recommended-opsec-measures}

- [ ən çox ehtimal edilən yol ](https://arxiv.org/pdf/2209.08356.pdf) bir blockchain-də öz aktivlərini itirmək, həssas məlumatlarını verməkdir.

- Disklərinizi şifrələyin. Başlatma cihazlarını şifrələmək hücumçu donanmaya giriş əldə etsə də məlumatlarınızı qorumağa imkan verir. Bunu portativ cihazlarınız üçün etmək iki dəfə daha vacibdir.

- Güvənilən proqramdan istifadə edin. Yenidən istehsal edilə bilən ikili quruluşlar vasitəsilə göndərilən və mənbədən tikdiyiniz proqram ən etibarlıdır. Müvəkkillik və ya açıq mənbəli proqram təminatı yoxlanılmamış bir potensial riskdir ki, ciddi qəbul edilməlidir.

- Həssas məlumatlara sahib olan mobil cihazları heç vaxt nəzarətsiz buraxmayın. Cihazınızı oğurlamaq üçün bir saniyə hissəsi kifayətdir.

- Binar paketlərdəki imzaları yoxlayın. Bu Iroha daxilində istifadə olunan ictimai açar kriptografiyasından çox fərqlənmir.

- Laptopunuzu və ya kompüterinizi nəzarətsiz buraxarkən həmişə təhlükəsiz saxlayın. Güclü şifrələrdən istifadə edin, ekranı kilidləyin və cihazlarınızı qorumaq üçün ən yaxşı üsullara əməl edin.

- Mühafizə qurun. [hava boşluğu](https://en.wikipedia.org/wiki/Air_gap_(networking)Əvvəlcə açarları şifrələyin, sonra onları yalnız offline cihazda saxlayın. İdeal olaraq elektromagnetik qoruyucu quraşdırılmışdır. [Hardver açarları](./storing-cryptographic-keys.md#using-a-hardware-key) xüsusi olaraq bu məqsədlə nəzərdə tutulmuşdur.

- Hər zaman proqramınızı kompüterlər və telefonlar daxil olmaqla bütün qurğularda ən son versiyasına yeniləyin. Düzenli yeniləmələr zəiflikləri düzəltməyə və köhnə proqramlarla əlaqəli potensial risklərin minimuma endirilməsinə kömək edir, hətta belə zəifliklər açıqlanmadan əvvəl.

- Şifrə və kriptografik açarları müntəzəm olaraq yeniləmək üçün bir rutin inkişaf etdirin. Bu proaktiv yanaşma ümumi təhlükəsizlik mövqeyini yaxşılaşdırmağa əhəmiyyətli dərəcədə töhfə verir, Çünki hərəkət edən hədəfə çatmaq daha çətindir.

## Browserlərdən istifadə etmək {#using-browsers}

Iroha ilə bağlı bir tətbiqdə UI şəbəkəsi mövcuddursa, brauzeriniz ya təhlükəsizliyə kömək edə bilər, ya da potensial bir təhlükə yarada bilər. Xüsusilə quraşdırmağı seçdiyiniz plaginlərə gəldikdə ehtiyatlı olmaq vacibdir.

Araşdırma təhlükəsizliyinizi artırmaq üçün aşağıdakı tədbirləri nəzərdən keçirin:

- Pis təhlükəsizlik modellərinə sahib olduğu və istifadəçilərinin məlumatlarını sızdırdığı üçün tanınan brauzerlərdən qaçın. Hər hansı bir brauzer üçün məxfilik pozuntuları və təhlükəsizlik məsələlərini axtara bilərsiniz. Məsələn, [ bu brauzer məxfiliyi haqqında məqalədə](https://www.unixsheikh.com/articles/choose-your-browser-carefully.html) müxtəlif brauzerlər və onların nə qədər etibarlı olduğunu müzakirə edir. Qeyd edək ki, özəl brauzerlər (məsələn, Chrome, Safari, Opera, Vivaldi, Edge və digərləri) ümumiyyətlə kodlarının ictimaiyyətdən gizləndiyi üçün yoxlanılması olduqca çətindir. Bu o deməkdir ki, onların nə qədər etibarlı olduğundan əmin ola bilməzsən.

- İstifadəçilərinin məxfiliyini və təhlükəsizliyini qiymətləndirmək və qorumaq üçün sağlam tarixçəsi olan brauzerlərə üstünlük vermək:
  - [Librewolf](https://librewolf.net/), [Icecat](https://www.gnu.org/software/gnuzilla/), [Firedragon](https://github.com/dr460nf1r3/firedragon-browser), vb. Mozilla Firefox'un əlavə təhlükəsizlik xüsusiyyətləri ilə yaxşı qurulmuş çatallarıdır.
  - [Əlavə təhlükəsizlik tədbirləri ilə təkmilləşdirilən və Google-la əlaqəli bütün veb xidmətlərini aradan qaldırmış Google Chrome'un çox audit edilmiş açıq mənbəli versiyası olan ](https://github.com/ungoogled-software/ungoogled-chromium)
  - [Cəsarətli.](https://brave.com/)  yüksək səviyyədə yoxlanılan açıq mənbəli versiyası [Google Chromium](https://www.chromium.org/Home/) Əlavə təhlükəsizlik tədbirləri ilə gücləndirilən, daxili bir sistemə malik olan <abbr title="Virtual Private Network">VPN</abbr> və reklam bloker funksiyası.
  - [Falkon](https://www.falkon.org/)  Açıq mənbəli Qt əsaslı veb brauzer ( `QtWebEngine`, üçün qablaşdırma [Google Chromium](https://www.chromium.org/Home/)Təhlükəsizliyi ilə bağlı məlum tarixçəsi olan; bir sıra genişləndirmələri öz [KDE mağaza səhifəsi](https://store.falkon.org/browse/).
  - [Qutebrowser](https://qutebrowser.org/)  açıq mənbəli Qt əsaslı veb brauzer ( `QtWebEngine` üzərində qurulmuş, [Google Chromium ](https://www.chromium.org/Home/) üçün bir qablaşdırma) etibarlı olması ilə tanınmış; minimalist GUI ilə unikal klaviaturaya yönəlmiş yanaşmaya malikdir; bir çox təhlükəsizlik mütəxəssisləri üçün seçilən brauzer hesab olunur.

- Lazım olmadıqdan sonra `JavaScript` aktivləşdirilməsinə icazə verməyin.

- quraşdırılmış plaginlərin əldə etmək hüquqlarını məhdudlaşdırmaq üçün brauzerin daxili məhdudiyyət mexanizmindən istifadə edin.

- Mühüm əməliyyatlardan əvvəl və sonra çerezləri təmizləyin. Məni qeydə alın və ya məni xatırlayın xüsusiyyətini aktivləşdirmədən ehtiyatlı olun. Bəzi veb saytlarda bu xüsusiyyət standart olaraq aktivləşdirilir.

- Reklam blokerindən istifadə edin. Bunlar təkcə reklamları bloklamaqla yanaşı, saytın izləmə xüsusiyyətlərini də pozur. İstifadə etdiyiniz brauzerdən asılı olaraq, bir reklam blokeri daxili xüsusiyyət ola bilməz.

- Eyni görünüşlü xarakterlərə diqqət yetirin (məsələn, `0`, `θ`, `O`, `О`, `ዐ` və `߀` Bu cür detallara diqqət yetirmək sizi phishing hücumundan xilas edə bilər.

- İnternetdən çəkinin UI E-poçt müştəriləri masaüstü müştərilərin xeyrinə. İstifadə etməzdən əvvəl masaüstü e-poçt klientinizi imzalamaq və yoxlamaq üçün qurun GPG Əsas imzalar.

- İnternet əsaslı mesajlaşma xidmətlərindən istifadədən çəkinin. Məsələn, Discord (kişiliklə məşhur `electron` çərçivəsi ilə qurulmuşdur) Diskordun veb versiyası açıq olan Google Chromium pəncərəsi kimi eyni hücumlara məruz qalır.

- Mümkün olduqda brauzerinizi ən son versiyaya yeniləyin. Yeniləmələr tez-tez zəiflikləri həll edən kritik təhlükəsizlik düzəlişləri daxildir.

- Qəbul olun ki, hansı brauzer uzantıları quraşdırırsınız. Yalnız nüfuzlu mənbələrdən tanınmış və etibarlı uzantıları istifadə edin. Xüsusi uzantılar məlumatlarınıza və məxfiliyinizə təsir edə bilər.

- Müxtəlif vəzifələr üçün ayrı brauzer profillərini yaradın. Gündəlik brauzer üçün bir profildən istifadə edin və digərindən yüksək təhlükəsizlik və həssas məlumatları əhatə edən tədbirlər üçün istifadə edin. Bu yolla gündəlik brauzer profili üzərində quraşdırılan uzantılar etibarlıdan həssas datalara daxil ola bilməz.

- USB flash sürücüsünə nüsxələnmiş brauzerinizin portativ versiyasından istifadə edin. Bu üsul təmin edir ki, quraşdırılmış plaginlərdən birinə profillər arasındakı məlumatlara giriş imkanı verilsə də, təhlükəsizliklə bağlı profilin ayrı və çıxarıla bilən cihazda qalır.

- Cihazınızda təsadüfən saxlanıla biləcək həssas məlumatları aradan qaldırmaq üçün brauzerinizin ehtiyat və çerezlərini mütəmadi olaraq təmizləyin.

## İstifadə planı {#recovery-plan}

Bir açarı itirmək və ya təhlükəsizlik pozuntuları ilə üzləşmək kimi təcili hallarda, Yaxşı qurulmuş və əvvəlcədən hazırlanmış bərpa planı vacib bir həyat xəttidir. Mümkün olan zərərin aradan qaldırılmasına və təhlükəsizliyin sürətlə bərpa edilməsinə kömək etmək üçün aydın addımlar qoyulmalıdır.

Təşkilatlar öz bərpa planlarını hazırlayarkən aşağıdakı əsas aspektləri nəzərə almalılar:

- Anahtarların itirilməsi və ya digər təhlükəsizlik hadisələri halında tətbiq edilməli olan addım-addım prosedurları təsvir edin. Bu addımların istifadəçilər və/və ya işçilər üçün asanlıqla əldə olunmasını və başa düşülməsini təmin edin.

- Kriptografik açar və şifrə kimi təhlükəsizlik pozuntularını və potensial təhdidləri dərhal bildirmək üçün istifadə edilə biləcək bir ünsiyyət kanalını qurun.

- Təhlükəsizlik tədbiri olaraq aparat açarlarından istifadə edirsinizsə (məsələn, [YubiKey](https://www.yubico.com/products/) və ya [ SoloKeys Solo](https://solokeys.com/collections/all)), redundantlıq strategiyasını qəbul etməyi düşünün. İki açarı saxlayın: biri gündəlik istifadə üçün, digəri isə etibarlı bir yerdə saxlanılır. Bu tədbir əsas açar zərərləndirilmiş və ya itirilmiş olsa belə, giriş təmin edir.

- Təhlükəsizlik pozuntuları və ya sızıntıları bildirildikdə, təsirlənən açarları və şifrələri əvəzləyərək və ya söndürərək dərhal reaksiya verin.

- Təhlükəsizlik planınızı mütəmadi olaraq nəzərdən keçirin və yeniləyin. Bu, təhlükəsizlik mənzərəsi inkişaf edərkən planın müvafiq və effektiv qalmasını təmin edir.

::: xəbərdarlıq

Unutmayın ki, bərpa planı başqa bir sənəd deyil. Əksinə, gözlənilməz çətinliklərin qarşısını almağa kömək edən bir həyat xəttidir. siz əməliyyat təhlükəsizliyinizi gücləndirirsiniz və hər hansı bir təhlükəsizlik hadisəsi ilə əlaqədar effektiv cavab vermək üçün hazırlığınızı artırırsınız.

:::
