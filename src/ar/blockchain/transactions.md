---
translation_locale: ar
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# المعاملات {#transactions}

(أ) **المعاملة** هو طلب موقّع لتنفيذ العمل على بلوكتشين.
يمكن أن يكون الحمل المفيد التنفيذي تسلسلًا منظمًا من
[التعليمات](./instructions.md), مكالمة عقدية IVM رمز البايت، أو
أثبت IVM الإعدام [العقود الذكية](./smart-contracts.md) للجريان
نموذج تنفيذ العقود

تقوم المعاملات بتغيير الحالة أو عمل يمكن تنفيذه.
تستخدم استفسارات موقعة أو نقاط نهاية قراءة عامة ولا تخلق معاملة.

يتم تخزين المعاملة التي تم قبولها في كتلة ملتزمة مع تنفيذها
النتيجة، بما في ذلك رفض تنفيذ الطلبات التي رفضت قبل الحظر
القبول، مثل غلاف غير صالح أو معاملة رفضها الصف
لا يتم تخزينها في كتلة.

للحفاظ على الخصوصية حركة الأصول، انظر
[المعاملات المجهولة](./anonymous-transactions.md). مجهول
يتم استخدام المعاملات على أوراق الأصول المحمية والالتزامات والإبطالات،
إثبات عدم وجود معرفة بدلاً من تغييرات في رصيد الحسابات العامة.

للحصول على دليل على تأثيرات تنفيذية شفافة مختارة، انظر
[FastPQ](./fastpq.md). FastPQ تستهلك شهود الإعدام بعد العادة
تنفيذ المعاملات وبناء دفعات دليل تحديدية لدعم
الانتقالات الحكومية

## جربها Taira {#try-it-on-taira}

استخدم طرق المكشفين للتفتيش على الجمهور الأخير Taira الكتل والمعاملات
الوضع بدون حساب التوقيع:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

لمتابعة معاملة قدمتها تطبيقك في وقت سابق، نسخ `hash` من
إدراج وتفتيش مسار المكثفين بالتفصيل:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

هذا لا يزال قراءة فقط. تقديم معاملة تتطلب توقيع Norito
غلاف، سلسلة صحيحة ID, البيانات المتعلقة بالرسوم، والمدفوعة من النوافذ Taira الحساب

على سبيل المثال: Taira, إنقاذ مساعدة المياه من
[احصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
كما `taira_faucet_claim.py`, ثم تمويل الموقّع من خلال الصنبور العام
أولاً:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

إذا عادت لغز المياه أو مسار المطالبة `502`, انتظر وتحاول مرة أخرى قبل
إصلاح المعاملة نفسها.

ثم ضعه Taira البيانات الوصفية للأصول عند تقديم المعاملة:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## المعاملات خارج الإنترنت {#offline-transactions}

Iroha لديها عمليات عمل لعمليات خارج الاتصال:

- **التوقيع خارج الإنترنت** يخلق صفقة معينة وقعت أثناء التوقيع
  يتم فصل الجهاز. لا يتم معالجة المعاملة حتى
  يقوم العميل بإرسال الطرد الموقّع إلى Torii, لذلك لا يزال يحتاج
  السلسلة الصحيحة ID, السلطة والإذن والرسوم وطول عملها.
- **كاغيموشا النقدية خارج الاتصال** يضع على محفظة أثناء وجودها على الإنترنت، يدعم
  إرسال المحفظة إلى المحفظة التي يبدأها المستلم بينما تكون كلتا المحفظتين
  خارج الاتصال، وتستبدل حالة الملاحظة الناتجة عندما يعود المستلم
  على الإنترنت

Torii يعرض دورة حياة كاغيموشا الكاملة تحت `/v1/offline/*`:

| الطريقة والنقطة النهائية | الغرض |
| --- | --- |
| `GET /v1/offline/readiness` | تقييم استعداد كاغيموشا `asset_definition_id` |
| `POST /v1/offline/receiver-lineage` | تحل سلسلة التسجيل النشط التي تحمل الأدلة لطلب المقبل الموقع |
| `POST /v1/offline/top-up` | تقديم عملية إضافية موقعة من الإنترنت إلى الخارجي |
| `POST /v1/offline/redeem` | إرسال عملية استرداد غير متصلة بالتوقيع |
| `GET /v1/offline/operations/{operation_id}` | اقرأ الحالة الكنسية لمكملة أو فداء |

التحقق من استعداد الأصول قبل بناء عملية خارج الاتصال:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

الاستعداد يربط المحفظة بالجسر النشط ABI 21 والصديق عليها V4
مجموعة من الأثاث. تطبيق النسل، التكامل، وطلبات الفدية
`application/x-norito` الأرشيفات، إعادة التكامل وإعادة الفدية `202 Accepted`
مع a `Location` الرأس الذي يشير إلى مصدر التشغيل؛
العملية غير الصفر ID يوفر مفتاح الإستقلال

التدفق النموذجي هو:

1. استجواب الاستعداد ووقف إذا `ready` كذب أو أي مسدس يطبق.
2. استخدم طابعاً Swift أو JVM محفظة لبناء الأرشيف القنوني المضاف،
   تقديمها، والحفاظ على كل من حالة ورقة الدخول وتشغيلها ID حتى
   التشغيل يصل إلى حالة سلسلة نهائية.
3. تحل سلسلة تسجيل المستقبل عند الضرورة، والبناء والعمل
   التحقق من كل إرسال أقرانه محليًا ، واستمر في وضع الملاحظة المشفرة
   قبل الاعتراف بالتحويل
4. عندما يكون المستلم على الإنترنت، إنشاء أرشيف فداء القنوني،
   تقديمها، والمسح الموارد التشغيلية حتى النهاية.

لا يمكن للكتيب أن يلاحظ التسليم الخارجي المتناقض حتى حالة الملاحظة
العائدات خلال دورة الحياة عبر الإنترنت.
لذلك تنفيذ حدود القيمة، انتهاء الصلاحية، المصدرين المقبولين، المحلية الدائمة
التخزين، ونوافذ المصالحة.

وهنا مثال على إنشاء معاملة جديدة مع `Grant`
في هذه المعاملة، الفأر يمنح أليس المحدد
الدور (`role_id`التحقق)
[مثال كامل](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
