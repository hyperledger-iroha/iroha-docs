---
translation_locale: ba
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 66436bfdcdfea9bcd52834436dc8b6abe9812549583e6bfca06cbe73d5f75d35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE — Random-Access Machine Laconic Function Evaluation. Iroha-ла ул public policy-һы сылбырҙа булған, әммә evaluator логикаһы, серҙәре йәки сей input-тары донъя торошона яҙылырға тейеш булмаған программалар өсөн дөйөм йәшерен функциялар ҡатламы. Уны шәхси телефон йәки email эҙләү кеүек SORA Nexus идентификатор ағымдары ҡуллана; node profile ҡушымтаға йүнәлтелгән маршруттарҙы ҡушһа, ул Torii программаһын үтәү өсөн дөйөм ярҙамсы итеп тә асылырға мөмкин.

Сылбыр сәйәсәт йөкләмәһе һәм квитанция раҫлау метамәғлүмәттәрен һаҡлай. Резолютор йәки Torii йүгереү ваҡыты йәшерен программаны баһалай, рөхсәт ителгән продукцияны ғына ҡайтарып бирә һәм клиенттарҙың, ярҙам инструменттары йәки бухгалтер инструкциялары теркәлгән сәйәсәткә ҡаршы тикшереп була торған квитанцияны ҡуша.

## Исемләү {#naming}

Исемде бүлеү мөһим:

|Мөрәжәғәтнамә|Мәғәнәһе |
| --- | --- |
|`ram_lfe` |Тышҡы йәшерен функция абстракцияһы: программа сәйәсәте, йөкләмәләр, үтәү квитанциялары һәм квитанцияларҙы раҫлау режимы. |
|`BFV` |Brakerski/Fan-Vercauteren гомоморф шифрлау схемаһы RAM-LFE шифрланған инеү менән ҡулланыла. |
|`ram_fhe_profile` |BFV программалаштырылған шифрланған башҡарыу машинаһы өсөн үҙенсәлекле метамәғлүмәт. Был RAM-LFE икенсе исеме түгел. |

Мәғлүмәт моделендә `RamLfeProgramPolicy` һәм `RamLfeExecutionReceipt` RAM-LFE типтары. BFV параметрҙары, шифрлы текст конверттары һәм йәшерен RAM-FHE программа профиле сәйәсәт тарафынан ҡулланылған шифрланған башҡарыу бэкэнд ҡарай.

## Ул нимә яҙған ? {#what-it-records}

RAM-LFE программаһы сәйәсәте бөтә донъя буйынса `program_id` тарафынан теркәлгән.

- сәйәсәтте әүҙемләштерә, һүндерә йәки башҡаса үҙгәртә алған хужа иҫәбенә
- клиенттарға иғлан ителгән артҡы план
- `signed` йәки `proof` квитанцияһын раҫлау режимы
- йәшерен программаның метамәғлүмәттәре һәм баһалаусы серенә йөкләмә
- ҡул ҡуйылған квитанциялар өсөн хәл итеүсе асыҡ асҡысы
- BFV һәм `ram_fhe_profile` параметрҙары кеүек асыҡ шифрланған инеү метамәғлүмәттәре.
- `active` флагы сәйәсәт яңы квитанциялар сығара аламы, юҡмы икәнен тикшерә.

Яшерен сер, асыҡ текст идентификаторы ҡиммәте һәм йәшерелгән программа корпусы донъя торошонда һаҡланмай.Клиенттар йөкләмәләрҙе, үтә күренмәгән хештарҙы, квитанция хештарын, шифрлы текстарҙы һәм программаны эшкәртеүҙе үтә күренмәле протокол ҡиммәттәре тип иҫәпләргә тейеш.

## Артабанғы мәғлүмәттәр {#backends}

Әлеге ваҡытта RAM-LFE ярҙам өс артҡы идентификаторға йүнәлтелгән:

|Арҡысаҡ |Ҡулланыу |
| --- | --- |
|`hkdf-sha3-512-prf-v1` |PRF йөкләмәле баһа. |
|`bfv-affine-sha3-256-v1` |BFV ярҙамында шифрланған идентификатор урындары буйынса серле аффина баһаһы. |
|`bfv-programmed-sha3-256-v1` |BFV ярҙамында кодланған реестрҙар һәм хәтер юлдары аша программалаштырылған башҡарыу. |

Идентификатор сәйәсәттәре өсөн, программалаштырылған BFV backend мөһим заманса юлды. Ул аҡса янсыҡтары шифрлаштырылған инеү локаль рәүештә рөхсәт итә, хәл итеүсе транзакцияла асыҡ идентификатор күрмәйенсә баһаларға мөмкинлек бирә. һәм сығанаҡ хешын теркәлгән программа сәйәсәте менән бәйләгән квитанцияны кире ҡайтара.

## Математика {#math}

Был бүлектә ғәмәлгә ашырыу кимәлендәге алгебра хәҙерге RAM-LFE коды тарафынан ҡулланыла. Ул хәүефһеҙлек иҫбатламаһы түгел; ул сәйәсәт, квитанциялар һәм клиенттар килешергә тейеш булған детерминистик транскрипт һәм шифрланған баһалау модели.

### Билдәләмә {#notation}

Алып барыу:

- \(H(m)\) Iroha `Hash::new(m)`: Blake2b-32 over `m`, һуңғы байттың иң әһәмиәтһеҙ бите менән `1`.
- \(N(x)\) `x` каноник Norito кодировкаһы булырға.
- \(a \parallel b\) уртаса байт-сыбыҡ бәйләнеше.
- \(\operatorname{le64}(i) \) 8-байт бәләкәй эндиан кодировкаһы булып, ҡултамғаһыҙ бөтөн һан.
- \(s\) — донъя торошонан ситтә һаҡланған resolver сере.
- \(P\) — public policy параметрҙары.
- \(A\) менән бәйле мәғлүмәттәрҙе һорарға.
- \(x\) нормализацияланған инеү байт йәки Norito-кодланған шифрланған инеү конверты булырға тейеш, ни тиклем артҡы яҡтан.

RAM-LFE домендар менән айырылған хеш ҡуллана. Түбәндәге формулалар домендарҙы маҡсат буйынса атай; уларҙың хәҙерге байт ҡылдары:

|Символ |Домендар рәттәре |
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

### Политик йөкләмәһе {#policy-commitment}

Policy commitment асыҡ параметрҙарҙы һәм йәшерен resolver серен backend менән бәйләй. Тәүҙә сер айырым commit ителә:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Һуңынан сәйәсәттең тулы транскрипты кодлана:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

һәм баҫылған сәйәсәт хэшиғы:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

Сылбырҙа `PolicyCommitment` - был:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

Һораулау һөҙөмтәһендә ҡабаттан шул уҡ ҡиммәткә иҫәпләнә. Әгәр ҡабаттан иҫәпләнгән хэш айырылһа, баһалау йөкләмәнең тап килмәүсәнлеге менән уңышһыҙ була.

### HKDF-SHA3-512 Арҡысаҡ {#hkdf-sha3-512-backend}

`hkdf-sha3-512-prf-v1` өсөн сығанаҡ - нормалаштырылған инеүҙең үҙе, әммә үтә күренмәле идентификатор һәм квитанция хэшиғы йәшерен бәйләнештәге PRF сығанаҡтар.

Талаптың транскрипты:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

HKDF тоҙ һәм псевдореандум асҡысы:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

Прозрачный материал киңәйтелә һәм тарҡала:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

Квитанция материалдары шулай уҡ үтә күренмәле идентификаторҙы бәйләй:

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

Бакинд кире ҡайтарыла:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV Пример {#bfv-primer}

BFV — lattice-based homomorphic encryption схемаһы. “Homomorphic” тигәнде аңлата: программа encrypted values-ты ҡуша һәм ҡабатлай ала, ә decryption-дан һуң plaintext values өҫтөндә шул уҡ ҡушыу һәм ҡабатлауҙы башҡарғандағы һөҙөмтәне ала.

RAM-LFE өсөн, BFV шифрланған инеү механизмы булараҡ ҡулланыла:

1. Сумка телефоны йәки электрон почта адресы кеүек шәхси ҡиммәттәрҙе нормализациялай.
2. Бухгалтерлыҡ аҡса янсығы байттарҙы бәләкәй тулы һанлы слотҡа әйләндерә.
3. Һәр слот резюсерҙың BFV асыҡ асҡысы менән шифрлана.
4. Резолюторҙың йүгереү ваҡыты был шифрлы текстар өҫтөндә йәшерен программаны баһалай.
5. Уйын ваҡыты йәшерен программа сығанағын ғына шифрламай һәм квитанцияны раҫлай.

BFV тигеҙ һандар арифметикаһы түгел, яҡынса арифметик. Шуға күрә ул идентификатор байт һәм бәләкәй модульле өсөн яҡшыраҡ яраҡлы иҫәпләүҙәргә ҡарағанда, йөҙөү нөктәһе моделе һығымтаһы. Iroha Хәҙерге BFV ҡулланыу, һәр шифрланған слот бер скаляр ҡиммәтле модуль йөрөтә \(t\), ғәҙәттә байт йәки байт оҙонлоғо яланы. шифрлы текстың үҙендә күпкә ҙурыраҡ бөтөн һандың модуле йәшәй. \(q\). Аралағы айырма \(q\) һәм \(t\) шифрлау һәм гомоморф операциялар индергән шау-шыу өсөн дешифрировка мөмкинлеген бирә.

BFV шифрлы текстың ике полиномия компоненты бар:

$$
c=(c_0,c_1)
$$

Серле асҡыс - тағы бер полиномиаль \(s_k\). Дешифровка компоненттарын берләштерә.

$$
v = c_0 + c_1s_k
$$

Әгәр шифрлау тексы дөрөҫ формалаштырылған һәм шау-шыу һаман да етерлек бәләкәй, \(v\) күләмле ябай текстҡа яҡын. түңәрәкләндереү ябай текст коэффициентын кире ҡайтара \(t\). Файҙалы үҙенсәлек - шифрлы текст операциялары был структураны һаҡлай:

|Ябай эш итеү |Шифрлы текст операцияһы |
| --- | --- |
|\(m+n\) |Шифрлы текст компоненттарын өҫтәгеҙ. |
|\(m+\alpha\) |\(c_0\)ға киңәйтелгән ябай текст даимиһын өҫтәгеҙ. |
|\(\alpha m\) |Ике шифрлы текст компоненттарын ла \(\alpha\) менән үлсәү. |
|\(mn\) |Шифрлы текст полиномияларын ҡабатлау, күсәйтеү, һуңынан релинеарлаштырыу. |

Күпләтеү - ҡиммәтле операция. Ике компонентлы шифрлы тексттың продукты тәбиғи рәүештә \(1\), \(s_k\) һәм \(s_k^2\) менән шифрланған өс компонентлы Шифрлы текст булдыра. Relinearization \(s_k^2\) терминын нормаль ике компонентлы шифрлы текстҡа ҡабатлау өсөн баҫылған баһалау клавиатураһын ҡуллана.

BFV шулай уҡ "күләмле" була: һәр шифрланған операция ниндәйҙер тауыш бюджетын сарыф итә. Был тормошҡа ашырыу был бюджетты яңыртыу өсөн шифрлы текстарҙы ҡуҙғатмай. Киреһенсә, RAM-LFE бәләкәй `ram_fhe_profile` баҫтыра һәм сикләнгән йәшерен программа формаһын ғына ҡабул итә. Был баһалау параметрҙар йыйылмаһының хупланған тәрәнлеге эсендә һаҡлана. Әлеге программалы профиль даими реестр һанын, даими хәтер юлы һанын һәм программалы аҙым һайын бер шифрлы текст-шифрлы текст ҡабатланыуын рөхсәт итә.

Ошонда RAM-LFE дизайн, BFV клиент мәғлүмәттәрен асыҡ бухгалтер мәғлүмәттәре һәм транзакцияны ғына күргән күҙәтеүселәрҙән йәшереп тора . йәки маршрут файҙалы йөк. Был селтәр үҙенән-үҙе шифрланған программалар үтәй тигәнде аңлатмай. Torii резюллер эшләү ваҡыты һаман да BFV йәшерен материал хужаһы, конфигурацияланған йәшерелгән программаны баһалай, рөхсәт ителгән сығыуҙы дешифровкалай һәм һөҙөмтәне раҫлай. Артабан иҫәп-хисап ҡаҙнаһы раҫлауҙы селтәрҙәге сәйәсәт йөкләмәһе буйынса тикшерә һәм асыҡ асҡыс йәки иҫбатлау метамәғлүмәттәре менән хәл итә.

Идентификатор ҡулланыу осрағы маҡсатлы рәүештә ябай сағыштырыу һайлай. Нормальләштерелгән штринг түбәндәгесә индерелә:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Һәр элемент үҙенең BFV скаляр шифрлы тексы булараҡ шифрлана. Был форма нормализацияны һәм конверт раҫлауҙы асыҡлай, аҡса янсыҡтарына йәмәғәт параметрҙарынан шифрланған һорауҙар төҙөргә мөмкинлек бирә, ә хәл итеүсегә тейешле шифрланған инеүҙәрҙе тотороҡло квитанция транскриптына канонизациялауға мөмкинлек бирә.

### BFV ҡулса моделе {#bfv-ring-model}

BFV backends negacyclic polynomial ring ҡулланыу:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

һәм ябай текст ҡулсаһы:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

ҡайҙа:

- \(n\) - `polynomial_degree`, ике ҡеүәтле
- \(q\) - `ciphertext_modulus`
- \(t\) - `plaintext_modulus`
- \(q > t\) һәм \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Ябай текст коэффициенты векторҙары һәр коэффициентты масштаблаштырыу менән кодлана:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

Дешифровка үҙәк күтәреүсе һәр коэффициенты:

$$
v = c_0 + c_1 s_k \in R_q
$$

һуңынан уны \(R_t\) тип ҡабатлаясаҡ:

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Бында \(s_k\) - BFV серле асҡыслы полиномияһы, тышҡы RAM-LFE хәл итеүсе серле \(s\) түгел.

### BFV Ключевое поколение {#bfv-key-generation}

Шифрланған идентификаторға инеү өсөн BFV серле мәғлүмәтте һәм уға бәйле мәғлүмәттәрҙе хәл итеүсе өсөн билдәләүсән:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG сәселгән:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

Төп генератор өлгөләре:

- \(s_k \in \{-1,0,1\}^n\), Modulo \(q\) тип күрһәтелгән.
- \(a \leftarrow R_q\) бер төрлө
- \(e \in \{-1,0,1\}^n\)

Йәмәғәт асҡысы:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Линейкалаштырыу өсөн, let \(s_k^2\) сыбыҡ продукт булып тора \(R_q\). Һәр база өсөн...\(B\) цифрлы \(j\), пробка \(a_j\) бер төрлө һәм \(e_j\) Бәләкәй таратыуҙан һуң:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

Йәмәғәт BFV сәйәсәт метамәғлүмәттәре \(((n,q,t,B)\), асыҡ асҡыс һәм `max_input_bytes`. BFV серле асҡысы һәм рельефлаштырыу асҡысы хәл итеүсе эшләү ваҡытында тора.

### BFV Шифрлау һәм операциялар {#bfv-encryption-and-operations}

Ябай текст полиномияһын шифрлау өсөн \(m\), ғәмәлгә ашырыу орлоғонан икенсе ChaCha20 RNG:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

Ул \(u,e_1,e_2 \in \{-1,0,1\}^n\) өлгөләрен ала һәм иҫәпләй:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

Шифрлау тексы \(c=(c_0,c_1)\).

Гомоморф өҫтәмә компоненттар буйынса:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

\(\alpha\) ябай текстлы скалярҙы коэффициенты менән генә алмаштырыу \(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Ябай текст буйынса \(\alpha\) үлсәү менән ҡабатлау ике компонентты ла үлсәй:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

Ике шифрлы текст \(c=(c_0,c_1)\) һәм \(d=(d_0,d_1)\) өсөн шифрлы тексты ҡабатлау башта өс ҙурлыҡтағы шифрлы мәтнәне иҫәпләп сығара һәм һәр коэффициентты \(t/q\) менән ҡайтарып үлсә:

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

Өҫтә иҫкә алынған бөтә продукттар - Негациклик ҡулса продукцияһы \(R_q\). Шунан һуң \(\tilde c_2\) базаға тарҡала...\(B\) полиномиялар:

$$
\tilde c_2 = \sum_j B^j u_j
$$

һәм үҙгәртеп ҡоролған:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

Һөҙөмтәлә тағы ике компонентлы BFV шифрлы текст барлыҡҡа килә.

### Идентификатор шифрлау тексы конверты {#identifier-ciphertext-envelope}

Идентификатор инеү байты штригы:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

скаляр урындарҙа кодлана:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

һәм ҡалған бөтә слоттар `max_input_bytes + 1` тиклем нулдән тора.Һәр скаляр слот коэффициент-нуль ябай текст полиномияһы \([m_i]\) булараҡ шифрлана.

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

Шифрланған идентификатор конверты түбәндәге:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

унда \(M=\mathrm{max\_input\_bytes}\).

### BFV Әффине Бакинд {#bfv-affine-backend}

`bfv-affine-sha3-256-v1` өсөн, башлыса BFV төп материалынан \(s\) һәм \(A\) сығарылған йәмәғәт параметрҙары сылбырҙа commit ителгән йәмәғәт параметрына теүәл тап килергә тейеш.

Афина схемаһының орлоғо:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

Был орлоҡтоң үтәү ваҡыты өлгөләре, modulo \(t\), 32-се рәтле аффина схемаһы:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

унда \(m_i\) - шифрланған идентификатор участкалары. Гомоморфик яҡтан, ул шифрлы текстар буйынса бер үк ҡиммәтте иҫәпләй:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

Резолютор \(C_j\) һәр береһен дешифровкалай, бөтә артта ҡалған ябай текст коэффициенттарының нуль булырға тейешлеген талап итә, коэффициент-нуль ҡиммәттәрҙе байтҡа үҙгәртә һәм формалар:

$$
O=(y_0,\ldots,y_{31})
$$

Шунан:

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

### BFV Программалаштырылған артҡы этап {#bfv-programmed-backend}

`bfv-programmed-sha3-256-v1` өсөн асыҡ параметрҙар BFV идентификаторы шифрлау параметрын һәм йәшерен программаны эшкәртеүҙе үҙ эсенә ала:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

Хәҙерге RAM-FHE профиле:

|Баҫыу |Ҡиммәт |
| --- | --- |
|`profile_version` | `1` |
|`register_count` | `4` |
|`memory_lane_count` | `32` |
|`ciphertext_mul_per_step` | `1` |
|`encrypted_input_mode` |`resolver_canonicalized_envelope_v1` |
|`min_ciphertext_modulus` | \(2^{52}\) |

Torii адресына тапшырылған асыҡ текст инеүе башҡарыу алдынан шул уҡ BFV конвертына шифрлана. Сервер яғында шифрлау өсөн детерминистик орлоҡ:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Тышҡы яҡтан тәьмин ителгән шифрланған инеү өсөн, хәл итеүсе идентификатор конвертын дешифровкалай һәм уны ошоға ҡабаттан шифрлана. Ҡатнашыуға тиклем детерминистик конверт. был канонлаштырыу ҡабул итеү хештарын симантик тигеҙлек буйынса тотороҡло һаҡлай BFV шифрлы текстар.

Баштағы шифрланған хәтер юлдары түбәндәгеләрҙән алынған:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

32 юлдың һәр береһе өсөн йүгереү ваҡыты өлгөләре \(r_j \in [0,t)\) һәм BFV шифрлау тексын һаҡлау \(r_j\). Һуңынан йәшерен программа шифрланған реестрҙар һәм шифрланған хәтер аша башҡарыла:

|Уҡытыу |Алгебра |
| --- | --- |
|`LoadInput(dst, i)` |\(R_{\mathrm{dst}} \leftarrow C_i\) |
|`LoadState(dst, j)` |\(R_{\mathrm{dst}} \leftarrow S_j\) |
|`StoreState(j, src)` |\(S_j \leftarrow R_{\mathrm{src}}\) |
|`LoadConst(dst, a)` |\(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\) |
|`Add(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
|`AddPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
|`SubPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
|`MulPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
|`Mul(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_aR_b\), һуңынан яңынан һыҙыҡ өҫтөнә алынығыҙ |
|`SelectEqZero(dst, cond, z, nz)` |Дешифрировать \(R_{\mathrm{cond}}\); һайлағыҙ \(R_z\), әгәр был нуль булһа, башҡаса \(R_{nz}\). |
|`Output(src)` |\(R_{\mathrm{src}}\) сығанаҡ реестры исемлегенә ҡушыу. |

Инструкция таҫмаһы тамамланғандан һуң, хәл итеүсе һәр сығанаҡ реестрын шифрлай, нуль коэффициентын байтҡа әйләндерә һәм был байттарҙы бәйләй:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

Дөйөм программалаштырылған бэк-энд хештары:

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

Дефолт программалы идентификатор таҫмаһында 64 инеү участкаһы бар. Һәр слот өсөн \(i\), ул инеү участкаһын йөкләй, хәтер полосаһын йөкләй \(i \bmod 32\), уларҙы өҫтәй һәм һөҙөмтәне сығара:.

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Сығарылыштар һәм квитанциялар {#output-hashes-and-receipts}

Дөйөм RAM-LFE ғәмәлгә ашырыу квитанцияһы сым сығанаҡҡа ҡулланмай. Ул сығанаҡ хэшиғына ҡул ҡуя:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Torii RAM-LFE ғәмәлгә ашырыу квитанциялары өсөн, бәйле мәғлүмәттәр - канон программа идентификаторы байт:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

Ҡул ҡуйылған квитанцияның файҙалы йөкләмәһе:

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

`signed` режимы өсөн:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

Тикшереү ҡултамғаны `resolver_public_key` менән тикшерә. Әгәр түбәндәге тигеҙлектәрҙең барыһы ла үтәлмәһә, receipt кире ҡағыла:

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

Әгәр саҡырыусы `output_hex` тапшыра икән, тикшереүсе шулай уҡ:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

`proof` режимы өсөн аттестация ҡултамға урынына иҫбатлау конверты менән йөрөтөлә. Тикшереү һөҙөмтәһе иҫбатлау артында, схема идентификаторы, йәмәғәт инеү схемаһы хэшигы, асыҡлау асҡысы хэшиғы һәм асыҡланған асыҡ миҫалдар иҫбатлау верификаторы метамәғлүмәттәре һәм кодланған квитанция-уңыш йөкләмәһе хэшиге менән тап киләме икәнлеген тикшерә.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

Көтөлгән асыҡ миҫалдар - дүрт бер элементлы бағана. \(j\) бағанаһында \(h_{8j}\ldots h_{8j+7}\) байты, һуңынан 24 нуль байты бар:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Идентификатор проекцияһы {#identifier-projection}

Идентификатор резолюцияһы ҡулланыусы алдындағы асыҡ булмаған иҫәп-хисап идентификаторы булараҡ дөйөм бэкэнд `opaque_hash` ҡулланмай. Ул RAM-LFE сығарылыш хешын идентификаторға ярашлы домендар аша проекциялай.

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

`IdentifierResolutionReceipt` юғары кимәлдәге файҙалы йөкләмәгә ҡул ҡуя:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

Ҡул ҡуйылған идентификацион квитанциялар өсөн:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` квитанцияны ҡултамға йәки иҫбатлау раҫланған осраҡта ғына ҡабул итә, индерелгән RAM-LFE башҡарыу йөкләмәһе күрһәтелгән программа сәйәсәтенә тап килә, ә `uaid` һәм `account_id` - талап ителгән бәйләнешле.

## Үтәү ағымы {#execution-flow}

RAM-LFE генераль үтәлеше түбәндәге формаға эйә:

1. Идара итеү йәки оператор теркәлгән `RamLfeProgramPolicy`.
2. Собственник полисҡа инә.
3. Клиент Torii-ҙан public policy metadata-һын уҡый.
4. Клиент хәл итеүсегә туранан-тура бер инеү формаһын ебәрә: ябай текст `input_hex` йәки шифрланған BFV инеү конверты.
5. Йүгереү ваҡыты йәшерен программаны баһалай һәм кире ҡайта `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash` һәм `RamLfeExecutionReceipt`.
6. Клиент йәки артта ҡалған кеше квитанцияны баҫтырылған сәйәсәт менән раҫлай, вариант буйынса кире ҡайтарылған `output_hex` квитанцияның `output_hash` хешенә тура киләме икәнен тикшерә.
7. Юғары кимәлдәге инструкция, мәҫәлән `ClaimIdentifier`, сыма инеү урынына раҫланған квитанцияны индерергә мөмкин.

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

## Идентификатор сәйәсәте {#identifier-policies}

Идентификатор сәйәсәттәре RAM-LFE конкрет ҡулланыу. Улар дөйөм программа сәйәсәте өҫтөндә бизнес исемдәр киңлеге һәм нормализация ҡағиҙәһе өҫтәй:

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

Идентификатор ҡатламы RAM-LFE квитанцияһын ҡулланып:

- `policy_id`
- йәшерелгән функциянан алынған үтә күренмәле идентификатор
- Детерминистик `receipt_hash`
- иҫәбенең UAID
- `account_id`
- RAM-LFE генераль үтәү йөкләмәһе

Ҡулланыусыға йүнәлтелгән инеү өсөн иҫәп-хисап исемдәрен шәхси идентификаторҙарҙан айырып ҡалдырығыҙ. Алфавиттар - асыҡ исемдәр; телефон номерҙары, электрон почта адрестары һәм шуға оҡшаш ҡиммәттәр идентификатор сәйәсәттәре аша үткәрелергә тейеш һәм квитанциялар.

## Torii Юлдар {#torii-routes}

Әгәр ҡушымтаға ҡараған маршрут ғаиләһе эшләй башлаһа, Torii RAM-LFE һәм идентификатор ярҙамсыларын асыҡлай:

|Маршрут |Маҡсат |
| --- | --- |
|`GET /v1/ram-lfe/program-policies` |Актив һәм актив булмаған RAM-LFE program policy-ҙарын һәм public execution metadata-һын күрһәтеү. |
|`POST /v1/ram-lfe/programs/{program_id}/execute` |`input_hex` йәки `encrypted_input` аша бер program-ды үтәү һәм output hash-тары менән stateless receipt ҡайтарыу. |
|`POST /v1/ram-lfe/receipts/verify` |`RamLfeExecutionReceipt` -ны баҫтырылған сәйәсәт менән тикшерегеҙ һәм `output_hex` - `output_hash` менән сағыштырығыҙ. |
|`GET /v1/identifier-policies` |Идентификатор сәйәсәттәрен, нормализация режимын, резульвер асҡыстарын һәм шифрланған инеү метамәғлүмәттәре исемлеген яҙығыҙ. |
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt` |Ҡулланыусы `ClaimIdentifier`ға индерергә мөмкин булған квитанцияны сығара. |
|`POST /v1/identifiers/resolve` |Әгәр актив талап бар икән, бәйләнгән иҫәбкә нормалаштырылған идентификатор индереүҙе хәл итергә. |
|`GET /v1/identifiers/receipts/{receipt_hash}` |Аудит һәм ярҙам инструменттары өсөн квитанция хэш ярҙамында даими идентификатор талаптары эҙләгеҙ. |

Был маршруттарҙы төҙөү алдынан һәр ваҡыт маҡсатлы узелдың `/openapi.json` документын тикшерегеҙ. Ҡулланыуы узел төҙөлөшө һәм селтәр профиле менән бәйле.

## Нодтар эшләү ваҡыты {#node-runtime}

Torii-ның процесста эшләү ваҡыты RAM-LFE `torii.ram_lfe.programs[*]` аҫтында, `program_id` менән билдәләнә. Һәр конфигурацияланған программа селтәрҙәге сәйәсәт йөкләмәһенә тап килергә тейеш һәм квитанцияларҙы баһалау һәм раҫлау өсөн кәрәкле ғәмәлгә ашырыу ваҡытын тәьмин итергә тейеш. Идентификатор маршруттары был уҡ ваҡытта эшләй башлай; улар айырым идентификатор-резолютор конфигурацияһы өҫкө йөҙө кәрәкмәй.

Политиканы сылбырҙа теркәү үҙе үк етерлек түгел. маҡсатлы узел шулай уҡ маршрут ғаиләһен асырға тейеш һәм уның тормошҡа ашырыуы көтөлә программалар өсөн тап киләһе ваҡыттағы материалға эйә булырға тейеш.

## Оператив ҡарауылдар {#operational-guardrails}

- Политикаларҙы теркәгеҙ, асыҡ метамәғлүмәттәрҙе тикшерегеҙ, һуңынан уларҙы әүҙемләшегеҙ.
- Документтарҙан, журналдарҙан, транзакцияларҙан һәм клиенттар төркөмдәренән йәшерен баһалаусы серҙәрен, резолютор ҡултамғалау асҡыстарын һәм BFV серле материалдарҙы һаҡлағыҙ.
- Сей идентификаторҙарҙы account alias-тарына, transaction metadata-һына, event-тарға йәки world-state field-тарына ҡуймағыҙ.
- SDK раҫлаусыны асыҡлағанда, юғары кимәлдәге күрһәтмәләрҙе ебәрер алдынан клиент яғынан квитанцияларҙы тикшерегеҙ.
- Иҫкергән квитанциялар мәңгегә ғәмәлдә булмаҫҡа тейеш булған ваҡыты сыҡҡан баҫыуҙарҙы ҡулланығыҙ.
- Яңы программаны йә идентификатор сәйәсәтен теркәү, клиенттарҙы күсереү һәм иҫке сәйәсәтте яңы квитанциялар сыҡҡандан һуң һүндереү юлы менән әйләнегеҙ.

## Төрлө темалар {#related-topics}

- [Шәхси мәғлүмәттәр биләмәһе өсөн спонсорлыҡ түләүҙәре](/ba/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii Оҙаҡҡы һыҙаттар](/ba/reference/torii-endpoints.md#app-and-sora-route-families)
- [Аноним транзакциялар](/ba/blockchain/anonymous-transactions.md)
