---
translation_locale: ru
translation_source: /blockchain/fastpq.md
translation_source_hash: 55b57e6aeeef2aefa1c8359d9b9487029b106eaebed12a58268b61dc583e97f6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ - это Iroha Я ... STARK Проверка пути для выбранных эффектов исполнения. Это не заменяет нормальное выполнение транзакции или консенсус. Транзакции все еще проходят ISI, IVM, и Sumeragi как обычно; FastPQ Использует детерминистский свидетель исполнения и превращает поддерживаемые эффекты в доказательные партии.

В настоящее время интеграция хоста имеет три основных пути:

- прозрачные цифровые трансферты активов, зафиксированные во время исполнения блоков
- Nexus верифицированные релеи полосы, на обложке доказательства которых AXT находится связывающее устройство FastPQ
- Прозрачные вспомогательные устройства для проверки сообщений SCCP, которые упаковывают доказательство FastPQ в открытый конверт с проверкой

## Перевод пути свидетельства {#transfer-witness-path}

Прозрачные числовые перечисления создают структурированную транскрипту передачи, когда инструкция мутирует балансы.

- исходный счет, учетный счет назначения, определение активов и сумма
- балансы отправителя и получателя до и после передачи;
- хэш пункта входа транзакции, используемый в качестве хэша партии
- справка о полномочиях, полученная из представляемого счета
- Digest Poseidon для однодельтавых транскриптов

При передаче партии используется одна транскрипта с несколькими дельтами, в этом случае отсутствует дизест Poseidon.

При завершении блока Iroha группирует эти транскрипты на хэш-точку входа. Свидетель выполнения затем несет как первоначальные пакеты транскриптов, так и переходные партии FastPQ, подготовленные для проверки.

Каждая передача дельты становится двумя переходными рядами:

|Рынок |Форма ключа |Предварительная оценка |После стоимости |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Дебет отправителя |`asset/<asset-definition>/<source-account>` |баланс отправителя до |баланс отправителя после |
|Кредит получателя |`asset/<asset-definition>/<destination-account>` |баланс получателя до |баланс получателя после |

Цифровые значения нормализуются на целые свидетельские единицы. Значение отклоняется для партий FastPQ, если оно не может быть представлено как неотрицательное `u64` в выбранной десятичной шкале.

## Государственные взносы {#public-inputs}

Каждая партия перехода FastPQ содержит публичные вводы, которые связывают доказательство с контекстом блока и исполнения:

|Ввод |Значение .|
| ------------- | --------------------------------------------------------------- |
|`dsid` |Идентификатор пространства данных , кодируемый как небольшие байты .|
|`slot` |Время создания блоков преобразовано в наносекунды |
|`old_root` |Корень родительского государства , полученный из свидетеля исполнения .|
|`new_root` |Послегосударственный корень , полученный от свидетеля исполнения .|
|`perm_root` |Приверженность Poseidon к разрешениям на активную роль |
|`tx_set_hash` |Hash над сортированными транзакциями и времени-триггер entrypoint hashes |

Хост использует `fastpq-lane-balanced` в качестве канонического параметра для этих партий.

## Математическая модель {#mathematical-model}

В данном разделе описывается арифметика, выполняемая текущим Rust проверщиком и верификатором. Все полевые операции ниже находятся над первостепенным полем "Золотой кусок":

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ использует Poseidon2 `F` Для полевых обязательств губка имеет ширину `t = 3`, процентная ставка `r = 2`, и мощности `1`. Хеш поглощает элементы поля в блоках скорости-2 и добавляет один элемент поля . `1` до окончательной пермутации:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Байтные струи упакованы в 7-байтные маленькие эндианские конечности, поэтому каждая конечность находится строго ниже `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Хеш-поле, разделенные по домену, представлены следующим образом:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Для хэшей, которые начинаются с дигестов байт-домена, FastPQ отображает первые восемь маленьких байтов в поле:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Здесь `Hash` означает `iroha_crypto::Hash::new` Iroha, 32-байтный перевод Blake2bVar, если формула не называет Poseidon2 или SHA-256.

### Полевая арифметика {#field-arithmetic}

Код Rust представляет элементы поля как канонические значения `u64` в `[0,p)`. Добавление и вычитание:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

Умножение сначала вычисляет 128-битный продукт:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Затем Reduction Goldilocks использует идентификацию:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Если:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

Затем редуктор вычисляет:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

Использование условно добавляет или вычитает `p` до тех пор, пока результат не будет каноническим. Подписанные целые числа, такие как дельта баланса, встроены:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Посейдон2 Пермутация {#poseidon2-permutation}

Состояние пермутации Poseidon2:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Его S-коробка:

$$
S(x)=x^5
$$

FastPQ использует четыре полные раунды, пятьдесят семь частичных раундов, затем еще четыре полных раунда. `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` является:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

Частичный раунд:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Все добавления и умножения находятся в `F`. Каноническая матрица MDS:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Хеш-поле начинается с нулевого состояния. Для каждого полного блока со скоростью-2 `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

В последнем блоке добавляется: `1` элемент накладки до последней пермутации. `x_0`.

### Обязательность для публичных входов {#public-input-binding}

Хост кодирует идентификатор пространства данных, записывая его значение `u64` в первые восемь небольших байтов поля 16-байта:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Время создания блоков преобразуется из миллисекунд в наносекунд:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Хеш-счет транзакции - это хэш байтового домена над сортированными хэшами входных точек:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

где `h_i` являются сортированными хэшами транзакций и входных точек времени-выбудителя. В доказательной публике IO, если `perm_root` или `tx_set_hash` все равно нулю, проверка заполняет значения обратного действия:

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

### Цифровая нормализация {#numeric-normalization}

Для каждой дельты передачи целевая десятичная шкала представляет собой максимальную измельченную шкалу по количеству и обе балансовые снимки:

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

Значение `Numeric` с мантиссами `m` и шкалой `q` принимается только при условии, что `m >= 0` и `q <= s`. Его свидетельское значение FastPQ:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Нормализованный результат должен соответствовать `u64`.

### Канонический порядок {#canonical-ordering}

Перед строительством следов партия сортируется по переходному клавишу, рангу работы и индексу первоначального вставления:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

Обязанность заказа представляет собой хэширование поля Poseidon2 над доменом `fastpq:v1:ordering` и кодированием Norito сортированных переходов:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

где `P` представляет собой упаковку 7 байтов, `E` - кодирование Norito, `D_o` - `fastpq:v1:ordering`, а `T*` - сортированный переходный список.

### Уравнения передачи {#transfer-equations}

Для суммы передачи `a`, баланса отправителя `f` и баланса получателя `t`, FastPQ подтверждает нормированные значения свидетелей перед созданием следа:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Затем переходные строки кодируют:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

Внутри следа, подписанные дельты сокращаются до `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

Факультативный дигест передачи единой дельты выполняет кодируемое предварительное изображение передачи:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Для транскриптов многодельта-передач текущий формат требует отсутствия этого высокого уровня переваривания.

Приемный орган переписывает транскрипты передачи:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Ряд следов {#trace-rows}

Пусть сортированный переходный список содержит `n` реальные строки. Длина следа - следующая сила двух:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

Ряды `0..n-1` активны; ряды `n..N-1` - это ряды заполнения. Каждый реальный ряд имеет один набор выбора операции:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Все колонки выборщика - булевые:

$$
s(s-1)=0
$$

Поисковые строки разрешения - это точные строки предоставления роли и отзыва роли:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Для рядов численных операций:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Строитель также следит за дельтами на активы:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Только строки мят и сгорания обновляют счетчик подачи:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Метаданные и колонны следов пространства данных являются хэшами полей, полученными до материализации ряда:

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

Хаш метаданных, хаш пространства данных и слот стабильны по смежным строкам следов:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Перенос столбцов Меркель {#transfer-merkle-columns}

Если отсутствует доказательство хоста, проверка синтезирует детерминистический путь из клавиши строки, предварительного баланса и того, является ли ряд стороной отправителя или приемника.

Для синтетических путей ароматная соль `fastpq:smt:from` для линий отправителя и `fastpq:smt:to` для линий приемника:

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

Синтетический лист и внутренние узлы являются:

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

Следы записывают кусочек . `b_l`, брат и сестра `s_l`, входный узел `x_l`, и выходный узел `x_{l+1}` На каждом уровне, с соглашением кода:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Хаши разрешения {#permission-hashes}

Разделы предоставления и отмены роли расшифровывают свидетель разрешения:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Таблица разрешений хоста сортирует записи по батам роли, батам разрешения и батам эпохи, затем создает дерево Poseidon2 Merkle:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Уровни необычной ширины дублируют последний элемент.

### Отслеживание обязательств {#trace-commitment}

Для каждой колонки следов `c`, FastPQ сначала интерполирует значения колонны над доменой следов и хэширует вектор коэффициента:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

Корень следа - корень Посейдона2 Меркеля над обязательствами столбцов:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Окончательное обязательство отслеживания - это хэш байта над доменом, набором параметров, формой отслеживаний, дигестом колонки и корнем отслеживание:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

где `D_c` является `fastpq:v1:trace_commitment`.

### Состав AIR {#air-composition}

Значение составления V1 AIR представляет собой линейную комбинацию местных остатков ряда.

$$
\alpha_0,\alpha_1 \in F
$$

Для каждой соседней пары рядов `(i,i+1)` проверка вычисляет:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Остатки `rho` следуют в кодовом порядке:

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

Для рядов с числовыми колонками:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

И для стабильных бачек контекстных колонк:

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

Проверщик пересчитывает `A_i` для откровенных рядов из выборки и проверяет его по отношению к стоимости состава, обязавшейся в соответствии с корнем Merkle соединения AIR.

### Продукт поиска {#lookup-product}

Аккумулятор поиска разрешений использует задачу Fiat-Shamir `gamma`. При оценке расширения низкой степени `s_perm` и `perm_hash` работающий продукт:

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

Доказательства:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Низкое расширение {#low-degree-extension}

Пусть `omega_T` является генератором домена следов, `omega_E` - генератором доменов оценки и `g` - конфигурированным косетом. Для колонны следов с значениями `v_i` интерполяция дает коэффициенты `a_j`, такие, чтобы:

$$
f(\omega_T^i)=v_i
$$

Увеличение низкой степени оценивает один и тот же полиномиал на косе:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

Использование вычисляет это, умножая коэффициенты на полномочия косетного компенсирования до FFT:

$$
a'_j = a_j g^j
$$

а затем оценивать `a'` на домене оценки.

В настоящее время CPU FFT - это итеративная трансформация радикс-2 Кули-Туки над бит-обратными входами. `L`, полудлина `H=L/2`, и корень стадии:

$$
\omega_L=\omega^{N/L}
$$

каждый бабочек вычисляет:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

Обратная FFT выполняет ту же трансформацию, что и `omega^{-1}` и масштабирует по размеру обратного домена:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Корни каталога проверяются перед использованием:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Для более мелких доменов, полученных из кореня каталога, генератор является:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Ряд и листья {#row-and-leaf-hashes}

После LDE, FastPQ hashes на каждом ряду по всем LDE колонки. `m` колонки:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Если хаши ряда по-прежнему находятся в домене следов, а не в домене оценки, провер интерполирует и расширяет одну колонку хаша ряда с помощью того же процесса coset LDE.

### Мерклские открытия {#merkle-openings}

Значения LDE группируются в части:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Каждый кусок листа:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Родители Меркл:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Нередкие уровни дублируют последний узел. Пути запроса проверяются путем хэширования слева или справа в соответствии с паритностью индекса листа запроса на каждом уровне.

Для листья с индексом `i` путь `(s_0,\ldots,s_{d-1})` проверяется против корня `R` повторением:

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

Проверка проходит только тогда, когда:

$$
y_d=R
$$

AIR листья ряда следов:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR составные листья:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

Открытие запроса LDE также проверяет, присутствует ли значение, открываемое на индексе оценки `i`, в его аутентифицированной части:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Складка {#fri-folding}

FRI обязуется AIR оценки состава. Для каждого раунда `l` транскрипты пробивают вызов `beta_l`. Слой заполняется на множественное количество арности, повторяя последнее значение. Каждая группа размером с arity складывается в:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

где `a` представляет собой значение FRI. Проверщик проверяет для каждой выбранной образцом цепочки запросов:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

и удостоверяет подлинность каждой открытой группы FRI по соответствующему корню слоя FRI.

### Транскрипция Fiat-Shamir {#fiat-shamir-transcript}

Канонический каталог параметров маркирует хэш транскрипта как SHA3-256. Нынешняя реализация провера и верификатора выводит байты вызова с `iroha_crypto::Hash::new`, который является 32-байтомным дигестом Blake2bVar, а затем уменьшает первые восемь небольших эндианских байтов на `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Призывы вызова добавляют полный перевод к состоянию транскрипта.

1. публичная IO, протокольная версия, параметровая версия и название параметра;
2. LDE корень и корень следов
3. `gamma`
4. Составные проблемы AIR `alpha_0`, `alpha_1`
5. AIR корень следов и корень состава AIR
6. поиск грандиозный продукт
7. Корни слоев FRI и вызовы `beta_l`
8. индексы запросов с выборкой

Запросная выборка продолжает рисовать 32-байтные дигесты вызова и читать их в виде небольших отрезков `u64` до тех пор, пока она не получит запрошенное количество уникальных индексов:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

Образец сборки возвращается в сортированном порядке.

### Повторное воспроизведение проверки {#verifier-replay}

В первую очередь проверяющий пересчитывает обязательство партии:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

и требует:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

Он также восстанавливает общественность IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Каждое поле должно соответствовать публичному IO байту за байтом доказательства. Затем проверяющий восстанавливает ту же транскрипт и получает такую же:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Для каждого запроса, сделанного по образцу `q`, он проверяет:

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

и:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

В настоящее время AIR открытие композиции должно быть удостоверено под `R_air_composition`. В настоящее время FRI цепь затем начинается с того же `A_q` и должны завершаться в завершенном завершении FRI лист под терминалом FRI корень.

## Что проверяет Притча {#what-the-prover-checks}

Прежде чем создать след, проверщик FastPQ канонизирует порядок партии по переходному клавишу, рангу работы, и порядка введения. Переводные строки также требуют метаданных транскрипта. Партия с переводными строками, но без транскриптов передачи является недействительной.

Для переводных транскриптов проверки на стороне провизора включают:

- баланс отправителя не должен поступать ниже
- `sender_after` должен быть равен `sender_before - amount`
- `receiver_after` должен быть равен `receiver_before + amount`
- Перепись должна охватывать каждый переводный ряд в партии.
- Digest Poseidon с одной дельтой, если присутствует, должен соответствовать предварительным изображениям транскрипта.
- при условии, что детерминированные синтетические доказательства должны расшифровываться в виде версии 1; отсутствующие пути заполнены детерминистическими синтетическими доказательствами

Отслеживание содержит колонки селектора для передачи, монетки, сжигания, предоставления ролей, отмены ролей, набор метаданных и строки поиска разрешений. - Да . Числовые строки операций также содержат подписанные дельты, действующие дельта на активы и счетчики поставок.

## Проверка Лейна {#prover-lane}

`iroha3d` запускает проверку FastPQ при запуске, если проверка может быть инициирована. Проверка представляет собой задачу в фоне с ограниченной очередью. После того, как блок производит свидетель выполнения, путь commit отправляет работу проверки, содержащую хэш блока, высоту, вид и свидетель.

Если полоса не работает или очередь заполнена, работа пропущена и обычная обработка блоков продолжается. Это означает, что фоновый проверный полос - это не прием транзакций или шлюз консенсуса. Это путь проверки производства над состоянием, который уже выполнен.

По проезжей части строят проверку:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` позволяет проверяющему выбрать доступный бэкэнд. `cpu` Пин исполнение к CPU. `gpu` предпочитает GPU исполнение, с CPU fallback, когда обратный конец не может использовать запрашиваемые ядра.

## Проверка {#verification}

FastPQ проверка доказательств восстанавливает каноническую партию обязательства и заменяет общественную транскрипцию. Проверщик проверяет версию протокола, версию параметров, пределы воспроизведения, обязательства по отслеживанию, публичные вводы, пробные отверстия Merkle, AIR открытия, и FRI цепочка запросов.

Ограничения повторяния по умолчанию включают:

|Ограничение|По умолчанию |
| ------------------ | ------: |
|Переходные строки |     256 |
|Размер полного груза партии |256 KiB |
|FRI слои |      16 |
|Вопросы открытия |     128 |

## Nexus Проверенные реле {#nexus-verified-relays}

Nexus AXT свидетельские конверты могут включать в себя `AxtFastpqBinding`. Когда `RegisterVerifiedLaneRelay` исполняет, Iroha:

1. проверяет обложку релевого полоса и материалы прочности FastPQ
2. проверяет пространство данных и корень манифестирования
3. декодирует оболочку доказательств AXT
4. требует `fastpq_binding`
5. восстанавливает партию FastPQ из этой связки
6. декодирует встроенное доказательство FastPQ
7. вызовет проверяющего FastPQ на перестроенную партию и доказательство

В случае успешной проверки Iroha сохраняет `VerifiedLaneRelayRecord`, содержащий ссылку на реле, оригинальную конвертку, хеш-нагрузку доказательства, высоту проверки, корень манифестирования и связывание FastPQ.

В линейных релевых конвертах также есть компактный FastPQ доказательный материал. Материал представляет собой перечисление идентификатора полосы, идентификатора пространства данных, высоты блока, высоты проверки, хэширования заголовков блоков, хэширование расчетов и корня манифеста. Слияние эстафеты допускается только в том случае, если у него есть как доказательный материал QC, так и действительный FastPQ.

### AXT Обязательная математика {#axt-binding-math}

Для Nexus AXT конверты, `AxtFastpqBinding` пустые параметры по умолчанию для `fastpq-lane-balanced`; пустой идентификатор проверщика и версия по умолчанию `fastpq` и `v1`; тип заявления сокращается и уменьшается.

Публичные входы AXT FastPQ представляют собой определённые байт-хаши:

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

Переходные ключи AXT:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

В заявке `authorization` вставляется строка "дополнительная часть":

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

и ряд метаданных, обязывающий политику выдачи разрешений. В заявке `compliance` вводятся две строки метаданных: одна для политики, а другая - для целевых пространств.

Для `tx_predicate` и `value_conservation` используется выраженная величина эффекта, если связь содержит положительную сумму источника или назначения. В противном случае код получает ограниченную детерминирующую величину:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Затем используются те же уравнения передачи:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Синтетические идентификаторы учетной записи отправителя и получателя генерируются из ключевых семян:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Хеш для передачи партии:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

Манифест партии AXT переводится как SHA-256 над кодированием Norito канонического связывающего устройства:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Прозрачное подтверждение сообщения {#sccp-transparent-message-proofs}

В помощном ящике SCCP также используется FastPQ для прозрачных доказательств передачи сообщений с перекрестной цепочкой. Этот путь отделен от фоновой полосы проверки `iroha3d`. Он создает партию FastPQ непосредственно из пакета доказательств сообщений SCCP и манифеста, а затем заворачивает полученное доказательство для открытой проверки.

В партии SCCP используются `fastpq-lane-balanced` и три перехода метаданных:

|Ключ .|Операция |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

Его публичные вводы получены из прозрачного внутреннего доказательства SCCP:

|FastPQ вход |SCCP источник|
| ------------- | ---------------------------------------------------------- |
|`dsid` |Первые 16 байтов переваривания Blake2b над заявлением hash |
|`slot` |Высота завершения |
|`old_root` |Нагрузка на загрузку|
|`new_root` |Корень обязательства |
|`perm_root` |Хеш-блок окончательности |
|`tx_set_hash` |Заявление хэш |

Канонические кодеры SCCP записывают целые числа небольшим эндианом и кодируют массивы байтов переменной длины, как:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Прозрачная последовательность публичных вводных байтов является:

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

Прозрачные байты заявления - это конкаценация версии, семейства цепочек, локальных и контрагентных доменов, модель безопасности, управление якорем, кодек учетной записи, модель окончательности, целевая цель верификатора, семья бэкэнд-верификатора, поля длиной префиксированной цепочки/бэкэнд/манифеста, хэш с обязательным назначением; Ключ к кодеку учетной записи, тип полезной нагрузки, публичные байты ввода и хэш полезной загрузки.

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

Идентификатор пространства данных FastPQ для этого пути доказательства - это первые шестнадцать байтов другого префиксированного диджета Blake2b:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

партия SCCP FastPQ является точно:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

Затем сортировка по тому же правилу заказа FastPQ.

В настоящее время OpenVerify обязательства проверщика SHA-256 на SCCP имя задней части сообщения и канонический FastPQ описатель верификатора:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Сырье FastPQ доказательство Norito-кодируются в `StarkFriOpenProofV1`, Затем упакованный в `OpenVerifyEnvelope` с задней панелью `Stark`. SCCP проверка восстанавливает то же самое FastPQ партия из пакета и манифеста, проверяет метаданные открытого конверта верификации, и обращается к FastPQ верификатор на перестроенной партии и доказательство.

## Параметровые наборы {#parameter-sets}

Канонный каталог параметров раскрывает два набора параметров. В настоящее время проездная полоса проводника использует `fastpq-lane-balanced`.

|Параметр |Цель .|Поле |Хаши |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |сбалансированная пропускная способность |Золотолосы квадратное расширение |Обязательства Poseidon2, каталог SHA3 |Арита 8, взрыв, 8, 46 вопросов |
|`fastpq-lane-latency` |трассы с чувствительным к задержке |Золотолосы квадратное расширение |Обязательства Poseidon2, каталог SHA3 |Аритет 16, взрыв 16, 34 запроса |

Оба целятся на 128-битную безопасность и используют размер домена отслеживания `2^16`. Код воспроизведения транскрипта Rust V1 в настоящее время выводит байты задачи Fiat-Shamir с помощью `iroha_crypto::Hash::new` вместо того, чтобы прямо призывать SHA3-256.

Точные постоянные каталога, используемые провайдером Rust, являются:

|Постоянно .|`fastpq-lane-balanced` |`fastpq-lane-latency` |
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

Конфигурация FastPQ размещена под `zk.fastpq`.

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

Те же маркировки выполнения и телеметрии могут быть отменены на `iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Окружающие переменные также поддерживаются для полей конфигурации. FastPQ-специфические переменные включают:

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

## Показатели {#metrics}

При включении телеметрии FastPQ экспортирует показатели для выбора бэкэнда и поведения металла в течение времени выполнения:

|Метрический |Значение .|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |Запрошенный и решенный режим выполнения по бакетам заднего кода и ярлыкам устройств |
|`fastpq_poseidon_pipeline_total` |Запрошенный и решенный путь трубопровода " Посейдон " |
|`fastpq_metal_queue_depth` |Металловой лимит очереди, максимальное количество в полете, количество отправки и окно выборки образцов |
|`fastpq_metal_queue_ratio` |Металлическая очередь занята и соотношения перекрытия |
|`fastpq_zero_fill_duration_ms` |Продолжительность заполнения хоста для металлических путей |
|`fastpq_zero_fill_bandwidth_gbps` |Выделенная нулевая полоса пропускания |

Для общего отбора производительности используйте эти сигналы с консенсусом и сигналами очереди, перечисленными в [Способность и показатели ](/ru/guide/advanced/metrics.md).

## Соответствующая ссылка {#related-reference}

- [Схема модели данных ](/ru/reference/data-model-schema.md) для получения деталей типа
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ опционы](/ru/reference/iroha3d-cli.md#arg-fastpq-execution-mode)
