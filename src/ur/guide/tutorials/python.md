---
translation_locale: ur
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

اپ اسٹریم ورک اسپیس میں Python SDK `iroha-python` ہے۔ پہلی Iroha 3 ریلیز موجودہ Torii اور Norito سطحوں کو نشانہ بناتی ہے۔ آپ کی انضمام کے ذریعہ استعمال ہونے والے پیکج ورژن یا ماخذ نظر ثانی کو پن کریں تاکہ SDK اور نوڈ ایک ہی وائر فارمیٹ نظرثانی پر رہیں.

مندرجہ ذیل صرف پڑھنے والے مثالوں کو عوامی Taira کے مقابلے میں `https://taira.sora.org` پر چیک کیا گیا تھا۔ تبدیل کرنے والی مثالیں ٹرانزیکشن ٹیمپلیٹس ہیں: انہیں جمع کرانے سے پہلے ایک حقیقی Taira اتھارٹی، نجی کلید، گیس میٹا ڈیٹا اور کسی بھی آپریٹر ٹوکن کی ضرورت ہوتی ہے.

اس ترتیب میں مثالیں استعمال کریں:

|مرحلہ |عوامی Taira کے خلاف چلانے؟ |آپ کو کیا ضرورت ہے |
| --- | --- | --- |
|صرف پڑھنے کے لئے کلائنٹ کالز |جی ہاں|Python پیکج پلس نیٹ ورک تک رسائی |
|مقامی دستخط اور ہدایات ڈویلپرز |`submit()` تک نیٹ ورک کال نہ کریں |مقامی توسیع اور آپ کی اہم مواد |
|ٹرانزیکشنز اور سروس کالز کا تبادلہ |صرف آپ کے اپنے فنڈ اکاؤنٹ کے ساتھ |انتظامیہ کے اکاؤنٹ، نجی کلید، سلسلہ ID، فیس میٹا ڈیٹا، فیس اثاثوں کا بیلنس، اور روٹ ٹوکن |
|فریم کوڈیکس، کرپٹو، اور GPU مددگاروں مربوط کریں |صرف مقامی |مقامی توسیع؛ GPU مددگاروں کو بھی ایک CUDA کے قابل بیک اینڈ کی ضرورت ہے |

## انسٹال کریں {#install}

پیکیج میٹا ڈیٹا کا نام `iroha-python` ہے۔ فرض نہ کریں کہ غیر منسلک PyPI تنصیب براہ راست Taira نیٹ ورک سے ملتا ہے۔ ایک پہیے یا ماخذ چیک آؤٹ انسٹال کریں جو آپ کے انٹیگریشن اہداف کی اسی اپ اسٹریم ریویژن سے بنایا گیا ہے:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

اگر آپ کا پروجیکٹ براہ راست اپ اسٹریم ورک اسپیس استعمال کرتا ہے تو ، Python انحصار اور مثالیں چلانے سے پہلے مقامی توسیع کی تعمیر جو استعمال `Instruction`, `TransactionDraft`, دستخط، کرپٹو، SoraFS مقامی مدد گار، GPU مددگار، یا منسلک فریم کوڈیکس. اوپر سے تعمیر کمانڈ کا استعمال کریں `python/iroha_python/README.md`, اس کے بعد تصدیق کریں کہ مقامی برآمدات کا بوجھ:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

اگر `create_torii_client` درآمدات لیکن `Instruction` یا `generate_ed25519_keypair` ناکام، خالص Python پیکج دستیاب ہے لیکن مقامی توسیع نہیں ہے.

## فوری آغاز {#quickstart}

عوامی ، صرف پڑھنے کے لئے Taira اختتامی پوائنٹس سے شروع کریں:

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

## مشترکہ ترتیب {#shared-setup}

تبدیل کرنے والے ٹیمپلیٹس کے لئے اس ترتیب کا استعمال کریں۔ ہر جگہ ہولڈر کو اپنی تعیناتی سے پہلے Taira اتھارٹی ، نجی کلید ، ٹوکن ، اور اثاثہ / اکاؤنٹ IDs کے ساتھ تبدیل کریں۔

`authority` اکاؤنٹ ہے جو ٹرانزیکشن پر دستخط کرتا ہے۔ `private_key` کو اس اکاؤنٹ سے ملنا چاہئے ، `CHAIN_ID` کو ہدف کے نیٹ ورک سے ملنا ہوگا ، اور `TX_METADATA` کو نیٹ ورک کی طرف سے متوقع فیس فیلڈز شامل کرنا ہوں گے۔ مندرجہ ذیل جگہ ہولڈرز جان بوجھ کر غلط ہیں لہذا وہ حادثاتی طور پر پیش نہیں کیے گئے۔

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

`Instruction.*` صرف تعمیر کی ہدایات کے مفید بوجھ کو بلاتا ہے۔ `submit()` وہ نقطہ ہے جہاں SDK ٹرانزیکشن پر دستخط کرتا ہے، اسے Torii پر بھیجتا ہے، اور اسٹیٹس کا انتظار کرتا ہے.

## فیسیں اور گیس {#fees-and-gas}

ٹرانزیکشنز لکھنے کے لئے فیس میٹا ڈیٹا اور فنڈ شدہ فیس اثاثہ بیلنس کی ضرورت ہے۔ Taira پر ، فیس اثاثے کو عوامی نل سے مالی اعانت دی جاتی ہے اور لین دین میٹا ڈیٹا میں `gas_asset_id` شامل ہونا چاہئے۔ Minamoto پر ، فیسوں کی ادائیگی اصلی XOR کے ساتھ کی جاتی ہے اور اثاثہ ID اس نیٹ ورک کی تشکیل سے آتا ہے۔

فیس میٹا ڈیٹا ٹرانزیکشن سے تعلق رکھتا ہے، انفرادی ہدایات پر نہیں. اوپر `submit()` مددگار ہر ٹرانزیکtionشن کے لئے `TX_METADATA` منسلک کرتا ہے جو اس کی تعمیر کرتا ہے:

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

لکھنے بھیجنے سے پہلے ، اس بات کو یقینی بنائیں کہ اتھارٹی کے اکاؤنٹ میں فیس اثاثہ کی کافی مقدار ہے۔ عین مطابق نل اور اثاثہ ID نیٹ ورک کے مخصوص ہیں۔ یہ Taira شکل ہے:

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

نل کنکریٹ `asset_id` کو بیلنس چیک کے لئے استعمال کرنے کی واپسی کرتا ہے۔ `gas_asset_id` میٹا ڈیٹا فیلڈ فیس اثاثہ تعریف ID کا استعمال کرتا ہے ۔

جب آپ ٹرانزیکشن بناتے ہیں تو نقشہ جات کو ضم کرکے درخواست میٹا ڈیٹا کو فیس میٹا ڈیٹا سے الگ رکھیں:

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

اگر آپ فیس میٹا ڈیٹا کو چھوڑ دیتے ہیں، غلط فیس اثاثہ استعمال کرتے ہیں، یا غیر فنڈ شدہ اکاؤنٹ کے ساتھ دستخط کرتے ہیں، تو ایک حقیقی نیٹ ورک کو ٹرانزیکشن کو مسترد کرنا چاہئے یہاں تک کہ اگر ہدایات کا فائدہ مند بوجھ دوسری صورت میں درست ہے.

## Taira - چیک شدہ صرف پڑھنے والے کالز {#taira-checked-read-only-calls}

عوامی Taira کے خلاف ان کالوں کو کامیابی سے جواب دیا گیا:

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

`/v1/status` ، پبلک پیئر انوینٹری، Sumeragi RBC سیمپلنگ، نوڈ ایڈمن اسنیپ شاٹس، اور کنیکٹ ایپ رجسٹری انتظامیہ جیسے راستے چیک کے دوران پبلک طور پر دستیاب نہیں تھے. Taira پر پبلک نوڈ کی حیثیت کا فائدہ اٹھانے کے لئے `request_json("GET", "/status")` استعمال کریں۔ Taira

## تعمیراتی ہدایات {#instruction-builders}

SDK سب سے زیادہ عام ہدایات کے خاندانوں کے لئے ٹائپڈ بلڈرز اور JSON فرار ہیک کو ظاہر کرتا ہے جو ابھی تک فرسٹ کلاس Python طریقوں نہیں ہیں. مندرجہ ذیل ٹکڑے ٹکڑے تبدیلی والے لین دین ٹیمپلیٹس ہیں اور دستخط شدہ اکاؤنٹ کے بغیر عوامی Taira میں پیش نہیں کیے گئے ہیں۔

ٹائپڈ ہیلپرز کو ترجیح دیتے ہیں جب وہ موجود ہوں: وہ Python اقدار کو معمول پر لاتے ہیں اور غلط شکلوں میں ابتدائی طور پر ناکام ہوجاتے ہیں۔ صرف اس وقت `Instruction.from_json` کا استعمال کریں جب آپ کو ہدایات کی قسم کی ضرورت ہو جو ابھی تک Python ہیلپر نہیں ہے۔

|تعلیم کا خاندان |Python سطح |
| --- | --- |
|رجسٹر | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` جنیسس / بوٹ اسٹریپ ٹولنگ کے لئے مخصوص ہے |
|رجسٹریشن منسوخ کریں |`unregister_trigger`؛ استعمال کریں `Instruction.from_json` دیگر متغیرات کے لیے |
|مینٹ/برن |`mint_asset_numeric` ، `burn_asset_numeric`، `mint_trigger_repetitions`، `burn_trigger_repetitions`|
|منتقلی | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|میٹا ڈیٹا اور کنٹرولز | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
|RWA زندگی کی مدت | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
|ExecuteTrigger |`execute_trigger` |
|ریپو / آبادکاری کی توسیع | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|مقامی اثاثوں کے تالے | `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, پلس کلائنٹ `*_and_wait` مدد گار |
|گرانٹ / منسوخی ، SetParameter لاگ ، کسٹم ، اپ گریڈ ، اور کم عام رجسٹر / غیر رجسٹر شدہ متغیرات |`Instruction.from_json` یا `TransactionBuilder.add_instruction_json` کے ساتھ کینونیکل `InstructionBox` JSON |

اسکریو طرز کی مشروط ادائیگیوں کے لئے، دیکھیں [Native Asset Escrow](/ur/blockchain/escrow.md#python-asset-locks). Python فی الحال عام اثاثوں کے تالے کے لئے فرسٹ کلاس ہیلپرز کو بے نقاب کرتا ہے۔ مارکیٹ پلیس اور گمنام اسکریو ہیلپر ابھی تک فرسٹ کلاس Python طریقوں نہیں ہیں۔

### ڈومینز قائم کریں، پھر اکاؤنٹس اور اثاثے رجسٹر کریں۔ {#set-up-domains-then-register-accounts-and-assets}

عام ڈومین تخلیق اعلاناتی عرفی منصوبہ ساز کے ذریعے جاتا ہے تاکہ SNS کرایہ ، مالک کی صلاحیتوں ، کوٹ گارڈ ، اور ڈومین اسٹیٹ کو ایک ساتھ چیک کیا جائے۔ اپنی SDK یا آن بورڈنگ سروس کے ساتھ خفیہ طور پر مفت `AliasSetupPlanRequestV1` نیت بنائیں ، پھر `iroha app alias setup plan` اور `iroha app alias setup apply` استعمال کریں۔ کسی ایپلی کیشن ٹرانزیکشن سے `Instruction.register_domain` جمع نہ کرو؛ یہ بلڈر جینیس / بوٹ اسٹرپ ٹولنگ کے لئے باقی ہے۔

ڈومین سیٹ اپ پلان کے بعد ، ڈومین کی ملکیت والے اشیاء کو رجسٹر کریں۔ Taira جیسے مشترکہ نیٹ ورک پر ، آپ کو مختص کردہ ڈومین اور اکاؤنٹ ناموں کی جگہ استعمال کریں.

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

`mintable` قبول کرتا ہے `Infinitely`, `Once`, `Not`, یا `Limited(n)` اعداد و شمار کے ماڈل کی طرف سے قبول کردہ اقدار. `scale` ایک غیر محدود عددی اثاثہ کے لئے.

### مائنٹ، برن اور ٹرانسفر اثاثے {#mint-burn-and-transfer-assets}

ان کالز میں ایک موجودہ اثاثہ ID استعمال کیا جاتا ہے۔ پہلے اثاثہ کی تعریف درج کریں، پھر اس کے مالک اکاؤنٹ کے لئے ٹھوس اثاثے ID بنائیں.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### منتقلی کی ملکیت {#transfer-ownership}

ملکیت کی منتقلی تبدیلی جو ڈومین، اثاثہ تعریف، یا NFT کو کنٹرول کرتا ہے. موجودہ مالک کے طور پر ٹرانزیکشن اتھارٹی استعمال کریں.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### میٹا ڈیٹا مرتب کریں اور ہٹائیں {#set-and-remove-metadata}

میٹا ڈیٹا کی اقدار JSON-serializable ہونا چاہئے۔ جب آپ `TransactionDraft` کا استعمال کرتے ہیں تو ، `TransactionConfig` میں اختیار ڈیفالٹ ہدف اکاؤنٹ بن جاتا ہے۔

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

اعلی سطح کے مسودہ معاون کو ڈیفالٹ کے طور پر ٹرانزیکشن اتھارٹی کا ہدف بنایا گیا ہے۔

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### حقیقی دنیا کے اثاثے {#real-world-assets}

RWA اسسٹنٹس اثاثہ مخصوص میٹا ڈیٹا ، اصل اور کنٹرولر پالیسی کے لئے JSON سیریل قابل استعمال پیئڈ لوڈز کا استعمال کرتے ہیں۔ `register_rwa` ایک `id` یا `owner` قبول نہیں کرتا: رن ٹائم `RwaId` پیدا کرتا ہے ، اور لین دین کا اختیار ابتدائی مالک بن جاتا ہے۔

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

رجسٹریشن ٹرانزیکشن کے بعد، پیدا کردہ ID کو دریافت کرنے کے لئے استعمال کریں `FindRwas`، `/v1/rwas`، ایک RWA واقعہ، یا تلاش کنندہ روٹ مقرر:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

اگلی کارروائیوں میں پیدا ہونے والی `hash$domain` ID کا استعمال کیا جاتا ہے:

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

موجودہ پارٹ پر مکمل منتقلیاں `owned_by` تبدیل ہوسکتی ہیں۔ جزوی منتقلی اور مرکبات سے پیدا ہونے والے بچے کے پارٹ پیدا ہوتے ہیں.

### ٹرگرز {#triggers}

ٹرگر رجسٹریشن ہیلپرز کا استعمال کریں جب ایگزیکٹو ایک اور ہدایات کی ترتیب ہو:

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

Torii ٹرگر انوینٹری کے لئے REST اسسٹنٹ کو بھی بے نقاب کرتا ہے:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

ٹرگر انوینٹری کالز صرف ٹرگر ریکارڈز کو پڑھیں یا معائنہ کریں۔ رجسٹریشن ، عملدرآمد ، بار بار تبدیلیاں اور غیر رجسٹریشن متحرک کارروائی ہیں۔

### واپسی اور تصفیہ کے لئے ہدایات {#repo-and-settlement-instructions}

ریپو اور دوطرفہ حل کرنے والے معاونین Norito دستی کاری کے بغیر ڈومین مخصوص ہدایات کی قسمیں شامل کرتے ہیں:

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

### JSON فرار ہچ {#json-escape-hatch}

جب ایک Python مددگار ابھی تک دستیاب نہیں ہے، فیڈ کینونیکل ڈیٹا ماڈل `InstructionBox` JSON میں `Instruction.from_json` یا براہ راست `TransactionBuilder.add_instruction_json`. یہ راستہ تجویز کیا جاتا ہے `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, ہم مرتبہ / کردار/NFT رجسٹریشن، اور غیر ٹرگر غیر رجسٹر متغیرات جب تک کہ ان مددگاروں کو ٹائپ نہیں کیا جاتا ہے.

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

پیداوار یا غیر شفاف ہدایات کے لئے، فکسچر کو ذخیرہ کرنے سے پہلے JSON کے ذریعے واپسی کا سفر:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## ٹرانزیکشن ورک فلو {#transaction-workflows}

دستخط کرنے سے پہلے متعدد ہدایات بنانے والی ایپلی کیشنز کے لئے `TransactionDraft` کا استعمال کریں۔ ایک مسودہ آپ کو ٹرانزیکشن لیول کی ترتیبات جیسے `ttl_ms` ، `nonce`، اور میٹا ڈیٹا کو ایک ہی جگہ میں رکھنے دیتا ہے ، پھر ایک بار دستخط کریں:

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

جائزہ لینے، آڈٹ کرنے یا بٹوے منتقل کرنے کے لئے ایک تعیناتی دستاویز برآمد کریں:

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

جب ٹارگٹ لین کو اس کی ضرورت ہو تو دستخط کرنے سے پہلے ایک لین پرائیویسی ثبوت منسلک کریں:

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

## سوالات {#queries}

ٹائپ کردہ استفسار مددگار خام JSON لغات کی بجائے ڈیٹا کلاسز واپس کرتے ہیں۔ یہ شروع کرنے کا سب سے آسان طریقہ ہے کیونکہ SDK آپ کے لئے صفحہ بندی اور عام ریکارڈ فیلڈز کو تجزیہ کرتا ہے:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

جب Torii اختتامی نقطہ پر ابھی تک ٹائپ شدہ لفافہ نہ ہو تو عام درخواست کے مددگار استعمال کریں:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

اکاؤنٹ انوینٹری ہیلپرز کو SDK کے نورمالائزر کی طرف سے قبول کردہ اکاؤنٹ شناخت کرنے کی ضرورت ہے۔ کینونیکل I105 اکاؤنٹ IDs یا آن چین عرفان کا استعمال کریں۔ اگر بلاک ایکسپلورر یا خام اینڈ پوائنٹ ID واپس کرتا ہے جو SDK مسترد کرتا ہے تو ، ان مددگاروں کو فون کرنے سے پہلے اسے ایک کینونیکل اکاؤنٹ ID میں حل کریں۔

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## واقعات {#events}

اسٹریمنگ ہیلپرز ڈیفالٹ کے طور پر JSON پے لوڈ کو ڈیکوڈ کرتے ہیں۔ جب آپ کو SSE ایونٹ کا نام ، ID ، دوبارہ کوشش کرنے کی اشارہ اور خام پیلوڈ کی ضرورت ہو تو `with_metadata=True` پاس کریں۔ تازہ ترین ایونٹ کی شناخت برقرار رکھنے کے لئے `EventCursor` کے ساتھ سلسلہ بندی کریں. یہ مثالیں براہ راست واقعات کے لئے انتظار کر رہے ہیں، لہذا ان کو ایک نوڈ کے خلاف چلائیں جہاں متعلقہ واقعہ سلسلہ فعال اور فعال ہے.

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

## چابیاں اور پتے {#keys-and-addresses}

SDK مقامی دستخط کرنے والے ہیلپرز کو ہر دستخط الگورتھم کے لئے ظاہر کرتا ہے جو مقامی توسیع میں مرتب کیا گیا ہے۔ یہ مددگار Taira پر کال نہیں کرتے ہیں ، لیکن انہیں مقامی توسیعی کی ضرورت ہوتی ہے:

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

استعمال `supported_crypto_algorithms()` آپ کے پہیے کی حمایت کرتا ہے کیا دیکھنے کے لئے. عام معاونین canonical الگورتھم لیبلز کا استعمال کرتے ہیں اور Ed25519 کے لئے کام کرتے ہیں، secp256k1، ML-DSA, GOST, BLS, اور SM2 جب یہ الگورتھم درج ذیل میں مرتب کیے جاتے ہیں:

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

### چینی SM خفیہ کاری {#chinese-sm-cryptography}

Python SDK عام SM2 ہیلپرز اور SM2 مخصوص سہولت کے مددگار دونوں کو بے نقاب کرتا ہے۔ ہدف نیٹ ورک کی طرف سے متوقع SM2 ممتاز شناخت کنندہ کا انتخاب کرنے کے لئے نوڈ صلاحیت اشتہار کا استعمال کریں:

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

`crypto.sm.enabled` آپ کو بتاتا ہے کہ آیا نوڈ اپنی موجودہ پالیسی میں SM فیملی الگورتھموں کو قبول کرتا ہے۔ اسی اشتہار میں SM ہیش پالیسی اور رفتار کی حیثیت شامل ہے ، جو اس بات کا فیصلہ کرنے کے لئے مفید ہے کہ آیا SM2 مخصوص بہاؤ کو قابل بنانا ہے یا نہیں۔

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

پبلک Taira نے چیک کے دوران SM صلاحیت اشتہار کو بے نقاب کیا ، لیکن وہاں SM دستخط غیر فعال کردیا گیا تھا۔ اس کے اشتہارات میں دستخط کرنے والے الگورتھم تھے `ed25519` ، `secp256k1` ، اور `bls_normal` ، لہذا SM2 پر دستخط شدہ ٹرانزیکشنز کو اس تعیناتی کے لئے پیش نہ کریں جب تک کہ صلاحیت کا فائدہ مند بوجھ تبدیل نہ ہو۔

### GOST اور پوسٹ کوانٹم چابیاں {#gost-and-post-quantum-keys}

GOST R 34.10-2012 پیرامیٹر سیٹوں اور ML-DSA (`ml-dsa`) پوسٹ کوانٹم دستخطوں کے لئے عمومی کریپٹو API کا استعمال کریں۔ ایک ہی کلیدی جوڑی آبجیکٹ دستخط ، تصدیق اور ملٹی ہیش برآمد کو سنبھالتا ہے۔:

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

گیٹ GOST اور نوڈ کے اشتہار کردہ دستخط کرنے والے الگورتھم پر پوسٹ کوانٹم بہاؤ۔ فارورڈ ہم آہنگ الگورتھمز ناموں کے لئے خام صلاحیت کا استعمال کریں:

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

اگر ایک نوڈ آپ کی ضرورت کے الگورتھم کو اشتہار نہیں دیتا ہے تو، صرف مقامی یا آف لائن ورک فلو کے لئے کلید کا استعمال کریں. اس الگورتھمز کے ساتھ دستخط شدہ ٹرانزیکشنز کو اس نوڈ میں جمع نہ کرو. پبلک Taira چیک کے دوران ، GOST اور ML-DSA SDK اپ اسٹریم Python لائبریری میں کریپٹو ہیلپرز کے طور پر دستیاب تھے لیکن ٹرانزیکشن دستخط کرنے کے لئے نوڈ کی طرف سے اشتہار نہیں دیا گیا تھا۔

## ترتیب سے واقف کلائنٹ تخلیق {#config-aware-client-creation}

`resolve_torii_client_config` کا استعمال کریں جب آپ کی درخواست فائل سے نوڈ ترتیبات پڑھتی ہے لیکن پھر بھی ماحول یا ٹیسٹ کے مخصوص اوورریڈز کی ضرورت ہوتی ہے۔

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

## کگیموشا کی تیاری {#kagemusha-readiness}

Python SDK اس کے عمومی Torii درخواست کی مدد سے موجودہ JSON تیاری کا راستہ پوچھ سکتا ہے:

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

Python ٹائپ شدہ Kagemusha بھرنے یا بازیابی آرکائیو بلڈرز کو بے نقاب نہیں کرتا ہے۔ کینیکل V4 آرکائیوز کی تعمیر کے لئے ٹائپ کردہ Swift یا JVM پرس کا استعمال کریں ، پھر ایک معاون Kagemusha Torii کلائنٹ کے ذریعہ ان کو جمع کروانا اور سروے کرنا۔

## رکنیتیں {#subscriptions}

سبسکرپشن ہیلپرز مشترکہ Torii کلائنٹ سے ورثے میں تبدیل سروس کالز ہیں جو `iroha_python.ToriiClient` کے ذریعہ استعمال کی جاتی ہیں۔ آپ کو نشانہ بنانے والے نیٹ ورک پر موجود IDs اور اثاثوں کا استعمال کریں۔

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

## رابطہ کریں {#connect}

URIs کنیکٹ کی تعمیر اور تجزیہ کریں، اور Taira کے ذریعہ سامنے آنے والے عوامی کنیکٹ کی حیثیت کو پڑھیں:

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

فریم کوڈیکس ، سیشن کلید سے اخذ ، اور سیشن تخلیق کے لئے مقامی توسیع اور ایک فعال کنیکٹ سیشن روٹ کی ضرورت ہوتی ہے:

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

اسٹیٹ سیشن کے ساتھ پوسٹ منظوری کے پیغامات کو خفیہ کریں:

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

## گورننس، رن ٹائم، اور ایڈمن سرفیس {#governance-runtime-and-admin-surfaces}

یہ صرف پڑھنے والے کالز کامیابی سے عوامی Taira کے خلاف واپس کی گئیں:

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

رن ٹائم اپ گریڈ ہیلپرز رن ٹائمز اپ گریڈ API کے ذریعہ استعمال ہونے والی مانیٹری شکل کو قبول کرتے ہیں۔ یہ آپریٹر کی کارروائییں ہیں ، لہذا انہیں صرف ایک نوڈ کے خلاف استعمال کریں جہاں آپ کا اکاؤنٹ اور ٹوکن مجاز ہے:

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

## حیثیت، اتفاق رائے، اور نیٹ ورک ٹیلی میٹری {#status-consensus-and-network-telemetry}

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

## SoraFS،UAID، اور Kaigi مدد کرنے والے {#sorafs-uaid-and-kaigi-helpers}

یہ مددگار دستیاب ہیں جب ہدف نوڈ متعلقہ Nexus/SORA اختتامی پوائنٹس کو بے نقاب کرتا ہے۔ خالی فہرستوں کو ایک درست جواب کے طور پر علاج کریں: عوامی Taira میں نمونہ مانیٹر یا UAID کے لئے ڈیٹا کے بغیر روٹ فعال ہوسکتی ہے.

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

## Norito RPC اور GPU مددگار {#norito-rpc-and-gpu-helpers}

`NoritoRpcClient` کا استعمال کریں جب آپ کے پاس پہلے سے ہی Norito بائٹس ہوں اور آپ کو بائنری Torii اختتام پوائنٹ پر کال کرنے کی ضرورت ہو۔ مثال میں پچھلے ٹرانزیکشن ٹیمپلیٹ سے دستخط شدہ لفافہ کی ضرورت ہے۔:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

CUDA ہیلپرز `None` واپس کرتے ہیں جب بیک اینڈ دستیاب نہیں ہوتا ہے، لہذا ایپلی کیشنز اسکالر نفاذ میں واپس جا سکتے ہیں:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## موجودہ کوریج {#current-coverage}

Python SDK میں پہلے سے ہی اس کے لئے مددگار شامل ہیں:

- Torii جمع کرانے، حالت، استفسار اور ایڈمن فلو
- عام ISI اور ڈومین مخصوص توسیع کے لئے ٹائپ کردہ ہدایات کی تعمیر
- ٹرانزیکشن کے مسودے، دستاویزات، دستخط اور دستخط شدہ ٹرانزیکtion envelope workflows
- سٹریمنگ واقعات، فلٹرز اور دوبارہ شروع کرنے والے کرسرز
- عام Kagemusha تیاری تک رسائی اور Torii سبسکرائب معاونین؛ ٹائپ اپ اور ریڈیمنٹ بلڈرز کو بے نقاب نہیں کیا جاتا ہے
- اکاؤنٹ ایڈریس، تمام الگورتھم دستخط کرنے کے مددگاروں، کثیر ہیش دورے، SM2, GOST, ML-DSA, BLS, اور خفیہ کلیدی ہینڈلنگ
- URIs سے رابطہ کریں، سیشنز، فریم، خفیہ کاری کے مددگار اور رجسٹری ایڈمن
- گورننس ، رن ٹائم اپ گریڈ ، Sumeragi ، نوڈ ایڈمن ، SoraFS ، UAID ، اور Kaigi اینڈ پوائنٹ لفافے جہاں نوڈ ان خصوصیات کو بے نقاب کرتا ہے۔

## اپ اسٹریم ریفرنسز {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

ان فائلوں کے لئے سچائی کا ذریعہ ہیں Python سطح میں pinned کام کی جگہ نظر ثانی.
