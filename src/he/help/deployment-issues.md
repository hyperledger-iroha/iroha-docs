---
translation_locale: he
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# פתרון בעיות בהפעלה {#troubleshooting-deployment-issues}

סעיף זה מציע טיפים לחיזוק בעיות לשימוש Iroha 3. אם הבעיה שאתם חווים אינה מתוארת כאן, צור איתנו קשר באמצעות [טלגרם](https://t.me/hyperledgeriroha).

## תתחיל עם חפצים שנוצרו. {#start-with-generated-artifacts}

עבור יישומים מקומיים וניסויים, מעדיפים ארטפקטים שנוצרו על ידי Kagami במקום קבצים משותפים כתובים ידנית:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

תיק המוצר מכיל קונפיגציות עמיתות, חומר גנזה, תסריטים התחלה, ו README לקו הבנייה של Iroha 3 .

## עמיתי לא מתחיל {#peer-does-not-start}

בדוק קודם את הדברים האלה:

- `irohad --config <path>` נקודות בתיק של הדמיון עצמו TOML.
- `public_key` ו `private_key` בקונפיגציה של השותפים שייכים לאותו זוג מפתחות.
- `genesis.public_key` תואם את המפתח המשמש לחתום על העסקה הגנזית.
- זהויות הדוגמאות של מבטיחים משתמשים BLS-מפתחות נורמליות, ו `trusted_peers_pop` מכילה רשומות מוכיחות רכוש עבור המפתח המקומי ודוגמאות הנאמנות.
- נמל Torii ו P2P לא מחויבים כבר על ידי תהליך אחר.
- קובץ החנויות Kura שייך לאותו שרשרת ולא נעתק מפרופיל רשת שונה.

השתמשו במעקב הקונפיגציה כאשר הדיימון קורא יותר מעמד TOML:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker ו- Compose {#docker-and-compose}

יצר תור על פי ההוצאת של הרשת המקומית הנוכחית Kagami כך שתדברי קו הפקודה וקובצי הקונפיגציה יתאימו לקוד הנמלא:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

אם הפעלת Compose מתחילה ולאחר מכן מפסיקה, בדוק את תיעודי הדיימון עבור:

- חוסר התאמה `chain`
- משותף אחד שמשתמש בתהליך גנזה שונה או במניפסט
- כתובות מפורסמות P2P שעובדות רק בתוך רשת המכולות
- שימוש חוזר בקנה מידה מקומי לאחר הגנזציה.

בעת בדיקת גנזה חדשה, הורידו את הקבוצות הישנות Kura לפני שתתחילו מחדש. שמירה על אחסון של בלוקים ישנים עם גנזה החדשה תגרום לכישלון בתשליפות.

## קובורנטיס {#kubernetes}

עבור Kubernetes, התייחסו לכל מתוקן כמו תשתית של מדינה:

- לתת לכל עמידה מפתח זהות יציב ונוסף מתמשך יציב.
- לחשוף כתובות P2P שאחרים יכולים לפתור מבפנים של הקלאסטר
- תקין קונפיגרציה וקובצי גנזיס כקונפיגור בלתי משתנה עבור הפצת
- להפעיל את כל השינויים בגנזה או בטופולוגיה בכוונה, לא כתחדשות אוטומטית של מפת הקונפיגציה

אם קופסא מתחילה מחדש שוב ושוב, השווא את ההסדר המוצג בקופסה עם ה [`peer.template.toml`](/he/reference/peer-config/index.md#template) הנצפה ולבדוק אם הקופסא מחזירה מחדש נתונים ישנים של Kura.

## פרופיל סורה {#sora-profile}

פיתוח Iroha 3 שמשתמשים ב Nexus, SoraFS או זרימות מרובות קווי צריך להפעיל את הדיימון עם פרופיל סורה מופעל:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

השתמשו באותו פרופיל באופן עקבי בין מדווחים ברשת אחת.
