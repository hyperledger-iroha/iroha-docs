---
translation_locale: ar
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# الاتصال بـ Taira {#connect-to-taira}

## نتيجة {#outcome}

تأكد من أن Taira يمكن الوصول إليه، واستخرج معرف حساب I105 الواحد وفقًا لمعيار البروتوكول من تكوين العميل المحلي، قم بتمويل الموقع التشفيري بـ XOR على شبكة الاختبار، وقدم معاملة قديمة واحدة برسوم محددة. هذه الوصفة لا ترسل أبدًا كتابة إلى Minamoto.

## المتطلبات الأساسية {#prerequisites}

- `curl`، `jq`، Python إصدار 3.11 أو أحدث، والنسخ الثنائية الحالية لـ `iroha` و`kagami`.
- ملف `taira.client.toml` تم إنشاؤه باستخدام سلسلة Taira، و`network_id` الدقيق، ونقطة النهاية API، وملف تعريف الحساب، ومفتاح شبكة اختبار مخصص. اتبع [إنشاء إعدادات عميل Taira](/ar/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) واحتفظ بالملف خارج نظام التحكم بالمصدر.
- مجلد عمل قابل للكتابة للسجل اليومي لخدمة تمويل الشبكة التجريبية: ينشئ `iroha taira account faucet prepare` المجلد `./taira-faucet` بأذونات خاصة بالمالك ويرفض استبدال مجلد موجود.

## خطوات {#steps}

### 1. فصل الجاهزية عن الحياة {#_1-separate-liveness-from-readiness}

`/livez` و`/health` و`/readyz` هي فحوصات بنص عادي؛ ويُعيد `/status` بيانات JSON. يمكن لعقدة تعمل بشكل طبيعي أن تُعيد `503` من `/readyz` عندما يكون قبول الإجماع أو نظام فرعي مطلوب آخر غير متاح.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

استخدم `/livez` فقط لتحديد ما إذا كانت العملية تستجيب. استخدم `/readyz` لقبول المرور. الاستجابة `503` منه هي حاوية خطأ `service_unavailable` بدون تفاصيل عن الحاجز، لذا شغّل التشخيصات أدناه قبل اعتبارها انقطاعًا.

### 2. تشغيل التشخيصات العامة {#_2-run-the-public-diagnostics}

هذا الفحص للقراءة فقط ولا يقوم بتحميل تكوين موقع التوقيع التشفيري:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

لا تستمر في الكتابة عندما يبلغ الطبيب عن فشل نهاية صلبة DNS، TLS، أو سلسلة API. طابور عام مشبع أمر مؤقت؛ انتظر وأعد المحاولة بسياسة محدودة.

### 3. استخرج معرف حساب Taira دون طباعة أي سر {#_3-derive-the-taira-account-id-without-printing-a-secret}

اقرأ المفتاح العام فقط من الإعدادات، ثم قم بترميزه باستخدام الملف الشخصي Taira I105. لا يحمل معرف الحساب أي نطاق؛ ويختار `[account].profile` بادئة الشبكة الخاصة به فقط.

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

تحدد سياسة خدمة تمويل الشبكة التجريبية تعريف أصل الرسوم الحالي. احتفظ بمعرف Base58 الخاص به بدلاً من نسخ معرف من شبكة أخرى أو تشغيل قديم. السياسة بيانات اكتشاف غير موقعة، لذا يجب على الأتمتة تثبيت المُصدِر وتعريف الأصل والمبلغ الذي تتوقعه بدلاً من الوثوق بكل استجابة.

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

يحل `prepare` مسألة إثبات العمل ويحفظ المعاملة الموقعة الدقيقة؛ ويرسلها `submit` مرة واحدة ويعود بعد تطبيقها. إذا أبلغ `submit` عن `Pending` أو انتهت مهلته، فشغّل `taira account faucet resume` بالإعدادات والسجل اليومي نفسيهما بدلاً من تحضير مطالبة أخرى. ثم تحقق من الرصيد لمدة لا تزيد عن دقيقة واحدة.

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

استخدم `--fee-payer authority` لكل عملية كتابة على Taira. هذا الاختيار مرتبط بالتوقيع، ويعرض CLI تقدير سعر الرسوم الدقيق بأصل رسوم Taira قبل التوقيع.

## تحقق {#verify}

قدّم تعليمات السجل، واحتفظ بسجل نتيجة بروتوكول JSON، وانتظر الانتهاء النهائي المطبق. إن حذف `--no-wait` يجعل التقديم الأولي ينتظر التأكيد أيضًا؛ القراءة الصريحة للحالة تثبت حالة سير عمل المعالجة البرمجية النهائية.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

ينجح الأمر النهائي فقط بعد أن تُبلغ الحالة الشاملة الدقيقة عن نهائية `Applied` محسومة على مستوى الحالة. احتفظ بالهاش التشفيري في دليل الاختبار؛ لا تخزن أبدًا المفتاح الخاص أو تكوين العميل الكامل معه.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- تُرجع `/livez` و`/health` و`/readyz` الرمز `406` عند طلب JSON فقط لأنها تجيب بصيغة `text/plain`. أرسل ترويسات `Accept` الموضحة أعلاه.
- قد يُرجع `/readyz` الرمز `503` مع حاوية خطأ `service_unavailable` حتى بينما يعمل `/livez` و `/status`. انتظر الجاهزية أو شغّل `iroha taira doctor`؛ إعادة توليد المفاتيح لن تغير جاهزية العقدة.
- الرمز `502` من خدمة تمويل الشبكة التجريبية أو انتهاء المهلة أثناء `submit` يترك نتيجة المطالبة مجهولة: شغّل `taira account faucet resume` بالإعدادات والسجل اليومي نفسيهما بدلاً من تحضير مطالبة أخرى. تؤدي مرساة إثبات العمل القديمة إلى فشل `prepare`؛ حضّر مجددًا في مجلد سجل يومي جديد.
- خطأ في البادئة I105 يعني أن المفتاح العام تم ترميزه باستخدام الملف التعريفي الخاطئ. أعد تشغيل `iroha tools address convert --profile taira`.
- عادةً ما يعني رفض تقدير سعر الرسوم أن المبدأ التفويضي غير مموّل أو أن `network_id` المُكوَّن ليس الخاص بـ Taira. يفشل غياب `--fee-payer`، أو وجود مفتاح رسوم مثل `gas_asset_id` في `--metadata`، محليًا قبل تقدير السعر.
- يمكن أن يتم رفض التسجيل أو الإصدار أو إدارة مساحة الاسم حتى بعد نجاح هذا الاختبار التجريبي. تتطلب هذه العمليات أذونات بيئة تشغيل برامج منفصلة؛ قم بتجربتها على الشبكة المحلية المولدة عندما لم يتم منح الوصول لـ Taira.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [مصدر تشخيصات CLI والكناري في Taira](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) و[أوامر خدمة تمويل الشبكة التجريبية](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs) عند مراجعة كود المصدر المثبتة
- [تحديد الرسوم الصريحة و CLI مصدر الإرسال في نسخة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [دليل خدمة الحساب وتمويل الشبكة التجريبية Taira](/ar/get-started/sora-nexus-dataspaces.md)
- [تكوين العميل](/ar/guide/configure/client-configuration.md)
- [المعاملات](/ar/blockchain/transactions.md)
