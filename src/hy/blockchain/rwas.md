---
translation_locale: hy
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Իրական աշխարհի ակտիվներ {#real-world-assets}

Real-world assets (RWAs) մոդել off-chain ակտիվներ, որոնց սեփականությունը կամ վերահսկողությունը հետեւվում է շղթայի վրա: Iroha -ում RWA գրանցված գրքի խմբաքանակն է ստեղծված նույնականացմամբ, սեփականատիրոջ հաշիվով, քանակությամբ, բիզնեսի մետադատայով, ծագմամբ եւ ընտրանքային կյանքի ցիկլի վերահսկողությամբ:

RWAs տարբերվում են թվային ակտիվների բալանսներից.

- թվային ակտիվը հաշվառման կողմից պահվող ֆունգիբալ հավասարակշռությունն է
- NFT - մեկ սեփականատեր ունեցող յուրահատուկ ցանցային գրանցում:
- RWA բլոկը կարող է կրել բիզնեսի մետադատա, քանակություն, պահեստներ, սառեցումներ, փոխհատուցման վիճակ, ծագում եւ վերահսկողության քաղաքականություն

Օգտագործեք RWAs այն դեպքում, երբ գլխավոր գրքում պետք է ներկայացվի միայն ֆունգիբալ հավասարակշռվածության փոխարեն որոշակի ոչ շղթայական խմբաքանակ:

## RWA խմբաքանակ {#rwa-lot}

RWA խմբաքանակը պարունակում է:

- `id`: ստեղծված կանոնիկ RWA նույնականացողը, որը ցուցադրվում է որպես `<hash>$<domain>`:
- `owned_by`: հաշիվը, որը ներկայումս պատկանում է խմբաքանակին:
- `quantity`: խմբաքանակի կողմից ներկայացված մնացած քանակը
- `spec`: քանակության առանձնահատկություն, օրինակ՝ տասնամյակային մասշտաբով
- `primary_reference`: առանց շղթայի հիմնական ստուգումը, վկայագիրը, հաշիվը կամ գրանցման հղումը
- `status`: ընտրանքային բիզնեսի կարգավիճակի տեքստ
- `metadata`: կոմպակտ JSON դաշտեր, որոնք օգտագործվում են բիզնեսի համատեքստում եւ ինդեքսավորման համար
- `parents`: աղբյուրային խմբաքանակներ, որոնք օգտագործվել են այս խմբաքանակի արդյունահանման համար
- `controls`: վերահսկողության հաշիվներ, վերահսկողի դերակատարություն եւ վերահսկիչի գործողությունները
- `is_frozen` եւ `held_quantity`: կյանքի ցիկլային վիճակ, որը ուժի մեջ է մտնում վազման ժամանակով

Պահպանեք շղթայի վրա գտնվող օգտակար բեռը համապարփակ: Խնայեք մեծ իրավական փաստաթղթեր, ստուգման զեկույցներ եւ աուդիտային փաթեթները WSV-ի սահմաններից դուրս, այնուհետեւ տեղադրեք մետադատա URI, SoraFS ուղին կամ հստակ հղում RWA- ի մեջ:

## Հայտարարիչներ {#identifiers}

`RegisterRwa` չի ընդունում զանգահարողի կողմից ընտրված `id` դաշտը եւ չի ընդունում `owner` դաշտը: Գործարքի իշխանությունը դառնում է սկզբնական `owned_by` հաշիվը, իսկ վազման ժամանակը առաջացնում է նպատակային տիրույթում գտնվող `RwaId` դոմենը:

RWA ID տեքստային ձեւը հետեւյալն է.

```text
<generated-hash>$<domain>
```

Օրինակ՝

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Դիմումները պետք է պահեն իրենց բիզնեսի նույնականացողը `primary_reference` կամ `metadata` հասցեներում, այնուհետեւ հայտնաբերեն `RwaId`-ը, որը ստեղծվել է `RwaEvent::Created`, `FindRwas`, `/v1/rwas` կամ գործարքի պարտավորություններից հետո սահմանված հետազոտողի երթուղինից:

## Կյանքի ցիկլ {#lifecycle}

Սովորական RWA աշխատանքային հոսքերը ներառում են:

|Օպերացիա |Իրականացված վարքագիծ |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |Ստեղծեք ID ստեղծված բողոքը տիրույթում, գործարքի իշխանությունը դառնում է `owned_by`: |
|`TransferRwa` |Տեղափոխեք քանակությունը մեկ այլ հաշիվ: Ամբողջական փոխանցումը կարող է փոխել `owned_by`; մասնակի փոխանցումը ստեղծում է արտադրված զավակային խմբաքանակը: |
|`HoldRwa` |Պահանջվում է կոնֆիգուրացված վերահսկիչ եւ `hold_enabled`: |
|`ReleaseRwa` |Հեռացրեք պահված քանակությունը: Պահանջվում է կոնֆիգուրացված վերահսկիչ եւ `hold_enabled`. |
|`FreezeRwa` |Բլոկ սովորական սեփականատիրոջ գործողությունները. պահանջում է կոնֆիգուրացված վերահսկողություն եւ `freeze_enabled`. |
|`UnfreezeRwa` |Վերականգնել սովորական սեփականատերերի գործողությունները: Պահանջվում է կոնֆիգուրացված վերահսկողություն եւ `freeze_enabled`. |
|`RedeemRwa` |Պահանջում է սեփականատեր կամ վերահսկող եւ `redeem_enabled`. |
|`MergeRwas` |Միացրեք նույն տիրույթով ծնողական խմբերի քանակները եւ կազմեք արտադրված երեխայի խմբի: |
|`ForceTransferRwa` |Պահանջվում է կոնֆիգուրացված վերահսկիչ եւ `force_transfer_enabled` |
|`SetRwaControls` |Պահանջում է սեփականատիրոջ կամ վերահսկողության:|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Պահանջվում է սեփականատեր կամ վերահսկող, սառեցված խմբերի պահանջում են վերահսկող: |

Գործող կոդում չկա `UnregisterRwa` հրահանգ: Հեռացրեք `RedeemRwa`-ի հետ շղթայից դուրս գտնվող խմբաքանակը, երբ ներկայացված քանակությունը մատակարարվում է, սպառվում է, կարգավորվում կամ այլ կերպ հեռացվել է շրջանառությունից:

## Մետադատա եւ վերահսկողություն {#metadata-and-controls}

Օգտագործեք մետադատա տվյալներ համապարփակ փաստերի համար, որոնք կօգնեն դիմումներին պարզել եւ հաստատել խմբաքանակը.

- ակտիվների դասի, թողնողի, պահապանի կամ գրանցման հղում
- պահեստ, գանձարան, ISIN, հաշիվ կամ վկայակոչի նույնականացումներ
- վավերագրերի եւ իրավական փաստաթղթերի բովանդակության хэշեր
- SoraFS ավելի մեծ ապացույցների փաթեթների համար ուղիներ կամ մատնանշված հղումներ
- ժամկետի, իրավասության կամ համապատասխանության նշանները, որոնք օգտագործվում են արտագաղթային ծառայությունների կողմից:

իրականացված `RwaControlPolicy` պարունակում է հետեւյալ դաշտերը.

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

Կառավարիչի հաշիվներն ու դերերը թույլատրվում են կատարել միայն համապատասխան բուլյան դրոշով հնարավորեցրած վերահսկողության գործողությունները: Ներկայիս կառավարման օգտակար լիցքը թույլատրելի ցուցակի փոխանցման քաղաքականություն չէ եւ չի պարունակում ամրացված `transfers` կանոններ:

## Հարցեր, իրադարձություններ եւ APIs {#queries-events-and-apis}

Օգտագործել [`FindRwas`](/hy/reference/queries.md#assets-nfts-and-rwas) գրանցված ցուցակ RWA Հավելվածները, որոնք կարիք ունեն կենդանի թարմացումների, կարող են բաժանորդագրվել [`Rwa` տվյալների իրադարձություններ](/hy/blockchain/filters.md#data-event-filters) ստեղծված, սեփականատերերի փոխանակման, բաժանման, միաձուլման, վարձակալման, սառեցման, չսառեցման համար, պահվելու, ազատելու, ուժով փոխանցվելու, վերահսկողության փոփոխման համար, եւ մետադատային իրադարձություններ:

Torii բացահայտում է շղթայական պետության երթուղիներ, ինչպիսիք են: `/v1/rwas` եւ `/v1/rwas/query`, բացի հետազոտողների երթուղիների, ինչպիսիք են `/v1/explorer/rwas` եւ `/v1/explorer/rwas/{rwa_id}` երբ այդ երթուղային ընտանիքը ակտիվացված է: Ստեղծված հաճախորդները պետք է նախընտրեն կենդանի [`/openapi`](/hy/reference/torii-endpoints.md#common-endpoints) փաստաթուղթ, որը ցույց է տալիս հանգույցի ճշգրիտ արձագանքման ձեւը:

### Փորձեք այն Taira {#try-it-on-taira}

Ստուգեք, թե արդյոք հանրային Taira ներկայումս գրանցել է RWA խմբաքանակները.

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Ցուցադրել RWA երթուղիները, որոնք բացահայտված են կենդանի Taira OpenAPI փաստաթղթում.

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Բաց `items` արտադրանքը ակնկալվում է, երբ դեռեւս հանրային խմբաքանակներ չեն գրանցվել: Գրանցում, փոխանցում, պահպանում, սառեցում եւ վարձավճար են ստորագրված գործարքներ:

## Փորձեք {#try-it}

Ստորեւ բերված օրինակները օգտագործում են Python SDK մակերեսները [Share Setup](/hy/guide/tutorials/python.md#shared-setup)-ից: Նախքան գործարք ուղարկելը փոխարինեք հաշիվը IDs, մասնավոր բանալիները եւ ստեղծված խմբաքանակը IDs ձեր սեփական ցանցի արժեքներով:

### Գտիր RWA API երթուղիներ {#discover-rwa-api-routes}

Այս միայն ընթերցվող օրինակը խնդրում է վազող Torii հանգույցից, որին հնարավորություն են տրվում հավելվածի առջեւ գտնվող RWA երթուղիները.

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

Եթե ցուցակը դատարկ է, բջիջը կարող է դեռ աջակցել RWA հրահանգներին եւ հարցումները այլ Torii APIs միջոցով, բայց այն չի բացահայտում ընտրական JSON երթուղիների ընտանիքը:

### Գանձարանային վոմենտ {#register-a-warehouse-receipt}

Օգտագործեք նախագիծ, երբ մի բիզնես գործողություն պետք է դառնա մեկ ստորագրված գործարք: Գործարար վոմի թիվը գնում է `primary_reference`; գլխավոր գրասենյակը ID ստեղծվում է այն բանից հետո, երբ գործարքը պարտավորվում է:

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

Գործարքի կատարումից հետո ստեղծվում է ցուցակ RWA IDs. Շղթային վիճակի երթուղիները բացատրում են կանոնիկ IDs; օգտագործեք իրադարձությունների կամ հետազոտողի մանրամասներ երթուղիներ, երբ անհրաժեշտ է համապատասխանեցնել ID վերադարձը `primary_reference` կամ մետադատա:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Explorer- ի հնարավորություն ունեցող հանգույցները կարող են նաեւ վերադարձնել ավելի հարուստ կանխատեսումներ.

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Տրանսֆեր՝ ժամանակավոր պահով {#transfer-with-a-temporary-hold}

Օգտագործեք արտադրված RWA ID, որը վերադարձվում է շղթայով: Այս օրինակը ենթադրում է, որ `alice` սեփականատերն է եւ ինչպես նաեւ կազմավորվում է որպես վերահսկողություն ՝ `hold_enabled`.

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

Բաց թողնել պահվածքը, երբ ավարտվել է չշղթակից դուրս գործընթացը.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Վերահսկողության եւ ստուգման մետադատաներ ավելացնել {#add-controls-and-audit-metadata}

Կառավարումներն ու մեթադատները առանձին են: Օգտագործեք վերահսկողություն' վերահսկողի քաղաքականության համար, եւ մետադատան այն փաստերի համար, որոնք պետք է ցուցադրվեն դիմումների կամ աուդիտորների համար.

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

### Գնահատման կամ կենսաթոշակի գումարը {#redeem-or-retire-quantity}

Փոխհատուցման քանակություն, երբ ներկայացված արտագաղթային ակտիվը մատակարարվել է, սպառվել, դադարեցվել կամ այլ կերպ հեռացվել շրջանառությունից: Խումբը պետք է ունենա `redeem_enabled`, եւ ստորագրողը պետք է լինի սեփականատերը կամ վերահսկողությունը:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Հետեւողականության վերանայման ժամանակ սառեցեք {#freeze-during-compliance-review}

Սառեցեք շատ, երբ օֆ-շղթակից վերանայումը պետք է արգելափակի սովորական սեփականատերերի գործողությունները: ստորագրողը պետք է լինի վերահսկող եւ բախտը պետք է ունենա `freeze_enabled`.

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

Հեռացրեք այն վերանայման անցնելուց հետո.

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

### Գնացքային հաշիվ {#invoice-receivable}

Ներկայացրեք հաշիվը որպես RWA խմբաքանակ ՝ պահելով հաշիվի համարը `primary_reference` եւ մետադատները: Գրանցվելուց հետո օգտագործեք առաջադրված ID փոխանցման եւ փրկության համար:

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

Երբ պարտավորությունը ֆինանսավորվում է կամ վճարվում է, օգտագործեք ստեղծված հաշիվային բաժինը ID:

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

Ներկայացվող գումարը փոխհատուցում է առանց շղթայի հաշվարկից հետո.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Ածխածնի վարկային կենսաթոշակ {#carbon-credit-retirement}

Օգտագործեք փոխհատուցում' վարկեր ստանալու համար այն բանից հետո, երբ դրանք պահանջվում են: Մետադատները ցույց են տալիս արտահոսքային վկայականի կամ գրանցման ապացույցի մասին.

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

### Միացրեք երկու լոտներ {#merge-two-lots}

Միաձուլեք միավորումները, երբ համախմբվում են երկու արտագաղթային դիրքեր: Ծնողները պետք է լինեն նույն տիրույթում եւ օգտագործեն նույն քանակության առանձնահատկությունը: Գործընթացը ստեղծում է երեխա լոտին ID.

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

Python գործարքի ամբողջական օրինակի համար տես [Real-World Assets](/hy/guide/tutorials/python.md#real-world-assets):

## Ծանոթացված փաստաթղթեր {#related-docs}

- [Գործիքներ](/hy/blockchain/assets.md)
- [Մետադատա](/hy/blockchain/metadata.md)
- [Iroha Հատուկ հրահանգներ](/hy/blockchain/instructions.md)
- [Հարցեր](/hy/reference/queries.md#assets-nfts-and-rwas)
- [Torii վերջնական կետեր](/hy/reference/torii-endpoints.md#app-and-sora-route-families)
