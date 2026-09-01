---
translation_locale: ar
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# البيانات الوصفية {#metadata}

## نتيجة {#outcome}

اقرأ البيانات الوصفية على Taira، واضبط وتحقق من قيمة بيانات وصفية لحساب واحد من خلال معاملة تدفع الرسوم صراحة، وأزل القيمة مرة أخرى. ستبقي بيانات الكائن على دفتر الأستاذ الخاص بالبلوكشين منفصلة عن بيانات رسوم المعاملات.

## المتطلبات الأساسية {#prerequisites}

- `curl`، `jq`، Python 3.11 أو أحدث، و`iroha` الحالي CLI.
- تمويل `taira.client.toml` و `taira.tx-metadata.json` من [الاتصال بـ Taira](./connect-to-taira.md).
- الجهة المخوّلة على بيانات الحساب الهدف. المثال يستهدف الجهة المخوّلة المهيأة نفسها؛ حساب آخر يتطلب إذنًا محددًا بالضبط.

## خطوات {#steps}

### ١. قراءة البيانات الوصفية بدون موقع تشفير {#_1-read-metadata-without-a-signer}

البيانات الوصفية هي خريطة مُتحقق منها من `Name` إلى JSON. الخرائط الفارغة والمخرجات المفلترة الفارغة هي نتائج صالحة.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

استخدم البيانات الوصفية للحقل الصغيرة الوصفية أو الفهرسة. ضع الحمولة الكبيرة خارج دفتر سجل البلوكشين وخزن قيمة ملخص تشفيرية، URI، أو مرجع SoraFS بدلاً من ذلك.

### 2. استخرج الحساب المستهدف {#_2-derive-the-target-account}

اقرأ مفتاح النسخ العامة فقط من إعداد Taira وحوّله إلى الشكل الموحد المعياري للبروتوكول بدون نطاق I105.

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
```

### 3. قم بتعيين قيمة واحدة JSON {#_3-set-one-json-value}

يصبح JSON المقروء من الإدخال القياسي هو قيمة `cookbook_profile` للحساب. بالمقابل، يرفق `--metadata ./taira.tx-metadata.json` حقول الرسوم بحاوية بيانات المعاملة. الخريطتان لهما أهداف وأغراض مختلفة.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

يعرض CLI الرسوم، يوقع، يقدّم، وينتظر بشكل افتراضي. لا تضف `--no-wait` عندما تعتمد العملية التالية على هذه القيمة.

::: warning حدود الإذن

المُتحقق النشط يقرر من يمكنه تعديل كل كائن. تحديث حساب آخر عادةً يتطلب `CanModifyAccountMetadata`؛ المجالات، تعريفات الأصول، NFTs، والمحركات لديها أذونات بيانات وصفية محددة للأهداف الخاصة بها. إذا لم يقم Taira بمنح الصلاحية المطلوبة للمخول الرئيسي، قم بتشغيل أوامر الحساب نفسها باستخدام `./localnet/client.toml`، واستبدل معرف I105 الوحيد للبروتوكول القياسي للمخول المحلي المُنشأ، وتجاوز ملف بيانات الرسوم Taira. احتفظ بالاختيار الصريح للمدفوعات المحلية.

:::

### ٤. أزل المفتاح {#_4-remove-the-key}

اقرأ أولاً القيمة النهائية، ثم قدم معاملة إزالة منفصلة.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

بالنسبة لتطبيقات Python، فإن البناة المكتوبين المطابقين هم `Instruction.set_account_key_value` و `Instruction.remove_account_key_value`؛ قدّمهم مع بيانات المعاملة وأداة الانتظار المساعدة من [Python درس تعليمي](/ar/guide/tutorials/python.md#shared-setup).

## تحقق {#verify}

بعد إجراء المعاملة المحددة، يجب على `meta get` إرجاع الكائن مع `version: 1`. بعد الإزالة، يجب ألا يُرجع البحث المباشر أي قيمة:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

الحساب المنفصل المقروء يميز بين مفتاح بيانات وصفية مفقود وبين فشل في الشبكة أو الحساب. يجب على الكود الإنتاجي أيضًا التحقق من القيمة الكاملة JSON بعد تعيينها.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- يجب أن يحتوي الإدخال القياسي على قيمة صالحة واحدة JSON. يجب أن تحتوي السلاسل على علامات الاقتباس JSON؛ يجب أن تكون الكائنات والمصفوفات مُكوَّنة بشكل صحيح.
- مفاتيح البيانات الوصفية هي قيم `Name` وتُراعى فيها حالة الأحرف بعد التحليل. احتفظ بمفردات مفتاح ثابتة بدلاً من إنشاء مفاتيح بإصدارات لكل تغيير في المخطط.
- `--metadata` هو بيانات تعريف المعاملة؛ ولا يقوم بتعيين بيانات تعريف كائن دفتر الأستاذ على البلوكشين. استخدم الأمر الفرعي `meta set` للكيان للأخير.
- قد يكون النجاح في الإرسال متبوعًا بقراءة قديمة تأخيرًا في الانتشار. انتظر التأكيد النهائي المطبق وأعد محاولة الاستعلام قبل إعادة الإرسال.
- يشير رفض الإذن إلى تحديد الكائن المستهدف وحدود السلطة المصرح لها. قم بالتدريب محليًا أو اطلب الرمز الدقيق؛ لا تنقل بيانات التطبيق الخاصة إلى حقل بيانات وصفية عام لتجنب التحكم في الوصول.
- لا تقم أبدًا بتخزين المفاتيح الخاصة أو معرفات الشخصية الخام أو رموز الوصول أو المستندات الكبيرة في البيانات الوصفية.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [اختبارات تكامل استعلام البيانات الوصفية عند نسخة التعليمات البرمجية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK منشئو المعاملات في إصدار الشيفرة المصدرية المثبت](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [البيانات الوصفية](/ar/blockchain/metadata.md)
- [البيانات الوصفية وخيارات تخزين سجل البلوكشين](/ar/guide/configure/metadata-and-store-assets.md)
- [مرجع التعليمات](/ar/reference/instructions.md)
- [رموز الإذن](/ar/reference/permissions.md)
