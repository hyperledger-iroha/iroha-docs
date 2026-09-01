---
translation_locale: kk
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Python {#python}

Өңдеуші жұмыс кеңістігіндегі Python SDK `iroha-python` болып табылады. Алғашқы Iroha 3 шығарылым қазіргі Torii және Norito беттеріне бағытталған. Пакет нұсқасын немесе интеграцияңызда қолданылатын бастапқы өзгерту нұсқасын бекітіңіз, сонда SDK және түйін бір сериализациялау форматындағы нұсқада қалады.

Төменде көрсетілген жасырын оқылым мысалдары `https://taira.sora.org` мекен-жайындағы жалпы Taira нысанын нысана етеді. Бағыт тек оқу режимінде болуы мүмкін және әлі де бір протокол-стандартты есептік жазба қолтаңбасы немесе нақты желі операторының қолтаңбасын талап етуі мүмкін; сол мысалдар бөлек белгіленген. Мутация жасайтын мысалдар – бұл транзакция шаблондары және оларды жібермес бұрын нақты Taira уәкілетті субъект, жеке кілт, типтелген ақы төлеу ниеті, жеткілікті тесттік желідегі XOR және мақсатты маршрут арқылы қажет етілетін аутентификацияны талап етеді.

Мысалдарды осы ретте пайдаланыңыз:

|Сахна|Қоғамдық Taira-қа қарсы жүгіру?|Сізге қажет нәрсе|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|Анонимді шақыруларды оқу|Иә|Python пакет плюс желіге қосылу|
|Есептік жазба немесе оператор арқылы расталған оқу|Тек өзіңіз мойындаған тұлғалықпен|Нақты Taira `NetworkId` және сәйкес есептік жазба немесе оператор кілті|
|Жергілікті қол қою және нұсқаулық жасаушылар| `submit()` дейін желі шақыру жоқ |Туа біткен кеңейтім және сіздің негізгі материалыңыз|
|Транзакцияларды және қызмет шақыруларын өзгерту|Тек өзіңіз қаржыландырған есепшотпен ғана|рұқсат беру негізгі есепшот, жеке кілт, дәл Taira `NetworkId`, терілген төлем ниеті, төлем активі балансы және маршруттық токендер|
|Фрейм кодектері, крипто және GPU көмекшілерді қосу|Тек жергілікті|Төл кеңейту; GPU көмекшілерге сондай-ақ CUDA-қабілетті сервер қажет|

## Орнату {#install}

Қаптама метадеректері атауы `iroha-python`. Тіркелмеген PyPI орнатылымның тікелей Taira желімен сәйкес келетініне сенбеңіз. Интеграция мақсат ететін сол жоғары деңгейлі нұсқадан жасалған дөңгелек немесе дереккөз коды жұмыстық көшірмесін орнатыңыз:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Егер сіздің жобаңыз тікелей жоғары ағымдағы жұмыс кеңістігін пайдаланса, мысалдарды іске қоспас бұрын Python тәуелділіктерін орнатыңыз және жергілікті кеңейтімді құрастырыңыз, олар `Instruction`, `TransactionDraft` пайдаланатын болады. қол қою, крипто, SoraFS жергілікті көмекшілер, GPU көмекшілер немесе Connect frame кодектері. Жоғары потоктағы `python/iroha_python/README.md` команданы жинау үшін пайдаланыңыз, содан кейін жергілікті экспорттардың жүктелгенін тексеріңіз:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Егер `create_torii_client` импортталса, бірақ `Instruction` немесе `generate_ed25519_keypair` сәтсіз болса, таза Python пакеті қол жетімді, бірақ жергілікті кеңейтім жоқ.

## Жылдам бастау {#quickstart}

Қоғамдық, тек оқу үшін арналған Taira API ұштарынан бастаңыз:

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

## Ортақ баптау {#shared-setup}

Өзгереді шаблондар үшін осы баптауды пайдаланыңыз. Жібермес бұрын әрбір орынбасарды сіздің орналастыруыңыздан Taira рұқсат иесі, жеке кілт, токен және актив/шот идентификаторларымен ауыстырыңыз.

`authority` транзакцияны қол қоятын есепшот болып табылады және `private_key` оны сәйкестендіруі керек. Транзакциялар Taira-тің нақты бастама шыққан `NetworkId`-не байланған; тізбек UUID - бұл орналастыру белгісі, транзакцияның сәйкестендірілуі емес. Төлемдер қолданба метадеректеріне тәуелсіз, терілген төлем ниеті мен нақты тірі баға бойынша жүргізіледі. Төмендегі есептік жазба және кілт ұяшықтары қасақана жарамсыз етіп көрсетілген, сондықтан олар кездейсоқ жіберілмейді.

Төмендегі мәтін қазіргі бекітілген Taira блокчейннің бастапқы жеке куәлігін көрсетеді. Тестілеу желісін қалпына келтіру оны өзгерте алады, сондықтан оны қол қойылған орналастыру профилінен жаңартыңыз және ешқашан оны тізбектен UUID шығып ойлап таппаңыз.

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

`Instruction.*` тек қана құру нұсқауларын тасымалдауды шақырады. `submit()` — бұл SDK нақты баға ұсынылған тасымалды ала отырып, оны қол қояды, Torii-ге жібереді және статус күту нүктесі.

## Төлемдер мен транзакцияны орындау құны {#fees-and-gas}

Жазу транзакциялары үшін типтелген `FeePaymentIntent` және қаржыландырылған комиссиялық актив қалдығы қажет. Taira бойынша, қоғамдық тесттік желі қаржыландыру қызметі тесттік желіні XOR қаржыландырады. Python SDK белгіленген қолтаңбасыз жібереді Torii үшін нақты төлем бағасын бағалау үшін payload жібереді, дәйексөздің төлеуші немесе payload-ты алмастырмағанын тексереді және ұсынылған ниетті растайды. Төлем таңдауын транзакция метадеректеріне қоспаңыз.

Жоғарыдағы `submit()` көмекші транзакцияны қол қоятын есепшотқа арналған ниеттен басталады, оның төлем шектеулері санаулы түрде бос қалдырылған. `quote_and_sign()` оларды қол қояр алдында нақты бағадан толтырады:

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

Жазбаларды жібермес бұрын, авторизация негізгі аккаунты төлем активінің жеткілікті мөлшеріне ие екеніне көз жеткізіңіз. Дәл тесттік желі қаржыландыру қызметі және актив идентификаторы желіге тән; бұл Taira пішіні:

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

Тест желісін қаржыландыру қызметі балансды тексеру үшін нақты `asset_id` қайтарады. Тікелей баға `FEE_ASSET_DEFINITION` деп алынатынын тексеріңіз; транзакция бұл активті метадеректер арқылы таңдамайды.

Қолданба метадеректері міндетті емес және төлем семантикасы жоқ:

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

Егер сіз төлем мақсатын тастасаңыз, күтпеген активке баға ұсынысын қабылдасаңыз, баға ұсынысынан кейін жүктемені өзгертсеңіз немесе қаражатсыз есепшотпен қол қойсаңыз, транзакция жіберілмеуі керек.

## Аноним Taira Оқиды {#anonymous-taira-reads}

Бұл қоңыраулар каталог шекарасы ананимді оқу рұқсатын беретін Taira маршруттарды пайдаланады:

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

`/v1/time/status` және әрбір `/v1/sumeragi/*` оператордың уақыт бойынша деректер көрінісі нақты желі операторының қолтаңбасын қажет етеді, тіпті олар күйді өзгертпесе де. Анонимдік түйін үшін `request_json("GET", "/status")` қолданыңыз Статус жүк және консенсус немесе түйін-локальды сағат диагностикасы үшін төмендегі операторлық баптау. Сессия статусын қосу жеке протокол маршруты болып табылады және сол сессияның басқару токенін талап етеді.

## Нұсқаулық жасаушылар {#instruction-builders}

SDK ең көп тараған нұсқау отбасылары үшін типтелген құру құралдарын және әлі бірінші дәрежелі Python әдістері емес нұсқалар үшін JSON шығу жолын ұсынады. Келесі үзінділер транзакция үлгілерін өзгертеді және қолтаңбалы есептік жазбасыз жалпы Taira жарияланған жоқ.

Бар болса типтелген көмекшілерді қолданған дұрыс: олар Python мәндерін қалыпқа келтіреді және жарамсыз пішіндерде ерте сәтсіздікке ұшырайды. Python көмекшісі әлі жоқ нұсқаулық нұсқасы қажет болған жағдайда ғана `Instruction.from_json` қолданіңіз.

|Нұсқаулық отбасы| Python беткі қабат|
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|Тіркелу| `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` генезис/бастапқы құралдар үшін бөлінген |
|Тіркелуден шығару| `unregister_trigger`; басқа нұсқалар үшін `Instruction.from_json` пайдаланыңыз|
|Басу/Жою| `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
|Ауыстыру| `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa`|
|Метадеректер және басқару элементтері| `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value`                                                                        |
| RWA өмірлік цикл|`merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa`|
| ExecuteTrigger | `execute_trigger`|
|Репо/төлем жерлері бойынша ұзартулар| `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp`|
|Туынды активтерді құлыптау| `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, сонымен қатар клиент `*_and_wait` көмекшілері|
|Рұқсат/Жою, SetParameter, Журнал, Арнайы, Жаңарту және сирек қолданылатын тіркеу/тіркеуден шығару нұсқалары| `Instruction.from_json` немесе `TransactionBuilder.add_instruction_json` бір протокол-стандартты `InstructionBox` JSON|

Эскроу-стильдегі шартты төлемдер үшін, [Туынды активтерді сенімхатта сақтау](/kk/blockchain/escrow.md#python-asset-locks) қараңыз. Қазіргі уақытта Python жалпы активтерді құлыптау үшін бірінші дәрежелі көмекшілерді ұсынады; нарық және анонимді эскроу көмекшілері әлі бірінші дәрежелі Python әдістері емес.

### Домендерді орнатыңыз, содан кейін есептік жазбалар мен активтерді тіркеңіз {#set-up-domains-then-register-accounts-and-assets}

Кәдімгі доменді жасау декларативті одақтас жоспарлаушы арқылы өтеді, сол арқылы SNS жалдау, иелік мүмкіндіктері, төлем-бақылау тексерулері және домен күйі бірге тексеріледі. Сіздің SDK немесе кіріспе қызметіңізбен құпиясыз `AliasSetupPlanRequestV1` ниетін жасаңыз, содан кейін `iroha app alias setup plan` және `iroha app alias setup apply` пайдаланыңыз. `Instruction.register_domain` қолданба транзакциясынан жіберілмесін; бұл құрастырушы алғашқы/жүктеу құралдарына қалдырылған.

Доменді орнату жоспары аяқталғаннан кейін, доменге тиесілі объектілерді тіркеңіз. Taira сияқты ортақ желіде сізге тағайындалған домен және есептік жазба атаулары кеңістігін пайдаланыңыз.

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

`mintable` деректер моделінде қабылданатын `Infinitely`, `Once`, `Not` немесе `Limited(n)` мәндерін қабылдайды. Шектелмеген сандық актив үшін `scale`-ты қалдыруға болмайды.

### мәселе, жою және активтерді аудару {#mint-burn-and-transfer-assets}

Бұл шақырулар бар актив идентификаторын пайдаланады. Ең алдымен актив анықтамасын тіркеп, содан кейін активке ие есептік жазба үшін нақты актив идентификаторын құрыңыз.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Меншік құқығын аудару {#transfer-ownership}

Меншік құқығын беру доменді, активтің анықтамасын немесе NFT кім басқаратындығын өзгертеді. Транзакцияны рұқсат беруші ретінде ағымдағы меншік иесін пайдаланыңыз.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Мәліметтерді орнату және жою {#set-and-remove-metadata}

Мета деректер мәндері JSON-сериалданатын болуы керек. Сіз `TransactionDraft` қолданған кезде, `TransactionConfig`-дегі уәкілетті субъект әдепкі мақсатты есепшотқа айналады.

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

Жоғары деңгейлі жобалау көмекшісі әдепкі бойынша транзакцияны растау қағидатына бағытталған:

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

### Шынайы дүниедегі активтер {#real-world-assets}

RWA көмекшілері активтерге арналған метадеректер, шығу тегі және басқару саясаты үшін JSON-seriable жүктемелерді пайдаланады. `register_rwa` `id` немесе `owner`-ні қабылдамайды: бағдарламалық қамтамасыз ету орындау ортасы `RwaId` тудырады, ал транзакцияны растау басшысы бастапқы иесі болады.

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

Тіркеу транзакциясы аяқталғаннан кейін, жасалған ID-ны табу үшін `FindRwas`, `/v1/rwas`, RWA оқиғасын немесе шолушы маршрутты пайдаланыңыз:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Келесі операциялар жасалған `hash$domain` идентификаторын пайдаланады:

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

Толық аудармалар бар болатын учаскедегі `owned_by` өзгерте алады. Жартылай аудармалар мен біріктірулер жасалған қосалқы учаскелерді құрады.

### Триггерлер {#triggers}

Егер орындалатын файл басқа нұсқаулар тізбегі болса, триггерді тіркеу көмекшілерін пайдаланыңыз:

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

Torii сондай-ақ триггерлік инвентаризация үшін REST көмекшілерін көрсетеді:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Триггерлік инвентаризация шақырулары тек триггер жазбаларын оқиды немесе тексереді. Тіркелу, орындау, қайталау өзгерістері және тіркеуді жою – бұл өзгерту операциялары.

### Репо және қаржылық транзакцияларды есеп айырысу нұсқаулықтары {#repo-and-settlement-instructions}

Репо және екіжақты есеп айырысу көмекшілері доменге тән нұсқаулық нұсқаларын қолмен жасалған Norito жүктемелерсіз қосады:

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

### JSON Қашу люгі {#json-escape-hatch}

Python көмекшісі қолжетімсіз болса, канондық деректер моделінің `InstructionBox` JSON мәнін `Instruction.from_json` функциясына беріңіз. Бұл көмекшілер типтелгенше, `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, түйін/рөл/NFT тіркеуі және триггерге қатысы жоқ тіркеуден шығару нұсқалары үшін осы жолды пайдалану ұсынылады.

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

Транзакция шегінде жазылған жобаның жолын сақтаңыз: ол дәл `NetworkId`, төлем жасау ниетін және қол қоюға дейінгі ұсынысты сақтайды. Тікелей `TransactionBuilder` қолдану сол мәндерді және тірі ұсынысты нақты тексеруді қажет етеді, сондықтан бұл қосымша коды үшін қысқарту емес.

Жасалған немесе мөлдір емес нұсқаулар үшін тест артефакттарын сақтамас бұрын JSON арқылы оралу:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Транзакция жұмыс процестері {#transaction-workflows}

Қол қоюдан бұрын бірнеше нұсқаулар құрайтын қосымшалар үшін `TransactionDraft` пайдаланыңыз. Жоба сізге `ttl_ms`, `nonce` сияқты транзакция деңгейіндегі параметрлер мен метадеректерді бір жерде сақтауға мүмкіндік береді, содан кейін бір рет қол қоясыз:

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

Шолу, аудит немесе әмиянды тапсыру үшін детерминдік техникалық манифесті экспорттаңыз:

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

Мақсатты орындалу жолы оны талап етсе, қол қоймас бұрын орындалу жолының құпиялылық дәлелін тіркеңіз:

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

## Сұраулар {#queries}

Жазылған сұрау көмекшілері шикі JSON сөздіктердің орнына деректер кластарын қайтарады. Олар бастау үшін ең оңай жол, себебі SDK сіз үшін беттік нөмірлеу мен жалпы жазба өрістерін талдайды:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Torii API соңғы нүктесіне әлі типтелген бағдарламалық адаптер жоқ болса, жалпы сұрау көмекшілерін пайдаланыңыз:

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

Есептік жазба қорын түгендеу көмекшілері SDK қалыптандырғышы қабылдайтын есептік жазба идентификаторын талап етеді. Канондық I105 есептік жазба ID-лерін немесе тізбектегі алиастарды пайдаланыңыз; блок шолушысы не өңделмеген API соңғы нүктесі SDK қабылдамайтын ID қайтарса, бұл көмекшілерді шақырмас бұрын оны канондық есептік жазба ID-іне түрлендіріңіз:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Оқиғалар {#events}

Ағындық көмекші бағдарламалар әдепкі бойынша JSON пакеттерін декодтайды. `with_metadata=True` жіберіңіз, егер сізге SSE оқиғаның атауы, идентификаторы, қайта әрекет ету нұсқауы және шикі пакет қажет болса. Бір ғана протокол-стандартты `/v1/events/sse` ағыны тек тірі түрде: ол ешқандай қайта ойнату идентификаторларын шығармайды және ешқандай қайта ойнату тізілімі сақтамайды, сондықтан бұл көмекшілер ешқандай курсор немесе қайта жалғастыру аргументін көрсетпейді. Қайта қосылу жаңа жазылым бастайды және ол үзіліс болуы мүмкін; Толық блокчейн тізім тарихы қажет болғанда белгілі бір биіктіктен `/v1/blocks/stream` пайдаланыңыз. Бұл мысалдар тірі оқиғаларды күтіп отырады, сондықтан оларды ағын қосылған және белсенді түйінге қарсы іске қосыңыз.

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

## Кілттер мен мекенжайлар {#keys-and-addresses}

SDK жергілікті қол қою алгоритмдері үшін барлық қол қою көмегін жергілікті кеңейтуге енгізілген әрбір қолтаңба алгоритміне ашады. Бұл көмекшілер Taira-ды шақырмайды, бірақ олар жергілікті кеңейтуді талап етеді:

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

`supported_crypto_algorithms()` пайдаланып, дөңгелегіңіздің не қолдайтынын көріңіз. Жалпы көмекшілер бір протокол-стандарт алгоритм белгілерін пайдаланады және алгоритмдер құрастырылған кезде Ed25519, secp256k1, ML-DSA, GOST, BLS, және SM2 үшін жұмыс істейді:

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

### Қытайлық SM Криптография {#chinese-sm-cryptography}

Python SDK жалпы SM2 көмекшілері мен SM2-қа тән ыңғайлылық көмекшілерін ашады. Мақсатты желі күтетін SM2 ажырататын идентификаторды таңдау үшін түйін қабілеті жарнамасын пайдаланыңыз:

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

`crypto.sm.enabled` қазіргі саясаты бойынша түйіннің SM-отбасылық алгоритмдерді қабылдайтын-қабылдамайтынын айтады. Сол жарнамада SM криптографиялық хэш саясаты мен жылдамдату күйі де көрсетілген, бұл SM2-қа тән ағындарды қосу туралы шешім қабылдағанда пайдалы:

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

Расталған қабілет жүктемесін орналастырылған түйін үшін авторитеттік деп қараңыз. `crypto.sm.enabled` дұрыс болмаса және жарнамаланған қол қою саясаты оны қабылдамаса, SM2 қол қойылған транзакцияны жібермеңіз.

### GOST және Пост-кванттық кілттер {#gost-and-post-quantum-keys}

GOST R 34.10-2012 параметр жиынтықтары және ML-DSA (`ml-dsa`) посткванттық қолтаңбалар үшін жалпы криптографиялық API қолданыңыз. Сол кілт жұбы объектісі қол қою, тексеру және мультихэш экспортын басқарады:

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

Есігі GOST және түйіннің аутентификацияланған, типтелген қабілет жарнамасындағы посткванттық ағындар:

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

Егер түйін сізге қажет алгоритмді жарнамаламаса, кілтті тек жергілікті немесе офлайн жұмыс процестері үшін пайдаланыңыз. Сол алгоритммен қол қойылған транзакцияларды сол түйінге жібермеңіз. Қоғамдық Taira тексеру кезінде GOST және ML-DSA SDK крипто көмекші ретінде жоғары ағымдағы Python кітапханасында қолжетімді болды, бірақ түйінмен транзакцияға қол қою үшін жарнамаланбады.

## Конфигурацияны ескеретін клиентті құру {#config-aware-client-creation}

Қолданбаңыз файлдан түйін орнатуларын оқыған кезде бірақ әлі де орта- немесе тест-қа қатысты түзетулер қажет болғанда `resolve_torii_client_config` пайдаланыңыз:

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

## Кагемуша дайындық {#kagemusha-readiness}

Python SDK өзінің жалпы Torii сұрау көмекшісі арқылы ағымдағы JSON дайындық жолын сұрай алады:

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

Python типтелген Kagemusha толықтыру немесе өтелу архивін құру құралдарын ашпайды. Бір протокол-стандартты V4 архивтерін құру үшін типтелген Swift немесе JVM әмиянды пайдаланыңыз, содан кейін оларды қолдайтын Kagemusha Torii клиенті арқылы жіберіп, сұраңыз.

## Жазылымдар {#subscriptions}

Жазылым оқу құралдары мен жобалау құрастырушылар `iroha_python.ToriiClient` пайдаланатын ортақ Torii клиенттен мұраға алынды. Әрбір өзгеріс денеге бекітілген жеке өзгертумен қабылданады протокол-стандартты есептік жазба қолтаңбасы және қолтаңбаланбаған транзакция жобасын қайтарады. Torii ешқашан жеке кілтті қабылдамайды және жобаны сіз үшін жібермейді.

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

Әрбір нақты жүктеме мен қол қою хабарын сәйкес есептік жазбаның жергілікті әмиянына беріңіз, сұралған операцияны онда тексеріңіз, қол қойылған транзакцияны жинаңыз және оны қалыпты транзакция бағдарламалық қамтамасыз ету өңдеу ағыны арқылы жіберіңіз. Python SDK қол қою хабарының қайтарылған жүктеменің бірегей протоколдық стандартқа сәйкес криптографиялық хэш екендігін тексереді, бірақ әмиян транзакцияны қол қоюдан бұрын декодтау және мақұлдау үшін жауапкершілікті өзінде ұстайды.

## Қосу {#connect}

Connect URIs-ты жергілікті түрде құрыңыз және талдаңыз. Connect сәйкестігі SID-ны дәл `NetworkId`, қолданба қоғамдық кілті және криптографиялық nonce мәнімен байланыстырады:

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

Мақсатты торап Connect көрсеткен кезде дәл сол алдын ала қарауды тіркеңіз. Сессияны құру төрт рөлге арналған тасымалдаушы токендерін қайтарады. Әр сессиялдық күй маршруты басқару токенін қажет етеді; жиынтық күй оператор маршруты болып табылады.

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

Пост-рақыметтеу хабарламаларын күйі бар сессиямен шифрлаңыз:

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

## Басқару, бағдарламалық қамтамасыз ету орындалу ортасы және әкімші бетті беттері {#governance-runtime-and-admin-surfaces}

Басқару оқу жазбалары есептік жазба арқылы расталған. [Ортақ баптау](#shared-setup) нөмірінен рұқсат қағидаты мен кілт жұбын пайдаланып, әрбір көмекші шақыруды Taira-нің нақты бастама-шығарылған `NetworkId` деректеріне байлаңыз:

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

Оператор оқулары үшін бөлек клиент жасаңыз. Рұқсат етілген оператор кілтін бағдарламалық орындау ортасына жүктеп, оны Taira-нің дәл `NetworkId` мәніне байлаңыз; тасымалдаушы токендер мен `x-api-token` осы қолтаңбаны алмастырмайды:

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

Уақытты-арттыру бағыттары - оператор растамасымен нұсқаулық құрастырушылар. Сәтті ұсыну, іске қосу немесе болдырмау жауабы `tx_instructions` қайтарылады; бұл жаңартуды жүзеге асырмайды. Сол топтаманы әдеттегі қол қойылған транзакция және басқару жолы арқылы жіберіңіз. Қосылған Python әдістері `propose_runtime_upgrade`, `activate_runtime_upgrade`, және `cancel_runtime_upgrade` қазіргі уақытта клиенттің `OperatorSigningContext` пайдалану орнына қарапайым сұраулар жасайды, сондықтан бұл оқулық оларды жұмыс істейтін оператор ағыны ретінде көрсетпейді.

## Күйі, Келісім және Желілік Телеметрия {#status-consensus-and-network-telemetry}

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

## SoraFS, UAID, және Kaigi Көмекшілер {#sorafs-uaid-and-kaigi-helpers}

Аталған көмекшілер мақсатты түйін сәйкес Nexus/SORA API соңғы нүктелерді көрсеткен кезде қолжетімді. Бос тізімдерді жарамды жауап ретінде қарастырыңыз: қоғамдық Taira үлгі техникалық манифест немесе UAID үшін деректерсіз маршрут қосылған болуы мүмкін.

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

## Norito RPC және GPU Көмекшілер {#norito-rpc-and-gpu-helpers}

`NoritoRpcClient` пайдаланыңыз, егер сізде уже Norito байт болса және бинарлық Torii API нүктесін шақыру қажет болса. Мысал алдыңғы транзакция шаблонынан қол қойылған деректер контейнерін талап етеді:

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

CUDA көмекшілері сервер қолжетімсіз болған жағдайда `None` қайтарады, сондықтан қосымшалар скалярлық іске асыруларға орала алады:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Ағымдағы қамту {#current-coverage}

Python SDK қазірдің өзінде келесі үшін көмекшілерді қамтиды:

- Torii жіберу, мәртебе, сұрау және әкімшілік ағындар
- ортақ ISI және доменге тән кеңейтімдер үшін терілген нұсқаулық жасаушылар
- транзакция жобалары, техникалық манифесттер, қол қою және қол қойылған транзакция деректер контейнерінің жұмыс ағымдары
- тірі оқиға ағындары және терілген сүзгілер; аяқталған блок ағындары толық тарихты қамтамасыз етеді
- жалпы Кagemusha дайындыққа қол жеткізу және Torii жазылым көмекшілері; типтелген толықтыру және өтеу құрастырушылары көрсетілмейді
- шот мекенжайы, барлық-алгоритмдік қол қою көмекшілері, мультихэш айналымдары, SM2, GOST, ML-DSA, BLS, және құпия кілтпен жұмыс істеу
- URIs, сеанстар, кадрлар, шифрлау көмекшілері және тіркеу әкімшісімен қосылыңыз
- басқару, бағдарламалық қамтамасыз етуді іске асыру ортасының жаңартуы, Sumeragi, node-admin, SoraFS, UAID және Kaigi API соңғы нүкте бағдарламалық адаптерлері, онда түйін осы мүмкіндіктерді көрсетеді

## Ағысты сілтемелер {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Ол файлдар бекітілген жұмыс аймағы нұсқасындағы Python бетінің шынайы деректерінің қайнар көзі болып табылады.
