---
translation_locale: ar
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# توقيع متعدد موزون {#weighted-multisig}

## نتيجة {#outcome}

سجّل حساب متعدد التوقيع يضم ثلاثة أعضاء على Taira، اقترح تعليمات بيانات وصفية، وافق عليها بالوزن الكافي للوصول إلى النصاب القانوني، وتحقق من التنفيذ من حالة حساب متعدد التوقيع.

## المتطلبات الأساسية {#prerequisites}

- ثلاثة معرفات توقيع قياسية للبروتوكول مفردة I105 في `SIGNER_A`، `SIGNER_B`، و`SIGNER_C`.
- تم تمويل تكوينات Taira للموقّعين التشفيريين A و C. يقوم المقترح وكل موافق بدفع رسوم معاملته الخاصة.
- تستخدم عمليات الكتابة عبر CLI الخيار `--fee-payer authority`؛ ويعرض CLI تقدير سعر الرسوم الدقيق بأصل رسوم Taira قبل التوقيع.
- مشروع عميل Rust يعتمد على `iroha` و`iroha_model_base`، ومثبَّت على مراجعة مصدر Iroha نفسها التي يعمل بها Taira، لخطوة التسجيل. الخطوات اللاحقة للاقتراح والموافقة تستخدم CLI.
- تم تمكين ميزة التوقيع المتعدد للمُنَفِذ الحالي. التسجيل متاح للحسابات العادية في بيئة تنفيذ البرامج الافتراضية Iroha 3، على الرغم من أن سياسة Taira ورسوم القبول لا تزال تنطبق؛ استخدم الشبكة المحلية إذا رفض النشر العام ذلك.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## خطوات {#steps}

### 1. تسجيل سياسة مرجحة {#_1-register-a-weighted-policy}

الموقّع التشفيري C له وزن 2؛ أما A و B فلديهما وزن 1 لكل منهما. لذلك، يتطلب النصاب البالغ 3 وجود C بالإضافة إلى إما A أو B. هنا `registrar` هو `iroha::blocking::Client`، الذي ينتظر `submit` الخاص به الوصول إلى نهائية Applied. استخرج الحساب القياسي للبروتوكول من تلك السياسة بالضبط قبل التسجيل، ثم مرر نفس القيمة إلى `MultisigRegister::with_account`:

```rust
use std::{collections::BTreeMap, num::{NonZeroU16, NonZeroU64}};
use iroha::{
    data_model::{
        account::{MultisigMember, MultisigPolicy},
        prelude::*,
        transaction::FeePaymentIntent,
    },
    executor_data_model::isi::multisig::{
        MultisigApprove, MultisigProposalId, MultisigProposalNonce,
        MultisigPropose, MultisigRegister, MultisigSpec,
    },
};
use iroha_model_base::domain::DomainId;

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

registrar.submit::<InstructionBox>(
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

في إصدار كود المصدر المثبت، يقوم أمر التسجيل في CLI بطباعة بذرته المؤقتة قبل أن تعيد بيئة تنفيذ البرنامج تعيين مفاتيحه. لا تُعِد استخدام تلك البذرة كمتحكم. لا يوجد مفتاح خاص للمتحكم: يأتي مبدأ تفويض التوقيع المتعدد فقط من المقترحات المعتمدة. للتسجيل من CLI بدلًا من ذلك، مرّر القيمة المستمدة من السياسة إلى `ledger multisig register --account`.

### 2. أنشئ تعليمًا واحدًا دون تقديمه {#_2-build-one-instruction-without-submitting-it}

الخيار العام `--emit-instructions` يطبع مصفوفة التعليمات إلى المخرجات القياسية بدلًا من تقديمها، لذا لا ينفق أي رسوم.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. اقترح كالموقّع التشفيري A {#_3-propose-as-signer-a}

يقوم المقترح تلقائيًا بالمساهمة بوزنه الخاص. أنشئ قيمة nonce جديدة للاقتراح واحتفظ بها لأي إعادة محاولة. التقط معرّف الاقتراح وتجزئة التعليمات اللذين يطبعهما CLI؛ فالموافقات مرتبطة بكليهما.

```bash
PROPOSAL_NONCE="$(openssl rand -hex 32)"
PROPOSE_OUTPUT="$({
  iroha --config "$SIGNER_A_CONFIG" \
    --output-format text \
    --fee-payer authority \
    ledger multisig propose \
    --proposal-nonce "$PROPOSAL_NONCE" \
    --account "$MULTISIG_ACCOUNT" \
    < multisig-instructions.json
})"
printf '%s\n' "$PROPOSE_OUTPUT"

PROPOSAL_ID="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^proposal_id: //p' |
    head -n 1
})"
INSTRUCTIONS_HASH="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^instructions_hash: //p' |
    head -n 1
})"
test -n "$PROPOSAL_ID"
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
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

يمكن لعميل Rust الاستمرار بنفس الحساب المستمد من السياسة وتعليمتي دورة الحياة المستخدمتين أعلاه. كل عميل موقّع هو `iroha::blocking::Client`؛ ويُشتق معرّف الاقتراح من شبكة العميل وحساب التوقيع المتعدد وقيمة nonce جديدة:

```rust
let instructions = vec![SetKeyValue::account(
    multisig_account.clone(),
    "cookbook_quorum".parse()?,
    Json::from("approved"),
).into()];
let instructions_hash = HashOf::new(&instructions);
// A fresh nonzero nonce, for example from `openssl rand -hex 32`.
let proposal_nonce: MultisigProposalNonce = "<FRESH_64_HEX_NONCE>".parse()?;
let proposal_id = MultisigProposalId::derive(
    signer_a_client.client().network_id(),
    &multisig_account,
    &proposal_nonce,
);
signer_a_client.submit::<InstructionBox>(
    MultisigPropose::new(
        multisig_account.clone(),
        proposal_nonce,
        instructions,
        None,
    )
    .into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
signer_c_client.submit::<InstructionBox>(
    MultisigApprove::new(multisig_account, proposal_id, instructions_hash)
        .into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## تحقق {#verify}

اقرأ حالة ما بعد الولاية وتأكد من أن الاقتراح لم يعد قيد الانتظار:

```bash
iroha --config "$SIGNER_A_CONFIG" account meta get \
  --id "$MULTISIG_ACCOUNT" \
  --key cookbook_quorum

iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"

iroha --config "$SIGNER_A_CONFIG" ledger multisig inspect \
  --account "$MULTISIG_ACCOUNT" \
  --json |
  jq .
```

يجب أن تكون قيمة البيانات الوصفية `"approved"`، ويجب ألا يظهر معرّف الاقتراح وتجزئة التعليمات الملتقطان كمعلّقين، ويجب أن يُظهر المتحكم الذي تم فحصه `threshold` بقيمة `3` و`total_weight` بقيمة `4` وأوزان الأعضاء 1 و1 و2؛ ويُدرَج الأعضاء بترتيب المفاتيح العامة.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- `not qualified to propose multisig` أو `not qualified to approve multisig` يعني أن العميل المقترح أو الموافق لا يتطابق مع أي من معرفات I105 المسجلة في السياسة.
- يمكن رفض الموافقة النهائية عندما يفتقر حساب التوقيع المتعدد إلى إذن لتنفيذ التعليمات المقترحة. امنح سلطة التفويض للحساب متعدد التوقيع، وليس لموقعيه التشفيريين الفرديين فقط، ثم دع أحد الموقعين التشفيريين المتبقين يحاول مرة أخرى.
- قد يعني الاقتراح المعلق المفقود أن النصاب القانوني تم الوصول إليه بالفعل، أو أن TTL انتهت صلاحيته، أو تم استخدام معرّف اقتراح أو تجزئة تعليمات أو محدد حساب خاطئ. استعلم عن الحالة اللاحقة قبل تقديم الاقتراح مرة أخرى بقيمة nonce جديدة.
- الموافقات المكررة لا تضيف وزنًا. كل موقع مسجل يساهم بوزنه المكون مرة واحدة فقط في أقصى حد.
- توقيع معاملة عادية مباشرةً بوصفك المسؤول محظور. استخدم دائمًا `MultisigPropose` و `MultisigApprove`.
- إذا لم تتمكن الأوامر اللاحقة من العثور على الحساب المطبوع أثناء تسجيل CLI، فقد قمت بالتقاط البذرة المؤقتة. استخرج الحساب الواحد وفق معيار البروتوكول من السياسة المرتبة وسجل باستخدام تلك القيمة كما هو موضح أعلاه.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [اختبارات تكامل التوقيع المتعدد عند نسخة التعليمات البرمجية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [نموذج بيانات التوقيع المتعدد عند نسخة التعليمات البرمجية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [CLI تنفيذ التوقيع المتعدد في نسخة التعليمات البرمجية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [المعاملات](/ar/blockchain/transactions.md)
- [الأذونات والأدوار](./permissions-and-roles.md)
