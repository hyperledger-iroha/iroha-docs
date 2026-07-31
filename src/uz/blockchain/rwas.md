---
translation_locale: uz
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Haqiqiy dunyodagi aktivlar {#real-world-assets}

Haqiqiy aktivlar (RWAs) o'z mulkdorligi yoki nazorati ostida bo'lgan zanjirdan tashqari aktivlarning modellari
zanjirda kuzatilgan. Iroha, bir RWA ro'yxatdan o'tgan katta daftar lotidir
hosil qilingan identifikator, egasi hisob raqami, miqdor, biznes metadatalari;
kelib chiqishi va hayot davri nazoratlari.

RWAs raqamli aktivlar saldolaridan farq qiladi:

- raqamli aktiv - hisobda saqlanadigan shovqinli balans
- bir NFT bitta egasi bilan bog'liq bo'lgan yagona zanjirdagi rekord
- bir RWA bu biznes metadatalarini, miqdorini, saqlab qolishini o'z ichiga oladigan bir nechta
  muzlatish, to'lov holati, kelib chiqishi va nazoratchi siyosati

Foydalanish RWAs guruhi maxsus zanjirdan tashqari lotni ifodalashi kerak bo'lganda
faqatgina shakllanadigan muvozanat o'rniga.

## RWA Lot {#rwa-lot}

Oʻzbekiston Respublikasi RWA lotda quyidagilar mavjud:

- `id`: hosil bo'lgan kanonik RWA identifikator, quyidagicha ko'rsatiladi:
  `<hash>$<domain>`
- `owned_by`: lotning hozirgi mulkdori hisob raqami
- `quantity`: partiya tomonidan aks ettirilgan to'liq miqdor
- `spec`: miqdorni belgilash, masalan, o'nlik ko'rsatkich
- `primary_reference`: to'plamdan tashqari asosiy rasvot, sertifikat, faktura yoki
  reyestr ma'lumotnomasi
- `status`: ixtiyoriy biznes holati matni
- `metadata`: kompak JSON biznes kontekstida va indekslashda ishlatiladigan maydonlar
- `parents`: Ushbu partiyani olish uchun ishlatiladigan manba lotlari
- `controls`: nazoratchi hisobvaraqlari, nazoratchining vazifasi va ruxsat etilgan nazoratchi
  Operatsiyalar
- `is_frozen` va `held_quantity`: Ish vaqti bilan qo'llaniladigan hayot davri holati

Xizmatdagi yukni kompak saqlang.
hisobotlar va audit to'plamlari WSV, Soʻngra uni oʻchirib qoʻying. URI, SoraFS
yo'nalish yoki aniq ma'lumot RWA Metadatalar.

## identifikatorlar {#identifiers}

`RegisterRwa` chaqiruvchini qabul qilmaydi `id`, va qabul qilmaydi .
bir `owner` sohada. Transaksiya organi dastlabki `owned_by`
hisob, va ish vaqti hosil qiladi `RwaId` maqsadli hududda.

Matn shakli RWA ID quyidagicha bo'ladi:

```text
<generated-hash>$<domain>
```

Masalan:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Talabnomalar o'zlarining biznes identifikatorini `primary_reference`
yoki `metadata`, Soʻngra yaratilganni aniqlang . `RwaId` bilan
`RwaEvent::Created`, `FindRwas`, `/v1/rwas`, yoki kashfiyotchi yo'nalishi
Transaksiya majburiyatlarini amalga oshirganidan keyin.

## Hayot davri {#lifecycle}

Oddiy RWA ish oqimlari quyidagilarni o'z ichiga oladi:

| Operatsiya                                  | Amalga oshirilgan xatti-harakat                                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              | Yaratilgan ...ID bir domendagi lot; muomala hokimiyati `owned_by`.                                       |
| `TransferRwa`                              | Ko'plikni boshqa hisob raqamiga o'tkazing. To'liq o'tkazish o'zgarishi mumkin `owned_by`; qisman o'tkazib yuborish natijasida tug'ilgan bola partiyasi paydo bo'ladi. |
| `HoldRwa`                                  | ehtiyot miqdori. Konfiguratsiya qilingan nazoratchi va `hold_enabled`.                                                     |
| `ReleaseRwa`                               | Qo'llanilgan miqdorni olib tashlash. `hold_enabled`.                                                 |
| `FreezeRwa`                                | Oddiy mulkdorlarni bloklash. Konfiguratsiya qilingan boshqaruvchini va `freeze_enabled`.                                    |
| `UnfreezeRwa`                              | Oddiy mulkdorlar faoliyatini qayta qo'llash. `freeze_enabled`.                                |
| `RedeemRwa`                                | To'lov miqdori. Egasi yoki nazoratchi va `redeem_enabled`.                                                  |
| `MergeRwas`                                | O'sha domen va xususiyatga ega bo'lgan ota-ona lotlaridan olingan miqdorlarni hosil qilingan bola lotga qo'shing.                              |
| `ForceTransferRwa`                         | Ko'plikni nazoratchi oqimi orqali ko'chirish. `force_transfer_enabled`.                    |
| `SetRwaControls`                           | Partiya nazoratini o'zgartirish uchun mulkdor yoki nazoratchi kerak.                                                        |
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` | Lot metadatalarini yangilash. Egasi yoki nazoratchini talab qiladi; muzlatilgan lotlarga nazoratchi kerak.                                 |

Yoʻq `UnregisterRwa` joriy koddagi ko'rsatma.
toʻplamdan tashqari lot `RedeemRwa` ko'rsatilgan miqdor yetkazib berilganda,
iste'mol qilingan, joylashtirilgan yoki boshqa tarzda aylanmadan olib tashlangan.

## Metadotlar va nazoratlar {#metadata-and-controls}

Ilovalarni aniqlash va tasdiqlash uchun metadatalardan foydalaning
lot:

- aktiv sinflari, emitentlar, depozitorlar yoki reyestr ma'lumotnomasi
- ombor, ombor, ISIN, faktura yoki sertifikat identifikatorlari
- attestatsiyalar va huquqiy hujjatlar uchun tarkib hashlari
- SoraFS ko'proq dalillar to'plamlari uchun yo'nalishlar yoki ma'lumotlar
- Zilziladan tashqari xizmatlar tomonidan ishlatiladigan muddati, yurisdiksiya yoki muvofiqlik belgilari

Amalga oshirilgan `RwaControlPolicy` quyidagi maydonlarga ega:

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

Boshqaruvchi hisobvaraqlari va vazifalarini faqat boshqaruvchi bajarishga ruxsat etiladi
Tegishli bo'l bayrog'i bilan mo'ljallangan operatsiyalar.
payload ruxsatnoma ro'yxatini o'tkazish siyosati emas va uyushtirilgan emas
`transfers` qoidalar.

## Savollar, hodisalar va APIs {#queries-events-and-apis}

Foydalanish [`FindRwas`](/uz/reference/queries.md#assets-nfts-and-rwas) ro'yxatga olish
ro'yxatga olingan RWA O'z vaqtida yangilanish kerak bo'lgan dasturlar
[`Rwa` ma'lumotlar hodisalari](/uz/blockchain/filters.md#data-event-filters) yaratilganlar uchun.
mulkdorini o'zgartirilgan, bo'linadigan, birlashtiriladi, sotib olinadi, muzlatilgan, muzlatilmagan, saqlanadigan, ozod qilinadigan
kuchdan o'tkaziladigan, nazoratni o'zgartiradigan va metadata hodisalari.

Torii zanjir davlat yo'nalishlarini aniqlaydi: `/v1/rwas` va `/v1/rwas/query`,
shu jumladan , sayohatchilar yo'nalishlari `/v1/explorer/rwas` va
`/v1/explorer/rwas/{rwa_id}` Ushbu yo'nalish oilasi qo'llanilganda.
mijozlar jonli
[`/openapi`](/uz/reference/torii-endpoints.md#common-endpoints) uchun hujjat
nod tomonidan aniq javob shakli.

### Uni sinab koʻring . Taira {#try-it-on-taira}

O ' zbekiston Respublikasi Taira hozirda ro'yxatdan o'tgan RWA koʻpchilik:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Quyidagilar roʻyxatga oling: RWA jonli yo'nalishlarda ko'rsatilgan yo'nalishlar Taira OpenAPI hujjat:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Boʻsh `items` Umumiy partiyalar hali ro'yxatdan o'tkazilmagan bo'lsa, ishlab chiqarish kutilmoqda.
Ro'yxatdan o'tish, o'tkazish, saqlash, muzlatish va sotib olish imzolangan bitimlardir.

## Ba'zida sinab ko'ring {#try-it}

Quyidagi misollarda Python SDK yer yuzalari
[Qo'shma tizim](/uz/guide/tutorials/python.md#shared-setup). O ' rnini bosing
hisob IDs, Xususiy kalitlar va hosil bo'lgan lot IDs o'zingizning qadriyatlaringiz bilan
bitimni taqdim etishdan oldin tarmoq.

### Oʻrganing RWA API Yo'nalishlar {#discover-rwa-api-routes}

Bu oʻqish uchun faqat misol ishlaydigan talab Torii ilovaga qaraydigan nod RWA
yo'nalishlar qo'llanilgan:

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

Agar ro'yxat bo'sh bo'lsa, nod hali ham qo'llab-quvvatlashi mumkin RWA ko'rsatmalar va
boshqa vositalar orqali so'rovlar Torii APIs, lekin bu tanlovning JSON
yo'nalish oilasi.

### Omborxona ritsimi ro'yxatdan o'tish {#register-a-warehouse-receipt}

Bir biznes-harakat bir imzolangan bitimga aylanishi kerak bo'lganda loyiha usulidan foydalaning.
Ish haqi toʻlov raqami kiradi `primary_reference`; katta kitob ID bo ' lmoqda
Transaksiya majburiyatlaridan so'ng hosil bo'lgan.

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

Transaksiya majburiyatlaridan so'ng, yaratilgan ro'yxat RWA IDs. Zaryad-davlat yo'nalishlari
Kanonikani oshkor qilish IDs; tadbirlar yoki explorer batafsil yo'nalishlaridan foydalaning
muvofiqlashtirish kerak ID qaytish `primary_reference` yoki metadatalar:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Eksplorator qo'llab-quvvatlangan nodlar ham boyroq proyeksiyalarni qaytarishi mumkin:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Vaqtinchalik to'xtatish bilan o'tkazib yuborish {#transfer-with-a-temporary-hold}

Yaratilgan RWA ID bu misoldan
`alice` mulkdor bo'lib, shuningdek nazoratchi sifatida konfiguratsiya qilinadi
`hold_enabled`.

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

Zilziladan tashqaridagi jarayon yakunlanganda ushlab turishni to'xtatish:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Nazorat va audit metadatalarini qoʻshish {#add-controls-and-audit-metadata}

Kontrollar va metadatalar alohida.
arizalar yoki auditorlarning ko'rsatishi kerak bo'lgan faktlar uchun metadotlar:

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

### Toʻlov yoki pensiya miqdori {#redeem-or-retire-quantity}

Tartib qilingan zanjirdan tashqaridagi aktiv yetkazib berilganda to'lov miqdori;
iste'mol qilingan, pensiyaga olingan yoki boshqa tarzda aylanmadan olib tashlangan.
`redeem_enabled`, imzochi mulkdor yoki nazoratchi bo'lishi kerak.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Qoʻllashni qayta koʻrib chiqish paytida muzlatish {#freeze-during-compliance-review}

Oddiy mulkdorlar faoliyatini blokirovka qilish kerak bo'lganda juda ko'p to'shaydi.
Imzolovchi nazoratchi bo'lishi kerak va lotda `freeze_enabled`.

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

Tekshirish o'tgach uni muzlating:

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

Hisobvaraqni RWA faktura raqamini
`primary_reference` ro'yxatdan o'tganidan so'ng hosil qilingan ID
o'tkazish va to'lov uchun.

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

To'lov mablag'i to'langan yoki to'langan bo'lsa, hosil qilingan fakturalar partiyasidan foydalaning ID:

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

O'rnatilgan miqdorni zanjirdan tashqari hisob-kitob qilishdan keyin sotib olish:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Karbon kreditlari pensiyasi {#carbon-credit-retirement}

Kreditlarni to'lovdan so'ng iste'mol qilish uchun pulni ishlating.
zanjirdan tashqaridagi sertifikat yoki ro'yxatdan o'tgan hujjatni ko'rsatadi:

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

### Ikkita koʻplikni birlashtiring {#merge-two-lots}

Ikkita to'plamdan tashqaridagi pozitsiyalar biriktirilganda, lotlarni birlashtiring.
bir xil domen bo'lishi va bir xil miqdorni qo'llash.
bolalarning ko'pligi ID.

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

Toʻliq uchun Python Transaksiya misoli, qarang
[Haqiqiy dunyodagi aktivlar](/uz/guide/tutorials/python.md#real-world-assets).

## Bogʻliq hujjatlar {#related-docs}

- [Aktivlar](/uz/blockchain/assets.md)
- [Metadatalar](/uz/blockchain/metadata.md)
- [Iroha Maxsus ko'rsatmalar](/uz/blockchain/instructions.md)
- [Savollar](/uz/reference/queries.md#assets-nfts-and-rwas)
- [Torii oxirgi nuqtalar](/uz/reference/torii-endpoints.md#app-and-sora-route-families)
