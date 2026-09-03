---
translation_locale: az
translation_source: /blockchain/triggers.md
translation_source_hash: 726e2998ec1439138ef94d3a702049731ce2432f5c52a723ed0c92593de41c1e
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

### Məlumat tetikleyicilərinin həcmi və gücü {#data-trigger-scope-and-capacity}

Adətənki məlumat tetikçisi öz filtrini onun tetikçi orqanına məxsus dəqiq bir subyektə bağlamalıdır. Hesab filtrləri bu dəqiq hesabın adını verməlidir. Əməliyyat, aktiv tərifi, domen, NFT, RWA, və tetikçi filtrləri eyni zamanda orqanın mülkiyyətində olan dəqiq bir qurumun adını göstərməlidir. `Any`, bağlanmamış uyğunlaşma, xarici subyekt və sistem və ya idarəetmə hadisələrinin ailələri adi hesab ölçülü tetikçilər deyil.

Təkcə Parlament `CanRegisterGlobalDataTrigger` verə bilər. Tələb birbaşa bir hesabda saxlanılır, eyni dəqiq tetikləyici səlahiyyətə malikdir və Eyni Parlamentin həyat dövrü. Bu, bir rol vasitəsilə irs edilmir və bir hesab başqa bir orqan üçün tetikçi qeyd edərkən `CanRegisterTrigger`dan imtina etmir.

Konsensus bir səlahiyyət üçün ən çox 64 məlumat tetikleyicisini və qlobal miqyasda 4,096 məlumat tetikləyicini qəbul edir. Bir başlanğıc əməliyyatı, kaskadlar da daxil olmaqla ən çox 256 məlumat tetikləyici atışına səbəb ola bilər. Hər indeksləşdirilmiş filtr yoxlaması, atış, yerli təlimat və VM təlimat eyni blok qaz büdcəsi istehlak edir.

Trigger icrası uyğunlaşma hadisəsini yaydığı əməliyyatla atomdur. Əgər icazə verilən bir tetikləyici uğursuz olursa, atəş və ya icra dərinliyi məhdudunu aşırsa və ya qaz tükənirsə, Iroha həm tetikləyici təsirləri, həm də başlanğıc əməliyyatını geri qaytarır.

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
