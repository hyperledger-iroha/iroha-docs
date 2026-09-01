---
translation_locale: dz
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: human-reviewed
---
# ལྗིད་ཚད་མང་པོ། {#weighted-multisig}

## གྲུབ་འབྲས་ {#outcome}

Taira གུ་འཐུས་མི་གསུམ་གྱི་ལྗིད་ཚད་ཅན་གྱི་སྣ་མང་རྩིས་ཐོ་ཐོ་བཀོད་འབད་ཞིནམ་ལས་ མེ་ཊ་ཌེ་ཊ་བཀོད་རྒྱ་ཅིག་གྲོས་འཆར་བཀོད་ཞིནམ་ལས་ ལྗིད་ཚད་ལངམ་སྦེ་ ཆ་འཇོག་འབད་དེ་ སྣ་མང་རྩིས་ཐོ་གི་གནས་སྟངས་ལས་ ལག་ལེན་འཐབ་ནི་བདེན་དཔྱད་འབད།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- ཀ་ནོ་ནི་ཀ་གསུམ་ I105 ཡིག་ཚང་གི་མིང་། IDs ནང་ `SIGNER_A`, `SIGNER_B`, དང་ `SIGNER_C`.
- མཚན་རྟགས་བཀོད་མི་ A དང་ C གི་དོན་ལུ་ མ་དངུལ་རྒྱབ་སྐྱོར་འབད་མི་ Taira རིམ་སྒྲིག་ཚུ་ གྲོས་འཆར་བཀོད་མི་དང་ ཆ་འཇོག་འབད་མི་ག་ར་གིས་ རང་སོའི་ཚོང་འབྲེལ་གྱི་དོན་ལུ་ ཏི་རུ་སྤྲོདཔ་ཨིན།
- `taira.tx-metadata.json` ད་ལྟོའི་བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་ལན་ལས་བཟོ་བསྐྲུན་འབད་ཡོདཔ་ཨིན་ འདྲ་བཤུས་རྐྱབ་ཡོད་པའི་འཐུས་རྒྱུ་དངོས་ཨའི་ཌི་ལས་ནམ་ཡང་མེན།
- Rust མགྲོན་སྡེ་ལས་འགུལ་དེ་ ཐོ་བཀོད་གྱི་རིམ་པ་གི་དོན་ལུ་ Iroha གཞི་རྟེན་བསྐྱར་བཅོས་དང་ Taira འདྲན་འདྲ་སྦེ་བཙུགས་ཡོདཔ་ཨིན། མ་འོངས་པའི་ གྲོས་འཆར་དང་ ཆ་འཇོག་གི་རིམ་པ་ཚུ་ནང་ CLI ལག་ལེན་འཐབ་ཨིན།
- ད་ལྟོའི་བཀོལ་སྤྱོད་པའི་མལ་ཊི་སིག་ཁྱད་ཆོས་ལྕོགས་ཅན་བཟོ་ཡོདཔ། ཐོ་བཀོད་འདི་ སྔོན་སྒྲིག་ Iroha 3 མཉེན་ཆས་གཡོག་བཀོལ་དུས་ཚོད་ནང་ སྤྱིར་བཏང་རྩིས་ཐོ་ཚུ་ལུ་འཐོབ་ཚུགས། དེ་འབདཝ་ད་ Taira སྲིད་བྱུས་དང་འཐུས་འཛུལ་སྤྱོད་འདི་ད་ལྟོ་ཡང་འཇུག་སྤྱོད་འབདཝ་ཨིན། མི་མང་བཀྲམ་སྤེལ་གྱིས་ ངོས་ལེན་མ་འབད་བ་ཅིན་ ལོ་ཀཱལ་ནེཊི་ལག་ལེན་འཐབ།

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## རིམ་པ་ཚུ་ {#steps}

### 1. ཚད་གཞི་ཅན་གྱི་ སྲིད་བྱུས་བཙུགས་ནི་ {#_1-register-a-weighted-policy}

མིང་རྟགས་འགོད་མི C གི་ ལྗིད་ཚད 2 ཨིནམ་ད་ A དང་ B རེ་ལུ་ ལྗིད་ཚད 1 རེ་ཡོད། དེ་འབདཝ་ལས་ མང་མོས་ཚད 3 གྱི་དོན་ལུ་ C དང་གཅིག་ཁར་ A ཡང་ན་ B གཉིས་ལས་གཅིག་དགོ། ཐོ་བཀོད མ་འབད་བའི་ཧེ་མ་ སྲིད་བྱུས་ཏག་ཏག་ དེ་ལས་ ཚད་ལྡན རྩིས་ཐོ བཏོན་ཞིནམ་ལས་ གནས་གོང་གཅིག་པ་དེ་ `MultisigRegister::with_account` ལུ་བྱིན།

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

CLI ཐབས་ལམ་ཚུ་གི་དོན་ལུ་ ཨེབ་གཏང་འབད་ཡོད་པའི་གོང་ཚད་བཞག་ནི།

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

བཙུགས་ཡོད་པའི་ Git commit ལུ་ CLI ཐོ་བཀོད་བརྡ་བཀོད་འདི་གིས་ མཉེན་ཆས་ལག་བསྟར་མཉེན་ཆས་གྱིས་ ལོག་མ་བཙུགས་པའི་ཧེ་མ་ གནས་སྐབས་ཀྱི་སོན་འདི་དཔར་བསྐྲུན་འབདཝ་ཨིན། ཚོད་འཛིན་འབད་མི་སྦེ་ སོན་དེ་ལོག་སྟེ་ལག་ལེན་མ་འཐབ། ཚད་འཛིན་སྒེར་གྱི་ལྡེ་མིག་མེདཔ་ཨིན་: མལ་ཊི་སིག་གནང་བ་གཙོ་འཛིན་འདི་ ཆ་འཇོག་འབད་ཡོད་པའི་གྲོས་འཆར་ཚུ་ལས་རྐྱངམ་ཅིག་འོངམ་ཨིན།

### 2. བཀའ་རྒྱ་གཅིག་མ་བཙུགས་པར་བཟོ་ {#_2-build-one-instruction-without-submitting-it}

ཡོངས་ཁྱབ་ `-o` སོར་བསྒྱུར་འདི་གིས་ བཀོད་རྒྱ་ཨེ་རེ་ཅིག་ ཚད་ལྡན་ཐོན་འབྲས་ལུ་རིམ་སྒྲིག་འབདཝ་ཨིན། འདི་གིས་ ཚོང་འབྲེལ་ཅིག་ བཙུགས་མི་བཏུབ་ལས་ འཐུས་ག་ནི་ཡང་ ཟད་འགྲོ་མི་བཏངམ་ཨིན།

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### གྲོས་འདེབས་འདི་ ཨའི་སྦེ་བཙུགས་དགོ། {#_3-propose-as-signer-a}

གྲོས་འཆར་བཙུགས་མི་གིས་ རང་བཞིན་གྱི་ལྗིད་ཚད་འཐོབ་དོ་ཡོདཔ་ཨིན། CLI གིས་ ཨེབ་གཏང་འབད་ཡོད་པའི་ བརྡ་བཀོད་གི་ཧེཤ་ཚུ་བཟུང་། ངོས་ལེན་འདི་ ཧེཤ་དེ་གུ་བཅའ་མར་གཏོགས་འོང་།

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

ད་ལྟོ་ཡང་ བསྒུག་སྡོད་ཡོད་པའི་གྲོས་འཆར་འདི་ གསལ་ཏོག་ཏོ་ ཚད་ལྡན་སེལ་འཐུ་འབད་མི་ཅིག་དང་གཅིག་ཁར་ ཐོ་བཀོད་འབད།

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. ངོ་རྟགས་བཀོད་མི་སྦེ་ ཆ་འཇོག་འབད་ C {#_4-approve-as-signer-c}

A གི་ལྗིད་ཚད་ ༡ དང་ C གི་ལྗིད་ཚད་ ༢ འདི་ ཀོརམ་ ༣ ལུ་ལྷོད་དེ་ གྲོས་འཆར་བཀོད་རྒྱ་འདི་ མལ་ཊི་སིག་རྩིས་ཐོ་སྦེ་ ལག་ལེན་འཐབ་ཨིན།

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust མཁན་པོ་གིས་ སྲིད་བྱུས་ལས་འབྱུང་འོང་མི་རྩིས་དང་ གོང་ལུ་ལག་ལེན་འཐབ་ཡོད་པའི་ཚེ་རིང་མཐའ་འཁོར་གྱི་བསླབ་བྱ་གཉིས་དང་གཅིག་ཁར་ འཕྲོ་མཐུད་འབད་ཚུགས་ནི།

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

## བརྟག་དཔྱད་འབད་ {#verify}

བརྡ་འཕྲིན་གནས་སྟངས་ལྷག་སྟེ་ གྲོས་འཆར་འདི་ ད་ལས་ཕར་ བསྒུག་སྡོད་མེདཔ་སྦེ་ ངེས་གཏན་བཟོ།

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

མེ་ཊ་ཌེ་ཊ་གནས་གོང་འདི་ `"approved"` འོང་དགོཔ་ཨིན་ འཛིན་བཟུང་འབད་ཡོད་པའི་བཀོད་རྒྱ་ཧེཤ་འདི་ ད་ལས་ཕར་ བསྒུག་སྡོད་མི་སྦེ་མཐོང་དགོཔ་མ་ཚད་ བརྟག་ཞིབ་འབད་ཡོད་པའི་ཚད་འཛིན་པ་གིས་ ལྗིད་ཚད་ `1, 1, 2` འདི་ ཀོརམ་ `3` དང་ཅིག་ཁར་སྟོན་དགོཔ་ཨིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `signatory is not part of multisig` ཟེར་མི་འདི་ གྲོས་འཆར་བཀོད་མི་ཡང་ན་ ཆ་འཇོག་འབད་མི་ མཁོ་མངགས་འབད་མི་འདི་ སྲིད་བྱུས་ནང་ ཐོ་བཀོད་འབད་ཡོད་པའི་ I105 IDs གཅིག་དང་ མཐུན་སྒྲིག་མེདཔ་ཨིན།
- མཐའ་མཇུག་གི་ཆ་འཇོག་འདི་ མལ་ཊི་སིག་རྩིས་ཐོ་ལུ་ གྲོས་འཆར་བཀོད་ཡོད་པའི་བཀོད་རྒྱ་ཚུ་ ལག་ལེན་འཐབ་ནི་གི་གནང་བ་མེད་པའི་སྐབས་ བཀག་ཆ་འབད་ཚུགས། མཚན་རྟགས་བཀོད་མི་ངོ་རྐྱང་ཚུ་ལུ་རྐྱངམ་ཅིག་མེན་པར་ མལ་ཊི་སིག་རྩིས་ཐོ་ལུ་དབང་ཚད་བྱིན་ཞིནམ་ལས་ ལྷག་ལུས་མཚན་རྟགས་བཀོད་མི་ཅིག་གིས་ ལོག་སྟེ་འབད་རྩོལ་བསྐྱེད་བཅུག།
- གྲོས་འཆར་མ་ལྷོད་པའི་སྐབས་ གྲོས་ཐག་བཅད་ཚར་ཡོདཔ་དང་ TTL གྱི་དུས་ཚོད་མཇུག་བསྡུ་ཡོདཔ་དང་ ཡང་ན་ འཁྲུན་ཆོད་གནགཔོ་ (བསྡུས་རྟགས/རྩིས་ཐོ སེལ་བྱེད) ལག་ལེན་འཐབ་ཡོད་པའི་དོན་དག་འབྱུང་ཚུགས། ད་རུང་ གྲོས་འདེབས་མ་འབད་བའི་ཧེ་མར་ ཤུལ་མའི་གནས་སྟངས་ལུ་ དྲི་དཔྱད་འབད་དགོ།
- ཆ་འཇོག་འདྲ་བཤུས་ཚུ་གིས་ ལྗིད་ཚད་ཁ་སྐོང་མི་འབད། ཐོ་བཀོད་འབད་ཡོད་པའི་མིང་རྟགས་བཀོད་མི་རེ་རེ་གིས་ མང་ཤོས་རང་ ཚར་གཅིག་ དེ་གི་རིམ་སྒྲིག་འབད་ཡོད་པའི་ལྗིད་ཚད་འདི་ ཕན་འདེབས་འབདཝ་ཨིན།
- ཚད་འཛིན་འབད་མི་འདི་ བཀག་ཆ་འབད་ཡོདཔ་ལས་ སྤྱིར་བཏང་གི་ཚོང་འབྲེལ་ལུ་ ཐད་ཀར་དུ་མིང་རྟགས་བཀོད་ནི། ཨ་རྟག་རང་ `MultisigPropose` དང་ `MultisigApprove` ལག་ལེན་འཐབ།
- ཁྱོད་ཀྱིས་ CLI ཐོ་བཀོད་འབད་བའི་སྐབས་ལུ་ ཨེབ་གཏང་འབད་ཡོད་པའི་རྩིས་དེ་ མཐོང་མ་ཚུགསཔ་ཨིན་པ་ཅིན་ ཁྱོད་ཀྱིས་ གནས་སྐབས་ཀྱི་ས་བོན་འདི་འཛིན་བཟུང་འབད་ཡོདཔ་ཨིན། བཀའ་རྒྱ་བཀོད་མི་ སྲིད་བྱུས་ལས་ ཀ་ནོ་ནི་ཀིས་རྩིས་བཏོན་ཞིནམ་ལས་ གོང་ལུ་སྟོན་དོ་བཟུམ་སྦེ་གོང་གི་གོང་ཚད་དང་གཅིག་ཁར་ ཐོ་བཀོད་ཀྱི་ཚུགས།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [མཉམ་འབྲེལ་འཕྲུལ་ཆས་མང་རབས་ཅིག་ ཕྲ་སྒྲིག་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs) ལུ་ བརྟག་དཔྱད་འབདཝ་ཨིན།
- [ཨང་གྲངས་མང་རབས་ཀྱི་ བརྡ་དོན་རྣམ་གཞག་ཚུ་ ཕིན་ཌ་ Git commit ལུ་](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI མང་སྡེ་བརྡ་ལག་བསྟར་སྤྱོད་འབད་ཐབས། — གཏན་སྦྱར་ཡོད་པའི Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [ལས་སྣ་ཚུ་](/dz/blockchain/transactions.md)
- [འཁྲུན་ཆོད་དང་ འགན་ཁུར་ཚུ་](./permissions-and-roles.md)
