---
translation_locale: am
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ልዩ መመሪያዎች {#iroha-special-instructions}

ስለ [እንዴት Iroha ይሠራል](/am/blockchain/iroha-explained), እኛ
እንዲህ ብሏል Iroha ልዩ መመሪያዎች ዓለምን ለመቀየር ብቸኛው መንገድ ናቸው
ስለዚህ ምን ዓይነት ልዩ መመሪያ አለን?
በዚህ ጥናት ውስጥ የቋንቋ-ተኮር መመሪያዎች, ቀደም ሲል ሁለት አይተዋል
መመሪያ: `Register<Account>` እና `Mint<Numeric>`.

እዚህ ላይ ሙሉ ዝርዝር ነው Iroha ልዩ መመሪያዎች

| መመሪያ                                               | መግለጫዎች                                     |
| --------------------------------------------------------- | ------------------------------------------------ |
| [መመዝገብ/መመዝገብ አለመተው](#un-register)                       | አንድ ስጥ ID በብሎክቼይን ላይ ወደ አዲስ አካል.    |
| [የወይን ጠጅ/የተቃጠለ](#mint-burn)                                   | የቁጥር ንብረቶች ወይም የመድገም ተነሳሽነት። |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | የብሎክቼይን ቁሳቁስ ሜታዳታዎችን ያዘምኑ።               |
| [SetParameter](#setparameter)                             | ሰንሰለት-አጠቃላይ መለኪያ ያዘጋጁ.                      |
| [የገንዘብ ድጋፍ/የማስወገድ መብት](#grant-revoke)                             | ፍቃዶችን እና ሚናዎችን መስጠት ወይም ማስወገድ።            |
| [ማስተላለፍ](#transfer)                                     | የባለቤትነት ወይም የአክሲዮን ዋጋ ማስተላለፍ።               |
| [የአገር ውስጥ ዋስትና እና የንብረት መቆለፊያ](#native-escrow-and-asset-locks) | የቁጥር ንብረቶችን በፕሮቶኮል ጥበቃ ውስጥ ይዝጉ።     |
| [ExecuteTrigger](#executetrigger)                         | ማስነሻዎችን አሂድ.                                |
| [መዝገብ / ብጁ / ማሻሻል](#other-instructions)                 | የስራ ሰዓት ባህሪን መዝገብ፣ ማራዘም ወይም ማሻሻል።        |

እስቲ ከጠቅለል ያለ ማጠቃለያ እንጀምር Iroha ልዩ መመሪያዎች፤ ለእያንዳንዱ ዓላማ
የትኛውን መመሪያ መጠየቅ ይቻላል እና ለእያንዳንዱ መመሪያ ምን ዓይነት መመሪያዎች ይገኛሉ
ዕቃ።

## ማጠቃለያ {#summary}

ለእያንዳንዱ መመሪያ, ይህ መመሪያ ላይ ንጥሎች ዝርዝር አለ
ለምሳሌ ያህል, ማስተላለፍ ተለዋዋጮች ባለቤትነት መቁጠሪያ ዕቃዎች ይሸፍናሉ
የቁጥር ንብረቶችን እና ቁጥራዊ ንብረቶችን ይሸፍናል
ድግግሞሽ።

አንዳንድ መመሪያዎች መድረሻን መግለጽ ይጠይቃሉ። ለምሳሌ ፣
ንብረቶችን ሲያስተላልፉ ምንጊዜም የትኛው ሂሳብ ላይ እንደሆኑ መግለጽ ያስፈልግዎታል
በሌላ በኩል ደግሞ አንድ ነገር ሲመዘገቡ
የሚያስፈልግህ ነገር ብቻ ነው ለመመዝገብ የምትፈልገው።

| መመሪያ                                               | ነገሮች                                                                                                 | መድረሻ          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               | የተለመደ ጎራ፣ የውሂብ ቦታ-አልባ ስያሜ እና የመለያ-አልባ ስም ማዋቀር                                                 |                      |
| [መመዝገብ/መመዝገብ አለመተው](#un-register)                       | ሂሳቦች፣ የንብረት ትርጉሞች፣ NFTs, ሚናዎች፣ አስነሳሾች፣ እኩዮች፤ የጎራ ማስወገጃ                                |                      |
| [የወይን ጠጅ/የተቃጠለ](#mint-burn)                                   | የቁጥር ንብረቶች፣ የመነሻ ድግግሞሽ                                                                     | ሂሳቦች ወይም ማስነሻዎች |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | የነገሮች [ሜታዳታ](./metadata.md): ጎራዎች፣ ሂሳቦች፣ የንብረት ትርጉሞች፣ NFTs, RWAs, ተነሳሽነት |                      |
| [SetParameter](#setparameter)                             | ሰንሰለት መለኪያዎች                                                                                        |                      |
| [የገንዘብ ድጋፍ/የማስወገድ መብት](#grant-revoke)                             | [ሚናዎች፣ የመፈቀደላቸው ምልክቶች](/am/blockchain/permissions.md)                                                  | ሂሳብ ወይም ሚና    |
| [ማስተላለፍ](#transfer)                                     | ጎራዎች፣ የንብረት ትርጉሞች፣ ቁጥራዊ ንብረቶች፣ NFTs                                                        | ሂሳቦች             |
| [የአገር ውስጥ ዋስትና እና የንብረት መቆለፊያ](#native-escrow-and-asset-locks) | የቁጥር አክሲዮኖች ዋስትናዎች፣ የአክሲዮን መቆለፊያዎች፣ የማይታወቁ ዋስትና ግዴታዎች                                    | ገዢዎች፣ መዳረሻዎች ወይም አለመግባባቶች |
| [ExecuteTrigger](#executetrigger)                         | ተነሳሽነት                                                                                                |                      |
| [መዝገብ / ብጁ / ማሻሻል](#other-instructions)                 | መዝገቦች፣ ለተፈፃሚው የተወሰኑ ጥቅማጥቅሞች፣ ለተፈጻሚው ማሻሻያዎች                                                     |                      |

ሌላም መንገድ አለ ISI, ከሪጀር አቃፊው አንፃር
ይዳስሳሉ:

| ግብ           | መመሪያ                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| ሂሳብ          | የመመዝገብ/የማስወገድ ሂሳቦች፣ ተቀባይነት ያላቸው ንብረቶች፣ የዘመነ የሂሳብ ሜታዳታ፣ የማስተላለፍ/የማሰረዝ ፈቃዶች እና ሚናዎች    |
| ጎራ           | የጎራ ማዋቀር፣ ጎራዎችን አለመመዝገብ፣ የጎራ ባለቤትነትን ማስተላለፍ፣ የጎራ ሜታዳታዎችን ማዘመን                    |
| የንብረት ትርጉም | የምዝገባ/መዘገብ ማቆም ትርጓሜዎች፣ የማስተላለፍ ባለቤትነት፣ የዘመነ ሜታዳታ                                         |
| ንብረቶች            | የቁጥር ብዛት/የቃጠሎ ቁጥር፣ የዝውውር ቁጥር                                                        |
| ኤስኮር           | የተላኩትን ክፍያዎች መክፈት፣ መቀበል፣ ምልክት ማድረግ፣ መለቀቅ፣ መሰረዝ፣ አለመግባባት መፍታት፣ ማውጣት ወይም ማብቂያ |
| NFT              | መመዝገብ/መመዝገብ አለመተው NFTs, የመተላለፍ ባለቤትነት፣ የማዘመን ሜታዳታ                                                |
| RWA              | ጭነቶች መመዝገብ፣ የመተላለፍ ብዛት፣ ማቆየት/መልቀቅ፣ ማቀዝቀዣ/ማቀዝቀዛ፣ መለዋወጥ፣ ማዋሃድ፣ ሜታዳታዎችን ማዘመን እና ቁጥጥር |
| ማነቃቂያ          | መዝገብ/መመዝገብ ማስወገድ፣ የወር አበባ/የማቃጠል አስነሳሽነት ድግግሞሾች፣ አስነሳሽነትን ለማስፈጸም፣ የዘመነ አስነሳሽ ሜታዳታ                 |
| ዓለም            | መዝገብ/መመዝገብን ማስወገድ የእኩዮች እና ሚናዎች፣ መለኪያዎችን ማዘጋጀት፣ አስፈፃሚውን ማሻሻል                                    |

## CLI ምሳሌዎች {#cli-examples}

በዚህ ገጽ ላይ ያሉ ምሳሌዎች ከላይ ካለው ትዕዛዝ እየሮጡ ነው ብለው ያስባሉ
Iroha በቦታው ላይ ካለው የስራ ቦታ ጋር በተያያዘ ነባሪ የአካባቢያዊ ደንበኛ ውቅር:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

የ `iroha` የሁለትዮሽ, አጠቃቀም
`iroha --config ./defaults/client.toml` በምትኩ ቦታውን የሚይዙትን ተተክ
ከዚህ በታች ከኔትወርክዎ ጋር እሴቶች:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

የሕዝብን ዒላማ ሲያደርጉ Taira የሙከራ አውታረ መረብ, አንድ ይጠቀሙ Taira የደንበኛው ውቅር።
ክፍያ የሚከፈልባቸው ምሳሌዎችን ከማሄድዎ በፊት የቧንቧ ረዳት ከ
[ቴስትኔት ያግኙ XOR ላይ Taira](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
እንደ `taira_faucet_claim.py`, ከዚያም የይገባኛል ጥያቄ የሙከራ ኔት XOR ከቧንቧው:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

በቧንቧው የተደገፈ ሀብት ከተገለጠ በኋላ አስፈላጊውን የጋዝ ንብረት ያያይዙ
ግብይቶችን ለመጻፍ የሚረዱ ሜታዳታዎች

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` ጎራዎችን ለመፍጠር የተለመደው የመጀመሪያ-ልቀት መንገድ ነው
የእነሱ SNS ውሂብ ቦታ, ባለቤት, ኪራይ
ቃል, እና ጥቅስ ጠባቂ, ከዚያም ይፈጥራል ወይም የሚፈለገው ሁሉ ሁኔታ atomically ይጠገን.
የተረጋገጠውን ይጠቀሙ `POST /v1/aliases/setup/plan` የመጨረሻ ነጥብ ወይም ማመሳሰል
CLI የስራ ፍሰት

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

ዓላማ እና ዕቅድ ምስጢራዊ ናቸው, ነገር ግን እርምጃ ምልክቶች ተግባራዊ እና አንድ
አንድ ዕቅድ ከታቀደው ሂሳብ ጋር የተያያዘ ነው
ሰንሰለት, ሥልጣን, የቀጥታ ሁኔታ አናከር, እና ጊዜ ገደብ; እርስ በርሳቸው እንደገና ጥቅም ላይ ፈጽሞ
አውታረመረብ።

## (Un)መመዝገብ {#un-register}

መመዝገብ እና አለመመዝገብ ID ወደ ሀ
በብሎክቼይኑ ላይ አዲስ አካል።

የተመዘገቡት ሁሉም ነገሮች ሁለቱም ናቸው `Registrable` እና `Identifiable`,
ነገር ግን ሁሉም ነገር አይደለም `Identifiable` ነው `Registrable`. አብዛኛዎቹ ነገሮች
በቀጥታ ተመዝግቧል, ነገር ግን በአንዳንድ ሁኔታዎች ውስጥ blockchain ውስጥ ያለው ውክልና
ለደህንነት እና አፈፃፀም ምክንያቶች
ለእንደዚህ አይነት የውሂብ መዋቅሮች ገንቢዎች (ለምሳሌ `NewAccount`), እና እኩዮች
ምዝገባው ለባለቤትነት ማረጋገጫ የተሰጠ መመሪያ አለው።
ሊመዘገብ የሚችል ነገር ሁሉ ያልተመዘገበ ሊሆን ይችላል፣ ግን ይህ አይደለም
ከባድና ፈጣን ሕግ ነው።

ሂሳቦችን፣ የንብረት ትርጉሞችን መመዝገብ ትችላለህ፤ NFTs, እኩዮች፣ ሚናዎች እና
ማስነሻዎች። የጎራ ማዋቀር አጠቃቀሞች `EnsureAlias`; ጥሬው `Register::Domain` የዋጋ ጭነት
ለጀኔዝ/ቡት ስትራፕ የተወሰነ ነው።
`RegisterPeerWithPop`, የጋራ ቁልፉን ባለቤትነት ማረጋገጫ ያካተተ ነው።
[ስምምነቶች](/am/reference/naming.md) ስለ ገደቦች ለማወቅ
የድርጅት ስሞችን ይጫኑ.

RWA ብዙዎች የተሰጡ አማካኝነት ይፈጠራል `RegisterRwa` መመሪያ.
የአሁኑ ኮድ `UnregisterRwa` መመሪያ፤ አጠቃቀም
`RedeemRwa` የተወከለው መጠን ወደ ጡረታ እንዲገባ።

::: info

ያስታውሱ
[የጅነሲስ ማገጃ](/am/guide/configure/genesis.md) ውስጥ `genesis.json`
(በተለይም የመፈቀዱን ምዝገባ ያካትታሉ ወይም አያካትቱም
የሂሳብ ምዝገባ ሂደት በጣም የተለየ ሊሆን ይችላል.
ጠቅላይ ሚኒስትር፣ በዚህ መልኩ ማጠቃለል እንችላለን፡

- አንድ ውስጥ _የሕዝብ_ በብሎክቼይን፣ ማንኛውም ሰው መለያ መመዝገብ ይችላል።
- አንድ ውስጥ _የግል_ blockchain, ለመመዝገብ ልዩ ሂደት ሊኖር ይችላል
  ሂሳቦች _የተለመደ_ የግል blockchain, ማለትም ያለ blockchain
  ማንኛውም ልዩ ሂሳቦችን ለመመዝገብ ሂደቶች, አንድ መለያ ያስፈልጋቸዋል
  ሌላ ሂሳብ መመዝገብ።

እነዚህን ልዩነቶች በዝርዝር እንወያይበታለን
[የግል እና የህዝብ ብሎክ ሰንሰለቶችን ያወዳድሩ](/am/guide/configure/modes.md).

:::

::: info

በአሁኑ ጊዜ የእኩዮችን ምዝገባ ያልነበሩትን እኩዮችን ለመጨመር ብቸኛው መንገድ ነው
በኔትወርኩ ላይ የተቀመጠው የመጀመሪያው የታመነ የባልደረባ አካል።

:::

Refer በቋንቋው ላይ የተመሠረተ መመሪያ ካለው አንዱ ጋር
በብሎክቼን ውስጥ ያሉ ነገሮችን የመመዝገብ ሂደት

| ቋንቋ              | መመሪያ                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   | ይጠቀሙ [Iroha CLI](/am/get-started/operate-iroha-via-cli.md) ጎራዎችን ለማቋቋም እና ሂሳቦችን እና ንብረቶችን ለመመዝገብ። |
| Rust                  | ይጠቀሙ [Rust አጋዥ](/am/guide/tutorials/rust.md).                                                      |
| Kotlin/ጃቫ           | ይጠቀሙ [Kotlin/ጃቫ ትምህርት](/am/guide/tutorials/kotlin-java.md).                                        |
| Python                | ይጠቀሙ [Python አጋዥ](/am/guide/tutorials/python.md).                                                  |
| JavaScript/TypeScript | ይጠቀሙ [JavaScript/TypeScript አጋዥ](/am/guide/tutorials/javascript.md).                               |

መደበኛ ጎራ ማዋቀር እቅድ እና ተግባራዊ, ከዚያም የጎራ አይደለም ጊዜ ከ ምዝገባ
ረዘም ያለ ጊዜ ያስፈልጋል

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

መዝገብ እና ማስቀረት የንብረት ትርጓሜዎች

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

መመዝገብ እና ማስወገድ NFTs. NFT ምዝገባው ይዘቱን ያነባል JSON ከ
መደበኛ ግብዓት:

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

ማስነሻዎችን መመዝገብ እና ማስወገድ።
የተጠናቀቁ IVM ይህ ምሳሌ ይገነባል
ሀ `Log` መመሪያ CLI እና ወደ አስነሳሽነት ምዝገባ ያነጣጥላል:

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

ተመዝግበው እና ተመዝግቡ ያልሆኑ እኩዮች. BLS ቁልፍ እና PoP ጋር `kagami`
እስካሁን ካላገኙት:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## የወይን ጠጅ/የተቃጠለ {#mint-burn}

ማጨስ እና ማቃጠል የተገደበ ቁጥር ያላቸው ንብረቶችን ሊያመለክት ይችላል
የተወሰኑ ንብረቶች እንደ የማይነጣጠሉ ሊገለጹ ይችላሉ ፣ ማለትም
ከተመዘገቡ በኋላ አንድ ጊዜ ብቻ ሊታተሙ እንደሚችሉ።

ንብረቶች በተወሰነ ሂሳብ ላይ ይለቀቃሉ፣ አብዛኛውን ጊዜ የተመዘገቡት
የንብረት ብዛት አሉታዊ አይደለም, ስለዚህ ይችላሉ
በጭራሽ `$-1.0` ወይም አሉታዊ መጠን ያቃጥሉ እና አንድ የወር አበባ ያገኛሉ.

በቋንቋው ላይ የተመሠረቱ መመሪያዎችን አንዱን ያንብቡ
በብሎክቼን ውስጥ ንብረቶችን የማጣራት ሂደት

- [CLI](/am/get-started/operate-iroha-via-cli.md)
- [Rust](/am/guide/tutorials/rust.md)
- [Kotlin/ጃቫ](/am/guide/tutorials/kotlin-java.md)
- [Python](/am/guide/tutorials/python.md)
- [JavaScript/TypeScript](/am/guide/tutorials/javascript.md)

እዚህ ላይ የሚቃጠሉ ንብረቶች ምሳሌዎች ናቸው:

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

የሜይንት እና የእሳት ቃጠሎ ማስነሻ ተደጋጋሚነት

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## ማስተላለፍ {#transfer}

ዝውውሮች ባለቤትነትን ወይም እሴት ከሂሳብ ወደ ሂሳብ ያዛውራሉ።
ተለዋዋጮች ጎራዎችን፣ የንብረት ትርጉሞችን፣ ቁጥራዊ ንብረቶችን ያካትታሉ፤ እንዲሁም NFTs. RWA
ብዛት እንቅስቃሴ የተወሰነ ይጠቀማል `TransferRwa` እና `ForceTransferRwa`
በ ውስጥ የተገለጹት መመሪያዎች [በእውነተኛ ዓለም ውስጥ ያሉ ንብረቶች](/am/blockchain/rwas.md).

ይህን ለማድረግ ሂሳቡን መስጠት ያስፈልጋል
[ንብረቶችን ለማስተላለፍ ፈቃድ](/am/reference/permissions.md). ወደ አንድ
የንብረት ማስተላለፍ እንዴት እንደሚቻል ምሳሌ
[CLI](/am/get-started/operate-iroha-via-cli.md) ወይም
[Rust](/am/guide/tutorials/rust.md).

የቁጥር ንብረቶችን ማስተላለፍ

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

የዝውውር ጎራ፣ የአክሲዮን ትርጉም እና NFT ባለቤትነት:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## የአገር ውስጥ የዋስትና እና ንብረት መቆለፊያዎች {#native-escrow-and-asset-locks}

በዋና መለያ የሚተዳደር ፕሮቶኮል ውስጥ የቁጥር ንብረቶችን መቆለፍ
ለገበያ ቅጥ የማስተካከል፣ የጄኔሪክ ንብረት
መቆለፊያዎች፣ እና ስም አልባ የተጠበቁ የኤስኮር ፍሰቶች።

የገበያ ቦታ ኤስኮር አጠቃቀሞች `OpenAssetEscrow`, `AcceptAssetEscrow`,
`MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`,
`OpenEscrowDispute`, እና `ResolveEscrowDispute`. አጠቃላይ የንብረት መቆለፊያዎች አጠቃቀም
`OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, እና
`ExpireAssetLock`. የማይታወቁ ኤስሮዎች የገበያውን የህይወት ዑደት ያንፀባርቃሉ
`OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`,
`MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`,
`CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, እና
`ResolveAnonymousEscrowDispute`.

እነዚህ ISIs በአሁኑ ጊዜ የመጀመሪያ ደረጃ ያላቸው አይደሉም CLI ትዕዛዞች. SDK
ገንቢዎች ወይም ተከታታይ መመሪያ ጥቅማጥቅሞች, እና ተመልከት
[የአገር ውስጥ ንብረት ማስከበሪያ](/am/blockchain/escrow.md) ለህይወት ዑደት ዝርዝሮች፣
ፍቃዶች፣ ጥያቄዎች፣ ክስተቶች እና Rust ምሳሌዎች።

## የገንዘብ ድጋፍ/የማስወገድ መብት {#grant-revoke}

ለሂሳብ የሚውሉ መመሪያዎችን መስጠት እና መሰረዝ
[ፍቃዶች እና ሚናዎች](permissions.md).

`Grant` ለተጠቃሚው አንድን ፈቃድ በቋሚነት ለመስጠት ጥቅም ላይ ይውላል ፣ ወይም
የተሰጡት ሚናዎች እና ፍቃዶች
በኤሌክትሮኒክ `Revoke` እነዚህ መመሪያዎች
በጥንቃቄ ይጠቀሙ።

በሂሳብ ላይ ሚና መስጠት እና መሰረዝ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

የመፈቃድ ትዕዛዞች አንድ ፈቃድ ያነባሉ
መደበኛ ግብዓት ላይ ያለው ነገር:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

ለተግባር ፈቃድ መስጠት እና መሰረዝ

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

እነዚህ መመሪያዎች ይዘምናል ነገር [ሜታዳታ](/am/blockchain/metadata.md). አጠቃቀም
`SetKeyValue` የሜታዳታ ማስገቢያን ለማስገባት ወይም ለመተካት እና `RemoveKeyValue` ወደ
አንዱን አስወግድ።

ሜታዳታ `set` ትዕዛዞች ማንበብ JSON ከተለመደው ግብዓት ዋጋ:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

ተመሳሳይ ንድፍ ለሂሳብ፣ ለንብረት ትርጉሞች፣ NFTs, RWAs,
እና መንስኤዎች:

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

`SetParameter` በሥራ ላይ የሚውሉ መረጃዎች የተጋለጡትን ሰንሰለት-አጠቃላይ መለኪያዎችን ይለውጣሉ
ሞዴል እና አስፈፃሚ.

አንድን መለኪያ በማለፍ ልኬት ያዘጋጁ JSON መስፈርት ላይ ያለው ነገር
ግብዓት:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

ይህ መመሪያ ለማከናወን ጥቅም ላይ ይውላል [ተነሳሽነት](./triggers.md).

የ CLI ማስነሻዎችን መመዝገብ እና ማስነሻ አፈፃፀም ክስተቶችን ለመመዝገብ ይችላሉ
በቀጥታ. `execute trigger` ትእዛዝ, ስለዚህ ወደ
መመሪያ ማቅረብ `ExecuteTrigger` መመሪያ, አንድ ተከታታይ ማመንጨት
`InstructionBox` አንድ ጋር SDK ወይም አስፈጻሚ መሣሪያ እና የተገኘው ማለፍ JSON
አሰላለፍ `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## ሌሎች መመሪያዎች {#other-instructions}

Iroha በተጨማሪም ለስራ ሰዓት እና ለተፈፃሚው ዝቅተኛ ደረጃ መመሪያዎችን ያጋልጣል
ውህደት

- `Log`: በሥራ ላይ በሚውልበት ጊዜ የመዝገብ ምዝገባን ያወጣሉ
- `CustomInstruction`: ለሥራ አስፈፃሚው የተወሰነ መሸከም JSON ጠቃሚ ጭነቶች
- `Upgrade`: አስፈፃሚ ማሻሻያ ያግበር

አንድ ማቅረብ `Log` ከፒንግ ረዳት ጋር መመሪያ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

ተከታታይ ሆኖ ብጁ አስፈፃሚ መመሪያ ማስገባት `InstructionBox`. የ
ጠቃሚ ጭነት ቅርጽ አስፈጻሚ-ተኮር ነው, ስለዚህ መመሪያውን በ ማመንጨት
ማመሳሰል SDK ወይም አስፈፃሚ መሳሪያ:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

አስፈፃሚውን ከቀናበረ IVM የባይቶ ኮድ ፋይል:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
