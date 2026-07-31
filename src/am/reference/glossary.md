---
translation_locale: am
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ግሎሰሪ <!-- omit in toc --> {#glossary}

እዚህ ሁሉንም ፍቺዎች ማግኘት ይችላሉ Iroha- የተዛመዱ አካላት።

- [እኩዮች](#peer)
- [ንብረቶች](#asset)
- [የቢዛንታይን ጉድለት መቻቻል (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha አካላት](#iroha-components)
  - [Sumeragi (ንጉሠ ነገሥት)](#sumeragi-emperor)
  - [Torii (ጌት)](#torii-gate)
  - [Kura (አስከሬን)](#kura-warehouse)
  - [Kagami(መምህር እና ምሳሌ እና/ወይም መስታወት)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [የሜርክል ዛፍ (ሃሽ ዛፍ)](#merkle-tree-hash-tree)
  - [ብልህ ኮንትራት](#smart-contracts)
  - [ተነሳሽነት](#triggers)
  - [የቅጂ አወጣጥ](#versioning)
  - [ሂጂሪ (የእኩዮች ስም ስርዓት)](#hijiri-peer-reputation-system)
- [Iroha ሞጁሎች](#iroha-modules)
- [Iroha ልዩ መመሪያ (ISI)](#iroha-special-instructions-isi)
  - [አጠቃቀም Iroha ልዩ መመሪያዎች](#utility-iroha-special-instructions)
  - [ኮር Iroha ልዩ መመሪያዎች](#core-iroha-special-instructions)
  - [የጎራ-ተኮር Iroha ልዩ መመሪያዎች](#domain-specific-iroha-special-instructions)
  - [ብጁ Iroha ልዩ መመሪያ](#custom-iroha-special-instruction)
- [Iroha ጥያቄ](#iroha-query)
- [ለውጥ ይመልከቱ](#view-change)
- [የዓለም ሁኔታ እይታ (WSV)](#world-state-view-wsv)
- [መሪ](#leader)

## የብሎክቼይን መለያዎች {#blockchain-ledgers}

የብሎክቼይን መለያዎች በብሎክቼይንን የሚጠቀሙ ዲጂታል መዝገብ-ማቆየት ስርዓቶች ናቸው
የፋይናንስ መዝገቦችን ለማቆየት የሚያስችል ቴክኖሎጂ።
ለገንዘብ መዝገብ እንደ ዋጋዎች ፣ ዜና እና
የግብይት መረጃ።

በመካከለኛው ዘመን መፅሐፍት ለሕዝብ ክፍት ነበሩ
ትክክለኛነት ማረጋገጫ ይህ ሀሳብ በብሎክቼይን ላይ የተመሠረተ
የተከማቹትን መረጃዎች ትክክለኛነት ማረጋገጥ የሚችሉ ስርዓቶች።

## እኩዮች {#peer}

አንድ እኩይ Iroha ማለት ነው Iroha ሌሎች የሂደቱ ምሳሌ Iroha ሂደቶች
እና የደንበኛ መተግበሪያዎች መገናኘት ይችላሉ.
አንድ ማሽን ብዙዎችን ማስተናገድ ይችላል Iroha እኩዮች።
የእኩዮች እኩልነት ያላቸውን ሀብቶችና ችሎታዎች በተመለከተ፣
ከዋና ልዩነት በስተቀር: እኩዮቹ ውስጥ አንዱ ብቻ ይሮጣል
የጅነሲስ ብሎክ በ bootstrapping ደረጃ ላይ Iroha አውታረመረብ።

ሌሎች ብሎክቼኖች እንደ ኖድ ወይም ማረጋገጫ ተመሳሳይ ፅንሰ-ሀሳብ ሊያመለክቱ ይችላሉ ።

አንድ እኩያ በአስተናጋጅ ስርዓቱ ላይ ሂደት ሊሆን ይችላል.
በተጨማሪም በ Docker ኮንቴይነር እና የኩበርኔትስ ካፕል።

## ንብረቶች {#asset}

በብሎክቼይኖች አውድ ውስጥ አንድ ንብረት ዋጋ ያለው ንብረትን ይወክላል
በብሎክቼይኑ ላይ ያለው ነገር።

ተጨማሪ መረጃ ስለ ንብረቶች ይገኛል
[እዚህ](/am/blockchain/assets.md).

### ተለዋዋጭ ንብረቶች {#fungible-assets}

እነዚህ ንብረቶች በቀላሉ ተመሳሳይ ዓይነት ለሌሎች ንብረቶች ሊለዋወጡ ይችላሉ ምክንያቱም
ተለዋዋጭ ናቸው።

ለምሳሌ ያህል፣ ሁሉም የአንድ አይነት ምንዛሬ አሃዶች እኩል ዋጋ ያላቸው እና
በተለምዶ, fungible ንብረቶች ተመሳሳይ ናቸው
የባንክ ኖቶችና ሳንቲሞች ከተበላሹ በስተቀር።

### የማይበሰብሱ ንብረቶች {#non-fungible-assets}

የማይበዙ ሀብቶች ልዩ እና ዋጋ ያላቸው ናቸው
ባሕርያቱና ድሩትነታቸው፤ ዋጋቸው ከሌሎች ንብረቶች ጋር ሊወዳደር አይችልም።

- የሥዕሉ ዋጋ በአርቲስት፣ በጊዜው
  በሥዕሉ ላይ የተሳሳተ አመለካከት ያላቸው ሰዎች
- በአንድ ጎዳና ላይ ሁለት ቤቶች የተለያዩ የጥገና ደረጃዎች ሊኖራቸው ይችላል።
- የጌጣጌጥ አምራቾች በተለምዶ የተለያዩ ዲዛይኖችን ይሰጣሉ።

### ሊታከሙ የሚችሉ ንብረቶች {#mintable-assets}

አንድን ንብረት ማምረት የሚቻለው ከአንድ አይነት በላይ ልቀቶች ቢኖሩ ነው።

### የማይወጣ ንብረት {#non-mintable-assets}

የአንድ ንብረት የመጀመሪያ መጠን አንድ ጊዜ ከተገለጸ እና የማይለወጥ ከሆነ,
የማይበላሽ ተደርጎ ይቆጠራል።

የ [የዘፍጥረት ብሎክ](/am/guide/configure/genesis.md) ይህ መረጃ ለ
የ Iroha ውቅር።

## የቢዛንታይን ጉድለት መቻቻል (BFT) {#byzantine-fault-tolerance-bft}

አንድ አውታረ መረብ ጋር በአግባቡ መስራት የሚችልበት ባህሪ
የተወሰኑ ተንኮለኛ ተዋናዮች። Iroha ሊሠራ የሚችል ነው
በ peer-to-peer አውታረመረብ ውስጥ እስከ 33% የሚደርሱ ተንኮለኛ ተዋናዮች አሉት።

## Iroha አካላት {#iroha-components}

Rust የያዘ ሞጁል Iroha ተግባራዊነት።

### Sumeragi (ንጉሠ ነገሥት) {#sumeragi-emperor}

የ Iroha ለስምምነት ኃላፊነት ያለው ሞዱል።

### Torii (ጌት) {#torii-gate}

የተቀበለውን ጥያቄ የማስተዳደር ሎጂክ ጋር ሞጁል [እኩዮች](#peer). ጥቅም ላይ ይውላል
የሚመጡትን መመሪያዎች መቀበል፣ መቀበልና ማስተላለፍ፤ እንዲሁም HTTP ጥያቄዎች, እንዲሁም
እንደ የስራ ሰዓት ውቅር ዝማኔዎች።

### Kura (አስከሬን) {#kura-warehouse}

የማያቋርጥ ብሎክ ማከማቻ። Kura መደብር የተፈረሙ ብሎኮች ፣ የብሎክ ሃሽስ ፣ ቁመት
መረጃ ጠቋሚዎች፣ የማገገም ጎን መደርደሪያዎች እና በዲስክ ላይ የተቀመጡ የኮምፕሊኬሽን ሜታዳታ
[የዓለም ሁኔታ አመለካከት](#world-state-view-wsv) ከ Kura አንድ
የአገሪቱ ቅጽበታዊ ገጽ እይታ አይገኝም ወይም በአካባቢው ብሎክ መደብር ውስጥ ይገኛል።
[Kura ማከማቻ](/am/blockchain/world.md#kura-storage).

### Kagami(መምህር እና ምሳሌ እና/ወይም መስታወት) {#kagami-teacher-and-exemplar-and-or-looking-glass}

በጣም የተለመዱ ውሂብ ማመንጫ. ይህ የክሪፕቶግራፊ ቁልፍ ጥንዶች መፍጠር ይችላሉ,
የጄኔሲስ ብሎኮች፣ ሰነዶች ወዘተ.

### የሜርክል ዛፍ (ሃሽ ዛፍ) {#merkle-tree-hash-tree}

በእያንዳንዱ ብሎክ ላይ ያለውን ሁኔታ ለማረጋገጥ እና ለማረጋገጥ ጥቅም ላይ የሚውለው የመረጃ መዋቅር
ቁመት። Iroha የአሁኑ ትግበራ በሁለትዮሽ ዛፍ ነው.
[ውክፔዲያ](https://en.wikipedia.org/wiki/Merkle_tree) ተጨማሪ ዝርዝሮችን ለማግኘት.

### ብልህ ኮንትራት {#smart-contracts}

ስማርት ኮንትራቶች የተወሰኑ ስብስቦች ሲሰሩ የሚሮጡ በብሎክቼን ላይ የተመሠረቱ ፕሮግራሞች ናቸው
የሽያጭ ማረጋገጫ Iroha ስማርት ኮንትራቶች
[ኮር Iroha ልዩ መመሪያዎች](#core-iroha-special-instructions).

### ተነሳሽነት {#triggers}

አንድ ክስተት አይነት Iroha ልዩ መመሪያ
የማገድ ግዴታ፣ ጊዜ (አንዳንድ ማስጠንቀቂያዎች ጋር) ወዘተ
[እዚህ](/am/blockchain/triggers.md).

### የቅጂ አወጣጥ {#versioning}

እያንዳንዱ ጥያቄ በ API የያዘው ስሪት።
የተለያዩ የሁለትዮሽ ስሪቶች ጥምረት ይፈቅዳል Iroha ደንበኛ/ባልደረባ
የሶፍትዌር መስተጋብር, ይህም በተራው ሶፍትዌር ማሻሻያዎች
Iroha አውታረመረብ።

### ሂጂሪ (የእኩዮች ስም ስርዓት) {#hijiri-peer-reputation-system}

Iroha ይህ የግንኙነት ቅድሚያ እንዲሰጥ ያስችለዋል [እኩዮች](#peer)
ጥሩ የመከታተያ መዝገብ ያላቸው እና ሊያስከትሉ የሚችሉ ጉዳቶችን በመቀነስ
ተንኮለኛ [እኩዮች](#peer).

## Iroha ሞጁሎች {#iroha-modules}

የሶስተኛ ወገን ማራዘሚያዎች Iroha ይህም ብጁ ተግባራትን ያቀርባል.

## Iroha ልዩ መመሪያ (ISI) {#iroha-special-instructions-isi}

የስማርት ኮንትራቶች ቤተ-መጽሐፍት Iroha. እነዚህ በ
ወይም ግብይቶች ወይም የተመዘገቡ ክስተት አድማጮች. ISI
[እዚህ](/am/blockchain/instructions.md).

#### አጠቃቀም Iroha ልዩ መመሪያዎች {#utility-iroha-special-instructions}

ይህ ስብስብ [ኢሲ](#iroha-special-instructions-isi) ምክንያታዊ ይዘት አለው
የመሳሰሉ መመሪያዎች `If`, I/O ጋር የተያያዙ እንደ `Notify` እና እንደ
`Sequence`. በአብዛኛው እንደ
[ብጁ መመሪያዎች](#custom-iroha-special-instruction).

### ኮር Iroha ልዩ መመሪያዎች {#core-iroha-special-instructions}

[ልዩ መመሪያዎች](#iroha-special-instructions-isi) እያንዳንዱ ጋር የቀረበ
Iroha እነዚህም አንዳንዶቹ
[የጎራ-ተኮር](#domain-specific-iroha-special-instructions) እንዲሁም
[የአጠቃቀም መመሪያ](#utility-iroha-special-instructions).

### የጎራ-ተኮር Iroha ልዩ መመሪያዎች {#domain-specific-iroha-special-instructions}

ከዘርፉ ጋር የተያያዙ መመሪያዎች፦ ንብረቶች፣ ሂሳቦች፣
እነዚህ መሳሪያዎች አስፈላጊ ናቸው
ለውጦች [የዓለም ሁኔታ አመለካከት](#world-state-view-wsv) በተጠበቀና
በአስተማማኝ መንገድ።

### ብጁ Iroha ልዩ መመሪያ {#custom-iroha-special-instruction}

በ [Iroha ሞጁሎች](#iroha-modules), ደንበኞች ወይም 3 ኛ
ፓርቲዎች. እነዚህ ብቻ በመጠቀም መገንባት ይችላሉ
[ዋና መመሪያዎቹ](#core-iroha-special-instructions). የፎርኪንግ እና
ማሻሻያ Iroha እንደ ልዩ መመሪያዎች የመረጃ ምንጭ ኮድ አይመከርም
የተስማሙበት [እኩዮች](#peer) ውስጥ Iroha ማሰማራት እንደ ጉድለት ይቆጠራል፣
ስለዚህ [እኩዮች](#peer) የተቀየረ ምሳሌን በመጠቀም መዳረሻቸው ይሰርዛል።

## Iroha ጥያቄ {#iroha-query}

የዓለም ሁኔታ እይታን ሳይቀይር ለማንበብ ጥያቄ።
ጥያቄዎች [እዚህ](/am/blockchain/queries.md).

## ለውጥ ይመልከቱ {#view-change}

የስምምነት ሙከራ ሲከሰት የሚካሄድ ሂደት ነው።
አብዛኛውን ጊዜ ይህ አዲስ ምርጫን ያካትታል [መሪ](#leader).

## የዓለም ሁኔታ እይታ (WSV) {#world-state-view-wsv}

የአሁኑን የብሎክቼይን ሁኔታ በመታሰቢያው ውስጥ የሚገኝ መግለጫ። WSV ይዟል
የ `World`, የተዋቀሩ የብሎክ ሃሽዎች፣ የትራንስክሽን ኢንዴክስ፣ የመግባቢያ ቶፖሎጂ፣
በምርመራዎች ውስጥ ጥቅም ላይ የሚውሉ የተገኙ መረጃ ጠቋሚዎች
ብሎኮች እና ከ ሊገነባ ይችላል [Kura](#kura-warehouse). ተመልከት
[የዓለም ሁኔታ አመለካከት](/am/blockchain/world.md#world-state-view-wsv).

## መሪ {#leader}

በኢሮሃ አውታረመረብ ውስጥ አንድ እኩይ በዘፈቀደ ይመረጣል እና ልዩ
ቀጣዩ ብሎክ የመመስረት መብት ይህ መብት በ
የሚያገኙት አውታረመረብ
[የቢዛንታይን ጉድለት ማቋረጥ](#byzantine-fault-tolerance-bft) በኩል
[የእይታ ለውጥ](#view-change).
