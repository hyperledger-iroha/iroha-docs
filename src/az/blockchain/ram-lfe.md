---
translation_locale: az
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 66436bfdcdfea9bcd52834436dc8b6abe9812549583e6bfca06cbe73d5f75d35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# RAM-LFE {#ram-lfe}

RAM-LFE Təsadüfi Giriş Maşını Loqonik Funksiya Qiymətləndirməsinin qısaltmasıdır. Iroha-də isə bu, ictimai siyasəti zəncirdə olan, lakin qiymətləndirici loqikası, sirri və ya xam girişi dünya vəziyyətinə yazılmamalı olan proqramlar üçün ümumi gizli-funksiya təbəqəsidir. O, şəxsi telefon və ya e-poçt axtarışı kimi SORA Nexus identifikator axınları tərəfindən istifadə olunur və həmçinin bir node profili tətbiqə açılan marşrutları aktivləşdirdikdə ümumi Torii proqram-icra köməkçisi kimi təqdim edilə bilər.

Zəncir siyasət kriptoqrafik öhdəlik dəyərini və protokol nəticəsi qeydlərinin doğrulama metadatasını saxlayır. Bir həll edici və ya Torii proqram icra mühiti gizli olanı qiymətləndirir proqram, yalnız icazə verilən çıxışı qaytarır və müştərilər, dəstək alətləri və ya blokçeyn dəftəri təlimatlarının qeydiyyatdan keçmiş siyasətlə müqayisə edərək yoxlaya biləcəyi bir protokol nəticə qeydi əlavə edir.

## Adlandırma {#naming}

Adlandırma bölgüsü önəmlidir:

|Termin|Mənası|
| --- | --- |
| `ram_lfe` |Xarici gizli-funksiyanın abstraksiyası: proqram siyasətləri, kriptoqrafik bağlılıq dəyərləri, icra protokolu nəticə qeydləri və protokol nəticə qeydlərinin yoxlama rejimi.|
| `BFV` |Şifrələnmiş-giriş RAM-LFE arxa ucları tərəfindən istifadə olunan Brakerski/Fan-Vercauteren homomorfik şifrələmə sxemi.|
| `ram_fhe_profile` |BFV-proqramlaşdırılmış şifrəli icra maşını üçün xüsusi metadata. Bu, RAM-LFE-in ikinci adı deyil.|

Məlumat modelində, `RamLfeProgramPolicy` və `RamLfeExecutionReceipt` RAM-LFE tipindədir. BFV parametrlər, şifrələnmiş məlumat konteynerləri və gizli RAM-FHE proqram profili siyasət tərəfindən istifadə olunan şifrələnmiş-icra backend'inə aiddir.

## Nəyi Yazır {#what-it-records}

Bir RAM-LFE proqram siyasəti qlobal olaraq `program_id` tərəfindən qeydiyyata alınır. Siyasət aşağıdakılardan ibarətdir:

- Siyasəti aktivləşdirə, deaktiv edə və ya başqa şəkildə dəyişdirə bilən sahib hesab
- müştərilərə reklamı edilən backend
- protokol nəticə qeydi yoxlama rejimi, ya `signed`, ya da `proof`
- gizli proqram metadatasına və qiymətləndirici sirrinə kriptoqrafik öhdəlik dəyəri
- imzalanmış protokol nəticə qeydləri üçün həll edici açıq açarı
- müraciət edilə bilən ictimai şifrələnmiş-giriş metadatası, məsələn, BFV parametrlər və `ram_fhe_profile`
- siyasətin yeni protokol nəticə qeydləri verə biləcəyini idarə edən `active` bayraq

Gizli sirr, açıq mətn tanıyıcı dəyəri və gizli proqram bədəni dünya vəziyyətində saxlanılmır. Müştərilər kriptoqrafik öhdəlik dəyərlərini, qeyri-şəffaf kriptoqrafik xəşləri, protokol nəticə qeydinin kriptoqrafik xəşlərini, şifrəli mətləri belə qəbul etməlidirlər, və kriptoqrafik xülasələri qeyri-şəffaf protokol dəyərləri kimi proqramlaşdırmaq.

## Arxa uçlar {#backends}

Cari RAM-LFE dəstəyi üç arxa uç identifikatoruna əsaslanır:

|Arxa uç|İstifadə et|
| --- | --- |
| `hkdf-sha3-512-prf-v1` |Öhdəliklə bağlı PRF qiymətləndirmə.|
| `bfv-affine-sha3-256-v1` |BFV-dəstəklənən şifrələnmiş identifikasiya boşluqları üzərində gizli aylana bilən qiymətləndirmə.|
| `bfv-programmed-sha3-256-v1` |BFV-dəyərli proqramlaşdırılmış icra şifrələnmiş registrlər və yaddaş icra zolaqları üzərində.|

Müəyyənedici siyasətləri üçün proqramlaşdırılmış BFV backend vacib müasir yoldur. O, cüzdanların normallaşdırılmış girişləri yerli olaraq şifrələməsinə imkan verir, həll edici isə qiymətləndirməyə imkan verir əməliyyatda ictimai identifikatoru görmədən və çıxış kriptoqrafik xəşi qeydiyyatdan keçmiş proqram siyasətinə bağlayan protokol nəticəsi qeydini qaytarır.

## Riyaziyyat {#math}

Bu bölmə mövcud RAM-LFE kodu tərəfindən istifadə olunan tətbiq səviyyəli cəbrin izahını verir. Bu, təhlükəsizlik sübutu deyil; bu, siyasətlərin, protokol nəticə qeydlərinin və müştərilərin razılaşmalı olduğu deterministik transkript və şifrələnmiş qiymətləndirmə modelidir.

### Qeyd {#notation}

Gəlin:

- \(H(m)\) Iroha `Hash::new(m)`: Blake2b-32 `m` üzərində, son baytın ən əhəmiyyətsiz biti `1` olaraq məcbur edilməklə.
- \(N(x)\) `x`-ın yeganə protokol-standart Norito kodlaması olsun.
- \(a \parallel b\) bayt-sətri birləşməsini nəzərdə tutur.
- \(\operatorname{le64}(i)\) imzasız tam ədədin 8 baytlıq kiçik sonlu kodlaması olsun.
- \(s\) dünya vəziyyətinin xaricində saxlanılan həll edici sirr olsun.
- \(P\) ictimai siyasət parametrlərinə uyğun olsun.
- \(A\) əlaqəli məlumatı sorğu et.
- \(x\) backend-dən asılı olaraq normalizə edilmiş giriş baytları və ya Norito-kodlanmış şifrələnmiş giriş məlumatları konteyneri ola bilər.

RAM-LFE sahə-ayrılmış kriptoqrafik xəşləri istifadə edir. Aşağıdakı formullar sahələri məqsədə görə adlandırır; onların indiki bayt sətirləri bunlardır:

|Simvol|Domen simvolu|
| --- | --- |
| \(D_{\mathrm{policy}}\) | `iroha.ram_lfe.policy.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{secret}}\) | `iroha.ram_lfe.policy_secret.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{salt}}\) | `iroha.ram_lfe.hkdf_salt.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{hkdf\_opaque}}\) | `iroha.ram_lfe.opaque_info.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{hkdf\_receipt}}\) | `iroha.ram_lfe.receipt_info.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{opaque}}\) | `iroha.ram_lfe.opaque_hash.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{receipt}}\) | `iroha.ram_lfe.receipt_hash.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{affine\_circuit}}\) | `iroha.ram_lfe.bfv_affine.circuit.v1` |
| \(D_{\mathrm{affine\_opaque}}\) | `iroha.ram_lfe.bfv_affine.opaque_hash.v1` |
| \(D_{\mathrm{affine\_receipt}}\) | `iroha.ram_lfe.bfv_affine.receipt_hash.v1` |
| \(D_{\mathrm{program\_memory}}\) | `iroha.ram_lfe.bfv_program.memory.v1` |
| \(D_{\mathrm{program\_opaque}}\) | `iroha.ram_lfe.bfv_program.opaque_hash.v1` |
| \(D_{\mathrm{program\_receipt}}\) | `iroha.ram_lfe.bfv_program.receipt_hash.v1` |
| \(D_{\mathrm{program\_digest}}\) | `iroha.ram_lfe.bfv_program.digest.v1` |
| \(D_{\mathrm{output}}\) | `iroha.ram_lfe.output_hash.v1` |
| \(D_{\mathrm{id\_opaque}}\) | `iroha.ram_lfe.identifier.opaque_hash.v1` |
| \(D_{\mathrm{id\_receipt}}\) | `iroha.ram_lfe.identifier.receipt_hash.v1` |
| \(D_{\mathrm{bfv\_keygen}}\) | `iroha.crypto.fhe.bfv.keygen.v1` |
| \(D_{\mathrm{bfv\_encrypt}}\) | `iroha.crypto.fhe.bfv.encrypt.v1` |
| \(D_{\mathrm{id\_keygen}}\) | `iroha.crypto.fhe.bfv.identifier.keygen.v1` |
| \(D_{\mathrm{id\_slot}}\) | `iroha.crypto.fhe.bfv.identifier.slot.v1` |

### Siyasət kriptoqrafik öhdəlik dəyəri {#policy-commitment}

Bir siyasət kriptoqrafik öhdəlik dəyəri, açıq parametrləri və gizli həll edici sirri bir backend-ə bağlayır. Əvvəlcə sirr ayrı-ayrılıqda kriptoqrafik olaraq bağlanır:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Sonra tam siyasət transkripti kodlaşdırılır:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

və nəşr olunmuş siyasətin kriptoqrafik xəşi belədir:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

Zəncirdəki `PolicyCommitment` belədir:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

Qiymətləndirmə proqram icra mühitinin sirrindən eyni dəyəri yenidən hesablamaqdır. Yenidən hesablanan kriptoqrafik xash fərqli olarsa, qiymətləndirmə kriptoqrafik öhdəlik dəyərinin uyğunsuzluğu ilə uğursuz olur.

### HKDF-SHA3-512 Arxa uç {#hkdf-sha3-512-backend}

`hkdf-sha3-512-prf-v1` üçün çıxış normallaşdırılmış girişin özüdür, lakin şəffaf olmayan identifikasiya və protokol nəticə qeydi kriptoqrafik xəşləri məxfi məhdudiyyətli PRF çıxışlardır.

Sorğu transkripti belədir:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

HKDF duzu və psevdos təsadüfi açar bunlardır:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

Şəffaf olmayan material genişləndirilir və qarışdırılır:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

protokol nəticəsi qeyd materialı əlavə olaraq qeyri-şəffaf id ilə bağlayır:

$$
m_r =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK},
D_{\mathrm{hkdf\_receipt}} \parallel T_{\mathrm{req}}
\parallel \mathrm{opaque\_id}, 32)
$$

$$
\mathrm{receipt\_hash} =
H(D_{\mathrm{receipt}} \parallel m_r \parallel \mathrm{opaque\_id})
$$

Backend belə cavab verir:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV-yə giriş {#bfv-primer}

BFV gitter əsaslı homomorf şifrələmə sxemidir. “Homomorf” o deməkdir ki, proqram şifrələnmiş qiymətləri əlavə edə və hasil edə bilər və deşifrə etdikdən sonra eyni nəticəni əldə edər, sanki o, toplama və hasil əməliyyatlarını açıq mətn qiymətləri üzərində həyata keçirmiş kimi.

RAM-LFE üçün BFV şifrələnmiş giriş mexanizmi kimi istifadə olunur:

1. Cüzdan şəxsi bir dəyəri, məsələn, telefon nömrəsi və ya e-poçt ünvanını normallaşdırır.
2. Cüzdan baytları kiçik tam ədəd yerlərinə çevirir.
3. Hər yuva çözümleyicinin BFV açıq açarı ilə şifrələnir.
4. Resolver proqram təminatı icra mühiti həmin şifrəli mətnlər üzərində gizli proqramı qiymətləndirir.
5. Proqram təminatının icra mühiti yalnız gizli proqram çıxışını deşifrə edir və ya protokol nəticəsi qeydi üçün imza atır və ya sübut göstərir.

BFV dəqiq tam ədəd hesablamasıdır, təxminən hesablaması deyil. Buna görə də bunun daha uyumlu olduğu tanımlayıcı baytlar və kiçik modullu hesablama əməliyyatları, üzən nöqtə model təxminindən daha çox. İçində Iroha'nin cari BFV istifadə, hər şifrələnmiş yuva bir skalyar dəyəri modulda daşıyır \(t\), adətən bir bayt və ya bayt uzunluğunda bir sahə. Şifrlənmiş mətn özü çox daha böyük bir tam ədədlə modul üzrə yerləşir \(q\). Arasındakı boşluq \(q\) və \(t\) şifrələmə və homomorfik əməliyyatların yaratdığı səs-küy üçün deşifrə otağı təmin edir.

Bir BFV şifrələmə mətninin iki polinom komponenti var:

$$
c=(c_0,c_1)
$$

Gizli açar başqa bir çoxhədli \(s_k\)dir. Şifrənin açılması komponentləri birləşdirir:

$$
v = c_0 + c_1s_k
$$

Əgər şifrlənmiş mətn düzgün formada yaradılıbsa və səs-küy hələ də kifayət qədər kiçikdirsə, \(v\) ölçülən açıq mətinə yaxındır. Yuvarlaqlaşdırma açıq mətinin koeffisentini \(t\) modulunda bərpa edir. Faydalı xüsusiyyət odur ki, şifrlənmiş mətn əməliyyatları bu quruluşu qoruyur:

|Sadə əməliyyat|Şifrlənmiş mətn əməliyyatı|
| --- | --- |
| \(m+n\) |Şifrlənmiş mətn komponentlərini əlavə edin.|
| \(m+\alpha\) | \(c_0\) daxilində miqyaslanmış sadə mətn sabitini əlavə edin.|
| \(\alpha m\) |Hər iki şifrlənmiş mətn komponentini \(\alpha\) ilə ölçüləndirin.|
| \(mn\) |Şifrlənmiş çoxterminli çoxalt, ölçüsünü dəyiş, sonra isə yenidən xətti hala gətir.|

Vurma əməliyyatı bahalı bir əməliyyatdır. İki iki komponentli şifrli mətnin hasilatı təbii olaraq üç komponentli şifrli mətn yaradır ki, o da \(1\), \(s_k\) və \(s_k^2\) ilə deşifr olunur. Relinearizasiya, \(s_k^2\) terminini normal iki komponentli şifrli mətbəə çevirmək üçün dərc edilmiş qiymətləndirmə açarından istifadə edir. Bu, sonrakı toplama və vurma əməliyyatlarını eyni şifrli mətbəə formasında saxlayır.

BFV həm də "səviyyələndirilib": hər şifrələnmiş əməliyyat müəyyən səs-küy büdcəsini xərcləyir. Bu icra şifrələnmiş mətnləri həmin büdcəni yeniləmək üçün yenidən işə salmır. Bunun əvəzinə, RAM-LFE kiçik bir `ram_fhe_profile` nəşr edir və yalnız məhdudlaşdırılmış gizli proqram formasını qəbul edir. Bu, qiymətləndirməni parametr dəstinin dəstəklədiyi dərinlik daxilində saxlayır. Mövcud proqramlaşdırılmış profil sabit qeydiyyat sayı, sabit yaddaş yolu sayı və hər proqramlaşdırılmış addımda ən çox bir şifrlənmiş-şifrlənmiş vurma əməliyyatı həyata keçirməyə imkan verir.

Bu RAM-LFE dizaynda, BFV müştəri girişini ictimai blokçeyn qeyd məlumatından və yalnız əməliyyat və ya marşrut yükləməsini görən müşahidəçilərdən gizlədir. Bu, zəncirin öz-özünə istənilən şifrəli proqramları icra etməsi demək deyil. Torii həll edici proqram təminatı icra mühiti hələ də BFV gizli materialına sahibdir, tənzimlənmiş gizli proqramı qiymətləndirir, icazə verilmiş çıxışı şifrəsini açır və nəticəni təsdiqləyir. Daha sonra blokzincir dəftəri təsdiqi zəncirdəki siyasət kriptoqrafik öhdəlik dəyəri və həll edici açıq açar və ya sübut metadı ilə yoxlayır.

Identifikator istifadə vəziyyəti məqsədli olaraq sadə bir təsviri seçir. Normalizə edilmiş sətir belə kodlaşdırılır:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Hər bir element öz BFV skaler şifrəli mətni kimi şifrələnir. Bu forma normallaşmanı və məlumat konteynerinin yoxlanışını açıq edir, cüzdanların qurmasına imkan verir İctimai parametrlərdən şifrələnmiş sorğular və rezolyutorun ekvivalent şifrələnmiş girişləri sabit protokol nəticəsi sənədi transkripsiyasına kanonlaşdırmasına imkan verir.

### BFV Halqa Modeli {#bfv-ring-model}

BFV arxa uclar neqasiklik polinom halqasından istifadə edir:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

və sadə mətbəx halqası:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

harada:

- \(n\) `polynomial_degree`dır, iki qüvvəsidir
- \(q\) `ciphertext_modulus`-dir
- \(t\) `plaintext_modulus`-dir
- \(q > t\) və \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Sadə mətn əmsal vektorları hər əmsalı miqyaslandırmaqla kodlanır:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

Şifrəni açma mərkəzi hər əmsalı qaldırır:

$$
v = c_0 + c_1 s_k \in R_q
$$

sonra onu yenidən \(R_t\)-ə çevirir:

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Burada \(s_k\) daxili BFV gizli açar polinomu, kənar RAM-LFE həll edici gizli \(s\) deyil.

### BFV Açar Yaradılması {#bfv-key-generation}

Şifrələnmiş identifikator girişi üçün, BFV açar materialı hər bir həll edici sirri və əlaqəli məlumat üzrə deterministikdir:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG aşağıdakı kimi toxumlanır:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

Açar generatorunun nümunələri:

- \(s_k \in \{-1,0,1\}^n\), \(q\)-ə modulo ilə təmsil olunur
- \(a \leftarrow R_q\) bərabər şəkildə
- \(e \in \{-1,0,1\}^n\)

İctimai açar:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Relinearləşdirmə üçün \(R_q\)-dəki zəncir məhsulu \(s_k^2\) olsun. Hər əsas-\(B\) rəqəm \(j\) üçün \(a_j\)-ü bərabər paylanmada və \(e_j\)-i kiçik paylanmadan götürün, sonra isə dərc edin:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

İctimai BFV siyasət metadatası \((n,q,t,B)\), ictimai açar və `max_input_bytes` ehtiva edir. BFV gizli açar və rielinearizasiya açarı həlledici proqram təminatı icra mühitində qalır.

### BFV Şifrələmə və Əməliyyatlar {#bfv-encryption-and-operations}

Bir düz mətn polinomunu \(m\) şifrələmək üçün, tətbiqetmə başqa bir ChaCha20 RNG-i aşağıdakı yerdən toxumlayır:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

O, \(u,e_1,e_2 \in \{-1,0,1\}^n\)-i nümunələşdirir və hesablayır:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

Şifrələnmiş mətn \(c=(c_0,c_1)\)-dir.

Homo-morfik toplama komponent üzrədir:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

Sadə mətn skalarını \(\alpha\) sıfır əmsalına əlavə etmək yalnız \(c_0\)-i dəyişdirir:

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Sadə mətn skalari \(\alpha\) ilə vurmaq hər iki komponenti miqyaslayır:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

İki şifrlənmiş mətn üçün \(c=(c_0,c_1)\) və \(d=(d_0,d_1)\), şifrlənmiş mətnin vurulması əvvəlcə üç ölçülü bir şifrlənmiş mətn hesablayır və hər bir əmsalı \(t/q\) tərəfindən yenidən miqyaslayır:

$$
\tilde c_0 = \left\lfloor \frac{t(c_0 d_0)}{q} \right\rceil \bmod q
$$

$$
\tilde c_1 =
\left\lfloor \frac{t(c_0 d_1 + c_1 d_0)}{q} \right\rceil \bmod q
$$

$$
\tilde c_2 = \left\lfloor \frac{t(c_1 d_1)}{q} \right\rceil \bmod q
$$

Yuxarıdakı bütün məhsullar \(R_q\)-da neqasiklik halqası məhsullarıdır. Sonra \(\tilde c_2\) baza-\(B\) polinomlarına parçalanır:

$$
\tilde c_2 = \sum_j B^j u_j
$$

və yenidən xətti hala gətirildi:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

Nəticə yenə iki komponentli BFV şifrlənmiş mətndir.

### Şəxsiyyət kodlu məlumat konteyneri {#identifier-ciphertext-envelope}

Bir identifikator giriş bayt sətiri:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

skalyar yuvalara kodlanır:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

və qalan bütün slotlar `max_input_bytes + 1`-a qədər sıfırdır. Hər bir skalyar slot \([m_i]\) koeffisiyent-sıfır aydın mətn polinomu kimi şifrələnir. Hər slot üçün şifrələmə toxumu:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

Şifrələnmiş identifikator məlumat konteyneri:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

harada \(M=\mathrm{max\_input\_bytes}\).

### BFV Affine Arxa Uç {#bfv-affine-backend}

`bfv-affine-sha3-256-v1` üçün proqram təminatının icra mühiti əvvəlcə \(s\) və \(A\)-dən BFV açar materialını çıxarır. Çıxarılan açıq parametrlər zəncirdə kriptoqrafik olaraq bağlanmış açıq parametrlərlə tam uyğun olmalıdır.

Afiń dövrə toxumu belədir:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

Bu toxumdan proqram təminatının icra mühiti, \(t\) moduluna görə, 32-sətirli afinə sxemi nümunələr.

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

burada \(m_i\) deşifr edilən identifikasiya yuvalarıdır. Həmomorfik olaraq, şifrələnmiş mətnlər üzərində eyni dəyəri hesablayır:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

Həll edici hər bir \(C_j\)-i deşifrə edir, bütün sonrakı açıq mətn əmsallarının sıfır olmasını tələb edir, sıfır əmsal dəyərlərini baytlara çevirir və yaradır:

$$
O=(y_0,\ldots,y_{31})
$$

Sonra:

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{affine\_opaque}}
\parallel \mathrm{policy\_hash} \parallel O)
$$

$$
\mathrm{receipt\_hash} =
H(D_{\mathrm{affine\_receipt}}
\parallel \mathrm{policy\_hash} \parallel O
\parallel \mathrm{opaque\_id})
$$

### BFV Proqramlaşdırılmış Backend {#bfv-programmed-backend}

`bfv-programmed-sha3-256-v1` üçün, ictimai parametrlər BFV identifikator şifrələmə parametrlərini və əlavə olaraq gizli-proqram kriptoqrafik xülasə dəyərini əhatə edir:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

Cari RAM-FHE profili belədir:

|Sahə|Dəyər|
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

Plaintext şəklində daxil edilən məlumat Torii -a göndərildikdə icra edilməzdən əvvəl eyni BFV məlumat konteynerinə şifrələnir. Həmin server tərəfi şifrələməsi üçün deterministik toxum belədir:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Xarici təmin olunan şifrəli giriş üçün çözən identifikator məlumat konteynerini deşifrə edir və icra etməzdən əvvəl bunu bu deterministik məlumat konteynerinə yenidən şifrələyir. Bu kanonlaşdırma protokol nəticə qeydi kriptoqrafik xəşlərini semantik olaraq bərabər BFV şifrlənmiş mətndə sabit saxlayır.

İlkin şifrəli yaddaş icra zolaqları aşağıdakılardan əldə edilir:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

32 icra xəttindən hər biri üçün proqram icra mühiti \(r_j \in [0,t)\)-i nümunələyir və \(r_j\)-i şifrələyən BFV şifrələnmiş mətnini saxlayır. Sonra gizli proqram şifrələnmiş registrlər və şifrələnmiş yaddaş üzərində icra olunur:

|Təlimat|Cəbr|
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | \(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\) |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\), sonra yenidən xətti hala gətirin |
| `SelectEqZero(dst, cond, z, nz)` | \(R_{\mathrm{cond}}\)-ı deşifrə et; sıfır olduqda \(R_z\)-i seç, yoxsa \(R_{nz}\)-i.|
| `Output(src)` |Çıxış registri siyahısına \(R_{\mathrm{src}}\) əlavə edin.|

Təlimat lentinin bitməsindən sonra rezolver hər bir çıxış registrini deşifrə edir, sıfır əmsalı bayta çevirir və həmin baytları birləşdirir:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

Ümumi proqramlaşdırılmış arxa son kriptoqrafik xəşləri bunlardır:

$$
\mathrm{opaque\_hash} =
H(D_{\mathrm{program\_opaque}}
\parallel \mathrm{policy\_hash} \parallel O)
$$

$$
\mathrm{receipt\_hash}_{\mathrm{program}} =
H(D_{\mathrm{program\_receipt}}
\parallel \mathrm{policy\_hash} \parallel O
\parallel \mathrm{opaque\_hash})
$$

Defolt proqramlaşdırılmış identifikator lentində 64 giriş yeri var. Hər bir yer üçün \(i\), giriş yerini yükləyir, yaddaş icra yolunu yükləyir \(i \bmod 32\), onları əlavə edir və nəticəni çıxarır:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Kriptoqrafik xeşləri və protokol nəticə qeydlərini çıxar {#output-hashes-and-receipts}

Ümumi RAM-LFE icra protokolu nəticə qeydi xam çıxışı imzalamır. O, çıxışın kriptoqrafik xəşini imzalayır:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Torii RAM-LFE icra protokolu nəticə qeydləri üçün əlaqəli məlumat tək protokol-standart proqram identifikasiya baytlarından ibarətdir:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

İmzalanmış protokol nəticəsi qeydiyyat faylının yükləmə hissəsi:

$$
R =
(\mathrm{program\_id},
\mathrm{program\_digest},
\mathrm{backend},
\mathrm{verification\_mode},
\mathrm{output\_hash},
\mathrm{associated\_data\_hash},
\mathrm{executed\_at\_ms},
\mathrm{expires\_at\_ms})
$$

`signed` rejimi üçün:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

Təsdiq `resolver_public_key` ilə imzanı yoxlayır və bütün bu bərabərliklər doğru olmadıqca protokol nəticəsi qeydlərini rədd edir:

$$
R.\mathrm{program\_id} = \mathrm{policy.program\_id}
$$

$$
R.\mathrm{backend} = \mathrm{policy.backend}
$$

$$
R.\mathrm{verification\_mode} = \mathrm{policy.verification\_mode}
$$

$$
R.\mathrm{program\_digest} =
\mathrm{policy.public\_parameters.hidden\_program\_digest}
$$

$$
R.\mathrm{associated\_data\_hash} =
H(N(\mathrm{policy.program\_id}))
$$

Əgər zəng edən `output_hex` təqdim edirsə, yoxlayıcı həmçinin yoxlayır:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

`proof` rejimi üçün attestasiya imza əvəzinə sübut məlumat konteyneri daşıyır. Yoxlama sübut backend-in, dövrə identifikatorunun, açıq giriş sxeminin düzgünlüyünü yoxlayır kriptoloji xəş, təsdiq açarı kriptoloji xəş və açıq ictimai nümunələr sübut doğrulayıcı metadataları və kodlaşdırılmış qəbz-yük kriptoloji xəş ilə uyğun olsun. İcazə verin:

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

Gözlənilən ictimai nümunələr dörd tək-elementli sütundur. Sütun \(j\) 24 sıfır baytı ilə izlənən \(h_{8j}\ldots h_{8j+7}\) baytlarını ehtiva edir:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Identifikator Proyeksiyası {#identifier-projection}

Identifikatorun həlli istifadəçi qarşısında olan qeyri-şəffaf hesab identifikatoru kimi ümumi backend `opaque_hash` istifadə etmir. O, RAM-LFE çıxış kriptoqrafik xəşini identifikatora xas domenlər vasitəsilə proyeksiya edir:

$$
\mathrm{opaque\_id}_{\mathrm{id}} =
H(D_{\mathrm{id\_opaque}}
\parallel N(\mathrm{program\_id})
\parallel \mathrm{output\_hash})
$$

$$
\mathrm{receipt\_hash}_{\mathrm{id}} =
H(D_{\mathrm{id\_receipt}}
\parallel N(\mathrm{program\_id})
\parallel \mathrm{output\_hash}
\parallel \mathrm{opaque\_id}_{\mathrm{id}})
$$

Bir `IdentifierResolutionReceipt` yüksək səviyyəli yükgöndərməni imzalayır:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

İmzalı identifikator protokol nəticə qeydləri üçün:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` protokol nəticəsi qeydlərini yalnız imza və ya sübut etibarlı olduqda, daxili RAM-LFE icra yükü istinad edilən proqram siyasətinə uyğun gəldikdə və `uaid` və `account_id` iddia edilən bağlayıcı olduqda qəbul edir.

## İcra Axını {#execution-flow}

Ümumi RAM-LFE icrası bu formada olur:

1. İdarəetmə və ya operator `RamLfeProgramPolicy` qeydiyyatdan keçirir.
2. Sahib siyasəti aktivləşdirir.
3. Müştəri ictimai siyasət metadatasını Torii-dən oxuyur.
4. Müştəri həll ediciyə dəqiq olaraq bir giriş formasını təqdim edir: sadə mətn `input_hex` və ya şifrələnmiş BFV giriş məlumatları konteyneri.
5. Proqram təminatı icra mühiti gizli proqramı qiymətləndirir və `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash` və bir `RamLfeExecutionReceipt` qaytarır.
6. Müştəri və ya arxa uç, protokol nəticəsi qeydini yayımlanmış siyasətə qarşı yoxlayır, isteğe bağlı olaraq qaytarılan `output_hex` kriptoqrafik xəşləri protokol nəticəsi qeydinin `output_hash` ilə müqayisə edə bilər.
7. Yuxarı səviyyəli göstəriş, məsələn `ClaimIdentifier`, xam girişin yerləşdirilməsi əvəzinə təsdiqlənmiş protokol nəticəsi qeydini yerləşdirə bilər.

```mermaid
flowchart LR
    client["Wallet or application"] --> policy["Read program policy"]
    policy --> input["Normalize and optionally encrypt input"]
    input --> torii["Torii RAM-LFE runtime"]
    torii --> eval["Hidden evaluator"]
    eval --> receipt["Output and execution receipt"]
    receipt --> verify["Client or ledger verifies receipt"]
    verify --> claim["Use receipt in higher-level flow"]
```

## Şəxsiyyət Siyasətləri {#identifier-policies}

Identifikator siyasətləri RAM-LFE ın konkret istifadəsidir. Onlar ümumi proqram siyasətinin üstünə biznes ad sahəsi və normallaşdırma qaydası əlavə edirlər:

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "<POLICY_OWNER>",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "phone#team",
  owner = "<POLICY_OWNER>",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "phone#team")
```

Tanılayıcı təbəqə bağlamaq üçün RAM-LFE protokol nəticə qeyddindən istifadə edir:

- `policy_id`
- gizli funksiya tərəfindən əldə olunan şəffaf olmayan identifikator
- deterministik `receipt_hash`
- hesabın UAID
- tək protokol-standart `account_id`
- ümumi RAM-LFE icra yükü

İstifadəçi qarşılıqlı onboarding üçün hesab ləqəblərini şəxsi identifikasiya vasitələrindən ayırın. Ləqəblər ictimai adlardır; telefon nömrələri, e-poçt ünvanları və oxşar dəyərlər identifikasiya siyasətləri və protokol nəticə qeydləri vasitəsi ilə keçməlidir.

## Torii Marşrutlar {#torii-routes}

Tətbiq-yönümlü marşrut ailəsi aktiv ediləndə, Torii RAM-LFE və identifikator köməkçilərini göstərir:

|Marşrut|Məqsəd|
| --- | --- |
| `GET /v1/ram-lfe/program-policies` |Aktiv və qeyri-aktiv RAM-LFE proqram siyasətlərini və ictimai icra metadata-sını siyahıya alın.|
| `POST /v1/ram-lfe/programs/{program_id}/execute` | `input_hex` və ya `encrypted_input` mənbəyindən bir proqramı icra edin, çıxış heşlərini və vəziyyət saxlamayan qəbzi qaytarın. |
| `POST /v1/ram-lfe/receipts/verify` |Yayım edilmiş siyasətlə `RamLfeExecutionReceipt`-ı yoxlayın və istəyə bağlı olaraq `output_hex`-i `output_hash`-lə müqayisə edin.|
| `GET /v1/identifier-policies` | Siyahı identifikator siyasətləri, normallaşdırma rejimləri, həll edici açarlar və şifrələnmiş giriş metadata-larını siyahıya alın. |
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` |İstifadəçinin `ClaimIdentifier`-a yerləşdirə biləcəyi protokol nəticəsi qeydi verin.|
| `POST /v1/identifiers/resolve` |Aktiv iddia olduqda normalizə edilmiş identifikator girişini bağlı hesabla həll edin.|
| `GET /v1/identifiers/receipts/{receipt_hash}` | Audit və dəstək alətləri üçün qəbz heşinə görə saxlanmış identifikator iddiasını tapın. |

Bu marşrutlara qarşı qurmazdan əvvəl həmişə hədəf düyününün `/openapi.json` sənədini yoxlayın. Mövcudluq düyün quruluşu və şəbəkə profilindən asılıdır.

## Node proqram təminatı icra mühiti {#node-runtime}

Torii-nin prosesdə olan RAM-LFE proqram təminatı icra mühiti `torii.ram_lfe.programs[*]` çərçivəsində konfiqurasiya olunub, `program_id` ilə açarlaşdırılıb. Hər bir konfiqurasiya olunmuş proqram blok zəncirdəki siyasət kriptoqrafik öhdəlik dəyəri ilə uyğun olmalı və qiymətləndirmək və təsdiqləmək üçün lazım olan proqram təminatı icra mühiti materialını təmin etməlidir. protokol nəticə qeydləri. Identifikator marşrutları eyni proqram icra mühitini təkrar istifadə edir; onlar ayrıca identifikator-həll edici konfiqurasiya səthinə ehtiyac duymurlar.

Polisini zəncirdə qeydiyyatdan keçirmək özü kifayət deyil. Hədəf node həm də marşrut ailəsini açıq etməli və icra etməsi gözlənilən proqramlar üçün uyğun proqram təminatı icra mühiti materialına malik olmalıdır.

## Əməliyyat Təhlükəsizlik Qaydaları {#operational-guardrails}

- Qeydiyyat siyasətləri qeyri-aktivdir, ictimai metadata-nı yoxlayın, sonra onları aktiv edin.
- Dəyərləndirici sirrlərini, həll edici imza açarlarını və BFV sirr materialını sənədlərdən, qeydlərdən, əməliyyatlardan və müştəri paketlərindən uzaq saxlayın.
- Hesab ləqəblərində, əməliyyat metadatalarında, hadisələrdə və ya dünya vəziyyəti sahələrində xam identifikatorları qoymayın.
- SDK bir doğrulayıcı təqdim etdikdə, yuxarı səviyyəli təlimatları göndərmədən əvvəl protokol nəticəsi qeydlərini müştəri tərəfində yoxlayın.
- Əski protokol nəticəsi qeydləri həmişəlik etibarlı qalmamalıdır, buna görə müddəti bitmə sahələrindən istifadə edin.
- Yeni proqram və ya identifikator siyasəti qeydiyyatdan keçirərək, müştəriləri miqrasiya edərək və yeni protokol nəticə qeydləri axmağa başladıqdan sonra köhnə siyasəti deaktiv edərək döndərin.

## Əlaqəli Mövzular {#related-topics}

- [Şəxsi Verilənlər Məkanı üçün Sponsor Haqları](/az/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii API son nöqtələr](/az/reference/torii-endpoints.md#app-and-sora-route-families)
- [Anonim Əməliyyatlar](/az/blockchain/anonymous-transactions.md)
