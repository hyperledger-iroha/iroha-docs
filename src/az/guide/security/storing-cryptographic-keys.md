---
translation_locale: az
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: 168ee24e84f9225e81365658018717155476ae1508fefba5e0234e0bf6feefbd
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Kriptografik açarların saxlanması {#storing-cryptographic-keys}

Şəxsi açar onun aid olduğu səlahiyyət üçün icazə verilmiş hər bir əməliyyatı təsdiqləyə bilər. Şəxsi açarı heç vaxt paylaşmayın. Seed materialını, bərpa sirlərini, daşıyıcı tokenləri və ixrac edilmiş açar fayllarını eyni diqqətlə qoruyun.

İstehsala başlamazdan əvvəl açarların mühafizə modelini seçin. Model riskin dəyərinə, hesab nəzarətçisinin siyasətinə və yerləşdirmənin bərpa prosesinə uyğun olmalıdır.

## Mühafizə sərhədinin təyin edilməsi {#define-the-custody-boundary}

- Hər bir səlahiyyətin, açıq açarın, alqoritmin, mühitin, məqsədin, saxlayıcının, saxlama yerinin, ehtiyat nüsxəsinin və əvəzləmə prosedurunun inventarını aparın.
- İnkişaf, sınaq, istehsal, müntəzəm əməliyyatlar, idarəetmə, yerləşdirmə və bərpa üçün ayrı açarlardan istifadə edin.
- İnsanlara və proseslərə yalnız onların roluna görə tələb olunan açarları əldə etmək imkanı verin.
- Risk modelinin tələb etdiyi zaman yüksək dəyərli və ya idarəetmə imzalanması üçün müstəqil təsdiq tələb olunur.
- İmzalayanın hansı şəbəkə və səlahiyyət adından işləyə biləcəyini qeyd edin. İmzalama xidməti bu çərçivədən kənar sorğuları rədd etməlidir.

## Uyğun saxlama üsulunu seçin {#choose-an-appropriate-storage-method}

Yerli inkişaf, nəzarət edilən sınaqlar və ya təhlükəsiz mühafizə təhvili üçün açar icazələri məhdudlaşdırılmış fayla ixrac edilə bilər. Dəstəklənən Unix platformasında `kagami` ilə yeni açar kataloqu yaradın:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Ana kataloq mövcud olmalıdır. Hədəf yeni olmalı və ya artıq cari istifadəçiyə məxsus olmalı, `0700` rejimində, simvolik keçidsiz və boş olmalıdır. Kagami `public.key` və `private.key` fayllarını `0600` rejimində yazır; `--pop` əlavə olaraq `pop.hex` yazır. Kagami yalnız sahibə aid fayl sistemi qaydalarını tətbiq edə bilməyən platformalarda əmr uğursuz olur.

Şəxsi açar faylı şifrələnməmiş ixracdır. Onu mənbə koduna nəzarət sistemindən, paylaşılan qovluqlardan, jurnallardan, biletlərdən, çatdan və qurma artefaktlarından uzaq saxlayın. İstehsal açarını təsdiqlənmiş mühafizə sərhədinə idxal edin, sonra ixrac faylını yerləşdirmə proseduruna uyğun silin. İnkişaf açarını istehsalda təkrar istifadə etməyin.

İstehsalat üçün aşağıdakı kimi yoxlanılmış saxlama sərhədi üstünlük verilir:

- Hardver təhlükəsizlik modülü və ya hardverlə dəstəklənən bir açar mağazası
- bir əməliyyat sistemi və ya mobil açar saxlama
- ayrı bir imza xidməti
- yalnız icazə verilən iş yükünə açar verən gizli menecer

Seçilmiş inteqrasiya bu xüsusiyyəti dəstəkləyirsə, açar materialını ixrac olunmayan formada saxlayın. Mühafizə sisteminin Iroha səlahiyyəti üçün tələb olunan alqoritmi və imzalama əməliyyatını dəstəklədiyini təsdiqləyin.

Saxlanmış vəziyyətdə şifrələmə yalnız saxlanılan nüsxəni qoruyur. İcazəsiz proses və ya operator şifrəsi açılmış baytları əldə etdikdən sonra açarı qorumur. Hostu sərtləşdirin, icra vaxtı girişini məhdudlaşdırın və imzalama fəaliyyətini izləyin.

## İmzalama iş axınlarını qoruyun {#protect-signing-workflows}

- Adlı operator kimliklərindən, güclü təsdiqlənmədən və imzalama sistemlərinə audit edilmiş girişlərdən istifadə edin.
- Xam açarları əmr sətri arqumentlərindən, shell tarixçəsindən, mühit dump-larından, proses siyahılarından, qəza hesabatlarından və tətbiq jurnallarından uzaq saxlayın.
- İmzalayanı yalnız tələb olunan əməliyyat üçün kiliddən çıxarın. İstifadədən sonra sessiyanı bağlayın və ya bitirin.
- Rəsmiləşdirmədən əvvəl səlahiyyəti, şəbəkəni, təlimatları, aktivləri və ödənişləri göstərin.
- İmtiyazlı və ya yüksək dəyərli əməliyyatlar üçün açıq təsdiq tələb edin.
- Fərdiləşdirilmiş müştəri inteqrasiyası imzalamağı həvalə edə bilirsə, xam şəxsi açarları brauzer səhifələrindən və ümumi təyinatlı tətbiq proseslərindən kənarda saxlayın.

Sadə mətnli müştəri konfiqurasiyası yalnız yerli inkişaf və nəzarət edilən sınaqlar üçün uyğundur. İstehsal inteqrasiyası imzaları təsdiqlənmiş mühafizə sərhədindən almalıdır. Standart Iroha CLI şəxsi açarı müştəri konfiqurasiyasından oxuyur və ümumi xarici imzalayan adapteri təqdim etmir. Fərdiləşdirilmiş müştərilər tranzaksiyanın payload heşini qura və xarici imzalayanın yaratdığı imzanı əlavə edə bilər.

## Açarların ehtiyat nüsxəsini yaradın və onları bərpa edin {#back-up-and-recover-keys}

- Yalnız bərpa siyasəti ehtiyat nüsxə tələb edən açarların nüsxəsini yaradın.
- Ehtiyat nüsxələri şifrələyin və aktiv imzalayandan ayrı saxlayın.
- Ehtiyat nüsxəyə aktiv açarla eyni giriş və təsdiq nəzarətlərini tətbiq edin.
- Vəzifələrin ayrılması tələb olunursa, bərpa etimadnamələrini müstəqil mühafizə altında saxlayın.
- İstehsal açarının materialını üzə çıxarmadan bərpanı sınaqdan keçirin.
- Hər ehtiyat nüsxənin yaradılmasını, ona girişi, bərpasını və məhv edilməsini qeydə alın və nəzərdən keçirin.

Əlaqəsi olmayan bir cüzdan mnemonik formatının Iroha xüsusi açarı təmsil edə biləcəyini düşünməyin. Yalnız seçilmiş saxlama sistemi tərəfindən dəstəklənmiş və sınanmış bərpa formatından istifadə edin.

## İfşa olunmuş və ya istifadədən çıxarılmış açarları əvəz edin {#replace-exposed-or-retired-keys}

Hadisə baş verməzdən əvvəl əvəzləməyə hazırlaşın. Prosedur bunları müəyyən etməlidir:

1. açarı kimin ifşa olunmuş və ya istifadədən çıxarılmış elan edə biləcəyi
2. təsirlənmiş imzalayanın necə təcrid ediləcəyi
3. yeni açarın necə yaradılacağı və təsdiqlənmiş mühafizə altına veriləcəyi
4. hesab üçün səlahiyyətli nəzarətçi əvəzlənməsinin və ya sosial bərpanın yeni kanonik `AccountId` yaradaraq əlaqəli vəziyyəti necə köçürəcəyi
5. node və ya peer üçün səlahiyyətli on-chain konsensus açarı rotasiyasının və ya söndürülməsinin BLS PoP, aktivləşdirmə və üst-üstə düşmə siyasəti, yerli açar konfiqurasiyası, `trusted_peers_pop` və yerləşdirmə topologiyası ilə necə əlaqələndiriləcəyi
6. asılı konfiqurasiyaların, tətbiqlərin və operatorların yeni `AccountId`, açıq açar və ya peer kimliyini necə qəbul edəcəyi
7. köhnə açarın səlahiyyətinin necə götürüləcəyi və onun nüsxələrinin necə arxivləşdiriləcəyi və ya məhv ediləcəyi
8. bundan sonra şəbəkənin və asılı tətbiqlərin necə yoxlanacağı

::: warning

Şifrələmə və ya yeni parol kopyalanmış şəxsi açarı yenidən təhlükəsiz edə bilməz. İfşa şübhəsi varsa, açardan istifadəni dayandırın və təsdiqlənmiş əvəzləmə və ya ləğv prosedurunu izləyin.

:::

Bax [Kriptografik açarların yaradılması](./generating-cryptographic-keys.md), [Əməliyyat təhlükəsizliyi](./operational-security.md) və [Mühafizə prinsipləri ](./security-principles.md).
