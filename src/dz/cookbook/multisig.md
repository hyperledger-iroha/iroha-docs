---
translation_locale: dz
translation_source: /cookbook/multisig.md
translation_source_hash: 7090228c4fea7321c93fe0d2c67ef6de842de95bc3befa11d83c12b9f15b4752
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ཚད་འཇལ་མི་ Multisig {#weighted-multisig}

## གྲུབ་འབྲས་ {#outcome}

Taira ལུ་ འཐུས་མི་༣ གྱི་ལྗིད་ཚད་ཅན་གྱི་ multisig རྩིས་སྤྲོད་འབད་ཞིནམ་ལས་ metadata བཀའ་རྒྱ་ཅིག་ གྲོས་བསྟུན་འབད་ཞིནམ་ལས་ quorum འགྲུབ་ཚུགས་པའི་ཤུགས་དང་ལྡནམ་སྦེ་ ཆ་འཇོག་འབད་ཞིནམ་ལས་ multisigརྩིས་ཁྲ་གི་གནས་སྟངས་ནང་ལས་ལག་ལེན་དེ་ བརྟག་དཔྱད་འབད་ཚུགས།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- ཀ་ནོ་ནི་ཀ་གསུམ་ I105 ཡིག་ཚང་གི་མིང་། IDs ནང་ `SIGNER_A`, `SIGNER_B`, དང་ `SIGNER_C`.
- གྲོས་འདེབས་བཙུགས་མི་ A དང་ C གི་དོན་ལུ་ དངུལ་ཕོགས་སྤྲོད་པའི་ Taira བཟོ་བཀོད་འབད་ཡོདཔ་ཨིན། གྲོས་འཆར་བཙུགས་མི་དང་ ཆ་འཇོག་གྲུབ་མི་རེ་རེ་གིས་ ཁོང་རའི་ཚོང་འབྲེལ་གྱི་དོན་ལུ་ འཐུས་སྤྲོད་ཨིན།
- `taira.tx-metadata.json`འདི་ ད་ལྟོའི་ཐབ་ལན་ལས་ བཟོ་སྐྲུན་འབད་ཡོདཔ་ཨིན་རུང་ ཕྱིར་བཏོན་འབད་མི་ཁྲལ་གྱི་རྒྱུ་དངོས་ ID ལས་རྩ་ལས་རང་མེདཔ།
- Rust མགྲོན་སྡེ་ལས་འགུལ་དེ་ ཐོ་བཀོད་གྱི་རིམ་པ་གི་དོན་ལུ་ Iroha གཞི་རྟེན་བསྐྱར་བཅོས་དང་ Taira འདྲན་འདྲ་སྦེ་བཙུགས་ཡོདཔ་ཨིན། མ་འོངས་པའི་ གྲོས་འཆར་དང་ ཆ་འཇོག་གི་རིམ་པ་ཚུ་ནང་ CLI ལག་ལེན་འཐབ་ཨིན།
- ད་ལྟོའི་ལག་ལེན་པ་གིས་ multisig ཁྱད་ཆོས་འདི་བཟོ་བཀོད་འབད་ཡོདཔ་ཨིན། ཐོ་བཀོད་དེ་ default Iroha 3 runtimeནང་ལུ་ སྤྱིར་བཏང་རྩིས་ཁྲ་ཚུ་ནང་བཙུགས་ཚུགསཔ་ཨིན། མ་གཞི་ Taira སྲིད་བྱུས་དང་འཐུས་སྣེ་ལེན་དེ་ ད་ལྟོ་ཡང་ ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན་རུང་ མི་མང་གི་ལག་ལེན་གྱིས་ འདི་མ་བཏུབ་པ་ཅིན་ localnet ལག་ལེན་འཐབ་དགོ།

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

Signer C གྱི་ལྗིད་ཚད་ 2; A དང་ B གཉིས་ཆ་ར་གི་ལྗིད་ཚད་ 1 ཡོདཔ་ཨིན། འདི་འབདཝ་ལས་ ཀོ་རོ་མ་ 3 གིས་ C མཉམ་ ཡང་ན་ A ཡང་ན་ B དགོཔ་ཨིན། ཐོ་བཀོད་མ་འབད་བའི་ཧེ་མར་ དམ་ཆོས་ཀྱི་རྩིས་ཁྲ་འདི་ངོ་མ་གི་སྒོ་ལས་བཏོན་ཞིནམ་ལས་ གནས་གོང་དེ་ `MultisigRegister::with_account` ལུ་སྤེལ་འབད་:

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

CLI ཐོ་བཀོད་འབད་ནིའི་བཀའ་རྒྱ་འདི་ ཨེབ་གཏང་འབད་བའི་བསྒང་ལས་ རྒྱུན་འགྲུལ་གྱི་དུས་ཚོད་དེ་ ལོག་ལེན་མ་ཚར་བའི་ཧེ་མར་ ཨེབ་གཏང་འབདཝ་ཨིན། འདི་ཡང་ ལག་ལེན་འཐབ་མ་བཅུག Controller སྒེར་གྱི་ལྡེ་མིག་མེད་: multisigདབང་འཛིན་དེ་ ཆ་འཇོག་གྲུབ་མི་ གྲོས་འདེབས་ཚུ་ལས་རྐྱངམ་གཅིག་ ཐོན་འོང་།

### 2. བཀའ་རྒྱ་གཅིག་མ་བཙུགས་པར་བཟོ་ {#_2-build-one-instruction-without-submitting-it}

འཛམ་གླིང་ཡོངས་ཀྱི་ `-o` སྦྲེལ་ཐིག་འདི་གིས་ བརྡ་བཀོད་གི་གྲལ་རིམ་འདི་ རང་བཞིན་གྱི་ཐོན་སྐྱེད་ལུ་ བསྡུ་སྒྲིག་འབདཝ་ཨིན། འདི་འབདཝ་ལས་ ཚོང་འབྲེལ་མ་བཙུགས་པར་ ཟད་འགྲོ་བཏང་ཨིན།

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

ད་ལྟོའི་བར་མཚམས་ལུ་ཡོད་པའི་ གྲོས་འཆར་འདི་ གསལ་ཏོག་ཏོ་སྦེ་མཇུག་བསྡོམས་ཅན་གྱི་ གདམ་ཁ་རྐྱབ་མི་ཅིག་དང་གཅིག་ཁར་ཐོ་འགོད་འབད་:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. ངོ་རྟགས་བཀོད་མི་སྦེ་ ཆ་འཇོག་འབད་ C {#_4-approve-as-signer-c}

A གི་ལྗིད་ཚད་ 1 དང་ C གྱི་ལྗིད་ཚད་ 2 གིས་ quorum 3 ལུ་ལྷོད་དེ་ གྲོས་འཆར་བཀོད་རྒྱ་འདི་ multisigརྩིས་སྦེ་ལག་ལེན་འཐབ་ཨིན།

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

ཤུལ་མའི་གནས་ཚུལ། བསྐྱར་ཞིབ་འབད་ཞིནམ་ལས་ གྲོས་འཆར་འདི་ ད་ལྟོའི་བར་ན་ཡང་ བསྐྱར་ཞིབ་མ་འབད་བར་ཡོད་ཟེར་ངོས་ལེན་འབད་:

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

metadata གནས་གོང་འདི་ `"approved"`འབད་ནི་དང་བཟུང་མི་བཀོད་རྒྱ་གི་ཧེཤ་དེ་ ད་ལྟོའི་བར་ན་ཡང་མཐོང་མ་ཚུགསཔ་ དེ་ལས་བརྟག་དཔྱད་འབད་ཡོད་པའི་ལག་ལེན་འགོ་དཔོན་གྱིས་ ཀི་ལོ་མི་ཊར་ `1, 1, 2` ཚད་གཞི་དང་གཅིག་ཁར་ `3`བཏོན་དགོ།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `signatory is not part of multisig` གིས་སླབ་པ་ཅིན་ གྲོས་འཆར་བཀོད་མི་དེ་ ཡང་ན་ ངོས་ལེན་འབད་མི་དེ་ སྲིད་བྱུས་ནང་ ཐོ་བཀོད་འབད་མི་ I105 IDs ཚུ་གི་གྲལ་ལས་ གཅིག་དང་མ་འདྲ་བ་ཨིན།
- མཐའ་མཇུག་གི་ ངོས་ལེན་འདི་ ཆ་མེད་གཏང་ཚུགསཔ་ཨིན། ག་དེམ་ཅིག་སྦེ་ multisig account ལུ་ གྲོས་འཆར་བཀོད་རྒྱ་ཚུ་ལག་ལེན་འཐབ་ནིའི་ཆོག་ཐམ་མེད་པ་ཅིན་ multisig accountལུ་ དབང་ཚད་བྱིན་ནི་མ་གཏོགས་ ཐོ་བཀོད་འབད་མི་རྐྱངམ་གཅིག་ལུ་མ་གནང་པར་ ལྷག་ལུས་ཡོད་མི་ signer ཚུ་ལུ་ཡང་ བསྐྱར་ཞིབ་འབད་བཅུག་དགོ།
- གྲོས་འཆར་མ་ལྷོད་པའི་སྐབས་ གྲོས་ཐག་བཅད་ཚར་ཡོདཔ་དང་ TTL གྱི་དུས་ཚོད་མཇུག་བསྡུ་ཡོདཔ་དང་ ཡང་ན་ འཁྲུན་ཆོད་གནགཔོ་ (hash/account selector) ལག་ལེན་འཐབ་ཡོད་པའི་དོན་དག་འབྱུང་ཚུགས། ད་རུང་ གྲོས་འདེབས་མ་འབད་བའི་ཧེ་མར་ ཤུལ་མའི་གནས་སྟངས་ལུ་ དྲི་དཔྱད་འབད་དགོ།
- ངོས་ལེན་གཉིས་ཆ་ར་གིས་ དཀའ་སྡུག་མ་བྱིན་དོ་ཡོདཔ་ཨིན། ཐོ་བཀོད་ཅན་གྱི་ཁ་ཐོ་བཀོད་མི་རེ་རེ་གིས་ ཚད་གཞི་བཀོད་སྒྲིག་འབད་ཡོད་མི་ དཀའ་སྡུག་དེ་ ཚར་གཅིག་ལས་བརྒལ་ ཕན་ཐོགས་མི་ཚུགས།
- གནད་སྡུད་འཛིན་སྐྱོང་འཐབ་མི་གིས་ རང་བཞིན་གྱི་ཚོང་འབྲེལ་ཚུ་ ཐད་ཀར་དུ་བཙུགས་ནི་དེ་ བཀག་ཆ་འབད་ཡོདཔ་ཨིན། ཨ་རྟག་རང་ `MultisigPropose` དང་ `MultisigApprove` ལག་ལེན་འཐབ་དགོ།
- ཁྱོད་ཀྱིས་ CLI ཐོ་བཀོད་འབད་བའི་སྐབས་ལུ་ ཨེབ་གཏང་འབད་ཡོད་པའི་རྩིས་དེ་ མཐོང་མ་ཚུགསཔ་ཨིན་པ་ཅིན་ ཁྱོད་ཀྱིས་ གནས་སྐབས་ཀྱི་ས་བོན་འདི་འཛིན་བཟུང་འབད་ཡོདཔ་ཨིན། བཀའ་རྒྱ་བཀོད་མི་ སྲིད་བྱུས་ལས་ ཀ་ནོ་ནི་ཀིས་རྩིས་བཏོན་ཞིནམ་ལས་ གོང་ལུ་སྟོན་དོ་བཟུམ་སྦེ་གོང་གི་གོང་ཚད་དང་གཅིག་ཁར་ ཐོ་བཀོད་ཀྱི་ཚུགས།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [མཉམ་འབྲེལ་འཕྲུལ་ཆས་མང་རབས་ཅིག་ ཕྲ་སྒྲིག་ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/multisig.rs) ལུ་ བརྟག་དཔྱད་འབདཝ་ཨིན།
- [ཨང་གྲངས་མང་རབས་ཀྱི་ བརྡ་དོན་རྣམ་གཞག་ཚུ་ ཕིན་ཌ་ commit ལུ་](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI མང་སྡེ་བརྡ་ལག་བསྟར་སྤྱོད་འབད་ཐབས།](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [ལས་སྣ་ཚུ་](/dz/blockchain/transactions.md)
- [འཁྲུན་ཆོད་དང་ འགན་ཁུར་ཚུ་](./permissions-and-roles.md)
