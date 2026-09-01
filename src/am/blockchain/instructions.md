---
translation_locale: am
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha የመመሪያ ክዋኔዎች {#iroha-special-instructions}

ስለ [Iroha እንዴት እንደሚሰራ](/am/blockchain/iroha-explained) ስናወራ Iroha የዓለም መንግስትን ለመለወጥ ብቸኛው መንገድ የማስተማሪያ ስራዎች ናቸው ብለናል። ስለዚህ ምን ዓይነት ትምህርት ነው ክዋኔዎች አሉን? በዚህ አጋዥ ስልጠና ውስጥ ቋንቋ-ተኮር መመሪያዎችን ካነበቡ፣ ሁለት መመሪያዎችን አስቀድመው አይተዋል `Register<Account>` እና `Mint<Numeric>`።

የ Iroha የማስተማሪያ ስራዎች ሙሉ ዝርዝር ይኸውና -

|መመሪያ|መግለጫዎች|
| --------------------------------------------------------- | ------------------------------------------------ |
|[ይመዝገቡ/ይመዝገቡ](#un-register)|በብሎክቼይን ላይ ለአዲስ አካል መታወቂያ ይስጡ።|
|[Mint/Burn](#mint-burn)|ሚንት/አቃጥል የቁጥር ንብረቶች ወይም ድግግሞሾችን ቀስቅሰዋል።|
|[SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue)|የብሎክቼይን ነገር ሜታዳታ ያዘምኑ።|
|[SetParameter](#setparameter)|ሰንሰለት-ሰፊ መለኪያ ያዘጋጁ.|
|[Grant/Revoke](#grant-revoke)|ፈቃዶችን እና ሚናዎችን ይስጡ ወይም ያስወግዱ።|
|[ማስተላለፍ](#transfer)|የባለቤትነት ወይም የንብረት ዋጋን ያስተላልፉ።|
|[ቤተኛ escrow እና የንብረት መቆለፊያዎች](#native-escrow-and-asset-locks)|በፕሮቶኮል ጥበቃ ውስጥ የቁጥር ንብረቶችን ይቆልፉ።|
|[የአቶሚክ የግል የፋይናንስ ግብይት ስምምነት](#atomic-private-settlement)|ሚስጥራዊ የፕሮቶኮል ውሂብ ቡድኖችን እና የአቶሚክ ቅርቅቦችን ያስተዳድሩ።|
|[ExecuteTrigger](#executetrigger)|ቀስቅሴዎችን ያስፈጽሙ።|
|[Log/Custom/Upgrade](#other-instructions)|የሶፍትዌር ማስፈጸሚያ አካባቢ ባህሪን ይግቡ፣ ያራዝሙ ወይም ያሻሽሉ።|

በ Iroha የማስተማሪያ ስራዎች ማጠቃለያ እንጀምር; እያንዳንዱ መመሪያ ምን ዓይነት ዕቃዎች ሊጠራ ይችላል እና ለእያንዳንዱ ነገር ምን አይነት መመሪያዎች ይገኛሉ.

## ማጠቃለያ {#summary}

ለእያንዳንዱ መመሪያ, ይህ መመሪያ ሊሠራ የሚችልባቸው የነገሮች ዝርዝር አለ. ለምሳሌ፣ የዝውውር ልዩነቶች በባለቤትነት ሊኖሩ የሚችሉ የብሎክቼይን መዝገብ ዕቃዎችን እና የቁጥር ንብረቶችን ይሸፍናሉ፣ ማውጣት ደግሞ የቁጥር ንብረቶችን ይሸፍናል እና ድግግሞሾችን ያስነሳል።

አንዳንድ መመሪያዎች መድረሻ እንዲገለጽ ይጠይቃሉ። ለምሳሌ, ንብረቶችን ካስተላለፉ, ሁልጊዜ ወደ የትኛው መለያ እንደሚያስተላልፉ መግለጽ ያስፈልግዎታል. በሌላ በኩል, የሆነ ነገር ሲመዘገቡ, የሚያስፈልግዎ ነገር መመዝገብ የሚፈልጉት ነገር ብቻ ነው.

|መመሪያ|ነገሮች|መዳረሻ|
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
|[EnsureAlias](#ensurealias)|ተራ ጎራ፣ ዳታ ስፔስ-ተለዋጭ ስም እና የመለያ-ተለዋጭ ስም ማዋቀር|                      |
|[ይመዝገቡ/ይመዝገቡ](#un-register)|መለያዎች፣ የንብረት ፍቺዎች፣ NFTs፣ ሚናዎች፣ ቀስቅሴዎች፣ የአውታረ መረብ እኩዮች; የጎራ ማስወገድ|                      |
|[Mint/Burn](#mint-burn)|የቁጥር ንብረቶች፣ ድግግሞሾችን ቀስቅሴ|መለያዎች ወይም ቀስቅሴዎች|
|[SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue)|[ሜታዳታ](./metadata.md) ያላቸው ነገሮች ጎራዎች፣ መለያዎች፣ የንብረት ፍቺዎች፣ NFTs፣ RWAs፣ ቀስቅሴዎች|                      |
|[SetParameter](#setparameter)|ሰንሰለት መለኪያዎች|                      |
|[Grant/Revoke](#grant-revoke)|[ሚናዎች፣ የፍቃድ ምልክቶች](/am/blockchain/permissions.md)|መለያዎች ወይም ሚናዎች|
|[ማስተላለፍ](#transfer)|ጎራዎች፣ የንብረት ፍቺዎች፣ የቁጥር ንብረቶች፣ NFTs|መለያዎች|
|[ቤተኛ escrow እና የንብረት መቆለፊያዎች](#native-escrow-and-asset-locks)|የቁጥር ንብረት escrows፣ የንብረት መቆለፊያዎች፣ ስም-አልባ escrow ክሪፕቶግራፊያዊ ኮሚትመንቶች|ገዢዎች፣ መድረሻዎች ወይም የክርክር ክፍፍል|
|[የአቶሚክ የግል የፋይናንስ ግብይት ስምምነት](#atomic-private-settlement)|በመንገድ ወሰን ያላቸው ሚስጥራዊ የፕሮቶኮል ውሂብ ቡድኖች፣ የፖሊሲ ሽክርክሪቶች፣ የተጠናቀቁ ጥቅሎች እና የማቋረጥ ጠቋሚዎች|                      |
|[ExecuteTrigger](#executetrigger)|ቀስቅሴዎች|                      |
|[Log/Custom/Upgrade](#other-instructions)|ምዝግብ ማስታወሻዎች፣ አስፈፃሚ-ተኮር ጭነቶች፣ አስፈፃሚ ማሻሻያዎች|                      |

ከሚነኩት የብሎክቼይን መዝገብ ነገር አንፃር ISI ን የሚመለከትበት ሌላ መንገድም አለ -

|ዒላማ|መመሪያዎች|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|መለያ|መለያዎችን ይመዝገቡ/ይመዝገቡ፣ ንብረቶችን ይቀበሉ፣ የመለያ ሜታዳታን ያዘምኑ፣ ፈቃዶችን እና ሚናዎችን ይስጡ/ይሰርዙ|
|ጎራ|የጎራ ማዋቀርን ያረጋግጡ፣ ጎራዎችን ይመዝገቡ፣ የጎራ ባለቤትነትን ያስተላልፉ፣ የጎራ ሜታዳታን ያዘምኑ|
|የንብረት ፍቺ|ፍቺዎችን ይመዝገቡ/ይመዝገቡ፣ ባለቤትነትን ያስተላልፉ፣ ሜታዳታን ያዘምኑ|
|ንብረት|ሚንት / ማቃጠል የቁጥር ብዛት ፣ የቁጥር ብዛት ያስተላልፉ|
|Escrow|ክፍያ የተላከውን ክፍያ ይክፈቱ፣ ይቀቀቃሉ፣ ይሰርዙ፣ መጨቃጨቅ፣ መፍታት፣ ያውርዱ ወይም ጊዜው ያለፈባቸው ቤተኛ የጥበቃ መዝገቦችን ያበቃል|
|NFT|ይመዝገቡ/ይመዝገቡ NFTs፣ ባለቤትነትን ያስተላልፉ፣ ሜታዳታን ያዘምኑ|
|RWA|ዕጣዎችን ይመዝገቡ ፣ ብዛት ያስተላልፉ ፣ ይያዙ / ይልቀቁ ፣ ያቀዘቅዙ / ያላቅቁ ፣ ማስመለስ ፣ ማዋሃድ ፣ ሜታዳታ እና መቆጣጠሪያዎችን ያዘምኑ|
|ቀስቅሴ|ይመዝገቡ/ይመዝገቡ፣ ሚንት/ማቃጠል ቀስቅሴ ድግግሞሽ፣ ቀስቅሴ ያስፈጽሙ፣ ቀስቅሴ ሜታዳታን ያዘምኑ|
|ዓለም|የአውታረ መረብ እኩዮችን እና ሚናዎችን ይመዝገቡ / ይመዝገቡ ፣ መለኪያዎችን ያዘጋጁ ፣ አስፈፃሚውን ያሻሽሉ|

## CLI ምሳሌዎች {#cli-examples}

በዚህ ገጽ ላይ ያሉት ምሳሌዎች ከነባሪው የአካባቢ ደንበኛ ውቅር አንጻር ከላይኛው ተፋሰስ Iroha የስራ ቦታ ትዕዛዞችን እያሄዱ ነው ብለው ያስባሉ።

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

`iroha` ሁለትዮሽ ከጫኑ በምትኩ `iroha --config ./defaults/client.toml` ይጠቀሙ። ከታች ያሉትን ቦታ ያዢዎች ከአውታረ መረብዎ እሴቶች ጋር ይተኩ -

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

የህዝብ Taira የሙከራ መረብን ሲያነጣጥሩ የ Taira የደንበኛ ውቅር ይጠቀሙ። ክፍያ የሚከፍሉ ምሳሌዎችን ከማስኬድዎ በፊት፣ የቴስትኔት የገንዘብ ድጋፍ አገልግሎት አጋዥን ከ[Testnet XOR ን በ Taira ያግኙ](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) እንደ `taira_faucet_claim.py` ያስቀምጡ፣ ከዚያ ቴስትኔት XOR ከቴስትኔት የገንዘብ ድጋፍ አገልግሎት ይጠይቁ -

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

በቴስትኔት የተደገፈው ንብረት ከታየ በኋላ፣ ግብይቶችን ለመፃፍ አስፈላጊውን የግብይት ማስፈጸሚያ ወጪ የንብረት ሜታዳታ ያያይዙ -

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` ጎራዎችን እና SNS የኪራይ ውሉን ለመፍጠር ተራው የመጀመሪያ ልቀት መንገድ ነው።. ትክክለኛውን የውሂብ ቦታ፣ ባለቤት፣ የሊዝ ውል ውል በመግለፅ ያስራል፣ እና የክፍያ-ዋጋ ማረጋገጫ ጠባቂ፣ ከዚያ ሁሉንም አስፈላጊ ሁኔታዎችን በአቶሚክ ይፈጥራል ወይም ይጠግናል። የተረጋገጠውን `POST /v1/aliases/setup/plan` API የመጨረሻ ነጥብ ወይም ተዛማጅ CLI የስራ ፍሰት ይጠቀሙ -

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

ዓላማው እና እቅዱ ከሚስጥር የፀዱ ናቸው፣ ነገር ግን የተግባር እርምጃው ከተዋቀረው መለያ ጋር መደበኛ ግብይት ያቀርባል። እቅድ ከሰንሰለቱ ጋር የተሳሰረ ነው, ፈቃድ ባለቤት, የቀጥታ-ሁኔታ መልህቅ እና የጊዜ ገደብ; በተለየ አውታረ መረብ ላይ አንዱን በጭራሽ አይጠቀሙ።

## (የተለመደ) ይመዝገቡ {#un-register}

መመዝገብ እና መመዝገብ በብሎክቼይን ላይ ላለው አዲስ አካል መታወቂያ ለመስጠት የሚያገለግሉ መመሪያዎች ናቸው።

ሊመዘገብ የሚችለው ነገር ሁሉ ሁለቱም `Registrable` እና `Identifiable` ናቸው፣ ነገር ግን `Identifiable` የሆነው ነገር ሁሉ `Registrable` አይደለም። አብዛኛዎቹ ነገሮች በቀጥታ የተመዘገቡ ናቸው፣ ነገር ግን በአንዳንድ ሁኔታዎች በብሎክቼይን ውስጥ ያለው ውክልና በጣም ብዙ ውሂብ አለው። ለደህንነት እና ለአፈጻጸም ምክንያቶች፣ ለእንደዚህ አይነት የውሂብ አወቃቀሮች ግንበኞች እንጠቀማለን (ለምሳሌ፣ `NewAccount`)፣ እና የአውታረ መረብ አቻ ምዝገባ የተለየ የይዞታ ማረጋገጫ መመሪያ አለው። እንደ አንድ ደንብ, ሊመዘገቡ የሚችሉ ነገሮች ሁሉ ያልተመዘገቡ ሊሆኑ ይችላሉ, ነገር ግን ይህ ከባድ እና ፈጣን ህግ አይደለም.

መለያዎችን፣ የንብረት ፍቺዎችን፣ NFTs ን፣ የአውታረ መረብ እኩዮችን፣ ሚናዎችን እና ቀስቅሴዎችን መመዝገብ ይችላሉ። የጎራ ማዋቀር `EnsureAlias` ይጠቀማል; ጥሬው `Register::Domain` ክፍያ ለ ተይዟል ጀነሲስ / ቡት ማሰሪያ። የአውታረ መረብ አቻ ምዝገባ `RegisterPeerWithPop`ን ይጠቀማል፣ ይህም ለአውታረ መረብ አቻ ቁልፍ የይዞታ ማረጋገጫ ይይዛል። በአካል ስሞች ላይ ስለተጣሉት ገደቦች ለማወቅ የእኛን [ስምምነቶችን መሰየም](/am/reference/naming.md) ይመልከቱ።

የ RWA ሎቶች በተለየው `RegisterRwa` መመሪያ ይፈጠራሉ። የአሁኑ ኮድ የ `UnregisterRwa` መመሪያ አያቀርብም፤ የተወከለውን መጠን ከዝውውር ለማስወገድ `RedeemRwa`ን ይጠቀሙ።

::: info

የእርስዎን [blockchain ጀነሲስ ብሎክ](/am/guide/configure/genesis.md) በ `genesis.json` ውስጥ ለማዋቀር በወሰኑት ላይ በመመስረት (በተለይ የፍቃድ ቶከኖች ምዝገባን ያካተቱ ወይም ያላካተቱ) መለያ የመመዝገብ ሂደት በጣም የተለየ ሊሆን እንደሚችል ልብ ይበሉ። በአጠቃላይ, እንደሚከተለው ማጠቃለል እንችላለን.

- በሕዝብ blockchain ውስጥ ማንኛውም ሰው መለያ መመዝገብ መቻል አለበት።
- በግል blockchain ውስጥ፣ መለያዎችን ለመመዝገብ ልዩ ሂደት ሊኖር ይችላል። በተለመደው የግል blockchain ውስጥ፣ ማለትም፣ መለያዎችን ለመመዝገብ ምንም ልዩ ሂደቶች የሌሉበት blockchain፣ ሌላ መለያ ለመመዝገብ መለያ ያስፈልግዎታል።

እነዚህን ልዩነቶች በዝርዝር እንነጋገራለን [የግል እና ይፋዊ blockchains ያወዳድሩ](/am/guide/configure/modes.md)።

:::

::: info

የአውታረ መረብ አቻ መመዝገብ በአሁኑ ጊዜ ወደ አውታረ መረቡ የተቀናበረው የመጀመሪያ የታመነ የአውታረ መረብ አቻ አካል ያልሆኑ የአውታረ መረብ እኩዮችን ለመጨመር ብቸኛው መንገድ ነው።

:::

የብሎክቼይን ነገሮችን ለመመዝገብ ቋንቋ-ተኮር መመሪያን ይጠቀሙ -

|የጣቢያ ካርታ|መመሪያ|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI|ጎራዎችን ለማዘጋጀት እና መለያዎችን እና ንብረቶችን ለመመዝገብ [Iroha CLI](/am/get-started/operate-iroha-via-cli.md) ን ይጠቀሙ።|
|Rust|[Rust አጋዥ ስልጠና](/am/guide/tutorials/rust.md) ን ይጠቀሙ።|
|Kotlin/ጃቫ|[Kotlin/Java](/am/guide/tutorials/kotlin-java.md) ን ይጠቀሙ።|
|Python|[Python አጋዥ ስልጠና](/am/guide/tutorials/python.md) ን ይጠቀሙ።|
|JavaScript/TypeScript|[JavaScript/TypeScript](/am/guide/tutorials/javascript.md) ን ይጠቀሙ።|

መደበኛውን የጎራ ማዋቀርን ያቅዱ እና ይተግብሩ እና ከዚያ ጎራውን በማይፈለግበት ጊዜ ይመዝገቡ -

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

መለያዎችን ይመዝገቡ እና ይመዝገቡ -

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

የንብረት ፍቺዎችን ይመዝገቡ እና ይመዝገቡ -

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

ይመዝገቡ እና ይመዝገቡ NFTs። NFT ምዝገባ ይዘቱን JSON ከመደበኛ ግቤት ያነባል -

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

ሚናዎችን ይመዝገቡ እና ይመዝገቡ -

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

ቀስቅሴዎችን ይመዝገቡ እና ይመዝገቡ። ቀስቅሴ ምዝገባ የተጠናቀረ IVM ባይት ኮድ ወይም ተከታታይ የመመሪያ ዝርዝር ያስፈልገዋል። ይህ የቀደመው ምሳሌ `Log` መመሪያን ከ CLI ጋር ይገነባል እና ወደ ቀስቅሴ ምዝገባ ያስገባል -

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

የአውታረ መረብ እኩዮችን ይመዝገቡ እና ይመዝገቡ። የ BLS ቁልፍን እና PoP ከሌሉዎት በ `kagami` ይፍጠሩ -

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## ሚንት / ማቃጠል {#mint-burn}

ማውጣት እና ማጥፋት የቁጥር ንብረቶችን እና ቀስቅሴዎችን ከተወሰኑ ድግግሞሾች ጋር ሊያመለክት ይችላል። አንዳንድ ንብረቶች የማይመረቱ ተብለው ሊታወቁ ይችላሉ, ይህም ማለት ከተመዘገቡ በኋላ አንድ ጊዜ ብቻ ሊሰጡ ይችላሉ.

ንብረቶች ለአንድ የተወሰነ መለያ ይሰጣሉ, ብዙውን ጊዜ ንብረቱን በመጀመሪያ ያስመዘገበው. የንብረት መጠኖች አሉታዊ አይደሉም፣ ስለዚህ በፍፁም የንብረት `$-1.0` ሊኖርዎት ወይም አሉታዊ መጠን ሊያጠፉ እና ችግር ሊያጋጥሙዎት አይችሉም።

የብሎክቼይን ንብረቶችን ለማውጣት ቋንቋ-ተኮር መመሪያን ይጠቀሙ -

- [CLI](/am/get-started/operate-iroha-via-cli.md)
- [Rust](/am/guide/tutorials/rust.md)
- [Kotlin/Java](/am/guide/tutorials/kotlin-java.md)
- [Python](/am/guide/tutorials/python.md)
- [JavaScript/TypeScript](/am/guide/tutorials/javascript.md)

ንብረቶችን የማጥፋት ምሳሌዎች እነሆ -

- [CLI](/am/get-started/operate-iroha-via-cli.md)
- [Rust](/am/guide/tutorials/rust.md)

የቁጥር ንብረቶችን ማውጣት እና ማጥፋት -

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

ቀስቅሴ ድግግሞሾችን ያውጡ እና ያጥፉ -

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## ማስተላለፍ {#transfer}

ዝውውሮች ባለቤትነትን ወይም እሴትን በመለያዎች መካከል ያንቀሳቅሳሉ። አጠቃላይ የዝውውር ልዩነቶች ጎራዎችን፣ የንብረት ፍቺዎችን፣ የቁጥር ንብረቶችን እና NFTs ይሸፍናሉ። RWA የቁጥር እንቅስቃሴ በ[የገሃዱ ዓለም ንብረቶች](/am/blockchain/rwas.md) ውስጥ የተገለጹትን የወሰኑ `TransferRwa` እና `ForceTransferRwa` መመሪያዎችን ይጠቀማል።

ይህንን ለማድረግ መለያ መሰጠት አለበት [ንብረቶችን ለማስተላለፍ ፈቃድ](/am/reference/permissions.md)። ንብረቶችን በ [CLI](/am/get-started/operate-iroha-via-cli.md) ወይም [Rust](/am/guide/tutorials/rust.md) እንዴት ማስተላለፍ እንደሚቻል ምሳሌን ይመልከቱ።

የቁጥር ንብረቶችን ያስተላልፉ;

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

ጎራ፣ የንብረት ፍቺ እና NFT ባለቤትነት ያስተላልፉ

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## ቤተኛ Escrow እና የንብረት መቆለፊያዎች {#native-escrow-and-asset-locks}

ቤተኛ የማስያዣ መመሪያዎች በብሎክቼይን መዝገብ ፕሮቶኮል የሚተዳደሩ የቁጥር ንብረቶችን ይቆልፋሉ። ለገበያ ቦታ አይነት የፋይናንሺያል ግብይት ማጠናቀቂያ፣ አጠቃላይ የንብረት መቆለፊያዎች እና ማንነታቸው ያልታወቁ የተከለለ የዋስትና ፍሰቶች ያገለግላሉ።

የገበያ ቦታ ማስያዣ `OpenAssetEscrow`፣ `AcceptAssetEscrow`፣ `MarkEscrowPaymentSent`፣ `ReleaseAssetEscrow`፣ `CancelAssetEscrow`፣ `OpenEscrowDispute` እና `ResolveEscrowDispute` ይጠቀማል። አጠቃላይ የንብረት መቆለፊያዎች `OpenAssetLock`፣ `DrawdownAssetLock` ይጠቀማሉ፣ `CancelAssetLock`፣ እና `ExpireAssetLock`። ስም-አልባ escrow የገበያ ቦታውን የሕይወት ኡደት በ`OpenAnonymousAssetEscrow`፣ `AcceptAnonymousAssetEscrow`፣ `MarkAnonymousEscrowPaymentSent`፣ `ReleaseAnonymousAssetEscrow`፣ `CancelAnonymousAssetEscrow`፣ `OpenAnonymousEscrowDispute` እና `ResolveAnonymousEscrowDispute` ያንፀባርቃል።

እነዚህ ISIs በአሁኑ ጊዜ አንደኛ ደረጃ የለዎትም CLI ትዕዛዞች. የተተየበ ተጠቀም SDK ግንበኞች ወይም ተከታታይ የመመሪያ ጭነቶች፣ እና ይመልከቱ [ቤተኛ ንብረት Escrow](/am/blockchain/escrow.md) ለሕይወት ዑደት ዝርዝሮች፣ ፈቃዶች፣ ጥያቄዎች፣ ክስተቶች እና Rust ምሳሌዎች.

## አቶሚክ የግል የፋይናንስ ግብይት ስምምነት {#atomic-private-settlement}

የሚተዳደረው የአቶሚክ-የግል-ማጠናቀቂያ መመሪያ ቤተሰብ ከግልፅ ቤተኛ የተለየ ነው AMX። `ActivatePrivateSettlementPoolV1` ከተሻሻለ የአስተዳደር ትንበያ እና ከነጠላ ፕሮቶኮል-መደበኛ መነሻ ክሪፕቶግራፊያዊ ኮሚትመንቶች አንድ መንገድ ወሰን ያለው ሚስጥራዊ የፕሮቶኮል መረጃ ቡድን ያቋቁማል። `FinalizeAtomicPrivateSettlementV1` አንድ ሙሉ በኮሚቴ የተረጋገጠ ጥቅል በአቶሚክ ይተገበራል፣ `AbortAtomicPrivateSettlementV1` ደግሞ በስፖንሰር የተፈቀደውን የህዝብ ተርሚናል ምልክት ማድረጊያ ብቻ ያትማል።

`RotatePrivateSettlementPoolPolicyV1` በግላዊነት አስተዳደር የተገደበ ነው። ትክክለኛውን የአሁኑን የአስተዳደር ክሪፕቶግራፊያዊ ዳይጀስትን ይጠይቃል፣ መንገዱን፣ የፕሮቶኮል መረጃ ቡድንን፣ ንብረትን አስገዳጅ ክሪፕቶግራፊያዊ ኮሚትመንትን፣ የስቴት ድንበርን፣ የድጋሚ አጫውት ስብስቦችን እና የተጠናቀቁ የደረሰኞችን ይጠብቃል፣ የህዝብ ክለሳውን በአንድ ያራምዳል፣ እና አዲስ የኦዲተር ቁልፍ ዘመን ይጠቀማል። ሽክርክሪቱ በማካተት ቁመቱ ላይ ይሠራል እና ያንን ቁመት ለተመሳሳይ መንገድ/ፑል ከደረሰኝ ጋር ማጋራት አይችልም። የህዝብ ክለሳ የተከታታይነት የደረሰኞችን ከማሽከርከር በፊት መጠናቀቁን ያቆያል፣ እንደገና መጀመር፣ ትክክለኛ እና ትክክለኛ-ድጋሚ አጫውት። በበረራ ውስጥ ያሉ የድሮ ፖሊሲ ቅርቅቦች ተዘግተዋል። ኦፕሬተሮች ለተከማቹ ካፕሱሎች የቆዩ ዲክሪፕት ቁልፎችን መያዝ አለባቸው ወይም ከማጥፋታቸው በፊት የካፕሱል መጠቅለልን ማስተዳደር እና መሞከር አለባቸው።

መንገዱ በነባሪነት ተሰናክሏል እና ለምርት ብቁ አይደለም። ለማዋቀር፣ ለፍቃድ ዋና፣ ለኦዲት፣ ለማገገም እና ለመልቀቂያ መስፈርቶች [አቶሚክ የግል አቋራጭ-ዳታስፔስ የፋይናንስ ግብይት ማጠናቀቂያን ያሂዱ](/am/get-started/atomic-private-settlement)ን ይመልከቱ።

## ስጦታ / መሻር {#grant-revoke}

የስጦታ እና የመሻር መመሪያዎችን ለመለያ [ፈቃዶች እና ሚናዎች](permissions.md) ያገለግላሉ።

`Grant` ለተጠቃሚው አንድ ነጠላ ፍቃድ ወይም የፈቃድ ቡድን ("ሚና") በቋሚነት ለመስጠት ይጠቅማል። የተሰጡ ሚናዎች እና ፈቃዶች ሊወገዱ የሚችሉት በ`Revoke` መመሪያ ብቻ ነው። ስለዚህ, እነዚህ መመሪያዎች በጥንቃቄ ጥቅም ላይ መዋል አለባቸው.

በመለያ ላይ ሚና ይስጡ እና ይሰርዙ -

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

የፍቃድ ቶከኖችን ይስጡ እና ይሰርዙ። የፍቃድ ትዕዛዞች የፍቃድ ነገርን ከመደበኛ ግቤት ያነባሉ -

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

በአንድ ሚና ላይ ፈቃዶችን ይስጡ እና ይሰርዙ -

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

እነዚህ መመሪያዎች ነገርን [ሜታዳታ](/am/blockchain/metadata.md) ያዘምኑ። ሜታዳታ ግቤት ለማስገባት ወይም ለመተካት `SetKeyValue` እና አንዱን ለመሰረዝ `RemoveKeyValue` ይጠቀሙ።

ሜታዳታ `set` ትእዛዞች ያነባሉ JSON እሴቱን ከ መደበኛ ግቤት

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

ተመሳሳይ ስርዓተ-ጥለት ለሂሳቦች፣ ለንብረት ፍቺዎች፣ NFTs፣ RWAs እና ቀስቅሴዎች ይገኛል -

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

`SetParameter` በነቃ የውሂብ ሞዴል እና አስፈፃሚ የተጋለጡ ሰንሰለት-ሰፊ መለኪያዎችን ይለውጣል።

በመደበኛ ግቤት ላይ አንድ ነጠላ መለኪያ JSON ነገር በማለፍ መለኪያ ያዘጋጁ -

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

ይህ መመሪያ [ቀስቅሴዎች](./triggers.md) ለማስፈጸም ጥቅም ላይ ይውላል።

CLI ቀስቅሴዎችን መመዝገብ እና የማስፈጸሚያ ክስተቶችን በቀጥታ ለመቀስቀስ መመዝገብ ይችላል። የተተየበ `execute trigger` ትዕዛዝ አይሰጥም፣ ስለዚህ ሀ ለማስገባት በእጅ `ExecuteTrigger` መመሪያ፣ ተከታታይ `InstructionBox` በ SDK ወይም አስፈፃሚ መሳሪያ ያመነጩ እና የተገኘውን JSON ድርድር በ`ledger transaction stdin` በኩል ያስተላልፉ -

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## ሌሎች መመሪያዎች {#other-instructions}

Iroha እንዲሁም ለሶፍትዌር ማስፈጸሚያ አካባቢ እና ለአስፈፃሚ ውህደት ዝቅተኛ ደረጃ መመሪያዎችን ያጋልጣል -

- `Log` በአፈፃፀም ጊዜ የምዝግብ ማስታወሻ ግቤት ያውጡ
- `CustomInstruction` አስፈፃሚ-ተኮር JSON ጭነቶችን ይያዙ
- `Upgrade` የአስፈፃሚ ማሻሻልን ያግብሩ

ከፒንግ ረዳት ጋር `Log` መመሪያ ያስገቡ -

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

ብጁ አስፈፃሚ መመሪያን እንደ ተከታታይ `InstructionBox` ያስገቡ። ጭነቱ ቅርፅ አስፈፃሚ-ተኮር ነው፣ ስለዚህ መመሪያውን በተዛመደ SDK ወይም አስፈፃሚ መሳሪያ ያመነጩ -

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

አስፈፃሚውን ከተጠናቀረ IVM የባይት ኮድ ፋይል ያሻሽሉ -

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
