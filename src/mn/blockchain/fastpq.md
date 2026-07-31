---
translation_locale: mn
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ нь Iroha-ийн сонгогдсон гүйцэтгэх үр нөлөөний STARK баталгааны зам юм. Энэ нь хэвийн транзакцын гүйцэтгэл эсвэл санал нэгдлийг залгамжладаггүй. Транзакцын аливаа үйл ажиллагаа нь хэвийн байдлаар ISI, IVM болон Sumeragi-ээр явагддаг; FastPQ нь тодорхойлолт гүйцэтгэх гэрчиг хэрэглэж, дэмжсэн үр дагаврыг баталгааны багц руу хувиргана.

Одоогийн хөтөч интеграцынд гурван гол зам байдаг:

- Блок гүйцэтгэх явцад бүртгэгдсэн санхүүгийн хөрөнгийн ил тод шилжилт
- Nexus баталгаажуулсан замын релейн AXT хяналтын хувилбар нь FastPQ хамааралтай
- SCCP нээлттэй хяналтын хуудастай FastPQ баталгааг буулгасан ил тод мэдээллийн баталгаажуулах туслах

## Гэрчлэлийн замыг шилжүүлнэ {#transfer-witness-path}

Ил тод санхүүгийн шилжилт нь заавар тэнцвэрийг өөрчлөх үед бүтэцтэй шилжилтийн шилжилтийг бий болгож байна.

- эх сурвалж, түлхүүжилтийн сан, хөрөнгийн тодорхойлолтын хэмжээ
- Гаалийн өмнө болон дараагийн дамжуулагч, хүлээн авагчийн үлдэгдэл
- бүтээн байгуулалтын нэвтрүүлгийн цэг хэши нь бац хэшээр ашиглагддаг
- Гаалийн бүртгэлээс үүдэлтэй эрх мэдлийн тэмдэг
- "Poseidon digest" нь нэг делта-тай шилжилт хийхэд

Тухайн үед Poseidon-ын цорын ганц дельтатай шилжүүлэн суулгах нь үгүй.

Блок эцэслэхэд Iroha эдгээр транскриптүүдийг нэвтрэх нүктейн хэшээр бүлэглэдэг. гүйцэтгэх гэрч нь дараа нь эх сурвалжийн транскриптын багц болон проверд бэлтгэсэн FastPQ шилжилтийн хувилбарыг авч байна.

Трансфер дельта нь хоёр шилжилтийн шугам болж байна:

|Зураг .|Нүүрний хэлбэр|Албан үнэлгээ |Эдгээрийн дараа|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Гаалийн төлбөр|`asset/<asset-definition>/<source-account>` |төлөөлөгчийн тэнцвэр өмнө |төлөөлөгчийн тэнцвэр дараа |
|Хөрөнгө авдагч .|`asset/<asset-definition>/<destination-account>` |хүлээн авагчдын үлдэгдэл өмнө |хүлээн авагчдын үлдэгдэл |

Санхүүгийн үнэ цэнэүүдийг бүрэн тоот гэрчийн нэгжүүдэд хэвийн болгодог. FastPQ цуврал нь сонгогдсон арван шатны хэмжээнд манлай бус `u64` хэлбэрээр илэрхийлж чадахгүй бол үнэ цэнэг татгалзах юм.

## Төрийн хөрөнгө оруулалт {#public-inputs}

FastPQ шилжих хэсгээс бүрт нь баталгааг блок болон гүйцэтгэх хүрээнд холбодог олон нийтийн өгөгдлийг авч байна:

|Нэвтрүүлэг|Энэ нь юу вэ?|
| ------------- | --------------------------------------------------------------- |
|`dsid` |Мэдээллийн орон тооны тодруулгыг бага хэмжээний байт гэж кодлуулсан |
|`slot` |Блок үүсгэх хугацаа нь нано секундээр хувиргагдлаа |
|`old_root` |Тухайн цаазын гэрчээс гаргасан эцэг эх улсын үндэсний .|
|`new_root` |Цагдаагийн цагдаагийн албаны гэрчээс үүдэлтэй .|
|`perm_root` |Ажилтай үүрэг гүйцэтгэх зөвшөөрлийн талаар Посейдоны үүрэг |
|`tx_set_hash` |Хашиг тавигдсан транзакцын болон цаг хугацааны хөдөлгөөнт нэвтрэх нүктейн хашиг |

Үйлчлөгч нь `fastpq-lane-balanced` -ийг эдгээр цувралын санхүүгийн параметрын хувьд ашигладаг.

## Математикийн загвар {#mathematical-model}

Энэ хэсэг нь одоогийн Rust провер болон санхүүжүүлэгчээр хэрэгжүүлж буй аритметикийн талаар тодорхойлдог. Доорх бүх талбайн үйлдэл нь Голдилокс үндсэн талбай дээр байна:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ Poseidon2 дээр ашигладаг `F` Хөдөөний үүрэг гүйцэтгэгчдэд зориулсан. `t = 3`, түвшин `r = 2`, болон хүчин чадал `1`. Хаш нь талбайн элементүүдийг түвшин-2 блок дээр шатааж, нэг талбарын элементийг нэмнэ `1` эцсийн өөрчлөлтийн өмнө:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Байт шугам нь 7 байтын жижиг андиан бөмбөгүүдэд багтаж байгаа тул бөмбэг бүр `p` -ээс гүнзгий доош байна:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Доменийн хоорондоо хуваагдсан талбарын хашиг дараах байдлаар илэрхийлэх:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Байт доменийн дизестээс эхэлж буй хашийн хувьд FastPQ эхний найман жижиг андиан байтыг талбайд зурдаг:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Энд `Hash` нь Iroha-ийн `iroha_crypto::Hash::new`, Blake2bVar-ын 32 байтын хоолой гэсэн утгатай бөгөөд тодорхой хэлбэрээр Poseidon2 эсвэл SHA-256 гэж нэрлэдэггүй бол.

### Газарны аритметикийн {#field-arithmetic}

Rust код нь талбайн элементийг `[0,p)`-ийн санхүүгийн `u64` хэмжээнд илэрхийлнэ.

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

Хөдөлгөөн нь хамгийн түрүүнд 128 битүүний бүтээгдэхүүнийг тооцоодог:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Дараа нь Goldilocks бууруулалтын нэрсийг ашигладаг:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Хэрэв:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

Дараа нь буурч тооцоолдог:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

Хөдөлгөөн нь `p` -ийг хүчин төгөлдөр болох хүртэл нөхцөлийн дагуу нэмнэ, буцаана.

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 Пермутация {#poseidon2-permutation}

Poseidon2 -ийн өөрчлөлтийн байдал:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Түүний S-бокс нь:

$$
S(x)=x^5
$$

FastPQ дөрвөн бүрэн эргэлт, 57 хэсэгчилсэн эргэлт дараа нь дөрвөн илүү бүрэн эргэлтийн ашигладаг. `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` нь:

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

Бүх нэмэлт, үрчлэл нь `F`. Каноникийн MDS матриц бол:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Барилгын хэш нь нурууны байдалд эхэлдэг. Бүхэл бүтэн түвшинд-2 блок `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

Хамгийн сүүлчийн блок нь `1` Хамгийн сүүлд нэг удаа эргэлт хийхээс өмнө, `x_0`.

### Олон нийтийн мэдээллийн хэрэгслийг хамаардаг {#public-input-binding}

Хост нь `u64` -ийн үнэ цэнийг 16 байтын талбайны эхний найман жижиг андиан байт руу бичиж өгөгдлийн орон тооны ID-ийг кодлож байна:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Блок үүсгэх хугацаа нь миллисекундээс наносекундад шилжиж байна:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Транзакцын багтаамж хэш нь байт доменийн хэшүүдээс ангилагдсан нэвтрэх цэгүүдийн хэшүүд:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

`h_i` нь транзакцын болон цаг хугацааг үүсгэн шилжүүлэгч хашийг ангижруулсан байдаг. Үнэлгээний олон нийтийн IO дээр, `perm_root` эсвэл `tx_set_hash` нь бүгд нөлөөтэй бол провер дутагдлын үнсийг дүүргэдэг:

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

Хөдөлмөрийн тухайн дельтагийн хувьд зорилтот арван шатны шкала нь хэмжээ болон хоёр тэнцвэрлэлийн хяналтын сүүлд хамгийн их хуваарилсан шкала:

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

А `Numeric` мантиссатай үнэ цэнэ `m` болон хэмжээ `q` Зөвхөн `m >= 0` болон `q <= s`. Энэ нь FastPQ Гэрчний үнэ нь:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Хөгжлийн үр дүн нь `u64` хэмжээнд тохирох ёстой.

### Каноникийн захирамж {#canonical-ordering}

Тэмцээний бүтээн байгуулалтын өмнө тавилга нь шилжилтийн товч, үйл ажиллагааны зэрэглэл, анхны оруулсан индексээр ангилагдана:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

Захиргааны үүрэг нь `fastpq:v1:ordering` доменийн болон Norito кодлагдсан шилжилтийн Poseidon2 талбайг хашижлах:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

`P` нь 7-байтын багтаалт, `E` нь Norito код, `D_o` нь `fastpq:v1:ordering` бөгөөд `T*` бол ангилагдсан шилжилтийн жагсаалт юм.

### Хөдөлмөрийн тэгшитгэл {#transfer-equations}

Хөдөлмөрийн хөрөнгийн хэмжээ `a`, төлөөлөгчийн тэнцвэр `f`, болон хүлээн авагчдын тэнцвэр `t`, FastPQ илтгэлийг бүрдүүлэхээс өмнө дүрэмчилсэн гэрчийн үнэ цэнэүүдийг баталгаажуулна:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Дараа нь шилжилтийн шугамд:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

Тэмцээний дотор гарын үсэг зурсан делтаг `F` хэмжээнд бууруулна:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

Зөвлөлийн нэг-дельта шилжүүлэн суулгах дуудлага нь кодлогдсон шилжүүлэлтийн урьдчилсан зургийг гүйцэтгэдэг:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Олон дельта дамжуулах транскриптийн хувьд одоогийн формат нь энэ дээд түвшний дигест байхгүй байх шаардлагыг тавьдаг.

Үйлчлүүлэгч байгууллагаас шилжүүлэн суулгах бичиг баримт бичгийг нь:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Хөгжилтийн шугам {#trace-rows}

Үргэлтийн жагсаалт нь `n` бодит шугамтай байх ёстой. Хөгжлийн урт нь дараагийн хоёр хүчин чадал:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

`0..n-1` шугам нь идэвхтэй, `n..N-1` шугам нь хаалтын шугам юм. Үнэн шугам бүр нэг үйлдлийн сонгогч багтаамжтай:

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

Тусгай зөвшөөрлийн хайлтын шугам нь яг үүрэг олгох, үүргийг цуцлах шугам юм:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Сангийн үйлдлийн шугамд:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Барилгын ажилтан мөн нэг хөрөнгийн тухайн делтаны үйл ажиллагааг дагаж мөрдөж байна:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Зөвхөн "Mint" болон "Burning" шугам нь хангамжийн тоог шинэчлэгддэг:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Мэдээлэл мэдээлэл, өгөгдлийн орон зайн сүүрийн түвшүүд нь шурганы материализацын өмнө үүссэн талбайн хэши:

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

Metadata hash, dataspace hash, slot нь ойр дотроо оршин суугаа шугамд тогтвортой байна:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Merkle-ийн баганаг шилжүүлнэ {#transfer-merkle-columns}

Хөдөлмөрийн шугам нь 32 түвшний хялбар Merkle замыг агуулж байдаг. Үйлчлүүлэгч баталгаа байхгүй бол провер шугамны цэг, урьдчилсан тэнцвэр, шугам нь илгээгч эсвэл хүлээн авагчийн талд байгаа эсэхээс тодорхой чиглэлийг синтезлэдэг.

Синтетик замны хувьд амттай тус `fastpq:smt:from` илгээгч шугам, хүлээн авагч шугамд `fastpq:smt:to`:

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

Синтетик булан, дотоод түймэр нь:

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

Тэмцээний нөөцийг бүртгэдэг `b_l`, ах дүү `s_l`, нэвтрүүлгийн түймэр `x_l`, болон гарааны цэг `x_{l+1}` Кодны салбар конвенцийн дагуу:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Тусгай зөвшөөрлийн хэшүүд {#permission-hashes}

Роль олгох, цуцлах шугам нь зөвшөөрлийн гэрч хэш:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Үйлчлүүлэгч зөвшөөрлийн ширээний гарын талыг үүргийн байт, зөвшөөрлийн байт, эпохийн байтгаар ангилдаг бөгөөд дараа нь Poseidon2 Merkle мод барьдаг:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Хэдэн өргөн хэмжээний түвшин нь эцсийн элементийг давхарч байна.

### Урьдчилгааны үүрэг {#trace-commitment}

Арьсны мөрний багана `c`, FastPQ нь хамгийн түрүүнд арьсын доменийн дагуу баганагийн үнэ цэнэүүдийг интерполяж, коэффициент векторыг хэшээр:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

Тэсний түлхүүр нь Poseidon2 Merkle-ийн түлхүүд дээр үүрэг гүйцэтгэгч:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Хамгийн сүүлд эзлэх үүрэг нь домен, параметрын багц, эзэлтийн хэлбэр, түвшний хоолой болон эзэлтийн чулуун дээр байт хэши юм:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

`D_c` нь `fastpq:v1:trace_commitment`

### AIR Байгууллага {#air-composition}

V1 AIR бүрэлдэхүүний үнэлгээ нь шугам орон нутгийн үлдэгдлийн жижиг хослолт юм.

$$
\alpha_0,\alpha_1 \in F
$$

Захиргагч нь `(i,i+1)` дэргэдэх арьсын хосуудын бүртгэлийн хувьд:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Үндсэн үлдэгдэл `rho` нь:

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

Мөн тогтвортой цувралтын хүрээлэн буй багана:

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

Хяналтын ажилтан шинээр `A_i` нь үзлэгт хамрагдсан шугамны нээлттэй ордыг тооцож, AIR -ийн бүрэлдэхүүнтэй Merkle гаралтай харьцуулахад санхүүжилтийн үнэлгээг шалгана.

### Тэмцээний бүтээгдэхүүн {#lookup-product}

Тус зөвшөөрлийн хайлтын аккумулятор нь Fiat-Shamir сорилт `gamma` -ийг ашигладаг. `s_perm` болон `perm_hash` -ийн бага зэргийн өргөжинжилтийн үнэлгээний явцад хэрэгжиж буй бүтээгдэхүүн нь:

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

### Хэдэн зэргийн өргөтгөлт {#low-degree-extension}

Бичих `omega_T` нөөцийн доменийн генератор байх, `omega_E` үнэлгээний доменийн генератор, `g` конфигуруулсан coset offset нь. `v_i`, Interpolation нь коэффициентийг бий болгодог. `a_j` иймэрхүү:

$$
f(\omega_T^i)=v_i
$$

Төмөр зэргийн өргөтгөлийн нь косетийн ижил олон талт хэсгийг үнэлж:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

Энэ үзүүлэлтийг хэрэгжүүлэн FFT өмнөх coset ofset-ийн хүчин чадалтай коефициентийг дахин нэмэгдүүлэх замаар тооцож байна:

$$
a'_j = a_j g^j
$$

дараа нь `a'` -ийг үнэлгээний бүсэд үнэлэх.

CPU FFT нь бутаар эргэн шилжүүлсэн өгөгдлийн дээр эргэлттэй радикс-2 Cooley-Tukey өөрчлөлт юм. Сцэний урт `L`, хагас урт `H=L/2`, шатны гарал:

$$
\omega_L=\omega^{N/L}
$$

бүр бөмбөрцөг нь:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

Инверс FFT нь `omega^{-1}` -тай ижил өөрчлөлтийг гүйцэтгэж, инверс доменын хэмжээгээр хэмждэг:

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

LDE-ийн дараа, FastPQ нь LDE шорондоох аливаа шугамаар хэшиглэдэг. `m` шорондоо:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Хэрэв шугам хэшүүд нь үнэлгээний доменийн оронд зардлын домен дээр хэвээр байгаа бол провер энэ нэг шугам хэшийг интерполаж, ижил coset LDE үйл явцтай өргөжүүлнэ.

### Merkle-ийн нээлттэй байр {#merkle-openings}

LDE хэмжээнүүд нь дараах хэсэгт хуваагддаг:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Нэг бүр нь:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Merkle-ийн эцэг эх нь:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Хоёр түвшин нь хамгийн сүүлчийн түймрийг давхарч байна. Судалгааны замыг ар зүүн эсвэл баруун хэшийн дагуу шалгаруулалтын хавсрын индексийн тэнцвэрт байдлаас шалтгаалж баталгаажуулна.

Энэтхэгийн `i` ногооны хувьд `(s_0,\ldots,s_{d-1})` зам нь `R` гаралтай харьцуулахад дахин давтагдалтайгаар баталгаажуулдаг:

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

Зөвхөн дараах тохиолдолд шалгалтыг хүлээн авах:

$$
y_d=R
$$

AIR арьсны шугам нь:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR бүрэлдэхүүнтэй ногоо нь:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE асуултын нээлт нь мөн үнэлгээний индекс `i` -д нээгдсэн үнэ цэнийг баталгаажуулсан хэсэгт орсон эсэхийг шалгаж байна.

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Худаллах {#fri-folding}

FRI үүрэг гүйцэтгэдэг AIR бүрэлдэхүүний үнэлгээ. `l`, Үндсэн тэмдэгтийн шинжилгээний асуудал `beta_l`. Сүлэг нь хамгийн сүүлчийн үнэ цэнийг давтахад арьтын үр дүнг бүрдүүлж байна. Арьтын хэмжээний бүлэг бүр:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

`a` нь FRI хэмжээнд байдаг. Тавилгач үзлэгт хамрагдсан хайлтын сүлжээний хувьд:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

болон FRI бүлэгт нээгдсэн бүрт холбогдох FRI шатахуун гаралтайгаар баталгаажуулна.

### "Fiat-Shamir Transcript" {#fiat-shamir-transcript}

Canonical Parameters Catalogue нь транскрипт хэшийг SHA3-256 гэж тэмдэглэдэг. Одоогийн провер болон санхүүжүүлэгч хэрэгжилтэд бэрхшээлтэй байтыг `iroha_crypto::Hash::new` буюу Blake2bVar-ийн 32 байтын дизестээр гаргаж, дараа нь эхний найман бага андиан байтыг `F` -д буулгаж байна:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Хөгдөлмөрийн шилжилтийн дараалал нь:

1. олон нийтийн IO, протоколын хувилбар, параметрын хувилбар болон параметрын нэр
2. LDE гарал, арьс гарал
3. `gamma`
4. AIR бүрэлдэхүүнд тулгамдсан асуудал `alpha_0`, `alpha_1`
5. AIR арьс суурь, AIR бүрэлдэхүүний суурь
6. хайлтын агуу бүтээгдэхүүн
7. FRI шатахууны гаралт болон `beta_l` бэрхшээл
8. үлгэр жишээтэй хайлтын индекс

Судалгааны шинжилгээ нь 32 байтын сорилт хэсгийг гаргаж, сурагчилсан өвөрмөц индексийн тоог олж авах хүртэл `u64` бага хэмжээний хэсгүүдээр уншиж байна:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

Үргэлж авсан цуврал нь төрөлжсөн дараалан эргэн ирдэг.

### Үнэлгээгчийн дахин тоглолт {#verifier-replay}

Хяналтын ажилтан хамгийн түрүүнд цувралны үүрэг гүйцэтгэгчдийг дахин тооцоолон:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

болон дараах шаардлагыг:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

Түүнчлэн IO олон нийтэд сэргээн босгож байна:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Бүх талбай нь баталгааны нийтлэг IO байт-байттай нийцэж байх ёстой.

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Шалгалтын үзлэгт бүртгэгдсэн `q` асуулгад дараах нь шалгана:

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

Үндсэн хуулийн AIR бүрэлдэхүүнд нээлт хийх нь `R_air_composition`. Үндсэн хуулийн FRI дараа нь зангилаа ижилээс эхэлнэ `A_q` болон баталгаажуулсан эцсийн бичигт дуусах ёстой FRI гарын үсгийн дэргэдэх FRI гаралтай.

## Ухаан зохиолч юуг шалгадаг вэ {#what-the-prover-checks}

FastPQ провер нь урсгалын товч, үйл ажиллагааны зэрэгцээ, сахиулах журмын дагуу цувралтын жагсаалтыг санхүүжүүлнэ. Хөдөлмөрийн шугам нь транскриптийн метадэтг шаарддаг.

Хөдөлмөрийн шилжүүлэн суулгах бичиг баримтын хувьд даатгалын талд дараахь шалгалтууд байна:

- төлөөлөгчийн тэнцвэр нь бага хэмжээний урсгалыг явуулахгүй байх
- `sender_after` нь `sender_before - amount` тэнцүү байх ёстой.
- `receiver_after` нь `receiver_before + amount` тэнцүү байх ёстой.
- шилжилт нь цуврал дахь шилжүүлэн суулгах бүх шугамг хамрах ёстой
- "Poseidon"-ын нэг делта-тай хоолой, бүрэлдэхүүнтэй бол транскриптын урьдчилсан зурагтай нийцнэ.
- Урьдчилсан хялбар-Merkle батламж нь 1-р хувилбаар шилжүүлнэ; алдагдаагүй замыг тодорхойлох синтетик батламжтай дүүргэж байна

Трэйс нь шилжүүлэн суулгах, мөрийн тэмдэг, шатаах, үүрэг олгох, үүргийг цуцлах, метадэтгэлийн багц, зөвшөөрлийн хайлтын шугам зэрэг сонгогч түвшүүдийг эзэлдэг. Санхүүгийн үйлдлийн шугамд мөн гарын үсэг зурсан делта, хөрөнгийн бүртгэлтэй делта болон нийлүүлэлтийн тоологчид байдаг.

## Пробэр Лэйн {#prover-lane}

`irohad` нь эхлүүлэх үед FastPQ провер замыг эхлүүлж байгаа бол провер бэкэнд эхэлж болно. Lane нь хязгаарлагдмал шугамтай үндсэн ажил юм. Блок гүйцэтгэх шаһид гаргасны дараа, commit зам блок хэш, өндөр, үзэл болон шаһид бүхий провер замаар хүргүүлнэ.

Хэрэв замын хөдөлгөөн явагдахгүй эсвэл шуурхай нь дүүрэн бол ажил дуусч, хэвийн блок боловсруулалт үргэлжилнэ. Энэ нь түүнээс болж задгийн провер замыг транзакцын хүлээн зөвшөөрөл болон санал нэгдсэн хаалга биш юм.

Захиргааны заал нь:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` шалгаруулагчаар ашиглах боломжтой хяналтын хэсгийг сонгохыг зөвшөөрнө. `cpu` Пинс гүйцэтгэх CPU. `gpu` сонгодог GPU гүйцэтгэх, CPU түлхүүр нь хүссэн цөмийн хэрэглээг ашиглаж чадахгүй тохиолдолд.

## Хяналт шалгах {#verification}

FastPQ баталгаажуулалтын баталгаажуулалт нь каноник хувилбарын үүргийг сэргээн босгож, олон нийтийн транскриптыг дахин боловсруулдаг. Үнэлгээгч протоколын хувилбар, параметр-саалсан хувилбарыг, нөхөн тоглоомын хязгаарлалт, мөрний үүрэг гүйцэтгэх үүрэг, олон нитгэл, үлгэр жишээтэй Merkle нээлттэй байршил, AIR нээлттэйг болон FRI хайлтын зангилаа шалгаж байна.

Үндсэн дүрслэлийн хязгаарлалтад:

|Хязгаарлалт |Үндсэн хуулийн дагуу|
| ------------------ | ------: |
|Хөгжлийн шугам |     256 |
|Барилгын ачааны хэмжээ |256 KiB |
|FRI давхаргууд |      16 |
|Судалгааны нээлт |     128 |

## Nexus Бүртгэгдсэн реле {#nexus-verified-relays}

Nexus AXT баталгааны хуудас нь `AxtFastpqBinding`. Хэзээ `RegisterVerifiedLaneRelay` гүйцэтгэдэг, Iroha:

1. замын хяналтын дугуйны хувцас болон FastPQ батлан хамгаалах материалыг шалгаж байна
2. өгөгдлийн орон зай, гарын үсэгний суурь
3. AXT баталгааны хувилбарыг нэвтрүүлэх
4. `fastpq_binding`
5. FastPQ цувралг тухайн хамаас сэргээн босгож,
6. Нэмэгдсэн FastPQ баталгааг буулгаж байна
7. FastPQ баталгаажуулагчаар сэргээн босгосон цуврал болон батлагыг дууддаг.

Хэрэв шалгалт амжилттай болсон бол Iroha нь `VerifiedLaneRelayRecord` -ийг хадгалах бөгөөд ээлжит дуудлага, эх хуудас, баталгаажуулах ачаалал хэш, шалгалтын өндөр, манфист түшиг болон FastPQ -ийн холболттай.

Тээврийн релейн хуудас нь мөн компакт FastPQ баталгааны материалтай байдаг. Материал нь тээврийн идентификатор, мэдээллийн орчны идентификатор, блок өндөр, шалгалтын өндөр, блок толгой хэш, тохиролцооны хэш, манифест түлхнээс дээш хоолой юм. Рэле нь QC болон FastPQ баталгааны материалтай бол зөвхөн нэгтгэх боломжтой юм.

### AXT Байгууллагатай математик {#axt-binding-math}

Nexus AXT хуурлуудын хувьд, `AxtFastpqBinding` нь баталгааны дахин тоглолтоос өмнө цуглуулах болно. Халуун параметрын үнэ цэнэ бол `fastpq-lane-balanced`; халуун шалгаруулалтын ID болон хувилбарын үндсэн тэмдэг бол `fastpq` болон `v1`; дуудлагын хэлбэр буурагдаж, доод ангилалд ордог.

AXT FastPQ олон нийтийн нэвтрүүлэг нь тодорхойлох байт хэшүүд юм:

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

`authorization` нэхэмжлэлд тусгай зөвшөөрөл олгох шугамаар:

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

`compliance` дуудлага нь хоёр метадэт өгөгдлийн шугам: нэг нь бодлого, нэг нь зорилтот мэдээллийн бүс нутгийн хувьд оруулдаг.

`tx_predicate` болон `value_conservation`-ийн хувьд холболт нь эерэг эх үүсвэр эсвэл зорилтот хэмжээтэй бол тодорхой нөлөөний хэмжээг ашигладаг. Үгүй бол код нь хязгаарлагдмал дэтерминист хэмжээг гаргаж өгдөг:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Дараа нь мөн адил шилжүүлэн суулгах тэгшитгэлийг ашигладаг:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Синтетик төлөөлөгч, хүлээн авагчдын дансны тодруулгыг гол үржмэлээс үүсгэдэг:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Хөдөлмөрийн шилжилтийн хэш нь:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT цувралгийн илтгэлийг SHA-256 нь Norito шилжилтийн халуун байнгын дээр:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Ил тод мэдээний баталгаа {#sccp-transparent-message-proofs}

SCCP туслах хайрцаг нь ил тод сүлжээний хяналтын мэдээллийг баталгаажуулахын тулд FastPQ-ийг ашигладаг. Энэ замыг `irohad` дэргэдэх дамжуулагч шугамнаас тусгаарладаг. Энэ нь FastPQ хэсгийг шууд SCCP мэдээний баталгаажуулалтын багц болон манифестээс барьж, дараа нь үр дүнд хүрсэн баталгааг нээлттэй шалгаруулалтаар хуримтлах юм.

SCCP цуврал нь `fastpq-lane-balanced` болон гурван метадангийн шилжилт ашигладаг:

|Төмөр .|Үйл ажиллагаа |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

Түүний олон нийтийн өгөгдлийг SCCP ил тод дотоод баталгаанаас гаргаж авсан:

|FastPQ нэвтрүүлэг|SCCP эх сурвалж |
| ------------- | ---------------------------------------------------------- |
|`dsid` |Блейк2Б-ийн анхны 16 байт хэшийн дагуу .|
|`slot` |Сүүлийн үеийн өндөр .|
|`old_root` |Хөдөлмөрийн ачаалал хэш|
|`new_root` |Зохиоллын үндэс |
|`perm_root` |Урьдчилсан блок хэш |
|`tx_set_hash` |Мэдээллийн хаш |

SCCP каноник кодер нь бүтэн тоот тоог бага хэмжээгээр бичиж, өөрчлөгдөх урттай байт хэсгийг дараах байдлаар кодлуулдаг:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Олон нийтийн нэвтрүүлгийн байтын ил тод шугам нь:

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

Мэдээллийн ил тод байт нь хувилбар, сүлжээний гэр бүл, орон нутгийн болон өрсөлдөгчийн доменүүд, аюулгүй байдлын загвар, зөөврийн удирдлага, дансны кодек, эцсийн төлөвлөгөөний загвар, баталгаажуулагчаар чиглэсэн зорилго, баталгаажлагчаар дагаж мөрдөх гэр бүл, урттай урьдчилсан сүлжээ / дагаж мөрдөнө / ил тод талбай, зорилтот холбогч хэш юм. Тодруулгын кодэк товч, ашиг ачааллын төрөл, олон нийтийн өгөгдлийн байт, ашиг ачаалал хэш.

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

Энэ баталгааны замын FastPQ өгөгдлийн орон тооны идентификатор нь Blake2b-ийн өөр нэг дэглэмийн эхний зургаан байт:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ цуврал нь яг:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

дараа нь ижил FastPQ захиалгын дүрэмээр ангилагдана.

OpenVerify баталгаажуулагчийн үүрэг гүйцэтгэх нь SHA-256, SCCP мэдээллийн хяналтын нэр болон FastPQ санхүүгийн баталгаажуулалтын тодорхойлогч дээр:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

FastPQ-ийн түүхий эдийг баталгаажуулах баримт нь Norito-ээр `StarkFriOpenProofV1` -д шифрлэгдсэн бөгөөд дараа нь `OpenVerifyEnvelope` -д сүлжээнд `Stark` хамруулсан. SCCP -ийн санхүүжилтийн үйл ажиллагаа нь ижил FastPQ -ний хувилбарыг багц болон манфистээс сэргээн босгож, нээлттэй санхүүжилтний хавсрын метадалыг шалгадаг. FastPQ баталгаажуулагчаар сэргээн босгосон цуврал болон батламж дээр дууддаг.

## Параметрын багц {#parameter-sets}

Canonical Parameters Catalogue нь хоёр параметрын багц илрүүлж байна. Үйлчлүүлэгч провер лен нь одоо `fastpq-lane-balanced` ашигладаг.

|Параметр |Зорилго|Газар |Хашс |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |түвшний дамжуулалт тэнцвэртэй|Голдлайкс дөрвөлжин өргөтгөлийн |Poseidon2 үүрэг, SHA3 жагсаалтын тэмдэг |8 дугаар бүлэг, 8, 46 асуулт |
|`fastpq-lane-latency` |хориотой замаар |Голдлайкс дөрвөлжин өргөтгөлийн |Poseidon2 үүрэг, SHA3 жагсаалтын тэмдэг |16 дахь хэсэг, 16 дэх хэсэг, 34 дахь хэсэг.|

Хоёр нь 128-биттай аюулгүй байдлыг хангах зорилготой бөгөөд `2^16` доменийн зардлын хэмжээг ашигладаг. Rust V1 шилжилтийн дахин тоглох код нь одоогийн байдлаар SHA3-256-ийг шууд дуудлахын оронд Fiat-Shamir сорилтын байтдыг `iroha_crypto::Hash::new`-ээр дамжуулж байна.

Rust сангийн хэрэглэгддэг тохирсон каталогийн тогтмол нь:

|Байнгын .|`fastpq-lane-balanced` |`fastpq-lane-latency` |
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

## Байгууллага {#configuration}

FastPQ бүтэц нь `zk.fastpq` дэргэд байрладаг.

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

Үүнтэй ижил гүйцэтгэх болон телеметрийн тэмдэгүүдийг `irohad` дээр нь давж залах боломжтой:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

Байгаль орчны өөрчлөлтийг конфигурацийн талбайд ч дэмждэг. FastPQ -ийн онцлог өөрчлөлтүүдийг нь:

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

Телеметри ашиглах боломжтой бол FastPQ нь бэкэнд сонгон шалгаруулалтын болон Metal Runtime үйлдлийн үзүүлэлтийг экспортлох:

|Метрик |Энэ нь юу вэ?|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |Захиалгасан болон шийдвэрлэсэн гүйцэтгэх хэв маяг бэкэнд болон төхөөрөмжийн тэмдэглэлээр |
|`fastpq_poseidon_pipeline_total` |Хүссэн болон шийдвэрлэсэн Poseidon урсгалын замыг |
|`fastpq_metal_queue_depth` |Металлын шугам хязгаар, нислэгт хамгийн их тоо, илгээлийн тоо, үзэсгэлэн авах цонх |
|`fastpq_metal_queue_ratio` |Металлын шугам хөдөлгөөнтэй , давхаргын харьцаа|
|`fastpq_zero_fill_duration_ms` |Металлын гүйлгээний тоног төхөөрөмжийн 0 цаг хугацаа .|
|`fastpq_zero_fill_bandwidth_gbps` |Үр дүнтэй нурын өргөн нэвтрүүлэг |

Бүхэл бүтэн гүйцэтгэлийг ангилахын тулд тэдгээрийг [Үүнд гүйцэтгэл, метрик ](/mn/guide/advanced/metrics.md)-д жагсаалсан санал нэгдсэн болон шуурхайгийн сигналуудтайгаар ашигла.

## Үүнтэй холбоотой сэнслэл {#related-reference}

- [Мэдээллийн загварын схема](/mn/reference/data-model-schema.md) үүсгэсэн төрөлний мэдээллийг
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ сонголтууд](/mn/reference/irohad-cli.md#arg-fastpq-execution-mode)
