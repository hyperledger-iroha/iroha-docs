---
translation_locale: am
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# ፈንገስ ንብረቶች {#fungible-assets}

## ውጤት {#outcome}

የቀጥታ Taira የንብረት ፍቺዎችን ይፈትሹ እና በተፈጠረ የአካባቢ አውታረመረብ ላይ የማውጣት፣ የማስተላለፍ፣ የማጥፋት እና የቀሪ ሒሳብ ማረጋገጫ ፍሰትን ያጠናቅቁ። የተግባር መመሪያው ነጠላ ፕሮቶኮል-ስታንዳርድ ቅድመ-ቅጥያ የሌላቸው Base58 የንብረት-ፍቺ መታወቂያዎችን፣ ጎራ አልባ I105 መለያ መታወቂያዎችን እና ግልጽ የክፍያ ክፍያን ይጠቀማል።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`፣ `jq`፣ Python 3.11 ወይም ከዚያ በኋላ፣ Node.js 24፣ እና የአሁኑ `iroha` እና `kagami` CLIs።
- ተነባቢ ብቻ Taira መዳረሻ።
- ለደረጃ በደረጃ የመጻፍ ክዋኔዎቹ፣ በ[አስጀምር Iroha](/am/get-started/launch-iroha.md) ላይ እንደተገለጸው በ`kagami localnet generate --peers 4 --out-dir ./localnet` የተፈጠረ የአካባቢ አውታረ መረብ፣ `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa` ተጨምሮበት። ይህ አውታረ መረብ `./localnet/client.toml`ን እና በ`http://127.0.0.1:8080` ላይ የሚሰራ Torii ያቀርባል።

## እርምጃዎች {#steps}

### 1. ያለ ምስጠራ ፈራሚ Taira ፍቺዎችን ይፈትሹ {#_1-inspect-taira-definitions-without-a-signer}

የንብረት ፍቺዎች ግልጽ ያልሆነ Base58 መታወቂያ፣ የማሳያ ስም፣ የንብረት አሰጣጥ ፖሊሲ፣ የቁጥር ልኬት፣ አማራጭ ተለዋጭ ስም፣ ባለቤት፣ አማራጭ ባለቤት ጎራ ወይም የውሂብ ቦታ፣ የቀሪ ሒሳብ ፖሊሲ እና አጠቃላይ ብዛት ይይዛሉ። ተጨባጩ ቀሪ ሒሳብ እንዲሁም የያዢውን መለያ እና አማራጭ የውሂብ ቦታ ወሰን ያካትታል።

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

የ JavaScript ቅጹን በ`node taira-assets.mjs` ያሂዱ። የህዝብ ንብረት መታወቂያዎች ባዶ Base58 እሴቶች ናቸው; እንደ `cookbook_credit#wonderland.universal` ያለ ሊነበብ የሚችል እሴት ከእነዚያ መታወቂያዎች ውስጥ በአንዱ ላይ የሚፈታ ተለዋጭ ስም ነው።

### 2. አካባቢውን ያዘጋጁ ፍቃድ ዋና እና መድረሻ {#_2-prepare-the-local-authority-and-destination}

በመነጨው ውቅር ውስጥ ካለው የህዝብ ቁልፍ የአካባቢ የፈቃድ ባለቤትን ያውጡ፣ ከዚያም ለአዲስ ተቀባይ መለያ የቁልፍ ጥንድ ይፍጠሩ እና መለያውን ያስመዝግቡ። ምንም የግል ቁልፍ አልታተመም።

```bash
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. በደንበኛው ባለቤትነት የተያዘ የቁጥር ፍቺ ይጠቀሙ {#_3-use-a-client-owned-numeric-definition}

ከጀነሲስ ውጭ፣ ፍቺ የሚመዘገበው ምስጠራ ፈራሚው በባለቤትነት በሚይዘው ባለቤት `--domain` ስር ነው፣ እና የመነጨ localnet ደንበኛ በባለቤትነት የያዘው ምንም ጎራ የለውም። በ`--asset-definition-id` የመነጨው localnet ይህን ፍቺ አስቀድሞ ይዟል፦ ጀነሲስ ፍቺውን ባልተገደበ ልኬት መዝግቧል፣ ደንበኛውን ባለቤቱ አድርጓል እና 1,000,000,000 አሃዶችን ለደንበኛው አውጥቷል።

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

ያንን መታወቂያ በ Taira ላይ እንደገና አይጠቀሙ። ይፋዊ የብሎክቼይን ኔትወርክ ምዝገባ አዲስ ነጠላ ፕሮቶኮል-መደበኛ መታወቂያ፣ መለያዎ በባለቤትነት የሚይዘው ባለቤት ጎራ (ለ`ledger asset definition register` እንደ `--domain` የሚተላለፍ)፣ ለማንኛውም ተለዋጭ ስም የ`CanManageAssetDefinitionAlias` የፈቃድ ስጦታ እና የክፍያ የገንዘብ ድጋፍ ያስፈልገዋል።

### 4. ማውጣት, ማስተላለፍ እና ማጥፋት {#_4-mint-transfer-and-burn}

ሁሉም ትዕዛዞችን ይፃፉ የፍቃድ ርዕሰ መምህሩን እንደ ክፍያ ከፋይ በግልፅ ይመርጣሉ። CLI ከመፈረሙ በፊት ትክክለኛውን ግብይት ይጠቅሳል እና በነባሪነት ይጠብቃል።

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

ከጥፋቱ በኋላ፣ የምንጭ ቀሪ ሒሳብ `1000000064.50`፣ የመድረሻ ቀሪ ሒሳብ `25.50` እና አጠቃላይ ብዛት `1000000090.00` ይጠብቁ።

::: warning የፍቃድ ወሰን

በ Taira ላይ ለእያንዳንዱ የመጻፍ ክዋኔ `--fee-payer authority` ይጠቀሙ፤ CLI ከመፈረሙ በፊት ትክክለኛውን ክፍያ በ Taira የክፍያ ንብረት የሚገልጽ የክፍያ ዋጋ ግምት ያቀርባል። ምዝገባ የፍቺውን `--domain` በባለቤትነት መያዝን ይጠይቃል፣ ተለዋጭ ስም ደግሞ `CanManageAssetDefinitionAlias` ያስፈልገዋል። ማውጣት ፍቺውን በባለቤትነት መያዝን ወይም `CanMintAssetWithDefinition` ወይም `CanMintAssetToAccount` መያዝን ይጠይቃል፤ ማስተላለፍ እና ማጥፋት በምንጩ ቀሪ ሂሳብ ላይ የፍቃድ ዋና ያስፈልጋቸዋል። በቴስትኔት የተደገፈ መለያ በራስ-ሰር ሰጪ አይደለም።

:::

## አረጋግጥ {#verify}

ሁለቱንም ተጨባጭ ቀሪ ሒሳቦች እና ከዚያ ፍቺውን ያንብቡ። እነዚህ የድህረ-ሁኔታ መጠይቆች የስኬት መስፈርት ናቸው; የማስረከቢያ ደረሰኝ በራሱ አይደለም.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

የመተግበሪያ ማረጋገጫዎች የቁጥር እሴቶችን እንደ ቋሚ ነጥብ አስርዮሽ ማወዳደር አለባቸው እንጂ ሁለትዮሽ ተንሳፋፊ ነጥብ እሴቶችን ሳይሆን የፍቺ መታወቂያውን እና መለያውን ማረጋገጥ አለባቸው።

## መላ ፍለጋ {#troubleshooting}

- `#` የያዘ መታወቂያ ተለዋጭ ስም ወይም ተጨባጭ ቀሪ ሒሳብ ቃል በቃል እንጂ አንድ ፕሮቶኮል-መደበኛ የንብረት-ፍቺ መታወቂያ አይደለም። ባዶውን Base58 እሴትን በ`--definition` ይጠቀሙ ወይም የታሰረ ተለዋጭ ስም በ`--definition-alias` ያስተላልፉ።
- `Scale` ስህተቶች ማለት አንድ መጠን ትርጉሙ ከሚፈቅደው በላይ ክፍልፋይ አሃዞች አሉት ማለት ነው።.
- `Mintability` አለመቀበል ማለት የ`Once`፣ `Not` ወይም `Limited(n)` ፖሊሲ መስጠትን አሟጥሟል ወይም አልፈቀደም። ታሪክን እንደገና አይፃፉ; በፍቺው መጠይቅ የተመለሰውን ፖሊሲ ይጠቀሙ።
- ደረጃ 2 የመድረሻ መለያውን በግልጽ ያስመዘግባል፣ ስለዚህ የመለያ መግቢያ `ExplicitOnly` በሚሆንበት ጊዜም ዝውውሩ ይሰራል። ተመሳሳይ ስም ያለው CLI ጠባቂ መለያ ወይም ቀሪ ሂሳብ አይመዘግብም፤ ሌላ መመሪያ ከመጨመር ይልቅ ያቋርጣል።
- የተለመደው መመሪያ ከመሳካቱ በፊት ክፍያ አለመቀበል ይከሰታል። ከፋዩን ይምረጡ፣ በ CLI የክፍያ ዋጋ ግምት ውስጥ ያለውን የክፍያ ንብረት እና ከፍተኛ መጠን ይፈትሹ፣ እና ያንን ቀሪ ሂሳብ ያረጋግጡ።
- በተመሳሳይ localnet ላይ የሚደረግ ድጋሚ ሩጫ ከቀደሙት ቀሪ ሂሳቦች ይጀምራል፣ እና `kagami keys` አስቀድሞ ያለውን `./cookbook-recipient` አይቀበልም። አዲስ የመነጨ localnet ያስጀምሩ እና ያንን ማውጫ ያስወግዱ፣ ወይም ከፍፁም እሴቶች ይልቅ የቀሪ ሂሳብ ለውጦችን ያወዳድሩ። የBase58 መታወቂያውን በተበላሸ የዘፈቀደ ሕብረቁምፊ በጭራሽ አይተኩ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የንብረት የሕይወት ዑደት ውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust የንብረት ግንባታ ምሳሌዎች በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [ንብረቶች](/am/blockchain/assets.md)
- [መመሪያዎች](/am/blockchain/instructions.md)
- [የፍቃድ ምልክቶች](/am/reference/permissions.md)
- [JavaScript እና TypeScript](/am/guide/tutorials/javascript.md)
