---
translation_locale: ar
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# المعاملات المجهولة {#anonymous-transactions}

يتم بناء المعاملات المجهولة في Iroha من عمليات الأصول السرية. بدلاً من كتابة التحويلات بين الحسابات العامة مع الأموال العامة ، تقوم المحفظة بنقل القيمة إلى دفتر كبير محمي ومن ثم تنفق ملاحظات غير شفافة مع أدلة على عدم وجود معرفة صفر.

لا يزال دفتر الرسوم العام يسجل أن عملية سرية حدثت. إنه يسجل الالتزامات والإلغاءات والتحققات، والأحداث ، لكنه لا يسجل مالك المذكرة أو المستلم ، أو مبلغ حركة محمية إلى محمية. لا يزال غلاف المعاملات العادي قد يكشف عن الحساب المقدم، لذلك "المجهول" هنا يعني حركة الأصول المجهولة، وليس الهوية الآلية على مستوى الشبكة أو المستوى الحسابي.

## كتلة بناء {#building-blocks}

|المفهوم|تمثيل الكتيبات |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|ملاحظة محمية|سجل محفظة خاصة تحتوي على أصول، مبلغ، بيانات المالك، والصدفة. |
|الالتزام|قيمة عامة 32 بايت تلتزم بملاحظة دون الكشف عن حقلها. |
|إبطال |قيمة عامة من 32 بايت مشتقة عندما يتم إنفاق مذكرة. Iroha يرفض الإبطال المتكرر لمنع الانفاق المزدوج .|
|جذور ميركل |جذور حديثة من شجرة الالتزام في الأصول. الأدلة تستخدمها لإظهار وجود النقود المصروفة|
|إصدار دليل |`ProofAttachment` يحتوي على بايتات إثبات بالإضافة إلى مرجع مفتاح التحقق أو مفتاح التأكيد الداخلي. |
|حدث سري|حدث في دفتر التسجيل مثل `ConfidentialEvent::Shielded`، `Transferred`، أو `Unshielded`. |

التعليمات الرئيسية هي:

- `RegisterZkAsset`: يسجل الأصول باعتبارها قادرة على ZK، ويربط مفاتيح التحقق من النقل والحماية وعدم الحماية.
- `Shield`: يدفع الرصيد العام ويضيف الالتزام بقيمة محمية.
- `ZkTransfer`: ينفق النقود المحمية على الالتزامات الجديدة بالنقود.
- `Unshield`: ينفق النقود المحمية ويعطي إئتمانات على رصيد حساب عام.
- `ScheduleConfidentialPolicyTransition` و `CancelConfidentialPolicyTransition`: تغيير سياسة السرية في الأصول من خلال الحوكمة.

يحتوي تعريف الأصول أيضًا على [`AssetConfidentialPolicy`](/ar/reference/data-model-schema.md).

|الوضع|المعنى|
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly` |لا تقبل سوى الرصيد العام العادي والتحويلات. |
|`Convertible` |يمكن للمستخدمين تحريك القيمة بين الرصيدات العامة والملاحظات المحمية. |
|`ShieldedOnly` |يجب أن تبقى إصدار الأصول ونقلاتها في دفتر الدراسة المحمية. |

## كيفية استخدامها {#how-to-use-them}

1. تمكين الدعم السري على عقدات التحقق. يجب أن يوافق المحققون على الخلفية المؤكدة ومفاتيح التحقق النشطة ومعلم Poseidon/Pedersen IDs ونسخة القواعد السرية. ترفض العقدات الأقران أو الكتل التي لا تتناسب مع إضافة ميزات السرية.
2. نشر أو تسجيل مفاتيح التحقق ومجموعات المعايير المستخدمة من قبل الدوائر. يجب على المحافظ والمشغليين الإشارة إلى مفاتيح في `VerifyingKeyId` ، على سبيل المثال `halo2/ipa:vk_transfer`.
3. سجل الأصل باعتباره ZK قابلاً للاستثمار مع `RegisterZkAsset` ، أو قم بنقل سياسة من `TransparentOnly` إلى `Convertible` أو `ShieldedOnly`.
4. الحماية من الأموال العامة مع `Shield`. يقوم المحفظة بإنشاء الالتزام بالمذكرات والحمولة المفيدة المشفرة للمستلم قبل تقديم المعاملة.
5. النقل بشكل خاص مع `ZkTransfer`. يقوم المحفظة ببناء دليل على أنها تمتلك ملاحظات المدخلات، وأن قيم الدخول والإخراج تتوازن، وأن كل ملاحظة نفقت مقيدة في شجرة التزام حديثة.
6. لا يتم إلغاء الحماية إلا عندما تسمح سياسة الأصول بذلك. `Unshield` يكشف عن المبلغ العام وحساب المستفيد ، وينفق إبطال النقود الخاصة ، ويمكن أن يخلق نتائج التغييرات الخاصة.
7. المراجعة من خلال قراءة الأحداث السرية، سجلات الأدلة، حالة الإبطال، وسجلات الاحتفاظ بالأمانة المجهولة عن طريق الاستفسارات المطبوعة و Torii نقاط النهاية.

## CLI مثال {#cli-examples}

تستهدف الأوامر ZK CLI لتدفقات المشغل واختبارها. يجب أن تولد محفظات الإنتاج التزامات، والحمولات المفيدة المشفرة، والدليلات مع مكتبة محفظة/معتبر قبل تقديم التعليمات الناتجة.

تسجيل الأصول المختلفة ZK:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

قم ببناء تغطية محفوفة بالشحنة المشفرة للخطاب المحمي:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

الحماية من الأموال العامة في سجل الأصول المحمي:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

إنقطاع الحاجز مع إصدار ثابت JSON:

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

تأتي البايتات الدقيقة للدليل من الخلفية المؤكدة التي تم تشكيلها. يحتاج حمولة المعاملة فقط إلى المدخلات العامة ورابط الإثبات:

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

تستخدم الاحتفاظ بالأصول المجهولة نفس الآلة التحويلية المحمية للقيمة المحمية. لا يزال يتم تسجيل الأطراف وحالة الاحتفال في سجل الاحتفاض، ولكن أقدام التمويل والإفراج والإلغاء والتصدي تستخدم محميات الإبطال والتزامات الخروج.

للحصول على تفاصيل عن سلوك الاحتفاظ ISI ومثلة، انظر [ الأصول الأصلية الاحتفاض ](/ar/blockchain/escrow.md#anonymous-escrow).

دورة الحياة هي:

1. `OpenAnonymousAssetEscrow` تنفق أوراق تمويل محمية وخلق تعهد واحد في الاحتفاظ بها.
2. `AcceptAnonymousAssetEscrow` تسجل المشتري.
3. `MarkAnonymousEscrowPaymentSent` سجل أن المشتري أرسل الدفع خارج سلسلة.
4. `ReleaseAnonymousAssetEscrow` تنفق الالتزامات الاحتفاظ بها على التزامات المشترين.
5. `CancelAnonymousAssetEscrow` ينفق الالتزامات الاحتفاظ بها مرة أخرى على التزامات الناتج من البائع عندما لا يتم وضع علامة على الدفع.
6. `OpenAnonymousEscrowDispute` و `ResolveAnonymousEscrowDispute` يتعاملون مع الاحتياطيات المتنازع عليها مع حشيشات الأدلة وتقسيم يتم التحكم فيه من قبل القرار

استخدم استفسارات الاحتفاظ بالأمانة المجهولة المدرجة في [ استفسارات ](/ar/reference/queries.md#escrow-and-proof-records) للتفتيش على سجلات الأمانة والحالة.

## الرياضيات {#math}

يصف الملاحظة أدناه تدفق الأصول السرية. تستخدم التنفيذات الدائرة النشطة والبرامج IDs من سياسة الأصول ومسجل المؤكد ، لذلك يجب على العملاء التعامل مع الالتزامات والإبطالات وبايتات الدليل كخروجيات غير شفافة من المحفظة / البيانات.

يمكن وصف المذكرة المحمية على النحو:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

حيث يتم استنباط `owner` من المواد التي يشاهدها المستلم أو ينفقها، و `rho` هو ملاحظة عشوائية.

الالتزام بالذكرة هو التزام مخفي

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

بالنسبة لدورات النقل السرية الحالية ، تتضمن المدخلات العامة التزامات الملاحظات ، والإبطالات ، وجذر Merkle ، ومدفع الأصول ، ومدفوع سلسلة. تفرض الدوائر علاقة الالتزام بهذا الشكل:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

عندما يتم إنفاق مذكرة، فإن المحفظة تحصل على إبطال:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` عامة. لا تكشف عن النقود، ولكنها مستقرة لهذا النقود والسلسلة، لذلك يمكن لـ Iroha رفض إنفاق ثاني مع نفس المصدر.

شجرة الالتزام تثبت وجود ملاحظة. إذا كانت محفظة تنفق الالتزام `C_i` ، فإن الدليل يتضمن مسار Merkle الخاص من `C_i` إلى جذور عامة حديثة:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

بالنسبة لنقل محصن إلى محصن، فإن البرهان يفرض أيضاً الحفاظ على القيمة:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

بالنسبة لمبلغ غير محمي، يتم تضمين المبلغ العام:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

يمكن تلخيص الدليل المقدم على النحو التالي:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

حيث `public_inputs` هي الالتزامات والإبطالات، الجذر، علامة الأصول، علامة السلسلة، وأي مبلغ غير مدفوع للجمهور. يحتوي الشاهد على مبالغ النقود، والتصوير العشوائي، ومواد الإنفاق، وطرق Merkle. يقوم المحققون بالتحقق من الدليل ومن ثم يتغيرون حالة دفتر التسجيل عن طريق إضافة الالتزامات المصدرة وتعلامف محطات الإدخال على أنها قد نفذت.

## ما هو عام {#what-is-public}

لا تجعل المعاملات المجهولة كل الحقائق المرئية خصوصية. يمكن أن تكون البيانات التالية عامة:

- hash المعاملة، ارتفاع الكتل، والطلب
- سلطة المعاملات المقدمة ما لم تستخدم الطلب نقطة دخول خاصة أو نمط مستوى ثانوي.
- تعريف الأصول المستخدمة
- الإبطال والالتزامات المصدرة
- الهاشات الإثباتية، وإشارات مفتاح التحقق، والهاشات الخيارية في الغلاف
- المبلغ العام وحساب المستفيد عن `Unshield`
- البائع المحتفظة المجهول، والمشتري، والحالة، والخوابات الزمنية، والأدلة.

تصميم التطبيقات بحيث هذه البيانات العامة لا تكشف عن العلاقة التجارية التي تحاول حمايتها.

## الإشارة ذات الصلة {#related-reference}

- [`AssetConfidentialPolicy`](/ar/reference/data-model-schema.md)
- [`ConfidentialEvent`](/ar/reference/data-model-schema.md)
- [`ProofAttachment`](/ar/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/ar/reference/data-model-schema.md)
- [استفسارات الاحتفاظ والدليل ](/ar/reference/queries.md#escrow-and-proof-records)
