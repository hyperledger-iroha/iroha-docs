---
translation_locale: az
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Çəkili Çoxsaylı İmza {#weighted-multisig}

## Nəticə {#outcome}

Taira üzərində üç üzvü olan ağırlıqlı çox imzalı hesab yaradın, bir metadata təlimatı təklif edin, kvorum tələbinə çatmaq üçün kifayət qədər çəki ilə təsdiqləyin və icranın çox imzalı hesabın vəziyyətindən yoxlandığını təsdiqləyin.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- `SIGNER_A`, `SIGNER_B` və `SIGNER_C` ünvanında üç tək protokol-standart I105 imzaçı ID-si.
- Kriptoqrafik imzalayıcılar A və C üçün Taira konfiqurasiyaları maliyyələşdirildi. Təklifçi və hər bir təsdiqləyici öz əməliyyatlarını ödəyir.
- `taira.tx-metadata.json` cari testnet maliyyələşdirmə xidməti cavabından yaradılıb, heç vaxt kopyalanmış ödəniş aktiv ID-dən yaradılmayıb.
- Rust müştəri layihəsi qeydiyyat mərhələsi üçün Taira ilə eyni Iroha mənbə revizyonuna bağlanıb. Sonrakı təklif və təsdiq mərhələləri CLI-dən istifadə edir.
- Cari icraçının multisig xüsusiyyəti aktivdir. Qeydiyyat, standart Iroha 3 proqram icra mühitində adi hesablar üçün mümkündür, baxmayaraq ki, Taira siyasəti və ödəniş qəbul olunması hələ də tətbiq olunur; ictimai yerləşdirmə bunu rədd edirsə, localnet-dən istifadə edin.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Addımlar {#steps}

### 1. Çəkili siyasəti qeydiyyatdan keçirin {#_1-register-a-weighted-policy}

kriptoloji imzalayan C-in çəkisi 2-dir; A və B-nin hər birinin çəkisi 1-dir. Beləliklə, 3-lük kvorum C ilə birlikdə ya A, ya da B tələb edir. Qeydiyyatdan əvvəl həmin dəqiq siyasətdən tək protokol-standart hesabı çıxarın, sonra eyni dəyəri `MultisigRegister::with_account`-a ötürün:

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

CLI addımlar üçün çap edilmiş dəyəri yadda saxlayın:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

Quraşdırılmış mənbə kodu versiyasında, CLI qeydiyyat əmri proqramın icra mühitində onu yenidən açmadan əvvəl müvəqqəti toxumunu çap edir. Həmin toxumu kontroller kimi təkrar istifadə etməyin. Kontroller üçün xüsusi açar yoxdur: multisig səlahiyyət əsasən yalnız təsdiqlənmiş təkliflərdən gəlir.

### 2. Təsdiqləmədən bir təlimat hazırlayın {#_2-build-one-instruction-without-submitting-it}

Qlobal `-o` keçid təlimat massivini standart çıxışa seriallaşdırır. Bu, əməliyyat təqdim etmir və buna görə də heç bir rüsum xərcləmir.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Kriptoqrafik imzalayan kimi A təklif edin {#_3-propose-as-signer-a}

Təklifçi avtomatik olaraq öz ağırlığını əlavə edir. CLI tərəfindən çap olunan dəqiq təlimat kriptoqrafik xəşini tutun; təsdiqlər həmin kriptoqrafik xəşinə bağlanır.

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
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust müştəri eyni siyasətdən yaranan hesab və yuxarıda istifadə olunan iki həyat dövrü təlimatı ilə davam edə bilər:

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

## Yoxla {#verify}

Post-dövləti oxuyun və təklifin artıq gözləmədə olmadığını təsdiqləyin:

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

Metadatanın dəyəri `"approved"` olmalıdır, tutulan təlimatın kriptoqrafik xəşi artıq gözləmədə görünməməlidir və yoxlanılmış kontroller çəkiləri `1, 1, 2` və kvorumu `3` göstərməlidir.

## Problemlərin aradan qaldırılması {#troubleshooting}

- `signatory is not part of multisig` təklif edən və ya təsdiq edən müştərinin siyasətdə qeydiyyatdan keçmiş I105 identifikatorlarından biri ilə uyğun gəlmədiyini bildirir.
- Təklif olunan təlimatları icra etmək üçün çox imzalı hesab icazəyə malik olmadıqda son təsdiq rədd edilə bilər. Avtorizasiya əsasını yalnız onun fərdi kriptoqrafik imzalayanlarına deyil, çox imzalı hesaba verin, sonra isə qalan kriptoqrafik imzalayanın yenidən cəhd etməsinə icazə verin.
- İtkin gözləyən təklif, kvorumun artıq çatdığı, TTL müddətinin bitdiyi və ya səhv təlimat hash/hesab seçicisinin istifadə edildiyi mənasını verə bilər. Yenidən təklif verməzdən əvvəl son vəziyyəti sorğulayın.
- Təkrarlanan təsdiqlər çəkini artırmır. Hər qeydiyyatdan keçmiş imzaçi ən çox bir dəfə öz konfiqurasiya olunmuş çəkisini əlavə edir.
- Kontroller olaraq bir normal əməliyyatı birbaşa imzalamaq qadağandır. Həmişə `MultisigPropose` və `MultisigApprove`-dən istifadə edin.
- Əgər sonrakı əmrlər CLI qeydiyyatı zamanı çap olunan hesabı tapa bilməzsə, siz müvəqqəti toxumu tutmusunuz. Sifariş edilmiş siyasətdən tək protokol-standart hesabı çıxarın və yuxarıda göstərildiyi kimi həmin dəyər ilə qeydiyyatdan keçin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Sabitlənmiş mənbə kodu versiyasında multi-iktidar inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Sabitlənmiş mənbə kodu versiyasında multisig məlumat modeli](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI pinlənmiş mənbə kodu reviziyasında multisig tətbiqi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Əməliyyatlar](/az/blockchain/transactions.md)
- [İcazələr və rollar](./permissions-and-roles.md)
