---
translation_locale: uz
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Tranzaksiyalarni yuborish va tasdiqlash {#submit-and-verify-transactions}

## Natija {#outcome}

Taira tranzaksiyasini oldindan tekshiring, aniq to‘lov narxi taxminini qabul qiling, imzolang va yuboring, qo‘llanilgan yakuniylikni kuting va kriptografik xash orqali yakunlangan tranzaksiyani tasdiqlang.

## Oldingi talablar {#prerequisites}

- [Taira ga ulaning](./connect-to-taira.md) tomonidan ishlab chiqarilgan moliyalashtirilgan `taira.client.toml`, `taira.tx-metadata.json` va `TAIRA_ACCOUNT_ID`.
- Joriy `iroha` CLI va `jq`.
- Bir martalik Taira imzolovchi. Uning kalitini yoki bu yozuv buyruqlarini Minamoto da qayta ishlatmang.

## Qadamlar {#steps}

### 1. API tugun nuqtasini, vakolat hisobini va to‘lov balansini oldindan tekshiring {#_1-preflight-the-endpoint-authority-and-fee-balance}

Avval navbatdagi nuqtai nazardagi ma'lumotlar ko‘rinishini o‘qing, keyin avtorizatsiya qiluvchi shaxsning to‘lov balansini ko‘rish mumkinligini isbotlang. Ulash retseptlari tomonidan yaratilgan metadata'dan Base58 aktiv-ta’rif ID'sini o‘qing.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Agar hisob yoki to‘lov balansi bo‘lmasa, to‘xtang. Agar uning vakolat hisobi to‘lovni qila olmasa, haqiqiy ko‘rsatma to‘lov qabulini o‘tkazolmaydi.

### 2. Narx so‘rash, imzolash va bir marta yuborish {#_2-quote-sign-and-submit-once}

CLI aniq imzosiz yukni to‘lov narxi taxmini uchun yuboradi, qabul qilingan to‘lov niyatini tranzaksiyaga bog‘laydi, imzolaydi va yuboradi. JSON rejimi tranzaksiyaning kriptografik xeshini, imzolangan tranzaksiyani va qabul qilingan taklifni birgalikda qaytaradi.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

Ushbu retseptda `--no-wait` dan foydalanmang. Buyruq muvaffaqiyatli protokol natijalari yozuvini yozishdan oldin tasdiqni kutadi.

### 3. Terminal dasturiy ta'minot ish jarayoni holatini kuting {#_3-wait-for-terminal-pipeline-state}

Muvaffaqiyatni HTTP qabul qilinishidan yoki navbatga kiritilishidan taxmin qilish o‘rniga yozilgan holat yordamchisidan foydalaning. `--wait` bilan xavfsiz yo‘naltirish doirasi avtomatik ravishda tanlanadi va standart maqsad Tatbiq etilgan yakuniylik hisoblanadi.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` va `Expired` — qayta uriniladigan muvaffaqiyat holatlari emas, balki yakuniy xatolar. Tranzaksiyani o‘zgartirish yoki qayta tuzishdan oldin sababini yozib oling.

### 4. Saqlangan tranzaksiyani o‘qing {#_4-read-the-stored-transaction}

Dasturiy ta'minot ishlov berish ish oqimi holati, ishlov berish tugaganligini javob beradi. Tranzaksiya so'rovi qabul qilingan tranzaksiya bir xil kriptografik xash ostida saqlanganligini tekshiradi.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Explorer — ikkinchi, faqat o‘qishga mo‘ljallangan kuzatuv yuzasi. U konveyer yakuniyligidan qisqa muddat ortda qolishi mumkin.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Davlatni o‘zgartiruvchi ko‘rsatma uchun, o‘zgartirilgan obyektni so‘rov bilan yakunlang. [Metama'lumot](./metadata.md), [Almashtiriladigan aktivlar](./fungible-assets.md) va [NFTs](./nfts.md) retseptlari shu holatdan keyingi o‘qishlarni o‘z ichiga oladi.

## Tekshirish {#verify}

Uchala yozuvning ham bir xil kriptografik xeshga ega ekanligini va explorer endi kutish holatini bildirayotganini tekshiring:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Yuborish protokoli natijalari yozuvini va yakuniy holatni test dalili sifatida saqlang. Ularda imzo kaliti emas, balki jamoat tranzaksiyasi materiallari mavjud.

## Muammolarni bartaraf etish {#troubleshooting}

- HTTP `202` yoki navbatdagi holat faqat qabul qilinganini tasdiqlaydi. Typed holatini Applied, Rejected, Expired yoki belgilangan vaqt tugaguncha so‘rov qilib turishni davom ettiring.
- Agar topshirish kriptografik xeshni qaytargandan keyin vaqti tugasa, boshqa tranzaksiya tuzishdan oldin o‘sha kriptografik xeshni so‘rang. Ko‘z yummoq tarzidagi qayta topshirish yangi iqtiboslangan va imzolangan yukni yaratadi.
- To'lov narxi taxmini imzolanmasdan rad etilishi mumkin. `--fee-payer authority`, `gas_asset_id`, vakolatli shaxsning qoldig'ini va tarmoq zanjiri ID sini tekshiring.
- `Rejected` odatda ko‘rsatma tasdiqlash, ruxsatnomalar, to‘lovlar yoki eskirgan holatni bildiradi. Bu bajarilmagan amalga oshirishning yakuniy dalilidir va transportni qayta urinish sifatida qayta tasniflanmasligi kerak.
- Bir tadqiqotchi `404` Qo‘llanganidan so‘ng darhol indekslash kechikishi bo‘lishi mumkin. O‘qishni qayta urinib ko‘ring; tranzaksiyani qayta yubormang.
- Agar imtiyozli ko‘rsatma yaratilgan localnetda ishlasa, lekin Taira uni rad etsa, aniq Taira ruxsatini yoki boshqariladigan namespace tayinlovini oling. Lokal natija jamoat blokcheyn tarmog‘i vakolatini bermaydi.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Bitim yuborilishi va to'lov narxini ko'rsatish pinlangan manba-kod reviziyasida amalga oshiriladi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Bitimni tasdiqlashni amalga oshirish va sinovlarni pinlangan manba-kod reviziyasida o'tkazish](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [Tranzaksiyalar](/uz/blockchain/transactions.md)
- [CLI qo'llanma](/uz/get-started/operate-iroha-via-cli.md)
- [Torii API oxir nuqtalar](/uz/reference/torii-endpoints.md)
