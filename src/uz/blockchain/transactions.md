---
translation_locale: uz
translation_source: /blockchain/transactions.md
translation_source_hash: d9227effcdb4d54ac76f6288ba213de20f2574e1585e13b96a5202c44b69f3be
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
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

Bu hali ham faqat o‘qish amalidir. Tranzaksiya yuborish uchun imzolangan Norito konverti, to‘g‘ri zanjir ID va tarmoq ID, aniq komissiya to‘lovchisi hamda faucet orqali mablag‘ bilan ta’minlangan Taira hisobi zarur.

Taira tarmog‘idagi komissiyali misollar uchun [Taira tarmog‘ida testnet XOR oling](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)dagi oldindan tayyorlashga asoslangan faucet jarayoni bilan imzolovchini moliyalashtiring, so‘ng komissiya aktivi balansini tekshiring:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Faucet marshruti `502` qaytarsa, tranzaksiyaning o‘zini tekshirishdan oldin kuting va qayta urining.

So‘ng tranzaksiya yuborayotganda komissiya to‘lovchisini tanlang. `--fee-payer authority` bilan imzolovchi hisob to‘laydi va CLI imzolashdan oldin aniq komissiyani Taira tarmog‘ining komissiya aktivida hisoblatadi:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "faucet-funded taira transaction"
```

## Oflayn tranzaksiyalar {#offline-transactions}

Iroha ikki xil oflayn tranzaksiya jarayoniga ega:

- **Oflayn imzolash** imzolash qurilmasi uzilgan paytda odatiy imzolangan tranzaksiya yaratadi. Onlayn mijoz imzolangan qadoqni Torii ga yubormaguncha tranzaksiya qayta ishlanmaydi, shu sabab unga to‘g‘ri zanjir identifikatori, vakolat, ruxsatlar, haqlar va tranzaksiya amal muddati baribir kerak.
- **Kagemusha oflayn naqd puli** ro‘yxatdan o‘tgan, apparat bilan himoyalangan hamyonga onlayn paytda qiymat yuklaydi, ikkala hamyon oflayn bo‘lganda ular o‘rtasida to‘lovni qo‘llaydi va hamyon yana onlayn bo‘lganda qolgan qiymatni reyestr hisobiga qaytaradi.

Torii bitta Kagemusha o‘zgartirish marshrutini taqdim etadi: `POST /v1/kagemusha/enrollment`. U hisob orqali autentifikatsiyalangan `application/x-norito` ro‘yxatdan o‘tish freymlarini qabul qiladi va keshlanmasligi kerak bo‘lgan maxfiy javoblar qaytaradi. `/v1/kagemusha/{scheme}/wallets/{wallet}/` ostidagi hisob imzosi bilan ishlaydigan SDK o‘qish marshrutlari Load kvitansiyalari va yakuniylik dalillarini qaytaradi; ular `/openapi.json` ro‘yxatiga kiritilmagan. Hayotiy davrning reyestr tomoni `KagemushaWalletLedgerV1` ko‘rsatmasini olib yuruvchi oddiy imzolangan tranzaksiyalardan foydalanadi:

| Amal | Maqsad |
| --- | --- |
| `Activate` | Ro‘yxatdan o‘tgan hamyonni faollashtirish; nativ bootstrap tekshiruvi majburiy |
| `IssueLoad` | To‘lovchidan yechish va hamyonning keyingi Load amali yozuvini atomik qayd etish |
| `Unload` | To‘liq Unload talabini unga bog‘langan hisobga ko‘pi bilan bir marta to‘lash |
| `ClaimFee` | To‘liq komissiya talabini belgilangan benefitsiarga to‘lash |
| `Abandon` | Ishlatilmagan ro‘yxatdan o‘tishni bekor qilish |

Oddiy oqim quyidagicha:

1. Tiplangan Swift yoki Android hamyoni bilan `/v1/kagemusha/enrollment` orqali ro‘yxatdan o‘ting, so‘ng hamyonni faollashtiring.
2. `IssueLoad` tranzaksiyasini yuboring. Bajarish keyingi Loadning kutilgan tartib raqami va noldan farqli so‘rov ID sini tekshiradi, shu sababli eskirgan yoki o‘zgartirilgan qayta urinish rad etiladi. Javob yo‘qolgach, yana bir Loadni imzolash o‘rniga asl Load kvitansiyasini o‘qing.
3. Hamyonlar oflayn bo‘lganda ular orasida to‘lovlarni mahalliy almashing va tekshiring; har bir o‘tkazmani tasdiqlashdan oldin hamyon holatini mustahkam saqlang.
4. Hamyon yana onlayn bo‘lganda uning Unload talabini yuboring va yakuniylikni kuting.

Kagemusha reliz uchun malakalanmagan: real pul bilan jonli tarmoqda malaka sinovi, shuningdek jismoniy qurilmalarda telefonni ro‘yxatdan o‘tkazish, faollashtirish va to‘lov hali ochiq masala bo‘lib qolmoqda.

Banknota holati onlayn hayot sikliga qaytmaguncha reyestr ziddiyatli oflayn topshirishni kuzata olmaydi. Shu sababli hamyon va operator siyosati qiymat chegaralari, amal qilish muddati, qabul qilinadigan emitentlar, ishonchli mahalliy saqlash va solishtirish muddatlarini majburiy qo‘llashi kerak.

Bu yerda `Grant` ko‘rsatmasi bilan yangi tranzaksiya yaratish misoli berilgan. Bu tranzaksiyada Mouse Alice’ga belgilangan rolni (`role_id`) beradi. [To‘liq misolni](./permissions.md#register-a-new-role) ko‘ring.

```rust
let grant_role = Grant::account_role(role_id, alice_id);
// `network_id` is the target network's `NetworkId`; the fee intent is bound
// into the signature (use the intent returned by a fee quote).
let grant_role_tx = TransactionBuilder::new(
    network_id,
    mouse_id,
    FeePaymentIntent::authority(Vec::new(), None),
)
.with_instructions([grant_role])
.sign(&mouse_private_key);
```
