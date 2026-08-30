---
translation_locale: uz
translation_source: /blockchain/fastpq.md
translation_source_hash: 55b57e6aeeef2aefa1c8359d9b9487029b106eaebed12a58268b61dc583e97f6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ bo ' lmoqda Iroha Bu ... STARK tanlangan ijro ta'sirlari uchun isbot yo'li. Bu odatdagi tranzaksiyalarni bajarish yoki konsensusni almashtirmaydi. Transaksiyalar hali ham o ' tmoqda ISI, IVM, va Sumeragi odatdagidek; FastPQ deterministik ijro guvohlarini iste'mol qiladi va qo'llab-quvvatlanadigan effektlarni dalil partiyalariga aylantiradi.

Hozirgi uy egasi integratsiyasi uchta asosiy yoʻlga ega:

- blokni amalga oshirish paytida qayd etilgan shaffof raqamli aktiv o'tkazmalari
- Nexus ta'minlangan yo'nalishdagi relaylar AXT ko'rsatkich zarfida FastPQ bog'lovchi
- SCCP ochiq tekshirish qadoqchasida FastPQ isbotni o'rab oladigan shaffof xabarlarni tasdiqlovchi yordamchilar

## Shohidlik yo'lini ko'chirish {#transfer-witness-path}

Ochiq raqamli o'tkazuvlar ko'rsatma muvozanatni mutatsiya qilganda tuzilgan o'tkazish transkripti yaratadi. Transkript qayd etadi:

- manba hisobvarag'i, maqsadli hisobvaraq, aktivni aniqlash va miqdori
- O'tkazishdan oldin va keyin jo'natgich va qabul qiluvchining balanslari
- partiya hash sifatida ishlatiladigan tranzaksiya kirish nuqtasi
- taqdim etuvchi hisob raqamidan olingan vakolat to'g'risida ma'lumot
- Single-delta transkripsiyalari uchun Poseidon digest

Kataklarni o'tkazishda bir nechta deltalardan iborat transkript ishlatiladi. O'sha holda, bitta deltaga ega bo'lgan "Poseidon" digesti yo'q.

Blokni yakunlash paytida Iroha ushbu transkripsiyalarni kirish nuqtasi hashidan guruhlaydi. Ijro guvohligi keyinchalik dastlabki transkripsiya to'plamlarini ham, prover uchun tayyorlangan FastPQ o'tish partiyalarini ham olib keladi.

Har bir transfer delta ikki oʻtish satrlariga aylanadi:

|Qoʻshish |Asosiy shakli|Oldingi qiymat |Qiymatdan keyin |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Yo ' lovchi debeti |`asset/<asset-definition>/<source-account>` |oldingi jo ' natuvchi bilansi |jo ' natuvchining balansidan keyin |
|Qabul qiluvchi kreditlari |`asset/<asset-definition>/<destination-account>` |oluvchi balansidan oldin |oluvchi balansidan keyin |

Raqamli qiymatlar to'liq sonli guvoh birliklariga normalashtiriladi. FastPQ partiyasi uchun qiymat tanlangan o'nlik ko'rsatkichda salbiy bo'lmagan `u64` sifatida ifoda etilishi mumkin bo'lmasa rad etiladi.

## Davlat mablag'lari {#public-inputs}

Har bir FastPQ o'tish partiyasida blok va ijro kontekstiga dalilni bog'laydigan ommaviy kirish ma'lumotlari mavjud:

|Kiritish |Maʼnosi |
| ------------- | --------------------------------------------------------------- |
|`dsid` |Maʼlumotlar maydonining identifikatori kichik baytlar sifatida kodlangan |
|`slot` |Blok yaratish vaqti nanosekundlarga aylantiriladi |
|`old_root` |Oʻlim guvohlaridan kelib chiqqan ota-ona davlatining ildizlari |
|`new_root` |Hukm qilish guvohlaridan kelib chiqqan post-davlat ildizlari |
|`perm_root` |Poseidonning faol rolga ruxsat berish bilan bogʻliq majburiyatlari |
|`tx_set_hash` |Tashkilot va vaqtni qoʻzgʻatadigan kirish nuqtasi hashlari ustidan hash |

Uy egasi `fastpq-lane-balanced` ni ushbu partiyalar uchun qo'yilgan kanonik parametr sifatida ishlatadi.

## Matematikaviy model {#mathematical-model}

Ushbu bo'limda joriy Rust prover va verificator tomonidan amalga oshirilgan aritmetika tasvirlanadi. Quyida keltirilgan barcha maydon operatsiyalari Goldilocks boshlangʻich maydoni ustida:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ dala majburiyatlari uchun `F` o'rniga Poseidon2dan foydalanadi. Spongning kengligi `t = 3`, darajasi `r = 2` va quvvati `1` bo'ladi. Hash 2-darajali bloklarda maydon elementlarini o'z ichiga oladi va yakuniy permutatsiya qilishdan oldin bitta maydon elementi `1` qo'shadi:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Byte simlari 7 bytli kichik endiklar bilan to'planadi, shuning uchun har bir a'zo `p` dan kamroq bo'ladi:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Domenlar boʻyicha ajratilgan maydon hashlari quyidagicha ifodalanadi:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Byte-domain digestlaridan boshlanadigan hashlar uchun FastPQ birinchi sakkiz kichik indian byetlarini maydonga xaritalaydi:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Bu yerda `Hash` Iroha ning `iroha_crypto::Hash::new` 32-baytli Blake2bVar digestini anglatadi, agar formulada Poseidon2 yoki SHA-256 nomi aniq berilmagan bo'lsa.

### Maydon aritmetikasi {#field-arithmetic}

Rust kodi maydon elementlarini `[0,p)`dagi kanonik `u64` qiymatlari sifatida ifodalaydi. Qo'shish va kamaytirish quyidagilardir:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

Koʻpaytirish birinchi navbatda 128 bitli mahsulotni hisoblaydi:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Goldilocks kamaytirish keyin kimlik ishlatiladi:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Agar:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

so'ngra reduktor hisoblaydi:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

Amalga oshirish sharti bilan `p` ni qo'shadi yoki chiqarib tashlaydi. Natija kanonik bo'lishigacha. Imzolangan to'liq sonlar, masalan balans deltalari quyidagilardan iborat bo'ladi:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 Permutatsiya {#poseidon2-permutation}

Poseidon2 permutatsiya holati quyidagicha:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Uning " S-box " nomi:

$$
S(x)=x^5
$$

FastPQ to'rtta to'liq turdan, ellik yettita qisman turdan, so'ngra yana to'rt nafar to'la turdan foydalanadi. `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` davraviy konstantalarga ega bo'lgan to'liq round:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

Ba'zi qismlar:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Barcha qo'shish va ko'paytirishlar `F`. Kanonik MDS matrisi quyidagilardan iborat:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Hudud hashsizligi nol holatdan boshlanadi. Har bir to'liq stavka-2 blok uchun `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

So'nggi blokda `1` so'nggi permutatsiyadan oldin to'ldirish elementi. `x_0`.

### Jamoatga kiritiladigan ma'lumotlar {#public-input-binding}

Uy egasi `u64` qiymatini 16-bayt maydonining birinchi sakkiz kichik bytilariga yozib, ma'lumotlar maydoni identifikatorini kodlaydi:

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

Transaction-set hash toʻgʻri yoʻlga qoʻyilgan kirish nuqtasi hashlariga nisbatan byte-domin hash hisoblanadi:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

qaerda `h_i` Transaksiya va vaqtni qo'zg'atadigan kirish nuqtasi hashlari tarqatilgan. IO, agar `perm_root` yoki `tx_set_hash` barchasi nol bo'lsa, prover fallback qiymatlarini to'ldiradi:

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

### Raqamli normalizatsiya {#numeric-normalization}

Har bir uzatish delta uchun maqsadli o'nlik ko'rsatkich miqdori bo'ylab eng yuqori kesilgan ko'rsatkichi va ikkala muvozanat sur'atlari:

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

A `Numeric` mantissa bilan qiymat `m` va hajmi `q` faqat `m >= 0` va `q <= s`. Uning FastPQ guvohning qiymati quyidagicha:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Normallashtirilgan natija `u64` ga mos bo'lishi kerak.

### Kanonik tartibga solish {#canonical-ordering}

Ko'rsatkichlar qurilishidan oldin partiya o'tish kalitlari, ishlash darajasi va asl qo'shish indekslari bo'yicha tartiblanadi:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

Sortlangan o'tishlarning `fastpq:v1:ordering` domeni va Norito kodlash usuli bo'yicha Poseidon2 maydonining hashini tashkil etish majburiyati:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

qaerda `P` 7 baytli paket bo'ladi, `E` bo ' lmoqda Norito kodlash, `D_o` bo ' lmoqda `fastpq:v1:ordering`, va `T*` to'g'rilashtirilgan o'tish ro'yxatidir.

### Oʻtkazish tenglamalari {#transfer-equations}

O'tkazish summasi `a`, jo'natgich saldi `f` va qabul qiluvchining saldi `t` uchun, izni yaratishdan oldin FastPQ normallashtirilgan guvoh qiymatlarini tasdiqlaydi:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Oʻtish qatorlari keyinchalik kodlanadi:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

Ko'rsatkich ichida imzolangan deltalar `F` ga kamaytirilgan:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

Optativ yagona delta o'tkazib yuborish digesti kodlangan o'tkaziladigan oldindan tasvirni amalga oshiradi:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Ko'p delta uzatish transkripsiyalari uchun joriy formatda ushbu yuqori darajadagi tarjima yo'q bo'lishi kerak.

Oʻtkazish transkripsiyalari uchun qabul qiluvchi organni isteʼmol qilish:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Izlar qatorlari {#trace-rows}

Sortlangan o'tish ro'yxatida `n` haqiqiy satrlar bo'lsin.

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

`0..n-1` qatorlari faol; `n..N-1` qatorlari to'ldirish satrlaridir. Har bir haqiqiy qatorda bitta operatsion tanlovchining seti mavjud:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Barcha selektor ustunlari Boolean:

$$
s(s-1)=0
$$

Ruxsatlarni qidirish qatorlari to'g'ri rol berish va roli bekor qilish qatorlaridir:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Raqamli operatsion satrlar uchun:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Quruvchi shuningdek , har bir aktiv boʻyicha ishlaydigan deltalarni kuzatadi:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Faqat "Mint" va "burn" qatorlari ta'minot hisoblagichini yangilaydi:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Metadonlar va ma'lumotlar maydonining izlari ustunlari qator materiallashuvidan oldin hosil bo'lgan maydon hashlari:

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

Metadata hash, ma'lumotlar maydonining hash va slotlar yonma-yon iz qatorlarida barqaror:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Merkle ustunlarini oʻtkazish {#transfer-merkle-columns}

O'tkazib yuborish satrlari 32 darajali kamroq Merkle yo'nalishini o'z ichiga oladi. Agar uy egasi dalil yo'q bo'lsa, prover qator kalitidan deterministik yo'nalishni sintezlaydi, oldindan muvozanatni saqlaydi va satr jo'natgich yoki qabul qiluvchi tomondanmi.

Sintetik yo'nalishlar uchun aromat tuzlari `fastpq:smt:from` jo'natgich qatorlar va `fastpq:smt:to` qabul qiluvchi qatorlar uchun:

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

Sintetik varaq va ichki nodlar quyidagilardan iborat:

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

Iz bitini `b_l`, aka-uka `s_l`, kirish nodini `x_l` va chiqish nodini `x_{l+1}` har bir darajadagi qayd etadi. Kodning shoxkon konvensiyasi bilan:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Ruxsat berish hashlari {#permission-hashes}

Roli berish va bekor qilish satrlari ruxsat guvohini hash qilish:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Qo'shni ruxsatlar jadvali ilovalarni rol baytlari, ruxsat baytlari va davr baytlari bo'yicha ajratadi, so'ngra Poseidon2 Merkle daraxtini yaratadi:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Bo'sh kenglik darajasi oxirgi elementni ikki marta ko'paytiradi.

### O'z izini yo'qotish {#trace-commitment}

Har bir iz ustuni uchun `c`, FastPQ birinchi navbatda iz maydoni bo'ylab ustun qiymatlarini interpollaydi va koeffitsiyent vektorini hash qiladi:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

Iz ildizlari ustun majburiyatlari ustidan Poseidon2 Merkle ildizidir:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Yakuniy izlanish majburiyati domen, parametrlar to'plami, izlanish shakli, ustun o'chirib tashlash va izlanish ildizidagi byt hashdir:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

`D_c` bo'lganda `fastpq:v1:trace_commitment`.

### AIR tarkibi {#air-composition}

V1 AIR tarkib qiymati qator-lokal qoldiqlarning chiziqli kombinatsiyasi hisoblanadi. Transkript namunalari ikkita qiyinchilikni ko'rsatadi:

$$
\alpha_0,\alpha_1 \in F
$$

Har bir qo'shni satr juftligi uchun `(i,i+1)` prover quyidagilarni hisoblaydi:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Qoldiqlar `rho` kod tartibida quyidagicha:

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

Hisob ustunlari bo'lgan satrlar uchun:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

Va barchning barqaror kontekst ustunlari uchun:

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

Tekshirishchi `A_i` namuna ko'rib chiqilgan qatorning ochilishlarini qayta hisoblab chiqadi va uni AIR tarkibidagi Merkle ildizida belgilangan tarkibiy qiymatga nisbatan tekshiradi.

### Qidiruv mahsuloti {#lookup-product}

Ruxsatlarni qidirish akkumulyatorida Fiat-Shamir musobaqasi `gamma` qo'llaniladi. `s_perm` va `perm_hash` ning past darajadagi kengaytma baholari davomida ishlaydigan mahsulot quyidagicha:

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

Ko'rsatkichlar:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Kichik darajadagi kengaytma {#low-degree-extension}

`omega_T` izlanish domenlari generatorini, `omega_E` baholash domenlari generatorini va `g` konfiguratsiyalangan coset offseti bo'lishi kerak. `v_i` qiymatlariga ega bo'lgan izlanish ustuni uchun interpolatsiya `a_j` koeffitsiyentlarini hosil qiladi:

$$
f(\omega_T^i)=v_i
$$

Past darajali kengaytma kosetdagi bir xil polinomni baholaydi:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

Amalga oshirilishi ko'rsatkichlarni FFT dan oldin coset ofsetning kuchlari bilan ko'paytirish orqali hisoblab chiqiladi:

$$
a'_j = a_j g^j
$$

so'ngra baholash domenida `a'` ni baholash.

CPU FFT bit-inversed kirish usuli bo'yicha iterativ radix-2 Cooley-Tukey transformasi. bosqich uzunligi `L`, yarim uzunligi `H=L/2` va bosqich ildizida:

$$
\omega_L=\omega^{N/L}
$$

har bir tola hisoblaydi:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

Reversal FFT `omega^{-1}` bilan bir xil transformatsiyani amalga oshiradi va reversal domen o'lchamiga ko'tarilgan:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Katalog ildizlari foydalanishdan oldin tasdiqlanadi:

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

### Qatlam va barg hashlari {#row-and-leaf-hashes}

LDE dan keyin FastPQ har bir satrni barcha LDE ustunlarda hash qiladi. `m` ustunlari uchun:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Agar satr hashlari baholash domenidan ko'ra iz domenida bo'lsa, prover ushbu bitta satr hash ustunini LDE jarayoni bilan interpolatsiya qiladi va uzaytiradi.

### Merkle ochilishlari {#merkle-openings}

LDE qiymatlari quyidagi qismlarga bo'lingan:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Har bir parcha barg quyidagicha:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Merklning ota-onasi:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

O'zgarmas darajalar so'nggi nodni takrorlaydi. So'rov yo'llari har bir darajadagi so'rov varaqining indeks paritetiga ko'ra chap yoki o'ngga hash qilish orqali tasdiqlangan.

`i` ko'rsatkichdagi barg uchun `(s_0,\ldots,s_{d-1})` yo'nalishi `R` ildizga nisbatan takrorlanishi bilan aniqlanadi:

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

Chek faqat quyidagi hollarda o'tkaziladi:

$$
y_d=R
$$

AIR izlar qatorli barglar quyidagicha:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR kompozitsiya barglari quyidagicha:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE so'rovni ochish, shuningdek, baholash indeksida `i` ochilgan qiymat uning tasdiqlangan qismida mavjudligini tekshiradi:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Qo'shish {#fri-folding}

FRI AIR tarkibining baholovchilarini amalga oshiradi. Har bir tur uchun `l`, transkript namunalari qiyinchilikka duchor bo'ladi `beta_l`. qatlam oxirgi qiymatni takrorlash orqali aritasining ko'paytirishiga to'ldirilgan.

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

`a` - bu FRI ariteti bo'lgan joyda. Tekshiruvchi har bir namunaga olingan so'rov zanjirida quyidagilarni tekshiradi:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

va har bir ochilgan FRI guruhni tegishli FRI qatlamli ildiz bilan tasdiqlaydi.

### Fiat-Shamir transkripti {#fiat-shamir-transcript}

Kanonik parametrlar katalog transkript hashini SHA3-256 deb belgilaydi. Hozirgi prover va tasdiqlovchi implementatsiyasi `iroha_crypto::Hash::new` bilan musobaqa bytlarini keltirib chiqaradi, bu 32 baytli Blake2bVar digestidir, so'ngra birinchi sakkiz kichik indian bytlarni `F` ga kamaytiradi:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Muammo qo'ng'iroqlari transkripsiya holatiga to'liq o'qishni qo'shadi. Takrorlash tartibi quyidagicha:

1. IO, protokol versiyasi, parametr versiyasi va parametr nomi
2. LDE ildiz va izlar ildiz
3. `gamma`
4. AIR tarkib muammolari `alpha_0`, `alpha_1`
5. AIR orzu ildiz va AIR tarkibiy ildiz
6. buyuk mahsulot qidirish
7. FRI qatlam ildizlari va `beta_l` qiyinchiliklari
8. namuna ko'rsatkichlari

So'rovli namuna olish 32-baytlik musobaqalarni chizishni davom ettiradi va uni talab qilingan yagona indekslar soniga ega bo'lgunga qadar `u64` kichik xilma-xil qismlar sifatida o'qiydi:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

Namunalar to'plami tartib bo'yicha qaytariladi.

### Verifikatorni takrorlash {#verifier-replay}

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

Bundan tashqari, u IO davlatni tiklaydi:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Har bir maydon dalilning ommaviy IO byte-for-bytega mos bo'lishi kerak. Keyin tasdiqlovchi o'sha transkriptni rekonstruksiya qilib, uni quyidagicha keltirib chiqaradi:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Har bir namunaviy so'rov uchun `q`, u quyidagilarni tekshiradi:

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

AIR tarkibning ochilishi `R_air_composition` ostida tasdiqlanishi kerak. FRI zanjiri keyinchalik xuddi shu `A_q` dan boshlanadi va FRI tugma chizig'i ostida tasdiqlangan oxirgi FRI varaq bilan yakunlanishi kerak.

## Masalchi nimalarni tekshiradi {#what-the-prover-checks}

FastPQ proveri izni yaratishdan oldin partiya tartibini o'tish tugmasi, operatsion daraja va qo'shish tartibi bo'yicha kanonikalashtiradi. O'tkazish satrlari transkript metadatalarini ham talab qiladi. Transfer satrlari mavjud bo'lgan partiya, ammo transfer transkriptlari yo'q.

O'tkazish transkripsiyalari bo'yicha provayderlar tomonidan tekshiruvlar quyidagilarni o'z ichiga oladi:

- jo'natgichning muvozanati past o'tishi mumkin emas
- `sender_after` teng bo'lishi kerak `sender_before - amount`
- `receiver_after` teng bo'lishi kerak `receiver_before + amount`
- transkripsiya partiyadagi har bir o'tkazish satrini qamrab olishi kerak
- Poseidonning bitta deltali dijesining mavjud bo'lganida transkript oldindan ko'rsatilgan tasvirga mos kelishi kerak
- agar kamroq Merkle isbotlari 1 versiyasi sifatida dekodlash kerak bo'lsa; yo'qolgan yo'llar deterministik sintetik isbotlar bilan to'ldiriladi

Izda o'tkazish, mint, yoqish, rol berish, roli bekor qilish, metadatalar to'plami va ruxsat qidirish satrlari uchun selektor ustunlari mavjud. Raqamli operatsion satrlarda imzolangan deltalar ham bor.

## Provor Lane {#prover-lane}

`iroha3d` ishga tushirishda FastPQ prover yo'nalishini boshlaydi, agar prover backendni dastlabkilashtirish mumkin bo'lsa. Yo'nalish cheklangan navbatga ega fon vazifasidir. Bir blok ijro guvohini ishlab chiqargandan so'ng, commit yo'li blok hash, balandlik, ko'rinish va guvohlarni o'z ichiga olgan prover vazifasini taqdim etadi.

Agar yo'nalish ishlamayotgan bo'lsa yoki navbat to'liq bo'lsa, ish o'tkaziladi va odatdagidek blokni qayta ishlash davom etadi. Bu shuni anglatadiki, orqa fon prover yo'nalishi tranzaksiya qabul qilish yoki konsensus darvoza emas. Bu allaqachon amalga oshirilgan holat ustidan isbot ishlab chiqarish yo'li hisoblanadi.

Yo ' lda quyidagilardan foydalanib prover qurilgan:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` ko'rsatgichga mavjud orqa qismni tanlash imkonini beradi. `cpu` o ' rnatish uchun CPU. `gpu` afzalliklari GPU ijro etish, CPU orqa tomonda talab qilingan yadrolardan foydalanish imkoniyati bo'lmagan holda.

## Tekshirish {#verification}

FastPQ isbot tekshiruvi kanonik partiya majburiyatini qayta tiklaydi va ommaviy transkriptini almashtiradi. Tekshiruvchi protokol versiyasini, parametrlar o'rnatilgan versiyani, takrorlash cheklovlarini, izlanish majburiyatini, jamoatchi kirishlarni, namunalashtirilgan Merkle ochilishlarini, AIR ochilishlarini va FRI so'rov zanjirini tekshiradi.

Dastlabki takrorlash cheklovlariga quyidagilar kiradi:

|Chegara|Koʻrsatkichlar|
| ------------------ | ------: |
|Oʻtish qatorlari |     256 |
|Batchning foydali yuk hajmi |256 KiB |
|FRI qatlamlari |      16 |
|Savollar |     128 |

## Nexus Tekshirilgan relaylar {#nexus-verified-relays}

Nexus AXT isbot konvertlarida `AxtFastpqBinding` qo'shilishi mumkin. `RegisterVerifiedLaneRelay` bajarilganda, Iroha:

1. yo'nalish relay qoplamasi va FastPQ issiqlik materialini tekshiradi;
2. ma'lumotlar maydonini va rootni tekshiradi
3. AXT isbot qadoqchasini ko'chirish
4. `fastpq_binding` talab qiladi
5. FastPQ partiyasini o'sha bog'lanishdan qayta qurish
6. o'rnatilgan FastPQ isbotni dekodlash
7. qayta tiklangan partiya va isbot haqida FastPQ tekshiruvchini chaqiradi

Agar tekshirish muvaffaqiyatli bo'lsa, Iroha saqlash a `VerifiedLaneRelayRecord` relay ma'lumotnomasini, asl qadoqchani, isbotli yuk hashini, tekshirish balandligini, manifest ildizini o'z ichiga oluvchi va FastPQ bog'lovchi.

Lane relay zarflari ham kompakt FastPQ isbotlovchi materialni o'z ichiga oladi. Material yo'l identifikatori, ma'lumotlar maydonining identifikatori, blok balandligi, tasdiqlash balandligi, blok boshliq hash, qarorlash hash va manifest ildizidan iborat. Relay faqat QC va FastPQ tasdiqlangan materiallarga ega bo'lganida qo'shiladi.

### AXT Bog'lovchi matematika {#axt-binding-math}

Nexus AXT zarflari uchun, `AxtFastpqBinding` isbotni takrorlashdan oldin kanonikalashtirilgan. Bo'sh parametr qiymatlari andoza `fastpq-lane-balanced`; bo'sh tasdiqlovchi id va versiyasi andoza `fastpq` va `v1`; talab turi qisqartirilgan va pastga ko'paytirilgan.

AXT FastPQ ommaviy kirishlar deterministik bayt hashlari hisoblanadi:

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

AXT o'tish kalitlari quyidagilardir:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` talabnomasiga ro'yxatni qo'shish satri kiritiladi:

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

`compliance` da'vosi ikkita metadata satrini kiritadi: bittasi siyosat uchun va bittasi maqsadli ma'lumotlar maydonlari uchun.

`tx_predicate` va `value_conservation` uchun, bog'lanishda ijobiy manba yoki belgilangan miqdor mavjud bo'lganda aniq ta'sir miqdori ishlatiladi. Aks holda kod cheklangan deterministik miqdordan kelib chiqadi:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Keyin bir xil o'tkazish tenglamalari qo'llaniladi:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Sentetik jo'natgich va qabul qiluvchining hisob raqamlari asosiy urug'lardan hosil qilinadi:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Oʻtkazish partiyasi hash quyidagicha:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT partiya manifestini SHA-256 kanonik bog'lanishning Norito kodlash usulidan o'chirish:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Ochiq xabarni tasdiqlovchi hujjatlar {#sccp-transparent-message-proofs}

SCCP yordamchi qutisi ham shaffof zanjirli o'tkazib yuborilgan xabarlarni tasdiqlash uchun FastPQ dan foydalanadi. Ushbu yo'l `iroha3d` orqa fon prover yo'nalishidan ajralib turadi. U FastPQ partiyasini to'g'ridan-to'g'ri SCCP xabarni tasdiqlovchi paket va manifestdan yaratadi, so'ngra hosil bo'lgan dalilni ochiq tekshirish uchun o'rab oladi.

SCCP partiyasida `fastpq-lane-balanced` va uchta metadata o'tishi ishlatiladi:

|Ochiq |Operatsiya |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

Uning ommaviy kirish vositalari SCCP shaffof ichki isbotdan olinadi:

|FastPQ kirish |SCCP manbai |
| ------------- | ---------------------------------------------------------- |
|`dsid` |Blake2b faylining birinchi 16 baytlari bashorat hashini oʻz ichiga oladi .|
|`slot` |Yakuniylik balandligi |
|`old_root` |Faydali yuk hash |
|`new_root` |Bagʻishlanish ildizlari |
|`perm_root` |Nihoyat blok hash |
|`tx_set_hash` |Bayonot hash |

SCCP kanonik kodlovchilar to'liq sonlarni kichik xilda yozadi va o'zgaruvchan uzunlikdagi baytlar qatorlarini quyidagicha kodlaydi:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Ochiq ommaviy kirish bytlari qatorida quyidagilar mavjud:

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

shaffof baytlar - versiya, zanjir oilasi, mahalliy va qarama-qarshi domenlar, xavfsizlik modeli, quvur boshqaruvi, hisob kodeksi, yakuniylik modeli, tasdiqlovchi maqsad, tasdiqlovchi orqa tomoni oilasi, uzunlikdagi prefiks qilingan zanjir/orqa tomoni/manifest maydonlari, manzil bog'lovchi hash; hisob kodek kalitlari, foydali yukning turi, ommaviy kirish bytlari va foydali yuk hash.

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

Ushbu isbot yo'li uchun FastPQ ma'lumotlar maydonining identifikatori Blake2b digestning birinchi o'n oltita bayti hisoblanadi:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ partiyasi aniqlik bilan:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

so'ngra xuddi shu FastPQ buyurtma qoidasiga ko'ra tartibga solinadi.

OpenVerify tekshiruvchining majburiyati SHA-256 bo'yicha SCCP xabarning orqa tomoni nomi va kanonik FastPQ tekshiruvchining tavsifi:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Quru FastPQ dalil Norito-kodlangan `StarkFriOpenProofV1`, so'ngra bir `OpenVerifyEnvelope` orqa tomoni bilan `Stark`. SCCP tekshiruvi o'sha-o'sha tuzatish FastPQ to'plam va manifestdan partiya, ochiq tekshirish qadoqlagi metadatalarni tekshiradi va FastPQ qayta tiklangan partiyaning tekshiruvchisi va isbotlovchi qismlari.

## Parametrlar toʻplami {#parameter-sets}

Kanonik parametrlar katalogida ikkita parametr to'plami mavjud. Uy egasi prover yo'nalishi hozirda `fastpq-lane-balanced`dan foydalanadi.

|Parametri |Maqsad|Maydon |Hashlar |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |muvozanatli provayder oʻtkazib berish |Oltin boʻgʻimlar kvadrat kengaytmasi |Poseidon2 majburiyatlari, katalog SHA3 etiketi |8-o'rin, 8, 46 ta so'rovlar |
|`fastpq-lane-latency` |kechikish uchun sezgir yo'llar |Oltin boʻgʻimlar kvadrat kengaytmasi |Poseidon2 majburiyatlari, katalog SHA3 etiketi |16-o'rin, 16, 34 ta savollar |

Ikkalasi ham 128-bitli xavfsizlikni maqsad qilib qo'yishadi va `2^16` ning izlanish domen o'lchamidan foydalanadilar. Rust V1 transkript takrorlash kodi hozirda SHA3-256 bilan Fiat-Shamir musobaqasining bytlarini to'g'ridan-to'g'ri chaqirishning o'rniga, `iroha_crypto::Hash::new` bilan olib keladi.

Rust proveri tomonidan ishlatiladigan aniq katalog konstantalari quyidagilardir:

|Doimiy |`fastpq-lane-balanced` |`fastpq-lane-latency` |
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

## Konfiguratsiya {#configuration}

FastPQ konfiguratsiyasi `zk.fastpq` ostida o'rnatiladi.

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

O'sha o'rnatish va telemetriya etiketlarini `iroha3d` dan bekor qilish mumkin:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Konfiguratsiya maydonlari uchun ham atrof-muhit o'zgaruvchilari qo'llab-quvvatlanadi. FastPQ xususiyatiga ega bo'lgan o'zgaluvchilar quyidagilarni o'z ichiga oladi:

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

Telemetriya o'rnatib qo'yilganda FastPQ backend tanlash va Metal ish vaqti xatti-harakatini ko'rsatkichlarni eksport qiladi:

|Metrik |Maʼnosi |
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |Orqa tomoni va qurilma etiketlari boʻyicha talab qilingan va hal etilgan ijro usuli |
|`fastpq_poseidon_pipeline_total` |Soʻragan va hal qilingan Poseidon quvurining yoʻnalishi |
|`fastpq_metal_queue_depth` |Metall navbat cheklovlari, parvozda maksimal soni, jo'natish soni va namuna olish oynasi |
|`fastpq_metal_queue_ratio` |Metall navbatda mashgʻul va oʻzaro taqqoslash nisbatlari |
|`fastpq_zero_fill_duration_ms` |Metall oʻtishlari uchun toʻldirish muddati nol .|
|`fastpq_zero_fill_bandwidth_gbps` |Null toʻldirish bandwidthlari|

Umumiy ishlashni sinchkovlik qilish uchun [ Ishlab chiqarish va metrikalar ](/uz/guide/advanced/metrics.md) da ko'rsatilgan konsensus va navbat signallari bilan ularni ishlating.

## Bog'liq ma'lumot {#related-reference}

- [Ishlab chiqarilgan turning tafsilotlari uchun ma'lumotlar modeli sxemasi](/uz/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ variantlari](/uz/reference/iroha3d-cli.md#arg-fastpq-execution-mode)
