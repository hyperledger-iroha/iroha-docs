---
translation_locale: ru
translation_source: /blockchain/fastpq.md
translation_source_hash: d8dd61390f5df3dae09b70399e04e8f71716a912ef5dea9010feaf60573ed261
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# FastPQ {#fastpq}

FastPQ является Iroha’s STARK путем доказательства для выбранных эффектов выполнения. Он не заменяет обычное выполнение транзакций или консенсус. Транзакции по-прежнему пропустите через ISI, IVM и Sumeragi как обычно; FastPQ использует свидетельство детерминированного выполнения и превращает поддерживаемые эффекты в партии доказательств.

Текущая интеграция с хостом имеет три основных пути:

- прозрачные числовые переводы активов, зафиксированные во время выполнения блока
- Nexus проверенные реле исполнительной линии, данные доказательства AXT которых содержат связывание FastPQ
- SCCP прозрачные помощники по проверке сообщений, которые оборачивают FastPQ доказательство в контейнер данных для открытой проверки

## Путь передачи свидетеля {#transfer-witness-path}

Прозрачные числовые переводы создают структурированную транскрипцию перевода, когда инструкция изменяет балансы. Транскрипция фиксирует:

- исходный счет, целевой счет, определение актива и сумма
- балансы отправителя и получателя до и после перевода
- криптографический хэш точки входа транзакции, используемый в качестве криптографического хэша пакета
- основное криптографическое значение дайджеста авторизации, полученное из подающего аккаунта
- криптографическое значение дайджеста Poseidon для одно-дельтовых транскриптов

Пакетные переводы используют один транскрипт с несколькими дельтами. В этом случае значение криптографической сводки Poseidon для одной дельты отсутствует.

При финализации блока Iroha группирует эти транскрипты по криптографическому хешу точки входа. Свидетель исполнения затем передает как исходные пакеты транскриптов, так и FastPQ пакеты переходов, подготовленные для доказателя.

Каждый дельта-перенос превращается в две переходные строки:

|Ряд|Форма ключа|Предыдущее значение|Пост-значение|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Дебет отправителя|`asset/<asset-definition>/<source-account>`      |баланс отправителя до|баланс отправителя после|
|Кредит получателя| `asset/<asset-definition>/<destination-account>` |баланс получателя до|баланс получателя после|

Числовые значения нормализуются в целые единицы носителя. Значение отклоняется для пакетной обработки FastPQ, если оно не может быть представлено как неотрицательное `u64` при выбранном десятичном масштабе.

## Публичные данные {#public-inputs}

Каждая FastPQ переходная партия содержит публичные входные данные, которые связывают доказательство с блоком и контекстом выполнения:

| Ввод |Значение|
| ------------- | --------------------------------------------------------------- |
|`dsid`        |Идентификатор пространства данных, закодированный в виде байтов с порядком little-endian|
| `slot`        |Время создания блока, преобразованное в наносекунды|
|`old_root`|Корневое состояние родительского узла, выведенное из доказательства выполнения|
| `new_root`    |Корень пост-состояния, полученный из свидетеля выполнения|
| `perm_root`   |Криптографическое значение обязательства Посейдона по разрешениям активной роли|
| `tx_set_hash` |криптографический хэш по отсортированным транзакциям и криптографические хэши точки входа, срабатывающей по времени|

Хост использует `fastpq-lane-balanced` в качестве канонического набора параметров для этих пакетов.

## Математическая модель {#mathematical-model}

В этом разделе описывается арифметика, реализованная текущими доказателем и проверяющим Rust. Все операции над полями ниже выполняются в поле простого числа Goldilocks:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ использует Poseidon2 вместо `F` для значений криптографического обязательства поля. Губка имеет ширину `t = 3`, скорость `r = 2` и ёмкость `1`. Криптографический хеш поглощает элементы поля блоками по 2 и добавляет один элемент поля `1` перед финальной перестановкой:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Байтовые строки упаковываются в 7-байтовые разряды с порядком байтов little-endian так, чтобы каждый разряд был строго меньше `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Криптографические хэши полей с разделением по доменам представлены как:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Для криптографических хешей, которые начинаются с криптографических дайджестов в байтовой области, FastPQ отображает первые восемь байтов в формате little-endian в поле:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Здесь `Hash` означает Iroha's `iroha_crypto::Hash::new`, 32-байтовое криптографическое значение дайджеста Blake2bVar, если только формула явно не называет Poseidon2 или SHA-256.

### Арифметика полей {#field-arithmetic}

Код Rust представляет элементы поля как канонические значения `u64` в `[0,p)`. Сложение и вычитание выполняются следующим образом:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

Умножение сначала вычисляет 128-битное произведение:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Редукция Златовласки затем использует тождество:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Если:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

тогда редуктор вычисляет:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

Реализация условно добавляет или вычитает `p` до тех пор, пока результат не станет каноническим. Знаковые целые числа, такие как дельты баланса, внедряются следующим образом:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Пермутация Poseidon2 {#poseidon2-permutation}

Состояние перестановки Poseidon2 следующее:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Её S-блок:

$$
S(x)=x^5
$$

FastPQ использует четыре полных раунда, пятьдесят семь частичных раундов, затем ещё четыре полных раунда. Полный раунд с раундовыми константами `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` выглядит так:

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

Все сложения и умножения выполняются в `F`. Каноническая матрица MDS выглядит так:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Поле криптографического хэша начинается с нулевого состояния. Для каждого полного блока с пропускной способностью 2 `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

Последний блок добавляет элемент заполнения `1` перед последней перестановкой. На выходе получается `x_0`.

### Привязка публичного ввода {#public-input-binding}

Хост кодирует идентификатор пространства данных, записывая его значение `u64` в первые восемь байт поля размером 16 байт в формате little-endian:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Время создания блока конвертируется из миллисекунд в наносекунды:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Криптографический хеш набора транзакций является байтовым криптографическим хешем по отсортированным криптографическим хешам точек входа:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

где `h_i` — это отсортированные хэши транзакций и входных точек с временным триггером. В публичном доказательстве IO, если `perm_root` или `tx_set_hash` равны нулю, доказывающий заполняет запасные значения:

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

### Числовая нормализация {#numeric-normalization}

Для каждого дельта-перевода целевая десятичная шкала является максимальной усечённой шкалой среди суммы и двух снимков данных баланса:

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

Значение `Numeric` с мантиссой `m` и масштабом `q` принимается только тогда, когда `m >= 0` и `q <= s`. Его эталонное значение FastPQ равно:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Нормализованный результат должен помещаться в `u64`.

### канонический порядок {#canonical-ordering}

Перед построением трассировки пакет сортируется по ключу перехода, рангу операции и исходному индексу вставки:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

Значение криптографического обязательства упорядочивания — это криптографический хэш поля Poseidon2 по домену `fastpq:v1:ordering` и Norito кодированию отсортированных переходов:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

где `P` — это 7-байтовая упаковка, `E` — это кодирование Norito, `D_o` — это `fastpq:v1:ordering`, а `T*` — это отсортированный список переходов.

### Уравнения переноса {#transfer-equations}

Для суммы перевода `a`, баланса отправителя `f` и баланса получателя `t`, FastPQ проверяет нормализованные значения свидетелей перед построением трассировки:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Строки перехода затем кодируют:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

Внутри трассировки подписанные дельты сводятся в `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

Необязательный дайджест передачи с одной дельтой криптографически связывает закодированный прообраз передачи:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Для транскриптов с множественной дельтой текущий формат требует, чтобы это криптографическое контрольное значение верхнего уровня отсутствовало.

Значение основного криптографического дайджеста авторизации хоста для транскриптов передачи:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Проследить строки {#trace-rows}

Пусть отсортированный список переходов содержит `n` реальных строк. Длина трассы равна следующей степени двойки:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

Строки `0..n-1` активны; строки `n..N-1` являются строками заполнителя. Каждая реальная строка имеет установленный один селектор операции:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Все столбцы селектора являются логическими:

$$
s(s-1)=0
$$

Строки поиска разрешений точно такие же, как строки предоставления роли и отмены роли:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Для строк числовых операций:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Создатель также отслеживает текущие дельты по каждому активу:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Только выпуск и уничтожение строк обновляют счетчик поставок:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Столбцы трассировки метаданных и пространства данных — это криптографические хэши полей, полученные до материализации строк:

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

Криптографический хеш метаданных, криптографический хеш пространства данных и слот стабильны в соседних строках трассы:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Передача колонок Меркле {#transfer-merkle-columns}

Строки передачи содержат разреженный Меркле-путь из 32 уровней. Если доказательство хоста отсутствует, доказывающая сторона синтезирует детерминированный путь из ключа строки, предварительного баланса и того, является ли строка стороной отправителя или получателя.

Для синтетических путей ароматическая соль — `fastpq:smt:from` для строк отправителя и `fastpq:smt:to` для строк получателя:

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

Синтетический лист и внутренние узлы следующие:

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

След отслеживает бит `b_l`, сиблинга `s_l`, входной узел `x_l` и выходной узел `x_{l+1}` на каждом уровне. С учетом конвенции ветвления кода:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Разрешение криптографических хешей {#permission-hashes}

Назначение и отзыв роли строк криптографический хэш свидетель разрешения:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Таблица разрешений хоста root сортирует записи по байтам роли, байтам разрешений и байтам эпохи, затем строит дерево Меркла Poseidon2:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Уровни с нечётной шириной дублируют последний элемент.

### Отслеживать значение криптографического обязательства {#trace-commitment}

Для каждого столбца следа `c`, FastPQ сначала выполняется интерполяция значений столбца по области следа и выполняется криптографическое хеширование вектора коэффициентов:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

След корня — это корень Меркла Poseidon2 для значений криптографических обязательств столбца:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Окончательное значение криптографического обязательства трассы представляет собой байтовый криптографический хэш по домену, набору параметров, форме трассы, криптографическим дайджестам столбцов и корню трассы:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

где `D_c` — это `fastpq:v1:trace_commitment`.

### AIR Состав {#air-composition}

Значение композиции V1 AIR является линейной комбинацией остатков, локальных для строки. Транскрипт выбирает два вызова:

$$
\alpha_0,\alpha_1 \in F
$$

Для каждой смежной пары строк `(i,i+1)` доказывающий вычисляет:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Остатки `rho` идут в порядке кода:

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

Для строк с числовыми столбцами:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

И для стабильных столбцов контекста пакета:

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

Проверяющий пересчитывает `A_i` для выбранных открытий строк и проверяет его по сравнению со значением композиции, криптографически связанным с корнем дерева Меркла композиции AIR.

### Поиск продукта {#lookup-product}

Аккумулятор поиска разрешений использует вызов Fiat-Shamir `gamma`. На основе оценок расширения низкой степени `s_perm` и `perm_hash` выполняется произведение:

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

Протокол доказывает:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Расширение низкой степени {#low-degree-extension}

Пусть `omega_T` — генератор области следа, `omega_E` — генератор области оценки, а `g` — настроенный смещение косета. Для столбца следа со значениями `v_i` интерполяция дает коэффициенты `a_j` такими, что:

$$
f(\omega_T^i)=v_i
$$

Расширение низкой степени оценивает тот же многочлен на косете:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

Реализация вычисляет это, умножая коэффициенты на степени смещения косета перед FFT:

$$
a'_j = a_j g^j
$$

а затем оценка `a'` на оценочной области.

CPU FFT является итеративным преобразованием Кули-Тьюки с основанием 2 для бит-реверсированных входов. На этапе длиной `L`, с половинной длиной `H=L/2` и корнем этапа:

$$
\omega_L=\omega^{N/L}
$$

каждая бабочка вычисляет:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

Обратное FFT выполняет ту же трансформацию с `omega^{-1}` и масштабируется на обратный размер области:

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

Для меньших доменов, происходящих от корня каталога, генератор выглядит следующим образом:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Криптографические хэши Row и Leaf {#row-and-leaf-hashes}

После LDE FastPQ криптографически хэширует каждую строку по всем LDE столбцам. Для `m` столбцов:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Если необработанные криптографические хэши все еще находятся в домене трассировки, а не в домене оценки, доказывающий выполняет интерполяцию и расширяет этот единственный столбец хэшей строки с помощью того же процесса косета LDE.

### Открытия Меркла {#merkle-openings}

Значения LDE группируются на блоки по:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Каждый листок кусочка:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Родители Меркла:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Нечетные уровни дублируют последний узел. Пути запроса проверяются путем хэширования влево или вправо в зависимости от четности индекса листа запроса на каждом уровне.

Для листа с индексом `i` путь `(s_0,\ldots,s_{d-1})` проверяется относительно корня `R` по рекуррентной формуле:

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

AIR следовые листья рядов:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR состав листьев:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

Открытие запроса LDE также проверяет, что значение, открытое на индексе оценки `i`, присутствует в его аутентифицированном фрагменте:

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

FRI криптографически связывается с оценками композиции AIR. Для каждого раунда `l` протокол выбирает случайный вызов `beta_l`. Слой заполняется до кратного значения арности повторением последнего значения. Каждая группа размером с арность сворачивается в:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

где `a` — это FRI арность. Проверяющий проверяет для каждой выбранной цепочки запросов, что:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

и аутентифицирует каждую открытую группу FRI по соответствующему корню слоя FRI.

### Протокол Фиат-Шамира {#fiat-shamir-transcript}

Канонический каталог параметров обозначает криптографический хэш транскрипта как SHA3-256. Текущая реализация доказателя и проверяющего получает байты вызова с помощью `iroha_crypto::Hash::new`, который является 32-байтовым криптографическим дайджестом Blake2bVar. затем сокращает первые восемь байтов с младшим порядком следования в `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Вызовы функции получения испытаний добавляют полный дайджест в состояние транскрипта. Порядок воспроизведения:

1. публичный IO, версия протокола, версия параметра и имя параметра
2. LDE корень и след корня
3. `gamma`
4. AIR трудности композиции `alpha_0`, `alpha_1`
5. AIR трассировать корень и AIR корень состава
6. поиск большого продукта
7. FRI слои корней и `beta_l` проблемы
8. выбранные индексы запросов

Выборка запросов продолжает извлекать 32-байтовые криптографические дайджесты вызова и читать их как маленько-эндианные `u64` фрагменты, пока не будет набрано запрошенное количество уникальных индексов:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

Выборка возвращается в отсортированном порядке.

### Повторная проверка {#verifier-replay}

Проверяющий сначала заново вычисляет пакетное криптографическое значение обязательства:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

и требует:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

Он также перестраивает публичный IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Каждое поле должно точно соответствовать публичному IO доказательству, байт за байтом. Затем проверяющий восстанавливает тот же самый транскрипт и получает то же самое:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Для каждого выбранного запроса `q` выполняется проверка:

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

Открытие композиции AIR должно быть аутентифицировано под `R_air_composition`. Цепочка FRI затем начинается с того же `A_q` и должна завершаться аутентифицированным финальным листом FRI под терминальным корнем FRI.

## Что проверяет доказатель {#what-the-prover-checks}

Перед построением трассировки провайдер FastPQ канонизирует порядок пакета по ключу перехода, рангу операции и порядку вставки. Строки передачи также требуют метаданных транскрипта. Пакет со строками передачи, но без транскриптов передачи, является недействительным.

Для передачи транскриптов проверки на стороне предоставителя включают:

- баланс отправителя не должен становиться отрицательным
- `sender_after` должен быть равен `sender_before - amount`
- `receiver_after` должен быть равен `receiver_before + amount`
- транскрипт должен охватывать каждую строку перевода в пакете
- дайджест Poseidon с одной дельтой, если он присутствует, должен совпадать с прообразом транскрипта
- предоставленные разреженные доказательства Меркле должны декодироваться как версия 1; отсутствующие пути заполняются детерминированными синтетическими доказательствами

Трассировка содержит колонки селектора для передачи, выдачи, уничтожения, предоставления роли, отзыва роли, установки метаданных и поиска разрешений. Строки числовых операций также содержат подписанные изменения, накопительные изменения по каждому активу и счетчики предложения.

## Полоса выполнения проверщика {#prover-lane}

`iroha3d` запускает выполнение FastPQ на старте, если можно инициализировать сервер доказательств. Линия выполнения — это фоновая задача с ограниченной очередью. После того как блок создает свидетельство выполнения, путь финализации консенсуса отправляет задачу доказателя, содержащую криптографический хэш блока, его высоту, вид и свидетельство.

Если линия выполнения не работает или очередь полна, задание пропускается, и обычная обработка блоков продолжается. Это означает, что фоновая линия выполнения доказателя не является шлюзом допуска транзакций или согласования. Это путь производства доказательств по состоянию, которое уже было выполнено.

Полоса выполнения создаёт доказателя с:

```text
parameter = "fastpq-lane-balanced"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Обе настройки по умолчанию установлены на `cpu`. Выбор `gpu` является явным запросом с закрытием при сбое: если поддержка GPU не скомпилирована или запрошенный бекенд GPU не проходит предварительную проверку, канал выполнения проверяющего остается отключенным. Первый выпуск не имеет значения `auto` и не переходит с запрошенного режима GPU на CPU.

## Проверка {#verification}

FastPQ проверка доказательства восстанавливает каноническое пакетное криптографическое значение обязательства и воспроизводит публичный протокол. Проверяющий проверяет версию протокола, версия набора параметров, ограничения воспроизведения, значение криптографического обязательства трассировки, публичные входные данные, выбраные открытия Меркле, открытия AIR и цепочка запросов FRI.

Стандартные ограничения воспроизведения включают:

|Лимит|По умолчанию|
| ------------------ | ------: |
|Переходные строки|     256 |
|Размер пакета данных|256 KiB|
| FRI слои         |      16 |
|Запрос открытий|     128 |

## Nexus Проверенные реле {#nexus-verified-relays}

Nexus AXT контейнеры данных доказательств могут внедрять `AxtFastpqBinding`. Когда выполняется `RegisterVerifiedLaneRelay`, Iroha:

1. проверяет контейнер данных реле исполнительной линии и FastPQ доказательный материал
2. проверяет пространство данных и корень технического манифеста
3. декодирует контейнер данных доказательства AXT
4. требует `fastpq_binding`
5. восстанавливает пакет FastPQ из этой привязки
6. декодирует встроенное доказательство FastPQ
7. вызывает проверяющий FastPQ на перестроенной партии и доказательстве

Если проверка успешна, Iroha сохраняет `VerifiedLaneRelayRecord`, содержащий ссылку на ретрансляцию, исходный контейнер данных, криптографический хэш полезной нагрузки доказательства, высоту проверки, корень технического манифеста и связывание FastPQ.

Контейнеры данных реле исполнительной линии также содержат компактный FastPQ доказательный материал. Этот материал представляет собой криптографическое значение дайджеста по идентификатору исполнительной линии, идентификатору пространства данных, высоте блока, высоте проверки, криптографический хэш заголовка блока, криптографический хэш расчета финансовой транзакции и корень технического манифеста. Ретрансляция считается допустимой для слияния только тогда, когда она имеет как QC, так и действительный FastPQ доказательный материал.

### AXT Привязка математики {#axt-binding-math}

Для контейнеров данных Nexus AXT `AxtFastpqBinding` канонизируется перед повторным воспроизведением доказательства. Пустые значения параметров по умолчанию принимают `fastpq-lane-balanced`; пустой идентификатор и версия проверяющего по умолчанию принимают значения `fastpq` и `v1`; тип утверждения обрезается и приводится к нижнему регистру.

Детерминированные байтовые криптографические хэши публичных входных данных AXT FastPQ:

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

AXT ключи перехода:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

Запрос `authorization` вставляет строку предоставления роли:

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

и строка метаданных, связывающая политику авторизации. Утверждение `compliance` вставляет две строки метаданных: одну для политики и одну для целевых областей данных.

Для `tx_predicate` и `value_conservation` используется явная величина эффекта, когда привязка содержит положительную исходную или целевую величину. В противном случае код выводит ограниченную детерминированную величину:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Затем используются те же уравнения переноса:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Синтетические идентификаторы учетных записей отправителя и получателя генерируются из ключевых семян:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Криптографический хэш пакета передачи:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

Значение криптографического дайджеста технического манифеста партии AXT составляет SHA-256 по кодировке Norito канонического связывания:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Прозрачные доказательства сообщений {#sccp-transparent-message-proofs}

Пакет вспомогательного программного обеспечения SCCP также использует FastPQ для прозрачных доказательств сообщений между цепочками. Этот путь отделен от потока выполнения фонового доказателя `iroha3d`. Он создает пакет FastPQ непосредственно из пакета доказательств сообщения SCCP и технического манифеста, а затем оборачивает полученное доказательство для открытой проверки.

Партия SCCP использует `fastpq-lane-balanced` и три перехода метаданных:

|Клавиша|Операция|
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

Его публичные входные данные получены из прозрачного внутреннего доказательства SCCP:

| FastPQ ввод | SCCP источник                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        |Первые 16 байт криптографического дайджеста Blake2b для криптографического хэша утверждения|
|`slot`        |Высота завершенности|
| `old_root`    |Криптографический хэш полезной нагрузки|
| `new_root`    |криптографическое значение корня обязательства|
| `perm_root`   |Криптографический хэш блока финальности|
| `tx_set_hash` |Заявление о криптографическом хэше|

Канонические энкодеры SCCP записывают целые числа в порядке little-endian и кодируют массивы байтов переменной длины следующим образом:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Прозрачная строка байтов публичного ввода:

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

Прозрачные байты заявления являются конкатенацией версии, семейства цепочки, локальных и контрагентских доменов, модели безопасности, управления якорем, кодека аккаунта, модели финальности, цели проверяющего, семейства бэкенда проверяющего, полей цепочки/бэкенда/манифеста с префиксом длины, назначение привязки криптографического хэша, кодек ключа учетной записи, тип полезной нагрузки, байты публичного ввода и криптографический хэш полезной нагрузки. Криптографический хэш утверждения:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

Идентификатор пространства данных FastPQ для этого пути доказательства представляет собой первые шестнадцать байт другого криптографического дайджеста Blake2b с префиксом:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

Партия SCCP FastPQ точно:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

затем отсортировано по тому же правилу упорядочивания FastPQ.

Криптографическое значение обязательства проверяющего OpenVerify составляет SHA-256 для имени бэкенда сообщения SCCP и канонического описателя проверяющего FastPQ:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Необработанное FastPQ доказательство Norito-кодируется в `StarkFriOpenProofV1`, затем упаковывается в `OpenVerifyEnvelope` с бэкендом `Stark`. Верификация SCCP восстанавливает то же самое FastPQ пакет из набора и технического манифеста, проверяет метаданные открытого контейнера данных верификации и вызывает FastPQ проверяющий на восстановленном пакете и доказательстве.

## Наборы параметров {#parameter-sets}

Канонический каталог параметров раскрывает два набора параметров. Линия выполнения хост-пруфера в настоящее время использует `fastpq-lane-balanced`.

|Параметр|Цель|Поле|криптографические хэши| FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` |сбалансированная пропускная способность проверяющего|Золотоволосое квадратичное расширение|Криптографические значения обязательств Poseidon2, каталог SHA3 метка|арность 8, взрыв 8, 46 запросов|
| `fastpq-lane-latency`  |каналы выполнения, чувствительные к задержке|Золотоволосое квадратичное расширение|Криптографические значения обязательств Poseidon2, каталог SHA3 метка|арность 16, взрыв 16, 34 запроса|

Обе ориентированы на 128-битную безопасность и используют размер домена следа `2^16`. Код воспроизведения транскрипта Rust V1 в настоящее время получает байты вызова Fiat-Shamir с помощью `iroha_crypto::Hash::new`, а не напрямую вызывая SHA3-256.

Точные константы каталога, используемые доказывателем Rust, следующие:

|Постоянный| `fastpq-lane-balanced` | `fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
| `target_security`    |                    128 |                   128 |
| `grinding_bits`      |                     23 |                    21 |
| `trace_log_size`     |                     16 |                    16 |
|`trace_root`|   `0x002a247f81c6f850` |  `0x6a9f4eb38fb9b892` |
|`lde_log_size`|                     19 |                    20 |
| `lde_root`           |   `0x60263388dbbf9b2a` |  `0x9c9c3a571b6f89ac` |
| `permutation_size`   |                 65,536 |                65,536 |
| `lookup_log_size`    |                     19 |                    20 |
| `omega_coset`        |   `0x6af325e825ad5c18` |  `0x3a5fd4171e3c3a4d` |
| `fri_arity`          |                      8 |                    16 |
|`fri_blowup`|                      8 |                    16 |
| `fri_max_reductions` |                      8 |                     6 |
|`fri_queries`        |                     46 |                    34 |

## Конфигурация {#configuration}

FastPQ конфигурация находится внутри `zk.fastpq`.

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

Те же ярлыки выполнения и телеметрии могут быть переопределены из `iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Для конфигурационных полей также поддерживаются переменные окружения. Переменные, специфичные для FastPQ, включают:

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

## Метрики {#metrics}

Когда телеметрия включена, FastPQ экспортирует метрики для выбора бэкенда и поведения программного обеспечения Metal во время выполнения:

|Метрический|Значение|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Запрошенный и определённый режим исполнения по меткам бэкенда и устройства|
|`fastpq_poseidon_pipeline_total`|Запрошенный и разрешенный путь обработки рабочего процесса программного обеспечения Poseidon|
|`fastpq_metal_queue_depth`        |Предел очереди Metal, максимальное количество выполняемых операций, количество диспетчеризаций и окно выборки|
|`fastpq_metal_queue_ratio`        |Очередь Metal занята и коэффициенты перекрытия|
| `fastpq_zero_fill_duration_ms`    |Продолжительность нулевого заполнения хоста для запусков Metal|
| `fastpq_zero_fill_bandwidth_gbps` |Производная полоса пропускания с заполнением нулями|

Для общей диагностики производительности используйте их вместе с сигналами консенсуса и очереди, перечисленными в [Производительность и метрики](/ru/guide/advanced/metrics.md).

## Связанная ссылка {#related-reference}

- [Схема модели данных](/ru/reference/data-model-schema.md) для снимка данных типа с авторитетным узлом
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ опции](/ru/reference/iroha3d-cli.md#fastpq-overrides)
