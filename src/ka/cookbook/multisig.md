---
translation_locale: ka
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# დაწონილი მულტისიგი {#weighted-multisig}

## შედეგები {#outcome}

დარეგისტრირეთ Taira სამი წევრის წონის მულტისიგის ანგარიში, შემოთავაზეთ მეტამონაცემების ინსტრუქცია, დაამტკიცეთ ის საკმარისი წონით, რომ შეესაბამებინათ კვორუმს და გადაამოწმეთ განხორციელება მრავალსიგის საანგარიშო მდგომარეობიდან.

## წინაპირობები {#prerequisites}

- სამი კანონიკური I105 ხელმოწერის ID `SIGNER_A`, `SIGNER_B` და `SIGNER_C`.
- დაფინანსებული Taira კონფიგურაციები კრიპტოგრაფიული ხელმომწერებისთვის A და C. შემოთავაზებელი და თითოეული დამტკიცებელი იხდის საკუთარ ტრანზაქციას.
- CLI-ით ჩაწერისას გამოიყენება `--fee-payer authority`; CLI ხელმოწერამდე იღებს ზუსტი საფასურის შეფასებას Taira-ს საფასურის აქტივში.
- რეგისტრაციის ნაბიჯისთვის: Rust კლიენტის პროექტი, რომელიც დამოკიდებულია `iroha`-სა და `iroha_model_base`-ზე და დამაგრებულია Iroha-ს იმავე წყარო კოდის რევიზიაზე, რომელზეც Taira მუშაობს. შემდგომი წინადადებისა და დამტკიცების ნაბიჯები CLI-ს იყენებს.
- ამჟამინდელი აღმასრულებლის მრავალნიშნა ფუნქცია ჩართულია. რეგისტრაცია ხელმისაწვდომია რიგითი ანგარიშებისთვის Iroha 3 შესრულების გარემოში, თუმცა Taira პოლიტიკა და საფასურის მიღება კვლავ გამოიყენება; გამოიყენეთ localnet, თუ საზოგადოებრივი განთავსება უარყოფს ამას.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## ნაბიჯები {#steps}

### 1. დაარეგისტრირეთ წონიერი პოლიტიკა {#_1-register-a-weighted-policy}

ხელმომწერ C-ს აქვს წონა 2; A-სა და B-ს თითოეულს — წონა 1. ამიტომ 3-ის კვორუმს სჭირდება C და ან A, ან B. აქ `registrar` არის `iroha::blocking::Client`, რომლის `submit` ელოდება Applied საბოლოობას. რეგისტრაციამდე კანონიკური ანგარიში გამოიყვანეთ ზუსტად ამ პოლიტიკიდან, შემდეგ იგივე მნიშვნელობა გადაეცით `MultisigRegister::with_account`-ს:

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

შეინახეთ დაბეჭდილი მნიშვნელობა CLI ნაბიჯებისათვის:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

დამაგრებულ რევიზიაზე CLI-ის რეგისტრაციის ბრძანება ბეჭდავს თავის დროებით seed-ს, სანამ შესრულების გარემო მას გასაღებს შეუცვლის. ეს seed კონტროლერად ხელახლა არ გამოიყენოთ. კონტროლერის პირადი გასაღები არ არსებობს: მრავალხელმოწერიანი ანგარიშის უფლებამოსილება მხოლოდ დამტკიცებული წინადადებებიდან მოდის. CLI-დან რეგისტრაციისთვის კი პოლიტიკიდან გამოყვანილი მნიშვნელობა გადაეცით `ledger multisig register --account`-ს.

### 2. შეადგინეთ ერთი ინსტრუქცია ისე, რომ მას არ წარუდგინოთ {#_2-build-one-instruction-without-submitting-it}

გლობალური `--emit-instructions` გადამრთველი ინსტრუქციების მასივს წარდგენის ნაცვლად სტანდარტულ გამოსავალში ბეჭდავს, ამიტომ საფასური არ იხარჯება.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. კრიპტოგრაფიული ხელმოწერის სახით შეთავაზება A {#_3-propose-as-signer-a}

წინადადების ავტორი ავტომატურად ამატებს საკუთარ წონას. შექმენით წინადადების ახალი nonce და შეინახეთ ის ნებისმიერი განმეორებითი ცდისთვის. დაიმახსოვრეთ CLI-ის მიერ დაბეჭდილი წინადადების ID და ინსტრუქციის ჰეში; დამტკიცებები ორივეს უკავშირდება.

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

ჩამოთვალეთ ჯერ კიდევ გამოწვეული წინადადება მკაფიო შეზღუდული შერჩევით:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. დამტკიცდეს როგორც კრიპტოგრაფიული ხელმოწერა C {#_4-approve-as-signer-c}

A-ს წონა 1 და C-ის წონა 2 აღწევს კვორუმს 3 და ახორციელებს შემოთავაზებულ ინსტრუქციას, როგორც მრავალნიშნა ანგარიშს.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust კლიენტს შეუძლია გააგრძელოს იმავე, პოლიტიკიდან გამოყვანილი ანგარიშით და ზემოთ გამოყენებული სასიცოცხლო ციკლის ორი ინსტრუქციით. თითოეული ხელმომწერის კლიენტი არის `iroha::blocking::Client`; წინადადების ID გამოიყვანება კლიენტის ქსელიდან, მრავალხელმოწერიანი ანგარიშიდან და ახალი nonce-დან:

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

## შემოწმება {#verify}

წაიკითხეთ განცხადება და დაადასტურეთ, რომ წინადადება აღარ არის მოსალოდნელი:

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

მეტამონაცემების მნიშვნელობა უნდა იყოს `"approved"`, დაფიქსირებული წინადადების ID და ინსტრუქციის ჰეში აღარ უნდა ჩანდეს მომლოდინედ, ხოლო შემოწმებულმა კონტროლერმა უნდა აჩვენოს `threshold` `3`, `total_weight` `4` და წევრების წონები 1, 1 და 2; წევრები საჯარო გასაღებების მიხედვით არის დალაგებული.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `not qualified to propose multisig` ან `not qualified to approve multisig` ნიშნავს, რომ წინადადების წარმდგენი ან დამამტკიცებელი კლიენტი პოლიტიკაში რეგისტრირებულ არცერთ I105 ID-ს არ შეესაბამება.
- საბოლოო დამტკიცება შეიძლება უარი თქვას, როდესაც მულტისიგის ანგარიშს არ აქვს ნებართვა შემოთავაზებული ინსტრუქციების შესრულებისთვის. მიეცით ავტორიზაციის პრინციპალი მულტიზიგის ანგარიშით, და არა მხოლოდ მის ცალკეულ კრიპტოგრაფიულ ხელმოწერებს, შემდეგ კი შეეცადეთ დარჩენილ კრიპტოლოგიურ ხელმოწერას კვლავ.
- მომლოდინე წინადადების არარსებობა შეიძლება ნიშნავდეს, რომ კვორუმი უკვე მიღწეულია, TTL ამოიწურა, ან გამოყენებულია არასწორი წინადადების ID, ინსტრუქციის ჰეში ან ანგარიშის სელექტორი. ახალი nonce-ით ხელახლა შეთავაზებამდე მოთხოვნით წაიკითხეთ შედეგად მიღებული მდგომარეობა.
- ორმაგი დამტკიცებები არ დამატებს წონას. თითოეული რეგისტრირებული ხელმომწერი თავის კონფიგურირებულ წონას მაქსიმუმ ერთხელ უწევს.
- აკრძალულია ჩვეულებრივი ტრანზაქციის პირდაპირი ხელმოწერა. ყოველთვის გამოიყენეთ `MultisigPropose` და `MultisigApprove`.
- CLI რეგისტრაციის დროს დაბეჭდილი ანგარიში ვერ იპოვის, თქვენ დაიჭირეთ დროებითი თესლი. გამოიყვანეთ კანონიკური ანგარიში ბრძანებული პოლიტიკიდან და რეგისტრირდით აღნიშნული ღირებულებით, როგორც ზემოთ მოცემულია.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [მრავალხელმოწერა ინტეგრაციის ტესტები დამაგრებული წყარო კოდის გადახედვაზე](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [მრავალხელმოწერა მონაცემთა მოდელი დამაგრებული წყარო კოდის გადახედვაზე](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [CLI მრავალფუნქციური განხორციელება ჩაკეტილი წყარო კოდის რევიზიის დროს](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [ოპერაციები](/ka/blockchain/transactions.md)
- [ნებართვები და როლები](./permissions-and-roles.md)
