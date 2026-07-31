---
translation_locale: he
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# עסקאות {#transactions}

א **עסקאות** הוא בקשה חתומה לביצוע עבודה על blockchain.
המטען המשולב יכול להיות סדר של
[הוראות](./instructions.md), פגישה חוזית, IVM קוד בייט, או
הוכחה IVM הוצאה להורג. [חוזים חכמים](./smart-contracts.md) עבור הזרם
מודל ביצוע החוזה.

עסקים מבצעים עבודה שינית מצב או ניתן לבצע. ביקורת רק קריאה
משתמש בקשתות חתומות או נקודות קץ קריאה ציבוריות ולא יוצר עסקאות.

עסקאות שנערכו בבלוק מחויבים מאוחסרות עם ביצוען.
תוצאה, כולל סירוב ביצוע.
הכניסה, כגון מעטפה לא חוקית או עסקאות שנסרבו על ידי השורה,
הם לא מאוחסנים בלוק.

עבור תנועת נכסים שמרות על הפרטיות, ראה
[עסקאות אנונימיות](./anonymous-transactions.md). אנונימי
עסקאות משתמשות בנקודות נכסים מוגנות, מחויבויות, ביטוליות,
הוכחות של ידע אפס במקום שינויים בסולן חשבונות ציבוריים.

ראיות של הוכחה על השפעות ביצועים שקופות נבחרות, ראה
[FastPQ](./fastpq.md). FastPQ צורכים עדים להוצאה להורג לאחר הרגיל
ביצוע עסקאות ומבנה סוגי ראיות דטרמיסטיות עבור תומכים
המעברים של המדינה.

## נסה את זה. Taira {#try-it-on-taira}

השתמשו במסלולים של חוקרים כדי לבחון את הציבור האחרון Taira בלוקים ועסקה
סטטוסים ללא חשבון חתימה:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

כדי לעקוב אחר עסקאות שהפליקציה שלך הוציאה קודם לכן, העתק את `hash` מה
רשום ולבדוק את מסלול המחקרי במפרטים:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

זה עדיין רק קריאה. להגיש עסקאות דורש חתימה Norito
מעטפה, שרשרת נכונה ID, נתונים מטאטא של תשלום, ומוסד מברק Taira חשבון.

לדוגמאות של תשלומים על Taira, הציל את עוזר המנקה
[קבל Testnet XOR על Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
כמו `taira_faucet_claim.py`, ואז תממן את החותם דרך המזרקה הציבורית.
ראשית:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

אם הפאזל של המבר או מסלול הבקשה חוזרים `502`, לחכות ולנסות שוב לפני
תיקון התהליך עצמו.

אז תקבל את Taira נתונים מטאטא של נכס תשלום בעת הגשת העסקת:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## עסקאות לא מקוונות {#offline-transactions}

Iroha יש שתי זרימות עבודה של עסקאות מקוונת:

- **חתימה לא מקוונת** יוצר עסקאות חותמות רגילות בזמן החתימה
  המכשיר מתנתק. העסקה אינה מעובדת עד
  הלקוח שולח את המעטפה הנחתומה Torii, אז זה עדיין צריך את
  שרשרת נכונה ID, סמכות, רשיונות, עמלות ותוחלת העסקה.
- **קגמושה מזומנים מקוונים** עולה על הארנק בזמן שהוא מקוון, תומך
  העברת ארנק לארנק בהתחלה של המקבל, בזמן ששני הארנקים
  לא מקוון, ומחזיר את מצב הודעה הנובע מכך כאשר המקבל חוזר
  באינטרנט.

Torii מגלה את מחזור החיים של Kagemusha `/v1/offline/*`:

| שיטה ונקודת הסיום | מטרה |
| --- | --- |
| `GET /v1/offline/readiness` | להעריך את הכנות של קגמושה עבור אחד `asset_definition_id` |
| `POST /v1/offline/receiver-lineage` | לפתור זוג ההרשמה הפעילה עם הוכחה עבור בקשה חתומה של המקבל |
| `POST /v1/offline/top-up` | להגיש מבצע סימון מקוון לא מקוונים |
| `POST /v1/offline/redeem` | להגיש פעילות חיסכון מקוונת חתומה |
| `GET /v1/offline/operations/{operation_id}` | קראו את המצב הקנוני של תוספת או פידוי |

בדוק את הכנות של הנכס לפני בניית פעילות מקוונת:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

מוכנות מחבר את הארנק לגשר הפעיל ABI 21 ומוודאות V4
קבוצת יצירות. השורש, תוספת, וביקשות חידוש להשתמש
`application/x-norito` ארכיונים. תוספת ושוב של פיצוי `202 Accepted`
עם א `Location` כותרת המכוונת למשאב הפעולה; הכותרת המשולבת
פעולת לא אפס ID מספק את מפתח היעדרות.

הזרימה הטיפוסית היא:

1. תשאלו את הכנות ותפסיקו אם `ready` הוא לא נכון או כל חסין מתאים.
2. השתמשו בטייפ Swift או JVM הארנק כדי לבנות את האריכיון הקנוני,
   להגיש אותו, ולשמור את מצב הערת הכניסה ואת הפעילות ID עד
   המבצע מגיע למצב של שרשרת סופית.
3. לפתור את שושלת הרישום של המקבל כאשר זה נדרש, לבנות ו
   לאבד את כל העברת עמיתים מקומית, ולחזק את מצב הערת המוצפנת
   לפני הכרה בהעברה.
4. כאשר המקבל הוא מקוון, לבנות את הארכיון הקנוני של הגאולה,
   להגיש אותו, ולמחקר את משאבי הפעולה שלו עד הסוף.

הספר הגדול לא יכול לציין העברת מקוונת סותרת עד מצב הערה
החזרות במהלך מחזור החיים באינטרנט. מדיניות הארנק והמפעיל צריכים
לפיכך, אימץ גבולות ערך, ירידה תקופה, יוצרים מוכנים, מקומיים קבועים
חלונות אחסון וחיבור.

הנה דוגמה של יצירת עסקאות חדשות עם `Grant`
בהסכם זה, עכברוס מעניק לאליס את ההזדמנות
תפקיד (`role_id`בדקה.
[הדוגמה המלאה](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
