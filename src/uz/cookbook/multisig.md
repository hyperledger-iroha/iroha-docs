---
translation_locale: uz
translation_source: /cookbook/multisig.md
translation_source_hash: 7090228c4fea7321c93fe0d2c67ef6de842de95bc3befa11d83c12b9f15b4752
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Oʻlchovli multisig {#weighted-multisig}

## Natija {#outcome}

Taira da uch a'zoga tenglashtirilgan multisig hisobini ro'yxatdan o'tkazing, metadatalarga oid yo'l-yo'riqlarni taklif qiling, uni quorumga ega bo'lish uchun etarlicha og'irlik bilan tasdiqlang va multisig hisobining holatidan bajarilishini tekshiring.

## Oldingi shartlar {#prerequisites}

- Uch ta kanonik I105 imzochi IDs yo'nalishi `SIGNER_A`, `SIGNER_B`, va `SIGNER_C`.
- imzochi A va C uchun mablag' bilan ta'minlangan Taira konfiguratsiyalari. Taqdim qiluvchi va har bir tasdiqlovchi o'z tranzaksiyasi uchun to'laydi.
- `taira.tx-metadata.json` joriy kran javobidan qurilgan, hech qachon nusxalashtirilgan to'lov aktividan ID.
- A Rust mijoz loyihasi bir xil Iroha manbalarni qayta koʻrib chiqish Taira So'nggi taklif va tasdiqlash bosqichlarida CLI.
- Joriy ijrochining multisig xususiyati qo'lga kiritilgan. Ro'yxatdan o'tish Iroha 3 andoza ish vaqti bilan oddiy hisobvaraqlar uchun mavjud, garchi Taira siyosati va to'lovni qabul qilish hali ham amalda bo'lsa-da; agar jamoatchilik tarqatishi uni rad qilsa, localnetdan foydalaning.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## qadamlar {#steps}

### 1. Tugatilgan siyosatni ro'yxatdan o'tkazish {#_1-register-a-weighted-policy}

C belgisi 2 og'irlikka ega; A va B har biri 1 og'irligiga ega. Shuning uchun 3 dan iborat quorum uchun C qo'shimcha yoki A yoki B kerak bo'ladi. Ro'yxatdan o'tishdan oldin ushbu aniq siyosatdan kanonik hisobni chiqarish, so'ngra bir xil qiymatni `MultisigRegister::with_account` ga o'tkazish:

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

CLI qadamlari uchun bosib chiqarilgan qiymatni saqlash:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

O'rnatilgan qo'yishda CLI ro'yxatga olish komandasi o'z vaqtinchalik urug'ini ishga tushirish vaqti uni qayta tiklashdan oldin bosib chiqaradi. U urug'ni nazoratchi sifatida qayta ishlatmang. Boshqaruvchining xususiy kaliti yo'q: multisig hokimiyati faqat tasdiqlangan takliflardan kelib chiqadi.

### 2. Uni taqdim etmasdan, bitta yo'l-yo'riq tuzish {#_2-build-one-instruction-without-submitting-it}

Global `-o` switch ko'rsatmalar jadvalini standart chiqish uchun seriallashtiradi. U tranzaksiyalarni taqdim etmaydi va shuning uchun hech qanday to'lovni sarflamaydi.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Imzolash uchun A-ni taklif qiling. {#_3-propose-as-signer-a}

Taklif qiluvchi o'z og'irligini avtomatik ravishda qo'shadi. CLI tomonidan bosib chiqarilgan aniq ko'rsatma hashini olish; ruxsatnomalar ushbu hashga bog'lanadi.

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

Toʻxtatilmayotgan taklifni aniq cheklangan tanlovchi bilan roʻyxatdan oʻtkazish:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Imzolovchi sifatida tasdiqlansin C {#_4-approve-as-signer-c}

A og'irligi 1 qo'shimcha C og'irligini 2 quorum 3 ga yetadi va taklif qilingan ko'rsatmani multisig hisob sifatida bajaradi.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust mijozi xuddi shu siyosatdan kelib chiqadigan hisobda va yuqorida ishlatilgan ikkita hayot davomiyligi ko'rsatmalarida davom etishi mumkin:

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

So'nggi xabarni o'qing va taklif endi davom etmayotganini tasdiqlang:

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

Metadata qiymati `"approved"` bo'lishi kerak, tushirilgan yo'l-yo'riqlar hashini ko'rinishda ko'rsatmaslik kerak va tekshirilgan nazoratchi `1, 1, 2` og'irliklarini quorum bilan `3` ko'rsatishi kerak.

## Muammolarni hal qilish {#troubleshooting}

- `signatory is not part of multisig` - taklif qiluvchi yoki tasdiqlovchi mijoz siyosatda ro'yxatdan o'tgan I105 IDs mijozlaridan biriga mos kelmaganligini anglatadi.
- Agar multisig hisobida taklif qilingan ko'rsatmalarni bajarish uchun ruxsat yo'q bo'lsa, yakuniy tasdiqlash rad etilishi mumkin. Multisig hisob raqamiga vakolat bering, faqat uning har bir imzolashiga emas, so'ngra qolgan imzolashuvchini yana sinab ko'ring.
- To'xtatilmayotgan taklif allaqachon quorumga erishilgan, TTL muddati tugagan yoki noto'g'ri ko'rsatma hash/hisob tanlagichidan foydalanganligini anglatishi mumkin.
- Ikkilamchi ruxsatnomalar og'irlikni qo'shmaydi. Har bir ro'yxatdan o'tgan imzochi o'zining konfiguratsiya qilingan og'irligini ko'proq bir marta kiritadi.
- Oddiy operatsiyalarni nazoratchi sifatida to'g'ridan-to'g'ri imzolash taqiqlanadi. Har doim `MultisigPropose` va `MultisigApprove` dan foydalaning
- Agar keyingi buyruqlar CLI ro'yxatdan o'tishda bosilgan hisobni topolmasa, siz vaqtincha urug'ni ushlab olgansiz. Kanonik hisobni buyurtma qilingan siyosatdan olib tashlang va yuqorida ko'rsatilgandek ushbu qiymat bilan ro'yxatga oling.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Pinned commit-da multisig integratsiya sinovlari](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/multisig.rs)
- [Pinned commit-da multisig ma'lumotlar modeli](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI ko'p belgisi qo'llanilishi biriktirilgan commitda](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Operatsiyalar](/uz/blockchain/transactions.md)
- [Ruxsatlar va vazifalar ](./permissions-and-roles.md)
