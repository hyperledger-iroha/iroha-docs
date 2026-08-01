---
translation_locale: am
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የመተግበሪያ ችግሮች {#troubleshooting-deployment-issues}

ይህ ክፍል ለ Iroha 3 ማሰማሪያዎች የችግር መፍታት ጠቃሚ ምክሮችን ይሰጣል ። እርስዎ የሚያጋጥሟቸው ችግሮች እዚህ ካልተገለጹ በቴሌግራም [ ቴሌግራም](https://t.me/hyperledgeriroha) በኩል እኛን ያነጋግሩን ።

## ከተፈጠሩ ዕቃዎች ጋር ይጀምሩ። {#start-with-generated-artifacts}

ለአካባቢያዊ እና ለሙከራ ትግበራዎች በእጅ ከተጻፉ የእኩዮች ፋይሎች ይልቅ በ Kagami የተፈጠሩ ንጥረ ነገሮችን ይመርጣሉ-

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

የተፈጠረው ማውጫ የእኩዮች ውቅር ፣ የመነሻ ቁሳቁስ ፣ የጅምር ስክሪፕቶች እና ለ Iroha 3 ግንባታ መስመር README ይ containsል።

## ፒር አይጀምርም {#peer-does-not-start}

በመጀመሪያ እነዚህን ዕቃዎች ይመልከቱ:

- `irohad --config <path>` በባልደረባው TOML ፋይል ላይ ያሉ ነጥቦች።
- `public_key` እና `private_key` በባልደረባዎች ውቅር ውስጥ ተመሳሳይ ቁልፍ ጥንድ ናቸው.
- `genesis.public_key` የመነሻ ግብይቱን ለመፈረም ጥቅም ላይ የዋለው ቁልፍ ጋር ይዛመዳል.
- የማረጋገጫ የእኩዮች ማንነት BLS-የተለመዱ ቁልፎችን ይጠቀማል ፣ እና `trusted_peers_pop` ለአካባቢያዊ ቁልፍ እና የታመኑ እኩዮችን የመያዝ ማስረጃ ግቤቶችን ይ containsል።
- የ Torii እና P2P ወደቦች ቀድሞውኑ በሌላ ሂደት አልተገደዱም ።
- የ Kura ማከማቻ ማውጫ ወደ ተመሳሳይ ሰንሰለት የሚመዘገብ ሲሆን ከተለየ የአውታረ መረብ መገለጫ አልተገለጸም ።

ዳይሞን ከአንድ በላይ TOML ንብርብሮች ሲያነብ የኮንፊግሪንግ መከታተልን ይጠቀሙ

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker እና ማቀናበር {#docker-and-compose}

Generate ከወቅቱ Kagami localnet ውፅዓት ይፃፉ ስለዚህ የኮማንድ-መስመር ክርክር እና የማዋቀር ፋይሎች ከተረጋገጠው ኮድ ጋር ይጣጣማሉ:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

የኮምፖዝ ማሰማራት ከተጀመረ እና ከዚያ ከተቆረጠ በኋላ, ለ:

- የተሳሳተ `chain`
- አንድ ባልደረባ የተለየ የጄኔሲስ ግብይት ወይም ማኒፌስት በመጠቀም
- በኮንቴይነር አውታረመረብ ውስጥ ብቻ የሚሰሩ ማስታወቂያ የተሰጡ P2P አድራሻዎች
- ከተወለደ በኋላ አካባቢያዊ መጠን እንደገና ጥቅም ላይ መዋል

አዲስ ጀኔሲስ በሚፈተንበት ጊዜ አሮጌውን Kura ጥራዞችን ከመጀመሩ በፊት ያስወግዱ. አሮጌውን ብሎክ ከአዲስ ጀኔዝ ጋር ማከማቸት መልሶ መጫወት እንዳይሳካ ያደርጋል.

## ኩበርኔትስ {#kubernetes}

ለ Kubernetes, እያንዳንዱን ማረጋገጫ እንደ ሁኔታ የተሞላ መሠረተ ልማት አድርገው ይመለከቱት

- ለእያንዳንዱ እኩዮች የተረጋጋ የማንነት ቁልፍ እና የተረጋጋ ቀጣይነት ያለው መጠን ይስጡ
- ሌሎች እኩዮች ከቡድኑ ውስጡ ሊፈቱ የሚችሉትን P2P አድራሻዎች ያጋለጥሉ
- የማውጫ ውቅር እና የመነሻ ፋይሎችን ለስርጭት የማይለወጥ ውቅር አድርገው ይጠቀማሉ
- ሁሉም የጄኔሲስ ወይም የቶፖሎጂ ለውጦች ሆን ተብሎ ይተገበራሉ ፣ እንደ አውቶማቲክ የማዋቀር ካርታ ማዘመን አይደለም

አንድ ፖድ በተደጋጋሚ እንደገና ከተጀመረ በፖድ ውስጥ የተሰየመውን ውቅር ከሚጠበቀው [`peer.template.toml`](/am/reference/peer-config/index.md#template) ጋር ያነፃፅሩ እና የባልደረባው አሮጌ Kura መረጃዎችን እየተጫወተ መሆኑን ይፈትሹ.

## የሶራ መገለጫ {#sora-profile}

Iroha 3 Nexus ፣ SoraFS ወይም ባለብዙ መስመሮች ፍሰቶችን የሚጠቀሙ ልውውጦች የሶራ መገለጫ በተቻለ ሁኔታ ዳይሞንን ማስጀመር አለባቸው:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

በተመሳሳይ አውታረመረብ ውስጥ ባሉ ማረጋገጫ ሰጪዎች ላይ ተመሳሳይ መገለጫን በተከታታይ ይጠቀሙ።
