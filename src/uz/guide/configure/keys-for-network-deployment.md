---
translation_locale: uz
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Tarmoqni joylashtirish uchun kalitlar {#keys-for-network-deployment}

Har bir tarmoqda mijozlar, tugunlar va boshlang‘ich holatni imzolash uchun, NPoS yoki Nexus profillarida esa BLS tasdiqlovchi identifikatorlari uchun alohida kalit materiali kerak.

## Kalitlar qaerda ishlatiladi {#where-keys-are-used}

- Mijoz imzo kalitlari `client.toml` ichida `[account]` ostida saqlanadi.
- Tugun identifikatsiya kalitlari har bir tugunning `config.toml` faylida `public_key` va `private_key` sifatida saqlanadi.
- tarmoq hamkasbini aniqlash har bir tarmoq hamkasbining ochiq kalitidan `trusted_peers` da foydalanadi.
- BLS tasdiqlovchi Proofs-of-Possession NPoS profillari uchun `trusted_peers_pop` da saqlanadi.
- Boshlang‘ich holatni imzolash tugun konfiguratsiyasidagi `[genesis].public_key` va manifestni imzolashda unga mos maxfiy kalitdan foydalanadi.

Mahalliy yoki sinov joylashtirishlar uchun, Kagami ushbu fayllarning barchasini birga yaratishga ruxsat bering:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Mavjud tarmoq yoki profil uchun, yo‘riqnoma bo‘yicha oqimdan foydalaning:

```bash
cargo run --bin kagami -- wizard
```

## Shaxsiy Kalit Juftliklarini Yaratish {#generate-individual-key-pairs}

Mustaqil kalit materiali uchun `kagami keys` dan foydalaning:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

BLS tasdiqlovchi materiali uchun egalik isbotini ham kiriting:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--seed-hex` dan faqat qayta yaratiladigan dasturlash sinov namunalari uchun aniq 32 baytli o‘n oltilik sir bilan foydalaning. Ishlab chiqarishga joylashtirishda uni bermang: Kagami operatsion tizim tasodifiyligidan foydalansin, so‘ng shifrlanmagan maxfiy kalit eksportini tasdiqlangan saqlov chegarasiga ko‘chiring. Buyruq maxfiy kalitlarni hech qachon chiqarmaydi.

## tarmoq tengdoshining mosligi {#peer-consistency}

Barcha validatorlar bir xil genezis tranzaksiyasi, topologiya, ishonchli tugunlarning ochiq kalitlari va validatorlarga tegishli PoPs bo‘yicha kelishishi kerak. Bitta tugun kalitining yo‘qligi yoki mos kelmasligi ham tarmoqning ishga tushishi yoxud konsensusga erishishiga to‘sqinlik qilishi mumkin.

Minimal Bizans-xatolikka chidamli tizimni ishga tushirish uchun, kamida to'rtta tarmoq tengdoshidan foydalaning. Har bir tarmoq tengdoshi o'z shaxsiy kalitiga ega bo'lishi kerak, lekin har bir tarmoq tengdoshi konfiguratsiyasi bir xil ishonchli tarmoq tengdoshlari to'plamini talab qiladi.

## Mijoz hisoblari {#client-accounts}

`client.toml` dagi mijoz hisob qaydnomasi allaqachon zanjirda mavjud bo‘lishi kerak. U blokcheyn boshlang‘ich manifesti yoki keyingi tranzaksiya orqali ro‘yxatdan o‘tkazilishi mumkin. Blockchain genesis imzo identifikatoridan uzoq muddatli ilova hisob sifatida foydalanishdan saqlaning; blockchain genesis imtiyozlari faqat blockchain genesis raundi davomida amal qiladi, va ishlab chiqarish mijozlari o‘z hisoblari va rollaridan foydalanishi kerak.
