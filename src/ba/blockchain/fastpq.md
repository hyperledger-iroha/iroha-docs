---
translation_locale: ba
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ булып тора Iroha Ул - STARK һайлап алынған үтәү эффекттары өсөн иҫбатлау юлы. Ул ғәҙәти транзакция үтәлеше йәки консенсус алмаштыра алмай. Транзакциялар һаман да үтә ISI, IVM, һәм Sumeragi ғәҙәттәгесә; FastPQ детерминистик үтәү шаһиты ҡулланыу һәм тәьмин ителгән эффекттар иҫбатлау партияларына әйләндереү.

Хәҙерге ҡабул итеүсе интеграцияла өс төп юл бар:

- Блоктарҙы үтәү ваҡытында теркәлгән һанлы активтар күсерелеүе
- Nexus иҫбатлау ҡапламаһында AXT бәйләнеше булған FastPQ йүнәлешле эстафета
- SCCP асыҡ хәбәр иҫбатлау ярҙамсылары FastPQ иҫбатлауын асыҡ тикшереү конвертына төрөп ҡуялар

## Шаһиттарҙы күсергә {#transfer-witness-path}

Прозрачные числовые переводы создают структурированный транскрипт передачи, когда инструкция мутирует балансы.

- сығанаҡ иҫәбе, маҡсат иҫәбенә, актив билдәләмәһе һәм сумма
- ебәреүсе менән ҡабул итеүсенең балансы тапшырыу алдынан һәм унан һуң
- транзакцияға инеү нөктәһе хэшиғы партияһы хэшигы булараҡ ҡулланыла
- тапшырыу иҫәбенән алынған хоҡуҡ сығанағы
- бер дельталы транскрипттар өсөн Poseidon дигесты

Партия күсереүҙәрендә бер транскрипт менән бер нисә дельта ҡулланыла.

Блокты тамамлағанда, Iroha был транскрипттарҙы инеү нөктәһе хэш буйынса төркөмләй. Эксплуатация шаһиты артабан төп транскрипт тупланмаларын һәм провер өсөн әҙерләнгән FastPQ күсеү партияларын алып бара.

Һәр күсереү дельтаһы ике күсеү рәтенә әүерелә:

|Ҡалып |Төп формаһы |Предварительная стоимость |Артабанғы баһа |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|ебәреүсе дебет |`asset/<asset-definition>/<source-account>` |ебәреүсе балансы алдынан |ебәреүсе балансы |
|Ҡабул итеүсе кредиты |`asset/<asset-definition>/<destination-account>` |ҡабул итеүсе балансы алдынан |ҡабул итеүсе балансы |

Санлы ҡиммәттәр тулы һанлы шаһиттар берәмектәренә нормализациялана. Һайланма өсөн FastPQ ҡиммәт кире ҡағыла, әгәр ул һайланған декамал үлсәмдә кире булмаған `u64` тип күрһәтелмәй икән.

## Йәмәғәт иғәнәләре {#public-inputs}

Һәр FastPQ күсеү партияһы иҫбатлауҙы блок һәм башҡарыу контексына бәйләүсе йәмәғәт инештәрен йөрөтә:

|Ҡалыптар |Мәғәнәһе |
| ------------- | --------------------------------------------------------------- |
|`dsid` |Мәғлүмәт биҫтәһе идентификаторы ҙур булмаған байт булып кодлана |
|`slot` |Блоктарҙы төҙөү ваҡыты наносекундтарға үҙгәртелә |
|`old_root` |Ата-әсә дәүләтенең асылы язалауҙағы шаһиттан алынған .|
|`new_root` |Үлем язаһына тарттырылған шаһиттарҙан алынған дәүләт һуҙымы |
|`perm_root` |Посейдондың актив роль өсөн рөхсәт биреүенә бәйле йөкләмәһе |
|`tx_set_hash` |Һәҙерләнгән транзакция һәм ваҡыт-тикшереү инеү нөктәһе хэштегтары өҫтөндә хаш |

Ҡунаҡсы был партиялар өсөн `fastpq-lane-balanced` каноник параметр билдәләй.

## Математик модель {#mathematical-model}

Был бүлектә хәҙерге Rust проверкаһы һәм верификаторы тарафынан ғәмәлгә ашырылған арифметика һүрәтләнә.

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ Poseidon2 өҫтөндә ҡулланыла `F` баҫыу йөкләмәләре өсөн. `t = 3`, ставкаһы `r = 2`, һәм ҡеүәте `1`. Хаш 2-се типтағы блоктарҙа поле элементтарын һеңдерә һәм бер генә поле элементын ҡуша `1` һуңғы алмаштырыу алдынан:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Байтлы ҡылдар 7 байтлыҡ бәләкәй эндия аяҡтарына төрөнгән, шуға күрә һәр аяҡ `p` аҫтына ҡуйылған:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Домендар менән айырылған яландар хештары түбәндәгесә күрһәтелә:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

FastPQ байт-домен дигестарынан башланған хештар өсөн беренсе һигеҙ бәләкәй андиан байтын майҙанға картаға һала:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Бында `Hash` - Iroha-ның `iroha_crypto::Hash::new` 32-байтлы Blake2bVar дигесен аңлата, әгәр формула менән Poseidon2 йәки SHA-256 атамалары асыҡланмаһа.

### Майҙан арифметикаһы {#field-arithmetic}

Rust коды ялан элементтарын `[0,p)` ҡиммәттәрендә каноник `u64` тип күрһәтә.

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

Күсәтеү иң тәүҙә 128-битлы продуктты иҫәпләй:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Goldilocks кәметеү һуңынан идентификация ҡуллана:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Әгәр:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

аҙаҡ сикләүсе иҫәпләй:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

Реализация шартлы рәүештә `p` өҫтәп йәки алып ташлай, һөҙөмтә каноник булғанға тиклем.

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Посейдон2 Пермутацияһы {#poseidon2-permutation}

Посейдон2 пермутацияһы дәүләте:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Уның " С-куробкаһы ":

$$
S(x)=x^5
$$

FastPQ дүрт тулы раунд, илле ете өлөшләтә раунд ҡулланыла, артабан тағы ла дүрт тулы раунд. `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` булып тора:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

өлөшләтә әйләнәһе:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Бөтә өҫтәмәләр һәм ҡабатлауҙар `F`. Каноник MDS матрицаһы:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Баҫыу хэшиһы нуль дәүләтенән башлана. һәр тулы ставка-2 блогы өсөн `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

Һуңғы блок `1` тултырыу элементын бер һуңғы алмашыу алдынан ҡуша. Сығарылыш `x_0`.

### Йәмәғәт иғәнәләре менән бәйләнеш {#public-input-binding}

Хост `u64` ҡиммәтен 16 байтлы майҙандың тәүге һигеҙ бәләкәй эндиан байтына яҙып, мәғлүмәт киңлеге ID-һын кодлай:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Блоктар барлыҡҡа килтереү ваҡыты миллисекундтарҙан наносекундтарға үҙгәртелә:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Транзакция йыйылмаһы хеш - тарҡатылған инеү нөктәһе хэш өҫтөндә байт-домен хэшигы:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

унда `h_i` sorted transaction and time-trigger entrypoint hashes. асыҡ иҫбатлауҙа IO, әгәр ҙә `perm_root` йәки `tx_set_hash` бөтәһе лә нуль булһа, проверл артта ҡалдырыу ҡиммәттәрен тултыра:

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

### Санлы нормализация {#numeric-normalization}

Һәр күсереү дельтаһы өсөн маҡсатлы декамаль үлсәм күләменең максималь ҡырҡылған үлсәме һәм ике баланстың ла миҫалдары:

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

А `Numeric` mantissa менән ҡиммәт `m` һәм күләме `q` ҡабул ителә, тик `m >= 0` һәм `q <= s`. Уның FastPQ Шаһиттар хаҡы:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Нормализацияланған һөҙөмтә `u64` составына тура килергә тейеш.

### Ҡанунлаштырыу {#canonical-ordering}

Тейлек төҙөлөшө алдынан партия күсеү клавишаһы, эксплуатация рейтингы һәм төп индекс буйынса сортировкалана:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

Заказ йөкләмәһе булып тора Poseidon2 яланы хэш өҫтөндә домен `fastpq:v1:ordering` һәм Norito кодлау sorted күсеүҙәр:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

унда `P` - 7-байтлы пакетта, `E` - Norito кодировкаһы, `D_o` - `fastpq:v1:ordering`, һәм `T*` - сортировкаланған күсеү исемлеге.

### Трансфер тигеҙләмәләре {#transfer-equations}

Трансфер өсөн сумма `a`, ебәреүсе балансы `f`, һәм ҡабул итеүсе балансы `t`, FastPQ эҙҙәр төҙөүгә тиклем нормалаштырылған шаһиттар ҡиммәттәрен раҫлай:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Һуңынан күсеү сираттары кодлана:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

Эҙләүҙәр эсендә ҡул ҡуйылған дельталар `F` тип кәметелә:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

Факультатив бер дельта күсереү диджеты кодировкалы күсереү преобразованияһын йөкмәтә:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Күп-дельта күсереү транскрипттары өсөн, хәҙерге форматта был юғары кимәлдәге һеңдереү юҡ булырға тейеш.

Трансформация транскрипттары өсөн ҡабул итеүсе хакимиәттең эшкәртеүе:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Эҙләнеү рәттәре {#trace-rows}

Төрлө күсеү исемлегендә `n` реаль рәттәре булһын. эҙ оҙонлоғо икеләтә киләһе көсө:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

`0..n-1` рәттәре әүҙем; `n..N-1` рәттәре - ҡаплау рәттәре. Һәр ысын рәттең бер операция һайлаусыһы ҡуйылған:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Һайлаусы бағаналарҙың барыһы ла boolean:

$$
s(s-1)=0
$$

Рөхсәт эҙләү рәттәре ролде биреү һәм ролде юҡҡа сығарыу рәттәре булып тора:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Санлы операциялар рәттәре өсөн:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Төҙөүсе шулай уҡ активҡа ярашлы дельталарҙы күҙәтә:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Бары тик мит һәм яндырыу сираттары ғына тәьмин итеү һанаҡсыһын яңырта:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Метамәғлүмәт һәм мәғлүмәттәр арауығының эҙҙәр колонналары - сират материализацияһынан алда алынған ҡыр һештәре:

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

Метамәғлүмәттәр хашисы, мәғлүмәт киңлеге хашисы һәм слот күрше эҙҙәр рәттәре буйынса тотороҡло:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Merkle колонналарын күсереү {#transfer-merkle-columns}

Трансфер һыҙыҡтарҙа 32 баҫҡыслы һирәк Merkle юлы бар. Әгәр хост иҫбатламаһы юҡ икән, провер рәт төймәһенән детерминистик юлды синтезлай, pre-баланс һәм рәт ебәреүсе йәки ҡабул итеүсе яғынанмы.

Синтетик юлдар өсөн тәмле тоҙ `fastpq:smt:from` ебәреүсе һәм `fastpq:smt:to` ҡабул итеүсе рәттәре өсөн:

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

Синтетик япраҡ һәм эске узелдар түбәндәгеләр:

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

Трейс битте `b_l`, ҡустыһын `s_l`, инеү узелын `x_l` һәм сығарыу узелын `x_{l+1}` һәр кимәлдә теркәп бара.

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Рөхсәт хашсылары {#permission-hashes}

Ролдар биреү һәм кире ҡағыу рәттәре рөхсәт шаһиты:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Хост рөхсәте таблицаһы тамыр яҙмаларҙы роль байттары, рөхсәт байттары һәм эпоха байттары буйынса тарата, һуңынан Poseidon2 Merkle ағас төҙөй:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Аҙаҡҡы элементты икеләтә ҡабатлау.

### Табынға ҡуйылған талаптар {#trace-commitment}

Һәр эҙҙәр колоннаһы өсөн `c`, башта FastPQ колонна ҡиммәттәрен эҙҙәр биләмәһе буйынса интерполациялай һәм коэффициент векторын хэшләй:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

Табын тамыр - колонна йөкләмәләре өҫтөндә Poseidon2 Merkle тамыр:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Һуңғы эҙләү йөкләмәһе - домен, параметрҙар йыйылмаһы, эҙләү формаһы, бағана һеңдереү һәм эҙләнеү тамырҙары өҫтөндә байт хэши:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

унда `D_c` - `fastpq:v1:trace_commitment`.

### AIR составы {#air-composition}

V1 AIR составы ҡиммәте - сират-урындағы ҡалдыҡтарҙың һыҙыҡлы комбинацияһы. Транскрипт өлгөләре ике проблеманы үҙләштерә:

$$
\alpha_0,\alpha_1 \in F
$$

Һәр күрше рәт парҙары өсөн `(i,i+1)`, проверс иҫәпләй:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Ҡалғаны `rho` код тәртибендә:

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

Һандарлы бағаналар менән рәт өсөн:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

Һәм тотороҡло партия контексты бағаналары өсөн:

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

Тикшереүсе `A_i` өлгөһөнә индерелгән рәт киңлектәрен ҡабаттан иҫәпләп сығара һәм уны AIR составындағы Merkle тамыры буйынса йөкмәтелгән композиция ҡиммәте менән тикшерә.

### Эҙләү продукты {#lookup-product}

Рөхсәт эҙләү аккумуляторы Fiat-Shamir проблемаһын ҡуллана `gamma`. `s_perm` һәм `perm_hash` түбән дәрәжәле киңәйтеү баһалары буйынса, эшләнгән продукт:

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

Дәлилдәр:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Аҫҡы кимәлдә киңәйтеү {#low-degree-extension}

`omega_T` эҙ-домен генераторы, `omega_E` баһалау домен генераторы һәм `g` конфигурацияланған косетт компенсацияһы булһын. `v_i` ҡиммәттәре булған эҙ-доман бағанаһы өсөн интерполяция коэффициенттары бирә `a_j`:

$$
f(\omega_T^i)=v_i
$$

Түбән дәрәжәле киңәйтеү косеттағы бер үк полиномияны баһалай:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

Уны тормошҡа ашырыу коэффициенттарҙы FFT алдынан coset offset ҡеүәттәре менән ҡабатлап иҫәпләй:

$$
a'_j = a_j g^j
$$

һәм артабан `a'` баһалау өлкәһе буйынса баһа.

Ҡоролтай CPU FFT бит-өсөнсө инеүҙәр өҫтөндә редикс-2 Cooley-Tukey трансформацияһы. `L`, ярым оҙонлоғо `H=L/2`, һәм этап тамырҙары:

$$
\omega_L=\omega^{N/L}
$$

һәр күбәләк иҫәпләй:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

Инверс FFT `omega^{-1}` менән бер үк трансформацияны үтәй һәм инверс домен күләме буйынса үлсәп ала:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Каталог тамырҙары ҡулланыр алдынан раҫлана:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Каталог тамырынан алынған бәләкәйерәк домендар өсөн генератор:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Ҡалып һәм япраҡ һештары {#row-and-leaf-hashes}

LDE ҙан һуң, FastPQ һәр рәтте бөтә LDE бағаналары буйлап тарҡата. `m` бағаналары өсөн:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Әгәр рәт-хаш әле лә баһалау доменында түгел, ә эҙҙәр доменында булһа, провер интерполациялай һәм шул уҡ coset LDE процесы менән бер рәт-хэш бағанаһын киңәйтә.

### Меркль асҡыстары {#merkle-openings}

LDE ҡиммәттәре түбәндәге өлөштәргә бүленгән:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Һәр япраҡ киҫәктәре:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Мерклдың ата-әсәһе:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Бер төрлө кимәлдәр һуңғы узелды ҡабатлай. Һорау юлдары һәр кимәлдә һорау япрағы индексы парлығына ярашлы һул йәки уң яҡҡа хэш яһап раҫлана.

`i` индексындағы япраҡ өсөн, `(s_0,\ldots,s_{d-1})` юлы тамырға `R` ҡаршы ҡабатланыуы менән раҫлана:

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

Тикшереү бары тик:

$$
y_d=R
$$

AIR эҙҙәр япрағы:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR составындағы япраҡтар:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE һорауҙы асыу шулай уҡ баһа индексы `i` буйынса асылған ҡиммәттең үҙенең раҫланған өлөшөндә булыуын тикшерә:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Ҡабатлау {#fri-folding}

FRI композиция AIR баһаһына йөкмәтелә. һәр раунд өсөн `l`, транскрипт өлгөһө һынау `beta_l`. ҡатлам һуңғы ҡиммәтте ҡабатлап, ариттың ҡабатланыусыһына тултырыла.

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

унда `a` - FRI арифметикаһы. тикшереүсе, һәр өлгөләге һорауҙар сылбыры өсөн:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

һәм һәр асылған FRI төркөмдө тейешле FRI ҡатлам тамырҙары менән раҫлай.

### Fiat-Shamir транскрипты {#fiat-shamir-transcript}

Каноник параметрҙар каталогы транскрипт хешын SHA3-256 тип билдәләй. Хәҙерге проверка һәм верификатор тормошҡа ашырыуы ауырлыҡ байттарын `iroha_crypto::Hash::new` менән килтерә, был 32-байтлы Blake2bVar дигесте булып тора, һуңынан тәүге һигеҙ бәләкәй андиан байтын `F` итеп ҡыҫҡара:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Һөжүм саҡырыуҙары транскрипт торошона тулы алмаштырыуҙы ҡуша.

1. йәмәғәт IO, протокол версияһы, параметр версияһы һәм параметр исеме
2. LDE тамыр һәм эҙ тамырҙары
3. `gamma`
4. AIR составы буйынса һынауҙар `alpha_0`, `alpha_1`
5. AIR эҙ тамырҙары һәм AIR композиция тамырҙары
6. эҙләү бөйөк продукт
7. FRI ҡатлам тамырҙары һәм `beta_l` проблемалары
8. Һорау индекстары өлгөһө

Һорау сынамаһын алыу 32-байтлы һынау биттәрен һүрәтләй һәм уларҙы һоралған уникаль индекстар һаны булғанға тиклем `u64` ҙур булмаған киҫәктәре итеп уҡый:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

Үлсәүҙәр йыйылмаһы тартип буйынса ҡайтарыла.

### Тикшереүсе ҡабаттан уйнатыу {#verifier-replay}

Тикшереүсе тәүҙә партия буйынса йөкләмәне яңынан иҫәпләй:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

һәм талап итә:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

Ул шулай уҡ IO йәмәғәтселекте тергеҙеү:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Һәр яланы раҫлауҙың асыҡ IO байт-байтҡа тап килергә тейеш.

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Һәр өлгө буйынса һорау алыу `q` өсөн ул:

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

һәм:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

AIR композицияһын асыу `R_air_composition` аҫтында раҫланырға тейеш. FRI сылбыры шул уҡ `A_q` менән башлана һәм FRI тамыр аҫтындағы ахырғы FRI битендә тамамланырға кәрәк.

## Ғәйбәтселәр нимә тикшерә {#what-the-prover-checks}

FastPQ провери эҙләүҙе төҙөүҙән алда партия тәртибен күсеү төйөнсәһе, операция рангы һәм индереү тәртибе буйынса канонизациялай. Трансфер рәттәре шулай уҡ транскрипт метамәғлүмәттәрен талап итә. Трансфера рәттәре булған партия, әммә трансфер транскрипттары юҡ.

Трансфер транскрипттары өсөн, провер-бәйләнештәге тикшереүҙәр түбәндәгеләрҙе үҙ эсенә ала:

- ебәреүсе балансы түбәнгә ағып сыҡмаҫ
- `sender_after` менән тигеҙ булырға тейеш `sender_before - amount`
- `receiver_after` менән тигеҙ булырға тейеш `receiver_before + amount`
- транскрипт партиялағы һәр күсереү рәтенә ҡағылырға тейеш
- бер дельталы Посейдон һеңдереүсе, әгәр бар булһа, транскрипт преобразы менән тап килергә тейеш.
- Бер аҙ-Меркл иҫбатлауҙар версия 1 тип декодланырға тейеш; юғалған юлдары детерминистик синтетик иҫбатламалар менән тултырыла

Трейсҡа күсереү, аҡса эшләү, яндырыу, роль биреү, ролде юҡҡа сығарыу, метамәғлүмәттәр йыйылмаһы һәм рөхсәт эҙләү рәттәре өсөн һайлаусы бағаналар инә.

## Проверка Лейн {#prover-lane}

`irohad` башланғыс ваҡытта FastPQ провер лентаһын башлай, әгәр провер бэкэндаһы инициациялана алһа. Лен - сикләнгән сиратлы фоновой эш. Блок башҡарғандан һуң бойондороҡлау юлы блок хэшигы, бейеклеге, ҡарашы һәм шаһиты булған провер заданиеһын тапшыра.

Әгәр юл хәрәкәт итмәй йәки сират тулы булһа, эш ситтә ҡалдырыла һәм ғәҙәти блок эшкәртеү дауам итә. Был фоновой провер ленты транзакция ҡабул итеү йәки консенсус ҡапҡаһы түгел тигәнде аңлата.

Юл проверкаһын төҙөй:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` проверкаға доступлы бэк-энд һайларға мөмкинлек бирә. `cpu` пинҙар менән башҡарыу CPU өҫтөнлөк итә. `gpu` GPU үтәлеүен хуплай, ә CPU фалб-эксплуатацияһы өсөн талап ителгән ядролар ҡулланылмай.

## Тикшереү {#verification}

FastPQ иҫбатлау верификацияһы каноник партия йөкләмәһен ҡайтанан төҙөй һәм асыҡ транскриптты ҡабатлай. Verifier протокол версияһын, параметрҙар ҡуйылған версияны, ҡабаттан уйнатыу сикләүҙәрен, эҙләнеү йөкләмәләрен, йәмәғәт инештәрен, өлгөләтелгән Merkle киңлектәрен, AIR киңлектәрен һәм FRI һорауҙар сылбырын тикшерә.

Үҙенсәлекле ҡабаттан уйнатыу сиктәре:

|Сикләү |Дефолт |
| ------------------ | ------: |
|Переход рәттәре |     256 |
|Партияның файҙалы йөк күләме |256 KiB |
|FRI ҡатламдар |      16 |
|Һорауҙар |     128 |

## Nexus Тикшерелгән эстафеталар {#nexus-verified-relays}

Nexus AXT иҫбатлау конверттарҙа бер `AxtFastpqBinding`. Ҡасан `RegisterVerifiedLaneRelay` үтәй, Iroha:

1. юл эстафетаһы конвертын һәм FastPQ иҫбатлау материалын тикшерә.
2. мәғлүмәттәр арауығын һәм манифест тамырын тикшерә
3. AXT иҫбатлау конвертын декодлай
4. `fastpq_binding` талап итә
5. FastPQ партияһын ошо бәйләүҙән ҡайтанан төҙөй
6. FastPQ индерелгән иҫбатлауҙы декодлай
7. FastPQ тикшереүсеһен яңынан төҙөлгән партия һәм иҫбатлау буйынса саҡыра

Әгәр раҫлау уңышлы булһа, Iroha `VerifiedLaneRelayRecord` эстафетаға һылтанма, оригиналь конверт, иҫбатлау йөкләмәһе хэшигы, тикшереү бейеклеге, манифст тамыры һәм FastPQ бәйләнеше булған [PH000000) ] һаҡлай.

Йөҙәк эстафетаһында шулай уҡ компактлы FastPQ иҫбатлау материалы бар. Материал - юл идентификаторы, мәғлүмәт киңлеге идентификаторы, блок бейеклеге, раҫлау бейеклектәре, блок башлыҡтары хэшигы, иҫәпләү хэшиғы һәм манифест тамырҙары өҫтөндә эшкәртеү. QC һәм FastPQ иҫбатлау материалына эйә булған осраҡта ғына эстафета берләшергә рөхсәт ителә.

### AXT Математика бәйләүсе {#axt-binding-math}

өсөн Nexus AXT конверттар, `AxtFastpqBinding` иҫбатлау ҡабатландырыу алдынан canonicalized. буш параметр ҡағиҙәләре `fastpq-lane-balanced`; буш верификатор ID һәм версияһы ҡалып буйынса `fastpq` һәм `v1`; заявка тибы ҡыҫҡартылған һәм түбән ҡатламға һалынған.

AXT FastPQ асыҡ инеүҙәр - детерминистик байт хэштәре:

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

AXT күсеү асҡыстары:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` заявкаһында "Ролль гранты" рәтенә индерелгән:

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

`compliance` заявкаһы ике метамәғлүмәт рәтенә индерелә: береһе - сәйәсәт өсөн һәм икенсеһе маҡсатлы мәғлүмәт майҙансыҡтары өсөн.

`tx_predicate` һәм `value_conservation` өсөн, бәйләнеш ыңғай сығанаҡ йәки маҡсатлы күләмгә эйә булған осраҡта, асыҡ эффект күләме ҡулланыла. Юғиһә код сикләнгән детерминистик күләмде ала.

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Унан һуң бер үк күсереү тигеҙләмәләре ҡулланыла:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Синтетик ебәреүсе һәм ҡабул итеүсе иҫәбенең идентификаторҙары төп орлоҡтарҙан барлыҡҡа килә:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Трансфер партияһы хэшиғы:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT партияһы манифестаты SHA-256 каноник бәйләнештең Norito кодировкаһы өҫтөндә:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Асыҡ хәбәр иҫбатлауҙары {#sccp-transparent-message-proofs}

SCCP ярҙамсы һандығында шулай уҡ транспарентлы селтәр аша хәбәрҙәр иҫбатлау өсөн FastPQ ҡулланыла. Был юл `irohad` фоновой провер лентаһынан айырылып тора. Ул FastPQ партияһын туранан-тура SCCP хәбәр иҫбатлау төрөнән һәм манифестан төҙөй, һуңынан һөҙөмтәле иҫбатлауҙы асыҡ тикшереү өсөн уратып ала.

SCCP партияһы `fastpq-lane-balanced` һәм өс метамәғлүмәт күсеүҙәр ҡуллана:

|Ключ |Операция |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

Уның асыҡ инеүҙәре SCCP үтә күренмәле эске иҫбатлауҙан алынған:

|FastPQ инеү |SCCP сығанағы|
| ------------- | ---------------------------------------------------------- |
|`dsid` |Тәүге 16 байт Блейк2б һеңдереүе белдереүҙең hash өҫтөндә|
|`slot` |Финаллылыҡ бейеклеге |
|`old_root` |Файҙалы йөкләмә |
|`new_root` |Вазифалы булыу |
|`perm_root` |Оҙаҡлатыу блогы хэш |
|`tx_set_hash` |Мәғлүмәт хашисы |

SCCP каноник кодерҙар тулы һандарҙы аҙ ендәргә яҙып, үҙгәреүсән оҙонлоҡтағы байт массивтарын түбәндәгесә кодлай:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Асыҡ инеү байты штригы:

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

Прозрачные заявление байты - версиялар, сылбыр ғаиләһе, локаль һәм контрагент домендары, хәүефһеҙлек моделе, якорь идаралығы, иҫәп кодэгы, финаллыҡ моделе, верификатор маҡсаты, верификаторының бэкэнд ғаиләһе, оҙонлоҡтағы префиксированный сылбыр / бэкэнд / манифест ҡырҙары, тәғәйенләнешен бәйләү хэши; аккаунт кодек клавишаһы, файҙалы йөкләмә төрө, йәмәғәт инеү байттары һәм файҙалы йөкләнеш хеш.

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

Был иҫбатлау юлы өсөн FastPQ мәғлүмәттәр арауығы ID-һы икенсе префиксациялы Blake2b дигесенең тәүге ун алты байты:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ партияһы:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

Һуңынан шул уҡ FastPQ команда ҡағиҙәһе буйынса һайлана.

OpenVerify верификатор йөкләмәһе SHA-256 өҫтөндә SCCP хәбәр артында исем һәм каноник FastPQ верификатор һүрәтләүсе:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Үҫемлек FastPQ иҫбатлау Norito-электрон системаһына индерелгән `StarkFriOpenProofV1`, һуңынан уны `OpenVerifyEnvelope` арҡыры менән `Stark`. SCCP тикшереү яңынан шул уҡ төҙөй FastPQ пакет һәм манифесттан партия, асыҡ тикшереү конверт метамәғлүмәттәрен тикшерә, һәм саҡыра FastPQ яңынан төҙөлгән партия һәм иҫбатлау буйынса тикшереүсе.

## Параметрҙар йыйылмаһы {#parameter-sets}

Каноник параметрҙар каталогы ике параметр йыйылмаһын аса. `fastpq-lane-balanced`.

|Параметр |Маҡсат |Баҫыу |Һеш |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |теүәл тәьмин итеү сығымдары |Goldilocks квадратик киңәйтеү |Poseidon2 йөкләмәләре, каталог SHA3 билдәһе |8‐се бүлек, 8‐се этап, 46 һорау |
|`fastpq-lane-latency` |кисектереүсән юлдар |Goldilocks квадратик киңәйтеү |Poseidon2 йөкләмәләре, каталог SHA3 билдәһе |Арита 16, взрыв, 16, 34 һорау |

Икеһе лә 128-битлы хәүефһеҙлекте маҡсат итеп ҡуя һәм `2^16` күләмен ҡуллана. Rust V1 транскрипты ҡабаттан уйнатыу коды әлеге ваҡытта SHA3-256 менән Fiat-Shamir һынау байттарын туранан-тура саҡырыу урынына, `iroha_crypto::Hash::new` менән килтерә.

Rust проверкаһы ҡулланған теүәл каталог константалары:

|Даими |`fastpq-lane-balanced` |`fastpq-lane-latency` |
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

FastPQ конфигурацияһы `zk.fastpq` аҫтында ҡуйылған.

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

Шул уҡ үтәү һәм телеметрия этикеттарын `irohad` аша кире ҡағырға мөмкин:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

Конфигурация майҙансыҡтары өсөн тирә-яҡ мөхит үҙгәреүсәндәре лә ярҙам ителә. FastPQ‐ҡа ярашлы үҙгәреүсәндәр:

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

## Статистика {#metrics}

Телеметрия булдырылған саҡта, FastPQ Backend һайлап алыу өсөн метрикалар экспорты һәм Металл йүгереү тәртибе:

|Метрик |Мәғәнәһе |
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |Заказ ителгән һәм хәл ителгән башҡарыу режимы арттағы һәм ҡулайлама этикеткалары буйынса |
|`fastpq_poseidon_pipeline_total` |Посейдон торбаһы юлы буйынса һоралған һәм хәл ителгән |
|`fastpq_metal_queue_depth` |Металл сират сиктәре, максималь осоу иҫәбе, ебәреү иҫәбе һәм үлсәм алыу тәҙрәһе |
|`fastpq_metal_queue_ratio` |Металл сираттағы мәшғүллек һәм ҡапма-ҡаршылыҡ нисбәттәре |
|`fastpq_zero_fill_duration_ms` |Металл йүгереүҙәр өсөн тулыландырыу ваҡыты |
|`fastpq_zero_fill_bandwidth_gbps` |Асылған нуль тултырыу диапазоны |

Дөйөм күрһәткестәргә ҡарап, уларҙы [ Эшмәкәрлек һәм үлсәүҙәр](/ba/guide/advanced/metrics.md) бүлегендә күрһәтелгән консенсус һәм сират сигналдары менән ҡулланығыҙ.

## Үзара бәйләнешле һылтанма {#related-reference}

- [Мәғлүмәт моделе схемаһы](/ba/reference/data-model-schema.md) генерирулған тип мәғлүмәттәре өсөн
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ варианттары](/ba/reference/irohad-cli.md#arg-fastpq-execution-mode)
