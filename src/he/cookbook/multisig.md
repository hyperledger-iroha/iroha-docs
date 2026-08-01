---
translation_locale: he
translation_source: /cookbook/multisig.md
translation_source_hash: 7090228c4fea7321c93fe0d2c67ef6de842de95bc3befa11d83c12b9f15b4752
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# משקל Multisig {#weighted-multisig}

## התוצאה {#outcome}

רשום חשבון multisig משקל של שלושה בני אדם ב Taira, תציע הוראה למתנתונים, מאשר אותה עם משקל מספיק כדי לעמוד בקוורום, ותבדוק את ההשפעה מהמדינה של החשבון multisig.

## תנאים מוקדמים {#prerequisites}

- שלוש קנוניקות I105 חתימה IDs ב `SIGNER_A`, `SIGNER_B`, ו `SIGNER_C`.
- סיבובים Taira מיומנים עבור החותמים A ו-C. המציע וכל האישור משלם את העסקה שלהם.
- `taira.tx-metadata.json` נבנתה מתוך תגובת המזרקה הנוכחית, אף פעם לא מתוך נכס תשלום משותף ID.
- א Rust פרויקט הלקוח מחובר לאותו Iroha תיקון מקור כ Taira שלב ההסכמה וההצעת הצעה לאחר מכן משתמש CLI.
- תכונה multisig של המפעיל הנוכחי מופעלת. הרישום זמין לחשבונות רגילים בזמן הפתיחה הנדרש Iroha 3, אם כי עדיין תקף מדיניות ושימוש בתשלום Taira; השתמש ב-localnet אם ההפעלה הציבורית מכחישה זאת.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## צעדים {#steps}

### 1. רשום מדיניות משומכת {#_1-register-a-weighted-policy}

סימן C יש משקל 2; A ו-B יש משקל 1 כל אחד. קוורום של 3 לכן דורש C ועוד או A או B. נגזר את החשבון הקנוני על פי מדיניות מדויקת זו לפני ההרשום, ולאחר מכן העביר את אותו ערך ל `MultisigRegister::with_account`:

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

שמור את הערך המודפס עבור צעדי CLI:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

בפקודת ההסכם הנחמדת, פקודה הרישום CLI מדפסת את הזרע הזמני שלה לפני שהזמן של הפעולה יחזיר אותה. אל תחזרו להשתמש בזרע זה כמפקד. אין מפתח פרטי למפקד: סמכות multisig נובעת רק מההצעות המאושרות.

### 2. לבנות הוראה אחת מבלי להגיש אותה {#_2-build-one-instruction-without-submitting-it}

המתג הגלובלי `-o` מסדר את מערך ההוראות לתוצאת סטנדרטית. הוא לא שולח עסקאות ולכן אינו מבזבז עלות.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. תציעו כתיחת A {#_3-propose-as-signer-a}

המציע מספק באופן אוטומטי משקל משלו. לתפוס את האש ההוראות המדויקים הנדפסים על ידי CLI; אישורים מחברים לאש הזה.

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

רשום את ההצעה המתמשכת עדיין עם בוחר מוגבל מפורש:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. אישור כחתום C {#_4-approve-as-signer-c}

המשקל של A 1 ועוד המשקל של C 2 מגיע לקוורום 3 ומפעיל את ההוראה המוצעת כחשבון מרובות סיג.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

לקוח Rust יכול להמשיך עם אותו חשבון משורר מדיניות ושתי הוראות המחזור החיים המשמשות למעלה:

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

## לאמת {#verify}

תקראו את ההודעה לאחר מכן ותוודאו שההצעה כבר לא נמשכת:

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

הערך של המטאדאטה חייב להיות `"approved"`, האש ההוראה הקלטת אסור להופיע עוד כמשוממת, והמונהל המודפסת חייב להראות משקלות `1, 1, 2` עם קוורום `3`.

## פתרון בעיות {#troubleshooting}

- `signatory is not part of multisig` פירושו שהלקוח המציע או המאשר אינו מתאים לאחד מ- I105 IDs המפורסם בפוליס.
- אישור סופי ניתן לסרב כאשר החשבון multisig חסר רשות לבצע את ההוראות המוצעות. להעניק סמכות לחשבון multisig, ולא רק לחתימיו הפרטיים, ואז לתת לחתום שנותר לנסות שוב.
- הצעת חקירה שנעדרת עשויה להביע כי כבר הגיעו לקורום, TTL נגמר, או השתמשו בחירת ההוראות הלא נכונה של האש/החשבונות. שאל את הפוסט-מדינה לפני שאתה מבקש שוב.
- אישורים כפולים לא מוסיפים משקל. כל חתום רשום מספק את המשקל המוגדר שלו לפחות פעם אחת.
- חתימה ישירה של עסקאות נורמליות כמעבד אסורה. תמיד להשתמש `MultisigPropose` ו `MultisigApprove`.
- אם פקודות מאוחר יותר לא מצאו את החשבון המודפס במהלך הרישום של CLI, אתה תפס את הזרע הזמני. להוציא את החשבון הקנוני מהפוליטיקה המוזמנת ולהרשם עם ערך זה כפי שמראה למעלה.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [בדיקות אינטגרציה מולטי-סיג'ים בקביט הנתקע ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/multisig.rs)
- [מודל נתונים Multisig ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI יישום מרוב סיג'ים בביצוע מחויבות קשורת ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [עסקים](/he/blockchain/transactions.md)
- [רשיונות ותפקידים ](./permissions-and-roles.md)
