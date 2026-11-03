---
translation_locale: ar
translation_source: /cookbook/native-escrow.md
translation_source_hash: d399284a2baec507e4c979c762d6e216d8c3fbc5b4b4fe221b6bbb0049ee9fd9
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# ضمان الأصل الأصلي {#native-asset-escrow}

## نتيجة {#outcome}

اختر بين حساب ضمان السوق أو قفل الأصول الموجهة إلى الوجهة، ونفذ دورة الحياة المكتوبة الحالية باستخدام Rust أو Python، واربط كل محاولة قفل بالمبلغ المتبقي الذي لاحظته بالفعل، وجمّع واجهة حساب الضمان الأصلية Kotodama من JavaScript.

## المتطلبات الأساسية {#prerequisites}

- تعريف أصل رقمي ومفتاح/بائع يمتلك كمية كافية.
- عملاء I105 ممولون وذوو مفتاح واحد لكل طرف يقدم خطوة. استخدم نية `fee_payment` مباشرة مدفوعة بواسطة حساب توقيع المعاملة، يتطابق أصل الرسوم فيها مع الأصل الذي تنشره سياسة خدمة تمويل الشبكة التجريبية الحالية في Taira؛ لا تقم بتضمين معرف أصل من الوثائق.
- الـ Rust أو Python الحالي SDK من Iroha بروتوكول الانتهاء `c8c872461e92f04325c350cdd952f4276e96f9dc`.
- بالنسبة لمثال المترجم JavaScript، Node.js 24 بالإضافة إلى حزمة `@iroha/iroha-js` المدمجة في بيئة التطوير المحلية و `iroha_js_host` الأصلية الخاصة بها؛ اتبع [JavaScript SDK إعداد بناء المصدر](/ar/guide/tutorials/javascript.md#build-from-source). يجب أن توفر بناءات المتصفح `compilerUrl` بدلاً من تحميل المضيف الأصلي.
- Taira يجب قبول تعليمات نقل الأصول والحساب الضمان. يمكن لمالكي الأصول استخدام دورة الحياة العادية عندما تسمح سياسة الأصول الخاصة بهم بذلك؛ حل يتطلب النزاع إذن `CanResolveEscrowDispute` العالمي. استخدم شبكة محلية مُولَّدة عندما يكون المبدأ المصرح به لشبكة البلوك تشين العامة المطلوبة غائبًا.

نماذج الضمان في السوق تشمل البائع والمشتري والدفع خارج السلسلة والإفراج. الأقفال العامة تسمي وجهة ولديها خيار تفويض إفراج منفصل؛ وهي تدعم السحب الجزئي والإلغاء والانتهاء.

## خطوات {#steps}

### 1. أكمل الاحتجاز في السوق مع Rust {#_1-complete-a-marketplace-escrow-with-rust}

تستقبل هذه الوظيفة معرفات حقيقية مكتوبة ونُقّالين. تفتح 40 وحدة، وتسمح للمشتري بالموافقة وتسجيل الدفع خارج السلسلة، ثم تسمح للبائع بإطلاق الحجز. كل عملية تقديم تسمي دافع رسوم السلطة المخوّلة من خلال `FeePaymentIntent`.

```rust
use eyre::{Result, ensure};
use iroha::{
    blocking::Client,
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

    seller.submit(
        OpenAssetEscrow::with_evidence_hashes(
            escrow_id,
            asset_definition,
            Quantity::from(40_u64),
            vec![Hash::new("cookbook-fiat-invoice")],
        ),
        fee.clone(),
    )?;
    buyer.submit(AcceptAssetEscrow::new(escrow_id), fee.clone())?;
    buyer.submit(MarkEscrowPaymentSent::new(escrow_id), fee.clone())?;
    seller.submit(ReleaseAssetEscrow::new(escrow_id), fee)?;

    let record = seller
        .client()
        .query_single(FindAssetEscrowById::new(escrow_id))?;
    ensure!(record.status == AssetEscrowStatus::Released);
    Ok(record)
}
```

يتم إدارة حساب الحضانة بواسطة دفتر الأستاذ الخاص بالبلوكشين. منح رمز نقل الأصول العادي لا يجعل الحضانة النشطة قابلة للصرف خارج دورة حياة الضمانة.

### 2. افتح وارسم جزئياً قفلًا عامًا باستخدام Python {#_2-open-and-partially-draw-a-generic-lock-with-python}

يستعلم مسؤول تفويض الإصدار عن السجل الأصلي الموقع قبل السحب. إن تمرير ذلك `remaining_amount` بالضبط يوفر تحكمًا تفاؤليًا في التزامن: يتم رفض الطلب المتوازي القديم بدلاً من خصم الحضانة مرتين. `client` هو `ToriiClient` مُنشأ باستخدام `local_signing_context=LocalSigningContext(network_id)` و`chain_discriminant` الخاص بالشبكة؛ تأخذ أدوات المعاملات المساعدة هوية الشبكة من ذلك السياق، وتأخذها الاستعلامات الموقعة بصفتها `network_id`.

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
    opener,
    opener_private_key,
    release_authority,
    release_private_key,
    destination,
    asset_definition_id,
    fee_payment,
):
    escrow_id = f"cookbook_lock_{secrets.token_hex(12)}"
    network_id = client.local_signing_context.network_id

    client.open_asset_lock_and_wait(
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
        network_id=network_id,
        private_key=release_private_key,
    )
    client.drawdown_asset_lock_and_wait(
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
        network_id=network_id,
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
let before = opener
    .client()
    .query_single(FindAssetEscrowById::new(lock_id))?;
release_authority.submit(
    DrawdownAssetLock::new(
        lock_id,
        Quantity::from(4_u64),
        before.remaining_amount,
    ),
    FeePaymentIntent::authority(Vec::new(), None),
)?;

let current = opener
    .client()
    .query_single(FindAssetEscrowById::new(lock_id))?;
opener.submit(
    CancelAssetLock::new(lock_id, current.remaining_amount),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

`DrawdownAssetLock::new` يأخذ القفل والمبلغ والمبلغ المتبقي المرصود؛ `CancelAssetLock::new` يأخذ القفل والمبلغ المتبقي المرصود. يرفض دفتر الأستاذ أيًّا من التعليمتين إذا تغيّر المبلغ المتبقي أولًا.

### 3. تجميع سطح الضمان Kotodama من JavaScript {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript لا يحتاج إلى اختراع تعليمات أصلية غير محددة النوع. يتيح المترجم الحالي لـ Kotodama الدوال المدمجة لضمان دفتر الأستاذ؛ ثم يتبع النشر [بناء ونشر عقد ذكي](./smart-contracts.md). نقطة الدخول `open_offer` هي `authorize(Admin)`، لذا يشترط المُنفِّذ أن يحمل مستدعيها الإذن `CanUseContractPermission` للعنوان المنشور و`permission: "Admin"`.

احفظ هذا باسم `native_escrow.ko`:

```kotodama
seiyaku NativeEscrowAitai {
    permission Admin;
    error enum EscrowError {
        NonPositiveAmount = 1,
    }

    kotoage fn open_offer(
        Name offer,
        AssetDefinitionId asset_definition,
        quantity amount
    ) authorize(Admin) {
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
    network_id=client.local_signing_context.network_id,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

تحقق أيضًا من حيازة الأصول للوجهة وتأكد من أنها زادت بأربع وحدات. سجل نتيجة بروتوكول المعاملة بدون سجل الضمان وحالة الوجهة بعد المعاملة هو تحقق غير مكتمل.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- `Not permitted` عند الفتح عادة ما يعني أن المفوض لا يستطيع نقل الأصل المحدد إلى الحفظة. تسوية النزاعات لها بوابة `CanResolveEscrowDispute` عالمية منفصلة.
- الخطأ `asset lock remaining amount changed since the drawdown was prepared` (أو `...since the cancellation was prepared`) هو تعارض في التزامن التفاؤلي. أعد استعلام السجل، وقرّر ما إذا كانت عملية السحب/الإلغاء الأخرى مقصودة، ووقّع تعليمات جديدة فقط إذا كانت الحالة الجديدة مقبولة.
- فقط المبدأ المخول بإصدار التفويض يمكنه سحب القفل الموثوق. لا يمكن للوجهة تحريره لمجرد أنها ستستلم الأموال.
- إصدار السوق صالح فقط بعد حالة القبول وإرسال الدفع؛ الإلغاء يقتصر على حالات دورة الحياة السابقة.
- تنتهي الصلاحية باستخدام وقت دفتر الأستاذ البلوكشين الموثوق. لا تعتَبِر انتهاء مهلة ساعة النظام المحلية دليلًا على أن `ExpireAssetLock` سوف يمر.
- فشل الرسوم يخص الطرف الذي يقدم خطوة دورة الحياة تلك. الممول، المشتري، البائع/المفتتح، وصاحب تفويض الإفراج بشكل مستقل على Taira.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [نموذج تعليمات الضمان الأصلي في نسخة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/isi/escrow.rs)
- [اختبارات تكامل الضمان الأصلية عند مراجعة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/native_escrow.rs)
- [Python طرق عميل الضمان عند نسخة الكود المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/src/iroha_python/client.py)
- [Kotodama نموذج الضمان الأصلي عند نسخة الكود المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/native_escrow.ko)
- [حساب ضمان للأصل الأصلي](/ar/blockchain/escrow.md)
- [الأصول القابلة للاستبدال](./fungible-assets.md)
- [الأذونات والأدوار](./permissions-and-roles.md)
