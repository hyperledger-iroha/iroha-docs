---
translation_locale: ar
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# تشكيل Iroha {#configuring-iroha}

يتم تعيين تشكيل الأقران المحلي TOML الملفات. هذا يختلف عن التكوين على السلسلة تغيرت من خلال [`SetParameter`](/ar/blockchain/instructions.md#setparameter) التعليمات. يجب أن يتم تمثيل سلوك الإنتاج في ملف تشكيل أو معايير داخل السلسلة. المتغيرات البيئية ليست بوابات الميزة.

استخدم [`--config`](../iroha3d-cli#arg-config) CLI الحجة لتحديد المسار إلى ملف التكوين.

## النموذج {#template}

للحصول على وصف مفصل لكل معايير، يرجى الرجوع إلى [معايير ](./params.md) المرجعية.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## إعداد ملفات التكوين {#composing-configuration-files}

يحتوي ملفات التكوين TOML على حقل إضافي `extends` ، يشير إلى ملفات أخرى TOML. يمكن أن تكون مسارًا واحدًا أو العديد من المسارات:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha سوف تقرأ بشكل متكرر جميع الملفات المحددة في `extends` وتقوم بتجميعها إلى طبقات، حيث تقوم هذه الأخيرة بإعادة كتابة الملفات السابقة على مستوى المعايير. على سبيل المثال، إذا كانت القراءة في `config.toml`:

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

التكوين الناتج سيكون `chain` من `a.toml`, `max_content_len` من `b.toml`, و `torii.address` من `config.toml` (تم إعادة الكتابة) `b.toml`).

## حل المشاكل {#troubleshooting}

مرر [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI العلامة لرؤية آثار كيفية قراءة التكوين وتحليل.
