---
translation_locale: ar
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# الأصول القابلة للاستبدال {#fungible-assets}

## نتيجة {#outcome}

فحص تعريفات الأصول الحية Taira وإكمال سجل، وإصدار، وتحويل، وتدمير، وتحقق من الرصيد على شبكة محلية مُولَّدة. تستخدم الوصفة معرفات الأصول بصيغة Base58 القياسية البروتوكولية بدون بادئة، والأسماء المستعارة المؤهلة بالنطاق، ومعرفات الحسابات بدون نطاق I105، ودفع الرسوم الصريح.

## المتطلبات الأساسية {#prerequisites}

- `curl`، `jq`، Python 3.11 أو أحدث، Node.js 24، و`iroha` الحالي CLI.
- وصول للقراءة فقط Taira.
- لإجراء الشرح الكتابي، تم إنشاء شبكة محلية من [إطلاق Iroha](/ar/get-started/launch-iroha.md)، مع `./localnet/client.toml` و Torii على `http://127.0.0.1:8080`.

## خطوات {#steps}

### 1. فحص تعريفات Taira بدون موقّع تشفير {#_1-inspect-taira-definitions-without-a-signer}

تعريفات الأصول تحمل معرف Base58 غامض، واسم عرض، وسياسة إصدار الأصول، والمقياس الرقمي، واسم مستعار اختياري، والمالك، والكمية الإجمالية. يشمل الرصيد الفعلي أيضًا حساب الحامل ونطاق مساحة البيانات الاختياري.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

قم بتشغيل نموذج JavaScript باستخدام `node taira-assets.mjs`. معرفات الأصول العامة هي قيم Base58 عارية؛ القيمة القابلة للقراءة مثل `cookbook_credit#wonderland.universal` هي اسم مستعار يحل إلى أحد هذه المعرفات.

### 2. إعداد المبدأ التفويضي المحلي والوجهة {#_2-prepare-the-local-authority-and-destination}

استخرج مبدأ التفويض المحلي من المفتاح العام في التكوين الذي تم إنشاؤه واختر حسابًا مسجلًا آخر كمستلم. لا يتم طباعة أي مفتاح خاص.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. تسجيل تعريف رقمي {#_3-register-a-numeric-definition}

هذا المعرف المحلي فقط هو عنوان تعريف أصول صحيح غير مخصص بـ Base58. يوفّر الاسم المستعار الإسقاط القابل للقراءة من قبل الإنسان `domain.dataspace`. يسمح المقياس `2` برقمين عشريين؛ إن إغفال `--mint-once` يحتفظ بالسياسة الافتراضية `Infinitely`.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

لا تعيد استخدام هذا المعرف على Taira. تتطلب تسجيل شبكة البلوكشين العامة معرفًا جديدًا وفقًا لمعيار البروتوكول الواحد، ونطاقًا/اسم مستعار مخصصًا لتطبيقك، وتمويل الرسوم، وإذن تسجيل الأصول لبيئة تنفيذ البرنامج.

### ٤. إصدار، نقل، وتدمير {#_4-mint-transfer-and-burn}

جميع أوامر الكتابة تختار المسؤول المصرح به كدافع للرسوم بشكل صريح. يقوم CLI بعرض المعاملة الدقيقة قبل التوقيع وينتظر بشكل افتراضي.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

بعد التدمير، توقع رصيد المصدر `64.50`، ورصيد الوجهة `25.50`، والإجمالي الكلي `90.00`.

::: warning حدود الإذن

في Taira، قم بإرفاق `taira.tx-metadata.json` المشتق من الصنبور واستخدم `--fee-payer authority` لكل عملية كتابة. تتطلب التسجيل والإصدار أذونات المدقق النشط؛ تتطلب عملية النقل والتدمير تفويضًا أساسيًا على الرصيد المصدر. الحساب الممول من الشبكة الاختبارية ليس مُصدرًا تلقائيًا.

:::

## تحقق {#verify}

اقرأ كلا الرصيدين الملموسين ثم التعريف. تعتبر هذه الاستفسارات بعد الحالة معيار النجاح؛ سجل نتيجة بروتوكول الإرسال بمفرده ليس كذلك.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

يجب أن تقارن تأكيدات التطبيق القيم الرقمية كأعداد عشرية ثابتة، وليس كقيم نقطية عائمة ثنائية، ويجب أن تتحقق من معرف التعريف بالإضافة إلى الحساب.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- معرّف يحتوي على `#` هو اسم مستعار أو قيمة رصيد ملموسة، وليس معرف تعريف أصل واحد قياسي للبروتوكول. استخدم قيمة Base58 العارية مع `--definition`، أو مرّر اسم مستعار مرتبط مع `--definition-alias`.
- أخطاء `Scale` تعني أن الكمية تحتوي على أرقام عشرية أكثر مما تسمح به التعريف.
- `Mintability` الرفض يعني أن سياسة `Once` أو `Not` أو `Limited(n)` قد استُنفدت أو مُنعت من الإصدار. لا تعيد كتابة التاريخ؛ استخدم السياسة التي أعادها استعلام التعريف.
- الخطوة 2 تختار عمداً حساب وجهة مسجل. إذا كان قبول الأصول هو `ExplicitOnly`، قم بتوفير رصيد الوجهة من خلال مخول تدفق قبل النقل. الحارس المسمى بشكل مشابه CLI لا يسجل حسابًا أو رصيدًا؛ بل يتوقف بدلاً من إضافة أمر آخر.
- يحدث رفض الرسوم قبل نجاح التعليمات العادية. اختر الدافع، واستخدم بيانات تعريف أصل الرسوم الخاصة بالشبكة، وتحقق من رصيده.
- إذا كان التعريف المحلي الثابت موجودًا بالفعل من تشغيل سابق، فابدأ شبكة محلية جديدة تم إنشاؤها أو تابع باستخدام حالتها الحالية. لا تستبدل أبدًا سلسلة عشوائية خاطئة لرقم تعريف Base58.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [اختبارات تكامل دورة حياة الأصول عند مراجعة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust أمثلة على بناء الأصول في نسخة التعليمات البرمجية المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [الأصول](/ar/blockchain/assets.md)
- [تعليمات](/ar/blockchain/instructions.md)
- [رموز الإذن](/ar/reference/permissions.md)
- [JavaScript و TypeScript](/ar/guide/tutorials/javascript.md)
