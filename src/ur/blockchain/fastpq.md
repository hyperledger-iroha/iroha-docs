---
translation_locale: ur
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ Iroha کے منتخب کردہ عملدرآمد اثرات کے لئے STARK ثبوت کا راستہ ہے۔ یہ معمول کے لین دین کے عملدرآمد یا اتفاق رائے کی جگہ نہیں لیتا۔ ٹرانزیکشنز اب بھی معمول کے مطابق ISI, IVM ، اور Sumeragi کے ذریعے چلتی ہیں۔ FastPQ Deterministic execution witness کو استعمال کرتا ہے اور حمایت یافتہ اثرات کو ثبوت کے بیچوں میں بدل دیتا ہے۔

موجودہ میزبان انٹیگریشن میں تین اہم راستے ہیں:

- بلاک پر عملدرآمد کے دوران ریکارڈ کئے گئے شفاف عددی اثاثے کی منتقلی
- Nexus تصدیق شدہ لین ریلے جن کے AXT ثبوت لفافے میں ایک FastPQ پابندیاں ہیں۔
- SCCP شفاف پیغام پروف ہیلپرز جو ایک FastPQ ثبوت کو کھلی تصدیق کے لفافے میں پھنساتے ہیں۔

## گواہوں کا راستہ منتقل کریں {#transfer-witness-path}

شفاف عددی منتقلیاں ایک منظم منتقلی ٹرانسکرپٹ تخلیق کرتی ہیں جب ہدایات توازن کو تبدیل کرتی ہیں۔ ٹرانسکریپٹ ریکارڈ:

- ماخذ اکاؤنٹ، منزلہ اکاؤنٹ، اثاثے کی تعریف اور رقم
- منتقلی سے پہلے اور بعد میں بھیجنے والے اور وصول کرنے والے کے توازن
- ٹرانزیکشن انٹری پوائنٹ ہیش کے طور پر استعمال کیا جاتا ہے
- جمع کرانے والے اکاؤنٹ سے حاصل کردہ اتھارٹی کا ڈائجسٹ
- سنگل ڈیلٹا ٹرانسکرپٹ کے لئے پوزیڈون کا ہضم

بیچ ٹرانسفر میں متعدد ڈیلٹا کے ساتھ ایک نقل کا استعمال ہوتا ہے۔ اس صورت میں واحد ڈیلٹا پوزیڈون ڈائجسٹ غائب ہے۔

بلاک کو حتمی شکل دینے پر ، Iroha ان ٹرانسکرپٹ کو اندراج نقطہ ہیش کے ذریعہ گروپ کرتا ہے۔ عملدرآمد کا گواہ پھر اصل ٹرانسکریپٹ بنڈل اور FastPQ ٹرانزیشن بیچ دونوں لے جاتا ہے جو پروور کے لئے تیار کیا گیا تھا۔

ہر ٹرانسفر ڈیلٹا دو منتقلی صفوں میں بدل جاتا ہے:

|صف |کلیدی شکل |پری ویلیو |پوسٹ ویلیو |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|بھیجنے والا ڈیبٹ |`asset/<asset-definition>/<source-account>` |بھیجنے والے توازن سے پہلے |بھیجنے والے توازن کے بعد|
|وصول کنندہ کریڈٹ |`asset/<asset-definition>/<destination-account>` |وصول کنندہ توازن سے پہلے | کے بعد وصول کنندہ توازن|

عددی اقدار کو عددی گواہ اکائیوں میں معمول پر لایا جاتا ہے۔ FastPQ بیچنگ کے لئے ایک قدر مسترد کردی جاتی ہے اگر اسے منتخب شدہ اعشاریہ پیمانے پر غیر منفی `u64` کے طور پر نمائندگی نہیں کی جاسکتی ہے۔

## عوامی ان پٹ {#public-inputs}

ہر FastPQ منتقلی بیچ میں عوامی ان پٹ ہوتے ہیں جو ثبوت کو بلاک اور عمل درآمد کے تناظر سے منسلک کرتے ہیں:

|ان پٹ |معنی |
| ------------- | --------------------------------------------------------------- |
|`dsid` |ڈیٹا بیس کی شناخت کے طور پر کوڈ چھوٹے انڈین بائٹس |
|`slot` |بلاک تخلیق کا وقت نینو سیکنڈ میں تبدیل |
|`old_root` |والدین کی ریاست کا جڑ جس سے سزائے موت کے گواہ اخذ کیا گیا ہے |
|`new_root` |ریاست کے بعد جڑیں سزائے موت کے گواہ سے حاصل |
|`perm_root` |فعال کردار کی اجازتوں پر پوزیڈون کا عزم |
|`tx_set_hash` |ٹرانزیکشن اور ٹائم ٹرگر انٹریپوائنٹ ہیشز کے اوپر ہاش|

میزبان `fastpq-lane-balanced` کو ان بیچوں کے لئے مقرر کردہ کینونیکل پیرامیٹر کے طور پر استعمال کرتا ہے.

## ریاضیاتی ماڈل {#mathematical-model}

اس حصے میں موجودہ Rust پروور اور تصدیق کنندہ کے ذریعہ نافذ کردہ حساب کتاب کی وضاحت کی گئی ہے۔ نیچے دیئے گئے تمام فیلڈ آپریشنز گولڈلیکس پرائم فیلڈ پر ہیں:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ میدان کی ذمہ داریوں کے لئے `F` پر Poseidon2 کا استعمال کرتا ہے۔ اسفنج میں چوڑائی `t = 3` ، شرح `r = 2` اور گنجائش `1` ہے۔ ہیش ریٹ-2 بلاکس میں فیلڈ عناصر کو جذب کرتا ہے اور حتمی تبدیلی سے پہلے ایک واحد فیلڈ عنصر `1` شامل کرتا ہے۔

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

بائٹ سٹرنگز کو 7 بائٹ کے چھوٹے اینڈین ٹانگوں میں پیک کیا گیا ہے تاکہ ہر ٹانگ سختی سے `p` سے نیچے ہو:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

ڈومین سے علیحدہ فیلڈ ہیشز کو مندرجہ ذیل طور پر نمائندگی کی جاتی ہے:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

بائٹ ڈومین ڈیجسٹ سے شروع ہونے والے ہیشوں کے لئے ، FastPQ پہلے آٹھ چھوٹے اینڈین بائٹس کو فیلڈ میں نقشہ کرتا ہے:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

یہاں `Hash` کا مطلب ہے Iroha کے `iroha_crypto::Hash::new`، ایک 32 بائٹ Blake2bVar ڈائجسٹ، جب تک کہ کسی فارمولے میں واضح طور پر Poseidon2 یا SHA-256 کا نام نہیں ہوتا.

### فیلڈ ارتھمیٹکس {#field-arithmetic}

Rust کوڈ فیلڈ عناصر کی نمائندگی کرتا ہے جو `[0,p)` میں کینونیکل `u64` اقدار کے طور پر ہیں۔ اضافہ اور نکالنا:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

ضرب سے پہلے 128 بٹ کی مصنوعات کا حساب لگایا جاتا ہے:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

اس کے بعد گولڈلیکس کمی کی شناخت کا استعمال کرتا ہے:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

اگر:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

پھر کم کرنے والے کا حساب لگاتا ہے:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

عمل درآمد مشروط طور پر `p` کو شامل یا نکالتا ہے جب تک کہ نتیجہ کینیکل نہ ہو جائے۔ دستخط شدہ انٹیجرز، جیسے بیلنس ڈیلٹا، درج ذیل کی طرف سے سرائے جاتے ہیں:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 تبدیلی {#poseidon2-permutation}

Poseidon2 permutation کی حالت ہے:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

اس کا ایس باکس ہے:

$$
S(x)=x^5
$$

FastPQ چار مکمل راؤنڈ ، پچاس سات جزوی راؤنڈ استعمال کرتا ہے ، پھر چار مزید مکمل راؤنڈز۔ گول مستقل `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` کے ساتھ ایک پورا راؤنڈ ہے:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

جزوی راؤنڈ ہے:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

تمام اضافے اور ضربیں `F` میں ہیں۔ کینونیکل MDS میٹرکس یہ ہے:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

فیلڈ ہیش صفر ریاست سے شروع ہوتا ہے۔ ہر مکمل شرح-2 بلاک کے لئے `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

آخری بلاک ایک آخری تبدیلی سے پہلے `1` بھرنے کا عنصر شامل کرتا ہے۔ آؤٹ پٹ `x_0` ہے.

### عوامی ان پٹ پابند {#public-input-binding}

میزبان 16 بائٹ فیلڈ کے پہلے آٹھ چھوٹے اینڈین بائٹس میں اس کی `u64` قدر لکھ کر ڈیٹا اسپیس آئی ڈی کوڈ کرتا ہے:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

بلاک تخلیق کا وقت ملی سیکنڈ سے نینو سیکنڈ میں تبدیل کیا جاتا ہے:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

ٹرانزیکشن سیٹ ہیش ترتیب شدہ انٹریپوائنٹ ہیشوں پر بائٹ ڈومین ہیش ہے:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

جہاں `h_i` ٹرانزیکشن اور ٹائم ٹرگر انٹری پوائنٹ ہیشز کو ترتیب دیا گیا ہے۔ ثبوت عوامی IO میں ، اگر `perm_root` یا `tx_set_hash` تمام صفر ہے تو ، پروور فال بیک ویلیوز بھرتا ہے:

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

### عددی معمول سازی {#numeric-normalization}

ہر ٹرانسفر ڈیلٹا کے لئے، ہدف اعشاریہ پیمانے کی مقدار اور دونوں توازن snapshots بھر میں زیادہ سے زیادہ کٹایا پیمانے ہے:

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

ایک `Numeric` قدر جس میں mantissa `m` اور پیمانے پر `q` شامل ہیں وہ صرف اس وقت قبول کی جاتی ہے جب `m >= 0` اور `q <= s`۔ اس کا FastPQ گواہ قدر یہ ہے:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

معمول کے مطابق نتیجہ `u64` میں فٹ ہونا چاہئے.

### کینونیکل آرڈرنگ {#canonical-ordering}

ٹریس تعمیر سے پہلے، بیچ کو منتقلی کی کلید، آپریشن کی درجہ بندی اور اصل اندراج انڈیکس کے مطابق ترتیب دیا جاتا ہے:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

آرڈرنگ کی ذمہ داری ڈومین `fastpq:v1:ordering` اور Norito کوڈنگ پر پوزیڈون 2 فیلڈ ہیش ہے جو ترتیب شدہ منتقلی:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

جہاں `P` 7 بائٹ کی پیکنگ ہے ، `E` Norito کوڈنگ ہے ، `D_o` `fastpq:v1:ordering` ہے ، اور `T*` ترتیب شدہ منتقلی کی فہرست ہے۔

### منتقلی کے مساوات {#transfer-equations}

منتقلی کی رقم کے لئے `a`, بھیجنے والا توازن `f`, اور وصول کنندہ بیلنس `t`, FastPQ ٹریس کی تعمیر سے پہلے معیاری شاہد اقدار کو درست کرتا ہے:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

اس کے بعد منتقلی صفیں کوڈ:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

نشان کے اندر، دستخط شدہ ڈیلٹا `F` میں کم کیا جاتا ہے:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

اختیاری سنگل ڈیلٹا ٹرانسفر ڈائجسٹ کوڈڈ ٹرانسفارمر پری امیج کا کام کرتا ہے:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

ملٹی ڈیلٹا ٹرانسفر ٹرانسکرپٹ کے لیے، موجودہ فارمیٹ کی ضرورت ہوتی ہے کہ یہ اعلیٰ سطح کا ہضم نہ ہو۔

منتقلی ٹرانسکرپٹ کے لئے میزبان اتھارٹی کا ہضم:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### ٹریس لائنز {#trace-rows}

ترتیب شدہ منتقلی کی فہرست میں حقیقی صفیں `n` شامل ہوں. ٹریس لمبائی دو کی اگلی طاقت ہے:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

صفیں `0..n-1` فعال ہیں؛ قطاریں `n..N-1` بھرنے والی قطاریں ہیں۔ ہر حقیقی قطار میں ایک آپریشن سلیکٹر سیٹ ہے:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

تمام منتخب کرنے والے کالم Boolean ہیں:

$$
s(s-1)=0
$$

اجازت کی تلاش کی قطاریں بالکل رول دینے اور کردار منسوخ کرنے والی قطاریں ہیں:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

عددی کارروائی کی صفوں کے لئے:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

بلڈر بھی فی اثاثہ ڈیلٹا چل رہا ہے ٹریک کرتا ہے:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

صرف مینٹ اور برن قطاریں سپلائی کاؤنٹر اپ ڈیٹ کریں:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

میٹا ڈیٹا اور ڈیٹا اسپیس ٹریس کالم صفوں کی مادیت سے پہلے حاصل کردہ فیلڈ ہیش ہیں:

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

میٹا ڈیٹا ہیش ، ڈیٹا اسپیس ہیش ، اور سلاٹ ملحقہ ٹریس لائنوں پر مستحکم ہیں:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### مرکل کالم منتقل کریں {#transfer-merkle-columns}

ٹرانسفر لائنز میں 32 سطحوں کا نایاب میرکل راستہ ہوتا ہے۔ اگر میزبان ثبوت غائب ہے تو ، پروور صف کی کلید سے ایک تعیناتی راستہ ترکیب کرتا ہے ، پہلے توازن ، اور یہ کہ آیا صف بھیجنے والا یا وصول کنندہ طرف ہے۔

مصنوعی راستوں کے لئے، ذائقہ نمک `fastpq:smt:from` بھیجنے والے صفوں اور `fastpq:smt:to` وصول کرنے والے صفوں کے لئے ہے:

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

مصنوعی پتوں اور اندرونی نوڈس ہیں:

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

ٹریس ہر سطح پر بٹ `b_l` ، بہن بھائی `s_l` ، ان پٹ نوڈ `x_l` ، اور آؤٹ پٹ node `x_{l+1}` ریکارڈ کرتا ہے۔ کوڈ کی شاخ کنونشن کے ساتھ:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### اجازت کے ہاش {#permission-hashes}

کردار کی اجازت دینے اور منسوخ کرنے کے صفوں ہیش اجازت کا گواہ

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

میزبان اجازت ٹیبل روٹ رول بائٹس ، اجازت بائٹس اور ایپوک بائٹس کے ذریعہ اندراجات کو ترتیب دیتا ہے ، پھر پوزیڈون2 مرکل درخت بناتا ہے:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

غیر معمولی چوڑائی کی سطحیں آخری عنصر کو دوگنا کرتی ہیں۔

### ٹریسنگ کا عہد {#trace-commitment}

ہر ٹریس کالم `c` کے لیے، FastPQ سب سے پہلے ٹریس ڈومین پر کالم کی اقدار کو انٹرپول کرتا ہے اور کوفیشن ویکٹر کو ہیش کرتا ہے۔:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

ٹریس جڑ کالم کے عہدوں پر Poseidon2 Merkle جڑ ہے:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

آخری ٹریس عہد نامہ ڈومین، پیرامیٹر سیٹ، ٹریس شکل، کالم ڈائجسٹ اور ٹریس جڑ پر بائٹ ہیش ہے:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

جہاں `D_c` ہے `fastpq:v1:trace_commitment`.

### AIR ساخت {#air-composition}

V1 AIR ساخت کی قیمت قطار مقامی باقیات کا ایک لکیری مجموعہ ہے. ٹرانسکرپٹ نمونے دو چیلنجوں پر مشتمل ہیں:

$$
\alpha_0,\alpha_1 \in F
$$

ہر ملحقہ صف جوڑی `(i,i+1)` کے لئے ، پروور کا حساب لگاتا ہے:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

باقیات `rho` کوڈ ترتیب میں ہیں:

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

عددی کالموں والی صفوں کے لئے:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

اور مستحکم بیچ سیاق و سباق کالموں کے لئے:

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

تصدیق کنندہ `A_i` کے لئے دوبارہ حساب کرتا ہے نمونے میں شامل قطار کھلنے اور اس کی جانچ پڑتال مرکب AIR مرکب مرکل جڑ کے تحت انجام دی گئی ساخت کی قیمت کے ساتھ.

### تلاش کی مصنوعات {#lookup-product}

اجازت کی تلاش کے accumulator Fiat-Shamir چیلنج کا استعمال کرتا ہے `gamma`. کم درجے کی توسیع کے جائزوں کے دوران `s_perm` اور `perm_hash`، چلانے کی مصنوعات ہے:

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

ثبوت ریکارڈ:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### کم ڈگری کی توسیع {#low-degree-extension}

`omega_T` ٹریس ڈومین جنریٹر ، `omega_E` تشخیص کے ڈومین جینیٹر ، اور `g` ترتیب شدہ coset آفسیٹ ہو. `v_i` اقدار والے ٹریس کالم کے لئے ، انترپولشن کوفیشنز پیدا کرتا ہے `a_j` اس طرح:

$$
f(\omega_T^i)=v_i
$$

کم درجے کی توسیع coset پر ایک ہی کثیرالاضلاع کا جائزہ لیتا ہے:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

FFT سے پہلے کوسٹ آفسیٹ کی طاقتوں کے ذریعہ معاونین کو ضرب کرکے اس کا حساب لگایا جاتا ہے:

$$
a'_j = a_j g^j
$$

اور پھر تشخیص کے شعبے پر `a'` کا جائزہ لینا۔

انگریزی میں CPU FFT bit-reversed ان پٹ پر ایک iterative radix-2 Cooley-Tukey ٹرانسفارمیشن ہے. `L`, نصف لمبائی `H=L/2`, اور مرحلے کی جڑ:

$$
\omega_L=\omega^{N/L}
$$

ہر پروں کے حساب سے:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

الٹا FFT `omega^{-1}` کے ساتھ ایک ہی تبدیلی کرتا ہے اور الٹا ڈومین سائز کی طرف سے پیمانے پر:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

استعمال سے پہلے کیٹلاگ جڑوں کی تصدیق کی جاتی ہے:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

کیٹلاگ جڑ سے حاصل کردہ چھوٹے ڈومینز کے لئے ، جنریٹر یہ ہے:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### صف اور پتی ہاشس {#row-and-leaf-hashes}

LDE کے بعد ، FastPQ تمام LDE کالموں میں ہر سطر کو ہیش کرتا ہے۔ `m` کالموں کے ل:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

اگر صف ہیشز اب بھی تشخیص کے ڈومین کی بجائے ٹریس ڈومین پر ہیں تو، پروور اسی coset LDE عمل کے ساتھ اس واحد قطار ہیش کالم کو مداخلت کرتا ہے اور بڑھا دیتا ہے۔

### میرکل اوپننگز {#merkle-openings}

LDE اقدار کو مندرجہ ذیل حصوں میں گروپ کیا جاتا ہے:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

ہر ٹکڑا پتھر ہے:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

مرکل کے والدین ہیں:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

غیر معمولی سطحیں آخری نوڈ کو دوگنا کرتی ہیں۔ استفسار کے راستے ہر سطح پر استفسار صفحہ انڈیکس پارٹی کے مطابق بائیں یا دائیں ہاشنگ کرکے تصدیق کرتے ہیں۔

انڈیکس پر `i` پتوں کے لئے، ایک راستہ `(s_0,\ldots,s_{d-1})` جڑ `R` کی طرف سے تکرار کی طرف سے تصدیق کرتا ہے:

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

چیک صرف اس وقت منظور کیا جاتا ہے جب:

$$
y_d=R
$$

AIR ٹریس لائن کے پتے ہیں:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR ساخت کے پتے ہیں:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE استفسار کھولنے میں یہ بھی چیک کیا جاتا ہے کہ تشخیص انڈیکس `i` پر کھولی گئی قیمت اس کے تصدیق شدہ ٹکڑے میں موجود ہے:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI فولڈنگ {#fri-folding}

FRI AIR ساخت کے جائزوں کا پابند ہے۔ ہر راؤنڈ `l` کے لئے ، ٹرانسکرپٹ نمونے ایک چیلنج `beta_l`۔ پرت کو آخری قدر کو دہرا کر arity کی ضرب تک پالش کیا جاتا ہے۔ ہر arity سائز گروپ میں فولڈنگ:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

جہاں `a` FRI arity ہے۔ تصدیق کنندہ ہر نمونے لینے والے استفسار چین کے لئے چیک کرتا ہے کہ:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

اور ہر کھلا FRI گروپ کو متعلقہ FRI پرت کی جڑ کے مقابلے میں تصدیق کرتا ہے۔

### فیاٹ شامیر ٹرانسکرپٹ {#fiat-shamir-transcript}

کینونیکل پیرامیٹر کیٹلاگ ٹرانسکرپٹ ہیش کو SHA3-256 کے طور پر لیبلز کرتا ہے۔ موجودہ پروور اور تصدیق کنندہ لاگو کرنے سے چیلنج بائٹس کو `iroha_crypto::Hash::new` کے ساتھ حاصل کیا جاتا ہے ، جو 32 بائیٹ کا بلیک 2 بی ویار ڈائجسٹ ہے ، پھر پہلی آٹھ چھوٹی اینڈین بائٹ کو `F` میں کم کر دیتا ہے۔:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

چیلنج کالز مکمل ڈائجسٹ کو ٹرانسکرپٹ کی حالت میں شامل کریں۔ دوبارہ چلانے کا حکم ہے:

1. عوامی IO ، پروٹوکول ورژن، پیرامیٹر ورژن، اور پیرامیٹر نام۔
2. LDE جڑ اور ٹریس جڑ
3. `gamma`
4. AIR ساخت کے چیلنجز `alpha_0`، `alpha_1`
5. AIR ٹریس جڑ اور AIR ساخت کی جڑ
6. تلاش عظیم مصنوعات
7. FRI پرت کی جڑوں اور `beta_l` چیلنجز
8. نمونے لینے والے استفسار انڈیکس

استفسار نمونے لینے سے 32 بائٹ چیلنج ڈائجسٹز کو کھینچنا جاری رہتا ہے اور انہیں چھوٹی انڈیانا `u64` ٹکڑوں کے طور پر پڑھتا ہے جب تک کہ اس میں مطلوبہ منفرد اشارے کی تعداد نہ ہو:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

نمونے لینے والے سیٹ کو ترتیب کے مطابق واپس کیا جاتا ہے۔

### تصدیق کنندہ دوبارہ چلائیں {#verifier-replay}

تصدیق کنندہ پہلے بیچ کی ذمہ داری کا دوبارہ حساب لگاتا ہے:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

اور اس کی ضرورت ہے:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

یہ عوامی IO کی تعمیر نو بھی کرتا ہے:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

ہر فیلڈ کو ثبوت کے عوامی IO بائٹ فی بائٹ سے ملنا چاہئے۔ توثیق کنندہ پھر اسی ٹرانسکرپٹ کی تعمیر کرتا ہے اور وہی اخذ کرتا ہے۔

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

ہر نمونے لینے والے استفسار `q` کے لئے، یہ چیک کرتا ہے:

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

اور:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

AIR ساخت کھولنے کو `R_air_composition` کے تحت تصدیق کرنا ضروری ہے۔ پھر FRI سلسلہ اسی `A_q` سے شروع ہوتا ہے اور ٹرمینل FRI جڑ کے نیچے ایک تصدیق شدہ حتمی FRI صفحے میں ختم ہونا چاہئے۔

## معانی کا کیا جائزہ لیا جاتا ہے {#what-the-prover-checks}

ٹریس بنانے سے پہلے ، FastPQ پروور منتقلی کی کلید ، آپریشن رینج اور داخل کرنے کے آرڈر کے ذریعہ بیچ آرڈر کو کینونائز کرتا ہے۔ ٹرانسفر لائنوں میں ٹرانسکرپٹ میٹا ڈیٹا کی بھی ضرورت ہوتی ہے۔ ایک بیچ جس میں ٹرانسپیر لائنیں ہیں لیکن کوئی ٹرانسفارٹ ٹرانسکریپٹ موجود نہیں ہے وہ غلط ہے۔

ٹرانسفر ٹرانسکرپٹ کے لئے، پروور سائیڈ چیک میں شامل ہیں:

- بھیجنے والے کے توازن کو کم بہاؤ نہیں ہونا چاہئے
- `sender_after` برابر ہونا چاہئے `sender_before - amount`
- `receiver_after` برابر ہونا چاہئے `receiver_before + amount`
- ٹرانسکرپٹ کو بیچ میں ہر منتقلی کی قطار پر مشتمل ہونا چاہئے۔
- ایک واحد ڈیلٹا پوزیڈون ڈائجسٹ ، جب موجود ہو تو ، ٹرانسکرپٹ پری امیج سے ملنا چاہئے
- اس صورت میں شاذ و نادر مرکل ثبوتوں کو ورژن 1 کے طور پر ڈیکوڈ کرنا ہوگا؛ لاپتہ راستے deterministic synthetic proofs سے بھرے جاتے ہیں.

ٹریس میں ٹرانسفر ، مائنٹ ، برن ، رول گرانٹ ، رول منسوخی ، میٹا ڈیٹا سیٹ ، اور اجازت تلاش کرنے کی قطاروں کے لئے سلیکٹر کالم شامل ہیں۔ عددی آپریشن لائنز میں دستخط شدہ ڈیلٹا بھی ہوتے ہیں ، ہر اثاثہ پر چلنے والے ڈیلٹا اور سپلائی کاؤنٹرز۔

## پروور لین {#prover-lane}

`irohad` شروع ہونے پر FastPQ prover lane کو شروع کرتا ہے اگر پروور بیک اینڈ کو ابتدائی بنایا جاسکتا ہے۔ لین ایک محدود قطار کے ساتھ پس منظر کا کام ہے۔ ایک بلاک کے عملدرآمد کے گواہ کی پیداوار کرنے کے بعد ، commit path ایک پروور ٹاسک پیش کرتا ہے جس میں بلاک ہیش ، اونچائی ، نقطہ نظر اور گواہ شامل ہیں۔

اگر لین کام نہیں کررہا ہے یا قطار بھری ہوئی ہے تو ، نوکری کو چھوڑ دیا جاتا ہے اور عام بلاک پروسیسنگ جاری رہتی ہے۔ اس کا مطلب یہ ہے کہ پس منظر پروور لین ٹرانزیکشن ایڈمیشن یا کنسنس گیٹ نہیں ہے۔ یہ پہلے ہی عمل میں لایا گیا ریاست پر ثبوت کی پیداوار کا راستہ ہے۔

لین ایک پروور کی تعمیر کرتا ہے جس میں:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` پروفیسر کو دستیاب بیک اینڈ کا انتخاب کرنے دیتا ہے۔ `cpu` پن عملدرآمد کے لئے CPU. `gpu` ترجیحات GPU عمل درآمد، کے ساتھ CPU fallback جہاں بیک اینڈ مطلوبہ kernels استعمال نہیں کر سکتے ہیں.

## تصدیق {#verification}

FastPQ ثبوت کی توثیق کینیکل بیچ کے وعدے کو دوبارہ بناتی ہے اور عوامی ٹرانسکرپٹ کو تبدیل کرتی ہے۔ تصدیق کنندہ پروٹوکول ورژن ، پیرامیٹر سیٹ ورژن ، ری پلے کی حدود ، سراغ لگانے کا عہد ، عوامی ان پٹس ، نمونے لینے والے میرکل اوپننگز ، AIR اوپننگس ، اور FRI استفسار چین کی جانچ پڑتال کرتا ہے۔

ڈیفالٹ ری پلے کی حدود میں شامل ہیں:

|حد |ڈیفالٹ |
| ------------------ | ------: |
|منتقلی کی صفیں |     256 |
|بیچ پلے لوڈ کا سائز |256 KiB |
|FRI تہوں |      16 |
|سوالات کھولنے |     128 |

## Nexus تصدیق شدہ ریلے {#nexus-verified-relays}

Nexus AXT ثبوت لفافوں میں ایک `AxtFastpqBinding` شامل کیا جا سکتا ہے. جب `RegisterVerifiedLaneRelay` انجام دیتا ہے، Iroha:

1. لین ریلے لفافہ اور FastPQ پروف مواد کی تصدیق کرتا ہے
2. اعداد و شمار کی جگہ اور ظاہر جڑ کو چیک کرتا ہے
3. AXT ثبوت لفافہ کو ڈیکوڈ کرتا ہے
4. ایک `fastpq_binding` کی ضرورت ہے
5. FastPQ بیچ کو اس پابند سے دوبارہ تعمیر کرتا ہے
6. Embedded proof FastPQ کو ڈیکوڈ کریں
7. FastPQ تصدیق کنندہ کو دوبارہ تعمیر شدہ بیچ اور ثبوت پر کال کرتا ہے

اگر تصدیق کامیاب ہو جاتی ہے تو، Iroha ایک `VerifiedLaneRelayRecord` ذخیرہ کرتا ہے جس میں ریلے حوالہ، اصل لفافہ، ثبوت مفید بوجھ ہیش، تصدیق کی اونچائی، manifest root، اور FastPQ binding شامل ہیں.

لین ریلے لفافوں میں کمپیکٹ FastPQ ثبوت کا مواد بھی ہوتا ہے۔ اس مواد میں لین آئی ڈی ، ڈیٹا اسپیس آئی ڈی ، بلاک اونچائی ، تصدیق کی اونچائی، بلاک ہیڈر ہیش ، سیٹمنٹ ہیش ، اور مانیٹری جڑ پر ڈائجسٹ شامل ہیں۔ ریلے کو صرف اس صورت میں ضم کیا جاسکتا ہے جب اس کے پاس QC اور درست FastPQ ثبوت کا مواد موجود ہو۔

### AXT پابند ریاضی {#axt-binding-math}

کے لئے Nexus AXT لفافے، `AxtFastpqBinding` ثبوت دوبارہ کھیلنے سے پہلے canonicalized ہے. خالی پیرامیٹر اقدار ڈیفالٹ کے لئے `fastpq-lane-balanced`; خالی تصدیق کنندہ کی شناخت اور ورژن ڈیفالٹ `fastpq` اور `v1`; دعوے کی قسم کاٹ دی گئی ہے اور کم درجہ بندی کی گئی ہے۔

AXT FastPQ عوامی ان پٹس ڈیٹرمینسٹ بائٹ ہیش ہیں:

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

AXT منتقلی کی چابیاں ہیں:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` دعوے میں رول گرانٹ لائن داخل کی جاتی ہے:

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

`compliance` کا دعویٰ دو میٹا ڈیٹا صفوں کو داخل کرتا ہے: ایک پالیسی کے لئے اور دوسرا ہدف والے ڈیٹا بیس کے لئے۔

`tx_predicate` اور `value_conservation` کے لئے، ایک واضح اثر کی مقدار کا استعمال کیا جاتا ہے جب پابندیاں ایک مثبت ذریعہ یا منزل مقصود مقدار پر مشتمل ہوتی ہیں. دوسری صورت میں کوڈ ایک محدود تعیناتی مقدار سے اخذ کرتا ہے:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

اس کے بعد اسی منتقلی مساوات کا استعمال کیا جاتا ہے:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

مصنوعی بھیجنے والے اور وصول کنندہ اکاؤنٹ کی شناخت کلیدی بیجوں سے پیدا کی جاتی ہے:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

ٹرانسفر بیچ ہیش ہے:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT بیچ مینفیس ڈائجسٹ کینیکل بائنڈنگ کی Norito کوڈنگ پر SHA-256 ہے۔

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP شفاف پیغام کے ثبوت {#sccp-transparent-message-proofs}

SCCP ہیلپر خانہ شفاف کراس چین پیغام پروف کے لئے بھی FastPQ کا استعمال کرتا ہے۔ یہ راستہ `irohad` پس منظر پروور لین سے الگ ہے۔ یہ ایک FastPQ بیچ کو براہ راست SCCP پیغام ثبوت بنڈل اور manifesto سے تعمیر کرتا ہے، پھر کھلی تصدیق کے لئے نتیجہ ثابت لفافہ.

SCCP بیچ میں `fastpq-lane-balanced` اور تین میٹا ڈیٹا منتقلی کا استعمال کیا جاتا ہے:

|کلید |آپریشن |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

اس کے عوامی ان پٹ کو SCCP شفاف اندرونی ثبوت سے حاصل کیا جاتا ہے:

|FastPQ اندراج |SCCP ذریعہ |
| ------------- | ---------------------------------------------------------- |
|`dsid` |پہلے 16 بائٹس کے ایک Blake2b ہضم بیان ہیش پر |
|`slot` |اختتام کی اونچائی |
|`old_root` |پےلوڈ ہیش |
|`new_root` |عزم کی جڑ |
|`perm_root` |حتمی بلاک ہیش |
|`tx_set_hash` |بیان ہاش |

SCCP کینونیکل کوڈر انٹیجرز کو چھوٹا سا اینڈین لکھتے ہیں اور متغیر لمبائی بائٹ صفوں کو کوڈ کرتے ہیں:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

شفاف عوامی ان پٹ بائٹ سٹرنگ یہ ہے:

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

شفاف بیان بائٹس ورژن ، چین فیملی ، مقامی اور پارٹی ڈومینز ، سیکیورٹی ماڈل ، اینکر گورننس ، اکاؤنٹ کوڈیک ، فائنلٹی ماڈلز ، تصدیق کنندہ ہدف ، تصدیق کار بیک اینڈ فیملی، لمبائی سے پہلے مقرر کردہ سلسلہ / بیک اینڈ / ظاہر شدہ فیلڈز ، منزل مقصود پابند ہاش ہیں ، اکاؤنٹ کوڈک کلید، مفید بوجھ کی قسم، عوامی ان پٹ بائٹس، اور مفید بوجھ ہیش. بیان ہیش ہے:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

اس ثبوت کے راستے کے لئے FastPQ ڈیٹا اسپیس آئی ڈی ایک اور prefixed Blake2b ڈائجسٹ کی پہلی سولہ بائٹس ہے:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ بیچ بالکل وہی ہے:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

اس کے بعد اسی FastPQ آرڈرنگ اصول کے مطابق ترتیب دیا گیا۔

OpenVerify تصدیق کنندہ کا عزم SHA-256 پر ہے SCCP پیغام بیک اینڈ نام اور کینیکل FastPQ تصدیق کنندہ کی وضاحت:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

خام FastPQ ثبوت ہے Norito-کوڈ میں ایک `StarkFriOpenProofV1`, اس کے بعد ایک میں لپیٹا `OpenVerifyEnvelope` بیک اینڈ کے ساتھ `Stark`. SCCP تصدیق ایک ہی تعمیر کرتا ہے FastPQ بنڈل اور دستاویز سے بیچ، کھلی تصدیق لفافہ میٹا ڈیٹا کی جانچ پڑتال کرتا ہے، اور کال FastPQ دوبارہ تعمیر شدہ بیچ پر تصدیق کنندہ اور ثبوت۔

## پیرامیٹر سیٹ {#parameter-sets}

کینونیکل پیرامیٹرز کیٹلاگ میں دو پیرامیٹر سیٹوں کو بے نقاب کیا گیا ہے۔ میزبان پروور لین فی الحال `fastpq-lane-balanced` کا استعمال کرتا ہے۔

|پیرامیٹر |مقصد |فیلڈ |ہاشس |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |متوازن پروور آؤٹ پٹ |Goldilocks مربع توسیع |Poseidon2 کے وعدے، کیٹلاگ SHA3 لیبل |آرٹی 8، دھماکے 8، 46 سوالات |
|`fastpq-lane-latency` |تاخیر سے متعلق حساس راستوں |Goldilocks مربع توسیع |Poseidon2 کے وعدے، کیٹلاگ SHA3 لیبل |arity 16، blowup 16, 34 سوالات |

دونوں 128-بٹ سیکورٹی کو نشانہ بنانے اور ایک ٹریس ڈومین سائز کا استعمال کرتے ہیں `2^16`. انگریزی میں Rust V1 ٹرانسکرپٹ ری پلے کوڈ فی الحال Fiat-Shamir چیلنج بائٹس کے ساتھ حاصل `iroha_crypto::Hash::new` براہ راست حوالہ دینے کے بجائے SHA3-256.

Rust پروور کے ذریعہ استعمال ہونے والے قطعی کیٹلاگ constants یہ ہیں:

|مستقل |`fastpq-lane-balanced` |`fastpq-lane-latency` |
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

## ترتیب {#configuration}

FastPQ ترتیب `zk.fastpq` کے تحت گھونسلا ہے.

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

اسی عمل اور ٹیلی میٹری لیبلز کو `irohad` سے ختم کیا جاسکتا ہے:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

ترتیب کے شعبوں کے لئے ماحولیاتی متغیرات کی بھی حمایت کی جاتی ہے۔ FastPQ مخصوص متغیر میں شامل ہیں:

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

## میٹرکس {#metrics}

جب ٹیلی میٹری فعال ہے تو، FastPQ بیک اینڈ انتخاب اور دھات رن ٹائم رویے کے لئے میٹرکس برآمد کرتا ہے:

|میٹرک |معنی |
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |بیک اینڈ اور ڈیوائس لیبلز کی طرف سے مطلوبہ اور حل شدہ عملدرآمد موڈ |
|`fastpq_poseidon_pipeline_total` |پوزیڈون پائپ لائن کا مطلوبہ اور حل راستہ |
|`fastpq_metal_queue_depth` |دھات کی قطار کی حد، پرواز میں زیادہ سے زیادہ تعداد، ترسیل کا شمار، اور نمونہ لینے والی ونڈو |
|`fastpq_metal_queue_ratio` |دھات کی قطار مصروف اور overlap تناسب |
|`fastpq_zero_fill_duration_ms` |میٹل رن کے لئے میزبان صفر بھرنے کی مدت |
|`fastpq_zero_fill_bandwidth_gbps` |حاصل صفر بھرنے بینڈوڈتھ |

عام کارکردگی کی درجہ بندی کے لئے، [پروفیشن اور میٹرکس ](/ur/guide/advanced/metrics.md) میں درج کردہ اتفاق رائے اور قطار سگنل کے ساتھ ان کا استعمال کریں۔

## متعلقہ حوالہ جات {#related-reference}

- [تیار کردہ قسم کی تفصیلات کے لئے ڈیٹا ماڈل اسکیم](/ur/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ اختیارات ](/ur/reference/irohad-cli.md#arg-fastpq-execution-mode)
