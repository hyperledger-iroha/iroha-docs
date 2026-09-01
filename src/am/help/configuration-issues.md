---
translation_locale: am
translation_source: /help/configuration-issues.md
translation_source_hash: 4b96a4f740203aace2e8c091ed89156146ba117e23eff1d08f3bbb01de92f24a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# የማዋቀር ችግሮችን መላ መፈለግ {#troubleshooting-configuration-issues}

ይህ ክፍል ለ Iroha 3 ውቅር የመላ መፈለጊያ ምክሮችን ይሰጣል። በ Iroha ውስጥ በጣም የተለመደው የጉዳዮች ምንጭ ስለሆነ መጀመሪያ [ቁልፎቹን ፈትሸዋል](./overview.md#check-the-keys)ን ያረጋግጡ።

እያጋጠመዎት ያለው ችግር እዚህ ካልተገለጸ፣ በ[ቴሌግራም](https://t.me/hyperledgeriroha) በኩል ያግኙን።

## ጊዜው ያለፈበት blockchain ጀነሲስ በ Docker Compose ማዋቀር ላይ {#outdated-genesis-on-a-docker-compose-setup}

የ Docker Compose ስሪት Iroha ሲጠቀሙ፣ ከአውታረ መረብ አቻ ኮንቴይነሮች አንዱ በ`Failed to deserialize raw genesis block` ስህተት ያልተሳካ ችግር ሊያጋጥምዎት ይችላል። ይህ ማለት ብዙውን ጊዜ የኔትወርክ አቻ፣ የተፈረመ የብሎክቼይን ጀነሲስ ግብይት እና የመነጨ ውቅር በተለያዩ Iroha ክለሳዎች ወይም መገለጫዎች ተዘጋጅቷል ማለት ነው።

በእነዚህ ደረጃዎች ውድቀቱን ያረጋግጡ

1. የአሁኑን ኮንቴይነሮች ለመፈተሽ `docker ps` ይጠቀሙ። በተፈጠረው መገለጫ ላይ በመመስረት ብዙውን ጊዜ `hyperledger/iroha:dev` ኮንቴይነሮችን ያያሉ። ነባሪው Docker Compose መገለጫ አራት የአውታረ መረብ አቻ ኮንቴይነሮችን ይዟል፣ ምንም እንኳን የእርስዎ የመነጨ `docker-compose.yml` ሊለያይ ይችላል።

2. ምዝግብ ማስታወሻዎቹን ይፈትሹ እና `Failed to deserialize raw genesis block` ስህተቱን ይፈልጉ። የእርስዎን Iroha በዴሞን ሁነታ በ`docker compose up -d` ከጀመሩ `docker compose logs` ትዕዛዝን ይጠቀሙ።

እንዲህ ዓይነቱን ችግር መላ ለመፈለግ የሚቻልበት መንገድ በ Iroha አጠቃቀም ላይ የተመሰረተ ነው. ይህ መሰረታዊ ማሳያ ከሆነ እና የአውታረ መረብ አቻ ውሂብን ማቆየት ካላስፈለገዎት ተዛማጅ localnet ወይም Docker Compose ጥቅልን ከ Kagami ጋር እንደገና ያድሱ -

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

ከዚያ የድሮውን የእቃ መያዢያ ሁኔታ ያስወግዱ እና እንደገና ከተፈጠረው `genesis.signed.nrt`፣ የአውታረ መረብ አቻ `config.toml` ፋይሎች እና `client.toml` እንደገና ያስጀምሩ።

የ Iroha ምሳሌ ውሂብን ወደነበረበት መመለስ ከፈለጉ የሚከተሉትን ያድርጉ

1. ውሂቡን ከመጀመሪያው (ያልተሳካ) የአውታረ መረብ አቻ የሚገለብጠውን ሁለተኛውን Iroha የአውታረ መረብ አቻ ያገናኙ።
2. አዲሱ የአውታረ መረብ አቻ ውሂቡን ከመጀመሪያው የአውታረ መረብ አቻ ጋር እስኪያመሳስል ድረስ ይጠብቁ።
3. አዲሱን የአውታረ መረብ አቻ ንቁ ይተውት።
4. የመጀመሪያውን የአውታረ መረብ አቻ የብሎክቼይን ጀነሲስ እና ውቅር ፋይሎችን እንደ የተቀናጀ ፍልሰት አካል ብቻ ያዘምኑ።

::: info

በቀጥታ አውታረመረብ ላይ የብሎክቼይን ጀነሲስን ለመተካት ምንም አጠቃላይ አውቶማቲክ ዳግም የመፃፍ መንገድ የለም። ይህንን እንደ የተቀናጀ ፍልሰት አድርገው ይያዙት የድሮውን ሁኔታ ይጠብቁ፣ ተኳሃኝ የሆኑ የአውታረ መረብ እኩዮችን ያምጡ እና ኦፕሬተሮቹ በስደት እቅዱ ላይ ከተስማሙ በኋላ አረጋጋጮችን ወደ አዲሱ ውቅር ብቻ ያንቀሳቅሱ።

:::

## የግል እና የህዝብ ቁልፎች ባለብዙ ሃሽ ቅርጸት {#multihash-format-of-private-and-public-keys}

ከተመለከቱ [የደንበኛ ውቅር](/am/guide/configure/client-configuration.md), እዚያ ያሉት ቁልፎች በ ውስጥ እንደተሰጡ ያስተውላሉ [ባለብዙ ሃሽ ቅርጸት](https://github.com/multiformats/multihash).

ከዚህ በፊት ከብዙ ሃሽ ጋር ሰርተህ የማታውቅ ከሆነ፣ በቀኝ በኩል የቁልፍ ባይት ሄክሳዴሲማል ውክልና እንዳልሆነ መገመት ተፈጥሯዊ ነው (ሁለት ምልክቶች ይልቁንም በ ASCII (ወይም UTF-8) እና በሁለቱም `public_key` እና `private_key` ቅጽበታዊ በሆነው ሕብረቁምፊ ላይ `from_hex` ጥሪ [] በ [] እና [] ቅጽበት ውስጥ [] በ [] ውስጥ በ [] (ወይም []) የተመሰጠሩ ባይቶች (ወይም []) እና [] በሁለቱም [] እና [] ቅጽበታዊ በሆነ ሕብረቁምፊ ላይ [] ይጠሩ.

እንዲሁም በሕብረቁምፊው ቃል በቃል `PrivateKey::try_from_str` መጥራት ትክክለኛውን ቁልፍ ብቻ ያስገኛል ብሎ ማሰብ ተፈጥሯዊ ነው። ስለዚህ በቁልፍ ውስጥ ያሉትን የቢቶች ብዛት ከተሳሳቱ ለምሳሌ 32 ባይት vs 64 የስህተት መልእክት ያስነሳል።

እነዚህ ሁለቱም ግምቶች የተሳሳቱ ናቸው. እንደ አለመታደል ሆኖ የስህተት መልእክቶች ይህን አይነት ውድቀት ለማረም አይረዱም።

እንዴት ማስተካከል እንደሚቻል `hex_literal` ተጠቀም። ይህ ደግሞ አስቀያሚ የቁምፊዎችን ሕብረቁምፊ ወደ ጥሩ ትንሽ ሠንጠረዥ ግልጽ የሆነ ሄክሳዴሲማል ቁጥሮች ይለውጠዋል።

::: warning

`try_from_str` አተገባበር እንኳን የተሰጠው ሕብረቁምፊ ትክክለኛ መሆኑን ማረጋገጥ አይችልም `PrivateKey` እና ካልሆነ ያስጠነቅቅዎታል።

አንዳንድ ግልጽ ስህተቶችን ይይዛል, ለምሳሌ, ሕብረቁምፊው ልክ ያልሆነ ምልክት ከያዘ. ነገር ግን፣ ብዙ ቁልፍ ቅርጸቶችን ለመደገፍ አላማ ስለምንሰጥ፣ ሌላ ብዙ ማድረግ አይችልም። እንዲሁም መመሪያ ካላቀረቡ በስተቀር ቁልፉ ለተሰጠው መለያ ትክክለኛው የግል ቁልፍ መሆኑን ማወቅ አይችልም።

:::

እንደነዚህ ዓይነቶቹ ስውር ስህተቶችን ማስወገድ ይቻላል, ለምሳሌ, በቀጥታ ከሕብረቁምፊ ቃል በቃል በማጥፋት, ወይም ትርጉም በሚሰጥባቸው ቦታዎች ላይ አዲስ ቁልፍ-ጥንድ በማመንጨት.
