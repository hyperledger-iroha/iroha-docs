---
translation_locale: ar
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# توقيع متعدد موزون {#weighted-multisig}

## نتيجة {#outcome}

سجّل حساب متعدد التوقيع يضم ثلاثة أعضاء على Taira، اقترح تعليمات بيانات وصفية، وافق عليها بالوزن الكافي للوصول إلى النصاب القانوني، وتحقق من التنفيذ من حالة حساب متعدد التوقيع.

## المتطلبات الأساسية {#prerequisites}

- ثلاثة معرفات توقيع قياسية للبروتوكول مفردة I105 في `SIGNER_A`، `SIGNER_B`، و`SIGNER_C`.
- تم تمويل تكوينات Taira للموقّعين التشفيريين A و C. يقوم المقترح وكل موافق بدفع رسوم معاملته الخاصة.
- `taira.tx-metadata.json` تم إنشاؤه من استجابة خدمة تمويل الشبكة التجريبية الحالية، وليس من معرف أصل الرسوم المنسوخ.
- مشروع عميل Rust مثبت على نفس مراجعة المصدر Iroha مثل Taira لخطوة التسجيل. الخطوات اللاحقة للاقتراح والموافقة تستخدم CLI.
- تم تمكين ميزة التوقيع المتعدد للمُنَفِذ الحالي. التسجيل متاح للحسابات العادية في بيئة تنفيذ البرامج الافتراضية Iroha 3، على الرغم من أن سياسة Taira ورسوم القبول لا تزال تنطبق؛ استخدم الشبكة المحلية إذا رفض النشر العام ذلك.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## خطوات {#steps}

### 1. تسجيل سياسة مرجحة {#_1-register-a-weighted-policy}

الموقّع التشفيري C له وزن 2؛ أما A و B فلديهما وزن 1 لكل منهما. لذلك، يتطلب النصاب المكون من 3 أشخاص وجود C بالإضافة إلى إما A أو B. استخرج الحساب القياسي للبروتوكول من تلك السياسة بالضبط قبل التسجيل، ثم مرر نفس القيمة إلى `MultisigRegister::with_account`:

```rust
use std::{collections::BTreeMap, num::{NonZeroU16, NonZeroU64}};
use iroha::{
    data_model::{
        account::{MultisigMember, MultisigPolicy},
        prelude::*,
        transaction::FeePaymentIntent,
    },
    executor_data_model::isi::multisig::{
        MultisigApprove, MultisigPropose, MultisigRegister, MultisigSpec,
    },
};

let spec = MultisigSpec::new(
    BTreeMap::from([
        (signer_a.clone(), 1),
        (signer_b.clone(), 1),
        (signer_c.clone(), 2),
    ]),
    NonZeroU16::new(3).unwrap(),
    NonZeroU64::new(3_600_000).unwrap(),
);
let members = spec
    .signatories
    .iter()
    .map(|(account, weight)| {
        let key = account
            .controller()
            .single_signatory()
            .expect("multisig members must be single-key accounts");
        MultisigMember::new(key.clone(), u16::from(*weight))
            .expect("weights are nonzero")
    })
    .collect();
let policy = MultisigPolicy::new(spec.quorum.get(), members)?;
let multisig_account = AccountId::new_multisig(policy);
let register = MultisigRegister::with_account(
    multisig_account.clone(),
    None::<DomainId>,
    spec,
);

registrar.submit_blocking::<InstructionBox>(
    register.into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
println!("{}", multisig_account.canonical_i105()?);
```

احفظ القيمة المطبوعة للخطوات CLI:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

في إصدار كود المصدر المثبت، يقوم أمر التسجيل CLI بطباعة بذوره المؤقتة قبل أن يعيد بيئة تنفيذ البرنامج تشفيرها بمفتاح جديد. لا تُعد استخدام تلك البذرة كالمتحكم. لا يوجد مفتاح خاص للمتحكم: يأتي مبدأ تفويض التوقيع المتعدد فقط من المقترحات المعتمدة.

### 2. أنشئ تعليمًا واحدًا دون تقديمه {#_2-build-one-instruction-without-submitting-it}

المفتاح العالمي `-o` يقوم بتسلسل مصفوفة التعليمات إلى المخرجات القياسية. لا يقوم بتقديم معاملة وبالتالي لا ينفق أي رسوم.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. اقترح كالموقّع التشفيري A {#_3-propose-as-signer-a}

يقوم المقترح تلقائيًا بالمساهمة بوزنه الخاص. قم بالتقاط تجزئة التعليمات المشفرة الدقيقة المطبوعة بواسطة CLI؛ الموافقات مرتبطة بتلك التجزئة المشفرة.

```bash
PROPOSE_OUTPUT="$({
  iroha --config "$SIGNER_A_CONFIG" \
    --output-format text \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger multisig propose \
    --account "$MULTISIG_ACCOUNT" \
    < multisig-instructions.json
})"
printf '%s\n' "$PROPOSE_OUTPUT"

INSTRUCTIONS_HASH="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^instructions_hash: //p' |
    head -n 1
})"
test -n "$INSTRUCTIONS_HASH"
```

قم بإدراج الاقتراحات المعلقة حتى الآن باستخدام محدد نهائي صريح:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### ٤. الموافقة كموقّع تشفير C {#_4-approve-as-signer-c}

وزن A 1 بالإضافة إلى وزن C 2 يصل إلى النصاب 3 وينفذ التعليمة المقترحة كحساب متعدد التوقيعات.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

يمكن للعميل Rust الاستمرار بنفس الحساب المستمد من السياسة والتعليمات المتعلقة بدورة الحياة المستخدمة أعلاه:

```rust
let instructions = vec![SetKeyValue::account(
    multisig_account.clone(),
    "cookbook_quorum".parse()?,
    Json::from("approved"),
).into()];
let instructions_hash = HashOf::new(&instructions);
signer_a_client.submit_blocking::<InstructionBox>(
    MultisigPropose::new(multisig_account.clone(), instructions, None).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
signer_c_client.submit_blocking::<InstructionBox>(
    MultisigApprove::new(multisig_account, instructions_hash).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## تحقق {#verify}

اقرأ حالة ما بعد الولاية وتأكد من أن الاقتراح لم يعد قيد الانتظار:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger account meta get \
  --id "$MULTISIG_ACCOUNT" \
  --key cookbook_quorum

iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"

iroha --config "$SIGNER_A_CONFIG" ledger multisig inspect \
  --account "$MULTISIG_ACCOUNT" \
  --json |
  jq .
```

يجب أن تكون قيمة البيانات الوصفية `"approved"`، ويجب ألا يظهر تجزئة التعليمات المشفرة الملتقطة كمعلقة، ويجب أن يُظهر المتحكم الذي تم فحصه الأوزان `1, 1, 2` مع النصاب `3`.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- `signatory is not part of multisig` يعني أن العميل المقترح أو الموافق لا يتطابق مع أي من معرفات I105 المسجلة في البوليصة.
- يمكن رفض الموافقة النهائية عندما يفتقر حساب التوقيع المتعدد إلى إذن لتنفيذ التعليمات المقترحة. امنح سلطة التفويض للحساب متعدد التوقيع، وليس لموقعيه التشفيريين الفرديين فقط، ثم دع أحد الموقعين التشفيريين المتبقين يحاول مرة أخرى.
- قد يعني الاقتراح المعلق المفقود أن النصاب القانوني تم الوصول إليه بالفعل، أو أن TTL انتهت صلاحيته، أو تم استخدام تجزئة التعليمات/محدد الحساب الخطأ. استعلم عن الحالة التالية قبل تقديم الاقتراح مرة أخرى.
- الموافقات المكررة لا تضيف وزنًا. كل موقع مسجل يساهم بوزنه المكون مرة واحدة فقط في أقصى حد.
- توقيع معاملة عادية مباشرةً بوصفك المسؤول محظور. استخدم دائمًا `MultisigPropose` و `MultisigApprove`.
- إذا لم تتمكن الأوامر اللاحقة من العثور على الحساب المطبوع أثناء تسجيل CLI، فقد قمت بالتقاط البذرة المؤقتة. استخرج الحساب الواحد وفق معيار البروتوكول من السياسة المرتبة وسجل باستخدام تلك القيمة كما هو موضح أعلاه.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [اختبارات تكامل التوقيع المتعدد عند نسخة التعليمات البرمجية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [نموذج بيانات التوقيع المتعدد عند نسخة التعليمات البرمجية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI تنفيذ التوقيع المتعدد في نسخة التعليمات البرمجية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [المعاملات](/ar/blockchain/transactions.md)
- [الأذونات والأدوار](./permissions-and-roles.md)
