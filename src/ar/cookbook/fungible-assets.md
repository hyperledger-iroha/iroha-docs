---
translation_locale: ar
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# الأصول القابلة للاستبدال {#fungible-assets}

## نتيجة {#outcome}

فحص تعريفات أصول Taira الحية وإكمال مسار إصدار وتحويل وتدمير وتحقق من الرصيد على شبكة محلية مُولَّدة. تستخدم الوصفة معرفات تعريفات الأصول بصيغة Base58 القياسية البروتوكولية بدون بادئة، ومعرفات الحسابات I105 بدون نطاق، ودفع الرسوم الصريح.

## المتطلبات الأساسية {#prerequisites}

- `curl`، `jq`، Python 3.11 أو أحدث، Node.js 24، وأداتا سطر الأوامر الحاليتان `iroha` و`kagami` (CLIs).
- وصول للقراءة فقط Taira.
- لجولة عمليات الكتابة، شبكة محلية مُنشأة باستخدام `kagami localnet generate --peers 4 --out-dir ./localnet` كما في [إطلاق Iroha](/ar/get-started/launch-iroha.md)، مع إضافة `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa`. توفر هذه الشبكة `./localnet/client.toml` و Torii على `http://127.0.0.1:8080`.

## خطوات {#steps}

### 1. فحص تعريفات Taira بدون موقّع تشفير {#_1-inspect-taira-definitions-without-a-signer}

تعريفات الأصول تحمل معرف Base58 غامض، واسم عرض، وسياسة إصدار الأصول، والمقياس الرقمي، واسم مستعار اختياري، والمالك، والنطاق المالك أو مساحة البيانات المالكة (اختياري)، وسياسة الرصيد، والكمية الإجمالية. يشمل الرصيد الفعلي أيضًا حساب الحامل ونطاق مساحة البيانات الاختياري.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
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

استخرج مبدأ التفويض المحلي من المفتاح العام في التكوين الذي تم إنشاؤه، ثم أنشئ زوج مفاتيح لحساب مستلم جديد وسجّله. لا يتم طباعة أي مفتاح خاص.

```bash
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

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. استخدام تعريف رقمي يملكه العميل {#_3-use-a-client-owned-numeric-definition}

خارج كتلة التكوين، يُسجَّل التعريف ضمن نطاق مالك (`--domain`) يملكه الموقّع، ولا يملك عميل الشبكة المحلية المُولَّدة أي نطاق. تحتوي الشبكة المحلية المُولَّدة باستخدام `--asset-definition-id` على هذا التعريف مسبقًا: فقد سجّلته كتلة التكوين بمقياس غير مقيّد، وجعلت العميل مالكه، وأصدرت 1,000,000,000 وحدة للعميل.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

لا تعيد استخدام هذا المعرف على Taira. يتطلب التسجيل على شبكة البلوكشين العامة معرفًا قياسيًا جديدًا وفقًا للبروتوكول، ونطاقًا مالكًا يملكه حسابك (يُمرَّر إلى `ledger asset definition register` بصفته `--domain`)، ومنح `CanManageAssetDefinitionAlias` لأي اسم مستعار، وتمويل الرسوم.

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

بعد التدمير، توقع رصيد المصدر `1000000064.50`، ورصيد الوجهة `25.50`، والإجمالي الكلي `1000000090.00`.

::: warning حدود الإذن

في Taira، استخدم `--fee-payer authority` لكل عملية كتابة؛ يعرض CLI تقدير سعر الرسوم الدقيق بأصل رسوم Taira قبل التوقيع. يتطلب التسجيل امتلاك النطاق `--domain` الخاص بالتعريف، ويحتاج الاسم المستعار أيضًا إلى `CanManageAssetDefinitionAlias`. يتطلب الإصدار امتلاك التعريف أو حيازة `CanMintAssetWithDefinition` أو `CanMintAssetToAccount`؛ وتتطلب عملية النقل والتدمير صلاحيةً على الرصيد المصدر. الحساب الممول من الشبكة الاختبارية ليس مُصدرًا تلقائيًا.

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
- الخطوة 2 تسجّل حساب الوجهة صراحةً، لذا يعمل النقل أيضًا عندما يكون قبول الحسابات هو `ExplicitOnly`. حارس CLI ذو الاسم المشابه لا يسجل حسابًا أو رصيدًا؛ بل يتوقف بدلاً من إضافة تعليمة أخرى.
- يحدث رفض الرسوم قبل نجاح التعليمات العادية. اختر الدافع، وراجع أصل الرسوم والحد الأقصى في تقدير سعر الرسوم الذي يعرضه CLI، ثم تحقق من ذلك الرصيد.
- إعادة التشغيل على الشبكة المحلية نفسها تبدأ من الأرصدة السابقة، ويرفض `kagami keys` المجلد `./cookbook-recipient` الموجود مسبقًا. ابدأ شبكة محلية جديدة مُولَّدة واحذف ذلك المجلد، أو قارن التغيرات في الأرصدة بدلًا من القيم المطلقة. لا تضع أبدًا سلسلة عشوائية مشوّهة بدلًا من معرّف Base58.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [اختبارات تكامل دورة حياة الأصول عند مراجعة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust أمثلة على بناء الأصول في نسخة التعليمات البرمجية المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [الأصول](/ar/blockchain/assets.md)
- [تعليمات](/ar/blockchain/instructions.md)
- [رموز الإذن](/ar/reference/permissions.md)
- [JavaScript و TypeScript](/ar/guide/tutorials/javascript.md)
