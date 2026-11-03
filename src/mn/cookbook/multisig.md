---
translation_locale: mn
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Жингийн Нэмэлт Гарын Үсэг {#weighted-multisig}

## Үр дүн {#outcome}

Taira-нд гурван гишүүнтэй жингийн олон гарын үсэгтэй данс бүртгүүлж, metadata зааврыг санал болгож, кворумд хүрэх хангалттай жингээр баталгаажуулж, олон гарын үсэгтэй дансны төлөвөөс гүйцэтгэлийг шалгаарай.

## Өмнөх шаардлага {#prerequisites}

- Гурван нэг протокол-стандарт I105 гарын үсгийн ID нь `SIGNER_A`, `SIGNER_B`, болон `SIGNER_C` байна.
- Криптографийн гарын үсгийн A болон C-д зориулсан санхүүжүүлсэн Taira тохиргоонууд. Санал гаргагч болон бүх зөвшөөрөгч өөрийн гүйлгээг төлнө.
- CLI-ийн бичих үйлдлүүд `--fee-payer authority`-г ашигладаг; CLI нь гарын үсэг зурахаас өмнө яг төлбөрийг Taira-ийн төлбөрийн хөрөнгөөр тооцоолж, үнийн санал гаргадаг.
- Бүртгэлийн алхамд зориулсан, `iroha` болон `iroha_model_base`-ээс хамаардаг, Taira-тай ижил Iroha эх кодын хувилбарт бэхэлсэн Rust клиент төсөл. Дараагийн санал гаргах болон батлах алхмууд CLI-г ашиглана.
- Одоогийн гүйцэтгэгчийн олон гарын гарын үсгийн функц идэвхжлээ. Бүртгэл нь энгийн дансуудад анхдагч Iroha 3 програм хангамжийн гүйцэтгэлийн орчинд боломжтой боловч Taira бодлого болон төлбөрийн зөвшөөрөл хэвээр хүчинтэй; олон нийтэд зориулсан байрлал үүнийг хориглосон тохиолдолд localnet-г ашигла.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Алхамууд {#steps}

### 1. Жинтэй бодлогыг бүртгүүлэх {#_1-register-a-weighted-policy}

C гарын үсэг зурагч 2 жинтэй; A болон B тус бүр 1 жинтэй. Тиймээс 3-ын кворумд C болон A, B-ийн аль нэг нь шаардлагатай. Энд `registrar` нь `iroha::blocking::Client` бөгөөд түүний `submit` нь Applied эцсийн байдлыг хүлээдэг. Бүртгэхээс өмнө яг тэр бодлогоос каноник дансыг гаргаж аваад, ижил утгыг `MultisigRegister::with_account`-д дамжуул:

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

CLI алхмуудын хувьд хэвлэгдсэн утгыг хадгална уу:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

Тогтоосон commit дээр CLI-ийн бүртгэлийн команд нь түр зуурын seed-ээ гүйцэтгэх орчин түүнийг шинэ түлхүүрээр солихоос өмнө хэвлэдэг. Тэр seed-ийг контроллер болгон дахин бүү ашигла. Контроллерийн хувийн түлхүүр байхгүй: multisig эрх мэдэл зөвхөн батлагдсан саналуудаас үүсдэг. Үүний оронд CLI-ээс бүртгэх бол бодлогоос гаргасан утгыг `ledger multisig register --account`-д дамжуул.

### 2. Үүнийг илгээнгүйгээр нэг заавар үүсгэ {#_2-build-one-instruction-without-submitting-it}

Глобал `--emit-instructions` сонголт нь зааврын массивыг илгээхийн оронд стандарт гаралт руу хэвлэдэг тул ямар ч төлбөр зарцуулдаггүй.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Криптографийн гарын үсэг зурагчаар A-г санал болгох {#_3-propose-as-signer-a}

Санал гаргагч өөрийн жинг автоматаар нэмдэг. Шинэ саналын nonce үүсгээд, аливаа дахин оролдлогод зориулж хадгал. CLI-ийн хэвлэсэн саналын ID болон зааврын хэшийг тэмдэглэж ав; батламжууд хоёуланд нь холбогддог.

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

Тодорхой төгсгөлтэй сонгогчтой хүлээгдэж буй санал хүсэлтийг жагсаа:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Криптографийн гарын үсэг зурагч C-г баталгаажуулах {#_4-approve-as-signer-c}

A-н жин 1 ба C-н жин 2 нь 3-ын кворумд хүрч, олон гарын данс байдлаар санал болгосон зааврыг гүйцэтгэнэ.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust клиент ижил бодлогоос гаргасан данс болон дээр ашигласан амьдралын мөчлөгийн хоёр зааврыг ашиглан үргэлжлүүлж болно. Гарын үсэг зурагч клиент бүр `iroha::blocking::Client` байна; саналын ID-г клиентийн сүлжээ, multisig данс болон шинэ nonce-оос гаргадаг:

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

## Баталгаажуулах {#verify}

Төрийн дараах төлөвийг уншиж, санал өнгөрөөөгүй байгаа эсэхийг баталгаажуулна уу:

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

Метадатын утга `"approved"` байх ёстой, тэмдэглэж авсан саналын ID болон зааврын хэш хүлээгдэж буй байдлаар дахин гарч ирэх ёсгүй, мөн шалгасан контроллер `threshold` `3`, `total_weight` `4` болон гишүүдийн 1, 1, 2 жинг харуулах ёстой; гишүүд нийтийн түлхүүрийн дарааллаар жагсаагдана.

## Алдааг олох болон засах {#troubleshooting}

- `not qualified to propose multisig` эсвэл `not qualified to approve multisig` нь санал гаргаж буй эсвэл баталж буй клиент бодлогод бүртгэгдсэн I105 ID-уудын аль нэгтэй нь тохирохгүй байна гэсэн үг.
- Эцсийн зөвшөөрлийг олон гарын үсгийн данс санал болгосон зааврыг хэрэгжүүлэх зөвшөөрөлгүй бол татгалзаж болно. Олон гарын үсгийн дансанд зөвшөөрлийн үндэслэлийг олго, зөвхөн түүний хувь тус бүрийн криптографийн гарын үсэг зурдагчдад бус, дараа нь үлдсэн криптографийн гарын үсэг зурдагчид дахин оролдохыг зөвшөөр.
- Хүлээгдэж буй санал олдохгүй байвал кворум аль хэдийн хангагдсан, TTL хугацаа дууссан, эсвэл буруу саналын ID, зааврын хэш, дансны сонгогч ашигласан байж болно. Шинэ nonce-оор дахин санал гаргахаасаа өмнө үйлдлийн дараах төлөвийг асуулгаар шалга.
- Нөхөн давтах зөвшөөрөл нь жин нэмдэггүй. Бүртгэлтэй гарын үсэг зурсан хүн бүр зөвхөн нэг удаа тохируулагдсан жингээ нэмдэг.
- Контроллероор энгийн гүйлгээг шууд гарын үсэг зурах хориотой. Үргэлж `MultisigPropose` ба `MultisigApprove`-ийг ашиглана уу.
- Хэрэв дараах тушаалууд CLI бүртгэлийн үеэр хэвлэгдсэн дансыг олж чадахгүй байвал та түр зуурын үрсэлгээг олсон байна. Захиалсан бодлогын дагуу ганц протокол стандартад нийцсэн дансыг гаргаж, дээр үзүүлсэн утгаар бүртгэнэ үү.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Бүртгэлтэй эх кодын хувилбарт олон гарын үсгийн интеграцийн тестүүд](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [Нэмэлт гарын үсгийн өгөгдлийн загвар нь тогтсон эх кодын хувилбар дээр](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [CLI бэхлэгдсэн эх кодын хувилбарт олон гарын гарын үсгийн хэрэгжилт](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Гүйлгээ](/mn/blockchain/transactions.md)
- [Зөвшөөрөл болон үүрэг](./permissions-and-roles.md)
