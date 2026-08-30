---
translation_locale: he
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# הפניה בראשית {#genesis-reference}

בזרם Iroha 3 זרימת עבודה, א `genesis.json` מניפסט מתאר את הראשון
עסקאות ופרמטרים שיופעלו כאשר הרשת תתחיל.

החפץ החתום שחולק לעמיתים הוא א Norito-מוּצפָּן `.nrt` קוֹבֶץ
מיוצר על ידי `kagami genesis sign`.

## שדות עיקריים {#main-fields}

מניפסט בראשית יכול להגדיר:

- `chain` עבור מזהה השרשרת
- `executor` עבור נתיב קוד בתים לשדרוג מבצע אופציונלי
- `ivm_dir` עֲבוּר IVM ספריות בשימוש על ידי טריגרים ושדרוגים
- `consensus_mode` עבור המצב הראשוני שמפרסם המניפסט
- `transactions` עבור עדכוני פרמטרים מסודרים, הוראות, טריגרים וטופולוגיה
- `crypto` עבור תמונת המצב הקריפטו הראשונית

בְּתוֹך `transactions`, ערכי טופולוגיה צמד מזהי עמיתים ו PoPs יַחַד:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## צור מניפסט {#generate-a-manifest}

לְהִשְׁתַמֵשׁ Kagami כדי ליצור תבנית:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

למען הציבור SORA Nexus מרחב נתונים, `npos` הוא מצב הקונצנזוס הצפוי.
אַחֵר Iroha 3 פריסות עשויות להשתמש בהרשאה או NPoS בהתאם ליעד
פּרוֹפִיל.

## חתמו על המניפסט {#sign-the-manifest}

לאחר עריכה ואימות של JSON, לחתום אותו לפריסה `.nrt` לַחסוֹם:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` קורא את המפתח הציבורי בראשית מהמניפסט ומשתמש
המפתח הפרטי מקובץ רגיל בעל קישור יחיד להפקת ה-
בלוק חתום שניתן לפריסה.הקובץ חייב להכיל מפתח פרטי קנוני אחד
multihash ואחריו שורה חדשה; Kagami דוחה קישורים סמליים ואופנים אחרים
מֵאֲשֶׁר `0600`. מפתחות פרטיים גולמיים אינם מתקבלים בשורת הפקודה.התוצאה
הוא הקובץ שאליו עמיתים צריכים להפנות מהתצורה שלהם.

## הגדר `iroha3d` {#configure-iroha3d}

כוון את הדמון אל גוש הבראשית החתום:

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

ליישום המחולל ופרטי הפקודה, ראה את
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
