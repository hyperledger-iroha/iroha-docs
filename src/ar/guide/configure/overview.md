---
translation_locale: ar
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# التكوين والإدارة {#configuration-and-management}

Iroha التكوين لديه طبقتين مؤكدة:

- **التكوين المحلي للقران والعميل**, مخزنة في TOML الملفات والقراءة في
  بدء العملية
- **تكوين السلسلة**, تغيرت من خلال المعاملات
  [`SetParameter`](/ar/blockchain/instructions.md#setparameter)

استخدام التكوين المحلي لتحديد هوية العقدة والعناوين وتسجيل السجلات والتخزين
مفاتيح توقيع العميل. استخدم تكوين السلسلة للقيم التي يجب الاتفاق عليها
من خلال الشبكة ويتم إعادة تشغيلها بشكل محدد

يجب أن يأتي سلوك الإنتاج من هذه الطبقات التكوينية
قد تكون المتغيرات مناسبة لتزويد المدخلات الاختبارية للأدوات المحلية، ولكن
أنها ليست بوابات ميزة الإنتاج ولا تحل محل الملتزمين
التكوين.

نقاط الدخول الرئيسية للتكوين هي:

- [التكوين](/ar/guide/configure/genesis.md)
- [تكوين العميل](/ar/guide/configure/client-configuration.md)
- [مفاتيح تنفيذ الشبكة](/ar/guide/configure/keys-for-network-deployment.md)
- [يجري على المعادن العارية](/ar/guide/advanced/running-iroha-on-bare-metal.md)
- [إشارة تشكيل الأقران](/ar/reference/peer-config/index.md)
