---
translation_locale: mn
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

Өмнөговь ажлын орон зай дахь Python SDK нь `iroha-python`. Эхний Iroha 3 нэвтрүүлэг нь өнөөгийн Torii болон Norito гадаргуудыг зорилт болгодог. Таны интеграцийн ашигласан багцын хувилбар эсвэл эх үүсвэрийн шинэчлэлийг шилжүүлж, SDK болон түймэр ижил төстэй жижиг хэлбэртэй шинэчлэл дээр байх болно.

Доорх зөвхөн унших жишээ нь Taira олон нийттэй `https://taira.sora.org` харьцуулахад шалгагдсан. Мутажлах жишээ бол гүйлгээний загварууд юм: тэдгээрийг өргөн мэдүүлэхээс өмнө жинхэнэ Taira эрх мэдэл, хувийн ач холбогдол, газрын метабараа болон зорилтот замаар шаардагдах оператор токенүүдийг шаарддаг байна.

Энэ жагсаалтыг дараах байдлаар ашигла:

|Сэдж .|Олон нийтийн Taira эсрэг гүйх? |Та юу хэрэгтэй вэ?|
| --- | --- | --- |
|Зөвхөн унших үйлчлүүлэгчдийн дуудлага |Тийм ээ .|Python багц ба сүлжээний хүртээмжтэй |
|Орон нутгийн гарын үсэг зурагч, зааварч . |`submit()` хүртэл сүлжээний дуудлага байхгүй.|Үндэсний өргөтгөлийн болон таны гол материалын |
|Арилжаа , үйлчилгээний дуудлагаг өөрчлөх|Зөвхөн өөрийн хөрөнгө оруулалттай дансанд .|Төрийн захиргааны бүртгэл, хувийн түлхүүр, ID сүлжээ, төлбөрийн метадэтгэлэг, төлбөрийг хадгалах хөрөнгийн үлдэгдэл, замын токенүүд |
|Фрейм кодек, крипто болон GPU туслалцааг холбох |Зөвхөн орон нутгийн .|Үндэсний өргөтгөлийг; GPU туслагчдад мөн CUDA-ийн чадвартай хяналтын сүлжээ хэрэгтэй |

## Нэвтрүүлэг {#install}

Тус багцын метадангийн нэр `iroha-python`. Үргэлжгүй гэж бүү сана. PyPI монтаж нь шууд тохиромжтой Taira Сүлжээ. Таны интеграцийн зорилтуудыг нэгтгэсэн ижил дооргийн шинэчлэлээс үүссэн төвийг эсвэл эх үүсвэрийн шалгалтыг байгуулж:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Хэрэв таны төсөл нь өмнөд хэсгийн ажлын орон зайг шууд хэрэглэж байгаа бол Python -ийн хамаарлыг татаж, `Instruction`, `TransactionDraft`, гарын үсэг зурах, крипто, SoraFS -ийн үндсэн туслах, GPU -ийн туслагч эсвэл Connect-ийн рамкийн кодэк ашигладаг жишээг үйлдэхээс өмнө үндсэн өргөтгөлийг бариарай. `python/iroha_python/README.md` тоног төхөөрөмжийг ашиглаж, дараа нь гаралтай экспортын ачаалалтай болохыг шалгаарай:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Хэрэв `create_torii_client` импортын `Instruction` эсвэл `generate_ed25519_keypair` үр дүнгүй бол цэвэр Python багцыг ашиглаж болно, гэхдээ үндэсний өргөтгөл нь байхгүй.

## Удахгүй эхлэх {#quickstart}

Олон нийтийн, зөвхөн уншигч Taira төгсгөлийн цэгүүдээс эхэлнэ:

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

Үргэлттэй загваруудад энэ тохируулгыг ашигла. Та нэвтрүүлэхээс өмнө байр эзэмшигч бүрийн оронд Taira эрх мэдэл, хувийн түлхүүр, токен, хөрөнгө/хууль IDs оруулна уу.

`authority` бол гүйлгээний гарын үсэг зурагч данс юм. `private_key` нь тухайн дансанд нийцэх ёстой, `CHAIN_ID` нь зорилтот сүлжээтэй нийцэх хэрэгтэй бөгөөд `TX_METADATA` нь сүлжээ хүлээсэн төлбөрийн талбайг багтаасан байх ёстой. Доорх байр эзэмшигчид санаатайгаар хүчингүй байдаг тул тэдгээр нь санамсаргүй байдлаар өргөн мэдүүлээгүй байна.

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

`Instruction.*` нь зөвхөн бүтээн байгуулалтын сургалтын ашигтай ачааллыг дууддаг. `submit()` бол SDK нь гүйлгээг гарын үсэг зурж, Torii руу илгээж, статусын хүлээлт хийх цэг юм.

## Төлбөр, газ {#fees-and-gas}

Taira дээр төлбөрийн хөрөнгийг олон нийтийн кран санхүүжүүлдэг бөгөөд гүйлгээний метадэтгэл нь `gas_asset_id` -ийг багтаасан байх ёстой. Minamoto-д төлбөрийг бодит XOR -ээр төлдөг бөгөөд ID -ийн хөрөнгө нь тухайн сүлжээний конфигурацыоноос үүдэлтэй.

Төрийн төлбөрийн метабараа нь тухайн гүйлгээнд хамаарна, хувь хүний даалгавар дээр биш. Дээрх `submit()` туслах `TX_METADATA`-ийг бүтээн байгуулалт хийх бүрт:

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

Хөдөлмөрийг илгээхийн өмнө эрх баригчдын дансанд төлбөрийн хөрөнгө хангалттай байгаа эсэхийг шалгаарай. Тухайн кран, актив ID нь сүлжээний хувьд тодорхой бөгөөд энэ бол Taira хэлбэр:

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

Бетон `asset_id` нь тэнцвэр хяналт шалгаруулалтаар ашиглахын тулд эргүүлнэ. `gas_asset_id` метрийн өгөгдлийн талбай нь төлбөрийн хөрөнгийн тодорхойлолтыг ID ашигладаг.

Хэрэглэлийн метабараа төлбөрийн метабараасаа тусгаарлан хадгалж, гүйлгээний бүтэц хийхдээ газрын тосыг нэгтгэж байна:

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

Хэрэв та төлбөрийн метадэтгэлийг орхиж, буруу төлбөрийн актив ашигласан бол эсвэл санхүүжилтгүй дансанд гарын үсэг зурсан бол бодит сүлжээ нь тушаалын ашигтай ачаалал өөрөөр хэлбэл хүчин төгөлдөр байсан ч гүйлгээг татгалзах ёстой.

## Taira-Тэглэгдсэн зөвхөн унших дуудлага {#taira-checked-read-only-calls}

Эдгээр дуудлага нь Taira олон нийтэд амжилттай хүргэж байна:

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

`/v1/status`, олон нийтийн харьцааны жагсаалт, Sumeragi RBC үлгэрийн шинжилгээ, түйүлгийн удирдахчийн хяналт тавих зураг, Connect апп-ын бүртгэлийн захиргаа зэрэг чиглэлүүд шалгалтын үеэр Taira дээр олон нийтэд нээлттэй байгаагүй. `request_json("GET", "/status")`-ийг Taira-ийн олон нийтийг хамарсан түйүлний байдлын үр ашигтай ачаалалд ашиглаж байна.

## Барилгын сургалт {#instruction-builders}

SDK нь хамгийн түгээмэл сургалтын гэр бүлд зориулсан хэвлэлийн бүтээн байгуулагчдыг илрүүлж, нэгдүгээр зэрэглэлийн Python арга барилыг төсөөлөхгүй байгаа вариантуудад JSON -ийн аврах хаалгыг нэвтрүүлнэ. Дараах хэсгүүд нь өөрчлөлт орсон транзакцын загварууд бөгөөд гарын үсэг зурсан бүртгэлгүйгээр олон нийтэд Taira хүргүүлээгүй байна.

Python-ийн үнэ цэнэүүдийг хэвийн болгож, хүчингүй хэлбэр дээр эрт алдаа гаргадаг. `Instruction.from_json` -ийг зөвхөн Python -ийн туслалцаагүй суурьчилгааны хувилбар хэрэгтэй үед ашиглах.

|Сургалтын гэр бүл |Python гадаргын .|
| --- | --- |
|Бүртгэл| `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` Genesis/bootstrap хэрэгслийн зориулалттай |
|Тодрууллаагүй болгох|`unregister_trigger`; бусад хувилбарын хувьд `Instruction.from_json` ашиглах |
|Мунт/Бурна |`mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions`|
|Хөдөлмөрийн шилжилт| `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|Metadata болон хяналтын | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
|RWA амьдралын эргэлт | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
|ExecuteTrigger |`execute_trigger` |
|Хөдөлмөр / орлогын өргөтгөлтийн .| `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|Үндэсний хөрөнгийн гулгал .|`open_asset_lock`, `drawdown_asset_lock`,`cancel_asset_lock`, `expire_asset_lock` болон үйлчлүүлэгчдийн `*_and_wait` туслах ажилтнууд |
|Грант/Сэргэлт, SetParameter, Логонг, Хувьсгал, шинэчлэл болон бага түгээмэл бүртгэлийн / бүртгүүлэхээс татгалзсан хувилбар |`Instruction.from_json` эсвэл `TransactionBuilder.add_instruction_json` нь Canonical `InstructionBox` JSON тэй|

Хөдөлмөрийн санхүүжилтийн хэлбэрээр нөхөн төлбөр тооцоо хийх тухай [Тухайн хөрөнгийн хяналт тавих](/mn/blockchain/escrow.md#python-asset-locks). Python одоогийн байдлаар нэгдүгээр зэргийн туслалцаа эзэмшигчдийг нийтлэг хөрөнгийн буудалд илрүүлж байна; зах зээл болон үл мэдэгдэх хадгаламжийн туслах нь нэгдүгээр зэрэг биш Python Урьдчилгааны арга хэмжээг дуусгах.

### Домен байгуулах, дараа нь данс, хөрөнгө бүртгэх {#set-up-domains-then-register-accounts-and-assets}

Байнгын доменийг бий болгох нь SNS лизингийн гэрээ, эзэмшигчдийн чадвар, дуудлага хамгаалагч, доменийн байдлын зэрэгцээ шалгагдана. Таны SDK эсвэл борлуулалтын үйлчилгээгээр нууцгүй `AliasSetupPlanRequestV1` зориулалтыг бий болгож, дараа нь `iroha app alias setup plan` болон `iroha app alias setup apply` ашиглаж болно. Хэрэглээний гүйлгээээс `Instruction.register_domain`-г өргөн мэдүүлэхгүй; энэ бүтээн байгуулагч нь Genesis/bootstrap хэрэгслийн хувьд үлдсэн байна.

Домен байгуулалтын төлөвлөгөө батлагдсанаас хойш доменийн өмчит объектүүдийг бүртгэнэ. Taira гэх мэт хуваалцсан сүлжээнд танд зориулсан домен, дансны нэр орон зай ашиглаарай.

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

`mintable` хүлээн зөвшөөрдөг `Infinitely`, `Once`, `Not`, эсвэл `Limited(n)` Мэдээллийн загварын дагуу хүлээн зөвшөөрөгдсөн үнэ цэнэ. `scale` хязгаарлагддаггүй тооны активын хувьд.

### Хөдөлмөр, тэжээлийн болон хөрөнгийн нөөц {#mint-burn-and-transfer-assets}

Эдгээр дуудлага нь одоогийн хөрөнгө ID ашигладаг. Эхлээд хөрөнгийн тодорхойлолтыг бүртгүүлж, дараа нь тухайн хөрөнгийг эзэмшиж буй дансны хувьд конкрет актив ID бий болгоно.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Хөдөлмөрийн эзэмшилт {#transfer-ownership}

Хууль эзэмшлийн шилжилт домен, хөрөнгийн тодорхойлолт, эсвэл NFT -ийг хяналт тавих хэн өөрчлөгдөж байна.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Мета өгөгдлийг байлгаж, арилгах {#set-and-remove-metadata}

Metadata үнэ цэнэ нь JSON-ийн цувралтай байх ёстой. Та `TransactionDraft` -ийг ашиглахад, `TransactionConfig` дахь эрх мэдэл бол урьдчилан сэргийлэх зорилтын данс болно.

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

Дээд түвшний туслах төсөл нь гүйлгээ эрх баригч байгууллагыг урьдчилан сэргийлэхэд чиглэсэн:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### Байгаль орчин үеийн хөрөнгө {#real-world-assets}

RWA туслах нь хөрөнгийн тухайн метадэтгэл, эх үүсвэр, хяналтын байгууллагын бодлогын хувьд JSON-ийн сериалж болох ашиг ачааллыг ашигладаг. `register_rwa` нь `id` эсвэл `owner` -ийг хүлээн зөвшөөрдөггүй: гүйлгээний цаг хугацаа нь `RwaId`-ийг бий болгодог бөгөөд бүтээн байгуулалтын эрх баригч анхны эзэмшигч болно.

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

бүртгэлийн бүтээн байгуулалтын дараа `FindRwas`, `/v1/rwas`, RWA үйл явдлыг эсвэл үүссэн ID-ийг илрүүлэхэд тохируулсан хайгуулын замыг ашигла:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Дараах үйл ажиллагаанд үүссэн `hash$domain` ID:

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

Тус бүрэн шилжүүлэн суулгах нь `owned_by` -ийг одоогийн жилд өөрчилж болно. Чамаал шилжүүлэлт болон нэгдмэлүүд үр хүүхдийн жилдээ үүсгэдэг.

### Хөгжүүлэгчид {#triggers}

Хөдөлмөрийн хэрэгслийг гүйцэтгэх нь өөр захиалгын дараалал байх үед түлхэгийн бүртгэлийн туслагчдыг ашигла:

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

Torii нь мөн REST хяналтын тоног төхөөрөмжүүдийг түлшний жагсаалтад гаргадаг:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Триггерийн жагсаалтын дуудлага зөвхөн уншдаг, хяналт шалгадаг. бүртгэл, гүйцэтгэх, давтамжлах өөрчлөлт, бүртгэлийг зогсоох нь мөтийн үйл ажиллагаа юм.

### Хяналт тавих, шийдвэрлэх журам {#repo-and-settlement-instructions}

Repo болон хоёр талын шийдвэрлэлийн туслагчид Norito гарын туршийн сургалтын төрөлүүдийг гар угаагүйгээр нэмэх:

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

Хэрэв Python туслагч нь одоохондоо ашиглаж чадахгүй, санхүүгийн мэдээллийн загварыг хангах `InstructionBox` JSON цаашид `Instruction.from_json` эсвэл шууд `TransactionBuilder.add_instruction_json`. Энэ бол зөвлөж буй зам `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, өрсөлдөгч / үүрэг/NFT бүртгэл, үйл ажиллагааг эхлүүлэх биш бүртгэлгүй хувилбарууд нь эдгээр туслах хэсгийг хэвлэх хүртэл.

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

Үргэлтгүй эсвэл ил тод чиглэлийн хувьд JSON -ийн дагуу эргэн тойронд явж, төхөөрөмжийг хадгалахдаа:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Арилжааны ажлын урсгал {#transaction-workflows}

Хэрэглээ `TransactionDraft` бүртгүүлэхээс өмнө хэд хэдэн захирамжийг бий болгодог хэрэглээнд зориулан. `ttl_ms`, `nonce`, нэг газар, дараа нь нэг удаа гарын үсэг зур:

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

Хяналт шалгалт, аудитын болон хөрөнгийн санхүүжилтийн зорилгоор тодорхойлолттай манифст экспортлох:

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

Зохиоллын замын нууцлалыг баталгаажуулах баримт бичгийг мөрдүүлэхээс өмнө хавсралтын замын шаардлага хангасан тохиолдолд:

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

Тавигдсан хайлтын туслах нь түүхий JSON товчооны оронд өгөгдлийн ангиудыг буцааж өгдөг. Тэд эхлэх хамгийн хялбар арга юм, учир нь SDK нь та бүхэнд сахилга болон нийтлэг бүртгэлийн талбайг шалгадаг:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Torii эцсийн цэгт хэвлэлийн хувилбар байхгүй бол нийтлэг хүсэлтэд туслах хэрэглээ:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

Санхүүгийн жагсаалтын туслалцаа эзэмшигчдэд SDK Энэ нь нормализатор. Canonical ашиглах I105 бүртгэл IDs Block explorer эсвэл raw endpoint нь ID Энэ нь SDK Үүнээс татгалзсан бол хуулийн дагуу шийдвэрлэнэ ID Та эдгээр туслагчдыг дуудахаас өмнө:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Үргэлт {#events}

Хэвлэлийн дамжуулах туслалцааг уншигч JSON Үндсэн хуулийн дагуу нөөц ачаалал. `with_metadata=True` хэрэв та SSE үйл явдлын нэр, ID, дахин туршилтын нэгийг, түүхий эд ачаалал. `EventCursor` Хамгийн сүүлийн үеийн үйл явдлын тодруулгыг хэвээр үлдээх. Эдгээр жишээ нь амьд үйл явдлыг хүлээж байна, Тиймээс тэдгээрийг тухайн үйл явдлын урсгалыг идэвхжүүлж, идэвхжиж байгаа түймэр рүү шилжүүлээрэй.

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

SDK нь үндсэн өргөтгөлийн нэгдмэл болгонд орон нутгийн гарын үсэг зурах туслагчдыг илрүүлнэ. Эдгээр туслах нь Taira -ийг дууддаггүй боловч үндсэн өргөтийг шаарддаг:

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

`supported_crypto_algorithms()` -ийг ашиглан танай төвийг дэмжих нь юу вэ гэж үзнэ үү. Дээрх ёсны туслалцаач нар Ed25519, secp256k1, ML-DSA, GOST, BLS болон SM2-д ажилладаг бөгөөд тэдгээр алгоритмүүд нь:

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

Үндсэн хуулийн Python SDK аль алиныг нь илрүүлнэ. SM2 туслагч, SM2-Хүйцэтгүйн туслалцааг сонгохын тулд сүлжээний боломжийн зарлан SM2 зорилтот сүлжээний хүлээсэн тодорхойлох тэмдэг:

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

`crypto.sm.enabled` нь өнөөгийн бодлогын хувьд SM-ийн гэр бүлийн алгоритмыг хүлээн зөвшөөрөх эсэхийг харуулж байна. ижил зарлан нь SM хэшийн бодлого болон хурдацлалтын байдлыг багтаасан бөгөөд энэ нь SM2-д тодорхой урсгалыг хүчингүй болгох эсэхийг шийдвэрлэхэд ашигтай:

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

Олон нийтийн Taira нь шалгалтын үеэр SM чадварын сурталчилгааг илрүүлсэн боловч SM гарын үсэг зургийг тэнд хүчингүй болгосон юм. Түүний гарын үсгийн алгоритм нь `ed25519`, `secp256k1`, `bls_normal` байсан. тул SM2-ийн гарын үсэг зурсан гүйлгээг тухайн нэвтрүүлэгт хүргүүлэхгүй бол хүчин чадлын ашигтай ачаалал өөрчлөгдөхгүй байх.

### GOST болон квантын дараах товчоо {#gost-and-post-quantum-keys}

Үндсэн крипто ашиглах API . GOST R 34.10-2012-ийн параметрний багц, ML-DSA (`ml-dsa`) квантын дараах гарын үсэг зурсан. Энэ нь ... Үүнтэй ижил түлхүүрний тоног төхөөрөмж нь гарын үсэг зурах, баталгаажуулах, олон хаш экспорт хийхэд:

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

Газар GOST болон квантын дараагийн урсгал нь түйүлгийн зарласан гарын үсэг зурах алгоритмүүд дээр байдаг. Цаашид тохиромжтой алгоритмын нэрлэлийн тулд түүхий хүчин чадлын ашиг ачааллыг ашигла:

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

Хэрэв цэг нь танд хэрэгтэй алгоритмыг зарцуулахгүй бол зөвхөн орон нутгийн эсвэл офлайн ажлын урсгалд түлхэгийг ашигла. Тус алгоритмээр гарын үсэг зурсан гүйлгээг тухайн цэгт ирүүлэхгүй. Нийтийн Taira шалгалтын үеэр GOST болон ML-DSA нь SDK крипто туслалцаа үзэгчдийн хувьд гарааны өмнө Python номын сан дээр ашиглагдаж байсан боловч гүйлгээний гарын үсэг зурах зорилгоор цэгээр сурталчилдаггүй байв.

## Конфигурацын мэдлэгтэй үйлчлүүлэгч бүтээх {#config-aware-client-creation}

`resolve_torii_client_config` -ийг хэрэглээнд файлын сүлжээний тохируулгыг уншдаг боловч байгаль орчин, шинжилгээний онцлогтой зайлшгүй шаардлагатай тохиолдолд ашигла:

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

## Kagemusha бэлтгэл {#kagemusha-readiness}

Python SDK нь одоогийн JSON бэлэн байдлын замыг ерөнхий Torii хүсэлтэд туслах дамжуулан асууж болно:

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

Python нь Kagemusha-ийн нэмэлт оруулах болон чөлөөлөх архивын бүтээн байгуулагчдыг илтгэхгүй. Каноникийн V4 архив бүтээхийн тулд Swift эсвэл JVM хөрөнгийг ашиглаж, дараа нь дэмжсэн Kagemusha Torii клиентээр дамжуулан өргөн мэдүүлэн санал асуулга явуулна.

## Ашиглал {#subscriptions}

Хөдөлмөрийн хэрэгслийн туслах нь хуваалцсанаас өвчилж буй үйлчилгээний дуудлагаг өөрчлөх Torii хэрэглэгчийн `iroha_python.ToriiClient`. Хэрэглээ IDs Таны зорилт тавьсан сүлжээнд байгаа эд хөрөнгө.

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

## Холбоолуул {#connect}

Connect URIs-ийг бүтээж, шинжилгээ хийлгэж, Taira -ийн нэвтрүүлсэн олон нийтийн Connect статусыг уншина уу:

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

Фрейм кодек, сессийн түлхүүр ололт, сессийг бий болгохэд үндсэн өргөтгөөн болон Connect-ийн сессийн замыг ашиглах шаардлагатай:

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

Хууль батлагдсанаас хойшхи мэдээллийг хэвийн ээлжингээр шифрлэх:

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

## Захиргааны засаглал, гүйцэтгэх цаг, удирдах газар {#governance-runtime-and-admin-surfaces}

Эдгээр зөвхөн уншдаг дуудлагыг олон нийтэд Taira эсрэг амжилттай буцааж өгсөн:

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

Хөдөлмөрийн цаг хугацааны шинэчлэлийн туслах нь API хөөцөлдөх цаг үеийн шинэчлэлийг ашиглаж байгаа манифст хэлбэрийг хүлээн зөвшөөрдөг. Тэд оператор үйл ажиллагаа юм, тиймээс таны данс болон токен зөвшөөрөлтэй цэг дээр зөвхөн ашигла:

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

## SoraFS,UAID, Kaigi туслах ажилчид {#sorafs-uaid-and-kaigi-helpers}

Эдгээр туслах нь зорилтот түймэртэй холбоотой Nexus/SORA төгсгөлийн цэг. Бус жагсаалтыг хүчин төгөлдөр хариу гэж үзээрэй: олон нийт Taira үзэл баримт бичгийн мэдээлэлгүйгээр замыг ашиглах боломжтой, эсвэл UAID.

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

## Norito RPC болон GPU Хөдөлмөрийн туслах {#norito-rpc-and-gpu-helpers}

Та аль хэдийн Norito байттай бол `NoritoRpcClient` ашиглаж, бинар Torii төгсгөлийн цэг рүү дуудлах хэрэгтэй. Тухайн жишээ нь өмнөх гүйлгээний загварын гарын үсэг зурсан хуудас шаарддаг:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

CUDA туслагч нь `None` -ийг буцааж өгөөч бэкэнд байхгүй бол хэрэглүүд скалар хэрэгжилтэд шилжүүлэх боломжтой:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Одоогоор хамааралтай {#current-coverage}

Python SDK нь дараахь чиглэлээр туслах ажилтнуудыг багтаасан:

- Torii өргөн мэдүүлэг, байдал, хайлт, удирдах урсгал
- нийтлэг ISI болон доменийн тусгай өргөтгөлийг зориулсан дүрэмлэгийн зааварч
- гүйлгээний төсөл, манфист, гарын үсэг зурах болон гарын үсгийн гүйлгэний хуудасны ажлын урсгал
- урсгалын үйл явдлууд, филтрүүд, цаашид ашиглах боломжтой курсор
- нийтлэг Kagemusha бэлэн байдлын нэвтрүүлэг болон Torii бүртгэлийн туслалцааг эзэмшигч; цахилгаан нэмэлт, нөхөн төлбөрийн бүтээн байгуулалтын ажилтнууд илэрэхгүй
- дансны хаяг, бүх алгоритмийн гарын үсэг зурах туслалцаач, олон хашны эргэн тойронд аялал, SM2, GOST, ML-DSA, BLS болон нууц товчооны хэрэгжилт
- URIs, чуулганы үеэр, төхөөрөмжүүд, шифрлэх туслах болон бүртгэлийн захирал холбоно
- удирдлага, зардах цаг шинэчлэл, Sumeragi, түймэр-админ, SoraFS, UAID, болон Kaigi Хөгжлийн тоног төхөөрөмж нь эдгээр шинж чанаруудыг илрүүлэх

## Урьдчилсан нэвтрүүлэг {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Эдгээр файлууд нь Python талбайны үнэн эх үүсвэрийн нэвтрүүлэгтэй ажлын байрны шинэчлэлт.
