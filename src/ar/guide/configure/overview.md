---
translation_locale: ar
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# التكوين والإدارة {#configuration-and-management}

تحتوي إعدادات Iroha على طبقتين سلطويتين:

- تهيئة نظير الشبكة المحلية والعميل، مخزنة في ملفات TOML وتقرأ عند بدء العملية
- تكوين على السلسلة، يتم تغييره بواسطة المعاملات من خلال [`SetParameter`](/ar/blockchain/instructions.md#setparameter)

استخدم التكوين المحلي لهوية العقدة والعناوين والسجلات والتخزين ومفاتيح توقيع العميل. استخدم التكوين على السلسلة للقيم التي يجب أن يوافق عليها الشبكة وإعادة تشغيلها بشكل حتمي.

يجب أن يأتي سلوك الإنتاج من هذه الطبقات التكوينية. قد تكون متغيرات البيئة ملائمة لتوفير مدخلات الاختبار للأدوات المحلية، لكنها ليست بوابات ميزات للإنتاج ولا تحل محل التكوين المثبت.

نقاط الدخول الرئيسية للتكوين هي:

- [الكتلة الأولى في سلسلة الكتل](/ar/guide/configure/genesis.md)
- [تكوين العميل](/ar/guide/configure/client-configuration.md)
- [مفاتيح نشر الشبكة](/ar/guide/configure/keys-for-network-deployment.md)
- [التشغيل على المعدات الصلبة](/ar/guide/advanced/running-iroha-on-bare-metal.md)
- [مرجع تكوين نظير الشبكة](/ar/reference/peer-config/index.md)
