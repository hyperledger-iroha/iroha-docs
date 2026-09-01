---
translation_locale: am
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ግብይቶች {#transactions}

ግብይት በብሎክቼይን ላይ ስራን ለማስፈጸም የተፈረመ ጥያቄ ነው። ሊተገበር የሚችል ጭነት የታዘዘ ቅደም ተከተል [መመሪያዎች](./instructions.md)፣ የኮንትራት ቴክኒካል ጥሪ፣ IVM ባይት ኮድ ወይም የተረጋገጠ IVM አፈፃፀም ሊሆን ይችላል። ለአሁኑ የኮንትራት ማስፈጸሚያ ሞዴል [ስማርት ኮንትራቶች](./smart-contracts.md) ይመልከቱ።

ግብይቶች ሁኔታን የሚቀይር ወይም ሊተገበር የሚችል ስራ ያከናውናሉ። ተነባቢ-ብቻ ፍተሻ የተፈረሙ መጠይቆችን ወይም ይፋዊ የተነበቡ API የመጨረሻ ነጥቦችን ይጠቀማል እና ግብይት አይፈጥርም።

በተጠናቀቀው ብሎክ ውስጥ የተካተተ ግብይት ማንኛውንም የማስፈጸሚያ ውድቅ ማድረግን ጨምሮ ከአፈፃፀሙ ውጤት ጋር ይመዘገባል። በብሎክ ውስጥ ከመካተታቸው በፊት ውድቅ የተደረጉ ጥያቄዎች፣ ለምሳሌ ልክ ያልሆነ የውሂብ መያዣ ወይም በወረፋው ውድቅ የተደረገ ግብይት፣ በብሎክ ውስጥ አልተመዘገቡም።

ግላዊነትን ለመጠበቅ የንብረት እንቅስቃሴ፣ [ስም-አልባ ግብይቶች](./anonymous-transactions.md) የሚለውን ይመልከቱ። ማንነታቸው ያልታወቁ ግብይቶች ከህዝብ መለያ-ወደ-መለያ ቀሪ ሂሳብ ለውጦች ይልቅ የተከለሉ የንብረት ማስታወሻዎችን፣ ክሪፕቶግራፊያዊ ኮሚትመንቶችን፣ ከዝርዝሮችን እና ዜሮ-እውቀት ማረጋገጫዎችን ይጠቀማሉ።

በተመረጡ ግልጽ የማስፈጸሚያ ውጤቶች ላይ ማረጋገጫ ለማግኘት [FastPQ](./fastpq.md) ይመልከቱ። FastPQ ከመደበኛ የግብይት አፈፃፀም በኋላ የማስፈጸሚያ ምስክሮችን ይጠቀማል እና ለሚደገፉ የስቴት ሽግግሮች ዲተርሚኒስቲክ የማረጋገጫ ስብስቦችን ይገነባል።

## ይህንን የስራ ፍሰት በ Taira ላይ ያሂዱ {#try-it-on-taira}

የቅርብ ጊዜ ይፋዊ Taira ብሎኮችን እና የግብይት ሁኔታዎችን ያለ ፊርማ መለያ ለመመርመር የአሳሽ መንገዶችን ይጠቀሙ -

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

መተግበሪያዎ ቀደም ብሎ ያስገባውን ግብይት ለመከተል `hash` ከዝርዝሩ ውስጥ ይቅዱ እና የአሳሽ ዝርዝር መንገድን ይፈትሹ -

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

ይህ አሁንም ተነባቢ-ብቻ ነው። ግብይትን ለማስገባት የተፈረመ Norito የውሂብ መያዣ፣ ትክክለኛ የሰንሰለት መታወቂያ፣ የክፍያ ሜታዳታ እና በቴስትኔት የተደገፈ Taira መለያ ያስፈልገዋል።

በ Taira ላይ ክፍያ ለሚጠይቁ ምሳሌዎች፣ የገንዘብ ድጋፍ አጋዡን ከ [በ Taira የሙከራ መረብ XOR ያግኙ](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ወስደው `taira_faucet_claim.py` በሚል ስም ያስቀምጡ፤ ከዚያ በመጀመሪያ ፈራሚውን በሕዝብ የገንዘብ ድጋፍ አገልግሎት በኩል ይሙሉ፦

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

የቴስትኔት የገንዘብ ድጋፍ አገልግሎት እንቆቅልሽ ወይም የይገባኛል ጥያቄ መንገድ ከተመለሰ `502`፣ ግብይቱን እራሱ ከማረምዎ በፊት ይጠብቁ እና እንደገና ይሞክሩ።

ከዚያ ግብይቱን በሚያስገቡበት ጊዜ የ Taira ክፍያ ንብረት ሜታዳታ ያያይዙ -

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## ከመስመር ውጭ ግብይቶች {#offline-transactions}

Iroha ሁለት ከመስመር ውጭ የግብይት የስራ ፍሰቶች አሉት -

- ከመስመር ውጭ መፈረም የፊርማ መሳሪያው ግንኙነቱ ሲቋረጥ መደበኛ የተፈረመ ግብይት ይፈጥራል። የመስመር ላይ ደንበኛ የተፈረመውን የውሂብ መያዣ ወደ Torii እስኪያቀርብ ድረስ ግብይቱ አይካሄድም፣ ስለዚህ አሁንም ትክክለኛውን የሰንሰለት መታወቂያ፣ የፈቃድ ባለቤት፣ ፈቃዶች፣ ክፍያዎች፣ እና የግብይት የህይወት ዘመን.
- የካጌሙሻ ከመስመር ውጭ ጥሬ ገንዘብ በመስመር ላይ እያለ የኪስ ቦርሳውን ይሞላል፣ ሁለቱም የኪስ ቦርሳዎች ከመስመር ውጭ ሲሆኑ በተቀባዩ የተጀመረውን የኪስ ቦርሳ ወደ ቦርሳ ማስረጃዎችን ይደግፋል፣ እና ተቀባዩ በመስመር ላይ ሲመለስ የተገኘውን የማስታወሻ ሁኔታ ይመልሳል።

Torii በ`/v1/offline/*` ስር ያለውን ሙሉ የካጌሙሻ የሕይወት ዑደት ያጋልጣል -

|ዘዴ እና API የመጨረሻ ነጥብ|ዓላማ|
| --- | --- |
|`GET /v1/offline/readiness`|የካጌሙሻ ዝግጁነትን ለአንድ ይገምግሙ `asset_definition_id`|
| `POST /v1/offline/receiver-lineage` | ለተፈረመ ተቀባይ ጥያቄ ማረጋገጫ ያለውን ንቁ የምዝገባ ተከታታይነት ይፍቱ |
|`POST /v1/offline/top-up`|የተፈረመ ከመስመር ወደ መስመር ውጭ የመሙላት ስራ ያስገቡ|
|`POST /v1/offline/redeem`|የተፈረመ ከመስመር ውጭ የመቤዠት ተግባር ያስገቡ|
|`GET /v1/offline/operations/{operation_id}`|የመሙላት ወይም የመቤዠት ነጠላ ፕሮቶኮል-መደበኛ ሁኔታን ያንብቡ|

ከመስመር ውጭ አሠራር ከመገንባትዎ በፊት ለንብረቱ ዝግጁነት ያረጋግጡ -

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

ዝግጁነት የኪስ ቦርሳውን ከገባሪው ድልድይ ABI 21 እና ከተረጋገጠ V4 አርቲፋክት ስብስብ ጋር ያገናኛል። የተከታታይነት፣ መሙላት እና የመቤዠት ጥያቄዎች የተተየቡ `application/x-norito` ማህደሮችን ይጠቀማሉ። መሙላት እና መቤዠት መመለሻ `202 Accepted` ከ `Location` ራስጌ ጋር ወደ ኦፕሬሽን ሀብቱ ይጠቁማል; የተከተተው ዜሮ ያልሆነ ኦፕሬሽን መታወቂያ የ idempotency ቁልፍን ያቀርባል።

የተለመደው ፍሰት የሚከተለው ነው-

1. ዝግጁነትን ያረጋግጡ እና `ready` ውሸት ከሆነ ወይም ማንኛውም እንቅፋት የሚተገበር ከሆነ ያቁሙ።
2. ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ የመሙያ ማህደር ለመገንባት፣ ለማስገባት እና ክዋኔው የመጨረሻው ሰንሰለት ሁኔታ ላይ እስኪደርስ ድረስ ሁለቱንም የግቤት ማስታወሻ ሁኔታ እና የኦፕሬሽን መታወቂያ ለማቆየት የተተየበ Swift ወይም JVM የኪስ ቦርሳ ይጠቀሙ።
3. አስፈላጊ ሆኖ ሲገኝ የተቀባዩ ምዝገባ የተከታታይነት ይፍቱ፣ እያንዳንዱን የአውታረ መረብ አቻ ማስረጃ በአገር ውስጥ ይገንቡ እና ያረጋግጡ እና ዝውውሩን ከመቀበልዎ በፊት የተመሰጠረውን የማስታወሻ ሁኔታ ይቀጥሉ።
4. ተቀባዩ መስመር ላይ ሲሆን ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ የመቤዠት ማህደር ይገንቡ፣ ያስገቡት እና የአሠራር ሀብቱን እስከ መጨረሻው ድረስ ይመርጡ።

የማስታወሻው ሁኔታ በመስመር ላይ የህይወት ኡደት እስኪዘምን ድረስ የብሎክቼይን መዝገብ የሚጋጭ ከመስመር ውጭ ዝውውርን መለየት አይችልም። ስለዚህ፣ የኪስ ቦርሳ እና ኦፕሬተር ፖሊሲዎች የእሴት ገደቦችን፣ ጊዜው የሚያበቃን፣ ተቀባይነት ያላቸው ሰጪዎችን፣ አስተማማኝ የአካባቢ ማከማቻን እና የማስታረቅ መስኮቶችን ማስፈጸም አለባቸው።

ከ`Grant` መመሪያ ጋር አዲስ ግብይት የመፍጠር ምሳሌ ይኸውና። በዚህ ግብይት ውስጥ Mouse Alice የተገለጸውን ሚና (`role_id`) እየሰጠ ነው። [ሙሉ ምሳሌ](./permissions.md#register-a-new-role) ን ያረጋግጡ።

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
