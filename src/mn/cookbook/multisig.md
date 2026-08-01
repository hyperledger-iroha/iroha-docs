---
translation_locale: mn
translation_source: /cookbook/multisig.md
translation_source_hash: 7090228c4fea7321c93fe0d2c67ef6de842de95bc3befa11d83c12b9f15b4752
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Урьдчилсан Multisig {#weighted-multisig}

## Үр дүн {#outcome}

Taira дээр гурван гишүүний жинтэй олон талын дансны сүлжээ бүртгүүлж, метадэтгэлийн заавар санал болгож, кворумтай хангахад хангалттай жинтэй баталж, олон талын сүлжээний сүлжээг гүйцэтгэх байдлыг шалгаж үзнэ.

## Урьдчилсан шаардлага {#prerequisites}

- Үдээс гурав нь I105 гарын үсэг зурагч IDs цаашид `SIGNER_A`, `SIGNER_B`, болон `SIGNER_C`.
- A, C гарын үсэг зурагчдад Taira санхүүжүүлсэн конфигурацыуд. Сурталчилгаа гаргагч болон зөвшөөрөгч бүр өөрийн гүйлгээний төлбөрийг төлдөг.
- `taira.tx-metadata.json` нь өнөөгийн цахилгаан замын хариугаас баригдсан бөгөөд хэзээ ч ID төлбөрийн хөрөнгийг хуулбарлан гаргасангүй.
- А Rust харилцагчийн төсөл нь ижил Iroha эх үүсвэрийн шинэчлэл Taira бүртгэлийн алхам. Дараагийн санал, батлалын алхам нь CLI .
- Одоогийн гүйцэтгэгчийн олон тамгын хувилбар идэвхтэй байна. Iroha 3 мөрийн цагаар энгийн дансанд бүртгэл хийх боломжтой, гэхдээ Taira бодлого болон төлбөрийг хүлээн зөвшөөрөх нь одоо ч хэрэглэдэг; олон нийтийн нэвтрүүлэг үүнийг эсэргүүцвэл lokalnet-ийг ашиглана.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Хадгалт {#steps}

### 1.Тэмцэт бодлого бүртгүүлэх {#_1-register-a-weighted-policy}

C-ийн тэмдэг нь 2 жинтэй, A болон B нь тус бүр 1 жинтэй. 3 -ийн кворумтай тул C + A эсвэл B-ийг шаарддаг. Тухайн тодорхой бодлогыг бүртгүүлэхээс өмнө санхүүгийн тооцоог гаргаж, дараа нь ижил үнэ цэнийг `MultisigRegister::with_account` руу шилжүүлнэ:

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

CLI алхамд зориулсан хэвлэгдсэн үнэлгээ хадгалах:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

CLI бүртгэлийн команд нь түр хугацааны үр тариаланг гүйцэтгэх цагийн шинэчлэлээс өмнө хэвлэнэ. Энэ үр тариалыг хяналтын хэрэглэгчээр дахин ашиглахгүй байна. Хяналтын ажилтны хувийн ач холбогдол байхгүй: олон талт эрх мэдэл зөвхөн батлагдсан саналуудаас ирдэг.

### 2. Судалгааг өгөөгүйгээр нэг тушаалыг боловсруулах {#_2-build-one-instruction-without-submitting-it}

Глобал `-o` шилжүүлэгч нь заалын массивийг стандарт үр дүнгээр цугладаг. Энэ нь гүйлгээг өргөн мэдүүлдэггүй тул ямар ч төлбөр зарцуулдаггүй.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. А-ыг гарын үсэг зурахаар санал болголоо {#_3-propose-as-signer-a}

Хууль дэвшүүлэгч нь өөрөө өөрийн гэсэн жин нэмэх болно. CLI нь хэвлэсэн зөвлөмж хэшиг олж аваарай; зөвшөөрөл тухайн хэшэд холбогдсон.

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

Одоо ч хэвээр байгаа саналыг тодорхой төгс сонгогчтай жагсаалж өгөөч:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Дахилгач C-ээр батлагдана {#_4-approve-as-signer-c}

A-ийн жин 1 болон C-ийн жин 2 нь 3-д хүрч, санал болгож буй заалыг олон тамгын тэмдэгтээр гүйцэтгэдэг.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust үйлчлүүлэгч нь мөн адил бодлогын дэргэдэх бүртгэлтэй болон дээрх хоёр амьдралын мөрийн заавар хэрэглэж болно:

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

## Бүртгэнэ {#verify}

Дараах мэдээг уншина уу, саналыг цаашид хэвээргүй гэдгийг батлаарай:

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

Metadata-ын үнэ нь `"approved"` байх ёстой, авагдсан заалын хэшиг цаашид хүлээлттэй харагдахгүй байх ёстой, шалгалт хийсэн хяналтын ажилтан `1, 1, 2` -ийн жинүүдийг `3` -тэй хамт үзүүлнэ.

## Ашигтвортой байдлын асуудал {#troubleshooting}

- `signatory is not part of multisig` нь санал болгож буй эсвэл батлах үйлчлүүлэгч нь бодлогын бүртгэлд бүртгэгдсэн I105 IDs нэгтэй тэнцэхгүй гэсэн үг юм.
- Multisig-ийн дансанд санал болгож буй даалгаврыг гүйцэтгэх зөвшөөрөл байхгүй бол эцсийн зөвшөөрлийг татгалзах боломжтой. Зөвхөн хувь хүний гарын үсэг зурагчдад бус, олон тамгын бүртгэлд эрх мэдэл олгож, үлдсэн гарын үсгийн нэгнийг дахин туршиж үзээрэй.
- Хөдөлгөөнд байгаа санал байхгүй бол аль хэдийн хуралдаанд хүрсэн гэсэн үг болно. TTL дууссан, эсвэл буруу заавар хэш/хуультын сонгогч ашигласан. Цаашид эрхийг хүсэхээс өмнө төрийн захиргаанаас асуу.
- Хоёр удаагийн батламж нь жин нэмэхгүй бөгөөд бүртгэлтэй гарын үсэг зурагч бүр хамгийн ихдээ нэг удаа хэлбэлзсэн жингээ оруулж байна.
- Хөдөлмөрийн зохицуулагчийн хувьд хэвийн гүйлгээний шууд гарын үсэг зурахыг хориглоно. үргэлж `MultisigPropose` болон `MultisigApprove` ашиглана.
- Хэрэв дараагийн команд CLI бүртгэлийн үеэр хэвлэгдсэн дансыг олж чадахгүй бол та түр хугацааны үр тариаланг эзэмшсэн байна. Захиалсан бодлогын санхүүгийн дансыг гаргаж, дээрх үзүүлэлтийн дагуу энэ үнээр бүртгүүлнэ.

## Эх сурвалж, холбогдох баримт бичгүүд {#source-and-related-docs}

- [Пинклэгдсэн commit-д олон талт интеграцийн туршилтууд](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/multisig.rs)
- [Multisig өгөгдлийн загвар нь pinned commit ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI гүнзгийрсэн үүрэг гүйцэтгэхэд олон талт хэрэглээ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Арилжаа](/mn/blockchain/transactions.md)
- [Тусгай зөвшөөрөл, үүрэг ](./permissions-and-roles.md)
