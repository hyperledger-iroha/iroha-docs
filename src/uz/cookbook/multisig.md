---
translation_locale: uz
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Og‘irlikli ko‘p imzo {#weighted-multisig}

## Natija {#outcome}

Taira’da uch a’zoli og‘irlikli ko‘p imzoli hisobni ro‘yxatdan o‘tkazing, metama’lumot ko‘rsatmasini taklif qiling, uni kvorum uchun yetarli og‘irlik bilan tasdiqlang va bajarilganini ko‘p imzoli hisob holatidan tekshiring.

## Oldindan shartlar {#prerequisites}

- `SIGNER_A`, `SIGNER_B` va `SIGNER_C` o‘zgaruvchilarida uchta kanonik I105 imzolovchi identifikatori.
- A va C imzolovchilarining moliyalashtirilgan Taira sozlamalari. Taklifchi va har bir tasdiqlovchi o‘z tranzaksiyasi uchun to‘laydi.
- Joriy kran javobidan yaratilgan `taira.tx-metadata.json`; ko‘chirilgan to‘lov aktivi ID-sidan emas.
- Ro‘yxatdan o‘tkazish bosqichi uchun Taira bilan ayni Iroha commitiga mahkamlangan Rust mijoz loyihasi. Keyingi taklif va tasdiqlash bosqichlari CLI-dan foydalanadi.
- Ko‘p imzo imkoniyati yoqilgan joriy ijrochi. Taira siyosati va to‘lov qoidalari amal qilsa ham, standart Iroha 3 bajarish muhiti odatiy hisoblarni ro‘yxatdan o‘tkazishga imkon beradi; ommaviy joylashtirish rad etsa, mahalliy tarmoqdan foydalaning.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Qadamlar {#steps}

### 1. Og‘irlikli siyosatni ro‘yxatdan o‘tkazish {#_1-register-a-weighted-policy}

C imzolovchining og‘irligi 2, A va B ning har biri 1. Shu sabab 3 kvorumiga erishish uchun C bilan birga A yoki B dan biri kerak. Yuborishdan oldin aynan shu siyosatdan kanonik hisobni hosil qiling, so‘ng ayni qiymatni `MultisigRegister::with_account` ga bering:

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

Chiqarilgan qiymatni CLI bosqichlari uchun saqlang:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

Mahkamlangan commitda CLI ro‘yxatdan o‘tkazish buyrug‘i bajarish muhiti hisob kalitini almashtirishidan oldingi vaqtinchalik boshlang‘ich qiymatni chiqaradi. Uni boshqaruvchi sifatida qayta ishlatmang. Boshqaruvchining maxfiy kaliti mavjud emas: ko‘p imzoli vakolat faqat tasdiqlangan takliflardan keladi.

### 2. Yubormasdan bitta ko‘rsatma tuzish {#_2-build-one-instruction-without-submitting-it}

Global `-o` parametri ko‘rsatmalar massivini standart chiqishga ketma-ketlashtiradi. U tranzaksiyani yubormaydi, shu sabab to‘lov sarflamaydi.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. A imzolovchi sifatida taklif qilish {#_3-propose-as-signer-a}

Taklifchi o‘z og‘irligini avtomatik qo‘shadi. CLI chiqargan aniq ko‘rsatmalar xeshini yozib oling; tasdiqlar shu xeshga bog‘lanadi.

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

Aniq doiradagi tanlovchi bilan kutilayotgan taklifni ro‘yxatlang:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. C imzolovchi sifatida tasdiqlash {#_4-approve-as-signer-c}

A ning 1 va C ning 2 og‘irligi 3 kvorumiga yetadi hamda taklif qilingan ko‘rsatmani ko‘p imzoli hisob nomidan bajaradi.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust mijozi siyosatdan hosil qilingan o‘sha hisob va yuqorida ishlatilgan ikkita hayotiy sikl ko‘rsatmasi bilan davom etishi mumkin:

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

## Tekshirish {#verify}

Amaldan keyingi holatni o‘qing va taklif endi kutilayotganlar qatorida emasligini tasdiqlang:

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

Metama’lumot qiymati `"approved"` bo‘lishi, yozib olingan ko‘rsatma xeshi endi kutilayotganlar qatorida ko‘rinmasligi va tekshirilgan boshqaruvchi `3` kvorumi bilan `1, 1, 2` og‘irliklarini ko‘rsatishi kerak.

## Muammolarni bartaraf etish {#troubleshooting}

- `signatory is not part of multisig` taklif qiluvchi yoki tasdiqlovchi mijoz siyosatda ro‘yxatga olingan I105 identifikatorlaridan biriga mos kelmasligini anglatadi.
- Ko‘p imzoli hisobda taklif qilingan ko‘rsatmalarni bajarish vakolati bo‘lmasa, so‘nggi tasdiq rad etilishi mumkin. Vakolatni alohida imzolovchilargagina emas, ko‘p imzoli hisobning o‘ziga bering, so‘ng qolgan imzolovchilardan biri qayta urinib ko‘rsin.
- Kutilayotgan taklif topilmasa, kvorumga allaqachon erishilgan, TTL muddati tugagan yoki noto‘g‘ri ko‘rsatma xeshi yoxud hisob tanlagichi ishlatilgan bo‘lishi mumkin. Qayta taklif yuborishdan oldin amaldan keyingi holatni so‘rang.
- Takroriy tasdiqlar og‘irlik qo‘shmaydi. Har bir ro‘yxatdan o‘tgan imzolovchi sozlangan og‘irligini ko‘pi bilan bir marta qo‘shadi.
- Oddiy tranzaksiyani boshqaruvchi sifatida to‘g‘ridan-to‘g‘ri imzolash taqiqlanadi. Har doim `MultisigPropose` va `MultisigApprove` dan foydalaning.
- Keyingi buyruqlar CLI ro‘yxatdan o‘tkazish paytida chiqargan hisobni topa olmasa, vaqtinchalik boshlang‘ich qiymatni yozib olgansiz. Kanonik hisobni tartiblangan siyosatdan hosil qiling va yuqorida ko‘rsatilganidek shu qiymat bilan ro‘yxatdan o‘tkazing.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Mahkamlangan commitdagi ko‘p imzo integratsiya sinovlari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Mahkamlangan commitdagi ko‘p imzo ma’lumotlar modeli](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [Mahkamlangan commitdagi CLI ko‘p imzo amalga oshirishi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Tranzaksiyalar](/uz/blockchain/transactions.md)
- [Ruxsatlar va rollar](./permissions-and-roles.md)
