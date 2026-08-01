---
translation_locale: ar
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# المعاملات {#transactions}

المعاملة هي طلب موقع لتنفيذ العمل على بلوكتشين. يمكن أن يكون الحمل المفيد التنفيذي تسلسلًا من [ التعليمات ](./instructions.md) ، أو مكالمة عقدية ، أو رمز البايت IVM ، أو تنفيذ مثبت IVM. انظر [العقود الذكية](./smart-contracts.md) لنموذج تنفيذ العقد الحالي.

تقوم المعاملات بتغيير الحالة أو العمل القابل للتنفيذ. تستخدم التفتيش القائم على القراءة فقط استفسارات موقعة أو نقاط نهاية قراءة عامة ولا تخلق معاملة.

يتم تخزين المعاملة التي تم قبولها في كتلة ملتزمة مع نتيجة تنفيذها، بما في ذلك رفض التنفيذ. لا يتم تخزينه في كتلة الطلبات التي تم رفضها قبل إدخال الكتلة، مثل غلاف غير صالح أو معاملة رفضها من خلال الصف.

للحفاظ على الخصوصية حركة الأصول ، انظر [ المعاملات المجهولة ](./anonymous-transactions.md). تستخدم المعاملات غير المجهولة أوراق الأصول المحمية والالتزامات والإبطالات وأدلة عدم معرفة الصفر بدلاً من تغييرات الرصيد بين الحسابات العامة.

للحصول على أدلة إثباتية حول تأثيرات التنفيذ الشفافة المختارة ، انظر [FastPQ](./fastpq.md). FastPQ يستهلك شهود التنفيذي بعد تنفيذ المعاملة العادية ويتم بناء دفعات دليل تحديدية للانتقالات المدعومة للحالة.

## جربوا ذلك على Taira {#try-it-on-taira}

استخدم طرق الاستكشاف للتفتيش على الكتل العامة الأخيرة ووضع المعاملات Taira دون حساب توقيع:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

لمتابعة المعاملة التي قدمتها تطبيقك في وقت سابق، نسخ `hash` من القائمة وتفحص مسار التفاصيل المستكشف:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

لا تزال هذه المعاملة قابلة للقراءة فقط. يحتاج تقديم معاملة إلى ملف Norito موقّع، سلسلة صحيحة ID، بيانات metadata الرسوم، وحساب تمويله من النوافذ Taira.

على سبيل المثال: Taira, إنقاذ مساعدة المياه من [احصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) كما `taira_faucet_claim.py`, ثم تمويل الموقّع من خلال الصنبور العام أولاً:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

إذا عادت لغز النوافذ أو مسار المطالبة `502` ، انتظر وتحاول مرة أخرى قبل إصلاح الصفقة نفسها.

ثم ضمنت البيانات الأساسية لعملة الرسوم Taira عند تقديم الصفقة:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## المعاملات الخارجة عن الإنترنت {#offline-transactions}

Iroha يحتوي على اثنين من عمليات العمليات خارج الاتصال:

- يخلق التوقيع الخارجي معاملة موقعة طبيعية بينما يتم فصل جهاز التوقيع. لا يتم معالجة المعاملة حتى يقوم العميل عبر الإنترنت بإرسال المغلف الموقع إلى Torii ، لذلك لا يزال يحتاج إلى السلسلة الصحيحة ID والسلطة والأذونات والرسوم وطول حياة المعاملة.
- يقوم كاغيموشا بالعملات النقدية الخارجة عن الإنترنت بتصنيف محفظة أثناء وجودها على الإنترنت، ويدعم التسليم من المحفظة إلى المحفظة الذي يبدأه المستلم أثناء وجود كلتا المحفظتين خارج الإنترنت، ويستبدل حالة الملاحظة الناتجة عندما يعود المتلقي على الإنترنت.

Torii يعرض دورة حياة كاغيموشا الكاملة في `/v1/offline/*`:

|الطريقة والنقطة النهائية|الغرض|
| --- | --- |
|`GET /v1/offline/readiness` |تقييم استعداد كاغموشا لـ `asset_definition_id` |
|`POST /v1/offline/receiver-lineage` |الحل لسلسلة التسجيل النشطة التي تحمل الدليل لطلب المقبل الموقع |
|`POST /v1/offline/top-up` |تقديم عملية إضافية موقعة من الإنترنت إلى الخارجي |
|`POST /v1/offline/redeem` |إرسال عملية استرداد غير متصلة بالتوقيع |
|`GET /v1/offline/operations/{operation_id}` |اقرأ الحالة الكنسية للمكملات أو الفداء |

التحقق من استعداد الأصل قبل بناء عملية خارج الاتصال:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

الاستعداد يربط المحفظة بالجسر النشط ABI 21 ومثبتة V4 مجموعة من الأثاث. الطلبات المتعلقة بالسلسلة والإكمال، وطلبات الفدية تستخدم `application/x-norito` الأرشيفات، إعادة التكامل وإرجاع الفدية `202 Accepted` مع a `Location` الرأس الذي يشير إلى مصدر التشغيل؛ العملية غير الصفرة المضمنة ID يوفر مفتاح الإستقلال.

التدفق المعتاد هو:

1. استفسار الاستعداد وإيقاف إذا كان `ready` خاطئًا أو أي مسدس يطبق.
2. استخدم محفظة مكتوبة Swift أو JVM لبناء أرشيف الإكمال القنوني، وإرسالها، والاحتفاظ بكل من حالة ملاحظة المدخل والعملية ID حتى تصل العملية إلى حالة سلسلة نهائية.
3. تحل سلسلة تسجيل المستلم عند الضرورة، وبناء وتحقق من كل نقل أقرانه محليا، واستمر في حالة الملاحظة المشفرة قبل الاعتراف بالنقل.
4. عندما يكون المستلم على الإنترنت، قم بإنشاء أرشيف الفدية القنونيّة، وإرساله، وأجري استطلاع لموارد التشغيل حتى النهائية.

لا يمكن أن يلاحظ دفتر الرسوم الكبرى عملية نقل غير متصلة بالإنترنت متضاربة حتى تعود حالة المذكرات خلال دورة الحياة عبر الإنترنت. وبالتالي يجب على سياسة المحفظة والمشغل فرض قيود قيمة، وانتهاء الصلاحية، والمصدرين المقبولين، وتخزين محلي دائم، ونوافذ المصالحة.

وهنا مثال على إنشاء معاملة جديدة مع تعليمات `Grant`. في هذه المعاملة، يمنح الفأر أليس الدور المحدد (`role_id`). تحقق من [المثال الكامل ](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
