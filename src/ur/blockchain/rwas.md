---
translation_locale: ur
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# حقیقی دنیا کے اثاثے {#real-world-assets}

حقیقی دنیا کے اثاثے (RWAs) ماڈل آف چین اثاثے جن کی ملکیت یا کنٹرول کو زنجیر پر ٹریک کیا جاتا ہے۔ Iroha میں ، ایک RWA ایک رجسٹرڈ لیجر لاٹ ہے جس میں پیدا کردہ شناختی کارڈ ، مالک اکاؤنٹ ، مقدار ، کاروباری میٹا ڈیٹا ، اصل اور اختیاری لائف سائیکل کنٹرولز ہیں۔

RWAs عددی اثاثوں کے بیلنس سے مختلف ہیں:

- ایک عددی اثاثہ ایک اکاؤنٹ کی طرف سے منعقد فنگبل بیلنس ہے
- ایک NFT ایک ہی مالک کے ساتھ منفرد آن لائن ریکارڈ ہے
- ایک RWA ایک بہت ہے جو کاروباری میٹا ڈیٹا، مقدار، ذخیرہ کرتا ہے، منجمد، واپسی کی حالت، اصل اور کنٹرولر پالیسی لے سکتا ہے

RWAs کا استعمال کریں جب لیجر کو صرف فنگبل بیلنس کے بجائے ایک مخصوص آف چین لاٹ کی نمائندگی کرنے کی ضرورت ہو.

## RWA حصہ {#rwa-lot}

ایک RWA بیچ میں شامل ہیں:

- `id`: پیدا کردہ کینیکل RWA شناخت کنندہ، دکھایا جاتا ہے جیسے `<hash>$<domain>`
- `owned_by`: اکاؤنٹ جو اس وقت پارٹ کا مالک ہے
- `quantity`: بیچ کی طرف سے نمائندگی کی جانے والی بقایا مقدار
- `spec`: مقدار کی تفصیلات، جیسے اعشاریہ پیمانے
- `primary_reference`: اہم آف چین رسید، سرٹیفکیٹ، انوائس یا رجسٹری حوالہ
- `status`: اختیاری کاروباری حیثیت کا متن
- `metadata`: کاروباری تناظر اور انڈیکسنگ کے لیے استعمال ہونے والے کمپیکٹ JSON فیلڈز۔
- `parents`: اس بیچ کو حاصل کرنے کے لئے استعمال ہونے والے ماخذ کی کھیپیں
- `controls`: کنٹرولر اکاؤنٹس، کنٹرولر کے کردار اور کنٹرولر کی فعال کارروائی
- `is_frozen` اور `held_quantity`: چلانے کے وقت کی طرف سے نافذ زندگی سائیکل ریاست

چین پر پے لوڈ کو کمپیکٹ رکھیں۔ WSV کے باہر بڑے قانونی دستاویزات ، معائنہ کی رپورٹیں اور آڈٹ بنڈل ذخیرہ کریں ، پھر URI ، SoraFS راستہ ، یا RWA میٹا ڈیٹا میں واضح حوالہ دیں۔

## شناخت کنندہ {#identifiers}

`RegisterRwa` کال کرنے والے کے منتخب کردہ `id` کو قبول نہیں کرتا، اور یہ ایک `owner` فیلڈ کو قبول نہیں کرتی۔ ٹرانزیکشن اتھارٹی ابتدائی `owned_by` اکاؤنٹ بن جاتی ہے، اور رن ٹائم ہدف ڈومین میں `RwaId` پیدا کرتی ہے۔

RWA ID کے متن کی شکل یہ ہے:

```text
<generated-hash>$<domain>
```

مثلاً:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

ایپلی کیشنز کو `primary_reference` یا `metadata` میں اپنے کاروباری شناختی کارڈ کو ذخیرہ کرنا چاہئے، پھر `RwaEvent::Created`، `FindRwas`، `/v1/rwas` سے پیدا ہونے والی `RwaId` یا ٹرانزیکشن کے بعد مقرر کردہ ایکسپلورر روٹ کا پتہ لگانا چاہئے.

## لائف سائیکل {#lifecycle}

RWA کام کے عام بہاؤ میں شامل ہیں:

|آپریشن |عملدرآمد شدہ رویہ |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |ایک ڈومین میں پیدا- ID لاٹ بنائیں؛ ٹرانزیکشن اتھارٹی `owned_by` بن جاتا ہے. |
|`TransferRwa` |مقدار کو کسی دوسرے اکاؤنٹ میں منتقل کریں۔ ایک مکمل منتقلی `owned_by` تبدیل کر سکتی ہے۔ جزوی منتقلی سے پیدا ہونے والی بچے کی تعداد پیدا ہوتی ہے۔ |
|`HoldRwa` |ذخیرہ کی مقدار۔ ایک ترتیب شدہ کنٹرولر اور `hold_enabled` کی ضرورت ہوتی ہے۔ |
|`ReleaseRwa` |برقرار رکھا مقدار کو ہٹا دیں۔ ایک ترتیب شدہ کنٹرولر اور `hold_enabled` کی ضرورت ہوتی ہے۔ |
|`FreezeRwa` |عام مالک کی کارروائیوں کو بلاک کریں۔ ایک تشکیل شدہ کنٹرولر اور `freeze_enabled` کی ضرورت ہوتی ہے۔ |
|`UnfreezeRwa` |عام مالک کے آپریشنز کو دوبارہ فعال کریں۔ ایک تشکیل شدہ کنٹرولر اور `freeze_enabled` کی ضرورت ہے۔ |
|`RedeemRwa` |ریٹائرمنٹ کی مقدار۔ مالک یا کنٹرولر اور `redeem_enabled` کی ضرورت ہوتی ہے۔ |
|`MergeRwas` |ایک ہی ڈومین اور تفصیلات کے ساتھ والدین کی کھیپوں سے پیدا ہونے والے بچے کی کھیپی میں مقدار کو یکجا کریں۔ |
|`ForceTransferRwa` |ایک کنٹرولر بہاؤ کے ذریعے مقدار منتقل کریں۔ ایک تشکیل شدہ کنٹرولر اور `force_transfer_enabled` کی ضرورت ہوتی ہے۔ |
|`SetRwaControls` |لاٹ کنٹرول پالیسی کی جگہ لے لو۔ مالک یا کنٹرولر کی ضرورت ہے۔ |
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |لوٹ میٹا ڈیٹا کو اپ ڈیٹ کریں۔ مالک یا کنٹرولر کی ضرورت ہے۔ منجمد لوٹس کو کنٹرولر درکار ہے۔ |

موجودہ کوڈ میں کوئی `UnregisterRwa` ہدایات نہیں ہیں۔ جب نمائندگی کی گئی مقدار پہنچائی جاتی ہے ، کھاتی ہے ، آباد کی جاتی ہے یا دوسری صورت میں گردش سے ہٹا دی جاتی ہے تو `RedeemRwa` کے ساتھ ایک آف چین لاٹ کو واپس لینا۔

## میٹا ڈیٹا اور کنٹرولز {#metadata-and-controls}

ٹھوس حقائق کے لئے میٹا ڈیٹا کا استعمال کریں جو ایپلی کیشنز کو بیچ کی نشاندہی اور تصدیق کرنے میں مدد فراہم کرتے ہیں:

- اثاثہ کلاس ، جاری کنندہ ، محافظ یا رجسٹری حوالہ
- گودام، خفیہ خانہ، ISIN، انوائس یا سرٹیفکیٹ کی شناخت کنندہ
- تصدیق ناموں اور قانونی دستاویزات کے لئے مواد ہیش
- SoraFS بڑے ثبوتوں کے لئے راستے یا واضح حوالہ جات۔
- غیر منسلک خدمات کے ذریعہ استعمال ہونے والے میعاد ، دائرہ اختیار ، یا تعمیل ٹیگ

نافذ کردہ `RwaControlPolicy` میں درج ذیل فیلڈز ہیں:

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

کنٹرولر اکاؤنٹس اور کرداروں کو صرف ان کنٹرولر آپریشنز کو انجام دینے کی اجازت ہے جو متعلقہ بولین پرچم کے ذریعہ قابل بناتے ہیں۔ موجودہ کنٹرول پیسے کا بوجھ اجازت نامے کی منتقلی کی پالیسی نہیں ہے اور اس میں گھومنے والے `transfers` قواعد موجود نہیں ہیں۔

## سوالات، واقعات، اور APIs {#queries-events-and-apis}

استعمال [`FindRwas`](/ur/reference/queries.md#assets-nfts-and-rwas) رجسٹرڈ فہرست میں RWA بہت سے. ایپلی کیشنز کو جو براہ راست اپ ڈیٹس کی ضرورت ہے subscribe کر سکتے ہیں [`Rwa` ڈیٹا کے واقعات](/ur/blockchain/filters.md#data-event-filters) تخلیق، مالک کی تبدیلی، تقسیم، ضم، واپسی، منجمد، غیر منجمد، برقرار رکھنے، جاری کرنے، زبردستی منتقل، کنٹرول تبدیل کرنے کے لئے، اور میٹا ڈیٹا واقعات.

Torii سلسلہ ریاست کے راستے کو ظاہر کرتا ہے جیسے: `/v1/rwas` اور `/v1/rwas/query`, اس کے علاوہ دریافت کرنے والے راستوں جیسے `/v1/explorer/rwas` اور `/v1/explorer/rwas/{rwa_id}` جب اس روٹ فیملی کو چالو کیا گیا ہے. پیدا کردہ گاہکوں کو براہ راست [`/openapi`](/ur/reference/torii-endpoints.md#common-endpoints) ایک نوڈ کی طرف سے نمائش کے عین مطابق جواب شکل کے لئے دستاویز.

### Taira پر آزمائیں {#try-it-on-taira}

چیک کریں کہ کیا عوامی Taira نے فی الحال RWA کے ٹکڑے درج کیے ہیں:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

RWA راستوں کی فہرست درج کریں جو براہ راست Taira OpenAPI دستاویز کے ذریعہ سامنے ہیں:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

خالی `items` آؤٹ پٹ کی توقع کی جاتی ہے جب ابھی تک کوئی عوامی پارٹس رجسٹرڈ نہیں ہوئی ہیں۔ رجسٹریشن ، منتقلی ، برقرار رکھنے ، منجمد کرنے اور بازیابی کے معاہدے پر دستخط کیے گئے ہیں۔

## کوشش کرو {#try-it}

مندرجہ ذیل مثالوں میں Python SDK کی سطح کا استعمال کیا جاتا ہے [شراکت شدہ سیٹ اپ](/ur/guide/tutorials/python.md#shared-setup). ٹرانزیکشن بھیجنے سے پہلے اپنے نیٹ ورک سے اقدار کے ساتھ اکاؤنٹ IDs، نجی چابیاں اور پیدا کردہ لاٹ IDs کو تبدیل کریں۔

### RWA API راستوں کی دریافت کریں {#discover-rwa-api-routes}

یہ صرف پڑھنے والا مثال چل رہا ہے Torii نوڈ سے پوچھتا ہے کہ ایپ کی طرف رخ کرنے والے RWA راستوں کو فعال کیا گیا ہے:

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

اگر فہرست خالی ہے تو، نوڈ اب بھی دیگر Torii APIs کے ذریعے RWA ہدایات اور سوالات کی حمایت کر سکتا ہے، لیکن یہ اختیاری JSON روٹ فیملی کو ظاہر نہیں کرتا.

### ایک گودام کی رسید درج کریں {#register-a-warehouse-receipt}

ایک ڈرافٹ کا استعمال کریں جب ایک کاروباری کارروائی ایک دستخط شدہ لین دین بن جائے۔ کاروبار کی رسید نمبر `primary_reference` میں جاتا ہے؛ لیجر ID لین دین کے معاہدوں کے بعد پیدا ہوتا ہے۔

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

ٹرانزیکشن کے پابند ہونے کے بعد ، فہرست تیار کی جاتی ہے RWA IDs. سلسلہ ریاست راستوں میں کینیکل IDs کو بے نقاب کیا جاتا ہے۔ جب آپ کو ایک ID کو `primary_reference` یا میٹا ڈیٹا سے ملانے کی ضرورت ہو تو واقعات کا استعمال کریں یا دریافت کنندہ تفصیلات کے راستے:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

ایکسپلورر کے قابل نوڈ بھی امیر پروجیکشن واپس کر سکتے ہیں:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### عارضی رکاوٹ کے ساتھ منتقلی {#transfer-with-a-temporary-hold}

سلسلہ کی طرف سے واپس پیدا RWA ID کا استعمال کریں. اس مثال میں فرض کیا جاتا ہے کہ `alice` مالک ہے اور یہ بھی ایک کنٹرولر کے طور پر تشکیل دیا گیا ہے جس میں `hold_enabled`.

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

جب غیر منسلک عمل مکمل ہو جائے تو ہولڈ کو جاری کریں:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### کنٹرولز اور آڈٹ میٹا ڈیٹا شامل کریں۔ {#add-controls-and-audit-metadata}

کنٹرولز اور میٹا ڈیٹا الگ ہیں۔ کنٹرولر پالیسی کے لئے کنٹرولز کا استعمال کریں ، اور حقائق کے لئے میٹا ڈیٹا جو ایپلی کیشنز یا آڈیٹرز کو دکھانے کی ضرورت ہے:

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

### واپسی یا ریٹائرمنٹ کی مقدار {#redeem-or-retire-quantity}

واپسی کی مقدار جب نمائندگی کردہ آف چین اثاثہ پہنچایا گیا ہے، استعمال کیا گیا ہے، ریٹائرڈ یا دوسری صورت میں گردش سے ہٹا دیا گیا ہے۔ اس بیچ میں `redeem_enabled` ہونا ضروری ہے، اور دستخط کنندہ مالک یا ایک کنٹرولر ہونا ضروری ہے۔

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### تعمیل کا جائزہ لینے کے دوران منجمد کریں {#freeze-during-compliance-review}

جب غیر منسلک جائزہ لینے سے عام مالک کی کارروائیوں کو روکنا پڑتا ہے تو بہت زیادہ منجمد کریں۔ دستخط کنندہ ایک کنٹرولر ہونا ضروری ہے اور بیچ میں `freeze_enabled` ہونا چاہئے.

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

جائزہ لینے کے بعد اسے ٹھنڈا کریں:

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

### انوائس وصولی {#invoice-receivable}

RWA بیچ کے طور پر ایک انوائس کی نمائندگی کریں، جس میں `primary_reference` میں انوائس نمبر اور میٹا ڈیٹا ذخیرہ کیا جائے۔ رجسٹریشن کے بعد، منتقلی اور واپسی کے لئے پیدا کردہ ID کا استعمال کریں.

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

جب موصولہ رقم کی مالی اعانت یا ادائیگی کی جاتی ہے تو، پیدا ہونے والے انوائس کا ٹکڑا ID استعمال کریں:

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

غیر سلسلہ بندی کے بعد نمائندگی کی گئی رقم کو چھڑانا:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### کاربن کریڈٹ ریٹائرمنٹ {#carbon-credit-retirement}

کریڈٹ کا دعوی کرنے کے بعد ریفریجریشن استعمال کریں. میٹا ڈیٹا آف چین سرٹیفکیٹ یا رجسٹری ثبوت کی طرف اشارہ کرتا ہے:

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

### دو ٹکڑے مل جائیں {#merge-two-lots}

جب دو آف چین پوزیشنوں کو مستحکم کیا جاتا ہے تو لوٹ ضم کریں۔ والدین کو ایک ہی ڈومین میں ہونا ضروری ہے اور ایک ہی مقدار کی وضاحت کا استعمال کرنا چاہئے۔ رن ٹائم بچہ لوٹ پیدا کرتا ہے۔ ID

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

Python ٹرانزیکشن کی مکمل مثال کے لئے، دیکھیں [ریئل ورلڈ اثاثے ](/ur/guide/tutorials/python.md#real-world-assets)۔

## متعلقہ دستاویزات {#related-docs}

- [اثاثہ جات](/ur/blockchain/assets.md)
- [میٹا ڈیٹا](/ur/blockchain/metadata.md)
- [Iroha خصوصی ہدایات](/ur/blockchain/instructions.md)
- [سوالات](/ur/reference/queries.md#assets-nfts-and-rwas)
- [Torii اختتام پوائنٹس](/ur/reference/torii-endpoints.md#app-and-sora-route-families)
