---
translation_locale: uz
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Chindan ham mavjud bo'lgan aktivlar {#real-world-assets}

Haqiqiy dunyo aktivlari (RWAs) zanjirdan tashqari aktivlar modeli bo'lib, ularning mulkdorligi yoki nazorati zanjirda kuzatiladi. Iroha da RWA - bu yaratilgan identifikator, egasining hisob raqami, miqdor, biznes metadatalari, kelib chiqishi va hayot davri nazoratlarini o'z ichiga olgan ro'yxatga olingan katta daftar lotidir .

RWAs raqamli aktivlar saldi bilan farq qiladi:

- raqamli aktiv - hisobda saqlanayotgan shov-shuv bilan bog'liq
- NFT - bitta egasiga ega bo'lgan yagona zanjirdagi yozuv
- RWA - bu biznes metadatalarini, miqdorni, saqlovlarni, muzlatishni, to'lov holatini, kelib chiqishini va nazoratchi siyosatini olib borishi mumkin bo'lgan partiyadir

RWAs dan foydalaning, agar katta ro'yxat faqat shov-shuv bilan bog'liq bo'lmagan lotni ifodalashi kerak bo'lsa.

## RWA Lot {#rwa-lot}

RWA partiyasida quyidagilar mavjud:

- `id`: hosil qilingan kanonik RWA identifikatori, `<hash>$<domain>` sifatida ko'rsatiladi.
- `owned_by`: partiyani hozirda egallagan hisob raqamlari
- `quantity`: partiya tomonidan ko'rsatilgan to'liq miqdor
- `spec`: miqdorni belgilash, masalan, o'nlik baravar
- `primary_reference`: zanjirdan tashqaridagi asosiy rasit, sertifikat, faktura yoki reyestr ma'lumotnomasi.
- `status`: ishbilarmonlik holati matni;
- `metadata`: biznes kontekstida va indekslashda ishlatiladigan kompakt JSON maydonlari
- `parents`: ushbu partiyani olish uchun ishlatilgan manba lotlari
- `controls`: nazoratchi hisobvaraqlari, nazoratchining vazifasi va ruxsat etilgan nazoratchi operatsiyalari;
- `is_frozen` va `held_quantity`: ish vaqti bilan qo'llab-quvvatlanadigan hayot davri holati

Zilziladagi foydali yukni kompak saqlang. Katta huquqiy hujjatlar, inspeksiya hisobotlari va audit to'plamlarini WSV tashqarisida saqlash, so'ngra URI, SoraFS yo'li yoki RWA metadatalariga ma'lumotlar bilan bog'lash.

## Identifikatorlar {#identifiers}

`RegisterRwa` qo'ng'iroq qiluvchi tomonidan tanlangan `id` so'zini qabul qilmaydi va `owner` maydonini ham qabul qilmaydi. Transaksiya organi dastlabki `owned_by` hisob raqamiga aylanadi, ish vaqti esa maqsadli domendagi `RwaId` so'zni hosil qiladi.

RWA ID ning matn shakli quyidagicha:

```text
<generated-hash>$<domain>
```

Masalan:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Talabnomalar o'z biznes identifikatorini `primary_reference` yoki `metadata` da saqlashlari kerak, so'ngra `RwaEvent::Created`, `FindRwas`, `/v1/rwas` dan hosil bo'lgan `RwaId` yoki tranzaksiya majburiyatlaridan keyin aniqlangan qidiruvchining yo'nalishini aniqlashlari lozim.

## Hayot davri {#lifecycle}

RWA umumiy ish oqimlari quyidagilarni o'z ichiga oladi:

|Operatsiya |Amalga oshirilgan xatti-harakatlar |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |ID lotini domenida yarating; bitim hokimiyati `owned_by`ga aylanadi. |
|`TransferRwa` |Ko'plikni boshqa hisobvaraqqa o'tkazing. To'liq o'tkazish `owned_by` ni o'zgartirishi mumkin; qisman o'tkazish hosil bo'lgan bola lotini yaratadi. |
|`HoldRwa` |ehtiyot miqdori. Konfiguratsiya qilingan nazoratchi va `hold_enabled` kerak. |
|`ReleaseRwa` |Qo'llanilgan miqdorni olib tashlash. Konfiguratsiya qilingan boshqaruvchini va `hold_enabled` talab qiladi. |
|`FreezeRwa` |Oddiy egasining operatsiyalarini bloklash. Konfiguratsiyalangan boshqaruvchini va `freeze_enabled` talab qiladi. |
|`UnfreezeRwa` |Oddiy egasi operatsiyalarini qayta qo'llash. Konfiguratsiyalangan boshqaruvchini va `freeze_enabled` talab qiladi. |
|`RedeemRwa` |Ko'paytirish miqdori. Egasini yoki boshqaruvchini va `redeem_enabled` talab qiladi. |
|`MergeRwas` |Bir xil domenga ega bo'lgan ota-ona partiyalarining miqdorlarini birlashtirib, hosil qilingan bola partiyasiga aylantiring. |
|`ForceTransferRwa` |Ko'plikni nazoratchi oqimi orqali ko'chirish. Konfiguratsiya qilingan nazoratchini va `force_transfer_enabled` talab qiladi. |
|`SetRwaControls` |Partiya nazoratini o'zgartirish uchun mulkdor yoki nazoratchi kerak.|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Lot metadatalarini yangilash. Egasini yoki nazoratchini talab qiladi; muzlatilgan lotlarga nazoratchi kerak. |

Joriy kodda `UnregisterRwa` yo'l-yo'riq yo'q. Belgilangan miqdor yetkazib berilgan, iste'mol qilingan, hisoblangan yoki boshqa tarzda aylanishdan olib tashlanganda, zanjirdan tashqari lotni `RedeemRwa` bilan olib tashlang.

## Metadotlar va nazoratlar {#metadata-and-controls}

Ilovalarni lotni aniqlash va tasdiqlash uchun kompakt faktlar uchun metadatalardan foydalaning:

- aktivlar sinflari, emitentlar, depozitorlar yoki reyestr ma'lumotlari
- ombor, vaft, ISIN, faktura yoki sertifikat identifikatorlari
- attestatsiyalar va huquqiy hujjatlar uchun tarkib hashlari
- SoraFS ko'proq dalillar to'plamlari uchun yo'nalishlar yoki ma'lumotlar ma'lumotlari
- zaryaddan tashqaridagi xizmatlar tomonidan ishlatiladigan muddati, vakolat yoki muvofiqlik belgilari

Amalga oshirilgan `RwaControlPolicy` ga quyidagi maydonlar kiradi:

```json
{
  "controller_accounts": [],
  "controller_roles": [],
  "freeze_enabled": true,
  "hold_enabled": true,
  "force_transfer_enabled": false,
  "redeem_enabled": true
}
```

Boshqaruvchi hisobvaraqlari va rollari faqat tegishli boolean bayroq tomonidan qo'llanilgan boshqaruvchi operatsiyalarini amalga oshirishga ruxsat etiladi. Joriy nazorat yuklamasi ruxsatnoma ro'yxatini o'tkazish siyosati emas va uyushtirilgan `transfers` qoidalarga ega emas.

## Savollar, hodisalar va APIs {#queries-events-and-apis}

Foydalanish [`FindRwas`](/uz/reference/queries.md#assets-nfts-and-rwas) ro'yxatga olingan RWA To'g'ridan-to'g'ri yangilanishlar kerak bo'lgan dasturlar [`Rwa` ma'lumotlar hodisalari](/uz/blockchain/filters.md#data-event-filters) yaratilgan, mulkdorini o'zgartirgan, bo'linadigan, birlashtirilgan, sotib olingan, muzlatilgan, muzlanmagan, saqlangan, ozod qilingan, kuch bilan o'tkazilgan, nazorat o'zgartirilishi uchun; va metadata hodisalari.

Torii zaryad holati yo'nalishlarini aniqlaydi: `/v1/rwas` va `/v1/rwas/query`, qo'shimcha tadqiqotchi yo'nalishlari: `/v1/explorer/rwas` va `/v1/explorer/rwas/{rwa_id}` yaratilgan mijozlar jonli o'rnatish [`/openapi`](/uz/reference/torii-endpoints.md#common-endpoints) bir nod tomonidan aniq javob shakli uchun hujjat.

### Taira bilan sinab ko'ring. {#try-it-on-taira}

Taira tomonidan hozirda RWA lotlar ro'yxatdan o'tkazilganligini tekshirish:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

jonli Taira OpenAPI hujjatida ko'rsatilgan RWA yo'nalishlarini ro'yxatdan o'tkazish:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Umumiy lotlar hali ro'yxatdan o'tmagan bo'lsa, bo'sh `items` chiqarilishi kutilmoqda. Ro'yxatga olish, o'tkazish, saqlash, muzlatish va sotib olish imzolangan bitimlar hisoblanadi.

## Buni sinab koʻring . {#try-it}

Quyida keltirilgan misollarda Python SDK [ Shared Setup](/uz/guide/tutorials/python.md#shared-setup) ning yuzalaridan foydalaniladi. Transaksiyani taqdim etishdan oldin hisob raqami IDs, xususiy kalitlar va hosil qilingan lot IDs ni o'zingizning tarmoqingizdagi qiymatlar bilan almashtiring.

### RWA API yo'nalishlarini kashf etish {#discover-rwa-api-routes}

Ushbu faqat o'qishga mo'ljallangan misol Torii uzuni so'raydi, qaysi dasturga qaraydigan RWA yo'nalishlari qo'llanilgan:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

Agar ro'yxat bo'sh bo'lsa, nod hali ham RWA ko'rsatmalarini va boshqa Torii APIs orqali so'rovlarni qo'llab-quvvatlashi mumkin, ammo u JSON yo'nalishining fakultativ oilasi bilan bog'liq emas.

### Omborxona qudratini ro'yxatga olish {#register-a-warehouse-receipt}

Bir biznes-harakat bir imzolangan tranzaksiyaga aylanishi kerak bo'lganda loyiha usulidan foydalaning. `primary_reference`; katta kitob ID Transaksiya majburiyatlaridan so'ng hosil bo'ladi.

```python
from iroha_python import TransactionConfig, TransactionDraft

config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    metadata={**TX_METADATA, "source": "rwa-docs"},
)

draft = TransactionDraft(config)
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "inspection_report": "sorafs://reports/copper-001.json",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Transaksiya qo'yilganidan so'ng, ro'yxat RWA IDs hosil bo'ladi. Zilzi davlat yo'nalishlari kanonik IDs ni ochadi; voqealar yoki kashfiyotchining batafsil yo'nalishlaridan foydalanib, agar siz ID bilan `primary_reference` yoki metadatalarga qaytishingiz kerak bo'lganda:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Eksploratorni qo'llab-quvvatlaydigan nodlar ham boyroq proyeksiyalarni qaytarishi mumkin:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Vaqtinchalik to'xtatish bilan ko'chirish {#transfer-with-a-temporary-hold}

Xatcho'p tomonidan qaytarilgan hosil qilingan RWA ID dan foydalaning. Ushbu misolda `alice` ega bo'lishini nazarda tutadi va u `hold_enabled` bilan nazoratchi sifatida ham moslanadi.

```python
warehouse_lot_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.transfer_rwa(warehouse_lot_id, quantity="10", destination=bob)
draft.hold_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Zilziladan tashqaridagi jarayon tugagandan so'ng ushlab turishni to'ldiring:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Nazorat va audit meta ma'lumotlarini qo'shish {#add-controls-and-audit-metadata}

Nazoratlar va metadotlar alohida hisoblanadi. Nazoratchilar siyosati uchun nazoratlardan va arizalar yoki auditorlar ko'rsatishi kerak bo'lgan faktlar uchun metadotlardan foydalaning:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.set_rwa_controls(
    warehouse_lot_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)
draft.set_rwa_key_value(warehouse_lot_id, "auditor", "alice")
draft.set_rwa_key_value(
    warehouse_lot_id,
    "proof_hash",
    "sha256:2b1c7a4e...",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### To'lov yoki pensiya miqdori {#redeem-or-retire-quantity}

Tartib qilingan zanjirdan tashqari aktiv yetkazib berilgan, iste'mol qilingan, pensiyaga olingan bo'lganda to'lov miqdori; yoki boshqa yo'l bilan aylanmasidan chiqarilgan. `redeem_enabled`, imzochi mulkdor yoki nazoratchi bo'lishi kerak.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Qoʻllanishni tekshirish paytida toʻxtatish {#freeze-during-compliance-review}

Zaryaddan tashqarida ko'rib chiqish odatdagi mulkdorlar operatsiyalarini blokirovka qilishi kerak bo'lganda juda ko'p muzlatish. imzolovchi nazoratchi bo'lishi kerak va lot `freeze_enabled` bo'lishi shart.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.freeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {
        "status": "frozen",
        "reason": "custodian inventory check",
        "case_id": "OPS-2026-0042",
    },
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Tekshiruv o'tgach uni muzlating:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.unfreeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {"status": "cleared", "case_id": "OPS-2026-0042"},
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Hisobvaraqning olinishi {#invoice-receivable}

Hisobvaraqni RWA partiyasi sifatida `primary_reference` raqami va metadatalarni saqlash orqali ifodalash. Ro'yxatdan o'tgandan so'ng, o'tkazish va to'lov uchun hosil qilingan ID faylini ishlating.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.register_rwa(
    {
        "domain": "receivables.universal",
        "quantity": "50000",
        "spec": {"scale": 2},
        "primary_reference": "INV-2026-0007",
        "status": "issued",
        "metadata": {
            "asset_class": "invoice",
            "currency": "USD",
            "debtor": "example-buyer",
            "due_date": "2026-06-30",
            "document_hash": "sha256:4df4c8...",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": False,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

To'lov mablag'lari moliyalashtirilgan yoki to'langan bo'lsa, hosil qilingan faktura lotidan foydalanish ID:

```python
invoice_lot_id = (
    "fedcba9876543210fedcba9876543210"
    "fedcba9876543210fedcba9876543210$receivables.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.transfer_rwa(invoice_lot_id, quantity="50000", destination=bob)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Xatchoʻpdan tashqarida hisob-kitob qilinganidan keyin ifoda etilgan miqdorni sotib olish:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Karbon kreditlari pensiyasi {#carbon-credit-retirement}

Kreditlar talab qilib olingandan so'ng kreditlarni olish uchun to'lovdan foydalaning. Metadatalar zanjirdan tashqaridagi sertifikat yoki ro'yxatdan o'tgan hujjatni ko'rsatadi:

```python
carbon_lot_id = (
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$carbon.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(carbon_lot_id, quantity="250")
draft.set_rwa_key_value(
    carbon_lot_id,
    "retirement_certificate",
    "sorafs://certificates/carbon-credit-2026-001-retired.json",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Ikki to'pni birlashtiring {#merge-two-lots}

Ikki zanjirdan tashqari pozitsiyalar biriktirilganda lotlarni birlashtiring. Ota-onalar bir xil domendagi bo'lishi va bir xil miqdorni qo'llashlari kerak. Ish vaqti bola lotini hosil qiladi ID.

```python
warehouse_lot_id_2 = (
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.merge_rwas(
    {
        "parents": [
            {"rwa": warehouse_lot_id, "quantity": "40"},
            {"rwa": warehouse_lot_id_2, "quantity": "60"},
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "merge_reason": "same custodian and quality grade",
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Python tranzaksiyasining to'liq namunasi uchun [Real-World Assets](/uz/guide/tutorials/python.md#real-world-assets)-ni ko'ring.

## Bogʻliq hujjatlar {#related-docs}

- [Aktivlar](/uz/blockchain/assets.md)
- [Metadatalar](/uz/blockchain/metadata.md)
- [Iroha Maxsus yo'l-yo'riqlar](/uz/blockchain/instructions.md)
- [So'rovlar](/uz/reference/queries.md#assets-nfts-and-rwas)
- [Torii oxirgi nuqtalari](/uz/reference/torii-endpoints.md#app-and-sora-route-families)
