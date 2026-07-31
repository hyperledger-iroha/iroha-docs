---
translation_locale: ar
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ هو Iroha- نعم . STARK مسار إثبات لأثر التنفيذ المحدد.
لا تحل محل تنفيذ المعاملات العادية أو الإجماع.
أخرج من هنا ISI, IVM, و Sumeragi كالمعتاد FastPQ يستهلك
شهد التنفيذ القياسي وتحول الآثار المدعومة إلى دليل
-أحزمة .

التكامل الحالي للمضيف يحتوي على ثلاثة مسارات رئيسية:

- تحويلات الأصول الرقمية الشفافة المسجلة أثناء تنفيذ الكتلة
- Nexus الروافذ المثبتة للطريق التي AXT غلاف الأدلة يحمل FastPQ
  الالتزام
- SCCP المساعدات الشفافة التي تثبت رسالة FastPQ دليل في
  ملف التحقق المفتوح

## نقل طريق الشهادة {#transfer-witness-path}

تحويلات رقمية شفافة تخلق نسخة نقل مهيكلة عندما
التعليمات تتحول إلى توازنات، سجلات النسخ:

- الحساب المصدر وحساب الوجهة وتعريف الأصول والمبلغ
- رصيد المرسل والمتلقي قبل وبعد التحويل
- hash نقطة دخول المعاملة المستخدمة ك hash اللحظة
- بيان السلطة المستخرج من الحساب المقدم
- إضافة "بوسيدون" لنسخ ذات ديلتا واحدة

تحويلات اللحوم تستخدم نسخة واحدة مع ديلتا متعددة.
هضم (بوسيدون) من الديلتا الواحدة غائب.

عند إتمام الكتلة Iroha مجموعة هذه النصوص من خلال نقطة دخول hash.
شهد الإعدام بعد ذلك يحمل كل من حزم النسخة الأصلية
الموقع FastPQ اللحظات الانتقالية المعدة للاختبار.

كل دلتا نقل يصبح صفين انتقاليتين:

| الصفوف             | شكل المفتاح                                        | القيمة المسبقة               | بعد القيمة             |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
| الائتمان المبعوث    | `asset/<asset-definition>/<source-account>`      | ميزان المرسل قبل   | توازن المرسل بعد   |
| الائتمان على المستلم | `asset/<asset-definition>/<destination-account>` | ميزان المستقبل قبل | رصيد المستقبل بعد |

القيم الرقمية يتم تطبيعها في وحدات الشاهد كاملة.
رفضت FastPQ الإفراز إذا لم يتم تمثيله كغير سلبي
`u64` على المقياس العشري المختار.

## المدخلات العامة {#public-inputs}

كل واحد FastPQ الحزمة الانتقالية تحمل المدخلات العامة التي تربط الدليل إلى
سياق الكتل والتنفيذ:

| المدخلات         | المعنى                                                         |
| ------------- | --------------------------------------------------------------- |
| `dsid`        | معرف مساحة البيانات مرموز كبايت صغير             |
| `slot`        | وقت إنشاء الكتل تحوّل إلى نانو ثانية                    |
| `old_root`    | أصل الدولة الأم المستمدة من شهود الإعدام            |
| `new_root`    | الجذر بعد الحكومة المستمدة من شهود الإعدام              |
| `perm_root`   | الالتزام بـ"بوسيدون" بشأن تصاريح الدور النشط                |
| `tx_set_hash` | الهاش على المعاملات المرتبة و التشغيل الوقت نقطة دخول الهاش |

المضيف يستخدم `fastpq-lane-balanced` كمعيار القنوني المحدد ل:
هذه اللحظات.

## نموذج رياضي {#mathematical-model}

يصف هذا القسم الحسابية التي تنفذها Rust
كل عمليات الميدانية أدناه فوق الـ (جولديلوك)
الحقل الأول:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ يستخدم Poseidon2 على `F` للالتزامات الميدانية
`t = 3`, السعر `r = 2`, والقدرة `1`. يمتص الهاش عناصر الحقل في
المعدل-2 كتلة وتضيف عنصر حقل واحد `1` قبل النهائي
التغييرات:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

السلاسل البايتية محجوزة في 7 بايت أطراف انديان صغيرة بحيث كل عضو هو
في الأسفل `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

يتم تمثيل هشات الحقول المنفصلة عن النطاق على شكل:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

بالنسبة لـ"هاشيش" التي تبدأ من "بايت دومين" FastPQ خرائط الثمانية الأولى
البايتات الصغيرة في الحقل:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

ها هي `Hash` الوسائل Iroha- نعم . `iroha_crypto::Hash::new`, 32 بايت Blake2bVar
التهضم، إلا إذا كانت الصيغة تسمي بوضوح Poseidon2 أو SHA-256.

### الرياضيات الميدانية {#field-arithmetic}

(الـ) Rust الترميز يمثل عناصر الحقل كقوانين `u64` القيم في
`[0,p)`. الإضافة والسحب هي:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

الضربة تحسب أولاً المنتج 128 بت:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

ثم يستخدم تقليص الذهبية الهوية:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

إذا:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

ثم يحسب الخصم:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

التنفيذ يضيف مشروطًا أو ينقص `p` حتى تكون النتيجة
القنوني. يتم تضمين الأرقام الكاملة الموقعة، مثل الديلتا التوازنية، من خلال:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### (بوسيدون2) {#poseidon2-permutation}

حالة محول Poseidon2 هي:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

صندوقها S هو:

$$
S(x)=x^5
$$

FastPQ تستخدم أربع جولات كاملة، سبعة وخمسين جولة جزئية، ثم أربعة أخرى
جولات كاملة، جولة كاملة مع ثابتات مستديرة
`c_r = (c_{r,0}, c_{r,1}, c_{r,2})` هو:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

الجولة الجزئية هي:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

جميع الإضافات والضاعفات في `F`. القوانين MDS المصفوفة هي:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

hash المجال يبدأ من حالة الصفر.
`(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

الحجر الأخير يضيف `1` عنصر الغطاء قبل آخر واحد
المخرج هو `x_0`.

### الإدخال العام ملزم {#public-input-binding}

المضيف يرمز هوية مساحة البيانات عن طريق كتابة `u64` القيمة في الأول
ثمانية بايتات صغيرة من حقل 16 بايت:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

يتم تحويل وقت إنشاء الكتلة من الميلي ثانية إلى نانو ثانية:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

تعادل محور المعاملات هو محور من النطاقات عبر نقطة الدخول المرتبة
الحشيش:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

حيث `h_i` يتم تصنيف المعاملات والزمن محفزة نقطة دخول
الإثبات العام IO, إذا `perm_root` أو `tx_set_hash` هو كل صفر،
يملأ المؤشر قيم التراجع:

$$
\operatorname{perm\_root} =
\begin{cases}
0^{32},& \text{if there are no permission hashes}\\
\operatorname{Hash}(\texttt{fastpq:v1:perm\_root}\|p_0\|\cdots\|p_{n-1}),
& \text{otherwise}
\end{cases}
$$

$$
\operatorname{tx\_set\_hash}_{fallback} =
\operatorname{Hash}(\texttt{fastpq:v1:tx\_set}\|\operatorname{ordering\_hash})
$$

### التطبيع الرقمي {#numeric-normalization}

لكل دلتا نقل، فإن مقياس العشرية المستهدفة هو الحد الأقصى المنحصر
النطاق عبر المبلغ والصور الفورية لكل من التوازن:

$$
s =
\max(
\operatorname{scale}(a),
\operatorname{scale}(f_0),
\operatorname{scale}(f_1),
\operatorname{scale}(t_0),
\operatorname{scale}(t_1)
)
$$

(أ) `Numeric` القيمة مع mantissa `m` والقياس `q` يتم قبولها فقط عندما
`m >= 0` و `q <= s`. - نعم FastPQ قيمة الشاهد هي:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

يجب أن تتناسب النتيجة المعتادة `u64`.

### التنظيم الكانوني {#canonical-ordering}

قبل تشكيل العينات، يتم فرز اللحظة حسب مفتاح الانتقال، والعمل
المرتبة، ومؤشر الإدراج الأصلي:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

الالتزام بالطلب هو حقل Poseidon2 على المجال
`fastpq:v1:ordering` و Norito تشفير الانتقالات المرتبة:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

حيث `P` هو إغلاظ 7 بايت، `E` هو Norito التشفير `D_o` هو
`fastpq:v1:ordering`, و `T*` هو قائمة الانتقال المرتبة

### معادلات النقل {#transfer-equations}

مقابل مبلغ التحويل `a`, رصيد المرسل `f`, وتوازن المستلمين `t`,
FastPQ يؤكد قيم الشهود المعتادة قبل بناء البصمة:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

ثم تقوم الصفوف الانتقالية بتشفير:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

داخل البصمة، يتم تقليص الدلتا الموقعة إلى `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

الاختياري واحد ديلتا تحويل إرسال يرتكب التحويل المشفر
الصورة السابقة:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

بالنسبة لنسخ نقل متعددة الديلتا، يتطلب النموذج الحالي هذا:
المهضم على مستوى الأعلى لن يكون موجوداً.

المُستضيف السلطة تستهلك نسخة النقل هي:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### صفوف التتبع {#trace-rows}

دع القائمة المرتبة للانتقال تحتوي `n` الصفوف الحقيقية. طول البحث هو
القوة التالية من اثنين:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

الصفوف `0..n-1` نشطة، الصفوف `n..N-1` كل صف حقيقي لديه
مجموعة واحدة من اختيارات العملية:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

جميع الأعمدة المنتخبة هي بولية:

$$
s(s-1)=0
$$

صفوف البحث عن الإذن هي بالضبط صفوف منح الدور وإلغاء الدور:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

لصفوف العمليات الرقمية:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

يقوم البنّاء أيضاً بتتبع النطاقات التي تعمل في كل أصول:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

فقط صفوف النعناع والحرق تحديث عداد الإمداد:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

أعمدة البيانات المعدنية ومتابعة مساحة بيانات هي حشيشات الحقول المستخرجة قبل الصف
المادية:

$$
\operatorname{metadata\_hash} =
\begin{cases}
0,& \text{if metadata is empty}\\
H_D(E(\text{metadata})),& \text{otherwise}
\end{cases}
$$

$$
\operatorname{dsid\_trace}=H_D(\operatorname{public\_input\_dsid})
$$

hash البيانات المعدنية، hash مساحة البيانات، والفرق مستقرة عبر الجوار
صفوف تتبع:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### نقل عمودات ميركل {#transfer-merkle-columns}

خطوط النقل تحمل 32 مستوى نادرة مسار ميركل. إذا كان دليل مضيف هو
غائب، يختلط الباحث مسار تحديد من مفتاح الصف
التوازن المسبق، وما إذا كان الصف هو الجانب المرسل أو المستلم.

للطرق الاصطناعية، الملح الذوق هو `fastpq:smt:from` لسلسلة المرسلين
و `fastpq:smt:to` لصفوف المستقبل:

$$
K =
\operatorname{Hash}(\texttt{fastpq:smt:key|}\|\operatorname{salt}\|\operatorname{key})
$$

$$
V =
\operatorname{Hash}(\texttt{fastpq:smt:value|}\|\operatorname{salt}\|\operatorname{le64}(\operatorname{balance}))
$$

$$
b_\ell = \operatorname{bit}_\ell(K)
$$

$$
s_\ell =
\operatorname{Hash}(
\texttt{fastpq:smt:sibling|}\|
\operatorname{le64}(\ell)\|K\|\operatorname{le64}(\operatorname{balance})\|\operatorname{salt}
)
$$

الأوراق الاصطناعية والعقدة الداخلية هي:

$$
L = \operatorname{Hash}(
\texttt{fastpq:smt:leaf|}\|
K\|V
)
$$

$$
N_{\ell+1} =
\operatorname{Hash}(
\texttt{fastpq:smt:node|}\|
\operatorname{left}_\ell\|
\operatorname{right}_\ell
)
$$

التتبع يسجل الجزء `b_l`, الإخوة `s_l`, عقد الدخول `x_l`, و
عقدة الخروج `x_{l+1}` في كل مستوى، مع اتفاقية فرع الرمز:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### الحشيشات المسموح بها {#permission-hashes}

صفوف إعطاء الدور وإلغاء السطر hash الشاهد الإذن:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

جدول الإذن المضيف يقوم بتنظيم إدخالات الجذر حسب البايتات ، والإذن
بايتز، وبايتز العصر، ثم يبني شجرة بوسيدون2 ميركل:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

مستويات عرض العشوائية تكرر العنصر النهائي.

### الالتزام بالتعقب {#trace-commitment}

لكل عمود تتبع `c`, FastPQ أولاً ، يتقاطع قيم العمود فوق
النطاق المتبعة والهاشات متجه المعامل:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

الجذر التتبع هو جذر بوسيدون2 ميركل فوق الالتزامات العمودية:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

الالتزام الأخير هو البايت هاش على النطاق، مجموعة المعلمات،
أشكال البصمات، وخطوط العمود، وجذور البصمات:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

حيث `D_c` هو `fastpq:v1:trace_commitment`.

### AIR التكوين {#air-composition}

(الـ) V1 AIR قيمة التكوين هو مزيج خطي من بقايا الصف المحلي.
عينات النسخة تظهر تحديين:

$$
\alpha_0,\alpha_1 \in F
$$

لكل زوج من الصفوف المجاورة `(i,i+1)`, المحاسب يحسب:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

البقايا `rho` هي، حسب الترتيب:

$$
\rho=s(s-1)
\quad\text{for each selector column}
$$

$$
\rho =
s_{\text{active}} -
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}}+
s_{\text{role\_grant}}+s_{\text{role\_revoke}}+s_{\text{meta\_set}})
$$

$$
\rho =
s_{\text{perm}}-(s_{\text{role\_grant}}+s_{\text{role\_revoke}})
$$

$$
\rho =
s_{\text{active},i+1}(1-s_{\text{active},i})
$$

بالنسبة للصفوف ذات الأعمدة الرقمية:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

وبالنسبة لعمود السياق المستقرة للمجموعة:

$$
\rho =
\operatorname{metadata\_hash}_i-\operatorname{metadata\_hash}_{i+1}
$$

$$
\rho =
\operatorname{dsid}_i-\operatorname{dsid}_{i+1}
$$

$$
\rho =
\operatorname{slot}_i-\operatorname{slot}_{i+1}
$$

المحقق يعيد الحساب `A_i` لفتوحات الصفوف التي تم أخذها من عينات والتحقق منها
مقابل قيمة التركيب المشتركة بموجب AIR التركيب ميركل
الجذر

### منتج البحث {#lookup-product}

مكثف البحث عن الإذن يستخدم تحدي Fiat-Shamir `gamma`.
على تقييمات التوسع منخفضة الدرجة `s_perm` و `perm_hash`, الموقع
المنتج الجاري هو:

$$
z_0=1
$$

$$
z_{i+1}=
\begin{cases}
z_i\cdot(w_i+\gamma),& s_{\text{perm},i}\ne0\\
z_i,& s_{\text{perm},i}=0
\end{cases}
$$

سجلات الأدلة:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### التوسع منخفض الدرجة {#low-degree-extension}

دعها `omega_T` أن تكون مولد النطاقات التتبعية، `omega_E` الموقع
مولد مجال التقييم، و `g` تعويضات المجموعة المتكوّنة.
عمود تعقب مع قيم `v_i`, التقاطع ينتج معايير `a_j`
مثل:

$$
f(\omega_T^i)=v_i
$$

يقدر التوسع منخفض الدرجة نفس البولينوم على الجمع:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

يُحسب التنفيذ هذا عن طريق مضاعفة المعاملات بسلطات
المكافأة قبل FFT:

$$
a'_j = a_j g^j
$$

ثم تقييم `a'` في مجال التقييم.

(الـ) CPU FFT هو التحول المتكرر الجذري-2 كولي-توكي
المدخلات المعاكسة بيت. `L`, نصف طول `H=L/2`, و المرحلة
الجذر:

$$
\omega_L=\omega^{N/L}
$$

كل فراش يحسب:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

العكس FFT يعمل نفس التحويل مع `omega^{-1}` و الميزانات
حجم النطاق المعاكس:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

يتم التحقق من صحة جذور الكتالوج قبل الاستخدام:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

بالنسبة للمناطق الصغيرة المستمدة من جذور الكتالوج، فإن الجهاز المصدر هو:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### القوائم والورق {#row-and-leaf-hashes}

بعد LDE, FastPQ الـ "هاشي" لكل سطر عبر كل LDE عمودات `m` الأعمدة:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

إذا كانت الهيشيز في الصف لا تزال على نطاق البحث بدلاً من التقييم
النطاق، وترتبط البحث وتوسع تلك العمود واحد صف هاش
مع نفس المجموعة LDE العملية

### فتحات ميركل {#merkle-openings}

LDE يتم تجميع القيم إلى قطع من:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

كل قطعة من الأوراق هي:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

والدا (ميركل)

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

مستويات غريبة تكرر العقدة الأخيرة. مسارات استفسار التحقق عن طريق الاختراق يسارا أو
الحق وفقا لميزان مؤشر ورقة الاستفسار في كل مستوى.

لصفحة في المؤشر `i`, طريق `(s_0,\ldots,s_{d-1})` تتحقق من
الجذر `R` من خلال التكرار:

$$
y_0=L_i
$$

$$
y_{k+1}=
\begin{cases}
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),y_k,s_k),
& \lfloor i/2^k\rfloor \equiv 0 \pmod 2\\
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),s_k,y_k),
& \lfloor i/2^k\rfloor \equiv 1 \pmod 2
\end{cases}
$$

التحقق يمر فقط عندما:

$$
y_d=R
$$

AIR أوراق الصفوف التتبعية هي:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR أوراق التكوين هي:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

(الـ) LDE فتح استفسار أيضا التحقق من أن القيمة المفتوحة في مؤشر التقييم
`i` موجودة في الجزء الموثق به:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI التثبيت {#fri-folding}

FRI يتعهد AIR تقييمات التركيب لكل جولة `l`, الموقع
عينات النسخة تحدي `beta_l`. الطبقة مغطاة إلى متعددة
من arity من خلال تكرار القيمة الأخيرة. كل مجموعة بحجم arity ينحني إلى:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

حيث `a` هو FRI التحقق، لكل استفسار عينات
السلسلة التي:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

وتصديق كل فتح FRI المجموعة ضد المقابلة FRI الطبقة
الجذر

### النسخة فيات-شامير {#fiat-shamir-transcript}

الكتالوج المعايير القنونية تسمية النسخة hash كما SHA3-256.
تنفيذ المحقق والتحقق الحالي يستخرج البايتات التحدي مع
`iroha_crypto::Hash::new`, الذي هو 32 بايت Blake2bVar هضم، ثم
يقلل من أول ثمانية بايتات صغيرة إلى `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

مكالمات التحدي إضافة الجهاز الكامل إلى حالة النسخ
النظام هو:

1. العامة IO, نسخة البروتوكول، نسخة المعلمات، واسم المعلمات
2. LDE الجذر والجذور
3. `gamma`
4. AIR تحديات التركيب `alpha_0`, `alpha_1`
5. AIR جذور البصمات و AIR جذور التكوين
6. البحث المنتج الكبير
7. FRI جذور الطبقة و `beta_l` التحديات
8. مؤشرات الاستفسارات المقطوعة

استجواب العينات يستمر في رسم 32 بايت تحدي إضافات وقراءة
النديان الصغير `u64` قطع حتى يحصل على الرقم المطلوب من الوحدات الفريدة
المؤشرات:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

يتم إرجاع مجموعة العينات بالترتيب المرتب.

### إعادة تشغيل المحقق {#verifier-replay}

يقوم المحقق أولاً بإعادة احتساب الالتزام بالحزم:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

ويتطلب:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

كما أنه يعيد بناء الجمهور IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

كل حقل يجب أن يتطابق مع الجمهور IO البايت مقابل البايت
ثم يعيد إعادة تشكيل نفس النسخة ويستخرج نفسها:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

لكل استفسار تم اختياره `q`, يتحقق من:

$$
\operatorname{MerkleVerify}(
R_{\text{lde}},
L_{\lfloor q/B_{\text{lde}}\rfloor},
\lfloor q/B_{\text{lde}}\rfloor,
\pi_{\text{lde}}
)
$$

$$
\operatorname{MerkleVerify}(
R_{\text{air}},
L^{\text{air}}_q,
q,
\pi_{\text{air,current}}
)
$$

$$
\operatorname{MerkleVerify}(
R_{\text{air}},
L^{\text{air}}_{q+1\bmod N_{\text{eval}}},
q+1\bmod N_{\text{eval}},
\pi_{\text{air,next}}
)
$$

و:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

(الـ) AIR يجب أن يتم تصديق فتح التركيب تحت `R_air_composition`.
(الـ) FRI السلسلة تبدأ من نفس `A_q` ويجب أن ينتهي في
الأخيرة الموثقة FRI ورقة تحت المحطة FRI الجذر

## ما يتحقق منه المثال {#what-the-prover-checks}

قبل بناء البصمة FastPQ الإشارة تقنونية ترتيب اللحظة
من خلال مفتاح الانتقال، رتبة العملية، وتسلسل إدخال.
يتطلبون بيانات النسخة المتحركة. مجموعة مع خطوط نقل ولكن لا توجد عملية نقل
النسخة غير صالحة

بالنسبة لنسخ نقل، تشمل التحققات الجانبية للمحاسبة:

- لا يجب أن يتدفق رصيد المرسل
- `sender_after` يجب أن تكون متساوية `sender_before - amount`
- `receiver_after` يجب أن تكون متساوية `receiver_before + amount`
- يجب أن تغطي النسخة كل سطر نقل في اللحظة
- يجب أن يتطابق هضم بوسيدون من ديلتا واحدة، عند وجوده، مع النص
  الصورة المسبقة
- إذا كانت أدلة ميركل النادرة يجب أن يتم تشفيرها كإصدار 1 ، فإن المسارات المفقودة هي:
  المملوءة بأدلة صناعية تحديدية

يحتوي البصمة على أعمدة اختيارية للتحويل والعقاقير والحرق ومكافحة الأدوار
إلغاء الدور، مجموعة البيانات المعدنية، وخطوط بحث الإذن. العملية الرقمية
الصفوف تحمل أيضاً دلتا موقعة، وتعمل على كل ديلتا من الأصول، والإمدادات
العدادات

## (سبرور لين) {#prover-lane}

`irohad` يبدأ FastPQ سيل البحث عند تشغيل إذا كان البحث الخلفي يمكن
يتم تشغيلها. المسار هو مهمة خلفية مع صف محدد. بعد
الكتلة تنتج شهدة الإعدام، المسار المشترك يقدم وظيفة إثبات
يحتوي على البلوك هاش، الطول، الرؤية، والشهد.

إذا لم يتم تشغيل الشارع أو كان الصف مليئاً، فيتم تخطي العمل
يواصل معالجة الكتل العادية. هذا يعني أن طريق البحث الخلفي هو
ليس بوابة قبول المعاملات أو إجماع. إنه إنتاج دليل
الطريق على الحالة التي تم تنفيذها بالفعل

الشارع يُبني إشارة مع:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` يسمح للمسجل باختيار الخلفية المتاحة. `cpu` تنفيذ الرموز
إلى CPU. `gpu` تفضلها GPU الإعدام، مع CPU الخلف حيث
لا يمكن للخلفية استخدام النواة المطلوبة.

## التحقق {#verification}

FastPQ التحقق من الدليل يعيد بناء الالتزام القنوني للمجموعة
يقوم المحقق بتحقق نسخة البروتوكول
إصدار مجموعة المعلمات، وحدود الإعادة التمثيل، الالتزام بالتتبع، المدخلات العامة.
فتحات ميركل التي تم أخذ عينات منها، AIR فتحات، و FRI سلسلة الاستفسارات

الحدود الافتراضية المتخلفة تشمل:

| الحد              | افتراضية |
| ------------------ | ------: |
| صفوف الانتقال    |     256 |
| حجم الحمولة المفيدة | 256 KiB |
| FRI الطبقات         |      16 |
| فتحات الاستفسارات     |     128 |

## Nexus الروايات المثبتة {#nexus-verified-relays}

Nexus AXT غلافات الدليل يمكن أن تضم `AxtFastpqBinding`. عندما
`RegisterVerifiedLaneRelay` تنفيذ، Iroha:

1. تُحقق من غلاف إرسال المسار، و FastPQ مادة الدليل
2. يتحقق من مساحة البيانات والجذر
3. يقرأ AXT غلاف الدليل
4. يتطلب `fastpq_binding`
5. إعادة بناء FastPQ اللحظة من هذا الارتباط
6. تُفكّر المضمنة FastPQ دليل
7. يتصل FastPQ المحقق على اللحظة التي تم إعادة بناؤها والدليل

إذا نجحت التحقق، Iroha تخزين `VerifiedLaneRelayRecord`
يحتوي على مرجع الرصيف، والغلاف الأصلي، والحاشة المفيدة للتثبيت،
ارتفاع التحقق، الجذر المظهر، و FastPQ ملزمة.

غلافات الرصيف السريع تحمل أيضاً رقيقة FastPQ مادة إثبات
هو تحليل على هوية المسار، هوية مساحة البيانات، ارتفاع الكتلة، التحقق
الارتفاع، مخطوطة الرأس الكتل، مخططات التسوية، وجذر المظاهر.
الاندماج مقبول فقط عندما يكون له كل من QC وموثوقة FastPQ دليل
المواد

### AXT الرياضيات الملزمة {#axt-binding-math}

ل: Nexus AXT المغلفات `AxtFastpqBinding` يتم تصنيفها قبل الإثبات
إعادة تشغيل. قيم المعايير الفارغة افتراضية إلى `fastpq-lane-balanced`; الفراغ
اسم المؤكد والإصدار الافتراضي `fastpq` و `v1`; يتم قطع نوع الطلب
وقلّلوا.

(الـ) AXT FastPQ المدخلات العامة هي حشيشات البايت المحددة:

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

AXT مفاتيح الانتقال هي:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

(الـ) `authorization` الإدعاء يضيف صفراً عن إعطاء الدور:

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

وسلسلة البيانات الوصفية لسياسة الترخيص. `compliance` الادعاء
يضيف صفين من البيانات المعدنية: واحد للسياسة والآخر للمناطق المستهدفة للبيانات.

ل: `tx_predicate` و `value_conservation`, كمية تأثير صريحة هي
تستخدم عندما يحتوي الرابط على مبلغ مصدر أو وجهة إيجابي.
وإلا فإن الرمز يستخرج كمية تحديدية محدودة:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

ثم تستخدم نفس معادلات النقل:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

يتم توليد هويات حساب المرسل والمتلقي الصناعية من البذور الرئيسية:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

الحشيش للكتلة النقل هي:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

(الـ) AXT إضافة المظهر اللحمية هي SHA-256 على Norito تشفير
الالتزام القنوني:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP إثباتات واضحة للرسالة {#sccp-transparent-message-proofs}

(الـ) SCCP الصندوق المساعد يستخدم أيضا FastPQ لإرسال رسالة عبر السلسلة الشفافة
هذه المسار منفصلة عن `irohad` خلفية محاولة المراقبة.
يبني FastPQ اللحظة مباشرة من SCCP حزمة إثبات الرسائل
يظهر، ثم يغلف الدليل الناتج للتحقق من المفتوح.

(الـ) SCCP استخدامات اللحوم `fastpq-lane-balanced` وثلاثة عمليات انتقال البيانات المعدنية:

| المفتاح                             | العملية |
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

إن مدخلاتها العامة مشتقة من SCCP دليل داخلي شفاف:

| FastPQ المدخلات  | SCCP المصدر                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        | أول 16 بايت من هضم بليك2ب على البيان هاش |
| `slot`        | ارتفاع النهاية                                            |
| `old_root`    | الحمل المفيد                                               |
| `new_root`    | جذور الالتزام                                            |
| `perm_root`   | الحاجز من حظر النهاية                                        |
| `tx_set_hash` | البيانات                                             |

(الـ) SCCP الكانونيكال مبرمجيات كتابة عدد كامل صغير-endian و ترميز
المصفوفات بايت متغيرة الطول على النحو:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

السلسلة الشفافة المدخول العامة هي:

$$
P =
\operatorname{version}\|
\operatorname{message\_id}\|
\operatorname{payload\_hash}\|
\operatorname{le32}(\operatorname{target\_domain})\|
\operatorname{commitment\_root}\|
\operatorname{le64}(\operatorname{finality\_height})\|
\operatorname{finality\_block\_hash}
$$

البيانات الشفافية بايت هي سلسلة من النسخة، سلسلة
النطاقات العائلية والمحلية والجهة المقابلة، نموذج الأمن، حوكمة الركبة،
كوديك الحساب، نموذج النهائي، هدف المؤكد، عائلة مؤكد الخلفية،
حقل سلسلة / مؤخرة خلفية / ظهيرة ذات مساحة قصوى ،
مفتاح كوديك الحساب، نوع الحملة المفيدة، البايتات المدخلة العامة، والحملة المفعلة.
بيان هاش هو:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

(الـ) FastPQ اسم مساحة البيانات لهذا المسار هو أول ستة عشر بايت من
"بليك2ب" آخر مع إضافة:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

(الـ) SCCP FastPQ المجموعة هي بالضبط:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

ثم يتم فرزها بنفس FastPQ قاعدة النظام

(الـ) OpenVerify التزام المؤكد هو SHA-256 على SCCP الخلفية الرسالة
الاسم و القنوني FastPQ وصف المحقق:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

الخام FastPQ الدليل هو Norito-مشفورة في `StarkFriOpenProofV1`, إذاً
ملفوفة في `OpenVerifyEnvelope` مع الخلفية `Stark`. SCCP التحقق
إعادة بناء نفسها FastPQ اللحظة من الحزمة و المخطط، تحقق
فتح ملف التحقق من البيانات المعدنية، ويدعو FastPQ المحقق على
إعادة بناء اللحظة والدليل

## مجموعات المعلمات {#parameter-sets}

الكتالوج المعايير القانونية يعرض مجموعتين من المعايير.
المستخدمين حالياً `fastpq-lane-balanced`.

| المعيار              | الغرض                    | الحقل                          | الحشيشات                                      | FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` | إصدار متوازن | الـ " غولد ليكس " التوسع التربيعي | الالتزامات بـ"بوسيدون2"، الكتالوج SHA3 الملصق | النقطة 8، التفجير 8, 46 استفسار   |
| `fastpq-lane-latency`  | طرق حساسة من التأخير    | الـ " غولد ليكس " التوسع التربيعي | الالتزامات بـ"بوسيدون2"، الكتالوج SHA3 الملصق | المادة 16، الإنفجار 16، 34 استفسارات |

كل منهما يهدف إلى أمن 128 بت واستخدام حجم النطاق `2^16`. (الـ)
Rust V1 رمز إعادة تشغيل النسخة حاليًا ينبع من تحدي Fiat-Shamir
البايتات مع `iroha_crypto::Hash::new` بدلاً من الاستدعاء مباشرة
SHA3-256.

مستمرات الكتالوج الدقيقة المستخدمة من قبل Rust الوصفات هي:

| مستمرة             | `fastpq-lane-balanced` | `fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
| `target_security`    |                    128 |                   128 |
| `grinding_bits`      |                     23 |                    21 |
| `trace_log_size`     |                     16 |                    16 |
| `trace_root`         |   `0x002a247f81c6f850` |  `0x6a9f4eb38fb9b892` |
| `lde_log_size`       |                     19 |                    20 |
| `lde_root`           |   `0x60263388dbbf9b2a` |  `0x9c9c3a571b6f89ac` |
| `permutation_size`   |                 65,536 |                65,536 |
| `lookup_log_size`    |                     19 |                    20 |
| `omega_coset`        |   `0x6af325e825ad5c18` |  `0x3a5fd4171e3c3a4d` |
| `fri_arity`          |                      8 |                    16 |
| `fri_blowup`         |                      8 |                    16 |
| `fri_max_reductions` |                      8 |                     6 |
| `fri_queries`        |                     46 |                    34 |

## الإعداد {#configuration}

FastPQ التكوين يقع تحت `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "auto"
poseidon_mode = "auto"

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false
metal_debug_fused = false
```

يمكن إلغاء نفس علامات التنفيذ والتلفميرية من `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

تُدعم متغيرات البيئة أيضاً في حقول التكوين.
FastPQ- المتغيرات المحددة تشمل:

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`
- `FASTPQ_DEBUG_FUSED`

## المقاييس {#metrics}

عندما يتم تشغيل التلفاز، FastPQ تصدير مقاييس لانتخاب الخلفية
سلوك المعدات في وقت التشغيل:

| الميترات                            | المعنى                                                                     |
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     | وضع التنفيذ المطلوب والحل حسب العلامات الخلفية ومدونة الجهاز          |
| `fastpq_poseidon_pipeline_total`  | مسار خط أنابيب بوسيدون المطلوب وحل                               |
| `fastpq_metal_queue_depth`        | الحد الأقصى للصف المعدني، العدد القصوى في الرحلة، وعدد الإرسال، ونوافذ أخذ العينات |
| `fastpq_metal_queue_ratio`        | النسبة المزدحمة والترابط في صف المعادن                                         |
| `fastpq_zero_fill_duration_ms`    | مدة الاستيعاب الصفري للمسارات المعدنية                                      |
| `fastpq_zero_fill_bandwidth_gbps` | عرض النطاق المشتق من الصفر                                                 |

لتحديد الأداء العام، استخدم هذه مع الإجماع والصف
الإشارات المدرجة في [الأداء والمقاييس](/ar/guide/advanced/metrics.md).

## الإشارة ذات الصلة {#related-reference}

- [نظام نموذج البيانات](/ar/reference/data-model-schema.md) للنوع المولود
  التفاصيل
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ الخيارات](/ar/reference/irohad-cli.md#arg-fastpq-execution-mode)
