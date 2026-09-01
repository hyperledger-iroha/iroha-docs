---
translation_locale: ar
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# الاتصال بـ Taira {#connect-to-taira}

## نتيجة {#outcome}

تأكد من أن Taira يمكن الوصول إليه، واستخرج معرف حساب I105 الواحد وفقًا لمعيار البروتوكول من تكوين العميل المحلي، قم بتمويل الموقع التشفيري بـ XOR على شبكة الاختبار، وقدم معاملة قديمة واحدة برسوم محددة. هذه الوصفة لا ترسل أبدًا كتابة إلى Minamoto.

## المتطلبات الأساسية {#prerequisites}

- `curl`، `jq`، Python إصدار 3.11 أو أحدث، والنسخ الثنائية الحالية لـ `iroha` و`kagami`.
- تم إنشاء `taira.client.toml` باستخدام سلسلة Taira، ونقطة النهاية API، وملف تعريف الحساب، ومفتاح شبكة اختبار مخصص. اتبع [إنشاء إعدادات عميل Taira](/ar/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) واحتفظ بالملف خارج نظام التحكم بالمصدر.
- الـ `taira_faucet_claim.py` الجاهز للتشغيل من [احصل على Testnet XOR على Taira](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)، محفوظ بجانب إعدادات العميل.

## خطوات {#steps}

### 1. فصل الجاهزية عن الحياة {#_1-separate-liveness-from-readiness}

`/livez` هو فحص حيّية العملية بنص عادي. `/status`، `/health`، و `/readyz` تُعيد JSON. يمكن لنود تعمل بشكل طبيعي أن تُعيد `503` من فحوصات الجاهزية عندما يكون نظام فرعي مطلوب محجوبًا.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

استخدم `/livez` فقط لتحديد ما إذا كانت العملية تستجيب. استخدم `/readyz` لقبول المرور وفحص تفاصيل حاجز JSON قبل اعتبار `503` انقطاعًا.

### 2. تشغيل التشخيصات العامة {#_2-run-the-public-diagnostics}

هذا الفحص للقراءة فقط ولا يقوم بتحميل تكوين موقع التوقيع التشفيري:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

لا تستمر في الكتابة عندما يبلغ الطبيب عن فشل نهاية صلبة DNS، TLS، أو سلسلة API. طابور عام مشبع أمر مؤقت؛ انتظر وأعد المحاولة بسياسة محدودة.

### 3. استخرج معرف حساب Taira دون طباعة أي سر {#_3-derive-the-taira-account-id-without-printing-a-secret}

اقرأ المفتاح العام فقط من الإعدادات، ثم قم بترميزه باستخدام الملف الشخصي Taira I105. توفر القيمة `[account].domain` سياق التوجيه؛ فهي ليست جزءًا من معرف الحساب.

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

الإخراج هو عنوان واحد بمعيار بروتوكول بدون نطاق I105. الأسماء مثل `wallet@payments.universal` هي أسماء مستعارة ويجب حلها قبل استخدامها في حقول الحساب الصارمة.

### 4. المطالبة بالأصل الرسومي الحالي Taira {#_4-claim-the-current-taira-fee-asset}

استجابة خدمة تمويل شبكة الاختبار هي مصدر الحقيقة لتعريف أصل الرسوم. احتفظ بمعرف Base58 المُعاد بدلاً من نسخ معرف من شبكة أخرى أو تشغيل قديم.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

تحقق من الرصيد لمدة لا تزيد عن دقيقة واحدة. يمكن لخدمة تمويل الشبكة التجريبية إرجاع `202 Accepted` قبل أن تكون معاملة التمويل مرئية.

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

`gas_asset_id` هو بيانات وصفية للمعاملة. الاختيار الصريح لـ `--fee-payer authority` مرتبط بالتوقيع، و CLI يحصل على تقدير دقيق لسعر الرسوم قبل أن يوقع.

## تحقق {#verify}

قدّم تعليمات السجل، واحتفظ بسجل نتيجة بروتوكول JSON، وانتظر الانتهاء النهائي المطبق. إن حذف `--no-wait` يجعل التقديم الأولي ينتظر التأكيد أيضًا؛ القراءة الصريحة للحالة تثبت حالة سير عمل المعالجة البرمجية النهائية.

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

يتم تنفيذ الأمر النهائي بنجاح فقط بعد أن تصل المعاملة إلى حالة الطرفية الافتراضية `Applied`. احتفظ بالهاش التشفيري في دليل الاختبار؛ لا تخزن أبدًا المفتاح الخاص أو تكوين العميل الكامل معه.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- `/livez` يُرجع `406` عند الطلب من JSON لأن نقطة النهاية API هي `text/plain`. أرسل `Accept: text/plain` كما هو موضح أعلاه.
- `/health` أو `/readyz` قد يُرجع `503` مع حاجز قابل للقراءة آليًا حتى بينما يعمل `/livez` و `/status`. أصلح ذلك أو انتظر ذلك الحاجز؛ إعادة توليد المفاتيح لن تغير جاهزية العقدة.
- خدمة تمويل شبكة الاختبار `502`، انتهاء المهلة، أو مرساة إثبات العمل القديمة هي فشل في الخدمة العامة. احصل على لغز جديد وحاول مرة أخرى لاحقًا.
- خطأ في البادئة I105 يعني أن المفتاح العام تم ترميزه باستخدام الملف التعريفي الخاطئ. أعد تشغيل `iroha tools address convert --profile taira`.
- عادةً ما يعني رفض عرض الرسوم أن المبدأ التفويضي لم يُمول، أو أن بيانات وصف أصول الرسوم قديمة، أو أنه لم يتم اختيار دافع رسوم صريح.
- يمكن أن يتم رفض التسجيل أو الإصدار أو إدارة مساحة الاسم حتى بعد نجاح هذا الاختبار التجريبي. تتطلب هذه العمليات أذونات بيئة تشغيل برامج منفصلة؛ قم بتجربتها على الشبكة المحلية المولدة عندما لم يتم منح الوصول لـ Taira.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [Taira CLI التشخيصات ومصدر الكناري في مراجعة كود المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [تحديد الرسوم الصريحة و CLI مصدر الإرسال في نسخة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [دليل خدمة الحساب وتمويل الشبكة التجريبية Taira](/ar/get-started/sora-nexus-dataspaces.md)
- [تكوين العميل](/ar/guide/configure/client-configuration.md)
- [المعاملات](/ar/blockchain/transactions.md)
