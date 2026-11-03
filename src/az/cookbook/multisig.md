---
translation_locale: az
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Çəkili Çoxsaylı İmza {#weighted-multisig}

## Nəticə {#outcome}

Taira üzərində üç üzvü olan ağırlıqlı çox imzalı hesab yaradın, bir metadata təlimatı təklif edin, kvorum tələbinə çatmaq üçün kifayət qədər çəki ilə təsdiqləyin və icranın çox imzalı hesabın vəziyyətindən yoxlandığını təsdiqləyin.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- `SIGNER_A`, `SIGNER_B` və `SIGNER_C` ünvanında üç tək protokol-standart I105 imzaçı ID-si.
- Kriptoqrafik imzalayıcılar A və C üçün Taira konfiqurasiyaları maliyyələşdirildi. Təklifçi və hər bir təsdiqləyici öz əməliyyatlarını ödəyir.
- CLI yazmaları `--fee-payer authority` istifadə edir; CLI imzalamadan əvvəl dəqiq haqqı Taira-nın ödəniş aktivində hesablayıb göstərir.
- Qeydiyyat addımı üçün `iroha` və `iroha_model_base` paketlərindən asılı olan və Taira ilə eyni Iroha mənbə kodu reviziyasına sabitlənmiş Rust müştəri layihəsi. Sonrakı təklif və təsdiq addımları CLI istifadə edir.
- Cari icraçının multisig xüsusiyyəti aktivdir. Qeydiyyat, standart Iroha 3 proqram icra mühitində adi hesablar üçün mümkündür, baxmayaraq ki, Taira siyasəti və ödəniş qəbul olunması hələ də tətbiq olunur; ictimai yerləşdirmə bunu rədd edirsə, localnet-dən istifadə edin.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Addımlar {#steps}

### 1. Çəkili siyasəti qeydiyyatdan keçirin {#_1-register-a-weighted-policy}

C imzalayanının çəkisi 2-dir; A və B-nin hər birinin çəkisi 1-dir. Buna görə də 3 kvorumu C ilə yanaşı ya A, ya da B tələb edir. Burada `registrar` `iroha::blocking::Client` obyektidir və onun `submit` metodu Applied yekunluğunu gözləyir. Qeydiyyatdan əvvəl kanonik hesabı məhz həmin siyasətdən çıxarın, sonra eyni dəyəri `MultisigRegister::with_account` metoduna ötürün:

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

CLI addımlar üçün çap edilmiş dəyəri yadda saxlayın:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

Sabitlənmiş mənbə kodu reviziyasında CLI qeydiyyat əmri proqram icra mühiti onun açarını dəyişməzdən əvvəl müvəqqəti seed dəyərini çap edir. Həmin seed dəyərindən kontroller kimi təkrar istifadə etməyin. Kontrollerin şəxsi açarı yoxdur: multisig səlahiyyəti yalnız təsdiqlənmiş təkliflərdən gəlir. Bunun əvəzinə CLI ilə qeydiyyat üçün siyasətdən çıxarılmış dəyəri `ledger multisig register --account` əmrinə ötürün.

### 2. Təsdiqləmədən bir təlimat hazırlayın {#_2-build-one-instruction-without-submitting-it}

Qlobal `--emit-instructions` açarı təlimat massivini təqdim etmək əvəzinə standart çıxışa çap edir, buna görə heç bir ödəniş haqqı xərclənmir.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Kriptoqrafik imzalayan kimi A təklif edin {#_3-propose-as-signer-a}

Təklif verən avtomatik olaraq öz çəkisini əlavə edir. Yeni təklif nonce dəyəri yaradın və onu istənilən təkrar cəhd üçün saxlayın. CLI tərəfindən çap olunan təklif ID-sini və təlimat heşini qeyd edin; təsdiqlər hər ikisinə bağlanır.

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

Hələ gözləmədə olan təklifi açıq sonlu seçici ilə siyahıya alın:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Kriptoqrafik imzalayan C kimi təsdiqləyin {#_4-approve-as-signer-c}

A-nın çəkisi 1 ilə C-nin çəkisi 2 çoğunluğu 3-ə çatır və təklif olunan əmri multisig hesabı kimi icra edir.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust müştərisi eyni, siyasətdən çıxarılmış hesab və yuxarıda istifadə olunan iki həyat dövrü təlimatı ilə davam edə bilər. Hər imzalayan müştəri `iroha::blocking::Client` obyektidir; təklif ID-si müştərinin şəbəkəsindən, multisig hesabından və yeni nonce dəyərindən çıxarılır:

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

## Yoxla {#verify}

Post-dövləti oxuyun və təklifin artıq gözləmədə olmadığını təsdiqləyin:

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

Metadata dəyəri `"approved"` olmalıdır, qeyd olunmuş təklif ID-si və təlimat heşi artıq gözləyən kimi görünməməlidir, yoxlanılan kontroller isə `threshold` `3`, `total_weight` `4` və üzvlərin 1, 1 və 2 çəkilərini göstərməlidir; üzvlər ictimai açarların sırası ilə sadalanır.

## Problemlərin aradan qaldırılması {#troubleshooting}

- `not qualified to propose multisig` və ya `not qualified to approve multisig` təklif verən və ya təsdiqləyən müştərinin siyasətdə qeydiyyatdan keçmiş I105 ID-lərindən heç birinə uyğun gəlmədiyini bildirir.
- Təklif olunan təlimatları icra etmək üçün çox imzalı hesab icazəyə malik olmadıqda son təsdiq rədd edilə bilər. Avtorizasiya əsasını yalnız onun fərdi kriptoqrafik imzalayanlarına deyil, çox imzalı hesaba verin, sonra isə qalan kriptoqrafik imzalayanın yenidən cəhd etməsinə icazə verin.
- Gözləyən təklifin olmaması kvorumun artıq əldə edildiyini, TTL müddətinin bitdiyini və ya səhv təklif ID-si, təlimat heşi ya da hesab seçicisinin istifadə edildiyini göstərə bilər. Yeni nonce ilə yenidən təklif verməzdən əvvəl sonrakı vəziyyəti sorğulayın.
- Təkrarlanan təsdiqlər çəkini artırmır. Hər qeydiyyatdan keçmiş imzaçi ən çox bir dəfə öz konfiqurasiya olunmuş çəkisini əlavə edir.
- Kontroller olaraq bir normal əməliyyatı birbaşa imzalamaq qadağandır. Həmişə `MultisigPropose` və `MultisigApprove`-dən istifadə edin.
- Əgər sonrakı əmrlər CLI qeydiyyatı zamanı çap olunan hesabı tapa bilməzsə, siz müvəqqəti toxumu tutmusunuz. Sifariş edilmiş siyasətdən tək protokol-standart hesabı çıxarın və yuxarıda göstərildiyi kimi həmin dəyər ilə qeydiyyatdan keçin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Sabitlənmiş mənbə kodu versiyasında multi-iktidar inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [Sabitlənmiş mənbə kodu versiyasında multisig məlumat modeli](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [CLI pinlənmiş mənbə kodu reviziyasında multisig tətbiqi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Əməliyyatlar](/az/blockchain/transactions.md)
- [İcazələr və rollar](./permissions-and-roles.md)
