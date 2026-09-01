---
translation_locale: ar
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# إرسال والتحقق من المعاملات {#submit-and-verify-transactions}

## نتيجة {#outcome}

قم بالتحقق المسبق من معاملة Taira، اقبل تقدير رسوم دقيق، وقّع عليها وقدمها، انتظر حتى يتم الوصول إلى الحسم النهائي، وتحقق من المعاملة النهائية بواسطة التجزئة التشفيرية.

## المتطلبات الأساسية {#prerequisites}

- تم إنتاج `taira.client.toml` و`taira.tx-metadata.json` و`TAIRA_ACCOUNT_ID` الممول بواسطة [الاتصال بـ Taira](./connect-to-taira.md).
- الحالي `iroha` CLI و `jq`.
- موقّع تشفيري Taira للاستعمال مرة واحدة. لا تُعد استخدام مفتاحه أو أوامر الكتابة هذه على Minamoto.

## خطوات {#steps}

### 1. قم بفحص نقطة النهاية API، والمبدأ التفويضي، ورصيد الرسوم {#_1-preflight-the-endpoint-authority-and-fee-balance}

اقرأ أولاً عرض بيانات الطابور عند نقطة الوقت، ثم أثبت أن رصيد رسوم المالك المخول مرئي. اقرأ معرف تعريف الأصل Base58 من البيانات الوصفية التي تم إنشاؤها بواسطة وصفة الاتصال.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

توقف إذا كان الحساب أو رصيد الرسوم غائبًا. لا يمكن لتعليمات صالحة تجاوز قبول الرسوم عندما لا يتمكن المبدأ المخول من الدفع.

### 2. اقتبس ووقّع وقدّم مرة واحدة {#_2-quote-sign-and-submit-once}

يُرسل CLI الحمولة غير الموقعة الدقيقة لتقدير سعر الرسوم، ويُلزم نية الدفع المقبولة في المعاملة، ويوقع ويقدم المعاملة. وضع JSON يُرجع معًا التجزئة التشفيرية للمعاملة، والمعاملة الموقعة، والعرض المقبول.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

لا تستخدم `--no-wait` في هذه الوصفة. ينتظر الأمر التأكيد قبل أن يكتب سجل نتيجة البروتوكول الناجحة.

### 3. انتظر حالة معالجة سير عمل برنامج الطرفية {#_3-wait-for-terminal-pipeline-state}

استخدم مساعد الحالة المكتوبة بدلاً من استنتاج النجاح من قبول HTTP أو قبول في الطابور. مع `--wait`، يتم اختيار نطاق التوجيه الآمن تلقائيًا والهدف الافتراضي هو النهاية المطبقة.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` و `Expired` هما حالات فشل نهائية، وليسا حالات نجاح قابلة لإعادة المحاولة. سجّل سببهما قبل تغيير المعاملة أو إعادة بنائها.

### ٤. قراءة المعاملة المخزنة {#_4-read-the-stored-transaction}

تجيب حالة سير عمل معالجة البرمجيات عما إذا كانت المعالجة قد انتهت. تحقق استعلام المعاملة من أن المعاملة المقبولة مخزنة تحت نفس التجزئة التشفيرية.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

المستكشف هو سطح مراقبة ثانٍ للقراءة فقط. يمكن أن يتأخر لفترة وجيزة خلف نهاية سير عمل معالجة البرمجيات.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

بالنسبة لتعليمات تغيير الحالة، قم بالانتهاء باستعلام عن الكائن الذي تم تغييره. وصفات [البيانات الوصفية](./metadata.md) و[الأصول القابلة للاستبدال](./fungible-assets.md) و[NFTs](./nfts.md) تشمل تلك القراءات بعد تغيير الحالة.

## تحقق {#verify}

تحقق من أن جميع السجلات الثلاثة تتوافق على نفس التجزئة التشفيرية وأن المستكشف لم يعد يبلغ عن حالة معلقة:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

احتفظ بسجل نتائج بروتوكول التقديم والحالة النهائية كدليل للاختبار. فهي تحتوي على مواد معاملات عامة، وليس مفتاح التوقيع.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- HTTP `202` أو حالة الانتظار تثبت فقط القبول. استمر في الاستطلاع عن الحالة المدرجة حتى تصبح مطبقة، مرفوضة، منتهية الصلاحية، أو بعد انتهاء المهلة المحددة.
- إذا انتهت مهلة الإرسال بعد إرجاع تجزئة تشفيرية، استعلم عن تلك التجزئة التشفيرية قبل بناء معاملة أخرى. الإرسال المعمى مرة أخرى ينشئ حمولة جديدة مقتبسة وموقعة.
- يمكن رفض تقدير سعر الرسوم قبل التوقيع. تحقق من `--fee-payer authority`، `gas_asset_id`، رصيد المخول، ومعرف سلسلة الشبكة.
- `Rejected` عادة ما يشير إلى تحقق التعليمات، الأذونات، الرسوم، أو الحالة القديمة. إنه دليل نهائي على فشل التنفيذ ولا ينبغي إعادة تصنيفه كمحاولة نقل مرة أخرى.
- يمكن أن يكون المستكشف `404` مباشرة بعد التطبيق تأخر الفهرسة. أعد محاولة القراءة؛ لا تعيد تقديم المعاملة.
- إذا كانت التعليمات المميزة تعمل على شبكة محلية تم إنشاؤها ولكن Taira يرفضها، فاحصل على إذن Taira الدقيق أو تعيين مساحة الاسم المحكومة. النتيجة المحلية لا تمنح جهة تفويض لشبكة البلوكشين العامة.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [تقديم المعاملة وتنفيذ عرض الرسوم عند نسخة الكود المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [تنفيذ تأكيد المعاملة والاختبارات عند نسخة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [المعاملات](/ar/blockchain/transactions.md)
- [CLI دليل](/ar/get-started/operate-iroha-via-cli.md)
- [Torii API نقاط النهاية](/ar/reference/torii-endpoints.md)
