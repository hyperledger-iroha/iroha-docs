---
translation_locale: am
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ ነው Iroha ነው STARK የተመረጡ አፈፃፀም ውጤቶች ለማግኘት የማረጋገጫ መንገድ.
መደበኛ የግብይት አፈፃፀም ወይም ስምምነት አይተካም።
በመሮጥ ISI, IVM, እና Sumeragi እንደተለመደው፤ FastPQ የሚጠጣው
የተረጋገጠ አፈፃፀም ምስክር እና የሚደገፉ ውጤቶችን ወደ ማስረጃ ይለውጣል
ጭነቶች።

የአሁኑ አስተናጋጅ ውህደት ሶስት ዋና መንገዶች አሉት

- በብሎክ አፈፃፀም ወቅት የተመዘገቡ ግልጽ ቁጥራዊ የንብረት ዝውውሮች
- Nexus የተረጋገጡ የመንገድ ሪሌዎች AXT የመረጃው ፖስታ አንድ FastPQ
  አስገዳጅ
- SCCP ግልጽ መልዕክት መከላከያ ረዳቶች FastPQ ማስረጃ በ
  ክፍት የማረጋገጫ ፖስታ

## የይሖዋ ምሥክርነት መንገድ {#transfer-witness-path}

ግልፅ የቁጥር ዝውውሮች የተዋቀረ የዝውውር ትራንስክሪፕት ይፈጥራሉ
መመሪያው ሚዛኑን ይለውጣል።

- የመነሻ ሂሳብ፣ የዕጣ ፈንታ ሂሳብ፣ የአክሲዮን ማብራሪያና መጠን
- ከመተላለፉ በፊት እና በኋላ የተላኪው እና ተቀባዩ ሚዛን
- የፓች ሃሽ ሆኖ ጥቅም ላይ የሚውለው የግብይት መግቢያ ነጥብ ሃሽ
- ከመስጠት ሂሳቡ የተገኘ ባለሥልጣን መረጃ
- የፖሲዶን ትራንስክሪፕቶች ለስላሳ ዴልታ

የቡድን ማስተላለፍ ከአንድ ተለጣፊ ጽሑፍ ጋር በርካታ ዴልታዎችን ይጠቀማል
የፖሲዶን ነጠላ-ዴልታ ዲስጀስት የለም።

በብሎክ ፍፃሜ ላይ, Iroha እነዚህን ትራንስክሪፕቶች በመግቢያ ነጥብ ሃሽ ይመድቡ.
ከዚያም የፍርድ ምስክር የኦሪጂናል ትራንስክሪፕት ጥቅሎችንና
የ FastPQ ለፕሮቨር የተዘጋጁ የሽግግር ጭነቶች።

እያንዳንዱ ማስተላለፊያ ዴልታ ሁለት የሽግግር ረድፎች ይሆናል:

| ረድፍ             | ቁልፍ ቅርጽ                                        | ቅድመ እሴት               | ከዋጋ በኋላ             |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
| የመላኪያ ክፍያ    | `asset/<asset-definition>/<source-account>`      | ከመላኪያ ሚዛን በፊት   | የመላኪያ ሚዛን   |
| ተቀባይነት ያለው ብድር | `asset/<asset-definition>/<destination-account>` | ተቀባዩ ሚዛን በፊት | ተቀባዩ ሚዛን |

የቁጥር እሴቶች ወደ ሙሉ ቁጥር ምስክር አሃዶች መደበኛ ናቸው.
የተከለከሉ FastPQ እንደ አሉታዊ ያልሆነ መገለጽ ካልቻሉ
`u64` በተመረጠው አስርኛ ደረጃ ላይ።

## የሕዝብ ግብዓት {#public-inputs}

ሁሉም FastPQ የሽግግር ጭነት ማስረጃውን ወደ
የብሎክ እና አፈፃፀም አውድ:

| ማስገቢያ         | ትርጉም                                                         |
| ------------- | --------------------------------------------------------------- |
| `dsid`        | እንደ አነስተኛ-አንድያን ባይት የተመሰጠረ የመረጃ ቋት መታወቂያ             |
| `slot`        | የብሎክ ፈጠራ ጊዜ ወደ ናኖ ሰከንዶች ተቀይሯል                    |
| `old_root`    | ከፈፃሚው ምስክር የተገኘ የወላጅነት ሥር            |
| `new_root`    | ከስህተቱ ምስክር የተገኘ የፖስታ ግዛት ሥር              |
| `perm_root`   | የፖሲዶን ተሳትፎ በሥራ ላይ የተሰማሩ ፍቃዶች                |
| `tx_set_hash` | በደረጃ የተቀመጡ ግብይቶች እና የጊዜ ማስነሳት የመግቢያ ነጥብ ሃሽዎች ላይ ሀሽ |

አስተናጋጁ የሚጠቀምበት `fastpq-lane-balanced` እንደ ካኖኒካል መለኪያ ለ
እነዚህ ጭነቶች።

## የሂሳብ ሞዴል {#mathematical-model}

ይህ ክፍል የአሁኑ ተግባራዊ የሂሳብ መግለጫ ይገልጻል Rust
ሁሉም የመስክ ሥራዎች ከታች በወርቅ ነጣቂዎች ላይ ናቸው
ዋና መስክ:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ Poseidon2 ን ይጠቀማል `F` ለሜዳ ግዴታዎች ስፋት ያለው ስፖንጅ
`t = 3`, ተመን `r = 2`, እና አቅም `1`. የሃሽ መስክ ንጥረ ነገሮች ውስጥ የሚወስድ
ደረጃ-2 ብሎኮች እና አንድ መስክ አባል ይጨምራል `1` ከፊናው በፊት
መለዋወጥ

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

የባይት ገመዶች በ 7 ባይት አነስተኛ የእንጀራ አጥንቶች ውስጥ የተሸከሙ ናቸው ስለዚህ እያንዳንዱ እግር ነው
በጥብቅ ከዚህ በታች `p`:

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

በባይት ጎራዎች ውስጥ የሚጀምሩ ሃሽዎች, FastPQ የመጀመሪያዎቹን ስምንት ካርታዎች
ወደ ሜዳው ውስጥ አነስተኛ-ኢንዲያን ባይት:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

እዚህ . `Hash` አማካይ Iroha ነው `iroha_crypto::Hash::new`, የ 32 ባይት Blake2bVar
በፎሲዶን2 ወይም SHA-256.

### የመስክ ሒሳብ {#field-arithmetic}

የ Rust ኮድ የመስክ ንጥረ ነገሮችን እንደ መደበኛ ይወክላል `u64` ውስጥ እሴቶች
`[0,p)`. መጨመር እና መቀነስ የሚከተሉት ናቸው:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

ማባዛት በመጀመሪያ የ 128 ቢት ምርቱን ያስከፍላል-

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

ከዚያም የወርቅ ነጠብጣብ መቀነስ ማንነት ይጠቀማል:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

የሚከተሉትን ነገሮች ካደረጉ

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

ከዚያ መቀነሻው ይሰላል፡-

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

አተገባበሩ በሁኔታዎች ይጨምራል ወይም ይወስዳል `p` ውጤቱ እስከሚደርስ ድረስ
የተፈረሙ ሙሉ ቁጥሮች፣ ለምሳሌ የባላንስ ዴልታዎች፣ የሚከተሉትን ያካተቱ ናቸው፦

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### የፖዚዶን2 ለውጥ {#poseidon2-permutation}

የፖዚዶን2 መለዋወጥ ሁኔታ:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

ኤስ-ቦክስ:

$$
S(x)=x^5
$$

FastPQ አራት ሙሉ ዙር, አምሳ ሰባት ክፍልፋይ ዙሮች ይጠቀማል, ከዚያም አራት ተጨማሪ
ሙሉ ዙር. ሙሉ ዙር ከዙሪያ ቋሚዎች ጋር
`c_r = (c_{r,0}, c_{r,1}, c_{r,2})` ነው:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

የተወሰነ ዙር:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

ሁሉም ተጨማሪዎች እና ማባዛት `F`. የካኖኒክ MDS ማትሪክስ:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

የመስክ ሃሽ ከዜሮ ሁኔታ ይጀምራል. ለእያንዳንዱ የተሟላ መጠን-2 ብሎክ
`(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

የመጨረሻው ክንድ `1` ከመጨረሻው በፊት የሽፋን አካል
ውፅዓት ነው `x_0`.

### የሕዝብ ግብዓት ግዴታ {#public-input-binding}

አስተናጋጁ የውሂብ ቦታ መታወቂያውን በመጻፍ ይኮድ `u64` ዋጋ ወደ የመጀመሪያው
የ 16 ባይት መስክ ስምንት አነስተኛ-ኢንዲያን ባይት:

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

የግብይት ስብስብ ሃሽ በተደረደረው የመግቢያ ነጥብ ላይ ባይት-ዶሜይን ሀሽ ነው
ሃሺስ:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

የት `h_i` የተደረደሩ ግብይቶች እና የጊዜ ማስነሳት የመግቢያ ነጥብ ሃሽዎች ናቸው.
የሕዝብ ማስረጃ IO, ከሆነ `perm_root` ወይም `tx_set_hash` ሁሉም ዜሮ ነው,
Prover የወደፊት እሴቶች ይሞላል:

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

ለእያንዳንዱ ማስተላለፍ ዴልታ የዒላማ አሥርተኛ ደረጃ ከፍተኛው የተቆረጠ ነው
በዋጋው ላይ ያለው መጠን እና ሁለቱም ሚዛን ቅጽበታዊ ገጽ እይታዎች

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

ሀ `Numeric` ዋጋ ከማንቲሳ ጋር `m` እና መጠኑ `q` የሚቀበለው
`m >= 0` እና `q <= s`. የእሱ FastPQ የምስክርነት እሴት:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

የተለመደው ውጤት `u64`.

### የካኖኒክ ትዕዛዝ {#canonical-ordering}

ከትራስ ግንባታ በፊት ጭነት በዝግጅት ቁልፍ ፣ ሥራ ይደረጋል
ደረጃ እና የመጀመሪያ ማስገቢያ መረጃ ጠቋሚ:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

ትዕዛዝ ግዴታ ጎራ ላይ Poseidon2 መስክ ሃሽ ነው
`fastpq:v1:ordering` እና Norito የደረጃ ሽግግሮች ኮድ ማድረግ

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

የት `P` የ 7 ባይት ማሸጊያ ነው `E` ነው Norito ኮድ ማድረግ፣ `D_o` ነው
`fastpq:v1:ordering`, እና `T*` የተደራጀ የሽግግር ዝርዝር ነው።

### የማስተላለፍ እኩልነቶች {#transfer-equations}

ለሽያጭ መጠን `a`, የመላኪያ ሚዛን `f`, እና ተቀባዩ ሚዛን `t`,
FastPQ የሥልጣኑን ማቋቋም ከመጀመሩ በፊት የተለመዱ የምስክር እሴቶችን ያረጋግጣል-

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

ከዚያ የሽግግር ረድፎች የሚከተሉትን ያካትታሉ:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

በሥልጣኑ ውስጥ የተፈረሙ ዴልታዎች ወደ `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

አማራጭ ነጠላ-ዴልታ ማስተላለፊያ ዳይጀስት የኮድ የተደረገውን ማስተላለፍ ያከናውናል
ቅድመ ምስል:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

ባለብዙ ዴልታ ማስተላለፍ ትራንስክሪፕቶች, የአሁኑ ቅርጸት የሚከተለውን ይጠይቃል
ከፍተኛ ደረጃ ያለው የምግብ መፍጨት አለመኖር።

የማስተናገድ ባለሥልጣኑ ለዝውውር ትራንስክሪፕቶች የሚወስደው:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### የሥልጣኔ መስመሮች {#trace-rows}

የተደራጀው የሽግግር ዝርዝር ይኑርህ `n` እውነተኛ ረድፎች.
የሁለት ቀጣዩ ኃይል:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

ረድፎች `0..n-1` ንቁ ናቸው፤ ረድፎች `n..N-1` እያንዳንዱ እውነተኛ ረድፍ
አንድ የአሠራር ምርጫ ስብስብ:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

ሁሉም የመምረጥ አምዶች ቡል ናቸው:

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

ግንባታው ደግሞ በአንድ ንብረት ላይ የሚንቀሳቀሱትን ዴልታዎች ይከታተላል

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

የአቅርቦት መለኪያውን የሚያዘምኑት የዜና እና የማቃጠል ረድፎች ብቻ ናቸው

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

ሜታዳታ እና የውሂብ ቦታ ዱካ አምዶች ከመስመር በፊት የተገኙ የመስክ ሃሽዎች ናቸው
ማግኛ:

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

የሜታዳታ ሃሽ, የመረጃ ቦታ ሃሽ, እና ማስገቢያ አጠገብ ላይ የተረጋጋ ናቸው
የመከታተያ ረድፎች

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

የማስተላለፊያ መስመሮች የ 32 ደረጃን ያነሰ ሜርክል ዱካ ይይዛሉ።
የጎደለው ከሆነ, አመልካቹ ከመስመር ቁልፍ አንድ የተወሰነ መንገድ ያጠናቅቃል,
የቅድመ ሚዛን ፣ እና ረድፉ የመላኪያ ወይም ተቀባይ ወገን እንደሆነ።

ለሲንቴቲክ ዱካዎች የቅመማ ጨው `fastpq:smt:from` ለተላኪ ወረቀቶች
እና `fastpq:smt:to` ለተቀባዩ ረድፎች:

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

ትራሱ የትንሽውን ክፍል ይመዝግባል። `b_l`, ወንድማማች `s_l`, የመግቢያ መስመሮች `x_l`, እና
የውጤት አንጓ `x_{l+1}` በኮድ ቅርንጫፍ ስምምነት:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### የመፍቀድ ሃሽ {#permission-hashes}

ሚና መስጠት እና መሰረዝ ረድፎች የፍቃድ ምስክር ሃሽ:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

የአስተናጋጅ ፍቃድ ሰንጠረዥ ሥር ግቤቶችን በድርሻ ባይት ፣ ፈቃድ ይለያል
ባይት, እና epoch ባይት, ከዚያም Poseidon2 Merkle ዛፍ ይገነባል:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

ያልተለመደ ስፋት ደረጃዎች የመጨረሻውን ንጥረ ነገር ይደግፋሉ.

### የሥልጣኔ አጠባበቅ {#trace-commitment}

ለእያንዳንዱ የመከታተያ አምድ `c`, FastPQ በመጀመሪያ የ አምድ እሴቶችን በ
የቅደም ተከተል ጎራ እና ሃሺዎች የቁጥር ቬክተር:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

የመከታተያ ሥሩ በኮሎና ግዴታዎች ላይ የ Poseidon2 Merkle ሥር ነው:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

የመጨረሻው የክትትል ግዴታ ጎራ ላይ ባይት ሃሽ ነው, መለኪያ ስብስብ,
የአሻራ ቅርፅ ፣ የድረ ገጾች መፍጨት እና የአሻራ ሥር:

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

የ V1 AIR የተዋሃደ እሴት የሰንጠረዥ-አካባቢ ቀሪዎችን መስመራዊ ጥምረት ነው ።
የጽሑፍ ቅጂው ሁለት ፈተናዎችን ያጠቃልላል

$$
\alpha_0,\alpha_1 \in F
$$

ለእያንዳንዱ ተጓዳኝ ረድፍ ጥንድ `(i,i+1)`, አመልካቹ እንደሚከተለው ያሰላስላል:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

ቀሪዎቹ `rho` በኮድ ቅደም ተከተል የሚከተሉት ናቸው:

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

እና የተረጋጋ የቡድን አውድ አምዶች:

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

አረጋግጣቢው እንደገና ይለካል `A_i` ለናሙና የተወሰዱ ረድፍ ክፍተቶች እና ምርመራዎች
በ AIR ጥንቅር ሜርክል
ሥር.

### የምርት ፍለጋ {#lookup-product}

የፈቃድ ፍለጋ አከባቢው የፊያት-ሻሚር ፈተና ይጠቀማል `gamma`.
በዝቅተኛ ደረጃ ማራዘሚያ ግምገማዎች ላይ `s_perm` እና `perm_hash`, የ
የሚሰራው ምርት፡-

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

ማስረጃዎቹ:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### ዝቅተኛ-ደረጃ ማራዘሚያ {#low-degree-extension}

ይፍቀዱ `omega_T` የክትትል ጎራ ማመንጫ መሆን፣ `omega_E` የ
የግምገማ ጎራ ማመንጫ እና `g` የተዋቀረው ኮሴት ኦፕሰት።
እሴቶችን የያዘው የመከታተያ አምድ `v_i`, ኢንተርፖላሲንግ የኮኢንፌክሽኖችን ያስገኛል `a_j`
እንዲህ ዓይነት:

$$
f(\omega_T^i)=v_i
$$

ዝቅተኛ-ደረጃ ማራዘሚያ በኮሴት ላይ ተመሳሳይ ፖሊኖሚየልን ይገመግማል:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

አተገባበሩ ይህንን የሚቆጣጠር በኮኢንፌክሽነሮች በሥልጣኖች በማባዛት ነው
ከቀድሞው የኮሴት ማካካሻ FFT:

$$
a'_j = a_j g^j
$$

እና ከዚያም ግምገማ `a'` በግምገማው መስክ ላይ።

የ CPU FFT አንድ ተደጋጋሚ ራዲክስ-2 Cooley-Tukey ትራንስፎርሜሽን ነው
በ bit-reversed ግብዓቶች. `L`, ግማሽ ርዝመት `H=L/2`, እና መድረክ
ሥር:

$$
\omega_L=\omega^{N/L}
$$

እያንዳንዱ ሽንኩርት ይመረታል:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

በተቃራኒው FFT ጋር ተመሳሳይ ትራንስፎርሜሽን ይሰራል `omega^{-1}` በመለኪያውም
የተቃራኒ የጎራ መጠን:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

ካታሎግ ሥር ከመጠቀምዎ በፊት ይረጋገጣል

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

### ረድፍ እና ቅጠል ሃሽ {#row-and-leaf-hashes}

በኋላ LDE, FastPQ በሁሉም ላይ እያንዳንዱ ረድፍ ይለያል LDE አምዶች `m` አምዶች:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

ረድፍ ሃሽዎች ከመገምገም ይልቅ አሁንም በቅደም ተከተል ጎራ ላይ ናቸው ከሆነ
ጎራ, የ prover interpolates እና ነጠላ ረድፍ-ሃሽ አምድ ያስፋፋል
ተመሳሳይ ኮሴት ያለው LDE ሂደት.

### የሜርክል ክፍተቶች {#merkle-openings}

LDE እሴቶቹ የሚከተሉትን ቁርጥራጮች ይይዛሉ:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

እያንዳንዱ ቅጠል እንዲህ ይላል፦

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

የሜርክል ወላጆች:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

ያልተለመዱ ደረጃዎች የመጨረሻውን አገናኝ ይደግፋሉ. መጠይቅ መንገዶች በግራ ወይም
በየደረጃው ባለው የጥያቄ ወረቀት ማውጫ እኩልነት መሠረት።

ለጣቢያው ቅጠል `i`, መንገድ `(s_0,\ldots,s_{d-1})` ይረጋገጣል
ሥር `R` በተደጋጋሚ ጊዜ:

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

AIR የተለዩ ወረቀቶች የሚከተሉት ናቸው-

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR ቅጠሎች የሚከተሉት ናቸው:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

የ LDE መጠይቅ መክፈቻ ደግሞ ግምገማ ኢንዴክስ ላይ የተከፈተውን እሴት ያረጋግጣል
`i` በተረጋገጠው ክፍል ውስጥ ይገኛል-

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI የመሰብሰቢያ {#fri-folding}

FRI ይደራጃል AIR የድርጅቱ ግምገማዎች `l`, የ
የጽሑፍ ናሙናዎች ፈተና `beta_l`. ንብርብሩ ወደ ብዙ የተሸፈነ ነው
እያንዳንዱ የአሪቲ መጠን ያለው ቡድን ወደ:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

የት `a` ነው FRI አሪቲ. ተቆጣጣሪው ለምርመራው ጥያቄ ሁሉ ያረጋግጣል
ሰንሰለት፡-

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

እና የተከፈቱትን ሁሉ ያረጋግጣል FRI በቡድኑ ላይ FRI ሽፋን
ሥር.

### የፊያት-ሻሚር ትራንስክሪፕት {#fiat-shamir-transcript}

የካኖኒካል ፓራሜትር ካታሎግ ትራንስክሪፕት ሃሽ እንደ SHA3-256.
የአሁኑ የፕሮቨር እና የማረጋገጫ አተገባበር ፈተና ባይቶችን ከ
`iroha_crypto::Hash::new`, ይህም የ 32 ባይት Blake2bVar ማጣሪያ ነው, ከዚያም
የመጀመሪያዎቹን ስምንት አነስተኛ-ኢንዲያን ባይት ወደ `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

ፈታኝ ጥሪዎች ሙሉውን አቃፊ ወደ ትራንስክሪፕት ሁኔታ ይጨምሩ.
ቅደም ተከተል:

1. የሕዝብ IO, የፕሮቶኮል ስሪት ፣ የአውታረመረብ ስሪት እና የአውታር ስም
2. LDE ሥር እና ፍለጋ ሥር
3. `gamma`
4. AIR ውህደት የሚፈጠሩ ችግሮች `alpha_0`, `alpha_1`
5. AIR የመከታተያ ሥር እና AIR የቅጽበት ሥር
6. ፍለጋ ታላቅ ምርት
7. FRI የደረጃ ሥሮች እና `beta_l` ተፈታታኝ ሁኔታዎች
8. የተመረጡ የጥያቄ መረጃ ጠቋሚዎች

መጠይቅ ናሙናዎችን በመውሰድ የ 32 ባይት ፈታኝ ቅጂዎችን እየቆየ እና እንደ
ትንሽ አንዲያን `u64` የተጠየቀውን ልዩ ቁጥር እስኪያገኝ ድረስ ቁራጮች
መረጃ ጠቋሚዎች

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

የናሙናዎቹ ስብስብ በተደራጀ ቅደም ተከተል ይመለሳል።

### የማረጋገጫ ዳግም መልሶ ማጫወት {#verifier-replay}

ማረጋገጫ ሰጪው በመጀመሪያ የፓርቱን ግዴታ እንደገና ያስቀምጣል-

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

እና የሚከተሉትን ይጠይቃል:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

በተጨማሪም ህዝብን እንደገና ይገነባል IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

እያንዳንዱ መስክ ከሙከራው የሕዝብ ብዛት ጋር ይዛመዳል IO በባይት-በባይት.
ከዚያም ተመሳሳይ ትራንስክሪፕት እንደገና ይሠራል እና ተመሳሳይ ነው:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

ለእያንዳንዱ የናሙና ጥያቄ `q`, ያረጋግጣል:

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

የ AIR ቅጽ መክፈቻ ማረጋገጥ አለበት `R_air_composition`.
የ FRI ከዚያም ሰንሰለት ተመሳሳይ ጀምሮ ይጀምራል `A_q` እና አንድ ውስጥ ማጠናቀቅ አለበት
የተረጋገጠ የመጨረሻ FRI ከታርሚናል በታች ያለው ቅጠል FRI ሥር.

## ምሳሌው የሚያረጋግጠው ነገር {#what-the-prover-checks}

ፍለጋውን ከመፍጠር በፊት FastPQ ፕሮቨር የቡድን ትዕዛዙን ይደነግጋል።
የሽግግር ቁልፍ, የአሠራር ደረጃ, እና ማስገቢያ ቅደም ተከተል.
የቅጂ መለኪያ ሜታዳታ ይጠይቃል። የማስተላለፊያ መስመሮች ያሉት ነገር ግን ማስተላለፍ የሌለው ጭነት
ትራንስክሪፕቶች ልክ ያልሆኑ ናቸው.

ለዝውውር ትራንስክሪፕቶች፣ የዋናነት ምርመራዎች የሚከተሉትን ያካትታሉ።

- የመላኪያ ሚዛኑ ዝቅተኛ ፍሰት ሊኖረው አይገባም
- `sender_after` እኩል መሆን አለበት `sender_before - amount`
- `receiver_after` እኩል መሆን አለበት `receiver_before + amount`
- የቅጂ መግለጫው በፓርቹ ውስጥ ያሉትን እያንዳንዱን የማስተላለፊያ ረድፍ ይሸፍናል
- የፖሲዶን ነጠላ-ዴልታ ትራንስክሪፕት ፣ በሚገኝበት ጊዜ ከጽሑፉ ጋር ይዛመዳል
  ቅድመ ምስል
- በትንሽ-ሜርክል ማስረጃዎች ውስጥ እንደ ስሪት 1 መከፈት አለበት; የጎደሉ መንገዶች
  በዴትሪሚኒስት ሲንቴቲክ ማስረጃዎች የተሞሉ

ትራሱ ለዝውውር ፣ ለጥሬ ገንዘብ ፣ ለማቃጠል ፣ ለክፍያ መስጠት ፣
ሚና መሰረዝ ፣ ሜታዳታ ስብስብ እና የመፈቀደላቸው ፍለጋ መስመሮች
ረድፎቹም የተፈረሙ ዴልታዎችን ይይዛሉ ፣ በአንድ ንብረት ላይ የሚሄዱ ዴልታዎች እና አቅርቦት
መቁጠሪያዎች.

## ፕሮቨር ሌይን {#prover-lane}

`irohad` ይጀምራል FastPQ የፕሮቨር ዳግም ማስጀመሪያ ላይ ከሆነ
መስመር አንድ የተወሰነ ረድፍ ጋር የጀርባ ተግባር ነው.
ብሎክ የፍርድ ምስክር ያወጣል፣ የኮሚቴው መንገድም የፕሮፌሰር ስራን ያቀርባል
የብሎክ ሃሽ፣ ቁመት፣ እይታ እና ምስክር የሚገኝበት።

የመንገድ መስመሩ ካልሰራ ወይም ረድፉ ከተሞላ ስራው ይተላለፋል
ይህ ማለት የጀርባ ፕሮቨር ጎዳና
ይህ የግብይት ተቀባይነት ወይም የመግባቢያ በር አይደለም።
ቀድሞውኑ የተፈፀመበት የአገሪቱ ሁኔታ ላይ መንገድ።

የመንገዱ መስመሮች የሚከተሉትን ያካትታሉ:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` አመልካቹ የሚገኝበትን የጀርባ ጫፍ እንዲመርጥ ያደርገዋል። `cpu` የፒን አፈፃፀም
ወደ CPU. `gpu` የሚመርጡት GPU አፈፃፀም CPU ወደ ኋላ
የጀርባው ክፍል የተጠየቁትን ኮርነሎች መጠቀም አይችልም።

## ማረጋገጫ {#verification}

FastPQ የምስክርነት ማረጋገጫ የካኖኒካል ጭምር ግዴታን እንደገና ይገነባል እና
የህዝብ ትራንስክሪፕትን ይደግፋል፤ አረጋግጣቢው የፕሮቶኮል ስሪት ያረጋግጣል፤
የፓራሜትር ስብስብ ስሪት፣ የመልሶ ማጫወት ገደቦች፣ የመከታተያ ተሳትፎ፣ የህዝብ ግብዓቶች፣
ናሙና የተወሰደባቸው የሜርክል ክፍተቶች፣ AIR ክፍተቶች እና FRI የጥያቄ ሰንሰለት።

በነባሪው የመልሶ ማጫወት ገደቦች የሚከተሉትን ያካትታሉ:

| ገደብ              | ነባሪ |
| ------------------ | ------: |
| የሽግግር ረድፎች    |     256 |
| የቡድን አጠቃቀም መጠን | 256 KiB |
| FRI ደረጃዎች         |      16 |
| መጠይቅ ክፍት ቦታዎች     |     128 |

## Nexus የተረጋገጡ ሪሌዎች {#nexus-verified-relays}

Nexus AXT የማረጋገጫ ፖስታዎች `AxtFastpqBinding`. መቼ
`RegisterVerifiedLaneRelay` ይፈጽማል፣ Iroha:

1. የመንገድ ተለጣፊውን ፖስታ ያረጋግጣል እና FastPQ የማረጋገጫ ቁሳቁስ
2. የውሂብ ክፍተቱን እና የመግለጫውን ሥር ይፈትሻል
3. የ AXT የምስክር ወረቀት
4. የሚጠይቅ `fastpq_binding`
5. እንደገና ይገነባል FastPQ ከዚያ ማያያዝ የተገኘ ጭነት
6. የተካተቱትን ይገልጻል FastPQ ማስረጃ
7. ጥሪዎችን FastPQ እንደገና በተገነባው ጭነት ላይ ያለው ማረጋገጫ እና ማስረጃ

ማረጋገጫው ከተሳካ፣ Iroha የሚከማቹ `VerifiedLaneRelayRecord`
የሬሌ ማጣቀሻውን ፣ የመጀመሪያውን ፖስታን ፣ የማረጋገጫ ጥቅማጥቅሞችን ሃሽ ይይዛል ፣
የማረጋገጫ ቁመት፣ የተገለጠ ሥር እና FastPQ ማያያዝ።

የመንገድ ተለጣፊ ፖስታዎችም እንዲሁ የታመቁ ናቸው FastPQ የማረጋገጫ ቁሳቁስ
የመንገድ መታወቂያ ፣ የመረጃ ቦታ መታወቂያ፣ የማገጃ ቁመት ፣ ማረጋገጫ
ከፍታ, ብሎክ ራስጌ ሃሽ, መቀመጫ ሃሽ, እና manifest ሥር.
ማዋሃድ የሚፈቀደው ሁለቱንም ካላቸው ብቻ ነው QC እና ተፈጻሚ FastPQ ማስረጃ
ቁሳቁስ

### AXT አስገዳጅ የሂሳብ ጥናት {#axt-binding-math}

ለ Nexus AXT ፖስታዎች፣ `AxtFastpqBinding` ማስረጃ ከመሰጠቱ በፊት ካኖኒካዊ ነው
ባዶ መለኪያ እሴቶች በነባሪ ወደ `fastpq-lane-balanced`; ባዶ
የማረጋገጫ መታወቂያ እና ስሪት በነባሪነት `fastpq` እና `v1`; የይገባኛል ጥያቄ አይነት ተቆርቋሪ ነው
ዝቅተኛ ደረጃዎችም አሉባቸው።

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

AXT የሽግግር ቁልፎች የሚከተሉት ናቸው-

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

የ `authorization` የይገባኛል ጥያቄ የክፍያ ማረጋገጫ ረድፍ ያስገባል

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

እና የማጽደቅ ፖሊሲን የሚያገናኝ ሜታዳታ ረድፍ። `compliance` ጥያቄ
ሁለት ሜታዳታ መስመሮችን ያስገባል- አንዱ ለፖሊሲ እና ሌላኛው ለዒላማ የውሂብ ጎራዎች።

ለ `tx_predicate` እና `value_conservation`, አንድ ግልፅ ውጤት መጠን ነው
አገናኙ አዎንታዊ ምንጭ ወይም መድረሻ መጠን ሲይዝ ጥቅም ላይ ይውላል ።
አለበለዚያ ኮዱ የተወሰነ የቁጥር መጠን ይወጣል

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

ከዚያም ተመሳሳይ የማስተላለፊያ ውፅዓቶች ጥቅም ላይ ይውላሉ:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

የተላኪ እና ተቀባይ መለያ መታወቂያዎች ከቁልፍ ዘሮች ይመነጫሉ

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

የማስተላለፊያ ባች ሃሽ የሚከተለው ነው

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

የ AXT የቡድን መገለጫ ዲጀስት SHA-256 በ Norito የ
የቅዱሳን መጻሕፍት ግዴታ:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP ግልጽ መልእክት ማስረጃዎች {#sccp-transparent-message-proofs}

የ SCCP ረዳት ሳጥን እንዲሁ ይጠቀማል FastPQ ለንጹህ ሰንሰለት ተሻጋሪ መልእክት
ይህ መንገድ ከ `irohad` የጀርባ አመልካች መንገድ.
ይገነባል FastPQ በቀጥታ ከአንድ SCCP መልዕክት ማስረጃ ጥቅል እና
ይገለጻል፣ ከዚያም የተገኘውን ማስረጃ ለግል ማረጋገጫ ይሸፍናል።

የ SCCP የቡድን አጠቃቀም `fastpq-lane-balanced` እና ሶስት ሜታዳታ ሽግግር:

| ቁልፍ                             | አሠራር |
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

የህዝብ ግብዓቶች ከ SCCP ግልፅ የውስጥ ማስረጃ:

| FastPQ ግብዓት  | SCCP ምንጭ                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        | በመጀመሪያው 16 ባይት የ Blake2b በማጣራት ላይ መግለጫ ሃሽ |
| `slot`        | የፍጻሜ ቁመት                                            |
| `old_root`    | የዋጋ ጭነት ሃሽ                                               |
| `new_root`    | የተሳትፎ ሥር                                            |
| `perm_root`   | የመጨረሻነት ብሎክ ሃሽ                                        |
| `tx_set_hash` | መግለጫ ሃሽ                                             |

የ SCCP ቀኖናዊ encoders አነስተኛ-ኢንዲያና ሙሉ ቁጥሮች ይጽፋሉ እና encode
ተለዋዋጭ ርዝመት ያላቸው ባይት ማሰሪያዎች የሚከተሉት ናቸው

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

ግልፅ የህዝብ ግብዓት ባይት ገመድ የሚከተለው ነው:

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

ግልፅ መግለጫ ባይቶች ስሪት, ሰንሰለት የ concatenation ናቸው
የቤተሰብ፣ አካባቢያዊ እና የደንበኛው ደንበኛ ጎራዎች፣ የደህንነት ሞዴል፣ የመሠረት አስተዳደር፣
የሂሳብ ኮዴክ፣ የፍጻሜ ሞዴል፣ የማረጋገጫ ተልእኮ፣ የማረጋገቂያ ጀርባ ቤተሰብ፣
ረዥም-ቅድመ ተወስኖ የተቀመጠ ሰንሰለት/ጀርባ ጫፍ/የተገለጸ መስኮች፣ የመድረሻ አገናኝ ሃሽ፣
የሂሳብ ኮዴክ ቁልፍ, ጠቃሚ ጭነት አይነት, የህዝብ ግብዓት ባይት, እና ጠቃሚ ጭነት ሃሽ.
መግለጫ ሃሽ የሚከተለው ነው:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

የ FastPQ የዚህ ማስረጃ መንገድ የመረጃ ቦታ መታወቂያ የመጀመሪያዎቹ አስራ ስድስት ባይት ነው
ሌላ የ Blake2b ፊደላት:

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

ከዚያም በተመሳሳይ ደረጃ ይደረጋል FastPQ የሥልጣን ደንብ።

የ OpenVerify የማረጋገጫ ተልእኮ SHA-256 በ SCCP መልዕክት የጀርባ ገጽ
ስም እና የቅዱሳን መጻሕፍት FastPQ የማረጋገጫ መግለጫ:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

ጥሬ FastPQ ማስረጃው Norito- በ `StarkFriOpenProofV1`, ከዚያም
በሳጥኑ ውስጥ የታሸገ `OpenVerifyEnvelope` ከጀርባው ጋር `Stark`. SCCP ማረጋገጫ
ተመሳሳዩን እንደገና ይገነባል FastPQ ከፓኬጅ እና ከሞኒፌስት የተወሰደ ጭነት፣
ክፍት የማረጋገጫ ፖስታ ሜታዳታ, እና ጥሪዎች FastPQ በ ላይ ማረጋገጫ
እንደገና የተገነባው ክምችት እና ማስረጃ።

## የፓራሜትር ስብስቦች {#parameter-sets}

የካኖኒካል ፓራሜትር ካታሎግ ሁለት የፓራሜትር ስብስቦችን ያጋልጣል.
prover lane በአሁኑ ጊዜ ጥቅም ላይ ውሏል `fastpq-lane-balanced`.

| መለኪያ              | ዓላማ                    | መስክ                          | አሻንጉሊቶች                                      | FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` | የተመጣጠነ የፕሮቨር ፍሰት | የወርቅ ብልቶች ካድሬቲክ ማራዘሚያ | የፖዚዶን2 ግዴታዎች፣ ካታሎግ SHA3 መለያ | ክፍል 8፣ ፍንዳታ 8, 46 ጥያቄዎች   |
| `fastpq-lane-latency`  | ለዘግይት የተጋለጡ ጎዳናዎች    | የወርቅ ብልቶች ካድሬቲክ ማራዘሚያ | የፖዚዶን2 ግዴታዎች፣ ካታሎግ SHA3 መለያ | ክፍል 16፣ ፍንዳታ 16, 34 ጥያቄዎች |

ሁለቱም የ 128-ቢት ደህንነት ዒላማ እና ተከትሎ ጎራ መጠን ይጠቀሙ `2^16`. የ
Rust V1 ስክሪፕት መልሶ ማጫወት ኮድ በአሁኑ ጊዜ Fiat-Shamir ፈተና የሚመነጭ
ጋር ባይት `iroha_crypto::Hash::new` በቀጥታ ከመጥቀስ ይልቅ
SHA3-256.

የካታሎግ ቋሚዎች Rust የፕሮፌሽኖች የሚከተሉት ናቸው

| ቋሚ             | `fastpq-lane-balanced` | `fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
| `target_security`    |                    128 |                   128 |
| `grinding_bits`      |                     23 |                    21 |
| `trace_log_size`     |                     16 |                    16 |
| `trace_root`         |   `0x002a247f81c6f850` |  `0x6a9f4eb38fb9b892` |
| `lde_log_size`       |                     19 |                    20 |
| `lde_root`           |   `0x60263388dbbf9b2a` |  `0x9c9c3a571b6f89ac` |
| `permutation_size`   |                 65,536 |                65,536 |
| `lookup_log_size`    |                     19 |                    20 |
| `omega_coset`        |   `0x6af325e825ad5c18` |  `0x3a5fd4171e3c3a4d` |
| `fri_arity`          |                      8 |                    16 |
| `fri_blowup`         |                      8 |                    16 |
| `fri_max_reductions` |                      8 |                     6 |
| `fri_queries`        |                     46 |                    34 |

## አወቃቀር {#configuration}

FastPQ ውቅር ስር ተጣብቋል `zk.fastpq`.

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

ተመሳሳይ አፈፃፀም እና ቴሌሜትሪ መለያዎች ከ `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

የአካባቢ ተለዋዋጮችም ለኮንፊግሬሽን መስኮች ይደገፋሉ።
FastPQ-የተወሰኑ ተለዋዋጮች የሚከተሉትን ያካትታሉ።

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

የቴሌሜትሪ አቅም ሲኖር፣ FastPQ የጀርባ አሰጣጥ ምርጫን የሚመለከቱ ልኬቶች እና
የብረታ ብረት አሂድ ባህሪ:

| ሜትሪክ                            | ትርጉም                                                                     |
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     | የተጠየቀ እና የተፈታ አፈፃፀም ሁነታ በጀርባ መጨረሻ እና በመሣሪያ መለያዎች          |
| `fastpq_poseidon_pipeline_total`  | የተጠየቀ እና የተፈታ የፖሲዶን ቧንቧ መስመር መንገድ                               |
| `fastpq_metal_queue_depth`        | የብረታ ብረት ረድፍ ገደብ ፣ ከፍተኛው በበረራ ወቅት ብዛት ፣ የመላኪያ ብዛት እና ናሙና መስኮት |
| `fastpq_metal_queue_ratio`        | የብረታ ብረት ረድፍ የተጨናነቀ እና የመጋፈጥ ሬሾዎች                                         |
| `fastpq_zero_fill_duration_ms`    | ለብረት ሩጫዎች የአስተናጋጅ ዜሮ ሙሌት ጊዜ                                      |
| `fastpq_zero_fill_bandwidth_gbps` | የተወሰደ የዜሮ ሙሌት ባንድዊድዝ                                                 |

ለአጠቃላይ የአፈፃፀም ማጣሪያ እነዚህን በመግባባት እና ረድፍ ጋር ይጠቀሙ
በ ውስጥ የተዘረዘሩ ምልክቶች [አፈጻጸም እና መለኪያዎች](/am/guide/advanced/metrics.md).

## ተዛማጅ ማጣቀሻ {#related-reference}

- [የመረጃ ሞዴል መርሃግብር](/am/reference/data-model-schema.md) ለተፈጠረው አይነት
  ዝርዝሮች
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ አማራጮች](/am/reference/irohad-cli.md#arg-fastpq-execution-mode)
