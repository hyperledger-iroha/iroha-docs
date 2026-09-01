---
translation_locale: am
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ክብደት ያለው Multisig {#weighted-multisig}

## ውጤት {#outcome}

በ Taira ላይ ባለ ሶስት አባላት ክብደት ያለው ባለብዙ ሲግ መለያ ያስመዝግቡ፣ የሜታዳታ መመሪያን ያቅርቡ፣ ምልአተ ጉባኤውን ለማሟላት በቂ ክብደት ያጽድቁት እና ከመልቲሲግ መለያ ሁኔታ አፈፃፀሙን ያረጋግጡ።

## ቅድመ ሁኔታዎች {#prerequisites}

- በ `SIGNER_A`፣ `SIGNER_B` እና `SIGNER_C` ውስጥ ሶስት ነጠላ ፕሮቶኮል-ስታንዳርድ I105 ፈራሚ መታወቂያዎች።
- በገንዘብ የተደገፈ Taira ውቅሮች ለምስጠራ ፈራሚዎች A እና C። ፕሮፖዛል እና እያንዳንዱ አጽዳጊ ለራሳቸው ግብይት ይከፍላሉ።
- `taira.tx-metadata.json` አሁን ካለው የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ምላሽ የተገነባ፣ ከተገለበጠ የክፍያ ንብረት መታወቂያ በጭራሽ።
- A Rust የደንበኛ ፕሮጀክት በተመሳሳይ ላይ ተጣብቋል Iroha ምንጭ ክለሳ እንደ Taira ለመመዝገቢያ ደረጃ. የኋለኛው ፕሮፖዛል እና የማጽደቅ ደረጃዎች CLI.
- የአሁኑ አስፈፃሚ ባለብዙ ሲግ ባህሪ ነቅቷል። ምዝገባው በነባሪው Iroha 3 የሶፍትዌር ማስፈጸሚያ አካባቢ ውስጥ ለተራ መለያዎች ይገኛል፣ ምንም እንኳን Taira ፖሊሲ እና ክፍያ መግቢያ አሁንም ተፈጻሚ ይሆናል። የህዝብ ማሰማራቱ ከከለከለ localnetን ይጠቀሙ።

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## እርምጃዎች {#steps}

### 1. ክብደት ያለው ፖሊሲ ይመዝገቡ {#_1-register-a-weighted-policy}

ክሪፕቶግራፊክ ፈራሚ C ክብደት አለው 2; A እና B እያንዳንዳቸው ክብደት 1 አላቸው. ስለዚህ የ 3 ምልአተ ጉባኤ C ሲደመር A ወይም B ያስፈልገዋል. ከመመዝገቡ በፊት ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ መለያ ከዚያ ትክክለኛ ፖሊሲ ያውጡ እና ከዚያ ተመሳሳይ እሴት ወደ `MultisigRegister::with_account` ያስተላልፉ -

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

የታተመውን ዋጋ ለ CLI ደረጃዎች ያስቀምጡ

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

በተሰካው የምንጭ ኮድ ክለሳ፣ የ CLI የምዝገባ ትዕዛዙ የሶፍትዌር ማስፈጸሚያ አካባቢ እንደገና ከመክፈቱ በፊት ጊዜያዊ ዘሩን ያትማል። ያንን ዘር እንደ ተቆጣጣሪው እንደገና አይጠቀሙበት። የመቆጣጠሪያ የግል ቁልፍ የለም የባለብዙ ሲግ የፈቃድ ባለቤት የሚመጣው ከጸደቁ ሀሳቦች ብቻ ነው።

### 2. አንድ መመሪያ ሳያስገቡ ይገንቡ {#_2-build-one-instruction-without-submitting-it}

ዓለም አቀፋዊ `-o` ማብሪያ / ማጥፊያ የመመሪያ ድርድርን ወደ መደበኛ ውፅዓት ተከታታይ ያደርገዋል። ግብይት አያቀርብም እና ስለዚህ ምንም ክፍያ አያወጣም።

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. እንደ ምስጠራ ፈራሚ ሀ ያቅርቡ {#_3-propose-as-signer-a}

ፕሮፖዛሉ በራስ-ሰር የራሱን ክብደት ያበረክታል። በ CLI የታተመውን ትክክለኛውን መመሪያ ምስጠራ ሃሽ ይያዙ; ማጽደቆች ከዚያ ምስጠራ ሃሽ ጋር ይጣመራሉ።

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

አሁንም በመጠባበቅ ላይ ያለውን ፕሮፖዛል በግልጽ ውሱን መራጭ ይዘርዝሩ -

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. እንደ ምስጠራ ፈራሚ C ያጽድቁ {#_4-approve-as-signer-c}

የ A ክብደት 1 ሲደመር C ክብደት 2 ምልአተ ጉባኤ 3 ላይ ደርሷል እና የታቀደውን መመሪያ እንደ መልቲሲግ መለያ ያስፈጽማል።

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

የ Rust ደንበኛ በተመሳሳይ ፖሊሲ የተገኘ መለያ እና ከላይ በተጠቀሱት ሁለት የህይወት ኡደት መመሪያዎች መቀጠል ይችላል።

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

## አረጋግጥ {#verify}

የድህረ-ግዛቱን ያንብቡ እና ፕሮፖዛሉ በመጠባበቅ ላይ እንዳልሆነ ያረጋግጡ -

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

የሜታዳታ እሴቱ `"approved"` መሆን አለበት፣ የተያዘው መመሪያ ምስጠራ ሃሽ ከአሁን በኋላ በመጠባበቅ ላይ ሆኖ መታየት የለበትም፣ እና የተፈተሸው ተቆጣጣሪ ክብደቶችን `1, 1, 2` ከሸአተ ጉባኤ `3` ጋር ማሳየት አለበት።

## መላ ፍለጋ {#troubleshooting}

- `signatory is not part of multisig` ማለት ሀሳብ ያቀረበው ወይም የሚያፀድቀው ደንበኛ በፖሊሲው ውስጥ ከተመዘገቡት I105 መታወቂያዎች ጋር አይዛመድም ማለት ነው።.
- የብዝሃ መለያው የታቀዱትን መመሪያዎች ለማስፈጸም ፍቃድ ከሌለው የመጨረሻው ማጽደቅ ውድቅ ሊደረግ ይችላል። ለግለሰብ ምስጠራ ፈራሚዎች ብቻ ሳይሆን ለመልቲሲግ መለያ የፈቃድ ባለቤትን ይስጡ እና ከዚያ የቀረው ምስጠራ ፈራሚ እንደገና እንዲሞክር ያድርጉ።
- የጎደለ በመጠባበቅ ላይ ያለ ፕሮፖዛል ምልአተ ጉባኤው አስቀድሞ ደርሷል፣ TTL ጊዜው አልፎበታል ወይም የተሳሳተ መመሪያ ሃሽ/መለያ መራጭ ጥቅም ላይ ውሏል ማለት ነው። እንደገና ከማቅረቡ በፊት የድህረ-ግዛቱን ይጠይቁ።
- የተባዙ ማጽደቆች ክብደት አይጨምሩም። እያንዳንዱ የተመዘገበ ፈራሚ የተዋቀረውን ክብደት ቢበዛ አንድ ጊዜ ያበረክታል።
- መቆጣጠሪያው የተከለከለ ስለሆነ መደበኛ ግብይት በቀጥታ መፈረም። ሁልጊዜ `MultisigPropose` እና `MultisigApprove` ይጠቀሙ።
- በኋላ ላይ ትዕዛዞች በ CLI ምዝገባ ወቅት የታተመውን መለያ ማግኘት ካልቻሉ ጊዜያዊ ዘሩን ያዙት። ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ መለያ ከታዘዘው ፖሊሲ ያውጡ እና ከላይ እንደሚታየው በዚያ ዋጋ ይመዝገቡ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የመልቲሲግ ውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Multisig የውሂብ ሞዴል በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI በተሰካው የምንጭ-ኮድ ክለሳ ላይ ባለብዙ SIG ትግበራ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [ግብይቶች](/am/blockchain/transactions.md)
- [ፈቃዶች እና ሚናዎች](./permissions-and-roles.md)
