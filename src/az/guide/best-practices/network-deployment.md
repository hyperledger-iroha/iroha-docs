---
translation_locale: az
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 312f9cb3c6fd937b3e7c30ea27d1876ea7901cfa79eced352611db99bbca4a70
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Şəbəkənin tətbiqi {#network-deployment}

Bir Iroha şəbəkəsinə əlaqəli bir sistem kimi yanaşın. Validatorlar, şəbəkənin blokları başlamaq və bitirməyə davam etmədən əvvəl təməl, topologiya, etibarlı həmyaşıllılar və konsensusla əlaqədar quruluş barədə razılığa gəlməlidirlər.

## Ətraf mühitin ayrılması {#environment-separation}

- Yerli inkişaf, paylaşılan test şəbəkəsi, mərhələləşdirmə və istehsal üçün ayrı-ayrı konfig paketləri saxlamaq.
- Hər bir birbaşa istifadə edilməyən mühit üçün yeni açarlar istehsal edin. Taira istehsalda əsas material.
- Peer konfig, müştəri konfig, imzalanmış genesis, skriptlər və yerləşdirmə qeydlərini versiyalaşdırılmış buraxılış artefaktı kimi bir yerdə saxlayın.
- Xüsusi açarları anbar və yerləşdirmə şablonlarının xaricində saxlayın.

[Ağ tətbiqi üçün açarlar ](/az/guide/configure/keys-for-network-deployment.md) bax.

## Qədim və topologiya {#genesis-and-topology}

- Hər bir təsdiqləyici eyni imzalanmış genesis əməliyyatını, etibarlı həmyaşıd dəstini, topologiyasını və təsdiqləyicisini Proof-of-Possession istifadə etməsini tələb edir.
- Ən azı dörd validatordan istifadə edin Bizans səhv tolerantlığı üçün.
- Müşahidəçilər səs vermirlər, təklif etmirlər və ya toplayırlar, lakin yenə də saxlama, blok sinxronizasiyası və şəbəkə bant genişliyini istehlak edirlər.
- Başlangıç, icraçı və topoloji dəyişiklikləri tək-tərəfli redaktələrin əvəzinə koordinasiya edilmiş köçürmələr kimi müalicə edin.

[Genesis](/az/reference/genesis.md), [Peer Management](/az/guide/configure/peer-management.md) və [Performance and Metrics](/az/guide/advanced/metrics.md#node-count-and-quorum) baxın.

## Torii və şəbəkə giriş {#torii-and-network-access}

- Host və ya özəl şəbəkədən kənarda məruz qaldıqda Torii bir geri proxy və ya firewall arxasında qoyun.
- TLS -i ləğv etmək və tətbiq edilmə üçün tələb olunduğu zaman əsas təsdiqləmə, dərəcə məhdudiyyəti və istək ölçüsü nəzarətlərini kənarda tətbiq etmək.
- Ətraf mühitin tələb etdiyi yalnız son nöqtələri nəşr etmək lazımdır.
- Tərəfdaşlar birbaşa uzaqdan trafik qəbul etmədikləri zaman dinləyicinin ünvanlarını host-lokal interfeyslərə bağlayın.

Bax [Torii Son nöqtələr](/az/reference/torii-endpoints.md) və [ Virtual Xüsusi Şəbəkələr ](/az/guide/security/vpn.md).

## Konsensus və imkanlar {#consensus-and-capacity}

- Konsensus vaxtlarını tənzimləmədən əvvəl yerləşdirilməni ölçün. Daha aşağı vaxtlar yalnız şəbəkə, saxlama və icra təbəqələrinin davam etdiyi müddətdə gecikməyi azalda bilər.
- Qeyri-bərabər yükləmə zamanı növbənin böyüməsi şəbəkənin həddindən artıq yükləndiyini göstərir.
- Sumeragi effektiv parametrlərini, telemetri profilini, təsdiqləyici sayını, şəbəkəni RTT, iş yükünün formasını və hər bir istinad göstəricisi üçün hardver detallarını qeyd edin.
- Yalnız gecikmə, trafik və geri təzyiq siqnallarını müqayisə etdikdən sonra kollektor faylını artırın.

Bax [Fəaliyyət və Metriklər ](/az/guide/advanced/metrics.md).

## Çılpaq metal və proseslərin idarə edilməsi {#bare-metal-and-process-management}

- Hər bir qohumun `config.toml`, özəl açarı, saxlama dizini və limanları ayrı saxlayın.
- systemd kimi proses menecerlərini açıq şəkildə yenidən başlatma, qeyd və resurs siyasətləri ilə istifadə edin.
- Test topologiyasını idarə olunan hostlara tərcümə edərkən istehsal edilmiş README və Kagami localnet paketlərindən əmrləri saxlayın.

Bax [Bare Metal](/az/guide/advanced/running-iroha-on-bare-metal.md) üzərində işləmək Iroha.
