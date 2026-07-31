---
translation_locale: ar
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# المعاملات المجهولة {#anonymous-transactions}

المعاملات المجهولة في Iroha تم بناؤها من أصول سرية
بدلاً من كتابة تحويلات الحساب إلى الحساب العام
المبالغ العامة، محفظة تحرك القيمة إلى دفتر كبير محمي ومن ثم تنفق
ملاحظات غير واضحة مع أدلة على عدم وجود معرفة.

السجل العام لا يزال يسجل أن عملية سرية حدثت.
تسجل الالتزامات والإلغاءات والبيانات الإثباتية، والأحداث، لكنه لا
تسجيل صاحب النقود أو المستلم، أو المبلغ من أجل الحماية إلى الحماية
الحركة. غلاف المعاملات العادية قد يظهر
الحساب، لذلك "مجهول" هنا يعني حركة الأصول المجهولة، وليس تلقائي
عدم الكشف عن هويته على مستوى الشبكة أو الحساب.

## كتلة بناء {#building-blocks}

| المفهوم            | تمثيل الكدوس                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| ملاحظة محمية      | سجل محفظة خاصة تحتوي على أصول، ومبلغ، بيانات المالك، والصدفة.                                   |
| الالتزام         | قيمة عامة من 32 بايت تتعهد بملاحظة دون الكشف عن حقلها.                                        |
| الإبطال          | قيمة عامة 32 بايت مشتقة عند إنفاق الملاحظة. Iroha يرفض الإبطال المتكرر لمنع الانفاق المزدوج. |
| جذور المركل        | جذور حديثة من شجرة الالتزام في الأصول، الأدلة تستخدمها لإظهار وجود النقود المفقودة                        |
| إصدار دليل   | (أ) `ProofAttachment` يحتوي على بايتات إثبات بالإضافة إلى مرجع مفتاح التحقق أو مفتاح التأكد الداخلي.                 |
| حدث سري | حدث في دفتر التسجيل مثل `ConfidentialEvent::Shielded`, `Transferred`, أو `Unshielded`.                              |

التعليمات الرئيسية هي:

- `RegisterZkAsset`: يسجل الأصول على أنها ZK-التمويل القادر والمتعلق
  الدرع، و مفتاح التحقق من غير الدرع.
- `Shield`: يدفع الرصيد العام ويضيف الالتزام بالعملة المحمية
- `ZkTransfer`: تنفق النقود المحمية على الالتزامات الجديدة.
- `Unshield`: تنفق النقود المحمية وتسلم رصيد الحساب العام.
- `ScheduleConfidentialPolicyTransition` و
  `CancelConfidentialPolicyTransition`: تغيير سرية الأصول
  السياسة من خلال الحوكمة.

تعريف الأصول يحمل أيضا
[`AssetConfidentialPolicy`](/ar/reference/data-model-schema.md).
سيطرة وضع السياسة التي تتدفق:

| الوضع              | المعنى                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `TransparentOnly` | يتم قبول الرصيدات العامة العادية والتحويلات فقط.          |
| `Convertible`     | يمكن للمستخدمين تحويل القيمة بين الرصيدات العامة والنقود المحمية. |
| `ShieldedOnly`    | يجب أن تبقى إصدار الأصول ونقلاتها في دفتر الدراسة المحمية.   |

## كيفية استخدامها {#how-to-use-them}

1. تمكين الدعم السري على عقدات التحقق. يجب أن يتفق المحققون على
   المحقق الخلفي، مفاتيح التحقق النشطة، معايير Poseidon/Pedersen
   IDs, وتسجيل القواعد السرية. العقدة ترفض الأقران أو الكتل مع
   إختلافات في الوصف السري.
2. نشر أو تسجيل مفاتيح التحقق ومجموعات المعايير المستخدمة من قبل
   المخططات. يجب على المحافظين والعملاء الإشارة إلى المفاتيح
   `VerifyingKeyId`, مثلاً `halo2/ipa:vk_transfer`.
3. تسجيل الأصول ZK- قادرة على `RegisterZkAsset`, أو مرحلة (أ)
   الانتقال السياسي من `TransparentOnly` إلى `Convertible` أو
   `ShieldedOnly`.
4. حماية الأموال العامة `Shield`. المحفظة تخلق الالتزام المذكرة
   والحمولة المفيدة المشفرة للمستلم قبل أن يقدم
   المعاملة
5. النقل الخاص مع `ZkTransfer`. المحفظة تبني دليلاً على أنه
   يمتلك مذكرات المدخل، وأن قيم الدخول والخروج تتوازن،
   كل مذكرة نفذت مقيدة في شجرة التزام حديثة.
6. إزالة الحماية فقط عندما تسمح سياسة الأصول بذلك. `Unshield` يكشف عن
   المبلغ العام وحساب المستفيد ، ينفق إبطال النقود الخاصة ،
   ويمكن أن تخلق نتائج التغيير الخاصة.
7. مراجعة من خلال قراءة الأحداث السرية، سجلات الأدلة، وضع الإبطال،
   وتسجيلات الاحتفاظ بالشرف المجهول من خلال استفسارات مدونة Torii النقاط النهائية

## CLI أمثلة {#cli-examples}

(الـ) ZK CLI تستهدف الأوامر التشغيلية وتجارب التدفقات.
المحفظات يجب أن تولد الالتزامات، والحمولة المفيدة المشفرة، والدليل مع
محفظة/مكتبة المحاسبات قبل تقديم التعليمات الناتجة.

تسجيل الهجين ZK- الأصول القابلة للتمويل:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

قم بإنشاء غطاء محفوف بالشحنة المشفوحة للخطاب المحمي:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

الحماية من الأموال العامة في دفتر الأصول المحمي:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

غير محصنة مع ملصق دليل JSON:

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

## SDK مثال {#sdk-example}

البيانات الدقيقة من دليل تأتي من إثبات تشكيل الخلفية.
الحملة المفيدة للمعاملات تحتاج فقط إلى المدخلات العامة ورابط الإثبات:

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

## الاحتفاظ بالأصول المجهولة {#anonymous-asset-escrow}

الاحتفاظ بالأصول المجهولة مجهولة تستخدم نفس آلة التحويل المحمية
قيمة الاحتفاظ. لا تزال الأطراف وحالة الاحتفاض مسجلة
سجل الاحتفاظ، ولكن أسفل التمويل والإفراج والإلغاء والتصدي
استخدام محطات الإبطال المحمية والتزامات الخروج.

للاستثمار التفصيلي ISI السلوك والمثلة، انظر
[الاحتفاظ بالأصول الأصلية](/ar/blockchain/escrow.md#anonymous-escrow).

دورة الحياة هي:

1. `OpenAnonymousAssetEscrow` ينفق أوراق تمويل محمية و يخلق واحدة
   الالتزام بالضمانية
2. `AcceptAnonymousAssetEscrow` سجل المشتري
3. `MarkAnonymousEscrowPaymentSent` سجلات أن المشتري أرسل الدفع
   خارج السلسلة
4. `ReleaseAnonymousAssetEscrow` ينفق الالتزام بالضمان على المشتري
   التزامات الإنتاج.
5. `CancelAnonymousAssetEscrow` ينفق الالتزام بالضمانية مرة أخرى إلى البائع
   التزامات الإنتاج عندما لا يتم وضع علامة على الدفع.
6. `OpenAnonymousEscrowDispute` و `ResolveAnonymousEscrowDispute` المُسَلِم
   الاحتياطيات المتنازع عليها مع الأدلة و التقسيم الذي يسيطر عليه القرار

استخدم استفسارات الاحتفاظ المجهولة المدرجة في
[الأسئلة](/ar/reference/queries.md#escrow-and-proof-records) للتفتيش على الاحتفاظ
السجلات والحالة.

## الرياضيات {#math}

يصف الملاحظة أدناه تدفق الأصول السرية.
استخدم الدائرة النشطة والبرامج IDs من سياسة الأصول والمحقق
السجل، لذلك يجب على العملاء معالجة الالتزامات، الإبطالات، وبايت دليل
كمخرجات غير مرئية من المحفظة/المكافأة.

يمكن وصف مذكرة محمية على أنها:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

حيث `owner` يتم استنباطها من مواد المُستقبل يشاهدها أو ينفقها، و
`rho` هو ملاحظة العشوائية

الالتزام بالخطاب هو التزام مخفي:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

بالنسبة لدورات النقل السرية الحالية، فإن المدخلات العامة تشمل
ملاحظات الالتزامات، الإبطالات، جذور ميركل، علامة الأصول، و علامة سلسلة.
تتفرض الدائرة علاقة الالتزام بهذا الشكل:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

عندما يتم إنفاق مذكرة، فإن المحفظة تحصل على إبطال:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` هو عام، لا يكشف عن الملاحظة، لكنه ثابت لهذا الملاحظة
والسلسلة، لذلك Iroha يمكن أن ترفض الإنفاق الثاني مع نفس الإبطال.

شجرة الالتزام تثبت وجود الملاحظات
`C_i`, الدليل يتضمن مسار ميركل الخاص من `C_i` إلى تقرير حديث
الجذر العام:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

بالنسبة لتحويل محصن إلى محصن، فإن الدليل يفرض أيضا قيمة
الحفاظ عليه:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

بالنسبة لخفض الحماية، يتم تضمين المبلغ العام:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

يمكن تلخيص الدليل المقدم على النحو التالي:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

حيث `public_inputs` هي الالتزامات، الإبطالات، الجذر، علامة الأصول،
علامة السلسلة، وأي مبلغ عام غير محمي.
المبالغ، العشوائية، مادة الإنفاق، وطرق ميركل.
إثبات ثم تغيير حالة دفتر التسجيل عن طريق إضافة الالتزامات المصدرة
علامة إدخال الإبطال كإنفاق.

## ما هو عام {#what-is-public}

المعاملات المجهولة لا تجعل كل الحقائق المرئية خصوصية
البيانات التالية لا تزال يمكن أن تكون عامة:

- hash المعاملة، ارتفاع الكتلة، والطلب
- سلطة المعاملات المقدمة ما لم تستخدم الطلب
  النمط الخاص في نقطة الدخول أو المستوطن
- تعريف الأصول المستخدمة
- الجهات الإلغاء والتزامات الإنتاج
- أشرطة إثبات، وإشارات مفتاح التحقق، وأشرطة غلاف اختياري
- المبلغ العام وحساب المستفيدين `Unshield`
- البائع المحتفظة المجهول، والمشتري، والحالة، والخوابات الزمنية، والدليل

تصميم التطبيقات بحيث هذه البيانات المعدنية العامة لا تكشف عن الأعمال التجارية
علاقة تحاول حمايتها

## الإشارة ذات الصلة {#related-reference}

- [`AssetConfidentialPolicy`](/ar/reference/data-model-schema.md)
- [`ConfidentialEvent`](/ar/reference/data-model-schema.md)
- [`ProofAttachment`](/ar/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/ar/reference/data-model-schema.md)
- [استفسارات الاحتفاظ والدليل](/ar/reference/queries.md#escrow-and-proof-records)
