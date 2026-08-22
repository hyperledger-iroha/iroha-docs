---
translation_locale: he
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# עובדים עם Iroha בינאריים {#working-with-iroha-binaries}

ה Iroha 3 זרימת העבודה של המפעיל סובבת סביב שלושה קבצים בינאריים ראשיים:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) על הפעלת דמון עמיתים
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) עֲבוּר CLI ופקודות מפעיל
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) עבור מפתחות, Genesis, רשתות מקומיות ופרופילים

## בנה ממקור {#build-from-source}

משורש סביבת העבודה במעלה הזרם:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

הקבצים הבינאריים לשחרור זמינים לאחר מכן ב `target/release/`.

כדי לבדוק את משטח הפקודה:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## הפעל ישירות מהמאגר {#run-directly-from-the-repository}

אם אינך רוצה להתקין שום דבר ברחבי העולם, השתמש `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker תְמוּנָה {#docker-image}

סביבת העבודה במעלה הזרם משתמשת `kagami localnet` ו `kagami docker` ליצור
Docker Compose קבצים התואמים את הקוד שהוצא.ה `hyperledger/iroha:dev`
ניתן להשתמש בתמונה עם אותם קבצים שנוצרו.

הפעל את CLI במיכל:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

לָרוּץ Kagami במיכל:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

לאתחול עמיתים, צור תחילה קובץ מקומי וכתוב:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## באיזה בינארי עלי להשתמש? {#which-binary-should-i-use}

- לְהִשְׁתַמֵשׁ `irohad` כאשר אתה מתחיל או מפעיל עמיתים.
- לְהִשְׁתַמֵשׁ `iroha` כאשר אתה צריך לשאול את ספר החשבונות, לשלוח עסקאות או לבדוק את נקודות הקצה של המפעיל.
- לְהִשְׁתַמֵשׁ `kagami` כאשר אתה צריך מפתחות, מניפסטים בראשית, חבילות פרופילים או נכסי רשת מקומית.

## פרסום והשקה של קגמושה {#kagemusha-release-publication-and-rollout}

קגמושה V4 פרסום והפעלה חוצים גבולות מוגנים נפרדים:

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` הוא ה
  מוציא לאור של macOS בלבד, שורש בלבד.זה מאמת את המוצמד Kagami בינארי ו
  המועמד המדויק בן שישה עשר קבצים, מפרסם את הנפקד
  `promotion-record-v4.norito` ללא החלפה, ומדווח על הצלחה בלבד
  לאחר שהשחרור המקודם של שבעה עשר קבצים מדויק מאמת.
- `iroha offline kagemusha rollout-v4 create-expectations` מאמת את החתום
  הזמנה, ארבע חותמות הסמכה לתוקף, המדויק
  תיל עסקה שכבר מורשה, והעוגן הסופי המהימן לפני כן
  פרסום ציפיות חתומות ללא החלפה.
- `iroha offline kagemusha rollout-v4 submit` דורש מפורש
  `--write-authorized` הַסכָּמָה.זה מתעד באופן עמיד ומאמת מחדש את המדויק
  ציפיות לפני כתיבה או ניסיון חוזר של רשת.א `Applied` הסטטוס לא
  מספיק: הפקודה גם מאמתת את הבלוק המחויב, יורש הסופיות
  שרשרת, וחוט עסקה נושא הרשאות מלא.
- `iroha offline kagemusha rollout-v4 finalize-receipt` אוסף את אותן ראיות
  המעוגנות בהוכחה רק לאחר שיומן ההגשה המדויק אומת מחדש, חותם עליהן באמצעות
  מנפיק הקבלה העצמאי ומפרסם את הקבלה הקנונית ללא החלפה.

זרימת העבודה המוכנות לייצור של Kagemusha שבוצעה בצ'ק-אין היא לאימות בלבד.
זה לא קורא למוציא לאור המאומת, הסמכת מאמת פרסום
חותם, שלח הפעלה או צור קבלה סופית.זרימת עבודה מוצלחת
לפיכך run אינו מוכיח לא קידום ולא השקה חיה.

הפקודות הללו הן פרימיטיבים מקומיים, לא תחליף לראיות חיות.א
השקת הייצור נשארת חסומה ללא אישור אפליקציה פיזי אמיתי ו
חפצי מועמדים, כל ארבעת חותמות המארח המוגנות, ניהול זמן ריצה ו
חתימה על קלט, הגשת ארבעת אימות חי וראיות סופיות, וה
הקרנת תצורה אפקטיבית קנונית.שמור מפתחות פרטיים,
חומרי אימות ומזהים ספציפיים לקידום מוגנים
משמורת בזמן ריצה;אל תעתיק אותם לתיעוד הנשלט על ידי מקור או
כרטיסי מפעיל.
