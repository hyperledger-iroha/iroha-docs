---
translation_locale: uz
translation_source: /help/integration-issues.md
translation_source_hash: 2146a236adb3a3b3b896a1992daeecf6713988183ca53e4412f9b616ed2e9085
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Integratsiya muammolarini bartaraf etish {#troubleshooting-integration-issues}

Ushbu bo‘lim Iroha 3 integratsiyasi bo‘yicha muammolarni hal qilish bo‘yicha maslahatlarni taklif qiladi. Agar siz duch kelayotgan muammo bu yerda tavsiflanmagan bo‘lsa, biz bilan [Telegram](https://t.me/hyperledgeriroha) orqali bog‘laning.

## Mijoz ulanib bo‘lmaydi {#client-cannot-connect}

Mijoz konfiguratsiyasi tarmoq hamkasbi Torii manziliga ishora qilishini tekshiring:

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI tekshiruvlari uchun, bir xil faylni aniq ko‘rsatib o'ting:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

Agar tarmoq hamkori Docker yoki Kubernetesda ishlasa, mijoz jarayonidan yetib boriladigan host yoki xizmat manzilidan foydalaning. Konteyner ichidagi `127.0.0.1` host mashina emas.

Ochiq Taira sinovlarini imzolanmagan endpoint tekshiruvidan boshlang:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Bu buyruqlar `502`, TLS, DNS yoki vaqt cheklovi xatolari bilan tugasa, hisob kalitlari yoki tranzaksiya foydali yuklarini tekshirishdan oldin tarmoq ulanishini tuzating yoki ochiq testnet endpointi ishlashini kuting.

## Tranzaksiyalar rad etildi {#transactions-are-rejected}

Ko‘pgina tranzaksiya muvaffaqiyatsizliklarining sababi shaxsni tasdiqlash yoki ruxsatnomalar mos kelmasligidir:

- mijoz konfiguratsiyasidagi hisobning jamoa kaliti imzolash uchun ishlatiladigan shaxsiy kalit bilan mos kelmaydi
- hisob blockchain genesisda yoki oldingi tranzaksiya orqali ro‘yxatdan o‘tgan emas
- hisobda dasturiy ta'minotni ishga tushirish muhiti tekshiruvchisi talab qiladigan ruxsat tokeni yoki rol yo‘q
- domen ID sida `domain.dataspace` kabi ma’lumotlar makoni aniqlashtirishi yetishmaydi

`--output-format text` dan CLI buyruqlarini xatoliklarni osonroq o‘qish uchun tekshirish paytida foydalaning:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority --output-format text tx ping --msg "hello"
```

## So‘rovlar bo‘sh natijalarni qaytaradi {#queries-return-empty-results}

Bo'sh so'rov natijalari har doim so'rov muvaffaqiyatsiz bo'lganini anglatmaydi. Tekshiring:

- ob'ektni yaratishi kerak bo'lgan tranzaksiya yakunlandi
- so‘ralgan domen, aktiv ta’riflash yoki hisob IDsi kanonik
- paginatsiya yoki filtrlash kutilgan qatorni chiqarib tashlamayapti
- mijoz mo‘ljallangan tarmoqqa ulangan, boshqa mahalliy tarmoqqa emas

Domen tekshiruvlari uchun eng keng qamrovli so'rovdan boshlang:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

## Voqea yoki blok oqimlari erta to'xtaydi {#event-or-block-streams-stop-early}

Blok va hodisa oqimi misollari Torii oqim endpointlariga tayanadi. Tengdosh hali ishlayotganini tekshiring, so‘ng vaqt cheklovi bilan sinang:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP integratsiyalari uchun endpoint yo‘llaringizni joriy [Torii endpointlari ma’lumotnomasi](/uz/reference/torii-endpoints.md) bilan solishtiring.
