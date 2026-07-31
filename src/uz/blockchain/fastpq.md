---
translation_locale: uz
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ bo ' lmoqda Iroha- Bu STARK tanlangan ijro effektlari uchun isbot yo'li.
Oddiy tranzaksiyalarni bajarish yoki konsensusni o'rniga olmaydi.
oʻtish ISI, IVM, va Sumeragi odatdagidek; FastPQ iste'mol qiladi
deterministik ijro guvoh va qo'llab-quvvatlangan effektlarni dalilga aylantiradi
to'plamlar.

Hozirgi uy egasi integratsiyasi uchta asosiy yoʻlni oʻz ichiga oladi:

- blokni ijro etish davomida qayd etilgan shaffof raqamli aktivlar o'tkazilishi
- Nexus to'g'rilashtirilgan yo'l relaylari AXT ko'rsatkichlar qadoqchasi FastPQ
  qat'iy
- SCCP ko'rsatkichlarni o'rnatish uchun FastPQ ko'rsatkich
  ochiq tekshirish to'plamlari

## Shohidlik yo'lini o'tkazish {#transfer-witness-path}

Ochiq raqamli o ' tkazmalar tarkibiy o ' tkazish transkripti yaratadi , agar
Ta'limotlar balanslarni mutatsiya qiladi. Transkript yozuvlari:

- manba hisobvarag'i, maqsadli hisobvaraq, aktivni aniqlash va miqdori
- jo'natgich va oluvchi balanslari o'tkazilishdan oldin va keyin
- partiya hash sifatida ishlatiladigan tranzaksiya kirish nuqtasi
- taqdim etuvchi hisobdan olingan vakolatlar to'g'risida ma'lumot
- Single-delta transkripsiyalari uchun Poseidon digest

Kataklarni o'tkazish uchun bir transkriptdan ko'p deltalar ishlatiladi.
Poseidonning bitta deltalik o'lchami yo'q.

Blokni tugatishda, Iroha ushbu transkripsiyalarni kirish nuqtasi hashlari bo'yicha guruhlang.
Oʻlim guvohlari esa asl transkripsiya toʻplamlarini va
ko'rsatilgan FastPQ Prover uchun tayyorlangan o'tish partiyalari.

Har bir transfer delta ikki o'tish qatorlariga aylanadi:

| Qatlam             | O'lchov shakli                                        | Oldingi qiymat               | Qiymatdan keyingi             |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
| Jo'natgich debeti    | `asset/<asset-definition>/<source-account>`      | jo ' natuvchi balansidan oldin   | jo ' natuvchi balansidan keyin   |
| Qabul qiluvchi kredit | `asset/<asset-definition>/<destination-account>` | qabul qiluvchi balansidan oldin | qabul qiluvchi balansidan keyin |

Raqamli qiymatlar to'liq sonli guvoh birliklariga normalizatsiya qilinadi.
uchun rad etilgan FastPQ partiyalash, agar u salbiy emas deb tasvirlanishi mumkin bo'lmasa
`u64` tanlangan o'nlik skalasida.

## Davlat mablag'lari {#public-inputs}

Har bir FastPQ o'tish partiyasida dalilni
blok va ijro konteksti:

| Kiritish         | Ma'nosi                                                         |
| ------------- | --------------------------------------------------------------- |
| `dsid`        | Ma'lumotlar maydonining identifikatorini kichik baytlar sifatida kodlash             |
| `slot`        | Blok yaratish vaqti nanosekundlarga aylantiriladi                    |
| `old_root`    | O'lim guvohlaridan olingan ota-ona davlatining ildizlari            |
| `new_root`    | Oʻlim guvohlaridan kelib chiqqan post-davlat ildiz              |
| `perm_root`   | Poseidonning faol rol uchun ruxsatnomalarga bo'lgan majburiyatlari                |
| `tx_set_hash` | Sortlangan tranzaksiya va vaqtni qo'zg'atadigan kirish nuqtasi hashlari ustidan hash |

Uy egasi foydalanadi `fastpq-lane-balanced` uchun o'rnatilgan kanonik parametr sifatida
bu to'plamlar.

## Matematikaviy model {#mathematical-model}

Ushbu boʻlimda joriy Rust
Quyida barcha maydon operatsiyalari Oltin qo'rqinchlar ustida.
boshlang'ich maydon:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ Poseidon2 qo ' llanilgan `F` maydondagi vazifalar uchun.
`t = 3`, stavka `r = 2`, va quvvati `1`. Hashda maydon elementlarini oʻz ichiga oladi
2-rat bloklari va bitta maydon elementini qo'shadi `1` finaldan oldin
permutatsiya:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Byte simlari 7 bytli kichik endia a'zolariga to'ldirilgan bo'lib, har bir a'zo
qat'iy ravishda quyida `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Domenlar bilan ajratilgan maydon hashlari quyidagicha ifodalanadi:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Byte-domainlarni o'zlashtirishdan boshlanadigan hashlar uchun, FastPQ birinchi sakkizini xaritalaydi
maydonga kichik indian bytlari:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Mana `Hash` o'rtacha Iroha- Bu `iroha_crypto::Hash::new`, 32 baytli Blake2bVar
"Poseidon2" nomini formulada aniq ko'rsatilmagan holda, SHA-256.

### Maydon aritmetikasi {#field-arithmetic}

O ' zbekiston Respublikasi Rust kod maydon elementlarini kanonik sifatida ifodalaydi `u64` qiymatlari
`[0,p)`. Qo'shish va kamaytirish quyidagilardir:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

Ko'paytirish birinchi navbatda 128 bitli mahsulotni hisoblaydi:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

O'shanda oltin qo'llarni kamaytirish kimligini ishlatadi:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Agar:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

so'ngra kamaytiruvchi hisoblaydi:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

Amalga oshirish sharti bilan qo'shadi yoki kamaytiradi `p` natijasi
imzolangan to'liq sonlar, masalan, balans deltalari:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 Permutatsiya {#poseidon2-permutation}

Poseidon2 permutatsiya holati quyidagicha:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Uning S-box:

$$
S(x)=x^5
$$

FastPQ to'rtta to'liq raund, 57 qisman raund, keyin yana to'rt
to'liq turlar. To'liq to'lqin to'plamlari bilan to'la doimiy
`c_r = (c_{r,0}, c_{r,1}, c_{r,2})` quyidagicha bo'ladi:

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

Barcha qoʻshimchalar va koʻpaytirishlar `F`. Kanonik MDS matriks quyidagicha:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Hudud hashlari nol holatdan boshlanadi. har bir to'liq darajali-2 blok uchun
`(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

So'nggi blokda `1` so'nggi biridan oldin to'ldirish elementi
Permutatsiya. Ishlab chiqarish `x_0`.

### Umumiy ma'lumotlarni majburiylashtirish {#public-input-binding}

Uy egasi maʼlumotlar maydonining identifikatorini oʻz `u64` birinchi qiymatga
16 baytli maydonning sakkiz kichik endiya byti:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Blok yaratish vaqti millisekundlardan nanosekundlarga aylanadi:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Transaksiya-qo'yilgan hash - bu sinflashtirilgan kirish nuqtasi ustidan byte domen hashidir
hashlar:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

qaerda `h_i` tartiblangan tranzaksiya va vaqtni qo'zg'atadigan kirish nuqtasi hashlari.
ochiq dalil IO, agar `perm_root` yoki `tx_set_hash` barchasi nol bo'lsa,
Prover fallback qiymatlarini toʻldiradi:

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

Har bir transfer delta uchun maqsadli o'nlik skala maksimal kesilgan
miqdori bo'ylab o'lchash va balansdagi ikki surat:

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

A `Numeric` mantissa bilan qiymat `m` va o'lcham `q` faqat
`m >= 0` va `q <= s`. Uning FastPQ guvohning qiymati:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Normallashtirilgan natija `u64`.

### Kanonik tartibga solish {#canonical-ordering}

Izlanishdan oldin partiya o'tish kalitlari, ishlashga qarab sinflanadi.
rang va asl qo'shish indekslari:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

Buyurtma majburiyati domen ustidan Poseidon2 maydoni hash hisoblanadi
`fastpq:v1:ordering` va Norito sinflashtirilgan o'tishlarni kodlash:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

qaerda `P` 7 baytli paket, `E` bo ' lmoqda Norito kodlash, `D_o` bo ' lmoqda
`fastpq:v1:ordering`, va `T*` bu tartiblangan o'tish ro'yxati.

### Transfer tenglamalari {#transfer-equations}

Oʻtkazish summasi uchun `a`, jo'natgichning balansini `f`, va oluvchi balans `t`,
FastPQ izni yaratishdan oldin normalizatsiya qilingan guvoh qiymatlarini tasdiqlaydi:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Keyin oʻtish satrlari kodlanadi:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

Izlar ichida imzolangan deltalar `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

O'z navbatida, bitta delta o'tkazuvchi to'g'rilash kodlangan transferni amalga oshiradi.
oldindan ko'rinish:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Ko'p delta uzatish transkriptlari uchun joriy format quyidagi talabni bajaradi:
yuqori darajadagi o'lchami yo'q bo'lishi.

Transfer transkripsiyalari uchun qabul qiluvchi organni iste'mol qilish:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Izlar qatorlari {#trace-rows}

Oʻtish roʻyxatini toʻgʻrilash `n` haqiqiy qatorlar. iz uzunligi
ikkinchisining keyingi kuchi:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

Satrlar `0..n-1` faol; qatorlar `n..N-1` har bir haqiqiy qatorda
bir operatsion selektor set:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Barcha tanlovchi ustunlari boʻl:

$$
s(s-1)=0
$$

Ruxsatlarni qidirish satrlari to'g'ri rol berish va roli bekor qilish satrlaridir:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Raqamli operatsiyalar qatorlari uchun:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Quruvchi shuningdek , har bir aktiv uchun ishlaydigan deltalarni kuzatadi:

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

Metadata va ma'lumotlar maydonining izlari ustunlari qatordan oldin hosil bo'lgan maydon hashlaridir
materiallashtirish:

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

Metadata hash, ma'lumotlar maydonining hash va slot qo'shni joylarda barqaror
izlar qatorlari:

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

O'tkazuvchi satrlar 32 darajali kamroq Merkle yo'nalishini olib boradi.
yo'q bo'lganda, prover qator kalitidan deterministik yo'lni sintezlaydi;
oldindan muvozanat, va qator jo'natgich yoki qabul qiluvchi tomonmi.

Sintetik yo'nalishlar uchun aromat tuzlari `fastpq:smt:from` jo'natgich satrlari uchun
va `fastpq:smt:to` Qabul qiluvchi satrlar uchun:

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

Sinthetik barg va ichki nodlar:

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

Izlar bitni qayd etadi . `b_l`, qarindosh `s_l`, kirish tugmasi `x_l`, va
chiqindi nodasi `x_{l+1}` har bir darajadagi. Kodeksning bo'limi konvensiyasi bilan:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Ruxsatlar hashlari {#permission-hashes}

Roli berish va bekor qilish satrlari ruxsat guvohini hash qilish:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Xost ruxsatlari jadvali ilovalarni rola bytlari, ruxsatlar boʻyicha turadi
bytes va epoch bytes, keyin Poseidon2 Merkle daraxtini quradi:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

O'zgacha kenglik darajasi oxirgi elementni takrorlaydi.

### O'z izini yo'qotish {#trace-commitment}

Har bir iz ustuni uchun `c`, FastPQ birinchi navbatda ustun qiymatlarini interpollaydi
izlar domeni va hashlar koeffitsiyent vektorlari:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

Orqa ildiz Poseidon2 Merkle ildizi ustun majburiyatlari ustidan:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Oxirgi izlanish majburiyati domen, parametrlar to'plami bo'yicha bayt hashidir.
orzu shakli, ustun o'lchovlari va orzu ildizlari:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

qaerda `D_c` bo ' lmoqda `fastpq:v1:trace_commitment`.

### AIR tarkib {#air-composition}

O ' zbekiston Respublikasi V1 AIR tarkib qiymati qator-o'rinli qoldiqlarning chiziqli kombinatsiyasi hisoblanadi.
Transkript namunalari ikkita qiyinchilikni koʻrsatadi:

$$
\alpha_0,\alpha_1 \in F
$$

Har bir yonma-yon qator juftligi uchun `(i,i+1)`, provator quyidagilarni hisoblaydi:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Qoldiqlar `rho` kod tartibida:

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

Raqamli ustunlar bilan qatorlar uchun:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

Va barchasining barqaror kontekst ustunlari uchun:

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

Verifikator qayta hisoblaydi `A_i` namuna ko'rib chiqilgan qatorning ochilishlari va uni tekshirish
muvofiq majburiyatlar qabul qilingan tarkib qiymatidan AIR tarkib Merkle
ildiz.

### Qidiruv mahsulotlari {#lookup-product}

Ruxsatlarni qidirish akkumulyatorida Fiat-Shamir musobaqasidan foydalaniladi `gamma`.
O ' zbekiston Respublikasining "O'zbekiston Respublikasi `s_perm` va `perm_hash`, ko'rsatilgan
ishlaydigan mahsulot:

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

Dasturiy hujjatlar:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Kam darajadagi kengaytma {#low-degree-extension}

Qoʻyib yuborish `omega_T` izlanish domenlari ishlab chiqaruvchisi bo'lish, `omega_E` ko'rsatilgan
baholash domenlari ishlab chiqaruvchisi va `g` konfiguratsiya qilingan koset offseti.
qiymatlarga ega bo'lgan iz ustuni `v_i`, interpolash koeffitsiyentlarni hosil qiladi `a_j`
quyidagicha:

$$
f(\omega_T^i)=v_i
$$

Past darajali kengaytma kosetdagi bir xil polinomni baholaydi:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

Amalga oshirish bu koefitsientlarni
avvalgi koset kompensatsiyasi FFT:

$$
a'_j = a_j g^j
$$

va keyin baholash `a'` baholash sohasiga.

O ' zbekiston Respublikasi CPU FFT bu iterativ radix-2 Cooley-Tukey transformasi
Bit-o'zgartirilgan kirishlar. `L`, yarim uzunlik `H=L/2`, va bosqich
ildiz:

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

Aksincha FFT bilan bir xil transformatsiya o'tadi `omega^{-1}` va o'lchovlar bilan
Inversal domen o'lchami:

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

So ' ng LDE, FastPQ har bir satr boʻylab hashlar LDE ustunlar uchun `m` ustunlar:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Agar satr hashlari baholashdan koʻra iz domenida boʻlsa
domen, provr interpolatsiya qiladi va ushbu bitta satr hash ustunini kengaytiradi
bir xil koset bilan LDE jarayon.

### Merkle ochilishlari {#merkle-openings}

LDE qiymatlar quyidagi qismlarga to'planadi:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Har bir barg daraxti quyidagicha:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Merklning ota-onasi:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

O'zgacha darajalar oxirgi nodni takrorlaydi. So'rov yo'llari chap yoki
har bir darajadagi so'rov varaqlari indeksining paritetiga muvofiq.

Ko'rsatkichdagi varaq uchun `i`, yo'l `(s_0,\ldots,s_{d-1})` to'g'rilash
ildiz `R` takrorlanishi bilan:

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

Tekshirish faqat quyidagi hollarda amalga oshiriladi:

$$
y_d=R
$$

AIR izlar qatorli barglar quyidagicha:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR tarkibiy barglar quyidagicha:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

O ' zbekiston Respublikasi LDE soʻrovni ochish shuningdek baholash indeksida ochilgan qiymatning aniqlanishini tekshiradi
`i` tasdiqlangan qismida mavjud:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Qatish {#fri-folding}

FRI majburiyatlarini amalga oshiradi AIR tarkib baholash. Har bir tur uchun `l`, ko'rsatilgan
transkript namunalari qiyinchilik `beta_l`. qatlam koʻpga toʻldirilgan
har bir ariti o'lchamli guruh quyidagicha bo'ladi:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

qaerda `a` bu FRI arity. Tekshiruvchi har bir namuna ko'rsatilgan so'rov uchun tekshiradi
zanjir, bu:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

va har bir ochilganni tasdiqlaydi FRI tegishli guruhga qarshi FRI qatlam
ildiz.

### Fiat-Shamir transkripti {#fiat-shamir-transcript}

Kanonik parametrlar katalog transkript hashni SHA3-256.
Hozirgi prover va tekshiruvchining joriy etilishi bilan muammo bytlari
`iroha_crypto::Hash::new`, bu 32 baytli Blake2bVar digest, so'ngra
birinchi sakkiz kichik indian byetlarini `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Muammo qo'ng'iroqlari transkript holatiga to'liq o'qishni qo'shadi.
tartib quyidagicha:

1. jamoatchilik IO, protokol versiyasi, parametr versiyasi va parametr nomi
2. LDE ildiz va izlar ildiz
3. `gamma`
4. AIR tarkibdagi muammolar `alpha_0`, `alpha_1`
5. AIR orzu ildiz va AIR tarkibiy ildiz
6. buyuk mahsulot qidirish
7. FRI qatlam ildizlari va `beta_l` qiyinchiliklar
8. namuna ko'rsatkichlari

So'rov namunalarini olish 32 baytli musobaqalarni chizadi va ularni quyidagicha o'qiydi:
kichkinagina yirtqich `u64` talab qilingan yagona raqamga ega bo'lguncha
indekslar:

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

Shuningdek , u jamoatchilikni tiklaydi . IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Har bir maydon isbotning ommaviyligi bilan mos kelishi kerak IO Baytga bayt.
so'ngra o'sha transkriptni qayta tiklaydi va aynan shunga erishadi:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Har bir namunaviy soʻrov uchun `q`, quyidagilarni tekshiradi:

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

O ' zbekiston Respublikasi AIR tarkibning ochilishi tasdiqlanishi kerak `R_air_composition`.
O ' zbekiston Respublikasi FRI zanjir keyin bir xildan boshlanadi `A_q` va oxirida
tasdiqlangan yakuniy FRI terminal ostidagi barg FRI ildiz.

## O'sha o'g'il nimalarni tekshiradi? {#what-the-prover-checks}

Izohlarni yaratishdan oldin, FastPQ prover partiya tartibini kanonikalashtiradi
O'zgarish kalit, operatsion daraja va qo'shish tartibi bo'yicha
transkripsiya metadatalarini talab qiladi. Transfer satrlari bo'lgan, lekin transfer yo'q partiya
transkripsiyalari haqiqiy emas.

O'tkazish transkripsiyalari bo'yicha provayderlar tomonidan tekshiruvlar quyidagilarni o'z ichiga oladi:

- jo'natgichning balansini past oqish mumkin emas
- `sender_after` teng bo'lishi kerak `sender_before - amount`
- `receiver_after` teng bo'lishi kerak `receiver_before + amount`
- transkripsiya partiyadagi har bir o'tkazish satrini qamrab oladi
- bitta deltadagi "Poseidon" o'chirib tashlanishi, agar mavjud bo'lsa, transkript bilan mos kelishi kerak
  oldindan koʻrinish
- agar kamroq-Merkle dalillari 1 versiyasi sifatida dekodlash kerak bo'lsa; yo'qolgan yo'llar
  deterministik sintetik dalillar bilan to'ldirilgan

Izda o'tish, mint, yoqish, rol berish uchun selektor ustunlari mavjud.
ro'llarni bekor qilish, metadatalar to'plami va ruxsatnoma qidirish satrlari.
qatorlar ham imzolangan deltalarni olib boradi, har bir aktiv uchun deltalarni o'tkazadi va ta'minlaydi
hisoblagichlar.

## Prover Lane {#prover-lane}

`irohad` boshlaydi FastPQ Provor yo'nalishi ishga tushirilganda agar provor orqa tomoni mumkin bo'lsa
yo'nalish bo'lishi kerak. Yo'nalish cheklangan navbat bilan tugma vazifa hisoblanadi.
blok ijro guvohini ishlab chiqaradi, jinoyat yo'li provayder ishini taqdim etadi
blok hash, balandlik, ko'rinish va guvohni o'z ichiga oladi.

Agar yo'nalish ishlamayotgan bo'lsa yoki navbat to'liq bo'lsa, ish tashlanadi va
Oddiy blokni qayta ishlash davom etadi.
Transaksiya qabul qilish yoki konsensus portasi emas.
allaqachon amalga oshirilgan davlat bo'ylab yo'l.

Yo ' lda:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` provaytorga mavjud bo'lgan orqa qismni tanlash imkonini beradi. `cpu` pinlarni ijro etish
to'g'risida CPU. `gpu` afzalliklari GPU ijro etish, CPU o'tish
orqa tomondan talab qilingan yadrolardan foydalanish mumkin emas.

## Tekshirish {#verification}

FastPQ dalillarni tasdiqlash kanonik partiya majburiyatlarini qayta tiklaydi va
ommaviy transkriptni qayta tiklaydi. Tekshiruvchi protokol versiyasini tekshiradi,
parametrlar to'plami versiyasi, takrorlash cheklovlari, izlanish majburiyatlari, jamoatchilik kiritish;
Merkle ochqichlarining namunalari, AIR ochilishlar va FRI so'rovlar zanjiri.

Dastlabki takrorlash cheklovlariga quyidagilar kiradi:

| Chegara              | Oldindan ko'rsatilgan |
| ------------------ | ------: |
| Oʻtish satrlari    |     256 |
| Kataklik faydali yuk hajmi | 256 KiB |
| FRI qatlamlar         |      16 |
| Savollar ochiladi     |     128 |

## Nexus Tekshirilgan relaylar {#nexus-verified-relays}

Nexus AXT ko'rsatkichli zarflar `AxtFastpqBinding`. Qachon
`RegisterVerifiedLaneRelay` ijro etadi, Iroha:

1. yo'nalish relayini tekshiradi va FastPQ dalil materiallari
2. ma'lumotlar maydonini va manifest ildizini tekshiradi
3. kodlash AXT ko'rsatkichlar qadoqoti
4. talab qiladi `fastpq_binding`
5. qayta tiklaydi FastPQ bu bog'lanishdan olingan partiya
6. oʻrnatilgan FastPQ dalillar
7. qoʻngʻiroq FastPQ qayta tiklangan partiya va isbotlovchi tekshiruvdan

Agar tekshirish muvaffaqiyatli bo'lsa, Iroha saqlaydi `VerifiedLaneRelayRecord`
relay ma'lumotnomasini, asl qadoqchani, ishlov beruvchi yukni hashini o'z ichiga olgan;
tekshiruv balandligi, aniq ildiz va FastPQ bog'lovchi.

Yo'l relay zarflari ham kompakt FastPQ dalil material. Material
yo'nalish identifikatori, ma'lumotlar maydonining identifikatori, blokning balandligi, tasdiqlash
balandlik, blok sarlavhasi hash, qarorlar hash va manifest ildiz.
qo'shilishi faqat ikkala QC va haqiqiy FastPQ dalillar
material.

### AXT Ma'rifiy matematika {#axt-binding-math}

uchun Nexus AXT qovushlari, `AxtFastpqBinding` dalildan oldin kanonikalashtirilgan
Oʻynash. Boʻsh parametr qiymatlari andoza `fastpq-lane-balanced`; boʻsh
Verifikator ID va versiyasi andoza `fastpq` va `v1`; talabnoma turi kesilgan
va pastga tushirilgan.

O ' zbekiston Respublikasi AXT FastPQ ommaviy ma'lumotlar deterministik bayt hashlaridir:

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

O ' zbekiston Respublikasi `authorization` talabnoma ro'yxatini qo'shadi:

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

va ruxsat berish siyosatini bog'lovchi metadotlar satri. `compliance` talabnoma
ikki metadata satrini kiritadi: biri siyosat uchun va bittasi maqsadli ma'lumotlar sohasi uchun.

uchun `tx_predicate` va `value_conservation`, aniq effekt miqdori:
Bog'lashda ijobiy manba yoki belgilangan miqdor mavjud bo'lganda ishlatiladi.
Aks holda kod cheklangan deterministik miqdorni keltirib chiqaradi:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Soʻngra bir xil oʻtkazish tenglamalari ishlatiladi:

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

Oʻtkazish partiyasi hash:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

O ' zbekiston Respublikasi AXT partiya manifest digest SHA-256 koʻrsatkich Norito kodlash
kanonik bog'liqlik:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Xabarning shaffofligi {#sccp-transparent-message-proofs}

O ' zbekiston Respublikasi SCCP yordamchi qutisi ham ishlatiladi FastPQ shaffof zanjirli o'tkazib yuborilgan xabar uchun
Ushbu yo'l `irohad` orqa tomondan provayder yo'nalishi.
bir FastPQ to'g'ridan-to'g'ri SCCP xabarlarni tasdiqlovchi paket va
manifest, so'ngra aniqlangan dalilni ochiq tekshirish uchun o'rab oladi.

O ' zbekiston Respublikasi SCCP partiyalar uchun foydalanish `fastpq-lane-balanced` va uchta metadata o'tishi:

| Ochiq                             | Operatsiya |
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

Uning ommaviy mablag'lari SCCP shaffof ichki isbot:

| FastPQ kirish  | SCCP manbai                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        | Blake2b-ning birinchi 16 baytlari hash so'z ustida o'tkazilgan |
| `slot`        | Yakuniylik balandligi                                            |
| `old_root`    | Faydali yuk hash                                               |
| `new_root`    | Bandlik ildizlari                                            |
| `perm_root`   | Oxirgi blok hash                                        |
| `tx_set_hash` | Maʼlumotlar hash                                             |

O ' zbekiston Respublikasi SCCP kanonik kodlovchilar kichik-endian to'liq sonlarni yozadi va kodlash
O'zgaruvchan uzunlikdagi bytlar jadvallari:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Ochiq ommaviy kirish bytlari satri quyidagicha:

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

Oydin baytlar versiyaning, zanjirning birlashtirilishi
oilaviy, mahalliy va to'lovchilar domenlari, xavfsizlik modeli, negiz boshqaruv;
hisob kodeksi, yakuniylik modeli, tekshiruvchining maqsadi, tekshiruvning orqa tomoni oilasi;
uzunlikdagi prefiksli zanjir/tushkun/manifest maydonlari, yo'nalish bilan bog'liq hash;
hisob kodek kalit, foydali yukning turi, ommaviy kirish bytlari va foydali yuk hashini.
ma'lumotlar hash quyidagicha:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

O ' zbekiston Respublikasi FastPQ Ushbu isbot yo'li uchun ma'lumotlar maydonining ID birinchi o'n olti bayt hisoblanadi
yana bir Blake2b prefiksli o'lchov:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

O ' zbekiston Respublikasi SCCP FastPQ partiya toʻgʻri:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

so'ngra xuddi shunday tartib bilan FastPQ buyruq qoidasi.

O ' zbekiston Respublikasi OpenVerify tekshiruvchining majburiyatlari SHA-256 koʻrsatkich SCCP xabarning orqa tomoni
nom va kanonik FastPQ tekshiruvchi tavsifi:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Xumush FastPQ dalil Norito-kodlangan `StarkFriOpenProofV1`, keyin
toʻplamga oʻralgan `OpenVerifyEnvelope` orqa tomoni bilan `Stark`. SCCP tekshiruvi
o'sha-o'shani tiklaydi FastPQ to'plam va manifestdan partiya, tekshiruv
ochiq tekshirish qadoqlari metadatalar va chaqirish FastPQ tekshiruvchining
qayta qurilgan partiya va dalil.

## Parametrlar toʻplami {#parameter-sets}

Kanonik parametrlar katalogida ikkita parametr to'plami mavjud.
prover lane hozirda ishlatiladi `fastpq-lane-balanced`.

| Parametr              | Maqsad                    | Maydon                          | Xashlar                                      | FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` | muvozanatli provayver o'tkazib berish | Oltin qo'rqinchli kvadrat kengaytmasi | Poseidon2 majburiyatlari, katalog SHA3 etiketasi | 8-o'rin, 8 ta so'rovlar   |
| `fastpq-lane-latency`  | kechikish uchun ehtiyotkor yo'llar    | Oltin qo'rqinchli kvadrat kengaytmasi | Poseidon2 majburiyatlari, katalog SHA3 etiketasi | 16 ta savollar |

Ikkalasi ham 128-bitli xavfsizlikni maqsad qilib qoʻyish va domen oʻlchamidan foydalanish `2^16`. O ' zbekiston Respublikasi
Rust V1 Transkriptni takrorlash kodi hozirda Fiat-Shamir musobaqasidan kelib chiqadi
bilan bytlar `iroha_crypto::Hash::new` to'g'ridan-to'g'ri murojaat qilishning o'rniga
SHA3-256.

Kataloqning aniq konstantalari Rust Provorlar quyidagicha:

| Doimiy             | `fastpq-lane-balanced` | `fastpq-lane-latency` |
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

## Konfiguratsiya {#configuration}

FastPQ konfiguratsiya ostida joylashtirilgan `zk.fastpq`.

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

O'sha ijro va telemetriya etiketlari `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

Konfiguratsiya maydonlari uchun ham atrof muhit o'zgaruvchilari qo'llab-quvvatlanadi.
FastPQ-o'ziga xos o'zgaruvchilar quyidagilarni o'z ichiga oladi:

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

Telemetriya o'rnatilganda, FastPQ eksport qilish bilan bog'liq tarkibiy qismlarni tanlash va
Metal ish vaqti xatti-harakati:

| Metrik                            | Ma'nosi                                                                     |
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     | So'ragan va hal qilingan ijro etish usuli, orqa tomoni va qurilma etiketlari bo'yicha          |
| `fastpq_poseidon_pipeline_total`  | So'ragan va hal qilingan Poseidon quvurlari yo'li                               |
| `fastpq_metal_queue_depth`        | Metall navbat cheklovlari, parvozda maksimal soni, jo'natish soni va namuna olish oynasi |
| `fastpq_metal_queue_ratio`        | Metall navbatdagi mashg'ulotlar va o'zaro taqqoslash nisbatlari                                         |
| `fastpq_zero_fill_duration_ms`    | Metallga o'tish uchun mezbonning to'ldirish muddati nol                                      |
| `fastpq_zero_fill_bandwidth_gbps` | Chiqarilgan nol to'ldirish bandliligi                                                 |

Umumiy ishlashni sinash uchun ularni konsensus va navbat bilan ishlating
ushbu Nizomda keltirilgan signallar [Ishlab chiqarish va o'lchovlar](/uz/guide/advanced/metrics.md).

## Tegishli ma'lumot {#related-reference}

- [Ma'lumotlar modeli sxemasi](/uz/reference/data-model-schema.md) ishlab chiqarilgan tur uchun
  tafsilotlari
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ variantlar](/uz/reference/irohad-cli.md#arg-fastpq-execution-mode)
