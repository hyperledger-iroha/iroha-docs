---
translation_locale: am
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ግብይቶች {#transactions}

ሀ **ግብይት** በብሎክቼይን ላይ ሥራ ለመፈፀም የተፈረመ ጥያቄ ነው።
ሊፈፀም የሚችል ጥቅማጭነት የተደራጀ ቅደም ተከተል ሊሆን ይችላል
[መመሪያ](./instructions.md), የውል ጥሪ፣ IVM ባይት ኮድ ወይም
የተረጋገጠ IVM አሰቃየት [ብልህ ኮንትራት](./smart-contracts.md) ለአሁኑ
የውል አፈፃፀም ሞዴል.

ግብይቶች ሁኔታን የሚቀይሩ ወይም ሊፈፀሙ የሚችሉ ስራዎችን ያካሂዳሉ።
የተፈረሙ መጠይቆችን ወይም የህዝብ ንባብ መጨረሻ ነጥቦችን ይጠቀማል እና ግብይት አይፈጥርም።

ወደ ተሰማርቶ በነበረው ክምችት ውስጥ የተቀበለው ግብይት ከተፈጸመበት ጊዜ ጋር ይከማቻል።
ውጤቱን ጨምሮ የፍጻሜ ውድቅ።
እንደ ልክ ያልሆነ ፖስታ ወይም በቁጥሩ የተከለከለው ግብይት የመሳሰሉ ተቀባይነት ያላቸው ዕቃዎች፣
በአንድ ብሎክ ውስጥ አይከማቹም።

የግላዊነትን የሚጠብቅ የንብረት እንቅስቃሴ ለማግኘት ተመልከት
[ስም አልባ ግብይቶች](./anonymous-transactions.md). ስም አልባ
ግብይቶች የተጠበቁ የንብረት ማስታወሻዎችን፣ ግዴታዎችን፣ የማጣቀሻ ምልክቶችን ይጠቀማሉ፤ እንዲሁም
ከሕዝብ መለያ ወደ መለያ ሚዛን ለውጦች ይልቅ የዜሮ እውቀት ማስረጃዎች።

በተመረጡ ግልፅ አፈፃፀም ውጤቶች ላይ ማስረጃ ለማግኘት ተመልከት
[FastPQ](./fastpq.md). FastPQ ከተለመደው በኋላ የፍርድ ምስክሮችን ይጠቀማል
የግብይት አፈፃፀም እና የሚደገፉ ለ Deterministic proof ጭነቶች ይገነባል
የአገሪቱ ሽግግር።

## ሞክር Taira {#try-it-on-taira}

በቅርብ ጊዜ የህዝብን መረጃ ለመመርመር የአስፈፃሚ መንገዶችን ይጠቀሙ Taira ብሎኮች እና ግብይቶች
ፊርማ ያለበት ሂሳብ የሌለው ሁኔታ:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

መተግበሪያዎ ቀደም ሲል ያቀረበውን ግብይት ለመከታተል, `hash` ከ
የተቃዋሚውን ዝርዝር መንገድ ይዘርዝሩና ይመርምሩ

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

ይህ አሁንም ለንባብ ብቻ ነው። Norito
ፖስታ፣ ትክክለኛ ሰንሰለት ID, የክፍያ ሜታዳታ እና በቧንቧ የተደገፈ Taira ሂሳብ።

ለክፍያ የሚከፈልባቸው ምሳሌዎች Taira, የቧንቧ ረዳት ከ
[ቴስትኔት ያግኙ XOR ላይ Taira](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
እንደ `taira_faucet_claim.py`, ከዚያም ፊርማውን በሕዝብ መታጠቢያ በኩል ይፋ ያድርጉ
አንደኛ፡

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

የቧንቧው እንቆቅልሽ ወይም የይገባኛል ጥያቄ መንገድ ከተመለሰ `502`, መጠበቅ እና እንደገና ለመሞከር
ግብይቱን ራሱ ማረም.

ከዚያም Taira ግብይቱን በሚያቀርቡበት ጊዜ የክፍያ ንብረት ሜታዳታ:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## ከመስመር ውጪ የሚደረጉ ግብይቶች {#offline-transactions}

Iroha ከመስመር ውጭ ሁለት የግብይት የሥራ ፍሰቶች አሉት-

- **ከመስመር ውጭ ፊርማ ማድረግ** ፊርማው በሚደረግበት ጊዜ መደበኛ የተፈረመ ግብይት ይፈጥራል
  መሣሪያው ተቆርጧል.
  ደንበኛው የተፈረመውን ፖስታ ለ Torii, ስለዚህ አሁንም የ
  ትክክለኛ ሰንሰለት ID, ሥልጣን፣ ፍቃዶች፣ ክፍያዎች እና የግብይት ዕድሜ።
- **ካጌሙሻ ከመስመር ውጭ ገንዘብ** በመስመር ላይ እያለ የኪስ ቦርሳውን ይጨምራል ፣ ይደግፋል
  ሁለቱም ቦርሳዎች ሲሆኑ ተቀባዩ የሚጀምረው ከቦርሳ ወደ ቦርሳ ማስተላለፍ
  ከመስመር ውጭ, እና ተቀባዩ በሚመለስበት ጊዜ የተገኘውን ማስታወሻ ሁኔታ ይክፈላል
  በይነመረብ ላይ።

Torii የ Kagemusha ሙሉ የሕይወት ዑደት `/v1/offline/*`:

| ዘዴ እና መጨረሻ ነጥብ | ዓላማ |
| --- | --- |
| `GET /v1/offline/readiness` | የካጌሙሻን ዝግጁነት ለመገምገም `asset_definition_id` |
| `POST /v1/offline/receiver-lineage` | ለተፈረመ ተቀባዩ ጥያቄ ማስረጃ የሚያቀርብ የንቁ ምዝገባ መስመር መፍታት |
| `POST /v1/offline/top-up` | የተፈረመ የመስመር ላይ-ወደ-መስመር ውጪ ማሟያ ሥራ ያቅርቡ |
| `POST /v1/offline/redeem` | የተፈረመውን ከመስመር ውጭ የመክፈያ ሥራ ያቅርቡ |
| `GET /v1/offline/operations/{operation_id}` | የሽግግር ወይም የመልሶ ማቋቋም መደበኛ ሁኔታን ያንብቡ |

ከመስመር ውጭ ክወና ከመገንባት በፊት ንብረቱ ዝግጁ መሆኑን ያረጋግጡ

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

ዝግጁነት የኪስ ቦርሳውን ከሥራው ድልድይ ጋር ያገናኛል ABI 21 እና የተረጋገጠ V4
የዘር ሐረግ, ማሟያ, እና የመልቀቂያ ጥያቄዎችን በመጠቀም
`application/x-norito` መዝገቦች፣ ማጠናከሪያ እና የመልሶ ማግኛ `202 Accepted`
በ `Location` ወደ ሥራው ሀብት የሚያመለክተው ራስጌ; የተቀረጸው
ከዜሮ ውጭ የሆነ አሠራር ID የኃይል መቆጣጠሪያ ቁልፍን ያቀርባል.

የተለመደው ፍሰት:

1. ዝግጁነትን ይጠይቁ እና ያቁሙ `ready` ሐሰት ነው ወይም ማንኛውም ማገጃ ይተገበራል.
2. የተጻፈውን ይጠቀሙ Swift ወይም JVM የካኖኒክ ማሟያ ማህደርን ለመገንባት የኪስ ቦርሳ፣
   ያቅርቡት፣ እና የመግቢያ ማስታወሻውን ሁኔታም ሆነ አሠራር ይያዙ ID እስከ
   አሠራሩ የመጨረሻ ሰንሰለት ደረጃ ላይ ደርሷል።
3. አስፈላጊ ከሆነ ተቀባዩ ምዝገባ ዘርን መፍታት ፣ መገንባት እና
   እያንዳንዱን የእኩዮች ማስተላለፍ በአካባቢው ያረጋግጡ ፣ እና የተመሰጠረውን ማስታወሻ ሁኔታ ይቀጥሉ
   ማስተላለፉን ከማረጋገጡ በፊት።
4. ተቀባዩ በመስመር ላይ በሚሆንበት ጊዜ የቅዱሳን መጻሕፍት የመልቀቅ መዝገብ ይገንቡ,
   ያቅርቡት፣ እና የስራ ፍጆታውን እስከ መጨረሻው ድረስ ይመረምራሉ።

መቁጠሪያው ማስታወሻ ሁኔታ ድረስ ተቃራኒ ከመስመር ውጪ ማስተላለፍ ማየት አይችልም
በኦንላይን የሕይወት ዑደት ውስጥ የሚመለስ ገንዘብ።
ስለዚህ የዋጋ ገደቦችን ማስከበር፣ ማብቂያ፣ ተቀባይነት ያላቸው ኤሚተሮች፣ ዘላቂ አካባቢያዊ
ማከማቻ እና የማስተካከያ መስኮቶች።

እዚህ ጋር አዲስ ግብይት በመፍጠር ምሳሌ ነው `Grant`
በዚህ ግብይት ውስጥ አይራው ለአሊስ የተጠቀሰውን
ሚና (`role_id`) ቼክ
[ሙሉ ምሳሌ](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
