---
translation_locale: am
translation_source: /help/deployment-issues.md
translation_source_hash: 3e4042ed4e92a8df567f3500a84cfe32a3d10e22663204b07423ff4cf0fd0c5c
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# የማሰማራት ችግሮችን መላ መፈለግ {#troubleshooting-deployment-issues}

ይህ ክፍል ለ Iroha 3 ማሰማራት የመላ መፈለጊያ ምክሮችን ይሰጣል። እያጋጠመዎት ያለው ችግር እዚህ ካልተገለጸ፣ በ[ቴሌግራም](https://t.me/hyperledgeriroha) በኩል ያግኙን።

## በተፈጠሩ አርቲፋክቶች ይጀምሩ {#start-with-generated-artifacts}

ለአካባቢያዊ እና ለሙከራ ማሰማራት፣ በእጅ ከተጻፉ የአውታረ መረብ አቻ ፋይሎች ይልቅ በ Kagami የተፈጠሩ አርቲፋክቶችን ይምረጡ -

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

የተፈጠረው ማውጫ የአውታረ መረብ አቻ ውቅሮችን፣ የብሎክቼይን ጀነሲስ ቁሳቁሶችን፣ የመነሻ ስክሪፕቶችን እና README ለ Iroha 3 የግንባታ መስመር ይዟል።

## የአውታረ መረብ አቻ አይጀምርም {#peer-does-not-start}

መጀመሪያ እነዚህን እቃዎች ያረጋግጡ -

- `iroha3d --config <path>` የአውታረ መረቡን አቻ የራሱን TOML ፋይል ይጠቁማል።
- `public_key` እና `private_key` በኔትወርክ አቻ ውቅር ውስጥ የአንድ ቁልፍ ጥንድ ናቸው።
- `genesis.public_key` የብሎክቼይን ጀነሲስ ግብይትን ለመፈረም ጥቅም ላይ ከሚውለው ቁልፍ ጋር ይዛመዳል።
- አረጋጋጭ አውታረ መረብ የአቻ ማንነቶች BLS-መደበኛ ቁልፎችን ይጠቀማሉ፣ እና `trusted_peers_pop` ለአካባቢያዊ ቁልፍ እና ለታመኑ የአውታረ መረብ እኩዮች የይዞታ ማረጋገጫ ግቤቶችን ይዟል።
- ለ Torii እና P2P ወደቦች ቀድሞውኑ በሌላ ሂደት የታሰሩ አይደሉም።
- የ Kura የመደብር ማውጫ የተመሳሳይ ሰንሰለት ነው እና ከተለየ የአውታረ መረብ መገለጫ አልተገለበጠም።

ዴሞን ከአንድ በላይ TOML ንብርብር ሲያነብ የማዋቀሪያ ፍለጋን ይጠቀሙ -

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker እና ያፃፉ {#docker-and-compose}

ከአንድ የምንጭ ኮድ ስሪት በተገነቡ ሁለትዮሽ ፋይሎች አራት አረጋጋጭ አንጓዎችን በDocker ለማስኬድ የ[አስጀምር Iroha 3](/am/get-started/launch-iroha.md) መመሪያን ይከተሉ።

የአረጋጋጮቹን መዝገቦች ለማየት ከመሣሪያው ማውጫ `python3 poc.py logs` ያሂዱ።

የቅንብር ማሰማራት ከጀመረ እና ከቆመ፣ የዴሞን ምዝግብ ማስታወሻዎችን ለሚከተሉት ይፈትሹ -

- ያልተዛመደ `chain`
- የተለየ የብሎክቼይን ጀነሲስ ግብይት ወይም ቴክኒካል ማኒፌስት በመጠቀም አንድ የአውታረ መረብ አቻ
- በኮንቴይነር አውታረመረብ ውስጥ ብቻ የሚሰሩ የማስታወቂያ P2P አድራሻዎች
- የብሎክቼይን ጀነሲስን እንደገና ካዳበረ በኋላ የአካባቢ መጠን እንደገና ጥቅም ላይ ይውላል

ለአዲስ የመነሻ ብሎክ የአንጓው ማከማቻ ባዶ መሆን አለበት። ተመሳሳዩን አውታረ መረብ እንደገና ለማስኬድ `python3 poc.py down` እና ከዚያ `python3 poc.py up` ያሂዱ። `state/` ከአራቱ የDocker ማከማቻ ጥራዞች ጋር ያስቀምጡ።

## ኩበርኔትስ {#kubernetes}

ለ Kubernetes፣ እያንዳንዱን አረጋጋጭ እንደ ሁኔታ መሠረተ ልማት ይያዙት -

- ለእያንዳንዱ የአውታረ መረብ አቻ የተረጋጋ የመታወቂያ ቁልፍ እና የተረጋጋ የማያቋርጥ መጠን ይስጡ
- ሌሎች የአውታረ መረብ እኩዮች ከክላስተር ውስጥ ሆነው ሊፈቷቸው የሚችሏቸውን P2P አድራሻዎችን ያጋልጡ
- ውቅር እና blockchain Genesis ፋይሎችን ለልቀት የማይለወጥ ውቅር አድርጎ ተራራ
- ሁሉንም የብሎክቼይን ጀነሲስ ወይም ቶፖሎጂ ለውጦችን ሆን ብለው ያውጡ እንጂ እንደ አውቶማቲክ የማዋቀር-ካርታ እድሳት አይደለም

አንድ ፖድ በተደጋጋሚ እንደገና ከጀመረ፣ በፖድ ውስጥ የተሰራውን ውቅር ከተጠበቀው ጋር ያወዳድሩ [`peer.template.toml`](/am/reference/peer-config/index.md#template) እና የአውታረ መረብ አቻው ያረጀውን እየተጫወተ መሆኑን ያረጋግጡ Kura ውሂብ.

## የSORA Nexus መገለጫ {#sora-profile}

SORA Nexus፣ SoraFS ወይም በርካታ መስመሮችን በሚጠቀም የግል ወይም አካባቢያዊ የIroha 3 ዝርጋታ ላይ፣ ይህን መገለጫ አንቅተው መደበኛውን የበስተጀርባ አገልግሎት ያስጀምሩ።

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

በተመሳሳይ አውታረ መረብ ውስጥ ባሉ አረጋጋጮች ላይ ተመሳሳዩን መገለጫ በቋሚነት ይጠቀሙ።

ይፋዊ Taira አረጋጋጮች የ Taira ትክክለኛ ሰንሰለት፣ ዝርዝር፣ የተሰናከለ የተከተተ-SoraFS ማከማቻ እና የአሂድ ጊዜ ፈራሚ መገለጫን የሚያስፈጽም የተወሰነውን አስጀማሪ ይጠቀማሉ። ከመጀመርዎ በፊት የተሰራውን Taira ውቅር ያረጋግጡ -

```bash
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

ይፋዊ አይጀምሩ Taira አረጋጋጭ ከአጠቃላይ ጋር `iroha3d`; ተመልከት [`iroha3d` CLI ማጣቀሻ](/am/reference/iroha3d-cli.md) ለተፈፀመው መገለጫ.
