---
translation_locale: az
translation_source: /guide/security/password-security.md
translation_source_hash: 39d03f2fa20a21745056353be8f132310fcf9cde051a4fb6528f6257ddc3158a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Şifrə təhlükəsizliyi {#password-security}

Blockchain təhlükəsizliyi sahəsində şifrələrin qorunması önəmlidir. Məlumatlarınızın və onun təmsil etdiyi hər şeyin icazəsiz girişlərə qarşı davamlı olmasını təmin etmək üçün, gəlin şifrə təhlükəsizliyinin nüanslarını dərindən öyrənək.

## Şifrə gücü {#password-strength}

Çox güman ki, siz daha əvvəl güclü bir şifrəni necə hazırlayacağınız barədə tövsiyələrlə qarşılaşmış ola bilərsiniz. Bunlar minimum şifrə uzunluğu, xüsusi xarakterlərin əlavə edilməsi və s. kimi məsləhətləri əhatə edə bilərlər. Bu cür tövsiyələr entropiyaya bağlı olan şifrənizin gücünü artırmaq məqsədi daşıyır. şifrənin təsadüfiliyi.

Güclü şifrə yüksək entropiyaya malik olan bir şifrədir.

Bir şifrənin entropiyasını hesablamaq üçün Entropiya formulasına əməl edə bilərik:

::: tip Entropiya formulu

$L$  Şifrə uzunluğu; şifrədəki simvolların sayı.\ $S$  Xarakter dəsti; unikallı mümkün simvollar qrupunun ölçüsü.\ $S^L$  Mümkün kombinasiyaların sayı.

$$Entropy=log_2(S^L)$$

Nəticədə alınan rəqəm bir şifrədəki entropiya bitlərinin miqdarıdır. Nömrə nə qədər yüksək olsa, şifrəni qırmaq o qədər çətin olur.

Entropiya dəyərini bilməklə, sözügedən entropiya ilə şifrəni zərərli şəkildə məcbur etmək üçün tələb olunan cəhdlərin miqdarını aşağıdakı formuladan istifadə edərək əldə etmək olar:

$$S^L=2^Entropy$$

Bir şifrənin entropiyasının nə qədər yüksək olması lazım olduğuna dair universal cavab yoxdur. Maliyyə təşkilatları üçün şifrələrinin entropiyasını `64` ilə `127` bitləri arasında saxlamaq məsləhət görülür (`128` və ya daha çox bit ümumiyyətlə həddindən artıq öldürülmə hesab olunur). Ancaq nəzərə alın ki, <abbr title="Graphics Processing Unit">GPU</abbr>-lər davamlı olaraq inkişaf edir və şifrə qırılması üçün tələb olunan vaxt zamanla azalır.

:::

Entropiyaya əsasən aşağıdakı iki nümunəni müqayisə edək:

  1. Müasir ingilis əlifbasının yalnız kiçik hərflərindən istifadə edən xarakter dəstindən ibarət 16 xarakterli şifrə təxminən 43 sekstillion ($43*10^21$) mümkün birləşmə verir.

$$Entropy=log_2(26^{16})=log_2(43,608,742,899,428,874,059,776)=75.20703...$$

  2. 16 xarakterli şifrə, böyük hərflər və xüsusi simvollar da daxil olmaqla 96 xarakterli əlamətlərlə genişləndirilib. Mümkün birləşmələrin sayını 52 milyona çatdırır ($52*10^30$), entropiyanı əhəmiyyətli dərəcədə yaxşılaşdırır.

$$Entropy=log_2(96^{16})=log_2(52,040,292,466,647,269,602,037,015,248,896)=105.35940... $$

Göründüyü kimi, yalnız 26 simvoldan 96 simvolu genişləndirməklə zərərli bir tərəfin zərərli güc tətbiq etməsi üçün lazım ola biləcək mümkün kombinasiyaların sayı $1.1933*10^9$ dəfə genişləndi.

Əlavə olaraq şifrənin uzunluğunu artırmaq, mümkün birləşmələrin sayını daha da artıracaq və bu səbəbdən şifrənin entropiyasının gücünü artıracaq.

Bununla birlikdə, mürəkkəbliklərlə mübarizə etmək əvəzinə [KeePassXC](https://keepassxc.org/) kimi bir şifrə idarəetmə proqramından istifadə etməyi məsləhət görürük. (Daha ətraflı məlumat üçün baxın [Password Manager Proqramını əlavə etmək ](./storing-cryptographic-keys.md#adding-a-password-manager-program) və [Konfiqurasiya etmək KeePassXC](./storing-cryptographic-keys.md#configuring-keepassxc)) şəxsi şifrələri yaratmaq və təhlükəsiz saxlamaq üçün.

::: xəsarət

Bəzi veb saytlar şifrələrin maksimum mümkün entropiyasını məhdudlaşdırır, yəni ən çox şifrə uzunluğunu və ya qəbul edilmiş xarakterlər dəstini və ya hər ikisini də məhdudlaşdıra bilər.

Bu saytlardan istifadə edərkən bunu nəzərə alın və şifrələrinizi mütəmadi olaraq yeniləyin.

:::

## Şifrə zəifliyi {#password-vulnerabilities}

Şifrələr ümumiyyətlə sözlüklərlə birlikdə güclü GPUs və ya bütün imkanlar vasitəsilə tam təkrarlama istifadə edərək icra edilən kobud güc hücumlarının qurbanı ola bilərlər. Belə cəhdlərin qarşısını almaq üçün şəxsi məlumatlardan, məsələn, doğum günlərindən, ünvanlarından, telefon nömrələrindən və sosial müdafiə nömrələrindən asılı olmayan xüsusi bir şifrə yazın.

Bəs müasir şifrəni aşkar etmək nə qədər çətindir?

Belə bir quruluşla. [Kevin Mitnick](https://en.wikipedia.org/wiki/Kevin_Mitnick)Bu ... [klaster quruluşu](https://twitter.com/kevinmitnick/status/1649421434899275778?s=20) mənzil 24 NVIDIA® GeForce RTX 4090'lar və 6 NVIDIA® GeForce RTX 2080-ci illərdə, hamısı qaçır. [Hashtopolis](https://github.com/hashtopolis) proqramı, yalnız yarım ayda bir il çəkməli olan şifrələri qırırdı.

Lakin, gəlin indi onu tək ilə müqayisə edək RTX 4090, 300 ilə qədər işlənə bilən <abbr title="Hashes per second">H/s</abbr> istifadə edərək [`NTLM`](https://www.tarlogic.com/cybersecurity-glossary/ntlm-hash) və 200 <abbr title="Hashes per second">H/s</abbr> istifadə edərək [`bcrypt`](https://en.wikipedia.org/wiki/Bcrypt), aşağıda göstərildiyi kimi [bu tvit](https://twitter.com/Chick3nman512/status/1580712040179826688).

Keçmiş entropiya hesablamalarımızın bir uzantısı olaraq, indi aşağıdakı proqnozlaşdırılmış qırılma vaxtlarını nəzərdən keçirək:

  1. Onlar var $31,540,000$ Ən pis şərtdən asılı olaraq, `NTLM`, sürətində $300*10^9$ <abbr title="Hashes per second">H/s</abbr>, Bu, tək bir şey tələb edəcək. RTX təxminən 4090 $4,608.83$ Müasir ingilis əlifbasının 26 hərfindən ibarət bir simvol dəstində 16 xarakterli şifrəni aşkar etmək üçün illərdir.

  2. Əgər `NTLM` əvəzinə `bcrypt` istifadə etsək, bu səbəbdən təkrarlanma sürətini $200*10^3$ <abbr title="Hashes per second">H/s</abbr> qədər azaltaraq, eyni zamanda böyük hərflər və xüsusi simvollar da daxil olmaqla xarakter dəstini 96-a genişləndirərkən, çatışmanın vaxtı təxminən $8,249,887,835,549,662,270.456$ illərə yüksələcək. Kainatın yaşından xeyli çoxdur.

Beləliklə, sadəcə daha yüksək entropiyanı seçmək bir şifrəni başa düşülməz rəqəmlərə çatdırmaq üçün lazım olan vaxtı artırır. Bəli, proses çoxsaylı GPUs istifadə edərək sürətləndirilə bilər, lakin bu üsul [XKCD yanaşması ilə müqayisədə zəifləyir](https://xkcd.com/538/) .

Qeyd etmək vacibdir ki, yüksək entropiyaya çatmaq üçün geniş bir xarakter dəstinin həmişə lazım olmaması. Bu, çox sözlü şifrələr və ya xüsusilə uzun cümlələr istifadə edərək əldə edilə bilər. [XKCD komiks](https://xkcd.com/936/) bu konsepsiyanı açıq şəkildə təsvir edir.

::: xəbərdarlıq

Şifrənizi hər yerdə yazmaqdan çəkinin. Şifrənizin bərpası ifadəsini etibarlı şəkildə saxlayın. Əgər ifadə çox uzundursa, onu yaza bilərsiniz və sonra oxuya və yazdıra biləcəyinizə əmin ola bilərsiniz. Fırzın fiziki nüsxəsini təhlükəsiz bir yerdə və / ya konteynerdə saxlayın.

:::
