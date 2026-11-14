---
translation_locale: am
translation_source: /blockchain/transactions.md
translation_source_hash: d9227effcdb4d54ac76f6288ba213de20f2574e1585e13b96a5202c44b69f3be
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# ግብይቶች {#transactions}

ግብይት በብሎክቼይን ላይ ስራን ለማስፈጸም የተፈረመ ጥያቄ ነው። ሊተገበር የሚችል ጭነት የታዘዘ ቅደም ተከተል [መመሪያዎች](./instructions.md)፣ የኮንትራት ቴክኒካል ጥሪ፣ IVM ባይት ኮድ ወይም የተረጋገጠ IVM አፈፃፀም ሊሆን ይችላል። ለአሁኑ የኮንትራት ማስፈጸሚያ ሞዴል [ስማርት ኮንትራቶች](./smart-contracts.md) ይመልከቱ።

ግብይቶች ሁኔታን የሚቀይር ወይም የሚፈጸም ሥራ ያከናውናሉ። ለንባብ ብቻ የሚደረግ ምርመራ የተፈረሙ የውሂብ ጥያቄዎችን ወይም ክፍት የንባብ መገናኛ ነጥቦችን ይጠቀማል፣ ግብይትም አይፈጥርም።

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

ይህ አሁንም የንባብ ብቻ ክዋኔ ነው። ግብይት መላክ የተፈረመ Norito ኤንቨሎፕ፣ ትክክለኛ የሰንሰለት ID እና የአውታረ መረብ ID፣ በግልጽ የተጠቀሰ ከፋይ እና ከፋውሴት ገንዘብ የተሞላለት የTaira መለያ ይፈልጋል።

በTaira ላይ ክፍያ ለሚፈልጉ ምሳሌዎች፣ በ[በTaira ላይ የሙከራ አውታረ መረብ XOR ማግኘት](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ያለውን ቀድሞ የማዘጋጀት ፋውሴት ሂደት ተጠቅመው የፈራሚውን መለያ ይሙሉ፣ ከዚያም የክፍያ ንብረቱን ቀሪ ሒሳብ ያረጋግጡ:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

የፋውሴት መንገድ `502` ከመለሰ ግብይቱን ራሱን ከመመርመርዎ በፊት ይጠብቁና እንደገና ይሞክሩ።

ከዚያ ግብይቱን ሲልኩ ከፋዩን ይምረጡ። በ`--fee-payer authority` ፈራሚው መለያ ይከፍላል፣ CLIም ከመፈረም በፊት ትክክለኛውን ክፍያ በTaira የክፍያ ንብረት ያስላል:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "faucet-funded taira transaction"
```

## ከመስመር ውጭ ግብይቶች {#offline-transactions}

Iroha ሁለት ከመስመር ውጭ የግብይት የስራ ፍሰቶች አሉት -

- ከመስመር ውጭ መፈረም የፊርማ መሳሪያው ግንኙነቱ ሲቋረጥ መደበኛ የተፈረመ ግብይት ይፈጥራል። የመስመር ላይ ደንበኛ የተፈረመውን የውሂብ መያዣ ወደ Torii እስኪያቀርብ ድረስ ግብይቱ አይካሄድም፣ ስለዚህ አሁንም ትክክለኛውን የሰንሰለት መታወቂያ፣ የፈቃድ ባለቤት፣ ፈቃዶች፣ ክፍያዎች፣ እና የግብይት የህይወት ዘመን.
- **የKagemusha ከመስመር ውጭ ጥሬ ገንዘብ** በሃርድዌር የተጠበቀ የተመዘገበ ቦርሳ በመስመር ላይ ሳለ እሴት ይጭናል፣ ሁለቱም ቦርሳዎች ከመስመር ውጭ ሲሆኑ በመካከላቸው ክፍያ ያስችላል፣ ቦርሳው እንደገና በመስመር ላይ ሲመጣም የቀረውን እሴት ወደ መዝገብ መለያ ይመልሳል።

Torii አንድ ሁኔታ የሚቀይር የKagemusha መንገድ፣ `POST /v1/kagemusha/enrollment`፣ ያቀርባል። በመለያ የተረጋገጡ `application/x-norito` የምዝገባ ፍሬሞችን ይቀበላል፣ በመሸጎጫ መቀመጥ የሌለባቸውን የግል ምላሾችም ይመልሳል። በ`/v1/kagemusha/{scheme}/wallets/{wallet}/` ስር ያሉ በመለያ የተፈረሙ የSDK የንባብ መንገዶች የእሴት መጫኛ (Load) ደረሰኞችን እና የመጨረሻነት ማስረጃን ይመልሳሉ፤ እነዚህ በ`/openapi.json` ውስጥ አልተዘረዘሩም። የዚህ የሕይወት ዑደት የመዝገብ ክፍል `KagemushaWalletLedgerV1` መመሪያ የያዙ መደበኛ የተፈረሙ ግብይቶችን ይጠቀማል፦

| ክዋኔ | ዓላማ |
| --- | --- |
| `Activate` | የተመዘገበ ቦርሳ ማንቃት፤ ናቲቭ የመነሻ ማረጋገጥ ግዴታ ነው |
| `IssueLoad` | ከከፋዩ ሒሳብ መቀነስ እና የቦርሳውን ቀጣይ Load በአንድ አቶሚክ ክዋኔ መመዝገብ |
| `Unload` | ሙሉ Unload ጥያቄን ለተያያዘው መለያ ቢበዛ አንድ ጊዜ መክፈል |
| `ClaimFee` | ሙሉ የክፍያ ጥያቄን ለተወሰነው ተጠቃሚ መክፈል |
| `Abandon` | ያልተጠቀመ ምዝገባ መተው |

የተለመደው ፍሰት የሚከተለው ነው-

1. አይነት ያለው የSwift ወይም Android ቦርሳ በመጠቀም በ`/v1/kagemusha/enrollment` ቦርሳውን ይመዝግቡ፣ ከዚያም ያንቁት።
2. `IssueLoad` ግብይት ይላኩ። አፈጻጸሙ የሚጠበቀውን ቀጣይ የLoad ቅደም ተከተል ቁጥር እና ዜሮ ያልሆነ የጥያቄ ID ያረጋግጣል፣ ስለዚህ ያረጀ ወይም የተለወጠ ዳግም ሙከራ ይከሽፋል። ምላሽ ከጠፋ ሌላ Load ከመፈረም ይልቅ ዋናውን የLoad ደረሰኝ ያንብቡ።
3. ቦርሳዎቹ ከመስመር ውጭ ሳሉ በመካከላቸው ክፍያዎችን በአካባቢው ይለዋወጡና ያረጋግጡ፤ እያንዳንዱን ዝውውር ከማረጋገጥዎ በፊት የቦርሳውን ሁኔታ በቋሚነት ያስቀምጡ።
4. ቦርሳው እንደገና በመስመር ላይ ሲመጣ የUnload ጥያቄውን ይላኩና የመጨረሻነትን ይጠብቁ።

Kagemusha ለልቀት ብቁ መሆኑ ገና አልተረጋገጠም፦ የቀጥታ የገንዘብ ብቃት ማረጋገጫ እንዲሁም በአካላዊ መሣሪያዎች ላይ የስልክ ምዝገባ፣ ማንቃት እና ክፍያ ገና ያልተጠናቀቁ ናቸው።

የማስታወሻው ሁኔታ በመስመር ላይ የህይወት ኡደት እስኪዘምን ድረስ የብሎክቼይን መዝገብ የሚጋጭ ከመስመር ውጭ ዝውውርን መለየት አይችልም። ስለዚህ፣ የኪስ ቦርሳ እና ኦፕሬተር ፖሊሲዎች የእሴት ገደቦችን፣ ጊዜው የሚያበቃን፣ ተቀባይነት ያላቸው ሰጪዎችን፣ አስተማማኝ የአካባቢ ማከማቻን እና የማስታረቅ መስኮቶችን ማስፈጸም አለባቸው።

ከ`Grant` መመሪያ ጋር አዲስ ግብይት የመፍጠር ምሳሌ ይኸውና። በዚህ ግብይት ውስጥ Mouse Alice የተገለጸውን ሚና (`role_id`) እየሰጠ ነው። [ሙሉ ምሳሌ](./permissions.md#register-a-new-role) ን ያረጋግጡ።

```rust
let grant_role = Grant::account_role(role_id, alice_id);
// `network_id` is the target network's `NetworkId`; the fee intent is bound
// into the signature (use the intent returned by a fee quote).
let grant_role_tx = TransactionBuilder::new(
    network_id,
    mouse_id,
    FeePaymentIntent::authority(Vec::new(), None),
)
.with_instructions([grant_role])
.sign(&mouse_private_key);
```
