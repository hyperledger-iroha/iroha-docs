---
translation_locale: am
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE ለዘፈቀደ መዳረሻ ማሽን ላኮኒክ ተግባር መገምገም ማለት ነው።
Iroha, ይህ የህዝብ ፖሊሲ ለፕሮግራሞች አጠቃላይ የተደበቀ ተግባር ንብርብር ነው
በሰንሰለት ላይ ነው ነገር ግን የእሱ ግምገማ ሎጂክ ፣ ምስጢራዊ ወይም ጥሬ ግብዓት መሆን የለበትም
ለዓለም አቀፉ መንግስት የተጻፈ ነው። SORA Nexus የመለየት ፍሰቶች፣ ለምሳሌ
የግል ስልክ ወይም ኢሜይል ፍለጋ, እና ደግሞ አጠቃላይ ሆኖ ሊገለጥ ይችላል Torii
የአውታረ መረብ መገለጫ መተግበሪያ-ተኮር መንገዶችን ያስችለዋል ጊዜ የፕሮግራም አፈጻጸም ረዳት.

ሰንሰለት የፖሊሲ ግዴታ እና ደረሰኝ ማረጋገጫ ሜታዳታዎችን ያከማቻል ።
ፈታኝ ወይም Torii ሩጫ ጊዜ የተደበቀውን ፕሮግራም ይገመግማል, ብቻ የሚመለስ
የተፈቀደ ውፅዓት, እና ደንበኞች, ድጋፍ መሳሪያ ወይም
የመጽሐፉ መመሪያዎች ከተመዘገቡት ፖሊሲ ጋር ሊጣጣሙ ይችላሉ።

## ስም መስጠት {#naming}

የስም ማከፋፈያ ጉዳይ:

| የጊዜ ገደብ | ትርጉም |
| --- | --- |
| `ram_lfe` | ውጫዊው የተደበቀ ተግባር ማጠቃለያ: የፕሮግራም ፖሊሲዎች, ግዴታዎች, የማስፈጸሚያ ደረሰኞች እና ደረሰኝ ማረጋገጫ ሁነታ. |
| `BFV` | በኮድ የተደረገ ግብዓት የሚጠቀሙት የብራከርስኪ/ፋን-ቨርካውተርን ሆሞሞርፊክ ምስጠራ ስርዓት RAM-LFE ወደ ኋላ። |
| `ram_fhe_profile` | BFV- ለፕሮግራም የተሰራ የስርዓት ማሽን ልዩ ሜታዳታ RAM-LFE. |

በመረጃ ሞዴሉ ውስጥ `RamLfeProgramPolicy` እና `RamLfeExecutionReceipt` ናቸው
RAM-LFE ዓይነቶች. BFV መለኪያዎች, የኮምፒተር ጽሑፍ ፖስታዎች, እና የተደበቁ
RAM-FHE የፕሮግራሙ መገለጫ በኤች.
ፖሊሲ.

## መጽሐፍ ቅዱስ ምን ይላል? {#what-it-records}

ሀ RAM-LFE የፕሮግራሙ ፖሊሲ በዓለም አቀፍ ደረጃ በ `program_id`. ፖሊሲው
የሚከተሉትን ይ containsል:

- የባለቤትነት መለያውን ማንቃት፣ ማሰናከል ወይም በሌላ መንገድ መቀየር የሚችል
  ፖሊሲ
- ለደንበኞች የሚስተዋወቀው የጀርባ መጨረሻ
- ደረሰኝ ማረጋገጫ ዘዴ `signed` ወይም `proof`
- የተደበቀ የፕሮግራም ሜታዳታ እና ገምጋሚ ሚስጥር
- ለተፈረሙ ደረሰኞች የህዝብ ቁልፍ መፍትሄ
- አማራጭ የህዝብ የተመሰጠረ የመግቢያ ሜታዳታ ፣ ለምሳሌ BFV መለኪያዎች እና
  `ram_fhe_profile`
- አንድ `active` ፖሊሲው አዲስ ደረሰኝ ማቅረብ የሚችልበትን ሁኔታ የሚቆጣጠር ባንዲራ

የተደበቀ ሚስጥር, ግልጽ ጽሑፍ መታወቂያ ዋጋ, እና የተደበቁ ፕሮግራም አካል ናቸው
ደንበኞች ግዴታዎችን፣ ግልጽ ያልሆኑ ሃሽቶችን፣
ተቀባይነት ያላቸው ሃሽዎች፣ የኮምፒተር ጽሁፎች እና የፕሮግራም ዲጀቶች ግልጽ ያልሆኑ የፕሮቶኮል እሴቶች ናቸው።

## የኋላ ታሪክ {#backends}

የአሁኑ RAM-LFE ድጋፉ በሶስት የጀርባ መለያዎች ላይ ያተኮረ ነው-

| የኋላ ኋላ | አጠቃቀም |
| --- | --- |
| `hkdf-sha3-512-prf-v1` | ተሳትፎ የተገደበ PRF ግምገማ። |
| `bfv-affine-sha3-256-v1` | BFV- የተመሰጠረ መታወቂያ ክፍተቶች ላይ የሚደገፍ ሚስጥራዊ አፋይን ግምገማ። |
| `bfv-programmed-sha3-256-v1` | BFV- የተደገፈ የፕሮግራም አሠራር በሂደታዊ መዝገቦች እና በማስታወሻ መስመሮች ላይ። |

ለታወቂያ ፖሊሲዎች, የፕሮግራም BFV የኋላ ኋላ አስፈላጊ ዘመናዊ ነው
መንገድ. ይህም ቦርሳዎች አካባቢያዊ መደበኛ ግብዓት encrypt ያስችልዎታል, መፍቻ ያስችለዋል
በግብይት ውስጥ የህዝብ መታወቂያ ሳይታይ ይገመግማል, እና አንድ ይመለሳል
የውጤቱን ሃሽ ከተመዘገበው የፕሮግራም ፖሊሲ ጋር የሚያገናኝ ደረሰኝ።

## የሂሳብ {#math}

ይህ ክፍል የአሁኑን ጥቅም ላይ የዋለውን የአተገባበር ደረጃ አልጀብራ ይገልጻል
RAM-LFE ይህ የደህንነት ማረጋገጫ አይደለም፤ የዴትሪሚኒስት ትራንስክሪፕት ነው
እና ፖሊሲዎች, ደረሰኞች, እና ደንበኞች የግድ
እስማማለሁ።

### ማስታወሻ {#notation}

ይፍቀዱ

- \(H(m)\) መሆን Iroha `Hash::new(m)`: ብሌክ 2 ቢ-32 ተጠናቀቀ `m`, ቢያንስ
  የመጨረሻ ባይት ጉልህ ክፍል `1`.
- \(N(x)\) የካኖኒካል መሆን Norito የ `x`.
- \(a \parallel b\) አማካይ የባይት-ቅጥሮች ተያያዥነት።
- \(\operatorname{le64}
  ያልተፈረመ ሙሉ ቁጥር።
- \(s\) ከዓለም ውጪ የሚገኘውን ምስጢራዊ መፍትሔ መሆን።
- \(P\) የሕዝብ ፖሊሲዎች መለኪያዎች መሆን አለባቸው።
- \(A\) የተዛመዱ መረጃዎችን መጠየቅ።
- \(x\) የተለመዱ የግብዓት ባይት ወይም Norito-የተመሰጠረ-የተመሰከረ-መግቢያ
  በጀርባው ላይ በመመርኮዝ.

RAM-LFE ከዚህ በታች ያሉት ቀመሮች ጎራዎችን በ
ዓላማ፤ የአሁኑ ባይት ገመዶች የሚከተሉት ናቸው

| ምልክት | የጎራ ሰንጠረዥ |
| --- | --- |
| \(D_{\mathrm{policy}}\) | `iroha.ram_lfe.policy.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{secret}}\) | `iroha.ram_lfe.policy_secret.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{salt}}\) | `iroha.ram_lfe.hkdf_salt.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{hkdf\_opaque}}\) | `iroha.ram_lfe.opaque_info.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{hkdf\_receipt}}\) | `iroha.ram_lfe.receipt_info.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{opaque}}\) | `iroha.ram_lfe.opaque_hash.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{receipt}}\) | `iroha.ram_lfe.receipt_hash.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{affine\_circuit}}\) | `iroha.ram_lfe.bfv_affine.circuit.v1` |
| \(D_{\mathrm{affine\_opaque}}\) | `iroha.ram_lfe.bfv_affine.opaque_hash.v1` |
| \(D_{\mathrm{affine\_receipt}}\) | `iroha.ram_lfe.bfv_affine.receipt_hash.v1` |
| \(D_{\mathrm{program\_memory}}\) | `iroha.ram_lfe.bfv_program.memory.v1` |
| \(D_{\mathrm{program\_opaque}}\) | `iroha.ram_lfe.bfv_program.opaque_hash.v1` |
| \(D_{\mathrm{program\_receipt}}\) | `iroha.ram_lfe.bfv_program.receipt_hash.v1` |
| \(D_{\mathrm{program\_digest}}\) | `iroha.ram_lfe.bfv_program.digest.v1` |
| \(D_{\mathrm{output}}\) | `iroha.ram_lfe.output_hash.v1` |
| \(D_{\mathrm{id\_opaque}}\) | `iroha.ram_lfe.identifier.opaque_hash.v1` |
| \(D_{\mathrm{id\_receipt}}\) | `iroha.ram_lfe.identifier.receipt_hash.v1` |
| \(D_{\mathrm{bfv\_keygen}}\) | `iroha.crypto.fhe.bfv.keygen.v1` |
| \(D_{\mathrm{bfv\_encrypt}}\) | `iroha.crypto.fhe.bfv.encrypt.v1` |
| \(D_{\mathrm{id\_keygen}}\) | `iroha.crypto.fhe.bfv.identifier.keygen.v1` |
| \(D_{\mathrm{id\_slot}}\) | `iroha.crypto.fhe.bfv.identifier.slot.v1` |

### የፖሊሲ ቁርጠኝነት {#policy-commitment}

የፖሊሲ ግዴታ የህዝብ መለኪያዎችን እና የተደበቁ መፍትሄ ሚስጥር
በመጀመሪያ፣ ሚስጥሩ በተናጠል ይፈጸማል፦

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

ከዚያ ሙሉው ፖሊሲ ትራንስክሪፕት ይከፈታል:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

እና የታተመው ፖሊሲ ሃሽ የሚከተለው ነው

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

በሰንሰለት ላይ `PolicyCommitment` ነው:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

ግምገማው ተመሳሳይ እሴት ከሩጫ ጊዜ ምስጢር እንደገና ይለካል።
ዳግም የተሰነዘረው ሃሽ ይለያያል፣ ግምገማው ከግዴታ ጋር የሚጣጣም አለመሆኑን ያመለክታል።

### HKDF-SHA3-512 የኋላ ኋላ {#hkdf-sha3-512-backend}

ለ `hkdf-sha3-512-prf-v1`, ውፅዓት ራሱ መደበኛ ግብዓት ነው, ነገር ግን
ግልፅ ያልሆነ መታወቂያ እና ደረሰኝ ሃሽ በስውር የተገደቡ ናቸው PRF ውጤቶች።

የጠየቁት ጽሑፍ የሚከተለው ነው:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

የ HKDF ጨው እና ስውዶ-አጋጣሚ ቁልፍ የሚከተሉት ናቸው:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

ግልጽ ያልሆነ ቁሳቁስ ይስፋፋል እና ይተላለፋል።

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

የቅዳሜና እይታ ማረጋገጫ ቁሳቁስ በተጨማሪ ግልጽ ያልሆነውን መታወቂያ ይይዛል

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

የጀርባው መጨረሻ መልሶ ይሰጠዋል:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV ቀዳሚ {#bfv-primer}

BFV "ሆሞሞርፊክ" ማለት
አንድ ፕሮግራም የተመሰጠረ እሴቶችን መጨመር እና ማባዛት እንደሚችል እና ከዲክሪፕት በኋላ
አጠቃቀሞችን እና ማባዛትንም ያከናወነ ቢሆን ኖሮ ተመሳሳይ ውጤት ያገኛል
በቀላል ጽሑፍ እሴቶች ላይ።

ለ RAM-LFE, BFV እንደ የተመሰጠረ የመግቢያ ዘዴ ጥቅም ላይ ይውላል:

1. የኪስ ቦርሳ እንደ ስልክ ቁጥር ወይም ኢሜይል ያሉ የግል እሴቶችን መደበኛ ያደርገዋል
   አድራሻ።
2. የኪስ ቦርሳው ባይቶችን ወደ ትናንሽ የተሟላ ቁጥር ክፍተቶች ይለውጣል።
3. እያንዳንዱ ማስገቢያ በፈቺው መፍትሔ ጋር የተመሰጠረ ነው BFV የሕዝብ ቁልፍ።
4. የመፍትሄ ሰጪው ሩጫ ጊዜ የተደበቀውን ፕሮግራም በእነዚያ የኮምፒተር ጽሑፎች ላይ ይገመግማል.
5. የ ሩጫ ጊዜ ብቻ የተደበቀ ፕሮግራም ውፅዓት እና ምልክቶች ይገልጻል ወይም አንድ ያረጋግጣል
   ደረሰኝ።

BFV ይህ ትክክለኛ የሙሉ ቁጥር ሒሳብ ነው, ቅርብ ሒሳብ አይደለም.
ለታወቂያ ባይት እና ለአነስተኛ ሞዱል ስሌቶች በተሻለ ተስማሚ
የጦር ነጥብ ሞዴል መወሰን Iroha የአሁኑ BFV አጠቃቀም, እያንዳንዱ የተመሰጠረ
ማስገቢያ አንድ ስካላር ዋጋ ሞዱሎ ይዟል \(t\), አብዛኛውን ጊዜ ባይት ወይም ባይት ርዝመት
መስክ. የ ምስጠራ ጽሑፍ ራሱ በብዙ ትልቅ ሙሉ ቁጥር ሞጁል ውስጥ ይኖራል \(q\). የ
መካከል ያለው ክፍተት \(q\) እና \(t\) ይህ ምስጠራ ጩኸት ለ decryption ቦታ ይሰጣል
እና homomorphic ሥራዎች ማስገባት.

ሀ BFV የሲፊር ጽሑፍ ሁለት ፖሊኖሚያዊ ክፍሎች አሉት-

$$
c=(c_0,c_1)
$$

ምስጢራዊ ቁልፍ ሌላ ፖሊኖሚየም ነው \(s_k\). ዲክሪፕት
ክፍሎች:

$$
v = c_0 + c_1s_k
$$

የኮድ ጽሑፍ በትክክል የተፈጠረ ከሆነ እና ጩኸት አሁንም ትንሽ በቂ ነው,
\(v\) ወደ ሚዛናዊ ግልጽ ጽሑፍ ቅርብ ነው.
ሞጁል ጥምርታ \(t\). ጠቃሚ ባህሪ የሲፊር ጽሑፍ ስራዎች ነው
ይህንን መዋቅር መጠበቅ:

| ቀለል ያለ አሠራር | የቁልፍ ጽሑፍ ተግባር |
| --- | --- |
| \(m+n\) | የሲፊር ጽሑፍ ክፍሎችን ይጨምሩ. |
| \(m+\alpha\) | ወደ አንድ ደረጃ የተደረገባቸው ቀላል ጽሑፍ ቋሚ ይጨምሩ \(c_0\). |
| \(\alpha m\) | ሁለቱም የኮምፒተር ጽሑፍ ክፍሎች በ \(\alpha\). |
| \(mn\) | የሲፊር ጽሑፍ ፖሊኖሚዮችን ይጨምሩ፣ እንደገና ያሰላስሉ፣ ከዚያም ዳግም ያመቻቹ። |

ማባዛት በጣም ውድ የሆነ ሥራ ነው።
የ ciphertexts በተፈጥሮ በሶስት አካላት የሚገኝ የሲፊር ጽሑፍ ይፈጥራል
\(1\), \(s_k\), እና \(s_k^2\). ዳግም ማመቻቸት የታተመ የግምገማ ቁልፍን ይጠቀማል
ለማጠፍ \(s_k^2\) ይህ ቃል ወደ መደበኛ ሁለት-አንድ አካል የኮምፒተር ጽሑፍ ተመልሶ.
ተመሳሳይ የኮምፒተር ጽሑፍ ቅርፅን በመጠቀም በኋላ ላይ ተጨማሪዎችን እና ማባዛት ይይዛል።

BFV በተጨማሪም "ደረጃ" ነው: እያንዳንዱ የተመሰጠረ ክወና አንዳንድ የጩኸት በጀት ይጠቀማል.
ይህ አተገባበር ይህን በጀት ለማዘመን የኮምፒተር ጽሑፎችን አያነሳም።
ከዚህ ይልቅ RAM-LFE አነስተኛ `ram_fhe_profile` የተወሰነውን ብቻ ይቀበላል ፡ ፡
ይህ ደረጃ በደረጃ ስብስብ ውስጥ ግምገማ ይጠብቃል
የአሁኑ የፕሮግራም መገለጫ ቋሚ መዝገብ ያስችላል
መቁጠር፣ ቋሚ ማህደረ ትውስታ-መንገድ መቁጠሪያ፣ እና በከፍተኛ ደረጃ አንድ የኮምፒተር ጽሑፍ-ኮምፒተር ጽሁፍ
በፕሮግራም ደረጃ መጨመር።

በዚህ ውስጥ RAM-LFE ንድፍ፣ BFV የደንበኞችን ግብዓት ከሕዝብ መለያ መረጃዎች ይደብቃል እና
ከትራንስክሽኑ ወይም የመንገድ ጥቅማጥቅሞችን ብቻ የሚመለከቱ ታዛቢዎች
ሰንሰለት በራሱ ሰላማዊ የተመሰጠረ ፕሮግራሞችን ይፈጽማል Torii መፍትሄ ሰጪ
ሩጫ ጊዜ አሁንም የ BFV ሚስጥራዊ ቁሳቁስ, የተዋቀረውን የተደበቀ ይገምታል
ፕሮግራሙ፣ የተፈቀደውን ውፅዓት ይገልጻል፣ እና ውጤቱን ያረጋግጣል።
ከዚያም በሰንሰለት ላይ ያለውን የፖሊሲ ግዴታ በተመለከተ ማረጋገጫውን ያረጋግጣል፤
የህዝብ ቁልፍ ወይም የማረጋገጫ ሜታዳታ መፍትሄ።

የመለያ አጠቃቀም ጉዳይ አንድ ቀላል መግለጫን ሆን ብሎ ይመርጣል.
የተለመደ ገመድ እንደሚከተለው ነው:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

እያንዳንዱ ንጥረ ነገር እንደራሱ የተመሰጠረ ነው BFV ይህ ቅርጽ
መደበኛነት እና ፖስታ ማረጋገጫ ግልፅ, wallets encrypted ለመገንባት ያስችልዎታል
ከሕዝብ መለኪያዎች ጥያቄዎች, እና መፍትሔ ተመጣጣኝ canonicalize ይፈቅዳል
የተመሰጠረ ግብዓት ወደ ቋሚ ደረሰኝ ትራንስክሪፕት።

### BFV ቀለበት ሞዴል {#bfv-ring-model}

የ BFV የጀርባ አገናኞች የኔጋሲክሊክ ፖሊኖሚካል ቀለበት ይጠቀማሉ

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

የፕላይንቴክስት ንጥረ ነገር ቬክተሮች እያንዳንዱን ንጥረ ነገር በመለካት ይኮድላሉ-

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

የዲክሪፕሽን ማዕከል-ሊፍት እያንዳንዱን ጠቋሚ ይጨምራል:

$$
v = c_0 + c_1 s_k \in R_q
$$

ከዚያም ወደ \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

እዚህ . \(s_k\) ነው BFV የሥርዓተ ቁልፍ ፖሊኖሚየም እንጂ ውጫዊው አይደለም RAM-LFE መፍትሄ ሰጪ
ሚስጥር \(s\).

### BFV ቁልፍ ትውልድ {#bfv-key-generation}

ለተመሰጠረ መታወቂያ ማስገቢያ ፣ BFV ቁልፍ ቁሳቁስ ለ
የተፈታኝ ምስጢራዊ እና ተዛማጅ መረጃዎች:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

የ BFV RNG እንደሚከተለው ተዘርቷል:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

ቁልፍ ጀነሬተር ናሙናዎች:

- \(s_k \in \{-1,0,1\}^n\), የተወከለው ሞዱሎ \(q\)
- \(a \leftarrow R_q\) አንድ አይነት
- \(e \in \{-1,0,1\}^n\)

የሕዝብ ቁልፍ:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

ለቀጣይ መስመር አሰጣጥ \(s_k^2\) ውስጥ ቀለበት ምርት መሆን \(R_q\). ለእያንዳንዱ
መሠረት-\(B\) አሃዝ \(j\), ናሙና \(a_j\) በጋራ እና \(e_j\) ከትንሽ
ስርጭት፣ ከዚያም ይፋ ማድረግ:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

የሕዝብ BFV የፖሊሲ ሜታዳታ \((n,q,t,B)\), የህዝብ ቁልፍ ይዟል, እና
`max_input_bytes`. የ BFV ምስጢራዊ ቁልፍ እና ዳግም-መቀናጀት ቁልፍ
የመፍትሔ ጊዜ.

### BFV ምስጠራና ሥራ {#bfv-encryption-and-operations}

አንድ ቀላል ጽሑፍ polynomial ለመሰየም \(m\), አተገባበር ዘር ሌላ
ChaCha20 RNG ከ:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

ይህ ናሙናዎች \(u,e_1,e_2 \in \{-1,0,1\}^n\) እና ማስላት:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

የ ምስጠራ ጽሑፍ \(c=(c ነው_0,c_1)\).

ሆሞሞርፊክ መጨመር በኮምፒዩተር ደረጃ ነው-

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

ቀላል ጽሑፍ ስካላር መጨመር \(\alpha\) ከቁጥር 0 ለውጦች ጋር ብቻ
\(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

በቀላል ጽሑፍ ስካላር ማባዛት \(\alpha\) ሁለቱም አካላት ይለካሉ:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

ለሁለት የቁልፍ ጽሑፍ \(c=(c_0,c_1)\) እና \(d=_0,d_1)\), የቁልፍ ጽሑፍ
ማባዛት በመጀመሪያ የሶስት መጠን ቁልፍ ጽሑፍን ያስቆጥራል እና እያንዳንዳቸውን ይለካል
ከጊዜ ወደ ጊዜ \(t/q\):

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

ከላይ የተጠቀሱት ሁሉም ምርቶች የኒጋሳይክሊክ ቀለበት ምርቶች ናቸው \(R_q\). ከዚያም
\(\tilde c_2\) በመሠረቱ-\(B\) ባለብዙ አሃዶች:

$$
\tilde c_2 = \sum_j B^j u_j
$$

እና እንደገና ተስተካክሏል:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

ውጤቱ ደግሞ ሁለት አካላት ነው BFV የቁልፍ ጽሑፍ።

### መታወቂያ የቁልፍ ጽሑፍ ፖስታ {#identifier-ciphertext-envelope}

የመለየት ማስገቢያ ባይት ገመድ:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

ወደ ስካላር ክፍተቶች ተዘግቷል

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

እና የቀሩት ክፍተቶች ሁሉ እስከ ዜሮ ናቸው `max_input_bytes + 1`. እያንዳንዱ ስካላር
ክፍተቱ በቁጥር-ዜሮ ቀለል ያለ ጽሑፍ ፖሊኖሚል ተብሎ ይመሰጠራል \([m_i]\).
በአንድ ማስገቢያ ላይ የሚገኘው የስርጭት ዘር፡-

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

የተደበዘረው መታወቂያ ፖስታ የሚከተለው ነው

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

የት \(M=\mathrm{max\_input\_bytes}\).

### BFV የኋላ ታሪክ {#bfv-affine-backend}

ለ `bfv-affine-sha3-256-v1`, የአሂድ ጊዜ መጀመሪያ የሚመነጭ ነው BFV ከ
\(s\) እና \(A\). የተገኙት የህዝብ መለኪያዎች ከሕዝቡ ጋር በትክክል ሊዛመዱ ይገባል
በሰንሰለት ላይ የተፈጸሙ መለኪያዎች።

የአፍፊን ወረዳ ዘር:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

ከዚህ ዘር የሩጫ ጊዜ ናሙናዎች, modulo \(t\), የ 32 ረድፍ አፋኝ ወረዳ:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

የት \(m_i\) በሆሞሞርፊክ ሁኔታ, እሱ ያሰላል
ተመሳሳይ ዋጋ በኮምፒተር ጽሑፍ ላይ:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

መፍትሔው እያንዳንዱን ይገልጻል \(C_j\), ሁሉም ቀጣይነት ያለው ግልጽ ጽሑፍ ይጠይቃል
ከዜሮ ጋር የሚዛመዱ ጠቋሚዎች፣ የዜሮውን ጠቋሚ ዋጋ ወደ ባይት ይለውጣሉ፤ እንዲሁም
ቅጾች

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

### BFV የተደራጀ የኋላ ዥረት {#bfv-programmed-backend}

ለ `bfv-programmed-sha3-256-v1`, የሕዝብ መለኪያዎች BFV መታወቂያ
ምስጠራ መለኪያዎች እና የተደበቁ ፕሮግራሞች:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

የአሁኑ RAM-FHE መገለጫ:

| መስክ | ዋጋ |
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

ለቀረበው ቀላል ጽሑፍ ግብዓት Torii ተመሳሳይ ውስጥ የተመሰጠረ ነው BFV ፖስታ
ለዚያ የአገልጋይ-ጎን ምስጠራ የተወሰነው ዘር፡

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

ውጫዊ በሆነ መንገድ ለተቀላጠፈ ግብዓት ፣ መፍትሄ ሰጪው መታወቂያውን ይገልጻል
ከማስፈፀም በፊት በዲተሪሚኒስት ኤንቨሎፕ ላይ እንደገና ይደብቃል.
ይህ ካኖኒካላይዜሽን በሴማንቲክ እኩል በኩል ደረሰኝ ሃሽስ የተረጋጋ ይይዛል
BFV የቁልፍ ጽሑፎች።

የመጀመሪያዎቹ የተመሰጠረ የማስታወሻ መስመሮች ከሚከተሉት የተገኙ ናቸው

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

ለእያንዳንዱ 32 መስመሮች, የሩጫ ጊዜ ናሙናዎች \(r_j \in [0,t)\) እና አከማችቷል BFV
የሲፊር ጽሑፍ ምስጠራ \(r_j\). ከዚያም የተደበቀ ፕሮግራም በ ላይ ይሰራል
መዝገቦች እና የተመሰጠረ ማህደረ ትውስታ

| መመሪያ | አልጀብራ |
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\) |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\), ከዚያም እንደገና አሰላለፍ |
| `SelectEqZero(dst, cond, z, nz)` | ዲክሪፕት \(R_{\mathrm{cond}}\); ይምረጡ \(R_z\) ዜሮ ከሆነ፣ አለበለዚያ \(R_{nz}\). |
| `Output(src)` | ማከል \(R_{\mathrm{src}}\) ወደ ውፅዓት መዝገብ ዝርዝር። |

የመመሪያ ቴፕ ከተጠናቀቀ በኋላ፣ መፍትሄ ሰጪው እያንዳንዱን ውፅዓት ይገልጻል
በመመዝገብ፣ 0 ን ወደ ባይት መለወጥ እና እነዚያን ባይቶች መቀላቀል:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

የጀነሪክ ፕሮግራም የጀርባ አገናኞች የሚከተሉት ናቸው:

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

ነባሪ ፕሮግራም መታወቂያ ቴፕ 64 ማስገቢያ ክፍሎች አሉት. ለእያንዳንዱ ክፍተት
\(i\), የመግቢያ ክፍተቱን ይጫናል፣ የማስታወሻ መስመሩን ይጫናል። \(i \bmod 32\), ይጨምራል፣
እና ውጤቱን ያወጣል

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### የውጤት ሃሽ እና ደረሰኞች {#output-hashes-and-receipts}

አጠቃላይ መድሃኒት RAM-LFE የማስፈጸሚያ ደረሰኝ ጥሬ ውፅዓት አይፈርም.
የውጤት ሃሽ:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

ለ Torii RAM-LFE አፈጻጸም ደረሰኞች, የተዛመዱ መረጃዎች ነው
የፕሮግራም መታወቂያ ባይት:

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

ማረጋገጫ ፊርማውን ይፈትሻል `resolver_public_key` እና ውድቅ ያደርጋል
እነዚህ ሁሉ እኩልነቶች ካልተያዙ በስተቀር ደረሰኝ:

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

ደራሲው የሚያቀርብ ከሆነ `output_hex`, ማረጋገጫ ሰጪው ደግሞ የሚከተሉትን ያረጋግጣል፦

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

ለ `proof` አሰራር, ማረጋገጫ አንድ ማስረጃ envelope ይዟል ይልቅ
የምስክርነት ማረጋገጫ የዳሰሳ ጥናት፣ የወረዳ መታወቂያ፣
የህዝብ ማስገቢያ መርሃግብር ሃሽ፣ የማረጋገጫ ቁልፍ ሃሽ እና የተጋለጡ የሕዝብ ምሳሌዎች
የማረጋገጫ ማረጋገጫ ሜታዳታ እና የተመሰጠረ ደረሰኝ-ክፍያ ጭነት ሃሽ ጋር ይጣጣማሉ።

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

የሚጠበቁ የሕዝብ ጉዳዮች አራት የአንድ አካል አምዶች ናቸው። \(j\)
ባይት ይዟል \(h_{8j}\ldots h_{8j+7}\) ቀጥሎ 24 ዜሮ ባይት:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### የመለየት መለኪያ {#identifier-projection}

የማጣሪያ ጥራት የጀነሪክ ዳግም ማቋረጥን አይጠቀምም `opaque_hash` እንደ
የተጠቃሚውን የሚመለከት ግልጽ ያልሆነ የመለያ መታወቂያ። RAM-LFE የውጤት ሃሽ
ለታወቂያ የተወሰኑ ጎራዎች:

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

አንድ `IdentifierResolutionReceipt` ከፍ ያለ የኃይል ጭነት ይፈርዳል:

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

`ClaimIdentifier` የምስክር ወረቀቱን የሚቀበል ፊርማው ወይም ማስረጃው
ተፈጻሚነት ያለው፣ የተካተተው RAM-LFE የማስፈፀም ጥቅማጥቅሞች ከተጠቀሰው ፕሮግራም ጋር ይጣጣማሉ
ፖሊሲ እና `uaid` እና `account_id` የሚጠየቀው ግዴታ ነው።

## የፍጻሜ ፍሰት {#execution-flow}

አጠቃላይ መድሃኒት RAM-LFE አፈፃፀም የሚከተለውን መልክ ይከተላል:

1. አስተዳደር ወይም ኦፕሬተር መዝገብ `RamLfeProgramPolicy`.
2. ባለቤቱ ፖሊሲውን ያበራል።
3. ደንበኛው የህዝብ ፖሊሲ ሜታዳታዎችን ያነባል Torii.
4. ደንበኛው በትክክል አንድ ማስገቢያ ቅጽ ወደ መፍትሔ ያቀርባል: ቀላል ጽሑፍ
   `input_hex` ወይም የተመሰጠረ BFV የመግቢያ ፖስታ።
5. የ ሩጫ ጊዜ የተደበቀ ፕሮግራም ይገመግማል እና ይመለሳል `output_hex`,
   `output_hash`, `opaque_hash`, `receipt_hash`, እና ሀ
   `RamLfeExecutionReceipt`.
6. ደንበኛው ወይም የጀርባው ወገን ደረሰኙን ከታተመው ፖሊሲ ጋር ያረጋግጣል ፣
   ተመላሽ ማረጋገጫ `output_hex` ለክፍያ የሚሆን ሃሽ
   `output_hash`.
7. ከፍተኛ ደረጃ ትምህርት፣ ለምሳሌ `ClaimIdentifier`, ማካተት ይችላሉ
   ጥሬውን ማስገቢያ ከማካተት ይልቅ የተረጋገጠ ደረሰኝ።

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

የመለየት ፖሊሲዎች RAM-LFE. ሥራ ይጨምራሉ
የስም ቦታ እና መደበኛነት ደንብ ከአጠቃላይ የፕሮግራም ፖሊሲ በላይ:

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

የማጣሪያው ንብርብሮች RAM-LFE ደረሰኝ:

- `policy_id`
- በተደበቀ ተግባር የተገኘው ግልጽ ያልሆነ መታወቂያ
- የመወሰን `receipt_hash`
- ሂሳቡ UAID
- የካኖኒክ `account_id`
- አጠቃላይ መድሃኒት RAM-LFE የማስፈፀም ጥቅማጥቅሞች

ለተጠቃሚዎች የሚተኮረ የደንበኝነት ምዝገባ፣ የመለያ ስያሜዎችን ከግል
አድራሻዎች የህዝብ ስሞች፣ የስልክ ቁጥሮች፣ የኢሜይል አድራሻ እና
ተመሳሳይ እሴቶች በመለየት ፖሊሲዎች እና ደረሰኞች ውስጥ መጎተት አለባቸው።

## Torii መንገዶች {#torii-routes}

የመተግበሪያ-ተኮር የጉዞ ቤተሰብ ሲነቃ፣ Torii የተጋለጡ RAM-LFE እና
የመለየት ረዳቶች

| መንገድ | ዓላማ |
| --- | --- |
| `GET /v1/ram-lfe/program-policies` | የተንቀሳቃሽና ያልተንቀሳቃሽ ዝርዝር RAM-LFE የፕሮግራም ፖሊሲዎች እና የህዝብ አፈፃፀም ሜታዳታ። |
| `POST /v1/ram-lfe/programs/{program_id}/execute` | ከ አንድ ፕሮግራም አሂድ `input_hex` ወይም `encrypted_input` እና የውጤት ሃሽዎችን መልሶ ማቅረብ እንዲሁም ያለመንግሥት ደረሰኝ። |
| `POST /v1/ram-lfe/receipts/verify` | አረጋግጡ `RamLfeExecutionReceipt` የታተመውን ፖሊሲ በመቃወም እና በአማራጭነት በማወዳደር `output_hex` ወደ `output_hash`. |
| `GET /v1/identifier-policies` | የመለየት ፖሊሲዎችን ፣ መደበኛነት ሁነቶችን ፣ የተፈታች ቁልፎችን እና የተመሰጠረ የመግቢያ ሜታዳታዎችን ይዘርዝሩ። |
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` | አንድ ተጠቃሚ ሊያስገባው የሚችለውን ደረሰኝ ያቅርቡ `ClaimIdentifier`. |
| `POST /v1/identifiers/resolve` | አንድ ንቁ የይገባኛል ጥያቄ በሚኖርበት ጊዜ ወደ ተያያዥነት ያለው ሂሳብ የተለመደ መታወቂያ ግብዓት መፍታት። |
| `GET /v1/identifiers/receipts/{receipt_hash}` | ለኦዲት እና ድጋፍ መሳሪያዎች ደረሰኝ ሃሽ በመጠቀም ቀጣይነት ያለው መታወቂያ ጥያቄን ይፈልጉ። |

ሁልጊዜ የዒላማውን አንጓ ይመልከቱ `/openapi` ወይም `/openapi.json` ሰነድ በፊት
እነዚህ መንገዶች ላይ በመገንባት ላይ.
የአውታረ መረብ መገለጫ።

## የአውታረ መረብ አሂድ ጊዜ {#node-runtime}

Torii በሂደት ላይ ነው RAM-LFE የስራ ሰዓት በ
`torii.ram_lfe.programs[*]`, በቁልፍ የተቀመጠ `program_id`. እያንዳንዱ የተዋቀረ ፕሮግራም
በሰንሰለት ፖሊሲ ላይ የተሰጠውን ግዴታ ማሟላት አለበት እና የአሠራር ጊዜን ማቅረብ አለበት
የምስክር ወረቀቶችን ለመገምገም እና ለማረጋገጥ የሚያስፈልጉ ቁሳቁሶች
ተመሳሳይ የስራ ሰዓት; የተለየ መታወቂያ-መፍትሄ ሰጪ ውቅር አያስፈልጋቸውም
የላይኛው ገጽ።

የፖሊሲ ሰንሰለት በራሱ መመዝገብ በቂ አይደለም.
እንዲሁም የመንገድ ቤተሰብን ያጋለጡ እና ለ
የሚፈጽሙት ፕሮግራሞች።

## የአሠራር ጠባቂዎች {#operational-guardrails}

- ፖሊሲዎቹን በማስመዝገብ፣ የሕዝብ ሜታዳታዎችን በማረጋገጥ፣ ከዚያም በማግበር ላይ።
- የግምገማ ሚስጥሮች የተደበቁ, መፍትሔ ፊርማ ቁልፎች, እና BFV ሚስጥር
  ሰነዶች፣ መዝገቦች፣ ግብይቶች እና የደንበኞች ጥቅሎች የተገኙት።
- በሂሳብ ስያሜዎች፣ የግብይት ሜታዳታ ውስጥ ጥሬ ማንነት አያካትቱ፤
  ክስተቶች ወይም የዓለም-መንግስት መስኮች.
- የከፍተኛ ደረጃ መመሪያዎችን ከማቅረባቸው በፊት ደረሰኞችን ከደንበኛ ወገን ያረጋግጡ
  መቼ ነው SDK ማረጋገጫ ሰጪውን ያጋልጣል።
- የቆዩ ደረሰኞች ለዘለቄታው ሊቆዩ የማይችሉባቸው ጊዜያቸውን የሚያጠናቅቁ መስኮቶችን ይጠቀሙ።
- አዲስ ፕሮግራም ወይም መታወቂያ ፖሊሲ በመመዝገብ፣ በማዛወር ደንበኞችን በማስተላለፍ፣
  እና አሮጌውን ፖሊሲ ማሰናከል አዲስ ደረሰኞች ሲፈስሱ.

## ተዛማጅ ርዕሰ ጉዳዮች {#related-topics}

- [ለግል የመረጃ አከባቢ የስፖንሰር ክፍያዎች](/am/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md#app-and-sora-route-families)
- [የማይታወቁ ግብይቶች](/am/blockchain/anonymous-transactions.md)
