---
translation_locale: ar
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Python {#python}

Python SDK في مساحة العمل العليا هو `iroha-python`. الإصدار الأول من Iroha 3 يستهدف السطوح الحالية Torii و Norito. قم بتثبيت إصدار الحزمة أو مراجعة المصدر المستخدمة في دمجك بحيث يظل SDK والعقدة على نفس إصدار تنسيق التسلسل.

الأمثلة المجهولة القراءة أدناه تستهدف الجمهور Taira في `https://taira.sora.org`. يمكن أن يكون المسار للقراءة فقط ومع ذلك يتطلب توقيع حساب موحد بحسب البروتوكول أو توقيع مشغل الشبكة الدقيق؛ تلك الأمثلة موسومة بشكل منفصل. الأمثلة المتغيرة هي قوالب معاملات وتتطلب وجود صاحب ترخيص حقيقي Taira، مفتاح خاص، نية دفع رسوم مكتوبة بنوع محدد، كمية كافية من XOR على شبكة الاختبار، والمصادقة المطلوبة من قبل المسار المستهدف قبل أن يمكن تقديمها.

استخدم الأمثلة بهذا الترتيب:

|مرحلة|الجري ضد الجمهور Taira؟|ما تحتاج|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| استدعاءات القراءة المجهولة | نعم | حزمة Python بالإضافة إلى الوصول إلى الشبكة |
|قراءات مصدّقة بواسطة الحساب أو المشغل|فقط بهويتك المعترف بها من قبلك|الضبط الدقيق Taira `NetworkId` والمفتاح المقابل للحساب أو المشغل|
|منشئو التوقيع والتعليمات المحلية|لا يوجد اتصال بالشبكة حتى `submit()`|الامتداد الأصلي ومواد المفتاح الخاصة بك|
|المعاملات التي تتحول واستدعاءات الخدمة|فقط باستخدام حسابك الممول الخاص|حساب الرئيس المخول، المفتاح الخاص، بالضبط Taira `NetworkId`، نية الرسوم المكتوبة، رصيد أصول الرسوم، ورموز المسار|
|ربط برامج ترميز الإطار والتشفير والمساعدين GPU|محلي فقط|امتداد أصلي؛ يحتاج المساعدون GPU أيضًا إلى خلفية قادرة على CUDA|

## تثبيت {#install}

اسم بيانات تعريف الحزمة هو `iroha-python`. لا تفترض أن تثبيت PyPI غير المحدد يتطابق مع شبكة Taira الحية. قم بتثبيت نسخة من ملف wheel أو نسخة من الشيفرة المصدرية تم إنشاؤها من نفس التحديث العلوي الذي تستهدفه تكاملاتك:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

إذا كان مشروعك يستهلك مساحة العمل العلوية مباشرة، فقم بتثبيت تبعيات Python وبناء الامتداد الأصلي قبل تشغيل الأمثلة التي تستخدم `Instruction`، `TransactionDraft`، التوقيع، التشفير، SoraFS المساعدون الأصليون، GPU المساعدون، أو برامج ترميز إطار Connect. استخدم أمر البناء من `python/iroha_python/README.md` الأصلي، ثم تحقق من تحميل الصادرات الأصلية:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

إذا كان `create_torii_client` يستورد ولكن `Instruction` أو `generate_ed25519_keypair` يفشل، فإن حزمة Python النقيّة متاحة ولكن الامتداد الأصلي غير موجود.

## البدء السريع {#quickstart}

ابدأ بالنقاط النهائية العامة للقراءة فقط Taira API:

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

## إعداد مشترك {#shared-setup}

استخدم هذا الإعداد للقوالب المتغيرة. استبدل كل عنصر نائب بمفتاح تفويض Taira، ومفتاح خاص، ورمز مميز، ومعرفات الأصول/الحسابات من نشرلتك قبل الإرسال.

`authority` هو الحساب الذي يوقع المعاملة و`private_key` يجب أن يطابقه. المعاملات ترتبط بـ Taira المستمد بدقة من النشأة `NetworkId`؛ سلسلة UUID هي علامة نشر، وليست هوية المعاملة. تستخدم الرسوم نية دفع مكتوبة وعرض سعر مباشر دقيق، بشكل مستقل عن بيانات تعريف التطبيق. أما أماكن الحساب والمفتاح أدناه فهي غير صالحة عن قصد حتى لا يتم تقديمها عن طريق الخطأ.

المعطى الحرفي أدناه هو هوية إنشاء البلوكشين المثبتة الحالية Taira. يمكن لإعادة ضبط شبكة الاختبار تغييرها، لذا قم بتحديثها من ملف النشر الموقع ولا تستنتجها أبدًا من السلسلة UUID.

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

`Instruction.*` يستدعي فقط تحميل تعليمات البناء. `submit()` هو النقطة التي يحصل فيها SDK على تقدير سعر الرسوم الحي، ويوقع على الحمولة الدقيقة المقتبسة، ويرسلها إلى Torii، وينتظر الحالة.

## الرسوم وتكاليف تنفيذ المعاملات {#fees-and-gas}

معاملات الكتابة تحتاج إلى `FeePaymentIntent` مكتوب ورصيد أصول رسوم ممول. على Taira، يقوم خدمة التمويل العامة للشبكة الاختبارية بتمويل XOR على الشبكة الاختبارية. يرسل Python SDK الثابت غير الموقع الحمولة إلى Torii للحصول على تقدير دقيق لسعر الرسوم، يتحقق من أن العرض لم يستبدل الدافع أو الحمولة، ويوقع على النية المقتبسة. لا تضع اختيار الرسوم في بيانات المعاملة الوصفية.

المساعد `submit()` أعلاه يبدأ بنية مدفوعة من حساب توقيع المعاملة والتي تكون حدود رسومها فارغة عمدًا. يقوم `quote_and_sign()` بملئها من العرض الحي قبل التوقيع:

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

قبل إرسال الكتابات، تأكد من أن الحساب الرئيسي المخول يمتلك ما يكفي من أصل الرسوم. خدمة التمويل الدقيقة لشبكة الاختبار ومعرّف الأصل خاصة بالشبكة؛ هذا هو الشكل Taira:

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

تعيد خدمة تمويل شبكة الاختبار معرّف `asset_id` الفعلي المستخدم للتحقق من الرصيد. تحقّق من أن عرض الرسوم المباشر يفرض `FEE_ASSET_DEFINITION`؛ فالمعاملة لا تحدد ذلك الأصل من خلال البيانات الوصفية.

بيانات وصف التطبيق اختيارية ولا تحمل أي دلالات رسوم:

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

إذا حذفت نية الرسوم، أو قبلت عرض رسوم لأصل غير متوقع، أو غيّرت الحمولة بعد تسعيرها، أو وقّعت بحساب غير ممول، فيجب ألا تُرسل المعاملة.

## مجهول Taira يقرأ {#anonymous-taira-reads}

تستخدم هذه الاستدعاءات مسارات Taira التي تسمح حدود فهرسها بعمليات قراءة مجهولة:

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

`/v1/time/status` وكل عرض بيانات لنقطة زمنية لمشغل `/v1/sumeragi/*` يتطلب توقيع مشغل شبكة دقيق حتى لو لم يقم بتغيير الحالة. استخدم `request_json("GET", "/status")` للنقطة المجهولة حمولة الحالة وإعداد المشغل أدناه للتوافق أو تشخيص ساعة العقدة المحلية. حالة جلسة الاتصال هي مسار بروتوكول منفصل وتتطلب رمز إدارة تلك الجلسة.

## مُنشئو التعليمات {#instruction-builders}

يكشف SDK عن منشئي الأنواع للعائلات الأكثر شيوعًا من التعليمات و JSON منفذ هروب للمتغيرات التي ليست بعد طرق Python من الدرجة الأولى. الشفرات التالية هي قوالب معاملات متغيرة ولم يتم تقديمها إلى Taira العامة بدون حساب توقيع.

فضل استخدام المساعدين المكتوبين عند وجودهم: فهم يقومون بتطبيع قيم Python ويفشلون مبكرًا عند الأشكال غير الصالحة. استخدم `Instruction.from_json` فقط عندما تحتاج إلى إصدار توجيهي لا يحتوي على مساعد Python بعد.

|عائلة التعليمات| Python سطح                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|تسجيل|`register_account`، `register_asset_definition_numeric`، `register_rwa`، `register_time_trigger`، `register_precommit_trigger`؛ `register_domain` مخصص لأدوات التأسيس/التمهيد|
|إلغاء التسجيل| `unregister_trigger`؛ استخدم `Instruction.from_json` للمتغيرات الأخرى|
| سك/حرق| `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions`|
|تحويل| `transfer_asset_numeric`، `transfer_domain`، `transfer_asset_definition`، `transfer_nft`، `transfer_rwa`، `force_transfer_rwa` |
|البيانات الوصفية والتحكمات| `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
| RWA دورة الحياة                                                                                  | `merge_rwas`، `redeem_rwa`، `freeze_rwa`، `unfreeze_rwa`، `hold_rwa`، `release_rwa`|
| ExecuteTrigger | `execute_trigger` |
|تمديدات المستودع/التسوية| `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp`|
|أقفال الأصول الأصلية| `open_asset_lock`، `drawdown_asset_lock`، `cancel_asset_lock`، `expire_asset_lock`، بالإضافة إلى مساعدين العميل `*_and_wait`|
|منح/سحب، SetParameter، سجل، مخصص، ترقية، وأنواع أقل شيوعًا للتسجيل/إلغاء التسجيل| `Instruction.from_json` أو `TransactionBuilder.add_instruction_json` مع بروتوكول واحد قياسي `InstructionBox` JSON |

لدفعات مشروطة بنمط الضمان، راجع [ضمان الأصل الأصلي](/ar/blockchain/escrow.md#python-asset-locks). Python يوفر حاليًا مساعدات من الدرجة الأولى لقفل الأصول العامة؛ مساعدات السوق وموفري الضمان المجهولين ليست من الدرجة الأولى بعد في Python.

### قم بإعداد النطاقات، ثم سجّل الحسابات والأصول {#set-up-domains-then-register-accounts-and-assets}

إنشاء النطاق العادي يمر عبر مخطط الأسماء المستعارة الإعلاني بحيث يتم فحص عقد الإيجار SNS وإمكانيات المالك وحارس التحقق من رسوم السعر وحالة النطاق معًا. أنشئ نية خالية من الأسرار `AliasSetupPlanRequestV1` باستخدام SDK أو خدمة الإعداد الخاصة بك، ثم استخدم `iroha app alias setup plan` و `iroha app alias setup apply`. لا تُقدّم `Instruction.register_domain` من معاملة التطبيق؛ يظل هذا المُنشئ لأدوات التمهيد/الأساس.

بعد الانتهاء من خطة إعداد النطاق، قم بتسجيل الكائنات المملوكة للنطاق. على شبكة مشتركة مثل Taira، استخدم نطاق واسم حساب مخصص لك.

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

`mintable` يقبل القيم `Infinitely`، `Once`، `Not`، أو `Limited(n)` المقبولة من قبل نموذج البيانات. اترك `scale` لأصل رقمي غير مقيد.

### إصدار، تدمير، ونقل الأصول {#mint-burn-and-transfer-assets}

تستخدم هذه الاستدعاءات معرّف أصل موجودًا. سجّل تعريف الأصل أولًا، ثم أنشئ معرّف الأصل الفعلي للحساب الذي يملك الأصل.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### نقل الملكية {#transfer-ownership}

تحويل الملكية يغير من يسيطر على النطاق أو تعريف الأصل أو NFT. استخدم المالك الحالي كالمفوض الأساسي للمعاملة.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### تعيين وإزالة البيانات الوصفية {#set-and-remove-metadata}

يجب أن تكون قيم البيانات الوصفية قابلة للتسلسل وفقًا لـ JSON. عند استخدام `TransactionDraft`، يصبح أصل التفويض في `TransactionConfig` هو حساب الهدف الافتراضي.

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

يستهدف مساعد المسودة على المستوى العالي مبدأ تفويض المعاملة بشكل افتراضي:

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

### الأصول الواقعية {#real-world-assets}

RWA يستخدم المساعدون بيانات JSON-القابلة للتسلسل للبيانات الوصفية الخاصة بالأصول، والأصل، وسياسة المتحكم. `register_rwa` لا يقبل `id` أو `owner`: يولّد بيئة تنفيذ البرنامج `RwaId`، ويصبح صاحب تفويض المعاملة المالِكَ الأولي.

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

بعد انتهاء عملية تسجيل المعاملة، استخدم `FindRwas`، `/v1/rwas`، حدث RWA، أو مسار المستكشف المحدد لاكتشاف المعرف الذي تم إنشاؤه:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

تستخدم العمليات اللاحقة المعرف `hash$domain` الناتج:

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

يمكن للتحويلات الكاملة تغيير `owned_by` على القطعة الحالية. التحويلات الجزئية والدمج تنشئ قطعًا فرعية مولدة.

### المحفزات {#triggers}

استخدم مساعدي تسجيل الزناد عندما يكون الملف القابل للتنفيذ تسلسلاً تعليمياً آخر:

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

Torii يكشف أيضًا عن مساعدي REST من أجل تفعيل المخزون:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

لا تفعل استدعاءات جرد المشغّلات سوى قراءة سجلات المشغّلات أو فحصها. أما التسجيل والتنفيذ وتغييرات التكرار وإلغاء التسجيل فهي عمليات تعدّل الحالة.

### تعليمات تسوية المعاملات المالية وإعادة التمويل {#repo-and-settlement-instructions}

تقوم أدوات المساعدة في المستودع وتسويات ثنائية الأطراف بإضافة نسخ تعليمات خاصة بالمجال دون صياغة يدوية لحمولات Norito:

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

### JSON فتحة الهروب {#json-escape-hatch}

عندما لا يتوفر مساعد Python، قم بإدخال نموذج بيانات بروتوكول واحد قياسي `InstructionBox` JSON في `Instruction.from_json`. هذا هو المسار الموصى به لـ `Grant`، `Revoke`، `SetParameter`، `Log`، `Custom`، `Upgrade`، تسجيل النظير/الدور/NFT، والمتغيرات غير المفعلّة لإلغاء التسجيل حتى يتم كتابة هؤلاء المساعدين.

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

احتفظ بمسار المسودة المكتوبة عند حدود المعاملة: فهو يحافظ على `NetworkId` الدقيقة، ونية دفع الرسوم، وثابت العرض قبل التوقيع. استخدام `TransactionBuilder` المباشر يتطلب نفس القيم بالإضافة إلى التحقق الصريح من عرض حي، لذا فهو ليس اختصارًا لكود التطبيق.

بالنسبة للتعليمات المُنشأة أو غير الواضحة، قم بالمرور المزدوج عبر JSON قبل تخزين منتجات الاختبار:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## سير العمل في المعاملات {#transaction-workflows}

استخدم `TransactionDraft` للتطبيقات التي تبني تعليمات متعددة قبل التوقيع. يتيح لك المسودة الاحتفاظ بإعدادات مستوى المعاملة مثل `ttl_ms` و `nonce` والبيانات الوصفية في مكان واحد، ثم التوقيع مرة واحدة:

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

تصدير بيان تقني حتمي للمراجعة أو التدقيق أو تسليم المحفظة:

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

أرفق إثبات خصوصية خط التنفيذ قبل التوقيع عندما يتطلب خط التنفيذ المستهدف ذلك:

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

## استفسارات {#queries}

تُرجع مساعدات الاستعلام الكتابي فئات بيانات بدلاً من القواميس الخام JSON. إنها أسهل طريقة للبدء لأن SDK يقوم بتحليل الترقيق وحقول السجلات الشائعة من أجلك:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

استخدم مساعدات الطلب العامة عندما لا يكون لدى نقطة نهاية Torii API محول برمجي نوعي بعد:

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

تتطلب المساعدات الخاصة بجرد الحساب معرف حساب يتم قبوله من قبل موحد SDK. استخدم معرفات حسابات I105 وفقًا للبروتوكول القياسي الفردي أو الأسماء المستعارة على السلسلة؛ إذا أعاد مستكشف الكتل أو نقطة نهاية API الخام معرفًا يرفضه SDK، فقم بحله إلى معرف حساب واحد وفقًا لمعايير البروتوكول قبل استدعاء هذه المساعدات:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## الأحداث {#events}

يقوم مساعدو البث بفك تشفير بيانات JSON بشكل افتراضي. استخدم `with_metadata=True` عندما تحتاج إلى اسم الحدث SSE، المعرف، تلميح إعادة المحاولة، والبيانات الأولية. مصدر واحد مطابق لمعيار البروتوكول `/v1/events/sse` هو للبث المباشر فقط: لا يصدر أي معرفات إعادة تشغيل ولا يحتفظ بسجل إعادة التشغيل، لذلك فإن هذه المساعدات لا تعرض أي مؤشر أو وسيط استئناف. يعيد الاتصال بدء اشتراك جديد وقد يكون هناك فجوة؛ استخدم `/v1/blocks/stream` من ارتفاع معروف عندما يكون سجل دفتر الأستاذ الكامل للبلوكتشين مطلوبًا. هذه الأمثلة تنتظر الأحداث الحية، لذا قم بتشغيلها مقابل عقدة حيث يكون البث ممكّنًا ونشطًا.

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

## المفاتيح والعناوين {#keys-and-addresses}

يكشف SDK عن مساعدي التوقيع المحليين لكل خوارزمية توقيع تم تجميعها في الامتداد الأصلي. لا تستدعي هذه المساعدين Taira، لكنها تتطلب الامتداد الأصلي:

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

استخدم `supported_crypto_algorithms()` لرؤية ما يدعمه العجلة الخاصة بك. تستخدم الأدوات المساعدة العامة تسميات خوارزمية معيارية واحدة وتعمل مع Ed25519 و secp256k1 و ML-DSA و GOST و BLS و SM2 عند تجميع تلك الخوارزميات:

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

### الترميز الصيني SM {#chinese-sm-cryptography}

Python SDK يكشف كل من المساعدين العامين SM2 ومساعدي الراحة المتخصصين SM2. استخدم إعلان قدرة العقدة لاختيار معرف التمييز SM2 المتوقع من الشبكة المستهدفة:

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

`crypto.sm.enabled` يخبرك ما إذا كان العقدة تقبل خوارزميات عائلة SM في سياستها الحالية. الإعلانات نفسها تتضمن سياسة التجزئة التشفيرية SM وحالة التسريع، وهو أمر مفيد عند اتخاذ قرار ما إذا كان يجب تمكين تدفقات محددة بـ SM2:

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

اعتبر حمولة القدرة المصادق عليها موثوقة للعقدة المنشورة. لا تقدم معاملة موقعة بواسطة SM2 إلا إذا كانت `crypto.sm.enabled` صحيحة وتسمح سياسة التوقيع المعلنة بذلك.

### GOST ومفاتيح ما بعد الكم {#gost-and-post-quantum-keys}

استخدم التشفير العام API لمجموعات معايير GOST R 34.10-2012 و ML-DSA (`ml-dsa`) لتوقيعات ما بعد الكم. نفس كائن زوج المفاتيح يتعامل مع التوقيع، والتحقق، وتصدير متعددة التجزئة:

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

البوابة GOST وتدفقات ما بعد الكم على إعلان القدرة المصادق عليه والمصنف للعقدة:

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

إذا لم يعلن العقدة عن الخوارزمية التي تحتاجها، استخدم المفتاح فقط للعمليات المحلية أو غير المتصلة بالإنترنت. لا تقدم المعاملات الموقعة بتلك الخوارزمية إلى تلك العقدة. أثناء الفحص العام Taira، كان كل من GOST و ML-DSA متاحين كمساعدي تشفير SDK في مكتبة Python العلوية، لكن لم يتم الإعلان عنهما من قبل العقدة لتوقيع المعاملات.

## إنشاء عميل واعٍ بالتكوين {#config-aware-client-creation}

استخدم `resolve_torii_client_config` عندما يقرأ تطبيقك إعدادات العقد من ملف ولكنه لا يزال بحاجة إلى تجاوزات خاصة بالبيئة أو الاختبار:

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

## استعداد كاجيموشا {#kagemusha-readiness}

يمكن لـ Python SDK الاستعلام عن مسار جاهزية JSON الحالي من خلال مساعد الطلب العام لـ Torii الخاص به:

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

Python لا يكشف عن منشئي أرشيفات التعبئة أو الاسترداد من نوع Kagemusha. استخدم محفظة من نوع Swift أو JVM لبناء أرشيفات V4 وفق المعيار البروتوكولي المفرد، ثم قدمها واستعلم عنها عبر عميل Kagemusha Torii المدعوم.

## الاشتراكات {#subscriptions}

تُرث عمليات قراءة الاشتراك وبُناة المسودات من العميل المشترك Torii المستخدم بواسطة `iroha_python.ToriiClient`. ويتم قبول كل تعديل مع واحد مرتبط بالجسم توقيع الحساب وفقًا للبروتوكول-المعيار ويعيد مسودة معاملة غير موقعة. Torii لا يقبل أبدًا المفتاح الخاص ولا يقوم بتقديم المسودة نيابةً عنك.

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

قم بإعطاء كل حمولة دقيقة ورسالة توقيع إلى المحفظة المحلية للحساب المقابل، تحقق من العملية المطلوبة هناك، اجمع المعاملة الموقعة، وقدمها من خلال سير عمل معالجة المعاملات العادي للبرنامج. يُحقق Python SDK أن رسالة التوقيع هي التجزئة التشفيرية القياسية للبروتوكول الوحيدة للبيانات المرجعة، ولكن يظل المحفظ مسؤولاً عن فك التشفير والموافقة على المعاملة قبل التوقيع.

## اتصل {#connect}

قم ببناء وتحليل Connect URIs محليًا. تربط هوية Connect SID بالـ `NetworkId` بالضبط، ومفتاح التطبيق العام، وقيمة الرقم العشوائي التشفيري:

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

قم بتسجيل هذا المعاينة بالضبط فقط عندما يكشف العقدة الهدف عن Connect. إنشاء الجلسة يعيد أربعة رموز حامل خاصة بالدور. مسار حالة كل جلسة يتطلب رمز الإدارة؛ الحالة المجمعة هي مسار للمشغل.

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

تشفير الرسائل بعد الموافقة باستخدام جلسة ذات حالة:

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

## الحوكمة، بيئة تنفيذ البرمجيات، والأسطح الإدارية {#governance-runtime-and-admin-surfaces}

يتم مصادقة قراءة الحوكمة عن طريق الحساب. باستخدام مبدأ التفويض وزوج المفاتيح من [إعداد مشترك](#shared-setup)، اربط كل استدعاء مساعد بـ Taira المستمد بدقة من الأصل `NetworkId`:

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

قم بإنشاء عميل منفصل لقراءات المشغل. قم بتحميل مفتاح المشغل المدرج في القائمة المسموح بها في بيئة تنفيذ البرنامج واربطه بـ Taira بالضبط مع `NetworkId`؛ رموز الحامل و `x-api-token` لا تستبدل هذا التوقيع:

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

مسارات ترقية وقت التشغيل هي لبنّاء تعليمات يتم التحقق من هوية المشغل فيها. يسترجع الرد الناجح للاقتراح أو التفعيل أو الإلغاء `tx_instructions`؛ ولكنه لا ينفذ الترقية. قدم هذه الحزمة من خلال مسار المعاملة الموقعة والحوكمة المعتاد. الطرق المثبتة Python، `propose_runtime_upgrade`، `activate_runtime_upgrade`، و `cancel_runtime_upgrade` تقوم حاليا بإصدار طلبات عادية بدلاً من تطبيق `OperatorSigningContext` الخاص بالعميل، لذلك لا يقدم هذا الدليل هذه الطرق كجزء من سير تشغيل عامل عملي.

## الحالة، الإجماع، ورصد الشبكة {#status-consensus-and-network-telemetry}

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

## SoraFS، UAID، و Kaigi مساعدين {#sorafs-uaid-and-kaigi-helpers}

تكون هذه المساعدات متاحة عندما يكشف العقدة الهدف النقاط النهائية المقابلة Nexus/SORA API. اعتبر القوائم الفارغة استجابة صالحة: قد يكون للمسار العام Taira ممكّنًا بدون بيانات للملف الفني التجريبي أو UAID.

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

## Norito RPC و GPU مساعدين {#norito-rpc-and-gpu-helpers}

استخدم `NoritoRpcClient` عندما يكون لديك بالفعل Norito بايت وتحتاج إلى استدعاء نقطة نهاية ثنائية Torii API. المثال يتطلب حاوية بيانات موقعة من قالب معاملة سابق:

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

CUDA يقوم المساعدون بإرجاع `None` عندما لا يكون الخادم الخلفي متاحًا، لذا يمكن للتطبيقات العودة إلى تنفيذات قياسية:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## التغطية الحالية {#current-coverage}

يشمل Python SDK بالفعل المساعدين لـ:

- Torii تدفقات التقديم، الحالة، الاستعلام، والإدارة
- منشئو التعليمات المكتوبة للإضافات الشائعة ISI والإضافات الخاصة بالمجال
- مسودات المعاملات، المراسلات الفنية، التوقيع، وسير عمل حاويات بيانات المعاملات الموقعة
- تدفقات الأحداث الحية والفلاتر المكتوبة؛ توفر تدفقات الكتل النهائية التاريخ الكامل
- الوصول إلى جاهزية Kagemusha العامة ومساعدي الاشتراك Torii؛ لا يتم الكشف عن منشئي التعبئة العلوية والاسترداد المكتوبة
- عنوان الحساب، مساعدو التوقيع لجميع الخوارزميات، جولات متعددة التجزئة، SM2، GOST، ML-DSA، BLS، ومعالجة المفاتيح السرية
- اتصل بـ URIs، الجلسات، الإطارات، مساعدي التشفير، وإدارة السجل
- الحوكمة، ترقية بيئة تنفيذ البرامج، Sumeragi، مسؤول العقدة، SoraFS، UAID، و Kaigi API محولات برامج نقطة النهاية حيث تكشف العقدة عن تلك الميزات

## المراجع العليا {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

تلك الملفات هي المصدر الموثوق لسطح Python في نسخة مساحة العمل المثبتة.
