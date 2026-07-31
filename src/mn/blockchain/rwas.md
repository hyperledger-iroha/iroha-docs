---
translation_locale: mn
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Байгаль орчин үеийн хөрөнгө {#real-world-assets}

Үнэн ертөнцөд хөрөнгө (RWAs) нь зах зээлийн гадаад хөрөнгийн загвар бөгөөд түүний эзэмшилт эсвэл хяналт нь зах зээл дээр ажиглагддаг. Iroha -д RWA бол бүртгэлтэй номын сан, үүсгэн бүтээсэн тодруулга, эзэмшигчдийн данс, хэмжээ, бизнесийн метабарууд, эх үүсвэр, болон сонголттой амьдралын мөрийн хяналтаар байдаг.

RWAs нь санхүүгийн хөрөнгийн үлдэгдэлээс ялгаатай:

- санхүүгийн актив нь бүртгэлтэй хадгаламжийн орлого
- NFT нь нэг эзэмшигчтэй цорын ганц зангилааны бүртгэл юм
- RWA нь бизнесийн метабараа, тоо хэмжээ, хадгаламж, хүйтэнжилт, төлбөрийн байдал, эх үүсвэр, хяналтын байгууллагын бодлоготой байж болно.

RWAs нь зөвхөн мөрийн тэнцвэрт орчмын оронд тухайн зангилаасаа гадуур хэсгийг төлөөлөх шаардлагатай үед ашиглана.

## RWA бүлэг {#rwa-lot}

RWA партид нь:

- `id`: үүсгэсэн RWA нэрсийн тодорхойлолтыг `<hash>$<domain>` гэж харуулж байна.
- `owned_by`: тухайн хэсгийг одоогийн байдлаар эзэмшиж байгаа сан
- `quantity`: цуврал нь төлөөлөн үлдсэн хэмжээ
- `spec`: тоо хэмжээний үзүүлэлт, жишээ нь арван шатны хэмжээнд
- `primary_reference`: зах зээлээс гадуур байрлах үндсэн хүлээн зөвшөөрөл, гэрчилгээ, фактураас эсвэл бүртгэлийн сүлжээний дуудлага
- `status`: үйл ажиллагааны нөхцөл байдлын сонголттой текст
- `metadata`: бизнесийн хүрээнд болон индексирүүлэхэд ашиглагддаг компакт JSON талбай
- `parents`: энэ хэсгийг олж авахын тулд ашигласан эх үүсвэрийн хэсгүүд
- `controls`: хяналтын ажилтны бүртгэл, хяналт тавихчийн үүрэг, зөвшөөрөлтэй хяналты тавих ажиллагаа
- `is_frozen` болон `held_quantity`: гүйлгээний цагаар хүчин төгөлдөр хэрэгжих амьдралын мөрийн байдал

Захиргааны хэрэглээний ачааллыг компакт хадгалах. WSV-ийн гадна хуулийн томоохон баримт бичиг, хяналтын тайлан, аудитын багцыг хадгалах, дараа нь URI, SoraFS замыг эсвэл RWA -ийн метадэтгээнд нээлттэй сүлжээг байрлуулна.

## Төлөөлөгч {#identifiers}

`RegisterRwa` нь дуудлага авагч сонгосон `id` хэсгийг хүлээн зөвшөөрөхгүй бөгөөд `owner` талбайг хүлээн зөвшөөрдөггүй. Транзакцын эрх баригчид эхлүүлэх `owned_by` дансанд ордог, цахилгаан хугацаа нь зорилтот доменд `RwaId` үүсгэдэг.

RWA ID-ийн текст хэлбэр нь:

```text
<generated-hash>$<domain>
```

Жишээ нь:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Хэрэглэгчид `primary_reference` эсвэл `metadata`-д аж ахуйн тодорхойлолтыг хадгалах, дараа нь `RwaEvent::Created`, `FindRwas`, `/v1/rwas`, эсвэл гүйлгээний үүрэг гүйцэтгээс хойш тогтоосон хайгуулын замаар үүссэн `RwaId`-ийг олж харах ёстой.

## Амьдралын мөчлөл {#lifecycle}

Нийтлэг RWA ажлын урсгал нь:

|Үйл ажиллагаа |Үйл ажиллагааны хэрэгжилт |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |ID гарын үсэг үүсгэн бүтээх; гүйлгээний эрх баригч нь `owned_by` болно. |
|`TransferRwa` |Тодорхой хэмжээг өөр бүртгэлд шилжүүлнэ. бүрэн шилжүүлэн суулгах нь `owned_by` өөрчлөгдөх боломжтой; хэсгийн шилжүүлэлт үр хүүхдийн багтыг бий болгодог. |
|`HoldRwa` |Нөөцийн хэмжээ. Урьдчилсан хяналтын тоног төхөөрөмж, `hold_enabled` .|
|`ReleaseRwa` |Хөөцөлдсөн хэмжээг арилгаж, тохируулсан хяналтын систем болон `hold_enabled` . |
|`FreezeRwa` |Байгууллагын үйл ажиллагааг зогсоож, тохируулсан хяналтын систем болон `freeze_enabled` шаарддаг. |
|`UnfreezeRwa` | Байшин эзэмшигчдийн үйл ажиллагааг сэргээх. `freeze_enabled`.                                |
|`RedeemRwa` |Хувь болон хяналтын ажилтан, `redeem_enabled` .|
|`MergeRwas` |Тухайн бүс нутаг дэвсгэртэй эцэг эх хэсгийн хэмжээг нийлүүлж, төрөлжсөн хүүхдийн хэсгийг бүрдүүлэх. |
|`ForceTransferRwa` |Томоохон хэмжээг хяналтын тоног төхөөрөмжийн урсгалд дамжуулахад тохируулсан хяналт болон `force_transfer_enabled` .|
|`SetRwaControls` |Хөдөлмөрийн эзэмшигч эсвэл хяналтын ажилтан шаарддаг.|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Хөгжиж буй хэсгүүд нь захиргаа шаарддаг. |

Одоогийн кодт `UnregisterRwa` заавар байхгүй. Төлөөлөн хэмжээг нийлүүлж, хэрэглэж, тохирсон эсвэл эргэлтээс өөрөөр нь гаргахдаа `RedeemRwa`-ийн хамт зах зээлийн гадаад хэсгийг буцааж өгөх.

## Metadata болон хяналт {#metadata-and-controls}

Нэвтрүүлэгт хэсгийг тодорхойлж, баталгаажуулахэд туслах цогц баримтын метабараа ашиглах:

- Ашигт малтмалын анги, эмитент, хадгаламжлагч, бүртгэлийн сүлжээ
- хадгаламж, хаалтын сан, ISIN, фактурын болон гэрчилгээний тодруулагч
- Гэрчилгээ, эрх зүйн баримт бичгийн агуулгын хэшүүд
- SoraFS томоохон гэрчилгээний багцын замыг эсвэл явдлын сүлжээ
- зах зээлээс гадуур үйл ажиллагаа явуулдаг үйлчилгээний хугацаа, эрх мэдэл, ёсны шаардлага хангасан тэмдэг

хэрэгжүүлсэн `RwaControlPolicy` нь дараах талбайдыг эзэлдэг:

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

Хяналтын тоног төхөөрөмжийн бүртгэл, үүрэг зөвхөн холбогдох Булейн далбаар хангагдсан хяналтын ажил гүйцэтгэх боломжтой. Одоогийн хяналт тавилга нь зөвшөөрлийн жагсаалтыг шилжүүлэх бодлого биш бөгөөд `transfers` дүрмийг нягтлан бодохгүй байдаг.

## Судалгаа, үйл явдал, APIs {#queries-events-and-apis}

Хэрэглээ [`FindRwas`](/mn/reference/queries.md#assets-nfts-and-rwas) бүртгэгдсэн жагсаалтад RWA Амьдралын шинэчлэл шаардлагатай хэрэгслийн хувьд [`Rwa` мэдээллийн үйл явдлууд](/mn/blockchain/filters.md#data-event-filters) бүтээсэн, эзэмшигч нь өөрчилсөн, хуваасан, нэгтгэсэн, чөлөөлөгдсөн, мөсөн, мөхсөнгүй, хадгалагдсан, чөлөөлсөн, хүчээр шилжүүлсэн, хяналтыг өөрчилсөн; болон мета өгөгдлийн үйл явц.

Torii зах зээлийн чиглэлийг илрүүлнэ: `/v1/rwas` болон `/v1/rwas/query`, болон судлаачдын чиглэлүүд `/v1/explorer/rwas` болон `/v1/explorer/rwas/{rwa_id}` Энэ чиглэлийн гэр бүл идэвхтэй байх үед. [`/openapi`](/mn/reference/torii-endpoints.md#common-endpoints) Нөөц нь тодорхой хариу хэлбэртэй баримт бичиг.

### Taira дээр туршиж үзээрэй. {#try-it-on-taira}

Нийтийн Taira нь одоогийн байдлаар RWA хуримтлагыг бүртгэж байгаа эсэхийг шалгана уу:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Амьдрал Taira OpenAPI баримтаар илрүүлсэн RWA замыг жагсаарай:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Олон нийтийн хувьцаа бүртгэгдээгүй тохиолдолд `items` хол гаргах төлөвтэй байна.

## Та үүнийг туршиж үзээрэй {#try-it}

Доорх жишээ нь Python SDK талбайг ашигладаг [Үүнд хуваалцсан тохируулалт](/mn/guide/tutorials/python.md#shared-setup). Хөдөлмөрийг өргөн мэдүүлэхээс өмнө IDs дансыг, хувийн түлхүүдийг болон үүсгэсэн хэсгийг IDs өөрийн сүлжээний үнэ цэнэтэй орчуулж болно.

### RWA API замыг олох {#discover-rwa-api-routes}

Энэ зөвхөн уншдаг жишээ нь үйл ажиллагаа явуулж буй Torii сүлжээний RWA програм хангамжийн чиглэлийг ашиглах боломжтой гэж асууж байна:

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

Хэрэв жагсаалт хол байгаа бол RWA заавар суурьшил, хайлтыг бусад Torii APIs дамжуулан дэмжих боломжтой боловч сонголттой JSON замын гэр бүлийг илрүүлэхгүй.

### Хөдөлмөрийн хадгаламжийн квитан бүртгүүлнэ {#register-a-warehouse-receipt}

Арилжааны нэг үйл ажиллагаа нэг гарын үсэг зурсан гүйлгээ болж байх үед төсөл ашиглах. Үйлдвэрлэлийн хүлээн авах сан `primary_reference`; гүйцэтгэх бүртгэл ID нь гүйлгээ батлагдсанаас хойш бий болно.

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

Транзакцын үүрэг гүйцэтгээс хойш жагсаалтыг үүсгэдэг RWA IDs. Хадгалын орчны чиглэлүүд IDs-ийг илрүүлнэ; үйл явдлыг ашиглах эсвэл хайгуулын дэлгэрэнгүй чиглэлийг хэрэглэх нь ID-ийн эргэн ирэхэд `primary_reference` эсвэл метадандоо тохируулах шаардлагатай үед:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Эксплорер-ийн үйл ажиллагааг хангасан цэгүүд нь ч илүү баялаг проекцийг буцааж болно:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Сэтгэврийн хугацаатай шилжүүлэн суулгах {#transfer-with-a-temporary-hold}

Уулган бүтээсэн RWA ID Энэ жишээ нь `alice` нь эзэмшигч бөгөөд түүнчлэн хяналтын хэрэгслийн `hold_enabled`.

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

Сүлжээнээс гадуур үйл ажиллагаа дууссан тохиолдолд хаалтыг чөлөөлөх:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Хяналт тавих, хяналтын метабараа нэмнэ {#add-controls-and-audit-metadata}

Хяналт, метадэтгэг нь тусдаа байдаг. Хяналтын захиргааны бодлогын хяналтыг ашиглаж, хэрэгслийн болон аудиторын үзүүлэлтэд шаардлагатай баримтуудын метадэтгийг:

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

### Хувьцаа авах, тэтгэврийн хэмжээ {#redeem-or-retire-quantity}

Захиргааны зах зээлээс гадуур төлөн буй актив нь хүргэгдсэн, хэрэглэгдэж байсан, тэтгэвэрт гарсан тохиолдолд чөлөөлөх хэмжээ эсвэл бусад хэлбэрээр эргэлтээс татгалзсан. `redeem_enabled`, ба гарын үсэг зурагч нь эзэмшигч эсвэл хяналтын ажилтны байх ёстой.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Нөхцөл байдлын хяналт шалгалтын үеэр хасах {#freeze-during-compliance-review}

Захиргааны гарын үсэг зурагч нь хяналтын захирал байх ёстой бөгөөд тавилга `freeze_enabled`тэй байх ёстой.

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

### Хөрөнгийн төлбөрийг хүлээн авах {#invoice-receivable}

RWA хэсгээр төлбөрийн тоог `primary_reference` болон метрийн өгөгдлийг хадгалах замаар фактураар танилцуулна. бүртгэл хийсний дараа дамжуулалт, нөхөн төлбөр авахын тулд үүсгэсэн ID-ийг ашиглана.

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

Тэмцээлийг санхүүжүүлэн төлсөн тохиолдолд үүсгэсэн фактын ID хэсгийг ашигла:

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

Захиргааны зах зээлээс гадуур зохицуулагдсанаас хойш төлөн буй хэмжээг чөлөөлөх:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Уул уурхайн зээлийн тэтгэврийн {#carbon-credit-retirement}

Хөдөлмөрийн зах зээлийн бус гэрчилгээ эсвэл бүртгэлийн баталгааг тодруулахад метабарууд нь:

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

Хоёр зах зээлийн байр суурь нэгтгэнэ. эцэг эх нь ижил бүс нутагт байх ёстой бөгөөд ижил хэмжээний үзүүлэлт ашиглах ёстой. Хөгжилтийн хугацаа хүүхдийн хэсгийг үүсгэдэг ID.

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

Python гүйлгээний томоохон жишээг үзвэл [Real-World Assets](/mn/guide/tutorials/python.md#real-world-assets).

## Холбогдсон баримт бичиг {#related-docs}

- [Байгууллага](/mn/blockchain/assets.md)
- [Metadata](/mn/blockchain/metadata.md)
- [Iroha Ардчилсан удирдамж](/mn/blockchain/instructions.md)
- [Судалгаа](/mn/reference/queries.md#assets-nfts-and-rwas)
- [Torii эцсийн цэгүүд](/mn/reference/torii-endpoints.md#app-and-sora-route-families)
