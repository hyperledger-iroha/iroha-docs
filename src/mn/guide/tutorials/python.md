---
translation_locale: mn
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

Хөдөлмөрийн Python SDK эргэлтийн ажлын газарт `iroha-python`. Нэгдүгээрт Iroha 3
цахилгаан хэрэгслийн . Torii болон Norito гадаргуудыг. Пактын хувилбар
эсвэл эх сурвалжийн шинэчлэл нь SDK болон түймэр байнга
ижил төстэй цахилгаан хэлбэрийн шинэчлэл.

Доорх зөвхөн унших жишээ нь олон нийттэй харьцуулахад шалгагдсан Taira цагийн
`https://taira.sora.org`. Мутажлах жишээ нь транзакцийн загварууд: тэд
бодит Taira эрх мэдэл, хувийн түлхүүр, газын метабараа болон ямар ч оператор
зорилтот замаар илгээхээс өмнө шаарддаг токенүүд.

Жишээлбэл:

| Үргэлж | Олон нийтийн эсрэг тэмцэх Taira? | Та юу хэрэгтэй вэ? |
| --- | --- | --- |
| Зөвхөн уншигч үйлчлүүлэгчдийн дуудлага | Тийм ээ. | Python багц болон сүлжээний хүртээмж |
| Орон нутгийн гарын үсэг зурагч, зааварч | Хэвлэл мэдээллийн хэрэгсэл `submit()` | Үндэсний өргөтгөлийн болон таны гол материал |
| Мутажуулах гүйлгээ, үйлчилгээний дуудлага | Зөвхөн өөрийн санхүүжүүлсэн дансанд | Эрх баригчдын данс, хувийн ач холбогдол, сүлжээ ID, Төрийн төлбөрийн метадэтгэл, төлбөрийн хөрөнгийн үлдэгдэл, чиглэлийн токенүүд |
| Фрейм кодек, крипто болон GPU туслах | Зөвхөн орон нутгийн | Үндэсний өргөтгөл; GPU туслагчдад ч тусламж хэрэгтэй CUDA-Захиргааны чадвартай |

## Нэвтрүүлэг {#install}

Барилгын метабарааны нэр нь `iroha-python`. Үргэлжгүй гэж бүү сана. PyPI
монтаж нь шууд тохирох Taira сүлжээ. төмөр эсвэл эх үүсвэрийг шалгах
Таны интеграцийн зорилтуудыг мөн адил үрээр шинэчлэхээс бүтээн байгуулав:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Хэрэв таны төсөл нь өмнөд хэсгийг шууд хэрэглэдэг бол Python
үлгэр жишээ ашиглах өмнө үндсэн өргөтгөлийг бий болгох
`Instruction`, `TransactionDraft`, гарын үсэг зурах, крипто, SoraFS эх оронч туслах, GPU
туслах, эсвэл Connect frame codecs.
`python/iroha_python/README.md`, дараа нь эх орондоо экспортлох ачаалал:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Хэрэв `create_torii_client` импортоор `Instruction` эсвэл
`generate_ed25519_keypair` Үргэлждэг, цэвэр Python багцыг ашиглах боломжтой боловч
Үндэсний өргөтгөлийн хувьд тийм биш.

## Удахгүй эхлэх {#quickstart}

Бүх нийтийн, зөвхөн уншигчтайгаар эхэлнэ Taira төгсгөл:

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

## Хамтарсан зохион байгуулалт {#shared-setup}

Үргэлттэй загваруудад энэ тохируулгыг ашигла.
Taira эрх мэдэл, хувийн түлхүүр, токен, хөрөнгө/хууль IDs Таны нэвтрүүлэгээс
хүргүүлээс өмнө.

`authority` гүйлгээний гарын үсэг зурдаг данс юм. `private_key` нийцэх ёстой
тухайн сан, `CHAIN_ID` зорилтот сүлжээтэй нийцэх ёстой, `TX_METADATA` заавал
Хэвлэл мэдээллийн сүлжээний хүлээсэн төлбөрийн талбайг тусгасан байна.
санаачлан хүчингүй, тиймээс тэдгээр нь санамсаргүй байдлаар ирдэггүй.

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

`Instruction.*` Зөвхөн сургалтын хэрэглээний ачааллыг бүтээн байгуулахыг дууддаг. `submit()` Энэ бол
Энэ нь SDK гүйлгээг гарын үсэг зурж, Torii, "Хэрэг хүн"
байдал.

## Төлбөр, газ {#fees-and-gas}

Төсвийн санхүүжилт, төлбөрийн санхүүжилтийн тухай Taira,
төлбөрийн актив нь олон нийтийн цөмөрээс санхүүждэг бөгөөд гүйлгээний метадэтгэл нь
хамруулах `gas_asset_id`. Үүнд Minamoto, төлбөр нь бодит төгрөгөөр төлдөг XOR болон хөрөнгө
ID Энэ нь тухайн сүлжээний конфигурацыос үүдэлтэй.

Төлбөрийн метадэтгэг нь тухайн гүйлгээнд хамаарна, бие даан
`submit()` хамаас дээш ёсоор `TX_METADATA` бүтээн байгуулалтын бүртгэл:

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

Хэтгэлгээ илгээхийн өмнө захиргааны дансны хэмжээ хангалттай байгаа эсэхийг шалгаарай
Тохирсон гаралтай. ID . Taira
хэлбэр:

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

Бетон нь эргэн шилжүүлнэ. `asset_id` Бэлэнтийн хяналт шалгаруулалтад ашиглах.
`gas_asset_id` Metadata талбай нь төлбөрийн активын тодорхойлолтыг ашигладаг ID.

Хэрэглэлийн метадэтгэлийг төлбөрийн метадэтгээс тусгаарлах
гүйлгээ хийхэд:

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

Хэрэв та төлбөрийн метадетаг орхисон бол буруу төлбөрийн актив ашиглаж, эсвэл санхүүжилтгүй
тодотголтыг үгүйсгэхгүй байх ёстой
хэрэглээний ачаалал нь бусад тохиолдолд хүчинтэй байна.

## Taira-Тэгвэл зөвхөн уншигчдаа дуудлаа. {#taira-checked-read-only-calls}

Эдгээр дуудлага нь олон нийтэд амжилттай хариуцсан. Taira:

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

Тухайлбал: `/v1/status`, олон нийтийн харьцааны жагсаалт, Sumeragi RBC үлгэрийн шинжилгээ, түймэр
захиргааны хяналт тавилга, Connect апп бүртгэлийн удирдлага нь олон нийтэд илрээгүй
. Taira шалгалтын үеэр ашиглах `request_json("GET", "/status")` .
олон нийтийн сүлжээний байдлын ашигтай ачаалал Taira.

## Барилгын сургалт {#instruction-builders}

Хөдөлмөрийн SDK хамгийн түгээмэл сургалтын гэр бүлүүдэд зориулсан типт бүтээн байгуулагчдыг илрүүлнэ
JSON Анхны түвшинд биш төрөл бүрийн ангиллын шилжих хаалгаа Python Үүнээс өмнө ч.
Дараах хэсгүүд нь мөчлөгтэй гүйлгээний загварууд бөгөөд
олон нийтэд хүргүүлсэн Taira Бүртгэл бүртгэггүй.

Үүнээс гадна, тэдгээр нь хэвийн байдлыг хангаж байна Python үнэ цэнэ, алдаа
Үргэлтгүй хэлбэртэй эрт. `Instruction.from_json` Зөвхөн танд хэрэгтэй үед
заалын хэлбэртэй Python Хөдөлмөрийн туслагч.

| Сургалтын гэр бүл | Python гадаргуу |
| --- | --- |
| Бүртгэл | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` Genesis/bootstrap хэрэгслийн зориулалттай |
| Бүртгэлгүй байх | `unregister_trigger`; хэрэглээ `Instruction.from_json` бусад хэлбэрт |
| Төгс/төгс | `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
| Хөдөлмөрийн шилжилт | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
| Metadata болон хяналтын | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
| RWA Амьдралын мөчлөл | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
| ExecuteTrigger | `execute_trigger` |
| Хөдөлмөрийн орлого/сэлбэрлэгийн өргөтгөл | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
| Тухайн хөрөнгийн замбарууд | `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, болон үйлчлүүлэгч `*_and_wait` туслах |
| Грант/Арванжуулал, SetParameter, Тогтоолын, Хувьсгалт, шинэчлэлтийн болон анхан шатны бүртгэлийн/ашиглалтын төрөлүүд | `Instruction.from_json` эсвэл `TransactionBuilder.add_instruction_json` Canonical-тай `InstructionBox` JSON |

Хөдөлмөрийн санхүүжилтийн нөхцөлтэй төлбөр тооцоо
[Үндэсний хөрөнгийн хяналт](/mn/blockchain/escrow.md#python-asset-locks). Python
одоогийн байдлаар нэгдүгээр ангиллын туслагчдыг нийтлэг хөрөнгийн замбараагүй, зах зээлийн болон
Аноним ёсны захиалгач нар нэгдүгээрт биш Python Үүнээс өмнө ч.

### Домен байгуулах, дараа нь данс, хөрөнгө бүртгэх {#set-up-domains-then-register-accounts-and-assets}

Байнгын доменийг бий болгох нь декларатив псевдонимын төлөвлөхөөр явагддаг SNS
Хөрөнгө оруулалтын гэрээ, эзэмшигчдийн чадвар, дуудлага хамгаалагч, доменийн байдал хамтарч шалгагдана.
нууцгүй дэлгэцийг бүтээх `AliasSetupPlanRequestV1` Таны зорилго SDK эсвэл
бортын үйлчилгээ, дараа нь ашиглах `iroha app alias setup plan` болон
`iroha app alias setup apply`. Үүнд хүрэхгүй байх `Instruction.register_domain`
Хэрэглээний гүйлгээ; энэ бүтээн байгуулагч нь Genesis/bootstrap-д үлдсэн
хэрэгсэл.

Доменийн тохируулалтын төлөвлөгөө батлагдсанаас хойш доменийн өмчит объектыг бүртгүүлэх.
. Taira, танд зориулсан домен, дансны нэр орон зай ашиглах.

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

`mintable` хүлээн зөвшөөрдөг `Infinitely`, `Once`, `Not`, эсвэл `Limited(n)` хүлээн зөвшөөрөгдсөн үнэ цэнэ
Мэдээллийн загварын дагуу `scale` хязгаарлагддаггүй тооны активын хувьд.

### Хөдөлмөр, тэжээлийн болон хөрөнгийн нөөц {#mint-burn-and-transfer-assets}

Эдгээр дуудлага нь одоогийн хөрөнгө ашигладаг ID. Эхлээд хөрөнгийн тодорхойлолтыг бүртгүүлэх, дараа нь
конкретын хөрөнгө барьж ID хөрөнгийг эзэмшиж буй дансны хувьд.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Хөдөлмөрийн өмчлөл {#transfer-ownership}

Хууль эзэмшлийн шилжүүлэн суурьлан домен, хөрөнгийн тодорхойлолтыг хяналт тавих хүн өөрчлөгдөж байна NFT.
Одоогийн эзэмшигч нь гүйлгээний эрх баригч.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Metadata-г байлгаж, арилгах {#set-and-remove-metadata}

Metadata-ийн үнэ цэнэ нь: JSON- сериалж болно. `TransactionDraft`, УИХ-ын гишүүн
эрх мэдэл `TransactionConfig` Үндсэн зорилтот дансанд ордог.

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

Дээд түвшний туслах төсөл нь гүйлгээ эрх баригч байгууллагаг урьдчилан сэргийлэх зорилгоор:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### Байгаль орчин {#real-world-assets}

RWA туслах нар ашигладаг JSON- хөрөнгийн тухайн метадэтгэлийг цувралтай болгох ашиг тустай ачааллууд,
гаралтай, хяналтын ажилтны бодлого. `register_rwa` Үндсэн хуулийн `id` эсвэл
`owner`: цахилгаан замын хөдөлгөөн нь `RwaId`, болон гүйлгээний эрх баригч
анхны эзэмшигч болно.

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

бүртгэлийн гүйлгээний үүрэг гүйцэтгээс хойш ашиглах `FindRwas`, `/v1/rwas`, нэг RWA
үйл явдлыг, эсвэл хайгуулын чиглэл нь үүссэн ID:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Дараагийн үйл ажиллагаанууд үүссэн `hash$domain` ID:

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

Бүх хөрөнгийн шилжилт өөрчлөгдөх боломжтой `owned_by` Одоогийн хувилбар дээр хэсэгчлэн шилжүүлэн суулгах,
Нэгдэж, үр хүүхдийн олон төрөл бий болгодог.

### Тэггизүүд {#triggers}

Хөдөлмөрийг гүйцэтгэх нь өөр заавар байх үед гарааны бүртгэлийн туслалцааг ашигла
дараалал:

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

Torii бас илрүүлнэ REST Тэгжигч жагсаалтын туслах:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Триггер-ийн жагсаалтын дуудлага зөвхөн уншиж, бүртгэлээ шалгана.
гүйцэтгэх, давхаргын өөрчлөлт, бүртгэлгүй байх нь мөтийн үйл ажиллагаа юм.

### Хөдөлмөр төлөх, шийдвэрлэх журам {#repo-and-settlement-instructions}

Репо болон хоёр талын нэвтрүүлэгт туслах ажилчид доменийн талаарх сургалтыг нэмнэ
гар угаагүй хувилбарууд Norito хэрэглэгдэх ачаалл:

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

### JSON Угаах хаалга {#json-escape-hatch}

Хэрэв Python туслагч нь одоохондоо ашиглаж чадахгүй, санхүүгийн мэдээллийн загварыг хангах
`InstructionBox` JSON Хөдөлмөр `Instruction.from_json` эсвэл шууд
`TransactionBuilder.add_instruction_json`. Энэ бол зөвлөсөн замаар
`Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, өрсөлдөгч/ үүрэг/NFT
бүртгэл, үйл ажиллагааг эхлүүлэх бус бүртгэлгүй өөрчлөлүүд
Хөгжүүлжээ.

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

Урьдчилсан эсвэл ил тод даалгаврын хувьд эргэн тойронд JSON хадгалах өмнө
тоног төхөөрөмж

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Транзакцын ажлын урсгал {#transaction-workflows}

Хэрэглээ `TransactionDraft` өмнө нь олон тооны заалыг бүтээсэн хэрэгслийн хувьд
Хөдөлмөрийн түвшинд тохируулалтыг хадгалах боломжтой `ttl_ms`,
`nonce`, нэг газар, дараа нь нэг удаа гарын үсэг зур:

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

Хяналт шалгалт, хяналт-шинжилгээ хийх эсвэл хөрөнгийн гарцааг өгөх тодорхойлолт баримтыг экспортлох:

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

Зохиоллын замын нууцлалыг баталгаажуулах баримтыг мөрдөхээс өмнө хавсралтын замын шаардлага хангасан тохиолдолд:

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

## Судалгаа {#queries}

Тавигдсан хайлтын туслах нь түүхий эдийн оронд өгөгдлийн ангиудыг буцааж өгдөг JSON Үндсэн хуульд заасан
Энэ нь хамгийн хялбар арга юм SDK талбар хуудас болон нийтлэг
та бүхэнд бүртгэх талбай:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Үргэлт хийхэд нийтлэг хүсэлт туслалцааг ашиглах Torii эцсийн цэг нь одоог хүртэл бичигдсэн
хувцас:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

Санхүүжилтийн сангийн туслах ажилтнууд SDK Энэ бол
Нормализатор. I105 данс IDs эсвэл зах зээлийн нууц нэр; блок бол
хайгуулагч эсвэл түүхий элдэв төгсгөлийн ID Энэ нь SDK Хөдөлмөрийг үгүйсгүүлж,
Каноникийн тэмдэглэл ID Та эдгээр туслагчдыг дуудахаасаа өмнө:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Үргэлж {#events}

Хэвлэлийн дамжуулагчдын код JSON Үндсэн хуулийн дагуу хэрэглэгдэх ачаа. `with_metadata=True`
Хэрэв та SSE үйл явдлын нэр, тавилга, дахин туршиж үзнэ үү
хамтран `EventCursor` Хамгийн сүүлийн үеийн үйл явдлын тодруулгыг хэвээр үлдээх
үйл явдлын урсгал нь
хүчинтэй, идэвхтэй.

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

## Нүүр, хаяг {#keys-and-addresses}

Хөдөлмөрийн SDK бүртгэгдсэн гарын үсэг зурах алгоритмээр орон нутгийн гарын үсгийн туслагчдыг илрүүлнэ
Энэ ёсны туслагчид Taira, Гэхдээ тэд шаарддаг
эх оронч өргөтгөлийг:

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

Хэрэглээ `supported_crypto_algorithms()` Таны эрдэм шинжилгээний төвийг тэтгэвэрт гаргахыг хүснэ үү?
нийтлэг туслах нь канонгийн алгоритмээр тэмдэглэж, Ed25519-д ажилладаг.
secp256k1, ML-DSA, GOST, BLS, болон SM2 тухайн алгоритмыг:

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

### Хятад SM Шифрлэлт {#chinese-sm-cryptography}

Хөдөлмөрийн Python SDK аль алинд нь нийтлэг SM2 туслах, SM2-Хүнз бүрийн тохиромжтой
туслагч. Хөгдөлмөрийг сонгохын тулд түймрийн чадварны зарланг ашигла SM2 ялгаатай
зорилтот сүлжээний хүлээсэн тодорхойлогч:

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

`crypto.sm.enabled` цэг нь хүлээн зөвшөөрөж эсэхийг харуулна SM- гэр бүлийн алгоритмүүд
Үүнтэй адил зарлан SM хашийн бодлого, хурдац
Энэ нь үйл ажиллагаа явуулах эсэхийг шийдвэрлэхэд хэрэглэгдэх SM2- тодорхой урсгал:

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

Олон нийт Taira Хөдөлмөрийн SM шалгалтын үеэр боломжийн зарлан, гэхдээ SM гарын үсэг зурах
Түүний зарласан гарын үсэг зурах алгоритм нь `ed25519`,
`secp256k1`, болон `bls_normal`, Тиймээс та нар SM2-улъяасан гүйлгээ
ашиглалтанд орсон нь боломжийн ашиг ачааллын өөрчлөлтөөс бусад тохиолдолд.

### GOST болон Квантомын дараах товчоо {#gost-and-post-quantum-keys}

Үндсэн крипто ашиглах API . GOST R 34.10-2012 параметрний багц, ML-DSA
(`ml-dsa`) квантын дараах гарын үсэг.
хяналт шалгалт, олон хоолой экспортын:

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

Газар GOST болон квантын дараагийн урсгал нь түймрийн зарласан гарын үсэг зурах алгоритмид байдаг.
Цаашид тохиромжтой алгоритмүүдийн нэрлэгийн хувьд хомс хүчин чадлын ашиг ачааллыг ашиглах:

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

Хэрэв түймэр нь танд хэрэгтэй алгоритмыг зарцуулахгүй бол цөмөө зөвхөн орон нутгийн
Энэ алгоритмээр гарын үсэг зурсан гүйлгээг
Олон нийтэд Taira шалгалт, GOST болон ML-DSA ашиглаж байсан SDK
Криптовалютагийн туслагчид Python номын сан,
гүйлгээний гарын үсэг зурах цэг.

## Конфигурацын мэдлэгтэй үйлчлүүлэгч үүсгэх {#config-aware-client-creation}

Хэрэглээ `resolve_torii_client_config` хэрэгслийн хувьд сүлжээнд тохируулалтыг уншдаг
файл дээрээс, гэхдээ байгаль орчин эсвэл туршилтын онцгой зайлшгүй шаардлагатай байна:

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

## Кагемушагийн бэлтгэл {#kagemusha-readiness}

Хөдөлмөрийн Python SDK одоогийн талаар асууж болно JSON бэлэн байдлын чиглэл нь түүний нийтлэг
Torii хүсэлтэд туслах:

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

Python Кагемуша-ын нэмэлт, нөхөн сэргээлт болон төлбөр тооцооны архив бүтээгчүүдийг илрүүлэхгүй.
Хүрэлсүх Swift эсвэл JVM Каноникийн бүтээн байгуулалтын мөнгөн тэмдэг V4 архив, дараа нь
Тэднийг дэмжсэн Kagemusha-ийн тусламжтайгаар санал асуулга явуулж, Torii Хэрэглэгч.

## Ашиглал {#subscriptions}

Хөдөлмөрийн захиалгын туслах нь хуваалцагдсан зөөврийн дуудлагаас өвчилж буй үйлчилгээний дуудлагыг өөрчлөх Torii
хэрэглэгчийн `iroha_python.ToriiClient`. Хэрэглээ IDs .
Таны зорилтот сүлжээ.

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

## Харилцаа холбоо {#connect}

Нөхөрлөх, шинжилгээ хийх Connect URIs, олон нийтийн Connect статусыг уншина уу
Taira:

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

Фрейм кодек, сессийн түлхүүрний дэргэдэх, сессийг бий болгох нь эх оронч
өргөтгөлт болон Connect-ийн ээлжит замыг ашиглах боломжтой:

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

Үндсэн хэсгээр хүлээн зөвшөөрөгдсөн дараах мэдээллийг шифрлэх:

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

## Захиргааны засаглал, зардах цаг, удирдлагын газар {#governance-runtime-and-admin-surfaces}

Эдгээр уншилт зөвхөн дуудлага нь олон нийтэд эсрэг амжилттай эргүүлэн ирсэн Taira:

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

Хөдөлмөрийн цаг хугацааны шинэчлэлийн туслах нь ажиллуулах цаг үеийн шинэчлэлийг ашиглаж байгаа манифст хэлбэрийг хүлээн зөвшөөрдөг
API. Эдгээр нь оператор үйл ажиллагаа юм, тиймээс тэдгээрийг зөвхөн
данс болон токент:

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

## Орчин байдал, санал нэгдмэл болон сүлжээний телеметри {#status-consensus-and-network-telemetry}

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

## SoraFS, UAID, болон Kaigi Хөдөлмөрийн туслагчид {#sorafs-uaid-and-kaigi-helpers}

Эдгээр туслах нь зорилтын түймэртэй холбоотой
Nexus/SORA төгсгөлийн цэг. Бус жагсаалтыг хүчинтэй хариу гэж үзээрэй: олон нийт Taira зургаа
үзэл баримтын жагсаалтын мэдээлэлгүйгээр замыг ашиглах боломжтой; эсвэл UAID.

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

## Norito RPC болон GPU Хөдөлмөрийн туслагчид {#norito-rpc-and-gpu-helpers}

Хэрэглээ `NoritoRpcClient` та аль хэдийн Norito байт болон дуудлага хэрэгтэй
дундаж Torii Энэ жишээ нь өмнөх
гүйлгээний загвар:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

CUDA туслагчид буцаж ирнэ `None` түүнээс гадна, хэрэглэгчид
scalar хэрэгжилтэд шилжүүлэх боломжтой:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Одоогийн хамрааллалт {#current-coverage}

Хөдөлмөрийн Python SDK аль хэдийн:

- Torii өргөн мэдүүлэг, байдал, хайлт, захиргааны урсгал
- нийтлэг зориулалттай дүрэмт заавар бүтээгч ISI болон доменийн тусгай өргөтгөлүүд
- гүйлгээний төсөл, манфист, гарын үсэг зурсан болон гарын үсгийн гүйлгээ
  ажлын урсгал
- дамжуулалт үйл явдлууд, филтрүүд, цаашид сэргээгдэх курсор
- нийтлэг Kagemusha бэлэн байдлын хангамж, Torii бүртгэлийн туслагч; түрүүлсэн
  Нөхөнтөгч, төлбөрөө төлөх ажилчид нь халдваргүй байна
- Эдгээрийн хаяг, бүх алгоритмээр гарын үсэг зурагчдад туслах, олон хашийн эргэн тойронд аялал, SM2,
  GOST, ML-DSA, BLS, болон нууц товчоо ашиглах
- Харилцаа холбоо URIs, чуулганы үеэр, төхөөрөмжүүд, шифрлэх туслах болон бүртгэлийн захирал
- удирдлага, зардах цаг шинэчлэл, Sumeragi, түймэр-админ, SoraFS, UAID, болон Kaigi
  Хөгжлийн нүктейг хамарсан, цэг нь эдгээр шинж чанаруудыг илрүүлэх

## Өмнөд чиглэлийн сүлжээ {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Эдгээр баримт бичгүүд нь Python гэгээлэгдсэн давхар
Ажлын байрны шинэчлэл.
