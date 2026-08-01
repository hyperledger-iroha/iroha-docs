---
translation_locale: ar
translation_source: /cookbook/native-escrow.md
translation_source_hash: 0185b6a341ee90ed6cd52fb9f510549b20592468abe6627d3efa639c3b67d1fd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الاحتفاظ بالأصول الأصلية {#native-asset-escrow}

## النتيجة {#outcome}

اختر بين الاحتفاظ بالسوق و قفل الأصول المرتبطة بالمقصود، قم بتنفيذ دورة الحياة الحالية التي تم تطبيقها مع Rust أو Python, ربط كل مقفل حاول مرة أخرى إلى المبلغ المتبقي الذي لاحظته في الواقع، وتجميع الأصلي Kotodama سطح الائتمانات من JavaScript.

## الشروط المسبقة {#prerequisites}

- تعريف أصول رقمية ومفتاح/بائع يملك كمية كافية.
- عملاء I105 الممولون بمفتاح واحد لكل طرف يقدم خطوة. استخدم نية `fee_payment` مدفوعة من قبل السلطة مباشرة تتطابق أصول الرسوم مع استجابة الصنبور الحالية Taira ؛ لا تضمين أصول ID من الوثائق.
- الحالي Rust أو Python SDK من Iroha الالتزام `bc7114ed1c7f265a156d2100ff09e851cc95702c`.
- من أجل JavaScript نموذج المجمع، Node.js 24 بالإضافة إلى إصدار محلي `@iroha/iroha-js` الحزمة ومصدرها `iroha_js_host`; اتبعوا [JavaScript SDK إعداد بناء المصدر](/ar/guide/tutorials/javascript.md#build-from-source). يجب أن توفر بناءات المتصفح `compilerUrl` بدلاً من تحميل المضيف الأصلي.
- يجب على Taira الاعتراف بإرشادات نقل الأصول والاحتفاظ بها. يمكن لأصحاب الأصول استخدام دورة الحياة العادية عندما تسمح سياسة الأصول الخاصة بهم بذلك؛ يحتاج حل النزاع إلى إذن عالمي `CanResolveEscrowDispute`. استخدم شبكة محلية تم إنشاؤها عندما لا توجد سلطة الشبكات العامة المطلوبة .

نماذج الاحتفاظ بالسوق البائع والمشتري ودفع خارج السلسلة والإفراج. القفلات العامة تسمي وجهة وإخيارًا سلطة إفراج متميزة؛ فإنها تدعم السحب الجزئي والإلغاء والانتهاء من الصلاحية.

## الخطوات {#steps}

### 1 - إكمال الاحتفاظ بالسوق باستخدام Rust . {#_1-complete-a-marketplace-escrow-with-rust}

تتلقى هذه الوظيفة النسخة الحقيقية IDs والعملاء. فتحت 40 وحدة، وتسمح للمشتري بقبول وتسجيل الدفع خارج السلسلة، ثم تتيح للبائع إطلاق الاحتفاظ بها. كل تقديم يسمى مدفوع رسوم السلطة من خلال `FeePaymentIntent`.

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

يتم إدارة حساب الاحتفاظ به من خلال دفتر التسجيل. منح رمز نقل الأصول العادي لا يجعل الاحتفاض النشط قابلاً للاستفادة منه خارج دورة حياة الاحتفال.

### 2 - افتح وتسحب قفل عام جزئيًا بواسطة Python {#_2-open-and-partially-draw-a-generic-lock-with-python}

تقوم هيئة الإفراج باستكشاف السجل الأصلي الموقّع قبل التسجيل. إن تمرير هذا `remaining_amount` الدقيق يوفر تناغمًا متفائلًا: يتم رفض طلب متوازي قديم بدلاً من فرض الحجز مرتين.

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

يمكن أن يسأل Python SDK تلقائيًا عندما يتم حذف `expected_remaining_amount` ، ولكن إعطاء القيمة الملاحظة يجعل الشرط الاقتصادي الموقع مرئيًا في رمز التطبيق.

بالنسبة لتدفقات القفل Rust ، يتطلب البناءات الحالية أيضًا المبلغ الملاحظ:

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

`DrawdownAssetLock::new` يأخذ ثلاثة قيم؛ `CancelAssetLock::new` يأخذ اثنين. إبعاد المبلغ المتوقع المتبقي يصف شكل مكالمة قديم وغير آمن.

### 3 - قم بتجميع سطح الاحتفاظ Kotodama من JavaScript {#_3-compile-the-kotodama-escrow-surface-from-javascript}

لا يحتاج JavaScript إلى اختراع تعليمات محلية غير مصنفة. يقوم المكوّم الحالي بتعريض الاحتفاظ بالداخلات في الكتيب الأساسي لـ Kotodama؛ التنفيذ والمكالمات تتبع بعد ذلك [بناء ونشر عقد ذكي](./smart-contracts.md).

احتفظ بهذا ك `native_escrow.ko`:

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

حفظ ما يلي على `compile-native-escrow.mjs` واستخدامها لجمع المصدر الدقيق من Node.js:

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

قم بتشغيله من بيئة الحزمة المصممة الموصوفة في المتطلبات السابقة:

```bash
node ./compile-native-escrow.mjs
```

## التحقق {#verify}

بالنسبة إلى الاحتفاظ بالأسواق، استفسار `FindAssetEscrowById` وحفظ أصول الطرفين بعد الإفراج. يجب أن يكون السجل `Released` ، وتسمية المشتري المقبول ، ولا تظهر أي حجز متبقي. بالنسبة لقفل Python أعلاه ، احتفظ ب ID المستردة وكرر الاستفسار الموقع:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

أيضا استبيان الحفاظ على الأصول في الوجهة وتأكيد أنها زادت بأربع وحدات. وصفة معاملة دون سجل الاحتفاظ والحالة بعد الوجهة هي التحقق غير الكامل.

## حل المشاكل {#troubleshooting}

- `Not permitted` أثناء فتحها عادة ما يعني أن السلطة لا تستطيع نقل الأصول المختارة إلى الاحتفاظ بها. حل النزاعات لديه بوابة عالمية منفصلة `CanResolveEscrowDispute`.
- إن رفض `expected remaining amount` هو صراع بين التفاؤل والتنافسية. استرجع السجل، وقرر ما إذا كان الهدف الآخر من سحب / إلغاء، وتوقيع تعليمات جديدة فقط إذا كانت الحالة الجديدة مقبولة.
- فقط سلطة الإفراج المكوّنة يمكن أن ترسم قفلًا موثوق به. لا يستطيع الوجهة إفراغها ببساطة لأنه سيحصل على الأموال.
- الإفراج عن السوق صالح فقط بعد قبول الدفع وإرسال الدفع؛ إلغاء التسجيل يقتصر على حالات دورة الحياة السابقة.
- تستخدم إنتهاء الصلاحية وقت الكتيب السريع. لا تعتبر توقيت الحائط المحلي كدليل على أن `ExpireAssetLock` سوف يمر
- الفشل في دفع الرسوم ينتمي إلى الطرف الذي يقدم هذه الخطوة في دورة الحياة. المشتري للصندوق، البائع/المفتوح، والسلطة الإفراج بشكل مستقل على Taira.

## المصدر والوثائق ذات الصلة {#source-and-related-docs}

- [نموذج تعليمات الاحتفاظ بالأمانة الأصلية عند التزامات المحمولة](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/isi/escrow.rs)
- [اختبارات تكامل الاحتفاظ الأصلي في الالتزامات المثبتة ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/native_escrow.rs)
- [Python أساليب العميل الاحتفظي عند التزامات المثبتة](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama عينة الاحتفاظ الأساسي عند التزامن المحدد](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [الاحتفاظ بالأصول الأصلية ](/ar/blockchain/escrow.md)
- [الأصول المثقلة ](./fungible-assets.md)
- [الترخيصات والأدوار ](./permissions-and-roles.md)
