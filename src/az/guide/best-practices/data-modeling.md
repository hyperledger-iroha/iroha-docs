---
translation_locale: az
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Məlumat modelləşdirmə {#data-modeling}

Ledger məlumatları mülkiyyət, köçürmə davranışı, icazə sərhədləri və sorğu nümunələri ətrafında modelləşdirilməlidir. Auditəbilliyini və müəyyənləşdirilmiş icrasını dəstəkləyə bilən ən kiçik silsilə təmsilçisini seçin.

## Domenlər və Hesablar {#domains-and-accounts}

- İdarəçilik və siyasət sərhədlərini təmsil etmək üçün domenlərdən istifadə edin.
- İstifadəçilər, xidmətlər, aktivləşdiricilər, operatorlar və ödəniş sponsorları üçün ayrı hesablardan istifadə edin.
- Konfiqurasiya və sınaqlarda kanonik hesab və domen identifikatorlarından istifadə edin. Iroha adları kanonik analizdən sonra vəziyyətə həssasdırlar.
- Test və istehsal kimliklərini adlarda, domenlərdə və konfiqurasiya fayllarının yollarında görünür şəkildə fərqləndirmək.

Bax [Domains](/az/blockchain/domains.md), [Kontlar](/az/blockchain/accounts.md) və [Name](/az/reference/naming.md).

## Varlıqlar və NFTs {#assets-and-nfts}

- Fungib balanslar və köçürülə bilən miqdarlar üçün rəqəmli aktivlərdən istifadə edin.
- Yeganə məxsus qeydlər üçün NFTs və ya domen xarakterli obyektlərdən istifadə edin.
- Yalnız meta məlumatlarda dəyərli vəziyyətin kodlaşdırılmasından çəkinin. Varlıqlar və NFTs həyat dövrü hadisələrini, köçürmə semantikasını və metadata aid olmayan icazə yoxlamalarını təmin edir.
- Bir aktivin tətbiqlərə məruz qalmasından əvvəl dəqiqliyi, tədarük siyasətini, emitentin məsuliyyətini və yanıq / mint orqanını müəyyənləşdirin.

Baxın. [Varlıqlar](/az/blockchain/assets.md), [NFTs](/az/blockchain/nfts.md), və [RWAs](/az/blockchain/rwas.md).

## Metadatalar {#metadata}

- Lider obyektlərinin kompakt xüsusiyyətləri üçün meta məlumatlardan istifadə edin, məsələn etiketlər, inteqrasiya IDs, siyasət bayraqları, hashlar, URIs və ya məzmuna aid istinadlar.
- Metadata açarlarını sabit və sənədli saxlayın. Müştərilərdən asılı olduqdan sonra açar adlarının dəyişdirilməsi miqrasiya problemini yaradır.
- Böyük sənədləri, jurnalları, şəxsi istifadəçi məlumatlarını və ya yüksək həcmli tətbiqetmə statusunu birbaşa metadata saxlama.
- Metadatalar zəncirdən kənarda olan məlumatlara işarə edildikdə, məzmun həşəsi, URI, SoraFS yolu, açıq istinad və ya kompakt öhdəlik kimi yoxlana bilən bir istinad saxlayın.

[Metadata və Ledger Storage Choices](/az/guide/configure/metadata-and-store-assets.md) və [Metadata](/az/blockchain/metadata.md) baxın.

## Modeldən icazələr {#permissions-by-model}

- Bir iş və ya xidmətin adını daşıyan bir rol geniş texniki qabiliyyətdən daha asan yoxlanılır.
- İş axını təmin edən ən kiçik cisimə icazə simvollarını əhatə edin.
- Mining, yandırma, həmyaşıd idarəetmə, icraçı dəyişiklikləri, tetikləyici idarəetmə və metadata mutasiyası üçün icazələri yüksək təsirli icazələr kimi qəbul edin.
- Müvəqqəti icazələr üçün açıq şəkildə ləğv və rotasiya prosedurları əlavə edin.

Bax [İzinlər](/az/blockchain/permissions.md) və [İzin simvolları ](/az/reference/permissions.md).

## Soruşma forması {#query-shape}

- Tətbiqinizin ən çox ehtiyac duyduğu sualları dəstəkləyən identifikatorlar və metadata açarlarını seçin.
- Geniş nəticə dəstlərini səhifələşdirin və normal hərəkətlər üçün sərhədsiz kitabxana miqyasında tarama tələb edən istifadəçi interfeyslərindən çəkin.
- Qeydiyyatlı tətbiq davranışları üçün istifadə olunduğu hər zaman kitabın məlumatlarından və hadisələrindən yenidən qurula bilən zəncirdən kənar indekslər saxlayın.
