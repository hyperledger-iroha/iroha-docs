---
translation_locale: he
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: de608ef52ad3a999c0e253e6683e454f8f66f399a690dce4c2185c79d02334cd
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# הגשת ומבחינת עסקאות {#submit-and-verify-transactions}

## התוצאה {#outcome}

קבעו מראש עסקאות Taira, קבלו תמחור דמי מדויק, חתמו ושלחו אותו, חכו לסיום המבוצע, ותבדקו את העסקה המחוייבת באמצעות האש.

## תנאים מוקדמים {#prerequisites}

- קובץ `taira.client.toml` של חשבון ממומן, `taira-faucet-policy.json` ו־`TAIRA_ACCOUNT_ID` שנוצרו באמצעות [חיבור ל־Taira](./connect-to-taira.md). פעולות כתיבה משתמשות ב־`--fee-payer authority`; ה־CLI מקבל הצעת עמלה מדויקת, בנכס העמלה של Taira, לפני החתימה.
- הזרם `iroha` CLI ו`jq`.
- חותם Taira חד־פעמי. אל תשתמשו מחדש במפתח שלו או בפקודות כתיבה אלה ב־Minamoto.

## צעדים {#steps}

### 1. לקדם את נקודת הסיום, הסמכות והמשקל על עמלות {#_1-preflight-the-endpoint-authority-and-fee-balance}

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

עצור אם חשבון או סכום תשלום הוא חסר. הוראה תקפה לא יכול לעבור הכניסה לתשלום כאשר סמכותו אינה יכולה לשלם.

### 2. תמחור, לחתום ולהגיש פעם אחת. {#_2-quote-sign-and-submit-once}

ה CLI שולח את מטען הנתונים המדויק ללא חתימה עבור תמחור תשלום, מחבר את כוונת התשלום המקובלת למבצע, חותם ומגיש. מצב JSON חוזר על האש של העסקה, העסקה חתומה ותמחור מקובל ביחד.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

אל תשתמש `--no-wait` במתכון הזה. הפקודה מחכה לאישור לפני שהיא כותבת קבלה מוצלחת.

### 3. המתינו למצב סופי של שרשרת עיבוד העיבוד {#_3-wait-for-terminal-pipeline-state}

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

`Rejected` ו `Expired` הם כישלונות סופיים, לא מצבים של הצלחה שניתן לפתור. רשום את הסיבה שלהם לפני שינויים או בניית העסקות מחדש.

### תקרא את העסקה המאוחדת. {#_4-read-the-stored-transaction}

מצב שרשרת עיבוד העיבוד מציין אם העיבוד הסתיים. שאילתת עסקה מוודאת שהעסקה שהתקבלה נשמרה תחת אותו hash.

```bash
iroha --config ./taira.client.toml \
  --machine \
  tx get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

ה־explorer הוא ממשק תצפית שני לקריאה בלבד. הוא עשוי לפגר לזמן קצר אחרי הסופיות של שרשרת עיבוד העיבוד.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

עבור הוראות שמשנות מצב, סיימו בשאילתה של האובייקט שהשתנה. המתכונים של [Metadata](./metadata.md), [נכסים בני־חליפין](./fungible-assets.md) ו־[NFTs](./nfts.md) כוללים קריאות post-state אלה.

## לאמת {#verify}

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

שמרו את קבלה ההצעה ואת המצב הסופי כראיות בדיקה. הם מכילים חומר עסקאות ציבורי, לא המפתח לחתימה.

## פתרון בעיות {#troubleshooting}

- HTTP `202` או סטטוס בתור מוכיח רק הכניסה. תמשיכו לבקר את הסטטוס הטייפד עד שהתחיל, נדחה, נגמרה, או התקופה מוגבלת.
- אם מועד ההגשה פג לאחר שהוחזר hash, בצעו שאילתה על ה-hash לפני בניית עסקה נוספת. הגשה חוזרת עיוורת יוצרת מטען חדש עם הצעת עמלה וחתימה.
- הצעת עמלה עלולה להידחות לפני החתימה. בדקו את `--fee-payer authority`, את יתרת הסמכות, את ה־`chain` וה־`network_id` שהוגדרו, וש־`--metadata` אינו מכיל מפתח עמלה כגון `gas_asset_id`.
- `Rejected` מציין בדרך כלל אימות הוראות, הרשאות, עמלות או מצב מיושן. זו ראיה שנרשמה בבלוק לביצוע שנכשל, ואין לסווג אותה מחדש כניסיון transport retry.
- חוקר `404` מיד לאחר Applied יכול להדפיס מאחור. לנסות את הקריאה; לא להגיש מחדש את העסקת.
- אם הוראה מורשית פועלת ברשת מקומית שנוצרה אך Taira דוחה אותה, השיגו את הרשאת Taira המדויקת או הקצאה של מרחב שמות שנקבעה בממשל. התוצאה המקומית אינה מעניקה סמכות ברשת הציבורית.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [הגשת עסקאות וביצוע תמחור תשלום commit קבועות ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [מימוש ובדיקות של אישור עסקאות ב־commit המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/client.rs)
- [עסקים](/he/blockchain/transactions.md)
- [מדריך CLI](/he/get-started/operate-iroha-via-cli.md)
- [נקודות קצה Torii ](/he/reference/torii-endpoints.md)
