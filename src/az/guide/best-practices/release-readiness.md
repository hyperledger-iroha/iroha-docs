---
translation_locale: az
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 75fccfa00f1582a8081df3e00331eee7ab21c108c8727a9d73129738cc4940cb
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-source-title-amendment
---
# Buraxılış Hazırlığı {#release-readiness}

Bir Iroha tətbiqini və ya şəbəkə dəyişikliklərini təşviq etməzdən əvvəl müvafiq riski aşkar edə biləcək ən kiçik mühitdə davranışı sübut edin, sonra paylaşılmış test şəbəkəsi və istehsal qapılarından diqqətlə keçin.

## Localnet Qapısı {#localnet-gate}

- Eyni Iroha trayla və ən yaxın praktik doğrulayıcı sayı ilə istifadə olunacaq müvəqqəti lokal şəbəkəni işə salın.
- Əməliyyat qurucuları, sorğu təhlili, rədd etmə idarəsi və konfiqurasiya yükləməsi üçün vahid testləri işə salın.
- Daha sonra tətbiqin istifadə edəcəyi eyni SDK və ya CLI formasından keçən ən kiçik uğurlu oxu və yazı yollarını məşq edin.
- Gözlənilən əməliyyat kriptoqrafik xəşlərini, statusları, hadisələri və vəziyyət oxumalarını test sənədlərində qeyd edin.

Baxın [Başlat Iroha 3](/az/get-started/launch-iroha.md) və [SDK Dərsliklər](/az/guide/tutorials/).

## Paylaşılan Testnet Qapısı {#shared-testnet-gate}

- son nöqtə davranışı, ödəniş haqları, hesabın maliyyələşdirilməsi, gecikmə və əməliyyat məşqləri üçün Taira və ya başqa bir paylaşılan testnet-dən istifadə edin.
- Canlı testnet yazılarını könüllü saxlayın ki, adi test işləri şəbəkənin mövcudluğuna bağlı olmayacaq və testnet vəsaitlərini xərcləməyəcək.
- Hər bir canlı test əməliyyatını təqdim etməzdən əvvəl kriptoqrafik imzaçının maliyyələşdirilməsini, ödəniş aktivinin metadatasını, icazə verən əsas icazələrini və gözlənilən vəziyyəti təsdiqləyin.
- Terminal vəziyyət üçün gözləyin, sonra əldə olunan vəziyyəti yalnız oxumaq üçün sorğu ilə yoxlayın.

[SORA Nexus üzərində qurun: Taira və Minamoto](/az/get-started/sora-nexus-dataspaces.md) bölməsinə baxın.

## Əsas şəbəkə və ya İstehsal Qapısı {#mainnet-or-production-gate}

- İstehsal mühiti üçün ayrıca imzalayıcılar, maliyyələşdirmə, domenlər və konfiqurasiya yolları istifadə edin. Test şəbəkəsinin açarlarını və ya test vəsaiti paylama xidməti ilə bağlı fərziyyələri istehsal mühitinə keçirməyin.
- Tələb olunan çarpaz-SDK ssenariləri [Uyğunluq Matrisi](/az/reference/compatibility-matrix.md) ilə təsdiqləyin. Ayrı-ayrılıqda yerləşdirmədə istifadə olunan dəqiq CLI, şəbəkə həmkarı ikili faylı, konfiqurasiya və şəbəkə buraxılışını pinləyin və test edin.
- Buraxılış pəncərəsindən əvvəl icazələri, ödəniş sponsorluğunu, tarif limitlərini, monitorinqi, ehtiyat nüsxə vəziyyətini və geri qaytarma kriteriyalarını nəzərdən keçirin.
- Yüksək təsirə malik yazılar üçün yazılı əməliyyat və ya miqrasiya planı tələb edin.

## Geri alma və Bərpa {#rollback-and-recovery}

- Hansı dəyişikliklərin kod yerləşdirmə vasitəsilə geri alınacağını, hansılarının zəncirdə əməliyyat tələb etdiyini və hansılarının birbaşa geri alınamayacağını müəyyən edin.
- Zəncirdaxili məlumat dəyişikləri üçün, ilk istehsal yazısından əvvəl kompensasiyaedici əməliyyatları və ya miqrasiya skriptlərini hazırlayın.
- Şəbəkə dəyişiklikləri üçün buraxılış zamanı əvvəlki ikilik, konfiqurasiya paketi, imzalanmış blokçeyn başlanğıc faylı və əməliyyat icra kitabçasını əlçatan saxlayın.
- Reddedilmə dərəcəsi, sıra artımı, gecikmə və ya şəbəkə tərəfdaşının sağlamlığı kimi obyektiv siqnallara əsaslanaraq yayımı dayandırmaq üçün bir qərar nöqtəsi təyin edin.

## Son Yoxlama Siyahısı {#final-checklist}

- Konfiqurasiya mühitə xasdır və yalnız test üçün nəzərdə tutulmuş gizli məlumatları özündə saxlamır.
- Əməliyyatın təkrar cəhdi davranışı idempotentdir və ya açıq şəkildə məhdudlaşdırılıb.
- Tətbiq rədd edilməni, müddətin bitməsini, zaman aşımını və son nöqtənin əlçatan olmaması xətalarını fərqləndirə bilər.
- Monitorinq keçirilmə sürəti, gecikmə, növbə dərinliyi, rədd etmələr, görünüş dəyişiklikləri və müvafiq biznes hadisələrini əhatə edir.
- Operatorların gözlənilən nasazlıq rejimləri üçün iş kitabçaları var.
- Təhlükəsizlik yoxlaması əsas saxlama, icazələr, şəbəkə açıqlığı və avtomatlaşdırma səlahiyyət prinsiplərini əhatə etdi.
