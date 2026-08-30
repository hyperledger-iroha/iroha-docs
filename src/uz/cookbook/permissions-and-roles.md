---
translation_locale: uz
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 7ee18275d25837da53f533f5e9205906ccaa71b48afd9b11ffad79b599da7f21
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ruxsatlar va vazifalar {#permissions-and-roles}

## Natija {#outcome}

Bitta hisobda metadatalarni yangilash uchun ruxsat beruvchi rolni yaratish, uni vakilga tayinlash, delegatsiya qilingan yozishni isbotlash va tegishli Rust yo'l-yo'riqlarini ko'rsatish.

## Oldingi shartlar {#prerequisites}

- Taira moliyalashtirilgan mijoz va to'lov metadatalari [dan Taira](./connect-to-taira.md)ga ulaning.
- `TARGET_ACCOUNT` va `DELEGATE_ACCOUNT` kanonikga oʻrnatilgan I105 hisob IDs.
- Imzolash hisobiga maqsadli ruxsatnomalar va rollarni boshqarish huquqi berilishi kerak. Taira da bu ruxsatnoma bilan bog'liq ma'muriy operatsiya; `CanManageRoles` va aniqlangan ruxsatnomani berish uchun zarur bo'lgan hokimiyatni olish yoki retseptni ishlab chiqarilgan mahalliy tarmoqda ishga tushirish.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Yozib olishni isbotlashda delegat uchun ikkinchi mijoz konfiguratsiyasini ishlating:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## qadamlar {#steps}

### 1. Bo'sh rolni ro'yxatga olish {#_1-register-an-empty-role}

Har bir davlatni o'zgartiruvchi CLI buyruq to'lov to'lovini to'lovchiga aniq nom beradi. Metadata faylida kran javobidan kelib chiqqan joriy Taira to'lov aktivlari mavjud.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Maqsadli hisob raqamiga aniq ruxsat qo'shish {#_2-add-a-permission-scoped-to-the-target-account}

Ruxsat belgisi JSON ob'ektlariga o'xshaydi. Hisobotni `payload` ichida I105 ID sifatida saqlang; bu qat'iy maydonda alias haqiqiy emas.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. O'rinni vakilga berish {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

O'yinlar va ularning grantlari o'tmaydi, ular endi kerak bo'lmaganida ularni aniq bekor qilish.

### 4. Delegat qilingan ruxsatni qo'llash {#_4-exercise-the-delegated-permission}

Yozish uchun delegatning imzolashi va to'lov balansidan foydalaning. JSON qiymatlari standart kirishdan o'qiladi.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Xuddi shunday model Rust mijozlar. `client` belgilari `registrar_account`, o'rinning dastlabki egasi bo'lib qoladi, xuddi CLI Barcha uchta hisob o'zgaruvchilari allaqachon tahlil qilingan `AccountId` qiymatlari:

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

Ishning ikkala tomonini ham ro'yxatga oling, so'ngra delegat tomonidan yozilgan aniq qiymatni o'qing:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

Ruxsatlar ro'yxati `CanModifyAccountMetadata` ga ko'ra `TARGET_ACCOUNT`, delegatning ro'l ro'yxatida `ROLE_ID` bo'lishi kerak va o'qilgan metadatalarga `"delegated"` qaytarilishi kerak.

## Muammolarni hal qilish {#troubleshooting}

- `Not permitted` roli ro'yxatdan o'tish, tahrirlash yoki tayinlashda imzochi Taira uchun talab qilingan vakolatga ega emasligini anglatadi. Maqsadli tokenni global token bilan almashtirmang; aniq grantni so'rang yoki localnetdan foydalaning.
- Faydali yukni tahlil qilish xatosi odatda `account` `payload` yonida qo'yilgan, I105 ID o'rniga alias taqdim etilgan yoki JSON qiymati ikki marta ko'rsatilganligini bildiradi.
- To'lovni rad etish ushbu bosqichni taqdim etgan imzochiga tegishli. Boshqaruvchini mablag' bilan ta'minlab, mustaqil ravishda vakolat beradi va krandan olingan to'lov aktivining metadatalarini saqlaydi.
- Muvaffaqiyatli rol berish uning tokenlarida kodlangan doiradan ustun kelmaydi. Bu rol faqat ruxsatnomada nomlangan hisobni o'zgartirishi mumkin.
- To'ldirish uchun `ledger account role revoke`, so'ngra `ledger role permission revoke` va nihoyat `ledger role unregister` ishga tushiring; har biri alohida yozish bo'lib, `--fee-payer authority` va to'lov metadatalarini o'z ichiga olishi kerak.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Roli integratsiyasi sinovlari qat'iy qo'yilgan commit-da](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [To'g'ri yo'lga qo'yilgan commitda ruxsatnoma integratsiyasi sinovlari ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs) qo'yilgan commit-da o'rnatilgan ruxsatnoma ma'lumotlar modeli
- [Ruxsatlar va vazifalar ](/uz/blockchain/permissions.md)
- [Ruxsat belgisi referensiyasi](/uz/reference/permissions.md)
- [Metadatalar](./metadata.md)
