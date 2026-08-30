---
translation_locale: ar
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 669b5a1c12e9ab6ffb64e149148993e7b924feb29c6fa4db883a2065f58ecd7e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الأصول المعدلة {#fungible-assets}

## النتيجة {#outcome}

تحقق من تعريفات الأصول Taira على الهاتف المباشر وإكمال تدفق السجل والنقشة والتحويل والحرق والتحقق من التوازن على شبكة محلية تم إنشاؤها. الوصفة تستخدم تعريف أصول Base58 غير المسبق IDs ، أسماء مستعار مؤهلة للمجال، حساب I105 بدون مجال IDs، ودفع رسوم صريحة.

## الشروط المسبقة {#prerequisites}

- `curl` ، `jq`، Python 3.11 أو بعد ذلك، Node.js 24، والتيار `iroha` CLI.
- إمكانية الوصول إلى Taira فقط.
- للكتابة من خلال المشي، تم إنشاء شبكة محلية من [إطلاق Iroha](/ar/get-started/launch-iroha.md)، مع `./localnet/client.toml` و Torii على `http://127.0.0.1:8080`.

## الخطوات {#steps}

### 1. تحقق من تعريفات Taira دون توقيع {#_1-inspect-taira-definitions-without-a-signer}

تحتوي تعريفات الأصول على قاعدة غير واضحة58 ID ، اسم العرض، سياسة الوصول إلى البيانات، والقياس الرقمي، الاسم الخاطئ الاختياري، والمالك، والكمية الإجمالية. يتضمن الميزان الملموس أيضًا حساب صاحبها ونطاق مساحة البيانات الخيارية.

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

قم بتشغيل نموذج JavaScript مع `node taira-assets.mjs`. الأصول العامة IDs هي قيم Base58 العارية. القيمة القابلة للقراءة مثل `cookbook_credit#wonderland.universal` هو اسم مستعار يصل إلى واحدة من تلك IDs.

### 2 - إعداد السلطة المحلية و الوجهة {#_2-prepare-the-local-authority-and-destination}

استخرج السلطة المحلية من المفتاح العام في الإعداد الذي تم إنشاؤه واختيار حساب مسجل آخر كمستلم. لا يتم طباعة مفتاح خاص.

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

### 3- تسجيل التعريف الرقمي {#_3-register-a-numeric-definition}

هذا ID المحلي فقط هو عنوان بيان الأصول Base58 غير المحدد الصالح. يقدم الاسم التلقائي توقعات `domain.dataspace` القابلة للقراءة من قبل الإنسان. يتيح مقياس `2` رقمين جزئيين؛ وإبعاد `--mint-once` يحافظ على سياسة الافتراضية `Infinitely`.

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

لا تستخدم مرة أخرى ID على Taira. التسجيل في الشبكة العامة يتطلب قائمة قانونية جديدة ID، ونطاق النطاق / مستعار تم تخصيصه لطلبك، وتمويل الرسوم، والإذن لتسجيل الأصول لفترة تشغيلها.

### 4 - النعناع، النقل، والحرق {#_4-mint-transfer-and-burn}

جميع أوامر الكتابة تختار السلطة كمدفع الرسوم صراحة. CLI يقتبس المعاملة الدقيقة قبل التوقيع وينتظر الافتراضي.

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

بعد الحرق، تتوقع ميزان المصدر `64.50` ، وميزان الوجهة `25.50` ، والكمية الإجمالية `90.00`.

::: warning حدود الإذن

في Taira ، ضمني `taira.tx-metadata.json` المستمد من الصنبور واستخدم `--fee-payer authority` لكل كتابة. يتطلب التسجيل والقطع تصاريح المؤكد النشط ؛ يتطلب التحويل والحرق سلطة على رصيد المصدر. حساب تمويله من الصنوبر ليس بطبيعة الحال مصدرًا.

:::

## التحقق {#verify}

اقرأ كل من التوازنات الملموسة ثم التعريف. هذه الاستفسارات ما بعد الدولة هي معيار النجاح؛ وصفة تقديمها نفسها ليست كذلك.

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

يجب على التصريحات التطبيقية مقارنة القيم الرقمية باعتبارها عشرات نقطة ثابتة، وليس قيم نقطة عائمة ثنائية، وينبغي التحقق من تعريف ID وكذلك الحساب.

## حل المشاكل {#troubleshooting}

- إن ID الذي يحتوي على `#` هو مستعار أو ميزان ملموس حرفيًا ، وليس تعريف أصول قائديًا ID. استخدم قيمة Base58 العارية مع `--definition` ، أو اجتياز مستعار مقيد مع `--definition-alias`.
- الأخطاء `Scale` تعني أن كمية لديها أرقام جزئية أكثر من يسمح بها التعريف.
- `Mintability` الرفض يعني أن سياسة `Once`، `Not`، أو `Limited(n)` قد استنفدت أو لم تسمح بالتصبغ. لا تقوم بإعادة كتابة التاريخ؛ استخدم السياسة التي أعادتها الاستفسار عن التعريف.
- الخطوة 2 تختار عمدا حساب الوجهة المسجلة. إذا كان إدخال الأصول هو `ExplicitOnly` ، توفير رصيد الوجهة من خلال مصرح التدفق قبل التحويل. الحارس الذي يُسمى بنفس الطريقة CLI لا يسجل حسابًا أو رصيدًا؛ فإنه يستبعد بدلا من إضافة تعليمات أخرى.
- يحدث رفض الرسوم قبل نجاح التعليمات العادية. حدد المدفوع، واستخدم بيانات أصول الرسوم في الشبكة، وتحقق من رصدها.
- إذا كان التعريف المحلي الثابت موجودًا بالفعل من تشغيل سابق ، قم بإطلاق شبكة محلية جديدة أو استمر في حالتها الحالية. لا تستبدل أبداً سلسلة عشوائية غير مصممة بشكل خاطئ بـ Base58 ID.

## المصدر والوثائق ذات الصلة {#source-and-related-docs}

- [اختبارات تكامل دورة حياة الأصول في الالتزام المثبت ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust أمثلة على تشكيل الأصول في الالتزامات المحددة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [الأصول](/ar/blockchain/assets.md)
- [التعليمات](/ar/blockchain/instructions.md)
- [رموز الإذن ](/ar/reference/permissions.md)
- [JavaScript و TypeScript ](/ar/guide/tutorials/javascript.md)
