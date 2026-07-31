---
translation_locale: he
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# עסקאות אנונימיות {#anonymous-transactions}

עסקים אנונימיים ב Iroha נבנו מתוך פעולות נכסים סודיות. במקום כתיבת העברת חשבונות ציבוריים לחשבון עם סכומים ציבוריים, הארנק מעביר את הערך לתוך ספריה מוגנת ולאחר מכן מוציא שערות לא ברורות עם ראיות של ידע אפס.

המספר הציבורי עדיין רשום שהפעולה סודית התרחשה. הוא רשום התחייבויות, ביטולים, חשיבות ראיות, ואירועים, אבל זה לא רשום את הבעלים של הערת, המתקבל או הסכום עבור תנועת מגן למגן. קספת העסקאות הרגילה עשויה עדיין לחשוף את החשבון המגיש, אז "אנונימי" כאן פירושו תנועת נכסים אנונימית, ולא אנונימיות אוטומטית ברמת הרשת או ברמה של החשבון .

## אבני בנייה {#building-blocks}

|הרעיון|ייצוג ספריה |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|פתק מוגן |תיק ארנק פרטי המכיל נכס, סכום, נתונים של הבעלים, אקראי. |
|התחייבות |ערך ציבורי של 32 בייטים המחייב לטיוט מבלי לחשוף את השדות שלו. |
|מבטל |ערך ציבורי ב-32 בייטים המוצא כאשר פתק נבזבז. Iroha דוחה ביטולים חוזרים על עצמם כדי למנוע הוצאה כפולה .|
|שורש מרקל |שורש אחרון של עץ ההתחייבויות של הנכס. הראיות משתמשות בו כדי להוכיח כי ניירות הוצאות קיימות. |
|תוספת הוכחה |`ProofAttachment` המכיל בייטות הוכחה ועוד דף של מפתח לאמת או מפתח לאיתור לאמת. |
|אירוע סודי.|אירוע בספרה כגון `ConfidentialEvent::Shielded`, `Transferred`, או `Unshielded`. |

ההוראות העיקריות הן:

- `RegisterZkAsset`: רשום נכס ככפוי ל- ZK ומחייב את מפתחות ההעברה, המגן והלא המגן.
- `Shield`: מחייב סכום ציבורי ומוסיף התחייבות של פתק מוגן.
- `ZkTransfer`: משקיע ניירות מחסומות בהתחייבותות ניירות מחסות.
- `Unshield`: מוציא ניירות מחוססות ומקבלת תיק חשבון ציבורי.
- `ScheduleConfidentialPolicyTransition` ו `CancelConfidentialPolicyTransition`: לשנות את מדיניות הסודיות של נכס באמצעות ניהול.

הגדרה של נכס נושאת גם [`AssetConfidentialPolicy`](/he/reference/data-model-schema.md).

|מצב |משמעות |
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly` |רק סכומים ציבוריים רגילים והעברה מקבלים. |
|`Convertible` |המשתמשים יכולים להעביר את הערך בין סכומים ציבוריים לנקודות מחוספות. |
|`ShieldedOnly` |שחרור נכסים והעברות חייבים להישאר בספר המומץ. |

## כיצד להשתמש בהם {#how-to-use-them}

1. להפעיל תמיכה סודית על קשרים מבטיחים. המבטיחים חייבים להסכים על האחורי של בדיקת, מפתחות הבדיקת פעילות, פרמט Poseidon/Pedersen IDs, וגרסה של חוקים סודיים. הערכות סודיות דוחפות עמיתים או בלוקים עם סימני תכונות סודיות לא מתאים.
2. לפרסם או להירשם את מפתחות ההמתנה וקבוצות הפרמטרים המשמשות על ידי המעגלים. ארנקים ופעילים צריכים להתייחס למפתחות ב `VerifyingKeyId`, למשל `halo2/ipa:vk_transfer`.
3. רשום את הנכסים ככישורים ZK עם `RegisterZkAsset`, או לבצע מעבר למדיניות מ `TransparentOnly` ל `Convertible` או `ShieldedOnly`.
4. הגנה על כספים ציבוריים עם `Shield`. הארנק יוצר מחויבות של פתק ונטל מועיל מוצפן עבור המקבל לפני שהוא שולח את העסקה.
5. העברת פרטית עם `ZkTransfer`. הארנק בונה הוכחה לכך שהוא בעל הערות הכניסה, כי ערכי הכניסה והתוצאת מאוזנים, וכי כל הערה הושלמת מקושרת לעץ התחייבויות אחרון.
6. `Unshield` חושף את הסכום הציבורי ואת החשבון של המקבל, מוציא את המבטל הערת הפרטית ויכול ליצור פרטי תוצאות שינוי.
7. בדיקה על ידי קריאת אירועים סודיים, רשומות ראיות, מעמד ביטול, ואת רשומות אבטחה אנונימיות באמצעות שאילתות מודפשת ונקודות סוף Torii.

## CLI דוגמא {#cli-examples}

הפקודות ZK CLI נועדו לניהול ולבחון זרמים. הארנקים הייצוריים צריכים ליצור התחייבויות, מטענים משותפים וראיות עם ספריית ארנק/מבחן לפני שישלחו את ההוראות הנובעות מהם.

רשום נכס היבריד ZK בעל ערך:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

תבנה מעטפת מטען מועילה מוצפנת עם גרסה עבור הערת המסתורית:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

הגנה על כספים ציבוריים בספריה המוגנת של הנכס:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

חיתוך עם קישור ראוי JSON:

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

בייטי ההוכחה המדויקים מגיעים מהאחורי של ההוכחה המוגדר. עומס הניתוח צריך רק את הכניסה הציבורית ואת קישור ההוכחה:

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

## אבטחה נכסים אנונימיים {#anonymous-asset-escrow}

אבטחת נכסים אנונימית משתמשת באותה מכונת העברה מוגן עבור ערך מוגן. הצדדים והמצב של האבטחה עדיין נרשמים ברשימת ההאבטחה, אך רכיבי המימון, השחרור, ביטול וההחלטות משתמשים במכשירים מבוססים ומחייבויות יצירה.

לדוגמאות וההתנהגות של ISI אבטחה, ראה [ אבטחת נכסים מקומיים ](/he/blockchain/escrow.md#anonymous-escrow).

מחזור החיים הוא:

1. `OpenAnonymousAssetEscrow` מבזבז בנקודות מימון מוגן ויוצר מחויבות מאובטחת אחת.
2. `AcceptAnonymousAssetEscrow` רשום את הקונה.
3. `MarkAnonymousEscrowPaymentSent` רשום כי הקונה שלח את התשלום מחוץ לרשת.
4. `ReleaseAnonymousAssetEscrow` מוציא את ההתחייבות בגיבוי לקריאת ההתחייבים של הקונה.
5. `CancelAnonymousAssetEscrow` מוציא את ההתחייבות בגיבוי בחזרה לתחייבויות יצירה של המוכר כאשר התשלום לא הושתק.
6. `OpenAnonymousEscrowDispute` ו `ResolveAnonymousEscrowDispute` מטפלים בכספים במחלוקת עם חישובים ראיות ופרידה נשלטת על ידי המפתר.

השתמשו בשאלות אבטחה אנונימיות המפורסמות ב [שאלות ](/he/reference/queries.md#escrow-and-proof-records) לבחון רישומי אבטחה ומעמדם.

## מתמטיקה {#math}

הציון הבא מתאר את זרימת הנכסים הסודית. יישומים משתמשים במחלקה הפעילה והפרמט IDs מ מדיניות הנכסים ורייגסטר המבחינים, כך שהלקוחות צריכים לטפל בהתחייבויות, בביטות ביטול, ובייטים הוכחה כוצאות לא ברורות של הארנק/מבטא.

פתק מוגן יכול להיות מתואר כ:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

כאשר `owner` נגזר ממסרי הצילום או ההוצאה של המקבל, ו`rho` הוא צירוף מקרים.

מחויבות הנקודה היא מחויבות מוסתרת:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

עבור מעגלי העברה הסודיים הנוכחיים, הכניסה הציבורית כוללת מחויבות הערות, מבטלנים, שורש מרקל, תג נכס וטוג שרשרת. המעגל מכיל מערכת יחסי התחייבות בצורת זו:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

כאשר פתק נבזבז, הארנק יקבל את המבטל:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` הוא ציבורי. זה לא חושף את הנקודה, אבל הוא יציב עבור הנקודה ואת שרשרת זו, כך Iroha יכול לדחות הוצאה שנייה עם אותו אפושל.

עץ ההתחייבות מוכיח את קיומו של הערות. אם הארנק מוציא התחייבות `C_i`, ההוכחה כוללת מסלול מרקל פרטי מ `C_i` לשורש ציבורי אחרון:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

עבור העברה מחוסרת למחוסרת, ההוכחה מכיל גם שמירה על ערך:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

עבור סכום לא מוגן, הנתון הציבורי כולל:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

ההוכחה המסופקת יכולה להיסכם כך:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

שם `public_inputs` הם ההתחייבויות, ביטוליות, שורש, קישור נכסים, קישוט שרשרת וכל סכום ציבורי לא מוגן. העד מכיל את סכומי הערות, אקראי, חומר הוצאה וסלולים של מרקל. בדיקנים בודקים את ההוכחה ולאחר מכן מוטטים את מצב הספר הגדול על ידי תוספת מחויבות יצירה וציון חסירי הכניסה כמשלמים.

## מה הוא ציבורי {#what-is-public}

עסקאות אנונימיות לא הופכות את כל העובדות המסתכלות פרטיות.

- האש של העסקה, גובה הבלוק והזמנה.
- רשות העסקה המגיש, אלא אם כן הבקשה משתמשת בנקודת כניסה פרטית או בדפוס של מעקב אחר.
- הגדרת הנכסים המשמשת
- חוברי ביטול והתחייבויות יצירה
- האשיזים של הוכחה, תיקונים של מפתח לאמת, והאשיזים בחופשיים של מעטפה.
- סכום ציבורי וחשבון הקבלן עבור `Unshield`
- מוכר, קונה, מעמד, תוויות זמן ונתונים של ראיות

עיצוב יישומים כך שהתנתונים הציבוריים האלה לא יחשפו את מערכת היחסים העסקית שאתה מנסה להגן עליה.

## תיקון קשור {#related-reference}

- [`AssetConfidentialPolicy`](/he/reference/data-model-schema.md)
- [`ConfidentialEvent`](/he/reference/data-model-schema.md)
- [`ProofAttachment`](/he/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/he/reference/data-model-schema.md)
- [חקירות אבטחה וראיות ](/he/reference/queries.md#escrow-and-proof-records)
