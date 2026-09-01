---
translation_locale: am
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ፈንገስ ንብረቶች {#fungible-assets}

## ውጤት {#outcome}

የቀጥታ Taira የንብረት ፍቺዎችን ይፈትሹ እና በተፈጠረ የአካባቢ አውታረመረብ ላይ የመመዝገብ፣ የማስተላለፍ፣ የማስተላለፍ፣ የማጥፋት እና የቀሪ ሒሳብ ማረጋገጫ ፍሰትን ያጠናቅቁ። የተግባር መመሪያው ነጠላ ፕሮቶኮል-ስታንዳርድ ቅድመ-ቅጥያ የሌላቸው Base58 የንብረት-ፍቺ መታወቂያዎችን፣ ጎራ ብቁ የሆኑ ተለዋጭ ስሞችን፣ ጎራ አልባ I105 መለያ መታወቂያዎችን እና ግልጽ የክፍያ ክፍያን ይጠቀማል።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`፣ `jq`፣ Python 3.11 ወይም ከዚያ በኋላ፣ Node.js 24፣ እና የአሁኑ `iroha` CLI።
- ተነባቢ ብቻ Taira መዳረሻ።
- ለመጻፍ የእግር ጉዞ፣ ከ[አስጀምር Iroha](/am/get-started/launch-iroha.md)፣ `./localnet/client.toml` እና Torii በ`http://127.0.0.1:8080` ላይ የመነጨ የአካባቢ አውታረ መረብ።

## እርምጃዎች {#steps}

### 1. ያለ ምስጠራ ፈራሚ Taira ፍቺዎችን ይፈትሹ {#_1-inspect-taira-definitions-without-a-signer}

የንብረት ፍቺዎች ግልጽ ያልሆነ Base58 መታወቂያ፣ የማሳያ ስም፣ የንብረት አሰጣጥ ፖሊሲ፣ የቁጥር ልኬት፣ አማራጭ ተለዋጭ ስም፣ ባለቤት እና አጠቃላይ ብዛት ይይዛሉ። የኮንክሪት ቀሪ ሒሳቡ የያዢውን መለያ እና አማራጭ የውሂብ ቦታ ወሰን ያካትታል።

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
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

በመነጨው ውቅር ውስጥ ካለው የህዝብ ቁልፍ የአካባቢ የፈቃድ ባለቤትን ያውጡ እና ሌላ የተመዘገበ መለያ እንደ ተቀባዩ ይምረጡ። ምንም የግል ቁልፍ አልታተመም።

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
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

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. የቁጥር ፍቺ ይመዝገቡ {#_3-register-a-numeric-definition}

ይህ የአካባቢ-ብቻ መታወቂያ የሚሰራ ቅድመ-ቅጥያ የሌለው Base58 የንብረት ፍቺ አድራሻ ነው። ተለዋጭ ስሙ በሰው ሊነበብ የሚችል `domain.dataspace` ትንበያ ያቀርባል። ልኬት `2` ሁለት ክፍልፋይ አሃዞችን ይፈቅዳል; `--mint-once`ን መተው ነባሪውን `Infinitely` ፖሊሲ ይይዛል።

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

ያንን መታወቂያ በ Taira ላይ እንደገና አይጠቀሙ። ይፋዊ የብሎክቼይን ኔትወርክ ምዝገባ አዲስ ነጠላ ፕሮቶኮል-መደበኛ መታወቂያ፣ ለመተግበሪያዎ የተመደበ ጎራ/ተለዋጭ ስም፣ የክፍያ የገንዘብ ድጋፍ እና የሶፍትዌር ማስፈጸሚያ አካባቢ የንብረት ምዝገባ ፍቃድ ያስፈልገዋል።

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

ከጥፋቱ በኋላ፣ የምንጭ ቀሪ ሒሳብ `64.50`፣ የመድረሻ ቀሪ ሒሳብ `25.50` እና አጠቃላይ ብዛት `90.00` ይጠብቁ።

::: warning የፍቃድ ወሰን

በ Taira ላይ ከቴስትኔት ገንዘብ ድጋፍ አገልግሎቱ የተገኘውን `taira.tx-metadata.json` ያያይዙ እና ለእያንዳንዱ የመጻፍ ክዋኔ `--fee-payer authority` ይጠቀሙ። ምዝገባ እና መስጠት የነቃውን አረጋጋጭ ፈቃዶች ይፈልጋሉ; ማስተላለፍ እና ማጥፋት በምንጩ ቀሪ ሂሳብ ላይ የፍቃድ ዋና ያስፈልገዋል። በቴስትኔት የተደገፈ መለያ በራስ-ሰር ሰጪ አይደለም።

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
- ደረጃ 2 ሆን ብሎ የተመዘገበ የመድረሻ መለያ ይመርጣል። የንብረት መግቢያ `ExplicitOnly` ከሆነ፣ የመድረሻ ቀሪ ሂሳቡን በተፈቀደለት በኩል ያቅርቡ ከማስተላለፉ በፊት ፍሰት. ተመሳሳይ ስም ያለው CLI ጠባቂ መለያ ወይም ቀሪ ሂሳብ አይመዘግብም; ሌላ መመሪያ ከመጨመር ይልቅ ያቋርጣል.
- የተለመደው መመሪያ ከመሳካቱ በፊት ክፍያ አለመቀበል ይከሰታል። ከፋዩን ይምረጡ፣ የአውታረ መረቡን የክፍያ ንብረት ሜታዳታ ይጠቀሙ እና ቀሪ ሂሳቡን ያረጋግጡ።
- ቋሚው የአካባቢ ፍቺ አስቀድሞ ከቀደመው ሩጫ ካለ፣ አዲስ የመነጨ localnet ያስጀምሩ ወይም አሁን ባለው ሁኔታ ይቀጥሉ። የተበላሸ የዘፈቀደ ሕብረቁምፊን በBase58 መታወቂያ በጭራሽ አይተኩ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የንብረት የሕይወት ዑደት ውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust የንብረት ግንባታ ምሳሌዎች በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [ንብረቶች](/am/blockchain/assets.md)
- [መመሪያዎች](/am/blockchain/instructions.md)
- [የፍቃድ ምልክቶች](/am/reference/permissions.md)
- [JavaScript እና TypeScript](/am/guide/tutorials/javascript.md)
