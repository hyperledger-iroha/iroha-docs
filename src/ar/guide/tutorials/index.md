---
translation_locale: ar
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK دروس {#sdk-tutorials}

هذه الصفحات تلخص نقاط دخول العميل Iroha 3 التي يتم إرسالها من مساحة العمل الرئيسية، بما في ذلك أسماء الحزم التقليدية وسبل التثبيت ونقاط بداية ضئيلة.

## النظام الموصى به {#recommended-order}

1. [التثبيت Iroha 3](/ar/get-started/install-iroha.md)
2. [الإطلاق Iroha 3](/ar/get-started/launch-iroha.md)
3. اختر SDK:
   - [Rust](/ar/guide/tutorials/rust.md)
   - [Python](/ar/guide/tutorials/python.md)
   - [JavaScript /TypeScript ](/ar/guide/tutorials/javascript.md)
   - [Kotlin، Android، وجافا](/ar/guide/tutorials/kotlin-java.md)
   - [Swift و iOS](/ar/guide/tutorials/swift.md)
4. مراجعة تطبيقات نموذج [](/ar/guide/tutorials/sample-apps.md) عندما تريد مرجعًا كاملًا لتطبيق العميل.
5. استخدم [Embed Kaigi](/ar/guide/tutorials/kaigi.md) عندما ترغب في إضافة اجتماعات صوتية/فيديو مدعومة محفظة إلى تطبيقك.
6. استخدم حزم [Musubi](/ar/guide/tutorials/musubi.md) عندما تحتاج إلى مكتبات مصدر Kotodama قابلة لإعادة الاستخدام مع اعتمادات سجل متصلة بالسلسلة.

## العينات {#samples}

يحتوي مساحة العمل السابقة على وصفات JavaScript ومشاريع عينة Swift/iOS. بالنسبة إلى Android، ابدأ بمودولات Kotlin SDK واختباراتها.

- [استعراض نموذج من التطبيقات](/ar/guide/tutorials/sample-apps.md)
- [إدماج Kaigi في تطبيق JavaScript ](/ar/guide/tutorials/kaigi.md)

## مصدر الحقيقة {#source-of-truth}

جميع الصفحات SDK هنا مشتقة من مساحة العمل السابقة الحالية:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (مرآة جاوا لسطح Kotlin - الأول Android)
- `IrohaSwift`
- `crates/musubi`

عندما تكون في شك، تفضل README والحزمة البيانات الأساسية في تلك الإرشادات؛ فإنها تصف مراجعة المصدر التي تقوم ببناءها.
