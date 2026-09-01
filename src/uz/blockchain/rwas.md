---
translation_locale: uz
translation_source: /blockchain/rwas.md
translation_source_hash: 8d64a9a17c93f60306c279e8656e6edde8ce5dd024e742218bfb9572b7438bb0
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---
# Haqiqiy dunyo aktivlari {#real-world-assets}

Haqiqiy dunyo aktivlari (RWAs) egaligi yoki boshqaruvi zanjirda kuzatiladigan zanjirdan tashqari aktivlarni modellashtiradi. Iroha da RWA — hosil qilingan identifikator, egasi hisobi, miqdor, biznes metama’lumotlari, kelib chiqish tarixi va ixtiyoriy hayot davri boshqaruviga ega ro‘yxatdan o‘tgan reyestr lotidir.

RWAs sonli aktiv qoldiqlaridan farq qiladi:

- sonli aktiv — hisobda saqlanadigan o‘zaro almashinadigan qoldiq;
- NFT — bitta egaga ega noyob zanjirdagi yozuv;
- RWA — biznes metama’lumotlari, miqdor, bandlar, muzlatish holati, muomaladan chiqarish holati, kelib chiqish tarixi va nazoratchi siyosatini olib yurishi mumkin bo‘lgan lot.

Reyestr faqat o‘zaro almashinadigan qoldiqni emas, zanjirdan tashqari muayyan lotni ifodalashi kerak bo‘lsa, RWAs dan foydalaning.

## RWA loti {#rwa-lot}

RWA loti quyidagilarni o‘z ichiga oladi:

- `id`: `<hash>$<domain>` ko‘rinishida chiqariladigan, hosil qilingan kanonik RWA identifikatori;
- `owned_by`: hozir lotga egalik qiladigan hisob;
- `quantity`: lot ifodalaydigan muomaladagi miqdor;
- `spec`: o‘nlik masshtab kabi miqdor spetsifikatsiyasi;
- `primary_reference`: zanjirdan tashqari asosiy kvitansiya, sertifikat, hisob-faktura yoki reyestr havolasi;
- `status`: ixtiyoriy biznes holati matni;
- `metadata`: biznes mazmuni va indekslash uchun ishlatiladigan ixcham JSON maydonlari;
- `parents`: ushbu lotni hosil qilishda ishlatilgan manba lotlar;
- `controls`: nazoratchi hisoblar, nazoratchi rollari va yoqilgan nazoratchi amallari;
- `is_frozen` va `held_quantity`: bajarish muhiti ta’minlaydigan hayot davri holati.

Zanjirdagi foydali yukni ixcham saqlang. Katta huquqiy hujjatlar, tekshiruv hisobotlari va nazorat dalillari to‘plamlarini WSV tashqarisida saqlab, RWA metama’lumotlariga dayjest, URI, SoraFS yo‘li yoki manifest havolasini kiriting.

## Identifikatorlar {#identifiers}

`RegisterRwa` chaqiruvchi tanlagan `id` ni ham, `owner` maydonini ham qabul qilmaydi. Tranzaksiya vakolati dastlabki `owned_by` hisobiga aylanadi, bajarish muhiti esa maqsad domenda `RwaId` ni hosil qiladi.

RWA identifikatorining matn ko‘rinishi quyidagicha:

```text
<generated-hash>$<domain>
```

Masalan:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Ilovalar o‘z biznes identifikatorini `primary_reference` yoki `metadata` da saqlashi, tranzaksiya yakunlangach esa hosil qilingan `RwaId` ni `RwaEvent::Created`, `FindRwas`, `/v1/rwas` yoki kuzatuvchi yo‘nalishlari majmuasidan aniqlashi kerak.

## Hayot davri {#lifecycle}

Odatdagi RWA ish jarayonlari quyidagilarni o‘z ichiga oladi:

| Amal | Joriy xatti-harakat |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa` | Domenda hosil qilingan identifikatorli lot yaratadi; tranzaksiya vakolati `owned_by` bo‘ladi. |
| `TransferRwa` | Miqdorni boshqa hisobga o‘tkazadi. To‘liq o‘tkazish `owned_by` ni o‘zgartirishi mumkin. Qisman o‘tkazish hosil qilingan identifikatorli alohida hosila lot yaratadi. |
| `HoldRwa` | Miqdorni band qiladi. Sozlangan nazoratchi va `hold_enabled` talab qilinadi. |
| `ReleaseRwa` | Band qilingan miqdorni bo‘shatadi. Sozlangan nazoratchi va `hold_enabled` talab qilinadi. |
| `FreezeRwa` | Eganing odatiy amallarini bloklaydi. Sozlangan nazoratchi va `freeze_enabled` talab qilinadi. |
| `UnfreezeRwa` | Eganing odatiy amallarini qayta yoqadi. Sozlangan nazoratchi va `freeze_enabled` talab qilinadi. |
| `RedeemRwa` | Miqdorni muomaladan doimiy ayiradi. `redeem_enabled` yoqilgan bo‘lsa, uni ega yoki nazoratchi yuborishi mumkin. |
| `MergeRwas` | Bir xil domen va spetsifikatsiyaga ega asos lotlar miqdorini hosil qilingan identifikatorli bitta hosila lotga birlashtiradi. |
| `ForceTransferRwa` | Miqdorni nazoratchi jarayoni orqali ko‘chiradi. Sozlangan nazoratchi va `force_transfer_enabled` talab qilinadi. |
| `SetRwaControls` | Lot boshqaruv siyosatini almashtiradi. Ega yoki nazoratchi bo‘lishi talab qilinadi. |
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` | Lot metama’lumotlarini yangilaydi. Ega yoki nazoratchi bo‘lishi talab qilinadi; muzlatilgan lotda nazoratchi kerak. |

Joriy kodda `UnregisterRwa` ko‘rsatmasi yo‘q. Ifodalangan miqdor yetkazib berilgan, iste’mol qilingan, hisob-kitob qilingan yoki boshqa tarzda muomaladan olinganida zanjirdan tashqari lotni `RedeemRwa` bilan muomaladan chiqaring.

## Metama’lumotlar va boshqaruv {#metadata-and-controls}

Ilovalarga lotni aniqlash va tekshirishda yordam beradigan ixcham faktlar uchun metama’lumotlardan foydalaning:

- aktiv sinfi, emitent, saqlovchi yoki reyestr havolasi;
- ombor, seyf, ISIN, hisob-faktura yoki sertifikat identifikatorlari;
- attestatsiyalar va huquqiy hujjatlarning kontent xeshlari;
- kattaroq dalillar to‘plamlari uchun SoraFS yo‘llari yoki manifest havolalari;
- zanjirdan tashqari xizmatlar ishlatadigan muddat, yurisdiksiya yoki muvofiqlik teglari.

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

Nazoratchi hisoblar va rollar faqat tegishli mantiqiy bayroqlar yoqqan amallarni bajarishi mumkin. Joriy boshqaruv foydali yukida nazoratchi identifikatorlari va amal bayroqlari bor. O‘tkazish ruxsat ro‘yxatlari va ichma-ich `transfers` qoidalari bu foydali yuk tarkibiga kirmaydi.

## So‘rovlar, hodisalar va APIs {#queries-events-and-apis}

Ro‘yxatdan o‘tgan RWA lotlarini sanash uchun [`FindRwas`](/uz/reference/queries.md#assets-nfts-and-rwas) dan foydalaning. Jonli yangilanishlarga muhtoj ilovalar yaratish, egani o‘zgartirish, bo‘lish, birlashtirish, muomaladan chiqarish, muzlatish, muzdan tushirish, band qilish, bo‘shatish, majburiy o‘tkazish, boshqaruvni o‘zgartirish va metama’lumot hodisalari uchun [`Rwa` ma’lumot hodisalariga](/uz/blockchain/filters.md#data-event-filters) obuna bo‘lishi mumkin.

Torii `/v1/rwas` va `/v1/rwas/query` kabi zanjir holati yo‘nalishlarini, tegishli yo‘nalishlar oilasi yoqilganda esa `/v1/explorer/rwas` va `/v1/explorer/rwas/{rwa_id}` kabi kuzatuvchi yo‘nalishlarini taqdim etadi. Hosil qilingan mijozlar tugun taqdim etadigan aniq javob shaklini bilish uchun jonli [`/openapi.json`](/uz/reference/torii-endpoints.md#common-endpoints) hujjatini asos qilib olishi kerak.

### Taira da sinab ko‘rish {#try-it-on-taira}

Ochiq Taira tarmog‘ida hozir ro‘yxatdan o‘tgan RWA lotlari bor-yo‘qligini tekshiring:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Jonli Taira OpenAPI hujjati taqdim etadigan RWA yo‘nalishlarini sanang:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Hali ochiq lotlar ro‘yxatdan o‘tmagan bo‘lsa, `items` bo‘sh chiqishi odatiy. Ro‘yxatdan o‘tkazish, o‘tkazish, band qilish, muzlatish va muomaladan chiqarish imzolangan tranzaksiyalardir.

## Sinab ko‘rish {#try-it}

Quyidagi misollar [Umumiy sozlash](/uz/guide/tutorials/python.md#shared-setup) bo‘limidagi Python SDK interfeyslaridan foydalanadi. Tranzaksiyani yuborishdan oldin hisob identifikatorlari, maxfiy kalitlar va hosil qilingan lot identifikatorlarini o‘z tarmog‘ingizdagi qiymatlarga almashtiring.

### RWA API yo'nalishlarini kashf etish {#discover-rwa-api-routes}

Faqat o‘qishga mo‘ljallangan bu misol ishlayotgan Torii tugunidan ilovaga mo‘ljallangan qaysi RWA yo‘nalishlari yoqilganini so‘raydi:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi.json", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

Ro‘yxat bo‘sh bo‘lsa, tugun boshqa Torii APIs orqali RWA ko‘rsatmalari va so‘rovlarini hanuz qo‘llashi mumkin, ammo ixtiyoriy JSON yo‘nalishlar oilasini taqdim etmayapti.

### Ombor kvitansiyasini ro‘yxatdan o‘tkazish {#register-a-warehouse-receipt}

Bitta biznes amali bitta imzolangan tranzaksiyaga aylanishi kerak bo‘lsa, qoralama usulidan foydalaning. Biznes kvitansiyasi raqami `primary_reference` ga yoziladi; reyestr identifikatori tranzaksiya yakunlangach hosil qilinadi.

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

Tranzaksiya yakunlangach, hosil qilingan RWA identifikatorlarini sanang. Zanjir holati yo‘nalishlari kanonik identifikatorlarni ko‘rsatadi; identifikatorni `primary_reference` yoki metama’lumot bilan bog‘lash kerak bo‘lsa, hodisalar yoki kuzatuvchining batafsil yo‘nalishlaridan foydalaning:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Kuzatuvchi yoqilgan tugunlar yanada boy ko‘rinishlarni ham qaytarishi mumkin:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Vaqtinchalik band bilan o‘tkazish {#transfer-with-a-temporary-hold}

Zanjir qaytargan hosil qilingan RWA identifikatoridan foydalaning. Bu misolda `alice` ega hamda `hold_enabled` yoqilgan nazoratchi sifatida sozlangan deb olinadi.

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

Zanjirdan tashqari jarayon muvaffaqiyatli tugagach, `ReleaseRwa` ni yuboring:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Boshqaruv va tekshiruv metama’lumotlarini qo‘shish {#add-controls-and-audit-metadata}

Boshqaruv va metama’lumotlar alohida tushunchalardir. Nazoratchi siyosati uchun boshqaruvdan, ilovalar yoki auditorlar ko‘rsatishi kerak bo‘lgan faktlar uchun esa metama’lumotlardan foydalaning:

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

### Miqdorni muomaladan chiqarish {#redeem-or-retire-quantity}

Taʼminlangan zanjirdan tashqaridagi aktiv yetkazib berilganidan, isteʼmol qilinganidan, muomaladan chiqarilganidan yoki boshqa tarzda aylanishdan olib tashlanganidan keyin `RedeemRwa`ni yuboring. Bu lotdan yuborilgan miqdorni doimiy ravishda ayiradi. Lotda `redeem_enabled` yoqilgan bo‘lishi kerak. Imzolovchi mulkdor yoki nazoratchi bo‘lishi kerak.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Muvofiqlik tekshiruvida muzlatish {#freeze-during-compliance-review}

Zanjirdan tashqari tekshiruv eganing odatiy amallarini bloklashi kerak bo‘lsa, `FreezeRwa` ni yuboring. Imzolovchi nazoratchi bo‘lishi va lotda `freeze_enabled` yoqilgan bo‘lishi shart.

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

Tekshiruv muvaffaqiyatli tugagach, `UnfreezeRwa` ni yuboring:

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

### Debitorlik hisob-fakturasi {#invoice-receivable}

Hisob-faktura raqamini `primary_reference` va metama’lumotlarda saqlab, hisob-fakturani RWA loti sifatida ifodalang. Ro‘yxatdan o‘tkazilgach, o‘tkazish va muomaladan chiqarish uchun hosil qilingan identifikatordan foydalaning.

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

Debitorlik moliyalashtirilsa yoki to‘lansa, hosila hisob-faktura loti ID-sidan foydalaning:

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

Zanjirdan tashqari hisob-kitob tugagach, ifodalangan miqdorni muomaladan chiqaring:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Karbon kreditlarini muomaladan chiqarish {#carbon-credit-retirement}

Talab qilingan uglerod kreditlarini muomaladan olish uchun `RedeemRwa` ni yuboring. Zanjirdan tashqari sertifikat yoki reyestr isbotini metama’lumotlarda saqlang:

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

### Ikki lotni birlashtirish {#merge-two-lots}

Zanjirdan tashqari ikki pozitsiya birlashtirilganda lotlarni qo‘shing. Asos lotlar bir domenda bo‘lishi va bir xil miqdor spetsifikatsiyasidan foydalanishi kerak. Bajarish muhiti hosila lot identifikatorini yaratadi.

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

To‘liq Python tranzaksiya namunasi uchun [Haqiqiy dunyo aktivlari](/uz/guide/tutorials/python.md#real-world-assets) bo‘limiga qarang.

## Bogʻliq hujjatlar {#related-docs}

- [Aktivlar](/uz/blockchain/assets.md)
- [Metama’lumotlar](/uz/blockchain/metadata.md)
- [Iroha maxsus ko‘rsatmalari](/uz/blockchain/instructions.md)
- [So'rovlar](/uz/reference/queries.md#assets-nfts-and-rwas)
- [Torii so‘nggi nuqtalari](/uz/reference/torii-endpoints.md#app-and-sora-route-families)
