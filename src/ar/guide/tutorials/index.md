---
translation_locale: ar
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# SDK دروس {#sdk-tutorials}

تلخص هذه الصفحات نقاط دخول العميل Iroha 3 الموزعة من مساحة العمل الرئيسية، بما في ذلك أسماء الحزم القياسية، ومسارات التثبيت، ونقاط البداية الحد الأدنى.

## الترتيب الموصى به {#recommended-order}

1. [تثبيت Iroha 3](/ar/get-started/install-iroha.md)
2. [إطلاق Iroha 3](/ar/get-started/launch-iroha.md)
3. اختر SDK:
   - [Rust](/ar/guide/tutorials/rust.md)
   - [Python](/ar/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/ar/guide/tutorials/javascript.md)
   - [Kotlin، Android، وجافا](/ar/guide/tutorials/kotlin-java.md)
   - [Swift و iOS](/ar/guide/tutorials/swift.md)
4. راجع [تطبيقات تجريبية](/ar/guide/tutorials/sample-apps.md) عندما تريد مرجعًا كاملًا لتطبيق العميل.
5. استخدم [تضمين Kaigi](/ar/guide/tutorials/kaigi.md) عندما تريد إضافة اجتماعات صوتية/مرئية مدعومة بالمحفظة إلى تطبيقك الخاص.
6. استخدم [Musubi الحزم](/ar/guide/tutorials/musubi.md) عندما تحتاج إلى مكتبات مصدرية قابلة لإعادة الاستخدام Kotodama مع تبعيات مسجلة على السلسلة مثبتة.

## عينات {#samples}

يحتوي مساحة العمل العليا على وصفات JavaScript ومشاريع عينة Swift/iOS. بالنسبة لـ Android، ابدأ بوحدات Kotlin SDK الخاصة بها واختباراتها.

- [نظرة عامة على التطبيقات التجريبية](/ar/guide/tutorials/sample-apps.md)
- [تضمين Kaigi في تطبيق JavaScript](/ar/guide/tutorials/kaigi.md)

## مصدر الحقيقة {#source-of-truth}

جميع صفحات SDK هنا مستمدة من مساحة العمل العليا الحالية:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (المرآة الجافا للسطح Android-الأول من Kotlin)
- `IrohaSwift`
- `crates/musubi`

عند الشك، فضّل README وبيانات حزم البرمجيات في تلك الدلائل؛ فهي تصف نسخة المصدر التي تقوم ببنائها.
