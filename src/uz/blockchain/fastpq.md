---
translation_locale: uz
translation_source: /blockchain/fastpq.md
translation_source_hash: d8dd61390f5df3dae09b70399e04e8f71716a912ef5dea9010feaf60573ed261
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# FastPQ {#fastpq}

FastPQ — tanlangan bajarish ta’sirlari uchun Iroha-ning STARK isbot yo‘li. U odatiy tranzaksiya bajarilishi yoki konsensusning o‘rnini bosmaydi. Tranzaksiyalar avvalgidek ISI, IVM va Sumeragi orqali bajariladi; FastPQ deterministik bajarish guvohini qabul qilib, qo‘llab-quvvatlanadigan ta’sirlarni isbot paketlariga aylantiradi.

Joriy mezbon integratsiyasida uchta asosiy yo‘l bor:

- blok bajarilishida qayd etilgan oshkora raqamli aktiv o‘tkazmalari;
- AXT isbot konverti FastPQ bog‘lanishini olib yuradigan, Nexus tekshirgan yo‘lak uzatkichlari;
- FastPQ isbotini ochiq tekshirish konvertiga joylaydigan SCCP oshkora xabar isboti yordamchilari.

## O‘tkazma guvohi yo‘li {#transfer-witness-path}

Ochiq raqamli o‘tkazmalar ko‘rsatma balanslarni o‘zgartirganda tuzilgan o‘tkazma transkriptini yaratadi. Transkript quyidagilarni qayd etadi:

- manba hisobi, manzil hisobi, aktiv ta’rifi va miqdor;
- o‘tkazmadan oldingi va keyingi jo‘natuvchi hamda oluvchi balanslari;
- paket xeshi sifatida ishlatiladigan tranzaksiya kirish nuqtasi xeshi;
- yuboruvchi hisobdan hosil qilingan vakolat dayjesti;
- bitta delta transkriptlari uchun Poseidon dayjesti

Paketli o‘tkazmalar bir nechta deltali bitta transkriptdan foydalanadi. Bunday holatda bitta delta uchun Poseidon dayjesti bo‘lmaydi.

Blokni yakunlashda Iroha bu transkriptlarni kirish nuqtasi xeshi bo‘yicha guruhlaydi. Bajarish guvohi dastlabki transkript paketlari bilan birga isbotlovchi uchun tayyorlangan FastPQ o‘tish paketlarini ham olib yuradi.

Har bir o‘tkazma deltasi ikkita o‘tish satriga aylanadi:

|Satr |Kalit shakli |Oldingi qiymat |Keyingi qiymat |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Jo‘natuvchi debeti |`asset/<asset-definition>/<source-account>` |jo‘natuvchining oldingi balansi |jo‘natuvchining keyingi balansi |
|Oluvchi krediti |`asset/<asset-definition>/<destination-account>` |oluvchining oldingi balansi |oluvchining keyingi balansi |

Raqamli qiymatlar butun sonli guvoh birliklariga me’yorlashtiriladi. Tanlangan o‘nlik aniqlikda qiymatni manfiy bo‘lmagan `u64` sifatida ifodalab bo‘lmasa, u FastPQ paketiga kiritilmaydi.

## Ochiq kirishlar {#public-inputs}

Har bir FastPQ o‘tish paketi isbotni blok va bajarish kontekstiga bog‘laydigan ochiq kirishlarni olib yuradi:

|Kirish |Ma’nosi |
| ------------- | --------------------------------------------------------------- |
|`dsid` |Kichik bayt tartibida kodlangan ma’lumotlar makoni identifikatori |
|`slot` |Nanosekundlarga aylantirilgan blok yaratilish vaqti |
|`old_root` |Bajarish guvohidan hosil qilingan ota holat ildizi |
|`new_root` |Bajarish guvohidan hosil qilingan keyingi holat ildizi |
|`perm_root` |Faol rol ruxsatlari ustidagi Poseidon majburiyati |
|`tx_set_hash` |Tartiblangan tranzaksiya va vaqt qo‘zg‘atuvchisi kirish nuqtasi xeshlari ustidagi xesh |

Mezbon bu paketlar uchun kanonik parametrlar majmuasi sifatida `fastpq-lane-balanced` dan foydalanadi.

## Matematik model {#mathematical-model}

Bu bo‘limda joriy Rust isbotlovchisi va tekshiruvchisi amalga oshiradigan arifmetika tavsiflanadi. Quyidagi barcha maydon amallari Goldilocks tub maydonida bajariladi:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ maydon majburiyatlari uchun `F` ustida Poseidon2-dan foydalanadi. Gubka kengligi `t = 3`, tezligi `r = 2`, sig‘imi esa `1`. Xesh maydon elementlarini tezligi 2 bo‘lgan bloklarda qabul qiladi va yakuniy permutatsiyadan avval bitta `1` maydon elementini qo‘shadi:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Bayt satrlari 7 baytli, kichik bayt tartibidagi bo‘laklarga joylanadi; shu sabab har bir bo‘lak `p` dan qat’iy kichik bo‘ladi:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Domen bo‘yicha ajratilgan maydon xeshlari quyidagicha ifodalanadi:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Bayt domeni dayjestidan boshlanadigan xeshlar uchun FastPQ dastlabki sakkizta kichik bayt tartibidagi baytni maydonga akslantiradi:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Formulada Poseidon2 yoki SHA-256 aniq ko‘rsatilmagan bo‘lsa, bu yerda `Hash` Iroha-ning `iroha_crypto::Hash::new` funksiyasi yaratadigan 32 baytli Blake2bVar dayjestini anglatadi.

### Maydon aritmetikasi {#field-arithmetic}

Rust kodi maydon elementlarini `[0,p)` oralig‘idagi kanonik `u64` qiymatlari sifatida ifodalaydi. Qo‘shish va ayirish quyidagicha:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

Ko‘paytirish avval 128 bitli ko‘paytmani hisoblaydi:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Keyin Goldilocks qisqartirishi quyidagi tenglikdan foydalanadi:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Agar:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

unda qisqartirgich quyidagini hisoblaydi:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

Natija kanonik bo‘lguncha amalga oshirish shartli ravishda `p` ni qo‘shadi yoki ayiradi. Balans deltalari kabi ishorali butun sonlar quyidagicha joylanadi:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 permutatsiyasi {#poseidon2-permutation}

Poseidon2 permutatsiya holati quyidagicha:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Uning S-box funksiyasi:

$$
S(x)=x^5
$$

FastPQ to‘rtta to‘liq raund, ellik yettita qisman raund va yana to‘rtta to‘liq raunddan foydalanadi. `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` raund konstantalariga ega to‘liq raund quyidagicha:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

Qisman raund quyidagicha:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Barcha qo‘shish va ko‘paytirish amallari `F` da bajariladi. Kanonik MDS matritsasi quyidagicha:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Maydon xeshi nol holatdan boshlanadi. Har bir to‘liq tezligi 2 bo‘lgan `(u,v)` blok uchun:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

Yakuniy blok oxirgi permutatsiyadan avval `1` to‘ldirish elementini qo‘shadi. Natija `x_0` dir.

### Ochiq kirishlarni bog‘lash {#public-input-binding}

Mezbon ma’lumotlar makoni identifikatorini `u64` qiymatini 16 baytli maydonning dastlabki sakkizta little-endian baytiga yozib kodlaydi:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Blok yaratish vaqti millisekundlardan nanosekundlarga aylantiriladi:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Tranzaksiyalar to‘plami xeshi tartiblangan kirish nuqtasi xeshlari ustidagi bayt domeni xeshidir:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

Bu yerda `h_i` — tartiblangan tranzaksiya va vaqt qo‘zg‘atuvchisi kirish nuqtasi xeshlari. Isbotning ochiq IO-sida `perm_root` yoki `tx_set_hash` butunlay nollardan iborat bo‘lsa, isbotlovchi zaxira qiymatlarni kiritadi:

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

### Raqamli me’yorlashtirish {#numeric-normalization}

Har bir o‘tkazma deltasi uchun maqsadli o‘nlik shkala miqdor va ikkala balans tasviridagi eng katta qisqartirilgan shkaladir:

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

Mantissasi `m` va shkalasi `q` bo‘lgan `Numeric` qiymat faqat `m >= 0` va `q <= s` bo‘lsa qabul qilinadi. Uning FastPQ guvohi qiymati quyidagicha:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Me’yorlashtirilgan natija `u64` ga sig‘ishi kerak.

### Kanonik tartiblash {#canonical-ordering}

Izni yaratishdan avval paket o‘tish kaliti, amal darajasi va dastlabki kiritish indeksi bo‘yicha tartiblanadi:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

Tartiblash majburiyati `fastpq:v1:ordering` domeni va tartiblangan o‘tishlarning Norito kodlanishi ustidagi Poseidon2 maydon xeshidir:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

Bu yerda `P` — 7 baytli joylash, `E` — Norito kodlanishi, `D_o` — `fastpq:v1:ordering`, `T*` esa tartiblangan o‘tishlar ro‘yxati.

### Oʻtkazish tenglamalari {#transfer-equations}

O‘tkazma miqdori `a`, jo‘natuvchi balansi `f` va oluvchi balansi `t` bo‘lsa, FastPQ izni yaratishdan avval me’yorlashtirilgan guvoh qiymatlarini tekshiradi:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Keyin o‘tish satrlari quyidagilarni kodlaydi:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

Iz ichida ishorali deltalar `F` ga qisqartiriladi:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

Bitta delta uchun ixtiyoriy o‘tkazma dayjesti kodlangan o‘tkazma proobraziga majburiyat hosil qiladi:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Ko‘p deltali o‘tkazma transkriptlarida joriy format bu yuqori darajadagi dayjest bo‘lmasligini talab qiladi.

O‘tkazma transkriptlari uchun mezbon vakolati dayjesti quyidagicha:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Izlar qatorlari {#trace-rows}

Tartiblangan o‘tishlar ro‘yxati `n` ta haqiqiy satrdan iborat bo‘lsin. Iz uzunligi ikkining keyingi darajasi bo‘ladi:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

`0..n-1` satrlar faol, `n..N-1` satrlar esa to‘ldirish satrlaridir. Har bir haqiqiy satrda bitta amal selektori o‘rnatiladi:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Barcha selektor ustunlari mantiqiy qiymatli:

$$
s(s-1)=0
$$

Ruxsat qidirish satrlari aynan rol berish va rolni bekor qilish satrlaridir:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Raqamli operatsion satrlar uchun:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Quruvchi har bir aktiv bo‘yicha jamlanib boradigan deltalarni ham kuzatadi:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Faqat chiqarish va yoqish satrlari taklif hisoblagichini yangilaydi:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Metama’lumot va ma’lumotlar makoni iz ustunlari satrlarni moddiylashtirishdan avval hosil qilingan maydon xeshlaridir:

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

Metama’lumot xeshi, ma’lumotlar makoni xeshi va slot qiymati qo‘shni iz satrlarida o‘zgarmaydi:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### O‘tkazma Merkle ustunlari {#transfer-merkle-columns}

O‘tkazma satrlari 32 darajali siyrak Merkle yo‘lini o‘z ichiga oladi. Mezbon isboti bo‘lmasa, isbotlovchi satr kaliti, oldingi balans va satr jo‘natuvchi yoki oluvchi tomonga tegishli ekanidan deterministik yo‘l hosil qiladi.

Sintetik yo‘llarda tur tuzi jo‘natuvchi satrlari uchun `fastpq:smt:from`, oluvchi satrlari uchun `fastpq:smt:to` dir:

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

Sintetik barg va ichki tugunlar quyidagicha:

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

Iz har bir darajada `b_l` biti, `s_l` qardosh tuguni, `x_l` kirish tuguni va `x_{l+1}` chiqish tugunini qayd etadi. Kodning tarmoq tanlash qoidasi bo‘yicha:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Ruxsat xeshlari {#permission-hashes}

Rol berish va bekor qilish satrlari ruxsat guvohining xeshini hisoblaydi:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Mezbon ruxsatlar jadvali yozuvlarni rol baytlari, ruxsat baytlari va davr baytlari bo‘yicha tartiblaydi, so‘ng Poseidon2 Merkle daraxtini yaratadi:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Kengligi toq bo‘lgan darajalar yakuniy elementni takrorlaydi.

### Iz majburiyati {#trace-commitment}

Har bir `c` iz ustuni uchun FastPQ avval ustun qiymatlarini iz domenida interpolyatsiya qiladi va koeffitsiyentlar vektorining xeshini hisoblaydi:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

Iz ildizi ustun majburiyatlari ustidagi Poseidon2 Merkle ildizidir:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Yakuniy iz majburiyati domen, parametrlar majmuasi, iz shakli, ustun dayjestlari va iz ildizi ustidagi bayt xeshidir:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

Bu yerda `D_c` — `fastpq:v1:trace_commitment`.

### AIR tarkibi {#air-composition}

V1 AIR kompozitsiyasi qiymati satrga xos qoldiqlarning chiziqli kombinatsiyasidir. Transkript ikkita sinov qiymatini tanlaydi:

$$
\alpha_0,\alpha_1 \in F
$$

Har bir qo‘shni `(i,i+1)` satr jufti uchun isbotlovchi quyidagini hisoblaydi:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

`rho` qoldiqlari koddagi tartibda quyidagicha:

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

Raqamli ustunlarga ega satrlar uchun:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

Paketning barqaror kontekst ustunlari uchun esa:

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

Tekshiruvchi tanlangan satr ochilishlari uchun `A_i` ni qayta hisoblaydi va uni AIR kompozitsiyasi Merkle ildizida majburiyatlangan kompozitsiya qiymati bilan solishtiradi.

### Qidiruv mahsuloti {#lookup-product}

Ruxsat qidirish akkumulyatori Fiat–Shamir sinov qiymati `gamma` dan foydalanadi. `s_perm` va `perm_hash` ning quyi darajali kengaytma baholari ustidagi jamlanib boruvchi ko‘paytma quyidagicha:

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

Isbot quyidagilarni qayd etadi:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Kichik darajadagi kengaytma {#low-degree-extension}

`omega_T` iz domeni generatori, `omega_E` baholash domeni generatori va `g` sozlangan koset siljishi bo‘lsin. `v_i` qiymatli iz ustuni uchun interpolyatsiya quyidagi `a_j` koeffitsiyentlarini hosil qiladi:

$$
f(\omega_T^i)=v_i
$$

Quyi darajali kengaytma ayni polinomni kosetda baholaydi:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

Amalga oshirish buni FFT-dan avval koeffitsiyentlarni koset siljishi darajalariga ko‘paytirib hisoblaydi:

$$
a'_j = a_j g^j
$$

so‘ng baholash domenida `a'` ni baholaydi.

CPU FFT — bitlari teskari tartiblangan kirishlar ustidagi iterativ, 2 asosli Cooley–Tukey o‘zgartirishidir. Bosqich uzunligi `L`, yarim uzunlik `H=L/2` va bosqich ildizi quyidagicha bo‘lsa:

$$
\omega_L=\omega^{N/L}
$$

har bir kapalak amali quyidagini hisoblaydi:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

Teskari FFT ayni o‘zgartirishni `omega^{-1}` bilan bajaradi va teskari domen o‘lchamiga ko‘paytiradi:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Katalog ildizlari ishlatilishidan avval tekshiriladi:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Katalog ildizidan olingan kichikroq domenlar uchun generator quyidagicha:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Satr va barg xeshlari {#row-and-leaf-hashes}

LDE-dan keyin FastPQ har bir satr xeshini barcha LDE ustunlari bo‘yicha hisoblaydi. `m` ta ustun uchun:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Agar satr xeshlari hali baholash domenida emas, iz domenida bo‘lsa, isbotlovchi shu bitta satr-xesh ustunini ayni koset LDE jarayoni bilan interpolyatsiya qiladi va kengaytiradi.

### Merkle ochilishlari {#merkle-openings}

LDE qiymatlari quyidagi o‘lchamli bo‘laklarga guruhlanadi:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Har bir bo‘lak bargi quyidagicha:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Merkle ota tugunlari quyidagicha:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Toq darajalar oxirgi tugunni takrorlaydi. So‘rov yo‘llari har bir darajadagi so‘rov bargi indeksining juft-toqligiga qarab chapdan yoki o‘ngdan xeshlab tekshiriladi.

Indeksi `i` bo‘lgan bargning `(s_0,\ldots,s_{d-1})` yo‘li `R` ildiziga nisbatan quyidagi rekurrensiya bilan tekshiriladi:

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

Tekshiruv faqat quyidagi shartda o‘tadi:

$$
y_d=R
$$

AIR iz satri barglari quyidagicha:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR kompozitsiya barglari quyidagicha:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE so‘rovi ochilishi baholash indeksi `i` da ochilgan qiymat autentifikatsiyalangan bo‘lagida mavjudligini ham tekshiradi:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI yig‘ilishi {#fri-folding}

FRI AIR kompozitsiyasi baholariga majburiyat hosil qiladi. Har bir `l` raundida transkript `beta_l` sinov qiymatini tanlaydi. Qatlam oxirgi qiymatni takrorlash orqali aritet karralisigacha to‘ldiriladi. Har bir aritet o‘lchamidagi guruh quyidagiga yig‘iladi:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

Bu yerda `a` — FRI ariteti. Tekshiruvchi har bir tanlangan so‘rov zanjiri uchun quyidagini tekshiradi:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

va har bir ochilgan FRI guruhini tegishli FRI qatlami ildiziga nisbatan autentifikatsiya qiladi.

### Fiat-Shamir transkripti {#fiat-shamir-transcript}

Kanonik parametrlar katalogi transkript xeshini SHA3-256 deb belgilaydi. Joriy isbotlovchi va tekshiruvchi dasturi sinov baytlarini 32 baytli Blake2bVar dayjestini qaytaradigan `iroha_crypto::Hash::new` bilan hosil qiladi, so‘ng kichik bayt tartibidagi dastlabki sakkiz baytni `F` ga qisqartiradi:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Sinov qiymatini olish chaqiruvlari to‘liq dayjestni transkript holatiga qo‘shadi. Takrorlash tartibi quyidagicha:

1. ochiq IO, protokol versiyasi, parametr versiyasi va parametr nomi
2. LDE ildizi va iz ildizi
3. `gamma`
4. AIR kompozitsiyasi sinov qiymatlari `alpha_0`, `alpha_1`
5. AIR iz ildizi va AIR kompozitsiyasi ildizi
6. qidiruvning katta ko‘paytmasi
7. FRI qatlam ildizlari va `beta_l` sinov qiymatlari
8. tanlangan so‘rov indekslari

So‘rovlarni tanlash so‘ralgan miqdordagi takrorlanmas indekslar yig‘ilguncha 32 baytli sinov dayjestlarini hosil qilishda va ularni kichik bayt tartibidagi `u64` bo‘laklari sifatida o‘qishda davom etadi:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

Tanlangan to‘plam tartiblangan holda qaytariladi.

### Tekshiruvchining takrorlashi {#verifier-replay}

Tekshiruvchi birinchi navbatda partiya majburiyatini qayta hisoblaydi:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

va quyidagilarni talab qiladi:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

U ochiq IO-ni ham qayta yaratadi:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Har bir maydon isbotning ochiq IO-siga baytma-bayt mos kelishi kerak. Keyin tekshiruvchi ayni transkriptni qayta yaratib, quyidagilarni hosil qiladi:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Har bir tanlangan `q` so‘rovi uchun u quyidagilarni tekshiradi:

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

va:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

AIR kompozitsiyasi ochilishi `R_air_composition` ostida autentifikatsiyalanishi kerak. FRI zanjiri ayni `A_q` dan boshlanib, yakuniy FRI ildizi ostida autentifikatsiyalangan oxirgi FRI bargida tugashi shart.

## Isbotlovchi nimalarni tekshiradi {#what-the-prover-checks}

FastPQ isbotlovchisi izni yaratishdan avval paket tartibini o‘tish kaliti, amal darajasi va kiritish tartibi bo‘yicha kanonlashtiradi. O‘tkazma satrlari transkript metama’lumotini ham talab qiladi. O‘tkazma satrlari bor, ammo o‘tkazma transkriptlari yo‘q paket yaroqsiz.

O‘tkazma transkriptlari uchun isbotlovchi quyidagilarni tekshiradi:

- jo‘natuvchining balansi manfiy qiymatga tushmasligi kerak
- `sender_after` qiymati `sender_before - amount` ga teng bo‘lishi kerak;
- `receiver_after` qiymati `receiver_before + amount` ga teng bo‘lishi kerak;
- transkript paketdagi har bir o‘tkazma satrini qamrab olishi kerak;
- bitta delta uchun Poseidon dayjesti mavjud bo‘lsa, u transkript proobraziga mos kelishi kerak;
- berilgan siyrak Merkle isbotlari 1-versiya sifatida dekodlanishi kerak; yetishmaydigan yo‘llar deterministik sintetik isbotlar bilan to‘ldiriladi.

Iz o‘tkazma, chiqarish, yoqish, rol berish, rolni bekor qilish, metama’lumot sozlash va ruxsat qidirish satrlari uchun selektor ustunlariga ega. Raqamli amal satrlari ishorali deltalar, har bir aktiv bo‘yicha jamlanib boradigan deltalar va taklif hisoblagichlarini ham olib yuradi.

## Isbotlovchi yo‘lagi {#prover-lane}

Isbotlovchi ichki tizimini tayyorlash mumkin bo‘lsa, `iroha3d` ishga tushishda FastPQ isbotlovchi yo‘lagini boshlaydi. Yo‘lak — chegaralangan navbatga ega fon vazifasi. Blok bajarish guvohini hosil qilgach, yakunlash yo‘li blok xeshi, balandligi, ko‘rinishi va guvohni o‘z ichiga olgan isbotlash vazifasini yuboradi.

Yo‘lak ishlamayotgan yoki navbat to‘la bo‘lsa, vazifa tashlab ketiladi va odatiy blokni qayta ishlash davom etadi. Demak, fondagi isbotlovchi yo‘lagi tranzaksiyani qabul qilish yoki konsensus darvozasi emas; u allaqachon bajarilgan holat uchun isbot yaratish yo‘lidir.

Yo‘lak isbotlovchini quyidagilar bilan yaratadi:

```text
parameter = "fastpq-lane-balanced"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Har ikki sozlamaning standart qiymati `cpu`. `gpu` ni tanlash — xavfsiz rad etiladigan aniq talab: GPU qo‘llab-quvvatlashi yig‘ilmagan yoki so‘ralgan GPU ichki tizimining dastlabki tekshiruvi muvaffaqiyatsiz bo‘lsa, isbotlovchi yo‘lagi o‘chiq qoladi. Birinchi relizda `auto` qiymati yo‘q va so‘ralgan GPU rejimidan CPU-ga zaxira qaytish amalga oshirilmaydi.

## Tekshirish {#verification}

FastPQ isbotini tekshirish kanonik paket majburiyatini qayta yaratadi va ochiq transkriptni takrorlaydi. Tekshiruvchi protokol versiyasi, parametrlar majmuasi versiyasi, takrorlash chegaralari, iz majburiyati, ochiq kirishlar, tanlangan Merkle ochilishlari, AIR ochilishlari va FRI so‘rovi zanjirini tekshiradi.

Standart takrorlash chegaralari quyidagilarni o‘z ichiga oladi:

|Chegara |Standart qiymat |
| ------------------ | ------: |
|Oʻtish qatorlari |     256 |
|Paket foydali yuki o‘lchami |256 KiB |
|FRI qatlamlari |      16 |
|So‘rov ochilishlari |     128 |

## Nexus tekshirgan uzatkichlar {#nexus-verified-relays}

Nexus AXT isbot konverti `AxtFastpqBinding` ni o‘z ichiga olishi mumkin. `RegisterVerifiedLaneRelay` bajarilganda Iroha:

1. yo‘lak uzatuvchi konverti va FastPQ isbot materialini tekshiradi;
2. ma’lumotlar makoni va manifest ildizini tekshiradi;
3. AXT isbot konvertini dekodlaydi;
4. `fastpq_binding` mavjudligini talab qiladi;
5. shu bog‘lanishdan FastPQ paketini qayta yaratadi;
6. ichki FastPQ isbotini dekodlaydi;
7. qayta yaratilgan paket va isbot uchun FastPQ tekshiruvchisini chaqiradi.

Tekshiruv muvaffaqiyatli bo‘lsa, Iroha uzatuvchi havolasi, asl konvert, isbot foydali yuki xeshi, tekshirish balandligi, manifest ildizi va FastPQ bog‘lanishini o‘z ichiga olgan `VerifiedLaneRelayRecord` yozuvini saqlaydi.

Yo‘lak uzatuvchi konvertlari ixcham FastPQ isbot materialini ham olib yuradi. Material yo‘lak identifikatori, ma’lumotlar makoni identifikatori, blok balandligi, tekshirish balandligi, blok sarlavhasi xeshi, hisob-kitob xeshi va manifest ildizi dayjestidir. Uzatuvchi yozuvi faqat QC va yaroqli FastPQ isbot materialiga ega bo‘lsa birlashtirishga qabul qilinadi.

### AXT bog‘lanishi matematikasi {#axt-binding-math}

Nexus AXT konvertlari uchun `AxtFastpqBinding` isbotni takrorlashdan avval kanonlashtiriladi. Bo‘sh parametr qiymatlari standart `fastpq-lane-balanced` ga, bo‘sh tekshiruvchi identifikatori va versiyasi mos ravishda `fastpq` va `v1` ga almashtiriladi; da’vo turi chetlaridagi bo‘shliqlardan tozalanib, kichik harflarga o‘tkaziladi.

AXT FastPQ ochiq kirishlari deterministik bayt xeshlaridir:

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

AXT o‘tish kalitlari quyidagicha:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` da’vosi rol berish satrini kiritadi:

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

va vakolat siyosatini bog‘laydigan metama’lumot qatori. `compliance` da’vosi ikkita metama’lumot qatorini kiritadi: biri siyosat, ikkinchisi maqsadli ma’lumotlar makonlari uchun.

`tx_predicate` va `value_conservation` uchun bog‘lanish musbat manba yoki manzil miqdorini o‘z ichiga olsa, aniq ta’sir miqdori ishlatiladi. Aks holda kod chegaralangan deterministik miqdorni hosil qiladi:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Keyin ayni o‘tkazma tenglamalari qo‘llaniladi:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Sintetik jo‘natuvchi va oluvchi hisob identifikatorlari kalit urug‘laridan hosil qilinadi:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

O‘tkazma paketi xeshi quyidagicha:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT paketi manifesti dayjesti kanonik bog‘lanishning Norito kodlanishi ustidagi SHA-256 dayjestidir:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP oshkora xabar isbotlari {#sccp-transparent-message-proofs}

SCCP yordamchi krayti zanjirlararo oshkora xabar isbotlari uchun ham FastPQ-dan foydalanadi. Bu yo‘l `iroha3d` ning fondagi isbotlovchi yo‘lagidan alohida. U FastPQ paketini bevosita SCCP xabari isbot paketi va manifestidan yaratadi, so‘ng hosil bo‘lgan isbotni ochiq tekshirish uchun konvertga joylaydi.

SCCP paketida `fastpq-lane-balanced` va uchta metama’lumot o‘tishi ishlatiladi:

|Kalit |Amal |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

Uning ochiq kirishlari SCCP oshkora ichki isbotidan hosil qilinadi:

|FastPQ kirish |SCCP manbai |
| ------------- | ---------------------------------------------------------- |
|`dsid` |Bayonot xeshi ustidagi Blake2b dayjestining dastlabki 16 bayti |
|`slot` |Yakuniylik balandligi |
|`old_root` |Foydali yuk xeshi |
|`new_root` |Majburiyat ildizi |
|`perm_root` |Yakuniylik bloki xeshi |
|`tx_set_hash` |Bayonot xeshi |

SCCP kanonik kodlagichlari butun sonlarni kichik bayt tartibida yozadi va o‘zgaruvchan uzunlikdagi bayt massivlarini quyidagicha kodlaydi:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Oshkora ochiq kirish baytlari satri quyidagicha:

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

Oshkora bayonot baytlari versiya, zanjir oilasi, mahalliy va qarshi tomon domenlari, xavfsizlik modeli, tayanch boshqaruvi, hisob kodeki, yakuniylik modeli, tekshiruvchi maqsadi, tekshiruvchi ichki tizimi oilasi, uzunlik prefiksli zanjir/ichki tizim/manifest maydonlari, manzil bog‘lanishi xeshi, hisob kodeki kaliti, foydali yuk turi, ochiq kirish baytlari va foydali yuk xeshining birikmasidir. Bayonot xeshi quyidagicha:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

Bu isbot yo‘li uchun FastPQ ma’lumotlar makoni identifikatori boshqa bir prefiksli Blake2b dayjestining dastlabki o‘n olti baytidir:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ paketi aynan quyidagicha:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

so‘ng ayni FastPQ tartiblash qoidasi bo‘yicha tartiblanadi.

OpenVerify tekshiruvchisi majburiyati — SCCP xabari ichki tizimi nomi va kanonik FastPQ tekshiruvchisi tavsifining SHA-256 dayjesti:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Xom FastPQ isboti Norito formatida `StarkFriOpenProofV1` ga kodlanadi, so‘ng `Stark` ichki tizimiga ega `OpenVerifyEnvelope` ichiga joylanadi. SCCP tekshiruvi paket va manifestdan ayni FastPQ paketini qayta yaratadi, ochiq tekshirish konverti metama’lumotini tekshiradi hamda qayta yaratilgan paket va isbot uchun FastPQ tekshiruvchisini chaqiradi.

## Parametrlar majmualari {#parameter-sets}

Kanonik parametrlar katalogida ikkita parametr majmuasi mavjud. Mezbon isbotlovchi yo‘lagi hozir `fastpq-lane-balanced` dan foydalanadi.

|Parametr |Maqsadi |Maydon |Xeshlar |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |isbotlovchining muvozanatli o‘tkazuvchanligi |Goldilocks kvadratik kengaytmasi |Poseidon2 majburiyatlari, katalogdagi SHA3 yorlig‘i |aritet 8, kengayish 8, 46 so‘rov |
|`fastpq-lane-latency` |kechikishga sezgir yo‘laklar |Goldilocks kvadratik kengaytmasi |Poseidon2 majburiyatlari, katalogdagi SHA3 yorlig‘i |aritet 16, kengayish 16, 34 so‘rov |

Har ikki majmua 128 bitli xavfsizlikni ko‘zlaydi va `2^16` o‘lchamli iz domenidan foydalanadi. Rust V1 transkriptini takrorlash kodi hozir Fiat–Shamir sinov baytlarini SHA3-256-ni bevosita chaqirish o‘rniga `iroha_crypto::Hash::new` bilan hosil qiladi.

Rust isbotlovchisi ishlatadigan aniq katalog konstantalari quyidagicha:

|Konstanta |`fastpq-lane-balanced` |`fastpq-lane-latency` |
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

## Sozlash {#configuration}

FastPQ sozlamasi `zk.fastpq` ostida joylashadi.

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

Ayni bajarish va telemetriya yorliqlarini `iroha3d` orqali qayta belgilash mumkin:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Sozlama maydonlari uchun muhit o‘zgaruvchilari ham qo‘llab-quvvatlanadi. FastPQ-ga xos o‘zgaruvchilar quyidagilarni o‘z ichiga oladi:

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

## Metriklar {#metrics}

Telemetriya yoqilganda FastPQ ichki tizim tanlovi va Metal bajarish muhiti xatti-harakatiga oid ko‘rsatkichlarni eksport qiladi:

|Ko‘rsatkich |Ma’nosi |
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |Ichki tizim va qurilma yorliqlari bo‘yicha so‘ralgan hamda aniqlangan bajarish rejimi |
|`fastpq_poseidon_pipeline_total` |So‘ralgan va aniqlangan Poseidon konveyeri yo‘li |
|`fastpq_metal_queue_depth` |Metal navbati chegarasi, bir paytdagi ishlarning eng katta soni, yuborishlar soni va tanlash oynasi |
|`fastpq_metal_queue_ratio` |Metal navbatining bandlik va ustma-ustlik nisbatlari |
|`fastpq_zero_fill_duration_ms` |Metal bajarishlari uchun mezbonda nol bilan to‘ldirish davomiyligi |
|`fastpq_zero_fill_bandwidth_gbps` |Hosil qilingan nol bilan to‘ldirish o‘tkazuvchanligi |

Umumiy unumdorlik muammolarini aniqlashda bu ko‘rsatkichlarni [Unumdorlik va ko‘rsatkichlar](/uz/guide/advanced/metrics.md) bo‘limidagi konsensus hamda navbat signallari bilan birga ishlating.

## Tegishli ma’lumotnomalar {#related-reference}

- tugun vakolatli turlarining oniy tasviri uchun [Ma’lumotlar modeli sxemasi](/uz/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ parametrlari](/uz/reference/iroha3d-cli.md#fastpq-overrides)
