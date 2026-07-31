---
translation_locale: az
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Triggerlər {#triggers}

Triggerlər bir hadisə filtrini icra edilə bilən bir hərəkətə bağlayır. Bir hadisə tetikləyici filtrinə uyğunlaşdıqda, Iroha blok icrasının bir hissəsi olaraq tetikləyici hərəkəti qiymətləndirir.

## Struktura {#structure}

qeydiyyatdan keçirilən `Trigger` sənədində aşağıdakılar var:

- `id`: bir `TriggerId` qovulması `Name`
- `action`: icra edilə bilən, səlahiyyətli, filtr, təkrarlama siyasəti, yenidən cəhdlər siyasəti və metadatalar

Tədbir aşağıdakıları ehtiva edir:

- `executable`: `Instructions`, `ContractCall`, `Ivm` və ya `IvmProved`
- `repeats`: `Indefinitely` və ya `Exactly(n)`
- `authority`: icra edilə bilən hesab;
- `filter`: bir `EventFilterBox`
- `retry_policy`: planlaşdırılmış vaxt tetikleyiciləri üçün seçməli yenidən sınaq hərəkəti
- `metadata`: keyfiyyətli metadatalar

## Hadisə filtrləri {#event-filters}

Trigger şərtləri abunə ilə eyni hadisə filtr modeli istifadə edir. Ən yüksək səviyyəli hadisə filtri:

- boru kəməri hadisələri
- məlumat hadisələri
- Zaman hadisələri
- icra hadisələrini başlatmaq
- başlanğıc hadisələrini başlatmaq

İş axınına uyğun olan ən dar filtrə üstünlük verin. Geniş filtrlər diaqnostikada faydalıdır, lakin blok icrası zamanı işləri artırırlar.

Mövcud filtr ailələri üçün [Filterlər](/az/blockchain/filters.md) baxın.

## Zamanın tetikləmələri {#time-triggers}

Zaman tetikleyiciləri zaman hadisəsi filtrindən istifadə edirlər. Dünya vəziyyət görünüşü uyğun vaxt şəraitinə çatdıqda, Iroha tetikləyici səlahiyyətinin altındakı tetikleyici hərəkəti həyata keçirir. Vaxt tetikleyicilər aşağıda təsvir olunan yenidən sınama siyasətindən istifadə edə biləcək tetikleyici növüdür.

## Təkrarlama {#repetition}

`Repeats::Indefinitely` qeydə alınmamış olana qədər tetikçi aktiv saxlayır.

`Repeats::Exactly(n)` tetikçi müəyyən sayda dəfə atmağa imkan verir. Saymaq bitdikdən sonra, eyni davranışı yenidən tələb edirsə, yeni bir tetikçi qeyd edin.

## Səlahiyyət və icazələr {#authority-and-permissions}

Trigger səlahiyyəti, icra edilə bilənləri çağırmaq üçün istifadə edilmiş hesabdır. Uzun ömürlü tetikləmələr üçün xüsusi texniki hesabdan istifadə edin ki , tələb olunan icazələr açıq şəkildə və bir operatorun şəxsi hesabı.

Orqanın icra edilə bilən təlimat və ya müqavilə çağırışı üçün tələb olunan icazələrə ehtiyacı var. Trigger-i qeydiyyatdan keçirən hesabın aktiv icra vaxtının təsdiqçisi altında triggerləri qeydiyyata alması üçün icazəsi də lazımdır.

## Yenidən sınaq siyasəti {#retry-policy}

Zaman tetikleyiciləri yenidən cəhd siyasətini seçə bilərlər.

- `max_retries`: ilk uğursuz atışdan sonra neçə dəfə yenidən sınaqdan keçməyə icazə verilir
- `retry_after_ms`: Iroha yenidən sınaqdan keçmək üçün nə qədər gözləməlidir?

Yenidən təcrübə büdcəsi bitdikdə, tetikçi qeydiyyatdan çıxmır.

## Suallar {#queries}

Trigger vəziyyətini yoxlamaq üçün mövcud trigger sorğularından istifadə edin:

- [`FindTriggers`](/az/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/az/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/az/reference/queries.md#triggers-contracts-transactions-and-blocks)

Həmçinin bax:

- [Hadisə başlatma nümunəsi](/az/blockchain/trigger-examples.md)
- [Hadisələr](/az/blockchain/events.md)
- [Təlimatlar](/az/blockchain/instructions.md)
- [İzinlər](/az/blockchain/permissions.md)
