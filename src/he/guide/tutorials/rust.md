---
translation_locale: he
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

ה- Rust היישום מתקיים במרחב העבודה העיקרי ונשארו המובילים ביותר
דרך לעבוד עם Iroha 3 בסיס קוד.

## מה אתה מקבל {#what-you-get}

האספנה העליונה מגלה כיום:

- ה- `iroha` Rust תיבת הלקוח
- ה- `iroha` CLI כמו הלקוח המקובל ביותר
- מודל נתונים משותף, קריפטו, Norito קופסאות המשמשות על ידי SDK שכבה

## נקודת התחלה המומלצת {#recommended-starting-point}

למצב הנוכחי של הפרויקט, תתחיל עם התייחסות CLI ו...
שטח עבודה עצמו:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

תפעיל את לקלינט ההשוואה עם הגדרת הקלינט המקובל הנעברת:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## נסה. Taira רק קריאה {#try-taira-read-only}

מאותו מקום עבודה בנקודת מבט, לנסות את הציבור Taira עוזר האבחנה:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

עבור בדיקות ברמת הנתיב, השתמש Torii אני... JSON API ישירות:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

אחרי שאתה יוצר `taira.client.toml`, אותו בינארי יכול לנהל סימון קנרי
פקודות נגד Taira. שמרו את אלה נפרדים מבדיקות יחידות רגילות כי
הם דורשים חשבון מיומן על ידי מכונת מים וזמינות רשת בדיקה חי.

## באמצעות Rust ארון הלקוח {#using-the-rust-client-crate}

תקע את Iroha תיקון Git המשמש על ידי הרשת:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

אם אתה צריך את הדוגמאות המלאות ביותר של איך Rust שטחים משמשים ב
תרגול, ביקורת:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

עבור זרימות עבודה של סכנות שמנהלות בספר, ראה
[אסיטום נטיב](/he/blockchain/escrow.md#rust-sdk). ה- Rust מודל נתונים
כיום יש לו את הכיתוב המלא ביותר עבור שוק הבטוח, גנרי
סגרות נכסים, אבטחה אנונימית, שאלות ואירועים.

אתה יכול לשחזר מקומי CLI תמונה מיידית עזרה עם:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## הערות {#notes}

- ה- CLI כיום מספק כיסוי טוב יותר מאשר המסמכים של תיבה עצמאית.
- עבור זרמים בסגנון המפעיל, CLI מסמכים הם המקור העדכני ביותר.
