---
translation_locale: uz
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Tarmoqni ishga tushirishning kalitlari {#keys-for-network-deployment}

Har bir tarmoq mijozlar, tengdoshlar, genesis imzolash va NPoS yoki Nexus profillari uchun BLS tasdiqlovchi identifikatsiyalari uchun alohida kalit materiallarga muhtoj.

## Ochiqdan qayerda foydalanish mumkin {#where-keys-are-used}

- Mijoz imzolash kalitlari `client.toml` ostida `[account]`-da saqlanadi.
- Har bir tenglamchi `config.toml` ning `public_key` va `private_key` sifatida tenglamchi identifikatsiya kalitlari saqlanadi.
- Tengdoshlarni kashf etish `trusted_peers` da har bir tengdoshning ommaviy kalitidan foydalanadi.
- BLS tasdiqlovchi NPoS profillari uchun egalik guvohnomasi `trusted_peers_pop` da saqlanadi.
- Ibtido imzosi manifestni imzolashda `[genesis].public_key` ning o'rtacha konfiguratsiyasida va shunga mos bo'lgan xususiy kalitdan foydalanadi.

Mahalliy yoki sinov dasturlari uchun Kagami ushbu fayllarning barchasini birgalikda yaratishga ruxsat bering:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

mavjud tarmoq yoki profil uchun yo'naltirilgan oqimdan foydalaning:

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## Har bir kalit juftligini yarating {#generate-individual-key-pairs}

O'z-o'zidan foydalanish uchun `kagami keys`:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

BLS tasdiqlovchi material uchun egalik guvohnomasi kiriting:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--seed` ni faqat qayta tiklanishi mumkin bo'lgan ishlab chiqarish uskunalari uchun ishlating. Ishlab chiqarishni ishga tushirish uchun yangi kalitlarni yaratish va xususiy kalitlarni ombordan tashqarida saqlash.

## Tengdoshlar o'rtasida hamjihatlik {#peer-consistency}

Barcha validatorlar bir xil genesis transaksiyasi, topologiyasi, ishonchli o'rtacha ochiq kalitlari va validator PoPs haqida kelishib olishlari kerak. Bir xil yo'qolgan yoki mos kelmagan tengdosh kalit tarmog'ining ishga tushirilishiga yoki kelishuvga erishilishiga to'sqinlik qilishi mumkin.

Bizans xatolariga chidamli bo'lish uchun kamida to'rtta tengdoshdan foydalaning. Har bir tengdoshning o'z xususiy kaliti bo'lishi kerak, ammo har bir tengdoshi konfiguratsiyasiga bitta ishonchli tengdoshlar soni kerak.

## Mijoz hisobvaraqlari {#client-accounts}

`client.toml`dagi mijoz hisob raqami allaqachon zanjirda mavjud bo'lishi kerak. U genesis manifestida yoki keyingi operatsiya orqali ro'yxatdan o'tishi mumkin. Genesis imzolash kimligini uzoq muddatli ariza hisobi sifatida ishlatishdan qo'rqish; genesis imtiyozlari faqat genesis raundi davomida qo'llaniladi va ishlab chiqarish mijozlari o'z hisoblarini va rollaridan foydalanishlari kerak.
