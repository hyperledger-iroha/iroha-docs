---
translation_locale: am
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# በእውነተኛ ዓለም ውስጥ ያሉ ሀብቶች {#real-world-assets}

በእውነተኛ ዓለም ሀብቶች (RWAs) ባለቤትነት ወይም ቁጥጥር በሰንሰለት ላይ የሚከታተሉ ከሰንሰለት ውጭ ያሉ ንብረቶች ሞዴል ። በ Iroha ውስጥ ፣ RWA የተፈጠረ መታወቂያ ፣ የባለቤት መለያ ፣ ብዛት ፣ የንግድ ሜታዳታ ፣ መነሻ እና አማራጭ የሕይወት ዑደት ቁጥሮች ያሉት የተመዘገበ የመቁጠሪያ ክፍል ነው ።

RWAs ከቁጥር ንብረቶች ቀሪዎች ይለያያሉ:

- የቁጥር ሀብት በሂሳብ የተያዘ ተለዋዋጭ ሚዛን ነው
- አንድ NFT ከአንድ ባለቤት ጋር በአንድ ሰንሰለት ላይ ልዩ መዝገብ ነው
- አንድ RWA የንግድ ሜታዳታ, ብዛት, ይዞታዎች, ማቀዝቀዣዎች, የክፍያ ሁኔታ, መነሻ, እና ተቆጣጣሪ ፖሊሲ ሊይዙ የሚችሉ እቃዎች ናቸው.

RWAs ን መጠቀም መቁጠሪያው ከሰንሰለት ውጭ የሆነ የተወሰነ ጭማሪን ብቻ ሳይሆን የሚቀላቀል ሚዛንን ለመወከል ሲያስፈልግ።

## RWA ጭነት {#rwa-lot}

አንድ RWA ጭነት የሚከተሉትን ያካትታል:

- `id`: የተፈጠረው የካኖኒክ RWA መታወቂያ፣ `<hash>$<domain>` ተብሎ ይታያል።
- `owned_by`: በወቅቱ የፓርቲው ባለቤት የሆነው ሂሳብ
- `quantity`: በፓርቲው የተወከለው ያልተቋረጠ ብዛት
- `spec`: የቁጥር ዝርዝር መግለጫ፣ ለምሳሌ አሥርኛ ደረጃ
- `primary_reference`: ከሰንሰለት ውጭ ዋነኛው ደረሰኝ፣ የምስክር ወረቀት፣ የክፍያ ማስረጃ ወይም የመመዝገቢያ ማጣቀሻ
- `status`: አማራጭ የንግድ ሁኔታ ጽሑፍ
- `metadata`: ለንግድ አውድ እና መረጃ ጠቋሚነት ጥቅም ላይ የዋሉ ትናንሽ JSON መስኮች
- `parents`: ይህንን ቡድን ለማምረት ጥቅም ላይ የዋሉ የመነሻ ጭነቶች
- `controls`: ተቆጣጣሪ ሂሳቦች፣ የተቆጣጣሪ ሚናዎች እና የተፈቀዱ የቁጥጥር ሥራዎች
- `is_frozen` እና `held_quantity`: የህይወት ዑደት ሁኔታ በሂደቱ ጊዜ ተፈጻሚነት ያለው

በሰንሰለት ላይ ያለውን ጠቃሚ ጭነት ውስብስብ ያድርጉ። ትላልቅ የሕግ ሰነዶችን ፣ የምርመራ ሪፖርቶችን እና የኦዲት ጥቅሎችን ከ WSV ውጭ ያስቀምጡ ፣ ከዚያ ዲጀስት ፣ URI ፣ SoraFS ዱካ ወይም ግልፅ ማጣቀሻን ወደ RWA ሜታዳታ ውስጥ ያስገቡ ።

## መታወቂያዎች {#identifiers}

`RegisterRwa` ለተጠቃሚው የተመረጠውን `id` አይቀበልም ፣ እና የ `owner` መስክ አይቀበልም። የግብይት ባለሥልጣን የመጀመሪያውን `owned_by` ሂሳብ ይሆናል ፣ እናም የአሂደቱ ጊዜ በዒላማው ጎራ ውስጥ `RwaId` ያመነጫል።

የ RWA ID ጽሑፍ ቅርጽ የሚከተለው ነው-

```text
<generated-hash>$<domain>
```

ለምሳሌ፡-

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

ማመልከቻዎች የንግድ መታወቂያዎቻቸውን በ `primary_reference` ወይም `metadata`, ከዚያም የተፈጠሩትን ያግኙ `RwaId` ከ `RwaEvent::Created`, `FindRwas`, `/v1/rwas`, ወይም የግብይት ግዴታዎች ከተፈጸሙ በኋላ የተቀመጠው የአሰሳ መንገድ።

## የሕይወት ዑደት {#lifecycle}

የተለመዱ RWA የስራ ፍሰቶች የሚከተሉትን ያካትታሉ:

|እንቅስቃሴ |የተተገበረ ባህሪ |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |በአንድ ጎራ ውስጥ የተፈጠረ- ID ጭነት ይፍጠሩ; የግብይት ባለሥልጣን `owned_by` ይሆናል.|
|`TransferRwa` |አንድ ሙሉ ዝውውር `owned_by` ሊለውጥ ይችላል; በከፊል ዝውውር የተፈጠረው የልጆች ጭነት ይፈጥራል. |
|`HoldRwa` |የመጠባበቂያ መጠን: የተዋቀረ መቆጣጠሪያ እና `hold_enabled` ያስፈልጋል.|
|`ReleaseRwa` |የተያዘውን መጠን ማስወገድ። የተዋቀረ መቆጣጠሪያ እና `hold_enabled` ይጠይቃል። |
|`FreezeRwa` |መደበኛ ባለቤት ስራዎችን ያግድ. የተዋቀረ መቆጣጠሪያ እና `freeze_enabled` ይጠይቃል. |
|`UnfreezeRwa` |መደበኛ ባለቤት ተግባራትን እንደገና ማግበር። የተዋቀረ መቆጣጠሪያ እና `freeze_enabled` ይጠይቃል ። |
|`RedeemRwa` |የኪራይ ሰብሳቢውን ወይም ተቆጣጣሪን እና `redeem_enabled` ይጠይቃል.|
|`MergeRwas` |ተመሳሳይ ጎራ ያላቸው የወላጅ እቃዎች እና ስፔክቶችን በአንድ የተፈጠረ የልጆች እቃ ውስጥ ያዋህዱ ።|
|`ForceTransferRwa` |መጠን በመቆጣጠሪያ ፍሰት በኩል ይንቀሳቀሱ. የተዋቀረ መቆጣጠሪያ እና `force_transfer_enabled` ይጠይቃል. |
|`SetRwaControls` |የፓርት ቁጥጥር ፖሊሲውን ይተካል። ባለቤት ወይም ተቆጣጣሪን ይጠይቃል ።|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |የፓርት ሜታዳታ ማዘመን። ባለቤት ወይም ተቆጣጣሪ ይጠይቃል፤ የተጋለጡ ፓርኮች ተቆጣጣሪ ያስፈልጋቸዋል። |

አሁን ባለው ኮድ ውስጥ `UnregisterRwa` መመሪያ የለም ። የተገለጸው ብዛት ሲሰጥ ፣ ሲበላው ፣ ሲያስተካክል ወይም በሌላ መንገድ ከሽያጭ ሲወገድ ከሰንሰለት ውጭ ያለውን ጭነት በ `RedeemRwa` ያስወግዱ ።

## ሜታዳታ እና ቁጥጥር {#metadata-and-controls}

አፕሊኬሽኖችን ለመለየት እና ምርመራ ለማድረግ የሚረዱ ትናንሽ እውነታዎችን ለማግኘት ሜታዳታ ይጠቀሙ:

- የአክሲዮን መደብ፣ ኤሚቲዩት፣ የዋስትና ባለቤት ወይም የምዝገባ ማጣቀሻ
- መጋዘን ፣ ዋልድ ፣ ISIN ፣ የክፍያ ወይም የምስክር ወረቀት መታወቂያዎች
- የይገባኛል ጥያቄዎችና የሕግ ሰነዶች ይዘት ሃሽ
- SoraFS ትላልቅ የምስክር ወረቀቶች መንገድ ወይም ግልፅ ማጣቀሻዎች
- ከሰንሰለት ውጭ ባሉ አገልግሎቶች ጥቅም ላይ የሚውሉት የእድሜ ገደብ፣ የሕግ ባለሥልጣን ወይም የመጣጣም መለያዎች

የተተገበረው `RwaControlPolicy` የሚከተሉትን መስኮች ይ containsል-

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

የተቆጣጣሪ መለያዎች እና ሚናዎች የሚመለከታቸው የቦሊያን ባንዲራ ያስችላቸውን የተቆጣጣሪ ተግባራት ብቻ እንዲፈጽሙ ይፈቀድላቸዋል. የአሁኑ የቁጥጥር ጭነት የመፍቀድ ዝርዝር ማስተላለፊያ ፖሊሲ አይደለም እንዲሁም የተሰቀሉ `transfers` ደንቦችን አይይዝም።

## ጥያቄዎች, ክስተቶች እና APIs {#queries-events-and-apis}

አጠቃቀም [`FindRwas`](/am/reference/queries.md#assets-nfts-and-rwas) ተመዝግቧል RWA የቀጥታ ዝማኔዎች የሚያስፈልጋቸው መተግበሪያዎች [`Rwa` የመረጃ ክስተቶች](/am/blockchain/filters.md#data-event-filters) የተፈጠሩ፣ ባለቤትነት የተለወጡ፣ የተከፋፈሉ፣ የተዋሃዱ፣ የተመለሱ፣ የቀዘቀዙ፣ ያልተቀዘቀዙ ፣ የተያዙ፣ የተለቀቁ፣ በኃይል የተላለፉ፣ ቁጥጥር የተለወጠባቸው፤ እና ሜታዳታ ክስተቶች.

Torii እንደ `/v1/rwas` እና `/v1/rwas/query` ያሉ ሰንሰለት-የመንግስት መንገዶችን እንዲሁም እንደ `/v1/explorer/rwas` እና `/v1/explorer/rwas/{rwa_id}` ያሉ የአሰሳ መንገዶችን ያጋልጣል ፣ ይህ የመንገድ ቤተሰብ ሲፈታ ። የተፈጠሩ ደንበኞች በአንድ ኖድ ከተጋለጠው ትክክለኛ የምላሽ ቅርፅ ይልቅ የቀጥታውን [`/openapi`](/am/reference/torii-endpoints.md#common-endpoints) ሰነድ ይመርጣሉ።

### Taira ላይ ይሞክሩት {#try-it-on-taira}

የህዝብ Taira በአሁኑ ጊዜ RWA ዕቃዎችን መመዝገብ አለመሆኑን ያረጋግጡ:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

በቀጥታ Taira OpenAPI ሰነድ የተጋለጡትን የ RWA መስመሮች ይዘርዝሩ:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

ክፍት `items` ውፅዓት የሚጠበቀው ገና ምንም የህዝብ ዕቃዎች ካልተመዘገቡ ነው ። ምዝገባ ፣ ዝውውር ፣ ማቆየት ፣ ማቀዝቀዣ እና መመለስ የተፈረሙ ግብይቶች ናቸው።

## ሞክር {#try-it}

ከዚህ በታች የቀረቡት ምሳሌዎች ከ Python SDK ገጽታዎች ይጠቀማሉ [የተጋራ ማዋቀር](/am/guide/tutorials/python.md#shared-setup). ሂሳቡን IDs ፣ የግል ቁልፎችን እና የተፈጠረውን ጭነት IDs ግብይት ከማቅረብዎ በፊት ከእራስዎ አውታረመረብ ጋር በመተካት።

### RWA API መንገዶችን ያግኙ {#discover-rwa-api-routes}

ይህ የንባብ-ብቻ ምሳሌ የሚሰራውን Torii አንቀሳቃሽ ይጠይቃል የትኞቹ መተግበሪያ-ተኮር RWA መስመሮች እንደተፈቀደላቸው:

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

ዝርዝሩ ባዶ ከሆነ ኖዱ አሁንም በሌሎች Torii APIs በኩል የ RWA መመሪያዎችን እና መጠይቆችን ሊደግፍ ይችላል ፣ ግን አማራጭ የሆነውን JSON የመንገድ ቤተሰብ አያጋልጥም።

### የመጋዘን ደረሰኝ መመዝገብ {#register-a-warehouse-receipt}

አንድ የንግድ ድርጊት አንድ የተፈረመ ግብይት መሆን አለበት ጊዜ ረቂቅ ይጠቀሙ. የንግድ ደረሰኝ ቁጥር ውስጥ ይሄዳል `primary_reference`; መለያ ID ግብይቱ ተሳትፎ በኋላ ይፈጠራል.

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

ግብይቱ ከተቀበለ በኋላ ዝርዝር ይፈጠራል RWA IDs ሰንሰለት-የግዛት መስመሮች ቀኖናዊውን IDs ያጋልጣሉ; አንድን ID ወደ `primary_reference` ወይም ሜታዳታ መልሰው ማዛመድ በሚፈልጉበት ጊዜ ክስተቶችን ወይም አሰሳ ዝርዝሮችን ይጠቀሙ:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

የአስፕሎረር-የተፈቀደላቸው አንጓዎች የበለጠ ሀብታም ትንበያዎችን ሊመልሱ ይችላሉ:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### ጊዜያዊ አቋራጭነት {#transfer-with-a-temporary-hold}

የተፈጠረውን ይጠቀሙ RWA ID ይህ ምሳሌ `alice` ባለቤት ነው እንዲሁም እንደ ተቆጣጣሪ ሆኖ የተዋቀረ ነው `hold_enabled`.

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

ከሰንሰለት ውጭ ሂደቱ ሲጠናቀቅ መያዣውን ይለቁ:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### የቁጥጥር እና የኦዲት ሜታዳታ ይጨምሩ {#add-controls-and-audit-metadata}

መቆጣጠሪያዎች እና ሜታዳታ የተለዩ ናቸው. ለተቆጣጣሪ ፖሊሲዎች መቆጣጠሪያዎችን ይጠቀሙ, እና አፕሊኬሽኖች ወይም ኦዲተሮች ለማሳየት የሚያስፈልጋቸውን እውነታዎች ለሜታዳታ:

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

### የክፍያ ወይም የጡረታ መጠን {#redeem-or-retire-quantity}

የተወከለው ከሰንሰለት ውጭ ያለው ንብረት ሲሰጥ ፣ ሲበጅ ፣ ሲተረጎም ወይም በሌላ መንገድ ከዝውውር ሲወገድ የመክፈያ መጠን ። የፓርት `redeem_enabled` መሆን አለበት ፣ እና ፊርማው ባለቤት ወይም ተቆጣጣሪ መሆን አለበት።

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### ማክበር በሚያረጋግጥበት ጊዜ መቋረጥ {#freeze-during-compliance-review}

ከሰንሰለት ውጭ ግምገማ መደበኛ የባለቤትነት ሥራዎችን ማገድ በሚያስፈልገው ጊዜ ብዙ መቁረጥ። ፊርማው ተቆጣጣሪ መሆን አለበት እና የጅምላው `freeze_enabled` መሆን አለበት።

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

ግምገማው ሲያልፍ ያስወግዱት:

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

የክፍያውን ቁጥር በ `primary_reference` እና ሜታዳታ በማከማቸት አንድን ደረሰኝ እንደ RWA ጭነት ይወክሉ። ከተመዘገቡ በኋላ ለማስተላለፍና ለመመለስ የተፈጠረውን ID ይጠቀሙ።

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

ተቀባይነት ያለው ገንዘብ ሲከፈል ወይም ሲከፈል የተፈጠረውን የክፍያ ክፍል ID ይጠቀሙ:

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

ከሰንሰለት ውጭ ክፍያ በኋላ የተገለጸውን መጠን መልሶ ማግኘት:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### የካርቦን ብድር ጡረታ {#carbon-credit-retirement}

ከተጠየቁ በኋላ ክሬዲት ለመውጣት የክፍያ ክፍያ ይጠቀሙ። ሜታዳታዎቹ ወደ ውጭ ሰንሰለት የምስክር ወረቀት ወይም የምዝገባ ማስረጃ የሚያመለክቱ ናቸው

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

### ሁለት እቃዎች ይዋሃዱ {#merge-two-lots}

ሁለት ከሰንሰለት ውጭ ያሉ አከባቢዎች ሲቀላቀሉ ሎቶች ይቀላቀሉ። ወላጆች በተመሳሳይ ጎራ ውስጥ መሆን አለባቸው እና ተመሳሳይ መጠን መጠንን ይጠቀማሉ ። የሩጫ ጊዜ የልጅ ሎቱን ID ያመነጫል ።

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

የ Python ግብይት ሙሉ ምሳሌ ለማግኘት [Real-World Assets](/am/guide/tutorials/python.md#real-world-assets) የሚለውን ተመልከት።

## ተዛማጅ ሰነዶች {#related-docs}

- [ንብረቶች](/am/blockchain/assets.md)
- [ሜታ መረጃዎች](/am/blockchain/metadata.md)
- [Iroha ልዩ መመሪያዎች](/am/blockchain/instructions.md)
- [ጥያቄዎች](/am/reference/queries.md#assets-nfts-and-rwas)
- [Torii መጨረሻ ነጥቦች](/am/reference/torii-endpoints.md#app-and-sora-route-families)
