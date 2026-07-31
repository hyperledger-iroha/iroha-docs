---
translation_locale: kk
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ болып табылады Iroha Ол ... STARK таңдалған орындалу эффекттері үшін дәлелдеу жолы. Бұл қалыпты транзакция орындау немесе консенсус алмастамайды. ISI, IVM, және Sumeragi әдеттегідей; FastPQ детерминистік орындалу куәсын жеп, қолданатын эффекттерді дәлелдік партияларға айналдырады.

Қазіргі қоректенуші интеграцияның негізгі үш жолы бар:

- Блоктарды орындау кезінде есепке алынған мөлдір сандық активтер аударымы
- Nexus тексерілген жолақ релелері AXT дәлелдеме конверті FastPQ бұзылу
- SCCP ашық тексеру конвертіне FastPQ дәлелдемесін орайтын мөлдір хабарламаға куәлік беретін көмекшілер

## Куәгерлік жолды ауыстыру {#transfer-witness-path}

Өткінші сандық аударымдар нұсқаулық тепе-теңдіктерді өзгерткенде құрылымдалған трансфер транскриптісін жасайды.

- бастапқы шот, мақсатты шот, активтердің анықтамасы және сомасы
- Жеткізуші мен алушы теңгерімдері - трансферттен бұрын және кейін
- транзакцияның кіріс нүктесі хэш ретінде пайдаланылады
- Ұсынылатын есептен алынған уәкілетті орган деректері
- Бір дельталы транскрипттерге арналған Посейдон сыныбы

Партиялық трансферлерде бірнеше дельталы бір транскрипт қолданылады.

Блокты аяқтау кезінде Iroha бұл транскриптілерді кіріс нүктесі хэш бойынша топтастырады. Орындау куәгері кейін бастапқы транскрипт топтамаларын да, провер үшін дайындалған FastPQ ауысу партияларын да алып жүреді.

Әрбір трансфер дельтасы екі өтпелі жолға айналады:

|Сызық|Кілт пішіні |Алдын ала баға |Бағадан кейінгі |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Жеткізуші дебеті |`asset/<asset-definition>/<source-account>` |жөнелтуші балансы бұрын |жөнелтушінің балансы |
|Алушы кредиті |`asset/<asset-definition>/<destination-account>` |қабылдаушы балансы бұрын |қабылдаушы балансы |

Сандық мәндер бүтін сандық куәлік бірліктеріне қалыпқа келтіріледі. FastPQ партиясы үшін егер таңдалған ондық шкалада ол теріс емес `u64` ретінде көрсетілмесе, мәні қабылданбайды.

## Қоғамдық кіріс {#public-inputs}

Әрбір FastPQ ауысу партиясында блок пен орындалу контекстіне дәлелді байланыстыратын қоғамдық кірістер болады:

|Кіріс |Мағынасы |
| ------------- | --------------------------------------------------------------- |
|`dsid` |Деректер кеңістігінің идентификаторы кішкентай байт ретінде кодталған |
|`slot` |Блоктарды құру уақыты наносекундтарға аударылды |
|`old_root` |Ата-ана мемлекетінің түпнұсқасы орындалған куәден алынған .|
|`new_root` |Өлкеден кейінгі тамыр , жазалау куәсынан алынған .|
|`perm_root` |Посейдонның белсенді рөлге рұқсат беруіне қатысты міндеттемесі |
|`tx_set_hash` |Тартиптелген транзакция мен уақыт триггері кіру нүктесі хэштегі |

Үйлестіруші `fastpq-lane-balanced` -ды осы партиялар үшін орнатылған каноникалық параметр ретінде пайдаланады.

## Математикалық модель {#mathematical-model}

Осы бөлімде ағымдағы Rust провер және верификатор арқылы іске асырылатын арифметика сипатталады. Төмендегі барлық өріс операциялары Goldilocks бастапқы өрісі бойынша:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ Poseidon2 арқылы қолданылады `F` Тегістік тапсырмалар үшін. `t = 3`, мөлшерлемесі `r = 2`, және қуаттылығы `1`. Хаш 2 блоктарда өріс элементтерін сіңіріп, бір өріс элементін қосады . `1` соңғы пермутациядан бұрын:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Байт жіптері 7 байттан үлкен кішкентай бөліктерге жинақталған, сондықтан әрбір бөлік `p` -тен төмен болады:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Доменге бөлінетін өрістің хештары келесідей көрсетіледі:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Байт-домен дигеттерінен басталатын хештар үшін FastPQ өріске алғашқы сегіз кішкентай андиан байтын карталайды:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Мұнда `Hash` құралдар Iroha Ол ... `iroha_crypto::Hash::new`, 32-байтты Blake2bVar дигесті, егер формула Poseidon2 немесе SHA-256.

### Өрістің арифметикасы {#field-arithmetic}

Қауымдастық Rust код өрістегі элементтерді канондық ретінде білдіреді `u64` мәндері `[0,p)`. Қосылу және алу мыналар:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

Көбейту ең алдымен 128 битті есептейді:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Содан кейін Goldilocks азайту сәйкестігін пайдаланады:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Егер:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

Содан кейін азайтушы есептейді:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

Орындалу шартты түрде `p` қосып немесе алып тастайды. Нәтижесі каноникалық болады. Қол қойылған бүтін сандар, мысалы баланс дельталары:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Посейдон2 пермутациясы {#poseidon2-permutation}

Poseidon2 пермутациясы:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Оның S-кестесі:

$$
S(x)=x^5
$$

FastPQ төрт толық раунд, елу жетi жартылай раунд, одан кейiн тағы төрт толық раунд. `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` болып табылады:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

Қисмалы дөңгелек:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Барлық қосылулар мен көбейтулер `F`. Каноникалық MDS матрицасы:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Елі хэш нөлдік күйден басталады. Әрбір толық ставка-2 блогы үшін `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

Соңғы бөлік `1` соңғы пермутациядан бұрын толтыру элементі. `x_0`.

### Қоғамдық кіріс міндетті {#public-input-binding}

Хост `u64` құнын 16-байт өрісінің алғашқы сегіз кішкентай ендіан байтына жазу арқылы деректер кеңістігі ID-ін кодтайды: .

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Блок жасау уақыты миллисекундтардан наносекундтарға айналады:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Транзакция жиынтығының хэшігі - сұрыпталған кіріс нүктесі хэштегінің үстінен байт-доменге арналған хеш:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

мұнда `h_i` транзакция және уақыт триггері кіріс нүктесі хэштегі болып табылады. IO, егер `perm_root` немесе `tx_set_hash` барлық нөл болса, провер кері қайтару мәндерін толтырады:

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

### Сандық қалыптау {#numeric-normalization}

Әрбір трансфер дельтасы үшін мақсатты ондық масштаб - бұл соманың ең жоғары кесілген масштабы және екі теңестіру сұлбалары:

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

А `Numeric` мантиссамен құн `m` және өлшемі `q` тек қана `m >= 0` және `q <= s`. Оның FastPQ куәліктің мәні:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Нормалды нәтиже `u64` құрамына сәйкес келуі тиіс.

### Каноникалық тапсырыс {#canonical-ordering}

Табыс жасаудан бұрын партияны өтпе кілті, жұмыс дәрежесі және бастапқы ендіру индексі бойынша сұрыптауға болады:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

Тапсырыс беру міндеттемесі Poseidon2 өрісінің `fastpq:v1:ordering` доменінің және сұрыпталған ауысулардың Norito шифрлауының үстінде хэш болып табылады:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

мұнда `P` 7 байттан тұратын қаптама, `E` болып табылады Norito кодтау, `D_o` болып табылады `fastpq:v1:ordering`, және `T*` түрлендіру тізімі болып табылады.

### Трансферлік теңдеулер {#transfer-equations}

Алу сомасы үшін `a`, жөнелтуші балансы `f`, және алушы балансы `t`, FastPQ ізді жасаудан бұрын қалыпты куәлік мәндерін растайды:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Содан кейін ауысу жолдары кодталады:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

Табыс ішінде қол қойылған дельталар `F` болып төмендейді:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

Функционалды бір-дельталық көшіру диаграммасы кодталған көшірменің алдын ала бейнесін жасайды:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Көп дельталық трансфер транскриптілері үшін қазіргі форматта осы жоғары деңгейдегі дигестің болмауы қажет.

Қабылдаушы орган трансферттік транскриптілерді өтеп алу үшін:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Ізілген жолдар {#trace-rows}

Сортталған ауысу тізіміне `n` нақты қатарлар кірсін. Табыс ұзындығы екіден кейінгі күш:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

Сызықтар `0..n-1` белсенді; қатарлар `n..N-1` толтыру саптары. Әрбір нақты қатарда бір операциялық таңдаушы жиынтығы бар:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Барлық селекторлық бағандар boolean:

$$
s(s-1)=0
$$

Рұқсат іздеу қатарлары рөлді беру және рөлді қайтару саптары:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Сандық операциялар жолақтары үшін:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Құрылыс жасаушы сондай-ақ активтер бойынша дельталарды орындайды:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Жабдықтау есептегішін тек минда және күйдіру қатарлары ғана жаңартады:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Метадеректер мен деректер кеңістігінің із бағаналары - жолды материализациялаудан бұрын алынған өрістер хэшесі:

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

Метамәліметтер хэшігі, деректер кеңістігінің хэшігі және ұяшығы көршілес ізді жолдар бойынша тұрақты:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Меркл бағаналарын ауыстыру {#transfer-merkle-columns}

Трансферлік жолдар 32 деңгейлі жалпақ Меркл жолын қамтиды. Егер қоректендіру дәлелі жоқ болса, провер реттік кілтіден детерминистік жолды синтездейді, алдын ала теңгерімделеді және реттік жіберуші немесе қабылдаушы тарап болып табылса да.

Синтетикалық жолдар үшін дәмді тұз `fastpq:smt:from` жөнелтуші қатарлар үшін және `fastpq:smt:to` қабылдаушы қатарлар үшін:

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

Синтетикалық жапырақтар мен ішкі түйіндер:

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

Табыс бітті тіркейді `b_l`, бауырлас `s_l`, кіріс түйіндері `x_l`, және шығыс түйіні `x_{l+1}` Кодтың тармақ конвенциясымен:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Рұқсаттар шешелері {#permission-hashes}

Ролды беру және қайтару қатарлары рұқсатты куәландыру:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Қабылдаушы рұқсаттар кестесі түбір жазуларды рөл байттары, рұқсат байттары және эпоха байттары бойынша жіктейді, содан кейін Poseidon2 Merkle ағашын құрады:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Қисық ен деңгейлері соңғы элементті қайталайды.

### Пайдалануы {#trace-commitment}

Әрбір із тізбегі `c`, FastPQ үшін, алдымен, бағананың мәндерін із доменінің үстінен интерполациялап, коэффициент векторын хэш етеді:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

Табыс түбірі - бағана міндеттемелерінің үстіндегі Poseidon2 Merkle түбі:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Ақырғы трас міндеттемесі домен, параметрлер жиынтығы, трас пішіні, баған дигестері және трас тамырлары бойынша байт хэші болып табылады:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

мұнда `D_c` - `fastpq:v1:trace_commitment`.

### AIR құрамы {#air-composition}

V1 AIR құрамының мәні қатар-орындардағы қалдықтардың сызықтық комбинациясы болып табылады.

$$
\alpha_0,\alpha_1 \in F
$$

Әрбір жапсарлас қатар жұп `(i,i+1)` үшін провер есептейді:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Қалдықтар `rho` коды бойынша:

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

Сандық бағандар бар жолдар үшін:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

Ал тұрақты партиялық контекст бағандары үшін:

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

Тексергіш `A_i` сынамаға алынған жолдың ашық орындары үшін қайта есептеледі және оны AIR құрамының Merkle тамыры бойынша жасалған құрамындағы құнмен салыстырғанда тексереді.

### Іздестіру өнімі {#lookup-product}

Рұқсат іздеу аккумуляторы Fiat-Shamir сынағын пайдаланады `gamma`. Төмен дәрежелі кеңейту бағалары бойынша `s_perm` және `perm_hash`, жұмыс істеп тұрған өнім:

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

Дәлелдеу жазбалары:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Төменгі деңгейлі кеңейту {#low-degree-extension}

Олай етсін `omega_T` іздендіру доменінің генераторы болуы, `omega_E` бағалау доменінің генераторы және `g` конфигурацияланған косеттінің орнын толтыруы. `v_i`, интерполяция коэффициенттер береді `a_j` былайша:

$$
f(\omega_T^i)=v_i
$$

Төмен дәрежелі кеңейту косеттегі бірдей көптікті бағалайды:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

Осыны іске асыру коэффициенттерді FFT алдындағы coset offset күшімен көбейту арқылы есептейді:

$$
a'_j = a_j g^j
$$

содан кейін `a'` бағалау доменінде бағалау.

Қауымдастық CPU FFT редикс-2 Cooley-Tukey түрлендіруі биттік кері кірістер бойынша. `L`, жартылай ұзындығы `H=L/2`, және этаптық тамыр:

$$
\omega_L=\omega^{N/L}
$$

әрбір бауырлас есептейді:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

FFT керісі `omega^{-1}`мен бірдей трансформацияны жүзеге асырады және кері домен өлшемі бойынша масштабталады:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Каталогтың тамырлары пайдаланудан бұрын расталады:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Каталог тамырынан алынған кіші домендер үшін генератор:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Сызық және жапырақ шешелері {#row-and-leaf-hashes}

Одан кейін LDE, FastPQ барлық жолақтардағы әр жолдың хэштегі LDE бағаналар. `m` бағандар:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Егер жолақтың хештары бағалау доменінен гөрі іздік доменде болса, провер бұл бір қатарлы хеш бағанды LDE процесін қолдана отырып интерполяциялап, кеңейтеді.

### Меркл ашылымдары {#merkle-openings}

LDE мәндері мынадай бөліктерге топтастырылады:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Әр бөлік жапырақ мынадай:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Меркл ата-анасы:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Бірқалыпты деңгейлер соңғы түйінді қайталайды. Сұрау салу жолдары әр деңгейдегі сұрау салған параметрінің сәйкестігіне сәйкес сол немесе оң жақтан хэш арқылы тексеріледі.

Индекске арналған жапырақ үшін `i`, жол `(s_0,\ldots,s_{d-1})` тамырға қарсы тексеріледі `R` қайталану арқылы:

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

Тексеру тек:

$$
y_d=R
$$

AIR ізді жолдар жапырақтары:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR құрамындағы жапырақтар:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE сұранысының ашылуы, сондай-ақ бағалау индексі `i` бойынша ашылған мәннің оның куәландырылған бөлігінде бар екенін тексереді:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Қабаттау {#fri-folding}

FRI міндет етеді AIR Құрылымды бағалау. `l`, транскрипті үлгiлер қиындық `beta_l`. Қабат соңғы мәнді қайталап, ариттің бірнеше есеге толтырылады.

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

мұнда `a` - FRI аралығы. Тексергіш әрбір үлгіге алынған сұрау салу тізбектері үшін:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

және әрбір ашылған FRI топты тиісті FRI қабаттың тамырымен куәландырады.

### Fiat-Shamir көшірмесі {#fiat-shamir-transcript}

Қаноникалық параметрлер каталогы транскрипті хэшін SHA3-256. Қолданыстағы провер және верификаторды іске асыру қиындық байттарын шығарады `iroha_crypto::Hash::new`, Бұл 32 байттан тұратын Blake2bVar дигесті болып табылады, содан кейін алғашқы сегіз кішкентай эндиан биттерін `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Тақалдау шақырулары транскрипттің толық дигесін қосады. Қайта ойнау тәртібі:

1. қоғамдық IO, протокол нұсқасы, параметр нұсқасы және параметр атауы
2. LDE тамыры және іздері
3. `gamma`
4. AIR құрамындағы қиындықтар `alpha_0`, `alpha_1`
5. AIR ізді тамыр және AIR құрамындағы тамыр
6. іздеу ұлы өнім
7. FRI қабаты тамырлары және `beta_l` қиындықтары
8. үлгіні бойынша сұраныс индекстері

Сұраныс үлгіні 32 байттан тұратын сынақ дигеттерін тартады және оларды сұрау салынған бірегей индекстер санын алғанға дейін `u64` аз сандық бөлшектер ретінде оқиды:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

Үлгіленген жиынтықты сұрыпталған ретпен қайтару керек.

### Тексеруші қайта ойнау {#verifier-replay}

Тексеруші бірінші кезекте партиялық міндеттемелерді қайта есептейді:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

және мыналарды талап етеді:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

Ол сондай-ақ мемлекеттік IO қайта құруды жүзеге асырады:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Әрбір өріс дәлелдеудің жалпы IO байт-байтқа сәйкес келуі тиіс. Тексергіш сол транскрипті қайта құруды және оны шығарады:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Үлгіге алынған әрбір сұрау салу үшін `q` тексереді:

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

және:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

Қауымдастық AIR құрамының ашылуы куәландыруы тиіс `R_air_composition`. Қауымдастық FRI сызығы сол жерден басталады `A_q` және расталған түпнұсқада аяқталуы тиіс FRI терминалдың астындағы жапырақ FRI тамыр.

## Пайғамбардың не тексергені {#what-the-prover-checks}

Тректі құрудан бұрын FastPQ провер топтық тапсырысты өтпе кілтісі, операция дәрежесі және ендіру тәртібі бойынша каноникализациялайды. Алу тізбелері транскрипт метамәліметтерін қажет етеді. Алу терілері бар партия, бірақ көшірме транскрипттері жоқ жарамсыз.

Алу транскриптісі үшін провайдерлік тексерулер мыналарды қамтиды:

- жөнелтуші теңгерімінің төменгі ағыны болмауы тиіс
- `sender_after` тең болуы тиіс `sender_before - amount`
- `receiver_after` тең болуы тиіс `receiver_before + amount`
- транскрипт партиядағы әрбір көшірме жолдарын қамтыуы тиіс
- Poseidon-ның бір дельталы дигеті, егер бар болса, транскрипттің алдындағы суретіне сәйкес келуі тиіс
- шартты түрде қатерлі-Меркл дәлелдемелері 1-версияға шифрлансын; жоғалған жолдар детерминистік синтетикалық дәлелдемелермен толтырылады.

Тректе көшіру, монета, күйдіру, рөл беру, рөлді қайтарып алу, метамәліметтер жиынтығы және рұқсат іздеу қатарлары үшін таңдаушы бағандар бар. Сандық операциялар қатарларында қол қойылған дельталар, активтер бойынша дельталар және жеткізу санағыштар болады.

## Провер Лейн {#prover-lane}

`irohad` іске қосылған кезде FastPQ prover жолын бастайды, егер prov backend-ті бастауға болады. Lane - бұл шектелген кезегі бар аяқтық тапсырма. Блок орындау куәсін шығарғаннан кейін, commit жолы блок хэшін, биіктігін, көрініс пен куәсын қамтитын prover жұмысын ұсынады.

Егер жол жүрмесе немесе кезек толы болса, жұмыс өткізіледі және қалыпты блок өңдеу жалғасады. Бұл фоновый провер лентасы транзакцияны қабылдау немесе консенсус қақпасы емес дегенді білдіреді. Ол қазірдің өзінде орындалған мемлекет бойынша дәлелді-өндірістік жолы.

Жолдың құрамында мыналар бар:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` тексерушіге қол жетімді артта қалуды таңдауға мүмкіндік береді. `cpu` жіптерді орындау CPU. `gpu` артықшылықтары GPU орындау, CPU артта қалу, онда артта тұрған ядро талап етілген ядроларды пайдалана алмайды.

## Тексеру {#verification}

FastPQ дәлелді тексеру каноникалық партияның міндеттемелерін қалпына келтіреді және қоғамдық транскриптті қайтарады. Тексеруші протокол нұсқасын, параметрлерді орнату нұсқасын, қайтару шектерін, ізділік міндеттемесін, қоғамдық кірістерді, үлгіні Меркл ашуларын тексереді; AIR ашық орындар, және FRI сұраныс тізбегі.

Әдеттегі қайта ойнау шектері:

|Шекарасы |Әдеттегісі|
| ------------------ | ------: |
|Өтпелі жолдар |     256 |
|Партиялық жүк көлемі |256 KiB |
|FRI қабаттар |      16 |
|Сұрау салу орындары |     128 |

## Nexus Тексерілген релелер {#nexus-verified-relays}

Nexus AXT дәлелдеме конверттері `AxtFastpqBinding`. Қашан `RegisterVerifiedLaneRelay` орындайды, Iroha:

1. жолақ эстафетасының қаптамасын және FastPQ сынақ материалдарын тексеру
2. деректер кеңістігін және деректі тамырды тексереді
3. AXT куәлік конвертін декодтайды
4. `fastpq_binding` талап етеді
5. FastPQ партиясын осы байланыстан қайта құру
6. кіріктірілген FastPQ дәлелді кодты өшіреді
7. қалпына келтірілген партия мен дәлелдеме бойынша FastPQ тексерушіге шақырады

Егер тексеру сәтті болса, Iroha сақтау `VerifiedLaneRelayRecord` эстафетаны, түпкілікті конвертті, дәлелді пайдалы жүктеме хэшін, тексеру биіктігін, манифесті тамырды қамтитын; және FastPQ байланыстыру.

Жол релесі конверттері де компактты болады FastPQ дәлелдеу материалы. Материал - жол ID, деректер кеңістігі ID, блок биіктігі, тексеру биіктігін, блок басының хешын, есеп айырысу hashін және манифест түбірін ашады. Реле біріктіруге рұқсат етіледі QC және жарамды FastPQ дәлелді материал.

### AXT Математикаға байланысты {#axt-binding-math}

үшін Nexus AXT конверттер, `AxtFastpqBinding` дәлелді қайта ойнаудан бұрын қаноникализацияланады. Бос параметрдің әдетті мәні `fastpq-lane-balanced`; empty verifier id және нұсқасы әдетті түрде `fastpq` және `v1`; талап етілетін түрі қысқартылған және төменгі деңгейге шығарылған.

AXT FastPQ мемлекеттік кірістері детерминистік байт хэштері болып табылады:

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

AXT ауысу кілттері:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` талапкерлік тізімінде рөлді беру жолына енген:

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

`compliance` өтініші екі метамәдени деректі жолды енгізеді: бірі - саясатты және екіншісі - мақсатты деректер қорын.

`tx_predicate` және `value_conservation` үшін, егер байланыстыруда оң көз немесе мақсатты мөлшер бар болса, нақты әсер мөлшері қолданылады. Әйтпесе код шектелген детерминисттік мәнді алады:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Содан кейін бірдей трансферттік теңдеулер қолданылады:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Синтетикалық жөнелтуші мен қабылдаушы тіркелгінің идентификаторлары негізгі тұқымдардан жасалады:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Трансферлік партияның хэшігі:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

Қауымдастық AXT партиялық манифесттің асқынуы SHA-256 бойынша Norito Каноникалық байланысты кодтау:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Өткінші хабарлардың дәлелдері {#sccp-transparent-message-proofs}

Қауымдастық SCCP көмекші коробка да қолданылады FastPQ Бұл жол ашық тізбекті хаттарды растау үшін. `irohad` Бастапқы провер лентасы. FastPQ партиясы бірден SCCP хабарлама дәлелді топтама және манифест, содан кейін ашық тексеру үшін пайда болған дәлелді оралады.

SCCP партиясы `fastpq-lane-balanced` және үш метамәдени ауысуды пайдаланады:

|Кілті |Операция |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

Оның қоғамдық кірістері SCCP мөлдір ішкі дәлелдіден алынған:

|FastPQ кіріс |SCCP көздері |
| ------------- | ---------------------------------------------------------- |
|`dsid` |Блейк2Б-ның алғашқы 16 байт жарнасы hash арқылы өшіріледі|
|`slot` |Аяқтау биіктігі |
|`old_root` |Пайдалы жүктеме шешесі |
|`new_root` |Қатысу тамырлары |
|`perm_root` |Ақырықтау блогы |
|`tx_set_hash` |Баяндама шеше |

SCCP каноникалық кодтаушылар бүтін сандарды аз ендікпен жазады және өзгеріске ұзындығы бар байт массивтерін былай деп кодтайды:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Ашық кіріс байт тізбектері:

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

Ашықсыз мәлімдеме байттары - нұсқаның, тізбектер отбасының, жергілікті және қарсыластар домендерінің, қауіпсіздік моделі, якорь басқаруы, шот кодекінің, түпкіліктілік үлгісінің, тексерушінің нысанасы, тексерушінің бэк-энд отбасы, ұзындығы префиксиленген тізбек/бэк-энд/манифест өрістері, мақсатты байыту хэші. тіркелгі кодек кілті, пайдалы жүктеме түрі, қоғамдық кіріс байттары және пайдалы жүктеме хэші.

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

Бұл дәлелді жолдың FastPQ деректер кеңістігінің идентификаторы - тағы бір префиксті Blake2b дигесінің алғашқы он алты байт:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ партиясы дәл мынадай:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

содан кейін FastPQ тапсырыс қағидасы бойынша сұрыпталады.

Қауымдастық OpenVerify тексерушінің міндеті SHA-256 бойынша SCCP хабарламаның аяқтық атауы және каноникалық FastPQ тексерушінің сипаттамасы:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Шикізат FastPQ дәлел Norito- кодталған `StarkFriOpenProofV1`, содан кейін оралған `OpenVerifyEnvelope` аяқпен `Stark`. SCCP тексеру бірдей қайта құру FastPQ топтама мен манифесттен партия, ашық тексеру конверті метамәліметтерін тексереді, және FastPQ Қайта құрылған партияны тексеруші және дәлелдеуші.

## Параметрлер жиынтығы {#parameter-sets}

Каноникалық параметрлер каталогы екі параметрлерді көрсетеді. `fastpq-lane-balanced`.

|Параметр |Мақсаты |Өрісте |Шештер |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |теңгерімделген провайдерлік өткізу |Goldilocks квадратты ұзарту |Poseidon2 міндеттемелері, каталог SHA3 белгісі |8-ші бөлім, 8-ші бөлім. 46 сұрақ.|
|`fastpq-lane-latency` |ұзындығына бейім жолдар |Goldilocks квадратты ұзарту |Poseidon2 міндеттемелері, каталог SHA3 белгісі |16-шы бөлім, 16-сынып, 34 сұрақ |

Олардың екеуі де 128-биттік қауіпсіздікті көздейді және `2^16`. Қауымдастық Rust V1 транскрипті реплей коды қазіргі уақытта Fiat-Shamir сынақ байттарды `iroha_crypto::Hash::new` тікелей шақырудан гөрі SHA3-256.

Rust сынамашы қолданған нақты каталог константалары:

|Тұрақты |`fastpq-lane-balanced` |`fastpq-lane-latency` |
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

## Конфигурация {#configuration}

FastPQ конфигурациясы `zk.fastpq` астында орналасады.

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

Бірдей орындау және телеметриялық таңбаларды `irohad` -дан ауыстыра алады:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

Конфигурация өрістері үшін қоршаған ортаның айнымалылары да қолданады. FastPQ -ға арналған айнымалылар:

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

## Өлшемдер {#metrics}

Телеметрия рұқсат етілген кезде FastPQ бэкэндді таңдау және Metal runtime мінез-құлқы үшін метрикаларды экспорттайды:

|Метрик |Мағынасы |
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |Арнаулы және құрылғы таңбалары бойынша сұралған және шешілген орындалу режимі |
|`fastpq_poseidon_pipeline_total` |Сұралған және шешілген Poseidon құбыр жолы |
|`fastpq_metal_queue_depth` |Металл кезек шегі, ұшудағы ең көп сан, жөнелту саны және үлгіні алу терезесі |
|`fastpq_metal_queue_ratio` |Металл кезегі қашықтығы мен үлесінің арақатынасы |
|`fastpq_zero_fill_duration_ms` |Металл жүгіру үшін хост нөлді толтыру ұзақтығы |
|`fastpq_zero_fill_bandwidth_gbps` |Алынған нөлдік толтыру жолақтығы |

Жалпы өнімділікті сұрыптау үшін оларды [Орындау және метрикалар](/kk/guide/advanced/metrics.md) бөлімінде көрсетілген консенсус және кезек сигналдарымен пайдалану.

## Осыған байланысты анықтама {#related-reference}

- [Жаратылған типтік мәліметтер үшін деректер үлгісі схемасы](/kk/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ параметрлері](/kk/reference/irohad-cli.md#arg-fastpq-execution-mode)
