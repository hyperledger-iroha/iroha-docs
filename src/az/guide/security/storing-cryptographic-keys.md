---
translation_locale: az
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: 168ee24e84f9225e81365658018717155476ae1508fefba5e0234e0bf6feefbd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kriptoqrafik Açarların Saxlanması {#storing-cryptographic-keys}

Şəxsi açar, onun səlahiyyət verdiyi əsas tərəfindən icazə verilən hər bir əməliyyatı təsdiqləyə bilər. Heç vaxt şəxsi açarı paylaşmayın. Toxum materialını, bərpa sirlərini, daşıyıcı tokenləri və ixrac edilmiş açar fayllarını eyni diqqətlə qoruyun.

İstehsalın başlamasından əvvəl saxlanma dizaynını seçin. Dizayn risk altındakı dəyərə, hesab-nəzarətçi siyasətinə və yerləşdirmənin bərpa prosessinə uyğun olmalıdır.

## Məhkəmə nəzarəti sərhədini müəyyən edin {#define-the-custody-boundary}

- Hər bir səlahiyyət əsasını, açıq açarı, alqoritmi, mühiti, məqsədi, məsul şəxsi, saxlama yerini, ehtiyat nüsxəni və əvəzləmə prosedurunu inventar siyahısında saxlayın.
- İnkişaf, test, istehsal, rutin əməliyyatlar, idarəetmə, yerləşdirmə və bərpa üçün ayrı açarlardan istifadə edin.
- İnsanlara və proseslərə yalnız onların roluna tələb olunan açarlara çıxış hüququ verin.
- Risk modeli tələb etdikdə yüksək dəyərli və ya idarəetmə imzalanması üçün müstəqil təsdiq tələb edin.
- Kriptoqrafik imzalayıcının hansı şəbəkə və avtorizasiya vasitəsindən istifadə edə biləcəyini qeyd edin. İmzalama xidməti bu səviyyədən kənar sorğuları rədd etməlidir.

## Uyğun Saxlama Metodunu Seçin {#choose-an-appropriate-storage-method}

Yerli inkişaf, nəzarətli testlər və ya təhlükəsiz saxlanma təhvilvermə üçün açar icazəsi məhdudlaşdırılmış fayla ixrac edilə bilər. Dəstəklənən Unix platformasında yeni bir açar qovluğu yaratmaq üçün `kagami` istifadə edin:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Üst direktoriyanın mövcud olması vacibdir. Hədəf yeni olmalı və ya artıq cari istifadəçinin sahibi olmalıdır, rejim `0700`, simvolik keçidlərdən azad olmalı və boş olmalıdır. Kagami yazır `public.key` və `private.key` rejim `0600` ilə; `--pop` həmçinin `pop.hex` yazır. Əmr, Kagami yalnız sahiblər üçün fayl sistemi qaydalarını tətbiq edə bilmədiyi platformalarda uğursuz olur.

Şəxsi açar faylı şifrələnməmiş ixracdır. Onu mənbə nəzarətində, paylaşılan qovluqlarda, qeydlərdə, biletlərdə, çatlarda və yığım artefaktlarında saxlamayın. İstehsal açarını təsdiqlənmiş mühafizə sərhədinə idxal edin, sonra isə ixracı yerləşdirmə proseduruna uyğun olaraq silin. İstehsalda inkişaf açarını yenidən istifadə etməyin.

İstehsalat üçün, tövsiyə olunan yoxlanılmış saxlama sərhədini seçin, məsələn:

- aparat təminatlı təhlükəsizlik modulu və ya aparat dəstəkli açar saxlayıcı
- əməliyyat sistemi və ya mobil açar saxlama məkanı
- təcrid olunmuş imza xidməti
- yalnız səlahiyyətli iş yükünə açar verən gizli menecer

Seçilmiş inteqrasiya bu xüsusiyyəti dəstəkləyirsə, açar materialını ixrac olunmaz halda saxlayın. Saxlama sistemi tərəfindən Iroha icazə əsasının tələb etdiyi alqoritm və imzalama əməliyyatının dəstəkləndiyini təsdiqləyin.

Saxlanılan halda şifrələmə saxlanılan nüsxəni qoruyur. Lakin icazəsiz bir proses və ya operator deşifrə edilmiş baytları əldə etdikdən sonra açarı qorumur. Hostu möhkəmləndirin, proqram təminatının icra mühitinə girişə məhdudiyyətlər qoyun və imzalama fəaliyyətini izləyin.

## İmzalama İş Axınlarını Qoruyun {#protect-signing-workflows}

- İmzalama sistemlərinə giriş üçün adlandırılmış operator kimliklərindən, güclü autentifikasiyadan və yoxlanılmış girişdən istifadə edin.
- Xam açarları komanda sətri arqumentlərindən, shell tarixçəsindən, mühit çıxışlarından, proses siyahılarından, qəza hesabatlarından və tətbiq qeydlərindən kənarda saxlayın.
- Kriptoqrafik imzalayanı yalnız tələb olunan əməliyyat üçün açın. İstifadədən sonra sessiyanı bağlayın və ya müddəti bitmiş hesab edin.
- Təsdiq etməzdən əvvəl səlahiyyətli şəxs, şəbəkə, təlimatlar, aktivlər və ödənişləri göstərin.
- Üstünlük verilmiş və ya yüksək dəyərli əməliyyatlar üçün açıq təsdiq tələb edin.
- Xam şəxsi açarları brauzer səhifələrinin və ümumi məqsədli tətbiq proseslərinin xaricində saxlayın, əgər xüsusi müştəri inteqrasiyası imzalamağı təhvil verə bilərsə.

Sadə mətnli müştəri konfiqurasiyası yalnız yerli inkişaf və idarə olunan testlər üçün uyğundur. İstehsal inteqrasiyası təsdiqlənmiş mühafizə sərhədindən imzaları əldə etməlidir. Səhmdar Iroha CLI müştəri konfiqurasiyasından şəxsi açar oxuyur və ümumi xarici kriptoqrafik imzalama xidməti adapteri təqdim etmir. Xüsusi müştərilər əməliyyat yükünün kriptoqrafik xəşini yarada və xarici kriptoqrafik imzalayıcı tərəfindən yaradılmış imzanı əlavə edə bilərlər.

## Açarları Yedəkləyin və Bərpa Edin {#back-up-and-recover-keys}

- Yalnız bərpa siyasəti ehtiyat nüsxəsini tələb edən açarları ehtiyat edin.
- Ehtiyat nüsxələri şifrələyin və onları canlı kriptoqrafik imzalayıcıdan ayrı saxlayın.
- Canlı açara tətbiq olunan eyni giriş və təsdiq nəzarətlərini ehtiyat nüsxəyə də tətbiq edin.
- Vəzifələrin ayrıla biləcəyi hallarda bərpa etimadnamələrini müstəqil nəzarət altında saxlayın.
- İstehsal açar materialını ifşa etmədən bərpa testləri.
- Hər bir ehtiyat nüsxənin yaradılmasını, əldə edilməsini, bərpasını və məhv edilməsini qeyd edin və nəzərdən keçirin.

Əlaqəsiz bir cüzdan mnemonik formatının Iroha özəl açarını təmsil edə biləcəyini fərz etməyin. Yalnız seçilmiş qoruma sistemi tərəfindən dəstəklənən və sınaqdan keçirilmiş bərpa formatından istifadə edin.

## Aşkar olunmuş və ya istifadədən çıxarılmış açarları dəyişdirin {#replace-exposed-or-retired-keys}

Hadisə baş verməzdən əvvəl əvəz hazırlayın. Prosedur aşağıdakıları müəyyən etməlidir:

1. açarın ifşa olunduğunu və ya istifadədən çıxarıldığını kim elan edə bilər
2. təsirə məruz qalmış kriptoqrafik imzalayıcının necə təcrid edildiyi
3. yeni açarın necə yaradıldığı və təsdiqlənmiş qoruma altında yerləşdirildiyi
4. hesab üçün, necə səlahiyyətli nəzarətçi dəyişdirilməsi və ya sosial bərpa əvəzləyici tək protokol-standart `AccountId` yaradır və əlaqəli vəziyyəti köçürür
5. bir node və ya şəbəkə həmkarı üçün, səlahiyyətli zəncir üzərində razılaşdırılmış konsensus açarının dövriyyəsi və ya deaktivləşdirilməsi BLS PoP, aktivləşdirmə və üst-üstə düşmə siyasəti, lokal açar konfiqurasiyası, `trusted_peers_pop` və yerləşdirmə topologiyası ilə necə əlaqələndirilir
6. asılı olan konfiqurasiyalar, tətbiqlər və operatorlar yeni `AccountId`, açıq açar və ya şəbəkə həmkarının şəxsiyyətini necə mənimsəyir
7. köhnə açarın səlahiyyət prinsipi necə silinir və onun surətləri necə arxivlənir və ya məhv edilir
8. şəbəkənin və asılı tətbiqlərin sonradan necə yoxlanıldığı

::: warning

Şifrələmə və ya yeni parol, surətlənmiş şəxsi açarı yenidən təhlükəsiz edə bilməz. Açarın açıqlanması şübhələnildikdə, açardan istifadəni dayandırın və təsdiqlənmiş əvəzləmə və ya ləğvetmə proseduruna əməl edin.

:::

Baxın [Kriptoqrafik Açarların Yaradılması](./generating-cryptographic-keys.md), [Əməliyyat Təhlükəsizliyi](./operational-security.md) və [Təhlükəsizlik Prinsipləri](./security-principles.md).
