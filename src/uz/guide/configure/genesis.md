---
translation_locale: uz
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ibtido {#genesis}

Ibtido dastlabki zanjir holatini belgilaydi. tahrirlanadigan manba JSON ko'rsatilgan;
va Iroha 3 nishonlangan nodni iste'mol qiladi Norito Transaksiya fayli.

::: details Dastlabki genesis manifest

<<< @/snippets/genesis.json

:::

## Fayllar {#files}

Yuqori tomondagi ma'muriyat andoza manifestni `defaults/genesis.json`.
Kagami- ishlab chiqilgan tarmoqlar o'zlarining manifest va imzolangan tranzaksiyalarini
Ishlab chiqarish direktoriyasi:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Ishlab chiqarilgan `README.md` ushbu direktoriyada aniq fayllarni qayd etadi va ishga tushiriladi
tanlangan profil uchun buyruqlar.

## Tengdoshlar soni {#peer-configuration}

O'rtalar o'rtasida imzolangan genesis tranzaksiyasi `[genesis]` to ' rtinchi qismida
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Tarmoqdagi barcha tengdoshlar imzolangan genesis muomalasi va
Ibtidodagi ommaviy kalit.

## Ibtido kitobining imzolanishi {#signing-genesis}

Agar siz manifestni qo'lda tahrirlasangiz, tengdoshlarni boshlashdan oldin uni tasdiqlash va imzolash:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

NPoS yoki Nexus profillar topologiya va BLS O'z egaligi to'g'risidagi dalillar
hosil qilingan profil talab qiladi. Kagami `localnet`, `wizard`, va profil
Generatsiya buyruqlari ushbu tafsilotlarni avtomatik ravishda boshqaradi.

## Ibtido kitobini qayta yozish {#recommitting-genesis}

Bir tengdosh genesis faqat uning saqlash bo'sh bo'lganda amalga oshiradi.
bir martalik lokalnet, tengdoshlarni to'xtatish, ularning yaratilgan davlat direktoriyasini olib tashlash,
Yangi imzolangan genesisdan boshlang.
tarmoq, agar har bir tasdiqlovchi bir xil migratsiyani muvofiqlashtirmasa.
