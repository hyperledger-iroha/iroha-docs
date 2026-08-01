---
translation_locale: he
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
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
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
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
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

לאחר שאתה יוצר `taira.client.toml`, אותו בינרי יכול להפעיל פקודות קאנאריות חתומות נגד Taira. לשמור את אלה נפרדים מבדיקות יחידות רגילות כי הם דורשים חשבון מימון מכבר וקיום טסטנט זמינות.

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

עבור זרימות עבודה של אבטחויות מנוהלות במספרים, ראה [ אבטחת נכסים מקומיים ](/he/blockchain/escrow.md#rust-sdk). מודל הנתונים של Rust כולל כיום את הכיתוב המלא ביותר עבור אבטחה בשוק, סגרות נכסים גנריות, אבטחה אנונימית, שאילויים ואירועים.

אתה יכול לשחזר תמונה של עזרה מקומית CLI עם:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## הערות {#notes}

- CLI מספקת כיום כיסוי טוב יותר מאשר המסמכים של תיבת קופסה עצמאית.
- עבור זרמים בסגנון המפעיל, המסמך CLI הוא המקור הנוכחי ביותר.
