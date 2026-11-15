---
translation_locale: ar
translation_source: /blockchain/transactions.md
translation_source_hash: d9227effcdb4d54ac76f6288ba213de20f2574e1585e13b96a5202c44b69f3be
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# المعاملات {#transactions}

المعاملة هي طلب موقع لتنفيذ عمل على سلسلة الكتل. يمكن أن تكون الحمولة القابلة للتنفيذ تسلسلاً مرتباً من [تعليمات](./instructions.md)، أو استدعاء تقني لعقد، أو IVM بايتكود، أو تنفيذ مثبت IVM. انظر [العقود الذكية](./smart-contracts.md) لنموذج تنفيذ العقد الحالي.

تنفذ المعاملات أعمالًا تغير الحالة أو قابلة للتنفيذ. يقتصر الفحص على القراءة باستخدام استعلامات موقعة أو نقاط النهاية العامة للقراءة API ولا ينشئ معاملة.

يتم تخزين المعاملة التي تم قبولها في كتلة نهائية مع نتيجة تنفيذها، بما في ذلك رفض التنفيذ. الطلبات التي تم رفضها قبل قبول الكتلة، مثل حاوية البيانات غير الصالحة أو المعاملة التي رفضتها القائمة، لا يتم تخزينها في الكتلة.

لتحريك الأصول مع الحفاظ على الخصوصية، راجع [المعاملات المجهولة](./anonymous-transactions.md). تستخدم المعاملات المجهولة ملاحظات الأصول المحمية، وقيم الالتزام التشفيري، والمصفّيات، وإثباتات المعرفة الصفريّة بدلاً من تغييرات الأرصدة العامة من حساب إلى حساب.

لإثبات الأدلة على تأثيرات التنفيذ الشفافة المحددة، انظر [FastPQ](./fastpq.md). يستهلك FastPQ شهود التنفيذ بعد تنفيذ المعاملة العادية ويقوم بإنشاء دفعات إثبات حتمية للانتقالات الحاله المدعومة.

## شغّل سير العمل هذا على Taira {#try-it-on-taira}

استخدم مسارات المستعرض لفحص الكتل العامة الأخيرة Taira وحالات المعاملات بدون حساب توقيع:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

لمتابعة معاملة قامت تطبيقك بإرسالها سابقًا، انسخ `hash` من القائمة وافحص مسار تفاصيل المستكشف:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

تظل هذه عملية قراءة فقط. يتطلب إرسال معاملة غلاف Norito موقّعًا ومعرّف السلسلة ومعرّف الشبكة الصحيحين ودافع رسوم محددًا صراحة وحساب Taira ممولًا من خدمة التمويل التجريبي.

لتجربة أمثلة تدفع الرسوم على Taira، موّل الموقّع باتباع تدفق خدمة التمويل التجريبي ذي مرحلة الإعداد في [الحصول على XOR التجريبي على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)، ثم تحقق من رصيد أصل الرسوم:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

إذا أعاد مسار خدمة تمويل شبكة الاختبار `502`، فانتظر وأعد المحاولة قبل تصحيح المعاملة نفسها.

ثم اختر دافع الرسوم عند تقديم المعاملة. مع `--fee-payer authority`، يدفع حساب التوقيع، ويعرض CLI الرسوم الدقيقة بأصل رسوم Taira قبل التوقيع:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "faucet-funded taira transaction"
```

## المعاملات غير المتصلة بالإنترنت {#offline-transactions}

Iroha لديه مساران للمعاملات غير المتصلة بالإنترنت:

- التوقيع دون اتصال ينشئ معاملة موقعة عادية بينما يكون جهاز التوقيع غير متصل. لا تتم معالجة المعاملة حتى يقوم العميل المتصل بالإنترنت بإرسال حاوية البيانات الموقعة إلى Torii، لذلك لا يزال من الضروري وجود معرف السلسلة الصحيح، والجهة المصرح لها، والصلاحيات، والرسوم، وعمر المعاملة.
- **النقد غير المتصل بالشبكة في Kagemusha** يحمّل قيمة إلى محفظة مسجّلة ومدعومة بالعتاد أثناء اتصالها بالشبكة، ويدعم الدفع بين محفظتين أثناء انقطاعهما عن الشبكة، ويعيد القيمة المتبقية إلى حساب في دفتر السجل عندما تتصل المحفظة بالشبكة مجددًا.

يوفر Torii مسار تعديل واحدًا لـKagemusha، هو `POST /v1/kagemusha/enrollment`. يقبل إطارات تسجيل من نوع `application/x-norito` مصادقًا عليها بالحساب، ويعيد استجابات خاصة يجب عدم تخزينها مؤقتًا. تعيد مسارات القراءة الخاصة بـSDK والموقّعة بالحساب ضمن `/v1/kagemusha/{scheme}/wallets/{wallet}/` إيصالات Load وأدلة النهائية؛ وهي غير مدرجة في `/openapi.json`. يستخدم جانب دفتر السجل من دورة الحياة معاملات موقعة عادية تحمل تعليمة `KagemushaWalletLedgerV1`:

| الإجراء | الغرض |
| --- | --- |
| `Activate` | تفعيل محفظة مسجّلة؛ التحقق الأصلي من التهيئة الأولية إلزامي |
| `IssueLoad` | الخصم من دافع الرسوم وتسجيل عملية Load التالية للمحفظة بصورة ذرية |
| `Unload` | دفع مطالبة Unload كاملة إلى الحساب المرتبط بها مرة واحدة على الأكثر |
| `ClaimFee` | دفع مطالبة رسوم كاملة إلى المستفيد الثابت المحدد لها |
| `Abandon` |التخلي عن تسجيل غير مستخدم|

التدفق النموذجي هو:

1. سجّل المحفظة عبر `/v1/kagemusha/enrollment` باستخدام واجهة محفظة ذات أنواع محددة في Swift أو Android، ثم فعّلها.
2. أرسل معاملة `IssueLoad`. يتحقق التنفيذ من الرقم الترتيبي المتوقع لعملية Load التالية ومن أن معرّف الطلب غير صفري، ولذلك تفشل إعادة المحاولة القديمة أو المعدّلة. إذا فُقدت الاستجابة، فاقرأ إيصال Load الأصلي بدلًا من توقيع عملية Load أخرى.
3. تبادل المدفوعات بين المحافظ وتحقق منها محليًا أثناء عدم اتصالها بالشبكة، واحفظ حالة المحفظة حفظًا دائمًا قبل الإقرار بكل تحويل.
4. عندما تتصل المحفظة بالشبكة مجددًا، أرسل مطالبة Unload الخاصة بها وانتظر النهائية.

لم يجتز Kagemusha بعدُ تأهيل الإصدار: لا يزال التأهيل النقدي الحي، وتسجيل الهواتف وتفعيلها والدفع بها على أجهزة فعلية، أمورًا مفتوحة.

لا يمكن لسجل البلوكشين ملاحظة نقل غير متزامن متعارض حتى تعود حالة الملاحظة من خلال دورة الحياة عبر الإنترنت. لذلك يجب على المحفظة وسياسة المشغل فرض حدود للقيمة، وتاريخ الانتهاء، والمصدرين المقبولين، والتخزين المحلي الدائم، ونوافذ التسوية.

إليك مثال على إنشاء معاملة جديدة باستخدام تعليمات `Grant`. في هذه المعاملة، يقوم Mouse بمنح Alice الدور المحدد (`role_id`). تحقق من [المثال الكامل](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
// `network_id` is the target network's `NetworkId`; the fee intent is bound
// into the signature (use the intent returned by a fee quote).
let grant_role_tx = TransactionBuilder::new(
    network_id,
    mouse_id,
    FeePaymentIntent::authority(Vec::new(), None),
)
.with_instructions([grant_role])
.sign(&mouse_private_key);
```
