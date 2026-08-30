---
translation_locale: am
translation_source: /cookbook/multisig.md
translation_source_hash: 9654923faf6c84dfd21a428ebe3c53dbd074b8e3274c12c8aa41bf31884686f7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ክብደት ያለው Multisig {#weighted-multisig}

## ውጤቱ {#outcome}

በ Taira ላይ የሦስት አባላት ክብደት ያለው ባለብዙ-ሲግ መለያ ይመዝገቡ ፣ ሜታዳታ መመሪያ ያቅርቡ ፣ ለቁጥር ብዛት ለመሟላት በቂ ክብደትን ያጸድቁ እና ከ multisig መለያው ሁኔታ አፈፃፀምን ያረጋግጡ።

## ቅድመ ሁኔታዎች {#prerequisites}

- በ `SIGNER_A` ፣ `SIGNER_B` እና `SIGNER_C` ውስጥ ሶስት የካኖኒክ I105 ፊርማዎች IDs ።
- ለፊርማ ሰጪዎች A እና C የገንዘብ ድጋፍ የተደረገላቸው Taira ቅንብሮች. አቅራቢው እና እያንዳንዱ አጽድቃዊ ለግል ግብይቱ ይከፍላሉ.
- `taira.tx-metadata.json` የተገነባው ከአሁኑ የቧንቧ ምላሽ ፣ በጭራሽ ከኮፒ የተደረገ ክፍያ ንብረት ID አይደለም።
- ሀ Rust የደንበኛ ፕሮጀክት ተመሳሳይ ላይ ተጣብቋል Iroha እንደ ምንጭ ማሻሻያ Taira ለደንበኝነት ምዝገባ ደረጃ የኋለኛው ፕሮፖዛል እና ማጽደቅ ደረጃዎች CLI.
- የአሁኑ አስፈፃሚ ባለብዙ ፊርማ ባህሪ ተቀባይነት አግኝቷል ። ምዝገባ መደበኛ ሂሳቦች በነባሪው Iroha 3 አሂድ ጊዜ ውስጥ ይገኛል ፣ ምንም እንኳን Taira ፖሊሲ እና የክፍያ መግቢያ አሁንም ይተገበራሉ ፤ የህዝብ ትግበራ ከከለከለው አካባቢያዊ ኔት ይጠቀሙ።

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## እርምጃዎች {#steps}

### 1. ክብደት ያለው ፖሊሲ መመዝገብ {#_1-register-a-weighted-policy}

ፊርማ C ክብደት 2 አለው; A እና B እያንዳንዳቸው ክብደት 1 አላቸው. ስለዚህ የ 3 ጥራዝ C ን ይጨምራል ወይም A ወይም B. ከመመዝገብዎ በፊት ትክክለኛውን ፖሊሲ ከካኖኒካል ሂሳብ ማውጣት, ከዚያም ተመሳሳይ ዋጋ ወደ `MultisigRegister::with_account` ማስተላለፍ:

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

ለ CLI ደረጃዎች የታተመውን ዋጋ ያስቀምጡ:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

በተጣራው ኮሚቴ ላይ የ CLI የምዝገባ ትዕዛዝ ጊዜያዊ ዘሩን ከመጫኑ በፊት ያትማል. ያንን ዘርን እንደ ተቆጣጣሪ ዳግም አይጠቀሙበት። የተቆጣጣሪ የግል ቁልፍ የለም: multisig ባለስልጣን ከፀደቁ ጥቆማዎች ብቻ ነው የሚመጣው።

### 2. አንድን መመሪያ ሳትሰጡ መገንባት {#_2-build-one-instruction-without-submitting-it}

ዓለም አቀፋዊው `-o` ማቀነባበሪያ የመመሪያ ቅጥያውን ወደ መደበኛ ውፅዓት ያደርሳል ። ግብይት አያቀርብም እናም ስለሆነም ምንም ክፍያ አይወጣም።

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. እንደ ፊርማ A ያቅርቡ {#_3-propose-as-signer-a}

አቅራቢው በራስ-ሰር የራሱን ክብደት ይጨምራል. በ CLI የታተመውን ትክክለኛ መመሪያ ሃሽ ያግኙ; ማጽደቂያዎች በዚያ ሀሽ ጋር ይጣመራሉ.

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

አሁንም በሂደት ላይ ያለውን ሀሳብ በግልጽ የተወሰነ ምርጫ ጋር ዘርዝሩ:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. እንደ ፊርማ C ተቀባይነት ያግኙ። {#_4-approve-as-signer-c}

የ A ክብደት 1 እና C ክብደት 2 quorum 3 ይደርሳል እና multisig ሂሳብ እንደ የቀረበውን መመሪያ ይፈጽማል.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust ደንበኛው ከላይ ከተጠቀሱት ሁለት የሕይወት ዑደት መመሪያዎች ጋር ተመሳሳይ የፖሊሲ-መነጭ ሂሳብን መቀጠል ይችላል:

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

## ያረጋግጡ {#verify}

የፖስታ መግለጫውን አንብቡ እና ሀሳቡ ከእንግዲህ እየተካሄደ እንዳልሆነ ያረጋግጡ:

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

የሜታዳታ እሴት መሆን አለበት `"approved"`, የተያዘው መመሪያ ሃሽ ከአሁን በኋላ እንደተጠበቀ ሆኖ መታየት የለበትም ፣ እና የተመረመረው ተቆጣጣሪ ክብደቶችን ማሳየት አለበት። `1, 1, 2` በቅደም ተከተል `3`.

## ችግሮችን መፍታት {#troubleshooting}

- `signatory is not part of multisig` የሚጠቁመው ወይም የሚያፀድቀው ደንበኛ በፖሊሲው ውስጥ ከተመዘገቡት I105 IDs አንዱ ጋር አይዛመድም.
- አንድ ባለብዙ ፊርማ መለያ የቀረቡትን መመሪያዎች ለማከናወን ፍቃድ በሌለበት ጊዜ የመጨረሻው ማጽደቅ ውድቅ ሊደረግ ይችላል። ለባለብዙ ፊርሙ መለያ ብቻ ሳይሆን ለተቀሩት ፊርማ ፈላጊዎች ስልጣን ይስጡ.
- አንድ የጎደለው የተጠበቀ ሀሳብ ቀድሞውኑ አቻነት ደርሷል ማለት ሊሆን ይችላል, TTL ጊዜው አልፏል, ወይም የተሳሳተ መመሪያ ሃሽ / መለያ ምርጫ ተጠቅሟል.
- ዕጥፍ ማረጋገጫዎች ክብደት አይጨምሩም። እያንዳንዱ የተመዘገበ ፊርማ ሰጪ በዋነኝነት አንድ ጊዜ የተቀየረውን ክብደቱን ያቀርባል.
- እንደተቆጣጣሪው መደበኛ ግብይትን በቀጥታ መፈረም የተከለከለ ነው። ሁልጊዜ `MultisigPropose` እና `MultisigApprove` ይጠቀሙ።
- የኋለኛው ትዕዛዞች CLI ምዝገባ ወቅት የታተመውን መለያ ማግኘት ካልቻሉ ጊዜያዊ ዘርን ተይዘዋል ። ካኖኒካዊ ሂሳቡን ከታዘዘው ፖሊሲ ማውጣት እና ከላይ እንደተመለከተው በዚያ ዋጋ መመዝገብ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በፒን የተቀመጠ ኮሚቴ ላይ Multisig ውህደት ሙከራዎች ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [በፒን የተደረገባቸው ውሂብ ሞዴል ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI በተሰቀለ ኮሚቴ ላይ ባለብዙ ምልክት ትግበራ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [ግብይቶች](/am/blockchain/transactions.md)
- [ፍቃዶች እና ሚናዎች](./permissions-and-roles.md)
