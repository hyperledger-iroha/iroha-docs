---
translation_locale: uz
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Integratsiya muammolarini hal qilish {#troubleshooting-integration-issues}

Ushbu bo'limda Iroha 3 integratsiyasi uchun muammolarni hal qilish maslahatlari mavjud. Agar siz boshdan kechirayotgan muammo bu erda tasvirlanmagan bo'lsa, biz bilan [Telegram](https://t.me/hyperledgeriroha) orqali bog'lanishingiz mumkin.

## Mijoz aloqa oʻrnatolmaydi {#client-cannot-connect}

Mijoz konfiguratsiyasi tengdoshlari Torii manzilini ko'rsatishini tekshirib ko'ring:

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI tekshiruvlari uchun aynan shu faylni aniq o'tkazib yuboring:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Agar tengdoshlar kirsa Docker yoki Kubernetes, foydalanuvchi yoki xizmat manzilidan foydalaning mijoz jarayoni orqali murojaat qilish mumkin. `127.0.0.1` konteyner ichida uy egasi mashina yo'q.

Umumiy Taira sinovlari uchun imzolanmagan oxirgi nuqta sondasi bilan boshlang:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Agar ushbu buyruqlar `502`, TLS, DNS yoki vaqt ajratish xatosi bilan muvaffaqiyatsiz bo'lsa, hisob kalitlari yoki tranzaksiya faydali yuklarni debug qilishdan oldin tarmoqga kirishni to'g'rilash yoki ommaviy testnet oxirgi nuqtani kuting.

## Transaksiyalar rad etiladi {#transactions-are-rejected}

Aksariyat tranzaksiyalarning muvaffaqiyatsizliklari identifikatsiya yoki ruxsat etish mos kelmasligi tufayli sodir boʻladi:

- mijoz konfiguratsiyasidagi hisobning ochiq kaliti imzolash uchun ishlatilgan xususiy kalitiga mos kelmaydi.
- hisob qaydnomasi boshlang'ichda yoki avvalgi bitim orqali ro'yxatdan o'tkazilmagan
- hisobda ishga tushirish vaqtini tasdiqlovchi tomonidan talab qilingan ruxsat belgisi yoki roli yo'q
- ID domeni o'z ma'lumotlar maydonida malakaga ega emas, masalan, `domain.dataspace`

Xatolarni o'qish oson bo'lishi uchun `--output-format text` buyruqlarini debug qilishda CLI dan foydalaning:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Soʻrovlar boʻsh natijalarni qaytaradi {#queries-return-empty-results}

Bo'sh so'rov natijalari har doim ham so'rov muvaffaqiyatsiz tugadi degani emas. Tekshiring:

- ob'ektni yaratishi kerak bo'lgan bitim amalga oshirildi
- so'ralgan domen, aktivning tavsifi yoki hisob raqami ID kanonikdir
- sahifalash yoki filtrlar kutilayotgan qatorni istisno qilmaydi
- mijoz mo'ljallangan tarmoqga ulanishgan, boshqa lokal tarmoq emas

Domen tekshiruvlari uchun eng keng so'rovdan boshlang:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Tadbir yoki blok oqimlari erta toʻxtadi {#event-or-block-streams-stop-early}

Blok va hodisalar oqimi namunalari Torii oqim oxirgi nuqtalariga bog'liq. Tengdosh hali ishlayotganligini tekshirib ko'ring, so'ngra vaqt ajratish bilan sinovdan o'tkazing:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP integratsiyalari uchun oxirgi nuqta yo'nalishlarini joriy [Torii oxirgi nuqtani ko'rsatkich bilan solishtiring ](/uz/reference/torii-endpoints.md).
