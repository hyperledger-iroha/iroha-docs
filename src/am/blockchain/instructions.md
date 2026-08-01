---
translation_locale: am
translation_source: /blockchain/instructions.md
translation_source_hash: adc3eff9758dd73e9114e78eaa18ddf6271db3bc4042611e1ed6ed1aac226246
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ልዩ መመሪያዎች {#iroha-special-instructions}

በነበረበት ወቅት [እንዴት Iroha ይሠራል](/am/blockchain/iroha-explained), እንዲህ ነው ያልነው Iroha ልዩ መመሪያዎች የዓለም ሁኔታን ለመቀየር ብቸኛው መንገድ ናቸው ። ምን ዓይነት ልዩ መመሪያ አለን? በዚህ ጥናት ውስጥ ያሉትን የቋንቋ-ተኮር መመሪያዎች ካነበቡ ቀደም ሲል ሁለት መመሪያዎችን አይተህ ነበር፦ `Register<Account>` እና `Mint<Numeric>`.

የ Iroha ልዩ መመሪያዎች ሙሉ ዝርዝር ይኸውልዎት

|መመሪያ |መግለጫዎች |
| --------------------------------------------------------- | ------------------------------------------------ |
| [መመዝገብ/ማስወገድ ](#un-register) |አንድ ID መስጠት blockchain ላይ አዲስ አካል. |
| [ሚንት/በርን](#mint-burn)|የቁጥር ንብረቶች ወይም የመድገም ተነሳሽነት። |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |የ blockchain ዕቃዎች ሜታዳታ አዘምን. |
| [SetParameter](#setparameter) |አንድ ሰንሰለት-አጠቃላይ መለኪያ ያዘጋጁ.|
| [Grant/Revoke](#grant-revoke) |ፈቃድ መስጠት ወይም ማስወገድ። |
| [ማስተላለፍ](#transfer) |የባለቤትነት ወይም የንብረት ዋጋ ማስተላለፍ። |
| [የአገር ውስጥ የዋጋ ማስከበሪያ እና ንብረት መቆለፊያዎች ](#native-escrow-and-asset-locks) |የቁጥር ንብረቶችን በፕሮቶኮል ጥበቃ ውስጥ ይዝጉ።|
| [ExecuteTrigger](#executetrigger) |ተነሳሽነቶችን አሂድ። |
| [መዝገብ / ብጁ / ማሻሻል ](#other-instructions) |መዝገብ, ማራዘም, ወይም የስራ ሰዓት ባህሪ ለማሻሻል. |

Iroha ልዩ መመሪያዎች ማጠቃለያ እንጀምር; የትኞቹ ዕቃዎች እያንዳንዱ መመሪያ ሊጠራ ይችላል እና የትኞቹ መመሪያዎች ለእያንዳንዱ ነገር ይገኛሉ.

## ማጠቃለያ {#summary}

ለእያንዳንዱ መመሪያ ይህ መመሪያ ሊሠራባቸው የሚችሉ ዕቃዎች ዝርዝር አለ። ለምሳሌ ፣ የዝውውር ተለዋዋጮች ባለቤትነት ያላቸውን መቁጠሪያ ዕቃዎችን እና ቁጥራዊ ንብረቶችን ይሸፍናሉ ፣ ሲባል ግንባታ ደግሞ የቁጥር ንብረቶችን የሚሸፍን እና ድግግሞሽ የሚያነሳሳ ነው።

አንዳንድ መመሪያዎች መዳረሻን መግለጽ ይጠይቃሉ። ለምሳሌ ያህል፣ ንብረቶችን ከምትተላለፍ ምንጊዜም የትኛው መለያ ላይ እንደሚተላለፉ መግለጽ አለብህ። በሌላ በኩል ደግሞ አንድ ነገር ሲመዘገብ የምትፈልገውን ነገር ብቻ ነው የሚያስፈልገው።

|መመሪያ |ዕቃዎች|መድረሻ |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |የተለመደ ጎራ፣ የውሂብ ቦታ-አልባ ስያሜ እና የመለያ-አልባ ስም ማዋቀር |                      |
| [መመዝገብ/ማስወገድ ](#un-register) |ሂሳቦች፣ የንብረት ትርጉሞች፣ NFTs፣ ሚናዎች፣ መንስኤዎች፣ እኩዮች፣ የጎራ ማስወገጃ |                      |
| [ሚንት/በርን](#mint-burn)|የቁጥር ንብረቶች፣ የመነሻ ድግግሞሽ |ሂሳቦች ወይም መንስኤዎች |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |[ሜታዳታ ](./metadata.md) ያላቸው ዕቃዎች: ጎራዎች, ሂሳቦች, የንብረት ትርጉሞች, NFTs, RWAs, መንስኤዎች |                      |
| [SetParameter](#setparameter) |ሰንሰለት መለኪያዎች |                      |
| [Grant/Revoke](#grant-revoke) | [ሚናዎች, ፍቃድ መለያዎች](/am/blockchain/permissions.md) |ሂሳቦች ወይም ሚናዎች |
| [ማስተላለፍ](#transfer) |ጎራዎች፣ የንብረት ትርጉሞች፣ ቁጥራዊ ንብረቶች፣ NFTs |መለያዎች |
| [የአገር ውስጥ የዋጋ ማስከበሪያ እና ንብረት መቆለፊያዎች ](#native-escrow-and-asset-locks) |ቁጥራዊ የዋጋ ማስያዣዎች፣ የዋጋ መቆለፊያዎች፣ የማይታወቁ የዋጋ ማረጋገጫ ግዴታዎች |ገዢዎች፣ መዳረሻዎች ወይም አለመግባባት |
| [ExecuteTrigger](#executetrigger) |ማነቃቂያዎች|                      |
| [መዝገብ / ብጁ / ማሻሻል ](#other-instructions) |መዝገቦች፣ ለተፈፃሚው የተወሰኑ ጥቅማጥቅሞች፣ ለፈጻሚው ማሻሻያዎች |                      |

በተጨማሪም ISI የሚመለከቱበት ሌላ መንገድ አለ ፣ በሚነካው መለያ ዕቃ አንፃር:

| ግብ|መመሪያ |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|መለያ |የመመዝገብ/የማስወገድ ሂሳቦች፣ ተቀባይነት ያላቸው ንብረቶች፣ የማዘመን ሂሳብ ሜታዳታ፣ ፈቃድ መስጠት/መሰረዝ እና ሚና |
|ጎራ |የጎራ ማዋቀር፣ ጎራዎችን አለመመዝገብ፣ የጎራ ባለቤትነት ማስተላለፍ፣ የጎራ ሜታዳታዎችን ማዘመን |
|የንብረት ትርጉም |የምዝገባ/መዘገብ የማያቋርጡ ትርጓሜዎች፣ የባለቤትነት ማስተላለፍ፣ ሜታዳታ ማዘመን |
|ንብረቶች|የወይን ጠጅ/የማቃጠል ቁጥራዊ ብዛት፣ የዝውውር ቁጥር |
|የሽያጭ ገንዘብ|የተላከውን ክፍያ ይክፈቱ፣ ይቀበሉ፣ ምልክት ያድርጉ፣ መለቀቅ፣ መሰረዝ፣ አለመግባባት መፍታት፣ ማውጣት ወይም የአገር ውስጥ የጥበቃ መዝገቦችን ማጠናቀቅ |
|NFT |መመዝገብ/መመዝገብ ማስወገድ NFTs, የባለቤትነት ማስተላለፍ, የዘመነ ሜታዳታ |
|RWA |ዕቃዎችን መመዝገብ፣ የመተላለፍ ብዛት፣ ማቆየት/መለቀቅ፣ ማቀዝቀዝ/ማቀዝቀዣ ማስወገድ፣ መለዋወጥ፣ ማዋሃድ፣ ሜታዳታዎችን ማዘመን እና መቆጣጠሪያዎች |
|ማነቃቂያ |መመዝገብ/መመዝገብ ማስወገድ፣ የወር አበባ/የማቃጠል አስነሳሽነት ድግግሞሽ፣ አስነሳሽነትን ለማስፈፀም፣ የዘመነ አስነሳሽ ሜታዳታ |
|ዓለም |መመዝገብ/መመዝገብን ማስወገድ የእኩዮች እና ሚናዎች፣ መለኪያዎችን ማዘጋጀት፣ አስፈፃሚውን ማሻሻል |

## CLI ምሳሌዎች {#cli-examples}

በዚህ ገጽ ውስጥ ያሉ ምሳሌዎች እርስዎ ከቅድመ-መንገድ Iroha የስራ ቦታ ትዕዛዞችን ነባሪው አካባቢያዊ ደንበኛ ውቅር ላይ እያከናወኑ ነው ብለው ያስባሉ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

የ `iroha` ባይናሪ ከተጫነ በምትኩ `iroha --config ./defaults/client.toml` ይጠቀሙ. ከታች ያሉትን ቦታ መያዣዎች ከአውታረ መረብዎ እሴቶች ጋር ይተካሉ:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

የህዝብን ዒላማ ሲያደርጉ Taira የሙከራ አውታረመረብ, አንድ መጠቀም Taira ክፍያ የሚከፈልባቸው ምሳሌዎችን ከማሄድዎ በፊት የቧንቧ ረዳት ከ [Testnet ን ያግኙ XOR ላይ Taira](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) እንደ `taira_faucet_claim.py`, ከዚያም የይገባኛል ጥያቄ የሙከራ ኔት XOR ከቧንቧው

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

በቧንቧው የተደገፈው ንብረት ከተገለጠ በኋላ ግብይቶችን ለመፃፍ የሚያስፈልጉትን የጋዝ ሀብት ሜታዳታዎች ያያይዙ:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` ጎራዎችን እና SNS ኪራይ ለመፍጠር የተለመደ የመጀመሪያ-ልቀት መንገድ ነው ። ትክክለኛውን የመረጃ ቦታ ፣ ባለቤት ፣ የኪራይ ጊዜ እና የጥቅስ ጥበቃን በግልጽ ይያዛል ፣ ከዚያ ሁሉንም አስፈላጊ ሁኔታ በአቶሚካዊ መንገድ ይፈጥራል ወይም ያጠፋል ። የተረጋገጠውን `POST /v1/aliases/setup/plan` መጨረሻ ነጥብ ወይም ተመጣጣኝ የሆነውን CLI የስራ ፍሰት ይጠቀሙ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

ዓላማው እና ዕቅዱ ምስጢራዊ ያልሆኑ ናቸው ፣ ግን የደረጃ ምልክቶችን ይተግብሩ እና ከተዋቀረው መለያ ጋር መደበኛ ግብይት ያቀርባል ። አንድ ዕቅድ ሰንሰለት ፣ ስልጣን ፣ የቀጥታ ሁኔታ አናከር እና ጊዜ ገደብ ጋር የተገናኘ ነው ፣ በሌላ አውታረመረብ ላይ በጭራሽ እንደገና አይጠቀሙ።

## (Un)መመዝገብ {#un-register}

መመዝገብ እና አለመመዝገብ በብሎክቼይን ላይ ለሚገኝ አዲስ አካል ID ለመስጠት የሚያገለግሉ መመሪያዎች ናቸው ።

ሊመዘገቡ የሚችሉ ነገሮች ሁሉ `Registrable` እና `Identifiable` ናቸው፣ ነገር ግን `Identifiable` የሆኑት ነገሮች ሁሉ `Registrable` አይደሉም። አብዛኛዎቹ ነገሮች በቀጥታ ይመዘገባሉ፣ ነገር ግን በአንዳንድ ሁኔታዎች በብሎክቼይን ውስጥ ያለው ውክልና በጣም ብዙ መረጃዎች አሉት ። ለደህንነት እና አፈፃፀም ምክንያቶች ለእንደዚህ ዓይነት የውሂብ መዋቅሮች (ለምሳሌ `NewAccount`) ገንቢዎችን እንጠቀማለን ፣ እና የእኩዮች ምዝገባ የተወሰነ የባለቤትነት ማረጋገጫ መመሪያ አለው ። እንደ ደንብ ፣ ሊመዘገቡ የሚችሉ ነገሮች ሁሉ እንዲሁ ያልተመዘገቡ ሊሆኑ ይችላሉ ፣ ግን ያ ከባድ እና ፈጣን ደንብ አይደለም።

መለያዎችን ፣ የንብረት ትርጓሜዎችን ፣ NFTs ፣ እኩዮችን ፣ ሚናዎችን እና ማነቃቂያዎችን መመዝገብ ይችላሉ ። የጎራ ቅንብር `EnsureAlias` ን ይጠቀማል ፤ ጥሬው `Register::Domain` ጥቅማጥቅም ለጄኔሲስ / ቡትስትራፕ የተጠበቀ ነው ። የእኩዮች ምዝገባ ለባልደረባ ቁልፍ ባለቤትነት ማረጋገጫ የሚሸከም `RegisterPeerWithPop` ን ይጠቀማል። በድርጅት ስሞች ላይ ስለተጣሉ ገደቦች ለማወቅ የእኛን [ ስም ማውጣት ኮንቬንሽኖችን](/am/reference/naming.md) ይመልከቱ ።

RWA ክፍሎች የተሰየመውን `RegisterRwa` መመሪያ በመጠቀም ይፈጠራሉ። የአሁኑ ኮድ የ `UnregisterRwa` መመሪያ አይገልጽም; የሚወክለውን ብዛት ለማውጣት `RedeemRwa` ይጠቀሙ።

::: info

በ [ ጀነሲስ ብሎክዎን ](/am/guide/configure/genesis.md) በ `genesis.json` ውስጥ ለማዘጋጀት በሚወስኑበት መንገድ ላይ በመመርኮዝ (በተለይም የመፈቃደሪያ ቶከኖችን ምዝገባን ያካትታሉ ወይም አያካትቱም) ፣ ሂሳቡን ለማስመዝገብ ሂደት በጣም የተለየ ሊሆን እንደሚችል ልብ ይበሉ ። በአጠቃላይ ፣ በዚህ መንገድ ማጠቃለል እንችላለን-

- በአደባባይ ባሉ blockchain ውስጥ ማንኛውም ሰው መለያ መመዝገብ የሚችል መሆን አለበት።
- አንድ የግል blockchain ውስጥ, መለያዎች ለመመዝገብ ልዩ ሂደት ሊኖር ይችላል. አንድ የተለመደ የግል Blockchain ውስጥ, ማለትም መለያዎችን ለመመዝገብ ምንም ልዩ ሂደቶች ያለ አንድ blockchain ውስጥ, ሌላ መለያ ለመመዝገብ አንድ መለያ ያስፈልግዎታል.

[ የግል እና የህዝብ ብሎክ ሰንሰለቶች ](/am/guide/configure/modes.md) ሲወዳደሩ እነዚህን ልዩነቶች በዝርዝር እንወያያለን ።

:::

::: info

አንድ እኩዮችን መመዝገብ በአሁኑ ጊዜ ወደ አውታረመረብው የተቀመጠው የመጀመሪያው የታመነ የእኩዮት አካል ያልነበሩትን እኩዮች ለማከል ብቸኛው መንገድ ነው ።

:::

የብሎክቼይን ዕቃዎችን ለመመዝገብ ለቋንቋ የተወሰነ መመሪያ ይጠቀሙ:

|ቋንቋ |መመሪያ |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |ጎራዎችን ለማዘጋጀት እና ሂሳቦችን እና ንብረቶችን ለመመዝገብ [Iroha CLI](/am/get-started/operate-iroha-via-cli.md) ን ይጠቀሙ። |
|Rust |የ [Rust መመሪያ ይጠቀሙ](/am/guide/tutorials/rust.md). |
|Kotlin/ጃቫ |የ [Kotlin/ጃቫ ትምህርት ይጠቀሙ](/am/guide/tutorials/kotlin-java.md). |
|Python |የ [Python መመሪያ ይጠቀሙ](/am/guide/tutorials/python.md). |
|JavaScript/TypeScript |የ [JavaScript/TypeScript መመሪያ ይጠቀሙ ](/am/guide/tutorials/javascript.md). |

መደበኛ ጎራ ማዋቀር እቅድ እና ተግባራዊ, ከዚያም ከአሁን በኋላ አስፈላጊ አይደለም ጊዜ ጎራ ለማስመዝገብ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

የመመዝገብና የማስወገድ ሂሳቦች

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

የመመዝገብ እና የማስወገድ የንብረት ትርጓሜዎች

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

መመዝገብ እና መዝገብ ማስወገድ NFTs ። NFT ምዝገባ ይዘቱን JSON ከ መደበኛ ግብዓት ያነባል-

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

የመመዝገብና የማስወገድ ሚና፦

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

መዝገብ እና ማስወገድ አስነሳሾች. አስነሳሽነት ምዝገባ ወይ የተጠናከረ IVM ባይት ኮድ ወይም ተከታታይ መመሪያ ዝርዝር ያስፈልገዋል. ይህ ምሳሌ የ `Log` ትዕዛዝ ከ CLI ጋር ይገነባል እና ወደ አስነሳሽነቱ ምዝገባ ያመራዋል:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

BLS ቁልፉን እና PoP ቁልፉን ከ `kagami` ጋር ይፍጠሩ ፣ እርስዎ ቀድሞውኑ ከሌላቸው:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## ሜንት/በርን {#mint-burn}

ማጨስ እና ማቃጠል የቁጥር ንብረቶችን ሊያመለክት ይችላል እንዲሁም የተወሰኑ ድግግሞሾችን ያካሂዳል ። አንዳንድ ንብረቶች እንደ የማይጨሱ ሊገለጹ ይችላሉ ፣ ይህም ማለት ከተመዘገቡ በኋላ አንድ ጊዜ ብቻ ማጨስ ይችላሉ።

ንብረቶች በተወሰነ ሂሳብ ላይ ይለቀቃሉ ፣ ብዙውን ጊዜ መጀመሪያ ላይ ንብረቱን ያስመዘገቡበት። የንብረት መጠኖች አሉታዊ አይደሉም, ስለዚህ አንድን ንብረት `$-1.0` በጭራሽ ማግኘት አይችሉም ወይም አሉታዊውን መጠን ማቃጠል እና የወርቅ ምንጣፍ ማግኘት ይችላሉ.

ለ Mint Blockchain ንብረቶች የቋንቋ-ተለይ መመሪያ ይጠቀሙ:

- [CLI](/am/get-started/operate-iroha-via-cli.md)
- [Rust](/am/guide/tutorials/rust.md)
- [Kotlin/ጃቫ](/am/guide/tutorials/kotlin-java.md)
- [Python](/am/guide/tutorials/python.md)
- [JavaScript/TypeScript](/am/guide/tutorials/javascript.md)

የሚቃጠሉ ንብረቶች የሚከተሉት ናቸው፦

- [CLI](/am/get-started/operate-iroha-via-cli.md)
- [Rust](/am/guide/tutorials/rust.md)

የቁጥር ሀብቶች:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

የሜይንት እና የእሳት ማቃጠያ ተደጋጋሚነት:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## ማስተላለፍ {#transfer}

ዝውውሮች በሂሳብ መካከል ባለቤትነት ወይም እሴት ይንቀሳቀሳሉ ። የጄኔሪክ ዝውውር ተለዋዋጮች ጎራዎችን ፣ የንብረት ትርጓሜዎችን ፣ ቁጥራዊ ንብረቶችን እና NFTs ያካትታሉ። RWA ብዛት እንቅስቃሴ በ `TransferRwa` እና `ForceTransferRwa` ውስጥ የተገለጹትን ልዩ መመሪያዎች ይጠቀማል [Real-World Assets](/am/blockchain/rwas.md).

ይህን ለማድረግ ሂሳቡን መስጠት ያስፈልጋል [ንብረቶችን ለማስተላለፍ ፈቃድ](/am/reference/permissions.md). ንብረቶችን እንዴት ማስተላለፍ እንደሚቻል ምሳሌን ይመልከቱ [CLI](/am/get-started/operate-iroha-via-cli.md) ወይም [Rust](/am/guide/tutorials/rust.md).

የቁጥር ንብረቶችን ማስተላለፍ

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

የዝውውር ጎራ ፣ የአክሲዮን ትርጉም እና NFT ባለቤትነት:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## የአገር ውስጥ የዋስትና እና ንብረት መቆለፊያዎች {#native-escrow-and-asset-locks}

የአገር ውስጥ የኤስኮር መመሪያዎች በሪፖርተር-አስተዳደሩ ፕሮቶኮል ጥበቃ ውስጥ ቁጥራዊ ንብረቶችን ያቆማሉ ። ለገበያ ቅጥ ቀረጻ ፣ ለአጠቃላይ የንብረት መቆለፊያዎች እና ለማይታወቁ የተጠበቁ ኤስኮር ፍሰቶች ጥቅም ላይ ይውላሉ ።

የገበያ ቦታ የኤስኮር አጠቃቀም `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, እና `ResolveEscrowDispute`. አጠቃላይ የንብረት መቆለፊያዎች አጠቃቀም `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, እና `ExpireAssetLock`. የማይታወቁ ኤስሮዎች የገበያውን የህይወት ዑደት የሚያንፀባርቁ ናቸው `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, እና `ResolveAnonymousEscrowDispute`.

እነዚህ ISIs በአሁኑ ጊዜ የመጀመሪያ ደረጃ ያላቸው አይደሉም CLI ትዕዛዞች. SDK ገንቢዎች ወይም ተከታታይ መመሪያ ጥቅማጥቅሞች, እና ተመልከት [የአገር ውስጥ ንብረት ማስከበሪያ](/am/blockchain/escrow.md) ለህይወት ዑደት ዝርዝሮች፣ ፍቃዶች፣ ጥያቄዎች፣ ክስተቶች እና Rust ምሳሌዎች።

## የገንዘብ ድጋፍ/የማስወገድ መብት {#grant-revoke}

ለሂሳብ [ ፈቃዶች እና ሚናዎች ](permissions.md) የገንዘብ ድጋፍ እና የማስረዝ መመሪያ ጥቅም ላይ ይውላል ።

`Grant` ለተጠቃሚ አንድ ነጠላ ፈቃድ ወይም የተወሰኑ ፍቃዶችን ("አንድ ሚና") በቋሚነት ለመስጠት ጥቅም ላይ ይውላል ። የተሰጡ ሚናዎች እና ፈቃዶች ሊወገዱ የሚችሉት በ `Revoke` መመሪያ ብቻ ነው። እንደዚሁም እነዚህ መመሪያዎች በጥንቃቄ መጠቀም አለባቸው።

በሂሳብ ላይ ሚና መስጠት እና መሰረዝ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

የፈቃድ ማስረጃዎችን መስጠት እና መሰረዝ። የፍቃድ ትዕዛዞች አንድ ፍቃድ ዕቃ ከ መደበኛ ግብዓት ያነባሉ-

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

በአንድ ሚና ላይ ፈቃድ መስጠት እና መሰረዝ:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

እነዚህ መመሪያዎች [ ሜታዳታ](/am/blockchain/metadata.md) ነገርን ያዘምኑ። አንድ የሜታዳታ ማስገቢያ ለማስገባት ወይም ለመተካት `SetKeyValue` ን ይጠቀሙ እና አንዱን ለመሰረዝ `RemoveKeyValue` ።

ሜታዳታ `set` ትዕዛዞች መደበኛ ግብዓት ከ JSON ዋጋ ያነባሉ:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

ተመሳሳይ ንድፍ ለሂሳብ, ለንብረት ትርጉሞች, NFTs, RWAs እና ለተፈታተኞቹ ይገኛል:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` በሥራ ላይ የዋለው የውሂብ ሞዴል እና አስፈፃሚው የተጋለጡ ሰንሰለት-አጠቃላይ መለኪያዎችን ይለውጣል.

ነጠላ መለኪያ JSON ዕቃን በመተላለፍ መደበኛ ግብዓት ላይ አንድ መለኪያ ያዘጋጁ:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

ይህ መመሪያ [ ማነቃቂያዎችን ](./triggers.md) ለማስፈጸም ጥቅም ላይ ይውላል.

CLI አስነሳሾችን መመዝገብ እና አስነሳሽነት አፈፃፀም ክስተቶች በቀጥታ መመዝገብ ይችላሉ. ይህ የ `execute trigger` ትዕዛዝ አይሰጥም, ስለዚህ አንድ መመሪያ ለማቅረብ `ExecuteTrigger` መመሪያ, በ SDK ወይም በተፈፃሚ መሳሪያ ተከታታይ የሆነ `InstructionBox` ያመነጩ እና የተገኘው JSON ቅደም ተከተል በ `ledger transaction stdin` በኩል ያስተላልፉ

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## ሌሎች መመሪያዎች {#other-instructions}

Iroha በተጨማሪም ለስራ ሰዓት እና ለተፈፃሚው ውህደት ዝቅተኛ ደረጃ መመሪያዎችን ያጋልጣል:

- `Log`: በሚፈፀምበት ጊዜ መዝገብ ማስገቢያ ያወጣሉ
- `CustomInstruction`: ለሥራ አስፈፃሚው የተለዩ JSON ጥቅማጥቅሞች ይሸከሙ
- `Upgrade`: የአስፈፃሚ ማሻሻያ ንቁ ማድረግ

`Log` መመሪያ ከፒንግ ረዳት ጋር ያቅርቡ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

አንድ ብጁ አስፈጻሚ መመሪያ እንደ ተከታታይ `InstructionBox` ያቅርቡ. የ ጥቅል ጭነት ቅርጸት አስፈፃሚ-ተኮር ነው, ስለዚህ መመሪያን የሚዛመዱ ጋር ማመንጨት SDK ወይም አስፈጻም መሣሪያ:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

አስፈፃሚውን ከተጠናቀቀው IVM የባይት ኮድ ፋይል አሻሽል

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
