---
translation_locale: ru
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Активы в реальном мире {#real-world-assets}

Реальные активы (RWAs) - модель внецепочных активов, собственность или контроль которых отслеживается в цепи. В Iroha RWA представляет собой зарегистрированный лот бухгалтерского учета с генерируемым идентификатором, аккаунтом владельца, количеством, бизнес-метаданными, происхождением и дополнительными контролями жизненного цикла.

RWAs отличаются от количественных балансов активов:

- Цифровой актив - суммарный баланс, содержащийся на счете;
- NFT - это уникальная запись в цепочке с одним владельцем
- RWA - партия, которая может содержать бизнес-метаданные, количество, хранение, заморозки, состояние выкупа, происхождение и политику контроллера

Используйте RWAs, когда реестр должен представлять конкретную партию вне цепочки, а не только функциональный баланс.

## RWA Лот {#rwa-lot}

В партии RWA содержится:

- `id`: генерируемый канонический идентификатор RWA, отображающийся как `<hash>$<domain>`
- `owned_by`: счет, который в настоящее время является владельцем партии
- `quantity`: невыплаченное количество, представленное партией;
- `spec`: спецификация количества, например в десятичной шкале
- `primary_reference`: главный расчет, сертификат, счет или регистрационная справка вне цепи
- `status`: Необязательный текст о статусе предприятия
- `metadata`: компактные поля JSON, используемые для бизнес-контекста и индексации.
- `parents`: источниковые партии, используемые для получения этой партии
- `controls`: учетные записи контроллера, роли контроллера и разрешенные операции контроллера
- `is_frozen` и `held_quantity`: состояние жизненного цикла, применяемое по времени выполнения;

Сохраняйте на цепочке полезную нагрузку компактной. Сохранить большие юридические документы, отчеты об инспекции и аудиторские пакеты за пределами WSV, а затем поместить дигест, URI, SoraFS путь или явный ссылка в метаданные RWA.

## Идентификаторы {#identifiers}

`RegisterRwa` не принимает выбранного вызывающего `id`, и не принимает `owner` Поле. орган по сделке становится первоначальным `owned_by` Расчет, и время выполнения генерирует `RwaId` в целевой области.

Текстовая форма RWA ID составляет:

```text
<generated-hash>$<domain>
```

Например:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Заявки должны хранить свой бизнес-идентификатор в `primary_reference` или `metadata`, а затем обнаруживать генерируемый `RwaId` из `RwaEvent::Created`, `FindRwas`, `/v1/rwas`, или маршрут исследователя, установленный после выполнения сделки.

## жизненный цикл {#lifecycle}

Общие RWA рабочие процессы включают:

|Операция |Реализованное поведение |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |Создать генерируемый ID лот в домене; уполномоченный орган по сделке становится `owned_by`. |
|`TransferRwa` |Перемещение количества на другую учетную запись. Полный перевод может изменить `owned_by`; частичный перевод создает генерируемую партию детей. |
|`HoldRwa` |Резервное количество. Требует конфигурированный контроллер и `hold_enabled`. |
|`ReleaseRwa` |Удалить задержанное количество. Требует конфигурированный контроллер и `hold_enabled`. |
|`FreezeRwa` |Блокировать обычные операции владельца. требует конфигурированного контроллера и `freeze_enabled`. |
|`UnfreezeRwa` |Возобновить обычные операции владельца. Требуется конфигурированный контроллер и `freeze_enabled`. |
|`RedeemRwa` |Сообщается о количестве, которое требует владельца или контроллера и `redeem_enabled`. |
|`MergeRwas` |Объединить количество от родительских партий с одной доменой и спецификации в генерируемый детский лот. |
|`ForceTransferRwa` | Перемещение количества через поток контроллера требует конфигурированного контроллера и `force_transfer_enabled`.                    |
|`SetRwaControls` |Заменить правила контроля партии, требует владельца или контролера. |
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Обновление метаданных лота. Требует владельца или контролера; замороженные лоты требуют контроллера. |

В текущем коде не указано инструкции `UnregisterRwa`.Выведите лот вне цепи с `RedeemRwa`, когда представленное количество доставляется, потребляется, распределяется или иным образом удаляется из обращения.

## Метаданные и контроль {#metadata-and-controls}

Используйте метаданные для компактных фактов, которые помогут приложениям идентифицировать и проверить партию:

- ссылка на класс активов, эмитента, хранителя или регистра
- идентификаторы складов, хранилищ, ISIN, счетов или сертификатов
- хэши содержимого для удостоверений и юридических документов
- SoraFS пути или проявленные ссылки на большие объемы доказательств
- маркировки сроков действия, юрисдикции или соответствия, используемые услугами вне цепочки;

Реализованный `RwaControlPolicy` имеет следующие поля:

```json
{
  "controller_accounts": [],
  "controller_roles": [],
  "freeze_enabled": true,
  "hold_enabled": true,
  "force_transfer_enabled": false,
  "redeem_enabled": true
}
```

Аккаунты и роли контроллера разрешены для выполнения только операций контроллера, включенных соответствующим булевым флагом. Нынешняя полезная нагрузка управления не является политикой передачи списка разрешений и не содержит законы `transfers`.

## Вопросы, события и APIs {#queries-events-and-apis}

Используйте [`FindRwas`](/ru/reference/queries.md#assets-nfts-and-rwas), чтобы перечислить зарегистрированные лоты RWA. Приложения, которые нуждаются в живых обновлениях, могут подписаться на [`Rwa` события данных ](/ru/blockchain/filters.md#data-event-filters) для создания, изменения владельца, разделения, слияния, выкупа, заморожения, размораживания, удержания, высвобождения, силового переноса, контроля-измены. и метаданных событий.

Torii раскрывает маршруты цепного состояния, такие как: `/v1/rwas` и `/v1/rwas/query`, плюс маршруты исследователей, такие как: `/v1/explorer/rwas` и `/v1/explorer/rwas/{rwa_id}` генерируемые клиенты должны предпочитать прямой [`/openapi`](/ru/reference/torii-endpoints.md#common-endpoints) документ для точной формы ответа, выявленной узлом.

### Попробуй на Taira {#try-it-on-taira}

Проверьте, зарегистрировано ли общественное Taira в настоящее время партию RWA:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Перечислить маршруты RWA, выявленные в документе Taira OpenAPI:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Пустое `items` выпуск ожидается, когда публичных партий еще не зарегистрировано.

## Попробуй . {#try-it}

В приведенных ниже примерах используются поверхности Python SDK из [Shared Setup](/ru/guide/tutorials/python.md#shared-setup). Замените счет IDs, частные ключи и генерируемый лот IDs значениями из вашей собственной сети перед отправкой транзакции.

### Открыть маршруты RWA API {#discover-rwa-api-routes}

В этом примере, предназначенном только для чтения, задается вопрос о запущенном узле Torii, который включает в себя маршруты RWA, направленные на приложение:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

Если список пустой, узел может по-прежнему поддерживать инструкции и запросы RWA через другие Torii APIs, но он не раскрывает факультативную семейство маршрутов JSON.

### Запись квитанции на складе {#register-a-warehouse-receipt}

Используйте проект, когда одно деловое действие должно стать одной подписанной транзакцией. номер бизнес-реквизита входит в `primary_reference`; бухгалтерский учет ID генерируется после того, как сделка принимает обязательства.

```python
from iroha_python import TransactionConfig, TransactionDraft

config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    metadata={**TX_METADATA, "source": "rwa-docs"},
)

draft = TransactionDraft(config)
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "inspection_report": "sorafs://reports/copper-001.json",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

После выполнения транзакции список генерируется RWA IDs. Маршруты цепочного состояния раскрывают канонический IDs; используйте маршруты событий или исследователей, когда вам нужно сопоставить ID обратно с `primary_reference` или метаданными:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Кнопки с Explorer также могут возвращать более богатые прогнозы:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Перевод с временной задержкой {#transfer-with-a-temporary-hold}

Используйте генерируемые RWA ID Этот пример предполагает, что `alice` является владельцем и также конфигурирована в качестве контроллера с `hold_enabled`.

```python
warehouse_lot_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.transfer_rwa(warehouse_lot_id, quantity="10", destination=bob)
draft.hold_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Освободить закладку, когда процесс вне цепи завершен:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Добавление контрольных и аудиторских метаданных {#add-controls-and-audit-metadata}

Контроль и метаданные разделены. Используйте контрольные элементы для политики контроллера, а метаданные для фактов, которые должны быть отображены приложениями или аудиторами:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.set_rwa_controls(
    warehouse_lot_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)
draft.set_rwa_key_value(warehouse_lot_id, "auditor", "alice")
draft.set_rwa_key_value(
    warehouse_lot_id,
    "proof_hash",
    "sha256:2b1c7a4e...",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Количество выкупа или отчисления на пенсию {#redeem-or-retire-quantity}

Количество выкупа, когда представленный актив вне цепочки был доставлен, потреблен, выведен на пенсию; или иным образом исключены из обращения. `redeem_enabled`, и подписант должен быть владельцем или контролером.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Заморозка во время проверки соответствия {#freeze-during-compliance-review}

Замораживать партию, когда проверка вне цепи должна блокировать обычные операции владельца. Подписчик должен быть контролером и партия должна иметь `freeze_enabled`.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.freeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {
        "status": "frozen",
        "reason": "custodian inventory check",
        "case_id": "OPS-2026-0042",
    },
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Разморозить его после прохождения проверки:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.unfreeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {"status": "cleared", "case_id": "OPS-2026-0042"},
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Поступление счета {#invoice-receivable}

Представьте счёт в виде партии RWA путем хранения номера счета в `primary_reference` и метаданных. После регистрации используйте генерируемый ID для передачи и выкупа.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.register_rwa(
    {
        "domain": "receivables.universal",
        "quantity": "50000",
        "spec": {"scale": 2},
        "primary_reference": "INV-2026-0007",
        "status": "issued",
        "metadata": {
            "asset_class": "invoice",
            "currency": "USD",
            "debtor": "example-buyer",
            "due_date": "2026-06-30",
            "document_hash": "sha256:4df4c8...",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": False,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Когда задолженность финансируется или оплачивается, используйте выработанную партию счетов ID:

```python
invoice_lot_id = (
    "fedcba9876543210fedcba9876543210"
    "fedcba9876543210fedcba9876543210$receivables.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.transfer_rwa(invoice_lot_id, quantity="50000", destination=bob)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Выкупить представленную сумму после расчета вне цепочки:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Углеродный кредит {#carbon-credit-retirement}

Используйте выкуп для получения кредитов после того, как они получены. Метаданные указывают на сертификат вне цепи или доказательство регистрации:

```python
carbon_lot_id = (
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$carbon.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(carbon_lot_id, quantity="250")
draft.set_rwa_key_value(
    carbon_lot_id,
    "retirement_certificate",
    "sorafs://certificates/carbon-credit-2026-001-retired.json",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Соедините две партии {#merge-two-lots}

Объединение лотов при объединении двух позиций вне цепи. Родители должны находиться в одной области и использовать одну и ту же спецификацию количества. Время выполнения генерирует детский лот ID.

```python
warehouse_lot_id_2 = (
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.merge_rwas(
    {
        "parents": [
            {"rwa": warehouse_lot_id, "quantity": "40"},
            {"rwa": warehouse_lot_id_2, "quantity": "60"},
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "merge_reason": "same custodian and quality grade",
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Для полного примера сделки Python см. [Real-World Assets](/ru/guide/tutorials/python.md#real-world-assets).

## Сопутствующие документы {#related-docs}

- [Активы](/ru/blockchain/assets.md)
- [Метаданные](/ru/blockchain/metadata.md)
- [Iroha Специальные инструкции](/ru/blockchain/instructions.md)
- [Запросы](/ru/reference/queries.md#assets-nfts-and-rwas)
- [конечные точки Torii](/ru/reference/torii-endpoints.md#app-and-sora-route-families)
