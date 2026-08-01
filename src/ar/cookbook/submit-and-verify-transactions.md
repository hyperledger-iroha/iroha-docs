---
translation_locale: ar
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: e07cc42a3fd5579db312bfbfbb8010f473062edebe0141eb9bb8c2a0e7faa4da
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# إرسال وتحقق من المعاملات {#submit-and-verify-transactions}

## النتيجة {#outcome}

التقدم مقدماً لعملية Taira ، وقبل اقتراح رسوم دقيق، وقع عليه وإرساله، وانتظر النهاية المطبقة، وتحقق من المعاملة الملتزمة بواسطة الهاش.

## الشروط المسبقة {#prerequisites}

- التمويل `taira.client.toml`, `taira.tx-metadata.json`, و `TAIRA_ACCOUNT_ID` المنتجة من: [الاتصال Taira](./connect-to-taira.md).
- التيار `iroha` CLI و `jq`.
- توقيع ينفذ Taira لا تستخدم مفتاحه أو إعادة كتابة هذه الأوامر على Minamoto.

## الخطوات {#steps}

### 1 - تحديد النقطة النهائية والسلطة والتوازن في الرسوم {#_1-preflight-the-endpoint-authority-and-fee-balance}

اقرأ صورة الصف أولاً، ثم أثبت أن رصيد الرسوم للسلطة مرئي. اقرأ تعريف الأصول في Base58 ID من البيانات المعدنية التي تم إنشاؤها بواسطة وصفة الاتصال.

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

توقف إذا كانت الحساب أو ميزان الرسوم غائبة. لا يمكن لإرشادات سارية أن تتم قبول الرسوم عندما لا تستطيع سلطتها دفعها.

### 2- اقتباس وتوقيع وإرسال مرة واحدة {#_2-quote-sign-and-submit-once}

يقوم CLI بإرسال الحمولة المفيدة الدقيقة غير الموقعة مقابل اقتباس رسمي، وربط نية الدفع المقبول في المعاملة، وتوقع، وإرسالها. يعيد وضع JSON تخصيص المعاملة والمعاملة الموقعة والقيمة المقبولة معاً.

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

لا تستخدم `--no-wait` في هذه الوصفة. الطلب ينتظر التأكيد قبل أن يكتب إيصالًا ناجحًا.

### 3 . انتظر حالة خط الأنابيب النهائي {#_3-wait-for-terminal-pipeline-state}

استخدم مساعدة الحالة المكتوبة بدلاً من استنتاج النجاح من قبول HTTP أو إدخال صف. مع `--wait` ، يتم اختيار نطاق التوجيه الآمن تلقائيًا والهدف الافتراضي هو النهاية المطبقة.

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

`Rejected` و `Expired` هي فشلات نهائية، وليس حالات نجاح قابلة للتحقيق. سجل سببها قبل تغيير أو إعادة بناء المعاملة.

### قراءة المعاملة المخزنة {#_4-read-the-stored-transaction}

يرد حالة خط الأنابيب ما إذا كانت المعالجة قد انتهت. تثبت استفسار المعاملة أن المعاملة المقبولة يتم تخزينها تحت نفس الهش.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

المكشّف هو سطح مراقبة ثانٍ يُقرأ فقط، ويمكن أن يتخلف قليلاً عن النهائيات.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

لإعطاء تعليمات تغيير الحالة، أنهي بسؤال عن الكائن الذي تم طفرته. [البيانات الأساسية](./metadata.md), [الأصول المعدلة](./fungible-assets.md), و [NFTs](./nfts.md) الوصفات تشمل تلك القراءات بعد الدولة.

## التحقق {#verify}

التحقق من أن كل السجلات الثلاثة تتفق على نفس الهاشش وأن المستكشف لم يعد يبلغ عن حالة معلقة:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

الحفاظ على استلام الإرسال والحالة النهائية كدليل اختبار. فهي تحتوي على مواد صفقة عامة، وليس مفتاح التوقيع.

## حل المشاكل {#troubleshooting}

- HTTP `202` أو حالة الطابور تثبت القبول فقط. استمر في استطلاع الحالة المكتوبة حتى يتم تطبيقها أو رفضها أو انتهت صلاحيتها أو التوقيت المحدد.
- إذا انتهت أوقات الإرسال بعد إرجاع الهاش، استفسر من هذا الهاش قبل بناء معاملة أخرى. إعادة الإرسال العمياء تخلق تحميلًا مفيدًا جديدًا مدعومًا وموقعًا.
- يمكن رفض اقتراح رسوم قبل التوقيع. تحقق `--fee-payer authority`، `gas_asset_id`، رصيد الهيئة، وسلسلة الشبكة ID.
- `Rejected` عادة ما تشير إلى تأكيد التعليمات والإذن أو الرسوم أو الحالة القديمة. إنها دليل متعهد على فشل في تنفيذها ولا ينبغي إعادة تصنيفها كحاولة نقل جديدة.
- استكشاف `404` مباشرة بعد التطبيق يمكن أن يكون مؤشر تأخير. حاول القراءة مرة أخرى؛ لا تقديم المعاملة مرة أخرى.
- إذا كانت تعليمات ذات امتياز تعمل على شبكة محلية تم إنشاؤها ولكن Taira يرفضها، احصل على الإذن الدقيق Taira أو تخصيص مساحة الأسماء الحكومية. النتيجة المحلية لا تمنح سلطة للشبكة العامة.

## المصدر والوثائق ذات الصلة {#source-and-related-docs}

- [تقديم المعاملة وتنفيذ تعويضات الرسوم عند الالتزام المحدد ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [اختبارات تأكيد المعاملات في الالتزام المثبت ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/tests/tx_confirmation.rs)
- [المعاملات](/ar/blockchain/transactions.md)
- [دليل CLI](/ar/get-started/operate-iroha-via-cli.md)
- [نقاط نهاية Torii](/ar/reference/torii-endpoints.md)
