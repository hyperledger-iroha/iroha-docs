---
translation_locale: he
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: de608ef52ad3a999c0e253e6683e454f8f66f399a690dce4c2185c79d02334cd
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---
# שליחת עסקאות ואימותן {#submit-and-verify-transactions}

## תוצאה {#outcome}

בצעו בדיקה מקדימה לעסקת Taira, קבלו הצעת מחיר מדויקת לעמלה, חתמו עליה ושלחו אותה, המתינו לסופיות במצב Applied, ואמתו לפי הגיבוב את העסקה שקובעה.

## תנאים מוקדמים {#prerequisites}

- קובץ `taira.client.toml` של חשבון ממומן, `taira-faucet-policy.json` ו־`TAIRA_ACCOUNT_ID` שנוצרו באמצעות [חיבור ל־Taira](./connect-to-taira.md). פעולות כתיבה משתמשות ב־`--fee-payer authority`; ה־CLI מקבל הצעת עמלה מדויקת, בנכס העמלה של Taira, לפני החתימה.
- ה־CLI העדכני של `iroha` ו־`jq`.
- חותם Taira חד־פעמי. אל תשתמשו מחדש במפתח שלו או בפקודות כתיבה אלה ב־Minamoto.

## שלבים {#steps}

### 1. בדקו מראש את נקודת הקצה, חשבון הסמכות ויתרת העמלה {#_1-preflight-the-endpoint-authority-and-fee-balance}

קראו תחילה את תמונת המצב של התור, ולאחר מכן הוכיחו שיתרת העמלה של הסמכות גלויה. קראו את ה־ID של הגדרת הנכס בפורמט Base58 ממדיניות ה־faucet שמתכון החיבור שמר.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet-policy.json)"

iroha --config ./taira.client.toml account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

עצרו אם החשבון או יתרת העמלה חסרים. גם הוראה תקינה אינה יכולה לעבור את בדיקת העמלה כאשר חשבון הסמכות שלה אינו יכול לשלם.

### 2. קבלו הצעת מחיר, חתמו ושלחו פעם אחת {#_2-quote-sign-and-submit-once}

ה־CLI שולח את המטען המדויק שטרם נחתם לקבלת הצעת מחיר לעמלה, קושר לעסקה את כוונת התשלום שהתקבלה, חותם ושולח. מצב JSON מחזיר יחד את גיבוב העסקה, העסקה החתומה והצעת המחיר שהתקבלה.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

אל תשתמשו ב־`--no-wait` במתכון הזה. הפקודה ממתינה לאישור לפני שהיא כותבת קבלה המעידה על הצלחה.

### 3. המתינו למצב סופי בשרשרת העיבוד {#_3-wait-for-terminal-pipeline-state}

השתמשו בפונקציית העזר לסטטוס בעלת הטיפוס במקום להסיק הצלחה מקבלת HTTP או מקבלה לתור. עם `--wait`, ה־CLI בודק שוב ושוב את הסטטוס הגלובלי המדויק ומצליח רק בסופיות `Applied` שנקבעה על פי המצב.

```bash
iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` ו־`Expired` הם כישלונות סופיים, ולא מצבי הצלחה שאפשר לנסות שוב. תעדו את הסיבה להם לפני שינוי העסקה או בנייתה מחדש.

### 4. קראו את העסקה המאוחסנת {#_4-read-the-stored-transaction}

מצב שרשרת העיבוד מציין אם העיבוד הסתיים. שאילתה על העסקה מאמתת שהעסקה שהתקבלה מאוחסנת תחת אותו גיבוב.

```bash
iroha --config ./taira.client.toml \
  --machine \
  tx get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

הסייר הוא ממשק תצפית נוסף לקריאה בלבד. הוא עשוי לפגר לזמן קצר אחרי סופיות שרשרת העיבוד.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

עבור הוראה המשנה מצב, סיימו בשאילתה על העצם שהשתנה. המתכונים [מטא־נתונים](./metadata.md), [נכסים בני־חליפין](./fungible-assets.md) ו־[NFTs](./nfts.md) כוללים קריאות של המצב לאחר הפעולה.

## אימות {#verify}

בדקו שכל שלוש הרשומות מסכימות על אותו גיבוב ושה־explorer מדווח `Committed` ולא `Rejected`:

```bash
jq -e --arg hash "$TAIRA_TX_HASH" \
  '.hash == $hash and .terminal_kind == "Applied"' taira-final-status.json

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '(.hash | ascii_downcase | ltrimstr("hash:") | split("#")[0]) == $hash
      and .status == "Committed"'
```

שמרו את קבלת השליחה ואת המצב הסופי כראיות בדיקה. הם מכילים מידע ציבורי על העסקה, ולא את מפתח החתימה.

## פתרון בעיות {#troubleshooting}

- HTTP `202` או מצב של כניסה לתור מוכיחים רק שהעסקה התקבלה לטיפול. המשיכו לבדוק את המצב באמצעות הממשק בעל הטיפוס המוגדר, עד Applied, Rejected, Expired או פקיעת מגבלת הזמן.
- אם השליחה חורגת ממגבלת הזמן לאחר שהחזירה גיבוב, בצעו שאילתה על אותו גיבוב לפני בניית עסקה אחרת. שליחה חוזרת ללא בדיקה יוצרת מטען חדש עם הצעת מחיר וחתימה חדשות.
- הצעת עמלה עלולה להידחות לפני החתימה. בדקו את `--fee-payer authority`, את יתרת הסמכות, את ה־`chain` וה־`network_id` שהוגדרו, וש־`--metadata` אינו מכיל מפתח עמלה כגון `gas_asset_id`.
- `Rejected` מציין בדרך כלל בעיה באימות הוראות, בהרשאות, בעמלות או במצב מיושן. זו ראיה מקובעת לביצוע שנכשל, ואין לסווג אותה מחדש כניסיון חוזר של שכבת התעבורה.
- תגובת `404` מהסייר מיד לאחר Applied יכולה לנבוע מעיכוב באינדוקס. נסו שוב את הקריאה; אל תשלחו מחדש את העסקה.
- אם הוראה מורשית פועלת ברשת מקומית שנוצרה אך Taira דוחה אותה, השיגו את הרשאת Taira המדויקת או הקצאה של מרחב שמות שנקבעה בממשל. התוצאה המקומית אינה מעניקה סמכות ברשת הציבורית.

## מקור ותיעוד קשור {#source-and-related-docs}

- [מימוש שליחת העסקאות והצעות המחיר לעמלה בקומיט המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [מימוש ובדיקות של אישור עסקאות ב־commit המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/client.rs)
- [עסקאות](/he/blockchain/transactions.md)
- [מדריך CLI](/he/get-started/operate-iroha-via-cli.md)
- [נקודות קצה Torii ](/he/reference/torii-endpoints.md)
