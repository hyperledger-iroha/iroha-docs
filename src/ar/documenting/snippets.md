---
translation_locale: ar
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# مقطوعات الرمز {#code-snippets}

يحتفظ المقطوعات التي يتم إنشاؤها بأمثلة مرتبطة بالرمز والتكوين والخطط من إصدار Iroha الذي أنتجه.

## القطع الأثرية المتجددة Iroha {#refreshing-iroha-artifacts}

يتم التحقق من المقطوعات المستمدة من Iroha بحيث لا تتطلب بناء مواقع عادي الوصول إلى الشبكة أو مخزن شقيق. قم بتجديدها صراحة:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

المسجلين [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) تدفق العمل يتحقق من التحقق من المصدر النظيف مقابل `provenance/iroha.json`, يتجدد `/src/snippets` و Torii OpenAPI صورة سريعة، وتحديثات SHA-256 تغييرات المحتوى والإصدار معا. تركيب الاعتماد العادي و VitePress تستهلك الملفات المسجلة دون الحصول على فرع قابل للتغيير.

## بما في ذلك المقطوعات {#including-snippets}

استخدم [VitePress صيغة اقتباسات الشفرة ](https://vitepress.dev/guide/markdown#import-code-snippets) لإدراج المصدر المولود أو المحلي:

```md
<<< @/snippets/client.template.toml
```

يمكن إدراج منطقة رمزية مسمومة عن طريق إضافة اسم المنطقة:

```md
<<< @/example_code/lorem.rs#ipsum
```

الحفاظ على الأمثلة المكتوبة يدوياً صغيرة. تفضل الأدوات المصدرية المتجددة للواجهات العامة، وشكلات التكوين، والخطط التي تم إنشاؤها، وإصدار الأوامر.
