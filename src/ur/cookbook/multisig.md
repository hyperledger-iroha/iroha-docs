---
translation_locale: ur
translation_source: /cookbook/multisig.md
translation_source_hash: 7090228c4fea7321c93fe0d2c67ef6de842de95bc3befa11d83c12b9f15b4752
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# وزن میں ملٹی سیگ {#weighted-multisig}

## نتیجہ {#outcome}

Taira پر تین رکنی متوازن multisig اکاؤنٹ رجسٹر کریں، ایک میٹا ڈیٹا ہدایات تجویز کریں، کووروم پورا کرنے کے لئے کافی وزن سے اس کی منظوری دیں اور multisig اکاؤنٹ کی حالت سے عملدرآمد کی تصدیق کریں۔

## لازمی شرائط {#prerequisites}

- تین کینونیکل I105 دستخط کنندہ IDs میں `SIGNER_A`, `SIGNER_B`, اور `SIGNER_C`.
- دستخط کرنے والوں A اور C کے لئے مالی اعانت یافتہ Taira تشکیلات۔ تجویز دہندہ اور ہر منظوری دینے والے اپنے ہی لین دین کی ادائیگی کرتے ہیں۔
- `taira.tx-metadata.json` موجودہ نل جواب سے بنایا گیا، کبھی بھی ایک کاپی شدہ فیس اثاثہ ID سے نہیں.
- ایک Rust کلائنٹ کے منصوبے کو اسی پر منسلک Iroha ماخذ کی نظر ثانی Taira رجسٹریشن کے مرحلے کے لئے. بعد میں تجویز اور منظوری کے مراحل CLI.
- موجودہ عملدرآمد کنندہ کی ملٹی سگ فیچر فعال ہے۔ رجسٹریشن ڈیفالٹ Iroha 3 رن ٹائم میں عام اکاؤنٹس کے لئے دستیاب ہے ، حالانکہ Taira پالیسی اور فیس داخل کرنا اب بھی قابل اطلاق ہے۔ لوکل نیٹ کا استعمال کریں اگر عوامی تعیناتی اس سے انکار کرتی ہے۔

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## قدم {#steps}

### 1۔ ایک وزن شدہ پالیسی درج کریں {#_1-register-a-weighted-policy}

سگنل سی کا وزن 2 ہے؛ A اور B کا وزن 1 ہے۔ لہذا 3 کے ایک کووروم کے لئے C یا A یا B کی ضرورت ہوتی ہے۔ رجسٹریشن سے پہلے اس عین مطابق پالیسی سے کینونیکل اکاؤنٹ اخذ کریں ، پھر اسی قدر کو `MultisigRegister::with_account` پر منتقل کریں:

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

CLI اقدامات کے لئے پرنٹ کردہ قدر کو محفوظ کریں:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

منسلک کمیٹ پر ، CLI رجسٹریشن کمانڈ اس کے عارضی بیج کو رن ٹائم دوبارہ ترتیب دینے سے پہلے پرنٹ کرتا ہے۔ اس بیج کو کنٹرولر کے طور پر دوبارہ استعمال نہ کریں۔ کوئی کنٹرولر پرائیویٹ کلید نہیں ہے: ملٹی سگ اتھارٹی صرف منظور شدہ تجاویز سے آتی ہے۔

### 2۔ بغیر کسی ہدایات کو پیش کیے ایک ہدایات بنائیں {#_2-build-one-instruction-without-submitting-it}

گلوبل `-o` سوئچ ایک ہدایات کے صف کو معیاری آؤٹ پٹ میں ترتیب دیتا ہے۔ یہ کوئی ٹرانزیکشن پیش نہیں کرتا ہے اور اس وجہ سے کوئی فیس خرچ نہیں کرتا ہے۔

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3۔ دستخط کنندہ کے طور پر تجویز کریں A {#_3-propose-as-signer-a}

تجویز دہندہ خود بخود اپنا وزن فراہم کرتا ہے۔ CLI کے ذریعہ طباعت کردہ عین ہدایات ہیش کو پکڑو؛ منظوری اس ہیش سے منسلک ہوتی ہے۔

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
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust کلائنٹ ایک ہی پالیسی سے ماخوذ اکاؤنٹ اور اوپر استعمال کردہ دو زندگی سائیکل ہدایات کے ساتھ جاری رہ سکتا ہے:

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

## تصدیق کریں {#verify}

پوسٹ اسٹیٹ کو پڑھیں اور تصدیق کریں کہ تجویز اب زیر التواء نہیں ہے:

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

میٹا ڈیٹا ویلیو `"approved"` ہونا ضروری ہے، قبضہ کردہ ہدایات ہیش اب زیر التواء نہیں دکھایا جانا چاہئے، اور معائنہ شدہ کنٹرولر کو وزن `1, 1, 2` کووروم کے ساتھ ظاہر کرنا چاہئے `3`.

## خرابی کا سراغ لگانا {#troubleshooting}

- `signatory is not part of multisig` کا مطلب ہے کہ تجویز کرنے والا یا منظور کرنے والا مؤکل پالیسی میں رجسٹرڈ I105 IDs میں سے کسی ایک کے مطابق نہیں ہے۔
- حتمی منظوری کو مسترد کیا جاسکتا ہے جب ملٹی سائن اکاؤنٹ میں مجوزہ ہدایات پر عمل کرنے کی اجازت نہیں ہے۔ ملٹی سائن اکاؤنٹس کو اختیار دیں ، نہ صرف اس کے انفرادی دستخط کرنے والوں کو ، پھر باقی دستخط کرنے والے کو دوبارہ کوشش کریں۔
- ایک لاپتہ زیر التواء تجویز کا مطلب یہ ہوسکتا ہے کہ پہلے ہی کووروم تک پہنچ گیا تھا، TTL ختم ہوچکا ہے، یا غلط ہدایات ہاش / اکاؤنٹ سلیکٹر استعمال کیا گیا تھا. دوبارہ تجویز کرنے سے پہلے پوسٹ اسٹیٹ سے پوچھیں۔
- ڈپلیکیٹ منظوریوں میں کوئی وزن شامل نہیں ہوتا۔ ہر رجسٹرڈ دستخط کنندہ زیادہ سے زیادہ ایک بار اپنا ترتیب شدہ وزن فراہم کرتا ہے۔
- عام ٹرانزیکشن پر براہ راست دستخط کرنا جب کہ کنٹرولر کے طور پر ممنوع ہے۔ ہمیشہ `MultisigPropose` اور `MultisigApprove` کا استعمال کریں۔
- اگر بعد میں کمانڈ CLI رجسٹریشن کے دوران چھپی ہوئی اکاؤنٹ نہیں ڈھونڈ سکتے ہیں تو ، آپ نے عارضی بیج کو قبضہ کر لیا ہے۔ حکم کردہ پالیسی سے کینونیکل اکاؤنٹ اخذ کریں اور مذکورہ بالا قدر کے ساتھ رجسٹر کریں۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [پنڈ commit پر multisig انٹیگریشن ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/multisig.rs)
- [پنڈ commit پر multisig ڈیٹا ماڈل](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI پنڈ commit پر multisig لاگو کرنا](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [لین دین](/ur/blockchain/transactions.md)
- [اجازت اور کردار](./permissions-and-roles.md)
