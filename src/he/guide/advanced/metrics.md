---
translation_locale: he
translation_source: /guide/advanced/metrics.md
translation_source_hash: fc62efbb6100308bb7a929e18c9c8b6860372abd6d0009616ea63d7c77b6b1eb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# ביצועים ומטריקות {#performance-and-metrics}

ביצועים Iroha תלויים עומס העבודה, טופולוגיית המאשר, תנאי הרשת וההגדרות של הסכמה. לכן מספר TPS בודד הוא שימושי רק כאשר הוא קשור לרוץ מדף בדיקת עם תאורה קבועה.

עבור תכנון קיבולות, לטפל ביצועים כמסגרת הפעלה:

- הרשת מקבלת את שיעור העסקות המבוקש
- מחייב להישאר בשקט בתוך התקציב המטרה.
- שורות עסקאות נשארות מוגבלות.
- הסכמה לא מבוססת על שינויים חוזרים ושוב בתצוגה או על דרכים התאוששות.

השתמש בדף זה כדי להעריך אם הפעלת נמצאת במצב ביצועי גבוה, בינוני או נמוך עבור ספירת קשר נתון, סף איחור הרשת והמטרה TPS.

## מה למדוד {#what-to-measure}

התחל עם תמונת ההצלחה של הערך הציבורי ו-Prometheus scrape, ולאחר מכן השתמש ב CLI למצב הסכמה מאושרת על ידי המפעיל. מפתח המפעיל חייב להיות מורשה על ידי הערך היעד והוא מותקן רק בזמן הפעלה:

```bash
export TORII=http://127.0.0.1:8180
export OPERATOR_KEY_FILE=./secrets/operator.key

curl -s -H 'Accept: application/json' "$TORII/status" | jq .
curl -s "$TORII/metrics" > metrics.prom

iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi status
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi qc
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

פובליק Taira הוא שימושי ללימוד צורת תמונות מצב מיידית של קשרים אנונימיים. אבחון המפעיל שלו אינו זמין בכוונה ללא מפתח המפעיל Taira:

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/now" \
  | jq '{now_ms, offset_ms}'
```

אל תשתמשו בתצפיות מרשת בדיקה ציבורית כנתוני קיבולת ייצור עבור הפריסה שלכם.

נראות הטלמטריה תלויה בפרופיל שהוגדר. `operator` מפעיל תמונות מצב של status ושל diagnostics. ‏`extended` מוסיף `/metrics` ותזמונים יקרים, ואילו `developer` מוסיף תמונות מצב למפתחים, כגון leader, ‏QC, פרמטרים וראיות, בלי להפעיל את `/metrics`. השתמשו ב־`full` כאשר הרצה אחת זקוקה לשתי הקבוצות. `telemetry_profile` הוא מתג הטלמטריה היחיד של הגרסה הראשונה.

```toml
telemetry_profile = "full"
```

## רמות ביצועים {#performance-bands}

השתמשו ברמות אלה עבור הרצה נצפית בקצב היעד `Y` TPS ובתקציב השהיה של `L` מילישניות. הריצו את עומס העבודה מספיק זמן כדי לכלול התחממות, מצב יציב ולפחות תקופה אחת של עומס שיא צפוי.

|רמה|תנאים |משמעות |
| --- | --- | --- |
|גבוהה|קצב העסקאות שהתקבל הוא `Y` ומעלה, השהיית commit ב־p95 נמוכה מ־`0.8 * L`, התורים נשארים מתחת ל־10% מהקיבולת ומוני החלפת התצוגה/השחזור אינם משתנים |לפריסה יש מרווח לעומס העבודה המבוקש |
|בינונית|קצב העסקאות שהתקבל קרוב ל־`Y`, השהיית commit ב־p95 נמוכה מ־`L`, התורים יציבים מתחת ל־50% מהקיבולת והחלפות תצוגה נדירות |הפריסה עובדת, אך סבילותה לעומסים מתפרצים מוגבלת |
|נמוכה|קצב העסקאות שהתקבל נמוך מ־`Y`, השהיית commit ב־p95 גבוהה מ־`L`, התורים גדלים במהלך ההרצה או שמוני החלפת תצוגה/backpressure עולים ברציפות |עומס העבודה המבוקש חורג לפחות מצוואר בקבוק אחד |

הכלל המרכזי הוא כיוון התור. אם קצב ה־TPS שנשלח גבוה מקצב ה־TPS שעבר commit והתור ממשיך לגדול, הפריסה נמצאת בעומס יתר גם אם דגימות קצרות נראות תקינות.

## מספר צמתים וקוורום {#node-count-and-quorum}

מספר גדול יותר של validators משפר את העמידות לתקלות, אך מגדיל את עלויות התיאום, החתימות והפצת הרשת. הפרוטוקול של הגרסה הראשונה של Sumeragi דורש:

- ועדת הצבעה מדויקת `n = 3f + 1`
- `4 <= n <= 31`, כך שגודלים תקפים הם 4, 7, 10, וכן הלאה.
- קוורום commit של `2f + 1`
- עמיתי observer מסתנכרנים עם בלוקים, אך אינם מצביעים, מציעים או אוספים

|מעודדים |תקציב טעויות |הקבע קוורום|הערה על היכולת |
| --- | --- | --- | --- |
| 4 | 1 | 3 |מינימום משותף לטיפול בתאונות אחת |
| 7 | 2 | 5 |עמידות רבה יותר, עם יותר תנועה להצביע והתרחבות |
| 10 | 3 | 7 |עלויות קואורדינציה גבוהים יותר; רשתות וריכוז סימון חשובים יותר |
| 31 | 10 | 21 |הוועדה מקסימלית לשחרור ראשון; שיתוף פעולה של מדד דף ותשלום חתימה בקפידה |

יצירת Genesis ואימות האתחול דוחים גדלים לא תקינים של הוועדה; אל תמדדו ביצועים של טופולוגיה שהגרסה אינה יכולה לקבל.

בעת הערכת "נקודות ה-X", נפרדים מבקרי ההצבעה מהמתבוננים. הוספת מתבוננים בדרך כלל עולה פחות מאשר הוספת בדיקרים, אך המתבוננים עדיין צורכים בדיחות בלוק, סינכרון בלוק, דיסק ורוחב קו הרשת.

## גורמים שמשפיעים על ביצועים {#factors-that-influence-performance}

### צורה של עומס עבודה {#workload-shape}

אותו TPS יכול להיות זול או יקר בהתאם למה שעושה כל עסקאות.

- מספר ההוראות על העסקה
- מספר חתימות ואלגוריתמים לחתום
- גודל העסקה בבתים וגודל מטען הנתונים לאחר ביטול הדחיסה
- יחס קריאה / כתיבה
- גודל המטא-נתונים ופעילות נכסים
- עלות הביצוע של חוזים חכמים, טריגרים ו־IVM
- עומס חיפוש פועל נגד אותם צמתים

עסקאות העברה קטנות אינן מדד מייצג לעומסי עבודה עתירי חוזים או מטא־נתונים.

### קדנס הסכמה {#consensus-cadence}

הצילום המהיר של הפרמטרים הפועלים Sumeragi מכיל את קדנסת הבלוק הבלתי משתנה החותמת ואת קו ההגירה עם שעון:

- `block_cadence_ms`
- `max_clock_drift_ms`

תבדקו אותם עם:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

`block_cadence_ms` מבוצע על ידי גינזיס חתום ומקרר בהתחלה; זה לא כפתור טיון חי. להשוות רשתות עם סימנים שונים גיניסיס הכנסות רק כתצוגות דף נפרדים. ברגע שהשינויים נראים, משיכות של מטען חסרות, או לחץ אחראי מופיעים, קדנציה קצרה בדרך כלל הופכת את העומס יתר למראה יותר במקום להגדיל את ההפעלה התמידית.

### הגבלות על מועמדות וההכנסות {#candidate-and-ingress-bounds}

הגבולות המקומיים של Sumeragi קובעים כמה עבודה מועמדת ושיקום יכול לאחסן מולידיטור:

- `sumeragi.block.max_transactions`
- `sumeragi.block.max_payload_bytes`
- `sumeragi.block.proposal_queue_scan_multiplier`
- `sumeragi.queues.commands`
- `sumeragi.queues.bodies` ו `sumeragi.queues.body_bytes`
- `sumeragi.queues.body_source_bytes`, `sumeragi.queues.chunks`, ו `sumeragi.queues.ready_bodies`

גבולות קטנים מדי יוצרים לחץ קו או חיזוק עומס מועיל; גבולות גדולים יותר מגדילים את הזיכרון המאוחסן וכמות העבודה הזמינה לצמתים התעלולים. השוואה את תמונת האבחנה עם זיכרון תהליך, ניהול הודעות, ומטריקים של גוף חסר לפני שינויים בגבול אחד בכל פעם:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
```

### תנאי הרשת {#network-conditions}

ביצועי ההסכמה רגישים ל:

- RTT בין מוסמכים
- זעם ואובדן חבילות
- רוחב הקו עבור עומסים מועילים של כמות וחלקים חתומים RS16
- קשרים לא סימטריים בין אזורים
- NAT, קיר אש, או התנהגות מרחבת שמאחרת מחזיקת קשר צמתים

כמשפט תכנון, להגדיר את תקציב העתקויות גבוה מספיק כדי לכסות מספר נסיעות הלוך ושוב של מולידיטור ועוד זמן ביצוע ושימוש בדיסק. אם רשת p95 RTT כבר קרובה לעתקיות commit p95 הרצויה, היעד אינו מציאותי.

### שורות ומגבלות הכניסה {#queues-and-admission-limits}

הגדרות הכניסה והצורה מגדירות כמה לחץ פריצה צומת יכול לספוג:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.max_retained_bytes`
- `queue.transaction_time_to_live_ms`
- גבולות העסקה של הגנזה, כגון חתימות מקסימליות, הוראות, בייטים ובייטים מפורצים.
- גבולות קווים p2p ומגבלות כניסה להסכמה

קיבולת שורה גבוהה יכולה להסתיר עומס יתר לזמן מה, אבל זה לא מגדיל את ההפעלה הא קיימא. שורה יציבה היא בריאה; שורה גוברת היא מאחור.

### חומרה ואחסון {#hardware-and-storage}

מדדו כל מאמת, לא רק את המנהיג:

- CPU סיפוק במהלך אישור, ביקורת חתימה וביצוע
- לחץ זיכרון מקיצבים, תמונות מצב ומחסנים לאחזור עומס מועיל.
- דיסק כתיבת איחור עבור אחסון בלוק ופסוטים
- רשת שידור / קבלת סיפוק
- הגדרות אופציונליות להאיץ חומרה כאשר משמשת על ידי עומס העבודה

מבקשי ההצבעה האיטיים ביותר יכולים לקבוע את העומס של הרשת.

## סימנים של פרומתיוס {#prometheus-signals}

שמות מטריקים מגיעים מהקטלוג הטלמטריה הנבדק. זמינות סדרה ועיצוב עדיין תלויים בתכונות הבנייה `telemetry_profile`, אז לבדוק `/metrics` על הערך היעד לפני בניית לוח המעקב.

סימנים נפוצים כוללים:

|סימן |דוגמאות של פרומתיוס |מה לצפות?|
| --- | --- | --- |
|סיבוב מקובל|`sum(rate(txs{type="accepted"}[5m]))` |צריך לעמוד או להתגבר על המטרה TPS במצב יציב |
|דחייה |`sum(rate(txs{type="rejected"}[5m]))` |זה צריך להיות מוסבר על ידי תוכנית הבדיקה |
|מחייב איחור.|`histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |השוואה של p95/p99 עם התקציב לטיחות |
|עומק השורה |`queue_size`, `sumeragi_tx_queue_depth` |צריך להישאר מוגבל במהלך עוצמת עומס.|
|סיפוק שורה |`sumeragi_tx_queue_saturated` |הערכים שאינם אפס קיימים הם המשמעות של עומס יתר |
|צפו בשינויים |`view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` |ערכי העלייה מצביעים על זמנים, טופולוגיה, מטען או בעיות ברשת |
|הודעות שנפלו.|`dropped_messages`, `sumeragi_consensus_message_handling_total` |ירידה בזמן עומס בדרך כלל מסבירה ענקות באיחור.|
|מטען וחיזוק DA | `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total`, `sumeragi_da_gate_satisfied_total` |בקשות מתמשכות, גיל עולה, או שערות חוזרות DA מצביעות על בעיות רכישת גוף או חתיכה |
|הקבע קוורום|`sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |חתימות ספורות צריכות להגיע במהירות לקורום הנדרש |

כאשר מדד קיים רק ב `/v1/sumeragi/status`, לתפוס את תמונת המצב המהירה של JSON באותו זוג ארטיפקטים כמו סחיטה Prometheus.

## זרימת עבודה בהערכה {#estimation-workflow}

1. הגדירו את הסצנה:
   - מספר המבקיחים והמתבוננים
   - מצב הסכמה
   - מטרה TPS
   - תקציבים לטיפול commit p95 ו-p99
   - שילוב העסקאות
   - רשת צפויה RTT, ג'יטר, ורוחב הקו
2. רשום את הקונפיגורציה הפועלת:

   ```bash
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi status \
     > artifacts/sumeragi-status.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi diagnostics \
     > artifacts/sumeragi-diagnostics.json
   ```

3. להפעיל את עומס העבודה על המטרה TPS.
4. לתפוס מצב ומטריקים בתחילת, באמצע וסוף הפסגה.
5. מסווג את הריצה עם שולחן קו הביצועים.
6. אם הקו הוא בינוני או נמוך, לשנות גורם אחד בכל פעם ולחזור על זה.

## תבנית דו"ח דף {#benchmark-report-template}

לפרסם מספרים של ביצועים רק בהקשר מספיק כדי לשחזר אותם:

- Iroha דגלי commit, שחרור ותכונות
- סכום האישור והצופה
- מצב הסכמה, קדנציה בלוק חתומה, וארגון DA
- הוועדה המדויקת `3f + 1`, הקוורום והרשימה של צופים
- `sumeragi.block`, `sumeragi.queues`, `sumeragi.limits`, גבולות הכניסה לרשת והצורה של עסקאות.
- פרופיל טלמטריה
- פרטים על חומרה, אחסון ו OS
- רשת RTT, הנחות של ג'יטר, אובדן ורחב הקו
- מישן העסקאות וגודל המשאבים הפועלים
- הוצעה TPS ותקופה של הריצה
- מקובל/מסרב TPS
- עיתוי קבלן p50/p95/p99
- עומק השורה ומלאה
- תצוגה של שינויים, הודעות נעלמות, קביעות בלוק חסר, ומספרים של שער DA
- CPU, זיכרון, דיסק ושימוש ברשת על מסמך

ללא פרטים אלה, המספר TPS צריך להיות נחשב לאנקדוט.

## דפים קשורים {#related-pages}

- [בדיקות כאוס עם Izanami](./chaos-testing.md)
- [נקודות קצה Torii ](../../reference/torii-endpoints.md)
- [פעל Iroha 3 באמצעות CLI ](../../get-started/operate-iroha-via-cli.md)
- [דוגמה להגדרת צמתים](../../reference/peer-config/params.md)
