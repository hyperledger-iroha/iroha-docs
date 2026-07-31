---
translation_locale: ar
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

(الـ) Python SDK في مساحة العمل الصاعدة هي: `iroha-python`. الأول Iroha 3 الإفراج عن الأهداف الحالية Torii و Norito السطحات. ضبط نسخة الحزمة أو مراجعة المصدر المستخدمة من خلال دمجك بحيث SDK والعقدة تبقى على نفس إصدار الشبكة.

تم التحقق من أمثلة القراءة فقط أدناه مقابل العموم Taira في `https://taira.sora.org`. الأمثلة المتحولة هي نماذج المعاملات: تتطلب سلطة حقيقية Taira، مفتاح خاص، بيانات غاز، وأي رموز عامل مطلوبة عن طريق الهدف قبل أن يتم تقديمها. .

استخدم الأمثلة في هذا الترتيب:

|المرحلة| ركضوا ضد الجمهور Taira? |ما تحتاجه|
| --- | --- | --- |
|مكالمات العملاء القراءة فقط |نعم .|Python حزمة بالإضافة إلى وصول الشبكة |
|المهندسين المحليين للتوقيعات والتعليمات |لا يوجد مكالمة شبكة حتى `submit()` |التوسع الأصلي و المواد الرئيسية الخاصة بك|
|تحويل المعاملات والمكالمات الخدمية |فقط من خلال حسابك الممول|حساب السلطة، مفتاح خاص، سلسلة ID ، البيانات المعدنية عن الرسوم، رصيد أصول الرسوم والرموز الروتين |
|قم بتوصيل كوديكات الإطار والكريبتو و GPU المساعدين|محلية فقط|التوسع الأصلي؛ GPU المساعدين يحتاجون أيضاً إلى مؤخرة قادرة على CUDA |

## التثبيت {#install}

اسم البيانات المعدنية الحزمة هو `iroha-python`. لا نفترض أن تثبيتًا غير مدفوعًا PyPI يطابق شبكة Taira الحية. قم بتثبيت عجلة أو عملية التحقق من المصدر التي تم بناؤها من نفس إصدار أسفل التيار أهدافك التكامل:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

إذا كان مشروعك يستغرق مساحة العمل في الأعلى مباشرة، قم بتثبيت Python التبعيات وبناء التوسع الأصلي قبل تشغيل أمثلة التي تستخدم `Instruction`, `TransactionDraft`, التوقيع، الرقمية، SoraFS المساعدين الأصليين GPU المساعدين، أو كوديكات الإطار Connect. استخدم أمر البناء من التيار `python/iroha_python/README.md`, ثم التحقق من أن الصادرات الأصلية تحميل:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

إذا فشلت `create_torii_client` في الاستيراد ولكن `Instruction` أو `generate_ed25519_keypair`، فإن حزمة Python النقية متاحة لكن التوسع الأصلي ليس كذلك.

## بداية سريعة {#quickstart}

البدء من نقاط نهاية Taira العامة، القراءة فقط:

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

## الإعداد المشترك {#shared-setup}

استخدم هذا الإعداد للقوالب المتحولة. استبدل كل صاحب مكان بسلطة Taira ، مفتاح خاص، رمز، وأصول / حساب IDs من الانتشار الخاص بك قبل تقديمها.

`authority` هو الحساب الذي يوقع على المعاملة. يجب أن يطابق `private_key` ذلك الحساب، ويجب أن يطابقت `CHAIN_ID` الشبكة المستهدفة، ويتعين أن يتضمن `TX_METADATA` حقل الرسوم المتوقعة من قبل الشبكة. فإن أصحاب المواقع أدناه غير صالحين عمداً لذلك لا يتم تقديمهم عن طريق الخطأ.

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

`Instruction.*` تدعو فقط إلى تحميلات تعليمات البناء. `submit()` هي النقطة التي يوقع فيها SDK المعاملة، وإرسالها إلى Torii، والانتظار للحصول على حالة.

## الرسوم والغاز {#fees-and-gas}

تحتاج المعاملات المكتوبة إلى بيانات metadata الرسوم وميزان أصول الرسوم الممولة. في Taira، يتم تمويل الأصل الرسوم من قبل الصنبور العام ويجب أن تتضمن البيانات الوصفية للمعاملة `gas_asset_id`. في Minamoto، يتم دفع الرسوم بواقع XOR ويتمثل الأصل ID من تكوين تلك الشبكة .

تتمثل البيانات المعدنية الرسومية في المعاملة، وليس على تعليمات فردية. يرفق المساعد `submit()` أعلاه `TX_METADATA` لكل معاملة يقوم بإنشائها:

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

قبل إرسال الرسائل، تأكد من أن حساب السلطة يمتلك ما يكفي من أصول الرسوم. الصنبور الدقيق والأصل ID هو محدد للشبكة؛ هذا هو شكل Taira:

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

يعيد الصنبور الخرسانة `asset_id` لاستخدامها للتحقق من الميزان. يستخدم حقل البيانات الأساسية `gas_asset_id` تعريف أصول الرسوم ID.

الحفاظ على بيانات البيانات التطبيقية منفصلة عن بيانات الرسوم عن طريق دمج الخرائط عند بناء المعاملة:

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

إذا غفلت عن بيانات الرسوم، أو استخدمت أصول الرسوم الخاطئة، أو وقعت مع حساب غير ممول، يجب أن ترفض الشبكة الحقيقية المعاملة حتى لو كان حمولة التعليمات صالحة خلاف ذلك.

## Taira - المكالمات التي يتم التحقق منها من قراءة فقط {#taira-checked-read-only-calls}

ردت هذه المكالمات بنجاح ضد الجمهور Taira:

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

لم تكن الطرق مثل `/v1/status` ، وتسجيل النظراء العامة، واختبار العينات Sumeragi RBC، والصور الفورية لإدارة العقد، وإدارة سجل تطبيق Connect متاحة للجمهور على Taira خلال التحقق. استخدم `request_json("GET", "/status")` للحمل المفيد لحالة عقدة عامة على Taira .

## التعليمات للمبنيين {#instruction-builders}

يعرض SDK صانعي النمط لأكثر عائلات التعليمات شيوعًا ومقبض الهروب JSON للخيارات التي ليست بعد طرق Python من الدرجة الأولى. المقطوعات التالية هي نماذج المعاملات المتغيرة ولم يتم تقديمها إلى الجمهور Taira دون حساب توقيع.

تفضل المساعدات المكتوبة عندما تكون موجودة: فإنها تطبيع قيم Python وتفشل في وقت مبكر على الأشكال غير صالحة. استخدم `Instruction.from_json` فقط عندما تحتاج إلى متغير التعليمات التي لا تحتوي على مساعدة Python بعد.

|عائلة التعليمات |Python سطح |
| --- | --- |
|التسجيل| `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` يحتوي على أدوات جينيسس/بوستراب |
|إلغاء التسجيل|`unregister_trigger`؛ استخدام `Instruction.from_json` للاختلافات الأخرى |
|النعناع / الحرق |`mint_asset_numeric`، `burn_asset_numeric`، `mint_trigger_repetitions`، `burn_trigger_repetitions` |
|النقل| `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|البيانات الأساسية والتحكم | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
|RWA دورة حياة| `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
|ExecuteTrigger |`execute_trigger` |
|تمديدات الإستثمار / الاستيطان | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|قفل الأصول الأصلية | `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, بالإضافة إلى العميل `*_and_wait` المساعدين |
|الإعانة/إلغاء التسجيل، SetParameter السجل والعملية، الترقية، والخيارات الأقل شيوعًا للتسجيل / عدم التسجيل | `Instruction.from_json` أو `TransactionBuilder.add_instruction_json` مع القنونية `InstructionBox` JSON |

للحصول على المدفوعات الشروطية في نمط الاحتفاظ، انظر [ الأصول الطبيعية الاستحواذ](/ar/blockchain/escrow.md#python-asset-locks). Python يعرض حاليًا المساعدين من الدرجة الأولى لقفل الأصول العامة. السوق ومساعدين الاحتفاض المجهولين ليسوا بعد أساليب الدرجة الأولة Python.

### إقامة النطاقات، ثم تسجيل الحسابات والأصول {#set-up-domains-then-register-accounts-and-assets}

يمر إنشاء النطاقات العادية من خلال مخطط الاسم الخارجي الإعلاني بحيث يتم التحقق من عقد الإيجار SNS ، وقدرات المالك ، وحماية الاقتباسات ، وحالة النطاق. قم بإنشاء نية خالية من السرية `AliasSetupPlanRequestV1` مع SDK أو خدمة الإدخال الخاصة بك ، ثم استخدم `iroha app alias setup plan` و `iroha app alias setup apply`. لا تقدم `Instruction.register_domain` من معاملة التطبيق ؛ يبقى هذا البناء للأدوات genesis / bootstrap.

بعد التزام خطة إعداد النطاق ، قم بتسجيل الأشياء المملوكة للنطاق. في شبكة مشتركة مثل Taira ، استخدم مساحة أسماء النطاق والحساب المخصصة لك.

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

`mintable` تقبل `Infinitely`, `Once`, `Not`, أو `Limited(n)` القيم المقبولة من قبل نموذج البيانات. `scale` لأصول رقمية غير مقيدة.

### أصول النقود والحرق ونقلها {#mint-burn-and-transfer-assets}

هذه المكالمات تستخدم أصل موجود ID. سجل تعريف الأصول أولاً، ثم قم ببناء الأصل الملموس ID للحساب الذي يملك الأصل.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### تمرير الملكية {#transfer-ownership}

تحويلات الملكية تغيير من يسيطر على النطاق، تعريف الأصول، أو NFT. استخدام المالك الحالي كسلطة المعاملة.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### إعداد وإزالة البيانات المعدنية {#set-and-remove-metadata}

يجب أن تكون قيم البيانات الأساسية JSON قابلة للتسلسل. عندما تستخدم `TransactionDraft`، تصبح السلطة في `TransactionConfig` حساب الهدف الافتراضي.

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

مسودة المساعد على المستوى العالي تستهدف السلطة المعاملة بشكل افتراضي:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### الأصول في العالم الحقيقي {#real-world-assets}

RWA المساعدون استخدام JSON- الحملات المفيدة التي يمكن تشغيلها لتحقيق البيانات الأساسية الخاصة بالأصول، والمصدر والسياسة للمراقب. `register_rwa` لا تقبل `id` أو `owner`: وقت التشغيل يخلق `RwaId`, وأصبح سلطة المعاملة المالك الأولي.

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

بعد الالتزام بعملية التسجيل، استخدم `FindRwas` ، `/v1/rwas` ، حدث RWA ، أو مسار المستكشف المحدد لاكتشاف الناتج من ID:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

العمليات اللاحقة تستخدم `hash$domain` ID المولد:

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

التحويلات الكاملة يمكن أن تتغير `owned_by` على الحصيلة القائمة. التحويلات الجزئية والاندماج تخلق حصيل الأطفال المولودة.

### المحفزات {#triggers}

استخدم مساعدات تسجيل التشغيل عندما يكون جهاز التنفيذية تسلسل تعليمات آخر:

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

Torii يعرض أيضاً مساعدي REST للكشف عن المخزون:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

مكالمات مخزون محفز فقط قراءة أو تفتيش سجلات المحفز التسجيل والتنفيذ والتغييرات المتكررة، وعدم التسجيل هي عمليات طفر.

### إرشادات الإرسال والتسوية {#repo-and-settlement-instructions}

يضيف المساعدون في التسوية الثنائية والإعلامات المتعلقة بالمنطقة الاختيارات التعليمية المحددة دون صناعة Norito

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

### JSON خلية الهروب {#json-escape-hatch}

عندما Python المساعد لا يتوفر بعد، تغذية النموذج البيانات القنوني `InstructionBox` JSON إلى `Instruction.from_json` أو مباشرة إلى `TransactionBuilder.add_instruction_json`. هذا هو الطريق الموصى به `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, الأقران / الدور NFT التسجيل، والفوارق غير المحفزة لا تسجيل حتى يتم كتابة هذه المساعدات.

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

للتعليمات المولدة أو غير الشفافة، رحلة ذهابًا وإيابًا عبر JSON قبل تخزين الأجهزة:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## تدفقات العمل المعاملة {#transaction-workflows}

استخدم `TransactionDraft` للتطبيقات التي تقوم ببناء تعليمات متعددة قبل التوقيع. مسودة تسمح لك بالحفاظ على إعدادات مستوى المعاملة مثل `ttl_ms` ، `nonce` ، والمعادن في مكان واحد ، ثم توقع مرة واحدة:

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

تصدير مذكرة تحديدية للمراجعة أو التدقيق أو إرسال المحفظة:

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

إرفاق دليل على خصوصية المسار قبل التوقيع عندما يتطلب ذلك مسار الهدف:

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

## الأسئلة {#queries}

مساعدات الاستفسار المكتوبة تعيد فئات البيانات بدلاً من قاموس JSON الخام. إنها أسهل طريقة للبدء لأن SDK يحلل صفحة الصفحات وحقول السجلات الشائعة بالنسبة لك:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

استخدم مساعدة الطلبات العامة عندما لا يحتوي نقطة نهاية Torii على غلاف مكتوب بعد:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

المساعدون في تخزين الحسابات يحتاجون إلى معرف للحساب المقبول من قبل معايير SDK. استخدموا حساب I105 القنوني IDs أو أسماء مستعار على السلسلة. إذا كان مستكشف الكتل أو نقطة النهاية الخام يعيد ID التي ترفضها SDK، قم بتحليلها إلى حساب قائدي ID قبل الاتصال بهذه المساعدين:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## الأحداث {#events}

المساعدون في التدفق يقومون بتشخيص الحملات المفيدة JSON بشكل افتراضي. مرسلوا `with_metadata=True` عندما تحتاج إلى اسم حدث SSE ، و id ، وتلميح إعادة المحاولة ، والحملة المفيدة الخامة. تنزلق سلسلات مع `EventCursor` للحفاظ على آخر عنوان الحدث. هذه الأمثلة تنتظر الأحداث الحية ، لذلك قم بتشغيلها ضد عقد حيث يتم تشغيل وتفعيل تدفق الأحداث المقابلة.

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

## المفاتيح والعناوين {#keys-and-addresses}

يعرض SDK مساعدة توقيع محلية لكل خوارزمية توقيع مرتبة في التوسع الأصلي. هذه المساعدات لا تدعو Taira ، لكنها تحتاج إلى التوسع الأساسي: .

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

استخدم `supported_crypto_algorithms()` لمعرفة ما يدعم عجلةك. يستخدم المساعدات العامة علامات الخوارزمية القنونية ويعمل على Ed25519, secp256k1, ML-DSA, GOST, BLS، و SM2 عندما يتم تجميع هذه الخوارزميات في:

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

### الصينية SM التشفير {#chinese-sm-cryptography}

يعرض Python SDK كل من المساعدين العامين SM2 ومساعدين الراحة المحددين ل SM2. استخدم إعلان قدرة العقد لاختيار معرف التمييز SM2 المتوقع من قبل الشبكة المستهدفة:

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

`crypto.sm.enabled` يخبرك ما إذا كانت العقدة تقبل خوارزميات عائلة SM في سياستها الحالية. يشمل نفس الإعلان سياسة الهاش SM وحالة التسارع ، والتي هي مفيدة عند اتخاذ قرار بشأن إمكانية تمكين تدفقات محددة لـ SM2:

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

كشفت Taira العامة إعلان قدرات SM أثناء التحقق، ولكن تم تعطيل توقيع SM هناك. كانت خوارزميات توقيعها المعلنة هي `ed25519` ، `secp256k1` ، و `bls_normal` . لذلك لا تقدم المعاملات الموقعة على SM2 إلى ذلك النشر ما لم يتغير تحميل القدرة المفيدة.

### GOST ومفاتيح ما بعد الكم {#gost-and-post-quantum-keys}

استخدم العملة المشفرة العامة API لـ GOST R 34.10-2012 مجموعات المعلمات و ML-DSA (`ml-dsa`) التوقيعات ما بعد الكم. يقوم نفس كائن زوج المفاتيح بالتوقيع والتحقق والاستيراد متعدد الجهازات:

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

البوابة GOST وتدفقات ما بعد الكم على خوارزميات التوقيع التي يتم الإعلان عنها في العقد. استخدم حمولة القدرة الخام لتسجيل أسماء خوارزمية متوافقة إلى الأمام:

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

إذا كانت العقدة لا تعلن عن الخوارزمية التي تحتاج إليها، استخدم المفتاح فقط لأجليات العمل المحلية أو غير المحمولة. لا تقدم المعاملات الموقعة مع هذا الخوارزمية إلى تلك العقدة. Taira الشيك، GOST و ML-DSA كانت متاحة ك SDK مساعدي العملات الرقمية في التيار الأعلى Python المكتبة ولكن لم يتم الإعلان عنها من قبل العقد للتوقيع على المعاملة.

## إنشاء العميل المعرف على التكوين {#config-aware-client-creation}

استخدم `resolve_torii_client_config` عندما يقرأ تطبيقك إعدادات العقد من ملف ولكن لا يزال يحتاج إلى تغلبات محددة للبيئة أو اختبار:

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

## الاستعداد الكاغيموشا {#kagemusha-readiness}

Python SDK يمكن استفسار مسار الاستعداد الحالي JSON من خلال مساعد طلب عام Torii:

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

Python لا يعرض صانعي أرشيفات كاغيموشا المطبوعة أو الرداء. استخدم محفظة Swift أو JVM المطبقة لبناء الأرشيفات القنونية V4 ، ثم قم بإرسالها واختبارها من خلال عميل كاغيموسا المدعوم Torii.

## التسجيلات {#subscriptions}

مساعدي الاشتراك يتغيرون مكالمات الخدمة الموروثة من العميل المشترك Torii الذي يستخدمه `iroha_python.ToriiClient`. استخدم IDs والأصول الموجودة على الشبكة التي تستهدفها.

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

## التواصل {#connect}

بناء وتحليل اتصال URIs، وقراءة حالة الاتصال العامة المعروضة من قبل Taira:

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

تتطلب كوديكات الإطار، استنباط مفتاح الجلسة، وإنشاء الجلسة التوسع الأصلي ومسار جلسة Connect المثبت:

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

تشفير رسائل ما بعد الموافقة مع جلسة حالة:

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

## إدارة، وقت التشغيل، ومساحات الإدارة {#governance-runtime-and-admin-surfaces}

هذه المكالمات التي تُرد فقط للقراءة نجحت ضد الجمهور Taira:

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

تسلم مساعدات تحديث التشغيل الشكل المبين الذي يستخدمه تحديث الوقت التشغيلي API. إنها إجراءات المشغل ، لذلك استخدمها فقط ضد عقد حيث يتم تفويض حسابك وطوكين:

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

## الوضع والاتفاق وتلفاز الشبكة {#status-consensus-and-network-telemetry}

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

## SoraFS، UAID، و Kaigi المساعدين {#sorafs-uaid-and-kaigi-helpers}

هذه المساعدات متاحة عندما يعرض العقدة المستهدفة النقاط النهائية المقابلة Nexus/SORA. اعتبر القوائم الفارغة ردًا صالحًا: قد يتم تمكين الطريق العام في Taira دون بيانات لخطوط العينات أو UAID.

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

## Norito RPC و GPU المساعدين {#norito-rpc-and-gpu-helpers}

استخدم `NoritoRpcClient` عندما يكون لديك بالفعل Norito البايتات وتحتاج إلى استدعاء نقطة نهاية ثنائية Torii. يحتاج هذا المثال إلى غلاف موقّع من نموذج معاملة سابق:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

CUDA المساعدون يعيدون `None` عندما لا توجد نهاية الخلفية متاحة، بحيث يمكن أن تعود التطبيقات إلى تنفيذات واسعة النطاق:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## التغطية الحالية {#current-coverage}

Python SDK تضم بالفعل مساعدي:

- Torii الإرسال والحالة والاستفسارات وتدفقات الإدارة
- صانعي التعليمات المطبوعة للمزيد من ISI والإضافات الخاصة بالمنطقة.
- مسودات الصفقات، وإشعارات التوقيع وتوقيع عمليات تغطية الصفقات.
- الأحداث التدفقية والمرشحات والمؤشرات التي يمكن إعادة تشغيلها
- إمكانية الوصول إلى الكاغيموشا العامة والمساعدين في الاشتراك Torii؛ لا يتم تعريض المكونات المكتوبة لإعادة التكامل والمصممين على الفدية.
- عنوان الحساب، المساعدين التوقيع على الخوارزمية الكاملة، رحلات ذهاب وإياب متعددة الهش، SM2, GOST, ML-DSA, BLS, ومعاملة المفاتيح السرية
- ربط URIs ، الاجتماعات، الإطارات، مساعدي التشفير، وإدارة السجل
- الحوكمة، تحديث وقت التشغيل، Sumeragi، Node-admin، SoraFS، UAID، و Kaigi غلافات نقطة النهاية حيث يعرض العقد هذه الميزات

## الإشارات المتقدمة {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

هذه الملفات هي مصدر الحقيقة لسطح Python في مراجعة مساحة العمل المثبتة.
