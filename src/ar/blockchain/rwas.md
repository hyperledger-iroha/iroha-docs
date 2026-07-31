---
translation_locale: ar
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الأصول في العالم الحقيقي {#real-world-assets}

الأصول الحقيقية (RWAs) النموذج من الأصول خارج السلسلة التي تملكها أو تسيطر عليها
يتم تتبعها على السلسلة Iroha, (أ) RWA هو مجموعة من الكتب المسجلة مع:
المعرف الذي تم إنشاؤه، وحساب المالك، والكمية، وبيانات الأعمال التجارية،
المواصلة، والتحكم في دورة الحياة اختيارية.

RWAs تختلف عن رصيد الأصول الرقمية:

- الأصول الرقمية هي رصيد قابلة للتداول تحتفظ به الحساب
- (أ) NFT هو سجل فريد على السلسلة مع صاحب واحد
- (أ) RWA هو الكثير الذي يمكن أن يحمل البيانات المتعددة التجارية، الكمية، الحفاظ،
  التجميد، حالة الإفراج، ومصيرها، وسياسة المراقب

الاستخدام RWAs عندما يحتاج دفتر التسجيل إلى تمثيل مجموعة محددة خارج السلسلة
بدلاً من مجرد توازن قابلة للتبديل

## RWA (لوت) {#rwa-lot}

(إنجليزية) RWA المجموعة تحتوي على:

- `id`: الناتج القنوني RWA المعرف، يظهر على شكل
  `<hash>$<domain>`
- `owned_by`: الحساب الذي يمتلك العقار حالياً
- `quantity`: الكمية المتبقية التي تمثلها اللقطة
- `spec`: تحديد الكمية، مثل المقياس العشري
- `primary_reference`: الإيصالات الرئيسية خارج السلسلة أو الشهادة أو الفاتورة، أو
  إشارة السجل
- `status`: نص حالة العمل الاختياري
- `metadata`: مكونة JSON الحقول المستخدمة في السياق التجاري والتصفية
- `parents`: الكثير من المصادر المستخدمة لتحويل هذا الكتيب
- `controls`: حسابات المراقب، ودور المراقب والمركز المسؤول
  العمليات
- `is_frozen` و `held_quantity`: حالة دورة الحياة التي تفرضها الوقت

حافظ على الحمولة المفيدة على السلسلة
تقارير ومجموعات مراجعة خارج WSV, ثم أكتب كتاباً URI, SoraFS
المسار، أو الإشارة الواضحة في RWA البيانات المتعددة

## المعرفات {#identifiers}

`RegisterRwa` لا يقبل المتصل المختار `id`, و لا تقبل
(أ) `owner` الحقل: تصبح سلطة المعاملة أولية `owned_by`
الحساب، والوقت التشغيل يخلق `RwaId` في مجال الهدف.

الشكل النصي RWA ID هو:

```text
<generated-hash>$<domain>
```

على سبيل المثال

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

يجب على الطلبات تخزين معرفها التجاري في `primary_reference`
أو `metadata`, ثم اكتشفت ما تم إنشاؤه `RwaId` من
`RwaEvent::Created`, `FindRwas`, `/v1/rwas`, أو مجموعة مسارات المستكشفين
بعد أن تتعهد المعاملة.

## دورة الحياة {#lifecycle}

الشائعة RWA تتضمن عمليات العمل:

| العملية                                  | السلوك المطبق                                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              | إخلق ...ID الكثير في مجال؛ تصبح سلطة المعاملة `owned_by`.                                       |
| `TransferRwa`                              | تحويل الكمية إلى حساب آخر يمكن أن يتغير التحويل الكامل `owned_by`; النقل الجزئي يخلق الكثير من الأطفال المولودين |
| `HoldRwa`                                  | كمية احتياطية. `hold_enabled`.                                                     |
| `ReleaseRwa`                               | إزالة الكمية المحتجزة. `hold_enabled`.                                                 |
| `FreezeRwa`                                | حظر العمليات المالك العادي. يتطلب جهاز تحكم مُهيّن و `freeze_enabled`.                                    |
| `UnfreezeRwa`                              | إعادة تمكين العمليات العادية للمالك. `freeze_enabled`.                                |
| `RedeemRwa`                                | تطلب مالك أو مراقب و `redeem_enabled`.                                                  |
| `MergeRwas`                                | الجمع بين الكميات من المجموعات الأولياء مع نفس النطاق والتحديد إلى مجموعة الأطفال المولودة.                              |
| `ForceTransferRwa`                         | تحريك الكمية من خلال تدفق التحكم. `force_transfer_enabled`.                    |
| `SetRwaControls`                           | استبدل سياسة التحكم في المجموعة، تتطلب مالك أو مراقب                                                        |
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` | تحديث البيانات المتعددة للمجموعة. يتطلب صاحبها أو مراقب؛ المجموعات المجمدة تتطلب مراقب.                                 |

لا يوجد `UnregisterRwa` التعليمات في الرمز الحالي.
قطع خارج السلسلة `RedeemRwa` عندما يتم تسليم الكمية الممثلة
يتم استهلاكها أو تسهيلها أو إزالتها من الدورة التداولية.

## البيانات الأساسية والتحكم {#metadata-and-controls}

استخدام البيانات المعدنية للحصول على حقائق صغيرة تساعد التطبيقات على تحديد وتحقق
الحصيلة:

- فئة الأصول، إصدار، حارس أو مرجع السجل
- مستودع، قبو ISIN, الفاتورة أو ملفات تحديد الشهادات
- المحتويات الهمشية للشهادات والوثائق القانونية
- SoraFS المسارات أو الإشارات المعلنة لمجموعات الأدلة الأكبر
- علامات المدة، والولاية القضائية، أو الامتثال التي تستخدمها الخدمات خارج السلسلة

التنفيذ `RwaControlPolicy` لديه هذه الحقول:

```json
{
  "controller_accounts": [],
  "controller_roles": [],
  "freeze_enabled": true,
  "hold_enabled": true,
  "force_transfer_enabled": false,
  "redeem_enabled": true
}
```

يسمح لحسابات ومهمات المراقب بأن يؤديها فقط المراقب
العمليات التي تمكينها العلامة البولية المقابلة.
الحمولة المفيدة ليست سياسة نقل القائمة السماح بها ولا تحتوي على مستوى
`transfers` القواعد.

## الأسئلة والأحداث APIs {#queries-events-and-apis}

الاستخدام [`FindRwas`](/ar/reference/queries.md#assets-nfts-and-rwas) إدراجها
مسجلة RWA التطبيقات التي تحتاج إلى تحديثات مباشرة يمكن الاشتراك في
[`Rwa` أحداث البيانات](/ar/blockchain/filters.md#data-event-filters) لخلقها
تغيير المالكين، انقسام، دمج، استرداد، تجميد، فك الجليد، الاحتفاظ بها، إطلاق سراح،
تحويل القوة، تغيير التحكمات، وحوادث البيانات المعدنية.

Torii يعرض مسارات الحالة السلسلة مثل `/v1/rwas` و `/v1/rwas/query`,
بالإضافة إلى طرق المستكشفين مثل `/v1/explorer/rwas` و
`/v1/explorer/rwas/{rwa_id}` عندما يتم تشغيل عائلة المسار
يجب على العملاء أن يفضلوا
[`/openapi`](/ar/reference/torii-endpoints.md#common-endpoints) الوثيقة
الشكل الدقيق للرد الذي تعرضه العقدة.

### جربها Taira {#try-it-on-taira}

التحقق مما إذا كانت عامة Taira حالياً قد سجلت RWA الكثير:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

إدراج RWA الطرق التي كشفتها المواصلات الحية Taira OpenAPI المستند:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

فارغة `items` الناتج المتوقع عندما لا يتم تسجيل قطاعات عامة بعد.
التسجيل، النقل، الحفاظ، التجميد، والإفراج هي المعاملات الموقع.

## جربها {#try-it}

تستخدم الأمثلة التالية Python SDK السطحات من
[الإعداد المشترك](/ar/guide/tutorials/python.md#shared-setup). استبدال
الحساب IDs, المفاتيح الخاصة، والقطعة التي تم إنشاؤها IDs مع القيم الخاصة بك
شبكة قبل تقديم المعاملة.

### اكتشاف RWA API الطرق {#discover-rwa-api-routes}

هذا مثال القراءة فقط يطلب من الجري Torii العقدة التي تتجه نحو التطبيق RWA
يتم تمكين الطرق:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

إذا كانت القائمة فارغة، قد لا يزال العقد يدعم RWA التعليمات
الاستفسارات من خلال Torii APIs, لكنّها لا تكشف الخيار JSON
عائلة الطريق

### تسجيل إيصال المستودع {#register-a-warehouse-receipt}

استخدم مسودة عندما يتعين أن تصبح عمل تجاري واحد معاملة واحدة موقعة.
رقم إيصال العمل يدخل `primary_reference`; الكتب الرئيسية ID هو
التي تم إنشاؤها بعد التزامات المعاملة.

```python
from iroha_python import TransactionConfig, TransactionDraft

config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    metadata={**TX_METADATA, "source": "rwa-docs"},
)

draft = TransactionDraft(config)
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "inspection_report": "sorafs://reports/copper-001.json",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

بعد التزامات المعاملة ، يتم إنشاء القائمة RWA IDs. طرق الدولة السلسلة
كشف القوانين الكونية IDs; استخدام الأحداث أو المسارات التفصيلية للمستكشف عندما
الحاجة لتطابق ID العودة إلى `primary_reference` أو البيانات المعدنية:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

يمكن أن تعيد العقدات التي تمكن من استكشافها أيضاً توقعات أكثر ثراء:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### النقل مع تأمين مؤقت {#transfer-with-a-temporary-hold}

استخدم المعلومات التي تم إنتاجها RWA ID يعود من خلال السلسلة. هذا المثال يفترض
`alice` هو المالك ويتم تشكيله أيضا كمراقب مع
`hold_enabled`.

```python
warehouse_lot_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.transfer_rwa(warehouse_lot_id, quantity="10", destination=bob)
draft.hold_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

إطلاق العقد عند اكتمال عملية خارج السلسلة:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### إضافة بيانات التحكم والتحقق {#add-controls-and-audit-metadata}

التحكمات و البيانات المعدنية منفصلة. استخدم التحكمات لسياسة المعالج،
البيانات الأساسية للحقائق التي يحتاجها الطلبات أو المراجعون إلى عرضها:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.set_rwa_controls(
    warehouse_lot_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)
draft.set_rwa_key_value(warehouse_lot_id, "auditor", "alice")
draft.set_rwa_key_value(
    warehouse_lot_id,
    "proof_hash",
    "sha256:2b1c7a4e...",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### كمية الفدية أو التقاعد {#redeem-or-retire-quantity}

كمية استرداد عندما يتم تسليم الأصول الممثلة خارج السلسلة،
يتم استهلاكها أو تقاعدها أو إزالتها من الدورة التداولية.
`redeem_enabled`, ويجب أن يكون الموقّع هو صاحب أو مراقب.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### التجمد أثناء مراجعة الامتثال {#freeze-during-compliance-review}

تتجمد كثيراً عندما يجب أن يمنع مراجعة خارج السلسلة عمليات المالك العادي
يجب أن يكون الموقّع مراقباً و يجب أن تكون الحصيلة `freeze_enabled`.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.freeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {
        "status": "frozen",
        "reason": "custodian inventory check",
        "case_id": "OPS-2026-0042",
    },
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

إزالة الجليد عند مرور المراجعة:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.unfreeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {"status": "cleared", "case_id": "OPS-2026-0042"},
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### الفاتورة المستحقة {#invoice-receivable}

تمثيل الفاتورة على أنها RWA الحصيلة من خلال تخزين رقم الفاتورة في
`primary_reference` بعد التسجيل، استخدم المعلومات التي تم إنشاؤها ID
للتحويل والتكييف.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.register_rwa(
    {
        "domain": "receivables.universal",
        "quantity": "50000",
        "spec": {"scale": 2},
        "primary_reference": "INV-2026-0007",
        "status": "issued",
        "metadata": {
            "asset_class": "invoice",
            "currency": "USD",
            "debtor": "example-buyer",
            "due_date": "2026-06-30",
            "document_hash": "sha256:4df4c8...",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": False,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

عندما يتم تمويل المطلوب أو دفعها، استخدم مجموعة الفواتير التي تم إنشاؤها ID:

```python
invoice_lot_id = (
    "fedcba9876543210fedcba9876543210"
    "fedcba9876543210fedcba9876543210$receivables.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.transfer_rwa(invoice_lot_id, quantity="50000", destination=bob)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

استرداد المبلغ الممثّل بعد تسوية خارج السلسلة:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### تقاعد الائتمان الكربوني {#carbon-credit-retirement}

استخدم الفدية لتقاعد الائتمانات بعد مطالبتهم.
يشير إلى الشهادة خارج السلسلة أو دليل السجل:

```python
carbon_lot_id = (
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$carbon.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(carbon_lot_id, quantity="250")
draft.set_rwa_key_value(
    carbon_lot_id,
    "retirement_certificate",
    "sorafs://certificates/carbon-credit-2026-001-retired.json",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### دمج اثنين من الكتيبات {#merge-two-lots}

الاندماج عندما يتم توحيد موقفين خارج السلسلة
أن تكون في نفس المجال واستخدام نفس التفاصيل الكمية
الحصص الصغار ID.

```python
warehouse_lot_id_2 = (
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.merge_rwas(
    {
        "parents": [
            {"rwa": warehouse_lot_id, "quantity": "40"},
            {"rwa": warehouse_lot_id_2, "quantity": "60"},
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "merge_reason": "same custodian and quality grade",
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

لأجل الكامل Python مثال المعاملات، انظر
[الأصول في العالم الحقيقي](/ar/guide/tutorials/python.md#real-world-assets).

## وثائق ذات صلة {#related-docs}

- [الأصول](/ar/blockchain/assets.md)
- [البيانات المتعددة](/ar/blockchain/metadata.md)
- [Iroha التعليمات الخاصة](/ar/blockchain/instructions.md)
- [الأسئلة](/ar/reference/queries.md#assets-nfts-and-rwas)
- [Torii النقاط النهائية](/ar/reference/torii-endpoints.md#app-and-sora-route-families)
