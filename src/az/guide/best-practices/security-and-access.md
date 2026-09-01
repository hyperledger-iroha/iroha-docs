---
translation_locale: az
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Təhlükəsizlik və Giriş {#security-and-access}

Iroha üzrə təhlükəsizlik təcrübəsi dar icazə prinsipi, idarə olunan açar saxlanması, açıq şəbəkə açıqlığı və audit edilə bilən dəyişikliklər əsasında qurulmalıdır.

## Açarın saxlanması {#key-custody}

- İstehsal səviyyəli entropiyaya malik istehsal açarları yaradın və şəxsi açarları repozitoriyalardan, məsələ izləyicilərindən, istəklərdən, söhbət qeydlərindən və CI çıxışından kənarda saxlayın.
- Müştərilər, şəbəkə həmkarları, blokçeyn genesis imzalaması, təsdiqləyicilər, ödəniş sponsoru və texniki hesablar üçün ayrı açar materialından istifadə edin.
- Açarları yazılı prosesə uyğun fırladın və canlı hadisədən əvvəl bərpa etməyi məşq edin.
- Yüksək dəyərli imzalama açarları üçün, yerləşdirmə riski bunu əsaslandırdıqda, aparat dəstəyi ilə və ya əməliyyat sistemi dəstəyi ilə saxlamadan istifadə edin.

Baxın [Kriptoqrafik Açarların Yaradılması](/az/guide/security/generating-cryptographic-keys.md) və [Kriptoqrafik Açarların Saxlanması](/az/guide/security/storing-cryptographic-keys.md).

## İcazələr {#permissions}

- İş axışını dəstəkləyən ən kiçik icazə tokenini və ya rolu verin.
- Xidmətlər, tetikleyicilər, agentlər və avtomatlaşdırma üçün xüsusi texniki hesabları üstün tutun. Uzunmüddətli avtomatlaşdırmanı şəxsi operator hesabı vasitəsilə işlətməkdən çəkinin.
- İstehsal buraxılışından əvvəl şəbəkə bərabərinin idarə olunması, metadata dəyişiklikləri, buraxılış, məhv etmə, tetik qeydiyyatı, icraçı dəyişiklikləri və SORA/Nexus idarəçiliyi üçün icazələri nəzərdən keçirin.
- Müvəqqəti icazələri onlara ehtiyac olan texniki xidmət pəncərəsindən və ya köçürmədən sonra ləğv edin.

Baxın [İcazələr](/az/blockchain/permissions.md) və [İcazə Jetonları](/az/reference/permissions.md).

## Şəbəkə İfşası {#network-exposure}

- Mühitə uyğun olaraq həmyaşıdlarla, Torii, telemetriya və operator marşrutlarını məhdudlaşdırın. İctimai oxuma girişi ictimai yazma və ya operator girişini ifadə etmir.
- Quraşdırma üçün uyğun olan yerlərdə VPNs, firewall-lar, tərs proksi serverlər, TLS dayandırılması və sürət məhdudiyyətlərindən istifadə edin.
- Əsas autentifikasiya məlumatlarını, proksi tokenlərini və göndərilən başlıqları mənbə nəzarətində saxlanılan konfiqurasiyadan kənarda saxlayın.
- Səlahiyyətsiz müştərilərin məhdudlaşdırılmış marşrutlara çata bilmədiyini yoxlayın.

Baxın [Virtual Özəl Şəbəkələr](/az/guide/security/vpn.md) və [Torii API son nöqtələr](/az/reference/torii-endpoints.md).

## Fırıldaqçılıq və Sui-istifadə Nəzarəti {#fraud-and-abuse-monitoring}

- Blockchain jurnal hadisələrini və əməliyyat siqnallarını gözlənilməz aktiv hərəkətləri, icazə verilmələri, trigger dəyişikliklərini, şəbəkə tərəfdaş dəyişikliklərini və təkrar rədd edilmiş əməliyyatları izləmək üçün monitorinq edin.
- Əməliyyat kriptoqrafik xəşləri, blok hündürlüklərini, hadisə qeydlərini, jurnalları və vəziyyət şəkillərini qoruyun.
- Marşrut xəbərdarlıqları, təsirlənmiş aktivlərdən və ya iş axınlarından məsul olan təhlükəsizlik, əməliyyat və iş sahiblərinə göndərilir.

Bax [Fırıldaqçılığın Monitorinqi](/az/guide/security/fraud-monitoring.md).

## Agent və Avtomatlaşdırma Təhlükəsizlik Qaydaları {#agent-and-automation-guardrails}

- Avtomatlaşdırmaya yalnız oxuma icazələri ilə başlayın və yazma səlahiyyəti əsasını yalnız iş axını nəzərdən keçirildikdən sonra əlavə edin.
- Canlı şəbəkə dəyişiklikləri üçün açıq insan təsdiqi tələb olunur, istisna olaraq avtomatlaşdırma qəsdən yerləşdirilmiş istehsal xidməti olduqda.
- Şəxsi açarları agent istemlərinə göstərməyin. Məxfiləri mühit dəyişənlərindən, açar kirayəçilərindən, aparat kriptoqrafik imzalayıcılarından və ya nəzərə alınmayan konfiqurasiya fayllarından yükləyən yerli koddan istifadə edin.
- Auditləri dəstəkləyəcək şəkildə, gizli material sızdırmadan loqavtomatlaşdırma qərarlarını qeyd edin.
