---
translation_locale: uz
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Integratsiya muammolarini hal qilish {#troubleshooting-integration-issues}

Ushbu boʻlimda muammolarni hal qilish uchun maslahatlar mavjud Iroha 3 integratsiya. Agar muammo
siz boshdan kechirayotgan voqealar bu yerda tasvirlanmagan.
biz bilan bog'laning [Telegram](https://t.me/hyperledgeriroha).

## Mijoz ulanish imkoniyatiga ega emas {#client-cannot-connect}

Mijozning konfiguratsiyasi tengdoshlariga ishora qilishiga ishonch hosil qiling Torii manzili:

```toml
torii_url = "http://127.0.0.1:8080/"
```

uchun CLI tekshiruvi, aynan shu faylni aniq o'tkazish:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Agar tengdoshlar kirsa Docker yoki Kubernetes, foydalanuvchi yoki xizmat manzilidan foydalaning
mijoz jarayoni orqali amalga oshirilishi mumkin. `127.0.0.1` konteyner ichida
uy egasi mashina.

Jamoat uchun Taira sinovlar imzolanmagan oxirgi nuqta sondasi bilan boshlanadi:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Agar bu buyruqlar muvaffaqiyatsiz tugasa `502`, TLS, DNS, yoki vaqtni o'tkazish xatolari, tarmoqni tuzatish
yo'l olish imkoniyati yoki hisobni debug qilishdan oldin testnet oxirgi nuqtasini kutish
kalitlar yoki muomala yuklari.

## Transaksiyalar rad etiladi {#transactions-are-rejected}

Koʻpgina muomala muvaffaqiyatsizliklari kimlik yoki ruxsat etish mos kelmasligi tufayli sodir boʻladi:

- mijoz konfiguratsiyasidagi hisobning ochiq kaliti xususiy kalitiga mos kelmaydi
  imzolash uchun ishlatiladi
- hisob qaydnomasi boshlang'ichda yoki avvalgi bitim bilan ro'yxatdan o'tmagan
- hisobda ishga tushirish vaqtida talab etiladigan ruxsatnoma belgisi yoki roli yo'q
  tasdiqlovchi
- domen ID ma'lumotlar maydonining kvalifikatsiyasidan mahrum bo'lgan, masalan:
  `domain.dataspace`

Foydalanish `--output-format text` debugging paytida CLI xatolar osonroq boʻlishi uchun buyruqlar
o'qish uchun:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Soʻrovlar boʻsh natijalarni qaytaradi {#queries-return-empty-results}

Bo'sh so'rov natijalari har doim ham so'rov muvaffaqiyatsiz tugadi degani emas. Tekshirish:

- ob'ektni yaratishi kerak bo'lgan bitim amalga oshirildi
- so'rovlangan domen, aktivlar ta'riflanishi yoki hisob ID kanonik
- sahifalashtirish yoki filtrlar kutilayotgan satrni istisno qilmaydi
- mijoz maqsadli tarmoqga ulanishgan, boshqa lokal tarmoq emas

Domen tekshiruvlari uchun eng keng so'rovdan boshlang:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Oʻzgarishlar yoki bloklar oʻtishi erta toʻxtadi {#event-or-block-streams-stop-early}

Blok va hodisalar oqimi namunalari Torii oqim tugma nuqtalari.
tengdoshlar hali ham ishlaydi, so'ngra vaqt ajratish bilan sinovdan o'tish:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

uchun HTTP integratsiyalar, oxirgi nuqta yo'nalishlarini joriy bilan taqqoslash
[Torii yakuniy nuqta uchun ma'lumot](/uz/reference/torii-endpoints.md).
