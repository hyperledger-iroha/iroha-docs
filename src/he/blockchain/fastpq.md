---
translation_locale: he
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ הוא Iroha זה... STARK נתיב הוכחה עבור השפעות ביצועים שנבחרו. זה לא מחליף ביצוע עסקאות רגיל או הסכמה. עסקאות עדיין מתמשכות. ISI, IVM, ו Sumeragi כרגיל; FastPQ הוא צורב את העד של ההפעלה הדטרמיסטית ומופנה את האפקטים הנמכרים לחלקים של ראיות.

לאינטגרציה הנוכחית של המארח יש שתי דרכים עיקריות:

- העברת נכסים ספרותית שקופה שנעצמה במהלך ביצוע הקלפים
- מעטפות הוכחת AXT של SORA Nexus, שה־`fastpq_binding` שלהן נושא קישור FastPQ

## להעביר את דרכי העדים {#transfer-witness-path}

העברות ספרותיות ברורות יוצרות כתיבה של העברה מבוססת כאשר ההוראה משתנה משקולות.

- חשבון המקור, חשבון היעד, הגדרה של נכס וסכום
- משקל המשלח והמתקבל לפני ואחרי העברה.
- ההש נקודת כניסה של העסקה המשמשת כמקצת השה
- רישום הרשויות המוצא מן החשבון המגיש
- מאכלת פוסיידון לתסריטים של דלתה אחת.

העברת הסבבים משתמשת בתסריט אחד עם דלתות מרובות. במקרה זה, התזונה של פוסידון חד-דלקת חסרת.

בעת קביעת סופיות הבלוק, Iroha מקבצת את תמלילי הביצוע האלה לפי גיבוב נקודת הכניסה. עדות הביצוע כוללת אז הן את חבילות תמלילי הביצוע המקוריות והן את אצוות מעברי FastPQ שהוכנו עבור המוכיח.

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
| `dsid` | מזהה מרחב נתונים המקודד כבתים בסדר little-endian |
|`slot` |זמן יצירת בלוק הופך לננו שניות |
|`old_root` |שורש מצב האב הנגזר מעד הביצוע |
|`new_root` |שורש post-state הנגזר מעד הביצוע.|
|`perm_root` |מחויבות של פוסיידון לגבי רשיונות תפקיד פעיל |
| `tx_set_hash` | גיבוב של גיבובי עסקאות ונקודות כניסה של טריגרים מבוססי זמן, לאחר מיונם |

המארח משתמש בקבוצת הפרמטרים היחידה של המהדורה הראשונה, `fastpq-state-transition-stark-v1`, עבור אצוות אלה.

## פרוטוקול ההוכחה {#proof-protocol}

תוצרי העברה קנוניים הם הוכחות DEEP ממוסכות מעל שדה Goldilocks עם הרחבה ממעלה 4. היחס המדויק, התמליל וגאומטריית השאילתות שלהם מוגדרים ב־[חוזה הפרוטוקול FastPQ DEEP](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md) בגרסה המוצמדת.

## מה Proverb בודק {#what-the-prover-checks}

לפני בניית עקבות, המבטא FastPQ קאנוניקליז את סדר הקבוצה על ידי מפתח מעבר, רשימת הפעולה, וסדר הכנסת. שורות העברה דורשות גם מטדאטה של כתיבה. קבוצה עם שורות העברת אבל אין כתיבות העברה היא לא חוקית .

עבור מסמכי העברה, בדיקות בצד הסבר כוללות:

- אסור שיתרת השולח תחרוג כלפי מטה (underflow).
- `sender_after` חייב להיות שווה ל- `sender_before - amount`
- `receiver_after` חייב להיות שווה ל- `receiver_before + amount`
- התסריט חייב לכסות את כל שורה של העברה בלהט
- צירוף Poseidon של דלטה אחת, כאשר הוא קיים, חייב להתאים לתמונה הקודמת של התסריט
- אם הוכחות מרקל נדירות יש לפתור את הגרסה 1; הנתיבים החסרים מלאים באוכחות סינתטיות דטרמיסטיות.

מעקב מכיל עמודי סלקטור עבור העברה, הנפקה, שריפה, מתן תפקיד, ביטול תפקיד, קבוצת מטא נתונים ושורות חיפוש רשות. שורות ניתוח מספרים גם נושאים דלטה חתומות, פועלות לדלטה לכל נכס ומספרים אספקה.

## פרובור ליין {#prover-lane}

`iroha3d` מתחיל את FastPQ מסלול הסבר בהתחלה אם ניתן להפעיל את האחורי של הסבר. המסלול הוא משימת רקע עם שורה מוגבלת. לאחר שחגור מייצר עדות ביצוע, מסלול ההפעלה שולח עבודה סבר המכילה את ה-block hash, גובה, תצוגה ועידה.

אם המסלול לא פועל או שהצורה מלאה, התפקיד הופספס והמעבודת הבלוק הרגילה ממשיכה. זה אומר כי המסלול של ה-background prover אינו שער הכניסה למבצעים או שער הסכמה. הוא מסלול ההפקה על מצב שכבר נעשה.

המסלול בונה סבר עם:

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

שתי ההגדרות משתמשות כברירת מחדל ב-`cpu`. בחירה ב-`gpu` היא בקשת fail-closed מפורשת: אם תמיכת GPU לא קומפלה, או שה-backend המבוקש של GPU נכשל בבדיקת הקדם, מסלול ה-prover נשאר מושבת. בגרסה הראשונה אין ערך `auto`, והיא אינה חוזרת ממצב GPU מבוקש ל-CPU.

## אימות {#verification}

בדיקת הוכחה FastPQ מבצעת מחדש את ההתחייבות הקנוניקה של הסבב ומחזירה את התסריט הציבורי. הבדיקן בודק את גרסת הפרוטוקול, גרסה המוגדרת פרמטרים, גבולות החזרה, התחייבות למעקב, הכניסות ציבוריות, פתיחות מרקל שנבחרו, פתיחת AIR ושרשרת שאילת FRI.

מגבלות ברירת המחדל להגנה מפני replay כוללות:

|הגבול.|דפוס |
| ------------------ | ------: |
|שורות מעבר |     256 |
|גודל המשאב הפועל של הקבוצה |256 KiB |
|FRI שכבות|      16 |
|פתיחות שאילתות |     128 |

## מעטפות הוכחה AXT של SORA Nexus {#sora-nexus-axt-proof-envelopes}

מעטפות הוכחה של SORA Nexus AXT יכולות לכלול `AxtFastpqBinding`. אימות בלוקים של מעטפות AXT, בדיקות מעטפות AXT של מארח IVM ו־`RegisterVerifiedFeeSponsorVaultAllocation` דורשים את `fastpq_binding` של המעטפה, בודקים אותו מול הטענה הצפויה וקוראים למאמת FastPQ על המעטפה ועל ההוכחה המוטמעת בה. קישור חסר או אימות שנכשל גורמים לדחיית הפעולה.

### AXT מתמטיקה מחייבת {#axt-binding-math}

במעטפות SORA Nexus AXT, הערך `AxtFastpqBinding` מומר לצורה קנונית לפני הרצה חוזרת של ההוכחה. ערכים ריקים של `parameter`, ‏`verifier_id` או `verifier_version` נדחים; מזהה המאמת חייב להיות `fastpq` והגרסה `v1`, ותהליכי AXT המתוחזקים משתמשים ב־`fastpq-state-transition-stark-v1`. רווחים בתחילת סוג הטענה ובסופו מוסרים, והוא מומר לאותיות קטנות.

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

ושורת מטא־נתונים הקושרת את מדיניות ההרשאות. הטענה `compliance` מוסיפה שתי שורות מטא־נתונים: אחת עבור המדיניות ואחת עבור מרחבי הנתונים המיועדים.

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

## מערכות פרמטרים {#parameter-sets}

למהדורה הראשונה יש בדיוק קבוצת פרמטרים קנונית אחת, `fastpq-state-transition-stark-v1`. היא מכוונת לאבטחה של 128 ביט מעל שדה Goldilocks עם הרחבה ממעלה 4 (`X^4 - 7`), ומשתמשת בגודל עקבה `2^16`, בגודל LDE ‏`2^19`, במקדם קיפול FRI של 2, במקדם הרחבה 8, ב־17 צמצומים לכל היותר וב־136 שאילתות.

## הגדרות {#configuration}

הקונפיגרציה של FastPQ נמצאת תחת `zk.fastpq`.

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
```

את אותן תוויות הביצוע והטלמטריה ניתן לשבור מ- `iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
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

## מדדים {#metrics}

כאשר הטלמטריה מופעלת, FastPQ מספקת מדדים לבחירת מנגנון העיבוד ולהתנהגות סביבת הריצה של Metal.

|מטריק |משמעות |
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |מצב ההפעלה הנדרש והפתר על ידי תוויות האחורי והתקן |
|`fastpq_poseidon_pipeline_total` |נתיב שרשרת עיבוד העיבוד של Poseidon שהתבקש ונבחר |
|`fastpq_metal_queue_depth`|הגבלת תור Metal, המספר המרבי של פעולות בו-זמניות, מספר dispatch וחלון הדגימה|
|`fastpq_metal_queue_ratio` |שורה מתכת עמוסה ותחפיפות יחסים |
|`fastpq_zero_fill_duration_ms` |תוחלת מילוי אפס עבור מטאל ריצה |
|`fastpq_zero_fill_bandwidth_gbps` |נרחב קו ה-zero-fill |

לטיפול ביצועים כלליים, השתמשו בהם עם אותות ההסכמה והצורה המפורטים ב- [ביצועים ומטריקות ](/he/guide/advanced/metrics.md).

## תיקון קשור {#related-reference}

- [תוכנית מודל נתונים ](/he/reference/data-model-schema.md) לתצלום של סוג הסמכותי של הערך
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ אופציות](/he/reference/iroha3d-cli.md#fastpq-overrides)
