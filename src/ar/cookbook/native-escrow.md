---
translation_locale: ar
translation_source: /cookbook/native-escrow.md
translation_source_hash: 576e03924f19b63681cdfafa641b996672e35a992478fc9eaf5b83f0e7baa6da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ضمان الأصل الأصلي {#native-asset-escrow}

## نتيجة {#outcome}

اختر بين حساب ضمان السوق أو قفل الأصول الموجهة إلى الوجهة، ونفذ دورة الحياة المكتوبة الحالية باستخدام Rust أو Python، واربط كل محاولة قفل بالمبلغ المتبقي الذي لاحظته بالفعل، وجمّع واجهة حساب الضمان الأصلية Kotodama من JavaScript.

## المتطلبات الأساسية {#prerequisites}

- تعريف أصل رقمي ومفتاح/بائع يمتلك كمية كافية.
- تمويل العملاء ذوي المفتاح الواحد I105 لكل طرف يقدم خطوة. استخدم نية مباشرة مدفوعة بواسطة حساب توقيع المعاملة `fee_payment` الذي تتطابق فيه عملة الرسوم مع استجابة خدمة تمويل شبكة الاختبار الحالية Taira؛ لا تقم بتضمين معرف أصل من الوثائق.
- الـ Rust أو Python الحالي SDK من Iroha بروتوكول الانتهاء `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- بالنسبة لمثال المترجم JavaScript، Node.js 24 بالإضافة إلى حزمة `@iroha/iroha-js` المدمجة في بيئة التطوير المحلية و `iroha_js_host` الأصلية الخاصة بها؛ اتبع [JavaScript SDK إعداد بناء المصدر](/ar/guide/tutorials/javascript.md#build-from-source). يجب أن توفر بناءات المتصفح `compilerUrl` بدلاً من تحميل المضيف الأصلي.
- Taira يجب قبول تعليمات نقل الأصول والحساب الضمان. يمكن لمالكي الأصول استخدام دورة الحياة العادية عندما تسمح سياسة الأصول الخاصة بهم بذلك؛ حل يتطلب النزاع إذن `CanResolveEscrowDispute` العالمي. استخدم شبكة محلية مُولَّدة عندما يكون المبدأ المصرح به لشبكة البلوك تشين العامة المطلوبة غائبًا.

نماذج الضمان في السوق تشمل البائع والمشتري والدفع خارج السلسلة والإفراج. الأقفال العامة تسمي وجهة ولديها خيار تفويض إفراج منفصل؛ وهي تدعم السحب الجزئي والإلغاء والانتهاء.

## خطوات {#steps}

### 1. أكمل الاحتجاز في السوق مع Rust {#_1-complete-a-marketplace-escrow-with-rust}

تستقبل هذه الوظيفة معرفات حقيقية مكتوبة ونُقّالين. تفتح 40 وحدة، وتسمح للمشتري بالموافقة وتسجيل الدفع خارج السلسلة، ثم تسمح للبائع بإطلاق الحجز. كل عملية تقديم تسمي دافع رسوم السلطة المخوّلة من خلال `FeePaymentIntent`.

```rust
use eyre::{Result, ensure};
use iroha::{
    client::Client,
    data_model::{
        isi::escrow::{
            AcceptAssetEscrow, MarkEscrowPaymentSent, OpenAssetEscrow,
            ReleaseAssetEscrow,
        },
        prelude::*,
        transaction::FeePaymentIntent,
    },
};
use iroha_crypto::Hash;

fn complete_marketplace_escrow(
    seller: &Client,
    buyer: &Client,
    escrow_id: EscrowId,
    asset_definition: AssetDefinitionId,
) -> Result<AssetEscrowRecord> {
    let fee = FeePaymentIntent::authority(Vec::new(), None);

    seller.submit_blocking(
        OpenAssetEscrow::with_evidence_hashes(
            escrow_id,
            asset_definition,
            Quantity::from(40_u64),
            vec![Hash::new("cookbook-fiat-invoice")],
        ),
        fee.clone(),
    )?;
    buyer.submit_blocking(AcceptAssetEscrow::new(escrow_id), fee.clone())?;
    buyer.submit_blocking(MarkEscrowPaymentSent::new(escrow_id), fee.clone())?;
    seller.submit_blocking(ReleaseAssetEscrow::new(escrow_id), fee)?;

    let record = seller.query_single(FindAssetEscrowById::new(escrow_id))?;
    ensure!(record.status == AssetEscrowStatus::Released);
    Ok(record)
}
```

يتم إدارة حساب الحضانة بواسطة دفتر الأستاذ الخاص بالبلوكشين. منح رمز نقل الأصول العادي لا يجعل الحضانة النشطة قابلة للصرف خارج دورة حياة الضمانة.

### 2. افتح وارسم جزئياً قفلًا عامًا باستخدام Python {#_2-open-and-partially-draw-a-generic-lock-with-python}

يستعلم مسؤول تفويض الإصدار عن السجل الأصلي الموقع قبل السحب. إن تمرير ذلك `remaining_amount` بالضبط يوفر تنافسية تفاؤلية: يتم رفض الطلب المتزامن القديم بدلاً من خصم الحضانة مرتين.

```python
import secrets
import time
from decimal import Decimal


def escrow_status(record):
    status = record["status"]
    if isinstance(status, dict):
        return status.get("status", status.get("kind"))
    return str(status)


def open_and_draw_lock(
    *,
    client,
    chain_id,
    opener,
    opener_private_key,
    release_authority,
    release_private_key,
    destination,
    asset_definition_id,
    fee_payment,
):
    escrow_id = f"cookbook_lock_{secrets.token_hex(12)}"

    client.open_asset_lock_and_wait(
        chain_id=chain_id,
        authority=opener,
        private_key=opener_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        asset_definition_id=asset_definition_id,
        destination=destination,
        amount="10",
        release_authority=release_authority,
        expires_at_ms=int(time.time() * 1000) + 3_600_000,
        wait=True,
    )

    before = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        private_key=release_private_key,
    )
    client.drawdown_asset_lock_and_wait(
        chain_id=chain_id,
        authority=release_authority,
        private_key=release_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        amount="4",
        expected_remaining_amount=before["remaining_amount"],
        wait=True,
    )
    after = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        private_key=release_private_key,
    )

    assert escrow_status(before) == "Locked"
    assert Decimal(str(before["remaining_amount"])) == Decimal("10")
    assert escrow_status(after) == "Locked"
    assert Decimal(str(after["remaining_amount"])) == Decimal("6")
    return escrow_id, after
```

يمكن لـ Python SDK الاستعلام تلقائيًا عند حذف `expected_remaining_amount`، لكن تمرير القيمة المرصودة يجعل الشرط الاقتصادي الموقع مرئيًا في كود التطبيق.

بالنسبة لتدفقات القفل Rust، تتطلب البنيات الحالية أيضًا المبلغ الملاحظ:

```rust
let before = opener.query_single(FindAssetEscrowById::new(lock_id))?;
release_authority.submit_blocking(
    DrawdownAssetLock::new(
        lock_id,
        Quantity::from(4_u64),
        before.remaining_amount,
    ),
    FeePaymentIntent::authority(Vec::new(), None),
)?;

let current = opener.query_single(FindAssetEscrowById::new(lock_id))?;
opener.submit_blocking(
    CancelAssetLock::new(lock_id, current.remaining_amount),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

`DrawdownAssetLock::new` يأخذ ثلاث قيم؛ `CancelAssetLock::new` يأخذ قيمتين. حذف المبلغ المتبقي المتوقع يصف شكل استدعاء تقني قديم وغير آمن.

### 3. تجميع سطح الضمان Kotodama من JavaScript {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript لا يحتاج إلى اختراع تعليمات أصلية غير نوعية. المجمع الحالي يتيح الوصول إلى البنية التحتية لسجل سلسلة الكتل الموثوقة لـ Kotodama؛ ثم تتبع عمليات النشر والاستدعاءات التقنية [بناء ونشر عقد ذكي](./smart-contracts.md).

احفظ هذا باسم `native_escrow.ko`:

```kotodama
seiyaku NativeEscrowAitai {
    error enum EscrowError {
        NonPositiveAmount = 1,
    }

    kotoage fn open_offer(
        Name offer,
        AssetDefinitionId asset_definition,
        quantity amount
    ) authorize("Admin") {
        require(amount > 0, EscrowError::NonPositiveAmount);
        ledger::escrow::open_offer(
            offer: offer,
            asset_definition: asset_definition,
            amount: amount,
        );
    }
}
```

احفظ ما يلي كـ `compile-native-escrow.mjs` واستخدمه لتجميع هذا المصدر بالضبط من Node.js:

```js
import { readFile } from 'node:fs/promises'
import { compileKotodamaProgram } from '@iroha/iroha-js/kotodama-compiler'

const source = await readFile('./native_escrow.ko', 'utf8')

const result = await compileKotodamaProgram(source, {
  sourceName: 'native_escrow.ko',
})
if (!result.ok) {
  throw new Error(JSON.stringify(result.diagnostics, null, 2))
}
console.log({
  codeHashHex: result.output.codeHashHex,
  entrypoints: result.output.manifest.entrypoints.map(({ name }) => name),
})
```

قم بتشغيله من بيئة الحزمة المبنية من المصدر الموضحة في المتطلبات المسبقة:

```bash
node ./compile-native-escrow.mjs
```

## تحقق {#verify}

لضمان السوق، استعلم عن `FindAssetEscrowById` وحيازات الأصول للطرفين بعد الإصدار. يجب أن يكون السجل `Released`، واذكر اسم المشتري الموافق، وأظهر عدم وجود وصاية متبقية. بالنسبة للقفل Python أعلاه، احتفظ بالمعرّف المعاد وكرر الاستعلام الموقع:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

تحقق أيضًا من حيازة الأصول للوجهة وتأكد من أنها زادت بأربع وحدات. سجل نتيجة بروتوكول المعاملة بدون سجل الضمان وحالة الوجهة بعد المعاملة هو تحقق غير مكتمل.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- `Not permitted` عند الفتح عادة ما يعني أن المفوض لا يستطيع نقل الأصل المحدد إلى الحفظة. تسوية النزاعات لها بوابة `CanResolveEscrowDispute` عالمية منفصلة.
- `expected remaining amount` الرفض هو صراع تفاؤلي-التزامن. أعد استعلام السجل، وقرّر ما إذا كانت عملية السحب/الإلغاء الأخرى مقصودة، ووقّع تعليمات جديدة فقط إذا كانت الحالة الجديدة مقبولة.
- فقط المبدأ المخول بإصدار التفويض يمكنه سحب القفل الموثوق. لا يمكن للوجهة تحريره لمجرد أنها ستستلم الأموال.
- إصدار السوق صالح فقط بعد حالة القبول وإرسال الدفع؛ الإلغاء يقتصر على حالات دورة الحياة السابقة.
- تنتهي الصلاحية باستخدام وقت دفتر الأستاذ البلوكشين الموثوق. لا تعتَبِر انتهاء مهلة ساعة النظام المحلية دليلًا على أن `ExpireAssetLock` سوف يمر.
- فشل الرسوم يخص الطرف الذي يقدم خطوة دورة الحياة تلك. الممول، المشتري، البائع/المفتتح، وصاحب تفويض الإفراج بشكل مستقل على Taira.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [نموذج تعليمات الضمان الأصلي في نسخة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [اختبارات تكامل الضمان الأصلية عند مراجعة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python طرق عميل الضمان عند نسخة الكود المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama نموذج الضمان الأصلي عند نسخة الكود المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [حساب ضمان للأصل الأصلي](/ar/blockchain/escrow.md)
- [الأصول القابلة للاستبدال](./fungible-assets.md)
- [الأذونات والأدوار](./permissions-and-roles.md)
