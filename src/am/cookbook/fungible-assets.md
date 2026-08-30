---
translation_locale: am
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 669b5a1c12e9ab6ffb64e149148993e7b924feb29c6fa4db883a2065f58ecd7e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ተለዋዋጭ ሀብቶች {#fungible-assets}

## ውጤቱ {#outcome}

በቀጥታ Taira የንብረት ትርጓሜዎችን ይፈትሹ እና በተፈጠረው አካባቢያዊ አውታረመረብ ላይ መዝገብ, ሙጫ, ዝውውር, መቃጠል እና ሚዛን ማረጋገጫ ፍሰት ያጠናቅቁ. የምግብ አዘገጃጀት መመሪያው የካኖኒክ ያልተስተካከለ Base58 የንብረት ትርጉም IDs ፣ የጎራ ብቃት ያላቸው ቅጽል ስሞች ፣ ጎራ የሌለው I105 ሂሳብ IDs እና ግልፅ ክፍያ ይጠቀማል ።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`, `jq`, Python 3.11 ወይም ከዚያ በኋላ, Node.js 24, እና የአሁኑ `iroha` CLI.
- Taira የንባብ-ብቻ መዳረሻ።
- ለመጻፍ የዝግጅት አቀራረብ ከ [የተፈጠረ አካባቢያዊ አውታረመረብ ይጀምሩ Iroha](/am/get-started/launch-iroha.md)፣ በ `./localnet/client.toml` እና Torii ላይ በ `http://127.0.0.1:8080`።

## እርምጃዎች {#steps}

### Taira ትርጓሜዎችን ያለ ፊርማ መመርመር። {#_1-inspect-taira-definitions-without-a-signer}

የንብረት ትርጓሜዎች ግልጽ ያልሆነ Base58 ID, የማሳያ ስም አላቸው, የማጣቀሻ ፖሊሲ, የቁጥር ስኬል, አማራጭ ቅጽል ስም, ባለቤት እና አጠቃላይ ብዛት. ተጨባጭ ሚዛኑ ደግሞ ባለቤቱ መለያ እና አማራጭ የውሂብ ቦታን ያካትታል.

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

JavaScript ቅጹን በ `node taira-assets.mjs` ይጠቀሙ። የህዝብ ንብረት IDs ባዶ Base58 እሴቶች ናቸው; እንደ `cookbook_credit#wonderland.universal` ያሉ ሊነበቡ የሚችሉ እሴቶች ከእነዚህ ውስጥ ወደ አንዱ የሚፈታ ስያሜ ነው IDs.

### 2. የአካባቢውን ባለስልጣንና መድረሻ ማዘጋጀት። {#_2-prepare-the-local-authority-and-destination}

ከተፈጠረው ውቅር ውስጥ ካለው የህዝብ ቁልፍ የአከባቢውን ባለስልጣን ይምረጡ እና እንደ ተቀባዩ ሌላ የተመዘገበ መለያ ይምረጡ ። የግል ቁልፍ አይታተምም።

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

### 3. የቁጥር ትርጉም መመዝገብ። {#_3-register-a-numeric-definition}

ይህ አካባቢያዊ-ብቻ ID ትክክለኛ ያልተስተካከለ Base58 ሀብት መግለጫ አድራሻ ነው ። ስሙ በሰዎች ሊነበብ የሚችል `domain.dataspace` ትንበያ ያቀርባል ። ልኬት `2` ሁለት ጥፍሮች ይፈቅዳል ፣ `--mint-once` ን ማስወገድ ነባሪውን `Infinitely` ፖሊሲ ይጠብቃል ።

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

ID ን በ Taira ላይ እንደገና አይጠቀሙ። የህዝብ አውታረመረብ ምዝገባ አዲስ ቀኖናዊ ID ፣ ለጥያቄዎ የተመደበ ጎራ / ቅጽል ስም ፣ የክፍያ የገንዘብ ድጋፍ እና የአሂድ ጊዜ ንብረት ምዝገባ ፈቃድ ይጠይቃል።

### 4. ሙጫ፣ ማስተላለፍና ማቃጠል {#_4-mint-transfer-and-burn}

ሁሉም የጻፍ ትዕዛዞች ባለሥልጣኑን እንደ ክፍያ ሰጪ በግልጽ ይመርጣሉ። CLI ከመፈረምዎ በፊት ትክክለኛውን ግብይት ይጠቅሳል እና በነባሪነት ይጠብቃል ።

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

ከተቃጠለ በኋላ ምንጩን ሚዛናዊ ማድረግ `64.50`, የመድረሻ ሚዛን `25.50`, እና አጠቃላይ ብዛት `90.00`.

::: warning የተፈቀደለት ገደብ

በ Taira ላይ ከፋይሌት የተገኘውን `taira.tx-metadata.json` ያያይዙ እና ለእያንዳንዱ ጽሑፍ `--fee-payer authority` ይጠቀሙ። ምዝገባ እና ቅርጽ ማውጣት የንቃት ማረጋገጫ ሰጪው ፍቃዶችን ይጠይቃሉ; ማስተላለፍ እና መቃጠል የመነሻ ሚዛኑን በተመለከተ ሥልጣን ይጠይቃሉ። በፋይሌት የገንዘብ ድጋፍ የሚደረግ አካውንት በራስ-ሰር ባለቤት አይደለም ።

:::

## ያረጋግጡ {#verify}

ሁለቱንም ተጨባጭ ቅናሾች እና ከዚያ ፍቺን ያንብቡ ። እነዚህ ከመንግስት በኋላ ጥያቄዎች የስኬት መስፈርት ናቸው ፣ የቀረበው ደረሰኝ በራሱ አይደለም ።

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

የአተገባበር ማረጋገጫዎች የቁጥር እሴቶችን እንደ ቋሚ ነጥብ አሥረኛዎች እንጂ በሁለትዮሽ ተንሳፋፊ ነጥብ እሴቶች ሊወዳደሩ እና ID ትርጉምን እንዲሁም ሂሳብን ሊያረጋግጡ ይገባል ።

## ችግሮችን መፍታት {#troubleshooting}

- ID የያዘው `#` ቅጽል ስያሜ ወይም የኮንክሪት ሚዛን ቃል በቃል ነው ፣ የካኖኒክ የአክሲዮን ትርጉም አይደለም ID. ባዶውን Base58 እሴት ከ `--definition` ጋር ይጠቀሙ ፣ ወይም የተገደበ ቅጽል ስም ከ `--definition-alias` ጋር ያስገቡ።
- `Scale` ስህተቶች ማለት አንድ ብዛት ትርጉም ከሚፈቅደው በላይ ብዙ ቁጥሮችን ያካተተ ነው።
- `Mintability` ውድቅ ማለት የ `Once` ፣ `Not` ወይም `Limited(n)` ፖሊሲ ማጭድ ተጠናቋል ወይም አልተፈቀደለትም ማለት ነው ። ታሪክን እንደገና አይፃፉ; በገለጸው ጥያቄ የተመለሰውን ፖሊሲ ይጠቀሙ።
- ደረጃ 2 ሆን ተብሎ የተመዘገበ መድረሻ መለያ ይመርጣል. `ExplicitOnly`, የመዳረሻ ሚዛኑን ከማስተላለፍ በፊት በተፈቀደ ፍሰት በኩል ማቅረብ። CLI ጠባቂው ሂሳብ ወይም ሚዛን አይመዘገብም; ሌላ መመሪያ ከመጨመር ይልቅ ይወርዳል.
- የክፍያ ውድቀት የተለመደው መመሪያ ስኬታማ ከመሆኑ በፊት ይከሰታል. ክፍያ ሰጪውን ይምረጡ, የአውታረ መረቡ የክፍያው ሀብት ሜታዳታ ይጠቀሙ እና ቀሪውን ያረጋግጡ.
- ቋሚው አካባቢያዊ ትርጓሜ ቀደም ባለው ሩጫ ውስጥ ቀድሞውኑ የሚገኝ ከሆነ አዲስ የተፈጠረውን አካባቢያዊ አውታረ መረብ ይጀምሩ ወይም ነባር ሁኔታውን ይቀጥሉ ። የተበላሸ የዘፈቀደ ሰንጠረዥን ለ Base58 ID በጭራሽ አይተኩ ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [የተጣራ ግዴታ ላይ የሃብት የሕይወት ዑደት ውህደት ሙከራዎች ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust የተጣራ ግዴታ ላይ ያሉ የንብረት ግንባታዎች ምሳሌዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [ንብረቶች](/am/blockchain/assets.md)
- [መመሪያዎች](/am/blockchain/instructions.md)
- [የፈቃድ ማስያዣዎች](/am/reference/permissions.md)
- [JavaScript እና TypeScript ](/am/guide/tutorials/javascript.md)
