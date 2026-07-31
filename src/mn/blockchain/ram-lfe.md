---
translation_locale: mn
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE "Random-Access Machine Laconic Function Evaluation" гэсэн үг юм.
Iroha, Энэ нь олон нийтийн бодлого
зах зээлд орсон боловч үнэлгээний логик, нууц эсвэл түүхий эдийг
Дэлхийн улс орнуудад бичигдсэн. SORA Nexus тодорхойлогч урсгал, жишээ нь:
хувийн утсаар эсвэл цахим захиалгаар хайж, бас нэг төрлийн Torii
програм гүйцэтгэх туслах нь түймэрний профилээр апп-тай чиглэсэн замыг чаддаг бол.

Сүлжээ нь бодлогын үүрэг гүйцэтгэх болон хүлээн зөвшөөрөгдлийн баталгаажуулах метабараа хадгалдаг.
шийдвэрлэгч эсвэл Torii Runtime нь нууцлагдсан хөтөлбөрийг үнэлдэг бөгөөд зөвхөн
зөвшөөрөл гарсан, үйлчлүүлэгчид, дэмжлэг хэрэгсэл, эсвэл
томоохон бүртгэлийн заавар нь бүртгэлтэй бодлогын эсрэг шалгаж болно.

## Нэрлэглэл {#naming}

Үүнд нэрлэх нь чухал юм:

| Хурлын хугацаа | Үр дүн |
| --- | --- |
| `ram_lfe` | Гадаад нууцлагдсан функцын дүгнэлт: хөтөлбөрийн бодлого, үүрэг даалгавар, гүйцэтгэх түлхүүжилт, түлхүүгийн баталгаажуулах хэлбэр. |
| `BFV` | Brakerski/Fan-Vercauteren хомоморфик шифрлэлийн систем нь шифрлэгдсэн орж ирсэн RAM-LFE Дээр нь. |
| `ram_fhe_profile` | BFV- програмчлагдсан шифрлэсэн гүйцэтгэх машины хувьд тодорхой метабараа. RAM-LFE. |

Мэдээллийн загварын хувьд `RamLfeProgramPolicy` болон `RamLfeExecutionReceipt` байна
RAM-LFE төрөл бүрийн. BFV параметр, шифр бичгийн хуудас болон нууцлагдсан
RAM-FHE програмны хувилбар нь шифрлэгдсэн гүйцэтгэх түвшинд
Улс төр.

## Энэ нь юуг бичдэг вэ? {#what-it-records}

А RAM-LFE хөтөлбөрийн бодлого нь дэлхийн хэмжээнд `program_id`. Улс төр
дараах зүйлсийг агуулж байна:

- Хувьцаа эзэмшигч дансыг идэвхжүүлэх, идэвхгүй болгох, эсвэл өөрөөр хэлбэл
  бодлого
- үйлчлүүлэгчдэд зарласан хорио
- хүлээн авах ажиллагааны баталгаажуулалтын хэв маяг `signed` эсвэл `proof`
- нууцлагдсан хөтөлбөрийн метабараа болон үнэлгээний нууцыг хүлээн зөвшөөрөх
- гарын үсэг зурсан хүлээн авах бүртгэлийн шийдвэрийн олон нийтийн цөм
- сонголттой олон нийтийн шифрлэгдсэн өгөгдлийн метабараа, жишээ нь: BFV параметр,
  `ram_fhe_profile`
- нэг `active` бодлого шинэ хүлээн авах боломжтой эсэхийг хяналт тавих тэмдэг

Хаалсан нууц, энгийн бичгийн тодруулгын үнэ цэнэ, нууцлан байгаа програмын багш нь
Хэрэглэгчид гэрээ, ил тод хэшиг,
хүлээн авах хэшүүд, шифрлэгийн текст, хөтөлбөрийн түвшин нь үл ил тод протоколын үнэ цэнэтэй.

## Эдгээрийн талаар {#backends}

Цахилгаан RAM-LFE дэмжлэг нь гурван хяналт шалгаруулалтад төвлөрсөн:

| Хөдөлмөрийн хорио | Хэрэглээ |
| --- | --- |
| `hkdf-sha3-512-prf-v1` | Үүнд үүрэг гүйцэтгэх PRF үнэлгээ. |
| `bfv-affine-sha3-256-v1` | BFV- нууцлагдсан тодруулгын хувилбарыг сануулсан тайван үнэлгээний дэмжлэг. |
| `bfv-programmed-sha3-256-v1` | BFV-хүний бүртгэл болон дурсгалын замаар програмчлагдсан гүйцэтгэх дэмжлэгтэй. |

Мэдээлэл баримтлалын бодлогын хувьд BFV Хөгжлийн хяналт нь чухал шинэ
Энэ нь мөнгөний сангийн шифрлэлтийг орон нутгаар хэвийн оруулж, шийдвэрлэгч
гүйлгээнд олон нийтийн тодорхойлогчийг үзээгүйгээр үнэлэх,
гашийг бүртгэлтэй хөтөлбөрийн бодлогыг холбодог хүлээн зөвшөөрөл.

## Математик {#math}

Энэ хэсэг нь одоогийн
RAM-LFE Энэ нь аюулгүй байдлын баталгаа биш, энэ бол тодорхойлолттой шилжилт
бодлого, түлхүүжилт, үйлчлүүлэгчид
Та нар үүнийг хүлээн зөвшөөрөгдсөн.

### Хэвлэл {#notation}

Хөгжүүл:

- \(H(m)\) байх Iroha `Hash::new(m)`: Блейк-2Б-32 дууссан `m`, хамгийн багатай
  эцсийн байтын томоохон хэсэг нь `1`.
- \(N(x)\) нь хуулийн дагуу байх Norito цахилгаан `x`.
- \(a \parallel b\) Байт-хичлийн холболт.
- \(\operatorname{le64}(i) \) нь 8-байтын бага эндиан кодлогыг
  гарын үсэг зураагүй бүрэн тоо.
- \(s\) Гадаад ертөнцөд хадгалагдаж буй нууцыг шийдвэрлэх хүн болно.
- \(P\) олон нийтийн бодлогын параметр байх.
- \(A\) холбогдох мэдээллийг хүснэ.
- \(x\) нэвтрүүлэгний байт эсвэл Norito-Эрдэм шинжилгээний хөтөлбөр
  Хөгжлийн хяналт шалгаруулалтын дагуу.

RAM-LFE доменийн хэшийг ашигладаг.
зориулалт; тэдгээрийн одоогийн байт жирүүд нь:

| Символ | Доменийн шугам |
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

### Улс төрийн үүрэг гүйцэтгэх {#policy-commitment}

Улс төрийн бодлогын үүрэг гүйцэтгэх нь олон нийтийн параметр, нууц шийдвэрлэгч
Нэгдүгээрт, нууц нь тусдаа хийгддэг:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Дараа нь бүх бодлогын шилжилтийг кодлож:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

нийтлэгдсэн бодлогын хэш нь:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

Хөнгөн цахилгаан `PolicyCommitment` нь:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

Хүнджилт нь ижил үнэ цэнийг гүйлтийн цагийн нууцыг дахин тооцоодог.
Шинэ тооцоолсон хэш нь ялгаатай, үнэлгээ нь үүрэг гүйцэтгэлийн зөрүүтэй тэнцдэггүй.

### HKDF-SHA3-512 Хөдөлмөрийн хорио {#hkdf-sha3-512-backend}

Үүнд `hkdf-sha3-512-prf-v1`, үр дүн нь хэвийн оруулж ирсэн өгөгдлийн өөрөө, гэхдээ
ил тод тодорхойлогч, хүлээн авахын хэш нууцлан байгуулсан PRF үр дүн.

Хэрэглэлийн шилжилт:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

Хөдөлмөрийн HKDF тус, хиймэл тохиолдлын товч нь:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

Өргөдлийн бус материалыг өргөжүүлэн хэшээр:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

Төгсөлтийн материалын дагуу нээлттэй дүрэм тэмдэгт:

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

Хөдөлмөрийн хойч нь:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV Урьдчилгаа {#bfv-primer}

BFV "Хоммоморф" нь шүлэг дээр суурилсан хомоморфик шифрлэлийн схема юм.
хөтөлбөр нь шифрлэсэн үнэ цэнэүүдийг нэмж, олон дахин нэмэгдүүлэх боломжтой бөгөөд шифрлэсний дараа
нэмэлт, үр дүнг гүйцэтгэсэн бол ижил үр дүнд хүрнэ
энгийн бичгийн үнэ цэнэтэй.

Үүнд RAM-LFE, BFV шифрлэгдсэн дуудлагын механизмын хувьд ашигладаг:

1. Портс нь утасны үнэ цэнэ, ядуулан утсаа нэрийн тоо эсвэл цахим захиалгыг хэвийн болгодог
   хаяг.
2. Мөнгөмбөг нь байтдыг жижиг цэцэрлэг шүүрэд хувиргадаг.
3. Бүх хувилбар нь шийдвэрлэхчийн шифрлэгдсэн BFV Олон нийтийн гол.
4. Хөдөлмөрийн цахилгаан нь нууцлагдсан хөтөлбөрийг эдгээр шифрлэлийн текст дээр үнэлдэг.
5. Хөдөлмөрийн цалин нь зөвхөн нууцлан байгаа програмны гарааг уншилдаг бөгөөд тэмдэглэдэг эсвэл
   Төгсгөл.

BFV Энэ нь томоохон бүтэн тооны арифметикийн биш, ойролцооны арифметики.
тодорхойлогч байт болон жижиг модулийн тооцоо хийхэд илүү тохиромжтой
Хөдөлгөөн, хөдөлгөөн Iroha Одоогийн BFV хэрэглээ, тус бүр шифрлэгдсэн
slot нь нэг scalar үнэ цэнэ модуль \(t\), ихэвчлэн байт эсвэл байт урт
Энэ нь ч гэсэн илүү том бүтэн тооны модуль \(q\). Хөдөлмөрийн
хоорондын зөрүү \(q\) болон \(t\) шифрлэх нь дуу хоолой
болон гомоморф үйлдлийг оруулж ирнэ.

А BFV ciphertext нь хоёр полиномийн бүрэлдэхүүнтэй:

$$
c=(c_0,c_1)
$$

нууц товч нь өөр олон давхар юм \(s_k\). Хөгдөлмөрийг уншиулах нь
бүрэлдэхүүн хэсэг:

$$
v = c_0 + c_1s_k
$$

Хэрэв шифр бичгийг зөв боловсруулж, дуу чимээ нь хангалттай бага байсан бол
\(v\) товчлолт нь товчлолтын дугаартай ойролцоо байдаг
модуль коэффициент \(t\). Хэрэглэг шинж чанар нь шифр бичгийн үйл ажиллагаа
Энэ бүтцийг хадгалах:

| Гадаад үйл ажиллагаа | Шифр бичгийн үйлдэл |
| --- | --- |
| \(m+n\) | Шифр бичгийн бүрэлдэхүүн хэсгийг нэмнэ. |
| \(m+\alpha\) | Тодруулсан хэвийн бичгийн тогтмол \(c_0\). |
| \(\alpha m\) | Хоёр шифр бичгийн бүрэлдэхүүн хэсгийг \(\alpha\). |
| \(mn\) | Шифр бичгийн олон тооны хэсгийг дахин нэмэгдүүлж, дараа нь эргэн шуурхай. |

Хоёр хэсгээс хоёр нь үржихүйн үр дүн
ciphertexts нь байгаль орчинд 3 бүрэлдэхүүн хэсгийн шифр бичгийг бий болгодог
\(1\), \(s_k\), болон \(s_k^2\). Шинэ чиглэлийн шинэчлэл нь хэвлэгдсэн үнэлгээний түлхүүр ашигладаг
. \(s_k^2\) Энэ нь хоёр бүрэлдэхүүнтэй шифрлэлт хэвийн
дараагийн нэмэлт, үржихүлийг ижил шифр бичгийн хэлбэрээр хадгалж байна.

BFV мөн "асар их хэмжээний": нууцалсан үйл ажиллагаа нь зарим дуу чимээний төсөв хэрэглэдэг.
Энэхүү хэрэгжилт нь энэ төсвийн шинэчлэл хийхэд шифр бичгийг буутстрап хийдэггүй.
Үүнээс гадна RAM-LFE бага хэмжээний `ram_fhe_profile` Зөвхөн хязгаарлагдмал
Энэ нь үнэлгээг параметрын багц дотор хадгалж байна
Одоогийн програмчлагдсан профил нь байнгын регистрийг зөвшөөрдөг
тооцгоо, хадгаламжтай ходны замын тооцгоо болон хамгийн ихдээ нэг шифр бичгийн шифр бичгийг
програмчлагдсан алхам тутамд үржих.

Энэ ... RAM-LFE загвар, BFV үйлчлүүлэгчдийн өгөгдлийг олон нийтийн номын сангийн мэдээллээр нууж,
Зөвхөн гүйлгээ, маршрутын ачааллыг харах ажиглагчид.
Энэ зангилаа нь өөрийн биеэ ч гэсэн санамсаргүй шифрлэгдсэн хөтөлбөрүүдийг гүйцэтгэдэг. Torii шийдвэрлэгч
цахилгаан цаг нь одоо ч гэсэн BFV нууц материалыг үнэлдэг
програм, зөвшөөрөлтэй үр дүнг унтрааж, үр дүнг баталгаажуулна.
дараа нь зах зээлийн бодлогын үүрэг гүйцэтгэгчтэй холбоотой баталгаажуулалтыг шалгаж,
олон нийтийн ач холбогдолтой эсвэл баталгаатай метабараа шийдвэрлэх.

Тэнд зориулан энгийн төлөөллийг сонгодог.
Нормаль штринг нь:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Аливаа элемент нь өөрийн гэсэн шифрлэгддэг BFV Энэ хэлбэр нь
стандарт болон хуудасны баталгаажуулалт тодорхой, мөнгөний санхүүгийн шифрлэгдсэн бүтээн байгуулалт зөвшөөрдөг
олон нийтийн параметрүүдээс хүсэлт гаргадаг бөгөөд шийдүүлэгчид ижил төстэй
Үргэлтгүй хүлээн авах бүртгэлийн шифрлэгдсэн өгөгдлийг.

### BFV Гулгалтын загвар {#bfv-ring-model}

Хөдөлмөрийн BFV Дээрх хэсэг нь negacyclic polynomial ring-ийг ашигладаг:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

болон энгийн бичгийн дугуй:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

хаана:

- \(n\) бол `polynomial_degree`, 2 дугаар хүчтэй
- \(q\) бол `ciphertext_modulus`
- \(t\) бол `plaintext_modulus`
- \(q > t\) болон \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Бэлэн текст коэффициент вектор нь тус бүрийн коэффициентыг масштаблах замаар кодлодог:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

Хэвлэл мэдээллийн төв нь дараахын коефициентийг нэмэгдүүлнэ:

$$
v = c_0 + c_1 s_k \in R_q
$$

Дараа нь түүнийг эргэн \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Энд \(s_k\) Энэ бол BFV нууц товчтой олон талт, гадаад биш RAM-LFE шийдвэрлэгч
нууц \(s\).

### BFV Нүүр үеийнх нь {#bfv-key-generation}

Шифрлэгдсэн тодруулгын өгөгдлийн хувьд: BFV гол материал нь тодорхойлолт
Resolver нууц болон холбогдох мэдээлэл:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

Хөдөлмөрийн BFV RNG дараах хэлбэрээр тариалж байна:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

Үндсэн генераторын үлгэрийн:

- \(s_k \in \{-1,0,1\}^n\), төлөөлөгч модул \(q\)
- \(a \leftarrow R_q\) нэгдсэн
- \(e \in \{-1,0,1\}^n\)

Олон нийтийн гол нь:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Зурагшилж, эргэлт хийхэд \(s_k^2\) гулгалтын бүтээгдэхүүнийг \(R_q\). Хүн бүрийн хувьд
Үндсэн ...\(B\) дуудлага \(j\), үзлэг \(a_j\) түгээмэл, \(e_j\) жижигээс
хуваарилах, дараа нь:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

Олон нийт BFV бодлогын метадэт нь \(((n,q,t,B)\), олон нийтийн ач холбогдолтой бөгөөд
`max_input_bytes`. Хөдөлмөрийн BFV нууц товч болон эргэлтийн товч хэвтэн үлдэх
шийдэл гүйцэтгэх цаг.

### BFV Шифрлэлт, үйл ажиллагаа {#bfv-encryption-and-operations}

Энгийн бичгийн олон хэсгийг шифрлэх \(m\), хэрэгжилт нь өөр үр тариа
ChaCha20 RNG Үүнээс:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

Энэ нь үлгэр \(u,e_1,e_2 \in \{-1,0,1\}^n\) болон тооцоолдог:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

Шифрлэлийн текст нь \(c=(c_0,c_1)\).

Хомоморф хувилбар нь бүрэлдэхүүн хэсгээс:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

Тодруулсан хэвийн текст scalar \(\alpha\) Зөвхөн нөлөөний коэффициент өөрчлөгдөж байна
\(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Нүүр хуудас: \(\alpha\) хоёр бүрэлдэхүүн хэсгийг:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

Хоёр шифрлэгийн текст \(c=(c_0,c_1)\) болон \(d=_0,d_1)\), шифрлэгийн текст
үржихүйн эхлээд гурван хэмжээний шифр бичгийг тооцоолон, тус бүр хэмждэг
эргэлтийн үзүүлэлт \(t/q\):

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

Дээрх бүх бүтээгдэхүүн нь \(R_q\). Дараа нь
\(\tilde c_2\) багийн ...\(B\) олон талт:

$$
\tilde c_2 = \sum_j B^j u_j
$$

болон дахин шугамжлагдсан:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

Үр дүн нь дахин хоёр бүрэлдэхүүнтэй BFV шифр бичлэг.

### Мэдээний шифр {#identifier-ciphertext-envelope}

Мэдээлэл тэмдэгний өгөгдлийн байт шугам:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

scalar slot-д кодлогдсон:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

болон үлдсэн бүх мөчид нь 0 хүртэл `max_input_bytes + 1`. Арьс суурь
Слот нь нөлөөний тэнцвэрт цагаан текст полиномиар шифрлэгддэг \([m_i]\).
Нэг мөрийн шифрлэх үр нь:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

Шифрлэгдсэн тодруулгын хуудас нь:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

хаана \(M=\mathrm{max\_input\_bytes}\).

### BFV Өргөдлийн төгсгөл {#bfv-affine-backend}

Үүнд `bfv-affine-sha3-256-v1`, цахилгаан хэрэглээний цаг нь анх BFV гол материал
\(s\) болон \(A\). Үүнээс үүдэлтэй олон нийтийн параметр нь олон нийтийг тохирсон байх ёстой
зах зээлийн дагуу үүрэг гүйцэтгэсэн параметр.

Эрдэнэт эргэлтийн үр тариа нь:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

Энэ үр тарианы үр дүнгийн шинжилгээ, модуль \(t\), 32 шугамаартай эргэлт:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

хаана \(m_i\) Энэ нь шифрлэгдсэн тодорхойлогч хуудсууд юм.
шифрлэгийн текст дээр ижил үнэ цэнэ:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

Хөдөлмөрийн шийдвэрлэгч нь аль алиныг ч шифрлэдэг \(C_j\), бүх дараах хэвийн бичгийг шаарддаг
0 гэсэн коэффициент, коэффициентийн нөлөөний үнэ цэнийг байт болгоно,
хэлбэр:

$$
O=(y_0,\ldots,y_{31})
$$

Дараа нь:

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

### BFV Хөгжлийн хөтөлбөр {#bfv-programmed-backend}

Үүнд `bfv-programmed-sha3-256-v1`, олон нийтийн параметр нь BFV тодорхойлогч
Шифрлэлийн параметр болон нууцлагдсан хөтөлбөрийн дигес:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

Одоогийн RAM-FHE хувилбар нь:

| Газар | Үр дүн |
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

Нүүр хуудас Torii яг л BFV хуудас
Энэ сервер талын шифрлолт нь:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Гадаадгаар дамжуулсан шифрлэсэн өгөгдлийн хувьд шийдвэрлэгч идентификаторыг уншилдаг
хэрэглэхээс өмнө энэ тодорхойлолттай хуудас дээр дахин нууцалдаг.
Энэ canonicalization хүлээн зөвшөөрөгдлийн хэшийг тогтвортой үлдээж байна
BFV шифр бичлэг.

Эхний шифрлэгдсэн дурсгалын замыг:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

32 замын нэг бүрээр гүйлтийн хугацааны үзлэг \(r_j \in [0,t)\) болон a хадгалах BFV
шифрлэлтийн текст шифрлэх \(r_j\). Хаалсан хөтөлбөр нь дараа нь шифрлэсэн дээр гүйцэтгэдэг
бүртгэл болон нууцалт ход:

| Судалгаа | Алгебра |
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | \(Р_\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\) |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\), Дараа нь дахин шугамжлан |
| `SelectEqZero(dst, cond, z, nz)` | Хөгжил \(R_{\mathrm{cond}}\); сонгох \(R_z\) цөөц нь 0 байх үед \(R_{nz}\). |
| `Output(src)` | Хөгжил \(R_{\mathrm{src}}\) гаргах бүртгэлийн жагсаалтад. |

Сургалтын тас дууссан дараа шийдэгч нь гарааны аль нэг хэсгийг уншилдаг
бүртгүүлж, нөлөөний коефициентийг байт болгож, эдгээр байтыг холбоно:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

Нэрлэг програмчлагдсан хойноо хэшүүд нь:

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

Үндсэн програмчлагдсан идентификаторны тас нь 64 нэвтрүүлэгний шугамтай байдаг.
\(i\), Энэ нь нэвтрүүлгийн хувилбарыг ачаалах, дурсгалын замыг ачаалах \(i \bmod 32\), тэдгээрийг нэмнэ,
үр дүнг гаргадаг:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Үргэлтийн хэшүүд, хүлээн авах хэмжээ {#output-hashes-and-receipts}

Үндсэн эм RAM-LFE гүйцэтгэлийн хүлээн зөвшөөрөл нь түүхий эдийг гараагүй.
үр дүнгийн хэш:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Үүнд Torii RAM-LFE гүйцэтгэх түлхүүжилт, холбогдох мэдээлэл нь каноникийн
хөтөлбөрийн тодруулгын байт:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

Гаалийн сангийн гарын үсэг зурсан хэрэгцээ нь:

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

Үүнд `signed` хэлбэр:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

Хяналт шалгаруулалтад гарын үсэг `resolver_public_key` Энэ нь
хүлээн авах нь зөвхөн эдгээр тэгш байдлын бүхэнд:

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

Хэрэв дуудлага өгөх хүн `output_hex`, шалгагч мөн:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

Үүнд `proof` . . .
Хөрөгчийн гарын үсэг.
олон нийтийн өгөгдлийн схем хэш, шалгах түлхүүр хэш, илрүүлсэн олон нийтийг харуулах жишээ
баталгаажуулах хяналтын сангийн метабараа болон кодлогдсон хүлээн авах-хувь тээврийн хэшийг тохируулна.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

Иргэдийн төлөөлөгчдийн хүлээлттэй тохиолдол нь нэг элементийн дөрвөн багана юм. \(j\)
байт эзэмшдэг \(h_{8j}\ldots h_{8j+7}\) дараа нь 24 нурын байт:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Мэдээлэл баримтын зураг {#identifier-projection}

Мэдээлэл тодорхойлогчийн шийдэл нь ерөнхий түвшинг ашигладаггүй `opaque_hash` .
Хэрэглэгчдэд зориулсан үл ил тод дансны идентификатор. RAM-LFE хийнэ
тодорхойлогч тусгай доменүүдээр:

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

Хөдөлмөр `IdentifierResolutionReceipt` илүү өндөр түвшний ашиг ачааллыг тэмдэглэдэг:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

Бүртгэгдсэн тодруулгын хүлээн зөвшөөрөгдлийн:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` зөвхөн гарын үсэг эсвэл гэрчилгээг хүлээн зөвшөөрөх тохиолдолд
хүчинтэй, оргилсан RAM-LFE гүйцэтгэх ашиг ачаалл дурдсан хөтөлбөртэй нийцдэг
Улс төр, `uaid` болон `account_id` үүрэг гүйцэтгэгч.

## Хөдөлмөрийн урсгал {#execution-flow}

Үндэсний эм RAM-LFE гүйцэтгэх нь дараах хэлбэртэй:

1. Захиргааны удирдлага эсвэл оператор бүртгэл `RamLfeProgramPolicy`.
2. Хувь нь аливаа бодлогыг идэвхжүүлнэ.
3. Хэрэглэгч нь олон нийтийн бодлогын метабараа Torii.
4. Клиент шийдэлд яг нэг өгөгдлийн хэлбэрийг ирүүлнэ: энгийн текст
   `input_hex` эсвэл нууцалт BFV нэвтрүүлгийн хуудас.
5. Хөрөн хугацаа нууцлагдсан хөтөлбөрийг үнэлдэг бөгөөд буцааж өгдөг `output_hex`,
   `output_hash`, `opaque_hash`, `receipt_hash`, болон
   `RamLfeExecutionReceipt`.
6. Хэрэглэгч эсвэл хяналт шалгагч хүлээн авсан мэдээллийг хэвлэгдсэн бодлогын дагуу баталгаажуулдаг.
   эргүүлэн ирсэн `output_hex` хүлээн зөвшөөрөгдлийн хэшиг
   `output_hash`.
7. Үүнээс дээш түвшний сургалт, `ClaimIdentifier`, .
   түүхий эдийг бүрдүүлэхээс өөрөөр баталгаажуулсан хүлээн авлага.

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

## Мэдээллийн бодлого {#identifier-policies}

Мэдээлэл тодорхойлох бодлого нь RAM-LFE. Тэд бизнесийг нэмнэ.
нэр орон зай, хэвийнчлэлийн дүрэм нь ерөнхий хөтөлбөрийн бодлогын дээр:

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

Мэдээллийн давхар нь RAM-LFE хүлээн авах:

- `policy_id`
- нууцлуулсан функцын үр дүнд үүссэн ил тод тодорхойлогч
- тодорхойлолт `receipt_hash`
- Санхүүжилт UAID
- Каноникийн `account_id`
- ерөнхий эм RAM-LFE гүйцэтгэх ачаалал

Хэрэглэгчдэд чиглэсэн тасалбар шалгаруулалтын хувьд дансны нууц нэрсийг хувийн
нэр хүндрэл нь олон нийтийн нэр, утасны дугаар, цахим хаяг,
ижил төстэй үнэ цэнэ нь тодорхойлогчийн бодлого болон хүлээн авлагын дагуу урсгал хийх ёстой.

## Torii Замын хөдөлгөөн {#torii-routes}

Хэрэглээний чиглэлийн гэр бүл идэвхтэй бол, Torii нэвтрүүлэг RAM-LFE болон
тодорхойлогч туслах:

| Замын хөдөлгөөн | Зорилго |
| --- | --- |
| `GET /v1/ram-lfe/program-policies` | Ажилтай болон идэвхгүй жагсаалт RAM-LFE хөтөлбөрийн бодлого болон олон нийтийн хэрэгжилтийн метадэтгэл. |
| `POST /v1/ram-lfe/programs/{program_id}/execute` | Нэг хөтөлбөрийг гүйцэтгэх `input_hex` эсвэл `encrypted_input` болон өгөгдлийн хэшиг нэмж төрийн бус хүлээн авна. |
| `POST /v1/ram-lfe/receipts/verify` | A-г шалгах `RamLfeExecutionReceipt` нийтлэгдсэн бодлогын эсрэг харьцуулж, сонголттайгаар `output_hex` . `output_hash`. |
| `GET /v1/identifier-policies` | Тодруул хувилбарны тодорхойлогч бодлого, нормализацийн хэв маяг, шийдвэрлэх түлхүүр болон шифрлэгдсэн өгөгдлийн метабараа. |
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` | Хэрэглэгчийн татаж авах боломжтой хүлээн зөвшөөрөл гаргах `ClaimIdentifier`. |
| `POST /v1/identifiers/resolve` | Ажилтай шаардлагыг үүсгэж байгаа тохиолдолд байнгын бүртгэлд нэвтрүүлсэн хэвийн тодорхойлогчийн өгөгдөлг шийднэ. |
| `GET /v1/identifiers/receipts/{receipt_hash}` | Аудит болон дэмжлэг хэрэгслийн ханшингээр хүлээн зөвшөөрөгдлийн хэшээр хадгалан үлдсэн тодорхойлогч шаардлагыг хайх. |

Байнга зорилтын түймрийн `/openapi` эсвэл `/openapi.json` өмнө нь баримт бичиг
Энэ чиглэлийн эсрэг барилдаж байна.
сүлжээний хувилбар.

## Хөгжилтийн цаг {#node-runtime}

Torii Энэ нь үйл явцад байна RAM-LFE зардах цаг нь
`torii.ram_lfe.programs[*]`, нөөцтэй `program_id`. Бүтээгдэхүүний тухайн програм
зах зээлийн бодлогын үүрэг гүйцэтгэгчтэй нийцэж, зардах хугацааг хангах ёстой
Тэмцээний үнэлгээ хийх, баталгаажуулах шаардлагатай материал.
ижил зардах цаг; тэдгээр нь тусгай идентификатор-хольсон тогтоолжуулалтыг шаарддаггүй
гадаргуу.

Үндсэн хуулийн төсвийн бүртгэл нь өөрөө хангалтгүй.
мөн маршрутын гэр бүлийг илрүүлж,
хэрэгжүүлэхээр төлөвлөж буй хөтөлбөрүүд.

## Үйл ажиллагааны хяналтын шугам {#operational-guardrails}

- Аливаа бодлогыг идэвхгүй бүртгүүлж, олон нийтийн метадэтгэлийг шалгаж, дараа нь идэвхжүүлнэ.
- Хэтгэлэгчийн нууцыг хадгалах, шийдвэрлэгчээр гарын үсэг зурдаг түлхүүр BFV нууц
  Документ, бүртгэл, гүйлгээ, үйлчлүүлэгчдийн багцтай материал.
- Санхүүгийн бүртгэл, гүйлгээний метадэтгэрийн дотор түүхий эд тодруулдаггүй.
  үйл явдлууд, эсвэл дэлхийн улс орнуудын талбай.
- Цаашид томоохон даалгаврыг ирүүлэхийн өмнө үйлчлүүлэгчээс хүлээн авах баримтыг баталгаажуулах
  тухайн үед SDK баталгаажуулагчийг илрүүлнэ.
- Үргэлжсэн түлхүүгийн хугацаа үргэлжлэхгүй тохиолдолд дууссан цагийг ашиглах.
- Шинэ хөтөлбөр эсвэл тодорхойлогч бодлогыг бүртгүүлэх, үйлчлүүлэгчдийг шилжих,
  Шинэ түлхүүжилт орж ирэхэд хуучны бодлогыг идэвхжүүлэхгүй болгох.

## Үндсэн сэдэв {#related-topics}

- [Хувийн өгөгдлийн орон зайны төлбөр](/mn/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii Хөгжлийн чиглэл](/mn/reference/torii-endpoints.md#app-and-sora-route-families)
- [Аноним бүтээн байгуулалтууд](/mn/blockchain/anonymous-transactions.md)
