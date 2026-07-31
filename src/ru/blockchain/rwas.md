---
translation_locale: ru
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Активы в реальном мире {#real-world-assets}

Реальные активы (RWAs) модели активов вне цепочки, в собственности или контроле над которыми
Он отслеживается в цепочке. Iroha, в) RWA является зарегистрированной книжной партией с
генерируемый идентификатор, учетная запись владельца, количество, бизнес-метаданные;
происхождение и дополнительные контрольные показатели жизненного цикла.

RWAs отличаются от количественных балансов активов:

- Цифровой актив - суммарный баланс, содержащийся на счете
- в) NFT является уникальной записью в цепочке с одним владельцем
- в) RWA это много, которое может содержать бизнес-метаданные, количество, хранилища,
  замораживания, состояние искупления, происхождение и политика контроллера

Использование RWAs когда реестр должен представлять конкретную партию вне цепочки
Вместо того, чтобы быть просто сгубимым балансом.

## RWA Лот {#rwa-lot}

Сборник RWA партия содержит:

- `id`: генерируемый канонический RWA идентификатор, отображаемый как
  `<hash>$<domain>`
- `owned_by`: счет, который в настоящее время владеет лотом
- `quantity`: неиспользуемое количество, представленное партией
- `spec`: количественная спецификация, например десятичная шкала
- `primary_reference`: главный расчет, сертификат, счет вне цепочки; или
  ссылка на реестр
- `status`: текст о статусе бизнеса
- `metadata`: компактный JSON поля, используемые для бизнес-контекста и индексации
- `parents`: источники лотов, используемые для получения этой партии
- `controls`: учетные записи контроллера, роли контроллера и включенный контроллер
  операции
- `is_frozen` и `held_quantity`: состояние жизненного цикла, выполняемое по времени работы

Сохраняйте на цепочке полезную нагрузку компактной.
отчетов и аудиторских пакетов за пределами WSV, Потом запиши его. URI, SoraFS
путь, или явная ссылка в RWA метаданные.

## Идентификаторы {#identifiers}

`RegisterRwa` не принимает выбранного звонка `id`, и не принимает
в) `owner` Поле: орган по сделке становится первичным `owned_by`
расчет, и время выполнения генерирует `RwaId` в целевой области.

Текстовая форма RWA ID является:

```text
<generated-hash>$<domain>
```

Например:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Заявки должны хранить свой бизнес-идентификатор в `primary_reference`
или `metadata`, Потом вы обнаружите, что они созданы. `RwaId` от
`RwaEvent::Created`, `FindRwas`, `/v1/rwas`, или маршрут исследователей
после того, как сделка обязуется.

## жизненный цикл {#lifecycle}

Общие RWA рабочие процессы включают:

| Операция                                  | Реализованное поведение                                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              | Создайте генерируемый...ID лот в домене; орган по сделке становится `owned_by`.                                       |
| `TransferRwa`                              | Переместить количество на другой счет. `owned_by`; частичная передача создает генерируемую партию детей. |
| `HoldRwa`                                  | Резервное количество. Требуется конфигурированный контроллер и `hold_enabled`.                                                     |
| `ReleaseRwa`                               | Удалить удерживаемое количество. `hold_enabled`.                                                 |
| `FreezeRwa`                                | Блокировать обычные операции владельца. `freeze_enabled`.                                    |
| `UnfreezeRwa`                              | Возобновить обычные операции владельца. Требуется конфигурированный контроллер и `freeze_enabled`.                                |
| `RedeemRwa`                                | Требует владельца или контролера и `redeem_enabled`.                                                  |
| `MergeRwas`                                | Объединить количества из родительских партий с одной доменой и спецификации в генерируемый детский лот.                              |
| `ForceTransferRwa`                         | Перемещение количества через поток контроллера. `force_transfer_enabled`.                    |
| `SetRwaControls`                           | Заменить политику контроля партии.                                                        |
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` | Обновление метаданных лота. Требует владельца или контроллера; замороженные лоты требуют контроллера.                                 |

Нет. `UnregisterRwa` Укажите инструкцию в текущем коде.
лот вне цепи с `RedeemRwa` при доставке представленного количества,
употребляется, устанавливается или иным образом исключается из обращения.

## Метаданные и контроль {#metadata-and-controls}

Использование метаданных для компактных фактов, которые помогают приложениям идентифицировать и проверять
лот:

- Ссылка на класс активов, эмитента, хранителя или реестра
- склад, хранилище, ISIN, идентификаторы счета или сертификата
- хэши содержимого для удостоверений и юридических документов
- SoraFS пути или проявленные ссылки на более крупные пакеты доказательств
- маркировки по сроку роста, юрисдикции или соответствию, используемые внецепочным сервисом

Реализованные `RwaControlPolicy` имеет следующие поля:

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

Счета и роли контролера могут выполняться только контролером
Операции, включенные соответствующим булевым флагом.
полезная нагрузка не является политикой перечисления разрешенного списка и не содержит заложенных
`transfers` Правила.

## Вопросы, события и APIs {#queries-events-and-apis}

Использование [`FindRwas`](/ru/reference/queries.md#assets-nfts-and-rwas) перечислить
зарегистрировано RWA Приложения, которые нуждаются в живых обновлениях могут подписаться на
[`Rwa` события данных](/ru/blockchain/filters.md#data-event-filters) Для тех, кто сотворен.
изменение владельца, разделение, слияние, выкуп, заморожение, размораживание, хранение, высвобождение;
силовой передачи, смены управления и события метаданных.

Torii раскрывает маршруты цепного состояния, такие как: `/v1/rwas` и `/v1/rwas/query`,
плюс маршруты исследователей, такие как `/v1/explorer/rwas` и
`/v1/explorer/rwas/{rwa_id}` когда включена семья маршрутов.
Клиенты должны предпочитать живое
[`/openapi`](/ru/reference/torii-endpoints.md#common-endpoints) документ для
точная форма ответа, выявленная узлом.

### Попробуй . Taira {#try-it-on-taira}

Проверьте, публично ли Taira в настоящее время зарегистрирована RWA множество:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Перечислить RWA маршруты, которые подвергаются воздействию живых Taira OpenAPI документ:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Пустое `items` выпуск ожидается, когда публичных партий еще не зарегистрировано.
Регистрация, передача, хранение, замораживание и выкуп - это подписанные сделки.

## Попробуй . {#try-it}

В приведенных ниже примерах используется Python SDK поверхности из
[Совместная установка](/ru/guide/tutorials/python.md#shared-setup). Заменить
учетный счет IDs, частные ключи, и генерируемый лот IDs с собственными ценностями
сеть перед отправкой сделки.

### Откройте RWA API Маршруты {#discover-rwa-api-routes}

Этот пример для чтения требует бега Torii узел, на который обращается приложение RWA
маршруты включены:

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

Если список пустой, узел может по-прежнему поддерживать RWA инструкции и
запросы через другие Torii APIs, Но это не выявляет необязательного JSON
Род семья.

### Зарегистрируйте квитанцию на складе {#register-a-warehouse-receipt}

Используйте проект, когда одно дело должно стать одной подписанной транзакцией.
Номер расписки по делу входит `primary_reference`; Книга ID является
полученные после принятия обязательств по сделке.

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

После выполнения сделки обязательства, созданный список RWA IDs. Маршруты по цепочке государств
раскрыть канонические IDs; использовать события или маршруты исследователей, когда вы
необходимость соответствовать ID назад к `primary_reference` или метаданные:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Кнопки с Explorer также могут возвращать более богатые проекции:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Перевод с временной задержкой {#transfer-with-a-temporary-hold}

Используйте генерируемые RWA ID В этом примере предполагается, что
`alice` является владельцем и также конфигурируется в качестве контроллера с
`hold_enabled`.

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

Освободить удерживание, когда процесс вне цепи завершен:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Добавление контрольных и аудиторских метаданных {#add-controls-and-audit-metadata}

Контроль и метаданные разделены.
метаданные о фактах, которые должны быть показаны заявлениями или аудиторами:

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

### Количество выкупа или выхода на пенсию {#redeem-or-retire-quantity}

Количество выкупа, когда представленный актив вне цепочки был доставлен;
выпущенные из обращения, ушедшие на пенсию или иным образом исключенные.
`redeem_enabled`, и подписант должен быть владельцем или контролером.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Заморозка во время проверки соответствия {#freeze-during-compliance-review}

Замораживать много, когда вне цепочки обзор должен блокировать обычные операции владельца.
Подписчик должен быть контролером и партия должна иметь `freeze_enabled`.

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

Разморозить его после прохождения обзора:

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

Представлять счет как RWA партию путем хранения номера счета в
`primary_reference` После регистрации используйте генерируемые ID
для перевода и выкупа.

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

При финансировании или оплате задолженности используйте выработанный пакет счетов ID:

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

### Пенсионный кредит на углерод {#carbon-credit-retirement}

Используйте выкуп, чтобы получить пенсию после получения кредитов.
указывает на сертификат вне цепи или доказательство регистрации:

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

Слияние лотов при объединении двух позиций вне цепочки.
быть в одном и том же домене и использовать те же объемы спецификации.
детский лот ID.

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

Для полного Python пример транзакции, см.
[Активы в реальном мире](/ru/guide/tutorials/python.md#real-world-assets).

## Сопутствующие документы {#related-docs}

- [Активы](/ru/blockchain/assets.md)
- [Метаданные](/ru/blockchain/metadata.md)
- [Iroha Специальные инструкции](/ru/blockchain/instructions.md)
- [Вопросы](/ru/reference/queries.md#assets-nfts-and-rwas)
- [Torii конечные точки](/ru/reference/torii-endpoints.md#app-and-sora-route-families)
