---
translation_locale: mn
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Python {#python}

Дээд урсгалын ажлын орчин дахь Python SDK нь `iroha-python` байна. Анхны Iroha 3 гаргалт нь одоогийн Torii ба Norito гадаргууг чиглэлээ. Интеграцчилалд ашигласан багцын хувилбар эсвэл эх кодын өөрчлөлтийг тогтоож, ингэснээр SDK ба зангилаа ижил дарааллаар хадгалагдах форматын хувилбарт үлдэнэ.

Доорх нэргүй уншигдах жишээнүүд нийтийн Taira дээр `https://taira.sora.org`-ыг чиглүүлдэг. Маршрутыг зөвхөн уншигдах байж болох ч ганц протокол-стандартын дансны гарын үсэг эсвэл яг сүлжээний операторын гарын үсгийг шаарддаг; тэдгээр жишээнүүд тусад нь тэмдэглэгдсэн байдаг. Өөрчлөгдөж буй жишээнүүд нь гүйлгээний загвар бөгөөд тэдгээрийг илгээхийн өмнө бодит Taira баталгаажуулах эрх мэдэл, хувийн түлхүүр, төрөлжсөн төлбөрийн хүсэлтийг, хангалттай тестнет XOR, болон зорилтот замаар шаардагдах нэвтрэлт шаардлагыг шаарддаг.

Эдгээр жишээг дараах дарааллаар ашиглана уу:

|Талбай|Олон нийтийн эсрэг Taira-д уралдаарай?|Танд хэрэгтэй зүйл|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|Нэрээ нууцлаж дуудлагыг уншсан|Тийм| Python багц болон сүлжээний хандалт|
|Данс эсвэл оператороор баталгаажсан уншлага|Зөвхөн өөрийнхөө хүлээн зөвшөөрсөн таних тэмдгээр|Яг Taira `NetworkId` ба холбогдох данс эсвэл операторын түлхүүр|
|Орон нутгийн гарын үсэг зурж, зааварчилгаа боловсруулах хүмүүс| `submit()` хүртэл сүлжээний дуудлага байхгүй|Уугуул өргөтгөл ба таны түлхүүр материал|
|Гүйлгээ ба үйлчилгээний дуудлагын хувиргалт|Зөвхөн таны өөрийн санхүүжүүлсэн дансаар|баталгаажуулалтын гол данс, хувийн түлхүүр, яг Taira `NetworkId`, бичсэн шимтгэлийн зорилго, шимтгэлийн хөрөнгийн үлдлээ, болон маршрутын токенууд|
|Фрейм кодек, крипто ба GPU туслахуудыг холбох|Зөвхөн орон нутгийн|Уламжлалт өргөтгөл; GPU туслагчид мөн CUDA чадвартай арын систем хэрэгтэй|

## Суурилуулах {#install}

Сав баглаа боодолын мета өгөгдлийн нэр нь `iroha-python` байна. Залгалтгүй PyPI суулгалт амьд Taira сүлжээтэй нийцнэ гэж бүү таамагла. Таны интеграцийн зорилтот эх хэвлэлээс бүтээсэн дугуй эсвэл эх кодын ажиллах хуулбарыг суулгана уу:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Хэрэв төсөл upstream ажлын орчныг шууд ашигладаг бол Python хамаарлуудыг суулгаж, `Instruction`, `TransactionDraft`, гарын үсэг, криптограф, SoraFS-ийн native туслах, GPU туслах эсвэл Connect frame codec ашигладаг жишээг ажиллуулахын өмнө native өргөтгөлийг бүтээнэ. Upstream-ийн `python/iroha_python/README.md`-д заасан бүтээх командыг ашиглаад, native экспорт ачаалагдаж буйг шалгана:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Хэрэв `create_torii_client` импортолж байвал гэхдээ `Instruction` эсвэл `generate_ed25519_keypair` амжилтгүй болвол, цэвэр Python багц нь боломжтой боловч уугуул өргөтгөл нь биш юм.

## Хурдан эхлэлт {#quickstart}

Олон нийтийн, зөвхөн унших боломжтой Taira API төгсгөлүүдээс эхлэ.

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

## Хуваалцсан тохиргоо {#shared-setup}

Энэ тохиргоог өөрчлөгдөж буй загваруудад ашигла. Илгээхээсээ өмнө бүх орлуулагчийг таны хэвлэн гаргах үеийн Taira эрх бүхий голын, хувийн түлхүүр, токен болон хөрөнгө/дансны ID-ээр солино уу.

`authority` бол гүйлгээнд гарын үсэг зурдаг данс бөгөөд `private_key` үүнтэй таарч байх ёстой. Гүйлгээнүүд Taira-ийн яг гарал үүсэлтэй `NetworkId`-д холбогддог; гинж UUID нь гүйлгээний таних тэмдэг биш, харин байршуулалтын шошго юм. Төлбөр нь програмын метадатанаас хамааралгүйгээр бичигдсэн төлбөрийн зорилго болон яг одоогийн амьд үнийн дүнг ашигладаг. Доорхи данс болон түлхүүрийн орлуулагчид санаатайгаар хүчин төгөлдөр бус байдаг тул тэд санамсаргүйгээр илгээгдэж болохгүй.

Доорх бичих зүйл нь одоогийн тогтоожээ Taira блокчэйн санаачлын хэв шинж юм. Туршилтын сүлжээ дахин тохируулах нь үүнийг өөрчлөх боломжтой, тиймээс үүнийг гарын үсэгтэй нэвтрүүлгийн профайлээс шинэчилж, сүлжээ UUID-ээс битгий таамагла.

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

`Instruction.*` зөвхөн зааврын агуулгыг бүтээдэг. `submit()` нь SDK бодит төлбөрийн үнийн төсөөллийг авдаг, яг төлөвлөсөн агуулгыг гарын үсэг зурдаг, үүнийг Torii руу илгээдэг, бөгөөд төлвийг хүлээдэг цэг юм.

## Төлбөр ба гүйлгээний процессын зардал {#fees-and-gas}

Бичих гүйлгээнд `FeePaymentIntent` бичигдсэн ба санхүүжсэн хураамжийн хөрөнгийн тэнцэл хэрэгтэй. Taira дээр нийтийн тестнетийн санхүүжилтийн үйлчилгээ тестнет XOR-г санхүүжүүлдэг. Python SDK тогтсон гарын үсэггүйг илгээдэг заранд зориулсан Torii төлбөрийн яг үнийн үнэлгээнд зориулсан ачаа, үнийн санал төллөө авагчийг эсвэл ачааг орлуулсангүй гэдгийг баталгаажуулж, үнийн санал болгосон санааг гарын үсэг зурах. Гүйлгээний metadata-д төлбөрийн сонголтыг битгий оруулаарай.

Дээрх `submit()` туслах нь төлбөрийг гүйлгээний гарын үсэг зурсан данснаас хэвлэж эхэлдэг бөгөөд түүний цэнэглэх хязгаарууд санаатайгаар хоосон байдаг. `quote_and_sign()` гарын үсэг зурхаас өмнө амьд үнийн саналаас тэдгээрийг бөгөлдөг:

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

Бичлэг илгээхээс өмнө зөвшөөрлийн үндсэн данс хангалттай шимтгэлийн хөрөнгөтэй байгаа эсэхээ шалгаарай. Нарийн тестнетийн санхүүжилтийн үйлчилгээ ба хөрөнгийн ID нь сүлжээний тусгай байдаг; энэ нь Taira хэлбэр юм:

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

Тестнет санхүүжүүлэх үйлчилгээ баланс шалгах зориулалтаар ашиглах тодорхой `asset_id`-ыг буцаана. Амьд үнийн саналыг `FEE_ASSET_DEFINITION` төлбөр авсан эсэхийг шалга; гүйлгээгээр тухайн хөрөнгийг метадатаар сонгохгүй.

Програмын мета өгөгдөл нь сайн дурынх бөгөөд төлбөрийн утга агуулагдаагүй:

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

Хэрэв та хураамжийн зорилгыг орхиж, төлөвлөгөөгүй активын үнийг хүлээн авбал, үнийн дүнг тогтоосны дараа ачааг өөрчилбөл, эсвэл санхүүжилтгүй дансаар гарын үсэг зурвал, гүйлгээг илгээж болохгүй.

## Нэр нь нууц Taira уншиж байна {#anonymous-taira-reads}

Эдгээр дуудлагууд нь каталогийн хаяг нь нэрээ нууцлах уншлагыг зөвшөөрдөг Taira чиглүүлэгчийг ашигладаг:

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

`/v1/time/status` ба бүх `/v1/sumeragi/*` операторын цэг-цагийн өгөгдлийн харагдах байдал нь төлөвийг өөрчилдөггүй байсан ч яг сүлжээний операторын гарын үсгийг шаарддаг. Нэргүй зангилаанд `request_json("GET", "/status")`-ыг ашигла. Консенсус буюу нодын дотоод цагийн оношилгооны хувьд доор дурдсан статусын өгөгдөл болон операторын тохиргоог ашиглана уу. Холболтын статус нь тусдаа протоколын маршрут бөгөөд тухайн сессийн удирдлагын токен хэрэгтэй.

## Заавар баригчид {#instruction-builders}

SDK нь хамгийн нийтлэг зааврын гэр бүлүүдэд зориулсан төрөлжсөн бүтээх програмуудыг ил болгож, JSON нь анхдагч Python аргууд биш хувилбаруудын хувьд оргон зайлж болох гарцыг өгдөг. Дараах хэсгүүд нь гүйлгээний загварыг өөрчилж байгаа бөгөөд нээлттэй Taira-д гарын үсэг бүхий дансгүйгээр илгээгээгүй.

Боломжтой бол төрөлжсөн туслахуудыг сонгоорой: тэдгээр нь хэвийн болгодог Python үнэт зүйлсийг шалгаж, буруу хэлбэртэй тохиолдолд эрт буруу гарга. Ашигла `Instruction.from_json` зөвхөн зааваргүй хувилбар хэрэгтэй үед Python туслагч одоогоор байхгүй.

|Зааварчилгаа гэр бүл| Python гадаргуу |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|Бүртгүүлэх|`register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` нь genesis/bootstrap хэрэгслийн зориулалтаар хадгалагдсан болно|
|Бүртгэлээс гаргах| `unregister_trigger`; бусад хувилбаруудад `Instruction.from_json` ашиглана уу|
|Шинэчлэх/Шатаах| `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions`                                                                                          |
|Шилжүүлэх| `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|Мета өгөгдөл ба хяналт| `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value`                                                                        |
| RWA амьдралын мөчлөг| `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa`|
| ExecuteTrigger | `execute_trigger` |
|Репо/төлбөрийн өргөтгөлүүд|`repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp`|
|Уугуул хөрөнгийн түгжээ| `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, мөн клиент `*_and_wait` туслахууд|
|Өгөх/Хасах, SetParameter, Түүх, Захиалгат, Сайжруулах, мөн бага хэрэглэгддэг бүртгэх/бүртгэл устгах хувилбарууд|`Instruction.from_json` эсвэл `TransactionBuilder.add_instruction_json` нэг протокол-стандарт `InstructionBox` JSON|

Эскроу маягийн нөхцөлт төлбөрийн хувьд [Уугуул хөрөнгийн эскроу](/mn/blockchain/escrow.md#python-asset-locks)-ыг үзнэ үү. Python нь одоогоор ерөнхий хөрөнгийн түгжээг дэмжих анхны зэрэглэлийн туслахуудыг үзүүлдэг; зах зээлийн болон нэргүй эскроу туслахууд нь одоогоор анхны зэрэглэлийн Python арга биш юм.

### Домэйнуудыг тохируулж, дараа нь данс болон хөрөнгүүдийг бүртгэ {#set-up-domains-then-register-accounts-and-assets}

Энгийн домайн үүсгэх үйл явц мэдүүлгийн алиасын төлөвлөгчөөр дамжин явагддаг тул SNS түрээс, эзлэгчийн хүчин чадал, төлбөрийн үнэ баталгаажуулалтын хамгаалалт, болон домайн төлөвийг хамтдаа шалгадаг. Өөрийн SDK эсвэл нэвтрэлт үйлчилгээтэй нууцлалыг агуулаагүй `AliasSetupPlanRequestV1` зорилгыг үүсгээд, дараа нь `iroha app alias setup plan` ба `iroha app alias setup apply`-г ашиглана уу. `Instruction.register_domain`-ийг хэрэглээний гүйлгээнээс өгч болохгүй; тэр бүтээгч нь genesis/bootstrap хэрэгслийн хувьд үлдэнэ.

Домайн тохиргооны төлөвлөгөө батлагдсаны дараа домайн эзэмшдэг объектуудыг бүртгэ. Taira гэх мэт нийтлэг сүлжээнд домайн болон танд оноогдсон дансны нэрийн санг ашигла.

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

`mintable` нь өгөгдлийн загварын хүлээн авдаг `Infinitely`, `Once`, `Not`, эсвэл `Limited(n)` утгуудыг хүлээн авдаг. Хязгааргүй тоон хөрөнгийн хувьд `scale`-ийг орхиж болно.

### асуудал үүсгэх, устгах, болон хөрөнгийг шилжүүлэх {#mint-burn-and-transfer-assets}

Эдгээр дуудлагууд нь өмнөөс нь бүртгэлтэй хөрөнгийн ID-г ашигладаг. Эхлээд хөрөнгийн тодорхойлолтыг бүртгүүлж, дараа нь хөрөнгийг эзэмшдэг дансны хувьд тодорхой хөрөнгийн ID-г бүтээнэ үү.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Өмчлөл шилжүүлэх {#transfer-ownership}

Эзэмшлийн шилжүүлэг нь домайн, хөрөнгийн тодорхойлолт, эсвэл NFT-ын хэн удирдахыг өөрчилдөг. Гүйлгээний зөвшөөрлийн үндсэн этгээдээр одоогийн эзэмшигчийг ашигла.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Мета өгөгдлийг тогтоох ба устгах {#set-and-remove-metadata}

Мета өгөгдлийн утгууд JSON-д цуваагаар хувиргаж болохуйц байх ёстой. Та `TransactionDraft`-ыг ашиглах үед `TransactionConfig`-д байгаа эрх олгох гол нь анхдагч зорилтот данс болдог.

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

Өндөр түвшний ноорог туслах нь анхдагчаар гүйлгээний зөвшөөрлийн зарчмыг чиглүүлдэг:

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

### Бодит Дэлхийн Хөрөнгүүд {#real-world-assets}

RWA туслахууд хөрөнгөнд онцгой metadata, гарал үүсэл, болон контроллерийн бодлогод зориулсан JSON-серилайз хийх боломжтой payload-уудыг ашигладаг. `register_rwa` нь `id` эсвэл `owner`-ийг хүлээн авдаггүй: программ хангамжийн гүйцэтгэлийн орчин нь `RwaId`-г үүсгэдэг бөгөөд гүйлгээний зөвшөөрлийн эрх мэдэлтэй этгээд анхны эзэмшигч болдог.

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

Бүртгэлийн гүйлгээ дууссаны дараа үүсгэсэн ID-ийг олоход `FindRwas`, `/v1/rwas`, RWA арга хэмжээ эсвэл хайгчийн чиглэлийг ашиглана уу:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Дараагийн үйлдлүүд үүсгэсэн `hash$domain` ID-г ашиглана:

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

Бүх шилжүүлэг нь одоогийн талбай дээр `owned_by`-г өөрчлөх боломжтой. Хэсэгчлэн шилжүүлэг ба нэгтгэл нь үүссэн хүүхэд талбайг бий болгодог.

### Түгээгчид {#triggers}

Гүйцэтгэгдэх файл өөр зааврын дарааллаар байх үед триггер бүртгэлийн туслагчийг ашигла.

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

Torii мөн тригерийн сангийн туслах REST-ыг ил болгодог:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Триггерийн бүртгэлийн дуудлагууд зөвхөн триггерийн бичлэгийг унших эсвэл шалгах болно. Бүртгэл, гүйцэтгэл, давтамжийн өөрчлөлтүүд болон бүртгэлээс устгах нь өөрчлөлт оруулах үйлдлүүд юм.

### Репо ба санхүүгийн гүйлгээний тохиролцооны зааврууд {#repo-and-settlement-instructions}

Repo ба хоёр талт төлбөр тооцооны туслахууд гараар боловсруулахгүйгээр Norito өгөгдлийн багцын оронд салбарын онцлогтой зааврын хувилбаруудыг нэмж оруулдаг:

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

### JSON Оргих гарц {#json-escape-hatch}

Хэрэв Python туслах бэлэн биш бол каноник өгөгдлийн загварын `InstructionBox` JSON-ийг `Instruction.from_json`-д өгнө. Туслахууд төрөлжиж бэлэн болтол `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, зангилаа/үүрэг/NFT бүртгэл болон триггерээс бусад бүртгэл цуцлах хувилбарт энэ аргыг зөвлөж байна.

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

Транзакцын хязгаарт тайпсан хэсгийн замыг хадгалаарай: энэ нь яг `NetworkId`, төлбөрийн хүсэлтийг, мөн гарын үсэг зурхаас өмнөх үнийн тогтмол байдлыг хадгалдаг. Шууд `TransactionBuilder` ашиглах нь ижил утгуудыг шаарддаг бөгөөд амьд үнийн баталгааг тодорхой шалгахыг шаарддаг тул програмын кодын хувьд богино зам биш юм.

Үүсгэсэн эсвэл ил тод бус заавруудын хувьд, тестийн материалуудыг хадгалахаасаа өмнө JSON-р дамжуулан эргүүлэх:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Гүйлгээний урсгалын процессууд {#transaction-workflows}

Гарын үсэг зурхаас өмнө олон заавар үүсгэдэг програмд `TransactionDraft` ашигла. Төслийг нэг дор гүйлгээний түвшний тохиргоо болох `ttl_ms`, `nonce` болон метадатаг хадгалах боломжийг олгож, дараа нь нэг удаа гарын үсэг зурна:

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

Шалгалт, аудит хийх эсвэл түрийвч шилжүүлэх зориулалтаар тодорхой техник manifest-ийг экспортлох:

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

Зорилтот эгнээ шаарддаг бол гарын үсэг зурахаас өмнө эгнээний нууцлалын нотолгоог хавсаргана:

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

## Асуултууд {#queries}

Товлосон лавлагааны туслахууд нь түүхий JSON толь бичгүүдийн оронд өгөгдлийн ангиудыг буцаадаг. Эдгээр нь эхлэх хамгийн хялбар арга юм, учир нь SDK нь таны хувьд хуудсанд хуваах болон нийтлэг бичлэгийн талбаруудыг задладаг:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Torii-ийн төгсгөлийн цэгт төрөлжсөн бүрхүүл хараахан байхгүй бол ерөнхий хүсэлтийн туслахыг ашиглана:

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

Тооцооны бүртгэлийн туслахууд нь SDK ердийн нормалагчид хүлээн зөвшөөрөгддөг дансны танигч шаарддаг. Нэг протокол-стандартын I105 дансны ID эсвэл сүлжээнд холбогдсон нийцсэн нэрийг ашигла. Хэрэв блок судлаач эсвэл raw API төгсгөлийн цэг SDK-ийн зөвшөөрдөггүй ID буцаавал, эдгээр туслах функцуудыг дуудан өмнө үүнийг нэг протоколын стандарт дансны ID болгон шийдвэрлэнэ үү:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Арга хэмжээ {#events}

Үргэлжийн дамжуулалтын туслахууд анхдагчаар JSON ачааг тайлбарлана. `with_metadata=True` өгөгдлийг SSE эвент нэр, ID, дахин оролдох заавар, болон түүхий ачаатай авах шаардлагатай үед дамжуулна. Нэг протоколын стандарт `/v1/events/sse` фид зөвхөн шууд дамжуулалттай: энэ нь ямар ч дахин тоглуулах ID-г гаргахгүй бөгөөд дахин тоглуулах тэмдэглэл хадгалдаггүй тул эдгээр туслахууд ямар ч курсор эсвэл үргэлжлүүлэх аргумент өгдөггүй. Дахин холболт нь шинэ захиалгыг эхлүүлдэг бөгөөд зай үүсч болох юм; бүрэн блокчейн бүртгэлийн түүх шаардлагатай үед мэдэгдсэн өндрөөс `/v1/blocks/stream`-ийг ашиглана уу. Эдгээр жишээнүүд амьд үйл явдлуудад хүлээж байгаа тул урсгал идэвхтэй байгаа нод дээр ажиллуулна уу.

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

## Түлхүүрүүд болон Хаягнууд {#keys-and-addresses}

SDK нь нутгийн өргөтгөлийнд эмхтгэсэн бүх гарын үсгийн алгоритмуудын хувьд орон нутгийн гарын үсэгтэй туслахуудыг ил гаргадаг. Эдгээр туслахууд Taira-г дуудаж ажиллуулдаггүй боловч нутгийн өргөтгөлийг шаарддаг:

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

`supported_crypto_algorithms()`-ыг ашиглан таны дугуй дэмжиж буй зүйл юу болохыг хараарай. Ерөнхий туслахууд нь нэг протокол-стандартын алгоритмын шошгыг ашигладаг бөгөөд эдгээр алгоритмуудыг компайл хийсэн үед Ed25519, secp256k1, ML-DSA, GOST, BLS, болон SM2-д ажиллана:

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

### Хятадын SM Криптографи {#chinese-sm-cryptography}

Python SDK нь ерөнхий SM2 туслагч болон SM2-т зориулсан тусгай хэрэглээний туслагчийг ил гаргадаг. Зорилтот сүлжээний шаардлагатай SM2 ялгаварласан тодорхойлогчийг сонгохын тулд node-ийн боломжийг зарлах мэдээллийг ашиглаарай:

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

`crypto.sm.enabled` нь тухайн зангидаж буй бодлогын дагуу тухайн зангид SM-гэр бүлийн алгоритмуудыг хүлээн авч байгаа эсэхийг танд хэлдэг. Ижил зар сурталчилгаанд SM криптографийн хэш бодлого болон хурдсалтын байдал багтсан бөгөөд энэ нь SM2-д зориулсан урсгалуудыг идэвхжүүлэх эсэхийг шийдэхэд ашигтай юм:

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

Баталгаажсан хүчин чадлын ачааг суулгасан зангилаанд эрх мэдлийнх гэж үз. `crypto.sm.enabled` үнэн биш бол SM2-ээр гарын үсэг зурсан гүйлгээг илгээгээрэй, мөн сурталчилсан гарын үсэг зурах бодлого үүнийг зөвшөөрдөг байх ёстой.

### GOST ба Посто-Квант түлхүүрүүд {#gost-and-post-quantum-keys}

Ерөнхий криптог API ашиглаарай GOST R 34.10-2012 параметрийн багцууд болон ML-DSA (`ml-dsa`) пост-квантын гарын үсгүүдэд. Ижил түлхүүрийн хос объект гарын үсэг зурах, баталгаажуулах, олон хэш экспортлохыг хариуцдаг:

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

Хаалга GOST ба гарц-кивантын урсгалууд нь зангилааны баталгаажсан, төрөлжүүлсэн чадварын зар сурталчилгаанд:

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

Хэрэв зангилаа таны хэрэгтэй алгоритмыг зарладаггүй бол түлхүүрийг зөвхөн орон нутгийн эсвэл оффлайн урсгалд ашигла. Тухайн алгоритмоор гарын үсэг зурсан гүйлгээг тэр зангилаанд дамжуулж болохгүй. Олон нийтийн Taira шалгалтын үеэр GOST ба ML-DSA нь дээд түвшний Python номын сан дахь SDK крипто туслахууд болгон ашиглах боломжтой байсан ч гүйлгээ гарын үсэг зурах зориулалтаар үүнийг зангилаа зарлаагүй.

## Тохиргоог ойлгосон үйлчлүүлэгч бүтээх {#config-aware-client-creation}

Таны програм файлнаас node тохиргоог уншиж байхдаа ч гэсэн орчин эсвэл тестэд онцгой давуу эрх шаарддаг бол `resolve_torii_client_config`-ийг ашиглана уу:

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

## Кагэмуша Бэлэн байдал {#kagemusha-readiness}

Python SDK нь өөрийн ерөнхий Torii хүсэлтийн туслах хэрэгслийнхээ тусламжтайгаар одоогийн JSON бэлэн байдлын маршрутыг асууж болно:

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

Python нь Kagemusha-ийн төрөллөлттэй нөхөн сэргээх эсвэл нөхөн олговор хадгалах баримт бичиг бүтээгчүүдийг ил гаргахгүй. Нэг протокол-стандарт V4 архивыг бүтээхийн тулд төрөллөлттэй Swift эсвэл JVM түрийвчийг ашиглаад, дараа нь дэмжигдсэн Kagemusha Torii клиентээр дамжуулан илгээж, шалгаарай.

## Бүх захиалгууд {#subscriptions}

Нийтлэлийн уншигчид болон төсөл бүтээгчид `iroha_python.ToriiClient`-аар ашиглагддаг нийтлэг Torii клиентээс өвлөгддөг. Бүх өөрчлөлтийг бие даасан нэг замаар хүлээн авдаг протокол-стандартад нийцсэн дансны гарын үсгийг ашигладаг ба гарын үсэггүй гүйлгээний ноорогийг буцаадаг. Torii хувийн түлхүүрийг хэзээ ч хүлээн авдаггүй ба таны төлөө нооргыг илгээдэггүй.

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

Яг тэр ачаалал болон гарын үсгийн мессежийг харгалзах дансны дотоод түрийвчинд өгч, хүссэн үйлдлийг тэнд шалгаад, гарын үсэгтэй гүйлгээг угсран ердийн гүйлгээний боловсруулалтын урсгалаар илгээнэ. Python SDK нь гарын үсгийн мессеж буцаасан ачааллын каноник хэш мөн эсэхийг шалгах боловч түрийвч гарын үсэг зурахаасаа өмнө гүйлгээг тайлж харуулан зөвшөөрүүлэх үүрэгтэй.

## Холбох {#connect}

Connect URIs-ийг локал дээр барьж, задлаарай. Connect танигч нь SID-ийг яг `NetworkId`, апп-ийн олон нийтийн түлхүүр, криптографийн nonce утгатай холбодог:

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

Тухайн урьдчилсан харааг зөвхөн зорилтот зангилаа Connect-г ил болгох үед бүртгэнэ. Сесс үүсгэхэд дөрвөн дүрмийн тодорхой токен буцаадаг. Сессийн байдал бүртгэх маршрут нь удирдлагын токенийг шаарддаг; нийт байдал нь операторын маршрут юм.

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

Засаг процесс бүхий сессээр батлагдсан дараах мессежүүдийг шифрлэ:

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

## Удирдлага, програм хангамжийн гүйцэтгэх орчин, ба Админ талыг {#governance-runtime-and-admin-surfaces}

Захиргааны уншлагууд нь данс-нотлогдсон байна. [Хуваалцсан тохиргоо](#shared-setup)-ээс зөвшөөрлийн зарчим болон түлхүүрийн хосыг ашиглан тус бүрийн туслах дуудлагыг Taira-ийн яг гарал үүссэн `NetworkId`-д холбох:

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

Үйлдэгчийн уншихад зориулсан тусдаа клиент үүсгээрэй. Зөвшөөрөгдсөн үйлдэгчийн түлхүүрийг програм хангамжийн гүйцэтгэлийн орчинд ачаалж, үүнийг Taira-ын яг `NetworkId`-т холбож өгнө; үүрэгч токенууд ба `x-api-token` энэхүү гарын үсгийг орлохгүй:

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

Runtime шинэчлэлтийн чиглүүлэгчүүд нь операторын баталгаажуулсан зааварчилгааны бүтээгчид юм. Амжилттай санал болгох, идэвхжүүлэх, эсвэл цуцлах хариу нь `tx_instructions`-ийг буцаадаг; энэ нь шинэчлэлтийг хэрэгжүүлдэггүй. Тэр багцыг энгийн гарын үсэгтэй гүйлгээ болон захиргааны замаар илгээгээрэй. Одоогоор наалттай Python аргууд `propose_runtime_upgrade`, `activate_runtime_upgrade`, болон `cancel_runtime_upgrade` хэрэглэгчийн `OperatorSigningContext` хэрэгжүүлэлтийг ашиглахын оронд энгийн хүсэлтүүдийг гүйцэтгэж байгаа тул энэ зааварчилгаа тэдгээрийг ажиллах оператор урсгал болгон харуулдаггүй.

## Төлөв, Нийтлэг ойлголт, Сүлжээний телеметри {#status-consensus-and-network-telemetry}

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

## SoraFS, UAID, ба Kaigi туслагчид {#sorafs-uaid-and-kaigi-helpers}

Эдгээр туслахууд нь зорилтот товчлуур нь холбогдох Nexus/SORA API төгсгөлүүдийг ил гаргасан үед ашиглах боломжтой. Хоосон жагсаалтыг хүчинтэй хариу гэж үзнэ: олон нийтийн Taira нь дээжийн техникийн үзүүлэлт эсвэл UAID-ын хувьд өгөгдөлгүйгээр маршрутыг идэвхжүүлсэн байж болох юм.

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

## Norito RPC ба GPU Туслагчид {#norito-rpc-and-gpu-helpers}

Та аль хэдийн Norito байттай бол `NoritoRpcClient`-ыг ашиглаж, хоёртын Torii API эцсийн цэгийг дуудахад хэрэгтэй. Жишээ нь өмнөх гүйлгээний загвараас гарсан гарын үсэгтэй өгөгдлийн сав шаарддаг:

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

CUDA туслагчид backend ашиглах боломжгүй үед `None` буцаана, ингэснээр програмууд scalar хэрэгжилт рүү шилжиж болно:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Өнөөгийн хамрах хүрээ {#current-coverage}

Python SDK нь аль хэдийн туслахуудыг дараах зүйлд багтаасан:

- Torii илгээх, статус, лавлагаа, болон админ урсгалууд
- ердийн ISI ба салбар-тусгай өргөтгөлүүдэд зориулсан бичвэр заавар бүтээгчид
- гүйлгээний төсөл, техникийн мэдүүлэг, гарын үсэг зурах, гарын үсэг зурсан гүйлгээний өгөгдлийн савны ажлын урсгалууд
- амьд үйл явдлын урсгалууд ба бичигдсэн шүүлтүүд; эцсийн блок урсгалууд бүрэн түүхийг өгдөг
- ерөнхий Кагемуша бэлэн байдлын хандалт ба Torii захиалгын туслахууд; бичигдсэн дүүргэлт болон арилжааны бүтээгчид ил гаргагдаагүй
- төлбөрийн дансны хаяг, бүх алгоритмын гарын үсэг зурах туслах хэрэгсэл, олон хэвлэлийн буцах замууд, SM2, GOST, ML-DSA, BLS, ба нууц түлхүүрийн удирдлага
- Холбох URIs, хурал, кадрууд, нууцлалын туслагчид, болон бүртгэлийн админ
- зангилаа эдгээр боломжийг гаргасан үед засаглал, гүйцэтгэх орчны шинэчлэлт, Sumeragi, node-admin, SoraFS, UAID болон Kaigi төгсгөлийн цэгийн бүрхүүлүүд

## Дээшээ чиглэсэн лавлагаа {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Тэр файлууд нь наалттай ажлын орчны шинэчилсэн хувилбарт байгаа Python гадаргын үнэн эх сурвалж юм.
