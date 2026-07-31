---
translation_locale: he
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# פתרון בעיות בהפעלה {#troubleshooting-deployment-issues}

חלק זה מציע עצות פתרון בעיות Iroha 3 אם הבעיה
מה שאתה חווה לא מתואר כאן,
התקשר אלינו באמצעות [טלגרם](https://t.me/hyperledgeriroha).

## תתחילו עם חפצים שנוצרו {#start-with-generated-artifacts}

עבור השימוש המקומי ובניסיון, מעדיפים חפצים שנוצרו Kagami במקום
של קבצים משותפים כתובים ביד:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

התיקון שנוצר מכיל קונפיג'ים של עמיתים, חומר גנזה, התחלה
סריפטים, README עבור Iroha 3 קו בנייה.

## עמיתים לא מתחילים {#peer-does-not-start}

בדוק קודם את הדברים האלה:

- `irohad --config <path>` נקודות של השותף TOML תיק.
- `public_key` ו `private_key` ב-peer config שייכים לאותו מפתח
  זוג.
- `genesis.public_key` תואמת את המפתח המשמש לחתום על העסקה של הגנז.
- שימוש באותיות שווים של מבקרי אישור BLS-מפתחות רגילות, `trusted_peers_pop`
  מכיל רישומים של הוכחה לבעשות עבור המפתח המקומי ושל עמיתינו הנאמנים.
- סחורים Torii ו P2P הם כבר לא מחוברים על ידי תהליך אחר.
- ה- Kura תיקון החנויות שייך לאותו שרשרת ולא נעתק ממ
  פרופיל רשת שונה.

השתמשו בדיקת הקונפיגציה כאשר הדיימון קורא יותר מאחד TOML שכבה:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker ושלב {#docker-and-compose}

יצר תוספת מהכורה Kagami תוצאת רשת מקומית כך שורת הפקודה
טענות וקבצים קונפיג מתאימים לקוד הנבדק:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

אם הפעלת Compose מתחילה ולאחר מכן מפסיקה, בדוק את רשומות הדיימון עבור:

- חוסר התאמה `chain`
- עמיתי אחד באמצעות עסקאות גנזיה או מונפסטים שונים
- מפרסם P2P כתובות שעובדות רק בתוך רשת המכולות
- שימוש חוזר בקנה מידה מקומי לאחר הגניזציה

כשאתם בודקים גנזה חדשה, תורידו את הישן. Kura כמות לפני התחלה מחדש
שמירה על האחסון של בלוקים ישנים עם גנזה חדשה תגרום לשחזור להיכשל.

## קובורנטיס {#kubernetes}

עבור Kubernetes, התייחסו לכל מתוקן כמו תשתית של מדינה:

- לתת לכל עמיתי מפתח זהות יציב ונוסף מתמשך יציב.
- לחשוף P2P כתובות שאחרים יכולים לפתור מבפנים הקלאסטר
- להציב קונפיג וקבצים גנזס כקונפיג בלתי משתנה עבור הפעלת
- להפעיל את כל השינויים בגנזה או בטופולוגיה בכוונה, לא כ-אוטומטית
  חידוש קבלה

אם קופסה מתחילה מחדש שוב ושוב, השווה את ההסדרת המוצגת בקופסה עם
צפוי [`peer.template.toml`](/he/reference/peer-config/index.md#template) ו
בדוק אם השחקן חוזר על הישן Kura נתונים.

## פרופיל סורה {#sora-profile}

Iroha 3 הפעלות שמשתמשות Nexus, SoraFS, או שתתחילו זרימות מרובות מסלולים
הדיימון עם פרופיל סורה מאפשר:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

השתמשו באותו פרופיל באופן עקבי בין מדווחים באותה רשת.
