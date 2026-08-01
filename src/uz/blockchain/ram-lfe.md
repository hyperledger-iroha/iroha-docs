---
translation_locale: uz
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE "Random-Access Machine Laconic Function Evaluation" deb nomlanadi. Iroha da bu ommaviy siyosati zanjirda bo'lgan, ammo baholovchi mantiqiy, sirli yoki xom ma'lumotlari jahon davlatiga yozilmasligi kerak bo'lgan dasturlar uchun umumiy yashirin funktsiya qatlami hisoblanadi. U SORA Nexus identifikatorlari oqimlarida, masalan, xususiy telefon yoki elektron pochta qidiruvida ishlatiladi va dasturni ijro etishda umumiy yordamchi sifatida Torii ko'rinishi mumkin.

Zildirak siyosat majburiyati va rasim tekshirish metadatalarni saqlaydi. Resolver yoki Torii ish vaqti yashirin dasturni baholaydi, faqat ruxsat etilgan chiqishni qaytarib beradi va mijozlar, qo'llab-quvvatlash vositalari yoki katta yozuvlar ko'rsatmalari tomonidan ro'yxatdan o'tgan siyosatga qarshi tekshirilishi mumkin bo'lgan rasimni bog'laydi.

## Nomlashtirish {#naming}

Nomlash boʻlinishi muhimdir:

|Vaqti |Maʼnosi |
| --- | --- |
|`ram_lfe` |Tashqi yashirin funktsiya abstraksiyasi: dastur siyosati, majburiyatlar, ijro tushumlari va tushumlarni tekshirish usuli. |
|`BFV` |Brakerski/Fan-Vercauteren kodlangan kirish RAM-LFE orqa fonlarida ishlatiladigan homomorf shifrlash sxemi. |
|`ram_fhe_profile` |BFV -ni o'z ichiga oladigan dasturlangan shifrlangan ijro etuvchi mashina uchun metadotlar. Bu RAM-LFE uchun ikkinchi nom emas. |

Ma'lumotlar modelida `RamLfeProgramPolicy` va `RamLfeExecutionReceipt` RAM-LFE turlari. BFV parametrlari, shifrlangan matn zarflari va yashirilgan RAM-FHE dastur profili siyosat tomonidan ishlatiladigan shafrlangan ijro orqa tomoniga tegishli.

## Bu kitobda nima yozilgan ? {#what-it-records}

RAM-LFE dasturi siyosati global miqyosda `program_id` tomonidan ro'yxatdan o'tkaziladi.

- siyosatni faollashtirishi, deaktiv qilishi yoki boshqacha tarzda o'zgartirishi mumkin bo'lgan egasi hisob raqami
- mijozlarga e'lon qilingan orqa tomoni
- Rasmni tekshirish usuli `signed` yoki `proof`
- yashirin dastur metadatalari va baholovchi maxfiyligi bilan bog'liq majburiyat
- imzolangan rasmlar uchun hal qiluvchining ommaviy kaliti
- BFV parametrlari va `ram_fhe_profile` kabi ko'rsatkichlarga ega bo'lgan ommaviy shifrlangan ma'lumotlar
- `active` bayrog'i siyosat yangi tushumlar chiqarishi mumkinligini nazorat qiladi;

Yashirilgan sir, ochiq matn identifikator qiymati va yashirin dastur korpusi dunyo holatida saqlanmaydi. Mijozlar majburiyatlar, shaffof hashlar, qabul qilish hashlari, shifr matnlari va dasturiy ta'minotni o'zlashtirishni shaffof protokol qiymatlari sifatida ko'rishlari kerak.

## Orqa tomonni koʻrsatish {#backends}

Joriy RAM-LFE qo'llab-quvvatlash uchta orqa tomondan identifikatorlarga qaratilgan:

|Orqa tomoni |Foydalanish |
| --- | --- |
|`hkdf-sha3-512-prf-v1` |PRF majburiyat bilan bog'liq baholash. |
|`bfv-affine-sha3-256-v1` |BFV tomonidan qo'llab-quvvatlanadigan maxfiy afin baholash kodlangan identifikatorlar bo'ylab. |
|`bfv-programmed-sha3-256-v1` |BFV tomonidan qo'llab-quvvatlanadigan kodlangan reyestrlar va xotira yo'llari orqali dasturlashtirilgan ijro. |

identifikator siyosatlari uchun, dasturlashtirilgan BFV backend muhim zamonaviy yo'l. Bu pulchalari mahalliy ravishda normalizatsiya qilingan kirishlarni shifrlash imkonini beradi, hal qiluvchining tranzaksiyada ommaviy identifikatorni ko'rmasdan baholash imkoniyatini beradi, va chiqish hashini ro'yxatdan o'tgan dastur siyosati bilan bog'laydigan rasvotni qaytaradi.

## Matematika {#math}

Ushbu bo'lim joriy RAM-LFE kod tomonidan ishlatiladigan amalga oshirish darajasidagi algebra haqida hikoya qiladi. Bu xavfsizlik isboti emas; bu siyosat, rasvolar va mijozlar kelishi kerak bo'lgan deterministik transkript va shifrlangan baholash modelidir .

### Bayonnoma {#notation}

Qoʻyish:

- \(H(m)\) bo'lishi Iroha `Hash::new(m)`: Blake2b-32 ustidan `m`, oxirgi baytning eng kam ahamiyatli bitini `1` ga majbur qiladi.
- \(N(x)\) `x` ning kanonik Norito kodlash usuli bo'lsin.
- \(a \parallel b\) o'rtacha baytlar simli bog'lanish.
- {(\operatorname{le64}(i) \) belgisiz to'liq sonning 8 baytli kichik endik kodlanishi bo'lsin.
- \(s\) dunyodan tashqarida saqlangan sirni hal qiluvchi bo'lishi.
- \(P\) davlat siyosati parametrlari bo'lishi.
- \(A\) bilan bog'liq ma'lumotlarni so'rash.
- \(x\) normalizatsiya qilingan kirish bytlari yoki Norito kodlangan shifrlangan kirish qadoqchasi bo'lishi kerak, shunga qarab.

RAM-LFE domenlar bo'yicha ajratilgan hashlardan foydalanadi. Quyidagi formulalarda domenlar maqsadga ko'ra nomlanadi; ularning hozirgi byte simlari quyidagicha:

|Ramz |Domenlar qatorlari |
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

### Siyosatdagi majburiyat {#policy-commitment}

Siyosat majburiyatlari jamoatchilik parametrlarini va yashirin resolver sirini orqa tomonga bog'laydi. Birinchidan, sir alohida ravishda amalga oshiriladi:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Soʻngra toʻliq siyosat transkripti kodlanadi:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

va e'lon qilingan siyosat hash quyidagicha:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

Zilziladagi `PolicyCommitment` quyidagicha:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

Baholash ish vaqti siridan bir xil qiymatni qayta hisoblash. Agar qayta hisoblangan hash farq qilsa, baholash majburiyat mos kelmasligi bilan muvaffaqiyatsizlikka uchraydi.

### HKDF-SHA3-512 Orqaga qaytish {#hkdf-sha3-512-backend}

`hkdf-sha3-512-prf-v1` uchun chiqish normalizatsiya qilingan kirishning o'zi, ammo shaffof identifikator va qabul hash sirli bo'lgan PRF chiqindilardir.

Talabning transkripti quyidagicha:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

HKDF tuz va pseudorandom kalitlari quyidagicha:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

Ko'rinmas materiallar kengaytiriladi va hash qilinadi:

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

### BFV Primer {#bfv-primer}

BFV to'plamga asoslangan homomorf shifrlash sxemasi. "Homomorf" demak, dastur shifrlangan qiymatlarni qo'shishi va ko'paytirishi mumkin bo'lib, chiqqandan so'ng oddiy matn qiymatlarida qo'shimchalar va ko'plashlarni amalga oshirgan bo'lsa, xuddi shunday natijalarga erishadi.

RAM-LFE uchun BFV kodlangan kirish mexanizmi sifatida ishlatiladi:

1. Pulbaga telefon raqami yoki elektron pochta manzili kabi shaxsiy qiymat normalizatsiya qilinadi.
2. Hamyon baytlarni kichik to'liq sonli maydonlarga aylantiradi.
3. Har bir slot resolverning BFV ommaviy kaliti bilan shifrlangan.
4. Resolver ishga tushirish vaqti yashirin dasturni ushbu kodli matnlarga qarab baholaydi.
5. Ish vaqti faqat yashirin dasturni chiptalaydi va belgisi yoki rasmga dalolat beradi.

BFV bu aniq to'liq sonlar aritmetikasi emas taxminiy aritmetik. shuning uchun u identifikator bytlari va kichik modullarga yaxshiroq mos keladi hisob-kitoblardan ko'ra aylanuvchi nuqta modelining xulosalariga nisbatan. Iroha joriy BFV foydalanish, har bir shifrlangan slot bitta skalar qiymati modulosi \(t\), ko'pincha byte yoki byte uzunligi maydoni bo'ladi. \(q\). O ' rtasidagi farq \(q\) va \(t\) kodlash va homomorf operatsiyalar keltiradigan shov-shuv uchun tarjima qilish imkoniyatini beradi.

BFV kodli matn ikkita polinomial tarkibiy qismlarga ega:

$$
c=(c_0,c_1)
$$

Sirli kalit boshqa polinom \(s_k\) hisoblanadi. Dekriptsiya quyidagi komponentlarni birlashtiradi:

$$
v = c_0 + c_1s_k
$$

Agar kod matni to'g'ri shakllantirilgan bo'lsa va tovush hali ham etarlicha kichik bo'lsa, \(v\) o'lchovli oddiy matnga yaqin. Butunlashtirish oddiy matn koeffitsiyenti modulo \(t\) ni tiklaydi. Foydali xususiyat shundaki , kodlangan matn operatsiyalari ushbu tuzilmani saqlab qolishida:

|Oddiy ishlash |Shifr matn operatsiyasi |
| --- | --- |
|\(m+n\) |Shifrlangan matn tarkibiy qismlarini qoʻshing. |
|\(m+\alpha\) |\(c_0\) ga o'lchamli oddiy matn konstantalarini qo'shing. |
|\(\alpha m\) |Ikkala kodli matn tarkibiy qismini \(\alpha\) bilan ko'paytirish. |
|\(mn\) |Shifr matn polinomiyalarini ko'paytirish, qayta o'lchash, so'ngra yana liniyallashtirish. |

Ko'paytirish - bu qimmat operatsiya. Ikki komponentli shifr matnining mahsuloti tabiiy ravishda \(1\), \(s_k\) va \(s_k^2\) bilan chifrlangan uch komponentli shiffat matnini yaratadi. Relinearization \(s_k^2\) so'zini normal ikki komponentli shifr matnlariga qaytarish uchun nashr etilgan baholash kalitidan foydalanadi. Bu shunga ko'ra, keyingi qo'shimchalar va ko'paytirishlarni bir xil shifr matni shaklini qo'llab saqlaydi.

BFV ham "darajali" bo'ladi: har bir shifrlangan operatsiya biroz shov-shuv budjeti iste'mol qiladi. Ushbu amalga oshirish bu byudjetni yangilash uchun chifra matnlarini ishga tushirmaydi. Buning o'rniga, RAM-LFE kichik `ram_fhe_profile` ni nashr etadi va faqat cheklangan yashirin dastur shaklini qabul qiladi. Bu parametrlar to'plamining qo'llab-quvvatlanadigan chuqurligi doirasida baholashni saqlaydi. Hozirgi dasturlangan profil doimiy reyestr sonini, o'rnatilgan xotira yo'nalishlari sonini va har bir dasturiy qadam uchun eng ko'p bitta kod matnidan kod matnini ko'paytirishga imkon beradi.

Ushbu RAM-LFE dizaynida, BFV mijoz ma'lumotlarini ommaviy kitob ma'lumotlaridan va faqat tranzaksiya yoki yo'nalish yukini ko'radigan kuzatuvchilardan yashiradi. Bu zanjir o'zi-o'zi ixtiyoriy kodlangan dasturlarni bajaradi degani emas. Torii resolver ishga tushirish vaqti hali ham BFV sirli materialga ega bo'lib, konfiguratsiya qilingan yashirin dasturni baholaydi, ruxsat etilgan chiqarishni o'chirib beradi va natijani tasdiqlaydi. Keyin katta qog'oz siyosat majburiyatlariga qarshi attestatsiyani tekshiradi va ommaviy kalit yoki dalil metadatalarini hal qiladi.

Tanlovchining foydalanish holatida oddiy tasvirni tanlaydi. Normallashtirilgan satr quyidagicha kodlanadi:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Har bir element o'zining BFV skalar shifr matni sifatida kodlanadi. Bu shakl normalizatsiya va zarfning tasdiqlashini aniqlashtiradi, pulkalarga ommaviy parametrlardan shifrlangan so'rovlarni yaratishga imkon beradi va hal qiluvchining ekvivalent shifrlangan kirishlarini barqaror qabul transkriptiga kanonlashtirishlariga imkon beradi.

### BFV Ring modeli {#bfv-ring-model}

BFV orqa qismlarida negaciklik polinomial bog'dan foydalaniladi:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

va oddiy matn bo'laklari:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

qaerda:

- \(n\) - `polynomial_degree`, ikkita quvvat
- \(q\) - `ciphertext_modulus`
- \(t\) - `plaintext_modulus`
- \(q > t\) va \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

To'g'ri matn koeffitsiyenti vektorlari har bir koeffitsiyentni ko'paytirish orqali kodlanadi:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

Dekriptsiya markazlari har bir koeffitsiyentini:

$$
v = c_0 + c_1 s_k \in R_q
$$

so'ngra uni \(R_t\) ga qaytaradi:

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Bu erda \(s_k\) BFV sirli kalit polinomidir, tashqi RAM-LFE resolver siri \(s\) emas.

### BFV Muhim avlod {#bfv-key-generation}

Kodlangan identifikatorni kiritish uchun BFV kalit materiallari har bir resolverning maxfiyligi va tegishli ma'lumotlari bo'yicha aniqlanadi:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG urug'lari quyidagicha urug'lanadi:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

Asosiy generator namunalari:

- \(s_k \in \{-1,0,1\}^n\), modulo \(q\) sifatida tasvirlangan
- \(a \leftarrow R_q\) bir xil
- \(e \in \{-1,0,1\}^n\)

Davlat kaliti quyidagicha:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Relinearization uchun \(s_k^2\) \(R_q\) bo'lib turishi kerak. Har bir baza-\(B\) raqamlari \(j\) uchun, kichik tarqatishdan \(a_j\) namunasini bir xilda va \(e_j\) joylashtiring, so'ngra quyidagilarni nashr qiling:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

Umumiy BFV siyosat meta ma'lumotlarida \(((n,q,t,B)\), umumiy kalit va `max_input_bytes` mavjud. BFV sirli kalit va relinearization kalitlar hal qiluvchining ishga tushirish vaqtida qoladi.

### BFV Shriftlash va operatsiyalar {#bfv-encryption-and-operations}

To'g'ri matn polinomini \(m\) shifrlash uchun amalga oshirish natijasida quyidagilardan boshqa ChaCha20 RNG chigitlari paydo bo'ladi:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

U \(u,e_1,e_2 \in \{-1,0,1\}^n\) namunalarini olib, quyidagilarni hisoblaydi:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

Sifr matni \(c=(c_0,c_1)\) hisoblanadi.

Homomorf qo'shish komponent jihatidan:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

Faqatgina \(c_0\) koeffitsiyentiga oddiy matn skalari \(\alpha\) o'zgarishi qo'shilmoqda:

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

To'g'ri matn skalari \(\alpha\) bilan ko'paytirish ikkala tarkibiy qismni ham o'lchovlaydi:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

Ikki shifr matnlari uchun \(c=(c_0,c_1)\) va \(d=(d_0,d _1)\), shifr matnini ko'paytirish birinchi navbatda uch o'lchamli shifr matnni hisoblaydi va har bir koeffitsiyentni \(t/q\) bilan qayta ko'rib chiqadi:

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

Yuqorida keltirilgan barcha mahsulotlar \(R_q\) ning negaciklik halqa mahsulotlari hisoblanadi. Keyin \(\tilde c_2\) bazaviy-\(B\) polinomiyalariga bo'linadi:

$$
\tilde c_2 = \sum_j B^j u_j
$$

va qayta to'g'rilashtirilgan:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

Natijada yana ikkita komponentli BFV kodlangan matn paydo bo'ladi.

### identifikator kodlangan matn qadoqchasi {#identifier-ciphertext-envelope}

Identifikatorni kiritish byte simli:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

skalar bo'laklarga kodlangan:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

va qolgan barcha maydonlar `max_input_bytes + 1` gacha nol bo'ladi. Har bir skalar maydon koefitsiyenti to'liq matn polinomasi \([m_i]\) sifatida kodlanadi.

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

Kodlangan identifikator zarflari quyidagicha:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

\(M=\mathrm{max\_input\_bytes}\) bo'lganda.

### BFV Afine Backend {#bfv-affine-backend}

`bfv-affine-sha3-256-v1` uchun ish vaqti birinchi navbatda BFV kalit materialini \(s\) va \(A\) dan olib keladi. O'tkazilgan ommaviy parametrlar zanjirda o'tkazilgan umumiy parametrlarga to'g'ri mos kelishi kerak.

Afine sirketi urugʻlari:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

Ushbu urug'dan o'tish vaqti namunalari, modulo \(t\), 32 satrli afin aylanmasi:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

\(m_i\) kodlangan identifikator yuzalari bo'lgan joylarda. Homomorfik ravishda u kodli matnlar bo'yicha bir xil qiymatni hisoblaydi:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

Rezolver har bir \(C_j\) ni chifrlaydi, barcha ortda qolgan oddiy matn koeffitsientlarining nol bo'lishini talab qiladi, koeffitsiyentning nol qiymatlarini bytlarga o'zgartiradi va shakllar:

$$
O=(y_0,\ldots,y_{31})
$$

Soʻngra:

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

`bfv-programmed-sha3-256-v1` uchun ommaviy parametrlar BFV identifikatorini shifrlash parametrlarini qo'shib, yashirin dasturni o'zlashtirish:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

Joriy RAM-FHE profili quyidagicha:

|Maydon |qiymati |
| --- | --- |
|`profile_version` | `1` |
|`register_count` | `4` |
|`memory_lane_count` | `32` |
|`ciphertext_mul_per_step` | `1` |
|`encrypted_input_mode` |`resolver_canonicalized_envelope_v1` |
|`min_ciphertext_modulus` | \(2^{52}\) |

Torii raqamiga taqdim etilgan oddiy matn ma'lumotlari bajarilishdan oldin xuddi shu BFV qadoqasiga shifrlangan. Server tomonidan shifrlash uchun deterministik urug' quyidagicha:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Tashqi ravishda etkazib beriladigan shifrlangan kirish uchun hal qiluvchi identifikator qovusini chifrlaydi va uni ijro etishdan oldin ushbu deterministik qovusga qayta chifrlaydi. Ushbu kanonikalashtirish qabul hashlarini semantik jihatdan teng BFV shifr matnlarida barqaror saqlaydi.

Dastlabki shifrlangan xotira yo'llari quyidagilardan olinadi:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

32 ta yo'nalishning har biri uchun ish vaqti namunalari \(r_j \in [0,t)\) va BFV shifr matnining \(r_j\) shifrlanishini saqlaydi. Yashirin dastur so'ngra shifrlangan registrlar va shifrlangan xotira orqali bajaradi:

|Taʼlimotlar |Algebra |
| --- | --- |
|`LoadInput(dst, i)` |\(R_{\mathrm{dst}} \leftarrow C_i\) |
|`LoadState(dst, j)` |\(R_{\mathrm{dst}} \leftarrow S_j\) |
|`StoreState(j, src)` |\(S_j \leftarrow R_{\mathrm{src}}\) |
|`LoadConst(dst, a)` |\(R_{\mathrm{dst}} \leftarrow \operatorname {Enc}(a) \) |
|`Add(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
|`AddPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
|`SubPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
|`MulPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
|`Mul(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_aR_b\), keyin qayta liniyalashtiring |
|`SelectEqZero(dst, cond, z, nz)` |\(R_{\mathrm{cond}}\) kodini o'chirib tashlang; zero bo'lganda \(R_z\) ni tanlang, aks holda \(R_{nz}\). |
|`Output(src)` |\(R_{\mathrm{src}}\) chiqindilar reyestri ro'yxatiga qo'shilsin. |

Ko'rsatma lentasi tugagandan so'ng, hal qiluvchining har bir chiqish rejistriga kodini bo'shatadi, koeffitsiyenti nolni baytga aylantiradi va bu baytlarni qo'shadi:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

Jismoniy dasturlangan backend hashlari:

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

Andoza dasturlashtirilgan identifikator lentasi 64 ta kirish slotsga ega. Har bir slot uchun \(i\), u kirish slotini yuklaydi, xotira yo'nalishini \(i \bmod 32\) yuklaydi, ularni qo'shib beradi va natijani chiqaradi:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Ishlab chiqarish hashlari va tushumlar {#output-hashes-and-receipts}

Umumiy RAM-LFE o'tkazib yuborish risolasi xom chiqarishni imzolamaydi. U chiqindi hashini imzolaydi:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Torii RAM-LFE ijro tushirishlari uchun bog'liq ma'lumotlar kanonik dastur identifikator baytlari hisoblanadi:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

Imzolangan rasmga qo'shilgan yuk:

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

`signed` rejasi uchun:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

Verifikatsiya imzosini `resolver_public_key` bilan tekshiradi va ushbu tengliklarning barchasi quyidagilarga ega bo'lmasa, rasmni rad etadi:

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

Agar qo'ng'iroq qiluvchi `output_hex`ni taqdim qilsa, tekshiruvchining o'zi:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

`proof` usuli uchun attestatsiya imzo o'rniga isbot qadoqchasini o'z ichiga oladi. Tahqiqot tekshiruvida isbotning orqa tomoni, aylanmalar identifikatori, ommaviy kirish sxema hash, tekshirish kalitining hash va ochiq ommaviy instansiyalar isbotlovchi verifikator metadatalari va kodlangan rasmga ega bo'lgan payload hash bilan mos keladiganligini tekshiradi.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

Taxmin qilingan ommaviy instansiyalar to'rtta bir elementli ustun bo'ladi. \(j\) ustunida \(h_{8j}\ldots h_{8j+7}\) byetlari, so'ngra 24 nol baytlar mavjud:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Identifikator proyeksiyasi {#identifier-projection}

Identifier rezolyutsiyasida `opaque_hash` umumiy orqa tomoni foydalanuvchiga qaram bo'lgan shaffof hisob identifikatori sifatida qo'llanilmaydi. U RAM-LFE chiqish hashini identifikatorga mos domenlar orqali proyektlaydi:

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

`IdentifierResolutionReceipt` yuqori darajadagi foydali yukni imzolaydi:

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

`ClaimIdentifier` rasmni faqat imzo yoki dalil haqiqiy bo'lganda, o'rnatilgan RAM-LFE ijro yuklari referensiya qilingan dastur siyosatiga mos kelganda va `uaid` va `account_id` talab qilinadigan majburiy hujjat bo'lganida qabul qiladi.

## Ijro qilish oqimi {#execution-flow}

Umumiy RAM-LFE bajarilishi quyidagi shaklga ega:

1. Boshqaruv yoki operator ro'yxati `RamLfeProgramPolicy`.
2. Xo'sh, mulkdor polisni faollashtiradi.
3. Mijoz Torii tomonidan davlat siyosati metadatalarini o'qiydi.
4. Mijoz aniq bir kirish shaklini hal qiluvchiga taqdim etadi: oddiy matn `input_hex` yoki shifrlangan BFV kirish qutisi.
5. Ish vaqti yashirin dasturni baholaydi va `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash` va `RamLfeExecutionReceipt` ni qaytaradi.
6. Mijoz yoki orqa tomoni tasdiqni e'lon qilingan siyosatga qarab tekshiradi, ehtimol qaytarib berilgan `output_hex` tasdiqning `output_hash` hashlariga mos keladiganligini tekshirish.
7. Yuqori darajadagi ko'rsatma, masalan `ClaimIdentifier`, xom ma'lumotlarni o'rnatib qo'yishning o'rniga tasdiqlangan rasmni joylashtirishi mumkin.

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

Identifikator siyosatlari RAM-LFE ning aniq foydalanilishi hisoblanadi. Ular umumiy dastur siyosati ustiga biznes nomlar maydoni va normalizatsiya qoidasi qo'shadi:

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

identifikator qatlamida RAM-LFE risoladan foydalanib, quyidagilarni bog'laydi:

- `policy_id`
- yashirin funksiya bilan hosil bo'lgan shaffof identifikator
- deterministik `receipt_hash`
- hisobning UAID
- kanonik `account_id`
- umumiy RAM-LFE bajarilishi foydali yuklanishi

Foydalanuvchilarga bog'liq bo'lgan onboarding uchun shaxsiy identifikatorlardan alohida hisob aliaslarini saqlang. Aliaslar ommaviy ismlardir; telefon raqamlari, elektron pochta manzillari va shunga o'xshash qiymatlar identifikator siyosati va rashibkalar orqali oqishi kerak.

## Torii Yo'nalishlar {#torii-routes}

Ilovaga ko'ra yo'nalishlar oilasi qo'llanilganda, Torii RAM-LFE va identifikator yordamchilarini aniqlaydi:

|Yo ' nalish |Maqsad|
| --- | --- |
|`GET /v1/ram-lfe/program-policies` |Aktiv va faol bo'lmagan RAM-LFE dastur siyosatlari va ommaviy ijro metadatalarini ro'yxatga oling. |
|`POST /v1/ram-lfe/programs/{program_id}/execute` |`input_hex` yoki `encrypted_input` dan bitta dasturni bajaring va chiqariladigan hashlarni qo'shib, davlatsiz rasvotni qaytaring. |
|`POST /v1/ram-lfe/receipts/verify` |`RamLfeExecutionReceipt` ni e'lon qilingan siyosatga nisbatan tekshirish va `output_hex` bilan `output_hash` ning o'rtasidagi taqqoslash. |
|`GET /v1/identifier-policies` |Identifikator siyosatlarini, normalizatsiya rejimlarini, resolver kalitlarini va shifrlangan kirish metadatalarini ro'yxatga oling. |
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt` |Foydalanuvchi `ClaimIdentifier` ga qo'shishi mumkin bo'lgan rasvotni chiqarish. |
|`POST /v1/identifiers/resolve` |Aktiv talab mavjud bo'lganda bog'liq hisobvaraqqa normalizatsiya qilingan identifikatorni kiriting. |
|`GET /v1/identifiers/receipts/{receipt_hash}` |Audit va qo'llab-quvvatlash vositasi uchun rasmga hash yordamida doimiy identifikator talabini qidirish. |

Ushbu yo'nalishlarga qarshi qurishdan oldin har doim maqsadli nodning `/openapi` yoki `/openapi.json` hujjatini tekshiring. Bo'lish imkoniyati nod qurilishi va tarmoq profilidan bog'liq.

## Nukllar ishga tushirish vaqti {#node-runtime}

Torii jarayonida ishlaydigan vaqt RAM-LFE `torii.ram_lfe.programs[*]` ostida konfiguratsiya qilinadi, `program_id` bilan belgilanadi. Har bir konfiguratsiyalangan dastur zanjirdagi siyosatga muvofiq bo'lishi kerak va tushumlarni baholash va tasdiqlash uchun zarur bo'lgan ishga tushirish vaqti materialini taqdim etishi kerak. Identifikator yo'nalishlari ushbu ish vaqti bilan qayta ishlaydi; ular uchun identifikator-resolver konfiguratsiya yuzasini alohida o'rnatish kerak emas.

Siyosatni zanjirda ro'yxatdan o'tkazish o'z-o'zi yetarli emas. Tanlangan nod yo'nalish oilasi bilan ham bog'liq bo'lishi kerak va dasturlarni bajarishi kutilayotgan dasturlar uchun moslashuvchan ish vaqti materiallariga ega bo'lishi lozim.

## Operativ qo'riqchi rails {#operational-guardrails}

- Siyosatlarni faollashtirmang, ommaviy metadatalarni tekshiring, so'ngra ularni faollashtiring.
- Baholovchi sirlarini, resolver imzolash kalitlarini va BFV maxfiy materiallarni hujjatlardan, jurnallardan, operatsiyalardan va mijozlar to'plamlaridan yashiring.
- Hisobvaraq aliaslariga, bitim metadatalariga, hodisalarga yoki dunyo davlatlari maydonlariga xom identifikatorlarni qo'ymang.
- SDK tekshiruvchini ochib berganda yuqori darajadagi yo'l-yo'riqlarni yuborishdan oldin mijoz tomoni tomonidan rasmga ega bo'ling.
- Vaqt o'tishi maydonlaridan foydalaning, bu yerda oldingi rasvolar abadiy saqlanmasligi kerak.
- Yangi dastur yoki identifikator siyosatini ro'yxatdan o'tkazish, mijozlarni ko'chirish va yangi tushumlar oqishi bilan eski siyosatni deaktiv qilish orqali aylaning.

## Bog'liq mavzular {#related-topics}

- [Xususiy ma'lumotlar maydoni uchun homiylik to'lovlari](/uz/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii Oxirgi nuqtalar](/uz/reference/torii-endpoints.md#app-and-sora-route-families)
- [Anonim tranzaksiyalar](/uz/blockchain/anonymous-transactions.md)
