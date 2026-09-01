---
translation_locale: az
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Tətikləyicilər {#triggers}

Triglər bir hadisə filtrini icra olunan hərəkətə bağlayır. Bir hadisə trigərin filtrinə uyğundursa, Iroha blok icrasının bir hissəsi kimi trigər hərəkətini qiymətləndirir.

## Struktur {#structure}

Qeydiyyatdan keçmiş `Trigger` aşağıdakıları ehtiva edir:

- `id`: bir `TriggerId` bir `Name`-i özündə cəmləşdirir
- `action`: icra edilə bilən fayl, səlahiyyət verən əsas, filtrləmə, təkrar siyasəti, yenidən cəhd siyasəti və metadata

Hərəkət aşağıdakılardan ibarətdir:

- `executable`: `Instructions`, `ContractCall`, `Ivm` və ya `IvmProved`
- `repeats`: `Indefinitely` və ya `Exactly(n)`
- `authority`: icra olunan faylı işə salan hesab
- `filter`: bir `EventFilterBox`
- `retry_policy`: planlaşdırılmış zaman tetikleyiciləri üçün isteğe bağlı yenidən cəhd davranışı
- `metadata`: ixtiyari tetikleyici metadatası

## Hadisə Filtrləri {#event-filters}

Tətik şərtləri abunəliklərdə olduğu kimi eyni hadisə-filtrləmə modelindən istifadə edir. Yuxarı səviyyəli hadisə filtri aşağıdakılara uyğun gələ bilər:

- proqram təminatı işləmə iş axını hadisələri
- veri hadisələri
- vaxt əsaslı hadisə bildirişləri
- icra hadisələrini tetiklemek
- tamamlama hadisələrini tetiklemek

İş axınına uyğun gələn ən dar filtrə üstünlük verin. Geniş filtrlər diaqnostika üçün faydalıdır, amma blok icrası zamanı işi artırır.

Cari filtr ailələri üçün [Filtrlər](/az/blockchain/filters.md)-a baxın.

## Zaman Tetikleyiciləri {#time-triggers}

Zaman tetikleyiciləri zaman hadisəsi filtrindən istifadə edir. Dünya vəziyyətinin görünüşü uyğun zaman şərtinə çatdıqda, Iroha tetikleyici icazə prinsipi altında tetikleyici əməliyyatını icra edir. Zaman tetikleyiciləri aşağıda təsvir olunan yenidən cəhd siyasətindən istifadə edə bilən tetikleyici növüdür.

## Təkrarlama {#repetition}

`Repeats::Indefinitely` qeydiyyatdan silinənə qədər tetikleyicini aktiv saxlayır.

`Repeats::Exactly(n)` tetikleyicinin müəyyən sayda dəfə işləməsinə imkan verir. Say bitdikdə, eyni davranış yenidən tələb olunarsa, yeni bir tetikleyici qeydiyyatdan keçirin.

## səlahiyyət prinsipi və İcazələr {#authority-and-permissions}

Tetikleyici icazəsi prinsipi, icra edilə bilən faylı işə salmaq üçün istifadə olunan hesaba aiddir. Uzunömürlü tetikleyicilər üçün tələb olunan icazələrin açıq və operatorun şəxsi hesabından ayrılmış olması üçün xüsusi texniki hesabdan istifadə edin.

Avtorizasiya prinsipi icra olunan təlimatlar və ya müqavilənin texniki çağırışı üçün tələb olunan icazələrə malik olmalıdır. Trigger-i qeydiyyatdan keçirən hesab da aktiv proqram icra mühitinin validadoru altında trigger-ləri qeydiyyatdan keçirmək icazəsinə malik olmalıdır.

## Təkrar cəhd siyasəti {#retry-policy}

Vaxt tetikleyiciləri təkrar cəhd siyasətinə qoşula bilərlər. Təkrar cəhd siyasəti müəyyən edir:

- `max_retries`: ilkin uğursuz atəşdən sonra neçə təkrar cəhdə icazə verilir
- `retry_after_ms`: təkrar cəhdin uyğun olmasından əvvəl Iroha nə qədər gözləyir

Təkrar cəhd büdcəsi tükəndikdə, tetik qeydə alınmır.

## Sorğular {#queries}

Mövcud tetik sorğularından istifadə edərək tetik vəziyyətini yoxlayın:

- [`FindTriggers`](/az/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/az/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/az/reference/queries.md#triggers-contracts-transactions-and-blocks)

Bax həmçinin:

- [Hadisə tetikleyici nümunəsi](/az/blockchain/trigger-examples.md)
- [Hadisələr](/az/blockchain/events.md)
- [Təlimatlar](/az/blockchain/instructions.md)
- [İcazələr](/az/blockchain/permissions.md)
