---
translation_locale: ar
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: bing-translator-llm
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

هذا ما زال للقراءة فقط. يتطلب إرسال معاملة وجود حاوية بيانات Norito موقعة، ومعرّف السلسلة الصحيح، وبيانات الرسوم، وحساب Taira ممول من شبكة الاختبار.

للأمثلة التي تدفع رسومًا على Taira، احفظ أداة خدمة تمويل الاختبار من [الحصول على XOR لشبكة Taira التجريبية](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) باسم `taira_faucet_claim.py`، ثم موّل الموقّع أولًا عبر خدمة التمويل العامة:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

إذا أعاد لغز خدمة تمويل الشبكة التجريبية أو مسار المطالبة `502`، انتظر وأعد المحاولة قبل تصحيح المعاملة نفسها.

ثم أرفق بيانات تعريف أصل الرسوم Taira عند تقديم المعاملة:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## المعاملات غير المتصلة بالإنترنت {#offline-transactions}

Iroha لديه مساران للمعاملات غير المتصلة بالإنترنت:

- التوقيع دون اتصال ينشئ معاملة موقعة عادية بينما يكون جهاز التوقيع غير متصل. لا تتم معالجة المعاملة حتى يقوم العميل المتصل بالإنترنت بإرسال حاوية البيانات الموقعة إلى Torii، لذلك لا يزال من الضروري وجود معرف السلسلة الصحيح، والجهة المصرح لها، والصلاحيات، والرسوم، وعمر المعاملة.
- يعمل كاغيموشا على تعبئة المحفظة نقدًا أثناء كونها متصلة بالإنترنت، ويدعم التحويلات من محفظة إلى محفظة بمبادرة المستلم بينما تكون كلتا المحفظتين غير متصلتين بالإنترنت، ويسترد حالة الإيصال الناتج عندما يعود المستلم إلى الاتصال بالإنترنت.

Torii يكشف دورة حياة Kagemusha كاملة تحت `/v1/offline/*`:

|الطريقة ونقطة النهاية API|الغرض|
| --- | --- |
| `GET /v1/offline/readiness` |تقييم جاهزية كاجيموشا لواحد `asset_definition_id`|
| `POST /v1/offline/receiver-lineage` |حل سلسلة التسجيل النشطة الحاملة للإثبات لطلب مستلم موقع|
| `POST /v1/offline/top-up` |إرسال عملية شحن من الإنترنت إلى الخدمة على الأرض موقعة|
| `POST /v1/offline/redeem` |تقديم عملية استرداد غير متصلة موقعة|
| `GET /v1/offline/operations/{operation_id}` |اقرأ حالة البروتوكول-المعيار الفردي لشحن رصيد أو استرداد|

تحقق من جاهزية الأصل قبل إنشاء عملية غير متصلة:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

الاستعداد يربط المحفظة بالجسر النشط ABI 21 ومجموعة القطع المصادق عليها V4. تستخدم طلبات النسب والتعبئة والاسترداد أرشيفات مكتوبة `application/x-norito`. إعادة التعبئة والاسترداد `202 Accepted` مع رأس `Location` يشير إلى مورد العملية؛ يزود معرف العملية المضمن غير الصفري مفتاح عدم التغيير.

التدفق النموذجي هو:

1. تحقق من جاهزية الاستعلام وتوقف إذا كان `ready` خاطئًا أو إذا كان هناك أي عائق.
2. استخدم محفظة مكتوبة Swift أو JVM لبناء أرشيف التعبئة الموحد وفقًا للبروتوكول، وقدمه، واحتفظ بحالة ملاحظة الإدخال ومعرف العملية حتى تصل العملية إلى حالة نهائية على السلسلة.
3. حل تسلسل تسجيل المستلم عند الحاجة، وبناء والتحقق من كل تسليم بين الأقران في الشبكة محليًا، والاحتفاظ بحالة المذكرة المشفرة قبل تأكيد النقل.
4. عندما يكون المستلم متصلاً بالإنترنت، قم بإنشاء أرشيف الاسترداد القياسي للبروتوكول الواحد، وقدمه، واستعلم عن مورد عمليته حتى الوصول إلى النهاية.

لا يمكن لسجل البلوكشين ملاحظة نقل غير متزامن متعارض حتى تعود حالة الملاحظة من خلال دورة الحياة عبر الإنترنت. لذلك يجب على المحفظة وسياسة المشغل فرض حدود للقيمة، وتاريخ الانتهاء، والمصدرين المقبولين، والتخزين المحلي الدائم، ونوافذ التسوية.

إليك مثال على إنشاء معاملة جديدة باستخدام تعليمات `Grant`. في هذه المعاملة، يقوم Mouse بمنح Alice الدور المحدد (`role_id`). تحقق من [المثال الكامل](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
