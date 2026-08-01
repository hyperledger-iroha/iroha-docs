---
translation_locale: he
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE עומד על הערכת תפקוד לאקוני של מכונת גישה אקראית. ב Iroha, זהו שכבת תפקוד מוסתרת גנרית לתוכניות אשר המדיניות הציבורית שלה היא על שרשרת, אבל שהגיון ההערך שלה, הסודי או הכנס הגורם לא צריך להיות כתוב למדינה עולמית. הוא משמש על ידי זרמי מזהה SORA Nexus, כגון חיפוש טלפון פרטי או דואר אלקטרוני, וניתן גם לחשוף אותו כעוזר להפעיל תכנית גנרית Torii כאשר הפרופיל של קשר מאפשר את הדרכים המובנות לאפליקציה.

שרשרת מאחסן את הנתונים המתבטיחים של מחויבות המדיניות ושל אימות הקבלה. פיתור או Torii runtime מעריך את התוכנית החבויה, חוזר רק על ההוצאת המותרת ומסגיר קבלה שהלקוחות, כלי תמיכה או הוראות ספרים יכולים לאמת נגד המדיניות הרשומה.

## שמות {#naming}

ההקצבה בין השמות חשובה:

|תקופה |משמעות |
| --- | --- |
|`ram_lfe` |השוואה החיצונית של פונקציה מוסתרת: מדיניות התוכנית, מחויבויות, קבלות ביצוע ומצב אימת קבלה. |
|`BFV` |מערכת ההצפנה הומורפית של Brakerski/Fan-Vercauteren המשמשת על ידי כניסה מוצפן RAM-LFE .|
|`ram_fhe_profile` |BFV - מתא נתונים ספציפיים למכונת ההפעלה המפורסמת. זה לא שם שני עבור RAM-LFE. |

במודל הנתונים, `RamLfeProgramPolicy` ו`RamLfeExecutionReceipt` הם סוגים של RAM-LFE. פרמטרים BFV, מעטפות טקסט סיפרת, והפרופיל התוכנה המסתתר RAM-FHE שייכים לסקע ההפעלה הצפויה המשמשת על ידי מדיניות.

## מה זה רשום {#what-it-records}

מדיניות תכנית RAM-LFE נרשמת באופן גלובלי על ידי `program_id`.

- חשבון הבעלים שיכול להפעיל, לנטרל או לשנות באופן אחר את המדיניות.
- הסוף האחורי המפרסם ללקוחות
- מצב אימות הקבלה, או `signed` או `proof`
- מחויבות למתנתונים התוכנה החבויים ואת סוד המערכת
- המפתח הציבורי של resolver עבור קוויות חתומות
- נתונים מטא-ביצועים ציבוריים מוצפן בחופשיות, כגון פרמטרים BFV ו `ram_fhe_profile`
- דגל `active` שמפקח אם המדיניות יכולה להוציא קבלות חדשות;

הסוד החבוי, ערך מזהה טקסט קל, וגוף התוכנית החבוי אינם מאוחסנים במצב העולם. לקוחות צריכים לטפל בהתחייבויות, חישובים לא שקופים, חישובי קבלה, טקסטים מקובעים ודיגסטות תוכניות כערכים פרוטוקולים לא שקופים.

## מאחורות {#backends}

התמיכה הנוכחית RAM-LFE מתמקדת בשלושה מזהים של האחורי:

|קצה אחורה |השתמש|
| --- | --- |
|`hkdf-sha3-512-prf-v1` |הערכה של PRF בעלת מחויבות. |
|`bfv-affine-sha3-256-v1` |BFV מבוסס על הערכה סודית על חלקי מזהה מוצפן. |
|`bfv-programmed-sha3-256-v1` |BFV תומך ביצוע מתוכנת על ידי רישומים מוצפן ודרכי זיכרון. |

עבור מדיניות מזהה, הגבולות האחוריים המוכנת BFV הוא הנתיב המודרני החשוב. היא מאפשרת לארנקים לחשוף הכניסות נורמליות מקומית, מאפשרת למפתר להעריך מבלי לראות מזהה ציבורי בעסקה. ומחזיר קבלה שמקשרת את ההש המוצא למדיניות התוכנית הרשומה.

## מתמטיקה {#math}

סעיף זה מתאר את אלגברה ברמת יישום המשמשת על ידי הקוד הנוכחי RAM-LFE. זה לא הוכחה אבטחת; זו התרגום הדטרמיניסטי ומודל הערכה מוצפן שמדיניות ולקוחות חייבים להסכים.

### הערות {#notation}

תן לי:

- \(H(m)\) להיות Iroha `Hash::new(m)`: Blake2b-32 על `m`, עם הקטע החשוב ביותר של הביט האחרון נאלץ ל- `1`.
- \(N(x)\) להיות הקנוניקה Norito קוד של `x`.
- \(a \parallel b\) המשמעותית של קישור בקשת בייט.
- \(\operatorname{le64}(i) \) להיות קודי 8-בייט קטנטן אנדיאן של מספר מלא לא חתום.
- \(s\) להיות הסוד המפתר שנמצא מחוץ למדינה העולם.
- \(P\) להיות פרמטרים של מדיניות ציבורית.
- \(A\) יש לבקש נתונים קשורים.
- \(x\) יהיו בייטים הכניסה נורמליים או קספת כניסה מוצפנת עם Norito, בהתאם לסוף.

RAM-LFE משתמשת בהשיזים נפרדים על ידי דומנים. הנוסחים הבאים מכנים את הדומנים לפי מטרה; שרשרת הביט הנוכחית שלהם היא:

|סימן |זרם תחום |
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

### מחויבות פוליטית {#policy-commitment}

מחויבות מדיניות מחייבת את הפרמטרים הציבוריים ואת הסוד המסתור של פותר לאחור. ראשית, הסוד נעשה בנפרד:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

ואז התסריט המלא של מדיניות הוא מקודד:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

וההשיש המפורסם במדיניות הוא:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

הקשר `PolicyCommitment` הוא:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

הערכה מחשיבה מחדש את אותה ערך מהסוד של זמן ההפעלה. אם האש המחושב מחדש שונה, הערכה נכשלת עם חוסר התאמה בהתחייבויות.

### HKDF-SHA3-512 אחורה {#hkdf-sha3-512-backend}

עבור `hkdf-sha3-512-prf-v1`, התוצא הוא הכניסה הנורמליזת עצמה, אבל ההזהה הבלתי ברורה והכש של קבלה הם תוצאים מחוברים סודיים PRF.

התסריט של בקשה הוא:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

המפתח של HKDF מלח וסיודורנדום הוא:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

החומר הבלתי שקוף מתרחב ומתחולף:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

חומר הקבלה מחבר גם את המסמך הבלתי שקוף:

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

הפסקה האחורית חוזרת:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV פרימר {#bfv-primer}

BFV הוא תוכנית חיבור הומורפית מבוססת רשת. "הומורפי" פירושו כי תוכנה יכולה להוסיף ולהרפל ערכים מוצפנים, ולאחר הגילוי, לקבל את אותה תוצאה כאילו היא ביצעה את ההרכבות והרכבים על הערכים של הטקסט פשוט.

עבור RAM-LFE, BFV משמש כמנגנון הכנסת מוצפן:

1. ארנק משגר ערך פרטי, כגון מספר טלפון או כתובת דואר אלקטרוני.
2. הארנק הופך את הבייטים למקומות של מספרים מלאים קטנים.
3. כל חלל הוא מוצפן עם המפתח הציבורי BFV של הגורם.
4. זמן ההפעלה של המפתר מעריך את התוכנה החבויה על פי הטקסטים האותניים.
5. זמן ההפעלה פותח רק את התוצאת התוכנה המסתורית וסימנים או מוכיחים קבלה.

BFV הוא ארימטיקה של מספרים מלאים מדויקים, לא ארימטית כזו. זו הסיבה שהוא מתאים יותר לבייטים מזהים ומודולריים קטנים מחשובים מאשר לקבוע מודל נקודת צמיחה. Iroha זה זמני. BFV השימוש, כל חלל מוצפן נושא מודולו בעל ערך סקאלארי אחד \(t\), בדרך כלל בייט או שדה אורך בייט. \(q\). הפער בין \(q\) ו \(t\) מספק מקום לפענח את הרעש שהצפנה ופעולות הומורפיות מביאות.

ב- BFV יש שני מרכיבים פולינומיים:

$$
c=(c_0,c_1)
$$

המפתח הסודי הוא פולינום נוסף \(s_k\). פתיחת קוד משלב את המרכיבים:

$$
v = c_0 + c_1s_k
$$

אם הטקסט הצפוני נוצר בצורה נכונה והרעש עדיין קטן מספיק, \(v\) הוא קרוב לטקסט פשוט בקנה מידה. סיבוב מוציא את קואפיציית הטקסט פשוט modulo \(t\). המאפיין היעיל הוא כי פעולות טקסט צפוני שומרים על המבנה זה:

|פעילות פשוטה |הפעלת טקסט סיפר |
| --- | --- |
|\(m+n\) |הוסף רכיבים של טקסט סיפר. |
|\(m+\alpha\) |הוסף קבוע של טקסט פשוט בקנה מידה ל \(c_0\). |
|\(\alpha m\) |סולם את שני מרכיבי הטקסט הצפוני ב \(\alpha\). |
|\(mn\) |להכפיל פולינומלים של טקסט סיפר, להגדיר מחדש, ולאחר מכן לקבוע מחדש. |

הרבייה היא המבצע היקר. מוצר של שני טקסטים משתי מרכיבים יוצר באופן טבעי שלושה מרכיבים . טקסט סיפר שפורסמה עם \(1\), \(s_k\), ו \(s_k^2\). רלינריזציה משתמשת במפתח הערכה פורסם כדי לפתח את \(s_k^2\) המונח חוזר לטקסט סיפרטי רגיל עם שני מרכיבים. זה שומר על חיבורים ומضاعفات מאוחר יותר באמצעות אותו טקסט סיפרי. צורה.

BFV הוא גם "מדרגה": כל פעילות מוצפנת צורכת כמה תקציב רעש. יישום זה לא מפעיל טקסטים סיפרטיים כדי לעדכן את התקציב הזה. במקום זאת, RAM-LFE פורסם קטן `ram_fhe_profile` ומקבל רק צורה של תוכנית מוסתרת מוגבלת. זה שומר על הערכה בתוך עומק תומך של קבוצת הפרמטרים. הפרופיל המוכרם הנוכחי מאפשר ספירת רישום קבוע, ספירה קבועה של נתיב זיכרון, ומרבית אחד סיפרטקטסט-סיפרטקטס כפייה לכל צעד מוכרד.

בעניין הזה RAM-LFE עיצוב, BFV מסתיר את הכנסת הלקוח מהנתונים של ספריה ציבורית ומבחינים שרק רואים את העסקה או המטען הפועל של הנתיב. זה לא אומר שרשרת מבצעת תוכניות מוצפן שרירותי בעצמה. Torii Resolver runtime עדיין מחזיק את BFV חומר סודי, מעריך את התוכנה החבויה המוגדרת, פותח את ההוצאת המותרת, ומעיד על התוצאה. ההדף לאחר מכן מאשר את האישור נגד התחייבות למדיניות על שרשרת ומפתר מפתח ציבורי או מתא נתוני הוכחה.

תיק השימוש במזהה בוחר באופן מכוון ייצוג פשוט. רצועה נורמלית מוצנת כ:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

כל אלמנט מוצפן כטקסט סיפרה סקאלארי משלו BFV. הצורה הזו הופכת את נורמליזציה ואת אישור המעטפה לידי ביטוי, מאפשרת לנקודות לבניית בקשות מוצפפות מפרמטרים ציבוריים, ומאפשרת למפתר לקאנוניקליזציה של הכניסה מוצפנת שווה ערך לתוך כתובת קבלה יציב.

### BFV מודל טבעת {#bfv-ring-model}

ה-backends BFV משתמשים בטבעת פולינומיה נעגציקלית:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

וטבעת טקסט פשוט:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

איפה:

- \(n\) הוא `polynomial_degree`, כוח של שני.
- \(q\) הוא `ciphertext_modulus`
- \(t\) הוא `plaintext_modulus`
- \(q > t\) ו \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

וקטורים של קואפיציית טקסט קל הם מוצפן על ידי מידת כל קואפיצינט:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

פתיחה מרכז-מעלה כל קואפייצנט של:

$$
v = c_0 + c_1 s_k \in R_q
$$

לאחר מכן מסובב אותו בחזרה ל \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

כאן \(s_k\) הוא פולינומיה של המפתח הסודי של BFV, ולא הסוד החליט החיצון של RAM-LFE \(s\).

### BFV דור המפתח {#bfv-key-generation}

עבור הכניסה של מזהה מוצפן, חומר המפתח BFV הוא דטרמינסטי לכל מסדר סודי ונתונים קשורים:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

ה- BFV RNG זורם כ:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

הדגימות של גנרטור המפתח:

- \(s_k \in \{-1,0,1\}^n\), מודולו המוצג \(q\)
- \(a \leftarrow R_q\) באופן אחיד
- \(e \in \{-1,0,1\}^n\)

המפתח הציבורי הוא:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

לתיקון מחדש, תן \(s_k^2\) להיות מוצר הטבעת ב \(R_q\). עבור כל מספר בסיס-\(B\) \(j\), דגימה \(a_j\) באופן אחיד ו \(e_j\) מהתפוצה הקטנה, ולאחר מכן פרסום:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

הנתונים המפורסמים של מדיניות הציבור BFV מכילים \(((n,q,t,B)\), המפתח הציבורי, ו `max_input_bytes`. המפתח הסודי של BFV ומפתח הרלינעריזציה נשארים בזמן ההפעלה של הפתרון.

### BFV הצפנה והפעולות {#bfv-encryption-and-operations}

כדי לחשוף פולינום של טקסט פשוט \(m\), המיזם מייצר זרע אחר ChaCha20 RNG מ:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

הוא לוקח דגימות \(u,e_1,e_2 \in \{-1,0,1\}^n\) ומחושב:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

טקסט הסיפרו הוא \(c=(c_0,c_1)\).

הוספת הומורפית היא רכיב-חכם:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

הוספת סקלאר טקסט קלר \(\alpha\) לקואפיצ'ון אפס שינויים בלבד \(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

כפול על ידי סקלאר טקסט פשוט \(\alpha\) מגדלים את שני המרכיבים:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

עבור שני טקסטים צפוניים \(c=(c_0,c_1)\) ו \(d=(d_0,d_1)\), כפול הטקסט הצפוני מחשוב קודם כל טקסט צפוני בגודל של שלושה ומגדיר את כל קואפיצנט בחזרה ב \(t/q\):

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

כל המוצרים לעיל הם מוצרי טבעת נגאציקלית ב \(R_q\). לאחר מכן \(\tilde c_2\) מתפרק לתוך פולינומים בסיסיים-\(B\):

$$
\tilde c_2 = \sum_j B^j u_j
$$

וניתן לסדר מחדש:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

התוצאה היא שוב טקסט סיפר של שני מרכיבים BFV.

### תעודת זהות סיפר טקסט מעטפה {#identifier-ciphertext-envelope}

קוטב בייט כניסה לזהות:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

הוא מקודד בשערות סקאlares:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

וכל החלקים הנותרים הם אפס עד `max_input_bytes + 1`. כל חלל סקאלארי הוא מוצפן ככיוון אפס פולינומי טקסט פשוט \([m_i]\). זרע ההצפנה של כל סלוט הוא:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

המעטה המוצפנת של מזהה היא:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

כאשר \(M=\mathrm{max\_input\_bytes}\).

### BFV אחורה מאושרת {#bfv-affine-backend}

עבור `bfv-affine-sha3-256-v1`, זמן ההפעלה הראשון נגזר BFV חומר מפתח \(s\) ו \(A\). הפרמטרים הציבוריים המוצאים חייבים להתאמה בדיוק עם הפרמטרים הציבוריים שהתבצעו על שרשרת.

זרעי המעגל האפיני הם:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

מהזרעים האלה, הדגימות של זמן ההפעלה, מודולו \(t\), מעגילת קישור 32 שורות:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

שם \(m_i\) הם חלקי ההזהות המפורסמים. באופן הומורפי, הוא מחשוב את אותה ערך על טקסטים קוברים:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

הגורם פותר את כל \(C_j\), דורש שכל הקואפיצנטים של טקסט פשוט מאחור להיות אפס, משנה את הערכים של הקואפיצינט-אפס לאייטים, ומבנה:

$$
O=(y_0,\ldots,y_{31})
$$

ואז:

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

### BFV קצה אחורי תוכנת {#bfv-programmed-backend}

עבור `bfv-programmed-sha3-256-v1`, הפרמטרים הציבוריים מכילים את פרמטרי ההצפנה של מזהה BFV בתוספת מאכלת תכנית מוסתרת:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

הפרופיל הנוכחי של RAM-FHE הוא:

|שדה |ערך |
| --- | --- |
|`profile_version` | `1` |
|`register_count` | `4` |
|`memory_lane_count` | `32` |
|`ciphertext_mul_per_step` | `1` |
|`encrypted_input_mode` |`resolver_canonicalized_envelope_v1` |
|`min_ciphertext_modulus` | \(2^{52}\) |

הכניסה של טקסט פשוט שנשלחה ל Torii מוצפנת באותה מעטפה BFV לפני ביצועה. זרוע ההגדרה עבור הצפנה בצד השרת היא:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

עבור הכנסות מוצפנות המוצעות מבחוץ, הגורם מפרש את קספת ההזהה ומחזיר אותה לקספת דטרמיניסטית זו לפני ביצוע. הקאנוניקציה הזו שומרת על ה-hashes של הקבלה יציבות לאורך טקסטים צפריים שווה סמנטיקה BFV.

קווי הזיכרון המשולבים הראשונים נגזרו מ:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

עבור כל אחד מ-32 שורות, הדגימות של זמן ההפעלה \(r_j \in [0,t)\) ומאחסנים טקסט סיפרת BFV שמצפן \(r_j\). התוכנית החבויה מבוצעת לאחר מכן על רישומים מוצפן וזכרון מוצפן:

|הוראות |אלגברה |
| --- | --- |
|`LoadInput(dst, i)` |\(R_{\mathrm{dst}} \leftarrow C_i\) |
|`LoadState(dst, j)` |\(R_{\mathrm{dst}} \leftarrow S_j\) |
|`StoreState(j, src)` |\(S_j \leftarrow R_{\mathrm{src}}\) |
|`LoadConst(dst, a)` |\(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a) \) |
|`Add(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
|`AddPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
|`SubPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
|`MulPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
|`Mul(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_aR_b\), ואז לתיק מחדש |
|`SelectEqZero(dst, cond, z, nz)` |לפענח \(R_{\mathrm{cond}}\); בחרו \(R_z\) כאשר הוא אפס, אחרת \(R_{nz}\). |
|`Output(src)` |להוסיף \(R_{\mathrm{src}}\) לרשימת רישום ההוצא. |

לאחר שהקלטת ההוראות מסיימת, המפתרת פותחת את כל רישום ההוצאת, הופכת קואפיצנט אפס לבייט, ומחברת את הבייטים הללו:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

ה-Hashes הגנריים המוכנת ל-backend הם:

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

הקלטת ההזהרת המוכנת מקובלת מכילה 64 חלקי הכניסה. עבור כל חלל \(i\), היא מצריכה את החלל הכניסה, מצריכת קו זיכרון \(i \bmod 32\), מוסיפה אותם ומוצאת את התוצאה:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### כמות ההוצאות והכרזות {#output-hashes-and-receipts}

קבלה ההפעלה הגנרית RAM-LFE לא חותמת את התוצאת המקורית. היא חותמת על ה-hash התוצאת:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

עבור קבלות ההפעלה של Torii RAM-LFE, נתונים הקשורים הם בייטים של מזהם התוכנית הקנוני:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

המטען הפועל של הקבלה חתומה הוא:

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

עבור מצב `signed`:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

אימות בודק את החתימה עם `resolver_public_key` ומסרב על הקבלה, אלא אם כן כל השוויונות הללו מחזיקות:

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

אם המתקשר מספק `output_hex`, המבחין בודק גם:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

עבור מצב `proof`, האישור נושא מעטפה של הוכחה במקום חתימה. אימות בודק כי האגף החיצוני של ההוכחה, ID המעגל, ה- hash של תוכנית הכנסת ציבורית, ה- Hash של המפתח הבדיקה, והדוגמאות הציבוריות חשופות תואמות את נתונים המטה-מבחינת ההוכחה ואת ה- hash הקודד של קבלה-חובץ משלם. בואו:

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

הדוגמאות הציבוריות צפויות הן ארבעה עמודי אלמנט אחד. העמודה \(j\) מכילה בייטים \(h_{8j}\ldots h_{8j+7}\) ואחריהם 24 בייטים אפס:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### תצפית מזהה {#identifier-projection}

רזולוציית ההזהה לא משתמשת ב-backend הגנרי `opaque_hash` כ-identifier החשבון הבלתי שקוף של המשתמש. היא מציגה את ה-hash התוצאת RAM-LFE דרך תחומים ספציפיים למזהה:

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

`IdentifierResolutionReceipt` חותם על מטען שימושי ברמה גבוהה יותר:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

עבור קבלות זיהוי חתומות:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` מקבל את הקבלה רק כאשר החתימה או ההוכחה היא תקיימת, המטען הפועל של ביצוע RAM-LFE המשולב מתאים למדיניות התוכנית המתועדת, ו`uaid` ו `account_id` הם החיבורים הנדרשים.

## זרם ההוצאה להורג {#execution-flow}

ההוצאה הכללית RAM-LFE עונה בצורה כזו:

1. ניהול או רישומים של מפעיל `RamLfeProgramPolicy`.
2. הבעלים מפעיל את המדיניות.
3. הלקוח קורא את הנתונים המדעי הציבוריים מ- Torii.
4. הלקוח מספק בדיוק טופס הכניסה אחד לפתור: טקסט פשוט `input_hex` או מעטפת כניסה מוצפנת BFV.
5. זמן ההפעלה מעריך את התוכנית החבויה ומחזיר אותה `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash`, ו- `RamLfeExecutionReceipt`.
6. הלקוח או ה-backend בודקים את הקבלה בהתאם למדיניות המפורסמת, באופן אופציונלי בדיקת כי `output_hex` החזר מתאים לקבלה של `output_hash`.
7. הוראה ברמה גבוהה יותר, כגון `ClaimIdentifier`, יכולה להכניס את הקבלה המוכרת במקום להכניס את הכניסה החומרה.

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

## מדיניות זיהוי {#identifier-policies}

מדיניות ההזהה היא שימוש ספציפי ב RAM-LFE. הם מוסיפים חלל שמות עסקי וחוק נורמלי על פני מדיניות תכנית דנרית:

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

שכבת ההזהה משתמשת בהכרזת RAM-LFE כדי לקשור:

- `policy_id`
- התזהיר הבלתי שקוף המוצא מהפונקציה החבויה.
- ההגדרה `receipt_hash`
- חשבון UAID
- הקנוניקה `account_id`
- המשאב הפועל של ההוצאה RAM-LFE הכללי

עבור חיבור הפנים למשתמש, שמרו על כינויים של חשבונות נפרדים מזהים פרטיים. הכינויים הם שמות ציבוריים; מספרי טלפון, כתובות דואר אלקטרוני וערכים דומים צריכים לזרום דרך מדיניות התזהות ותמונות.

## Torii מסלולים {#torii-routes}

כאשר משפחת המסלול הפונה לאפליקציה מופעלת, Torii חושפת את RAM-LFE ועוזרי ההזהות:

|כביש |מטרה.|
| --- | --- |
|`GET /v1/ram-lfe/program-policies` |רשימה של מדיניות תכנית פעילה ובלתי פעילה RAM-LFE ומטאטא נתונים על ביצוע ציבורי. |
|`POST /v1/ram-lfe/programs/{program_id}/execute` |להפעיל תוכנית אחת מ- `input_hex` או `encrypted_input` ולחזיר את ההשאות המוצאיות בתוספת קבלה ללא מדינה.|
|`POST /v1/ram-lfe/receipts/verify` |בדוק `RamLfeExecutionReceipt` בהתאם למדיניות המפורסמת, ואפשר להשוות את `output_hex` ל `output_hash`. |
|`GET /v1/identifier-policies` |רשימה של מדיניות מזהה, דרכי נורמליזציה, מפתחות resolver ונתונים metadata כפופים. |
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt` |להוציא את הקבלה שהמשתמש יכול להכניס `ClaimIdentifier`. |
|`POST /v1/identifiers/resolve` |לפתור הכניסה נורמלית של מזהה לחשבון הקשור כאשר קיים תביעה פעילה. |
|`GET /v1/identifiers/receipts/{receipt_hash}` |לחפש טענת מזהה מתמשכת באמצעות חיש של קבלה עבור כלי ביקורת ותמיכה. |

תמיד בדוק את מסמך `/openapi` או `/openapi.json` של הערך היעד לפני בניית נגד המסלולים האלה. זמינות תלויה בניית הערך ובפרופיל הרשת.

## זמן ההפעלה של הערך {#node-runtime}

זמן ההפעלה של Torii בתהליך RAM-LFE הוא מותאם תחת `torii.ram_lfe.programs[*]`, מפתח על ידי `program_id`. כל תוכנית מותאמת חייבת להתאים למתחייבות המדיניות על שרשרת וניתן לספק את החומר בזמן ההפעלה הנדרש כדי להעריך ולהוכיח כיסויים . מסלולים מזהים משתמשים מחדש באותו זמן ההפעלה; הם לא דורשים שטח קונפיגציה נפרד של מזהה-מתברר.

הרישום של מדיניות על שרשרת אינו מספיק לבדו. הערך המטרה חייב גם לחשוף את משפחת המסלול ויש לו חומר תאימה לזמן ההפעלה עבור התוכניות שהוא צפוי לבצע.

## רצועות משמרת מבצעיות {#operational-guardrails}

- רשום מדיניות לא פעילה, לבדוק את הנתונים הציבוריים, ולאחר מכן להפעיל אותם.
- שמרו על סודות המערכת, מפתחות חתימה של רוזולר, ו BFV חומר סודי מתוך מסמכים, שיכונים, עסקאות, וקבוצות לקוחות.
- אל תכניסו מזהים חומריים לכיסויים של חשבונות, מטא-מנתונים של עסקאות, אירועים או שדות של מדיניות עולם.
- לאבד את הקבלות בצד הלקוח לפני שישלחו הוראות ברמה גבוהה יותר כאשר SDK חושף מבחן.
- השתמשו בשדות תקופת הפסקה שבהם הצפויים הזקנים לא אמורים להישאר בתוקף לנצח.
- סובב באמצעות רישום תכנית חדשה או מדיניות מזהה, הגירה של לקוחות, ומכבה את המדיניות הישנה ברגע שזמינות קבלה חדשות זורמות.

## נושאים קשורים {#related-topics}

- [דמי תמיכה למרחב נתונים פרטי ](/he/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii נקודות קץ](/he/reference/torii-endpoints.md#app-and-sora-route-families)
- [עסקאות אנונימיות ](/he/blockchain/anonymous-transactions.md)
