---
translation_locale: kk
translation_source: /blockchain/fastpq.md
translation_source_hash: d8dd61390f5df3dae09b70399e04e8f71716a912ef5dea9010feaf60573ed261
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# FastPQ {#fastpq}

FastPQ таңдалған орындау әсерлері үшін Iroha-ның STARK дәлел жолы болып табылады. Ол қалыпты транзакция орындауын немесе консенсусын алмастырмайды. Транзакциялар әлі де ISI, IVM, және Sumeragi-ді әдеттегідей іске қосыңыз; FastPQ детерминистік орындау куәсін тұтынуға және қолдау көрсетілген эффектілерді дәлел топтарына айналдыруға мүмкіндік береді.

Ағымдағы хост интеграциясының үш негізгі жолы бар:

- блокты орындау кезінде тіркелген мөлдір сандар активтерін аудару
- Nexus расталған орындау жолы реле, мұндағы AXT дәлел деректер контейнері FastPQ байланыстыруды қамтиды
- SCCP ашық тексеру деректер контейнерінде FastPQ дәлелін орайтын мөлдір хабарлама дәлелінің көмекшілері

## Куәгер жолын беру {#transfer-witness-path}

Төмендегі сандарлық аударымдар нұсқаулық балансқа өзгеріс енгізгенде құрылымды аударым транскриптін жасайды. Транскрипт келесі мәліметтерді тіркейді:

- шот бастапқы, шот мақсатты, активтің анықтамасы және сома
- жіберуші мен алушының аударым алдында және кейінгі баланстары
- транзакцияның кіріс нүктесінің криптографиялық хэш кестесі партияның криптографиялық хэші ретінде пайдаланылды
- жіберуші есепшоттан алынған уәкілетті субъект криптографиялық қысқартылған мәні
- бір-дельта транскрипттерге арналған Poseidon криптографиялық дайджест мәні

Кластерлік аударымдар бір транскриптіні бірнеше дельтамен пайдаланады. Сол жағдайда бір дельталы Poseidon криптографиялық қысқаша мәні жоқ.

Блокты аяқтағанда, Iroha осы транскрипттерді кіріс нүктесінің криптографиялық хэшіне қарай топтайды. Орындау куәгері содан кейін бастапқы транскрипт жинақтарын және дәлелдеушіге арналған FastPQ ауысу пакеттерін алып жүреді.

Әр ауысу дельтасы екі өтпелі қатарға айналады:

|Қатар|Кілт пішіні|Алдын ала мән|Пошта мәні|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Жіберушінің дебеті| `asset/<asset-definition>/<source-account>`      |жіберушінің қалдығы алдымен|жіберушінің қалдығы кейін|
|Қабылдаушының несиесі| `asset/<asset-definition>/<destination-account>` |қабылдаушының балансы бұрын|қабылдаушының балансы кейін|

Сандық мәндер бүтін куәлік бірліктеріне нормаланады. Таңдалған ондық шкалада теріс емес `u64` ретінде көрсетілмейтін мән FastPQ топтауға қабылданбайды.

## Қоғамдық енгізулер {#public-inputs}

Әрбір FastPQ өтпелі партия блокқа және орындау контекстіне дәлелді байлайтын жалпы кірістерді қамтиды:

|Енгізу|Мағына|
| ------------- | --------------------------------------------------------------- |
| `dsid`        |Деректер кеңістігінің идентификаторы кішкентай-бейндек байттар ретінде кодталған|
| `slot`        | Блокты жасау уақытынан наносекундқа түрлендіру|
| `old_root`    |Ата-ана күйінің түбірі орындау куәлігінен алынған|
| `new_root`    |Орындалу куәлігінен туындаған кейінгі-мемлекеттік түбір|
| `perm_root`   |Poseidon криптографиялық міндеттеме мәні белсенді рөл рұқсаттары бойынша|
| `tx_set_hash` |сұрыпталған транзакция мен уақытқа тәуелді кіріс нүктесінің криптографиялық хэштері бойынша криптографиялық хэш|

Қонақ осы партиялар үшін бір ғана протокол-стандарт параметрлер жиынтығы ретінде `fastpq-lane-balanced` пайдаланады.

## Математикалық модель {#mathematical-model}

Бұл бөлім ағымдағы Rust дәлелдеуші мен тексеруші жүзеге асыратын арифметиканы сипаттайды. Төмендегі барлық өріс операциялары Голдилокс прималық алаңында жүзеге асады:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ өріс криптографиялық міндеттеме мәндері үшін `F` орнына Poseidon2 қолданады. Спонждің ені `t = 3`, жылдамдығы `r = 2` және сыйымдылығы `1`. Криптографиялық хэш өріс элементтерін rate-2 блоктарында сіңіреді және соңғы алмастырудан бұрын бір өріс элементін `1` қосады:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Байт жолдары 7-байттық кішкентай-басты мүшелерге қапталады, сол себепті әрбір мүше қатаң түрде `p`-дан төмен болады:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Доменге бөлінген өріс криптографиялық хэштері мынадай түрде көрсетіледі:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Байт-домендік криптографиялық дайджесттерден басталатын криптографиялық хэштәр үшін, FastPQ алғашқы сегіз little-endian байтты өріске бейнелейді:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Мұнда `Hash` - Iroha `iroha_crypto::Hash::new`-нің 32-байттық Blake2bVar криптографиялық қысқарту мәні, егер формула ашық түрде Poseidon2 немесе SHA-256 деп аталмаған болса.

### Өріс арифметикасы {#field-arithmetic}

Rust коды өріс элементтерін `[0,p)` ішіндегі бір протокол-стандартты `u64` мәндері ретінде ұсынады. Қосу және азайту келесідей:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

Көбею алдымен 128 биттік нәтижені есептейді:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Содан кейін Голдилокс қысқарту мына сәйкестікті қолданады:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Егер:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

содан кейін редуктор есептейді:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

Орындалу шартты түрде `p` қосады немесе азайтады, нәтижесі бір протокол стандартында болатындай етіп. Мыналар сияқты таңбаланған бүтін сандар, мысалы, баланс дельталары, былай ендірілген:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 Пермутациясы {#poseidon2-permutation}

Poseidon2 переструкция күйі былай:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Оның S-қорабы:

$$
S(x)=x^5
$$

FastPQ төрт толық айналымды, елу жеті жартылай айналымды пайдаланады, содан кейін тағы төрт толық айналым жасайды. `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` айналым константалары бар толық айналым былай болады:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

Жартылай айналым бұл:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Барлық қосындылар мен көбейтулер `F` ішінде орындалады. Бір ғана протокол-стандартты MDS матрицасы мынадай:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Салалық криптографиялық хэш нөлдік күйден басталады. Әрбір толық rate-2 блогы `(u,v)` үшін:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

Соңғы блок соңғы алмастырудан бұрын `1` толтыру элементін қосады. Шығыс `x_0`.

### Қоғамдық енгізу байлауы {#public-input-binding}

Қонақ `u64` мәнін 16 байттық өрістің алғашқы сегіз кіші-соңғы байттарына жазу арқылы деректер кеңістігі идентификаторын кодтайды:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Блокты құру уақыты миллисекундтан наносекундқа ауыстырылады:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Транзакция жиынтығының криптографиялық хэші - сұрыпталған кіріс нүктесінің криптографиялық хэштеріне қатысты байт доменіндегі криптографиялық хэш:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

мұнда `h_i` сұрыпталған транзакциялар мен уақыт-детектор кіріс нүктесінің криптографиялық хэштері болады. Ашық дәлелдеуде IO, егер `perm_root` немесе `tx_set_hash` барлығы нөл болса, дәлел беруші резервтік мәндерді толтырады:

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

### Сандық қалыпқа келтіру {#numeric-normalization}

Әрбір аударым дельтасы үшін мақсатты ондық шкала соманың және екі баланстық уақыттағы мәліметтер көрінісінің ең үлкен қысқартылған шкаласы болып табылады:

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

`Numeric` мәні `m` мантиссасы және `q` масштабымен тек `m >= 0` және `q <= s` кезінде қабылданады. Оның FastPQ куәлік мәні:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Нормаланған нәтиже `u64` диапазонына сәйкес келуі керек.

### бір протоколды-стандартты тапсырыс беру {#canonical-ordering}

Жолақты құрудан бұрын, пакет ауысу кілті, операция рангі және бастапқы енгізу индексі бойынша сұрыпталады:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

Тапсырыс криптографиялық міндеттемесінің мәні - сұрыпталған ауысулардың `fastpq:v1:ordering` доменіндегі және Norito кодтаулары бойынша Poseidon2 өріс криптографиялық хеші:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

мұнда `P` – 7 байттық орау, `E` – Norito кодтау, `D_o` – `fastpq:v1:ordering`, ал `T*` – сұрыпталған өтулер тізімі.

### Ауыстыру теңдеулері {#transfer-equations}

Жіберуші шоты `f`, алушы шоты `t` және аударым сомасы `a` үшін, FastPQ трассаны құрастырмас бұрын нормаланған куәгер мәндерін тексереді:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Одан кейін өтпелі жолдар былай кодталады:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

Ізде, таңбаланған дельталар `F`-ге қысқартылады:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

Міндетті емес бірлік-дельта тасымалдау криптографиялық қорытынды мәні кодталған тасымалдау алдын-образын аяқтайды:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Көпдельта ауыстыру транскрипттері үшін ағымдағы форматта осы жоғарғы деңгейлі криптографиялық дайджест мәні болмауы қажет.

Өткізу транскрипттері үшін хосттың авторизациялау басты криптографиялық қысқаша мәні:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Жолдарды қадағалау {#trace-rows}

Сыртынан сұрыпталған ауысу тізімі `n` нақты жолдарды қамтасын. Трэйс ұзындығы келесі екілік дәрежеге тең:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

Қатарлар `0..n-1` белсенді; қатарлар `n..N-1` толтырғыш қатарлар болып табылады. Әр нақты қатарда бір операция селекторы орнатылған:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Барлық селектор бағандары Бульдік:

$$
s(s-1)=0
$$

Рұқсаттарды қарау жолдары дәл осы рөлді беру және рөлді алу жолдары болып табылады:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Сандық операция жолдары үшін:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Құрылысшы сондай-ақ әр актив бойынша ағымдағы дельталарды бақылайды:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Тек шығару және жою жолдары жабдық есептегішін жаңартады:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Метадеректер мен деректер ауқымының бақылау бағандары жолдарды материалдандыру алдында алынған өріс криптографиялық хэштерін көрсетеді:

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

Метадеректердің криптографиялық хэші, деректер кеңістігінің криптографиялық хэші және орыны көрші іздер қатарында тұрақты болып келеді:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Меркле бағандарын ауыстыру {#transfer-merkle-columns}

Ауыстыру жолдары 32-деңгейлі сирек Меркле жолын ұсынады. Егер хост дәлелі болмаса, дәлел беруші жол кілті, алдын ала баланс және жол жіберуші немесе қабылдаушы жағында ма екеніне қарай детерминистік жолды синтездейді.

Синтетикалық жолдар үшін дәм тұзы жіберуші жолдарда `fastpq:smt:from` және қабылдаушы жолдарда `fastpq:smt:to` болып табылады:

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

Синтетикалық жапырақ пен ішкі түйіндер мыналар:

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

Трасса әр деңгейде бит `b_l`, бауыр `s_l`, енгізу түйіні `x_l` және шығу түйінін `x_{l+1}` тіркейді. Кодтың тармақтау дәстүрімен:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Рұқсат криптографиялық хэштер {#permission-hashes}

Рөлді беру және қайтару қатарлары криптографиялық хэш рұқсат куәгері:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Хост рұқсат кестесінің түбірі жазбаларды рөл байттары, рұқсат байттары және эпоха байттары бойынша сұрыптап, содан кейін Poseidon2 Меркле ағашын құрады:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Тақ ені бар деңгейлер соңғы элементті қайталайды.

### Криптографиялық міндеттеменің мәнін қадағалау {#trace-commitment}

Әрбір із бағаны `c`, FastPQ үшін алдымен баған мәндерін із доменінде интерполяциялайды және коэффициент векторын криптографиялық хэш арқылы есептейді:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

Трассировка түбірі бағана криптографиялық міндеттеме мәндеріне арналған Poseidon2 Меркле түбірі болып табылады:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Ақырғы іздік криптографиялық міндеттеме мәні доменнің, параметрлер жиынының, іздің пішінінің, бағананың криптографиялық дайджестерінің және іздің түбірінің байттық криптографиялық хэші болып табылады:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

мұнда `D_c` `fastpq:v1:trace_commitment` болып табылады.

### AIR Құрамы {#air-composition}

V1 AIR композициялық мәні жолдық локальды қалдықтардың сызықтық комбинациясы болып табылады. Транскрипт екі сынаққа мысал келтіреді:

$$
\alpha_0,\alpha_1 \in F
$$

Әрбір көрші қатар жұбы `(i,i+1)` үшін, дәлелдегіш былай есептейді:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Қалдықтар `rho` код тәртібі бойынша:

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

Сандық бағандары бар жолдар үшін:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

Және тұрақты пакет контекст бағандары үшін:

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

Растау құралы таңдалған жол ашулар үшін `A_i`-ды қайта есептейді және оны криптографиялық түрде AIR композициялық Меркле тамырымен байланыстырылған композиялдық мәнмен тексереді.

### Өнімді іздеу {#lookup-product}

Рұқсаттарды іздеу аккумуляторы Fiat-Shamir шақыруын `gamma` қолданады. `s_perm` және `perm_hash` төмен дәрежелі кеңейтулерді бағалаулар бойынша, есептеліп жатқан көбейтінді мынандай болады:

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

### Төмен дәрежелі кеңейту {#low-degree-extension}

`omega_T` – із-қатар домені генераторы болсын, `omega_E` – бағалау домені генераторы, және `g` – конфигурацияланған қосындық ығысу. `v_i` мәндері бар із-қатар бағаны үшін интерполяция `a_j` коэффициенттерін шығарады, олар былай болады:

$$
f(\omega_T^i)=v_i
$$

Төмен дәрежелі кеңейту осы полиномды косетке бағалайды:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

Орындалуы бұл есептеуді коэффициенттерді косет ауысуына дейінгі дәрежелерге көбейту арқылы орындайды FFT:

$$
a'_j = a_j g^j
$$

және содан кейін бағалау доменінде `a'` бағалау.

CPU FFT – биттік кері тәртіптелген енгізулерге негізделген қайталанатын раджис-2 Кули-Тьюки түрлендіруі. Кезең ұзындығы `L`, жарты ұзындығы `H=L/2` және кезең тамыры кезінде:

$$
\omega_L=\omega^{N/L}
$$

әрбір көбелек есептейді:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

Кері FFT `omega^{-1}` арқылы сол трансформацияны орындайды және кері домен өлшеміне көбейтеді:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Каталог түбірлері қолданар алдында тексеріледі:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Каталог түбірінен туындаған кішігірім домендер үшін генератор мынандай:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Row және Leaf криптографиялық хэштер {#row-and-leaf-hashes}

LDE кейін, FastPQ барлық LDE бағандар бойынша әр жолды криптографиялық хэштер етеді. `m` бағандар үшін:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Егер жолдық криптографиялық хэштер әлі де бағалау домені емес, із доменінде болса, дәлелдегіші сол бір жол-хэш бағанын сол LDE косет процесімен интерполяциялай отырып ұзартады.

### Меркле ашылымдары {#merkle-openings}

LDE мәндері келесі бөліктерге топтастырылған:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Әр кесілген жапырақ:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Меркл ата-аналары:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Так деңгейлер соңғы түйінді қайталайды. Сұрау жолдары әр деңгейдегі сұрау жапырақ индексінің тақ немесе жұп болуына байланысты сол жағын немесе оң жағын хэштеу арқылы тексеріледі.

Индексі `i` болатын жапырақ үшін жол `(s_0,\ldots,s_{d-1})` түбір `R` бойынша қайталанумен тексеріледі:

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

Тексеру тек келесі жағдайда өтеді:

$$
y_d=R
$$

AIR із жолдарының жапырақтары мыналар:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR құрамында жапырақтар бар:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE сұрауын ашу, сондай-ақ бағалау индексі `i` бойынша ашылған мән оның расталған бөлігінде бар екенін тексереді:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Қиылған {#fri-folding}

FRI криптографиялық түрде AIR құрам бағалауларына байланады. Әр раунд үшін `l`, транскрипт сынақты `beta_l` таңдайды. Қабат соңғы мәнді қайталай отырып, арлыққа көбейткішке дейін толтырылады. Әр арлық өлшемді топ келесідей бүктеледі:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

мұнда `a` – FRI арифметикасы. Тексеруші әрбір алынған сұрау тізбегі үшін тексереді, яғни:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

және әр ашылған FRI тобын сәйкес FRI қабат түбіріне қарсы аутентификациялайды.

### Фиат-Шамир транскрипті {#fiat-shamir-transcript}

Бір протокол-стандарт параметрлер каталогы транскрипттің криптографиялық хэшін SHA3-256 деп белгілейді. Ағымдағы дәлелдегіш және тексеруші жүзеге асыру `iroha_crypto::Hash::new` арқылы шақырылатын байттарды алады, бұл 32-байттық Blake2bVar криптографиялық дайджест мәні, содан кейін алғашқы сегіз кішірейтілген соңғы байттарды `F`-ге дейін қысқартады:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Сынақ мәнін алу шақырулары толық дайджесті транскрипт күйіне қосады. Қайта ойнату реті:

1. қоғамдық IO, протокол нұсқасы, параметр нұсқасы және параметр атауы
2. LDE түбір және түбірді қадағалау
3. `gamma`
4. AIR құрамы мәселелері `alpha_0`, `alpha_1`
5. AIR тамырды қадағалау және AIR құрам бөлігін қадағалау
6. үлкен өнімді қарау
7. FRI қабат тамырлары және `beta_l` қиындықтар
8. алу үлгісі индекстері

Сұрау үлгілеу 32-байттық криптографиялық сынақтарды алып, оларды кіші-бірлік `u64` бөліктері ретінде оқуды жалғастыра береді, ол сұралған бірегей индекстер санына жеткенше:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

Үлгіленген жиынтық сұрыпталған тәртіпте қайтарылады.

### Растау құрылғысының қайта ойнауы {#verifier-replay}

Тексеруші алдымен топтық криптографиялық міндеттемелік мәнді қайта есептейді:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

және талап етеді:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

Ол сондай-ақ қоғамдық IO-ды қайта құрады:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Әрбір өріс дәлелдің ашық IO байт бойынша сәйкес болуы керек. Содан кейін тексеруші сол жазбаны қайта құрып, дәл осындай нәтижені шығарады:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Әрбір таңдалған сұрау `q` үшін ол тексереді:

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

AIR құрама ашылуы `R_air_composition` бойынша аутентификациялануы керек. Содан кейін FRI тізбек сол `A_q`-ден басталады және соңғы FRI жапыраққа дейін аутентификациялануы керек, ол терминалдық FRI түбірдің астында орналасады.

## Дәлелдеуші не тексереді {#what-the-prover-checks}

Іздеуді құрудан бұрын, FastPQ дәлелдегісі транзакция кілті, операция рейтінгі және енгізу ретінен пакет тапсырысын каноникалайды. Ауыстыру жолдары сондай-ақ транскрипт метадеректерін талап етеді. Ауыстыру жолдары бар, бірақ ауыстыру транскрипттері жоқ пакет жарамсыз болып табылады.

Көшіру үшін түсірілімдерде, дәлелдеме тарапынан тексерулер мыналарды қамтиды:

- жіберушінің қалдығы теріс болмауы керек
- `sender_after` `sender_before - amount`-ге тең болуы керек
- `receiver_after` `receiver_before + amount`-ге тең болуы керек
- транскрипт пакеттегі әрбір аударым жолын қамтуы тиіс
- бір дельта Poseidon криптографиялық хэш мәні, егер бар болса, транскрипт алдындағы кескінмен сәйкес болуы керек
- берілген сирек Меркле дәлелдері 1-нұсқа ретінде декодталуы керек; жоқ жолдар детерминирленген жасанды дәлелдермен толтырылады

Трэйс тасымалдау, беру, жою, рөл беру, рөлді алып тастау, метадеректерді орнату және рұқсаттарды қарау жолдары үшін селектор бағандарын қамтиды. Сандық операция жолдары сондай-ақ таңбаланған айырмашылықтарды, актив бойынша ағымдағы айырмашылықтарды және қамтамасыз ету есептегіштерін тасымалдайды.

## Проверлеу жолы {#prover-lane}

`iroha3d` провайдердің артқы бөлігін іске қосуға болатын болса, FastPQ дәлелдеме жүргізушісінің орындау жолын іске қосу кезінде бастайды. Орындау жолы шектелген кезегі бар фондық тапсырма болып табылады. Блок орындау куәгерін шығарғаннан кейін, консенсус соңғылау жолы блоктың криптографиялық хэші, биіктігі, көрінісі және куәгерін қамтитын дәлелдеуші жұмысын жібереді.

Егер орындау жолы жұмыс істемесе немесе кезек толы болса, жұмыс өткізіледі және қалыпты блок өңдеу жалғасады. Бұл артқы жоспардағы дәлел шығарушы орындау жолы транзакцияны қабылдау немесе консенсус есігі емес екенін білдіреді. Бұл бұрын орындалған күй бойынша дәлел өндіру жолы болып табылады.

Орындау жолағы мынадай дәлелдеушіні құрады:

```text
parameter = "fastpq-lane-balanced"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Екі баптау да әдепкі бойынша `cpu` болып келеді. `gpu`-ді таңдау нақты, сәтсіздікпен жабылатын сұрау болып табылады: егер GPU қолдауы біріктірілмеген немесе сұралған GPU артқы бөлік алдын ала ұшу сәтсіз болады, дәлелдеушінің орындалу жолы өшіріліп қалады. Бірінші шығарылымда `auto` мәні жоқ және сұралған GPU режимінен CPU режиміне ауыспайды.

## Растау {#verification}

FastPQ дәлелді тексеру бір протокол стандартты пакет криптографиялық міндеттемелер мәнін қайта құрады және қоғамдық транскриптті қайта ойнайды. Тексеруші протоколды тексереді нұсқа, параметрлер жиынтығының нұсқасы, қайта ойнату шектері, криптографиялық міндеттеменің ізін шығару мәні, жалпы кірістер, таңдалған Меркле ашулары, AIR ашулары және FRI сұрау тізбегі.

Әдепкі қайталау шектері мыналарды қамтиды:

|Шек|Әдепкі|
| ------------------ | ------: |
|Өтпелі қатарлар|     256 |
|Пакет жүктемесінің көлемі|256 KiB|
| FRI қабаттар |      16 |
|Сұрау ашылымдары|     128 |

## Nexus Расталған реле {#nexus-verified-relays}

Nexus AXT дәлел деректер контейнерлері `AxtFastpqBinding` орналастыра алады. `RegisterVerifiedLaneRelay` іске қосылғанда, Iroha:

1. орындау жолы реле деректер контейнерін және FastPQ дәлел материалын тексереді
2. деректер кеңістігі мен техникалық манифест түбірін тексереді
3. AXT дәлел мәліметтер контейнерін декодтайды
4. қажет етеді `fastpq_binding`
5. сол байланыстан FastPQ пакетін қайта құрады
6. құйылған FastPQ дәлелді декодтайды
7. қайта құрылған топта және дәлелдеуде FastPQ тексерушіні шақырады

Егер тексеру сәтті болса, Iroha релей сілтемесін, бастапқы мәліметтер контейнерін, дәлелді жүктеме криптографиялық хэшін, тексеру биіктігін, техникалық манифесттің түбірін және FastPQ байланысын қамтитын `VerifiedLaneRelayRecord` сақтайды.

орындау арнасы релелік деректер контейнерлері сондай-ақ ықшамдалған FastPQ дәлел материалын тасымалдайды. Бұл материал орындау арнасының идентификаторы, деректер кеңістігінің идентификаторы, блок биіктігі, тексеру биіктігі бойынша криптографиялық дайджест мәні болып табылады, блок тақырыбының криптографиялық хэші, қаржылық транзакцияны есеп айырысу криптографиялық хэші және техникалық манифестің түбірі. Релей тек қана егер оның екеуі де бар болса ғана біріктіруге рұқсат етілген: QC және жарамды FastPQ дәлел материалы.

### AXT Математикаға байлау {#axt-binding-math}

Nexus AXT деректер контейнерлері үшін, `AxtFastpqBinding` дәлелді қайта орындау алдында каноникалданады. Бос параметр мәндері әдепкі бойынша `fastpq-lane-balanced`-ге тең; бос тексеруші идентификаторы мен нұсқасы әдепкі бойынша `fastpq` және `v1`-ке тең; талап түрі қысқартылып, кіші әріптерге айналдырылады.

AXT FastPQ ашық енгізулер детерминистік байт криптографиялық хэштер болып табылады:

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

`authorization` талап рөлі тағайындау жолын қосады:

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

және авторизация саясатын байланыстырған метадеректер жолы. `compliance` шағымы екі метадеректер жолын қосады: бірі саясат үшін, бірі мақсатты деректер кеңістіктері үшін.

`tx_predicate` және `value_conservation` үшін байланыс оң көз немесе тағайындалған соманы қамтыған кезде нақты әсер сомасы қолданылады. Әйтпесе, код шектеулі детерминилді соманы шығарады:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Содан кейін сол жерге беру теңдеулері қолданылады:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Синтетикалық жіберуші және қабылдаушы есепшот идентификаторлары кілт тұқымдарынан жасалады:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Аударым пакетінің криптографиялық хэш мәні:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT партияның техникалық манифестінің криптографиялық хэш мәні SHA-256 мәніне тең, бір протокол-стандартты байлауды Norito кодтау арқылы:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Мәтіндік хабардың айқын дәлелдері {#sccp-transparent-message-proofs}

SCCP көмекші бағдарламалық пакеті сондай-ақ мөлдір тізбектер арасындағы хабарламаларды дәлелдеу үшін FastPQ-ді пайдаланады. Бұл жол `iroha3d` фондық дәлелдеу орындау жолынан бөлек. Бұл SCCP хабарлама дәлелі бумасы мен техникалық манифестінен тікелей FastPQ пакет құрады, содан кейін алынған дәлелді ашық растау үшін орап береді.

SCCP топтамасы `fastpq-lane-balanced` және үш метадеректер ауысуын пайдаланады:

|Перне|Операция|
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

Оның қоғамдық кірістері SCCP мөлдір ішкі дәлелден шығарылады:

| FastPQ енгізу | SCCP бастапқы|
| ------------- | ---------------------------------------------------------- |
| `dsid`        |Мәлімдеменің криптографиялық хэшіне арналған Blake2b криптографиялық дайджест мәнінің алғашқы 16 байты|
| `slot`        |Соңдық биіктік|
| `old_root`    |Жүктеме криптографиялық хэш|
| `new_root`    |криптографиялық міндеттеменің мәнінің түбі|
| `perm_root`   |Ақырғы блок криптографиялық хэш|
| `tx_set_hash` |Мәлімдеме криптографиялық хэш|

SCCP бір протоколдық стандарт энкодерлері бүтін сандарды little-endian форматында жазады және айнымалы ұзындықтағы байт массивтерін келесі түрде кодтайды:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Ашық қоғамдық енгізу байт тізбегі мынандай:

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

Ашық мәлімдеме байттары нұсқа, тізбек отбасы, жергілікті және қарсы тарап домендері, қауіпсіздік моделі, бекіткіш басқару, есептік жазба кодегі, соңғылау моделі, тексеруші мақсаты, тексеруші артқы жүйе отбасы, ұзындығы көрсетілген тізбек/артқы жүйе/мән-жай өрістерінің бірігуінен тұрады, мақсат байланыстырушы криптографиялық хэш, есептік жазба кодек кілті, жүктеме түрі, қоғамдық енгізу байттары және жүктеме криптографиялық хэші. Мәлімдеме криптографиялық хэш былай:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

Бұл дәлел жолы үшін FastPQ деректер кеңістігінің идентификаторы басқа префиксті Blake2b криптографиялық дайджест мәнінің алғашқы он алты байты болып табылады:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ партиясы дәл осындай:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

содан кейін сол FastPQ сұрыптау ережесі бойынша сұрыпталады.

OpenVerify тексеруші криптографиялық міндеттемесінің мәні SHA-256 болып табылады SCCP хабарламалық бэкенд атауы және бір протокол-стандартты FastPQ тексеруші сипаттамасы бойынша:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Шикі FastPQ дәлел Norito кодталған `StarkFriOpenProofV1`-ға айналады, содан кейін `OpenVerifyEnvelope`-ге оралады және артқы жағында `Stark` болады. SCCP тексеруі бірдей [құрастырады]. FastPQ топтамадан және техникалық манифесттен топтаманы алады, ашық тексеру деректер контейнерінің метадеректерін тексереді және қайта құрастырылған топтама мен дәлелге FastPQ тексерушісін шақырады.

## Параметрлер жиынтығы {#parameter-sets}

Бір процесс-стандарт параметр каталогы екі параметр жиынтығын көрсетеді. Қазір хост дәлелдеуші орындау жолы `fastpq-lane-balanced` пайдаланады.

|Параметр|Мақсат|Есептік өріс|криптографиялық хэштер| FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` |теңдестірілген тексеруші өнімділігі|Голдилакс квадраттық кеңейту|Poseidon2 криптографиялық міндеттемелік мәндер, каталог SHA3 белгісі|аритет 8, жарылу 8, 46 сұрау|
| `fastpq-lane-latency` |кідіртуді сезетін орындау жолдары|Голдилок қвадраттық кеңейту|Poseidon2 криптографиялық міндеттемелік мәндер, каталог SHA3 белгісі|арность 16, жарылу 16, 34 сұрау|

Екеуі де 128-биттік қауіпсіздікті мақсат етеді және `2^16` із доменінің өлшемін пайдаланады. Rust V1 транскриптін қайта ойнату коды қазіргі уақытта Fiat-Shamir сынақ байттарын тікелей SHA3-256 шақыру орнына `iroha_crypto::Hash::new` арқылы шығарады.

Rust дәлелдуші қолданатын нақты каталог тұрақтылары мыналар:

|Тұрақты| `fastpq-lane-balanced` | `fastpq-lane-latency` |
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

## Баптау {#configuration}

FastPQ конфигурациясы `zk.fastpq` ішінде орналасқан.

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

Сол орындау және телеметрия белгілері `iroha3d`-дан қайта орнатылуы мүмкін:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Конфигурация өрістеріне арналған ортаның айнымалылары да қолдауға ие. FastPQ-ге тән айнымалылар мыналарды қамтиды:

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

## Метрикалар {#metrics}

Телеметрия қосылғанда, FastPQ бэкэнд таңдау және Metal бағдарламалық жасақтама орындау ортасының мінез-құлқы үшін метрикаларды шығарады:

|Метрикалық|Мағына|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Бэкэнд және құрылғы белгілері бойынша сұралған және шешілген орындау режимі|
| `fastpq_poseidon_pipeline_total`  |Талап етілген және шешілген Poseidon бағдарламалық жасақтама өңдеу жұмыс ағыны жолы|
| `fastpq_metal_queue_depth`        |Металл кезегі шегі, ұшып жүретін максималды сан, жіберу саны және үлгілеу терезесі|
| `fastpq_metal_queue_ratio`        | Металл кезегі бос емес және қабаттасу қатынастары |
| `fastpq_zero_fill_duration_ms`    | Metal орындаулары үшін хост нөлмен толтыру ұзақтығы|
| `fastpq_zero_fill_bandwidth_gbps` |Туынды нөлмен толтырылған өткізу қабілеті|

Жалпы өнімділікті сараптау үшін бұларды [Өнімділік және көрсеткіштер](/kk/guide/advanced/metrics.md) бетінде көрсетілген консенсус және кезек сигналдарымен бірге пайдаланыңыз.

## Қатысты сілтеме {#related-reference}

- [Деректер моделі схемасы](/kk/reference/data-model-schema.md) түйін-авторлық түріндегі уақыт бойынша деректер көрінісі үшін
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ опциялар](/kk/reference/iroha3d-cli.md#fastpq-overrides)
