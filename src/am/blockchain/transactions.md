---
translation_locale: am
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ግብይቶች {#transactions}

አንድ ግብይት በብሎክቼይን ላይ ሥራ ለማከናወን የተፈረመ ጥያቄ ነው ። ሊፈፀም የሚችል ጠቃሚ ጭነት [ መመሪያዎች ](./instructions.md) ፣ የውል ጥሪ ፣ IVM ባይት ኮድ ወይም የተረጋገጠ IVM አፈፃፀም ሊሆን ይችላል ። የአሁኑ የውል አፈፃፀም ሞዴል ለማግኘት [ስማርት ኮንትራቶች](./smart-contracts.md) ይመልከቱ።

ግብይቶች ሁኔታን የሚቀይሩ ወይም ሊፈፀሙ የሚችሉ ሥራዎችን ያካሂዳሉ። የንባብ-ብቻ ምርመራ የተፈረሙ መጠይቆችን ወይም ህዝባዊ የንባብ መጨረሻ ነጥቦችን ይጠቀማል እና ግብይት አይፈጥርም.

በተቀበለው ብሎክ ውስጥ ተቀባይነት ያለው ግብይት ከተፈጸመበት ውጤት ጋር ይከማቻል ፣ ይህም የድርጊት ውድቅነትን ያጠቃልላል። እንደ ልክ ያልሆነ ኤንቨሎፕ ወይም በመጠባበቂያ ረድፍ የተከለከለ ግብይት ያሉ ከብሎክ መግቢያ በፊት ውድቅ የተደረጉ ጥያቄዎች በብሎክ ውስጥ አይከማቹም ።

ግላዊነትን የሚጠብቅ የንብረት እንቅስቃሴ ለማግኘት [Anonymous Transactions](./anonymous-transactions.md) ን ይመልከቱ። የማይታወቁ ግብይቶች ከሕዝብ መለያ ወደ መለያ ሚዛን ለውጦች ይልቅ የተጠበቁ የንብረት ማስታወሻዎችን ፣ ግዴታዎችን ፣ ነባሪዎችን እና ዜሮ-ዕውቀት ማስረጃዎችን ይጠቀማሉ ።

በተመረጡ ግልፅ አፈፃፀም ውጤቶች ላይ የምስክርነት ማስረጃ ለማግኘት [FastPQ](./fastpq.md) ይመልከቱ ። FastPQ ከተለመደው የግብይት አፈፃፀም፣ በኋላ የፍፃሜ ምስክሮችን ይጠቀማል እንዲሁም ለተደገፉ የስቴት ሽግግሮች የተወሰኑ የማረጋገጫ ቡድኖችን ይሠራል ።

## Taira ላይ ይሞክሩት {#try-it-on-taira}

በቅርብ ጊዜ የህዝብ Taira ብሎኮችን እና የግብይት ሁኔታዎችን ያለ ፊርማ መለያ ለመፈተሽ የአሰሳ መንገዶችን ይጠቀሙ:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

ከመተግበሪያዎ ቀደም ሲል የቀረበውን ግብይት ለመከታተል ከዝርዝሩ ውስጥ ያለውን `hash` ቅጂ ያቅርቡ እና የአሰሳ አቅጣጫ ዝርዝር ይፈትሹ:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

ይህ አሁንም ለንባብ ብቻ ነው። አንድ ግብይት ለማቅረብ የተፈረመ Norito ፖስታ፣ ትክክለኛ ሰንሰለት ID ፣ የክፍያ ሜታዳታ እና በቧንቧ የገንዘብ ድጋፍ የሚደረግ Taira ሂሳብ ያስፈልጋል።

በ Taira ላይ ክፍያ የሚከፈልባቸው ምሳሌዎች ፣ የቧንቧ ረዳት ከ [ ይያዙ Testnet XOR በ Taira](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ላይ እንደ `taira_faucet_claim.py`፣ ከዚያም ፊርማውን በመጀመሪያ በሕዝብ ቧንቧ በኩል ያግኙ:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

የቧንቧ እንቆቅልሽ ወይም የይገባኛል ጥያቄ መንገድ `502` የሚመለስ ከሆነ ፣ ግብይቱን ራሱ ከማስተካከልዎ በፊት ይጠብቁ እና እንደገና ይሞክሩ።

ከዚያ ግብይቱን በሚያቀርቡበት ጊዜ የ Taira ክፍያ አክሲዮን ሜታዳታ ይጨምሩ:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## ከመስመር ውጭ የሚደረጉ ግብይቶች {#offline-transactions}

Iroha ሁለት የመስመር ላይ ግብይት የስራ ፍሰቶች አሉት:

- ከመስመር ውጭ ፊርማ የፊርማ መሣሪያው በሚያቋርጥበት ጊዜ መደበኛ የተፈረመ ግብይት ይፈጥራል ። የመስመር ላይ ደንበኛው የተፈረመውን ፖስታ ወደ Torii እስኪያስገባ ድረስ ግብይቱ አይሰራም ፣ ስለሆነም አሁንም ትክክለኛ ሰንሰለት ID ፣ ስልጣን ፣ ፍቃዶች ፣ ክፍያዎች እና የግብይት ዕድሜ ያስፈልገዋል።
- ካጌሙሻ ኦፍላይን ገንዘብ በመስመር ላይ በሚገኝበት ጊዜ የኪስ ቦርሳውን ይጨምራል ፣ ሁለቱም ቦርሳዎች ከመስመር ውጭ በሚሆኑበት ጊዜ ተቀባዩ የሚጀምረው ከኪስ ቦርድ ወደ ኪስ ማስተላለፍን ይደግፋል ፣ እናም ተቀባዩ በመስመር ላይ ሲመለስ የተገኘውን ማስታወሻ ሁኔታ ይከፍላል ።

Torii ሙሉውን የካጌሙሻ የሕይወት ዑደት በ `/v1/offline/*` ያጋልጣል ።

|ዘዴና መጨረሻ ነጥብ |ዓላማ|
| --- | --- |
|`GET /v1/offline/readiness` |የካጌሙሻን ዝግጁነት ለአንድ `asset_definition_id` መገምገም |
|`POST /v1/offline/receiver-lineage` |ለተፈረመ ተቀባዩ ጥያቄ ማስረጃ የሚሸፍን ንቁ የምዝገባ መስመርን መፍታት |
|`POST /v1/offline/top-up` |የተፈረመ የመስመር ላይ-ወደ-መስመር ውጭ ማሟያ ሥራ ያቅርቡ |
|`POST /v1/offline/redeem` |ከመስመር ውጪ የተፈረመ የክፍያ ግብረመልስ ማቅረብ |
|`GET /v1/offline/operations/{operation_id}` |የሽግግር ወይም የመልሶ ማቋቋም መደበኛ ሁኔታን ያንብቡ |

ከመስመር ውጭ ክወና ከመገንባት በፊት ንብረቱን ዝግጁነት ያረጋግጡ:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

ዝግጁነት የኪስ ቦርሳውን ወደ ንቁ ድልድይ ABI 21 እና የተረጋገጠ V4 ቅርጸ-ቁምፊ ስብስብ ይያዛል። የዘር ሐረግ ፣ የመጨመር እና የመልሶ ማግኛ ጥያቄዎች በ `application/x-norito` የታየ መዝገብ ይጠቀማሉ ። የአሠራር ሀብቱን የሚያመለክት የ `Location` ራስጌ ጋር የተሞላ እና የመልሶ ማግኛ መልዕክት `202 Accepted`; የተቀናጀው ዜሮ ያልሆነ አሠራር ID ነፃነት ቁልፍን ያቀርባል.

የተለመደው ፍሰት:

1. `ready` ሐሰት ከሆነ ወይም ማንኛውም አግዳሚ ከተተገበረ ዝግጁነት ይጠይቁ እና ያቁሙ.
2. Swift ወይም JVM የተጻፈ የኪስ ቦርሳ በመጠቀም የካኖኒካል ማሟያ ማህደር ለመገንባት, እሱን ለማቅረብ, እና ግብዓት ማስታወሻ ሁኔታ እና ክወና ID እስከ ክወና የመጨረሻ ሰንሰለት ሁኔታ ላይ መድረስ ድረስ ሁለቱም ጠብቆ.
3. በተፈለገው ጊዜ ተቀባዩ የምዝገባ መስመርን መፍታት ፣ እያንዳንዱን የእኩዮች ማስተላለፍ በአካባቢው መገንባት እና ማረጋገጥ ፣ እና ዝውውሩን ከማረጋገጡ በፊት የተመሰጠረ ማስታወሻ ሁኔታን መጠበቅ።
4. ተቀባዩ በይነመረብ ላይ በሚሆንበት ጊዜ የቅዱሳን መጻሕፍት የመድኃኒት ማከማቻ ማህደርን ይገንቡ, ያቅርቡት, እና ፍፃሜውን ለማጠናቀቅ የአሠራር ሀብቱን ጥናት ያድርጉ.

መቁጠሪያው በመስመር ላይ የሕይወት ዑደት ውስጥ የክፍያ ሁኔታ እስኪመለስ ድረስ በተቃራኒ የመስመር ላይ ማስተላለፍን ማየት አይችልም። ስለሆነም Wallet እና ኦፕሬተር ፖሊሲ የዋጋ ገደቦችን ፣ ጊዜ ማብቂያዎችን ፣ ተቀባይነት ያላቸውን ኤሚተኞችን ፣ ዘላቂ የአከባቢ ማከማቻዎችን እና የመግባባት መስኮቶችን ማስገበር አለበት ።

እዚህ ላይ `Grant` መመሪያ ጋር አዲስ ግብይት መፍጠር አንድ ምሳሌ ነው. በዚህ ግብይት ውስጥ, አይጥ አሊስ የተጠቀሰው ሚና ይሰጣል (`role_id`). ሙሉውን ምሳሌ ይመልከቱ [](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
