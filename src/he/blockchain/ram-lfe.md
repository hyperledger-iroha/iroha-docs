---
translation_locale: he
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE הוא מייצג את הערכת פונקציה של מכונת גישה אקראית.
Iroha, זה שכבת תפקוד מוסתר כללית עבור תוכניות
הוא על שרשרת אבל שהגיון, הסוד או הכניסות החומריות של המערכת שלו לא צריכות להיות
כתוב למדינת העולם. SORA Nexus זלילים מזהים, כגון
חיפוש טלפון פרטי או דואר אלקטרוני, וניתן גם לחשוף כ Torii
עוזר ביצוע התוכנית כאשר פרופיל הערך מאפשר את המסלולים הפנים לאפליקציה.

שרשרת מאחסן את הנתונים המטאטאריים של מחויבות מדיניות ושל אימת קבלה.
פיתור או Torii runtime מעריך את התוכנית החבויה, חוזר רק
הוצאת נתמשה, ומטביק קבלה כי לקוחות, כלי תמיכה, או
ההוראות של הספר הגדול יכולות לאמת את המדיניות הרשומה.

## שמות {#naming}

ההקצבה של השמות חשובה:

| תקופה | המשמעות |
| --- | --- |
| `ram_lfe` | השוואה החיצונית של פונקציה מוסתרת: מדיניות התוכנית, התחייבויות, קבלות ההוצאה, ומצב אימות הקבלה. |
| `BFV` | סכמת ההצפנה הומורבית של Brakerski/Fan-Vercauteren המשמשת על ידי הכניסה מוצפן RAM-LFE עניות אחורה. |
| `ram_fhe_profile` | BFV-מתנתונים ספציפיים למכונת ביצוע מוצפן מתוכנת. RAM-LFE. |

במודל הנתונים `RamLfeProgramPolicy` ו `RamLfeExecutionReceipt` הם
RAM-LFE סוגים. BFV פרמטרים, חותמות טקסט סיפר, ואת החבויים
RAM-FHE פרופיל התוכנית שייך ל- backend של ההפעלה המוצפן המשמש על ידי
מדיניות.

## מה זה רשום {#what-it-records}

א RAM-LFE מדיניות התוכנית נרשמת ברחבי העולם על ידי `program_id`. המדיניות
מכיל:

- החשבון של הבעלים שיכול להפעיל, לנטרל או לשנות באופן אחר
  מדיניות
- הסוף האחורי המפרסם ללקוחות
- מצב אימת הקבלה, או `signed` או `proof`
- מחויבות לתנתונים המטה-פרוגרמיים החבויים וסוד המערכת
- המפתח הציבורי של הסגור עבור קבלות חתומות
- נתונים מטא-ביצועים ציבוריים מוצפנים בחופשי, כגון: BFV פרמטרים ו
  `ram_fhe_profile`
- דה `active` דגל שולט אם המדיניות יכולה להוציא קבלות חדשות

הסוד המסתתר, ערך מזהה טקסט קל, וגוף התוכנה המסתתר הם
הלקוחות צריכים לטפל בהתחייבויות, בהשיס לא ברורים,
קבלת ה- hash, טקסטים סיפרטיים ועיצוב תוכניות כערכים פרוטוקולים לא ברורים.

## מאחורות {#backends}

זרם RAM-LFE התמיכה מתמקדת בשלושה מזהים של הסוף האחורי:

| קצה אחורה | שימוש |
| --- | --- |
| `hkdf-sha3-512-prf-v1` | מחויבות PRF הערכה. |
| `bfv-affine-sha3-256-v1` | BFV-מבוסס על הערכה סודית של אפינה על חלקי מזהה מוצפן. |
| `bfv-programmed-sha3-256-v1` | BFV-הפעול מתוכנן על ידי רישורים מוצפנים ודרכי זיכרון. |

עבור מדיניות מזהה, התוכנת BFV הפסגה היא החשובת מודרנית
דרך. זה מאפשר הארנקים לחפור הכניסה נורמלי מקומית, מאפשר את המפתר
להעריך מבלי לראות מזהה ציבורי בעסקה, ומחזיר
קבלה שמקשרת את האש ההוצא למדיניות התוכנית המפורסמת.

## מתמטיקה {#math}

החלק הזה מתאר את אלגברה ברמת יישום המשמשת על ידי
RAM-LFE זה לא הוכחה אבטחת; זה התסריט הדeterministic
מודל הערכה מוצפן כי פוליסות, קבלות, ולקוחות צריכים
אני מסכים.

### סימנים {#notation}

תן לי:

- \(H(m)\) להיות Iroha `Hash::new(m)`: בלייק 2ב-32 נגמר `m`, עם לפחות
  חלק משמעותי של בייט האחרון נאלץ `1`.
- \(N(x)\) להיות הקנוני Norito קודינג של `x`.
- \(a \parallel b\) ממוצע קישור של חוטים בייט.
- \(\משתנת {le64}
  מספר שלם לא חתום.
- \(s\) להיות הסוד המפתר שנמצא מחוץ למדינת העולם.
- \(P\) להיות פרמטרים של מדיניות ציבורית.
- \(A\) יש לבקש נתונים קשורים.
- \(x\) להיות בייטי הכניסה נורמלי או Norito-צפנה מוצפן-הכניסה
  מעטפה, תלוי בקצה האחורי.

RAM-LFE הפורמולות למטה מכנים את הדומיינים על ידי
מטרה; קווים בייטים הנוכחיים שלהם הם:

| סימן | קשת תחום |
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

### מחויבות פוליטית {#policy-commitment}

מחויבות מדיניות מחייבת את הפרמטרים הציבוריים והסוד המסתור
ראשית, הסוד נעשה בנפרד:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

ואז התסריט המלא של מדיניות הוא מוצפן:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

והשיש המודיעין הוצג הוא:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

המשתנה `PolicyCommitment` הוא:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

הערכה מחושבת מחדש את אותה ערך מהסוד של זמן ההפעלה.
ההשפוך מחדש שונה, הערכה נכשלת עם אי התאמה בהתחייבות.

### HKDF-SHA3-512 קצה אחורה {#hkdf-sha3-512-backend}

עבור `hkdf-sha3-512-prf-v1`, ההוצא הוא הכניסה הנורמליזת עצמה, אבל
ההזהה הבלתי ברורה והכש של הקבלה מחויבים בסוד. PRF תוצאות.

התסריט של הבקשה הוא:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

ה- HKDF המלח והסודורנדום מפתח:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

חומר לא שקוף מתרחב ומתחוש:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

חומר הקבלה מחובר גם את תעודת זהות הבלתי ברורה:

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

הפסק האחורי חוזר:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV פרמייר {#bfv-primer}

BFV הוא תוכנית חישוב הומורפית מבוססת רשת. "הומורפי" פירושה
כי תוכנית יכולה להוסיף ולהרפל ערכים מוצפנתים, ולאחר פירוק ההצפנה,
לקבל את אותה תוצאה כאילו הוא עשה את ההוספים וההפכפויות
על ערכי הטקסט ברורה.

עבור RAM-LFE, BFV משמש כמנגנון הכניסה מוצפן:

1. ארנק משגר ערך פרטי, כגון מספר טלפון או דואר אלקטרוני
   כתובת.
2. הארנק הופך את הבייטים למקומות של מספרים מלאים קטנים.
3. כל חלל הוא מוצפן עם המפתר של BFV מפתח ציבורי.
4. זמן ההפעלה של המפתר מעריך את התוכנית החבויה על פי הטקסטים האותניים האלה.
5. זמן ההפעלה פותר רק את התוצאת התוכנית החבויה והסימנים או מוכיח
   קבלה.

BFV זה ארימטיקה של מספרים מלאים מדויקים, לא ארימטית כזו.
מתאים יותר לבייטים מזהים וחישובים מודולריים קטנים מאשר ל
דמיון של מודל נקודת צנחת. Iroha הוא זמני. BFV השימוש, כל אחד מוצפן
המגרש נושא ערך סקאלארי אחד \(t\), בדרך כלל בייט או בגודל בייט
שדה. הטקסט הסיפר עצמו חי מודולו מספר שלם הרבה יותר גדול \(q\). ה-
הפער בין \(q\) ו \(t\) נותן מקום לפענח את הצליל כי ההצפנה
ופעולות הומורפיות מובילות.

א BFV ל- ciphertext יש שני מרכיבים פולינומיים:

$$
c=(c_0,c_1)
$$

המפתח הסודי הוא פולינום אחר. \(s_k\). פירוק הצפנה משלב את
מרכיבים:

$$
v = c_0 + c_1s_k
$$

אם הטקסט הצפוני נוצר נכון והרעש עדיין קטן מספיק,
\(v\) הוא קרוב לטקסט קלן המוגד. סיבוב מוציא את הטקסט קל
קואפיצנט מודולו \(t\). המאפיין שימושי הוא שמפעילות קוד טקסט
לשמור על המבנה הזה:

| פעילות פשוטה | מבצע טקסט סיפר |
| --- | --- |
| \(m+n\) | הוסף רכיבים של טקסט סיפר. |
| \(m+\alpha\) | הוסף קבוע של טקסט פשוט בקול \(c_0\). |
| \(\alpha m\) | קישור שני מרכיבים של טקסט סיפר על ידי \(\alpha\). |
| \(mn\) | תכפילת פולינומלים של טקסט סיפר, שיעור מחדש, ולאחר מכן קו מחדש. |

הרבייה היא המבצע היקר.
סיפרטקסס באופן טבעי יוצר טקסט סיפרטסק של שלושה מרכיבים
\(1\), \(s_k\), ו \(s_k^2\). ריליינריזציה משתמשת במפתח הערכה פורסם
כדי לעקוב את \(s_k^2\) המונח חוזר לטקסט סיפר רגיל עם שני מרכיבים.
שמירה על תוספות ומרפלות מאוחר יותר באמצעות אותו צורה של טקסט סיפר.

BFV הוא גם "מדרגה": כל פעילות מוצפנת צורכת תקציב רעש.
יישום זה לא מפעיל את הטקסטים הצפוניים כדי לעדכן את התקציב.
במקום זאת, RAM-LFE מפרסם קטנטן `ram_fhe_profile` והוא מקבל רק גבול מוגבל
צורה של התוכנית מוסתרת. זה שומר על הערכה בתוך קבוצת הפרמטרים
עומק תומך. הפרופיל המתוכנן הנוכחי מאפשר רישום קבוע
ספירה, ספירה קבועה של זכרון-סלול, ומרבית טקסט סיפר אחד
כפול על כל צעד מתוכנן.

בעניין הזה. RAM-LFE עיצוב, BFV מסתיר את הכנסת הלקוח מהנתונים של ספריה ציבורית ו
מאובטחים שרואים רק את העסקה או המטען הפועל של הנתיב.
שרשרת מבצעת תוכניות מוצפן שרירותיות בעצמה. Torii פיתור
runtime עדיין מחזיק את BFV חומר סודי, מעריך את ההסדרות החבויות
תכנית, פוצרת את התוצאת המותרת, ומעידה על התוצאה.
לאחר מכן בודק את האישור על מחויבות המדיניות ברשת,
לפתור מפתח ציבורי או מתא נתונים ראיות.

במקרה השימוש במזהה בוחר מייצג פשוט בכוונה.
שרשרת נורמלית מוצרת כ:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

כל אלמנט מוצפן כשל עצמו BFV טקסט סיפרה סקאלארית.
נורמליזציה ובלוח אישור מפורש, מאפשרת הארנקים לבנות מוצפן
בקשות מפרמטרים ציבוריים, ומאפשר למפתר לקנוניקליזציה שווה ערך
הכניסה מוצפנת לסתימת קבלה יציבה.

### BFV מודל טבעת {#bfv-ring-model}

ה- BFV הפניות האחוריות משתמשות בטבעת פולינומיה נעגציקלית:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

וטבעת טקסט פשוט:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

היכן:

- \(n\) הוא `polynomial_degree`, כוח של שניים
- \(q\) הוא `ciphertext_modulus`
- \(t\) הוא `plaintext_modulus`
- \(q > t\) ו \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

וקטורים של משווקי טקסט ברורה מוצפן על ידי מידת כל משווק:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

פתיחת קוד מרכז-מעלה כל קואפייצנט של:

$$
v = c_0 + c_1 s_k \in R_q
$$

ואז מסובב אותו בחזרה לתוך \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

הנה. \(s_k\) האם זה BFV פולינומיאל מפתח סודי, לא החיצוני RAM-LFE פיתור
סוד \(s\).

### BFV דור המפתח {#bfv-key-generation}

עבור הכניסה של מזהה מוצפן, BFV החומר המרכזי הוא דטרמיניסטי על
נתונים סודיים של resolver ונתונים קשורים:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

ה- BFV RNG זרע כ:

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

ללינעריזציה מחדש, תן \(s_k^2\) להיות מוצר הטבעת \(R_q\). עבור כל אחד
בסיס...\(B\) מספר \(j\), דגימה \(a_j\) באופן אחיד ו \(e_j\) מהקטנים
הפצה, ואז פרסום:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

הציבור BFV נתונים מטאטא של מדיניות מכילים \((n,q,t,B)\), המפתח הציבורי,
`max_input_bytes`. ה- BFV מפתח סודי ומפתח רלינייריזציה להישאר
זמן ההפעלה של הפתרון.

### BFV הצפנה והפעילות {#bfv-encryption-and-operations}

כדי לחשוף פולינום של טקסט פשוט \(m\), הזרעים של היישום
ChaCha20 RNG מ:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

זה דגימות \(u,e_1,e_2 \in \{-1,0,1\}^n\) ומחשבים:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

טקסט הסיפר הוא \(c=(c_0,c_1)\).

הוספת הומורפית היא רכיבית:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

הוספת סקלאר טקסט פשוט \(\alpha\) רק לשינויים לקואפיצ'ון אפס
\(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

כפוף על ידי סקאלאר טקסט פשוט \(\alpha\) סולם שני המרכיבים:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

עבור שני טקסטים סיפריים_0,c_1)\) ו \(d=_0,d_1)\), טקסט סיפר
ההרכבה תחילה מחושבת טקסט סיפר בגודל של שלושה ומסבירה כל אחד
המשקל בחזרה על ידי \(t/q\):

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

כל המוצרים הללו הם מוצרי טבעת נגאציקלית \(R_q\). אז...
\(\tilde c_2\) הוא מתפרק ל...\(B\) פולינוומים:

$$
\tilde c_2 = \sum_j B^j u_j
$$

וניתן לשדר מחדש:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

התוצאה היא שוב מרכיב שניים BFV טקסט סיפר.

### תעודת זהות סיפר טקסט מעטפה {#identifier-ciphertext-envelope}

קוטב בייט הכניסה של מזהה:

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

וכל המקומות הנותרים הם אפס עד `max_input_bytes + 1`. כל סקלר
חלל הוא מוצפן ככיוון אפס פולינומי טקסט קל \([m_i]\).
זרעי ההצפנה של כל סלוט הם:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

המעטפה של מזהה מוצפן היא:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

איפה \(M=\mathrm{max\_input\_bytes}\).

### BFV "הסוג האחורי" {#bfv-affine-backend}

עבור `bfv-affine-sha3-256-v1`, זמן ההפעלה הראשון נגזר BFV חומר מפתח
\(s\) ו \(A\). הפרמטרים הציבוריים המוצאים חייבים להתאמה בדיוק עם הציבור
פרמטרים שנקבעו על שרשרת.

זרעי המעגל האפיני הם:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

מהזרעים האלה הדגימות של זמן ההפעלה, \(t\), מעגל 32 שורות:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

איפה \(m_i\) הם חלקי ההזהה המפורסמים. באופן הומורפי, הוא מחשוב
אותו ערך על טקסטים מקובעים:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

המפתר פותר את כל אחד \(C_j\), דורש את כל הטקסט הפשוט מאחור
קואפיצינטים להיות אפס, משנה את הערכים של הקואפיסינט-אפס לביטים,
טופסים:

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

### BFV תופעה אחורה מתוכנת {#bfv-programmed-backend}

עבור `bfv-programmed-sha3-256-v1`, פרמטרים ציבוריים עוסקים BFV זיהוי
פרמטרים של הצפנה ועוד סימון של תוכנית מוסתרת:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

הזרם RAM-FHE פרופיל הוא:

| שדה | ערך |
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

הכניסה של טקסט פשוט שהוגשה Torii הוא מוצפן לתוך אותו BFV קסדה
הזרע הדeterministic עבור ההצפנה בצד השרת הוא:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

עבור הכניסה מוצפנת המוצגת מבחוץ, הפתרון פותר את ההזהה
כפתור ומחזיר את זה לכפתור דטרמיניסטי הזה לפני ביצוע.
הקנוניקה שומרת על ההשפים של קבלה יציבה לאורך שווה סימנטי
BFV טקסטים מקובעים.

קווי הזיכרון המקודמים המוצאים מ:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

עבור כל אחד מ-32 מסלולים, דגימות זמן הפעלה \(r_j \in [0,t)\) ומחסור a BFV
סיפר טקסט \(r_j\). התוכנה החבויה מפעילה לאחר מכן על מנת לחשוף
רישומים וזיכרון מוצפן:

| הוראות | אלגברה |
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | ר_{\mathrm{dst}} \leftarrow \operatorname{Enc}(א)\) |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\), ואז לשמש מחדש. |
| `SelectEqZero(dst, cond, z, nz)` | פתיחה \(R_{\mathrm{cond}}\); בחר \(R_z\) כאשר זה הוא אפס, אחרת \(R_{nz}\). |
| `Output(src)` | תוספת \(R_{\mathrm{src}}\) לרשימת רישום ההוצאת. |

לאחר שהקלטת ההוראות נגמרה, המפתר פותר את כל יצירה
רשום, משנה את קואפיצ'ן אפס לביט, ומחבר את הבייטים האלה:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

ה-Hashes הגנטיות המוכנת של האקנד הם:

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

הקלטת ההזהה המוכנת לפי דעפונט יש 64 חלקי הכניסה. עבור כל חלקה
\(i\), הוא מטען את חלל הכניסה, מטען קו זיכרון \(i \bmod 32\), מוסיף אותם,
ומוצאים את התוצאה:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### כמות ההוצאות והרשמים {#output-hashes-and-receipts}

הסם הכללי RAM-LFE קבלה ביצוע לא חותמת את התוצאת המקורית. היא חותמת
ה-Hash המוצא

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

עבור Torii RAM-LFE רישומי ביצוע, נתונים קשורים הוא הקנוני
בייטים של מזהה תכנית:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

המטען המשמעותי של הקבלה חתומה הוא:

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

עבור `signed` מצב:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

אימות בודק את החתימה עם `resolver_public_key` והוא דוחה את
קבלה, אלא אם כן כל המשוויות הללו מכילות:

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

עבור `proof` מצב, האישור נושא מעטפה של הוכחה במקום
חתימה. אימות בודק כי ההוכחה backend, מזהה המעגל,
שכימת הסטמה של הכניסה ציבורית, שכיפת הבדיקת המפתח והדוגמאות הציבוריות חשופות
תאימה את הנתונים המטאטאריים של בדיקת ההוכחה ואת האש המוצפן של קבלה-הצורה.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

הדוגמאות הציבוריות הנצפות הן ארבע עמודות של אלמנט אחד. \(j\)
מכיל בייטים \(h_{8j}\ldots h_{8j+7}\) בעקבות זה 24 באייטים אפס:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### מיזוג זהות {#identifier-projection}

החלטת מזהה לא משתמשת ב-backend גנרי `opaque_hash` כמו
זה מציג את RAM-LFE ה-Hash
באמצעות תחומים ספציפיים למזהה:

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

א `IdentifierResolutionReceipt` חותם על מטען בעל רמה גבוהה יותר:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

עבור קבלות מזיהויות חתומות:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` מקבל את הקבלה רק כאשר החתימה או ההוכחה
חוקי, המשתולל RAM-LFE עומס תועלת של ביצוע מתאים לתוכנית המתועדת
מדיניות, `uaid` ו `account_id` האם ההתחייבויות הנדרשות?

## זרימת ההוצאה {#execution-flow}

סם ג'נרלי RAM-LFE ההוצאה להורג עולה בצורה זו:

1. רישומים של ממשל או מפעיל `RamLfeProgramPolicy`.
2. הבעלים מפעיל את המדיניות.
3. הלקוח קורא את הנתונים המפורסמים של מדיניות הציבור Torii.
4. הלקוח שולח בדיוק טופס הכניסה אחד למפתר: טקסט פשוט
   `input_hex` או מוצפן BFV כפתור הכניסות.
5. זמן ההפעלה מעריך את התוכנית החבויה ומחזיר `output_hex`,
   `output_hash`, `opaque_hash`, `receipt_hash`, ו-
   `RamLfeExecutionReceipt`.
6. הלקוח או הסוג האחורי בודקים את הקבלה בהתאם למדיניות המפורסמת,
   בדיקת בחירה כי החזר `output_hex` חשיש לחיסכון
   `output_hash`.
7. הוראה ברמה גבוהה יותר, כגון `ClaimIdentifier`, יכול להכניס את
   קבלה מובטחת במקום להכניס את הכניסה המוטבית.

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

מדיניות זיהוי היא שימוש מוחלט של RAM-LFE. הם מוסיפים עסק
חוק חלל שמות והנורמליזציה מעל מדיניות תכנית גנרית:

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

שכבת ההזהה משתמשת RAM-LFE קבלה לחייב:

- `policy_id`
- מזהה אפק שנוצר על ידי פונקציה מוסתרת
- הדטרמיניזם `receipt_hash`
- החשבון הוא UAID
- הקנוניקה `account_id`
- הסם הכללי RAM-LFE עומס תועלת ביצוע

עבור חיבורים המופנים למשתמשים, שמרו על כינוי החשבון בנפרד מהפרטי
זהות. שם פרופיל הם שמות ציבוריים; מספרים טלפון, כתובות דואר אלקטרוני
הערכים דומים צריכים לזרום דרך מדיניות התזהות וקבלות.

## Torii מסלולים {#torii-routes}

כאשר משפחת המסלול הפונה לאפליקציה מופעלת, Torii חשיפה RAM-LFE ו
עוזרים לזהות:

| מסע | מטרה |
| --- | --- |
| `GET /v1/ram-lfe/program-policies` | רשימה של פעילים ובלתי פעילים RAM-LFE מדיניות התוכנית ונתונים מטאטא ציבוריים לביצוע. |
| `POST /v1/ram-lfe/programs/{program_id}/execute` | להפעיל תוכנית אחת `input_hex` או `encrypted_input` ושוב את ההשפטים של התוצאת ועוד קבלה ללא מדינה. |
| `POST /v1/ram-lfe/receipts/verify` | לאמת א `RamLfeExecutionReceipt` בהשוואה למדיניות המפורסמת והבחינה בחופשית `output_hex` ל `output_hash`. |
| `GET /v1/identifier-policies` | רשימת מדיניות מזהה, דרכי נורמליזציה, מפתחות פיתור ונתונים metadata מוצפן. |
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` | להוציא את הקבלה שאליה משתמש יכול לטבוע `ClaimIdentifier`. |
| `POST /v1/identifiers/resolve` | לפתור הכניסה של מזהה נורמלי לחשבון הקשור כאשר קיים תביעה פעילה. |
| `GET /v1/identifiers/receipts/{receipt_hash}` | חפש טענה של מזהה מתמשכת על ידי חיש שקיבלה עבור כלי בדיקה ותמיכה. |

תמיד בדוק את הערך המטרה `/openapi` או `/openapi.json` מסמך לפני
בנייה נגד המסלולים האלה. זמינות תלויה בניית הערך
פרופיל רשת.

## זמן ההפעלה של הערך {#node-runtime}

Torii הוא בתהליך. RAM-LFE זמן ההפעלה מוגדר תחת:
`torii.ram_lfe.programs[*]`, מפתח: `program_id`. כל תוכנית מותאמת
חייב להתאים את התחייבות המדיניות על שרשרת ועל לספק את זמן ההפעלה
חומר הדרוש להעריכה ולהוכיח כיסויים.
זמן תפעול זהה; הם לא דורשים קונפיגציה נפרדת של מזהה-מתפתור
על פני השטח.

הרישום של מדיניות על שרשרת לא מספיק לבדו.
גם לחשוף את משפחת המסלול ויש לו תואם
תוכניות היא צפויה לבצע.

## רכבות משמרת מבצע {#operational-guardrails}

- רשום את המדיניות לא פעילה, בדוק את הנתונים הציבוריים, ואז תפעיל אותם.
- לשמור סודות מחקרים מוסתרים, סימון מפתחות resolver, BFV סוד
  חומר מתוך מסמכים, רשומות, עסקאות, וקבוצות לקוחות.
- אל תשים מזהים ברורים בשמות פרטיים של חשבונות, נתונים מטאטא של עסקאות,
  אירועים, או שטחים של מדינות העולם.
- בדוק את הקבלות בצד הלקוח לפני שישלחו הוראות ברמה גבוהה יותר
  כאשר SDK חושף מבחן.
- השתמשו בשדות של תקופת הפסקה שבהם קבלות ישנות לא צריכות להישאר בתוקף לנצח.
- לגלוש באמצעות רישום תכנית חדשה או מדיניות מזהה, לקוחות עוברים,
  ומבטל את המדיניות הישנה ברגע שזמינים חדשים זורמים.

## נושאים קשורים {#related-topics}

- [דמי תורם למרחב נתונים פרטי](/he/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii נקודות סוף](/he/reference/torii-endpoints.md#app-and-sora-route-families)
- [עסקאות אנונימיות](/he/blockchain/anonymous-transactions.md)
