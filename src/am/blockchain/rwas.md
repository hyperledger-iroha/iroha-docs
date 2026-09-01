---
translation_locale: am
translation_source: /blockchain/rwas.md
translation_source_hash: 8d64a9a17c93f60306c279e8656e6edde8ce5dd024e742218bfb9572b7438bb0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# የገሃዱ ዓለም ንብረቶች {#real-world-assets}

የገሃዱ ዓለም ንብረቶች (RWAs) ባለቤትነታቸው ወይም ቁጥጥራቸው በሰንሰለት ላይ ክትትል የሚደረግባቸው ከሰንሰለት ውጪ ያሉ ንብረቶችን ሞዴል። በ Iroha፣ RWA የተፈጠረ መለያ፣ የባለቤት መለያ፣ ብዛት፣ የንግድ ሜታዳታ፣ አመጣጥ እና አማራጭ የህይወት ዑደት መቆጣጠሪያዎች ያለው የተመዘገበ የብሎክቼይን መዝገብ ዕጣ ነው።

RWAs ከቁጥር የንብረት ቀሪ ሒሳቦች የተለዩ ናቸው -

- የቁጥር ንብረት በሂሳብ የተያዘ የፈንገስ ቀሪ ሂሳብ ነው
- NFT አንድ ባለቤት ያለው ልዩ በሰንሰለት ላይ ያለ መዝገብ ነው
- አንድ RWA የንግድ ሜታዳታ፣ ብዛት፣ መያዣ፣ በረዶ፣ የመቤዠት ሁኔታ፣ አመጣጥ እና የመቆጣጠሪያ ፖሊሲን ሊሸከም የሚችል ብዙ ነው።

የብሎክቼይን መዝገብ ከፈንገስ ቀሪ ሒሳብ ብቻ ይልቅ የተወሰነ ከሰንሰለት ውጪ ያለውን ዕጣ መወከል ሲፈልግ RWAs ይጠቀሙ።

## RWA ሎጥ {#rwa-lot}

አንድ RWA ዕጣ የሚከተሉትን ያጠቃልላል

- `id` የመነጨው ነጠላ ፕሮቶኮል-መደበኛ RWA መለያ፣ እንደ `<hash>$<domain>` ይታያል።
- `owned_by` በአሁኑ ጊዜ የዕጣው ባለቤት የሆነው መለያ
- `quantity` በዕጣ የተወከለው እጅግ በጣም ጥሩ መጠን
- `spec` እንደ አስርዮሽ መለኪያ ያሉ የብዛታ ዝርዝር
- `primary_reference` ዋናው ከሰንሰለት ውጪ ፕሮቶኮል የውጤት መዝገብ፣ የምስክር ወረቀት፣ ደረሰኝ ወይም የመመዝገቢያ ማጣቀሻ
- `status` አማራጭ የንግድ ሁኔታ ጽሑፍ
- `metadata` የታመቀ JSON ሜዳዎች ለንግድ አውድ እና መረጃ ጠቋሚ ጥቅም ላይ ይውላሉ
- `parents` ይህንን ዕጣ ለማግኘት ጥቅም ላይ የዋሉ ምንጭ ዕጣዎች
- `controls` የመቆጣጠሪያ መለያዎች፣ የመቆጣጠሪያ ሚናዎች እና የነቁ የመቆጣጠሪያ ስራዎች
- `is_frozen` እና `held_quantity` በሶፍትዌር ማስፈጸሚያ አካባቢ የሚተገበር የህይወት ዑደት ሁኔታ

በሰንሰለት ላይ ያለውን ጭነት የታመቀ ያድርጉት። ትላልቅ ህጋዊ ሰነዶችን፣ የፍተሻ ሪፖርቶችን እና የኦዲት ቅርቅቦችን ከ WSV ውጭ ያከማቹ፣ ከዚያ የምስጠራ ዳይጀስት እሴት፣ URI፣ SoraFS መንገድ ወይም ቴክኒካል አንጸባራቂ ማጣቀሻ በ RWA ሜታዳታ ውስጥ ያስቀምጡ።

## መለያዎች {#identifiers}

`RegisterRwa` በደንበኛ የተመረጠውን `id` አይቀበልም እና `owner` መስክን አይቀበልም።. የግብይት ፈቃድ ርእሰ መምህሩ የመጀመሪያ `owned_by` መለያ ይሆናል፣ እና የሶፍትዌር ማስፈጸሚያ አካባቢ በዒላማው ጎራ ውስጥ `RwaId` ያመነጫል።.

የ RWA መታወቂያ ጽሑፋዊ ቅጽ -

```text
<generated-hash>$<domain>
```

ለምሳሌ:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

አፕሊኬሽኖች የንግድ መለያቸውን በ`primary_reference` ወይም `metadata` ውስጥ ማከማቸት አለባቸው፣ ከዚያም የተፈጠረውን `RwaId` ከ`RwaEvent::Created`፣ `FindRwas`፣ `/v1/rwas` ወይም ግብይቱ ከተጠናቀቀ በኋላ የተቀመጠውን የአሳሽ መንገድ ያግኙ።

## የሕይወት ዑደት {#lifecycle}

የተለመዱ RWA የስራ ፍሰቶች የሚከተሉትን ያካትታሉ

|ቀዶ ጥገና|የተተገበረ ባህሪ|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa`|በጎራ ውስጥ የመነጨ መታወቂያ ዕጣ ይፍጠሩ; የግብይት ፈቃድ ርእሰ መምህሩ `owned_by` ይሆናል።|
|`TransferRwa`|ብዛቱን ወደ ሌላ መለያ ያንቀሳቅሱት። ሙሉ ዝውውር ሊለወጥ ይችላል `owned_by`። ከፊል ዝውውር የተፈጠረ መታወቂያ ያለው የተለየ የልጅ ዕጣ ይፈጥራል።|
|`HoldRwa`|የመጠባበቂያ ብዛት። የተዋቀረ መቆጣጠሪያ እና `hold_enabled` ያስፈልገዋል።|
|`ReleaseRwa`|የተያዘውን መጠን ያስወግዱ። የተዋቀረ መቆጣጠሪያ ያስፈልገዋል እና `hold_enabled`።|
|`FreezeRwa`|ተራ የባለቤት ስራዎችን አግድ። የተዋቀረ መቆጣጠሪያ እና `freeze_enabled` ያስፈልገዋል።|
|`UnfreezeRwa`|ተራ የባለቤት ስራዎችን እንደገና አንቃ። የተዋቀረ መቆጣጠሪያ እና `freeze_enabled` ያስፈልገዋል።|
|`RedeemRwa`|መጠኑን ከስርጭት በቋሚነት ይቀንሱ። `redeem_enabled` እውነት በሚሆንበት ጊዜ ባለቤቱ ወይም ተቆጣጣሪው ሊያቀርቡት ይችላሉ።|
|`MergeRwas`|ከወላጅ ዕጣዎች የሚመጡ መጠኖችን ከተመሳሳይ ጎራ እና ዝርዝር መግለጫ ጋር ወደ የመነጨ የልጅ ዕጣ ያዋህዱ።|
|`ForceTransferRwa`|በመቆጣጠሪያ ፍሰት ውስጥ መጠኑን ያንቀሳቅሱ። የተዋቀረ መቆጣጠሪያ ያስፈልገዋል እና `force_transfer_enabled`።|
|`SetRwaControls`|የሎጥ መቆጣጠሪያ ፖሊሲን ይተኩ። ባለቤቱን ወይም ተቆጣጣሪውን ይጠይቃል።|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>`|የሎጥ ሜታዳታን ያዘምኑ። ባለቤቱን ወይም ተቆጣጣሪውን ይፈልጋል; የቀዘቀዙ ዕጣዎች መቆጣጠሪያ ያስፈልጋቸዋል።|

በአሁኑ ኮድ ውስጥ የ `UnregisterRwa` መመሪያ የለም። የተወከለው መጠን ሲደርስ፣ ጥቅም ላይ ሲውል፣ ሲጠናቀቅ ወይም በሌላ መንገድ ከዝውውር ሲወጣ፣ ከሰንሰለት ውጭ ያለውን ሎት በ `RedeemRwa` ከዝውውር ያስወግዱ።

## ሜታዳታ እና መቆጣጠሪያዎች {#metadata-and-controls}

መተግበሪያዎች ዕጣውን ለይተው እንዲያውቁ ለሚረዱ የታመቀ እውነታዎች ሜታዳታ ይጠቀሙ -

- የንብረት ክፍል፣ ሰጪ፣ ጠባቂ ወይም የመመዝገቢያ ማጣቀሻ
- መጋዘን፣ ቮልት፣ ISIN፣ ደረሰኝ ወይም የምስክር ወረቀት መለያዎች
- የምስክር ወረቀት እና ህጋዊ ሰነዶች የይዘት ምስጠራ ሃሽ
- SoraFS ለትላልቅ ማስረጃ ጥቅሎች ዱካዎች ወይም ቴክኒካዊ አንጸባራቂ ማጣቀሻዎች
- ከሰንሰለት ውጪ አገልግሎቶች ጥቅም ላይ የሚውሉ ብስለት፣ ስልጣን ወይም ተገዢነት መለያዎች

የተተገበረው `RwaControlPolicy` እነዚህ መስኮች አሉት -

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

የመቆጣጠሪያ መለያዎች እና ሚናዎች በተዛማጅ የቡሊያን ባንዲራዎች የነቁትን ስራዎች ብቻ ማከናወን ይችላሉ። የአሁኑ የቁጥጥር ጭነት የመቆጣጠሪያ ማንነቶችን እና የአሠራር ባንዲራዎችን ይዟል። የተፈቀዱ ዝርዝሮችን እና የጎጆ `transfers` ህጎችን ያስተላልፉ ከዚህ ጭነት ውጭ ናቸው።

## መጠይቆች፣ ክስተቶች፣ እና APIs {#queries-events-and-apis}

ጥቅም [`FindRwas`](/am/reference/queries.md#assets-nfts-and-rwas) የተመዘገበውን ለመዘርዘር RWA ብዙ። የቀጥታ ዝመናዎችን የሚያስፈልጋቸው መተግበሪያዎች መመዝገብ ይችላሉ [`Rwa` የውሂብ ክስተቶች](/am/blockchain/filters.md#data-event-filters) ለተፈጠረ ፣ ለተለወጠ ፣ ለተከፋፈለ ፣ ለተዋሃደ ፣ ለተዋጀ ፣ የቀዘቀዘ ፣ ያልቀዘቀዘ ፣ ተይዟል፣ ተለቀቀ፣ በግዳጅ የተላለፈ፣ ቁጥጥሮች-ተለውጠዋል እና ሜታዳታ ክስተቶች።

Torii እንደ ሰንሰለት-ሁኔታ መንገዶችን ያጋልጣል `/v1/rwas` እና `/v1/rwas/query`, በተጨማሪም እንደ አሳሽ መንገዶች `/v1/explorer/rwas` እና `/v1/explorer/rwas/{rwa_id}` ያ መንገድ ቤተሰብ ሲነቃ። የመነጩ ደንበኞች ቀጥታ ስርጭትን መምረጥ አለባቸው [`/openapi.json`](/am/reference/torii-endpoints.md#common-endpoints) በ Node የተገለጠውን ትክክለኛ ምላሽ ለመስጠት ሰነድ.

### ይህንን የስራ ፍሰት በ Taira ላይ ያሂዱ {#try-it-on-taira}

ይፋዊ Taira በአሁኑ ጊዜ RWA ዕጣዎችን መመዝገቡን ያረጋግጡ -

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

በቀጥታ Taira OpenAPI ሰነድ የተጋለጡትን RWA መንገዶች ይዘርዝሩ -

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

እስካሁን ምንም የህዝብ ዕጣዎች ካልተመዘገቡ ባዶ `items` ውፅዓት ይጠበቃል። ምዝገባ፣ ማስተላለፍ፣ መያዝ፣ ማቆዝ እና መቤዠት የተፈረሙ ግብይቶች ናቸው።

## ይሞክሩት {#try-it}

ከታች ያሉት ምሳሌዎች ከ[የተጋራ ማዋቀር](/am/guide/tutorials/python.md#shared-setup) የ Python SDK ንጣፎችን ይጠቀማሉ። ግብይት ከማስገባትዎ በፊት የመለያ መታወቂያዎችን፣ የግል ቁልፎችን እና የተፈጠሩ የሎጥ መታወቂያዎችን ከራስዎ አውታረ መረብ እሴቶች ጋር ይተኩ።

### RWA API መንገዶችን ያግኙ {#discover-rwa-api-routes}

ይህ ተነባቢ-ብቻ ምሳሌ የትኞቹን መተግበሪያ የሚመለከቱ RWA መንገዶች እንደነቁ የሚሮጥ Torii ኖድ ይጠይቃል -

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

ዝርዝሩ ባዶ ከሆነ፣ ኖድ አሁንም RWA መመሪያዎችን እና ጥያቄዎችን በሌሎች Torii APIs ሊደግፍ ይችላል፣ ነገር ግን የአማራጭ JSON መንገድ ቤተሰብን እያጋለጠ አይደለም።

### የመጋዘን ደረሰኝ ይመዝገቡ {#register-a-warehouse-receipt}

አንድ የንግድ እርምጃ አንድ የተፈረመ ግብይት መሆን ሲገባው ረቂቅ ይጠቀሙ። የቢዝነስ ደረሰኝ ቁጥር ወደ ውስጥ ይገባል `primary_reference`; የብሎክቼይን መዝገብ መታወቂያ የሚመነጨው ግብይቱ ከተጠናቀቀ በኋላ ነው።

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

ግብይቱ ከተጠናቀቀ በኋላ የመነጩ RWA መታወቂያዎችን ይዘርዝሩ። የሰንሰለት-ሁኔታ መስመሮች ነጠላ ፕሮቶኮል-መደበኛ መታወቂያዎችን ያጋልጣሉ; መታወቂያውን ከ`primary_reference` ወይም ሜታዳታ ጋር ማዛመድ ሲፈልጉ ክስተቶችን ወይም አሳሽ ዝርዝር መንገዶችን ይጠቀሙ -

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

በአሳሽ የነቁ አንጓዎች የበለጸጉ ትንበያዎችን ሊመልሱ ይችላሉ -

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### በጊዜያዊ መያዣ ያስተላልፉ {#transfer-with-a-temporary-hold}

በሰንሰለቱ የተመለሰውን የመነጨውን RWA መታወቂያ ይጠቀሙ። ይህ የቀደመው ምሳሌ `alice` ባለቤቱ እንደሆነ ይገምታል እና እንዲሁም በ`hold_enabled` እንደ ተቆጣጣሪ ተዋቅሯል።

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

ከሰንሰለት ውጪ ያለው ሂደት ከተሳካ በኋላ `ReleaseRwa` ያስገቡ -

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### መቆጣጠሪያዎችን እና ኦዲት ሜታዳታን ያክሉ {#add-controls-and-audit-metadata}

መቆጣጠሪያዎች እና ሜታዳታ የተለዩ ናቸው። ለተቆጣጣሪ ፖሊሲ መቆጣጠሪያዎችን እና መተግበሪያዎች ወይም ኦዲተሮች ማሳየት ለሚያስፈልጋቸው እውነታዎች ሜታዳታ ይጠቀሙ -

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

### ብዛት ማስመለስ ወይም ማቋረጥ {#redeem-or-retire-quantity}

የተወከለው ከሰንሰለት ውጪ ያለው ንብረት ከደረሰ፣ ከተበላ፣ ከተቋረጠ ወይም በሌላ መንገድ ከስርጭት ከተወገደ በኋላ `RedeemRwa` ያስገቡ። ይህ የቀረበውን መጠን ከዕጣው በቋሚነት ይቀንሳል። ዕጣው `redeem_enabled` ሊኖረው ይገባል። ምስጠራ ፈራሚው ባለቤት ወይም ተቆጣጣሪ መሆን አለበት።

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### ተገዢነት ግምገማ ወቅት ያቀዘቅዙ {#freeze-during-compliance-review}

ከሰንሰለት ውጪ የሆነ ግምገማ ተራ የባለቤት ስራዎችን ማገድ ሲኖርበት `FreezeRwa` ያስገቡ። ምስጠራ ፈራሚው ተቆጣጣሪ መሆን አለበት። ዕጣው `freeze_enabled` ሊኖረው ይገባል።

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

ግምገማው ካለፈ በኋላ `UnfreezeRwa` ያስገቡ -

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

የክፍያ መጠየቂያ ቁጥሩን በ`primary_reference` እና ሜታዳታ ውስጥ በማከማቸት ደረሰኝ እንደ RWA ዕጣ ይወክሉ። ከተመዘገቡ በኋላ ለማስተላለፍ እና ለመቤዠት የመነጨውን መታወቂያ ይጠቀሙ።

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

ደረሰኙ ሲደገፍ ወይም ሲከፈል፣ የመነጨውን የክፍያ መጠየቂያ ዕጣ መታወቂያ ይጠቀሙ -

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

ከሰንሰለት ውጪ የፋይናንሺያል ግብይት እልባት በኋላ የተወከለውን መጠን ይውሰዱ -

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### የካርቦን ክሬዲት ከጥቅም ማስወጣት {#carbon-credit-retirement}

የይገባኛል ጥያቄዎችን ከስርጭት ለማስወገድ `RedeemRwa` ያስገቡ። ከሰንሰለት ውጪ ያለውን የምስክር ወረቀት ወይም የመመዝገቢያ ማረጋገጫ በሜታዳታ ውስጥ ያከማቹ -

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

### ሁለት ዕጣዎችን አዋህድ {#merge-two-lots}

ሁለት ከሰንሰለት ውጪ ያሉ ቦታዎች ሲዋሃዱ ዕጣዎችን ያዋህዱ። ወላጆች በአንድ ጎራ ውስጥ መሆን አለባቸው እና ተመሳሳይ መጠን ያለው መግለጫ መጠቀም አለባቸው. የሶፍትዌር ማስፈጸሚያ አካባቢ የልጁን ዕጣ መታወቂያ ያመነጫል።

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

ለሙሉ Python ግብይት ምሳሌ፣ [የገሃዱ ዓለም ንብረቶች](/am/guide/tutorials/python.md#real-world-assets) ይመልከቱ።

## ተዛማጅ ሰነዶች {#related-docs}

- [ንብረቶች](/am/blockchain/assets.md)
- [ሜዳዳታ](/am/blockchain/metadata.md)
- [Iroha የማስተማሪያ ስራዎች](/am/blockchain/instructions.md)
- [መጠይቆች](/am/reference/queries.md#assets-nfts-and-rwas)
- [Torii API የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md#app-and-sora-route-families)
