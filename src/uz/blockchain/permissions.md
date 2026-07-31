---
translation_locale: uz
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ruxsatnomalar {#permissions}

Hisobvaraqlarga blokchainda turli harakatlar uchun ruxsatnoma tokenlari kerak, masalan.
mol-mulkni to'ldirish yoki yoqish uchun.

Umumiy va xususiy blokchainning oʻrtasidagi farq
foydalanuvchilarga berilgan ruxsatnomalar.
Xususiy blokchainda aksariyat hisoblar
ularga berilgan vakolatdan tashqarida hech narsa qila olmaydilar
tegishli ruxsatnoma aniq berilmaganicha.

Biror ishni amalga oshirish uchun ruxsatnomaga ega bo'lish hisobda
tegishli `Permission`. Ruxsatnomalar bevosita yoki
[`Role`](#permission-groups-roles), ruxsatnomalar to'plamini tashkil qiladi.
ruxsatnomalar `Grant` Ta'lim. Ruxsatlar va vazifalar
o'tmaydi; ularni `Revoke` yo'l-yo'riq.

## Ruxsat toʻgʻriligi {#permission-tokens}

Ruxsatnoma belgisi aktiv ijrochi tomonidan belgilangan ob'ektlar hisoblanadi.
tokenlar global, masalan: `CanManagePeers`, va boshqalari a
hisob raqami, aktiv, aktivning ta'rifi, domen kabi ma'lum bir kitob ob'ekti;
NFT, rol yoki qo'zg'atuvchi.

Quyidagilar turli ruxsatnoma tokenlari uchun ishlatiladigan parametrlarning ba'zi misollari:

- Maʼlum bir hisob uchun metadatalarni oʻzgartirishga ruxsat beruvchi token
  bir `account` maydon:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- Ma'lum bir aktiv uchun aktivlarni o'tkazishga ruxsat beruvchi token
  ta'rif bir `asset_definition` maydon:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- Global token kabi `CanManagePeers` maydonlari mavjud emas:

  ```json
  {}
  ```

### Oldindan moslashtirilgan ruxsat berish tokenlari {#pre-configured-permission-tokens}

Siz oldindan moslashtirilgan ruxsat belgilari roʻyxatini [Ma'lumotnoma](/uz/reference/permissions) bo'lim.

## Ruxsatlar guruhlari (roll) {#permission-groups-roles}

Ruxsatlar to'plami **roli**. Ruxsat kodlari bilan ham xuddi shunday.
ro'llarni quyidagilardan foydalanib berish mumkin: `Grant` yo'l-yo'riq va ushbu
`Revoke` yo'l-yo'riq.

Hisobvaraqga rol berishdan oldin roli birinchi navbatda ro'yxatga olinishi kerak.

Bir nechta hisob raqamlari bir xil ruxsatni olganda rollar foydali
roli bir marta ro'yxatdan o'tkazing, roliga ruxsatnomalar bering va keyin
alohida hisobvaraqlarning roli bekor qilinadi.

### Yangi rolni ro'yxatga olish {#register-a-new-role}

Keling, yangi rolni ro'yxatdan o'tkazaylik.
O'zbekiston Respublikasi [Metadatalar](/uz/blockchain/metadata.md) Mouse hisobida:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### Oʻrinni tanlang {#grant-a-role}

Roli ro'yxatdan o'tganidan so'ng, Tovuq uni Alicega berishi mumkin:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## Ruxsatnomalarni tasdiqlash vositasi {#permission-validators}

Ruxsatlar mavjud boʻlib , faqat kerakli ruxsat belgisi bilan hisoblar mavjud
himoyalangan amalni bajarishi mumkin. Andoza ijrochi ruxsatlarni tekshiradi
ko'rsatmalar, so'rovlar va ifodalarni bajarishda.

Dastlabki tasdiqlovchi yuzi katta yozuv maydonlari bo'yicha guruhlanadi:

- tengdoshlarni boshqarish
- domenlar va hisobotlar
- aktivlar, NFTs, va eskorlar
- qo'zg'atuvchilar
- vazifa va ruxsatnomalar
- ijrochi/ish vaqti, dalillar, ko'priklar va SORA/Nexus modullar

Toʻgʻri belgisi roʻyxati manbai bilan tasdiqlangan
[Ruxsat to'g'risidagi ma'lumot](/uz/reference/permissions.md).

### Ish vaqtini tasdiqlash vositasi {#runtime-validators}

Ruxsatlarni tekshirish faol ijrochi tomonidan amalga oshiriladi.
ijrochi o'rnatilgan ruxsatnomalarni tasdiqlovchi va token belgilarini taqdim etadi;
va tarmoq foydalanayotgan ijrochini yangilab, siyosatni o'zgartirishi mumkin.

Tasdiqlovchilar a **tasdiqlash hukmi**. Validator bir
operatsiya, uni sabab bilan rad etish yoki operatsiyani o'tkazib yuborish
tanlangan sudya ushbu hukmlarni
ko'rsatma, so'rov yoki ifoda davom etishi mumkinligini hal qilish.

## Qo'llab-quvvatlanadigan so'rovlar {#supported-queries}

Ruxsat kodlari va rollarni so'rash mumkin.

Oʻrinlarga doir soʻrovlar:

- [`FindRoles`](/uz/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/uz/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/uz/reference/queries.md#accounts-and-permissions)

Ruxsat kodlari uchun soʻrovlar:

- [`FindPermissionsByAccountId`](/uz/reference/queries.md#accounts-and-permissions)
