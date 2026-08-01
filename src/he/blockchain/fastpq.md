---
translation_locale: he
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ הוא Iroha זה... STARK נתיב הוכחה עבור השפעות ביצועים שנבחרו. זה לא מחליף ביצוע עסקאות רגיל או הסכמה. עסקאות עדיין מתמשכות. ISI, IVM, ו Sumeragi כרגיל; FastPQ הוא צורב את העד של ההפעלה הדטרמיסטית ומופנה את האפקטים הנמכרים לחלקים של ראיות.

לאינטגרציה הנוכחית של המארח יש שלושה דרכים עיקריות:

- העברת נכסים ספרותית שקופה שנעצמה במהלך ביצוע הקלפים
- Nexus רילייים של מסלול ההוכחה של AXT נושאים קישור FastPQ
- SCCP סיועי אבטחת הודעות שקופים שמסובלים הוכחה FastPQ במעטפה פתוחה לאמת.

## להעביר את דרכי העדים {#transfer-witness-path}

העברות ספרותיות ברורות יוצרות כתיבה של העברה מבוססת כאשר ההוראה משתנה משקולות.

- חשבון המקור, חשבון היעד, הגדרה של נכס וסכום
- משקל המשלח והמתקבל לפני ואחרי העברה.
- ההש נקודת כניסה של העסקה המשמשת כמקצת השה
- רישום הרשויות המוצא מן החשבון המגיש
- מאכלת פוסיידון לתסריטים של דלתה אחת.

העברת הסבבים משתמשת בתסריט אחד עם דלתות מרובות. במקרה זה, התזונה של פוסידון חד-דלקת חסרת.

בעת סיום הבלוק, Iroha מגדירים את התסריטים האלה על ידי האש נקודת הכניסה. עדת ההוצאה לאחר מכן נושאת הן את חבילות התסריט המקורי והן את החבוצות של המעבר FastPQ שהוכנות למבטא.

כל דלתה של העברה הופכת לשני שורות המעבר:

|שורה |צורת המפתח |הערך מראש |לאחר ערך |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|דובד המשלוח |`asset/<asset-definition>/<source-account>` |משקל המשלוח לפני |המשקל של המשלוח לאחר |
|אשראי לקוח |`asset/<asset-definition>/<destination-account>` |המשקל של המקבל לפני |המשקל של המקבל לאחר |

הערכים המספריים נורמליזמים ליחידות ראיות שלמות. ערך מופרך עבור FastPQ המשתתפים אם הוא לא יכול להיות מוצג כ-לא שלילי `u64` בקנה מידה דצימלית שנבחר.

## הכנסות ציבוריות {#public-inputs}

כל חבילת המעבר FastPQ נושאת הכניסה ציבורית המחייבת את ההוכחה לקונקסט של הבלוק והביצוע:

|הכניסות |משמעות |
| ------------- | --------------------------------------------------------------- |
|`dsid` |זיהוי מסלול נתונים מקודד כבייטים קטנים.|
|`slot` |זמן יצירת בלוק הופך לננו שניות |
|`old_root` |שורש מדינת ההורים המוצא מהעד להוצאה להורג |
|`new_root` |שורש פוסט-מדינה המוצא מהעד להוצאה להורג.|
|`perm_root` |מחויבות של פוסיידון לגבי רשיונות תפקיד פעיל |
|`tx_set_hash` |האש על העסקה הסורדרת ו- time-trigger entrypoint hashs |

המארח משתמש ב- `fastpq-lane-balanced` כפרמטר קנוני הקבוע עבור סוגי אלה.

## מודל מתמטי {#mathematical-model}

סעיף זה מתאר את האריתמטיקה המבוצעת על ידי המבחן והמתאשר הנוכחי Rust. כל פעולות השדה הבאות הן מעל שדה ראשוני של Goldilocks:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ משתמש ב-Poseidon2 על פני `F` עבור מחויבויות שדה. לספוגה יש רוחב `t = 3`, שיעור `r = 2` ויכולת `1`. ההש שואב אלמנטים של שדה בלוקי שיעור-2 ומוסיף אלמנט שדה אחד `1` לפני הפערמוטציה הסופית.

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

חוטים באייטים מורכבים לצדדים קטנים של 7 בייטים כך שכל צעד הוא מתחת `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

ה-Hashes של שדות נפרדים על ידי תחום מתייצגים כ:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

עבור האש'ים שמתחילים מ-byte-domain digests, FastPQ מאפז את שמונה באייטים קטנים הראשונים לתוך השדה:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

כאן `Hash` פירושו `iroha_crypto::Hash::new` של Iroha, דיגסט של Blake2bVar ב-32 בייטים, אלא אם כן נוסחה מכניסה במפורש את פוזידון2 או SHA-256.

### ארתמטיקה של השדה {#field-arithmetic}

ה- Rust קוד מייצג אלמנטים שדה כקנוניים. `u64` הערכים ב `[0,p)`. הוספת וחסרת הן:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

ההרכבה מחליטה תחילה את המוצר של 128-ביט:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

הפחתת גולדיקים משמשת את זהות:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

אם:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

ואז המפחידה מחושבת:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

השימוש מוסיף או מוריד `p` באופן תנאי עד שהתוצאה היא קנוניקה. מספרים שלמים חתומים, כגון דלתות איזון, משולבים על ידי:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### פוסיידון 2 {#poseidon2-permutation}

מצב הפרמוטציה של פוסידון2 הוא:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

קופסת ה-S שלה היא:

$$
S(x)=x^5
$$

FastPQ משתמשת בארבעה סיבובים מלאים, חמישים ושבע סיבובים חלקיים, ולאחר מכן ארבעה סיבים מלאים נוספים. סיבוב מלא עם קבועות עגולות `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` הוא:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

סיבוב חלקי הוא:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

כל התוספות וההפכבות נמצאים `F`. הקנוניקה MDS המטריקס הוא:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

האש של השדה מתחיל ממצב אפס. עבור כל בלוק שלם של שיעור-2 `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

בלוק הסופי מוסיף את `1` אלמנט הכביסה לפני שינוי אחרון. התוצאה היא `x_0`.

### הכניסה ציבורית מחייבת {#public-input-binding}

המארח מקודד ID של חלל נתונים על ידי כתיבת הערך `u64` שלו בשמונה בייטים הראשונים של 16 בייטים:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

זמן היצירה של הבלוק הופך ממילי שניות לננו שניות:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

ה-hash המוגדר עבור העסקאות הוא חיש של בייט דומיין על חשישי נקודת כניסה מסורטת:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

כאשר `h_i` הוא מסוג של העסקאות ו- time-trigger entry point hashes. בתוכנת הציבורית IO, אם `perm_root` או `tx_set_hash` כולן אפס, המבטא מילא ערכי ההפוך:

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

### נורמליזציה מספרית {#numeric-normalization}

עבור כל דלתה של העברה, סולם הדצימלי היעד הוא הסולם המקסימלי שנחתך על פני הכמות ושני תמונות השוויון:

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

א `Numeric` ערך עם mantissa `m` וסטנדרטים `q` הוא מקובל רק כאשר `m >= 0` ו `q <= s`. זה FastPQ ערך העדים הוא:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

תוצאה נורמלית צריכה להתאים ל `u64`.

### הוראות קנוניות {#canonical-ordering}

לפני בניית עקבות, המגרש מסודר לפי מפתח המעבר, מעמד הפעולה והאינדקס של הזרם המקורי:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

מחויבות ההזמנה היא חיש שדה Poseidon2 על השלט `fastpq:v1:ordering` והצפנה Norito של המעברים הסורדרים:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

כאשר `P` הוא ארגון של 7 בייטים, `E` הוא הקודינג של Norito, `D_o` הוא `fastpq:v1:ordering`, ו `T*` הוא רשימת המעבר הסורדרת.

### משוואות העברה {#transfer-equations}

עבור סכום העברה `a`, משקל המשלח `f`, ומשקל המתקבל `t`, FastPQ מאשר את הערכים הנורמליזות של עדים לפני הקמת מעקב:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

השורות של המעבר ע"י:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

בתוך עקבות, דלתות חתומות מופחתות ל `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

הדגיזת העברת דלתה אחת אופציונלית מחייבת את תמונת העברה המוצפנת:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

עבור תמונות העברת דלתות רבות, פורמט הנוכחי דורש כי תרגום רמה הגבוהה ביותר הזה יהיה חסר.

הרשות המארחת מאכלת לתוצאות העברה היא:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### שורות עקבות {#trace-rows}

תן לרשימת המעבר הסורדרת להכיל שורות אמיתיות `n`. אורך עקבות הוא הכוח הבא של שני:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

שורות `0..n-1` פעילות; שורות `n..N-1` הן שורות של כביסה. לכל שורה אמיתית יש קבוצה אחת של סלקטור פעולה:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

כל עמודי הסלקטור הם בוליים:

$$
s(s-1)=0
$$

שורות חיפוש רשיונות הן בדיוק שורות של סיוע לתפקידים ושל ביטול תפקידים:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

עבור שורות ניצול מספרים:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

הבניין גם עוקב אחרי דלתות שפועלות לפי נכס:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

רק שורות מנטה ומשרפות מעודכנות את ספירת האספקה:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

עמודי מעקב של נתונים ומרחבי נתונים הם חשיש שדה המוצא לפני מתרייליזציה בשורה:

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

ה- metadata hash, ה- dataspace hash, ו- slot הם יציבים לאורך שורות עקבות סמוכות:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### להעביר עמודי מרקל {#transfer-merkle-columns}

שורות העברה נושאות מסלול מרקל נדיר של 32 מדרגות. אם הוכחה מארחת חסרה, הסבר סינתז מסלול דטרמיניסטי מפתח השורה, לפני איזון, ואם השורה היא הצד המשלח או הקבל.

למסלולים סינתטיים, מלח הטעם הוא `fastpq:smt:from` עבור שורות המשלוחים ו `fastpq:smt:to` עבור שורות הקבל:

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

העלים הסינתטיים והרכיבים הפנימיים הם:

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

האתר רשום את הביט `b_l`, אחיו `s_l`, הערך הכניסה `x_l`, והערך ההוצא `x_{l+1}` בכל רמה. עם קונבנציון ענף של הקוד:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### חשיבות רשות {#permission-hashes}

שורות תורם וביטול תפקיד האש את העד הרשאה:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

טבלה הרשיונות המארחת מסווגת את הכניסות לפי בייטים תפקיד, בייטים רשיון, ובייטים תקופה, ואז יוצרת עץ Poseidon2 Merkle:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

רמות רוחב מוזר משכפלות את האלמנט האחרון.

### התחייבות למעקב {#trace-commitment}

עבור כל עמודת עקבות `c`, FastPQ מפרט תחילה את הערכים של העמודה על שטח עקבות ומכניס את וקטור הקואפיצנט.

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

שורש העקבות הוא שורש פוזידון2 מרקל על מחויבות עמודות:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

ההתחייבות הסופית של עקבות היא חישב בייט על השטח, קבוצת פרמטרים, צורה של עקבות, דיגסטות עמודות וקור עקבות:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

כאשר `D_c` הוא `fastpq:v1:trace_commitment`.

### AIR מרכיב {#air-composition}

ערך הרכב V1 AIR הוא שילוב ליניארי של שרידים מקומיים בשורה. הדגימות של הטרנסקריפט מציגות שני אתגרים:

$$
\alpha_0,\alpha_1 \in F
$$

עבור כל זוג שורות סמוך `(i,i+1)`, המבחן מחושב:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

השאריות `rho` הן, בסדר הקוד:

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

עבור שורות עם עמודות מספריות:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

ובשביל עמודי ההקשר של הסבקה יציבים:

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

המבחין מחשוב מחדש את `A_i` עבור פתיחות שורות שנלקחו בדגם ומבדק אותו עם הערך המרכיב שהוכרז על פי שורש מרקל של AIR.

### מוצר חיפוש {#lookup-product}

אספנת החיפוש הרשיונות משתמשת באתגר Fiat-Shamir `gamma`. במהלך הערכות ההרחבה במדרגה נמוכה של `s_perm` ו`perm_hash`, המוצר המשך הוא:

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

רישומי ההוכחה:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### התרחבות בקנה מידה נמוך {#low-degree-extension}

אם `omega_T` הוא הגנרטור של תחום עקבות, `omega_E` הוא גנרטור תחום הערכה, ו `g` הוא הקוסט המוגדר. עבור עמוד עקבות עם ערכים `v_i`, האינטרפולציה מייצרת קואפצינטים `a_j` כגון:

$$
f(\omega_T^i)=v_i
$$

התרחבות של מעלות נמוכות מעריכה את אותו פולינום על הקוסט:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

ההשפעה מחליטה את זה על ידי כפול הקואפיצ'ינטים בכוחות של הקוסט המוקלף לפני FFT:

$$
a'_j = a_j g^j
$$

ולאחר מכן הערכה `a'` על תחום ההערכה.

CPU FFT הוא טרנספורמציה קולי-טוקי רידקטיבית של רדיקס-2 על פני הכניסות הפוכה בביט. באורך שלב `L`, אורך חצי שלב `H=L/2`, וקור שלב:

$$
\omega_L=\omega^{N/L}
$$

כל פרפר מחשוב:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

ההפך FFT מבצע את אותו טרנספורמציה עם `omega^{-1}` ומגדלים על ידי גודל תחום ההפוך:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

שורשים קטלוג מתואמים לפני השימוש:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

עבור דומנים קטלניים יותר המוצאים מהשורש של הקאטלוג, הגנרטור הוא:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### רצועות ופרחים {#row-and-leaf-hashes}

לאחר LDE, FastPQ מסדרת את כל שורה בכל עמודי LDE. עבור עמודות `m`:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

אם ה-hashes של שורות עדיין נמצאים על תחום העקבות ולא על תחום ההערכה, הסבר מרחיב ומרחיב את עמוד ה-hush של שורה אחת עם אותו תהליך coset LDE.

### פתיחות מרקל {#merkle-openings}

הערכים LDE מתקבצים לחתיכות של:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

כל חתיכה של עץ היא:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

הוריו של מרקל הם:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

רמות מוזרות משכפלות את הערך האחרון. נתיבי השאלות מאושרים על ידי חיש שמאל או ימין בהתאם לשוויון האינדקס של דף השאלות בכל רמה.

עבור עץ עם אינדקס `i`, מסלול `(s_0,\ldots,s_{d-1})` מתבונן נגד שורש `R` על ידי חוזר:

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

הצ'ק עובר רק כאשר:

$$
y_d=R
$$

AIR רצועות עורות של עקבות הן:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR עלים מרכיבים הם:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

פתיחת השאלות LDE בודקת גם אם הערך שנפתח באינדקס ההערכה `i` נוכח בחלקו המאודן:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI קפד {#fri-folding}

FRI מחויב AIR הערכות הרכב. לכל סיבוב `l`, הדגימות של הטרנסקריפט מאתגר. `beta_l`. שכבה מופשטת למספר רב של האריטי על ידי חזרה על הערך האחרון. כל קבוצה בגודל האריטי מתפוגגת ל:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

כאשר `a` הוא האריטי של FRI. המבחין בודק, עבור כל שרשרת חיפוש שנבחרה בדוגמה, כי:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

ומזהה את כל קבוצת FRI שנפתחה נגד שורש שכבה FRI המתאים.

### תרגום של פיאט-שמיר {#fiat-shamir-transcript}

קטלוג הפרמטרים הקנוניים מצביע את האש של התסריט כ: SHA3-256. יישום ה-prover ו-verifier הנוכחי מביא בייטים מאתגרים עם `iroha_crypto::Hash::new`, אשר הוא 32-בייט Blake2bVar מאכלס, ואז מקטין את שמונה בייטים הראשונים קטנים-endian `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

שיחות האתגר מוסיפים את ההזנה המלאה למצב העתיקה.

1. ציבורי IO, גרסה של פרוטוקול, גרסת הפרמטרים ושם הפרמטרים.
2. LDE שורש וורש עקבות
3. `gamma`
4. AIR מאתגרים על הרכב `alpha_0`, `alpha_1`
5. AIR שורש עקבות וקור מרכיב AIR
6. מוצר גדול
7. שורשי שכבה FRI ואתגרים של `beta_l`
8. אינדיקטורי שאלת דגימה

קבלת דגימות מבקשת ממשיכה לצייר סימנים של מאתגר ב-32 בייטים ולקרוא אותם כחלקים קטנים `u64` עד שיהיה להם את המספר הנדרש של אינדיקסים ייחודיים:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

קבוצת הדגימות חוזרת בסדר מסורט.

### שיחזור בדיקת {#verifier-replay}

המבחין מחשוב מחדש תחילה את התחייבות הקצבה:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

ודורש:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

הוא גם משיב את הציבור IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

כל שדה חייב להתאים את IO בייט על בייט של ההוכחה. המבחין משך מחדש את אותו התסריט ומוצא אותו:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

עבור כל שאלת הדגימה `q`, הוא בודק:

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

ו:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

ה- AIR פתיחת הרכב חייבת להיות מאותית תחת `R_air_composition`. ה- FRI שרשרת אז מתחילים מאותו `A_q` ועליי לסיים בהסכם סופי מאושר. FRI עץ מתחת לתרום FRI שורש.

## מה Proverb בודק {#what-the-prover-checks}

לפני בניית עקבות, המבטא FastPQ קאנוניקליז את סדר הקבוצה על ידי מפתח מעבר, רשימת הפעולה, וסדר הכנסת. שורות העברה דורשות גם מטדאטה של כתיבה. קבוצה עם שורות העברת אבל אין כתיבות העברה היא לא חוקית .

עבור מסמכי העברה, בדיקות בצד הסבר כוללות:

- המשקל של המשלוח לא חייב לזרום.
- `sender_after` חייב להיות שווה ל- `sender_before - amount`
- `receiver_after` חייב להיות שווה ל- `receiver_before + amount`
- התסריט חייב לכסות את כל שורה של העברה בלהט
- צירוף Poseidon של דלטה אחת, כאשר הוא קיים, חייב להתאים לתמונה הקודמת של התסריט
- אם הוכחות מרקל נדירות יש לפתור את הגרסה 1; הנתיבים החסרים מלאים באוכחות סינתטיות דטרמיסטיות.

מעקב מכיל עמודי סלקטור עבור העברה, מנטה, שריפה, מתן תפקיד, ביטול תפקיד, קבוצת מטא נתונים ושורות חיפוש רשות. שורות ניתוח מספרים גם נושאים דלטה חתומות, פועלות לדלטה לכל נכס ומספרים אספקה.

## פרובור ליין {#prover-lane}

`irohad` מתחיל את FastPQ מסלול הסבר בהתחלה אם ניתן להפעיל את האחורי של הסבר. המסלול הוא משימת רקע עם שורה מוגבלת. לאחר שחגור מייצר עדות ביצוע, מסלול ההפעלה שולח עבודה סבר המכילה את ה-block hash, גובה, תצוגה ועידה.

אם המסלול לא פועל או שהצורה מלאה, התפקיד הופספס והמעבודת הבלוק הרגילה ממשיכה. זה אומר כי המסלול של ה-background prover אינו שער הכניסה למבצעים או שער הסכמה. הוא מסלול ההפקה על מצב שכבר נעשה.

המסלול בונה סבר עם:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` מאפשר למבחין לבחור את הפסק האחורי הזמין. ביצוע פינים `cpu` לעומת ביצוע CPU. `gpu` מעדיפה ביצוע GPU, עם ההפסקות של CPU כאשר הפסק האחור אינו יכול להשתמש בכשירים המבוקשים.

## אימות {#verification}

בדיקת הוכחה FastPQ מבצעת מחדש את ההתחייבות הקנוניקה של הסבב ומחזירה את התסריט הציבורי. הבדיקן בודק את גרסת הפרוטוקול, גרסה המוגדרת פרמטרים, גבולות החזרה, התחייבות למעקב, הכניסות ציבוריות, פתיחות מרקל שנבחרו, פתיחת AIR ושרשרת שאילת FRI.

גבולות ההשחקה המקובלים כוללים:

|הגבול.|דפוס |
| ------------------ | ------: |
|שורות מעבר |     256 |
|גודל המשאב הפועל של הקבוצה |256 KiB |
|FRI שכבות|      16 |
|פתיחות שאלות |     128 |

## Nexus רלעים מבוקשים {#nexus-verified-relays}

Nexus AXT מעטפות ראיות יכולות להכיל את `AxtFastpqBinding`. כאשר `RegisterVerifiedLaneRelay` מבצע, Iroha:

1. מתבונן על חליפת ריליי המסלול ואת החומר ההוכיח FastPQ
2. בודק את חלל הנתונים ואת שורש המניפסט.
3. פירוש המעטה של ההוכחה AXT
4. דורש `fastpq_binding`
5. מייצג מחדש את המגרש FastPQ מתוך קשר זה.
6. פירוק את ההוכחה המשולבת FastPQ
7. קורא למבחין FastPQ על החתיכה המוקדמת מחדש והראיה

אם הבדיקות מצליחות, Iroha מאחסן `VerifiedLaneRelayRecord` המכיל את התייחסות הרחבה, המעטה המקורי, ההש של עומס תועלת הוכחה, גובה הבדיקות, שורש מוניפסט, ואת קישור FastPQ.

מעטפות מרחבת המסלול מובילות גם חומר ראיה קומפקטי FastPQ. החומר הוא דיגסט מעל איד המסלול, איד חלל נתונים, גובה בלוק, גובה לאישור, האש של כותרת הבלוק, האש ההתיישבות והשורש המוניפסט. רלוף הוא מקובל להתמזג רק אם יש לו גם חומר ראיה QC וגם חומר ראוי FastPQ.

### AXT מתמטיקה מחייבת {#axt-binding-math}

עבור מעטפות Nexus AXT, `AxtFastpqBinding` קנוניקליזת לפני שיחזור הראיות. הערכים של הפרמטרים ריקים כפ default ל `fastpq-lane-balanced`; id בדיקת ריקה וגרסה מקובלת ל `fastpq` ו `v1`; סוג התביעה נחתוך ונחתך.

הכניסה הציבורית AXT FastPQ היא חישיית בייט דטרמיסטית:

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

המפתחות המעבר AXT הן:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

בתביעה `authorization` מפרסמת שורה של תורמים:

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

ושורה של מטא נתונים מחייבת את מדיניות ההסמכים. בקשה `compliance` מוסיפה שתי שורות של מטא-נתונים: אחת עבור מדיניות ואחת עבור מספרי הנתונים המטרה.

עבור `tx_predicate` ו `value_conservation`, יש להשתמש בסכום השפעה מפורש כאשר הקשר מכיל סכום מקור או יעד חיובי. אחרת הקוד מוציא סכום דטרמיניסטי מוגבל.

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

ואז משתמשים באותם משוואות העברה:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

זיהוי החשבון של המשלח והמתקבל סינתטי נוצר מהזרעים המרכזיים:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

ה-Hash של הקבוצת העברה הוא:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

ה- AXT מכתב המפרט של הקבוצת הוא SHA-256 מעל קודי Norito של החיבור הקנוני:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP ראיות של הודעות שקופות {#sccp-transparent-message-proofs}

קופסת העזרה של SCCP משתמשת גם ב- FastPQ כדי להוכיח הודעות חיוות בין שרשרת. הנתיב הזה נפרד מ- `irohad` מסלול ההצהרה של רקע. הוא בונה כיסוי FastPQ ישירות מתוך חבורת ראיות של הודעות SCCP ומניפסט, ולאחר מכן מקיף את הראיה המוצאת לאישור פתוח. .

הקבוצת SCCP משתמשת ב- `fastpq-lane-balanced` ובשלוש המעברים של מטא נתונים:

|המפתח.|מבצע |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

הכניסה הציבורית שלה נובעת מן ההוכחה הפנימית שקופה של SCCP:

|FastPQ הכניסות |SCCP מקור|
| ------------- | ---------------------------------------------------------- |
|`dsid` |16 באייטים הראשונים של מבריק2ב מזיזים על הודעת האש.|
|`slot` |גובה סיום |
|`old_root` |חשיפת המטען .|
|`new_root` |שורש התחייבות |
|`perm_root` |בלוק הסיום האש .|
|`tx_set_hash` |הודעות האש|

SCCP מקודרים קנוניים כותבים מספרים שלמים קטנים ומצליחים לקודור מערכות בייטות אורך משתנה כמו:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

שרשרת בייט כניסה ציבורית שקופה היא:

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

בייטים של הצהרה שקופה הם הקשר בין הגרסה, משפחת שרשרת, תחומים מקומיים ושל הצדדים האחרים, מודל אבטחה, ממשלת מעגל, קודק חשבון, מודל סיום, מטרה של המבחין, משפחת ה-backend של המבחנים, שדות רשת/הגבול/מניפסט מונפסטיד בגודל, חישוב חיבורי יעדה, מפתח קודק חשבון, סוג של עומס תועלת, בייטים הכניסה ציבוריים, והשח של עומס התועלת. ההשח של הצהרה הוא:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

איד החלל הנתונים FastPQ למסלול ההוכחה הזה הוא השישה עשר בייטים הראשונים של דיג'סט Blake2b מקודם נוסף:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

הסבב SCCP FastPQ הוא בדיוק:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

לאחר מכן מסווג על ידי אותו כלל ההזמנה FastPQ.

ההתחייבות למבחין OpenVerify היא SHA-256 על שמו של הודעת האחורי של הודעה SCCP ועל תיאור המבחין הקנוני של FastPQ:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

החומרי FastPQ הוכחה היא Norito-מוצפן לתוך `StarkFriOpenProofV1`, ואז עטוף ב `OpenVerifyEnvelope` עם קצה אחורי `Stark`. SCCP בדיקת חוזרת את אותו FastPQ הקצבה מהחבילה והמניפסט, בודקת את הנתונים המטאטאריים של מעטפת ההמתנה פתוחה, ומקרא את FastPQ בדיקת על המגרש שנבנה מחדש והוכחה.

## מערכות פרמטרים {#parameter-sets}

קטלוג הפרמטרים הקנוניים חושף שני קבוצות פרמטרים. מסלול המובילה משתמש כיום `fastpq-lane-balanced`.

|פרמטר |מטרה.|שדה |חישות |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |סיבוב סבר מאוזן |ארגזת קוואדראטית של גולדילוקס |התחייבות של Poseidon2, קטלוג SHA3 |סעיף 8, פיצוץ 8, 46 שאלות |
|`fastpq-lane-latency` |כבישים רגישים לטיחות |ארגזת קוואדראטית של גולדילוקס |התחייבות של Poseidon2, קטלוג SHA3 |סעיף 16, פיצוץ 16, 34 שאלות |

שניהם מכוונים לביטחון 128-ביט ומשתמשים בגודל תחום מעקב של `2^16`. קוד ההשתקפות של התסריט Rust V1 משמש כיום את בייטות האתגר Fiat-Shamir עם `iroha_crypto::Hash::new` במקום להתקשר ישירות אל SHA3-256.

קבועות הקייטלוג המדויקות המשמשות על ידי Rust הם:

|קבוע.|`fastpq-lane-balanced` |`fastpq-lane-latency` |
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

## הגדרות {#configuration}

הקונפיגרציה של FastPQ נמצאת תחת `zk.fastpq`.

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

את אותן תוויות הביצוע והטלמטריה ניתן לשבור מ- `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

משתנים סביבתיים תומכים גם בשדות ההסדרות. FastPQ- משתנים ספציפיים כוללים:

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

## מדדים {#metrics}

כאשר טלמטריה מופעלת, FastPQ מייצרת מדדים עבור הבחירה ב-backend וההתנהגות של Metal runtime:

|מטריק |משמעות |
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |מצב ההפעלה הנדרש והפתר על ידי תוויות האחורי והתקן |
|`fastpq_poseidon_pipeline_total` |הנתיב של צינור פוסיידון מבוקש ופתר |
|`fastpq_metal_queue_depth` |גבול קו מתכת, מספר מקסימום בטיסה, מספר משלוחים וחלון הדגימות |
|`fastpq_metal_queue_ratio` |שורה מתכת עמוסה ותחפיפות יחסים |
|`fastpq_zero_fill_duration_ms` |תוחלת מילוי אפס עבור מטאל ריצה |
|`fastpq_zero_fill_bandwidth_gbps` |נרחב קו ה-zero-fill |

לטיפול ביצועים כלליים, השתמשו בהם עם אותות ההסכמה והצורה המפורטים ב- [ביצועים ומטריקות ](/he/guide/advanced/metrics.md).

## תיקון קשור {#related-reference}

- [תוכנית מודל נתונים ](/he/reference/data-model-schema.md) עבור פרטי סוג שנוצרו
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ אופציות](/he/reference/irohad-cli.md#arg-fastpq-execution-mode)
