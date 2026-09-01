---
translation_locale: he
translation_source: /help/configuration-issues.md
translation_source_hash: 4b96a4f740203aace2e8c091ed89156146ba117e23eff1d08f3bbb01de92f24a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# פתרון בעיות בהסדרות {#troubleshooting-configuration-issues}

חלק זה מציע עצות פתרון בעיות עבור הגדרת Iroha 3. ודא שאתה [ בדק את המפתחות](./overview.md#check-the-keys) קודם כל, כי זה מקור הבעיה הנפוץ ביותר ב Iroha.

אם הבעיה שאתם חווים אינה מתוארת כאן, התקשרו אלינו באמצעות [טלגרם ](https://t.me/hyperledgeriroha).

## הגנזה העתיקה על מערך Docker Compose {#outdated-genesis-on-a-docker-compose-setup}

כאשר אתה משתמש בגרסה Docker Compose של Iroha, ייתכן שתפגוש את הבעיה של אחד המכולות הצמתים נכשלים עם הטעות `Failed to deserialize raw genesis block`. זה בדרך כלל אומר כי הצמתים, עסקאות הגנזיס חתומות, וההקונפיגורציה שנוצרה נוצרו על ידי תיקונים או פרופילים שונים Iroha.

בדוק את ההכשלת בצעדים הבאים:

1. שימוש `docker ps` כדי לבדוק את המכולות הנוכחי. בהתאם לפרופיל שנוצר, אתה בדרך כלל תראה `hyperledger/iroha:dev` מיכלים. Docker Compose פרופיל מכיל ארבעה כלי צמתים, אם כי `docker-compose.yml` יכול להיות שונה.

2. בדוק את הרישומים ותחפש את שגיאה `Failed to deserialize raw genesis block`. אם התחלת את Iroha שלך במצב דיימון עם `docker compose up -d`, השתמש ב`docker compose logs` הפקודה.

הדרך לפתור בעיה כזו תלויה בשימוש Iroha. אם זהו דמו בסיסי ואינך צריך לשמור נתוני צמתים, לשחזר רשת מקומית מתאימה או חבילה של Docker Compose עם Kagami:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

לאחר מכן להסיר את מצב המכולה הישנה ולהתחיל מחדש מהמסמכים `genesis.signed.nrt`, peer `config.toml`, ו `client.toml` המתחדשים.

אם אתה צריך לשחזר את הנתונים של הדגם Iroha, עשה את הדברים הבאים:

1. לחבר את הצומת השני Iroha אשר יקתיב את הנתונים מהצומת הראשון (לא הצליח).
2. חכו עד שהצומת החדש יחבר את הנתונים עם הצומת הראשון.
3. השאירו את הצומת החדש פעיל.
4. עדכן את הקבצים של הגנזה וההסדרים של הצמתים הראשונים רק כחלק ממגירה מתואמת.

::: info

אין נתיב אוטומטי כללי להחלפת Genesis ברשת חיה. התייחסו לכך כהגירה מתואמת: שמרו את המצב הישן, העלו עמיתים תואמים והעבירו validators לתצורה החדשה רק לאחר שהמפעילים מסכימים על תוכנית ההגירה.

:::

## פורמט המולטי-האש של מפתחות פרטיות וציבוריות {#multihash-format-of-private-and-public-keys}

אם תעיינו ב[תצורת הלקוח](/he/guide/configure/client-configuration.md), תבחינו שהמפתחות מופיעים שם ב[פורמט multihash](https://github.com/multiformats/multihash).

אם לא עבדתם בעבר עם multihash, טבעי להניח שהצד הימני אינו ייצוג הקסדצימלי של בתי המפתח, שני תווים לכל בית, אלא הבתים המקודדים כ־ASCII או UTF-8; בעקבות זאת עלולים לקרוא ל־`from_hex` על ליטרל המחרוזת בעת יצירת `public_key` וגם `private_key`.

טבעי גם להניח שקריאה ל־`PrivateKey::try_from_str` על ליטרל המחרוזת תחזיר רק מפתח תקין, ולכן מספר סיביות שגוי במפתח, לדוגמה 32 בתים במקום 64, יגרום להודעת שגיאה.

**שתי ההנחות שגויות.** למרבה הצער, הודעות השגיאה אינן מסייעות באיתור כשל מסוים זה.

**כיצד לתקן**: השתמשו ב־`hex_literal`. כך גם מחרוזת תווים ארוכה ולא קריאה תהפוך לטבלה קטנה וברורה של מספרים הקסדצימליים.

::: warning

אפילו ההפעלה `try_from_str` לא יכולה לאמת אם שרשרת נתונה היא תקפה `PrivateKey` ולהזהיר אותך אם זה לא כך.

הוא יתפוס כמה טעויות ברורות, למשל אם החוט מכיל סמל לא חוקי. עם זאת, מאחר שאנחנו שואפים לתמוך בקבוצות מפתחות רבות, זה לא יכול לעשות הרבה יותר. הוא לא יכול לדעת אם המפתח הוא גם המפתח הפרטי הנכון עבור החשבון נתון, אלא אם אתה מספק הוראה.

:::

ניתן להימנע מהטעויות עדין מסוג זה, לדוגמה, על ידי דיזריאליזציה ישירה מ-string literals, או על ידי יצירת זוג מפתח חדש במקומות שבהם זה הגיוני.
