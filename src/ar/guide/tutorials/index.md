---
translation_locale: ar
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK الدروس {#sdk-tutorials}

هذه الصفحات تلخيص Iroha 3 نقاط دخول العملاء التي يتم شحنها من المركز الرئيسي
مساحة العمل، بما في ذلك أسماء الحزم القنونيّة، وسلك التثبيت، والحد الأدنى
نقاط البداية

## النظام الموصى به {#recommended-order}

1. [التثبيت Iroha 3](/ar/get-started/install-iroha.md)
2. [إطلاق Iroha 3](/ar/get-started/launch-iroha.md)
3. اختر واحدة SDK:
   - [Rust](/ar/guide/tutorials/rust.md)
   - [Python](/ar/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/ar/guide/tutorials/javascript.md)
   - [Kotlin, Android, والجافا](/ar/guide/tutorials/kotlin-java.md)
   - [Swift و (iOS)](/ar/guide/tutorials/swift.md)
4. مراجعة [تطبيقات العينة](/ar/guide/tutorials/sample-apps.md) عندما تريد
   إشارة كاملة لتطبيق العميل.
5. الاستخدام [مدمج Kaigi](/ar/guide/tutorials/kaigi.md) عندما تريد إضافة
   إجتماعات صوتية / فيديو مدعومة محفظة إلى تطبيقك الخاص.
6. الاستخدام [Musubi الحزم](/ar/guide/tutorials/musubi.md) عندما تحتاج إلى إعادة استخدامها
   Kotodama المكتبات المصدرة مع الاعتمادات على السلسلة التسجيلية.

## العينات {#samples}

يحتوي مساحة العمل في الأعلى من التيار على JavaScript وصفات و Swift نموذج iOS
للمشاريع Android, تبدأ Kotlin SDK الوحدات واختباراتها.

- [استعراض نموذج التطبيقات](/ar/guide/tutorials/sample-apps.md)
- [مدمج Kaigi في JavaScript التطبيق](/ar/guide/tutorials/kaigi.md)

## مصدر الحقيقة {#source-of-truth}

جميعهم SDK الصفحات هنا مشتقة من مساحة العمل السابقة الحالية:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (جافا المرآة من Kotlin- أولاً Android السطح)
- `IrohaSwift`
- `crates/musubi`

عندما تكون في شك، تفضل README و البيانات المتعلقة بالحزم في تلك المجلات؛
أنها تصف مراجعة المصدر التي تقوم ببناءها
