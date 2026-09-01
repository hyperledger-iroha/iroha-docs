---
translation_locale: az
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Məlumatların Modellaşdırılması {#data-modeling}

Blockchain dəftər məlumatları mülkiyyət, köçürmə davranışı, icazə sərhədləri və sorğu naxışları ətrafında modelləşdirilməlidir. Auditi dəstəkləyən və deterministik icrasını təmin edən ən kiçik zəncirdaxili nümayəndəliyi seçin.

## Domenlər və Hesablar {#domains-and-accounts}

- İnzibati və siyasət sərhədlərini təmsil etmək üçün domenlərdən istifadə edin. Domen adlarını sabit saxlayın, çünki onlar hesab və aktiv identifikatorlarında görünür.
- Bir hesabı əlaqəsiz vəzifələrlə yükləməkdən çəkinin. İstifadəçilər, xidmətlər, tetikleyicilər, operatorlar və ödəniş sponsorları üçün ayrı hesablar istifadə edin.
- Konfiqurasiya və testlərdə tək protokol-standart hesab və domen identifikatorlarından istifadə edin. Iroha adları tək protokol-standart təhlildən sonra böyük-kiçik hərflərə həssasdır.
- Test və istehsal kimliklərini adlarda, domenlərdə və konfiqurasiya fayl yollarında açıq şəkildə fərqləndirin.

Baxın [Domenlər](/az/blockchain/domains.md), [Hesablar](/az/blockchain/accounts.md) və [Adlandırma](/az/reference/naming.md).

## Aktivlər və NFTs {#assets-and-nfts}

- Əvəzolunan balanslar və köçürülə bilən miqdarlar üçün rəqəmsal aktivlərdən istifadə edin.
- Yalnızca sahib olduğunuz qeydlər üçün NFTs və ya domenə xüsusi obyektlərdən istifadə edin.
- Dəyər daşıyan vəziyyəti yalnız metadatalarda kodlaşdırmaqdan çəkinin. Aktivlər və NFTs metadatanın vermədiyi həyat dövrü hadisələri, ötürmə semantikası və icazə yoxlamalarını təmin edir.
- Bir aktivləri tətbiqlərə təqdim etməzdən əvvəl dəqiqlik, təchizat siyasəti, emitent məsuliyyəti və yandırma/çıxarma səlahiyyəti prinsipini müəyyən edin.

Baxın [Aktivlər](/az/blockchain/assets.md), [NFTs](/az/blockchain/nfts.md) və [RWAs](/az/blockchain/rwas.md).

## Metaməlumat {#metadata}

- Blockchain dəftər obyektlərinin etiketlər, inteqrasiya ID-ləri, siyasət bayraqları, kriptoqrafik xeshlər, URIs və ya məzmunla ünvanlanan istinadlar kimi kompakt atributları üçün metadatanı istifadə edin.
- Metaməlumat açarlarını sabit və sənədləşdirilmiş saxlayın. Müştərilər onlardan asılı olduqdan sonra açar adlarını dəyişdirmək miqrasiya problemi yaradır.
- Böyük sənədləri, qeydləri, şəxsi istifadəçi məlumatlarını və ya yüksək dəyişkən tətbiq vəziyyətini metadatalarda birbaşa saxlamayın.
- Metadata zəncirdənkənar məlumata işarə etdikdə, məzmun heşi, URI, SoraFS yolu, manifest istinadı və ya yığcam öhdəlik kimi yoxlanıla bilən bir istinad saxlayın.

Baxın [Meta məlumatlar və blokçeyn dəftərxanası Saxlama Seçimləri](/az/guide/configure/metadata-and-store-assets.md) və [Metaməlumat](/az/blockchain/metadata.md).

## Model üzrə icazələr {#permissions-by-model}

- Rolları tətbiqetmə rahatlıqları ətrafında deyil, biznes əməliyyatları ətrafında dizayn edin. Bir işə və ya xidmətə görə adlandırılmış rol, geniş texniki bacarıq əsasında adlandırılmış roldan daha asan yoxlanılır.
- İcazə əhatə dairəsi tokenlərini iş axışını təmin edən ən kiçik obyektə qədər məhdudlaşdırın.
- Verilmə, məhv etmə, şəbəkə bərabər idarəsi, icraçı dəyişiklikləri, tetikçi idarəsi və metadatanın dəyişdirilməsi üçün icazələri yüksək təsirli icazələr kimi qiymətləndirin.
- Müvəqqəti icazələr üçün açıq ləğv və dövr etmə prosedurlarını əlavə edin.

Baxın [İcazələr](/az/blockchain/permissions.md) və [İcazə Jetonları](/az/reference/permissions.md).

## Sorğu forması {#query-shape}

- Tətbiqinizin ən çox ehtiyac duyacağı sorğuları dəstəkləyən identifikatorları və metadatalar açarlarını seçin.
- Geniş nəticə cədvəllərini səhifələyin və normal əməliyyatlar üçün bütün blokçeyn dəftəri üzərində məhdudiyyətsiz axtarış tələb edən istifadəçi interfeyslərindən çəkinin.
- Kritik tətbiq davranışı üçün istifadə edildikdə, blokçeyn ledqer məlumatları və hadisələrindən kənar zəncirlərdəki indekslərin yenidən qurula bilən olmasını təmin edin.
