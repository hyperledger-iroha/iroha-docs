---
translation_locale: az
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 7839268b8c1f6700b0c26652e3308fa4e8acef4717d8527c609b6f30fb8c84ab
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Şəbəkə İstismarı {#network-deployment}

Iroha şəbəkəsini əlaqələndirilmiş sistem kimi qəbul edin. Şəbəkə başlaya bilmədən və blokları yekunlaşdırmağa davam edə bilmədən əvvəl təsdiqləyicilər blockchain başlanğıcını, topologiyanı, etibarlı şəbəkə iştirakçılarını və konsensusa aid konfiqurasiyanı razılaşdırmalıdırlar.

## Mühitlərin ayrılması {#environment-separation}

- Yerli inkişaf, paylaşılan testnet, səhnələşdirmə və istehsalat üçün ayrı konfiqurasiya paketlərini saxlayın.
- Hər bir istifadə olunmayan mühit üçün yeni açarlar yaradın. Lokalnet və ya Taira açar materialını istehsalda təkrar istifadə etməyin.
- Şəbəkə həmkarının konfiqurasiyasını, müştəri konfiqurasiyasını, imzalanmış genezisi, skriptləri və yerləşdirmə qeydlərini versiyalanmış buraxılış artefaktı kimi birlikdə saxlayın.
- Şəxsi açarları depos və yerləşdirmə şablonlarının xaricində saxlayın.

Bax [Şəbəkə Yerləşdirilməsi üçün Açarlar](/az/guide/configure/keys-for-network-deployment.md).

## blokçeyn mənşəyi və topologiya {#genesis-and-topology}

- Profil onları tələb etdikdə, hər bir doğrulayıcı eyni imzalanmış blokçeyn başlanğıc əməliyyatından, etibarlı şəbəkə qohum dəstindən, topologiyadan və doğrulayıcı Sahiblik Sübutlarından istifadə etməlidir.
- Minimum Bizans-səhv-tolerant yerləşdirmə üçün ən azı dörd təsdiqləyici istifadə edin.
- Kapasitet planlamasında yoxlayıcıları müşahidəçilərdən ayırın. Müşahidəçilər səs vermir, təklif etmir və yığmır, amma hələ də yaddaş, blok sinxronizasiyası və şəbəkə keçidini istifadə edirlər.
- Blokçeyn başlanğıcını, icraçısını və topologiya dəyişikliklərini tək paylı redaktələrdən daha çox koordinasiyalı köçlər kimi qəbul edin.

Baxın [blokçeyn genesis](/az/reference/genesis.md), [şəbəkə tərəfdaşının idarə edilməsi](/az/guide/configure/peer-management.md) və [Performans və Ölçülər](/az/guide/advanced/metrics.md#node-count-and-quorum).

## Torii və Şəbəkəyə Giriş {#torii-and-network-access}

- Torii hostun və ya şəxsi şəbəkənin xaricində açıq olduqda onu ters proksi və ya firewall arxasında yerləşdirin.
- Yerləşdirmə onları tələb etdikdə TLS-i dayandırın və kənarda əsas autentifikasiyanı, sürət məhdudiyyətlərini və sorğu ölçüsü nəzarətlərini tətbiq edin.
- Yalnız mühit tərəfindən lazım olan API son nöqtələrini dərc edin. Operator və telemetriya marşrutları ictimai oxumaq üçün olan marşrutlardan daha məhdud olmalıdır.
- Şəbəkə tərəfdaşları uzaqdan birbaşa trafik qəbul etməməli olduqda dinləyici ünvanları host-lokal interfeyslərə bağlayın.

Baxın [Torii API son nöqtələr](/az/reference/torii-endpoints.md) və [Virtual Özəl Şəbəkələr](/az/guide/security/vpn.md).

## Razılıq və Bacarıq {#consensus-and-capacity}

- Razılaşma taymerlərini tənzimləmədən əvvəl yerləşdirməni ölçün. Zəif vaxt limitləri yalnız şəbəkə, yaddaş və icra qatları ayaq uydurduqda gecikməni azalda bilər.
- Yalnız ötürmə sürətinin qısa nümunələrinə baxmayın, növbənin istiqamətinə baxın. Sabit yük zamanı böyüyən növbə şəbəkənin yükləndiyini göstərir.
- Hər bir benchmark üçün effektiv Sumeragi parametrləri, telemetriya profili, təsdiqləyici sayı, şəbəkə RTT, iş yükü forması və aparat detalları qeyd edin.
- Hər dəfə bir məhdud növbəni və ya yük-qaytarma limitini dəyişdirin və əvvəl və sonra gecikmə, trafik, yaddaş və geritənzim sübutlarını saxlayın.

Bax [Performans və Ölçülər](/az/guide/advanced/metrics.md).

## Çıplak Metal və Proses İdarəetməsi {#bare-metal-and-process-management}

- Hər bir şəbəkə həmkarının `config.toml`, özəl açarı, saxlama qovluğu və portlarını ayrı saxlayın.
- Aydın yenidən başlatma, qeydiyyat və resurs siyasətləri ilə systemd kimi proses idarəedicilərindən istifadə edin.
- Test topologiyasını idarə olunan hostlara tərcümə edərkən yaradılmış README və Kagami localnet paketlərindən başlanğıc əmrləri qoruyun.

Bax [Sırf Metalda Iroha işlətmək](/az/guide/advanced/running-iroha-on-bare-metal.md).
