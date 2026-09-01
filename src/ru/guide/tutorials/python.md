---
translation_locale: ru
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Python {#python}

Python SDK в верхнем рабочем пространстве `iroha-python`. Первый выпуск Iroha 3 нацелен на текущие поверхности Torii и Norito. Закрепите версию пакета или источник ревизии, используемые вашей интеграцией, чтобы SDK и узел оставались на одной версии формата сериализации.

Приведённые ниже примеры анонимного чтения предназначены для общественности Taira на `https://taira.sora.org`. Маршрут может быть только для чтения и при этом требовать подпись канонического аккаунта или подпись точного сетевого оператора; эти примеры отмечены отдельно. Изменяющиеся примеры являются шаблонами транзакций и требуют настоящего Taira авторизационного субъекта, закрытого ключа, типизированного намерения оплаты комиссии, достаточного количества тестовой сети XOR и аутентификации, требуемой целевым маршрутом, прежде чем они могут быть отправлены.

Используйте примеры в этом порядке:

|Сцена|Выступать против публики Taira?|Что вам нужно|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|Анонимные пропущенные вызовы|Да| Python пакет плюс сетевой доступ|
|Чтение с аутентификацией учетной записи или оператора|Только с вашей собственной признанной личностью|Точный Taira `NetworkId` и соответствующий ключ аккаунта или оператора|
|Локальные генераторы подписей и инструкций|Нет сетевого вызова до `submit()`|Родное расширение и ваши ключевые материалы|
|Мутирующие транзакции и вызовы сервисов|Только с вашим собственным финансируемым аккаунтом|главный учетной записи для авторизации, приватный ключ, точный Taira `NetworkId`, введенный намерение комиссии, баланс активов комиссии и маршрутизировать токены|
|Подключите кодеки кадров, криптографию и помощники GPU|Только местный|Нативное расширение; помощники GPU также нуждаются в бэкенде, поддерживающем CUDA|

## Установить {#install}

Имя метаданных пакета — `iroha-python`. Не следует предполагать, что неприкрепленная установка PyPI соответствует живой сети Taira. Установите wheel или рабочую копию исходного кода, которая была собрана из той же версии исходного кода, на которую нацелена ваша интеграция:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Если ваш проект использует рабочее пространство upstream напрямую, установите зависимости Python и соберите нативное расширение перед запуском примеров, которые используют `Instruction`, `TransactionDraft`, подпись, крипто, SoraFS нативные помощники, GPU помощники или кодеки Connect frame. Используйте команду сборки из исходного `python/iroha_python/README.md`, затем убедитесь, что нативные экспорты загружаются:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Если `create_torii_client` импортируется, но `Instruction` или `generate_ed25519_keypair` не удается, чистый пакет Python доступен, но нативное расширение недоступно.

## Быстрый старт {#quickstart}

Начните с общедоступных, только для чтения Taira API конечных точек:

```python
from iroha_python import (
    create_torii_client,
)

client = create_torii_client("https://taira.sora.org")

# Public reads do not need an authority or private key.
status = client.request_json("GET", "/status", expected_status=(200,))
accounts = client.list_accounts_typed(limit=5)

print(status["build"]["version"])
for account in accounts.items:
    print(account.id)
```

## Общая настройка {#shared-setup}

Используйте эту настройку для изменяющихся шаблонов. Замените каждый заполнитель на авторизационного субъекта Taira, приватный ключ, токен и идентификаторы активов/счетов из вашей среды перед отправкой.

`authority` — это аккаунт, который подписывает транзакцию, и `private_key` должен с ним совпадать. Транзакции привязаны к точному генезис-производному `NetworkId` от Taira; цепочка UUID — это метка развёртывания, а не идентификатор транзакции. Сборы используют типизированное намерение платежа и точную актуальную котировку, независимо от метаданных приложения. Знаки-заполнители для аккаунта и ключа ниже намеренно недействительны, чтобы их случайно не отправили.

Ниже приведена текущая закреплённая Taira идентификация генезиса блокчейна. Сброс тестовой сети может её изменить, поэтому обновляйте её из подписанного профиля развертывания и никогда не выводите её из цепочки UUID.

```python
from iroha_python import (
    Ed25519KeyPair,
    Instruction,
    LocalSigningContext,
    NetworkId,
    ToriiClient,
    ToriiCanonicalRequestAuth,
    TransactionConfig,
    TransactionDraft,
    authority_fee_payment,
)

TORII_URL = "https://taira.sora.org"
TAIRA_NETWORK_ID = NetworkId.parse(
    "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
)
AUTH_TOKEN = None

# Replace these placeholders with the real signing keys for your accounts.
alice_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<alice-private-key-hex>"))
bob_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<bob-private-key-hex>"))

# The authority string must identify the same account as the private key.
alice = "<alice-account-id>"
bob = "<bob-account-id>"

canonical_auth = ToriiCanonicalRequestAuth(
    network_id=TAIRA_NETWORK_ID.literal,
    account_id=alice,
    signer=alice_pair.sign,
)

ROSE_DEFINITION = "rose#wonderland"
ROSE_ASSET = "<rose-asset-id>"
BADGE_NFT = "badge$wonderland"

APP_METADATA = {"source": "python-docs"}
# Torii replaces the empty maxima with an exact, validated live fee quote before
# anything is signed. The payer remains the transaction authority.
BASE_FEE_PAYMENT = authority_fee_payment(charge_limits=[])

client = ToriiClient(
    TORII_URL,
    local_signing_context=LocalSigningContext(TAIRA_NETWORK_ID),
    canonical_request_auth=canonical_auth,
    auth_token=AUTH_TOKEN,
)


def submit(*instructions):
    draft = TransactionDraft(
        TransactionConfig(
            network_id=TAIRA_NETWORK_ID,
            authority=alice,
            fee_payment=BASE_FEE_PAYMENT,
            metadata=APP_METADATA,
        )
    )
    draft.extend_instructions(instructions)

    # Freeze one payload, obtain its exact fee limits, and sign that same payload.
    envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
    status = client.submit_transaction_envelope_and_wait(envelope)
    return envelope, fee_quote, status
```

`Instruction.*` вызывает только полезные нагрузки инструкции конструкции. `submit()` — это момент, когда SDK получает актуальную оценку стоимости комиссии, подписывает точно указанную полезную нагрузку, отправляет её в Torii и ожидает статус.

## Платы и стоимость исполнения транзакции {#fees-and-gas}

Транзакции записи требуют типизированного `FeePaymentIntent` и профинансированного баланса активов для оплаты комиссии. На Taira служба финансирования публичной тестовой сети финансирует тестовую сеть XOR. Python SDK отправляет фиксированную неподписанную полезная нагрузка для Torii для точной оценки стоимости комиссии, проверяет, что в котировке не заменили плательщика или полезную нагрузку, и подписывает котируемое намерение. Не помещайте выбор комиссии в метаданные транзакции.

Указанный выше помощник `submit()` начинается с намерения, оплаченного аккаунтом, подписывающим транзакцию, у которого лимиты комиссии намеренно пусты. `quote_and_sign()` заполняет их из текущей котировки перед подписью:

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=authority_fee_payment(charge_limits=[]),
        metadata={"source": "python-fee-example"},
    )
)
draft.add_instruction(
    Instruction.set_account_key_value(
        alice,
        "python_fee_example",
        "ready",
    )
)
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
status = client.submit_transaction_envelope_and_wait(envelope)

for limit in fee_quote["intent"]["value"]["charge_limits"]:
    print(limit["asset_definition_id"], limit["max_amount"])
```

Прежде чем отправлять записи, убедитесь, что учетная запись основного лица авторизации владеет достаточным количеством актива для оплаты комиссии. Конкретная служба финансирования тестовой сети и идентификатор актива зависят от сети; это форма Taira:

```python
FEE_ASSET_DEFINITION = "6TEAJqbb8oEPmLncoNiMRbLEK6tw"
# The faucet returns the concrete account asset ID to check here.
FEE_ASSET_ID = "<fee-asset-id-from-faucet-response>"

# Fail before submitting if the signer cannot pay gas.
fee_assets = client.list_account_assets_typed(
    alice,
    limit=10,
    asset_id=FEE_ASSET_ID,
)
if not fee_assets.items:
    raise RuntimeError("fund the authority account with the Taira fee asset first")
```

Сервис финансирования тестовой сети возвращает конкретный `asset_id` для проверки баланса. Убедитесь, что живая котировка списывает `FEE_ASSET_DEFINITION`; транзакция не выбирает этот актив через метаданные.

Метаданные приложения являются необязательными и не имеют семантики оплаты:

```python
APP_METADATA = {"source": "python-docs"}

draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)
```

Если вы пропустите указание о комиссии, примете предложение о непредвиденном активе, измените полезную нагрузку после получения котировки или подпишете с необеспеченного аккаунта, транзакция не должна быть отправлена.

## Аноним Taira Читает {#anonymous-taira-reads}

Эти вызовы используют маршруты Taira, граница каталога которых допускает анонимное чтение:

```python
client = create_torii_client("https://taira.sora.org")

# Use raw requests for endpoints that do not need a typed wrapper.
status = client.request_json("GET", "/status", expected_status=(200,))
parameters = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Typed helpers parse pagination and records into dataclasses.
accounts = client.list_accounts_typed(limit=1)
domains = client.list_domains_typed(limit=1)
definitions = client.list_asset_definitions_typed(limit=1)

# These calls inspect live node subsystems without mutating state.
time_now = client.get_time_now()

print(status["build"]["version"])
print(parameters["sumeragi"]["block_cadence_ms"])
print(accounts.total, domains.total, definitions.total)
print(time_now.now_ms)
```

`/v1/time/status` и каждый снимок данных оператора `/v1/sumeragi/*` требуют точной подписи сетевого оператора, даже если они не изменяют состояние. Используйте `request_json("GET", "/status")` для анонимного состояния узла полезная нагрузка и настройка оператора ниже для диагностики согласования или локальных часов узла. Статус подключения сессии является отдельным маршрутом протокола и требует токена управления этой сессии.

## Создатели инструкций {#instruction-builders}

SDK предоставляет типизированные построители для наиболее распространённых семейств инструкций и JSON запасной выход для вариантов, которые ещё не являются полноценными методами Python. Следующие фрагменты являются шаблонами мутирующих транзакций и не были отправлены в публичный Taira без учетной записи для подписи.

Предпочитайте типизированные вспомогательные функции, когда они существуют: они нормализуют значения Python и ранние выдачи ошибки при недопустимых формах. Используйте `Instruction.from_json` только тогда, когда вам нужна вариант инструкции, для которого еще нет помощника Python.

|Семья инструкций| Python поверхность|
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|Регистрация| `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` зарезервирован для инструментов создания/инициализации|
|Отменить регистрацию| `unregister_trigger`; используйте `Instruction.from_json` для других вариантов|
|Создание/Сжигание| `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions`                                                                                          |
|Перевод| `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa`                                                              |
|Метаданные и элементы управления| `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value`                                                                        |
| RWA жизненный цикл| `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa`|
| ExecuteTrigger | `execute_trigger` |
|Расширения репо/сделок| `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp`|
|Блокировки нативных активов| `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, плюс помощники клиента `*_and_wait`|
|Предоставить/Отозвать, SetParameter, Журнал, Пользовательский, Обновление и менее распространённые варианты регистрации/отмены регистрации| `Instruction.from_json` или `TransactionBuilder.add_instruction_json` с каноническим `InstructionBox` JSON|

Для условных платежей в стиле эскроу см. [Эскроу для родных активов](/ru/blockchain/escrow.md#python-asset-locks). Python в настоящее время предоставляет первоклассные вспомогательные средства для блокировки универсальных активов; вспомогательные средства для маркетплейсов и анонимного эскроу пока не являются первоклассными методами Python.

### Настройте домены, затем зарегистрируйте аккаунты и активы {#set-up-domains-then-register-accounts-and-assets}

Обычное создание домена проходит через декларативный планировщик алиасов, поэтому проверяются аренда SNS, возможности владельца, защита проверки стоимости комиссии и состояние домена вместе. Создайте намерение без секретов `AliasSetupPlanRequestV1` с помощью вашего SDK или сервиса адаптации, затем используйте `iroha app alias setup plan` и `iroha app alias setup apply`. Не отправляйте `Instruction.register_domain` из транзакции приложения; этот конструктор предназначен для инструментов создания/загрузки.

После завершения плана настройки домена зарегистрируйте объекты, принадлежащие домену. В общей сети, такой как Taira, используйте домен и пространство имен учетной записи, назначенное вам.

```python
# The domain and its SNS lease already exist before this transaction.
submit(
    Instruction.register_account(alice, {"display_name": "Alice"}),
    Instruction.register_account(bob, {"display_name": "Bob"}),
    Instruction.register_asset_definition_numeric(
        ROSE_DEFINITION,
        owner=alice,
        scale=2,
        mintable="Infinitely",
        confidential_policy="TransparentOnly",
        metadata={"symbol": "ROS"},
    ),
)
```

`mintable` принимает значения `Infinitely`, `Once`, `Not` или `Limited(n)`, допустимые для модели данных. Опустите `scale` для неконстрейнтного числового актива.

### выпускать, уничтожать и передавать активы {#mint-burn-and-transfer-assets}

Эти вызовы используют существующий идентификатор актива. Сначала зарегистрируйте определение актива, затем создайте конкретный идентификатор актива для аккаунта, который владеет активом.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Передать право собственности {#transfer-ownership}

Передача права собственности изменяет того, кто контролирует домен, определение актива или NFT. Используйте текущего владельца в качестве основного лица для авторизации транзакции.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Установить и удалить метаданные {#set-and-remove-metadata}

Значения метаданных должны быть сериализуемыми по JSON. При использовании `TransactionDraft` главный элемент авторизации в `TransactionConfig` становится учетной записью по умолчанию.

```python
# Values are encoded as JSON metadata under the target account.
submit(
    Instruction.set_account_key_value(
        alice,
        "profile",
        {"display_name": "Alice", "tier": "operator"},
    )
)

# Removing the key deletes the metadata entry from the account.
submit(Instruction.remove_account_key_value(alice, "profile"))
```

Помощник высокого уровня по составлению черновиков по умолчанию нацелен на главный принцип авторизации транзакции:

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### Активы реального мира {#real-world-assets}

RWA помощники используют JSON-сериализуемые полезные нагрузки для метаданных, происхождения и политики контроллера, специфичных для активов. `register_rwa` не принимает `id` или `owner`: время выполнения программного обеспечения генерирует `RwaId`, и субъект авторизации транзакции становится первоначальным владельцем.

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)

# Register the lot in a domain. Store business identifiers in primary_reference
# or metadata, then query the generated RWA ID after the transaction commits.
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "commodity": "copper",
            "warehouse": "DXB-01",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": True,
            "redeem_enabled": True,
        },
    }
)
```

После завершения регистрационной транзакции используйте `FindRwas`, `/v1/rwas`, событие RWA или маршрут обозревателя для обнаружения сгенерированного идентификатора:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Последующие операции используют сгенерированный идентификатор `hash$domain`:

```python
registered_rwa_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)

# Transfer, hold, release, freeze, and redeem model the lot lifecycle.
draft.transfer_rwa(
    registered_rwa_id,
    quantity="10",
    destination=bob,
)
draft.hold_rwa(registered_rwa_id, quantity="5")
draft.release_rwa(registered_rwa_id, quantity="5")
draft.freeze_rwa(registered_rwa_id)
draft.unfreeze_rwa(registered_rwa_id)
draft.redeem_rwa(registered_rwa_id, quantity="1")

# RWA metadata and controls are separate from account metadata.
draft.set_rwa_key_value(registered_rwa_id, "auditor", "alice")
draft.remove_rwa_key_value(registered_rwa_id, "auditor")
draft.set_rwa_controls(
    registered_rwa_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)

# Merge consumes quantities from parent lots with the same domain and spec. The
# child lot gets a generated ID.
draft.merge_rwas(
    {
        "parents": [
            {"rwa": registered_rwa_id, "quantity": "40"},
            {
                "rwa": "fedcba9876543210fedcba9876543210"
                "fedcba9876543210fedcba9876543210$commodities.universal",
                "quantity": "60",
            },
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {"merge_reason": "same custodian and quality grade"},
    }
)

# Force transfer requires a configured controller and force_transfer_enabled.
draft.force_transfer_rwa(
    registered_rwa_id,
    quantity="1",
    destination=bob,
)
```

Полные передачи могут изменить `owned_by` на существующем лоте. Частичные передачи и объединения создают сгенерированные дочерние лоты.

### Триггеры {#triggers}

Используйте помощники регистрации триггеров, когда исполняемый файл является другой последовательностью инструкций:

```python
# The trigger executable is just another instruction payload.
reward = Instruction.mint_asset_numeric(ROSE_ASSET, "1")

# Time triggers run on a schedule once registered.
register_hourly = Instruction.register_time_trigger(
    "hourly_reward",
    alice,
    [reward],
    start_ms=1_800_000_000_000,
    period_ms=3_600_000,
    repeats=24,
    metadata={"purpose": "docs"},
)
submit(register_hourly)

# Precommit triggers run during the transaction pipeline.
register_precommit = Instruction.register_precommit_trigger(
    "precommit_reward",
    alice,
    [reward],
    repeats=10,
    metadata={"purpose": "pipeline test"},
)
submit(register_precommit)

# Trigger execution and repetition changes are also transactions.
submit(Instruction.execute_trigger("hourly_reward", args={"reason": "manual"}))
submit(Instruction.mint_trigger_repetitions("hourly_reward", 5))
submit(Instruction.burn_trigger_repetitions("hourly_reward", 1))
submit(Instruction.unregister_trigger("hourly_reward"))
```

Torii также предоставляет REST помощников для управления инвентарем триггеров:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Вызовы инвентаризации триггеров только читают или проверяют записи триггеров. Регистрация, выполнение, изменения повторения и отмена регистрации являются мутационными операциями.

### Инструкции по расчетам по репо и финансовым операциям {#repo-and-settlement-instructions}

Помощники по репозиториям и двусторонним расчетам добавляют варианты инструкций, специфичные для домена, без ручного создания Norito полезных нагрузок:

```python
from iroha_python import (
    RepoCashLeg,
    RepoCollateralLeg,
    RepoGovernance,
    SettlementAtomicity,
    SettlementExecutionOrder,
    SettlementLeg,
    SettlementPlan,
)

config = TransactionConfig(
    network_id=TAIRA_NETWORK_ID,
    authority=alice,
    fee_payment=BASE_FEE_PAYMENT,
    # Keep repo and settlement examples bounded by a short TTL.
    ttl_ms=120_000,
    metadata=APP_METADATA,
)
draft = TransactionDraft(config)

# Each repo leg describes one side of the financing agreement.
cash = RepoCashLeg(asset_definition_id="usd#wonderland", quantity="1000")
collateral = RepoCollateralLeg(
    asset_definition_id="bond#wonderland",
    quantity="1050",
    metadata={"isin": "ABC123"},
)
governance = RepoGovernance(haircut_bps=1500, margin_frequency_secs=86_400)

# Domain-specific draft methods append the corresponding instructions.
draft.repo_initiate(
    agreement_id="daily_repo",
    initiator=alice,
    counterparty=bob,
    cash_leg=cash,
    collateral_leg=collateral,
    rate_bps=250,
    maturity_timestamp_ms=1_704_000_000_000,
    governance=governance,
)
draft.repo_margin_call("daily_repo")
# Unwind uses the immutable counterparties, legs, and maturity stored on-chain.
draft.repo_unwind("daily_repo")

# DVP/PVP settlement plans encode ordering and atomicity for both legs.
delivery = SettlementLeg(
    asset_definition_id="bond#wonderland",
    quantity="10",
    from_account=alice,
    to_account=bob,
    metadata={"isin": "ABC123"},
)
payment = SettlementLeg(
    asset_definition_id="usd#wonderland",
    quantity="1000",
    from_account=bob,
    to_account=alice,
)
plan = SettlementPlan(
    order=SettlementExecutionOrder.PAYMENT_THEN_DELIVERY,
    atomicity=SettlementAtomicity.ALL_OR_NOTHING,
)

draft.settlement_dvp(
    settlement_id="trade_dvp",
    delivery_leg=delivery,
    payment_leg=payment,
    plan=plan,
    metadata={"desk": "rates"},
)
draft.settlement_pvp(
    settlement_id="trade_pvp",
    primary_leg=payment,
    counter_leg=delivery,
)

envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
client.submit_transaction_envelope_and_wait(envelope)
```

### JSON Аварийный люк {#json-escape-hatch}

Если вспомогательной функции Python нет, передайте канонический JSON модели данных `InstructionBox` в `Instruction.from_json`. Это рекомендуемый способ для `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, регистрации пиров, ролей и NFT, а также вариантов отмены регистрации, не связанных с триггерами, пока эти вспомогательные функции не получат типизированный интерфейс.

```python
from iroha_python import Instruction

# Copy this payload from Rust/CLI tooling or from a pinned data-model schema.
instruction_box_json = """
{
  "<InstructionVariant>": {
    "...": "..."
  }
}
"""

instruction = Instruction.from_json(instruction_box_json)
submit(instruction)
```

Сохраняйте путь набранного черновика на границе транзакции: это сохраняет точный `NetworkId`, намерение оплаты комиссии и инвариант «котировка до подписи». Прямое использование `TransactionBuilder` требует того же набора значений плюс явной проверки актуальной котировки, поэтому это не является сокращением для кода приложения.

Для сгенерированных или непрозрачных инструкций выполните обратное преобразование через JSON перед сохранением тестовых артефактов:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Рабочие процессы транзакций {#transaction-workflows}

Используйте `TransactionDraft` для приложений, которые формируют несколько инструкций перед подписью. Черновик позволяет сохранить настройки на уровне транзакции, такие как `ttl_ms`, `nonce` и метаданные в одном месте, а затем подписывать один раз:

```python
config = TransactionConfig(
    network_id=TAIRA_NETWORK_ID,
    authority=alice,
    fee_payment=BASE_FEE_PAYMENT,
    # TTL and nonce are transaction-level properties shared by all instructions.
    ttl_ms=120_000,
    nonce=1,
    metadata=APP_METADATA,
)

draft = TransactionDraft(config)
# Draft methods append instructions but do not submit anything yet. Domain
# setup is a separate alias-planner flow and has already committed here.
draft.register_account(bob, metadata={"role": "user"})
draft.register_asset_definition(
    ROSE_DEFINITION,
    owning_domain=None,
    balance_scope_policy="Global",
    name="Rose",
    scale=2,
    mintable="Infinitely",
)
draft.mint_asset_quantity(ROSE_ASSET, "100")
draft.transfer_asset_quantity(ROSE_ASSET, "25", bob)

# Quoting freezes the draft, validates exact fee limits, and signs that payload.
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
receipt = client.submit_transaction_envelope(envelope)
status = client.wait_for_transaction_status(envelope.hash_hex(), timeout=30)
print(receipt, status)
```

Экспортируйте детерминированный технический манифест для проверки, аудита или передачи кошелька:

```python
import json
from pathlib import Path

# Manifests are review artifacts; they are not submitted by themselves.
manifest = draft.to_manifest_dict(include_creation_time=True)
print(json.dumps(manifest, indent=2))

Path("transaction_manifest.json").write_text(
    draft.to_manifest_json(indent=2, include_creation_time=True),
    encoding="utf-8",
)
```

Приложите доказательство конфиденциальности линии выполнения перед подписью, когда целевая линия выполнения требует этого:

```python
# Attach the proof before signing so it is covered by the transaction hash.
draft.add_lane_privacy_merkle_proof(
    commitment_id=7,
    leaf=bytes.fromhex("aa" * 32),
    leaf_index=3,
    audit_path=[bytes.fromhex("bb" * 32), bytes.fromhex("cc" * 32)],
    proof_backend="halo2/ipa",
    proof_bytes=b"...proof bytes...",
    verifying_key_name="lane_privacy_vk",
)
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
```

## Запросы {#queries}

Помощники для набора запросов возвращают датаклассы вместо необработанных словарей JSON. Они являются самым простым способом начать, потому что SDK разбирает постраничный вывод и общие поля записей для вас:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Используйте универсальные помощники для запросов, когда у конечной точки Torii API ещё нет типового программного адаптера:

```python
from urllib.request import Request, urlopen

# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Prometheus exposition is served at `/metrics` when telemetry is `extended`
# or `full`; it is text, not a `/v1` JSON resource.
request = Request(f"{TORII_URL}/metrics", headers={"Accept": "text/plain"})
with urlopen(request, timeout=5) as response:
    metrics = response.read().decode("utf-8")
```

Вспомогательные средства инвентаризации аккаунтов требуют идентификатор аккаунта, принимаемый нормализатором SDK. Используйте канонические идентификаторы аккаунтов I105 или алиасы в блокчейне; если блок-эксплорер или исходная точка API возвращает идентификатор, который SDK отклоняет, преобразуйте его в канонический идентификатор аккаунта перед вызовом этих помощников:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## События {#events}

Помощники потоковой передачи по умолчанию декодируют полезные нагрузки JSON. Передайте `with_metadata=True`, когда вам нужно имя события SSE, идентификатор, подсказку для повторной попытки и необработанную полезную нагрузку. Каноническая лента `/v1/events/sse` доступна только в прямом эфире: она не выдаёт идентификаторы повтора и не сохраняет журнал повтора, поэтому эти помощники не предоставляют аргумент курсора или возобновления. Переподключение запускает новую подписку и может иметь разрыв; используйте `/v1/blocks/stream` из известной высоты, когда требуется полная история распределенного реестра блокчейна. Эти примеры ожидают живых событий, поэтому запускайте их на узле, где поток включен и активен.

```python
from iroha_python import DataEventFilter, SseStreamError

# Narrow the stream to proof events with the expected backend and proof hash.
proof_filter = DataEventFilter.proof(
    backend="halo2/ipa",
    proof_hash_hex="deadbeef" * 8,
)

try:
    for event in client.stream_events(filter=proof_filter, with_metadata=True):
        print(event.id, event.event, event.data)
        break
except SseStreamError as error:
    print(error.code, error.dropped_messages, error.replay_available)

for event in client.stream_trigger_events(trigger_id="hourly_reward"):
    print(event)
    break

for tx_event in client.stream_pipeline_transactions(status="Queued"):
    print(tx_event)
    break
```

## Ключи и адреса {#keys-and-addresses}

SDK предоставляет локальные помощники для подписи для каждого алгоритма подписи, скомпилированного в нативное расширение. Эти помощники не вызывают Taira, но они требуют нативное расширение:

```python
from iroha_python import (
    ED25519_ALGORITHM,
    derive_confidential_keyset_from_hex,
    derive_keypair_from_seed,
    hash_blake2b_32,
    verify,
)
from iroha_python.address import AccountAddress

# Key derivation and signing are local; no network call is made here.
ed_pair = derive_keypair_from_seed(b"alice", ED25519_ALGORITHM)
signature = ed_pair.sign(b"payload")
assert verify(ED25519_ALGORITHM, ed_pair.public_key, b"payload", signature)

# Canonical AccountId/I105 identity is derived only from the controller key.
# This constructor currently requires `domain`; canonical identity ignores it
# and AccountAddress.from_account emits a domainless address.
address = AccountAddress.from_account(domain="wonderland", public_key=ed_pair.public_key)
print(address.canonical_hex())
print(address.to_i105(0x02F1))

# Confidential key helpers derive local viewing/spending material.
confidential = derive_confidential_keyset_from_hex("01" * 32)
print(confidential.as_hex())
print(hash_blake2b_32(b"payload").hex())
```

Используйте `supported_crypto_algorithms()`, чтобы узнать, что поддерживает ваше колесо. Общие помощники используют канонические метки алгоритмов и работают для Ed25519, secp256k1, ML-DSA, GOST, BLS и SM2, когда эти алгоритмы скомпилированы:

```python
from iroha_python import (
    CryptoKeyPair,
    derive_keypair_from_seed,
    load_keypair,
    parse_private_key_multihash,
    parse_public_key_multihash,
    private_key_multihash,
    public_key_multihash,
    sign,
    supported_crypto_algorithms,
    verify,
)

message = b"iroha multi-algorithm signing"

# Iterate the algorithms compiled into the installed native extension.
for algorithm in supported_crypto_algorithms():
    keypair = derive_keypair_from_seed(f"docs:{algorithm}".encode(), algorithm)
    signature = keypair.sign(message)

    # Both the object method and the generic helper verify the same signature.
    assert keypair.verify(message, signature)
    assert verify(algorithm, keypair.public_key, message, signature)

    # Loading a private key should reconstruct the same public key.
    loaded = load_keypair(keypair.private_key, algorithm)
    assert loaded.public_key == keypair.public_key
    assert sign(algorithm, loaded.private_key, message) != b""

    # Prefixed multihashes carry the algorithm label with the key bytes.
    public_multihash = public_key_multihash(
        algorithm,
        keypair.public_key,
        prefixed=True,
    )
    private_multihash = private_key_multihash(
        algorithm,
        keypair.private_key,
        prefixed=True,
    )

    public_algorithm, public_key = parse_public_key_multihash(public_multihash)
    private_algorithm, private_key = parse_private_key_multihash(private_multihash)
    restored = CryptoKeyPair.from_private_key_multihash(private_multihash)

    # Round-trip checks catch mismatched algorithm labels or key encodings.
    assert public_algorithm == algorithm
    assert public_key == keypair.public_key
    assert private_algorithm == algorithm
    assert private_key == keypair.private_key
    assert restored == keypair
```

### Китайская SM Криптография {#chinese-sm-cryptography}

Python SDK предоставляет как универсальные SM2 вспомогательные функции, так и удобные вспомогательные функции, специфичные для SM2. Используйте объявление возможностей узла, чтобы выбрать отличительный идентификатор SM2, ожидаемый целевой сетью:

```python
from iroha_python import (
    SM2_ALGORITHM,
    SM2_DEFAULT_DISTINGUISHED_ID,
    derive_keypair_from_seed,
    derive_sm2_keypair_from_seed,
    sign,
    sign_sm2,
    verify,
    verify_sm2,
)

capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)
sm = capabilities.crypto.sm if capabilities.crypto else None
# Use the node's default SM2 distinguishing ID when the node advertises one.
distid = sm.sm2_distid_default if sm else SM2_DEFAULT_DISTINGUISHED_ID

# The SM2-specific helper accepts the distinguishing ID explicitly.
pair = derive_sm2_keypair_from_seed(bytes.fromhex("11" * 32), distid=distid)
message = b"iroha-sm2-example"
signature = pair.sign(message)

assert pair.verify(message, signature)
assert verify_sm2(pair.public_key, message, signature, distid=distid)
assert sign_sm2(pair.private_key, message, distid=distid) != b""

# The generic API works when you only need the canonical `sm2` label.
generic_pair = derive_keypair_from_seed(bytes.fromhex("22" * 32), SM2_ALGORITHM)
generic_signature = sign(SM2_ALGORITHM, generic_pair.private_key, message)
assert verify(SM2_ALGORITHM, generic_pair.public_key, message, generic_signature)

print(pair.public_key_sec1_hex)
print(pair.public_key_multihash)
```

`crypto.sm.enabled` сообщает вам, принимает ли узел алгоритмы семейства SM в своей текущей политике. Та же реклама включает политику криптографического хеша SM и статус ускорения, что полезно при решении, включать ли потоки, специфичные для SM2:

```python
capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)

# `enabled` is the submit-time policy flag, not just local SDK support.
if capabilities.crypto and capabilities.crypto.sm.enabled:
    sm = capabilities.crypto.sm
    print(sm.default_hash)
    print(sm.allowed_signing)
    print(sm.acceleration.policy)
else:
    print("SM crypto is not enabled by this node")
```

Рассматривайте полезную нагрузку аутентифицированной возможности как авторитетную для развернутого узла. Не отправляйте транзакцию, подписанную SM2, если `crypto.sm.enabled` не истинно и рекламируемая политика подписания это не допускает.

### GOST и постквантовые ключи {#gost-and-post-quantum-keys}

Используйте универсальный криптографический API для наборов параметров GOST Р 34.10-2012 и ML-DSA (`ml-dsa`) постквантовых подписей. Один и тот же объект ключевой пары выполняет подпись, проверку и экспорт мультихеша:

```python
from iroha_python import (
    GOST_3410_2012_256_PARAMSET_A_ALGORITHM,
    GOST_3410_2012_256_PARAMSET_B_ALGORITHM,
    GOST_3410_2012_256_PARAMSET_C_ALGORITHM,
    GOST_3410_2012_512_PARAMSET_A_ALGORITHM,
    GOST_3410_2012_512_PARAMSET_B_ALGORITHM,
    ML_DSA_ALGORITHM,
    derive_keypair_from_seed,
    verify,
)
from iroha_python.address import AccountAddress

CHAIN_DISCRIMINANT = 0x02F1
message = b"iroha gost and post-quantum example"

# Crypto helpers use canonical labels; account addresses use compact aliases.
# Every `domain=` argument below is ignored when the canonical AccountId/I105
# address is encoded.
GOST_ADDRESS_ALIASES = {
    GOST_3410_2012_256_PARAMSET_A_ALGORITHM: "gost-256-a",
    GOST_3410_2012_256_PARAMSET_B_ALGORITHM: "gost-256-b",
    GOST_3410_2012_256_PARAMSET_C_ALGORITHM: "gost-256-c",
    GOST_3410_2012_512_PARAMSET_A_ALGORITHM: "gost-512-a",
    GOST_3410_2012_512_PARAMSET_B_ALGORITHM: "gost-512-b",
}

# Derive and verify one local keypair for every GOST parameter set.
for crypto_algorithm, address_algorithm in GOST_ADDRESS_ALIASES.items():
    keypair = derive_keypair_from_seed(
        f"docs:{crypto_algorithm}".encode(),
        crypto_algorithm,
    )
    signature = keypair.sign(message)

    assert verify(crypto_algorithm, keypair.public_key, message, signature)

    address = AccountAddress.from_account(
        domain="wonderland",
        public_key=keypair.public_key,
        # Account addresses use compact curve aliases for GOST parameter sets.
        algorithm=address_algorithm,
    )
    print(crypto_algorithm)
    print(address.canonical_hex())
    print(address.to_i105(CHAIN_DISCRIMINANT))
    print(keypair.prefixed_public_key_multihash)

# ML-DSA follows the same generic signing and address flow.
mldsa_keypair = derive_keypair_from_seed(b"docs:ml-dsa", ML_DSA_ALGORITHM)
mldsa_signature = mldsa_keypair.sign(message)
assert verify(ML_DSA_ALGORITHM, mldsa_keypair.public_key, message, mldsa_signature)
post_quantum_address = AccountAddress.from_account(
    domain="wonderland",
    public_key=mldsa_keypair.public_key,
    algorithm="ml-dsa",
)
print(post_quantum_address.canonical_hex())
print(post_quantum_address.to_i105(CHAIN_DISCRIMINANT))
print(mldsa_keypair.prefixed_public_key_multihash)
```

Ворота GOST и пост-квантовые потоки в аутентифицированной, типизированной рекламе возможностей узла:

```python
capabilities = client.get_node_capabilities_typed(
    canonical_auth=canonical_auth,
)
sm = capabilities.crypto.sm if capabilities.crypto else None
# Nodes advertise the signing algorithms they will accept for transactions.
allowed = set(sm.allowed_signing if sm else ())

GOST_ALGORITHMS = {
    "gost3410-2012-256-paramset-a",
    "gost3410-2012-256-paramset-b",
    "gost3410-2012-256-paramset-c",
    "gost3410-2012-512-paramset-a",
    "gost3410-2012-512-paramset-b",
}

# Local support is not enough; submit only when the node advertises support.
supports_gost = bool(allowed & GOST_ALGORITHMS)
supports_post_quantum = "ml-dsa" in allowed
supports_sm2 = "sm2" in allowed and bool(sm and sm.enabled)

print(supports_gost, supports_post_quantum, supports_sm2)
```

Если узел не рекламирует алгоритм, который вам нужен, используйте ключ только для локальных или офлайн-процессов. Не отправляйте транзакции, подписанные этим алгоритмом, на этот узел. Во время публичной проверки Taira GOST и ML-DSA были доступны в качестве криптопомощников SDK в верхнеуровневой библиотеке Python, но узел не рекламировал их для подписания транзакций.

## Создание клиента с учётом конфигурации {#config-aware-client-creation}

Используйте `resolve_torii_client_config`, когда ваше приложение читает настройки узла из файла, но по-прежнему требует переопределений, специфичных для среды или теста:

```python
import json
from iroha_python import create_torii_client, resolve_torii_client_config

with open("iroha_config.json", "r", encoding="utf-8") as handle:
    raw_config = json.load(handle)

# Override only the fields that vary by environment.
resolved = resolve_torii_client_config(
    config=raw_config,
    overrides={"timeout_ms": 2_000, "max_retries": 5},
)

# Pass the resolved config into the same client constructor used elsewhere.
client = create_torii_client(
    raw_config.get("torii", {}).get("address", TORII_URL),
    resolved_config=resolved,
)
```

## Готовность Камэмуши {#kagemusha-readiness}

Python SDK может запрашивать текущий маршрут готовности JSON через свой универсальный помощник запроса Torii:

```python
ASSET_DEFINITION_ID = "<canonical_asset_definition_id>"

readiness = client.request_json(
    "GET",
    "/v1/offline/readiness",
    params={"asset_definition_id": ASSET_DEFINITION_ID},
    headers={"Accept": "application/json"},
    expected_status=(200,),
)
print(readiness["ready"])
print(readiness["blockers"])
```

Python не предоставляет доступ к типизированным сборщикам архивов пополнения или выкупа Kagemusha. Используйте типизированный кошелек Swift или JVM для создания канонических архивов V4, затем отправляйте их и опрашивайте через поддерживаемый клиент Kagemusha Torii.

## Подписки {#subscriptions}

Подписки на чтение и конструкторы черновиков наследуются от общего клиента Torii, используемого `iroha_python.ToriiClient`. Каждая мутация принимается с канонической подписью аккаунта, связанной с телом запроса, и возвращает черновик неподписанной транзакции. Torii никогда не принимает приватный ключ и не отправляет черновик за вас.

```python
# The plan defines billing cadence, retry policy, and usage pricing.
usage_plan = {
    "provider": alice,
    "billing": {
        "cadence": {
            "kind": "monthly_calendar",
            "detail": {"anchor_day": 1, "anchor_time_ms": 0},
        },
        "bill_for": {"period": "previous_period", "value": None},
        "retry_backoff_ms": 86_400_000,
        "max_failures": 3,
        "grace_ms": 604_800_000,
    },
    "pricing": {
        "kind": "usage",
        "detail": {
            "unit_price": "0.024",
            "unit_key": "compute_ms",
            "asset_definition": "usd#wonderland",
        },
    },
}

# The provider authorizes preparation of a plan-registration draft.
plan_draft = client.create_subscription_plan(
    authority=alice,
    plan_id="compute#wonderland",
    plan=usage_plan,
    canonical_auth=canonical_auth,
)

bob_canonical_auth = ToriiCanonicalRequestAuth(
    network_id=TAIRA_NETWORK_ID.literal,
    account_id=bob,
    signer=bob_pair.sign,
)

# The subscriber authorizes preparation of a subscription-creation draft.
subscription_draft = client.create_subscription(
    authority=bob,
    subscription_id="sub-001",
    plan_id="compute#wonderland",
    canonical_auth=bob_canonical_auth,
)

# Usage and charge-now operations also return unsigned transaction drafts.
usage_draft = client.record_subscription_usage(
    "sub-001",
    authority=alice,
    unit_key="compute_ms",
    delta="3600000",
    canonical_auth=canonical_auth,
)
charge_draft = client.charge_subscription_now(
    "sub-001",
    authority=alice,
    canonical_auth=canonical_auth,
)

for draft in (plan_draft, subscription_draft, usage_draft, charge_draft):
    assert draft.submitted is False
    print(draft.transaction_payload_b64, draft.signing_message_b64)
```

Передайте каждую точную полезную нагрузку и сообщение о подписи в локальный кошелек соответствующего аккаунта, подтвердите запрашиваемую операцию там, соберите подписанную транзакцию и отправьте её через обычный процесс обработки транзакций программного обеспечения. Python SDK проверяет, что подписываемое сообщение является каноническим криптографическим хэшем возвращенного полезного груза, но кошелек по-прежнему несет ответственность за декодирование и одобрение транзакции перед подписью.

## Подключить {#connect}

Постройте и разберите Connect URIs локально. Идентификатор Connect связывает SID с точным `NetworkId`, публичным ключом приложения и криптографическим значением nonce:

```python
from iroha_python.connect import create_connect_session_preview, parse_connect_uri

# Generate consistent SID, key, nonce, and URI values as one bundle.
preview = create_connect_session_preview(
    network_id=TAIRA_NETWORK_ID,
    node="taira.sora.org",
)
parsed = parse_connect_uri(preview.wallet_uri)

assert parsed.sid == preview.sid_base64url
assert parsed.network_id.literal == TAIRA_NETWORK_ID.literal
assert parsed.app_public_key == preview.app_key_pair.public_key
```

Регистрируйте именно этот предварительный просмотр только тогда, когда целевой узел предоставляет Connect. Создание сессии возвращает четыре токена носителя для конкретных ролей. Маршрут статуса для каждой сессии требует токен управления; агрегированный статус — это маршрут оператора.

```python
from iroha_python import (
    ConnectControlClose,
    ConnectControlOpen,
    ConnectDirection,
    ConnectFrame,
    ConnectPermissions,
    bootstrap_connect_preview_session,
    decode_connect_frame,
    encode_connect_frame,
)

bootstrap = bootstrap_connect_preview_session(
    client,
    network_id=TAIRA_NETWORK_ID,
    node="taira.sora.org",
)
info = bootstrap.session
tokens = bootstrap.tokens
assert info is not None and tokens is not None

session_status = client.request_json(
    "GET",
    "/v1/connect/status",
    params={"sid": info.sid},
    headers={"Authorization": f"Bearer {tokens.management}"},
    expected_status=(200,),
)
print(info.app_uri, session_status)

# Control frames negotiate permissions before encrypted messages are sent.
frame = ConnectFrame(
    sid=bootstrap.preview.sid_bytes,
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=1,
    control=ConnectControlOpen(
        app_public_key=bootstrap.preview.app_key_pair.public_key,
        network_id=TAIRA_NETWORK_ID,
        permissions=ConnectPermissions(methods=["SIGN_REQUEST_TX"], events=[]),
    ),
)
payload = encode_connect_frame(frame)
assert decode_connect_frame(payload) == frame

# Closing the control channel is explicit and also travels as a frame.
close_frame = ConnectFrame(
    sid=bootstrap.preview.sid_bytes,
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=2,
    control=ConnectControlClose(
        role="App", code=4100, reason="finished", retryable=False
    ),
)
close_payload = encode_connect_frame(close_frame)
```

Шифруйте сообщения после одобрения с использованием сеанса с сохранением состояния:

```python
from iroha_python import (
    ConnectDirection,
    ConnectSession,
    ConnectSessionKeys,
    ConnectSignRequestRawPayload,
)

# Derive symmetric session keys from both parties' keys and the session ID.
keys = ConnectSessionKeys.derive(
    local_private_key=bytes.fromhex("11" * 32),
    peer_public_key=bytes.fromhex("22" * 32),
    sid=bytes.fromhex("33" * 32),
)
session = ConnectSession(
    sid=bytes.fromhex("33" * 32),
    keys=keys,
)
# Encrypt application payloads after the session is approved.
encrypted = session.encrypt_app_to_wallet(
    ConnectSignRequestRawPayload(domain_tag="SIGN", payload=b"hash")
)
state = session.snapshot_state().to_dict()
print(encrypted.sequence, state)
```

## Управление, среда выполнения программного обеспечения и административные поверхности {#governance-runtime-and-admin-surfaces}

Чтения управления аутентифицированы учетной записью. Используя принцип авторизации и пару ключей из [Общая настройка](#shared-setup), свяжите каждый вызов помощника с точно сгенерированным из начала `NetworkId` Taira:

```python
# Governance reads return either current settings or typed not-found wrappers.
protected = client.get_protected_namespaces(canonical_auth=canonical_auth)
referendum = client.get_governance_referendum_typed(
    "ref-1", canonical_auth=canonical_auth
)
tally = client.get_governance_tally_typed("ref-1", canonical_auth=canonical_auth)
locks = client.get_governance_locks_typed("ref-1", canonical_auth=canonical_auth)
unlock_stats = client.get_governance_unlock_stats_typed(
    canonical_auth=canonical_auth
)

print(protected, referendum.found)
print(tally.approve, list(locks.locks), unlock_stats.expired_locks_now)

# Account-authenticated runtime reads use the same canonical request proof.
abi = client.get_runtime_abi_active_typed(canonical_auth=canonical_auth)
# The ABI hash itself is a public read.
abi_hash = client.get_runtime_abi_hash_typed()
runtime_metrics = client.get_runtime_metrics_typed(canonical_auth=canonical_auth)
capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)

print(abi, abi_hash, runtime_metrics)
print(capabilities.abi_version)
```

Создайте отдельного клиента для чтения оператором. Загрузите ключ оператора из белого списка во время выполнения программы и привяжите его к точному `NetworkId` Taira; токены носителя и `x-api-token` не заменяют эту подпись:

```python
import os

from iroha_python import Ed25519KeyPair, NetworkId, OperatorSigningContext

operator_pair = Ed25519KeyPair.from_private_key(
    bytes.fromhex(os.environ["IROHA_OPERATOR_PRIVATE_KEY_HEX"])
)
operator_client = create_torii_client(
    TORII_URL,
    operator_signing_context=OperatorSigningContext(
        TAIRA_NETWORK_ID,
        operator_pair,
    ),
)
```

Маршруты обновления во время выполнения являются инструкторами по сборке, аутентифицированными оператором. Успешный ответ на предложение, активацию или отмену возвращает `tx_instructions`; это не выполняет обновление. Отправьте этот пакет через обычную подписанную транзакцию и путь управления. Закрепленные методы Python `propose_runtime_upgrade`, `activate_runtime_upgrade` и `cancel_runtime_upgrade` в настоящее время выполняют обычные запросы вместо применения `OperatorSigningContext` клиента, поэтому этот учебник не представляет их как рабочий поток оператора.

## Статус, консенсус и телеметрия сети {#status-consensus-and-network-telemetry}

```python
# `/status` is the public node snapshot endpoint on Taira.
status = client.request_json("GET", "/status", expected_status=(200,))
print(status["blocks"], status["txs_approved"])

# Sumeragi and time-status endpoints use the operator client configured above.
sumeragi = operator_client.get_sumeragi_status_typed()
diagnostics = operator_client.get_sumeragi_diagnostics_typed()
print(sumeragi.last_committed_height, diagnostics.tx_queue_saturated)

time_now = client.get_time_now()
time_status = operator_client.get_time_status()
for sample in time_status.samples:
    print(sample.peer, sample.last_offset_ms, sample.last_rtt_ms)
print(time_now.now_ms)

# Connect aggregate status is operator-authenticated. Individual sessions use
# `/v1/connect/status?sid=...` with their management bearer token instead.
connect_status = operator_client.get_connect_status_typed()
if connect_status is not None:
    print(connect_status.enabled, connect_status.sessions_active)
```

## SoraFS, UAID и Kaigi помощники {#sorafs-uaid-and-kaigi-helpers}

Эти помощники доступны, когда целевой узел предоставляет соответствующие конечные точки Nexus/SORA API. Рассматривайте пустые списки как допустимый ответ: общедоступный Taira может иметь включенный маршрут без данных для примерного технического манифеста или UAID.

```python
# SoraFS status queries are reads scoped by manifest and status.
por_status = client.get_sorafs_por_status(manifest_hex="ab" * 32, status="verified")
print(len(por_status))

# UAID helpers inspect wallet/data-space bindings for one identifier.
uaid = "aabb" * 16
bindings = client.get_uaid_bindings_typed(uaid)
manifests = client.list_space_directory_manifests_typed(
    uaid,
    dataspace=11,
    status="active",
)
print(len(bindings.dataspaces), len(manifests.manifests))

# Kaigi relay health is an operator snapshot, even though it is read-only.
health = operator_client.get_kaigi_relays_health_typed()
print(health.healthy_total, health.failovers_total)
```

## Norito RPC и GPU помощники {#norito-rpc-and-gpu-helpers}

Используйте `NoritoRpcClient`, когда у вас уже есть Norito байт и необходимо вызвать бинарный Torii API эндпоинт. Пример требует подписанный контейнер данных из предыдущего шаблона транзакции:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call(
        "/v1/pipeline/transactions",
        envelope.signed_transaction_versioned,
    )
    print(len(response_bytes))
```

CUDA помощники возвращают `None`, когда бэкенд недоступен, чтобы приложения могли использовать скалярные реализации:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Текущее покрытие {#current-coverage}

Python SDK уже включает помощников для:

- Torii отправка, статус, запрос и административные процессы
- построители инструкций с типами для общих ISI и специализированных расширений
- черновики транзакций, технические манифесты, подписание и рабочие процессы контейнера данных подписанной транзакции
- потоки живых событий и фильтры по вводу; потоки завершенных блоков предоставляют полную историю
- обобщенные помощники по доступу к готовности Kagemusha и подписке Torii; типизированные сборщики пополнений и выкупа не открыты
- адрес аккаунта, помощники для подписания всеми алгоритмами, круговые операции с мультхэшами, SM2, GOST, ML-DSA, BLS, и обработка конфиденциальных ключей
- Подключить URIs, сессии, кадры, помощники шифрования и администратора реестра
- управление, обновление программного обеспечения во время выполнения, Sumeragi, node-admin, SoraFS, UAID и Kaigi API адаптеры программного обеспечения конечной точки, где узел предоставляет эти функции

## Исходные ссылки {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Эти файлы являются источником правды для поверхности Python в закрепленной версии рабочей области.
