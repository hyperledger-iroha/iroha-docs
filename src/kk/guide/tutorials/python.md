---
translation_locale: kk
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

Қауымдастық Python SDK жоғары ағымындағы жұмыс кеңістігінде `iroha-python`. Біріншісі Iroha 3 ағымды мақсаттар Torii және Norito интеграцияңызда пайдаланылған пакет нұсқасын немесе көзді қайта қарауды тіркеңіз, сондықтан SDK және түйін бірдей сым пішімі бойынша қайталануда болады.

Төмендегі тек оқуға арналған мысалдар жалпыға бірдей тексерілді Taira бойынша `https://taira.sora.org`. Мутациялық мысалдар транзакция үлгілері: олар нақты Taira уәкілетті орган, жеке кілті, газ метамәліметтері және мақсатты бағыт тапсырудан бұрын талап етілетін оператордың белгілері.

Үлгілерді мына тәртіппен келтіріңіз:

|Этап |Қоғамдық Taira қарсы? |Сізге не қажет ?|
| --- | --- | --- |
|Тек оқуға арналған клиенттік шақырулар |Иә , солай .|Python пакет пен желіге қол жеткізу |
|Жергілікті қолтаңбалау және нұсқау жасаушылар |`submit()` дейін желілік шақыру болмайды |Негізгі кеңейту және негізгі материал |
|Транзакциялар мен қызмет көрсету шақыруларын алмастыру |Тек өз қаражатыңызбен ғана .|Органның шоты, жеке кілті, тізбек ID, алымдар метамәліметтері, алым активтерінің балансы және маршрут белгілері|
|Фрейм кодектерін, крипто және GPU көмекшілерін қосыңыз |Тек жергілікті |Жергілікті кеңейту; GPU көмекшілерге сондай-ақ CUDA-қа қабілетті бэкэнд қажет. |

## Құрылғы {#install}

Басылманың метамәдени атауы: `iroha-python`. Жүгірткісіз болып көрінбеңіз PyPI орнату тіршілікке сәйкес келеді Taira желі. Интеграциялық мақсаттарыңыздың жоғары ағымынан жасалған дөңгелек немесе көзді тексеруден орнатыңыз:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Егер жобаңыз алдыңғы қатардағы жұмыс кеңістігін тікелей тұтынушы болса, Python тәуелділіктерді орнату және жергілікті кеңейтуді орындаудан бұрын қолданатын мысалдарды `Instruction`, `TransactionDraft`, қолтаңбалау, крипто, SoraFS жергілікті көмекшілер, GPU Құрылыс командасын пайдаланыңыз. `python/iroha_python/README.md`, одан кейін жергiлiктi экспорттың жүктемесі:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Егер `create_torii_client` импорт, бірақ `Instruction` немесе `generate_ed25519_keypair` жетіспейді, таза Python пакеті бар, бірақ түпкілікті кеңейту жоқ.

## Шұғыл бастау {#quickstart}

Қоғамдық, тек оқуға арналған Taira аяқ нүктелерімен бастаңыз:

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

## Ортақ орнату {#shared-setup}

Осы баптаудан ауытқушы үлгілерді пайдаланыңыз. Жіберуден бұрын әрбір орынды Taira өкілеттігімен, жеке кілтімен, белгісімен және актив/есеппен IDs алмастыру.

`authority` транзакцияға қол қоятын шот. `private_key` осы шотқа сәйкес келуі тиіс, `CHAIN_ID` мақсатты желіге сәйкес келуі тиіс және `TX_METADATA` желісі күткен алым өрістерін қамтуы тиіс. Төмендегі орын иелері қасақана жарамсыз, сондықтан олар кездейсоқ түрде ұсынылмайды.

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

`Instruction.*` шақырулар тек нұсқаулық жүктемелерін құрастыру. `submit()` - бұл жерде SDK транзакцияға қол қояды, оны Torii, және мәртебеге ие болуды күтеді.

## Төлемдер мен газ {#fees-and-gas}

Төлемдерді жазу үшін алымның метамәдени деректері және қаржыландырылған алым активтерінің балансы қажет. Taira, Төлемақы активтері мемлекеттік краннан қаржыландырылады және транзакцияның метамәдени деректері `gas_asset_id`. Орындау Minamoto, алымдар нақты ақшамен төленеді XOR және активтер ID желісінің конфигурациясынан келеді.

Төлемақы метамәліметтері жеке нұсқауларға емес, транзакцияға жатады. Жоғарыда көрсетілген `submit()` көмекшісі әрбір жасалатын транзакцияға `TX_METADATA` қосады:

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

Хаттарды жібермегенге дейін, әкімдіктің тіркелгісіне төлемақы активінің жеткілікті мөлшерінде бар екеніне көз жеткізіңіз. ID желіге тән; бұл Taira пішіні:

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

Кран бетонды қайтарады . `asset_id` Балансты тексеру үшін пайдаланылады. `gas_asset_id` Метамәліметтер өрісі алым активтерінің анықтамасын пайдаланады ID.

Өтiнiш метамәденидiгiн төлемдерден бөлiп, транзакцияны жасағанда карталарды біріктіру арқылы сақтау:

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

Егер сіз төлемақы метамәліметтерін қалдырсаңыз, дұрыс емес төлемақы активін пайдалансаңыз немесе қаржыландырылмаған шотпен қолтаңбаласаңыз, нақты желі нұсқаулық жүктемесі басқа жағдайда жарамды болса да, транзакцияны бас тартуы керек.

## Taira - Тек оқуға арналған тексерілген шақырулар {#taira-checked-read-only-calls}

Бұл шақырулар Taira жұртшылыққа қарсы сәтті қайтарылды:

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

Маршруттар: `/v1/status`, қоғамдық теңгерімдік инвентарь, Sumeragi RBC үлгіні алу , түйін әкімшісінің шұғыл кескіндері және Connect қосымшасы тіркелімінің басқаруы Taira тексеру кезінде қолданылсын. `request_json("GET", "/status")` мемлекеттік түйін мәртебесінің пайдалы жүктемесі үшін Taira.

## Құрылысшыларға нұсқау {#instruction-builders}

Қауымдастық SDK ең көп таралған нұсқаулық отбасылары үшін типті құрылысшыларды және JSON бірінші дәрежелі емес нұсқалар үшін құтылу қақпағы Python Келесі слайдтар транзакция үлгілерін өзгертеді және олар жария етілмеген: Taira қолтаңбалаушы шотсыз.

Қолда бар кезде түрленген көмекшілерді жақсы көреді: олар қалыпқа келеді Python мәндері және жарамсыз формаларда ерте сәтсіздікке ұшырайды. `Instruction.from_json` тек нұсқаулық нұсқасы қажет болған кезде ғана Python көмекші әлі.

|Инструкциялық отбасы |Python беті |
| --- | --- |
|Тіркеу | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` genesis/bootstrap құрал-жабдықтары үшін |
|Тіркеуден шығару |`unregister_trigger`; басқа нұсқалар үшін `Instruction.from_json` қолданылсын |
|Минда/Борн | `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
|Трансфер | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|Метамәліметтер және бақылау | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
|RWA өмір циклі | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
|ExecuteTrigger |`execute_trigger` |
|Репо/есептің ұзартулары | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|Жергiлiктi активтердiң құлыптары | `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, және клиент `*_and_wait` көмекшілері |
|Grant/Revoque, SetParameter, Log, Custom, Upgrade және реестрдің/реестрден шығудың аз тараған нұсқалары | `Instruction.from_json` немесе `TransactionBuilder.add_instruction_json` каноникалық `InstructionBox` JSON |

Кепілдік түріндегі шартты төлемдер үшін қараңыз: [Жергiлiктi активтердi басқару](/kk/blockchain/escrow.md#python-asset-locks). Python қазіргі уақытта жалпы активтердің бұғаттаулары үшін бірінші деңгейдегі көмекшілерді жария етеді; нарық және анонимді кепілгерлік көмекшілері бірінші деңгейдегі емес Python әдістері әлі.

### Домендерді орнату, содан кейін шоттар мен активтерді тіркеу {#set-up-domains-then-register-accounts-and-assets}

Әдеттегі доменді құру декларативтік псевдонистік жоспарлаушы арқылы өтеді, сондықтан SNS Лизинг, меншік иесі мүмкіндіктері, цитатаны қорғау және домен жағдайы бірге тексеріледі. `AliasSetupPlanRequestV1` мақсатымен SDK немесе борттық қызмет көрсету, содан кейін пайдалану `iroha app alias setup plan` және `iroha app alias setup apply`. Жауап бермей , `Instruction.register_domain` қолданба транзакциясынан; бұл құрылысшы генезис/bootstrap құралдар үшін қалады.

Доменді орнату жоспары басталғаннан кейін, доменге ие объектілерді тіркеңіз. Taira сияқты ортақ желіде сізге тағайындалған домен мен шоттың атау кеңістігін қолданыңыз.

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

`mintable` қабылдады `Infinitely`, `Once`, `Not`, немесе `Limited(n)` деректер моделімен қабылданған мәндер. `scale` шектеусіз сандық актив үшін.

### Минет, күйдіру және трансферттік активтер {#mint-burn-and-transfer-assets}

Бұл шақыруларда қолданыстағы актив ID қолданылады. Бастапқыда активтің анықтамасын тіркеңіз, содан кейін нақты активті ID активке иелік ететін шотқа құру.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Трансферге ие болу {#transfer-ownership}

Меншiлiк аударымдары домендi кім басқарады, активтердiң анықтамасы немесе NFT өзгерген.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Метамәдени деректерді орнату және алып тастау {#set-and-remove-metadata}

Метадеректердің мәні: JSON- серияға шығарылуы мүмкін. `TransactionDraft`, уәкілетті орган `TransactionConfig` әдеттегі мақсатты шотқа айналады.

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

Жоғары деңгейдегі көмекші жоба транзакция органына әдетті түрде бағытталады:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### Реалдық дүниедегі активтер {#real-world-assets}

RWA көмекшілері пайдалану JSON- активтерге тән метамәліметтер, шығу тегі және бақылаушы саясаты үшін сериялданатын пайдалы жүктемелер. `register_rwa` қабылданбайды `id` немесе `owner`: орындалу уақыты `RwaId`, және транзакция органы бастапқы иесі болады.

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

Тіркеу транзакциясы міндеттемелерін алғаннан кейін, пайдалану `FindRwas`, `/v1/rwas`, бір RWA оқиға, немесе зерттеуші маршруты құрылған табылған ID:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Кейінгі операциялар пайдаланған `hash$domain` ID:

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

Толық трансферттер қолданыстағы партияда `owned_by` өзгеруі мүмкін. Қиссалы трансферттер мен біріктірулер туынды балалық партияларын тудырады.

### Қозғалтқыштар {#triggers}

Орындалушы басқа нұсқаулар реттілігі болған кезде триггерлік тіркеу көмекшілерін қолданыңыз:

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

Torii сондай-ақ триггерлік инвентарь үшін REST көмекшілерді анықтайды:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Триггерлік инвентарлық шақырулар тек оқуға немесе триггерлік жазбаларды тексеруге мүмкіндік береді. Тіркеу, орындау, қайталау өзгерістері және тіркеуден шығару - бұл мутациялық операциялар.

### Репо және есеп айырысу нұсқаулары {#repo-and-settlement-instructions}

Репо және екі жақты реттеу көмекшілері Norito қолмен жасалатын жүксіз доменге арналған нұсқаулық нұсқаларын қосады:

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

### JSON Ұшып шығу қақпағы {#json-escape-hatch}

Егер Python көмекші әлі жоқ, қаноникалық деректерді беру үлгісі `InstructionBox` JSON кіреді `Instruction.from_json` немесе тікелей `TransactionBuilder.add_instruction_json`. Бұл жол `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, теңгерімдік / рөл/NFT тіркелу және триггер емес, осы көмекшілерді жазатынға дейін тіркеуден шығару нұсқалары.

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

Жаратылған немесе мөлдірсіз нұсқаулар үшін құрылғыларды сақтаудан бұрын JSON арқылы қайту-қайту:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Тапсырмалар жұмыс барысы {#transaction-workflows}

Пайдалану `TransactionDraft` Қолтаңбалаудан бұрын бірнеше нұсқауларды құратын қолданбалар үшін. `ttl_ms`, `nonce`, және метамәдени деректерді бір жерге қойыңыз, содан кейін бір рет қолтаңбалаңыз:

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

Тексеру, аудит немесе қолма-қол ақшаны беру үшін детерминистік манифесті экспорттау:

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

Мақсат жолағы талап еткен кезде қолтаңбалауға дейін жолдың құпиялылығын куәландыратын куәлікті қосады:

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

## Сұрақтар {#queries}

JSON сөздіктерінің орнына деректер кластарын қайтарады. Олар бастаудың ең оңай тәсілі, өйткені SDK параметрлері басуды және сіз үшін ортақ жазба өрістерін талдау:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Torii аяқтық нүктеде әлі күнге дейін түрленген қаптама болмаса, жалпы сұраныс көмекшілерін қолдану:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

Тіркелiк түгендеуге көмекшiлер есептің идентификаторын SDK нормализатор.Каноникалық қолданыңыз I105 есеп IDs немесе тізбектегі аты-жөндер; егер блок эксплуатанты немесе сырьелік соңғы нүкте бір ID Бұл SDK қабылдамайды, оны каноникалық есепке бекітеді. ID Осы көмекшілерді шақырмас бұрын:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Оқиғалар {#events}

Желідегі көмекшілерді кодтау JSON Әдеттегідей пайдалы жүктер. `with_metadata=True` қажет болған кезде SSE Іс-шара атауы, идентификаторы, қайтадан сынап көріңіз және сыбайлас жүктеме. `EventCursor` Бұл мысалдар тікелей оқиғаларды күтеді, сондықтан оларды тиісті оқиға ағыны қосылған және белсенді болатын түйінге қарсы орындаңыз.

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

## Кілттер мен мекенжайлар {#keys-and-addresses}

SDK жергiлiктi қолтаңбалау көмекшiлерiн түпкiлiк кеңейтуге жинақталған әрбiр қолтаңба алгоритмi үшiн анықтап береді. Бұл көмекшiлерге Taira шақыру қажет емес, бірақ олар түпкiлдi кеңейтуді талап етеді:

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

Пайдалану `supported_crypto_algorithms()` Жалпы көмекшілер каноникалық алгоритм белгілерін пайдаланады және Ed25519, secp256k1 үшін жұмыс істейді. ML-DSA, GOST, BLS, және SM2 егер бұл алгоритмдер мыналар бойынша жинақталса:

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

### Қытайлық SM Шифрлау {#chinese-sm-cryptography}

Қауымдастық Python SDK жалпы өнімдерін шығарады SM2 көмекшілері және SM2-белгілі ыңғайлылық көмекшілері. SM2 мақсатты желі күткен айырмашылық белгісі:

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

`crypto.sm.enabled` түйіннің қабылдайтындығын айтады SM- отбасылық алгоритмдер оның қазіргі саясатында. SM hash саясаты мен жеделдету жағдайы, бұл рұқсат беруді шешкен кезде пайдалы SM2-шағын ағымдар:

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

Қоғамдық Taira жария еткен SM тексеру кезінде мүмкіндікті жарнамалау, бірақ SM Ол жерде қолтаңбалау рұқсат етілмеген. `ed25519`, `secp256k1`, және `bls_normal`, Сондықтан бағынбаңдар! SM2-белгіленген транзакциялар, егер мүмкіндіктің пайдалы жүктемесі өзгермесе.

### GOST және кванттықтан кейінгі кілттер {#gost-and-post-quantum-keys}

Жалпы криптовалюты қолданылсын API үшін GOST R 34.10-2012 параметрлер жиынтығы және ML-DSA (`ml-dsa`) кванттық қолтаңбалар.Бірден бір кілт-пар объектісі қолтаңбалауды, тексеруді және көп қапшықты экспорттауды жүзеге асырады:

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

Кеме GOST және түйіннің жарнамаланған қолтаңбалау алгоритмдерінде кванттық ағыннан кейінгі ағындар. Алға қарай үйлесімді алгоритм атаулары үшін шикі мүмкіндіктер пайдалы жүктемесін қолданыңыз:

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

Егер түйін сізге қажетті алгоритмді жарнамаламаса, кілтті тек жергілікті немесе офлайн жұмыс барысы үшін ғана қолданыңыз. Taira тексеру, GOST және ML-DSA қол жетімді болды SDK жоғарғы ағыстағы крипто көмекшілер Python кітапхана, бірақ транзакцияға қол қою үшін түйін жарнамаламаған.

## Конфигурациялық клиентті құру {#config-aware-client-creation}

`resolve_torii_client_config` қолданбаңыз файлдан түйін параметрлерін оқығанда, бірақ әлі күнге дейін қоршаған ортаға немесе сынаққа байланысты артықшылықтарға мұқтаж болған кезде қолданылсын:

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

## Кагемуша дайындығы {#kagemusha-readiness}

Қауымдастық Python SDK ағымды сұрауға болады JSON дайындық жолы оның жалпыға бірдей Torii сұраныс көмекшісі:

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

Python Қагемуша түрлендіруін немесе құптау архивті жасаушыларын ашпайды. Swift немесе JVM Каноникалық құрастыруға арналған қоршау V4 Архивтер, содан кейін оларды қолданатын Кагемуша арқылы тапсырып, сауалнама жүргізу. Torii клиент.

## Тіркелімдер {#subscriptions}

Абонент көмекшілері ортақ телефоннан мұра етілген қызмет шақыруларын өзгертеді . Torii пайдаланушы `iroha_python.ToriiClient`. Пайдалану IDs және сіз мақсат еткен желіде бар активтер.

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

## Қосылу {#connect}

URIs қосылымын құру және талдау, және Taira арқылы ашық қосылым күйін оқыңыз:

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

Фрейм кодектері, сессиондық кілттерді алу және сессионды құру үшін жергілікті кеңейту мен қосылған Connect сессион жолы қажет:

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

Бекітілгеннен кейінгі хабарламаларды штатты сессиямен шифрлау:

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

## Басқару, Runtime және Админ беттері {#governance-runtime-and-admin-surfaces}

Бұл тек оқуға арналған шақырулар Taira жұртшылыққа қарсы сәтті қайтарылды:

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

Ағымдағы уақытта жаңарту көмекшілері орындалу уақытында жаңарту API пайдаланатын манифест пішінін қабылдайды. Олар оператор әрекеттері, сондықтан оларды тек сіздің тіркелгіңіз мен токеніңіз рұқсат етілген түйіндіге қарсы қолданыңыз:

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

## Статус, консенсус және желілік телеметрия {#status-consensus-and-network-telemetry}

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

## SoraFS, UAID, және Kaigi Көмекшілер {#sorafs-uaid-and-kaigi-helpers}

Бұл көмекшілер мақсатты түйін тиісті Nexus/SORA бос тізімдерді жарамды жауап ретінде қараңыз: қоғамдық Taira үлгі манифесті бойынша деректерсіз бағыт рұқсат етілуі мүмкін немесе UAID.

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

## Norito RPC және GPU Көмекшілер {#norito-rpc-and-gpu-helpers}

Пайдалану `NoritoRpcClient` бар болсаңыз Norito байттер және бинарлық шақыру керек Torii соңғы нүкте. мысалға алдыңғы транзакция үлгісінен қол қойылған конверт қажет:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

CUDA көмекшілері `None` Backend жоқ болған кезде қайтарады, сондықтан қолданбалар масштабты іске асыруларға қайтып келуі мүмкін:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Қазіргі кездегі қамту {#current-coverage}

Python SDK құрамында келесілер үшін көмекшілер бар:

- Torii тапсыру, жай-күйі, сұрау салу және әкімші ағындары
- ортақ ISI және доменге арналған кеңейтулер үшін типтік нұсқаулық жасаушылар
- Транзакциялардың жобалары, манифестері, қол қою және қол қойылған транзакциялық конверттің жұмыс барысы
- ағымды оқиғалар, сүзгілер және қайта іске қосылатын курсорлар
- жалпы Kagemusha дайындық қолжетімділігі және Torii жазылу көмекшілері; түрлендіруді толтыру мен төлем жасаушыларды ашуға болмайды
- тіркелгі адресі, барлық алгоритмдерге қол қою көмекшілері, көп қапшықтармен қайта-қайта сапарлар, SM2, GOST, ML-DSA, BLS, және құпия кілттерді басқару
- URIs, сессиялар, кадрлар, шифрлау көмекшілері және тіркелгі әкімшісі қосылсын
- басқару, жұмыс уақытын жаңарту, Sumeragi, түйін әкімшісі, SoraFS, UAID, және Kaigi түйін осы қасиеттерді ашатын соңғы нүктелерді қаптаулар

## Өскемендік сілтемелер {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Бұл файлдар тіктелген жұмыс кеңістігін қайта қараудағы Python бетінің шындық көзі болып табылады.
