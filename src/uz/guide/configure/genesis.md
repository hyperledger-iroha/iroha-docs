---
translation_locale: uz
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: google-translate
---

# Ibtido {#genesis}

Genesis boshlang'ich zanjir holatini belgilaydi.Tahrirlanadigan manba a JSON manifest,
va an Iroha 3 tugun imzolanganni iste'mol qiladi Norito tranzaksiya fayli.

::: details Birlamchi genezis manifest

<<< @/snippets/genesis.json

:::

## Fayllar {#files}

Yuqori oqim ombori standart manifestni jo'natadi `defaults/genesis.json`.
Kagami-Yaratilgan tarmoqlar o'zlarining manifest va imzolangan tranzaktsiyalarini yozadilar
chiqish katalogi:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Yaratilgan `README.md` bu katalogda aniq fayllarni yozib oladi va ishga tushiradi
tanlangan profil uchun buyruqlar.

## Tengdosh konfiguratsiyasi {#peer-configuration}

Tengdoshlar imzolangan genezis bitimiga ishora qiladilar `[genesis]` bo'limi
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Tarmoqdagi barcha tengdoshlar imzolangan genezis bitimi va bitim bo'yicha kelishib olishlari kerak
genezis ochiq kaliti.

## Ibtidoni imzolash {#signing-genesis}

Agar siz manifestni qo'lda tahrir qilsangiz, tengdoshlarni ishga tushirishdan oldin uni tasdiqlang va imzolang:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` egasining rejimi bo'lishi kerak`0600`, yagona bo'g'inli
bitta kanonik shaxsiy kalit multihash va yakuniy kalitni o'z ichiga olgan oddiy fayl
yangi qator. Kagami ramziy aloqalarni rad etadi va hech qachon xom genezni xususiy qabul qilmaydi
buyruq satridagi tugmachani bosing.

NPoS uchun yoki Nexus profillar, topologiyani o'z ichiga oladi va BLS Egalik guvohnomalari
yaratilgan profil tomonidan talab qilinadi. Kagami `localnet`, `wizard`, va profil
avlod buyruqlari ushbu tafsilotlarni avtomatik ravishda boshqaradi.

## Ibtidoni takrorlash {#recommitting-genesis}

Tengdosh faqat saqlash joyi bo'sh bo'lganda genezisni amalga oshiradi.Yangi genezisni sinab ko'rish uchun
bir martalik mahalliy tarmoq, tengdoshlarni to'xtating, ularning yaratilgan davlat katalogini olib tashlang,
va yangi imzolangan genezisdan boshlang.Yugurishda genezisni almashtirmang
har bir validator bir xil migratsiyani muvofiqlashtirmasa, tarmoq.
