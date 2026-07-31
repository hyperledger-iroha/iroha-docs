---
translation_locale: ar
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# التكوين والإدارة {#configuration-and-management}

تشكيل Iroha يحتوي على طبقتين مؤثرتين:

- التكوين المحلي للقرابة والعميل، المخزن في ملفات TOML ويقرأ عند بدء العملية.
- تكوين السلسلة المتغيرة من خلال المعاملات عبر [ `SetParameter`](/ar/blockchain/instructions.md#setparameter).

استخدم التكوين المحلي لتحديد هوية العقدة والعناوين وتسجيل السجلات والتخزين ومفاتيح توقيع العميل. استخدم تكوين على سلسلة للقيم التي يجب أن تتفق عليها الشبكة وإعادة تشغيلها بشكل محدد.

يجب أن يأتي سلوك الإنتاج من هذه الطبقات التكوينية. قد تكون المتغيرات البيئية مناسبة لتوفير مدخلات الاختبار إلى الأدوات المحلية، لكنها ليست بوابات ميزات الإنتاج ولا تحل محل التكوين الملتزم.

نقاط الدخول الرئيسية للتكوين هي:

- [التكوين](/ar/guide/configure/genesis.md)
- [تكوين العميل](/ar/guide/configure/client-configuration.md)
- [مفاتيح تنفيذ الشبكة ](/ar/guide/configure/keys-for-network-deployment.md)
- [تعمل على المعادن العارية ](/ar/guide/advanced/running-iroha-on-bare-metal.md)
- [إشارة تشكيل الأقران ](/ar/reference/peer-config/index.md)
