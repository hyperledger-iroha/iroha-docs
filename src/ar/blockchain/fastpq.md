---
translation_locale: ar
translation_source: /blockchain/fastpq.md
translation_source_hash: d8dd61390f5df3dae09b70399e04e8f71716a912ef5dea9010feaf60573ed261
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# FastPQ {#fastpq}

FastPQ هو مسار إثبات STARK الخاص بـ Iroha للتأثيرات التنفيذية المختارة. لا يُعد بديلاً عن تنفيذ المعاملات العادي أو الإجماع. المعاملات لا تزال قم بتشغيل ISI، IVM، و Sumeragi كالمعتاد؛ يستهلك FastPQ شاهد التنفيذ الحتمي ويحوّل التأثيرات المدعومة إلى دفعات إثبات.

يحتوي تكامل المضيف الحالي على ثلاثة مسارات رئيسية:

- تحويلات الأصول الرقمية الشفافة التي تم تسجيلها أثناء تنفيذ الكتلة
- Nexus مرحلات تنفيذ مؤكدة التي تحتوي حاوية بيانات الإثبات AXT الخاصة بها على ربط FastPQ
- SCCP مساعدين إثبات الرسائل الشفافة الذين يغلفون إثبات FastPQ في حاوية بيانات للتحقق المفتوح

## مسار نقل الشاهد {#transfer-witness-path}

التحويلات الرقمية الشفافة تنشئ نسخة منقولة منظمة عندما تقوم التعليمات بتغيير الأرصدة. تقوم النسخة بتسجيل:

- حساب المصدر، حساب الوجهة، تعريف الأصل، والمبلغ
- أرصدة المرسل والمستقبل قبل وبعد التحويل
- الهاش التشفيري لنقطة دخول المعاملة المستخدم كهاش تشفيري للدفعة
- قيمة ملخص تشفير رئيسية للتفويض مشتقة من الحساب المقدم
- قيمة ملخص تشفير بوسيدون للنصوص المفردة دلتا

تستخدم التحويلات الدُفعيّة نصًا واحدًا مع عدة دلتا. في هذه الحالة، تكون قيمة ملخّص التشفير بوسيدون ذات الدلتا الواحدة غير موجودة.

عند إنهاء الكتلة، يقوم Iroha بتجميع هذه النصوص حسب تجزئة التشفير لنقطة الدخول. ثم يحمل شاهد التنفيذ كلاً من حزم النصوص الأصلية ودفعات الانتقال FastPQ المُعدة للمُثبت.

كل دلتا تحويل تصبح صفين انتقاليين:

|صف|شكل المفتاح|القيمة المسبقة|القيمة بعد|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|خصم المرسل| `asset/<asset-definition>/<source-account>`      |رصيد المرسل قبل|رصيد المرسل بعد|
|رصيد المستلم| `asset/<asset-definition>/<destination-account>` |رصيد المستلم قبل|رصيد المستلم بعد|

يتم تطبيع القيم الرقمية إلى وحدات شاهد صحيحة. يتم رفض القيمة لأجل التجميع FastPQ إذا لم يكن بالإمكان تمثيلها كـ `u64` غير سالبة عند المقياس العشري المحدد.

## المدخلات العامة {#public-inputs}

كل دفعة انتقال FastPQ تحمل مدخلات عامة تربط الدليل بالكتلة وسياق التنفيذ:

| إدخال |المعنى|
| ------------- | --------------------------------------------------------------- |
|`dsid`        |معرّف مساحة البيانات مشفر كبايتات بالترتيب الصغير|
| `slot`        |تم تحويل وقت إنشاء الكتلة إلى نانoseconds|
|`old_root`|الجذر الحالة الأصلية المستمدة من شاهد التنفيذ|
|`new_root`|الجذر بعد الحالة مشتق من شاهد التنفيذ|
|`perm_root`|قيمة الالتزام التشفيري لبوسيدون على أذونات الدور النشط|
| `tx_set_hash` |تجزئة مشفرة على المعاملات المصنفة ونقطة الدخول المشغلة بالوقت، التجزئات المشفرة|

يستخدم المضيف `fastpq-lane-balanced` كمجموعة معلمات معيارية بروتوكول واحدة لهذه الدفعات.

## النموذج الرياضي {#mathematical-model}

يصف هذا القسم الحسابات التي ينفذها المثبت والمتحقق الحالي Rust. جميع عمليات المجال أدناه تتم على مجال بريمي غولدي لوكس:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ يستخدم Poseidon2 بدلاً من `F` لقيم الالتزام التشفيرية في الحقل. الإسفنجة لها عرض `t = 3`، ومعدل `r = 2`، وسعة `1`. يقوم التجزئة التشفيرية بامتصاص عناصر الحقل في كتل بمعدل 2 ويضيف عنصراً واحداً من الحقل `1` قبل التبديل النهائي:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

يتم تجميع سلاسل البايت في وحدات طولها 7 بايت بالترتيب الصغير للأولويات بحيث يكون كل وحدة أقل من `p` بدقة:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

تمثل التجزئات التشفيرية للحقل المنفصلة حسب النطاق كما يلي:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

بالنسبة للهاشات التشفيرية التي تبدأ من مستخلصات تشفيرية من نطاق البايت، FastPQ يربط أول ثمانية بايتات بالترتيب الصغير في الحقل:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

هنا `Hash` يعني Iroha الخاص بـ `iroha_crypto::Hash::new`، وهو قيمة هضم تشفيرية بحجم 32 بايت من نوع Blake2bVar، ما لم يُسَمِّتْ صيغة صراحة Poseidon2 أو SHA-256.

### حساب المجال {#field-arithmetic}

يمثل الرمز Rust عناصر الحقل كقيم `u64` مفردة وفقًا لمعيار البروتوكول في `[0,p)`. الجمع والطرح هما:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

الضرب يحسب أولاً حاصل الضرب ذو 128 بت:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

ثم يستخدم تقليص ذهبي القفل الهوية:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

إذا:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

ثم يقوم المخفض بحساب:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

يقوم التنفيذ بإضافة أو طرح `p` بشكل شرطي حتى تصبح النتيجة وفقاً لمعيار البروتوكول الواحد. يتم تضمين الأعداد الصحيحة الموقعة، مثل فروق الرصيد، بواسطة:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### تبديل بوسيدون ٢ {#poseidon2-permutation}

حالة تبديل بوسيدون2 هي:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

مربع S الخاص بها هو:

$$
S(x)=x^5
$$

FastPQ يستخدم أربع جولات كاملة، وسبع وخمسون جولة جزئية، ثم أربع جولات كاملة أخرى. الجولة الكاملة مع ثوابت الجولة `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` هي:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

جولة جزئية هي:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

جميع عمليات الجمع والضرب تكون في `F`. المصفوفة الموحدة المعيارية للبروتوكول MDS هي:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

يبدأ حقل التجزئة التشفيرية من الحالة الصفرية. لكل كتلة كاملة بمعدل 2 `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

الكتلة النهائية تضيف عنصر الحشو `1` قبل إجراء تبادل آخر أخير. الناتج هو `x_0`.

### ربط مدخلات عامة {#public-input-binding}

يقوم المضيف بترميز معرف مساحة البيانات عن طريق كتابة قيمته `u64` في أول ثمانية بايتات بترتيب البايتات الصغير للحقل المكون من 16 بايت:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

يتم تحويل وقت إنشاء الكتلة من ملي ثانية إلى نانو ثانية:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

تجزئة التشفير لمجموعة المعاملات هي تجزئة تشفيرية في نطاق البايتات على تجزئات التشفير لنقاط الدخول المرتبة:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

حيث أن `h_i` هي تجزئات تشفيرية لنقاط الدخول للمعاملات المرتبة والزمنية. في الدليل العام IO، إذا كان `perm_root` أو `tx_set_hash` كلها صفرًا، يقوم المبرهن بملء القيم الاحتياطية:

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

لكل دلتا تحويل، يكون المقياس العشري المستهدف هو أقصى مقياس مقصوص عبر المبلغ وكلا مشهدي بيانات رصيد النقطة الزمنية:

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

قيمة `Numeric` ذات القاعدة العشرية `m` والمقياس `q` يتم قبولها فقط عندما `m >= 0` و `q <= s`. قيمة الشاهد الخاصة بها FastPQ هي:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

يجب أن يتناسب الناتج الموحد مع `u64`.

### الطلب وفق بروتوكول معياري واحد {#canonical-ordering}

قبل إنشاء التتبع، يتم فرز الدفعة حسب مفتاح الانتقال، ترتيب العملية، وفهرس الإدراج الأصلي:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

قيمة الالتزام التشفيري للترتيب هي تجزئة تشفيرية لحقل بوسيدون2 على المجال `fastpq:v1:ordering` وترميز Norito للانتقالات المرتبة:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

حيث أن `P` هو تعبئة بسبعة بايتات، و`E` هو ترميز Norito، و`D_o` هو `fastpq:v1:ordering`، و`T*` هو قائمة الانتقال المرتبة.

### معادلات النقل {#transfer-equations}

لتحويل المبلغ `a`، ورصيد المرسل `f`، ورصيد المستلم `t`، يقوم FastPQ بالتحقق من قيم الشاهد الموحدة قبل بناء التتبع:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

ثم تقوم صفوف التحول بترميز:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

داخل التتبع، يتم تقليص الفروقات الموقعة إلى `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

القيمة الاختيارية لمُلخص التشفير لنقل دلتا الوحيدة تُنهِي الصورة الأولية للنقل المشفر:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

بالنسبة لنُسخ النقل متعددة الدلتا، يتطلب التنسيق الحالي أن يكون هذا القيم الأعلى للهضم التشفيري غائبًا.

قيمة الملخص التشفيري الرئيسي لتفويض المضيف لنقل النسخ هي:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### صفوف التتبع {#trace-rows}

دع قائمة الانتقالات المرتبة تحتوي على `n` صفوف حقيقية. طول التتبع هو القوة التالية للعدد اثنين:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

الصفوف `0..n-1` نشطة؛ الصفوف `n..N-1` هي صفوف حشو. كل صف فعلي يحتوي على محدد عملية واحد مضبوط:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

جميع أعمدة المحدد هي قيمة منطقية:

$$
s(s-1)=0
$$

صفوف البحث عن الأذونات هي بالضبط صفوف منح الدور وسحب الدور:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

لصفوف العمليات الرقمية:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

يقوم الباني أيضًا بتتبع الفروقات الجارية لكل أصل:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

فقط إصدار وتدمير الصفوف يقوم بتحديث عداد الإمداد:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

أعمدة تتبع البيانات التعريفية ومساحة البيانات هي تجزئات تشفيرية للحقل مشتقة قبل تجسيد الصف:

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

تظل تجزئة البيانات الوصفية، وتجزئة مساحة البيانات، والفتحة ثابتة عبر صفوف التتبع المتجاورة:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### نقل أعمدة ميركل {#transfer-merkle-columns}

تحمل صفوف النقل مسار ميركل المتفرق ذو 32 مستوى. إذا كان إثبات المضيف مفقودًا، يقوم المُثبِت بتركيب مسار حتمي من مفتاح الصف، الرصيد السابق، وما إذا كان الصف هو جانب المرسل أو المستلم.

بالنسبة للمسارات التخليقية، ملح النكهة هو `fastpq:smt:from` لصفوف المرسل و`fastpq:smt:to` لصفوف المستلم:

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

الورقة الاصطناعية والعقد الداخلية هي:

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

يسجل الأثر البت `b_l`، والأخ `s_l`، وعقدة الإدخال `x_l`، وعقدة الإخراج `x_{l+1}` في كل مستوى. مع اصطلاح فرع الكود:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### أذن التجزئة التشفيرية {#permission-hashes}

منح الدور وسحب الصفوف تجزئة تشفيرية لإذن الشاهد:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

يقوم جدول أذونات المضيف root بفرز الإدخالات حسب بايتات الدور، وبايتات الأذونات، وبايتات الحقبة، ثم يبني شجرة ميركل Poseidon2:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

المستويات ذات العرض الفردي تكرر العنصر النهائي.

### تتبع قيمة الالتزام التشفيري {#trace-commitment}

لكل عمود أثر `c`، FastPQ يقوم أولاً باستيفاء قيم العمود عبر نطاق الأثر ويحسب التجزئات التشفيرية لمتجه المعاملات:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

جذر التتبع هو جذر ميركل Poseidon2 على قيم الالتزام التشفيري للأعمدة:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

التزام التتبع النهائي هو تجزئة بايتية تُحسب على المجال، ومجموعة المعلمات، وشكل التتبع، وملخصات الأعمدة، وجذر التتبع:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

حيث `D_c` هو `fastpq:v1:trace_commitment`.

### AIR تركيب {#air-composition}

قيمة تركيب V1 AIR هي مزيج خطي من البقايا المحلية للصفوف. يأخذ النص عينات من تحديين:

$$
\alpha_0,\alpha_1 \in F
$$

لكل زوج من الصفوف المتجاورة `(i,i+1)`، يقوم المُثبت بالحساب:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

البقايا `rho` هي، حسب ترتيب الكود:

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

للصفوف التي تحتوي على أعمدة رقمية:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

ولأعمدة سياق الدُفعة المستقرة:

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

يعيد المصدق حساب `A_i` لفتح الصفوف المأخوذة عيناتً ويتحقق منه مقابل قيمة التركيب المرتبطة تشفيرياً تحت جذر ميركل لتركيب AIR.

### ابحث عن المنتج {#lookup-product}

يستخدم جامع البحث عن الإذن تحدي فيات-شامير `gamma`. على تقييمات التوسيع منخفض الدرجة لـ `s_perm` و `perm_hash`، يكون المنتج الجاري كما يلي:

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

تسجل الإثبات:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### امتداد منخفض الدرجة {#low-degree-extension}

ليكن `omega_T` مولد مجال الأثر، و`omega_E` مولد مجال التقييم، و`g` الإزاحة المجمعة للمجموعة الجزئية. بالنسبة لعمود الأثر الذي يحتوي على القيم `v_i`، تنتج عملية الاستيفاء المعاملات `a_j` بحيث:

$$
f(\omega_T^i)=v_i
$$

تمتد الدالة ذات الدرجة المنخفضة لتقييم نفس كثير الحدود على المجموعة الفرعية:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

يقوم التنفيذ بحساب ذلك عن طريق ضرب المعاملات في قوى إزاحة الطاقم قبل FFT:

$$
a'_j = a_j g^j
$$

ثم تقييم `a'` على مجال التقييم.

الـ CPU FFT هو تحويل Cooley-Tukey ذي الأساس 2 تكراري على المدخلات المعكوسة بيتياً. عند طول المرحلة `L`، نصف الطول `H=L/2`، وجذر المرحلة:

$$
\omega_L=\omega^{N/L}
$$

كل فراشة تحسب:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

يُشغل المعكوس FFT التحويل نفسه مع `omega^{-1}` ويضبط الحجم بمقدار حجم المجال المعكوس:

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

بالنسبة للنطاقات الصغيرة المستمدة من جذر الكتالوج، المولد هو:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### تجزئة التشفير الصفية والورقية {#row-and-leaf-hashes}

بعد LDE، يقوم FastPQ بإنشاء هاشات تشفيرية لكل صف عبر جميع أعمدة LDE. بالنسبة لأعمدة `m`:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

إذا كانت تجزئات الصفوف التشفيرية لا تزال في نطاق التتبع بدلاً من نطاق التقييم، يقوم المثبت بالاستيفاء وتوسيع عمود تجزئة الصفوف الفردي بنفس عملية المجموعة المشتركة LDE.

### فتحات ميركل {#merkle-openings}

يتم تجميع قيم LDE في أجزاء من:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

كل ورقة قطعة هي:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

آباء ميركل هم:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

المستويات الفردية تكرر العقدة الأخيرة. تتحقق مسارات الاستعلام عن طريق التجزئة إلى اليسار أو اليمين وفقًا لتساوي أو فردية مؤشر ورقة الاستعلام في كل مستوى.

بالنسبة لورقة عند الفهرس `i`، يتحقق المسار `(s_0,\ldots,s_{d-1})` مقابل الجذر `R` بواسطة العلاقة التكرارية:

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

التحقق ينجح فقط عندما:

$$
y_d=R
$$

AIR أوراق تتبع الصفوف هي:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR أوراق التركيب هي:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

يفحص فتح الاستعلام LDE أيضًا أن القيمة المفتوحة عند فهرس التقييم `i` موجودة في الجزء المصدق الخاص بها:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI الطي {#fri-folding}

FRI يربط تشفيرياً بتقييمات تركيب AIR. لكل جولة `l`، يأخذ النص العينة لتحدي `beta_l`. يتم حشو الطبقة لتصبح من مضاعفات السعة عن طريق تكرار القيمة الأخيرة. كل مجموعة بحجم السعة تتجمع إلى:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

حيث أن `a` هو العدد FRI للوسائط. يقوم المُحقّق بالتحقق، لكل سلسلة استعلام مأخوذة عينة، من أن:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

ويصادق على كل مجموعة FRI مفتوحة مقابل جذر الطبقة FRI المقابل.

### نسخة فيات-شامير {#fiat-shamir-transcript}

يفرز كتالوج معايير البروتوكول الفردي معلمة التجزئة التشفيرية للنص على أنها SHA3-256. تنفيذ المحقق والمتحقق الحالي يستخلص بايتات التحدي باستخدام `iroha_crypto::Hash::new`، وهو قيمة مجزأة تشفيرية من نوع Blake2bVar بطول 32 بايت، ثم يقلل أول ثمانية بايتات بالتخزين الصغير إلى `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

تتطلب الاستدعاءات التقنية للتحدي إلحاق قيمة الملخص التشفيري الكامل بحالة النص. ترتيب الإعادة هو:

1. عام IO، إصدار البروتوكول، إصدار المعلمة، واسم المعلمة
2. LDE الجذر وتتبع الجذر
3. `gamma`
4. AIR تحديات التركيب `alpha_0`، `alpha_1`
5. AIR جذر الأثر و AIR جذر التركيب
6. البحث عن المنتج الكبير
7. FRI جذور الطبقة و `beta_l` التحديات
8. مؤشرات الاستعلام المُعَيَّنة

تستمر عملية أخذ عينات الاستعلام في سحب ملخصات التحدي التشفيرية بطول 32 بايت وقراءتها ككتل ذات ترتيب بايتات صغير `u64` حتى تحصل على العدد المطلوب من الفهارس الفريدة:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

يتم إرجاع المجموعة المُختارة بترتيب مرتب.

### إعادة تشغيل المراجع {#verifier-replay}

يقوم المُحقّق أولاً بإعادة حساب قيمة الالتزام التشفيري للدفعة:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

ويتطلب:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

كما يعيد بناء IO العام:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

يجب أن يطابق كل حقل نسخة الدليل العامة IO بايتًا مقابل بايت. ثم يقوم المدقق بإعادة بناء نفس النص واستخراج نفس:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

لكل استعلام مأخوذ على سبيل العينة `q`، فإنه يتحقق مما يلي:

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

يجب أن يتم توثيق افتتاح التركيبة AIR تحت `R_air_composition`. ثم تبدأ سلسلة FRI من نفس `A_q` ويجب أن تنتهي بورقة نهائية موثقة FRI تحت الجذر الطرفي FRI.

## ما يتحقق منه المُثبِت {#what-the-prover-checks}

قبل بناء التتبع، يقوم المبرهن FastPQ بتوحيد ترتيب الدفعة حسب مفتاح الانتقال، ورتبة العملية، وترتيب الإدراج. تتطلب الصفوف المحوّلة أيضًا بيانات تعريف النص. الدفعة التي تحتوي على صفوف محوّلة ولكن بدون نصوص تحويل تعتبر غير صالحة.

بالنسبة لنقل السجلات الأكاديمية، تشمل الفحوصات من جانب المزود:

- يجب ألا ينخفض رصيد المرسل
- `sender_after` يجب أن يساوي `sender_before - amount`
- `receiver_after` يجب أن يساوي `receiver_before + amount`
- يجب أن يغطي السجل كل صف تحويل في المجموعة
- يجب أن تتطابق قيمة ملخص التشفير بوسيدون دلتا واحدة، عند وجودها، مع صورة مسبقة للنص
- يجب أن يتم فك تشفير الإثباتات الشجرية النادرة المزودة كالإصدار 1؛ المسارات المفقودة يتم ملؤها بإثباتات تركيبية حتمية

يحتوي التتبع على أعمدة محدد للاختيار للصفوف المتعلقة بالنقل، الإصدار، الحذف، منح الدور، سحب الدور، تعيين البيانات الوصفية، والبحث عن الأذونات. كما تحمل الصفوف العمليات الرقمية فروقًا معنونة، فروقًا جارية لكل أصل، وعدادات العرض.

## مسار تنفيذ المثبت {#prover-lane}

`iroha3d` يبدأ مسار تنفيذ FastPQ لمثبت البراهين عند بدء التشغيل إذا كان من الممكن تهيئة واجهة مثبت البراهين الخلفية. مسار التنفيذ هو مهمة تعمل في الخلفية مع قائمة انتظار محدودة. بعد أن ينتج الكتلة شهادة تنفيذ، يقوم مسار إنهاء الإجماع بتقديم مهمة مثبِّت تحتوي على التجزئة التشفيرية للكتلة والارتفاع والرؤية والشهادة.

إذا لم يكن مسار التنفيذ قيد التشغيل أو كانت قائمة الانتظار ممتلئة، يتم تخطي المهمة ويستمر معالجة الكتل العادية. هذا يعني أن مسار تنفيذ المثبت في الخلفية ليس بوابة قبول المعاملات أو الإجماع. إنه مسار إنتاج الإثبات على الحالة التي تم تنفيذها بالفعل.

مسار التنفيذ ينشئ محققًا باستخدام:

```text
parameter = "fastpq-lane-balanced"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

كلا الإعدادين الافتراضي هو `cpu`. اختيار `gpu` هو طلب صريح بالإغلاق عند الفشل: إذا لم يتم تجميع دعم GPU أو كان GPU المطلوب غير موجود يفشل في الفحص المسبق، تبقى مسار تنفيذ المثبت معطلاً. الإصدار الأول لا يحتوي على قيمة `auto` ولا يتحول من الوضع المطلوب GPU إلى CPU.

## التحقق {#verification}

FastPQ تحقق الإثبات يعيد بناء قيمة الالتزام التشفيري لمجموعة واحدة وفقًا لمعيار البروتوكول ويعيد تشغيل المخطط العام. يقوم المحقق بالتحقق من البروتوكول الإصدار، إصدار مجموعة المعلمات، حدود الإعادة، قيمة الالتزام التشفيري للتتبع، المدخلات العامة، فتحات شجرة ميركل المأخوذة عينياً، فتحات AIR، وسلسلة استعلام FRI.

تشمل حدود إعادة التشغيل الافتراضية:

|حد|افتراضي|
| ------------------ | ------: |
|صفوف الانتقال|     256 |
|حجم دفعة الحمولة|256 KiB|
| FRI طبقات |      16 |
|استفسار عن الوظائف الشاغرة|     128 |

## Nexus المرحلات الموثوقة {#nexus-verified-relays}

Nexus AXT يمكن لحاويات بيانات الإثبات تضمين `AxtFastpqBinding`. عندما ينفذ `RegisterVerifiedLaneRelay`، Iroha:

1. يتحقق من حاوية بيانات تتابع مسار التنفيذ ومواد الدليل FastPQ
2. يفحص مساحة البيانات وجذر البيان الفني
3. يفك تشفير حاوية بيانات إثبات AXT
4. يتطلب `fastpq_binding`
5. يعيد بناء دفعة FastPQ من ذلك الربط
6. يفك شيفرة الدليل FastPQ المضمَّن
7. يستدعي مراجع FastPQ على الدفعة المعاد بناؤها والإثبات

إذا نجحت عملية التحقق، يقوم Iroha بتخزين `VerifiedLaneRelayRecord` يحتوي على مرجع الترحيل، والحاوية الأصلية للبيانات، وهاش التشفير لعبء الإثبات، وارتفاع التحقق، وجذر البيان الفني، وارتباط FastPQ.

تحمل حاويات بيانات تتابع مسار التنفيذ أيضًا مادة إثبات FastPQ المدمجة. المادة هي قيمة هضم تشفيرية على معرف مسار التنفيذ، ومعرف مساحة البيانات، وارتفاع الكتلة، وارتفاع التحقق، تجزئة التشفير لرأس الكتلة، تجزئة التشفير لتسوية المعاملات المالية، وجذر البيان الفني. النقل يكون مقبولًا للدمج فقط عندما يحتوي على كل من QC و FastPQ صالح من مادة الإثبات.

### AXT ربط الرياضيات {#axt-binding-math}

بالنسبة لحاويات البيانات Nexus AXT، يتم توحيد `AxtFastpqBinding` قبل إعادة تشغيل الإثبات. القيم الفارغة للمعاملات تكون افتراضيًا `fastpq-lane-balanced`؛ معرف النسخة والنسخة الفارغة للمدقق تكون افتراضيًا `fastpq` و `v1`؛ نوع المطالبة يتم تقليمه وتحويله إلى أحرف صغيرة.

مدخلات العامة AXT FastPQ هي تجزئات تشفيرية بايتية حتمية:

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

تدْخِل مطالبة `authorization` صف منح الدور:

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

وسطر بيانات وصفية يربط سياسة التفويض. إدعاء `compliance` يُدرج سطرين من البيانات الوصفية: واحد للسياسة وواحد لمساحات البيانات المستهدفة.

بالنسبة لـ `tx_predicate` و `value_conservation`، يتم استخدام مقدار تأثير صريح عندما تحتوي الربط على مقدار أصل أو وجهة موجبة. وإلا يقوم الكود باشتقاق مقدار حتمي محدد:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

ثم تُستخدم نفس معادلات الانتقال:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

يتم توليد معرفات حسابات المرسل والمستقبل الاصطناعية من بذور المفاتيح:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

تجزئة التشفير لدفعة التحويل هي:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

قيمة هضم التشفير للكشف الفني للحزمة AXT هي SHA-256 على الترميز Norito لربط بروتوكول المعيار الفردي:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP إثباتات الرسائل الشفافة {#sccp-transparent-message-proofs}

يستخدم برنامج المساعدة SCCP أيضًا FastPQ لإثباتات الرسائل عبر السلاسل بشكل شفاف. هذا المسار منفصل عن مسار تنفيذ المدقق الخلفي `iroha3d`. يقوم ببناء دفعة FastPQ مباشرة من حزمة دليل رسالة SCCP والبيان الفني، ثم يغلف الدليل الناتج للتحقق المفتوح.

تستخدم الدفعة SCCP `fastpq-lane-balanced` وثلاث تحولات للبيانات الوصفية:

|مفتاح|عملية|
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
|`sccp:transparent:v1:payload`| `MetaSet` |

مدخلاته العامة مستمدة من الدليل الداخلي الشفاف SCCP:

| FastPQ إدخال | SCCP المصدر                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        |الـ 16 بايت الأولى من قيمة تبادل تشفير Blake2b على هاش تشفير البيان|
| `slot`        |ارتفاع الحسم|
|`old_root`|تجزئة تشفير الحمولة|
|`new_root`|جذر قيمة الالتزام التشفيري|
| `perm_root`   |تجزئة تشفيرية لكتلة الحتمية|
| `tx_set_hash` |بيان التجزئة التشفيرية|

تكتب مرمّزات SCCP المعيارية الأعداد الصحيحة بترتيب little-endian، وترمّز مصفوفات البايت متغيرة الطول كما يلي:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

سلسلة بايت الإدخال العام الشفافة هي:

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

بايتات البيان الشفافة هي تسلسل متصل من الإصدار، عائلة السلسلة، النطاقات المحلية ونطاقات الطرف المقابل، نموذج الأمان، حوكمة المرساة، ترميز الحساب، نموذج الحسم، هدف المدقق، عائلة خلفية المدقق، حقول السلسلة/الخلفية/البيان ذات الطول المسبق، ربط الوجهة بتجزئة التشفير، مفتاح الترميز للحساب، نوع الحمولة، بايتات الإدخال العامة، وتجزئة تشفير الحمولة. تجزئة البيان التشفيري هي:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

معرف فضاء البيانات FastPQ لهذا المسار البرهاني هو أول ستة عشر بايتًا من قيمة هضم تشفيرية Blake2b أخرى مسبوقة بالبادئة:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

دفعة SCCP FastPQ هي بالضبط:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

ثم تم فرزها بواسطة نفس قاعدة الترتيب FastPQ.

قيمة الالتزام التشفيري للتحقق OpenVerify هي SHA-256 على اسم الخلفية للرسالة SCCP وموصّف المتحقق الموحد المعياري للبروتوكول FastPQ:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

يتم ترميز الدليل الخام FastPQ باستخدام Norito إلى `StarkFriOpenProofV1`، ثم يُغلف في `OpenVerifyEnvelope` مع الخلفية `Stark`. يقوم التحقق من SCCP بإعادة بناء نفس FastPQ الدُفعة من الحزمة والبيان الفني، تفحص بيانات تعريف حاوية التحقق المفتوحة، وتستدعي FastPQ المحقق على الدفعة المعاد بناؤها والدليل.

## مجموعات المعلمات {#parameter-sets}

يعرض كتالوج معلمات المعيار البروتوكولي الفردي مجموعتين من المعلمات. يستخدم خط تنفيذ المُثبِّت المضيف حاليًا `fastpq-lane-balanced`.

|معامل|الغرض|حقل|الهاشات التشفيرية|FRI|
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` |معدل مرور متوازن للمثبت|امتداد رباعي جولدي لوكس|قيم الالتزام التشفيري Poseidon2، كتالوج SHA3 التسمية|الترتيب 8، الانفجار 8، 46 استعلام|
|`fastpq-lane-latency`|مسارات التنفيذ الحساسة للكمون|امتداد رباعي جولدي لوكس|قيم الالتزام التشفيري Poseidon2، كتالوج SHA3 التسمية|التعددية 16، الانفجار 16، 34 استعلامًا|

يستهدف كلاهما أمان 128 بت ويستخدم حجم نطاق أثر بقيمة `2^16`. رمز إعادة تشغيل نصوص المحادثة Rust V1 يستخرج حاليًا بايتات تحدي فيات-شامير باستخدام `iroha_crypto::Hash::new` بدلاً من استدعاء SHA3-256 مباشرة.

الثوابت الدقيقة في الكتالوج المستخدمة بواسطة المثبت Rust هي:

|ثابت| `fastpq-lane-balanced` | `fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
|`target_security`|                    128 |                   128 |
| `grinding_bits`      |                     23 |                    21 |
| `trace_log_size`     |                     16 |                    16 |
| `trace_root`         |   `0x002a247f81c6f850` |  `0x6a9f4eb38fb9b892` |
| `lde_log_size`       |                     19 |                    20 |
| `lde_root`           |   `0x60263388dbbf9b2a` |  `0x9c9c3a571b6f89ac` |
| `permutation_size`   |                 65,536 |                65,536 |
|`lookup_log_size`|                     19 |                    20 |
| `omega_coset`        |   `0x6af325e825ad5c18` |  `0x3a5fd4171e3c3a4d` |
| `fri_arity`          |                      8 |                    16 |
| `fri_blowup`         |                      8 |                    16 |
| `fri_max_reductions` |                      8 |                     6 |
| `fri_queries`        |                     46 |                    34 |

## تكوين {#configuration}

FastPQ التكوين مدمج ضمن `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

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

يمكن تجاوز نفس تسميات التنفيذ والتليمتري من `iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

يتم دعم متغيرات البيئة أيضًا في حقول التكوين. وتشمل المتغيرات الخاصة بـ FastPQ ما يلي:

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

عند تمكين القياس عن بُعد، يقوم FastPQ بتصدير مقاييس لاختيار الخلفية وسلوك بيئة تنفيذ برنامج Metal:

|متري|المعنى|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |تم طلب وحل وضع التنفيذ بواسطة ملصقات الخلفية والجهاز|
|`fastpq_poseidon_pipeline_total`|مسار سير عمل معالجة برنامج بوسيدون المطلوب والمحلول|
| `fastpq_metal_queue_depth` | حد طابور Metal، والحد الأقصى للعمليات قيد التنفيذ، وعدد عمليات الإرسال، ونافذة أخذ العينات |
|`fastpq_metal_queue_ratio`        |نسبة اشغال وطوابير المعدن والتداخل|
|`fastpq_zero_fill_duration_ms`|مدة ملء الصفر للمضيف في تشغيلات Metal|
| `fastpq_zero_fill_bandwidth_gbps` |عرض النطاق المحصّل بالتعبئة بالصفر|

لتحليل الأداء العام، استخدم هذه مع إشارات الإجماع والطابور المذكورة في [الأداء والمؤشرات](/ar/guide/advanced/metrics.md).

## مرجع ذو صلة {#related-reference}

- [مخطط نموذج البيانات](/ar/reference/data-model-schema.md) لنوع عرض البيانات في لحظة معينة الصادر عن العقدة المصدرة للسلطة
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ خيارات](/ar/reference/iroha3d-cli.md#fastpq-overrides)
