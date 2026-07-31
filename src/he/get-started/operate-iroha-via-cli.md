---
translation_locale: he
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# פעל Iroha 3 דרך CLI {#operate-iroha-3-via-cli}

ה- `iroha` בינרי הוא קלינט קו פקודה עבור Iroha 3. השתמשו בו כדי לשאול.
תיאור של ספריה, הגשת עסקאות, ובדוק נקודות הסיום של המפעיל.

## 1. תנאים מוקדמים {#_1-prerequisites}

להפעיל רשת מקומית קודם:

- [שיגור Iroha 3](./launch-iroha.md)

הדוגמאות הבאות מניעות את ההסדרת של הלקוח המוצא מהרשת המקומית
נוצר ב [שיגור Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. בסיסיות CLI הגדרות {#_2-basic-cli-setup}

הראו את העזרה הגבוהה ביותר:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

ה- CLI הוא מאורגן לקבוצות הפיקוד הבאות:

- `account` עבור קיצוצים ממוקדים לחישבון
- `tx` עבור עוזרים ברמה של עסקאות
- `ledger` עבור ספרים על-קריאה וכתוב
- `ops` לדיאגנסטיקה של המפעיל
- `app` עבור אפליקציה API עוזרים
- `contract` עבור הפעלת חוזים וקריאות
- `tools` עבור שירותי דיאגנוסטיקה ופתוחים
- `taira` עבור Taira ו Nexus-פלילים עבודה ממוקדים

ה- `ledger` הקבוצה כוללת גם עוזרים לטיסקה ספציפיים לדומנים כגון:
`ledger transaction`.

שימוש `--output-format text` עבור יצירתו של המפעיל שניתן לקרוא על ידי אדם, `--machine`
עבור מצב אוטומציה קפדני.

## 3. נסה את הציבור Taira רשת מבחן {#_3-try-the-public-taira-testnet}

אתה יכול לנסות רק לקרוא. Taira בדיקות לפני הפעלת עמית מקומי או יצירת
פקודות אלה משמשות ציבורית Torii JSON מסלולים ולא לבלות testnet
XOR.

תבדוק Taira בריאות:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

רשימה של תחומי ציבור ב `universal` מרחב נתונים:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

קראו כמה תיארים של נכסים והספק הנוכחי שלהם:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

אם יש לך זרם `iroha` בינרי, תפעיל את Taira עוזר האבחנה:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

ליצור `taira.client.toml` רק כאשר אתה מוכן לבחון פקודות חתומות.
תראו. [להתחבר SORA Nexus מספרי נתונים](/he/get-started/sora-nexus-dataspaces.md)
עבור הקונפיג, פנקט, וזרם קנרי. אל תצאו לכתוב פקודות נגד
Taira עד שהחשבון מיומן עם נכס דמי המקלוח.

על כל תשלום Taira CLI לדוגמה, להציל את עוזר המזרקה
[קבל Testnet XOR על Taira](/he/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
כמו `taira_faucet_claim.py`, אז תביעה טסטנט XOR ראשית:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

אם הפאזל של המבר או מסלול הבקשה חוזרים `502`, חכה ותנסה שוב.
בעיה של זמינות רשתת מבחן ציבורית, לא אות לשחזור מפתחות החשבון.

לאחר שהמשארית נראית, לצרף את הנתונים המתגוררים של נכסי העלות לכתוב:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. פקודות ספרות בסיסיות {#_4-basic-ledger-commands}

רשום את כל הדומנים:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

יצירת תחום רגיל משתמשת בתכנן התכונות המפורסמות; `ledger
domain` פקודה לא `register` תת-הפקדה, תכין סוד חופשי.
`AliasSetupPlanRequestV1` כוונה `docs.universal` עם SDK או
שירות ההישג, לאחר מכן לתכנן וליישום אותו:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

התכוון מחזיקה את חלל הנתונים ID, חשבון הבעלים הקנוני, תקופת השכרה, ו
המארגן בודק את מצב ההצבעה ומחזיר את המדויק
אטום `EnsureAlias` תכננו להגיש. אל תעתיקו את ערכי הגנה של מישהו אחר
רשת.

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

תמונת איחור פר-שלב:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

זמינות, אספקה, RBC מאחוריות, ו VRF תמונה מיידית:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

פרמטרים של הסכמה על שרשרת:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. לאן ללכת אחר כך? {#_6-where-to-go-next}

- [SDK טיוטוריונים](/he/guide/tutorials/)
- [Torii נקודות סוף](/he/reference/torii-endpoints.md)
- [עבודה עם Iroha בינארי](/he/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

כדי לשחזר תמונה מלאה של סיוע מארקדון מהמחאה המקורית, תפעיל:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
