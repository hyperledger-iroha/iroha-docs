---
translation_locale: ar
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ هو Iroha- نعم . STARK طريق إثبات لتأثيرات التنفيذ المختارة. لا يحل محل تنفيذ المعاملة العادي أو الإجماع. المعاملات لا تزال تجري ISI, IVM, و Sumeragi كالمعتاد FastPQ تستهلك شهادة التنفيذ المحددة وتحول الآثار المدعومة إلى مجموعات دليل.

الاندماج الحالي للمضيف يحتوي على ثلاث مسارات رئيسية:

- تحويلات الأصول الرقمية الشفافة المسجلة أثناء تنفيذ الكتلة
- Nexus رليات الممر المؤكدة التي تحمل غلاف إثبات AXT ملزمة FastPQ
- SCCP مساعدات إثبات الرسالة الشفافة التي تغلف برهان FastPQ في غلاف مفتوح للتحقق.

## نقل طريق الشهادة {#transfer-witness-path}

تنشئ النقلات الرقمية الشفافة نسخة نقل مهيكلة عندما تتحول التعليمات إلى توازنات. تسجل النسخة:

- الحساب المصدر وحساب الوجهة وتعريف الأصول والكمية
- رصيد المرسل والمتلقي قبل وبعد التحويل
- hash نقطة دخول المعاملة المستخدمة كـ hash اللحظة
- بيان السلطة المستمد من الحساب الذي يقدم
- هضم "بوسيدون" لترانسكريبتات ديلتا واحدة

تحويلات الحزمة تستخدم نسخة واحدة مع ديلتا متعددة في هذه الحالة هضم البوسيدون واحد ديلتا غائب.

عند استكمال الكتل ، يقوم Iroha بتجميع هذه النصوص بواسطة نقطة دخول هش. ثم يحمل شهد التنفيذ كل من حزم النص الأصلية وبطاقات الانتقال FastPQ التي أعدتها للمسجل .

كل دلتا نقل يصبح صفين من الصفوف:

|الصف |شكل المفتاح|القيمة السابقة |بعد القيمة |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|الخصم المبعوث |`asset/<asset-definition>/<source-account>` |توازن المرسل قبل |توازن المرسل بعد |
|الائتمان المستلم |`asset/<asset-definition>/<destination-account>` |ميزان المستقبل قبل |ميزان المستلم بعد |

يتم تطبيع القيم الرقمية إلى وحدات شاهدة للأعداد الكاملة. يتم رفض قيمة في FastPQ إذا لم يتم تمثيلها على أنها غير سلبية `u64` على مقياس العشري المختار.

## المدخلات العامة {#public-inputs}

يحتوي كل مجموعة انتقالية FastPQ على مدخلات عامة تربط الدليل بالمناسبة بين الكتلة والتنفيذ:

|الإدخال |المعنى|
| ------------- | --------------------------------------------------------------- |
|`dsid` |معرف مساحة البيانات مرموز باستخدام بايتات صغيرة|
|`slot` |وقت إنشاء الكتل تحوّل إلى نانو ثانية |
|`old_root` |أصل الدولة الأم المستمدة من شهود الإعدام|
|`new_root` |جذور ما بعد الحكومة المستمدة من شهود الإعدام|
|`perm_root` |الالتزام بـ (بوسيدون) بشأن تصاريح الدور النشط|
|`tx_set_hash` |الهاش على المعاملات المرتبة وتشغيل الوقت نقطة دخول هاش |

المضيف يستخدم `fastpq-lane-balanced` كمعيار القنوني المحدد لهذه اللوائح.

## النموذج الرياضي {#mathematical-model}

يصف هذا القسم الرياضيات التي يتم تنفيذها من قبل المحاسب والتحقق الحالي Rust. جميع العمليات الميدانية أدناه هي على حقل أولى Goldilocks:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ يستخدم Poseidon2 أكثر من `F` للالتزامات الميدانية. الإسفنج لها عرض `t = 3`, السعر `r = 2`, والقدرة `1`. يمتص الهاش عناصر الحقل في كتلة المعدل-2 ويضيف عنصر حقل واحد. `1` قبل التغيير النهائي:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

يتم تعبئة سلاسل البايت في أطراف صغيرة من 7 بايتات بحيث يكون كل أطراف تحت `p` بشكل صارم:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

يتم تمثيل هشات الحقول المنفصلة عن المستوى على شكل:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

بالنسبة لـ"هاشيز" التي تبدأ من إضافات النطاق البايت، يقوم FastPQ بتخطيط أول ثمانية بايتات صغيرة في الحقل:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

هنا `Hash` تعني Iroha's `iroha_crypto::Hash::new`، هضم بليك2بفار 32 بايت، إلا إذا كانت الصيغة تسمي صراحة Poseidon2 أو SHA-256.

### الحسابات الميدانية {#field-arithmetic}

يمثل رمز Rust عناصر الحقل كقيم قائمة `u64` في `[0,p)`.

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

تعدد أولاً يحسب المنتج 128 بت:

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

يضيف التنفيذ مشروطًا أو ينقص `p` حتى يكون النتيجة قائمة. يتم تضمين الأرقام الكاملة الموقعة، مثل ديلتا التوازن، من خلال:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### (Poseidon2) التحول {#poseidon2-permutation}

حالة محول Poseidon2 هي:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

صندوقها S هو:

$$
S(x)=x^5
$$

تستخدم FastPQ أربع جولات كاملة، وسبعين وخمسين جولة جزئية، ثم أربعة جولات أخرى كاملة. الجولة الكاملة مع ثابتات دائرية `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` هي:

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

جميع الإضافات والمضاعفات هي في `F`. المصفوفة الكانونية MDS هي:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

hash الحقل يبدأ من حالة الصفر. لكل كتلة كاملة معدل-2 `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

الجزء الأخير يضاف إلى `1` عنصر الغطاء قبل آخر تعديل. `x_0`.

### الإدخال العام ملزم {#public-input-binding}

يقوم المضيف بتشفير هوية مساحة البيانات عن طريق كتابة قيمتها `u64` في أول ثمانية بايتات صغيرة من الحقل الـ16byte:

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

المجموعة المعاملة هي المجموعة من النطاقات البايتية على المجموعة المرتبة من نقاط الدخول:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

حيث يتم تصنيف `h_i` هيشات المعاملة والنقطة الدخولية التي تؤدي إلى الزمن. في دليل العام IO، إذا كان `perm_root` أو `tx_set_hash` هو كل صفر، فإن الباحث يملأ قيم التراجع:

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

بالنسبة لكل دلتا نقل، فإن المقياس العشري المستهدف هو الحد الأقصى من المقياس المتقطع عبر الكمية وكلاهما يميز اللقطات الفورية:

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

(أ) `Numeric` القيمة مع mantissa `m` و النطاق `q` يتم قبولها فقط عندما `m >= 0` و `q <= s`. هذا هو FastPQ قيمة الشاهد هي:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

يجب أن يتناسب النتيجة المعتادة مع `u64`.

### التنظيمات الكانونية {#canonical-ordering}

قبل بناء المسارات، يتم فرز اللحظة حسب مفتاح الانتقال ورتب العمليات ومؤشر إدخال الأصلي:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

الالتزام بالترتيب هو hash في حقل Poseidon2 على النطاق `fastpq:v1:ordering` وترميز Norito للانتقالات المرتبة:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

حيث `P` هو حزمة من 7 بايت، `E` هو Norito التشفير، `D_o` هو `fastpq:v1:ordering`, و `T*` هو قائمة الانتقال المرتبة.

### معادلات النقل {#transfer-equations}

بالنسبة لمبلغ التحويل `a` ، ميزان المرسل `f` ، وميزان المستلم `t` ، يؤكد FastPQ قيم الشاهد المعايشة قبل بناء العلامات:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

الصفوف الانتقالية ثم تشفر:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

في الداخل، يتم تقليص النطاقات الموقعة إلى `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

الاختياري واحد ديلتا تحويل إضافة يرتكب مخطوطة نقل الصورة المسبقة:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

بالنسبة لنسخ نقل متعددة الديلتا، يتطلب النموذج الحالي عدم وجود هذا المخطط على مستوى أعلى.

الجهاز المضيف الذي يحقق إصدار النسخة هو:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### الصفوف التي تتبعها {#trace-rows}

دع القائمة المرتبة للانتقال تحتوي على `n` الصفوف الحقيقية. طول البحث هو قوة التالية من اثنين:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

الصفوف `0..n-1` نشطة، والصفوف `n..N-1` هي صفوف التغطية. كل صف حقيقي لديه مجموعة واحدة من اختيار العمليات:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

جميع أعمدة الاختيار هي بولية:

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

يقوم البنّاء أيضاً بتتبع النطاقات التي تُجري في كل أصول:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

فقط صفوف المنت والحرق تحديث عداد الإمدادات:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

أعمدة البيانات المعدنية والمساحة البيانية تعتبر حشيشات الحقول التي تم استنباطها قبل تطبيق الصف:

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

hash البيانات المعدنية، hash مساحة البيانات، والفرق مستقرة عبر الصفوف التتبعية المجاورة:

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

خطوط النقل تحمل مسار ميركل نادر على 32 مستوى. إذا كان دليل مضيف مفقودًا ، يقوم الباحث بتجميع مسار تحديدي من مفتاح الصف ، قبل التوازن ، وما إذا كان الصف طرف المرسل أو الجانب المستلم .

بالنسبة للمسارات الاصطناعية، ملح النكهة هو `fastpq:smt:from` لصفوف المرسلين و `fastpq:smt:to` لصفوف المستلمين:

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

يسجل البصمة `b_l` ، والأخوة `s_l` ، وعقد الدخول `x_l` ، وعقد الخروج `x_{l+1}` في كل مستوى. مع اتفاقية فرع الرمز:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### أوراق الإذن {#permission-hashes}

صفوف إعطاء الدور وإلغاء الادعاء يحتوي على شهادة الإذن:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

يقوم جدول الإذن المضيف بتقسيم إدخالات الجذر حسب البايتات الدورية وبايتات الإذن وبايتات العصر ، ثم يبني شجرة بوسيدون2 مريكل:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

مستويات عرض العشوائية تضاعف العنصر النهائي.

### الالتزام بالتعقب {#trace-commitment}

بالنسبة لكل عمود تعقب `c` ، يقوم FastPQ أولاً بتقاطع قيم العمود على نطاق العقب ويتم تخصيص متجه المعامل:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

الجذر التتبع هو جذر Poseidon2 Merkle فوق الالتزامات العمود:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

التزام البصمة النهائي هو حش بايت على النطاق ومجموعة المعلمات وشكل البصمة وتضخيم العمود وجذر البصمة:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

حيث أن `D_c` هو `fastpq:v1:trace_commitment`.

### AIR تكوين {#air-composition}

قيمة التركيب V1 AIR هي مزيج خطي من النفايات المحلية في الصفوف.

$$
\alpha_0,\alpha_1 \in F
$$

لكل زوج من الصفوف المجاورة `(i,i+1)` ، يقوم المؤشر بحساب:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

البقايا `rho` هي، في ترتيب الرمز:

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

يقوم المحقق بإعادة احتساب `A_i` لفتحات الصف التي تم أخذها من العينة ويتحقق منه مقابل قيمة التكوين المتعهد بها بموجب جذور Merkle للتركيب AIR.

### منتج البحث {#lookup-product}

يستخدم مكثف البحث عن الإذن تحدي Fiat-Shamir `gamma`. خلال تقييمات التوسع منخفضة الدرجة ل`s_perm` و `perm_hash` ، يتم تشغيل المنتج:

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

دع `omega_T` يكون مولد النطاقات التتبعية، و `omega_E` مولد المجال التقييمي، و `g` تعويض الكوزيت الذي يتم تشكيله. بالنسبة لعمدة التتبع ذات القيم `v_i`، فإن الاستقطاب ينتج معدلًا `a_j` بحيث

$$
f(\omega_T^i)=v_i
$$

يقدر التوسع منخفض الدرجة نفس الكلمة المتعددة على الجمع:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

يقوم التنفيذ بحساب هذا عن طريق مضاعفة المعاملات بسلطات تعويض المجموعة قبل FFT:

$$
a'_j = a_j g^j
$$

ومن ثم تقييم `a'` في مجال التقييم.

CPU FFT هو تحويل متكرر رادكس-2 كولي-توكي على المدخلات المعاكسة بيت. في طول المرحلة `L` ، نصف طول `H=L/2`، وجذر المرحلة:

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

يقوم العكس FFT بنفس التحوّل مع `omega^{-1}` ويزيد من خلال حجم النطاق المعاكس:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

يتم التحقق من صحة جذور الكتالوج قبل استخدامها:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

بالنسبة للمناطق الصغيرة المشتقة من جذور الكتالوج، فإن الجهاز المصدر هو:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### حشيشات الصفوف والأوراق {#row-and-leaf-hashes}

بعد LDE, FastPQ الاختيارات في كل سطر على جميع LDE الأعمدة. `m` الأعمدة:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

إذا كانت الحشيشات الصفية لا تزال على نطاق التتبع بدلاً من نطاق تقييم، فإن الباحث يتداخل ويقوم بتوسيع عمود حشيش الصف الواحد بنفس العملية LDE.

### فتحات ميركل {#merkle-openings}

يتم تجميع قيم LDE إلى قطع من:

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

المستويات العشوائية تكرر العقدة الأخيرة. يتم التحقق من مسارات الاستفسار عن طريق تشغيل اليسار أو اليمين وفقًا لمساوية مؤشر ورقة الاستفسار في كل مستوى.

لصفحة عند مؤشر `i` ، يتم التحقق من مسار `(s_0,\ldots,s_{d-1})` ضد الجذر `R` عن طريق تكرار:

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

AIR أوراق الصفوف المتبعة هي:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR الأوراق المكونة هي:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

يقوم فتح استفسار LDE أيضًا بتحقق من وجود القيمة المفتوحة في مؤشر التقييم `i` في الجزء المصدق:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI مقوّمة {#fri-folding}

FRI يتعهد بتقييمات التركيب AIR. لكل جولة `l` ، تقوم عينات النسخة بإجراء تحدي `beta_l`. يتم تعبئة الطبقة إلى مضاعف من arity عن طريق تكرار القيمة الأخيرة. تنطوي كل مجموعة بحجم arity على:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

حيث `a` هو ثقافة FRI. يتحقق المحقق، لكل سلسلة استفسارات منقطعة عن عينات، أن:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

وتصديق كل مجموعة FRI مفتوحة ضد الجذر الطبقة المقابلة FRI.

### النسخة فيات-شمير {#fiat-shamir-transcript}

يسمي كتالوج المعلمات القانونية لغة النسخة الاختبارية SHA3-256. تنفيذ البحث والتحقق الحالي يستخرج بيانات التحدي مع `iroha_crypto::Hash::new` ، وهو إضافة بليك2بفار 32 بايتًا، ثم يقلل من أول ثمانية بيانات صغيرة إلى `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

مكالمات التحدي إضافة الجهاز الكامل إلى حالة النسخة. الترتيب لإعادة تشغيل هو:

1. العام IO ، نسخة البروتوكول، ونسخة المعلمات، واسم المعلمات
2. LDE الجذر والجذر المتبعة
3. `gamma`
4. تحديات التركيبة AIR `alpha_0` ، `alpha_1`
5. AIR جذور البصمة و AIR جذور التكوين
6. البحث المنتج الكبير
7. أصول الطبقة FRI وتحديات `beta_l`
8. مؤشرات الاستفسارات التي تم أخذها عن عينات

يستمر أخذ العينات المطلوبة في رسم مقاطع تحدي 32 بايت وقراءةها كجزء صغير من `u64` حتى يحصل على عدد المؤشرات الفريدة المطلوبة:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

يتم إرجاع مجموعة العينات بالترتيب المرتب.

### إعادة تشغيل المحقق {#verifier-replay}

يقوم المحقق أولاً بإعادة احتساب الالتزام بالحزمة:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

ويتطلب:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

كما يعيد بناء الجمهور IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

يجب أن تتطابق كل حقل مع البايت العام للدليل IO. ثم يقوم المحقق بإعادة بناء نفس النسخة ويحصل على نفسها:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

لكل استفسار تم اختياره في العينة `q` ، يتم التحقق من:

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

(الـ) AIR فتح التركيب يجب أن تكون مصادقة تحت: `R_air_composition`. (الـ) FRI السلسلة تبدأ من نفس `A_q` ويجب أن ينتهي في نهاية مؤكدة FRI أوراق تحت المحطة FRI الجذر.

## ما يتحقق منه القرآن {#what-the-prover-checks}

قبل بناء المسار، يقوم برنامج FastPQ بتحريف ترتيب الحزمة عن طريق مفتاح الانتقال ، رتبة العمليات ، وترتيب إدخال. تتطلب خطوط النقل أيضًا بيانات البيانات المترجمة. تكون حزمة ذات صفات النقل ولكن لا توجد نسخ نقل غير صالحة.

بالنسبة لنسخ النقلات، تشمل التحققات الجانبية للاستثمار:

- لا يجوز أن يتدفق رصيد المرسل
- يجب أن يكون `sender_after` = `sender_before - amount`
- يجب أن يكون `receiver_after` = `receiver_before + amount`
- يجب أن تغطي النسخة كل صف نقل في اللحظة.
- يجب أن يتطابق هضم بوزيدون ذو دلتا واحدة، عندما يكون موجوداً، مع الصورة الأولى من النص.
- إذا كانت أدلة ميركل النادرة يجب أن يتم فكها كإصدار 1 ، فإن المسارات المفقودة تملأ بأدلة صناعية تحديدية.

يحتوي المسار على أعمدة اختيارية لنقل، ورقة النقود، حرق، منح الدور، إلغاء الدور، مجموعة البيانات المعدنية، وصفوف البحث عن الإذن. الصفوف العملية الرقمية تحمل أيضًا ديلتا موقعة، وتشغيل ديلتا لكل أصول، ومدادات الإمدادات.

## (لاين) {#prover-lane}

`irohad` يبدأ طريق إثبات FastPQ عند البدء إذا كان يمكن تشغيل نهاية الخلفية الإثبات. المسار هو مهمة خلفية مع صف محدد. بعد أن ينتج كتلة شهادة تنفيذ ، يقوم مسار الالتزام بإرسال عمل إثبات يحتوي على هشات الكتلة وارتفاعها ورؤيتها وشهدها.

إذا لم يتم تشغيل الشارع أو كان الصف ممتلئًا ، فيتم تخطي الوظيفة وتستمر معالجة الكتل العادية. وهذا يعني أن شارع البحث الخلفي ليس بوابة قبول المعاملات أو إجماع. إنه طريق إثبات الإنتاج على الحالة التي تم تنفيذها بالفعل.

الشارع يبني إشارة مع:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` يسمح للمؤكد باختيار الخلفية المتاحة. تنفيذ `cpu` الألواح إلى CPU. `gpu` تفضل تنفيذ GPU، مع CPU fallback حيث لا يمكن للخلفية استخدام النواة المطلوبة.

## التحقق {#verification}

FastPQ التحقق من الأدلة يعيد بناء الالتزام الكانونيكي للمجموعة ويستبدل النسخة العامة. يقوم المحقق بتحقق من إصدار البروتوكول، والإصدار المحدد للبرامج، ومحدود الإعادة تشغيل، والتزام المسار، والمدخولات العامة، وفتحات Merkle التي تم اختبارها، وفتوحات AIR، وسلسلة استفسارات FRI.

الحدود الافتراضية المتخلفة تشمل:

|الحد|افتراضي |
| ------------------ | ------: |
|صفوف الانتقال |     256 |
|حجم الحمولة المفيدة|256 KiB |
|FRI طبقات |      16 |
|فتحات الأسئلة |     128 |

## Nexus رليات مؤكدة {#nexus-verified-relays}

غلافات إثبات Nexus AXT يمكن أن تضم `AxtFastpqBinding`. عند تنفيذ `RegisterVerifiedLaneRelay` ، Iroha:

1. يتحقق من غلاف إرسال المسار و FastPQ مواد الدعم.
2. يتحقق من مساحة البيانات والجذر الإبداعي
3. تُفكّر ملفة الدليل AXT
4. يتطلب `fastpq_binding`
5. يعيد بناء اللحظة FastPQ من تلك الالتزام.
6. يفكّر دليل FastPQ المدمج
7. يدعو المحقق FastPQ على اللحظة التي تم بناؤها وإثباتها

إذا نجحت التحقق، يقوم Iroha بتخزين `VerifiedLaneRelayRecord` الذي يحتوي على مرجع الرصيف والغلاف الأصلي وشبكة الحمل المفيد للدليل وارتفاع التحقق وأصل المظاهر وربط FastPQ.

غلافات إرسال الشارع تحمل أيضاً رقيقة FastPQ مادة إثبات. المواد هي هضم على الهوية المسار، هوية مساحة البيانات، ارتفاع الكتلة، ارتفاع التحقق من الكتلة الحاجز التسوية ، والجذر المظهر. إرسال يسمح بالاندماج فقط عندما يكون له كل من QC وموثوقة FastPQ مادة الدليل

### AXT رياضيات ملزمة {#axt-binding-math}

بالنسبة لمغلفات Nexus AXT ، يتم تشكيل `AxtFastpqBinding` قبل إعادة عرض الأدلة. قيم المعايير الفارغة افتراضية إلى `fastpq-lane-balanced`؛ ID المؤكد الفارغة والإصدار الافتراضي إلى `fastpq` و `v1` ؛ يتم تخفيض نوع المطالبة وتخفيضها.

المدخلات العامة AXT FastPQ هي حشيشات البايت المحددة:

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

مفاتيح الانتقال AXT هي:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

في الطلب `authorization` يتم إدخال سطر للحصول على الحسابات:

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

وسلسلة البيانات المعدنية التي تربط سياسة الترخيص. تضع الطلب `compliance` صفين من البيانات المتعددة: واحد للسياسة والآخر للمناطق المستهدفة للبيانات.

لـ `tx_predicate` و `value_conservation`، يتم استخدام كمية تأثير صريحة عندما يحتوي العلاقة على كمية مصدر أو وجهة إيجابية. وإلا فإن الرمز يستخرج كمية تحديدية محددة:

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

يتم إنشاء هويات حساب المرسل والمستلم الصناعي من البذور الرئيسية:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

الحشيش النقدي للمجموعة هي:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

المخطط الإجمالي لـ AXT هو SHA-256 فوق ترميز Norito للعلاقة القنونية:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP إثباتات الرسالة الشفافة {#sccp-transparent-message-proofs}

يستخدم صندوق المساعدة SCCP أيضًا FastPQ لإثبات رسائل عبر السلسلة الشفافة. هذا الطريق منفصل عن طريق إثبات الخلفية `irohad`. يقوم ببناء مجموعة FastPQ مباشرة من حزمة إثبات الرسالة SCCP ومشورة، ثم يلف الأدلة الناتجة للتحقق المفتوح.

تستخدم اللفة SCCP `fastpq-lane-balanced` وثلاث عمليات انتقال البيانات المعدنية:

|المفتاح|العملية|
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

مدخلاتها العامة مشتقة من دليل داخلي شفاف SCCP:

|إدخال FastPQ |SCCP المصدر |
| ------------- | ---------------------------------------------------------- |
|`dsid` |أول 16 بايت من إرسال Blake2b على البيان hash |
|`slot` |ارتفاع النهاية |
|`old_root` |الحمل المفيد|
|`new_root` |جذور الالتزام|
|`perm_root` |بلوك النهائي هاش|
|`tx_set_hash` |البيانات |

يقوم SCCP المرموزات القانونية بكتابة الأرقام الكاملة الصغيرة وترميز صفوف البايت ذات الطول المتغير على النحو:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

سلسلة البايتات العامة الشفافة هي:

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

البيانات الشفافة هي سلسلة الإصدار، عائلة السلسلة، النطاقات المحلية والجهة المقابلة، ونموذج الأمن، حوكمة المرساة، كوديك الحساب، نموذج النهاية، هدف المؤكد، عائلة مؤكدة الخلفية، وحقول سلسلة/خلفية الخلفية/الظاهرة المثبتة على الطول، وتحديد الوجهة. مفتاح كوديك الحساب، نوع الحمولة المفيدة، البايتات المدخولية العامة، والحملة المفادة.

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

هوية مساحة البيانات FastPQ لهذه المسار الإثباتية هي أول ستة عشر بايت من برنامج بليك2ب المسبق:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

اللحظة SCCP FastPQ هي بالضبط:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

ثم يتم فرزها بنفس القاعدة FastPQ.

الالتزام بالمتحقق OpenVerify هو SHA-256 على اسم الخلفية لرسالة SCCP ووصف التحقق القنوني FastPQ:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

يتم تشفير دليل FastPQ الخام في Norito إلى `StarkFriOpenProofV1` ، ثم يُغلف في `OpenVerifyEnvelope` مع مؤخرة `Stark`. يقوم التحقق من SCCP بإعادة بناء نفس اللحظة FastPQ من الحزمة والإشارة، ويتحقق من البيانات الأساسية المفتوحة في غلاف التحقق. ويدعو المحقق FastPQ على اللحظة والدليل الذي تم إعادة بناؤه.

## مجموعات المعلمات {#parameter-sets}

كتالوج المعلمات القانونية يعرض مجموعتين من المعلمات. يستخدم خط البحث المضيف حاليا `fastpq-lane-balanced`.

|المعلم |الغرض|الحقل|الحشيش |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |إصدار متوازن|الـ (جولديلوكس) التوسع التربيعي|الالتزامات بـ "بوسيدون2" ، الكتالوج SHA3 |النقطة 8 ، الإنفجار 8 ، 46 استفسار |
|`fastpq-lane-latency` |طرق حساسة من التأخير |الـ (جولديلوكس) التوسع التربيعي|الالتزامات بـ "بوسيدون2" ، الكتالوج SHA3 |السؤال 16، الإنفجار 16، 34 سؤال |

كلاهما يستهدف أمن 128 بت واستخدم حجم النطاق المتبعة من `2^16`. رمز إعادة تشغيل النسخة Rust V1 يستخرج حاليًا بايتات تحدي Fiat-Shamir مع `iroha_crypto::Hash::new` بدلاً من الاستدعاء المباشر إلى SHA3-256.

مستمرات الكتالوج الدقيقة المستخدمة من قبل Rust المؤشر هي:

|مستمرة|`fastpq-lane-balanced` |`fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
|`target_security` |                    128 |                   128 |
|`grinding_bits` |                     23 |                    21 |
|`trace_log_size` |                     16 |                    16 |
|`trace_root` |`0x002a247f81c6f850` |`0x6a9f4eb38fb9b892` |
|`lde_log_size` |                     19 |                    20 |
|`lde_root` |`0x60263388dbbf9b2a` |`0x9c9c3a571b6f89ac` |
|`permutation_size` |                 65,536 |                65,536 |
|`lookup_log_size` |                     19 |                    20 |
|`omega_coset` |`0x6af325e825ad5c18` |`0x3a5fd4171e3c3a4d` |
|`fri_arity` |                      8 |                    16 |
|`fri_blowup` |                      8 |                    16 |
|`fri_max_reductions` |                      8 |                     6 |
|`fri_queries` |                     46 |                    34 |

## التكوين {#configuration}

تكوين FastPQ يقع تحت `zk.fastpq`.

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

يمكن إلغاء نفس علامات التنفيذ والتلفونية من `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

يتم دعم متغيرات البيئة أيضًا للحقول التكوينية. تتضمن المتغيرات الخاصة FastPQ:

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

عندما يتم تمكين الهواتف عن بعد، FastPQ تصدر المقاييس لانتخاب الخلفية والسلوك في وقت تشغيل المعادن:

|الميترات|المعنى|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |النظام التنفيذي المطلوب والحل حسب العلامات الخلفية والجهاز |
|`fastpq_poseidon_pipeline_total` |مسار خط أنابيب (بوسيدون) الطلب والحل|
|`fastpq_metal_queue_depth` |الحد الأقصى للصف المعدني، العدد القصوى في الرحلة، وعدد الإرسال، ونوافذ أخذ العينات |
|`fastpq_metal_queue_ratio` |الصف المعدني مزدحم ونسب التداخل |
|`fastpq_zero_fill_duration_ms` |تستضيف مدة التعبئة الصفرية لمتصفحات المعادن |
|`fastpq_zero_fill_bandwidth_gbps` |نطاق النطاق المشتق من الصفر .|

لتحديد الأداء بشكل عام، استخدم هذه مع إشارات الإجماع والصف المدرجة في [الأداء والمقاييس ](/ar/guide/advanced/metrics.md).

## الإشارة ذات الصلة {#related-reference}

- [مخطط نموذج البيانات ](/ar/reference/data-model-schema.md) للتفاصيل النموذجية المولدة
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ خيارات](/ar/reference/irohad-cli.md#arg-fastpq-execution-mode)
