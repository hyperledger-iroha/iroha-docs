---
translation_locale: uz
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ruxsatlar {#permissions}

Hisoblar blokcheynda aktiv chiqarish yoki yoqish kabi turli amallarni bajarishi uchun ruxsat tokenlariga muhtoj.

Ochiq va xususiy blokcheynlar foydalanuvchilarga beriladigan ruxsatlar bilan farqlanadi. Ochiq blokcheynda hisoblarning aksariyati bir xil ruxsatlarga ega bo‘ladi. Xususiy blokcheynda esa hisob tegishli ruxsat aniq berilmaguncha o‘ziga topshirilgan vakolatdan tashqari hech narsa qila olmaydi.

Biror amalni bajarishga ruxsatli bo‘lish hisobda tegishli `Permission` borligini anglatadi. Ruxsatlar bevosita yoki ruxsatlar majmuasini birlashtiradigan [`Role`](#permission-groups-roles) orqali berilishi mumkin. Ular `Grant` ko‘rsatmasi bilan beriladi. Ruxsat va rollarning muddati tugamaydi; ularni `Revoke` ko‘rsatmasi bilan olib tashlang.

## Ruxsat tokenlari {#permission-tokens}

Ruxsat tokenlari faol ijrochi belgilaydigan tiplashtirilgan obyektlardir. `CanManagePeers` kabi ayrim tokenlar global, boshqalari esa hisob, aktiv, aktiv ta’rifi, domen, NFT, rol yoki qo‘zg‘atuvchi kabi muayyan reyestr obyekti doirasida amal qiladi.

Quyida turli ruxsat tokenlarida ishlatiladigan parametrlarga misollar keltirilgan:

- Muayyan hisob metama’lumotini o‘zgartirishga ruxsat beruvchi token `account` maydonini olib yuradi:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- Muayyan aktiv ta’rifi bo‘yicha aktivlarni o‘tkazishga ruxsat beruvchi token `asset_definition` maydonini olib yuradi:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- `CanManagePeers` kabi global token hech qanday maydonga ega emas:

  ```json
  {}
  ```

### Oldindan sozlangan ruxsat tokenlari {#pre-configured-permission-tokens}

Oldindan sozlangan ruxsat tokenlari ro‘yxati [Ruxsat tokenlari ma’lumotnomasida](/uz/reference/permissions) berilgan.

## Ruxsat guruhlari (rollar) {#permission-groups-roles}

Ruxsatlar majmuasi **rol** deb ataladi. Ruxsat tokenlari singari rollarni `Grant` ko‘rsatmasi bilan berish va `Revoke` ko‘rsatmasi bilan bekor qilish mumkin.

Hisobga rol berishdan oldin uni ro‘yxatdan o‘tkazish kerak.

Bir nechta hisob ayni ruxsatlarni olishi kerak bo‘lganda rollar qulay. Rolni bir marta ro‘yxatdan o‘tkazing, unga ruxsatlarni biriktiring, so‘ng alohida hisoblarga rolni bering yoki ulardan bekor qiling.

### Yangi rolni ro'yxatdan o'tkazish {#register-a-new-role}

Mouse hisobidagi [metama’lumotga](/uz/blockchain/metadata.md) boshqa hisob kirishini ta’minlaydigan yangi rolni ro‘yxatdan o‘tkazamiz:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### Rol bering {#grant-a-role}

Rol ro‘yxatdan o‘tkazilgach, Mouse uni Alice’ga berishi mumkin:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## Ruxsat tekshiruvchilari {#permission-validators}

Ruxsatlar himoyalangan amalni faqat kerakli ruxsat tokeniga ega hisob bajarishini ta’minlaydi. Standart ijrochi ko‘rsatma, so‘rov va ifodalarni bajarishda ruxsatlarni tekshiradi.

Standart tekshiruvchilar reyestr sohasi bo‘yicha guruhlanadi:

- tugunlarni boshqarish
- domenlar va hisoblar
- aktivlar, NFTs va eskroular
- qo‘zg‘atuvchilar
- rollar va ruxsatlar
- ijrochi/bajarish muhiti, isbotlar, ko‘priklar va SORA/Nexus modullari

Tokenlarning aniq, manba bilan tasdiqlangan ro‘yxati [Ruxsat tokenlari ma’lumotnomasida](/uz/reference/permissions.md) berilgan.

### Bajarish muhiti tekshiruvchilari {#runtime-validators}

Ruxsat tekshiruvlarini faol ijrochi majburiy qo‘llaydi. Standart ijrochi ichki ruxsat tekshiruvchilari va token ta’riflarini taqdim etadi; tarmoq foydalanayotgan ijrochini yangilash orqali siyosatini o‘zgartirishi mumkin.

Tekshiruvchilar **tekshiruv hukmini** qaytaradi. Tekshiruvchi amalga ruxsat berishi, uni sabab bilan rad etishi yoki amal o‘z doirasidan tashqarida bo‘lsa o‘tkazib yuborishi mumkin. Tanlangan hakam shu hukmlarni birlashtirib, ko‘rsatma, so‘rov yoki ifoda davom etishiga ruxsat berish-bermaslikni hal qiladi.

## Qo‘llab-quvvatlanadigan so‘rovlar {#supported-queries}

Ruxsat tokenlari va rollarni so‘rov orqali olish mumkin.

Rollar uchun so‘rovlar:

- [`FindRoles`](/uz/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/uz/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/uz/reference/queries.md#accounts-and-permissions)

Ruxsat tokenlari uchun so‘rovlar:

- [`FindPermissionsByAccountId`](/uz/reference/queries.md#accounts-and-permissions)
