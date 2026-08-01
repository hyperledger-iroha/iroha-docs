---
translation_locale: ar
translation_source: /blockchain/rwas.md
translation_source_hash: cbdc6d766fb90bea7e68dc67f2c705bb1638340feeb2fca9f2dd43a727ac03e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الأصول في العالم الحقيقي {#real-world-assets}

أصول العالم الحقيقي (RWAs) نموذج الأصول خارج السلسلة التي يتم تتبع ملكيتها أو سيطرتها على سلسلة. في Iroha ، فإن RWA هو مجموعة مسجلة من دفتر التسجيل مع معرف تم إنشاؤه وحساب المالك والكمية وبيانات الأعمال المتعددة والمصدر ومراقبة دورة الحياة الخيارية.

RWAs تختلف عن رصيدات الأصول الرقمية:

- الأصول الرقمية هي رصيد قابلة للتداول تحتفظ به حساب
- NFT هو سجل فريد في السلسلة مع صاحب واحد.
- RWA هو الكثير الذي يمكن أن يحمل البيانات الأساسية التجارية، والكمية، والاحتفاظ بها، وتجميدها، وحالة الاسترداد، والمصدر، وسياسة المعالج.

استخدم RWAs عندما يحتاج دفتر التسجيل إلى تمثيل مجموعة محددة خارج السلسلة بدلاً من مجرد رصيد قابل للتبديل.

## RWA الكثير {#rwa-lot}

RWA يحتوي على:

- `id`: المعرف القنوني RWA الذي تم إنشاؤه، يعرض على شكل `<hash>$<domain>`
- `owned_by`: الحساب الذي يمتلك اللقطة حالياً
- `quantity`: الكمية المتبقية التي تمثلها اللقطة
- `spec`: تحديد الكمية، مثل المقياس العشري.
- `primary_reference`: الإيصالات الرئيسية أو الشهادة أو الفاتورة أو إشارة السجل خارج السلسلة.
- `status`: نص حالة الأعمال الاختياريّة
- `metadata`: الحقول المزقة JSON المستخدمة في السياق التجاري والتصفية.
- `parents`: مجموعات المصدر المستخدمة لاستحواذ هذه اللعبة
- `controls`: حسابات المراقب، وأدوار المراقب والعمليات التي تمكينها للمراقب
- `is_frozen` و `held_quantity`: حالة دورة الحياة التي يتم فرضها من خلال وقت التشغيل

الحفاظ على حمولة الفائدة على السلسلة. تخزين الوثائق القانونية الكبيرة، وتقارير التفتيش، ومجموعات المراجعة خارج WSV، ثم وضع هضم، URI، SoraFS المسار، أو الإشارة الواضحة في RWA البيانات المتعددية.

## المعرفات {#identifiers}

`RegisterRwa` لا تقبل الدعوة المختارة `id`، ولا تقبل حقل `owner`. تصبح سلطة المعاملة الحساب الأولي `owned_by`، ويتولى وقت التشغيل `RwaId` في النطاق المستهدف.

الشكل النصي لـ RWA ID هو:

```text
<generated-hash>$<domain>
```

على سبيل المثال

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

يجب على الطلبات تخزين هويتهم التجارية في `primary_reference` أو `metadata`, ثم اكتشفوا ما تم إنشاؤه `RwaId` من `RwaEvent::Created`, `FindRwas`, `/v1/rwas`, أو مسار المستكشف المحدد بعد التزامات المعاملة.

## دورة الحياة {#lifecycle}

تدفقات العمل الشائعة RWA تشمل:

|العملية|السلوك التنفيذي |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |إنشاء قطعة من ID في نطاق؛ تصبح سلطة المعاملة `owned_by`. |
|`TransferRwa` |نقل الكمية إلى حساب آخر. يمكن أن يتغير التحويل الكامل `owned_by`. إن تحويل جزئي يخلق قطعة طفل منفصلة مع تم توليد ID. |
|`HoldRwa` |الكمية الاحتياطية. يتطلب جهاز تحكم تم تشكيله و `hold_enabled`. |
|`ReleaseRwa` |إزالة الكمية التي تم احتجازها. يتطلب جهاز تحكم تكوين و `hold_enabled`. |
|`FreezeRwa` |حظر عمليات المالك العادي. يتطلب جهاز تحكم تم تكوينها و `freeze_enabled`. |
|`UnfreezeRwa` |إعادة تمكين عمليات المالك العادي. يتطلب جهاز تحكم تكوين و `freeze_enabled`. |
|`RedeemRwa` |خفض الكمية بشكل دائم من الدورة التدريبية. يمكن للمالك أو لمراقب تقديمها عندما يكون `redeem_enabled` صحيحاً. |
|`MergeRwas` |الجمع بين الكميات من الحصص الأولي مع نفس النطاق والتحديد في حزمة الطفل المولود. |
|`ForceTransferRwa` |تحريك الكمية من خلال تدفق جهاز التحكم. يتطلب جهاز التحكم المثبت و `force_transfer_enabled`. |
|`SetRwaControls` |استبدل سياسة التحكم في الحصيلة، تتطلب مالك أو مراقب|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |تحديث البيانات الأساسية للمجموعة. يتطلب صاحبها أو مراقب؛ المجموعات المجمدة تتطلب مراقب. |

لا توجد تعليمات `UnregisterRwa` في الرمز الحالي. قم بإلغاء مجموعة خارج السلسلة مع `RedeemRwa` عندما يتم تسليم الكمية الممثلة أو استهلاكها أو تسويةها أو إزالتها من الدورة التداولية بطريقة أخرى.

## البيانات الأساسية والتحكم {#metadata-and-controls}

استخدم البيانات المعدنية للحصول على حقائق صغيرة تساعد التطبيقات على تحديد وتحقق من الحصة:

- فئة الأصول، إصدار، حامي أو مرجع سجل
- مستودع، خزينة، ISIN، فاتورة أو تحديدات شهادة.
- المحتويات الهمشية للشهادات والوثائق القانونية
- SoraFS مسارات أو مرجعات واضحة لمجموعات الأدلة الأكبر حجمًا.
- علامات المدة أو الاختصاص القضائي أو الامتثال التي تستخدمها الخدمات خارج السلسلة.

تحتوي `RwaControlPolicy` المطبقة على هذه الحقول:

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

يمكن لحسابات ومزايا المراقب القيام بالعمليات التي تمكنها العلامات البولية المقابلة. تحميل التحكم الحالي يحتوي على هويات المراقب وعلامات التشغيل. خارج هذه الحملة الفائدة قائمة السماح بتحويل وقواعد `transfers` المتداخلة.

## الأسئلة والأحداث و APIs {#queries-events-and-apis}

استخدم [`FindRwas`](/ar/reference/queries.md#assets-nfts-and-rwas) لإدراج اللوتات المسجلة RWA . يمكن للتطبيقات التي تحتاج إلى تحديثات حية الاشتراك في [`Rwa` أحداث البيانات ](/ar/blockchain/filters.md#data-event-filters) لإنشاء، تغيير المالك، تقسيم، دمج، استرداد، تجميد، فك التجميد، الاحتفاظ بها، الإفراج عن، نقل القوة، تغيير التحكم وأحداث البيانات المتعددة.

Torii يعرض طرق سلسلة الحالة مثل `/v1/rwas` و `/v1/rwas/query` ، بالإضافة إلى طرق المستكشفين مثل `/v1/explorer/rwas` و `/v1/explorer/rwas/{rwa_id}` عندما يتم تمكين عائلة تلك الطرق. يجب على العملاء الذين يتم إنشاؤهم تفضيل وثيقة [`/openapi`](/ar/reference/torii-endpoints.md#common-endpoints) المباشرة من أجل شكل الاستجابة الدقيق الذي يعرضه العقدة.

### جربها على Taira {#try-it-on-taira}

التحقق من ما إذا كانت Taira العامة قد سجلت حالياً RWA المجموعات:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

قم بإدراج طرق RWA المعروضة في وثيقة Taira OpenAPI الحية:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

يُتوقع إنتاج فارغ `items` عندما لا يتم تسجيل قطاعات عامة بعد. التسجيل والتحويل والاحتفاظ والتجميد والاسترداد هي معاملات موقعة.

## جربها {#try-it}

تستخدم الأمثلة التالية: Python SDK السطح من [الإعداد المشترك](/ar/guide/tutorials/python.md#shared-setup). استبدال الحساب IDs, المفاتيح الخاصة، والقطعة التي تم إنشاؤها IDs مع القيم من شبكتك الخاصة قبل إرسال المعاملة.

### اكتشاف طرق RWA API {#discover-rwa-api-routes}

يطلب هذا المثال القائم على القراءة فقط من عقد Torii قيد التشغيل أن يتم تمكين طرق RWA الموجهة إلى التطبيق:

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

إذا كانت القائمة فارغة، قد لا تزال العقدة تدعم تعليمات RWA والاستفسارات عبر Torii APIs الأخرى، لكنها لا تعرض عائلة الطرق الاختيارية JSON.

### تسجيل إيصال المستودع {#register-a-warehouse-receipt}

استخدم مسودة عندما يتعين أن يصبح عمل تجاري واحد صفقة واحدة موقعة. يذهب رقم إيصال الأعمال في `primary_reference` ؛ يتم إنشاء دفتر التسجيل ID بعد الالتزام بالصفقة.

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

بعد التزامات المعاملة، يتم إنشاء القائمة RWA IDs. تعرض طرق الحالة السلسلة للطريقة الكانونية IDs؛ استخدم الأحداث أو طرق تفاصيل المستكشف عندما تحتاج إلى مطابقة ID مرة أخرى إلى `primary_reference` أو البيانات المعدلة:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

يمكن للعقدات التي تمكن من استكشافها أيضًا إرجاع التنبؤات الأكثر غنى:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### الانتقال مع إيقاف مؤقت {#transfer-with-a-temporary-hold}

استخدم RWA ID المولد الذي يعود به السلسلة. يفترض هذا المثال أن `alice` هو صاحبها ويتم تشكيلها أيضًا كجهاز تحكم مع `hold_enabled`.

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

إرسال `ReleaseRwa` بعد نجاح عملية خارج السلسلة:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### إضافة بيانات التحكم والتحقق {#add-controls-and-audit-metadata}

تُستخدم التحكمات لسياسة المراقب، ويتم استخدام البيانات الأساسية للحقائق التي تحتاج إليها التطبيقات أو المحاسبين:

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

تقديم `RedeemRwa` بعد تسليم الأصول الممثلة خارج السلسلة ، أو استهلاكها ، أو التقاعد ، أو إزالتها من الدورة التداولية بطريقة أخرى. هذا ينقص بشكل دائم الكمية المقدمة من الحصة. يجب أن يكون الحصة `redeem_enabled`. يجب أن يكون الموقّع صاحبها أو مراقبها.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### تجميد أثناء مراجعة الامتثال {#freeze-during-compliance-review}

إرسال `FreezeRwa` عندما يتوجب على مراجعة خارج السلسلة حظر عمليات المالك العادي. يجب أن يكون الموقّع مراقباً. يجب أن تكون اللقطة تحتوي على `freeze_enabled`.

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

تقديم `UnfreezeRwa` بعد مرور المراجعة:

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

تمثيل الفاتورة كمجموعة RWA من خلال تخزين رقم الفاتورة في `primary_reference` والبيانات الأساسية. بعد التسجيل، استخدم ID المولود للتحويل والتكيير.

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

عندما يتم تمويل المطلوب أو دفعها، استخدم مجموعة الفواتير التي تم إنتاجها ID:

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

تقديم `RedeemRwa` لإزالة الائتمانات الكربونية المزعومة من الدورة التدريبية. تخزن شهادة خارج السلسلة أو دليل السجل في البيانات الأساسية:

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

### دمج اثنين من المجموعات {#merge-two-lots}

الاندماج عندما يتم دمج موقعين خارج السلسلة. يجب أن يكون الوالدون في نفس النطاق ويستخدمون نفس المحددة الكمية. وقت التشغيل يولد الكثير الطفل ID.

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

لمثال كامل لعملية Python، انظر [أصول العالم الحقيقي ](/ar/guide/tutorials/python.md#real-world-assets).

## وثائق ذات صلة {#related-docs}

- [الأصول](/ar/blockchain/assets.md)
- [البيانات الأساسية](/ar/blockchain/metadata.md)
- [Iroha تعليمات خاصة](/ar/blockchain/instructions.md)
- [الأسئلة ](/ar/reference/queries.md#assets-nfts-and-rwas)
- [نقاط نهاية Torii](/ar/reference/torii-endpoints.md#app-and-sora-route-families)
