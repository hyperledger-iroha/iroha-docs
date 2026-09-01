---
translation_locale: uz
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ruxsatlar va Rollar {#permissions-and-roles}

## Natija {#outcome}

Bitta hisob qaydnomaga metadata yangilash huquqini beradigan rol yaratish, uni vakilga tayinlash, vakil qilingan yozuvni tasdiqlash va mos keladigan typed Rust ko'rsatmalarini ko'rsatish.

## Oldingi talablar {#prerequisites}

- Moliyalashtirilgan Taira mijoz va [Taira ga ulaning](./connect-to-taira.md) dan to‘lov metadata.
- `TARGET_ACCOUNT` va `DELEGATE_ACCOUNT` kanonik I105 hisob identifikatorlariga o‘rnatilgan.
- Imzolash hisob qaydnomasi maqsad litsenziya va rollarni boshqarishga ruxsat berilishi kerak. Taira da bu ruxsatga bog‘langan ma'muriy operatsiya; `CanManageRoles` ni va belgilangan ruxsatni berish uchun kerakli avtorizatsiya sub'ektini oling, yoki retseptni yaratilgan lokal tarmoqda ishga tushiring.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Yozishni tasdiqlashda vakil uchun ikkinchi mijoz konfiguratsiyasidan foydalaning:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Qadamlar {#steps}

### 1. Bo'sh rolni ro'yxatdan o'tkazing {#_1-register-an-empty-role}

Har bir holatni o‘zgartiruvchi CLI buyrug‘ida to‘lovchini aniq ko‘rsatadi. Metama‘lumotlar faylida sinov tarmog‘i krani javobidan olingan joriy Taira to‘lov aktivlari mavjud.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Maqsad hisob qaydnomasiga moʻljallangan ruxsat qoʻshing {#_2-add-a-permission-scoped-to-the-target-account}

Ruxsat tokenlari JSON tipidagi obyektlardir. Hisobni `payload` ichida I105 ID sifatida saqlang; bu qat’iy maydonda alias yaroqsizdir.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Rollni vakilga tayinlang {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Rollar va ularning ruxsatnomalari muddati tugamaydi. Kirish endi kerak bo‘lmaganda ularni aniq bekor qiling.

### 4. Taqsimlangan ruxsatdan foydalaning {#_4-exercise-the-delegated-permission}

Yozish uchun delegatning kriptografik imzolchisi va to‘lov balansidan foydalaning. JSON qiymatlari standart kirishdan o‘qiladi.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Xuddi shu model Rust mijozlar uchun mavjud. Bu yerda `client` `registrar_account` sifatida imzo qo'yadi, bu rolning dastlabki egasi bo'lib qoladi, xuddi CLI jarayonida bo'lgani kabi. Uchta hisob o'zgaruvchisi allaqachon `AccountId` qiymatlari sifatida tahlil qilingan:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all_blocking::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Tekshirish {#verify}

Vazifaning ikkala tomonini ham roʻyxatlang, keyin vakil tomonidan yozilgan aniq qiymatni oʻqing:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

Ruxsatnoma ro‘yxatida `CanModifyAccountMetadata` `TARGET_ACCOUNT` doirasida bo‘lishi kerak, vakilning rol ro‘yxatida `ROLE_ID` bo‘lishi kerak va metadata o‘qishi `"delegated"`ni qaytarishi kerak.

## Muammolarni bartaraf etish {#troubleshooting}

- `Not permitted` ro‘yxatdan o‘tish, tahrirlash yoki rolni tayinlash paytida imzolovchi kerakli Taira avtorizatsiya asosiga ega emasligini bildiradi. Scoped tokenni global token bilan almashtirmang; aniq ruxsatni so‘rang yoki localnetdan foydalaning.
- Yukni tahlil qilish xatosi odatda `account` `payload` yonida joylashtirilganini, I105 ID o‘rniga taxallus berilganini yoki JSON qiymati ikki marta qo‘sh tirnoqqa olinganini anglatadi.
- To‘lov rad etilishi shu bosqichni yuborayotgan imzolovchiga tegishli. Boshqaruvchi va vakilni alohida mablag‘ bilan ta’minlang hamda krandan olingan to‘lov aktivi metama’lumotlarini saqlang.
- Muvaffaqiyatli rol berish uning tokenlarida kodlangan doirani bekor qilmaydi. Ushbu rol faqat ruxsat yuklamasida nomlangan hisobni o'zgartirishi mumkin.
- Tozalash uchun avval `ledger account role revoke`, keyin `ledger role permission revoke` va nihoyat `ledger role unregister` ni ishga tushiring; ularning har biri alohida yozuv bo‘lib, `--fee-payer authority` va to‘lov metama’lumotlarini olishi kerak.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Belgilangan manba-kod reviziyasidagi rol integratsiyasi testlari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Ruxsat integratsiyasi testlari pinlangan manba-kod reviziyasida](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Qattiqlashtirilgan manba-kod versiyasidagi ichki ruxsat ma'lumotlari modeli](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [Ruxsatlar va rollar](/uz/blockchain/permissions.md)
- [Ruxsatnoma tokeni havolasi](/uz/reference/permissions.md)
- [Metama'lumot](./metadata.md)
