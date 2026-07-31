---
translation_locale: mn
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Байгаль орчин {#real-world-assets}

Байгалийн санхүүжилт (RWAs) зах зээлийн гадаад хөрөнгийн загвар, түүний эзэмшилт эсвэл хяналт
Хүрэлсүх нь зах зээл дээр байнга ажиглагдаж байна. Iroha, нэг RWA бүртгэлтэй номын сантай
үүсгэсэн тодорхойлогч, эзэмшигчдийн данс, тоо хэмжээ, бизнесийн метадэтгэл,
гарал үүсэл, амьдралын мөрийн сонгон шалгаруулалт.

RWAs санхүүгийн хөрөнгийн үлдэгдэлээс ялгаатай:

- санхүүгийн актив нь бүртгэлтэй хадгаламж
- нэг NFT нэг эзэмшигчтэй цорын ганц цуврал бүртгэл
- нэг RWA Энэ нь бизнесийн метабараа, тоо, хадгаламж,
  Хүйтэнжуулалт, төлбөрийн байдал, гарал үүсэл, хяналтын ажилтны бодлого

Хэрэглээ RWAs томоохон бүртгэл нь тодорхой зах зээлийн гадаад хэсгийг төлөөлөх шаардлагатай үед
Зөвхөн мөрийн тэнцвэртэй байхын оронд.

## RWA Лот {#rwa-lot}

Хөдөлмөр RWA багаар нь:

- `id`: үүссэн каноникийн RWA тодруулбал:
  `<hash>$<domain>`
- `owned_by`: тухайн газарт одоогийн байдлаар эзэмшиж буй дансны
- `quantity`: багаар төлөөлөн үлдсэн тоо
- `spec`: тоо хэмжээний тодорхойлолтыг, жишээ нь арван шатны хэмжээнд
- `primary_reference`: зах зээлийн гаднах үндсэн хүлээн зөвшөөрөл, гэрчилгээ, фактураар эсвэл
  бүртгэлийн сүлжээ
- `status`: үйл ажиллагааны нөхцөл байдлын сонголт
- `metadata`: цогц JSON Бизнесийн хүрээнд болон индексирүүлэгт ашигладаг талбар
- `parents`: Энэ хэсгийг олохэд ашигласан эх үүсвэр
- `controls`: Хяналтын ажилтан бүртгэл, хяналтын ажиллагааны ажилтан үүрэг, зөвшөөрөлтэй хяналтлагч
  үйл ажиллагаа
- `is_frozen` болон `held_quantity`: цахилгаан хөдөлгөөнт хугацаагаар хэрэгжиж буй амьдралын мөрийн байдал

Захиргааны хэрэглээний ачааллыг нягтлан зогсоож, хууль эрх зүйн томоохон баримтуудыг хадгалах, хяналтын
Хэвлэл мэдээллийн хэрэгсэл WSV, Дараа нь нэг бичээрэй. URI, SoraFS
зам, эсвэл явдлын сэнслэл RWA Мета мэдээлэл.

## Мэдээллийн тэмдэг {#identifiers}

`RegisterRwa` шалгагч сонгогдсон хүнийг хүлээн зөвшөөрөхгүй `id`, Энэ нь хүлээн зөвшөөрөхгүй
нэг `owner` Хөдөлмөрийн эрх баригч нь анхны `owned_by`
тооцоо, цахилгаан хэрэглээний хугацаа нь `RwaId` Зорилгоны бүсэд.

Хөгжлийн хяналтын байгууллагын RWA ID нь:

```text
<generated-hash>$<domain>
```

Жишээ нь:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Хөдөлмөрийн бүртгэл `primary_reference`
эсвэл `metadata`, Дараа нь бүтээгдсэн `RwaId` цаашид
`RwaEvent::Created`, `FindRwas`, `/v1/rwas`, эсвэл хайгуулын чиглэлийн багц
бүтээн байгуулалтын дараа үүрэг гүйцэтгэнэ.

## Амьдралын мөчлөг {#lifecycle}

Уламжлалт RWA ажлын урсгал нь:

| Үйл ажиллагаа                                  | Үйл ажиллагааны хэрэгжилт                                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              | Нөхөрлөсөн...ID тухайн доменд орсон хувьцаа; гүйлгээний эрх мэдэл нь `owned_by`.                                       |
| `TransferRwa`                              | Бусад дансыг өөр бүртгэлд шилжүүлнэ `owned_by`; хэсэгчлэн шилжүүлэн суулгах нь үр хүүхэд үүсгэдэг. |
| `HoldRwa`                                  | Нөөцийн хэмжээ. `hold_enabled`.                                                     |
| `ReleaseRwa`                               | Хөөцөлдөж буй хэмжээг арилгах. `hold_enabled`.                                                 |
| `FreezeRwa`                                | Байгууллагын үйл ажиллагааг зогсоох. `freeze_enabled`.                                    |
| `UnfreezeRwa`                              | Байшин эзэмшигчдийн үйл ажиллагааг дахин идэвхжүүлнэ `freeze_enabled`.                                |
| `RedeemRwa`                                | Хувь хүн, хяналтын ажилтан болон `redeem_enabled`.                                                  |
| `MergeRwas`                                | Үүнтэй ижил доментай эцэг эх хэсгээс авсан хэмжээг нэгтгэж, төрөлжсөн хүүхдийн хэсгийг бүрдүүлэх.                              |
| `ForceTransferRwa`                         | Хөдөлмөрийг хяналтын тоног төхөөрөмжийн урсгалаар дамжуулах. `force_transfer_enabled`.                    |
| `SetRwaControls`                           | Төлбөрийн хяналтын бодлогыг өөрчлөх нь эзэмшигч эсвэл хяналт тавихчийг шаарддаг.                                                        |
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` | Хөдөлмөрийн эзэмшигч, хяналтын ажилтан шаарддаг.                                 |

Үгүй байна `UnregisterRwa` Одоогийн код дахь заавар.
зөөврийн сүлжээний гадна `RedeemRwa` төлөөлөн өгөгдсөн хэмжээг хүргүүлэхдээ,
хэрэглэгдэж, тогтворжуулж, эсвэл бусад байдлаар эргэлтээс хориглогдсон.

## Мэдээлэл, хяналт {#metadata-and-controls}

Хэрэглэлийг тодорхойлж, баталгаажуулахэд туслах цогц баримтын метабараа ашиглах
бүлэг:

- хөрөнгийн анги, эмитент, хадгаламжлагчийн эсвэл бүртгэлийн сүлжээ
- хадгаламж, хаалтын сан, ISIN, төслийн болон гэрчилгээний тодруулгыг
- Гэрчилгээ, эрх зүйн баримтын агуулгын хэшүүд
- SoraFS томоохон нотлох баримтын сүлжээний замыг эсвэл нээлттэй сүлжээ
- Захиргааны хилээс гадуур үйлчилгээний хэрэглэгддэг хугацаа, эрх мэдэл, ёсны шаардлага хангасан тэмдэг

Хөдөлмөр эрхлэх `RwaControlPolicy` дараах талбайтай:

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

Хяналтын ажилтны бүртгэл, үүрэг зөвхөн хяналтын захирал гүйцэтгэх боломжтой
Булейн тэмдэгтээр ашигласан үйлдлүүд
нөөц ачаалл бол зөвшөөрөл олгох жагсаалтын шилжүүлэн суулгах бодлого биш бөгөөд хамарсангүй
`transfers` Хууль.

## Судалгаа, үйл явдал APIs {#queries-events-and-apis}

Хэрэглээ [`FindRwas`](/mn/reference/queries.md#assets-nfts-and-rwas) жагсаалт
бүртгэгдсэн RWA Амьдрал шинэчлэл хэрэгтэй байгаа хэрэгслид
[`Rwa` Мэдээллийн үйл явдлууд](/mn/blockchain/filters.md#data-event-filters) Бүтээгдсэн,
эзэмшигч өөрчилсөн, хуваагдсан, нэгтгэсэн, төлсөн, мөсөн, мөхсөнгүй, хадгалагдаж, чөлөөлөгдсөн,
хүчний шилжүүлэн суулгасан, удирдлагын өөрчлөлт болон метадангийн үйл явдал.

Torii зах зээлийн чиглэлийг илрүүлнэ: `/v1/rwas` болон `/v1/rwas/query`,
болон хайгуулын чиглэлүүд, `/v1/explorer/rwas` болон
`/v1/explorer/rwas/{rwa_id}` Энэ чиглэлийн гэр бүл идэвхтэй байх үед
үйлчлүүлэгчид амьд
[`/openapi`](/mn/reference/torii-endpoints.md#common-endpoints) баримт бичиг
түймэрээс илрүүлсэн хариуны тод хэлбэр.

### Та үүнийг туршиж үзээрэй. Taira {#try-it-on-taira}

Олон нийтэд хүргэх эсэхийг шалгах Taira одоогоор бүртгүүлсэн RWA олон:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Үндсэн хуулийн RWA Амьдралтайгаар илрүүлсэн замыг Taira OpenAPI баримт бичиг:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Үргэлж `items` Олон нийтийн жимээр бүртгэгдээгүй үед үйлдвэрлэл хүлээлттэй байна.
Бүртгэл, шилжүүлэн суулгах, хадгалах, хатуулах, төлөх нь гарын үсэг зурсан гүйлгээ юм.

## Та үүнийг туршиж үзээрэй {#try-it}

Дараах жишээ нь: Python SDK .
[Хамтарсан зохион байгуулалт](/mn/guide/tutorials/python.md#shared-setup). Үргэлт
данс IDs, хувийн түлхүүр, үүсгэсэн баг IDs Өөрийнхөө үнэт зүйлсийг
бүтээн байгуулалтыг хүргэхээс өмнө сүлжээ.

### Хяналт тавих RWA API Замын хөдөлгөөн {#discover-rwa-api-routes}

Энэ зөвхөн унших жишээ нь гүйлгээг шаарддаг Torii Хэрэглээний чиглэлээр үйл ажиллагаа явуулж буй түймэр RWA
дараах чиглэлүүд ашиглаж болно:

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

Хэрэв жагсаалт хол бол түймэр нь аливаа үйл ажиллагааг дэмжинэ RWA заавар,
бусад хэрэгсэлээр асуух Torii APIs, Гэхдээ энэ нь сонголттой JSON
Ширээний гэр бүл.

### Хөдөлмөрийн сангийн квитан бүртгүүлнэ {#register-a-warehouse-receipt}

Нэг бизнес үйлдэл нэг гарын үсэг зурсан гүйлгээ болж байх үед төсөл ашиглах.
Бизнесийн хүлээн зөвшөөрөгдлийн дугаар нь орж ирнэ `primary_reference`; номын сан ID бол
гүйлгээний үүрэг гүйцэтгээс хойш үүссэн.

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

Транзакцын үүрэг гүйцэтгэгчдийн дараа жагсаалтыг бий болгодог RWA IDs. Хөнгөн замны чиглэл
Каноникийн ... IDs; үйл явдлыг ашиглах эсвэл хайгуулын дэд чиглэлийг
нэгтэй нийцэх шаардлагатай ID эргэн `primary_reference` эсвэл метабараа:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Эксплорер-ийн үйл ажиллагааг хангасан түймэрүүд ч илүү баялаг проекцийг буцааж болно:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Урьдчилсан хугацаатай шилжүүлэн суулгах {#transfer-with-a-temporary-hold}

Үргэлжүүлсэн RWA ID Энэ жишээ нь
`alice` эзэмшигч бөгөөд түүнчлэн хяналтын хэрэгслийн
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

Захиргааны хилээс гадуур үйл ажиллагаа дууссан тохиолдолд хаалгыг чөлөөлөгд:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Хяналт, хяналтын метабараа нэмнэ {#add-controls-and-audit-metadata}

Хяналт тавих болон метадэтгүүд нь тусдаа байдаг.
Хэрэглэгчид болон аудитор нар үзүүлэхийг шаарддаг баримтын метадэтгэл:

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

### Хувьслах, тэтгэврийн хэмжээ {#redeem-or-retire-quantity}

Төлөөлөгчээс гадаад зах зээлийн хөрөнгө хүргэгдсэн тохиолдолд төлөх хэмжээ,
Хөдөлмөрийн хэрэгслийг ашигласан, тэтгэвэрт авсан, эсвэл бусад байдлаар цувралаас гаргах.
`redeem_enabled`, гарын үсэг зурагч нь эзэн эсвэл хяналтын ажилтан байх ёстой.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Нөхцөл байдлын хяналтын үеэр хасах {#freeze-during-compliance-review}

Захиргааны гадаад шалгалт нь нийтлэг эзэмшигчдийн үйл ажиллагааг зогсоох ёстой үед ихээхэн мөсөн.
Тус гарын үсэг зурагч нь хяналтын ажилтан байх ёстой `freeze_enabled`.

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

Хяналт шалгалтыг дууссандаа үүнийг хасах:

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

### Аварын төлбөрийг хүлээн авах {#invoice-receivable}

Шилгээрийг RWA төлбөрийн тоог хадгалах
`primary_reference` бүртгэл хийсний дараа үүсгэсэн ID
шилжүүлэн суулгах, төлөх зорилгоор.

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

Тэмцээлийг санхүүжүүлэн төлсөн тохиолдолд үүсгэсэн фактын хэсгийг ашигла ID:

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

Захиргааны зах зээлээс гадуур тооцогдсоны дараа төлсөн хэмжээг чөлөөлөх:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Газрын тосны зээлийн тэтгэвэр {#carbon-credit-retirement}

Тэмцээний төлбөрийг ашиглаж, тэдгээрийн нөөцийг эргүүлэн авах.
зах зээлийн гадаад гэрчилгээ эсвэл бүртгэлийн баталгааг:

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

### Хоёр талыг нэгтгэнэ {#merge-two-lots}

Хоёр зах зээлийн байр суурийг нэгтгэсэн үед тасарч.
ижил доменд байх, мөн адил хэмжээний үзүүлэлт ашиглах.
хүүхдийн баг ID.

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

Бүх зүйл Python гүйлгээний жишээ, үзнэ үү
[Байгаль орчин](/mn/guide/tutorials/python.md#real-world-assets).

## Холбогдсон баримт бичиг {#related-docs}

- [Ашигт малтмал](/mn/blockchain/assets.md)
- [Мэдээлэл](/mn/blockchain/metadata.md)
- [Iroha Тодруулбал:](/mn/blockchain/instructions.md)
- [Судалгаа](/mn/reference/queries.md#assets-nfts-and-rwas)
- [Torii төгсгөл](/mn/reference/torii-endpoints.md#app-and-sora-route-families)
