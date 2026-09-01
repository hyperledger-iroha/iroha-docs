---
translation_locale: he
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: c5f10d1395e0b7704d29f4a535dd317b2cabe9c838208f76b7b776dd029089c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# עסקאות אנונימיות {#anonymous-transactions}

עסקאות אנונימיות ב־Iroha בנויות מפעולות בנכסים חסויים. במקום לרשום העברות ציבוריות בין חשבונות וסכומים גלויים, הארנק מעביר ערך לספר חשבונות מוגן ולאחר מכן מוציא notes אטומים באמצעות הוכחות zero-knowledge.

ספר החשבונות הציבורי עדיין מתעד שבוצעה פעולה חסויה. הוא מתעד התחייבויות, nullifiers, גיבובי הוכחות ואירועים, אך אינו מתעד את בעל ה־note, את המקבל או את הסכום בתנועה מוגנת־למוגנת. מעטפת העסקה הרגילה עדיין עשויה לחשוף את החשבון השולח; לכן "אנונימי" כאן פירושו תנועה אנונימית של נכס, ולא אנונימיות אוטומטית ברמת הרשת או החשבון.

## אבני הבניין {#building-blocks}

|הרעיון|ייצוג בספר החשבונות |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|note מוגן |רשומת ארנק פרטית המכילה נכס, סכום, נתוני בעלים ואקראיות. |
|התחייבות |ערך ציבורי בן 32 בתים המתחייב ל־note בלי לחשוף את שדותיו. |
|Nullifier |ערך ציבורי בן 32 בתים הנגזר כאשר note מוצא. Iroha דוחה nullifiers חוזרים כדי למנוע הוצאה כפולה.|
|שורש Merkle |שורש עדכני של עץ ההתחייבויות של הנכס. הוכחות משתמשות בו כדי להראות שה־notes שהוצאו קיימים. |
|קובץ מצורף של הוכחה |`ProofAttachment` המכיל את בתי ההוכחה וכן הפניה למפתח אימות או מפתח אימות מוטמע. |
|אירוע חסוי|אירוע בספר החשבונות כגון `ConfidentialEvent::Shielded`, ‏`Transferred` או `Unshielded`. |

ההוראות העיקריות הן:

- `RegisterZkAsset`: רושם נכס כבעל יכולת ZK וקושר את מפתחות האימות להעברה, ל־shield ול־unshield.
- `Shield`: מחייב יתרה ציבורית ומוסיף התחייבות ל־note מוגן.
- `ZkTransfer`: מוציא notes מוגנים אל התחייבויות חדשות ל־notes מוגנים.
- `Unshield`: מוציא notes מוגנים ומזכה יתרה ציבורית של חשבון.
- `ScheduleConfidentialPolicyTransition` ו־`CancelConfidentialPolicyTransition`: משנים את מדיניות החיסיון של נכס באמצעות ממשל.

הגדרת נכס כוללת גם [`AssetConfidentialPolicy`](/he/reference/data-model-schema.md). מצב המדיניות קובע אילו תזרימים תקפים:

|מצב |משמעות |
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly` |מתקבלים רק יתרות והעברות ציבוריות רגילות. |
|`Convertible` |משתמשים יכולים להעביר ערך בין יתרות ציבוריות ל־notes מוגנים. |
|`ShieldedOnly` |הנפקת הנכס והעברתו חייבות להישאר בספר החשבונות המוגן. |

## כיצד להשתמש בהם {#how-to-use-them}

1. הפעילו תמיכה בנכסים חסויים בצומתי validator. ה־validators חייבים להסכים על מנוע האימות, מפתחות האימות הפעילים, מזהי הפרמטרים של Poseidon/Pedersen ‏(IDs) וגרסת כללי החיסיון. צמתים דוחים עמיתים או בלוקים שתקצירי התכונות החסויות שלהם אינם תואמים.
2. פרסמו או רשמו את מפתחות האימות וקבוצות הפרמטרים שבהם משתמשים המעגלים. ארנקים ומפעילים צריכים להפנות למפתחות באמצעות `VerifyingKeyId`, לדוגמה `halo2/ipa:vk_transfer`.
3. רשמו את הנכס כבעל יכולת ZK באמצעות `RegisterZkAsset`, או הכינו מעבר מדיניות מ־`TransparentOnly` אל `Convertible` או `ShieldedOnly`.
4. הגנו על כספים ציבוריים באמצעות `Shield`. לפני שליחת העסקה, הארנק יוצר התחייבות ל־note ומטען מוצפן עבור המקבל.
5. העבירו בפרטיות באמצעות `ZkTransfer`. הארנק בונה הוכחה שהוא בעל ה־notes הנכנסים, שערכי הקלט והפלט מאוזנים ושכל note שהוצא מעוגן בעץ התחייבויות עדכני.
6. בצעו unshield רק כאשר מדיניות הנכס מתירה זאת. `Unshield` חושף את הסכום הציבורי ואת חשבון המקבל, מוציא את ה־nullifier של ה־note הפרטי ויכול ליצור פלטי עודף פרטיים.
7. בצעו ביקורת באמצעות קריאת אירועים חסויים, רשומות הוכחה, מצב nullifier ורשומות נאמנות אנונימית דרך שאילתות בעלות טיפוס ונקודות קצה של Torii.

## CLI דוגמא {#cli-examples}

פקודות ZK ב־CLI מיועדות לניהול ולבדיקת תהליכים. ארנקי ייצור צריכים ליצור התחייבויות, מטענים מוגנים והוכחות באמצעות ספריית ארנק/prover לפני שליחת ההוראות המתקבלות.

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

תבנה מעטפת מטען נתוניםה מוצפנת עם גרסה עבור הערת המסתורית:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

CLI מכין את מדיניות הנכסים, התייחסות למפתחות לאמתים, ומעטפת הערות מוצפנת. הוא אינו חושף פקודות תת של עסקאות `shield` או `unshield`. לבנות הוראות אלה עם SDK ולשלוח אותם כעסקה רגילה מוסמכת חתומה.

קישור ללא מחסום יש את צורת זה:

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

## נאמנות אנונימית לנכסים {#anonymous-asset-escrow}

נאמנות אנונימית לנכסים משתמשת באותו מנגנון העברה מוגן עבור הערך שבנאמנות. הצדדים ומצב הנאמנות עדיין מתועדים ברשומת הנאמנות, אך שלבי המימון, השחרור, הביטול והפתרון משתמשים ב־nullifiers מוגנים ובהתחייבויות פלט.

להתנהגות מפורטת ולדוגמאות של הוראות ISI לנאמנות, ראו [נאמנות מובנית לנכסים](/he/blockchain/escrow.md#anonymous-escrow).

מחזור החיים הוא:

1. `OpenAnonymousAssetEscrow` מוציא notes מוגנים למימון ויוצר התחייבות נאמנות אחת.
2. `AcceptAnonymousAssetEscrow` מתעד את הקונה.
3. `MarkAnonymousEscrowPaymentSent` מתעד שהקונה שלח את התשלום מחוץ לשרשרת.
4. `ReleaseAnonymousAssetEscrow` מוציא את התחייבות הנאמנות אל התחייבויות הפלט של הקונה.
5. `CancelAnonymousAssetEscrow` מוציא את התחייבות הנאמנות בחזרה אל התחייבויות הפלט של המוכר כאשר התשלום לא סומן כנשלח.
6. `OpenAnonymousEscrowDispute` ו־`ResolveAnonymousEscrowDispute` מטפלים בנאמנויות שבמחלוקת באמצעות גיבובי ראיות וחלוקה הנשלטת בידי resolver.

השתמשו בשאילתות הנאמנות האנונימית המפורטות ב[שאילתות](/he/reference/queries.md#escrow-and-proof-records) כדי לבדוק רשומות נאמנות ואת מצבן.

## מתמטיקה {#math}

הסימון להלן מתאר את זרימת הנכס החסוי. מימושים משתמשים במזהי המעגל והפרמטרים הפעילים ‏(IDs) מתוך מדיניות הנכס ומרשם ה־verifier, ולכן על לקוחות להתייחס להתחייבויות, ל־nullifiers ולבתי הוכחה כאל פלטים אטומים של הארנק/prover.

אפשר לתאר note מוגן כך:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

כאשר `owner` נגזר מחומר הצפייה או ההוצאה של המקבל, ו־`rho` הוא האקראיות של ה־note.

התחייבות ה־note היא התחייבות מסתירה:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

במעגלי ההעברה החסויה הנוכחיים, הקלטים הציבוריים כוללים התחייבויות ל־notes, ‏nullifiers, שורש Merkle, תג נכס ותג שרשרת. המעגל אוכף יחס התחייבות מהצורה הבאה:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

כאשר note מוצא, הארנק גוזר nullifier:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` ציבורי. הוא אינו חושף את ה־note, אך הוא יציב עבור אותו note ואותה שרשרת, ולכן Iroha יכול לדחות הוצאה שנייה עם אותו nullifier.

עץ ההתחייבויות מוכיח את קיומו של ה־note. אם ארנק מוציא את ההתחייבות `C_i`, ההוכחה כוללת נתיב Merkle פרטי מ־`C_i` אל שורש ציבורי עדכני:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

בהעברה מוגנת־למוגנת, ההוכחה אוכפת גם שימור ערך:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

בפעולת unshield נכלל הסכום הציבורי:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

אפשר לסכם את ההוכחה שנשלחת כך:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

כאן `public_inputs` הם ההתחייבויות, ה־nullifiers, השורש, תג הנכס, תג השרשרת וכל סכום unshield ציבורי. העד מכיל את סכומי ה־notes, האקראיות, חומר ההוצאה ונתיבי Merkle. ‏Validators מאמתים את ההוכחה ולאחר מכן משנים את מצב ספר החשבונות באמצעות הוספת התחייבויות הפלט וסימון nullifiers של הקלט ככאלה שכבר הוצאו.

## אילו נתונים ציבוריים {#what-is-public}

עסקאות אנונימיות אינן הופכות כל עובדה נצפית לפרטית. הנתונים הבאים עדיין עשויים להיות ציבוריים:

- גיבוב העסקה, גובה הבלוק והסדר
- סמכות העסקה השולחת, אלא אם היישום משתמש בנקודת כניסה פרטית או בדפוס relayer
- הגדרת הנכס שבה נעשה שימוש
- nullifiers והתחייבויות פלט
- גיבובי הוכחות, הפניות למפתח אימות וגיבובי מעטפת אופציונליים
- סכום ציבורי וחשבון המקבל עבור `Unshield`
- המוכר, הקונה, המצב, חותמות הזמן וגיבובי הראיות של נאמנות אנונימית

תכננו יישומים כך שמטא־נתונים ציבוריים אלה לא יחשפו את הקשר העסקי שעליו אתם מנסים להגן.

## חומר עזר קשור {#related-reference}

- [`AssetConfidentialPolicy`](/he/reference/data-model-schema.md)
- [`ConfidentialEvent`](/he/reference/data-model-schema.md)
- [`ProofAttachment`](/he/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/he/reference/data-model-schema.md)
- [שאילתות נאמנות והוכחה](/he/reference/queries.md#escrow-and-proof-records)
