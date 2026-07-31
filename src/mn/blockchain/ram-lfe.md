---
translation_locale: mn
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE нь "Random-Access Machine Laconic Function Evaluation" гэсэн үг юм. Iroha -д энэ нь олон нийтийн бодлого зангилаа дээр байдаг, гэхдээ үнэлгээчийн логик, нууц эсвэл түүхий эд өгөгдлийг дэлхийн улс орнуудад бичихгүй байх ёстой хөтөлбөрүүдийн ерөнхий нууц функцын давхар юм. Энэ нь SORA Nexus тодруулгын урсгал, жишээлбэл хувийн утсаар эсвэл элс суудлын хайлтайгаар ашигладаг бөгөөд програм хангамжийн гүйцэтгэх туслах Torii гэж нэрлэгдэж болно, хэрэв түймрийн хувилбар нь аппликейшнээр чиглэсэн замыг боломжуулдаг бол.

Сүлжээ нь бодлогын үүрэг гүйцэтгэх болон хүлээн авах сануулгын баталгаажуулах метадэтгэлийг хадгалдаг. Худалдагч эсвэл Torii гүйлгээний цаг нь нууцлагдсан хөтөлбөрийг үнэлдэг, зөвхөн зөвшөөрөлтэй гаргалыг буцааж, үйлчлүүлэгчид, дэмжлэгийн хэрэгсэл, номын тоног төхөөрөмжүүдийн заавар бүртгүүлсэн бодлогын эсрэг шалгаж болно гэсэн батламжийг нэгтгэж байна.

## Тодруулбал {#naming}

Үүнд нэрлэх нь чухал юм.

|Урьдчилгаа|Энэ нь юу вэ?|
| --- | --- |
|`ram_lfe` |Гадаад нууцлагдсан функцын дүгнэлт: хөтөлбөрийн бодлого, үүрэг гүйцэтгэх хүлээн авах болон хүлээн авах баталгаажуулалтын хэлбэр. |
|`BFV` |Brakerski/Fan-Vercauteren хомоморфик шифрлэлтийн схема RAM-LFE шифрлэгдсэн өгөгдлийн хяналтын хэсгүүдээр ашиглагддаг. |
|`ram_fhe_profile` |BFV-д зориулсан програмчлагдсан цахилгаан үйлдвэрийн машины тодорхой метабараа. Энэ нь RAM-LFE-ийн хоёр дахь нэр биш юм. |

Мэдээллийн загварын хувьд `RamLfeProgramPolicy` болон `RamLfeExecutionReceipt` нь RAM-LFE хэлбэрүүд юм. BFV параметр, шифр бичгийн хавсралт, нууцлагдсан RAM-FHE хөтөлбөрийн хувилбар нь бодлогын хэрэглэгдэх шифрлэсэн гүйцэтгэх хяналтын хэсэгт хамаарна.

## Энэ нь юуг бичдэг вэ? {#what-it-records}

RAM-LFE хөтөлбөрийн бодлого нь дэлхийн хэмжээнд `program_id` бүртгэгдсэн бөгөөд энэ бодлого нь:

- тухайн хуулийг идэвхжүүлэх, идэвхгүй болгох, эсвэл өөрөөр хэлбэл өөрчлөн өөрчлөх боломжтой эзэмшигч дансыг
- үйлчлүүлэгчдэд зарласан хяналтын түвшин
- `signed` эсвэл `proof` гэсэн хүлээн зөвшөөрөл баталгаажуулах хэв маяг.
- нууцлагдсан хөтөлбөрийн метабараа болон үнэлгээний нууцыг хамгаалах үүрэг
- гарын үсэг зурсан түлхүүгийн шийдвэрлэлийн олон нийтийн цөм
- BFV параметр, `ram_fhe_profile` гэх мэт олон нийтийн шифрлэгдсэн өгөгдлийн метабараа сонгох
- `active` тамга нь бодлогын шинэ түлхүүжилтийг гаргах эсэхээ хянах

Хаалсан нууц, энгийн бичгийн тодруулгын үнэ цэнэ, нуугдсан хөтөлбөрийн биеийг дэлхийн байдалд хадгалахгүй. Клиентууд үүрэг даалгавар, ил тод хаш, хүлээн авах хаш, шифрлэлийн текст, хөтөлбөрийн харгалзлыг ил тод протоколын үнэ цэнэтэй гэж үзэх ёстой.

## Хөдөлмөрийн дэглэм {#backends}

Одоогийн RAM-LFE дэмжлэг нь гурван хяналт шалгуурч дээр төвлөрсөн байна:

|Хөдөлмөрийн сүүл нь|Хэрэглээ|
| --- | --- |
|`hkdf-sha3-512-prf-v1` |PRF үүрэг хариуцсан үнэлгээ. |
|`bfv-affine-sha3-256-v1` |BFV-ийн дэмжлэгтэй нууцлагдсан танихын үнэлгээ шифрлэсэн тодруулгын шугам дээр. |
|`bfv-programmed-sha3-256-v1` |BFV -ийн дэмжлэгтэй програмчлагдсан гүйцэтгэх шифрлэсэн регистрийн болон дурсгалын замаар. |

Identifier-ийн бодлогын хувьд BFV програмчлагдсан бэкэнд нь орчин үеийн чухал замаар байдаг. Энэ нь гарын үсэгт хэвийн өгөгдлийг орон нутгаар шифрлэх боломжийг олгодог, шийдвэрлэгч транзакцынд олон нийтийн идентификаторийг харахгүйгээр үнэлгээ хийх боломжтой гаргах хэшиг бүртгэлтэй хөтөлбөрийн бодлоготой холбодог хүлээн зөвшөөрөл буцааж өгдөг.

## Математик {#math}

Энэ хэсэг нь одоогийн RAM-LFE код ашиглаж буй хэрэгжилтийн түвшний алгебраг тодорхойлдог. Энэ нь аюулгүй байдлын баталгаа биш, энэ нь бодлого, хүлээн зөвшөөрөл болон үйлчлүүлэгчдийн тохиролцсон тодорхойлох шифрлэгдсэн үнэлгээний загвар юм.

### Үндсэн тэмдэглэл {#notation}

Хөгжүүл:

- \(H(m)\) бол Iroha `Hash::new(m)`: Blake2b-32 `m` дээр, эцсийн байтын хамгийн бага чухал хэсгийг `1`-д гаргана.
- \(N(x)\) нь `x`-ийн Norito санхүүгийн код байх.
- \(a \parallel b\) нь байт шугамтай холболт юм.
- \(\operatorname{le64}(i)\) нь тэмдэглэлгүй бүрэн тоогоор 8 байтын жижиг анд кодируулсан байх.
- \(s\) дэлхийн орнуудын орчинд хадгалагдаж буй нууцыг шийдвэрлэхээр байх.
- \(P\) нь төрийн бодлогын үзүүлэлт байх.
- \(A\) нь холбогдох мэдээллийг хүснэ.
- \(x\) нь Norito-ээр кодлогдсон шифрлэгдсэн өгөгдлийн хавсралт эсвэл хориотой байт байх болно, энэ нь бэкэндээс хамааран.

RAM-LFE нь доменийн хооронд хуваагдсан хашиг ашигладаг. Доменүүдийн нэрийг дараах формулаар зориулалтаараа нэрлэдэг; тэдгээрийн одоогийн байт жирүүд:

|Символ |Доменийн шугам |
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

### Улс төрийн үүрэг гүйцэтгэх {#policy-commitment}

Аливаа бодлогын үүрэг нь олон нийтийн параметр, нууц шийдвэрлэх тагнуулыг хязгаарладаг. Нэгдүгээрт, нууцыг тусдаа хийх:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Дараа нь бодлогын бүрэн шилжилтийг кодлуулж:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

нийтлэгдсэн бодлогын хэш нь:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

Захиргааны зах зээлийн `PolicyCommitment` нь

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

Хэтгэл нь гүйлгээний тайлангаас ижил үнэ цэнийг дахин тооцоодог. Хэрэв сэргээн сурвалжлагдсан хаш ялгаатай бол үнэлгээ нь үүрэг гүйцэтгэлийн зөрчлийн хүрээнд амжилтгүй болно.

### HKDF-SHA3-512 Хөдөлмөрийн эргэлт {#hkdf-sha3-512-backend}

`hkdf-sha3-512-prf-v1`ын хувьд үр дүн нь хэвийн оруулсан өгөгдлийн өөрөө байдаг боловч ил тод тодорхойлогч болон хүлээн авлагын хаш нь нууцтай холбогдсон PRF үр дүн юм.

Хэрэглэлийн шилжилтийн хувилбар:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

HKDF тус, хиймэл тохиолдолтой ач холбогдол нь:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

Өргөдлийн бус материал өргөжүүлэн хэшлэгдсэн:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

Өргөдлийн материалын дагуу нээлттэй тэмдэгт нь нэмэлтээр холбогдсон байна:

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

Хөдөлмөрийн хоолой нь:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV Тэмцэг {#bfv-primer}

BFV нь сүлжээн дээр суурилсан гомоморфик шифрлэлтийн схема юм. "Гомморфик" гэдэг нь програм нь шифрлэсэн үнэ цэнэүүдийг нэмж, олон дахин нэмэгдүүлж, уншилт хийсний дараа энгийн текстний үнэ цэнэүүдэд нэмэлт, олонлогыг хийж байсантай адил үр дүнг олж авах боломжтой гэсэн үг юм.

RAM-LFE ын хувьд BFV нь шифрлэгдсэн орж ирэх механизмын хэлбэрээр ашигладаг:

1. Мөнгөмбөг нь цахим хаяг, утасны дугаар гэх мэт хувийн үнэ цэнэтэй байдаг.
2. Мөнгөмбөг нь байтдыг жижиг бүрэн тооны шугамд өөрчлөх болно.
3. Бүх слот нь шийдвэрлэхчийн BFV олон нийтийн түлхүүрээр шифрлэгдсэн байдаг.
4. Хөдөлгөөрч нь нууцлагдсан хөтөлбөрийг эдгээр шифрлэгийн текст дээр үнэлдэг.
5. Хөгжлийн цаг нь зөвхөн нууцлагдсан хөтөлбөрийн гарааны нэгийг унтрааж, тэмдэглэж эсвэл хүлээн зөвшөөрөл баталгаажуулна.

BFV нь томоохон бүтэн тооны арифметик, ойролцооны арифметик биш юм. Тийм учраас энэ нь шилжин нүктейн загварын дүгнэлтээс илүү тодорхойлох байт болон жижиг модулийн тооцоололд тохиромжтой юм. Iroha-ийн өнөөгийн BFV хэрэглээний хувьд шифрлэгдсэн мөч бүр нэг скалар үнэ цэнэтэй модуль \(t\), ихэвчлэн байт эсвэл байт урттай талбайг тээдэг. Шифрлэлийн текст өөрөө илүү том бүрэн бүтэн тооны модуль \(q\) -д амьдарч байна. \(q\) болон \(t\) хоорондын дутагдал нь шифрлэлт, гомоморфик үйл ажиллагаанаас үүдэлтэй дуу чимээний нэвтрүүлэг үүсгэх боломжийг олгодог.

BFV шифрлэгийн текст нь хоёр полиномийн бүрэлдэхүүнтэй:

$$
c=(c_0,c_1)
$$

Үндсэн нууц товч нь \(s_k\) өөр олон талт юм.

$$
v = c_0 + c_1s_k
$$

Хэрэв шифр бичгийг зөв боловсруулж, дуу чимээ нь хангалттай бага байгаа бол \(v\) нь хэмжүүлсэн тайз бичигтэй ойролцоо байдаг. Хөгжилт нь тайз бичгийн коэффициент modulo \(t\) -ийг сэргээдэг:

|Жинхэнэ үйл ажиллагаа |Шифрлэгийн үйлдэл |
| --- | --- |
|\(m+n\) |Шифр бичгийн бүрэлдэхүүн хэсгийг нэмнэ. |
|\(m+\alpha\) |\(c_0\)-д хэмжээнд тодорхой бичгийн тогтмол нэмнэ. |
|\(\alpha m\) |Хоёр ч шифр бичгийн бүрэлдэхүүн хэсгийг \(\alpha\) хэмжнэ. |
|\(mn\) |Шифр бичгийн олон хэсгийг нэмэгдүүлж, дахин хэмжүүлээд, дараа нь эргүүлнэ. |

Хоёр бүрэлдэхүүнтэй шифрлэгийн хоёр бүтээгдэхүүний үр дүн нь \(1\), \(s_k\), \(s_k^2\) зэрэг хэлбэрээр шифрлэлийн гурван бүрэлдэхүүнд шифрлэгийг бий болгодог. Relinearization нь \(s_k^2\) терминийг хэвийн хоёр бүрэлдэхүүнтэй шифрлэгийн текст рүү буулгахад хэвлэгдсэн үнэлгээний түлхүүр ашигладаг. Энэ нь мөн адил шифрлэлийн текст хэлбэрийг ашиглан дараагийн нэмэлт, үр дүнг хадгалах болно.

BFV нь мөн "хүйцлэгддэг" байдаг: шифрлэсэн үйл ажиллагаа бүр зарим шуугины төсөв хэрэглэдэг. Энэ хэрэгжилт энэ төсвийн шинэчлэл хийхэд шифрлэлийн текстүүдийг эхлүүлэхгүй юм. Үүний оронд, RAM-LFE жижиг `ram_fhe_profile` хэвлүүлэн зөвхөн хязгаарлагдмал нуусан хөтөлбөрийн хэлбэрийг хүлээн зөвшөөрдөг. Энэ нь шалгаруулалтыг параметрын багтаамжийн дэмжсэн гүнзгийрлийн дотоод хэсэгт хадгалж байна. Одоогийн програмчлагдсан хувилбар нь тогтмол регистрийн тоо, тогтмол дурсгалын замын тоо, хамгийн ихдээ нэг шифр бичиг-шифр бичгийн үр дүнг програмчилсан алхамд тусгаж өгдөг.

Энэ RAM-LFE загварын хувьд BFV нь үйлчлүүлэгчдийн өгөгдлийг олон нийтийн томоохон бүртгэлийн мэдээллээс болон зөвхөн гүйлгээ эсвэл чиглэлийн ашигтай ачааллыг харах ажиглагчдаас нуудаг. Энэ нь зангирал өөрөө санамсарч шифрлэсэн хөтөлбөрүүдийг гүйцэтгэдэг гэсэн үг биш юм. Torii resolver runtime нь хэвээр BFV нууц материалыг эзэмшдэг, тохируулсан нууцлагдсан хөтөлбөрийг үнэлдэг, зөвшөөрөлтэй үр дүнг уншилдаг бөгөөд үр дүнд баталгаажуулдаг.

Идентификатор ашиглах тохиолдол нь зориулалтаар энгийн төлөөлөл сонгодог. Нормализацсан жиргийг:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Аливаа элементийг өөрийн гэсэн BFV скалар шифр бичгийн хэлбэрээр нууцалдаг. Энэ хэлбэр нь хэвийн болгох, хуудасны баталгаажуулалтыг тодорхой болгож, хөрөнгийг олон нийтийн параметрүүдээс нууцалт шаардлагыг бий болгодог бөгөөд шийдвэрлэгчэд тэнцүү нууцалсан өгөгдлийг тогтвортой хүлээн зөвшөөрөл тэмдэглэлт бүртгүүлэх боломжийг олгоно.

### BFV Гулгалтын загвар {#bfv-ring-model}

BFV дэргэд нь negacyclic polynomial ring ашигладаг:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

болон энгийн текст:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

хаана:

- \(n\) нь `polynomial_degree`, хоёр хүчтэй
- \(q\) бол `ciphertext_modulus`
- \(t\) бол `plaintext_modulus`
- \(q > t\) болон \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Бэлэн текст коэффициентийн вектордыг тус бүрийн коэффициент хэмжүүлснээр кодлуулж болно:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

Дэкрипцийн төв-лифтүүд нь:

$$
v = c_0 + c_1 s_k \in R_q
$$

дараа нь \(R_t\) гэж дахин эргүүлнэ:

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Энд \(s_k\) бол BFV нууц товчлол, гаднах RAM-LFE шийдвэрлэх нууц \(s\) биш.

### BFV Үндсэн үе {#bfv-key-generation}

Шифрлэгдсэн тодруулгын өгөгдлийн хувьд BFV товч материал нь шийдвэрлэхчийн нууц болон холбогдох мэдээллийн хувьд тодорхой:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG нь дараах байдлаар тариалагддаг:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

Үндсэн генераторын үлгэр жишээ:

- \(s_k \in \{-1,0,1\}^n\), төлөөлөгч модул \(q\)
- \(a \leftarrow R_q\) ижил төстэй
- \(e \in \{-1,0,1\}^n\)

Олон нийтийн гол нь:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Цаашид шугамжуулахын тулд \(s_k^2\) нь \(R_q\)-ийн өнгөний бүтээгдэхүүн байх ёстой. Нэг үндсэн-\(B\) цифр \(j\), жижиг хуваарилалтын үлгэрэл \(a_j\) болон \(e_j\) гэсэн үзлэг, дараа нь:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

Олон нийтийн BFV бодлогын метабараа нь \(((n,q,t,B)\), олон нийтийн ач холбогдол, болон `max_input_bytes` эзэмшдэг. BFV нууц ач холбогдол болон relinearization ач холбогдол нь шийдлийн ажиллагаанд үлдэнэ.

### BFV Шифрлэлт, үйл ажиллагаа {#bfv-encryption-and-operations}

Нүүр хуудас \(m\) -ийг шифрлахын тулд хэрэгжүүлэгч нь дараахь ChaCha20 RNG-ийн өөр үр тариалан ордог:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

Энэ нь \(u,e_1,e_2 \in \{-1,0,1\}^n\) үлгэрийг авч, тооцоолдог:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

Шифрлэгийн текст нь \(c=(c_0,c_1)\).

Хомоморфийн нэмэлт нь бүрдлийн хувьд:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

Зөвхөн \(c_0\) нөлөөгөөр өөрчлөлтийн коефициентид тайван бичгийн скалар \(\alpha\) нэмнэ:

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Нүүр хуудас \(\alpha\) хэмжээнд хоёр бүрэлдэхүүн хэсгийг давхарлах:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

Хоёр шифрлэгийн текст \(c=(c_0,c_1)\) болон \(d=_0,d_1)\), шифр бичгийн үржихүйн хамгийн түрүүнд гурван хэмжээний шифр бичгийг тооцож, аливаа коефициентийг эргэн нь \(t/q\):

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

Дээрх бүх бүтээгдэхүүн нь \(R_q\) дахь негацикликийн эргэлтийн бүтээгдэхүүнүүд юм. Дараа нь \(\tilde c_2\) нь үндсэн-\(B\) олон төрөлд хуваагдана:

$$
\tilde c_2 = \sum_j B^j u_j
$$

болон эргэн шуурхай:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

Үр дүн нь дахин BFV хоёр бүрэлдэхүүнтэй шифр бичлэг юм.

### Мэдээний шифр бичгийн хуудас {#identifier-ciphertext-envelope}

Мэдээллийн нэвтрүүлэгний байт шугам:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

scalar slots-д кодлогдсон:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

болон үлдсэн бүх мөрийтэй нь `max_input_bytes + 1` хүртэлх нөлөөтэй байдаг. scalar мөрийтэний нэг бүр мөрийтэл-нурын нягт бичгийн олон тооны \([m_i]\) гэж шифрлэгдсэн байна.

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

Шифрлэгдсэн тодруулгын хуудас:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

\(M=\mathrm{max\_input\_bytes}\)

### BFV Өргөдлийн дэглэм {#bfv-affine-backend}

`bfv-affine-sha3-256-v1`-ийн хувьд гүйцэтгэх хугацаа нь эхлээд BFV үндсэн материалыг \(s\) болон \(A\)-ээс олох ёстой.

Афины дугуйны үр тариа нь:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

Энэ үржмэлээс гүйцэтгэх хугацааны шинжилгээ, modulo \(t\), 32 шугамтай хамааралтай замаар:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

\(m_i\) нь шифрлэгдсэн тодруулгын хуудас юм. Гомоморфын хувьд шифрлэлийн текст дээр ижил үнэ цэнэ тооцоо:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

Тус шийдэл нь \(C_j\) аль алиныг уншилдаг, бүх дараах тайван бичгийн коэффициентийг нөлөөгөөр хангах шаардлагыг тавьдаг, коэффициент-нурын үнэ цэнийг байт руу өөрчлөх ба хэлбэр:

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

### BFV Програмчлагдсан хяналтын хэсэг {#bfv-programmed-backend}

`bfv-programmed-sha3-256-v1`ын хувьд олон нийтийн параметр нь BFV тодруулгын шифрлэлийн параметри болон нууцлагдсан хөтөлбөрийн дигестийг багтаасан:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

Одоогийн RAM-FHE хувилбар нь:

|Газар |Үр дүн |
| --- | --- |
|`profile_version` | `1` |
|`register_count` | `4` |
|`memory_lane_count` | `32` |
|`ciphertext_mul_per_step` | `1` |
|`encrypted_input_mode` |`resolver_canonicalized_envelope_v1` |
|`min_ciphertext_modulus` | \(2^{52}\) |

Torii -д ирүүлсэн энгийн бичгийн өгөгдлийг гүйцэтгэхээс өмнө ижил BFV хавсралтад шифрлэдэг. Энэ сервер талын шифрлэлийн тодорхойлолт нь:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Гадаад руу нэвтрүүлсэн шифрлэгдсэн өгөгдлийн хувьд, шийдвэрлэгч идентификаторны хувцасыг уншиулж, гүйцэтгэхээс өмнө энэ тодорхойлолттай хувцас дээр дахин шифрлэдэг. Энэ каноникал нь хүлээн авах хэшүүдийг BFV шифрийн текстээр тогтвортой байлгана.

Эхний шифрлэгдсэн дурсгалын шугам нь:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

32 замын бүрт \(r_j \in [0,t)\) нэвтрүүлж, BFV шифрчилсэн текст \(r_j\) хадгалдаг. нууцлагдсан хөтөлбөр нь дараа нь шифрлэгдсэн регистрийн болон шифрлэсэн дурсгалын дээр гүйцэтгэдэг:

|Сургалтын |Алгебра |
| --- | --- |
|`LoadInput(dst, i)` |\(R_{\mathrm{dst}} \leftarrow C_i\) |
|`LoadState(dst, j)` |\(R_{\mathrm{dst}} \leftarrow S_j\) |
|`StoreState(j, src)` |\(S_j \leftarrow R_{\mathrm{src}}\) |
|`LoadConst(dst, a)` |\(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a) \) |
|`Add(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
|`AddPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
|`SubPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
|`MulPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
|`Mul(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_aR_b\), дараа нь дахин шугамжлах |
|`SelectEqZero(dst, cond, z, nz)` |\(R_{\mathrm{cond}}\) шифрлэх; нуруу бол \(R_z\) сонгох, өөрөөр хэлбэл \(R_{nz}\). |
|`Output(src)` |\(R_{\mathrm{src}}\) нь гарааны бүртгэлийн жагсаалтад нэмнэ. |

Сургалтын тас дууссан дараа шийдэгч нь гарааны бүртгэлийг унтраач, нөлөөний коефициентийг байт болгож, эдгээр байтыг холбодог:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

Үндсэн хэшүүд нь:

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

Урьдчилсан програмчлагдсан тодорхойлогчийн тас нь 64 нэвтрүүлгийн шугамтай байдаг. \(i\) хоолонд бүртгүүлэх шугам, \(i \bmod 32\) дурсгалын замыг борлуулах, тэдгээрийг нэмж, үр дүнг гаргах:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Үргэлтийн хэшүүд, хүлээн авах {#output-hashes-and-receipts}

RAM-LFE гүйцэтгэлийн нийтлэг хүлээн зөвшөөрөл нь түүхий эдийг гараагүй, гарааны хэшиг гараагүй:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Torii RAM-LFE гүйцэтгэх түлхүүгийн хувьд холбогдох өгөгдэл нь програм хангамжийн тодорхойлогч байт юм:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

Гаалийн бичгийн гарын үсэг зурсан хэрэглээний ачаалал:

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

`signed` хэлбэрээр:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

Хяналт шалгалт `resolver_public_key`ээр гарын үсэг хяналтыг шалгаж, эдгээр тэнцвэрлэлийн бүгд:

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

Хэрэв дуудлага өгөх хүн `output_hex` нийлүүлж байгаа бол шалгагч мөн:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

`proof` хэлбэрээр баталгаажуулалт нь гарын үсэг бус баталгаажуулалтын хуудастай байдаг. Үнэнчлэл нь баталгаажуулах хяналт, тойргийн идентификатор, олон нийтийн түлшний схэмийн хаш, баталгаажуулж байгаа ач холбогдолны хаш болон ил тод олон нийтийг хашлах тохиолдлууд нь батламжийн баталгаажуулсан метабараа болон кодлогдсон хүлээн зөвшөөрөл-хувьцааны хаштай нийцдэг эсэхийг шалгаж байна.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

Ирэх төлөвтэй олон нийтийн тохиолдол нь нэг элементийн дөрвөн багана юм. \(j\) багана нь \(h_{8j}\ldots h_{8j+7}\) байттай, дараа нь 24 нөлөөний байттой:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Мэдээлэл баримтын төслийн зураг {#identifier-projection}

Идентификатор тогтоол нь `opaque_hash` генирийн хяналтын хэсгийг хэрэглэгчэд зориулсан үл ил тод дансны идентификатоор ашигладаггүй. Энэ нь RAM-LFE гажуулалтын хэшийг идентификаторийн онцгой доменүүдээр дэлгэж өгдөг:

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

`IdentifierResolutionReceipt` нь өндөр түвшний хэрэглээний ачаалалтай:

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

`ClaimIdentifier` хүлээн зөвшөөрөгдөх нь зөвхөн гарын үсэг эсвэл баталгаа хүчин төгөлдөр байх үед, нэгдсэн RAM-LFE гүйцэтгэх ачаалал нэвтрүүлсэн хөтөлбөрийн бодлоготой нийцсэн тохиолдолд, `uaid` болон `account_id` нь шаардлагыг хангасан хамааралтай зүйл юм.

## Хөдөлмөрийн урсгал {#execution-flow}

RAM-LFE нь дараах хэлбэрээр гүйцэтгэнэ:

1. Захиргааны байгууллага, үйл ажиллагаа эрхлэгч `RamLfeProgramPolicy`.
2. Хувь нь бодлогыг идэвхжүүлнэ.
3. Хэрэглэгч Torii нь төрийн бодлогын метабараа уншдаг.
4. Хэрэглэгч шийдэлд яг нэг өгөгдлийн хэлбэрийг өргөн мэдүүлнэ: энгийн текст `input_hex` эсвэл BFV шифрлэгдсэн өгөгдлийг хувилбарлах.
5. Хөдөлмөрийн цаг нь нууцлагдсан хөтөлбөрийг үнэлдэг бөгөөд `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash` болон `RamLfeExecutionReceipt` -ийг буцааж өгдөг.
6. Хэрэглэгч эсвэл хяналтын төгсгөл нь хүлээн зөвшөөрлийг хэвлэгдсэн бодлогын дагуу баталгаажуулж, эргүүлэн ирсэн `output_hex` нь хүлээн зөвшөөрлийн `output_hash` хэшигтэй холбоотой эсэхийг шалгаж байна.
7. `ClaimIdentifier` гэх мэт өндөр түвшний заавар нь түүхий эдийг шилжүүлэхийн оронд баталгаажуулсан хүлээн зөвшөөрөгдлийг багтааж болно.

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

## Хууль зүйн тодорхойлогч {#identifier-policies}

RAM-LFE нь тодорхойлох бодлого юм. Тэд нэгдсэн хөтөлбөрийн бодлогын дээр бизнесийн нэр орон зай, нормализацийн дүрмийг нэмдэг:

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

Энэ нь RAM-LFE хүлээн зөвшөөрлийг ашиглан:

- `policy_id`
- нууцлуулсан функцын үр дүнд үүссэн ил тод тодорхойлогч
- тодорхойлолт `receipt_hash`
- Санхүүжилтийн UAID
- Каноникийн `account_id`
- нийтлэг RAM-LFE гүйцэтгэх хэрэглээний ачаа

Хэрэглэгчийн чиглэлээр татаж авахын тулд дансны нууц нэрсийг хувийн тодруулгуудаас тусгаарлан хадгалах хэрэгтэй.

## Torii Замын зам {#torii-routes}

Хэрэглээний чиглэлийн гэр бүл идэвхтэй байх үед Torii нь RAM-LFE болон тодорхойлогчийн туслах хэсгийг илрүүлнэ:

|Замын |Зорилго|
| --- | --- |
|`GET /v1/ram-lfe/program-policies` |RAM-LFE хөтөлбөрийн бодлого болон олон нийтийн хэрэгжилтийн метадэтгүүдийн идэвхтэй, идэвхгүй жагсаалт. |
|`POST /v1/ram-lfe/programs/{program_id}/execute` |`input_hex` эсвэл `encrypted_input`-ээс нэг хөтөлбөрийг гүйцэтгэж, гашийг нэмж иргэний төлбөргүй хүлээн авна. |
|`POST /v1/ram-lfe/receipts/verify` |`RamLfeExecutionReceipt` нь хэвлэгдсэн бодлогын дагуу шалгаж, `output_hex`-ийг `output_hash`-д харьцуулаарай. |
|`GET /v1/identifier-policies` |Тодруул хувилбар тогтолцоо, нормализацийн хэв маяг, шийдвэрлэх түлхүүр болон шифрлэгдсэн өгөгдлийн метабараа. |
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt` |Хэрэглэгч `ClaimIdentifier` -д шилжүүлэхийн тулд хүлээн зөвшөөрөл гаргах. |
|`POST /v1/identifiers/resolve` |Ажилтай шаардлагыг хангасан тохиолдолд хамааралтай бүртгэлд шилжүүлсэн тодорхойлолтын нэвтрүүлгийг шийдвэрлэх. |
|`GET /v1/identifiers/receipts/{receipt_hash}` |Аудитын болон дэмжлэгийн хэрэгслийн хувьд хүлээн зөвшөөрөгдлийн хэшээр хадгалан үлдсэн тодорхойлогчийн шаардлагыг хайх. |

Энэ чиглэлийн эсрэг бүтээн байгуулалт хийхээс өмнө үргэлж зорилтот түйүлгийн `/openapi` эсвэл `/openapi.json` баримтыг шалгаж үзээрэй.

## Хөгжилтийн цаг {#node-runtime}

Torii Энэ нь үйл ажиллагааны үеэр RAM-LFE цахилгаан хэрэгслийн цаг хугацаа нь `torii.ram_lfe.programs[*]`, түлхүүрээр `program_id`. Нөхөнтөгдсөн хөтөлбөр бүр зангилааны бодлогын үүрэг гүйцэтгэгчдэд нийцэж, үнэлгээ хийхэд шаардлагатай ажил хугацааны материалыг хангах ёстой. Идентификатор замаар энэ ижил гүйлгээний хугацааг дахин ашигладаг; тэдэнд тусгай identifikator-resolver-ийн конфигурацийн давхаргын шаардлагагүй байдаг.

Аливаа бодлогын зах зээлийн бүртгэл нь өөрөө хангалтгүй. Зорилгоны түймэг нь чиглэлийн гэр бүлийг илрүүлэн, хэрэгжүүлэхээр төлөвлөж буй хөтөлбөрүүдийн үйл ажиллагааны цаг хугацаатай холбоотой материалтай байх ёстой.

## Үйл ажиллагааны хамгаалалтын рельс {#operational-guardrails}

- Аливаа бодлогыг идэвхгүй бүртгүүлж, олон нийтийн метабараа баталгаажуулж, дараа нь идэвхжүүлээрэй.
- Хэтгэлэгчийн нууц, шийдвэрлэгчний гарын үсэг зурах түлхүүр болон BFV нууц материалыг баримт бичиг, тэмдэглэл, гүйлгээ, үйлчлүүлэгчдийн багцын дотор хадгалах.
- Хяналт тавих бүртгэл, гүйлгээний метадэтгэг, үйл явц эсвэл дэлхийн улс орнуудын талбайд түүхий эд тодруулбаарай.
- SDK нь баталгаажуулагчаа илрүүлэхэд илүү өндөр түвшний заавар өгөхөөс өмнө үйлчлүүлэгч тал дээр хүлээн зөвшөөрөгдлийг шалгаарай.
- Үргэлжсэн түлхүүгийн үнэмлэх мөнхийн хэвээр үлдэхгүй байх хугацааны хугацаа дууссан талбайг ашиглах.
- Шинэ хөтөлбөр эсвэл тодруулгын бодлогыг бүртгүүлэх, үйлчлүүлэгчдийг шилжих, шинэ түлхүүжилт орж ирэхэд хуучны бодлогыг идэвхжүүлэхгүй болгох замаар эргэлтийг хийх.

## Үүнтэй холбоотой сэдэв {#related-topics}

- [Хувийн өгөгдлийн орон тооны тэтгэврийн төлбөр](/mn/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii Хөгжилтийн цэгүүд](/mn/reference/torii-endpoints.md#app-and-sora-route-families)
- [Аноним транзакцын](/mn/blockchain/anonymous-transactions.md)
