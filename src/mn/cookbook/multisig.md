---
translation_locale: mn
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Жингийн Нэмэлт Гарын Үсэг {#weighted-multisig}

## Үр дүн {#outcome}

Taira-нд гурван гишүүнтэй жингийн олон гарын үсэгтэй данс бүртгүүлж, metadata зааврыг санал болгож, кворумд хүрэх хангалттай жингээр баталгаажуулж, олон гарын үсэгтэй дансны төлөвөөс гүйцэтгэлийг шалгаарай.

## Өмнөх шаардлага {#prerequisites}

- Гурван нэг протокол-стандарт I105 гарын үсгийн ID нь `SIGNER_A`, `SIGNER_B`, болон `SIGNER_C` байна.
- Криптографийн гарын үсгийн A болон C-д зориулсан санхүүжүүлсэн Taira тохиргоонууд. Санал гаргагч болон бүх зөвшөөрөгч өөрийн гүйлгээг төлнө.
- `taira.tx-metadata.json` нь одоогийн тестнетийн санхүүжилтийн үйлчилгээний хариунаас бүрдсэн бөгөөд хэзээ ч хуулбарласан шимтгэлийн активын ID-аас бүтээгдээгүй.
- Бүртгэлийн алхамд Taira програмтай ижил Iroha эх хувилбар руу бэхлэгдсэн Rust хэрэглэгчийн төсөл. Дараагийн саналыг гаргах болон батлах алхмууд CLI-ыг ашиглана.
- Одоогийн гүйцэтгэгчийн олон гарын гарын үсгийн функц идэвхжлээ. Бүртгэл нь энгийн дансуудад анхдагч Iroha 3 програм хангамжийн гүйцэтгэлийн орчинд боломжтой боловч Taira бодлого болон төлбөрийн зөвшөөрөл хэвээр хүчинтэй; олон нийтэд зориулсан байрлал үүнийг хориглосон тохиолдолд localnet-г ашигла.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Алхамууд {#steps}

### 1. Жинтэй бодлогыг бүртгүүлэх {#_1-register-a-weighted-policy}

криптографийн гарын үсэг зурах C нь 2 жинтэй; A ба B нь тус бүр 1 жинтэй. Иймээс 3 хүний дэмжлэг шаардлагатай бол C болон A эсвэл B шаардлагатай. Бүртгэлээс өмнө яг үүнтэй ижил бодлогыг үндэслэн протоколын стандарт дансыг гаргаж, дараа нь ижил утгыг `MultisigRegister::with_account` руу дамжуул:

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

CLI алхмуудын хувьд хэвлэгдсэн утгыг хадгална уу:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

Тогтсоноор тэмдэглэгдсэн эх кодын өөрчлөлт дээр, CLI бүртгэлийн команд нь программын гүйцэтгэлийн орчинг дахин түлхүүрлэхээс өмнө түр бууранд зориулсан үрийг хэвлэж үзүүлнэ. Тэр үрийг контроллер болгон дахин ашиглах ёсгүй. Контроллерийн хувийн түлхүүр байхгүй: олон гарын зөвшөөрлийн эрх зөвшөөрөгдсөн саналуудаас л гардаг.

### 2. Үүнийг илгээнгүйгээр нэг заавар үүсгэ {#_2-build-one-instruction-without-submitting-it}

Дэлхийн `-o` унтраалга зааврын массивыг стандарт гаралт руу дараалалтай гаргадаг. Энэ нь гүйлгээ хийдэггүй учраас ямар ч төлбөр зарцуулдаггүй.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Криптографийн гарын үсэг зурагчаар A-г санал болгох {#_3-propose-as-signer-a}

Санал болгогч автоматаар өөрийн жингээ хандивладаг. CLI-д хэвлэгдсэн яг зааврын криптографийн хэшийг барьж ав. Зөвшөөрлүүд түүнийг криптографийн хэшэд холбодог.

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
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust хэрэглэгч дээр дурдсан хоёр амьдралын мөчлөгийн заавар болон бодлогын дагуу үүсгэсэн дансаа ашиглан үргэлжлүүлэн ажиллаж болно:

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

## Баталгаажуулах {#verify}

Төрийн дараах төлөвийг уншиж, санал өнгөрөөөгүй байгаа эсэхийг баталгаажуулна уу:

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

Мета өгөгдлийн утга нь `"approved"` байх ёстой, барьж авсан зааврын криптографийн хэш хүлээгдэж буй байдлаар дахиж гарч ирж болохгүй, шалгагдсан контроллер нь `1, 1, 2` жин болон `3` олонхийн эрхийг үзүүлэх ёстой.

## Алдааг олох болон засах {#troubleshooting}

- `signatory is not part of multisig` нь санал оруулж эсвэл зөвшөөрч буй клиент бодлогод бүртгэсэн I105 ID-уудын алинд ч тохирохгүй гэсэн үг.
- Эцсийн зөвшөөрлийг олон гарын үсгийн данс санал болгосон зааврыг хэрэгжүүлэх зөвшөөрөлгүй бол татгалзаж болно. Олон гарын үсгийн дансанд зөвшөөрлийн үндэслэлийг олго, зөвхөн түүний хувь тус бүрийн криптографийн гарын үсэг зурдагчдад бус, дараа нь үлдсэн криптографийн гарын үсэг зурдагчид дахин оролдохыг зөвшөөр.
- Алга болсон хүлээгдэж буй санал нь ирц аль хэдийн хангагдсан, TTL хугацаа дууссан эсвэл буруу зааварчилгааны хэш/дансны сонгогчийг ашигласан байж болно. Дахиж санал оруулахаас өмнө дараах төлөвт лавлана уу.
- Нөхөн давтах зөвшөөрөл нь жин нэмдэггүй. Бүртгэлтэй гарын үсэг зурсан хүн бүр зөвхөн нэг удаа тохируулагдсан жингээ нэмдэг.
- Контроллероор энгийн гүйлгээг шууд гарын үсэг зурах хориотой. Үргэлж `MultisigPropose` ба `MultisigApprove`-ийг ашиглана уу.
- Хэрэв дараах тушаалууд CLI бүртгэлийн үеэр хэвлэгдсэн дансыг олж чадахгүй байвал та түр зуурын үрсэлгээг олсон байна. Захиалсан бодлогын дагуу ганц протокол стандартад нийцсэн дансыг гаргаж, дээр үзүүлсэн утгаар бүртгэнэ үү.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Бүртгэлтэй эх кодын хувилбарт олон гарын үсгийн интеграцийн тестүүд](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Нэмэлт гарын үсгийн өгөгдлийн загвар нь тогтсон эх кодын хувилбар дээр](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI бэхлэгдсэн эх кодын хувилбарт олон гарын гарын үсгийн хэрэгжилт](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Гүйлгээ](/mn/blockchain/transactions.md)
- [Зөвшөөрөл болон үүрэг](./permissions-and-roles.md)
