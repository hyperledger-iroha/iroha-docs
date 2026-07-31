---
translation_locale: he
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# דברי בראשית {#genesis-reference}

במקביל Iroha 3 זרימת עבודה, `genesis.json` המופע מתאר את הראשון
עסקאות ופרמטרים שייישמו בעת הפעלת הרשת.

המוצר החותם הנפוצה לעמיתים הוא Norito-מוצפן `.nrt` תיק
מיוצר על ידי `kagami genesis sign`.

## שדות ראשיים {#main-fields}

מוניפסט הגנזה יכול להגדיר:

- `chain` עבור מזהה שרשרת
- `executor` עבור מסלול קידום בייטקוד של מבצע אופציונלי
- `ivm_dir` עבור IVM ספריות המשמשות על ידי מפעילים ושיפורים
- `consensus_mode` למצב הראשוני המודיע במניפסט
- `transactions` עבור עדכונים של פרמטרים מסודרים, הוראות, תפעילים וטופולוגיה
- `crypto` עבור תמונת הקריפטו הראשונית

בתוך `transactions`, רשומות טופולוגיה זוגות איד של עמידים ו PoPs יחד:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## ליצור מופע {#generate-a-manifest}

שימוש Kagami כדי ליצור דפוס:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

לציבור SORA Nexus מרחב נתונים, `npos` הוא מצב ההסכמה הנצפה.
אחרים Iroha 3 הפעלות עשויות להשתמש ב- permissioned או NPoS בהתאם למטרה.
פרופיל.

## תחתום על ההודעה {#sign-the-manifest}

לאחר העדכון והבדיקת JSON, תחתום על זה למערכת שימושית `.nrt` בלוק:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` קורא את המפתח הציבורי של הגנזס מהמניפסט ומשמש
המפתח הפרטי, הזרע והאלגוריתם המסופקים כדי לייצר את החותמת המוצעת
התוצאה היא הקובץ שאותם עמיתים צריכים להתייחס אליו מההסדר שלהם.

## הגדרות `irohad` {#configure-irohad}

תכוון את הדיימון בלוק ההתחלה חתום:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## כלים קשורים {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

לפרטים על יישום הגנרטור וההוראה, ראה
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
