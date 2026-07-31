---
translation_locale: am
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE ለዘፈቀደ መዳረሻ ማሽን ላኮኒክ ተግባር ግምገማ ማለት ነው ። በ Iroha ውስጥ ፣ የህዝብ ፖሊሲው በሰንሰለት ላይ ለሚገኙ ፕሮግራሞች አጠቃላይ የተደበቀ ተግባር ንብርብር ነው ነገር ግን ገምጋሚ ሎጂካቸው ፣ ምስጢራዊነታቸው ወይም ጥሬ ግብአታቸው ለዓለም መንግስት መፃፍ የለባቸውም ። እንደ የግል ስልክ ወይም የኢሜል ፍለጋ በመሳሰሉ SORA Nexus መታወቂያ ዥረቶች ጥቅም ላይ ይውላል ፣ እና የአውታር መገለጫ የመተግበሪያ-ተኮር መንገዶችን በሚፈቅድበት ጊዜ እንደ አጠቃላይ Torii የፕሮግራም አፈፃፀም ረዳት ሆኖ ሊገለጽ ይችላል።

ሰንሰለቱ የፖሊሲ ግዴታ እና ደረሰኝ ማረጋገጫ ሜታዳታዎችን ያከማቻል ። አንድ መፍትሄ ወይም Torii ሩጫ ጊዜ የተደበቀውን ፕሮግራም ይገመግማል ፣ የሚፈቀደውን ውፅዓት ብቻ ይመልሳል ፣ እና ደንበኞች ፣ የድጋፍ መሳሪያዎች ወይም መቁጠሪያ መመሪያዎች ከተመዘገቡት ፖሊሲዎች ጋር ሊያረጋግጡ የሚችሉበትን ደረሰኝ ይያዛል ።

## ስም መስጠት {#naming}

የስም ማከፋፈል አስፈላጊ ነው:

|የጊዜ ገደብ|ትርጉም|
| --- | --- |
|`ram_lfe` |ውጫዊው የተደበቀ ተግባር አጠቃቀም: የፕሮግራም ፖሊሲዎች, ግዴታዎች, የማስፈጸሚያ ደረሰኞች እና ደረሰኝ ማረጋገጫ ሁነታ. |
|`BFV` |በ RAM-LFE የተመሰጠረ የመግቢያ የጀርባ ገጽታዎች ጥቅም ላይ የሚውለው Brakerski/Fan-Vercauteren homomorphic encryption scheme። |
|`ram_fhe_profile` |BFV ለፕሮግራም የተሰራው የተመሰጠረ አፈፃፀም ማሽን ልዩ ሜታዳታ ነው። ይህ ለ RAM-LFE ሁለተኛ ስም አይደለም ። |

በውሂብ ሞዴሉ ውስጥ `RamLfeProgramPolicy` እና `RamLfeExecutionReceipt` የ RAM-LFE ዓይነቶች ናቸው ። BFV መለኪያዎች ፣ የምስጠራ ጽሑፍ ፖስታዎች እና የተደበቀው RAM-FHE ፕሮግራም መገለጫ በፖሊሲ ጥቅም ላይ በሚውለው የተመሰጠረ አፈፃፀም ጀርባ ነው ።

## መጽሐፍ ቅዱስ ምን ይላል? {#what-it-records}

የ RAM-LFE ፕሮግራም ፖሊሲ በዓለም አቀፍ ደረጃ በ `program_id` ተመዝግቧል። ፖሊሲው የሚከተሉትን ያካትታል:

- ፖሊሲውን ማግበር፣ ማሰናከል ወይም በሌላ መንገድ መቀየር የሚችል የባለቤትነት መለያ
- ለደንበኞች የሚስተዋወቀው የጀርባ መጨረሻ
- የምስክር ወረቀት ማረጋገጫ ዘዴ `signed` ወይም `proof`።
- የተደበቀ የፕሮግራም ሜታዳታ እና የምርመራ ሚስጥራዊነት ተሳትፎ
- ለተፈረሙ ደረሰኞች መፍትሄ ያለው የህዝብ ቁልፍ
- እንደ BFV መለኪያዎች እና `ram_fhe_profile` ያሉ አማራጭ የህዝብ ምስጠራ የመግቢያ ሜታዳታ
- ፖሊሲው አዲስ ደረሰኞችን ማተም አለመቻሉን የሚቆጣጠር የ `active` ባንዲራ

የተደበቀ ሚስጥር, ግልጽ ጽሑፍ መታወቂያ ዋጋ እና የተደበቁ የፕሮግራም አካል በዓለም ሁኔታ ውስጥ አይከማቹም. ደንበኞች ግዴታዎች, ግልጽ ያልሆኑ ሃሽዎች, ደረሰኝ ሀሽዎች, ምስጢራዊ ጽሑፎች, እና የፕሮጀክት ዲጂስቶች እንደ ግልጽ ያልሆኑ ፕሮቶኮል እሴቶች መያዝ አለባቸው.

## የኋላ ታሪክ {#backends}

የአሁኑ RAM-LFE ድጋፍ በሶስት የጀርባ መለያዎች ላይ ያተኮረ ነው:

|የኋላ  ገጽ|አጠቃቀም|
| --- | --- |
|`hkdf-sha3-512-prf-v1` |PRF የተዋጣለት ግምገማ። |
|`bfv-affine-sha3-256-v1` |በ BFV የተደገፈ ምስጢራዊ አፊን ግምገማ በተመሰጠረ መታወቂያ ክፍሎች ላይ። |
|`bfv-programmed-sha3-256-v1` |በ BFV የተደገፈ የፕሮግራም አፈፃፀም በዲጂታል መዝገቦች እና በማስታወሻ መስመሮች ላይ።|

ለታወቂያ ፖሊሲዎች, የፕሮግራም BFV ጀርባ አስፈላጊ ዘመናዊ መንገድ ነው. ይህም ቦርሳዎች አካባቢያዊ መደበኛ ግብዓት እንዲመሰክሩ ያስችላቸዋል, በግብይት ውስጥ የህዝብ መታወቂያ ሳይታይ መፍቻው ለመገምገም ያስችላል, እንዲሁም የውጤቱን ሃሽ ከተመዘገበው የፕሮግራም ፖሊሲ ጋር የሚያገናኝ ደረሰኝ ይመልሳል።

## የሂሳብ {#math}

ይህ ክፍል የአሁኑ RAM-LFE ኮድ የሚጠቀመውን የአተገባበር ደረጃ አልጀብራን ይገልጻል። ይህ የደህንነት ማስረጃ አይደለም ፣ ፖሊሲዎች ፣ ደረሰኞች እና ደንበኞች መስማማት ያለባቸው የዴትሪሚኒስት ትራንስክሪፕትና ምስጠራ-ግምገማ ሞዴል ነው ።

### ማስታወሻ {#notation}

ያድርጉ:

- \(H(m)\) መሆን Iroha `Hash::new(m)`: Blake2b-32 ተጠናቅቋል `m`, በመጨረሻው ባይት ውስጥ በጣም አነስተኛውን ጉልህ ክፍል `1`.
- \(N(x)\) የ `x` ቀኖናዊ Norito ኮድ መሆን አለበት.
- \(a \parallel b\) ማለትም የባይት ገመድ አገናኝ.
- {(\operatorname{le64}(i) \) ያልተፈረመ ሙሉ ቁጥር የ 8-ባይት ትንሽ-ኢንዲያን ኢንኮዲንግ መሆን.
- \(s\) ከዓለም ግዛት ውጭ የተያዘው ሚስጥር መፍትሔ ይሆናል.
- \(P\) የህዝብ ፖሊሲ መለኪያዎች መሆን አለባቸው።
- \(A\) ጋር የተያያዙ መረጃዎችን መጠየቅ.
- \(x\) መደበኛ የግብዓት ባይቶች ወይም Norito-የተመሰጠረ ኢንቨስትመንት ፖስታ, በጀርባ ላይ በመመርኮዝ ሊሆን ይችላል.

RAM-LFE የጎራ-የተለዩ ሃሽዎችን ይጠቀማል። ከዚህ በታች ያሉት ቀመሮች ጎራዎቹን እንደ ዓላማው ይጠቅሳሉ ፣ የአሁኑ ባይት ሰንሰለቶች የሚከተሉት ናቸው:

|ምልክት |የጎራ ሰንጠረዥ |
| --- | --- |
|\(D_{\mathrm{policy}}\) |`iroha.ram_lfe.policy.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{secret}}\) |`iroha.ram_lfe.policy_secret.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{salt}}\) |`iroha.ram_lfe.hkdf_salt.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{hkdf\_opaque}}\) |`iroha.ram_lfe.opaque_info.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{hkdf\_receipt}}\) |`iroha.ram_lfe.receipt_info.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{opaque}}\) |`iroha.ram_lfe.opaque_hash.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{receipt}}\) |`iroha.ram_lfe.receipt_hash.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{affine\_circuit}}\) |`iroha.ram_lfe.bfv_affine.circuit.v1` |
|\(D_{\mathrm{affine\_opaque}}\) |`iroha.ram_lfe.bfv_affine.opaque_hash.v1` |
|\(D_{\mathrm{affine\_receipt}}\) |`iroha.ram_lfe.bfv_affine.receipt_hash.v1` |
|\(D_{\mathrm{program\_memory}}\) |`iroha.ram_lfe.bfv_program.memory.v1` |
|\(D_{\mathrm{program\_opaque}}\) |`iroha.ram_lfe.bfv_program.opaque_hash.v1` |
|\(D_{\mathrm{program\_receipt}}\) |`iroha.ram_lfe.bfv_program.receipt_hash.v1` |
|\(D_{\mathrm{program\_digest}}\) |`iroha.ram_lfe.bfv_program.digest.v1` |
|\(D_{\mathrm{output}}\) |`iroha.ram_lfe.output_hash.v1` |
|\(D_{\mathrm{id\_opaque}}\) |`iroha.ram_lfe.identifier.opaque_hash.v1` |
|\(D_{\mathrm{id\_receipt}}\) |`iroha.ram_lfe.identifier.receipt_hash.v1` |
|\(D_{\mathrm{bfv\_keygen}}\) |`iroha.crypto.fhe.bfv.keygen.v1` |
|\(D_{\mathrm{bfv\_encrypt}}\) |`iroha.crypto.fhe.bfv.encrypt.v1` |
|\(D_{\mathrm{id\_keygen}}\) |`iroha.crypto.fhe.bfv.identifier.keygen.v1` |
|\(D_{\mathrm{id\_slot}}\) |`iroha.crypto.fhe.bfv.identifier.slot.v1` |

### የፖሊሲ ቁርጠኝነት {#policy-commitment}

የፖሊሲ ግዴታ የህዝብ መለኪያዎችን እና የተደበቀውን መፍትሄ ሚስጥር ከጀርባው ጋር ያገናኛል ። በመጀመሪያ ፣ ሚስጥሩ በተናጠል ይፈጸማል

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

ከዚያ የፖሊሲው ሙሉ ትራንስክሪፕት ይከፈታል:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

እና የታተመው ፖሊሲ ሃሽ የሚከተለው ነው:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

በሰንሰለት ላይ ያለው `PolicyCommitment`፡-

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

ግምገማው ከሩጫ ጊዜ ሚስጥር ተመሳሳይ እሴት እንደገና ያስከፍላል ። እንደገና የተሰረዘ ሃሽ ከተለያየ ፣ ግምገማው በውሳኔ አለመጣጣም ይወድቃል።

### HKDF-SHA3-512 የኋላ ኋላ {#hkdf-sha3-512-backend}

ለ `hkdf-sha3-512-prf-v1` የውጤቱ መደበኛ የሆነ ግብዓት ራሱ ነው ፣ ግን ግልጽ ያልሆነ መታወቂያ እና ደረሰኝ ሃሽ ምስጢራዊ የተገደቡ PRF ውፅኢቶች ናቸው።

የጥያቄው ትራንስክሪፕት:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

የ HKDF ጨው እና የስለ-አጋጣሚ ቁልፍ የሚከተሉት ናቸው:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

ግልፅ ያልሆነ ቁሳቁስ ይስፋፋል እና ይከፈላል:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

የምስክር ወረቀት ቁሳቁስ በተጨማሪም ግልጽ ያልሆነውን መታወቂያ ይያዛል

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

የጀርባው መልዕክት እንዲህ ይላል:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV ማስቀመጫ {#bfv-primer}

BFV በገመድ ላይ የተመሠረተ ሆሞሞርፊክ ምስጠራ መርሃግብር ነው ። "ሆሞሞርፍ" ማለት አንድ ፕሮግራም የተመሰጠረ እሴቶችን ማከል እና ማባዛት የሚችል ሲሆን ከስርቆቱ በኋላ በቀላል ጽሑፍ እሴቶች ላይ ተጨማሪዎችን እና ማባዛትን ካከናወነ በኋላ ተመሳሳይ ውጤት ሊያገኝ ይችላል ማለት ነው።

ለ RAM-LFE ፣ BFV እንደ የተመሰጠረ የመግቢያ ዘዴ ጥቅም ላይ ይውላል-

1. የኪስ ቦርሳ እንደ ስልክ ቁጥር ወይም የኢሜይል አድራሻ ያሉ የግል እሴቶችን መደበኛ ያደርገዋል ።
2. የኪስ ቦርሳው ባይቶችን ወደ ትናንሽ የተሟላ ቁጥር ክፍተቶች ይለውጣል።
3. እያንዳንዱ ማስገቢያ በፈቺው BFV የህዝብ ቁልፍ ጋር የተመሰጠረ ነው.
4. የመፍትሄ ሰጪው የሂደት ጊዜ የተደበቀውን ፕሮግራም በእነዚያ ምስጢራዊ ጽሑፎች ላይ ይገመግማል ።
5. ሩጫው ጊዜ የተደበቀውን የፕሮግራም ውፅዓት እና ምልክቶችን ብቻ ይገልጻል ወይም ደረሰኝን ያረጋግጣል ።

BFV ትክክለኛ የተሟላ ቁጥር አሪምቴቲክ ነው, በግምት አይደለም. ለዚህም ነው ለመለየት ባይት እና ለትንሽ ሞጁል ወደ ተንሳፋፊ ነጥብ ሞዴል መደምደሚያ ይልቅ ስሌቶች. Iroha የአሁኑ BFV አጠቃቀም, እያንዳንዱ የተመሰጠረ ማስገቢያ አንድ ስካላር ዋጋ ሞዱሎ ይዟል \(t\), አብዛኛውን ጊዜ አንድ ባይት ወይም ባይት ርዝመት መስክ. \(q\). መካከል ያለው ክፍተት \(q\) እና \(t\) ምስጠራ እና ሆሞሞርፊክ ሥራዎች ለሚያመጣው ጫጫታ የስርጭት ክፍተት ይሰጣል.

የ BFV ቁልፍ ጽሑፍ ሁለት ፖሊኖሚያዊ ክፍሎች አሉት:

$$
c=(c_0,c_1)
$$

ምስጢራዊ ቁልፉ ሌላ ፖሊኖሚያል \(s_k\) ነው። ዲክሪፕት የሚከተሉትን አካላት ያጣምራል-

$$
v = c_0 + c_1s_k
$$

የዲጂታል ጽሑፍ በትክክል ከተፈጠረ እና ጩኸቱ አሁንም ትንሽ ከሆነ, \(v\) ወደ ሚዛናዊ ቀላል ጽሑፍ ቅርብ ነው. ማሽከርከር የድጂታል ንጥረ ነገር ሞዱሎ \(t\)ን መልሶ ያገኛል. ጠቃሚው ባህሪ የዲጂታዊ ጽሑፍ ስራዎች ይህንን መዋቅር ያቆማሉ:

|ቀላል አሠራር|የቁልፍ ጽሑፍ ተግባር |
| --- | --- |
|\(m+n\) |የቁልፍ ጽሑፍ ክፍሎችን ይጨምሩ። |
|\(m+\alpha\) |ወደ \(c_0\) ውስጥ የተለካ የጽድቅ ጽሑፍ ቋሚ ይጨምሩ.|
|\(\alpha m\) |በ \(\alpha\) የሁለቱም ቁልፍ ጽሑፍ ክፍሎች ይለካሉ.|
|\(mn\) |የቁልፍ ጽሑፍ ፖሊኖሚዮችን ይጨምሩ፣ እንደገና ይለካሉ፣ ከዚያም እንደገና ያመቻቹ። |

ማባዛት ውድ የሆነ ተግባር ነው። ከሁለት ሁለት አካላት የኮምፒተር ፅሁፎች አንድ ምርት በተፈጥሮ በ \(1\), \(s_k\) እና \(s_k^2\) የሚከፍት ባለሶስት አካላት ኮምፒተር ጽሁፍ ይፈጥራል. Relinearization \(s_k^2\) የሚለውን ቃል ወደ መደበኛ ባለ ሁለት አካላት የኮምፒተር ጽሑፍ ለመመለስ የታተመ የግምገማ ቁልፍን ይጠቀማል ። ይህም ተመሳሳይ የኮምፒዩተር ጽሑፍ ቅርፅ በመጠቀም በኋላ ላይ ተጨማሪዎችን እና ማባዛት ይጠብቃል ።

BFV እንዲሁ "ደረጃ" ነው: እያንዳንዱ የተመሰጠረ ክዋኔ የተወሰነ የጩኸት በጀት ይጠቀማል. ይህ ትግበራ ያንን በጀት ለማዘመን የ ciphertexts ን አይጀምርም ። በምትኩ ፣ RAM-LFE አንድ ትንሽ `ram_fhe_profile` ያወጣል እና የተገደበ የተደበቀ ፕሮግራም ቅርፅ ብቻ ይቀበላል ። የአሁኑ የፕሮግራም መገለጫ ቋሚ የምዝገባ ቆጠራን ፣ ቋሚ ማህደረ ትውስታ-መንገድ ቆጠራን እና በፕሮግራሙ ደረጃ ላይ ከፍተኛውን አንድ የ ciphertext-ciphertext ማባዛት ያስችላል።

በዚህ RAM-LFE ዲዛይን ውስጥ, BFV የደንበኞችን ግብዓት ከህዝብ መቁጠሪያ ውሂብ እና የትራንስክሽኑን ወይም የመንገድ ጥቅማጥቅሞችን ብቻ ከሚመለከቱ ታዛቢዎች ይደብቃል. ይህ ማለት ሰንሰለት በራሱ የዘፈቀደ የተመሰጠረ ፕሮግራሞችን ያካሂዳል ማለት አይደለም. Torii resolver runtime አሁንም የ BFV ምስጢራዊ ቁሳቁስ ይይዛል ፣ የተዋቀረውን የተደበቀ ፕሮግራም ይገመግማል ፣ የተፈቀደውን ውፅዓት ይገልጻል ፣ እና ውጤቱን ያረጋግጣል ። መቁጠሪያው ከዚያ በሰንሰለት ፖሊሲ ግዴታ ላይ ያለውን ማረጋገጫ ያረጋግጣል እና የህዝብ ቁልፍ ወይም የማረጋገጫ ሜታዳታ ይፈርሳል ።

የማጣሪያ አጠቃቀም ጉዳይ አንድን ቀላል ውክልና ሆን ብሎ ይመርጣል. መደበኛ የሆነ ሰንሰለት እንደሚከተለው ይሰጠራል:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

እያንዳንዱ ንጥረ ነገር እንደ የራሱ BFV ስካላር ምስጠራ ጽሑፍ ተመዝግቧል ። ይህ ቅርፅ መደበኛነት እና የ envelope ማረጋገጫ ግልፅ ያደርገዋል ፣ ቦርሳዎች ከህዝባዊ መለኪያዎች የተመሰጠረ ጥያቄዎችን እንዲገነቡ ያስችላቸዋል ፣ እናም መፍትሄ ሰጪው ተመጣጣኝ የሆኑ የተመሰጠሩ ግብዓቶችን ወደ ተረጋጋ ደረሰኝ ትራንስክሪፕት እንዲያስተላልፍ ያስችለዋል።

### BFV ቀለበት ሞዴል {#bfv-ring-model}

የ BFV ጀርባዎች ነጋሳይክሊክ ፖሊኖሚያል ቀለበት ይጠቀማሉ:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

እና ቀላል ጽሑፍ ቀለበት:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

የት:

- \(n\) ነው `polynomial_degree`, የሁለት ኃይል
- \(q\) ነው `ciphertext_modulus`
- \(t\) ነው `plaintext_modulus`
- \(q > t\) እና \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

የጽሁፍ ክፍፍል ቬክተሮች እያንዳንዳቸውን ክፍሎች በመለኪያ በማስመዝገብ ይከፈታሉ

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

የዴክሪፕሽን ማዕከል-ሊፍት እያንዳንዱን ጠቋሚ ይከፍላል:

$$
v = c_0 + c_1 s_k \in R_q
$$

ከዚያም ወደ \(R_t\) ይዞራል:

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

እዚህ . \(s_k\) ነው BFV ምስጢራዊ ቁልፍ ፖሊኖሚያል እንጂ ውጫዊው አይደለም RAM-LFE መፍትሄ ሚስጥር \(s\).

### BFV ቁልፍ ትውልድ {#bfv-key-generation}

ለተመሰጠረ መታወቂያ ግብዓት BFV ቁልፍ ቁሳቁስ በፈቺው ምስጢራዊ እና ተጓዳኝ መረጃ መሠረት የተወሰነ ነው-

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG እንደሚከተለው ይተከላል

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

ቁልፍ ማመንጫዎች ናሙናዎች:

- \(s_k \in \{-1,0,1\}^n\), የተወከለው modulo \(q\)
- \(a \leftarrow R_q\) አንድ አይነት
- \(e \in \{-1,0,1\}^n\)

የሕዝብ ቁልፍ፡-

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

ለ relinearization, \(s_k^2\) በ \(R_q\) ውስጥ ያለው ቀለበት ምርት ይሁን. ለእያንዳንዱ የመሠረት-\(B\) ዲጂት \(j\), ከትንሽ ስርጭቱ አንድ ዓይነት ናሙና \(a_j\) እና \(e_j\) ይተግብሩ, ከዚያም ያወጣሉ:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

የህዝብ BFV ፖሊሲ ሜታዳታ \(((n,q,t,B)\), የሕዝብ ቁልፍ, እና `max_input_bytes` ይዟል. የ BFV ምስጢራዊ ቁልፍ እና relinearization ቁልፍ በመፍትሄ ጊዜ ውስጥ ይቆያሉ.

### BFV ምስጠራ እና ስራዎች {#bfv-encryption-and-operations}

አንድ ቀላል ጽሑፍ ፖሊኖሚየልን \(m\) ለመሰየም ፣ ትግበራው ከሌላ ChaCha20 RNG ጋር ይዘርፋል ከ:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

\(u,e_1,e_2 \in \{-1,0,1\}^n\) ናሙናዎችን ይይዛል እና ይሰበስባል:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

የቁልፍ ጽሑፍ \(c=(c_0,c_1)\ ነው) ።

የሆሞሞርፊክ መጨመር በኮምፒዩተሮች ላይ የተመሠረተ ነው

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

የጽኑ ጽሑፍ ስካላር \(\alpha\) ን ወደ ጥምርተኛው ዜሮ ለውጥ ብቻ \(c_0\) መጨመር:

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

በቀላል ጽሑፍ ስካላር \(\alpha\) በማባዛት ሁለቱንም አካላት ይለካሉ-

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

ለሁለት ምስጠራ ጽሑፎች \(c=(c _0,c_1)\) እና \(d=(d_0,d_1)\), የሳይበር ጽሑፍ ማባዛት በመጀመሪያ የሦስት መጠን ያለው የሳይበር ጽሁፍ ያሰላል እና እያንዳንዱን ረቂቅ ወደ ኋላ በ \(t/q\):

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

ከላይ ያሉት ሁሉም ምርቶች በ \(R_q\) ውስጥ የነጋሳይክሊክ ቀለበት ምርቶች ናቸው ። ከዚያ \(\tilde c_2\) ወደ መሰረታዊ-\(B\) ፖሊኖሚሎች ይከፈላል

$$
\tilde c_2 = \sum_j B^j u_j
$$

እና እንደገና ተዘርዝሯል:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

ውጤቱ ደግሞ የሁለት አካላት BFV ቁልፍ ጽሑፍ ነው።

### መታወቂያ የቁልፍ ጽሑፍ ፖስታ {#identifier-ciphertext-envelope}

የመለየት ማስገቢያ ባይት ገመድ:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

በስካላር ክፍተቶች ውስጥ ይከፈታል:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

እና የቀሩት ክፍተቶች በሙሉ እስከ `max_input_bytes + 1` ድረስ ዜሮ ናቸው ። እያንዳንዱ የስካላር ክፍተት እንደ የቁጥር-ዜሮ ቀላል ጽሑፍ ፖሊኖሚል \([m_i]\) ተመዝግቧል ። በአንድ ክፍት ምስጠራ ዘር የሚከተለው ነው

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

የተከፈተው መታወቂያ ፖስታ የሚከተለው ነው

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

የት \(M=\mathrm{max\_input\_bytes}\).

### BFV አፋይን ዳግመኛ {#bfv-affine-backend}

ለ `bfv-affine-sha3-256-v1`, የ ሩጫ ጊዜ በመጀመሪያ የሚመነጭ BFV ቁልፍ ቁሳቁስ \(s\) እና \(A\). የተገኙት የህዝብ መለኪያዎች በሰንሰለት ላይ ከተፈጸሙት የህዝብ መመዘኛዎች ጋር በትክክል ሊዛመዱ ይገባል.

የአፍፊን ወረዳ ዘር፡-

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

ከዚህ ዘር የሩጫ ጊዜ ናሙናዎች, modulo \(t\), 32 ረድፍ አፊን ወረዳ:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

\(m_i\) የተከፈቱት የማጣሪያ ክፍተቶች ናቸው። በሆሞሞርፊክ ሁኔታ ተመሳሳይ ዋጋን በኮምፒተር ጽሑፎች ላይ ይሰላል-

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

መፍትሄ ሰጪው እያንዳንዱን \(C_j\) ይገልጻል ፣ ሁሉም ቀጣይ የጽድቅ ጽሑፍ ጠቋሚዎች ዜሮ እንዲሆኑ ይጠይቃል ፣ ጠቋሚ-ዜሮ እሴቶችን ወደ ባይት ይቀይረዋል ፣ እና ቅርጾች:

$$
O=(y_0,\ldots,y_{31})
$$

ከዚያም:

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

### BFV በፕሮግራም የተሰራ የጀርባ አወጣጥ {#bfv-programmed-backend}

ለ `bfv-programmed-sha3-256-v1` የህዝብ መለኪያዎች የ BFV መታወቂያ ምስጠራ መለኪያዎችን እና የተደበቀ ፕሮግራም ዲጀስት ያካትታሉ:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

የአሁኑ RAM-FHE መገለጫ፡-

|መስክ |ዋጋ |
| --- | --- |
|`profile_version` | `1` |
|`register_count` | `4` |
|`memory_lane_count` | `32` |
|`ciphertext_mul_per_step` | `1` |
|`encrypted_input_mode` |`resolver_canonicalized_envelope_v1` |
|`min_ciphertext_modulus` | \(2^{52}\) |

ለ Torii የቀረበው ግልጽ ጽሑፍ ግብዓት ከመፈፀሙ በፊት በተመሳሳይ BFV ፖስታ ውስጥ ይመሰጠራል። ለዚህ የአገልጋይ ወገን ምስጠራ የተወሰነው ዘር የሚከተለው ነው:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

ከውጭ ለሚቀርቡ የተመሰጠረ ግብዓት ፣ መፍትሄ ሰጪው የመታወቂያ ጥቅሉን ይገልጻል እና ከመፈፀሙ በፊት ወደዚህ የ Deterministic envelope እንደገና ይመሰጠራል። ያ ካኖኒካላይዜሽን በሴማንቲክ እኩል BFV ምስጠራ ጽሑፎች ውስጥ ደረሰኝ ሃሽዎችን የተረጋጋ ያደርገዋል ።

የመጀመሪያዎቹ የተመሰጠረ ማህደረ ትውስታ መስመሮች ከሚከተሉት የተገኙ ናቸው:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

ለ 32 መስመሮች ለእያንዳንዱ የሂደት ጊዜ ናሙናዎች \(r_j \in [0,t)\) እና የ BFV ምስጠራ ጽሑፍ በማከማቸት \(r_j\)። የተደበቀው ፕሮግራም ከዚያ በተመሰጠረ መዝገብ እና በተመሰጠረ ማህደረ ትውስታ ላይ ይሰራል

|መመሪያ |አልጀብራ |
| --- | --- |
|`LoadInput(dst, i)` |\(R_{\mathrm{dst}} \leftarrow C_i\) |
|`LoadState(dst, j)` |\(R_{\mathrm{dst}} \leftarrow S_j\) |
|`StoreState(j, src)` |\(S_j \leftarrow R_{\mathrm{src}}\) |
|`LoadConst(dst, a)` |\(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(ሀ)\) |
|`Add(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
|`AddPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
|`SubPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
|`MulPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
|`Mul(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_aR_b\), ከዚያም እንደገና መስመራዊ |
|`SelectEqZero(dst, cond, z, nz)` |\(R_{\mathrm{cond}}\) ዲክሪፕት አድርግ፤ ዜሮ ከሆነ \(R_z\) ይምረጡ፣ አለበለዚያ \(R_{nz}\)። |
|`Output(src)` |\(R_{\mathrm{src}}\) ወደ ውፅዓት መዝገብ ዝርዝር ይጨምር። |

የማስተማሪያ ቴፕ ከተጠናቀቀ በኋላ መፍትሄ ሰጪው እያንዳንዱን የውጤት መዝገብ ዲክሪፕት ያደርጋል ፣ 0 ን ወደ ባይት ይቀይረዋል ፣ እና እነዚያን ባይቶች ያገናኛል ።

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

አጠቃላይ የፕሮግራም የተደረገባቸው የጀርባ አገናኞች የሚከተሉት ናቸው:

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

ነባሪው የፕሮግራም መታወቂያ ቴፕ 64 የመግቢያ ቦታዎች አሉት ። ለእያንዳንዱ ክፍተት \(i\) ፣ የመግቢያ ቦታውን ይጫናል ፣ የማስታወስ መስመሩን ይጫናል \(i \bmod 32\) ፣ ያክላል ፣ እና ውጤቱን ያስወጣል:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### የውጤት ሃሽ እና ደረሰኞች {#output-hashes-and-receipts}

አጠቃላይ RAM-LFE አፈፃፀም ደረሰኝ ጥሬ ውፅዓት አይፈርም ። የውፅአት ሃሽ ይፈርዳል

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

ለ Torii RAM-LFE አፈፃፀም ደረሰኞች የተዛመዱ መረጃዎች ቀኖናዊ የፕሮግራም መታወቂያ ባይት ናቸው-

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

የተፈረመ ደረሰኝ ጥቅማጥቅሞች:

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

ለ `signed` ሁነታ:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

ማረጋገጫው ፊርማውን በ `resolver_public_key` ያረጋግጣል እና እነዚህ ሁሉ እኩልነቶች ካልሆኑ በስተቀር ደረሰኙን ውድቅ ያደርጋል:

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

ጥሪውን የሚያቀርብ ከሆነ `output_hex` ማረጋገጫ ሰጪው ደግሞ የሚከተሉትን ያረጋግጣል:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

ለ `proof` ሁነታ ፣ ማረጋገጫው ፊርማ ከመሆን ይልቅ የምስክር ወረቀት ጥቅል ይይዛል። የማረጋገጫው ዳግም ማስረጃ ፣ የወረዳ መታወቂያ ፣ የህዝብ መግቢያ መርሃግብር ሃሽ ፣ የማረጋገጫ ቁልፍ ሃሽ እና የተጋለጡ የሕዝብ ምሳሌዎች ከሙከራ ማረጋገጫ ሜታዳታ እና ከኮድ የተቀበለው ደረሰኝ-ክፍያ ሃሽ ጋር የሚጣጣም መሆኑን ያረጋግጣል ። እስቲ:

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

የሚጠበቁ የህዝብ ምሳሌዎች አራት የአንድ አካል አምዶች ናቸው ። አምድ \(j\) ባይት \(h_{8j}\ldots h_{8j+7}\) ይዟል ፣ ከዚያ በኋላ 24 ዜሮ ባይት:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### የመለየት መለኪያ {#identifier-projection}

መታወቂያ ጥራት እንደ ተጠቃሚው-ተኮር ግልጽ ያልሆነ መለያ መታወቂያ አጠቃላይ የጀርባ መጨረሻን `opaque_hash` አይጠቀምም። የ RAM-LFE የውጤት ሃሽ በመለየት ላይ በተወሰኑ ጎራዎች በኩል ይቀርባል:

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

አንድ `IdentifierResolutionReceipt` የከፍተኛ ደረጃ ጠቃሚ ጭነት ይፈርማል:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

ለተፈረሙ መታወቂያ ደረሰኞች:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` ደረሰኙን የሚቀበለው ፊርማው ወይም ማረጋገጫው ትክክለኛ ከሆነ ብቻ ነው ፣ የተካተተው RAM-LFE አፈፃፀም ጭነት ከተጠቀሰው የፕሮግራም ፖሊሲ ጋር የሚስማማ ሲሆን `uaid` እና `account_id` የሚጠየቀው አስገዳጅነት ነው።

## የአፈፃፀም ፍሰት {#execution-flow}

አንድ አጠቃላይ RAM-LFE አፈጻጸም የሚከተለውን ቅርፅ ይከተላል:

1. አስተዳደር ወይም ኦፕሬተር መዝገቦች `RamLfeProgramPolicy`።
2. ባለቤቱ ፖሊሲውን ያነቃቃል።
3. ደንበኛው የህዝብ ፖሊሲ ሜታዳታዎችን ከ Torii ያነባል ።
4. ደንበኛው በትክክል አንድ የመግቢያ ቅጽ ወደ መፍትሔው ያቀርባል: ቀላል ጽሑፍ `input_hex` ወይም የተመሰጠረ የግብዓት ፖስታ BFV።
5. የ ሩጫ ጊዜ የተደበቀ ፕሮግራም ይገመግማል እና ይመለሳል `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash`, እና ሀ `RamLfeExecutionReceipt`.
6. ደንበኛው ወይም የጀርባው ክፍል ደረሰኙን ከታተመው ፖሊሲ ጋር በማነፃፀር ያረጋግጣል ፣ አማራጭም የተመለሰው `output_hex` ወደ ደረሰኙ `output_hash` ሃሽ መሆኑን ያረጋግጣል ።
7. እንደ `ClaimIdentifier` ያሉ የከፍተኛ ደረጃ መመሪያዎች ጥሬ ግብዓትን ከመጫን ይልቅ የተረጋገጠ ደረሰኝን ማስገባት ይችላሉ ።

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

## የመለየት ፖሊሲዎች {#identifier-policies}

የመለየት ፖሊሲዎች RAM-LFE ን ተጨባጭ አጠቃቀም ናቸው ። በአጠቃላይ የፕሮግራም ፖሊሲ ላይ የንግድ ስም ቦታ እና መደበኛነት ደንብ ይጨምራሉ-

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

የማጣሪያው ንብርብሮች የሚከተሉትን ለማገናኘት RAM-LFE ደረሰኝ ይጠቀማሉ።

- `policy_id`
- በተደበቀ ተግባር የተገኘው ግልጽ ያልሆነ መለያ
- የመወሰን `receipt_hash`
- ሂሳቡ UAID
- የካኖኒክ `account_id`
- የጄኔሪክ RAM-LFE አፈፃፀም ጠቃሚ ጭነት

ለተጠቃሚዎች-ተኮር የደንበኝነት ምዝገባ ስያሜዎችን ከግል መታወቂያዎች ለየብቻ ይያዙ። ስያሜዎች የህዝብ ስሞች ናቸው ፣ የስልክ ቁጥሮች ፣ የኢሜል አድራሻዎች እና መሰል እሴቶች በመለየት ፖሊሲዎች እና ደረሰኞች ውስጥ መፍሰስ አለባቸው ።

## Torii መንገዶች {#torii-routes}

የመተግበሪያ-ተኮር የመንገድ ቤተሰብ ሲነቃ Torii RAM-LFE እና መታወቂያ ረዳቶችን ያጋልጣል:

|መንገድ |ዓላማ|
| --- | --- |
|`GET /v1/ram-lfe/program-policies` |RAM-LFE የፕሮግራም ፖሊሲዎችን እና የህዝብ አፈፃፀም ሜታዳታዎችን አክቲቭ እና ኢ-አክቲቭ አድርግ። |
|`POST /v1/ram-lfe/programs/{program_id}/execute` |ከ `input_hex` ወይም `encrypted_input` አንድ ፕሮግራም አሂድ እና የውጤት ሃሽዎችን መልሶ ያግኙ ከአገርነት ነፃ ደረሰኝ ጋር። |
|`POST /v1/ram-lfe/receipts/verify` |ከታተመው ፖሊሲ ጋር `RamLfeExecutionReceipt` ን ያረጋግጡ እና እንደ አማራጭ `output_hex` ን ከ `output_hash` ጋር አወዳድር። |
|`GET /v1/identifier-policies` |የማጣሪያ ፖሊሲዎችን, መደበኛነት ሁነታዎች, መፍትሄ ቁልፎች እና የተመሰጠረ-መግቢያ ሜታዳታ ዝርዝር. |
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt` |ተጠቃሚው በ `ClaimIdentifier` ውስጥ ማስገባት የሚችለው ደረሰኝ ያወጣል። |
|`POST /v1/identifiers/resolve` |አንድ ንቁ የይገባኛል ጥያቄ በሚኖርበት ጊዜ በተያያዘው ሂሳብ ላይ መደበኛ የሆነ መታወቂያ ግብዓት መፍታት። |
|`GET /v1/identifiers/receipts/{receipt_hash}` |ለኦዲት እና ድጋፍ መሳሪያዎች በሳንቲም ሃሽ በመጠቀም ቀጣይነት ያለው መታወቂያ ጥያቄን ይፈልጉ። |

ከመገንባትዎ በፊት ሁልጊዜ የዒላማው ኖት `/openapi` ወይም `/openapi.json` ሰነድ በእነዚህ መስመሮች ላይ ያረጋግጡ ። ተገኝነት በኖድ ግንባታ እና በአውታረ መረብ መገለጫ ላይ የተመሠረተ ነው ።

## የአውታረ መረብ የስራ ሰዓት {#node-runtime}

Torii በሂደት ላይ ነው RAM-LFE የስራ ሰዓት በ `torii.ram_lfe.programs[*]`, በቁልፍ `program_id`. እያንዳንዱ የተዋቀረ ፕሮግራም በሰንሰለት ላይ ያለውን የፖሊሲ ግዴታ የሚስማማ መሆን አለበት እና ለመገምገም የሚያስፈልገውን የአሂድ ጊዜ ቁሳቁስ ማቅረብ አለበት የምስክር ወረቀቶችን ያረጋግጡ። የማጣሪያ መስመሮች ይህንን ተመሳሳይ አሂድ ጊዜ እንደገና ይጠቀማሉ; ለየት ያለ የማጣሪያ-መፍትሄ ሰጪ ውቅር ገጽ አያስፈልጋቸውም.

የፖሊሲን ሰንሰለት በራሱ መመዝገብ ብቻውን በቂ አይደለም ። አንድ ዒላማ ኖት እንዲሁ የመንገድ ቤተሰብን መግለፅ አለበት እና ለማከናወን ለሚጠበቀው ፕሮግራሞች ተዛማጅ የአሂድ ጊዜ ቁሳቁስ ሊኖረው ይገባል ።

## የኦፕሬሽን ጠባቂዎች {#operational-guardrails}

- ፖሊሲዎቹን በማስመዝገብ የማይንቀሳቀስ፣ የሕዝብ ሜታዳታዎችን ማረጋገጥ እና ከዚያ እነሱን ማግበር።
- የግምገማ ሚስጥሮች, resolver ፊርማ ቁልፎች, እና BFV ምስጢራዊ ቁሳቁሶች ከ ሰነዶች, መዝገቦች, ግብይቶች, እና ደንበኛ ጥቅሎች ውስጥ የተደበቁ ጠብቁ.
- በሂሳብ ስያሜዎች ፣ በትራንስክሬሽን ሜታዳታ ፣ ክስተቶች ወይም በዓለም ሁኔታ መስኮች ውስጥ ጥሬ መለያዎችን አይጥሉ ።
- SDK ማረጋገጫ ሰጪውን በሚያጋልጥበት ጊዜ የከፍተኛ ደረጃ መመሪያዎችን ከማቅረብዎ በፊት ደረሰኞችን ከደንበኛ ወገን ያረጋግጡ ።
- የቆዩ ደረሰኞች ለዘለቄታው ሊቆዩ የማይችሉባቸው ጊዜያቸውን የሚያጠናቅቁ መስኮች ይጠቀሙ።
- አዲስ ፕሮግራም ወይም መታወቂያ ፖሊሲ በመመዝገብ ፣ ደንበኞችን በማዛወር እና አዲሱን ደረሰኝ ሲፈስ አሮጌውን ፖሊሲ በማሰናከል ማሽከርከር ።

## ተዛማጅ ርዕሰ ጉዳዮች {#related-topics}

- [ለግል የመረጃ ቦታ ስፖንሰር ክፍያዎች](/am/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii የፍፃሜ ነጥቦች](/am/reference/torii-endpoints.md#app-and-sora-route-families)
- [የማይታወቁ ግብይቶች](/am/blockchain/anonymous-transactions.md)
