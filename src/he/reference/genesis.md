---
translation_locale: he
translation_source: /reference/genesis.md
translation_source_hash: 340921f59a6f8788f559190d520f046ea2473d65154f57a1c54212840c027bc0
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# הפניה בראשית {#genesis-reference}

בזרם Iroha 3 זרימת עבודה, א `genesis.json` מניפסט מתאר את הראשון עסקאות ופרמטרים שיופעלו כאשר הרשת תתחיל.

הארטיפקט החתום שחולק לצמתים הוא א Norito-מוּצפָּן `.nrt` קוֹבֶץ מיוצר על ידי `kagami genesis sign`.

## שדות עיקריים {#main-fields}

מניפסט בראשית יכול להגדיר:

- `chain` עבור מזהה השרשרת
- `chain_discriminant` עבור קידומת הרשת I105 המשמשת לקידוד ערכי חשבון מילוליים במניפסט
- `executor` עבור נתיב קוד בתים לשדרוג מבצע אופציונלי
- `ivm_dir` עֲבוּר IVM ספריות בשימוש על ידי טריגרים ושדרוגים
- `consensus_mode` עבור המצב הראשוני שמפרסם המניפסט
- `transactions` עבור עדכוני פרמטרים מסודרים, הוראות, טריגרים וטופולוגיה
- `sumeragi_context` עבור פרמטרי הקשר הגובה החתומים של Sumeragi
- `crypto_admission_policy` עבור אלגוריתמי החתימה והבקרים המדויקים שהשרשרת מקבלת, המפורטים ב־`allowed_algorithms`

בְּתוֹך `transactions`, ערכי טופולוגיה צמד מזהי צמתים ו PoPs יַחַד:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## צור מניפסט {#generate-a-manifest}

השתמשו ב־Kagami ליצירת תבנית. חזרו על `--allowed-signing` עבור כל אלגוריתם שמותר לקבל, בסדר קנוני עולה; Kagami אינו משלים אלגוריתמים שהושמטו:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 > genesis.json
```

עבור מרחב הנתונים הציבורי של SORA Nexus, ‏`npos` הוא מצב הקונצנזוס הצפוי. פריסות אחרות של Iroha 3 עשויות להשתמש במצב מבוסס הרשאות או ב־NPoS, בהתאם לפרופיל היעד.

## חתמו על המניפסט {#sign-the-manifest}

לאחר עריכה ואימות של JSON, לחתום אותו לפריסה `.nrt` לַחסוֹם:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` קורא את המפתח הציבורי בראשית מהמניפסט ומשתמש המפתח הפרטי מקובץ רגיל בעל קישור יחיד להפקת ה- בלוק חתום שניתן לפריסה.הקובץ חייב להכיל מפתח פרטי קנוני אחד multihash ואחריו שורה חדשה; Kagami דוחה קישורים סמליים ואופנים אחרים מֵאֲשֶׁר `0600`. מפתחות פרטיים גולמיים אינם מתקבלים בשורת הפקודה.התוצאה הוא הקובץ שאליו צמתים צריכים להפנות מהתצורה שלהם.

## הגדר `iroha3d` {#configure-iroha3d}

הפנו את הדמון לבלוק ה־genesis החתום ולקובץ המקבע את הגיבוב הצפוי שלו. `kagami genesis sign --expected-hash-out` כותב את הקובץ הזה, והצומת דורש אותו בהפעלה ראשונית ובהפעלה מחדש:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## כלים קשורים {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

למימוש המחולל ולפרטי הפקודות, ראו [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md).
