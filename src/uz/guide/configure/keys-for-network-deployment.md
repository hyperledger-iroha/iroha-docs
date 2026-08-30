---
translation_locale: uz
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
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
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

mavjud tarmoq yoki profil uchun yo'naltirilgan oqimdan foydalaning:

```bash
cargo run --bin kagami -- wizard
```

## Har bir kalit juftligini yarating {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## Tengdoshlar o'rtasida hamjihatlik {#peer-consistency}

Barcha validatorlar bir xil genesis transaksiyasi, topologiyasi, ishonchli o'rtacha ochiq kalitlari va validator PoPs haqida kelishib olishlari kerak. Bir xil yo'qolgan yoki mos kelmagan tengdosh kalit tarmog'ining ishga tushirilishiga yoki kelishuvga erishilishiga to'sqinlik qilishi mumkin.

Bizans xatolariga chidamli bo'lish uchun kamida to'rtta tengdoshdan foydalaning. Har bir tengdoshning o'z xususiy kaliti bo'lishi kerak, ammo har bir tengdoshi konfiguratsiyasiga bitta ishonchli tengdoshlar soni kerak.

## Mijoz hisobvaraqlari {#client-accounts}

`client.toml`dagi mijoz hisob raqami allaqachon zanjirda mavjud bo'lishi kerak. U genesis manifestida yoki keyingi operatsiya orqali ro'yxatdan o'tishi mumkin. Genesis imzolash kimligini uzoq muddatli ariza hisobi sifatida ishlatishdan qo'rqish; genesis imtiyozlari faqat genesis raundi davomida qo'llaniladi va ishlab chiqarish mijozlari o'z hisoblarini va rollaridan foydalanishlari kerak.
