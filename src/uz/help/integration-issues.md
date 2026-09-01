---
translation_locale: uz
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: bing-translator-llm
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
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Agar tarmoq hamkori Docker yoki Kubernetesda ishlasa, mijoz jarayonidan yetib boriladigan host yoki xizmat manzilidan foydalaning. Konteyner ichidagi `127.0.0.1` host mashina emas.

Jamoat Taira testlari uchun, imzosiz API endpoint probe bilan boshlang:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Agar ushbu buyruqlar `502`, TLS, DNS yoki timeout xatoliklari bilan ishlamasa, tarmoqga ulanish imkoniyatini tuzating yoki hisob kalitlarini yoki tranzaksiya paketlarini tekshirishdan oldin jamoat testnet API tugunini kuting.

## Tranzaksiyalar rad etildi {#transactions-are-rejected}

Ko‘pgina tranzaksiya muvaffaqiyatsizliklarining sababi shaxsni tasdiqlash yoki ruxsatnomalar mos kelmasligidir:

- mijoz konfiguratsiyasidagi hisobning jamoa kaliti imzolash uchun ishlatiladigan shaxsiy kalit bilan mos kelmaydi
- hisob blockchain genesisda yoki oldingi tranzaksiya orqali ro‘yxatdan o‘tgan emas
- hisobda dasturiy ta'minotni ishga tushirish muhiti tekshiruvchisi talab qiladigan ruxsat tokeni yoki rol yo‘q
- domen ID o'zining ma’lumotlar makoni kvalifikatsiyasiga ega emas, masalan `domain.dataspace`

`--output-format text` dan CLI buyruqlarini xatoliklarni osonroq o‘qish uchun tekshirish paytida foydalaning:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## So‘rovlar bo‘sh natijalarni qaytaradi {#queries-return-empty-results}

Bo'sh so'rov natijalari har doim so'rov muvaffaqiyatsiz bo'lganini anglatmaydi. Tekshiring:

- ob'ektni yaratishi kerak bo'lgan tranzaksiya yakunlandi
- so‘ralgan domen, aktiv ta’riflash yoki hisob IDsi kanonik
- paginatsiya yoki filtrlash kutilgan qatorni chiqarib tashlamayapti
- mijoz mo‘ljallangan tarmoqqa ulangan, boshqa mahalliy tarmoqqa emas

Domen tekshiruvlari uchun eng keng qamrovli so'rovdan boshlang:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Voqea yoki blok oqimlari erta to'xtaydi {#event-or-block-streams-stop-early}

Blok va hodisa oqimi misollari Torii oqim API tugunlariga tayanadi. Tarmoq hamkorining hali ham ishlayotganini tekshiring, so‘ngra vaqt tugashi bilan sinab ko‘ring:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP integratsiyalari uchun, o'zingizning API endpoint yo'llaringizni joriy [Torii API oxirgi nuqta ma'lumotnoması](/uz/reference/torii-endpoints.md) bilan solishtiring.
