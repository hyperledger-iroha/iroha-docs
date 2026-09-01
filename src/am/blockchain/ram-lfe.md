---
translation_locale: am
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 66436bfdcdfea9bcd52834436dc8b6abe9812549583e6bfca06cbe73d5f75d35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# RAM-LFE {#ram-lfe}

RAM-LFE የዘፈቀደ መዳረሻ ማሽን ላኮኒክ ተግባር ግምገማ ማለት ነው።. በ Iroha ውስጥ፣ የህዝብ ፖሊሲያቸው በሰንሰለት ላይ ለሆነ ነገር ግን የገምጋሚው አመክንዮ፣ ሚስጥራዊ ወይም ጥሬ ግብአት ለአለም ሁኔታ መፃፍ ለሌለባቸው ፕሮግራሞች አጠቃላይ የተደበቀ ተግባር ንብርብር ነው።. እንደ የግል ስልክ ወይም ኢሜል ፍለጋ ባሉ SORA Nexus መለያ ፍሰቶች ጥቅም ላይ ይውላል፣ እና እንዲሁም የኖድ መገለጫ መተግበሪያን የሚመለከቱ መንገዶችን ሲያነቃ እንደ አጠቃላይ Torii ፕሮግራም-ማስፈጸሚያ ረዳት ሊጋለጥ ይችላል።

ሰንሰለቱ የፖሊሲውን ክሪፕቶግራፊያዊ ኮሚትመንት ዋጋ እና የደረሰኝ ማረጋገጫ ሜታዳታ ያከማቻል። ፈቺ ወይም Torii የሶፍትዌር ማስፈጸሚያ አካባቢ የተደበቀውን ይገመግማል ፕሮግራም፣ የተፈቀደውን ውፅዓት ብቻ ይመልሳል፣ እና ደንበኞች፣ የድጋፍ መሳሪያዎች ወይም የብሎክቼይን መዝገብ መመሪያዎች ከተመዘገበው ፖሊሲ ጋር ሊያረጋግጡ የሚችሉትን የደረሰኝ ያያይዛል።

## መሰየም {#naming}

የስም ክፍፍል አስፈላጊ ነው -

|ቃል|ትርጉም|
| --- | --- |
|`ram_lfe`|የውጪው የተደበቀ ተግባር ረቂቅ የፕሮግራም ፖሊሲዎች፣ ክሪፕቶግራፊያዊ ኮሚትመንቶች፣ የማስፈጸሚያ ደረሰኞች እና የደረሰኝ ማረጋገጫ ሁነታ።|
|`BFV`|በተመሰጠረ ግቤት RAM-LFE ጀርባዎች ጥቅም ላይ የሚውለው የብራከርስኪ/ፋን-ቬርካውተሬን ሆሞሞርፊክ ምስጠራ እቅድ።|
|`ram_fhe_profile`|BFV-ተኮር ሜታዳታ ለፕሮግራም የተመሰጠረ የማስፈጸሚያ ማሽን። ለ RAM-LFE ሁለተኛ ስም አይደለም።|

በመረጃ ሞዴሉ ውስጥ `RamLfeProgramPolicy` እና `RamLfeExecutionReceipt` RAM-LFE ዓይነቶች ናቸው። BFV መለኪያዎች፣ የምስጢር ጽሑፍ ዳታ ኮንቴይነሮች እና የተደበቀው RAM-FHE የፕሮግራም መገለጫ በፖሊሲ ጥቅም ላይ የሚውለው የተመሰጠረ-ማስፈጸሚያ ጀርባ ናቸው።

## ምን ይመዘግባል {#what-it-records}

የ RAM-LFE ፕሮግራም ፖሊሲ በአለም አቀፍ ደረጃ በ `program_id` ተመዝግቧል። ፖሊሲው የሚከተሉትን ያጠቃልላል

- መመሪያውን ማንቃት፣ ማቦዘን ወይም በሌላ መንገድ ሊለውጥ የሚችል የባለቤት መለያ
- ለደንበኞች የማስታወቂያ ማስታወቂያ
- የደረሰኝ ማረጋገጫ ሁነታ፣ ወይ `signed` ወይም `proof`
- ለተደበቀ ፕሮግራም ሜታዳታ እና ገምጋሚ ሚስጥር የክሪፕቶግራፊያዊ ኮሚትመንት
- ለተፈረሙ የደረሰኞች የመፍትሄው ይፋዊ ቁልፍ
- እንደ BFV መለኪያዎች እና `ram_fhe_profile` ያሉ አማራጭ ይፋዊ የተመሰጠረ-ግቤት ሜታዳታ
- ፖሊሲው አዲስ የደረሰኞችን ማውጣት ይችል እንደሆነ የሚቆጣጠር `active` ባንዲራ

የተደበቀው ሚስጥር፣ ግልጽ የጽሑፍ መለያ እሴት እና የተደበቀ የፕሮግራም አካል በአለም ሁኔታ ውስጥ አይከማቹም። ደንበኞች የክሪፕቶግራፊያዊ ኮሚትመንቶችን፣ ግልጽ ያልሆኑ ምስጠራ ሃሽዎችን፣ የደረሰኝ ምስጠራ ሃሽዎችን፣ ምስጠራ ጽሑፎችን ማከም አለባቸው፣ እና ምስጠራ ፕሮግራሞችን እንደ ግልጽ ያልሆነ የፕሮቶኮል እሴቶች ያዘጋጁ።

## የኋላ ጫፎች {#backends}

የአሁኑ RAM-LFE ድጋፍ በሶስት የጀርባ መለያዎች ላይ ያተኮረ ነው -

|የኋላ መጨረሻ|ጥቅም|
| --- | --- |
|`hkdf-sha3-512-prf-v1`|ከኮሚትመንት ጋር የተያያዘ PRF ግምገማ።|
|`bfv-affine-sha3-256-v1`|BFV - የተደገፈ ሚስጥራዊ ግንኙነት ግምገማ በተመሰጠሩ መለያ ቦታዎች ላይ።|
|`bfv-programmed-sha3-256-v1`|BFV የተደገፈ ፕሮግራም በተመሰጠሩ መዝገቦች እና የማህደረ ትውስታ ማስፈጸሚያ መስመሮች ላይ።|

ለመለያ ፖሊሲዎች፣ በፕሮግራም የተያዘው BFV ጀርባ አስፈላጊው ዘመናዊ መንገድ ነው። የኪስ ቦርሳዎች መደበኛ ግብዓትን በአገር ውስጥ እንዲያመሰጥሩ ያስችላቸዋል፣ ፈቺው እንዲገመግም ያስችለዋል። በግብይቱ ውስጥ ይፋዊ መለያ ሳያዩ እና የውጤት ምስጠራ ሃሽ ከተመዘገበው የፕሮግራም ፖሊሲ ጋር የሚያገናኝ የደረሰኝ ይመልሳል።

## ሒሳብ {#math}

ይህ ክፍል አሁን ባለው RAM-LFE ኮድ ጥቅም ላይ የሚውለውን የአተገባበር ደረጃ አልጀብራ ይገልጻል። የደህንነት ማረጋገጫ አይደለም; ፖሊሲዎች፣ የደረሰኞች እና ደንበኞች መስማማት ያለባቸው ዲተርሚኒስቲክ ግልባጭ እና የተመሰጠረ-ግምገማ ሞዴል ነው።

### ማስታወሻ {#notation}

ይሁን

- \(H(m)\) Iroha `Hash::new(m)` Blake2b-32 በላይ `m`፣ የመጨረሻው ባይት ትንሹ ጉልህ የሆነ ትንሽ ወደ `1` ይገደዳል።
- \(N(x)\) የ`x` ነጠላ ፕሮቶኮል-ስታንዳርድ Norito ኢንኮዲንግ ነው።
- \(a \parallel b\) ማለት የባይት-ሕብረቁምፊ ውህደት ማለት ነው።
- \(\operatorname{le64}(i)\) ያልተፈረመ ኢንቲጀር ባለ 8-ባይት ትንሽ-ኢንዲያን ኢንኮዲንግ ነው።
- \(s\) ከዓለም ውጭ የሚገኝ የመፍትሄ ሚስጥር ነው።
- \(P\) የህዝብ ፖሊሲ መለኪያዎች ይሁኑ።
- \(A\) ተዛማጅ መረጃዎችን እየጠየቀ ነው።
- \(x\) በጀርባው ላይ በመመስረት መደበኛ የግቤት ባይት ወይም Norito-ኢንክሪፕት የተደረገ የግቤት ውሂብ መያዣ ይሁኑ።.

RAM-LFE በጎራ የተለዩ ምስጠራ ሃሽዎችን ይጠቀማል። ከታች ያሉት ቀመሮች ጎራዎቹን በዓላማ ይሰይማሉ; አሁን ያሉት የባይት ሕብረቁምፊዎች -

|ምልክት|የጎራ ሕብረቁምፊ|
| --- | --- |
|\(D_{\mathrm{policy}}\)|`iroha.ram_lfe.policy.hkdf_sha3_512_prf.v1`|
|\(D_{\mathrm{secret}}\)|`iroha.ram_lfe.policy_secret.hkdf_sha3_512_prf.v1`|
|\(D_{\mathrm{salt}}\)|`iroha.ram_lfe.hkdf_salt.hkdf_sha3_512_prf.v1`|
|\(D_{\mathrm{hkdf\_opaque}}\)|`iroha.ram_lfe.opaque_info.hkdf_sha3_512_prf.v1`|
|\(D_{\mathrm{hkdf\_receipt}}\)|`iroha.ram_lfe.receipt_info.hkdf_sha3_512_prf.v1`|
|\(D_{\mathrm{opaque}}\)|`iroha.ram_lfe.opaque_hash.hkdf_sha3_512_prf.v1`|
|\(D_{\mathrm{receipt}}\)|`iroha.ram_lfe.receipt_hash.hkdf_sha3_512_prf.v1`|
|\(D_{\mathrm{affine\_circuit}}\)|`iroha.ram_lfe.bfv_affine.circuit.v1`|
|\(D_{\mathrm{affine\_opaque}}\)|`iroha.ram_lfe.bfv_affine.opaque_hash.v1`|
|\(D_{\mathrm{affine\_receipt}}\)|`iroha.ram_lfe.bfv_affine.receipt_hash.v1`|
|\(D_{\mathrm{program\_memory}}\)|`iroha.ram_lfe.bfv_program.memory.v1`|
|\(D_{\mathrm{program\_opaque}}\)|`iroha.ram_lfe.bfv_program.opaque_hash.v1`|
|\(D_{\mathrm{program\_receipt}}\)|`iroha.ram_lfe.bfv_program.receipt_hash.v1`|
|\(D_{\mathrm{program\_digest}}\)|`iroha.ram_lfe.bfv_program.digest.v1`|
|\(D_{\mathrm{output}}\)|`iroha.ram_lfe.output_hash.v1`|
|\(D_{\mathrm{id\_opaque}}\)|`iroha.ram_lfe.identifier.opaque_hash.v1`|
|\(D_{\mathrm{id\_receipt}}\)|`iroha.ram_lfe.identifier.receipt_hash.v1`|
|\(D_{\mathrm{bfv\_keygen}}\)|`iroha.crypto.fhe.bfv.keygen.v1`|
|\(D_{\mathrm{bfv\_encrypt}}\)|`iroha.crypto.fhe.bfv.encrypt.v1`|
|\(D_{\mathrm{id\_keygen}}\)|`iroha.crypto.fhe.bfv.identifier.keygen.v1`|
|\(D_{\mathrm{id\_slot}}\)|`iroha.crypto.fhe.bfv.identifier.slot.v1`|

### የፖሊሲ ክሪፕቶግራፊያዊ ኮሚትመንት {#policy-commitment}

የፖሊሲ ክሪፕቶግራፊያዊ ኮሚትመንት የህዝብ መለኪያዎችን እና የተደበቀ የመፍትሄ ሚስጥርን ከጀርባ ጋር ያገናኛል። በመጀመሪያ፣ ምስጢሩ በምስጠራ በተናጠል የታሰረ ነው -

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

ከዚያ ሙሉው የፖሊሲ ግልባጭ ተቀምጧል -

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

እና የታተመው የፖሊሲ ምስጠራ ሃሽ -

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

በሰንሰለቱ ላይ `PolicyCommitment` የሚከተለው ነው።

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

ግምገማ ከሶፍትዌር ማስፈጸሚያ አካባቢ ሚስጥር ተመሳሳይ እሴትን እንደገና ያሰላል። እንደገና የተሰላው ምስጠራ ሃሽ ከተለያየ፣ ግምገማው በክሪፕቶግራፊያዊ ኮሚትመንት አለመመጣጠን አይሳካም።

### HKDF-SHA3-512 ወደኋላ {#hkdf-sha3-512-backend}

ለ `hkdf-sha3-512-prf-v1`፣ ውጤቱ ራሱ የተለመደው ግቤት ነው፣ ነገር ግን ግልጽ ያልሆነ መለያ እና የደረሰኝ ምስጠራ ሃሽ በሚስጥር የታሰሩ PRF ውጤቶች ናቸው።

የጥያቄው ግልባጭ የሚከተለው ነው -

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

የ HKDF ጨው እና የውሸት ቁልፍ -

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

ግልጽ ያልሆነ ቁሳቁስ ተዘርግቷል እና ተሰርዟል-

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

የደረሰኝ ቁሳቁስ በተጨማሪ ግልጽ ያልሆነውን መታወቂያ ያገናኛል -

$$
m_r =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK},
D_{\mathrm{hkdf\_receipt}} \parallel T_{\mathrm{req}}
\parallel \mathrm{opaque\_id}, 32)
$$

$$
\mathrm{receipt\_hash} =
H(D_{\mathrm{receipt}} \parallel m_r \parallel \mathrm{opaque\_id})
$$

የጀርባው ጫፍ ይመለሳል -

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV ፕሪመር {#bfv-primer}

BFV በጥልፍልፍ ላይ የተመሰረተ ሆሞሞርፊክ ምስጠራ ዘዴ ነው።. "ሆሞሞርፊክ" ማለት አንድ ፕሮግራም የተመሰጠሩ እሴቶችን ማከል እና ማባዛት እና ዲክሪፕት ከተደረገ በኋላ በግልጽ የጽሑፍ እሴቶች ላይ ተጨማሪዎችን እና ማባዛቶችን እንዳደረገ ተመሳሳይ ውጤት ማግኘት ይችላል።.

ለ RAM-LFE፣ BFV እንደ ኢንክሪፕት-ግቤት ዘዴ ጥቅም ላይ ይውላል -

1. የኪስ ቦርሳ እንደ ስልክ ቁጥር ወይም ኢሜል አድራሻ ያለ የግል እሴትን መደበኛ ያደርገዋል።
2. የኪስ ቦርሳው ባይቶችን ወደ ትናንሽ ኢንቲጀር ክፍተቶች ይለውጠዋል።
3. እያንዳንዱ ማስገቢያ በመፍትሔው BFV የህዝብ ቁልፍ የተመሰጠረ ነው።
4. የመፍትሄ ሶፍትዌር ማስፈጸሚያ አካባቢ የተደበቀውን ፕሮግራም በእነዚያ ምስጠራ ጽሑፎች ላይ ይገመግማል።
5. የአፈጻጸም አካባቢው የተደበቀውን የፕሮግራሙን ውጤት ብቻ ዲክሪፕት አድርጎ ደረሰኝ ይፈርማል ወይም ያረጋግጣል።

BFV ትክክለኛ ኢንቲጀር ሒሳብ እንጂ ግምታዊ ሒሳብ አይደለም።. ለዚህም ነው ከተንሳፋፊ-ነጥብ ሞዴል ማጣቀሻ ይልቅ ባይት እና አነስተኛ ሞጁል ስሌቶችን ለመለየት የተሻለ የሆነው። በ Iroha አሁን ባለው BFV አጠቃቀም፣ እያንዳንዱ ኢንክሪፕት የተደረገ ማስገቢያ አንድ ስካላር እሴት ሞዱሎ \(t\)፣ አብዛኛውን ጊዜ ባይት ወይም የባይት ርዝመት መስክ ይይዛል። የምስጢር ጽሑፉ ራሱ ይኖራል ሞዱሎ፣ በጣም ትልቅ ኢንቲጀር \(q\)። በ\(q\) እና \(t\) መካከል ያለው ክፍተት በምስጠራ እና በሆሞሞርፊክነት ኦፕሬሽኖች ለተዋወቀው ጫጫታ ዲክሪፕት ቦታ ይሰጣል።

የ BFV ምስጠራ ጽሑፍ ሁለት ፖሊኖሚል ክፍሎች አሉት

$$
c=(c_0,c_1)
$$

ሚስጥራዊው ቁልፍ ሌላ ፖሊኖሚል ነው \(s_k\)። ዲክሪፕት ክፍሎቹን ያጣምራል -

$$
v = c_0 + c_1s_k
$$

የምስጢር ጽሑፉ በትክክል ከተፈጠረ እና ጩኸቱ አሁንም ትንሽ ከሆነ፣ \(v\) ከተመጣጠነ ግልጽ ጽሑፍ ጋር ቅርብ ነው። ማዞር የግልፅ ጽሑፍ ኮፊሸን ሞጁሎ \(t\) ያገግማል። ጠቃሚው ንብረቱ የምስጢራዊ ጽሑፍ ክዋኔዎች ይህንን መዋቅር ይጠብቃሉ -

|ተራ ክወና|የምስጢራዊ ጽሑፍ ክዋኔ|
| --- | --- |
|\(m+n\)|የምስጢራዊ ጽሑፍ ክፍሎችን ያክሉ።|
|\(m+\alpha\)|የተመጣጠነ ግልጽ ጽሑፍ ቋሚነት ወደ \(c_0\) ያክሉ።|
|\(\alpha m\)|ሁለቱንም የምስጢራዊ ጽሑፍ ክፍሎች በ \(\alpha\) ይለካሉ።|
|\(mn\)|የምስጢር ጽሑፍ ፖሊኖሚያሎችን ማባዛት፣ እንደገና ይለካሉ፣ ከዚያ እንደገና ያስተካክሉ።|

ማባዛት በጣም ውድ የሆነ ክዋኔ ነው. የሁለት ባለ ሁለት ክፍል ምስጢራዊ ጽሑፎች ምርት በተፈጥሮ በ\(1\)፣ \(s_k\) እና \(s_k^2\) ዲክሪፕት የሚደረግ ባለ ሶስት ክፍል ምስጢራዊ ጽሑፍ ይፈጥራል። የ \(s_k^2\) ቃሉን ወደ መደበኛው ባለ ሁለት ክፍል ምስጠራ ጽሑፍ ለማጠፍ የታተመ የግምገማ ቁልፍን ይጠቀማል። ይህ ተመሳሳይ የምስጢር ጽሑፍ ቅፅን በመጠቀም በኋላ ላይ ተጨማሪዎችን እና ማባዛቶችን የማከናወን ችሎታን ይጠብቃል።

BFV እንዲሁ "የተስተካከለ" ነው እያንዳንዱ የተመሰጠረ ክዋኔ የተወሰነ የድምፅ በጀት ይጠቀማል። ይህ አተገባበር ያንን በጀት ለማደስ ምስጢራዊ ጽሑፎችን አያስነሳም። በምትኩ፣ RAM-LFE ትንሽ `ram_fhe_profile` ያትማል እና የታሰረ የተደበቀ የፕሮግራም ቅርጽ ብቻ ይቀበላል።. ያ ግምገማውን በመለኪያ ስብስብ በሚደገፈው ጥልቀት ውስጥ ያቆያል። አሁን ያለው ፕሮግራም የተደረገ መገለጫ ቋሚ የመመዝገቢያ ብዛት፣ ቋሚ የማህደረ ትውስታ-መስመር ቆጠራ እና ቢበዛ አንድ የምስጢር-ምስጢራዊ ጽሑፍ ማባዛትን በፕሮግራም ደረጃ ይፈቅዳል።

በዚህ RAM-LFE ንድፍ፣ BFV የደንበኛ ግብአት ከህዝብ blockchain መዝገብ መረጃ እና ግብይቱን ወይም የመንገድ ጭነቱን ብቻ ከሚመለከቱ ታዛቢዎች ይደብቃል። ሰንሰለቱ የዘፈቀደ የተመሰጠሩ ፕሮግራሞችን በራሱ ያስፈጽማል ማለት አይደለም። የ Torii ፈቺ ሶፍትዌር ማስፈጸሚያ አካባቢ አሁንም የ BFV ሚስጥራዊ ቁሳቁስ ባለቤት ነው፣ የተዋቀረውን የተደበቀ ፕሮግራም ይገመግማል፣ የተፈቀደውን ውፅዓት ዲክሪፕት ያደርጋል እና ውጤቱን ያረጋግጣል። የብሎክቼይን መዝገብ በሰንሰለት ፖሊሲ ክሪፕቶግራፊያዊ ኮሚትመንት እና ፈቺ የህዝብ ቁልፍ ወይም የማረጋገጫ ሜታዳታ ላይ ያለውን ማረጋገጫ ያረጋግጣል።

የመለያው አጠቃቀም ጉዳይ ሆን ብሎ ቀላል ውክልና ይመርጣል። መደበኛ ሕብረቁምፊ እንደሚከተለው ተቀምጧል -

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

እያንዳንዱ አካል እንደ የራሱ BFV scalar ciphertext የተመሰጠረ ነው። ያ ቅርፅ መደበኛነትን እና የውሂብ መያዣ ማረጋገጫን ግልጽ ያደርገዋል፣ የኪስ ቦርሳዎች እንዲገነቡ ያስችላቸዋል ከህዝብ መለኪያዎች የተመሰጠሩ ጥያቄዎች፣ እና ፈቺው ተመጣጣኝ ኢንክሪፕት የተደረጉ ግብዓቶችን ወደ የተረጋጋ የደረሰኝ ግልባጭ ቀኖናዊ እንዲያደርግ ያስችለዋል።

### BFV ቀለበት ሞዴል {#bfv-ring-model}

የ BFV ጀርባዎች የኔጋሳይክሊክ ፖሊኖሚል ቀለበት ይጠቀማሉ -

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

እና ግልጽ የጽሑፍ ቀለበት -

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

የት

- \(n\) `polynomial_degree` የሁለት ኃይል ነው።
- \(q\) ነው `ciphertext_modulus`
- \(t\) ነው `plaintext_modulus`
- \(q > t\) እና \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

የግልጽ ጽሑፍ ቅንጅት ቬክተሮች እያንዳንዱን ኮፊሸን በመለካት ተቀምጠዋል -

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

ዲክሪፕት ማእከል-እያንዳንዱን ቅንጅት ያነሳል -

$$
v = c_0 + c_1 s_k \in R_q
$$

ከዚያም ወደ \(R_t\) ይመልሱት።

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

እዚህ \(s_k\) BFV ሚስጥራዊ-ቁልፍ ፖሊኖሚያል እንጂ የውጪው RAM-LFE ፈቺ ሚስጥር አይደለም \(s\)።

### BFV ቁልፍ ትውልድ {#bfv-key-generation}

ለተመሰጠረ መለያ ግቤት፣ BFV ቁልፍ ቁሳቁስ በአንድ የመፍትሔ ሚስጥር እና ተያያዥ ውሂብ የሚወስን ነው።

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG እንደሚከተለው ተዘርፏል -

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

የቁልፍ ጄነሬተር ናሙናዎች -

- \(s_k \in \{-1,0,1\}^n\)፣ ሞዱሎ \(q\) ይወክላል።
- \(a \leftarrow R_q\) ወጥ በሆነ መልኩ
- \(e \in \{-1,0,1\}^n\)

የህዝብ ቁልፍ የሚከተለው ነው -

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

ለተሃድሶአዊነት፣ \(s_k^2\) በ \(R_q\) ውስጥ የቀለበት ምርት ይሁን። ለእያንዳንዱ ቤዝ-\(B\) አሃዝ \(j\)፣ ናሙና \(a_j\) ወጥ በሆነ መልኩ እና \(e_j\) ከትንሽ ስርጭት፣ ከዚያ ያትሙ -

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

ይፋዊ BFV የፖሊሲ ሜታዳታ \((n,q,t,B)\)፣ የህዝብ ቁልፍ እና `max_input_bytes` ይዟል። የ BFV ሚስጥራዊ ቁልፍ እና የመልሶ ማቋቋም ቁልፍ በመፍትሔ ሶፍትዌር ማስፈጸሚያ አካባቢ ውስጥ ይቆያሉ።

### BFV ምስጠራ እና ክዋኔዎች {#bfv-encryption-and-operations}

የግልጽ ጽሑፍ ፖሊኖሚያል \(m\)ን ለማመስጠር፣ አተገባበሩ ለሌላ ChaCha20 RNG ከሚከተሉት የመነሻ ዘር ይሰጣል፦

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

ናሙናዎች \(u,e_1,e_2 \in \{-1,0,1\}^n\) እና ያሰላል -

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

ምስጢራዊ ጽሑፉ \(c=(c_0,c_1)\) ነው።

ሆሞሞርፊክ መደመር በአካል ጠቢብ ነው -

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

ግልጽ ጽሁፍ ስካላር \(\alpha\) ወደ Coefficient ዜሮ ብቻ ይለወጣል \(c_0\)

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

በግልጽ ጽሑፍ ስካላር \(\alpha\) ማባዛት ሁለቱንም አካላት ይመዘናል -

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

ለሁለት የምስጢር ጽሑፎች \(c=(c_0,c_1)\) እና \(d=(d_0,d_1)\)፣ የምስጢር ጽሑፍ ማባዛት መጀመሪያ መጠን-ሶስት ምስጠራ ጽሑፍን ያሰላል እና እያንዳንዱን ቅንጅት በ \(t/q\) ይመዘናል

$$
\tilde c_0 = \left\lfloor \frac{t(c_0 d_0)}{q} \right\rceil \bmod q
$$

$$
\tilde c_1 =
\left\lfloor \frac{t(c_0 d_1 + c_1 d_0)}{q} \right\rceil \bmod q
$$

$$
\tilde c_2 = \left\lfloor \frac{t(c_1 d_1)}{q} \right\rceil \bmod q
$$

ከላይ ያሉት ሁሉም ምርቶች በ \(R_q\) ውስጥ የኔጋሳይክሊክ ቀለበት ምርቶች ናቸው። ከዚያ \(\tilde c_2\) ወደ ቤዝ-\(B\) ፖሊኖሚል ይበሰብሳል -

$$
\tilde c_2 = \sum_j B^j u_j
$$

እና እንደገና ተሻሽሏል

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

ውጤቱ እንደገና ባለ ሁለት አካል BFV ምስጢራዊ ጽሑፍ ነው።

### መለያ Ciphertext data container {#identifier-ciphertext-envelope}

መለያ የግቤት ባይት ሕብረቁምፊ -

$$
x=(x_0,\ldots,x_{\ell-1})
$$

ወደ ስካላር ማስገቢያዎች ተቀምጧል -

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

እና ሁሉም የተቀሩት ክፍተቶች እስከ `max_input_bytes + 1` ዜሮ ናቸው። እያንዳንዱ ስካላር ማስገቢያ እንደ ኮፊሸን-ዜሮ ግልጽ ጽሑፍ ፖሊኖሚል \([m_i]\) ተመስጥሯል። የእያንዳንዱ ማስገቢያ ምስጠራ ዘር የሚከተለው ነው -

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

የተመሰጠረው መለያ ውሂብ መያዣ -

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

የት \(M=\mathrm{max\_input\_bytes}\)።

### BFV አፊን የኋላ {#bfv-affine-backend}

ለ`bfv-affine-sha3-256-v1`፣ የሶፍትዌር ማስፈጸሚያ አካባቢ በመጀመሪያ BFV ቁልፍ ቁሳቁሶችን ከ\(s\) እና \(A\) ያገኛል። የተገኙት የህዝብ መለኪያዎች በሰንሰለት ላይ ምስጠራ ካለው የህዝብ መለኪያዎች ጋር በትክክል መዛመድ አለባቸው።

የአፊን ወረዳ ዘር የሚከተለው ነው-

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

ከዚህ ዘር የሶፍትዌር ማስፈጸሚያ አካባቢ ናሙናዎች፣ ሞዱሎ \(t\)፣ ባለ 32-ረድፍ አፊን ወረዳ -

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

የት \(m_i\) ዲክሪፕት የተደረገባቸው መለያ ማስገቢያዎች ናቸው። በሆሞሞርፊክነት፣ በምስጢራዊ ጽሑፎች ላይ ተመሳሳይ እሴት ያሰላል -

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

ፈቺው እያንዳንዱን \(C_j\) ዲክሪፕት ያደርጋል፣ ሁሉም ተከታይ ግልጽ የጽሑፍ ቅንጅቶች ዜሮ እንዲሆኑ ይፈልጋል፣ የቅንጅት-ዜሮ እሴቶችን ወደ ባይት ይለውጣል እና ይቅረፃል -

$$
O=(y_0,\ldots,y_{31})
$$

ከዚያ

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{affine\_opaque}}
\parallel \mathrm{policy\_hash} \parallel O)
$$

$$
\mathrm{receipt\_hash} =
H(D_{\mathrm{affine\_receipt}}
\parallel \mathrm{policy\_hash} \parallel O
\parallel \mathrm{opaque\_id})
$$

### BFV ፕሮግራም የተደረገ የኋላ መጨረሻ {#bfv-programmed-backend}

ለ`bfv-programmed-sha3-256-v1`፣ የህዝብ መለኪያዎች የ BFV መለያ ምስጠራ መለኪያዎችን ከተደበቀ ፕሮግራም ክሪፕቶግራፊያዊ ዳይጀስት ጋር ያካትታሉ -

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

የአሁኑ RAM-FHE መገለጫ የሚከተለው ነው -

|መስክ|እሴት|
| --- | --- |
|`profile_version`| `1` |
|`register_count`| `4` |
|`memory_lane_count`| `32` |
|`ciphertext_mul_per_step`| `1` |
|`encrypted_input_mode`|`resolver_canonicalized_envelope_v1`|
|`min_ciphertext_modulus`| \(2^{52}\) |

ወደ Torii የቀረበው ግልጽ ጽሑፍ ግቤት ከመፈጸሙ በፊት በተመሳሳይ BFV የውሂብ መያዣ ውስጥ ተመስጥሯል። ለዚያ የአገልጋይ-ጎን ምስጠራ የሚወስነው ዘር -

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

ከውጪ ለሚቀርበው የተመሰጠረ ግብዓት፣ ፈቺው የመለያውን ዳታ ኮንቴይነር ዲክሪፕት ያደርገዋል እና በዚህ ላይ እንደገና ኢንክሪፕት ያደርገዋል። ከመፈጸምዎ በፊት ዲተርሚኒስቲክ የውሂብ መያዣ። ያ ቀኖናዊነት ይጠብቃል የፕሮቶኮል ውጤት ክሪፕቶግራፊያዊ ሃሽዎችን በትርጉም እኩል ላይ የተረጋጋ ይመዝግቡ BFV ምስጢራዊ ጽሑፎች።

የመጀመሪያ ኢንክሪፕት የተደረገ የማህደረ ትውስታ ማስፈጸሚያ መስመሮች የሚመነጩት ከሚከተሉት ነው-

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

ለእያንዳንዱ 32 የማስፈጸሚያ መስመሮች፣ የሶፍትዌር ማስፈጸሚያ አካባቢ ናሙናዎች \(r_j \in [0,t)\) እና BFV ምስጢራዊ ጽሑፍ ኢንክሪፕት \(r_j\) ያከማቻል። የተደበቀው ፕሮግራም በተመሰጠሩ መዝገቦች እና በተመሰጠረ ማህደረ ትውስታ ላይ ይፈጽማል -

|መመሪያ|አልጀብራ|
| --- | --- |
|`LoadInput(dst, i)`|\(R_{\mathrm{dst}} \leftarrow C_i\)|
|`LoadState(dst, j)`|\(R_{\mathrm{dst}} \leftarrow S_j\)|
|`StoreState(j, src)`|\(S_j \leftarrow R_{\mathrm{src}}\)|
|`LoadConst(dst, a)`|\(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\)|
|`Add(dst, a, b)`|\(R_{\mathrm{dst}} \leftarrow R_a + R_b\)|
|`AddPlain(dst, src, a)`|\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\)|
|`SubPlain(dst, src, a)`|\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\)|
|`MulPlain(dst, src, a)`|\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\)|
|`Mul(dst, a, b)`|\(R_{\mathrm{dst}} \leftarrow R_aR_b\)፣ ከዚያ እንደገና መስመር ያድርጉ|
|`SelectEqZero(dst, cond, z, nz)`|ዲክሪፕት \(R_{\mathrm{cond}}\); ዜሮ በሚሆንበት ጊዜ \(R_z\)ን ይምረጡ፣ አለበለዚያ \(R_{nz}\)።|
|`Output(src)`|\(R_{\mathrm{src}}\) ወደ ውፅዓት መመዝገቢያ ዝርዝር ያክሉ።|

የመመሪያው ቴፕ ካለቀ በኋላ ፈቺው እያንዳንዱን የውጤት መመዝገቢያ ዲክሪፕት ያደርጋል፣ ኮፊሸን ዜሮን ወደ ባይት ይለውጣል እና እነዚያን ባይቶች ያገናኛል -

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

አጠቃላይ ፕሮግራም የተደረገ የጀርባ ክሪፕቶግራፊክ ሃሽ የሚከተሉት ናቸው -

$$
\mathrm{opaque\_hash} =
H(D_{\mathrm{program\_opaque}}
\parallel \mathrm{policy\_hash} \parallel O)
$$

$$
\mathrm{receipt\_hash}_{\mathrm{program}} =
H(D_{\mathrm{program\_receipt}}
\parallel \mathrm{policy\_hash} \parallel O
\parallel \mathrm{opaque\_hash})
$$

ነባሪው ፕሮግራም ያለው መለያ ቴፕ 64 የግቤት ቦታዎች አሉት። ለእያንዳንዱ ማስገቢያ \(i\)፣ የግቤት ማስገቢያውን ይጭናል፣ የማህደረ ትውስታ ማስፈጸሚያ መስመርን \(i \bmod 32\) ይጭናል፣ ይጨምራል እና ውጤቱን ያወጣል።

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### የውጤት ምስጠራ ሃሽ እና የደረሰኞች {#output-hashes-and-receipts}

አጠቃላይ RAM-LFE የማስፈጸሚያ ደረሰኝ ጥሬውን ውፅዓት አይፈርምም። የውጤት ምስጠራ ሃሽ ይፈርማል -

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

ለ Torii RAM-LFE የማስፈጸሚያ ደረሰኞች፣ ተያያዥ ውሂብ ነጠላ ፕሮቶኮል-መደበኛ የፕሮግራም መለያ ባይት ነው።

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

የተፈረመው የደረሰኝ ጭነት የሚከተለው ነው -

$$
R =
(\mathrm{program\_id},
\mathrm{program\_digest},
\mathrm{backend},
\mathrm{verification\_mode},
\mathrm{output\_hash},
\mathrm{associated\_data\_hash},
\mathrm{executed\_at\_ms},
\mathrm{expires\_at\_ms})
$$

ለ `signed` ሁነታ

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

ማረጋገጫው ፊርማውን በ`resolver_public_key` ይፈትሻል እና እነዚህ ሁሉ እኩልነቶች ካልያዙ በስተቀር የፕሮቶኮል ውጤት መዝገቡን ውድቅ ያደርጋል -

$$
R.\mathrm{program\_id} = \mathrm{policy.program\_id}
$$

$$
R.\mathrm{backend} = \mathrm{policy.backend}
$$

$$
R.\mathrm{verification\_mode} = \mathrm{policy.verification\_mode}
$$

$$
R.\mathrm{program\_digest} =
\mathrm{policy.public\_parameters.hidden\_program\_digest}
$$

$$
R.\mathrm{associated\_data\_hash} =
H(N(\mathrm{policy.program\_id}))
$$

ደዋዩ `output_hex` ካቀረበ፣ አረጋጋጩ እንዲሁ ያረጋግጣል -

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

ለ`proof` ሁነታ፣ ምስክርነቱ ከፊርማ ይልቅ የማረጋገጫ ውሂብ መያዣ ይይዛል። ማረጋገጫ የማስረጃው ጀርባ፣ የወረዳ መታወቂያ፣ የህዝብ ግቤት መርሃ ግብር መሆኑን ያረጋግጣል ምስጠራ ሃሽ፣ የማረጋገጫ-ቁልፍ ምስጠራ ሃሽ እና የተጋለጡ የህዝብ አጋጣሚዎች ከማረጋገጫ አረጋጋጭ ሜታዳታ እና ከተመሰጠረው ደረሰኝ-ጭነት ክሪፕቶግራፊክ ሃሽ ጋር ይዛመዳሉ። ይሁን

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

የሚጠበቁት የህዝብ አጋጣሚዎች አራት ነጠላ-ኤለመንት አምዶች ናቸው። አምድ \(j\) ባይት \(h_{8j}\ldots h_{8j+7}\) ይዟል ከዚያም 24 ዜሮ ባይት

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### መለያ ትንበያ {#identifier-projection}

የመለያ መፍታት አጠቃላዩን የጀርባ ሥርዓት `opaque_hash` ለተጠቃሚው የሚታይ ግልጽ ያልሆነ የመለያ መታወቂያ አድርጎ አይጠቀምም። የ RAM-LFE የውጤት ሃሽን በመለያ-ተኮር ጎራዎች ይቀይረዋል፦

$$
\mathrm{opaque\_id}_{\mathrm{id}} =
H(D_{\mathrm{id\_opaque}}
\parallel N(\mathrm{program\_id})
\parallel \mathrm{output\_hash})
$$

$$
\mathrm{receipt\_hash}_{\mathrm{id}} =
H(D_{\mathrm{id\_receipt}}
\parallel N(\mathrm{program\_id})
\parallel \mathrm{output\_hash}
\parallel \mathrm{opaque\_id}_{\mathrm{id}})
$$

አንድ `IdentifierResolutionReceipt` ከፍ ያለ ጭነት ይፈርማል -

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

ለተፈረመ መለያ ደረሰኞች -

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` የፕሮቶኮል ውጤት መዝገቡን የሚቀበለው ፊርማው ወይም ማረጋገጫው ትክክለኛ ሲሆን ብቻ ነው፣ የተከተተው RAM-LFE የማስፈጸሚያ ጭነት ከተጠቀሰው የፕሮግራም ፖሊሲ ጋር ይዛመዳል፣ እና `uaid` እና `account_id` አስገዳጅ የይገባኛል ጥያቄ ቀርቧል።

## የማስፈጸሚያ ፍሰት {#execution-flow}

አጠቃላይ RAM-LFE ማስፈጸሚያ ይህን ቅርጽ ይከተላል

1. አስተዳደር ወይም ኦፕሬተር ይመዘገባል `RamLfeProgramPolicy`።
2. ባለቤቱ ፖሊሲውን ያንቀሳቅሰዋል.
3. ደንበኛው የህዝብ ፖሊሲውን ሜታዳታ ከ Torii ያነባል።
4. ደንበኛው በትክክል አንድ የግቤት ቅጽ ለመፍቺው ያቀርባል ግልጽ ጽሑፍ `input_hex` ወይም የተመሰጠረ BFV የግቤት ውሂብ መያዣ።
5. የሶፍትዌር ማስፈጸሚያ አካባቢ የተደበቀውን ፕሮግራም ይገመግማል እና `output_hex`፣ `output_hash`፣ `opaque_hash`፣ `receipt_hash` እና `RamLfeExecutionReceipt` ይመልሳል።
6. ደንበኛው ወይም ጀርባው የፕሮቶኮል ውጤት መዝገቡን ከታተመው ፖሊሲ አንጻር ያረጋግጣል፣ እንደ አማራጭ የተመለሰው `output_hex` ምስጠራ ሃሽ ወደ ፕሮቶኮሉ የውጤት መዝገብ `output_hash` መሆኑን ያረጋግጣል።
7. እንደ `ClaimIdentifier` ያለ የከፍተኛ ደረጃ መመሪያ ጥሬውን ግብዓት ከመክተት ይልቅ የተረጋገጠውን የደረሰኝ መክተት ይችላል።

```mermaid
flowchart LR
    client["Wallet or application"] --> policy["Read program policy"]
    policy --> input["Normalize and optionally encrypt input"]
    input --> torii["Torii RAM-LFE runtime"]
    torii --> eval["Hidden evaluator"]
    eval --> receipt["Output and execution receipt"]
    receipt --> verify["Client or ledger verifies receipt"]
    verify --> claim["Use receipt in higher-level flow"]
```

## መለያ ፖሊሲዎች {#identifier-policies}

መለያ ፖሊሲዎች የ RAM-LFE ተጨባጭ አጠቃቀም ናቸው። በአጠቃላይ የፕሮግራም ፖሊሲ ላይ የንግድ ስም ቦታ እና መደበኛነት ህግን ይጨምራሉ -

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "<POLICY_OWNER>",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "phone#team",
  owner = "<POLICY_OWNER>",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "phone#team")
```

የመለያው ንብርብር ለማሰር የ RAM-LFE ፕሮቶኮል ውጤት መዝገቡን ይጠቀማል -

- `policy_id`
- የተደበቀ ተግባር የተገኘ ግልጽ ያልሆነ መለያ
- ዲተርሚኒዝም `receipt_hash`
- መለያው UAID
- ነጠላ ፕሮቶኮል መስፈርት `account_id`
- አጠቃላይ RAM-LFE የማስፈጸሚያ ጭነት

ለተጠቃሚው ተሳፋሪ፣ የመለያ ተለዋጭ ስሞችን ከግል መለያዎች ይለዩ። ተለዋጭ ስሞች ይፋዊ ስሞች ናቸው; ስልክ ቁጥሮች፣ የኢሜል አድራሻዎች እና ተመሳሳይ እሴቶች በመለያ ፖሊሲዎች እና በደረሰኞች ውስጥ መፍሰስ አለባቸው።

## Torii መንገዶች {#torii-routes}

መተግበሪያውን የሚመለከት መንገድ ቤተሰብ ሲነቃ Torii RAM-LFE እና መለያ ረዳቶችን ያጋልጣል -

|መንገድ|ዓላማ|
| --- | --- |
|`GET /v1/ram-lfe/program-policies`|ንቁ እና የቦዘኑ RAM-LFE የፕሮግራም ፖሊሲዎችን እና የህዝብ ማስፈጸሚያ ሜታዳታን ይዘርዝሩ።|
|`POST /v1/ram-lfe/programs/{program_id}/execute`|አንድ ፕሮግራም ከ`input_hex` ወይም `encrypted_input` ያስፈጽሙ እና የውጤት ምስጠራ ሃሽዎችን እና ሀገር አልባ የደረሰኝ ይመልሱ።|
|`POST /v1/ram-lfe/receipts/verify`|`RamLfeExecutionReceipt`ን ከታተመው ፖሊሲ ጋር ያረጋግጡ እና እንደ አማራጭ `output_hex`ን ከ`output_hash` ጋር ያወዳድሩ።|
|`GET /v1/identifier-policies`|መለያ ፖሊሲዎችን፣ መደበኛነት ሁነታዎችን፣ የመፍትሄ ቁልፎችን እና የተመሰጠረ-ግቤት ሜታዳታን ይዘርዝሩ።|
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt`|ተጠቃሚው በ`ClaimIdentifier` ውስጥ ሊክተት የሚችለውን የደረሰኝ ያውጡ።|
|`POST /v1/identifiers/resolve`|ንቁ የይገባኛል ጥያቄ ሲኖር መደበኛ መለያ ግብዓትን ወደ ታሰረ መለያ ይፍቱ።|
|`GET /v1/identifiers/receipts/{receipt_hash}`|ለኦዲት እና ለድጋፍ መሳሪያዎች በደረሰኝ የማያቋርጥ መለያ የይገባኛል ጥያቄን ይፈልጉ።|

በእነዚህ መንገዶች ላይ ከመገንባትዎ በፊት ሁል ጊዜ የታለመውን ኖድ `/openapi.json` ሰነድ ያረጋግጡ። ተገኝነት በኖድ ግንባታ እና በአውታረ መረብ መገለጫ ላይ የተመሰረተ ነው.

## የኖድ ሶፍትዌር ማስፈጸሚያ አካባቢ {#node-runtime}

Torii በሂደት ላይ ያለው RAM-LFE የሶፍትዌር ማስፈጸሚያ አካባቢ በ`torii.ram_lfe.programs[*]` ስር ተዋቅሯል፣ በ`program_id` ተቆልፏል። እያንዳንዱ የተዋቀረ ፕሮግራም በሰንሰለት ላይ ካለው የፖሊሲ ክሪፕቶግራፊያዊ ኮሚትመንት ጋር መዛመድ አለበት እና ለመገምገም እና ለማረጋገጥ የሚያስፈልገውን የሶፍትዌር ማስፈጸሚያ አካባቢ ቁሳቁስ ማቅረብ አለበት የደረሰኞች. መለያ መንገዶች ይህንን ተመሳሳይ የሶፍትዌር ማስፈጸሚያ አካባቢ እንደገና ይጠቀማሉ; የተለየ መለያ-ፈቺ ውቅር ወለል አያስፈልጋቸውም።

በሰንሰለት ላይ ፖሊሲን መመዝገብ በራሱ በቂ አይደለም። የዒላማ ኖድ የመንገዱን ቤተሰብ ማጋለጥ እና ሊፈጽም ለሚጠበቀው ፕሮግራሞች ተዛማጅ የሶፍትዌር ማስፈጸሚያ አካባቢ ቁሳቁሶች ሊኖረው ይገባል።

## የክወና ጠባቂዎች {#operational-guardrails}

- ይመዝገቡ ፖሊሲዎች እንቅስቃሴ-አልባ ፣ ይፋዊ ሜታዳታውን ያረጋግጡ እና ከዚያ ያግብሯቸው።
- የተደበቁ ገምጋሚ ሚስጥሮችን፣ የመፍትሄ ፊርማ ቁልፎችን እና BFV ሚስጥራዊ ቁሳቁሶችን ከሰነዶች፣ ምዝግብ ማስታወሻዎች፣ ግብይቶች እና የደንበኛ ቅርቅቦች ያስቀምጡ።
- ጥሬ መለያዎችን በመለያ ተለዋጭ ስሞች፣ የግብይት ሜታዳታ፣ ክስተቶች ወይም የአለም-ሁኔታ መስኮች ውስጥ አታስቀምጡ።
- SDK አረጋጋጩን ሲያጋልጥ የከፍተኛ ደረጃ መመሪያዎችን ከማስገባትዎ በፊት በደንበኛው በኩል የደረሰኞችን ያረጋግጡ።
- የቆዩ የደረሰኞች ለዘላለም የሚሰሩ ሆነው መቆየት የሌለባቸውን የማለቂያ መስኮችን ይጠቀሙ።
- አዲስ ፕሮግራም ወይም መለያ ፖሊሲ በመመዝገብ፣ ደንበኞችን በማዛወር እና አዲስ የደረሰኞች ከፈሰሱ በኋላ የድሮውን ፖሊሲ በማቦዘን አሽከርክር።

## የ ተዛመዱ አርእስቶች {#related-topics}

- [ለግል ዳታ ቦታ የስፖንሰር ክፍያዎች](/am/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii API የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md#app-and-sora-route-families)
- [ስም-አልባ ግብይቶች](/am/blockchain/anonymous-transactions.md)
