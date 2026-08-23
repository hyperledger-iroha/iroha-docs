---
translation_locale: ar
translation_source: /cookbook/multisig.md
translation_source_hash: 7090228c4fea7321c93fe0d2c67ef6de842de95bc3befa11d83c12b9f15b4752
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الوزن Multisig {#weighted-multisig}

## النتيجة {#outcome}

سجل حساب متعدد الأعضاء الموزن على Taira ، واقترح تعليمات البيانات المعدنية، وافق عليها مع الوزن الكافي لتلبية القرار والتحقق من التنفيذ من حالة الحساب المتعدد الأعضاء.

## الشروط المسبقة {#prerequisites}

- ثلاثة قوانين I105 التوقيع IDs في `SIGNER_A`, `SIGNER_B`, و `SIGNER_C`.
- التكوينات الممولة Taira للموقعين A و C. يدفع مقدم المقترح وكل من يوافق على الصفقة الخاصة بهم.
- `taira.tx-metadata.json` تم بناؤه من استجابة النوافذ الحالية ، أبداً من أصول الرسوم المنسخة ID.
- مشروع عميل Rust متصل بنفس مراجعة المصدر Iroha مثل Taira لخطوة التسجيل. تستخدم خطوات الاقتراح والموافقة اللاحقة CLI.
- تمكين ميزة التنفيذية الحالية متعددة الإشارات. يتم تسجيل الحسابات العادية في وقت تشغيل الافتراضي Iroha 3 ، على الرغم من أن سياسة Taira وإدخال الرسوم لا تزال تطبق ؛ استخدم localnet إذا رفضت النشر العام ذلك .

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## الخطوات {#steps}

### 1 - تسجيل سياسة معززة {#_1-register-a-weighted-policy}

علامة C لها وزن 2 ؛ A و B لديها وزن 1 كل واحد. لذلك يتطلب الكوروم من 3 C بالإضافة إلى إما A أو B. استنتاج الحساب الكنسي من هذه السياسة الدقيقة قبل التسجيل ، ثم تمرير نفس القيمة إلى `MultisigRegister::with_account`:

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

حافظ على القيمة المطبوعة لخطوات CLI:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

في الإجراءات المثبتة، تقوم أمر التسجيل CLI بطبع البذور المؤقتة قبل إعادة تشغيلها في وقت التشغيل. لا تستخدم هذه البذور مرة أخرى كمراقب. لا يوجد مفتاح خاص للمراقب: يأتي سلطة الـ multisig فقط من المقترحات المعتمدة.

### 2- بناء تعليم واحد دون تقديمها {#_2-build-one-instruction-without-submitting-it}

يقوم المفتاح العالمي `-o` بتسلسل صفوف التعليمات إلى النتائج القياسية. لا يقدم معاملة وبالتالي لا ينفق أي رسوم.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3 . اقترح كوقيع A {#_3-propose-as-signer-a}

يقوم المقترح بتقديم وزنه الخاص تلقائيًا. التقاط الهش التعليمات الدقيقة المطبوعة بواسطة CLI ؛ التوافقات ترتبط بذلك الهش.

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

قم بإدراج المقترح الذي لا يزال بانتظار مع اختيار محدود صريح:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4- الموافقة على التوقيع (ج) {#_4-approve-as-signer-c}

الوزن 1 زائد الوزن 2 C يصل إلى الحكم 3 وينفذ التعليمات المقترحة كحساب multisig.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

يمكن للعميل Rust الاستمرار بنفس الحساب المستمد من السياسة والتعليمات الدورة العملية الثانية المستخدمة أعلاه:

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

## التحقق {#verify}

اقرأ ما بعد البيان وتؤكد أن الاقتراح لم يعد في انتظار:

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

يجب أن تكون قيمة البيانات المعدنية `"approved"` ، ويجب ألا يظهر الهش التعليمات التي تم التقاطها بعد الآن كما لو كانت معلقة، ويجب على مراقب المفتش أن يعرض الأوزان `1, 1, 2` مع الكوروم `3`.

## حل المشاكل {#troubleshooting}

- `signatory is not part of multisig` يعني أن العميل المقترح أو الموافقة لا يتطابق مع أحد I105 IDs المسجلين في السياسة.
- يمكن رفض الموافقة النهائية عندما يفتقر حساب multisig إلى الإذن لتنفيذ التعليمات المقترحة. إعطاء سلطة لحساب multisig ، وليس فقط لموقعيها الفرديين ، ثم دع المتوقعين الباقين يحاولون مرة أخرى.
- قد يعني فقدان الاقتراح المعلن أنه تم التوصل بالفعل إلى الحكم القضائي، أو انتهى صلاحية TTL ، أو استخدم اختيار الهاش/حساب الإرشادات الخطأ. استفسر من البعثة قبل اقتراح مرة أخرى.
- الموافقات المكررة لا تضيف الوزن. كل توقيع مسجل يساهم وزنه التشريعي مرة واحدة على الأكثر.
- التوقيع المباشر على المعاملة العادية باعتبارها مسؤولة عن المعاملة محظور. استخدم `MultisigPropose` و `MultisigApprove` دائمًا.
- إذا لم تتمكن الأوامر اللاحقة من العثور على الحساب المطبوع أثناء تسجيل CLI ، فقد قبضت على البذور المؤقتة. استخرج الحساب القنوني من السياسة المنظمة والسجل مع هذه القيمة كما هو موضح أعلاه.

## المصدر والوثائق ذات الصلة {#source-and-related-docs}

- [اختبارات التكامل متعددة الأطراف في الالتزام المتعلق ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/multisig.rs)
- [نموذج البيانات المتعددة الأطراف في الالتزام المثبت ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/isi.rs)
- [تنفيذ CLI متعددة الألواح في اللجنة المثبتة](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [المعاملات](/ar/blockchain/transactions.md)
- [الترخيصات والأدوار ](./permissions-and-roles.md)
