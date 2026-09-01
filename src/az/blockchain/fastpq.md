---
translation_locale: az
translation_source: /blockchain/fastpq.md
translation_source_hash: d8dd61390f5df3dae09b70399e04e8f71716a912ef5dea9010feaf60573ed261
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# FastPQ {#fastpq}

FastPQ seçilmiş icra təsirləri üçün Iroha-ın STARK sübut yoludur. Bu, normal əməliyyat icrasını və ya konsensusu əvəz etmir. Əməliyyatlar hələ də adətən olduğu kimi ISI, IVM və Sumeragi üzərindən keçin; FastPQ deterministik icra şahidini istifadə edir və dəstəklənən təsirləri sübut paketlərinə çevirir.

Cari host inteqrasiyasının üç əsas yolu var:

- blok icrası zamanı qeydə alınan şəffaf rəqəmsal aktiv köçürmələri
- Nexus təsdiqlənmiş icra zolağı releləri, hansının ki AXT sübut məlumat konteyneri FastPQ bağlaması daşıyır
- SCCP açıq yoxlama məlumat konteynerində FastPQ sübutunu bükən şəffaf mesaj sübut köməkçiləri

## Şahid Transferi Yolu {#transfer-witness-path}

Şəffaf ədədi köçürmələr, təlimat balansları dəyişdirdikdə strukturlaşdırılmış köçürmə transkripti yaradır. Transkript aşağıdakıları qeyd edir:

- mənbə hesabı, təyinat hesabı, aktiv təsviri və məbləğ
- köçürmədən əvvəl və sonra göndərən və alan balansları
- toplu kriptoqrafik xəş kimi istifadə olunan əməliyyat giriş nöqtəsi kriptoqrafik xəş
- tələb edən hesabdan götürülmüş icazə əsaslı kriptoqrafik xülasə dəyəri
- tək-delta transkriptlər üçün Poseidon kriptoqrafik xülasə dəyəri

Toplu köçürmələr bir neçə delta ilə bir transkript istifadə edir. Bu halda tək-delta Poseidon kriptoqrafik xülasə dəyəri yoxdur.

Blokun yekunlaşması zamanı, Iroha bu transkriptləri giriş nöqtəsinin kriptoqrafik xəşinə görə qruplaşdırır. İcra şahidi sonra həm orijinal transkript paketlərini, həm də sübutçu üçün hazırlanmış FastPQ keçid paketlərini daşıyır.

Hər bir köçürmə deltası iki keçid sətrinə çevrilir:

|Sətir|Açar forması|Əvvəlcədən dəyər|Göndərilmiş dəyər|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Göndərən debet| `asset/<asset-definition>/<source-account>`      |göndərən balansı əvvəl|göndərənin qalıq məbləği sonra|
|Qəbul edən kredit| `asset/<asset-definition>/<destination-account>` |qəbul edənin balansı əvvəl|qəbul edənin balansı sonra|

Rəqəmsal dəyərlər tam ədəd şahid vahidlərinə normallaşdırılır. Seçilmiş onluq miqyasında qeyri-mənfi `u64` kimi təmsil oluna bilmirsə, dəyər FastPQ partiyalaması üçün rədd edilir.

## İctimai Girişlər {#public-inputs}

Hər FastPQ keçid partiyası bloka və icra kontekstinə sübutu bağlayan ictimai girişləri daşıyır:

|Giriş|Mənası|
| ------------- | --------------------------------------------------------------- |
| `dsid`        |Kiçik sonlu baytlar kimi kodlaşdırılmış Dataspace identifikatoru|
| `slot`        |Blok yaradılma vaxtı nanosaniyələrə çevrildi|
| `old_root`    |İcraya dair şahidlikdən götürülmüş əsas dövlət kökü|
| `new_root`    |İcraya dair şahidlikdən törəyən post-dövlət kökü|
| `perm_root`   |Poseidon kriptoqrafik öhdəlik dəyəri üzərində aktiv rol icazələri|
| `tx_set_hash` |sıralanmış əməliyyat və zaman-tetikləyici giriş nöqtəsi kriptoqrafik xəşləri üzərində kriptoqrafik xəş|

Host bu partiyalar üçün tək protokol-standart parametr dəsti olaraq `fastpq-lane-balanced`-dan istifadə edir.

## Riyazi Model {#mathematical-model}

Bu bölmə, hazırkı Rust sübutçu və yoxlayıcı tərəfindən həyata keçirilən riyaziyyatı təsvir edir. Aşağıdakı bütün sahə əməliyyatları Goldilocks ilkin sahəsi üzərindədir:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ sahə kriptoqrafik öhdəlik dəyərləri üçün `F` üzərində Poseidon2 istifadə edir. Süngərin eni `t = 3`, sürəti `r = 2` və tutumu `1`-dür. Kriptoqrafik həş sahə elementlərini sürət-2 bloklarında udur və son permutasiyadan əvvəl tək bir sahə elementi `1` əlavə edir:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Bayt sətirləri 7 baytlıq kiçik sonluqdan ibarət hissələr şəklində yığılır, belə ki, hər bir hissə mütləq `p`-dan aşağıdır:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Domenlə ayrılmış sahə kriptoqrafik xəşləri kimi təmsil olunur:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Bayt domeni kriptoqrafik xülasələrindən başlayan kriptoqrafik hash-lər üçün, FastPQ ilk səkkiz little-endian baytı sahəyə uyğunlaşdırır:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Burada `Hash` Iroha-nin `iroha_crypto::Hash::new` mənasını verir, 32 baytlıq Blake2bVar kriptoqrafik çöl dəyəri, əgər bir formul açıq şəkildə Poseidon2 və ya SHA-256-ü göstərmirsə.

### Sahə Riyaziyyatı {#field-arithmetic}

Rust kodu sahə elementlərini `[0,p)`-də vahid protokol-standartı `u64` kimi təmsil edir. Toplama və çıxarma belədir:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

Vurma əvvəlcə 128-bitlik hasilatı hesablayır:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Sonra Goldilocks azaldılması bu identifikasiyanı istifadə edir:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Əgər:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

sonra azaldıcı hesablayır:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

İcra şərti olaraq nəticə tək protokol-standart olana qədər `p` əlavə edir və ya çıxarır. Balans fərqləri kimi imzalı tam ədədlər aşağıdakı qaydada daxil edilir:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 Permutasiyası {#poseidon2-permutation}

Poseidon2 permutasiya vəziyyəti belədir:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Onun S-qutusu belədir:

$$
S(x)=x^5
$$

FastPQ dörd tam dövr, əlli yeddi qismən dövr istifadə edir, sonra isə dörd tam dövr daha. `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` dövr sabitləri ilə tam dövr belədir:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

Qismən dairə belədir:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Bütün toplama və vurma əməliyyatları `F` daxilindədir. Tək protokol-standart MDS matrisi belədir:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

Sahə kriptoqrafik xəş başdan sıfır vəziyyətindən başlayır. Hər tam sürət-2 bloku `(u,v)` üçün:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

Son blok bir son permutasiyadan əvvəl `1` doldurma elementini əlavə edir. Çıxış `x_0`-dir.

### İctimai Giriş Bağlantısı {#public-input-binding}

Ev sahibi, bir verilənlər sahəsi ID-sini 16 baytlıq sahənin ilk səkkiz kiçik-endian baytına onun `u64` dəyərini yazaraq kodlayır:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

Blokun yaradılma vaxtı millisaniyələrdən nanosaniyələrə çevrilir:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

Əməliyyat dəsti kriptoqrafik xəşi, sıralanmış giriş nöqtəsi kriptoqrafik xəşləri üzərində bayt-domayn kriptoqrafik xəşidir:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

burada `h_i` sıralanmış əməliyyat və zaman-tetik giriş nöqtəsi kriptoqrafik xesləridir. İctimai sübutda IO, əgər `perm_root` və ya `tx_set_hash` sıfırdırsa, sübut edən alternativ dəyərləri doldurur:

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

### Rəqəmsal Normallaşma {#numeric-normalization}

Hər bir köçürmə deltası üçün hədəf onluq miqyas, məbləğ və hər iki balans nöqtəsindəki məlumat görünüşləri üzrə maksimum qısaldılmış miqyasdır:

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

Yalnız `m >= 0` və `q <= s` olduqda mantissası `m` və miqyası `q` olan `Numeric` dəyəri qəbul edilir. Onun FastPQ şahid dəyəri:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

Normallaşdırılmış nəticə `u64`-a uyğun olmalıdır.

### tək protokol-standart Sifariş {#canonical-ordering}

İz tikintisindən əvvəl partiya keçid açarı, əməliyyat sırası və orijinal daxil etmə indeksi üzrə sıralanır:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

Sifariş kriptoqrafik öhdəlik dəyəri, domen `fastpq:v1:ordering` üzərində və sıralanmış keçidlərin Norito kodlaması üzərində Poseidon2 sahə kriptoqrafik xəşidir:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

burada `P` 7-baytlıq paketdir, `E` Norito kodlamasıdır, `D_o` `fastpq:v1:ordering` və `T*` sıralanmış keçid siyahısıdır.

### Keçid Tənlikləri {#transfer-equations}

Köçürmə məbləği `a`, göndərənin balansı `f` və alıcının balansı `t` üçün, FastPQ traceni yaratmazdan əvvəl normalizə olunmuş şahid dəyərlərini təsdiqləyir:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Dəyişiklik sətrləri sonra belə kodlaşdırılır:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

İz daxilində, imzalı deltalər `F` kimi azaldılır:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

İxtiyari tək-delta ötürmə kriptoqrafik xülasə dəyəri kodlaşdırılmış ötürmə əvvəlcədən görünüşünü yekunlaşdırır:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Çox-delta ötürmə transkriptləri üçün mövcud format bu ən yüksək səviyyəli kriptoqrafik xülasə dəyərinin olmamasını tələb edir.

Transfer transkriptləri üçün host avtorizasiyası prinsipi kriptoqrafik xülasə dəyəri:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Sətirləri İzlə {#trace-rows}

Təsnif edilmiş keçid siyahısı `n` real sətri əhatə etsin. İz uzunluğu növbəti iki qüvvətinə bərabərdir:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

Sətirlər `0..n-1` aktivdir; sətirlər `n..N-1` dolgu sətirləridir. Hər bir real sətirdə bir əməliyyat seçicisi təyin edilib:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Bütün seçici sütunlar Boolean-dir:

$$
s(s-1)=0
$$

İcazə axtarış sətrləri tam olaraq rol vermə və rol ləğv etmə sətrləridir:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Riyazi əməliyyat sıraları üçün:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

Təmirçi həmçinin hər bir aktiv üzrə mövcud deltalara nəzarət edir:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Yalnız göndərmə və silmə sətrləri ehtiyat sayğacını yeniləyir:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Metaməlumat və məlumatlar sahəsi iz sütunları sıra materializasiyasından əvvəl əldə edilən sahə kriptoqrafik xeslərdir:

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

Metaməlumat kriptoqrafik hash, məlumat sahəsi kriptoqrafik hash və yuva qonşu iz sətirləri arasında sabitdir:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Transfer Merkle Sütunları {#transfer-merkle-columns}

Transfer sətirləri 32-səviyyəli seyrek Merkle yolunu daşıyır. Əgər host sübutu yoxdursa, sübut edici sətir açarından, əvvəlki balansdan və sətirin göndərən və ya alıcı tərəfi olub-olmamasından deterministik yol sintez edir.

Süni yollar üçün, dad duzu göndərən sətirlər üçün `fastpq:smt:from` və qəbul edən sətirlər üçün `fastpq:smt:to` dir:

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

Sintetik yarpaq və daxili düyünlər bunlardır:

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

Iz qeydiyyatı hər səviyyədə bit `b_l`, qardaş `s_l`, giriş düyünü `x_l` və çıxış düyünü `x_{l+1}` qeyd edir. Kodun filial konvensiyası ilə:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### İcazə kriptoqrafik xeşlər {#permission-hashes}

Rol təyin etmək və ləğv etmək sətirləri kriptoqrafik xəş icazə şahidi:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

Ev sahibi icazə cədvəli kök girişləri rol baytları, icazə baytları və epoxa baytlarına görə sıralayır, sonra Poseidon2 Merkle ağacı yaradır:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Tək enli səviyyələr son elementi təkrarlayır.

### Kriptoqrafik öhdəlik dəyərini izləyin {#trace-commitment}

Hər bir iz sütunu `c`, FastPQ üçün əvvəlcə sütun dəyərlərini iz domeni üzrə interpolə edir və koeffisiyent vektorunu kriptoqrafik olaraq hash edir:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

İz kökü, sütun kriptoqrafik öhdəlik dəyərləri üzərində Poseidon2 Merkle köküdür:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

Son iz kriptoqrafik öhdəlik dəyəri domen, parametr dəsti, iz şəkli, sütun kriptoqrafik xülasələri və iz kökü üzərində bayt kriptoqrafik xəşdir.

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

harada `D_c` `fastpq:v1:trace_commitment`-dir.

### AIR Tərkib {#air-composition}

V1 AIR tərkib dəyəri sətir-yerli qalıqların xətti birləşməsidir. Yazı iki çağırış nümunəsini götürür:

$$
\alpha_0,\alpha_1 \in F
$$

Hər qonşu sıra cütlüyü `(i,i+1)` üçün, sübutçu hesablama aparır:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Qalıqlar `rho` kod sırası ilə bunlardır:

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

Rəqəmsal sütunları olan sətirlər üçün:

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

Yoxlayıcı seçilmiş sıra açılışları üçün `A_i` dəyərini yenidən hesablayır və bunu AIR tərkib Merklə kökündə kriptoqrafik olaraq bağlı olan tərkib dəyərlə yoxlayır.

### Məhsulu axtar {#lookup-product}

İcazə axtarış yığıcısı Fiat-Shamir çətinliyindən istifadə edir `gamma`. `s_perm` və `perm_hash` aşağı dərəcəli genişləndirmə qiymətləndirmələri üzrə, işləyən məhsul belədir:

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

Sübut qeyd edir:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Aşağı Dərəcəli Genişlənmə {#low-degree-extension}

Gəlin `omega_T` treys-domen generatoru, `omega_E` qiymətləndirmə-domen generatoru və `g` konfiqurasiya edilmiş koset yerdəyişməsi olsun. Dəyərləri `v_i` olan bir treys sütunu üçün interpolasiya belə əmsallar `a_j` istehsal edir ki:

$$
f(\omega_T^i)=v_i
$$

Aşağı dərəcəli genişləndirmə kosetdə eyni polinomu qiymətləndirir:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

İcra bunu FFT-dən əvvəl əmsalları kəsik ofsetinin qüvvələri ilə vurmaqla hesablayır:

$$
a'_j = a_j g^j
$$

və sonra qiymətləndirmə domenində `a'`-ı qiymətləndirmək.

CPU FFT bit-əks verilənlər üzərində iterativ radix-2 Cooley-Tukey transformudur. Səviyyə uzunluğu `L`, yarım uzunluğu `H=L/2` və səviyyə kökü:

$$
\omega_L=\omega^{N/L}
$$

hər bir kəpənək hesablayır:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

Tərs FFT eyni transformu `omega^{-1}` ilə işlədib tərs domen ölçüsü ilə miqyaslayır:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Kataloq kökləri istifadə edilməzdən əvvəl təsdiqlənir:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Kataloq kökündən törədilmiş kiçik domenlər üçün generator:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Sətir və Yarpaq kriptoqrafik həşlər {#row-and-leaf-hashes}

LDE-dən sonra, FastPQ hər bir sətri bütün LDE sütunlarda kriptoqrafik xeşlər edir. `m` sütunlar üçün:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Əgər sıradakı kriptoqrafik hashlər hələ də qiymətləndirmə domeni əvəzinə iz domenindədirsə, sübut edən şəxs həmin tək sıra-hash sütununu eyni koset LDE prosesi ilə interpolasiya edir və uzadır.

### Merkle Açılışları {#merkle-openings}

LDE qiymətləri aşağıdakı bloklara bölünür:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Hər bir parça yarpaq:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Merkle valideynləri bunlardır:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Tək səviyyələr son node-u təkrarlayır. Sorğu yolları hər səviyyədə sorğu yarpaq indeksinin tək və ya cüt olmasına görə sol və ya sağ tərəfi hash-ləməklə yoxlanılır.

İndeks `i` olan yarpaq üçün, `(s_0,\ldots,s_{d-1})` yolu `R` kökü ilə aşağıdakı təkrarlama vasitəsilə yoxlanılır:

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

Yoxlama yalnız aşağıdakı hallarda keçir:

$$
y_d=R
$$

AIR iz sətiri yarpaqları bunlardır:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR kompozisiya yarpaqları bunlardır:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE sorğusunun açılması həmçinin qiymətin qiymətləndirmə indeksində `i` açıldığını və onun təsdiqlənmiş parçasında mövcud olduğunu yoxlayır:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Qatlanma {#fri-folding}

FRI kriptoqrafik olaraq AIR kompozisiya qiymətləndirmələrinə bağlanır. Hər bir `l` raundu üçün transkript bir `beta_l` çağırışını nümunələşdirir. Lay arity-nin bir çoxluğu qədər son dəyəri təkrarlayaraq doldurulur. Hər bir arity ölçülü qrup aşağıdakı kimi qatlanır:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

harda `a` FRI aritidir. Yoxlayıcı hər götürülmüş sorğu zənciri üçün aşağıdakıları yoxlayır:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

və hər açılmış FRI qrupunu müvafiq FRI qat kökü ilə autentifikasiya edir.

### Fiat-Şamir Transkripti {#fiat-shamir-transcript}

Tək protokol-standart parametr kataloqu transkriptin kriptoqrafik xəşini SHA3-256 kimi etiketlədir. Cari sübutçu və yoxlayıcı tətbiqi 32 baytlıq Blake2bVar kriptoqrafik həzm dəyəri olan `iroha_crypto::Hash::new` ilə çağırış baytlarını çıxarır, sonra ilk səkkiz little-endian baytı `F` ə çevirir:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Texniki çağırışlar tam kriptoqrafik xülasə dəyərini transkript vəziyyətinə əlavə edir. Təkrarlama sırası belədir:

1. ictimai IO, protokol versiyası, parametr versiyası və parametr adı
2. LDE kök və iz kökü
3. `gamma`
4. AIR tərkib çətinlikləri `alpha_0`, `alpha_1`
5. AIR iz kökü və AIR tərkib kökü
6. böyük məhsulu axtar
7. FRI qatın kökləri və `beta_l` çağırışlar
8. nümunələnmiş sorğu indeksləri

Sorğu nümunəsi 32 baytlıq çətinlik kriptoqrafik xülasələri davamlı olaraq götürür və onları little-endian `u64` parçaları kimi oxuyur, ta ki tələb olunan sayda unikal indeks toplanana qədər:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

Seçilmiş dəst sıraya salınmış qaydada qaytarılır.

### Təsdiqləyici Yenidən Oynatma {#verifier-replay}

Təsdiqləyici əvvəlcə partiya kriptoqrafik öhdəlik dəyərini yenidən hesablayır:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

və tələb edir:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

O, həmçinin ictimai IO-i yenidən qurur:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Hər bir sahə dəlilin ictimai IO bayt-by-bayt uyğun olmalıdır. Sonra yoxlayıcı eyni transkripti bərpa edir və eyni nəticəni çıxarır:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Hər bir seçilmiş sorğu `q` üçün yoxlayır:

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

AIR tərkibinin açılışı `R_air_composition` altında autentifikasiya edilməlidir. Sonra FRI zənciri eyni `A_q`-dən başlayır və terminal FRI kök altında autentifikasiya olunmuş son FRI yarpaqda bitməlidir.

## Doğrulayıcının Yoxladığı Nədir {#what-the-prover-checks}

İz izlərini qurmazdan əvvəl, FastPQ sübutçusu partiya sırasını keçid açarı, əməliyyat sırasi və yerləşdirmə sırasına görə kanonikləşdirir. Transfer sıraları həmçinin transkript metadata tələb edir. Transfer sıraları olan, lakin transfer transkriptləri olmayan bir partiya etibarsızdır.

Transfer transkriptləri üçün, sübut verən tərəfin yoxlamaları bunlardır:

- göndərənin balansı mənfi olmamalıdır
- `sender_after` `sender_before - amount`-ə bərabər olmalıdır
- `receiver_after` `receiver_before + amount`-ə bərabər olmalıdır
- transkript partiyadakı hər bir köçürmə sətrini əhatə etməlidir
- tək-delta Poseidon kriptoqrafik xülasə dəyəri mövcud olduqda, transkript ön şəklinə uyğun olmalıdır
- təqdim edilmiş sparse-Merkle sübutları versiya 1 kimi deşifrə edilməlidir; əskik yollar determinist sintetik sübutlarla doldurulur

İz seçici sütunları ilə transfer, çıxarış, məhv etmə, rol vermə, rol ləğv etmə, metadata təyin etmə və icazə yoxlama sətirlərini ehtiva edir. Rəqəmsal əməliyyat sətirləri həmçinin işarəli dəyişikliklər, aktiv üzrə davam edən dəyişikliklər və təchizat sayğaclarını da daşıyır.

## Təsdiq yürütmə zolağı {#prover-lane}

`iroha3d` provayder arxa ucunu başlada bilsə, başlanğıcda FastPQ dəlil yürütmə xəttini işə salır. İcra xətti məhdud növbəsi olan fon tapşırığıdır. Bir blok icra şahidi yaratdıqdan sonra, konsensus bitirmə yolu blokun kriptoqrafik xəşini, hündürlüyünü, baxışını və şahidini ehtiva edən bir provasiyonu təqdim edir.

Əgər icra zolağı işləmirsə və ya növbə doludursa, iş keçilir və normal blok işlənməsi davam edir. Bu o deməkdir ki, fon provayderinin icra zolağı əməliyyat qəbul etmə və ya konsensus qapısı deyil. Bu, artıq icra olunmuş vəziyyət üzərində sübut istehsal edən bir yoldur.

İcra zolağı belə bir sübutçunu qurur:

```text
parameter = "fastpq-lane-balanced"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Hər iki parametrin defolt dəyəri `cpu` olaraq təyin edilib. `gpu`-i seçmək açıq şəkildə qapalı-fail tələbi deməkdir: əgər GPU dəstəyi kompilyasiya olunmayıbsa və ya tələb olunan GPU backend preflight uğursuz olur, prover icra xətti deaktiv qalır. İlk buraxılışın heç bir `auto` dəyəri yoxdur və tələb olunan GPU rejimindən CPU rejiminə geri dönmür.

## Təsdiqləmə {#verification}

FastPQ sübut təsdiqi tək protokol-standart toplu kriptoqrafik öhdəlik dəyərini bərpa edir və ictimai transkripti yenidən işlədir. Yoxlayıcı protokolu yoxlayır versiya, parametr dəsti versiyası, təkrar oynatma məhdudiyyətləri, iz kriptoqrafik öhdəlik dəyəri, açıq məlumatlar, seçilmiş Merkle açılışları, AIR açılışları və FRI sorğu zənciri.

Standart cavab limitlərinə daxildir:

|Hədd|Varsayılan|
| ------------------ | ------: |
|Keçid sətirləri|     256 |
|Toplu yük ölçüsü|256 KiB|
| FRI qatlar         |      16 |
|Sorğu açılışları|     128 |

## Nexus Yoxlanılmış Keçidlər {#nexus-verified-relays}

Nexus AXT sübut məlumat konteynerləri `AxtFastpqBinding` yerləşdirə bilər. `RegisterVerifiedLaneRelay` icra olunduqda, Iroha:

1. icra yolu rele məlumat konteynerini və FastPQ sübut materialını təsdiqləyir
2. dataspace və texniki manifest kökünü yoxlayır
3. AXT sübut məlumat konteynerini deşifr edir
4. bir `fastpq_binding` tələb edir
5. o bağlamadan FastPQ partiyasını yenidən qurur
6. gizlədilmiş FastPQ sübutu deşifr edir
7. yenidən qurulmuş partiya və sübut üzərində FastPQ yoxlayıcısını çağırır

Əgər yoxlama uğurlu olarsa, Iroha keçid istinadı, orijinal məlumat konteyneri, sübut yükləmə kriptoqrafik xəşi, yoxlama hündürlüyü, texniki manifest kökü və FastPQ bağlamasını ehtiva edən `VerifiedLaneRelayRecord`-ı saxlayır.

icra zolağı ötürücü məlumat konteynerləri həmçinin kompakt FastPQ sübut materialını da daşıyır. Material icra zolağı identifikatoru, məlumat sahəsi identifikatoru, blok hündürlüyü, yoxlama hündürlüyü üzərində kriptoqrafik xülasə dəyəridir, blok başlığı kriptoqrafik xəş, maliyyə əməliyyatlarının tənzimlənməsi kriptoqrafik xəşi və texniki manifest kökü. Bir relenin birləşmə üçün uyğun olması üçün həm QC, həm də etibarlı FastPQ sübut materialına malik olması lazımdır.

### AXT Tətbiq olunan Riyaziyyat {#axt-binding-math}

Nexus AXT məlumat konteynerləri üçün, `AxtFastpqBinding` sübutu təkrar oynatmadan əvvəl kanonikləşdirilir. Boş parametr dəyərləri `fastpq-lane-balanced`-ə görə təyin olunur; boş yoxlayıcı identifikatoru və versiyası `fastpq` və `v1`-ə görə təyin olunur; tələb növü qısaldılır və kiçik hərflərə çevrilir.

AXT FastPQ ictimai girişləri deterministik bayt kriptoqrafik xəşlərdir:

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

AXT keçid düymələri bunlardır:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` iddiası rol-vermə sətrini əlavə edir:

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

və avtorizasiya siyasətini bağlayan bir metadata sətri. `compliance` iddiası iki metadata sətri əlavə edir: biri siyasət üçün, biri isə hədəf məlumat sahələri üçün.

`tx_predicate` və `value_conservation` üçün, bağlama müsbət mənbə və ya təyinat məbləği ehtiva edərkən açıq təsir məbləği istifadə olunur. Əks halda, kod məhdudlaşdırılmış deterministik məbləği çıxarır:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Sonra eyni ötürmə tənlikləri istifadə olunur:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Sintetik göndərən və qəbul edən hesab identifikatorları açar toxumlarından yaradılır:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Köçürmə partiyası kriptoqrafik xəşi belədir:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT seriyası texniki manifestin kriptoqrafik xülasə dəyəri SHA-256-dir, tək protokol-standart bağlamanın Norito kodlaması üzrə:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Şəffaf Mesaj Sübutları {#sccp-transparent-message-proofs}

SCCP köməkçi proqram paketi həmçinin şəffaf zəncirlərarası mesaj sübutları üçün FastPQ-dən istifadə edir. Bu yol `iroha3d` fon provayder icra xəttindən ayrıdır. O, SCCP mesaj sübut paketindən və texniki manifestdən birbaşa FastPQ partiya yaradır, sonra əldə edilən sübutu açıq yoxlama üçün qablaşdırır.

SCCP partiyası `fastpq-lane-balanced`-dan və üç metadata keçidindən istifadə edir:

|Açar|Əməliyyat|
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context` | `MetaSet` |
| `sccp:transparent:v1:payload` | `MetaSet` |

Onun ictimai girişləri SCCP şəffaf daxili sübutundan əldə edilir:

| FastPQ giriş | SCCP mənbə                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        |Bəyanatın kriptoqrafik xəşini üzərində Blake2b kriptoqrafik xəş dəyərinin ilk 16 baytı|
| `slot`        |Sonluq hündürlüyü|
| `old_root`    |Yük kriptoqrafik xəş|
| `new_root`    |kriptovalyuta öhdəlik dəyəri kökü|
| `perm_root` |Sonluq bloku kriptoqrafik həş|
| `tx_set_hash` |Bəyanat kriptoqrafik xəş|

SCCP tək protokol-standart kodlayıcılar ədədləri little-endian formatında yazır və dəyişkən uzunluqlu bayt massivlərini belə kodlayır:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

Şəffaf ictimai giriş bayt sətiri:

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

Şəffaf bəyanat baytları versiya, zəncir ailəsi, yerli və qarşı tərəf domenləri, təhlükəsizlik modeli, ankra idarəetməsi, hesab kodeki, sonluq modeli, yoxlayıcı hədəfi, yoxlayıcı arxa plan ailəsi, uzunluğu əvvəlcədən verilmiş zəncir/arxa plan/manifest sahələrinin birləşməsidir, təyinat bağlayıcı kriptoqrafik həş, hesab kodek açarı, yük növü, ictimai giriş baytları və yük kriptoqrafik həşi. Bəyannamə kriptoqrafik həş belədir:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

Bu sübut yolunun FastPQ verilənlər sahəsi identifikatoru başqa bir prefiksli Blake2b kriptoqrafik həzm dəyərinin ilk on altı baytıdır:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ partiyası dəqiq belədir:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

sonra eyni FastPQ sıralama qaydasına görə çeşidlənir.

OpenVerify yoxlayıcısının kriptoqrafik öhdəlik dəyəri SHA-256-dir SCCP mesaj backend adı və tək protokol-standart FastPQ yoxlayıcı deskriptoru üzərində:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

Xam FastPQ sübutu Norito ilə `StarkFriOpenProofV1`-ə kodlanır, sonra `Stark` arxa ucu ilə `OpenVerifyEnvelope`-ə bükülür. SCCP yoxlaması eyni şeyi yenidən qurur FastPQ paketini dəstədən və texniki manifestdən götürür, açıq yoxlama məlumat konteynerinin metadatasını yoxlayır və yenidən qurulmuş paket və sübut üzərində FastPQ təsdiqləyicisini işə salır.

## Parametr dəstləri {#parameter-sets}

Tək protokol-standart parametr kataloqu iki parametr dəstini göstərir. Ev sahibi sübutçu icra xətti hazırda `fastpq-lane-balanced` istifadə edir.

|Parametr|Məqsəd|Sahə|kriptografik həşlər| FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` |tarazlı doğrulayıcı ötürmə qabiliyyəti|Qızıl saçlı kvadratik genişlənmə|Poseidon2 kriptoqrafik öhdəlik dəyərləri, kataloq SHA3 etiketi|arıtmiya 8, partlayış 8, 46 sorğu|
| `fastpq-lane-latency` |güc gecikməsinə həssas icra zolaqları|Qızıl saçlı kvadratik genişlənmə|Poseidon2 kriptoqrafik öhdəlik dəyərləri, kataloq SHA3 etiketi|ərity 16, partlayış 16, 34 sorğu|

Hər ikisi 128-bit təhlükəsizliyi hədəfləyir və `2^16` ölçülü iz domenindən istifadə edir. Rust V1 transkriptin təkrar oynadılması kodu hazırda Fiat-Shamir çağırış baytlarını birbaşa SHA3-256-ü çağırmaq əvəzinə `iroha_crypto::Hash::new`-dən törədir.

Rust sübutçusu tərəfindən istifadə olunan dəqiq kataloq sabitləri bunlardır:

|Daimi| `fastpq-lane-balanced` | `fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
| `target_security`    |                    128 |                   128 |
| `grinding_bits`      |                     23 |                    21 |
| `trace_log_size`     |                     16 |                    16 |
| `trace_root`         |   `0x002a247f81c6f850` |  `0x6a9f4eb38fb9b892` |
| `lde_log_size`       |                     19 |                    20 |
| `lde_root`           |   `0x60263388dbbf9b2a` |  `0x9c9c3a571b6f89ac` |
| `permutation_size` |                 65,536 |                65,536 |
| `lookup_log_size`    |                     19 |                    20 |
| `omega_coset`        |   `0x6af325e825ad5c18` |  `0x3a5fd4171e3c3a4d` |
| `fri_arity`          |                      8 |                    16 |
| `fri_blowup`         |                      8 |                    16 |
| `fri_max_reductions` |                      8 |                     6 |
| `fri_queries`        |                     46 |                    34 |

## Konfiqurasiya {#configuration}

FastPQ konfiqurasiyası `zk.fastpq` altında yerləşdirilib.

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

Eyni icra və telemetriya etiketi `iroha3d` tərəfindən dəyişdirilə bilər:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Konfiqurasiya sahələri üçün ətraf mühit dəyişənləri də dəstəklənir. FastPQ-xüsusi dəyişənlər bunlardır:

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

Telemetriya aktiv olduqda, FastPQ backend seçimi və Metal proqram təminatı icra mühiti davranışı üçün ölçüləri ixrac edir:

|Metrik|Mənası|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Arxa plan və cihaz etiketləri tərəfindən tələb olunan və həll edilmiş icra rejimi|
| `fastpq_poseidon_pipeline_total` |Tələb olunan və həll olunan Poseidon proqram təminatı emal iş prosesi yolu|
| `fastpq_metal_queue_depth`        |Metal növbə limiti, maksimum uçuşda olan say, göndəriş sayı və nümunə götürmə pəncərəsi|
| `fastpq_metal_queue_ratio`        |Metal növbəsi məşğul və örtüşmə nisbətləri|
| `fastpq_zero_fill_duration_ms`    |Metal işləri üçün ev sahibi sıfır-doldurma müddəti|
| `fastpq_zero_fill_bandwidth_gbps` |Törədilmiş sıfır-doldurulmuş bant genişliyi|

Ümumi performans triajı üçün bunları [Performans və Ölçülər](/az/guide/advanced/metrics.md)-da göstərilən konsensus və növbə siqnalları ilə istifadə edin.

## Əlaqəli İstinad {#related-reference}

- [Məlumat Modeli SXeması](/az/reference/data-model-schema.md) node-səlahiyyətli tipli nöqtə-vaxt məlumat baxışı üçün
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ seçimlər](/az/reference/iroha3d-cli.md#fastpq-overrides)
