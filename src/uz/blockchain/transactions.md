---
translation_locale: uz
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Transaksiyalar {#transactions}

Transaksiya - bu blokchaindagi ishlarni bajarish uchun imzolangan so'rov. Ishlab chiqarilishi mumkin bo'lgan foydali yuk [ ko'rsatmalarining ](./instructions.md), shartnoma qo'ng'iroqining, IVM bytecode yoki isbotlangan IVM bajarilishining tartibga solingan ketma-ketligi bo'lishi mumkin . Amaldagi shartnomalarni ijro etish modeli uchun [Smart Contracts](./smart-contracts.md)-ni ko'ring.

Transaksiyalar holatni o'zgartiruvchi yoki bajarilishi mumkin bo'lgan ishlarni amalga oshiradi. Faqatgina o'qish tekshiruvidan imzolangan so'rovlar yoki ommaviy o'qish oxirgi nuqtalaridan foydalanish va tranzaksiya yaratmaydi.

Bog'langan blokga qabul qilingan tranzaksiya uning ijro natijasi, shu jumladan ijro rad etilishi bilan saqlanadi. Blokni qabul qilishdan oldin rad etilgan talablar, masalan, haqiqiy bo'lmagan konvert yoki navbatda rad qilingan bitim; blokda saqlanmaydi.

Maxfiylikni saqlab turadigan aktivlar harakatlari uchun [Anonim tranzaksiyalar](./anonymous-transactions.md)-ni ko'ring. Anonim tranzaksiyalarda ommaviy hisobvaraqdan hisobvaraqqa balans o'zgarishlari o'rniga himoya qilingan aktiv notlari, majburiyatlar, bekor qilish belgilari va nol bilimli dalillar ishlatiladi.

Tanlangan shaffof ijro ta'sirlari ustidan dalillar uchun [FastPQ](./fastpq.md)-ni ko'ring. FastPQ odatdagidan so'ng ijro guvohlarini iste'mol qiladi va qo'llab-quvvatlanadigan davlat o'tishlari uchun deterministik dalillar partiyalarini quradi.

## Taira bilan sinab ko'ring. {#try-it-on-taira}

Taira so'nggi ommaviy bloklar va tranzaksiya statuslarini imzo hisobidan tashqari tekshirish uchun Explorer yo'nalishlaridan foydalaning:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Iltimos, ro'yxatdan `hash` nusxasini ko'chirib, qidiruvchining batafsil yo'nalishini tekshirib turing:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Bu hali ham faqat o'qish uchun hisoblanadi. Transaksiyani taqdim etish uchun imzolangan Norito ombor, to'g'ri zanjir ID, to'lov metadatalari va kran mablag'i bilan ta'minlangan Taira hisob raqami talab qilinadi.

Taira da to'lovlarni to'lash misollari uchun kran yordamchisini [dan saqlang Testnet XOR ni Taira](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)da `taira_faucet_claim.py` sifatida oling, so'ngra avval imzochini ommaviy kran orqali mablag' bilan ta'minlang:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Agar faucet puzzli yoki talabnoma yo'nalishi `502` ni qaytarib bersa, muomalaning o'zini debug qilishdan oldin kuting va yana sinab ko'ring.

So'ngra tranzaksiya taqdim etilganda Taira to'lov aktivining metadatalarini qo'shing:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Oflayn operatsiyalar {#offline-transactions}

Iroha ikki xil offline operatsiya ish oqimlariga ega:

- Offline imzolash imzolash qurilmasi bo'shalganida normal imzolangan tranzaksiyani yaratadi. Online mijoz Torii raqamiga imzolangan zarbatni taqdim etmaguncha tranzaksiya qayta ishlanmaydi, shuning uchun unga hali ham to'g'ri zanjir ID , vakolat, ruxsatnomalar, to'lovlar va tranzaksiyaning umuri kerak.
- Kagemusha oflayn pul mablag'i onlayn bo'lganida ham qopchiqni topadi, har ikki qopchiq oflayn bo'lsa ham qabul qiluvchining tashabbusi bilan qopchiqdan qopchiqga uzatishni qo'llab-quvvatlaydi va oluvchi onlayn qaytganda natijadagi notani sotib oladi.

Torii Kagemusha hayotining to'liq davrini `/v1/offline/*` ostida ko'rsatadi:

|usuli va oxirgi nuqtasi |Maqsad|
| --- | --- |
|`GET /v1/offline/readiness` |`asset_definition_id` uchun Kagemusha tayyorligini baholash. |
|`POST /v1/offline/receiver-lineage` |Imzolangan qabul qiluvchining so ' rovi uchun aktiv ro ' yxatdan o ' tkazish liniyasini hal etish |
|`POST /v1/offline/top-up` |Imzolangan onlayn-oflayn toʻldirish operatsiyasini taqdim etish |
|`POST /v1/offline/redeem` |Foydalanib boʻlmaydigan toʻlov operatsiyasini taqdim etish |
|`GET /v1/offline/operations/{operation_id}` |Toʻldirish yoki toʻlovning kanonik holatini oʻqing |

Offline operatsiyani qurishdan oldin aktivning tayyorligini tekshirish:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

Tayyorlik pulni faol koʻprik bilan bogʻlaydi . ABI 21 va tasdiqlangan V4 Artefaktlar to'plami. Asal, top-up va sotib olish talablari `application/x-norito` Arxivlar. topshirish va to'lovni qaytarish `202 Accepted` a bilan `Location` operatsiya resursini ko'rsatadigan sarlavha; o'rnatilgan nol bo'lmagan operatsion ID idempotency kalitini taqdim etadi.

Oddiy oqim quyidagicha:

1. Agar `ready` noto'g'ri bo'lsa yoki biron bir bloker qo'llanilgan bo'lsa, tayyorlikni so'rang va to'xtating.
2. &amp; amp; Yozilgan Swift yoki JVM kanonik top-up arxivini yaratish, uni jo'natish va kirish notasi holati va ishlashni saqlab qolish uchun portfel ID operatsiya oxirgi zanjir holatiga yetguncha.
3. Kerak bo'lganda qabul qiluvchi ro'yxatining naslini hal qilish, har bir tengdosh uzatishni mahalliy ravishda yaratish va tekshirish va o'tkazishni tan olishdan oldin shifrlangan yozuv holatini saqlab qoling.
4. Qabul qiluvchi onlayn bo'lganda, kanonik to'lov arxivini yarating, uni taqdim eting va uning ishlash resursini so'rovga oling.

Note state onlayn hayot davri orqali qaytib kelmaguncha, katta kitob o'zaro ziddiyatlarni kuzatolmaydi. Shuning uchun ham pul va operator siyosati qiymat cheklovlari, muddati o'tishi, qabul qilingan emitentlar, doimiy mahalliy saqlashni qo'llab-quvvatlashi kerak. va yarashish o'rinlari.

Bu yerda yangi bitim tuzishning misolini koʻrib chiqamiz. `Grant` Ushbu muomalada Mouse Alice-ga aniqlangan rolni (`role_id`). Tekshirish [to'liq misol](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
