---
translation_locale: am
translation_source: /help/deployment-issues.md
translation_source_hash: c220e127bc8081c9b457dfd67101aa44fb80d79c461cc7a7eda99584d74a8f19
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

የትእዛዝ መስመር ክርክሮች እና አዋቅር ፋይሎች ከተፈተሸው ኮድ ጋር እንዲዛመዱ ከአሁኑ Kagami localnet ውፅዓት ያቅርቡ

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

የቅንብር ማሰማራት ከጀመረ እና ከቆመ፣ የዴሞን ምዝግብ ማስታወሻዎችን ለሚከተሉት ይፈትሹ -

- ያልተዛመደ `chain`
- የተለየ የብሎክቼይን ጀነሲስ ግብይት ወይም ቴክኒካል ማኒፌስት በመጠቀም አንድ የአውታረ መረብ አቻ
- በኮንቴይነር አውታረመረብ ውስጥ ብቻ የሚሰሩ የማስታወቂያ P2P አድራሻዎች
- የብሎክቼይን ጀነሲስን እንደገና ካዳበረ በኋላ የአካባቢ መጠን እንደገና ጥቅም ላይ ይውላል

አዲስ የብሎክቼይን ጀነሲስ ሲሞክሩ ቁልሉን እንደገና ከመጀመርዎ በፊት የድሮውን Kura ጥራዞች ያስወግዱ። የድሮውን የብሎክ ማከማቻ በአዲስ blockchain ጀነሲስ ማቆየት እንደገና ማጫወት እንዲሳካ ያደርገዋል።

## ኩበርኔትስ {#kubernetes}

ለ Kubernetes፣ እያንዳንዱን አረጋጋጭ እንደ ሁኔታ መሠረተ ልማት ይያዙት -

- ለእያንዳንዱ የአውታረ መረብ አቻ የተረጋጋ የመታወቂያ ቁልፍ እና የተረጋጋ የማያቋርጥ መጠን ይስጡ
- ሌሎች የአውታረ መረብ እኩዮች ከክላስተር ውስጥ ሆነው ሊፈቷቸው የሚችሏቸውን P2P አድራሻዎችን ያጋልጡ
- ውቅር እና blockchain Genesis ፋይሎችን ለልቀት የማይለወጥ ውቅር አድርጎ ተራራ
- ሁሉንም የብሎክቼይን ጀነሲስ ወይም ቶፖሎጂ ለውጦችን ሆን ብለው ያውጡ እንጂ እንደ አውቶማቲክ የማዋቀር-ካርታ እድሳት አይደለም

አንድ ፖድ በተደጋጋሚ እንደገና ከጀመረ፣ በፖድ ውስጥ የተሰራውን ውቅር ከተጠበቀው ጋር ያወዳድሩ [`peer.template.toml`](/am/reference/peer-config/index.md#template) እና የአውታረ መረብ አቻው ያረጀውን እየተጫወተ መሆኑን ያረጋግጡ Kura ውሂብ.

## የሶራ መገለጫ {#sora-profile}

Nexus፣ SoraFS ወይም ባለብዙ መስመር ፍሰቶችን የሚጠቀሙ የግል ወይም የአካባቢ Iroha 3 ማሰማራቶች መደበኛውን ዴሞን በሶራ መገለጫ መጀመር አለባቸው -

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
