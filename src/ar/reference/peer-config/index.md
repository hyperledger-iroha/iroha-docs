---
translation_locale: ar
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# التشغيل Iroha {#configuring-iroha}

يتم تعيين تشكيل الأقران المحلي في TOML ملفات، هذا مختلف عن سلسلة
التكوين تغير من خلال [`SetParameter`](/ar/blockchain/instructions.md#setparameter)
التعليمات. يجب أن يتم تمثيل سلوك الإنتاج في ملف تشكيل
أو معايير على السلسلة؛ متغيرات البيئة ليست بوابات الميزة.

الاستخدام [`--config`](../irohad-cli#arg-config) CLI الحجة لتحديد المسار إلى ملف التكوين.

## النموذج {#template}

للحصول على وصف مفصل لكل معايير، يرجى الرجوع إلى: [المعايير](./params.md) الإشارة

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## إعداد ملفات التكوين {#composing-configuration-files}

TOML ملفات التكوين لديها إضافية `extends` المجال، يشير إلى غيرها TOML يمكن أن يكون مسار واحد أو
طرق متعددة:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha سيتم قراءة جميع الملفات المحددة في `extends` " وترتيبها " أي القرآن " طبقاتاً " من المخلوقات " حيث يكتبون آخرون " في الآخرة .
القواعد السابقة على مستوى المعايير. على سبيل المثال، إذا قراءة `config.toml`:

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

The التكوين الناتج سيكون `chain` من `a.toml`, `max_content_len` من `b.toml`, و `torii.address` من
`config.toml` (تكتيبات) `b.toml`).

## حل المشاكل {#troubleshooting}

مرسلة [`--trace-config`](../irohad-cli#arg-trace-config) CLI العلامة لرؤية آثار كيفية قراءة التكوين وتحليل.
