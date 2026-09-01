---
translation_locale: ur
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 66436bfdcdfea9bcd52834436dc8b6abe9812549583e6bfca06cbe73d5f75d35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE Random-Access Machine Laconic Function Evaluation کے لئے کھڑا ہے۔ Iroha میں ، یہ ایسے پروگراموں کے لئے عام پوشیدہ فنکشن پرت ہے جن کی عوامی پالیسی سلسلہ پر ہے لیکن جن کا جائزہ لینے والا منطق ، خفیہ یا خام ان پٹ عالمی حالت کو نہیں لکھا جانا چاہئے۔ یہ SORA Nexus شناختی بہاؤ کے ذریعہ استعمال کیا جاتا ہے ، جیسے نجی فون یا ای میل کی تلاش ، اور جب ایک نوڈ پروفائل ایپ کا سامنا کرنے والے راستوں کو قابل بناتا ہے تو اسے عام Torii پروگرام عملدرآمد میں مددگار کے طور پر بھی بے نقاب کیا جاسکتا ہے۔

سلسلہ پالیسی کی وابستگی اور رسید کی تصدیق کے میٹا ڈیٹا کو اسٹور کرتا ہے۔ ایک ریزولر یا Torii رن ٹائم پوشیدہ پروگرام کا جائزہ لیتا ہے ، صرف اجازت دی جانے والی آؤٹ پٹ واپس کرتا ہے ، اور ایک رسید منسلک کرتا ہے جسے کلائنٹ ، سپورٹ ٹولنگ ، یا لیجر ہدایات رجسٹرڈ پالیسی کے خلاف تصدیق کرسکتی ہیں.

## نام لگانا {#naming}

ناموں کو تقسیم کرنا اہم ہے:

|اصطلاح |معنی |
| --- | --- |
|`ram_lfe` |بیرونی پوشیدہ فنکشن کا خلاصہ: پروگرام کی پالیسیاں، وعدے، عملدرآمد رسیدیں، اور رسید کی تصدیق کے موڈ۔ |
|`BFV` |Brakerski / Fan-Vercauteren homomorphic خفیہ کاری کے نظام کو encrypted ان پٹ RAM-LFE پس منظر کی طرف سے استعمال کیا جاتا ہے. |
|`ram_fhe_profile` |پروگرام شدہ خفیہ کاری کی مشین کے لیے BFV مخصوص میٹا ڈیٹا۔ یہ RAM-LFE کا دوسرا نام نہیں ہے۔ |

اعداد و شمار کے ماڈل میں، `RamLfeProgramPolicy` اور `RamLfeExecutionReceipt` RAM-LFE کی اقسام ہیں. BFV پیرامیٹرز، خفیہ متن لفافے، اور پوشیدہ RAM-FHE پروگرام پروفائل ایک پالیسی کے ذریعہ استعمال کردہ خفیہ کاری کے بیک اینڈ سے تعلق رکھتے ہیں.

## یہ کیا ریکارڈ کرتا ہے {#what-it-records}

ایک RAM-LFE پروگرام کی پالیسی کو عالمی سطح پر `program_id` کے ذریعہ رجسٹرڈ کیا گیا ہے۔ اس پالیسی میں شامل ہیں:

- مالک اکاؤنٹ جو پالیسی کو چالو، غیر فعال یا دوسری صورت میں تبدیل کرسکتا ہے
- کلائنٹ کو اشتہار دیا گیا بیک اینڈ
- رسید کی تصدیق کا طریقہ، `signed` یا `proof`
- چھپے ہوئے پروگرام کے میٹا ڈیٹا اور جائزہ لینے والے خفیہ کے لئے ایک عزم
- دستخط شدہ رسیدوں کے لئے پبلک کلید ریزولر
- اختیاری عوامی خفیہ شدہ ان پٹ میٹا ڈیٹا، جیسے BFV پیرامیٹرز اور `ram_fhe_profile`
- ایک `active` پرچم جو کنٹرول کرتا ہے کہ آیا پالیسی نئی رسیدیں جاری کرسکتی ہے یا نہیں۔

چھپی ہوئی خفیہ ، صاف متن کی شناخت کنندہ قدر اور پوشیدہ پروگرام جسم کو عالمی حالت میں ذخیرہ نہیں کیا جاتا ہے۔ مؤکلوں کو پابندیاں ، غیر شفاف ہیش ، رسید ہیش ، شفر ٹیکسٹ ، اور پروگرام ڈائجسٹ کو غیر شفاف پروٹوکول اقدار کے طور پر علاج کرنا چاہئے۔

## پس منظر {#backends}

موجودہ RAM-LFE کی حمایت تین بیک اینڈ شناخت کنندگان پر مرکوز ہے:

|پس منظر |استعمال کریں|
| --- | --- |
|`hkdf-sha3-512-prf-v1` |مصروفیت پر پابند PRF تشخیص۔ |
|`bfv-affine-sha3-256-v1` |BFV کی طرف سے حمایت کر رہے ہیں خفیہ متعلقہ تشخیص کو encrypted شناختی سلاٹس پر. |
|`bfv-programmed-sha3-256-v1` |BFV کی حمایت کر رہے ہیں خفیہ شدہ رجسٹرز اور میموری لینز پر پروگرامنگ عملدرآمد. |

شناخت کنندہ پالیسیوں کے لئے ، پروگرام شدہ BFV بیک اینڈ اہم جدید راستہ ہے۔ اس سے بٹوے کو مقامی طور پر معیاری ان پٹ کو خفیہ کرنے کی اجازت ملتی ہے ، حل کرنے والے کو ٹرانزیکشن میں عوامی شناخت کنندہ دیکھے بغیر جائزہ لینے کی اجازت دیتا ہے۔ اور ایک رسید واپس کرتا ہے جو آؤٹ پٹ ہیش کو رجسٹرڈ پروگرام کی پالیسی سے منسلک کرتا ہے۔

## ریاضی {#math}

اس حصے میں موجودہ RAM-LFE کوڈ کے ذریعہ استعمال ہونے والے عملدرآمد کی سطح کا الجبرا بیان کیا گیا ہے۔ یہ سیکیورٹی ثبوت نہیں ہے؛ یہ تعیناتی ٹرانسکرپٹ اور خفیہ کردہ تشخیص ماڈل ہے جس پر پالیسیاں ، رسیدیں اور مؤکلوں کو اتفاق کرنا چاہئے۔

### نوٹیشن {#notation}

چھوڑ دو:

- \(H(m)\) Iroha `Hash::new(m)`: Blake2b-32 پر `m`، حتمی بائٹ کا سب سے کم اہم بٹ کے ساتھ مجبور کیا جاتا ہے `1`.
- \(N(x)\) `x` کی کینونیکل Norito کوڈنگ ہو.
- \(a \parallel b\) بائٹ سٹرنگ کنکٹیشن کا مطلب۔
- \(\operatorname{le64}(i)\) ایک غیر دستخط شدہ انٹیجر کی 8 بائٹ چھوٹی اینڈین کوڈنگ ہو.
- \(s\) باہر دنیا کی حالت میں رکھا خفیہ حل کرنے والا ہو.
- \(P\) عوامی پالیسی کے پیرامیٹرز ہیں.
- \(A\) متعلقہ اعداد و شمار کی درخواست کریں۔
- \(x\) معیاری ان پٹ بائٹس یا ایک Norito کوڈ شدہ خفیہ کردہ ان پٹ لفافہ، بیک اینڈ پر منحصر ہے ۔

RAM-LFE ڈومین علیحدہ ہیشز کا استعمال کرتا ہے۔ ذیل میں دیئے گئے فارمولے مقصد کے مطابق ڈومینز کا نام دیتے ہیں۔ ان کی موجودہ بائٹ سٹرنگیں ہیں:

|علامت |ڈومین سٹرنگ|
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

### پالیسی کا عزم {#policy-commitment}

ایک پالیسی کا عزم عوامی پیرامیٹرز اور خفیہ حل کرنے والے راز کو بیک اینڈ سے منسلک کرتا ہے۔ سب سے پہلے، راز علیحدہ طور پر انجام دیا جاتا ہے:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

پھر پالیسی کی مکمل نقل کوڈ کیا جاتا ہے:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

اور شائع کردہ پالیسی ہیش یہ ہے:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

سلسلہ بندی پر `PolicyCommitment` ہے:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

تشخیص رن ٹائم راز سے ایک ہی قدر کا دوبارہ حساب لگاتا ہے۔ اگر دوبارہ شمار شدہ ہاش مختلف ہوتا ہے تو ، تشخیص مصروفیت کی عدم مطابقت کے ساتھ ناکام ہوجاتی ہے۔

### HKDF-SHA3-512 پسدید {#hkdf-sha3-512-backend}

`hkdf-sha3-512-prf-v1` کے لئے، آؤٹ پٹ خود معیاری ان پٹ ہے، لیکن غیر شفاف شناختی اور رسید ہیش خفیہ پابند PRF آؤٹ پٹس ہیں.

درخواست کی نقل یہ ہے:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

HKDF نمک اور پیسوڈورینڈم کلید یہ ہیں:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

غیر شفاف مواد کو توسیع اور ہیش کیا جاتا ہے:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

رسید کا مواد اضافی طور پر غیر شفاف شناخت کو پابند کرتا ہے:

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

بیک اینڈ لوٹتا ہے:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV پرائمر {#bfv-primer}

BFV ایک ریٹکس پر مبنی ہم شکل خفیہ کاری اسکیم ہے۔ "ہم شکل" کا مطلب ہے کہ ایک پروگرام خفیہ کردہ اقدار کو شامل اور ضرب کرسکتا ہے اور ، خفیہ کرنے کے بعد ، وہی نتیجہ حاصل کرسکتا ہے جیسے اگر اس نے سادہ متن کی اقدار پر اضافے اور ضرب انجام دی ہوتی۔

RAM-LFE کے لئے، BFV کو خفیہ کردہ ان پٹ میکانزم کے طور پر استعمال کیا جاتا ہے:

1. ایک بٹوے میں ذاتی قدر کو معمول بناتا ہے، جیسے فون نمبر یا ای میل ایڈریس۔
2. بٹوے بائٹس کو چھوٹے انٹیجر سلاٹ میں بدل دیتا ہے.
3. ہر سلاٹ کو ریزولور کی BFV عوامی کلید کے ساتھ خفیہ کیا جاتا ہے۔
4. ریزولور رن ٹائم ان ciphertexts پر پوشیدہ پروگرام کا جائزہ لیتا ہے.
5. رن ٹائم صرف پوشیدہ پروگرام آؤٹ پٹ کو ڈسکرپٹ کرتا ہے اور سائن یا رسید کی تصدیق کرتا ہے۔

BFV یہ صحیح عددی حساب ہے، قریبی حساب نہیں. یہی وجہ ہے کہ یہ شناخت بائٹس اور چھوٹے ماڈیولر کے لئے بہتر موزوں ہے۔ فلوٹنگ پوائنٹ ماڈل inference کے مقابلے میں حساب کتاب. Iroha موجودہ ہے BFV استعمال، ہر خفیہ سلاٹ ایک پیمانے کی قدر ماڈیول ہے \(t\), عام طور پر ایک بائٹ یا بائٹ لمبائی کے میدان. \(q\). اس کے درمیان فرق \(q\) اور \(t\) خفیہ کاری اور ہومورف کارروائیوں کی وجہ سے پیدا ہونے والے شور کے لئے خفیہ سازی کی گنجائش فراہم کرتا ہے۔

BFV ciphertext میں دو polynomial اجزاء ہیں:

$$
c=(c_0,c_1)
$$

خفیہ کلید ایک اور کثیرالاضلاع \(s_k\) ہے۔ ڈیکرپشن میں مندرجہ ذیل اجزاء شامل ہیں:

$$
v = c_0 + c_1s_k
$$

اگر خفیہ متن کو صحیح طریقے سے تشکیل دیا گیا تھا اور شور ابھی بھی کافی چھوٹا ہے تو ، \(v\) پیمانے پر سادہ متن کے قریب ہے۔ راؤنڈنگ سادہ متن کا تناسب موڈولو \(t\) بازیافت کرتی ہے۔ مفید خصوصیت یہ ہے کہ خفیہ عبارت کی کارروائیوں نے اس ڈھانچے کو برقرار رکھا ہے:

|سادہ آپریشن |خفیہ متن آپریشن |
| --- | --- |
|\(m+n\) |ciphertext اجزاء شامل کریں. |
|\(m+\alpha\) |\(c_0\) میں ایک پیمانے پر سادہ متن مستقل شامل کریں. |
|\(\alpha m\) |دونوں ciphertext اجزاء کو \(\alpha\) سے پیمانہ کریں. |
|\(mn\) |ciphertext polynomials کو ضرب کریں، rescale، پھر relinearize. |

ضرب مہنگا آپریشن ہے۔ دو دو اجزاء والے خفیہ متن کی پیداوار قدرتی طور پر ایک تین اجزاء والا خفیہ تحریر پیدا کرتی ہے جو \(1\) ، \(s_k\) ، اور \(s_k^2\) کے ساتھ خفیہ ہوتی ہے. Relinearization \(s_k^2\) اصطلاح کو ایک عام دو جزو شفر متن میں واپس فولڈ کرنے کے لئے ایک شائع شدہ تشخیص کلید کا استعمال کرتا ہے۔ یہ وہی شفر متن کی شکل کا استعمال کرتے ہوئے بعد میں اضافے اور ضربات کو برقرار رکھتا ہے۔

BFV بھی "leveled" ہے: ہر خفیہ کردہ آپریشن میں کچھ شور بجٹ استعمال ہوتا ہے۔ یہ عمل درآمد اس بجٹ کو تازہ کرنے کے لئے ciphertexts کو بوٹسٹریپ نہیں کرتا ہے۔ اس کی بجائے ، RAM-LFE ایک چھوٹا سا `ram_fhe_profile` شائع کرتا ہے اور صرف ایک محدود پوشیدہ پروگرام شکل کو قبول کرتا ہے۔ جو پیرامیٹر سیٹ کی حمایت کی گہرائی کے اندر تشخیص کو برقرار رکھتا ہے۔ موجودہ پروگرام شدہ پروفائل ایک مقررہ رجسٹر گنتی ، مقررہ میموری لین گنتی ، اور زیادہ سے زیادہ ایک ciphertext-ciphertext ضرب ہر پروگرام کردہ مرحلے کی اجازت دیتا ہے۔

اس RAM-LFE ڈیزائن میں ، BFV کلائنٹ کی ان پٹ کو عوامی لیجر کے اعداد و شمار سے اور مبصرین سے چھپاتا ہے جو صرف لین دین یا روٹ کا استعمال کرتے ہوئے بوجھ دیکھتے ہیں۔ اس کا مطلب یہ نہیں ہے کہ سلسلہ خود ہی تعمیری خفیہ کردہ پروگراموں کو انجام دیتا ہے۔ Torii ریزولر رن ٹائم اب بھی BFV خفیہ مواد کا مالک ہے ، ترتیب شدہ پوشیدہ پروگرام کا جائزہ لیتا ہے ، اجازت دی گئی آؤٹ پٹ کو ڈیکرپٹ کرتا ہے ، اور نتیجہ کی تصدیق کرتا ہے۔ پھر لیجر آن لائن پالیسی کے عزم کے خلاف تصدیق کرتا ہے اور عوامی کلید یا ثبوت میٹا ڈیٹا کو حل کرتا ہے.

شناخت کنندہ استعمال کے معاملے میں مقصد کے لئے ایک سادہ نمائندگی کا انتخاب کیا جاتا ہے۔ ایک معیاری سٹرنگ کو کوڈ کیا جاتا ہے:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

ہر عنصر کو اس کے اپنے BFV سکالر شفر ٹیکسٹ کے طور پر خفیہ کیا جاتا ہے۔ یہ شکل معمول سازی اور لفافے کی توثیق کو واضح بناتی ہے ، بٹوے کو عوامی پیرامیٹرز سے خفیہ کردہ درخواستیں بنانے دیتی ہے ، اور حل کرنے والے کو مستحکم رسید ٹرانسکرپٹ میں مساوی خفیہ شدہ ان پٹس کو کینیکلائزیشن کرنے دیتی ہے۔

### BFV انگوٹی ماڈل {#bfv-ring-model}

BFV بیک اینڈس نے نیگاسیکلک کثیرالاضلاع کی انگوٹی کا استعمال کیا ہے:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

اور سادہ متن انگوٹی:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

جہاں:

- \(n\) ہے `polynomial_degree`، ایک طاقت دو
- \(q\) ہے `ciphertext_modulus`
- \(t\) ہے `plaintext_modulus`
- \(q > t\) اور \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

کلین ٹیکسٹ کوفیکٹر ویکٹرز کو ہر ایک کوفیکچر کی پیمائش کے ذریعے کوڈ کیا جاتا ہے:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

ڈیکوپشن سینٹر لفٹ ہر ایک کا تعین کرتا ہے:

$$
v = c_0 + c_1 s_k \in R_q
$$

اس کے بعد اسے \(R_t\) میں دوبارہ راؤنڈ کرتا ہے:

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

یہاں \(s_k\) BFV خفیہ کلید کثیرالاضلاع ہے، نہ کہ بیرونی RAM-LFE ریزولور خفیہ \(s\).

### BFV کلیدی نسل {#bfv-key-generation}

خفیہ شناخت کنندہ ان پٹ کے لئے، BFV کلیدی مواد حل کرنے والے راز اور متعلقہ اعداد و شمار کے مطابق تعیناتی ہے:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG کو مندرجہ ذیل کے طور پر بیج کیا جاتا ہے:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

کلیدی جنریٹر نمونے:

- \(s_k \in \{-1,0,1\}^n\) ، modulo \(q\) کی نمائندگی کرتا ہے
- \(a \leftarrow R_q\) یکساں
- \(e \in \{-1,0,1\}^n\)

عوامی کلید یہ ہے:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

relinearization کے لئے، \(s_k^2\) \(R_q\) میں انگوٹی کی مصنوعات ہونے دو. ہر بیس-\(B\) ہندسہ \(j\) کے لئے، نمونے \(a_j\) یکساں طور پر اور چھوٹے تقسیم سے \(e_j\)، پھر شائع کریں:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

عوام BFV پالیسی میٹا ڈیٹا میں \((n,q,t,B)\) ، عوامی کلید، اور `max_input_bytes`. انگریزی میں BFV خفیہ کلید اور relinearization کلید ریزولر رن ٹائم میں رہیں.

### BFV خفیہ کاری اور آپریشن {#bfv-encryption-and-operations}

ایک سادہ متن کثیرالاضلاع \(m\) کو خفیہ کرنے کے لئے، عملدرآمد کا بیج ایک اور ChaCha20 RNG سے ہے:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

یہ \(u,e_1,e_2 \in \{-1,0,1\}^n\) نمونے لیتا ہے اور حساب لگاتا ہے:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

ciphertext \(c=(c_0,c_1)\) ہے.

ہومورف اضافہ اجزاء کے لحاظ سے سمجھدار ہے:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

ایک سادہ متن پیمانے \(\alpha\) کا اضافہ کرنا کوفیشن صفر تبدیلیوں کے لئے صرف \(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

ایک سادہ متن پیمانے \(\alpha\) کی طرف سے ضرب دونوں اجزاء پیمانے:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

دو ciphertexts کے لئے \(c=(c_0،c_1)\) اور \(d=(_0،d_1)\) ، ciphertext ضرب سب سے پہلے ایک سائز تین ciphertext کی حساب لگاتا ہے اور ہر تعدد واپس پیمانے پر \(t/q\):

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

مندرجہ بالا تمام مصنوعات \(R_q\) میں نیگاسیکلک انگوٹی کی مصنوعات ہیں۔ پھر \(\tilde c_2\) کو بیس-\(B\) کثیرالاضلاع میں تقسیم کیا جاتا ہے:

$$
\tilde c_2 = \sum_j B^j u_j
$$

اور دوبارہ سیدھا کیا گیا:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

نتیجے میں ایک بار پھر دو جزو BFV کوڈ متن ہے.

### شناخت کنندہ کوڈ متن لفافہ {#identifier-ciphertext-envelope}

ایک شناختی ان پٹ بائٹ سٹرنگ:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

اسکیلار سلاٹس میں کوڈ کیا گیا ہے:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

اور باقی تمام سلاٹ صفر سے `max_input_bytes + 1` تک ہیں۔ ہر سکالر سلاٹ کو ضارب صفر سادہ متن کثیرالاضلاع \([m_i]\) کے طور پر خفیہ کیا جاتا ہے۔ ہر سلاٹ خفیہ کاری کا بیج ہے:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

خفیہ کردہ شناختی لفافہ یہ ہے:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

جہاں \(M=\mathrm{max\_input\_bytes}\).

### BFV صاف پس منظر {#bfv-affine-backend}

کے لئے `bfv-affine-sha3-256-v1`, رن ٹائم سب سے پہلے حاصل BFV سے اہم مواد \(s\) اور \(A\). حاصل کردہ عوامی پیرامیٹرز کو بالکل ان عوامی پیرامٹرز سے ملنا چاہئے جو سلسلہ بندی پر کئے گئے ہیں۔

افین سرکٹ کا بیج ہے:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

اس بیج سے رن ٹائم نمونے، modulo \(t\)، ایک 32 صفوں کے متعلقہ سرکٹ:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

جہاں \(m_i\) غیر خفیہ کردہ شناختی سلاٹس ہیں۔ ہومورفک طور پر ، یہ ایک ہی قدر کو خفیہ متنوں پر حساب کرتا ہے:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

ریزولور ہر ایک \(C_j\) کو ڈیکرپٹ کرتا ہے، تمام پیچھے والے سادہ متن کے ضارب کو صفر کی ضرورت ہوتی ہے، ضارب-صفر اقدار کو بائٹس میں تبدیل کرتا ہے، اور فارم:

$$
O=(y_0,\ldots,y_{31})
$$

پھر:

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

### BFV پروگرام شدہ بیک اینڈ {#bfv-programmed-backend}

`bfv-programmed-sha3-256-v1` کے لیے، عوامی پیرامیٹرز میں BFV شناخت کنندہ خفیہ کاری پیرامیٹر اور ایک پوشیدہ پروگرام ڈائجسٹ شامل ہیں:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

موجودہ RAM-FHE پروفائل ہے:

|فیلڈ |قیمت |
| --- | --- |
|`profile_version` | `1` |
|`register_count` | `4` |
|`memory_lane_count` | `32` |
|`ciphertext_mul_per_step` | `1` |
|`encrypted_input_mode` |`resolver_canonicalized_envelope_v1` |
|`min_ciphertext_modulus` | \(2^{52}\) |

Torii کو پیش کردہ سادہ متن ان پٹ کو عمل درآمد سے پہلے اسی BFV لفافے میں خفیہ کیا جاتا ہے۔ اس سرور سائیڈ خفیہ کاری کے لئے تعیناتی بیج یہ ہے:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

باہر سے فراہم کردہ encrypted input کے لیے resolver شناخت کنندہ کے لفافے کو decrypt کرتا ہے اور عمل درآمد سے پہلے اسے اس deterministic لفافے میں دوبارہ encrypt کرتا ہے۔ یہ canonicalization معنوی طور پر برابر BFV ciphertexts کے لیے رسید کے hashes کو مستحکم رکھتی ہے۔

ابتدائی خفیہ شدہ میموری لینز سے حاصل کیا جاتا ہے:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

32 لینوں میں سے ہر ایک کے لئے ، رن ٹائم نمونے \(r_j \in [0,t)\) اور BFV خفیہ متن کو encrypting \(r_j\) ذخیرہ کرتا ہے۔ اس کے بعد پوشیدہ پروگرام خفیہ شدہ رجسٹرز اور خفیہ کردہ میموری پر چلتا ہے:

|تعلیم |الجبرا |
| --- | --- |
|`LoadInput(dst, i)` |\(R_{\mathrm{dst}} \leftarrow C_i\) |
|`LoadState(dst, j)` |\(R_{\mathrm{dst}} \leftarrow S_j\) |
|`StoreState(j, src)` |\(S_j \leftarrow R_{\mathrm{src}}\) |
|`LoadConst(dst, a)` |\(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a) \) |
|`Add(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
|`AddPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
|`SubPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
|`MulPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
|`Mul(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_aR_b\) ، پھر ری لائنر |
|`SelectEqZero(dst, cond, z, nz)` |ڈیکرپٹ \(R_{\mathrm{cond}}\)؛ منتخب کریں \(R_z\) جب یہ صفر ہے، دوسری صورت میں \(R_{nz}\). |
|`Output(src)` |\(R_{\mathrm{src}}\) کو آؤٹ پٹ رجسٹر کی فہرست میں شامل کریں۔ |

ہدایات کی ٹیپ ختم ہونے کے بعد، ریزولور ہر آؤٹ پٹ رجسٹر کو ڈیکرپٹ کرتا ہے، صفر کوفیشن کو بائٹ میں تبدیل کرتا ہے، اور ان بائٹس کو منسلک کرتا ہے:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

عام پروگرام شدہ بیک اینڈ ہیشز ہیں:

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

ڈیفالٹ پروگرام شدہ شناختی ٹیپ میں 64 ان پٹ سلاٹس ہیں۔ ہر سلاٹ \(i\) کے لئے ، یہ ان پٹ اسلاٹ کو لوڈ کرتا ہے ، میموری لین \(i \bmod 32\) لوڈ کرتا ہے۔ ، انہیں شامل کرتا ہے ، اور نتیجہ نکالتا ہے:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### آؤٹ پٹ ہیش اور رسیدیں {#output-hashes-and-receipts}

عام RAM-LFE عمل درآمد کی رسید خام پیداوار پر دستخط نہیں کرتی ہے۔ یہ آؤٹ پٹ ہیش پر دستخط کرتی ہے:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Torii RAM-LFE عمل درآمد کی رسیدوں کے لئے، منسلک اعداد و شمار پروگرام کی شناخت کرنے والے بائٹس ہیں:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

دستخط شدہ رسید کا استعمال مندرجہ ذیل ہے:

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

`signed` موڈ کے لئے:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

تصدیق `resolver_public_key` کے ساتھ دستخط کی جانچ پڑتال کرتی ہے اور رسید کو مسترد کرتی ہے جب تک کہ ان تمام مساوات میں شامل نہ ہو:

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

اگر کال کرنے والا `output_hex` فراہم کرتا ہے تو ، تصدیق کنندہ بھی چیک کرتا ہے:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

`proof` موڈ کے لئے ، تصدیق میں دستخط کی بجائے ثبوت کا لفافہ ہوتا ہے۔ تصدیق اس بات کی جانچ کرتی ہے کہ ثبوت بیک اینڈ ، سرکٹ آئی ڈی ، عوامی ان پٹ اسکیم ہیش ، تصدیق کرنے والی کلید ہیش ، اور نمائش شدہ عوامی مثالیں ثبوت تصدیق کنندہ میٹا ڈیٹا اور کوڈ شدہ رسید-پیلوڈ ہیش سے ملتی ہیں۔ چلو:

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

متوقع عوامی مثالیں ایک عنصر والے چار کالم ہیں۔ کالم \(j\) میں بائٹس \(h_{8j}\ldots h_{8j+7}\) شامل ہیں جس کے بعد 24 صفر بائٹس:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### شناختی پروجیکشن {#identifier-projection}

شناخت کنندہ ریزولوشن عام بیک اینڈ `opaque_hash` کو صارف کے سامنے غیر شفاف اکاؤنٹ کی شناخت کنندہ کے طور پر استعمال نہیں کرتا ہے۔ یہ RAM-LFE آؤٹ پٹ ہیش کو شناخت کنندہ مخصوص ڈومینز میں پیش کرتا ہے:

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

`IdentifierResolutionReceipt` ایک اعلی سطح کے پے لوڈ پر دستخط کرتا ہے:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

دستخط شدہ شناختی رسیدوں کے لئے:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` رسید کو صرف اس صورت میں قبول کرتا ہے جب دستخط یا ثبوت درست ہو، ایمبیڈڈ RAM-LFE عملدرآمد کا payload ریفرنس کردہ پروگرام کی پالیسی سے ملتا ہے، اور `uaid` اور `account_id` لازمی طور پر دعوی کیا جاتا ہے.

## عمل درآمد کا بہاؤ {#execution-flow}

ایک عام RAM-LFE عمل اس شکل کے مطابق ہے:

1. گورننس یا ایک آپریٹر کی رجسٹریشن `RamLfeProgramPolicy`.
2. مالک پالیسی کو چالو کرتا ہے۔
3. کلائنٹ Torii سے عوامی پالیسی کے میٹا ڈیٹا کو پڑھتا ہے۔
4. کلائنٹ ریزولور کو ایک ہی ان پٹ فارم جمع کراتا ہے: سادہ متن `input_hex` یا خفیہ کردہ BFV ان پٹ لفافہ۔
5. رن ٹائم چھپے ہوئے پروگرام کا جائزہ لیتا ہے اور واپسی `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash`, اور ایک `RamLfeExecutionReceipt`.
6. کلائنٹ یا بیک اینڈ شائع کردہ پالیسی کے مطابق رسید کی تصدیق کرتا ہے، اختیاری طور پر جانچ پڑتال کرتا ہے کہ واپسی شدہ `output_hex` رسید کے `output_hash` میں ہیش ہوتا ہے۔
7. ایک اعلی سطح کی ہدایات، جیسے `ClaimIdentifier`، خام ان پٹ کو شامل کرنے کے بجائے تصدیق شدہ رسید کو سرایت کر سکتے ہیں.

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

## شناختی پالیسیاں {#identifier-policies}

شناخت کنندہ پالیسیاں RAM-LFE کا ایک ٹھوس استعمال ہیں۔ وہ عام پروگرام کی پالیسی کے اوپری حصے میں کاروباری ناموں کی جگہ اور معمول سازی کا اصول شامل کرتے ہیں:

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

شناخت کی پرت RAM-LFE رسید کا استعمال کرتا ہے:

- `policy_id`
- پوشیدہ فنکشن کی طرف سے حاصل غیر شفاف شناخت کنندہ
- deterministic `receipt_hash`
- اکاؤنٹ کا UAID
- کینونیکل `account_id`
- عام RAM-LFE عملدرآمد کا payload

صارف کے سامنے آن بورڈنگ کے لئے ، اکاؤنٹ عرفات کو نجی شناخت کنندگان سے الگ رکھیں۔ عرفات عوامی نام ہیں؛ فون نمبرز ، ای میل پتوں اور اسی طرح کی اقدار کو شناختی پالیسیوں اور رسیدوں میں بہنا چاہئے۔

## Torii روٹس {#torii-routes}

جب ایپ کی طرف رخ کرنے والی روٹ فیملی کو چالو کیا گیا ہے تو ، Torii RAM-LFE اور شناخت کنندہ مددگاروں کو بے نقاب کرتا ہے۔

|راستہ |مقصد |
| --- | --- |
|`GET /v1/ram-lfe/program-policies` |فعال اور غیر فعال RAM-LFE پروگرام کی پالیسیوں اور عوامی عمل درآمد کے میٹا ڈیٹا کو درج کریں۔ |
|`POST /v1/ram-lfe/programs/{program_id}/execute` |`input_hex` یا `encrypted_input` سے ایک پروگرام کو چلائیں اور آؤٹ پٹ ہیشز کے علاوہ ایک بے حالت رسید واپس کریں۔ |
|`POST /v1/ram-lfe/receipts/verify` |شائع کردہ پالیسی کے ساتھ `RamLfeExecutionReceipt` کی تصدیق کریں اور اختیاری طور پر `output_hex` کو `output_hash` سے موازنہ کریں۔ |
|`GET /v1/identifier-policies` |شناخت کی پالیسیوں، معمول سازی کے طریقوں، حل کرنے والے چابیاں اور خفیہ کردہ ان پٹ میٹا ڈیٹا کو درج کریں۔ |
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt` |اس رسید کو جاری کریں جسے صارف `ClaimIdentifier` میں داخل کر سکتا ہے۔ |
|`POST /v1/identifiers/resolve` |جب ایک فعال دعوی موجود ہو تو پابند اکاؤنٹ میں معیاری شناخت کنندہ ان پٹ کو حل کریں۔ |
|`GET /v1/identifiers/receipts/{receipt_hash}` |آڈٹ اور سپورٹ ٹولنگ کے لئے رسید ہیش کی طرف سے ایک برقرار شناخت کا دعوی تلاش کریں. |

ان راستوں کے مقابلے میں تعمیر کرنے سے پہلے ہدف نوڈ کی `/openapi.json` دستاویز کو ہمیشہ چیک کریں۔ دستیابی نوڈ کی تعمیر اور نیٹ ورک پروفائل پر منحصر ہے۔

## نوڈ رن ٹائم {#node-runtime}

Torii کے عمل میں رن ٹائم RAM-LFE کو `torii.ram_lfe.programs[*]` کے تحت ترتیب دیا گیا ہے، جس پر `program_id` کیٹ دی گئی ہے۔ ہر تشکیل شدہ پروگرام کو آن لائن پالیسی کے عزم سے ملنا چاہئے اور رسیدوں کا جائزہ لینے اور تصدیق کرنے کے لئے ضروری رن ٹائمز مواد فراہم کرنا چاہئے. شناخت کنندہ راستوں نے اسی رن ٹائم کو دوبارہ استعمال کیا ہے۔ انہیں شناخت کنندہ-حل کرنے والے ترتیب کی علیحدہ سطح کی ضرورت نہیں ہے۔

ایک پالیسی آن چین کو رجسٹر کرنا خود ہی کافی نہیں ہے۔ ہدف نوڈ کو روٹ فیملی کو بھی بے نقاب کرنا چاہئے اور ان پروگراموں کے لئے مماثل رن ٹائم مواد ہونا چاہئے جو اس سے انجام دینے کی توقع کی جاتی ہے۔

## آپریشنل گارڈ ریلز {#operational-guardrails}

- پالیسیوں کو غیر فعال رجسٹر کریں، عوامی میٹا ڈیٹا کی تصدیق کریں، پھر انہیں چالو کریں۔
- دستاویزات، نوشتہ جات، لین دین، اور کلائنٹ کے بنڈل سے خفیہ مواد کو چھپانے کے لئے جائزہ لینے والے رازوں، حل کرنے والے دستخط کی چابیاں، اور BFV خفیہ material.
- اکاؤنٹ کے عرفی ناموں، ٹرانزیکشن میٹا ڈیٹا، واقعات یا دنیا کی حالت کے شعبوں میں خام شناخت کنندہ نہ ڈالیں۔
- جب SDK تصدیق کنندہ کو بے نقاب کرتا ہے تو اعلی سطح کے ہدایات بھیجنے سے پہلے کلائنٹ کی طرف سے رسیدوں کی تصدیق کریں۔
- ختم ہونے والے فیلڈز کا استعمال کریں جہاں پرانی رسیدیں ہمیشہ کے لئے درست نہیں رہیں گی۔
- نئے پروگرام یا شناختی پالیسی کو رجسٹر کرکے، کلائنٹس کی منتقلی اور نئی رسیدوں کے بہاؤ کے بعد پرانی پالیسی کو غیر فعال کر کے گھومیں.

## متعلقہ موضوعات {#related-topics}

- [پرائیویٹ ڈیٹا اسپیس کے لئے سپانسر فیس](/ur/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii اختتامی مقامات](/ur/reference/torii-endpoints.md#app-and-sora-route-families)
- [گمنام ٹرانزیکشنز](/ur/blockchain/anonymous-transactions.md)
