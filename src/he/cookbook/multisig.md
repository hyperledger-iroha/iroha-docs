---
translation_locale: he
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# ריבוי חתימות משוקלל {#weighted-multisig}

## תוצאה {#outcome}

רשמו ב־Taira חשבון ריבוי חתימות משוקלל בן שלושה חברים, הציעו הוראת מטא־נתונים, אשרו אותה במשקל המספיק להשגת המניין הדרוש, ואמתו את הביצוע מתוך מצב חשבון ריבוי החתימות.

## תנאים מוקדמים {#prerequisites}

- שלושה מזהי חותמים קנוניים מסוג I105 ב־`SIGNER_A`, ב־`SIGNER_B` וב־`SIGNER_C`.
- תצורות Taira עם חשבונות ממומנים עבור החותמים A ו־C. המציע וכל מאשר משלמים עבור העסקה שלהם.
- פעולות כתיבה דרך ה־CLI משתמשות ב־`--fee-payer authority`; ה־CLI מקבל הצעת עמלה מדויקת, בנכס העמלה של Taira, לפני החתימה.
- פרויקט לקוח ב־Rust שתלוי ב־`iroha` וב־`iroha_model_base`, ומקובע לאותה גרסת קוד מקור של Iroha כמו Taira, עבור שלב הרישום. שלבי ההצעה והאישור שבהמשך משתמשים ב־CLI.
- תכונת ריבוי החתימות של המבצע הנוכחי מופעלת. בסביבת הריצה המוגדרת כברירת מחדל ב־Iroha 3, הרישום זמין לחשבונות רגילים, אך מדיניות Taira וקבלת העמלות עדיין חלות; השתמשו ברשת מקומית אם הפריסה הציבורית דוחה אותו.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## שלבים {#steps}

### 1. רשמו מדיניות משוקללת {#_1-register-a-weighted-policy}

לחותם C יש משקל 2; ל־A ול־B יש משקל 1 כל אחד. לכן קוורום של 3 דורש את C ועוד A או B. כאן `registrar` הוא `iroha::blocking::Client`, שה־`submit` שלו ממתין לסופיות Applied. גזרו את החשבון הקנוני מהמדיניות המדויקת הזאת לפני הרישום, ולאחר מכן העבירו את אותו ערך אל `MultisigRegister::with_account`:

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

שמרו את הערך המודפס לשלבי ה־CLI:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

ב־commit המקובע, פקודת הרישום של ה־CLI מדפיסה את הזרע הזמני שלה לפני שסביבת הריצה מחליפה את המפתח שלו. אל תשתמשו שוב בזרע הזה כבקר. אין מפתח פרטי לבקר: סמכות ה־multisig נובעת רק מהצעות שאושרו. כדי לבצע את הרישום דרך ה־CLI במקום זאת, העבירו את הערך שנגזר מהמדיניות אל `ledger multisig register --account`.

### 2. בנו הוראה אחת בלי לשלוח אותה {#_2-build-one-instruction-without-submitting-it}

המתג הגלובלי `--emit-instructions` מדפיס את מערך ההוראות לפלט הסטנדרטי במקום להגיש אותו, ולכן אינו מוציא שום עמלה.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. הגישו הצעה כחותם A {#_3-propose-as-signer-a}

המציע תורם אוטומטית את המשקל שלו. צרו nonce חדש להצעה ושמרו אותו לכל ניסיון חוזר. שמרו את מזהה ההצעה ואת גיבוב ההוראה שה־CLI מדפיס; האישורים נקשרים לשניהם.

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

הציגו את ההצעה שעדיין ממתינה באמצעות בורר מפורש וסופי:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. אשרו כחותם C {#_4-approve-as-signer-c}

משקלו של A, שהוא 1, יחד עם משקלו של C, שהוא 2, מגיעים למניין הדרוש של 3, וההוראה המוצעת מתבצעת בשם חשבון ריבוי החתימות.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

לקוח ה־Rust יכול להמשיך עם אותו חשבון שנגזר מהמדיניות ועם שתי הוראות מחזור החיים ששימשו לעיל. כל לקוח חותם הוא `iroha::blocking::Client`; מזהה ההצעה נגזר מהרשת של הלקוח, מחשבון ה־multisig ומ־nonce חדש:

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

## אימות {#verify}

קראו את המצב לאחר הפעולה וודאו שההצעה כבר אינה ממתינה:

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

ערך ה־metadata חייב להיות `"approved"`, אסור שמזהה ההצעה וגיבוב ההוראה שנשמרו יופיעו עוד כממתינים, והבקר שנבדק חייב להציג `threshold` `3`, `total_weight` `4` ומשקלות חברים 1, 1 ו־2; החברים מופיעים לפי סדר המפתחות הציבוריים.

## פתרון בעיות {#troubleshooting}

- `not qualified to propose multisig` או `not qualified to approve multisig` פירושו שהלקוח המציע או המאשר אינו תואם לאף אחד ממזהי ה־I105 הרשומים במדיניות.
- האישור האחרון עלול להידחות אם לחשבון ריבוי החתימות חסרה הרשאה לבצע את ההוראות המוצעות. העניקו סמכות לחשבון ריבוי החתימות, ולא רק לחותמים הנפרדים שלו, ואז אפשרו לחותם שטרם אישר לנסות שוב.
- הצעה ממתינה שחסרה עשויה להעיד שהמניין הדרוש כבר הושג, שה־TTL פג, או שנעשה שימוש במזהה הצעה, בגיבוב הוראה או בבורר חשבון שגויים. בדקו את המצב לאחר הפעולה לפני הגשת הצעה נוספת עם ערך חד־פעמי חדש.
- אישורים כפולים אינם מוסיפים משקל. כל חותם רשום תורם את המשקל שהוגדר לו לכל היותר פעם אחת.
- אסור לחתום ישירות על עסקה רגילה בשם הבקר. השתמשו תמיד ב־`MultisigPropose` וב־`MultisigApprove`.
- אם פקודות מאוחרות יותר אינן מוצאות את החשבון שהודפס במהלך רישום ב־CLI, שמרתם את הזרע הזמני. גזרו את החשבון הקנוני מהמדיניות המסודרת ורשמו אותו עם הערך הזה, כפי שמוצג לעיל.

## מקור ותיעוד קשור {#source-and-related-docs}

- [בדיקות אינטגרציה של ריבוי חתימות בקומיט המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [מודל הנתונים של ריבוי חתימות בקומיט המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [מימוש ריבוי חתימות ב־CLI בקומיט המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [עסקאות](/he/blockchain/transactions.md)
- [הרשאות ותפקידים](./permissions-and-roles.md)
