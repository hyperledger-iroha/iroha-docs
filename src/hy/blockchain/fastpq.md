---
translation_locale: hy
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ-ը Iroha-ի կողմից ընտրված կատարման ազդեցությունների համար STARK ապացուցող ուղին է: Այն չի փոխարինում գործարքի սովորական կատարումը կամ համաձայնությունը: Գործարքները դեռ շարունակվում են ISI, IVM, եւ Sumeragi-ով, ինչպես միշտ; FastPQ սպառում է դետերմինիստական կատարման վկան եւ վերածում աջակցվող ազդեցությունները ապացույցների խմբերի:

Ներկայիս հյուրընկալող ինտեգրումը ունի երեք հիմնական ուղիներ.

- բլոկի կատարման ընթացքում գրանցված թվային ակտիվների թափանցիկ փոխանցումները
- Nexus ստուգված երթուղային ռեալեր, որոնց AXT ապացուցման փաթեթը պարունակում է FastPQ կապում
- SCCP թափանցիկ հաղորդագրության ապացույցի օգնականներ, որոնք փակում են FastPQ ապացույցը բաց ստուգման փաթեթի մեջ

## Վկաների երթուղին փոխանցելը {#transfer-witness-path}

Թվային փոխանցումները ստեղծում են կառուցվածքային փոխանցման տրանսկրիպտ, երբ հրահանգը փոխակերպում է հավասարակշռությունները:

- աղբյուրի հաշվին, նպատակային հաշվին, ակտիվների սահմանմանը եւ գումարը
- ուղարկողի եւ ստացողի հավասարակշռությունը փոխանցումից առաջ եւ հետո
- գործարքի մուտքային կետի hash-ը, որը օգտագործվում է որպես խմբաքանակի hash
- ներկայացնող հաշվետվությունից ստացված իշխանության ցուցակը
- Պոզեյդոնի դիժեսը մեկ դելտային տրանսկրիպտի համար

Բաժանային փոխանցումներում օգտագործվում է մի քանի դելտա պարունակող տեքստ, այդ դեպքում բացակայում է մեկ դելտայի Պոզեյդոնի թեստը:

Բլոկի վերջնականացման ժամանակ Iroha խմբավորում է այս տրանսկրիպտերը մուտքային կետի хэշի համաձայն: Գործադրման վկանը ապա տեղափոխում է ինչպես սկզբնական տրանսկրիտների փաթեթները, այնպես էլ FastPQ անցումային խմբաքանակները, որոնք պատրաստված են պրոֆերի համար:

Յուրաքանչյուր տրանսֆերային դելտա դառնում է երկու անցումային շարքեր.

|Սարք |Գլխավոր ձեւ |Նախագծային արժեք|Հետագա արժեք |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Հեռորդի դեբետ |`asset/<asset-definition>/<source-account>` |նախորդ ուղարկողի հավասարակշռությունը |ուղարկողի հավասարակշռությունը |
|Գնորդի վարկը|`asset/<asset-definition>/<destination-account>` |ստացողի հաշվեկշիռը նախ |ստացողի հաշվեկշիռը |

Թվային արժեքները նորմալացվում են ամբողջական թվերի վկայական միավորներով: FastPQ խմբավորման համար մի արժեք մերժվում է, եթե այն չի կարող ներկայացվել որպես ոչ բացասական `u64` ընտրված տասնամյակային մասշտաբում:

## Հանրային ներդրումներ {#public-inputs}

Յուրաքանչյուր FastPQ անցումային խմբաքանակ ունի հանրային մուտքագրություններ, որոնք ապացույցը կապում են բլոկի եւ կատարման համատեքստին.

|Ներմուծում |Նշում |
| ------------- | --------------------------------------------------------------- |
|`dsid` |Տվյալների տիրույթի նույնականացողը կոդավորվում է որպես փոքր բայթներ |
|`slot` |Բլոկի ստեղծման ժամանակը վերածվել է նանոսեկունդ: |
|`old_root` |Ծնողական պետության արմատը ստացվել է մահապատժի վկանից |
|`new_root` |Poststate արմատը ստացվել է մահապատժի վկանից |
|`perm_root` |Պոզեյդոնի պարտավորությունը ակտիվ դերային թույլտվությունների նկատմամբ |
|`tx_set_hash` |Հաշիվը վերապատրաստված գործարքի եւ ժամանակային դրդող մուտքային կետի հաշիվները |

Հյուրընկալողը օգտագործում է `fastpq-lane-balanced` որպես այդ խմբերի համար սահմանված կանոնիկական պարամետր:

## Մաթեմատիկական մոդել {#mathematical-model}

Այս բաժինը նկարագրում է ընթացիկ Rust ստուգիչի եւ հաստատողի կողմից իրականացվող հաշվետվությունը: Ստորեւ ներկայացված բոլոր դաշտային գործողությունները կատարվում են Goldilocks- ի առաջնային դաշտից:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ Օգտագործում է Poseidon2 `F` դաշտի պարտավորությունների համար: Սպոնջը լայն է `t = 3`, տոկոսադրույք `r = 2`, եւ հզորություն `1`. Hash- ը ներբեռնում է դաշտի տարրերը rate-2 բլոկներում եւ մի քանի դաշտային տարրեր ավելացնում `1` նախքան վերջնական փոխարկումը.

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Բայթային շղթաները փաթեթավորվում են 7 բայտանոց փոքր-ինչի վերջույթների մեջ, այնպես որ յուրաքանչյուր վերջույթ խիստ ցածր է `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Դոմեյնային առանձնացված դաշտերի շիշերը ներկայացվում են հետեւյալ կերպ.

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

FastPQ բայթ-դոմեյնային դիժեստներից սկսած շիշերի համար քարտեզավորում է առաջին ութ փոքր բայտները դաշտում.

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Այստեղ `Hash` նշանակում է Iroha-ի `iroha_crypto::Hash::new` 32-բայթ Blake2bVar դիժեսը, եթե բանաձեւում բացարձակ անվանում չկա Poseidon2 կամ SHA-256:

### Դաշտի հաշվետվություն {#field-arithmetic}

Rust կոդը ներկայացնում է դաշտի տարրերը որպես կանոնիկ `u64` արժեքներ `[0,p)` մեջ:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

բազմապատկումը առաջին հերթին հաշվարկում է 128-բիթային արտադրանքը.

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Goldilocks կրճատման ապա օգտագործում է նույնականությունը:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Եթե:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

ապա կրճատիչը հաշվարկում է.

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

Իրագործումը պայմանական կերպով ավելացնում կամ հանում է `p` մինչեւ արդյունքը կանոնիկ լինի: ստորագրված ամբողջ թվերը, ինչպիսիք են հավասարակշռման դելտանները, ներմուծվում են հետեւյալ կերպ.

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Պոզեյդոն 2 Փերմուտացիա {#poseidon2-permutation}

Պոզեյդոն 2 փոխարկման վիճակը հետեւյալն է.

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Նրա S-կապիկը հետեւյալն է.

$$
S(x)=x^5
$$

FastPQ-ում օգտագործվում է չորս ամբողջական փուլ, քսանհինգ յոթ մասնակի փուլ, ապա եւս չորս լիակատար փուլ: Ամբողջական փուլ ՝ պարագային կայուններով `c_r = (c_{r,0}, c_{r,1}, c_{r,2})`:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

Կիսական փուլը հետեւյալն է.

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Բոլոր ավելացումները եւ բազմապատկությունները `F` են: Քանոնիկ MDS մատրիքը հետեւյալն է.

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Field hash- ը սկսվում է զրոյական վիճակից: Յուրաքանչյուր ամբողջական rate-2 բլոկի համար `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

Վերջնական բլոկը հավելում է `1` պարունակող տարրը նախքան վերջին փոփոխությունը: Արտադրանքը `x_0` է:

### Հասարակական մուտքի պարտավորություն {#public-input-binding}

Հյուրընկալողը կոդավորում է տվյալների տարածքի ID- ն ՝ գրելով դրա `u64` արժեքը 16-բայթային դաշտի առաջին ութ փոքր-հասարակական բայտներում.

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Բլոկի ստեղծման ժամանակը փոխակերպվում է միլիսեկունդից նանոսեկունդներ:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Transaction-set hash-ը բայթային տիրույթի hash-ն է սորտիացված մուտքի կետի hash-ների վրա.

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

որտեղ `h_i` դասակարգված են գործարքի եւ ժամանակի սանձազերծման մուտքային կետերի շիշերը: Պրոֆեսիոնալ հանրության մեջ IO, եթե `perm_root` կամ `tx_set_hash` բոլորն էլ զրոյական են, պրովը լրացնում է հետընթաց արժեքները.

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

### Թվային նորմալացումը {#numeric-normalization}

Յուրաքանչյուր փոխանցման դելտայի համար նպատակային տասնամյակի մասշտաբը չափի եւ երկու հավասարակշռման ակնթարթների առավելագույն կտրված մասշտաբն է.

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

Ա `Numeric` արժեքը mantissa- ի հետ `m` եւ մասշտաբ `q` ընդունվում է միայն, երբ `m >= 0` եւ `q <= s`. Իրենց FastPQ վկա արժեքը հետեւյալն է.

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Նորմալացված արդյունքը պետք է համապատասխանի `u64`:

### Քանոնիկական կարգադրություն {#canonical-ordering}

Հետեւանքների շինարարությունից առաջ, խմբաքանակը դասակարգվում է անցումային բանալիների, գործողությունների կարգի եւ սկզբնական ներմուծման ինդեքսով.

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

Հրամանագրման պարտավորությունը Poseidon2- ի դաշտի հաշինգն է `fastpq:v1:ordering` տիրույթի եւ կարգավորված անցումների Norito կոդավորման վրա:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

որտեղ `P` 7-բայթային փաթեթավորում է, `E` է Norito կոդավորում, `D_o` է `fastpq:v1:ordering`, եւ `T*` է սորտաժված անցումային ցուցակը:

### Տրանսֆերային հավասարությունները {#transfer-equations}

Տրանսֆերային գումարի համար `a`, ուղարկողի հավասարակշռության համար `f` եւ ստացողի հավասարում `t`, FastPQ հավաստիացնում է վկաների նորմալացված արժեքները նախքան հետագա կառուցումը.

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Դրանից հետո անցումային շարքերը կոդավորում են.

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

Դիտարկման մեջ ստորագրված դելտաները կրճատվում են `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

Ընտրական միավոր դելտա փոխանցման դիջեսը պարտավորեցնում է կոդավորված փոխանցման նախանկարը.

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Բազմդելտային փոխանցման տրանսկրիպտների համար ներկայիս ձեւաչափը պահանջում է, որ այս բարձր մակարդակի պարունակությունը բացակայում լինի:

Հյուրընկալող իշխանությունը փոխանցման տրանսկրիպտերի համար ներմուծում է հետեւյալը.

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Հետեւանքների շարքեր {#trace-rows}

Թող դասակարգված անցումային ցուցակը պարունակում է `n` իրական շարքեր: Հետագա երկարությունը հաջորդ ուժը երկու:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

`0..n-1` տողերը ակտիվ են, `n..N-1` տողերը լցոնային տողեր են: Յուրաքանչյուր իրական տող ունի մեկ գործողության ընտրիչի հավաքածու.

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Բոլոր ընտրիչ սյունակները բուլյան են.

$$
s(s-1)=0
$$

Թույլտվության որոնման շարքերը ճիշտ են դերի տրամադրման եւ դերի չեղարկման շարքեր.

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Թվային գործողությունների շարքերի համար'

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Շինարարը նաեւ հետեւում է ակտիվի հաշվով իրականացվող դելտաների:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Միայն մինետի եւ այրման շարքերը թարմացնում են մատակարարման հաշվիչը.

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Մետադատա եւ տվյալների տարածքի հետույքային սյունակները գծի նյութափոխանակությունից առաջ ստացված դաշտի շիշներ են.

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

Մետադատա-հիշերը, տվյալների տարածքի հիշերը եւ սլոտները կայուն են հարեւան հետքուղիների վրա.

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Տեղափոխել Merkle սյունակները {#transfer-merkle-columns}

Փոխանցման տողերը կրում են 32 մակարդակի պակաս Merkle ուղին: Եթե բացակայում է հյուրընկալող ապացույցը, prover- ը համադրում է որոշիչ ուղին տողերի բանալից, նախնական հավասարակշռությունից եւ թե արդյոք տողը ուղարկողի կամ ստացողի կողմն է:

Սինթետիկ ուղիների համար ճաշակային աղը `fastpq:smt:from` է ուղարկող շարքերի համար եւ `fastpq:smt:to`՝ ստացողի շարքերի համար:

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

Սինթետիկ թղթի եւ ներքին հանգույցները հետեւյալն են.

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

Հետեւանքը արձանագրում է բիթը `b_l`, եղբայրը `s_l`, մուտքային հանգույցը `x_l` եւ ելքային հանգուցանը `x_{l+1}` յուրաքանչյուր մակարդակի վրա: Կոդի մասնաճյուղի կոնվենցիայի միջոցով.

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Թույլտվության շիշեր {#permission-hashes}

Դասերի տրամադրել եւ վերացնել շարքերը hash թույլտվության վկան:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Հյուրընկալող թույլտվությունների աղյուսակի արմատը դասակարգում է մուտքերը ըստ դերային բայթների, թույլտվության բայտների եւ ժամանակաշրջանի բայտերի, ապա կառուցում Poseidon2 Merkle ծառ:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Զարմանալի լայնության մակարդակները կրկնապատկում են վերջնական տարրը:

### Հանձնառությունը հետեւել {#trace-commitment}

Յուրաքանչյուր տողերի համար `c`, FastPQ առաջին հերթին ինտերպոլում է տողերի արժեքները տողային դոմենի վրա եւ hashes կոֆիենցիոն վեկտորը:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

Աղբյուրի արմատը Poseidon2 Merkle արմատն է տողերի պարտավորությունների վրա.

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Վերջին հանձնառությունը տիրույթի, պարամետրերի հավաքածուի վրա բայթային хэշ է, տիրույթի ձեւը, գնդակի դիժեստը եւ տիրույթի արմատը.

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

որտեղ `D_c` կազմում է `fastpq:v1:trace_commitment`.

### AIR կազմը {#air-composition}

V1 AIR բաղադրության արժեքը շարքի տեղական մնացորդների գծային համադրություն է: Transcript նմուշները ներառում են երկու մարտահրավերներ.

$$
\alpha_0,\alpha_1 \in F
$$

Յուրաքանչյուր հարակից զույգ տողերի համար `(i,i+1)` ստուգիչը հաշվարկում է՝

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

մնացորդները `rho`, կոդային կարգով, հետեւյալն են.

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

Թվային սյունակներով շարքերի համար'

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

եւ կայուն խմբաքանակի համատեքստային գծերի համար.

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

Վավերացնողը վերաշվարկում է `A_i` նմուշագրված շարքի բացությունների համար եւ այն ստուգում AIR կազմի Merkle արմատով պարտավորվող բաղադրիչային արժեքի հետ:

### Հետազոտական արտադրանքը {#lookup-product}

Թույլտվության որոնման կուտակիչը օգտագործում է Fiat-Shamir մարտահրավերը `gamma` ։ `s_perm` եւ `perm_hash` ցածր աստիճանի ընդլայնման գնահատումներում, գործնական արտադրանքը հետեւյալն է.

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

Պատվաստանյութերը:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### ցածր աստիճանի ընդլայնում {#low-degree-extension}

Թող `omega_T` լինի հետեւողական տիրույթի գեներատորը, `omega_E` ՝ գնահատականի տիրույթի Գեներատորը եւ `g` ՝ կոնֆigurված կոսեթային փոխհատուցումը: Որպես արժեքներ ունեցող հետեւողական սյունակի համար `v_i`, ինտերպոլացիան արտադրում է koeffensive `a_j` այնպիսի, որ

$$
f(\omega_T^i)=v_i
$$

ցածր աստիճանի ընդլայնումը գնահատում է նույն բազմաբնույթը կոսետի վրա.

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

Կազմակերպումը հաշվարկում է այն՝ բազմապատկելով կոֆեսիոնալ գործակիցները մինչեւ FFT:

$$
a'_j = a_j g^j
$$

եւ այնուհետեւ գնահատում `a'` գնահատման դոմենի վրա:

CPU FFT-ը կրկնվող արմատ-2 Կուլի-Թուքեյի փոխակերպում է բիթ-վերադարձ մուտքերի վրա: Դարաշրջանի երկարությամբ `L`, կես երկարությամբ `H=L/2` եւ փուլային արմատով.

$$
\omega_L=\omega^{N/L}
$$

յուրաքանչյուր թիթեռը հաշվարկում է.

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

FFT հակադարձը կատարում է նույն փոխակերպումը, ինչպես `omega^{-1}` եւ չափվում է հակառակ դոմենի չափով.

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Կատալոգի արմատները նախքան օգտագործումը հաստատվում են.

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Catalogue root-ից ստացված ավելի փոքր տիրույթների համար գեներատորը հետեւյալն է.

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Գծերի եւ տերեւների շիշներ {#row-and-leaf-hashes}

Հետո LDE, FastPQ hashes յուրաքանչյուր շարքը ամբողջությամբ LDE սյունակները: `m` սյունակներ.

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Եթե շարքի հաշեները դեռեւս գտնվում են գնահատման դոմենի փոխարեն հետագա տիրույթում, prover- ը ինտերպոլատացնում եւ ընդլայնում է այդ մեկ գիծային-հաշե սյունակը նույն coset LDE գործընթացով:

### Merkle- ի բացումները {#merkle-openings}

LDE արժեքները խմբավորվում են հետեւյալ մասերի:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Յուրաքանչյուր կտոր տերեւը հետեւյալն է.

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Մերքլի ծնողները հետեւյալն են.

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Տարբեր մակարդակները կրկնապատկում են վերջին հանգույցը: Հարցման ուղիները ստուգվում են ձախ կամ աջ հաշինգով ըստ հարցման էջի ինդեքսային հավասարության յուրաքանչյուր մակարդակի վրա:

Աղբյուրի համար' ինդեքսով `i`, ուղի `(s_0,\ldots,s_{d-1})` ստուգում է արմատի դեմ `R` կրկնվողության դեպքում'

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

Չեկը անցնում է միայն այն դեպքում, երբ.

$$
y_d=R
$$

AIR հետքերով շարքի տերեւները հետեւյալն են.

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR կազմի տերեւները հետեւյալն են.

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE հարցման բացումը նաեւ ստուգում է, որ գնահատման ինդեքսում բացված արժեքը `i` գտնվում է իր հավաստագրված մասում.

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Հավաքում {#fri-folding}

FRI-ը պարտավորվում է կատարել AIR կազմի գնահատականներ: Յուրաքանչյուր փուլ `l` -ի համար տրանսկրիպտային նմուշները մարտահրավեր են վերցնում `beta_l`։ Լայնը լցվում է հորիզոնականի բազմապատիկի վրա՝ կրկնելով վերջին արժեքը։ Յուրաքանչյուր հորիզոնի չափով խումբ բարդում է հետեւյալ կերպ.

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

որտեղ `a`-ը կազմում է FRI բազան: Փաստաբանն ստուգում է, որ յուրաքանչյուր նմուշագրված հարցման շղթայի համար,

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

եւ հավատարմագրում է յուրաքանչյուր բացված FRI խմբի համար համապատասխան FRI շերտային արմատը:

### Fiat-Shamir տրանսկրիպտ {#fiat-shamir-transcript}

Քանոնիկ պարամետրերի կատալոգը վերագրման хэշը նշում է որպես SHA3-256. Ներկայիս պրովեր եւ ստուգիչի իրականացումը բխում է մարտահրավերային բայտներից ՝ `iroha_crypto::Hash::new`, որը 32-բայթ Blake2bVar դիժեսն է, այնուհետեւ նվազեցնում է առաջին ութ փոքր-հանդիսական բայտները `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Հարձակման զանգերը հավելում են ամբողջական պարունակությունը վերագրերի վիճակում: Վերադարձի կարգն է.

1. հանրային IO, արձանագրության տարբերակ, պարամետրերի տարբերակ եւ պարամետրի անվանում
2. LDE արմատը եւ հետագա արմատները
3. `gamma`
4. AIR կազմի մարտահրավերները `alpha_0`, `alpha_1`
5. AIR հետագա արմատը եւ AIR կազմի արմատն
6. searchup մեծ արտադրանքը
7. FRI շերտերի արմատների եւ `beta_l` մարտահրավերների
8. նմուշագրված հարցման ցուցանիշները

Հարցազրույցի նմուշագրությունը շարունակում է նկարել 32-բայթանոց մարտահրավերային դիջետներ եւ կարդալ դրանք որպես փոքր-ինչ `u64` կտորներ, մինչեւ այն ունենա պահանջված յուրահատուկ ինդեքսների թիվը.

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

Նմուշների հավաքածուն վերադարձվում է կարգավորված կարգով:

### Վավերացողի կրկնօրինակում {#verifier-replay}

Վավերացնողը նախ վերաշվարկում է խմբաքանակի պարտավորությունը.

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

եւ պահանջում է:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

Այն նաեւ վերակառուցում է հանրային IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Յուրաքանչյուր դաշտ պետք է համապատասխանի ապացույցի հանրային IO բայտ-բայթին: Այնուհետեւ ստուգիչը վերակառուցում է նույն տրանսկրիպտը եւ ստանում է նույնը.

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Յուրաքանչյուր ցուցադրված հարցման համար `q`, այն ստուգում է՝

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

եւ

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

AIR կազմի բացումը պետք է ստուգվի `R_air_composition` ներքո: Այնուհետեւ FRI շղթան սկսվում է նույն `A_q` եւ պետք է ավարտվի վերջնական հաստատված FRI թերթով, որը գտնվում է տերմինալ FRI արմատի տակ:

## Այն, ինչ ստուգում է առակ {#what-the-prover-checks}

Նախքան հետագա կառուցումը, FastPQ պրովերը կանոնիկացնում է խմբաքանակի կարգը անցումային բանալինով, գործողության դասակարգմամբ եւ տեղադրման կարգով: Տրանսֆերային տողերը նույնպես պահանջում են վերագրված մետադատա: Տարածված խմբաքանակը, որն ունի փոխանցման տողեր, բայց ոչ մի փոխանցման վերագրություն անվավեր է:

Տրանսֆերային արձանագրությունների համար ստուգումները ներառում են՝

- ուղարկողի հավասարակշռությունը չպետք է նվազի
- `sender_after` պետք է հավասար լինի `sender_before - amount`
- `receiver_after` պետք է հավասար լինի `receiver_before + amount`
- վերագրը պետք է ընդգրկի խմբաքանակում գտնվող յուրաքանչյուր փոխանցման տող
- Պոզեյդոնի մեկ դելտա պարունակող դիժեսը, երբ ներկա է, պետք է համապատասխանի տրանսկրիպտի նախանկարի պատկերին
- provided sparse-Merkle proofs must decode as version 1; missing paths are filled with deterministic synthetic proofs (հետաքրքիր է, որ պակասող ուղիները լցված են դետերմինիստիկ սինթետիկ ապացույցներով)

Հետեւանքը պարունակում է ընտրող սյունակներ փոխանցման, մինետի, այրման, դերի տրամադրման, դերակատարության հետաձգման, մետադատա հավաքածու եւ թույլտվությունների որոնման շարքերի համար: Թվային գործառույթների շարքերը նաեւ կրում են ստորագրված դելտաներ, գործում են յուրաքանչյուր ակտիվի դելթաններ եւ մատակարարման հաշվիչներ:

## Պրոբեր Լեյն {#prover-lane}

`irohad` սկսում է FastPQ պրովեր լեյնը մեկնարկելիս, եթե պրովերի հետագա վերջը կարող է նախաձեռնվել: Լեյնը ֆոնային խնդիր է սահմանված հերթով: Երբ բլոկը արտադրում է կատարման վկան, commit ուղին ներկայացնում է պրովոր աշխատանք, որը պարունակում է բլոկի շիշը, բարձրությունը, տեսքը եւ վկանը:

Եթե երթուղին չի աշխատում կամ հերթը լցված է, աշխատանքը բաց է թողնում եւ բլոկի սովորական մշակումը շարունակվում է: Սա նշանակում է, որ ֆոնային պրովեր երթուղինը գործարքի ընդունման կամ համաձայնության դարպաս չէ: Այն ապացուցող արտադրության ուղին է պետության վրա, որը արդեն կատարվել է:

Դարպասը կառուցում է պրովեր, որն ունի

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` թույլ է տալիս ստուգողին ընտրել մատչելի հետագա վերջը: `cpu` pins կատարման է CPU. `gpu` նախընտրում է GPU կատարում, CPU fallback, երբ backend- ը չի կարող օգտագործել պահանջված միջուկները:

## Փորձարկում {#verification}

FastPQ ապացույցի ստուգումը վերակառուցում է քանոնիկ խմբաքանակի պարտավորությունը եւ փոխարինում է հանրային տրանսկրիպտը: Վավերացնողը ստուգում է արձանագրության տարբերակը, պարամետրերի սահմանված տարբերակը, կրկնօրինակման սահմանափակումները, հետեւողական պարտավորությունները, հանրային մուտքերը, նմուշավորված Merkle բացումները, AIR բացումները եւ FRI հարցման շղթան:

Նախադրյալ կրկնօրինակման սահմանները ներառում են.

|Սահմանափակ |Նախադրյալ |
| ------------------ | ------: |
|անցումային շարքեր |     256 |
|Բարշային բեռի չափը |256 KiB |
|FRI շերտեր |      16 |
|Հարցազրույցներ |     128 |

## Nexus Փորձարկված ռեալեր {#nexus-verified-relays}

Nexus AXT ապացույցի փաթեթները կարող են ներմուծել `AxtFastpqBinding`։ Երբ `RegisterVerifiedLaneRelay` կատարում է, Iroha:

1. ստուգում է երթուղի ռելեյի փաթեթը եւ FastPQ ապացույցային նյութը:
2. ստուգում է տվյալների տարածքը եւ manifest root- ը
3. վերագրում է AXT ապացույցի փաթեթը:
4. պահանջում է `fastpq_binding`
5. վերակառուցում է FastPQ խմբաքանակը այդ կապից
6. կոդավորում է ներմուծված FastPQ ապացույցը:
7. զանգահարում է FastPQ ստուգողին վերակառուցված խմբաքանակի եւ ապացույցների վերաբերյալ

Եթե ստուգումը հաջողվում է, Iroha-ը պահում է `VerifiedLaneRelayRecord`, որը պարունակում է ռելեյի հղումը, օրիգինալ փաթեթը, ապացուցման օգտակար բեռնվածության хэշը, ստուգման բարձրությունը, manifest root-ը եւ FastPQ կոճակը։

Փողոցային ռելեյի փաթեթները նաեւ համապարփակ են FastPQ ապացուցման նյութը: Մատेरियलն անցնում է երթուղի ID, տվյալների տարածքի ID, բլոկ բարձրությունը, ստուգման բարձրությունը, բլոք գլխավորության hash, Settlement hash, եւ manifest root. Relay միավորումը թույլատրելի է միայն այն դեպքում, երբ այն ունի երկու QC եւ վավեր FastPQ ապացույցի նյութ:

### AXT Մաթեմատիկա {#axt-binding-math}

Nexus AXT փաթեթների համար, `AxtFastpqBinding`-ը կանոնիկացվում է ապացույցի կրկնումից առաջ: Հեռու պարամետրերի արժեքները նախընտրում են `fastpq-lane-balanced`; դատարկ ստուգիչի ID եւ տարբերակի նախընտրման համար `fastpq` եւ `v1`; պահանջի տիպը կտրված է եւ ցածր դասակարգված:

AXT FastPQ հանրային մուտքերը դետերմինիստիկ բայթային շիշներ են.

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

AXT անցումային բանալիները'

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` պահանջի մեջ տեղադրվում է դերակատարման համար նախատեսված տող.

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

`compliance` պահանջը ներառում է երկու մետադատա շարքեր. մեկը քաղաքականության եւ մեկը՝ նպատակային տվյալների տարածքների համար:

`tx_predicate` եւ `value_conservation` համար օգտագործվում է բացարձակ ազդեցության ծավալ, երբ կապը պարունակում է դրական աղբյուրի կամ նպատակային ծավալ: Այլ դեպքում կոդը բխում է սահմանված որոշման քանակից.

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Այնուհետեւ օգտագործվում են նույն փոխանցման հավասարումները.

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Սինթետիկ ուղարկողի եւ ստացողի հաշիվի ID-ները ստեղծվում են առանցքային սերմերից.

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Տրանսֆերային խմբաքանակի շիշը հետեւյալն է.

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT խմբաքանակի manifest digest-ը կազմում է SHA-256՝ քանոնիկ կապի Norito կոդավորման վրա.

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Հաղորդագրության թափանցիկ ապացույցներ {#sccp-transparent-message-proofs}

SCCP օգնական տուփը նաեւ օգտագործում է FastPQ թափանցիկ խաչմերուկային հաղորդագրությունների ապացուցման համար: Այս ուղին առանձին է `irohad` ֆոնային պրովեր լայնից: Այն կառուցում է FastPQ խմբաքանակ ուղղակիորեն SCCP հաղորդագրության ապացույցի փաթեթից եւ մանիֆեստից, այնուհետեւ փակում է ստացված ապացույցը բաց ստուգման համար:

SCCP խմբաքանակում օգտագործվում է `fastpq-lane-balanced` եւ երեք մետադատային անցում:

|Գլխավոր |Օպերացիա|
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

Դրա հանրային մուտքերը բխում են SCCP թափանցիկ ներքին ապացույցից.

|FastPQ մուտք |SCCP աղբյուր |
| ------------- | ---------------------------------------------------------- |
|`dsid` |Blake2b-ի առաջին 16 բայթը բլեյք 2բ հայտարարության վրա|
|`slot` |Վերջնականության բարձրություն |
|`old_root` |Օգտագործելի բեռի շիշ |
|`new_root` |Հանձնառության արմատը|
|`perm_root` |Վերջնական բլոկ hash |
|`tx_set_hash` |Զեկույցի շիշ |

SCCP քանոնիկ կոդավորիչները գրում են ամբողջական թվերը փոքր-հասակ եւ կոդավորում են փոփոխական երկարության բայթային շարքերը որպես.

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Հանրային մուտքի թափանցիկ բայտ շղթան հետեւյալն է.

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

Անցանցիկ հայտարարության բայթները են տարբերակի, շղթայի ընտանիքի, տեղական եւ հակառակորդի տիրույթների համազերծումը, անվտանգության մոդելը, օղակային կառավարումը, հաշիվի կոդեկը, վերջնականության մոդելը, վավերացողի թիրախը, վերիֆիկատորի հետադարձ ընտանությունը, երկարությամբ նախանշված շղթա/հետադարձ/մանիֆիստ դոմեյնները, նպատակային կապակցող хэշը, հաշիվի կոդեկ բանալին, payload տեսակը, հանրային մուտքի բայթները, եւ payload hash.

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

Այս ապացույցի ուղու համար FastPQ տվյալների տարածքի ID- ը եւս մեկ նախանշված Blake2b պարունակության առաջին տասնվեց բայթներն են.

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ խմբաքանակն է ճշգրիտ'

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

ապա դասակարգվում է նույն FastPQ կարգավորման կանոնով:

OpenVerify ստուգիչի պարտավորությունը SHA-256 է SCCP հաղորդագրության հետադարձ անվանումը եւ քանոնիկ FastPQ ստուգողի նկարագիրը.

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Կարմիր FastPQ ապացույցը Norito-կոդավորված է `StarkFriOpenProofV1`, ապա փակված է `OpenVerifyEnvelope` հետագա ավարտով `Stark`. SCCP ստուգման վերակառուցում է նույն FastPQ փաթեթից եւ manifesto, ստուգում է բաց վավերացման փաթեթի մետադատային տվյալները, եւ կանչում է FastPQ վերակառուցված խմբաքանակի ստուգիչը եւ ապացույցը:

## պարամետրերի հավաքածուներ {#parameter-sets}

Կանոնիկ պարամետրերի կատալոգը բացահայտում է երկու պարամետրային հավաքածու: Host prover lane- ը ներկայումս օգտագործում է `fastpq-lane-balanced`.

|Պարամետր |Նպատակ|դաշտ |Հիշեր |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |հավասարակշռված պրովերային անցում |Goldilocks քառակուսի ընդլայնում |Poseidon2 պարտավորությունները, կատալոգը SHA3 |Արթուր 8, պայթյուն 8, 46 հարցեր |
|`fastpq-lane-latency` |լատենցիային զգայուն ուղիները |Goldilocks քառակուսի ընդլայնում |Poseidon2 պարտավորությունները, կատալոգը SHA3 |Arity 16, blowup 16, 34 հարցեր |

Երկուսն էլ նպատակ են դնում 128-բիթային անվտանգության եւ օգտագործում են `2^16` տիրույթի չափը: Rust V1 վերագրական կրկնօրինակման կոդը ներկայումս արտացոլում է Fiat-Shamir մարտահրավեր բայթները ՝ օգտագործելով `iroha_crypto::Hash::new`, այլ ոչ թե ուղղակիորեն հրավիրելով SHA3-256:

Rust ստուգիչի կողմից օգտագործվող կատալոգային կոնսանտանները հետեւյալն են.

|Անընդհատ |`fastpq-lane-balanced` |`fastpq-lane-latency` |
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

## Կազմակերպություն {#configuration}

FastPQ կարգավորումը տեղադրված է `zk.fastpq` ներքեւում:

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

Նույն կատարման եւ հեռաչափության տեքստերը կարող են վերածվել `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

Շրջակա միջավայրի փոփոխականները աջակցվում են նաեւ կոնֆիգուրացիոն դաշտերի համար: FastPQ- ի հատուկ փոփոխականները ներառում են՝

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

## Մետրիկներ {#metrics}

Երբ հեռաչափությունը հնարավորություն է տրվում, FastPQ արտահանում է ֆունկցիայի ընտրության եւ Metal runtime վարքագծի չափանիշները.

|Մետրիկ |Նշում |
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |Պահանջված եւ լուծված կատարման ռեժիմը ՝ ըստ backend- ի եւ սարքի տեքստերի |
|`fastpq_poseidon_pipeline_total` |Պահանջված եւ լուծված Պոզեյդոնի գազատարի ուղին |
|`fastpq_metal_queue_depth` |Մետաղական հերթի սահմանը, թռիչքի ընթացքում առավելագույն թիվը, առաքման թիվը եւ նմուշների հավաքման պատուհանը |
|`fastpq_metal_queue_ratio` |Մետաղական հերթը զբաղված է եւ փոխկապակցում հարաբերությունները |
|`fastpq_zero_fill_duration_ms` |Հյուրընկալող զրոյական լցման տեւողությունը մետաղի համար: |
|`fastpq_zero_fill_bandwidth_gbps` |Պահանջված զրոյական լրիվության թողունակություն |

Գլխավոր կատարողականի դասակարգման համար օգտագործեք դրանք [ կատարողականի եւ չափանիշների](/hy/guide/advanced/metrics.md) ցուցակում նշված կոնսենսուսի եւ հերթի ազդանշաններով:

## Կապակցված հղում {#related-reference}

- [Տվյալների մոդելային սխեման ](/hy/reference/data-model-schema.md)՝ արտադրված տեսակի մանրամասների համար
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ տարբերակներ](/hy/reference/irohad-cli.md#arg-fastpq-execution-mode)
