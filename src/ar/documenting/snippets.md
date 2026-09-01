---
translation_locale: ar
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# مقتطفات الشيفرة {#code-snippets}

تُبقي المقاطع المُولَّدة الأمثلة مرتبطة بالشيفرة والتكوين والمخططات من النسخة Iroha التي أنتجتها.

## تحديث التحف Iroha {#refreshing-iroha-artifacts}

يتم التحقق من المقاطع المستمدة من Iroha حتى لا تتطلب عمليات بناء الموقع العادية الوصول إلى الشبكة أو مستودع شقيق. قم بتحديثها صراحة:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

يتحقق سير العمل `etc/refresh-iroha.ts` المُسجَّل من نظافة عملية استخراج المصدر مقابل `provenance/iroha.json`، ويُعيد توليد `/src/snippets` و Torii OpenAPI عرض البيانات عند نقطة زمنية معينة، وتقوم بتحديث SHA-256 التجزئات التشفيرية. راجع التغييرات في المحتوى والأصل معًا. تثبيت الاعتمادات العادي و VitePress الإنشاءات تستخدم الملفات المدرجة بدون جلب فرع قابل للتغيير.

## بما في ذلك المقاطع {#including-snippets}

استخدم [VitePress تركيب شيفرة مقتطف](https://vitepress.dev/guide/markdown#import-code-snippets) لتضمين المصدر المُنشأ أو المحلي:

```md
<<< @/snippets/client.template.toml
```

يمكن تضمين منطقة رمز مسماة عن طريق إلحاق اسم المنطقة الخاص بها:

```md
<<< @/example_code/lorem.rs#ipsum
```

حافظ على الأمثلة المكتوبة بخط اليد صغيرة. فضل الحصول على المواد المصدرية المحدثة للواجهات العامة، قوالب التكوين، المخططات المولدة، ومخرجات الأوامر.
