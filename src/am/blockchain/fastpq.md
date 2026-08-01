---
translation_locale: am
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ ነው Iroha እሱ ነው STARK ለተመረጡ አፈፃፀም ውጤቶች የማረጋገጫ መንገድ። መደበኛውን የግብይት አፈፃፀምን ወይም መግባባትን አይተካም። ግብይቶች አሁንም እየተከናወኑ ናቸው ISI, IVM, እና Sumeragi እንደተለመደው፤ FastPQ የዲተሪሚኒስት አፈፃፀም ምስክሩን ይጠቀማል እና የተደገፉ ውጤቶችን ወደ ማስረጃ ጭነቶች ይቀይራል።

የአሁኑ አስተናጋጅ ውህደት ሦስት ዋና መንገዶች አሉት-

- በብሎክ አፈፃፀም ወቅት የተመዘገቡ ግልጽ የቁጥር ንብረት ዝውውሮች
- Nexus የተረጋገጡ የመንገድ ተለጣፊዎች የ AXT የማረጋገጫ ፖስታው FastPQ ማሰሪያ የሚሸከምበት
- SCCP ግልፅ የመልእክት ማስረጃ ረዳቶች የ FastPQ ማስረጃን በክፍት የማረጋገጫ ፖስታ ውስጥ የሚያሸጉት

## የይሖዋ ምሥክርነት መንገድ ማስተላለፍ {#transfer-witness-path}

ግልፅ የቁጥር ማስተላለፊያዎች መመሪያው ሚዛኖችን በሚቀይርበት ጊዜ የተዋቀረ የመተላለፊያ ጽሑፍ ይፈጥራሉ። የጽሑፍ መዛግብት:

- ምንጭ ሂሳብ፣ መድረሻ ሂሳብ፣ የንብረት ማረጋገጫ እና መጠን
- ከመተላለፉ በፊት እና በኋላ የተላኪው እና ተቀባዩ ሚዛን
- እንደ ባች ሃሽ ጥቅም ላይ የሚውለው የግብይት መግቢያ ነጥብ ሀሽ
- ከቀረበው ሂሳብ የተገኘ የሥልጣን መረጃ
- ለሲንኮል ዴልታ ትራንስክሪፕቶች የፖዚዶን ዲጀስት

የቡድን ማስተላለፊያዎች በርካታ ዴልታዎችን ያካተተ አንድ ትራንስክሪፕት ይጠቀማሉ። በዚህ ጊዜ የአንድ-ዴልታ ፖሲዶን ዲስጀስት አይገኝም።

በብሎክ ማጠናቀቂያ ላይ Iroha እነዚህን ትራንስክሪፕቶች በመግቢያ ነጥብ ሃሽ ይመድባል ። የአፈፃፀም ምስክሩ ከዚያ ለፕሮግራሙ የተዘጋጁትን የመጀመሪያውን የትራንስክሪት ጥቅሎችን እና የ FastPQ ሽግግር ቡድኖችን ይይዛል ።

እያንዳንዱ ማስተላለፊያ ዴልታ ሁለት የሽግግር ረድፎች ይሆናሉ:

|ረድፍ|ቁልፍ ቅርጽ |ቅድመ እሴት |ከዋጋ በኋላ |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|የመላኪያ ክፍያ |`asset/<asset-definition>/<source-account>` |በፊት ላኪ ሚዛን |የመላኪያ ሚዛን |
|ተቀባይነት ያለው ብድር |`asset/<asset-definition>/<destination-account>` |ተቀባዩ ሚዛን በፊት |ከተቀበለው ሚዛን በኋላ|

የቁጥር እሴቶች ወደ ሙሉ ቁጥር ምስክር አሃዶች መደበኛ ይሆናሉ። በተመረጠው የአስርዮሽ ልኬት ላይ እንደ አሉታዊ ያልሆነ `u64` ሊገለፅ ካልቻለ አንድ ዋጋ ለ FastPQ ጭምብል ውድቅ ተደርጓል ።

## የሕዝብ ግብዓት {#public-inputs}

እያንዳንዱ FastPQ የሽግግር ጭነት ማስረጃውን ከብሎክ እና ከአፈፃፀም አውድ ጋር የሚያገናኙ የህዝብ ግብዓቶችን ይይዛል

|መግቢያ |ትርጉም|
| ------------- | --------------------------------------------------------------- |
|`dsid` |የውሂብ መዳረሻ መታወቂያ እንደ አነስተኛ-አንድያን ባይቶች የተቀየሰ |
|`slot` |የብሎክ ፈጠራ ጊዜ ወደ ናኖ ሰከንዶች ተቀይሯል |
|`old_root` |የወላጅ ግዛት መነሻ ከፈፃሚው ምስክር የተገኘ|
|`new_root` |ከስህተቱ ምስክር የተገኘ የፖስት ስቴት ሥርዓት|
|`perm_root` |የፖሴይዶን ተሳትፎ በሥራ ሚና ፈቃድ ላይ |
|`tx_set_hash` |በደረጃ የተቀመጡ ግብይቶች እና የጊዜ ማነቃቂያ መግቢያ ነጥብ ሃሽዎች ላይ ሀሽ |

አስተናጋጁ `fastpq-lane-balanced` ን ለእነዚህ ጭነቶች እንደ ቀኖናዊ መለኪያ ይጠቀማል ።

## የሂሳብ ሞዴል {#mathematical-model}

ይህ ክፍል የአሁኑን Rust አመልካች እና ማረጋገጫ የሚተገበረውን የሂሳብ ጥናት ይገልጻል። ከዚህ በታች ያሉት ሁሉም የመስክ ሥራዎች በወርቅ ሽቦ የመጀመሪያ መስክ ላይ ናቸው-

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ Poseidon2 ን ይጠቀማል `F` ለሜዳ ግዴታዎች ስፋት ያለው ስፖንጅ `t = 3`, ተመን `r = 2`, እና አቅም `1`. ሃሽ በደረጃ-2 ብሎኮች ውስጥ የመስክ ንጥረ ነገሮችን ይቀበላል እና ነጠላ መስክ ንጥረ ነገር ይጨምራል። `1` ከመጨረሻው ለውጥ በፊት:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

የባይት ገመዶች በ 7-ባይት አነስተኛ-ኢንዲያን ጫፎች ውስጥ የታሸጉ ስለሆነም እያንዳንዱ ጫፍ በጥብቅ ከ `p` በታች ነው ።

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

የጎራ የተለዩ የመስክ ሃሽዎች እንደሚከተለው ይወከላሉ:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

ከባይት-ጎራ ዲስጀቶች ለሚጀምሩ ሃሽዎች FastPQ የመጀመሪያዎቹን ስምንት አነስተኛ ኢንዲያ ባይቶችን ወደ መስክ ያቀርባል:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

እዚህ `Hash` ማለት የ Iroha `iroha_crypto::Hash::new` ፣ 32-ባይት Blake2bVar ዲጀስት ነው ፣ አንድ ቀመር በገለጽ Poseidon2 ወይም SHA-256 ስሞች ካልሆነ በስተቀር።

### የመስክ ሒሳብ {#field-arithmetic}

የ Rust ኮድ የመስክ ንጥረ ነገሮችን በ `[0,p)` ውስጥ እንደ መደበኛ `u64` እሴቶች ይወክላል ።

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

ማባዛት በመጀመሪያ የ 128 ቢት ምርቱን ይሰላል-

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

የወርቅ ብልቶች ቅነሳ ከዚያም ማንነት ይጠቀማል:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

የሚከተሉትን ካደረጉ:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

ከዚያም መቀነሻው ይሰበስባል:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

ትግበራው ውጤቱ ካኖኒካል እስኪሆን ድረስ `p` ን በሁኔታዎች ይጨምራል ወይም ይቀነሳል። እንደ ሚዛን ዴልታ ያሉ የተፈረሙ ሙሉ ቁጥሮች የሚከተሉትን ያካትታሉ

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### የፖዚዶን2 ለውጥ {#poseidon2-permutation}

የፖዚዶን 2 መለዋወጥ ሁኔታ:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

የእሱ ኤስ-ሳጥን:

$$
S(x)=x^5
$$

FastPQ አራት ሙሉ ዙር, አምሳ ሰባት ክፍልፋይ ዙሮች ይጠቀማል, ከዚያም አራት ተጨማሪ ሙሉ ዙሮች. `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` ነው:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

በከፊል ዙር:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

ሁሉም ተጨማሪዎች እና ማባዛት በ `F` ውስጥ ይገኛሉ ። የካኖኒካል MDS ማትሪክ የሚከተለው ነው

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

መስክ ሃሽ ከዜሮ ሁኔታ ይጀምራል. ለእያንዳንዱ የተሟላ ደረጃ-2 ብሎክ `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

የመጨረሻው ብሎክ `1` የሽፋን ንጥረ ነገርን ከመጨረሻው ለውጥ በፊት ይጨምራል ። ውጤቱ `x_0` ነው።

### የሕዝብ ግብዓት ግዴታ {#public-input-binding}

አስተናጋጁ የ `u64` እሴቱን በ 16 ባይት መስክ የመጀመሪያዎቹ ስምንት አነስተኛ-ኢንዲያን ባይቶች በመጻፍ የውሂብ ቦታ መታወቂያ ይኮድ:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

የብሎክ መፍጠር ጊዜ ከሚሊ ሴኮንድ ወደ ናኖ ሴኮንድ ይቀየራል:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

የግብይት ስብስብ ሃሽ የተደረደሩ የመግቢያ ነጥብ ሀሽዎች ላይ ባይት-ዶሜይን ሃሽ ነው:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

`h_i` የተደረደሩ የግብይት እና የጊዜ ማስነሳት የመግቢያ ነጥብ ሃሽዎች በሚሆኑበት ቦታ። በማረጋገጫው በይፋ IO ውስጥ ፣ `perm_root` ወይም `tx_set_hash` ሁሉም ዜሮ ከሆነ ፣ ፕሮቫር የወደፊቱ እሴቶች ይሞላል

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

ለእያንዳንዱ ዝውውር ዴልታ የዒላማ አሥረኛ ልኬት በዋጋው እና በሁለቱም ሚዛን ቅጽበታዊ ገጽ እይታዎች ላይ ከፍተኛውን የተቆራረጠ ልኬት ነው-

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

ሀ `Numeric` ዋጋ ከማንቲሳ ጋር `m` እና ሚዛን `q` ተቀባይነት የሚሰጠው `m >= 0` እና `q <= s`. የእሱ FastPQ የይሖዋ ምሥክር ዋጋ፡-

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

የተለመደው ውጤት ወደ `u64` ይገጣጠማል.

### የካኖኒካዊ ትዕዛዝ {#canonical-ordering}

ከትራስ ግንባታ በፊት ጭቃው በዝግጅት ቁልፍ ፣ በአሠራር ደረጃ እና በመጀመሪያው የመጫኛ ማውጫ መሠረት ይደረጋል-

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

የትዕዛዝ ግዴታ በፖሲዶን2 መስክ ላይ በ `fastpq:v1:ordering` ጎራ እና በተደረደሩ ሽግግሮች ውስጥ በ Norito ኢንኮዲንግ ላይ ሃሽ ማድረግ ነው-

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

የት `P` የ7 ባይት ማሸጊያ ነው፣ `E` ነው Norito ኮድ ማድረግ፣ `D_o` ነው `fastpq:v1:ordering`, እና `T*` የተደረደረው የሽግግር ዝርዝር ነው።

### የማስተላለፍ እኩልነቶች {#transfer-equations}

ለዝውውር ክፍያ `a`, የመላኪያ ሚዛን `f`, እና ተቀባዩ ሚዛን `t`, FastPQ ፍለጋውን ከመገንባቱ በፊት የተለመዱትን ምስክር እሴቶች ያረጋግጣል-

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

ከዚያ የሽግግር ረድፎቹ የሚከተሉትን ኮድ ያደርጋሉ:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

በክትትሉ ውስጥ የተፈረሙ ዴልታዎች ወደ `F` ይቀንሳሉ-

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

አማራጭ ነጠላ-ዴልታ ማስተላለፊያ ዳይጀስት የኮድ የተደረገውን የማስተላለፊያ ቅድመ ምስል ይፈጽማል:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

ለበርካታ ዴልታ ማስተላለፊያ ትራንስክሪፕቶች የአሁኑ ቅርጸት ይህ ከፍተኛ-ደረጃ ዳይጀስት መቅረት አለበት.

የማስተናገድ ባለሥልጣኑ ለዝውውር ትራንስክሪፕቶች የሚወስደው:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### የመከታተያ መስመሮች {#trace-rows}

የተደረደረው የሽግግር ዝርዝር `n` እውነተኛ ረድፎችን ይኑርዎት.

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

ረድፎቹ `0..n-1` ንቁ ናቸው; ረድፎች `n..N-1` የሸክላ ወረቀቶች ናቸው. እያንዳንዱ እውነተኛ ረድፍ አንድ የአሠራር ምርጫ ስብስብ አለው:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

ሁሉም ምርጫ አምዶች ቡል ናቸው:

$$
s(s-1)=0
$$

ፈቃድ ፍለጋ መስመሮች በትክክል ሚና መስጠት እና ሚና መሰረዝ መስመሮች ናቸው:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

ለቁጥር አሠራር ረድፎች:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

ገንቢው ደግሞ በአንድ ንብረት ላይ የሚንቀሳቀሱትን ዴልታዎች ይከታተላል:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

የአቅርቦት መለኪያውን የሚያዘምኑት የሜንታ እና የቀዶ ጥገና ወረቀቶች ብቻ ናቸው

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

ሜታዳታ እና የመረጃ ቦታ ዱካ አምዶች ከመስመር ማቴሪያሊዜሽን በፊት የተገኙ የመስክ ሃሽዎች ናቸው-

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

የሜታዳታ ሃሽ ፣ የመረጃ ቦታ ሃሽ እና ክፍተቱ በአጠገብ ባሉ ትራክ መስመሮች ላይ የተረጋጉ ናቸው-

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### የሜርክል አምዶች ማስተላለፍ {#transfer-merkle-columns}

የማስተላለፊያ መስመሮች የ 32-ደረጃ አናሳ ሜርክል ዱካ ይይዛሉ ። አስተናጋጅ ማስረጃ ከጎደለው ከሆነ ፣ ፕሮቨሩ ከመስመር ቁልፍ ፣ ከመጠን በፊት ሚዛን እና ረድፉ የላኪው ወይም ተቀባዩ ወገን መሆኑን የሚገልጽ የተወሰነ መንገድ ያዋህዳል ።

ለሲንቴቲክ ዱካዎች የቅመማ ቅመም ጨው `fastpq:smt:from` ለተላኪ መስመሮች እና `fastpq:smt:to` ለተቀባዩ መስመሮች:

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

የተዋሃደ ቅጠል እና ውስጣዊ አንጓዎች የሚከተሉት ናቸው:

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

ፍለጋው ቢት `b_l`, ወንድም `s_l`, የመግቢያ ኖድ `x_l` እና የውጤት ኖድ `x_{l+1}` በእያንዳንዱ ደረጃ ላይ ይመዝግባል።

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### የፈቃድ ሃሽ {#permission-hashes}

ሚና መስጠት እና መሰረዝ ረድፎች የፍቃድ ምስክር ሃሽ:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

አስተናጋጅ ፍቃድ ሰንጠረዥ ሥር ግቤቶችን በ ሚና ባይት, ፍቃድ ባይት, እና epoch ባይት ይለያል, ከዚያም Poseidon2 Merkle ዛፍ ይገነባል:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

ያልተለመደ ስፋት ደረጃዎች የመጨረሻውን ንጥረ ነገር ይደግፋሉ.

### የሥልጠና ተሳትፎ {#trace-commitment}

ለእያንዳንዱ የትራስ አምድ `c` ፣ FastPQ በመጀመሪያ በትራስ ጎራ ላይ ያሉትን የ አምድ እሴቶች ያገናኛል እና የማስተዋወቂያ ቬክተር አሃሽ ያደርጋል-

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

የክትትል ሥሩ በኮሎኑ ግዴታዎች ላይ የ Poseidon2 Merkle ሥር ነው:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

የመጨረሻው የክትትል ግዴታ በዶሜኑ ላይ ባይት ሃሽ ፣ በፓራሚተር ስብስብ ፣ በክትትል ቅርፅ ፣ በአዕምሯዊ ቁሳቁሶች እና በክትትሉ ሥር ላይ ነው:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

`D_c` የሚሆነው `fastpq:v1:trace_commitment` ከሆነ።

### AIR ጥንቅር {#air-composition}

የ V1 AIR ውህደት እሴት ከመስመር-አካባቢ ቀሪዎች ረቂቅ ድብልቅ ነው። ትራንስክሪፕቱ ሁለት ተግዳሮቶችን ያሳያል-

$$
\alpha_0,\alpha_1 \in F
$$

ለእያንዳንዱ ተጓዳኝ ረድፍ ጥንድ `(i,i+1)` ፣ ፕሮቨር የሚከተሉትን ያሰላል:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

ቀሪዎቹ `rho` በኮድ ቅደም ተከተል፡-

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

የቁጥር አምዶች ላላቸው ረድፎች:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

እና ለተረጋጋው የቡድን አውድ አምዶች:

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

ማረጋገጫ ሰጪው `A_i` ለናሙና የተወሰደውን ረድፍ ክፍተቶች እንደገና ያሰላስላል እና በ AIR ጥንቅር ሜርክል ሥር መሠረት ከተቀበለው የቅጽበት ዋጋ ጋር ይገመግማል ።

### የፍለጋ ምርት {#lookup-product}

የፈቃድ ፍለጋ accumulator የ Fiat-Shamir ፈተና ይጠቀማል `gamma`. በዝቅተኛ ዲግሪ ማራዘሚያ ግምገማዎች ላይ `s_perm` እና `perm_hash`, እየሰራ ያለው ምርት ነው:

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

የምስክር ወረቀቶች:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### ዝቅተኛ-ደረጃ ማራዘሚያ {#low-degree-extension}

`omega_T` የትራስ ጎራ ጄኔሬተር ፣ `omega_E` የግምገማ የጎራ ጄነሬተር እና `g` የተዋቀረው ኮሴት ኦፍሰት ይሁኑ። እሴቶች `v_i` ላላቸው ትራስ አምድ ፣ መስተጋብር `a_j` ን ያመነጫል ፣ ስለሆነም:

$$
f(\omega_T^i)=v_i
$$

ዝቅተኛ-ደረጃ ማራዘሚያ በኮሴት ላይ ተመሳሳይ ፖሊኖሚየልን ይገመግማል:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

አፈፃፀሙ ይህንን በ FFT በፊት የ coset offset ኃይሎች ጋር ጠቀሜታዎችን በማባዛት ይሰበስባል-

$$
a'_j = a_j g^j
$$

ከዚያ በኋላ `a'` በግምገማው ጎራ ላይ መገምገም ።

የ CPU FFT በ bit-reversed ግብዓቶች ላይ አንድ ተደጋጋሚ ራዲክስ-2 Cooley-Tukey ለውጥ ነው. `L`, ግማሽ ርዝመት `H=L/2`, እና የደረጃ ሥር:

$$
\omega_L=\omega^{N/L}
$$

እያንዳንዱ ሽንኩርት እንደሚከተለው ያሰላል፦

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

ተቃራኒው FFT ከ `omega^{-1}` ጋር ተመሳሳይ ለውጥ ያካሂዳል እና በተቃራኒው የጎራ መጠን ይለወጣል-

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

የካታሎግ ሥሮች ከመጠቀምዎ በፊት ይረጋገጣሉ

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

ከካታሎግ ሥር ለተገኙ ትናንሽ ጎራዎች ጀነሬተር የሚከተለው ነው-

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### ረድፍ እና ቅጠል ሃሽስ {#row-and-leaf-hashes}

ከ LDE በኋላ, FastPQ በሁሉም LDE አምዶች ላይ እያንዳንዱን ረድፍ ይለያል. ለ `m` አምዶች:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

ረድፍ ሃሽዎች ከግምገማው ጎራ ይልቅ አሁንም በቅደም ተከተል ጎራ ላይ ካሉ ፣ ፕሮቫር ያንን ነጠላ ረድፍ-ሃሽ አምድ በተመሳሳይ coset LDE ሂደት ጋር ያገናኛል እና ያስፋፋል ።

### የሜርክሌ ክፍተቶች {#merkle-openings}

LDE እሴቶች የሚከተሉትን ቁርጥራጮች ይይዛሉ

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

እያንዳንዱ ቁራጭ ቅጠል የሚከተለው ነው

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

የሜርክል ወላጆች:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

ያልተለመዱ ደረጃዎች የመጨረሻውን ኖት ይደግፋሉ። የጥያቄ መስመሮች በእያንዳንዱ ደረጃ ላይ ባለው የጥያቄ ወረቀት ማውጫ እኩልነት መሠረት ወደ ግራ ወይም ወደ ቀኝ በማጣመር ያረጋግጣሉ ።

`i` በሚለው ኢንዴክስ ላይ ላለው ቅጠል `(s_0,\ldots,s_{d-1})` አንድ መንገድ (PH000001) ከሥሩ `R` ጋር በመተያየት ይረጋገጣል-

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

ቼኩ የሚፈፀመው የሚከተሉትን ጊዜያት ብቻ ነው፦

$$
y_d=R
$$

AIR ትራክ ረድፍ ቅጠሎች የሚከተሉት ናቸው

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR ቅጠሎች የሚከተሉት ናቸው:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

የ LDE መጠይቅ መክፈቻ እንዲሁ በግምገማ መረጃ ጠቋሚ `i` ላይ የተከፈተውን ዋጋ በተረጋገጠ ክፍል ውስጥ መገኘቱን ያረጋግጣል:

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

FRI ለ AIR ጥንቅር ግምገማዎች ይደራጃል። ለእያንዳንዱ ዙር `l` ፣ የዝግረ-ጽሑፍ ናሙናዎች ፈታኝ `beta_l` ናቸው ። ንብርብሩ የመጨረሻውን ዋጋ በመደጋገም ወደ አሪቲው ባለብዙነት ተሞልቷል ። እያንዳንዱ የአሪቲ መጠን ቡድን ወደ:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

where `a` is the FRI arity. መርማሪው ለእያንዳንዱ ናሙና የተወሰደ የጥያቄ ሰንሰለት የሚከተሉትን ያረጋግጣል:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

እና የተከፈተውን እያንዳንዱን FRI ቡድን የሚዛመደው FRI ንብርብሮች ሥር ላይ ያረጋግጣል.

### የፊያት-ሻሚር ትራንስክሪፕት {#fiat-shamir-transcript}

የካኖኒካል ፓራሜትር ካታሎግ የጽሑፍ ትራንስክሪፕቱን ሃሽ እንደ SHA3-256 ያመላክታል ። የአሁኑ ፕሮቨር እና ማረጋገጫ ትግበራ የችግር ባይቶችን ከ `iroha_crypto::Hash::new` ጋር ያመነጫል ፣ ይህም የ 32-ባይት Blake2bVar ዲጀስት ነው ፣ ከዚያ የመጀመሪያዎቹን ስምንት አነስተኛ-ኢንዲያን ባይቶችን ወደ `F` ይቀንሳል:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

ፈታኝ ጥሪዎች ሙሉውን አቃፊ ወደ ትራንስክሪፕት ሁኔታ ይጨምሩ. መልሶ ማጫወት ቅደም ተከተል:

1. IO ፣ የፕሮቶኮል ስሪት፣ የፓራሜትር ስሪት እና የፓራሚተር ስም
2. LDE ሥር እና ቅኝት ሥር
3. `gamma`
4. AIR የግንባታ ተግዳሮቶች `alpha_0`፣ `alpha_1`
5. AIR ፍለጋ ሥር እና AIR ጥንቅር ሥር
6. ፍለጋ ታላቅ ምርት
7. FRI ንብርብሮች ሥር እና `beta_l` ፈተናዎች
8. የናሙና መጠይቅ መረጃ ጠቋሚዎች

የጥያቄ ናሙና አሰጣጥ የተጠየቀውን ልዩ መረጃ ጠቋሚዎች ብዛት እስኪያገኝ ድረስ የ 32-ባይት ፈተና ቁሳቁሶችን እየቆረጠ እና አነስተኛ መጠን ያላቸው `u64` ቁርጥራጮችን እያነበበ ይቀጥላል-

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

የናሙናዎቹ ስብስብ በተደራጀ ቅደም ተከተል ይመለሳል።

### የማረጋገጫ ዳግም መልሶ ማጫወት {#verifier-replay}

ማረጋገጫ ሰጪው በመጀመሪያ የቡድን ግዴታውን እንደገና ያስከፍላል-

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

እና የሚከተሉትን ይጠይቃል:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

በተጨማሪም የህዝብ IO መልሶ መገንባት:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

እያንዳንዱ መስክ የማረጋገጫውን የህዝብ IO ባይት-ለ-ባይት ማዛመድ አለበት። ተቆጣጣሪው ከዚያ ተመሳሳይ ትራንስክሪፕትን እንደገና ይገነባል እና ተመሳሳይ ያወጣል:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

ለእያንዳንዱ የናሙና ጥያቄ `q` የሚከተሉትን ያረጋግጣል:

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

እና:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

የ AIR ቅጽ መክፈቻ ማረጋገጥ አለበት `R_air_composition`. የ FRI ከዚያም ሰንሰለት ተመሳሳይ ጀምሮ ይጀምራል `A_q` እና በተረጋገጠ የመጨረሻ ማጠናቀቂያ መጨረስ አለበት FRI ከታርሚናል በታች ያለው ቅጠል FRI ሥር.

## ምሳሌው የሚያረጋግጠው ነገር {#what-the-prover-checks}

ቅደም ተከተል ከመገንባቱ በፊት FastPQ ፕሮቨር በዝግጅት ቁልፍ ፣ በኦፕሬሽን ደረጃ እና በማስገባት ትዕዛዝ የቡድን ቅደም ተከተልን ያነቃቃል ። የማስተላለፊያ መስመሮች እንዲሁ የቅጂ መልዕክት ሜታዳታ ይጠይቃሉ። የትራንስፖርት መስመሮች ያሉት ነገር ግን የትራንስፍርድ ትራንስክሪፕቶች የሌሉበት ጭምር ልክ ያልሆነ ነው።

የዝውውር ትራንስክሪፕቶችን በተመለከተ፣ በዋናነት የሚደረጉ ምርመራዎች የሚከተሉትን ያካትታሉ፦

- የመላኪያ ሚዛኑ ዝቅተኛ ፍሰት ሊኖረው አይገባም
- `sender_after` በ `sender_before - amount` እኩል መሆን አለበት።
- `receiver_after` በ `receiver_before + amount` እኩል መሆን አለበት።
- ትራንስክሪፕቱ በጅምላው ውስጥ ያሉትን እያንዳንዱን የማስተላለፊያ ረድፍ መሸፈን አለበት
- የፖሲዶን ነጠላ-ዴልታ ዲጀስት ፣ በሚገኝበት ጊዜ ከትራንስክሪፕቱ ቅድመ ምስል ጋር የሚዛመድ መሆን አለበት።
- በርካሽ-ሜርክል ማስረጃዎች እንደ ስሪት 1 መከፈት አለባቸው፤ የጎደሉ መንገዶች በዴትሪሚኒስት ሲንተቲክ ማስረጃዎች የተሞሉ ናቸው።

መከታተያው ለዝውውር ፣ ለደብዳቤ ፣ ለመቃጠል ፣ ለክፍያ መስጠት ፣ ለክፍል መሰረዝ ፣ ለሜታዳታ ስብስብ እና ለፈቃድ ፍለጋ መስመሮች የተመረጡ አምዶች ይዟል። የቁጥር ክወና መስመሮች እንዲሁ የተፈረሙ ዴልታዎችን ፣ በአንድ ንብረት ላይ የሚሠሩ ዴልታን እና አቅርቦት ቆጣሪዎችን ይይዛሉ ።

## ፕሮፕሮ ሌይን {#prover-lane}

`irohad` የ FastPQ ፕሮቨር መስመሩን በጅምር ላይ ያስጀምራል ከሆነ የፕሮቨር ዳግም ማስጀመር ይቻላል. መስመሩ የተወሰነ ረድፍ ያለው የጀርባ ተግባር ነው ። አንድ ብሎክ የአፈፃፀም ምስክር ካወጣ በኋላ ፣ የኮሚት ዱካው የብሎክ ሃሽ ፣ ቁመት ፣ እይታ እና ምስክር ያሉትን የፕሮቬር ሥራ ያቀርባል ።

መስመሩ እየሰራ ካልሆነ ወይም ረድፉ ሞልቶ ከሆነ ሥራው ይተላለፋል እና መደበኛ የብሎክ ማቀነባበሪያ ይቀጥላል ። ይህ ማለት የጀርባ አመልካች መስመሩ የግብይት መግቢያ ወይም የስምምነት በር አይደለም ማለት ነው ፣ እሱ ቀድሞውኑ የተፈፀመበት የስቴት ላይ የመረጋገጫ ምርት መንገድ ነው።

የመንገድ መስመሩ የሚከተሉትን ያካትታል:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` አመልካቹ የሚገኘውን የጀርባ መጨረሻ እንዲመርጥ ያስችለዋል ። `cpu` ፒኖች አፈፃፀም ከ CPU ይመርጣል። `gpu` የተጠየቁትን ኮርኖችን መጠቀም በማይችልበት ጊዜ ወደኋላ በመመለስ CPU በ GPU አፈጻጸም ይመርጣል ።

## ማረጋገጫ {#verification}

FastPQ ማስረጃ ማረጋገጫ የካኖኒካል ጭነት ግዴታውን እንደገና ይገነባል እና የህዝብ ትራንስክሪፕትን ይደግፋል ። ተረጋግጣቢው የፕሮቶኮል ስሪት ፣ የፓራሜትር ስብስብ ስሪት ፣ የመልሶ ማጫወት ገደቦች ፣ የመከታተያ ግዴታ ፣ የሕዝብ ግብዓቶች ፣ የተመረጡ ሜርክል ክፍተቶች ፣ AIR ክፍተቶች እና FRI የጥያቄ ሰንሰለት ያረጋግጣል ።

ነባሪ የመልሶ ማጫወት ገደቦች የሚከተሉትን ያካትታሉ:

|ገደብ|ነባሪ |
| ------------------ | ------: |
|የሽግግር ረድፎች |     256 |
|የጅምላ አጠቃቀም መጠን |256 KiB |
|FRI ደረጃዎች |      16 |
|መጠይቅ ክፍት ቦታዎች |     128 |

## Nexus የተረጋገጡ ተለጣፊዎች {#nexus-verified-relays}

Nexus AXT የማረጋገጫ ፖስታዎች አንድ `AxtFastpqBinding`. መቼ ነው `RegisterVerifiedLaneRelay` ይፈጽማል፣ Iroha:

1. የመንገድ ተለጣፊ ሽፋን እና FastPQ የመከላከያ ቁሳቁስ ያረጋግጣል ።
2. የውሂብ ክፍተቱን እና የመግለጫውን ሥር ይፈትሻል
3. የ AXT ማስረጃ ፖስታን ይገልጻል
4. አንድ `fastpq_binding` ይጠይቃል
5. የ FastPQ ጭነት ከዛ አገናኝ እንደገና ይገነባል
6. የተካተተውን FastPQ ማስረጃ ይገልጻል።
7. የ FastPQ ማረጋገጫ ሰጪው እንደገና በተገነባው ጭነት እና ማስረጃ ላይ ይደውላል

ማረጋገጫው ከተሳካ፣ Iroha የሚከማቹ ሀ `VerifiedLaneRelayRecord` የሪሌይ ማጣቀሻ ፣ ኦሪጅናል ፖስታ ፣ የማረጋገጫ ጥቅማጥቅሞችን ሃሽ ፣ የማረጋገጥ ቁመት ፣ የመግለጫ ሥር እና FastPQ የሚጣበቅ።

የመንገድ ተለጣፊ ፖስታዎች እንዲሁ የታመቀ FastPQ ማረጋገጫ ቁሳቁስ ይይዛሉ ። ቁሳቁሱ የመንገድ መታወቂያ ፣ የውሂብ ቦታ መታወቂያ ، የብሎክ ከፍታ ፣ የማረጋገጫ ከፍታ ፣ የብሎክ ራስጌ ሃሽ ፣ የሰፈራ ሃሽ እና የማኒፌስት ዎርት ላይ ዳይጀስት ነው ። አንድ ተለጣፊ QC እና ትክክለኛ FastPQ ማረጋገጫ ቁሳቁስ ሲኖረው ብቻ ተቀባይነት ያለው ነው.

### AXT አስገዳጅ ሒሳብ {#axt-binding-math}

ለ Nexus AXT ፖስታዎች, `AxtFastpqBinding` ማስረጃ ዳግም ከማስገባት በፊት ካኖኒካዊ ነው. ባዶ መለኪያ እሴቶች በነባሪ ወደ `fastpq-lane-balanced`; ባዶ ማረጋገጫ መታወቂያ እና ስሪት ነባሪ ወደ `fastpq` እና `v1`; የይገባኛል ጥያቄ አይነት ተቆርጦ ታችኛው ደረጃ ላይ ይደረጋል.

የ AXT FastPQ የህዝብ ግብዓቶች የተወሰኑ ባይት ሃሽ ናቸው-

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

AXT የሽግግር ቁልፎች የሚከተሉት ናቸው፦

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

በ `authorization` የይገባኛል ጥያቄ ውስጥ የክፍያ ማረጋገጫ ረድፍ ይካተታል:

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

የ `compliance` የይገባኛል ጥያቄ ሁለት ሜታዳታ ረድፎችን ያስገባል- አንደኛው ለፖሊሲ እና ሌላኛው ለዒላማው የውሂብ ጎራዎች።

ለ `tx_predicate` እና `value_conservation` ፣ አንድ አስገዳጅነት አዎንታዊ ምንጭ ወይም መድረሻ መጠን ካለው ግልፅ ተጽዕኖ መጠን ጥቅም ላይ ይውላል ። አለበለዚያ ኮዱ የተወሰነ የመወሰን መጠን ያገኛል-

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

ከዚያም ተመሳሳይ የማስተላለፊያ እኩልነቶች ጥቅም ላይ ይውላሉ:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

የተላኪ እና ተቀባይ መለያ መታወቂያዎች ከቁልፍ ዘሮች የተፈጠሩ ናቸው-

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

የዝውውር ጭነት ሃሽ:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

የ AXT የቡድን መገለጫ ማጣሪያ SHA-256 በ Norito የካኖኒካል አገናኝ ኮዲንግ:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP ግልፅ መልዕክት ማስረጃዎች {#sccp-transparent-message-proofs}

የ SCCP ረዳት ሳጥን ደግሞ ይጠቀማል FastPQ ለንጹህ መስቀል ሰንሰለት መልዕክት ማስረጃዎች ይህ መንገድ ከ `irohad` የጀርባ ፕሮቨር ሌን. FastPQ ጭነት በቀጥታ ከ SCCP መልዕክት ማረጋገጫ ጥቅል እና መገለጫ, ከዚያም ክፍት ማረጋገጫ ለማግኘት የተገኘው ማስረጃ ይሸፈናል.

የ SCCP ክምችት `fastpq-lane-balanced` እና ሦስት ሜታዳታ ሽግግርን ይጠቀማል-

|ቁልፍ|እንቅስቃሴ |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

የህዝብ ግብዓቶች ከ SCCP ግልፅ የውስጥ ማስረጃ የተገኙ ናቸው:

|FastPQ ግብዓት |SCCP ምንጭ |
| ------------- | ---------------------------------------------------------- |
|`dsid` |የመጀመሪያዎቹ 16 ባይት የ Blake2b አቃፊ መግለጫ ላይ ሃሽ |
|`slot` |የፍጻሜ ቁመት |
|`old_root` |የዋጋ ጭነት ሃሽ|
|`new_root` |ቁርጠኝነት |
|`perm_root` |የመጨረሻነት ብሎክ ሃሽ |
|`tx_set_hash` |መግለጫ ሃሽ |

የ SCCP ካኖኒካል ኢንኮደሮች አነስተኛ-ኢንጂያን ሙሉ ቁጥሮችን ይጽፋሉ እና ተለዋዋጭ ርዝመት ያላቸው ባይት ማሰሪያዎችን እንደሚከተለው ያካትታሉ:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

ግልፅ የህዝብ ማስገቢያ ባይት ሰንጠረዥ:

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

ግልፅ መግለጫ ባይቶች የዝግጅት አቀራረብ ፣ ሰንሰለት ቤተሰብ ፣ አካባቢያዊ እና የባልደረባ ጎራዎች ፣ የደህንነት ሞዴል ፣ የአንከር አስተዳደር ፣ የመለያ ኮዴክ ፣ የፍፃሜ ሞዴል ، የማረጋገጫ ዓላማ ፣ የማረጋገጫ ዳግም-መጨረሻ ቤተሰብ ፣ ርዝመት የተወሰነ ሰንሰለት / ዳግም-ማረጋገጫ / መገለጫ መስኮች ፣ መድረሻ አስገዳጅ ሃሽ ፣ የሂሳብ ኮዴክ ቁልፍ, ጠቃሚ ጭነት አይነት, የህዝብ ግብዓት ባይት, እና ጠቃሚ ጭነት ሃሽ. መግለጫ ሃሽ ነው:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

ለዚህ የማረጋገጫ መንገድ FastPQ የመረጃ ቦታ መታወቂያ ከሌላ ቅድመ-የተቀመጠ የ Blake2b ዳይጀስት የመጀመሪያዎቹ 16 ባይት ነው ።

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

የ SCCP FastPQ ጭነት በትክክል:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

ከዚያ በኋላ በተመሳሳይ FastPQ ትዕዛዝ ደንብ መሠረት ይደረጋል.

የ OpenVerify ተቆጣጣሪ ግዴታ በ SHA-256 ላይ ባለው SCCP መልዕክት ጀርባ ስም እና በካኖኒካል FastPQ ተቆጣጣሪ መግለጫ ላይ ነው-

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

ጥሬው FastPQ ማስረጃው Norito-በአንድ `StarkFriOpenProofV1`, ከዚያም በሳጥኑ ውስጥ የተጠቀለለ `OpenVerifyEnvelope` ከጀርባ አወጣጥ ጋር `Stark`. SCCP ማረጋገጫ ተመሳሳይ መልሶ ይገነባል FastPQ ከቡድን እና ማኒፌስት የተወሰደ ክምችት, ክፍት የማረጋገጫ ፖስታ ሜታዳታዎችን ያረጋግጣል, እና FastPQ በተገነባው ጭነት ላይ ያለው ማረጋገጫ እና ማስረጃ።

## የፓራሜትር ስብስቦች {#parameter-sets}

የካኖኒካል ፓራሜትር ካታሎግ ሁለት የፓራሜትር ስብስቦችን ይገልጻል። በአሁኑ ጊዜ አስተናጋጅ ፕሮቨር ሌን `fastpq-lane-balanced` ን ይጠቀማል ።

|መለኪያ |ዓላማ|መስክ |ሃሽስ |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |ሚዛናዊ የፕሮቨር ፍሰት |የወርቅ ብልጭታዎች አራተኛ ቅጥያ |የ Poseidon2 ግዴታዎች ፣ ካታሎግ SHA3 መለያ |ክፍል 8፣ ፍንዳታ 8, 46 ጥያቄዎች |
|`fastpq-lane-latency` |መዘግየት-ተኮር ጎዳናዎች |የወርቅ ብልጭታዎች አራተኛ ቅጥያ |የ Poseidon2 ግዴታዎች ፣ ካታሎግ SHA3 መለያ |ክፍል 16፣ ፍንዳታ 16፣ 34 ጥያቄዎች |

ሁለቱም የ 128-ቢት ደህንነትን ያነጣጥራሉ እና የመከታተያ ጎራ መጠን `2^16` ይጠቀማሉ ። የ Rust V1 ትራንስክሪፕት መልሶ ማጫወት ኮድ በአሁኑ ጊዜ በቀጥታ ወደ SHA3-256 ከመጥራት ይልቅ በ `iroha_crypto::Hash::new` ውስጥ የፊያት-ሻሚር ፈተና ባይቶችን ያስገኛል.

በ Rust ማረጋገጫ የተጠቀሙት ትክክለኛ የካታሎግ ቋሚዎች የሚከተሉት ናቸው:

|ቋሚ |`fastpq-lane-balanced` |`fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
|`target_security` |                    128 |                   128 |
|`grinding_bits` |                     23 |                    21 |
|`trace_log_size` |                     16 |                    16 |
|`trace_root` |`0x002a247f81c6f850` |`0x6a9f4eb38fb9b892` |
|`lde_log_size` |                     19 |                    20 |
|`lde_root` |`0x60263388dbbf9b2a` |`0x9c9c3a571b6f89ac` |
|`permutation_size` |                 65,536 |                65,536 |
|`lookup_log_size` |                     19 |                    20 |
|`omega_coset` |`0x6af325e825ad5c18` |`0x3a5fd4171e3c3a4d` |
|`fri_arity` |                      8 |                    16 |
|`fri_blowup` |                      8 |                    16 |
|`fri_max_reductions` |                      8 |                     6 |
|`fri_queries` |                     46 |                    34 |

## ውቅር {#configuration}

የ FastPQ ውቅር በ `zk.fastpq` ስር ተጣብቋል።

```toml
[zk.fastpq]
execution_mode = "auto"
poseidon_mode = "auto"

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

ተመሳሳይ አፈፃፀም እና የቴሌሜትሪ መለያዎች ከ `irohad` ሊሻሩ ይችላሉ-

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

የአካባቢ ተለዋዋጮች ለኮንፊግሬሽን መስኮችም ይደገፋሉ። ለ FastPQ የተወሰኑ ተለዋዋጮችን ያካትታሉ:

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

ቴሌሜትሪ ሲፈቀድ FastPQ የጀርባ ማረፊያ ምርጫ እና ሜታል ሩጫ ባህሪ መለኪያዎችን ያወጣል-

|ሜትሪክ |ትርጉም|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |የተጠየቀ እና የተፈታ አፈፃፀም ሁነታ በ backend እና በመሣሪያ መለያዎች |
|`fastpq_poseidon_pipeline_total` |የተጠየቀ እና የተፈታ የፖሲዶን ቧንቧ መስመር መንገድ|
|`fastpq_metal_queue_depth` |የብረት ረድፍ ገደብ ፣ ከፍተኛው በረራ ውስጥ ብዛት ፣ የመላኪያ ብዛት እና ናሙና መስኮት |
|`fastpq_metal_queue_ratio` |የብረታ ብረት ረድፍ የተጨናነቀ እና የመጋፈጥ ሬሾዎች |
|`fastpq_zero_fill_duration_ms` |ለሜታል ሩጫዎች የአስተናጋጅ ዜሮ-ሙሌት ጊዜ |
|`fastpq_zero_fill_bandwidth_gbps` |የተወሰደ የዜሮ ሙሌት ባንድዊድዝ |

ለአጠቃላይ የአፈፃፀም ማጣሪያ በ [አፈፃፀምና መለኪያዎች ](/am/guide/advanced/metrics.md) ውስጥ ከተዘረዘሩት የጋራ ስምምነት እና ረድፍ ምልክቶች ጋር ይጠቀሙ።

## ተዛማጅ ማጣቀሻ {#related-reference}

- [ለተፈጠሩ አይነት ዝርዝሮች የውሂብ ሞዴል መርሃግብር ](/am/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ አማራጮች](/am/reference/irohad-cli.md#arg-fastpq-execution-mode)
