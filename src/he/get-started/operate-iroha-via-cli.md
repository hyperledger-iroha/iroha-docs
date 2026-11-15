---
translation_locale: he
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 40714a6cd124d4b0342b0f6ecf321f286e714c0e236afd6fd7834c0cf0ad1165
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# פעל Iroha 3 דרך CLI {#operate-iroha-3-via-cli}

ה- `iroha` בינארי הוא קלינט קו הפקודה ל- Iroha 3. השתמש בו כדי לבחון את מצב הספר הגדול, להגיש עסקאות ולבדוק נקודות הסיום של המפעיל.

## 1. תנאים מוקדמים {#_1-prerequisites}

מתוך עותק מקומי של Iroha בגרסת המקור המתועדת, צרו והפעילו רשת מקומית בת ארבעה עמיתים:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
./localnet/start.sh
```

הדוגמאות שלהלן משתמשות בתצורת הלקוח שנוצרה עבורה, `./localnet/client.toml`.

## 2. הגדרות בסיסיות CLI {#_2-basic-cli-setup}

הראו את העזרה הגבוהה ביותר:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI מאורגן לקבוצות הפיקוד הבאות:

- `account` לקריאת חשבונות ולשינויים בהם
- `explorer` להזנות הסייר עם מסננים משותפים וחלוקה לדפים
- `tx` למצב עסקאות ולכלי עזר לעסקאות
- `ledger` לקריאה ולכתיבה בספר החשבונות
- `trigger` לקריאה, לכתיבה ולהפעלה של טריגרים
- `ops` לדיאגנסטיקה של המפעיל
- `app` עבור עוזרי האפליקציה API
- `contract` לקריאות לחוזים, לתצוגות ולניפוי שגיאות מקומי; לפריסה השתמשו ב־`kagami contract deploy` או ב־`musubi deploy`
- `tools` עבור שירותי דיאגנוסטיקה ופתוחים
- `dataspace` לתכנון, להחלה ולבדיקה של הגדרת מרחב נתונים
- `taira` לאבחון Taira ולצירוף חשבונות
- `offline` למקודדים, לדוחות ולאבחון במצב לא מקוון
- `soracloud` לכלי עזר של פלטפורמת היישומים Soracloud
- `sccp` לקריאות, להעברות ולהוכחות של SORA Cross-Chain Protocol

כל פקודה שמגישה עסקה מחייבת ציון מפורש של משלם העמלה, למשל `--fee-payer authority`; ה־CLI מציג את העמלה המדויקת לפני החתימה.

השתמש `--output-format text` עבור יצירתו של המפעיל שניתן לקרוא על ידי אדם ו `--machine` עבור מצב אוטומציה קפדן.

## 3. נסה את הרשת המבחנית הציבורית Taira {#_3-try-the-public-taira-testnet}

אתה יכול לנסות בדיקות קריאה בלבד Taira לפני הפעלת צומתי מקומי או יצירת חותם. פקודות אלה משתמשים בדרכים ציבוריות Torii JSON ולא מבזבזים את testnet XOR.

בדוק את מצב Taira:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

הצגת הדומיינים הגלויים לקורא שלא עבר אימות:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

קראו כמה תיארים של נכסים והספק הנוכחי שלהם:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

אם יש לך את ה- `iroha` בינארי הנוכחי, תפעיל את עוזר האבחנה של Taira:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

צרו את `taira.client.toml` רק כשאתם מוכנים לבדוק פקודות חתומות. התצורה, הברז ותהליך בדיקת העשן מתוארים ב־[התחברות למרחבי הנתונים של SORA Nexus](/he/get-started/sora-nexus-dataspaces.md). אל תפעילו פקודות כתיבה מול Taira לפני שהחשבון מומן בנכס העמלות של הברז.

בכל דוגמת CLI של Taira המחייבת תשלום עמלה, מַמנו את החותם באמצעות תהליך הברז המוכן ב־[קבלת XOR לרשת הניסוי ב־Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), ואז בדקו את היתרה:

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

אם מסלול של הברז מחזיר `502`, המתינו ונסו שוב. זוהי בעיית זמינות של רשת הניסוי הציבורית, ולא סיבה ליצור מחדש את מפתחות החשבון.

לאחר שהיתרה מוצגת, הגישו פעולות כתיבה עם `--fee-payer authority`. ה־CLI מציג את העמלה המדויקת, בנכס העמלות של Taira, לפני החתימה:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. פקודות ספר החשבונות הבסיסיות {#_4-basic-ledger-commands}

רשום את כל הדומנים:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

יצירת דומיין רגילה משתמשת בתכנן התכוונית הצהרת; לפקודה `ledger domain` אין פקודה תת `register`. להכין כוונה ללא סוד `AliasSetupPlanRequestV1` עבור `docs.universal` עם שירות SDK או חיבור, ולאחר מכן לתכנן וליישום אותה:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

הכוונה מקבעת את מזהה מרחב הנתונים, את חשבון הבעלים הקנוני, את תקופת החכירה ואת ערכי ההגנה הנוכחיים של הצעת המחיר. המתכנן מאמת את המצב החי ומחזיר את תוכנית `EnsureAlias` האטומית המדויקת להגשה. אל תעתיקו ידנית ערכי הגנה מרשת אחרת.

שלח עסקאות פינג פשוטות:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

קרא בלוק אחרון או לחתום על אירועים בלוק:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. פיקוד המפעיל {#_5-operator-commands}

פקודות מפעיל הקונצנזוס מחייבות מפתח זמן ריצה שברשימת ההרשאה. השאירו אותו מחוץ ל־`client.toml` והעבירו את הקובץ, שהגישה אליו מוגבלת לבעלים, באמצעות הנתיב המוחלט שלו:

```bash
# The generated localnet writes its allow-listed operator key here.
: "${OPERATOR_KEY_FILE:=$PWD/localnet/runtime/operator-signer.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

אבחון לא־סמכותי של התור, שרשרת עיבוד העיבוד, הבחירות וה־lane:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

נתיבי הקונצנזוס המאושרים ומצב המופעים בצומת הזה:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

פרמטרים של הסכמה על שרשרת:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. לאן ללכת אחר כך? {#_6-where-to-go-next}

- [SDK לימודי הדרכה](/he/guide/tutorials/)
- [נקודות קצה Torii ](/he/reference/torii-endpoints.md)
- [עבודה עם Iroha בינרים](/he/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

כדי להדפיס תמונת מצב מלאה של העזרה בפורמט Markdown מתוך עותק המקור המקומי, הריצו:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
