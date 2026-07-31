---
translation_locale: ru
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ является Iroha Я ... STARK Проверка пути для выбранных эффектов исполнения.
не заменяет нормальное выполнение или консенсус транзакций.
пробежать ISI, IVM, и Sumeragi как обычно; FastPQ потребляет
Детерминистическое исполнение свидетельствует и превращает поддерживаемые эффекты в доказательства
партии.

В настоящее время интеграция хоста имеет три основных пути:

- прозрачные цифровые трансферты активов, зарегистрированные во время исполнения блоков
- Nexus проверенные релеи полосы, AXT на оболочке доказательства FastPQ
  обязательная
- SCCP прозрачные помощники для проверки сообщений, которые заворачивают FastPQ доказательство в
  объем открытой проверки

## Перевод пути свидетельства {#transfer-witness-path}

Прозрачные числовые переводы создают структурированную транскрипцию передачи, когда
Инструкция мутирует балансы.

- исходный счет, учетная запись назначения, определение активов и сумма
- балансы отправителя и получателя до и после передачи
- хэши транзакции входного пункта, используемого в качестве хэши партии
- справка о полномочиях, полученная из счета по представлению
- Дигес Poseidon для однодельтавых транскриптов

Перечисления партий используют один транскрипт с несколькими дельтами.
Однодельтавой пищеварения Посейдона отсутствует.

При завершении блока, Iroha группируйте эти транскрипты по хэши входным пунктом.
Свидетель исполнения затем несет как первоначальные переписки и
в соответствии с FastPQ переходные партии, подготовленные для проверки.

Каждая передача дельта становится двумя переходными строками:

| Рынок             | Форма ключа                                        | Предварительная стоимость               | После стоимости             |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
| Дебет отправителя    | `asset/<asset-definition>/<source-account>`      | баланс отправителя до   | баланс отправителя после   |
| Кредит получателя | `asset/<asset-definition>/<destination-account>` | баланс получателя до | баланс получателя после |

Цифровые значения нормализуются на целые свидетельские единицы.
отклоняется за FastPQ партийность, если она не может быть представлена как неотрицательная
`u64` в выбранной десятичной шкале.

## Государственные взносы {#public-inputs}

Каждый FastPQ переходная партия содержит публичные вводы, которые связывают доказательство с
контекст блокирования и исполнения:

| Ввод         | Значение                                                         |
| ------------- | --------------------------------------------------------------- |
| `dsid`        | Идентификатор пространства данных, кодируемый как байты с небольшим объёмом             |
| `slot`        | Время создания блоков, преобразованное в наносекунды                    |
| `old_root`    | Род родительского государства, полученный от свидетеля исполнения            |
| `new_root`    | Послегосударственный корень, полученный от свидетеля исполнения              |
| `perm_root`   | Приверженность Poseidon к разрешениям на активную роль                |
| `tx_set_hash` | Хаши над сортированной транзакцией и хэшами входящих пунктов времени-отправителя |

Хост использует `fastpq-lane-balanced` как канонический параметр, установленный для
эти партии.

## Математическая модель {#mathematical-model}

В этом разделе описывается арифметика, реализованная текущим Rust
Все полевые операции внизу над Золотыми Олочками.
первичное поле:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ использует Poseidon2 `F` Для выполнения полевых задач.
`t = 3`, ставка `r = 2`, и мощности `1`. Хеш поглощает элементы поля в
соотношение-2 блоки и добавляет один элемент поля `1` до финала
пермутация:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Байтные струны упакованы в 7-байтные маленькие эндианские конечности так что каждый член
строго ниже `p`:

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

Для хэши, которые начинаются с бита-доменных дигестов, FastPQ Карты первых восьми
небольшие байты в поле:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Вот так. `Hash` Средства Iroha Я ... `iroha_crypto::Hash::new`, 32-байтный Blake2bVar
пищеварение, если формула не называет Poseidon2 или SHA-256.

### Полевая арифметика {#field-arithmetic}

Сборник Rust код представляет элементы поля как канонические `u64` значения в
`[0,p)`. Добавление и удаление:

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

Затем Reduction Goldilocks использует идентичность:

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

Внедрение условно добавляет или вычитает `p` до тех пор, пока результат не
Подписанные целые числа, такие как баланс дельта, встроены:

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

FastPQ использует четыре полных раунда, пятьдесят семь частичных раундах, затем еще четыре
полный круг с круглой константой
`c_r = (c_{r,0}, c_{r,1}, c_{r,2})` является:

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

Все добавления и умножения `F`. Канонические MDS матрица:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Хэш поля начинается с нулевого состояния.
`(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

В заключительном блоке добавляется `1` элемент заполнения перед последним
Пермутация. `x_0`.

### Обязательность для публичных вводов {#public-input-binding}

Хост кодирует идентификатор пространства данных , записывая его `u64` стоимость в первую
8 небольших байтов 16-байтной поля:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Время создания блоков преобразуется из миллисекунд в наносекунды:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Хаш наряда транзакций - это хаш байт-домена над сортированным пунктом входа
хеш:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

где `h_i` - это сортированные хеш транзакции и временного триггера входных пунктов.
доказательство общественное IO, если `perm_root` или `tx_set_hash` - это все нуль,
Провер заполняет значения обратного возврата:

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

Для каждой дельты передачи целевая десятичная шкала является максимально отрезанной
масштаб по сумме и оба балансовых снимка:

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

А `Numeric` ценность с мантисса `m` и масштабы `q` принимается только тогда, когда
`m >= 0` и `q <= s`. Его FastPQ значение свидетеля:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Нормализованный результат должен соответствовать `u64`.

### Каноническое распоряжение {#canonical-ordering}

Перед строительством следов партия сортируется по переходному клавишу, эксплуатации
Ранг и индекс оригинальной вставки:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

Задача заказа - это хэширование поля Poseidon2 над доменом.
`fastpq:v1:ordering` и Norito кодирование сортированных переходов:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

где `P` является упаковкой 7 байтов, `E` является Norito кодирование, `D_o` является
`fastpq:v1:ordering`, и `T*` - это сортированный переход.

### Уравнения передачи {#transfer-equations}

Для суммы перевода `a`, баланс отправителя `f`, и баланс получателя `t`,
FastPQ подтверждает нормированные значения свидетелей перед созданием следа:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Переходные строки затем кодируют:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

Внутри следа, подписанные дельты сокращаются в `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

Факультативный диджет передачи единой дельты совершает кодируемую передачу
предварительный снимок:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Для транскриптов многодельта-передач текущий формат требует следующего:
Высочайший уровень пищеварения отсутствует.

Приемный орган для передачи транскриптов использует:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Ряд следов {#trace-rows}

Пусть сортированный переходный список содержит `n` длина следа
следующая мощность двух:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

Ряд `0..n-1` действуют; ряды `n..N-1` Каждый реальный ряд имеет
один набор селектора действия:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Все колонки выборщика - бульские:

$$
s(s-1)=0
$$

Ряд поиска разрешения - это точно ряд предоставления роли и отзыва роли:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Для рядов численных операций:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Строитель также отслеживает дельты на активы:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Только строки "Минт" и "Брэн" обновляют счетчик подачи:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Колонны метаданных и отслеживания пространства данных - это хэши поля , полученные до строки
материализация:

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

Хеш метаданных, хэш пространства данных и слот стабильны по соседним
ряды следов:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Передача столбцов Мерклей {#transfer-merkle-columns}

Переводные ряды имеют 32-уровневый редкий путь Меркла.
отсутствуя, проверка синтезирует детерминистический путь от клавиши строки,
предварительный баланс и то, является ли ряд стороной отправителя или получателя.

Для синтетических путей, соль вкуса `fastpq:smt:from` для рядов отправителей
и `fastpq:smt:to` для рядов приемника:

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

Синтетический лист и внутренние узлы:

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

Отслеживание записывает часть `b_l`, братья и сестры `s_l`, входный узел `x_l`, и
выходный узел `x_{l+1}` В соответствии с отраслевой конвенцией кода:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Разрешение {#permission-hashes}

Разделы предоставления и отмены роли расшифровывают свидетель разрешения:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Таблица разрешений хоста сортирует корневые записи по байтам роли, разрешениям
Байты и байты эпохи, затем построит дерево Посейдон2 Меркл:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Уровни нечетного ширины дублируют последний элемент.

### Обязанность отслеживать {#trace-commitment}

Для каждой колонки следов `c`, FastPQ Сначала интерполирует значения столбцов
домен следа и хеш вектор коэффициента:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

Корень следа - корень Посейдона2 Меркель над обязательствами столбцов:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Окончательный обязательство отслеживания - это байт хэш над доменом, параметром набор,
формы следов, переваривания столбцов и корни следов:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

где `D_c` является `fastpq:v1:trace_commitment`.

### AIR Состав {#air-composition}

Сборник V1 AIR значение состава - линейная комбинация местных остатков ряда.
В результате транскрипта выявлены две проблемы:

$$
\alpha_0,\alpha_1 \in F
$$

Для каждой соседней пары рядов `(i,i+1)`, Проверка вычисляет:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Остатки `rho` являются, в кодовом порядке:

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

И для стабильных бачек контекстных столбцов:

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

Проверщик пересчитывает `A_i` для пробных открытий рядов и проверки
по сравнению с стоимостью состава, обязавшейся в соответствии AIR Состав Меркл
корневой.

### Продукт поиска {#lookup-product}

Аккумулятор поиска разрешений использует задачу Fiat-Shamir `gamma`.
По сравнению с оценками низкой степени расширения `s_perm` и `perm_hash`, в соответствии с
текущий продукт:

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

Пусть `omega_T` быть генератором отслеживающих доменов, `omega_E` в соответствии с
генератор домена оценки, и `g` конфигурированный косет-оффсет.
колонка следов с значениями `v_i`, интерполяция дает коэффициенты `a_j`
такие, что:

$$
f(\omega_T^i)=v_i
$$

Увеличение низкой степени оценивает тот же полиномиал на косете:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

Внедрение вычисляет это умножением коэффициентов на полномочия
косетовый компенсатор до FFT:

$$
a'_j = a_j g^j
$$

и затем оценивать `a'` в области оценки.

Сборник CPU FFT Это итеративная трансформация радикс-2 Кули-Туки.
Битово-обратные входы. `L`, полудлина `H=L/2`, и этап
корень:

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

Напротив. FFT выполняет такую же трансформацию с `omega^{-1}` и весы,
размеры обратного домена:

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

### Шерсти и листья {#row-and-leaf-hashes}

После LDE, FastPQ hashes каждый ряд по всем LDE Колонны. `m` колонки:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Если хэши ряда все еще на домене следов , а не в оценке
Домен, проверка интерполирует и расширяет эту одну строку хаш-столку
с одинаковым косетом LDE процесс.

### Открытия в Меркеле {#merkle-openings}

LDE ценности группируются на куски:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Каждый кусок листья:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Родители Меркл:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Нередкие уровни дублируют последний узел. Пути запроса проверяются путем хэширования слева или
по паре индекса листа запроса на каждом уровне.

Для листа на индекс `i`, Путь `(s_0,\ldots,s_{d-1})` проверяет
корень `R` по повторению:

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

Сборник LDE Открытие запроса также проверяет, что значение открыто в индексе оценки
`i` присутствует в заверенной части:

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

FRI обязуется AIR Оценки состава. `l`, в соответствии с
Примеры переписки - это вызов `beta_l`. Слой заполнен на множественное
Каждая группа размером с арит складывается до:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

где `a` Это FRI Проверка проверяет, для каждого опрошенного запроса
цепь, которая:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

и удостоверяет каждый открытый FRI группы против соответствующих FRI слой
корневой.

### Транскрипция Fiat-Shamir {#fiat-shamir-transcript}

Канонический каталог параметров маркирует хэш транскрипта как SHA3-256.
В настоящее время внедрение проверки и верификации получает задание байтов с
`iroha_crypto::Hash::new`, который является 32-байтом Blake2bVar переварить, тогда
уменьшает первые восемь битов маленького эндия в `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Присоединяйте полный текст к записи.
порядок:

1. общественность IO, протокольная версия, параметрная версия и название параметра
2. LDE корень и следы
3. `gamma`
4. AIR проблемы с составом `alpha_0`, `alpha_1`
5. AIR корень следов и AIR корень состава
6. поиск грандиозный продукт
7. FRI корень слоев и `beta_l` Вопросы
8. индексы запросов, избранные в образе

Вопросная выборка продолжает рисовать 32-байтные диаграммы вызова и читать их как
Маленький эндиан `u64` кусочки до тех пор, пока он не получит запрашиваемый номер уникальных
индексы:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

Образцовый набор возвращается в сортированном порядке.

### Повторное воспроизведение верификатора {#verifier-replay}

Вначале проверяющий пересчитывает обязательство партии:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

и требует:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

Это также восстанавливает общественность IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Каждое поле должно соответствовать общественности доказательства IO Байт за байтом.
Затем воссоздает такую же транскрипцию и получает такую самую:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Для каждого запроса `q`, проверяет:

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

Сборник AIR открытие композиции должно быть удостоверено под `R_air_composition`.
Сборник FRI цепочка затем начинается с того же `A_q` и должны закончиться в
завершенная проверка FRI лист под терминалом FRI корневой.

## Что проверяет Притча {#what-the-prover-checks}

Прежде чем создать след, FastPQ Проверка канонизирует порядок партии
Переходный ключ, класс работы и порядок вставки.
требуют метаданных транскрипта. партия с строками передачи, но без передачи
Перепись недействительна.

Для переводных транскриптов проверки на стороне провизора включают:

- баланс отправителя не должен течь ниже
- `sender_after` должно равняться `sender_before - amount`
- `receiver_after` должно равняться `receiver_before + amount`
- Перепись должна охватывать каждый переводный ряд в партии.
- Digest Poseidon с одной дельтой, при наличии, должен соответствовать транскрипту
  преобразование
- при условии, что простые маркерные доказательства должны декодироваться как версия 1; отсутствующие пути:
  заполненные детерминистическими синтетическими доказательствами

Следы содержат колонки для перечисления, монет, сжигания, предоставления ролей.
отмена роли, набор метаданных и строки поиска разрешений.
ряды также несут подписанные дельты, работающие на дельты на активы и поставки
Счётчики.

## Проверка Лейна {#prover-lane}

`irohad` начинает FastPQ Провер ленты на запуск, если провер задний конец может
Путь является задачей в фоне с ограниченной очереди.
блок производит свидетеля исполнения, путь совершения представляет работу проверки
содержащие блок хэш, высоту, вид и свидетеля.

Если полоса не работает или очередь заполнена, работа пропускается и
Процесс обычной блокировки продолжается.
Это не прием транзакций или консенсусный портал.
путь по состоянию, который уже выполнен.

По проезжей части строят проверку с:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` позволяет провайдер выбирать доступный бэкэнд. `cpu` исполнение пин
к CPU. `gpu` предпочитает GPU исполнение, с CPU осадка, где
задней панель не может использовать запрашиваемые ядра.

## Проверка {#verification}

FastPQ проверка доказательств восстанавливает каноническое обязательство партии и
проверяет версию протокола,
версия набора параметров, ограничения повторного воспроизведения, обязательства по отслеживанию, публичные входы,
пробные отверстия Merkle, AIR отверстия, и FRI цепочка запросов.

По умолчанию ограничения повторного воспроизведения включают:

| Ограничение              | По умолчанию |
| ------------------ | ------: |
| Переходные строки    |     256 |
| Размер полезной нагрузки партии | 256 KiB |
| FRI слои         |      16 |
| Открытия запросов     |     128 |

## Nexus Проверенные реле {#nexus-verified-relays}

Nexus AXT доказательством конверты могут вставлять `AxtFastpqBinding`. Когда
`RegisterVerifiedLaneRelay` исполняет, Iroha:

1. проверяет обложку релевого полоса и FastPQ доказательный материал
2. проверяет пространство данных и корень манифестирования
3. декодирует AXT оболочка доказательств
4. требует `fastpq_binding`
5. восстанавливает FastPQ партия из этой связки
6. декодирует встроенный FastPQ доказательство
7. звонит FastPQ верификатор на перестроенной партии и доказательство

Если проверка будет успешной, Iroha хранит `VerifiedLaneRelayRecord`
содержит ссылку на реле, оригинальную конвертную версию, хэш-направление на полезную нагрузку;
высота проверки, корень проявления и FastPQ обязательная.

Закладки для эстафеты также несут компактные FastPQ Материал доказательства.
является перечислением ID полосы, ID пространства данных, высоты блоков, проверка
Высота, хэш заголовка блоков, хэш урегулирования и корень манифеста.
объединение допустимо только в том случае, если оно имеет QC и действительны FastPQ доказательство
материалы.

### AXT Обязательная математика {#axt-binding-math}

Для Nexus AXT конверты, `AxtFastpqBinding` является канонизированным до доказательства
По умолчанию пустые значения параметров `fastpq-lane-balanced`; пустые
идентификатор верификатора и версия по умолчанию `fastpq` и `v1`; тип заявления подрезан
и низким.

Сборник AXT FastPQ публичные вводы - это определённые байт-хаши:

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

AXT переходные ключи:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

Сборник `authorization` заявка вставляет строку с предоставлением роли:

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

и строка метаданных, обязывающая политику выдачи разрешений. `compliance` претензии
вставляет две строки метаданных: одну для политики и другую для целевых данных.

Для `tx_predicate` и `value_conservation`, объем явного эффекта
используется, если связь содержит положительную сумму источника или назначения.
В противном случае код получает ограниченную детерминистическую величину:

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

Синтетические идентификаторы счетов отправителя и получателя генерируются из ключевых семян:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Хеш передаточной партии:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

Сборник AXT ассортимент манифестации: SHA-256 на Norito кодирование
каноническая связь:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Прозрачные доказательства сообщения {#sccp-transparent-message-proofs}

Сборник SCCP помощник ящик также используется FastPQ для прозрачного сообщения с перекрестной цепью
Этот путь отделен от `irohad` С другой стороны.
создает FastPQ партия непосредственно из SCCP пакеты подтверждения сообщений и
Manifest, затем завязывает полученное доказательство для открытой проверки.

Сборник SCCP использование партий `fastpq-lane-balanced` и три перехода метаданных:

| Ключ                             | Операция |
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

Его общественные входы получены из SCCP прозрачная внутренняя доказательство:

| FastPQ вход  | SCCP источник                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        | Первые 16 байтов переваривания Blake2b над заявлением хэш |
| `slot`        | Высота окончания                                            |
| `old_root`    | Нагрузка                                               |
| `new_root`    | Корень обязательства                                            |
| `perm_root`   | Хеш-блок окончательности                                        |
| `tx_set_hash` | Хеш заявления                                             |

Сборник SCCP канонические кодировки пишут целые числа мало-андиан и кодируют
массивы байтов переменной длины, такие как:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Прозрачная публичная входная байтная строка:

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

Прозрачные байты заявления - это конкаценации версии, цепочки
семейные, локальные и контрагентские домены, модель безопасности, управление якорем;
кодек учетной записи, модель окончательности, целевая цель проверщика, семейство бэкэнда проверщика;
поля цепочки/заднего конца/проявления с длиной, хэш-связью на место назначения;
Ключ к кодеку учетной записи, тип полезной нагрузки, публичные байты ввода и хэш полезной.
hash изложения:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

Сборник FastPQ ИД пространства данных для этого пути доказательства - это первые шестнадцать байтов
еще один префиксный перевод Blake2b:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

Сборник SCCP FastPQ партия точно:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

затем сортируются по тому же FastPQ Правило распоряжения.

Сборник OpenVerify обязательства проверщика SHA-256 на SCCP обратный конец сообщения
название и канонический FastPQ описатель верификатора:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Необработанные FastPQ доказательство Norito-кодировано в `StarkFriOpenProofV1`, Тогда
обернутые в `OpenVerifyEnvelope` с обратным конфиденциальностью `Stark`. SCCP проверка
восстанавливает то же самое FastPQ партию из пакета и манифеста, проверяет
открытые метаданные проверки конверта, и называют FastPQ проверяющий на
Перестроенная партия и доказательства.

## Параметровые наборы {#parameter-sets}

Канонический каталог параметров раскрывает два набора параметров.
prover lane в настоящее время используется `fastpq-lane-balanced`.

| Параметр              | Цель                    | Поле                          | Хешы                                      | FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` | сбалансированная пропускная способность | Золотолосы квадратное расширение | Обязательства по Посейдону2, каталог SHA3 маркировка | Вопрос 8, взрыв 8, 46   |
| `fastpq-lane-latency`  | трассы, чувствительные к задержке    | Золотолосы квадратное расширение | Обязательства по Посейдону2, каталог SHA3 маркировка | Аритет 16, взрыв 16, 34 запроса |

Оба целенаправлены на 128-битную безопасность и используют размер домена следа `2^16`. Сборник
Rust V1 Код воспроизведения транскрипта в настоящее время вытекает из Fiat-Shamir вызов
байты с `iroha_crypto::Hash::new` Вместо того, чтобы напрямую призывать
SHA3-256.

Точные константы каталога, используемые Rust Проверка:

| Постоянно             | `fastpq-lane-balanced` | `fastpq-lane-latency` |
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

## Конфигурация {#configuration}

FastPQ конфигурация заложена под `zk.fastpq`.

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

Те же этикетки выполнения и телеметрии могут быть отменены из `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

Различия окружающей среды также поддерживаются для полей конфигурации.
FastPQ-специфические переменные включают:

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

## Учетные показатели {#metrics}

Когда телеметрия включена, FastPQ экспортные показатели для отбора бэкэнда и
Металловое поведение на время выполнения:

| Метрика                            | Значение                                                                     |
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     | Запрошенный и разрешенный режим исполнения по бакетам и ярлыкам устройств          |
| `fastpq_poseidon_pipeline_total`  | Запрошенный и разрешенный маршрут трубопровода "Посейдон"                               |
| `fastpq_metal_queue_depth`        | Металловой лимит очереди, максимальное количество в полете, количество отправки и окно отбора образцов |
| `fastpq_metal_queue_ratio`        | Металлическая очередь занятость и соотношения перекрытия                                         |
| `fastpq_zero_fill_duration_ms`    | Продолжительность загрузки для металлических путей                                      |
| `fastpq_zero_fill_bandwidth_gbps` | Произведенная полоса пропускания с нулевым заполнением                                                 |

Для общего отбора производительности используйте их с консенсусом и очередью
сигналы, указанные в [Высокопроизводительность и показатели](/ru/guide/advanced/metrics.md).

## Соответствующая ссылка {#related-reference}

- [Схема модели данных](/ru/reference/data-model-schema.md) для генерируемого типа
  подробности
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ варианты](/ru/reference/irohad-cli.md#arg-fastpq-execution-mode)
