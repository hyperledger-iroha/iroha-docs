---
translation_locale: az
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Filtrlər {#filters}

Filtrlər hadisə axınlarını daraldır və tetik şərtlərini işə salır. Cari ən yüksək səviyyəli hadisə filtri `EventFilterBox`-dir və bu, bu hadisə ailələri ilə uyğunlaşa bilər:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

İş axınına uyğun gələn ən dar filtrlərdən istifadə edin. `DataEventFilter::Any` kimi geniş filtrlər diaqnostika üçün faydalıdır, lakin onlar hər hadisənin trigger və ya abunəçi uyğunluğunun ödənişini ödəməsinə səbəb olur.

## Məlumat Hadisə Filtrləri {#data-event-filters}

`DataEventFilter` blokçeyn dəftər məlumat hadisələrinə uyğundur. Onun mövcud variantlarına daxildir:

|Variant|Tədbir ailəsi|
| --- | --- |
| `Any` |Hər hansı bir məlumat hadisəsi|
| `Peer` |şəbəkə həmkarının həyat dövrü hadisələri|
| `Domain` |Domenin həyat dövrü və metadatanın hadisələri|
| `Account` |Hesabın həyat dövrü, metadatalar, ləqəb və şəxsiyyət hadisələri|
| `Asset` |Aktiv balansı və metadana hadisələri|
| `AssetDefinition` |Aktiv tərifi həyat dövrü, siyasət və metadata hadisələri|
| `Nft` |NFT həyat dövrü və metadata hadisələri|
| `Rwa` |Real dünya aktivlərinin həyat dövrü hadisələri|
| `Trigger` |Həyat dövrü və metadata hadisələrini tetikleyin|
| `Role` |Rolun həyat dövrü hadisələri|
| `Configuration` |Zəncirdaxili konfiqurasiya hadisələri|
| `Executor` |proqram icra mühiti icraçı hadisələr|
| `Proof` |Sübutun yoxlanılması həyat dövrü hadisələri|
| `Confidential` |Gizli aktiv hadisələri|
| `VerifyingKey` |Doğrulama açarı qeydiyyatı hadisələri|
| `RuntimeUpgrade` |proqram icra mühiti yeniləmə hadisələri|
| `Soradns` |Həll edici qovluq idarəetmə hadisələri|
| `Sorafs` |SoraFS keçid uyğunluq hadisələri|
| `SpaceDirectory` |Kosmik Qovluq texniki manifest həyat dövrü hadisələri|
| `Escrow` |Şəffaf yerli aktiv etibarnamə həyat dövrü hadisələri|
| `Offline` |Offline maliyyə əməliyyatı hesablaşma hadisələri|
| `Oracle` |Oracle xəbər feedləri|
| `Social` |Viruslu təşviq tədbirləri|
| `Bridge` |Körpü tədbirləri|
| `Governance` |İdarəetmə xüsusiyyəti aktiv olduqda idarəetmə hadisələri|

Əksər konkret filtrlər həmçinin isteğe bağlı ID uyğunlaşdırıcısı və hadisə dəsti maskasına imkan verir. Məsələn, aktiv filtri bir aktiv və ya aktiv hadisələrinin bir sinifinə uyğunlaşa bilər, trigger filtri isə bir trigger ID-sinə və trigger hadisə dəstinə uyğunlaşa bilər.

## proqram təminatı işləmə iş axını Filtrlər {#pipeline-filters}

Proqram təminatı emal iş axını filtrləri blok, əməliyyat, birləşdirmə və şahid kimi emal tədbirləri ilə uyğunlaşır. Onları əməliyyat abunəlikləri, blok-emal paneli və blokçeyn dəftər məlumat obyektləri əvəzinə proqram təminatı emal iş axını vəziyyətinə reaksiya verən tetikleyicilər üçün istifadə edin.

## Tətik Filtrləri {#trigger-filters}

Tetikləyicilər vəziyyətlərini `EventFilterBox` kimi saxlayır. Bir tetikleyici əməliyyatı da saxlayır:

- icra edilə bilən
- təkrarlama siyasəti
- səlahiyyət verən əsas hesab
- isteğe bağlı zaman tetikleyicili təkrar sınaq siyasəti
- metaməlumat

Tetikleyici icazə prinsipi icra edilə bilən faylın tələb etdiyi icazələrə sahib olmalıdır. Uzun müddətli tetikleyicilər üçün xüsusi texniki hesabları üstün tutun.

## Sorğu Filtrləri {#query-filters}

Sorğu filtrləri hadisə filtrlərindən ayrıdır. Təkrarlana bilən sorğular predicate və selector dəstəyini göstərə bilər. Filtr girişinin sorğu çıxış tipi ilə uyğun gəlməsi üçün SDK tərəfindən təmin edilmiş sorğuya xas tipli filtrləri istifadə edin.

Bax həmçinin:

- [Hadisələr](/az/blockchain/events.md)
- [Yerli Aktiv Əmanət](/az/blockchain/escrow.md#queries-and-events)
- [Səbəblər](/az/blockchain/triggers.md)
- [Sorğular](/az/blockchain/queries.md)
- [Sorğu istinadı](/az/reference/queries.md)
