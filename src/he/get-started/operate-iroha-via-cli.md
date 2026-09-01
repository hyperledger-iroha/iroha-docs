---
translation_locale: he
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# פעל Iroha 3 דרך CLI {#operate-iroha-3-via-cli}

ה- `iroha` בינארי הוא קלינט קו הפקודה ל- Iroha 3. השתמש בו כדי לבחון את מצב הספר הגדול, להגיש עסקאות ולבדוק נקודות הסיום של המפעיל.

## 1. תנאים מוקדמים {#_1-prerequisites}

להפעיל רשת מקומית קודם:

- [שיגור Iroha 3](./launch-iroha.md)

הדוגמאות הבאות מניעות את ההסדרים של הלקוח שנוצרו מהרשת המקומית שנוצרה ב [Lunch Iroha 3 ](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. הגדרות בסיסיות CLI {#_2-basic-cli-setup}

הראו את העזרה הגבוהה ביותר:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI מאורגן לקבוצות הפיקוד הבאות:

- `account` עבור קיצוצים ממוקדים על חשבון
- `tx` עבור עוזרים ברמה של עסקאות
- `ledger` לקריאה ולכתיבה בספר החשבונות
- `ops` לדיאגנסטיקה של המפעיל
- `app` עבור עוזרי האפליקציה API
- `contract` עבור הפעלת חוזים והזמנות
- `tools` עבור שירותי דיאגנוסטיקה ופתוחים
- `taira` עבור Taira ו Nexus-תנועות עבודה ממוקדות

קבוצת `ledger` מכילה גם עוזרי עסקאות ספציפיים לתחום, כגון `ledger transaction`.

השתמש `--output-format text` עבור יצירתו של המפעיל שניתן לקרוא על ידי אדם ו `--machine` עבור מצב אוטומציה קפדן.

## 3. נסה את הרשת המבחנית הציבורית Taira {#_3-try-the-public-taira-testnet}

אתה יכול לנסות בדיקות קריאה בלבד Taira לפני הפעלת צומתי מקומי או יצירת חותם. פקודות אלה משתמשים בדרכים ציבוריות Torii JSON ולא מבזבזים את testnet XOR.

בדוק את מצב Taira:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

רשימה של תחומים ציבוריים במרחב נתונים `universal`:

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

צרו את `taira.client.toml` רק כאשר אתם מוכנים לבדוק פקודות חתומות. להגדרות, לשירות המימון ולתהליך הקנרית ראו [התחברות למרחבי הנתונים של SORA Nexus](/he/get-started/sora-nexus-dataspaces.md). אל תריצו פקודות כתיבה מול Taira לפני שהחשבון מומן בנכס העמלה שמספק שירות המימון.

עבור כל דוגמא בתשלום Taira CLI, שמור את עוזר ה-faucet מ- [Get Testnet XOR על Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) כ- `taira_faucet_claim.py`, ולאחר מכן תביאו קודם testnet XOR:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

אם הפאזל של faucet או מסלול התביעה חוזר `502`, חכו ותנסו שוב. זו בעיה של זמינות רשתת מבחן ציבורית, ולא אות לשחזור מפתחות החשבון.

לאחר שהמשארית נראית, לצרף את המטא-נתונים של נכס העלויות לכתוב:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. פקודות ספר החשבונות הבסיסיות {#_4-basic-ledger-commands}

רשום את כל הדומנים:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

יצירת דומיין רגילה משתמשת בתכנן התכוונית הצהרת; לפקודה `ledger domain` אין פקודה תת `register`. להכין כוונה ללא סוד `AliasSetupPlanRequestV1` עבור `docs.universal` עם שירות SDK או חיבור, ולאחר מכן לתכנן וליישום אותה:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

הכוונה מקבעת את ה־dataspace ID, את חשבון הבעלים הקנוני, את תקופת החכירה ואת מנגנון ההגנה העדכני על הצעת המחיר. המתכנן מאמת את המצב החי ומחזיר את תוכנית `EnsureAlias` האטומית המדויקת להגשה. אל תעתיקו ידנית ערכי הגנה מרשת אחרת.

שלח עסקאות פינג פשוטות:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

קרא בלוק אחרון או לחתום על אירועים בלוק:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. פיקוד המפעיל {#_5-operator-commands}

פקודות של מפעיל הסכמה דורשות מפתח זמן עבודה רשמי. שמור אותו מחוץ ל `client.toml` ותעבירו את הקובץ של הבעלים בלבד במפורש:

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

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

תעודות קוורום גבוהים ביותר:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
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
- [קובץ README של ה־CLI](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

כדי לשחזר תמונת מצב מלאה של סיוע מרקדון מהמחאה המקורית, תפעול:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
