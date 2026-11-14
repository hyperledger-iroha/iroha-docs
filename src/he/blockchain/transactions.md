---
translation_locale: he
translation_source: /blockchain/transactions.md
translation_source_hash: 91c06ab61c7f8ec96554bc89b31b2f281bb3a7d7edd484defe61dcde5a3fb710
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# עסקאות {#transactions}

**עסקה** היא בקשה חתומה לביצוע עבודה בשרשרת. תוכן הבקשה יכול להיות רצף מסודר של [הוראות](./instructions.md), קריאה לחוזה, קוד בתים של IVM או ביצוע מוכח של IVM. למודל ההפעלה של חוזים ראו [חוזים חכמים](./smart-contracts.md).

עסקים מבצעים עבודות שינויים במצב או ביצועיות. בדיקת קריאה בלבד משתמשת בשאילתות חתומות או נקודות קצה קריאה ציבוריות ולא יוצרת עסקאות.

עסקאות שנערכו בבלוק commit מאוחסרות עם תוצאה ביצועה, כולל סירוב ביצוע. בקשות שנערכו לפני קבלת הבלוק, כגון מעטפה לא חוקית או עסקאות שנסרבו על ידי השורה, אינן מאוחסות בלוק.

עבור תנועת נכסים שמרות על פרטיות, ראה [עסקים אנונימיים](./anonymous-transactions.md). עסקי אנונימיים משתמשים בנקודות נכסים מחוסרות, התחייבויות, ביטוליות וראיות של ידע אפס במקום שינויים בשווי חשבונות ציבוריים.

עבור ראיות הוכחה על אפקטים יישומים שקופים נבחרים, ראה [FastPQ](./fastpq.md). FastPQ צורך עדים ביצוע לאחר ביצוע עסקאות נורמלי ובונה סוגי ראיות דטרמיסטיות עבור המעברים של מצב תומכים.

## נסה את זה על Taira {#try-it-on-taira}

השתמשו במסלול Explorer כדי לבחון בלוקים ציבוריים Taira ומצבים של עסקאות חדשים ללא חשבון חתימה:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

כדי לעקוב אחר עסקאות שהפליקציה שלך הוציאה קודם לכן, עותק את `hash` מהרשימה ולבדוק את מסלול הפרטים של המחקור:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

זו עדיין פעולת קריאה בלבד. שליחת עסקה דורשת מעטפת Norito חתומה, מזהי שרשרת ורשת נכונים, משלם עמלות מפורש וחשבון Taira שמומן משירות חלוקת כספי הניסוי.

בדוגמאות הכרוכות בעמלה ב־Taira, מַמנו את החותם באמצעות התהליך המוכן שב־[קבלת XOR לניסוי ב־Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), ואז בדקו את יתרת נכס העמלות:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

אם מסלול של שירות חלוקת כספי הניסוי מחזיר `502`, המתינו ונסו שוב לפני שמתחילים לאבחן את העסקה עצמה.

לאחר מכן בחרו את משלם העמלות בעת שליחת העסקה. עם `--fee-payer authority`, החשבון החותם משלם, וה־CLI מציג את העמלה המדויקת בנכס העמלות של Taira לפני החתימה:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "faucet-funded taira transaction"
```

## עסקאות לא מקוונות {#offline-transactions}

Iroha יש שתי זלילי עבודה של עסקאות מקוונת:

- **חתימה לא מקוונת** יוצרת עסקה חתומה רגילה בזמן שמכשיר החתימה מנותק. העסקה אינה מעובדת עד שלקוח מקוון שולח את המעטפה החתומה ל-Torii, ולכן היא עדיין זקוקה ל-chain ID הנכון, לסמכות, להרשאות, לעמלות ולמשך חיי העסקה הנכונים.
- **מזומן לא מקוון של Kagemusha** טוען ערך לארנק רשום הנתמך בחומרה בזמן שהוא מקוון, מאפשר תשלומים בין ארנקים כאשר שניהם לא מקוונים, ופורק את הערך הנותר לחשבון בספר החשבונות כשהארנק חוזר להיות מקוון.

Torii חושף מסלול Kagemusha אחד, `POST /v1/kagemusha/enrollment`. הוא מקבל מסגרות רישום מסוג `application/x-norito` המאומתות באמצעות החשבון, ומחזיר תגובות פרטיות שאסור לשמור במטמון. הצד של ספר החשבונות במחזור החיים משתמש בעסקאות חתומות רגילות הנושאות הוראת `KagemushaWalletLedgerV1`:

| פעולה | מטרה |
| --- | --- |
| `Activate` | הפעלת ארנק רשום; אימות האתחול הנטיבי הוא חובה |
| `IssueLoad` | חיוב המשלם ורישום פעולת Load הבאה של הארנק באופן אטומי |
| `Unload` | תשלום תביעת Unload מלאה לחשבון שאליו היא קשורה, לכל היותר פעם אחת |
| `ClaimFee` | תשלום תביעת עמלה מלאה למוטב הקבוע שלה |
| `Abandon` | ביטול רישום שלא נעשה בו שימוש |

זרימת הטיפוסית היא:

1. רשמו את הארנק באמצעות `/v1/kagemusha/enrollment` עם ארנק בעל ממשק טיפוסים מוגדר ל־Swift או ל־Android, ואז הפעילו אותו.
2. שלחו עסקת `IssueLoad`. הביצוע בודק את המספר הסידורי הצפוי של פעולת Load הבאה ואת מזהה הבקשה שאינו אפס, ולכן ניסיון חוזר מיושן או ששונה נכשל. לאחר אובדן תגובה, קראו את קבלת Load המקורית במקום לחתום על פעולת Load נוספת.
3. החליפו ואמתו תשלומים מקומית בין הארנקים בזמן שהם לא מקוונים, ושמרו את מצב הארנק באופן עמיד לפני אישור כל העברה.
4. כשהארנק חוזר להיות מקוון, שלחו את תביעת Unload שלו והמתינו לסופיות.

הספר הגדול לא יכול לציין העברת מקוונת סותרת עד מצב הערות חוזר במהלך מחזור החיים באינטרנט. מדיניות הארנק והמפעיל יש לפיכך ליישם גבולות ערך, ירידה, משקיעים מוכרים, אחסון מקומי קבוע, וחלונות פיצוי.

הנה דוגמה של יצירת עסקאות חדשות עם ההוראה `Grant`. בעסקה זו, Mouse מעניק ל-Alice את התפקיד המפורט (`role_id`). בדוק [הדוגמה המלאה ](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
