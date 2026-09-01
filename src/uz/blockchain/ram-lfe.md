---
translation_locale: uz
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 66436bfdcdfea9bcd52834436dc8b6abe9812549583e6bfca06cbe73d5f75d35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE Random-Access Machine Laconic Function Evaluation degan ma’noni anglatadi. Iroha-da bu ommaviy siyosati zanjirda saqlanadigan, lekin baholovchi mantiqi, siri yoki xom kirishi global holatga yozilmasligi kerak bo‘lgan dasturlar uchun umumiy yashirin funksiya qatlamidir. U maxfiy telefon yoki elektron pochta qidiruvi kabi SORA Nexus identifikator oqimlarida ishlatiladi va tugun profili ilovaga yo‘naltirilgan marshrutlarni yoqqanda umumiy Torii dastur-ijro yordamchisi sifatida ham taqdim etilishi mumkin.

Zanjir siyosat majburiyatini va tasdiqnomani tekshirish metama’lumotlarini saqlaydi. Yechuvchi yoki Torii bajarish muhiti yashirin dasturni baholaydi, faqat ruxsat etilgan natijani qaytaradi va mijozlar, yordamchi vositalar yoki reyestr ko‘rsatmalari ro‘yxatdan o‘tgan siyosatga nisbatan tekshira oladigan tasdiqnomani ilova qiladi.

## Nomlanishi {#naming}

Atamalarni quyidagicha farqlash muhim:

| Atama | Ma’nosi |
| --- | --- |
| `ram_lfe` | Tashqi yashirin funksiya abstraksiyasi: dastur siyosatlari, majburiyatlar, bajarish tasdiqnomalari va tasdiqnomani tekshirish rejimi. |
| `BFV` | Kirishi shifrlangan RAM-LFE hisoblash modullarida ishlatiladigan Brakerski/Fan-Vercauteren gomomorf shifrlash sxemasi. |
| `ram_fhe_profile` | Dasturlashtirilgan shifrlangan bajarish mashinasiga oid BFV metama’lumotlari. Bu RAM-LFE ning boshqa nomi emas. |

Ma’lumotlar modelidagi `RamLfeProgramPolicy` va `RamLfeExecutionReceipt` RAM-LFE turlaridir. BFV parametrlari, shifrmatn qadoqlari va yashirin RAM-FHE dastur profili esa siyosat ishlatadigan shifrlangan bajarish moduliga tegishli.

## Nimalarni qayd etadi? {#what-it-records}

RAM-LFE dastur siyosati `program_id` bo‘yicha global miqyosda ro‘yxatdan o‘tkaziladi. Siyosat quyidagilarni o‘z ichiga oladi:

- siyosatni faollashtirish, faolsizlantirish yoki boshqacha o‘zgartirish huquqiga ega hisob
- mijozlarga e’lon qilinadigan hisoblash moduli
- `signed` yoki `proof` qiymatiga ega tasdiqnomani tekshirish rejimi
- yashirin dastur metama’lumotlari va baholovchi siriga bog‘langan majburiyat
- imzolangan tasdiqnomalar uchun yechuvchining ochiq kaliti
- BFV parametrlari va `ram_fhe_profile` kabi ixtiyoriy ochiq shifrlangan kirish metama’lumotlari
- siyosat yangi tasdiqnomalar bera olishini boshqaradigan `active` bayrog‘i

Yashirin sir, ochiq matndagi identifikator qiymati va yashirin dastur tanasi global holatda saqlanmaydi. Mijozlar majburiyatlar, oshkor etilmaydigan xeshlar, tasdiqnoma xeshlari, shifrmatnlar va dastur dayjestlarini ichki tuzilishi talqin qilinmaydigan protokol qiymatlari deb hisoblashlari kerak.

## Hisoblash modullari {#backends}

Joriy RAM-LFE qo‘llab-quvvatlashi uchta hisoblash moduli identifikatoriga asoslangan:

| Hisoblash moduli | Vazifasi |
| --- | --- |
| `hkdf-sha3-512-prf-v1` | Majburiyatga bog‘langan PRF baholashi. |
| `bfv-affine-sha3-256-v1` | Shifrlangan identifikator slotlari ustida BFV asosidagi yashirin affin baholash. |
| `bfv-programmed-sha3-256-v1` | Shifrlangan registrlar va xotira yo‘laklari ustida BFV asosidagi dasturlashtirilgan bajarish. |

Identifikator siyosatlari uchun dasturlashtirilgan BFV moduli asosiy zamonaviy yo‘ldir. U hamyonlarga me’yorlashtirilgan kirishni mahalliy shifrlash, yechuvchiga tranzaksiyada ochiq identifikatorni ko‘rmasdan baholash va natija xeshini ro‘yxatdan o‘tgan dastur siyosatiga bog‘laydigan tasdiqnomani qaytarish imkonini beradi.

## Matematika {#math}

Bu bo‘lim joriy RAM-LFE kodi ishlatadigan amalga oshirish darajasidagi algebrani bayon qiladi. Bu xavfsizlik isboti emas, balki siyosatlar, tasdiqnomalar va mijozlar bir xil talqin qilishi kerak bo‘lgan deterministik transkript hamda shifrlangan baholash modelidir.

### Belgilashlar {#notation}

Quyidagicha belgilaymiz:

- \(H(m)\) — Iroha `Hash::new(m)`: `m` ustidagi Blake2b-32, bunda oxirgi baytning eng kichik qiymatli biti majburan `1` qilinadi.
- \(N(x)\) `x` ning kanonik Norito kodlash usuli bo'lsin.
- \(a \parallel b\) bayt satrlarini ketma-ket ulashni bildirsin.
- \(\operatorname{le64}(i)\) ishorasiz butun sonning 8 baytli little-endian kodlanishi bo‘lsin.
- \(s\) global holatdan tashqarida saqlanadigan yechuvchi siri bo‘lsin.
- \(P\) ochiq siyosat parametrlari bo‘lsin.
- \(A\) so‘rovga bog‘liq ma’lumotlar bo‘lsin.
- \(x\) hisoblash moduliga qarab me’yorlashtirilgan kirish baytlari yoki Norito bilan kodlangan shifrlangan kirish qadoqi bo‘lsin.

RAM-LFE domen bo‘yicha ajratilgan xeshlardan foydalanadi. Quyidagi formulalarda domenlar vazifasiga qarab nomlangan; ularning joriy bayt satrlari quyidagicha:

| Belgi | Domen satri |
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

### Siyosat majburiyati {#policy-commitment}

Siyosat majburiyati ochiq parametrlar va yechuvchining yashirin sirini hisoblash moduliga bog‘laydi. Avval sir uchun alohida majburiyat hisoblanadi:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Soʻngra toʻliq siyosat transkripti kodlanadi:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

e’lon qilinadigan siyosat xeshi esa quyidagicha:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

Zanjirdagi `PolicyCommitment` quyidagicha:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

Baholash jarayoni bajarish muhiti siridan xuddi shu qiymatni qayta hisoblaydi. Qayta hisoblangan xesh farq qilsa, majburiyat mos kelmagani sababli baholash rad etiladi.

### HKDF-SHA3-512 hisoblash moduli {#hkdf-sha3-512-backend}

`hkdf-sha3-512-prf-v1` uchun natija me’yorlashtirilgan kirishning o‘zidir, ammo oshkor etilmaydigan identifikator va tasdiqnoma xeshi sirga bog‘langan PRF natijalaridir.

So‘rov transkripti quyidagicha:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

HKDF tuzi va psevdotasodifiy kalit quyidagicha:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

Oshkor etilmaydigan material kengaytiriladi va xeshlanadi:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

Tasdiqnoma materiali oshkor etilmaydigan identifikatorni ham bog‘laydi:

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

Hisoblash moduli quyidagilarni qaytaradi:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV asoslari {#bfv-primer}

BFV panjara asosidagi gomomorf shifrlash sxemasidir. “Gomomorf” degani dastur shifrlangan qiymatlarni qo‘shib va ko‘paytirib, ularni shifrdan chiqargach ochiq matndagi qiymatlar ustida shu amallar bajarilgandagi natijani olishi mumkinligini anglatadi.

RAM-LFE da BFV kirishni shifrlash mexanizmi sifatida ishlatiladi:

1. Hamyon telefon raqami yoki elektron pochta manzili kabi maxfiy qiymatni me’yorlashtiradi.
2. Hamyon baytlarni kichik butun sonli slotlarga aylantiradi.
3. Har bir slot yechuvchining BFV ochiq kaliti bilan shifrlanadi.
4. Yechuvchining bajarish muhiti shu shifrmatnlar ustida yashirin dasturni baholaydi.
5. Bajarish muhiti faqat yashirin dastur natijasini shifrdan chiqaradi va tasdiqnomani imzolaydi yoki isbotlaydi.

BFV taxminiy emas, aniq butun sonli arifmetikadan foydalanadi. Shu sababli u suzuvchi nuqtali model xulosasidan ko‘ra identifikator baytlari va kichik modulli hisob-kitoblarga mosroq. Iroha joriy BFV qo‘llanishida har bir shifrlangan slot \(t\) moduli bo‘yicha bitta skalyar qiymatni — odatda bayt yoki bayt uzunligi maydonini — olib yuradi. Shifrmatnning o‘zi ancha katta \(q\) moduli bo‘yicha ishlaydi. \(q\) bilan \(t\) orasidagi farq shifrlash va gomomorf amallar kiritadigan shovqinni saqlagan holda shifrni to‘g‘ri ochishga yetarli oraliq beradi.

BFV shifrmatni ikki polinom tarkibiy qismidan iborat:

$$
c=(c_0,c_1)
$$

Maxfiy kalit ham \(s_k\) polinomidir. Shifrni ochish tarkibiy qismlarni quyidagicha birlashtiradi:

$$
v = c_0 + c_1s_k
$$

Shifrmatn to‘g‘ri tuzilgan va shovqin yetarlicha kichik bo‘lsa, \(v\) masshtablangan ochiq matnga yaqin bo‘ladi. Yaxlitlash ochiq matn koeffitsiyentini \(t\) moduli bo‘yicha tiklaydi. Muhim xususiyat shundaki, shifrmatn amallari shu tuzilmani saqlaydi:

| Ochiq matndagi amal | Shifrmatndagi amal |
| --- | --- |
| \(m+n\) | Shifrmatn tarkibiy qismlarini qo‘shish. |
| \(m+\alpha\) | \(c_0\) ga masshtablangan ochiq matn konstantasini qo‘shish. |
| \(\alpha m\) | Shifrmatnning ikkala tarkibiy qismini \(\alpha\) ga ko‘paytirish. |
| \(mn\) | Shifrmatn polinomlarini ko‘paytirish, qayta masshtablash va qayta chiziqlashtirish. |

Ko‘paytirish eng qimmat amaldir. Ikki tarkibiy qismli ikkita shifrmatn ko‘paytmasi tabiiy ravishda \(1\), \(s_k\) va \(s_k^2\) bilan ochiladigan uch tarkibiy qismli shifrmatn hosil qiladi. Qayta chiziqlashtirish e’lon qilingan baholash kaliti yordamida \(s_k^2\) hadini odatiy ikki tarkibiy qismli shifrmatnga qaytaradi. Shunda keyingi qo‘shish va ko‘paytirishlar bir xil shifrmatn shaklida bajariladi.

BFV “darajali” hamdir: har bir shifrlangan amal shovqin budjetining bir qismini sarflaydi. Bu amalga oshirish budjetni yangilash uchun shifrmatnlarni boshlang‘ich holatga qaytarmaydi. Buning o‘rniga RAM-LFE kichik `ram_fhe_profile` ni e’lon qiladi va faqat chegaralangan yashirin dastur shaklini qabul qiladi. Shu tariqa baholash parametrlar majmuasi qo‘llaydigan chuqurlikdan oshmaydi. Joriy dasturlashtirilgan profil registrlar va xotira yo‘laklari sonini qat’iy belgilaydi hamda har dastur qadamida shifrmatnlar orasida ko‘pi bilan bitta ko‘paytirishga ruxsat beradi.

Ushbu RAM-LFE tuzilmasida BFV mijoz kirishini ochiq reyestr ma’lumotlaridan hamda faqat tranzaksiya yoki yo‘nalish foydali yukini ko‘radigan kuzatuvchilardan yashiradi. Bu zanjir istalgan shifrlangan dasturni o‘zi bajaradi degani emas. Torii yechuvchisining bajarish muhiti BFV maxfiy materialiga egalik qiladi, sozlangan yashirin dasturni baholaydi, ruxsat etilgan natijani shifrdan chiqaradi va natijani tasdiqlaydi. Keyin reyestr bu tasdiqni zanjirdagi siyosat majburiyati hamda yechuvchining ochiq kaliti yoki isbot metama’lumotlariga nisbatan tekshiradi.

Identifikator holati ataylab sodda ko‘rinishni tanlaydi. Me’yorlashtirilgan satr quyidagicha kodlanadi:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Har bir element alohida BFV skalyar shifrmatni sifatida shifrlanadi. Bu shakl me’yorlashtirish va qadoq tekshiruvini aniq qiladi, hamyonlarga ochiq parametrlardan shifrlangan so‘rovlar tuzish imkonini beradi hamda yechuvchiga semantik jihatdan teng shifrlangan kirishlarni barqaror tasdiqnoma transkriptiga kanonlashtirishga yordam beradi.

### BFV halqa modeli {#bfv-ring-model}

BFV hisoblash modullari quyidagi negatsiklik polinom halqasidan foydalanadi:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

ochiq matn halqasi esa:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

bu yerda:

- \(n\) — `polynomial_degree`, ikkilik darajasi
- \(q\) - `ciphertext_modulus`
- \(t\) - `plaintext_modulus`
- \(q > t\) va \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Ochiq matn koeffitsiyentlari vektori har bir koeffitsiyentni masshtablash orqali kodlanadi:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

Shifrni ochishda avval quyidagi ifodaning har bir koeffitsiyenti markaziy vakilga ko‘tariladi:

$$
v = c_0 + c_1 s_k \in R_q
$$

so‘ng \(R_t\) ga qayta yaxlitlanadi:

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Bu yerda \(s_k\) — BFV maxfiy kalit polinomi; u tashqi RAM-LFE yechuvchisi siri \(s\) emas.

### BFV kalitlarini yaratish {#bfv-key-generation}

Shifrlangan identifikator kirishi uchun BFV kalit materiali har bir yechuvchi siri va bog‘liq ma’lumotlar bo‘yicha deterministik yaratiladi:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG boshlang‘ich qiymati quyidagicha olinadi:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

Kalit yaratuvchi quyidagi qiymatlarni tanlaydi:

- \(s_k \in \{-1,0,1\}^n\), modulo \(q\) sifatida tasvirlangan
- \(a \leftarrow R_q\) bir tekis taqsimotdan
- \(e \in \{-1,0,1\}^n\)

Ochiq kalit quyidagicha:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Qayta chiziqlashtirishda \(s_k^2\) qiymati \(R_q\) dagi halqa ko‘paytmasi bo‘lsin. \(B\) asosidagi har bir \(j\) raqami uchun \(a_j\) bir tekis, \(e_j\) esa kichik taqsimotdan tanlanadi va quyidagi qiymat e’lon qilinadi:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

Ochiq BFV siyosat metama’lumotlari \((n,q,t,B)\), ochiq kalit va `max_input_bytes` ni o‘z ichiga oladi. BFV maxfiy kaliti va qayta chiziqlashtirish kaliti yechuvchining bajarish muhitida qoladi.

### BFV shifrlashi va amallari {#bfv-encryption-and-operations}

Ochiq matn polinomi \(m\) ni shifrlash uchun amalga oshirish ChaCha20 RNG-ni quyidagi qiymat bilan ishga tushiradi:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

U \(u,e_1,e_2 \in \{-1,0,1\}^n\) qiymatlarini tanlaydi va quyidagilarni hisoblaydi:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

Shifrmatn \(c=(c_0,c_1)\) bo‘ladi.

Gomomorf qo‘shish tarkibiy qismlar bo‘yicha bajariladi:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

Ochiq matn skalyari \(\alpha\) ni nolinchi koeffitsiyentga qo‘shish faqat \(c_0\) ni o‘zgartiradi:

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Ochiq matn skalyari \(\alpha\) ga ko‘paytirish ikkala tarkibiy qismni masshtablaydi:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

Ikki shifrmatn \(c=(c_0,c_1)\) va \(d=(d_0,d_1)\) uchun ko‘paytirish avval uch tarkibiy qismli shifrmatnni hisoblaydi va har bir koeffitsiyentni \(t/q\) bo‘yicha qayta masshtablaydi:

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

Yuqoridagi barcha ko‘paytmalar \(R_q\) dagi negatsiklik halqa ko‘paytmalaridir. Keyin \(\tilde c_2\) \(B\) asosidagi polinomlarga ajratiladi:

$$
\tilde c_2 = \sum_j B^j u_j
$$

va qayta chiziqlashtiriladi:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

Natija yana ikki tarkibiy qismli BFV shifrmatnidir.

### Identifikator shifrmatni qadoqi {#identifier-ciphertext-envelope}

Identifikator kirishining bayt satri:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

skalyar slotlarga kodlanadi:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

qolgan barcha slotlar esa `max_input_bytes + 1` gacha nol bilan to‘ldiriladi. Har bir skalyar slot nolinchi koeffitsiyentli ochiq matn polinomi \([m_i]\) sifatida shifrlanadi. Har bir slot uchun shifrlashning boshlang‘ich qiymati quyidagicha:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

Shifrlangan identifikator qadoqi quyidagicha:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

bu yerda \(M=\mathrm{max\_input\_bytes}\).

### BFV affin hisoblash moduli {#bfv-affine-backend}

`bfv-affine-sha3-256-v1` uchun bajarish muhiti avval BFV kalit materialini \(s\) va \(A\) dan hosil qiladi. Hosil qilingan ochiq parametrlar zanjirdagi majburiyatda qayd etilgan ochiq parametrlarga aynan mos kelishi shart.

Affin sxemaning boshlang‘ich qiymati:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

Bajarish muhiti shu boshlang‘ich qiymatdan \(t\) moduli bo‘yicha 32 qatorli affin sxemani tanlaydi:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

bu yerda \(m_i\) — shifri ochilgan identifikator slotlari. Gomomorf usulda u shifrmatnlar ustida xuddi shu qiymatni hisoblaydi:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

Yechuvchi har bir \(C_j\) ning shifrini ochadi, ochiq matndagi barcha keyingi koeffitsiyentlar nol bo‘lishini talab qiladi, nolinchi koeffitsiyent qiymatlarini baytlarga aylantiradi va quyidagini tuzadi:

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

### Dasturlashtirilgan BFV hisoblash moduli {#bfv-programmed-backend}

`bfv-programmed-sha3-256-v1` uchun ochiq parametrlar BFV identifikatorini shifrlash parametrlarini va yashirin dastur dayjestini birlashtiradi:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

Joriy RAM-FHE profili quyidagicha:

| Maydon | Qiymat |
| --- | --- |
|`profile_version` | `1` |
|`register_count` | `4` |
|`memory_lane_count` | `32` |
|`ciphertext_mul_per_step` | `1` |
|`encrypted_input_mode` |`resolver_canonicalized_envelope_v1` |
|`min_ciphertext_modulus` | \(2^{52}\) |

Torii ga yuborilgan ochiq matn kirishi bajarilishdan oldin xuddi shu BFV qadoqiga shifrlanadi. Server tomonidagi shifrlashning deterministik boshlang‘ich qiymati quyidagicha:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Tashqaridan berilgan shifrlangan kirish uchun yechuvchi identifikator qadoqining shifrini ochadi va bajarishdan avval uni shu deterministik qadoqqa qayta shifrlaydi. Bunday kanonlashtirish semantik jihatdan teng BFV shifrmatnlari uchun tasdiqnoma xeshlarini barqaror saqlaydi.

Dastlabki shifrlangan xotira yo‘laklari quyidagidan hosil qilinadi:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

32 yo‘lakning har biri uchun bajarish muhiti \(r_j \in [0,t)\) qiymatini tanlaydi va \(r_j\) ni shifrlaydigan BFV shifrmatnini saqlaydi. So‘ng yashirin dastur shifrlangan registrlar va xotira ustida bajariladi:

| Ko‘rsatma | Algebra |
| --- | --- |
|`LoadInput(dst, i)` |\(R_{\mathrm{dst}} \leftarrow C_i\) |
|`LoadState(dst, j)` |\(R_{\mathrm{dst}} \leftarrow S_j\) |
|`StoreState(j, src)` |\(S_j \leftarrow R_{\mathrm{src}}\) |
|`LoadConst(dst, a)` |\(R_{\mathrm{dst}} \leftarrow \operatorname {Enc}(a) \) |
|`Add(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
|`AddPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
|`SubPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
|`MulPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
|`Mul(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_aR_b\), so‘ng qayta chiziqlashtirish |
|`SelectEqZero(dst, cond, z, nz)` |\(R_{\mathrm{cond}}\) shifrini ochish; nol bo‘lsa \(R_z\), aks holda \(R_{nz}\) ni tanlash. |
|`Output(src)` |\(R_{\mathrm{src}}\) ni natija registrlari ro‘yxatiga qo‘shish. |

Ko‘rsatmalar lentasi tugagach, yechuvchi har bir natija registrining shifrini ochadi, nolinchi koeffitsiyentni baytga aylantiradi va shu baytlarni ketma-ket ulaydi:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

Umumiy dasturlashtirilgan hisoblash modulining xeshlari:

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

Standart dasturlashtirilgan identifikator lentasida 64 ta kirish sloti bor. Har bir \(i\) slot uchun u kirish slotini va \(i \bmod 32\) xotira yo‘lagini yuklaydi, ularni qo‘shadi va natijani chiqaradi:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Natija xeshlari va tasdiqnomalar {#output-hashes-and-receipts}

Umumiy RAM-LFE bajarish tasdiqnomasi xom natijani emas, natija xeshini imzolaydi:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Torii RAM-LFE bajarish tasdiqnomalari uchun bog‘liq ma’lumotlar kanonik dastur identifikatorining baytlaridir:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

Imzolanadigan tasdiqnoma foydali yuki:

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

`signed` rejimida:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

Tekshiruv imzoni `resolver_public_key` bilan tekshiradi va quyidagi tengliklarning barchasi bajarilmasa, tasdiqnomani rad etadi:

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

Agar chaqiruvchi `output_hex` ni bersa, tekshiruvchi quyidagini ham tekshiradi:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

`proof` rejimida attestatsiya imzo o‘rniga isbot qadoqini olib yuradi. Tekshiruv isbot moduli, sxema identifikatori, ochiq kirish sxemasi xeshi, tekshirish kaliti xeshi va oshkor qilingan ochiq nusxalar isbot tekshiruvchisi metama’lumotlari hamda kodlangan tasdiqnoma foydali yuki xeshiga mos kelishini tekshiradi.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

Kutiladigan ochiq nusxalar bittadan elementli to‘rtta ustundan iborat. \(j\) ustunida \(h_{8j}\ldots h_{8j+7}\) baytlari va ulardan keyin 24 ta nol bayt bo‘ladi:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Identifikator proyeksiyasi {#identifier-projection}

Identifikatorni yechish jarayoni umumiy hisoblash modulining `opaque_hash` qiymatini foydalanuvchiga ko‘rsatiladigan oshkor etilmaydigan hisob identifikatori sifatida ishlatmaydi. Buning o‘rniga RAM-LFE natija xeshini identifikatorga xos domenlar orqali akslantiradi:

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

`IdentifierResolutionReceipt` yuqori darajadagi quyidagi foydali yukni imzolaydi:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

Imzolangan identifikator tasdiqnomalari uchun:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` tasdiqnomani faqat imzo yoki isbot haqiqiy bo‘lsa, ichiga joylangan RAM-LFE bajarish foydali yuki ko‘rsatilgan dastur siyosatiga mos kelsa va `uaid` bilan `account_id` da’vo qilinayotgan bog‘lanishni ifodalasa qabul qiladi.

## Bajarish jarayoni {#execution-flow}

Umumiy RAM-LFE bajarish jarayoni quyidagicha:

1. Boshqaruv yoki operator `RamLfeProgramPolicy` ni ro‘yxatdan o‘tkazadi.
2. Egasi siyosatni faollashtiradi.
3. Mijoz ochiq siyosat metama’lumotlarini Torii dan o‘qiydi.
4. Mijoz yechuvchiga aynan bitta kirish turini yuboradi: ochiq matndagi `input_hex` yoki shifrlangan BFV kirish qadoqi.
5. Bajarish muhiti yashirin dasturni baholaydi va `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash` hamda `RamLfeExecutionReceipt` ni qaytaradi.
6. Mijoz yoki server tomoni tasdiqnomani e’lon qilingan siyosatga nisbatan tekshiradi; ixtiyoriy ravishda qaytgan `output_hex` xeshi tasdiqnomadagi `output_hash` ga tengligini ham tekshiradi.
7. `ClaimIdentifier` kabi yuqori darajadagi ko‘rsatma xom kirish o‘rniga attestatsiyalangan tasdiqnomani ichiga joylashi mumkin.

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

## Identifikator siyosatlari {#identifier-policies}

Identifikator siyosatlari RAM-LFE ning aniq qo‘llanishidir. Ular umumiy dastur siyosatiga biznes nomlar makoni va me’yorlashtirish qoidasini qo‘shadi:

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

Identifikator qatlami RAM-LFE tasdiqnomasi orqali quyidagilarni bog‘laydi:

- `policy_id`
- yashirin funksiya hosil qilgan oshkor etilmaydigan identifikator
- deterministik `receipt_hash`
- hisobning UAID
- kanonik `account_id`
- umumiy RAM-LFE bajarish foydali yuki

Foydalanuvchini tizimga qabul qilishda hisob taxalluslarini maxfiy identifikatorlardan ajratib saqlang. Taxalluslar ochiq nomlardir; telefon raqami, elektron pochta manzili va shunga o‘xshash qiymatlar identifikator siyosatlari hamda tasdiqnomalari orqali o‘tishi kerak.

## Torii yo‘nalishlari {#torii-routes}

Ilovaga mo‘ljallangan yo‘nalishlar oilasi yoqilganda Torii RAM-LFE va identifikator yordamchilarini taqdim etadi:

| Yo‘nalish | Vazifasi |
| --- | --- |
| `GET /v1/ram-lfe/program-policies` | Faol va faol bo‘lmagan RAM-LFE dastur siyosatlari hamda ochiq bajarish metama’lumotlarini ro‘yxatlash. |
| `POST /v1/ram-lfe/programs/{program_id}/execute` | `input_hex` yoki `encrypted_input` dan bitta dasturni bajarib, natija xeshlari va holatsiz tasdiqnomani qaytarish. |
| `POST /v1/ram-lfe/receipts/verify` | `RamLfeExecutionReceipt` ni e’lon qilingan siyosatga nisbatan tekshirish va ixtiyoriy ravishda `output_hex` ni `output_hash` bilan solishtirish. |
| `GET /v1/identifier-policies` | Identifikator siyosatlari, me’yorlashtirish rejimlari, yechuvchi kalitlari va shifrlangan kirish metama’lumotlarini ro‘yxatlash. |
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` | Foydalanuvchi `ClaimIdentifier` ichiga joylashi mumkin bo‘lgan tasdiqnomani chiqarish. |
| `POST /v1/identifiers/resolve` | Faol da’vo mavjud bo‘lsa, me’yorlashtirilgan identifikator kirishini bog‘langan hisobga yechish. |
| `GET /v1/identifiers/receipts/{receipt_hash}` | Tekshiruv va yordamchi vositalar uchun saqlangan identifikator da’vosini tasdiqnoma xeshi bo‘yicha topish. |

Bu yo‘nalishlardan foydalanadigan dastur tuzishdan oldin doimo maqsad tugunning `/openapi.json` hujjatini tekshiring. Mavjudlik tugun yig‘ilmasi va tarmoq profiliga bog‘liq.

## Tugunning bajarish muhiti {#node-runtime}

Torii jarayoni ichidagi RAM-LFE bajarish muhiti `torii.ram_lfe.programs[*]` ostida sozlanadi va `program_id` bo‘yicha kalitlanadi. Har bir sozlangan dastur zanjirdagi siyosat majburiyatiga mos kelishi va tasdiqnomalarni baholash hamda attestatsiyalash uchun zarur bajarish materiali bilan ta’minlanishi kerak. Identifikator yo‘nalishlari shu muhitdan qayta foydalanadi; ular alohida identifikator-yechuvchi sozlamalar sirtini talab qilmaydi.

Siyosatni zanjirda ro‘yxatdan o‘tkazishning o‘zi yetarli emas. Maqsad tugun yo‘nalishlar oilasini ham taqdim etishi va bajarishi kutiladigan dasturlar uchun mos bajarish materialiga ega bo‘lishi kerak.

## Ishlatishdagi himoya choralari {#operational-guardrails}

- Siyosatlarni faol bo‘lmagan holatda ro‘yxatdan o‘tkazing, ochiq metama’lumotlarni tekshiring, keyin faollashtiring.
- Yashirin baholovchi sirlari, yechuvchining imzolash kalitlari va BFV maxfiy materialini hujjatlar, jurnallar, tranzaksiyalar hamda mijoz to‘plamlariga kiritmang.
- Xom identifikatorlarni hisob taxalluslari, tranzaksiya metama’lumotlari, hodisalar yoki global holat maydonlariga joylamang.
- SDK tekshiruvchini taqdim etsa, yuqori darajadagi ko‘rsatmalarni yuborishdan avval tasdiqnomalarni mijoz tomonida tekshiring.
- Eskirgan tasdiqnomalar cheksiz muddat amal qilmasligi kerak bo‘lsa, tugash muddati maydonlaridan foydalaning.
- Kalitlarni yangilash uchun yangi dastur yoki identifikator siyosatini ro‘yxatdan o‘tkazing, mijozlarni ko‘chiring va yangi tasdiqnomalar oqimi yo‘lga qo‘yilgach eski siyosatni faolsizlantiring.

## Bog'liq mavzular {#related-topics}

- [Xususiy ma'lumotlar maydoni uchun homiylik to'lovlari](/uz/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii so‘nggi nuqtalari](/uz/reference/torii-endpoints.md#app-and-sora-route-families)
- [Anonim tranzaksiyalar](/uz/blockchain/anonymous-transactions.md)
