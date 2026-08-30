---
translation_locale: az
translation_source: /blockchain/fastpq.md
translation_source_hash: 55b57e6aeeef2aefa1c8359d9b9487029b106eaebed12a58268b61dc583e97f6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ seçilmiş icra effektləri üçün Iroha'ın STARK sübut yoludır. Normal əməliyyat icrasını və ya konsensusunu əvəz etmir. Əməliyyatlar hələ də normal olaraq ISI, IVM və Sumeragi vasitəsilə aparılır; FastPQ deterministik icra şahidini istehlak edir və dəstəklənmiş təsirləri sübut partiyalarına çevirir.

Hal-hazırda aparıcı inteqrasiya üçün üç əsas yol var:

- Blok icrası zamanı qeydə alınmış şəffaf rəqəmli aktiv köçürülməsi
- AXT sübut qovusunda FastPQ bağlayıcı olan Nexus təsdiqlənmiş zolaq relələri
- SCCP açıq yoxlama zarfında bir FastPQ sübutu əhatə edən şəffaf mesajı təsdiqləyən köməkçilər

## Şahidlik yolunun köçürülməsi {#transfer-witness-path}

Şəffaf rəqəmsal köçürmələr göstərici balansları mutasiya edərkən strukturlaşdırılmış köçürmə transkriptini yaratır.

- mənbə hesabı, hədəf hesabı, aktivlərin təyinatı və məbləği
- ötürülmədən əvvəl və sonra göndərən və qəbul edənlərin balansları
- Satış giriş nöqtəsi hash kimi istifadə edilən hash
- təqdim olunan hesabdan alınan səlahiyyətli şəxslər siyahısı
- Single-delta transkripsiyaları üçün bir Poseidon digest

Satış transferləri bir transkriptdən ibarətdir, bu halda Poseydonun tək-deltalı həzminin olmaması mümkündür.

Block finallaşdırıldıqda, Iroha bu transkripsiyaları giriş nöqtəsi hash ilə qruplaşır. İcraçı şahid sonra həm orijinal transkript paketlərini, həm də prover üçün hazırlanmış FastPQ keçid partiyalarını daşıyır.

Hər bir transfer delta iki keçid xətti olur:

|Sətir |Əsas forma |Əvvəlki qiymət|Qiymətdən sonra |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Göndəricilərin ödənişi |`asset/<asset-definition>/<source-account>` |göndəricinin balansı əvvəl |göndərən balansdan sonra |
|Alıcı kreditləri |`asset/<asset-definition>/<destination-account>` |əvvəlki alıcı balansı |receiver balansı |

Rəqəmsal dəyərlər tam say şahid vahidlərinə normallaşdırılır. Seçilmiş onluq miqyasında mənfi olmayan `u64` olaraq təmsil edilə bilmədiyi təqdirdə bir qiymət FastPQ seriyası üçün rədd edilir.

## İctimai girişlər {#public-inputs}

Hər bir FastPQ keçid partiyasında sübutun blok və icra kontekstinə bağlanmasını təmin edən ictimai girişlər var:

|Giriş |Məna|
| ------------- | --------------------------------------------------------------- |
|`dsid` |Məlumat sahəsinin identifikatoru kiçik bayt kimi kodlanmışdır |
|`slot` |Block yaratma vaxtı nanosecondlara çevrildi |
|`old_root` |Valideyn dövlətinin kökü icra şahidindən alınmışdır .|
|`new_root` |Dövlətdən sonra işgəncə şahidindən alınan kök .|
|`perm_root` |Poseidonun aktiv rol icazələri ilə bağlı öhdəliyi |
|`tx_set_hash` |İşləmə və giriş nöqtələrinin hashləri üçün vaxt aktivləşdirilməsi .|

Ev sahibi bu partiyalar üçün `fastpq-lane-balanced` kanonik parametr olaraq istifadə edir.

## Riyaziyyat modeli {#mathematical-model}

Bu bölmədə mövcud Rust proveri və təsdiqçisi tərəfindən tətbiq olunan aritmetika təsvir olunur. Aşağıdakı bütün sahə əməliyyatları Goldilocks ilk sahəsi üzərindədir:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ sahə öhdəlikləri üçün Poseidon2-dən `F` istifadə edir. süngerin eni `t = 3`, dərəcəsi `r = 2` və qabiliyyəti `1` var. Haş-2 bloklarında sahə elementlərini ələ alır və son permutasiyadan əvvəl bir sahə elementi `1` əlavə edir:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Bayt silsilələri 7 bayt kiçik ədəd ədədlərinə paketlənir, belə ki hər bir ədəd `p` -dən aşağıdır:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Domen bölünmüş sahə hashləri aşağıdakı kimi təmsil olunur:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Byte-domain digestlərindən başlayan hashlər üçün, FastPQ ilk səkkiz kiçik indian bytesini sahəyə xəritələyir:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Burada `Hash` Iroha-nin `iroha_crypto::Hash::new` 32-bayt Blake2bVar digestini ifadə edir, əgər formula açıq şəkildə Poseidon2 və ya SHA-256 adlarını göstərməsə.

### Sahə aritmetikası {#field-arithmetic}

Rust kodu sahə elementlərini `[0,p)` kanonik `u64` dəyərləri kimi təmsil edir. Əlavə və azalma aşağıdakılardır:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

Əksiləmə əvvəlcə 128 bit məhsulu hesablayır:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Goldilocks azaldılması sonra kimliyi istifadə edir:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Əgər:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

O zaman azaldıcı hesablayır:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

Əməliyyat şərti olaraq `p` əlavə və ya çıxarır, nəticə kanonik olana qədər. İmzalanmış tam rəqəmlər, məsələn balans deltaları:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 Permutasiyası {#poseidon2-permutation}

Poseidon2 permutasiyasının vəziyyəti belədir:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Onun "S-box"u:

$$
S(x)=x^5
$$

FastPQ dörd tam mərhələ, 57 qismli mərhələ və sonra daha 4 tam mərhələnin istifadə edilməsi. `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` aşağıdakılardır:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

Ayrı mərhələ:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Bütün əlavələr və qatlamalar `F` ilədir. Kanonik MDS matris:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

sahə hash sıfır vəziyyətdən başlayır. hər tam dərəcə-2 blok üçün `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

Son blok `1` döşəmə elementini son bir dəyişiklikdən əvvəl əlavə edir. Nəticə `x_0`.

### İctimaiyyət girişinin bağlanması {#public-input-binding}

Ev sahibi `u64` dəyərini 16-bayt sahəsinin ilk səkkiz kiçik indian baytlarına yazaraq məlumat məkanı idini kodlayır:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Blokun yaradılması vaxtı millisekundlardan nanosekundlara çevrilmişdir:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Transaction-set hash sıralanmış giriş nöqtəsi hashləri üzərində byte-domain hashidir:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

`h_i` sıralanmış əməliyyat və vaxt tetikləyici giriş nöqtəsi hashləri olduğu yerdə. İctimai sübutda IO, əgər `perm_root` və ya `tx_set_hash` hamısı sıfırdırsa, prover geri dönüş dəyərlərini doldurur:

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

### Rəqəmsal normallaşdırma {#numeric-normalization}

Hər bir transfer deltası üçün hədəf onluq miqdarı məbləğin və hər iki balans sürətləndirilməsi üzrə maksimum kəsilmiş miqdardır:

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

A `Numeric` mantissa ilə qiymət `m` və ölçüsü `q` yalnız qəbul edilir `m >= 0` və `q <= s`. Onun FastPQ şahid dəyəri:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Normallaşdırılmış nəticə `u64` ilə uyğunlaşmalıdır.

### Kanonik əmrlər {#canonical-ordering}

İzləmə quruluşundan əvvəl partiya keçid açarı, əməliyyat rütbəsi və orijinal yerləşdirmə indeksinə görə sıralanır:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

S sortlama öhdəliyi, `fastpq:v1:ordering` domeninin və Norito sıralanmış keçidlərin kodlaşdırılması üzərində Poseidon2 sahə hashidir:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

`P` 7 baytlıq paketləşmə, `E` Norito kodlaşması, `D_o` `fastpq:v1:ordering` və `T*` sıralanmış keçid siyahısı olduğu yerlərdə.

### Transfer tənlikləri {#transfer-equations}

Transfer məbləği üçün `a`, göndəricinin balansı `f`, və alıcı balansı `t`, FastPQ izini qurmadan əvvəl normallaşdırılmış şahid dəyərlərini təsdiqləyir:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

O zaman keçid sıraları kodlaşdırılır:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

Ardından, imzalanmış delta `F` olaraq azaltılır:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

Qeyri-müəyyən single-delta transfer digest kodlaşdırılmış köçürülmə preimage edir:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Mülti-delta köçürmə transkripsiyaları üçün mövcud formatda bu ən yüksək səviyyəli məzmunun olmaması tələb olunur.

Ödəniş transkripsiyaları üçün ev sahibi səlahiyyətli şəxslər aşağıdakılardır:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### İzləmə sıraları {#trace-rows}

Sortlaşdırılmış keçid siyahısında real sıralar `n` olsun.

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

`0..n-1` sətirləri aktivdir; `n..N-1` sətirləri doldurma sətiridir. Hər real sətirdə bir əməliyyat seçicisi seti vardır:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Bütün seçicisi sütunları Boolean:

$$
s(s-1)=0
$$

İzin axtarış sətirləri rol verilməsi və rol ləğv edilməsi sətiridir:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Rəqəmli əməliyyat sətirləri üçün:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

İnşaatçı həmçinin hər aktiv üçün işləyən deltaları izləyir:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Yalnız mint və yanma sıraları təchizat hesabını yeniləyir:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Metadata və məlumat məkanının iz sütunları sətir materiallaşmadan əvvəl alınan sahə hashləridir:

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

Metadata hash, məlumat məkanı hash və boşluq bitişik iz sıralarında sabitdir:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Merkle sütunlarını köçürmək {#transfer-merkle-columns}

Transfer sətirləri 32 səviyyəli nadir Merkle yolunu daşıyır. Əgər bir host sübutı yoxdursa, prover sətir açarından, pre-balansdan və sətirin göndərən və ya qəbul edən tərəfdən olub olmadığını müəyyənləşdirən bir yolun sintezini aparır.

Sentetik yollar üçün ləzzət duzları `fastpq:smt:from` göndərən sətirlər və `fastpq:smt:to` qəbul edən sətirlər üçün:

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

Sentetik yarpaq və daxili düyünlər aşağıdakılardır:

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

İz bitini qeyd edir. `b_l`, qardaşı `s_l`, Giriş nodu `x_l`, və çıxış dərəcəsi `x_{l+1}` Kodun şöbə konvensiyası ilə:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Rəsmi hashlar {#permission-hashes}

Rolu verilən və ləğv olunan sətirlər icazə şahidini hash edir:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Qonaq icazəsi cədvəlinin kökü girişləri rol baytları, icazə baytları və epox baytları üzrə sıralayır, sonra Poseidon2 Merkle ağacını qurur:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Odd-width səviyyələri son elementini təkrarlayır.

### İzləmə öhdəliyi {#trace-commitment}

Hər bir iz sütunu üçün `c`, FastPQ əvvəlcə iz domeni üzərində sütun dəyərlərini interpolayır və koefitsiyent vektorunu hash edir:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

İz kökləri sütun öhdəlikləri üzərində Poseidon2 Merkle köküdür:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Son izləmə öhdəliyi domen, parametrlər dəstinin, iz şəklinin, sütun həzmlərinin və iz kökünün üzərində bir bayt hashidir:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

`D_c` - `fastpq:v1:trace_commitment` olduğu yerdə.

### AIR tərkibi {#air-composition}

V1 AIR tərkibi qiyməti sətir lokal qalıqların xətti bir kombinasiyadır. Transkript nümunələri iki çətinlik çəkir:

$$
\alpha_0,\alpha_1 \in F
$$

Hər bir qonşu sıra cütlüyü üçün `(i,i+1)`, prover hesablayır:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Qalanlar `rho`, kod sırası ilə:

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

Rəqəmli sütunlu sətirlər üçün:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

Və sabit partiya kontekst sütunları üçün:

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

Təyinatçı `A_i` nümunə alınan sətir açılışları üçün yenidən hesablayır və onu AIR tərkibi Merkle kökü ilə öhdəlik götürən kompozisiya dəyəri ilə müqayisə edir.

### axtarış məhsulu {#lookup-product}

Rəsmi axtarış akkumulyatorunda Fiat-Shamir çətinliyi `gamma` istifadə olunur. `s_perm` və `perm_hash` nisbətən aşağı dərəcəli uzantı qiymətləndirmələri zamanı, işləyən məhsul:

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

Əldə edilən sənədlər:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Düşük dərəcəli genişlənmə {#low-degree-extension}

`omega_T` iz domeninin generatoru, `omega_E` qiymətləndirmə domeninin jeneratoru və `g` konfiqurasiyalı coset offseti olsun. `v_i` dəyərləri olan iz sütunu üçün interpolassiya `a_j` koeffitsiyentlərini belə verir:

$$
f(\omega_T^i)=v_i
$$

Aşağı dərəcəli uzantı kosetdə eyni polinomiyanı qiymətləndirir:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

Tədbir bunu FFT əvvəllər koset kompensasiyasının səlahiyyətləri ilə koefitsiyentlərin qatılması ilə hesablayır:

$$
a'_j = a_j g^j
$$

və sonra qiymətləndirmə sahəsində `a'` qiymətləndirilməsi.

İndiki CPU FFT bit-inversed giriş üzərində bir iterativ radix-2 Cooley-Tukey transformasıdır. `L`, Yarım uzunluq `H=L/2`, və mərhələ kök:

$$
\omega_L=\omega^{N/L}
$$

Hər bir kəpənək hesablayır:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

Əksinə FFT `omega^{-1}` ilə eyni transformasiyanı həyata keçirir və əks domen ölçüsünə görə ölçelir:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Kataloq kökləri istifadədən əvvəl təsdiqlənir:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Kataloq kökündən alınan daha kiçik domenlər üçün generator:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Sətir və yarpaq həşləri {#row-and-leaf-hashes}

LDE-dən sonra, FastPQ bütün LDE sütunlarında hər bir satırı hash edir. `m` sütunları üçün:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Əgər sətir hashləri qiymətləndirmə sahəsi əvəzinə iz domenindədirsə, prover eyni coset LDE prosesi ilə həmin tək sətir-hash sütununu interpolasiya edir və uzadır.

### Merkle açılışları {#merkle-openings}

LDE qiymətləri aşağıdakı hissələrə bölünür:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Hər bir parça yarpaq:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Merkle valideynləri:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Odd səviyyələr son nodu təkrarlayır. Sorğu yolları hər bir səviyyədə sorğunun yarpaq indeksinin paritəsinə görə sol və ya sağ hashlə yoxlanılır.

İndeksdə olan bir yarpaq üçün `i`, bir yol `(s_0,\ldots,s_{d-1})` təkrarlanma ilə köklə `R` müqayisədə yoxlanır:

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

Çek yalnız aşağıdakı hallarda qəbul edilir:

$$
y_d=R
$$

AIR iz xəttinin yarpaqları:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR tərkibi olan yarpaqlar:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE sorğusunun açılışı həmçinin qiymətləndirmə indeksində `i` açılan dəyərin təsdiqlənmiş hissəsində olduğunu yoxlayır:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Dəyişdirilməsi {#fri-folding}

FRI öhdəsindən gəlir AIR tərkibi qiymətləndirmələr. `l`, transkripsiya nümunələri bir çətinlik `beta_l`. Döş qatı son qiyməti təkrarlayaraq aritənin bir dəfəsinə qədər doldurulur.

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

`a` FRI ariti olduğu yerdə. təsdiqləyici hər bir nümunə götürülmüş sorğu zəncirinə görə yoxlayır ki,

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

və hər açılan FRI qrupunu müvafiq FRI qat kökündən təsdiqləyir.

### Fiat-Shamir transkripti {#fiat-shamir-transcript}

Kanonik parametrlər kataloqu transkript hashini SHA3-256 kimi etiketləyir. Hal-hazırda prov və yoxlayıcı tətbiqi `iroha_crypto::Hash::new` ilə çağırış baytlarını çıxarır, bu da 32-bayt Blake2bVar digestidir, sonra ilk səkkiz kiçik indian baytını `F` -ə endirir:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Çətinlik çağırışları transkript vəziyyətinə tam həzm əlavə edin.

1. ictimai IO, protokol versiyası, parametr versiyası və parametr adı
2. LDE kök və iz kökləri
3. `gamma`
4. AIR tərkibi ilə bağlı çətinliklər `alpha_0`, `alpha_1`
5. AIR iz kök və AIR tərkibi kök
6. baxış böyük məhsul
7. FRI qat kökləri və `beta_l` çətinlikləri
8. nümunə götürülmüş sorğu indeksləri

Sorğu nümunələri tələb olunan unikal indekslərin sayına çatana qədər 32 baytlıq çağırış qruplarını çəkir və onları kiçik həcmli `u64` parçalar kimi oxuyur:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

nümunə götürülmüş dəst sıralama sırası ilə qaytarılır.

### Verifikasiyaçı Yenidən oynat {#verifier-replay}

Verifikatçı ilk növbədə partiya öhdəliklərini yenidən hesablayır:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

və tələb edir:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

O, həmçinin IO ictimaiyyətinin yenidən qurulmasını təmin edir:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Hər bir sahə sübutun ictimai IO byte-for-byte ilə uyğun olmalıdır. Verifikatçı sonra eyni transkripti yenidən qurur və eyni nəticəni çıxarır:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Hər bir nümunə alınan sorğu üçün `q` yoxlayır:

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

və:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

AIR kompozisiyasının açılışı `R_air_composition` altında təsdiqlənməlidir. FRI zəncir daha sonra eyni `A_q`-dən başlayır və terminal FRI kökünün altındakı təsdiqlənmiş son FRI yarpaqda bitməlidir.

## Süleymanın nələri yoxlayır {#what-the-prover-checks}

İzləmə qurmadan əvvəl, FastPQ proveri seriya sifarişini keçid açarı, əməliyyat rütbəsi ilə kanonikləşdirir, və yerləşdirmə sırası. Transfer sıraları da transkripsiya metadata tələb edir. Transfer sətirləri olan, lakin transfer transkripsiyaları olmayan bir partiya etibarsızdır.

Transfer transkripsiyaları üçün verilişdən sonra yoxlamalar aşağıdakıları əhatə edir:

- göndərici balansı aşağı axın etməməlidir.
- `sender_after` `sender_before - amount` bərabər olmalıdır.
- `receiver_after` `receiver_before + amount` bərabər olmalıdır.
- transkript partiyadakı hər bir köçürmə xəttini əhatə etməlidir.
- "Poseidon"un tək-delta dijesinin mövcud olduğu zaman transkriptin əvvəlki görüntüsünə uyğun olmalıdır.
- Qeyri-Merkle sübutları versiya 1 kimi dekodlaşdırılmalıdır; yox olan yollar deterministik sintetik sübutlarla doldurulur.

İz transfer, mint, burn, rol verilməsi, rol ləğvi, metadata seti və icazə axtarış sətirləri üçün seçicilərdən ibarətdir. Rəqəmsal əməliyyat sətirləri də imzalanmış deltaları, hər aktiv üzrə deltaları və təchizat hesablamalarını da əhatə edir.

## Prover Lane {#prover-lane}

`iroha3d` start zamanı FastPQ prover zolağını başlayır, əgər prov backend başlanğıclandırıla bilərsə. Lane sərhədlənmiş bir sıra ilə bir arxa plan vəzifəsidir. Bir blok icra şahidini istehsal etdikdən sonra commit yolu blok hash, hündürlük, görünüş və şahidini ehtiva edən prov işini təqdim edir.

Əgər zolaq işləmirsə və ya növbə doludursa, iş buraxılır və normal blok işlənməsi davam edir. Bu o deməkdir ki, arxa plan profer yolu əməliyyat qəbul və ya razılaşma qapısı deyil. Bu, artıq icra olunmuş bir dövlət üzərində sübut-təsərrüfat yoludır.

Şəbəkədə aşağıdakılardan ibarət bir prover qurulur:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` proverə mövcud backend seçməyə imkan verir. `cpu` pinlərin icrası CPU-dən üstünlük təşkil edir. `gpu` tələb olunan kernellərdən istifadə edə bilməyən CPU fallback ilə, GPU icrasını üstün tutur.

## Verifikasiya {#verification}

FastPQ sübut yoxlaması kanonik partiya öhdəliyini yenidən qurur və ictimai transkripti əvəz edir. Verifikatçı protokol versiyasını, parametrlər təyin edilmiş versiyanı, yenidən oynatma həddlərini, iz öhdəliyi, ictimai girişləri, nümunəvi Merkle açılışları, AIR açılışları və FRI sorğu zincirini yoxlayır.

Default play limitləri aşağıdakılardır:

|Sərhəd|Default |
| ------------------ | ------: |
|Keçid sıraları |     256 |
|Satış yükünün ölçüsü |256 KiB |
|FRI qatlar |      16 |
|Sual açılışları |     128 |

## Nexus Verifikasiya edilmiş relaylar {#nexus-verified-relays}

Nexus AXT sübut qovşaqları bir `AxtFastpqBinding` daxil edə bilər. `RegisterVerifiedLaneRelay` icra edərkən, Iroha:

1. Lənət relay qovusunu və FastPQ sübut materialını yoxlayır.
2. məlumat sahəsini və manifest kökünü yoxlayır.
3. AXT sübut müqaviləsini dekod edir.
4. `fastpq_binding` tələb olunur.
5. FastPQ partiyasını bu bağdan yenidən qurur.
6. əhatə edilmiş FastPQ sübutunu dekodlaşdırır
7. Yenidən qurulan partiyanın və sübutun FastPQ yoxlanıcısını çağırır

Verifikasiya uğurlu olarsa, Iroha relye istinadını, orijinal qabığı, sübut pay yükü hashini, verifikasiya hündürlüyünü, manifest kökünü və FastPQ bağlamasını ehtiva edən `VerifiedLaneRelayRecord` bir [PH000000) saxlayır.

Lane relay zarfları həmçinin kompakt FastPQ sübut materialı daşıyır. Material yol ID, məlumat məkanı id, blok hündürlüyü, yoxlama hündürlüyü, blok başlığı hash, həll hash və manifest kökü üzərində bir həzmdir. Bir relay yalnız QC və etibarlı FastPQ sübut materialına malik olduğu təqdirdə birləşməyə icazə verir.

### AXT Məhdudlaşdırıcı riyaziyyat {#axt-binding-math}

Nexus AXT zarfları üçün, `AxtFastpqBinding` sübut yenidən oynamaqdan əvvəl kanonikləşdirilmişdir. Boş parametr dəyərləri standart olaraq `fastpq-lane-balanced`; boş təsdiqləyici id və versiyası standart olaraq `fastpq` və `v1`; iddia növü kəsilmiş və aşağı dərəcəli edilmişdir.

AXT FastPQ ictimaiyyət girişləri deterministik bayt hashləridir:

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

AXT keçid açarları:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` tələbində rolu təmin edən sətir yerləşdirilmişdir:

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

`compliance` tələbi iki metadata sətirini daxil edir: birini siyasət üçün və digərini hədəf verilən yerlər üçün.

`tx_predicate` və `value_conservation` üçün bağlama müsbət mənbə və ya istiqamət məbləğini ehtiva edirsə, bir açıq təsir məbləği istifadə olunur. Əks halda kod sərhədli müəyyənləşdirici məbləğin alınması:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Sonra eyni köçürmə tənlikləri istifadə olunur:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Sentetik göndərici və alıcı hesabı şəxsiyyətləri açar toxumlardan əldə edilir:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Transfer partiyası hash:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT partiya manifestinin həzm edilməsi kanonik bağlamanın SHA-256 kodlaşdırılması üzərindəki Norito

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Şəffaf mesaj sübutları {#sccp-transparent-message-proofs}

SCCP köməkçi qutu, şəffaf çarşı silsilə mesajı sübutları üçün də FastPQ istifadə edir. Bu yol `iroha3d` arxa plan prowver zolağından ayrıdır. SCCP mesaj sübut qutusundan və manifestindən birbaşa FastPQ partiyasını qurur, sonra nəticələnən sübutı açıq yoxlama üçün bağlayır.

SCCP partiyasında `fastpq-lane-balanced` və üç metadata keçid istifadə olunur:

|Anahtar |Əməliyyat |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

Onun ictimai girişləri SCCP şəffaf daxili sübutdan alınır:

|FastPQ giriş |SCCP mənbə |
| ------------- | ---------------------------------------------------------- |
|`dsid` |Bir Blake2b digestinin ilk 16 baytı hash ifadəsi üzərində .|
|`slot` |Sonluq hündürlüyü |
|`old_root` |Faydalı yük hash |
|`new_root` |Məşğulluq kökü |
|`perm_root` |Son bloklar hash |
|`tx_set_hash` |Bəyanat hash |

SCCP kanonik kodlaşdırıcılar tam rəqəmləri kiçik ədəd yazır və dəyişən uzunluqda olan bayt dizaynlarını aşağıdakı kimi kodlayır:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Şəffaf ictimai giriş bayt silsiləsi aşağıdakılardır:

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

Şəffaf bəyanat baytları versiya, zəncir ailəsi, yerli və əks tərəflər domenləri, təhlükəsizlik modeli, bağlayıcı idarəetmə, hesab kodeksi, yekunluq modeli, təsdiqçi hədəfi, təsdiqçinin arxası ailəsi, uzunluqda prefiks edilmiş zəncir / arxası / manifest sahələri, məqsədə bağlı hashdir. Hesab kodek açarı, payload növü, ictimai giriş baytları və payload hash.

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

Bu sübut yolu üçün FastPQ məlumat məkanı id başqa bir prefixed Blake2b digest ilk on altı baytdır:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ partiyası tam olaraq:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

sonra eyni FastPQ sifariş qaydalarına əsasən sıralanır.

OpenVerify yoxlayıcı öhdəliyi SHA-256 üzərindəki SCCP mesaj arxa məntəqəsi adı və kanonik FastPQ yoxlayıcı təsvirçisi ilə:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Qırmızı FastPQ sübutları Norito-lə `StarkFriOpenProofV1` kodlaşdırılır, sonra `OpenVerifyEnvelope` ilə bir `Stark` -lə bağlanır. SCCP yoxlaması eyni FastPQ partiyasını qrupdan və manifestdən yenidən qurur, açıq yoxlama qabı metadatalarını yoxlayır, Yenidən qurulmuş partiyanın və sübutun FastPQ yoxlanıcısını çağırır.

## Parametrlər dəstləri {#parameter-sets}

Kanonik parametrlər kataloqu iki parametr dəstini açıqlayır. Host prover lane hazırda `fastpq-lane-balanced`.

|Parametr |Məqsəd|sahə |Haşlar |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |balanslaşdırılmış təchizatçı ötürülməsi |Goldilocks kvadrat uzantısı |Poseidon2 öhdəlikləri, katalog SHA3 etiketi |Arity 8, blowup 8, 46 sorğu |
|`fastpq-lane-latency` |gecikmə həssas yollar |Goldilocks kvadrat uzantısı |Poseidon2 öhdəlikləri, katalog SHA3 etiketi |arity 16, blowup 16, 34 sorğu |

Hər ikisi 128-bit təhlükəsizliyi hədəfləyir və `2^16` ölçülü bir domen ölçüsünü istifadə edir. Rust V1 transkript yenidən oynatma kodu hazırda Fiat-Shamir çağırış baytlarını `iroha_crypto::Hash::new` ilə çıxarır, əvəzinə birbaşa SHA3-256 çağırır.

Rust proveri tərəfindən istifadə olunan dəqiq kataloq sabitləri:

|Daimi |`fastpq-lane-balanced` |`fastpq-lane-latency` |
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

## Konfiqurasiya {#configuration}

FastPQ konfigurasiyası `zk.fastpq` altında yerləşdirilir.

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

Eyni icra və telemetriya etiketləri `iroha3d` ilə ləğv edilə bilər:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Konfiqurasiya sahələri üçün ətraf mühit dəyişənləri də dəstəklənilir. FastPQ xüsusi dəyişənlər aşağıdakılardır:

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

## Metriklər {#metrics}

Telemetriya aktivləşdirildiyi zaman FastPQ arxa plan seçimi və Metal runtime davranışı üçün ölçmələri ixrac edir:

|Metrik |Məna|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |İstənilən və həll olunmuş icra rejimi arxaüstü və cihaz etiketləri ilə |
|`fastpq_poseidon_pipeline_total` |İstənilən və həll edilmiş Poseidon boru kəmərinin yolu |
|`fastpq_metal_queue_depth` |Metal növbənin məhdudluğu, uçuşda maksimum sayım, göndərmə sayı və nümunə götürmə pəncərəsi |
|`fastpq_metal_queue_ratio` |Metal növbəsində məşğul və üst-üstə düşən nisbətlər |
|`fastpq_zero_fill_duration_ms` |Metal işləri üçün sıfır doldurma müddəti |
|`fastpq_zero_fill_bandwidth_gbps` |Null doldurma bant genişliyi |

Ümumi performans triajı üçün [ Performance və Metrics ](/az/guide/advanced/metrics.md)-də göstərilən konsensus və sıra siqnalları ilə istifadə edin.

## Əlaqəli istinad {#related-reference}

- [Yaradılan növ detalları üçün məlumat modelləri sxemi ](/az/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ variantları](/az/reference/iroha3d-cli.md#arg-fastpq-execution-mode)
