---
translation_locale: he
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ הוא Iroha אני... STARK מסלול הוכחה לתשקירי ביצוע נבחרים.
לא מחליפים את ביצוע העסקה הרגיל או הסכמה.
רץ דרך ISI, IVM, ו Sumeragi כרגיל; FastPQ צורכים את
תוצאה דטרמיסטית ראיה ומפנה השפעות תומכות לתוך הוכחה
חבילות.

לאינטגרציה הנוכחית של המארח יש שלושה דרכים מרכזיות:

- העברת נכסים ספרותית שקופה שנעצמה במהלך ביצוע הקלפים
- Nexus רליות מסלול מאובטחות, AXT מעטפת ההוכחה נושאת FastPQ
  מחייב
- SCCP עוזרי אבטחת הודעות שקופים FastPQ הוכחה ב
  מסגרת אימות פתוחה

## העברת דרכים של עדים {#transfer-witness-path}

העברות ספרותיות ברורות יוצרות תרגום העברה מבוסס כאשר
ההוראה משתנה את המשקל.

- חשבון המקור, חשבון היעד, הגדרה של נכס וסכום
- סכומים של המשלח והמתקבל לפני ומאחר העברה
- האש של נקודת כניסה לעסקה המשמשת כאש של הקבוצה
- רישום רשויות המוצא מן החשבון המגיש
- סימפטום פוזידון לתשליטים של דלתה אחת

העברות של חבילות משתמשות בתסריט אחד עם דלתות מרובות.
סימפטום פוזידון חד דלטה חסר.

בהשלמת הבלוק, Iroha קבוצות את התסריטים האלה על ידי נקודת הכניסה האש.
עד ההוצאה להורג לאחר מכן נושאת את הקבוצות המקוריות
ה- FastPQ חבילות מעבר מוכנות למבקר.

כל דלטה של העברה הופכת לשני שורות המעבר:

| שורה             | צורת המפתח                                        | ערך מקדי               | לאחר הערך             |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
| דביט של המשלוח    | `asset/<asset-definition>/<source-account>`      | המשקל של המשלוח לפני   | המשקל של המשלוח לאחר   |
| אשראי של מקבל | `asset/<asset-definition>/<destination-account>` | המשקל של המקבל לפני | המשקל של המקבל לאחר |

הערכים המספריים נורמליזות ליחידות ראיות שלמות.
דחתה FastPQ חבילות אם לא ניתן לייצג אותה כלא שלילית
`u64` בסולם העשר הנבחר.

## הכנסות ציבוריות {#public-inputs}

כל אחד FastPQ חבילת המעבר נושאת הכניסות ציבוריות שמקשרות את ההוכחה
ההקשר של הבלוק והביצוע:

| הכניסה         | המשמעות                                                         |
| ------------- | --------------------------------------------------------------- |
| `dsid`        | מזהד מקומות נתונים מוצפן כבייטים קטנים             |
| `slot`        | זמן היצירה של בלוק הופך לננו שניות                    |
| `old_root`    | שורש מדינת ההורים המוצא מהעיד להוצאה להורג            |
| `new_root`    | שורש לאחר המדינה המוצא מהעד להוצאה להורג              |
| `perm_root`   | מחויבות של פוסיידון לגבי רשיונות תפקיד פעיל                |
| `tx_set_hash` | האשיס על עסקאות מסורדרות ו- time-trigger entrypoint |

המארח משתמש `fastpq-lane-balanced` כפרמטר קאנוני הקבוע עבור
את החבילה הזאת.

## מודל מתמטי {#mathematical-model}

החלק הזה מתאר את הארימטטיקה המופעלת על ידי הזרם Rust
כל הפעולות המيدانיות למטה הן מעל ל"הגולדילוקס".
שדה ראשי:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ משתמש Poseidon2 על `F` עבור מחויבות שדה.
`t = 3`, שיעור `r = 2`, ויכולת `1`. ה-Hash שואב אלמנטים של שדה
רמה-2 בלוקים ומוסיף אלמנט שדה אחד `1` לפני הגמר
פערמוטציה:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

חוטים בייטים ארוזים לתוך קצוות אנדיאיות קטנות של 7 בייטים כך שכל קצבה היא
בקפידה למטה `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

ה-Hashes של שדות נפרדים על ידי דומנים מתייצגים כ:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

עבור האשיס שמתחילים מ-byte-domain digests FastPQ מפות שמונה הראשונים
בייטים קטנים של אנדיאן לתוך השדה:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

הנה. `Hash` משמעות Iroha אני... `iroha_crypto::Hash::new`, בלאק2בוואר של 32 בייטים
מזין, אלא אם נוסחה מכילה במפורש את פוסידון2 או SHA-256.

### ארימטיקה של שדה {#field-arithmetic}

ה- Rust קוד מייצג אלמנטים של שדה כקנוניים `u64` הערכים ב
`[0,p)`. הוספת וחסרת הן:

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

אז הפחתת גולדיקים משתמשת באותם:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

אם:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

ואז המפחית מחושבת:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

השימוש מוסיף או מוריד באופן תנאי `p` עד שהתוצאה
מספרים שלמים חתומים, כגון דלתות איזון, מותקנים על ידי:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### פוסיידון 2 {#poseidon2-permutation}

מצב הפורמוטציה של פוזידון 2 הוא:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

הקופסה של ה-S שלה היא:

$$
S(x)=x^5
$$

FastPQ הוא משתמש בארבעה סיבובים מלאים, 57 סיבובים חלקיים, ואז ארבעה נוספים.
סיבוב שלם עם קבועות עגולות
`c_r = (c_{r,0}, c_{r,1}, c_{r,2})` הוא:

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

כל הוספים וההפכבות נמצאים ב `F`. הקנוניקה MDS המתrix הוא:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

ה-Hash של השדה מתחיל ממצב אפס. עבור כל בלוק שלם -2.
`(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

בלוק האחרון מוסיף את `1` אלמנט דביקה לפני אחד האחרון
הפערמוטציה. ההוצאה היא `x_0`.

### חובה על הכניסה הציבורית {#public-input-binding}

המארח מקודד ID של חלל נתונים על ידי כתיבת `u64` הערך לשלב הראשון
שמונה בייטים קטנים של שדה 16-בייט:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

זמן יצירת הבלוק הופך ממילי שניות לננו שניות:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

ה- hash המוגדר עבור העסקאות הוא חישב של בייט דומיין על נקודת הכניסה הסורטת
חשיש:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

איפה `h_i` הם מסוגמים טרנזקציה ו-Time-Trigger נקודת כניסה
ההוכחה הציבורית IO, אם `perm_root` או `tx_set_hash` זה הכל אפס,
סבר מילא ערכי הפסגה:

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

עבור כל דלתה של העברה, הממדד העשימי היעד הוא הגבול המקסימלי
סולם על פני הסכום ושני תמונות השוויון:

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

א `Numeric` ערך עם mantissa `m` וסטנדרטים `q` הוא מקבל רק כאשר
`m >= 0` ו `q <= s`. זה FastPQ ערך העדים הוא:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

התוצאה הנורמליזת חייבת להתאים `u64`.

### הוראות קאנוניקות {#canonical-ordering}

לפני בניית עקבות, המגרש מסווג לפי מפתח מעבר, פעילות
מעמד, ואינדקס הזרם המקורי:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

ההתחייבות בהזמנה היא חיש שדה Poseidon2 על השטח.
`fastpq:v1:ordering` ו... Norito קודינג של המעברים הסורדרים:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

איפה `P` הוא ארוז של 7 בייטים, `E` הוא Norito קודינג, `D_o` הוא
`fastpq:v1:ordering`, ו `T*` הוא רשימת המעבר הסורדרת.

### משוואות העברה {#transfer-equations}

עבור סכום העברה `a`, משקל המשלוח `f`, והמשקל של המקבל `t`,
FastPQ אישור את הערכים הנורמליזים של העדים לפני הקמת עקבות:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

שורות המעבר מעצבים:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

בתוך עקבות, דלתות חתומות נמוכות `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

הדגיסט בחופשי של העברת דלתה אחת מבטיח את העברה המוצפנת
תמונה ראשונה:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

עבור תמונות העברה רב-דלתא, פורמט הנוכחי דורש:
מזיקה ברמה הגבוהה ביותר לא תהיה.

הארגון המארח מזין עבור תוצאות העברה הוא:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### שורות עקבות {#trace-rows}

תן לרשימה של המעבר הסורדרת להכיל `n` שורות אמיתיות. אורך העקבות הוא
הכוח הבא של שניים:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

שורות `0..n-1` הם פעילים; שורות `n..N-1` כל שורה אמיתית יש
קבוצה אחת של סלקטור פעילות:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

כל עמודי הסלקטור הם בול:

$$
s(s-1)=0
$$

שורות חיפוש רשיונות הן בדיוק שורות סיוע תפקידים ושדר ביטול תפקידים:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

עבור שורות פעולות מספריות:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

הבניין גם מעקב על דלתות של כל נכס:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

רק שורות של מנט ושרוף מעודכנות את מכונת האספקה:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

עמודי מעקב של נתונים ומרחבי נתונים הם חשיש שדה המוצא לפני שורה
חומרות:

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

ה- metadata hash, ה- dataspace hash, ו- slot הם יציבים לאורך הקשורים
שורות עקבות:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### העברת עמודי מרקל {#transfer-merkle-columns}

שורות העברה נושאות מסלול מרקל נדיר של 32 רמות.
חסר, המבטא סינתז מסלול דטרמיניסטי מפתח שורה,
לפני האיזון, והאם השורה היא הצד המשלח או הקבל.

עבור מסלולים סינתטיים, מלח הטעם הוא `fastpq:smt:from` עבור שורות שלח
ו `fastpq:smt:to` עבור שורות קבל:

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

האתר מצלם את החלק. `b_l`, אחים `s_l`, כף הכניסות `x_l`, ו
קו מוצא `x_{l+1}` בכל רמה, עם קונבנציון הסניף של הקוד:

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

טבלה הרשיונות המארח סורט כניסה לפי בייטים תפקיד, רשות
בייטים, ובייטים של תקופה, ואז בונה עץ פוסידון2 מרקל:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

רמות רוחב מוזר משכפלות את האלמנט האחרון.

### התחייבות למעקב {#trace-commitment}

עבור כל עמוד עקבות `c`, FastPQ ראשית הוא מפרסם את הערכים של העמודה
את תחום העקבות והשיש וקטור הקואפיצנט:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

שורש העקבות הוא שורש פוסידון2 מרקל על מחויבות עמודות:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

ההתחייבות האחרונה של עקבות היא חישוב בייט על השטח, קבוצת פרמטרים,
צורה של עקבות, אכלות עמודות ושורש עקבות:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

איפה `D_c` הוא `fastpq:v1:trace_commitment`.

### AIR מרכיב {#air-composition}

ה- V1 AIR ערך הרכב הוא שילוב ליניארי של שרידי שורה מקומית.
הדגימות של התסריט מצטיינות בשני אתגרים:

$$
\alpha_0,\alpha_1 \in F
$$

עבור כל זוג שורה סמוך `(i,i+1)`, המבחן מחושב:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

השאריות `rho` הם, בסדר הקוד:

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

עבור שורות עם עמודי מספר:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

ושל עמודי ההקשר של הסבקה יציבים:

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

המבחין מחשוב מחדש `A_i` עבור פתיחות שורות שנלקחו בדגם ומבדקים אותו
על-פי הערך המרכיב המובטח במסגרת AIR מרכיב Merkle
שורש.

### מוצר חיפוש {#lookup-product}

המצטבר של חיפוש הרשיונות משתמש באתגר Fiat-Shamir. `gamma`.
על הערכות ההרחבה במדרגה נמוכה של `s_perm` ו `perm_hash`, ה-
מוצר פועל הוא:

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

תן לי. `omega_T` להיות הגנרטור של תחום מעקב, `omega_E` ה-
גנרטור תחום הערכה, ו `g` ההשוואה הקונפיגורית של קוסט.
עמודות עקבות עם ערכים `v_i`, האינטרפולציה מייצרת קואפיציאנים `a_j`
כל כך:

$$
f(\omega_T^i)=v_i
$$

הרחבה של מעלות נמוכות מעריכה את אותו פולינום על הקוסה:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

ההבנה מחליטה את זה על ידי כפיית הקואפיצנטים
הקוסט המוערך לפני FFT:

$$
a'_j = a_j g^j
$$

ואז הערכה `a'` בתחום ההערכה.

ה- CPU FFT הוא טרנספורמציה של קולי-טוקי על רדיקס 2
הכניסות בהפוך ביט. `L`, חצי אורך `H=L/2`, ושלב
שורש:

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

ההפך FFT פועל אותו טרנספורמציה עם `omega^{-1}` ומערכות על ידי
גודל תחום הפוך:

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

עבור תחומים קטלניים יותר המוצאים מהשורש של הקאטלוג, הגנרטור הוא:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### שורות ופרחים {#row-and-leaf-hashes}

לאחר LDE, FastPQ חישות כל שורה בכל LDE עמודות. `m` עמודות:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

אם ה-hashes של שורות עדיין נמצאים על תחום העקבות במקום הערכה
תחום, המבטא אינטרפולט ומגדיר את עמוד ה-הש של שורה אחת
עם אותו קוסט LDE תהליך.

### פתיחות מרקל {#merkle-openings}

LDE הערכים מתקבצים לחלקים של:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

כל חתיכה של העלים היא:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

הורים של מרקל הם:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

רמות מוזרות משכפלות את הערך האחרון.
נכון לפי שוויון אינדקס הדף של השאלות בכל רמה.

עבור עמוד ב-index `i`, דרך `(s_0,\ldots,s_{d-1})` מתבוננים נגד
שורש `R` על ידי חוזר:

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

AIR העלים של שורות עקבות הם:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR העלים המרכיבים הם:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

ה- LDE פתיחת השאלות גם בודקת שהערך נפתח באינדקס הערכה
`i` נוכח בחלקו המאודן:

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

FRI מחויב AIR הערכות הרכב. לכל סיבוב `l`, ה-
דגימות התסריטיות מאתגר `beta_l`. השכבת מופשטת למספר רב
כל קבוצה בגודלה של אריטי מתפוגגת ל:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

איפה `a` האם זה FRI בדיקת הבדיקה, לכל בקשה נבחרה
שרשרת, שהיא:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

ומזהות את כל פתיחה FRI קבוצה נגד הקבוצה המתאימה FRI שכבה
שורש.

### תרגום פיאט-שמיר {#fiat-shamir-transcript}

קנטלוג הפרמטרים הקנוניים מצביע על האש של התסריט כ SHA3-256.
יישום ה-prover ו-verifier הנוכחי מביא בייטים מאתגרים עם
`iroha_crypto::Hash::new`, שזו תרגיל בלעק2בבר של 32 בייטים, אז
מקטין את שמונה בייטים הראשונים של האנדייה הקטנה `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

שיחות האתגר מוסיפים את ההזיהום המלא למצב התסריט.
הסדר הוא:

1. ציבורי IO, גרסה של פרוטוקול, גרסת הפרמטרים ושם הפרמטרים
2. LDE שורש וסימן
3. `gamma`
4. AIR מאתגרים בהרכב `alpha_0`, `alpha_1`
5. AIR שורש עקבות ו AIR שורש הרכב
6. מוצר גדול
7. FRI שורשי שכבה ו `beta_l` אתגרים
8. אינדיקטורי בקשת דגימה

קבלת דגימות בקשה ממשיכה לצייר תרגילים של מאתגר 32 בייטים ולקרוא אותם כ
-אנדיאן הקטן `u64` חתיכות עד שיהיה לו את המספר הנדרש של
אינדיקסים:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

קבוצת הדגימות חוזרת בסדר מסודר.

### שיחק מחדש {#verifier-replay}

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

הוא גם בונה מחדש את הציבור IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

כל שדה חייב להתאים את הציבור של הראיה IO בייט על בייט.
ואז הוא מכין מחדש את אותו התסריט ומוצא אותו:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

עבור כל בקשה שנערכה בדוגמא `q`, זה בודק:

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

ה- AIR פתיחת הרכב חייב לאותנטי `R_air_composition`.
ה- FRI שרשרת אז מתחיל מאותו `A_q` ועליי להסתיים
סופית מאושרת FRI עץ מתחת לתרום FRI שורש.

## מה Proverb בודק {#what-the-prover-checks}

לפני הקמת העקבות, FastPQ סבר קאנוניקליז את סדר הסחורה
על ידי מפתח המעבר, מעמד הפעולה, וסדר הכנסת. שורות העברה גם
דורשים מטא-מידע מהעובדות. חבילת עם שורות העברה אבל אין העברה
התסריט אינו חוקי.

עבור מסמכי העברה, הבדיקות בצד הסבר כוללות:

- המשקל של המשלוח לא חייב להצטמצם
- `sender_after` חייב להיות שווה `sender_before - amount`
- `receiver_after` חייב להיות שווה `receiver_before + amount`
- התסריט חייב לכסות כל שורה של העברה בלהט
- סיבוב פוזידון של דלתה אחת, כאשר קיים, חייב להתאים לתקליפה.
  תמונה מוקדמת
- בתנאי שמגבלות מרקל נדירות צריכות להתפורר כמו גרסה 1; הנתיבים החסרים
  מלאים בתוכנות סינתטיות דטרמיסטיות

העקבות מכילות עמודי סלקטר עבור העברה, מנטה, שריפה, מתן תפקידים,
ביטול תפקיד, קבוצת מטא נתונים ושורות חיפוש אישור.
שורות גם נושאים דלתות חתומות, פועלות לדלתות על כל נכס, ומספקת
ספריים.

## פרובור ליין {#prover-lane}

`irohad` מתחילים FastPQ סבר ליין בתחילת אם הסבר האחורי יכול
המסלול הוא משימת רקע עם שורה מוגבלת.
בלוק מייצר עדה להוצאה להורג, מסלול ההפשע מציג עבודה של סבר
המכיל את ה-block hash, גובה, נוף ועיד.

אם המסלול לא פועל או השורה מלאה, העבודה נמלטת
עיבוד הבלוק הרגיל ממשיך.
זה לא שער קבלה של עסקאות או שער קונצנזוס.
דרך על מדינה שכבר הוצגה.

המסלול בונה סבר עם:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` נותן למבחין לבחור את האחורי הזמין. `cpu` ביצוע סימנים
ל- CPU. `gpu` מעדיפים GPU ביצוע, עם CPU הפסגה שבו
ה-backend לא יכול להשתמש בכורנים המבוקשים.

## אימות {#verification}

FastPQ אימות הראיות מבנה מחדש את התחייבות הקנוניקה של המגרש.
המבחין בודק את גרסת הפרוטוקול,
גרסה של הגדרת פרמטרים, גבולות שיחזור, מחויבות לעקוב אחריות, הכנסות ציבוריות,
פתיחות מרקל עם דגימות, AIR פתיחות, ו FRI שרשרת חיפוש.

הגבולות ההחזות המקובלים כוללים:

| גבול              | דפוס |
| ------------------ | ------: |
| שורות מעבר    |     256 |
| גודל המשאב הפועל של הקבוצה | 256 KiB |
| FRI שכבות         |      16 |
| פתיחות בקשת     |     128 |

## Nexus רלעים מאובטחים {#nexus-verified-relays}

Nexus AXT חותמות ראיות יכולות להכיל `AxtFastpqBinding`. מתי?
`RegisterVerifiedLaneRelay` מבצעים, Iroha:

1. אושר את קספת הרחבת המסלול, FastPQ חומר ראיה
2. בודק את חלל הנתונים ואת שורש המניפסט
3. פיתח את AXT מעטפת הוכחה
4. דורש `fastpq_binding`
5. מתבנה מחדש את FastPQ סחורה מהסגירה הזו
6. פותח את המשתולל FastPQ הוכחה
7. מתקשרים FastPQ בדיקת על המגרש שנבנה מחדש והוכחה

אם הבדיקה תצליח, Iroha חנויות a `VerifiedLaneRelayRecord`
המכיל את התייחסות למעגל, מעטפה מקורית, חשיפת מטען תועלתי ראוי,
גובה הבדיקות, שורש מופלא, ו FastPQ מחייב.

חותמות רלוף לני גם נושאות קומפקטית FastPQ חומר הוכחה.
הוא צירוף מעבר לאישור המסלול, לאישור חלל נתונים, גובה כביש, אימות
גובה, כותרת בלוק האשיש, הערכה האשיש וקור המניפסט.
השיתוף מקובל רק כאשר יש לו שני QC ובאמת FastPQ הוכחה
חומר.

### AXT מתמטיקה מחייבת {#axt-binding-math}

עבור Nexus AXT מעטפות, `AxtFastpqBinding` הוא קנוניק לפני הוכחה
שיחק מחדש. ערכי הפרמטרים ריקים `fastpq-lane-balanced`; ריקה
איד המבחין וגרסה מקובלת `fastpq` ו `v1`; סוג התביעה מופרע
ומועטים.

ה- AXT FastPQ הכניסה הציבורית היא דטרמינסטית בייט האש:

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

AXT מפתחות המעבר הן:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

ה- `authorization` התביעה מוסיפה שורה של סיוע לתפקיד:

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

ומטאטא נתונים קו מחייב את מדיניות ההסמכים. `compliance` תביעה
מוסיף שתי שורות של מטא נתונים: אחת עבור מדיניות ואחת עבור מספרי נתונים יעדים.

עבור `tx_predicate` ו `value_conservation`, סכום השפעה מפורש הוא
משמש כאשר הקשר מכיל סכום מקור או יעד חיובי.
אחרת הקוד מוציא סכום דטרמיניסטי מוגבל:

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

זהות החשבון של המשלח והמתקבלים סינתטיים נוצרו ממזרחים מפתח:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

ה- hash של החבילה העברה הוא:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

ה- AXT סימן ההזיהוי של המוניגרס הוא SHA-256 על Norito קודינג של
חיבור קנוני:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP ראיות של מסר שקופים {#sccp-transparent-message-proofs}

ה- SCCP קופסה עוזרת משתמשת גם FastPQ עבור מסר צלצול שקוף
הנתיב הזה נפרד מה `irohad` מסלול הבהיב של הרקע.
בונה FastPQ חבילה ישירות מ SCCP חבילת ההוכחה של הודעות
מפרסם, ואז עפת את ההוכחה המוצאת לאמת פתוחה.

ה- SCCP שימוש בקבוצות `fastpq-lane-balanced` ושלושה מעבר של מטא נתונים:

| מפתח                             | מבצע |
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

הכנסותיו הציבוריות נגזרות מה SCCP הוכחה פנימית שקופה:

| FastPQ הכניסות  | SCCP מקור                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        | 16 בייטים הראשונים של מבריק2ב מתאכל על השטרתי האש |
| `slot`        | גובה הסוף                                            |
| `old_root`    | חשיפת מטען                                               |
| `new_root`    | שורש התחייבות                                            |
| `perm_root`   | חשיש בלוק הסיום                                        |
| `tx_set_hash` | ה-Hash של הצהרה                                             |

ה- SCCP מקודרים קנוניים כותבים מספרים שלמים קטנים-אנדיאניים ומקודדים
מערכות בייט אורך משתנה כמו:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

שרשרת בייט הכניסה ציבורית ברורה היא:

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

הבייטים של הצהרה שקופה הם הקשר בין גרסה, שרשרת
תחומי משפחה, מקומיים וחלקות אחרות, מודל אבטחה, ממשלת מעגל,
קודק החשבון, מודל סיום, מטרה של המבחין, משפחת ההגדרה האחורית של המבחנים,
שדות של שרשרת/אחורי קצה/מניפסט עם גודל מקובל, חישוי יעד,
מפתח קודק החשבון, סוג של עומס תועלת, בייטים הכניסה ציבוריים,
השטות האש היא:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

ה- FastPQ ID של מסלול הנתונים עבור דרך ההוכחה זו הוא 16 בייטים הראשונים של
עוד מאכלת בלאק2ב עם מקודם:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

ה- SCCP FastPQ הקבוצה היא בדיוק:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

ואז מסווג על ידי אותו FastPQ חוק ההוראה.

ה- OpenVerify התחייבות של המבחין SHA-256 על SCCP סיבוב הודעות
השם והקאנוניקה FastPQ מתאר המבחין:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

החומרי FastPQ הוכחה היא Norito-נצפן לתוך `StarkFriOpenProofV1`, אז
עטופה `OpenVerifyEnvelope` עם סיבוב אחורי `Stark`. SCCP אימות
הוא בונה מחדש אותו דבר. FastPQ חבילה מהחבילה ומגליון, בודקים את
פותח מעטהנתונים של סף אימות, ומקרא את FastPQ בדיקת על
חבילה מחודשת וראיה.

## מערכות פרמטרים {#parameter-sets}

קטלוג הפרמטרים הקנוניים חושף שני קבוצות פרמטרים.
סבר ליין בשימוש כיום `fastpq-lane-balanced`.

| פרמטרים              | מטרה                    | שדה                          | חשישים                                      | FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` | סיבוב סבר מאוזן | ארגז קוואדראטי של גולדילקס | התחייבות של פוזידון, קטלוג SHA3 תווית | פרק 8, פצצה 8, 46 שאלות   |
| `fastpq-lane-latency`  | כבישים רגישים לטיחות    | ארגז קוואדראטי של גולדילקס | התחייבות של פוזידון, קטלוג SHA3 תווית | סעיף 16, פיצוץ 16, 34 שאלות |

שניהם מכוונים לביטחון 128-ביט ושימוש בגודל תחום עקבות של `2^16`. ה-
Rust V1 קוד שיחזור התסריט כרגע נובע מאתגר פיאט-שמיר
בייטים עם `iroha_crypto::Hash::new` במקום להתייחס ישירות
SHA3-256.

קבועות קטלוג מדויקות המשמשות על ידי Rust הסברים הם:

| קבוע             | `fastpq-lane-balanced` | `fastpq-lane-latency` |
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

## הגדרות {#configuration}

FastPQ ההשפעה נמצאת תחת `zk.fastpq`.

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

את אותן תוויות ביצוע וטלמטריה ניתן לשכוח `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

משתנים סביבתיים תומכים גם בשדות ההסדר.
FastPQ- משתנים ספציפיים כוללים:

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

כאשר טלמטריה מופעלת, FastPQ מיצוא מדדים עבור בחירת ההקלטה האחורית
התנהגות בזמן ההפעלה של המתכת:

| מטריק                            | המשמעות                                                                     |
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     | מצב ביצוע מבוקש ופתרון לפי תוויות ההקדם וההתקן          |
| `fastpq_poseidon_pipeline_total`  | מסלול הצינור של פוסיידון שנדרש ונפתר                               |
| `fastpq_metal_queue_depth`        | גבול קו מתכת, מספר מקסימום בטיסה, סך משלוח וחלון הדגימה |
| `fastpq_metal_queue_ratio`        | מיחס של שורות מתכת עמוסים ומכוסים                                         |
| `fastpq_zero_fill_duration_ms`    | תוחלת מלאה אפס עבור מטאל                                      |
| `fastpq_zero_fill_bandwidth_gbps` | רוחב קו של המלאה אפס                                                 |

עבור תפריט ביצועים כללי, השתמשו בהם עם ההסכמה והצורה
אותות המפורסמים ב [ביצועים ומטריקות](/he/guide/advanced/metrics.md).

## דף קשור {#related-reference}

- [תוכנית מודל נתונים](/he/reference/data-model-schema.md) עבור סוג המוצא
  פרטים
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ אפשרויות](/he/reference/irohad-cli.md#arg-fastpq-execution-mode)
