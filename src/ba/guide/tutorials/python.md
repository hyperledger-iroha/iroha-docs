---
translation_locale: ba
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Python {#python}

Ҡоролтай Python SDK өҫкө ағымындағы эш урынында `iroha-python`. Тәүгеһе Iroha 3 сығарыу маҡсаттары ағымдағы Torii һәм Norito өҫкө йөҙҙәр. һылтанма версияһы йәки сығанаҡ үҙгәртеп ҡороу һеҙҙең интеграция өсөн ҡулланылған SDK һәм node бер үк сериализация форматы ревизияһында ҡалһын.

Маҡсатлы халыҡ аҫтындағы аноним уҡыу миҫалдары Taira на сайте `https://taira.sora.org`. Маршрут уҡырға ғына мөмкин һәм барыбер кананик иҫәп яҙмаһы ҡултамғаһы йәки тура селтәр операторының ҡултамғаһын талап итә. был миҫалдар айырым билдәләнә. мутация миҫалдары транзакция өлгөләре һәм реаль талап Taira вәкәләтле иҫәп, шәхси асҡыс, түләүҙе яҙыу ниәте, етерлек тест селтәре XOR, һәм уларҙың тапшырылыуынан алда маҡсатлы маршрут талап иткән аутентификация.

Миҫалдарҙы ошо тәртиптә килтерегеҙ:

|Этап |Taira халыҡҡа ҡаршы йүгереү? |Һеҙгә нимә кәрәк ?|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|Анонимдар саҡырыуҙарҙы уҡый .|Эйе .|Python пакет плюс селтәргә инеү |
|Бухгалтер йәки оператор тарафынан раҫланған уҡыуҙар |Тик үҙегеҙҙең танылған шәхесегеҙ менән генә .|Дөрөҫ Taira `NetworkId` һәм тейешле иҫәп йәки оператор асҡысы |
|Урындағы ҡултамға төҙөүселәр һәм инструкциялар |`submit()` тиклем селтәргә саҡырыу юҡ. |Native киңәйтеү һәм һеҙҙең асҡыс материалы |
|Транзакцияларҙы һәм хеҙмәт саҡырыуҙарын күсереү |Үҙегеҙҙең аҡсалата иҫәбенә генә файҙаланығыҙ .|Хакимиәттең иҫәбенә, шәхси асҡысы, аныҡ Taira `NetworkId`, типланған түләү маҡсаты, түләү активтары балансы һәм маршрут билдәләре |
|Фрейм кодектары, крипто һәм GPU ярҙамсылары тоташтырығыҙ |Урындағы ғына |GPU ярҙамсыларына шулай уҡ CUDA һәләтле backend кәрәк. |

## Инсталляция {#install}

Пакеттың метамәғлүмәт исеме `iroha-python`. Ябайлаштырылған PyPI ҡуйыу тере Taira селтәренә тап килә тип уйламағыҙ. Интеграция маҡсаттарығыҙҙы бер үк өҫкө ағымынан төҙөлгән тәгәрмәс йәки сығанаҡ иҫкәртеүен ҡуйығыҙ:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Әгәр проект upstream эш киңлеген туранан-тура ҡулланһа, Python бәйлелектәрен урынлаштырығыҙ һәм `Instruction`, `TransactionDraft`, ҡултамғалау, крипто, SoraFS native ярҙамсылары, GPU ярҙамсылары йәки Connect frame codec-тары ҡулланылған миҫалдарҙы эшләтер алдынан native киңәйтеүҙе төҙөгөҙ. Upstream `python/iroha_python/README.md`-тағы build командаһын ҡулланығыҙ, һуңынан native экспорттарҙың йөкләнеүен тикшерегеҙ:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Әгәр `create_torii_client` импорты үтәлмәй, әммә `Instruction` йәки `generate_ed25519_keypair` уңышһыҙлыҡҡа осраһа, саф Python пакеты бар, ләкин урындағы оҙайтыу юҡ.

## Тиҙерәк старт {#quickstart}

Йәмәғәт, уҡырға ғына мөмкин булған Taira һуңғы нөктәләре менән башларға:

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

## Бергә урынлаштырыу {#shared-setup}

Мутацияланған шаблондар өсөн ошо көйләүҙе ҡулланығыҙ. тапшырыу алдынан һәр урынды Taira авторитеты, шәхси асҡысы, токен һәм актив / иҫәп-хисапҡа IDs алмаштырығыҙ.

`authority` - транзакцияға ҡул ҡуйған иҫәп һәм `private_key` уға тап килергә тейеш. Транзакциялар Taira-тың теүәл генезистарҙан алынған `NetworkId` менән бәйләнә; UUID сылбыры ғәмәлгә ашырыу этикеты булып тора, транзакция идентификацияһы түгел. Түләүҙәр түләү ниәте тип яҙылған һәм теүәл туранан-тура комиссия иҫәбе ҡуллана, заявканың метамәғлүмәтенә ҡарамаҫтан.

Төмәндәге һүҙмә-һүҙ - хәҙерге ҡуйылған Taira генез идентификацияһы. Тест селтәрен ҡабатлау уны үҙгәртә ала, шуға күрә уны ҡул ҡуйған ҡулланыу профиленән яңыртығыҙ һәм уны UUID сылбырҙан бер ҡасан да һығымта яһамағыҙ.

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

`Instruction.*` бары тик конструкция инструкцияһы файҙалы йөкләмәләрен саҡыра. `submit()` - был урында SDK туранан-тура түләү комиссия иҫәбе ала, теүәл цитацияланған файҙалы йөкләнешкә ҡул ҡуя, уны Torii адресына ебәрә һәм статус көтә.

## Һалымдар һәм газ {#fees-and-gas}

Write transaction-дар typed `FeePaymentIntent` һәм финансланған fee asset balance талап итә. Taira-ла public faucet testnet XOR-ҙы финансләй. Python SDK үҙгәрмәгән unsigned payload-ты теүәл fee quote алыу өсөн Torii-ға ебәрә, quote-тың payer йәки payload-ты алмаштырмағанын тикшерә һәм quoted intent-ҡа ҡул ҡуя. Fee һайлауҙы transaction metadata-һына һалмағыҙ.

Ҡоролтай `submit()` өҫтәмә ярҙамсы баштан уҡ хакимиәт тарафынан түләнгән ниәт менән башлана, уның түләү сиктәре атайлап буш тора. `quote_and_sign()` ҡул ҡуйғанға тиклем уларҙы тере комиссия иҫәбе тултырығыҙ:

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

Яҙыуҙар ебәрер алдынан, хакимиәт иҫәбенә түләү активтарының етерлек булыуын тикшерегеҙ. Төп faucet һәм актив ID селтәргә хас; был Taira формаһы:

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

faucet баланс тикшереүендә ҡулланыу өсөн конкрет `asset_id` ҡайтара. иҫәбенә туранан-тура комиссия иҫәбе түләүҙәр тикшерергә `FEE_ASSET_DEFINITION`; транзакция был активты һайлап алмай метамәғлүмәттәр аша.

Ҡулланма метамәғлүмәттәре ирекле һәм түләүле семантикаға эйә түгел:

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

Әгәр һеҙ түләү ниәтен онотһағыҙ, көтөлмәгән актив өсөн комиссия иҫәбе ҡабул итһәгеҙ, комиссия иҫәбе яһағандан һуң файҙалы йөкләмәне үҙгәртһәгеҙ йәки финансланмаған иҫәб менән ҡул ҡуйһағыҙ, транзакцияны тапшырырға ярамай.

## Аноним Taira уҡый {#anonymous-taira-reads}

Был саҡырыуҙарҙа Taira маршруттар ҡулланыла, уларҙың каталог сиктәре аноним рәүештә уҡыла:

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

`/v1/time/status` һәм һәр `/v1/sumeragi/*` operator snapshot, state үҙгәртмәһә лә, exact-network operator signature талап итә. Anonymous node status өсөн `request_json("GET", "/status")` ҡулланығыҙ; consensus йәки node-local clock diagnostics өсөн payload һәм operator setup түбәндә күрһәтелгән. Connect session status — айырым protocol route һәм session management token талап итә.

## Төҙөүселәргә күрһәтмәләр {#instruction-builders}

Ҡоролтай SDK иң киң таралған инструкция ғаиләләр өсөн типлаштырылған төҙөүселәр һәм JSON Беренсе класлы булмаған варианттар өсөн ҡотолоу люкаһы Python Төмәндәге өҙөктәр - мутациялы транзакция өлгөләрен һәм улар асыҡланмаған Taira Ҡул ҡуйыу өсөн иҫәп юҡ.

Типталы ярҙамсыларға өҫтөнлөк бирәләр: улар нормализациялана Python ҡиммәттәре һәм ғәмәлһеҙ формаларҙа иртәрәк уңышһыҙлыҡ. `Instruction.from_json` тик инструкция варианты кәрәк саҡта ғына Python ярҙамсыһы әле.

|Уҡытыу ғаиләһе |Python йөҙө |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|Регистрация | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` genesis/bootstrap инструменттары өсөн тәғәйенләнгән |
|Теркәлмәгеҙ |`unregister_trigger`; башҡа варианттар өсөн ҡулланыу `Instruction.from_json` |
|Минт/Борн |`mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
|Трансфер | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa`                                                              |
|Метамәғлүмәттәр һәм контроль |`set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
|RWA тормош циклы | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa`                                                                                                         |
|ExecuteTrigger |`execute_trigger` |
|Репо/расселле киңәйтеүҙәре |`repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|Протоколға индерелгән актив йоҙаҡтары |`open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, өҫтәүенә клиент ярҙамсылары `*_and_wait` |
|Grant/Revocate, SetParameter, Log, Custom, Upgrade, һәм ҡағиҙә булараҡ теркәлгән / теркәлмәгән варианттар |`Instruction.from_json` йәки `TransactionBuilder.add_instruction_json` каноник `InstructionBox` JSON |

Эскор формаһындағы шартлы түләүҙәр өсөн ҡарағыҙ [Башҡорт активтары эскоры](/ba/blockchain/escrow.md#python-asset-locks). Python әлеге ваҡытта дөйөм активтарҙы ябыу өсөн беренсе класлы ярҙамсыларҙы асыҡлай; баҙар һәм аноним эскор ярҙамсылары әлегә беренсе класлы Python алымдар түгел.

### Домендар булдырығыҙ, ә һуңынан иҫәптәр һәм активтар теркәгеҙ {#set-up-domains-then-register-accounts-and-assets}

Ғәҙәти домен булдырыу декларатив псевдонимы планер аша үтә, шуға күрә SNS ҡуртымға алыу, хужа мөмкинлектәрен, комиссия иҫәбе һаҡлау һәм домен торошо бергә тикшерелә. `AliasSetupPlanRequestV1` маҡсаты менән һеҙҙең SDK йәки инеү сервисы, һуңынан ҡулланыу `iroha app alias setup plan` һәм `iroha app alias setup apply`. Баҫмағыҙ `Instruction.register_domain` ҡулланыу транзакцияһынан; был төҙөүсе остается для генезис/bootstrap инструментов.

Домен булдырыу планы раҫланғандан һуң, доменға ҡараған объекттарҙы теркәгеҙ. Taira кеүек уртаҡ селтәрҙә һеҙгә тәғәйенләнгән домен һәм иҫәп-хисап исемдәр арауығын ҡулланығыҙ.

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

`mintable` ҡабул итә `Infinitely`, `Once`, `Not`, йәки `Limited(n)` Мәғлүмәт моделе ҡабул ителгән ҡиммәттәр. `scale` сикләнмәгән һанлы актив өсөн.

### Минтлау, яндырылған һәм күсерелгән мөлкәт {#mint-burn-and-transfer-assets}

Был саҡырыуҙар ғәмәлдә булған активты ҡуллана ID. Тәүҙә активтың билдәләмәһен теркәп, һуңынан конкрет активты төҙөй. ID актив хужаһы булған иҫәпкә.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Трансфер биләмәһе {#transfer-ownership}

Хужалыҡ күсереүҙәр үҙгәрә кем доменды контролдә тота, актив билдәләмәһе йәки NFT. ғәмәлдәге хужаны транзакция власы булараҡ ҡулланырға.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Метамәғлүмәттәрҙе йыйыу һәм алып ташлау {#set-and-remove-metadata}

JSON-сериализацияланған метамәғлүмәт ҡиммәттәренә эйә булырға тейеш. һеҙ `TransactionDraft` ҡулланғанда, `TransactionConfig`-ҙағы вәкәләтле иҫәп default маҡсатлы иҫәпкә әйләнә.

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

Юғары кимәлдәге проект ярҙамсыһы күләмһеҙ рәүештә транзакция власына йүнәлтелгән:

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

### Реаль донъя активтары {#real-world-assets}

RWA ярҙамсылары актив-специфик метамәғлүмәттәр, килеп сығыу һәм контроллер сәйәсәте өсөн JSON сериялаштырыла торған файҙалы йөкләмәләрҙе ҡуллана. `register_rwa` `id` йәки `owner` ҡабул итмәй: үтәү ваҡыты `RwaId` тыуҙыра, ә транзакция органы башланғыс хужа була.

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

Теркәлеү операцияһы commit үтәгәндән һуң, `FindRwas`, `/v1/rwas`, RWA ваҡиғаһын йәки генерацияланған ID табыу өсөн ҡуйылған эҙләүсе маршрутын ҡулланығыҙ:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Артабанғы операцияларҙа барлыҡҡа килгән `hash$domain` ID ҡулланыла:

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

Тулы күсереүҙәр ғәмәлдәге партияла `owned_by` үҙгәрә ала. Өҫтәмә күсеүҙәр һәм берләшеүҙәр һөҙөмтәһендә балаларҙың күплеге барлыҡҡа килә.

### Ҡатҡандар {#triggers}

Ҡулланырға trigger теркәү ярҙамсылары, әгәр башҡарыу ҡушымтаһы башҡа инструкция эҙмә-эҙлекле:

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

Torii шулай уҡ REST ярҙамсыларын ҡуҙғатҡыс инвентарь өсөн асыҡлай:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Стриггерҙар исемлеге саҡырыуҙары тик уҡырға йәки тикшереү өсөн генә. Теркәү, башҡарыу, ҡабатлау үҙгәртеүҙәре һәм теркәүҙән баш тартыу - мутациялы операциялар.

### Репо һәм иҫәп-хисап буйынса күрһәтмәләр {#repo-and-settlement-instructions}

Репо һәм ике яҡлы хәл итеү ярҙамсылары ҡул менән эшләнмәгән Norito файҙалы йөкләмәләрһеҙ доменға ярашлы инструкция варианттарын өҫтәй:

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

### JSON Ҡотҡарылыу капкаһы {#json-escape-hatch}

Әгәр Python ярҙамсы юҡ, аҙыҡ-түлек каноник мәғлүмәттәр моделе `InstructionBox` JSON үҙ эсенә `Instruction.from_json`. Был тәҡдим ителгән юл `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, пирлек/ роле/NFT теркәү, һәм триггер булмаған теркәлмәгән варианттар шул ярҙамсылары тип яҙылғанға тиклем.

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

Транзакция сигендә яҙылған проект юлын һаҡлағыҙ: ул `NetworkId`, түләү ниәте һәм ҡул ҡуйылғанға тиклем комиссия иҫәбе үҙгәрешһеҙлеген һаҡлай. туранан-тура `TransactionBuilder` ҡулланыу бер үк ҡиммәттәрҙе өҫтәп тере комиссия иҫәбе асыҡ раҫланыуын талап итә, шуға күрә был заявка коды өсөн ҡыҫҡа юл түгел.

Яратҡан йәки үтә күренмәле булмаған күрһәтмәләр өсөн JSON аша ҡайтыу һәм һынау мәғлүмәттәрен һаҡлау алдынан:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Транзакциялар эш ағымдары {#transaction-workflows}

`TransactionDraft` ҡул ҡуйыу алдынан бер нисә инструкция төҙөгән ҡушымталар өсөн ҡулланығыҙ. Проект һеҙгә транзакция кимәлендәге көйләүҙәрҙе, мәҫәлән `ttl_ms`, `nonce` һәм метамәғлүмәттәрҙе бер урында һаҡларға мөмкинлек бирә, һуңынан бер тапҡыр ҡул ҡуйығыҙ:

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

Тикшереү, аудит йәки аҡса янсығы тапшырыу өсөн детерминистик манифесты экспортлау:

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

Әгәр маҡсатлы юл кәрәк булһа, ҡултамға ҡуйыу алдынан линейканың конфиденциаллығын иҫбатлауҙы ҡуйып тороғоҙ:

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

## Һорауҙар {#queries}

JSON һүҙлектәре урынына типланған һорау ярҙамсылары мәғлүмәт кластары кире ҡайтара. Улар башлауҙың иң ябай ысулы, сөнки SDK страницаларҙы һәм дөйөм яҙма ҡырҙарын анализлай:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Torii endpoint-ы өсөн әле типланған wrapper булмаһа, дөйөм һорау ярҙамсыларын ҡулланығыҙ:

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

Бухгалтер иҫәбенә инвентарь ярҙамсылары өсөн иҫәп-хисап идентификаторы SDK нормализатор.Канникаль ҡулланығыҙ I105 иҫәбенә IDs йәки селтәрҙәге ҡушаматтар; әгәр блоктарҙы тикшереүсе йәки сыма һуңғы пункт кире ҡайтарыусы ID тип SDK кире ҡаҡһа, уны каноник иҫәпкә һалалар. ID Яҡшы ярҙамсыларҙы саҡырыр алдынан:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Ваҡиғалар {#events}

Streaming ярҙамсылары JSON payload-тарҙы default буйынса decode итә. SSE event name, id, retry hint һәм raw payload кәрәк булғанда `with_metadata=True` тапшырығыҙ. Canonical `/v1/events/sse` feed live-only: replay IDs сығармай һәм replay log һаҡламай, шуға ярҙамсылар cursor йәки resume argument бирмәй. Яңынан тоташыу яңы subscription башлай һәм gap булыуы мөмкин; тулы ledger history кәрәк булғанда, билдәле height-тан `/v1/blocks/stream` ҡулланығыҙ. Был миҫалдар live event-тарҙы көтә, шуға stream enabled һәм active булған node-та эшләтегеҙ.

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

## Ключтар һәм адрестар {#keys-and-addresses}

SDK һәр ҡултамға алгоритмы өсөн урындағы имзалау ярҙамсыларын аса. Был ярҙамсылар Taira-ға мөрәжәғәт итмәй, әммә уларға native киңәйтеү кәрәк:

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

`supported_crypto_algorithms()` ҡулланып, тәгәрмәсегеҙ нимәгә булышлыҡ итә икәнен күрерһегеҙ. Дөйөм ярҙамсылары каноник алгоритм этикеткаларын ҡуллана һәм Ed25519, secp256k1, ML-DSA, GOST, BLS һәм SM2 өсөн эшләй:

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

### Ҡытай SM Криптографияһы {#chinese-sm-cryptography}

Ҡоролтай Python SDK дөйөм икеһе лә асыҡлана SM2 ярҙамсылары һәм SM2-ҡайһы уңайлылыҡ ярҙамсылары. SM2 маҡсатлы селтәр көтөп алған айырымлау идентификаторы:

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

`crypto.sm.enabled` индексы үҙенең ағымдағы сәйәсәтендә SM-ауылы алгоритмдарын ҡабул итәме, юҡмы икәнен күрһәтә. Шул уҡ реклама SM хеш сәйәсәтен һәм тиҙләтеү статусын үҙ эсенә ала, был SM2-махсус ағымдарҙы булдырыуҙы хәл иткәндә файҙалы:

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

Authenticated capability payload-ты deployed node өсөн authoritative тип ҡабул итегеҙ. `crypto.sm.enabled` true булып, advertised signing policy уны рөхсәт иткәндә генә SM2-signed transaction ебәрегеҙ.

### GOST һәм "Кванттан һуңғы асҡыстар" {#gost-and-post-quantum-keys}

Дөйөм крипто ҡулланыу API өсөн GOST R 34.10-2012 параметрҙар йыйылмалары һәм ML-DSA (`ml-dsa`) пост-квант ҡултамғалары. шул уҡ асҡыс пар объекты ҡултамға, тикшереү һәм күп hash экспорты менән шөғөлләнә:

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

Gate GOST һәм пост-квантовый ағымдар узелдың аутентификацияланған, типланған мөмкинлектәре рекламаһында:

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

Әгәр төйөн һеҙгә кәрәк алгоритмды иғлан итмәһә, асҡысты local йәки offline workflow өсөн генә ҡулланығыҙ. Шул алгоритм менән ҡул ҡуйылған transaction-дарҙы был төйөнгә ебәрмәгеҙ. Public Taira тикшереүе ваҡытында GOST һәм ML-DSA upstream Python китапханаһында SDK crypto helper-ҙары булараҡ бар ине, әммә төйөн уларҙы transaction signing өсөн иғлан итмәне.

## Конфигурацияланған клиенттар булдырыу {#config-aware-client-creation}

Файлдан узел көйләмәләрен уҡығанда `resolve_torii_client_config` ҡулланһағыҙ, әммә барыбер мөхиткә йәки һынауға ҡарата өҫтөнлөклө талаптарға мохтаж:

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

## Кагемуша әҙерлеге {#kagemusha-readiness}

Python SDK үҙенең генераль Torii заявка ярҙамсыһы аша ағымдағы JSON әҙерлек маршрутын һорарға мөмкин:

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

Python типланған Кагемуша тулыландырыу йәки ҡайтарыу архив төҙөүселәрҙе фаш итмәй. Swift йәки JVM тип яҙылған аҡса янсығын ҡулланып, каноник V4 архивтарын төҙөйһөгөҙ, һуңынан уларҙы Kagemusha Torii клиент аша тапшырығыҙ һәм һорау алыу үткәргеҙ.

## Абонементтар {#subscriptions}

`iroha_python.ToriiClient` ҡулланған уртаҡ Torii клиенттан яҙылыу һәм проект төҙөүселәр мираҫ ала. Һәр мутация тәнгә бәйләнгән каноник иҫәп яҙмаһына ҡултамға менән ҡабул ителә һәм имзаланмаған транзакция проектын кире ҡайтара. Torii бер ҡасан да шәхси асҡыс ҡабул итмәй һәм проектты һеҙҙең өсөн ебәрмәй.

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

Һәр йөкләмәне һәм ҡул ҡуйыу тураһындағы хәбәрҙе тейешле иҫәптең урындағы аҡса янсығына тапшырыу, унда һоралған операцияны раҫлау, ҡул ҡуйылған транзакцияны йыйыу һәм уны ғәҙәти транзакция үткәргес аша ебәреү. Python SDK ҡултамғалау хәбәренең кире ҡайтарылған файҙалы йөклөктөң каноник хэшиғы булыуын раҫлай, әммә аҡса янсығы транзакцияны декодлау һәм ҡултамғалауға тиклем раҫлау өсөн яуаплы булып ҡала.

## Ҡатнашыу {#connect}

URIs-ны локаль рәүештә төҙөү һәм анализлау. Connect идентификаторы SID-ны теүәл `NetworkId`, ҡушымтаның асыҡ асҡысын һәм nonce менән бәйләй:

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

Тап шул күреүҙе маҡсатлы узел Connect-ты асыҡлағанда ғына теркәп ҡуйығыҙ. Сессион булдырыуҙа дүрт роль үҙенсәлекле йөрөтөүсе токен кире ҡайтарыла. Сессиялағы статус маршруты идара итеү токенын талап итә; дөйөм статус оператор маршруты булып тора.

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

Белем алыуҙан һуң хәбәрҙәрҙе хәлдең торошо менән шифрлау:

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

## Идара итеү, идара итеү ваҡыты һәм администраторҙар өҫкө йөҙө {#governance-runtime-and-admin-surfaces}

Вәкәләтле иҫәп уҡыуҙар иҫәбенә аутентификациялана. [Бергә урынлаштырыу](#shared-setup), һәр ярҙамсы саҡырыу бәйләргә Taira Дөрөҫөн генә әйткәндә , генездан алынған `NetworkId`:

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

Операторҙы уҡыу өсөн айырым клиент булдырығыҙ. Ойоштороу ваҡытында рөхсәт ителгән оператор асҡысын йөкләгеҙ һәм уны Taira ның теүәл `NetworkId` менән бәйләгеҙ; йөрөтөүсе билдәләр һәм `x-api-token` был ҡултамғаны алмаштырмай:

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

Эш ваҡытын яңыртыу маршруттары оператор менән раҫланған инструкция төҙөүселәре. Уңышлы тәҡдим, активлаштырыу йәки кире ҡайтарыу яуаптар `tx_instructions`; ул яңыртыуҙы ғәмәлгә индермәй. был пакетты ғәҙәти ҡул ҡуйылған транзакция һәм идара итеү юлы аша тапшырығыҙ. Python ысулдары `propose_runtime_upgrade`, `activate_runtime_upgrade`, һәм `cancel_runtime_upgrade` әлеге ваҡытта клиенттың ябай һорауҙар биреү урынына ҡулланыу `OperatorSigningContext`, Шулай итеп, был дәреслеге уларҙы эш операторы ағымы булараҡ тәҡдим итмәй.

## Статусы, консенсус һәм селтәр телеметрияһы {#status-consensus-and-network-telemetry}

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

## SoraFS, UAID һәм Kaigi ярҙамсылары {#sorafs-uaid-and-kaigi-helpers}

Был ярҙамсылар маҡсатлы узел тейешле Nexus/SORA endpoint-тарын асҡанда ҡулланыла. Буш исемлекте дөрөҫ яуап тип ҡабул итегеҙ: йәмәғәт Taira-ла маршрут әүҙем булырға мөмкин, ләкин өлгө manifest йәки UAID өсөн мәғлүмәт булмауы ихтимал.

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

## Norito RPC һәм GPU Ярҙамсылары {#norito-rpc-and-gpu-helpers}

`NoritoRpcClient` ҡулланығыҙ, әгәр һеҙҙә Norito байттар бар һәм бинар Torii һуңғы нөктәһен саҡырырға кәрәк. Миҫалға элекке транзакция өлгөһөнән ҡул ҡуйылған конверт талап ителә:

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

CUDA ярҙамсылары backend булмағанда `None` кире ҡайтарыр, шуға күрә ғаризалар скаляр тормошҡа ашырыуҙарға кире төшә:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Хәҙерге яҡтыртыу {#current-coverage}

Python SDK инде түбәндәге ярҙамсыларҙы үҙ эсенә ала:

- Torii тапшырыу, статус, һорау һәм идара итеүсе ағымдары
- дөйөм ISI һәм доменға ярашлы киңәйтеүҙәр өсөн типлаштырылған инструкция төҙөүселәре
- Транзакция проекттары, манифесттар, ҡултамғалау һәм ҡул ҡуйылған транзакция конверты эш ағымдары
- тура ваҡиғалар ағымдары һәм типлаштырылған фильтрҙар; commit ителгән блок ағымдары тулы тарихты бирә
- дөйөм Kagemusha әҙерлек инеү һәм Torii абонемент ярҙамсылары; типталған өҫтәмә һәм ҡайтарыу төҙөүселәр асыҡланмаған
- иҫәп адресы, бөтә алгоритм ҡултамғалау ярҙамсылары, күп һанлы шашкалар менән ҡайтыуҙар, SM2, GOST, ML-DSA, BLS һәм серле асҡыстар менән идара итеү.
- URIs, сессиялар, кадрҙар, шифрлау ярҙамсылары һәм реестр администраторы тоташтырыу
- node был мөмкинлектәрҙе тәҡдим иткәндә governance, runtime яңыртыу, Sumeragi, node administration, SoraFS, UAID һәм Kaigi endpoint-тарының программа wrapper-ҙары

## Үрге йүнәлештәге белешмәләр {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Был файлдар Python өҫкө йөҙө өсөн дөрөҫлөктө сығанағы булып тора тығыҙ эш урыны ревизияһы.
