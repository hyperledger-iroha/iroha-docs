---
translation_locale: he
translation_source: /guide/tutorials/rust.md
translation_source_hash: 9d9848de91a85c84221efc39bc7dfb8443f5c50b448d336207c06efce3bc07e8
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Rust {#rust}

יישום Rust חי במרחב העבודה העיקרי ונשאר הדרך המובילה ביותר לעבוד עם בסיס הקוד Iroha 3.

## מה אתה מקבל {#what-you-get}

המלאי העליון מגלה כיום:

- קופסת הלקוח `iroha` Rust
- ה- `iroha` CLI כלקוח התייחסות המלא ביותר
- מודל נתונים משותף, קריפטו וקופסאות Norito המשמשות על ידי שכבת SDK

## נקודת התחלה המומלצת {#recommended-starting-point}

למצב הנוכחי של הפרויקט, תתחיל עם המסמך CLI ומרחב העבודה עצמו:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

תפעיל את לקלינט ההשוואה עם הגדרת הלקוח המקובל הנעברת:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

## נסה Taira לקרוא בלבד {#try-taira-read-only}

מאותו מקום עבודה, נסה את עוזר האבחנה הציבורי Taira:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

עבור בדיקות ברמה של מסלול, השתמשו ישירות JSON API של Torii:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

לאחר שיצרתם את `taira.client.toml`, אותו קובץ בינארי יכול לצרף חשבון ולממן אותו באמצעות `iroha taira account`, ולשלוח פקודות חתומות רגילות לספר החשבונות מול Taira. הפרידו אותן מבדיקות יחידה רגילות, משום שהן דורשות חשבון שמומן מה־faucet וזמינות של רשת הבדיקה החיה.

## שימוש בכספת הלקוח Rust {#using-the-rust-client-crate}

תדביקו את התיקון של Iroha Git המשמש על ידי הרשת שלך:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

אם אתה צריך את הדוגמאות המלאות ביותר של השימוש בפועל במשטח Rust, בדוק:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

לתהליכי נאמנות המנוהלים בספר החשבונות, ראו [נאמנות נכסים מובנית](/he/blockchain/escrow.md#rust-sdk). מודל הנתונים של Rust מספק כיום את הכיסוי המלא ביותר בעל טיפוסים עבור נאמנות שוק, נעילות נכסים כלליות, נאמנות מותנית, שאילתות ואירועים.

אתה יכול לשחזר תמונת מצב של עזרה מקומית CLI עם:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## הערות {#notes}

- CLI מספקת כיום כיסוי טוב יותר מאשר המסמכים של תיבת קופסה עצמאית.
- עבור זרמים בסגנון המפעיל, המסמך CLI הוא המקור הנוכחי ביותר.
