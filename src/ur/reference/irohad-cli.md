---
translation_locale: ur
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` ایک Iroha 3 ہم مرتبہ ڈیمون شروع.

```shell
irohad --config path/to/config.toml
```

## `--config`  {#arg-config}

- قسم: فائل کا راستہ
- عرفان: `-c`

[ ترتیب فائل ](/ur/reference/peer-config/index.md) کا راستہ۔

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- قسم: فائل کا راستہ

جینیس مینفیس JSON فائل کے لئے اختیاری راستہ۔ اس کا استعمال کریں جب تعیناتی Kagami کی طرف سے پیدا کردہ مینفیس کے خلاف اسٹارٹ اپ کی توثیق کرتی ہے۔

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

ترتیب کی پڑھنے اور تجزیہ کے ٹریس لاگ کو قابل بناتا ہے۔ یہ ترتیب میں خرابیوں کا سراغ لگانے کے لئے مفید ثابت ہوسکتا ہے۔

- ٹائپ: پرچم
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- قسم: بولین، `--terminal-colors=false` یا `--terminal-colors=true`
- ڈیفالٹ: آٹو ڈٹیکشن ٹرمینل سپورٹ
- ENV: `TERMINAL_COLORS`

ANSI رنگ کی پیداوار کو چالو کرنے یا نہیں کرنا۔

ڈیفالٹ کے طور پر، Iroha کا تعین کرتا ہے کہ ٹرمینل رنگ آؤٹ پٹ کی حمایت کرتا ہے یا نہیں.

واضح طور پر رنگوں کو غیر فعال کرنے کے لئے:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- ٹائپ: تار

ڈییمون پیغامات کے لئے استعمال کردہ سسٹم کی زبان کو نظر انداز کریں.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- ٹائپ: پرچم

SoraFS کے لئے سورا Nexus فیچر پروفائل ، SoraNet ہینڈشےپ اور کثیر لین اتفاق رائے فلو کو فعال کریں۔

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- قسم: `auto`، `cpu`، یا `gpu`

FASTPQ پروور عملدرآمد موڈ کو اووررائڈ کریں۔

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- قسم: `auto`، `cpu`، یا `gpu`

FASTPQ Poseidon پائپ لائن موڈ کو اووررائڈ کریں.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- ٹائپ: تار

FASTPQ ٹیلی میٹری ڈیوائس کلاس لیبل کو منسوخ کریں۔

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- ٹائپ: تار

FASTPQ ٹیلی میٹری چپ فیملی لیبل کو منسوخ کریں۔

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- ٹائپ: تار

FASTPQ ٹیلی میٹری GPU قسم کے لیبل کو نظرانداز کریں۔

```shell
irohad --fastpq-gpu-kind integrated
```
