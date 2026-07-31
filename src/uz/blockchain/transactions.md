---
translation_locale: uz
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Transaksiyalar {#transactions}

A **Transaksiya** blokchayndagi ishlarni bajarish uchun imzolangan iltimos.
Ijro qilinadigan fayzli yukning tartibli ketma-ketligi
[ko'rsatmalar](./instructions.md), shartnomaviy qo'ng'iroq, IVM bytecode yoki
isbotlangan IVM o'ldirilgan. [Aqlli shartnomalar](./smart-contracts.md) joriy uchun
shartnomalarni ijro etish modeli.

Transaksiyalar davlatni o'zgartiruvchi yoki bajarilishi mumkin bo'lgan ishlarni amalga oshiradi.
imzolangan so'rovlarni yoki ommaviy o'qish yakun nuqtalarini ishlatadi va tranzaksiya yaratmaydi.

Qarzlangan blokga qabul qilingan tranzaksiya uning bajarilishi bilan saqlanadi
Natija, shu jumladan ijro etish rad etilishi.
qabul qilish, masalan, haqiqiy bo'lmagan konvert yoki navbatda rad etilgan bitim;
blokda saqlanmaydi.

Maxfiylikni saqlaydigan aktivlar harakatlanishi uchun ko'ring
[Anonim bitimlar](./anonymous-transactions.md). Anonim
Transaksiyalar himoyalangan aktiv notlari, majburiyatlar, bekor qilish belgilarini ishlatadi va
davlat hisobidan hisobga balans o'zgarishi o'rniga nol bilimli dalillar.

Tanlangan shaffof ijro ta'sirlari to'g'risidagi dalillar uchun ko'ring
[FastPQ](./fastpq.md). FastPQ odatdan keyin oʻlim guvohlarini isteʼmol qiladi
Transaksiyalarni bajarish va qo'llab-quvvatlanadigan deterministik dalillar partiyalarini yaratish
davlat o'tishlari.

## Uni sinab koʻring . Taira {#try-it-on-taira}

Tadqiqotchi yoʻnalishlaridan foydalanib , soʻnggi jamoatchilikni tekshirib koʻring Taira bloklar va bitimlar
imzo hisob raqami bo'lmagan statuslar:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Iltimos, ilova oldindan taqdim etilgan tranzaksiyalarni kuzatish uchun `hash` bilan
Eksplorator yo'nalishini ro'yxatdan o'tkazish va tekshirish:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Bu hali ham faqat o'qish uchun. Transaksiyani taqdim etish uchun imzolangan Norito
qadoq, to'g'ri zanjir ID, to'lov metadatalari va kran mablag'i bilan ta'minlangan Taira hisob.

To'lovlarni to'lovchi misollar uchun Taira, kasana yordamchisini qutqarish
[Testnetni olish XOR to ' g'risida Taira](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
sifatida `taira_faucet_claim.py`, soʻngra imzolovchiga ommaviy kran orqali mablagʻ ajratish
Birinchidan:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Agar kran puzzli yoki talabnoma yo'nalishi qaytarib kelsa `502`, oldin kuting va yana sinab koʻring
muomalaning o'zini debug qilish.

Soʻngra Taira Transaksiyani taqdim etishda to'lov aktivlari metadatalari:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Offline operatsiyalar {#offline-transactions}

Iroha ikki xil offline-transaksiya ish oqimi mavjud:

- **Offline imzolash** imzolash paytida oddiy imzolangan tranzaksiya yaratadi
  qurilma uzilgan. Transaksiya onlayn
  mijoz imzolangan zarbatni Torii, Shunday qilib, u hali ham kerak
  to'g'ri zanjir ID, vakolat, ruxsatnomalar, to'lovlar va operatsiya muddati.
- **Kagemusha onlayn pul** Internetda bo'lganida ham pulchani topadi, qo'llab-quvvatlaydi
  ikki ham pulparast bo'lganda oluvchi tomonidan tashabbuskor qilib qo'yilgan pulparastdan pulparastga o'tkazish
  offline, va qabul qiluvchi qaytarib qachon natijada yozuv holatini sotib oladi
  Internetda.

Torii Kagemushalarning butun hayot davri `/v1/offline/*`:

| usuli va yakuniy nuqtasi | Maqsad |
| --- | --- |
| `GET /v1/offline/readiness` | Kagemushalarning tayyorligini baholash `asset_definition_id` |
| `POST /v1/offline/receiver-lineage` | Imzolangan qabul qiluvchining so'rovi uchun hujjatli faol ro'yxatdan o'tish liniyasini hal qilish |
| `POST /v1/offline/top-up` | Imzolangan onlayn-oflayn to'ldirish operatsiyasini taqdim etish |
| `POST /v1/offline/redeem` | Foydalanib oʻtgan toʻlov operatsiyasini taqdim etish |
| `GET /v1/offline/operations/{operation_id}` | Toʻldirish yoki toʻlovning kanonik maqomini oʻqing |

Offline operatsiyani qurishdan oldin aktivning tayyorligini tekshirish:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

Tayyorlik pulchani faol koʻprik bilan bogʻlaydi ABI 21 va tasdiqlangan V4
Artefaktlar to'plami.
`application/x-norito` Arxivlar. topshirish va to'lovni qaytarish `202 Accepted`
a bilan `Location` operatsiya resursini ko'rsatadigan sarlavha; o'rnatilgan
nol bo'lmagan operatsiya ID idempotency kalitini taqdim etadi.

Oddiy oqim:

1. Tayyorlikni soʻrang va toʻxtating `ready` soxta yoki har qanday blokir qo'llanilmoqda.
2. Yozilgan Swift yoki JVM kanonik to'ldirish arxivini yaratish uchun qoplama,
   uni taqdim etish va kirish notasi holatini ham, ishlashini ham saqlab qolish ID to
   operatsiya oxirgi zanjir holatiga yetadi.
3. Zarur bo'lganda qabul qiluvchining ro'yxatdan o'tish liniyasini hal qilish, qurilishni va
   har bir tengdoshni mahalliy ravishda tekshirish va shifrlangan yozuv holatini saqlash
   o'tkazilishini tan olishdan oldin.
4. Qabul qiluvchi onlayn bo'lganda, kanonik to'lov arxivini yaratish,
   uni taqdim etadi va uning ishlashi bilan bog'liq resurslarni so'rovga kiritadi.

Katakchi qaydnoma holatiga qadar qarama-qarshi offline oʻtkazib yuborishni kuzatolmaydi
onlayn hayot davri davomida qaytarish.
Shuning uchun qiymat cheklovlarini, muddati tugagani, qabul qilingan emitentlar, uzoq muddatli mahalliy
saqlash va yarashtirish oynalari.

Bu yerda yangi bitim yaratishning misolini ko'rib chiqamiz. `Grant`
Ushbu muomalada Mouse Alice-ga aniqlangan
roli (`role_id`"). Tekshiring
[to'liq misol](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
