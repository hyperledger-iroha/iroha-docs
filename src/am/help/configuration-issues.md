---
translation_locale: am
translation_source: /help/configuration-issues.md
translation_source_hash: b62b106e985933d90dab1258d3b991674dd75d14322f2326148164b0fbee0f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የመዋቅር ችግሮች {#troubleshooting-configuration-issues}

ይህ ክፍል ለችግር መፍታት ጠቃሚ ምክሮችን ይሰጣል Iroha 3 ውቅር. እርግጠኛ ሁን
[ቁልፎቹን አረጋግጠዋል](./overview.md#check-the-keys) በመጀመሪያ ፣ በጣም
የጋራ ምንጭ Iroha.

የሚያጋጥማችሁት ችግር እዚህ ላይ ካልተገለጸ፣
[ቴሌግራም](https://t.me/hyperledgeriroha).

## በ ላይ የዘመኑ ጀኔዝ Docker Compose ማዋቀር {#outdated-genesis-on-a-docker-compose-setup}

ሲጠቀሙ Docker Compose ስሪት Iroha, ሊያጋጥሙህ የሚችሉ
የጋራ መያዣዎች መካከል አንዱ ጋር አለመሳካት ጉዳይ
`Failed to deserialize raw genesis block` ይህ ብዙውን ጊዜ እኩያውን ማለት ነው,
የተፈረመ የጄኔሲስ ግብይት እና የተፈጠረ ውቅር በ
የተለያዩ Iroha ማሻሻያዎች ወይም መገለጫዎች።

እነዚህን ደረጃዎች በመጠቀም አለመሳካቱን ያረጋግጡ:

1. አጠቃቀም `docker ps` የአሁኑን መያዣዎች ለመፈተሽ
   የተፈጠረ መገለጫ, አንተ አብዛኛውን ጊዜ ማየት ይሆናል `hyperledger/iroha:dev`
   ኮንቴይነሮች Docker Compose መገለጫው አራት እኩዮችን ይዟል
   የተፈጠሩ `docker-compose.yml` ሊለያይ ይችላል።

2. መዝገቦቹን ይመልከቱ እና
   `Failed to deserialize raw genesis block` ስህተት.
   Iroha በዴይሞን ሁነታ `docker compose up -d`, አጠቃቀም
   `docker compose logs` ትዕዛዝ.

እንዲህ ዓይነቱን ችግር ለመፍታት የሚቻልበት መንገድ Iroha. ይህ ከሆነ
መሰረታዊ ማሳያ እና አንተ የእኩዮች ውሂብ ለመጠበቅ አያስፈልግዎትም, አንድ ማጣጣም መልሶ ማግኘት
localnet ወይም Docker Compose ጋር ጥቅል Kagami:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

ከዚያም አሮጌውን ኮንቴይነር ሁኔታ ያስወግዱ እና እንደገና ከተቋቋመ
`genesis.signed.nrt`, እኩዮች `config.toml` ፋይሎች እና `client.toml`.

አንተ መልሶ ማቋቋም የሚፈልጉ ከሆነ Iroha የመሣሪያ መረጃዎች የሚከተሉትን ያድርጉ

1. ሁለተኛውን ያገናኙ Iroha የመጀመሪያውን ውሂብ የሚገልጸው እኩያ
   (ከማይሳካ) እኩዮች።
2. አዲሱ ባልደረባ ከመጀመሪያው ባልደረባ ጋር ውሂቡን እንዲያመሳስል ይጠብቁ።
3. አዲሱን እኩያውን ንቁ አድርግ።
4. የጀነሲስ እና ቅንብሮች ፋይሎች ማዘመን የመጀመሪያ እኩዮች ብቻ አካል እንደ
   የተቀናጀ ፍልሰት።

::: info

በቀጥታ ስርጭት ላይ ጄኔሲስን ለመተካት አጠቃላይ አውቶማቲክ ዳግም መጻፍ መንገድ የለም
ይህንን እንደ የተቀናጀ ፍልሰት አድርገው ይያዙ: የቀድሞውን ሁኔታ ጠብቁ,
ተኳሃኝ እኩዮች ወደ, እና ብቻ በኋላ አዲሱ ውቅር ላይ ማረጋገጫዎች ለማንቀሳቀስ
ኦፕሬተሮች የስደት ዕቅድ ላይ ይስማማሉ።

:::

## የግል እና የህዝብ ቁልፎች ባለብዙ ሃሽ ቅርጸት {#multihash-format-of-private-and-public-keys}

ወደ
[የደንበኛው ውቅር](/am/guide/configure/client-configuration.md), ታገኛለህ
እዚህ ላይ ያሉት ቁልፎች
[ባለብዙ ሃሽ ቅርጸት](https://github.com/multiformats/multihash).

ከዚህ በፊት ከብዙ ሃሽ ጋር ካልሰራችሁ
በቀኝ በኩል የቁልፍ ባይትስ ስድስት አሥርተኛ መግለጫ አይደለም
(በአንድ ባይት ሁለት ምልክቶች) ፣ ግን እንደ ASCII ወይም UTF-8),
እና ይደውሉ `from_hex` በሁለቱም ውስጥ የቁጥር ቃል ላይ `public_key` እና
`private_key` ቅጽበት።

በተጨማሪም ጥሪ `PrivateKey::try_from_str` በ
አንድ string ቃል ብቻ ትክክለኛ ቁልፍ ይሰጣል.
ስህተት ቁልፍ ውስጥ ቢቶች, ለምሳሌ 32 ባይትስ 64, ይህም አንድ ስህተት ያስከትላል
መልዕክት.

**እነዚህ ሁለት ግምቶች ስህተት ናቸው።** እንደ አለመታደል ሆኖ የስህተት መልዕክቶች
ይህ ዓይነቱ አለመሳካትን ለማስተካከል አይረዱም.

**እንዴት ማስተካከል እንደሚቻል**: አጠቃቀም `hex_literal`. ይህ ደግሞ አንድ አስከፊ ሰንሰለት ይለውጣል
ቁምፊዎች በግልጽ ስድስት አሥር ቁጥሮች ውስጥ ውብ ትንሽ ሰንጠረዥ ውስጥ.

::: warning

እንኳን የ `try_from_str` ትግበራ የተሰጠው ሰንጠረዥ አንድ
ትክክለኛ `PrivateKey` ካልሆነ ደግሞ አስጠንቅቀህ።

አንዳንድ ግልጽ ስህተቶችን ይይዛል, ለምሳሌ ያህል ገመድ ልክ ያልሆነ ይዘዋል ከሆነ
ሆኖም ግን, በርካታ ቁልፍ ቅርጸቶች ለመደገፍ ዓላማችን ስለሆነ, ብዙ ማድረግ አይችሉም
ቁልፉ _ትክክለኛ_ የግል ቁልፍ _ለተሰጠው
ሂሳብ_ መመሪያ ካልሰጠህ በስተቀር።

:::

These አንዳንድ ጥቃቅን ስህተቶች ለምሳሌ
በቀጥታ ከቁምፊ ፊደላት ወይም ትኩስ በሆነ መንገድ በመፍጠር
ትርጉም ባለው ቦታ ላይ ቁልፍ ጥንድ.
