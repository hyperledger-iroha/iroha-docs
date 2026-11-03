---
translation_locale: uz
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Ruxsatlar va Rollar {#permissions-and-roles}

## Natija {#outcome}

Bitta hisob qaydnomaga metadata yangilash huquqini beradigan rol yaratish, uni vakilga tayinlash, vakil qilingan yozuvni tasdiqlash va mos keladigan typed Rust ko'rsatmalarini ko'rsatish.

## Oldingi talablar {#prerequisites}

- [Taira-ga ulanish](./connect-to-taira.md) bo‘limidagi moliyalashtirilgan Taira mijozi.
- `TARGET_ACCOUNT` va `DELEGATE_ACCOUNT` kanonik I105 hisob identifikatorlariga o‘rnatilgan.
- Imzolovchi hisobda `CanManageRoles` bo‘lishi va u doirasi belgilangan ruxsatni boshqa hisobga bera olishi kerak: u `TARGET_ACCOUNT` ning o‘zi bo‘ladi yoki shu hisob uchun allaqachon `CanModifyAccountMetadata` ga ega bo‘ladi. Taira-da bu ruxsat bilan cheklangan ma’muriy amal. Yaratilgan mahalliy tarmoq mijozida `CanManageRoles` yo‘q, shuning uchun retseptga genezisi bu ruxsatni beradigan tarmoq kerak.

```bash
CONFIG=./taira.client.toml
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

Holatni o‘zgartiruvchi har bir CLI buyrug‘i to‘lovchini aniq ko‘rsatadi. CLI imzolashdan oldin Taira to‘lov aktividagi aniq to‘lov narxini oladi.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. Maqsad hisob qaydnomasiga moʻljallangan ruxsat qoʻshing {#_2-add-a-permission-scoped-to-the-target-account}

Ruxsat tokenlari JSON tipidagi obyektlardir. Hisobni `payload` ichida I105 ID sifatida saqlang; bu qat’iy maydonda alias yaroqsizdir.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Rollni vakilga tayinlang {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
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
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Xuddi shu model Rust mijozlari uchun ham mavjud. Bu yerda `client` — `registrar_account` sifatida imzolaydigan `iroha::blocking::Client`; CLI jarayonidagi kabi `registrar_account` rolning dastlabki egasiga aylanadi. Uchala hisob o‘zgaruvchisi allaqachon tahlil qilingan `AccountId` qiymatlaridir:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Tekshirish {#verify}

Vakilning amaldagi ruxsatlarini o‘qing (ular rol orqali berilgan ruxsatlarni ham o‘z ichiga oladi), so‘ng vakil yozgan aniq qiymatni o‘qing:

```bash
iroha --config "$CONFIG" --machine account permission list \
  --id "$DELEGATE_ACCOUNT" --all \
  | jq -e --arg account "$TARGET_ACCOUNT" \
    '.items | any(.name == "CanModifyAccountMetadata"
      and .payload.account == $account)'

iroha --config "$CONFIG" account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

Vakilning amaldagi ruxsatlarida `TARGET_ACCOUNT` doirasidagi `CanModifyAccountMetadata` bo‘lishi, metama’lumotni o‘qish esa `"delegated"` ni qaytarishi kerak. Torii imzolangan so‘rovlar orqali rollar ro‘yxatini berishni rad etadi, shuning uchun tayinlash amaldagi ruxsatlar ro‘yxati orqali tekshiriladi.

## Muammolarni bartaraf etish {#troubleshooting}

- Rolni ro‘yxatdan o‘tkazish, tahrirlash yoki tayinlash paytidagi `Not permitted` imzolovchida kerakli Taira vakolati yo‘qligini bildiradi. Doirasi belgilangan tokenni global token bilan almashtirmang; aniq ruxsat berilishini so‘rang.
- Yukni tahlil qilish xatosi odatda `account` `payload` yonida joylashtirilganini, I105 ID o‘rniga taxallus berilganini yoki JSON qiymati ikki marta qo‘sh tirnoqqa olinganini anglatadi.
- To‘lov rad etilishi shu bosqichni yuborayotgan imzolovchiga tegishli. Boshqaruvchi va vakilni har bir to‘lov narxida ko‘rsatilgan to‘lov aktivida alohida mablag‘ bilan ta’minlang.
- Muvaffaqiyatli rol berish uning tokenlarida kodlangan doirani bekor qilmaydi. Ushbu rol faqat ruxsat yuklamasida nomlangan hisobni o'zgartirishi mumkin.
- Tozalash uchun avval `account role revoke`, keyin `ledger role permission revoke` va nihoyat `ledger role unregister` ni ishga tushiring; ularning har biri alohida yozish amali bo‘lib, `--fee-payer authority` ni o‘z ichiga olishi kerak.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Belgilangan manba-kod reviziyasidagi rol integratsiyasi testlari](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [Ruxsat integratsiyasi testlari pinlangan manba-kod reviziyasida](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [Qattiqlashtirilgan manba-kod versiyasidagi ichki ruxsat ma'lumotlari modeli](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [Ruxsatlar va rollar](/uz/blockchain/permissions.md)
- [Ruxsatnoma tokeni havolasi](/uz/reference/permissions.md)
- [Metama'lumot](./metadata.md)
