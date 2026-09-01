---
translation_locale: am
translation_source: /reference/glossary.md
translation_source_hash: ab484310e7e0b0662c1d4bb133e7ae337c71b09b5fdc8e678581234d74ee9b29
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# የቃላት መፍቻ <!-- omit in toc --> {#glossary}

እዚህ ሁሉንም Iroha ተዛማጅ አካላት ፍቺዎችን ማግኘት ይችላሉ።

- [የአውታረ መረብ አቻ](#peer)
- [ንብረት](#asset)
- [የባይዛንታይን ስህተት-መቻቻል (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha አካላት](#iroha-components)
  - [Sumeragi (ንጉሠ ነገሥት)](#sumeragi-emperor)
  - [Torii (በር)](#torii-gate)
  - [Kura (የመጋዘን ኪራይስ)](#kura-warehouse)
  - [Kagami (አስተማሪ እና አርአያ እና/ወይም ብርጭቆ መመልከት)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [የመርክል ዛፍ (ምስጠራ ሃሽ ዛፍ)](#merkle-tree-hash-tree)
  - [ብልጥ ኮንትራቶች](#smart-contracts)
  - [ቀስቅሴዎች](#triggers)
  - [ስሪት መስራት](#versioning)
  - [ሂጂሪ (የአውታረ መረብ አቻ ስም ስርዓት)](#hijiri-peer-reputation-system)
- [Iroha ሞጁሎች](#iroha-modules)
- [Iroha የማስተማር ክዋኔዎች (ISI)](#iroha-special-instructions-isi)
  - [መገልገያ Iroha የማስተማር ስራዎች](#utility-iroha-special-instructions)
  - [ኮር Iroha የማስተማር ስራዎች](#core-iroha-special-instructions)
  - [ጎራ-ተኮር Iroha የመመሪያ ስራዎች](#domain-specific-iroha-special-instructions)
  - [ብጁ Iroha ልዩ መመሪያ](#custom-iroha-special-instruction)
- [Iroha መጠይቅ](#iroha-query)
- [ለውጥ ይመልከቱ](#view-change)
- [የየዓለም ሁኔታ እይታ (WSV)](#world-state-view-wsv)
- [መሪ](#leader)

## የብሎክቼይን መዝገቦች {#blockchain-ledgers}

የብሎክቼይን መዝገቦች የፋይናንሺያል መዝገቦችን ለመጠበቅ የብሎክቼይን ቴክኖሎጂን የሚጠቀሙ ዲጂታል መዝገብ አያያዝ ስርዓቶች ናቸው። የተሰየሙት እንደ ዋጋዎች፣ ዜና እና የግብይት መረጃ ላሉ የፋይናንስ መዝገቦች ጥቅም ላይ በሚውሉ ባህላዊ መጽሃፎች ነው።

በመካከለኛው ዘመን የብሎክቼይን መዝገብ መጽሃፍቶች ለህዝብ እይታ እና ትክክለኛነት ማረጋገጫ ክፍት ነበሩ። ይህ ሃሳብ የተከማቸ ውሂብ ትክክለኛነትን ማረጋገጥ በሚችሉ በብሎክቼይን ላይ በተመሰረቱ ስርዓቶች ውስጥ ይንጸባረቃል።

## የአውታረ መረብ አቻ {#peer}

በ Iroha ውስጥ ያለው የአውታረ መረብ አቻ ማለት ሌሎች Iroha ሂደቶች እና የደንበኛ መተግበሪያዎች የሚገናኙበት የ Iroha ሂደት ምሳሌ ማለት ነው። አንድ ነጠላ ማሽን ብዙ Iroha የአውታረ መረብ እኩዮችን ማስተናገድ ይችላል። የአውታረ መረብ እኩዮች በሀብታቸው እና በችሎታቸው እኩል ናቸው፣ ከአንድ አስፈላጊ በስተቀር ከአውታረ መረቡ እኩዮች አንዱ ብቻ የብሎክቼይን ጀነሲስ ብሎክን በ Iroha አውታረመረብ የማስነሻ ደረጃ ላይ ያካሂዳል።

ሌሎች blockchains እንደ ኖድ ወይም አረጋጋጭ ተመሳሳይ ጽንሰ-ሐሳብ ሊያመለክቱ ይችላሉ።

የአውታረ መረብ አቻ በአስተናጋጅ ስርዓቱ ላይ ሂደት ሊሆን ይችላል። እንዲሁም በ Docker ኮንቴይነር እና በ Kubernetes ፖድ ውስጥ ሊካተት ይችላል።

## ንብረት {#asset}

በብሎክቼይን አውድ ውስጥ፣ ንብረት በብሎክቼይን ላይ ያለ ጠቃሚ ነገር ውክልና ነው።

በንብረቶች ላይ ተጨማሪ መረጃ ይገኛል [እዚህ](/am/blockchain/assets.md).

### ፈንገስ ሊሆኑ የሚችሉ ንብረቶች {#fungible-assets}

እንደነዚህ ያሉት ንብረቶች በቀላሉ ሊለዋወጡ የሚችሉ በመሆናቸው ተመሳሳይ ዓይነት ንብረቶች በቀላሉ ሊለዋወጡ ይችላሉ.

እንደ ምሳሌ, ሁሉም ተመሳሳይ ምንዛሬ ያላቸው ክፍሎች በዋጋ እኩል ናቸው እና እቃዎችን ለመግዛት ሊያገለግሉ ይችላሉ. በተለምዶ የባንክ ኖቶች እና ሳንቲሞች ከመልበስ በስተቀር የፈንገስ ንብረቶች በመልክ ተመሳሳይ ናቸው።

### የማይበገር ንብረቶች {#non-fungible-assets}

የማይበገር ንብረቶች በልዩ ባህሪያቸው እና ብርቅዬነታቸው ምክንያት ልዩ እና ዋጋ ያላቸው ናቸው; ዋጋቸው ከሌሎች ንብረቶች ጋር ሊወዳደር አይችልም.

- የሥዕሉ ዋጋ በአርቲስቱ፣ በተቀባበት ጊዜ እና በህዝቡ ላይ ባለው ፍላጎት ላይ በመመስረት ሊለያይ ይችላል።
- በአንድ ጎዳና ላይ ያሉ ሁለት ቤቶች የተለያየ የጥገና ደረጃ ሊኖራቸው ይችላል.
- የጌጣጌጥ አምራቾች በተለምዶ የተለያዩ ንድፎችን ያቀርባሉ.

### ሊወጡ የሚችሉ ንብረቶች {#mintable-assets}

ብዙ ተመሳሳይ ዓይነት ሊወጣ የሚችል ከሆነ ንብረት ሊቀንስ ይችላል።

### የማይመረቱ ንብረቶች {#non-mintable-assets}

የንብረቱ የመጀመሪያ መጠን አንድ ጊዜ ከተገለጸ እና ካልተለወጠ, የማይመረት እንደሆነ ይቆጠራል.

[blockchain ጀነሲስ ብሎክ](/am/guide/configure/genesis.md) ይህንን መረጃ ለ Iroha ውቅር ያዘጋጃል።

## የባይዛንታይን ስህተት-መቻቻል (BFT) {#byzantine-fault-tolerance-bft}

የተወሰነ መቶኛ ተንኮል አዘል ተዋናዮችን ከያዘ አውታረ መረብ ጋር በትክክል መስራት የመቻል ንብረት። Iroha በአቻ-ለ-አቻ አውታረመረብ ውስጥ እስከ 33% ተንኮል አዘል ተዋናዮች ጋር መስራት ይችላል።.

## Iroha አካላት {#iroha-components}

Iroha ተግባርን የያዙ Rust ሞጁሎች።

### Sumeragi (ንጉሠ ነገሥት) {#sumeragi-emperor}

ለስምምነት ኃላፊነት ያለው Iroha ሞጁል።

### Torii (በር) {#torii-gate}

ሞጁል ከገቢ ጥያቄ አያያዝ አመክንዮ ጋር ለ[የአውታረ መረብ አቻ](#peer)። ገቢ መመሪያዎችን ለመቀበል፣ ለመቀበል እና ለማዞር እና HTTP መጠይቆችን እንዲሁም የሩጫ ጊዜ ውቅር ማሻሻያዎችን ለመቀበል፣ ለመቀበል እና ለማዞር ይጠቅማል።

### Kura (መጋዘን) {#kura-warehouse}

የማያቋርጥ የብሎክ ማከማቻ። Kura የተፈረሙ ብሎኮችን ያከማቻል፣ ምስጠራ ሃሽዎችን፣ የከፍታ ኢንዴክሶችን፣ የመልሶ ማግኛ ረዳት መዝገቦችን እና የብሎክ-ማጠናቀቂያ ዝርዝር ሜታዳታን በዲስክ ላይ ያከማቻል። [የየዓለም ሁኔታ እይታ](#world-state-view-wsv) ከ Kura ብሎኮች እንደገና ይገነባል የስቴት ነጥብ-በ-ጊዜ ውሂብ እይታ በማይገኝበት ጊዜ ወይም ከአካባቢው የብሎክ መደብር በስተጀርባ ነው። [Kura ማከማቻ](/am/blockchain/world.md#kura-storage) ይመልከቱ።

### Kagami (አስተማሪ እና አርአያ እና/ወይም ብርጭቆ መመልከት) {#kagami-teacher-and-exemplar-and-or-looking-glass}

በብዛት ጥቅም ላይ ለሚውለው ውሂብ ጀነሬተር። ክሪፕቶግራፊክ ቁልፍ ጥንዶችን፣ የብሎክቼይን ጀነሲስ ብሎኮችን፣ ሰነዶችን፣ ወዘተ ማመንጨት ይችላል።

### የመርክል ዛፍ (ምስጠራ ሃሽ ዛፍ) {#merkle-tree-hash-tree}

በእያንዳንዱ የብሎክ ቁመት ላይ ያለውን ሁኔታ ለማረጋገጥ እና ለማረጋገጥ የሚያገለግል የውሂብ መዋቅር። Iroha የአሁኑ ትግበራ ሁለትዮሽ ዛፍ ነው። ለተጨማሪ ዝርዝሮች [ውክፔዲያ](https://en.wikipedia.org/wiki/Merkle_tree) ይመልከቱ።

### ብልጥ ኮንትራቶች {#smart-contracts}

ስማርት ኮንትራቶች የተወሰኑ ሁኔታዎች ሲሟሉ የሚሰሩ በብሎክቼይን ላይ የተመሰረቱ ፕሮግራሞች ናቸው። በ Iroha ስማርት ኮንትራቶች [ዋና Iroha መመሪያ ስራዎች](#core-iroha-special-instructions) በመጠቀም ይተገበራሉ።

### ቀስቅሴዎች {#triggers}

በተወሰነ የብሎክ ማጠናቀቂያ፣ ጊዜ (ከአንዳንድ ማስጠንቀቂያዎች ጋር)፣ ወዘተ Iroha ልዩ መመሪያን ለመጥራት የሚፈቅድ የክስተት አይነት። በቀስቅሴዎች ላይ ተጨማሪ [እዚህ](/am/blockchain/triggers.md)።

### ስሪት መስራት {#versioning}

እያንዳንዱ ጥያቄ በሆነበት API ስሪት ተሰይሟል። የተለያዩ የሁለትዮሽ የ Iroha ደንበኛ/አቻ ሶፍትዌር አብረው እንዲሰሩ ያስችላቸዋል፣ ይህ ደግሞ በ Iroha አውታረመረብ ውስጥ የሶፍትዌር ማሻሻያዎችን ይፈቅዳል።

### ሂጂሪ (የአውታረ መረብ አቻ ስም ስርዓት) {#hijiri-peer-reputation-system}

Iroha መልካም ስም ስርዓት። ጥሩ ታሪክ ካላቸው [የአውታረ መረብ እኩዮች](#peer) ጋር ለመግባባት ቅድሚያ መስጠት እና በተንኮል አዘል [የአውታረ መረብ እኩዮች](#peer) ሊደርስ የሚችለውን ጉዳት ለመቀነስ ያስችላል።

## Iroha ሞጁሎች {#iroha-modules}

ብጁ ተግባርን የሚያቀርቡ የሶስተኛ ወገን ቅጥያዎች Iroha

## Iroha የማስተማሪያ ክዋኔዎች (ISI) {#iroha-special-instructions-isi}

በ Iroha የቀረበ የስማርት ኮንትራቶች ቤተ-መጽሐፍት። እነዚህ በግብይቶች ወይም በተመዘገቡ የክስተት አድማጮች በኩል ሊጠሩ ይችላሉ። ተጨማሪ በ ISI [እዚህ](/am/blockchain/instructions.md) ላይ።

#### መገልገያ Iroha የማስተማር ስራዎች {#utility-iroha-special-instructions}

ይህ የ[ይዘቶች](#iroha-special-instructions-isi) ስብስብ እንደ `If`፣ ከI/O ጋር የተያያዙ እንደ `Notify` እና እንደ `Sequence` ያሉ ጥንቅሮች ያሉ አመክንዮአዊ መመሪያዎችን ይዟል። በአብዛኛው እንደ [ብጁ መመሪያዎች](#custom-iroha-special-instruction) ያገለግላሉ።

### ኮር Iroha የማስተማር ስራዎች {#core-iroha-special-instructions}

[ልዩ መመሪያዎች](#iroha-special-instructions-isi) በእያንዳንዱ Iroha ማሰማራት ቀርቧል። እነዚህም የተወሰኑትን [ጎራ-ተኮር](#domain-specific-iroha-special-instructions) እንዲሁም [የመገልገያ መመሪያዎች](#utility-iroha-special-instructions) ያካትታሉ።

### ጎራ-ተኮር Iroha የማስተማሪያ ስራዎች {#domain-specific-iroha-special-instructions}

ከጎራ-ተኮር እንቅስቃሴዎች ጋር የተያያዙ መመሪያዎች ንብረቶች፣ መለያዎች፣ ጎራዎች፣ የአውታረ መረብ አቻ አስተዳደር። እነዚህ በ [የየዓለም ሁኔታ እይታ](#world-state-view-wsv) ላይ ደህንነቱ በተጠበቀ እና ደህንነቱ በተጠበቀ መንገድ ለውጦችን ለማድረግ አስፈላጊ የሆኑትን መሳሪያዎች ይሰጣሉ።

### ብጁ Iroha ልዩ መመሪያ {#custom-iroha-special-instruction}

በ [Iroha ሞጁሎች](#iroha-modules)፣ በደንበኞች ወይም በሶስተኛ ወገኖች የተሰጡ መመሪያዎች። እነዚህ ሊገነቡ የሚችሉት [ዋና መመሪያዎች](#core-iroha-special-instructions) በመጠቀም ብቻ ነው። የ Iroha ምንጭ ኮድ ፎርክ ማድረግ እና ማሻሻል አይመከርም። በ Iroha ማሰማራት ላይ በ[የአውታረ መረብ እኩዮች](#peer) ያልተስማሙ የማስተማሪያ ስራዎች እንደ ስህተት ስለሚቆጠሩ፣ ስለዚህ [የአውታረ መረብ እኩዮች](#peer) የተሻሻለ ምሳሌን ማስኬድ መዳረሻቸው ይሰረዛል።

## Iroha መጠይቅ {#iroha-query}

ያንን አመለካከት ሳይቀይሩ የአለም ስቴት እይታን ለማንበብ የቀረበ ጥያቄ። ተጨማሪ በጥያቄዎች [እዚህ](/am/blockchain/queries.md)።

## ለውጥ ይመልከቱ {#view-change}

ያልተሳካ የስምምነት ሙከራ በሚደረግበት ጊዜ የሚከሰት ሂደት። ብዙውን ጊዜ ይህ አዲስ [መሪ](#leader) ምርጫን ያካትታል።

## የየዓለም ሁኔታ እይታ (WSV) {#world-state-view-wsv}

የአሁኑን የብሎክቼይን ሁኔታ የውስጠ-ማህደረ ትውስታ ውክልና። WSV `World`፣ የተጠናቀቀውን የብሎክ ምስጠራ ሃሽዎች፣ የግብይት ኢንዴክሶች፣ የጋራ መግባባት ቶፖሎጂ፣ እና በመጠይቆች ጥቅም ላይ የሚውሉ የተገኙ ኢንዴክሶች። የሚዘመነው በተጠናቀቁ ብሎኮች ብቻ ነው እና ከ [Kura](#kura-warehouse) እንደገና ሊገነባ ይችላል። [የየዓለም ሁኔታ እይታ](/am/blockchain/world.md#world-state-view-wsv) ይመልከቱ።

## መሪ {#leader}

በ Iroha አውታረመረብ ውስጥ የአውታረ መረብ አቻ በዘፈቀደ ተመርጦ የሚቀጥለውን ብሎክ የመመስረት ልዩ መብት ይሰጠዋል። ይህ መብት [የባይዛንታይን ስህተት መቻቻል](#byzantine-fault-tolerance-bft) በ[ለውጥን ይመልከቱ](#view-change) በኩል በሚያገኙ አውታረ መረቦች ውስጥ ሊሰረዝ ይችላል።
