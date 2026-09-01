---
translation_locale: uz
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Transaksiyalar {#transactions}

**Tranzaksiya** — blokcheynda ish bajarish haqidagi imzolangan so‘rov. Bajariladigan foydali yuk [ko‘rsatmalar](./instructions.md) ning tartibli ketma-ketligi, shartnoma chaqiruvi, IVM baytkodi yoki isbotlangan IVM bajarilishi bo‘lishi mumkin. Joriy shartnoma bajarish modeli uchun [Aqlli shartnomalar](./smart-contracts.md) bo‘limiga qarang.

Tranzaksiyalar holatni o‘zgartiradigan yoki bajariladigan ishlarni amalga oshiradi. Faqat o‘qishga mo‘ljallangan tekshiruvlar imzolangan so‘rovlar yoki ochiq o‘qish so‘nggi nuqtalaridan foydalanadi va tranzaksiya yaratmaydi.

Yakunlangan blokka qabul qilingan tranzaksiya bajarish natijasi, jumladan bajarishdagi rad javobi bilan saqlanadi. Blokka qabul qilinishidan oldin rad etilgan so‘rovlar — masalan, yaroqsiz qadoq yoki navbat rad etgan tranzaksiya — blokda saqlanmaydi.

Maxfiylikni saqlab turadigan aktivlar harakatlari uchun [Anonim tranzaksiyalar](./anonymous-transactions.md)-ni ko'ring. Anonim tranzaksiyalarda ommaviy hisobvaraqdan hisobvaraqqa balans o'zgarishlari o'rniga himoya qilingan aktiv notlari, majburiyatlar, bekor qilish belgilari va nol bilimli dalillar ishlatiladi.

Tanlangan oshkora bajarish ta’sirlari ustidagi isbot dalillari uchun [FastPQ](./fastpq.md) bo‘limiga qarang. FastPQ odatiy tranzaksiya bajarilishidan keyin bajarish guvohlarini qabul qilib, qo‘llab-quvvatlanadigan holat o‘tishlari uchun deterministik isbot to‘plamlarini tuzadi.

## Taira da sinab ko‘rish {#try-it-on-taira}

Imzolovchi hisobsiz Taira ning so‘nggi ochiq bloklari va tranzaksiya holatlarini tekshirish uchun kuzatuvchi yo‘nalishlaridan foydalaning:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Ilovangiz avval yuborgan tranzaksiyani kuzatish uchun ro‘yxatdan `hash` ni nusxalang va kuzatuvchining batafsil yo‘nalishini tekshiring:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Bu ham faqat o‘qish amalidir. Tranzaksiya yuborish uchun imzolangan Norito qadoqi, to‘g‘ri zanjir identifikatori, haq metama’lumoti va sinov mablag‘i bilan ta’minlangan Taira hisobi talab qilinadi.

Taira-da haq talab qiladigan misollar uchun [Taira-da sinov tarmog‘i XOR aktivini olish](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) bo‘limidagi yordamchini `taira_faucet_claim.py` sifatida saqlang, so‘ng avval imzolovchini ochiq sinov mablag‘i xizmati orqali moliyalashtiring:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Agar sinov mablag‘i boshqotirmasi yoki talab yo‘nalishi `502` qaytarsa, tranzaksiyaning o‘zini nosozlikka tekshirishdan oldin kutib, yana urinib ko‘ring.

Keyin tranzaksiyani yuborayotganda Taira haq aktivining metama’lumotini biriktiring:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Oflayn tranzaksiyalar {#offline-transactions}

Iroha ikki xil oflayn tranzaksiya jarayoniga ega:

- **Oflayn imzolash** imzolash qurilmasi uzilgan paytda odatiy imzolangan tranzaksiya yaratadi. Onlayn mijoz imzolangan qadoqni Torii ga yubormaguncha tranzaksiya qayta ishlanmaydi, shu sabab unga to‘g‘ri zanjir identifikatori, vakolat, ruxsatlar, haqlar va tranzaksiya amal muddati baribir kerak.
- **Kagemusha oflayn naqd puli** hamyon onlayn paytida uni to‘ldiradi, ikkala hamyon oflayn bo‘lganda qabul qiluvchi boshlaydigan hamyondan hamyonga uzatishlarni qo‘llaydi va oluvchi onlayn qaytgach hosil bo‘lgan nota holatini muomaladan chiqaradi.

Torii Kagemusha ning to‘liq hayot davrini `/v1/offline/*` ostida taqdim etadi:

| Usul va so‘nggi nuqta | Vazifasi |
| --- | --- |
|`GET /v1/offline/readiness` |`asset_definition_id` uchun Kagemusha tayyorligini baholash. |
| `POST /v1/offline/receiver-lineage` | Imzolangan qabul qiluvchi so‘rovi uchun isbotli faol ro‘yxatga olish naslini aniqlash |
| `POST /v1/offline/top-up` | Imzolangan onlayndan oflaynga to‘ldirish amalini yuborish |
| `POST /v1/offline/redeem` | Imzolangan oflayn muomaladan chiqarish amalini yuborish |
| `GET /v1/offline/operations/{operation_id}` | To‘ldirish yoki muomaladan chiqarishning kanonik holatini o‘qish |

Oflayn amalni tuzishdan avval aktiv tayyorligini tekshiring:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

Tayyorlik hamyonni faol ko‘prik ABI 21 va autentifikatsiyalangan V4 artefaktlar majmuasiga bog‘laydi. Nasl, to‘ldirish va muomaladan chiqarish so‘rovlari tiplashtirilgan `application/x-norito` arxivlaridan foydalanadi. To‘ldirish va muomaladan chiqarish operatsiya resursiga ishora qiladigan `Location` sarlavhasi bilan `202 Accepted` qaytaradi; ichki noldan farqli amal identifikatori idempotentlik kalitini beradi.

Oddiy oqim quyidagicha:

1. Tayyorlikni so‘rang; `ready` yolg‘on bo‘lsa yoki biror to‘siq amal qilsa, jarayonni to‘xtating.
2. Tiplashtirilgan Swift yoki JVM hamyonida kanonik to‘ldirish arxivini tuzing va yuboring; amal yakuniy zanjir holatiga yetguncha kirish nota holati va amal identifikatorini saqlang.
3. Zarur bo‘lsa qabul qiluvchining ro‘yxatga olish naslini aniqlang, har bir tengdoshga uzatishni mahalliy tuzib tekshiring va o‘tkazishni tasdiqlashdan avval shifrlangan nota holatini barqaror saqlang.
4. Qabul qiluvchi onlayn bo‘lgach, kanonik muomaladan chiqarish arxivini tuzing va yuboring, so‘ng amal resursini yakuniylikka qadar so‘rab boring.

Banknota holati onlayn hayot sikliga qaytmaguncha reyestr ziddiyatli oflayn topshirishni kuzata olmaydi. Shu sababli hamyon va operator siyosati qiymat chegaralari, amal qilish muddati, qabul qilinadigan emitentlar, ishonchli mahalliy saqlash va solishtirish muddatlarini majburiy qo‘llashi kerak.

Bu yerda `Grant` ko‘rsatmasi bilan yangi tranzaksiya yaratish misoli berilgan. Bu tranzaksiyada Mouse Alice’ga belgilangan rolni (`role_id`) beradi. [To‘liq misolni](./permissions.md#register-a-new-role) ko‘ring.

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
