---
translation_locale: mn
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ бол Iroha Энэ бол STARK сонгогдсон гүйцэтгэх үр нөлөөг баталгаажуулах зам.
Хэрэглээний хэвийн гүйцэтгэл эсвэл санал нэгдлийг залгамжлахгүй.
залах ISI, IVM, болон Sumeragi хэвийн хэвээрээ; FastPQ хэрэглэдэг
тодорхойлолт гүйцэтгэх гэрч, дэмжсэн үр дүнг нотлох
Барууд.

Одоогийн хостинг интеграцынд гурван гол зам байдаг:

- Блок гүйцэтгэх явцад бүртгэгдсэн ил тод хөрөнгийн шилжилт
- Nexus Бүртгэгдсэн замын релейн AXT ногдох гэрчилгээний хуудас FastPQ
  хамааралтай
- SCCP нээлттэй мэдээний баталгаатай туслах FastPQ гэрчилгээ
  нээлттэй шалгалтын хувилбар

## Гэрчлэлийн замыг шилжүүлнэ {#transfer-witness-path}

Ил тод санхүүгийн шилжүүлэн суулгах нь
Сургалтын дагуу тэнцвэрт өөрчлөлт ордог.

- эх сурвалжны данс, зорилтот данс, хөрөнгөний тодорхойлолт, хэмжээ
- Хөдөлмөрийг дамжуулах өмнө болон дараалан илгээгч, хүлээн авагчийн тэнцвэр
- бүтээн байгуулалтын нэвтрүүлгийн цэг хэши нь бац хэшээр ашиглагддаг
- Хэвлэл олгогч бүртгэлээс үүдэлтэй эрх мэдлийн тэмдэг
- Нэг делтатай транскрипт хийх Poseidon-ийн хоолой

Багшны шилжүүлэн суулгах нь хэд хэдэн делтатай нэг бичгийг ашигладаг.
Poseidon-ийн нэг делта шинжилгээ байхгүй.

Блокийн эцэслэлд, Iroha Эдгээр транскриптүүдийг нэвтрүүлгийн цэг хэшийн дагуу бүлэглэнэ.
Цагдаагийн хэрэгт оролцогч эх сурвалж бичгийг авч,
УИХ-ын гишүүн FastPQ Урьдчилгааны шинжилгээний хэрэглэгчдэд зориулан бэлтгэсэн шилжих хувилбар.

Трансфер дельта нь хоёр шилжилтийн шугам болно:

| Зураг             | Нүүрний хэлбэр                                        | Үргэлт               | Үргэлт             |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
| Гаалийн төлбөр    | `asset/<asset-definition>/<source-account>`      | төлөөлөгчийн тэнцвэр өмнө   | төлөөлөгчийн тэнцвэр   |
| Ашиглагчдын зээл | `asset/<asset-definition>/<destination-account>` | хүлээн авагчдын үлдэгдэл өмнө | хүлээн авагчдын үлдэгдэл |

Санхүүгийн үнэ цэнэүүдийг цэцэрлэгийн гэрчийн нэгжүүдэд хэвийн болгодог.
Хөдөлмөрийн хэрэгслийн FastPQ Хэрэв энэ нь сөрөг нөлөөгүй гэж илэрхийлж чадахгүй бол цуврал
`u64` сонгогдсон арван дахь шатны хэмжээнд.

## Нийтийн хөрөнгө оруулалт {#public-inputs}

Хүн бүр FastPQ шилжилтийн багц нь батламжийг
блок, гүйцэтгэх хүрээнд:

| Нэвтрүүлэг         | Үр дүн                                                         |
| ------------- | --------------------------------------------------------------- |
| `dsid`        | Анхан шатны байт гэж кодлогдсон мэдээллийн орчны тодруулгыг             |
| `slot`        | Блок үүсгэх цаг нь нано секундэд хувиргана                    |
| `old_root`    | Тухайн цаазын гэрчээс гаргасан эцэг эх улсын үндэс            |
| `new_root`    | Цагдаагийн цагдаагийн албаны гэрчээс үүдэлтэй              |
| `perm_root`   | Ажилтай үүрэг гүйцэтгэх зөвшөөрлийн талаар Poseidon-ын үүрэг                |
| `tx_set_hash` | Хэдс нь тавих транзакцын болон цаг хугацааг хөдөлгөөнд оруулж буй нэвтрүүлгийн цэг хэши |

Үйлчлүүлэгч ашигладаг `fastpq-lane-balanced` .
Эдгээр хуримтлагууд.

## Математикийн загвар {#mathematical-model}

Энэ хэсэг нь одоогийн Rust
Бүх газар нутгийн үйл ажиллагаа нь ГолдЛокс дээр явагдаж байна.
гол талбай:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ Poseidon2 ашигладаг `F` Хөдөөний үүрэг гүйцэтгэгчдэд зориулсан.
`t = 3`, цалин `r = 2`, болон хүчин чадал `1`. Хаши нь талбайн элементийг
түвшний-2 блок, нэг талбайн элементийг нэмнэ `1` эцсийн тоглолтоос өмнө
эргэлт:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Байт жирүүд 7 байтын жижиг андианий эрхтэнд багтаж байгаа тул бүх эрхт нь
хатуу доор `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Доменийн хоорондоо хуваагдсан талбарын хэшүүд:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Байт доменийн харгалзангаас эхлэх хашийн хувьд, FastPQ эхний найман дахь газрын зураг
жижиг андиан байт:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Энд `Hash` дундаж Iroha Энэ бол `iroha_crypto::Hash::new`, 32 байтын Blake2bVar
Poseidon2 буюу SHA-256.

### Газарны аритметикийн {#field-arithmetic}

Хөдөлмөрийн Rust код нь талбайн элементийг каноник гэж илэрхийлдэг `u64` .
`[0,p)`. Үүнд нэмэлт, хямрал нь:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

Хөдөлгөөн нь хамгийн түрүүнд 128 битийн бүтээгдэхүүнийг тооцоодог:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Дараа нь алтан өнгөний бууруулалтын хувьд:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Хэрэв:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

Дараа нь буурч тооцоо:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

Хөдөлгөөн нь нөхцөлийн дагуу нэмнэ, эсвэл буцаана `p` үр дүн нь
Балансын делта зэрэг гарын үсэг зурсан бүрэн дугаар нь:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 Пермутация {#poseidon2-permutation}

Poseidon2 муутацийн байдал:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Түүний S-box нь:

$$
S(x)=x^5
$$

FastPQ дөрвөн бүрэн, 57 хэсгээс өргөн барилдаан хэрэглэдэг.
Бүтэн давхар, бүлэг тогтвортой
`c_r = (c_{r,0}, c_{r,1}, c_{r,2})` нь:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

Үргэлт нь:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Бүх нэмэлт, үрчлэл нь `F`. Каноникийн MDS матриц нь:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Барилгын хэш нь нурын байдалд эхэлнэ.
`(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

Хамгийн сүүлчийн блок нь `1` хамгийн сүүлд нэгтгэхээс өмнө
Пермутация. `x_0`.

### Олон нийтийн мэдээллийн хэрэгсэл {#public-input-binding}

Хөдөлмөрийн орон тооны ID-г хост нь `u64` нэгдүгээр
16 байтын талбайны 8 жижиг андиан байт:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Блок үүсгэх хугацаа нь милли секундээс нано секундод руу шилжүүлнэ:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Транзакцын хэш нь тавих нэвтрүүлгийн тоонд байт доменийн хэш юм
хашис:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

хаана `h_i` Энэ нь транзакцын болон цаг хугацааны хөдөлгөөнд орох цэг хэшүүд юм.
олон нийтийн баталгаа IO, Хэрэв `perm_root` эсвэл `tx_set_hash` бүх зүйл нь нөлөө,
Prover нь дутагдалтын үнэлгээ:

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

### Санхүүгийн нормализац {#numeric-normalization}

Хөдөлмөрийн шилжүүлэн суулгах делтаны хувьд зорилтот арван дахь шат нь хамгийн их
хэмжээний хэмжээнд болон хоёр тэнцвэрлэлийн хяналт:

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

А `Numeric` мантиссатай үнэ цэнэ `m` болон хэмжээ `q` зөвхөн
`m >= 0` болон `q <= s`. Энэ нь FastPQ Гэрчийн үнэ нь:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Нормаль үр дүн нь `u64`.

### Каноникийн захирамж {#canonical-ordering}

Тэсний бүтээн байгуулалтын өмнө тавилга нь шилжих түлхүүр, үйлдэлээр ангилагдана.
түвшин, анхны оруулсан индекс:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

Захиалтын үүрэг нь домен дээр Poseidon2 талбайн хэш юм
`fastpq:v1:ordering` болон Norito ангилагдсан шилжилтийн код:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

хаана `P` 7 байтын багцтай, `E` бол Norito кодлох, `D_o` бол
`fastpq:v1:ordering`, болон `T*` Энэ бол шилжилтийн жагсаалт.

### Хөдөлмөрийн тэгштгэл {#transfer-equations}

Хөдөлмөрийн төлбөрийн хэмжээ `a`, төлөөлөгчийн тэнцвэр `f`, болон хүлээн авагчдын тэнцвэр `t`,
FastPQ нөөц гаргахаас өмнө гэрчдийн хэвийн үнэлгээг баталгаажуулна:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Дараа нь шилжилтийн шугам:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

Тэсний дотор, гарын үсэг зурсан делта `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

Зөвлөлтөөр нэг-дельта дамжуулалт дамжуулалт нь кодлогдсон дамжуулалт хийх үүрэгтэй
урьдчилсан зураг:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Олон дельта дамжуулах транскриптийн хувьд өнөөгийн хэлбэр нь дараах шаардлагыг хангадаг:
Хамгийн өндөр түвшний хоолны дэглэмгүй байх.

Хөдөлмөрийн шилжилтийн бичгийг хүлээн авах эрх баригч байгууллага:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Хөгжлийн шугам {#trace-rows}

Үргэлтийн жагсаалтыг бүрдүүлэх `n` Үнэн шугам.
хоёр дахь хүч нь:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

Зураг `0..n-1` идэвхтэй; шугам `n..N-1` Энэ нь өргөн барьсан шугам юм.
нэг үйлдлийн сонгогч багц:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Бүх сонгогч түвшүүд бол Булийн:

$$
s(s-1)=0
$$

Тусгай зөвшөөрлийн хайлтын шугам нь яг үүрэг олгох болон үүргийг цуцлах шугам юм:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Сангийн үйлдлийн шугам:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Барилгын ажилтан мөн нэг хөрөнгийн дагуу үйл ажиллагаа явуулж буй дельтаг дагаж байна:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Зөвхөн "Mint" болон "Burning" шугам нь нийлүүлэлтийн тоог шинэчлэн найруулдаг:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Мэдээллийн сан болон өгөгдлийн орон зайны заалтын түвшүүд нь жирийн өмнө үүссэн талбайн хэши юм
материализ:

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

Мэдээллийн хэш, мэдээллийн орон тооны хэш, хол нь ойр орчимд тогтвортой байна
заалтын шугам:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Merkle баганаг шилжүүлнэ {#transfer-merkle-columns}

Хөдөлмөрийн шугам нь 32 түвшний хялбар Merkle замтай.
нөөцгүй бол провер нь шугамны товчлоос тодорхойлсон замыг шинжилгээж,
урьдчилсан тэнцвэрлэл, шугам нь илгээгч эсвэл хүлээн авагч талд байгаа эсэх.

Синтетик замны хувьд амттай тус нь `fastpq:smt:from` илгээгч шугамд
болон `fastpq:smt:to` хүлээн авагч шугамд:

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

Үндсэн богино болон дотоод бөмбөг нь:

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

Тэмцээг бүртгэж байна `b_l`, ах дүү `s_l`, нэвтрүүлгийн түймэр `x_l`, болон
гарааны түймэр `x_{l+1}` Бүх түвшинд.

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Тусгай зөвшөөрлийн хаш {#permission-hashes}

Хөдөлмөр олгох, цуцлах шугам нь зөвшөөрлийн гэрч:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Хост зөвшөөрлийн хүснэгтийн түлхүүр нь үүргийн байт, зөвшөөрөлээр бүртгэлүүдийг ангилдаг
Байт, эпохийн байт, дараа нь Poseidon2 Merkle мод барьж:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Хэдэн өргөн хэмжээний түвшин нь эцсийн элементийг давхарч байна.

### Хөгжлийн үүрэг {#trace-commitment}

Тэсний арьст бүр `c`, FastPQ хамгийн түрүүнд түвшний үнэ цэнийг
мөрний домен, хэшийн коефициентийг:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

Тэсний түлхүүр нь шоронгийн үүрэг гүйцэтгэгчдийн дээр Poseidon2 Merkle түлхүүд:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Хамгийн сүүлд эзлэх үүрэг нь домен, параметр багц,
мөрний хэлбэр, шоронгийн хоолой, мөрний гарал:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

хаана `D_c` бол `fastpq:v1:trace_commitment`.

### AIR Хөгжил {#air-composition}

Хөдөлмөрийн V1 AIR бүрэлдэхүүний үнэ нь шугам орон нутгийн үлдэгдлийн сүлжээний уялдаа юм.
Үргэлт нь хоёр бэрхшээлтэй байна:

$$
\alpha_0,\alpha_1 \in F
$$

Өрсөх арьсны хосууд бүрт `(i,i+1)`, Провер нь:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Үндсэн үлдэгдэл `rho` кодны дараалал:

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

Санхүүгийн баганатай шугам:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

Мөн тогтвортой бацгийн контекстт шорондоо:

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

Тавигч дахин тооцоо хийдэг `A_i` үзлэгт хамрагдсан шугамны нээлттэй орд, хяналт шалгах
Үндсэн хуульд зааснаар AIR бүрэлдэхүүн Merkle
гаралтай.

### Тэтгэмжлэлийн бүтээгдэхүүн {#lookup-product}

Тус зөвшөөрлийн хайгуулын аккумулятор нь Fiat-Shamir сорилтыг ашигладаг `gamma`.
Хэдэн зэргийн өргөтгөлийн үнэлгээгээр `s_perm` болон `perm_hash`, УИХ-ын гишүүн
үйл ажиллагаа явуулж буй бүтээгдэхүүн нь:

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

Дашрамдсан баримт:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Нөөц хэмжээний өргөтгөл {#low-degree-extension}

Бичих `omega_T` Тэс доменийн генератор байх, `omega_E` УИХ-ын гишүүн
үнэлгээний доменийн генератор, `g` конфигуруулсан косетын оргил.
үнэ цэнэтэй зардлын багана `v_i`, интерполяцын үр дүн нь коэффициентийг бий болгодог `a_j`
ийм:

$$
f(\omega_T^i)=v_i
$$

Хөрөг зэргийн өргөтгөлийн нь косетийн ижил олон талт хэсгийг үнэлдэг:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

Энэ үзүүлэлтийг хэрэгжүүлснээр коэффициентыг
өмнөх цалингийн орлого FFT:

$$
a'_j = a_j g^j
$$

дараа нь үнэлгээ хийх `a'` үнэлгээний бүсэд.

Хөдөлмөрийн CPU FFT нь эргэлтийн радикс-2 Cooley-Tukey өөрчлөлт
Битийн эргэлтэд орж ирсэн түвшин `L`, хагас урт `H=L/2`, болон үе шат
гарал:

$$
\omega_L=\omega^{N/L}
$$

бүр бөмбөрцөг тооцоо:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

Үүнээс өөр FFT ижил хэлбэртэй `omega^{-1}` Хөгжлийн хэмжээг
эсрэг доменийн хэмжээ:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Каталогын гарал нь ашиглахаас өмнө баталгаажуулна:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Catalogue root-ээс үүдэлтэй жижиг доменүүдийн хувьд генератор нь:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Зураг, арьс хаш {#row-and-leaf-hashes}

Дараа нь LDE, FastPQ бүр шугамаар хашис LDE багана. `m` багана:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Хэрэв шугам хэшүүд нь үнэлгээний оронд мөрний домен дээр хэвээр байгаа бол
Домен, провер нь энэ нэг шугам хаш баганаг интерполяж өргөжүүлнэ
ижил төстэй LDE үйл явц.

### Merkle-ийн нээлттэй орнууд {#merkle-openings}

LDE үнэ цэнэүүдийг дараахь хэсгүүдэд хуваадаг:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Нэг бүр нь:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Мэрклийн эцэг эх нь:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Хэдэн түвшин нь хамгийн сүүлчийн түймрийг дугуйлах.
Энэ нь тухайн түвшинд асуултын хуудасны индекс тэнцэх байдлаас хамаарна.

Нүүр хуудас `i`, зам `(s_0,\ldots,s_{d-1})` хяналт тавих
гарал `R` дахин давтагдал:

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

Шек зөвхөн дараах тохиолдолд:

$$
y_d=R
$$

AIR Шүрэлтийн шугам нь:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR бүрэлдэхүүнтэй ногоо нь:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

Хөдөлмөрийн LDE шалгалтын нээлт нь мөн үнэлгээний индекс дээр нээгдсэн үнэ цэнийг шалгана
`i` баталгаажуулсан хэсэгт байгаа:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Хөгжүүлэг {#fri-folding}

FRI үүрэг гүйцэтгэдэг AIR бүрэлдэхүний үнэлгээ. `l`, УИХ-ын гишүүн
Үргэлж үзэсгэлэн `beta_l`. Сүлжгийг олон талт
Аритын хэмжээний бүлэг бүр:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

хаана `a` Энэ бол FRI хяналт шалгагч нь шинжилгээний үзлэгт хамрагдсан асуултын
зангилаа:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

нээгдсэн бүрт баталгаажуулдаг FRI Тус бүлэгт FRI давхар
гаралтай.

### Fiat-Shamir шилжилт {#fiat-shamir-transcript}

Canonical параметр каталог нь транскрипт хэш-ийг SHA3-256.
Одоогийн провер болон санхүүжүүлэгч хэрэгжилт нь
`iroha_crypto::Hash::new`, Энэ бол 32 байтын Blake2bVar дигес юм.
эхний найман жижиг эндийн байтыг `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Хөгжлийн дуудлага нь бүх хувилбарыг шилжилтийн нөхцөлд нэмнэ.
дараах нь:

1. олон нийт IO, протоколын хувилбар, параметр хувилбар болон параметрын нэр
2. LDE гарал, эзэнт гарал
3. `gamma`
4. AIR бүрэлдэхүүнд тулгамдсан асуудал `alpha_0`, `alpha_1`
5. AIR мөрний түлх, AIR бүрэлдэхүний үндэс
6. олох агуу бүтээгдэхүүн
7. FRI давхарт гаралтай, `beta_l` бэрхшээл
8. үзлэгт авсан хайлтын индекс

Судалгаа шинжилгээний дагуу 32 байтын сорилт хувилбарыг гаргаж,
жижиг андиан `u64` сурагчасан нөөцийн тоог олж авах хүртэл
индекс:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

Үлгэрийн цуглуулгыг ангилан эргүүлнэ.

### Үнэлгээгчийн дахин тоглолт {#verifier-replay}

Хөдөлмөрийн баталгаажуулагч нь хамгийн түрүүнд цувралны үүргийг дахин тооцоолон:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

болон дараах шаардлагыг:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

Түүнчлэн олон нийтийг сэргээн босгодог. IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Бүх талбар нь баталгааны олон нийттэй нийцэх ёстой IO Байт-байт.
дараа нь ижил шилжилтийг дахин боловсруулж, мөн адил үр дүнг гаргадаг:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Шалгалтын жилд бүртгүүлэх `q`, Энэ нь:

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

болон:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

Хөдөлмөрийн AIR бүрэлдэхүүний нээлт нь `R_air_composition`.
Хөдөлмөрийн FRI дараа нь зангилаа ижилээс эхэлнэ `A_q` болон төгсгөл нь
баталгаажуулсан эцсийн FRI галт тэрэгний дэргэд FRI гаралтай.

## Ухаан зохиолч юуг шалгана вэ {#what-the-prover-checks}

Үүнээс өмнө FastPQ Провер нь багийн захиалгыг санхүүжүүлнэ
Хөдөлмөрийн түлхүүр, үйл ажиллагааны зэрэглэл, элсүүлэх журам
Транскриптийн метабараа шаарддаг.
Үргэлт нь хүчингүй.

Хөдөлмөрийн шилжилтийн баримт бичгийн хувьд даатгалын дэргэдэх хяналтад:

- илгээгчийн тэнцвэр нь доод урсгалд орж болохгүй
- `sender_after` тэгш байх ёстой `sender_before - amount`
- `receiver_after` тэгш байх ёстой `receiver_before + amount`
- шилжилт нь цуврал дахь шилжүүлэн суулгасан бүх шугамг хамруулна
- нэг удаагийн "Delta Poseidon" хоолой нь бүртгэлтэй нийцсэн байх ёстой
  урьдчилсан зураг
- Сэтгэлтэй маркл-профлекс нь 1 дүгээр хувилбартай шилжүүлнэ.
  тодорхойлолттай синтетик баталгаатай дүүрэн

Тэс нь шилжүүлэн суулгах, мэнт хийх, шатаах, үүрэг олгох гэсэн сонгогч баганатай.
үүргийг цуцлах, метадэтгэлийн багшил, зөвшөөрлийн хайлтын шугам.
шугам нь мөн гарын үсэг зурсан делтатай, нэг хөрөнгийн тухайн делтатай ажилладаг бөгөөд нийлүүлэлт
Тэмцээ.

## Пробэр Лэйн {#prover-lane}

`irohad` эхлэнэ FastPQ Провер замыг эхлүүлэхэд
Замын сан нь хязгаарлагдмал шугамтай үндсэн ажил юм.
Блок нь цаазын гэрчийг гаргадаг, гэмт хэрэг үйлдэх зам нь шалгаруулалтын ажлыг хүргүүлнэ
блок хэш, өндөр, үзэл баримт, гэрчтэй.

Хэрэв замын хөдөлгөөн явахгүй, эсвэл шуурхай нь дүүрэн бол ажил орхигддог бөгөөд
Энэ нь түүнээс хойшхи провер лен нь
Энэ нь гүйлгээний хүлээн зөвшөөрөл эсвэл санал нэгдлийн хаалга биш.
Үндсэн хуулийн дагуу хэрэгжиж байгаа.

Дөрвөн нь:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` шалгаруулагчийн ашиглах боломжтой хориог сонгоно. `cpu` Пинс гүйцэтгэх
Хөдөлмөрийн CPU. `gpu` сайтар GPU гүйцэтгэх, CPU эргэлт нь
түлхүүр нь хүсэлт гаргасан цөмийн хэрэглээг ашиглаж чадахгүй.

## Хяналт шалгах {#verification}

FastPQ баталгааны сануулалт нь хуулийн заалтын үүрэг гүйцэтгэгчдийг сэргээн босгож,
Олон нийтийн шилжилтийг дахин хийлгэж, протоколын хувилбарыг шалгаж,
Параметр-сэт хувилбар, дахин тоглох хязгаарлал, зардлын үүрэг гүйцэтгэх, олон нийтийн өгөгдлийг,
Merkle-ийн нээлттэй нүхүүдээс үзлэг авч, AIR нээлттэй, FRI асуултын зангилаа.

Үндсэн дүрслэлийн хязгаар нь:

| Хязгаарлалт              | Урьдчилсан |
| ------------------ | ------: |
| Хөгжлийн шугам    |     256 |
| Багшны ашигтай ачааны хэмжээ | 256 KiB |
| FRI давхар         |      16 |
| Судалгааны нээлт     |     128 |

## Nexus Бүртгэгдсэн реле {#nexus-verified-relays}

Nexus AXT баталгааны хуудас нь `AxtFastpqBinding`. Хэзээ
`RegisterVerifiedLaneRelay` гүйцэтгэдэг, Iroha:

1. замын шилжилтийн хуудасны хяналт шалгаруулах; FastPQ баталгааны материал
2. Мэдээллийн орон зай, гарын үсэгний түрийг шалгана
3. . AXT баталгааны хуудас
4. . `fastpq_binding`
5. цаашид FastPQ Тухайн холболтны бараа
6. оргилсан хэсгийг FastPQ баталгаа
7. дуудлага FastPQ сэргээн босгосон цуврал болон батлан баталгаажуулагч

Хэрэв шалгалт амжилттай болсон бол, Iroha а хадгалах `VerifiedLaneRelayRecord`
Рэлегийн сүлжээн, анхны хуудас, баталгааны ашиг ачааллын хэш
баталгаажуулах өндөр, гарын үсэг; FastPQ Зөгнөж байна.

Тэмцээний шилжилтийн хуудас нь ч жижиг FastPQ Дашрамдлын материал.
замын нөөц, өгөгдлийн орон тооны нөөцийн нөөц , блок өндөр, шалгалт
өндөр, блок толгой хэш, тохиролцооны хэш, manifest root.
нэгтгэх нь зөвхөн аль алинд нь QC болон хүчинтэй FastPQ баталгаа
материал.

### AXT Математикийн үүрэг {#axt-binding-math}

Үүнд Nexus AXT хуудас, `AxtFastpqBinding` баталгаажуулахын өмнө цуврал болгодог
дахин тоглоомын . Үүнд зориулсан үнэлгээгүй параметр `fastpq-lane-balanced`; хол
баталгаажуулагч ID болон хувилбарын үндсэн `fastpq` болон `v1`; нэхэмжлэлийн төрөл нь буулгаж байна
Мөн бага зэргийн.

Хөдөлмөрийн AXT FastPQ олон нийтийн өгөгдлийг тодорхойлсон байт хэшүүд:

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

AXT шилжих түлхүүр нь:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

Хөдөлмөрийн `authorization` нэхэмжлэл нь үүрэг олгох шугам оруулдаг:

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

зөвшөөрлийн бодлогыг хамааралтай байлгах метадангийн шугам. `compliance` нэхэмжлэл
2 метрийн өгөгдлийн шугам: нэг нь бодлого, нэг нь зорилтот мэдээллийн бүсэд.

Үүнд `tx_predicate` болон `value_conservation`, тодорхой нөлөөний хэмжээ нь
Зэвсэг нь эх үүсвэр эсвэл зорилтот хэмжээний эерэг тоог агуулсан тохиолдолд хэрэглэдэг.
Үгүй бол код нь тодорхой хэмжээний хязгаарлалттай тоог гаргадаг:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Дараа нь ижил шилжүүлэн суулгах тэгшитгэлийг ашигладаг:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Үндсэн төлөөлөгч, хүлээн авагчдын дансны идентификатор нь гол үржмээнээс үүсдэг:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Хөдөлмөрийн шилжүүлэн суулгах хэш нь:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

Хөдөлмөрийн AXT бацгийн илтгэл гардаг нь SHA-256 цаашид Norito .
Каноникийн холболт:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Ил тод мэдээний баталгаа {#sccp-transparent-message-proofs}

Хөдөлмөрийн SCCP туслах хайрцаг ч ашигладаг FastPQ ил тод сүлжээний дамжуулалт
Энэ зам нь `irohad` Хөгжлийн хяналтын замыг.
a-г бий болгодог FastPQ тутамд шууд SCCP мэдээний баталгааны багц болон
нээлттэй шалгаруулалтад хүргэх үүднээс баталгаажуулсан баримт бичгийг илрүүлнэ.

Хөдөлмөрийн SCCP бацгийн хэрэглээ `fastpq-lane-balanced` болон гурван метадангийн шилжилт:

| Нүүр                             | Үйл ажиллагаа |
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

Нийтийн хөрөнгө оруулалт нь SCCP ил тод дотоод баталгаа:

| FastPQ дуудлага  | SCCP эх үүсвэр                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        | Blake2b-ийн эхний 16 байт хэшээр |
| `slot`        | Сүүлийн үеийн өндөр                                            |
| `old_root`    | Хөдөлмөрийн ачаалал                                               |
| `new_root`    | Зохиоллын үндэс                                            |
| `perm_root`   | Сүүлийн үеийн блок хэш                                        |
| `tx_set_hash` | Мэдээллийн хэш                                             |

Хөдөлмөрийн SCCP Canonical коджуулагч нь бүтэн тоогоор бичдэг
өөрчлөх урттай байт массивүүд:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Олон нийтийн нэвтрүүлэгний байт шугам нь:

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

Ил тод мэдэгдлийн байт нь хувилбарын, зангилын нэгдсэн
Гэр бүлийн, орон нутгийн болон өрсөлдөгчдийн домен, аюулгүй байдлын загвар, анкерний удирдлага,
Эдгээрийн санхүүжилт
урттай зардлага/сэргэлт/хавьдлын талбай, чиглэлийн холболт хэш,
Эдгээрийн хэрэгслийн нөөц, ашиглалтын ачааллын төрөл, олон нийтийн өгөгдлийн байт,
дуудлага хэш нь:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

Хөдөлмөрийн FastPQ Энэ баталгааны замыг мэдээллийн орон тооны ID нь эхний 16 байт
Blake2b-ийн өөр нэг дэглэм:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

Хөдөлмөрийн SCCP FastPQ Тухайн хэсэг нь:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

дараа нь ижил FastPQ Захиргааны дүрэм.

Хөдөлмөрийн OpenVerify шалгалтын ажилтны үүрэг гүйцэтгэх SHA-256 цаашид SCCP Мэдээллийн хяналт хэсэг
нэр, санхүүгийн FastPQ баталгаажуулагч тодорхойлогч:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Үндсэн бүтээгдэхүүн FastPQ баталгаа нь Norito-Эрдэнэт Солонгос `StarkFriOpenProofV1`, Дараа нь
угаасан `OpenVerifyEnvelope` с задний төгсгөлтэй `Stark`. SCCP шалгалт
ижил төстэй шинэчлэл FastPQ Багтан болон манфистээс цуврал,
нээлттэй баталгаажуулах хуудасны метадан, FastPQ Хөдөлмөрийн
Шинэ бүтээн байгуулалт хийгдсэн.

## Параметрын багц {#parameter-sets}

Canonical Parameters Catalogue нь хоёр параметрын багц .
prover lane одоогоор ашигладаг `fastpq-lane-balanced`.

| Параметр              | Зорилго                    | Газар                          | Хаш                                      | FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` | тэнцвэртэй суурьшилтын дамжуулалт | Золооны гаралтай цагаан өнгөт өргөтгөл | Poseidon2 үүрэг гүйцэтгэгч, жагсаалт SHA3 тэмдэглэл | 8 дугаар бүлэг, 8 дугаар хэсэг, 46 асуулт   |
| `fastpq-lane-latency`  | хориотой замыг    | Золооны гаралтай цагаан өнгөт өргөтгөл | Poseidon2 үүрэг гүйцэтгэгч, жагсаалт SHA3 тэмдэглэл | 16 дахь хэсэг, 16 дэх хэсэг, 34 дахь хэсэг |

Хоёр нь 128-биттай аюулгүй байдлыг хангах зорилготой бөгөөд `2^16`. Хөдөлмөрийн
Rust V1 Transcript дахин тоглох код одоо Fiat-Shamir сорилт
байт `iroha_crypto::Hash::new` шууд дуудлага гаргахаас илүү
SHA3-256.

Тухайн жагсаалтын тогтмол нь Rust Нүүр хуудас

| Үргэлж             | `fastpq-lane-balanced` | `fastpq-lane-latency` |
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

## Байгууллага {#configuration}

FastPQ конфигурацыг нь доор `zk.fastpq`.

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

Үүнтэй адил гүйцэтгэх болон телеметрийн тэмдэгүүдийг `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

Байгаль орчны өөрчлөлтийг конфигурацийн талбайд ч дэмждэг.
FastPQ-Хүнз бүрийн өөрчлөлтүүдийг:

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

## Метрикийн үзүүлэлт {#metrics}

Телеметри ашиглах боломжтой бол FastPQ Эрдэм шинжилгээний байгууллага,
Металлын гүйлтийн явцыг:

| Метрик                            | Үр дүн                                                                     |
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     | Багацааны төгсгөл болон төхөөрөмжийн тэмдэгтээр хүссэн, шийдвэрлэсэн гүйцэтгэх хэлбэр          |
| `fastpq_poseidon_pipeline_total`  | Хожсон, шийдвэрлэсэн Poseidon урсгалын замыг                               |
| `fastpq_metal_queue_depth`        | Металлын шуурхай, нислэгт хамгийн их тоо, илгээлийн тоо, үзэсгэлэн шинжилгээний хувилбар |
| `fastpq_metal_queue_ratio`        | Металлын шуурхай, давхаргын харьцаа                                         |
| `fastpq_zero_fill_duration_ms`    | Металлын гүйлгээний өрөөний нурууны тулгуур хугацаа                                      |
| `fastpq_zero_fill_bandwidth_gbps` | Нөлжилтийн нөөцийн хувилбар                                                 |

Нийт гүйцэтгэлийг ангилахын тулд тэдгээрийг санал нэгдмэл болон шуурхайгаар ашигла
Энэ нь [Үйл ажиллагаа, үзүүлэлт](/mn/guide/advanced/metrics.md).

## Үүнтэй холбоотой сэнс {#related-reference}

- [Мэдээллийн загварын схема](/mn/reference/data-model-schema.md) үүссэн төрөлд
  дэлгэрэнгүй мэдээлэл
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ сонголт](/mn/reference/irohad-cli.md#arg-fastpq-execution-mode)
