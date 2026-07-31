---
translation_locale: am
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# መዝገበ ቃላት <!-- omit in toc --> {#glossary}

እዚህ ላይ ከ Iroha ጋር የተያያዙ አካላት ሁሉ ትርጓሜዎችን ማግኘት ይችላሉ ።

- [ፒር](#peer)
- [ንብረት](#asset)
- [የቢዛንቲን ጉድለት መቻቻል (BFT) ](#byzantine-fault-tolerance-bft)
- [Iroha ክፍሎች](#iroha-components)
  - [Sumeragi (ንጉሠ ነገሥት)](#sumeragi-emperor)
  - [Torii (ጌት)](#torii-gate)
  - [Kura (መጋዘን ቤት) ](#kura-warehouse)
  - [Kagami(መምህር እና አርአያ እና/ወይም መስታወት)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [የሜርክል ዛፍ (የሃሽ ዛፍ) ](#merkle-tree-hash-tree)
  - [ስማርት ኮንትራቶች](#smart-contracts)
  - [ማነቃቂያዎች](#triggers)
  - [ስሪት ](#versioning)
  - [ሂጂሪ (የባልደረባ ስም ስርዓት) ](#hijiri-peer-reputation-system)
- [Iroha ሞጁሎች](#iroha-modules)
- [Iroha ልዩ መመሪያ (ISI) ](#iroha-special-instructions-isi)
  - [አጠቃቀም Iroha ልዩ መመሪያዎች](#utility-iroha-special-instructions)
  - [ዋና Iroha ልዩ መመሪያዎች](#core-iroha-special-instructions)
  - [የጎራ-ተኮር Iroha ልዩ መመሪያዎች ](#domain-specific-iroha-special-instructions)
  - [የጉምሩክ Iroha ልዩ መመሪያ](#custom-iroha-special-instruction)
- [Iroha መጠይቅ](#iroha-query)
- [እይታ ለውጥ](#view-change)
- [የዓለም ሁኔታ እይታ (WSV) ](#world-state-view-wsv)
- [መሪ](#leader)

## የብሎክቼይን መለያዎች {#blockchain-ledgers}

የብሎክቼይን መለያዎች የገንዘብ መዝገቦችን ለማቆየት በብሎክቼይን ቴክኖሎጂ የሚጠቀሙ ዲጂታል የመመዝገብ ስርዓቶች ናቸው ። እነዚህ እንደ ዋጋዎች ፣ ዜናዎች እና የግብይት መረጃ ያሉ ለገንዘብ መዝገቦች ጥቅም ላይ የዋሉ ጥንታዊ መጽሐፍት ስም ተሰጥተዋል ።

በመካከለኛው ዘመን, መቁጠሪያ መጽሐፍት ለሕዝብ እይታ እና ትክክለኛነት ማረጋገጫ ክፍት ነበሩ. ይህ ሀሳብ የተከማቹትን መረጃዎች ትክክለኛነት ለመፈተሽ በብሎክቼን ላይ የተመሠረቱ ስርዓቶች ውስጥ ተገልጿል.

## የእኩዮች {#peer}

በ Iroha ውስጥ አንድ እኩይ ማለት ሌሎች Iroha ሂደቶች እና የደንበኛ ትግበራዎች ሊገናኙባቸው የሚችሉበት የ Iroha ሂደት instance ማለት ነው ። አንድ ነጠላ ማሽን በርካታ Iroha እኩዮችን ማስተናገድ ይችላል ። እኩዮች ከቁሳቁሶቻቸው እና አቅማቸው አንፃር እኩል ናቸው ፣ ከአንድ አስፈላጊ ልዩነት ጋር: የ Iroha አውታረመረብ በጅምር ደረጃ ላይ የመነሻ ብሎክን የሚያስተዳድረው ከእኩዮቹ አንዱ ብቻ ነው ።

ሌሎች ብሎክቼኖች እንደ ኖድ ወይም ማረጋገጫ ተመሳሳይ ፅንሰ-ሀሳብ ሊያመለክቱ ይችላሉ ።

አንድ እኩያ በአስተናጋጅ ስርዓቱ ላይ ሂደት ሊሆን ይችላል. በተጨማሪም በ Docker መያዣ እና በ Kubernetes ፖድ ውስጥ ሊቀመጥ ይችላል።

## ንብረቶች {#asset}

በብሎክቼይኖች አውድ ውስጥ አንድ ንብረት በብሎክኬይኑ ላይ ያለውን ጠቃሚ ነገር ይወክላል ።

ስለ ንብረቶች ተጨማሪ መረጃ [ እዚህ ](/am/blockchain/assets.md) ይገኛል።

### ተለዋዋጭ ሀብቶች {#fungible-assets}

እነዚህ ንብረቶች ተለዋዋጭ ስለሆኑ በቀላሉ ለተመሳሳይ ዓይነት ሌሎች ንብረቶች ሊለወጡ ይችላሉ ።

ለምሳሌ ያህል፣ ሁሉም የአንድ ምንዛሬ አሃዶች እኩል ዋጋ ያላቸው ሲሆን ሸቀጦችን ለመግዛት ሊያገለግሉ ይችላሉ። በመደበኛነት ፣ የክፍያ ኖቶች እና ሳንቲሞች ከተበላሹ በስተቀር ተለዋዋጭ ንብረቶች ተመሳሳይ መልክ አላቸው።

### የማይበሰብስባቸው ንብረቶች {#non-fungible-assets}

ተለዋዋጭ ያልሆኑ ንብረቶች በልዩ ባህሪያቸው እና በዝቅተኛነታቸው ምክንያት ልዩና ዋጋ ያላቸው ናቸው፤ እሴታቸው ከሌሎች ንብረቶች ጋር ሊወዳደር አይችልም።

- የአንድ ሥዕል ዋጋ በአርቲስት፣ በተቀረጸበት ጊዜና በሕዝቡ ፍላጎት ላይ በመመርኮዝ ሊለያይ ይችላል።
- በአንድ ጎዳና ላይ ሁለት ቤቶች የተለያዩ የጥገና ደረጃዎች ሊኖራቸው ይችላል።
- የጌጣጌጥ አምራቾች አብዛኛውን ጊዜ የተለያዩ ዲዛይኖችን ይሰጣሉ።

### ሊታከሙ የሚችሉ ንብረቶች {#mintable-assets}

አንድ ንብረትን ማምረት የሚቻለው ተመሳሳይ ዓይነት ተጨማሪ ልውውጥ ቢደረግ ነው።

### የማይወስዱ ንብረቶች {#non-mintable-assets}

የአንድ ንብረት የመጀመሪያ መጠን አንድ ጊዜ ከተጠቀሰ እና ካልተለወጠ የማይቀንስ ይቆጠራል ።

የ [ዘፍጥረት ብሎክ ](/am/guide/configure/genesis.md) ይህን መረጃ ለ Iroha ውቅር ያዘጋጃል.

## የቢዛንታይን ጉድለት መቻቻል (BFT) {#byzantine-fault-tolerance-bft}

Iroha በ peer-to-peer አውታረመረብ ውስጥ እስከ 33% የሚደርሱ ተንኮል አድራጊ አካላት ጋር በትክክል መሥራት የሚችልበት ባህሪ።

## Iroha ክፍሎች {#iroha-components}

Rust ሞጁሎች የ Iroha ተግባርን ይይዛሉ.

### Sumeragi (ንጉሠ ነገሥት) {#sumeragi-emperor}

የ Iroha ሞጁል ለስምምነት ኃላፊነት አለበት.

### Torii (በሩ) {#torii-gate}

[ peer](#peer) ለገባው ጥያቄ አያያዝ አመክንዮ ያለው ሞጁል። የሚገቡ መመሪያዎችን ለመቀበል ፣ ለመቀበል እና ለመምራት እንዲሁም ለ HTTP መጠይቆች እንዲሁም ለስራ ሰዓት ውቅር ዝመናዎች ጥቅም ላይ ይውላል ።

### Kura (የመጋዘን ቤት) {#kura-warehouse}

ቀጣይነት ያለው የብሎክ ማከማቻ። Kura የተፈረሙ ብሎኮችን፣ የብሎክ ሃሽዎችን፣ ከፍታ ማውጫዎችን፣ የመልሶ ማግኛ ጎን መደርደሪያዎችን እና በዲስክ ላይ የሚገኘውን የኮሚት-ሮስተር ሜታዳታ ያስቀምጣል። [ዓለም አቀፍ አመለካከት](#world-state-view-wsv) የተገነባው ከ Kura የአገሪቱ ቅጽበታዊ ገጽ እይታ በማይገኝበት ጊዜ ወይም በአከባቢው የብሎክ መደብር በስተጀርባ. ይመልከቱ [Kura ማከማቻ](/am/blockchain/world.md#kura-storage).

### Kagami(መምህር እና አርአያ እና/ወይም መስታወት) {#kagami-teacher-and-exemplar-and-or-looking-glass}

በተለምዶ ጥቅም ላይ የሚውለው ውሂብ ጄኔሬተር። የክሪፕቶግራፊ ቁልፍ ጥንዶች ፣ የመነሻ ብሎኮች ፣ ሰነድ ፣ ወዘተ ማመንጨት ይችላል።

### የሜርክል ዛፍ (የሃሽ ዛፍ) {#merkle-tree-hash-tree}

Iroha የአሁኑ ትግበራ በሁለትዮሽ ዛፍ ነው. ተጨማሪ ዝርዝሮችን ለማግኘት [ዊኪፔዲያ](https://en.wikipedia.org/wiki/Merkle_tree) ይመልከቱ.

### ብልህ ኮንትራቶች {#smart-contracts}

ስማርት ኮንትራቶች በተወሰኑ ሁኔታዎች ሲሟሉ የሚሰሩ በብሎክቼን ላይ የተመሰረቱ ፕሮግራሞች ናቸው ። በ Iroha ውስጥ ብልህ ኮንትራት የሚተገበሩት [ኮር Iroha ልዩ መመሪያዎችን በመጠቀም ነው ](#core-iroha-special-instructions)።

### ማነቃቂያዎች {#triggers}

Iroha ልዩ መመሪያ በተወሰነ የብሎክ ግዴታ ፣ ሰዓት (በአንዳንድ ማስጠንቀቂያዎች) ፣ ወዘተ ላይ እንዲጠራ የሚያስችል ክስተት ዓይነት ተጨማሪ ስለ አስነሳሾች [ እዚህ ](/am/blockchain/triggers.md)።

### ስሪት ማዘጋጀት {#versioning}

እያንዳንዱ ጥያቄ የሚገኝበት API ስሪት ጋር ምልክት ተደርጎበታል. ይህ የ Iroha የደንበኛ / የእኩዮች ሶፍትዌር የተለያዩ ሁለትዮሽ ስሪቶች ጥምረት እንዲሰራ ያስችላል, ይህም በ Iroha አውታረመረብ ውስጥ የሶፍትዌር ማሻሻያዎችን ይፈቅዳል.

### ሂጂሪ (የባልደረባ ስም ስርዓት) {#hijiri-peer-reputation-system}

Iroha ይህ የግንኙነት ቅድሚያ እንዲሰጥ ያስችለዋል [እኩዮች](#peer) ጥሩ ትራክ ሪኮርድ ያላቸው እና ተንኮል አዘል ጉዳት ሊያስከትል ይችላል [እኩዮች](#peer).

## Iroha ሞጁሎች {#iroha-modules}

ለ Iroha ብጁ ተግባራት የሚሰጡ የሶስተኛ ወገን ማራዘሚያዎች።

## Iroha ልዩ መመሪያዎች (ISI) {#iroha-special-instructions-isi}

በ Iroha የቀረበ የማሰብ ችሎታ ያላቸው ኮንትራቶች ቤተ-መጽሐፍት። እነዚህ በግብይቶች ወይም በተመዘገቡ የዝግጅት አድማጮች በኩል ሊጠየቁ ይችላሉ ። ተጨማሪ መረጃ በ ISI [በዚህ ](/am/blockchain/instructions.md).

#### አጠቃቀም Iroha ልዩ መመሪያዎች {#utility-iroha-special-instructions}

ይህ ስብስብ [ኢሲ](#iroha-special-instructions-isi) እንደዚህ ያሉ አመክንዮአዊ መመሪያዎችን ይ containsል `If`, I/O ጋር የተያያዙ እንደ `Notify` እና እንደ `Sequence`. እነዚህ በአብዛኛው እንደ [ብጁ መመሪያዎች](#custom-iroha-special-instruction).

### ዋና Iroha ልዩ መመሪያዎች {#core-iroha-special-instructions}

[በየ Iroha ትግበራው ላይ የሚቀርቡ ልዩ መመሪያዎች](#iroha-special-instructions-isi)። እነዚህ አንዳንድ [ የጎራ-ተኮር ](#domain-specific-iroha-special-instructions) እንዲሁም [ የመገልገያ መመሪያዎችን ](#utility-iroha-special-instructions) ያካትታሉ።

### የዘርፉ ልዩ መመሪያ Iroha {#domain-specific-iroha-special-instructions}

ከጎራ-ተኮር እንቅስቃሴዎች ጋር የተያያዙ መመሪያዎች: ንብረቶች, መለያዎች, ጎራዎች, የእኩዮች አስተዳደር) እነዚህ [World State View](#world-state-view-wsv) ላይ ደህንነቱ በተጠበቀ እና ደህንነቱ የተጠበቀ በሆነ መንገድ ለውጦችን ለማድረግ የሚያስፈልጉ መሳሪያዎችን ይሰጣሉ ።

### የጉምሩክ Iroha ልዩ መመሪያ {#custom-iroha-special-instruction}

በ [Iroha ሞጁሎች ](#iroha-modules) ውስጥ በደንበኞች ወይም በ 3 ኛ ወገኖች የተሰጡ መመሪያዎች። እነዚህ ሊገነቡ የሚችሉት [የዋናው መመሪያዎችን ](#core-iroha-special-instructions) በመጠቀም ብቻ ነው ። የ Iroha ምንጭ ኮድ መጫን እና ማሻሻል አይመከርም ፣ ምክንያቱም በ [ peers](#peer) በ Iroha ትግበራ ውስጥ ያልተስማሙ ልዩ መመሪያዎች እንደ ጉድለቶች ይቆጠራሉ ፣ ስለሆነም የተስተካከለ ምሳሌን የሚያንቀሳቅሱ [ peers ](#peer) መዳረሻቸው ይሰርዛል።

## Iroha ጥያቄ {#iroha-query}

የዓለም ሁኔታ እይታን ያለማስተካከል ለማንበብ ጥያቄ። [እዚህ](/am/blockchain/queries.md).

## የአመለካከት ለውጥ {#view-change}

አንድ ስምምነት ላይ ያልተሳካ ሙከራ በሚከሰትበት ጊዜ የሚከናወን ሂደት። ይህ ብዙውን ጊዜ አዲስ [አመራር ](#leader) መምረጥ ያስከትላል ።

## የአለም ሁኔታ እይታ (WSV) {#world-state-view-wsv}

WSV የ `World` ፣ የተሰማሩ ብሎክ ሃሽስ ፣ የትራንስክሽን ማውጫዎች ፣ የስምምነት ቶፖሎጂ እና በጥያቄዎች ውስጥ ጥቅም ላይ የሚውሉ የተገኙ ማውጫዎችን ይ containsል ። እሱ የሚዘመነው በተሰማሩ ብሎኮች በኩል ብቻ ነው እናም ከ [Kura ](#kura-warehouse) እንደገና ሊገነባ ይችላል ። [የዓለም ሁኔታ እይታን ](/am/blockchain/world.md#world-state-view-wsv) ይመልከቱ።

## መሪ {#leader}

በኢሮሃ አውታረመረብ ውስጥ አንድ እኩይ በዘፈቀደ የተመረጠ ሲሆን ቀጣዩን ብሎክ የመመስረት ልዩ መብት ተሰጥቶታል ። ይህ መብት [በባይዛንታይን ስህተት-ተኮርነት ](#byzantine-fault-tolerance-bft) በኩል በሚያገኙ አውታረ መረቦች ውስጥ ሊሰረዝ ይችላል [view change](#view-change).
