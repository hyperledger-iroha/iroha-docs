---
translation_locale: he
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# עסקאות {#transactions}

עסקה היא בקשה חתומה לביצוע עבודה ב-blockchain. המטען המשולב יכול להיות רצף של הוראות [](./instructions.md), קריאת חוזה, IVM קוד בייט, או ביצוע מוכר IVM . ראו [חוות חכמות](./smart-contracts.md) למודל הנוכחי של ביצוע חוזים.

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

זה עדיין רק קריאה. כדי להגיש עסקאות, נדרש מעטפה Norito חתומה, שרשרת נכונה ID, מטא נתונים על דמי העלות וחשבון Taira הממומן על ידי faucet.

לדוגמאות של תשלומים על Taira, להציל את עוזר ה-faucet [קבל Testnet XOR על Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) כמו `taira_faucet_claim.py`, ואז תממן את החותם דרך faucet הציבורית תחילה:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

אם הפאזל של faucet או מסלול התביעה חוזר `502`, חכו ותנסיו שוב לפני שתתקן את העסקה עצמה.

לאחר מכן לצרף את המטא-נתונים של נכס התשלום Taira בעת הגשת העסקת:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## עסקאות לא מקוונות {#offline-transactions}

Iroha יש שתי זלילי עבודה של עסקאות מקוונת:

- **חתימה לא מקוונת** יוצרת עסקה חתומה רגילה בזמן שמכשיר החתימה מנותק. העסקה אינה מעובדת עד שלקוח מקוון שולח את המעטפה החתומה ל-Torii, ולכן היא עדיין זקוקה ל-chain ID הנכון, לסמכות, להרשאות, לעמלות ולמשך חיי העסקה הנכונים.
- **מזומן לא מקוון של Kagemusha** טוען את הארנק בזמן שהוא מקוון, תומך במסירות מארנק לארנק ביוזמת המקבל בזמן ששני הארנקים אינם מקוונים, ופודה את מצב השטר שנוצר כאשר המקבל חוזר למצב מקוון.

Torii חושף את מחזור החיים של Kagemusha כולו תחת `/v1/offline/*`:

|שיטה ונקודת סוף |מטרה.|
| --- | --- |
|`GET /v1/offline/readiness` |להעריך את הכנות של Kagemusha עבור אחד `asset_definition_id` |
|`POST /v1/offline/receiver-lineage` |לפתור שושלת רישום פעילה עם הוכחה עבור בקשה חתומה של מקבל |
|`POST /v1/offline/top-up` |להגיש מבצע תוספת חתום מקוון לא מקוונים |
|`POST /v1/offline/redeem` |להגיש מבצע חידוש מקוונת חתום |
|`GET /v1/offline/operations/{operation_id}` |קרא את הסטטוס הקנוני של תוספת או פידוי |

בדוק את הכנות של הנכס לפני הקמת פעולת מקוונת:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

מצב המוכנות קושר את הארנק ל־ABI 21 הפעיל של הגשר ולקבוצת פריטי V4 המאומתת. בקשות lineage, הוספת היתרה והפדיון משתמשות בארכיוני `application/x-norito` בעלי טיפוס. הוספת יתרה ופדיון מחזירים `202 Accepted` עם כותרת `Location` המצביעה אל משאב הפעולה; ה־operation ID המוטמע שאינו אפס מספק את מפתח האידמפוטנטיות.

זרימת הטיפוסית היא:

1. בצעו שאילתה על מצב המוכנות ועצרו אם `ready` הוא false או אם קיים חוסם כלשהו.
2. השתמשו בארנק Swift או JVM עם טופס כדי לבנות את הארכיון הקנוני, להגיש אותו ולשמור גם את מצב הערת הכניסה וגם את הפעולה ID עד שהפעולה תגיע למצב של שרשרת סופי.
3. לפתור את שושלת הרישום של המקבל כאשר זה נדרש, לבנות ולבדוק כל העברת צמתים מקומית, ולהישאר במצב הודעה מוצפן לפני הכרה בהעברה .
4. כאשר המקבל הוא מקוון, לבנות את הארכיון הגאולה הקנוני, להגיש אותו, וסקר את משאבי הפעלה שלו עד הסוף.

הספר הגדול לא יכול לציין העברת מקוונת סותרת עד מצב הערות חוזר במהלך מחזור החיים באינטרנט. מדיניות הארנק והמפעיל יש לפיכך ליישם גבולות ערך, ירידה, משקיעים מוכרים, אחסון מקומי קבוע, וחלונות פיצוי.

הנה דוגמה של יצירת עסקאות חדשות עם ההוראה `Grant`. בעסקה זו, Mouse מעניק ל-Alice את התפקיד המפורט (`role_id`). בדוק [הדוגמה המלאה ](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
