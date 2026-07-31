---
translation_locale: ar
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# مقاطع الرمز {#code-snippets}

يحتفظ المقطوعات التي يتم إنشاؤها بأمثلة مرتبطة بالرمز والتشكيل والخطط من
الموقع Iroha المراجعة التي أنتجتها

## الرفاهية Iroha القطع الأثرية {#refreshing-iroha-artifacts}

Irohaيتم التحقق من المقطوعات المستمدة بحيث لا يتطلب بناء مواقع عادي
إمكانية الوصول إلى الشبكة أو مستودع الأخوة. قم بتحديثها صراحة:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

المتسجلين
[`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts)
تدفق العمل يؤكد التحقق من الصادر النظيف مقابل `provenance/iroha.json`,
يتجدد `/src/snippets` و Torii OpenAPI صورة سريعة، وتحديثات SHA-256
تغييرات المحتوى والمصدر معا. الاعتماد الطبيعي
التثبيت VitePress تستهلك الملفات المسجلة بدون
احضار فرع متحول

## بما في ذلك المقطوعات {#including-snippets}

استخدم
[VitePress النقاشات من الشفرة](https://vitepress.dev/guide/markdown#import-code-snippets)
لتشمل المصدر المولد أو المحلي:

```md
<<< @/snippets/client.template.toml
```

يمكن إدراج منطقة رمزية مسموح بها عن طريق إضافة اسم منطقتها:

```md
<<< @/example_code/lorem.rs#ipsum
```

الحفاظ على الأمثلة المكتوبة يدوياً صغيرة. تفضل الأدوات المتجددة للمصدر العام
واجهات، قوالب التشغيل، والخطط المولدة، ومخرج الأوامر.
