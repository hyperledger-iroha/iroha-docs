---
translation_locale: az
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE Random-Access Machine Laconic Function Evaluation deməkdir. Iroha da, ictimai siyasəti zəncirdə olan, lakin qiymətləndiricisi məntiqi, gizli və ya xam girişləri dünya dövlətinə yazılmamalı olan proqramlar üçün ümumi gizlənmiş funksiya qatıdır. Xüsusi telefon və ya e-poçt axtarışı kimi SORA Nexus identifikator axınları tərəfindən istifadə olunur və bir düyün profili tətbiqetmə ilə üzləşən marşrutları təmin edərkən ümumi Torii proqram icrası köməkçisi olaraq da aşkar edilə bilər.

Zəngin siyasət öhdəliyi və qəbulu təsdiqləmə metadatalarını saxlayır. Bir həllçi və ya Torii icra vaxtı gizli proqramı qiymətləndirir, yalnız icazə verilən çıxışı qaytarır və müştərilərin, dəstək vasitələrinin və ya kitabxana təlimatlarının qeydiyyata alınmış siyasətə uyğun olaraq təsdiq edə biləcəyi bir qəbulu əlavə edir.

## Adlandırma {#naming}

Adlandırma bölünməsi vacibdir:

|Müddət |Məna|
| --- | --- |
|`ram_lfe` |Xarici gizli funksiya abstraksiyası: proqram siyasəti, öhdəliklər, icra qəbulu və qəbulu təsdiqləmə rejimi. |
|`BFV` |Şifreli giriş RAM-LFE arxa tərəflər tərəfindən istifadə olunan Brakerski/Fan-Vercauteren homomorf şifrələmə sxemi. |
|`ram_fhe_profile` |Proqramlaşdırılmış şifrələnmiş icra maşını üçün BFV xüsusi metadata malikdir. Bu, RAM-LFE üçün ikinci ad deyil. |

Məlumat modelində `RamLfeProgramPolicy` və `RamLfeExecutionReceipt` RAM-LFE növləridir. BFV parametrləri, şifrəli mətn qovşaqları və gizli RAM-FHE proqram profili bir siyasət tərəfindən istifadə olunan şifreli icra arxa planına aiddir.

## Kitabda qeyd olunanlar {#what-it-records}

Bir RAM-LFE proqram siyasəti qlobal səviyyədə `program_id` tərəfindən qeydiyyatdan keçirilir.

- Siyasəti aktivləşdirə, deaktiv edə və ya başqa bir şəkildə dəyişdirə bilən sahib hesabı
- Müştərilərə elan edilən arxa end
- Qəbulu yoxlama rejimi, ya `signed` və ya `proof`
- Gizli proqram metadataları və qiymətləndiricinin sirri ilə bağlı bir öhdəlik
- İmzalanmış reseptlərin həllçisi ictimai açarı
- BFV parametrləri və `ram_fhe_profile` kimi seçməli ictimai şifrəli giriş metadataları.
- `active` nişanı, polisin yeni rəsmlər verə biləcəyini nəzarət edir.

Gizli sirr, açıq mətn identifikatorı və gizli proqram bədəni dünya vəziyyətində saxlanılmır. Müştərilər öhdəlikləri, qeyri-şəffaf hashləri, qəbulu hashları, şifrəli mətnlər və proqram həzmlərini qeyri-şəşfi protokol dəyərləri kimi qəbul etməlidirlər.

## Arxa səhifələr {#backends}

Hal-hazırda RAM-LFE dəstəyi üç arxa səviyyəli identifikatorlara əsaslanır:

|Arxa tərəf |istifadə |
| --- | --- |
|`hkdf-sha3-512-prf-v1` |Ödənişə bağlı PRF qiymətləndirmə. |
|`bfv-affine-sha3-256-v1` |BFV tərəfindən dəstəklənmiş gizli bir qiymətləndirmə kodlanmış identifikator boşluqları üzərində. |
|`bfv-programmed-sha3-256-v1` |BFV dəstəklənmiş şifrələnmiş qeydlər və yaddaş yolları üzərində proqramlaşdırılmış icra. |

İdentifikator siyasətləri üçün proqramlaşdırılmış BFV arxa tərəf mühüm müasir yoldur. Bu cüzdanların yerli olaraq normalaşmış girişləri şifrələməsinə imkan verir, həllçi əməliyyatda ictimai bir identifikatoru görmədən qiymətləndirməyə imkan verir, və buraxılış hashini qeydiyyatdan keçmiş proqram siyasətinə bağlayan bir rəsmi göndərir.

## Riyaziyyat {#math}

Bu bölmə mövcud RAM-LFE kodu tərəfindən istifadə olunan tətbiq səviyyəsində algəbrini təsvir edir. Bu təhlükəsizlik sübutu deyil; siyasətlərin, qəbulu və müştərilərin razılaşması lazım olan müəyyənləşdirilmiş transkript və şifrələnmiş qiymətləndirmə modelidir.

### Qeydiyyat {#notation}

Deyirlər:

- \(H(m)\) Iroha `Hash::new(m)`: Blake2b-32 üzərində `m`, son baytın ən az əhəmiyyətli bitini məcbur edərək `1`.
- \(N(x)\) `x` kanonik Norito kodlaması olmalıdır.
- \(a \parallel b\) bayt xətti birləşdirilməsi deməkdir.
- \(\operatorname{le64} ((i) \) imzalanmamış tam rəqəmlərin 8 bayt kiçik endik kodlaşdırılması olmalıdır.
- \(s\) dünya dövlətinin xaricində saxlanan gizli həllçi ola bilər.
- \(P\) dövlət siyasətinin parametrləri olmalıdır.
- \(A\) ilə əlaqəli məlumatlar tələb olunur.
- \(x\) normallaşdırılmış giriş baytları və ya Norito kodlanmış şifrələnmiş giriş bağçası olmalıdır, arxadan etibarən.

RAM-LFE domenlər üçün ayrılmış hashlərdən istifadə edir. Aşağıdakı formulalar domenlərin məqsədi ilə adlandırılır; onların mövcud bayt silsilələri:

|Simvol |Domain silsiləsi |
| --- | --- |
|\(D_{\mathrm{policy}}\) |`iroha.ram_lfe.policy.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{secret}}\) |`iroha.ram_lfe.policy_secret.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{salt}}\) |`iroha.ram_lfe.hkdf_salt.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{hkdf\_opaque}}\) |`iroha.ram_lfe.opaque_info.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{hkdf\_receipt}}\) |`iroha.ram_lfe.receipt_info.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{opaque}}\) |`iroha.ram_lfe.opaque_hash.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{receipt}}\) |`iroha.ram_lfe.receipt_hash.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{affine\_circuit}}\) |`iroha.ram_lfe.bfv_affine.circuit.v1` |
|\(D_{\mathrm{affine\_opaque}}\) |`iroha.ram_lfe.bfv_affine.opaque_hash.v1` |
|\(D_{\mathrm{affine\_receipt}}\) |`iroha.ram_lfe.bfv_affine.receipt_hash.v1` |
|\(D_{\mathrm{program\_memory}}\) |`iroha.ram_lfe.bfv_program.memory.v1` |
|\(D_{\mathrm{program\_opaque}}\) |`iroha.ram_lfe.bfv_program.opaque_hash.v1` |
|\(D_{\mathrm{program\_receipt}}\) |`iroha.ram_lfe.bfv_program.receipt_hash.v1` |
|\(D_{\mathrm{program\_digest}}\) |`iroha.ram_lfe.bfv_program.digest.v1` |
|\(D_{\mathrm{output}}\) |`iroha.ram_lfe.output_hash.v1` |
|\(D_{\mathrm{id\_opaque}}\) |`iroha.ram_lfe.identifier.opaque_hash.v1` |
|\(D_{\mathrm{id\_receipt}}\) |`iroha.ram_lfe.identifier.receipt_hash.v1` |
|\(D_{\mathrm{bfv\_keygen}}\) |`iroha.crypto.fhe.bfv.keygen.v1` |
|\(D_{\mathrm{bfv\_encrypt}}\) |`iroha.crypto.fhe.bfv.encrypt.v1` |
|\(D_{\mathrm{id\_keygen}}\) |`iroha.crypto.fhe.bfv.identifier.keygen.v1` |
|\(D_{\mathrm{id\_slot}}\) |`iroha.crypto.fhe.bfv.identifier.slot.v1` |

### Siyasət öhdəliyi {#policy-commitment}

Siyasət öhdəliyi ictimai parametrləri və gizli həll edən sirrini bir arxa başa bağlayır. Birincisi, sirr ayrı-ayrı şəkildə həyata keçirilir:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Sonra bütün siyasət transkriptini kodlaşdırır:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

və nəşr olunmuş siyasət hash:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

Zəngində olan `PolicyCommitment` aşağıdakılardır:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

Qiymətləndirmə iş vaxtı sirrindən eyni dəyərini yenidən hesablayır. Yenidən hesablanan hash fərqlənirsə, qiymətləndirilmə öhdəlik uyğunsuzluğu ilə uğursuz olur.

### HKDF-SHA3-512 Backend {#hkdf-sha3-512-backend}

`hkdf-sha3-512-prf-v1` üçün çıxış normallaşdırılmış girişdir, lakin qeyri-aşkar identifikator və qəbulu hash gizli bağlanmış PRF çıxışıdır.

Tələb transkripti:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

HKDF duz və pseudorandom açarı aşağıdakılardır:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

Göstərilməz material genişlənir və hash edilir:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

Qəbul materialı əlavə olaraq qeyri-şəffaf idini bağlayır:

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

Arxa ucunda geri qaytarılır:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV Premer {#bfv-primer}

BFV şəbəkə əsaslı homomorf şifrələmə sxemidir. "Homomorf" o deməkdir ki, bir proqram şifrələnmiş dəyərləri əlavə və çoxalda bilər və şifrələndikdən sonra düz mətn dəyərlərində əlavələr və çoxuşları yerinə yetirərkən olduğu kimi eyni nəticəni əldə edə bilər .

RAM-LFE üçün BFV şifrələnmiş giriş mexanizmi kimi istifadə olunur:

1. Cüzdan bir telefon nömrəsi və ya e-poçt ünvanı kimi şəxsi dəyərləri normallaşdırır.
2. Cüzdan baytları kiçik tam saylı boşluqlara çevirir.
3. Hər slot həllçinin BFV ictimai açarı ilə şifrələnir.
4. Çözümçü idman vaxtı gizli proqramı həmin şifrə mətnləri üzərində qiymətləndirir.
5. Runtime yalnız gizli proqram çıxışı və işarələri şifrələyir və ya qəbulu sübut edir.

BFV təxminən deyil, dəqiq tamsaylı aritmetikdir. Buna görə də identifikator baytları və kiçik modullar üçün daha yaxşı uyğun gəlir Qeyri-məsələnmiş nöqtə modelinin nəticəsindən daha çox hesablamalar. Iroha Gündəlik BFV istifadə, hər şifrəli slot bir skalar dəyər modulo daşıyır \(t\), Əsasən bir bayt və ya bir bayt uzunluğu sahəsi. şifrə mətni özü daha böyük tam sayın modulu yaşayır \(q\). Arasındakı boşluq \(q\) və \(t\) Şifrələmə və homomorf əməliyyatların gətirib çıxardığı səs-küy üçün şifrələnmə yeri verir.

BFV şifrəli mətnin iki polinomial komponentləri var:

$$
c=(c_0,c_1)
$$

Gizli açar başqa bir polinomialdır \(s_k\). Şifrəmə komponentləri birləşdirir:

$$
v = c_0 + c_1s_k
$$

Əgər şifrə mətni düzgün formalaşdırılıbsa və səs hələ də kifayət qədər azdırsa, \(v\) ölçülmüş düz mətnlə yaxındır. Dövrələmə sadə mətn koeficientini modulo \(t\) geri alır.

|Sadə əməliyyat |Şifrəli mətn əməliyyatı |
| --- | --- |
|\(m+n\) |Şifrəli mətn komponentlərini əlavə edin. |
|\(m+\alpha\) |\(c_0\) -ə ölçülü düz mətn sabitini əlavə edin. |
|\(\alpha m\) |Hər iki şifrəli mətn komponentini \(\alpha\) ilə ölçmək. |
|\(mn\) |Şifrəli mətn çoxluqlarını qatlayın, yenidən ölçün və sonra yenidən xarakterizə edin. |

Multiplikasiya bahalı bir əməliyyatdır. İki komponentli şifrə mətninin məhsulu təbii olaraq \(1\), \(s_k\) və \(s_k^2\) ilə şifrələnən üçkomponentli şifrəni yaradır. Relinearization \(s_k^2\) terminini normal iki komponentli şifrəli mətnə yenidən qatmaq üçün nəşr edilmiş qiymətləndirmə açarından istifadə edir. Bu, eyni şifrəli məzmunu istifadə edərək sonrakı əlavələri və çoxluqları saxlayır.

BFV həmçinin "məsərəli"dir: hər şifrələnmiş əməliyyat müəyyən bir səs-küy büdcəsini istehlak edir. Bu tətbiq bu büdcəni yeniləmək üçün şifrəli mətnləri başlatmır. Bunun əvəzinə, RAM-LFE kiçik bir `ram_fhe_profile` nəşr edir və yalnız məhdud gizli proqram formasını qəbul edir. Bu, qiymətləndirilməni parametrlər dəstinin dəstəklənmiş dərinliyində saxlayır.Hazırda proqramlaşdırılmış profil sabit qeydiyyat sayını, sabit yaddaş zolağı sayını və ən çox bir sifrə mətni-sifir mətni hər proqramlaşdırılan addım üçün qatlamağa imkan verir.

Bu RAM-LFE dizaynında, BFV müştəri girişini ictimai kitabxana məlumatlarından və yalnız əməliyyatı və ya marşrut payloadunu görən müşahidəçilərdən gizlədir. Torii həllçi işləmə vaxtı hələ də BFV gizli materialına sahibdir, qurulmuş gizlənmiş proqramı qiymətləndirir, icazə verilən çıxışı şifrələyir və nəticəni təsdiq edir.

İdentifikator istifadə halı məqsədyönlü olaraq sadə bir təmsil seçir.

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Hər bir element öz BFV skalar şifrə mətni kimi şifrələnir. Bu forma normalaşmanı və qabıq təsdiqləməsini açıq edir, cüzdanlara ictimai parametrlərdən şifrəli müraciətlər qurmağa imkan verir və həllçiyə ekvivalent şifrəli girişləri sabit qəbulu transkriptinə kanonikalaşdırmağa imkan verir.

### BFV Yüzük modeli {#bfv-ring-model}

BFV arxa tərəflərdə negaciklik polinomial üzük istifadə olunur:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

və sadə mətn üzükü:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

yerində:

- \(n\) - `polynomial_degree`, iki güc
- \(q\) - `ciphertext_modulus`
- \(t\) - `plaintext_modulus`
- \(q > t\) və \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Sadə mətn koeficientləri vektorları hər bir koeficientin miqyasını artıraraq kodlanır:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

Dekriptləşdirmə mərkəzi hissəsi hər bir koeffitsiyentə:

$$
v = c_0 + c_1 s_k \in R_q
$$

sonra onu \(R_t\) olaraq yenidən yuvarlayır:

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Burada \(s_k\) BFV gizli açar polinomudur, xarici RAM-LFE həllçi sırası \(s\) deyil.

### BFV Əsas nəsil {#bfv-key-generation}

Şifreli identifikator girişləri üçün BFV açar materialı həlledici gizli və əlaqəli məlumatlara görə müəyyənləşdirilir:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG aşağıdakı kimi əkin edilir:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

Əsas generator nümunələri:

- \(s_k \in \{-1,0,1\}^n\), modulo \(q\) olaraq təmsil olunur.
- \(a \leftarrow R_q\) vahid olaraq
- \(e \in \{-1,0,1\}^n\)

İctimai açar:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Yeniləmə üçün \(s_k^2\) \(R_q\)-dəki üzük məhsulu olmalıdır. Hər bir baza-\(B\) rəqəm üçün \(j\), kiçik bölüşdürülmədən \(a_j\) və \(e_j\) nümunəsini eyni şəkildə çıxarın və sonra nəşr edin:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

İctimaiyyət BFV siyasət metadata \((n,q,t,B) \), ictimai açar və `max_input_bytes`. İndiki BFV Gizli açar və relinearization açarı həllçi işləmə vaxtında qalır.

### BFV Şifrələmə və əməliyyatlar {#bfv-encryption-and-operations}

Sadə mətn polinomiyasını \(m\) şifrələmək üçün tətbiq başqa bir ChaCha20 RNG toxumları ilə:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

\(u,e_1,e_2 \in \{-1,0,1\}^n\) nümunələrini götürür və hesablayır:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

Şifrəli mətn \(c=(c_0,c_1)\).

Homomorf birləşmə tərkib hissəsi ilə müqayisədə:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

Yalnız \(c_0\) sıfır dəyişikliklər koeffitsientiyə düz mətn skalarını \(\alpha\) əlavə etmək:

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Sadə mətn skalari \(\alpha\) ilə dəfələmək hər iki komponentin miqyasını artırır:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

İki şifrə mətni \(c=(c_0,c_1)\) və \(d=(d_0,d _1)\) üçün şifrə məzmunu dəfələməsi əvvəlcə üç ölçülü bir şifrə mətnini hesablayır və hər bir koeficienti geriyə \(t/q\) ilə ölçür:

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

Yuxarıda göstərilən bütün məhsullar \(R_q\) -dəki negaciklik üzük məhsullarıdır. Sonra \(\tilde c_2\) baza-\(B\) polinomlarına parçalanır:

$$
\tilde c_2 = \sum_j B^j u_j
$$

və yenidən xarakterizə edilmişdir:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

Nəticədə yenidən iki komponentli BFV şifrəli mətn əldə edilir.

### Kimlik şifri mətn qovşusu {#identifier-ciphertext-envelope}

İdentifikator giriş bayt silsiləsi:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

skalar boşluqlara kodlanmışdır:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

və qalan bütün boşluqlar sıfırdan `max_input_bytes + 1` qədərdir. Hər bir skalar boşluq sıfır düz mətn polinomiyası \([m_i]\) kimi şifrələnir.

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

Şifrələnmiş identifikator qovşusu:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

\(M=\mathrm{max\_input\_bytes}\).

### BFV Affine Backend {#bfv-affine-backend}

`bfv-affine-sha3-256-v1` üçün icra vaxtı əvvəlcə BFV açar materialını \(s\) və \(A\) -dən çıxarır.

Əffin dövriyyə toxumları:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

Bu toxumdan sürət nümunələri, modulo \(t\), 32 sıra bir qarışıq dövrü:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

burada \(m_i\) şifrələnmiş identifikator boşluqlarıdır. Homomorfik olaraq, eyni dəyərni şifrə mətnləri üzərində hesablayır:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

Çözücü hər birini \(C_j\) şifrələyir, bütün arxa düz mətn koeficientlərinin sıfır olmasını tələb edir, koefitsiyent-sıfır dəyərlərini baytlara çevirir və formaları:

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

`bfv-programmed-sha3-256-v1` üçün ictimaiyyət parametrləri BFV identifikatorunun şifrələmə parametrlərini əlavə edərək gizli proqramı həzmləyir:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

Hələlik RAM-FHE profili aşağıdakılardan ibarətdir:

|sahə |Qiymət |
| --- | --- |
|`profile_version` | `1` |
|`register_count` | `4` |
|`memory_lane_count` | `32` |
|`ciphertext_mul_per_step` | `1` |
|`encrypted_input_mode` |`resolver_canonicalized_envelope_v1` |
|`min_ciphertext_modulus` | \(2^{52}\) |

Torii ünvanına göndərilən sadə mətn girişləri icra edilməzdən əvvəl eyni BFV qabığına şifrələnir. Server tərəfindəki şifrələmə üçün müəyyənləşdirilmiş toxum:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Xarici olaraq verilən şifrələnmiş giriş üçün həllçi identifikator paltosunu şifləyir və icra edilməzdən əvvəl bu təyinat paltosuna yenidən şifrələyir. Bu kanonikalaşdırma qəbul həşlərini semantik olaraq bərabər BFV şifrə mətnlərində sabit saxlayır.

İlk şifrələnmiş yaddaş zolaqları aşağıdakılardan alınır:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

32 yolun hər biri üçün iş vaxtı nümunələri \(r_j \in [0,t)\) və BFV şifrəli mətni şifrələyən \(r_j\) saxlayır. Gizli proqram daha sonra şifrələnmiş qeydlər və şifrələnən yaddaş üzərində icra olunur:

|Təlimat |Əlcəbrə |
| --- | --- |
|`LoadInput(dst, i)` |\(R_{\mathrm{dst}} \leftarrow C_i\) |
|`LoadState(dst, j)` |\(R_{\mathrm{dst}} \leftarrow S_j\) |
|`StoreState(j, src)` |\(S_j \leftarrow R_{\mathrm{src}}\) |
|`LoadConst(dst, a)` |\(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\) |
|`Add(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
|`AddPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
|`SubPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
|`MulPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
|`Mul(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_aR_b\), sonra yenidən xarakterizə edin |
|`SelectEqZero(dst, cond, z, nz)` |\(R_{\mathrm{cond}}\) şifrələmək; sıfır olduğu zaman \(R_z\) seçin, əks halda \(R_{nz}\). |
|`Output(src)` |\(R_{\mathrm{src}}\) buraxılış qeydiyyatının siyahısına əlavə edin. |

Təlimat bantı bitdikdən sonra həllçi hər bir çıxışı qeydini şifrələyir, sıfır koeficientini baytə çevirir və bu baytları birləşdirir:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

Ümumi proqramlaşdırılmış backend hashləri:

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

Varsayılan proqramlaşdırılmış identifikator lentində 64 giriş boşluğu var. Hər bir boşluq üçün \(i\) giriş boşluğunu yükləyir, yaddaş zolağını \(i \bmod 32\) yükləyir və nəticəni verir:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Çıxış həşləri və rəsmlər {#output-hashes-and-receipts}

Ümumi RAM-LFE icra qəbulu xalisini imzalamır.

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Torii RAM-LFE icra reseptləri üçün, əlaqəli məlumatlar kanonik proqram identifikator baytlarıdır:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

İmzalanmış rəsm yükü:

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

Verifikasiya imzanı `resolver_public_key` ilə yoxlayır və bu bərabərliklərin hamısı aşağıdakıları təsdiqləməsə, qəbulu rədd edir:

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

İstifadəçi `output_hex` təqdim edərsə, yoxlayıcı həmçinin aşağıdakıları yoxlayır:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

`proof` rejimi üçün attestasiya imzanın əvəzinə sübut qovşusunu daşıyır. Verifikasiya sübutun arxa sonunun, dairə idinin, ictimai giriş sxeminin hashinin, yoxlama açarının və açıq ictimaiyyət nümunələrinin sübut təsdiqçisi metadata və kodlanmış resept-payload hashinə uyğun olub olmadığını yoxlayır.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

Gözlənilən ictimai nümunələr dörd bir elementdən ibarət sütundur. \(j\) sütunda \(h_{8j}\ldots h_{8j+7}\) baytları, sonra isə 24 sıfır baytlar var:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### İstifadəçi Proyeksiyası {#identifier-projection}

İdentifikator qətnaməsi istifadəçi qarşısında olan qeyri-şəffaf hesab identifikatoru olaraq ümumi arxa səviyyəli `opaque_hash` istifadə etmir. RAM-LFE çıxışı hashini identifikator xüsusi domenlər vasitəsilə proyekt edir:

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

`IdentifierResolutionReceipt` daha yüksək səviyyəli paylı yükü imzalayır:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

İmzalanmış şəxsiyyət vəsiqəsi rəsmləri üçün:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` qəbulu yalnız imzanın və ya sübutun etibarlı olduğu halda qəbul edir; Əlavə edilən RAM-LFE icra yükü istinad olunan proqram siyasətinə uyğun gəlir; `uaid` və `account_id` iddia edilən bağlayıcıdır.

## İcraat axını {#execution-flow}

Ümumi RAM-LFE icrası aşağıdakı formada olur:

1. İdarəetmə və ya operator qeydiyyatı `RamLfeProgramPolicy`.
2. Məlumdur ki, sahib polisə əməl edir.
3. Müştəri Torii-dən ictimai siyasət metadatalarını oxuyur.
4. Müştəri həllçiyə tam olaraq bir giriş formasını təqdim edir: düz mətn `input_hex` və ya şifrələnmiş BFV giriş müqaviləsi.
5. İdarə vaxtı gizli proqramı qiymətləndirir və `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash` və `RamLfeExecutionReceipt` qaytarır.
6. Müştəri və ya arxa tərəfdən alınan resept nəşr olunmuş siyasətə uyğun olaraq yoxlanılır, seçim yolu ilə geri qaytarılan `output_hex` reseptin `output_hash` hashinə uyğun olub olmadığını yoxlanır.
7. `ClaimIdentifier` kimi daha yüksək səviyyəli bir təlimat xam giriş əvəzinə təsdiqlənmiş qəbulu yerləşdirə bilər.

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

## Kimlik Siyasətləri {#identifier-policies}

İdentifikator siyasətləri RAM-LFE -in konkret istifadəsidir. Onlar ümumi proqram siyasətinin üstündə bir biznes ad məkanı və normallaşma qaydalarını əlavə edirlər:

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

Kimlik təbəqəsi RAM-LFE qəbulu ilə aşağıdakıları bağlayır:

- `policy_id`
- Gizli funksiya ilə əldə edilmiş qeyri-şəffaf identifikator
- Deterministik `receipt_hash`
- Hesabın UAID
- kanonik `account_id`
- Ümumi icra yükü RAM-LFE

İstifadəçiyə yönəlmiş onboarding üçün hesab aliaslarını şəxsi identifikatorlardan ayrı saxlayın. Aliaslar ictimai adlardır; telefon nömrələri, e-poçt ünvanları və oxşar dəyərlər identifikator siyasətləri və qəbulu vasitəsilə axmalıdır.

## Torii Yollar {#torii-routes}

Tətbiqlə üzləşən marşrut ailəsi aktivləşdirildiyi zaman Torii RAM-LFE və identifikator köməkçilərini açıqlayır:

|Marşrut|Məqsəd|
| --- | --- |
|`GET /v1/ram-lfe/program-policies` |Aktiv və qeyri-aktiv RAM-LFE proqram siyasətlərini və ictimai icra metadatalarını göstərin. |
|`POST /v1/ram-lfe/programs/{program_id}/execute` |`input_hex` və ya `encrypted_input` proqramından bir proqram icra edin və çıxışı hashləri əlavə etməklə dövlətsiz qəbulu qaytarın.|
|`POST /v1/ram-lfe/receipts/verify` |Bir `RamLfeExecutionReceipt` nəşr olunmuş siyasətlə müqayisədə yoxlayın və alternativ olaraq `output_hex` ilə `output_hash` müqayisə edin. |
|`GET /v1/identifier-policies` |İdentifikator siyasətlərini, normalaşdırma rejimlərini, həllçi açarlarını və şifrələnmiş giriş metadatalarını siyahıya alın. |
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt` |İstifadəçinin `ClaimIdentifier` daxil edə biləcəyi rüsum buraxın. |
|`POST /v1/identifiers/resolve` |Aktiv tələb mövcud olduqda bağlanmış hesabda normallaşdırılmış identifikator girişini həll etmək. |
|`GET /v1/identifiers/receipts/{receipt_hash}` |Audit və dəstək vasitələri üçün hesabat hash ilə davamlı bir identifikator tələbini axtarın. |

Hər zaman bu yollara qarşı qurmadan əvvəl hədəf qovşağın `/openapi` və ya `/openapi.json` sənədini yoxlayın.

## Qeydiyyat vaxtı {#node-runtime}

Torii-nin icra müddəti RAM-LFE `torii.ram_lfe.programs[*]` altında, `program_id` ilə tənzimlənir. Hər bir qurulmuş proqram silsilədəki siyasət öhdəliklərinə uyğun olmalıdır və qəbulu qiymətləndirmək və təsdiq etmək üçün lazım olan icra müddətli materialı təmin etməlidir. İdentifikator marşrutları bu eyni icra vaxtını yenidən istifadə edir; onlar ayrı bir identifikator-qətnamə həlləri quruluş səthini tələb etmirlər.

Siyasətlərin silsilədə qeydiyyatı təkcə kifayət deyil. Hədəf qovşağı həmçinin marşrut ailəsini aşkar etməlidir və həyata keçirəcəyi gözlənilir proqramlar üçün uyğun işləmə vaxtı materialına malik olmalıdır.

## İşəgötürmə gərginliyi {#operational-guardrails}

- Siyasətləri aktiv olmayan qaydada qeyd edin, ictimai metadataları yoxlayın və sonra onları aktivləşdirin.
- Qiymətləndiricinin sirlərini, həllçi imzalanma açarlarını və BFV gizli materialları sənədlərdən, qeydlərdən, əməliyyatlardan və müştəri paketlərindən gizlət.
- Xüsusi identifikatorları hesab aliaslarına, əməliyyat metadatalarına, hadisələrə və ya dünya dövlətləri sahələrinə yerləşdirməyin.
- SDK təsdiqləyicini aşkar edərkən daha yüksək səviyyəli göstərişlər göndərmədən əvvəl müştərinin tərəfində qəbulu yoxlayın.
- Müvəqqəti qəzetlərin əbədi olaraq qalmaması lazım olan müddətdən sonrakı sahələrdən istifadə edin.
- Yeni bir proqram və ya identifikator siyasətini qeydiyyatdan keçərək, müştərilərin köçürülməsi və yeni qəbulu axdıqdan sonra köhnə siyasəti söndürməklə fırlanın.

## Mövzular {#related-topics}

- [Xüsusi məlumat sahəsi üçün sponsor ödənişləri](/az/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii Son nöqtələr](/az/reference/torii-endpoints.md#app-and-sora-route-families)
- [Anonim Transactions](/az/blockchain/anonymous-transactions.md)
