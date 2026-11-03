---
translation_locale: ur
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# وزن میں ملٹی سیگ {#weighted-multisig}

## نتیجہ {#outcome}

Taira پر تین رکنی متوازن multisig اکاؤنٹ رجسٹر کریں، ایک میٹا ڈیٹا ہدایات تجویز کریں، کووروم پورا کرنے کے لئے کافی وزن سے اس کی منظوری دیں اور multisig اکاؤنٹ کی حالت سے عملدرآمد کی تصدیق کریں۔

## لازمی شرائط {#prerequisites}

- تین کینونیکل I105 دستخط کنندہ IDs میں `SIGNER_A`, `SIGNER_B`, اور `SIGNER_C`.
- دستخط کرنے والوں A اور C کے لئے مالی اعانت یافتہ Taira تشکیلات۔ تجویز دہندہ اور ہر منظوری دینے والے اپنے ہی لین دین کی ادائیگی کرتے ہیں۔
- CLI کی تحریری کارروائیاں `--fee-payer authority` استعمال کرتی ہیں؛ CLI دستخط سے پہلے Taira کے فیس اثاثے میں عین فیس کی کوٹیشن دیتا ہے۔
- رجسٹریشن کے مرحلے کے لیے ایک Rust کلائنٹ پروجیکٹ جو `iroha` اور `iroha_model_base` پر منحصر ہو اور Taira والی Iroha ماخذ نظرِ ثانی پر ہی مقرر ہو۔ بعد کے تجویز اور منظوری کے مراحل CLI استعمال کرتے ہیں۔
- موجودہ عملدرآمد کنندہ کی ملٹی سگ فیچر فعال ہے۔ رجسٹریشن ڈیفالٹ Iroha 3 رن ٹائم میں عام اکاؤنٹس کے لئے دستیاب ہے ، حالانکہ Taira پالیسی اور فیس داخل کرنا اب بھی قابل اطلاق ہے۔ لوکل نیٹ کا استعمال کریں اگر عوامی تعیناتی اس سے انکار کرتی ہے۔

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## قدم {#steps}

### 1۔ ایک وزن شدہ پالیسی درج کریں {#_1-register-a-weighted-policy}

دستخط کنندہ C کا وزن 2 ہے؛ A اور B میں سے ہر ایک کا وزن 1 ہے۔ اس لیے 3 کے کووروم کے لیے C کے ساتھ A یا B میں سے کسی ایک کی ضرورت ہوتی ہے۔ یہاں `registrar` ایک `iroha::blocking::Client` ہے، جس کا `submit` Applied حتمیت کا انتظار کرتا ہے۔ رجسٹریشن سے پہلے اسی عین پالیسی سے کینونیکل اکاؤنٹ اخذ کریں، پھر وہی قدر `MultisigRegister::with_account` کو دیں:

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

CLI اقدامات کے لئے پرنٹ کردہ قدر کو محفوظ کریں:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

منسلک کمیٹ پر، CLI رجسٹریشن کمانڈ اس کے عارضی بیج کو رن ٹائم دوبارہ ترتیب دینے سے پہلے پرنٹ کرتا ہے۔ اس بیج کو کنٹرولر کے طور پر دوبارہ استعمال نہ کریں۔ کوئی کنٹرولر پرائیویٹ کلید نہیں ہے: ملٹی سگ اتھارٹی صرف منظور شدہ تجاویز سے آتی ہے۔ اس کے بجائے CLI سے رجسٹر کرنے کے لیے، پالیسی سے اخذ کردہ قدر `ledger multisig register --account` کو دیں۔

### 2۔ بغیر کسی ہدایات کو پیش کیے ایک ہدایات بنائیں {#_2-build-one-instruction-without-submitting-it}

گلوبل `--emit-instructions` سوئچ ہدایات کی صف کو جمع کرانے کے بجائے معیاری آؤٹ پٹ پر پرنٹ کرتا ہے، اس لیے یہ کوئی فیس خرچ نہیں کرتا۔

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3۔ دستخط کنندہ کے طور پر تجویز کریں A {#_3-propose-as-signer-a}

تجویز دہندہ خود بخود اپنا وزن فراہم کرتا ہے۔ ایک نیا تجویز nonce بنائیں اور کسی بھی دوبارہ کوشش کے لیے اسے محفوظ رکھیں۔ CLI کے ذریعہ پرنٹ کردہ تجویز ID اور ہدایات ہیش کو محفوظ کریں؛ منظوریاں دونوں سے منسلک ہوتی ہیں۔

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

ایک واضح اختتامی انتخاب کے ساتھ ابھی تک زیر التواء تجویز درج کریں:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4۔ دستخط کنندہ کے طور پر منظور کریں C {#_4-approve-as-signer-c}

A کا وزن 1 پلس C کا وزن 2 کووروم 3 تک پہنچتا ہے اور تجویز کردہ ہدایات کو ملٹی سگ اکاؤنٹ کے طور پر انجام دیتا ہے۔

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust کلائنٹ ایک ہی پالیسی سے ماخوذ اکاؤنٹ اور اوپر استعمال کردہ دو زندگی سائیکل ہدایات کے ساتھ جاری رہ سکتا ہے۔ ہر دستخط کنندہ کلائنٹ ایک `iroha::blocking::Client` ہے؛ تجویز ID کلائنٹ کے نیٹ ورک، ملٹی سگ اکاؤنٹ اور ایک نئے nonce سے اخذ کیا جاتا ہے:

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

## تصدیق کریں {#verify}

پوسٹ اسٹیٹ کو پڑھیں اور تصدیق کریں کہ تجویز اب زیر التواء نہیں ہے:

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

میٹا ڈیٹا ویلیو `"approved"` ہونا ضروری ہے، محفوظ کردہ تجویز ID اور ہدایات ہیش اب زیر التواء نظر نہیں آنے چاہئیں، اور معائنہ شدہ کنٹرولر کو `threshold` `3`، `total_weight` `4` اور اراکین کے وزن 1، 1 اور 2 دکھانے چاہئیں؛ اراکین عوامی کلید کی ترتیب میں درج ہوتے ہیں۔

## خرابی کا سراغ لگانا {#troubleshooting}

- `not qualified to propose multisig` یا `not qualified to approve multisig` کا مطلب ہے کہ تجویز کرنے والا یا منظور کرنے والا کلائنٹ پالیسی میں رجسٹرڈ I105 IDs میں سے کسی ایک کے مطابق نہیں ہے۔
- حتمی منظوری کو مسترد کیا جاسکتا ہے جب ملٹی سائن اکاؤنٹ میں مجوزہ ہدایات پر عمل کرنے کی اجازت نہیں ہے۔ ملٹی سائن اکاؤنٹس کو اختیار دیں ، نہ صرف اس کے انفرادی دستخط کرنے والوں کو ، پھر باقی دستخط کرنے والے کو دوبارہ کوشش کریں۔
- ایک لاپتہ زیر التواء تجویز کا مطلب یہ ہوسکتا ہے کہ کووروم پہلے ہی پورا ہو چکا تھا، TTL ختم ہوچکا ہے، یا غلط تجویز ID، ہدایات ہیش یا اکاؤنٹ سلیکٹر استعمال کیا گیا تھا۔ نئے nonce کے ساتھ دوبارہ تجویز کرنے سے پہلے پوسٹ اسٹیٹ کا استفسار کریں۔
- ڈپلیکیٹ منظوریوں میں کوئی وزن شامل نہیں ہوتا۔ ہر رجسٹرڈ دستخط کنندہ زیادہ سے زیادہ ایک بار اپنا ترتیب شدہ وزن فراہم کرتا ہے۔
- عام ٹرانزیکشن پر براہ راست دستخط کرنا جب کہ کنٹرولر کے طور پر ممنوع ہے۔ ہمیشہ `MultisigPropose` اور `MultisigApprove` کا استعمال کریں۔
- اگر بعد میں کمانڈ CLI رجسٹریشن کے دوران چھپی ہوئی اکاؤنٹ نہیں ڈھونڈ سکتے ہیں تو ، آپ نے عارضی بیج کو قبضہ کر لیا ہے۔ حکم کردہ پالیسی سے کینونیکل اکاؤنٹ اخذ کریں اور مذکورہ بالا قدر کے ساتھ رجسٹر کریں۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [پنڈ commit پر multisig انٹیگریشن ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [پنڈ commit پر multisig ڈیٹا ماڈل](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [CLI پنڈ commit پر multisig لاگو کرنا](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [لین دین](/ur/blockchain/transactions.md)
- [اجازت اور کردار](./permissions-and-roles.md)
