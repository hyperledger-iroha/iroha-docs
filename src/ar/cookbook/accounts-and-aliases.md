---
translation_locale: ar
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 429535e5bb4ad1d3110f29a5b3896c0d3ce39264dbd357fa932fcc2a5f48d0f1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الحسابات و الاسم الخارجي {#accounts-and-aliases}

## النتيجة {#outcome}

العمل بأمان مع النطاقات القانونية I105 الحساب IDs وأيضاً أسماء مستعار قابلة للقراءة من قبل الإنسان مثل: `treasury@payments.universal`. سوف تفتش Taira الحسابات، استنتاج القوانين الخاصة بك ID, وحل الأسماء غير المرغوب فيها دون خلط بين السياق التوجيهي والهوية.

## الشروط المسبقة {#prerequisites}

- `curl` ، `jq`، Python 3.11 أو أحدث، والتيار `iroha` CLI.
- `taira.client.toml` من [تواصل مع Taira](./connect-to-taira.md) عند تفتيش حسابك الخاص.
- حساب تم توفيره من خلال الصنبورة Taira أو مسار إدخال الشبكة المحكوم عليه قبل توقع نجاح قراءة محددة للحساب.

## الخطوات {#steps}

### 1 - التحقق من الحسابات القنونية في Taira {#_1-inspect-canonical-accounts-on-taira}

يرد قائمة الحسابات العامة دائمًا الكانونيكال I105 IDs. يتم إعطاء اسم مستعار أساسي اختياري ويُبلغ بشكل منفصل.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

صحيح ID من `.id` لحقول الحساب الصارمة. لا تضيف نطاقًا إليها. اسم مستعار من `.primary_alias` هو مفتاح بحث يدير المستخدم ، وليس هوية قائمة أخرى.

### 2 - استنتاج وتطبيع Taira I105 ID {#_2-derive-and-normalize-your-taira-i105-id}

قراءة مفتاح العام فقط من التكوين المحلي. يتم تشفير نفس المفتاح العام بشكل مختلف لمختلف ملفات تعريف الشبكة العامة، لذلك حدد `taira` صراحة.

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

يجب أن تكون القيمة المعتادة متطابقة مع `TAIRA_ACCOUNT_ID`. يمكن أن يكون إعداد `[account].domain` في ملف TOML `wonderland.universal` ، ولكن هذه القيمة تؤثر على سياق التوجيه والسماوية فقط.

### 3 . اقرأ الحساب وأصوله {#_3-read-the-account-and-its-assets}

بعد توفير الحساب، استفسره مباشرة وإدراج صفحة الأصول المحددة. URL - ترميز قيمة I105 قبل استخدامها في مسار.

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

### 4 - ابحث عن أسماء مستعار مرتبطة بالحساب {#_4-look-up-aliases-bound-to-the-account}

القرار العكسي يقبل حسابًا واحدًا كانونيًا تمامًا ID. يمكن قراءة طوابق مساحة البيانات العامة دون عناوين توقيع الطلب. تتطلب مساحات البيانات المحدودة طلبًا مؤذنًا وقعًا.

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

`total: 0` صالحة: لا تحتاج الحساب إلى اسم مستعار. عندما تكون هناك ملزمة، قم بحل الاسم المستعار المحدد الكامل له ومقارنة الحساب المرد ID:

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

يمكن للمصنع Taira توفير حساب مقدم الطلب، ولكن هذا لا يمنح سلطة تسجيل الحساب العام أو السماوية الإدارية. يحتاج تسجيل حساب آخر إلى `CanRegisterAccount` تحت المؤكد النشط. تطلب مستعار الحسابات عادة أيضًا تأجير نشط SNS والإذنات المستعار المناسبة. استخدم جهاز التخطيط الإضافي / المستعار الذي يحكمه ، أو قم بتدريب التسجيل ضد الشبكة المحلية المولدة .

:::

على شبكة محلية، بمجرد أن يتم تصدير خطوة آمنة لتوفير الموقعين `NEW_ACCOUNT_ID` القنوني الجديد، تكون سطح التسجيل:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

إنشاء وتخزين المفاتيح الخاصة المتطابقة خارج مخزن الوثائق أو التطبيقات. تسجيل ID الذي تم إلقاء مفتاح التحكم فيه يخلق حسابًا غير صالح للاستخدام.

## التحقق {#verify}

إثبات أن مفتاح الإعداد العام، وتشفير I105 ، والاسم التلقائي الذي يربطهم جميعًا يتقاربون على حساب واحد طبي ID:

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

تخزين الحساب الكنسي IDs. استخدم الحساب القانوني IDs للتوقيعات والإذنات وإرشادات المعاملة. حل مستعار عند حدود التطبيق. احتفظ بالحساب الكنزي ID المستخدم للعملية.

## حل المشاكل {#troubleshooting}

- عادةً ما يعني خطأ تحليل أو إضافية أن عنوانًا تم ترميزه لملف شبكة مختلفة. قم بتطبيع مع `--profile taira` ورفض الخلافات.
- حساب `404` بعد الصنبور `202` يمكن أن يكون تأخير الانتشار. استطلاع الحساب أو الأصول الممولة قبل إرسال كتابة.
- `total: 0` من القرار العكسي يعني أنه لا يوجد مستعار مرئي مرتبط؛ إنه ليس فشل في البحث عن الحساب.
- `401` أو `403` من مسار مستعار يشير إلى مساحة بيانات محدودة أو عدم كفاية السماح بحل دقيق. لا تستخدم البحث واسع المسبق كخلف.
- قيمة القراءة `name@domain.dataspace` لا يتم قبولها في كل مكان يتطلب I105 ID قائمة.
- إذا نجحت تسجيل الحساب المحلي لكن Taira رفضته، فإن الفرق هو الإذن. الحصول على `CanRegisterAccount`؛ لا تغير الحساب ID لتجاوز التحقق من المصادقة.

## المصدر والوثائق ذات الصلة {#source-and-related-docs}

- [تنفيذ عنوان الحساب الكانونيكي في الالتزام المتعلق ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [الاختبارات الحسابية والسماوية Torii في الإجراءات المثبتة ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [الحسابات](/ar/blockchain/accounts.md)
- [أسماء مستعار نموذج البيانات ](/ar/blockchain/data-model.md#aliases)
- [اتفاقيات الإسم](/ar/reference/naming.md)
- [رموز الإذن ](/ar/reference/permissions.md)
