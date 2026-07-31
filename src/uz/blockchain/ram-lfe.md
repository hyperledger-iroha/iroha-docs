---
translation_locale: uz
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE "Random-Access Machine Laconic Function Evaluation" deb nomlanadi.
Iroha, bu davlat siyosati dasturlari uchun umumiy yashirin funksiya qatlami
zanjirda mavjud bo'lsa-da, ammo uning baholovchi mantiqiy, maxfiy yoki xom ma'lumotlari
bu davlat tomonidan ishlatiladi. SORA Nexus identifikator oqimlari, masalan:
xususiy telefon yoki elektron pochta orqali qidirish, shuningdek umumiy Torii
dasturni bajarish yordamchisi, agar nod profilida dasturga mos yo'nalishlarni qo'llash mumkin bo'lsa.

Zildirak siyosat majburiyatlari va qabulni tasdiqlash metadatalarni saqlaydi.
resolver yoki Torii Runtime yashirin dasturni baholaydi, faqat
ruxsat etilgan chiqindi, va mijozlar, qo'llab-quvvatlash vositalar yoki
ko'rsatmalar ro'yxatga olingan siyosat bilan taqqoslanishi mumkin.

## Nomlash {#naming}

Nomlash boʻlinishi muhimdir:

| Ma'lumotlar | Ma'nosi |
| --- | --- |
| `ram_lfe` | Tashqi yashirin funktsiya abstraksiyasi: dastur siyosati, majburiyatlari, ijro tushumlari va tushumlarni tasdiqlash usuli. |
| `BFV` | Kodlangan kirish orqali ishlatiladigan Brakerski/Fan-Vercauteren homomorf shifrlash sxemasi RAM-LFE orqa tomonni. |
| `ram_fhe_profile` | BFV- dasturlangan shifrlangan ijro etuvchi mashina uchun maxsus metadotlar. RAM-LFE. |

Ma'lumotlar modelida, `RamLfeProgramPolicy` va `RamLfeExecutionReceipt` bo'lgan
RAM-LFE turlari. BFV parametrlar, kodlangan matn zarflari va yashirin
RAM-FHE dasturning profillari kodlangan ijro natijasida ishlatiladigan
siyosat.

## Yozuvlar {#what-it-records}

A RAM-LFE dastur siyosati global miqyosda `program_id`. Siyosat
tarkibida:

- foydalanuvchi hisobini faollashtirishi, deaktiv qilishi yoki boshqacha tarzda mutatsiya qilishi mumkin bo'lgan
  siyosat
- mijozlarga e'lon qilingan orqa tomoni
- rasmni tekshirish usuli, `signed` yoki `proof`
- yashirin dastur metadatalari va baholovchi maxfiyligiga bo'lgan majburiyat
- imzolangan rasmga ega bo'lish uchun hal qiluvchining ochiq kalitini
- ko'rsatkichlar; BFV parametrlar va
  `ram_fhe_profile`
- bir `active` siyosat yangi tushumlar chiqarishi mumkinligini nazorat qiladigan bayroq

Yashirin maxfiylik, oddiy matn identifikator qiymati va yashirin dastur tizimi
mijozlar majburiyatlarni, shaffof hashlarni,
Qabul hashlari, shifr matnlari va dasturni pasaytiruvchilar shaffof protokol qiymatlari sifatida qabul qilinadi.

## Orqa tomonni {#backends}

Joriy RAM-LFE qo'llab-quvvatlash uchta bekend identifikatoriga asoslangan:

| Orqa tomoni | Foydalanish |
| --- | --- |
| `hkdf-sha3-512-prf-v1` | Bandlik bilan bog'liq PRF baholash. |
| `bfv-affine-sha3-256-v1` | BFV-Xifrlangan identifikator slotlari ustidan sirli afin baholash. |
| `bfv-programmed-sha3-256-v1` | BFV Kodlangan reyestrlar va xotira yo'llari orqali dasturlashtirilgan ijro etilishini ta'minlaydi. |

Identifikatsiyalash siyosatlari uchun dasturlangan BFV Backend muhim zamonaviy
yo'l. Bu pulparchalar normallashtirilgan kirish lokal ravishda shifrlash imkonini beradi, hal qiluvchining
Transaksiyada ommaviy identifikatorni ko'rmasdan baholash va
Ishlab chiqarish hashini ro'yxatdan o'tgan dastur siyosatiga bog'laydigan rasm.

## Matematika {#math}

Ushbu bo ' lim joriy
RAM-LFE kod. Bu xavfsizlik guvohnomasi emas; bu deterministik transkript
siyosat, tushumlar va mijozlar kerak bo'lgan shifrlangan baholash modeli
rozi bo'ling.

### Koʻrsatma {#notation}

Qoʻyish:

-  H(m)  Iroha `Hash::new(m)`: Blake2b-32 tugadi `m`, eng kam
  oxirgi bytning sezilarli qismi `1`.
- ~~~ X) ~ ~ Kanonik boʻlsin Norito kodlash `x`.
- \(a \parallel b\) o'rtacha bayt-aymoqlar birikishi.
- {(\operatorname{le64}(i) \) bir 8-baytli kichik endian kodlash bo'lishi
  imzolanmagan to'liq raqam.
- \(s\) dunyodan tashqarida saqlangan sirni hal qilish.
- \(P\) davlat siyosati parametrlari bo'lishi kerak.
- \(A\) tegishli ma'lumotlarni so'rash.
- \(x\) normallashtirilgan kirish bytlari yoki Norito-kodlangan kodlangan kirish
  xomashtga qarab.

RAM-LFE domenlar bo'linadigan hashlardan foydalanadi.
maqsadda; ularning joriy byte simlari quyidagilar:

| Simvol | Domenlar simlari |
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

### Siyosiy majburiyat {#policy-commitment}

Siyosat majburiyatlari ommaviy parametrlarni va yashirin resolver sirini bogʻlaydi
Birinchidan, sir alohida-alohida amalga oshiriladi:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Soʻngra toʻliq siyosat transkripti kodlanadi:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

va nashr etilgan siyosat hash:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

Zilzilab o'rnatilgan `PolicyCommitment` quyidagicha bo'ladi:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

Baholash o'sha qiymatni ishga tushirish vaqti siridan qayta hisoblaydi.
qayta hisoblangan hash farq qiladi, baholash majburiyat mos kelmasligi bilan muvaffaqiyatsiz tugadi.

### HKDF-SHA3-512 Orqa tomoni {#hkdf-sha3-512-backend}

uchun `hkdf-sha3-512-prf-v1`, chiqindi normalizatsiya qilingan kirishning o'zi, lekin
shaffof bo'lmagan identifikator va rasim hash sirli PRF chiqindilar.

Talabnoma transkripti quyidagicha:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

O ' zbekiston Respublikasi HKDF tuz va pseudorandom kalit:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

Ko'rinmas material kengaytiriladi va hash qilinadi:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

Rasm materiallari ko'rinmas identifikatorni qo'shimcha ravishda bog'laydi:

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

Orqa tomonni qaytarish:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV Dastlabki {#bfv-primer}

BFV "Homomorfik" - to'plamga asoslangan homomorf shifrlash sxemasi
dastur shiflangan qiymatlarni qo'shishi va ko'paytirishi mumkinligi va chipta o'chirilgandan keyin,
qo'shish va ko'paytirishlarni bajargan bo'lsa, xuddi shu natijalarga erishadi
oddiy matn qiymatlari.

uchun RAM-LFE, BFV kodlangan kirish mexanizmi sifatida ishlatiladi:

1. Pulchakka telefon raqami yoki elektron pochta orqali ma'lum bo'lgan shaxsiy qiymat normalizatsiya qilinadi
   manzili.
2. Pulka bytelarni kichik to'liq sonli slotlarga aylantiradi.
3. Har bir slot resolverning kodlangan BFV ommaviy kalit.
4. Resolver ish vaqti yashirin dasturni ushbu kodli matnlar ustidan baholaydi.
5. Ish vaqti faqat yashirin dasturni chiptalash va belgisi yoki bir
   rasm.

BFV bu aniq to'liq sonlar aritmetikasi, taxminiy emas.
identifikator baytlari va kichik modul hisob-kitoblarga mos
O'zgaruvchan nuqta modeli xulosa. Iroha joriy BFV foydalanish, har biri shifrlangan
slot bitta skalar qiymat modulini o'z ichiga oladi \(t\), odatda byte yoki byte uzunligi
kod matnining o'zi ancha katta to'liq son moduloda yashaydi \(q\). O ' zbekiston Respublikasi
o ' rtasidagi farq \(q\) va \(t\) shifrlash bu shovqin uchun decryption joy beradi
va homomorf operatsiyalarni joriy etish.

A BFV kodlangan matn ikkita polinomial tarkibiy qismga ega:

$$
c=(c_0,c_1)
$$

Sirli kalit boshqa polinomiyadir \(s_k\). Shriftlarni tarqatib berish
tarkibiy qismlar:

$$
v = c_0 + c_1s_k
$$

Agar kod matni to'g'ri shakllantirilgan bo'lsa va tovush hali ham yetarlicha kichik bo'lsa,
\(v\) o'lchovli oddiy matnning yaqinida bo'ladi.
koeffitsiyent modulo \(t\). Foydali xususiyat shundaki , kodli matn operatsiyalari
ushbu tuzilmani saqlab qolish:

| To'g'ri ishlash | Shifr matn operatsiyasi |
| --- | --- |
| \(m+n\) | Shifrlangan matn tarkibiy qismlarini qo'shing. |
| \(m+\alpha\) | O ' lchashli matn konstantasini qo ' shish \(c_0\). |
| \(\alpha m\) | Shifr matn tarkibiy qismlarini \(\alpha\). |
| \(mn\) | Shifr matn polinomlarini ko'paytiring, qayta o'lchash, so'ngra qayta liniyalashtiring. |

Ko'paytirish - bu qimmat operatsiya.
ciphertexts tabiiy ravishda uchta tarkibiy kodli matnni yaratadi .
\(1\), \(s_k\), va \(s_k^2\). Yangi ro'yxatga olishda nashr etilgan baholash kalitidan foydalanish
toʻplash uchun \(s_k^2\) bu ikki komponentli kodlangan matn bo'lib o'rnatiladi.
keyinchalik qo'shimchalar va ko'paytirishlarni xuddi shu kodli matn shaklini ishlatgan holda saqlaydi.

BFV shuningdek, "darajali" bo'ladi: har bir shifrlangan operatsiya ba'zi bir shov-shuv budjeti iste'mol qiladi.
Ushbu amalga oshirish ushbu byudjetni yangilash uchun kodli matnlarni ishga tushirmaydi.
Buning o'rniga, RAM-LFE kichik bir nashr `ram_fhe_profile` U faqat cheklangan narsani qabul qiladi .
dastur shakli yashirin. Bu baholanishni parametrlar to'plamida saqlaydi
qo'llab-quvvatlanadigan chuqurlik. Hozirgi dasturlangan profil doimiy reyestrga imkon beradi
hisob, o'rnatilgan xotira yo'nalishlari soni va eng ko'pida bitta kodli matn-kodli matn
dasturlangan bosqichga ko'paytirish.

Ushbu RAM-LFE dizayn, BFV mijoz ma'lumotlarini ommaviy kitob ma'lumotlaridan yashiradi va
faqat tranzaksiya yoki yo'nalish yukini ko'radigan kuzatuvchilar tomonidan.
zanjir o'z-o'zidan soxta kodlangan dasturlarni bajaradi. Torii solver
ish vaqti hali ham egalik qiladi BFV sirli material, konfiguratsiya qilingan yashirin baholash
dastur, ruxsat etilgan chiqishni chiptalaydi va natijani tasdiqlaydi.
so'ngra zanjirdagi siyosatga oid majburiyat yuzasidan attestatsiyani tekshiradi va
ochiq kalitni yoki isbot metadatalarini hal qilish.

Tanlovchining foydalanuvchi holatini aniqlash uchun oddiy tasvirni tanlaydi.
normalizatsiya qilingan satr quyidagicha kodiflanadi:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Har bir element oʻzidan-oʻzi shifrlangan . BFV skalar kodlash matni. Bu shakli
normalizatsiya va zarf tasdiqlash aniq, portfellar qurishga imkon beradi shifrlangan
umumiy parametrlardan talablar, va resolver ekvivalent canonicalize imkon beradi
ko'rsatkichlarni o'rnatish;

### BFV Tovushning modeli {#bfv-ring-model}

O ' zbekiston Respublikasi BFV orqa tomondagilar negaciklik polinomial halqadan foydalanadilar:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

va sodda matn bo'yicha:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

qaerda:

- \(n\) bo ' lmoqda `polynomial_degree`, ikkita kuch
- \(q\) bo ' lmoqda `ciphertext_modulus`
- \(t\) bo ' lmoqda `plaintext_modulus`
- \(q > t\) va \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

To'g'ri matn koeffitsiyenti vektorlari har bir koeffitsiyentni ko'paytirish orqali kodlanadi:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

Shriftni o'chirishning har bir koeffitsiyenti:

$$
v = c_0 + c_1 s_k \in R_q
$$

so'ngra uni qaytarib \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Mana \(s_k\) bu BFV maxfiy kalitli polinom, tashqi emas RAM-LFE solver
sirli \(s\).

### BFV Asosiy avlod {#bfv-key-generation}

Kodlangan identifikatorni kiritish uchun: BFV asosiy material deterministik boʻladi
resolver sirli va unga tegishli ma'lumotlar:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

O ' zbekiston Respublikasi BFV RNG quyidagicha urug'lantiriladi:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

Asosiy generator namunalari:

- \(s_k \in \{-1,0,1\}^n\), modulo \(q\)
- \(a \leftarrow R_q\) bir xilda
- \(e \in \{-1,0,1\}^n\)

Umumiy kalit:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Yangi liniyalashtirish uchun: \(s_k^2\) o'z ichiga oluvchi \(R_q\). Har bir kishi uchun
asos-\(B\) raqam \(j\), namuna \(a_j\) bir xilda va \(e_j\) kichiklardan
tarqatish, so'ngra e'lon qilish:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

Jamoat BFV siyosat metadatalar \(((n,q,t,B)\), ommaviy kalit va
`max_input_bytes`. O ' zbekiston Respublikasi BFV sirli kalit va relinearization kalit
Yechimchi ish vaqti.

### BFV Shriftlash va faoliyat {#bfv-encryption-and-operations}

Toʻgʻri matn polinomiyasini kodlash \(m\), amalga oshirish urug'lari boshqa
ChaCha20 RNG quyidagilardan:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

U namunalar \(u,e_1,e_2 \in \{-1,0,1\}^n\) va hisob-kitoblar:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

Sifr matni \(c=(c_0,c_1)\).

Homomorf qo'shish komponent jihatidan:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

Toʻgʻridan-toʻgʻri matn skalarini qoʻshish \(\alpha\) faqat koeffitsiyentning nol o'zgarishi
\(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Oddiy matn skalari bilan ko'paytirish \(\alpha\) ikkala tarkibiy qismni o'lchash:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

Ikki kodli matn uchun \(c=(c_0,c_1)\) va \(d=(_0,d_1)\), kodlangan matn
koʻpaytirish birinchi marta uch oʻlchamli shifr matnini hisoblaydi va har biriga oʻlchash
koeffitsiyenti \(t/q\):

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

Yuqorida keltirilgan barcha mahsulotlar negatsiklik halqa mahsulotlari \(R_q\). Keyin
\(\tilde c_2\) baza-\(B\) polinomlar:

$$
\tilde c_2 = \sum_j B^j u_j
$$

va qayta liniyalashtirilgan:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

Natijada yana ikkita komponent bor BFV kodlangan matn.

### Identifikator Kodlama matn qadoqchasi {#identifier-ciphertext-envelope}

Identifikator kirish byte simli:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

skalar maydonlarga kodlangan:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

va qolgan barcha slotlar nolgacha `max_input_bytes + 1`. Har bir skalar
slot koefitsient-zo'r oddiy matn polinomiyasi sifatida kodlanadi \([m_i]\).
Har bir slot bo'yicha shifrlash urug'i:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

Kodlangan identifikator xovusi quyidagicha:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

qaerda \(M=\mathrm{max\_input\_bytes}\).

### BFV O'zgarishlar {#bfv-affine-backend}

uchun `bfv-affine-sha3-256-v1`, ishga tushirish vaqti birinchi kelib chiqadi BFV asosiy materiallardan
\(s\) va \(A\). Chizilgan ommaviy parametrlar jamoatchilik bilan to'g'ri mos kelishi kerak
zanjirda belgilangan parametrlar.

Afin aylanmasi urugʻlari:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

Ushbu urug'dan o'tish vaqti namunalari, modulo \(t\), 32-satrli qarama-qarshi tizim:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

qaerda \(m_i\) bu kodlangan identifikator slotlari. Homomorfik ravishda, u hisoblash
kodli matnlarga nisbatan bir xil qiymat:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

Rezolver har birini chifrlaydi \(C_j\), barcha orqa tom ma'noli matnlarni talab qiladi
koeffitsiyentlar nol bo'lishi kerak, koeffitsientning nol qiymatlarini bytlarga aylantiradi va
shakllari:

$$
O=(y_0,\ldots,y_{31})
$$

Keyin:

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

### BFV Programmalashtirilgan orqa tomoni {#bfv-programmed-backend}

uchun `bfv-programmed-sha3-256-v1`, ommaviy parametrlar o'z ichiga oladi BFV identifikator
Shriftlash parametrlari va yashirin dasturni oʻzlashtirish:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

Joriy RAM-FHE profil quyidagicha:

| Maydon | Qiymat |
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

O ' zbekiston Respublikasi Vazirlar Mahkamasining 1999-yil 25-dekabrdagi 264-son qarori (O ' zbekiston Respublikasi Torii shunga o'xshash kodlangan BFV qadoqlash
Server tomoni shifrlash uchun deterministik urug':

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Tashqi ravishda etkazib beriladigan shifrlangan kirish uchun hal qiluvchining identifikatorini chiptalash
o'rnatishidan oldin uni ushbu deterministik o'rnatishga qayta kodlaydi.
Kanonikalashtirish qabul hashlarini semantik jihatdan teng boʻlgan holda barqaror saqlaydi
BFV kodlangan matnlar.

Boshda shifrlangan xotira yo'llari quyidagilardan olinadi:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

32 yo'nalishning har biri uchun ish vaqti namunalari \(r_j \in [0,t)\) va a BFV
kodlash matnining shafrlanishi \(r_j\). Yashirin dastur oʻshanda kodlangan orqali bajaradi
registrlar va shifrlangan xotira:

| Ta'lim | Algebra |
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | \(R_{y:o'rn} {y:oo}{y:o, o'rinli} |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\), soʻngra qayta liniyalashtiring |
| `SelectEqZero(dst, cond, z, nz)` | Yozib olish \(R_{\mathrm{cond}}\); tanlang \(R_z\) agar u nol bo'lsa, aks holda \(R_{nz}\). |
| `Output(src)` | Qo'shish \(R_{\mathrm{src}}\) chiqish reyestri ro'yxatiga. |

Ko'rsatma lentasi tugagandan so'ng, hal qiluvchining har bir chiqishi bo'yicha kodlash
ro'yxatdan o'tkazish, sıfrat koeffitsiyentini bytga aylantirish va ushbu bytlarni birlashtirib qo'yish:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

Umumiy dasturlangan backend hashlari quyidagilar:

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

Andoza dasturlashtirilgan identifikator lentasi 64 ta kirish slotsga ega.
\(i\), u kirish bo'shlig'ini yuklaydi, xotira yo'nalishini yuklaydi \(i \bmod 32\), ularni qo'shadi,
va natijani chiqarib beradi:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Ishlab chiqarish hashlari va tushumlar {#output-hashes-and-receipts}

Umumiy dori RAM-LFE amalga oshirish rasmga xam ishlab chiqarishni imzolaydi.
chiqish hash:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

uchun Torii RAM-LFE ijro tushumlari, tegishli ma'lumotlar kanonik
dastur identifikatori bytlari:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

Imzolangan rasmning foydali yuklari quyidagicha:

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

uchun `signed` usuli:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

Verifikatsiya bilan imzo tekshiriladi `resolver_public_key` va uni rad etadi .
qabul qilish, agar ushbu tengliklarning barchasi quyidagilarga ega bo'lmasa:

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

Agar qo'ng'iroq qiluvchi `output_hex`, tekshiruvchi shuningdek:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

uchun `proof` yo'nalishda, attestatsiyada dalilning o'rniga
imzo. Tekshirish tekshiruvlari natijasida isbotning orqa tomoni, tizim identifikatori,
ommaviy kirish sxemasi hash, tekshirish kalitlari hash va ochiq jamoatchilik holatlari
tasdiqlash tekshiruvchisi metadatalari va kodlangan rasport-payload hash bilan mos keladi.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

Umumiy holatlar to'rtta bir elementli ustunlardan iborat bo'ladi. \(j\)
baytlar mavjud \(h_{8j}\ldots h_{8j+7}\) keyin 24 nol bayt:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Identifikator proyeksiyasi {#identifier-projection}

Identifikator rezolyutsiyasida generik backenddan foydalanilmaydi `opaque_hash` sifatida
foydalanuvchiga qaratilgan shaffof hisob tanlovi. RAM-LFE chiqindi hash
identifikatorga xos domenlar orqali:

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

Oʻzbekiston Respublikasi `IdentifierResolutionReceipt` yuqori darajadagi foydali yukni imzolaydi:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

Imzolangan identifikator tasdiqlari uchun:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` rasmni faqat imzo yoki dalil mavjud bo'lganda qabul qiladi
amalda, o'rnatilgan RAM-LFE Ijro yuklari referensiya qilingan dasturga mos keladi
siyosati va `uaid` va `account_id` talab qilinadigan majburiyat hisoblanadi.

## Amalga oshirish oqimi {#execution-flow}

Umumiy dori RAM-LFE ijro quyidagi shaklga ega:

1. Boshqaruv yoki operator ro'yxatlari `RamLfeProgramPolicy`.
2. Xo'sh, mulkdor siyosatni faollashtiradi.
3. Mijoz davlat siyosati metadatalarini oʻqiydi Torii.
4. Mijoz aniq bir kirish shaklini resolverga taqdim etadi: oddiy matn
   `input_hex` yoki shifrlangan BFV kirish qadoqchasi.
5. Ish vaqti yashirin dasturni baholaydi va qaytaradi `output_hex`,
   `output_hash`, `opaque_hash`, `receipt_hash`, va a
   `RamLfeExecutionReceipt`.
6. Mijoz yoki orqa tomoni qabul qilingan hujjatni nashr etilgan siyosatga qarab tekshiradi,
   qaytarib berilganning `output_hex` rasmga hashlar
   `output_hash`.
7. Yuqori darajadagi ta'lim, masalan: `ClaimIdentifier`, qo ' shib olish mumkin
   xom ma'lumotlarni o'rnatishning o'rniga tasdiqlangan qabul qilingan.

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

## Identifikatsiyalash siyosati {#identifier-policies}

Identifikatsiyalash siyosati aniq foydalanish hisoblanadi RAM-LFE. Ular biznesni qo'shishadi
nomlar maydonlari va normalizatsiya qoidalari umumiy dastur siyosati ustida:

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

identifikator qatlamida RAM-LFE Qildirakni bog'lash:

- `policy_id`
- yashirin funksiya bilan olingan shaffof identifikator
- deterministik `receipt_hash`
- hisob raqami UAID
- kanonik `account_id`
- generik RAM-LFE bajarilishi uchun foydali yuk

Foydalanuvchilarga qaratilgan onlayn aloqa uchun hisobning aliaslarini xususiydan ajratib qo'ying
identifikatorlar. Aliaslar - bu ommaviy ismlar; telefon raqamlari, elektron pochta manzillari va
o'xshash qiymatlar identifikator siyosati va tushumlar orqali oqishi kerak.

## Torii Yo'nalishlar {#torii-routes}

Ilovaga qaratilgan yo'nalishlar oilasi yoqilganda, Torii ko'rsatkichlar RAM-LFE va
identifikator yordamchilari:

| Yoʻl | Maqsad |
| --- | --- |
| `GET /v1/ram-lfe/program-policies` | Aktiv va faoliyatsiz ro'yxat RAM-LFE dastur siyosati va davlat tomonidan amalga oshiriladigan metadatalar. |
| `POST /v1/ram-lfe/programs/{program_id}/execute` | Bir dasturni bajaring `input_hex` yoki `encrypted_input` va chiqarilgan hashlarni qaytarib berish, shuningdek davlatsiz rasvot. |
| `POST /v1/ram-lfe/receipts/verify` | A-ni tekshirish `RamLfeExecutionReceipt` e'lon qilingan siyosatga nisbatan va ixtiyoriy ravishda `output_hex` to `output_hash`. |
| `GET /v1/identifier-policies` | Identifikator siyosatlarini, normalizatsiya rejimlarini, resolver kalitlarini va shifrlangan kirish metadatalarini ro'yxatga oling. |
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` | Foydalanuvchi oʻrnatishi mumkin boʻlgan rasmni chiqarish `ClaimIdentifier`. |
| `POST /v1/identifiers/resolve` | Agar aktiv talab mavjud bo'lsa, bog'langan hisob raqamiga normallashtirilgan identifikatorni kiritish. |
| `GET /v1/identifiers/receipts/{receipt_hash}` | Audit va qo'llab-quvvatlash vositasi uchun rasmga hash yordamida doimiy identifikator talabini qidiring. |

Har doim nishonchi nodlarni tekshiring `/openapi` yoki `/openapi.json` avvalgi hujjat
Bu yo'nalishlarga qarshi qurilishda.
tarmoq profili.

## Nukllar ishga tushirish vaqti {#node-runtime}

Torii jarayonida . RAM-LFE ishga tushirish vaqti quyidagicha moslashtirilgan:
`torii.ram_lfe.programs[*]`, nishonlangan `program_id`. Har bir konfiguratsiya qilingan dastur
zanjirdagi siyosat majburiyatlariga muvofiq bo'lishi kerak va ish vaqti ta'minlanishi kerak
Hisobotlarni baholash va tasdiqlash uchun zarur bo'lgan material.
bir xil ishga tushirish vaqti; ular alohida identifikator-resolver konfiguratsiyasini talab qilmaydi
yuzaga chiqish.

Siyosatlarni zanjirda ro'yxatga olish o'zi yetarli emas.
shuningdek, yo'nalish oilasi ko'rsatilishi va o'z ichiga
dasturlari bajarilishi kutilmoqda.

## Operativ qo'riqchi rails {#operational-guardrails}

- Siyosatlarni faollashtirmang, ommaviy metadatalarni tekshiring, keyin ularni faollashtiring.
- Baholovchi sirlarini yashiring, resolver imzolash kalitlarini saqlang va BFV sirli
  Hujjatlar, jurnallar, bitimlar va mijoz to'plamlaridan material.
- Hisobvaraqning aliaslari, muomala metadatalariga xom identifikatorlarni qo'ymang.
  hodisalar yoki dunyo davlatlari maydonlari.
- Yuqori darajadagi ko'rsatmalarni taqdim etishdan oldin chiptalarni mijoz tomonidan tekshirish
  qachon SDK tekshiruvchining ko'rinishini aniqlaydi.
- Vaqt o'tishi maydonlaridan foydalaning, agar oldingi rasvolar doimiy ravishda amalda qolmasligi kerak.
- Yangi dastur yoki identifikator siyosatini ro'yxatdan o'tkazish, migratsiya qiluvchi mijozlar,
  va yangi tushumlar oqishi bilan eski siyosatni deaktiv qilish.

## Bog'liq mavzular {#related-topics}

- [Xususiy ma'lumotlar maydonchasi uchun sponsorlik to'lovlari](/uz/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii Keyingi nuqtalar](/uz/reference/torii-endpoints.md#app-and-sora-route-families)
- [Anonim bitimlar](/uz/blockchain/anonymous-transactions.md)
