---
translation_locale: az
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 1f316d6a823b23e821d80fe8773df7469358b0e01057f9b76b113cafe4818f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# İstifadə üçün hazırlıq {#release-readiness}

Iroha tətbiqini və ya şəbəkə dəyişikliyini təşviq etməzdən əvvəl, müvafiq riskləri ortaya qoya biləcək ən kiçik bir mühitdə davranışı sübut edin və sonra ümumi test şəbəkəsi və istehsal qapıları vasitəsilə məqsədəuyğun şəkildə hərəkət edin.

## Yerli ağ qapısı {#localnet-gate}

- Eyni Iroha yolu və ən yaxın praktiki təsdiqçi sayına malik birbaşa istifadə edilə bilən yerli şəbəkəni başlatın.
- Transaction builders üçün vahid sınaqları, sorğu analizi, rədd idarəetmə və konfiqurasiya yükləmələri aparın.
- Ən kiçik uğurlu oxuma və yazma yollarını tətbiqin daha sonra istifadə edəcəyi eyni SDK və ya CLI formasından keçirin.
- Tədqiqat əşyalarında gözlənilən əməliyyat hashləri, statusları, hadisələri və vəziyyət oxumalarını tutun.

Bax [Lunch Iroha 3](/az/get-started/launch-iroha.md) və [SDK Tutoriallar ](/az/guide/tutorials/).

## Paylaşılan testnet qapısı {#shared-testnet-gate}

- Taira və ya digər paylaşılan test şəbəkəsindən son nöqtə davranışları, ödənişlər, hesab maliyyələşdirməsi, gecikmə və əməliyyat təcrübələri üçün istifadə edin.
- Keep live testnet yazır opt-in belə ki, adi test qaçışları şəbəkə mövcudluğu və ya testnet vəsait xərcləmək asılı deyil.
- Hər bir canlı test əməliyyatını təqdim etməzdən əvvəl imzaçı maliyyələşdirməsini, ödəniş aktivlərinin metadatalarını, səlahiyyətli icazələri və gözlənilən vəziyyətini yoxlayın.
- Terminal vəziyyətini gözləyin, sonra oxumaq üçün yalnız sorğu ilə nəticəli vəziyyəti yoxlayın.

Bax [SORA 3: Taira və Minamoto ](/az/get-started/sora-nexus-dataspaces.md) üzərində qurun.

## Əsas şəbəkə və ya istehsal qapısı {#mainnet-or-production-gate}

- Ayrı-ayrı istehsal imzaları, maliyyələşdirmələr, domenlər və konfiqurasiya yollarından istifadə edin. Test şəbəkə açarları və ya faucet fərziyyələrini təbliğ etməyin.
- SDK, CLI, həmyaşıd və şəbəkə uyğunluğunun [ uyğunluq matrisinə ](/az/reference/compatibility-matrix.md) təsdiq edilməsi.
- Tədqiqat icazələri, ödəniş sponsorluğu, qiymət məhdudiyyətləri, monitorinq, yedekləmə statusu və buraxılış pəncərəsinə qədər geri qaytarılma meyarları.
- Yüksək təsiri olan yazılar üçün yazılı bir əməliyyat və ya miqrasiya planı tələb olunur.

## Rollback və bərpa {#rollback-and-recovery}

- Kodu tətbiq etməklə hansı dəyişikliklərin geri çəkilə biləcəyini, zəncirdə əməliyyat tələb olunduğunu və birbaşa ləğv edilə bilməyəcəyini müəyyənləşdirin.
- Zəngindəki məlumat dəyişiklikləri üçün ilk istehsal yazılmasından əvvəl kompensasiya əməliyyatları və ya miqrasiya skriptlərini hazırlayın.
- Şəbəkə dəyişiklikləri üçün əvvəlki ikili, konfig paketini, imzalanmış genesis və əməliyyat kitabını buraxılış zamanı mövcud saxlayın.
- İndirməni ləğv etmək üçün bir qərar nöqtəsi təyin edin, bu da rədd edilmə nisbəti, növbə artımı, gecikmə və ya həmkarların sağlamlığı kimi obyektiv siqnallara əsaslanır.

## Son yoxlama siyahısı {#final-checklist}

- Konfiqurasiya mühitə aiddir və yalnız sınaq sırlarını ehtiva etmir.
- Transaction retry davranışı idempotent və ya açıq şəkildə məhdudlaşdırılmışdır.
- Tətbiq rədd, müddətin bitməsi, vaxt təxirə salınması və son nöqtələrin mövcudluğu pozuntularını fərqləndirə bilər.
- Monitorinq keçid, gecikmə, növbənin dərinliyi, rəddlər, görünüş dəyişiklikləri və müvafiq iş hadisələrini əhatə edir.
- Operatorlar gözlənilən uğursuzluq rejimləri üçün qaçış kitabları var.
- Təhlükəsizlik araşdırması əsas saxlama, icazələr, şəbəkə məruz qalma və avtomatlaşdırma səlahiyyətini əhatə edirdi.
