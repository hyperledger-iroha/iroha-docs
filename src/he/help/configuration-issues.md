---
translation_locale: he
translation_source: /help/configuration-issues.md
translation_source_hash: b62b106e985933d90dab1258d3b991674dd75d14322f2326148164b0fbee0f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# פתרון בעיות בהקנה {#troubleshooting-configuration-issues}

חלק זה מציע עצות פתרון בעיות Iroha 3 ההסדר. ודא שאתה
[בדקתי את המפתחות.](./overview.md#check-the-keys) קודם כל, כי זה הכי
מקור משותף של בעיות Iroha.

אם הבעיה שאתם חווים אינה מתוארת כאן, התקשרו אלינו באמצעות
[טלגרם](https://t.me/hyperledgeriroha).

## גנזה מעושנת על Docker Compose תצוגה {#outdated-genesis-on-a-docker-compose-setup}

כאשר אתה משתמש Docker Compose גרסה של Iroha, אתה עלול לפגוש
הנושא של אחד המכשירים הדוגמאים שכישלם עם
`Failed to deserialize raw genesis block` טעות. זה בדרך כלל אומר את השותף,
עסקת הגנזה חתומה, וההספקה שנוצרה
שונה Iroha תיקונים או פרופילים.

בדוק את ההפסקה בצעדים הבאים:

1. שימוש `docker ps` כדי לבדוק את המכולות הנוכחי.
   פרופיל שנוצר, אתה בדרך כלל תראה `hyperledger/iroha:dev`
   המכולות. Docker Compose הפרופיל מכיל ארבעה עמינים
   אוכלי, אם כי המוצרים `docker-compose.yml` יכול להיות שונה.

2. בדוק את היומן ותחפש
   `Failed to deserialize raw genesis block` טעות. אם התחלת את
   Iroha במצב דיימון עם `docker compose up -d`, שימוש
   `docker compose logs` פיקוד.

הדרך לפתור בעיות כאלה תלויה בשימוש Iroha. אם זה
דמו בסיסי ואתה לא צריך לשמור נתונים עמיתים, לשחזר התאמה
רשת מקומית או Docker Compose חבילה עם Kagami:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

ואז להסיר את מצב הקונtejnר הישן ולהתחיל מחדש
`genesis.signed.nrt`, עמיתים `config.toml` תיקים, ו `client.toml`.

אם אתה צריך לשחזר את Iroha נתונים דוגמה, לעשות את הדברים הבאים:

1. חיבור השני Iroha עמידה שתקופי את הנתונים
   (נכשל) חבר.
2. חכו עד שהשחקן החדש יחבר את המידע עם השחקן הראשון.
3. השאירו את השותף החדש פעיל.
4. עדכן את הקבצים של הגנזה וההספקה של השותף הראשון רק כחלק
   מהירה מתואמת.

::: info

אין דרך כתיבת מחדש אוטומטית כללית להחליף את הגנז על חי
נתייחס לזה כמגירה מתואמת: לשמור על המדינה הישנה, להביא
עד עמידים מתאימים, ולהעביר רק את המאשרים ל ההסדר החדש לאחר
המפעילים מסכימים על תוכנית ההגירה.

:::

## פורמט המולטי-האש של מפתחות פרטיות וציבוריות {#multihash-format-of-private-and-public-keys}

אם תסתכלו על
[סיבוב הלקוח](/he/guide/configure/client-configuration.md), אתה תעשה זאת.
ציין כי המפתחות שם נתנו
[פורמט רב-הש](https://github.com/multiformats/multihash).

אם מעולם לא עבדת עם "מלטה-האש" בעבר, זה טבעי להניח
הצד הימני אינו ייצוג של שיש עשרה של בייטים מפתח
(שני סמלים באייט), אלא האייטים המוצגים כ ASCII (או UTF-8),
ותתקשר. `from_hex` על הקוטב אותיות בשני `public_key` ו
`private_key` תמונה.

זה גם טבעי להניח כי קריאה `PrivateKey::try_from_str` על
רצועת אותיות יתן רק את המפתח הנכון.
של ביטים במפתח לא נכון, למשל 32 בייטים vs 64, שזה יעלה טעות
הודעה.

**שני ההנחות הללו לא נכונות.** למרבה הצער, הודעות הטעות
לא עוזרים לפתור את סוג זה של כישלון.

**איך לתקן**: שימוש `hex_literal`. זה גם יהפוך שרשרת מכוערת של
דמויות לתוך שולחן קטן נחמד של מספרים כ"כ שש-עשר.

::: warning

אפילו `try_from_str` יישום אינו יכול לאמת אם שרשרת נתונה היא
תקופה תקפה `PrivateKey` ואני אזהיר אותך אם לא.

הוא ימצא כמה טעויות ברורות, למשל אם הקוט מכיל
עם זאת, מאחר שאנחנו שואפים לתמוך בצורות מרכזיות רבות, זה לא יכול לעשות הרבה
זה לא יכול לדעת אם המפתח הוא _נכון_ מפתח פרטי _עבור נתון
חשבון_ או, אלא אם כן תגיש הוראה.

:::

These סוגים של טעויות עדין ניתן להימנע, למשל,
מתאושש ישירות ממספרות קווים, או על ידי יצירת טעם חדש
זוג מפתחות במקומות שבהם זה הגיוני.
