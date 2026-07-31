---
translation_locale: az
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Təhlükəsizlik və giriş {#security-and-access}

Iroha təhlükəsizlik təcrübəsi məhdud səlahiyyətlərə, nəzarət edilən açarların saxlanılmasına, açıq şəbəkə məruz qalmasına və yoxlana bilən dəyişikliklərə əsaslanmalıdır.

## Mütəxəssislər {#key-custody}

- İstehsalat dərəcəsi entropiyası olan istehsal açarlarını istehsal edin və xüsusi açarları anbarların xaricində saxlayın, izləyicilər, tələbatlar, söhbət qeydləri və CI çıxışı yayın.
- Müştərilər, həmyaşıdlar, genesis imzalanması, təsdiqçilər, ödəniş sponsorları və texniki hesablar üçün ayrı bir açar materialdan istifadə edin.
- Bir yazılı prosesə uyğun olaraq açarları fırlatın və canlı hadisədən əvvəl bərpa təcrübəsi edin.
- Yüksək dəyərli imza açarları üçün donanımlı və ya əməliyyat sistemi ilə dəstəklənmiş saxlama istifadə edin, əgər tətbiq riski bunu əsaslandırırsa.

Bax [Kriptografik açarların yaradılması](/az/guide/security/generating-cryptographic-keys.md) və [Storing Cryptographic Keys](/az/guide/security/storing-cryptographic-keys.md).

## İzinlər {#permissions}

- İş axınına dəstək verən ən kiçik icazə simvolu və ya rolu verin.
- Xidmətlər, triggerlər, agentlər və avtomatlaşdırma üçün xüsusi texniki hesabları üstün tutun.
- Tərəfdaş idarəetməsinə, metadata mutasiyasına, mintəməyə, yandırmaya, tetikləyici qeydiyyatına, icraçı dəyişikliyinə və SORA/Nexus idarəetməyə icazələri istehsalın başlanmasından əvvəl nəzərdən keçirin.
- Müvəqqəti icazələri saxlama pəncərəsindən sonra və ya onları tələb edən köçürülmədən sonra ləğv edin.

Bax [İzinlər](/az/blockchain/permissions.md) və [İzin simvolları ](/az/reference/permissions.md).

## Şəbəkə məruz qalması {#network-exposure}

- Ətraf mühitə uyğun olaraq peer-to-peer, Torii, telemetriya və operator marşrutlarını məhdudlaşdırın.
- VPNs, yanğın divarları, geri proxylər, TLS ləğvləri və tətbiq üçün lazımi hallarda dərəcə limitlərindən istifadə edin.
- Əsas müəllif təsnifatlarını, proxy tokenlərini və ötürülmüş başlıqları etibarlı konfiqurasiyalardan kənar tutun.
- Rəsmi olmayan müştərilərin məhdud marşrutlara çatmadığını yoxlayın.

[Virtual Xüsusi Şəbəkələr](/az/guide/security/vpn.md) və [ Torii Son nöqtələri ](/az/reference/torii-endpoints.md) bax.

## Xəyanətkarlıq və sui-istifadənin nəzarəti {#fraud-and-abuse-monitoring}

- Başlıq hadisələrini və gözlənilməz aktivlərin hərəkəti, icazə verilməsi, başlatma dəyişiklikləri, həmyaşıd dəyişiklikləri və təkrar rədd edilmiş əməliyyatlar üçün əməliyyat siqnallarını izləyin.
- Əməliyyat həşləri, blok hündürlüyü, hadisə qeydləri, jurnallar və status sürətləri ilə sübutları saxlayın.
- Təhlükəsizlik, əməliyyatlar və təsirlənmiş aktivlər və ya iş axınları üçün məsuliyyət daşıyan sahibkarlara yol xəbərdarlıqları.

Bax [Xalçaqmalçılığın nəzarəti ](/az/guide/security/fraud-monitoring.md).

## Agent və avtomatlaşdırma qoruyucuları {#agent-and-automation-guardrails}

- Otomatlaşdırma yalnız oxunma icazələri ilə başlayın və iş axını nəzərdən keçildikdən sonra yazma səlahiyyətini əlavə edin.
- Otomatlaşdırma məqsədyönlü istehsal xidməti olmadığı təqdirdə canlı şəbəkə mutasiyaları üçün açıq insan təsdiqini tələb etmək.
- Xüsusi açarları agent təzyiqlərinə açıqlamayın. Ətraf mühit dəyişikliklərindən, açar silsilələrindən, aparat imzalılarından və ya qurğu fayllarından gizli məlumatlar yükləyən yerli koddan istifadə edin.
- Məlumatların gizli materialı sızdırılmadan yoxlamaları dəstəkləyən bir şəkildə qeyd avtomatizasiyası qərarları.
