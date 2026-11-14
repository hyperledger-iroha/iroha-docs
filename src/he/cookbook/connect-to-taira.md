---
translation_locale: he
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# חיבור ל- Taira {#connect-to-taira}

## תוצאה {#outcome}

ודאו שניתן להגיע אל Taira, גזרו את מזהה החשבון הקנוני מסוג I105 מתצורת לקוח מקומית, מַמנו את החותם ב־XOR של רשת הבדיקה ושלחו עסקת בדיקה אחת עם הצעת מחיר לעמלה. מתכון זה לעולם אינו שולח כתיבה ל־Minamoto.

## תנאים מוקדמים {#prerequisites}

- `curl`, `jq`, Python 3.11 או חדש יותר, וקובצי הריצה העדכניים של `iroha` ושל `kagami`.
- קובץ `taira.client.toml` שנוצר עם השרשרת של Taira, ה־`network_id` המדויק, נקודת הקצה, פרופיל החשבון ומפתח ייעודי לרשת הבדיקה. פעלו לפי [יצירת תצורת לקוח ל־Taira](/he/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) והשאירו את הקובץ מחוץ למערכת בקרת הגרסאות.
- תיקיית עבודה עם הרשאות כתיבה עבור יומן ה־faucet: `iroha taira account faucet prepare` יוצר את `./taira-faucet` עם הרשאות גישה פרטיות ומסרב להחליף תיקייה קיימת.

## שלבים {#steps}

### 1. הבדילו בין פעילות התהליך לבין מוכנות לשירות {#_1-separate-liveness-from-readiness}

`/livez`, `/health` ו־`/readyz` הן בדיקות שמחזירות טקסט פשוט; `/status` מחזיר JSON. צומת פועל יכול להחזיר באופן לגיטימי `503` מ־`/readyz` כאשר מנגנון הקבלה של הקונצנזוס או תת־מערכת נדרשת אחרת אינם זמינים.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

השתמשו ב־`/livez` רק כדי להחליט אם התהליך מגיב. השתמשו ב־`/readyz` לבקרת הקבלה של תעבורה. ה־`503` שלו הוא מעטפת שגיאה מסוג `service_unavailable` ללא פרטים על הגורם החוסם, ולכן הריצו את בדיקות האבחון שלהלן לפני שתתייחסו אליו כהשבתה.

### 2. הריצו את כלי האבחון הציבוריים {#_2-run-the-public-diagnostics}

בדיקה זו מיועדת לקריאה בלבד ואינה טוענת את תצורת החותם:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

אל תמשיכו לכתיבה כאשר כלי האבחון מדווח על כשל מוחלט ב־DNS, ב־TLS, בשרשרת או בנקודת הקצה. רוויה בתור הציבורי היא מצב זמני; המתינו ונסו שוב לפי מדיניות מוגבלת.

### 3. גזרו את מזהה החשבון ב־Taira בלי להדפיס סוד {#_3-derive-the-taira-account-id-without-printing-a-secret}

קראו רק את המפתח הציבורי מהקונפיג, ולאחר מכן קודדו אותו עם פרופיל ה־I105 של Taira. מזהה החשבון אינו כולל דומיין; `[account].profile` בוחר רק את קידומת הרשת שלו.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

הפלט הוא כתובת I105 קנונית ללא דומיין. שמות כגון `wallet@payments.universal` הם כינויים, ויש לפתור אותם לפני שימוש בשדות חשבון המחייבים צורה קנונית.

### 4. בקשו את נכס העמלה הנוכחי של Taira {#_4-claim-the-current-taira-fee-asset}

מדיניות ה־faucet מציינת את הגדרת נכס העמלה הנוכחית. שמרו את ה־Base58 ID שלה במקום להעתיק ID מרשת אחרת או מהרצה ישנה. המדיניות היא נתוני גילוי לא חתומים, ולכן אוטומציה צריכה לקבע את המנפיק, את הגדרת הנכס ואת הסכום שהיא מצפה להם, במקום לסמוך על כל תגובה.

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` פותר את הוכחת העבודה ושומר את העסקה החתומה המדויקת; `submit` שולח אותה פעם אחת וחוזר לאחר שהיא הוחלה. אם `submit` מדווח `Pending` או חורג מזמן ההמתנה, הריצו את `taira account faucet resume` עם אותה תצורה ואותו יומן במקום להכין בקשה נוספת. לאחר מכן בדקו את היתרה במשך דקה לכל היותר.

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

השתמשו ב־`--fee-payer authority` בכל פעולת כתיבה ב־Taira. הבחירה קשורה לחתימה, וה־CLI מקבל הצעת עמלה מדויקת, בנכס העמלה של Taira, לפני החתימה.

## אימות {#verify}

שלחו הוראת רישום ביומן, שמרו את קבלת ה־JSON והמתינו לסופיות במצב Applied. השמטת `--no-wait` גורמת גם לשליחה הראשונית להמתין לאישור; קריאת המצב המפורשת מוכיחה את המצב הסופי של שרשרת העיבוד.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

הפקודה האחרונה מצליחה רק לאחר שהסטטוס הגלובלי המדויק מדווח על סופיות `Applied` שנקבעה על פי המצב. שמרו את הגיבוב בראיות הבדיקה; לעולם אל תשמרו איתו את המפתח הפרטי או את תצורת הלקוח המלאה.

## פתרון בעיות {#troubleshooting}

- `/livez`, `/health` ו־`/readyz` מחזירים `406` כאשר מבקשים מהם JSON בלבד, משום שהם עונים ב־`text/plain`. שלחו את כותרות ה־`Accept` שמוצגות לעיל.
- `/readyz` עשוי להחזיר `503` עם מעטפת שגיאה מסוג `service_unavailable` גם כאשר `/livez` ו־`/status` פועלים. המתינו למוכנות או הריצו `iroha taira doctor`; יצירת מפתחות מחדש לא תשנה את מוכנות הצומת.
- שגיאת `502` של ה־faucet או חריגה מזמן ההמתנה במהלך `submit` משאירות את תוצאת הבקשה לא ידועה: הריצו את `taira account faucet resume` עם אותה תצורה ואותו יומן במקום להכין בקשה נוספת. עוגן מיושן של הוכחת העבודה גורם ל־`prepare` להיכשל; הכינו מחדש בתיקיית יומן חדשה.
- שגיאת קידומת I105 פירושה שהמפתח הציבורי קודד בפרופיל שגוי. הריצו שוב `iroha tools address convert --profile taira`.
- דחיית הצעת עמלה פירושה בדרך כלל שהסמכות אינה ממומנת או שה־`network_id` שהוגדר אינו של Taira. היעדר `--fee-payer`, או מפתח עמלה כגון `gas_asset_id` ב־`--metadata`, נכשלים באופן מקומי לפני קבלת ההצעה.
- רישום, הנפקה או ניהול מרחבי שמות עשויים להידחות גם לאחר שעסקת הבדיקה הצליחה. פעולות אלה דורשות הרשאות נפרדות בסביבת הריצה; תרגלו אותן ברשת המקומית שנוצרה כאשר לא ניתנה גישה ב־Taira.

## מקור ותיעוד קשור {#source-and-related-docs}

- [קוד המקור של האבחון ושל עסקת ה־canary ב־CLI של Taira](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) ו־[פקודות ה־faucet](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs) ב־commit המקובע
- [קוד המקור לבחירת עמלה מפורשת ולשליחה ב־CLI בקומיט המקובע](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [מדריך החשבון והברז של Taira](/he/get-started/sora-nexus-dataspaces.md)
- [תצורת הלקוח](/he/guide/configure/client-configuration.md)
- [עסקאות](/he/blockchain/transactions.md)
