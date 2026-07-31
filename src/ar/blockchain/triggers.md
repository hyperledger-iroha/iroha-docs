---
translation_locale: ar
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# محفزات {#triggers}

أسباب التشغيل تربط مرشح الأحداث بعمل يمكن تنفيذه. عندما تتطابق أحداث
مرشح الزناد Iroha تقييم عمل الزناد كجزء من الحلقة
الإعدام

## الهيكل {#structure}

شركة مسجلة `Trigger` يحتوي على:

- `id`: (أ) `TriggerId` تغليف a `Name`
- `action`: سياسة التكرار وسياسة الإعادة المحاولة
  و البيانات المتعددة

وتتضمن هذه الإجراءات:

- `executable`: `Instructions`, `ContractCall`, `Ivm`, أو `IvmProved`
- `repeats`: `Indefinitely` أو `Exactly(n)`
- `authority`: الحساب الذي يدعو إلى التنفيذ
- `filter`: (أ) `EventFilterBox`
- `retry_policy`: سلوك إعادة المحاولة الاختياري لتحفيزات الوقت المخطط
- `metadata`: البيانات الأساسية المتعلقة بالإنطلاق التعسفي

## مرشحات الأحداث {#event-filters}

تستخدم شروط التشغيل نفس نموذج تصفية الأحداث مثل الاشتراكات.
فلتر الأحداث في المستوى الأعلى يمكن أن يتطابق مع:

- أحداث خط الأنابيب
- أحداث البيانات
- الأحداث الزمنية
- حوادث التنفيذ
- تسبب أحداث الانتهاء

يفضل المرشح الأضيق الذي يتطابق مع سير العمل. المرشحات الواسعة مفيدة
للاختيارات التشخيصية، لكنها تزيد من العمل أثناء تنفيذ الكتل.

انظروا [الصفائح](/ar/blockchain/filters.md) بالنسبة لعائلات الفلتر الحالية.

## أسباب الزمن {#time-triggers}

أجهزة تشغيل الوقت تستخدم مرشح حدث الوقت. عندما يصل منظر حالة العالم إلى
حالة الوقت المماثلة، Iroha تنفيذ خطوة الزناد تحت الزناد
السلطة. أزرار الوقت هي نوع الأزرار التي يمكن استخدام سياسة محاولة إعادة
الموصوفة أدناه.

## التكرار {#repetition}

`Repeats::Indefinitely` يبقي الزناد نشط حتى يتم تسجيله.

`Repeats::Exactly(n)` يسمح للافتاح بإطلاق عدد محدد من المرات
إن استنفدت العدّة، قم بتسجيل محفز جديد إذا كان هناك حاجة إلى نفس السلوك
مرة أخرى.

## السلطة والإذن {#authority-and-permissions}

السلطة الإثارة هي الحساب الذي يستخدم للاستدعاء من التنفيذية.
الحساب الفني المخصص لتحفيزات طويلة الأمد بحيث تتطلب الإذن
تكون صريحة ومعزولة عن حساب المشغل الشخصي.

تحتاج السلطة إلى الإذن المطلوبة من خلال التعليمات القابلة للتنفيذ أو
الدعوة العقدية. الحساب الذي يسجل الزناد يحتاج أيضاً إلى إذن
تسجيل المحفزات تحت مؤكدة الوقت التشغيلي النشط.

## سياسة إعادة المحاولة {#retry-policy}

يمكن لتحفيز الوقت اختيار سياسة إعادة المحاولة. سياسة الإعادة المحاولة تعيين:

- `max_retries`: كم عدد المحاولات التي يسمح بها بعد فشل أول
  إطلاق النار
- `retry_after_ms`: كم من الوقت Iroha ينتظر قبل أن تصبح محاولة جديدة مؤهلة

عندما ينفذ الميزانية لإعادة المحاولة، فإن الزناد غير مسجل.

## الأسئلة {#queries}

استخدم استفسارات الزناد الحالية لتحقق من حالة الزناد:

- [`FindTriggers`](/ar/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/ar/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/ar/reference/queries.md#triggers-contracts-transactions-and-blocks)

انظر أيضاً:

- [مثال أفعال الحدث](/ar/blockchain/trigger-examples.md)
- [الأحداث](/ar/blockchain/events.md)
- [التعليمات](/ar/blockchain/instructions.md)
- [الإذن](/ar/blockchain/permissions.md)
