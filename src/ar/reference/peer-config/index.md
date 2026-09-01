---
translation_locale: ar
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# تكوين Iroha {#configuring-iroha}

يتم إعداد تكوين النظير في الشبكة المحلية في TOML الملفات. هذا يختلف عن التكوين على السلسلة الذي تم تغييره من خلال [`SetParameter`](/ar/blockchain/instructions.md#setparameter) التعليمات. يجب تمثيل سلوك الإنتاج في تكوين ملف أو معلمة على السلسلة؛ متغيرات البيئة ليست بوابات ميزات.

استخدم [`--config`](../iroha3d-cli#arg-config) CLI حجة لتحديد مسار ملف التكوين.

## نموذج {#template}

للحصول على وصف مفصل لكل معلمة، يرجى الرجوع إلى المرجع [المعلمات](./params.md).

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## كتابة ملفات الإعداد {#composing-configuration-files}

ملفات التكوين TOML تحتوي على حقل إضافي `extends` يشير إلى ملف(ملفات) TOML أخرى. يمكن أن يكون مسارًا واحدًا أو مسارات متعددة:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha سيقوم بقراءة جميع الملفات المحددة في `extends` بشكل متكرر وتجميعها في طبقات، حيث تقوم الطبقات اللاحقة بالكتابة فوق الطبقات السابقة على مستوى المعاملات. على سبيل المثال، إذا تم قراءة `config.toml`:

::: code-group

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

التكوين الناتج سيكون `chain` من `a.toml`، `max_content_len` من `b.toml`، و `torii.address` من `config.toml` (يحل محل `b.toml`).

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

اجتاز [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI علم لرؤية أثر كيفية قراءة التكوين وتحليله.
