---
translation_locale: ar
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE تعني تقييم وظيفة الآلة العشوائية
Iroha, هو الطبقة العامة للعمل الخفي لبرامج التي سياسة عامة
هو على سلسلة ولكن لا ينبغي أن يكون المدخلات السرية أو الخام
مكتوب على الدولة العالمية. SORA Nexus تدفقات المعرف، مثل
البحث عن الهاتف الخاص أو البريد الإلكتروني، ويمكن أيضا أن تكون عرضة كعادة Torii
مساعدة تنفيذ البرنامج عندما يُمكّن ملف تعريف العقدة من توجيه الطرق إلى التطبيق.

تخزين السلسلة البيانات المعدنية المتعلقة بالتزام السياسة والتحقق من الإيصالات.
القرار أو Torii وقت تشغيل يقوم بتقييم البرنامج المخفي، يعيد فقط
المخرجات المسموح بها، ويشمل إيصال أن العملاء، أدوات الدعم، أو
يمكن للتحقق من تعليمات الكتيب ضد السياسة المسجلة.

## الإسم {#naming}

المشاركة في الإسم مهمة:

| المدة | المعنى |
| --- | --- |
| `ram_lfe` | الاختصار الخارجي للعمل المخفي: سياسات البرنامج، والالتزامات، وإيصالات التنفيذ، ونمط التحقق من الإيصالات. |
| `BFV` | مخطط تشفير براكرزكي/فان فيركوتيرين المثالي الذي يستخدم المدخل المشفر RAM-LFE الخلفية |
| `ram_fhe_profile` | BFV- المعلومات المتعلقة بالبيانات المعدنية الخاصة بجهاز التنفيذ المشفر المبرمج. RAM-LFE. |

في نموذج البيانات، `RamLfeProgramPolicy` و `RamLfeExecutionReceipt` هي
RAM-LFE النوع. BFV المعلمات، غلافات النص المشفر، والخفية
RAM-FHE ملف برنامج ينتمي إلى خلفية التنفيذ المشفرة المستخدمة من قبل
السياسة

## ما يسجل {#what-it-records}

(أ) RAM-LFE يتم تسجيل سياسة البرنامج على مستوى العالم من قبل `program_id`. السياسة
يحتوي على:

- الحساب المالك الذي يمكنه تنشيط أو تعطيل، أو تغيير
  السياسة
- الخلفية التي يتم الإعلان عنها للعملاء
- طريقة التحقق من الإيصالات، إما `signed` أو `proof`
- الالتزام بميتاء البيانات الخفية للبرنامج وسرية المقيّم
- المفتاح العام للمحلّل للإيصالات الموقعة
- البيانات الوصولية المشفورة العامة الخيارية، مثل: BFV المعايير و
  `ram_fhe_profile`
- (أ) `active` العلم الذي يتحكم في ما إذا كان السياسة يمكن إصدار الإيصالات الجديدة

السر الخفي، القيمة المحددة للنص البسيط، والجسم البرنامج المخفية هي
لا يتم تخزينها في حالة العالم يجب على العملاء التعامل مع الالتزامات
تلقي الهاشات والنصوص المشفرة، وتضخيم البرنامج كقيم بروتوكول غير شفافة.

## الخلفيات {#backends}

الحالي RAM-LFE الدعم يركز على ثلاثة تحديدات الخلفية:

| الخلفية | الاستخدام |
| --- | --- |
| `hkdf-sha3-512-prf-v1` | التزامات PRF التقييم. |
| `bfv-affine-sha3-256-v1` | BFV-دعم التقييم السري على فتحات المعرفة المشفرة |
| `bfv-programmed-sha3-256-v1` | BFV-التنفيذ المبرمجة المدعومة عبر السجلات المشفرة ومسارات الذاكرة |

بالنسبة لسياسات تحديد الهوية، BFV الخلفية هي المهمة الحديثة
يسمح للمحفظات بتشفير المدخلات الطبيعية محلياً، ويسمح للمحلّل
تقييم دون رؤية معرف عام في المعاملة، وإرجاع
الإيصالات التي تربط الهاش المخرج بسياسة البرنامج المسجلة.

## الرياضيات {#math}

يصف هذا القسم الجبر على مستوى التنفيذ المستخدم من قبل
RAM-LFE هذا ليس دليل أمني، إنه نسخة تحديدية
ونموذج التقييم المشفر الذي يجب أن تقوم بها السياسات والإيصالات والعملاء
اتفقنا

### الإشارة {#notation}

دعونا:

- \(H(m)\) أن تكون Iroha `Hash::new(m)`: بليك2ب-32 انتهت `m`, مع أقل
  جزء كبير من البايت النهائي أجبر على `1`.
- \(N(x)\) أن يكون القنوني Norito تشفير `x`.
- \(a \parallel b\) المتوسط من سلسلة البايت.
- {\displaystyle \operatorname{le64}} }i)\) تكون رمزية 8 بايتات صغيرة من إنديان
  عدد كامل غير مؤشر
- \(s\) أن تكون مصدر السر الذي يحتفظ به خارج دولة العالم
- \(P\) أن تكون معايير السياسة العامة.
- \(A\) يجب طلب البيانات المرتبطة.
- \(x\) أن تكون البايتات الإدخال المعتاد أو Norito-مخفوفة مخففة-المدخل
  غلاف، اعتمادا على الخلفية.

RAM-LFE تستخدم الحشيشات المنفصلة عن النطاق. الصيغة أدناه تسمية النطاقات من خلال
الغرض؛ سلسلة البايت الحالية هي:

| الرمز | سلسلة النطاق |
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

### الالتزام بالسياسة {#policy-commitment}

الالتزام السياسي يربط المعايير العامة والحل الخفية السرية
أولاً، السر يتم القيام به بشكل منفصل:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

ثم يتم تشفير النسخة الكاملة للسياسة:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

والحش السياسة المنشورة هي:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

السلسلة `PolicyCommitment` هو:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

التقييم يعيد حساب نفس القيمة من سرية وقت التشغيل
الاختلافات المتجددة، الفشل في التقييم مع عدم مطابقة الالتزام.

### HKDF-SHA3-512 الخلفية {#hkdf-sha3-512-backend}

ل: `hkdf-sha3-512-prf-v1`, الخروج هو المدخل المعتاد نفسه، ولكن
المعرف غير الشفاف والحش الإيصالات مرتبطة بالسر PRF المخرجات

نسخة الطلب هي:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

(الـ) HKDF الملح و مفتاح الفردية:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

يتم توسيع المواد الغير مرئية وتقليصها:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

يربط المواد المصادرة أيضاً الهوية غير الشفافة:

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

يعود الخلفي:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV الـ "باير" {#bfv-primer}

BFV هو مخطط تشفير هومورفي على أساس شبكة. "هومورفي" يعني
أن البرنامج يمكنه إضافة وتضاعف القيم المشفرة، وبعد فك الشفرة،
يحصل على نفس النتيجة كما لو كان قد قام بإجراء الإضافات والضاعفات
على قيم النص البسيط.

ل: RAM-LFE, BFV يستخدم كآلية إدخال مشفرة:

1. محفظة تعادل قيمة خاصة، مثل رقم الهاتف أو البريد الإلكتروني
   العنوان
2. المحفظة تحويل البايت إلى فتحات صغيرة من الأعداد الكاملة.
3. كل فتحة مشفرة مع حل القرار BFV مفتاح عام
4. إنّ وقت تشغيل القرار يُقيّم البرنامج المخفي على تلك النصوص المشفرة.
5. وقت تشغيل يفكّر فقط خروج البرنامج الخفية والإشارات أو يثبت
   إيصال.

BFV هو الحساب الدقيق للأعداد الكاملة، وليس الحساب التقريبي. هذا هو السبب
أفضل لتحديد البايتات والحسابات المودولية الصغيرة من
استنتاج نموذج نقطة عائمة Iroha" الحالي " BFV الاستخدام، كل تشفير
فتحة تحمل واحد القيمة المتعددة modulo \(t\), عادةً بايت أو طول بايت
الحقل. النص المشفر نفسه يعيش modulo عدد كامل أكبر بكثير \(q\). (الـ)
الفجوة بين \(q\) و \(t\) يمنح غرفة فك تشفير للضوضاء أن التشفير
وتقديم العمليات المثلية.

(أ) BFV النص المشفر لديه عنصرين متعددين الحدود:

$$
c=(c_0,c_1)
$$

المفتاح السري هو تعدد آخر \(s_k\). تشفير يجمع بين
المكونات:

$$
v = c_0 + c_1s_k
$$

إذا تم تشكيل النص المشفر بشكل صحيح والضجيج لا يزال صغير بما فيه الكفاية،
\(v\) يقترب من النص الصريح المقياس. التجول يعيد النص الصافي
معدل modulo \(t\). الخصائص المفيدة هي أن عمليات النص المشفر
الحفاظ على هذه الهيكل:

| العملية العادية | عملية رمزية النص |
| --- | --- |
| \(m+n\) | إضافة مكونات النص المشفر. |
| \(m+\alpha\) | إضافة ثابتة النص الصريح المقياس في \(c_0\). |
| \(\alpha m\) | مقياس كل من مكونات النص المشفرة \(\alpha\). |
| \(mn\) | مضاعفة تعدد النص الرمزي، وإعادة تحديد حجمها، ثم إعادة التخطيط. |

الضرب هو العملية المكلفة.
تشفيرتيكست بشكل طبيعي يخلق ثلاثة مكونات تشفير النص الذي يقوم بتشفير مع
\(1\), \(s_k\), و \(s_k^2\). إعادة التخطيط تستخدم مفتاح تقييم نشر
لتمثيل \(s_k^2\) تعيد المصطلح إلى نص تشفير عادي من اثنين من المكونات.
يحافظ على إضافة لاحقة وتضاعف باستخدام نفس شكل نص الشفر.

BFV أيضاً "مرتفعة": كل عملية مشفرة تستهلك بعض ميزانية الضوضاء.
هذا التنفيذ لا يقوم بتشغيل النصوص المشفرة لتجديد تلك الميزانية.
بدلاً من ذلك RAM-LFE ينشر قصة صغيرة `ram_fhe_profile` " ولا يقبل إلا حدودا " .
شكل البرنامج المخفي. هذا يبقي التقييم داخل مجموعة المعلمات
عمق مدعوم. الملف المبرمج الحالي يسمح بسجل ثابت
العد، وعد مسار الذاكرة الثابتة، واكثر من نص رمزي واحد
مضاعفة لكل خطوة مبرمجة.

في هذا RAM-LFE التصميم BFV يخفي إدخال العميل من بيانات الكتب العامة و
من المراقبين الذين يرون فقط المعاملة أو الحمولة المفيدة للخط
تقوم السلسلة بتنفيذ برامج مشفرة تعسفية بنفسها Torii القرار
الوقت الزمني لا يزال يملك BFV المواد السرية، تقييم التكوين الخفية
البرنامج، يفكّر الخروج المسموح به، ويشهد النتيجة.
بعد ذلك تحقق من الشهادة ضد الالتزام بالسياسة على السلسلة
حل المفاتيح العامة أو البيانات الوصفية.

حالة استخدام المعرفة تختار تمثيلاً بسيطاً عمداً
يتم تشفير السلسلة المعتادة على النحو التالي:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

كل عنصر مُشفّر على أنه الخاص به BFV نص تشفير مستوي. هذا الشكل يجعل
التطبيع والتحقق من الملفات صراحة، يسمح محفظات بناء مشفرة
الطلبات من المعلمات العامة، والسماح للمحلّل canonicalize معادلة
المدخلات المشفرة في نسخة استلام مستقرة.

### BFV نموذج الخاتم {#bfv-ring-model}

(الـ) BFV تستخدم الخلفيات حلقة الكتلة النيغاسيكلية:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

وخطة النص البسيط:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

حيث:

- \(n\) هو `polynomial_degree`, قوة من اثنين
- \(q\) هو `ciphertext_modulus`
- \(t\) هو `plaintext_modulus`
- \(q > t\) و \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

يتم تشفير متجهات معدل النص الصريح عن طريق قياس كل معدل:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

كشف مركز رفع كل معدل من:

$$
v = c_0 + c_1 s_k \in R_q
$$

ثم تدورها مرة أخرى \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

ها هي \(s_k\) هو BFV الكلمة متعددة المفاتيح السرية، وليس الخارجي RAM-LFE القرار
السرية \(s\).

### BFV الجيل الرئيسي {#bfv-key-generation}

لمدخلات المعرف المشفرة، BFV المادة الرئيسية هي تحديدية لكل
البيانات السرية للمحلّل والمتعلقة بها:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

(الـ) BFV RNG يتم زرعها على النحو:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

عينات المولد الرئيسي:

- \(s_k \in \{-1,0,1\}^n\), تمثل modulo \(q\)
- \(a \leftarrow R_q\) بشكل متساوي
- \(e \in \{-1,0,1\}^n\)

المفتاح العام هو:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

لتحديد خطية أخرى، دع \(s_k^2\) أن تكون منتج الخاتم في \(R_q\). لكل واحد
القاعدة\(B\) رقم \(j\), العينة \(a_j\) بشكل متساوي و \(e_j\) من الصغار
التوزيع، ثم نشر:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

الجمهور BFV تحتوي البيانات المعدنية السياسية على \((n,q,t,B)\) ، والمفتاح العام، و
`max_input_bytes`. (الـ) BFV المفتاح السري ومفتاح إعادة التخطيط البقاء في
وقت تشغيل القرار

### BFV التشفير والعمليات {#bfv-encryption-and-operations}

لتشفير متعدد النص البسيط \(m\), البذور التنفيذية الأخرى
ChaCha20 RNG من:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

انها عينات \(u,e_1,e_2 \in \{-1,0,1\}^n\) والحسابات:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

النص المشفر هو \(c=(c_0،c_1)\).

الإضافة المثليّة هي الحكيمة من حيث المكونات:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

إضافة مقياس النص الصريح \(\alpha\) تغيرات إلى معدل صفر فقط
\(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

مضاعفة بواسطة مقياس النص البسيط \(\alpha\) المقاييس لكل من المكونات:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

لثنين من النصوص المشفرة \(c=(c_0،c_1)\) و \(d=_0 ، d_1)\) النص المشفر
المضاعفة تحسب أولاً نص تشفري بحجم ثلاثة وتحاسب كل واحد
معدل العودة \(t/q\):

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

جميع المنتجات المذكورة أعلاه هي منتجات حلقات ناجاسيكليك في \(R_q\). إذن
\(\tilde c_2\) يتم تفكيكها إلى قاعدة\(B\) المتعددات:

$$
\tilde c_2 = \sum_j B^j u_j
$$

ويتم إعادة التخطيط:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

النتيجة هي مرة أخرى عنصرين BFV النص المشفر.

### المعرفة الرقميةغلفة النص {#identifier-ciphertext-envelope}

سلسلة إدخال البايت للتعرف:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

يتم ترميزها في فتحات مستوى:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

وكل الفتحات المتبقية هي صفر حتى `max_input_bytes + 1`. كل مستوى
يتم تشفير الفتحة كعدد متعدد النص البسيط من معدل صفر \([m_i]\).
بذرة تشفير لكل فتحة هي:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

غطاء المعرف المشفر هو:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

حيث \(M=\mathrm{max\_input\_bytes}\).

### BFV الخلفية المثيرة {#bfv-affine-backend}

ل: `bfv-affine-sha3-256-v1`, وقت التشغيل أولاً يستمد BFV المواد الرئيسية من
\(s\) و \(A\). المعلمات العامة المستمدة يجب أن تتطابق تماما مع الجمهور
المعايير المفروضة على السلسلة

البذور المتحركة هي:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

من هذه البذور عينات وقت التشغيل، modulo \(t\), دائرة ذات صلة 32 صف:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

حيث \(m_i\) هي فتحات المعرفة المشفرة.
نفس القيمة على النصوص المشفرة:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

القرار يفكّر كل واحد \(C_j\), يتطلب كل النص البسيط المتبع
تعادلات إلى الصفر، وتحويل قيم المعاملة-الصفر إلى بايت،
النماذج:

$$
O=(y_0,\ldots,y_{31})
$$

ثم:

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

### BFV المبرمجة الخلفية {#bfv-programmed-backend}

ل: `bfv-programmed-sha3-256-v1`, المعلمات العامة تغلف BFV المعرف
معايير التشفير بالإضافة إلى هضم برنامج مخفي:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

التيار RAM-FHE الملف هو:

| الحقل | القيمة |
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

إدخال النص البسيط المقدم إلى Torii يتم تشفيرها في نفس BFV غلاف
قبل تنفيذها. البذور التحديدية لتلك التشفير من جانب الخادم هي:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

للدخول المشفرة المقدمة خارجيًا ، يقوم القرار بتشفير المعرف
تغطية وإعادة تشفيرها على هذا الغلاف التحديدية قبل تنفيذ.
هذا التشريح يحافظ على استلام هاشز مستقرة عبر المساواة
BFV النصوص المشفرة

يتم استنباط خطوط الذاكرة المشفرة الأولية من:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

لكل من 32 ممر، عينات وقت التشغيل \(r_j \in [0,t)\) وتخزين a BFV
تشفير النص المشفر \(r_j\). البرنامج المخفي ثم تنفذ على تشفير
السجلات والذاكرة المشفرة:

| التعليمات | الجبر |
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | \(ر_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\) |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\), ثم إعادة التخطيط |
| `SelectEqZero(dst, cond, z, nz)` | فك تشفير \(R_{\mathrm{cond}}\); اختر \(R_z\) عندما يكون صفر، وإلا \(R_{nz}\). |
| `Output(src)` | إضافة \(R_{\mathrm{src}}\) إلى قائمة سجل الخروج. |

بعد أن تنتهي شريط التعليمات ، يقوم القرار بتشفير كل خروج
تسجيل، وتحويل معدل الصفر إلى بايت، وترابط تلك البايت:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

التشغيلات الخلفية المبرمجة العامة هي:

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

الشريط المحدد المبرمج الافتراضي لديه 64 فتحة إدخال. لكل فتحة
\(i\), إنها تحميل فتحة المدخل، وتحميل طريق الذاكرة \(i \bmod 32\), يضيفهم
وتخرج النتيجة:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### النتائج والإيصالات {#output-hashes-and-receipts}

المادة العامة RAM-LFE إيصال التنفيذ لا يوقع الخروج الخام.
النتائج:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

ل: Torii RAM-LFE الإيصالات التنفيذية ، والبيانات المرتبطة هي القنوية
بايتات معرف البرنامج:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

الحمولة المفيدة للإيصالات الموقعة هي:

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

ل: `signed` النظام:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

التحقق من التوقيع مع `resolver_public_key` ويرفض
الاستلام ما لم تكن جميع هذه المساواة:

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

إذا قام المتصل بتقديم `output_hex`, يقوم المحقق أيضًا بفحص:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

ل: `proof` الطريقة، الشهادة تحمل غلاف إثبات بدلا من
التحقق من أن المؤشر الخلفي، وسمة الدائرة،
الهشيش من مخططات المدخل العام ، والهشيش من مفتاح التحقق ، والحالات العامة المعروضة
تتطابق مع البيانات الأساسية للتحقق من الإثبات والحش المشفر للوصول إلى الحساب.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

الحالات العامة المتوقعة هي أربع أعمدة من عنصر واحد. \(j\)
يحتوي على البايتات \(h_{8j}\ldots h_{8j+7}\) تليها 24 بايت صفر:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### تحديد المعلومات {#identifier-projection}

القرار المحدد لا يستخدم الخلفية العامة `opaque_hash` كما
يُعَرّض المستخدم هويت الحساب غير الشفاف. RAM-LFE النتائج
من خلال مجالات محددة لتحديد المعرف:

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

(إنجليزية) `IdentifierResolutionReceipt` يُوقع حمولة فائدة من مستوى أعلى:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

للوصولات الموقعة للتعريف:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` لا يقبل الإيصالات إلا عندما يكون التوقيع أو الدليل
صحيحة، المضمنة RAM-LFE الحمل المفيد للتنفيذ يطابق البرنامج المرجح
السياسة، و `uaid` و `account_id` الالتزام الذي يُطالب به

## تدفق التنفيذ {#execution-flow}

عادة RAM-LFE التنفيذ يتبع هذا الشكل:

1. الإدارة أو سجلات المشغل `RamLfeProgramPolicy`.
2. المالك يقوم بتفعيل السياسة
3. العميل يقرأ البيانات النظام العام من Torii.
4. يقوم العميل بإرسال نموذج إدخال واحد بالضبط إلى الحل: النص الصريح
   `input_hex` أو مشفرة BFV غلاف المدخل.
5. وقت التشغيل يقيّم البرنامج المخفي ويعود `output_hex`,
   `output_hash`, `opaque_hash`, `receipt_hash`, و (أ)
   `RamLfeExecutionReceipt`.
6. يقوم العميل أو الخلفي بالتحقق من استلامها مقابل السياسة المنشورة،
   اختياري التحقق من أن المرجع `output_hex` الحشيشات إلى الإيصالات
   `output_hash`.
7. تعليم على مستوى أعلى، مثل `ClaimIdentifier`, يمكن أن تضمين
   إيصال مصدّق بدلاً من إدراج المدخل الخام.

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

## سياسات التعرف {#identifier-policies}

سياسات التعرف هي استخدام ملموس ل RAM-LFE. يضيفون عمل
قاعدة مساحة الأسماء وتطبيعها فوق سياسة البرنامج العامة:

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

الطبقة المحددة تستخدم RAM-LFE الإيصالات لربط:

- `policy_id`
- المعرف غير الشفاف المستخرج من الوظيفة الخفية
- المحددة `receipt_hash`
- الحساب UAID
- الكنسي `account_id`
- المادة العامة RAM-LFE الحمل المفيد للتنفيذ

للاستضافة المستخدمية، حافظ على أسماء الأسمى الخاصة بالحساب منفصلة عن الخصوصية
المعرفات. الألقاب هي أسماء عامة، وأرقام الهاتف، وعناوين البريد الإلكتروني،
يجب أن تتدفق قيم مماثلة من خلال سياسات التعرف والإيصالات.

## Torii الطرق {#torii-routes}

عندما يتم تمكين عائلة الطرق التي تتجه نحو التطبيق، Torii المكشفات RAM-LFE و
المساعدين في تحديد الهوية:

| الطريق | الغرض |
| --- | --- |
| `GET /v1/ram-lfe/program-policies` | القائمة النشطة والغير النشطة RAM-LFE سياسات البرنامج و البيانات المعدنية العامة للتنفيذ |
| `POST /v1/ram-lfe/programs/{program_id}/execute` | تنفيذ برنامج واحد من `input_hex` أو `encrypted_input` و إرجاع النتائج بالإضافة إلى إيصال بلا ولاية |
| `POST /v1/ram-lfe/receipts/verify` | التحقق من `RamLfeExecutionReceipt` مقارنة السياسة المنشورة `output_hex` إلى `output_hash`. |
| `GET /v1/identifier-policies` | قم بإدراج سياسات تحديد المعرف، وأساليب التطبيع، ومفاتيح الحل، ومتطاعم المدخل المشفر. |
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` | إصدار الإيصالات التي يمكن للمستخدم إدراجها `ClaimIdentifier`. |
| `POST /v1/identifiers/resolve` | حل إدخال معرف طبيعي إلى الحساب المرتبط عندما يكون هناك مطالبة نشطة. |
| `GET /v1/identifiers/receipts/{receipt_hash}` | ابحث عن طلب تحديد الهوية المتواصلة باستخدام رسالة hash للدراسة ودعم الأدوات. |

دائماً تحقق من عقدة الهدف `/openapi` أو `/openapi.json` وثيقة قبل
المتاحة تعتمد على بناء العقدة
الملف الشخصي للشبكة

## وقت تشغيل العقدة {#node-runtime}

Torii إنه في العملية RAM-LFE يتم تشكيل وقت التشغيل تحت
`torii.ram_lfe.programs[*]`, المفتاح: `program_id`. كل برنامج تم تشكيله
يجب أن تتطابق مع التزام السياسة على السلسلة ويجب أن توفر وقت تشغيل
المواد اللازمة لتقييم وإثبات الإيصالات.
نفس وقت التشغيل؛ لا تتطلب إعداد منفصل للتعرف على محلول
سطح.

لا يكفي تسجيل سياسة على السلسلة بمفردها.
أيضا تعرض عائلة الطريق ويكون لها مواد متطابقة وقت التشغيل
البرامج التي يتوقع تنفيذها.

## رصيف الحراسة التشغيلية {#operational-guardrails}

- تسجيل السياسات غير نشطة، التحقق من البيانات المعدنية العامة، ثم تنشيطها.
- أبقي أسرار المراقب مخفية، وسرّات توقيع القرار، BFV السرية
  المواد من الوثائق، السجلات، المعاملات، والكليات العملاء.
- لا تضع تعريفات خام في أسماء مستعار للحسابات أو بيانات المعاملة
  الأحداث، أو مجالات الدولة العالمية.
- التحقق من الإيصالات من جانب العميل قبل إرسال تعليمات على مستوى أعلى
  عندما SDK يعرض المؤكد.
- استخدم حقول انتهاء الصلاحية حيث لا ينبغي أن تبقى الإيصالات القديمة صالحة إلى الأبد.
- تدوير عن طريق تسجيل برنامج جديد أو سياسة تحديد الهوية، والعملاء المهاجرين،
  وإيقاف السياسة القديمة بمجرد تدفق الإيصالات الجديدة

## الموضوعات ذات الصلة {#related-topics}

- [رسوم الرعاية الخاصة بمجال البيانات الخاص](/ar/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii النقاط النهائية](/ar/reference/torii-endpoints.md#app-and-sora-route-families)
- [المعاملات المجهولة](/ar/blockchain/anonymous-transactions.md)
