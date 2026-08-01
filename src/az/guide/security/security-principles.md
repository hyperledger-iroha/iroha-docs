---
translation_locale: az
translation_source: /guide/security/security-principles.md
translation_source_hash: 20139011c663a0bca6f9e486ef81f698370c34f8f02319317805b0d1dfb049c7
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Təhlükəsizlik prinsipləri {#security-principles}

Iroha reyestri imzalanmış təlimatları yoxlayır və icazələri tətbiq edir. O, şəxsi açarları, hostları, tətbiqləri, operator iş stansiyalarını və ya idarəetmə prosedurlarını qorumur. Bu sistemlərin qorunmasını yerləşdirmə təmin etməlidir.

Iroha şəbəkəsini layihələndirərkən və istismar edərkən bu prinsiplərdən istifadə edin.

## Səlahiyyəti təhlükəsizlik sərhədi kimi qəbul edin {#treat-authority-as-a-security-boundary}

- Şəxsi açarı idarə edən şəxs və ya proses həmin açara verilmiş səlahiyyətlə hərəkət edə bilər.
- Hər bir mühitə və əməliyyat roluna ayrıca səlahiyyət verin.
- İstehsal və bərpa açarlarını gündəlik inkişaf və sınaq etimadnamələrindən ayrı saxlayın.
- Hər bir səlahiyyətin kimə məxsus olduğunu, onun imzalayıcısının harada saxlandığını və necə əvəz və ya ləğv edilə biləcəyini qeyd edin.

Baxın: [Açıq açarlı kriptoqrafiya](./public-key-cryptography.md) və [Kriptoqrafik açarların saxlanması](./storing-cryptographic-keys.md).

## Ən az imtiyazdan istifadə edin {#apply-least-privilege}

- Yalnız rol üçün lazım olan Iroha icazələrini, host girişini və şəbəkə girişini verin.
- Gündəlik tranzaksiyaların imzalanmasını idarəetmə, yerləşdirmə və bərpa səlahiyyətlərindən ayırın.
- Validator üzvlüyünə, imtiyazlı icazələrə və ya yüksək dəyərli aktivlərə təsir edə biləcək dəyişikliklər üçün müstəqil təsdiq tələb edin.
- Rol dəyişikliklərindən sonra girişləri nəzərdən keçirin və artıq lazım olmayan girişləri ləğv edin.

## Qoruyucu qatlardan istifadə edin {#use-layers-of-protection}

- İmzalayıcıları, tətbiqləri, əməliyyat sistemlərini, şəbəkələri və fiziki girişi qoruyun. Yalnız bir qoruma vasitəsinə arxalanmayın.
- Yalnız yerləşdirmənin tələb etdiyi Torii, peer qovşağı, monitorinq və tətbiq marşrutlarını açın.
- İnzibati giriş və həssas məlumatlar üçün autentifikasiya edilmiş və şifrələnmiş kanallardan istifadə edin.
- Sistemlərə təhlükəsizlik yeniləmələrini vaxtında tətbiq edin və yerləşdirmənin istifadə etmədiyi xidmətləri söndürün.
- Sirləri mənbə kodu idarəetmə sistemindən, əmr sətirlərindən, jurnallardan, biletlərdən, söhbətlərdən və ictimai sənədlərdən kənarda saxlayın.

## Yerləşdirmələri nəzərdən keçirilə bilən edin {#make-deployments-reviewable}

- Gizli olmayan konfiqurasiyanı və yerləşdirmə avtomatlaşdırmasını versiya nəzarətində saxlayın.
- Binar fayllarda, konfiqurasiyada, genezis materialında, validator üzvlüyündə, icazələrdə və ictimai marşrutlarda edilən dəyişiklikləri nəzərdən keçirin.
- Yerləşdirmədən əvvəl buraxılış artefaktlarını yoxlayın. Təsdiqlənmiş versiyaları və heşləri qeyd edin.
- İstehsalda işləyəcək binar fayl və konfiqurasiyanın dəqiq kombinasiyasını sınaqdan keçirin.
- Şəbəkənin deterministik davranışını qoruyun. Aparat sürətləndirilməsi peer qovşaqlarına görünən nəticələri dəyişdirməməlidir.

## Monitorinq aparın və sübutları qoruyun {#monitor-and-preserve-evidence}

- Peer qovşaqlarının vəziyyətini, konsensusun gedişini, icazə dəyişikliklərini, imtiyazlı təlimatları, autentifikasiya uğursuzluqlarını və gözlənilməz konfiqurasiya dəyişikliklərini izləyin.
- Vacib xəbərdarlıqları təsirlənmiş hostdan asılı olmayan sistemə göndərin.
- Müvafiq jurnalları, reyestr istinadlarını, konfiqurasiya vəziyyətinin surətlərini və tranzaksiya heşlərini etibarlı vaxt damğaları ilə qoruyun.
- Çatışmayan monitorinq məlumatlarını araşdırma tələb edən əməliyyat problemi kimi qəbul edin.

## İşə salmadan əvvəl bərpaya hazırlaşın {#prepare-recovery-before-launch}

- Kimlərin insident elan edə biləcəyini və kimlərin bərpa tədbirlərini təsdiq edə biləcəyini müəyyənləşdirin.
- Yedəkləmə, bərpa, açarın dəyişdirilməsi, icazənin ləğvi və peer qovşağının bərpası prosedurlarını sınaqdan keçirin.
- İnsident zamanı etibarlı buraxılış artefaktlarını, konfiqurasiyanı, genezis qeydlərini və inventarları əlçatan saxlayın.
- Əvvəlcə oxuma əməliyyatlarını və monitorinqi bərpa edin. Yazma əməliyyatlarını yalnız bərpa edilmiş şəbəkə və asılı tətbiqlər yoxlamalardan keçdikdən sonra yenidən başladın.
- Hər insidenti nəzərdən keçirin və nəzarət vasitələrini, avtomatlaşdırmanı və təlimləri yeniləyin.

::: warning

Reyestr əməliyyatları geri qaytarılmaz ola bilər. Bərpa və ya idarəetmə tranzaksiyası göndərməzdən əvvəl əvvəlcədən nəzərdən keçirilmiş prosedurlardan istifadə edin və tələb olunan təsdiqləri alın.

:::

[Əməliyyat təhlükəsizliyi](./operational-security.md) və [Buraxılışa hazırlıq](../best-practices/release-readiness.md) ilə davam edin.
