---
translation_locale: am
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# በእውነተኛ ዓለም ውስጥ ያሉ ንብረቶች {#real-world-assets}

በእውነተኛ ዓለም ውስጥ ያሉ ንብረቶች (RWAs) ባለቤትነት ወይም ቁጥጥር ያላቸው ከሰንሰለት ውጭ ያሉ ንብረቶች ሞዴል
በሰንሰለት ላይ ተከትሏል. Iroha, አንድ RWA የተመዘገበ መቁጠሪያ ሎት ነው
የተፈጠረ መታወቂያ፣ የባለቤትነት ሂሳብ፣ ብዛት፣ የንግድ ሥራ ሜታዳታ፣
የመነሻ እና አማራጭ የሕይወት ዑደት ቁጥጥር።

RWAs ከቁጥር የንብረቶች ቀረፃዎች ይለያያሉ

- የቁጥር ሀብት በሂሳብ የተያዘ ቀሪ ሚዛን ነው
- አንድ NFT አንድ ባለቤት ጋር ልዩ ሰንሰለት ላይ መዝገብ ነው
- አንድ RWA የንግድ ሜታዳታ, ብዛት, ይይዛል የሚችል ብዙ ነው,
  ማቀዝቀዣዎች ፣ የመልሶ ማግኛ ሁኔታ ፣ መነሻ እና የተቆጣጣሪ ፖሊሲ

አጠቃቀም RWAs መቁጠሪያው የተወሰነ ከሰንሰለት ውጭ ያለውን ክፍል የሚወክል ከሆነ
በምትኩ በቀላሉ ሊበሰብስ የሚችል ሚዛን ነው።

## RWA ሎጥ {#rwa-lot}

አንድ RWA ጭምር የሚከተሉትን ያካትታል

- `id`: የተፈጠረው ካኖኒካል RWA መታወቂያ እንደ
  `<hash>$<domain>`
- `owned_by`: በአሁኑ ጊዜ የፓርቱን ባለቤት የሆነው አካውንት
- `quantity`: በፓርቱ የተወከለው ያልተቋረጠ ብዛት
- `spec`: የቁጥር ዝርዝር መግለጫ፣ ለምሳሌ አሥርኛ ደረጃ
- `primary_reference`: ከሰንሰለት ውጭ ያለው ዋና ደረሰኝ ፣ የምስክር ወረቀት ፣ የክፍያ ማስረጃ ወይም
  የምዝገባ ማጣቀሻ
- `status`: አማራጭ የንግድ ሁኔታ ጽሑፍ
- `metadata`: የታመቀ JSON ለንግድ አውድ እና ለኢንዴክስ የሚጠቀሙባቸው መስኮች
- `parents`: ይህንን ጭነት ለማምጣት ጥቅም ላይ የዋሉ ምንጭ ሎቶች
- `controls`: የተቆጣጣሪ ሂሳቦች፣ የተቆጣጣሪ ሚናዎች እና የተፈቀደለት ተቆጣጣሪ
  ሥራዎች
- `is_frozen` እና `held_quantity`: በስራ ሰዓት የተተገበረ የህይወት ዑደት ሁኔታ

በሰንሰለት ላይ ያለውን የጉልበት ጭነት ውስብስብ ያድርጉት ትልቅ የህግ ሰነዶችን ያስቀምጡ፣ ምርመራ
ሪፖርቶች እና ከኦዲት ውጭ ያሉ የኦዲት ጥቅሎች WSV, ከዚያም (በመጽሐፉ ላይ) አስቀምጥ። URI, SoraFS
መንገድ ወይም ግልጽ ማጣቀሻ RWA ሜታዳታ።

## የመለየት ማስረጃዎች {#identifiers}

`RegisterRwa` የተመረጠውን ደራሲ አይቀበልም `id`, እና አይቀበለውም
አንድ `owner` የግብይት ባለሥልጣን የመጀመሪያ `owned_by`
ሂሳብ, እና ሩጫ ጊዜ `RwaId` በዒላማው ጎራ ውስጥ።

የጽሑፍ ቅርፅ RWA ID ነው:

```text
<generated-hash>$<domain>
```

ለምሳሌ፡

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

ማመልከቻዎች የንግድ መታወቂያቸውን በ `primary_reference`
ወይም `metadata`, ከዚያም የተፈጠረውን ይፈልጉ `RwaId` ከ
`RwaEvent::Created`, `FindRwas`, `/v1/rwas`, ወይም የአሰሳ መንገዱ ስብስብ
ግብይቱ ከተቀበለ በኋላ።

## የሕይወት ዑደት {#lifecycle}

የተለመደ RWA የስራ ፍሰቶች የሚከተሉትን ያካትታሉ:

| አሠራር                                  | የተተገበረ ባህሪ                                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              | የተፈጠረ-ID በአንድ ጎራ ውስጥ ያለው ጭነት; የግብይት ባለሥልጣን ይሆናል `owned_by`.                                       |
| `TransferRwa`                              | መጠን ወደ ሌላ መለያ ይዛወሩ. ሙሉ ዝውውር ሊለወጥ ይችላል `owned_by`; በከፊል ማስተላለፍ የተፈጠረ የልጆች ቡድን ይፈጥራል። |
| `HoldRwa`                                  | የመጠባበቂያ መጠን: የተዋቀረ መቆጣጠሪያ እና `hold_enabled`.                                                     |
| `ReleaseRwa`                               | የተያዘውን መጠን ማስወገድ። `hold_enabled`.                                                 |
| `FreezeRwa`                                | የተለመደ ባለቤት ስራዎችን ያግድ. `freeze_enabled`.                                    |
| `UnfreezeRwa`                              | መደበኛ ባለቤት ተግባራት ዳግም ማስቻል. `freeze_enabled`.                                |
| `RedeemRwa`                                | የኪራይ ሰብሳቢ ወይም ተቆጣጣሪ እና `redeem_enabled`.                                                  |
| `MergeRwas`                                | ተመሳሳይ ጎራ እና ስፔክ ካላቸው የወላጅ እቃዎች የተገኙትን ብዛቶች በማጣመር ወደተፈጠረ የልጆች እቃ ያድርጉ።                              |
| `ForceTransferRwa`                         | አንድ ተቆጣጣሪ ፍሰት በኩል መጠን ለማንቀሳቀስ. `force_transfer_enabled`.                    |
| `SetRwaControls`                           | የፓርት ቁጥጥር ፖሊሲን ይተካል። ባለቤት ወይም ተቆጣጣሪ ይጠይቃል.                                                        |
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` | የፓርት ሜታዳታ ማዘመን። ባለቤት ወይም ተቆጣጣሪ ይጠይቃል፤ የተቀዘቀዙ ፓርቶች ተቆጣጣሪ ያስፈልጋሉ።                                 |

የለም `UnregisterRwa` የአሁኑ ኮድ ውስጥ መመሪያ.
ከሰንሰለት ውጪ የሚገኝ ሎተሪ `RedeemRwa` የተገለጸው ብዛት ሲደርስ፣
የተበላሸ፣ የተቀመጠ ወይም በሌላ መንገድ ከሽያጭ የተወገደ።

## ሜታዳታ እና መቆጣጠሪያዎች {#metadata-and-controls}

አፕሊኬሽኖችን ለመለየት እና ለማረጋገጥ የሚረዱ ትናንሽ እውነታዎችን ለማግኘት ሜታዳታ ይጠቀሙ
የፓርቲው:

- የአክሲዮን መደብ፣ ኤሚቲዩተር፣ የዋስትና ባለቤት ወይም የምዝገባ ማጣቀሻ
- መጋዘን፣ ዋልት፣ ISIN, የክፍያ ወይም የምስክር ወረቀት መታወቂያዎች
- የይገባኛል ጥያቄዎችና የሕግ ሰነዶች ይዘት
- SoraFS ለትላልቅ የምስክር ወረቀቶች መንገዶች ወይም ግልፅ ማጣቀሻዎች
- ከሰንሰለት ውጭ ባሉ አገልግሎቶች ጥቅም ላይ የሚውሉት የማረፊያ ጊዜ፣ የሥልጣን ባለስልጣን ወይም የመጣጣም መለያዎች

የተተገበረው `RwaControlPolicy` የሚከተሉትን መስኮች ይዟል

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

የተቆጣጣሪው ሂሳቦች እና ሚናዎች የሚከናወኑት በተቆጣጣሪው ብቻ ነው
የሚመለከታቸው የቦሊያን ባንዲራዎች የተገበሩ ተግባራት
ጠቃሚ ጭነት የተፈቀደ ዝርዝር ማስተላለፍ ፖሊሲ አይደለም እና ተጣብቆ አይይዝም
`transfers` ደንቦች.

## ጥያቄዎች፣ ክስተቶች እና APIs {#queries-events-and-apis}

አጠቃቀም [`FindRwas`](/am/reference/queries.md#assets-nfts-and-rwas) ለመዘርዘር
የተመዘገቡት RWA በቀጥታ ዝማኔዎች የሚያስፈልጋቸው መተግበሪያዎች
[`Rwa` የመረጃ ክስተቶች](/am/blockchain/filters.md#data-event-filters) ለተፈጠሩት፣
ባለቤትነት የተለወጠ፣ ተከፋፈለ፣ ተዋህዶ፣ ተመላሽ፣ የቀዘቀዘ፣ ያልተቀዘቀዘ, የተያዘ፣ የተለቀቀ፣
የኃይል ማስተላለፍ፣ የመቆጣጠሪያ ለውጥ እና ሜታዳታ ክስተቶች።

Torii እንደ ሰንሰለት-የክልል መንገዶችን ያጋልጣል `/v1/rwas` እና `/v1/rwas/query`,
በተጨማሪም እንደ `/v1/explorer/rwas` እና
`/v1/explorer/rwas/{rwa_id}` ይህ የመንገድ ቤተሰብ ሲነቃ.
ደንበኞች የቀጥታ
[`/openapi`](/am/reference/torii-endpoints.md#common-endpoints) ሰነድ
አንድ ዕንቁ የተጋለጠውን ትክክለኛ ምላሽ ቅርፅ።

### ሞክር Taira {#try-it-on-taira}

ይፋዊ መሆን አለመሆኑን ያረጋግጡ Taira በአሁኑ ጊዜ ተመዝግቧል RWA ብዙ:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

ዝርዝር RWA በቀጥታ ስርጭት የተጋለጡ መንገዶች Taira OpenAPI ሰነድ:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

ባዶ `items` የሕዝብ ዕቃዎች ገና ያልተመዘገቡበት ጊዜ ምርቱ የሚጠበቅ ነው።
ምዝገባ፣ ማስተላለፍ፣ ማቆየት፣ ማቀዝቀዣ እና ማስመለስ የተፈረሙ ግብይቶች ናቸው።

## ሞክር {#try-it}

የሚከተሉት ምሳሌዎች Python SDK ከ
[የተጋራ ማዋቀር](/am/guide/tutorials/python.md#shared-setup). የመተካት
ሂሳብ IDs, የግል ቁልፎች እና የተፈጠረው ጭነት IDs ከራስህ እሴቶች
ግብይት ከማቅረብዎ በፊት አውታረ መረብ።

### ይፋ አድርግ RWA API መንገዶች {#discover-rwa-api-routes}

ይህ ንባብ ብቻ ምሳሌ አንድ ሩጫ ይጠይቃል Torii የትኛው አፕሊኬሽን አቅጣጫ RWA
የሚከተሉትን መስመሮች ማስኬድ ይቻላል።

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

ዝርዝሩ ባዶ ከሆነ አገናኙ አሁንም ሊደግፍ ይችላል RWA መመሪያ እና
በሌሎች በኩል ጥያቄዎች Torii APIs, ነገር ግን አማራጭን እያጋለጠ አይደለም JSON
የመንገድ ቤተሰብ።

### የመጋዘን ደረሰኝ መመዝገብ {#register-a-warehouse-receipt}

አንድ የንግድ ድርጊት አንድ የተፈረመ ግብይት መሆን ሲገባ ረቂቅ ይጠቀሙ።
የቢዝነስ ደረሰኝ ቁጥር ገብቷል `primary_reference`; መለያ ID ነው
ከግብይት ግዴታዎች በኋላ የተፈጠሩ ።

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

ከግብይት ግዴታዎች በኋላ የተፈጠረው ዝርዝር RWA IDs. ሰንሰለት-መንግሥት መንገዶች
የካኖኒካዊ IDs; ክስተቶችን ወይም አሰሳ ዝርዝር መስመሮችን ይጠቀሙ
አንድ ጋር ማዛመድ ያስፈልጋል ID ወደ `primary_reference` ወይም ሜታዳታ:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

የአስፕሎረር-ነቁ ኖዶችም የበለጠ ሀብታም ትንበያዎችን ሊመልሱ ይችላሉ:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### ጊዜያዊ ማቆሚያ ያለው ማስተላለፍ {#transfer-with-a-temporary-hold}

የተፈጠረውን ይጠቀሙ RWA ID ይህ ምሳሌ
`alice` ባለቤት ነው እንዲሁም እንደ ተቆጣጣሪ ሆኖ የተዋቀረ ነው
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

ከሰንሰለት ውጭ ያለው ሂደት ሲጠናቀቅ መያዣውን ይለቅሱ

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### የቁጥጥር እና የኦዲት ሜታዳታ ማከል {#add-controls-and-audit-metadata}

መቆጣጠሪያዎች እና ሜታዳታ የተለዩ ናቸው.
ማመልከቻዎች ወይም ኦዲተሮች ማሳየት ያለባቸው መረጃዎችን የሚመለከቱ ሜታዳታ:

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

### የመክፈያ ወይም የጡረታ መጠን {#redeem-or-retire-quantity}

የተወከለው ከሰንሰለት ውጭ ያለው ንብረት ሲሰጥ የመክፈያ መጠን፣
የተበላሸ፣ በጡረታ የተወሰደ ወይም በሌላ መንገድ ከሽያጭ የተወገደ።
`redeem_enabled`, ፊርማው ባለቤት ወይም ተቆጣጣሪ መሆን አለበት።

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### ማሟያ በሚደረግበት ጊዜ መቋረጥ {#freeze-during-compliance-review}

ከሰንሰለት ውጭ የሚደረግ ግምገማ መደበኛ ባለቤቶችን ሥራዎች መከልከል ሲያስፈልገው ብዙ ጊዜ ይቀዘቅዛል።
ፊርማው መቆጣጠሪያ መሆን አለበት እና የዕጣው `freeze_enabled`.

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

ግምገማው ሲያልፍ አስወግደው:

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

### ደረሰኝ ደረሰኝ {#invoice-receivable}

አንድን ደረሰኝ እንደ RWA የክፍያውን ቁጥር በማስቀመጥ
`primary_reference` ከተመዘገቡ በኋላ የተፈጠረውን ID
ለሽያጭ እና ለመልቀቅ።

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

የሚቀበለው ገንዘብ ሲገዙ ወይም ሲከፈሉ የተፈጠረውን የክፍያ ክፍል ይጠቀሙ ID:

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

ከሰንሰለት ውጪ ከተፈፀመ በኋላ የተገለጸውን መጠን መልሶ ማግኘት:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### የካርቦን ብድር ጡረታ {#carbon-credit-retirement}

ካስፈለገ በኋላ የክፍያ ክፍያዎችን ለማውጣት የመልቀቂያ ገንዘብን ይጠቀሙ
ከሰንሰለት ውጭ ባለው የምስክር ወረቀት ወይም በመመዝገቢያ ማስረጃ ላይ ያመለክታል-

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

### ሁለት እቃዎች ይጣመራሉ {#merge-two-lots}

ከሰንሰለት ውጭ ያሉ ሁለት አቋም ሲቀናጁ ሎተሪዎችን ይቀላቀሉ ።
በተመሳሳይ ጎራ ውስጥ መሆን እና ተመሳሳይ መጠን ዝርዝር ይጠቀሙ.
የልጆች መለያ ID.

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

ለሙሉ Python የግብይት ምሳሌ፣ ተመልከት
[በእውነተኛ ዓለም ውስጥ ያሉ ንብረቶች](/am/guide/tutorials/python.md#real-world-assets).

## ተዛማጅ ሰነዶች {#related-docs}

- [ንብረቶች](/am/blockchain/assets.md)
- [ሜታዳታ](/am/blockchain/metadata.md)
- [Iroha ልዩ መመሪያዎች](/am/blockchain/instructions.md)
- [ጥያቄዎች](/am/reference/queries.md#assets-nfts-and-rwas)
- [Torii የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md#app-and-sora-route-families)
