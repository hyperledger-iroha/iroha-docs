---
translation_locale: mn
translation_source: /blockchain/fastpq.md
translation_source_hash: d8dd61390f5df3dae09b70399e04e8f71716a912ef5dea9010feaf60573ed261
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# FastPQ {#fastpq}

FastPQ нь сонгогдсон гүйцэтгэлийн үр нөлөөнд зориулсан Iroha-ийн STARK нотолгооны зам юм. Энэ нь хэвийн гүйлгээний гүйцэтгэл эсвэл зөвшилцлийг орлож чадахгүй. Гүйлгээ нь одоо ч ердийнх шиг ISI, IVM, ба Sumeragi-ыг гүйцэтгэ; FastPQ нь тодорхой гүйцэтгэлийн гэрчийг ашиглаж, дэмжигдсэн үр нөлөөг баталгааны багцад хувиргадаг.

Одоогийн хостын интеграц нь гурван үндсэн замтай:

- тогтолцоо гүйцэтгэгдэх явцад бүртгэгдсэн ил тунгалаг тоон хөрөнгийн шилжүүлэг
- AXT нотолгооны бүрхүүлдээ FastPQ холболт агуулсан, Nexus-аар баталгаажсан эгнээний дамжуулалтууд
- SCCP ил тод мессеж нотлох туслах хэрэгслүүдийг FastPQ нотлох баримтыг нээлттэй баталгаажуулалтын өгөгдлийн саванд ороосон

## Шалгагч дамжуулах зам {#transfer-witness-path}

Ил тод тоон шилжүүлэг нь заавар үлдэгдлийг өөрчлөхөд бүтэцтэй шилжүүлгийн бичлэг үүсгэнэ. Бичлэгт дараах мэдээлэл орно:

- эх данс, зорилтот данс, хөрөнгийн тодорхойлолт, мөнгөн дүн
- илгэгч ба хүлээн авагчийн үлдэгдэл шилжүүлэхээс өмнө ба дараа
- гүйлгээний орц цуулагдсан криптографийн хэшийг багцын криптографийн хэшээр ашигласан
- илгээж буй дансаар үүссэн эрх олгох үндсэн криптографийн хураангуй утга
- Нэг дельта бичлэгүүдэд зориулсан Poseidon криптографийн хураангуй утга

Багц шилжүүлгүүд нь олон дельтатай нэг транскриптийг ашигладаг. Энэ тохиолдолд ганц дельта Poseidon криптографийн дижест утга байхгүй болно.

Блокыг эцэслэхэд, Iroha эдгээр транскриптийг entrypoint криптографийн хэшээр бүлэглэдэг. Гүйцэтгэх гэрч нь анхны транскрипт багцууд болон нотлогчийн бэлдсэн FastPQ шилжилтийн багцуудыг авч явдаг.

Тус бүр шилжүүлэх дельта хоёр шилжилтийн мөр болж хувирдаг:

|Мөр|Түлхүүрний хэлбэр|Өмнөх утга|Шуудангийн үнэ|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Илгээгчийн дебит| `asset/<asset-definition>/<source-account>`      |илгээмжийн үлдэгдэл өмнө|илгээмжийн үлдэгдэл дараа|
|Хүлээн авагчийн зээл| `asset/<asset-definition>/<destination-account>` |хүлээн авагчийн үлдэгдэл өмнө|хуулга авах балансын дараа|

Тоо хэмжээ нь бүхэл тоон гэрч нэгжүүдэд хэвийн бологддог. Сонгосон арвантын масштабад эерэг бус `u64`-аар илэрхийлж чадахгүй бол FastPQ багцлахад утгыг татгалздаг.

## Олон нийтийн оруулга {#public-inputs}

Бүх FastPQ шилжилтийн багууд нь нотолгоог блок болон гүйцэтгэлийн орчинд холбодог олон нийтийн оролцоог агуулдаг:

|Оролт|Өгүүлэмж|
| ------------- | --------------------------------------------------------------- |
| `dsid`        |Өгөгдлийн сангийн танигчийг жижиг эцсийн байтаар кодлосон|
| `slot`        |Блок үүсгэсэн цагийг наносекунд руу хөрвүүлсэн|
| `old_root`    |Гүйцэтгэлийн гэрчээс гаралтай эцэг төрлийн үндэс|
| `new_root`    |Гүйцэтгэлийн гэрчээс гаралтай улсын дараах үндэс|
| `perm_root`   |Poseidon криптографын амлалтын утга идэвхтэй үүргийн зөвшөөрөл дээр|
| `tx_set_hash` |эрэмбэлэгдсэн гүйлгээ ба цагийн үүдэлд орох криптографийн хэшүүд дээрх криптографийн хэш|

Зочин үүнийг эдгээр багцуудын хувьд ганц протокол-стандарт параметрийн багц болгон `fastpq-lane-balanced` ашигладаг.

## Математикийн загвар {#mathematical-model}

Энэхүү хэсэг нь одоогийн Rust баталгаажуулагч ба нотлогчоор гүйцэтгэсэн арифметикийг тайлбарлана. Доор өгөгдсөн бүх талбар үйлдлүүд нь Голдилоксийн прост тоон талбарт хийгдэнэ:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ нь талбайн криптографын баталгааны утгуудын хувьд `F`-ийн оронд Poseidon2-г ашигладаг. Sponge-ийн өргөн нь `t = 3`, хурдац нь `r = 2`, багтаамж нь `1` бөгөөд криптографын хэш нь талбайн элементүүдийг rate-2 блокоор шингээж, эцсийн пермутациас өмнө ганц талбайн элементийг `1` нэмдэг:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Байт мөрүүдийг 7 байтын жижиг эцсийн дарааллын мөчүүдэд багтаадаг тул бүх мөч нь заавал `p`-аас доогуур байх ёстой:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Талбар тусгаарласан домэйний криптографийн хэшүүд дараах байдлаар илэрхийлэгддэг:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Байт-талын криптографийн хураангуйгаас эхлэх криптографийн хэшүүдийн хувьд, FastPQ анхны найман бяцхан эгнээтэй байт-г талбайд зураглаж байна:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Томьёонд Poseidon2 эсвэл SHA-256-ийг илэрхий нэрлээгүй бол эндхүү `Hash` нь Iroha-ийн 32 байтын Blake2bVar хураангуй үүсгэдэг `iroha_crypto::Hash::new`-ийг хэлнэ.

### Талбайн Арифметик {#field-arithmetic}

Rust код нь талбарын элементийг `[0,p)`-д нэг протокол-стандартын `u64` утга байдлаар илэрхийлнэ. Нэмэх болон хасах нь:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

Өргөжүүлэх үйлдэл хамгийн түрүүнд 128-битийн үржвэрийг тооцоолно:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Голдилокс бууруулах нь дараа нь энэхүү тэгшитгэл ашиглана:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Хэрвээ:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

дээр нь редьюсер нь тооцоолдог:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

Гүйцэтгэлийн нөхцөл `p`-ыг үр дүн нэг протокол стандартын болох хүртэл нэмэх эсвэл хасдаг. Балансын ялгаа зэрэг тэмдэглэгдсэн бүхэл тоон утгуудыг дараах байдлаар оруулдаг:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 Эрэмбэлэлт {#poseidon2-permutation}

Poseidon2 сэлгэх байдал нь:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Үүний S-бокс нь:

$$
S(x)=x^5
$$

FastPQ нь дөрвөн бүрэн эргэлт, тавин долоон хэсэгчлэн эргэлт, дараа нь дахин дөрвөн бүрэн эргэлт хэрэглэдэг. `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` эргэлтийн константуудтай бүрэн эргэлт нь:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

Хэсэгчлэн дугуй нь:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Бүх нэмэлт ба үржүүлэгчид `F`-д хийгдэнэ. Нэг протокол-стандарт MDS матриц нь:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Талбайн криптографийн хэш тэг төлөвөөс эхэлдэг. Бүх бүрэн хэмжээний rate-2 блокууд `(u,v)` бүрт:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

Эцсийн блок нэг сүүлчийн солионы өмнө `1` дүүргэлтийн элементийг нэмнэ. Гаралт нь `x_0` байна.

### Олон нийтийн оролцооны холболт {#public-input-binding}

Хост нь датасын орон зайн ID-г `u64` утгыг 16-байт талбарын эхний найман жижиг эцсийн байтанд бичих замаар кодлодог:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Блок үүссэн цагийг миллисекундээс наносекунд руу хөрвүүлнэ:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Гүйлгээний олонлогийн хэш нь эрэмбэлсэн entrypoint хэшүүдийн байтын домэйны хэш байна:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

энд `h_i` нь эрэмбэлэгдсэн гүйлгээ ба цаг-trigger орцын криптограф хэшүүд юм. Нийтэд зориулсан нотолгоонд IO, хэрвээ `perm_root` эсвэл `tx_set_hash` бүгд тэг бол, нотлогч нь орлуулах утгуудыг бөглөдөг:

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

### Тоон хэвийн болгох {#numeric-normalization}

Тус бүрийн шилжүүлгийн дельтад зориулж, зорилтот арвантын хэмжээ нь дүн болон хоёр талын үлдэгдэл цагийн байдлын мэдээллийн үзэлтийн хооронд хамгийн их товлосон хэмжээ байна:

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

М mantissa нь `m` ба scale нь `q` гэсэн `Numeric` утгыг зөвхөн `m >= 0` ба `q <= s` байх үед хүлээн авна. Үүний FastPQ туршилтын утга нь:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Нормализаторын үр дүн `u64` дотор багтах ёстой.

### ганц протокол-стандарт захиалах процесс {#canonical-ordering}

Шугамын бүтцийг хийхээс өмнө багцыг шилжилтийн түлхүүр, үйлдлийн зэрэг, анхны оруулсан индексээр эрэмбэлнэ:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

Эрэмбийн амлалт нь `fastpq:v1:ordering` домэйн болон эрэмбэлсэн шилжилтүүдийн Norito кодчилол дээр тооцсон Poseidon2 талбарын хэш юм:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

энд `P` нь 7-байтын савлагаа, `E` нь Norito кодчлол, `D_o` нь `fastpq:v1:ordering`, харин `T*` нь эрэмбэлсэн шилжилтийн жагсаалт юм.

### Шилжүүлгийн тэгшитгэлүүд {#transfer-equations}

Шилжүүлэх хэмжээ `a`, илгээгчийн үлдэгдэл `f`, хүлээн авагчийн үлдэгдэл `t` тохиолдолд FastPQ мөрийг байгуулахаас өмнө хэвийнжүүлсэн гэрчийн утгуудыг баталгаажуулна:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Дараа нь шилжилтийн мөрүүд кодлогддог:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

Трэйс дотор гарын үсэгтэй дельта ариун тодоор `F`-д буурайдаг:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

Сонголттой нэг-дельта дамжуулалтын криптографийн таних чанарын утга нь кодлогдсон дамжуулалтын урьдчилсан дүрсийг эцэслэнэ:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Олон дельта дамжуулалтын транскриптүүдэд одоогийн формат нь энэ дээд түвшний криптографийн хураангуй утга байхгүй байхыг шаарддаг.

Шилжүүлэх бичлэгүүдийн хувьд хост эрх олголтын гол криптографийн танилцуулгын утга нь:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Мөрүүдийг мөрдөх {#trace-rows}

Ээлжлэн эрэмбэлэгдсэн шилжилтийн жагсаалт `n` бодит мөр агуулна. Трэйсийн урт нь хоёрын дараагийн зэрэг байх ёстой:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

Мууд `0..n-1` идэвхтэй; юу `n..N-1` бол нэмэлт мөрүүд. Тус бүр бодит мөр нь нэг үйлдлийн сонгогчтой:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Бүх сонгогч баганууд нь Boolean байна:

$$
s(s-1)=0
$$

Захирамжийн хайлтын мөрүүд яг л үүргийн олголт ба үүргийн цуцлалтын мөрүүд байна:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Тоон үйлдлийн мөрүүдэд:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Барилгачин мөн нэг бүрийн хөрөнгийн өөрчлөлтийг хянадаг:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Зөвхөн гаргах ба устгах мөрүүд нь нийлүүлэлтийн тоолох баарыг шинэчилдэг:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Метадата болон өгөгдлийн зайг хянах баганууд нь мөрийг материалжуулахын өмнө гаргасан талбарын криптографийн хэшууд юм:

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

Метадатын криптографийн хэш, өгөгдлийн зайны криптографийн хэш, болон слот нь хөрш мөрүүдийн дагуу тогтвортой байна:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Меркле багануудыг шилжүүлэх {#transfer-merkle-columns}

Шилжүүлгийн мөрүүд 32 түвшний сийрэг Merkle зам агуулна. Хостын нотолгоо байхгүй бол нотлогч мөрийн түлхүүр, өмнөх үлдэгдэл болон тухайн мөр илгээгч эсвэл хүлээн авагчийн тал эсэхээс тодорхойлогдох замыг үүсгэнэ.

Хуурамч замуудын хувьд, амтлагч давс нь илгээх мөрнүүдэд `fastpq:smt:from`, хүлээн авагч мөрнүүдэд `fastpq:smt:to` байдаг:

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

Синтетик навч ба дотоод зангууд нь:

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

Тус мөр нь бүх түвшинд бит `b_l`, ах дүү `s_l`, оролтын зангилаа `x_l`, болон гаралтын зангилааг `x_{l+1}` бүртгэдэг. Кодын салбарын дүрмийн дагуу:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Зөвшөөрлийн криптографик хэшиуд {#permission-hashes}

Үүрэг олгох ба цуцлах мөрүүд криптограф хэш эрхийн гэрч:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Хостын зөвшөөрөл хүснэгтийн root оролтуудыг дүрмийн байт, зөвшөөрлийн байт, болон үедийн байтаар эрэмбэлдэг бөгөөд дараа нь Poseidon2 Merkle модыг бүтээдэг:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Сонирхолтой өргөнтэй түвшнүүд эцсийн элементийг дахин гаргадаг.

### Криптографийн амлалтын утгыг мөрдөх {#trace-commitment}

Тус бүрийн мөрийн баганад `c`, FastPQ эхлээд баганын утгуудыг мөрийн домэйн дагуу интерполяц хийж, коэффициент векторийг криптографийн хэш хийдэг:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

Трассын үндэс нь баганын криптографийн амлалтын утгууд дээрх Poseidon2 Merkle үндэс юм:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Эцсийн trace амлалт нь домэйн, параметрийн багц, trace-ийн хэлбэр, баганын хураангуй болон trace-ийн үндэс дээр тооцсон байтын хэш юм:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

энд `D_c` нь `fastpq:v1:trace_commitment` байна.

### AIR Бүтэц {#air-composition}

V1 AIR найруулгын утга нь мөрийн орон нутгийн үлдэгдлийн шугаман нийлбэр юм. Транскрипт хоёр сорилыг жишээ болгож авдаг:

$$
\alpha_0,\alpha_1 \in F
$$

Тус бүрийн хөрш мөрний хос `(i,i+1)` дээр батлагч нь тооцоолно:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Үлдэгдлүүд `rho` нь кодын дарааллаар дараах байдалтай байна:

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

Тооцооны баганатай мөрүүдэд:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

Мөн тогтвортой багцын контекст баганын хувьд:

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

Тодорхойлогч нь `A_i`-ыг дээжлэж авсан мөрүүдийн нээлийн хувьд дахин тооцоолж, үүнийг AIR найруулгын Меркле үндсэн дор криптографын хувьд холбоотой найруулгын утгатай харьцуулан шалгаж байна.

### Бүтээгдэхүүн хайх {#lookup-product}

Зөвшөөрөл хайлтын аксумлятор нь Fiat-Shamir сорилын `gamma` аргыг ашиглаж байна. `s_perm` ба `perm_hash`-ийн бага зэрэгшилт өргөтгөлийн үнэлгээний дээр, гүйцэтгэсэн үржвэр нь:

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

Баримт нотолгооны тэмдэглэл:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Бага зэрэг өргөтгөл {#low-degree-extension}

`omega_T`-ыг мөрийн орчны генератор, `omega_E`-ийг үнэлгээний орчны генератор, `g`-ыг тохируулагдсан косетын хазайлтаар үзье. `v_i` утгатай мөрийн багананд интерполяци нь дараах коэффициентуудыг `a_j` үүсгэдэг бөгөөд:

$$
f(\omega_T^i)=v_i
$$

Бага зэрэгшлийн өргөтгөл нь ижил полиномыг косет дээр үнэлдэг:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

Энэ хэрэгжилт үүнийг коэффициентуудыг тэгш хуваагдлын офсетын хүчинтнүүдтэй үржүүлснээр FFT-ийн өмнө тооцдог:

$$
a'_j = a_j g^j
$$

тэгээд үнэлгээний домэйны дээр `a'`-г үнэлж байна.

CPU FFT нь бит эргүүлсэн оролт дээр давтамжтай radix-2 Cooley-Tukey хувиргалт юм. Алхамын урт `L`, хагас урт `H=L/2`, болон алхамын үндсэн дээр:

$$
\omega_L=\omega^{N/L}
$$

бүх нэгэн эрвээхэй тооцоолдог:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

Эсрэг FFT нь `omega^{-1}`-той адил хувиргалтыг гүйцэтгэж, эсрэг домайн хэмжээний харьцаагаар өсгөдөг:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Каталогийн үндсүүдийг ашиглахаас өмнө баталгаажуулна:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Каталогийн үндэснээс гаралтай жижиг домайнуудад үүсгэгч нь:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Мөр болон Навч криптографийн хэшүүд {#row-and-leaf-hashes}

LDE-ийн дараа, FastPQ нь бүх LDE баганын мөр бүр дээр криптографын хэш үүсгэнэ. `m` багануудын хувьд:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Хэрэв энгийн криптографийн хэшууд нь үнэлгээний домайн бус харин мөрийн трассын домайнд байвал нотлогч нь нэг мөрийн хэш баганыг нэг coset LDE процесс ашиглан интерполяц хийж өргөжүүлдэг.

### Мерклийн Нээлтүүд {#merkle-openings}

LDE утгуудыг багцуудад ангилдаг:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Бүх хэсгийн навч нь:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Мерклийн эцэг эх нь:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Сондгой түвшнүүд сүүлийн зангыг давтдаг. Асуултын замуудыг түвшин бүрийн асуултын навчийн индексийн тэгш/сэнз хэв шинжийн дагуу зүүн эсвэл баруун талаас хеш хийж баталгаажуулдаг.

Индекс `i` дахь навчны хувьд зам `(s_0,\ldots,s_{d-1})` үндэс `R`-ийн эсрэг давтамжаараа баталгааждаг:

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

Төлөвлөгөө зөвхөн дараах нөхцөлд дамжина:

$$
y_d=R
$$

AIR мөрийн ургамлын навчнууд нь:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR найрлагын навчнууд нь:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE лавлагааны нээлт мөн үнэлгээний индекс `i`-д нээгдсэн утга нь баталгаажсан хэсэгт байгааг шалгадаг:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Нугалах {#fri-folding}

FRI нь AIR хэвлэлийн үнэлгээнд криптографийн аргаар холбогддог. Тус бүрийн `l` давталт дээр транскрипт сорил `beta_l`-г сонгодог. Давхаргыг хамгийн сүүлчийн утгыг давтсанаар аритийн олшрогдсон хэмжээнд тохируулна. Артит хэмжээтэй бүлэг бүр дараах байдлаар нугалагдана:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

энд `a` нь FRI арит юм. Баталгаажуулагч нь дээжлэсэн асуултын гинж бүрийг шалгаж байгааг:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

мөн нээгдсэн FRI бүлгийг холбогдох FRI давхаргын үндэстэй нь баталгаажуулдаг.

### Фиат-Шаамирын тэмдэглэл {#fiat-shamir-transcript}

Нэг протокол-стандарт параметрийн толь бичиг транскриптийн криптографийн хэшийг SHA3-256 гэж тэмдэглэсэн. Одоогийн нотлогч ба баталгаажуулагчийн хэрэгжилт 32-байттай Blake2bVar криптографийн дайрлагын утга болох `iroha_crypto::Hash::new`-оор сорилтын байтуудыг гаргаж аваад, дараа нь эхний найман бага эцсийн байтыг `F`-д бууруулдаг:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Challenge дуудлага нь бүрэн хураангуйг transcript-ийн төлөвт нэмнэ. Дахин тоглуулах дараалал:

1. public IO, протоколын хувилбар, параметрийн хувилбар, ба параметрийн нэр
2. LDE үндэс ба үндсийг мөрдөх
3. `gamma`
4. AIR найруулгын сорилтууд `alpha_0`, `alpha_1`
5. AIR мөрийн үндэс ба AIR бүрдлийн үндэс
6. том бүтээгдэхүүнээ хайх
7. FRI давхаргын үндэс ба `beta_l` сорилтууд
8. ачигдсан асуултын индексүүд

Асуултын дээж авах нь 32-байтын сорил криптографийн хураангуйг үргэлжлүүлэн татаж, тэдгээрийг жижиглэн дуусгасан `u64` хэсгүүд болгон уншиж, хүссэн тооны давтагдашгүй индексийг олтол үргэлжлүүлдэг:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

Сонгосон багцыг эрэмбэлсэн дарааллаар буцаадаг.

### Шалгагчийн дахин тоглуулах {#verifier-replay}

Баталгаажуулагч эхлээд багцын криптографийн баталгааны утгыг дахин тооцоолж байна:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

мөн шаарддаг:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

Мөн олон нийтийн IO-ийг дахин сэргээдэг:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Бүх талбар нь нотолгооны олон нийтийн IO байтаар нэг бүрчлэн таарах ёстой. Дараа нь баталгаажуулагч хэвлэлийг дахин сэргээж, ижил үр дүнг гаргана:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Тухайн дээжлэгдсэн асуулт бүр `q` дээр дараахыг шалгана:

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

мөн:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

AIR бүрэлдэхүүний нээлт нь `R_air_composition` доор баталгаажсан байх ёстой. Дараа нь FRI гинж нь ижил `A_q` –ээс эхэлж, эцсийн FRI навч руу FRI үндэсний дор баталгаажсан байх ёстой.

## Шалгагч юу шалгадаг вэ {#what-the-prover-checks}

Зам мөрийг байгуулахаас өмнө, FastPQ баталгаажуулагч нь багцыг шилжилтийн түлхүүр, үйлдлийн зэрэг, оруулсан дарааллаар стандарт хэлбэрт оруулдаг. Шилжүүлгийн мөрөнд мөн бичлэгийн мета өгөгдөл шаардлагатай. Шилжүүлгийн мөртэй боловч шилжүүлгийн бичлэггүй багц хүчин төгөлдөр бус байна.

Шилжүүлэх дэвтэрийн хувьд шалгаж үзэх зүйлс нь дараах байдалтай байна:

- илгээгчийн үлдэгдэл хэтрэлт үүсгэж болохгүй
- `sender_after` нь `sender_before - amount`-тай тэнцүү байх ёстой
- `receiver_after` нь `receiver_before + amount`-тай тэнцүү байх ёстой
- төлбөрийн багцын бүх шилжүүлгийн мөрийг бичлэгт оруулах ёстой
- нэгэн дельта Poseidon криптографийн хураангуй утга байх тохиолдолд бичвэрийн өмнөх дүрсийг таарч байх ёстой
- хангалттай sparse-Merkle баталгаануудыг хувилбар 1 гэж задалж унших ёстой; алга болсон замуудыг тодорхойлогдсон нийлэг баталгаагаар бөглөнө

Трэйс нь шилжүүлэх, гаргах, устгах, үүрэг олгох, үүрэг хасах, метадата тохируулах, эрх харах мөрүүдийн селектор багануудыг агуулдаг. Тоон үйлдлийн мөрүүд мөн гарын үсэгтэй ялгаа, эд хөрөнгийн тус бүрт хэрэгжих ялгаа, нийлүүлэлтийн тоолууруудыг агуулдаг.

## Шалгагчийн гүйцэтгэлийн эгнэ {#prover-lane}

`iroha3d` нь FastPQ баталгаажуулагчийн гүйцэтгэлтийн замыг эхлүүлэхдээ баталгаажуулагчийн арын хэсгийг эхлүүлж чадвал ажиллуулдаг. Гүйцэтгэлтийн зам нь хязгаарлагдмал дараалалтай арын даалгавар юм. Блок гүйцэтгэлийн гэрчийг гаргасны дараа, консенсусын эцсийн баталгаажуулалтын зам блокын криптографийн хэш, өндрөөр, харагдац, гэрч агуулсан нотлогчийн ажлыг илгээнэ.

Хэрвээ гүйцэтгэх эгнээ ажиллахгүй эсвэл дарааллын эгнээ дүүрсэн бол ажлыг алгасч, энгийн блок боловсруулалт үргэлжилнэ. Энэ нь арын програмчлагдсан баталгаажаагчийн гүйцэтгэх эгнээ нь гүйлгээ зөвшөөрөх эсвэл консенсусын хаалга биш гэсэн үг юм. Энэ нь аль хэдийн гүйцэтгэсэн төлөвийн дээр баталгаа үйлдвэрлэх зам юм.

Гүйцэтгэлийн зурвас нь дараах зүйлсээр батлагчийг бүтээдэг:

```text
parameter = "fastpq-lane-balanced"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Хоёр тохиргоо аль аль нь `cpu`-д анхдагчаар тохируулагдсан. `gpu`-г сонгох нь ил тод, хаагдсан хүсэлт юм: хэрэв GPU дэмжлэгийг компайллаагүй эсвэл хүссэн GPU арын систем байхгүй бол урьдчилсан шалгалтад унадаг, нотлогчийн гүйцэтгэлийн суваг идэвхгүй хэвээр байна. Эхний хувилбарт `auto` утга байхгүй бөгөөд хүссэн GPU горимоос CPU руу буцаахгүй.

## Баталгаажуулалт {#verification}

FastPQ нотолгооны шалгалт нь протоколын стандарт багцын амлалтыг дахин бүтээж, нийтийн transcript-ийг давтан ажиллуулна. Баталгаажуулагч протоколын хувилбар, параметрийн багцын хувилбар, replay хязгаар, trace амлалт, нийтийн оролт, түүвэрлэсэн Merkle нээлт, AIR нээлт болон FRI query chain-ийг шалгана.

Өгөгдсөн хариулах хязгаарууд нь үүнд орно:

|Хязгаар|Анхдагч|
| ------------------ | ------: |
|Шилжилтийн мөрүүд|     256 |
|Багцын өгөгдлийн хэмжээ|256 KiB|
| FRI давхаргууд |      16 |
|Асуулгын нээлтүүд|     128 |

## Nexus Батлагдсан дамжуулагч {#nexus-verified-relays}

Nexus AXT баталгаажуулах өгөгдлийн савнууд `AxtFastpqBinding`-ыг оруулах боломжтой. `RegisterVerifiedLaneRelay` ажиллах үед, Iroha:

1. гүйцэтгэлийн эгнээний дамжуулагч өгөгдлийн сав болон FastPQ нотлох материалын баталгааг шалгана
2. өгөгдлийн сан болон техникийн тайлбарын үндсийг шалгана
3. AXT нотлох баримтын өгөгдлийн савыг тайлбарлаж өгдөг
4. нь `fastpq_binding`-ыг шаарддаг
5. тэр холбоосоос FastPQ бөөгнөлийг дахин бүтээнэ
6. оруулагдсан FastPQ нотлөлтийг тайлбарлана
7. дахин бүтээсэн багц ба нотолгоонд FastPQ баталгаажуулагчийг дуудаж байна

Хэрэв баталгаажуулалт амжилттай болвол, Iroha нь дамжуулах лавлагаа, эх өгөгдлийн сав, баталгаажуулалтын ачааны криптограф хэш, баталгаажуулалтын өндөр, техникийн тайлангийн үндэс, болон FastPQ холболтыг агуулсан `VerifiedLaneRelayRecord`-ийг хадгална.

гүйцэтгэлийн зурвасын дамжуулагч өгөгдлийн савууд мөн шахмал FastPQ баталгааны материалыг агуулдаг. Энэхүү материал нь гүйцэтгэлийн зурвасын id, өгөгдлийн сангийн id, блокийн өндөр, баталгаажуулах өндөр дээрх криптографийн хураангуй утга юм, төлбөрийн гүйлгээний криптограф хэш, техникийн мэдүүлгийн үндэс. Релей нь зөвхөн QC ба хүчин төгөлдөр FastPQ нотлох материал аль аль нь байвал нэгтгэж болох юм.

### AXT Математик холболт {#axt-binding-math}

Nexus AXT мэдээллийн савуудад, `AxtFastpqBinding`-ийг баталгааны дахин тоглуулахын өмнө каноник болгож засдаг. Олон давхаргүй параметрийн утгууд `fastpq-lane-balanced` гэж үндсэн утгатай; олон давхаргүй шалгагчийн id болон хувилбар нь `fastpq` ба `v1` гэж үндсэн утгатай; шаардлагын төрөл нь тайрч бага үсэгтэй болдог.

AXT FastPQ олон нийтийн оролтууд нь тодорхойлогдсон байт криптографийн хэшейүүд болно:

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

AXT шилжих түлхүүрүүд нь:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

Төрөлжүүлсэн `authorization` нэхэмжлэл үүрэг олгох мөр оруулна:

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

мөн зөвшөөрлийн бодлогыг холбож буй мета өгөгдлийн мөр. `compliance` шаардлага нь хоёр мета өгөгдлийн мөр оруулна: нэг нь бодлогын, нөгөө нь зорилтот өгөгдлийн сангуудынх.

`tx_predicate` ба `value_conservation` хувьд, холболт нь эерэг эх сурвалж эсвэл очих хэмжээ агуулсан үед ил тод нөлөөний хэмжээг ашиглана. Үгүй бол код нь хязгаарлагдмал тодорхой хэмжээ гарган авдаг:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Дараа нь ижил шилжүүлэх тэгшитгэлүүдийг ашиглана:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Синтетик илгээгч ба хүлээн авагчийн дансны дугаарууд нь түлхүүрийн үрээр үүсгэгддэг:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Шилжүүлгийн багийн криптографийн хэш нь:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT batch манифестын хураангуй нь каноник холболтын Norito кодлол дээрх SHA-256 байна:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Ил тод Мессежийн Баталгаанууд {#sccp-transparent-message-proofs}

SCCP туслах програм хангамжийн багц нь мөн FastPQ-ийг ил тод гинжин хэлхээ дамжин мессежийн баталгааны хэлбэрт ашигладаг. Энэ зам нь `iroha3d` арын давхарга дахь баталгаажуулагчийн гүйцэтгэлийн сувагтай тусдаа байна. Энэ нь SCCP мессежийн нотлох баримтын багц болон техникийн manifest-аас шууд FastPQ багц үүсгэж, дараа нь гарсан нотлох баримтыг нээлттэй баталгаажуулалтанд зориулан боодог.

SCCP багц нь `fastpq-lane-balanced` ба гурван мета өгөгдлийн шилжилтийг ашигладаг:

|Түлхүүр|Үйл ажиллагаа|
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

Түүний олон нийтийн оролт нь SCCP ил тольтой дотоод нотолгооноос гаргаж авсан:

| FastPQ оруулга | SCCP эх сурвалж                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        |Тайлбарласан криптографийн хэш дээрх Blake2b криптографийн дигестын эхний 16 байт|
| `slot`        |Төгсгөл хүртээмжийн өндөр|
| `old_root`    |Тээвэрлэгчийн криптографийн хэш|
| `new_root`    |криптографийн амлалт утгын үндэс|
| `perm_root`   |Төгсгөл блок криптографын хэш|
| `tx_set_hash` |Төлөвлөсөн криптографийн хэш|

SCCP нэг протокол стандарт кодлогч нь бүхэл тоог бага эцсийн дарааллаар бичиж, хувьсах урттай битийн массивыг дараах байдлаар кодлоно:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Ил тод олон нийтээс орж ирж буй өгөгдлийн бит утга нь:

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

Ил тод мэдэгдлийн байт нь хувилбар, сүлжээний гэр бүл, орон нутгийн болон нөгөө талын домайн, аюулгүй байдлын загвар, тулгуур засаглал, дансны кодек, эцсийн байдалын загвар, баталгаажуулагчийн зорилт, баталгаажуулагчийн арын гэр бүл, урт урьдчилан заагдсан сүлжээ/ар/тодорхойлолтын талбаруудыг нийлүүлсэн юм. зорилтот холболтын криптографийн хэш, дансны кодек түлхүүр, ачааны төрөл, нийтийн оролтын байтууд, ба ачааны криптографийн хэш. Мөрийн криптографийн хэш нь:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

Энэхүү нотлох замын FastPQ өгөгдлийн сангийн ID нь өөр нэг Blake2b криптографийн хураангуй утгын эхний арван зургаан байт юм:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ бөөнцөг яг ингэж байна:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

дараа нь ижил FastPQ эрэмбэлэх журмаар эрэмбэлнэ.

OpenVerify баталгаажуулагчийн амлалт нь SCCP мессежийн backend нэр болон протоколын стандарт FastPQ баталгаажуулагчийн тодорхойлолт дээр тооцсон SHA-256 юм:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Түүхий FastPQ нотолгоог Norito кодчилсоноор `StarkFriOpenProofV1` дотор хадгалж, дараа нь `OpenVerifyEnvelope`-д `Stark` сервертэй хамт ороосон. SCCP баталгаажуулалт нь адилхан дахин сэргээдэг FastPQ багцыг багцаас болон техникийн мэдүүлгээс шалгаж, нээлттэй баталгаажуулалтын өгөгдлийн савны метадатыг шалгаж, FastPQ баталгаажуулагчийг дахин бүтээсэн багц болон нотлол дээр ажиллуулна.

## Параметрийн багц {#parameter-sets}

Нэг протокол-стандарт параметрийн каталог нь хоёр параметрийн багцыг ил болгож байна. Хост баталгаажуулагчийн гүйцэтгэх зам нь одоогоор `fastpq-lane-balanced`-г ашиглаж байна.

|Параметр|Зорилго|Талбай|криптографийн хэшүүд| FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` |нотлогчийн тэнцвэртэй нэвтрүүлэх чадвар|Goldilocks квадрат өргөтгөл|Poseidon2 амлалтууд, каталогийн SHA3 шошго|arity 8, blowup 8, 46 query|
| `fastpq-lane-latency`  |сааталд мэдрэмтгий гүйцэтгэлийн эгнээ|Goldilocks квадрат өргөтгөл|Poseidon2 амлалтууд, каталогийн SHA3 шошго|arity 16, blowup 16, 34 query|

Хоёулаа 128-битийн аюулгүй байдлыг зорьж, `2^16` мөрийн домайн хэмжээг ашигладаг. Rust V1 бичвэрийг дахин тоглуулах код одоогоор Fiat-Shamir сорилтын байтыг `iroha_crypto::Hash::new` ашиглан гаргаж авдаг бөгөөд шууд SHA3-256-г дуудахгүй.

Rust нотлогч ашигласан яг каталогийн тогтмолууд нь:

|Тогтмол| `fastpq-lane-balanced` | `fastpq-lane-latency` |
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

## Тохиргоо {#configuration}

FastPQ тохиргоо нь `zk.fastpq`-ийн доор ороод байна.

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

Ижил гүйцэтгэл ба телеметри шошгуудыг `iroha3d`-аас давхарлах боломжтой:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Төлөвлөлтийн талбаруудын хувьд орчны хувьсагчид бас дэмжигддэг. FastPQ-д тодорхой хувьсагчид нь дараахь зүйлсийг агуулна:

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

## Хэмжилтүүд {#metrics}

Телеметрийг идэвхжүүлсэн үед, FastPQ арын сонголт болон Metal програм хангамжийн гүйцэтгэл орчны зан байдалд зориулсан хэмжүүрүүдийг экспортолдог:

|Метрик|Өгүүлэмж|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Сэргээсэн ба шийдсэн гүйцэтгэлийн горимыг арын болон төхөөрөмжийн шошгоор|
| `fastpq_poseidon_pipeline_total`  |Хүсэлт гаргасан ба шийдсэн Poseidon програм хангамжийн боловсруулах ажлын урсгалын зам|
| `fastpq_metal_queue_depth`        |Метал хоолойн хязгаар, нисэж буй хамгийн их тоо, илгээх тоо, болон дээж авах цонх|
| `fastpq_metal_queue_ratio`        |Металлын дараалал ачаалалтай ба давхцлын харьцаа|
| `fastpq_zero_fill_duration_ms`    |Metal-ийн гүйцэтгэлд зориулсан Host тэглэх хугацаа|
| `fastpq_zero_fill_bandwidth_gbps` |Гаралтай тэгээр дүүргэсэн зурвасын өргөн|

Ерөнхий гүйцэтгэлийн анхан шатны үнэлгээнд зориулж, эдгээрийг [Гүйцэтгэл ба үзүүлэлтүүд](/mn/guide/advanced/metrics.md)-д жагсаасан санал нэгдэл болон дарааллын дохиотой хамт ашиглана уу.

## Холбогдох лавлагаа {#related-reference}

- [Өгөгдлийн загварын схем](/mn/reference/data-model-schema.md) зангилаа-эрх бүхий төрөл цэгийн цагийн өгөгдлийн үзэлт
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ сонголтууд](/mn/reference/iroha3d-cli.md#fastpq-overrides)
