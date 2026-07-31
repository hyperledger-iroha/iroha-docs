---
translation_locale: am
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የመተግበሪያ ችግሮችን መፍታት {#troubleshooting-deployment-issues}

ይህ ክፍል ለችግር መፍታት ጠቃሚ ምክሮችን ይሰጣል Iroha 3 ችግሩ
የምታጋጥመው ነገር እዚህ አልተገለጸም፣
እኛን በ [ቴሌግራም](https://t.me/hyperledgeriroha).

## ከተፈጠሩ ዕቃዎች ይጀምሩ {#start-with-generated-artifacts}

ለአካባቢያዊ እና የሙከራ ልውውጦች በ Kagami በምትኩ
በእጅ የተጻፉ የእኩዮች መዝገቦች

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

የተፈጠረው ማውጫ የእኩዮችን ውህዶች, የጄኔሲስ ቁሳቁሶችን, ጅምርን ይ containsል
ጽሑፎች, እና README ለ Iroha 3 የግንባታ መስመር.

## እኩዮች አይጀምሩም {#peer-does-not-start}

በመጀመሪያ እነዚህን ዕቃዎች ይመልከቱ:

- `irohad --config <path>` የእኩዮቹ ነጥቦች TOML መዝገብ።
- `public_key` እና `private_key` በባልደረባዎች መለያ ውስጥ ተመሳሳይ ቁልፍ ይኑራቸው
  ባልና ሚስት።
- `genesis.public_key` የጄኔሲስ ግብይቱን ለመፈረም የተጠቀመውን ቁልፍ ይዛመዳል።
- የማረጋገጫ የእኩዮች ማንነት አጠቃቀም BLS- መደበኛ ቁልፎች, እና `trusted_peers_pop`
  ለአካባቢያዊ ቁልፍ እና ለታመኑ እኩዮች የመያዝ ማስረጃዎችን ይ containsል።
- ወደቦች Torii እና P2P ሌሎች ሂደቶች ቀድሞውኑ አይገደዱም.
- የ Kura የመደብር ማውጫ ወደ ተመሳሳይ ሰንሰለት የሚመዘገብ ሲሆን ከ
  የተለያዩ የኔትወርክ መገለጫዎች።

ዳይሞን ከአንድ በላይ ሲያነበው የኮንፊግሪንግ ትራሲንግ ይጠቀሙ TOML ሽፋን:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker እና አዘጋጅ {#docker-and-compose}

አሁኑን ያዘጋጁ Kagami localnet ውፅዓት ስለዚህ ትዕዛዝ መስመር
አጀንዳዎች እና የኮንፊግ ፋይሎች ከተረጋገጠ ኮድ ጋር ይጣጣማሉ-

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

የኮምፖዝ ማሰማራት ከጀመረ እና ከዚያ ከተቆረጠ በኋላ, ለ:

- የማይመሳሰል `chain`
- አንድ እኩያ የተለየ የጄኔሲስ ግብይት ወይም ማኒፌስት በመጠቀም
- ማስታወቂያ P2P በኮንቴይነር አውታረመረብ ውስጥ ብቻ የሚሰሩ አድራሻዎች
- ከተወለደ በኋላ አካባቢያዊ መጠን እንደገና ጥቅም ላይ መዋል

አዲስ ፍጥረት ሲፈተን አሮጌውን ያስወግዱ Kura ከመጀመሩ በፊት የተከማቸባቸው መጠኖች
አሮጌውን ክምችት ከአዲስ ጅምር ጋር ማከማቸት መልሶ መጫወት እንዳይሳካ ያደርጋል።

## ኩበርኔትስ {#kubernetes}

ለኩበርኔትስ እያንዳንዱን ማረጋገጫ እንደ ሁኔታ የተሞላ መሠረተ ልማት አድርገው ይመለከቱት

- ለእያንዳንዱ እኩዮች የተረጋጋ የማንነት ቁልፍ እና የተረጋጋ ቀጣይነት ያለው መጠን መስጠት
- ማሳያ P2P ሌሎች እኩዮች ከቡድኑ ውስጡ ሊፈቱባቸው የሚችሉ አድራሻዎች
- ለትክክለኛ ልውውጥ የማይቀየር ውቅር ሆኖ የማዋቀር ቅንብሮች እና የጄኔስ ፋይሎች
- ሁሉም የጄኔሲስ ወይም የቶፖሎጂ ለውጦች ሆን ብለው እንጂ እንደ ራስ-ሰር አይደለም
  የማዋቀር ካርታ ማዘመን

አንድ ክምችት በተደጋጋሚ እንደገና ከተጀመረ, በክምችቱ ውስጥ የተሰጠውን ውቅር ከ
የሚጠበቀው [`peer.template.toml`](/am/reference/peer-config/index.md#template) እና
የእኩይ ተመራማሪው አሮጌውን እየተጫወተ መሆኑን ያረጋግጡ Kura መረጃዎች።

## የሶራ መገለጫ {#sora-profile}

Iroha 3 የሚጠቀሙበት አሰራር Nexus, SoraFS, ወይም ባለብዙ መስመሮች ፍሰቶች መጀመር አለባቸው
የሶራ መገለጫ ያለው ዳይሞን:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

በተመሳሳይ አውታረመረብ ውስጥ ባሉ ማረጋገጫ ሰጪዎች ላይ ተመሳሳይ መገለጫን በቋሚነት ይጠቀሙ።
