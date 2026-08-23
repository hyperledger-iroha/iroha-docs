---
translation_locale: he
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: a7347a7e8ea055fd5bab9a34b6124ea19ef6f355f9beef9e9488794d9c6e3202
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# חיבור ל- Taira {#connect-to-taira}

## התוצאה {#outcome}

אישר כי Taira ניתן להגיע אליו, קבל את החשבון הקנוני של I105 ID ממצור הלקוח המקומי, תממן את החותם עם testnet XOR, ותגיש עסקאות קנאריות אחת בעלת ציטוט דמי. המתכון הזה אף פעם לא שולח כתבה ל Minamoto.

## תנאים מוקדמים {#prerequisites}

- `curl`, `jq`, Python 3.11 או מאוחר יותר, ובינרי זמני `iroha` ו `kagami`.
- א `taira.client.toml` נוצר עם Taira שרשרת, נקודה סופית, פרופיל חשבון, ומפתח רשת מבחן מיוחד. [ליצור Taira הגדרת הלקוח](/he/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) ושמרו את הקובץ מחוץ לפיקוח המקור.
- המתוכנן לריצה. `taira_faucet_claim.py` מ [קבל Testnet XOR על Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), נשמר ליד הקונפיגציה של הלקוח.

## צעדים {#steps}

### 1. הפרדה בין חיות לעידנות {#_1-separate-liveness-from-readiness}

`/livez` הוא סונדה של תוחלת תהליך בטקסט פשוט. `/status`, `/health`, ו `/readyz` חוזרים JSON. קשר פועל יכול באופן לגיטימי להחזיר `503` מהסונדות ההכנות כאשר תת-מערכת הנדרשת נעולה.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

השתמש `/livez` רק כדי להחליט אם התהליך עונה. השתמש ב- `/readyz` עבור הכניסה לתנועה ולבדוק את פרטי הבלוקר של JSON לפני שאתה מתייחס ל- `503` כפסקת תנועה.

### 2. לנהל את האבחנות הציבורית {#_2-run-the-public-diagnostics}

בדיקת זו היא קריאה בלבד ואינה מטילה את הקונפיגציה של החותם:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

אל תמשיכו לכתוב כאשר הרופא מדווח על כישלון קשה DNS, TLS, שרשרת, או נקודת סוף. שורה ציבורית מלאה היא זמנית; חכו ונסו שוב עם מדיניות מוגבלת.

### 3. להוציא את החשבון Taira ID מבלי לחתום סוד. {#_3-derive-the-taira-account-id-without-printing-a-secret}

קראו רק את המפתח הציבורי מהקונפיג, ולאחר מכן הקודו אותו עם הפרופיל Taira I105. הערך `[account].domain` מספק תיאור ההסלול; הוא אינו חלק מהחשבון ID.

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

תשובה המזרקה היא מקור האמת להגדיר נכס תשלום. שמור את Base58 ID שהחזר במקום להעתיק ID מרשת אחרת או מעבר ישן.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

סקר את המשקל למשך דקה אחת לכל היותר. `202 Accepted` לפני שהעסקת המימון נראית.

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

`gas_asset_id` הוא מטא-מידע של עסקאות. הבחירה המפורשת `--fee-payer authority` קשורה לחתימה, ו CLI מקבלת ציטוט עמלה מדויק לפני שהיא חותמת.

## לאמת {#verify}

להגיש הוראה ללוג, לשמור את קבלה JSON ולחכות לסיום יישום. העברת `--no-wait` גם גורמת להציג הראשוני לחכות לאישור; קריאת הסטטוס המפורשת מוכיחה את המצב הסופי של הצינור.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

הפקודה הסופית מצליחה רק לאחר העסקה מגיעה למצב הטרמינל המקובל `Applied`. שמור את האש בהוכיחות הבדיקה; לעולם אל תחזיקו בו את המפתח הפרטי או את הקונפיגציה של הלקוח.

## פתרון בעיות {#troubleshooting}

- `/livez` חוזר `406` כאשר מבקשת JSON כי נקודת הסיום זו היא `text/plain` לשלוח `Accept: text/plain` כפי שנראה לעיל.
- `/health` או `/readyz` עשויים להחזיר את `503` עם בלוקר קריא מכונה גם כאשר `/livez` ו `/status` עובדים. לתקן או לחכות בלוקר זה; מפתחות חידוש לא ישנה את הכנות של קשרים.
- אספקה `502`, פסק זמן, או מעגל ראיה לעבודה מיושן הוא כישלון שירות ציבורי.
- א I105 שגיאה של קוד מקובל אומר שהמפתח הציבורי היה מוצפן עם הפרופיל הלא נכון. `iroha tools address convert --profile taira`.
- סירוב של ציטוט תשלום בדרך כלל פירושו שהרשות לא הועמדה, נתוני המטא אסיטי התשלום ישתנו, או שלא נבחר משלם תשלום מפורש.
- רישום, מיטינג או ניהול חלל שמות עדיין ניתן לסרב לאחר שהקאנרי הזה מצליח. פעולות אלה דורשות אישורים נפרדים בזמן ההפעלה; להתאמנות בהם ברשת המקומית המובצרת כאשר גישה Taira לא נתנה.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [Taira CLI דיאגנוסטיקה ומקור קנרי בקיום מחויבת](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/taira.rs)
- [בחירת עמלה מפורשת ומקור ההפצה CLI בביצוע המחויבות המוקבעת ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Taira מדריך החשבון והקרס](/he/get-started/sora-nexus-dataspaces.md)
- [קונפיגורת הלקוח](/he/guide/configure/client-configuration.md)
- [עסקים](/he/blockchain/transactions.md)
