---
translation_locale: ur
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ Iroha کے منتخب کردہ عملدرآمد اثرات کے لئے STARK ثبوت کا راستہ ہے۔ یہ معمول کے لین دین کے عملدرآمد یا اتفاق رائے کی جگہ نہیں لیتا۔ ٹرانزیکشنز اب بھی معمول کے مطابق ISI, IVM ، اور Sumeragi کے ذریعے چلتی ہیں۔ FastPQ Deterministic execution witness کو استعمال کرتا ہے اور حمایت یافتہ اثرات کو ثبوت کے بیچوں میں بدل دیتا ہے۔

موجودہ میزبان انٹیگریشن میں دو اہم راستے ہیں:

- بلاک پر عملدرآمد کے دوران ریکارڈ کئے گئے شفاف عددی اثاثے کی منتقلی
- SORA Nexus کے AXT ثبوت کے لفافے جن کا `fastpq_binding` ایک FastPQ وابستگی رکھتا ہے

## گواہوں کا راستہ منتقل کریں {#transfer-witness-path}

شفاف عددی منتقلیاں ایک منظم منتقلی ٹرانسکرپٹ تخلیق کرتی ہیں جب ہدایات بیلنس کو تبدیل کرتی ہیں۔ ٹرانسکریپٹ ریکارڈ:

- ماخذ اکاؤنٹ، منزلہ اکاؤنٹ، اثاثے کی تعریف اور رقم
- منتقلی سے پہلے اور بعد میں بھیجنے والے اور وصول کرنے والے کے بیلنس
- ٹرانزیکشن انٹری پوائنٹ ہیش کے طور پر استعمال کیا جاتا ہے
- جمع کرانے والے اکاؤنٹ سے حاصل کردہ اتھارٹی کا ڈائجسٹ
- سنگل ڈیلٹا ٹرانسکرپٹ کے لئے پوزیڈون کا ڈائجسٹ

بیچ ٹرانسفر میں متعدد ڈیلٹا کے ساتھ ایک نقل کا استعمال ہوتا ہے۔ اس صورت میں واحد ڈیلٹا پوزیڈون ڈائجسٹ غائب ہے۔

بلاک کو حتمی شکل دینے پر ، Iroha ان ٹرانسکرپٹ کو اندراج نقطہ ہیش کے ذریعہ گروپ کرتا ہے۔ عملدرآمد کا گواہ پھر اصل ٹرانسکریپٹ بنڈل اور FastPQ ٹرانزیشن بیچ دونوں لے جاتا ہے جو پروور کے لئے تیار کیا گیا تھا۔

ہر ٹرانسفر ڈیلٹا دو منتقلی صفوں میں بدل جاتا ہے:

|صف |کلیدی شکل |پری ویلیو |پوسٹ ویلیو |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|بھیجنے والا ڈیبٹ |`asset/<asset-definition>/<source-account>` |بھیجنے والے بیلنس سے پہلے |بھیجنے والے بیلنس کے بعد|
|وصول کنندہ کریڈٹ |`asset/<asset-definition>/<destination-account>` |وصول کنندہ بیلنس سے پہلے | کے بعد وصول کنندہ بیلنس|

عددی اقدار کو عددی گواہ اکائیوں میں معمول پر لایا جاتا ہے۔ FastPQ بیچنگ کے لئے ایک قدر مسترد کردی جاتی ہے اگر اسے منتخب شدہ اعشاریہ پیمانے پر غیر منفی `u64` کے طور پر نمائندگی نہیں کی جاسکتی ہے۔

## عوامی ان پٹ {#public-inputs}

ہر FastPQ منتقلی بیچ میں عوامی ان پٹ ہوتے ہیں جو ثبوت کو بلاک اور عمل درآمد کے تناظر سے منسلک کرتے ہیں:

|ان پٹ |معنی |
| ------------- | --------------------------------------------------------------- |
| `dsid` | لٹل اینڈین بائٹس میں انکوڈ کردہ ڈیٹا اسپیس شناخت کنندہ |
|`slot` |بلاک تخلیق کا وقت نینو سیکنڈ میں تبدیل |
| `old_root` | اجرا کے گواہ سے اخذ کردہ سابقہ حالت کا روٹ |
| `new_root` | اجرا کے گواہ سے اخذ کردہ بعد کی حالت کا روٹ |
|`perm_root` |فعال کردار کی اجازتوں پر پوزیڈون کا عزم |
|`tx_set_hash` |ٹرانزیکشن اور ٹائم ٹرگر انٹریپوائنٹ ہیشز کے اوپر ہاش|

میزبان ان بیچوں کے لیے پہلی ریلیز کا واحد پیرامیٹر سیٹ، `fastpq-state-transition-stark-v1`، استعمال کرتا ہے۔

## ثبوت کا پروٹوکول {#proof-protocol}

کینونیکل ٹرانسفر آرٹیفیکٹس گولڈی لاکس فیلڈ پر ڈگری 4 کی توسیع کے ساتھ ماسک شدہ DEEP ثبوت ہیں۔ ان کا عین تعلق، ٹرانسکرپٹ اور استفسار کی جیومیٹری پن کیے گئے [FastPQ DEEP پروٹوکول معاہدے](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md) میں متعین ہیں۔

## معانی کا کیا جائزہ لیا جاتا ہے {#what-the-prover-checks}

ٹریس بنانے سے پہلے ، FastPQ پروور منتقلی کی کلید ، آپریشن رینج اور داخل کرنے کے آرڈر کے ذریعہ بیچ آرڈر کو کینونائز کرتا ہے۔ ٹرانسفر لائنوں میں ٹرانسکرپٹ میٹا ڈیٹا کی بھی ضرورت ہوتی ہے۔ ایک بیچ جس میں ٹرانسپیر لائنیں ہیں لیکن کوئی ٹرانسفارٹ ٹرانسکریپٹ موجود نہیں ہے وہ غلط ہے۔

ٹرانسفر ٹرانسکرپٹ کے لئے، پروور سائیڈ چیک میں شامل ہیں:

- بھیجنے والے کا بیلنس صفر سے کم نہیں ہونا چاہیے، یعنی underflow نہیں ہونا چاہیے۔
- `sender_after` برابر ہونا چاہئے `sender_before - amount`
- `receiver_after` برابر ہونا چاہئے `receiver_before + amount`
- ٹرانسکرپٹ کو بیچ میں ہر منتقلی کی قطار پر مشتمل ہونا چاہئے۔
- ایک واحد ڈیلٹا پوزیڈون ڈائجسٹ ، جب موجود ہو تو ، ٹرانسکرپٹ پری امیج سے ملنا چاہئے
- اس صورت میں شاذ و نادر مرکل ثبوتوں کو ورژن 1 کے طور پر ڈیکوڈ کرنا ہوگا؛ لاپتہ راستے deterministic synthetic proofs سے بھرے جاتے ہیں.

ٹریس میں ٹرانسفر ، مائنٹ ، برن ، رول تفویض ، رول منسوخی ، میٹا ڈیٹا سیٹ ، اور اجازت تلاش کرنے کی قطاروں کے لئے سلیکٹر کالم شامل ہیں۔ عددی آپریشن لائنز میں دستخط شدہ ڈیلٹا بھی ہوتے ہیں ، ہر اثاثہ پر چلنے والے ڈیلٹا اور سپلائی کاؤنٹرز۔

## پروور لین {#prover-lane}

`iroha3d` شروع ہونے پر FastPQ prover lane کو شروع کرتا ہے اگر پروور بیک اینڈ کو ابتدائی بنایا جاسکتا ہے۔ لین ایک محدود قطار کے ساتھ پس منظر کا کام ہے۔ ایک بلاک کے عملدرآمد کے گواہ کی پیداوار کے بعد ، commit path ایک پروور ٹاسک پیش کرتا ہے جس میں بلاک ہیش ، اونچائی ، نظارہ اور گواہ شامل ہیں۔

اگر لین چل نہیں رہی یا قطار بھری ہوئی ہے تو یہ کام چھوڑ دیا جاتا ہے اور بلاک پر معمول کی کارروائی جاری رہتی ہے۔ پس منظر میں ثبوت بنانے والی لین ٹرانزیکشن کے داخلے یا اتفاقِ رائے کی شرط نہیں ہے۔ یہ پہلے سے مکمل شدہ عمل درآمد کے نتیجے میں حاصل ہونے والی حالت کا ثبوت بناتی ہے۔

لین ایک پروور کی تعمیر کرتا ہے جس میں:

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

دونوں ترتیبات بطور ڈیفالٹ `cpu` استعمال کرتی ہیں۔ `gpu` کا انتخاب ایک واضح fail-closed درخواست ہے: اگر GPU سپورٹ compile نہیں کی گئی یا مطلوبہ GPU backend preflight میں ناکام ہو جائے تو prover lane غیر فعال رہتی ہے۔ پہلی ریلیز میں کوئی `auto` قدر نہیں ہے اور مطلوبہ GPU mode سے CPU پر fallback نہیں کیا جاتا۔

## تصدیق {#verification}

FastPQ ثبوت کی توثیق کینیکل بیچ کے وعدے کو دوبارہ بناتی ہے اور عوامی ٹرانسکرپٹ کو تبدیل کرتی ہے۔ تصدیق کنندہ پروٹوکول ورژن ، پیرامیٹر سیٹ ورژن ، ری پلے کی حدود ، سراغ لگانے کا عہد ، عوامی ان پٹس ، نمونے لینے والے میرکل اوپننگز ، AIR اوپننگس ، اور FRI استفسار چین کی جانچ پڑتال کرتا ہے۔

ڈیفالٹ ری پلے کی حدود میں شامل ہیں:

|حد |ڈیفالٹ |
| ------------------ | ------: |
|منتقلی کی صفیں |     256 |
|بیچ پلے لوڈ کا سائز |256 KiB |
|FRI تہوں |      16 |
|استفسار openings |     128 |

## SORA Nexus کے AXT ثبوت کے لفافے {#sora-nexus-axt-proof-envelopes}

SORA Nexus کے AXT ثبوت کے لفافوں میں `AxtFastpqBinding` شامل ہو سکتا ہے۔ AXT لفافوں کی بلاک توثیق، IVM ہوسٹ کی AXT لفافہ جانچیں، اور `RegisterVerifiedFeeSponsorVaultAllocation` لفافے کا `fastpq_binding` لازم کرتی ہیں، اسے متوقع دعوے کے مقابل جانچتی ہیں، اور لفافے اور اس میں شامل ثبوت پر FastPQ ویریفائر چلاتی ہیں۔ وابستگی کی عدم موجودگی یا ناکام تصدیق آپریشن کو مسترد کر دیتی ہے۔

### AXT پابند ریاضی {#axt-binding-math}

SORA Nexus کے AXT لفافوں میں ثبوت دوبارہ چلانے سے پہلے `AxtFastpqBinding` کو کینونیکل صورت دی جاتی ہے۔ خالی `parameter`، `verifier_id` یا `verifier_version` قدریں مسترد کر دی جاتی ہیں؛ ویریفائر ID لازماً `fastpq` اور ورژن `v1` ہونا چاہیے، اور زیرِ نگہداشت AXT عمل `fastpq-state-transition-stark-v1` استعمال کرتے ہیں۔ دعوے کی قسم کے اطراف کی خالی جگہ ہٹائی جاتی ہے اور حروف چھوٹے کیے جاتے ہیں۔

AXT FastPQ عوامی ان پٹس ڈیٹرمینسٹ بائٹ ہیش ہیں:

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

AXT منتقلی کی چابیاں ہیں:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` دعوے میں رول تفویض لائن داخل کی جاتی ہے:

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

اور اجازت کی پالیسی سے وابستہ ایک میٹاڈیٹا قطار۔ `compliance` دعویٰ دو میٹاڈیٹا قطاریں شامل کرتا ہے: ایک پالیسی کے لیے اور دوسری ہدف ڈیٹا اسپیسز کے لیے۔

`tx_predicate` اور `value_conservation` کے لئے، ایک واضح اثر کی مقدار کا استعمال کیا جاتا ہے جب پابندیاں ایک مثبت ذریعہ یا منزل مقصود مقدار پر مشتمل ہوتی ہیں. دوسری صورت میں کوڈ ایک محدود تعیناتی مقدار سے اخذ کرتا ہے:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

اس کے بعد اسی منتقلی مساوات کا استعمال کیا جاتا ہے:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

مصنوعی بھیجنے والے اور وصول کنندہ اکاؤنٹ کی شناخت کلیدی بیجوں سے پیدا کی جاتی ہے:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

ٹرانسفر بیچ ہیش ہے:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT بیچ مینی فیسٹ ڈائجسٹ کینیکل بائنڈنگ کی Norito کوڈنگ پر SHA-256 ہے۔

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## پیرامیٹر سیٹ {#parameter-sets}

پہلی ریلیز میں بالکل ایک کینونیکل پیرامیٹر سیٹ ہے، `fastpq-state-transition-stark-v1`۔ یہ ڈگری 4 کی توسیع (`X^4 - 7`) والی گولڈی لاکس فیلڈ پر 128 بٹ سیکیورٹی کا ہدف رکھتا ہے، اور ٹریس سائز `2^16`، LDE سائز `2^19`، FRI کی شاخ کاری 2، بلو اپ 8، زیادہ سے زیادہ 17 تخفیفیں اور 136 استفسارات استعمال کرتا ہے۔

## ترتیب {#configuration}

FastPQ ترتیب `zk.fastpq` کے تحت گھونسلا ہے.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false
```

اسی عمل اور ٹیلی میٹری لیبلز کو `iroha3d` سے ختم کیا جاسکتا ہے:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

ترتیب کے شعبوں کے لئے ماحولیاتی متغیرات کی بھی حمایت کی جاتی ہے۔ FastPQ مخصوص متغیر میں شامل ہیں:

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`

## میٹرکس {#metrics}

ٹیلی میٹری فعال ہونے پر FastPQ منتخب بیک اینڈ اور Metal کے رن ٹائم کی کارکردگی سے متعلق پیمائشیں فراہم کرتا ہے:

|میٹرک |معنی |
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |بیک اینڈ اور ڈیوائس لیبلز کی طرف سے مطلوبہ اور حل شدہ عملدرآمد موڈ |
|`fastpq_poseidon_pipeline_total` |پوزیڈون پائپ لائن کا مطلوبہ اور حل راستہ |
| `fastpq_metal_queue_depth` | حدِ قطارِ Metal، بیک وقت جاری کاموں کی زیادہ سے زیادہ تعداد، بھیجے گئے کاموں کی تعداد، اور نمونہ گیری کا دورانیہ |
|`fastpq_metal_queue_ratio` |Metal queue کا مصروف اور overlap تناسب |
|`fastpq_zero_fill_duration_ms` |میٹل رن کے لئے میزبان صفر بھرنے کی مدت |
|`fastpq_zero_fill_bandwidth_gbps` |حاصل صفر بھرنے بینڈوڈتھ |

عام کارکردگی کی درجہ بندی کے لئے، [پروفیشن اور میٹرکس ](/ur/guide/advanced/metrics.md) میں درج کردہ اتفاق رائے اور قطار سگنل کے ساتھ ان کا استعمال کریں۔

## متعلقہ حوالہ جات {#related-reference}

- [node-authoritative type snapshot کے لئے ڈیٹا ماڈل اسکیم](/ur/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ اختیارات ](/ur/reference/iroha3d-cli.md#fastpq-overrides)
