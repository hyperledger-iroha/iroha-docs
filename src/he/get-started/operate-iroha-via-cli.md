---
translation_locale: he
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
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
- `ledger` עבור ספריה כתיבה וקריאה
- `ops` לדיאגנסטיקה של המפעיל
- `app` עבור עוזרי האפליקציה API
- `contract` עבור הפעלת חוזים והזמנות
- `tools` עבור שירותי דיאגנוסטיקה ופתוחים
- `taira` עבור Taira ו Nexus-תנועות עבודה ממוקדות

קבוצת `ledger` מכילה גם עוזרי עסקאות ספציפיים לתחום, כגון `ledger transaction`.

השתמש `--output-format text` עבור יצירתו של המפעיל שניתן לקרוא על ידי אדם ו `--machine` עבור מצב אוטומציה קפדן.

## 3. נסה את הרשת המבחנית הציבורית Taira {#_3-try-the-public-taira-testnet}

אתה יכול לנסות בדיקות קריאה בלבד Taira לפני הפעלת עמיתי מקומי או יצירת חותם. פקודות אלה משתמשים בדרכים ציבוריות Torii JSON ולא מבזבזים את testnet XOR.

תבדוק את בריאות Taira:

```bash
curl -fsS https://taira.sora.org/status \
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

יציר `taira.client.toml` רק כאשר אתה מוכן לבחון פקודות חתומות. ראה [Connect to SORA Nexus Dataspaces](/he/get-started/sora-nexus-dataspaces.md) עבור הקונפיגציה, הכנור, וזרם קאנארי. אל תפעיל פקודות כתיבה נגד Taira עד שהחשבון יתממן עם נכס דמי הכנור.

עבור כל דוגמא בתשלום Taira CLI, שמור את עוזר המנקה מ- [Get Testnet XOR על Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) כ- `taira_faucet_claim.py`, ולאחר מכן תביאו קודם testnet XOR:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

אם הפאזל של המזרקה או מסלול התביעה חוזר `502`, חכו ותנסו שוב. זו בעיה של זמינות רשתת מבחן ציבורית, ולא אות לשחזור מפתחות החשבון.

לאחר שהמשארית נראית, לצרף את הנתונים המטאטאליים של נכס העלויות לכתוב:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. הפקודות הבסיסיות של Ledger {#_4-basic-ledger-commands}

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

התכוונה מחזיקה את חלל הנתונים ID, חשבון הבעלים הקנוני, תקופת השכרת, ומבטחת הציטוט הנוכחית. מתכנן בודק מצב חי ומחזיר את התוכנית האטומית המדויקת `EnsureAlias` להגיש. אל תדפיס באופן ידני הערכים של שמירת רשת אחרת.

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

מצב ההסכמה:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

תמונה של איחור פר-שלב:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

זמינות, קולקטור, מאחרון של RBC ותצלום של VRF:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

פרמטרים של הסכמה על שרשרת:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. לאן ללכת אחר כך? {#_6-where-to-go-next}

- [SDK לימודי הדרכה](/he/guide/tutorials/)
- [נקודות קצה Torii ](/he/reference/torii-endpoints.md)
- [עבודה עם Iroha בינרים](/he/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

כדי לשחזר תמונה מלאה של סיוע מרקדון מהמחאה המקורית, תפעול:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
