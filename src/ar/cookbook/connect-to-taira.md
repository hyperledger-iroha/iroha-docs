---
translation_locale: ar
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: a7347a7e8ea055fd5bab9a34b6124ea19ef6f355f9beef9e9488794d9c6e3202
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# التواصل مع Taira {#connect-to-taira}

## النتيجة {#outcome}

تأكد من إمكانية الوصول إلى Taira ، واستمد الحساب القنوني I105 ID من تكوين عميل محلي ، وتمويل الموقّع مع شبكة اختبار XOR ، وتقديم معاملة قناتية واحدة مدفوعة الرسوم. هذه الوصفة لا ترسل رسالة أبداً إلى Minamoto.

## الشروط المسبقة {#prerequisites}

- `curl` ، `jq`، Python 3.11 أو أحدث، والثنائيات الحالية `iroha` و `kagami`.
- (أ) `taira.client.toml` تم إنشاؤها مع Taira سلسلة، نقطة نهائية، ملف حساب، ومفتاح شبكة اختبارية مخصصة. [إنشاء Taira تثبيت العميل](/ar/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) والحفاظ على الملف خارج السيطرة المصدرية.
- الاستعداد للتشغيل `taira_faucet_claim.py` من [Get Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)، مدفوع بجوار تشكيل العميل.

## الخطوات {#steps}

### 1 - الانفصال عن الحياة من الاستعداد {#_1-separate-liveness-from-readiness}

`/livez` هو قنبلة حياة العمليات ذات النص البسيط. `/status` ، `/health` ، و `/readyz` عودة JSON. العقدة الجارية يمكن أن تعود شرعيًا `503` من قنابل الاستعداد عندما يتم حجب نظام فرعي مطلوب.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

استخدام `/livez` فقط لتحديد ما إذا كانت العملية تستجيب. استخدم `/readyz` للدخول في حركة المرور وتفحص تفاصيل مقفل JSON قبل التعامل مع `503` كانقطاع.

### 2- إجراء التشخيصات العامة {#_2-run-the-public-diagnostics}

هذا التحقق يقرأ فقط ولا يحمل إعداد الموقع:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

لا تستمر في الكتابة عندما يبلغ الطبيب عن فشل صلب DNS ، TLS ، سلسلة ، أو نقطة النهاية. الصف العام المشبعة أمر مؤقت ؛ انتظر وتحاول مرة أخرى مع سياسة محدودة.

### 3 - استنتاج حساب Taira ID دون طباعة سر {#_3-derive-the-taira-account-id-without-printing-a-secret}

اقرأ فقط المفتاح العام من الإعدادات، ثم قم بتشفيرها مع ملف Taira I105. توفر قيمة `[account].domain` سياق التوجيه؛ وهي ليست جزءًا من الحساب ID.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

الناتج هو عنوان قائدي I105 بدون نطاق. الأسماء مثل `wallet@payments.universal` هي مستعار ويجب حلها قبل استخدامها في حقل الحساب الصارمة.

### 4 - الادعاء على التيار Taira أصول الرسوم {#_4-claim-the-current-taira-fee-asset}

استجابة النوافذ هي مصدر الحقيقة لتعريف أصول الرسوم. احتفظ بـ Base58 ID المرد بدلاً من نسخ ID من شبكة أخرى أو تشغيل قديم.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

استكشاف الرصيد لمدة دقيقة واحدة على الأكثر. يمكن أن يعود الصنبور `202 Accepted` قبل أن تكون المعاملة التمويل مرئية.

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

`gas_asset_id` هي البيانات الأساسية للمعاملة. يتم اختيار `--fee-payer authority` صريحًا مع التوقيع، ويحصل CLI على اقتباس رسمي دقيق قبل توقيعه.

## التحقق {#verify}

إرسال تعليمات السجل، والحفاظ على إيصال JSON، وانتظار النهاية التطبيقية. إبعاد `--no-wait` أيضا يجعل الإرسال الأولي ينتظر تأكيد؛ يثبت قراءة حالة صريحة الحالة النهائية للخط الأنابيب .

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

النجاح في الأمر النهائي بعد أن تصل المعاملة إلى حالة المحطة الافتراضية `Applied`. احتفظ بالهاشش في دليل الاختبار؛ لا تخزين المفاتيح الخاصة أو إعداد العميل الكامل معها.

## حل المشاكل {#troubleshooting}

- `/livez` يعود `406` عند طلب JSON لأن هذه النقطة النهائية هي `text/plain` إرسال `Accept: text/plain` كما هو موضح أعلاه.
- `/health` أو `/readyz` يمكن أن تعيد `503` مع مقفل قابل للقراءة الآلية حتى أثناء عمل `/livez` و `/status`. إصلاح أو الانتظار لهذا المقاطع؛ مفاتيح تجديد لن تغير استعداد العقد.
- إن النفط `502` ، أو الموعد الزمني، أو مرساة إثبات العمل القديمة هي فشل في الخدمة العامة. احضر لغز جديد وتحاول مرة أخرى لاحقاً.
- خطأ مقدمة I105 يعني أن المفتاح العام تم ترميزه بملف غير صحيح. إعادة تشغيل `iroha tools address convert --profile taira`.
- عادة ما يعني رفض اقتباس الرسوم أن الهيئة لم يتم تمويلها، أو أن البيانات المتعلقة بأصول الرسوم قديمة، أو أنه لم يتم اختيار مدفع الرسوم الصريحة.
- لا يزال من الممكن رفض التسجيل أو الحساب أو إدارة مساحة الأسماء بعد نجاح هذا القناري. تتطلب هذه العمليات تصاريح وقت تشغيل منفصلة؛ قم بتدريبها على الشبكة المحلية المولدة عندما لم يتم منح الوصول إلى Taira.

## المصدر والوثائق ذات الصلة {#source-and-related-docs}

- [Taira CLI التشخيص ومصدر القناري في المشاركة المثبتة](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/taira.rs)
- [اختيار الرسوم الصريحة ومصدر تقديم CLI في الموافقة المحددة ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Taira دليل الحساب والفخار](/ar/get-started/sora-nexus-dataspaces.md)
- [تكوين العميل](/ar/guide/configure/client-configuration.md)
- [المعاملات](/ar/blockchain/transactions.md)
