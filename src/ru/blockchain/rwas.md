---
translation_locale: ru
translation_source: /blockchain/rwas.md
translation_source_hash: 8d64a9a17c93f60306c279e8656e6edde8ce5dd024e742218bfb9572b7438bb0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Активы реального мира {#real-world-assets}

Реальные активы (RWAs) моделируют внецепочечные активы, чья собственность или контроль отслеживаются в цепочке. В Iroha RWA является зарегистрированным распределенным реестровым лотом в блокчейне с сгенерированным идентификатором, учетной записью владельца, количеством, бизнес-метаданными, происхождением, и дополнительные элементы управления жизненным циклом.

RWAs отличаются от числовых балансов активов:

- числовой актив — это взаимозаменяемый баланс, принадлежащий счёту
- ан NFT — это уникальная запись в блокчейне с одним владельцем
- «RWA» — это лот, который может содержать бизнес-метаданные, количество, удержания, заморозки, состояние выкупа, происхождение и политику контроллера

Используйте RWAs, когда распределённый блокчейн-реестр должен представлять конкретный внецепочечный лот, а не только взаимозаменяемый баланс.

## RWA Лот {#rwa-lot}

В RWA пакете содержится:

- `id`: сгенерированный канонический идентификатор RWA, отображаемый как `<hash>$<domain>`
- `owned_by`: учетная запись, которая в настоящее время владеет участком
- `quantity`: невыполненное количество, представленное лотом
- `spec`: спецификация количества, такая как десятичная шкала
- `primary_reference`: основной внецепочечный протокол, запись результата, сертификат, счет или ссылка на реестр
- `status`: необязательный текст статуса бизнеса
- `metadata`: компактные JSON поля, используемые для бизнес-контекста и индексирования
- `parents`: исходные партии, использованные для получения этой партии
- `controls`: учетные записи контроллера, роли контроллера и включенные операции контроллера
- `is_frozen` и `held_quantity`: состояние жизненного цикла, обеспечиваемое средой выполнения программного обеспечения

Держите полезную нагрузку на цепочке компактной. Храните большие юридические документы, инспекционные отчеты и аудиторские пакеты вне WSV, затем поместите криптографическое значение дайджеста, URI, путь SoraFS или ссылку на технический манифест в метаданных RWA.

## Идентификаторы {#identifiers}

`RegisterRwa` не принимает выбранный клиентом `id`, и он не принимает поле `owner`. Основной принцип авторизации транзакции становится начальным аккаунтом `owned_by`, а программная среда выполнения генерирует `RwaId` в целевом домене.

Текстовая форма идентификатора RWA следующая:

```text
<generated-hash>$<domain>
```

Например:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Приложения должны сохранять бизнес-идентификатор в `primary_reference` или `metadata`, а затем получать созданный `RwaId` из `RwaEvent::Created`, `FindRwas`, `/v1/rwas` или набора маршрутов обозревателя после финализации транзакции.

## Жизненный цикл {#lifecycle}

Обычные рабочие процессы RWA включают:

|Операция|Реализованное поведение|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa`                              |Создайте лот с сгенерированным идентификатором в домене; основным принципом авторизации транзакции становится `owned_by`.|
| `TransferRwa`                              |Переместите количество на другой счет. Полный перевод может изменить `owned_by`. Частичный перевод создает отдельную дочернюю партию с сгенерированным идентификатором.|
| `HoldRwa`                                  |Резервное количество. Требуется настроенный контроллер и `hold_enabled`.|
| `ReleaseRwa`                               |Удалить удерживаемое количество. Требуется настроенный контроллер и `hold_enabled`.|
| `FreezeRwa`                                |Блокировать обычные операции владельца. Требуется настроенный контроллер и `freeze_enabled`.|
| `UnfreezeRwa`                              |Повторно включить обычные операции владельца. Требуется настроенный контроллер и `freeze_enabled`.|
| `RedeemRwa`                                |Постоянно уменьшить количество в обращении. Владельец или контролер могут отправить это, когда `redeem_enabled` истинно.|
|`MergeRwas`                                |Объедините количества из родительских партий с одинаковым доменом и спецификацией в созданную дочернюю партию.|
|`ForceTransferRwa`|Переместите количество через поток контроллера. Требуется настроенный контроллер и `force_transfer_enabled`.|
| `SetRwaControls`                           |Замените политику контроля партий. Требуется владелец или контролер.|
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Обновить метаданные лота. Требуется владелец или контролер; замороженные лоты требуют контролера.|

В текущем коде нет инструкции `UnregisterRwa`. Выведите из эксплуатации оффчейн-парт с `RedeemRwa`, когда представленное количество будет доставлено, потреблено, урегулировано или иным образом выведено из обращения.

## Метаданные и элементы управления {#metadata-and-controls}

Используйте метаданные для сжатых фактов, которые помогают приложениям идентифицировать и проверять лот:

- класс активов, эмитент, депозитарий или справка реестра
- склад, хранилище, ISIN, идентификаторы накладной или сертификата
- криптографические хэши содержимого для аттестаций и юридических документов
- SoraFS пути или ссылки на технический манифест для больших пакетов доказательств
- показатели зрелости, юрисдикции или соответствия, используемые внецепочечными сервисами

В реализованном `RwaControlPolicy` есть следующие поля:

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

Учетные записи и роли контроллера могут выполнять только те операции, которые включены соответствующими логическими флагами. Текущий контрольный пакет содержит идентификаторы контроллеров и флаги операций. Белые списки передачи и вложенные правила `transfers` находятся за пределами этого пакета.

## Запросы, События и APIs {#queries-events-and-apis}

Использовать [`FindRwas`](/ru/reference/queries.md#assets-nfts-and-rwas) перечислить зарегистрированные RWA много. Приложения, которым нужны обновления в реальном времени, могут подписываться на [`Rwa` события данных](/ru/blockchain/filters.md#data-event-filters) для созданного, измененного владельцем, разделенного, объединенного, погашенного, замороженного, размороженного, события удержания, выпуска, передачи силы, изменения контроля и метаданных.

Torii предоставляет маршруты состояния цепочки, например `/v1/rwas` и `/v1/rwas/query`, а при включении соответствующего семейства — маршруты обозревателя, например `/v1/explorer/rwas` и `/v1/explorer/rwas/{rwa_id}`. Чтобы получить точную форму ответа конкретного узла, сгенерированные клиенты должны использовать актуальный документ [`/openapi.json`](/ru/reference/torii-endpoints.md#common-endpoints).

### Запустите этот рабочий процесс на Taira {#try-it-on-taira}

Проверьте, зарегистрированы ли в настоящее время у публичного Taira участки RWA:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Перечислите маршруты RWA, доступные в активном документе Taira OpenAPI:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Ожидается пустой вывод `items`, когда публичные лоты еще не зарегистрированы. Регистрация, передача, удержание, заморозка и выкуп являются подписанными транзакциями.

## Попробуйте {#try-it}

Примеры ниже используют поверхности Python SDK из [Общая настройка](/ru/guide/tutorials/python.md#shared-setup). Замените идентификаторы аккаунтов, приватные ключи и сгенерированные идентификаторы лотов на значения из вашей собственной сети перед отправкой транзакции.

### Откройте маршруты RWA API {#discover-rwa-api-routes}

Этот пример только для чтения запрашивает у запущенного узла Torii, какие маршруты RWA, доступные для приложений, включены:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi.json", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

Если список пуст, узел все равно может поддерживать инструкции и запросы RWA через другие Torii APIs, но он не предоставляет дополнительное семейство маршрутов JSON.

### Зарегистрировать запись о результате протокола склада {#register-a-warehouse-receipt}

Используйте черновик, когда одно бизнес-действие должно стать одной подписанной транзакцией. Номер записи результата бизнес-протокола идет в `primary_reference`; идентификатор распределенного реестра блокчейна создается после завершения транзакции.

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

После завершения транзакции сгенерируйте список идентификаторов RWA. Маршруты состояния цепочки отображают канонические идентификаторы; используйте события или маршруты деталей обозревателя, когда нужно сопоставить идентификатор с `primary_reference` или метаданными:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Узлы с поддержкой Explorer также могут возвращать более подробные проекции:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Перевод с временной задержкой {#transfer-with-a-temporary-hold}

Используйте сгенерированный идентификатор RWA, возвращённый цепочкой. В этом примере предполагается, что `alice` является владельцем и также настроен как контроллер с `hold_enabled`.

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

Отправьте `ReleaseRwa` после успешного завершения внецепочного процесса:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Добавить элементы управления и метаданные аудита {#add-controls-and-audit-metadata}

Контролы и метаданные разделены. Используйте контролы для политики контроллера, а метаданные — для фактов, которые приложения или аудиторы должны отображать:

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

### Выкупить или вывести из эксплуатации Количество {#redeem-or-retire-quantity}

Отправьте `RedeemRwa` после того, как представленный актив вне цепочки будет доставлен, использован, выведен из эксплуатации или иным образом удален из обращения. Это навсегда вычитает отправленное количество из лота. Лот должен иметь `redeem_enabled`. Криптографический подписант должен быть владельцем или контролером.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Заморозить во время проверки на соответствие {#freeze-during-compliance-review}

Отправьте `FreezeRwa`, когда внецепочный обзор должен блокировать обычные операции владельца. Криптографическим подписантом должен быть контроллер. Лот должен иметь `freeze_enabled`.

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

Отправьте `UnfreezeRwa` после прохождения проверки:

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

### Счёт к получению {#invoice-receivable}

Представьте счет как лот RWA, сохранив номер счета в `primary_reference` и метаданные. После регистрации используйте сгенерированный идентификатор для перевода и погашения.

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

Когда дебиторская задолженность финансируется или оплачивается, используйте сгенерированный идентификатор партии счета:

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

Погасите представленную сумму после расчетов по финансовой транзакции вне цепочки:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Вывод углеродного кредита из обращения {#carbon-credit-retirement}

Отправьте `RedeemRwa`, чтобы вывести заявленные углеродные кредиты из обращения. Сохраните внецепочечный сертификат или подтверждение из реестра в метаданных:

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

### Объединить две партии {#merge-two-lots}

Объединяйте лоты, когда два внецепочечных положения консолидируются. Родительские позиции должны находиться в одной области и использовать одно и то же указание количества. Среда выполнения программного обеспечения генерирует идентификатор дочернего лота.

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

Для полного примера транзакции Python см. [Активы реального мира](/ru/guide/tutorials/python.md#real-world-assets).

## Связанные документы {#related-docs}

- [Активы](/ru/blockchain/assets.md)
- [Метаданные](/ru/blockchain/metadata.md)
- [Iroha Инструкционные операции](/ru/blockchain/instructions.md)
- [Запросы](/ru/reference/queries.md#assets-nfts-and-rwas)
- [Torii API конечные точки](/ru/reference/torii-endpoints.md#app-and-sora-route-families)
