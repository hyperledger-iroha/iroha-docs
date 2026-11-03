---
translation_locale: dz
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: human-reviewed+claude-opus-5-5
---
# ལྗིད་ཚད་མང་པོ། {#weighted-multisig}

## གྲུབ་འབྲས་ {#outcome}

Taira གུ་འཐུས་མི་གསུམ་གྱི་ལྗིད་ཚད་ཅན་གྱི་སྣ་མང་རྩིས་ཐོ་ཐོ་བཀོད་འབད་ཞིནམ་ལས་ མེ་ཊ་ཌེ་ཊ་བཀོད་རྒྱ་ཅིག་གྲོས་འཆར་བཀོད་ཞིནམ་ལས་ ལྗིད་ཚད་ལངམ་སྦེ་ ཆ་འཇོག་འབད་དེ་ སྣ་མང་རྩིས་ཐོ་གི་གནས་སྟངས་ལས་ ལག་ལེན་འཐབ་ནི་བདེན་དཔྱད་འབད།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- ཀ་ནོ་ནི་ཀ་གསུམ་ I105 ཡིག་ཚང་གི་མིང་། IDs ནང་ `SIGNER_A`, `SIGNER_B`, དང་ `SIGNER_C`.
- མཚན་རྟགས་བཀོད་མི་ A དང་ C གི་དོན་ལུ་ མ་དངུལ་རྒྱབ་སྐྱོར་འབད་མི་ Taira རིམ་སྒྲིག་ཚུ་ གྲོས་འཆར་བཀོད་མི་དང་ ཆ་འཇོག་འབད་མི་ག་ར་གིས་ རང་སོའི་ཚོང་འབྲེལ་གྱི་དོན་ལུ་ ཏི་རུ་སྤྲོདཔ་ཨིན།
- CLI གི་ འབྲི་ནིའི་ཚོང་འབྲེལ་ཚུ་གིས་ `--fee-payer authority` ལག་ལེན་འཐབ་ཨིན། CLI གིས་ མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་ Taira གི་འཐུས་རྒྱུ་དངོས་ནང་ འཐུས་ངེས་བདེན་གྱི་ གོང་ཚད་བཀོདཔ་ཨིན།
- ཐོ་བཀོད་ཀྱི་རིམ་པའི་དོན་ལུ་ `iroha` དང་ `iroha_model_base` ལུ་ བརྟེན་མི་ དེ་ལས་ Taira དང་ Iroha འབྱུང་ཁུངས་ཀྱི་ བསྐྱར་བཅོས་ཐོན་རིམ་ གཅིག་པ་ལུ་ གཏན་སྦྱར་འབད་ཡོད་པའི་ Rust ཞབས་ཏོག་ལེན་མིའི་ ལས་འགུལ་ཅིག། ཤུལ་མའི་ གྲོས་འཆར་དང་ ཆ་འཇོག་གི་རིམ་པ་ཚུ་གིས་ CLI ལག་ལེན་འཐབ་ཨིན།
- ད་ལྟོའི་བཀོལ་སྤྱོད་པའི་མལ་ཊི་སིག་ཁྱད་ཆོས་ལྕོགས་ཅན་བཟོ་ཡོདཔ། ཐོ་བཀོད་འདི་ སྔོན་སྒྲིག་ Iroha 3 མཉེན་ཆས་གཡོག་བཀོལ་དུས་ཚོད་ནང་ སྤྱིར་བཏང་རྩིས་ཐོ་ཚུ་ལུ་འཐོབ་ཚུགས། དེ་འབདཝ་ད་ Taira སྲིད་བྱུས་དང་འཐུས་འཛུལ་སྤྱོད་འདི་ད་ལྟོ་ཡང་འཇུག་སྤྱོད་འབདཝ་ཨིན། མི་མང་བཀྲམ་སྤེལ་གྱིས་ ངོས་ལེན་མ་འབད་བ་ཅིན་ ལོ་ཀཱལ་ནེཊི་ལག་ལེན་འཐབ།

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## རིམ་པ་ཚུ་ {#steps}

### 1. ཚད་གཞི་ཅན་གྱི་ སྲིད་བྱུས་བཙུགས་ནི་ {#_1-register-a-weighted-policy}

མིང་རྟགས་འགོད་མི་ C ལུ་ ལྗིད་ཚད་ 2 ཡོདཔ་ད་ A དང་ B རེ་རེ་ལུ་ ལྗིད་ཚད་ 1 རེ་ ཡོདཔ་ཨིན། དེ་འབདཝ་ལས་ མང་མོས་ཚད་ 3 ལུ་ C དང་གཅིག་ཁར་ A ཡང་ན་ B དགོཔ་ཨིན། ནཱ་ལུ་ `registrar` འདི་ `iroha::blocking::Client` ཅིག་ཨིནམ་དང་ དེ་གི་ `submit` གིས་ Applied མཐར་ཐུག་གནས་སྟངས་ལུ་ ལྷོདཔ་ཚུན་ སྒུགཔ་ཨིན། ཐོ་བཀོད་མ་འབད་བའི་ཧེ་མ་ སྲིད་བྱུས་ངེས་བདེན་དེ་ལས་ ཚད་ལྡན་རྩིས་ཐོ་འདི་ བཏོན་ཞིནམ་ལས་ གནས་གོང་གཅིག་པ་དེ་ `MultisigRegister::with_account` ལུ་ བྱིན་:

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

CLI ཐབས་ལམ་ཚུ་གི་དོན་ལུ་ ཨེབ་གཏང་འབད་ཡོད་པའི་གོང་ཚད་བཞག་ནི།

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

གཏན་སྦྱར་ཡོད་པའི་ Git commit ནང་ CLI གི་ ཐོ་བཀོད་བཀའ་རྒྱ་འདི་གིས་ ལག་བསྟར་མཉེན་ཆས་ཀྱིས་ ལྡེ་མིག་ ལོག་མ་བསྒྱུར་བའི་ཧེ་མ་ དེ་གི་ གནས་སྐབས་ཀྱི་ས་བོན་ (seed) འདི་ གསལ་སྟོནམ་ཨིན། ས་བོན་དེ་ ཚད་འཛིན་པ་སྦེ་ ལོག་སྟེ་ ལག་ལེན་མ་འཐབ། ཚད་འཛིན་པའི་ སྒེར་གྱི་ལྡེ་མིག་ མེད། མལ་ཊི་སིག་གི་དབང་ཚད་འདི་ ཆ་འཇོག་གྲུབ་པའི་ གྲོས་འཆར་ཚུ་ལས་རྐྱངམ་ཅིག་ འབྱུངམ་ཨིན། དེའི་ཚབ་ལུ་ CLI ལས་ ཐོ་བཀོད་འབད་ནི་ཨིན་པ་ཅིན་ སྲིད་བྱུས་ལས་ བཏོན་མི་གནས་གོང་འདི་ `ledger multisig register --account` ལུ་ བྱིན།

### 2. བཀའ་རྒྱ་གཅིག་མ་བཙུགས་པར་བཟོ་ {#_2-build-one-instruction-without-submitting-it}

ཡོངས་ཁྱབ་ `--emit-instructions` གདམ་ཁ་འདི་གིས་ བཀོད་རྒྱའི་ཐོ་ཡིག་འདི་ ཕུལ་ནིའི་ཚབ་ལུ་ ཚད་ལྡན་ཐོན་འབྲས་ནང་ གསལ་སྟོནམ་ཨིན། དེ་འབདཝ་ལས་ འཐུས་ ག་ནི་ཡང་ ཟད་འགྲོ་མི་འགྱོ།

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### གྲོས་འདེབས་འདི་ ཨའི་སྦེ་བཙུགས་དགོ། {#_3-propose-as-signer-a}

གྲོས་འཆར་བཀོད་མི་གིས་ རང་གི་ལྗིད་ཚད་ རང་བཞིན་གྱིས་ ཁ་སྐོང་བརྐྱབཔ་ཨིན། གྲོས་འཆར་གྱི་ ཚར་གཅིག་སྤྱོད་ཨང་ (nonce) གསརཔ་ཅིག་ བཟོ་ཞིནམ་ལས་ ལོག་འབད་རྩོལ་ ག་ཅི་བཟུམ་གྱི་དོན་ལུ་ཡང་ བཞག། CLI གིས་ གསལ་སྟོན་འབད་མི་ གྲོས་འཆར་ ID དང་ བཀོད་རྒྱ་ཧེཤ་ བཟུང་། ཆ་འཇོག་ཚུ་ དེ་གཉིས་ཆ་ར་ལུ་ བཅིངས་ཏེ་ཡོདཔ་ཨིན།

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
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust ཞབས་ཏོག་ལེན་མི་གིས་ སྲིད་བྱུས་ལས་ བཏོན་མི་ རྩིས་ཐོ་གཅིག་པ་དང་ གོང་ལུ་ ལག་ལེན་འཐབ་མི་ ཚེ་རིམ་བཀོད་རྒྱ་གཉིས་ཀྱིས་ འཕྲོ་མཐུད་འབད་ཚུགས། མིང་རྟགས་འགོད་མི་རེ་རེའི་ ཞབས་ཏོག་ལེན་མི་འདི་ `iroha::blocking::Client` ཅིག་ཨིན། གྲོས་འཆར་ ID འདི་ ཞབས་ཏོག་ལེན་མིའི་དྲ་རྒྱ་དང་ མལ་ཊི་སིག་རྩིས་ཐོ་ དེ་ལས་ ཚར་གཅིག་སྤྱོད་ཨང་ (nonce) གསརཔ་ཅིག་ལས་ བཏོནམ་ཨིན་:

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

## བརྟག་དཔྱད་འབད་ {#verify}

བརྡ་འཕྲིན་གནས་སྟངས་ལྷག་སྟེ་ གྲོས་འཆར་འདི་ ད་ལས་ཕར་ བསྒུག་སྡོད་མེདཔ་སྦེ་ ངེས་གཏན་བཟོ།

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

ཟུར་གནས་གནད་སྡུད་གནས་གོང་འདི་ `"approved"` ཨིན་དགོ། བཟུང་ཡོད་པའི་ གྲོས་འཆར་ ID དང་ བཀོད་རྒྱ་ཧེཤ་འདི་ ད་ལས་ཕར་ བསྒུག་སྡོད་ཀྱི་གནས་སྟངས་ནང་ མཐོང་མི་དགོ། བརྟག་ཞིབ་འབད་ཡོད་པའི་ ཚད་འཛིན་པ་གིས་ `threshold` `3`, `total_weight` `4`, དེ་ལས་ འཐུས་མི་ཚུ་གི་ལྗིད་ཚད་ 1, 1, དང་ 2 སྟོན་དགོ། འཐུས་མི་ཚུ་ མི་མང་ལྡེ་མིག་གི་ གོ་རིམ་ནང་ ཐོ་བཀོད་འབད་དེ་ཡོདཔ་ཨིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `not qualified to propose multisig` ཡང་ན་ `not qualified to approve multisig` ཟེར་མི་འདི་གིས་ གྲོས་འཆར་བཀོད་མི་ ཡང་ན་ ཆ་འཇོག་འབད་མི་ ཞབས་ཏོག་ལེན་མི་འདི་ སྲིད་བྱུས་ནང་ ཐོ་བཀོད་འབད་ཡོད་པའི་ I105 ID ཚུ་ལས་ གཅིག་དང་ཡང་ མ་མཐུནམ་སྦེ་ སྟོནམ་ཨིན།
- མཐའ་མཇུག་གི་ཆ་འཇོག་འདི་ མལ་ཊི་སིག་རྩིས་ཐོ་ལུ་ གྲོས་འཆར་བཀོད་ཡོད་པའི་བཀོད་རྒྱ་ཚུ་ ལག་ལེན་འཐབ་ནི་གི་གནང་བ་མེད་པའི་སྐབས་ བཀག་ཆ་འབད་ཚུགས། མཚན་རྟགས་བཀོད་མི་ངོ་རྐྱང་ཚུ་ལུ་རྐྱངམ་ཅིག་མེན་པར་ མལ་ཊི་སིག་རྩིས་ཐོ་ལུ་དབང་ཚད་བྱིན་ཞིནམ་ལས་ ལྷག་ལུས་མཚན་རྟགས་བཀོད་མི་ཅིག་གིས་ ལོག་སྟེ་འབད་རྩོལ་བསྐྱེད་བཅུག།
- བསྒུག་སྡོད་པའི་ གྲོས་འཆར་ཅིག་ མེད་པ་ཅིན་ མང་མོས་ཚད་ ཧེ་མ་ལས་ ལྷོད་ཚར་ཡོདཔ་ ཡང་ན་ TTL གི་དུས་ཡུན་ རྫོགས་ཡོདཔ་ ཡང་ན་ གྲོས་འཆར་ ID དང་ བཀོད་རྒྱ་ཧེཤ་ ཡང་ན་ རྩིས་ཐོ་སེལ་འཐུ་འབད་མི་ ནོར་བ་ ལག་ལེན་འཐབ་ཡོདཔ་ ཨིན་སྲིད། ཚར་གཅིག་སྤྱོད་ཨང་ (nonce) གསརཔ་ཅིག་གིས་ ལོག་སྟེ་ གྲོས་འཆར་མ་བཀོད་པའི་ཧེ་མ་ ཤུལ་མའི་གནས་སྟངས་ དྲི་དཔྱད་འབད།
- ཆ་འཇོག་འདྲ་བཤུས་ཚུ་གིས་ ལྗིད་ཚད་ཁ་སྐོང་མི་འབད། ཐོ་བཀོད་འབད་ཡོད་པའི་མིང་རྟགས་བཀོད་མི་རེ་རེ་གིས་ མང་ཤོས་རང་ ཚར་གཅིག་ དེ་གི་རིམ་སྒྲིག་འབད་ཡོད་པའི་ལྗིད་ཚད་འདི་ ཕན་འདེབས་འབདཝ་ཨིན།
- ཚད་འཛིན་འབད་མི་འདི་ བཀག་ཆ་འབད་ཡོདཔ་ལས་ སྤྱིར་བཏང་གི་ཚོང་འབྲེལ་ལུ་ ཐད་ཀར་དུ་མིང་རྟགས་བཀོད་ནི། ཨ་རྟག་རང་ `MultisigPropose` དང་ `MultisigApprove` ལག་ལེན་འཐབ།
- ཁྱོད་ཀྱིས་ CLI ཐོ་བཀོད་འབད་བའི་སྐབས་ལུ་ ཨེབ་གཏང་འབད་ཡོད་པའི་རྩིས་དེ་ མཐོང་མ་ཚུགསཔ་ཨིན་པ་ཅིན་ ཁྱོད་ཀྱིས་ གནས་སྐབས་ཀྱི་ས་བོན་འདི་འཛིན་བཟུང་འབད་ཡོདཔ་ཨིན། བཀའ་རྒྱ་བཀོད་མི་ སྲིད་བྱུས་ལས་ ཀ་ནོ་ནི་ཀིས་རྩིས་བཏོན་ཞིནམ་ལས་ གོང་ལུ་སྟོན་དོ་བཟུམ་སྦེ་གོང་གི་གོང་ཚད་དང་གཅིག་ཁར་ ཐོ་བཀོད་ཀྱི་ཚུགས།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [མཉམ་འབྲེལ་འཕྲུལ་ཆས་མང་རབས་ཅིག་ ཕྲ་སྒྲིག་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs) ལུ་ བརྟག་དཔྱད་འབདཝ་ཨིན།
- [ཨང་གྲངས་མང་རབས་ཀྱི་ བརྡ་དོན་རྣམ་གཞག་ཚུ་ ཕིན་ཌ་ Git commit ལུ་](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [CLI མང་སྡེ་བརྡ་ལག་བསྟར་སྤྱོད་འབད་ཐབས། — གཏན་སྦྱར་ཡོད་པའི Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [ལས་སྣ་ཚུ་](/dz/blockchain/transactions.md)
- [འཁྲུན་ཆོད་དང་ འགན་ཁུར་ཚུ་](./permissions-and-roles.md)
