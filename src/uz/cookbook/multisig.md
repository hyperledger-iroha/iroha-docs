---
translation_locale: uz
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Og‘irlikli ko‘p imzo {#weighted-multisig}

## Natija {#outcome}

Taira’da uch a’zoli og‘irlikli ko‘p imzoli hisobni ro‘yxatdan o‘tkazing, metama’lumot ko‘rsatmasini taklif qiling, uni kvorum uchun yetarli og‘irlik bilan tasdiqlang va bajarilganini ko‘p imzoli hisob holatidan tekshiring.

## Oldindan shartlar {#prerequisites}

- `SIGNER_A`, `SIGNER_B` va `SIGNER_C` o‘zgaruvchilarida uchta kanonik I105 imzolovchi identifikatori.
- A va C imzolovchilarining moliyalashtirilgan Taira sozlamalari. Taklifchi va har bir tasdiqlovchi o‘z tranzaksiyasi uchun to‘laydi.
- CLI yozish amallari `--fee-payer authority` dan foydalanadi; CLI imzolashdan oldin Taira to‘lov aktividagi aniq to‘lov narxini oladi.
- Ro‘yxatdan o‘tkazish bosqichi uchun `iroha` va `iroha_model_base` ga bog‘liq, Taira bilan ayni Iroha commitiga mahkamlangan Rust mijoz loyihasi. Keyingi taklif va tasdiqlash bosqichlari CLI-dan foydalanadi.
- Ko‘p imzo imkoniyati yoqilgan joriy ijrochi. Taira siyosati va to‘lov qoidalari amal qilsa ham, standart Iroha 3 bajarish muhiti odatiy hisoblarni ro‘yxatdan o‘tkazishga imkon beradi; ommaviy joylashtirish rad etsa, mahalliy tarmoqdan foydalaning.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Qadamlar {#steps}

### 1. Og‘irlikli siyosatni ro‘yxatdan o‘tkazish {#_1-register-a-weighted-policy}

C imzolovchining og‘irligi 2, A va B ning har biri 1. Shu sabab 3 kvorumiga erishish uchun C bilan birga A yoki B dan biri kerak. Bu yerda `registrar` — `iroha::blocking::Client`, uning `submit` metodi `Applied` yakuniy holatini kutadi. Ro‘yxatdan o‘tkazishdan oldin aynan shu siyosatdan kanonik hisobni hosil qiling, so‘ng ayni qiymatni `MultisigRegister::with_account` ga bering:

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

Chiqarilgan qiymatni CLI bosqichlari uchun saqlang:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

Mahkamlangan commitda CLI ro‘yxatdan o‘tkazish buyrug‘i bajarish muhiti hisob kalitini almashtirishidan oldingi vaqtinchalik boshlang‘ich qiymatni chiqaradi. Uni boshqaruvchi sifatida qayta ishlatmang. Boshqaruvchining maxfiy kaliti mavjud emas: ko‘p imzoli vakolat faqat tasdiqlangan takliflardan keladi. Buning o‘rniga CLI orqali ro‘yxatdan o‘tkazish uchun siyosatdan hosil qilingan qiymatni `ledger multisig register --account` ga bering.

### 2. Yubormasdan bitta ko‘rsatma tuzish {#_2-build-one-instruction-without-submitting-it}

Global `--emit-instructions` parametri ko‘rsatmalar massivini yuborish o‘rniga standart chiqishga yozadi, shu sabab to‘lov sarflamaydi.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. A imzolovchi sifatida taklif qilish {#_3-propose-as-signer-a}

Taklifchi o‘z og‘irligini avtomatik qo‘shadi. Yangi taklif nonce qiymatini yarating va uni har qanday qayta urinish uchun saqlab qo‘ying. CLI chiqargan taklif ID-si va ko‘rsatmalar xeshini yozib oling; tasdiqlar ikkalasiga ham bog‘lanadi.

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
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust mijozi siyosatdan hosil qilingan o‘sha hisob va yuqorida ishlatilgan ikkita hayotiy sikl ko‘rsatmasi bilan davom etishi mumkin. Har bir imzolovchi mijozi — `iroha::blocking::Client`; taklif ID-si mijozning tarmog‘i, ko‘p imzoli hisob va yangi nonce qiymatidan hosil qilinadi:

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

## Tekshirish {#verify}

Amaldan keyingi holatni o‘qing va taklif endi kutilayotganlar qatorida emasligini tasdiqlang:

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

Metama’lumot qiymati `"approved"` bo‘lishi, yozib olingan taklif ID-si va ko‘rsatma xeshi endi kutilayotganlar qatorida ko‘rinmasligi, tekshirilgan boshqaruvchi esa `threshold` `3`, `total_weight` `4` va a’zolarning 1, 1 hamda 2 og‘irliklarini ko‘rsatishi kerak; a’zolar ochiq kalitlar tartibida sanab o‘tiladi.

## Muammolarni bartaraf etish {#troubleshooting}

- `not qualified to propose multisig` yoki `not qualified to approve multisig` taklif qiluvchi yoki tasdiqlovchi mijoz siyosatda ro‘yxatga olingan I105 identifikatorlaridan biriga mos kelmasligini anglatadi.
- Ko‘p imzoli hisobda taklif qilingan ko‘rsatmalarni bajarish vakolati bo‘lmasa, so‘nggi tasdiq rad etilishi mumkin. Vakolatni alohida imzolovchilargagina emas, ko‘p imzoli hisobning o‘ziga bering, so‘ng qolgan imzolovchilardan biri qayta urinib ko‘rsin.
- Kutilayotgan taklif topilmasa, kvorumga allaqachon erishilgan, TTL muddati tugagan yoki noto‘g‘ri taklif ID-si, ko‘rsatma xeshi yoxud hisob tanlagichi ishlatilgan bo‘lishi mumkin. Yangi nonce bilan qayta taklif yuborishdan oldin amaldan keyingi holatni so‘rang.
- Takroriy tasdiqlar og‘irlik qo‘shmaydi. Har bir ro‘yxatdan o‘tgan imzolovchi sozlangan og‘irligini ko‘pi bilan bir marta qo‘shadi.
- Oddiy tranzaksiyani boshqaruvchi sifatida to‘g‘ridan-to‘g‘ri imzolash taqiqlanadi. Har doim `MultisigPropose` va `MultisigApprove` dan foydalaning.
- Keyingi buyruqlar CLI ro‘yxatdan o‘tkazish paytida chiqargan hisobni topa olmasa, vaqtinchalik boshlang‘ich qiymatni yozib olgansiz. Kanonik hisobni tartiblangan siyosatdan hosil qiling va yuqorida ko‘rsatilganidek shu qiymat bilan ro‘yxatdan o‘tkazing.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Mahkamlangan commitdagi ko‘p imzo integratsiya sinovlari](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [Mahkamlangan commitdagi ko‘p imzo ma’lumotlar modeli](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [Mahkamlangan commitdagi CLI ko‘p imzo amalga oshirishi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Tranzaksiyalar](/uz/blockchain/transactions.md)
- [Ruxsatlar va rollar](./permissions-and-roles.md)
