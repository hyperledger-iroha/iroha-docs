---
translation_locale: ru
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

Python SDK в рабочем пространстве вверх по течению является `iroha-python`. Первый выпуск Iroha 3 нацелен на текущие поверхности Torii и Norito. Запишите версию пакета или пересмотр источника, используемый вашей интеграцией, чтобы SDK и узел оставались на одном формате пересмотра проводов.

Нижеприведенные примеры, предназначенные только для чтения, были проверены против общественности. Taira на `https://taira.sora.org`. Мутационные примеры - это шаблоны транзакций: они требуют реального Taira полномочия, частный ключ, метаданные о газе и любые токены оператора, требуемые целевым маршрутом, прежде чем они могут быть представлены.

Используйте примеры в этом порядке:

|Этап .| Соревноваться с общественностью Taira? |Что тебе нужно ?|
| --- | --- | --- |
|Звонки клиентов только для чтения |Да , это так .|Python пакет плюс доступ к сети |
|Местные строители подписей и инструкций |Никаких звонков по сети до `submit()` |Местное расширение и ваш ключевой материал |
|Мутационные транзакции и звонки на услуги |Только на собственном финансируемом счете .|Счет органа, частный ключ, цепочка ID, метаданные по счетам, баланс активов по счету и токены маршрута |
|Подключите кодеки кадров, крипто и помощников GPU |Только местный |Начальное расширение; GPU помощники также нуждаются в CUDA-способный бэкэнд |

## Установка {#install}

Название метаданных пакета - `iroha-python`. Не предполагайте, что незакрепленная установка PyPI совпадает с живой сетью Taira. Установите колесо или исходную кассу, которая была построена из того же пересмотра вверх потоком.

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Если ваш проект напрямую потребляет рабочее пространство вверх по течению, установить зависимости Python и построить коренное расширение перед запуском примеров, которые используют `Instruction`, `TransactionDraft`, подпись, крипто, SoraFS коренные помощники, GPU помощники или Connect рамковые кодексы. Используйте команду по созданию с потока вверх `python/iroha_python/README.md`, а затем проверьте, что нагрузка экспортных продуктов:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Если `create_torii_client` импортируется, но `Instruction` или `generate_ed25519_keypair` не выполняется, то чистый пакет Python доступен, но родной расширение отсутствует.

## Быстрый старт {#quickstart}

Начните с общедоступных конечных точек Taira для чтения только:

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

## Совместная установка {#shared-setup}

Используйте эту настройку для мутирующих шаблонов. Перед отправкой заменяйте каждый держатель места авторитетным Taira, частным ключом, токеном и активом/счетом IDs из вашего распределения.

`authority` - это счет, подписывающий транзакцию. `private_key` должен соответствовать этому счету, `CHAIN_ID` должен соответствовать целевой сети, и `TX_METADATA` должен включать в себя поля сборов, ожидаемые сетью. Нижеприведенные места являются преднамеренно недействительными, поэтому они не предоставляются случайно.

```python
from iroha_python import (
    Ed25519KeyPair,
    Instruction,
    TransactionConfig,
    TransactionDraft,
    create_torii_client,
)

TORII_URL = "https://taira.sora.org"
CHAIN_ID = "fc56984b-2be7-431d-840e-21514d1883f0"
AUTH_TOKEN = None

# Replace these placeholders with the real signing keys for your accounts.
alice_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<alice-private-key-hex>"))
bob_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<bob-private-key-hex>"))

# The authority string must identify the same account as the private key.
alice = "<alice-account-id>"
bob = "<bob-account-id>"

ROSE_DEFINITION = "rose#wonderland"
ROSE_ASSET = "<rose-asset-id>"
BADGE_NFT = "badge$wonderland"

TX_METADATA = {
    # Public Taira fee asset. Use the configured XOR asset on your network.
    "gas_asset_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
}

client = create_torii_client(TORII_URL, auth_token=AUTH_TOKEN)


def submit(*instructions):
    # This is the network boundary: build, sign, submit, and wait for status.
    return client.build_and_submit_transaction(
        chain_id=CHAIN_ID,
        authority=alice,
        private_key=alice_pair.private_key,
        instructions=list(instructions),
        metadata=TX_METADATA,
        wait=True,
    )
```

`Instruction.*` призывает только полезные нагрузки инструкций по строительству. `submit()` является точкой, где SDK подписывает транзакцию, отправляет ее в Torii и ждет статуса.

## Сборы и газ {#fees-and-gas}

Записание транзакций требует метаданных сборов и баланса активов с финансируемыми сборами. На Taira актив сборов финансируется государственным краном, а метаданные сделки должны включать в себя `gas_asset_id`. На Minamoto сборы оплачиваются реальными XOR, а актив ID происходит из конфигурации этой сети.

Метаданные по счетам относятся к транзакции, а не к отдельным инструкциям. Помощник `submit()` выше прикрепляет `TX_METADATA` к каждой сделке, которую он создает:

```python
TX_METADATA = {
    # Taira expects the fee asset definition in transaction metadata.
    "gas_asset_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
}

envelope, status = client.build_and_submit_transaction(
    chain_id=CHAIN_ID,
    authority=alice,
    private_key=alice_pair.private_key,
    # Fee metadata is attached to the transaction, not the instruction.
    instructions=[
        Instruction.set_account_key_value(
            alice,
            "python_fee_example",
            "ready",
        )
    ],
    metadata=TX_METADATA,
    wait=True,
)
```

Прежде чем отправить письмо, убедитесь, что на счете власти достаточно средств для оплаты. ID являются специфическими для сети; это Taira форма:

```python
FEE_ASSET_DEFINITION = "6TEAJqbb8oEPmLncoNiMRbLEK6tw"
# The faucet returns the concrete account asset ID to check here.
FEE_ASSET_ID = "<fee-asset-id-from-faucet-response>"
TX_METADATA = {"gas_asset_id": FEE_ASSET_DEFINITION}

# Fail before submitting if the signer cannot pay gas.
fee_assets = client.list_account_assets_typed(
    alice,
    limit=10,
    asset_id=FEE_ASSET_ID,
)
if not fee_assets.items:
    raise RuntimeError("fund the authority account with the Taira fee asset first")
```

В кране возвращается бетон `asset_id`, который используется для проверки баланса. Поле метаданных `gas_asset_id` использует определение актива сборов ID.

Сохраняйте метаданные приложения отдельно от метаданных сборов путем объединения карт, когда вы создаете транзакцию:

```python
APP_METADATA = {"source": "python-docs"}
# Merge app metadata with required fee metadata before building the draft.
metadata = {**TX_METADATA, **APP_METADATA}

draft = TransactionDraft(
    TransactionConfig(
        chain_id=CHAIN_ID,
        authority=alice,
        metadata=metadata,
    )
)
```

Если вы пропустите метаданные по счетам, используете неправильный актив по счету или подписываетесь на нефинансированном счете, реальная сеть должна отклонить транзакцию даже если полезная нагрузка инструкций будет действительна.

## Taira-Проверенные звонки только для чтения {#taira-checked-read-only-calls}

Эти вызовы были успешно возвращены против общественности Taira:

```python
client = create_torii_client("https://taira.sora.org")

# Use raw requests for endpoints that do not need a typed wrapper.
status = client.request_json("GET", "/status", expected_status=(200,))
parameters = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Typed helpers parse pagination and records into dataclasses.
accounts = client.list_accounts_typed(limit=1)
domains = client.list_domains_typed(limit=1)
definitions = client.query_asset_definitions_typed(limit=1)

# These calls inspect live node subsystems without mutating state.
time_now = client.get_time_now_typed()
time_status = client.get_time_status_typed()
sumeragi = client.get_sumeragi_status_typed()
connect = client.get_connect_status_typed()

print(status["build"]["version"])
print(parameters["sumeragi"]["block_time_ms"])
print(accounts.total, domains.total, definitions.total)
print(time_now.now_ms, len(time_status.samples), sumeragi.leader_index)
print(connect.enabled, connect.sessions_active)
```

Такие маршруты, как `/v1/status`, публичный инвентарь сверстников, выборка образцов Sumeragi RBC, снимки администрирования узлов и администрация реестра приложений Connect во время проверки не были общедоступны на Taira. Используйте `request_json("GET", "/status")` для полезной загрузки государственного статуса узла на Taira.

## Инструкции для строителей {#instruction-builders}

В настоящее время SDK выявляет типовые конструкторы для наиболее распространенных семейных инструкций и JSON шлюз для вариантов, которые не являются первоклассными Python Следующие фрагменты являются мутирующими шаблонами транзакций и не были представлены публично. Taira без подписной счета.

Предпочтительнее, когда они существуют: они нормализуют значения Python и исчезают на ранних недействительных формах. Используйте `Instruction.from_json` только тогда, когда вам нужен вариант инструкции, который еще не имеет помощника Python.

|Инструкция семья |Python поверхность |
| --- | --- |
|Регистрация .| `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` предназначен для использования в инструментах genesis/bootstrap. |
|Отключить регистрацию |`unregister_trigger`; использовать `Instruction.from_json` в отношении других вариантов |
|Минда/Бурн |`mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
|Передача | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|Метаданные и контроль | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
|RWA жизненный цикл| `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
|ExecuteTrigger |`execute_trigger` |
|Расширения репо / расселения | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|Закрытие коренных активов |`open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, плюс помощники клиента `*_and_wait` |
|Предоставление/отмена, SetParameter, регистрация, пользовательская версия, модернизация и менее распространенные варианты регистрации/нерегистрации |`Instruction.from_json` или `TransactionBuilder.add_instruction_json` с каноническим `InstructionBox` JSON |

Для условных платежей в формате поручительства см. [Native Asset Escrow](/ru/blockchain/escrow.md#python-asset-locks). Python в настоящее время раскрывает первоклассные помощники для общих блокировки активов; рыночные и анонимные помощники поручительства еще не являются методами первого класса Python.

### Создать домены, затем зарегистрировать счета и активы {#set-up-domains-then-register-accounts-and-assets}

Обычное создание домена проходит через декларируемый планщик псевдоним, так что договор аренды SNS, возможности владельца, охрана котировки и состояние домена проверяются вместе. Создайте секретно-свободный `AliasSetupPlanRequestV1` намерение с вашей услугой SDK или набординга, затем используйте `iroha app alias setup plan` и `iroha app alias setup apply`. Не подавайте `Instruction.register_domain` из транзакции заявки; этот конструктор остается для инструмента genesis/bootstrap.

После того, как план настройки домена обязуется, зарегистрируйте объекты, принадлежащие домену. В общей сети, такой как Taira, используйте присвоенное вам доменное и учебное пространство имен.

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

`mintable` принимает `Infinitely`, `Once`, `Not`, или `Limited(n)` значения, принятые моделью данных. `scale` для неограниченного количественного актива.

### Минетные, сжигаемые и переданные активы {#mint-burn-and-transfer-assets}

Эти вызовы используют существующий актив ID.Сначала регистрируйте определение актива, а затем создавайте конкретный актив ID для счета, который владеет активом.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Предоставление собственности {#transfer-ownership}

Передача собственности изменяется, кто контролирует домен, определение активов или NFT. Используйте текущего владельца в качестве органа по сделке.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Создание и удаление метаданных {#set-and-remove-metadata}

Стоимость метаданных должна быть JSON-сериализируемой. Когда вы используете `TransactionDraft`, авторитет в `TransactionConfig` становится дефолтным целевым счетом.

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

Проект помощника высокого уровня по умолчанию нацелен на орган по сделкам:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### Активы в реальном мире {#real-world-assets}

Помощники RWA используют сериализируемые полезные нагрузки JSON для метаданных, происхождения и политики контроллера по конкретным активам. `register_rwa` не принимает `id` или `owner`: время выполнения генерирует `RwaId`, а орган по сделке становится первоначальным владельцем.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
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

После того, как регистрационная транзакция обязуется, используйте `FindRwas`, `/v1/rwas`, событие RWA или маршрут исследователя, установленный для обнаружения генерируемого ID:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Последующие операции используют генерируемый `hash$domain` ID:

```python
registered_rwa_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
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

Полное перечисление может изменяться на существующей партии `owned_by`.Частные перечисления и слияния создают созданные детские партии.

### Вызывающие {#triggers}

Используйте помощники регистрации запуска, когда исполняемым является другая последовательность инструкций:

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

Torii также раскрывает REST помощников для инвентаризации запуска:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Инвентаризационные вызовы триггера читаются или проверяются только на записи триггеров. Регистрация, исполнение, повторение изменений и нерегистрация - это мутирующие операции.

### Инструкции по перевозке и расчету {#repo-and-settlement-instructions}

Репо и помощники по двустороннему урегулированию добавляют специальные варианты инструкций для доменов без ручной работы Norito полезных нагрузок:

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
    chain_id=CHAIN_ID,
    authority=alice,
    # Keep repo and settlement examples bounded by a short TTL.
    ttl_ms=120_000,
    metadata=TX_METADATA,
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
draft.repo_unwind(
    agreement_id="daily_repo",
    initiator=alice,
    counterparty=bob,
    cash_leg=cash,
    collateral_leg=collateral,
    settlement_timestamp_ms=1_704_086_400_000,
)

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

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### JSON Escape Hatch {#json-escape-hatch}

Когда Python Помощник пока не доступен, подать каноническую модель данных `InstructionBox` JSON в `Instruction.from_json` или непосредственно в `TransactionBuilder.add_instruction_json`. Это рекомендуемый путь для `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, сверстник/роль/NFT регистрация, а также недействительные варианты незарегистрации до тех пор, пока эти помощники не будут введены.

```python
from iroha_python import Instruction, TransactionBuilder

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

# Use TransactionBuilder when you need lower-level control than TransactionDraft.
builder = TransactionBuilder(CHAIN_ID, alice)
builder.set_metadata(TX_METADATA)
builder.add_instruction_json(instruction_box_json)
envelope = builder.sign(alice_pair.private_key)
client.submit_transaction_envelope_and_wait(envelope)
```

Для генерируемых или непрозрачных инструкций перед хранением светильников перемещение в обратную сторону через JSON:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Транзакционные рабочие процессы {#transaction-workflows}

Используйте `TransactionDraft` для приложений, которые создают несколько инструкций перед подписанием. Проект позволяет сохранить настройки уровня транзакции, такие как `ttl_ms`, `nonce` и метаданные в одном месте, а затем подпишите один раз:

```python
config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    # TTL and nonce are transaction-level properties shared by all instructions.
    ttl_ms=120_000,
    nonce=1,
    metadata={**TX_METADATA, "source": "python-docs"},
)

draft = TransactionDraft(config)
# Draft methods append instructions but do not submit anything yet. Domain
# setup is a separate alias-planner flow and has already committed here.
draft.register_account(bob, metadata={"role": "user"})
draft.register_asset_definition_numeric(
    ROSE_DEFINITION,
    owner=alice,
    scale=2,
    mintable="Infinitely",
)
draft.mint_asset_numeric(ROSE_ASSET, "100")
draft.transfer_asset_numeric(ROSE_ASSET, "25", destination=bob)

# Signing freezes the draft into an envelope ready for Torii.
envelope = draft.sign_with_keypair(alice_pair)
receipt = client.submit_transaction_envelope(envelope)
status = client.wait_for_transaction_status(envelope.hash_hex(), timeout=30)
print(receipt, status)
```

Экспортировать детерминистический манифест для проверки, аудита или передачи кошелька:

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

Прикрепить доказательство конфиденциальности полосы перед подписью, когда требуется это для целевой полосы:

```python
# Attach the proof before signing so it is covered by the transaction hash.
draft.add_lane_privacy_merkle_proof(
    commitment_id=7,
    leaf=bytes.fromhex("aa" * 32),
    leaf_index=3,
    audit_path=[bytes.fromhex("bb" * 32), None, bytes.fromhex("cc" * 32)],
    proof_backend="halo2/ipa",
    proof_bytes=b"...proof bytes...",
    verifying_key_bytes=b"...verifying key bytes...",
)
envelope = draft.sign_with_keypair(alice_pair)
```

## Вопросы {#queries}

Типовые помощники запросов возвращают классы данных вместо сырых JSON словарь. Они являются самым простым способом начать, потому что SDK анализирует страницы и общие поле записи для вас:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Используйте общие помощники для запросов, если конечный пункт Torii еще не имеет напечатанной упаковки:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

Помощники учетной записи требуют идентификатора счета, принятого SDK Это нормализатор. I105 счета IDs или псевдоним на цепи; если блок-эксплуатант или сырая конечная точка возвращает ID что SDK отклоняет, решает его в каноническом учете ID прежде чем призвать этих помощников:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## События {#events}

Посредники потоковой помощи декодируют полезные нагрузки JSON по умолчанию. Передайте `with_metadata=True` когда вам нужно имя события SSE, идентификатор, повторное попробование и сырая полезная нагрузка. Соединяйте потоки с `EventCursor` для сохранения последнего идентификатора события. Эти примеры ожидают живых событий, поэтому запускайте их против узла, где соответствующий поток событий включен и активен.

```python
from iroha_python import DataEventFilter, EventCursor

# Narrow the stream to proof events with the expected backend and proof hash.
proof_filter = DataEventFilter.proof(
    backend="halo2/ipa",
    proof_hash_hex="deadbeef" * 8,
)

# Persist the latest SSE id so a reconnect can resume from the same point.
cursor = EventCursor()
for event in client.stream_events(
    filter=proof_filter,
    cursor=cursor,
    resume=True,
    with_metadata=True,
):
    print(event.id, event.event, event.data)
    break

for event in client.stream_trigger_events(trigger_id="hourly_reward", resume=True):
    print(event)
    break

for tx_event in client.stream_pipeline_transactions(status="Queued"):
    print(tx_event)
    break
```

## Ключи и адреса {#keys-and-addresses}

SDK раскрывает местные помощники для подписи для каждого алгоритма подписи, составленного в родном расширении. Эти помощники не звонят Taira, но они требуют родной расширения:

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

Используйте `supported_crypto_algorithms()` чтобы увидеть, что поддерживает ваше колесо. Общие помощники используют канонические этикетки алгоритмов и работают для Ed25519, secp256k1, ML-DSA, GOST, BLS и SM2, когда эти алгоритмы составлены в:

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

### Китайская SM Криптовалюта {#chinese-sm-cryptography}

Python SDK раскрывает как общие помощники SM2, так и конкретные помощники для удобства SM2. Используйте объявление о возможностях узла, чтобы выбрать отличительный идентификатор SM2, ожидаемый целевой сетью:

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

capabilities = client.get_node_capabilities_typed()
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

`crypto.sm.enabled` сообщает вам, принимает ли узел SM- семейные алгоритмы в его текущей политике. SM hash-политика и статус ускорения, что полезно при принятии решения о том, включить ли SM2- специфические потоки:

```python
capabilities = client.get_node_capabilities_typed()

# `enabled` is the submit-time policy flag, not just local SDK support.
if capabilities.crypto and capabilities.crypto.sm.enabled:
    sm = capabilities.crypto.sm
    print(sm.default_hash)
    print(sm.allowed_signing)
    print(sm.acceleration.policy)
else:
    print("SM crypto is not enabled by this node")
```

Общественность Taira подвергнут опасности SM объявление о возможностях во время проверки, но SM Его рекламные алгоритмы подписания были `ed25519`, `secp256k1`, и `bls_normal`, Так что не поддавайтесь SM2- подписанные транзакции на данное развертывание, если только полезная нагрузка возможностей не меняется.

### GOST и Ключи после квантового значения {#gost-and-post-quantum-keys}

Используйте общий крипто API для GOST R 34.10-2012 наборы параметров и ML-DSA (`ml-dsa`Один и тот же объект пары ключей обрабатывает подпись, проверку и экспорт многохешных:

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

Gate GOST и послеквантовые потоки на рекламных алгоритмах подписания узла. Используйте полезную нагрузку сырой возможности для имен алгоритмов, совместимых вперед:

```python
capabilities = client.request_json(
    "GET",
    "/v1/node/capabilities",
    expected_status=(200,),
)
crypto = capabilities.get("crypto", {})
sm = crypto.get("sm", {})
# Nodes advertise the signing algorithms they will accept for transactions.
allowed = set(sm.get("allowed_signing", []))

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
supports_sm2 = "sm2" in allowed and bool(sm.get("enabled", False))

print(supports_gost, supports_post_quantum, supports_sm2)
```

Если узел не рекламирует необходимый алгоритм, используйте ключ только для локальных или офлайн-рабочих потоков. Не отправляйте транзакции, подписанные с этим алгоритмом в тот узел. Во время публичной проверки Taira, GOST и ML-DSA были доступны в качестве помощников криптовалюты SDK в библиотеке Python, но не рекламировались узлом для подписания транзакции.

## Создание клиентов с конфигурацией {#config-aware-client-creation}

Используйте `resolve_torii_client_config`, когда ваше приложение читает настройки узлов из файла, но все же требует перенаправлений для среды или испытаний:

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

## Готовность Kagemusha {#kagemusha-readiness}

Python SDK может запрашивать текущий маршрут готовности JSON через свой общий помощник запроса Torii:

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

Python не раскрывает создателей архивов пополнения или выкупа Кагемуши. Используйте бумажник с типом Swift или JVM для создания канонических архивов V4, а затем отправьте и опросите их через поддерживаемый клиент Kagemusha Torii.

## Подписчики {#subscriptions}

Подписные помощники - это мутирующие звонки сервиса, унаследованные от совместного Torii клиента, используемого `iroha_python.ToriiClient`. Используйте IDs и активы, которые существуют в целевой сети.

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

# The provider signs plan creation.
client.create_subscription_plan(
    authority=alice,
    private_key=alice_pair.private_key_hex,
    plan_id="compute#wonderland",
    plan=usage_plan,
)

# The subscriber signs subscription creation.
client.create_subscription(
    authority=bob,
    private_key=bob_pair.private_key_hex,
    subscription_id="sub-001",
    plan_id="compute#wonderland",
)

# Usage is recorded by the provider and then charged on demand.
client.record_subscription_usage(
    "sub-001",
    authority=alice,
    private_key=alice_pair.private_key_hex,
    unit_key="compute_ms",
    delta="3600000",
)
client.charge_subscription_now(
    "sub-001",
    authority=alice,
    private_key=alice_pair.private_key_hex,
)
```

## Соединение {#connect}

Создать и проанализировать соединение URIs, а также прочитать статус общественного соединения, раскрытый Taira:

```python
from iroha_python.connect import ConnectUri, build_connect_uri, parse_connect_uri

# Connect URIs are what an app hands to a wallet to start a session.
uri = build_connect_uri(
    ConnectUri(
        sid="base64url-session-id",
        chain_id=CHAIN_ID,
        node="taira.sora.org",
    )
)
parsed = parse_connect_uri(uri)
# Status tells you whether the node currently exposes Connect.
status = client.get_connect_status_typed()

assert parsed.chain_id == CHAIN_ID
print(status.enabled, status.sessions_active)
```

Фрейм-кодеки, извлечение ключа сессии и создание сеанса требуют родной расширения и включенного маршрута сессии Connect:

```python
from iroha_python import (
    ConnectControlClose,
    ConnectControlOpen,
    ConnectDirection,
    ConnectFrame,
    ConnectPermissions,
    decode_connect_frame,
    encode_connect_frame,
    generate_connect_keypair,
)

# The app keypair is separate from the account key used for transactions.
connect_pair = generate_connect_keypair()
info = client.create_connect_session_info(
    {"role": "app", "sid": connect_pair.public_key.hex()}
)
print(info.app_uri, info.wallet_token, info.expires_at)

# Control frames negotiate permissions before encrypted messages are sent.
frame = ConnectFrame(
    sid=bytes.fromhex("01" * 32),
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=1,
    control=ConnectControlOpen(
        app_public_key=connect_pair.public_key,
        chain_id=CHAIN_ID,
        permissions=ConnectPermissions(methods=["SIGN_REQUEST_TX"], events=[]),
    ),
)
payload = encode_connect_frame(frame)
assert decode_connect_frame(payload) == frame

# Closing the control channel is explicit and carries a reason code.
client.send_connect_control_frame(
    "base64url-session-id",
    ConnectControlClose(role="App", code=4100, reason="finished", retryable=False),
)
```

Зашифровать сообщения после одобрения с состоянием сессии:

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

## Управление, время работы и администраторские поверхности {#governance-runtime-and-admin-surfaces}

Эти только для чтения звонки успешно возвращаются против общественности Taira:

```python
client = create_torii_client("https://taira.sora.org")

# Governance reads return either current settings or typed not-found wrappers.
protected = client.get_protected_namespaces()
referendum = client.get_governance_referendum_typed("ref-1")
tally = client.get_governance_tally_typed("ref-1")
locks = client.get_governance_locks_typed("ref-1")
unlock_stats = client.get_governance_unlock_stats_typed()

print(protected, referendum.found)
print(tally.approve, list(locks.locks), unlock_stats.expired_locks_now)

# Runtime reads expose the active ABI and any pending upgrade records.
abi = client.get_runtime_abi_active_typed()
abi_hash = client.get_runtime_abi_hash_typed()
runtime_metrics = client.get_runtime_metrics_typed()
upgrades = client.list_runtime_upgrades_typed()
capabilities = client.get_node_capabilities_typed()

print(abi, abi_hash, runtime_metrics)
print(upgrades.total, capabilities.abi_version)
```

Помощники обновления запуска принимают форму манифеста, используемую в обновлении запуска API. Это действия оператора, поэтому используйте их только против узла, где разрешен ваш аккаунт и токен:

```python
admin = create_torii_client(
    TORII_URL,
    auth_token="admin-token",
api_token="torii-token",
)

# Propose creates the upgrade instructions; activation/cancel are operator actions.
upgrade = admin.propose_runtime_upgrade(
    {
        "name": "Refresh runtime provenance",
        "description": "Schedules a no-ABI-change runtime rollout.",
        "abi_version": 1,
        "abi_hash": "00" * 32,
        "added_syscalls": [],
        "added_pointer_types": [],
        "start_height": 1_500_000,
        "end_height": 1_500_256,
    }
)
print(upgrade["tx_instructions"])

admin.activate_runtime_upgrade("deadbeef" * 4)
admin.cancel_runtime_upgrade("feedface" * 4)
```

## Статус, консенсус и сетевая телеметрия {#status-consensus-and-network-telemetry}

```python
# `/status` is the public node snapshot endpoint on Taira.
status = client.request_json("GET", "/status", expected_status=(200,))
print(status["blocks"], status["txs_approved"])

# Sumeragi and time endpoints expose consensus and clock diagnostics.
sumeragi = client.get_sumeragi_status_typed()
print(sumeragi.highest_qc.height, sumeragi.tx_queue.saturated)

time_now = client.get_time_now_typed()
time_status = client.get_time_status_typed()
for sample in time_status.samples:
    print(sample.peer, sample.last_offset_ms, sample.last_rtt_ms)
print(time_now.now_ms)
```

## SoraFS, UAID и Kaigi Помощники {#sorafs-uaid-and-kaigi-helpers}

Эти помощники доступны, когда целевой узел раскрывает соответствующий Nexus/SORA Смотрите на пустые списки, как на действительный ответ: публичный Taira может иметь включенный маршрут без данных для манифеста образца; или UAID.

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

# Kaigi health summarizes relay availability when the route is enabled.
health = client.get_kaigi_relays_health_typed()
print(health.healthy_total, health.failovers_total)
```

## Norito RPC и GPU Помощники {#norito-rpc-and-gpu-helpers}

Использование `NoritoRpcClient` когда у вас уже есть Norito байты и необходимо вызвать двоичный Torii конечная точка. Пример требует подписанного конверта из предшествующего шаблона сделки:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

Помощники CUDA возвращают `None`, когда бэкэнд не доступен, так что приложения могут вернуться к масштабным реализациям:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Нынешнее охватывание {#current-coverage}

В Python SDK уже включены помощники для:

- Torii представление, статус, запрос и администраторские потоки
- конструкторы типовых инструкций для общих ISI и специальных доменных расширений;
- рабочие процессы проекта, манифеста, подписания и подписанных конвертов сделок
- потоковые события, фильтры и курсоры для повторного запуска
- общий доступ к готовности Kagemusha и помощники подписки Torii; не подвергаются воздействию настройщиков с загрузкой или выкупом
- адрес счета, помощники для подписания всех алгоритмов, многопрофильные ходовые поезда SM2, GOST, ML-DSA, BLS и обработка секретных ключей
- Подключить URIs, сессии, кадры, помощники шифрования и администратор реестра
- управляемость, обновление времени запуска, Sumeragi, node-admin, SoraFS, UAID и Kaigi оберты конечных пунктов, в которых узел раскрывает эти характеристики

## Ссылки вверх {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Эти файлы являются источником правды для поверхности Python в пересмотре закрепленного рабочего места.
