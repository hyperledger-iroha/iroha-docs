---
translation_locale: am
translation_source: /help/configuration-issues.md
translation_source_hash: b62b106e985933d90dab1258d3b991674dd75d14322f2326148164b0fbee0f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የማዋቀር ችግር መፍታት {#troubleshooting-configuration-issues}

ይህ ክፍል ለ Iroha 3 ውቅር የችግር መፍታት ምክሮችን ያቀርባል. በ Iroha ውስጥ በጣም የተለመደው ችግር ምንጭ ስለሆነ በመጀመሪያ [ ቁልፎችን ](./overview.md#check-the-keys) እንዳረጋገጡ እርግጠኛ ይሁኑ።

ያጋጠማችሁት ችግር እዚህ ካልተገለጸ በ [ቴሌግራም ](https://t.me/hyperledgeriroha) በኩል እኛን ያነጋግሩን.

## በ Docker Compose ማቀነባበሪያ ጊዜ ያለፈበት ትውልድ {#outdated-genesis-on-a-docker-compose-setup}

ሲጠቀሙ Docker Compose ስሪት Iroha, አንድ የእኩዮች ኮንቴይነር ችግሩን ሊያጋጥማችሁ ይችላል `Failed to deserialize raw genesis block` ይህ በተለምዶ ማለት ነው የእኩዮች, የተፈረመ የጄኔስ ግብይት, እና የተፈጠረውን ውቅር የተለያዩ Iroha ማሻሻያዎች ወይም መገለጫዎች።

ስህተቱን በእነዚህ ደረጃዎች ያረጋግጡ:

1. የአሁኑን መያዣዎች ለመፈተሽ `docker ps` ይጠቀሙ። በተፈጠረው መገለጫ ላይ በመመርኮዝ አብዛኛውን ጊዜ `hyperledger/iroha:dev` መያዣዎችን ታያለህ ። ነባሪው Docker Compose መገለጫ አራት የእኩዮች መያዣಗಳನ್ನು ያካትታል ፣ ምንም እንኳን የተፈጠረው `docker-compose.yml` ሊለያይ ይችላል ።

2. መዝገቦቹን ይመልከቱ እና የ `Failed to deserialize raw genesis block` ስህተት ይፈልጉ. እርስዎ Iroha በ daemon ሁነታ ውስጥ `docker compose up -d` ጋር ጀምረዋል ከሆነ, የ `docker compose logs` ትእዛዝ ይጠቀሙ.

እንዲህ ዓይነቱን ችግር ለመፍታት የሚቻልበት መንገድ በ Iroha. ይህ መሠረታዊ ማሳያ ከሆነ እና የእኩዮች ውሂብ ማስቀመጥ አያስፈልግዎትም, አንድ ተዛማጅ localnet ወይም Docker Compose ጋር ጥቅል Kagami:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

ከዚያ አሮጌውን የመያዣ ሁኔታ ያስወግዱ እና ከተቀየሩት `genesis.signed.nrt`, peer `config.toml` ፋይሎች እና `client.toml` ዳግም ይጀምሩ።

የ Iroha ምሳሌ ውሂብ መልሶ ማግኘት ከፈለጉ የሚከተሉትን ያድርጉ:

1. ከመጀመሪያው (ከማይሳካ) እኩያ የተገኘውን መረጃ የሚገልጸውን ሁለተኛውን Iroha እኩይ ያገናኙ።
2. አዲሱ ባልደረባ ከመጀመሪያው ባልደረባ ጋር መረጃውን እንዲያመሳስል ይጠብቁ።
3. አዲሱን ባልደረባ ንቁ አድርጉ።
4. የመጀመሪያውን እኩያ የጄኔሲስ እና የመዋቅር ፋይሎችን እንደ የተቀናጀ ፍልሰት አካል ብቻ ያዘምኑ።

::: info

በቀጥታ አውታረመረብ ላይ ጄኔሲስን ለመተካት ምንም ዓይነት አጠቃላይ ራስ-ሰር ዳግም መጻፍ መንገድ የለም ። ይህንን የተቀናጀ ፍልሰት አድርገው ይመለከቱት: የቀድሞውን ሁኔታ ይጠብቁ ፣ ተኳሃኝ እኩዮችን ያመጣሉ ፣ እና ኦፕሬተሮች ስለ ፍልሰት ዕቅድ ከተስማሙ በኋላ ብቻ ማረጋገጫ ሰጪዎችን ወደ አዲሱ ውቅር ያስተላልፉ ።

:::

## የግል እና የህዝብ ቁልፎች ባለብዙ-ሃሽ ቅርጸት {#multihash-format-of-private-and-public-keys}

የ [የደንበኞችን ውቅር ](/am/guide/configure/client-configuration.md) ከተመለከቱ በዚያ ያሉት ቁልፎች በ [ ባለብዙ-ሃሽ ቅርጸት ](https://github.com/multiformats/multihash) እንደተሰጡ ያስተውላሉ ።

ከዚህ በፊት ባለብዙ-ሃሽ ጋር ካልሰራችሁ በስተቀኝ በኩል የቁልፍ ባይቶች (በአንድ ባይት ሁለት ምልክቶች) ስድስት አሥርተኛ መግለጫ እንዳልሆነ መገመት ተፈጥሯዊ ነው ፣ ነገር ግን እንደ ASCII (ወይም UTF-8) የተቀየሱ ባይቶች ናቸው ። እንዲሁም `public_key` እና `private_key` በሁለቱም ቅደም ተከተል ፊደላት ላይ `from_hex` ይደውሉ ።

`PrivateKey::try_from_str` በ string literal ላይ መደወል ትክክለኛውን ቁልፍ ብቻ ያስገኛል ብሎ መገመትም ተፈጥሯዊ ነው። ስለዚህ በቁልፍ ውስጥ ያሉትን ቢቶች ብዛት በተሳሳተ መንገድ ካገኙ ፣ ለምሳሌ 32 ባይትስ vs 64 ፣ ይህ የስህተት መልእክት ያነሳል።

እነዚህ ሁለት ግምቶችም የተሳሳቱ ናቸው። የሚያሳዝነው ግን የስህተት መልዕክቶቹ ይህንን ልዩ ዓይነት አለመሳካትን ለመፍታት አይረዱም።

እንዴት ማስተካከል እንደሚቻል: `hex_literal` ይጠቀሙ. ይህ ደግሞ አንድ አስጸያፊ ቁምፊዎች ቅደም ተከተል ግልጽ hexadecimal ቁጥሮች ወደ ቆንጆ ትንሽ ሰንጠረዥ ይቀየራል.

::: warning

የ `try_from_str` ትግበራ እንኳን የተሰጠው ገመድ ትክክለኛ የሆነ `PrivateKey` መሆኑን ማረጋገጥ አይችልም እና ካልሆነ ያስጠነቅቃል።

ይህም አንዳንድ ግልጽ ስህተቶችን ይይዛል, ለምሳሌ ያህል ሰንሰለት ልክ ያልሆነ ምልክት ይዟል ከሆነ. ይሁን እንጂ ብዙ ቁልፍ ቅርጸቶች ለመደገፍ ዓላማችን ስለሆነ, ይህ ሌላ ምንም ነገር ማድረግ አይችሉም. አንተ መመሪያ ማቅረብ በስተቀር ቁልፍ የተሰጠው መለያ ትክክለኛ የግል ቁልፍ መሆኑን ማወቅ አይችልም.

:::

እነዚህ ዓይነቶች ጥቃቅን ስህተቶች ሊወገዱ ይችላሉ ፣ ለምሳሌ ፣ በቀጥታ ከቁምፊ ፊደላት በማውረድ ወይም ትርጉም በሚሰጥባቸው ቦታዎች ላይ አዲስ ቁልፍ-ፓር በመፍጠር ።
