---
translation_locale: az
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Filtrlər {#filters}

Hadisə axınlarını daraldır və tetiklənmə şərtlərini filtrləyir. Hal-hazırda ən yüksək səviyyəli hadisələr filtri `EventFilterBox`, bu hadisə ailələrinə uyğunlaşa bilər:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

İş axınına uyğun olan ən dar filtrdən istifadə edin. `DataEventFilter::Any` kimi geniş filtrlər diaqnozlaşdırma üçün faydalıdır, lakin hər bir hadisənin tetikləyici və ya abunəçi uyğunlaşmasının xərclərini ödəməsini təmin edirlər.

## Məlumat hadisələri filtrləri {#data-event-filters}

`DataEventFilter` nəşriyyat məlumatları hadisələri ilə uyğundur. Onun mövcud variantları aşağıdakılardır:

|Variant |Tədbir ailəsi |
| --- | --- |
|`Any` |Hər hansı bir məlumat hadisəsi |
|`Peer` |Tərəfdaşların həyat dövrü hadisələri |
|`Domain` |Domenin həyat dövrü və metadata hadisələri |
|`Account` |Hesabın həyat dövrü, metadatalar, alias və şəxsiyyət hadisələri |
|`Asset` |Mülkiyyət balansı və metadata hadisələri |
|`AssetDefinition` |Aktivlərin təyinatı həyat dövrü, siyasət və metadata hadisələri |
|`Nft` |NFT həyat dövrü və metadata hadisələri |
|`Rwa` |Real dünya aktivlərin həyat dövrü hadisələri |
|`Trigger` |Trigger lifecycle və metadata hadisələri |
|`Role` |Role lifecycle hadisələri |
|`Configuration` |Zəncirdəki konfiqurasiya hadisələri |
|`Executor` |Runtime icraçı hadisələri |
|`Proof` |Proof verifikasiya həyat dövrü hadisələri |
|`Confidential` |Məşhur aktiv hadisələri |
|`VerifyingKey` |Verifikasiya açarları qeydiyyat hadisələri |
|`RuntimeUpgrade` |İndirmə vaxtının yüksəlməsi tədbirləri |
|`Soradns` |Qeydiyyat idarəetmə hadisələrini həll edin |
|`Sorafs` |SoraFS Gateway uyğunluq hadisələri |
|`SpaceDirectory` |Space Directory manifest həyat dövrü hadisələri |
|`Escrow` |Şəffaf yerli aktivlərin həyati dövrü hadisələri |
|`Offline` |Offline hesablama tədbirləri |
|`Oracle` |Oracle feed hadisələri |
|`Social` |Viral təşviq hadisələri |
|`Bridge` |Köprü tədbirləri |
|`Governance` |İdarəetmə xüsusiyyəti aktivləşdirildiyi zaman idarəetmə tədbirləri |

Əksər beton filtrləri ayrıca bir ID uyğunlaşdırıcı və hadisə quruluşu maskasına imkan verir. Məsələn, bir aktiv filtri bir aktivə və ya bir asset hadisələri sinfinə uyğunlaşdıra bilər, trigger filter isə bir trigger ID və trigger hadisə dəstinə uyğunlaşa bilər.

## Pipeline Filterləri {#pipeline-filters}

Pipeline filtrləri blok, əməliyyat, birləşmə və şahid hadisələri kimi işlənmə hadisələrinə uyğunlaşır. Onları əməliyyat abunəçiliyi, blok işlənməsi taxtaları və başlıq məlumat obyektlərinin əvəzinə pipeline vəziyyətinə reaksiya verən tetikləyicilər üçün istifadə edin.

## Trigger Filterləri {#trigger-filters}

Triggerlər öz vəziyyətini `EventFilterBox` olaraq saxlayır. Trigger aksiyası ayrıca:

- icra edilən
- təkrarlama siyasəti
- həkim hesabı
- istənilən vaxt tetikləyici yenidən sınaqdan keçirmə siyasəti
- metadata

Başlatıcı orqanı icra edilə bilən icazələrə malik olmalıdır. Uzun ömürlü başlatıcılar üçün xüsusi texniki hesabları üstün tuturlar.

## Sorğu Filtrləri {#query-filters}

Sorğu filtrləri hadisələr filtrlərindən ayrıdır. Yeniləməli sorğular predikat və seçicilər dəstəyini ortaya qoya bilər. SDK -dən sorğu xüsusi tiplənmiş filtrlərdən istifadə edin ki, filter giriş sorğu çıxış növünə uyğunlaşsın.

Həmçinin bax:

- [Hadisələr](/az/blockchain/events.md)
- [Native Asset Escrow ](/az/blockchain/escrow.md#queries-and-events)
- [Triggerlər](/az/blockchain/triggers.md)
- [Suallar](/az/blockchain/queries.md)
- [Məlumat istintaq](/az/reference/queries.md)
