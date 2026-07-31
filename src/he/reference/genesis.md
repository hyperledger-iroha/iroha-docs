---
translation_locale: he
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# תיקון בראשית {#genesis-reference}

בתנועת העבודה הנוכחית Iroha 3, מוניסט `genesis.json` מתאר את העסקאות והפרמטרים הראשונים שייישמו בעת הפעלת הרשת.

הארטפקט החותם הנפרסם בין עמיתים הוא קובץ Norito של `.nrt` שנוצר על ידי `kagami genesis sign`.

## שדות ראשיים {#main-fields}

מוניפסט הגנזיס יכול להגדיר:

- `chain` עבור זיהוי שרשרת
- `executor` עבור מסלול קידום בייטקוד של מבצע בחופשי
- `ivm_dir` עבור ספריות IVM המשמשות על ידי תפעילים ושיפורים
- `consensus_mode` למצב הראשוני המודיע במניפסט.
- `transactions` עבור עדכונים של פרמטרים מסודרים, הוראות, גורמים וטופולוגיה.
- `crypto` עבור תמונת הקריפטו הראשונית

בתוך `transactions`, הכניסה הטופולוגית משותפת IDs עמיתים ו PoPs יחד:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## יצרו מופע {#generate-a-manifest}

להשתמש ב- Kagami כדי ליצור דפוס:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

למרחב הנתונים הציבורי SORA Nexus, `npos` הוא מצב ההסכמה הנצפה. פיתוחים אחרים Iroha 3 עשויים להשתמש ב- permissioned או NPoS בהתאם לפרופיל המטרה.

## תחתום על ההודעה {#sign-the-manifest}

לאחר תיקון ומסדיר JSON, חתום על זה בלוק `.nrt` שניתן לפתוח:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` קורא את המפתח הציבורי של הגנזה מהמניפסט ומשתמש במפתח פרטי, זרע ואלגוריתם המסופק כדי לייצר את הבלוק הנחתם שניתן להגדיר. התוצאה היא הקובץ שעליו עמיתים צריכים להתייחס מההסדר שלהם.

## הגדרות `irohad` {#configure-irohad}

תכוון את הדיימון בלוק הגנזיס הנחתם:

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

לפרטים על יישום הגנרטור והפקוד, ראה את [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
