---
translation_locale: he
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# חיבור ל- Taira {#connect-to-taira}

## התוצאה {#outcome}

ודאו שניתן להגיע אל Taira, הפיקו את ID חשבון I105 הקנוני מתצורת לקוח מקומית, מימנו את החותם ב-XOR של testnet והגישו עסקת canary אחת עם הצעת עמלה. המתכון הזה לעולם אינו שולח כתיבה ל-Minamoto.

## תנאים מוקדמים {#prerequisites}

- `curl`, `jq`, Python 3.11 או מאוחר יותר, ובינרי זמני `iroha` ו `kagami`.
- קובץ `taira.client.toml` שנוצר עם השרשרת של Taira, ה־`network_id` המדויק, נקודת הקצה, פרופיל החשבון ומפתח ייעודי לרשת הבדיקה. פעלו לפי [יצירת תצורת לקוח ל־Taira](/he/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) והשאירו את הקובץ מחוץ למערכת בקרת הגרסאות.
- תיקיית עבודה עם הרשאות כתיבה עבור יומן ה־faucet: `iroha taira account faucet prepare` יוצר את `./taira-faucet` עם הרשאות גישה פרטיות ומסרב להחליף תיקייה קיימת.

## צעדים {#steps}

### 1. הפרדה בין חיות לעידנות {#_1-separate-liveness-from-readiness}

`/livez`, `/health` ו־`/readyz` הן בדיקות שמחזירות טקסט פשוט; `/status` מחזיר JSON. צומת פועל יכול להחזיר באופן לגיטימי `503` מ־`/readyz` כאשר מנגנון הקבלה של הקונצנזוס או תת־מערכת נדרשת אחרת אינם זמינים.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

השתמשו ב־`/livez` רק כדי להחליט אם התהליך מגיב. השתמשו ב־`/readyz` לבקרת הקבלה של תעבורה. ה־`503` שלו הוא מעטפת שגיאה מסוג `service_unavailable` ללא פרטים על הגורם החוסם, ולכן הריצו את בדיקות האבחון שלהלן לפני שתתייחסו אליו כהשבתה.

### 2. לנהל את האבחנות הציבורית {#_2-run-the-public-diagnostics}

בדיקה זו מיועדת לקריאה בלבד ואינה טוענת את תצורת החותם:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

אל תמשיכו לכתוב כאשר הרופא מדווח על כישלון קשה DNS, TLS, שרשרת, או נקודת סוף. שורה ציבורית מלאה היא זמנית; חכו ונסו שוב עם מדיניות מוגבלת.

### 3. להוציא את החשבון Taira ID מבלי לחתום סוד. {#_3-derive-the-taira-account-id-without-printing-a-secret}

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

ההוצא הוא כתובת קנוניקה I105 ללא דומיין. שמות כמו `wallet@payments.universal` הם שם כינוי וצריך לפתור אותם לפני שימשו בשדות חשבונות קפדניים.

### 4. תביעה על נכס דמי הוצאות הנוכחית Taira {#_4-claim-the-current-taira-fee-asset}

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

## לאמת {#verify}

שלחו הוראת log, שמרו את קבלת ה־JSON והמתינו לסופיות `Applied`. השמטת `--no-wait` גורמת גם להגשה הראשונית להמתין לאישור; קריאת הסטטוס המפורשת מוכיחה את המצב הסופי של שרשרת עיבוד העיבוד.

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
- א I105 שגיאה של קוד מקובל אומר שהמפתח הציבורי היה מוצפן עם הפרופיל הלא נכון. `iroha tools address convert --profile taira`.
- דחיית הצעת עמלה פירושה בדרך כלל שהסמכות אינה ממומנת או שה־`network_id` שהוגדר אינו של Taira. היעדר `--fee-payer`, או מפתח עמלה כגון `gas_asset_id` ב־`--metadata`, נכשלים באופן מקומי לפני קבלת ההצעה.
- רישום, מיטינג או ניהול חלל שמות עדיין ניתן לסרב לאחר שהקאנרי הזה מצליח. פעולות אלה דורשות אישורים נפרדים בזמן ההפעלה; להתאמנות בהם ברשת המקומית המובצרת כאשר גישה Taira לא נתנה.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [קוד המקור של האבחון ושל עסקת ה־canary ב־CLI של Taira](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) ו־[פקודות ה־faucet](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs) ב־commit המקובע
- [בחירת עמלה מפורשת ומקור ההפצה CLI בביצוע commit המוקבעת ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Taira מדריך החשבון והקרס](/he/get-started/sora-nexus-dataspaces.md)
- [קונפיגורת הלקוח](/he/guide/configure/client-configuration.md)
- [עסקים](/he/blockchain/transactions.md)
