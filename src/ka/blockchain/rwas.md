---
translation_locale: ka
translation_source: /blockchain/rwas.md
translation_source_hash: cbdc6d766fb90bea7e68dc67f2c705bb1638340feeb2fca9f2dd43a727ac03e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# რეალური აქტივები {#real-world-assets}

რეალურ სამყაროში აქტივები (RWAs) მოდელის off-chain აქტივები, რომელთა საკუთრება ან კონტროლი თვალსაზრისით მიმდინარეობს ჯაჭვზე. Iroha, RWA არის დარეგისტრირებული ლიდერის პარტია გენერირებული იდენტიფიკატორი, მფლობელის ანგარიში, რაოდენობა, ბიზნეს მეტადატალიკა, წარმოშობა და ვარიანტული სიცოცხლის ციკლის კონტროლი.

RWAs განსხვავდება ციფრული აქტივების ბალანსებისგან:

- ციფრული აქტივი არის ანგარიშის მიერ განთავსებული ფუნგებადი ბალანსი.
- NFT არის უნიკალური ჩანაწერი ერთ მფლობელთან ერთად ქსელში.
- RWA არის პარტია, რომელსაც შეუძლია მოიტანოს ბიზნესის მეტა მონაცემები, რაოდენობა, შენახვა, გაყინვა, გამოსყიდვის მდგომარეობა, წარმომავლობა და კონტროლერის პოლიტიკა

გამოიყენეთ RWAs მაშინ, როდესაც მთავარ წიგნს უნდა წარმოადგენდეს კონკრეტული პარტია ჯაჭვის გარეთ, ნაცვლად მხოლოდ ფუნგებადი ბალანსისა.

## RWA ობიექტი {#rwa-lot}

RWA პარტიის შემცველია:

- `id`: წარმოქმნილი კანონიკური RWA იდენტიფიკატორი, რომელიც აღინიშნება როგორც `<hash>$<domain>`
- `owned_by`: ანგარიში, რომელიც ამჟამად პარტიის მფლობელია
- `quantity`: პარტიის მიერ წარმოდგენილი გამოტანილი რაოდენობა
- `spec`: რაოდენობის სპეციფიკა, მაგალითად დეციმალური მასშტაბი
- `primary_reference`: ძირითადი საკრედიტო ქვითრის, სერტიფიკატის, ანგარიშსწორების ან რეესტრის მითითება
- `status`: ვაკანსიური ბიზნეს სტატუსის ტექსტი
- `metadata`: კომპაქტური JSON ველები, რომლებიც გამოიყენება ბიზნეს კონტექსტისა და ინდექსირებისთვის.
- `parents`: ამ პარტიის მოსაპოვებლად გამოყენებული წყარო პარტები
- `controls`: კონტროლის ანგარიშები, კონტროლის როლები და კონტროლის ოპერაციების ჩართვა
- `is_frozen` და `held_quantity`: სასიცოცხლო ციკლის მდგომარეობა, რომელიც გათვალისწინებულია გამშვებ დროით.

შეინახეთ ჯაჭვზე არსებული სასარგებლო ტვირთის კომპაქტი. შენახეთ დიდი სამართლებრივი დოკუმენტები, ინსპექტირების ანგარიშები და აუდიტის ბუნდები WSV-ს გარეთ, შემდეგ მოათავსეთ დიგესტი, URI, SoraFS გზა ან მანიფესტური რეფერენცია RWA მეტადატებში.

## იდენტიფიკატორები {#identifiers}

`RegisterRwa` არ იღებს დამრეკლის მიერ არჩეულ `id` სფეროს და არ იღებს `owner` ველს. ოპერაციული ორგანო ხდება საწყისი `owned_by` ანგარიში, ხოლო გამშვები დრო წარმოქმნის მიზნობრივ დომენში `RwaId`.

RWA ID ფორმის ტექსტი შემდეგია:

```text
<generated-hash>$<domain>
```

მაგალითად:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

აპლიკაციები უნდა შეინახონ თავიანთი ბიზნეს-იდენტიფიკატორი `primary_reference` ან `metadata`, შემდეგ აღმოაჩინონ წარმოქმნილი `RwaId` `RwaEvent::Created`, `FindRwas`, `/v1/rwas`, ან მკვლევარის მარშრუტი, რომელიც განისაზღვრება ტრანზაქციის დაკავების შემდეგ.

## სიცოცხლის ციკლი {#lifecycle}

საერთო RWA სამუშაო პროცესები მოიცავს:

|ოპერაცია |განხორციელებული ქცევა |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |შეიქმნას გენერირებული ID პარტია დომენში; ტრანზაქციის ავტორიტეტი ხდება `owned_by`. |
|`TransferRwa` |გადაიტანეთ რაოდენობა სხვა ანგარიშზე. სრული ტრანსფერი შეიძლება შეიცვალოს `owned_by`. ნაწილობრივი ტრანსფერით შეიქმნება ცალკე საბავშვო პარტია გამომუშავებული ID.  |
|`HoldRwa` |სათადარიგო რაოდენობა. საჭიროებს კონფიგურირებულ მმართველს და `hold_enabled`. |
|`ReleaseRwa` |ავიცილეთ დაკავებული რაოდენობა. საჭიროა კონფიგურირებული კონტროლერი და `hold_enabled`. |
|`FreezeRwa` |ჩვეულებრივი მფლობელის ოპერაციების დაბლოკვა. საჭიროებს კონფიგურირებულ კონტროლერს და `freeze_enabled`. |
|`UnfreezeRwa` |რეაბილიტაცია ჩვეულებრივი მფლობელის ოპერაციების. საჭიროებს კონფიგურირებულ კონტროლერს და `freeze_enabled`. |
|`RedeemRwa` |მუდმივად ამოიღეთ რაოდენობა მიმოქცევადან. პატრონს ან კონტროლერს შეუძლია წარუდგინოს ეს ინფორმაცია, როდესაც `redeem_enabled` არის ჭეშმარიტი |
|`MergeRwas` |შეაერთეთ მშობლიური პარტიების რაოდენობა იმავე დომენით და სპეციფიკაციით წარმოქმნილი ბავშვის პარტიად. |
|`ForceTransferRwa` |გადაადგილება რაოდენობა კონტროლერის ნაკადის მეშვეობით. მოითხოვს კონფიგურირებული კონტროლერი და `force_transfer_enabled`. |
|`SetRwaControls` |ოჲეაპვრთნარ ჟჲ ოპვჟრგჲრწნთკა. ვ რპწბგა ეა ჟვ ოპვჟრგყპნა მფლობელმა ან კონტროლორმა.|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |განახლება პარტიის მეტა მონაცემები. მოითხოვს მფლობელს ან კონტროლერს; გაყინული პარტიები საჭიროებს კონტროლერს. |

ამჟამინდელ კოდში არ არის მითითება `UnregisterRwa`. ამოიღეთ off-chain პარტია `RedeemRwa` მაშინ, როდესაც წარმოდგენილი რაოდენობა მიწოდებულია, მოიხმარა, დარეგულირდა ან სხვაგვარად ამოღებულია ბრუნვისგან.

## მეტა მონაცემები და კონტროლი {#metadata-and-controls}

გამოიყენეთ მეტა მონაცემები კომპაქტური ფაქტებისათვის, რომლებიც ხელს შეუწყობს აპლიკაციების მიერ პარტიის იდენტიფიცირებისა და შემოწმებისას:

- აქტივების კლასის, ემიტენტის, მფლობელის ან რეესტრის მითითება
- საწყობის, საფონდის, ISIN, ანგარიშის ან სერტიფიკატის იდენტიფიცირების მონაცემები
- შინაარსის ჰაშები ატესტაციებისა და სამართლებრივი დოკუმენტებისათვის
- SoraFS გზები ან მანიფესტური რეფერენციები უფრო დიდი მტკიცებულებების ბუნდებისთვის
- ვადა, იურისდიქციის ან შესაბამისობის ეტიკეტები, რომლებიც გამოიყენება არაფარგლებში არსებული სერვისების მიერ

განხორციელებულ `RwaControlPolicy`-ში მოცემულია შემდეგი ველები:

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

კონტროლერის ანგარიშებსა და როლებს შეუძლია განახორციელოს მხოლოდ ოპერაციები, რომლებიც შეუძლიათ შესაბამისი ბულური დროშებით. მიმდინარე მართვის სასარგებლო ტვირთი შეიცავს მმართველის ვინაობასა და ოპერაციის დროშებს. გადაცემის ნებადართული სიები და ჩაფლული `transfers` წესები ამ სასარგებლო დატვირთვის გარეთ არის.

## შეკითხვები, მოვლენები და APIs {#queries-events-and-apis}

გამოიყენეთ [`FindRwas`](/ka/reference/queries.md#assets-nfts-and-rwas) დარეგისტრირებული RWA პარტიების ჩამონათვალისთვის. აპლიკაციებს, რომლებსაც საჭიროებენ ცოცხალი განახლებები, შეუძლიათ გამოიწერონ [`Rwa` მონაცემთა მოვლენები ](/ka/blockchain/filters.md#data-event-filters) შექმნილი, მფლობელის შეცვლით, გაყოფილი, გაერთიანებული, გამოსყიდული, გაყინული, გახსნილი, შენახული, გათავისუფლებული, ძალის გამოყენებით გადატანილი, კონტროლის შეცვლისთვის, და მეტა მონაცემების მოვლენები.

Torii ასახავს ჯაჭვური სახელმწიფოს მარშრუტებს, როგორიცაა `/v1/rwas` და `/v1/rwas/query`, პლუს მკვლევარის მარშრუტები, როგორიცაა `/v1/explorer/rwas` და `/v1/explorer/rwas/{rwa_id}` როდესაც ამ მარშრუტის ოჯახი ჩართულია. გენერირებულმა კლიენტებმა უნდა უპირატესობა მიანიჭონ ცოცხალ [`/openapi`](/ka/reference/torii-endpoints.md#common-endpoints) დოკუმენტს ზუსტი პასუხის ფორმისთვის, რომელიც განთავსებულია კვანძით.

### სცადეთ Taira {#try-it-on-taira}

შეამოწმეთ, აქვს თუ არა საჯარო Taira ამჟამად რეგისტრირებული RWA პარტიები:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

ჩამოთვალეთ RWA მარშრუტები, რომლებიც განთავსებულია ცოცხალი Taira OpenAPI დოკუმენტის მიხედვით:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

ცარიელი `items` გამოშვება მოსალოდნელია, როდესაც საჯარო პარტიები ჯერ არ არის დარეგისტრირებული. რეგისტრაცია, გადაცემა, შენახვა, გაყინვა და გამოსასყიდი ხელმოწერილია ოპერაციები.

## სცადე. {#try-it}

ქვემოთ მოცემული მაგალითები იყენებს Python SDK ზედაპირებს [Share Setup](/ka/guide/tutorials/python.md#shared-setup). შეცვალეთ ანგარიში IDs, კერძო გასაღებები და გენერირებული პარტია IDs საკუთარი ქსელის ღირებულებებით ტრანზაქციის წარდგენის წინ.

### აღმოაჩინეთ RWA API მარშრუტები {#discover-rwa-api-routes}

აღნიშნული მხოლოდ წაკითხვის მაგალითი ითხოვს მიმდინარე Torii კვანძს, რომელ აპლიკაციის მიმართულებით RWA მარშრუტებიც არის ჩართული:

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

თუ ჩამონათვალი ცარიელია, კვანძში შეიძლება კვლავ იყოს RWA ინსტრუქციების და შეკითხვების მხარდაჭერა სხვა Torii APIs საშუალებით, მაგრამ იგი არ გამოავლინებს ვარიანტულ JSON მარშრუტის ოჯახს.

### დარეგისტრირეთ საწყობში მიღებული ქვითარი {#register-a-warehouse-receipt}

გამოიყენეთ პროექტი, როდესაც ერთი ბიზნეს აქცია უნდა გახდეს ერთი ხელმოწერილი ოპერაცია. საწარმოო ქვითრის ნომერი შედის `primary_reference`; მთავარ წიგნს ID წარმოადგენს ტრანზაქციის დადების შემდეგ.

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

ტრანზაქციის კომიტეტის შემდეგ, შეიქმნება სია RWA IDs. ჯაჭვური მდგომარეობის მარშრუტები გამოყოფენ კანონიკურ IDs; გამოიყენეთ მოვლენების ან Explorer დეტალური მარშრუტები, როდესაც თქვენ უნდა შეესაბამოთ ID დაბრუნება `primary_reference` ან მეტადატანი:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Explorer-ის ჩართულმა კვანძებმა ასევე შეიძლება დაუბრუნოს უფრო მდიდარი პროექციები:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### გადაყვანა დროებით შეჩერებით {#transfer-with-a-temporary-hold}

გამოიყენეთ წარმოქმნილი RWA ID ჯაჭვის მიერ დაბრუნებული. ეს მაგალითი ვარაუდობს, რომ `alice` არის მფლობელი და ასევე კონფიგურირებულია როგორც კონტროლერი `hold_enabled`.

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

წარადგინეთ `ReleaseRwa` შემდეგ, რაც ციხის გარეთ პროცესი წარმატებით დასრულდა:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### დამატება კონტროლის და აუდიტის მეტა მონაცემები {#add-controls-and-audit-metadata}

კონტროლი და მეტა მონაცემები ცალკე არიან. გამოიყენეთ კონტროლის პოლიტიკაზე კონტროლი, ხოლო იმ ფაქტებზე მეტა მონაცემების გამოყენება, რომლებიც განაცხადებში ან აუდიტორებში უნდა იყოს წარმოდგენილი:

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

### გადახდის ან საპენსიო რაოდენობა {#redeem-or-retire-quantity}

წარადგინეთ `RedeemRwa` მას შემდეგ, რაც წარმოდგენილი off-chain აქტივი მიწოდებულია, მოიხმარება, პენსიაზეა მიღებული ან სხვაგვარად ამოღებულია მიმოქცევადან. ეს მუდმივად ამცირებს წარდგენილ რაოდენობას პარტიიდან. პარტიას უნდა ჰქონდეს `redeem_enabled`. ხელმომწერი უნდა იყოს პატრონი ან კონტროლერი.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### გაყინვა შესაბამისობის გადამოწმების დროს {#freeze-during-compliance-review}

წარადგინეთ `FreezeRwa`, როდესაც რიგგარეშე მიმოხილვისას ჩვეულებრივი მფლობელის ოპერაციების დაბლოკვაა საჭირო. ხელმომწერი უნდა იყოს კონტროლერი. პარტია უნდა შეიცავდეს `freeze_enabled`.

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

წარადგინოს `UnfreezeRwa` განხილვის შემდეგ:

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

### ანგარიშსწორება {#invoice-receivable}

წარმოაჩინეთ ფაქტი, როგორც RWA პარტიის მიერ ანგარიშსწორების ნომრის შენახვა `primary_reference` და metadata. რეგისტრაციის შემდეგ, გამოიყენეთ გენერირებული ID გადაცემისა და გამოსასყიდის მიზნით.

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

როდესაც მოთხოვნაა დაფინანსებული ან გადახდილი, გამოიყენეთ გამომუშავებული ანგარიშსწორების პარტია ID:

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

გადაიხადოს წარმოდგენილი თანხა ქსელის გარეშე ანგარიშსწორების შემდეგ:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### ნახშირბადის კრედიტის პენსიონი {#carbon-credit-retirement}

წარადგინეთ `RedeemRwa` იმისთვის, რომ მოითხოვებული ნახშირბადის კრედიტები მიმოქცევიდან ამოიღონ. შეინახეთ სერტიფიკატი ან რეესტრის მტკიცებულება მეტადატაში:

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

### გაერთიანეთ ორი ობიექტი {#merge-two-lots}

გაერთიანება ლოტები, როდესაც ორი off-chain პოზიციები არის კონსოლიდირებული. მშობლები უნდა იყოს იმავე დომენში და გამოიყენოს იგივე რაოდენობის სპეციფიკა. runtime წარმოქმნის შვილი ლოტი ID.

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

Python ტრანზაქციის სრული მაგალითისთვის იხილეთ [Real-World Assets](/ka/guide/tutorials/python.md#real-world-assets).

## დაკავშირებული დოკუმენტები {#related-docs}

- [აქტივები](/ka/blockchain/assets.md)
- [მეტა მონაცემები](/ka/blockchain/metadata.md)
- [Iroha სპეციალური ინსტრუქციები](/ka/blockchain/instructions.md)
- [შეკითხვები](/ka/reference/queries.md#assets-nfts-and-rwas)
- [Torii საბოლოო წერტილები](/ka/reference/torii-endpoints.md#app-and-sora-route-families)
