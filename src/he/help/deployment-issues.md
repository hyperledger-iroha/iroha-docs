---
translation_locale: he
translation_source: /help/deployment-issues.md
translation_source_hash: c220e127bc8081c9b457dfd67101aa44fb80d79c461cc7a7eda99584d74a8f19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# פתרון בעיות בהפעלה {#troubleshooting-deployment-issues}

סעיף זה מציע עצות לפתרון בעיות בפריסות Iroha 3. אם הבעיה שאתם חווים אינה מתוארת כאן, פנו אלינו באמצעות [Telegram](https://t.me/hyperledgeriroha).

## תתחיל עם ארטיפקטים שנוצרו. {#start-with-generated-artifacts}

עבור יישומים מקומיים וניסויים, מעדיפים ארטפקטים שנוצרו על ידי Kagami במקום קובצי צמתים כתובים ידנית:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

תיק המוצר מכיל קונפיגציות הצומת שלות, חומר גנזה, תסריטים התחלה, ו README לקו הבנייה של Iroha 3 .

## צומתי לא מתחיל {#peer-does-not-start}

בדוק קודם את הדברים האלה:

- `iroha3d --config <path>` נקודות בתיק של הדמיון עצמו TOML.
- `public_key` ו `private_key` בקונפיגציה של הצמתים שייכים לאותו זוג מפתחות.
- `genesis.public_key` תואם את המפתח המשמש לחתום על העסקה הגנזית.
- זהויות המאמתים בדוגמה משתמשות במפתחות BLS-Normal, ו־`trusted_peers_pop` מכיל רשומות הוכחת החזקה עבור המפתח המקומי ועבור העמיתים המהימנים שבדוגמה.
- נמל Torii ו P2P לא מחויבים כבר על ידי תהליך אחר.
- קובץ החנויות Kura שייך לאותו שרשרת ולא נעתק מפרופיל רשת שונה.

השתמשו במעקב הקונפיגציה כאשר הדיימון קורא יותר מעמד TOML:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker ו- Compose {#docker-and-compose}

יצר תור על פי ההוצאת של הרשת המקומית הנוכחית Kagami כך שתדברי קו הפקודה וקובצי הקונפיגציה יתאימו לקוד הנמלא:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

אם הפעלת Compose מתחילה ולאחר מכן מפסיקה, בדוק את תיעודי הדיימון עבור:

- חוסר התאמה `chain`
- צומת אחד שמשתמש בתהליך גנזה שונה או במניפסט
- כתובות מפורסמות P2P שעובדות רק בתוך רשת המכולות
- שימוש חוזר בקנה מידה מקומי לאחר הגנזציה.

בעת בדיקת גנזה חדשה, הורידו את הקבוצות הישנות Kura לפני שתתחילו מחדש. שמירה על אחסון של בלוקים ישנים עם גנזה החדשה תגרום לכישלון בתשליפות.

## קובורנטיס {#kubernetes}

עבור Kubernetes, התייחסו לכל validator כתשתית בעלת מצב:

- לתת לכל צומת מפתח זהות יציב ואמצעי אחסון מתמשך יציב.
- לחשוף כתובות P2P שאחרים יכולים לפתור מבפנים של הקלאסטר
- תקין קונפיגרציה וקובצי גנזיס כקונפיגור בלתי משתנה עבור הפצת
- להפעיל את כל השינויים בגנזה או בטופולוגיה בכוונה, לא כתחדשות אוטומטית של מפת הקונפיגציה

אם קופסא מתחילה מחדש שוב ושוב, השווא את ההסדר המוצג בקופסה עם ה [`peer.template.toml`](/he/reference/peer-config/index.md#template) הנצפה ולבדוק אם הקופסא מחזירה מחדש נתונים ישנים של Kura.

## פרופיל סורה {#sora-profile}

פיתוחים פרטיים או מקומיים Iroha 3 שמשתמשים ב Nexus, SoraFS או זרימות מרובות קווי צריכים להפעיל את הדיימון הסטנדרטי עם הפרופיל סורה פעיל:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

השתמשו באותו פרופיל באופן עקבי בין המאמתים ברשת אחת.

המאמתים הציבוריים של Taira משתמשים בפרופיל הייעודי, שמכיל את השרשרת המדויקת של Taira, את רשימת המאמתים, אחסון SoraFS מוטמע מושבת ופרופיל חתימה בזמן ריצה. אמתו את תצורת Taira לפני ההפעלה:

```bash
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

אל תפעילו מאמת ציבורי של Taira באמצעות `iroha3d` כללי; ראו [מדריך ה־CLI של `iroha3d`](/he/reference/iroha3d-cli.md) לפרופיל הנאכף.
