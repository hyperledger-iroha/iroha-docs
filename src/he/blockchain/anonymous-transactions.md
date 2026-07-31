---
translation_locale: he
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# עסקאות אנונימיות {#anonymous-transactions}

עסקאות אנונימיות Iroha הם בנויים מתוך נכס סודי.
במקום כתיבת הוצאות מחיר לחשבון ציבורי
סכומים ציבוריים, ארנק מעביר את הערך לתוך ספר גדול מחוסל ואז מוציא
הערות לא ברורות עם הוכחות של ידע אפס.

ההדף הציבורי עדיין רשום שקרה פעילות סודית.
הוא רשום מחויבויות, ביטוליות, חישובים ראיות, ואירועים, אבל זה לא
רשום את הבעלים, המקבלים או הסכום של הודעות מגינות
התנועה. קספת העסקאות הרגילה עדיין עשויה להראות את ההשלוח
חשבון, אז "אנונימי" כאן אומר תנועת נכסים אנונימית, לא אוטומטית
אנונימיות ברמת רשת או ברמה של חשבון.

## אבני בנייה {#building-blocks}

| תפיסה            | ייצוג של ספריה                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| שכר מחסום      | תיק ארנק פרטי המכיל נכס, סכום, נתונים על הבעלים, אקראי.                                   |
| התחייבות         | ערך ציבורי של 32 בייטים המחויב לציון מבלי לחשוף את השדות שלו.                                        |
| חסין          | ערך ציבורי של 32 בייטים שנוצר כאשר נאמר נבזבז. Iroha דוחים את ההשוואה חוזרת כדי למנוע הוצאה כפולה. |
| שורש מרקל        | שורש אחרון של עץ ההתחייבויות של הנכס.                        |
| תוספת ראיות   | א `ProofAttachment` המכיל בייטות הוכחה ועוד דוגמה למפתח לאמת או מפתח לאמת קו.                 |
| אירוע סודי | אירוע של ספריה, כגון `ConfidentialEvent::Shielded`, `Transferred`, או `Unshielded`.                              |

ההוראות העיקריות הן:

- `RegisterZkAsset`: רשום נכס כ ZK-העברות מסוגלת ומחובדת,
  מחסום, ומפתחות אימות בלתי מחסומים.
- `Shield`: מחייב את היתר הציבורי ומטפל בהתחייבות של פתק מוגן.
- `ZkTransfer`: מוציא את הערות המוגנות למתחייבויות חדשות של הערות המגונות.
- `Unshield`: משקיע ניירות מחוסות ומקבלת חשבון ציבורי.
- `ScheduleConfidentialPolicyTransition` ו
  `CancelConfidentialPolicyTransition`: לשנות את הסודיות של נכס
  מדיניות באמצעות ממשל.

הגדרה של נכס גם נושאת
[`AssetConfidentialPolicy`](/he/reference/data-model-schema.md).
אמצעי הבקרה של מדיניות אשר זרימים הם תקפים:

| מצב              | המשמעות                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `TransparentOnly` | רק סכומים ציבוריים רגילים והעברות מקובלים.          |
| `Convertible`     | המשתמשים יכולים להעביר את הערך בין סכומים ציבוריים לנקודות מוגן. |
| `ShieldedOnly`    | שקיעת נכסים והעברות חייבים להישאר בספר המוצא.   |

## איך להשתמש בהם {#how-to-use-them}

1. להפעיל תמיכה סודית על קשרים בדיקת.
   האחורי של המבחין, מפתחות הבדיקת פעילות, פרמטרים Poseidon/Pedersen
   IDs, וגרסה של כללי סודיות.
   אי התאמה של מאפיינים סודיים.
2. לפרסם או לרשום את מפתחות ההמתנה וקבוצות פרמטרים המשמשות על ידי
   מחוזים: ארנקים ופעילים צריכים להתייחס למפתחות על ידי
   `VerifyingKeyId`, לדוגמא `halo2/ipa:vk_transfer`.
3. רשום את הנכסים כ ZK-סוגל עם `RegisterZkAsset`, או שלב א
   מעבר מדיניות `TransparentOnly` ל `Convertible` או
   `ShieldedOnly`.
4. הגנה על כספי ציבור עם `Shield`. הארנק יוצר מחויבות של פתק.
   ונטל מועיל מוצפן עבור המקבל לפני שהוא שולח את
   העסקה.
5. העברה פרטית עם `ZkTransfer`. הארנק בונה הוכחה כי
   יש לו את הערות הכניסה, שערכי הכניסה והוצא מאוזנים, וכי
   כל פתק הושלם מושרש בעץ מחויבות.
6. פוסק רק כאשר מדיניות הנכסים מאפשרת את זה. `Unshield` מגלה את
   סכום ציבורי וחשבון של המקבל, מוציא את החטיפה הפרטית,
   וניתן ליצור פרטי תוצאות שינוי.
7. בדיקה על ידי קריאת אירועים סודיים, רשומות ראיות, מעמד ביטול,
   ומספרי אבטחה אנונימיים באמצעות שאלונות מודפסות Torii נקודות סוף.

## CLI דוגמאות {#cli-examples}

ה- ZK CLI הפקודות מיועדות לזרמים של המפעיל ולמחקרים.
הארנקים צריכים לייצר התחייבויות, מטענים משמשים מוצפנים, וראיות עם
ספריית הארנק/המתבוננים לפני ההנחיות המתקבלות.

רשום היבריד ZK- נכס בעל יכולת:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

תבנה מעטפת מטען מועילה משוברת בתסריט עבור הערת המגן:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

הגנת כספים ציבוריים בספר ההספקה של הנכס:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

חסינות עם תוספת ראיה JSON:

```bash
cat > unshield-proof.json <<'JSON'
{
  "backend": "halo2/ipa",
  "proof_b64": "BASE64_PROOF_BYTES",
  "vk_ref": {
    "backend": "halo2/ipa",
    "name": "vk_unshield"
  }
}
JSON

iroha app zk unshield \
  --asset <asset-definition-id> \
  --to <account-id> \
  --amount 1000 \
  --inputs DEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF \
  --proof-json unshield-proof.json
```

## SDK דוגמה {#sdk-example}

בייטות ההוכחה המדויקות באו מהאחורי של ההוכחה המוגדרת.
מטען שימושי של העסקה צריך רק את הכניסה הציבורית ואת תוספת ההוכחה:

```rust
use iroha_data_model::{
    isi::zk::{Unshield, ZkTransfer},
    prelude::{AccountId, AssetDefinitionId, InstructionBox},
    proof::{ProofAttachment, ProofBox, VerifyingKeyId},
};

fn transfer_instruction(
    asset: AssetDefinitionId,
    input_nullifier: [u8; 32],
    output_commitment: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_transfer");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    ZkTransfer::new(
        asset,
        vec![input_nullifier],
        vec![output_commitment],
        attachment,
        Some(anchor_root),
    )
    .into()
}

fn unshield_instruction(
    asset: AssetDefinitionId,
    recipient: AccountId,
    amount: u128,
    input_nullifier: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_unshield");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    Unshield::new(
        asset,
        recipient,
        amount,
        vec![input_nullifier],
        attachment,
        Some(anchor_root),
    )
    .into()
}
```

## אסיטום לאנונימי {#anonymous-asset-escrow}

אבטחה נכסים אנונימית משתמשת באותו מכונת העברה מוגן
הערך המוטל.
רישום מאבטח, אך רכיבי ההמון, השחרור, ביטול וההחלטות
להשתמש בנקלוטים מחסנים ותחייבויות יצירה.

עבור אבטחה מפורטת ISI התנהגות ומדוגמאות, ראה
[אסיטום נטיב](/he/blockchain/escrow.md#anonymous-escrow).

מחזור החיים הוא:

1. `OpenAnonymousAssetEscrow` הוא משקיע ניירות מימון מוגנות ויוצר
   התחייבות בנקודת מאבטחה.
2. `AcceptAnonymousAssetEscrow` רשום את הקונה.
3. `MarkAnonymousEscrowPaymentSent` רשומות שהקונה שלח תשלום
   מחוץ למשרשרת.
4. `ReleaseAnonymousAssetEscrow` מוציא את ההתחייבות בנקודת מאובטחת לקונה.
   התחייבויות בהוצאות.
5. `CancelAnonymousAssetEscrow` מוציא את ההתחייבות בגיבוי בחזרה למוכר
   התחייבויות בהוצאות אם התשלום לא הוקלט.
6. `OpenAnonymousEscrowDispute` ו `ResolveAnonymousEscrowDispute` כפייה
   סגורות מחלוקת עם ראיות חישובים ופרידה נשלטת על ידי פיתוח.

השתמש בשאלות אבטחה אנונימיות המפורסמות ב
[שאלות](/he/reference/queries.md#escrow-and-proof-records) לפקח על אבטחה
רשומות ומעמדות.

## מתמטיקה {#math}

הציון הבא מתאר את זרימת הנכסים הסודיים.
השתמשו במחלקה הפעילה ובפרמטרים IDs מדיניות הנכסים ומבחין
רישום, כך הלקוחות צריכים לטפל בהתחייבות, ביטול, ובייטות הוכחה
כמוצאים לא ברורים של הארנק/הפרופסור.

פתק מוגן ניתן לתאר כ:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

איפה `owner` הוא נגזר מהמידע של המקבל או ההוצאה;
`rho` הוא תצפית אקראית.

ההתחייבות של הנקודה היא התחייבות מוסתרת:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

עבור מעגלי העברה הסודיים הנוכחיים, הכניסות הציבוריות כוללות
הערות התחייבויות, ביטול, שורש מרקל, סימן נכס, וסימן שרשרת.
המעגל מכיל יחס מחויבות בצורת זו:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

כאשר פתק מוציא, הארנק יקבל את ההשוואה:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` זה לא חושף את הנקודה, אבל הוא יציב עבור הנקודה
ושרשרת, אז Iroha יכול לדחות הוצאה שנייה עם אותו אפוש.

עץ ההתחייבות מוכיח את קיומו של הערות.
`C_i`, ההוכחה כוללת דרך פרטית של מרקל `C_i` לאחרונה
שורש ציבורי

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

עבור העברה מחוסרת למחוסרת, הראיה גם מכיל ערך
שימור:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

עבור סכום לא מוגן, הנתון הציבורי כולל:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

ההוכחה המוצעת יכולה להיות מסוממת כ:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

איפה `public_inputs` האם ההתחייבויות, המבטלים, שורש, סימן נכס,
תווית שרשרת, וכל סכום ציבורי ללא מחסום.
סכומים, אקראיות, חומר הוצאה, ודרכי מרקל.
התוכנה ולאחר מכן מוטט את מצב ההספר על ידי תוספת התחייבויות יצירה,
סימן מחסרי הכניסות כמשלמים.

## מה הוא ציבורי {#what-is-public}

עסקאות אנונימיות לא הופכות כל עובדה מתבצעת פרטית.
הנתונים הבאים עדיין יכולים להיות ציבוריים:

- האש של העסקה, גובה הבלוק והזמנה
- הסוכנות המגיש את העסקה, אלא אם כן הבקשה משתמשת
  נקודת כניסה פרטית או תבנית מערך
- הגדרת הנכסים המשמשת
- חובות ביטול ותחומי יצירה
- חישובים של הוכחה, תיקונים של מפתח לאמת, וחישופים בחופשיים של מעטפה
- סכום ציבורי וחשבון של המקבל `Unshield`
- מכר, קונה, מעמד, סימני זמן ונתונים של ראיות אנונימיים

תכנון יישומים כך שהמטא נתונים הציבוריים לא חושפים את העסק
מערכת יחסים שאתה מנסה להגן עליה.

## דף קשור {#related-reference}

- [`AssetConfidentialPolicy`](/he/reference/data-model-schema.md)
- [`ConfidentialEvent`](/he/reference/data-model-schema.md)
- [`ProofAttachment`](/he/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/he/reference/data-model-schema.md)
- [שאילויות אבטחה ותוכנות](/he/reference/queries.md#escrow-and-proof-records)
