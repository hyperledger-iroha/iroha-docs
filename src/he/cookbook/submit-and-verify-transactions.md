---
translation_locale: he
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 01907ea433e711cb0b1aa327d46c44744aad0a7571a65430dddd7a8aed3df373
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# הגשת ומבחינת עסקאות {#submit-and-verify-transactions}

## התוצאה {#outcome}

קבעו מראש עסקאות Taira, קבלו ציטוט דמי מדויק, חתמו ושלחו אותו, חכו לסיום המבוצע, ותבדקו את העסקה המחוייבת באמצעות האש.

## תנאים מוקדמים {#prerequisites}

- מימון `taira.client.toml`, `taira.tx-metadata.json`, ו `TAIRA_ACCOUNT_ID` מיוצר על ידי: [להתחבר Taira](./connect-to-taira.md).
- הזרם `iroha` CLI ו`jq`.
- חותם חד פעמי Taira. אל תחזרו להשתמש במפתח שלו או בכתיבה של פקודות אלה ב- Minamoto.

## צעדים {#steps}

### 1. לקדם את נקודת הסיום, הסמכות והמשקל על עמלות {#_1-preflight-the-endpoint-authority-and-fee-balance}

קראו תחילה את תמונת הצורה, ולאחר מכן הוכיחו שמרבית הוצאות הרשויות נראים. קראו את ההגדרה של נכס Base58 ID מנתונים מטאטא שנוצרו על ידי מרשם החיבור.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

עצור אם חשבון או סכום תשלום הוא חסר. הוראה תקפה לא יכול לעבור הכניסה לתשלום כאשר סמכותו אינה יכולה לשלם.

### 2. ציטוט, לחתום ולהגיש פעם אחת. {#_2-quote-sign-and-submit-once}

ה CLI שולח את המטען הפועל המדויק ללא חתימה עבור ציטוט תשלום, מחבר את כוונת התשלום המקובלת למבצע, חותם ומגיש. מצב JSON חוזר על האש של העסקה, העסקה חתומה וציטוט מקובל ביחד.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

אל תשתמש `--no-wait` במתכון הזה. הפקודה מחכה לאישור לפני שהיא כותבת קבלה מוצלחת.

### 3. לחכות למצב של הצינור הסופי. {#_3-wait-for-terminal-pipeline-state}

השתמשו בעוזר הסטטוס הדפוסים במקום להסיק את ההצלחה על ידי קבלת HTTP או הכניסה בתור. עם `--wait`, תחום הנתיב הבטוח נבחר באופן אוטומטי והמטרה המקובלת היא סיום יישום.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` ו `Expired` הם כישלונות סופיים, לא מצבים של הצלחה שניתן לפתור. רשום את הסיבה שלהם לפני שינויים או בניית העסקות מחדש.

### תקרא את העסקה המאוחדת. {#_4-read-the-stored-transaction}

מצב הצינור עונה אם העיבוד נגמר. שאלת העסקה מאשרת כי העסקה הוסמעת מאוחסן תחת אותו האש .

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

המחקרי הוא שטח תצפית שנייה, רק קריאה. זה יכול לעכב זמן קצר מאחור של סיום הצינור.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

עבור הוראות לשינוי מצב, לסיים עם חיפוש של האובייקט ששתנה. [מטאדאטה](./metadata.md), [נכסים פונגביים](./fungible-assets.md), ו [NFTs](./nfts.md) המתכונים כוללים את הקריאה לאחר המדינה.

## לאמת {#verify}

בדוק אם כל שלושת הרשומות מסכימות על אותו האש ושהחקיר כבר לא מדווח על מצב ממתין:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

שמרו את קבלה ההצעה ואת המצב הסופי כראיות בדיקה. הם מכילים חומר עסקאות ציבורי, לא המפתח לחתימה.

## פתרון בעיות {#troubleshooting}

- HTTP `202` או סטטוס בתור מוכיח רק הכניסה. תמשיכו לבקר את הסטטוס הטייפד עד שהתחיל, נדחה, נגמרה, או התקופה מוגבלת.
- אם הזמן של הגשת לאחר החזרת האש, שאל את האש לפני הקמת עסקאות נוספות. הגשת עיוורת יוצרת עומס nytt ציטוטות וחתום.
- הצעת תשלום ניתן לסרב לפני חתימה. בדקו `--fee-payer authority`, `gas_asset_id`, הירידה של הרשות ואת שרשרת הרשת ID.
- `Rejected` בדרך כלל מצביע על אישור הוראות, רשיונות, דמי או מצב חלש. זה הוא הוכחה מחויבת של ביצוע נכשל ולא צריך להיות מסווג מחדש כניסיון תחבורה מחדש.
- חוקר `404` מיד לאחר Applied יכול להדפיס מאחור. לנסות את הקריאה; לא להגיש מחדש את העסקת.
- אם הוראה בעלת זכויות יוצרות עובדת על רשת מקומית שנוצרה אך Taira דוחה אותה, קבלו את הרשות המדויקת Taira או מיתוי חלל שמות מנוהל. התוצאה המקומית אינה מעניקה סמכות לרשת ציבורית .

## מקור ומסמכים קשורים {#source-and-related-docs}

- [הגשת עסקאות וביצוע ציטוט תשלום בהתחייבויות קבועות ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [בדיקות אישור עסקאות בהתחייבויות מחוברות ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [עסקים](/he/blockchain/transactions.md)
- [מדריך CLI](/he/get-started/operate-iroha-via-cli.md)
- [נקודות קצה Torii ](/he/reference/torii-endpoints.md)
