---
translation_locale: ka
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# დაწონილი მულტისიგი {#weighted-multisig}

## შედეგები {#outcome}

დარეგისტრირეთ Taira სამი წევრის წონის მულტისიგის ანგარიში, შემოთავაზეთ მეტამონაცემების ინსტრუქცია, დაამტკიცეთ ის საკმარისი წონით, რომ შეესაბამებინათ კვორუმს და გადაამოწმეთ განხორციელება მრავალსიგის საანგარიშო მდგომარეობიდან.

## წინაპირობები {#prerequisites}

- სამი კანონიკური I105 ხელმოწერის ID `SIGNER_A`, `SIGNER_B` და `SIGNER_C`.
- დაფინანსებული Taira კონფიგურაციები კრიპტოგრაფიული ხელმომწერებისთვის A და C. შემოთავაზებელი და თითოეული დამტკიცებელი იხდის საკუთარ ტრანზაქციას.
- `taira.tx-metadata.json` შექმნილია მიმდინარე ტესტური მონეტების გამცემის რეაგირებიდან, არასდროს გადაბმული საფასურის აქტივების ID-დან.
- Rust კლიენტის პროექტი, რომელიც რეგისტრაციის ეტაპისთვის იგივე Iroha წყარო რევიზიონზეა ჩაკეტილი, როგორც Taira. შემდგომ წინადადებათა და დამტკიცების ეტაპებში გამოიყენება CLI.
- ამჟამინდელი აღმასრულებლის მრავალნიშნა ფუნქცია ჩართულია. რეგისტრაცია ხელმისაწვდომია რიგითი ანგარიშებისთვის Iroha 3 შესრულების გარემოში, თუმცა Taira პოლიტიკა და საფასურის მიღება კვლავ გამოიყენება; გამოიყენეთ localnet, თუ საზოგადოებრივი განთავსება უარყოფს ამას.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## ნაბიჯები {#steps}

### 1. დაარეგისტრირეთ წონიერი პოლიტიკა {#_1-register-a-weighted-policy}

კრიპტოგრაფიული ხელმოწერა C-ს აქვს 2 წონა; A და B-ს თითოეულმა აქვს 1 წონა. შესაბამისად, 3-ის კვორუმს სჭირდება C პლუს ან A ან B. გადაიტანეთ კანონიკური ანგარიში ამ ზუსტი პოლიტიკიდან რეგისტრაციამდე და შემდეგ გადაიტანოთ იგივე ღირებულება `MultisigRegister::with_account`:

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

შეინახეთ დაბეჭდილი მნიშვნელობა CLI ნაბიჯებისათვის:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

საწყისი კოდის გადახედვისას CLI რეგისტრაციის ბრძანება ბეჭდება თავისი დროებითი თესლი, სანამ პროგრამული უზრუნველყოფის აღსრულების გარემოცვა მას კვლავ ამოიღებს. არ გამოიყენოთ ეს თესლი როგორც კონტროლერი. არ არსებობს კონტროლერის პირადი გასაღები: მრავალხელმოწერა ავტორიზაციის პრინციპული მხოლოდ დამტკიცებული წინადადებებიდან მოდის.

### 2. შეადგინეთ ერთი ინსტრუქცია ისე, რომ მას არ წარუდგინოთ {#_2-build-one-instruction-without-submitting-it}

გლობალური `-o` კომპიუტერი სერიალიზებს ინსტრუქციის მასაჟს სტანდარტულ გამოსავალზე. ის არ წარადგენს ტრანზაქციას და შესაბამისად, არ იხარჯება საფასურებს.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. კრიპტოგრაფიული ხელმოწერის სახით შეთავაზება A {#_3-propose-as-signer-a}

შემოთავაზებელი ავტომატურად უწევს თავის წონას. დაიჭირეთ CLI მიერ დაბეჭდილი ზუსტი ინსტრუქციის კრიპტოგრაფიული ჰეში; დამტკიცებები უკავშირდება ამ კრიპტოგრაფულ ჰეშს.

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
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust კლიენტს შეუძლია გააგრძელოს იგივე პოლიტიკური ანგარიშის წარმოქმნა და ზემოთ გამოყენებული ორი სიცოცხლის ციკლის ინსტრუქცია:

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

## შემოწმება {#verify}

წაიკითხეთ განცხადება და დაადასტურეთ, რომ წინადადება აღარ არის მოსალოდნელი:

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

მეტამონაცემების ღირებულება უნდა იყოს `"approved"`, დაფიქსირებული ინსტრუქციის კრიპტოგრაფიული ჰეში აღარ უნდა გამოჩნდეს, როგორც მოქმედი და ინსპექტირებულმა კონტროლერმა უნდა აჩვენოს წონაში `1, 1, 2` კვორუმით `3`.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `signatory is not part of multisig` ნიშნავს, რომ შემოთავაზებელი ან დამტკიცებელი კლიენტი არ შეესაბამება ერთ-ერთ პოლიტიკაში რეგისტრირებულ I105 ID- ს.
- საბოლოო დამტკიცება შეიძლება უარი თქვას, როდესაც მულტისიგის ანგარიშს არ აქვს ნებართვა შემოთავაზებული ინსტრუქციების შესრულებისთვის. მიეცით ავტორიზაციის პრინციპალი მულტიზიგის ანგარიშით, და არა მხოლოდ მის ცალკეულ კრიპტოგრაფიულ ხელმოწერებს, შემდეგ კი შეეცადეთ დარჩენილ კრიპტოლოგიურ ხელმოწერას კვლავ.
- გამოტოვებული მოქმედ წინადადება შეიძლება ნიშნავდეს, რომ უკვე მიღწეულია კვორუმი, TTL ამოიწურა ან არასწორი ინსტრუქციის ჰეშ / ანგარიშის შერჩევით იყო გამოყენებული. შეკითხვა პოსტ-სახელმწიფო, სანამ კვლავ წინადადება.
- ორმაგი დამტკიცებები არ დამატებს წონას. თითოეული რეგისტრირებული ხელმომწერი თავის კონფიგურირებულ წონას მაქსიმუმ ერთხელ უწევს.
- აკრძალულია ჩვეულებრივი ტრანზაქციის პირდაპირი ხელმოწერა. ყოველთვის გამოიყენეთ `MultisigPropose` და `MultisigApprove`.
- CLI რეგისტრაციის დროს დაბეჭდილი ანგარიში ვერ იპოვის, თქვენ დაიჭირეთ დროებითი თესლი. გამოიყვანეთ კანონიკური ანგარიში ბრძანებული პოლიტიკიდან და რეგისტრირდით აღნიშნული ღირებულებით, როგორც ზემოთ მოცემულია.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [მრავალხელმოწერა ინტეგრაციის ტესტები დამაგრებული წყარო კოდის გადახედვაზე](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [მრავალხელმოწერა მონაცემთა მოდელი დამაგრებული წყარო კოდის გადახედვაზე](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI მრავალფუნქციური განხორციელება ჩაკეტილი წყარო კოდის რევიზიის დროს](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [ოპერაციები](/ka/blockchain/transactions.md)
- [ნებართვები და როლები](./permissions-and-roles.md)
