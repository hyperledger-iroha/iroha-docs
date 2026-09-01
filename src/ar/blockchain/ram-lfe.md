---
translation_locale: ar
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 66436bfdcdfea9bcd52834436dc8b6abe9812549583e6bfca06cbe73d5f75d35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# RAM-LFE {#ram-lfe}

RAM-LFE يرمز إلى تقييم دالة لكونية على آلة الوصول العشوائي. في Iroha، هي طبقة الدالة المخفية العامة للبرامج التي تكون فيها السياسة العامة على السلسلة ولكن منطق المقيم أو السر أو المدخلات الأولية لا يجب كتابتها في حالة العالم. يُستخدم من قبل تدفقات معرف SORA Nexus، مثل البحث عن الهاتف أو البريد الإلكتروني الخاص، ويمكن أيضًا عرضه كمساعد تنفيذ برنامج عام Torii عندما يُمكن لملف تعريف العقدة المسارات الموجهة للتطبيق.

تخزن السلسلة قيمة الالتزام التشفيري للسياسة وبيانات التحقق من سجل نتائج البروتوكول. يقوم محلل أو بيئة تنفيذ البرمجيات Torii بتقييم المخفي البرنامج، يُرجع فقط المخرجات المسموح بها، ويرفق سجل نتيجة البروتوكول الذي يمكن للعملاء أو أدوات الدعم أو تعليمات دفتر الأستاذ البلوكتشين التحقق منه مقابل السياسة المسجلة.

## التسمية {#naming}

انقسام التسمية مهم:

|مصطلح|معنى|
| --- | --- |
| `ram_lfe` |التجريد الوظيفي المخفي الخارجي: سياسات البرنامج، قيم الالتزام التشفيري، سجلات نتائج بروتوكول التنفيذ، ووضع التحقق من سجلات نتائج البروتوكول.|
| `BFV` |نظام التشفير المتماثل Brakerski/Fan-Vercauteren المستخدم من قبل واجهات خلفية RAM-LFE ذات المدخلات المشفرة.|
| `ram_fhe_profile` |البيانات الوصفية المحددة لـ BFV للآلة المنفذة المشفرة المبرمجة. إنها ليست اسماً بديلاً لـ RAM-LFE.|

في نموذج البيانات، `RamLfeProgramPolicy` و`RamLfeExecutionReceipt` هما من أنواع RAM-LFE. تنتمي معلمات BFV وحاويات بيانات النص المشفر وملف تعريف البرنامج المخفي RAM-FHE إلى واجهة الخلفية للتنفيذ المشفر المستخدمة بواسطة السياسة.

## ما يسجله {#what-it-records}

سياسة برنامج RAM-LFE مسجلة عالميًا من قبل `program_id`. تحتوي السياسة على:

- حساب المالك الذي يمكنه تفعيل أو تعطيل أو تعديل السياسة بأي شكل من الأشكال
- الواجهة الخلفية التي تم الإعلان عنها للعملاء
- وضع التحقق من سجل نتائج البروتوكول، إما `signed` أو `proof`
- قيمة التزام تشفيرية لبيانات البرنامج المخفية وسر المقيم
- المفتاح العام للمحلل لسجلات نتائج البروتوكول الموقّعة
- بيانات وصفية اختيارية للمدخلات المشفرة العامة، مثل معلمات BFV و `ram_fhe_profile`
- علم `active` يحدد ما إذا كانت السياسة يمكن أن تصدر سجلات نتائج البروتوكول الجديدة

السر المخفي، وقيمة معرف النص الصريح، وجسم البرنامج المخفي ليست مخزنة في حالة العالم. يجب على العملاء التعامل مع قيم الالتزام التشفيري، والهاشات التشفيرية الغامضة، وهاشات التشفير لسجلات نتائج البروتوكول، والنصوص المشفرة, وبرمجة ملخصات التشفير كقيم بروتوكول غامضة.

## الخلفيات {#backends}

الدعم الحالي لـ RAM-LFE يركز على ثلاثة معرفات خلفية:

|الخلفية|استخدم|
| --- | --- |
| `hkdf-sha3-512-prf-v1` |تقييم مرتبط بالالتزام PRF.|
| `bfv-affine-sha3-256-v1` |BFV-دعم تقييم أفيني سري فوق فتحات المعرف المشفر.|
| `bfv-programmed-sha3-256-v1` |تنفيذ مبرمج مدعوم بـ BFV عبر سجلات مشفرة ومسارات تنفيذ الذاكرة.|

بالنسبة لسياسات المُعرف، فإن الواجهة الخلفية المبرمجة BFV هي الطريق الحديث المهم. فهي تتيح للمحافظ تشفير الإدخال الموحد محليًا، وتتيح للمُحلل التقييم دون رؤية معرف عام في المعاملة، ويعيد سجل نتيجة البروتوكول الذي يربط التجزئة التشفيرية الناتجة بسياسة البرنامج المسجلة.

## الرياضيات {#math}

يصف هذا القسم الجبر على مستوى التنفيذ المستخدم في الشيفرة الحالية RAM-LFE. إنه ليس دليلاً على الأمان؛ بل هو النسخة المحررة الحتمية ونموذج التقييم المشفر الذي يجب أن تتفق عليه السياسات وسجلات نتائج البروتوكول والعملاء.

### التدوين {#notation}

ليكن:

- \(H(m)\) يكون Iroha `Hash::new(m)`: Blake2b-32 على `m`، مع إجبار البت الأقل أهمية في البايت النهائي على أن يكون `1`.
- \(N(x)\) يكون الترميز القياسي للبروتوكول الفردي لـ Norito من `x`.
- \(a \parallel b\) تعني ربط سلسلة البايت.
- \(\operatorname{le64}(i)\) يكون التشفير بثمانية بايتات بترتيب البايتات الصغير لعدد صحيح غير موقع.
- \(s\) كن سر المحلل المحتفظ به خارج حالة العالم.
- \(P\) أن تكون معلمات السياسة العامة.
- \(A\) أن يكون البيانات المرتبطة بالطلب.
- \(x\) يمكن أن يكون بيانات الإدخال المُطَبَّعَه أو حاوية بيانات الإدخال المُشفَّرة المُرمَّزة بـ Norito، اعتمادًا على الواجهة الخلفية.

RAM-LFE يستخدم تجزئات تشفيرية مفصولة حسب المجال. الصيغ أدناه تسمي المجالات حسب الغرض؛ وسلاسل البايت الحالية لها هي:

|رمز|سلسلة النطاق|
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

### قيمة الالتزام التشفيري للسياسة {#policy-commitment}

قيمة الالتزام التشفيري للسياسة تربط المعلمات العامة والسر المخفي للمحلل بالخلفية. أولاً، يتم ربط السر تشفيرياً بشكل منفصل:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

ثم يتم ترميز نص السياسة الكامل:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

وهش التشفير للسياسة المنشورة هو:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

السلسلة على الشبكة `PolicyCommitment` هي:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

إعادة التقييم تعيد حساب نفس القيمة من السر في بيئة تنفيذ البرنامج. إذا كان تجزئة التشفير المعاد حسابها مختلفة، يفشل التقييم بسبب عدم تطابق قيمة الالتزام التشفيري.

### HKDF-SHA3-512 الواجهة الخلفية {#hkdf-sha3-512-backend}

بالنسبة لـ `hkdf-sha3-512-prf-v1`، فإن الناتج هو الإدخال المعياري نفسه، لكن المعرف الغامض وسجل نتيجة البروتوكول الناتج عن التجزئة التشفيرية هي نواتج مرتبطة بالسر PRF.

نسخة الطلب هي:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

الملح HKDF والمفتاح الزائف العشوائي هما:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

يتم توسيع المادة الغامضة وتجزيئها:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

سجل نتيجة البروتوكول المادة يربط كذلك معرف الغامض:

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

الخلفية تُرجع:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV الأساس {#bfv-primer}

BFV هو نظام تشفير متناظر قائم على الشبكات. كلمة "متناظر" تعني أن البرنامج يمكنه جمع وضرب القيم المشفرة، وبعد فك التشفير، يحصل على نفس النتيجة كما لو كان قد أجرى الجمع والضرب على القيم النصية الأصلية.

بالنسبة لـ RAM-LFE، يُستخدم BFV كآلية إدخال مشفر:

1. تقوم المحفظة بتطبيع قيمة خاصة، مثل رقم الهاتف أو عنوان البريد الإلكتروني.
2. يقوم المحفظة بتحويل البايتات إلى فتحات أعداد صحيحة صغيرة.
3. كل فتحة مشفرة بمفتاح BFV العام للموصل.
4. يقوم بيئة تنفيذ برنامج الحل بتحليل البرنامج المخفي فوق تلك النصوص المشفرة.
5. يقوم بيئة تنفيذ البرمجيات بفك تشفير مخرجات البرنامج المخفية فقط وتوقيع أو إثبات سجل نتائج البروتوكول.

BFV هو حساب صحيح دقيق، وليس حسابًا تقريبيًا. لهذا السبب هو أكثر ملاءمة لتحديد البايتات والحسابات المعيارية الصغيرة من استنتاج نموذج النقطة العائمة. في استخدام BFV الحالي لـ Iroha، كل خلية مشفرة تحمل قيمة قياسية واحدة بمعامل \(t\)، وعادةً ما تكون بايت أو حقل بطول بايت. النص المشفر نفسه يعيش باقي القسمة على عدد صحيح أكبر بكثير \(q\). الفجوة بين \(q\) و\(t\) توفر مساحة لفك التشفير للضوضاء التي تنتج عن التشفير والعمليات التماثلية.

للنص المشفر BFV مكونان كثيرا الحدود:

$$
c=(c_0,c_1)
$$

المفتاح السري هو كثير حد آخر \(s_k\). يجمع التشفير مكوناته:

$$
v = c_0 + c_1s_k
$$

إذا تم تشكيل النص المشفر بشكل صحيح وكان الضجيج لا يزال صغيرًا بما فيه الكفاية، فإن \(v\) قريب من النص الأصلي بعد التدرج. التقريب يستعيد معامل النص الأصلي وفقًا لـ \(t\). الخاصية المفيدة هي أن عمليات النص المشفر تحافظ على هذا الهيكل:

|عملية بسيطة|عملية النص المشفر|
| --- | --- |
| \(m+n\) |أضف مكونات النص المشفر.|
| \(m+\alpha\) |أضف ثابت نص عادي مع مقياس إلى \(c_0\).|
| \(\alpha m\) |قم بمقياس كلا مكوني النص المشفر بواسطة \(\alpha\).|
| \(mn\) |اضرب كثيرات الحدود المشفرة، أعد التحجيم، ثم أعد التحويل إلى خطي.|

الضرب هو العملية المكلفة. ناتج ضرب تشفيرين مكونين من عنصرين ينتج بشكل طبيعي تشفيرًا مكونًا من ثلاثة عناصر يمكن فك تشفيره باستخدام \(1\) و \(s_k\) و \(s_k^2\). تستخدم إعادة التحويل مفتاح تقييم منشور لطي مصطلح \(s_k^2\) مرة أخرى إلى نص مشفر عادي مكون من مكونين. وهذا يحافظ على الجمعات والضرب اللاحقة باستخدام نفس شكل النص المشفر.

BFV أيضًا "مستوى": كل عملية مشفرة تستهلك جزءًا من ميزانية الضوضاء. هذا التنفيذ لا يعيد تمهيد النصوص المشفرة لتحديث تلك الميزانية. بدلاً من ذلك، ينشر RAM-LFE `ram_fhe_profile` صغير ويقبل فقط شكل برنامج مخفي محدد. هذا يحافظ على التقييم ضمن العمق المدعوم لمجموعة المعلمات. يسمح الملف الشخصي المبرمج الحالي بعدد مسجلات ثابت، وعدد قنوات ذاكرة ثابت، وبحد أقصى عملية ضرب واحدة بين النصوص المشفرة لكل خطوة مبرمجة.

في هذا التصميم RAM-LFE، BFV يخفي مدخلات العميل عن بيانات دفتر السجل العام للبلوكتشين وعن المراقبين الذين يرون فقط المعاملة أو حمولة الطريق. هذا لا يعني أن السلسلة تنفذ برامج مشفرة عشوائية بنفسها. بيئة تنفيذ برنامج حل Torii لا تزال تمتلك المادة السرية BFV، وتقوم بتقييم البرنامج المخفي المكوَّن، وتفك تشفير المخرجات المسموح بها، وتشهد على النتيجة. يقوم دفتر الأستاذ البلوكشين بعد ذلك بالتحقق من الشهادة مقابل قيمة الالتزام التشفيري لسياسة السلسلة العامة ومفتاح حل المشكلات العام أو بيانات إثبات الدليل.

حالة استخدام المعرف تختار تمثيلاً بسيطًا عن قصد. يتم ترميز سلسلة مُعَيَّنة بالشكل التالي:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

يتم تشفير كل عنصر كنص مشفر قياسي خاص به BFV. هذا الشكل يجعل من الواضح عملية التطبيع والتحقق من حاوية البيانات، ويسمح للمحافظ بالبناء الطلبات المشفرة من المعلمات العامة، وتسمح للمحلل بتوحيد المدخلات المشفرة المكافئة إلى سجل ناتج بروتوكول مستقر.

### BFV نموذج الحلقة {#bfv-ring-model}

تستخدم واجهات BFV الخلفية حلقة كثير الحدود النغاسية الدائرية:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

والحلقة النصية:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

أين:

- \(n\) هو `polynomial_degree`، قوة للعدد اثنين
- \(q\) هو `ciphertext_modulus`
- \(t\) هو `plaintext_modulus`
- \(q > t\) و \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

يتم ترميز متجهات المعاملات للنصوص الصريحة عن طريق تحجيم كل معامل:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

مركز فك التشفير يرفع كل معامل على:

$$
v = c_0 + c_1 s_k \in R_q
$$

ثم يعيده مرة أخرى إلى \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

هنا \(s_k\) هو كثير الحدود الخاص بالمفتاح السري BFV، وليس المحلّل الخارجي RAM-LFE للمفتاح السري \(s\).

### BFV توليد المفتاح {#bfv-key-generation}

لإدخال معرف مشفر، يكون مادة المفتاح BFV حتمية لكل سر محلل البيانات والبيانات المرتبطة:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

يتم زرع BFV RNG كما يلي:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

عينات منشئ المفتاح:

- \(s_k \in \{-1,0,1\}^n\)، مُمثَّل بالنظر إلى \(q\)
- \(a \leftarrow R_q\) بشكل موحد
- \(e \in \{-1,0,1\}^n\)

المفتاح العام هو:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

لإعادة الخطية، ليكن \(s_k^2\) هو حاصل ضرب الحلقة في \(R_q\). لكل رقم \(B\)-أساسي \(j\)، عين \(a_j\) بشكل متساوي و\(e_j\) من التوزيع الصغير، ثم انشر:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

تحتوي بيانات وصف السياسة العامة BFV على \((n,q,t,B)\)، المفتاح العام، و`max_input_bytes`. يظل المفتاح السري BFV ومفتاح إعادة التخطية في بيئة تنفيذ برنامج المحلل.

### BFV التشفير والعمليات {#bfv-encryption-and-operations}

لتشفير كثير الحدود النصي \(m\)، يقوم التنفيذ بزراعة ChaCha20 RNG آخر من:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

يقوم بأخذ عينات من \(u,e_1,e_2 \in \{-1,0,1\}^n\) ويحسب:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

النص المشفر هو \(c=(c_0,c_1)\).

الجمع التماثلي يتم عن طريق كل مكون على حدة:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

إضافة معامل نص عادي \(\alpha\) إلى المعامل صفر يغير فقط \(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

الضرب بواسطة مقياس نصي عادي \(\alpha\) يضاعف كلا المكونين:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

بالنسبة لنصين مشفرين \(c=(c_0,c_1)\) و \(d=(d_0,d_1)\)، تقوم عملية ضرب النصوص المشفرة أولاً بحساب نص مشفر بحجم ثلاثة وتعيد تحجيم كل معامل بواسطة \(t/q\):

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

جميع المنتجات أعلاه هي منتجات حلقية سالبة في \(R_q\). ثم يتم تحليل \(\tilde c_2\) إلى كثيرات حدود أساسية-\(B\):

$$
\tilde c_2 = \sum_j B^j u_j
$$

وأعيد خطيته:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

النتيجة مرة أخرى هي نص مشفر ذو مكونين BFV.

### مُعرف حاوية بيانات النص المشفر {#identifier-ciphertext-envelope}

سلسلة بايت إدخال معرف:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

يتم ترميزه في فتحات قياسية:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

وجميع الفتحات المتبقية صفرية حتى `max_input_bytes + 1`. يتم تشفير كل فتحة قياسية كمتعدد حدود النص الصريح ذي المعامل صفر \([m_i]\). البذرة المستخدمة لتشفير كل فتحة هي:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

حاوية بيانات المعرف المشفر هي:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

أين \(M=\mathrm{max\_input\_bytes}\).

### BFV الخلفية التقاربية {#bfv-affine-backend}

بالنسبة لـ `bfv-affine-sha3-256-v1`، يقوم بيئة تنفيذ البرمجيات أولاً باستنتاج مادة المفتاح BFV من \(s\) و \(A\). يجب أن تتطابق المعاملات العامة المستنتجة تمامًا مع المعاملات العامة المرتبطة تشفيرياً على السلسلة.

بذرة الدائرة الخطية هي:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

من هذه البذرة، يقوم بيئة تنفيذ البرمجيات بأخذ عينات، بالنظر إلى \(t\)، لمخطط أفيلي مؤلف من 32 صفاً:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

حيث \(m_i\) هي فتحات المعرفات المفككة. بشكل تجميعي، يحسب نفس القيمة على النصوص المشفرة:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

يقوم المحلّل بفك تشفير كل \(C_j\)، ويتطلب أن تكون جميع المعاملات النصية العادية المتبقية صفرًا، ويحوّل القيم الصفرية للمعاملات إلى بايتات، ويكوّن:

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

### BFV الخلفية المبرمجة {#bfv-programmed-backend}

بالنسبة لـ `bfv-programmed-sha3-256-v1`، تُغلف المعلمات العامة معلمات تشفير معرف BFV بالإضافة إلى قيمة موجز تشفير البرنامج المخفي:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

الملف الشخصي الحالي RAM-FHE هو:

|حقل|قيمة|
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

يتم تشفير إدخال النص العادي المقدم إلى Torii في نفس حاوية البيانات BFV قبل التنفيذ. البذرة الحتمية لذلك التشفير على جانب الخادم هي:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

بالنسبة للمدخلات المشفرة المقدمة من الخارج، يقوم المحلّل بفك تشفير حاوية بيانات المعرف ثم يعيد تشفيرها على هذه الحاوية البيانات الحتمية قبل التنفيذ. هذا التوحيد يحافظ على استقرار تجزئات التشفير لسجل نتائج البروتوكول عبر النصوص المشفرة BFV المتساوية دلالياً.

تُشتق مسارات تنفيذ الذاكرة المشفرة الأولية من:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

بالنسبة لكل من 32 مسار تنفيذ، يقوم بيئة تنفيذ البرمجيات بأخذ عينات من \(r_j \in [0,t)\) وتخزين BFV نص مشفر ليشفّر \(r_j\). ثم ينفذ البرنامج المخفي على المسجلات المشفرة والذاكرة المشفرة:

|تعليمات|الجبر|
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | \(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\) |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\)، ثم أعد التخطية الخطية|
| `SelectEqZero(dst, cond, z, nz)` |فك تشفير \(R_{\mathrm{cond}}\)؛ اختر \(R_z\) عندما يكون صفرًا، وإلا فاختر \(R_{nz}\).|
| `Output(src)` |أضف \(R_{\mathrm{src}}\) إلى قائمة سجل الإخراج.|

بعد انتهاء شريط التعليمات، يقوم المحلل بفك تشفير كل سجل إخراج، وتحويل المعامل الصفري إلى بايت، وربط تلك البايتات:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

تتمثل التجزئات التشفيرية العامة المبرمجة في الخلفية في:

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

شريط المعرف المبرمج الافتراضي يحتوي على 64 فتحة إدخال. لكل فتحة \(i\)، يقوم بتحميل فتحة الإدخال، وتحميل مسار تنفيذ الذاكرة \(i \bmod 32\)، وجمعهما، وإخراج النتيجة:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### إخراج تجزئات التشفير وسجلات نتائج البروتوكول {#output-hashes-and-receipts}

سجل نتيجة بروتوكول تنفيذ RAM-LFE العام لا يوقع الإخراج الخام. إنه يوقع تجزئة الإخراج التشفيرية:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

في إيصالات تنفيذ Torii RAM-LFE، تكون البيانات المرتبطة هي بايتات معرّف البرنامج المعياري:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

الحمولة لسجل نتيجة البروتوكول الموقع هي:

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

لوضع `signed`:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

يقوم التحقق بفحص التوقيع مع `resolver_public_key` ويرفض سجل نتيجة البروتوكول ما لم تتحقق كل هذه المساواة:

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

إذا قدم المتصل `output_hex`، يقوم المُحقق أيضًا بالتحقق من:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

بالنسبة لوضع `proof`، يحتوي الإثبات على حاوية بيانات إثبات بدلاً من توقيع. يتحقق التحقق من أن خلفية الإثبات، ومعرّف الدائرة، ومخطط الإدخال العام الهاش التشفيري، وهاش التشفير الخاص بمفتاح التحقق، والحالات العامة المكشوفة تتطابق مع بيانات تعريف مدقق الإثبات وهاش الحمولة المشفّرة للإيصال. لنفترض:

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

الحالات العامة المتوقعة هي أربعة أعمدة ذات عنصر واحد. يحتوي العمود \(j\) على البايتات \(h_{8j}\ldots h_{8j+7}\) يليها 24 بايت صفري:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### إسقاط المعرف {#identifier-projection}

لا يستخدم حل المعرف الخلفية العامة `opaque_hash` كمُعرف حساب غامض موجه للمستخدم. إنه يُسقِط إخراج التجزئة التشفيرية RAM-LFE من خلال مجالات محددة لكل معرف:

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

يوقع `IdentifierResolutionReceipt` على حمولة عالية المستوى:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

لسجلات نتائج بروتوكول المعرف الموقع:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` يقبل سجل نتيجة البروتوكول فقط عندما يكون التوقيع أو الإثبات صالحًا، وبيانات تنفيذ RAM-LFE المضمنة تتطابق مع سياسة البرنامج المشار إليها، و`uaid` و`account_id` هما الكيانان المرتبطان المطالب بهما.

## تدفق التنفيذ {#execution-flow}

يتبع تنفيذ RAM-LFE العام هذا الشكل:

1. الحوكمة أو المشغل يسجل `RamLfeProgramPolicy`.
2. يقوم المالك بتفعيل السياسة.
3. يقوم العميل بقراءة بيانات التعريف الخاصة بالسياسة العامة من Torii.
4. يقدّم العميل نموذج إدخال واحد بالضبط إلى المحلل: نص واضح `input_hex` أو حاوية بيانات إدخال مشفرة BFV.
5. يقوم بيئة تنفيذ البرنامج بتقييم البرنامج المخفي وإرجاع `output_hex` و`output_hash` و`opaque_hash` و`receipt_hash` و`RamLfeExecutionReceipt`.
6. يتحقق العميل أو الخادم الخلفي من الإيصال وفق السياسة المنشورة، ويمكنه أيضًا التحقق من أن هاش `output_hex` المُعاد يساوي `output_hash` في الإيصال.
7. يمكن لتعليمات على مستوى أعلى، مثل `ClaimIdentifier`، تضمين سجل نتيجة البروتوكول المثبت بدلاً من تضمين المدخلات الخام.

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

## سياسات المعرف {#identifier-policies}

سياسات المعرف هي استخدام ملموس لـ RAM-LFE. إنها تضيف نطاقًا تجاريًا وقاعدة تطبيع فوق سياسة برنامج عامة:

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

تستخدم طبقة المعرف سجل نتائج بروتوكول RAM-LFE للربط:

- `policy_id`
- المعرف الغامض المستخلص بواسطة الدالة المخفية
- الحتمية `receipt_hash`
- الحساب UAID
- البروتوكول القياسي الواحد `account_id`
- حِمْل التنفيذ العام RAM-LFE

بالنسبة لعمليات الإعداد التي يواجهها المستخدم، حافظ على فصل أسماء الحسابات المستعارة عن المعرفات الخاصة. الأسماء المستعارة هي أسماء عامة؛ يجب أن تمر أرقام الهاتف وعناوين البريد الإلكتروني والقيم المماثلة عبر سياسات المعرفات وسجلات نتائج البروتوكول.

## Torii الطرق {#torii-routes}

عندما يتم تمكين عائلة المسار الموجه للتطبيق، يكشف Torii عن RAM-LFE ومساعدي المعرف:

|مسار|الغرض|
| --- | --- |
| `GET /v1/ram-lfe/program-policies` |قائمة سياسات برنامج RAM-LFE النشطة وغير النشطة وبيانات التنفيذ العامة.|
| `POST /v1/ram-lfe/programs/{program_id}/execute` | نفّذ برنامجًا واحدًا من `input_hex` أو `encrypted_input` وأعد هاشات المخرجات مع إيصال عديم الحالة. |
| `POST /v1/ram-lfe/receipts/verify` |تحقق من `RamLfeExecutionReceipt` مقابل السياسة المنشورة وبشكل اختياري قارن `output_hex` بـ `output_hash`.|
| `GET /v1/identifier-policies` |سرد سياسات معرفات القوائم، أوضاع التطبيع، مفاتيح المحللات، وبيانات التعريف للإدخال المشفر.|
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` |أصدر سجل نتيجة البروتوكول الذي يمكن للمستخدم تضمينه في `ClaimIdentifier`.|
| `POST /v1/identifiers/resolve` |حل إدخال معرف مهيأ إلى الحساب المرتبط عند وجود مطالبة نشطة.|
| `GET /v1/identifiers/receipts/{receipt_hash}` | ابحث عن مطالبة معرّف محفوظة باستخدام هاش الإيصال، لأغراض التدقيق وأدوات الدعم. |

تحقق دائمًا من مستند `/openapi.json` للعقدة المستهدفة قبل البناء ضد هذه المسارات. تتوقف التوافرية على بناء العقدة وملف تعريف الشبكة.

## بيئة تشغيل برامج Node {#node-runtime}

Torii قيد المعالجة RAM-LFE يتم تكوين بيئة تنفيذ البرمجيات تحت `torii.ram_lfe.programs[*]`, مفاتيح بواسطة `program_id`. يجب أن يطابق كل برنامج مُكوَّن قيمة الالتزام التشفيري لسياسة السلسلة ويجب أن يوفر تنفيذ البرنامج المواد البيئية اللازمة لتقييم وتصديق سجلات نتائج البروتوكول. تُعيد مسارات المعرف استخدام نفس بيئة تنفيذ البرنامج هذه؛ هم لا يحتاجون إلى واجهة تكوين منفصلة لمحلل المعرف.

تسجيل سياسة على البلوكشين ليس كافياً بحد ذاته. يجب على العقدة المستهدفة أيضًا أن تكشف عن عائلة المسار وأن تمتلك مواد بيئة تنفيذ البرمجيات المتوافقة مع البرامج التي من المتوقع أن تقوم بتنفيذها.

## الضوابط التشغيلية {#operational-guardrails}

- السياسات المسجلة غير نشطة، تحقق من البيانات الوصفية العامة، ثم قم بتنشيطها.
- احتفظ بأسرار المقيم المخفية، ومفاتيح توقيع المحلّل، والمواد السرية BFV خارج المستندات، والسجلات، والمعاملات، وحزم العملاء.
- لا تضع معرفات خام في ألقاب الحسابات أو بيانات معاملات المعاملات أو الأحداث أو حقول حالة العالم.
- تحقق من سجلات نتائج البروتوكول على جانب العميل قبل تقديم التعليمات عالية المستوى عندما يكشف SDK عن مدقق.
- استخدم حقول انتهاء الصلاحية حيث لا يجب أن تظل سجلات نتائج البروتوكول القديمة صالحة إلى الأبد.
- قم بالتدوير عن طريق تسجيل برنامج جديد أو سياسة معرف، نقل العملاء، وإلغاء تفعيل السياسة القديمة بمجرد تدفق سجلات نتائج البروتوكول الجديد.

## مواضيع ذات صلة {#related-topics}

- [رسوم الراعي لمساحة بيانات خاصة](/ar/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii API نقاط النهاية](/ar/reference/torii-endpoints.md#app-and-sora-route-families)
- [المعاملات المجهولة](/ar/blockchain/anonymous-transactions.md)
