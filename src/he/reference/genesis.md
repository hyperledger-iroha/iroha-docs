---
translation_locale: he
translation_source: /reference/genesis.md
translation_source_hash: dda17468f39573a1fcf43474351bd01c4fea38e8b603fd4d8b21780b273c8649
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
- `wire_protocol_version` עבור גרסת פרוטוקול התקשורת של הקונצנזוס במהדורה הראשונה
- `consensus_fingerprint` עבור טביעת האצבע האופציונלית בעלת הטיפוס של פרמטרי הקונצנזוס, שמניפסטים של JSON מציינים במפורש
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
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

עבור מרחב הנתונים הציבורי של SORA Nexus, ‏`npos` הוא מצב הקונצנזוס הצפוי. פריסות אחרות של Iroha 3 עשויות להשתמש במצב מבוסס הרשאות או ב־NPoS, בהתאם לפרופיל היעד.

## חתמו על המניפסט {#sign-the-manifest}

לאחר עריכה ואימות של JSON, לחתום אותו לפריסה `.nrt` לַחסוֹם:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

`kagami genesis sign` גוזר את זוג המפתחות של בראשית מהמפתח הפרטי שבקובץ רגיל בעל קישור יחיד המוחזק בידי הבעלים, כדי להפיק את הבלוק החתום שניתן לפריסה. העבירו את `--expected-public-key` כדי לדרוש שהוא יתאים למפתח הציבורי של בראשית שפורסם. הקובץ חייב להכיל multihash קנוני אחד של מפתח פרטי ואחריו שורה חדשה; Kagami דוחה קישורים סמליים והרשאות שאינן `0600`. מפתחות פרטיים גולמיים אינם מתקבלים בשורת הפקודה. התוצאה היא הקובץ שאליו הצמתים צריכים להפנות מהתצורה שלהם.

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
