---
translation_locale: ur
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ترتیب دینا {#configuring-iroha}

مقامی ہم مرتبہ ترتیب TOML فائلوں میں مقرر کی جاتی ہے۔ یہ [`SetParameter`](/ur/blockchain/instructions.md#setparameter) ہدایات کے ذریعہ تبدیل کردہ آن لائن ترتیب سے مختلف ہے۔ پیداوار کا رویہ تشکیل فائل یا آن لائن پیرامیٹر میں نمائندگی کیا جانا چاہئے۔ ماحول متغیرات فیچر گیٹس نہیں ہیں۔

ترتیب فائل کے راستے کی وضاحت کرنے کے لئے [`--config`](../irohad-cli#arg-config) CLI دلیل کا استعمال کریں۔

## سانچہ {#template}

ہر پیرامیٹر کی تفصیلی وضاحت کے لیے، براہ کرم [ پیرامیٹرز ](./params.md) حوالہ سے رجوع کریں۔

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## ترتیب فائلوں کی تشکیل {#composing-configuration-files}

TOML ترتیب فائلوں میں ایک اضافی `extends` فیلڈ ہوتا ہے، جو دوسرے TOML فائلوں کی طرف اشارہ کرتا ہے۔ یہ ایک ہی راستہ یا متعدد راستے ہوسکتے ہیں:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha `extends` میں مخصوص تمام فائلوں کو دوبارہ پڑھتا ہے اور انہیں پرتوں میں مرتب کرتا ہے، جہاں پچھلے پیرامیٹر کی سطح پر سابقہ کو اوور رائٹ کرتے ہیں. مثال کے طور پر، اگر پڑھنے `config.toml`:

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

اس کے نتیجے میں تشکیل ہو گی `chain` سے `a.toml`, `max_content_len` سے `b.toml`, اور `torii.address` سے `config.toml` (overwrites) `b.toml`).

## خرابی کا سراغ لگانا {#troubleshooting}

ترتیب کو پڑھنے اور تجزیہ کرنے کے طریقے کا نشان دیکھنے کے لئے [`--trace-config`](../irohad-cli#arg-trace-config) CLI پرچم پاس کریں۔
