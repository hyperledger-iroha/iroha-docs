---
translation_locale: uz
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ruxsatlar {#permissions}

Hisobvaraqlarga blokcheynda turli harakatlar uchun ruxsatnoma tokenlari kerak, masalan, aktivlarni to'ldirish yoki yoqish uchun.

Foydalanuvchilarga berilgan ruxsatnomalar bo'yicha davlat va xususiy blokchain o'rtasidagi farq bor. Umumiy blokcheynda aksariyat hisobvaraqlar bir xil ruxsatlarga ega. Xususiy blokchainda , aksariyat hisoblar ularga berilgan vakolatdan tashqari hech narsa qila olmaydi deb taxmin qilinadi , agar ular tegishli ruxsatnoma ma'lum ravishda berilgan.

Ba'zi narsalarni amalga oshirish uchun ruxsatnomaga ega bo'lish hisobda tegishli `Permission` mavjudligini anglatadi. Ruxsatnomalar to'g'ridan-to'g'ri yoki [`Role`](#permission-groups-roles) orqali beriladi, bu bir qator ruxsatnomalarni jamlaydi. Ruxmatlar `Grant` ko'rsatmasi bilan beriladi. Ruxsatlar va vaziyatlar o'tmaydi; ularni `Revoke` ko'rsatmasi bilan olib tashlang.

## Ruxsat belgisi {#permission-tokens}

To'g'rilik tokenlari faol ijrochi tomonidan belgilangan ob'ektlar hisoblanadi. Ba'zi tokenlar global, masalan `CanManagePeers`, va boshqalar hisob raqami, aktiv, aktiv ta'riflanishi, domen, NFT, rol yoki qo'zg'atuvchi kabi ma'lum bir kitob obyektiga doir.

Quyidagilar turli ruxsatnoma belgisi uchun ishlatiladigan parametrlarning ba'zi misollari:

- Ma'lum bir hisob uchun metadatalarni o'zgartirishga ruxsat beruvchi token `account` maydonini ko'radi:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- Ma'lum bir aktivni belgilash uchun aktivlarni o'tkazishga ruxsat beruvchi token `asset_definition` maydonini ko'rsatadi:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- `CanManagePeers` kabi global tokenda quyidagi maydonlar mavjud emas:

  ```json
  {}
  ```

### Oldindan moslashtirilgan ruxsat berish tokenlari {#pre-configured-permission-tokens}

Siz [Reference](/uz/reference/permissions) bobida oldindan moslashtirilgan ruxsat belgilari ro'yxatini topishingiz mumkin.

## Ruxsat beruvchi guruhlar (rolllar) {#permission-groups-roles}

Ruxsatlar to'plami rol deb ataladi. Ruxsat tokenlariga o'xshab, `Grant` ko'rsatmasini qo'llab rolalarni berish va `Revoke` ko'rsatmasi yordamida bekor qilish mumkin.

Hisobvaraqga rol berishdan oldin roli birinchi navbatda ro'yxatga olinishi kerak.

Bir nechta hisob raqamlari bir xil ruxsatnomani olishi kerak bo'lganda rollar foydali. Roli bir marta ro'yxatdan o'tkazilsin, roliga ruxsatnomalar berilsin, so'ngra alohida hisobotlar uchun rolni berish yoki bekor qilish kerak.

### Yangi rolni ro'yxatdan o'tkazish {#register-a-new-role}

Keling, Mouse hisobidagi [ metadatalarga ](/uz/blockchain/metadata.md) boshqa hisobga kirish imkonini beradigan yangi rolni ro'yxatdan o'tkazaylik:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### Oʻrinni tanlang . {#grant-a-role}

Roli ro'yxatdan o'tkazilgandan so'ng, Mouse uni Alicega berishi mumkin:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## Ruxsatnomalarni tasdiqlash vositasi {#permission-validators}

Ruxsatlar mavjud, shuning uchun faqat kerakli ruxsat belgisi bo'lgan hisob raqamlari himoyalangan harakatni amalga oshirishi mumkin. Andoza ijrochi ko'rsatma, so'rov va ifodalarni bajarish paytida ruxsatlarni tekshiradi.

Dastlabki tasdiqlovchi yuzi guruhi maydoni bo'yicha guruhlanadi:

- tengdoshlarni boshqarish
- domenlar va hisobotlar
- aktivlar, NFTs, va depozitlar
- qo'zg'atuvchilar
- rola va ruxsatnomalar
- ijrochi / ish vaqti, dalillar, ko'priklar va SORA/Nexus modullari

To'g'ri tokenlar ro'yxati [ Permission Tokens ko'rsatkichida ](/uz/reference/permissions.md) manba tomonidan tasdiqlangan.

### Ish vaqtini tasdiqlovchi vositalar {#runtime-validators}

To'g'rilik tekshiruvlari faol ijrochi tomonidan amalga oshiriladi. Andoza ijrochi o'rnatilgan ruxsatnomalarni tasdiqlovchi va token belgilarini taqdim etadi va tarmoq foydalanayotgan ijrochini yangilab, siyosatni o'zgartirishi mumkin.

Validatorlar tasdiqlash hukmini qaytaradi. Validator bir operatsiyani ruxsat berishi, sabab bilan rad qilishi yoki agar operatsiya ushbu validatorning doirasidan tashqarida bo'lsa uni qoldirishi mumkin. Tanlangan hakam bu hukmlarni qo'shib, ko'rsatma, so'rov yoki ifodani davom ettirish mumkinmi yoki yo'qmi degan qarorni chiqaradi.

## Qo'llab-quvvatlanadigan so'rovlar {#supported-queries}

Ruxsat kodlari va rollar so'ralishi mumkin.

O'rinlarga doir so'rovlar:

- [`FindRoles`](/uz/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/uz/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/uz/reference/queries.md#accounts-and-permissions)

Ruxsat kodlari uchun soʻrovlar:

- [`FindPermissionsByAccountId`](/uz/reference/queries.md#accounts-and-permissions)
