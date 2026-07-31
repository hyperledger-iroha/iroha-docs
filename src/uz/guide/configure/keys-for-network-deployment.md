---
translation_locale: uz
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Tarmoqni ishga tushirishning kalitlari {#keys-for-network-deployment}

Har bir tarmoq mijozlar, tengdoshlar, genesis imzolari uchun alohida asosiy materiallarga muhtoj.
va NPoS uchun yoki Nexus profillar, BLS tasdiqlovchi identifikatsiyalari.

## Ochiqdan qayerda foydalanish mumkin {#where-keys-are-used}

- Mijoz imzolash kalitlari `client.toml` koʻrsatkich `[account]`.
- Har bir tengdoshda tengdosh identifikatsiya kalitlari saqlanadi `config.toml` sifatida `public_key` va
  `private_key`.
- Tengdoshlar kashfiyoti har bir tengdoshning ommaviy kalitidan foydalanadi `trusted_peers`.
- BLS sertifikatlash vositasi `trusted_peers_pop` NPOS uchun
  profillar.
- Ibtido imzosi `[genesis].public_key` tengdoshlar konfigida va
  Manifesti imzolash paytida xususiy kalitga mos keladi.

Mahalliy yoki sinov joylashtirish uchun ruxsat berish Kagami ushbu fayllarning barchasini birgalikda yaratish:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Mavjud tarmoq yoki profil uchun yo'naltirilgan oqimdan foydalaning:

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## Har bir kalit juftligini yaratish {#generate-individual-key-pairs}

Foydalanish `kagami keys` mustaqil kalit material uchun:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

uchun BLS tasdiqlovchi material, mulkdorlik guvohnomasini o'z ichiga oladi:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

Foydalanish `--seed` Faqat qayta tiklanishi mumkin bo'lgan o'rnatish uskunalari uchun.
ishga tushirish, yangi kalitlarni yaratish va xususiy kalitlarni ombordan tashqarida saqlash.

## Tengdoshlar o'rtasidagi muvozanat {#peer-consistency}

Barcha tasdiqlovchilar bir xil genesis muomalasi, topologiya, ishonchli
O'zaro ochiq kalitlar va tasdiqlash vositasi PoPs. Birgina yo'qolgan yoki mos kelmagan tengdosh kalit
tarmoqni boshlash yoki konsensusga erishish imkonini beradi.

Bizansning xatolarga chidamli bo'lishi uchun kamida to'rtta tengdoshdan foydalaning.
tengdoshning o'z xususiy kaliti bo'lishi kerak, lekin har bir tengdosh konfiguratsiyasiga bir xil
Ishonchli tengdoshlar to'plami.

## Mijoz hisobvaraqlari {#client-accounts}

Mijoz hisob raqami `client.toml` bu borada mavjud bo'lishi kerak.
genesis manifestida yoki keyinchalik amalga oshirilgan bitimda ro'yxatga olingan.
genesis nomini uzoq muddatli ariza sifatida imzolash; genesis imtiyozlari
faqat genesis raundi davomida qo'llaniladi va ishlab chiqarish mijozlari o'zlarining
hisob-kitoblar va vazifalar.
