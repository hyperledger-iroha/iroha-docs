---
translation_locale: ar
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# الحسابات والاسميات المستعارة {#accounts-and-aliases}

## نتيجة {#outcome}

اعمل بأمان مع معرفات الحسابات ذات البروتوكول الواحد بدون نطاق I105 والمرادفات القابلة للقراءة من قبل الإنسان المرتبطة بشكل منفصل مثل `treasury@payments.universal`. ستقوم بفحص حسابات Taira، واستخراج معرفك المعياري للبروتوكول الواحد الخاص بك، وحل المرادفات دون الخلط بين سياق التوجيه والهوية.

## المتطلبات الأساسية {#prerequisites}

- `curl`، `jq`، Python 3.11 أو أحدث، و`iroha` الحالي CLI.
- حدث `taira.client.toml` من [الاتصال بـ Taira](./connect-to-taira.md) عند تفقد حسابك الخاص.
- يتم تزويد الحساب من خلال خدمة تمويل شبكة الاختبار Taira أو مسار الانضمام المُدار للشبكة قبل توقع نجاح القراءة الخاصة بالحساب.

## خطوات {#steps}

### 1. فحص حسابات البروتوكول الموحدة على Taira {#_1-inspect-canonical-accounts-on-taira}

قائمة الحسابات العامة تعيد دائمًا معرفات I105 وفقًا للمعيار البروتوكولي الفردي. الاسم المستعار الأساسي اختياري ويتم الإبلاغ عنه بشكل منفصل.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

معرّف من `.id` صالح لحقول الحساب الصارمة. لا تقم بإضافة نطاق إليه. الاسم المستعار من `.primary_alias` هو مفتاح بحث موجه للمستخدم، وليس هوية أخرى موحدة وفق المعيار البروتوكولي.

### 2. استخرج وقم بتطبيع معرف Taira I105 الخاص بك {#_2-derive-and-normalize-your-taira-i105-id}

اقرأ مفتاح الإجراء العام فقط من التكوين المحلي. يتم ترميز نفس مفتاح الإجراء العام بشكل مختلف لملفات تعريف شبكات البلوك تشين العامة المختلفة، لذا حدد `taira` صراحة.

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

يجب أن تكون القيمة الموحدة مطابقة لـ `TAIRA_ACCOUNT_ID`. يمكن أن يكون إعداد `[account].domain` في ملف TOML `wonderland.universal`، لكن تلك القيمة تؤثر فقط على التوجيه وسياق الاسم المستعار.

### 3. اقرأ الحساب وأصوله {#_3-read-the-account-and-its-assets}

بعد تجهيز الحساب، استعلم عنه مباشرة وقم بعرض صفحة الأصول المحدودة. URL-ترميز I105 القيمة قبل استخدامها في مسار.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### ٤. ابحث عن الأسماء المستعارة المرتبطة بالحساب {#_4-look-up-aliases-bound-to-the-account}

يقوم محلل العكس بقبول معرف حساب واحد دقيق وفقًا لمعيار البروتوكول. يمكن قراءة صفوف مساحة البيانات العامة دون رؤوس توقيع الطلب؛ تتطلب مساحات البيانات المقيدة طلبًا موقعًا ومصرحًا به.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` صالح: الحساب لا يحتاج إلى اسم مستعار. عندما يكون هناك ارتباط موجود، قم بحل الاسم المستعار المؤهل بالكامل بدقة وقارن معرف الحساب المسترجع:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning حدود الإذن

يمكن لخدمة تمويل شبكة الاختبار Taira تجهيز حساب المطالب الخاص بها، لكن ذلك لا يمنح صلاحية عامة لتسجيل الحساب أو إدارة الألقاب. يتطلب تسجيل حساب آخر `CanRegisterAccount` تحت المدقق النشط. عادةً ما تتطلب الأسماء المستعارة للحساب أيضًا عقد إيجار SNS نشط والأذونات المناسبة للاسم المستعار. استخدم مخطط الإعداد/الأسماء المستعارة المحكوم، أو تدرب على التسجيل مقابل الشبكة المحلية المولدة.

:::

على شبكة محلية، بمجرد أن يقوم خطوة توفير مفتاح التوقيع التشفيري الآمن بتصدير `NEW_ACCOUNT_ID` معيار بروتوكول جديد، فإن سطح التسجيل هو:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

قم بإنشاء وتخزين مفتاح خاص مطابق خارج المستندات أو مستودع التطبيق. تسجيل هوية تم التخلص من مفتاح التحكم الخاص بها ينشئ حسابًا غير قابل للاستخدام.

## تحقق {#verify}

أثبت أن مفتاح التكوين العام، وترميز I105، وربط الاسم المستعار كلها تتقارب لتشكل معرف حساب واحد وفق معيار البروتوكول:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

قم بتخزين معرفات الحساب الموحدة بالبروتوكول الفردي. استخدم معرفات البروتوكول الفردية للتوقيعات والصلاحيات وتعليمات المعاملات. قم بحل الاسم المستعار عند حدود التطبيق. احتفظ بمعرف الحساب الموحد بالبروتوكول المستخدم للعملية.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- عادةً ما يعني خطأ التحليل أو الخطأ في البادئة أن العنوان تم ترميزه لملف تعريف شبكة مختلف. قم بالتطبيع باستخدام `--profile taira` ورفض الحالات غير المطابقة.
- يمكن أن يتعرض الحساب `404` بعد خدمة تمويل شبكة الاختبار `202` لتأخير في الانتشار. تحقق من الحساب أو الأصل الممول قبل إرسال عملية كتابة.
- `total: 0` من محلل العكس يعني أنه لا يوجد اسم مستعار مرئي مرتبط؛ إنه ليس فشلًا في البحث عن الحساب.
- `401` أو `403` من مسار مستعار يشير إلى مساحة بيانات مقيدة أو إذن حل دقيق غير كافٍ. لا تستخدم البحث بالبادئة الواسعة كخطة بديلة.
- قيمة `name@domain.dataspace` القابلة للقراءة غير مقبولة في كل مكان يتطلب فيه معرف I105 القياسي للبروتوكول الفردي. قم بحلها أولاً.
- إذا نجح تسجيل الحساب المحلي ولكن Taira رفضه، فإن الاختلاف هو التفويض. احصل على `CanRegisterAccount`؛ لا تغير معرف الحساب لتجاوز التحقق.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [تنفيذ عنوان حساب قياسي لبروتوكول واحد عند مراجعة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [اختبارات الحساب والاسم المستعار Torii عند نسخة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [الحسابات](/ar/blockchain/accounts.md)
- [أسماء مستعارة لنموذج البيانات](/ar/blockchain/data-model.md#aliases)
- [قواعد التسمية](/ar/reference/naming.md)
- [رموز الإذن](/ar/reference/permissions.md)
