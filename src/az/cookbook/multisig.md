---
translation_locale: az
translation_source: /cookbook/multisig.md
translation_source_hash: 9654923faf6c84dfd21a428ebe3c53dbd074b8e3274c12c8aa41bf31884686f7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ağırlı Multisig {#weighted-multisig}

## Nəticə {#outcome}

Taira səhifəsində üç nəfərdən ibarət ağırlanmış multisig hesabı qeydiyyatdan keçirin, metadata təlimatı təklif edin, quorumunu təmin etmək üçün kifayət qədər ağırlıqla təsdiqləyin və multisig hesabının vəziyyətindən icra olunmasını yoxlayın.

## Əvvəlki şərtlər {#prerequisites}

- Üç kanonik I105 İmzaçı IDs ilə `SIGNER_A`, `SIGNER_B`, və `SIGNER_C`.
- A və C imzaçıları üçün maliyyələşdirilmiş Taira konfigürasiyalar. Təklifçi və hər təsdiqləyici öz əməliyyatlarını ödəyirlər.
- `taira.tx-metadata.json` cari faucet cavabından inşa edilmişdir, heç vaxt kopyalanmış ödəniş aktivindən ID.
- A Rust müştəri layihəsi eyni Iroha mənbə tərtib edilməsi Taira Daha sonrakı təklif və təsdiq mərhələlərində CLI.
- Hal-hazırda icraçının multisig xüsusiyyəti aktivləşdirilib. qeydiyyat standart Iroha 3 iş vaxtı ilə adi hesablara mövcuddur, baxmayaraq ki, Taira siyasəti və ödəniş qəbul edilməsi hələ də tətbiq olunur; ictimaiyyət yayımı bunu rədd etsə lokalnet istifadə edin

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Dərslər {#steps}

### 1. Döyüşləndirilmiş siyasət qeydə alınır {#_1-register-a-weighted-policy}

İmzaçı C-nin çəkisi 2; A və B-nin hər biri 1 çəki var. 3 kvorumu buna görə C + ya A və ya B tələb edir. Kanonik hesabı qeydiyyatdan əvvəl bu dəqiq siyasətdən çıxarın, sonra eyni qiyməti `MultisigRegister::with_account` -yə keçin:

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

CLI addımları üçün çap edilmiş qiyməti saxlayın:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

Qeydiyyat komandanı CLI işlənmə vaxtından əvvəl müvəqqəti toxumunu yazdırırır. Bu toxumu nəzarətçi kimi istifadə etməyin. Mühafizəkarın xüsusi açarı yoxdur: çoxsaylı səlahiyyət yalnız təsdiq edilmiş təkliflərdən gəlir.

### 2. Təklif etmədən bir təlimat yazın {#_2-build-one-instruction-without-submitting-it}

Qlobal `-o` keçid bir təlimat dizini standart çıxış üçün seriallaşdırır. O, bir əməliyyat təqdim etmir və buna görə də heç bir ödəniş ödəmir.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. İmzaçı olaraq A təklif edin. {#_3-propose-as-signer-a}

Təklif edən avtomatik olaraq öz çəkisini verir. CLI ilə çap edilmiş dəqiq təlimat hashini ələ keçirin; təsdiqlər bu hashə bağlanır.

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

Hələ təxirə salınmış təklifləri açıq bir məhdud seçicisi ilə qeyd edin:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. İmzaçı kimi təsdiq olun C {#_4-approve-as-signer-c}

A'nın çəkisi 1 + C'nin çəkisi 2 3-cü quorumuna çatır və təklif olunan təlimatı multisig hesabı kimi icra edir.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust müştəri eyni siyasət mənşəli hesabı və yuxarıda istifadə olunan iki həyat dövrü təlimatları ilə davam edə bilər:

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

## Tətbiq edin {#verify}

Poststatı oxuyun və təklifin artıq gözlənilir olmadığını təsdiqləyin:

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

Metadata qiyməti `"approved"` olmalıdır, tutulan təlimat hashı artıq gözlənilir kimi görünməməlidir və yoxlanılan nəzarətçi ağırlıqları `1, 1, 2` quorum ilə `3` göstərməlidir.

## Problemlərin həlli {#troubleshooting}

- `signatory is not part of multisig` - təklif edən və ya təsdiqləyən müştəri polisdə qeydiyyata alınmış I105 IDs müştərilərindən biri ilə uyğun gəlmir.
- Mültisig hesabının təklif olunan təlimatların icrası üçün icazəsi olmadıqda son təsdiqdən imtina edilə bilər. Multisig hesabına səlahiyyət verin, yalnız fərdi imzalananlara yox, sonra qalan imzalanana yenidən cəhd edin.
- Qəbul olan təklif artıq quorum əldə edildiyini, TTL müddəti başa çatdığını və ya səhv göstərici hash / hesab seçicisi istifadə edildiyini bildirə bilər. Yenidən təklif etməzdən əvvəl post-statini soruşun.
- İkiqat təsdiqlər çəki əlavə etmir. Hər qeydiyyatdan keçmiş imzalanan şəxs ən çox bir dəfə öz qurulmuş çəkisini verir.
- Düzgün əməliyyatın nəzarətçi olaraq imzalanması qadağandır. Hər zaman `MultisigPropose` və `MultisigApprove` istifadə edin.
- Əgər sonrakı əmrlər CLI qeydiyyat zamanı çap edilmiş hesabı tapa bilmirsə, müvəqqəti toxum tutmusunuz. Kanonik hesabı sifariş olunmuş siyasətdən çıxarın və yuxarıda göstərildiyi kimi bu dəyərlə qeyd edin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Bağlanmış komitdə multisig inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Bağlanmış komitdə multisig məlumat modeli](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI bağlanmış komitdə multisig icrası](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Əməliyyatlar](/az/blockchain/transactions.md)
- [icazələr və rollar ](./permissions-and-roles.md)
