---
translation_locale: uz
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ibtido {#genesis}

Ibtido dastlabki zanjir holatini belgilaydi. tahrirlanadigan manba JSON manifestidir va Iroha 3 nod imzolangan Norito transaksiya faylini iste'mol qiladi.

::: details Andoza genesis manifesti

<<< @/snippets/genesis.json

:::

## Fayllar {#files}

`defaults/genesis.json`. Kagami tomonidan yaratilgan tarmoqlar o'zlarining manifesti va imzolangan tranzaksiyalarini chiqarish direktoriyasiga yozadi:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Ushbu direktoriyada yaratilgan `README.md` tanlangan profil uchun aniq fayllarni va ishga tushirish buyruqlarini qayd etadi.

## Tengdoshlar soni {#peer-configuration}

`config.toml` ning `[genesis]` bo'limida imzolangan genesis tranzaksiyasida tengdoshlar quyidagilarni ko'rsatadilar:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Tarmoqdagi barcha tengdoshlar imzolangan genesis muomalasi va genesis jamoatchilik kalitini kelishishlari kerak.

## Ibtido kitobining imzolanishi {#signing-genesis}

Agar siz manifestni qo'lda tahrirlasangiz, tengdoshlarni boshlashdan oldin uni tasdiqlash va imzolash:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

NPoS yoki Nexus profillari uchun topologiya va BLS hosil qilingan profil tomonidan talab etiladigan egalik hujjati kiritiladi. Kagami `localnet`, `wizard` va profil yaratish buyruqlari ushbu tafsilotlarni avtomatik ravishda boshqaradi.

## Ibtido kitobini qayta yozish {#recommitting-genesis}

Bir tengdoshi genesisni faqat uning saqlanishi bo'sh bo'lganda amalga oshiradi. Bir martalik lokalnetda yangi genesisni sinovdan o'tkazish uchun tengdoshlarni to'xtatish, ularning yaratilgan davlat direktoriyasini olib tashlash va yangi imzolangan genesisdan boshlanish kerak. Har bir tasdiqlovchi bir xil migratsiyani muvofiqlashtirmasa, harakatlanayotgan tarmoqda genesisni almashtirmang.
