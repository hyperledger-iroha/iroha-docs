---
translation_locale: ka
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# რეალურ სამყაროში არსებული აქტივები {#real-world-assets}

რეალური აქტივები (RWAs) მოდელი off-chain აქტივები, რომელთა საკუთრება ან კონტროლი
ჟაჟრთნარაჲ ვ ნაოპაგთლ. Iroha, დასახელება RWA არის რეგისტრირებული ლიდერული პარტია
გენერირებული იდენტიფიკატორი, მფლობელის ანგარიში, რაოდენობა, ბიზნესის მეტა მონაცემები;
წარმოშობისა და სიცოცხლის ციკლის ნორმატიული კონტროლი.

RWAs განსხვავდება ციფრული აქტივების ბალანსებისგან:

- ციფრული აქტივი არის ანგარიშის მიერ დაკავებული ფუნგებადი ბალანსი
- დასახელება NFT არის უნიკალური ჩანაწერი ერთ მფლობელთან ერთად
- დასახელება RWA არის ბევრი, რომელსაც შეუძლია მოიტანოს ბიზნესის მეტა მონაცემები, რაოდენობა, ინახავს,
  გაყინვა, გადახდის მდგომარეობა, წარმომავლობა და კონტროლერის პოლიტიკა

გამოყენება RWAs როდესაც მთავარ წიგნს უნდა წარმოადგენდეს კონკრეტული პარტია, რომელიც არ შედის ჯაჭვიდან
ნაცვლად მხოლოდ ფუნგიბალური ბალანსის.

## RWA ლოთი {#rwa-lot}

ან RWA პარტია შეიცავს:

- `id`: წარმოქმნილი კანონიკური RWA იდენტიფიკატორი, რომელიც ასეთია:
  `<hash>$<domain>`
- `owned_by`: ანგარიში, რომელიც ამჟამად ფლობს ნაკვეთს
- `quantity`: პარტიის მიერ წარმოდგენილი გამოტანილი რაოდენობა
- `spec`: რაოდენობის სპეციფიკაცია, როგორიცაა დეციმალური მასშტაბი
- `primary_reference`: ძირითადი რისიმენტი, სერტიფიკატი, ფაქტურა ან
  რეესტრის მითითება
- `status`: ვაკანსიური ბიზნეს სტატუსის ტექსტი
- `metadata`: კომპაქტური JSON ბიზნეს კონტექსტისა და ინდექსირებისათვის გამოყენებული ველები
- `parents`: წყარო პარტიები გამოიყენება ამ პარტის მოსაპოვებლად
- `controls`: კონტროლის ანგარიშები, კონტროლის როლები და ჩართული კონტროლერი
  ოპერაციები
- `is_frozen` და `held_quantity`: სიცოცხლის ციკლის მდგომარეობა, რომელიც გატარების დროს მოქმედებს

ვ ჲჟრანთ ჟჲბჲჟრთნარა ნაოპაგთლწრა. ვ ვ დჲეთნთრვ ლეგალნთრვ დოკუმენტა,
ანგარიშები და აუდიტის ბუნდები WSV, მერე დაასახელე, URI, SoraFS
გზა, ან ღია რეფერენცია RWA მეტა მონაცემები.

## იდენტიფიკატორები {#identifiers}

`RegisterRwa` არ იღებს გამოირჩეულ დამრეკელს `id`, და ის არ იღებს
დასახელება `owner` საფეხური. ოპერაციული ორგანო ხდება პირველადი `owned_by`
ანგარიში, და runtime წარმოქმნის `RwaId` მიზნის დომენში.

ტექსტური ფორმა RWA ID არის:

```text
<generated-hash>$<domain>
```

მაგალითად:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

აპლიკაციები უნდა ინახონ თავიანთი ბიზნესის იდენტიფიკატორი `primary_reference`
ან `metadata`, შემდეგ აღმოაჩინეთ წარმოქმნილი `RwaId` საგანგებო
`RwaEvent::Created`, `FindRwas`, `/v1/rwas`, ან მკვლევართა მარშრუტის ნაკრები
ტრანზაქციის შემდგომ.

## სიცოცხლის ციკლი {#lifecycle}

საერთო RWA სამუშაო პროცესები მოიცავს:

| ოპერაცია                                  | განხორციელებული ქცევა                                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              | შექმენით გენერირებული...ID ბირჟა დომენში; ტრანზაქციის ორგანო ხდება `owned_by`.                                       |
| `TransferRwa`                              | მთლიანი გადარიცხვა შეიძლება შეიცვალოს `owned_by`; ნაწილობრივი გადაცემა ქმნის წარმოქმნილ ბავშვთა ნაკრებს. |
| `HoldRwa`                                  | სათადარიგო რაოდენობა. საჭიროებს კონფიგურირებულ მმართველს და `hold_enabled`.                                                     |
| `ReleaseRwa`                               | მოითხოვს კონფიგურირებულ კონტროლერს და `hold_enabled`.                                                 |
| `FreezeRwa`                                | ჩვეულებრივი მფლობელის ოპერაციების დაბლოკვა. საჭიროებს კონფიგურირებულ კონტროლერს და `freeze_enabled`.                                    |
| `UnfreezeRwa`                              | ჩვეულებრივი მფლობელის ოპერაციების განახლება. საჭიროებს კონფიგურირებულ კონტროლერს და `freeze_enabled`.                                |
| `RedeemRwa`                                | მოითხოვს მფლობელს ან კონტროლერს და `redeem_enabled`.                                                  |
| `MergeRwas`                                | შეაერთეთ მშობლიური პარტიების რაოდენობა იმავე დომენით და სპეციფიკაციით წარმოქმნილი ბავშვის პარტიაში.                              |
| `ForceTransferRwa`                         | მოითხოვს კონფიგურირებულ კონტროლერს და `force_transfer_enabled`.                    |
| `SetRwaControls`                           | ჟჲბჲპთნარა ჟვ ოპვჟრგჲლწნთკა ჱა მფლობელსა ან ოპვჟრპჲლთ.                                                        |
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` | ბლოკის მეტა მონაცემების განახლება. მოითხოვს მფლობელს ან კონტროლერს; გაყინული ბლოკები საჭიროებს კონტროლს.                                 |

არ არსებობს `UnregisterRwa` ინსტრუქცია მიმდინარე კოდში.
off-chain პარტია `RedeemRwa` წარმოდგენილი რაოდენობის მიწოდებისას,
მოხმარებული, დასახლებული ან სხვანაირად მიმოქცევადან ამოღებული.

## მეტა მონაცემები და კონტროლი {#metadata-and-controls}

გამოიყენეთ მეტა მონაცემები კომპაქტური ფაქტებისათვის, რომლებიც ეხმარება აპლიკაციების იდენტიფიცირებასა და შემოწმებაში
პარტია:

- აქტივების კლასის, ემიტენტის, მფლობელის ან რეესტრის მითითება
- საწყობი, საფარი, ISIN, საფულო ან სერტიფიკატის იდენტიფიკაციები
- შინაარსის ჰეშები ატესტაციებისა და სამართლებრივი დოკუმენტებისთვის
- SoraFS უფრო დიდი მტკიცებულებების ბუნდების მიმართულებით გზები ან გამოთქმული მითითებები
- ვადა, იურისდიქცია ან შესაბამისობის ეტიკეტები, რომლებიც გამოიყენება არამყოფული სერვისების მიერ

განხორციელებული `RwaControlPolicy` აქვს შემდეგი ველები:

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

კონტროლერის ანგარიშები და როლები დასაშვებია მხოლოდ კონტროლერისთვის
ოპერაციები, რომლებიც განახორციელეს შესაბამის ბულური დროშით.
სასარგებლო ტვირთი არ არის ნებადართული სიის გადაცემის პოლიტიკა და არ შეიცავს ჩაფლული
`transfers` წესები.

## კითხვები, მოვლენები და APIs {#queries-events-and-apis}

გამოყენება [`FindRwas`](/ka/reference/queries.md#assets-nfts-and-rwas) ჩამონათვალი
დარეგისტრირებული RWA აპლიკაციები, რომლებსაც საჭიროებენ ცოცხალი განახლებებს, შეუძლიათ გამოიწერონ
[`Rwa` მონაცემთა მოვლენები](/ka/blockchain/filters.md#data-event-filters) შექმნილისთვის,
მფლობელობის შეცვლა, გაყოფა, შერწყმა, გამოსყიდვა, გაყინვა, გაუხინვა, შენახვა, გათავისუფლება,
ძალის გადაცემა, კონტროლის შეცვლა და მეტატალღები.

Torii გამოავლინებს ჯაჭვური სახელმწიფოს მარშრუტებს, როგორიცაა: `/v1/rwas` და `/v1/rwas/query`,
პლუს მკვლევართა მარშრუტები, როგორიცაა `/v1/explorer/rwas` და
`/v1/explorer/rwas/{rwa_id}` როდესაც ამ მარშრუტის ოჯახი ჩართულია.
კლიენტებმა უნდა უპირატესობდნენ პირდაპირი
[`/openapi`](/ka/reference/torii-endpoints.md#common-endpoints) დოკუმენტი
კვანძის მიერ გამოხატული ზუსტი რეაგირების ფორმა

### სცადე. Taira {#try-it-on-taira}

შეამოწმეთ, არის თუ არა საჯარო Taira ამჟამად დარეგისტრირებულია RWA უამრავი:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

ჩამოთვალეთ RWA რეისების მიერ გამოფენილი მარშრუტები Taira OpenAPI დოკუმენტი:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

ცარიელი `items` წარმოების მოსალოდნელია მაშინ, როდესაც საჯარო პარტიები ჯერ არ არის რეგისტრირებული.
რეგისტრაცია, გადაცემა, შენახვა, გაყინვა და გამოსყიდვა არის ხელმოწერილი ოპერაციები.

## სცადე. {#try-it}

ქვემოთ მოცემული მაგალითები იყენებს Python SDK ზედაპირები
[საერთო კონსტრუქცია](/ka/guide/tutorials/python.md#shared-setup). შეცვალეთ
ანგარიში IDs, კერძო გასაღები და წარმოქმნილი პარტია IDs საკუთარი ღირებულებებით
ქსელი ოპერაციის წარდგენის წინ.

### აღმოაჩინეთ RWA API მარშრუტები {#discover-rwa-api-routes}

ეს მხოლოდ წაკითხვის მაგალითი სთხოვს გაშვებას Torii კვანძი, რომელსაც აპლიკაცია მიმართავს RWA
გათვალისწინებულია:

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

თუ სია ცარიელია, კვანძში შეიძლება კვლავ იყოს მხარდაჭერა RWA ინსტრუქციები და
შეკითხვები სხვა საშუალებებით Torii APIs, მაგრამ ის არ გამოყოფს ვარიანტს JSON
რუტის ოჯახი.

### საწყობის ქვითრის რეგისტრაცია {#register-a-warehouse-receipt}

გამოიყენეთ პროექტის გამოყენება, როდესაც ერთი ბიზნეს აქცია უნდა გახდეს ერთი ხელმოწერილი ოპერაცია.
საქმიანი ქვითრის ნომერი შედის `primary_reference`; მთავარ წიგნში ID არის
ტრანზაქციის შემდეგ მიღებული ვალდებულებები.

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

ტრანზაქციის დაკავების შემდეგ, წარმოქმნილი სია RWA IDs. ჯაჭვური სახელმწიფო გზები
გამოავლინოთ კანონიკური IDs; გამოიყენეთ ღონისძიებები ან Explorer დეტალური მარშრუტები, როდესაც თქვენ
უნდა შეესაბამებოდეს ID დაბრუნება `primary_reference` ან მეტა მონაცემები:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

ექსპლორერის საშუალებით ჩართული კვანძები ასევე შეიძლება დააბრუნოს უფრო მდიდარი პროექციები:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### გადაყვანა დროებით შეჩერებით {#transfer-with-a-temporary-hold}

გამოიყენეთ გენერირებული RWA ID ეს მაგალითი ვარაუდობს, რომ
`alice` არის მფლობელი და ასევე კონფიგურირებულია როგორც კონტროლერი
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

გათავისუფლდეს საყრდენი, როდესაც დასრულდება არაბმულიანი პროცესი:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### კონტროლის და აუდიტის მეტა მონაცემების დამატება {#add-controls-and-audit-metadata}

კონტროლი და მეტა მონაცემები ცალკე არიან. გამოიყენეთ კონტროლის პოლიტიკა;
ფაქტების მეტა მონაცემები, რომლებიც განაცხადებში ან აუდიტორებში უნდა იყოს წარმოდგენილი:

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

### გადახდის ან პენსიის რაოდენობა {#redeem-or-retire-quantity}

გადახდის ოდენობა, როდესაც წარმოდგენილი ქსელის გარეთ არსებული აქტივი მიწოდებულია;
მოხმარებული, პენსიაზე გადაყვანილი ან სხვაგვარად მიმოქცევადან ამოღებული.
`redeem_enabled`, და ხელმომწერი უნდა იყოს მფლობელი ან კონტროლერი.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### გაყინვა შესაბამისობის შესწავლის დროს {#freeze-during-compliance-review}

ნაყუმარება ბევრია, როდესაც ოფშ-კეტის განხილვა უნდა შეუშალოს ჩვეულებრივი მფლობელის ოპერაციები.
ხელმომწერი უნდა იყოს კონტროლერი და პარტია უნდა ჰქონდეს `freeze_enabled`.

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

გათავისუფლდით მას შემდეგ, რაც გადამოწმება გაივლის:

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

### საფულტო მოვალეობა {#invoice-receivable}

წარმოაჩინეთ ფაქტი, როგორც RWA საგზური, ფაქტურის ნომრის შენახვა
`primary_reference` რეგისტრაციის შემდეგ, გამოიყენეთ წარმოქმნილი ID
გადარიცხვისა და გამოსასყიდისათვის.

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

როდესაც მოთხოვნა დაფინანსებულია ან გადახდილია, გამოიყენეთ გამომუშავებული ინვოტის პარტია ID:

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

გადასარჩენად წარმოდგენილი თანხა არაფარგლებში ანგარიშგების შემდეგ:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### ნახშირბადის კრედიტების საპენსიო {#carbon-credit-retirement}

გამოიყენეთ გამოსასყიდი, რომ გადაიხადოთ კრედიტები მათი მოთხოვნის შემდეგ. მეტა მონაცემები
მიუთითებს სერტიფიკატზე ან რეესტრის მტკიცებულებაზე:

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

### გაერთიანეთ ორი ლოტი {#merge-two-lots}

გაერთიანება, როდესაც ორი off-chain პოზიციაა კონსოლიდირებული. მშობლები უნდა
იყოს იმავე დომენში და გამოიყენოს იგივე რაოდენობის სპეციფიკა. runtime გენერირებს
ბავშვთა ნაკადი ID.

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

მთლიანად Python ტრანზაქციის მაგალითი, იხილეთ
[რეალურ სამყაროში არსებული აქტივები](/ka/guide/tutorials/python.md#real-world-assets).

## დაკავშირებული დოკუმენტები {#related-docs}

- [აქტივები](/ka/blockchain/assets.md)
- [მეტა მონაცემები](/ka/blockchain/metadata.md)
- [Iroha სპეციალური ინსტრუქციები](/ka/blockchain/instructions.md)
- [კითხვები](/ka/reference/queries.md#assets-nfts-and-rwas)
- [Torii საბოლოო წერტილები](/ka/reference/torii-endpoints.md#app-and-sora-route-families)
