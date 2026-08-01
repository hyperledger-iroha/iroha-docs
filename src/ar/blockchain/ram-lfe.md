---
translation_locale: ar
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE تعني تقييم وظيفة لاكونية آلة الوصول العشوائي. في Iroha ، هي طبقة عامة من الوظائف الخفية للبرامج التي تكون سياساتها العامة على السلسلة ولكن يجب عدم كتابة المدخلات المقدمة المنطقية أو السرية أو الخام إلى دولة العالم. يتم استخدامه من خلال تدفقات تحديد SORA Nexus ، مثل البحث عن الهاتف الخاص أو البريد الإلكتروني ، ويمكن أيضًا تعريفه كمساعد عام لتنفيذ البرنامج Torii عندما يتيح ملف تعريف العقد المسارات التي تواجه التطبيق.

تخزين السلسلة بيانات metadata التزام السياسة والتحقق من الاستلام. يقوم مصمم أو Torii بتقييم البرنامج المخفي ، ويرد فقط الناتج المسموح به ، ويشمل استلامًا يمكن للعملاء أو أدوات الدعم أو تعليمات الكتيبة التحقق منه ضد سياسة المسجلة.

## الإسم {#naming}

المشاركة في الإسم مهمة:

|المدة |المعنى|
| --- | --- |
|`ram_lfe` |مجردة الوظيفة الخفية الخارجية: سياسات البرنامج والالتزامات وإيصالات التنفيذ ووضع التحقق من الإيصالات. |
|`BFV` |مخطط تشفير براكرسكي / فان-فركوتيرن المثلي الذي يستخدمه خلفيات المدخل المشفرة RAM-LFE. |
|`ram_fhe_profile` |BFV - البيانات الأساسية الخاصة بجهاز التنفيذ المشفر المبرمج. إنه ليس اسم ثان لـ RAM-LFE. |

في نموذج البيانات، `RamLfeProgramPolicy` و `RamLfeExecutionReceipt` هي RAM-LFE النوع. BFV المعلمات، غلافات النص المشفرة، والخفية RAM-FHE ملف برنامج ينتمي إلى الخلفية التنفيذية المشفرة المستخدمة من قبل سياسة.

## ما يسجل {#what-it-records}

يتم تسجيل سياسة برنامج RAM-LFE عالمياً من قبل `program_id`.

- الحساب المالك الذي يمكنه تنشيط أو تعطيل، أو تغيير السياسة بطريقة أخرى
- الخلفية التي يتم الإعلان عنها للعملاء
- نمط التحقق من الإيصالات، إما `signed` أو `proof`
- الالتزام بالبيانات المختفية للبرنامج والسرية للمقيم
- المفتاح العام لـ Resolver للإيصالات الموقعة
- البيانات الأساسية العامة المشفرة، مثل معايير BFV و `ram_fhe_profile`
- علامة `active` التي تراقب ما إذا كانت السياسة قادرة على إصدار إيصالات جديدة

لا يتم تخزين السر الخفي، وقيمة تعريف النص الصريح، وجسم البرنامج المخفي في حالة العالم. يجب على العملاء التعامل مع الالتزامات والهاشات غير الشفافة، والهاشة الإيصالات، والنصوص المشفرة، وتضخيم البرمجيات كقيم بروتوكول غير الشفاف.

## الخلفيات {#backends}

الدعم الحالي RAM-LFE يركز على ثلاثة تحديدات الخلفية:

|الخلفية |استخدام |
| --- | --- |
|`hkdf-sha3-512-prf-v1` |التقييم المرتبط بالالتزام PRF. |
|`bfv-affine-sha3-256-v1` |BFV مدعومة التقييم السري على فتحات المعرف مشفرة.|
|`bfv-programmed-sha3-256-v1` |BFV المدعومة التنفيذ المبرمج عبر السجلات المشفرة وممرات الذاكرة. |

لسياسات المعرف، البرمجة BFV الخلفية هي المسار الحديث المهم. فإنه يسمح المحفظة تشفير المدخلات الطبيعية محليا، ويسمح لحل تقييم دون رؤية تحديد عام في المعاملة، ويرجع إيصال يربط الهاش المخرج بسياسة البرنامج المسجلة.

## الرياضيات {#math}

يصف هذا القسم الجبر على مستوى التنفيذ المستخدم من قبل الرمز الحالي RAM-LFE. إنه ليس دليلاً أمنياً؛ بل هو النص المحدد ونموذج التقييم المشفر الذي يجب أن يتفق عليه السياسات والإيصالات والعملاء.

### الإشارة {#notation}

اسمحوا:

- \(H(m)\) تكون Iroha `Hash::new(m)`: Blake2b-32 فوق `m`، مع أقل جزءا هاما من البايت النهائي مضطر إلى `1`.
- \(N(x)\) يكون رمز Norito القنوني لـ `x`.
- \(a \parallel b\) المتوسط من سلسلة البايت.
- \(\operatorname{le64}(i)\) يكون رمزية 8 بتات صغيرة من عدد كامل غير مؤشر.
- \(s\) أن يكون القرار السري تحتفظ خارج الدولة العالمية.
- \(P\) تكون معايير السياسة العامة.
- \(A\) طلب البيانات المرتبطة.
- \(x\) يجب أن تكون بايت إدخال طبيعية أو غلاف إدخال مشفرة مرموزة Norito، اعتمادا على الخلفية.

RAM-LFE يستخدم الحشيشات المنفصلة عن المستوى. الصيغة أدناه تسمي المستويات حسب الغرض؛ سلسلة البايت الحالية هي: .

|الرمز |سلسلة النطاقات|
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

### الالتزام السياسي {#policy-commitment}

الالتزام بالسياسة يربط المعلمات العامة وسرية حل الخفية إلى نهاية خلفية. أولاً، يتم الالتزام السر بشكل منفصل:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

ثم يتم تشفير نسخة السياسة الكاملة:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

والسياسة المنشورة هي:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

السلسلة `PolicyCommitment` هي:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

يقوم التقييم بإعادة حساب نفس القيمة من سرية وقت التشغيل. إذا كان الهاش الذي تم إعادة احتسابه يختلف، فإن التقييم يفشل مع عدم مطابقة الالتزام.

### HKDF-SHA3-512 الخلفية {#hkdf-sha3-512-backend}

بالنسبة إلى `hkdf-sha3-512-prf-v1` ، فإن الخروج هو المدخل المعتاد نفسه، ولكن المعرف غير الشفاف وحش الإيصالات هي خروجيات مرتبطة بسرية PRF.

نسخة الطلب هي:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

المفتاح HKDF الملح والصورة العشوائية هو:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

يتم توسيع المواد الغير مرئية وتشغيلها:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

إضافة إلى ذلك، يربط مواد الإيصالات الهوية غير الشفافية:

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

يرد الخلفي:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV مقدمة {#bfv-primer}

BFV هو مخطط تشفير homomorphic القائم على الشبكة. "Homomorphic" يعني أن البرنامج يمكن إضافة وتضاعفة القيم المشفرة، وبعد فك التشفير، للحصول على نفس النتيجة كما لو أنه قام بإجراء الإضافات والتضاعفات على قيم النص الصريح.

لـ RAM-LFE، يستخدم BFV كآلية إدخال مشفرة:

1. محفظة تعاديل قيمة خاصة، مثل رقم الهاتف أو عنوان البريد الإلكتروني.
2. المحفظة تحول البايت إلى فتحات صغيرة من الأعداد الكاملة.
3. يتم تشفير كل فتحة باستخدام مفتاح الحل العام BFV.
4. يُقيّم وقت تشغيل الحل البرنامج المخفي على تلك النصوص المشفرة.
5. وقت تشغيل يفكّر فقط إصدار البرنامج المخفي ويعلم أو يؤكد إيصال.

BFV هو الحساب الدقيق للأعداد الكاملة ، وليس الحساب التقريبي. هذا هو السبب في أنه يلائم بشكل أفضل للبايتات المعرفية والشرائح الصغيرة الحسابات بدلا من استنتاج النموذج في نقطة عائمة Iroha التيار BFV الاستخدام، كل فتحة مشفرة تحمل واحدة القيمة المتعددة modulo \(t\), عادة بايت أو حقل طول بايت. النص المشفر نفسه يعيش modulo عدد كامل أكبر بكثير \(q\). الفجوة بين \(q\) و \(t\) يمنح مساحة لتفكيك الضوضاء التي تسببها التشفير والعمليات المثلية.

يحتوي النص الرمزي BFV على اثنين من المكونات المتعددة:

$$
c=(c_0,c_1)
$$

المفتاح السري هو تعدد آخر \(s_k\). يجمع تشفير المكونات:

$$
v = c_0 + c_1s_k
$$

إذا تم تشكيل النص المشفر بشكل صحيح والضجيج لا يزال صغيرًا بما فيه الكفاية ، فإن \(v\) قريب من النص الصريح المقياسي. يستعيد الجولة معدل النص الصافي modulo \(t\). الملكية المفيدة هي أن عمليات نص المشفر تحافظ على هذه الهيكل:

|عمليات بسيطة |عمليات النص المشفر |
| --- | --- |
|\(m+n\) |إضافة مكونات النص المشفر. |
|\(m+\alpha\) |إضافة ثابتة النص الصريح المقياس إلى \(c_0\). |
|\(\alpha m\) |مقياس كل من مكونات النص المشفرة بواسطة \(\alpha\). |
|\(mn\) |مضاعفة تعدد النص المشفر، إعادة مقياسها، ثم إعادة التخطيط. |

التضاعف هو العملية المكلفة. إن منتج من نصين تشفير مزدوجين يخلق بطبيعة الحال نص تشفير ثلاثي مكونات يقوم بتشفير مع \(1\) ، \(s_k\) ، و \(s_k^2\). يستخدم Relinearization مفتاح التقييم المنشور لتثبيت مصطلح \(s_k^2\) مرة أخرى في نص رمزي عادي مزدوج. وهذا يحافظ على إضافة وتضاعفات لاحقة باستخدام نفس شكل نص رمزي.

BFV أيضا "مرتفعة": كل عملية مشفرة تستهلك بعض ميزانية الضوضاء. هذا التنفيذ لا يقوم بتشغيل النصوص المشفرة لتجديد تلك الميزانية. بدلاً من ذلك ، ينشر RAM-LFE `ram_fhe_profile` الصغير ويقبل فقط شكل برنامج مخفي محدود. هذا يحافظ على التقييم داخل عمق مجموعة المعايير المدعومة. يسمح الملف الشخصي المبرمج الحالي بمعدل سجل ثابت ، ومعدل مسار الذاكرة الثابت ، وعلى أقصى حد واحد من مضاعفة النص الرقمية إلى النص الرقمي لكل خطوة مبرمة.

في هذا RAM-LFE التصميم، BFV يخفي إدخال العميل من بيانات الكتب العامة ومن المراقبين الذين يرون فقط المعاملة أو الحمولة المفيدة للخطوط. هذا لا يعني أن السلسلة تنفيذ برامج مشفرة تعسفية عن طريق نفسها. Torii الحل التشغيل لا يزال يمتلك BFV المواد السرية، تقييم البرنامج المخفي الذي تم تشكيله، وتشفير الخروج المسموح به، وتشهد على النتيجة. ثم يؤكد الكتيب الإثبات ضد الالتزام بالسياسة على السلسلة ويقوم بحل المفاتيح العامة أو البيانات الأساسية للدليل.

يختار حالة استخدام المحدد تمثيلاً بسيطاً عن قصد. يتم تشفير سلسلة طبيعية على النحو التالي:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

كل عنصر مُشفّر كعنصر خاص به BFV هذا الشكل يجعل التطبيع والتحقق من الملف صريح يسمح للمحفظات ببناء طلبات مشفرة من المعلمات العامة ، ويسمح للمحلّل بتقنيات المدخلات المشفرة المتساوية إلى نسخة ثابتة من الإيصالات.

### BFV نموذج الخاتم {#bfv-ring-model}

تستخدم الخلفيات BFV حلقة متعددة الأشكال السلبية:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

وخط الصفحة البسيطة:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

حيث:

- \(n\) هو `polynomial_degree` ، قوة من اثنين
- \(q\) هو `ciphertext_modulus`
- \(t\) هو `plaintext_modulus`
- \(q > t\) و \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

يتم تشفير متجهات معدل النص البسيط عن طريق قياس كل معدل:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

كشف المركز يرفع كل معدل من:

$$
v = c_0 + c_1 s_k \in R_q
$$

ثم يقوم بإعادته إلى \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

هنا \(s_k\) هو BFV المفتاح السري المتعدد، وليس الخارجي RAM-LFE الحل السري \(s\).

### BFV الجيل الرئيسي {#bfv-key-generation}

بالنسبة إلى إدخال المعرف المشفر، فإن مادة مفتاح BFV هي تحديدية لكل بيانات سرية ومرتبطة بالحلول:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

يتم زراعة BFV RNG على النحو:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

عينات المولدات الرئيسية:

- \(s_k \in \{-1,0,1\}^n\) ، تمثيل modulo \(q\)
- \(a \leftarrow R_q\) بشكل متساوي
- \(e \in \{-1,0,1\}^n\)

المفتاح العام هو:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

لتحديد خطية أخرى، دعونا \(s_k^2\) أن تكون منتج الخاتم في \(R_q\). لكل قاعدة\(B\) رقم \(j\), العينة \(a_j\) بشكل متساوي و \(e_j\) من التوزيع الصغير، ثم نشر:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

الجمهور BFV تحتوي البيانات الأساسية السياسية على \((n,q,t,B)\) ، المفتاح العام، و `max_input_bytes`. (الـ) BFV المفتاح السري ومفتاح إعادة التخطيط يبقى في وقت تشغيل القرار.

### BFV تشفير العمليات {#bfv-encryption-and-operations}

لتشفير متعدد النص البسيط \(m\) ، تبذّل عملية التنفيذ بذور أخرى ChaCha20 RNG من:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

إنه يقطع عينات \(u,e_1,e_2 \in \{-1,0,1\}^n\) ويحسب:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

النص المشفر هو \(c=(c_0,c_1)\).

الإضافة المثليّة هي العنصرية:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

إضافة مقياس النص الصريح \(\alpha\) إلى معدل التغيرات صفر فقط \(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

مضاعفة مع مقياس النص الصريح \(\alpha\) تقيس كلا المكونين:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

بالنسبة لثنين من النصوص المشفرة \(c=(c_0,c _1)\) و \(d=(d_0,d_1)\) ، تقوم مضاعفة النص المشفر أولاً بحساب نص مشفر ذو حجم ثلاث مرات وتعيد كل معدل إلى \(t/q\):

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

جميع المنتجات المذكورة أعلاه هي منتجات الحلقات النيغاسيكلية في \(R_q\). ثم يتم تفكيك \(\tilde c_2\) إلى متعددات الأساسية-\(B\):

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

النتيجة هي مرة أخرى نص رمزي مكونين BFV.

### الكشف الرقميةغلاف النص {#identifier-ciphertext-envelope}

سلسلة إدخال البايت للتعرف:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

يتم تشفيرها في فتحات مستوى:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

وكل الفتحات المتبقية هي صفر حتى `max_input_bytes + 1`. يتم تشفير كل فتحة مقياسية باعتبارها عداد الكلمات العادية من النص الصريح \([m_i]\) .

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

تغطية المعرف المشفرة هي:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

حيث \(M=\mathrm{max\_input\_bytes}\).

### BFV الخلفية المتواصلة {#bfv-affine-backend}

بالنسبة إلى `bfv-affine-sha3-256-v1` ، يستخرج وقت التشغيل أولاً مادة مفتاحية BFV من \(s\) و \(A\). يجب أن تتطابق المعايير العامة المستمدة بدقة مع العياريات العامة المشتركة على السلسلة.

بذور الدائرة المميزة هي:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

من هذه البذور عينات وقت التشغيل، modulo \(t\) ، دائرة صفوف 32:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

حيث \(m_i\) هي فتحات المعرفة المشفرة. من الناحية الهومورفية، يحسب نفس القيمة على نصوص تشفرية:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

يقوم الحل بتشفير كل \(C_j\) ، ويطلب من جميع معايير النص الصريح المتأخر أن تكون صفرًا، ويحول قيم المعايير-الصفر إلى بايتات، ويشكل:

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

### BFV البرمجة الخلفية {#bfv-programmed-backend}

بالنسبة ل `bfv-programmed-sha3-256-v1` ، تتضمن المعايير العامة معايير تشفير معرف BFV بالإضافة إلى هضم برنامج مخفي:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

الملف الحالي RAM-FHE هو:

|الحقل|القيمة |
| --- | --- |
|`profile_version` | `1` |
|`register_count` | `4` |
|`memory_lane_count` | `32` |
|`ciphertext_mul_per_step` | `1` |
|`encrypted_input_mode` |`resolver_canonicalized_envelope_v1` |
|`min_ciphertext_modulus` | \(2^{52}\) |

يتم تشفير إدخال النص الصريح الذي تم تقديمه إلى Torii في نفس غلاف BFV قبل التنفيذ. البذور التحديدية لتشفير جانب الخادم هو:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

بالنسبة إلى المدخلات المشفرة المقدمة خارجيًا ، يقوم القرار بتشفير غلاف التعريف وإعادة تشفيره على هذا الغلاف التحديدي قبل تنفيذها. يحافظ هذا التشريح على استقرار هاشات الاستقبال عبر نصوص تشفرية متساوية من الناحية الدلوية BFV .

يتم استنباط مسارات الذاكرة المشفرة الأولية من:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

لكل من 32 ممر، عينات وقت التشغيل \(_j \in [0,t)\) وتخزين BFV تشفير النص المشفر \(r_j\). ينفذ البرنامج المخفي بعد ذلك على سجلات مشفرة وذاكرة مشفرة:

|التعليمات |الجبر |
| --- | --- |
|`LoadInput(dst, i)` |\(R_{\mathrm{dst}} \leftarrow C_i\) |
|`LoadState(dst, j)` |\(R_{\mathrm{dst}} \leftarrow S_j\) |
|`StoreState(j, src)` |\(S_j \leftarrow R_{\mathrm{src}}\) |
|`LoadConst(dst, a)` |\(R_{\mathrm{dst}} \leftrow \operatorname{Enc}(a)\) |
|`Add(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
|`AddPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
|`SubPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
|`MulPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
|`Mul(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_aR_b\) ، ثم إعادة التخطيط |
|`SelectEqZero(dst, cond, z, nz)` |فك تشفير \(R_{\mathrm{cond}}\) ؛ اختر \(R_z\) عندما يكون صفر، وإلا \(R_{nz}\). |
|`Output(src)` |إضافة \(R_{\mathrm{src}}\) إلى قائمة سجل المخرجات. |

بعد الانتهاء من شريط التعليمات ، يقوم القرار بتشفير كل سجل خروج ، وتحويل معدل الصفر إلى بايت ، وتربط تلك البايت:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

الحشيشات العامة المبرمجة للخلفية هي:

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

الشريط التعرفي المبرمج الافتراضي لديه 64 فتحة إدخال. لكل فتحة \(i\) ، فإنه يحمل فتحة الإدخال، ويحمل طريق الذاكرة \(i \bmod 32\)، ويضيفها، وتخرج النتيجة:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### أوراق الناتج والإيصالات {#output-hashes-and-receipts}

لا يوقع إيصال التنفيذ العام RAM-LFE على الناتج الخام. إنه يوقّف على الاختراق المخرج:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

بالنسبة لرسائل تنفيذ Torii RAM-LFE، البيانات المرتبطة هي بايتات تحديد البرنامج القنوني:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

الحمولة المفيدة التي تم التوقيع عليها هي:

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

لنظام `signed`:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

تتحقق التحقق من التوقيع مع `resolver_public_key` وترفض الإيصالات ما لم تحصل جميع هذه المساواة على:

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

إذا قام المتصل بتقديم `output_hex` ، يقوم المحقق أيضًا بفحص:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

بالنسبة لنمط `proof` ، يحمل الشهادة غلافًا إثباتيًا بدلاً من توقيع. تتحقق التحقق من أن الخلفية الإثباتية وتعرف الدائرة والهاشش للخطط المدخلة العامة والتحقق من المفتاح الهاشش والمحاكمات العامة المعروضة تتطابق مع البيانات الأساسية للتحقق من الإثبات والتحميل الرسوم المرموز. دعونا:

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

الحالات العامة المتوقعة هي أربع أعمدة من عنصر واحد. يحتوي العمود \(j\) على بايت \(h_{8j}\ldots h_{8j+7}\) يليها 24 بايت صفر:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### تحديد المعلومات {#identifier-projection}

لا يستخدم قرار المحدد الخلفي العام `opaque_hash` كمحدد حساب غير مرئي يواجه المستخدم. فإنه ينشر الهاشة الإخراجية RAM-LFE من خلال نطاقات محددة للمحدد:

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

علامة `IdentifierResolutionReceipt` على حمولة فائدة من مستوى أعلى:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

للوصولات الموقعة للتعرف:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

لا يقبل `ClaimIdentifier` الإيصالات إلا عندما تكون التوقيع أو الدليل صالحًا ، وتتطابق حمولة تنفيذ RAM-LFE المضمنة مع سياسة البرنامج المشار إليها ، و`uaid` و `account_id` هي الالتزامات التي يتم مطالبت بها.

## تدفق التنفيذ {#execution-flow}

تنفيذ عام RAM-LFE يتبع هذا الشكل:

1. الإدارة أو سجلات المشغل `RamLfeProgramPolicy`.
2. المالك يقوم بتفعيل السياسة
3. يقرأ العميل البيانات الوصفية للسياسة العامة من Torii.
4. يقوم العميل بإرسال نموذج إدخال واحد بالضبط إلى القرار: نص بسيط `input_hex` أو غلاف إدخال مشفر BFV.
5. وقت التشغيل يقيّم البرنامج المخفي ويعود `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash`, و a `RamLfeExecutionReceipt`.
6. يتحقق العميل أو الجهة الخلفية من الإيصالات بموجب السياسة المنشورة، ويتحقق اختياريًا من أن `output_hex` المرجع يختلط مع `output_hash` الإيصالات.
7. إرشادات مستوى أعلى، مثل `ClaimIdentifier`، يمكن أن تضم الإيصالات المصرح بها بدلاً من تضمين المدخل الخام.

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

## سياسات تحديد الهوية {#identifier-policies}

سياسات التعرف هي استخدام ملموس ل RAM-LFE. فإنها تضيف مساحة أسماء الأعمال وقاعدة التطبيع فوق سياسة البرنامج العامة:

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

تستخدم طبقة المعرف إيصال RAM-LFE لربط:

- `policy_id`
- العلامة غير الشفافة المستمدة من الوظيفة الخفية
- الاختيار `receipt_hash`
- حساب UAID
- القنوني `account_id`
- الحمل المفيد للتنفيذ العام RAM-LFE

للحصول على إدخال المستخدم، حافظ على أسماء مستعار الحساب منفصلة عن معرفات خاصة. الأسماء المستعار هي أسماء عامة؛ يجب أن تتدفق أرقام الهاتف وعناوين البريد الإلكتروني والقيم المماثلة من خلال سياسات تحديد الهوية وإيصالاتها.

## Torii طرق {#torii-routes}

عندما يتم تمكين عائلة الطرق التي تواجه التطبيقات، Torii تعرض RAM-LFE ومساعدات تحديد الهوية:

|الطريق|الغرض|
| --- | --- |
|`GET /v1/ram-lfe/program-policies` |إدراج سياسات البرنامج النشطة وغير النشطة RAM-LFE و البيانات الوصفية العامة. |
|`POST /v1/ram-lfe/programs/{program_id}/execute` |تنفيذ برنامج واحد من `input_hex` أو `encrypted_input` وإرجاع الهاشات الخارجة بالإضافة إلى إيصال غير حكومي. |
|`POST /v1/ram-lfe/receipts/verify` |التحقق من `RamLfeExecutionReceipt` مقابل السياسة المنشورة، ومقارنة اختياريًا `output_hex` إلى `output_hash`. |
|`GET /v1/identifier-policies` |قم بإدراج سياسات المعرف، وأساليب التطبيع، ومفاتيح القرار، و بيانات البيانات المشفرة. |
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt` |إصدار الإيصالات التي يمكن للمستخدم تضمينها في `ClaimIdentifier`. |
|`POST /v1/identifiers/resolve` |حل إدخال تعريف طبيعي إلى الحساب المرتبط عندما يكون هناك مطالبة نشطة. |
|`GET /v1/identifiers/receipts/{receipt_hash}` |البحث عن طلب تحديد المواصفات المستمرة بواسطة إرسال رسائل لتحقيق الأدوات ودعم. |

تحقق دائمًا من مستند `/openapi` أو `/openapi.json` للعقدة المستهدفة قبل البناء ضد هذه الطرق. يعتمد التوافر على بناء العقدة وملف الشبكة.

## وقت تشغيل العقدة {#node-runtime}

يتم تكوين وقت تشغيل Torii في العملية RAM-LFE تحت `torii.ram_lfe.programs[*]` ، وترتيبها بواسطة `program_id`. يجب أن يتناسب كل برنامج تم تكوينه مع الالتزام بالسياسة على السلسلة ويجب أن يوفر المواد اللازمة لتقييم وإقرار الإيصالات. تستخدم طرق الكشف نفس الوقت التشغيلي؛ لا تتطلب مساحة تشكيل الكشف عن الحل منفصلة.

لا يكفي تسجيل سياسة على السلسلة بمفردها. يجب أن يعرض عقد الهدف أيضًا عائلة الطرق ويكون لديه مواد وقت تشغيل متطابقة للبرامج التي يتوقع تنفيذها.

## خطوط الحراسة التشغيلية {#operational-guardrails}

- تسجيل السياسات غير نشطة، التحقق من البيانات المباشرة، ثم تفعيلها.
- أبقوا أسرار المقيّم مخفية، مفاتيح توقيع القرار، و BFV المواد السرية خارج الوثائق، سجلات، المعاملات، والعملاء.
- لا تضع المعرفات الخام في أسماء مستعار الحسابات أو بيانات المعاملة أو الأحداث أو حقل دولة العالم.
- التحقق من الإيصالات من جانب العميل قبل إرسال تعليمات على مستوى أعلى عندما يعرض SDK مؤكد.
- استخدم حقل انتهاء الصلاحية حيث لا ينبغي أن تبقى الإيصالات القديمة صالحة إلى الأبد.
- تدوير عن طريق تسجيل برنامج جديد أو سياسة تحديد الهوية، انتقال العملاء، وتعطيل السياسة القديمة بمجرد تدفق إيصالات جديدة.

## الموضوعات ذات الصلة {#related-topics}

- [رسوم الرعاية عن مساحة بيانات خاصة ](/ar/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii نقاط نهاية](/ar/reference/torii-endpoints.md#app-and-sora-route-families)
- [المعاملات المجهولة](/ar/blockchain/anonymous-transactions.md)
