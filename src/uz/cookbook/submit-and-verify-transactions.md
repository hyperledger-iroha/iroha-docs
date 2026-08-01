---
translation_locale: uz
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: e07cc42a3fd5579db312bfbfbb8010f473062edebe0141eb9bb8c2a0e7faa4da
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Transaksiyalarni taqdim etish va tekshirish {#submit-and-verify-transactions}

## Natija {#outcome}

Taira tranzaksiyasini oldindan o'tkazish, to'g'ri to'lov taklifini qabul qilish, uni imzolash va jo'natish, qo'llaniladigan yakuniylikni kutish va amalga oshirilgan tranzaksiyani hash orqali tasdiqlash.

## Oldingi shartlar {#prerequisites}

- [ tomonidan ishlab chiqarilgan mablag' bilan ta'minlangan `taira.client.toml`, `taira.tx-metadata.json` va `TAIRA_ACCOUNT_ID` Taira](./connect-to-taira.md) bilan bog'liq.
- `iroha` CLI va `jq` oqimi.
- Bir marta ishlatiladigan Taira imzochisi. Uning kalitidan yoki ushbu buyruqlarni Minamoto ga yozishdan foydalaning.

## qadamlar {#steps}

### 1. Keyingi nuqta, vakolat va to'lovlar balansini oldindan belgilash {#_1-preflight-the-endpoint-authority-and-fee-balance}

Avval navbatdagi fotosuratni o'qing, so'ngra vakolatli organning to'lov balansining ko'rinishini isbotlang. ID Ulanish retseptida hosil bo'lgan metadatalardan.

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

Hisobvaraq yoki to'lovning balansini yo'qotganda to'xtating. To'g'ri yo'l-yo'riq uning hokimiyati to'lay olmaganida, to'lovni qabul qilishdan o'tmaydi.

### 2. Bir marta tilga olish, imzolash va taqdim etish {#_2-quote-sign-and-submit-once}

CLI to'g'ri imzolanmagan foydali yukni to'lov taklifini yuboradi, qabul qilingan to'lov niyatini tranzaksiyaga bog'laydi, imzolaydi va taqdim etadi. JSON rejimi tranzaksiya hashini, imzolangan tranzaksiyani va qabul qilingan narxni birgalikda qaytaradi.

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

Ushbu retseptda `--no-wait` dan foydalanmang. Buyruq muvaffaqiyatli rasvot yozishdan oldin tasdiqlanishini kutadi.

### 3. Terminal quvurining holatini kuting. {#_3-wait-for-terminal-pipeline-state}

HTTP qabul qilish yoki navbatga kirishdan muvaffaqiyat tug'dirishning o'rniga bosilgan holat yordamchisidan foydalaning. `--wait` bilan xavfsiz yo'nalish doirasi avtomatik ravishda tanlanadi va andoza maqsad qo'llaniladigan yakuniylik hisoblanadi.

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

`Rejected` va `Expired` terminal muvaffaqiyatsizliklar, qayta tiklanishi mumkin bo'lmagan muvaffaqiyat holatlari hisoblanadi.

### 4. saqlashni o'qing. {#_4-read-the-stored-transaction}

Pipeline holati ishlov berish tugaganmi yoki yo'qmi javob beradi. Transaksiya so'rovida qabul qilingan bitim bir xil hash ostida saqlanishini tasdiqlaydi.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Eksplorator ikkinchi, faqat o'qiladigan kuzatuv yuzasidir. U quvurning yakunida biroz orqada qolishi mumkin.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Davlat o'zgarishi ko'rsatmasi uchun mutatsiya qilingan ob'ektni so'rov bilan yakunlang. [Metadata](./metadata.md), [Fungible assets](./fungible-assets.md) va [NFTs](./nfts.md) retseptlarida ushbu davlatdan keyingi o'qishlar mavjud.

## Tekshirish {#verify}

Uchta ro'yxatning hammasi bir xil hash bo'yicha kelishilganligini va kashfiyotchi o'tib ketayotgan holat haqida xabar bermayotganini tekshiring:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Taqdim qilingan hujjatni va yakuniy holatini sinov dalillari sifatida saqlang. Ularda imzolash kalitini emas, balki ochiq bitim materiallarini o'z ichiga oladi.

## Muammoni hal qilish {#troubleshooting}

- HTTP `202` yoki navbatdagi holat faqat qabulni tasdiqlaydi. Qo'llaniladigan, rad etilgan, tugagan yoki cheklangan muddatga qadar tiklangan holatda saylovni davom ettiring.
- Agar hashni qaytargandan so'ng jo'natish muddati tugagan bo'lsa, boshqa tranzaksiyani tuzishdan oldin ushbu hashni so'rang. Ko'r qayta jo'natilish yangi tilga olingan va imzolangan fayzli yukni yaratadi.
- To'lov taklifini imzolashdan oldin rad etish mumkin. `--fee-payer authority`, `gas_asset_id`, organ balansini va tarmoq zanjirini tekshirish ID.
- `Rejected` odatda yo'l-yo'riqlarni tasdiqlash, ruxsatnomalar, to'lovlar yoki eskirgan holatni ko'rsatadi. Bu muvaffaqiyatsiz bajarilishning kafolatlangan dalilidir va transport qayta urinish sifatida qayta tasniflanmasligi kerak.
- Eksplorator `404` to'g'ridan-to'g'ri ilova qilinganidan keyin indekslash kechiktirilishi mumkin. O'qishni qayta sinab ko'ring; tranzaksiyani qayta taqdim qilmang.
- Agar imtiyozli ko'rsatma hosil bo'lgan lokal tarmoqda ishlasa, ammo Taira uni rad etsa, aniq Taira ruxsatnoma yoki boshqariladigan nomlar maydonini berish uchun murojaat qiling.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Tranzaksiyalarni taqdim etish va to'lov kvotasi o'rnatilgan majburiyatda amalga oshirilishi ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Transaction confirmation tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/tests/tx_confirmation.rs)
- [Operatsiyalar](/uz/blockchain/transactions.md)
- [CLI qo'llanma](/uz/get-started/operate-iroha-via-cli.md)
- [Torii oxirgi nuqtalari](/uz/reference/torii-endpoints.md)
