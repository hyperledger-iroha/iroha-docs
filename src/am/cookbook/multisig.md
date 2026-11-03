---
translation_locale: am
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# ክብደት ያለው Multisig {#weighted-multisig}

## ውጤት {#outcome}

በ Taira ላይ ባለ ሶስት አባላት ክብደት ያለው ባለብዙ ሲግ መለያ ያስመዝግቡ፣ የሜታዳታ መመሪያን ያቅርቡ፣ ምልአተ ጉባኤውን ለማሟላት በቂ ክብደት ያጽድቁት እና ከመልቲሲግ መለያ ሁኔታ አፈፃፀሙን ያረጋግጡ።

## ቅድመ ሁኔታዎች {#prerequisites}

- በ `SIGNER_A`፣ `SIGNER_B` እና `SIGNER_C` ውስጥ ሶስት ነጠላ ፕሮቶኮል-ስታንዳርድ I105 ፈራሚ መታወቂያዎች።
- በገንዘብ የተደገፈ Taira ውቅሮች ለምስጠራ ፈራሚዎች A እና C። ፕሮፖዛል እና እያንዳንዱ አጽዳጊ ለራሳቸው ግብይት ይከፍላሉ።
- የ CLI የመጻፍ ክዋኔዎች `--fee-payer authority` ይጠቀማሉ፤ CLI ከመፈረሙ በፊት ትክክለኛውን ክፍያ በ Taira የክፍያ ንብረት የሚገልጽ የክፍያ ዋጋ ግምት ያቀርባል።
- ለምዝገባ ደረጃው፣ በ`iroha` እና `iroha_model_base` ላይ ጥገኛ የሆነ እና ከ Taira ጋር በተመሳሳይ የ Iroha ምንጭ ክለሳ ላይ የተሰካ የ Rust ደንበኛ ፕሮጀክት። የኋለኞቹ የፕሮፖዛል እና የማጽደቅ ደረጃዎች CLI ይጠቀማሉ።
- የአሁኑ አስፈፃሚ ባለብዙ ሲግ ባህሪ ነቅቷል። ምዝገባው በነባሪው Iroha 3 የሶፍትዌር ማስፈጸሚያ አካባቢ ውስጥ ለተራ መለያዎች ይገኛል፣ ምንም እንኳን Taira ፖሊሲ እና ክፍያ መግቢያ አሁንም ተፈጻሚ ይሆናል። የህዝብ ማሰማራቱ ከከለከለ localnetን ይጠቀሙ።

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## እርምጃዎች {#steps}

### 1. ክብደት ያለው ፖሊሲ ይመዝገቡ {#_1-register-a-weighted-policy}

ክሪፕቶግራፊክ ፈራሚ C ክብደት 2 አለው፤ A እና B እያንዳንዳቸው ክብደት 1 አላቸው። ስለዚህ የ3 ምልአተ ጉባኤ C ሲደመር A ወይም B ያስፈልገዋል። እዚህ `registrar` `iroha::blocking::Client` ነው፤ የእሱ `submit` የተተገበረውን የመጨረሻነት ይጠብቃል። ከመመዝገቡ በፊት ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ መለያ ከዚያ ትክክለኛ ፖሊሲ ያውጡ፣ ከዚያም ተመሳሳይ እሴት ወደ `MultisigRegister::with_account` ያስተላልፉ፦

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

የታተመውን ዋጋ ለ CLI ደረጃዎች ያስቀምጡ

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

በተሰካው የምንጭ ኮድ ክለሳ፣ የ CLI የምዝገባ ትዕዛዙ የሶፍትዌር ማስፈጸሚያ አካባቢው ቁልፉን በአዲስ ቁልፍ ከመተካቱ በፊት ጊዜያዊ ዘሩን ያትማል። ያንን ዘር እንደ ተቆጣጣሪው እንደገና አይጠቀሙበት። የተቆጣጣሪ የግል ቁልፍ የለም፦ የባለብዙ ሲግ ስልጣን የሚመጣው ከጸደቁ ሀሳቦች ብቻ ነው። በምትኩ ከ CLI ለመመዝገብ፣ ከፖሊሲው የተገኘውን እሴት ለ`ledger multisig register --account` ያስተላልፉ።

### 2. አንድ መመሪያ ሳያስገቡ ይገንቡ {#_2-build-one-instruction-without-submitting-it}

ዓለም አቀፋዊው `--emit-instructions` አማራጭ የመመሪያ ድርድሩን ከማስገባት ይልቅ ወደ መደበኛ ውፅዓት ያትማል፣ ስለዚህ ምንም ክፍያ አያወጣም።

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. እንደ ምስጠራ ፈራሚ ሀ ያቅርቡ {#_3-propose-as-signer-a}

ፕሮፖዛል አቅራቢው በራስ-ሰር የራሱን ክብደት ያበረክታል። አዲስ የፕሮፖዛል nonce ይፍጠሩ እና ለማንኛውም ድጋሚ ሙከራ ያቆዩት። በ CLI የታተሙትን የፕሮፖዛል መታወቂያ እና የመመሪያ ምስጠራ ሃሽ ይያዙ፤ ማጽደቆች ከሁለቱም ጋር ይጣመራሉ።

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
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

የ Rust ደንበኛ በተመሳሳይ ፖሊሲ የተገኘ መለያ እና ከላይ በተጠቀሱት ሁለት የህይወት ኡደት መመሪያዎች መቀጠል ይችላል። እያንዳንዱ የፈራሚ ደንበኛ `iroha::blocking::Client` ነው፤ የፕሮፖዛል መታወቂያው ከደንበኛው አውታረ መረብ፣ ከመልቲሲግ መለያው እና ከአዲስ nonce የተገኘ ነው፦

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

## አረጋግጥ {#verify}

የድህረ-ግዛቱን ያንብቡ እና ፕሮፖዛሉ በመጠባበቅ ላይ እንዳልሆነ ያረጋግጡ -

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

የሜታዳታ እሴቱ `"approved"` መሆን አለበት፣ የተያዙት የፕሮፖዛል መታወቂያ እና የመመሪያ ምስጠራ ሃሽ ከአሁን በኋላ በመጠባበቅ ላይ ሆነው መታየት የለባቸውም፣ እና የተፈተሸው ተቆጣጣሪ `threshold` `3`፣ `total_weight` `4` እና የአባላት ክብደቶች 1፣ 1 እና 2 ማሳየት አለበት፤ አባላት በህዝብ ቁልፍ ቅደም ተከተል ተዘርዝረዋል።

## መላ ፍለጋ {#troubleshooting}

- `not qualified to propose multisig` ወይም `not qualified to approve multisig` ማለት ሀሳብ ያቀረበው ወይም የሚያፀድቀው ደንበኛ በፖሊሲው ውስጥ ከተመዘገቡት I105 መታወቂያዎች ከአንዱም ጋር አይዛመድም ማለት ነው።
- የብዝሃ መለያው የታቀዱትን መመሪያዎች ለማስፈጸም ፍቃድ ከሌለው የመጨረሻው ማጽደቅ ውድቅ ሊደረግ ይችላል። ለግለሰብ ምስጠራ ፈራሚዎች ብቻ ሳይሆን ለመልቲሲግ መለያ የፈቃድ ባለቤትን ይስጡ እና ከዚያ የቀረው ምስጠራ ፈራሚ እንደገና እንዲሞክር ያድርጉ።
- የጎደለ በመጠባበቅ ላይ ያለ ፕሮፖዛል ምልአተ ጉባኤው አስቀድሞ ደርሷል፣ TTL ጊዜው አልፎበታል ወይም የተሳሳተ የፕሮፖዛል መታወቂያ፣ የመመሪያ ሃሽ ወይም የመለያ መራጭ ጥቅም ላይ ውሏል ማለት ሊሆን ይችላል። በአዲስ nonce እንደገና ከማቅረብዎ በፊት የድህረ-ሁኔታውን ይጠይቁ።
- የተባዙ ማጽደቆች ክብደት አይጨምሩም። እያንዳንዱ የተመዘገበ ፈራሚ የተዋቀረውን ክብደት ቢበዛ አንድ ጊዜ ያበረክታል።
- መቆጣጠሪያው የተከለከለ ስለሆነ መደበኛ ግብይት በቀጥታ መፈረም። ሁልጊዜ `MultisigPropose` እና `MultisigApprove` ይጠቀሙ።
- በኋላ ላይ ትዕዛዞች በ CLI ምዝገባ ወቅት የታተመውን መለያ ማግኘት ካልቻሉ ጊዜያዊ ዘሩን ያዙት። ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ መለያ ከታዘዘው ፖሊሲ ያውጡ እና ከላይ እንደሚታየው በዚያ ዋጋ ይመዝገቡ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የመልቲሲግ ውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [Multisig የውሂብ ሞዴል በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [CLI በተሰካው የምንጭ-ኮድ ክለሳ ላይ ባለብዙ SIG ትግበራ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [ግብይቶች](/am/blockchain/transactions.md)
- [ፈቃዶች እና ሚናዎች](./permissions-and-roles.md)
