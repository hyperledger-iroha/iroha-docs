---
translation_locale: am
translation_source: /blockchain/fastpq.md
translation_source_hash: d8dd61390f5df3dae09b70399e04e8f71716a912ef5dea9010feaf60573ed261
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# FastPQ {#fastpq}

FastPQ ለተመረጡት የማስፈጸሚያ ውጤቶች የ Iroha STARK ማረጋገጫ መንገድ ነው። መደበኛውን የግብይት አፈፃፀም ወይም መግባባትን አይተካም። ግብይቶች አሁንም እንደተለመደው በ ISI፣ IVM እና Sumeragi ውስጥ መሮጥ; FastPQ ዲተርሚኒስቲክ የማስፈጸሚያ ምስክርን ይጠቀማል እና የሚደገፉ ውጤቶችን ወደ ማስረጃ ስብስቦች ይለውጠዋል።

የአሁኑ የአስተናጋጅ ውህደት ሶስት ዋና መንገዶች አሉት -

- በብሎክ አፈፃፀም ወቅት የተመዘገቡ ግልጽ የቁጥር ንብረት ዝውውሮች
- Nexus የተረጋገጠ የማስፈጸሚያ መስመር ማስተላለፊያዎች AXT የማረጋገጫ የውሂብ ኮንቴይነር FastPQ አስገዳጅ
- SCCP FastPQ ማረጋገጫን በክፍት ማረጋገጫ የውሂብ መያዣ ውስጥ የሚጠቀለሉ ግልጽ የመልእክት ማረጋገጫ ረዳቶች

## የዝውውር ምስክር መንገድ {#transfer-witness-path}

መመሪያው ቀሪ ሒሳቦችን ሲቀይር፣ ግልጽ የቁጥር ዝውውሮች የተዋቀረ የዝውውር መዝገብ ይፈጥራሉ። መዝገቡ የሚከተሉትን ይመዘግባል፦

- የምንጭ መለያ፣ የመድረሻ መለያ፣ የንብረት ፍቺ እና መጠን
- ከዝውውሩ በፊት እና በኋላ የላኪ እና ተቀባይ ቀሪ ሂሳቦች
- የግብይት መግቢያ ነጥብ ምስጠራ ሃሽ እንደ ባች ክሪፕቶግራፊክ ሃሽ ጥቅም ላይ ይውላል
- UNE ፈቃድ ከማስረከቢያ መለያ የተገኘ ዋና ምስጠራ ዳይጀስት እሴት
- ለነጠላ-ዴልታ ግልባጮች የፖሲዶን ምስጠራ ዳይጄስት እሴት

የባች ዝውውሮች ከበርካታ ዴልታዎች ጋር አንድ ግልባጭ ይጠቀማሉ። እንደዚያ ከሆነ፣ ነጠላ-ዴልታ ፖሲዶን ክሪፕቶግራፊያዊ ዳይጀስት የለም።

በብሎክ ማጠናቀቂያ ላይ፣ Iroha እነዚህን ግልባጮች በመግቢያ ነጥብ ምስጠራ ሃሽ ይመድባል። የማስፈጸሚያ ምስክሩ ሁለቱንም የመጀመሪያውን የግልባጭ ጥቅሎች እና ለአረጋጋሪው የተዘጋጁትን FastPQ የሽግግር ስብስቦችን ይይዛል።

እያንዳንዱ የማስተላለፊያ ዴልታ ሁለት የሽግግር ረድፎች ይሆናል -

|ረድፍ|ቁልፍ ቅርጽ|ቅድመ-ዋጋ|ድህረ-እሴት|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|ላኪ ዴቢት|`asset/<asset-definition>/<source-account>`|የላኪ ቀሪ ሂሳብ በፊት|የላኪ ቀሪ ሂሳብ በኋላ|
|ተቀባይ ክሬዲት|`asset/<asset-definition>/<destination-account>`|ተቀባይ ቀሪ ሂሳብ በፊት|ተቀባይ ቀሪ ሂሳብ በኋላ|

የቁጥር እሴቶች ወደ ኢንቲጀር ምስክርነት አሃዶች መደበኛ ናቸው። በተመረጠው የአስርዮሽ ሚዛን እንደ አሉታዊ ያልሆነ `u64` ሊወከል የማይችል ከሆነ እሴት ለ FastPQ ባች ውድቅ ይደረጋል።

## የህዝብ ግብዓቶች {#public-inputs}

እያንዳንዱ FastPQ የሽግግር ስብስብ ማረጋገጫውን ከብሎኩ እና ከማስፈጸሚያ አውድ ጋር የሚያገናኙ የህዝብ ግብዓቶችን ይይዛል -

|ግቤት|ትርጉም|
| ------------- | --------------------------------------------------------------- |
|`dsid`|የውሂብ ቦታ መለያ እንደ ትንሽ-ኢንዲያን ባይት ኮድ ተደርጓል|
|`slot`|የብሎክ የመፍጠሪያ ጊዜ ወደ ናኖሰከንዶች ተቀይሯል|
|`old_root`|የወላጅ ሁኔታ ሥር ከአፈጻጸም ምስክርነት የተገኘ|
|`new_root`|የድህረ-ሁኔታ ሥር የተገኘ ከአፈጻጸሙ ምስክርነት|
|`perm_root`|በንቃት ሚና ፈቃዶች ላይ የPoseidon ክሪፕቶግራፊያዊ ኮሚትመንት ዋጋ|
|`tx_set_hash`|በተደረደሩ ግብይቶች እና በጊዜ-ቀስቅሴ የመግቢያ ነጥብ ምስጠራ ሃሽ ላይ ምስጠራ ሃሽ|

አስተናጋጁ `fastpq-lane-balanced`ን ለእነዚህ ስብስቦች እንደ ነጠላ ፕሮቶኮል-መደበኛ መለኪያ ይጠቀማል።

## የሂሳብ ሞዴል {#mathematical-model}

ይህ ክፍል አሁን ባለው Rust አረጋጋጭ እና አረጋጋጭ የተተገበረውን ሒሳብ ይገልጻል። ከታች ያሉት ሁሉም የመስክ ስራዎች በጎልድሎክስ ዋና መስክ ላይ ናቸው -

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ ለመስክ ክሪፕቶግራፊያዊ ኮሚትመንቶች Poseidon2 ከ `F` በላይ ይጠቀማል።. ስፖንጁ ስፋት `t = 3`፣ ተመን `r = 2` እና አቅም `1` አለው። ክሪፕቶግራፊክ ሃሽ የመስክ ክፍሎችን በፍጥነት-2 ብሎኮች ይይዛል እና ከመጨረሻው ፐርሙቴሽን በፊት አንድ ነጠላ የመስክ አካል `1` ያያይዛል።

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

የባይት ሕብረቁምፊዎች በ 7-ባይት ትንሽ-ኢንዲያን እግሮች ውስጥ ተጭነዋል ስለዚህ እያንዳንዱ እጅና እግር በጥብቅ ከ `p` በታች ነው -

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

በጎራ የተለዩ የመስክ ምስጠራ ሃሽዎች እንደሚከተለው ይወከላሉ -

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

ከባይት-ጎራ ክሪፕቶግራፊክ ዳይጀስት ለሚጀምሩ ምስጠራ ሃሽዎች፣ FastPQ የመጀመሪያዎቹን ስምንት ትንሽ-ኢንዲያን ባይት ወደ መስክ ካርታ ያደርጋል።

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

እዚህ `Hash` ማለት Iroha `iroha_crypto::Hash::new`፣ ባለ 32-ባይት Blake2bVar ክሪፕቶግራፊያዊ ዳይጀስት፣ ቀመር Poseidon2 ወይም SHA-256 በግልፅ ካልተሰየመ በስተቀር።

### የመስክ ቆጠራ {#field-arithmetic}

የ Rust ኮድ የመስክ ክፍሎችን እንደ ነጠላ ፕሮቶኮል-መደበኛ `u64` እሴቶችን ይወክላል በ `[0,p)`. መደመር እና መቀነስ የሚከተሉት ናቸው

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

ማባዛት በመጀመሪያ ባለ 128-ቢት ምርትን ያሰላል -

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Goldilocks ቅነሳ ማንነቱን ይጠቀማል -

$$
2^{64}\equiv2^{32}-1\pmod p
$$

ከሆነ

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

ከዚያ መቀነሻው ያሰላል -

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

ውጤቱ ነጠላ ፕሮቶኮል-ስታንዳርድ እስኪሆን ድረስ አተገባበሩ በሁኔታዊ ሁኔታ ይጨምራል ወይም ይቀንሳል `p`። እንደ ቀሪ ሒሳብ ዴልታዎች ያሉ የተፈረሙ ኢንቲጀሮች በሚከተሉት ተካትተዋል -

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 መለዋወጥ {#poseidon2-permutation}

የ Poseidon2 permutation ሁኔታ የሚከተለው ነው

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

የእሱ ኤስ-ሳጥን የሚከተለው ነው

$$
S(x)=x^5
$$

FastPQ አራት ሙሉ ዙሮች፣ ሃምሳ ሰባት ከፊል ዙሮች፣ ከዚያም አራት ተጨማሪ ሙሉ ዙሮችን ይጠቀማል። ሙሉ ዙር ከክብ ቋሚዎች ጋር `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` የሚከተለው ነው -

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

ከፊል ዙር የሚከተለው ነው

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

ሁሉም ተጨማሪዎች እና ማባዛቶች በ `F` ውስጥ ይገኛሉ። ነጠላ ፕሮቶኮል-መደበኛ MDS ማትሪክስ የሚከተለው ነው -

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

የመስክ ምስጠራ ሃሽ የሚጀምረው ከዜሮ ሁኔታ ነው። ለእያንዳንዱ የተሟላ ተመን-2 ብሎክ `(u,v)` -

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

የመጨረሻው ብሎክ ከመጨረሻው መለዋወጥ በፊት የ `1` ንጣፍ ኤለመንትን ያያይዛል። ውጤቱ `x_0` ነው።

### የህዝብ ግቤት ማሰሪያ {#public-input-binding}

አስተናጋጁ የ `u64` እሴቱን በ16-ባይት መስክ የመጀመሪያዎቹ ስምንት ትንሽ-ኢንዲያን ባይት በመጻፍ የውሂብ ቦታ መታወቂያን ኮድ ያደርጋል።

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

የብሎክ መፍጠር ጊዜ ሚሊሰከንዶች ወደ ናኖሰከንዶች ይቀየራል

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

በግብይቱ የተቀመጠው ምስጠራ ሃሽ በተደረደሩት የመግቢያ ነጥብ ምስጠራ ሃሽዎች ላይ የባይት-ጎራ ምስጠራ ሃሽ ነው።

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

`h_i` የተደረደሩበት ግብይት እና ጊዜ-ቀስቅሴ የመግቢያ ነጥብ ምስጠራ ሃሽዎች። በማስረጃው ይፋዊ IO ውስጥ፣ `perm_root` ወይም `tx_set_hash` ሁሉም ዜሮ ከሆነ፣ አረጋጋጩ ተተኪ እሴቶችን ይሞላል -

$$
\operatorname{perm\_root} =
\begin{cases}
0^{32},& \text{if there are no permission hashes}\\
\operatorname{Hash}(\texttt{fastpq:v1:perm\_root}\|p_0\|\cdots\|p_{n-1}),
& \text{otherwise}
\end{cases}
$$

$$
\operatorname{tx\_set\_hash}_{fallback} =
\operatorname{Hash}(\texttt{fastpq:v1:tx\_set}\|\operatorname{ordering\_hash})
$$

### የቁጥር መደበኛነት {#numeric-normalization}

ለእያንዳንዱ የዝውውር ዴልታ፣ የታለመው የአስርዮሽ ልኬት በመጠኑ ላይ ከፍተኛው የተከረከመ ቀሪ ሒሳብ እና ሁለቱም የቀሪ ሒሳብ ነጥብ-በ-ጊዜ ውሂብ እይታዎች ነው።

$$
s =
\max(
\operatorname{scale}(a),
\operatorname{scale}(f_0),
\operatorname{scale}(f_1),
\operatorname{scale}(t_0),
\operatorname{scale}(t_1)
)
$$

የ `Numeric` እሴት ከማንቲሳ `m` እና ሚዛን `q` ጋር ተቀባይነት ያለው `m >= 0` እና `q <= s` ሲሆን ብቻ ነው። የእሱ FastPQ የምስክርነት ዋጋ -

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

የተለመደው ውጤት በ `u64` ውስጥ መያያዝ አለበት።

### ነጠላ ፕሮቶኮል-መደበኛ ማዘዝ {#canonical-ordering}

ከዱካ ግንባታው በፊት፣ ቡድኑ በሽግግር ቁልፍ፣ በኦፕሬሽን ደረጃ እና በኦሪጅናል የማስገቢያ መረጃ ጠቋሚ ይደረደራል።

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

የማዘዣው የክሪፕቶግራፊያዊ ኮሚትመንት ዋጋ በጎራ `fastpq:v1:ordering` ላይ የPoseidon2 መስክ ምስጠራ ሃሽ እና የተደረደሩ ሽግግሮች Norito ኢንኮዲንግ ነው።

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

`P` 7-ባይት ማሸጊያ፣ `E` Norito ኢንኮዲንግ፣ `D_o` `fastpq:v1:ordering` እና `T*` የተደረደረ የሽግግር ዝርዝር ነው።

### እኩልታዎችን ያስተላልፉ {#transfer-equations}

ለዝውውር መጠን `a`፣ የላኪ ቀሪ ሂሳብ `f`፣ እና የተቀባዩ ቀሪ ሂሳብ `t`፣ FastPQ ዱካውን ከመገንባቱ በፊት የተለመዱትን የምስክርነት እሴቶችን ያረጋግጣል -

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

የሽግግሩ ረድፎች ከዚያ ኮድ ያደርጋሉ -

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

በዱካው ውስጥ፣ የተፈረሙ ዴልታዎች ወደ `F` ይቀንሳሉ -

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

የአማራጭ ነጠላ-ዴልታ ማስተላለፊያ ምስጠራ ዳይጀስት እሴት የተመሰጠረውን የዝውውር ቅድመ ምስል ያጠናቅቃል -

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

ለብዙ-ዴልታ ማስተላለፊያ ግልባጮች፣ አሁን ያለው ቅርጸት ይህ ከፍተኛ-ደረጃ ክሪፕቶግራፊያዊ ዳይጀስት እንዳይኖር ይፈልጋል።

የአስተናጋጁ ፍቃድ ዋና ክሪፕቶግራፊያዊ ዳይጀስት ለዝውውር ግልባጮች የሚከተለው ነው -

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### ረድፎችን ይከታተሉ {#trace-rows}

የተደረደረው የሽግግር ዝርዝር `n` እውነተኛ ረድፎችን ይይዛል። የመከታተያ ርዝመት የሁለት ቀጣዩ ኃይል ነው -

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

ረድፎች `0..n-1` ንቁ ናቸው; ረድፎች `n..N-1` የታሸጉ ረድፎች ናቸው። እያንዳንዱ እውነተኛ ረድፍ አንድ የክወና መራጭ ስብስብ አለው

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

ሁሉም የመምረጫ አምዶች ቡሊያን ናቸው

$$
s(s-1)=0
$$

የፍቃድ ፍለጋ ረድፎች በትክክል ሚና ስጦታ እና ሚና የሚሻሩ ረድፎች ናቸው -

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

ለቁጥር ክወና ረድፎች -

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

ግንበኛው በንብረት ዴልታዎች መሮጥን ይከታተላል -

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

ረድፎችን ብቻ ያውጡ እና ያጥፉ የአቅርቦት ቆጣሪውን ያዘምኑ -

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

ሜታዳታ እና የውሂብ ቦታ መከታተያ አምዶች ከረድፍ ቁሳቁስ በፊት የተገኙ የመስክ ምስጠራ ሃሽዎች ናቸው።

$$
\operatorname{metadata\_hash} =
\begin{cases}
0,& \text{if metadata is empty}\\
H_D(E(\text{metadata})),& \text{otherwise}
\end{cases}
$$

$$
\operatorname{dsid\_trace}=H_D(\operatorname{public\_input\_dsid})
$$

የሜታዳታ ምስጠራ ሃሽ፣ ዳታ ስፔስ ምስጠራ ሃሽ እና ማስገቢያ በአጎራባች የመከታተያ ረድፎች ላይ የተረጋጉ ናቸው።

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### የሜርክል አምዶችን ያስተላልፉ {#transfer-merkle-columns}

የዝውውር ረድፎች ባለ 32-ደረጃ ትንሽ የመርክል መንገድ ይይዛሉ። የአስተናጋጅ ማረጋገጫ ከጠፋ፣ አረጋጋጩ ከረድፍ ቁልፍ፣ ቅድመ-ቀሪ ሒሳብ እና ረድፉ በላኪው ወይም በተቀባዩ በኩል መሆኑን የሚወስን መንገድ ያዋህዳል።

ለተዋሃዱ መንገዶች፣ ጣዕሙ ጨው `fastpq:smt:from` ለላኪ ረድፎች እና `fastpq:smt:to` ለተቀባይ ረድፎች ነው።

$$
K =
\operatorname{Hash}(\texttt{fastpq:smt:key|}\|\operatorname{salt}\|\operatorname{key})
$$

$$
V =
\operatorname{Hash}(\texttt{fastpq:smt:value|}\|\operatorname{salt}\|\operatorname{le64}(\operatorname{balance}))
$$

$$
b_\ell = \operatorname{bit}_\ell(K)
$$

$$
s_\ell =
\operatorname{Hash}(
\texttt{fastpq:smt:sibling|}\|
\operatorname{le64}(\ell)\|K\|\operatorname{le64}(\operatorname{balance})\|\operatorname{salt}
)
$$

ሰው ሰራሽ ቅጠል እና ውስጣዊ አንጓዎች የሚከተሉት ናቸው

$$
L = \operatorname{Hash}(
\texttt{fastpq:smt:leaf|}\|
K\|V
)
$$

$$
N_{\ell+1} =
\operatorname{Hash}(
\texttt{fastpq:smt:node|}\|
\operatorname{left}_\ell\|
\operatorname{right}_\ell
)
$$

ዱካው ቢት `b_l`፣ ወንድም ወይም እህት `s_l`፣ የግቤት ኖድ `x_l` እና የውጤት ኖድ `x_{l+1}` በየደረጃው ይመዘግባል። ከኮዱ ቅርንጫፍ ኮንቬንሽን ጋር -

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### ፍቃድ ምስጠራ hashes {#permission-hashes}

ሚና ስጦታ እና ረድፎችን ምስጠራ ይሰርዙ የፍቃድ ምስክርነት -

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

የአስተናጋጁ ፍቃድ ሠንጠረዥ ስርወ ግቤቶችን በሚና ባይት፣ በፍቃድ ባይት እና በዘመን ባይት ይለያል፣ ከዚያ የPoseidon2 Merkle ዛፍ ይገነባል -

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

ያልተለመዱ ስፋት ደረጃዎች የመጨረሻውን አካል ያባዛሉ።

### ክሪፕቶግራፊያዊ ኮሚትመንትን ይከታተሉ {#trace-commitment}

ለእያንዳንዱ የመከታተያ አምድ `c`፣ FastPQ በመጀመሪያ የአምድ እሴቶችን በመከታተያ ጎራ ላይ ጣልቃ ገብቶ የኮፊሸን ቬክተር ምስጠራ ሃሽ ያሰላል።

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

የመከታተያ ሥሩ በአምድ ክሪፕቶግራፊያዊ ኮሚትመንቶች ላይ የPoseidon2 Merkle ሥር ነው -

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

የመጨረሻው የመከታተያ ክሪፕቶግራፊያዊ ኮሚትመንት በጎራው፣ በመለኪያ ስብስብ፣ በመከታተያ ቅርፅ፣ በአምድ ምስጠራ ዳይጄስት እና በመከታተያ ሥር ላይ የባይት ምስጠራ ሃሽ ነው።

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

የት `D_c` ነው `fastpq:v1:trace_commitment`.

### AIR ጥንቅር {#air-composition}

የ V1 AIR ቅንብር እሴት የረድፍ-አካባቢያዊ ቅሪቶች መስመራዊ ጥምረት ነው። ግልባጩ ሁለት ፈተናዎችን ያቀርባል -

$$
\alpha_0,\alpha_1 \in F
$$

ለእያንዳንዱ አጎራባች ረድፍ ጥንድ `(i,i+1)`፣ አረጋጋጩ ያሰላል -

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

ቀሪዎቹ `rho` በኮድ ቅደም ተከተል ናቸው -

$$
\rho=s(s-1)
\quad\text{for each selector column}
$$

$$
\rho =
s_{\text{active}} -
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}}+
s_{\text{role\_grant}}+s_{\text{role\_revoke}}+s_{\text{meta\_set}})
$$

$$
\rho =
s_{\text{perm}}-(s_{\text{role\_grant}}+s_{\text{role\_revoke}})
$$

$$
\rho =
s_{\text{active},i+1}(1-s_{\text{active},i})
$$

ለ ረድፎች ከ ቁጥር አምዶች ጋር

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

እና ለተረጋጋ ባች አውድ አምዶች -

$$
\rho =
\operatorname{metadata\_hash}_i-\operatorname{metadata\_hash}_{i+1}
$$

$$
\rho =
\operatorname{dsid}_i-\operatorname{dsid}_{i+1}
$$

$$
\rho =
\operatorname{slot}_i-\operatorname{slot}_{i+1}
$$

አረጋጋጩ ለናሙና የረድፍ ክፍተቶች `A_i`ን እንደገና ያሰላል እና በ AIR ጥንቅር ሜርክል ሥር ስር ምስጠራ ካለው የቅንብር እሴት ጋር ይፈትሻል።

### ምርት ፍለጋ {#lookup-product}

የፍቃድ ፍለጋ ማጠራቀሚያው የ Fiat-Shamir ፈተናን `gamma` ይጠቀማል። በ`s_perm` እና `perm_hash` ዝቅተኛ ዲግሪ የኤክስቴንሽን ግምገማዎች ላይ፣ የሩጫ ምርቱ የሚከተለው ነው -

$$
z_0=1
$$

$$
z_{i+1}=
\begin{cases}
z_i\cdot(w_i+\gamma),& s_{\text{perm},i}\ne0\\
z_i,& s_{\text{perm},i}=0
\end{cases}
$$

የማስረጃው መዝገቦች -

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### ዝቅተኛ-ዲግሪ ማራዘሚያ {#low-degree-extension}

`omega_T` የመከታተያ ጎራ አመንጪ፣ `omega_E` የግምገማ ጎራ አመንጪ እና `g` የተዋቀረው የኮሴት ማካካሻ ይሁን። `v_i` እሴቶች ላሉት የመከታተያ አምድ፣ ኢንተርፖሌሽኑ የሚከተለውን የሚያሟሉ `a_j` ቅንጅቶችን ያመነጫል፦

$$
f(\omega_T^i)=v_i
$$

ዝቅተኛ-ዲግሪ ቅጥያ በኮሴት ላይ ተመሳሳይ ፖሊኖሚል ይገመግማል -

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

አተገባበሩ ይህንን ያሰላል ቅንጅቶችን ከ FFT በፊት በኮሴት ማካካሻ ሃይሎች በማባዛት -

$$
a'_j = a_j g^j
$$

እና ከዚያ በግምገማው ጎራ ላይ `a'` መገምገም ።

የ CPU FFT በቢት-የተገላቢጦሽ ግብዓቶች ላይ ተደጋጋሚ ራዲክስ-2 ኩሊ-ቱኪ ለውጥ ነው። በደረጃ ርዝመት `L`፣ ግማሽ ርዝመት `H=L/2` እና የመድረክ ሥር

$$
\omega_L=\omega^{N/L}
$$

እያንዳንዱ ቢራቢሮ ያሰላል-

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

የተገላቢጦሽ FFT ከ `omega^{-1}` ጋር ተመሳሳይ ለውጥን ያካሂዳል እና በተገላቢጦሽ የጎራ መጠን ሚዛን ያካሂዳል።

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

ከመጠቀምዎ በፊት የካታሎግ ሥሮች ይረጋገጣሉ -

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

ከካታሎግ ሥር ለሚመነጩ ትናንሽ ጎራዎች ጄነሬተሩ የሚከተለው ነው -

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### ረድፍ እና ቅጠል ምስጠራ hashes {#row-and-leaf-hashes}

ከ LDE በኋላ፣ FastPQ እያንዳንዱን ረድፍ በሁሉም LDE አምዶች ላይ ምስጠራ ያደርጋል። ለ`m` አምዶች -

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

የረድፍ ምስጠራ ሃሽዎች አሁንም ከግምገማ ጎራ ይልቅ በመከታተያ ጎራ ላይ ከሆኑ፣ አጣራቂው ያንን ነጠላ ረድፍ-ሃሽ አምድ በተመሳሳይ ኮሴት LDE ሂደት ጣልቃ ገብቶ ያራዝመዋል።

### የመርክል ክፍት ቦታዎች {#merkle-openings}

LDE እሴቶች በሚከተሉት ክፍሎች ይመደባሉ -

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

እያንዳንዱ ቁራጭ ቅጠል የሚከተለው ነው-

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

የሜርክል ወላጆች የሚከተሉት ናቸው

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

ያልተለመዱ ደረጃዎች የመጨረሻውን ኖድ ያባዛሉ። የጥያቄ ዱካዎች የሚረጋገጡት በእያንዳንዱ ደረጃ ባለው የጥያቄ ቅጠል መረጃ ጠቋሚ እኩልነት መሰረት ግራ ወይም ቀኝ በማጣራት ነው።

በመረጃ ጠቋሚ `i` ላይ ላለው ቅጠል፣ መንገድ `(s_0,\ldots,s_{d-1})` ከሥሩ `R` ጋር በተደጋጋሚነት ያረጋግጣል -

$$
y_0=L_i
$$

$$
y_{k+1}=
\begin{cases}
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),y_k,s_k),
& \lfloor i/2^k\rfloor \equiv 0 \pmod 2\\
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),s_k,y_k),
& \lfloor i/2^k\rfloor \equiv 1 \pmod 2
\end{cases}
$$

ቼኩ የሚያልፈው በሚከተለው ጊዜ ብቻ ነው-

$$
y_d=R
$$

AIR የመከታተያ ረድፍ ቅጠሎች የሚከተሉት ናቸው

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR ቅንብር ቅጠሎች የሚከተሉት ናቸው

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

የ LDE መጠይቅ መክፈቻ በግምገማ መረጃ ጠቋሚ `i` የተከፈተው እሴት በተረጋገጠው ክፍል ውስጥ መኖሩን ያረጋግጣል -

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI ማጠፍ {#fri-folding}

FRI ምስጠራ ከ AIR የቅንብር ግምገማዎች ጋር ይጣመራል። ለእያንዳንዱ ዙር `l`፣ ግልባጩ ፈተናን ናሙናዎች `beta_l`። የመጨረሻውን እሴት በመድገም ንብርብሩ ወደ አርቲ ብዜት ተጭኗል። እያንዳንዱ የአርቲ መጠን ያለው ቡድን ወደሚከተለው ይታጠፋል -

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

`a` FRI አርቲ የት አለ? አረጋጋጩ ለእያንዳንዱ ናሙና የመጠይቅ ሰንሰለት ያንን ይፈትሻል -

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

እና እያንዳንዱን የተከፈተ FRI ቡድን ከተዛማጅ FRI የንብርብር ሥር ጋር ያረጋግጣል።

### የ Fiat-Shamir ግልባጭ {#fiat-shamir-transcript}

ነጠላ ፕሮቶኮል-መደበኛ መለኪያ ካታሎግ የግልባጭ ምስጠራ ሃሽ እንደ SHA3-256 ይሰይማል። የአሁኑ አረጋጋጭ እና አረጋጋጭ ትግበራ ፈታኝ ባይቶችን በ `iroha_crypto::Hash::new` ያገኛል፣ እሱም ባለ 32-ባይት Blake2bVar ክሪፕቶግራፊያዊ ዳይጀስት ነው፣ ከዚያም የመጀመሪያዎቹን ስምንት ትንሽ-ኢንዲያን ባይት ወደ `F` ይቀንሳል።

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

ቴክኒካል ጥሪዎችን ይፈትኑ ሙሉውን የክሪፕቶግራፊያዊ ዳይጀስትን ከግልባጭ ሁኔታ ጋር ያያይዙ። የድጋሚ አጫውት ቅደም ተከተል -

1. ይፋዊ IO፣ የፕሮቶኮል ስሪት፣ የመለኪያ ስሪት እና የመለኪያ ስም
2. LDE ሥር እና የመከታተያ ሥር
3. `gamma`
4. AIR የቅንብር ተግዳሮቶች `alpha_0`፣ `alpha_1`
5. AIR የመከታተያ ሥር እና AIR ጥንቅር ሥር
6. ታላቅ ምርትን ይፈልጉ
7. FRI የንብርብር ሥሮች እና `beta_l` ተግዳሮቶች
8. የናሙና መጠይቅ ኢንዴክሶች

የጥያቄ ናሙና የተጠየቀውን ልዩ ኢንዴክሶች ቁጥር እስኪያገኝ ድረስ ባለ 32-ባይት ፈታኝ ክሪፕቶግራፊያዊ ዳይጀስቶችን መሳል እና እንደ ትንሽ-ኢንዲያን `u64` ቁርጥራጮች ማንበቡን ይቀጥላል።

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

የናሙናው ስብስብ በተደረደሩ ቅደም ተከተል ይመለሳል።

### አረጋጋጭ እንደገና ማጫወት {#verifier-replay}

አረጋጋጩ በመጀመሪያ የቡድን ክሪፕቶግራፊያዊ ኮሚትመንትን እንደገና ያሰላል -

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

እና ይጠይቃል

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

እንዲሁም ህዝቡን እንደገና ይገነባል IO -

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

እያንዳንዱ መስክ ከማረጋገጫው ይፋዊ IO ባይት-ለ-ባይት ጋር መዛመድ አለበት። አረጋጋጩ ተመሳሳዩን ግልባጭ እንደገና ይገነባል እና ተመሳሳይ ያገኛል -

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

ለእያንዳንዱ የናሙና መጠይቅ `q`፣ የሚከተለውን ያረጋግጣል -

$$
\operatorname{MerkleVerify}(
R_{\text{lde}},
L_{\lfloor q/B_{\text{lde}}\rfloor},
\lfloor q/B_{\text{lde}}\rfloor,
\pi_{\text{lde}}
)
$$

$$
\operatorname{MerkleVerify}(
R_{\text{air}},
L^{\text{air}}_q,
q,
\pi_{\text{air,current}}
)
$$

$$
\operatorname{MerkleVerify}(
R_{\text{air}},
L^{\text{air}}_{q+1\bmod N_{\text{eval}}},
q+1\bmod N_{\text{eval}},
\pi_{\text{air,next}}
)
$$

እና

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

የ AIR ቅንብር መክፈቻ በ`R_air_composition` ስር ማረጋገጥ አለበት። የ FRI ሰንሰለት ከተመሳሳይ `A_q` ይጀምራል እና በተርሚናል FRI ሥር ስር በተረጋገጠ የመጨረሻ FRI ቅጠል ማለቅ አለበት።

## ፕሮቨሩ ምን ያረጋግጣል {#what-the-prover-checks}

ዱካውን ከመገንባቱ በፊት፣ FastPQ አረጋግጣው የቡድን ቅደም ተከተሉን በሽግግር ቁልፍ፣ በኦፕሬሽን ደረጃ እና በማስገባት ቅደም ተከተል ቀኖናዊ ያደርገዋል። የዝውውር ረድፎች እንዲሁ የግልባጭ ሜታዳታ ያስፈልጋቸዋል። የማስተላለፊያ ረድፎች ያሉት ነገር ግን ምንም የዝውውር ግልባጮች የሉም ባች ልክ ያልሆነ ነው።

ለዝውውር ግልባጮች፣ የፕሮቨር-ጎን ቼኮች የሚከተሉትን ያካትታሉ

- የላኪው ቀሪ ሂሳብ መፍሰስ የለበትም
- `sender_after` እኩል መሆን አለበት `sender_before - amount`
- `receiver_after` እኩል መሆን አለበት `receiver_before + amount`
- ግልባጩ በቡድኑ ውስጥ ያለውን እያንዳንዱን የማስተላለፊያ ረድፍ መሸፈን አለበት
- ነጠላ-ዴልታ ፖሲዶን ክሪፕቶግራፊያዊ ዳይጀስት፣ በሚኖርበት ጊዜ፣ ከትራንስክሪፕት ቅድመ ዝግጅት ጋር መዛመድ አለበት።
- የቀረበ አልሙ-ሜርክል ማረጋገጫዎች እንደ ስሪት 1 መፍታት አለባቸው; የጎደሉ መንገዶች በዲተርሚኒስቲክ ሰው ሠራሽ ማረጋገጫዎች ተሞልተዋል

ዱካው ለማስተላለፍ፣ ለማውጣት፣ ለማጥፋት፣ ለሚና ስጦታ፣ ሚና መሻር፣ ሜታዳታ ስብስብ እና የፍቃድ ፍለጋ ረድፎችን የመራጭ አምዶችን ይዟል። የቁጥር ኦፕሬሽን ረድፎች የተፈረሙ ዴልታዎችን፣ በንብረት ዴልታዎችን እና የአቅርቦት ቆጣሪዎችን ይይዛሉ።

## የማስፈጸሚያ መስመር {#prover-lane}

`iroha3d` የፕሮቨር ጀርባው መጀመር ከቻለ FastPQ የፕሮቨር ማስፈጸሚያ መስመርን ሲጀምር ይጀምራል።. የማስፈጸሚያ መስመሩ የታሰረ ወረፋ ያለው የጀርባ ተግባር ነው።. አንድ ብሎክ የማስፈጸሚያ ምስክርነት ካወጣ በኋላ፣ የጋራ መግባባት የማጠናቀቂያ መንገድ የብሎክ ምስጠራ ሃሽ፣ ቁመት፣ እይታ እና ምስክርነት የያዘ የማረጋገጫ ስራ ያቀርባል።

የማስፈጸሚያ መስመሩ የማይሰራ ከሆነ ወይም ወረፋው ከሞላ, ስራው ተዘልሏል እና መደበኛ የብሎክ ሂደት ይቀጥላል. ይህ ማለት የጀርባ ማረጋገጫ ማስፈጸሚያ መስመር የግብይት መግቢያ ወይም የጋራ መግባባት በር አይደለም። አስቀድሞ የተፈፀመ በስቴት ላይ የማረጋገጫ ምርት መንገድ ነው።

የማስፈጸሚያ መስመሩ ከሚከተሉት ጋር ማረጋገጫ ይገነባል -

```text
parameter = "fastpq-lane-balanced"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

ሁለቱም ቅንብሮች በነባሪነት ወደ `cpu` ናቸው። `gpu`ን መምረጥ ግልጽ፣ ያልተሳካ የተዘጋ ጥያቄ ነው የ GPU ድጋፍ ካልተጠናቀረ ወይም የተጠየቀ GPU ጀርባ ቅድመ በረራ አልተሳካም፣ የፕሮቨር ማስፈጸሚያ መስመር ተሰናክሏል። የመጀመሪያው ልቀት ምንም `auto` እሴት የለውም እና ከተጠየቀው GPU ሁነታ ወደ CPU አይወድቅም።

## ማረጋገጫ {#verification}

FastPQ የማረጋገጫ ማረጋገጫ ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ ባች ክሪፕቶግራፊያዊ ኮሚትመንትን እንደገና ይገነባል እና የህዝብ ግልባጩን ይደግማል። አረጋጋጩ ፕሮቶኮሉን ይፈትሻል ስሪት፣ በመለኪያ የተቀመጠ ስሪት፣ የድጋሚ አጫውት ገደቦች፣ የምስጢር ኮሚትመንትን ይከታተሉ፣ የህዝብ ግብዓቶች፣ ናሙና የመርክሌ ክፍተቶች፣ AIR ክፍት ቦታዎች እና FRI የመጠይቅ ሰንሰለት።

ነባሪ የመልሶ ማጫወት ገደቦች የሚከተሉትን ያካትታሉ

|ገደብ|ነባር|
| ------------------ | ------: |
|የ መሸጋገሪያ ረድፎች|     256 |
|የባች ጭነት መጠን|256 KiB|
|FRI ንብርብሮች|      16 |
|የመጠይቅ ክፍት ቦታዎች|     128 |

## Nexus የተረጋገጡ ቅብብሎሽ {#nexus-verified-relays}

Nexus AXT የማረጋገጫ ውሂብ መያዣዎች `AxtFastpqBinding` መክተት ይችላሉ። `RegisterVerifiedLaneRelay` ሲፈጽም Iroha

1. የማስፈጸሚያ መስመር ማስተላለፊያ ዳታ መያዣ እና FastPQ የማረጋገጫ ቁሳቁስ ያረጋግጣል
2. የውሂብ ቦታን እና ቴክኒካዊ ማያያዣ ስርወውን ይፈትሻል
3. የ AXT ማረጋገጫ ዳታ መያዣን ይፈታ
4. ያስፈልገዋል `fastpq_binding`
5. FastPQ ባሌን ከዚያ ማሰሪያ እንደገና ይገነባል
6. የተካተተውን FastPQ ማረጋገጫ ይፈታ
7. በድጋሚ በተገነባው ባች እና ማስረጃ ላይ የ FastPQ አረጋጋጭን ይጠራል

ማረጋገጫው ከተሳካ፣ Iroha የማስተላለፊያ ማመሳከሪያውን፣ ኦሪጅናል የውሂብ መያዣውን፣ የማረጋገጫ ጭነት ምስጠራ ሃሽን፣ የማረጋገጫ ቁመትን፣ ቴክኒካል አንጸባራቂ ሥር እና FastPQ ማያያዣን የያዘ `VerifiedLaneRelayRecord` ያከማቻል።

የማስፈጸሚያ ሌይን ማስተላለፊያ ዳታ ኮንቴይነሮች የታመቀ FastPQ የማረጋገጫ ቁሳቁስ ይይዛሉ። ቁሱ በማስፈጸሚያ ሌይን መታወቂያ፣ ዳታ ቦታ መታወቂያ፣ የብሎክ ቁመት፣ የማረጋገጫ ቁመት፣ የብሎክ ራስጌ ምስጠራ ሃሽ፣ የፋይናንሺያል ግብይት ማጠናቀቂያ፣ ምስጠራ ሃሽ እና ቴክኒካል አንጸባራቂ root። ቅብብል ውህደት ተቀባይነት የሚኖረው ሁለቱም QC እና የሚሰራ FastPQ የማረጋገጫ ቁሳቁስ ሲኖረው ብቻ ነው።

### AXT ሂሳብ አስገዳጅ {#axt-binding-math}

ለ Nexus AXT የውሂብ ኮንቴይነሮች፣ `AxtFastpqBinding` ከማረጋገጫው ድጋሚ አጫውት በፊት ቀኖናዊ ነው። ባዶ የመለኪያ እሴቶች ነባሪ ወደ `fastpq-lane-balanced`; ባዶ አረጋጋጭ መታወቂያ እና ስሪት ነባሪ ወደ `fastpq` እና `v1`; የይገባኛል ጥያቄ አይነት ተቆርጧል እና ዝቅ ብሏል።

የ AXT FastPQ የህዝብ ግብዓቶች ዲተርሚኒስቲክ ባይት ምስጠራ ሃሽዎች ናቸው -

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

AXT የሽግግር ቁልፎች የሚከተሉት ናቸው

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

የ`authorization` የይገባኛል ጥያቄ የሚና-ስጦታ ረድፍ ያስገባል -

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

እና የፍቃድ ፖሊሲውን የሚያስገናኝ ሜታዳታ ረድፍ። የ`compliance` የይገባኛል ጥያቄ ሁለት ሜታዳታ ረድፎችን ያስገባል አንዱ ለፖሊሲው እና አንድ ለታለመላቸው የውሂብ ቦታዎች።

ለ `tx_predicate` እና `value_conservation` ግልጽ የሆነ የውጤት መጠን ጥቅም ላይ ይውላል ማሰሪያው አዎንታዊ ምንጭ ወይንም የመድረሻ መጠን ሲይዝ አለበለዚያ ኮዱ የወሰነ የተወሰነ መጠን ያመጣል

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

ከዚያ ተመሳሳይ የማስተላለፊያ እኩልታዎች ጥቅም ላይ ይውላሉ-

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

ሰው ሰራሽ ላኪ እና ተቀባይ መለያ መታወቂያዎች የሚመነጩት ከቁልፍ ዘሮች ነው -

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

የዝውውር ባች ምስጠራ ሃሽ -

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

የ AXT ባች ቴክኒካል አንጸባራቂ ምስጠራ ዳይጀስት እሴት SHA-256 በነጠላ ፕሮቶኮል-ስታንዳርድ ማሰሪያ Norito ኢንኮዲንግ ላይ ነው።

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP ግልጽ የመልእክት ማረጋገጫዎች {#sccp-transparent-message-proofs}

የ SCCP አጋዥ ሶፍትዌር ፓኬጅ ለግልጽ ሰንሰለት አቋራጭ መልእክት ማረጋገጫዎች FastPQ ይጠቀማል። ይህ መንገድ ከ `iroha3d` የጀርባ ማረጋገጫ ማስፈጸሚያ መስመር የተለየ ነው። የ FastPQ ባች በቀጥታ ከ SCCP የመልእክት ማረጋገጫ ጥቅል እና ቴክኒካል ማኒፌስት ይገነባል፣ ከዚያም የተገኘውን ማረጋገጫ ለክፍት ማረጋገጫ ይጠቀለላል።

የ SCCP ስብስብ `fastpq-lane-balanced` እና ሶስት ሜታዳታ ሽግግሮችን ይጠቀማል -

|ቁልፍ|ቀዶ ጥገና|
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement`|`MetaSet`|
|`sccp:transparent:v1:context`|`MetaSet`|
|`sccp:transparent:v1:payload`|`MetaSet`|

የእሱ የህዝብ ግብዓቶች ከ SCCP ግልጽ ከሆነው ውስጣዊ ማስረጃ የተገኙ ናቸው -

|FastPQ ግቤት|SCCP ምንጭ|
| ------------- | ---------------------------------------------------------- |
|`dsid`|የመጀመሪያዎቹ 16 ባይት የBlake2b ምስጠራ ዳይጄስት እሴት በመግለጫው ላይ ምስጠራ ሃሽ|
|`slot`|የመጨረሻ ቁመት|
|`old_root`|ክሪፕቶግራፊክ ሃሽ ጫን|
|`new_root`|ክሪፕቶግራፊያዊ ኮሚትመንት root|
|`perm_root`|የመጨረሻ ብሎክ ምስጠራ ሃሽ|
|`tx_set_hash`|መግለጫ ምስጠራ ሃሽ|

የ SCCP ነጠላ ፕሮቶኮል-ስታንዳርድ ኢንኮደሮች ኢንቲጀሮችን በትንሽ-ኢንዲያን ይጽፋሉ እና ተለዋዋጭ ርዝመት ያለው ባይት ድርድሮችን እንደሚከተለው ያስቀምጣሉ -

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

ግልጽ የሆነው የህዝብ ግቤት ባይት ሕብረቁምፊ የሚከተለው ነው -

$$
P =
\operatorname{version}\|
\operatorname{message\_id}\|
\operatorname{payload\_hash}\|
\operatorname{le32}(\operatorname{target\_domain})\|
\operatorname{commitment\_root}\|
\operatorname{le64}(\operatorname{finality\_height})\|
\operatorname{finality\_block\_hash}
$$

ግልጽ የሆነው መግለጫ ባይት የስሪት፣ የሰንሰለት ቤተሰብ፣ የአካባቢ እና ተጓዳኝ ጎራዎች፣ የደህንነት ሞዴል፣ መልህቅ አስተዳደር፣ የመለያ ኮዴክ፣ የመጨረሻ ሞዴል፣ አረጋጋጭ ኢላማ፣ አረጋጋጭ የጀርባ ቤተሰብ፣ ርዝመት-ቅድመ ቅጥያ ሰንሰለት/የጀርባ/አንጸባራቂ መስኮች፣ መድረሻ አስገዳጅ ምስጠራ ሃሽ፣ የመለያ ኮዴክ ቁልፍ፣ ጭነት አይነት፣ የህዝብ ግቤት ባይት እና ጭነት ምስጠራ ሃሽ። መግለጫው ምስጠራ ሃሽ የሚከተለው ነው -

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

የዚህ የማረጋገጫ መንገድ የ FastPQ የውሂብ ቦታ መታወቂያ የሌላ ቅድመ ቅጥያ Blake2b ክሪፕቶግራፊያዊ ዳይጀስት የመጀመሪያዎቹ አስራ ስድስት ባይት ነው።

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

የ SCCP FastPQ ስብስብ በትክክል ነው -

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

ከዚያም በተመሳሳይ FastPQ ትዕዛዝ ይደረደራል።

የ OpenVerify አረጋጋጭ ክሪፕቶግራፊያዊ ኮሚትመንት ዋጋ SHA-256 በ SCCP የመልእክት ጀርባ ስም እና በነጠላ ፕሮቶኮል-ስታንዳርድ FastPQ አረጋጋጭ ገላጭ ላይ ነው።

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

ጥሬው FastPQ ማስረጃው Norito ወደ `StarkFriOpenProofV1` የተቀመጠ ነው፣ ከዚያም በ `OpenVerifyEnvelope` ከኋላ `Stark` ጋር ተጠቅልሎ ነው። SCCP ማረጋገጫ ተመሳሳይ ነገር እንደገና ይገነባል FastPQ ባች ከጥቅሉ እና ቴክኒካል ማኒፌስት፣ የተከፈተውን የማረጋገጫ ውሂብ መያዣ ሜታዳታ ይፈትሻል እና በድጋሚ በተሰራው ባች እና ማረጋገጫ ላይ የ FastPQ አረጋጋጭን ይጠራል።

## የመለኪያ ስብስቦች {#parameter-sets}

ነጠላ ፕሮቶኮል-መደበኛ መለኪያ ካታሎግ ሁለት የመለኪያ ስብስቦችን ያጋልጣል። የአስተናጋጁ ማረጋገጫ ማስፈጸሚያ መስመር በአሁኑ ጊዜ `fastpq-lane-balanced` ይጠቀማል።

|መለኪያ|ዓላማ|መስክ|ምስጠራ ሃሽዎች|FRI|
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced`|ሚዛናዊ የማረጋገጫ ፍሰት|Goldilocks ባለአራት ማዕዘን ቅጥያ|Poseidon2 ክሪፕቶግራፊያዊ ኮሚትመንቶች፣ ካታሎግ SHA3 መለያ|ARITY 8, Blowup 8, 46 መጠይቆች|
|`fastpq-lane-latency`|መዘግየት-sensitive የማስፈጸሚያ መስመሮች|Goldilocks ባለአራት ማዕዘን ቅጥያ|Poseidon2 ክሪፕቶግራፊያዊ ኮሚትመንቶች፣ ካታሎግ SHA3 መለያ|አርቲ 16፣ ፍንዳታ 16፣ 34 መጠይቆች|

ሁለቱም ባለ 128-ቢት ደህንነትን ያነጣጠሩ እና የመከታተያ ጎራ መጠን `2^16` ይጠቀማሉ። የ Rust V1 ግልባጭ ድጋሚ አጫውት ኮድ በአሁኑ ጊዜ በቀጥታ SHA3-256 ከመጥራት ይልቅ የFiat-Shamir ፈታኝ ባይት በ`iroha_crypto::Hash::new` ያገኛል።

በ Rust አረጋጋጭ የሚጠቀሙባቸው ትክክለኛ የካታሎግ ቋሚዎች የሚከተሉት ናቸው -

|የማያቋርጥ|`fastpq-lane-balanced`|`fastpq-lane-latency`|
| -------------------- | ---------------------: | --------------------: |
|`target_security`|                    128 |                   128 |
|`grinding_bits`|                     23 |                    21 |
|`trace_log_size`|                     16 |                    16 |
|`trace_root`|`0x002a247f81c6f850`|`0x6a9f4eb38fb9b892`|
|`lde_log_size`|                     19 |                    20 |
|`lde_root`|`0x60263388dbbf9b2a`|`0x9c9c3a571b6f89ac`|
|`permutation_size`|                 65,536 |                65,536 |
|`lookup_log_size`|                     19 |                    20 |
|`omega_coset`|`0x6af325e825ad5c18`|`0x3a5fd4171e3c3a4d`|
|`fri_arity`|                      8 |                    16 |
|`fri_blowup`|                      8 |                    16 |
|`fri_max_reductions`|                      8 |                     6 |
|`fri_queries`|                     46 |                    34 |

## ውቅር {#configuration}

FastPQ ውቅር በ `zk.fastpq` ስር ተቀምጧል.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false
metal_debug_fused = false
```

ተመሳሳይ የማስፈጸሚያ እና የቴሌሜትሪ መለያዎች ከ `iroha3d` ሊሻሩ ይችላሉ -

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

የአካባቢ ተለዋዋጮች ለማዋቀሪያ መስኮችም ይደገፋሉ። የ FastPQ-ተኮር ተለዋዋጮች የሚከተሉትን ያካትታሉ

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`
- `FASTPQ_DEBUG_FUSED`

## መለኪያዎች {#metrics}

ቴሌሜትሪ ሲነቃ FastPQ ለጀርባ ምርጫ እና ለብረታ ብረት ሶፍትዌር ማስፈጸሚያ አካባቢ ባህሪ መለኪያዎችን ወደ ውጭ ይልካል -

|ሜትሪክ|ትርጉም|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total`|የተጠየቀ እና የተፈታ የማስፈጸሚያ ሁነታ በጀርባ እና በመሣሪያ መለያዎች|
|`fastpq_poseidon_pipeline_total`|የተጠየቀ እና የተፈታ የፖሲዶን ሶፍትዌር ማቀነባበሪያ የስራ ፍሰት መንገድ|
|`fastpq_metal_queue_depth`|የብረት ወረፋ ገደብ፣ ከፍተኛው የበረራ ብዛት፣ የመላኪያ ብዛት እና የናሙና መስኮት|
|`fastpq_metal_queue_ratio`|የብረት ወረፋ ስራ በዝቶበታል እና ተደራራቢ ሬሾዎች|
|`fastpq_zero_fill_duration_ms`|ለብረታ ብረት ሩጫዎች ዜሮ-ሙሌት ቆይታ ያስተናግዱ|
|`fastpq_zero_fill_bandwidth_gbps`|የተገኘ ዜሮ-ሙላ የመተላለፊያ ይዘት|

ለአጠቃላይ የአፈጻጸም መለየት፣ እነዚህን በ[አፈጻጸም እና መለኪያዎች](/am/guide/advanced/metrics.md) ውስጥ ከተዘረዘሩት የጋራ መግባባት እና ወረፋ ምልክቶች ጋር ይጠቀሙ።

## ተዛማጅ ማጣቀሻ {#related-reference}

- [የውሂብ ሞዴል ንድፍ](/am/reference/data-model-schema.md) የጊዜ ገደብ
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ አማራጮች](/am/reference/iroha3d-cli.md#fastpq-overrides)
