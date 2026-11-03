---
translation_locale: ar
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: de608ef52ad3a999c0e253e6683e454f8f66f399a690dce4c2185c79d02334cd
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# إرسال والتحقق من المعاملات {#submit-and-verify-transactions}

## نتيجة {#outcome}

قم بالتحقق المسبق من معاملة Taira، اقبل تقدير رسوم دقيق، وقّع عليها وقدمها، انتظر حتى يتم الوصول إلى الحسم النهائي، وتحقق من المعاملة النهائية بواسطة التجزئة التشفيرية.

## المتطلبات الأساسية {#prerequisites}

- ملف `taira.client.toml` مموَّل، و`taira-faucet-policy.json`، و`TAIRA_ACCOUNT_ID` الناتجة عن [الاتصال بـ Taira](./connect-to-taira.md). تستخدم عمليات الكتابة `--fee-payer authority`؛ ويعرض CLI تقدير سعر الرسوم الدقيق بأصل رسوم Taira قبل التوقيع.
- الحالي `iroha` CLI و `jq`.
- موقّع تشفيري Taira للاستعمال مرة واحدة. لا تُعد استخدام مفتاحه أو أوامر الكتابة هذه على Minamoto.

## خطوات {#steps}

### 1. قم بفحص نقطة النهاية API، والمبدأ التفويضي، ورصيد الرسوم {#_1-preflight-the-endpoint-authority-and-fee-balance}

اقرأ أولاً عرض بيانات الطابور عند نقطة الوقت، ثم أثبت أن رصيد رسوم المالك المخول مرئي. اقرأ معرف تعريف الأصل Base58 من سياسة خدمة تمويل الشبكة التجريبية التي حفظتها وصفة الاتصال.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet-policy.json)"

iroha --config ./taira.client.toml account get \
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
  tx ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

لا تستخدم `--no-wait` في هذه الوصفة. ينتظر الأمر التأكيد قبل أن يكتب سجل نتيجة البروتوكول الناجحة.

### 3. انتظر حالة معالجة سير عمل برنامج الطرفية {#_3-wait-for-terminal-pipeline-state}

استخدم مساعد الحالة محدد النوع بدلاً من استنتاج النجاح من قبول HTTP أو قبول في الطابور. مع `--wait`، يستطلع CLI الحالة الشاملة الدقيقة ولا ينجح إلا عند نهائية `Applied` محسومة على مستوى الحالة.

```bash
iroha --config ./taira.client.toml \
  --machine \
  tx status \
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
  tx get --hash "$TAIRA_TX_HASH" \
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

تحقق من أن جميع السجلات الثلاثة تتوافق على نفس التجزئة التشفيرية وأن المستكشف يبلغ عن `Committed` بدلاً من `Rejected`:

```bash
jq -e --arg hash "$TAIRA_TX_HASH" \
  '.hash == $hash and .terminal_kind == "Applied"' taira-final-status.json

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '(.hash | ascii_downcase | ltrimstr("hash:") | split("#")[0]) == $hash
      and .status == "Committed"'
```

احتفظ بسجل نتائج بروتوكول التقديم والحالة النهائية كدليل للاختبار. فهي تحتوي على مواد معاملات عامة، وليس مفتاح التوقيع.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- HTTP `202` أو حالة الانتظار تثبت فقط القبول. استمر في الاستطلاع عن الحالة المدرجة حتى تصبح مطبقة، مرفوضة، منتهية الصلاحية، أو بعد انتهاء المهلة المحددة.
- إذا انتهت مهلة الإرسال بعد إرجاع تجزئة تشفيرية، استعلم عن تلك التجزئة التشفيرية قبل بناء معاملة أخرى. الإرسال المعمى مرة أخرى ينشئ حمولة جديدة مقتبسة وموقعة.
- يمكن رفض تقدير سعر الرسوم قبل التوقيع. تحقق من `--fee-payer authority`، ورصيد المخول، و`chain` و`network_id` المُكوَّنين، ومن أن `--metadata` لا يحمل أي مفتاح رسوم مثل `gas_asset_id`.
- `Rejected` عادة ما يشير إلى تحقق التعليمات، الأذونات، الرسوم، أو الحالة القديمة. إنه دليل نهائي على فشل التنفيذ ولا ينبغي إعادة تصنيفه كمحاولة نقل مرة أخرى.
- يمكن أن يكون المستكشف `404` مباشرة بعد التطبيق تأخر الفهرسة. أعد محاولة القراءة؛ لا تعيد تقديم المعاملة.
- إذا كانت التعليمات المميزة تعمل على شبكة محلية تم إنشاؤها ولكن Taira يرفضها، فاحصل على إذن Taira الدقيق أو تعيين مساحة الاسم المحكومة. النتيجة المحلية لا تمنح جهة تفويض لشبكة البلوكشين العامة.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [تقديم المعاملة وتنفيذ عرض الرسوم عند نسخة الكود المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [تنفيذ تأكيد المعاملة والاختبارات عند نسخة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/client.rs)
- [المعاملات](/ar/blockchain/transactions.md)
- [CLI دليل](/ar/get-started/operate-iroha-via-cli.md)
- [Torii API نقاط النهاية](/ar/reference/torii-endpoints.md)
