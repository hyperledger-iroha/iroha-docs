---
translation_locale: az
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: fd8bca2c8909c6dfead2e2f7f4f4711ab80339a98b7e227c02aa3ff965380718
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# İctimai açar kriptografiyası {#public-key-cryptography}

İctimai açar kriptografiyası təhlükəsiz onlayn əməliyyatlar, şifrələnmiş e-poçt rabitəsi və s. kimi fəaliyyətlərə imkan verən etibarlı ünsiyyət və məlumatların qorunması üçün vasitələr təmin edir.

İctimai açar kriptografiyası onlayn şəbəkələr vasitəsilə məlumatların ötürülməsi üçün yüksək təhlükəsiz bir üsul yaratmaq üçün bir cüt kriptografik açar istifadə edir.

Xüsusi bir açıdan ictimai açar etmək asandır, əksinə isə çətin və mümkün deyil. Bu işləri təhlükəsiz saxlayır. İctimai açarı risk etmədən sərbəst bölüşə bilərsiniz, bu da etibarlı qalır.

## Şifrələmə və imzalar {#encryption-and-signatures}

İctimai açar kriptografiyası fərdlərə yalnız müvafiq özəl açarı olan nəzərdə tutulmuş alıcı tərəfindən kəşf edilə bilən şifrələnmiş mesajlar və məlumatlar göndərməyə imkan verir. Başqa sözlə, ictimai açar bir kilid kimi fəaliyyət göstərir və özəl açar şifrələnmiş məlumatları açan xüsusi bir açar kimi xidmət edir.

Bu şifrələmə prosesi yalnız həssas informasiyanın məxfiliyini təmin etməklə yanaşı, göndəricinin etibarlılığı. Göndəricinin şəxsi açarı ilə ictimai açarı birləşdirməklə rəqəmsal imzalanma yaradılır. Bu imza göndəricinin kimliyini və ötürülən məlumatların etibarlılığını təsdiqləyən rəqəmsal təsdiq möhürü kimi xidmət edir. İctimai açarınız olan hər kəs, əməliyyatı başlayan şəxs şəxsi açarınızı istifadə etdiyini təsdiq edə bilər.

## Müştəri tərəfindəki açarlar {#keys-on-the-client-side}

Hər bir əməliyyat hesabı orqanı tərəfindən imzalanmalıdır. bu orqan üçün xüsusi açar və ya nəzarət materialları gizli saxlanılmalıdır, belə ki müştəri proqramı təhlükəsiz saxlama və imzalanma üçün məsuliyyət daşıyır.

::: xəbərdarlıq

Bütün müştərilər fərqlidir, lakin sadə mətn müştəri konfigüratsiyası yalnız inkişaf və idarə olunan test şəbəkələri üçün uygundur. İstehsalat inteqrasiyalarında gizli bir menecer, aparat tərəfindən dəstəklənmiş açar saxlama və ya digər audit edilmiş imzalanma sərhədi istifadə edilməlidir.

:::

Yeni hesabın qeydiyyatı Ed25519 açar cütü kimi nəzarətçi materialının yaradılmasını tələb edir, və ictimai hissəni şəbəkəyə təqdim etmək. Bu hesabdan olan sonrakı əməliyyatlar uyğun xüsusi açar və ya konfiqurasiya edilmiş hesab nəzarətçisi siyasəti ilə imzalanmalıdır.

İctimai açar kriptografiyasının səmərəli işləməsi üçün yeni bir açar təyin etmək lazım olduqda yenidən istifadədən çəkinin. Bunu etməyinizə mane olan heç bir şey olmasa da, ictimai açarlar ictimaidir, yəni hücumçu eyni ictimai anahtarın istifadə edildiyini görürsə, Onlar özəl açarların da eyni olduğunu bilirlər.

Xüsusi açarlar şifrələrdən bir az fərqli prinsiplərdə işləsə də, onları mümkün qədər təsadüfi etmək üçün məsləhət tətbiq olunur.
