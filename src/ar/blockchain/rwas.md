---
translation_locale: ar
translation_source: /blockchain/rwas.md
translation_source_hash: 8d64a9a17c93f60306c279e8656e6edde8ce5dd024e742218bfb9572b7438bb0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# الأصول الواقعية {#real-world-assets}

الأصول الواقعية (RWAs) تمثل الأصول خارج السلسلة التي يتم تتبع ملكيتها أو السيطرة عليها على السلسلة. في Iroha، يعتبر RWA دفعة مسجلة في دفتر السجل البلوكشين مع معرف تم إنشاؤه، وحساب مالك، وكمية، وبيانات تجارية، وأصل/سجل المصدر، ووسائط التحكم في دورة الحياة اختيارية.

RWAs يختلف عن أرصدة الأصول الرقمية:

- الأصل الرقمي هو رصيد قابل للاستبدال يحتفظ به حساب
- يعد NFT سجلاً فريداً على السلسلة له مالك واحد
- الـ RWA هو جزء يمكنه حمل بيانات الأعمال الوصفية، والكمية، والاحتجازات، والتجميدات، وحالة الاسترداد، والأصل، وسياسة المتحكم

استخدم RWAs عندما يحتاج دفتر الأستاذ البلوكتشين إلى تمثيل دفعة محددة خارج السلسلة بدلاً من مجرد رصيد قابل للاستبدال.

## RWA دفعة {#rwa-lot}

تحتوي كمية RWA على:

- `id`: معرّف بروتوكول-معيار مفرد تم إنشاؤه RWA، معروضًا كـ `<hash>$<domain>`
- `owned_by`: الحساب الذي يمتلك القطعة حالياً
- `quantity`: الكمية المتبقية التي تمثلها الدفعة
- `spec`: تحديد الكمية، مثل المقياس العشري
- `primary_reference`: السجل الرئيسي لنتيجة البروتوكول خارج السلسلة، شهادة، فاتورة، أو مرجع سجل
- `status`: نص حالة العمل اختياري
- `metadata`: الحقول المدمجة JSON المستخدمة للسياق التجاري والفهرسة
- `parents`: المصادر المستخدمة لاشتقاق هذه الدفعة
- `controls`: حسابات المتحكم، أدوار المتحكم، والعمليات الممكنة للمتحكم
- `is_frozen` و `held_quantity`: حالة دورة الحياة التي يفرضها بيئة تنفيذ البرامج

حافظ على حمولة السلسلة مضغوطة. خزّن المستندات القانونية الكبيرة، تقارير التفتيش، وحزم التدقيق خارج WSV، ثم ضع قيمة ملخص تشفيرية، URI، مسار SoraFS، أو مرجع البيان الفني في بيانات RWA.

## المعرفات {#identifiers}

`RegisterRwa` لا يقبل `id` الذي يختاره العميل الطالِب، ولا يقبل حقل `owner`. تصبح الجهة المخوِّلة للمعاملة الحساب الأولي `owned_by`، وتولّد بيئة تنفيذ البرنامج `RwaId` في النطاق الهدف.

الشكل النصي لمعرف RWA هو:

```text
<generated-hash>$<domain>
```

على سبيل المثال:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

يجب على التطبيقات تخزين معرف الأعمال الخاص بها في `primary_reference` أو `metadata`، ثم اكتشاف `RwaId` الذي تم إنشاؤه من `RwaEvent::Created`، `FindRwas`، `/v1/rwas`، أو مسار المستكشف الذي تم تعيينه بعد اكتمال المعاملة.

## دورة الحياة {#lifecycle}

تشمل سير العمل الشائعة RWA:

|عملية|السلوك المنفذ|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              |إنشاء دفعة بمعرف مُولد في مجال؛ يصبح مبدأ تفويض المعاملة `owned_by`.|
| `TransferRwa`                              |نقل الكمية إلى حساب آخر. يمكن للنقل الكامل تغيير `owned_by`. يخلق النقل الجزئي دفعة فرعية منفصلة بمعرف مُنشأ.|
| `HoldRwa`                                  |كمية الاحتياطي. يتطلب وجود وحدة تحكم مكوَّنة و`hold_enabled`.|
|`ReleaseRwa`|إزالة الكمية المحتجزة. يتطلب وجود وحدة تحكم مُعدة و`hold_enabled`.|
| `FreezeRwa`                                |حظر عمليات المالك العادية. يتطلب وحدة تحكم مُعدة و`freeze_enabled`.|
| `UnfreezeRwa`                              |إعادة تمكين عمليات المالك العادية. يتطلب وجود وحدة تحكم مُكوَّنة و`freeze_enabled`.|
|`RedeemRwa`|اطرح الكمية من التداول بشكل دائم. يمكن للمالك أو المراقب تقديمها عندما يكون `redeem_enabled` صحيحًا.|
| `MergeRwas`                                |دمج الكميات من الدفعات الأم ذات نفس النطاق والمواصفات في دفعة فرعية مُنشأة.|
| `ForceTransferRwa`                         |تحريك الكمية عبر تدفق وحدة التحكم. يتطلب وجود وحدة تحكم مُعدة و`force_transfer_enabled`.|
|`SetRwaControls`|استبدل سياسة التحكم في الدفعة. يتطلب ذلك من المالك أو المسؤول.|
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |تحديث بيانات المجموعة. يتطلب وجود المالك أو المتحكم؛ المجموعات المجمدة تتطلب متحكمًا.|

لا يوجد تعليمات `UnregisterRwa` في الكود الحالي. قم بإلغاء دفعة خارج السلسلة باستخدام `RedeemRwa` عندما يتم تسليم الكمية الممثلة أو استهلاكها أو تسويتها أو إزالتها من التداول بطريقة أخرى.

## البيانات الوصفية والتحكمات {#metadata-and-controls}

استخدم البيانات الوصفية للحقائق الموجزة التي تساعد التطبيقات على تحديد الدفعة والتحقق منها:

- فئة الأصول، المُصدر، الوصي، أو مرجع السجل
- المستودع، الخزنة، ISIN، الفاتورة، أو معرفات الشهادات
- تجزئات تشفيرية للمحتوى للشهادات والمستندات القانونية
- SoraFS مسارات أو مراجع البيان الفني لحزم الأدلة الأكبر
- نضج، اختصاص، أو علامات الامتثال المستخدمة من قبل الخدمات خارج السلسلة

تم تنفيذ `RwaControlPolicy` وله هذه الحقول:

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

يمكن لحسابات وحدات التحكم والأدوار تنفيذ العمليات الممكّنة فقط بواسطة أعلام البوليان المقابلة. يحتوي الحمولة الحالية للتحكم على هويات وحدات التحكم وأعلام العمليات. تقع قوائم السماح بالنقل والقواعد المتداخلة `transfers` خارج هذه الحمولة.

## الاستعلامات، الأحداث، و APIs {#queries-events-and-apis}

استخدم [`FindRwas`](/ar/reference/queries.md#assets-nfts-and-rwas) لسرد المسجل RWA الكثير. يمكن للتطبيقات التي تحتاج إلى تحديثات مباشرة الاشتراك في [`Rwa` أحداث البيانات](/ar/blockchain/filters.md#data-event-filters) للمنشأة، تم تغيير المالك، تم تقسيمها، تم دمجها، تم استردادها، مجمدة، غير مجمدة, الأحداث المحتجزة، والمحررة، والمنقولة بالقوة، وتغيير السيطرة، وبيانات التعريف.

Torii يُظهر مسارات حالة السلسلة مثل `/v1/rwas` و `/v1/rwas/query`, بالإضافة إلى استكشاف المسارات مثل `/v1/explorer/rwas` و `/v1/explorer/rwas/{rwa_id}` عندما يتم تمكين عائلة المسار تلك. يجب أن يفضل العملاء المولَّدون النسخة الحية [`/openapi.json`](/ar/reference/torii-endpoints.md#common-endpoints) وثيقة للشكل الدقيق للاستجابة التي يكشف عنها العقدة.

### شغّل سير العمل هذا على Taira {#try-it-on-taira}

تحقق مما إذا كان لدى الجمهور Taira حاليًا RWA أرصدة مسجلة:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

سرد طرق RWA المكشوفة بواسطة مستند Taira OpenAPI المباشر:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

من المتوقع أن يكون الإخراج `items` فارغًا عندما لم يتم تسجيل أي قطع عامة بعد. التسجيل، التحويل، الحجز، التجميد، والاسترداد هي معاملات موقعة.

## جرّبه {#try-it}

تستخدم الأمثلة أدناه الأسطح Python SDK من [إعداد مشترك](/ar/guide/tutorials/python.md#shared-setup). استبدل معرفات الحسابات، المفاتيح الخاصة، ومعرفات الدفعات المولدة بالقيم من شبكتك الخاصة قبل تقديم المعاملة.

### اكتشف مسارات RWA API {#discover-rwa-api-routes}

يطلب هذا المثال للقراءة فقط من عقدة Torii الجارية معرفة أي مسارات RWA المواجهة للتطبيق مفعلة:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi.json", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

إذا كانت القائمة فارغة، فقد يظل العقدة يدعم تعليمات واستعلامات RWA من خلال Torii APIs الأخرى، لكنه لا يعرض عائلة المسار الاختيارية JSON.

### تسجيل سجل نتيجة بروتوكول المخزن {#register-a-warehouse-receipt}

استخدم مسودة عندما يجب أن يصبح إجراء تجاري واحد معاملة موقعة واحدة. يذهب رقم سجل نتيجة البروتوكول التجاري في `primary_reference`؛ يتم إنشاء معرف دفتر الأستاذ المتعلق بالبلوكشين بعد الانتهاء من المعاملة.

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

بعد الانتهاء من المعاملة، القم بإنشاء قائمة بمعرفات RWA. تكشف مسارات حالة السلسلة عن معرفات معيار البروتوكول الواحد؛ استخدم الأحداث أو مسارات تفاصيل المستكشف عندما تحتاج لمطابقة المعرف مع `primary_reference` أو البيانات الوصفية:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

يمكن أيضًا للعقد الممكّنة بـ Explorer أن تعيد توقعات أكثر تفصيلاً:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### تحويل مع حجز مؤقت {#transfer-with-a-temporary-hold}

استخدم المعرف RWA الذي تم إنشاؤه والذي أعادته السلسلة. يفترض هذا المثال أن `alice` هو المالك ومهيأ أيضاً كمتحكم مع `hold_enabled`.

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

قدّم `ReleaseRwa` بعد نجاح العملية خارج السلسلة:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### إضافة عناصر التحكم وبيانات تدقيق البيانات {#add-controls-and-audit-metadata}

الضوابط والبيانات الوصفية منفصلة. استخدم الضوابط لسياسة المتحكم، والبيانات الوصفية للحقائق التي تحتاج التطبيقات أو المدققون لعرضها:

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

### استبدال أو إيقاف تشغيل الكمية {#redeem-or-retire-quantity}

قدّم `RedeemRwa` بعد تسليم الأصل خارج السلسلة المُمثل، أو استهلاكه، أو إيقاف تشغيله، أو إزالته من التداول بطريقة أخرى. هذا يخصم نهائيًا الكمية المقدمة من الدفعة. يجب أن تحتوي الدفعة على `redeem_enabled`. يجب أن يكون الموقع التشفيري هو المالك أو متحكم.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### تجميد أثناء مراجعة الامتثال {#freeze-during-compliance-review}

قدّم `FreezeRwa` عندما يجب على المراجعة خارج السلسلة منع عمليات المالك العادي. يجب أن يكون الموقع التشفيري متحكمًا. يجب أن تحتوي الدفعة على `freeze_enabled`.

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

قدّم `UnfreezeRwa` بعد اجتياز المراجعة:

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

مثل فاتورة كدفعة RWA عن طريق تخزين رقم الفاتورة في `primary_reference` والبيانات الوصفية. بعد التسجيل، استخدم المعرف المُنشأ للنقل والاسترداد.

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

عندما يتم تمويل الحسابات المستحقة أو دفعها، استخدم معرف دفعة الفاتورة المولدة:

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

استرد المبلغ الممثل بعد تسوية المعاملة المالية خارج السلسلة:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### تقاعد رصيد الكربون {#carbon-credit-retirement}

قدّم `RedeemRwa` لإزالة الاعتمادات الكربونية المزعومة من التداول. خزّن الشهادة خارج السلسلة أو إثبات التسجيل في البيانات الوصفية:

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

### دمج مجموعتين {#merge-two-lots}

ادمج الوحدات عندما يتم دمج موقفين خارج السلسلة. يجب أن يكون الوالدان في نفس النطاق ويستخدمان نفس مواصفة الكمية. بيئة تنفيذ البرمجيات تولد معرف الوحدة الفرعية.

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

لمثال المعاملة الكامل Python، انظر [الأصول الواقعية](/ar/guide/tutorials/python.md#real-world-assets).

## المستندات ذات الصلة {#related-docs}

- [الأصول](/ar/blockchain/assets.md)
- [البيانات الوصفية](/ar/blockchain/metadata.md)
- [Iroha عمليات التعليمات](/ar/blockchain/instructions.md)
- [استفسارات](/ar/reference/queries.md#assets-nfts-and-rwas)
- [Torii API نقاط النهاية](/ar/reference/torii-endpoints.md#app-and-sora-route-families)
